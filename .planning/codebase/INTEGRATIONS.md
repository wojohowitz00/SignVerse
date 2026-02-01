# External Integrations

**Analysis Date:** 2026-01-31

## APIs & External Services

**Not detected** - No third-party API integrations configured. Application architecture is self-contained with internal Express server handling all API needs.

## Data Storage

**Databases:**
- PostgreSQL - Primary database
  - Connection: `DATABASE_URL` environment variable
  - Client: pg 8.16.3 (native Node.js PostgreSQL driver)
  - ORM: drizzle-orm 0.39.3

**Database Schema Location:**
- `./shared/schema.ts` - Defines database tables using Drizzle

**Database Configuration:**
- File: `drizzle.config.ts`
- Migrations: Generated to `./migrations/` directory via drizzle-kit

**Database Tables:**
- `users` table: Stores user authentication data
  - `id` (varchar, primary key, default: gen_random_uuid())
  - `username` (text, not null, unique)
  - `password` (text, not null)

**Client Storage:**
- AsyncStorage via @react-native-async-storage/async-storage
  - Local persistent storage for mobile app data
  - Keys: @signspeak_progress, @signspeak_profile, @signspeak_vocabulary, @signspeak_grammar

**File Storage:**
- Local filesystem only - No external file storage service used
- Assets served from `./assets/` and `./static-build/` directories

**Caching:**
- React Query (@tanstack/react-query) - In-memory query caching on client
  - Default cache: staleTime Infinity, no automatic refetch
  - Configuration: `./client/lib/query-client.ts`

## Authentication & Identity

**Auth Provider:**
- Custom implementation (in-progress)
- Password-based user authentication via users table
- No third-party OAuth/SSO providers detected

**Auth Implementation:**
- Storage: `./server/storage.ts` - User credential management
- Schema: `./shared/schema.ts` - User table definition
- Current: In-memory storage during development (MemStorage class)

## Communication

**HTTP Communication:**
- Express server listening on port 5000 (configurable via PORT env var)
- Client: fetch API via `./client/lib/query-client.ts`
  - Base URL: `${EXPO_PUBLIC_DOMAIN}`
  - Credentials: Include cookies (credentials: 'include')
  - Content-Type: application/json

**CORS:**
- Configured in `./server/index.ts`
- Allowed origins:
  - Replit development domain (from REPLIT_DEV_DOMAIN)
  - Replit production domains (from REPLIT_DOMAINS)
  - Localhost on any port (for Expo web development)
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: Content-Type

**WebSocket:**
- ws 8.18.0 available but integration not detected

## Monitoring & Observability

**Error Tracking:**
- None detected - No error tracking service (Sentry, etc.)

**Logs:**
- Console logging only
- Request logging in `./server/index.ts`
  - All /api route requests logged with method, path, status, duration
  - JSON response captured for debugging

**Debugging:**
- Raw body capture available for request debugging via req.rawBody

## Manifest & Platform Configuration

**Expo Manifest:**
- Dynamic manifest serving based on platform header
- Manifests generated to `./static-build/{platform}/manifest.json`
- Platforms: iOS, Android, web

**Landing Page:**
- Dynamic template-based HTML serving
- Template: `./server/templates/landing-page.html`
- Placeholders: BASE_URL_PLACEHOLDER, EXPS_URL_PLACEHOLDER, APP_NAME_PLACEHOLDER

## CI/CD & Deployment

**Hosting:**
- Replit (primary development/deployment platform)
- CloudRun (from .replit deploymentTarget configuration)

**Build Process:**
```bash
npm run expo:static:build && npm run server:build
```
- Expo static build → static bundles
- Server bundled with esbuild to ./server_dist/

**Deployment Command:**
```bash
npm run server:prod
```
- Runs bundled server from ./server_dist/index.js

**Replit Configuration:**
- Port 5000 (Express server)
- Port 8081 (external port 80, web build)
- Port 8082 (external port 3000)
- Node.js 22 runtime
- Stack: EXPO

## Environment Configuration

**Required Environment Variables:**

| Variable | Purpose | Example |
|----------|---------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host/db |
| EXPO_PUBLIC_DOMAIN | Client API domain for fetch requests | localhost:5000 or example.com |
| PORT | Express server port | 5000 |
| NODE_ENV | Environment mode | development, production |
| REPLIT_DEV_DOMAIN | Replit dev domain (automatic) | [auto-set] |
| REPLIT_DOMAINS | Replit production domains (automatic) | [auto-set] |

**Secrets Location:**
- Configured via environment variables (typically from .env files or hosting platform)
- .env*.local files excluded from git per .gitignore

**Configuration Files:**
- `.env*.local` - Local environment overrides (not committed)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## API Routes Structure

**Framework:** Express 5.0.1

**Route File Location:** `./server/routes.ts`
- Current status: Routes placeholder (awaiting implementation)
- All routes should be prefixed with `/api`

**Base Request Handling:**
- `./client/lib/query-client.ts` exports:
  - `getApiUrl()` - Constructs API base URL from EXPO_PUBLIC_DOMAIN
  - `apiRequest()` - Generic fetch wrapper with error handling
  - `getQueryFn()` - React Query integration for data fetching

## Data Validation

**Server-side:**
- Zod schema validation (zod 3.24.2)
- Integration: drizzle-zod 0.7.0
- User schema: `./shared/schema.ts` with InsertUser validation

**Client-side:**
- Zod validation for runtime type safety
- Query response validation available via React Query

---

*Integration audit: 2026-01-31*
