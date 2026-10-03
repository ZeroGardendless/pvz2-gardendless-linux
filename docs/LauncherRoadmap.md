# Gardendless Launcher

The executable now opens the launcher. Pass `--game` to open the bundled game
directly (useful for Steam shortcuts). Both remain in one embedded executable.

## Available

- Material 3 interface with generated tonal palettes, bundled Google Sans Flex, responsive
  drawer/rail/menu navigation, and dark/light/system themes. Appearance affects
  the entire launcher and is stored separately from game settings.
- Optional Caelestia color sync reads its generated Material scheme on Linux;
  other systems and missing schemes use the Garden palette.

- Library with an included game and imported Linux x64 / Windows x64 binaries.
  Imported files stay where they are. Removing entries never deletes their files.
- GitHub release notes, cached for offline viewing. Compatible downloads are
  staged, checked against GitHub's published SHA-256 and size, and installed in
  separate folders. Cancellation cleans up the active temporary installation.
  Windows ZIP packages preserve their WebView2 loader DLL. Old releases requiring
  `public-assets.zip` need manual installation/import and are labelled accordingly.
- Existing-save profile retains the original `com.zero.gardendless` app data.
  New profiles use a separate application identifier and WebView storage, so game
  saves, GPNext packages and preferences start fresh. Profile removal preserves
  its data; no automated save copying or migration is performed.
- Linux automatic / system / device-specific GPU selection applied before the
  child game's GTK/WebKit initialization. Windows GPU choice stays in Windows
  Graphics settings and the UI explains this.
- GPNext launch preferences: frame limit, widescreen style, experiments and a
  temporary recovery session. Overrides apply once per profile Save; subsequent
  in-game preference changes persist until the profile is saved again.
- Direct GPNext mod manager, Tools, Settings and Performance shortcuts for the
  bundled game. Folder/ZIP mod installation uses GPNext's existing review flow.
- Session logs, running-game tracking and Linux GStreamer dependency checks.
- Linux save editor reads the selected profile's WebKit SQLite database directly.
  Edit the player name and currencies, select among players, import/export JSON,
  or use advanced JSON for other fields. Unknown data is preserved.
- Keybind editor covers all 57 actions in the included game, with category/key
  search, key recording, per-action reset and shared-binding information.
- Applying edits requires the game to be closed. A revision check rejects stale
  edits, a transaction writes both records consistently, and an exact backup of
  the previous records is synced before commit. Backups can be restored in-app.
  Windows currently supports JSON import/edit/export, not direct WebView2 database
  editing. No tests modify real player saves.
- Official online almanac, level editor, Plant Decoding Assistant, Plant Matcher,
  and modding documentation are linked from GP-Next's launcher page.
- The GP-Next workspace lists packages in the selected profile and opens its
  folder without launching the game. The game overlay remains the place for
  enabling packages and adjusting load order. Linux audio presets are also
  available from launch profiles and from the in-game GP-Next settings.
- Experimental source-built [Flatpak packaging](platforms/Flatpak.md).

## Storage and compatibility

Launcher state lives in the system data directory under
`com.zero.gardendless/launcher/`: `library.json`, `versions/`, `logs/`, and cached
release metadata. Launcher WebView storage has its own `webview/` subdirectory.
New profile data uses `com.zero.gardendless.profile.<id>`.

Legacy imported/downloaded builds retain their own native host and GPNext.
They can use the existing-save profile and chosen GPU, but cannot receive new
launcher profile isolation, preference overrides, or GPNext navigation commands.
The UI does not claim those integrations work on an old executable.

The launcher tracks one child game at a time. Closing it while the child runs
minimizes it; close the game first to exit the launcher. File locks protect the
launcher library and each bundled game profile against concurrent instances.

## Next iterations

- A versioned handshake for importing future launcher-aware game builds.
- Direct Windows save access through a game-side bridge.
- Native Windows testing and Windows GPU preference integration.
- Signed launcher self-updates, separate from game-version downloads.
- Broader dependency checks beyond the existing Linux audio-output preflight.

## Save progression and interaction updates

The editor includes plants (unlock state, boost, medals and costumes), worlds
and endless levels, upgrades, tutorial completion, feature switches and daily
decoding/Yeti state. The catalog is generated from the included game; run
`npm run launcher:catalog` after replacing assets. Edits preserve unrelated
fields and other players, and applying still creates a backup first. New-save
creation and clearing affect the editor draft; clearing does not delete saves.
The plant view offers searchable cards with individual unlock switches and a
bulk unlock action. Bulk unlock changes only the draft until Apply is pressed.

Launcher dropdowns use themed menus with keyboard navigation and type-ahead.
Press feedback, page transitions, switches and dialogs respect reduced motion.
Google Sans Flex is bundled locally under its SIL Open Font License; text outside
the supplied Latin coverage falls back to installed system fonts.
