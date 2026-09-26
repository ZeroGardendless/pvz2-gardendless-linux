import hashlib
import importlib.util
from pathlib import Path
import tempfile
import zipfile

spec=importlib.util.spec_from_file_location('bundle', 'scripts/assets/game-bundle.py')
bundle=importlib.util.module_from_spec(spec);spec.loader.exec_module(bundle)
with tempfile.TemporaryDirectory() as directory:
    root=Path(directory);source=root/'source';target=root/'target';archive=root/'resources.zip'
    (source/'assets').mkdir(parents=True);(source/'assets/a.bin').write_bytes(b'resource')
    (source/'gpnext').mkdir();(source/'gpnext/Main.js').write_text('overlay source')
    (source/'index.html').write_text('host source')
    bundle.pack(source,archive)
    digest=hashlib.sha256(archive.read_bytes()).hexdigest()
    bundle.unpack(target,archive,digest)
    assert (target/'assets/a.bin').read_bytes()==b'resource'
    assert not (target/'gpnext').exists() and not (target/'index.html').exists()
    for bad in ['gpnext/Main.js','assets/../../index.html','C:/file','assets/a:stream','/absolute']:
        with zipfile.ZipFile(archive,'w') as zip_:zip_.writestr(bad,'blocked')
        digest=hashlib.sha256(archive.read_bytes()).hexdigest()
        try:bundle.unpack(target,archive,digest)
        except ValueError:pass
        else:raise AssertionError(bad)
    try:bundle.unpack(target,archive,'wrong')
    except ValueError:pass
    else:raise AssertionError('Wrong digest accepted')
print('Passed: resource archive round-trip, overlay exclusion, path validation and checksum rejection.')
