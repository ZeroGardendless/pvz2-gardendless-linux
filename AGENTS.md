# Project guidance

Use readable, understandable code and preserve existing user work.

For the active upstream migration, official Gardendless 0.16.24 (full-quality PNG assets) and its actual
bundled GP-Next 1.5.11 are the source of truth. See `docs/MIGRATION_STATUS.md` for the
pinned archive/hash and per-subsystem adaptation decisions. Do not invent newer
API behavior or silently omit upstream features. Preserve our deliberate Linux,
audio, launcher, UI and widescreen integrations and document necessary deviations.

Build/install Flatpak only unless the user explicitly changes that instruction.
Keep extracted reference files outside this repository and preserve upstream
credits. The user authorized GitHub release v0.16.24 with a comprehensive changelog and the final Flatpak. Report static checks, builds,
runtime/UI checks and audible/gameplay verification as distinct evidence levels.
