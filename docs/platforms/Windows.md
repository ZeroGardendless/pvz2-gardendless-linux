# Windows desktop builds

Use Windows x64, Node.js 22+, Microsoft C++ Build Tools with Desktop development
with C++, and the stable MSVC Rust toolchain. WebView2 Runtime must be installed
on the destination PC; a standalone executable does not include that system runtime.
See the [official Tauri prerequisites](https://v2.tauri.app/start/prerequisites/).

With the local game resources present in `public/`:

```powershell
npm ci
npm run build:binary
```

The plain executable is `src-tauri/target/release/gardendless.exe`.
Windows uses WebView2's native audio; Linux keeps the
WebKitGTK audio workaround and GPU selection. Windows GPU preference is currently
managed by Windows Graphics settings; an in-app Windows GPU chooser is future work.
Windows uses the native titlebar. On Linux, the native titlebar is hidden at
startup for recognized tiling window managers (including Hyprland, Sway, i3,
and Niri) and shown for other desktops.

## GitHub Actions

The repository excludes most game resources. A checkout alone cannot run the game.
Create a resource archive with `npm run assets:bundle` and retain its printed
SHA-256. Supply an HTTPS download URL for that archive and the matching digest to
the manual **Windows binary** workflow. Uploading/releasing the archive is a
separate manual step; this workflow only downloads, builds and uploads a
workflow artifact. It does not publish a release.

Extraction accepts only game resource roots and rejects traversal, duplicate
Windows paths and symlinks. GPNext and the HTML host come from the checked-out
source, so an old resource archive cannot silently overwrite the new overlay.
Use resources from the same game version as the GPNext integration.

## Verification scope

A Linux-hosted Windows GNU library compile check is useful for finding accidental
Linux dependencies, but is not a substitute for the native MSVC workflow or testing
on a Windows PC. Check launch, audio, mod imports, Unicode/space-containing paths,
settings export, recovery sessions, fullscreen and save persistence on Windows.


## Current Linux cross-build

The Windows GNU target passed the native-library compile check and produced an
experimental executable. It imports `WebView2Loader.dll`; keep that DLL beside
the EXE. The local test package is
`src-tauri/target/gardendless-windows-x64-test.zip`, containing both files and
a README. It has not been launched on a Windows host. The MSVC workflow uses
the dependency's static loader and is the preferred release path.
