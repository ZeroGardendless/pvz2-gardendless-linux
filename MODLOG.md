# Gardendless update journal

## 2026-10-27 — official 0.16.1 / GP-Next 1.5.5

User requested updating game content from the official GitHub Windows release,
extracting its executable with TauriDumper, and incorporating upstream GP-Next
features into our readable/customized implementation. Flatpak-only remains the
packaging preference. See `docs/MIGRATION_STATUS.md` for pinned hashes, backups,
the adaptation matrix and acceptance boundaries.

Initial findings: the official website reports game 0.16.1 and GP-Next 1.5.5.
GitHub marks the release as a prerelease, so `/releases/latest` returns 404;
the release collection and website metadata identify the correct source.
The shared modding knowledge-base lookup failed because its network lookup was
unavailable. Recon of the project directory misidentified the engine; actual
project files identify Tauri hosting a Cocos web export. No anti-cheat is involved.
Existing frontend checks passed before modification. Original game and overlay
are backed up; the reference extraction is kept outside this repository.

## Completed migration and release preparation

Imported game 0.16.1 and GP-Next 1.5.5, adapted native/shared audio and rendering
hooks without rewriting game bundles, added canonical launcher mod installs and
Gardenest public downloads/updates, polished UI controls, generated the game
version label from assets, and added rotating frontend diagnostics. Lossless PNG
optimization saved about 201 MB. Frontend checks pass; Rust: 35 passed, 3 ignored.
Browser startup and render scaling checked. User authorized v0.16.1 publication.
Native GP-Next cloud authorization remains explicitly deferred.

## 2026-10-28 — preserve the old overlay and repair imports

Restored the customized 1.5.0 visual layout while retaining upstream 1.5.5 logic.
Added bounded/cached datapack artwork and restored Enable/Disable cards. Fixed
Gardenest's valid NTFS timestamp ZIP metadata, disabled-JS installation, wrapped
ZIP inspection, and Flatpak-friendly browser File drops. Kept canonical review
and disabled-by-default imports. Added launcher menu stability fixes and a Levels
save editor using generated resource and world-map catalogs. Completion edits
remain drafts until backup-before-apply; real saves were not modified in testing.
Frontend and native WebKit regression checks pass. Release/install details follow
in docs/HANDOFF.md after final packaging.
