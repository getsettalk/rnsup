import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { parseScreenName } from '../utils/parseName';
import { screenTemplate } from '../templates/screen';
import { addHistory } from '../utils/history';
import { registerAlias } from '../utils/aliasManager';


export async function generateScreen(input: string) {
  try {
    const { screenName, fullDir, relativeDir } =
      await parseScreenName(input);

    const filePath = path.join(fullDir, `${screenName}.tsx`);

    console.log('\nScreen details:');
    console.log('Name:', screenName);
    console.log('Directory:', relativeDir);

    // confirm directory creation
    if (!(await fs.pathExists(fullDir))) {
      const { createDir } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'createDir',
          message: `Directory ${relativeDir} does not exist. Create it?`,
          default: true
        }
      ]);

      if (!createDir) {
        console.log(chalk.yellow('Cancelled.'));
        return;
      }
    }

    // overwrite check
    if (await fs.pathExists(filePath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `${screenName} already exists. Overwrite?`,
          default: false
        }
      ]);

      if (!overwrite) {
        console.log(chalk.yellow('Operation cancelled.'));
        return;
      }
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Create ${screenName} in ${relativeDir}?`,
        default: true
      }
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Cancelled.'));
      return;
    }

    await fs.ensureDir(fullDir);
    await registerAlias(relativeDir);
    await fs.writeFile(filePath, screenTemplate(screenName));

    // create index export
    const indexFile = path.join(fullDir, 'index.ts');
    const exportLine = `export { default as ${screenName} } from './${screenName}';\n`;

    if (await fs.pathExists(indexFile)) {
      const existing = await fs.readFile(indexFile, 'utf8');
      if (!existing.includes(screenName))
        await fs.appendFile(indexFile, exportLine);
    } else {
      await fs.writeFile(indexFile, exportLine);
    }

    await addHistory(`Generated screen ${screenName}`);

    console.log(chalk.green(`\n${screenName} created successfully.`));
  } catch (err) {
    console.error(err);
  }
}