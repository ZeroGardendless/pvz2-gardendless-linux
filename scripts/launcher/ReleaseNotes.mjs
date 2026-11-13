import{readFile,writeFile}from'node:fs/promises';
const {version}=JSON.parse(await readFile('package.json','utf8'));
const notes=await readFile(`docs/releases/v${version}.md`,'utf8');
await writeFile('public/launcher/ReleaseNotes.js',`// Generated from the published release notes.\nexport const RELEASE_VERSION=${JSON.stringify(version)};\nexport const RELEASE_NOTES=${JSON.stringify(notes)};\n`);
