import inquirer from 'inquirer';

/**
 * Interactive list prompt using inquirer
 * Returns a typed value instead of raw string
 */
export async function selectOption<T extends readonly string[]>(
  message: string,
  options: T,
  defaultValue?: T[number]
): Promise<T[number]> {
  const { selected } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selected',
      message: message,
      choices: [...options],
      default: defaultValue || options[0]
    }
  ]);
  
  return selected;
}