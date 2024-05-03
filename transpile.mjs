import assert from "node:assert";
import path from "node:path";
import fs from "fs-extra";
import ts from "typescript";

async function transpileProject({ project, outDir }) {
  const { config } = ts.readConfigFile(project, ts.sys.readFile);
  assert.notStrictEqual(config, undefined);

  const basePath = path.resolve(path.dirname(project));

  const {
    options,
    fileNames: rootNames,
    projectReferences,
    errors,
  } = ts.parseJsonConfigFileContent(config, ts.sys, basePath);

  if (errors.length > 0) {
    console.error(errors);
    process.exit(1);
  }

  const program = ts.createProgram({
    rootNames,
    options,
    host: ts.createCompilerHost(options),
    projectReferences,
  });

  await Promise.all(
    program
      .getSourceFiles()
      .filter((file) => !file.isDeclarationFile)
      .map(async (file) => {
        const declarationFile = ts.transpileDeclaration(file.text, {
          compilerOptions: options,
          reportDiagnostics: true,
        });

        if ((declarationFile.diagnostics ?? []).length > 0) {
          console.error(declarationFile.diagnostics);
          process.exit(1);
        }

        const relativeFilePath = path.relative(basePath, file.fileName);
        const declarationPath = path.join(
          outDir,
          relativeFilePath.replace(/\.tsx?$/, ".d.ts"),
        );

        await fs.ensureDir(path.dirname(declarationPath));
        await fs.writeFile(declarationPath, declarationFile.outputText, {
          encoding: "utf8",
        });
      }),
  );
}

transpileProject({ project: process.argv[2], outDir: process.argv[3] });
