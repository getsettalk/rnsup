import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { buildTree, formatTree } from '../utils/treeGenerator';
import { handleCancel } from '../utils/handleCancel';

export async function viewStructure(options: any) {
  try {
    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n\nCancelled.'));
      process.exit(0);
    });

    // Parse flags
    const pretty = options.pretty || options.p || false;
    const showTime = options.time || false;

    // Show hints if first time or no input
    if (!options.parent?.args?.[1]) {
      console.log('\n' + chalk.cyan.bold('💡 Usage Hints'));
      console.log(chalk.gray('─'.repeat(60)));
      console.log(chalk.yellow('Command:'), chalk.white('rnsup view [options]'));
      console.log();
      console.log(chalk.yellow('Input options (when prompted):'));
      console.log('  ' + chalk.white('. or root') + chalk.gray(' → Show entire project (all folders/files)'));
      console.log('  ' + chalk.white('src') + chalk.gray(' → Show only src/ directory'));
      console.log();
      console.log(chalk.yellow('Command flags:'));
      console.log('  ' + chalk.white('-p, --pretty') + chalk.gray(' → Show with icons, colors, and file sizes'));
      console.log('  ' + chalk.white('--time') + chalk.gray(' → Show file/folder creation date and time'));
      console.log();
      console.log(chalk.yellow('Examples:'));
      console.log('  ' + chalk.white('rnsup view') + chalk.gray(' → Raw structure (no icons)'));
      console.log('  ' + chalk.white('rnsup view -p') + chalk.gray(' → Pretty view with icons & colors'));
      console.log('  ' + chalk.white('rnsup view --time') + chalk.gray(' → Show with timestamps'));
      console.log('  ' + chalk.white('rnsup view -p --time') + chalk.gray(' → Pretty view + timestamps'));
      console.log(chalk.gray('─'.repeat(60)));
      console.log();
    }

    const { viewTarget } = await inquirer.prompt([
      {
        type: 'list',
        name: 'viewTarget',
        message: 'What would you like to view?',
        choices: [
          { name: '📂 Root level (entire project)', value: 'root' },
          { name: '📂 Inside src/ folder only', value: 'src' }
        ]
      }
    ]);

    let targetPath = process.cwd();
    let displayLocation = 'root';

    if (viewTarget === 'src') {
      targetPath = path.join(process.cwd(), 'src');
      displayLocation = 'src';
    }

    // Show colored header
    console.log('\n' + chalk.cyan.bold('📋 Directory Structure'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.yellow('Location: '), chalk.white(displayLocation));
    console.log(chalk.yellow('Mode:     '), pretty ? chalk.magenta('Pretty') : chalk.dim('Raw'));
    if (showTime) {
      console.log(chalk.yellow('Time:     '), chalk.magenta('Enabled'));
    }
    console.log(chalk.gray('─'.repeat(60)));
    console.log();

    // Build and display tree
    const nodes = await buildTree(targetPath, 10);
    
    if (nodes.length === 0) {
      console.log(chalk.yellow('No files or folders found in this directory.'));
    } else {
      const formattedTree = formatTree(nodes, { pretty, showTime });
      console.log(formattedTree);
    }

    // Footer with hints
    console.log(chalk.gray('─'.repeat(60)));
    if (pretty) {
      console.log(chalk.dim('📁 Cyan = folders  |  Colors = file types (blue=.ts, green=.json, etc)'));
    }
    console.log(chalk.dim('💡 Tip: You can copy the structure above for documentation'));
    console.log();
  } catch (err: any) {
    handleCancel(err);
  }
}
