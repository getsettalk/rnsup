import fs from 'fs-extra';
import path from 'path';

/**
 * Register new alias in tsconfig + babel automatically
 */
export async function registerAlias(relativeDir: string) {
  // example: src/payments/checkout
  if (!relativeDir.startsWith('src/')) return;

  const parts = relativeDir.replace('src/', '').split('/');
  const baseAlias = parts[0];

  // we only create alias for first level
  // ex: src/payments/... => @payments
  const aliasKey = `@${baseAlias}`;
  const aliasPath = `./src/${baseAlias}`;

  await updateTSConfig(aliasKey, aliasPath);
  await updateBabel(aliasKey, aliasPath);
}

/* ---------------- TS CONFIG ---------------- */

async function updateTSConfig(aliasKey: string, aliasPath: string) {
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (!(await fs.pathExists(tsconfigPath))) return;

  const tsconfig = await fs.readJson(tsconfigPath);

  if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
  if (!tsconfig.compilerOptions.paths) tsconfig.compilerOptions.paths = {};

  if (!tsconfig.compilerOptions.paths[`${aliasKey}/*`]) {
    tsconfig.compilerOptions.paths[`${aliasKey}/*`] = [`${aliasPath}/*`];
    await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
    console.log(`Alias added in tsconfig: ${aliasKey}`);
  }
}

/* ---------------- BABEL ---------------- */

async function updateBabel(aliasKey: string, aliasPath: string) {
  const babelPath = path.join(process.cwd(), 'babel.config.js');
  if (!(await fs.pathExists(babelPath))) return;

  let content = await fs.readFile(babelPath, 'utf8');

  if (content.includes(aliasKey)) return;

  const insertPoint = content.indexOf('alias: {');

  if (insertPoint === -1) return;

  const updated =
    content.slice(0, insertPoint + 8) +
    `\n        '${aliasKey}': '${aliasPath}',` +
    content.slice(insertPoint + 8);

  await fs.writeFile(babelPath, updated);
  console.log(`Alias added in babel: ${aliasKey}`);
}