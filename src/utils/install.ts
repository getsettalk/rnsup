import { execa } from 'execa';

export async function installPackages(
  manager: string,
  packages: string[],
  dev = false
) {
  if (!packages.length) return;

  let cmd = '';
  let args: string[] = [];

  if (manager === 'yarn') {
    cmd = 'yarn';
    args = ['add', ...packages];
    if (dev) args.push('-D');
  } else if (manager === 'pnpm') {
    cmd = 'pnpm';
    args = ['add', ...packages];
    if (dev) args.push('-D');
  } else {
    cmd = 'npm';
    args = ['install', ...packages];
    if (dev) args.push('--save-dev');
  }

  await execa(cmd, args, { stdio: 'inherit' });
}