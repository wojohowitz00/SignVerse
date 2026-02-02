# Testing Patterns

**Analysis Date:** 2026-02-02

## Test Framework

**Runner:**
- Python: pytest 8.0.0+
- Config: Defined in `cloud-pipeline/pyproject.toml`
- No JavaScript/TypeScript test runner currently configured (testing infrastructure not yet implemented for React Native/Expo app)

**Assertion Library:**
- Python: pytest built-in assertions

**Run Commands:**
```bash
# Cloud pipeline tests
pytest                    # Run all tests
pytest -v                 # Verbose output
pytest --cov             # Run with coverage reporting

# React Native app tests (not yet configured)
# npm test               # To be implemented
# npm run test:watch     # To be implemented
```

## Test File Organization

**Location - Python:**
- Tests live in `cloud-pipeline/tests/` directory parallel to source
- Test files mirror source structure where applicable
- Example structure:
  - `cloud-pipeline/src/asl_video_generator/config.py` → `cloud-pipeline/tests/test_config.py`
  - `cloud-pipeline/src/asl_video_generator/pose_generator.py` → `cloud-pipeline/tests/test_pose_generator.py`
  - `cloud-pipeline/src/asl_video_generator/gloss_translator.py` → `cloud-pipeline/tests/test_gloss_translator.py`
  - `cloud-pipeline/src/asl_video_generator/pose_dictionary.py` → `cloud-pipeline/tests/test_pose_dictionary.py`

**Location - TypeScript/React (Not implemented):**
- No test files currently exist for React Native app
- When implemented, should follow pattern: `__tests__/`, `.test.ts`, or `.spec.ts`
- Recommended: co-locate tests with source files (e.g., `Button.test.tsx` next to `Button.tsx`)

**Naming:**
- Python: `test_*.py` prefix convention
- TypeScript (when added): `*.test.ts` or `*.spec.ts` suffix

## Test Structure

**Test Conftest (Python):**
Located at `cloud-pipeline/tests/conftest.py`, provides shared fixtures:

```python
"""Pytest configuration and fixtures."""

import sys
from pathlib import Path

import pytest

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

@pytest.fixture
def sample_gloss_sequence():
    """Create a sample GlossSequence for testing."""
    from asl_video_generator.gloss_translator import GlossSequence, NonManualMarkers
    return GlossSequence(
        english="Hello, how are you?",
        gloss=["HELLO", "HOW", "YOU"],
        nmm=NonManualMarkers(
            is_question=True,
            question_type="wh",
            eyebrow_position="furrowed",
        ),
        estimated_duration_ms=1500,
    )

@pytest.fixture
def sample_pose_sequence():
    """Create a sample PoseSequence for testing."""
    # Returns PoseSequence with 30 frames at 30fps
    ...

@pytest.fixture
def temp_pose_dictionary(tmp_path):
    """Create a temporary pose dictionary with sample data."""
    # Creates in-memory SQLite database with sample signs
    ...
```

**Suite Organization:**
Pytest auto-discovers and organizes test functions:

```python
def test_device_detection():
    """Test device detection returns valid DeviceType."""
    from asl_video_generator.config import DeviceType, detect_device
    device = detect_device()
    assert device in (DeviceType.MPS, DeviceType.CUDA, DeviceType.CPU)

def test_quality_presets_exist():
    """Test all quality presets have settings."""
    from asl_video_generator.config import QUALITY_PRESETS, QualityPreset
    for preset in QualityPreset:
        assert preset in QUALITY_PRESETS
        settings = QUALITY_PRESETS[preset]
        assert settings.width > 0
        assert settings.height > 0
        assert settings.fps > 0
```

**Patterns:**
- Setup: Fixtures are created via `@pytest.fixture` decorator and injected as parameters
- Teardown: `tmp_path` fixture automatically cleans up temporary files
- Assertion: Direct pytest assertions (`assert ...`)
- Docstrings: Each test function includes a descriptive docstring

## Mocking

**Framework:** Python's `unittest.mock` module used where needed

**Patterns (Python):**

```python
from unittest.mock import patch

def test_env_overrides():
    """Test environment variable overrides work."""
    from asl_video_generator.config import QualityPreset, load_config_from_env

    with patch.dict(os.environ, {"ASL_QUALITY": "preview"}):
        # Clear cache to force re-detection
        from asl_video_generator.config import detect_device
        detect_device.cache_clear()

        config = load_config_from_env()
        assert config.quality == QualityPreset.PREVIEW
```

**What to Mock:**
- Environment variables using `patch.dict(os.environ, {...})`
- External service calls (not present in current tests but pattern would follow unittest.mock)
- File system operations using `tmp_path` fixture

**What NOT to Mock:**
- Core business logic (pose generation, translation)
- Actual data structures and models
- Database operations on in-memory test database

## Fixtures and Factories

**Test Data (Python):**

From `cloud-pipeline/tests/conftest.py`:

```python
@pytest.fixture
def temp_pose_dictionary(tmp_path):
    """Create a temporary pose dictionary with sample data."""
    import numpy as np
    from asl_video_generator.pose_dictionary import (
        PoseDictionary,
        PoseKeypoints,
        SignPoseSequence,
    )

    db_path = tmp_path / "test_poses.db"
    dictionary = PoseDictionary(db_path=db_path)

    # Add some sample signs
    for gloss in ["HELLO", "HOW", "YOU", "THANK-YOU"]:
        kp = PoseKeypoints(
            body=np.random.rand(33, 3),
            left_hand=np.random.rand(21, 3),
            right_hand=np.random.rand(21, 3),
        )
        kp.body[:, 2] = 1.0  # Set confidence scores
        kp.left_hand[:, 2] = 1.0
        kp.right_hand[:, 2] = 1.0

        seq = SignPoseSequence(
            gloss=gloss,
            frames=[kp] * 10,
            fps=30,
            source="test",
        )
        dictionary.add_sign(seq)

    return dictionary
```

**Location:**
- Fixtures: `cloud-pipeline/tests/conftest.py`
- Shared across all tests in that directory via pytest's auto-discovery

## Coverage

**Requirements:** Not explicitly enforced, but available

**View Coverage:**
```bash
pytest --cov=src/asl_video_generator --cov-report=html
```

## Test Types

**Unit Tests:**
- Scope: Individual functions and classes (config validation, device detection)
- Approach: Direct assertion of outputs given specific inputs
- Example: `test_device_detection()`, `test_quality_presets_exist()`
- Location: `cloud-pipeline/tests/test_*.py`

**Integration Tests:**
- Scope: Interactions between modules (pose dictionary and pose generator)
- Approach: Test full workflows with real data structures
- Example: Loading sample data into dictionary and querying it
- Location: `cloud-pipeline/tests/test_*.py` (same location, distinguished by scope)

**E2E Tests:**
- Framework: Not yet implemented for React Native app
- Would test: Full app workflows (sign lookup → display → practice)
- Current gap: No E2E test infrastructure

**Python-specific:**
- `pytest-asyncio` in dev dependencies (not yet used but available)
- Supports async/await testing when needed

## Common Patterns

**Async Testing:**
pytest-asyncio configured in `pyproject.toml`:
```python
# Usage pattern (not yet in codebase):
@pytest.mark.asyncio
async def test_async_operation():
    result = await some_async_function()
    assert result == expected
```

**Error Testing:**
Testing error conditions and exception handling:

```python
def test_validate_mps_availability():
    """Test MPS validation returns valid structure."""
    from asl_video_generator.config import validate_mps_availability

    result = validate_mps_availability()

    assert "device" in result
    assert "available" in result
    assert isinstance(result["available"], bool)
```

**Fixture Injection:**
Fixtures are injected as function parameters - pytest automatically matches by name:

```python
def test_with_fixtures(sample_gloss_sequence, temp_pose_dictionary):
    """Test using multiple fixtures."""
    # Both fixtures are automatically created and passed in
    assert sample_gloss_sequence.english == "Hello, how are you?"
    assert temp_pose_dictionary is not None
```

## Test Coverage Gaps

**React Native/Expo App:**
- No unit tests for components (`Button`, `Card`, `ErrorBoundary`, etc.)
- No integration tests for navigation and screen flows
- No E2E tests for complete user journeys
- Hook logic (`useTheme`, `useContent`, etc.) untested

**Recommendation:** Implement Jest/Vitest for TypeScript/React testing with:
- Component snapshot and behavior tests
- Hook testing via @testing-library/react-native
- Navigation flow tests
- Mock API response handling

**Python Pipeline:**
- Good coverage for config and core utilities
- Could expand to test video rendering output
- Could test integration with external LLM services (currently stubbed)

---

*Testing analysis: 2026-02-02*
