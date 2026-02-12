import fs from 'fs-extra';
import path from 'path';

/* ---------- TS CONFIG ---------- */
export async function setupTsAlias() {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    if (!(await fs.pathExists(tsconfigPath))) return;

    const tsconfig = await fs.readJson(tsconfigPath);

    if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
    if (!tsconfig.compilerOptions.paths) tsconfig.compilerOptions.paths = {};

    tsconfig.compilerOptions.baseUrl = '.';

    Object.assign(tsconfig.compilerOptions.paths, {
        '@src/*': ['src/*'],
        '@components/*': ['src/components/*'],
        '@features/*': ['src/features/*'],
        '@utils/*': ['src/utils/*'],
        '@services/*': ['src/services/*'],
        '@store/*': ['src/store/*'],
        '@hooks/*': ['src/hooks/*'],
        '@theme/*': ['src/theme/*'],
        '@assets/*': ['src/assets/*']
    });

    await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
}

/* ---------- BABEL CONFIG ---------- */
export async function setupBabelAlias() {
    const babelPath = path.join(process.cwd(), 'babel.config.js');
    if (!(await fs.pathExists(babelPath))) return;

    const content = `
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@src': './src',
        '@components': './src/components',
        '@features': './src/features',
        '@utils': './src/utils',
        '@services': './src/services',
        '@store': './src/store',
        '@hooks': './src/hooks',
        '@theme': './src/theme',
        '@assets': './src/assets'
      }
    }],
    'react-native-worklets/plugin'
  ]
};
`;

    await fs.writeFile(babelPath, content);
}