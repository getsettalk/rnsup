import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { getComponentTemplate, ComponentType } from '../templates/componentTemplates';
import { parseComponentName } from '../utils/parseComponentName';
import { registerAlias } from '../utils/aliasManager';
import { addHistory } from '../utils/history';
import { handleCancel } from '../utils/handleCancel';

export async function generateComponent(input: string) {
  try {
    const { componentName, fullDir, relativeDir } =
      parseComponentName(input);

    // Ask for file extension
    const { fileExtension } = await inquirer.prompt([
      {
        type: 'list',
        name: 'fileExtension',
        message: 'Enter file extension:',
        choices: [
          { name: 'TypeScript (tsx) - Default, Recommended', value: 'tsx' },
          { name: 'JavaScript (jsx)', value: 'jsx' }
        ],
        default: 'tsx'
      }
    ]);

    const filePath = path.join(fullDir, `${componentName}.${fileExtension}`);

    // Show colored details
    console.log('\n' + chalk.cyan.bold('🏗️  Component Creation Details'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.yellow('Name:      '), chalk.cyan(componentName));
    console.log(chalk.yellow('Extension: '), chalk.magenta(fileExtension.toUpperCase()));
    console.log(chalk.yellow('Location:  '), chalk.white(relativeDir));
    console.log(chalk.yellow('File:      '), chalk.dim(`${componentName}.${fileExtension}`));
    console.log(chalk.gray('─'.repeat(50)));

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
        console.log(chalk.yellow('Operation cancelled.'));
        return;
      }
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: chalk.green(`Create ${componentName} (${fileExtension.toUpperCase()})?`),
        default: true
      }
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Cancelled.'));
      return;
    }

    // create directory
    await fs.ensureDir(fullDir);

    // ensure alias (for nested components like ui/forms)
    await registerAlias(relativeDir);

    // write component with simple template
    const template = getComponentTemplate(componentName, 'presentational');
    await fs.writeFile(filePath, template);

    await addHistory(`Generated component ${componentName} (${fileExtension})`);

    console.log(chalk.green(`\n✨ Component ${chalk.bold(componentName)} created successfully!`));
    console.log(chalk.gray(`Location: ${relativeDir}`));
    console.log(chalk.gray(`Extension: ${fileExtension}`));
    console.log();
  } catch (err: any) {
    handleCancel(err);
  }
}