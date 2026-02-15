import fs from 'fs-extra';
import path from 'path';

export async function createBaseFolders() {
  const root = process.cwd();

  const folders = [
    'src',
    'src/components',
    'src/features',
    'src/services',
    'src/hooks',
    'src/utils',
    'src/store',
    'src/theme',
    'src/assets',
    'src/types',
    'src/navigation'
  ];

  for (const folder of folders) {
    await fs.ensureDir(path.join(root, folder));
  }
}