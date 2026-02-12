import fs from 'fs-extra';
import path from 'path';

export async function patchIndexFile() {
  const indexPath = path.join(process.cwd(), 'index.js');
  if (!(await fs.pathExists(indexPath))) return;

  let content = await fs.readFile(indexPath, 'utf8');

  if (content.includes("react-native-gesture-handler")) return;

  content =
    `import 'react-native-gesture-handler';\n` + content;

  await fs.writeFile(indexPath, content);
}