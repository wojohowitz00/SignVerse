# Coding Conventions

**Analysis Date:** 2026-01-31

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `ThemedText.tsx`, `VocabularyScreen.tsx`, `ErrorBoundary.tsx`)
- Utilities and hooks: camelCase (e.g., `useTheme.ts`, `useStorage.ts`, `query-client.ts`)
- Data/config files: camelCase (e.g., `theme.ts`, `avatars.ts`, `vocabulary.ts`)
- Server files: camelCase (e.g., `routes.ts`, `index.ts`, `storage.ts`)

**Functions:**
- React components: PascalCase function names (e.g., `VocabularyScreen`, `ProfileScreen`, `Card`)
- Hooks: camelCase with `use` prefix (e.g., `useTheme()`, `useStorage()`, `useVocabulary()`)
- Utility functions: camelCase (e.g., `getApiUrl()`, `apiRequest()`, `getBackgroundColorForElevation()`)
- Event handlers: camelCase with action prefix (e.g., `handleSignPress()`, `handleNameChange()`, `handleFavoritePress()`)
- Setup functions: camelCase with `setup` prefix (e.g., `setupCors()`, `setupBodyParsing()`, `setupErrorHandler()`)

**Variables:**
- Constants (non-object): UPPER_SNAKE_CASE (e.g., `STORAGE_KEYS`)
- Component props interfaces: PascalCase with `Props` suffix (e.g., `CardProps`, `ThemedTextProps`, `ErrorBoundaryProps`)
- Regular variables: camelCase (e.g., `searchQuery`, `selectedCategory`, `displayName`)
- State variables: camelCase (e.g., `vocabulary`, `progress`, `profile`)
- Shared values (Reanimated): camelCase (e.g., `scale`, `rotation`)

**Types:**
- Interfaces: PascalCase (e.g., `Scenario`, `Conversation`, `Sign`, `UserProgress`)
- Type aliases: PascalCase (e.g., `PartnerType`, `SigningMediaType`)
- Generic types: PascalCase (e.g., `RootStackParamList`, `NavigationProp`)

## Code Style

**Formatting:**
- Tool: Prettier v3.6.2
- Config: ESLint-integrated (no separate .prettierrc file)
- Line length: Default prettier settings (typically 80 chars but enforced via linting)
- Quotes: Double quotes for strings
- Semicolons: Always present
- Trailing commas: Included in multi-line structures

**Linting:**
- Tool: ESLint v9.25.0 with expo config
- Config file: `eslint.config.js` (flat config format)
- Plugins: eslint-plugin-prettier, eslint-config-expo
- Run commands:
  ```bash
  npm run lint              # Check linting
  npm run lint:fix          # Auto-fix linting issues
  npm run check:format      # Check formatting with prettier
  npm run format            # Format code with prettier
  ```

**TypeScript:**
- Strict mode enabled in `tsconfig.json`
- Target: ES2020 (via expo/tsconfig.base.json)
- Module resolution: ES modules
- Path aliases configured via babel and tsconfig

## Import Organization

**Order:**
1. External libraries (React, React Native, navigation, UI libraries)
2. Utility/config imports (from `@/lib`, `@/constants`)
3. Hook imports (from `@/hooks`)
4. Component imports (from `@/components`)
5. Type/data imports (from `@/types`, `@/data`, `@/navigation`)

**Example from `client/screens/VocabularyScreen.tsx`:**
```typescript
// React and React Native
import React, { useState, useEffect, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";

// Navigation
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Components
import { SignCard } from "@/components/SignCard";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { EmptyState } from "@/components/EmptyState";

// Hooks
import { useTheme } from "@/hooks/useTheme";
import { useVocabulary } from "@/hooks/useStorage";

// Constants and data
import { Spacing } from "@/constants/theme";
import { vocabularyData, categories } from "@/data/vocabulary";

// Types and navigation
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Sign } from "@/types";
```

**Path Aliases:**
- `@/*` → `./client/*` - Client-side code
- `@shared/*` → `./shared/*` - Shared code (types, schemas)
- Configured in `tsconfig.json`, `babel.config.js`, and eslint

## Error Handling

**Patterns:**
- Try-catch blocks for async operations that may fail (`loadProgress()`, `updateProfile()`, `apiRequest()`)
- Error logging to console: `console.error("Description:", error)`
- Silent fallback approach: Errors logged but operation continues gracefully (e.g., in `useStorage.ts` hooks)
- Server-side error handler middleware in `server/index.ts` with status code extraction and JSON response

**Example from `client/hooks/useStorage.ts`:**
```typescript
const loadProgress = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (data) {
      setProgress(JSON.parse(data));
    }
  } catch (error) {
    console.error("Error loading progress:", error);
  } finally {
    setIsLoading(false);
  }
};
```

**Server-side example from `server/index.ts`:**
```typescript
function setupErrorHandler(app: express.Application) {
  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    const error = err as {
      status?: number;
      statusCode?: number;
      message?: string;
    };

    const status = error.status || error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });
}
```

## Logging

**Framework:** Native `console` object

**Patterns:**
- Use `console.log()` for informational messages (server startup, routing info)
- Use `console.error()` for errors and exceptions
- Server-side: Log request/response info with duration and status code in `setupRequestLogging()`
- Client-side: Log errors in catch blocks with context

**Example from `server/index.ts`:**
```typescript
const log = console.log;  // Assign to variable for consistency

log(`express server serving on port ${port}`);
log(logLine);  // "GET /api/users 200 in 45ms :: {...}"
console.error("Internal Server Error:", err);
```

## Comments

**When to Comment:**
- Explain non-obvious logic (e.g., business rules, complex conditionals)
- Document component or function purpose if not evident from name
- Explain why something is done a certain way (not just what it does)
- Document special cases or workarounds

**JSDoc/TSDoc:**
- Used for function documentation where clarity is needed
- Example from `client/lib/query-client.ts`:
```typescript
/**
 * Gets the base URL for the Express API server (e.g., "http://localhost:3000")
 * @returns {string} The API base URL
 */
export function getApiUrl(): string {
  // implementation
}
```

- Class-level documentation for error boundaries:
```typescript
/**
 * This is a special case for using class components. Error boundaries must be class components
 * because React only provides error boundary functionality through lifecycle methods
 * (componentDidCatch and getDerivedStateFromError) which are not available in functional components.
 * https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
```

## Function Design

**Size:** Prefer small, focused functions (50-100 lines typical for components and hooks)
- Components like `VocabularyScreen` and `ProfileScreen` stay under 100 lines
- Hooks like `useStorage.ts` break different concerns into separate hook functions
- Utility functions like `getBackgroundColorForElevation()` are 5-10 lines

**Parameters:**
- Use typed parameters (TypeScript strict mode enforced)
- For complex objects, use destructuring and type interfaces
- Example from `client/screens/index.ts`:
```typescript
export function serveLandingPage({
  req,
  res,
  landingPageTemplate,
  appName,
}: {
  req: Request;
  res: Response;
  landingPageTemplate: string;
  appName: string;
}) {
  // implementation
}
```

**Return Values:**
- Async functions return Promises (e.g., `Promise<Response>`, `Promise<void>`)
- Hooks return objects with named properties (not destructuring)
- Example from `useStorage.ts`:
```typescript
return {
  vocabulary,
  isLoading,
  toggleFavorite,
  markAsLearned,
  initializeVocabulary,
};
```

**Callbacks:**
- Use `useCallback` for event handlers and functions passed to other components
- Wrap with dependency array
- Example from `useStorage.ts`:
```typescript
const updateProgress = useCallback(async (updates: Partial<UserProgress>) => {
  try {
    // implementation
  } catch (error) {
    console.error("Error saving progress:", error);
  }
}, [progress]);  // Dependency array
```

## Module Design

**Exports:**
- Named exports preferred for utilities, types, and components
- Default exports for screen components
- Example from `client/screens/VocabularyScreen.tsx`:
```typescript
export default function VocabularyScreen() {
  // implementation
}
```

**Barrel Files:**
- Used in `client/types/index.ts` to re-export all types
- Not extensively used elsewhere; most imports are direct
- Example:
```typescript
// client/types/index.ts re-exports from same directory
export interface Scenario { /* ... */ }
export type PartnerType = /* ... */;
```

## Async Patterns

**Async/await:** Preferred over promise chains
- Used in hooks for AsyncStorage operations
- Used in server middleware for request handling

**ReactQuery:** Used for server state management with TanStack React Query v5
- Query function defined in `client/lib/query-client.ts`
- Default options configured for credentials, refetch, and retry behavior

## Component Patterns

**Functional components:** All components are functional (no class components except ErrorBoundary)
- Use hooks for state and side effects
- Example: `Card`, `ThemedText`, `VocabularyScreen`, `ProfileScreen`

**Props interfaces:** All components define TypeScript interfaces for props
- Example from `Card.tsx`:
```typescript
interface CardProps {
  elevation?: number;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}
```

**Animated components:** Use `react-native-reanimated` for animations
- Example from `Card.tsx`:
```typescript
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
// Use useSharedValue, useAnimatedStyle, withSpring
```

## Configuration and Constants

**Theme and styling:** Centralized in `client/constants/theme.ts`
- Colors object with light/dark modes
- Spacing scale (xs-5xl)
- BorderRadius scale
- Typography styles
- Font definitions
- Shadows definitions

**Storage keys:** Centralized in `client/hooks/useStorage.ts`
```typescript
const STORAGE_KEYS = {
  USER_PROGRESS: "@signspeak_progress",
  USER_PROFILE: "@signspeak_profile",
  VOCABULARY: "@signspeak_vocabulary",
  GRAMMAR_PROGRESS: "@signspeak_grammar",
};
```

---

*Convention analysis: 2026-01-31*
