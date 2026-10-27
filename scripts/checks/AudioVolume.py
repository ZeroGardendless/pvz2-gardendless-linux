"""Measure WebKit's real output without changing the user's audio devices.

Compile WebKitAudio.c first and pass its path. The temporary null sink receives
only this test's tone and is removed even if a check fails.
"""
import array
import math
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time

if len(sys.argv) < 2:
    raise SystemExit("Usage: AudioVolume.py <WebKitAudio binary> or --native <test command...>")

sink = f"gardendless_audio_check_{os.getpid()}"
module = subprocess.check_output([
    "pactl", "load-module", "module-null-sink", f"sink_name={sink}",
    "rate=48000", "channels=1", "channel_map=mono",
], text=True).strip()
recorder = None
browser = None
try:
    with tempfile.TemporaryDirectory(prefix="gardendless-audio-") as directory:
        recording = Path(directory) / "output.raw"
        with recording.open("wb") as output:
            began = time.monotonic()
            recorder = subprocess.Popen([
                "parec", f"--device={sink}.monitor", "--format=float32le",
                "--rate=48000", "--channels=1",
            ], stdout=output)
            environment = {**os.environ, "PULSE_SINK": sink, "WEBKIT_DISABLE_DMABUF_RENDERER": "1"}
            command = sys.argv[1:] if '--native' in sys.argv else ["xvfb-run", "-a", sys.argv[1], "AudioVolumeSmoke.html"]
            if '--native' in command: command.remove('--native')
            browser = subprocess.Popen(command, env=environment, stdout=subprocess.PIPE, text=True)
            phases = []
            for line in browser.stdout:
                print(line.strip(), flush=True)
                if line.startswith("PHASE:"):
                    phases.append((float(line.split(":")[1]), time.monotonic() - began))
            if browser.wait() != 0:
                raise RuntimeError("WebKit volume check failed")
            recorder.terminate()
            recorder.wait(timeout=10)
        samples = array.array("f")
        samples.frombytes(recording.read_bytes())
        if sys.byteorder != "little":
            samples.byteswap()
        levels = []
        for volume, start in phases:
            window = samples[int((start + 0.5) * 48000):int((start + 1.5) * 48000)]
            if not window:
                raise RuntimeError("No recorded samples for a volume phase")
            rms = math.sqrt(sum(sample * sample for sample in window) / len(window))
            levels.append(rms)
            print(f"Volume {volume:.1f}: measured RMS {rms:.6f}")
        assert len(levels) == 7 and levels[0] > 0.01, "The test output was silent"
        for volume, rms in zip([0.8, 0.4, 0.1, 0, 0.1, 0.4, 0.8], levels):
            assert abs(rms / levels[0] - volume / 0.8) < 0.08, "Output gain reversed or differed from requested gain"
        print("PASS: recorded output follows volume in both directions and reaches silence.")
finally:
    for process in [browser, recorder]:
        if process is not None and process.poll() is None:
            process.terminate()
            process.wait(timeout=10)
    subprocess.run(["pactl", "unload-module", module], check=True)
