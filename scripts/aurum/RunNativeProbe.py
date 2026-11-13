#!/usr/bin/env python3
"""Exercise the actual native bridge with a disposable profile and null audio sink."""
from pathlib import Path
import argparse, json, os, signal, subprocess, time
parser=argparse.ArgumentParser()
parser.add_argument("--script")
parser.add_argument("--screenshot")
parser.add_argument("--phase",default="audio")
parser.add_argument("--timeout",type=int,default=110)
options=parser.parse_args()
root = Path(__file__).resolve().parents[2]
work = root / 'src-tauri/target/aurum'
profile = work / 'native-probe'
source = (Path(options.script) if options.script else work / 'NativeProbe.js').read_text()
log = work / ('level-probe.log' if options.script else 'native-probe.log')
sink = subprocess.check_output(['pactl', 'load-module', 'module-null-sink', 'sink_name=aurum_probe', 'sink_properties=device.description=AurumProbe'], text=True).strip()
process = None
display = next((number for number in range(197,220) if not Path(f"/tmp/.X{number}-lock").exists()),None) if options.screenshot else None
try:
    environment = os.environ.copy()
    environment.update(XDG_DATA_HOME=str(profile / 'data'), XDG_CONFIG_HOME=str(profile / 'config'), XDG_CACHE_HOME=str(profile / 'cache'), PULSE_SINK='aurum_probe', GDK_BACKEND='x11')
    launched = time.time() * 1000
    script = work / 'NativeProbeLaunch.js'
    script.write_text(f'window.__aurumProcessStartMs={launched};\n' + source)
    environment['GARDENDLESS_PROBE_SCRIPT'] = str(script)
    with log.open('w') as output:
        process = subprocess.Popen((['xvfb-run', '--server-num='+str(display)] if display else ['xvfb-run','-a']) + ['--server-args=-screen 0 1920x1200x24'] + [str(root / 'src-tauri/target/debug/gardendless'), '--game'], env=environment, stdout=output, stderr=subprocess.STDOUT, cwd=root, start_new_session=True)
        deadline = time.monotonic() + options.timeout
        while time.monotonic() < deadline:
            text = log.read_text(errors='replace')
            if ('"phase":'+json.dumps(options.phase,separators=(',',':'))) in text:
                if options.screenshot:
                    subprocess.run(['import','-display',':'+str(display),'-window','root',options.screenshot],check=True,timeout=10)
                print(text[-12000:])
                break
            if '"phase":"FAIL"' in text or process.poll() is not None:
                raise RuntimeError(text[-16000:])
            time.sleep(1)
        else:
            raise RuntimeError('Native probe timed out:\n' + log.read_text(errors='replace')[-16000:])
finally:
    if process is not None and process.poll() is None:
        os.killpg(process.pid, signal.SIGTERM)
        try: process.wait(timeout=10)
        except subprocess.TimeoutExpired: os.killpg(process.pid, signal.SIGKILL)
    subprocess.run(['pactl', 'unload-module', sink], check=False)
