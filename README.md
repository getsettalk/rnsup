<img width="1536" height="1024" alt="1000241861" src="https://github.com/user-attachments/assets/3a35bc32-3413-40e5-8355-5db4806923a4" />


# RNSUP — React Native Support CLI

![npm](https://img.shields.io/npm/v/rnsup?color=blue&label=npm)&nbsp;![license](https://img.shields.io/badge/license-MIT-green)&nbsp;![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

**RNSUP** is a developer productivity CLI that converts a fresh React Native CLI project into a production-ready architecture.

Instead of spending 3–6 hours configuring navigation, alias paths, reanimated, gesture handler, axios setup and folder structure, you can do everything with **one command**.

---

## Why RNSUP?

Starting a React Native CLI project usually requires:

* Installing React Navigation dependencies
* Configuring Reanimated
* Adding Gesture Handler import
* Setting up TypeScript aliases
* Creating folder structure
* Writing axios interceptors
* Adding responsive utilities
* Supporting image imports in TypeScript

Most developers repeat this setup for every project.

**RNSUP automates all of it.**

---

## What RNSUP Does

After running setup, your project automatically gets:

### Configuration

* React Navigation dependencies installed
* Reanimated + Worklets configured
* Gesture Handler patched
* Babel alias configuration
* TypeScript path aliases
* Lockfile conflict handled (npm/yarn)

### Architecture

```
src/
  components/
  screens/
  services/
  utils/
  hooks/
  store/
  theme/
  assets/
  types/
```

### Utilities Added

* Axios API client with interceptors
* Responsive screen helpers
* Image import TypeScript support
* Clean folder structure

---

## Installed packages (default)

RNSUP installs a curated set of libraries into your project. These are added automatically when you run `npx rnsup setup` (some are optional via prompt):

- `@react-navigation/native`
- `react-native-screens`
- `react-native-gesture-handler`
- `react-native-reanimated`
- `react-native-worklets` (Babel plugin integration)
- `react-native-vector-icons`
- `zustand`
- `axios`
- `@tanstack/react-query`
- `react-native-mmkv`
- navigation extras (conditional): `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`, `@react-navigation/drawer`
- optional (prompted): `react-native-svg`, `lucide-react-native`

<div style="background:#fff3cd;border-left:6px solid #ffeeba;padding:12px;border-radius:6px">
  <strong>⚠️ Warning</strong>
  <p style="margin:6px 0 0">Many of the packages above include native code. After installation you <strong>must</strong> verify and complete any required native configuration (for iOS and Android). Common steps include:</p>
  <ul style="margin:6px 0 0;padding-left:20px">
    <li>Run <code>cd ios && pod install</code> on macOS</li>
    <li>Follow the official docs for Reanimated, MMKV, react-native-svg and React Navigation</li>
    <li>Check Android Gradle / manifest changes for native modules</li>
  </ul>
  <p style="margin:6px 0 0">If something looks off (build errors, missing icons, or runtime crashes), consult the package docs first — RNSUP does not (and cannot) run platform-specific installs for you.</p>
</div>

---
### Developer Experience

* Auto import aliases (`@components`, `@services`, etc.)
* Code generators (screens & components)
* History tracking

---

## Installation

You DO NOT install RNSUP globally.

Use directly via npx:

```bash
npx rnsup setup
```

---

## Quick Start

### 1) Create React Native Project
 for creating latest cli project !

```bash
npx create-rn
cd MyApp
```

### 2) Run RNSUP

```bash
npx rnsup setup
```

Follow the prompts.

After setup:

```bash
npx react-native start --reset-cache
npx react-native run-android
```

Your project is ready.

---

## Commands

### Setup Project

```
npx rnsup setup
```

---

### Generate Screen

> Here `s` mean `screen`, and `g` mean `generate`


```
rnsup g s Login
rnsup g s auth/Login
rnsup g s features/auth/Login
```

Examples created:

```
src/screens/LoginScreen.tsx
src/auth/LoginScreen.tsx
src/features/auth/LoginScreen.tsx
```

---

### Generate Component

> Here `c` mean `component`

```
rnsup g c Button
rnsup g c ui/forms/Input
```

Created:

```
src/components/Button.tsx
src/components/ui/forms/Input.tsx
```

---

## Auto Alias Support

You can import without relative paths.

Instead of:

```ts
import Button from '../../../components/Button';
```

Use:

```ts
import Button from '@components/Button';
```

Aliases automatically configured:

```
@components
@services
@utils
@hooks
@store
@theme
@assets
```

New folders inside `src` automatically get alias support.

---

## Axios Usage

```ts
import api from '@services/api/client';

const users = await api.get('/users');
```

Interceptors already configured.

---

## Responsive Utility

```ts
import { widthPercentageToDP as wp } from '@utils/responsive-screen';

<View style={{ width: wp(80) }} />
```

---

## Image Import Support

```ts
import logo from '@assets/logo.png';

<Image source={logo} />
```

No TypeScript error.

---

## Why It Is Useful

RNSUP removes repetitive setup work and enforces a consistent architecture across projects and teams.

Benefits:

* Saves 3–6 hours per project
* Prevents configuration mistakes
* Standardizes project structure
* Faster onboarding for new developers
* Clean import paths
* Production-ready base

---

## Best Practices

Recommended workflow:

1. Create project
2. Run `rnsup setup`
3. Only create screens/components using `rnsup g`
4. Avoid manual folder creation inside `src`

This ensures aliases and exports always remain correct.


## Contribution

Pull requests are welcome.

If you find a bug or want a feature, open an issue.

---

## License

MIT License
