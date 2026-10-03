# What is PvZ2 Gardendless for Linux?

It's an **unofficial** Linux port of the [PvZ2 Gardendless](https://github.com/Gzh0821/pvzg_site) project made by a passionate fan. 

Updates are planned to come out within a day of official releases (or earlier if I get my hands on the Chinese releases before international ones).

> **Note:** Please **do not** report in-game bugs here, as I am *not* the developer of the game. All original content belongs to 南Garden, LingMo (Gaozih), and their hard-working team of artists. 
>
> If you encounter any **Linux-specific bugs**, please report them in the Issues tab! You can also DM me or ping `@gardendless` on the official GE Discord server.

Have fun!


## Running on Linux

See [Linux runtime dependencies and audio troubleshooting](docs/platforms/Linux.md).

## Development

GPNext source is organized under `public/gpnext/`; game resources stay under
`public/assets/`. Native application setup lives in `src-tauri/src/`, and reusable
checks/build tools live in `scripts/`. See [the GPNext development guide](docs/gpnext/README.md).

Run `npm run check` (also `npm run build`) to validate the ready-to-serve frontend.
`npm run dev` serves `public/` for browser previews; native features require Tauri.
Run `npm run build:binary` to validate and build one embedded executable.
Linux output: `src-tauri/target/release/gardendless-linux-x64` and its SHA-256 file.
The build reapplies Gardendless's Cocos audio and frame-rate compatibility hooks
if `public/cocos-js/` has been replaced with an upstream copy.

Windows build instructions and the manual binary workflow are documented in
[Windows builds](docs/platforms/Windows.md). The included version/profile/GPU launcher
is documented in [the launcher guide](docs/LauncherRoadmap.md). Launch the executable
normally to open the launcher, or add `--game` to start the included game directly.

The launcher uses Material 3 tonal palettes with dark/light/system themes and
can follow a Caelestia/Quickshell color scheme on Linux. The GP-Next workspace
shows profile packages before launch, and save editing includes plant-card
switches and bulk unlock. Linux sound-effect presets can be set per profile or
from GP-Next while playing. They trade simultaneous effects against resource use.
The launcher also
includes Linux save editing, automatic edit backups, and a keybind editor.
For graphics troubleshooting, try `--safe-graphics` (optionally with `--game`).
An experimental Flatpak build is available via `npm run build:flatpak`; see the
[Flatpak build and storage guide](docs/platforms/Flatpak.md).
