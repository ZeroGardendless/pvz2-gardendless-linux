import {constants} from 'node:fs';
import {cp, copyFile, mkdir, mkdtemp, rm, writeFile} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {applyCocosPatches} from '../assets/PatchCocos.mjs';

await applyCocosPatches();

// Build an immutable copy so editing assets during compilation cannot invalidate
// Tauri's embedded-asset map. Reflinks avoid a second physical copy when supported.
const arguments_ = process.argv.slice(2);
const target = path.resolve('src-tauri/target');
await mkdir(target, {recursive: true});
const snapshot = await mkdtemp(path.join(target, 'frontend-build-'));
try {
  await cp('public', snapshot, {recursive: true, mode: constants.COPYFILE_FICLONE});
  const config = JSON.stringify({build: {frontendDist: snapshot}});
  const result = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [
      'node_modules/@tauri-apps/cli/tauri.js', 'build', '--no-bundle', '--config', config, ...arguments_
    ], {stdio: 'inherit', env: {...process.env, CARGO_BUILD_JOBS: process.env.CARGO_BUILD_JOBS || '2'}});
    child.once('error', reject);
    child.once('exit', code => resolve(code ?? 1));
  });
  if (result === 0 && process.platform === 'linux') {
    const source = path.join(target, 'release', 'gardendless');
    const artifact = path.join(target, 'release', 'gardendless-linux-x64');
    await copyFile(source, artifact, constants.COPYFILE_FICLONE);
    const hash = createHash('sha256');
    for await (const chunk of createReadStream(artifact)) hash.update(chunk);
    await writeFile(`${artifact}.sha256`, `${hash.digest('hex')}  ${path.basename(artifact)}\n`);
    console.log(`Linux binary: ${artifact}`);
  }
  process.exitCode = result;
} finally {
  await rm(snapshot, {recursive: true, force: true});
}
