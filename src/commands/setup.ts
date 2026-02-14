import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { PackageManager } from '../utils/packageManager';
import { selectOption } from '../utils/selectPrompt';
import { isReactNativeProject } from '../utils/detectProject';
import { saveConfig } from '../utils/config';
import { createBaseFolders } from '../utils/file';
import { addHistory } from '../utils/history';
import { installPackages } from '../utils/install';
import { setupTsAlias, setupBabelAlias } from '../utils/alias';
import { patchIndexFile } from '../utils/patchIndex';
import { fixLockFile } from '../utils/lockfile';
import { isInstalled } from '../utils/packageManager';
import { createTypes } from '../utils/createTypes';
import { createResponsiveFile } from '../utils/createResponsive';
import { createApiClient } from '../utils/createApiClient';
import { createDocs } from '../utils/createDocs';
import { handleCancel } from '../utils/handleCancel';


process.on('SIGINT', () => {
  console.log('\nCancelled by user.\n');
  process.exit(0);
});


export async function runSetup() {
    try {
        console.log(chalk.cyan('\nRNSUP Setup\n'));

        /* ---------- 1. Verify RN project ---------- */

        if (!isReactNativeProject()) {
            console.log(chalk.red('Not a React Native CLI project'));
            process.exit(1);
        }

        /* ---------- 2. Ask package manager ---------- */

        const manager = await selectOption(
            'Which package manager do you want to use?',
            ['npm', 'yarn', 'pnpm'] as const,
            'yarn'
        ) as PackageManager;

        /* ---------- 3. Validate manager installed ---------- */

        if (!isInstalled(manager)) {
            console.log('\nSelected package manager is not installed on your system.\n');

            if (manager === 'yarn') {
                console.log('Install yarn using:');
                console.log('npm install -g yarn');
            }

            if (manager === 'pnpm') {
                console.log('Install pnpm using:');
                console.log('npm install -g pnpm');
            }

            process.exit(1);
        }

        /* ---------- 4. Fix lockfile conflict ---------- */

        await fixLockFile(manager);

        /* ---------- 5. Ask navigation ---------- */

        const { navigation } = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'navigation',
                message: 'Select navigation types',
                choices: [
                    { name: 'Stack', value: 'stack' },
                    { name: 'Bottom Tabs', value: 'tabs' },
                    { name: 'Drawer', value: 'drawer' }
                ],
                validate: (ans) =>
                    ans.length === 0 ? 'Select at least one navigation type' : true
            }
        ]);

        /* ---------- 6. Optional libraries ---------- */

        const { svg, lucide } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'svg',
                message: 'Install react-native-svg?',
                default: true
            },
            {
                type: 'confirm',
                name: 'lucide',
                message: 'Install lucide-react-native?',
                default: true
            }
        ]);

        /* ---------- 7. Start setup ---------- */

        const spinner = ora('Preparing project...').start();

        // create folders
        await createBaseFolders();

        /* ---------- 8. Collect dependencies ---------- */

        const dependencies: string[] = [
            '@react-navigation/native',
            'react-native-screens',
            'react-native-advanced-checkbox',
            'react-native-gesture-handler',
            'react-native-reanimated',
            'react-native-worklets',
            'react-native-vector-icons',
            'zustand',
            'axios',
            '@tanstack/react-query',
            'react-native-mmkv'
        ];

        // navigation specific
        if (navigation.includes('stack'))
            dependencies.push('@react-navigation/native-stack');

        if (navigation.includes('tabs'))
            dependencies.push('@react-navigation/bottom-tabs');

        if (navigation.includes('drawer'))
            dependencies.push('@react-navigation/drawer');

        // optional libs
        if (svg) dependencies.push('react-native-svg');
        if (lucide) dependencies.push('lucide-react-native');

        const devDependencies = ['babel-plugin-module-resolver'];

        /* ---------- 9. Install ---------- */

        spinner.text = 'Installing dependencies...';
        await installPackages(manager, dependencies);
        await installPackages(manager, devDependencies, true);

        /* ---------- 10. Configure project ---------- */

        spinner.text = 'Configuring babel, alias and gesture handler...';

        await setupTsAlias();
        await setupBabelAlias();
        await patchIndexFile();

        await createTypes();
        await createResponsiveFile();
        await createApiClient();
        await createDocs();

        /* ---------- 11. Save config ---------- */

        await saveConfig({
            packageManager: manager,
            navigation,
            svg,
            lucide
        });

        await addHistory('Project setup completed');

        /* ---------- 12. Finish ---------- */

        spinner.succeed('RNSUP setup completed successfully');

        console.log(chalk.green('\nImportant steps:'));
        console.log('1. cd ios && pod install (only macOS)');
        console.log('2. npx react-native start --reset-cache');
        console.log('3. npx react-native run-android');
    } catch (err) {
       handleCancel(err);
    }
}