import path from 'path';

export interface ParsedComponent {
  componentName: string;
  fullDir: string;
  relativeDir: string;
}

export function parseComponentName(input: string): ParsedComponent {
  // normalize slashes
  let cleaned = input.replace(/\\/g, '/').trim();

  // remove src prefix if user typed
  if (cleaned.startsWith('src/')) {
    cleaned = cleaned.substring(4);
  }

  const parts = cleaned.split('/');
  const rawName = parts.pop()!;

  // Ensure PascalCase name
  const componentName =
    rawName.charAt(0).toUpperCase() + rawName.slice(1);

  // Always inside components
  const relativeDir =
    parts.length > 0
      ? `src/components/${parts.join('/')}`
      : 'src/components';

  const fullDir = path.join(process.cwd(), relativeDir);

  return {
    componentName,
    fullDir,
    relativeDir
  };
}