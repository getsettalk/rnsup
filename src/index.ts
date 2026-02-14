import { Command } from 'commander';
import { runSetup } from './commands/setup';
import { generateScreen } from './commands/generateScreen';
import { generateComponent } from './commands/generateComponent';
import { generateFolder } from './commands/generateFolder';
import { viewStructure } from './commands/viewStructure';


const program = new Command();

program
  .name('rnsup')
  .description('React Native Support CLI')
  .version('1.0.0');

/* ---------- Setup ---------- */

program
  .command('setup')
  .description('Configure React Native project')
  .action(runSetup);

/* ---------- View Structure ---------- */

program
  .command('view')
  .alias('v')
  .description('View project folder structure')
  .option('-p, --pretty', 'Show with icons, colors and file sizes')
  .option('--time', 'Show file/folder creation date and time')
  .action(viewStructure);

/* ---------- Generator Root ---------- */

const generate = new Command('generate')
  .alias('g')
  .description('Generate files');

/* ---------- Screen ---------- */

generate
  .command('screen <name>')
  .alias('s')
  .description('Generate a screen')
  .action(generateScreen);


/* ---------- Component ---------- */

generate
  .command('component <name>')
  .alias('c')
  .description('Generate a component')
  .action(generateComponent);

/* ---------- Folder ---------- */

generate
  .command('folder <name>')
  .alias('d')
  .description('Create a folder / directory')
  .action(generateFolder);

/* attach to main program */
program.addCommand(generate);

program.parse(process.argv);