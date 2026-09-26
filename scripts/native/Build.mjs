import {constants} from 'node:fs';
import {cp, mkdir, mkdtemp, rm} from 'node:fs/promises';
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
  process.exitCode = result;
} finally {
  await rm(snapshot, {recursive: true, force: true});
}
