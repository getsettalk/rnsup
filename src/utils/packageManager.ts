import { execSync } from 'child_process';

export type PackageManager = 'npm' | 'yarn' | 'pnpm';

export function isInstalled(manager: PackageManager): boolean {
  try {
    if (manager === 'yarn') {
      execSync('yarn --version', { stdio: 'ignore' });
      return true;
    }

    if (manager === 'pnpm') {
      execSync('pnpm --version', { stdio: 'ignore' });
      return true;
    }

    // npm always exists with node
    if (manager === 'npm') return true;

    return false;
  } catch {
    return false;
  }
}