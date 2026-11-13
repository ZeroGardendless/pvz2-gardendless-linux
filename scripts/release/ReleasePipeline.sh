#!/usr/bin/env bash
# Independent build -> install -> publish jobs, with explicit dependency receipts.
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.."
root=$PWD
mode=${1:?Choose build, install or publish}
commit=${2:?Pass the verified source commit}
[[ $commit =~ ^[0-9a-f]{40}$ ]] || exit 2
case "$mode" in build|install|publish) ;; *) exit 2 ;; esac
work="$root/src-tauri/target/flatpak"
job="$work/pipeline-v0.16.24-${commit:0:12}"
mkdir -p "$job"
exec 9>"$job/$mode.lock"
flock -n 9 || { echo "The $mode job is already running."; exit 1; }
exec > >(tee -a "$job/$mode.log") 2>&1
trap 'status=$?; if (( status )); then date -Iseconds > "$job/$mode.failed"; echo "$mode stopped (exit $status). Dependent jobs will not continue. Log: $job/$mode.log"; fi' EXIT
[[ ! -f "$job/$mode.ready" ]] || { echo "$mode already completed successfully."; exit 0; }
wait_for() {
    local dependency=$1
    echo "Waiting for verified $dependency completion…"
    until [[ -f "$job/$dependency.ready" ]]; do
        [[ ! -f "$job/$dependency.failed" ]] || { echo "$dependency failed. Review its terminal/log before retrying."; exit 1; }
        sleep 5
    done
}
require_source() {
    [[ $(git rev-parse HEAD) == "$commit" && -z $(git status --porcelain) ]] || { echo 'The verified source changed; stopping.'; exit 1; }
}
case "$mode" in
build)
    require_source
    echo 'Running native and browser checks, then building the Flatpak.'
    cargo test --manifest-path src-tauri/Cargo.toml --lib --jobs 1
    python scripts/checks/RunWebKitChecks.py
    # All PNGs were compared pixel-for-pixel with the pinned full archive and
    # optimized before this checkpoint. Avoid repeating that expensive pass.
    python build.py --skip-png --jobs 2
    require_source
    python - "$job" "$commit" <<'PY'
import hashlib,json,re,sys
from pathlib import Path
job=Path(sys.argv[1]);work=job.parent
bundle=work/'gardendless-linux-x64.flatpak'
with bundle.open('rb')as stream:digest=hashlib.file_digest(stream,'sha256').hexdigest()
commits=re.findall(r'^Commit: ([a-f0-9]{64})$',(job/'build.log').read_text(),re.M)
assert commits,'Flatpak export commit missing'
receipt={'version':'0.16.24','sourceCommit':sys.argv[2],'flatpakCommit':commits[-1],'sha256':digest,'size':bundle.stat().st_size}
(job/'build-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps(receipt,indent=2))
PY
    ;;
install)
    wait_for build
    (cd "$work" && sha256sum -c gardendless-linux-x64.flatpak.sha256)
    flatpak install --user --assumeyes --reinstall --no-deps --no-related "$work/gardendless-linux-x64.flatpak"
    actual=$(flatpak info --user --show-commit com.zero.gardendless)
    python - "$job/build-receipt.json" "$actual" <<'PY'
import json,sys
from pathlib import Path
assert json.loads(Path(sys.argv[1]).read_text())['flatpakCommit']==sys.argv[2], 'Installed Flatpak differs from build'
PY
    python scripts/aurum/RunFlatpakSmoke.py
    ;;
publish)
    wait_for install
    require_source
    bash scripts/release/PublishV01624.sh "$commit"
    ;;
esac
date -Iseconds > "$job/$mode.ready"
echo "$mode finished successfully."
