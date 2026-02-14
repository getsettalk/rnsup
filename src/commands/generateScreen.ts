import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { parseScreenName } from '../utils/parseName';
import { getScreenTemplate, ScreenType } from '../templates/screenTemplates';
import { addHistory } from '../utils/history';
import { registerAlias } from '../utils/aliasManager';
import { handleCancel } from '../utils/handleCancel';


export async function generateScreen(input: string) {
  try {
    const { screenName, fullDir, relativeDir } =
      await parseScreenName(input);

    const filePath = path.join(fullDir, `${screenName}.tsx`);
    const indexFile = path.join(fullDir, 'index.ts');

    // Ask for screen type
    const { screenType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'screenType',
        message: 'Select screen type:',
        choices: [
          { name: 'Basic - Simple screen with title', value: 'basic' },
          { name: 'List - FlatList with items', value: 'list' },
          { name: 'Form - Input form with submission', value: 'form' },
          { name: 'Detail - Detail view with data display', value: 'detail' }
        ],
        default: 'basic'
      }
    ]);

    // Show colored details
    console.log('\n' + chalk.cyan.bold('🎬 Screen Creation Details'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.yellow('Name:      '), chalk.cyan(screenName));
    console.log(chalk.yellow('Type:      '), chalk.magenta(screenType));
    console.log(chalk.yellow('Location:  '), chalk.white(relativeDir));
    console.log(chalk.yellow('Files:     '), chalk.dim(`${screenName}.tsx, index.ts`));
    console.log(chalk.gray('─'.repeat(50)));

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
        message: chalk.green(`Create ${screenName} (${screenType})?`),
        default: true
      }
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Cancelled.'));
      return;
    }

    await fs.ensureDir(fullDir);
    await registerAlias(relativeDir);
    const template = getScreenTemplate(screenName, screenType as ScreenType);
    await fs.writeFile(filePath, template);

    // create index export
    const exportLine = `export { default as ${screenName} } from './${screenName}';\n`;

    if (await fs.pathExists(indexFile)) {
      const existing = await fs.readFile(indexFile, 'utf8');
      if (!existing.includes(screenName))
        await fs.appendFile(indexFile, exportLine);
    } else {
      await fs.writeFile(indexFile, exportLine);
    }

    await addHistory(`Generated screen ${screenName} (${screenType})`);

    console.log(chalk.green(`\n✨ Screen ${chalk.bold(screenName)} created successfully!`));
    console.log(chalk.gray(`Location: ${relativeDir}`));
    console.log(chalk.gray(`Type: ${screenType}`));
    console.log();
  } catch (err: any) {
    handleCancel(err);
  }
}