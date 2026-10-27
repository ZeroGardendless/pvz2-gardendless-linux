#!/usr/bin/env python3
"""Prepare replaced game assets and build the Gardendless Flatpak from any directory."""

import argparse
from datetime import datetime
import hashlib
import importlib.util
import os
from pathlib import Path
import shlex
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parent


def positive_int(value):
    number = int(value)
    if number < 1:
        raise argparse.ArgumentTypeError("must be at least 1")
    return number


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--skip-png", action="store_true",
                        help="skip lossless PNG optimization and pixel verification")
    parser.add_argument("--oxipng", default="oxipng", help="oxipng executable or path")
    parser.add_argument("--jobs", type=positive_int,
                        help="Cargo build jobs (default: CARGO_BUILD_JOBS, or 2)")
    parser.add_argument("--dry-run", action="store_true", help="print steps without changing files")
    args = parser.parse_args()

    node = shutil.which("node") or "node"
    npm = shutil.which("npm") or "npm"
    needs_dependencies = not all((ROOT / path).is_file() for path in (
        "node_modules/@tauri-apps/cli/tauri.js", "node_modules/esbuild/package.json",
        "node_modules/@material/material-color-utilities/package.json",
    ))
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    png_work = ROOT / "src-tauri/target/png-optimization" / stamp
    steps = []
    if needs_dependencies:
        steps.append(("Install locked JavaScript dependencies", [npm, "ci"]))
    # Fail on incompatible game code before spending time compressing textures.
    steps.append(("Validate game/audio/frame-rate runtime compatibility",
                  [node, "scripts/assets/PatchCocos.mjs"]))
    steps.append(("Read the bundled game version", [node, "scripts/launcher/GameMetadata.mjs"]))
    steps.append(("Refresh save-editor catalog from the new assets",
                  [node, "scripts/launcher/SaveCatalog.mjs"]))
    if not args.skip_png:
        steps.append(("Losslessly optimize PNGs and verify decoded pixels",
                      [sys.executable, "scripts/assets/optimize-pngs.py", "--oxipng", args.oxipng,
                       "--root", "public/assets", "--work", str(png_work)]))
    steps.append(("Run checks and build the Flatpak", [npm, "run", "build:flatpak"]))

    print(f"Gardendless build · {ROOT}", flush=True)
    if args.dry_run:
        for title, command in steps:
            print(f"\n{title}\n  {shlex.join(command)}")
        return 0

    required = ["node", "npm", "cargo", "rustc", "flatpak"]
    if not sys.platform.startswith("linux"):
        parser.error("Flatpak builds require Linux")
    if not args.skip_png:
        required.append(args.oxipng)
        if importlib.util.find_spec("PIL") is None:
            parser.error(f"Pillow is missing from {sys.executable}. Install Pillow for this Python first.")
    missing = [tool for tool in required if shutil.which(tool) is None]
    if missing:
        parser.error("Missing required tools: " + ", ".join(missing))
    for path in ("public/index.html", "public/gpnicon.png", "public/assets/main/index.js",
                 "public/assets/resources/config.json", "src-tauri/Cargo.toml", "package-lock.json"):
        if not (ROOT / path).is_file():
            parser.error(f"Missing {path}. Restore the complete game/project files before building.")

    environment = os.environ.copy()
    if args.jobs is not None:
        environment["CARGO_BUILD_JOBS"] = str(args.jobs)
    else:
        environment.setdefault("CARGO_BUILD_JOBS", "2")
    for index, (title, command) in enumerate(steps, 1):
        print(f"\n[{index}/{len(steps)}] {title}", flush=True)
        try:
            subprocess.run(command, cwd=ROOT, env=environment, check=True)
        except subprocess.CalledProcessError as error:
            print(f"\nBuild stopped: {title} (exit {error.returncode}). Fix the error above and retry.",
                  file=sys.stderr)
            return 1

    artifact = ROOT / "src-tauri/target/flatpak/gardendless-linux-x64.flatpak"
    digest = hashlib.sha256()
    with artifact.open("rb") as bundle:
        for chunk in iter(lambda: bundle.read(1024 * 1024), b""):
            digest.update(chunk)
    artifact.with_suffix(".flatpak.sha256").write_text(
        f"{digest.hexdigest()}  {artifact.name}\n", encoding="utf-8")
    print("\nBuild complete.", flush=True)
    print(artifact)
    if not args.skip_png:
        print(f"PNG backups, verification report and optimizer log: {png_work}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\nBuild cancelled.", file=sys.stderr)
        sys.exit(130)
