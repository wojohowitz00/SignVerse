# Codebase Structure

**Analysis Date:** 2026-01-31

## Directory Layout

```
ASL-Immersion-Companion/
├── client/                      # React Native/Expo frontend
│   ├── App.tsx                  # App root with providers
│   ├── index.js                 # Expo entry point
│   ├── screens/                 # Feature screen containers
│   ├── navigation/              # Navigation stacks and routes
│   ├── components/              # Reusable UI components
│   ├── hooks/                   # Custom React hooks for state
│   ├── lib/                     # Utilities and query client
│   ├── data/                    # Static learning content
│   ├── constants/               # Theme and config constants
│   └── types/                   # TypeScript type definitions
├── server/                      # Express.js backend
│   ├── index.ts                 # Express app setup and bootstrap
│   ├── routes.ts                # API route definitions
│   ├── storage.ts               # Data persistence abstraction
│   └── templates/               # HTML templates for landing page
├── shared/                      # Shared code and types
│   └── schema.ts                # Drizzle table definitions and Zod schemas
├── assets/                      # Static media
│   ├── animations/              # Lottie animation files
│   ├── avatars/                 # Avatar images
│   └── images/                  # App images and icons
├── attached_assets/             # Additional asset attachments
├── scripts/                     # Build and utility scripts
│   └── build.js                 # Expo static build script
├── .config/                     # Configuration files
├── .planning/                   # Planning and analysis docs
├── .beads/                      # Task tracking state (bd)
├── package.json                 # NPM dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── drizzle.config.ts            # Drizzle ORM configuration
├── babel.config.js              # Babel transpilation config
└── eslint.config.js             # ESLint configuration
```

## Directory Purposes

**client/:**
- Purpose: React Native application code, all UI and client-side logic
- Contains: Screens, components, hooks, navigation, data, types, constants
- Key files: `App.tsx` (root), `index.js` (entry), `navigation/RootStackNavigator.tsx` (main routing)

**client/screens/:**
- Purpose: Top-level screen containers for each feature
- Contains: One component per screen, responsible for data aggregation and layout
- Key files:
  - `PracticeScreen.tsx` (scenarios/conversations)
  - `VocabularyScreen.tsx` (vocabulary browsing)
  - `ProgressScreen.tsx` (progress tracking)
  - `ProfileScreen.tsx` (user profile)
  - `ScenarioDetailScreen.tsx`, `ConversationScreen.tsx`, `SignDetailScreen.tsx`, `GrammarDetailScreen.tsx` (detail views)

**client/navigation/:**
- Purpose: React Navigation setup and route definitions
- Contains: Stack and tab navigators with type-safe route params
- Key files:
  - `RootStackNavigator.tsx` (root navigator, detail screens)
  - `MainTabNavigator.tsx` (bottom tab navigation)
  - `PracticeStackNavigator.tsx`, `VocabularyStackNavigator.tsx`, `ProgressStackNavigator.tsx`, `ProfileStackNavigator.tsx` (feature stacks)

**client/components/:**
- Purpose: Reusable UI building blocks
- Contains: Card components (SignCard, ScenarioCard, GrammarCard, ProgressCard), text/view wrappers (ThemedText, ThemedView), input components (SearchBar), filters (CategoryFilter), other utilities (ErrorBoundary, ErrorFallback, Spacer)
- Key files:
  - `SignCard.tsx` (vocabulary item card with animations)
  - `ScenarioCard.tsx` (practice scenario card)
  - `GrammarCard.tsx` (grammar lesson card)
  - `ThemedText.tsx`, `ThemedView.tsx` (themed primitives)
  - `ErrorBoundary.tsx` (error handling wrapper)

**client/hooks/:**
- Purpose: Custom React hooks for state management and utilities
- Contains: Storage hooks (useUserProgress, useUserProfile, useVocabulary, useGrammarProgress), theme hooks (useTheme, useColorScheme), screen setup hooks (useScreenOptions)
- Key files:
  - `useStorage.ts` (primary state management hook file with 4 exported hooks)
  - `useTheme.ts` (theme context/hook)
  - `useColorScheme.ts`, `useColorScheme.web.ts` (platform-specific color scheme detection)
  - `useScreenOptions.ts` (screen options for navigation)

**client/lib/:**
- Purpose: Utilities and configuration for API communication and queries
- Contains: QueryClient setup, API helper functions
- Key files:
  - `query-client.ts` (QueryClient creation, apiRequest helper, getQueryFn, API URL resolution)

**client/data/:**
- Purpose: Static learning content and data
- Contains: Scenario definitions with conversations, vocabulary word list, grammar lessons
- Key files:
  - `scenarios.ts` (75KB+ practice scenarios with conversations)
  - `vocabulary.ts` (24KB vocabulary word list)
  - `grammar.ts` (grammar lessons with content blocks)

**client/constants/:**
- Purpose: Configuration constants for theming and UI
- Contains: Color palettes, spacing scale, border radius, typography, shadows, avatar list
- Key files:
  - `theme.ts` (Colors, Spacing, BorderRadius, Typography, Shadows objects)
  - `avatars.ts` (avatar metadata)

**client/types/:**
- Purpose: TypeScript type definitions for client-side models
- Contains: Scenario, Conversation, Sign, GrammarLesson, UserProgress, UserProfile, Achievement interfaces
- Key files:
  - `index.ts` (all type definitions in single file)

**server/:**
- Purpose: Express.js backend server code
- Contains: Server setup, route registration, storage abstraction, middleware
- Key files:
  - `index.ts` (Express app initialization, middleware setup, server bootstrap)
  - `routes.ts` (route registration, currently template/empty)
  - `storage.ts` (Storage interface and in-memory implementation)

**server/templates/:**
- Purpose: HTML templates for server responses
- Contains: Landing page template with dynamic placeholder replacement
- Key files:
  - `landing-page.html` (served to web clients)

**shared/:**
- Purpose: Code and types shared between client and server
- Contains: Database schema definitions, validation schemas
- Key files:
  - `schema.ts` (Drizzle pgTable definitions, Zod validation schemas, shared TypeScript types)

**assets/:**
- Purpose: Static media resources
- Contains: Animations (Lottie JSON), avatars (PNG), images (PNG/JPG)
- Key files: Referenced in data files and components via require()

**scripts/:**
- Purpose: Build and automation scripts
- Contains: Expo static build script for production
- Key files:
  - `build.js` (generates static Expo build)

## Key File Locations

**Entry Points:**
- `client/index.js`: Expo app entry, calls registerRootComponent(App)
- `client/App.tsx`: React root with error boundary and provider setup
- `server/index.ts`: Express server entry and bootstrap

**Configuration:**
- `tsconfig.json`: TypeScript compiler options, path aliases (@/*, @shared/*)
- `babel.config.js`: Babel transpilation for React Native
- `eslint.config.js`: Linting rules
- `drizzle.config.ts`: ORM database connection config
- `package.json`: Dependencies and npm scripts

**Core Logic:**
- `client/hooks/useStorage.ts`: State management (progress, profile, vocabulary, grammar)
- `client/lib/query-client.ts`: API communication setup
- `server/storage.ts`: Persistence interface and in-memory storage
- `shared/schema.ts`: Data schemas and validation

**Styling & Theme:**
- `client/constants/theme.ts`: Colors, spacing, typography, shadows
- Individual component StyleSheet.create statements

**Navigation:**
- `client/navigation/RootStackNavigator.tsx`: Root navigation structure
- `client/navigation/MainTabNavigator.tsx`: Bottom tab navigation

**Testing:**
- Test files not detected in codebase structure

## Naming Conventions

**Files:**
- Screens: PascalCase with Screen suffix (e.g., `VocabularyScreen.tsx`, `ConversationScreen.tsx`)
- Components: PascalCase (e.g., `SignCard.tsx`, `ThemedText.tsx`)
- Hooks: camelCase with use prefix (e.g., `useStorage.ts`, `useTheme.ts`)
- Data files: camelCase plural (e.g., `scenarios.ts`, `vocabulary.ts`)
- Types: `index.ts` in types directory
- Constants: camelCase with export const (e.g., theme, avatars in constants/)

**Directories:**
- Feature-based screens: `screens/`
- UI components: `components/`
- React hooks: `hooks/`
- Utilities: `lib/`
- Static data: `data/`
- Configuration: `constants/`
- Type definitions: `types/`

**TypeScript Interfaces:**
- PascalCase for all interfaces (e.g., Scenario, Conversation, Sign, UserProgress)
- No I prefix convention
- Use `export interface Name { }` directly in types/index.ts

**Component Props Interfaces:**
- Suffixed with Props (e.g., SignCardProps, ScenarioCardProps)
- Defined in the same file as component

**Constants:**
- All caps for color hex codes (e.g., primaryColor)
- camelCase for exported objects (e.g., Colors, Spacing, BorderRadius)
- camelCase for hook/function names (e.g., useUserProgress)

## Where to Add New Code

**New Feature (e.g., Lessons tab):**
- Primary code: `client/screens/LessonsScreen.tsx` (main screen container)
- Sub-component: `client/components/LessonCard.tsx` (reusable card)
- Navigation: Add to `client/navigation/MainTabNavigator.tsx` as new Tab.Screen
- New stack: Create `client/navigation/LessonsStackNavigator.tsx` if nested screens needed
- State: Add hook to `client/hooks/useStorage.ts` if user progress needs tracking
- Static data: Add to `client/data/lessons.ts` if new learning content
- Types: Add new interface to `client/types/index.ts`

**New Component:**
- Implementation: `client/components/YourComponent.tsx`
- Use existing component patterns: Props interface in file, theming via useTheme hook, StyleSheet.create for styles
- Export from component file directly (no barrel file)
- Use Feather icons from @expo/vector-icons
- Apply Spacing, BorderRadius constants from theme

**New Screen:**
- Implementation: `client/screens/YourScreen.tsx`
- Follow VocabularyScreen pattern: use FlatList/ScrollView, safe area insets, header/tab bar heights
- Use useTheme hook for styling
- Import components and compose screen
- Export default from file
- Add to appropriate StackNavigator in navigation/

**New Utility/Hook:**
- Implementation: `client/lib/yourUtility.ts` or `client/hooks/useYourHook.ts`
- Hooks managing state: Add to `client/hooks/useStorage.ts` export
- Utilities: New file in lib/ for API, formatting, helpers
- Export functions directly

**New Data/Content:**
- Implementation: `client/data/yourContent.ts`
- Export arrays/objects of type-safe data
- Import and use in screens via direct reference or hooks

**Server Endpoints:**
- Routes: Add handler functions to `server/routes.ts` after registerRoutes function
- Prefix all with /api (e.g., /api/users, /api/progress)
- Use storage.ts for persistence (interface-based calls)
- Type request/response with TypeScript

## Special Directories

**assets/:**
- Purpose: Media files (animations, images, avatars)
- Generated: No (manually added files)
- Committed: Yes (PNG, JPG, JSON)
- Path: `assets/` at root, referenced in code via require() with relative imports

**static-build/:**
- Purpose: Expo static build output for production web serving
- Generated: Yes (by `npm run expo:static:build`)
- Committed: No (in .gitignore)
- Path: Root-level `static-build/`

**.expo/:**
- Purpose: Expo CLI state and configuration
- Generated: Yes (by Expo CLI)
- Committed: No
- Path: `.expo/`

**.planning/codebase/:**
- Purpose: Architecture and codebase analysis documents
- Generated: Yes (by Claude analysis)
- Committed: Yes (markdown documentation)
- Path: `.planning/codebase/`

**server/templates/:**
- Purpose: HTML templates for serving to web clients
- Generated: No
- Committed: Yes
- Path: `server/templates/landing-page.html`
