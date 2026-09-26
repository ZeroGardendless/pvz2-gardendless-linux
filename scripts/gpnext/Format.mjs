import { moduleDirectory, listModules } from "./Modules.mjs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { transform } from "esbuild";

const assetDirectory = moduleDirectory;
const checkOnly = process.argv.includes("--check");

// The checked-in GP-Next delivery contains Rollup output rather than author
// sources or source maps. Reprint each live module without minifying
// it. The following naming pass makes current exported APIs and their imports
// readable while keeping the browser-global API and behavior intact.
// Obsolete old-* chunks have been removed from the live module graph.
const moduleNames = await listModules();

const staleFiles = [];

for (const moduleName of moduleNames) {
  const modulePath = path.join(assetDirectory, moduleName);
  const input = await readFile(modulePath, "utf8");
  const { code } = await transform(input, {
    loader: "js",
    format: "esm",
    target: "esnext",
    minify: false,
    legalComments: "inline",
  });

  if (code === input) continue;
  if (checkOnly) {
    staleFiles.push(moduleName);
  } else {
    await writeFile(modulePath, code);
  }
}

if (staleFiles.length) {
  console.error(`GP-Next modules need formatting: ${staleFiles.join(", ")}`);
  process.exitCode = 1;
} else if (checkOnly) {
  console.log(`Checked ${moduleNames.length} GP-Next modules.`);
} else {
  console.log(`Formatted ${moduleNames.length} GP-Next modules.`);
}
