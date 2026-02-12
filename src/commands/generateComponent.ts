import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { componentTemplate } from '../templates/component';
import { parseComponentName } from '../utils/parseComponentName';
import { registerAlias } from '../utils/aliasManager';
import { addHistory } from '../utils/history';

export async function generateComponent(input: string) {
  try {
    const { componentName, fullDir, relativeDir } =
      parseComponentName(input);

    const filePath = path.join(fullDir, `${componentName}.tsx`);

    console.log('\nComponent details:');
    console.log('Name:', componentName);
    console.log('Directory:', relativeDir);

    // overwrite check
    if (await fs.pathExists(filePath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `${componentName} already exists. Overwrite?`,
          default: false
        }
      ]);

      if (!overwrite) {
        console.log(chalk.yellow('Cancelled.'));
        return;
      }
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Create ${componentName} in ${relativeDir}?`,
        default: true
      }
    ]);

    if (!confirm) return;

    // create directory
    await fs.ensureDir(fullDir);

    // ensure alias (for nested components like ui/forms)
    await registerAlias(relativeDir);

    // write component
    await fs.writeFile(filePath, componentTemplate(componentName));

    // create index export
    const indexFile = path.join(fullDir, 'index.ts');
    const exportLine = `export { default as ${componentName} } from './${componentName}';\n`;

    if (await fs.pathExists(indexFile)) {
      const existing = await fs.readFile(indexFile, 'utf8');
      if (!existing.includes(componentName))
        await fs.appendFile(indexFile, exportLine);
    } else {
      await fs.writeFile(indexFile, exportLine);
    }

    await addHistory(`Generated component ${componentName}`);

    console.log(chalk.green(`\n${componentName} created successfully.`));
  } catch (err) {
    console.error(err);
  }
}