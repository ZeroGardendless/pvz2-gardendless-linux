"""Losslessly optimize PNGs and verify decoded frames; restore any failed file."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('--oxipng', default='oxipng')
parser.add_argument('--root', type=Path, default=Path('public/assets'))
parser.add_argument('--work', type=Path, default=Path('src-tauri/target/png-optimization'))
args = parser.parse_args()
args.work.mkdir(parents=True, exist_ok=True)

def pixels(path):
    digest = hashlib.sha256()
    with Image.open(path) as image:
        digest.update(str((image.size, image.n_frames)).encode())
        for frame in range(image.n_frames):
            image.seek(frame)
            digest.update(image.convert('RGBA').tobytes())
            digest.update(str(image.info.get('duration', 0)).encode())
    return digest.hexdigest()

files = sorted(args.root.rglob('*.png'))
records = []
for path in files:
    relative = path.relative_to(args.root)
    backup = args.work / 'originals' / relative
    backup.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, backup)
    records.append({'path': str(path), 'before': path.stat().st_size, 'pixels': pixels(path)})
print(f'Optimizing {len(files)} PNGs ({sum(r["before"] for r in records):,} bytes)', flush=True)
# Do not use --alpha, which changes RGB values under transparent pixels.
with (args.work / 'oxipng.log').open('w') as log:
    result = subprocess.run([args.oxipng, '-o', '2', '--threads', '2', '--preserve', *map(str, files)], stdout=log, stderr=subprocess.STDOUT)
failed = []
for record in records:
    path = Path(record['path'])
    try:
        unchanged = pixels(path) == record['pixels']
    except Exception:
        unchanged = False
    if not unchanged:
        shutil.copy2(args.work / 'originals' / path.relative_to(args.root), path)
        failed.append(str(path))
    record['after'] = path.stat().st_size
summary = {'files': len(files), 'changed': sum(r['before'] != r['after'] for r in records),
           'before': sum(r['before'] for r in records), 'after': sum(r['after'] for r in records),
           'decoded_frames_verified': not failed, 'restored': failed, 'exit_code': result.returncode}
(args.work / 'report.json').write_text(json.dumps({'summary': summary, 'files': records}, indent=2))
print(json.dumps(summary, indent=2), flush=True)
if failed or result.returncode:
    raise SystemExit('PNG optimization needs review; see the report and log')
