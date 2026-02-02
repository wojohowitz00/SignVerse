# Codebase Concerns

**Analysis Date:** 2026-02-02

## Tech Debt

**Unimplemented wSignGen Model Integration:**
- Issue: `_generate_wsigngen()` method is a stub that generates placeholders instead of actual wSignGen model inference
- Files: `cloud-pipeline/src/asl_video_generator/vocabulary_generator.py` (lines 195-214)
- Impact: Vocabulary generation (word-level 3D ASL motions) is non-functional in production; placeholder mode is the only working path
- Fix approach: Implement actual wSignGen transformer-diffusion inference after model weights are obtained; add model loading with proper error handling

**Incomplete 3D Mesh Rendering:**
- Issue: 3D mesh rendering methods are TODO stubs with print statements; no actual 3D rendering is implemented
- Files: `cloud-pipeline/src/asl_video_generator/avatar_renderer.py` (lines 174, 186, 191)
  - `_render_mesh_frames()`: Draws placeholder silhouettes instead of rendering 3D meshes
  - `_render_mesh_video()`: Returns directory of placeholder frames, doesn't combine to video via ffmpeg
- Impact: 3D mesh animation videos cannot be generated; feature is non-functional
- Fix approach: Integrate PyRender or Blender for 3D mesh rendering; implement ffmpeg frame-to-video conversion

**Uninitialized Diffusion Pipeline Fallback:**
- Issue: When diffusion pipeline fails to load, system silently falls back to skeleton rendering with minimal feedback
- Files: `cloud-pipeline/src/asl_video_generator/diffusion_renderer.py` (lines 164-167)
- Impact: Users may think photorealistic rendering succeeded when it actually degraded to skeleton visualization; no clear logging
- Fix approach: Add structured error logging and CLI feedback about which rendering mode actually executed

**Placeholder Sign Generation Without Dictionary Data:**
- Issue: When signs are missing from pose dictionary, system generates synthetic placeholder motions that don't match real ASL
- Files: `cloud-pipeline/src/asl_video_generator/pose_generator.py` (lines 359-399)
- Impact: Missing signs produce unconvincing placeholder animations; no indication to user that sign data is synthetic
- Fix approach: Track placeholder usage separately; provide fallback to pre-recorded placeholder videos or skip unknown signs with warning

## Known Bugs

**JSON Parsing Error Handling Gap:**
- Symptoms: If LLM returns malformed JSON, system falls back to word-by-word uppercase translation
- Files: `cloud-pipeline/src/asl_video_generator/gloss_translator.py` (lines 519-545)
- Trigger: Any JSON parse error from OpenAI/Gemini/Ollama responses
- Workaround: Fallback parsing is implemented but produces lower-quality translations with generic NMM
- Issue: No logging or warning that fallback mode was triggered; silent degradation

**Motion Matching Distance Calculation Incomplete:**
- Symptoms: NMM facial keypoint modifications use hardcoded indices that may not match actual MediaPipe layout
- Files: `cloud-pipeline/src/asl_video_generator/pose_generator.py` (lines 531-560)
  - `_modify_eyebrows()`: Uses hardcoded `range(min(5, len(modified)))` which assumes eyebrow indices are 0-5
  - `_modify_head_position()`: Uses hardcoded `range(min(11, len(modified)))` for head region
- Trigger: When MediaPipe landmark indexing differs from expected format
- Workaround: Currently works for standard MediaPipe 33-point format but brittle
- Issue: No validation that expected landmarks exist; will silently fail if pose format changes

**Empty List Return When Interpolation Count is Zero:**
- Symptoms: `interpolate_poses()` returns empty list when `num_frames <= 0`
- Files: `cloud-pipeline/src/asl_video_generator/pose_dictionary.py` (lines 382-383)
- Trigger: When blend_frames is set to 0 or negative value
- Workaround: blend_frames configuration has minimum default of 20
- Issue: Silently drops transition frames; no error signal to caller

## Security Considerations

**API Keys in Environment Variables Without Validation:**
- Risk: OpenAI API key accessed via `os.getenv("OPENAI_API_KEY")` with only string validation, not encryption
- Files: `cloud-pipeline/src/asl_video_generator/gloss_translator.py` (lines 359-362, 369-371)
- Current mitigation: Keys are only used at runtime in lazy-loaded clients; not logged or stored in files
- Recommendations:
  1. Use `python-dotenv` with `.env` file and `.gitignore` to prevent accidental commits
  2. Add validation that API key format matches provider expectations (e.g., "sk-" prefix for OpenAI)
  3. Never print API keys in error messages or logs

**SQL Injection Prevention in Database Queries:**
- Risk: All database queries use parameterized prepared statements (good), but manually constructed WHERE clauses could be vulnerable if inputs aren't normalized
- Files: `cloud-pipeline/src/asl_video_generator/pose_dictionary.py`, `gloss_translator.py`
- Current mitigation: Inputs are normalized (`.upper()` for gloss) before database use; parameterized queries prevent injection
- Recommendations:
  1. Add explicit validation that gloss strings are alphanumeric + hyphens only
  2. Add comments marking all database query parameters as SQL-safe

**File Path Traversal in Output Paths:**
- Risk: Output paths are created from user input without validation; could allow writing outside intended directories
- Files: Multiple files using `output_path.parent.mkdir(parents=True, exist_ok=True)`
- Current mitigation: CLI controls output paths; internal code doesn't expose directory traversal
- Recommendations:
  1. Add `Path.resolve().relative_to(base_dir)` validation in batch processing
  2. Sanitize filenames to prevent special characters

## Performance Bottlenecks

**Inefficient Pose Dictionary Queries on Large Datasets:**
- Problem: `find_best_variant()` loads all variants into memory and iterates to find minimum distance
- Files: `cloud-pipeline/src/asl_video_generator/pose_dictionary.py` (lines 255-290)
- Cause: O(n) scan through all variants; distance calculations use full hand/body arrays with NumPy
- Impact: With 5+ variants per sign × 1000+ signs, motion matching becomes slow
- Improvement path:
  1. Pre-compute and cache first/last frame distances at database level
  2. Use SQLite distance function or add variant ranking index
  3. Consider approximate nearest-neighbor search with VP-trees

**Full JSON Loading for Large Pose Sequences:**
- Problem: Entire frames_json column loaded into memory before deserialization
- Files: `cloud-pipeline/src/asl_video_generator/pose_dictionary.py` (lines 213, 243, 352)
- Cause: `json.loads()` on potentially megabyte-sized JSON strings
- Impact: Memory spikes for videos with 300+ frames (10+ seconds at 30fps)
- Improvement path:
  1. Stream JSON parsing or use JSONL (JSON Lines) format with one frame per line
  2. Lazy-load frames on demand rather than all-at-once
  3. Store compressed binary format (msgpack, protobuf) instead of JSON

**LLM API Call Latency Without Timeout:**
- Problem: `translate()` method makes blocking API calls with no timeout specification
- Files: `cloud-pipeline/src/asl_video_generator/gloss_translator.py` (lines 442-454, 456-462, 465-476)
- Cause: OpenAI, Gemini, and Ollama client calls don't specify `timeout` parameter
- Impact: Batch processing can hang indefinitely on network issues
- Improvement path:
  1. Add configurable timeout (recommend 30-60 seconds)
  2. Add retry logic with exponential backoff
  3. Add circuit breaker for repeated failures

**Synchronous Translation Batch Processing:**
- Problem: `translate_batch()` processes items sequentially with blocking API calls
- Files: `cloud-pipeline/src/asl_video_generator/gloss_translator.py` (lines 579-595)
- Cause: No parallel processing or async/await
- Impact: Translating 100 sentences takes ~5-10 seconds per sentence = 500-1000 seconds (8-16 minutes)
- Improvement path:
  1. Use `asyncio` with OpenAI's async client
  2. Implement thread pool with concurrent.futures for non-async providers
  3. Add progress bar with ETA (already has tqdm dependency)

## Fragile Areas

**Complex NMM Application Logic with Limited Testing:**
- Files: `cloud-pipeline/src/asl_video_generator/pose_generator.py` (lines 427-515)
  - `_apply_nmm_overlays()`: Applies NMM to all frames with no span validation
  - `_apply_nmm_to_frame()`: Uses hardcoded keypoint indices for face region modifications
- Why fragile:
  1. Only applies first NMM to entire sequence; multi-span NMM not implemented (line 451)
  2. No bounds checking on modified coordinates; modifications could place keypoints off-canvas
  3. Hard-coded magic numbers (0.02, 0.01, etc.) for facial movements with no tuning
- Safe modification:
  1. Add unit tests for each NMM type with known pose fixtures
  2. Add assertions that modified coordinates stay within valid range [0, 1]
  3. Implement proper span-based NMM application with index ranges
- Test coverage: `test_nmm_application()` exists (line 131 of test_pose_generator.py) but only checks that frame is modified, not correctness

**Placeholder Pose Generation Without Validation:**
- Files: `cloud-pipeline/src/asl_video_generator/pose_dictionary.py` (lines 434-481)
  - `generate_placeholder_keypoints()`: Creates hand positions with magic coordinate values
- Why fragile:
  1. Hardcoded hand positions (0.30-0.35 X range) assume specific video dimensions
  2. No validation that generated poses are biomechanically valid
  3. Different code paths in avatar_renderer draw silhouettes differently from skeleton renderer
- Safe modification:
  1. Centralize placeholder generation with configurable base pose
  2. Validate that left/right hand are symmetrically positioned
  3. Add unit test comparing placeholder output across functions
- Test coverage: No direct tests for placeholder generation

**Mixed String Case Handling for Glosses:**
- Files: Multiple files including `gloss_translator.py` (line 556), `pose_dictionary.py` (line 182, 209)
- Why fragile:
  1. Some code uses `.upper()` to normalize; some assumes uppercase input
  2. `_validate_vocabulary()` calls `.upper()` on each sign, but input may already be uppercase
  3. No validation that output glosses don't contain lowercase after validation
- Safe modification:
  1. Create `normalize_gloss()` utility function
  2. Apply consistently in all input paths
  3. Add assertion that all glosses in outputs are uppercase

## Scaling Limits

**SQLite Database Single-Writer Limitation:**
- Current capacity: Works fine for single process; ~1000 signs with ~3 variants each = ~3000 rows
- Limit: SQLite has RSTD (Read-Write Serialization) with single writer lock; concurrent batch processing blocked
- Scaling path:
  1. Migrate to PostgreSQL for multi-writer support
  2. Keep SQLite for local development/testing
  3. Add database abstraction layer to support both

**Translation Cache Unbounded Growth:**
- Current capacity: SQLite cache in `~/.cache/asl-video/translation_cache.db` grows 1KB per unique translation
- Limit: After 100k translations, database file reaches ~100MB; no cleanup policy
- Scaling path:
  1. Add `--clear-cache` CLI option and scheduled cleanup
  2. Implement LRU eviction policy (keep last N translations)
  3. Add cache statistics command to monitor size

**Memory Usage with Large Batch Processing:**
- Current capacity: Can handle batch of ~10-20 sentences with pose + vocabulary generation
- Limit: Each pose sequence loads all frames into memory; 30 FPS × 3 seconds = 90 frames × 3KB each frame = 270KB per sequence
- Scaling path:
  1. Implement streaming pose processing
  2. Use generator functions for batch iteration
  3. Add memory pooling to reuse frame buffers

## Dependencies at Risk

**Torch/Diffusers Dependency on Model Hub Availability:**
- Risk: Loading models from Hugging Face requires internet and their service availability
  - Lines: `cloud-pipeline/src/asl_video_generator/diffusion_renderer.py` (lines 128-145)
  - Models: `guoyww/animatediff-motion-adapter-v1-5-2`, `runwayml/stable-diffusion-v1-5`, `lllyasviel/control_v11p_sd15_openpose`
- Impact: Pipeline fails silently and falls back to skeleton rendering if model hub is unreachable
- Migration plan:
  1. Support local model path via environment variable
  2. Add model pre-download script with verification checksums
  3. Cache models with version pinning

**OpenAI Client Library Breaking Changes:**
- Risk: Code uses `client.chat.completions.create()` which is OpenAI Python 1.0+ API; incompatible with 0.x
- Impact: Dependency conflicts with other projects using older openai library
- Migration plan:
  1. Pin `openai>=1.0` explicitly in requirements.txt
  2. Add version compatibility matrix in README
  3. Consider using httpx directly for API calls to reduce dependency

**Pydantic v2 Upgrade Risk:**
- Risk: Code uses `model_dump()`, `model_dump_json()` which are v2-only methods
- Files: `cloud-pipeline/src/asl_video_generator/gloss_translator.py` (line 196), CLI (line 321)
- Impact: Requires `pydantic>=2.0`; incompatible with projects pinned to v1
- Migration plan:
  1. Explicitly document `pydantic>=2.0` requirement
  2. Add compatibility shim if v1 support needed: `if hasattr(obj, 'model_dump'): obj.model_dump() else: obj.dict()`

## Missing Critical Features

**No Batch Error Recovery:**
- Problem: Batch processing functions don't track which items failed; entire batch status unknown on failure
- Files: `generate_poses_batch()` (line 563-596), `translate_batch()` (line 579-595), `render_batch()` (line 308-345)
- Blocks: Can't resume batch processing; must re-process entire batch on single failure
- Fix: Return structured results with per-item status and error messages

**No Video Quality Validation:**
- Problem: Rendered videos aren't validated for correctness; no dimension/fps/duration checks
- Blocks: Can't verify that output meets expected quality before delivering to user
- Fix: Add post-render validation comparing actual vs expected properties

**No ASL Linguistics Validation:**
- Problem: Generated gloss sequences aren't validated against ASL grammatical rules (topic-comment structure, NMM placement)
- Blocks: Low-quality translations pass through without linguistic validation
- Fix: Integrate ASL grammar rule engine or fuzzy-match against known good translations

## Test Coverage Gaps

**NMM Span Application Untested:**
- What's not tested: Multi-span NMM application, partial-sequence NMM application, span boundary conditions
- Files: `cloud-pipeline/src/asl_video_generator/pose_generator.py` (lines 427-515)
- Risk: NMM spans feature is declared in `GlossSequence` but only first NMM actually applied
- Priority: High - blocking proper ASL grammar support

**Error Path Testing Missing:**
- What's not tested:
  - Missing signs with no dictionary entry (only happy path tested)
  - API timeout behavior
  - Database corruption recovery
  - Malformed pose/motion JSON files
- Files: All modules
- Risk: Error handling code is untested; may fail in unexpected ways in production
- Priority: High

**Interpolation Edge Cases:**
- What's not tested:
  - Zero blend_frames
  - Empty pose sequences
  - Poses with mismatched keypoint counts
  - NaN/infinite values in keypoints
- Files: `cloud-pipeline/src/asl_video_generator/pose_dictionary.py` (lines 364-405)
- Risk: Edge cases will cause crashes or silent corruption
- Priority: Medium

**Motion Matching Quality:**
- What's not tested:
  - Distance calculation accuracy
  - Variant selection with multiple near-optimal candidates
  - Pathological cases (duplicate poses, single variant)
- Files: `cloud-pipeline/src/asl_video_generator/pose_dictionary.py` (lines 255-290)
- Risk: Motion quality degraded without detection
- Priority: Medium

**Diffusion Rendering Fallback Paths:**
- What's not tested:
  - Device unavailability (MPS, CUDA, CPU)
  - Model loading failures
  - Out-of-memory conditions
  - Partial model downloads
- Files: `cloud-pipeline/src/asl_video_generator/diffusion_renderer.py`
- Risk: Silent fallbacks hide real problems; users may not know they got degraded quality
- Priority: Medium

---

*Concerns audit: 2026-02-02*
