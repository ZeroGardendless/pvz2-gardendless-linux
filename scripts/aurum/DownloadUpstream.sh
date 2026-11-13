#!/usr/bin/env bash
set -euo pipefail
# Pinned migration inputs, deliberately kept outside the checkout.
variant=${1:-full}
reference=/home/zero/gardendless-reference/update-20261113
case "$variant" in
  lite)
    reference="$reference/lite"
    name=pvzge-lite-0.16.24.zip
    asset=739832136
    size=384766479
    digest=06120bf956d9480195fff42128902f029b3922980f482851908128ea629bad6c
    ;;
  full)
    name=pvzge-0.16.24.zip
    asset=739829796
    size=1199547980
    digest=c1ecb7a68f9ffeb4736d83acffcf06b9d6393aadfc64ca1866ae491dfaa16ffc
    ;;
  *) echo 'Usage: DownloadUpstream.sh [lite|full]' >&2; exit 2 ;;
esac
mkdir -p "$reference"
exec 8>"$reference/download.lock"
flock -n 8 || { echo 'This archive already has a download worker.' >&2; exit 1; }
archive="$reference/$name"
for attempt in {1..20}; do
  printf '\nOfficial %s download attempt %s (single writer, resumable)\n' "$variant" "$attempt"
  if curl -L --fail --continue-at - --connect-timeout 20 --max-time 600 \
      -H 'Accept: application/octet-stream' --output "$archive" \
      "https://api.github.com/repos/Gzh0821/pvzg_site/releases/assets/$asset"; then
    python - "$archive" "$reference" "$size" "$digest" <<'PY'
import hashlib, pathlib, shutil, sys, zipfile
archive, root = map(pathlib.Path, sys.argv[1:3])
assert archive.stat().st_size == int(sys.argv[3]), 'Unexpected release archive size'
with archive.open('rb') as stream:
    digest = hashlib.file_digest(stream, 'sha256').hexdigest()
assert digest == sys.argv[4], 'Archive SHA-256 mismatch; do not extract or use it'
with zipfile.ZipFile(archive) as contents:
    assert contents.testzip() is None, 'Archive CRC verification failed'
    executables = [item for item in contents.infolist() if item.filename.lower().endswith('.exe') and not item.is_dir()]
    assert len(executables) == 1, 'Expected exactly one game executable'
    assert executables[0].file_size < 3_000_000_000, 'Unexpected executable size'
    with contents.open(executables[0]) as source, (root / 'upstream.exe').open('wb') as target:
        shutil.copyfileobj(source, target)
(root / 'archive.sha256').write_text(f'{digest}  {archive.name}\n')
print('Verified archive SHA-256 and ZIP CRC:', digest)
PY
    /home/zero/gardendless-reference/update-20261027/tauri-dumper extract \
      "$reference/upstream.exe" -o "$reference/extracted" --json > "$reference/extraction-log.json"
    printf 'EXTRACTED\n' > "$reference/STATUS"
    echo 'Reference extracted without executing it. Live files have not been replaced.'
    exit 0
  fi
  sleep 10
done
echo 'Download failed. Partial archive retained for resuming.' >&2
exit 1
