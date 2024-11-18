# Dynamic Quants Tools Configurations

This repository contains the configurations for Typescript/JavaScript development tools used by the Dynamic Quants Team.

## Motivation

The goal of this repository is to provide a set of configurations that can be used in any project. This saves us from having to copy and paste the same configurations across projects and allows us to manage them in one place 😎.

## How to use

To use the configurations in your project, you can install the package using pnpm:

```bash
pnpm install @dynamic-quants/tools-configs@latest
```

## ESLint

To use the ESLint configurations, you can add the following to your `.eslintrc.js` file:

```javascript
/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@dynamic-quants/eslint-config/{base|nestjs|nextjs|react}'],
};
```

## Jest

To use the Jest configurations, you can add the following to your `jest.config.js` file:

```javascript
module.exports = {
  ...require('@dynamic-quants/tools-configs/jest/{base|nestjs|nextjs}'),
};
```

Or you can extend the configurations in your `jest.config.ts` file:

```typescript
import config from '@dynamic-quants/tools-configs/jest/{base|nestjs|nextjs}';

export default config;
```

## TypeScript

To use the TypeScript configurations, you can add the following to your `tsconfig.json` file:

```json
{
  "extends": "@dynamic-quants/tools-configs/typescript/{base|nestjs-library|nestjs|nextjs|react-library}.json"
}
```

## Prettier

To use the Prettier configurations, you can add the following to your `.prettierrc.js` file:

```javascript
/** @type {import("prettier").Config} */
module.exports = require('@dynamic-quants/tools-configs/prettier');
```

## Tailwind

To use the Tailwind configurations, you can add the following to your `tailwind.config.ts` file:

```typescript
import type { Config } from 'tailwindcss';

import tailwindConfig from '@dynamic-quants/tools-configs/tailwind';

const config: Config = {
  presets: [tailwindConfig],
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {},
  plugins: [],
};

export default config;
```
