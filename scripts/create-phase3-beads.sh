#!/usr/bin/env bash
# Create Phase 3 (On-Device ASL Gesture Recognition) Beads issues, dependencies, and labels.
# Run from ASL-Immersion-Companion directory: ./scripts/create-phase3-beads.sh
# Requires: bd (beads CLI), jq (for --json parsing). Idempotent: skips if Phase 3 epic exists.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_DIR"

if ! command -v bd &>/dev/null; then
  echo "Error: bd (beads) CLI not found. Install from https://github.com/steveyegge/beads"
  exit 1
fi

if ! command -v jq &>/dev/null; then
  echo "Error: jq not found. Install with: brew install jq"
  exit 1
fi

# Check if Phase 3 epic already exists
EXISTING=$(bd list --type epic 2>/dev/null | grep -i "Phase 3.*On-Device ASL" || true)
if [[ -n "$EXISTING" ]]; then
  echo "Phase 3 epic already exists. Skipping create. Use bd list to see issues."
  exit 0
fi

echo "Creating Phase 3 epic and tasks..."

# Helper: create issue and set global ID_LAST
create() {
  local title="$1" priority="${2:-2}" type="${3:-task}" desc="${4:-}"
  local out
  if [[ -n "$desc" ]]; then
    out=$(bd create "$title" -p "$priority" --type "$type" --description "$desc" --json 2>&1)
  else
    out=$(bd create "$title" -p "$priority" --type "$type" --json 2>&1)
  fi
  ID_LAST=$(echo "$out" | jq -r '.id // empty')
  if [[ -z "$ID_LAST" ]]; then
    echo "Failed to get ID from: $out" >&2
    return 1
  fi
  echo "  $ID_LAST  $title"
}

# --- Epics and tasks (create in dependency order) ---

create "Epic: Phase 3 - On-Device ASL Gesture Recognition" 0 epic \
  "Real-time ASL fingerspelling recognition on iOS using Apple Vision framework and Core ML. On-device personalization via MLUpdateTask. iOS 14+, iPhone XS+ (A12 chip) minimum."
P3="$ID_LAST"

create "Epic 3.1: Expo Module Infrastructure" 0 epic \
  "Create Swift-based Expo Module scaffolding for native iOS API access. Foundation for all native ML work."
E31="$ID_LAST"
bd dep add "$E31" "$P3"

create "3.1.1: Create Expo Module scaffolding with expo-module-create" 0 task \
  "Create modules/asl-recognition/ directory structure, ASLRecognitionModule.swift, expo-module.config.json, Podfile integration for Vision and CoreML frameworks."
T311="$ID_LAST"
bd dep add "$T311" "$E31"

create "3.1.2: Define TypeScript interface for ASL Recognition module" 1 task \
  "Type definitions for HandPose, RecognitionResult, PersonalizationSample, ASLRecognitionConfig. Events: onSignRecognized, onHandDetected, onHandLost, onTrainingProgress."
T312="$ID_LAST"
bd dep add "$T312" "$E31"
bd dep add "$T312" "$T311"

create "3.1.3: Configure camera permissions and entitlements" 1 chore \
  "app.json NSCameraUsageDescription, ios Info.plist privacy settings, permission request helper in Swift module."
T313="$ID_LAST"
bd dep add "$T313" "$E31"
bd dep add "$T313" "$T311"

create "Epic 3.2: Hand Pose Detection with Apple Vision" 0 epic \
  "Implement VNDetectHumanHandPoseRequest for real-time hand landmark detection. Extract 21 key points per hand."
E32="$ID_LAST"
bd dep add "$E32" "$P3"
bd dep add "$E32" "$E31"

create "3.2.1: Implement AVCaptureSession for front camera" 0 task \
  "CameraSessionManager.swift with front camera config, 30fps at 1280x720, background thread capture, proper session lifecycle."
T321="$ID_LAST"
bd dep add "$T321" "$E32"
bd dep add "$T321" "$T311"

create "3.2.2: Implement VNDetectHumanHandPoseRequest pipeline" 0 task \
  "HandPoseDetector.swift with VNDetectHumanHandPoseRequest, VNImageRequestHandler per frame, 21 landmark extraction, coordinate normalization."
T322="$ID_LAST"
bd dep add "$T322" "$E32"
bd dep add "$T322" "$T321"

create "3.2.3: Implement landmark stabilization and smoothing" 1 task \
  "LandmarkStabilizer.swift with exponential moving average filter, jitter threshold, hand state machine (NoHand/Detecting/TrackingStable/HandLost)."
T323="$ID_LAST"
bd dep add "$T323" "$E32"
bd dep add "$T323" "$T322"

create "Epic 3.3: Core ML ASL Classification Model" 0 epic \
  "Create and integrate Core ML model for static ASL fingerspelling classification (A-Z, 0-9). 36 classes total."
E33="$ID_LAST"
bd dep add "$E33" "$P3"
bd dep add "$E33" "$E31"

create "3.3.1: Design Core ML model architecture for fingerspelling" 0 task \
  "Architecture doc: Input 21 landmarks x 3 coords = 63 features, Output 36 classes (A-Z + 0-9). MLP architecture: 128->64->36 units, ~15K params."
T331="$ID_LAST"
bd dep add "$T331" "$E33"

create "3.3.2: Prepare training data for ASL fingerspelling model" 1 task \
  "scripts/prepare_training_data.py - Process ASL Alphabet Dataset (Kaggle 87k images), extract landmarks via MediaPipe, augmentation pipeline."
T332="$ID_LAST"
bd dep add "$T332" "$E33"
bd dep add "$T332" "$T331"

create "3.3.3: Train classifier using Create ML or coremltools" 1 task \
  "scripts/train_model.py - Train with coremltools or Create ML GUI, export ASLClassifier.mlmodel, target >=90% validation accuracy."
T333="$ID_LAST"
bd dep add "$T333" "$E33"
bd dep add "$T333" "$T332"

create "3.3.4: Configure model for on-device updates (MLUpdateTask)" 1 task \
  "Make final dense layer updatable, configure categorical cross-entropy loss and SGD optimizer, save ASLClassifier_Updatable.mlmodel."
T334="$ID_LAST"
bd dep add "$T334" "$E33"
bd dep add "$T334" "$T333"

create "Epic 3.4: Real-time Recognition Pipeline" 0 epic \
  "Connect hand pose detection to Core ML classifier for real-time ASL recognition."
E34="$ID_LAST"
bd dep add "$E34" "$P3"
bd dep add "$E34" "$E32"
bd dep add "$E34" "$E33"

create "3.4.1: Implement Core ML inference manager" 0 task \
  "ASLClassifierManager.swift - Model loading from bundle, prediction method with confidence threshold, Neural Engine configuration."
T341="$ID_LAST"
bd dep add "$T341" "$E34"
bd dep add "$T341" "$T334"

create "3.4.2: Implement sign recognition state machine" 1 task \
  "RecognitionStateMachine.swift - Sliding window of 5 predictions, require 4/5 match for confirmation, handle sign transitions."
T342="$ID_LAST"
bd dep add "$T342" "$E34"
bd dep add "$T342" "$T341"

create "3.4.3: Integrate detection + classification pipeline" 1 task \
  "ASLRecognitionPipeline.swift - End-to-end: Camera->Vision->CoreML->Events. Threading model, performance monitoring, <100ms latency."
T343="$ID_LAST"
bd dep add "$T343" "$E34"
bd dep add "$T343" "$T342"
bd dep add "$T343" "$T323"

create "Epic 3.5: On-Device Personalization" 1 epic \
  "Implement MLUpdateTask for few-shot on-device model personalization. User can improve recognition with their own signing style."
E35="$ID_LAST"
bd dep add "$E35" "$P3"
bd dep add "$E35" "$E34"

create "3.5.1: Implement personalization sample collection" 1 task \
  "PersonalizationManager.swift - Sample storage (landmarks + labels), file persistence in Documents, sample count tracking. Min 3, max 50 samples per sign."
T351="$ID_LAST"
bd dep add "$T351" "$E35"
bd dep add "$T351" "$T343"

create "3.5.2: Implement MLUpdateTask for model fine-tuning" 1 task \
  "ModelTrainer.swift - MLUpdateTask configuration, training progress callbacks, updated model persistence to Documents/ASLClassifier_Personal.mlmodelc."
T352="$ID_LAST"
bd dep add "$T352" "$E35"
bd dep add "$T352" "$T351"

create "3.5.3: Implement personalization reset functionality" 2 task \
  "Reset method - delete personalized model file, clear stored samples, reload base model from bundle."
T353="$ID_LAST"
bd dep add "$T353" "$E35"
bd dep add "$T353" "$T352"

create "Epic 3.6: React Native Integration" 1 epic \
  "Bridge native Swift module to React Native with camera view, events, and hooks."
E36="$ID_LAST"
bd dep add "$E36" "$P3"
bd dep add "$E36" "$E35"

create "3.6.0: Add fingerspelling data and prompts (fingerspelling.ts)" 2 task \
  "Create client/data/fingerspelling.ts with A-Z sign data and prompts for practice screen. Used by ASLPracticeScreen for target letter display and practice flow."
T360="$ID_LAST"
bd dep add "$T360" "$E36"

create "3.6.1: Implement ASLCameraView native component" 1 task \
  "ASLRecognitionView.swift (ExpoView subclass) - Camera preview layer, optional landmark overlay, view lifecycle management."
T361="$ID_LAST"
bd dep add "$T361" "$E36"
bd dep add "$T361" "$T343"

create "3.6.2: Implement event bridge for recognition results" 1 task \
  "Event definitions in ASLRecognitionModule - onSignRecognized, onHandDetected, onHandLost, onTrainingProgress with typed payloads."
T362="$ID_LAST"
bd dep add "$T362" "$E36"
bd dep add "$T362" "$T361"

create "3.6.3: Create useASLRecognition React hook" 2 task \
  "client/hooks/useASLRecognition.ts - State for recognition lifecycle, event subscriptions, personalization methods, proper cleanup."
T363="$ID_LAST"
bd dep add "$T363" "$E36"
bd dep add "$T363" "$T362"

create "3.6.4: Create ASL Practice Screen with camera recognition" 2 feature \
  "client/screens/ASLPracticeScreen.tsx - Camera preview, sign prompt, recognition feedback, score tracking, haptic feedback."
T364="$ID_LAST"
bd dep add "$T364" "$E36"
bd dep add "$T364" "$T363"
bd dep add "$T364" "$T360"

create "3.6.5: Create Personalization Training UI" 2 feature \
  "client/screens/PersonalizationScreen.tsx - Sign selector grid, sample capture, training progress modal, reset with confirmation."
T365="$ID_LAST"
bd dep add "$T365" "$E36"
bd dep add "$T365" "$T364"

create "Epic 3.7: Testing and Performance Optimization" 2 epic \
  "Comprehensive testing and performance optimization for production readiness."
E37="$ID_LAST"
bd dep add "$E37" "$P3"
bd dep add "$E37" "$E36"

create "3.7.1: Write unit tests for Swift components" 2 chore \
  "Tests for LandmarkStabilizer, RecognitionStateMachine, ASLClassifierManager. Target >=80% coverage for core logic."
T371="$ID_LAST"
bd dep add "$T371" "$E37"
bd dep add "$T371" "$T343"

create "3.7.2: Create integration tests for full pipeline" 2 chore \
  "Test harness with synthetic landmarks, personalization test, 5-minute stress test for memory stability."
T372="$ID_LAST"
bd dep add "$T372" "$E37"
bd dep add "$T372" "$T365"

create "3.7.3: Optimize for real-time performance" 2 chore \
  "Profile with Instruments, verify Neural Engine utilization, optimize memory, target <100ms latency and <50MB memory."
T373="$ID_LAST"
bd dep add "$T373" "$E37"
bd dep add "$T373" "$T372"

create "3.7.4: Test on target device range" 2 chore \
  "Test matrix: iPhone XS (A12), iPhone 12 (A14), iPhone 15 Pro (A17). Verify 30fps, accuracy, battery drain."
T374="$ID_LAST"
bd dep add "$T374" "$E37"
bd dep add "$T374" "$T373"

# --- Labels ---
echo "Adding labels..."
for id in "$T311" "$T312" "$T313" "$T321" "$T322" "$T323" "$T331" "$T332" "$T333" "$T334" \
          "$T341" "$T342" "$T343" "$T351" "$T352" "$T353" "$T360" "$T361" "$T362" "$T363" "$T364" "$T365" \
          "$T371" "$T372" "$T373" "$T374"; do
  bd label add "$id" phase-3 2>/dev/null || true
done
bd label add "$T360" data 2>/dev/null || true
bd label add "$T311" expo-module swift ios 2>/dev/null || true
bd label add "$T312" typescript types 2>/dev/null || true
bd label add "$T313" ios permissions 2>/dev/null || true
bd label add "$T321" ios camera avfoundation 2>/dev/null || true
bd label add "$T322" vision hand-pose ios 2>/dev/null || true
bd label add "$T323" vision stabilization 2>/dev/null || true
bd label add "$T331" coreml architecture 2>/dev/null || true
bd label add "$T332" ml-training data-prep 2>/dev/null || true
bd label add "$T333" coreml training 2>/dev/null || true
bd label add "$T334" coreml updatable 2>/dev/null || true
bd label add "$T341" coreml inference 2>/dev/null || true
bd label add "$T342" state-machine recognition 2>/dev/null || true
bd label add "$T343" pipeline integration 2>/dev/null || true
bd label add "$T351" personalization storage 2>/dev/null || true
bd label add "$T352" mlupdatetask training 2>/dev/null || true
bd label add "$T353" reset cleanup 2>/dev/null || true
bd label add "$T361" react-native view 2>/dev/null || true
bd label add "$T362" events bridge 2>/dev/null || true
bd label add "$T363" hooks react-native 2>/dev/null || true
bd label add "$T364" ui practice 2>/dev/null || true
bd label add "$T365" ui personalization 2>/dev/null || true
bd label add "$T371" testing unit 2>/dev/null || true
bd label add "$T372" testing integration 2>/dev/null || true
bd label add "$T373" performance optimization 2>/dev/null || true
bd label add "$T374" testing devices 2>/dev/null || true

echo ""
echo "Done. Phase 3 epic: $P3"
echo "Run: bd ready    # see what to work on next"
echo "Run: bd list     # list all issues"
