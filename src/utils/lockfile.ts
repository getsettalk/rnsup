import fs from 'fs-extra';
import path from 'path';

export async function fixLockFile(manager: string) {
  const root = process.cwd();

  const npmLock = path.join(root, 'package-lock.json');
  const yarnLock = path.join(root, 'yarn.lock');

  if (manager === 'yarn') {
    if (await fs.pathExists(npmLock)) {
      await fs.remove(npmLock);
      console.log('Removed package-lock.json (using yarn)');
    }
  }

  if (manager === 'npm') {
    if (await fs.pathExists(yarnLock)) {
      await fs.remove(yarnLock);
      console.log('Removed yarn.lock (using npm)');
    }
  }
}