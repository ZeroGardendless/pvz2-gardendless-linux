# Flatpak test package

Flatpak provides a consistent WebKitGTK/GStreamer runtime, including the audio
plugins needed by the game. It does not replace the host graphics driver or
guarantee that NVIDIA/Wayland rendering bugs disappear.

The standalone binary remains supported. This recipe builds from source inside
GNOME SDK 50 rather than repackaging a host-linked Arch executable. Cargo crates
are vendored from the lockfile and the sandbox build runs offline.

## Build

Install Flatpak and the official development runtimes once:

```sh
flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak install --user flathub org.gnome.Platform//50 org.gnome.Sdk//50 org.freedesktop.Sdk.Extension.rust-stable//25.08
npm run build:flatpak
```

The output is `src-tauri/target/flatpak/gardendless-linux-x64.flatpak`.
The helper uses Flatpak's built-in build commands; flatpak-builder is optional.
`npm run build:flatpak -- --prepare` only stages vendored sources and a manifest
for flatpak-builder under `src-tauri/target/flatpak/`.

```sh
flatpak install --user src-tauri/target/flatpak/gardendless-linux-x64.flatpak
flatpak run com.zero.gardendless
flatpak run com.zero.gardendless --safe-graphics
```

This is a GitHub bundle package, not a Flathub submission or a signed remote update feed.
Its metadata intentionally does not claim an open-source license for bundled
game assets. Distribution/license review is still needed before a store submission.

## Storage and permissions

Saves are separate from the native installation, under
`~/.var/app/com.zero.gardendless/data/`. Export native saves as JSON, then import
them into the Flatpak profile using the editor. Create the profile's game save
once before applying an imported save. Existing native saves are not moved.

The sandbox has graphics, audio and network access. It has no blanket home
directory access; file import/export uses file dialogs. GP-Next and profile
editors work with storage inside the sandbox. Standalone version import/download
is disabled in Flatpak because those executables may require host libraries;
the Releases page downloads the matching Flatpak bundle from GitHub, verifies its size and SHA-256, and installs it for the current user. Restart the launcher afterward. Native binaries remain unavailable in the sandbox.

References: [Flatpak build documentation](https://docs.flatpak.org/en/latest/first-build.html),
[Tauri Flatpak guide](https://v2.tauri.app/distribute/flatpak/).

## Sharing a test build on GitHub

Use the repository's **Releases** page, not a Git commit or the source ZIP:
https://github.com/ZeroGardendless/pvz2-gardendless-linux/releases

1. Draft a new release using the version/tag you intend to ship. Mark it as a
   pre-release while the launcher is being tested.
2. Attach `src-tauri/target/flatpak/gardendless-linux-x64.flatpak` and its
   `gardendless-linux-x64.flatpak.sha256` checksum in the release's binaries box.
3. Include the following installation instructions, then publish when ready.

```sh
flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak install --user ./gardendless-linux-x64.flatpak
flatpak run com.zero.gardendless
```

For a replacement test bundle, close Gardendless and run the same install
command with the new file. If Flatpak reports the app as already installed,
use `flatpak install --user --reinstall ./gardendless-linux-x64.flatpak`.
Reinstalling the app does not require deleting its save data.

The first installation downloads the GNOME runtime if needed. The `.flatpak`
file contains the app and game assets; it does not contain a complete offline
copy of that shared runtime. Uploading bundles to GitHub does not provide
automatic app updates through `flatpak update`. A signed hosted Flatpak
repository is the next step for automatic updates. Flathub is a separate
submission/review process, rather than an upload destination for this bundle.

References: [GitHub release attachments](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository),
[Flatpak single-file bundles](https://docs.flatpak.org/en/latest/single-file-bundles.html),
[hosting an update repository](https://docs.flatpak.org/en/latest/hosting-a-repository.html).

## Launcher-managed GitHub updates

The Releases page only offers `gardendless-linux-x64.flatpak` assets with a
published GitHub SHA-256 digest. Downloads are staged, cancellable, and verified
before installation. Installation uses `flatpak-spawn --host flatpak install
--user --noninteractive --reinstall --bundle` with the verified local path;
no shell or caller-supplied command is used. Saves are retained. Close the game
before updating, then restart the launcher. System installations are shadowed
by the updated user installation.

This requires `--talk-name=org.freedesktop.Flatpak`. That permission permits host
process execution, so it broadens the sandbox's trust boundary. The launcher
exposes only its fixed bundle-install operation; it does not expose a generic
host-command API. The first update from an older package must be installed
manually, because the old manifest lacks this permission.

Both X11 and Wayland sockets are available. On NVIDIA with DMA-BUF fallback,
Automatic uses X11/XWayland when available and keeps WebGL acceleration enabled.
A profile can explicitly choose Wayland or X11. This is a compatibility policy,
not a guarantee about every NVIDIA driver/compositor combination.

Linux audio uses one native PulseAudio/PipeWire stream, decoded off the UI
thread. The media backend is retained as a fallback for unsupported clips or
unavailable native output. Native playback needs the runtime's libpulse-simple
and libpulse libraries, already included in the GNOME runtime.
