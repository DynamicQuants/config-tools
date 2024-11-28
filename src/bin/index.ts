/**
 * This file is part of the `@dynamic-quants/config-tools` package.
 * Copyright (c) Dynamic Quants and affiliates.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { execSync } from 'node:child_process';

import { CommandTarget } from './types.js';
import {
  detectPackageManager,
  getCurrentPackageVersion,
  getTarget,
  readPeerDependencies,
  rootPath,
} from './utils.js';

export function postinstall() {
  const target = getTarget();

  if (target) {
    const peerDependencies = readPeerDependencies(target);
    const packageManager = detectPackageManager();
    const pkgVersion = getCurrentPackageVersion();
    const deps = Object.entries(peerDependencies).map(([name, version]) => `${name}@${version}`);
    const installCommand = `${packageManager} add -D --ignore-scripts ${deps.join(' ')}`;
    execSync(`cd ${rootPath} && ${installCommand}`, { stdio: 'inherit' });
  } else {
    console.error(`No target found: values must be ${Object.values(CommandTarget).join(' | ')}`);
  }
}
