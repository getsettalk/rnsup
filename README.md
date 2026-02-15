<img width="1536" height="1024" alt="RNSUP React Native Setup" src="https://github.com/user-attachments/assets/3a35bc32-3413-40e5-8355-5db4806923a4" />

# RNSUP — React Native Support CLI

![npm](https://img.shields.io/npm/v/rnsup?color=blue&label=npm) ![license](https://img.shields.io/badge/license-MIT-green) ![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

**RNSUP** helps you set up a production-ready React Native project in minutes instead of hours.

What normally takes 3–6 hours of manual configuration — installation, setup, folder structure, aliases, API client setup — gets done automatically with a single command.

---

## Features at a Glance

| Feature | What You Get |
|---------|-------------|
| **Navigation** | React Navigation with preset stacks configured |
| **Performance** | Reanimated + Worklets for smooth animations |
| **Gestures** | Gesture Handler pre-integrated |
| **Routing** | TypeScript paths and Babel aliases |
| **APIs** | Axios with interceptors ready to use |
| **Utilities** | Responsive helpers, image imports, TypeScript support |
| **State** | Zustand store setup with TypeScript |
| **Generators** | CLI commands for screens, components, and folders |
| **Structure** | Pre-built folder organization |

---

## Install & Setup

No global installation needed. Just run:

```bash
npx create-rn MyApp
cd MyApp
npx rnsup setup
```

Follow the prompts to select your package manager. That's it—your project is ready.

```bash
npx react-native start --reset-cache
npx react-native run-android
```

---

## What Gets Installed

RNSUP automatically installs and configures these packages:

| Package | Purpose | Type |
|---------|---------|------|
| `@react-navigation/native` | Screen navigation | Required |
| `react-native-gesture-handler` | Touch gesture support | Required |
| `react-native-reanimated` | Smooth animations | Required |
| `react-native-screens` | Performance optimization | Required |
| `axios` | HTTP client | Required |
| `zustand` | State management | Required |
| `@tanstack/react-query` | Data fetching | Required |
| `react-native-mmkv` | Fast storage | Required |
| `react-native-vector-icons` | Icon library | Required |
| `@react-navigation/native-stack` | Stack navigation | Optional |
| `@react-navigation/bottom-tabs` | Tab navigation | Optional |
| `react-native-svg` | SVG support | Optional |
| `lucide-react-native` | Icon set | Optional |

⚠️ **Note:** Many packages include native code. After setup, you'll need to complete native configuration for iOS and Android (pod install, gradle sync, manifest updates). Check the official docs for each package.

---

## Project Structure

After setup, your project will have:

```
src/
├── components/     # Reusable UI components
├── screens/        # App screens/pages
├── services/       # API calls & external services
├── utils/          # Helper functions
├── hooks/          # Custom React hooks
├── navigation/     # Navigation Screen (Stack, Tab, Drawer)
├── store/          # State management
├── theme/          # Colors, typography, styling
├── assets/         # Images, fonts, static files
└── types/          # TypeScript types & interfaces
```

---

## Commands

### Generate a Screen

```bash
rnsup g s LoginScreen
rnsup g s auth/LoginScreen
rnsup g s features/auth/LoginScreen
```

Choose from: **Basic**, **List**, **Form**, or **Detail** templates.

### Generate a Component

```bash
rnsup g c Button
rnsup g c ui/Card
rnsup g c forms/TextInput
```

Creates `.tsx` by default (press Enter) or choose `.jsx`.

### Generate a Folder

```bash
rnsup g d themes
rnsup g d src/api
rnsup g d src/utils/helpers
```

Auto-registers TypeScript aliases for `src/` folders.

### View Project Structure

```bash
rnsup view           # Show raw structure
rnsup view -p        # Show with icons and colors
rnsup view --time    # Show with timestamps
rnsup view -p --time # Pretty + timestamps
```

Choose between Root level or src/ folder when prompted.

---

## Usage Examples

### Import Components (No Relative Paths)

Instead of:
```typescript
import Button from '../../../components/Button';
```

Use:
```typescript
import Button from '@components/Button';
```

Automatically configured aliases:
- `@components` → `src/components/`
- `@screens` → `src/screens/`
- `@services` → `src/services/`
- `@utils` → `src/utils/`
- `@hooks` → `src/hooks/`
- `@store` → `src/store/`
- `@theme` → `src/theme/`
- `@assets` → `src/assets/`
- `@types` → `src/types/`
- `@navigation` → `src/navigation/`

### Use the API Client

```typescript
import api from '@services/api/client';

// GET request
const users = await api.get('/users');

// POST request  
const response = await api.post('/login', { email, password });
```

Interceptors are pre-configured for error handling and auth tokens.

### Responsive Layouts

```typescript
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '@utils/responsive-screen';

<View style={{ width: wp(80), height: hp(50) }} />
```

Works on all device sizes without manual breakpoints.

### Import Images in TypeScript

```typescript
import logo from '@assets/logo.png';

<Image source={logo} style={{ width: 100, height: 100 }} />
```

No TypeScript errors—types are automatically set up.

---

## Auto Aliases

New folders inside `src/` automatically get alias support:

```bash
rnsup g d src/modals
# Now use: import Modal from '@modals/MyModal';
```

Aliases update in both TypeScript `tsconfig.json` and Babel `.babelrc`.

---

## Best Practices

1. **Always use generators** — Keeps aliases and structure consistent
2. **Avoid manual folders** — Use `rnsup g d` instead
3. **Keep folder names consistent** — Use kebab-case or camelCase, not spaces
4. **Update native config** — Don't skip iOS/Android setup
5. **Commit early** — Make a git commit right after `rnsup setup`

---

## Troubleshooting

**Error: "Not a React Native CLI project"**
- Run `rnsup setup` from your React Native project root (where `package.json` exists)

**Error: "Selected package manager is not installed"**
- Install npm, yarn, or pnpm first

**Native build fails after setup**
- Run `cd ios && pod install` (macOS only)
- Check your Android SDK and NDK are up to date
- Read the official docs for each native package

**Aliases not working**
- Run `npx react-native start --reset-cache`
- If still broken, check `tsconfig.json` has correct paths

---

## Contributing

Found a bug or want a feature? Open an issue or submit a PR at dev branch.

---

## License

MIT © 2026
