import { readdir } from 'node:fs/promises';
import path from 'node:path';
export const moduleDirectory = path.resolve('public/gpnext');
export async function listModules(directory = moduleDirectory, prefix = '') {
  const modules = [];
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const name = path.join(prefix, entry.name);
    if (entry.isDirectory()) modules.push(...await listModules(path.join(directory, entry.name), name));
    else if (entry.name.endsWith('.js')) modules.push(name);
  }
  return modules.sort();
}
