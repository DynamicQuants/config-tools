/**
 * This file is part of the `@dynamic-quants/config-tools` package.
 * Copyright (c) Dynamic Quants and affiliates.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import findRoot from 'find-root';
import { existsSync, readFileSync } from 'fs';
import { sync } from 'glob';
import { execSync } from 'node:child_process';
import { resolve } from 'path';
import semver from 'semver';
import { parse } from 'yaml';

import { type CommandTarget, MonorepoTargets, type PackageManager } from './types';

/**
 * The user root path.
 */
export const rootPath = findRoot(resolve(process.cwd(), '../'));

function getPackageJson(path: string) {
  return JSON.parse(readFileSync(resolve(path, 'package.json'), 'utf8')) ?? {};
}

/**
 * Detects the package manager used in the project.
 * @returns {PackageManager} The package manager.
 */
export function detectPackageManager(): PackageManager {
  const packageJson = getPackageJson(rootPath);

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
  const packageJson = getPackageJson(__dirname);
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
export function getTarget(targetPath = rootPath): CommandTarget | null {
  // Check if the next.config.ts file exists.
  const nextConfigFiles = ['next.config.ts', 'next.config.js', 'next.config.mjs'];
  if (nextConfigFiles.some((file) => existsSync(resolve(targetPath, file)))) {
    return 'nextjs';
  }

  // Check if the nest-cli.json file exists.
  if (existsSync(resolve(targetPath, 'nest-cli.json'))) {
    return 'nestjs';
  }

  // If none of the above files exist, return null.
  return null;
}

/**
 * Check if the project is a monorepo.
 * @returns {boolean} Whether the project is a monorepo.
 */
export function isMonorepo(): boolean {
  return existsSync(resolve(rootPath, 'pnpm-workspace.yaml'));
}

/**
 * Get the monorepo targets based on workspace configuration.
 * @param {string[]} patterns - The patterns of the folders to explore.
 * @returns {MonorepoTargets[]} - An array with the paths of the directories that contain package.json.
 */
export function monorepoTargets(): MonorepoTargets[] {
  const directoriesWithPackageJson: MonorepoTargets[] = [];

  const workspace = readFileSync(resolve(rootPath, 'pnpm-workspace.yaml'), 'utf8');
  const workspaceData = parse(workspace);
  const patterns = (workspaceData.packages as string[]) ?? [];

  patterns.forEach((pattern) => {
    const fullPattern = resolve(rootPath, pattern);
    const directories = sync(fullPattern, { nodir: false });

    directories.forEach((path) => {
      const packageJsonPath = resolve(path, 'package.json');
      if (existsSync(packageJsonPath)) {
        const packageJson = getPackageJson(path);
        const target = getTarget(path);
        const name = packageJson.name;
        if (name && target) {
          directoriesWithPackageJson.push({
            name: `./${pattern.replace('*', name)}`,
            path,
            target,
          });
        }
      }
    });
  });

  return directoriesWithPackageJson;
}

/**
 * Filter peer dependencies that are not installed.
 * @param {string} path - The path to the package.json file.
 * @param {Record<string, string>} targetPeers - The peer dependencies to filter.
 * @returns {Record<string, string>} The filtered peer dependencies.
 */
export function filterPeerDependencies(
  path: string,
  targetPeers: Record<string, string>,
): Record<string, string> {
  const packageJson = getPackageJson(path);
  const packagePeers = packageJson.devDependencies ?? {};

  // Checking not installed peer dependencies.
  // The version package.json must satisfy the version in the peers.json.
  const filteredPeers = Object.entries(targetPeers).filter(
    ([name, version]) => !packagePeers[name] || semver.satisfies(packagePeers[name], version),
  );

  return Object.fromEntries(filteredPeers);
}

/**
 * Install peer dependencies for the given target.
 * @param {CommandTarget} target - The target to install peer dependencies for.
 */
export function installPeers(target: CommandTarget, path = rootPath, filter = '') {
  const peerDependencies = filterPeerDependencies(path, readPeerDependencies(target));
  const project = `${target} ${filter ? `in ${filter}` : ''}`;

  // If monorepo, we need to filter the dependencies by the workspace.
  let filterCommand = '';
  if (filter.length > 0) {
    filterCommand = `--filter="${filter}"`;
  }

  if (Object.keys(peerDependencies).length === 0) {
    console.log(`No peer dependencies to install for ${project}.`);
    return;
  }

  const packageManager = detectPackageManager();
  const deps = Object.entries(peerDependencies).map(([name, version]) => `${name}@${version}`);
  const command = `${packageManager} add -D ${filterCommand} --ignore-scripts ${deps.join(' ')}`;
  console.log(`Install peer dependencies for ${project}: ${command}.`);
  execSync(`cd ${rootPath} && ${command}`, { stdio: 'inherit' });
}
