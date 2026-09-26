//! Pick native window decorations from the active Linux desktop at startup.

const TILING_DESKTOPS: &[&str] = &[
    "awesome",
    "bspwm",
    "dwm",
    "herbstluftwm",
    "hyprland",
    "i3",
    "leftwm",
    "niri",
    "qtile",
    "river",
    "sway",
    "xmonad",
];

fn names_tiling_desktop(value: &str) -> bool {
    value
        .split(|character: char| character.is_whitespace() || matches!(character, ':' | ';' | ','))
        .map(str::to_ascii_lowercase)
        .any(|name| {
            TILING_DESKTOPS
                .iter()
                .any(|desktop| name == *desktop || name.starts_with(&format!("{desktop}-")))
        })
}

pub(super) fn is_tiling_window_manager() -> bool {
    // Socket/session markers cover sessions that report a generic desktop name.
    if [
        "HYPRLAND_INSTANCE_SIGNATURE",
        "SWAYSOCK",
        "I3SOCK",
        "NIRI_SOCKET",
    ]
    .iter()
    .any(|key| std::env::var_os(key).is_some_and(|value| !value.is_empty()))
    {
        return true;
    }

    [
        "XDG_CURRENT_DESKTOP",
        "XDG_SESSION_DESKTOP",
        "DESKTOP_SESSION",
    ]
    .iter()
    .filter_map(|key| std::env::var(key).ok())
    .any(|value| names_tiling_desktop(&value))
}

#[cfg(test)]
mod tests {
    use super::names_tiling_desktop;

    #[test]
    fn recognizes_tiling_desktops_and_session_variants() {
        for name in [
            "Hyprland",
            "hyprland-uwsm",
            "GNOME:sway",
            "i3",
            "niri",
            "bspwm",
        ] {
            assert!(names_tiling_desktop(name), "{name}");
        }
    }

    #[test]
    fn preserves_titlebar_for_other_desktops() {
        for name in ["GNOME", "KDE", "XFCE", "labwc", "", "i3ish"] {
            assert!(!names_tiling_desktop(name), "{name}");
        }
    }
}
