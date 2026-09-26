import { moduleDirectory, listModules } from "./Modules.mjs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { transform } from "esbuild";
import ts from "typescript";

const assetDirectory = moduleDirectory;
const checkOnly = process.argv.includes("--check");
const moduleNames = await listModules();
const fileNames = moduleNames.map((name) => path.join(assetDirectory, name));
const reservedNames = new Set([
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "try",
  "var",
  "void",
  "while",
  "with",
  "yield",
]);
const exportHints = new Map([
  ["Overlay.js", {
    a: "showOverlay",
    i: "setOverlayHotkey",
    n: "createOverlay",
    r: "isOverlayOpen",
    t: "hideOverlay",
  }],
]);
const functionHints = new Map([
  ["Overlay.js", {
    $: "switchTab",
    B: "updateTabOverflowMenu",
    F: "setCanvasPointerEvents",
    G: "runTabLifecycleHook",
    H: "shouldHandleToggleHotkey",
    I: "renderTabButtons",
    J: "toggleOverlay",
    K: "showOverlay",
    L: "closeTabPicker",
    M: "buildOverlayDom",
    N: "renderFooter",
    P: "bindOverlayKeyboardShortcuts",
    Q: "setOverlayHotkey",
    R: "getTabButtons",
    U: "updateHotkeyHint",
    V: "handleTabNavigationKeydown",
    W: "renderActiveTab",
    X: "setStatus",
    Y: "isOverlayOpen",
    Z: "setVersion",
    ae: "setUpdateState",
    ce: "createOverlay",
    ie: "getOverlayHotkey",
    j: "injectOverlayStyles",
    ne: "isEditableTarget",
    oe: "bindUpdateActions",
    q: "hideOverlay",
    re: "setStatusFromKey",
    se: "registerTab",
    z: "scrollSelectedTabIntoView",
  }],
]);
const sourceText = new Map(
  await Promise.all(fileNames.map(async (fileName) => [fileName, await readFile(fileName, "utf8")]))
);
const compilerOptions = {
  allowJs: true,
  checkJs: false,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  target: ts.ScriptTarget.ESNext,
};

function makeLanguageService() {
  const host = {
    getCompilationSettings: () => compilerOptions,
    getCurrentDirectory: () => process.cwd(),
    getDefaultLibFileName: ts.getDefaultLibFilePath,
    getScriptFileNames: () => fileNames,
    getScriptSnapshot(fileName) {
      if (sourceText.has(fileName)) return ts.ScriptSnapshot.fromString(sourceText.get(fileName));
      return ts.sys.fileExists(fileName)
        ? ts.ScriptSnapshot.fromString(ts.sys.readFile(fileName))
        : undefined;
    },
    getScriptVersion: (fileName) => String(sourceText.get(fileName)?.length ?? 0),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => "\n",
  };
  return ts.createLanguageService(host, ts.createDocumentRegistry());
}

function declaredNames(sourceFile) {
  const names = new Set();
  function visit(node) {
    if (
      (ts.isVariableDeclaration(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isClassDeclaration(node) ||
        ts.isImportClause(node) ||
        ts.isImportSpecifier(node)) &&
      node.name &&
      ts.isIdentifier(node.name)
    ) {
      names.add(node.name.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return names;
}

function applyRenames(requests, languageService) {
  const fileEdits = new Map();
  for (const { fileName, position, newName } of requests) {
    const locations = languageService.findRenameLocations(fileName, position, false, false, {
      providePrefixAndSuffixTextForRename: false,
    });
    if (!locations?.length) continue;
    for (const location of locations) {
      const edits = fileEdits.get(location.fileName) ?? [];
      edits.push({
        start: location.textSpan.start,
        end: location.textSpan.start + location.textSpan.length,
        newName,
      });
      fileEdits.set(location.fileName, edits);
    }
  }

  let changedFiles = 0;
  for (const [fileName, edits] of fileEdits) {
    const original = sourceText.get(fileName);
    const seen = new Set();
    const uniqueEdits = edits
      .sort((a, b) => b.start - a.start)
      .filter((edit) => {
        const key = `${edit.start}:${edit.end}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    let updated = original;
    for (const edit of uniqueEdits) {
      updated = updated.slice(0, edit.start) + edit.newName + updated.slice(edit.end);
    }
    if (updated !== original) {
      sourceText.set(fileName, updated);
      changedFiles += 1;
    }
  }
  return changedFiles;
}

// Repeat because one module's newly readable export can make an import alias
// readable on the next pass through a chain of lazy-loaded modules.
let converged = false;
for (let pass = 0; pass < 12; pass += 1) {
  let changesThisPass = 0;
  const exportService = makeLanguageService();
  const exportRenames = [];

  for (const fileName of fileNames) {
    const sourceFile = ts.createSourceFile(
      fileName,
      sourceText.get(fileName),
      ts.ScriptTarget.ESNext,
      true,
      ts.ScriptKind.JS
    );
    const names = declaredNames(sourceFile);
    const moduleName = path.basename(fileName);
    const moduleExportHints = exportHints.get(moduleName) ?? {};
    const moduleFunctionHints = functionHints.get(moduleName) ?? {};
    function visit(node) {
      if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
        for (const specifier of node.exportClause.elements) {
          const localName = specifier.propertyName ?? specifier.name;
          const publicName = specifier.name.text;
          const recoveredName = moduleExportHints[publicName] ?? publicName;
          if (
            recoveredName.length < 2 ||
            reservedNames.has(recoveredName) ||
            localName.text === recoveredName ||
            names.has(recoveredName)
          ) continue;
          const renameInfo = exportService.getRenameInfo(fileName, localName.getStart(sourceFile));
          if (renameInfo.canRename) {
            exportRenames.push({
              fileName,
              position: localName.getStart(sourceFile),
              newName: recoveredName,
            });
          }
        }
      }
      if (ts.isFunctionDeclaration(node) && node.name) {
        const recoveredName = moduleFunctionHints[node.name.text];
        if (recoveredName && !names.has(recoveredName)) {
          const renameInfo = exportService.getRenameInfo(fileName, node.name.getStart(sourceFile));
          if (renameInfo.canRename) {
            exportRenames.push({
              fileName,
              position: node.name.getStart(sourceFile),
              newName: recoveredName,
            });
          }
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(sourceFile);
  }
  changesThisPass += applyRenames(exportRenames, exportService);

  // Give imported API bindings the names they already advertise at the module
  // boundary. Skip ambiguous names so this pass cannot create duplicate locals.
  const importService = makeLanguageService();
  const importCandidates = [];
  const importNameCounts = new Map();

  for (const fileName of fileNames) {
    const sourceFile = ts.createSourceFile(
      fileName,
      sourceText.get(fileName),
      ts.ScriptTarget.ESNext,
      true,
      ts.ScriptKind.JS
    );
    const names = declaredNames(sourceFile);
    function addCandidate(localIdentifier, publicIdentifier) {
      if (localIdentifier.text === publicIdentifier.text || names.has(publicIdentifier.text)) return;
      const key = `${fileName}:${publicIdentifier.text}`;
      importNameCounts.set(key, (importNameCounts.get(key) ?? 0) + 1);
      importCandidates.push({
        fileName,
        position: localIdentifier.getStart(sourceFile),
        newName: publicIdentifier.text,
        key,
      });
    }
    function visit(node) {
      if (ts.isImportDeclaration(node) && node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings)) {
        for (const specifier of node.importClause.namedBindings.elements) {
          if (specifier.propertyName) addCandidate(specifier.name, specifier.propertyName);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(sourceFile);
  }

  const safeImportRenames = importCandidates.filter((candidate) => importNameCounts.get(candidate.key) === 1);
  changesThisPass += applyRenames(safeImportRenames, importService);
  if (changesThisPass === 0) {
    converged = true;
    break;
  }
}

if (!converged) throw Error("GP-Next API naming did not converge after 12 passes.");

const changedFiles = [];
for (const fileName of fileNames) {
  const before = await readFile(fileName, "utf8");
  const { code: after } = await transform(sourceText.get(fileName), {
    loader: "js",
    format: "esm",
    target: "esnext",
    minify: false,
    legalComments: "inline",
  });
  sourceText.set(fileName, after);
  if (before === after) continue;
  changedFiles.push(path.basename(fileName));
  if (!checkOnly) await writeFile(fileName, after);
}

if (changedFiles.length) {
  if (checkOnly) {
    console.error(`GP-Next module names need normalization: ${changedFiles.join(", ")}`);
    process.exitCode = 1;
  } else {
    console.log(`Named exported APIs across ${changedFiles.length} GP-Next modules.`);
  }
} else {
  console.log(`Checked exported names in ${moduleNames.length} GP-Next modules.`);
}
