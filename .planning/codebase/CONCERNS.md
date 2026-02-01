# Codebase Concerns

**Analysis Date:** 2026-01-31

## Tech Debt

**Extensive `any` type usage in TypeScript:**
- Issue: 18 instances of `any` or `unknown` types reducing type safety across client code
- Files: `client/types/index.ts` (lines 5, 55), `client/components/Card.tsx`, `client/components/SignCard.tsx`, `client/components/GrammarCard.tsx`, `client/components/SigningDemoPlayer.tsx`, `client/components/EmptyState.tsx`
- Impact: Defeats TypeScript's type checking, increases likelihood of runtime errors, reduces IDE autocomplete accuracy
- Fix approach: Replace `any` with proper types or use generic constraints. For example, theme parameter should be typed as specific theme interface rather than `any`

**Monolithic data file:**
- Issue: `client/data/scenarios.ts` contains 1,155 lines of hardcoded conversation data
- Files: `client/data/scenarios.ts`
- Impact: File exceeds maintainability threshold, difficult to test, no separation between data and logic, violates 500-line guideline
- Fix approach: Split into smaller modules (one per scenario or by conversation type), consider moving to database or API-driven approach

**Large screen components:**
- Issue: Multiple screen components exceed 250+ lines each
- Files: `client/screens/GrammarDetailScreen.tsx` (327 lines), `client/screens/ConversationScreen.tsx` (300 lines), `client/screens/ProfileScreen.tsx` (296 lines), `client/screens/SignDetailScreen.tsx` (261 lines)
- Impact: Hard to maintain, test, and understand; difficult to reuse logic
- Fix approach: Extract smaller presentational components, move business logic to hooks, consider custom hooks for screen-specific logic

**No test coverage:**
- Issue: Zero test files found in codebase despite having test infrastructure in place
- Files: No test files found
- Impact: Critical features have no automated validation, difficult to refactor with confidence
- Fix approach: Create test files mirroring structure (`tests/client/hooks/`, `tests/client/screens/`, etc.), implement tests for hooks and navigation

## Security Considerations

**Plain text password storage schema:**
- Risk: User passwords stored as plain text in PostgreSQL database, no hashing or encryption
- Files: `shared/schema.ts` (line 11)
- Current mitigation: None detected
- Recommendations: Implement password hashing immediately using bcrypt or argon2, add password validation requirements (min length, complexity), consider using established auth library (next-auth, supabase auth, etc.)

**Missing authentication implementation:**
- Risk: Database schema defines users table but no authentication routes or middleware exist in API
- Files: `shared/schema.ts`, `server/routes.ts` (empty route implementation), `server/storage.ts` (MemStorage with no persistence)
- Current mitigation: None - API has no login/signup endpoints
- Recommendations: Implement complete auth flow with hashed passwords, session management, and protected routes

**Permissive CORS configuration:**
- Risk: CORS allows any localhost origin on any port for development
- Files: `server/index.ts` (lines 32-35)
- Current mitigation: Only applies to localhost/127.0.0.1
- Recommendations: Production build must enforce strict origin whitelist, implement environment-specific CORS rules

**No environment variable validation:**
- Risk: Missing DATABASE_URL throws error but credentials may be exposed in logs
- Files: `drizzle.config.ts` (line 3-4)
- Current mitigation: Error thrown during build
- Recommendations: Validate and sanitize all env vars at startup, ensure sensitive values never logged, use secrets management (e.g., .env.local with .gitignore)

## Performance Bottlenecks

**Single in-memory storage with no persistence:**
- Problem: `MemStorage` class holds all user data in memory, lost on server restart
- Files: `server/storage.ts` (lines 13-36)
- Cause: Storage layer not connected to database despite Drizzle ORM being configured
- Improvement path: Implement proper database storage layer that persists to PostgreSQL, consider caching strategies for frequently accessed data

**Large query client with infinite stale time:**
- Problem: React Query configured with `staleTime: Infinity` and `retry: false`, never refetches data
- Files: `client/lib/query-client.ts` (line 72)
- Cause: Conservative caching strategy assumes data never changes
- Improvement path: Implement appropriate stale time based on data type (e.g., user progress every 5 minutes), add automatic refetch on app focus, implement optimistic updates

**No pagination in data loading:**
- Problem: All vocabulary, scenarios, and grammar data loaded upfront into state
- Files: `client/data/vocabulary.ts`, `client/data/scenarios.ts`, `client/data/grammar.ts`
- Cause: Hardcoded data files loaded entirely, no pagination or lazy loading
- Improvement path: Implement pagination or virtualization for large lists, lazy load data as needed, consider server-driven pagination when migrating to API

## Fragile Areas

**Error handling relies on console.error with silent failures:**
- Files: `client/hooks/useStorage.ts` (lines 43, 58, 107, 122, 144, 201), `client/components/ErrorFallback.tsx` (line 30)
- Why fragile: Errors caught and silently logged, no user feedback or error recovery strategy
- Safe modification: Add error state to hooks, display error messages to users, implement retry logic for storage failures
- Test coverage: No tests covering error scenarios

**React Query missing error boundaries for async operations:**
- Files: `client/App.tsx` (line 18), `client/lib/query-client.ts`
- Why fragile: ErrorBoundary only catches render errors, not async promise rejections from React Query mutations
- Safe modification: Add error callback to QueryClient config, handle mutation errors explicitly in components, test async error scenarios
- Test coverage: No mutation error tests found

**Unvalidated JSON parsing in storage hooks:**
- Files: `client/hooks/useStorage.ts` (lines 40, 104, 141, 172, 198)
- Why fragile: Direct `JSON.parse()` on AsyncStorage data without validation; corrupted data crashes app
- Safe modification: Use schema validation library (Zod, io-ts) before parsing, add fallback to defaults, handle parse errors gracefully
- Test coverage: No tests for corrupted storage data

**Type safety gap in route navigation:**
- Files: `client/screens/ConversationScreen.tsx` (lines 50-53)
- Why fragile: Finds scenario/conversation without null checks before using; crashes if scenario not found (though has fallback UI)
- Safe modification: Type conversation as `Conversation | null`, validate in component, move data lookup to custom hook with error handling
- Test coverage: No tests for missing data scenarios

## Missing Critical Features

**No API implementation:**
- Problem: Server routes stubbed but empty; all functionality client-side only
- Blocks: Cannot persist user progress across devices, authentication impossible, real-time features impossible
- Impact: App data is lost on uninstall, no user accounts or multi-device support

**No user authentication system:**
- Problem: Users table exists but no login/signup endpoints, no session management
- Blocks: Multi-user functionality, progress syncing, account security
- Impact: Single user per device, data loss on app uninstall

**No progress persistence to backend:**
- Problem: User progress, vocabulary, and grammar progress stored only in AsyncStorage
- Blocks: Cannot sync across devices, no cloud backup
- Impact: Complete data loss if device cleared or app uninstalled

**No validation of user input:**
- Problem: No Zod/validation on server routes, no sanitization of incoming data
- Blocks: Cannot safely accept user-generated content, vulnerable to invalid data
- Impact: Potential crashes from malformed data

## Test Coverage Gaps

**Storage hooks untested:**
- What's not tested: `useUserProgress()`, `useUserProfile()`, `useVocabulary()`, `useGrammarProgress()` hooks
- Files: `client/hooks/useStorage.ts` (entire file)
- Risk: Storage failures, corrupted data, async timing issues go unnoticed
- Priority: **High** - critical business logic for user progress

**Screen components untested:**
- What's not tested: All screen navigation, UI interaction, data binding
- Files: `client/screens/*.tsx` (all files)
- Risk: Broken navigation, missing data, UI crashes
- Priority: **High** - user-facing functionality

**Navigation flow untested:**
- What's not tested: Tab navigation, stack navigation, parameter passing between screens
- Files: `client/navigation/*.tsx` (all files)
- Risk: Broken navigation paths, lost app state
- Priority: **High** - core user experience

**Error boundaries untested:**
- What's not tested: Error handling in ErrorBoundary, ErrorFallback rendering, app restart on error
- Files: `client/components/ErrorBoundary.tsx`, `client/components/ErrorFallback.tsx`
- Risk: Broken error recovery, app stuck in error state
- Priority: **Medium** - affects reliability

**API integration untested:**
- What's not tested: Query client setup, API request/response handling, error handling
- Files: `client/lib/query-client.ts`
- Risk: Undetected API failures, misconfigured endpoints
- Priority: **High** - essential for backend integration

## Scaling Limits

**In-memory storage capacity:**
- Current capacity: Limited by available RAM, no database persistence
- Limit: Resets on server restart, cannot handle multiple concurrent users
- Scaling path: Implement PostgreSQL storage layer using Drizzle ORM already configured

**Client-side data loading:**
- Current capacity: All scenario data (1155 lines) loaded into memory on app start
- Limit: Will cause performance issues with app size growth
- Scaling path: Implement API-driven data loading with pagination, move data to server

**Single server instance:**
- Current capacity: App expects single backend server instance
- Limit: Cannot scale horizontally, single point of failure
- Scaling path: Implement stateless API servers, use load balancer, migrate session/auth to external service

## Dependencies at Risk

**No password hashing dependency:**
- Risk: `shared/schema.ts` shows plain text passwords; bcrypt/argon2 not in dependencies
- Impact: Passwords vulnerable if database breached
- Migration plan: Add bcrypt or argon2, implement hashing in authentication layer

**Missing validation library in production:**
- Risk: Zod is installed but not used for runtime validation of external data
- Impact: Invalid data from API or storage can crash app
- Migration plan: Use Zod schemas throughout (already in schema.ts), apply to API responses and storage

**Database not connected:**
- Risk: Drizzle ORM configured but `MemStorage` implementation ignores database
- Impact: All data lost on server restart
- Migration plan: Implement database storage layer, migrate from MemStorage to actual SQL queries

## Known Issues

**CORS localhost accepts any port:**
- Symptoms: Development debugging difficult to track since all localhost ports allowed
- Trigger: Any localhost request during development
- Impact: Harder to catch origin-related bugs before production
- Recommendation: Make CORS stricter in development when running specific port, log origin checks

**React Query retry disabled:**
- Symptoms: Single network hiccup causes query to fail permanently without retry
- Trigger: Any network error or server error
- Impact: Poor UX, users need to manually refresh to retry
- Recommendation: Enable retry with exponential backoff, implement user-friendly retry UI

**Large AsyncStorage operations not optimized:**
- Symptoms: Saving entire vocabulary/progress on every change
- Trigger: Any toggleFavorite, markAsLearned, updateProgress call
- Impact: Performance lag on slower devices
- Recommendation: Batch updates, implement debouncing, use targeted storage keys for partial updates
