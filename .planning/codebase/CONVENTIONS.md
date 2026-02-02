# Coding Conventions

**Analysis Date:** 2026-02-02

## Naming Patterns

**Files:**
- React/TypeScript components: PascalCase (e.g., `Button.tsx`, `ErrorBoundary.tsx`, `ASLVideoPlayer.tsx`)
- Utility/hook files: camelCase (e.g., `query-client.ts`, `useTheme.ts`, `useStorage.ts`)
- Constants files: camelCase (e.g., `theme.ts`, `avatars.ts`)
- Test files: Not yet in use, but follow pattern `*.test.ts` or `*.spec.ts`

**Functions:**
- Named exports for components: PascalCase (e.g., `export function Button()`, `export function Card()`)
- Hook functions: camelCase with `use` prefix (e.g., `useTheme()`, `useColorScheme()`, `useContent()`)
- Helper/utility functions: camelCase (e.g., `getApiUrl()`, `apiRequest()`, `throwIfResNotOk()`)
- Internal/private functions: camelCase with descriptive names (e.g., `handlePressIn()`, `getBackgroundColor()`, `setupCors()`)

**Variables:**
- React state and hooks: camelCase (e.g., `scale`, `isDark`, `colorScheme`)
- Component props: camelCase (e.g., `onPress`, `disabled`, `variant`, `elevation`)
- Constants: UPPER_SNAKE_CASE for environment-level constants, camelCase for module exports
- Type/interface names: PascalCase (e.g., `ButtonProps`, `CardProps`, `ErrorFallbackProps`)

**Types:**
- Interfaces: PascalCase (e.g., `CardProps`, `Scenario`, `Conversation`, `Sign`)
- Type aliases: PascalCase (e.g., `SigningMediaType`, `PartnerType`)
- Object keys in constants: camelCase or quoted strings (e.g., `Colors.light.tabIconDefault`, `Spacing["2xl"]`)

## Code Style

**Formatting:**
- Prettier 3.6.2 is configured for auto-formatting
- Configuration: Uses default Prettier settings from eslint-plugin-prettier
- Format command: `prettier --write "**/*.{js,ts,tsx,css,json}"`
- Check command: `prettier --check "**/*.{js,ts,tsx,css,json}"`

**Linting:**
- ESLint 9.25.0 with Expo configuration
- Config file: `eslint.config.js` (flat config format)
- Base config: `eslint-config-expo` (~10.0.0)
- Prettier integration: `eslint-plugin-prettier` enabled for ESLint enforcement
- Lint command: `npx expo lint`
- Fix command: `npx expo lint --fix`

## Import Organization

**Order:**
1. React and React Native core imports
2. Third-party libraries (e.g., `react-navigation`, `react-native-reanimated`, `@tanstack/react-query`)
3. Expo modules
4. Relative imports from `@/` path aliases
5. Local relative imports

**Example pattern from codebase:**
```typescript
import React from "react";
import { StyleSheet, Pressable, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
```

**Path Aliases:**
- `@/*` → `./client/*` (client-side code and components)
- `@shared/*` → `./shared/*` (shared types and utilities)

## Error Handling

**Patterns:**
- Try-catch blocks for async operations and file I/O
- Error boundaries for React component errors using `ErrorBoundary` class component
- Error fallback UI with `ErrorFallback` component showing error details in development mode
- Console logging for error context: `console.error("message:", error)`
- Graceful degradation: Return null or default values for failed operations when appropriate

**Example from codebase (`server/index.ts`):**
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

**Example from client (`client/components/ErrorFallback.tsx`):**
```typescript
try {
  await reloadAppAsync();
} catch (restartError) {
  console.error("Failed to restart app:", restartError);
  resetError();
}
```

## Logging

**Framework:** Native `console` object

**Patterns:**
- Development: Use `__DEV__` constant for dev-only logging and UI
- Server logging: `console.log()` for general output, `console.error()` for errors
- Request logging in middleware: Custom middleware tracks method, path, status, duration, and response body
- Error logging: Always include context and the full error object

**Example from server (`server/index.ts`):**
```typescript
const log = console.log;  // Alias at top level

// Middleware logging
res.on("finish", () => {
  if (!path.startsWith("/api")) return;

  const duration = Date.now() - start;
  let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
  if (capturedJsonResponse) {
    logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
  }

  if (logLine.length > 80) {
    logLine = logLine.slice(0, 79) + "…";
  }

  log(logLine);
});
```

## Comments

**When to Comment:**
- Complex logic that is non-obvious
- Workarounds or deviations from standard patterns
- API contracts and expected behavior (via JSDoc)
- Design decisions that might not be immediately clear

**JSDoc/TSDoc:**
- Use JSDoc style with `/**` blocks for functions
- Include param types and return descriptions
- Example from codebase (`client/lib/query-client.ts`):

```typescript
/**
 * Gets the base URL for the Express API server (e.g., "http://localhost:3000")
 * @returns {string} The API base URL
 */
export function getApiUrl(): string {
  let host = process.env.EXPO_PUBLIC_DOMAIN;
  if (!host) {
    throw new Error("EXPO_PUBLIC_DOMAIN is not set");
  }
  let url = new URL(`https://${host}`);
  return url.href;
}
```

## Function Design

**Size:** Keep functions focused and under 50 lines where possible (exception for component render methods)

**Parameters:**
- Use destructuring for object parameters with multiple properties
- Define interfaces for prop objects to enable type checking
- Example from `Button.tsx`:

```typescript
interface ButtonProps {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  onPress,
  children,
  style,
  disabled = false,
  variant = "primary",
  size = "md",
}: ButtonProps) {
  // ...
}
```

**Return Values:**
- Components return JSX
- Hooks return values or arrays (for state hooks)
- Utility functions type their return values explicitly
- Query functions return JSON or typed objects
- Async functions return Promises with typed results

**Handling Conditional Rendering:**
- Use ternary operators for simple conditions: `condition ? <Component /> : null`
- Use null for conditional rendering instead of `false` or empty strings
- Pattern: `{condition ? <Content /> : null}`

## Module Design

**Exports:**
- Named exports for components, hooks, and utilities
- No default exports to maintain consistency and clarity in imports
- Example: `export function Button() {}` rather than `export default Button`

**Barrel Files:**
- Used minimally; most imports are direct from source files
- Example: `client/types/index.ts` exports all type definitions from the module

**Shared Code:**
- Shared utilities and types in `shared/` directory
- Type definitions in dedicated `types/` directories
- Constants in dedicated `constants/` directories (e.g., `constants/theme.ts`)
- Hooks in dedicated `hooks/` directory with naming pattern `useXxx.ts`

## Component Patterns

**Functional Components:**
- All components are functional components with hooks
- Props are destructured in function parameters
- Styles are created with `StyleSheet.create()` at bottom of file

**Reanimated Animations:**
- Use `react-native-reanimated` for animations
- Pattern: Create `useSharedValue` for state, `useAnimatedStyle` for styled transformations
- Spring animations use consistent config object:

```typescript
const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};
```

**Theme Integration:**
- Use `useTheme()` hook to access theme colors and values
- Import design constants from `constants/theme.ts`
- Pattern: `const { theme } = useTheme()`

## TypeScript

**Strict Mode:** Enabled (`"strict": true` in tsconfig.json)

**Type Annotations:**
- Always annotate function parameters and return types
- Always define interface/type for component props
- Use `any` sparingly; use `unknown` instead when type is truly unknown
- Example of anti-pattern found: `getBackgroundColorForElevation(elevation: number, theme: any)` should type `theme` properly

**Module Resolution:**
- Uses TypeScript path aliases for cleaner imports
- Module interop enabled for CommonJS compatibility

---

*Convention analysis: 2026-02-02*
