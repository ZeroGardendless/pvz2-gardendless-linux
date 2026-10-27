# Gardendless 0.16.1 handoff

Read MIGRATION_STATUS.md for source hashes, preserved integrations and limitations.
Game and GP-Next migration, Gardenest public mod installation/update, version
metadata and UI work are implemented. Native cloud-save authorization is deferred.

Build only Flatpak: `python build.py` after asset replacement. Use `--skip-png`
only when PNGs have already been optimized and verified. The final build uses
`src-tauri/target/flatpak/gardendless-linux-x64.flatpak` and a SHA-256 companion.

Current verification: npm checks and Rust tests pass; browser GP-Next startup,
version label, dropdowns and render-buffer scaling checked. A full gameplay FPS
comparison and audible gameplay check remain for user testing. No existing save
was edited during verification.

Publication v0.16.1 is authorized by the user. Final packaging/install/upload is
in progress; do not confuse an earlier snapshot bundle with the final artifact.
