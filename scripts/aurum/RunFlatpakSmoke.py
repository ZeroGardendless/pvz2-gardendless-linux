#!/usr/bin/env python3
"""Open the installed launcher/game using owned profiles, displays and a null sink."""
from pathlib import Path
import json
import os
import select
import signal
import subprocess
import time

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / 'src-tauri/target/aurum/flatpak-smoke'
WORK.mkdir(parents=True, exist_ok=True)


def interrupted(signum, frame):
    raise KeyboardInterrupt


for sig in [signal.SIGTERM, signal.SIGHUP]:
    signal.signal(sig, interrupted)

sink = xserver = None
results = []
try:
    sink_name = f'gardendless_smoke_{os.getpid()}'
    sink = subprocess.check_output(['pactl', 'load-module', 'module-null-sink',
                                    'sink_name=' + sink_name], text=True).strip()
    display = next(number for number in range(190, 220)
                   if not Path(f'/tmp/.X{number}-lock').exists())
    xserver = subprocess.Popen(['Xvfb', ':' + str(display), '-screen', '0',
                               '1920x1200x24', '-nolisten', 'tcp'],
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1)
    for phase, arguments, delay in [('launcher', [], 12), ('game', ['--game'], 22)]:
        read_fd, write_fd = os.pipe()
        instance = process = None
        try:
            with (WORK / (phase + '.log')).open('w') as log:
                command = ['flatpak', 'run', '--instance-id-fd=' + str(write_fd),
                           '--filesystem=' + str(WORK), '--env=GDK_BACKEND=x11',
                           '--command=env', 'com.zero.gardendless']
                # Set XDG paths after Flatpak initializes its protected defaults.
                for kind in ['DATA', 'CONFIG', 'CACHE']:
                    directory = WORK / kind.lower()
                    directory.mkdir(exist_ok=True)
                    command.append(f'XDG_{kind}_HOME={directory}')
                command += ['PULSE_SINK=' + sink_name, '/app/bin/gardendless', *arguments]
                process = subprocess.Popen(command, env={**os.environ, 'DISPLAY': ':' + str(display)},
                                           pass_fds=(write_fd,), stdout=log, stderr=subprocess.STDOUT)
                os.close(write_fd)
                write_fd = None
                if not select.select([read_fd], [], [], 10)[0]:
                    raise RuntimeError('No Flatpak test instance ID')
                instance = os.read(read_fd, 1024).decode().strip()
                time.sleep(delay)
                if process.poll() is not None:
                    raise RuntimeError((WORK / (phase + '.log')).read_text())
                screenshot = WORK / (phase + '.png')
                subprocess.run(['import', '-display', ':' + str(display), '-window', 'root',
                                str(screenshot)], check=True, timeout=10)
                results.append({'phase': phase, 'alive': True, 'screenshot': str(screenshot),
                                'note': 'Startup/process check; audible and physical-GPU gameplay unverified.'})
                print(phase + ' alive; screenshot captured; owned instance ' + instance, flush=True)
        finally:
            os.close(read_fd)
            if write_fd is not None:
                os.close(write_fd)
            if instance:
                subprocess.run(['flatpak', 'kill', instance], stdout=subprocess.DEVNULL,
                               stderr=subprocess.DEVNULL)
            if process:
                try:
                    process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    process.terminate()
                    process.wait(timeout=5)
    (WORK / 'result.json').write_text(json.dumps(results, indent=2) + '\n')
finally:
    if xserver:
        xserver.terminate()
        xserver.wait()
    if sink:
        subprocess.run(['pactl', 'unload-module', sink], check=False)
