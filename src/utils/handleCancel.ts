export function handleCancel(error: any) {
  // Inquirer Ctrl+C cancellation
  if (
    error?.name === 'ExitPromptError' ||
    error?.message?.includes('SIGINT')
  ) {
    console.log('\nOperation cancelled by user.\n');
    process.exit(0);
  }

  // real error
  console.error('\nSetup failed:\n', error);
  process.exit(1);
}