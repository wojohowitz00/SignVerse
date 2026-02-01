# Technology Stack

**Analysis Date:** 2026-01-31

## Languages

**Primary:**
- TypeScript 5.9.2 - Used throughout client and server code
- JavaScript - Legacy entry point and config files

**Secondary:**
- CSS/StyleSheet - React Native styling via StyleSheet API

## Runtime

**Environment:**
- Node.js 22 - Server runtime (from .replit nix config)

**Package Manager:**
- npm - Primary package manager
- Lockfile: package-lock.json (present)

## Frameworks

**Core:**
- React 19.1.0 - UI framework for web rendering
- React Native 0.81.5 - Cross-platform mobile framework (iOS/Android)
- Expo 54.0.23 - React Native development platform with managed workflow
- Express 5.0.1 - Backend HTTP server

**Navigation & UI:**
- @react-navigation/native 7.1.8 - Core navigation framework
- @react-navigation/native-stack 7.3.16 - Stack navigation for screens
- @react-navigation/bottom-tabs 7.4.0 - Bottom tab navigation
- react-native-gesture-handler 2.28.0 - Gesture handling
- react-native-reanimated 4.1.1 - Smooth animations
- react-native-safe-area-context 5.6.0 - Safe area boundaries
- react-native-screens 4.16.0 - Native screen components
- react-native-keyboard-controller 1.18.5 - Keyboard behavior management

**UI Components & Effects:**
- @expo/vector-icons 15.0.2 - Icon library
- expo-image 3.0.10 - Image component
- expo-linear-gradient 15.0.8 - Gradient backgrounds
- expo-blur 15.0.7 - Blur effects
- expo-glass-effect 0.1.6 - Glass morphism effects
- @lottiefiles/dotlottie-react 0.13.5 - Lottie animations
- lottie-react-native 7.3.5 - Lottie for React Native
- react-native-svg 15.15.1 - SVG rendering

**Data Management:**
- @tanstack/react-query 5.90.7 - Server state management, caching, synchronization
- drizzle-orm 0.39.3 - Lightweight TypeScript ORM
- drizzle-zod 0.7.0 - Schema validation integration
- zod 3.24.2 - Schema validation and runtime type checking
- zod-validation-error 3.4.0 - Enhanced validation error messages

**Storage & Persistence:**
- @react-native-async-storage/async-storage 2.2.0 - Client-side persistent storage
- pg 8.16.3 - PostgreSQL client driver

**Web & Platform:**
- react-native-web 0.21.0 - React Native for web browsers
- react-dom 19.1.0 - React DOM rendering

**Dev Tools & Build:**
- expo-av 16.0.8 - Audio/video playback
- expo-font 14.0.9 - Custom font loading
- expo-constants 18.0.9 - App constants
- expo-haptics 15.0.7 - Haptic feedback
- expo-linking 8.0.8 - Deep linking
- expo-splash-screen 31.0.10 - Splash screen control
- expo-status-bar 3.0.8 - Status bar styling
- expo-symbols 1.0.7 - SF Symbols for iOS
- expo-system-ui 6.0.8 - System UI styling
- expo-web-browser 15.0.9 - Web browser integration
- react-native-worklets 0.5.1 - Worklet utilities

**HTTP & Proxying:**
- http-proxy-middleware 3.0.5 - HTTP request proxying
- ws 8.18.0 - WebSocket support

## Testing

**Not detected** - No testing framework configured

## Build & Development Tools

**Build:**
- esbuild - Bundler for server code (configured in npm scripts as `npm run server:build`)
- tsx 4.20.6 - TypeScript execution for development

**Linting & Formatting:**
- ESLint 9.25.0 - JavaScript/TypeScript linting
- eslint-config-expo 10.0.0 - Expo-specific ESLint config
- eslint-config-prettier 10.1.8 - Prettier integration with ESLint
- eslint-plugin-prettier 5.5.4 - Prettier as ESLint plugin
- eslint-import-resolver-node 0.3.9 - ESLint import resolution
- Prettier 3.6.2 - Code formatter

**Type Checking:**
- TypeScript - For type checking via `npm run check:types`

**Database Tooling:**
- drizzle-kit 0.31.4 - Migration and schema management

**Module Resolution:**
- babel-plugin-module-resolver 5.0.2 - Path alias resolution for Babel

## Configuration

**TypeScript:**
- Config file: `tsconfig.json`
- Extends: expo/tsconfig.base.json
- Path aliases: `@/*` → `./client/*`, `@shared/*` → `./shared/*`
- Strict mode enabled

**Babel:**
- Config file: `babel.config.js`
- Module resolver plugin for path aliases

**Database:**
- Config file: `drizzle.config.ts`
- Dialect: PostgreSQL
- Migrations directory: `./migrations`
- Schema: `./shared/schema.ts`

**Expo:**
- Config file: `app.json`
- App name: SignSpeak
- iOS bundle: com.signspeak.app
- Android package: com.signspeak.app
- React Compiler enabled (newArchEnabled: true)
- Plugins: expo-splash-screen, expo-web-browser

**Environment:**
- Key env var: `EXPO_PUBLIC_DOMAIN` - Used for API URL construction
- Key env var: `DATABASE_URL` - PostgreSQL connection string
- Key env var: `PORT` - Server port (default: 5000)
- Key env var: `NODE_ENV` - Environment mode (development/production)
- Key env var: `REPLIT_DEV_DOMAIN` - Replit development domain

## Platform Requirements

**Development:**
- Node.js 22+
- npm
- Expo CLI (via npx)
- TypeScript 5.9.2

**Production/Deployment:**
- Node.js 22+ runtime
- PostgreSQL database
- CloudRun (from .replit deployment target)
- Environment variables: DATABASE_URL, EXPO_PUBLIC_DOMAIN, PORT

**Client Platforms:**
- iOS (via Expo)
- Android (via Expo)
- Web browsers (via Expo web)

## Scripts

**Development:**
- `npm run expo:dev` - Start Expo development server with Replit proxy
- `npm run server:dev` - Start Express server with tsx (hot reload)

**Build & Production:**
- `npm run expo:static:build` - Build static Expo bundle
- `npm run server:build` - Bundle server with esbuild for production
- `npm run server:prod` - Run production server

**Database:**
- `npm run db:push` - Apply schema migrations via drizzle-kit

**Quality:**
- `npm run lint` - Lint with ESLint (Expo config)
- `npm run lint:fix` - Auto-fix linting issues
- `npm run check:types` - Type check with TypeScript
- `npm run check:format` - Check format with Prettier
- `npm run format` - Format code with Prettier

---

*Stack analysis: 2026-01-31*
