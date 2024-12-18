/**
 * This file is part of the `@dynamic-quants/config-tools` package.
 * Copyright (c) Dynamic Quants and affiliates.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import findRoot from 'find-root';
import { existsSync, readFileSync } from 'fs';
import { execSync } from 'node:child_process';
import { resolve } from 'path';
import semver from 'semver';

import {
  type PackageManager,
  type ProjectInfo,
  ProjectStatus,
  ProjectTarget,
  ProjectType,
} from './types';

const { rootPath } = getProjectInfo();

/**
 * Get the project information.
 * @returns {Object} The project information.
 */
function getProjectInfo(): ProjectInfo {
  const rootPath = findRoot(resolve(process.cwd(), '../'));
  const projectPath = findRoot(resolve(process.cwd()));

  const isMonorepo = existsSync(resolve(rootPath, 'pnpm-workspace.yaml'));

  const name = getPackageJson(projectPath).name;
  const target = getProjectTarget(projectPath);
  const type = getProjectType(projectPath);

  return { isMonorepo, rootPath, projectPath, name, target, type };
}

/**
 * Get the package.json file.
 * @param {string} path - The path to the package.json file.
 * @returns {Object} The package.json file.
 */
function getPackageJson(path: string): Record<string, any> {
  const packageJson = JSON.parse(readFileSync(resolve(path, 'package.json'), 'utf8'));

  if (!packageJson) {
    throw new Error(`No package.json found in ${path}.`);
  }

  return packageJson;
}

/**
 * Detects the package manager used in the project. If it is not possible to detect,
 * it returns `pnpm`.
 * @returns {PackageManager} The package manager.
 */
function detectPackageManager(): PackageManager {
  const { rootPath } = getProjectInfo();
  const packageJson = getPackageJson(rootPath);

  if (packageJson.packageManager) {
    const pm = packageJson.packageManager.split('@')[0] as string;
    if (['pnpm', 'yarn', 'npm'].includes(pm)) return pm as PackageManager;
  }

  if (existsSync(resolve(rootPath, 'yarn.lock'))) return 'yarn';
  if (existsSync(resolve(rootPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(resolve(rootPath, 'package-lock.json'))) return 'npm';

  // PNPM by default.
  console.warn('Could not detect package manager, using PNPM by default.');
  return 'pnpm';
}

/**
 * Get the current package version.
 * @returns {Object} The current package version and name.
 */
function getCurrentPackageVersion(): { name: string; version: string } {
  const packageJson = getPackageJson(findRoot(__dirname));
  return { name: packageJson.name, version: packageJson.version };
}

/**
 * Read peer dependencies from the peer-dependencies.json file.
 * @param {string} target - The target to read the peer dependencies from.
 * @returns {Object} The peer dependencies.
 */
function readPeerDependencies(target: ProjectTarget, type: ProjectType): Record<string, string> {
  const peerDependencies = JSON.parse(readFileSync(resolve(__dirname, 'peers.json'), 'utf8'));
  return peerDependencies[`${target}-${type}`];
}

/**
 * Get the target based on the existence of the next.config.ts file.
 * @param {string} targetPath - The path to the target directory.
 * @returns {ProjectTarget | null} The target.
 */
function getProjectTarget(targetPath: string): ProjectTarget {
  // Check if the next.config.ts file exists.
  const nextConfigFiles = ['next.config.ts', 'next.config.js', 'next.config.mjs'];
  if (nextConfigFiles.some((file) => existsSync(resolve(targetPath, file)))) {
    return 'nextjs';
  }

  // Check if the nest-cli.json file exists.
  if (existsSync(resolve(targetPath, 'nest-cli.json'))) {
    return 'nestjs';
  }

  // Check if have metadata in json file.
  if (existsSync(resolve(targetPath, 'package.json'))) {
    const packageJson = getPackageJson(targetPath);
    const configTools = packageJson['config-tools'];

    const isValidTarget =
      configTools &&
      configTools.target &&
      Object.values(ProjectTarget).includes(configTools.target);

    if (isValidTarget) {
      return configTools.target as ProjectTarget;
    }
  }

  // If none of the above files exist, return null.
  throw new Error('No project target found, can not configure project.');
}

/**
 * Get the project type based on the existence of the config-tools metadata in the package.json file.
 * @param {string} targetPath - The path to the target directory.
 * @returns {ProjectType | null} The project type.
 */
function getProjectType(targetPath: string): ProjectType {
  const packageJson = getPackageJson(targetPath);
  const configTools = packageJson['config-tools'];

  const isValidType =
    configTools && configTools.type && Object.values(ProjectType).includes(configTools.type);

  if (!isValidType) {
    throw new Error('No project type found, can not configure project.');
  }

  return configTools.type as ProjectType;
}

/**
 * Filter peer dependencies that are not installed.
 * @param {string} path - The path to the package.json file.
 * @param {Record<string, string>} targetPeers - The peer dependencies to filter.
 * @returns {Record<string, string>} The filtered peer dependencies.
 */
function filterPeerDependencies(
  path: string,
  targetPeers: Record<string, string>,
): Record<string, string> {
  const packageJson = getPackageJson(path);
  const packagePeers = packageJson.devDependencies ?? {};

  // The version package.json must satisfy the version in the peers.json.
  console.log(`📦 Checking peer dependencies for project ${packageJson.name}: \n`);
  const filteredPeers = Object.entries(targetPeers).filter(([name, version]) => {
    const installedVersion = packagePeers[name] ?? '';
    const cleanInstalledVersion = installedVersion.replace(/[\^~]/, '');
    const mustInstall = !semver.satisfies(cleanInstalledVersion, version);

    const logStatus = !mustInstall
      ? '\x1b[32m Already installed \x1b[0m ✅'
      : installedVersion !== ''
        ? `\x1b[33m Needs update (${installedVersion}) \x1b[0m 🔄`
        : '\x1b[31m Not found \x1b[0m 🚫';

    console.log(`- \x1b[36m ${name}@${version} \x1b[0m - ${logStatus}`);

    return mustInstall;
  });

  return Object.fromEntries(filteredPeers);
}

/**
 * Check if there is a new version of the config tools package.
 * @returns {boolean} Whether there is a new version of the config tools package.
 */
export function checkForUpdates(): { isNewVersionAvailable: boolean; latestVersion: string } {
  const latestVersion = execSync('pnpm info @dynamic-quants/config-tools version')
    .toString()
    .trim();
  const currentVersion = getCurrentPackageVersion().version;
  return { isNewVersionAvailable: semver.gt(latestVersion, currentVersion), latestVersion };
}

/**
 * Install peer dependencies for the given target.
 * @param {CommandTarget} target - The target to install peer dependencies for.
 */
export function installPeers() {
  const { target, type, isMonorepo, name, projectPath } = getProjectInfo();
  const peerDependencies = filterPeerDependencies(projectPath, readPeerDependencies(target, type));
  const project = `${target}-${type} ${isMonorepo ? `in ${name}` : ''}`.trim();

  // If monorepo, we need to filter the dependencies by the workspace.
  let filterCommand = '';
  if (isMonorepo) {
    filterCommand = `--filter="${name}"`;
  }

  if (Object.keys(peerDependencies).length === 0) {
    console.log(`No peer dependencies to install for ${project}`);
    return;
  }

  const packageManager = detectPackageManager();
  const deps = Object.entries(peerDependencies).map(([name, version]) => `${name}@${version}`);
  const command = `${packageManager} add -D --ignore-scripts ${filterCommand} ${deps.join(' ')}`;
  console.log(`\n✨ Installing peer dependencies for ${project}: ${command}.`);
  execSync(`cd ${rootPath} && ${command}`, { stdio: 'inherit' });
}

/**
 * Upgrade the config tools package to the latest version.
 */
export function upgradeConfigTools() {
  const packageManager = detectPackageManager();
  const command = `${packageManager} install -D @dynamic-quants/config-tools@latest`;
  execSync(`cd ${rootPath} && ${command}`, { stdio: 'inherit' });
  console.log('\x1b[32m🎉 Config tools upgraded successfully\x1b[0m');
}

/**
 * Get the project status.
 * @returns {Object} The project status.
 */
export function getProjectStatus(): ProjectStatus {
  const { isNewVersionAvailable, latestVersion } = checkForUpdates();
  const installedVersion = getCurrentPackageVersion().version;
  const packageManager = detectPackageManager();
  const projectInfo = getProjectInfo();

  return {
    isUpToDate: !isNewVersionAvailable,
    installedVersion,
    latestVersion,
    packageManager,
    ...projectInfo,
  };
}
