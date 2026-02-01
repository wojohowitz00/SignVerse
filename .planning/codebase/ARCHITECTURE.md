# Architecture

**Analysis Date:** 2026-01-31

## Pattern Overview

**Overall:** Client-Server architecture with React Native Expo frontend and Express.js backend, using client-side state management for user progress and server-side storage infrastructure (currently stubbed with in-memory storage).

**Key Characteristics:**
- Separation of concerns: Client handles UI/UX and local state, Server handles data persistence and business logic
- Modular navigation system with layered screen hierarchy (Root → Tabs → Stacks)
- Local-first data strategy using AsyncStorage for user progress, supplemented by remote API calls
- Type-safe data flow using TypeScript, Zod validation, and Drizzle ORM
- Theme-based styling with dark/light mode support throughout

## Layers

**Client Layer (React Native/Expo):**
- Purpose: User interface, navigation, local state management, and user interactions
- Location: `client/`
- Contains: React components, screens, navigation stacks, hooks for state management
- Depends on: `@shared/schema` for type definitions, AsyncStorage for persistence, Express server for API calls
- Used by: End users interacting with mobile/web app

**Navigation Layer:**
- Purpose: Handle app routing and screen transitions across feature areas
- Location: `client/navigation/`
- Contains: Root navigator, tab navigator, and feature-specific stack navigators
- Depends on: @react-navigation libraries, screens
- Used by: App.tsx for initial bootstrap

**Screen/View Layer:**
- Purpose: Feature-specific UI containers that aggregate components and hooks
- Location: `client/screens/`
- Contains: PracticeScreen, VocabularyScreen, ProgressScreen, ProfileScreen, detail screens
- Depends on: Components, hooks (useStorage, useTheme), navigation
- Used by: Navigators to render feature content

**Component Layer:**
- Purpose: Reusable UI building blocks with animations and theme integration
- Location: `client/components/`
- Contains: SignCard, ScenarioCard, GrammarCard, ThemedText, ThemedView, SearchBar, CategoryFilter
- Depends on: Constants/theme, Expo icons, react-native-reanimated for animations
- Used by: Screens and other components

**State Management Layer:**
- Purpose: Manage local user state including progress, profile, vocabulary, grammar progress
- Location: `client/hooks/useStorage.ts`
- Contains: useUserProgress, useUserProfile, useVocabulary, useGrammarProgress
- Depends on: AsyncStorage for persistence, types
- Used by: Screens to read/update user state

**Data/Constants Layer:**
- Purpose: Provide static learning content and theme configuration
- Location: `client/data/` and `client/constants/`
- Contains: vocabularyData, grammarLessons, scenarios, theme colors, spacing, typography
- Depends on: Types, image assets
- Used by: Screens and components to populate UI

**Query Layer:**
- Purpose: API communication and request configuration
- Location: `client/lib/query-client.ts`
- Contains: QueryClient setup, apiRequest helper, getQueryFn, API URL resolution
- Depends on: TanStack React Query, fetch API
- Used by: Server for data fetching (currently unused in routes)

**Server Layer (Express):**
- Purpose: HTTP server, routing, request handling, API endpoints, CORS/security
- Location: `server/`
- Contains: Server setup, route registration, request middleware, error handling
- Depends on: Express, Node.js
- Used by: Client making API requests

**Routes Layer:**
- Purpose: Define API endpoints and business logic
- Location: `server/routes.ts`
- Contains: Route handlers (currently empty template)
- Depends on: Storage layer, Express Request/Response types
- Used by: Server to handle /api/* requests

**Storage Layer:**
- Purpose: Data persistence abstraction
- Location: `server/storage.ts`
- Contains: IStorage interface, MemStorage in-memory implementation with CRUD methods for users
- Depends on: Shared schema types
- Used by: Routes to persist/retrieve data

**Shared Layer:**
- Purpose: Type definitions and validation schemas shared between client and server
- Location: `shared/schema.ts`
- Contains: Drizzle table definitions (users), Zod validation schemas, TypeScript types
- Depends on: Drizzle ORM, Zod
- Used by: Both client and server for type safety

## Data Flow

**Learning Content Flow:**
1. Static learning data (scenarios, vocabulary, grammar) loaded from `client/data/` files
2. VocabularyScreen, PracticeScreen, GrammarScreen render content from in-memory data
3. User interactions (favorites, marks as learned, progress) trigger hook updates
4. Hooks persist state to AsyncStorage
5. On next app load, AsyncStorage data is merged with static data

**User Progress Flow:**
1. User completes practice activity in ConversationScreen or GrammarDetailScreen
2. Progress hook methods called (incrementSignsLearned, addPracticeTime, etc.)
3. Hooks update local state and persist to AsyncStorage via updateProgress
4. ProgressScreen reads from useUserProgress hook and renders weekly chart
5. No server synchronization currently implemented

**Profile Management Flow:**
1. User modifies avatar, name, notifications in ProfileScreen
2. useUserProfile hook triggered with updates
3. Changes persisted to AsyncStorage
4. ProfileScreen re-renders with new profile data

**Navigation Flow:**
1. RootStackNavigator provides Main tab navigator and detail screens
2. MainTabNavigator creates 4 bottom tabs: Practice, Vocabulary, Progress, Profile
3. Each tab contains its own stack navigator (PracticeStackNavigator, VocabularyStackNavigator, etc.)
4. Detail screens (ScenarioDetail, SignDetail, GrammarDetail, Conversation) nested in RootStack
5. Parameters passed via route params (scenarioId, signId, lessonId)

**State Management:**
- Local client state managed entirely through React hooks (useState) + AsyncStorage
- No global state management (Redux, Zustand) needed currently
- Each screen/hook manages its own domain (progress, profile, vocabulary)
- AsyncStorage provides persistence across app restarts
- No server-side state synchronization

## Key Abstractions

**UserProgress:**
- Purpose: Track learning metrics (signs learned, practice time, conversations, streak, weekly activity)
- Examples: `client/hooks/useStorage.ts` - useUserProgress hook
- Pattern: React hook with local state + AsyncStorage persistence, provides methods for specific updates

**UserProfile:**
- Purpose: Store user identity and preferences (display name, avatar, notifications)
- Examples: `client/hooks/useStorage.ts` - useUserProfile hook
- Pattern: React hook managing profile state with async persistence

**Scenario/Conversation:**
- Purpose: Structure realistic dialogue practice around social situations
- Examples: `client/data/scenarios.ts` contains scenario and conversation definitions
- Pattern: Static data objects with nested messages, type-safe via TypeScript interfaces

**Sign:**
- Purpose: Represent a vocabulary item with metadata (word, category, difficulty, learned status)
- Examples: `client/data/vocabulary.ts`, used in VocabularyScreen via useVocabulary hook
- Pattern: Type-safe interface with persistent state tracking (isFavorite, isLearned)

**GrammarLesson:**
- Purpose: Structure grammar instruction with text, examples, and practice content
- Examples: `client/data/grammar.ts` with lessons covering sentence structure, facial grammar, etc.
- Pattern: Static lesson objects with nested content blocks of different types

**Storage Interface:**
- Purpose: Abstract persistence mechanism for user data
- Examples: `server/storage.ts` - IStorage interface with MemStorage implementation
- Pattern: Interface-based, enabling swap to database implementation without changing routes

## Entry Points

**Client Entry:**
- Location: `client/index.js`
- Triggers: Expo app initialization
- Responsibilities: Calls registerRootComponent(App) to bootstrap React Native app

**App Root:**
- Location: `client/App.tsx`
- Triggers: Called from client/index.js
- Responsibilities: Sets up error boundary, query client provider, navigation container, keyboard/gesture handlers, safe area provider. Renders RootStackNavigator

**Server Entry:**
- Location: `server/index.ts`
- Triggers: `npm run server:dev` or `npm run server:prod`
- Responsibilities: Initializes Express app with CORS, body parsing, request logging, Expo manifest serving, static asset serving, error handling. Registers routes and starts HTTP server on port 5000

**First Screen:**
- Location: `client/screens/PracticeScreen.tsx`
- Triggers: After navigation setup (initialRouteName in MainTabNavigator)
- Responsibilities: Displays practice scenarios via ScenarioCard components, navigates to ScenarioDetailScreen on selection

## Error Handling

**Strategy:** Multi-layered error capture with ErrorBoundary for crashes and try-catch in async operations

**Patterns:**
- `client/components/ErrorBoundary.tsx`: React Error Boundary wrapping entire app, displays ErrorFallback UI on crash
- Try-catch in hooks: useStorage hooks catch AsyncStorage errors and log to console
- Try-catch in server middleware: Error handler middleware catches route errors, returns 500 JSON response
- Query client: Retry: false configured to fail fast on API errors

## Cross-Cutting Concerns

**Logging:**
- Client: Console.log for development, particularly in hooks on errors
- Server: Custom middleware logs API requests with method, path, status, duration, response body (truncated at 80 chars)
- No centralized logging service configured

**Validation:**
- Client: TypeScript type checking at compile time, no runtime validation
- Server: Zod schemas defined in `shared/schema.ts` for insertUserSchema, ready for route validation
- No validation middleware currently applied to routes

**Authentication:**
- Currently: No authentication implemented
- Infrastructure: insertUserSchema has username/password fields, MemStorage has getUserByUsername method
- Pattern: Ready for implementation via credentials in fetch requests and server validation

**Theme Management:**
- Centralized in `client/constants/theme.ts` with light/dark color palettes
- Applied via useTheme hook throughout components
- StyleSheet.create used for static styles with theme values injected
- Spacing, BorderRadius, Typography constants ensure consistency

**Navigation:**
- React Navigation provides structured routing with type-safe route params
- Deep linking infrastructure in place (manifests, asset serving)
- Safe area aware via useSafeAreaInsets hook on screens
