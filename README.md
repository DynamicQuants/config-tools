# Dynamic Quants Configurations

This repository contains the configurations for Typescript/JavaScript development tools used by the Dynamic Quants Team.

## 💡 Motivation

The goal of this repository is to provide a set of configurations that can be used in any project. This saves us from having to copy and paste the same configurations across projects and allows us to manage them in one place 😎.

## 🚀 Features

This package contains the following configurations focused on applications and libraries on top of NextJS, React, NestJS, and Node.js technologies:

- ESLint: A linting tool for JavaScript.
- Jest: A testing framework for JavaScript.
- TypeScript: A programming language for JavaScript.
- Playwright: A framework for browser automation and testing.
- Prettier: A code formatter for JavaScript.
- Tailwind: A utility-first CSS framework for rapidly building custom designs.

You can visit this [Repository](https://github.com/DynamicQuants/moonrepo-templates) to see how to use the configurations in a project.

## 🔌 Installation

To use the configurations in your project, you can install the package using pnpm:

```bash
pnpm install @dynamic-quants/config-tools@latest
```

## 📚 Usage

The usage is very simple and straightforward. You just need to extend the configurations in your project.

### 🚫 ESLint

To use the ESLint configurations, you can add the following to your `.eslintrc.js` file:

```javascript
/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    require.resolve('@dynamic-quants/config-tools/eslint-config/{base|nestjs|nextjs|react}'),
  ],
  // Rest of the configuration...
};
```

**Available ESLint Configurations**

- `base`: Base ESLint configuration for all projects.
- `nestjs`: ESLint configuration for NestJS projects.
- `nextjs`: ESLint configuration for NextJS projects.
- `react`: ESLint configuration for React projects.

### 🧪 Jest

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

### 📝 TypeScript (TSConfig)

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

### 🎥 Playwright

To use the Playwright configurations, you can add the following to your `playwright.config.ts` file:

```typescript
import config from '@dynamic-quants/config-tools/playwright';

export default config;
```

### 🎨 Prettier

To use the Prettier configurations, you can add the following to your `.prettierrc.js` file:

```javascript
/** @type {import("prettier").Config} */
module.exports = require('@dynamic-quants/config-tools/prettier');
```

### 🎨 Tailwind

To use the Tailwind configurations, you can add the following to your `tailwind.config.ts` file:

```typescript
import tailwindConfig from '@dynamic-quants/config-tools/tailwind';
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [tailwindConfig],
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {},
  plugins: [],
};

export default config;
```

## 📦 Dependencies

To get the best experience, you need to install the following peer dependencies in your project depending on the technology you are using:

### NextJS

```bash
pnpm add -D @dynamic-quants/config-tools@^1.0.6 \
  @next/eslint-plugin-next@14 \
  @playwright/test@1.49.0 \
  @testing-library/jest-dom@^6.6.3 \
  @testing-library/react@^16.0.1 \
  @trivago/prettier-plugin-sort-imports@4.3.0 \
  @types/jest@^29.5.14 \
  @types/react@18.2.45 \
  @types/react-dom@18.3.1 \
  @vercel/style-guide@^6.0.0 \
  eslint@8.57.1 \
  eslint-plugin-only-warn@^1.1.0 \
  jest@29.7.0 \
  jest-environment-jsdom@^29.7.0 \
  postcss@^8.4.49 \
  prettier-plugin-multiline-arrays@^3.0.6 \
  tailwindcss@^3.4.15 \
  typescript@5.5.4
```
