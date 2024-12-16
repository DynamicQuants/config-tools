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

import { MonorepoTargets, type PackageManager, ProjectTarget, ProjectType } from './types';

/**
 * The user root path.
 */
export const rootPath: string = getRootPath();

/**
 * Check if the project is a monorepo.
 * @returns {boolean} Whether the project is a monorepo.
 */
export function isMonorepo(): boolean {
  return existsSync(resolve(process.cwd(), 'pnpm-workspace.yaml'));
}

/**
 * Get the root path of the project.
 * @returns {string} The root path of the project.
 */
export function getRootPath(): string {
  if (!isMonorepo()) {
    const packageJson = getPackageJson(process.cwd());
    if (packageJson.name !== '@dynamic-quants/config-tools') {
      return findRoot(process.cwd());
    }
  }

  return findRoot(resolve(process.cwd(), '../'));
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
 * @returns {Object} The current package version and name.
 */
export function getCurrentPackageVersion(): { name: string; version: string } {
  const packageJson = getPackageJson(findRoot(__dirname));
  return { name: packageJson.name, version: packageJson.version };
}

/**
 * Read peer dependencies from the peer-dependencies.json file.
 * @param {string} target - The target to read the peer dependencies from.
 * @returns {Object} The peer dependencies.
 */
export function readPeerDependencies(
  target: ProjectTarget,
  type: ProjectType,
): Record<string, string> {
  const peerDependencies = JSON.parse(readFileSync(resolve(__dirname, 'peers.json'), 'utf8'));
  return peerDependencies[`${target}-${type}`];
}

/**
 * Get the target based on the existence of the next.config.ts file.
 * @param {string} targetPath - The path to the target directory.
 * @returns {ProjectTarget | null} The target.
 */
export function getProjectTarget(targetPath: string = rootPath): ProjectTarget {
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
export function getProjectType(targetPath: string = rootPath): ProjectType {
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
 * Get the monorepo targets based on workspace configuration.
 * @returns {MonorepoTargets[]} - An array with the paths of the directories of monorepo projects.
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
        const target = getProjectTarget(path);
        const type = getProjectType(path);
        const name = packageJson.name;
        if (name && target) {
          directoriesWithPackageJson.push({
            name: `./${pattern.replace('*', name)}`,
            path,
            target,
            type,
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
export function installPeers(
  target: ProjectTarget,
  type: ProjectType,
  path = rootPath,
  filter = '',
) {
  const peerDependencies = filterPeerDependencies(path, readPeerDependencies(target, type));
  const project = `${target}-${type} ${filter ? `in ${filter}` : ''}`.trim();

  // If monorepo, we need to filter the dependencies by the workspace.
  let filterCommand = '';
  if (filter.length > 0) {
    filterCommand = `--filter="${filter}"`;
  }

  if (Object.keys(peerDependencies).length === 0) {
    console.log(`No peer dependencies to install for ${project}`);
    return;
  }

  const packageManager = detectPackageManager();
  const deps = Object.entries(peerDependencies).map(([name, version]) => `${name}@${version}`);
  const command = `${packageManager} add -D ${filterCommand} ${deps.join(' ')}`;
  console.log(`\n✨ Installing peer dependencies for ${project}: ${command}.`);
  execSync(`cd ${rootPath} && ${command}`, { stdio: 'inherit' });
}

/**
 * Upgrade the config tools package to the latest version.
 */
export function upgradeConfigToolsPackage() {
  const packageManager = detectPackageManager();
  const command = `${packageManager} install @dynamic-quants/config-tools@latest`;
  console.log(`Upgrade config tools package: ${command}.`);
  execSync(`cd ${rootPath} && ${command}`, { stdio: 'inherit' });
}

/**
 * Get the project status.
 * @returns {Object} The project status.
 */
export function getProjectStatus(): {
  isUpToDate: boolean;
  isMonorepo: boolean;
  projectTarget: ProjectTarget;
  projectType: ProjectType;
  installedVersion: string;
  latestVersion: string;
  packageManager: PackageManager;
} {
  const { isNewVersionAvailable, latestVersion } = checkForUpdates();
  const installedVersion = getCurrentPackageVersion().version;
  const packageManager = detectPackageManager();

  return {
    isUpToDate: !isNewVersionAvailable,
    isMonorepo: isMonorepo(),
    projectTarget: getProjectTarget(),
    projectType: getProjectType(),
    installedVersion,
    latestVersion,
    packageManager,
  };
}
