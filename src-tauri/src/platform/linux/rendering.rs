//! WebKit has a separate 60 FPS preference, independent of Cocos's pacer.
//! Resolve the feature API dynamically so older WebKitGTK can still launch.
use std::ffi::{c_char, c_int, c_void, CStr};
use webkit2gtk::{glib::object::ObjectType, SettingsExt, WebViewExt};

#[link(name = "dl")]
extern "C" {
    fn dlsym(handle: *mut c_void, symbol: *const c_char) -> *mut c_void;
}

pub fn configure(webview: &webkit2gtk::WebView) {
    let Some(settings) = webview.settings() else {
        eprintln!("[Rendering] WebKit settings unavailable");
        return;
    };
    // Game music may start after asynchronous scene loading, outside the click
    // which entered the scene. Web Audio is separately unlocked on user input.
    settings.set_media_playback_requires_user_gesture(false);
    // Settings is held alive, and this runs on the webview's main thread.
    match unsafe { disable_60_fps_preference(settings.as_ptr().cast()) } {
        Ok(()) => eprintln!("[Rendering] WebKit 60 FPS preference disabled; using display refresh"),
        Err(reason) => eprintln!("[Rendering] {reason}"),
    }
}

unsafe fn disable_60_fps_preference(settings: *mut c_void) -> Result<(), &'static str> {
    // These signatures match WebKitFeature.h and WebKitSettings.h (2.42+).
    // RTLD_DEFAULT looks in already linked libraries; no new library is loaded.
    macro_rules! symbol {
        ($name:literal, $signature:ty) => {{
            let pointer = dlsym(std::ptr::null_mut(), concat!($name, "\0").as_ptr().cast());
            if pointer.is_null() {
                return Err(
                    "WebKit feature API unavailable; could not disable its 60 FPS preference",
                );
            }
            std::mem::transmute::<*mut c_void, $signature>(pointer)
        }};
    }
    let all = symbol!(
        "webkit_settings_get_all_features",
        unsafe extern "C" fn() -> *mut c_void
    );
    let length = symbol!(
        "webkit_feature_list_get_length",
        unsafe extern "C" fn(*mut c_void) -> usize
    );
    let get = symbol!(
        "webkit_feature_list_get",
        unsafe extern "C" fn(*mut c_void, usize) -> *mut c_void
    );
    let identifier = symbol!(
        "webkit_feature_get_identifier",
        unsafe extern "C" fn(*mut c_void) -> *const c_char
    );
    let set = symbol!(
        "webkit_settings_set_feature_enabled",
        unsafe extern "C" fn(*mut c_void, *mut c_void, c_int)
    );
    let enabled = symbol!(
        "webkit_settings_get_feature_enabled",
        unsafe extern "C" fn(*mut c_void, *mut c_void) -> c_int
    );
    let unref = symbol!(
        "webkit_feature_list_unref",
        unsafe extern "C" fn(*mut c_void)
    );
    let features = all();
    if features.is_null() {
        return Err("WebKit returned no rendering features");
    }
    let mut result = Err("WebKit does not expose PreferPageRenderingUpdatesNear60FPS");
    for index in 0..length(features) {
        let feature = get(features, index);
        if feature.is_null() {
            continue;
        }
        let name = identifier(feature);
        if !name.is_null()
            && CStr::from_ptr(name).to_bytes() == b"PreferPageRenderingUpdatesNear60FPS"
        {
            set(settings, feature, 0);
            result = if enabled(settings, feature) == 0 {
                Ok(())
            } else {
                Err("WebKit kept its 60 FPS preference enabled")
            };
            break;
        }
    }
    unref(features);
    result
}
