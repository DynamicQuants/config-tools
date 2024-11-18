# Dynamic Quants Configurations

This repository contains the configurations for Typescript/JavaScript development tools used by the Dynamic Quants Team.

## Motivation

The goal of this repository is to provide a set of configurations that can be used in any project. This saves us from having to copy and paste the same configurations across projects and allows us to manage them in one place 😎.

## How to use

To use the configurations in your project, you can install the package using pnpm:

```bash
pnpm install @dynamic-quants/config-tools@latest
```

## ESLint

To use the ESLint configurations, you can add the following to your `.eslintrc.js` file:

```javascript
/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@dynamic-quants/config-tools/eslint-config/{base|nestjs|nextjs|react}'],
};
```

**Available ESLint Configurations**

- `base`: Base ESLint configuration for all projects.
- `nestjs`: ESLint configuration for NestJS projects.
- `nextjs`: ESLint configuration for NextJS projects.
- `react`: ESLint configuration for React projects.

## Jest

To use the Jest configurations, you can add the following to your `jest.config.js` file:

```javascript
module.exports = {
  ...require('@dynamic-quants/config-tools/jest/{base|nestjs|nextjs}'),
};
```

Or you can extend the configurations in your `jest.config.ts` file:

```typescript
import config from '@dynamic-quants/config-tools/jest/{base|nestjs|nextjs}';

export default config;
```

**Available Jest Configurations**

- `base`: Base Jest configuration for all projects.
- `nestjs`: Jest configuration for NestJS projects.
- `nextjs`: Jest configuration for NextJS projects.

## TypeScript (TSConfig)

To use the TypeScript configurations, you can add the following to your `tsconfig.json` file:

```json
{
  "extends": "@dynamic-quants/config-tools/typescript/{base|nestjs-library|nestjs|nextjs|react-library}.json"
}
```

**Available TypeScript Configurations**

- `base`: Base TypeScript configuration for all projects.
- `nestjs-library`: TypeScript configuration for NestJS libraries.
- `nestjs`: TypeScript configuration for NestJS projects.
- `nextjs`: TypeScript configuration for NextJS projects.
- `react-library`: TypeScript configuration for React libraries.

## Prettier

To use the Prettier configurations, you can add the following to your `.prettierrc.js` file:

```javascript
/** @type {import("prettier").Config} */
module.exports = require('@dynamic-quants/config-tools/prettier');
```

## Tailwind

To use the Tailwind configurations, you can add the following to your `tailwind.config.ts` file:

```typescript
import type { Config } from 'tailwindcss';

import tailwindConfig from '@dynamic-quants/config-tools/tailwind';

const config: Config = {
  presets: [tailwindConfig],
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {},
  plugins: [],
};

export default config;
```
