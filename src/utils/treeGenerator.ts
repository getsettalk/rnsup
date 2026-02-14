import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export interface TreeNode {
  name: string;
  level: number;
  isDir: boolean;
  path: string;
  size?: number;
  relativePath: string;
  mtime?: Date;
}

async function getDirectoryTree(
  dirPath: string,
  baseDir: string,
  level = 0,
  maxDepth = 10,
  ignorePatterns: string[] = ['node_modules', '.git', 'dist', 'build', '.rnsup']
): Promise<TreeNode[]> {
  const nodes: TreeNode[] = [];

  if (level > maxDepth) return nodes;

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    const filtered = entries.filter(entry => {
      return !ignorePatterns.includes(entry.name) && !entry.name.startsWith('.');
    });

    // Sort: directories first, then alphabetically
    const sorted = filtered.sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) {
        return b.isDirectory() ? 1 : -1;
      }
      return a.name.localeCompare(b.name);
    });

    for (const entry of sorted) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(baseDir, fullPath);

      let size: number | undefined;
      let mtime: Date | undefined;
      
      try {
        const stats = await fs.stat(fullPath);
        if (!entry.isDirectory()) {
          size = stats.size;
        }
        mtime = stats.mtime || stats.birthtime;
      } catch {}

      nodes.push({
        name: entry.name,
        level,
        isDir: entry.isDirectory(),
        path: fullPath,
        size,
        relativePath,
        mtime
      });

      if (entry.isDirectory()) {
        const subNodes = await getDirectoryTree(fullPath, baseDir, level + 1, maxDepth, ignorePatterns);
        nodes.push(...subNodes);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err);
  }

  return nodes;
}

export async function buildTree(dirPath: string, maxDepth = 10): Promise<TreeNode[]> {
  return getDirectoryTree(dirPath, dirPath, 0, maxDepth);
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function formatTime(date?: Date): string {
  if (!date) return '';
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const fileDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const timeFormat = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  if (fileDate.getTime() === today.getTime()) {
    return `Today ${timeFormat}`;
  }

  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + ` ${timeFormat}`;
}

export function getFileTypeColor(filename: string): (text: string) => string {
  const ext = path.extname(filename).toLowerCase();
  
  switch (ext) {
    // TypeScript / JavaScript
    case '.ts':
    case '.tsx':
      return (text: string) => chalk.blue(text);
    case '.js':
    case '.jsx':
      return (text: string) => chalk.yellow(text);
    // JSON
    case '.json':
      return (text: string) => chalk.greenBright(text);
    // Styles
    case '.css':
    case '.scss':
    case '.less':
      return (text: string) => chalk.magenta(text);
    // Images
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
    case '.svg':
      return (text: string) => chalk.cyan(text);
    // Config files
    case '.yml':
    case '.yaml':
    case '.xml':
      return (text: string) => chalk.red(text);
    // Markdown
    case '.md':
    case '.mdx':
      return (text: string) => chalk.gray(text);
    default:
      return (text: string) => chalk.white(text);
  }
}

export function colorize(text: string, isDir: boolean, filename?: string): string {
  if (isDir) {
    return chalk.cyan.bold(text);
  }
  if (filename) {
    const colorFunc = getFileTypeColor(filename);
    return colorFunc(text);
  }
  return chalk.white(text);
}

export interface FormatTreeOptions {
  pretty?: boolean;
  showTime?: boolean;
}

export function formatTree(nodes: TreeNode[], options: FormatTreeOptions = {}): string {
  const { pretty = true, showTime = false } = options;

  if (nodes.length === 0) return '';

  let output = '';
  const stack: { level: number; isLast: boolean }[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const nextNode = nodes[i + 1];

    const isLast = !nextNode || nextNode.level <= node.level;

    let prefix = '';

    if (node.level === 0) {
      prefix = '';
    } else {
      for (let j = 0; j < node.level - 1; j++) {
        const parentIsLast = stack[j]?.isLast ?? true;
        prefix += parentIsLast ? '    ' : '│   ';
      }
      prefix += isLast ? '└── ' : '├── ';
    }

    let icon = '';
    if (pretty) {
      icon = node.isDir ? '📁 ' : '📄 ';
    }

    const name = colorize(node.name, node.isDir, node.name);
    const size = node.size && pretty ? ` ${chalk.dim(`(${formatFileSize(node.size)})`)}` : '';
    const time = showTime && node.mtime ? ` ${chalk.dim(formatTime(node.mtime))}` : '';

    output += `${prefix}${icon}${name}${size}${time}\n`;

    if (node.level > 0) {
      stack[node.level - 1] = { level: node.level, isLast };
    }
  }

  return output;
}
