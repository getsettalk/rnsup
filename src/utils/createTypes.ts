import fs from 'fs-extra';
import path from 'path';

export async function createTypes() {
  const filePath = path.join(process.cwd(), 'src/types/assets.d.ts');

  await fs.ensureDir(path.dirname(filePath));

  const content = `
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
`;

  await fs.writeFile(filePath, content.trim());
}