# Architecture

**Analysis Date:** 2026-02-02

## Pattern Overview

**Overall:** Full-stack mobile + web application with client-server separation and shared schema layer

**Key Characteristics:**
- React Native frontend (Expo) for iOS, Android, and web
- Express.js backend with TypeScript
- Centralized type definitions and database schema in shared layer
- Content-first approach with static data sources
- Offline-first capability with local caching

## Layers

**Client (React Native):**
- Purpose: Cross-platform learning application UI, video playback, progress tracking
- Location: `/ASL-Immersion-Companion/client`
- Contains: Screen components, navigation, UI components, hooks, data files
- Depends on: Expo, React Navigation, TanStack Query, AsyncStorage, Drizzle ORM
- Used by: User interactions, display logic

**Server (Express):**
- Purpose: API endpoint registration, static file serving, Expo manifest routing, request logging
- Location: `/ASL-Immersion-Companion/server`
- Contains: HTTP server setup, middleware, route registration, storage layer
- Depends on: Express, Node.js HTTP module
- Used by: Client for API calls, Expo for manifest retrieval

**Shared Layer:**
- Purpose: Type definitions and database schema shared between client and server
- Location: `/ASL-Immersion-Companion/shared`
- Contains: Drizzle ORM schema, Zod validation schemas
- Depends on: Drizzle ORM, Zod
- Used by: Both server and client for type safety

**Data Layer:**
- Purpose: Static content: vocabulary, grammar, scenarios
- Location: `/ASL-Immersion-Companion/client/data`
- Contains: Sign definitions, grammar lessons, conversation scenarios with metadata
- Depends on: TypeScript types
- Used by: Screens and components for content rendering

## Data Flow

**Application Bootstrap:**
1. `client/App.tsx` initializes providers (Error Boundary, QueryClient, Navigation, Safe Area)
2. `RootStackNavigator` sets up tab-based navigation structure
3. `MainTabNavigator` creates four main tabs (Practice, Vocabulary, Progress, Profile)
4. Each tab has dedicated stack navigator for sub-screens

**Content Display Flow:**
1. Screen component loads (e.g., `PracticeScreen`)
2. Retrieves static data from `client/data/` (scenarios, vocabulary, grammar)
3. Uses `useStorage` hook to load and persist user progress to AsyncStorage
4. Uses `useContent` hook to manage offline video caching via ContentManager
5. Renders themed components with user theme preference

**User Progress Tracking:**
1. `useUserProgress()` hook manages progress state from AsyncStorage (`@signspeak_progress`)
2. `useStorage()` hook provides `updateProgress()` to persist changes
3. Progress includes: signs learned, practice minutes, conversation completions, streak, achievements
4. Weekly practice tracked as array of daily values

**Server Request Flow:**
1. `server/index.ts` initializes Express with middleware stack
2. CORS middleware allows Expo dev domain and localhost origins
3. Request logging middleware captures all `/api` requests
4. Static file serving for Expo manifests and assets
5. Routes registered via `registerRoutes()` (currently empty)

**State Management:**
- Client state: React hooks (useState, useCallback, useEffect)
- Persistent storage: AsyncStorage for user data (`@signspeak_progress`, `@signspeak_profile`, etc.)
- Query state: TanStack Query with custom queryClient configured for API calls
- Local caching: ContentManager caches ASL videos/animations to device filesystem

## Key Abstractions

**Component Hierarchy:**
- Purpose: Reusable UI building blocks with theming
- Examples: `ThemedText`, `ThemedView`, `Card`, `SignCard`, `ScenarioCard`, `Button`
- Pattern: Theme-aware styling via `useTheme()` hook, StyleSheet for optimization

**ContentManager:**
- Purpose: Manages offline video/animation content with caching and versioning
- Location: `client/lib/content-manager.ts`
- Pattern: Singleton service managing file system storage, progress tracking, manifest management
- Used by: `useContent` hook and screens for accessing cached/remote ASL videos

**Navigation Architecture:**
- Purpose: Manages deep linking and screen stack management
- Examples: `RootStackNavigator`, `MainTabNavigator`, feature-specific stack navigators
- Pattern: Type-safe navigation params via TypeScript generics (`RootStackParamList`, `MainTabParamList`)

**Hooks for Business Logic:**
- Purpose: Encapsulate feature-specific logic as reusable hooks
- Examples: `useStorage`, `useContent`, `useTheme`, `useColorScheme`, `useScreenOptions`
- Pattern: Stateful hooks that manage side effects and expose state + mutation functions

**API Query Client:**
- Purpose: Centralized TanStack Query configuration
- Location: `client/lib/query-client.ts`
- Pattern: Custom query function factory with environment-aware domain, retry/staleness policies

## Entry Points

**Client Entry:**
- Location: `client/App.tsx`
- Triggers: Expo app startup
- Responsibilities: Initialize error boundary, query client, navigation container, safe area, keyboard handling

**Server Entry:**
- Location: `server/index.ts`
- Triggers: Node.js process startup
- Responsibilities: Setup CORS, body parsing, request logging, static file serving, Expo manifest routing, listen on port 5000

**Navigation Entry:**
- Location: `client/navigation/RootStackNavigator.tsx`
- Triggers: After App component mounts
- Responsibilities: Define root stack with Main tab navigator and modal screens

**Screen Entry Points:**
- Practice: `client/screens/PracticeScreen.tsx` - Lists scenarios
- Vocabulary: `client/screens/VocabularyScreen.tsx` - Browses signs
- Progress: `client/screens/ProgressScreen.tsx` - Shows user stats
- Profile: `client/screens/ProfileScreen.tsx` - User settings
- Details: ScenarioDetailScreen, ConversationScreen, SignDetailScreen, GrammarDetailScreen

## Error Handling

**Strategy:** Boundary-based error catching with fallback UI

**Patterns:**
- `ErrorBoundary` component wraps entire app (`client/components/ErrorBoundary.tsx`)
- `ErrorFallback` displays error details with recovery options
- Server error handler middleware catches Express errors and returns JSON responses
- API calls use custom `getQueryFn` that throws on non-200 responses
- `tryIfResNotOk()` helper validates fetch response status

## Cross-Cutting Concerns

**Logging:**
- Server: Console logging with request method, path, status, duration, response payload
- Client: Console errors from hooks and components (useContent, useStorage, ErrorBoundary)

**Validation:**
- Server: Drizzle ORM schema with type inference
- Client: Zod schemas via `drizzle-zod` for type safety
- Form/API: Zod validation on InsertUser schema

**Authentication:**
- Currently basic user schema with username/password in database
- Storage: MemStorage (in-memory, non-persistent)
- Pattern: Prepared for real auth but not fully implemented in API routes

**Theming:**
- Client: `useTheme()` hook provides color palette and typography
- Files: `client/constants/theme.ts` defines theme object structure
- Usage: All components access via hook and apply via StyleSheet

**Navigation Theming:**
- Client: `useScreenOptions()` hook provides navigation header styling
- Pattern: Centralized screen options with consistent header appearance
