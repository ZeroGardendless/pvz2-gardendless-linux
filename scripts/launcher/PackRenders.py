#!/usr/bin/env python3
"""Package completed render jobs, excluding stale files from earlier exports."""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import zipfile

ROOT = Path(__file__).resolve().parents[2]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path,
                        default=ROOT / 'src-tauri/target/aurum/render-full-quality')
    parser.add_argument('--output', type=Path,
                        default=ROOT / 'exports/gardendless-0.16.15-full-renders.zip')
    args = parser.parse_args()
    if args.output.exists():
        parser.error('The output archive already exists; choose another name to preserve it.')
    jobs = {kind: json.loads((args.source / f'manifest-{kind}.json').read_text())
            for kind in ['plants', 'zombies', 'misc']}
    manifest = dict(jobs['plants'])
    for field in ['entries', 'failures', 'skipped']:
        manifest[field] = [entry for job in jobs.values() for entry in job[field]]
    manifest['jobs'] = {kind: {field: len(job[field])
                              for field in ['entries', 'failures', 'skipped']}
                        for kind, job in jobs.items()}
    names = set()
    for entry in manifest['entries']:
        name = entry['path']
        path = PurePosixPath(name)
        if (path.is_absolute() or '..' in path.parts or not name.endswith('.png')
                or path.parts[0] not in jobs or name in names):
            raise ValueError('Invalid or duplicate render path: ' + name)
        if not (args.source / name).is_file():
            raise FileNotFoundError(name)
        names.add(name)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix('.zip.part')
    if temporary.exists():
        parser.error('A partial archive already exists; choose another output name.')
    try:
        with zipfile.ZipFile(temporary, 'x', allowZip64=True) as archive:
            for entry in manifest['entries']:
                archive.write(args.source / entry['path'], entry['path'])
            archive.writestr('manifest.json', json.dumps(manifest, indent=2),
                             compress_type=zipfile.ZIP_DEFLATED)
        with zipfile.ZipFile(temporary) as archive:
            failed = archive.testzip()
            if failed:
                raise ValueError('Archive verification failed: ' + failed)
        temporary.rename(args.output)
    finally:
        if temporary.exists():
            temporary.unlink()
    with args.output.open('rb') as stream:
        digest = hashlib.file_digest(stream, 'sha256').hexdigest()
    args.output.with_suffix('.zip.sha256').write_text(f'{digest}  {args.output.name}\n')
    print(json.dumps(manifest['jobs'], indent=2))
    print(f'{len(names)} verified PNGs: {args.output}')


if __name__ == '__main__':
    main()
