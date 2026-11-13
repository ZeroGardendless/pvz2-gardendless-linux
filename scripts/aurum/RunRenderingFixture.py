#!/usr/bin/env python3
"""Serve an isolated real-Cocos rendering benchmark; results stay under target/."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
root = Path(__file__).resolve().parents[2]
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(root/'public'),**kwargs)
    def do_GET(self):
        path=urlparse(self.path).path
        if path=='/__benchmark.html':
            html=(root/'public/launcher/RenderExport.html').read_text().replace('<script type="module" src="launcher/RenderExport.js">','<script>window.__GD_RENDER_LIBRARY__=true;</script><script type="module" src="/__fixture.js">')
            return self.send(html.encode(),'text/html')
        if path=='/__fixture.js':return self.send((root/'scripts/aurum/RenderingFixture.js').read_bytes(),'text/javascript')
        if path=='/__aurum/Rendering.js':return self.send((root/'mods/aurum/src/Rendering.js').read_bytes(),'text/javascript')
        return super().do_GET()
    def send(self,data,mime):
        self.send_response(200);self.send_header('Content-Type',mime);self.end_headers();self.wfile.write(data)
    def do_POST(self):
        if self.path!='/__result':return self.send_error(404)
        data=self.rfile.read(int(self.headers['Content-Length']))
        (root/'src-tauri/target/aurum/rendering-benchmark.json').write_bytes(data)
        self.send(b'OK','text/plain')
    def log_message(self,*args):pass
ThreadingHTTPServer(('127.0.0.1',18729),Handler).serve_forever()
