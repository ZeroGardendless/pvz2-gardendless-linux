"""Package local game resources for a Windows build; never replace GPNext code."""
import argparse
import hashlib
from pathlib import Path, PurePosixPath
import shutil
import zipfile

ROOTS = {'application.js', 'index.js', 'style.css', 'src', 'assets', 'cocos-js'}

def allowed(name):
    path = PurePosixPath(name)
    return (not path.is_absolute() and bool(path.parts) and path.parts[0] in ROOTS
            and all(part not in {'.', '..'} and ':' not in part and '\\' not in part for part in path.parts))

def pack(root, archive):
    archive.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_STORED) as bundle:
        for item in sorted(root.rglob('*')):
            relative = item.relative_to(root).as_posix()
            if item.is_file() and not item.is_symlink() and allowed(relative):
                bundle.write(item, relative)
    with archive.open('rb') as stream:
        digest = hashlib.file_digest(stream, 'sha256').hexdigest()
    print(f'{digest}  {archive}')

def unpack(root, archive, expected):
    with archive.open('rb') as stream:
        actual = hashlib.file_digest(stream, 'sha256').hexdigest()
    if not expected or actual.lower() != expected.lower():
        raise ValueError('Game resource SHA-256 does not match')
    with zipfile.ZipFile(archive) as bundle:
        members = bundle.infolist()
        seen = set()
        for info in members:
            if not allowed(info.filename):
                raise ValueError(f'Unexpected resource path: {info.filename}')
            if info.filename.casefold() in seen:
                raise ValueError(f'Duplicate Windows resource path: {info.filename}')
            seen.add(info.filename.casefold())
            if info.file_size > 2 * 1024**3 or (info.external_attr >> 16) & 0o170000 == 0o120000:
                raise ValueError('Unsupported resource entry')
        if sum(info.file_size for info in members) > 8 * 1024**3:
            raise ValueError('Game resource archive exceeds 8 GiB')
        for info in members:
            target = root / info.filename
            if info.is_dir(): target.mkdir(parents=True, exist_ok=True)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                with bundle.open(info) as source, target.open('wb') as output:
                    shutil.copyfileobj(source, output)
    print(f'Verified and restored {len(members)} game resource entries')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('action', choices=['pack', 'unpack'])
    parser.add_argument('--root', type=Path, default=Path('public'))
    parser.add_argument('--archive', type=Path, default=Path('src-tauri/target/game-resources.zip'))
    parser.add_argument('--sha256')
    args = parser.parse_args()
    if args.action == 'pack': pack(args.root, args.archive)
    else: unpack(args.root, args.archive, args.sha256)
