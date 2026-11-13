#!/usr/bin/env python3
"""Real Cocos/WebKit export smoke server. Only generated test files are written."""
import argparse,base64,json
from urllib.parse import urlsplit,parse_qs
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
root=Path(__file__).resolve().parents[2]
parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=18728);parser.add_argument('--full',action='store_true');parser.add_argument('--only');options=parser.parse_args()
work=root/'src-tauri/target/aurum/render-full-quality';work.mkdir(parents=True,exist_ok=True)
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(root/'public'),**kwargs)
 def do_GET(self):
  if urlsplit(self.path).path=='/__test.html':
   kind=parse_qs(urlsplit(self.path).query).get('kind',['all'])[0]
   if kind not in ['all','plants','zombies','misc']:return self.send_error(400)
   source=(root/'public/launcher/RenderExport.html').read_text()
   script='''<script>window.__GD_RENDER_TEST_OPTIONS__={kinds:['plants','zombies','misc'],scale:4,actions:true,includeExtras:false};window.__TAURI_INTERNALS__={invoke:async(command,args)=>{await fetch('/__capture',{method:'POST',body:JSON.stringify({command,args,job:window.__GD_RENDER_JOB__||'all'})});if(command==='render_export_finish'){document.title='RESULT: PASS '+args.manifest.entries.length+' PNGs; '+args.manifest.failures.length+' unsupported/failed';return 'test.zip';}}};setInterval(()=>{if(document.querySelector('#status')?.textContent==='Export failed')document.title='RESULT: FAIL '+document.querySelector('#details').textContent;},500);</script>'''
   script=script.replace('<script>', '<script>window.__GD_RENDER_JOB__='+json.dumps(kind)+';',1)
   if kind!='all':script=script.replace("kinds:['plants','zombies','misc']",'kinds:'+json.dumps([kind]))
   if options.full:script=script.replace('includeExtras:false','includeExtras:true')
   return self.send(source.replace('<script type="module" src="launcher/RenderExport.js">',script+'<script type="module" src="launcher/RenderExport.js">').encode(),'text/html')
  if self.path=='/launcher/RenderCatalog.js' and (not options.full or options.only):
   source=(root/'public/launcher/RenderCatalog.js').read_text();entries=json.loads(source.split('=',1)[1].split(';\n',1)[0]);selected=[entry for entry in entries if entry['codename'] in ['peashooter','wallnut','tallnut','lychee','moonflower','shadowpeashooter','umbrellaleaf','treasureyeti','tutorial_armor2','abbot','abbot_armor3'] or entry['prefab'] in ['projectiles/PeaPRJ','droppings/SunDROP','armors/BasicConeARMOR']]
   if options.only:selected=[entry for entry in entries if entry['codename'] in options.only.split(',')]
   return self.send(('export const RENDER_ENTRIES='+json.dumps(selected)+';\nexport const RENDER_ARMORS='+source.split('export const RENDER_ARMORS=',1)[1]).encode(),'text/javascript')
  return super().do_GET()
 def send(self,data,mime):self.send_response(200);self.send_header('Content-Type',mime);self.end_headers();self.wfile.write(data)
 def do_POST(self):
  data=json.loads(self.rfile.read(int(self.headers['Content-Length'])));args=data['args']
  if data['command']=='render_export_png':
   relative=Path(args['name']);assert not relative.is_absolute() and '..' not in relative.parts
   destination=work/relative;destination.parent.mkdir(parents=True,exist_ok=True);destination.write_bytes(base64.b64decode(args['base64']))
  else:
   job=data.get('job','all');assert job in ['all','plants','zombies','misc']
   (work/('manifest-'+job+'.json')).write_text(json.dumps(args['manifest'],indent=2))
  self.send(b'OK','text/plain')
 def log_message(self,*args):pass
ThreadingHTTPServer(('127.0.0.1',options.port),Handler).serve_forever()
