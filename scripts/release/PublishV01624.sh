#!/usr/bin/env bash
# Publish the verified Flatpak from an independent terminal. Safe to retry.
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.."
root=$PWD
repo=ZeroGardendless/pvz2-gardendless-linux
tag=v0.16.24
release_branch=codex/release-v0.16.24
release_commit=${1:?Pass the verified source commit}
[[ $release_commit =~ ^[0-9a-f]{40}$ ]] || { echo 'Invalid source commit.'; exit 1; }
work="$root/src-tauri/target/flatpak"
bundle="$work/gardendless-linux-x64.flatpak"
checksum="$bundle.sha256"
notes="$root/docs/releases/v0.16.24.md"
mkdir -p "$work"
exec 9>"$work/publish-v0.16.24.lock"
flock -n 9 || { echo 'The release uploader is already running.'; exit 1; }
exec > >(tee -a "$work/publish-v0.16.24.log") 2>&1
trap 'status=$?; if (( status )); then echo "Publication stopped (exit $status). The log is in src-tauri/target/flatpak/publish-v0.16.24.log; rerun this same command after resolving the error."; fi' EXIT
printf '\nGardendless v0.16.24 · publication started %s\n' "$(date -Iseconds)"
[[ $(git rev-parse HEAD) == "$release_commit" ]] || { echo 'HEAD differs from the verified release commit.'; exit 1; }
[[ -z $(git status --porcelain) ]] || { echo 'Source changes appeared after verification. Review them before publishing.'; exit 1; }
[[ $(node -p "JSON.parse(require('fs').readFileSync('package.json')).version") == 0.16.24 ]] || exit 1
(cd "$work" && sha256sum -c -- "$(basename -- "$checksum")")
git push origin "$release_commit:refs/heads/$release_branch"
if git show-ref --verify --quiet "refs/tags/$tag"; then
    [[ $(git rev-parse "$tag^{}") == "$release_commit" ]] || { echo 'Existing tag points at different source.'; exit 1; }
else
    git tag -a "$tag" "$release_commit" -m 'Gardendless v0.16.24'
fi
git push origin "refs/tags/$tag"
if ! gh release view "$tag" --repo "$repo" >/dev/null 2>&1; then
    gh release create "$tag" --repo "$repo" --verify-tag --draft --title "$tag" --notes-file "$notes"
fi
gh release edit "$tag" --repo "$repo" --title "$tag" --notes-file "$notes"
# A failed connection can leave partial assets; --clobber makes retries explicit.
uploaded=false
for attempt in 1 2 3; do
    if gh release upload "$tag" "$bundle" "$checksum" --repo "$repo" --clobber; then
        uploaded=true
        break
    fi
    echo "Upload attempt $attempt failed. Retrying in five seconds…"
    sleep 5
done
[[ $uploaded == true ]] || exit 1
# Compare GitHub's asset digest before making the draft public.
gh api "repos/$repo/releases/tags/$tag" > "$work/publish-v0.16.24-remote.json"
python - "$work" "$notes" <<'PY'
import hashlib,json,sys
from pathlib import Path
work,notes=map(Path,sys.argv[1:])
remote=json.loads((work/'publish-v0.16.24-remote.json').read_text())
assert remote['tag_name']=='v0.16.24'
assert remote['body'].strip()==notes.read_text().strip(), 'Release notes differ'
for name in ['gardendless-linux-x64.flatpak','gardendless-linux-x64.flatpak.sha256']:
    asset=next(item for item in remote['assets'] if item['name']==name)
    local=work/name
    assert asset['size']==local.stat().st_size and asset['state']=='uploaded', name
    if asset.get('digest'):
        with local.open('rb') as stream:
            digest=hashlib.file_digest(stream,'sha256').hexdigest()
        assert asset['digest']=='sha256:'+digest, 'Remote checksum differs: '+name
PY
gh release edit "$tag" --repo "$repo" --draft=false --latest
gh api "repos/$repo/releases/tags/$tag" > "$work/publish-v0.16.24-remote.json"
python - "$work/publish-v0.16.24-remote.json" <<'PY'
import json,sys
from pathlib import Path
remote=json.loads(Path(sys.argv[1]).read_text())
assert remote['tag_name']=='v0.16.24' and not remote['draft'] and not remote['prerelease']
print('\nPublished and verified: '+remote['html_url'])
for asset in remote['assets']:
    print(asset['name']+' · '+str(asset['size'])+' bytes')
PY
date -Iseconds > "$work/publish-v0.16.24-complete"
