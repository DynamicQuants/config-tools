/**
 * This file is part of the `@dynamic-quants/config-tools` package.
 * Copyright (c) Dynamic Quants and affiliates.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
 * A monorepo project target.
 */
export type MonorepoTargets = {
  name: string;
  path: string;
  target: ProjectTarget;
  type: ProjectType;
};
