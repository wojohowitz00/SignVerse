# Technology Stack

**Analysis Date:** 2026-02-02

## Languages

**Primary:**
- TypeScript 5.9.2 - Full application (client, server, shared code)
- Python 3.11+ - Cloud pipeline for ASL video generation
- JavaScript/JSX - React Native and React components

**Secondary:**
- HTML5 - Landing page templates in `ASL-Immersion-Companion/server/templates/`
- CSS - Via React Native styling (StyleSheet)

## Runtime

**Environment:**
- Node.js 24.x (inferred from `@types/node: 24.10.0`)
- Python 3.13 (detected in `.venv`)

**Package Managers:**
- npm (root-level `node_modules/`)
- uv (for Python) - `cloud-pipeline/uv.lock` exists, configured in `cloud-pipeline/pyproject.toml`

## Frameworks

**Core Frontend:**
- React 19.1.0 - Web/desktop via `react-dom`
- React Native 0.81.5 - Mobile app via Expo
- Expo 54.0.23 - Cross-platform mobile framework with iOS/Android support

**Core Backend:**
- Express 5.0.1 - HTTP server in `ASL-Immersion-Companion/server/index.ts`
- Node HTTP module - Raw HTTP server creation

**Navigation & UI:**
- React Navigation 7.1.8 - Mobile navigation primitives
  - `@react-navigation/native-stack` 7.3.16 - Stack navigator
  - `@react-navigation/bottom-tabs` 7.4.0 - Tab navigation
  - `@react-navigation/native` 7.1.8 - Core navigation
- React Native Gesture Handler 2.28.0 - Touch gestures
- React Native Reanimated 4.1.1 - Animation library
- Expo Glass Effect 0.1.6 - Blur/glass morphism effects
- React Native Web 0.21.0 - Web compatibility layer

**Data & State Management:**
- TanStack React Query (TanStack/react-query) 5.90.7 - Server state management
- Drizzle ORM 0.39.3 - SQL ORM (configured but minimal usage detected)
- Drizzle Kit 0.31.4 - Schema management
- pg 8.16.3 - PostgreSQL client (dependency of Drizzle)
- Zod 3.24.2 - Schema validation
- Drizzle-Zod 0.7.0 - Zod integration for Drizzle

**Styling & Assets:**
- Expo Vector Icons 15.0.2 - Icon library
- Expo Linear Gradient 15.0.8 - Gradient support
- Expo Image 3.0.10 - Image component
- React Native SVG 15.15.1 - SVG support
- Expo Symbols 1.0.7 - SF Symbols on iOS
- Lottie React Native 7.3.5 - JSON animations
- @lottiefiles/dotlottie-react 0.13.5 - DotLottie support
- Expo Google Fonts (Nunito) 0.4.2 - Custom font family

**Storage & Platform:**
- React Native Async Storage 2.2.0 - Local device storage
- Expo File System 19.0.21 - File operations
- Expo AV 16.0.8 - Audio/video playback
- Expo Keyboard Controller 1.18.5 - Keyboard management
- React Native Keyboard Controller 1.18.5 - Additional keyboard support
- Expo Safe Area Context 5.6.0 - Safe area handling
- React Native Screens 4.16.0 - Native screen stack
- Expo Blur 15.0.7 - Blur effects
- Expo Status Bar 3.0.8 - Status bar control
- Expo Linking 8.0.8 - Deep linking
- Expo Web Browser 15.0.9 - In-app browser
- Expo Constants 18.0.9 - Platform constants
- Expo Font 14.0.9 - Custom fonts
- Expo Modules Core 2.2.0 - Expo modules API

**Python ML/Video Pipeline:**
- PyTorch 2.2.0+ - Deep learning framework (MPS-optimized)
- Diffusers 0.27.0+ - Stable Diffusion models
- Transformers 4.40.0+ - Hugging Face models
- MediaPipe 0.10.11+ - Pose detection and hand tracking
- ControlNet-Aux 0.0.8+ - ControlNet preprocessing
- Pillow 10.2.0+ - Image processing
- OpenCV 4.9.0+ - Video processing
- ImageIO 2.34.0+ with FFmpeg - Video I/O
- Accelerate 0.28.0+ - Distributed training utilities
- NumPy 1.26.0+ - Numerical computing
- SciPy 1.12.0+ - Scientific computing
- Einops 0.7.0+ - Tensor operations
- Pydantic 2.0+ - Data validation
- Pydantic Settings 2.0+ - Configuration management
- SQLAlchemy 2.0+ - Database ORM (for pose dictionary)
- HTTPX 0.27.0+ - Async HTTP client
- Psutil 5.9.0+ - System monitoring
- python-dotenv 1.0.0+ - Environment variable loading
- TQDM 4.66.0+ - Progress bars
- Ollama 0.2.0+ - Local LLM support

**Build & Bundling:**
- esbuild - Server bundling (script in `package.json`: `server:build`)
- tsx 4.20.6 - TypeScript execution for dev server
- Babel Module Resolver 5.0.2 - Import path resolution

**Development & Quality:**
- TypeScript 5.9.2 - Type checking
- ESLint 9.25.0 - Linting
  - eslint-config-expo 10.0.0 - Expo ESLint config
  - eslint-plugin-prettier 5.5.4 - Prettier integration
  - eslint-import-resolver-node 0.3.9 - Import resolver
  - eslint-config-prettier 10.1.8 - Prettier config
- Prettier 3.6.2 - Code formatting
- Pytest 8.0.0+ - Python testing (dev dependency)
- Pytest-asyncio 0.23.0+ - Async testing
- Ruff 0.3.0+ - Python linting
- MyPy 1.9.0+ - Python type checking
- Zod-Validation-Error 3.4.0 - Better Zod error messages

**Networking:**
- ws 8.18.0 - WebSocket support (potential server feature)
- http-proxy-middleware 3.0.5 - CORS/proxy handling

**Local Development:**
- Drizzle Kit 0.31.4 - Schema push (`npm run db:push`)

## Configuration

**Environment:**
- Replit environment detected via `REPLIT_DEV_DOMAIN` and `REPLIT_DOMAINS` env vars
- Node PORT env var (default 5000)
- Python LLM providers via `ASL_DEVICE`, `ASL_QUALITY`, `ASL_LLM_PROVIDER`, `ASL_CACHE_DIR`, `ASL_FP16` env vars
- API keys via `OPENAI_API_KEY`, `GEMINI_API_KEY` env vars

**TypeScript:**
- Path aliases configured in `ASL-Immersion-Companion/tsconfig.json`:
  - `@/*` → `./client/*`
  - `@shared/*` → `./shared/*`

**Python:**
- Ruff linting with line length 100, target Python 3.11
- MyPy strict mode with Python 3.11

**Build:**
- Expo static build via `expo start --no-dev --minify`
- Node server bundling with esbuild to `server_dist/`
- Database schema management via Drizzle Kit

## Platform Requirements

**Development:**
- macOS with Apple Silicon (M-series) optimized - MPS GPU support configured
- Fallback to CUDA (NVIDIA) or CPU
- 24GB unified memory assumed optimal (referenced in comments)

**Production:**
- Replit hosting (inferred from env vars)
- iOS/Android deployment via Expo (app.json configuration exists)
- Node.js runtime for server
- Python 3.11+ with GPU support for video generation pipeline

**Deployment Targets:**
- Web: Browser via `react-dom`, static Expo build
- iOS: Native via Expo (ios/ directory present)
- Android: Native via Expo (no directory yet but supported)
- Cloud: Python backend for ASL video generation

---

*Stack analysis: 2026-02-02*
