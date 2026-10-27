use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Profile {
    pub id: String,
    pub name: String,
    pub gpu: String,
    #[serde(default = "default_window_backend")]
    pub window_backend: String,
    pub frame_rate: u16,
    pub widescreen: String,
    #[serde(default = "default_render_scale")]
    pub render_scale: u16,
    #[serde(default = "default_audio_profile")]
    pub audio_profile: String,
    pub recovery: bool,
    pub js_modding: bool,
    pub world_map_json: bool,
    pub plant_level_system: bool,
    #[serde(default)]
    pub apply_settings: bool,
    #[serde(default)]
    pub updated_at: u64,
}

impl Default for Profile {
    fn default() -> Self {
        Self {
            id: "default".into(),
            name: "Existing save".into(),
            gpu: "auto".into(),
            window_backend: default_window_backend(),
            frame_rate: 120,
            widescreen: "none".into(),
            render_scale: 100,
            audio_profile: default_audio_profile(),
            recovery: false,
            js_modding: false,
            world_map_json: false,
            plant_level_system: false,
            apply_settings: false,
            updated_at: 0,
        }
    }
}

fn default_window_backend() -> String {
    "auto".into()
}

fn default_audio_profile() -> String {
    "balanced".into()
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameEntry {
    pub id: String,
    pub name: String,
    pub version: String,
    pub path: String,
    pub builtin: bool,
    #[serde(default)]
    pub available: bool,
    pub last_played: Option<u64>,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GpuOption {
    pub id: String,
    pub label: String,
    pub vendor: String,
    pub driver: String,
    pub primary: bool,
    pub recommended: bool,
    pub nvidia: bool,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RunningGame {
    pub game_id: String,
    pub profile_id: String,
    pub pid: u32,
    pub started_at: u64,
    pub log_path: String,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LauncherState {
    pub games: Vec<GameEntry>,
    pub profiles: Vec<Profile>,
    pub gpus: Vec<GpuOption>,
    pub running: Option<RunningGame>,
    pub data_dir: String,
    pub platform: String,
    pub distribution: String,
    pub launcher_version: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameContext {
    pub profile: Profile,
    pub open_tab: Option<String>,
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct Library {
    pub schema_version: u32,
    pub games: Vec<GameEntry>,
    pub profiles: Vec<Profile>,
}

impl Default for Library {
    fn default() -> Self {
        Self {
            schema_version: 1,
            games: Vec::new(),
            profiles: vec![Profile::default()],
        }
    }
}

fn default_render_scale() -> u16 {
    100
}
