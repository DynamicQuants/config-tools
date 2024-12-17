/**
 * This file is part of the `@dynamic-quants/config-tools` package.
 * Copyright (c) Dynamic Quants and affiliates.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import inquirer from 'inquirer';

import { CommandName, ProjectTarget } from './types';
import {
  checkForUpdates,
  getProjectStatus,
  getProjectTarget,
  getProjectType,
  installPeers,
  isMonorepo,
  monorepoTargets,
  upgradeConfigToolsPackage,
} from './utils';

/**
 * Setup command.
 * It will setup the project with the required dependencies.
 */
export function setup() {
  const { isNewVersionAvailable, latestVersion } = checkForUpdates();

  if (isNewVersionAvailable) {
    console.info(
      `\x1b[33mNew version available: ${latestVersion}\x1b[0m`,
      `\x1b[33mTo upgrade, run: pnpm config-tools ${CommandName.upgrade}\x1b[0m`,
    );
  }

  if (isMonorepo()) {
    monorepoTargets().forEach(({ target, type, path, name }) =>
      installPeers(target, type, path, name),
    );
    return;
  }

  const target = getProjectTarget();
  const type = getProjectType();

  if (!target) {
    console.error(`No target found: values must be ${Object.values(ProjectTarget).join(' | ')}`);
    return;
  }

  installPeers(target, type);
}

/**
 * Upgrade command.
 * It will upgrade the project to the latest version.
 */
export async function upgradeCommand() {
  console.log(`Checking for updates...`);

  const { isNewVersionAvailable, latestVersion } = checkForUpdates();

  // If the latest version is greater than the current version, we will upgrade the project.
  if (isNewVersionAvailable) {
    console.log(`Upgrading to the latest version: ${latestVersion}`);

    // Asking if user wants to upgrade the project.
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'upgrade',
        message: 'Do you want to upgrade the project?',
      },
    ]);

    if (answer.upgrade) {
      console.log(`\x1b[33mUpgrading to the latest version: ${latestVersion}\x1b[0m`);
      upgradeConfigToolsPackage();
    }
  } else {
    console.log(`\x1b[33mNo updates available\x1b[0m`);
  }
}

/**
 * Help command.
 * It will show the help message.
 */
export function helpCommand() {
  console.log(`
    Usage: @dynamic-quants/config-tools <command>

    Available Commands:
      ${Object.values(CommandName).join(', ')}

    Command Descriptions:
      ${CommandName.setup}: Installs peer dependencies for the project.
      ${CommandName.upgrade}: Upgrades the project to the latest version.
      ${CommandName.help}: Displays help information for the available commands.

    Examples:
      @dynamic-quants/config-tools ${CommandName.setup}
      @dynamic-quants/config-tools ${CommandName.upgrade}
      @dynamic-quants/config-tools ${CommandName.help}
  `);
}

/**
 * Info command.
 * It will show the info about the project and the config tools package.
 */
export function infoCommand() {
  const {
    isUpToDate,
    isMonorepo,
    projectTarget,
    projectType,
    installedVersion,
    latestVersion,
    packageManager,
  } = getProjectStatus();

  console.log('Dynamic Quants Config Tools');
  console.log(`Installed version: ${installedVersion}`);
  console.log(`Latest version: ${latestVersion}`);
  console.log(`Is up to date: ${isUpToDate}`);
  console.log(`Is monorepo: ${isMonorepo}`);
  console.log(`Project target: ${projectTarget}`);
  console.log(`Project type: ${projectType}`);
  console.log(`Package Manager: ${packageManager}`);
}
