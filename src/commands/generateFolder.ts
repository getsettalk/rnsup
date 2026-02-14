import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { addHistory } from '../utils/history';
import { registerAlias } from '../utils/aliasManager';
import { handleCancel } from '../utils/handleCancel';


export async function generateFolder(input: string) {
  try {
    // normalize slashes and clean input
    let cleaned = input.replace(/\\/g, '/').trim();
    
    // resolve folder path
    let fullDir: string;
    let relativeDir: string;

    // if path starts with src/, use as-is
    if (cleaned.startsWith('src/')) {
      relativeDir = cleaned;
      fullDir = path.join(process.cwd(), cleaned);
    } 
    // if path contains /, but doesn't start with src/
    else if (cleaned.includes('/')) {
      fullDir = path.join(process.cwd(), cleaned);
      relativeDir = cleaned;
    } 
    // just a folder name, create at root
    else {
      fullDir = path.join(process.cwd(), cleaned);
      relativeDir = cleaned;
    }

    const folderName = path.basename(fullDir);

    // show colored info
    console.log('\n' + chalk.cyan.bold('📁 Folder Creation Details'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.yellow('Folder Name:'), chalk.white(folderName));
    console.log(chalk.yellow('Location:   '), chalk.white(relativeDir));
    console.log(chalk.yellow('Full Path:  '), chalk.dim(fullDir));
    console.log(chalk.gray('─'.repeat(50)));

    // check if folder already exists
    if (await fs.pathExists(fullDir)) {
      console.log(chalk.yellow(`\n⚠️  Folder ${relativeDir} already exists.`));
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Do you want to continue anyway?',
          default: false
        }
      ]);

      if (!proceed) {
        console.log(chalk.yellow('Cancelled.'));
        return;
      }
    }

    // ask to create index.ts
    const { createIndex } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'createIndex',
        message: 'Create index.ts file?',
        default: true
      }
    ]);

    // final confirmation
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: chalk.green(`Create folder ${chalk.bold(folderName)}?`),
        default: true
      }
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Cancelled.'));
      return;
    }

    // create folder
    await fs.ensureDir(fullDir);

    // register alias if it's under src/
    if (relativeDir.startsWith('src/')) {
      await registerAlias(relativeDir);
    }

    // create index.ts if requested
    if (createIndex) {
      const indexFile = path.join(fullDir, 'index.ts');
      
      if (!(await fs.pathExists(indexFile))) {
        await fs.writeFile(indexFile, '// Add your exports here\n');
      }
    }

    await addHistory(`Created folder ${relativeDir}`);

    console.log(chalk.green(`\n✨ Folder ${chalk.bold(folderName)} created successfully!`));
    console.log(chalk.gray(`Location: ${relativeDir}`));
    console.log();
  } catch (err: any) {
    handleCancel(err);
  }
}
