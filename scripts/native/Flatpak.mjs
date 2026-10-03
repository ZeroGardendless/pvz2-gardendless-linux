import {constants} from 'node:fs';
import {cp, mkdir, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';

const root = path.resolve(import.meta.dirname, '../..');
const target = path.join(root, 'src-tauri/target/flatpak');
const source = path.join(target, 'source');
const app = path.join(target, 'app');
const repo = path.join(target, 'repo');
const manifest = JSON.parse(await readFile(path.join(root, 'packaging/flatpak/com.zero.gardendless.json'), 'utf8'));
const prepareOnly = process.argv.includes('--prepare');

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {cwd: root, stdio: 'inherit', ...options});
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
  });
}

try {
  if (process.platform !== 'linux' || process.arch !== 'x64') {
    throw new Error('This Flatpak recipe currently targets Linux x86_64.');
  }
  if (!prepareOnly) {
    for (const reference of [
      `${manifest.sdk}//${manifest['runtime-version']}`,
      `${manifest.runtime}//${manifest['runtime-version']}`,
      ...manifest['sdk-extensions'],
    ]) {
      await run('flatpak', ['info', reference], {stdio: 'ignore'});
    }
  }
  await run('npm', ['run', 'check']);
  await mkdir(target, {recursive: true});
  await rm(source, {recursive: true, force: true});
  await mkdir(source, {recursive: true});
  for (const entry of ['public', 'packaging']) {
    await cp(path.join(root, entry), path.join(source, entry), {
      recursive: true,
      mode: constants.COPYFILE_FICLONE,
      filter: candidate => !candidate.startsWith(path.join(root, 'src-tauri/target')),
    });
  }
  // Node rejects copying a parent into its descendant even with a filter.
  // Copy the native project's entries individually, excluding build outputs.
  await mkdir(path.join(source, 'src-tauri'), {recursive: true});
  for (const entry of await readdir(path.join(root, 'src-tauri'))) {
    if (entry === 'target') continue;
    await cp(path.join(root, 'src-tauri', entry), path.join(source, 'src-tauri', entry), {
      recursive: true, mode: constants.COPYFILE_FICLONE,
    });
  }
  await mkdir(path.join(source, '.cargo'), {recursive: true});
  // Cargo verifies every vendored crate against Cargo.lock. All compilation
  // happens offline; neither a registry token nor the host Cargo home is mounted.
  await run('cargo', ['vendor', '--locked', '--offline', '--manifest-path', 'src-tauri/Cargo.toml', 'vendor'], {cwd: source});
  await writeFile(path.join(source, '.cargo/config.toml'), '[source.crates-io]\nreplace-with = "vendored-sources"\n[source.vendored-sources]\ndirectory = "vendor"\n');
  await writeFile(path.join(target, 'com.zero.gardendless.json'), JSON.stringify(manifest, null, 2) + '\n');
  if (!prepareOnly) {
    await rm(app, {recursive: true, force: true});
    await run('flatpak', ['build-init', '--arch=x86_64', ...manifest['sdk-extensions'].map(extension => `--sdk-extension=${extension}`), app, manifest['app-id'], manifest.sdk, manifest.runtime, manifest['runtime-version']]);
    const buildTarget = path.join(target, 'cargo-target');
    await mkdir(buildTarget, {recursive: true});
    await run('flatpak', [
      'build', '--unshare=network', `--bind-mount=/run/build/gardendless=${source}`,
      `--bind-mount=/run/build/target=${buildTarget}`, '--build-dir=/run/build/gardendless',
      '--env=CARGO_TARGET_DIR=/run/build/target', '--env=CARGO_BUILD_JOBS=2',
      '--env=CARGO_HOME=/run/build/gardendless/cargo-home',
      '--env=PATH=/usr/lib/sdk/rust-stable/bin:/usr/bin',
      app, 'sh', 'packaging/flatpak/Build.sh',
    ]);
    await run('flatpak', ['build-finish', `--command=${manifest.command}`, ...manifest['finish-args'], app]);
    await run('flatpak', ['build-export', '--arch=x86_64', repo, app, 'test']);
    const artifact = path.join(target, 'gardendless-linux-x64.flatpak');
    await run('flatpak', ['build-bundle', '--arch=x86_64', '--runtime-repo=https://dl.flathub.org/repo/flathub.flatpakrepo', repo, artifact, manifest['app-id'], 'test']);
    console.log(`\nFlatpak: ${artifact}`);
  } else {
    console.log(`\nPrepared offline Flatpak sources: ${target}`);
  }
} catch (error) {
  console.error(error.message);
  console.error('Build prerequisites: GNOME SDK/Platform 50 and org.freedesktop.Sdk.Extension.rust-stable//25.08. See docs/platforms/Flatpak.md.');
  process.exitCode = 1;
}
