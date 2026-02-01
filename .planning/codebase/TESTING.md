# Testing Patterns

**Analysis Date:** 2026-01-31

## Test Framework

**Status:** No testing framework currently configured

**Runner:** Not set up
- Jest not installed
- Vitest not installed
- No test configuration files present (no `jest.config.js`, `vitest.config.ts`, etc.)

**Assertion Library:** Not set up

**Current Test Coverage:** 0%
- No test files found in codebase
- No `__tests__` or `tests` directories
- No `.test.ts`, `.spec.ts`, `.test.tsx`, or `.spec.tsx` files

## Recommended Testing Setup

While no testing framework is currently in place, the following recommendations apply for future implementation:

### Framework Choice

**Recommended:** Jest or Vitest for React Native/Expo projects
- Jest is the most common choice for React Native projects
- Vitest offers faster feedback and better ESM support
- Both support TypeScript and React Native

### Suggested Run Commands

Once testing is configured, these commands should be added to `package.json`:
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report
```

### TypeScript Configuration for Testing

Current `tsconfig.json` excludes test files:
```json
{
  "exclude": ["node_modules", "build", "dist", "**/*.test.ts"]
}
```

This should be updated when tests are added to include test files in type checking.

## Test File Organization

**Current Structure:** Tests not yet organized

**Recommended Structure:**
```
client/
├── screens/
│   ├── VocabularyScreen.tsx
│   └── VocabularyScreen.test.tsx
├── components/
│   ├── Card.tsx
│   └── Card.test.tsx
├── hooks/
│   ├── useStorage.ts
│   └── useStorage.test.ts
└── lib/
    ├── query-client.ts
    └── query-client.test.ts

server/
├── routes.ts
├── routes.test.ts
├── storage.ts
└── storage.test.ts
```

**Naming Convention:**
- Co-located: `ComponentName.test.tsx` or `functionName.test.ts`
- Adjacent to source file for easier navigation

## Code Patterns Ready for Testing

The codebase has several patterns that lend themselves well to testing:

### 1. Utility Functions (Good Candidates)

**Location:** `client/lib/query-client.ts`

Functions to test:
```typescript
export function getApiUrl(): string {
  // Throws if EXPO_PUBLIC_DOMAIN not set
}

async function throwIfResNotOk(res: Response) {
  // Throws on non-ok response
}

export async function apiRequest(
  method: string,
  route: string,
  data?: unknown,
): Promise<Response> {
  // Makes API requests with proper headers and credentials
}

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> {
  // Handles different 401 behaviors
}
```

**Testing approach:**
- Unit tests with mocked `fetch`
- Test successful responses
- Test error responses
- Test 401 handling for both "returnNull" and "throw" behaviors
- Test environment variable validation

### 2. Custom Hooks (Good Candidates)

**Location:** `client/hooks/useStorage.ts`

Hooks to test:
```typescript
export function useUserProgress() {
  // Load, update, increment signs learned
  // increment conversations, add practice time
}

export function useUserProfile() {
  // Load, update user profile
}

export function useVocabulary() {
  // Load, toggle favorite, mark as learned, initialize
}

export function useGrammarProgress() {
  // Load and update lesson progress
}
```

**Testing approach:**
- Mock AsyncStorage
- Test initial state
- Test loading data from storage
- Test updates to storage
- Test error handling (silent failures)
- Test dependency arrays for useCallback

**Example test structure (not yet implemented):**
```typescript
// useStorage.test.ts (hypothetical)
import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserProgress } from './useStorage';

jest.mock('@react-native-async-storage/async-storage');

describe('useUserProgress', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.setItem.mockResolvedValue(undefined);
  });

  test('loads progress from storage', async () => {
    const { result } = renderHook(() => useUserProgress());

    await act(async () => {
      // Wait for useEffect
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      '@signspeak_progress'
    );
  });

  test('initializes with default progress when storage is empty', async () => {
    const { result } = renderHook(() => useUserProgress());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.progress.signsLearned).toBe(0);
    expect(result.current.progress.totalSigns).toBe(50);
  });

  test('increments signs learned', async () => {
    const { result } = renderHook(() => useUserProgress());

    await act(async () => {
      await result.current.incrementSignsLearned();
    });

    expect(result.current.progress.signsLearned).toBe(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@signspeak_progress',
      expect.stringContaining('signsLearned')
    );
  });

  test('handles storage errors gracefully', async () => {
    AsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

    const { result } = renderHook(() => useUserProgress());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Should use default progress on error
    expect(result.current.progress.signsLearned).toBe(0);
  });
});
```

### 3. Theme/Configuration (Good Candidates)

**Location:** `client/constants/theme.ts`

Content to test:
- Color values exist for both light and dark modes
- Spacing scale is consistent
- Typography values produce readable text
- Border radius values are reasonable

### 4. React Components (Medium Complexity)

**Location:** `client/components/`

Components suitable for testing:
```typescript
// client/components/Card.tsx
export function Card({ elevation, title, description, children, onPress, style }: CardProps)

// client/components/ThemedText.tsx
export function ThemedText({ style, lightColor, darkColor, type, ...rest }: ThemedTextProps)

// client/components/ErrorBoundary.tsx
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState>
```

**Testing approach:**
- Snapshot tests for rendering
- Prop variation tests (different elevations, types, colors)
- Interaction tests (onPress callbacks)
- Error boundary tests (componentDidCatch behavior)

### 5. Screen Components (Higher Complexity)

**Location:** `client/screens/`

Screens like `VocabularyScreen.tsx`, `ProfileScreen.tsx` would need:
- Mocked navigation
- Mocked hooks (useTheme, useStorage)
- Mocked data
- Integration tests for filtering/searching logic

## Server-Side Testing Opportunities

**Location:** `server/index.ts`, `server/routes.ts`

**Patterns to test:**
- Middleware functions (CORS, body parsing, error handling)
- Request logging
- Error handler status code extraction
- Manifest serving logic
- Landing page HTML generation

**Example server test structure (not yet implemented):**
```typescript
// server/index.test.ts (hypothetical)
import request from 'supertest';
import express from 'express';
import { setupCors } from './index';

describe('CORS middleware', () => {
  test('allows requests from allowed origins', async () => {
    const app = express();
    setupCors(app);

    const response = await request(app)
      .get('/test')
      .set('origin', 'https://example.com');

    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });

  test('allows localhost origins for development', async () => {
    const app = express();
    setupCors(app);

    const response = await request(app)
      .get('/test')
      .set('origin', 'http://localhost:3000');

    expect(response.headers['access-control-allow-origin']).toBe(
      'http://localhost:3000'
    );
  });

  test('rejects unallowed origins', async () => {
    const app = express();
    setupCors(app);

    const response = await request(app)
      .get('/test')
      .set('origin', 'https://malicious.com');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
});
```

## Mocking Strategy

**What to Mock:**
- AsyncStorage (for local storage operations in hooks)
- React Navigation hooks (for screen component tests)
- Theme context/hooks (useTheme)
- fetch API (for API request tests)
- Date/time functions (if testing time-dependent logic)

**What NOT to Mock:**
- React itself
- React Native core components (View, Text, StyleSheet)
- Component composition (render sub-components as-is)
- Constants and configuration files

## Fixtures and Test Data

**Current Data Patterns:**

Data files already exist:
- `client/data/vocabulary.ts` - Vocabulary data
- Constants in `client/constants/theme.ts`
- Type definitions in `client/types/index.ts`

**Testing recommendation:**
Create a `client/__fixtures__` directory for test data:
```
client/
└── __fixtures__/
    ├── vocabulary.ts
    ├── users.ts
    └── progress.ts
```

## Coverage Goals

**Recommended targets:**
- Utility functions: 90%+ coverage (critical for correctness)
- Hooks: 80%+ coverage (state management is core)
- Components: 70%+ coverage (visual correctness less critical than logic)
- Server middleware: 80%+ coverage (critical for reliability)

**Priority for implementation:**
1. Utility functions (quick wins, high value)
2. Custom hooks (core to app functionality)
3. Server middleware (error handling, CORS)
4. Component logic (filtering, searching, state changes)
5. Visual components (last priority, less critical)

## Type Safety in Tests

**Current setup advantage:**
- TypeScript strict mode is enabled
- All components have typed props
- All hooks return typed values

**Testing implications:**
- Mocks must maintain type safety
- Test utilities should be typed
- Use `as const` for test data to maintain types

---

*Testing analysis: 2026-01-31*

**NOTE:** This codebase currently has no testing framework configured. These patterns document how testing should be structured when implemented. Priority should be given to setting up a test framework (Jest or Vitest) and adding tests for utility functions and hooks first, as they provide the highest value for the effort required.
