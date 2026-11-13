# What is PvZ2 Gardendless for Linux?

It's an **unofficial** Linux port of the [PvZ2 Gardendless](https://github.com/Gzh0821/pvzg_site) project made by a passionate fan. 

Updates are planned to come out within a day of official releases (or earlier if I get my hands on the Chinese releases before international ones).

> **Note:** Please **do not** report in-game bugs here, as I am *not* the developer of the game. All original content belongs to 南Garden, LingMo (Gaozih), and their hard-working team of artists. 
>
> If you encounter any **Linux-specific bugs**, please report them in the Issues tab! You can also DM me or ping `@gardendless` on the official GE Discord server.

Have fun!


## Current version

The current game content is Gardendless **0.16.24** with full-quality PNG textures
and our adapted **GP-Next 1.5.11** integration. See the
[v0.16.24 changelog](docs/releases/v0.16.24.md) for the launcher render tools,
Aurum changes and remaining limitations.

## Running on Linux

See [Linux runtime dependencies and audio troubleshooting](docs/platforms/Linux.md).

## Development

GPNext source is organized under `public/gpnext/`; game resources stay under
`public/assets/`. Native application setup lives in `src-tauri/src/`, and reusable
checks/build tools live in `scripts/`. See [the GPNext development guide](docs/gpnext/README.md).

Run `npm run check` (also `npm run build`) to validate the ready-to-serve frontend.
`npm run dev` serves `public/` for browser previews; native features require Tauri.
After replacing game assets, run `python build.py` from the project directory.
It validates the runtime integration, regenerates the save-editor/render catalogs, losslessly
optimizes PNGs with oxipng, verifies their pixels, runs checks, and builds only the Flatpak.
PNG originals and reports are kept under `src-tauri/target/png-optimization/`.
Requires Python with Pillow, oxipng, Node/npm and Rust; missing JavaScript dependencies
are installed with `npm ci`. Use `python build.py --skip-png` to skip image
optimization, or `--dry-run` to preview the steps. Flatpak builds also require the SDKs in the Flatpak guide.
The GP-Next icon is `public/gpnicon.png`, outside the replaceable game assets.
Audio and frame-rate compatibility use our runtime integration; the build validates
the upstream Cocos boundary without rewriting the game's logic or engine bundle.

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
See the [Flatpak build and storage guide](docs/platforms/Flatpak.md) for SDK requirements
and packaging details.

## Render tools

Open **Datapacks → Character renders** to export a ZIP or create a custom preview.
Plants, zombies and misc objects have separate sections. The exporter uses the
bundled PNG atlases and skeletons, includes supported costumes/forms and persistent
appearance recipes, and can sample named action clips. Each PNG's codename, state,
animation, position and actual output scale are recorded in the ZIP manifest.
Unsupported assets and intentionally empty poses are reported there too.

Aurum remains configurable through its own settings/diagnostics. Apply the built-in
**Aurum → Update** action after updating the Flatpak, then restart the game to use
new restart-required optimizations. Timing evidence and verification boundaries are
in [the Aurum plan](docs/aurum/PLAN.md).
