import fs from 'fs';
import path from 'path';

export function isReactNativeProject(): boolean {
  const root = process.cwd();

  const packageJson = path.join(root, 'package.json');
  const androidFolder = path.join(root, 'android');
  const iosFolder = path.join(root, 'ios');

  if (!fs.existsSync(packageJson)) return false;
  if (!fs.existsSync(androidFolder)) return false;
  if (!fs.existsSync(iosFolder)) return false;

  return true;
}