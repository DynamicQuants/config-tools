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
- Vite: A build tool for modern web development.

## 🔌 Installation

To use the configurations in your project, you can install the package using pnpm:

```bash
pnpm install @dynamic-quants/config-tools@latest
```

## 📚 Usage

The usage is very simple and straightforward. You just need to extend the configurations in your project.

1. After installing the package, add the `install` script to your `package.json` file. This script will install the required dependencies for the project. Also checks for the latest version of the package and upgrades it if necessary.

```json
"scripts": {
  "install": "npx @dynamic-quants/config-tools@latest setup"
}
```

2. Add the necessary configurations to your project. For example, if you are using NextJS library, you can add the following to your `package.json` file:

```json
{
  "config-tools": {
    "target": "nextjs",
    "type": "lib"
  }
}
```

The possible values for `target` are `nextjs` and `nestjs`. The possible values for `type` are `lib` and `app`.

## 🔧 Configurations Presets

For now the presets must be imported manually.

You can visit this [Repository](https://github.com/DynamicQuants/moonrepo-templates) to see how to use the configurations in a project.

### 🚫 ESLint

Create a `eslint.config.ts` file in the root of your project and import the preset and extend it.

```ts
// Using the NextJS Library preset.
import { eslintNextjsLib } from '@dynamic-quants/config-tools/eslint';

export default {
  ...eslintNextjsLib,
  {
    // Your custom configurations.
  }
};
```

### 🧪 Jest

Soon...

### 📝 TSConfig

Soon...

### 🎥 Playwright

Soon...

### 🎨 Prettier

Soon...

### 🎨 Tailwind

Soon...

### 🧪 Vite

Soon...
