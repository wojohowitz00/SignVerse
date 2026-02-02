# External Integrations

**Analysis Date:** 2026-02-02

## APIs & External Services

**Language Model Services:**
- OpenAI (GPT-4o) - Primary LLM for English-to-ASL gloss translation
  - Integration: `cloud-pipeline/src/asl_video_generator/gloss_translator.py`
  - SDK/Client: `openai>=1.0` package
  - Auth: `OPENAI_API_KEY` environment variable
  - Usage: GlossTranslator class uses `client.chat.completions.create()` with JSON response format

- Google Gemini - Alternative LLM provider (gemini-1.5-flash)
  - Integration: `cloud-pipeline/src/asl_video_generator/gloss_translator.py`
  - SDK/Client: `google-generativeai>=0.5.0` package
  - Auth: `GEMINI_API_KEY` environment variable
  - Usage: Called via `genai.GenerativeModel()` with JSON response format

- Ollama - Local/offline LLM support (llama3.2)
  - Integration: `cloud-pipeline/src/asl_video_generator/gloss_translator.py`
  - SDK/Client: `ollama>=0.2.0` package
  - Auth: None (local)
  - Usage: `ollama.Client().chat()` for local inference

**Video Generation & ML Models:**
- Hugging Face Model Hub
  - Integration: Via Diffusers library
  - Purpose: Stable Diffusion models for avatar video rendering
  - Package: `diffusers>=0.27.0`, `transformers>=4.40.0`
  - Details: Models cached in `~/.cache/asl-video/models`

- MediaPipe - Pose and hand detection
  - Integration: `cloud-pipeline/src/asl_video_generator/` pipeline
  - SDK/Client: `mediapipe>=0.10.11`
  - Purpose: Extract 3D pose keypoints from video/images
  - Auth: None (offline)

- ControlNet (via ControlNet-Aux)
  - Integration: Pose conditioning for diffusion
  - SDK/Client: `controlnet-aux>=0.0.8`
  - Purpose: Control avatar motion with pose sequences

## Data Storage

**Databases:**
- PostgreSQL - Primary database (configured via Drizzle ORM)
  - Client: `pg>=8.16.3` (Node PostgreSQL adapter)
  - ORM: `drizzle-orm>=0.39.3`
  - Schema: Managed via Drizzle Kit, pushed with `npm run db:push`
  - File: `ASL-Immersion-Companion/server` (routes/database integration)
  - Status: Configured but minimal schema detected in exploration

**Local Storage:**
- SQLite
  - Purpose: Translation cache in Python pipeline
  - Location: `~/.cache/asl-video/translation_cache.db`
  - Usage: GlossTranslator caches LLM responses to avoid redundant API calls
  - Client: Python `sqlite3` module

- React Native Async Storage
  - Purpose: Local device storage on mobile
  - Package: `@react-native-async-storage/async-storage>=2.2.0`
  - Usage: Likely for user preferences, progress tracking
  - Integration: `ASL-Immersion-Companion/client/hooks/useStorage.ts`

- Expo File System
  - Purpose: File operations on device
  - Package: `expo-file-system>=19.0.21`
  - Usage: Storing downloaded content, video files
  - Integration: Via Expo APIs

**File Storage:**
- Local filesystem only (device storage)
- Cache directories:
  - `.cache/asl-video/` - Models and translation cache
  - Device-specific storage via Expo File System

**Caching:**
- SQLite-based cache: Translation results
- React Query cache: Server state in frontend
- Model cache: PyTorch models cached locally

## Authentication & Identity

**Auth Provider:**
- Custom/None - No external auth provider detected
- Implementation: `ASL-Immersion-Companion/server/storage.ts` shows in-memory user storage
  - User interface: `InsertUser` and `User` types in `shared/schema`
  - Methods: Basic CRUD (getUser, getUserByUsername, createUser)
  - Status: Memory-backed, not persisted to database

**Session Management:**
- Likely via HTTP cookies/tokens (Express server configured for CORS)
- No explicit auth middleware detected in routes

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Console-based logging in server
- Request logging middleware in `ASL-Immersion-Companion/server/index.ts`:
  - Logs method, path, status code, duration for `/api/*` routes
  - JSON response logging

**Debugging:**
- Python: pytest with async support for pipeline testing
- Frontend: React error boundaries in `ASL-Immersion-Companion/client/components/ErrorBoundary.tsx`

## CI/CD & Deployment

**Hosting:**
- Replit (environment variables detected: `REPLIT_DEV_DOMAIN`, `REPLIT_DOMAINS`)
- Express server listens on `0.0.0.0:5000`

**CI Pipeline:**
- None detected (no GitHub Actions, CircleCI, etc.)

**Build & Deployment Commands:**
```bash
# Frontend
npm run expo:dev              # Local Expo dev server
npm run expo:start:static:build  # Static build
npm run server:dev            # Local server with tsx
npm run server:build          # esbuild bundling
npm run server:prod           # Run bundled server

# Database
npm run db:push              # Apply Drizzle schema

# Quality
npm run lint                 # ESLint check
npm run lint:fix             # ESLint auto-fix
npm run check:types          # TypeScript check
npm run check:format         # Prettier check
npm run format               # Prettier auto-fix

# Mobile
npm run android              # Build/run Android
npm run ios                  # Build/run iOS
```

## Environment Configuration

**Required env vars:**
- `OPENAI_API_KEY` - For GPT-4o translation (if using OpenAI provider)
- `GEMINI_API_KEY` - For Gemini translation (if using Gemini provider)
- `PORT` - Server port (default 5000)
- `REPLIT_DEV_DOMAIN` - Replit preview domain
- `REPLIT_DOMAINS` - Replit production domains

**Optional env vars (Python pipeline):**
- `ASL_DEVICE` - Force compute device (mps, cuda, cpu)
- `ASL_QUALITY` - Quality preset (preview, medium, quality)
- `ASL_LLM_PROVIDER` - LLM provider (openai, gemini, ollama)
- `ASL_CACHE_DIR` - Override cache directory
- `ASL_FP16` - Use half precision (true/false)

**Secrets location:**
- Environment variables (no `.env` files detected in repo)
- Likely configured in Replit secrets dashboard or deployment platform

## Webhooks & Callbacks

**Incoming:**
- No webhooks detected

**Outgoing:**
- No webhooks detected

**Protocol Support:**
- HTTP/HTTPS via Express
- WebSocket (ws package included, not actively used)

---

*Integration audit: 2026-02-02*
