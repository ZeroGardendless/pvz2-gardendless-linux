# Gardendless launcher: next phase

The launcher will download game versions from GitHub releases, select and manage
installed versions, install GPNext mods, and choose a GPU before starting a game.
This document records scope; the launcher is not implemented in this change.

- Keep versioned game installations separate from launcher state and save profiles.
- Download into staging, verify published checksums when available, then install
  atomically. Retain the previous version for rollback and support offline launch.
- Show release notes, download progress, install size and cancellation.
- Make shared versus per-version mod/save profiles explicit. Warn about version
  compatibility before copying mods or migrating saves; preserve an undo backup.
- Apply GPU selection to the child process. Reuse Linux discovery, with a manual
  override and a clear NVIDIA fallback. Design Windows GPU integration separately.
- Launch external game executables. Do not assume downloaded game code can safely
  replace the launcher's own trusted UI or receive its filesystem permissions.

Suggested first milestone: list installed versions, import an existing installation,
select a profile and GPU, then launch it. Add GitHub downloads after that works.
