#!/usr/bin/env python3
"""Run browser regressions in disposable WebKit contexts and virtual displays."""
import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os
import shlex
import subprocess
import threading
from urllib.parse import urlsplit, parse_qs

ROOT = Path(__file__).resolve().parents[2]
CHECKS = ['UiStabilitySmoke', 'GameWindowsSmoke', 'OverlaySmoke', 'CullingSmoke']


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / 'public'), **kwargs)

    def send_content(self, content, mime):
        self.send_response(200)
        self.send_header('Content-Type', mime)
        self.end_headers()
        self.wfile.write(content)

    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/__culling.js':
            return self.send_content((ROOT / 'scripts/aurum/CullingFixture.js').read_bytes(), 'text/javascript')
        if path == '/__aurum/Occlusion.js':
            return self.send_content((ROOT / 'mods/aurum/src/Occlusion.js').read_bytes(), 'text/javascript')
        if path != '/__check.html':
            return super().do_GET()
        name = parse_qs(urlsplit(self.path).query).get('name', [''])[0]
        if name not in CHECKS:
            return self.send_error(400)
        if name == 'CullingSmoke':
            content = (ROOT / 'public/launcher/RenderExport.html').read_text().replace(
                '<script type="module" src="launcher/RenderExport.js">',
                '<script>window.__GD_RENDER_LIBRARY__=true;</script><script type="module" src="/__culling.js">').encode()
        else:
            content = (ROOT / 'scripts/checks' / (name + '.html')).read_bytes()
        self.send_content(content, 'text/html')

    def do_POST(self):
        if self.path != '/__result':
            return self.send_error(404)
        size = int(self.headers.get('Content-Length', 0))
        if size < 1 or size > 1024 * 1024:
            return self.send_error(400)
        (ROOT / 'src-tauri/target/aurum/culling-pixel-oracle.json').write_bytes(self.rfile.read(size))
        self.send_content(b'OK', 'text/plain')

    def log_message(self, *args):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('checks', nargs='*', choices=CHECKS, default=CHECKS)
    options = parser.parse_args()
    helper = ROOT / 'src-tauri/target/aurum/webkit-render-probe'
    helper.parent.mkdir(parents=True, exist_ok=True)
    flags = subprocess.check_output(['pkg-config', '--cflags', '--libs', 'webkit2gtk-4.1'], text=True)
    subprocess.run(['cc', str(ROOT / 'scripts/launcher/RenderWebKitSmoke.c'), '-o', str(helper), *shlex.split(flags)], check=True)
    with ThreadingHTTPServer(('127.0.0.1', 0), Handler) as server:
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            for name in options.checks:
                url = f'http://127.0.0.1:{server.server_port}/__check.html?name={name}'
                subprocess.run(['xvfb-run', '-a', '--server-num=177', str(helper), url, '90'],
                               env={**os.environ, 'GDK_BACKEND': 'x11'}, check=True, timeout=110)
        finally:
            server.shutdown()


if __name__ == '__main__':
    main()
