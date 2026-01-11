# SignVerse

An iOS app for learning American Sign Language (ASL) through immersive, AI-powered conversations.

## Purpose

SignVerse helps post-laryngectomy individuals learn ASL through simulated immersion, starting with everyday home conversations and progressing to community and professional interactions.

## Core Concept: "The Learning Mirror"

- **Reference Display**: Pre-recorded video of native ASL signer demonstrating signs
- **Your Camera**: Live feed with hand tracking overlay (21 keypoints)
- **Interaction**: Watch demo → Practice sign → Get real-time feedback → Track progress

> **Design Decision**: MVP uses pre-recorded video instead of 3D avatars to avoid uncanny valley effects and validate learning approach before investing in complex avatar technology. See [Research/MVP_Plan_v2.md](Research/MVP_Plan_v2.md) for rationale.

## MVP: "Home Base" (4 Core Scenarios)

| # | Scenario | Signs | Complexity |
|---|----------|-------|------------|
| 1 | **Fingerspelling** | A-Z (26 letters) | Low - static poses |
| 2 | **Needs Check** | TIRED, HUNGRY, PAIN, OKAY, THIRSTY | Medium |
| 3 | **Requests** | WATER, COFFEE, HELP, PLEASE, THANK-YOU | Medium |
| 4 | **Affection** | LOVE, HUG, GOOD, YES, NO | Medium |

**Total MVP vocabulary**: 26 letters + 15 words = 41 signs

> **Safety Note**: Emergency scenarios (HELP, CALL DOCTOR, CAN'T BREATHE) are intentionally excluded from MVP. Recognition accuracy must exceed 99% for safety-critical signs before inclusion. See [Research/Risk_Analysis.md](Research/Risk_Analysis.md) for details.

## Tech Stack

### MVP: Pure iOS (No 3D Frameworks)

| Component | Technology | Purpose |
|-----------|------------|---------|
| UI | SwiftUI | Modern declarative interface |
| Hand Tracking | Vision Framework | 21-keypoint hand pose detection |
| ML Inference | CoreML | On-device gesture recognition |
| Camera | AVFoundation | Live camera feed |
| Video Playback | AVPlayer | Sign demonstration videos |
| Storage | UserDefaults + FileManager | Local progress tracking |

> **Note**: Unity and RealityKit are intentionally excluded from MVP. Video-only approach validates learning effectiveness before investing in 3D complexity.

### Backend (Optional for MVP)
- **Supabase**: Anonymized analytics only (if user consents)
- **Local-first**: All progress stored on-device

### AI/ML Models

#### Recognition (Your Signing → App)
- **Primary**: Apple Vision Framework Hand Pose
- **Training Data Sources**:
  - **ASL Alphabet (NIH)**: 26K images for fingerspelling
  - **WLASL**: 21K videos, 2K common words

#### Demonstration (App → You)
- **MVP Approach**: Pre-recorded videos of native ASL signer
- **Benefits**: Authentic signing, natural facial expressions, no uncanny valley
- **Future (v2.0+)**: RealityKit avatar if video approach needs enhancement

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    iOS App (SwiftUI)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 SPLIT-SCREEN VIEW                    │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │           VIDEO PLAYER (Top)                 │   │   │
│  │  │   Pre-recorded sign demonstration            │   │   │
│  │  │   [Slow-mo] [Loop] [Next Sign]              │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │           CAMERA VIEW (Bottom)              │   │   │
│  │  │   Live feed + skeleton overlay              │   │   │
│  │  │   Confidence: 87% → WATER ✓                │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Camera     │───>│   Vision     │───>│   Gesture    │  │
│  │   Capture    │    │   Framework  │    │   Recognizer │  │
│  │ (AVFoundation)    │ (21 keypoints)    │   (CoreML)   │  │
│  └──────────────┘    └──────────────┘    └──────┬───────┘  │
│                                                  │          │
│                                         Recognized Sign     │
│                                                  │          │
│  ┌───────────────────────────────────────────────▼───────┐ │
│  │                  LEARNING ENGINE                       │ │
│  │  • Spaced repetition scheduling                        │ │
│  │  • Progress tracking (local)                           │ │
│  │  • Conversation flow (pre-scripted)                    │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
SignVerse/
├── iOS/                          # Native iOS app (MVP)
│   ├── SignVerse/                # Main app target
│   │   ├── App/                  # App entry point
│   │   ├── Views/                # SwiftUI views
│   │   │   ├── ConsentView.swift     # Biometric consent (REQUIRED)
│   │   │   ├── PracticeView.swift    # Main practice screen
│   │   │   ├── VideoPlayerView.swift # Sign demonstration
│   │   │   └── ProgressView.swift    # Progress dashboard
│   │   ├── Vision/               # Hand tracking
│   │   │   ├── HandPoseDetector.swift
│   │   │   ├── GestureRecognizer.swift
│   │   │   └── KeypointSmoother.swift
│   │   ├── Models/               # Data models
│   │   │   ├── Sign.swift
│   │   │   ├── Scenario.swift
│   │   │   └── LearningProgress.swift
│   │   ├── Learning/             # Learning engine
│   │   │   ├── SpacedRepetition.swift
│   │   │   └── ConversationFlow.swift
│   │   └── Resources/            # Video content
│   │       ├── Alphabet/         # A-Z reference videos
│   │       └── Signs/            # Motion sign videos
│   └── SignVerseTests/           # Unit tests
├── Content/                      # Sign demonstration videos
│   ├── Alphabet/                 # A-Z fingerspelling videos
│   ├── Signs/                    # Motion sign videos
│   └── Conversations/            # Scenario conversation videos
├── Data/                         # ML datasets & models
│   ├── Training/
│   │   ├── ASL_Alphabet/         # NIH dataset (reference)
│   │   └── Custom/               # User-collected data (future)
│   └── Models/
│       └── gesture_recognizer.mlmodel
├── Research/                     # Documentation
│   ├── MVP_Plan_v2.md            # Current MVP plan
│   └── Risk_Analysis.md          # Security & privacy analysis
├── Scripts/                      # Utility scripts
│   └── process_landmarks.py      # Convert videos to keypoints
└── .beads/                       # Project tracking
```

> **Note**: No Unity directory. MVP is pure iOS with video content.

## Development Phases (Revised v2.1)

> **Architecture**: Pure iOS with video-only demonstrations. No Unity, no RealityKit for MVP. See [Research/MVP_Plan_v2.md](Research/MVP_Plan_v2.md) for complete details.

### Phase 0: Technical Validation (Week 1)
**Goal**: Prove core technology works before building features
- [ ] Test Vision Framework hand tracking in home lighting
- [ ] Build camera + video split-screen prototype
- [ ] Record 5 sample sign videos
- [ ] Validate video playback quality

**Go/No-Go**: Must pass all validation criteria before Phase 1

### Phase 1: Fingerspelling Foundation (Weeks 2-3)
**Goal**: Complete A-Z fingerspelling with real-time feedback
- [ ] Static pose recognition for 26 letters
- [ ] Reference images/video for each letter
- [ ] >90% accuracy on fingerspelling
- [ ] Basic practice UI with feedback

**Why Start Here**: Single-hand static poses avoid occlusion issues, well-solved problem with existing datasets, immediately useful for spelling names.

### Phase 2: Motion Signs (Weeks 4-6)
**Goal**: Add 15 motion-based signs for home communication
- [ ] Motion recognition for selected signs
- [ ] Pre-recorded reference videos (native signer)
- [ ] Occlusion handling strategies for two-handed signs
- [ ] >95% accuracy on motion signs

### Phase 3: Learning Loop (Weeks 7-9)
**Goal**: Gamified practice with progress tracking
- [ ] Spaced repetition system (local)
- [ ] Progress dashboard
- [ ] Daily practice streaks
- [ ] Optional anonymized analytics (with consent)

### Phase 4: Conversation Mode (Weeks 10-14)
**Goal**: Two-way practice with simulated conversations
- [ ] Pre-scripted conversation trees (NOT LLM)
- [ ] 4 complete conversation scenarios
- [ ] Response recognition and feedback
- [ ] Practice history per scenario

**Note**: LLM integration deferred to v2.0 (requires ASL gloss fine-tuning)

## Getting Started

### Prerequisites
- macOS 14.0+ (for development)
- Xcode 15.0+
- iOS 17.0+ device (iPhone 12 or later recommended for hand tracking)
- iPhone camera for recording sign videos (optional: hire ASL tutor)

### Installation
```bash
# Clone repository
git clone https://github.com/[username]/SignVerse.git
cd SignVerse

# Open iOS project in Xcode
cd iOS
open SignVerse.xcodeproj
```

### Configuration
1. Set your Apple Developer Team in Xcode signing settings
2. Connect iOS device and build to device (hand tracking requires physical device)
3. Grant camera permissions when prompted

## Data Collection Strategy

### What We Save
```json
{
  "user_id": "uuid",
  "scenario_id": "needs_check",
  "intended_sign": "WATER",
  "timestamp": 1234567890,
  "was_correct": true,
  "landmarks": [
    [{"x": 0.5, "y": 0.3, "z": 0.0}, ...],  // Frame 1 (21 points)
    [{"x": 0.5, "y": 0.4, "z": 0.1}, ...]   // Frame 2
  ]
}
```

### Privacy-First Architecture

> **Critical**: Hand skeletal data is biometrically identifiable. See [Research/Risk_Analysis.md](Research/Risk_Analysis.md) for full privacy analysis.

**Biometric Consent Required**:
- Explicit disclosure that hand patterns can identify individuals
- User must consent before any camera access
- Clear explanation of what data is/isn't collected

**Data Protection**:
- **On-Device Processing**: All recognition via CoreML (never leaves device)
- **No Raw Upload**: Only aggregated, anonymized learning metrics (if opted in)
- **Differential Privacy**: Noise added to any shared coordinates
- **User Control**: View, export, delete all data anytime
- **No Video**: Only skeletal coordinates, never images/video

## Research Integration

This project leverages cutting-edge ASL research:

- **Datasets**: WLASL (2K words), How2Sign (80h continuous), ASL 1000
- **Models**: SignLLM (BLEU 20.09), Vision Transformers (92.64% accuracy)
- **Frameworks**: Georgia Tech CATS Gesture Toolkit
- **Generation**: SignDiff diffusion models, Apple AI Sign Generation

See `/Research` directory for detailed documentation.

## Accessibility Features

### For You (Post-Laryngectomy)
- **Voice-to-Sign Bridge**: Family speaks → Avatar signs
- **Sign-to-Voice**: You sign → Avatar speaks (for family)
- **Facial Expression Trainer**: 70% of ASL is face/body language
- **Progress Dashboard**: Track daily practice and mastery

### Universal Design
- Left-handed mode support
- Adjustable lighting compensation
- Slow-motion replay
- Text captions for all signs

## Contributing

This is a personal learning tool, but contributions welcome:
1. ASL animations for common phrases
2. Scenario suggestions
3. Accessibility improvements
4. Dataset contributions (with consent)

## License

MIT License - See LICENSE file

## Acknowledgments

- **Georgia Tech CATS**: Gesture toolkit and research
- **WLASL**: Open-source ASL dataset
- **Apple**: Vision Framework documentation
- **ASL Community**: For feedback and guidance

## Roadmap

### MVP (v1.0) - 14 Weeks
- [ ] Phase 0: Technical Validation
- [ ] Phase 1: Fingerspelling (A-Z)
- [ ] Phase 2: Motion Signs (15 signs)
- [ ] Phase 3: Learning Loop
- [ ] Phase 4: Conversation Mode (pre-scripted)

### Post-MVP (v2.0+)
- [ ] Emergency scenarios (requires >99% accuracy)
- [ ] 3D Avatar (Unity) - if video validates learning
- [ ] LLM conversation integration (with ASL gloss fine-tuning)
- [ ] Expanded vocabulary (100+ signs)
- [ ] Multi-user mode (family learning together)
- [ ] watchOS companion app (quick phrases)

### Future Vision
- [ ] Community Scenarios (shopping, restaurants)
- [ ] Professional Scenarios (workplace, medical)
- [ ] Offline mode (full on-device)
- [ ] Voice-to-Sign bridge (family speaks → avatar signs)

## Documentation

| Document | Description |
|----------|-------------|
| [Research/MVP_Plan_v2.md](Research/MVP_Plan_v2.md) | Detailed MVP plan with Go/No-Go criteria |
| [Research/Risk_Analysis.md](Research/Risk_Analysis.md) | Security, privacy, and technical risks |

---

**Built with care for real-world communication needs**
