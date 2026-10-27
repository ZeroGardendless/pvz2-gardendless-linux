//! One PulseAudio/PipeWire output stream. Decoding and mixing never run on GTK.
//! Windows retains its browser's Web Audio backend.
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    io::Cursor,
    sync::{mpsc, Arc, Mutex, Weak},
    thread,
};
use symphonia::core::{
    audio::SampleBuffer, codecs::DecoderOptions, errors::Error, formats::FormatOptions,
    io::MediaSourceStream, meta::MetadataOptions, probe::Hint,
};
use tauri::{Emitter, Manager, WebviewWindow};
mod output;
const CACHE_LIMIT: usize = 256 * 1024 * 1024;
const CLIP_LIMIT: usize = 256 * 1024 * 1024;
const RATE: u32 = 48000;
#[derive(Clone)]
struct Clip {
    samples: Vec<f32>,
    rate: u32,
    channels: usize,
}
impl Clip {
    fn frames(&self) -> usize {
        self.samples.len() / self.channels
    }
    fn duration(&self) -> f64 {
        self.frames() as f64 / self.rate as f64
    }
}
fn decode(bytes: Vec<u8>) -> Result<Clip, String> {
    let source = MediaSourceStream::new(Box::new(Cursor::new(bytes)), Default::default());
    let mut format = symphonia::default::get_probe()
        .format(
            &Hint::new(),
            source,
            &FormatOptions {
                // Some bundled Xing/LAME tags report padding longer than their
                // entire duration. Avoid demuxer's unchecked gapless subtraction;
                // trim valid padding ourselves after decoding actual frames.
                enable_gapless: false,
                ..Default::default()
            },
            &MetadataOptions::default(),
        )
        .map_err(|e| e.to_string())?
        .format;
    let track = format.default_track().ok_or("No audio track")?;
    let track_id = track.id;
    let delay = track.codec_params.delay.unwrap_or(0) as usize;
    let padding = track.codec_params.padding.unwrap_or(0) as usize;
    let mut decoder = symphonia::default::get_codecs()
        .make(&track.codec_params, &DecoderOptions::default())
        .map_err(|e| e.to_string())?;
    let mut clip = Clip {
        samples: Vec::new(),
        rate: 0,
        channels: 0,
    };
    loop {
        let packet = match format.next_packet() {
            Ok(p) => p,
            Err(Error::IoError(e)) if e.kind() == std::io::ErrorKind::UnexpectedEof => break,
            Err(e) => return Err(e.to_string()),
        };
        if packet.track_id() != track_id {
            continue;
        }
        let audio = match decoder.decode(&packet) {
            Ok(audio) => audio,
            // A few game MP3s begin inside the bit reservoir; resynchronize
            // at the next frame, as streaming decoders do, instead of losing
            // the entire effect. If no valid frames remain, use media fallback.
            Err(Error::DecodeError(_)) => continue,
            Err(error) => return Err(error.to_string()),
        };
        let spec = *audio.spec();
        if clip.rate == 0 {
            clip.rate = spec.rate;
            clip.channels = spec.channels.count();
        }
        if spec.rate != clip.rate || spec.channels.count() != clip.channels {
            return Err("Audio format changes mid-stream".into());
        }
        let mut buffer = SampleBuffer::<f32>::new(audio.capacity() as u64, spec);
        buffer.copy_interleaved_ref(audio);
        if (clip.samples.len() + buffer.len()) * 4 > CLIP_LIMIT {
            return Err("Decoded clip exceeds 256 MiB".into());
        }
        clip.samples.extend_from_slice(buffer.samples());
    }
    if clip.rate == 0 || !(1..=2).contains(&clip.channels) || clip.frames() == 0 {
        return Err("Expected nonempty mono/stereo audio".into());
    }
    if delay + padding < clip.frames() {
        clip.samples
            .truncate((clip.frames() - padding) * clip.channels);
        if delay > 0 {
            clip.samples.drain(..delay * clip.channels);
        }
    }
    Ok(clip)
}
#[derive(Default)]
struct Assets {
    cache: HashMap<String, (Arc<Clip>, u64)>,
    bytes: usize,
    clock: u64,
    next: u64,
}
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Prepared {
    clip: u64,
    duration: f64,
    sample_rate: u32,
}
#[derive(Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Update {
    id: u64,
    clip: u64,
    playing: bool,
    volume: f32,
    rate: f64,
    looping: bool,
    position: Option<f64>,
    remove: bool,
}
enum Command {
    Clip(u64, Weak<Clip>),
    Release(u64),
    Update(Vec<Update>),
}
pub struct NativeAudio {
    sender: mpsc::SyncSender<Command>,
    assets: Mutex<Assets>,
}
struct Voice {
    clip: Arc<Clip>,
    position: f64,
    playing: bool,
    volume: f32,
    rate: f64,
    looping: bool,
}
fn mix(voices: &mut HashMap<u64, Voice>, output: &mut [f32], ended: &mut Vec<u64>) {
    output.fill(0.0);
    ended.clear();
    voices.retain(|id, voice| {
        if !voice.playing {
            return true;
        }
        let frames = voice.clip.frames();
        let step = voice.rate * voice.clip.rate as f64 / RATE as f64;
        for stereo in output.chunks_exact_mut(2) {
            if voice.position >= frames as f64 {
                if voice.looping {
                    voice.position %= frames as f64;
                } else {
                    ended.push(*id);
                    return false;
                }
            }
            let index = voice.position as usize;
            let next = if index + 1 < frames {
                index + 1
            } else if voice.looping {
                0
            } else {
                index
            };
            let fraction = (voice.position - index as f64) as f32;
            for (channel, value) in stereo.iter_mut().enumerate() {
                let channel = channel.min(voice.clip.channels - 1);
                let a = voice.clip.samples[index * voice.clip.channels + channel];
                let b = voice.clip.samples[next * voice.clip.channels + channel];
                *value += (a + (b - a) * fraction) * voice.volume;
            }
            voice.position += step;
        }
        true
    });
    // A peak limiter does not boost quiet audio or discard overlapping voices.
    for sample in output {
        *sample = sample.clamp(-1.0, 1.0);
    }
}
impl NativeAudio {
    pub fn start(app: tauri::AppHandle) -> Result<Self, String> {
        let (sender, receiver) = mpsc::sync_channel(1024);
        let (ready_tx, ready_rx) = mpsc::sync_channel(1);
        thread::Builder::new()
            .name("gardendless-mixer".into())
            .spawn(move || {
                let mut output = match output::Output::open() {
                    Ok(value) => {
                        let _ = ready_tx.send(Ok(()));
                        value
                    }
                    Err(error) => {
                        let _ = ready_tx.send(Err(error));
                        return;
                    }
                };
                let mut clips = HashMap::new();
                let mut voices = HashMap::new();
                let mut samples = [0.0; 960]; // Ten milliseconds of stereo audio.
                let mut ended = Vec::new();
                loop {
                    let mut disconnected = false;
                    for _ in 0..1024 {
                        match receiver.try_recv() {
                            Ok(Command::Clip(id, clip)) => {
                                clips.insert(id, clip);
                            }
                            Ok(Command::Release(id)) => {
                                clips.remove(&id);
                            }
                            Ok(Command::Update(updates)) => {
                                for update in updates {
                                    if update.remove {
                                        voices.remove(&update.id);
                                        continue;
                                    }
                                    if !update.playing && !voices.contains_key(&update.id) {
                                        continue;
                                    }
                                    let Some(clip) =
                                        clips.get(&update.clip).and_then(Weak::upgrade)
                                    else {
                                        continue;
                                    };
                                    // Bound pathological mod workloads, with an explicit error event.
                                    if !voices.contains_key(&update.id) && voices.len() >= 512 {
                                        let _ = app.emit_to(
                                            "main",
                                            "native-audio-error",
                                            "Native voice limit exceeded (512)",
                                        );
                                        let _ = app.emit_to(
                                            "main",
                                            "native-audio-ended",
                                            vec![update.id],
                                        );
                                        continue;
                                    }
                                    let voice = voices.entry(update.id).or_insert_with(|| Voice {
                                        clip: clip.clone(),
                                        position: 0.0,
                                        playing: false,
                                        volume: 1.0,
                                        rate: 1.0,
                                        looping: false,
                                    });
                                    if let Some(position) = update.position {
                                        if position.is_finite() {
                                            voice.position = position.max(0.0).min(clip.duration())
                                                * clip.rate as f64;
                                        }
                                    }
                                    voice.playing = update.playing;
                                    voice.volume = if update.volume.is_finite() {
                                        update.volume.clamp(0.0, 1.0)
                                    } else {
                                        0.0
                                    };
                                    voice.rate = if update.rate.is_finite() {
                                        update.rate.clamp(0.0625, 16.0)
                                    } else {
                                        1.0
                                    };
                                    voice.looping = update.looping;
                                }
                            }
                            Err(mpsc::TryRecvError::Empty) => break,
                            Err(mpsc::TryRecvError::Disconnected) => {
                                disconnected = true;
                                break;
                            }
                        }
                    }
                    if disconnected {
                        break;
                    }
                    mix(&mut voices, &mut samples, &mut ended);
                    if !ended.is_empty() {
                        let _ = app.emit_to("main", "native-audio-ended", &ended);
                    }
                    if let Err(error) = output.write(&samples) {
                        let _ = app.emit_to("main", "native-audio-error", error);
                        break;
                    }
                }
            })
            .map_err(|e| e.to_string())?;
        ready_rx
            .recv_timeout(std::time::Duration::from_secs(5))
            .map_err(|e| e.to_string())??;
        Ok(Self {
            sender,
            assets: Mutex::new(Assets::default()),
        })
    }
}
fn require_game(window: &WebviewWindow) -> Result<(), String> {
    if window.label() != "main" {
        return Err("Audio commands are available only in the game".into());
    }
    Ok(())
}
#[tauri::command]
pub fn native_audio_ready(window: WebviewWindow, app: tauri::AppHandle) -> Result<(), String> {
    require_game(&window)?;
    if app.try_state::<NativeAudio>().is_none() {
        return Err("Native audio output unavailable; using media fallback".into());
    }
    Ok(())
}
#[tauri::command]
pub async fn native_audio_prepare(
    window: WebviewWindow,
    app: tauri::AppHandle,
    path: String,
    bytes: Option<Vec<u8>>,
) -> Result<Prepared, String> {
    require_game(&window)?;
    tauri::async_runtime::spawn_blocking(move || {
        let audio = app
            .try_state::<NativeAudio>()
            .ok_or("Native audio unavailable")?;
        let mut assets = audio.assets.lock().map_err(|e| e.to_string())?;
        assets.clock += 1;
        let clock = assets.clock;
        let clip = if let Some((clip, used)) = assets.cache.get_mut(&path) {
            *used = clock;
            clip.clone()
        } else {
            let bytes = match bytes {
                Some(value) if value.len() <= CLIP_LIMIT => value,
                Some(_) => return Err("Compressed audio exceeds 256 MiB".into()),
                None => {
                    if !(path.starts_with("assets/") || path.starts_with("audio/"))
                        || path.split('/').any(|part| part == "..")
                    {
                        return Err("Invalid embedded audio path".into());
                    }
                    app.asset_resolver()
                        .get(path.clone())
                        .ok_or("Embedded audio not found")?
                        .bytes
                }
            };
            let clip = Arc::new(decode(bytes)?);
            let size = clip.samples.len() * 4;
            while assets.bytes + size > CACHE_LIMIT && !assets.cache.is_empty() {
                let oldest = assets
                    .cache
                    .iter()
                    .min_by_key(|(_, (_, used))| *used)
                    .map(|(key, _)| key.clone())
                    .unwrap();
                let removed = assets.cache.remove(&oldest).unwrap();
                assets.bytes -= removed.0.samples.len() * 4;
            }
            assets.bytes += size;
            assets.cache.insert(path, (clip.clone(), clock));
            clip
        };
        assets.next += 1;
        let id = assets.next;
        audio
            .sender
            .try_send(Command::Clip(id, Arc::downgrade(&clip)))
            .map_err(|e| e.to_string())?;
        Ok(Prepared {
            clip: id,
            duration: clip.duration(),
            sample_rate: clip.rate,
        })
    })
    .await
    .map_err(|e| e.to_string())?
}
#[tauri::command]
pub fn native_audio_update(
    window: WebviewWindow,
    app: tauri::AppHandle,
    updates: Vec<Update>,
    release: Vec<u64>,
) -> Result<(), String> {
    require_game(&window)?;
    if updates.len() > 1024 || release.len() > 1024 {
        return Err("Audio command batch exceeds limit".into());
    }
    let audio = app
        .try_state::<NativeAudio>()
        .ok_or("Native audio unavailable")?;
    audio
        .sender
        .try_send(Command::Update(updates))
        .map_err(|e| e.to_string())?;
    for id in release {
        audio
            .sender
            .try_send(Command::Release(id))
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}
#[cfg(test)]
mod tests {
    use super::*;
    fn voice(volume: f32, looping: bool) -> Voice {
        Voice {
            clip: Arc::new(Clip {
                samples: vec![0.5; 960],
                rate: RATE,
                channels: 2,
            }),
            position: 0.0,
            playing: true,
            volume,
            rate: 1.0,
            looping,
        }
    }
    #[test]
    fn overlapping_sounds_and_gain_direction() {
        let mut voices = HashMap::from([(1, voice(0.8, true)), (2, voice(0.4, true))]);
        let mut output = [0.0; 960];
        let mut ended = Vec::new();
        mix(&mut voices, &mut output, &mut ended);
        assert!((output[0] - 0.6).abs() < 1e-6);
        voices.get_mut(&1).unwrap().volume = 0.0;
        voices.get_mut(&2).unwrap().volume = 0.0;
        mix(&mut voices, &mut output, &mut ended);
        assert!(output.iter().all(|v| *v == 0.0));
        assert_eq!(voices.len(), 2);
    }
    #[test]
    fn effects_finish_and_pause_freezes_position() {
        let mut voices = HashMap::from([(1, voice(1.0, false)), (2, voice(1.0, false))]);
        voices.get_mut(&2).unwrap().playing = false;
        let mut output = [0.0; 1920];
        let mut ended = Vec::new();
        mix(&mut voices, &mut output, &mut ended);
        assert_eq!(ended, vec![1]);
        assert_eq!(voices[&2].position, 0.0);
    }
    #[test]
    #[ignore = "requires isolated Pulse sink; run with AudioNativeVolume.py"]
    fn real_output() {
        assert!(
            std::env::var("PULSE_SINK")
                .is_ok_and(|sink| sink.starts_with("gardendless_audio_check_")),
            "Run through AudioVolume.py with an isolated sink"
        );
        use std::io::Write;
        let clip = Arc::new(Clip {
            rate: RATE,
            channels: 1,
            samples: (0..RATE)
                .map(|i| (i as f32 * std::f32::consts::TAU * 440.0 / RATE as f32).sin() * 0.25)
                .collect(),
        });
        let mut output = output::Output::open().unwrap();
        let mut voices = HashMap::from([(
            1,
            Voice {
                clip,
                position: 0.0,
                volume: 0.8,
                rate: 1.0,
                looping: true,
                playing: true,
            },
        )]);
        let mut samples = [0.0; 960];
        let mut ended = Vec::new();
        for volume in [0.8, 0.4, 0.1, 0.0, 0.1, 0.4, 0.8] {
            voices.get_mut(&1).unwrap().volume = volume;
            println!("PHASE: {volume}");
            std::io::stdout().flush().unwrap();
            for _ in 0..200 {
                mix(&mut voices, &mut samples, &mut ended);
                output.write(&samples).unwrap();
            }
        }
        for step in 0..=50 {
            voices.get_mut(&1).unwrap().volume = 0.8 * (1.0 - step as f32 / 50.0);
            mix(&mut voices, &mut samples, &mut ended);
            output.write(&samples).unwrap();
        }
        assert!(samples.iter().all(|v| *v == 0.0));
        println!("RESULT: PASS native pause fade reaches silence in 0.5 seconds");
    }
    #[test]
    #[ignore = "reads bundled game files; run manually"]
    fn decode_bundled_audio() {
        fn collect(root: &std::path::Path, files: &mut Vec<std::path::PathBuf>) {
            for entry in std::fs::read_dir(root).unwrap().flatten() {
                let path = entry.path();
                if path.is_dir() {
                    collect(&path, files);
                } else if path
                    .extension()
                    .is_some_and(|ext| ext == "mp3" || ext == "ogg" || ext == "wav")
                {
                    files.push(path);
                }
            }
        }
        let mut files = Vec::new();
        collect(
            &std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../public/assets"),
            &mut files,
        );
        let mut fallback = 0;
        for file in &files {
            match decode(std::fs::read(file).unwrap()) {
                Ok(clip) => assert!(clip.duration() > 0.0),
                Err(error) if error.contains("exceeds 256 MiB") => {
                    fallback += 1;
                }
                Err(error) => panic!("{}: {error}", file.display()),
            }
        }
        assert!(!files.is_empty());
        println!(
            "Decoded {} bundled audio files; {fallback} oversized clips use media fallback",
            files.len()
        );
    }
    #[test]
    fn sound_heavy_mixing_keeps_every_voice() {
        let mut voices = (0..128).map(|id| (id, voice(0.001, true))).collect();
        let mut output = [0.0; 960];
        let mut ended = Vec::new();
        let began = std::time::Instant::now();
        for _ in 0..100 {
            mix(&mut voices, &mut output, &mut ended);
        }
        assert_eq!(voices.len(), 128);
        assert!(ended.is_empty());
        println!(
            "128 voices: {:?} CPU time for one second of audio",
            began.elapsed()
        );
    }
}
