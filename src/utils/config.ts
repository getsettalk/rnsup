import fs from 'fs-extra';
import path from 'path';

const DIR = path.join(process.cwd(), '.rnsup');
const CONFIG = path.join(DIR, 'config.json');

export async function saveConfig(data: any) {
  await fs.ensureDir(DIR);
  await fs.writeJson(CONFIG, data, { spaces: 2 });
}

export async function readConfig(): Promise<any | null> {
  if (!(await fs.pathExists(CONFIG))) return null;
  return fs.readJson(CONFIG);
}