import base64, json, mimetypes
from pathlib import Path
assets={}
for p in Path('invitation').iterdir():
    assets['/'+p.name]={'type':mimetypes.guess_type(p.name)[0] or 'application/octet-stream','data':base64.b64encode(p.read_bytes()).decode()}
out=Path('dist/server/index.js')
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text('const assets = '+json.dumps(assets)+';\n'+Path('worker/handler.mjs').read_text())
