/**
 * This file is part of the `@dynamic-quants/config-tools` package.
 * Copyright (c) Dynamic Quants and affiliates.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The command name supported by the package.
 */
export const CommandName = {
  help: 'help',
  info: 'info',
  upgrade: 'upgrade',
  setup: 'setup',
} as const;

export type CommandName = (typeof CommandName)[keyof typeof CommandName];

/**
 * The command target.
 */
export const ProjectTarget = {
  nextjs: 'nextjs',
  nestjs: 'nestjs',
} as const;

export type ProjectTarget = (typeof ProjectTarget)[keyof typeof ProjectTarget];

/**
 * The project type.
 */
export const ProjectType = {
  lib: 'lib',
  app: 'app',
} as const;

export type ProjectType = (typeof ProjectType)[keyof typeof ProjectType];

/**
 * The package manager.
 */
export type PackageManager = 'yarn' | 'pnpm' | 'npm';

/**
 * The project information necessary to run config-tools commands.
 */
export type ProjectInfo = {
  isMonorepo: boolean;
  rootPath: string;
  projectPath: string;
  name: string;
  target: ProjectTarget;
  type: ProjectType;
};

/**
 * Project information and the current status of the project related to the config-tools package.
 */
export type ProjectStatus = ProjectInfo & {
  isUpToDate: boolean;
  installedVersion: string;
  latestVersion: string;
  packageManager: PackageManager;
};
