#!/usr/bin/env python3
"""Own the asset server and isolated WebKit export workers together."""
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
import argparse
import os
import signal
import socket
import subprocess
import sys
import threading
import time

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / 'src-tauri/target/aurum'
active = set()
lock = threading.Lock()
stopping = threading.Event()


def render(kind, display, port):
    with (WORK / f'render-{kind}-full.log').open('w') as log:
        # Different starting numbers prevent concurrent xvfb-run -a calls from
        # claiming the same display and killing each other's server on exit.
        with lock:
            if stopping.is_set():
                return
            process = subprocess.Popen([
                'xvfb-run', '-a', '--server-num=' + str(display),
                str(WORK / 'webkit-render-probe'),
                f'http://127.0.0.1:{port}/__test.html?kind=' + kind, '7200',
            ], stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
            active.add(process)
        try:
            result = process.wait()
        finally:
            with lock:
                active.discard(process)
        if result:
            raise RuntimeError(f'{kind} renderer failed; inspect its log')
        print(f'{kind} render completed', flush=True)


def interrupted(signum, frame):
    raise KeyboardInterrupt


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--kinds', nargs='+', choices=['plants', 'zombies', 'misc'],
                        default=['plants', 'zombies', 'misc'])
    parser.add_argument('--port', type=int, default=18728)
    options = parser.parse_args()
    signal.signal(signal.SIGTERM, interrupted)
    server = executor = None
    # Reserve widely separated starting numbers, avoiding existing X servers.
    displays = [number for number in range(170, 190)
                if not Path(f'/tmp/.X{number}-lock').exists()][:len(options.kinds)]
    if len(displays) != len(options.kinds):
        raise RuntimeError('No free test displays')
    try:
        with (WORK / 'render-server.log').open('w') as server_log:
            server = subprocess.Popen([
                sys.executable, str(ROOT / 'scripts/launcher/RenderSmokeServer.py'), '--full', '--port', str(options.port),
            ], stdout=server_log, stderr=subprocess.STDOUT)
            for attempt in range(50):
                if server.poll() is not None:
                    raise RuntimeError('Asset server exited; inspect render-server.log')
                try:
                    with socket.create_connection(('127.0.0.1', options.port), timeout=.2):
                        break
                except OSError:
                    time.sleep(.1)
            else:
                raise RuntimeError('Asset server did not become ready')
            executor = ThreadPoolExecutor(max_workers=2)
            futures = [executor.submit(render, kind, display, options.port)
                       for kind, display in zip(options.kinds, displays)]
            for future in as_completed(futures):
                future.result()
    finally:
        # Coordinate starting a process with cancellation so none escape cleanup.
        with lock:
            stopping.set()
            for process in active:
                if process.poll() is None:
                    os.killpg(process.pid, signal.SIGTERM)
        if executor:
            executor.shutdown(wait=True, cancel_futures=True)
        if server:
            server.terminate()
            try:
                server.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server.kill()
                server.wait()


if __name__ == '__main__':
    main()
