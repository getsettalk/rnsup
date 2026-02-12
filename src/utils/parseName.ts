import path from 'path';
import fs from 'fs-extra';

export interface ParsedName {
  screenName: string;
  fullDir: string;
  relativeDir: string;
}

/**
 * Resolve correct location based on user input
 */
export async function parseScreenName(input: string): Promise<ParsedName> {
  // normalize slashes
  let cleaned = input.replace(/\\/g, '/').trim();

  // remove extension if user typed
  cleaned = cleaned.replace(/\.tsx?$/, '');

  // remove src prefix if provided
  if (cleaned.startsWith('src/')) {
    cleaned = cleaned.substring(4);
  }

  const parts = cleaned.split('/');
  const rawName = parts.pop()!;

  // ensure proper screen naming
  const screenName =
    rawName.replace(/screen$/i, '') + 'Screen';

  // if only name passed
  if (parts.length === 0) {
    const dir = path.join(process.cwd(), 'src/screens');

    return {
      screenName,
      fullDir: dir,
      relativeDir: 'src/screens'
    };
  }

  // user provided folder path
  const relativeDir = `src/${parts.join('/')}`;
  const fullDir = path.join(process.cwd(), relativeDir);

  // if folder does not exist, confirm creation later
  await fs.ensureDir(fullDir);

  return {
    screenName,
    fullDir,
    relativeDir
  };
}