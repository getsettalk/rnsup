import { Command } from 'commander';
import { runSetup } from './commands/setup';
import { generateScreen } from './commands/generateScreen';
import { generateComponent } from './commands/generateComponent';


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


generate
  .command('component <name>')
  .alias('c')
  .description('Generate a component')
  .action(generateComponent);

/* attach to main program */
program.addCommand(generate);

program.parse(process.argv);