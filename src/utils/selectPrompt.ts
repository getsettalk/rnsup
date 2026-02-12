import readline from 'readline';

/**
 * Numeric select prompt
 * Returns a typed value instead of raw string
 */
export async function selectOption<T extends readonly string[]>(
  message: string,
  options: T
): Promise<T[number]> {
  return new Promise((resolve) => {
    console.log('\n\x1b[1;36m' + message + '\x1b[0m');

    options.forEach((opt, i) => {
      console.log(`${i + 1}) ${opt}`);
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('\x1b[1;33mEnter choice number: \x1b[0m', (answer) => {
      const index = Number(answer) - 1;
      rl.close();

      if (index >= 0 && index < options.length) {
        resolve(options[index]);
      } else {
        console.log('\x1b[1;31mInvalid selection. Defaulting to first option.\x1b[0m');
        resolve(options[0]);
      }
    });
  });
}