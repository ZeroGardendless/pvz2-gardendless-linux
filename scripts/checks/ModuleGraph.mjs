import { moduleDirectory, listModules } from "../gpnext/Modules.mjs";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const assetDirectory = moduleDirectory;
const fileNames = (await listModules())
  .map((name) => path.join(assetDirectory, name));
const program = ts.createProgram(fileNames, {
  allowJs: true,
  checkJs: false,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  noEmit: true,
  skipLibCheck: true,
  target: ts.ScriptTarget.ESNext,
});
const issues = [
  ...program.getSyntacticDiagnostics(),
  ...ts.getPreEmitDiagnostics(program).filter((diagnostic) => diagnostic.code === 2305 || diagnostic.code === 2307),
];
const checker = program.getTypeChecker();
const checkedFiles = new Set(fileNames.map((fileName) => path.resolve(fileName)));
const missingNamedExports = [];
const missingFiles = new Set();
const missingDynamicImportExports = [];

function resolveLocalModule(specifier, importingFile) {
  const resolved = ts.resolveModuleName(
    specifier,
    importingFile,
    program.getCompilerOptions(),
    ts.sys
  ).resolvedModule;
  const targetFile = resolved && path.resolve(resolved.resolvedFileName);
  const targetSource = targetFile && checkedFiles.has(targetFile)
    ? program.getSourceFile(targetFile)
    : undefined;
  return targetSource?.symbol
    ? new Set(checker.getExportsOfModule(targetSource.symbol).map((symbol) => symbol.getName()))
    : undefined;
}

for (const fileName of fileNames) {
  const sourceFile = program.getSourceFile(fileName);
  if (!sourceFile) continue;

  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const specifier = node.text;
      const isImport = ts.isImportDeclaration(node.parent) || ts.isExportDeclaration(node.parent)
        || (ts.isCallExpression(node.parent) && node.parent.expression.kind === ts.SyntaxKind.ImportKeyword);
      if (isImport && specifier.startsWith('.') && !existsSync(path.resolve(path.dirname(fileName), specifier))) {
        missingFiles.add(`${path.relative(assetDirectory, fileName)}: ${specifier}`);
      }
      if (specifier.startsWith('gpnext/') && !existsSync(path.resolve('public', specifier))) {
        missingFiles.add(`preload: ${specifier}`);
      }
    }
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text.startsWith(".") &&
      node.importClause?.namedBindings &&
      ts.isNamedImports(node.importClause.namedBindings)
    ) {
      const exports = resolveLocalModule(node.moduleSpecifier.text, fileName);
      if (exports) {
        for (const specifier of node.importClause.namedBindings.elements) {
          const importedName = specifier.propertyName?.text ?? specifier.name.text;
          if (!exports.has(importedName)) {
            missingNamedExports.push({
              fileName,
              position: specifier.getStart(sourceFile),
              target: node.moduleSpecifier.text,
              importedName,
            });
          }
        }
      }
    }

    // Lazy chunks often destructure their exports from an awaited import. These
    // bindings aren't covered by ImportDeclaration diagnostics and can leave a
    // tab renderer undefined at runtime after readable export renaming.
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0]) &&
      ts.isAwaitExpression(node.parent) &&
      ts.isVariableDeclaration(node.parent.parent) &&
      ts.isObjectBindingPattern(node.parent.parent.name)
    ) {
      const exports = resolveLocalModule(node.arguments[0].text, fileName);
      if (exports) {
        for (const binding of node.parent.parent.name.elements) {
          const importedName = binding.propertyName && ts.isIdentifier(binding.propertyName)
            ? binding.propertyName.text
            : ts.isIdentifier(binding.name)
              ? binding.name.text
              : undefined;
          if (importedName && !exports.has(importedName)) {
            missingDynamicImportExports.push({
              fileName,
              position: binding.getStart(sourceFile),
              target: node.arguments[0].text,
              importedName,
            });
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

if (issues.length) {
  for (const issue of issues) {
    const fileName = issue.file?.fileName ?? "GP-Next module graph";
    const line = issue.file?.getLineAndCharacterOfPosition(issue.start ?? 0).line;
    console.error(`${path.basename(fileName)}${line === undefined ? "" : `:${line + 1}`}: ${ts.flattenDiagnosticMessageText(issue.messageText, " ")}`);
  }
  process.exitCode = 1;
}

for (const issue of missingNamedExports) {
  const sourceFile = program.getSourceFile(issue.fileName);
  const line = sourceFile?.getLineAndCharacterOfPosition(issue.position).line;
  console.error(`${path.basename(issue.fileName)}${line === undefined ? "" : `:${line + 1}`}: ${issue.target} does not export ${issue.importedName}.`);
}
if (missingNamedExports.length) process.exitCode = 1;
for (const issue of missingDynamicImportExports) {
  const sourceFile = program.getSourceFile(issue.fileName);
  const line = sourceFile?.getLineAndCharacterOfPosition(issue.position).line;
  console.error(`${path.basename(issue.fileName)}${line === undefined ? "" : `:${line + 1}`}: dynamic import of ${issue.target} does not export ${issue.importedName}.`);
}
if (missingDynamicImportExports.length) process.exitCode = 1;
if (!issues.length && !missingNamedExports.length && !missingDynamicImportExports.length) {
  console.log(`Checked syntax, static and lazy named exports, and module imports across ${fileNames.length} GP-Next modules.`);
}

const hostHtml = await readFile('public/index.html', 'utf8');
for (const match of hostHtml.matchAll(/(?:src|href)="(\/gpnext\/[^"?#]+)"/g)) {
  if (!existsSync(path.resolve('public', '.' + match[1]))) missingFiles.add(`HTML: ${match[1]}`);
}
for (const fileName of fileNames) {
  if (!/^[A-Z][A-Za-z0-9]*\.js$/.test(path.basename(fileName))) missingFiles.add(`Non-PascalCase filename: ${fileName}`);
}
if (missingFiles.size) {
  console.error([...missingFiles].join('\n'));
  process.exitCode = 1;
} else console.log('Checked HTML entrypoints, preload targets, and PascalCase filenames.');
