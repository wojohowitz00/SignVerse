# Codebase Structure

**Analysis Date:** 2026-02-02

## Directory Layout

```
asl-learning-app/
├── ASL-Immersion-Companion/    # Main application root
│   ├── client/                 # React Native frontend (Expo)
│   ├── server/                 # Express.js backend
│   ├── shared/                 # Shared schema and types
│   ├── modules/                # Custom native modules
│   ├── assets/                 # Static images, icons, fonts
│   ├── migrations/             # Drizzle ORM migrations
│   ├── scripts/                # Build and utility scripts
│   ├── app.json                # Expo app configuration
│   ├── package.json            # Dependencies and scripts
│   ├── tsconfig.json           # TypeScript configuration
│   └── drizzle.config.ts       # Drizzle ORM configuration
├── cloud-pipeline/             # ASL video generation pipeline
├── docs/                       # Project documentation
├── src/                        # Research/reference code
└── .planning/codebase/         # Architecture documentation
```

## Directory Purposes

**ASL-Immersion-Companion:**
- Purpose: Complete learning application combining client and server
- Contains: Full-stack TypeScript application code
- Key files: `package.json`, `app.json`, `tsconfig.json`

**client:**
- Purpose: React Native mobile and web UI
- Contains: Components, screens, navigation, hooks, type definitions, data files
- Key files: `App.tsx`, `navigation/`, `screens/`, `components/`

**server:**
- Purpose: Express.js API and manifest server
- Contains: HTTP middleware setup, route registration, static file serving
- Key files: `index.ts`, `routes.ts`, `storage.ts`

**shared:**
- Purpose: Database schema and shared types
- Contains: Drizzle ORM table definitions, Zod validation schemas
- Key files: `schema.ts`

**modules:**
- Purpose: Custom native modules (e.g., ASL recognition)
- Contains: Platform-specific code for native features
- Key files: `asl-recognition/` (local npm package)

**client/components:**
- Purpose: Reusable UI building blocks
- Contains: Theme-aware components for text, buttons, cards, video players
- Key files: 20+ component files including `ASLVideoPlayer.tsx`, `SignCard.tsx`, `Button.tsx`

**client/screens:**
- Purpose: Full-screen views for each major feature
- Contains: Feature screens and detail screens
- Key files: `PracticeScreen.tsx`, `VocabularyScreen.tsx`, `ProgressScreen.tsx`, `ProfileScreen.tsx`, detail screens

**client/navigation:**
- Purpose: Navigation structure and routing
- Contains: Stack and tab navigator definitions with type-safe params
- Key files: `RootStackNavigator.tsx`, `MainTabNavigator.tsx`, feature stack navigators

**client/hooks:**
- Purpose: Reusable stateful logic
- Contains: Custom React hooks for themes, storage, content management
- Key files: `useStorage.ts`, `useContent.ts`, `useTheme.ts`, `useScreenOptions.ts`

**client/lib:**
- Purpose: Shared utilities and service classes
- Contains: ContentManager for offline caching, query client configuration
- Key files: `content-manager.ts`, `query-client.ts`

**client/data:**
- Purpose: Static content for learning
- Contains: Sign vocabulary, grammar lessons, practice scenarios with metadata
- Key files: `vocabulary.ts` (100+ signs), `scenarios.ts` (1155 lines), `grammar.ts`

**client/constants:**
- Purpose: Theme and configuration constants
- Contains: Color palettes, spacing, typography, avatars
- Key files: `theme.ts` (158 lines), `avatars.ts`

**client/types:**
- Purpose: TypeScript type definitions
- Contains: Interface definitions for Sign, Scenario, Conversation, UserProgress, etc.
- Key files: `index.ts` (89 lines)

**server/templates:**
- Purpose: HTML templates for landing page
- Contains: HTML with placeholders for dynamic content
- Key files: `landing-page.html`

**assets:**
- Purpose: Static media for the application
- Contains: Images, icons, fonts used by UI
- Key files: Various image and font files

**migrations:**
- Purpose: Database schema versions
- Contains: Drizzle ORM-generated migration files
- Key files: Generated .ts files in date-stamped folders

**scripts:**
- Purpose: Build and utility automation
- Contains: Build scripts for static Expo files
- Key files: `build.js` and others

## Key File Locations

**Entry Points:**
- Client: `ASL-Immersion-Companion/client/App.tsx` - Main React component
- Server: `ASL-Immersion-Companion/server/index.ts` - Express app initialization
- Navigation: `ASL-Immersion-Companion/client/navigation/RootStackNavigator.tsx` - Route definitions

**Configuration:**
- App config: `ASL-Immersion-Companion/app.json` - Expo app settings
- TypeScript: `ASL-Immersion-Companion/tsconfig.json` - TS compiler options
- Database: `ASL-Immersion-Companion/drizzle.config.ts` - Drizzle ORM config
- ESLint: `ASL-Immersion-Companion/eslint.config.js` - Linting rules
- Babel: `ASL-Immersion-Companion/babel.config.js` - Module resolution and plugins

**Core Logic:**
- Content Management: `ASL-Immersion-Companion/client/lib/content-manager.ts` - Offline caching
- Storage: `ASL-Immersion-Companion/client/hooks/useStorage.ts` - AsyncStorage wrapper
- Database Schema: `ASL-Immersion-Companion/shared/schema.ts` - Drizzle table definitions

**Testing:**
- Currently no test files in `/ASL-Immersion-Companion` (only in node_modules)

## Naming Conventions

**Files:**
- Components: PascalCase `.tsx` (e.g., `PracticeScreen.tsx`, `SignCard.tsx`)
- Hooks: camelCase starting with `use` `.ts` (e.g., `useStorage.ts`, `useContent.ts`)
- Utilities/Services: camelCase `.ts` (e.g., `content-manager.ts`, `query-client.ts`)
- Screens: PascalCase with `Screen` suffix `.tsx` (e.g., `PracticeScreen.tsx`)
- Navigator files: PascalCase with `Navigator` suffix `.tsx` (e.g., `RootStackNavigator.tsx`)
- Data files: camelCase `.ts` (e.g., `vocabulary.ts`, `scenarios.ts`)
- Constants: camelCase `.ts` (e.g., `theme.ts`, `avatars.ts`)

**Directories:**
- Feature-based: lowercase (e.g., `screens`, `components`, `navigation`)
- Feature modules: camelCase (e.g., `asl-recognition`)
- Generated: lowercase (e.g., `migrations`, `.next`)

**Type Names:**
- Interfaces: PascalCase (e.g., `Sign`, `Scenario`, `UserProgress`, `ContentManager`)
- Union types: PascalCase (e.g., `PartnerType`, `SigningMediaType`)
- Schema types: `Insert*` and `*` patterns (e.g., `InsertUser`, `User`)

**Variable Names:**
- Components/Exports: PascalCase (e.g., `PracticeScreen`, `SignCard`)
- Hooks: `use*` camelCase (e.g., `useStorage`, `useContent`)
- Constants: UPPER_SNAKE_CASE for storage keys (e.g., `STORAGE_KEYS.USER_PROGRESS`)
- Functions: camelCase (e.g., `getApiUrl`, `apiRequest`, `downloadItem`)

## Where to Add New Code

**New Feature (Screen):**
- Primary code: `ASL-Immersion-Companion/client/screens/FeatureScreen.tsx`
- Navigation: Add to `ASL-Immersion-Companion/client/navigation/` with type-safe params
- Data (if needed): `ASL-Immersion-Companion/client/data/feature.ts`
- Tests: Not currently present, would go in `/tests` mirroring structure

**New Component/Module:**
- Reusable component: `ASL-Immersion-Companion/client/components/ComponentName.tsx`
- Feature-specific component: In same directory as using screen or in `components/`
- Hooks: `ASL-Immersion-Companion/client/hooks/useFeature.ts`
- Service class: `ASL-Immersion-Companion/client/lib/feature-manager.ts`

**Utilities:**
- Client utilities: `ASL-Immersion-Companion/client/lib/utility-name.ts`
- Server utilities: `ASL-Immersion-Companion/server/utility-name.ts`
- Shared utilities: Not currently used, would go in `ASL-Immersion-Companion/shared/`

**Database:**
- Schema changes: Update `ASL-Immersion-Companion/shared/schema.ts`
- Run migrations: `npm run db:push`
- Generated files: Auto-created in `ASL-Immersion-Companion/migrations/`

**API Routes:**
- New endpoints: `ASL-Immersion-Companion/server/routes.ts` (currently empty, scaffold needed)
- Auth: Uses MemStorage interface in `ASL-Immersion-Companion/server/storage.ts`

**Static Content:**
- Signs/vocabulary: `ASL-Immersion-Companion/client/data/vocabulary.ts`
- Scenarios/conversations: `ASL-Immersion-Companion/client/data/scenarios.ts`
- Grammar lessons: `ASL-Immersion-Companion/client/data/grammar.ts`

**Theme/Constants:**
- Colors, spacing, fonts: `ASL-Immersion-Companion/client/constants/theme.ts`
- Avatar definitions: `ASL-Immersion-Companion/client/constants/avatars.ts`

## Special Directories

**node_modules:**
- Purpose: NPM dependencies
- Generated: Yes (run `npm install`)
- Committed: No

**.next:**
- Purpose: Next.js build output (if running web version)
- Generated: Yes (build process)
- Committed: No

**migrations:**
- Purpose: Drizzle ORM migration files
- Generated: Yes (`drizzle-kit generate`)
- Committed: Yes (for reproducibility)

**static-build:**
- Purpose: Pre-built Expo app bundles for static serving
- Generated: Yes (`npm run expo:static:build`)
- Committed: No

**.expo:**
- Purpose: Expo CLI state and device info
- Generated: Yes (Expo tooling)
- Committed: No

**modules/asl-recognition:**
- Purpose: Custom native module for ASL hand pose detection
- Generated: No (source code)
- Committed: Yes (local npm package)

