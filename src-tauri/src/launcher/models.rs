use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Profile {
    pub id: String,
    pub name: String,
    pub gpu: String,
    pub frame_rate: u16,
    pub widescreen: String,
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
            frame_rate: 120,
            widescreen: "none".into(),
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
