/**
 * This file is part of the `@dynamic-quants/config-tools` package.
 * Copyright (c) Dynamic Quants and affiliates.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import findRoot from 'find-root';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import { type CommandTarget, type PackageManager } from './types';

/**
 * The user root path.
 */
export const rootPath = findRoot(resolve(process.cwd(), '../'));

/**
 * Detects the package manager used in the project.
 * @returns {PackageManager} The package manager.
 */
export function detectPackageManager(): PackageManager {
  const packageJson = JSON.parse(readFileSync(resolve(rootPath, 'package.json'), 'utf8'));

  if (packageJson.packageManager) {
    const pm = packageJson.packageManager.split('@')[0] as string;
    if (['pnpm', 'yarn', 'npm'].includes(pm)) return pm as PackageManager;
  }

  if (existsSync(resolve(rootPath, 'yarn.lock'))) return 'yarn';
  if (existsSync(resolve(rootPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(resolve(rootPath, 'package-lock.json'))) return 'npm';

  // PNPM by default.
  throw new Error('Could not detect package manager');
}

/**
 * Get the current package version.
 * @returns {string} The current package version.
 */
export function getCurrentPackageVersion(): string {
  const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8'));
  return `${packageJson.name}@${packageJson.version}`;
}

/**
 * Read peer dependencies from the peer-dependencies.json file.
 * @param {string} target - The target to read the peer dependencies from.
 * @returns {Object} The peer dependencies.
 */
export function readPeerDependencies(target: CommandTarget): Record<string, string> {
  const peerDependencies = JSON.parse(readFileSync(resolve(__dirname, 'peers.json'), 'utf8'));
  return peerDependencies[target];
}

/**
 * Get the target based on the existence of the next.config.ts file.
 * @returns {CommandTarget} The target.
 */
export function getTarget(): CommandTarget | null {
  // Check if the next.config.ts file exists.
  const nextConfigFiles = ['next.config.ts', 'next.config.js', 'next.config.mjs'];
  if (nextConfigFiles.some((file) => existsSync(resolve(rootPath, file)))) {
    return 'nextjs';
  }

  // Check if the nest-cli.json file exists.
  if (existsSync(resolve(rootPath, 'nest-cli.json'))) {
    return 'nestjs';
  }

  // If none of the above files exist, return null.
  return null;
}
