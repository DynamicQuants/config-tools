/**
 * This file is part of the `@dynamic-quants/config-tools` package.
 * Copyright (c) Dynamic Quants and affiliates.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { ProjectTarget } from './types.js';
import {
  getProjectTarget,
  getProjectType,
  installPeers,
  isMonorepo,
  monorepoTargets,
  rootPath,
} from './utils.js';

/**
 * Postinstall hook.
 */
export function postinstall() {
  const monorepo = isMonorepo();
  console.log(`postinstall running in: ${rootPath}`);
  console.log(`Is monorepo: ${isMonorepo()}`);

  if (monorepo) {
    monorepoTargets().forEach(({ target, type, path, name }) =>
      installPeers(target, type, path, name),
    );
  } else {
    const target = getProjectTarget();
    const type = getProjectType();
    if (!target) {
      console.error(`No target found: values must be ${Object.values(ProjectTarget).join(' | ')}`);
      return;
    }
    installPeers(target, type);
  }
}
