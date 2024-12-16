/**
 * This file is part of the `@dynamic-quants/config-tools` package.
 * Copyright (c) Dynamic Quants and affiliates.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { helpCommand, infoCommand, setup, upgradeCommand } from './commands';
import { CommandName } from './types';

function errorMessage(command: CommandName) {
  console.error(`Command "${command}" not found`);
  console.error(`Use one of the following commands: ${Object.values(CommandName).join(', ')}`);
}

async function main() {
  const command = process.argv[2] as CommandName;

  if (!command) {
    console.error('No command provided');
    console.error(`Use one of the following commands: ${Object.values(CommandName).join(', ')}`);
    return;
  }

  if (!Object.values(CommandName).includes(command)) {
    errorMessage(command);
    return;
  }

  if (command === CommandName.help) {
    helpCommand();
  } else if (command === CommandName.info) {
    infoCommand();
  } else if (command === CommandName.upgrade) {
    await upgradeCommand();
  } else if (command === CommandName.setup) {
    setup();
  } else {
    errorMessage(command);
  }
}

main();
