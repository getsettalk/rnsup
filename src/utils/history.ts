import fs from 'fs-extra';
import path from 'path';

const FILE = path.join(process.cwd(), '.rnsup', 'history.json');

export async function addHistory(action: string) {
  await fs.ensureFile(FILE);

  let list: any[] = [];
  try {
    list = await fs.readJson(FILE);
  } catch {
    list = [];
  }

  list.push({
    action,
    date: new Date().toISOString()
  });

  await fs.writeJson(FILE, list, { spaces: 2 });
}