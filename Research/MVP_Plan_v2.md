# SignVerse MVP Plan v2.1
## Video-Only, Risk-Mitigated Approach

**Version**: 2.1
**Date**: 2026-01-10
**Status**: Approved

---

## Executive Summary

This plan uses a **video-only approach** for sign demonstrations - no 3D avatars in MVP. This dramatically simplifies development while providing authentic, effective learning content.

| Issue | Original Risk | Mitigation |
|-------|---------------|------------|
| Biometric privacy | Legal liability | Explicit consent + differential privacy |
| Emergency scenario | Safety liability | **Removed from MVP** |
| 3D Avatar complexity | Development time, uncanny valley | **Video-only for MVP** |
| Hand occlusion | Core functionality | Start with fingerspelling (no occlusion) |
| Unrealistic timeline | Project failure | Phase gates with go/no-go decisions |

**Key Decisions**:
1. **Video-only**: Pre-recorded videos of native signer (no Unity, no RealityKit for MVP)
2. **Scope reduction**: 4 scenarios (emergency removed)
3. **Privacy-first**: Biometric consent + on-device processing
4. **Go/No-Go gates**: Each phase has exit criteria before proceeding
5. **Pure iOS**: SwiftUI + AVFoundation + Vision Framework only

---

## Revised Core Concept: "The Learning Mirror"

### What Changed
- **Removed**: "Emergency" scenario (liability too high)
- **Added**: Explicit biometric data consent flow
- **Simplified**: Start with fingerspelling, not full signs

### MVP Scenarios (4, not 5)

| # | Scenario | Signs | Complexity |
|---|----------|-------|------------|
| 1 | **Fingerspelling** | A-Z (26) | Low - static poses |
| 2 | **Needs Check** | TIRED, HUNGRY, PAIN, OKAY, THIRSTY | Medium - single motion |
| 3 | **Requests** | WATER, COFFEE, HELP, PLEASE, THANK-YOU | Medium - single motion |
| 4 | **Affection** | LOVE, HUG, GOOD, YES, NO | Medium - some two-handed |

**Total MVP vocabulary**: 26 letters + 15 words = 41 signs

### Why Emergency Was Removed

```
RISK ASSESSMENT: Emergency Scenario
─────────────────────────────────────
Scenario: User signs "HELP" in medical emergency
Recognition accuracy needed: >99.9%
Current achievable accuracy: ~85%
Failure mode: User believes help is coming, no one responds
Liability: Potentially life-threatening

DECISION: Remove until recognition exceeds 99% on safety-critical signs
         Add back in v2.0 with redundant safety systems
─────────────────────────────────────
```

---

## Revised Architecture

### Privacy-First Design

```
┌─────────────────────────────────────────────────────────────┐
│                    PRIVACY ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ON-DEVICE ONLY    ┌──────────────────┐ │
│  │   Camera     │───────────────────────│  Vision          │ │
│  │   Feed       │   Never leaves        │  Framework       │ │
│  └──────────────┘   device              └────────┬─────────┘ │
│                                                   │          │
│                                          21 Keypoints        │
│                                                   │          │
│  ┌────────────────────────────────────────────────▼───────┐ │
│  │              ON-DEVICE ML INFERENCE                     │ │
│  │         (CoreML - no network required)                  │ │
│  └────────────────────────────────────────────────┬───────┘ │
│                                                   │          │
│                                          Recognized Sign     │
│                                                   │          │
│  ┌────────────────────────────────────────────────▼───────┐ │
│  │              DIFFERENTIAL PRIVACY LAYER                 │ │
│  │   • Add noise to skeletal coordinates                   │ │
│  │   • Aggregate before upload (no individual samples)     │ │
│  │   • User controls: Opt-in, delete anytime               │ │
│  └────────────────────────────────────────────────┬───────┘ │
│                                                   │          │
│                          OPTIONAL (user consent)  │          │
│                                                   ▼          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                 SUPABASE (encrypted)                    ││
│  │   • Aggregated learning metrics only                    ││
│  │   • No raw skeletal data in MVP                         ││
│  │   • Progress tracking (sign attempts, accuracy)         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Biometric Consent Flow (Required)

```swift
// MUST show before ANY camera access
struct BiometricConsentView: View {
    var body: some View {
        VStack {
            Text("Important Privacy Information")
                .font(.title)

            Text("""
            SignVerse uses hand tracking to help you learn ASL.

            ⚠️ BIOMETRIC DATA NOTICE:
            Hand movement patterns can uniquely identify individuals,
            similar to fingerprints.

            What we do:
            ✓ Process hand tracking ON YOUR DEVICE only
            ✓ Never upload video or images
            ✓ Add noise to any shared data (differential privacy)
            ✓ Let you delete all data anytime

            What we DON'T do:
            ✗ Never share raw hand coordinates
            ✗ Never sell or share biometric data
            ✗ Never use data for identification
            """)

            Toggle("I understand this is biometric data", isOn: $understood)
            Toggle("I consent to on-device hand tracking", isOn: $consentTracking)
            Toggle("I consent to sharing anonymized learning progress", isOn: $consentSharing)
        }
    }
}
```

---

## Revised Phases

### Phase 0: Technical Validation (Week 1)
**Goal**: Prove core technology works BEFORE building features

**Architecture**: Pure iOS (no Unity, no RealityKit)
- SwiftUI for UI
- AVFoundation + AVPlayer for video playback
- Vision Framework for hand tracking
- CoreML for gesture recognition

#### 0.1 Hand Tracking Test
```
GO/NO-GO CRITERIA:
─────────────────────────────────
□ Vision Framework detects hand in kitchen lighting
□ 21 keypoints tracked at >25 FPS
□ Static fingerspelling poses recognized >90%
□ Works with your specific hand characteristics
□ Camera + skeleton overlay displays smoothly

IF FAIL → Evaluate MediaPipe or custom model
─────────────────────────────────
```

#### 0.2 Video Playback Test
```
GO/NO-GO CRITERIA:
─────────────────────────────────
□ Video plays smoothly in split-screen with camera
□ Slow-motion playback works (0.5x speed)
□ Loop/replay controls responsive
□ Memory stable during extended use (<200MB)

IF FAIL → Optimize video encoding/compression
─────────────────────────────────
```

#### 0.3 Sample Content Creation
```
VALIDATION:
─────────────────────────────────
□ Record 5 sample sign videos (yourself or family)
□ Videos are clear and demonstrate signs effectively
□ Lighting works in intended practice locations
□ Video quality sufficient for learning

OUTPUT: Proof that video-based approach is viable
─────────────────────────────────
```

**Deliverables**:
- Working prototype: camera + video split-screen
- Hand tracking overlay demonstration
- 5 sample sign videos
- Go/No-Go decision for Phase 1

---

### Phase 1: Fingerspelling Foundation (Weeks 2-3)
**Goal**: Complete A-Z fingerspelling with real-time feedback

#### Why Start Here
1. **No occlusion**: Single-hand static poses
2. **Well-solved problem**: Existing datasets (ASL Alphabet: 26K images)
3. **Immediate utility**: Spell names, unknown words
4. **Measurable**: Clear accuracy metrics (26 classes)

#### Implementation

```
┌─────────────────────────────────────────┐
│         FINGERSPELLING MVP              │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      REFERENCE DISPLAY          │   │
│  │   ┌───┐                         │   │
│  │   │ A │  "Show me the letter A" │   │
│  │   └───┘                         │   │
│  │   [Static hand image]           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      YOUR CAMERA                │   │
│  │                                 │   │
│  │   [Live feed + skeleton overlay]│   │
│  │                                 │   │
│  │   Confidence: 87% → A ✓        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [←Previous]  [Hint]  [Next→]          │
│                                         │
└─────────────────────────────────────────┘
```

#### Technical Approach

```swift
// Simplified recognition for static poses
class FingerspellingRecognizer {
    // Use cosine similarity between current pose and reference poses
    // No temporal modeling needed for static letters

    func recognize(landmarks: [CGPoint]) -> (letter: Character, confidence: Float) {
        var bestMatch: Character = "?"
        var bestScore: Float = 0

        for (letter, reference) in referenceLetters {
            let score = cosineSimilarity(
                normalize(landmarks),
                normalize(reference)
            )
            if score > bestScore {
                bestScore = score
                bestMatch = letter
            }
        }

        return (bestMatch, bestScore)
    }
}
```

**Deliverables**:
- Working fingerspelling practice mode
- >90% accuracy on A-Z static poses
- Basic progress tracking (local only)

**Go/No-Go for Phase 2**:
```
□ User can practice A-Z in home lighting
□ Recognition accuracy >90% for static poses
□ Latency <200ms from pose to feedback
□ User feedback: "This is useful for spelling"
```

---

### Phase 2: Motion Signs (Weeks 4-6)
**Goal**: Add 15 motion-based signs for home communication

#### Sign Selection Criteria
1. **Single-handed preferred** (reduce occlusion)
2. **Distinct motion paths** (reduce confusion)
3. **High daily utility** (validation from user)

#### MVP Sign List

| Sign | Type | Motion | Occlusion Risk |
|------|------|--------|----------------|
| WATER | 1-hand | W-tap chin | Low |
| COFFEE | 2-hand | Grind motion | Medium |
| TIRED | 2-hand | Chest droop | Medium |
| HUNGRY | 1-hand | C-down chest | Low |
| PAIN | 2-hand | Point twist | Medium |
| OKAY | 1-hand | O-K shape | Low |
| THIRSTY | 1-hand | 1-down throat | Low |
| HELP | 2-hand | A-lift palm | Medium |
| PLEASE | 1-hand | Circle chest | Low |
| THANK-YOU | 1-hand | Chin-forward | Low |
| LOVE | 2-hand | Cross chest | **High** |
| HUG | 2-hand | Self-embrace | **High** |
| GOOD | 1-hand | Chin-palm down | Low |
| YES | 1-hand | S-nod | Low |
| NO | 1-hand | 2-snap | Low |

#### Handling High-Occlusion Signs

```swift
// For signs like LOVE and HUG where hands overlap
class OcclusionHandler {
    enum Strategy {
        case requireVisibleHand    // Only track dominant hand
        case useBodyPose           // Fall back to shoulder/elbow
        case temporalCompletion    // Predict from motion start
    }

    func handleOcclusion(for sign: Sign) -> Strategy {
        switch sign.occlusionRisk {
        case .high:
            // Accept partial recognition with lower confidence threshold
            return .temporalCompletion
        case .medium, .low:
            return .requireVisibleHand
        }
    }
}
```

#### Video Content Strategy

```
DECISION: Video-Only (Confirmed)
─────────────────────────────────
Pre-recorded videos of native ASL signer

ADVANTAGES:
✓ Authentic human signing (no uncanny valley)
✓ Natural facial expressions (critical for ASL)
✓ Fast to produce ($0-500 total)
✓ Proven effective (how most ASL apps work)
✓ Simple implementation (just AVPlayer)
✓ No 3D framework complexity

CONTENT PLAN:
• Self-record OR hire ASL tutor for 2-3 hours
• 41 signs × 10-15 seconds each = ~10 minutes of video
• Multiple angles for complex signs
• Slow-motion versions for detailed study

APP SIZE IMPACT:
• ~5MB per sign (compressed H.264)
• 41 signs = ~200MB
• Can stream from CDN if size is concern
─────────────────────────────────
```

**Deliverables**:
- 15 motion signs with recognition
- Reference videos (not 3D avatars) for demonstration
- Practice mode with feedback
- Basic spaced repetition for review

**Go/No-Go for Phase 3**:
```
□ 15 signs recognized >95% accuracy
□ User can have basic "conversation" with family
□ Motion signs feel natural to perform
□ Family members can understand user's signs
```

---

### Phase 3: Learning Loop (Weeks 7-9)
**Goal**: Gamified practice with progress tracking

#### Learning System Design

```
┌─────────────────────────────────────────────────────────────┐
│                  SPACED REPETITION SYSTEM                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Sign: WATER                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Accuracy History: [95%] [88%] [92%] [97%] [94%]     │   │
│  │ Current Interval: 3 days                             │   │
│  │ Next Review: Tomorrow                                │   │
│  │ Difficulty: Easy (graduating soon)                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Sign: COFFEE                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Accuracy History: [45%] [52%] [48%] [61%]           │   │
│  │ Current Interval: 1 day                              │   │
│  │ Next Review: Today (overdue)                         │   │
│  │ Difficulty: Hard (needs practice)                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Today's Practice:                                          │
│  [■■■■■■░░░░] 6/10 signs reviewed                          │
│                                                             │
│  Streak: 🔥 7 days                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Progress Metrics (All Local)

```swift
struct LearningProgress: Codable {
    var signAttempts: [String: [Attempt]]
    var dailyStreak: Int
    var totalPracticeMinutes: Int
    var masteredSigns: Set<String>  // >90% over 5 sessions
    var struggingSigns: Set<String> // <70% over 3 sessions

    struct Attempt: Codable {
        let timestamp: Date
        let accuracy: Float
        let latency: TimeInterval  // Time to form sign
        let hints: Int             // How many hints needed
    }
}
```

#### Optional: Anonymous Analytics (Consent Required)

```swift
// Only if user opts in during biometric consent
struct AnonymousAnalytics {
    // Aggregated, not individual
    func reportSessionEnd() {
        let payload = [
            "session_duration_bucket": bucket(sessionMinutes), // "5-10min"
            "signs_practiced_bucket": bucket(signCount),       // "10-20"
            "avg_accuracy_bucket": bucket(avgAccuracy),        // "80-90%"
            "app_version": appVersion
        ]
        // No user ID, no timestamps, no raw accuracy values
        sendAnonymized(payload)
    }
}
```

**Deliverables**:
- Local spaced repetition system
- Progress dashboard
- Daily practice reminders (optional)
- Optional anonymized analytics

**Go/No-Go for Phase 4**:
```
□ User practices daily (>5 days/week)
□ Signs are being retained (accuracy improves over time)
□ User reports feeling more confident
□ Family communication is actually happening
```

---

### Phase 4: Conversation Mode (Weeks 10-14)
**Goal**: Two-way practice with simulated conversations

#### Conversation Flow (Pre-scripted, NOT LLM)

```
WHY NOT LLM:
─────────────────────────────────
1. LLMs generate English, not ASL gloss
2. ASL grammar is fundamentally different
3. Hallucination risk in safety-adjacent context
4. Adds complexity and latency

MVP APPROACH: Pre-scripted conversation trees
─────────────────────────────────
```

```
┌─────────────────────────────────────────────────────────────┐
│              SCENARIO: Morning Needs Check                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Video of signer]                                          │
│  "Good morning! HOW YOU FEEL?"                              │
│  (Shows: GOOD MORNING + HOW + YOU + FEEL)                   │
│                                                             │
│  Your response options:                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  TIRED  │ │ HUNGRY  │ │  PAIN   │ │  OKAY   │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
│  [Camera view - waiting for your sign]                      │
│                                                             │
│  User signs: HUNGRY                                         │
│  Recognition: ✓ HUNGRY (92% confidence)                    │
│                                                             │
│  [Video response]                                           │
│  "Okay! BREAKFAST WANT? COFFEE WANT?"                       │
│  (Shows: BREAKFAST + WANT + COFFEE + WANT)                  │
│                                                             │
│  Your response options:                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│  │ COFFEE  │ │  WATER  │ │ PLEASE  │                       │
│  └─────────┘ └─────────┘ └─────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Scenario Scripts

```yaml
# scenarios/morning_needs.yaml
scenario:
  id: morning_needs
  name: "Morning Check-In"
  description: "Practice expressing how you feel in the morning"

nodes:
  - id: greeting
    prompt_video: "videos/greeting.mp4"
    prompt_gloss: "GOOD MORNING HOW YOU FEEL"
    expected_responses:
      - sign: TIRED
        next: tired_response
      - sign: HUNGRY
        next: hungry_response
      - sign: PAIN
        next: pain_response
      - sign: OKAY
        next: okay_response

  - id: hungry_response
    prompt_video: "videos/hungry_followup.mp4"
    prompt_gloss: "BREAKFAST WANT COFFEE WANT"
    expected_responses:
      - sign: COFFEE
        next: coffee_response
      - sign: WATER
        next: water_response
      - sign: PLEASE
        next: polite_response

  # ... more nodes
```

**Deliverables**:
- 4 complete conversation scenarios
- Pre-recorded response videos
- Conversation flow engine
- Practice history per scenario

---

## Timeline Summary

```
Week 1:     Phase 0 - Technical Validation
            ├── Hand tracking in home lighting
            ├── Video playback + camera split-screen
            └── Record 5 sample sign videos
            GO/NO-GO DECISION

Weeks 2-3:  Phase 1 - Fingerspelling (A-Z)
            ├── Static pose recognition
            ├── Reference images/videos for alphabet
            └── Basic practice UI
            GO/NO-GO DECISION

Weeks 4-6:  Phase 2 - Motion Signs (15 signs)
            ├── Motion recognition
            ├── Record/source 15 sign videos
            └── Occlusion handling
            GO/NO-GO DECISION

Weeks 7-9:  Phase 3 - Learning Loop
            ├── Spaced repetition
            ├── Progress tracking
            └── Daily practice
            GO/NO-GO DECISION

Weeks 10-14: Phase 4 - Conversations
            ├── Scenario engine
            ├── Pre-scripted dialogues
            ├── Record conversation videos
            └── Two-way practice

TOTAL: 14 weeks to full MVP

TECH STACK (Simplified):
• SwiftUI (UI)
• AVFoundation (video playback)
• Vision Framework (hand tracking)
• CoreML (gesture recognition)
• NO Unity, NO RealityKit for MVP
```

---

## Risk Mitigation Summary

### P0 Issues (Addressed)

| Issue | Original | Mitigation |
|-------|----------|------------|
| Biometric privacy | No disclosure | Explicit consent + differential privacy |
| Emergency scenario | Included | **Removed from MVP** |

### P1 Issues (Eliminated)

| Issue | Original | Mitigation |
|-------|----------|------------|
| Unity-iOS stability | Complex integration | **Eliminated** - Video-only, pure iOS |
| RealityKit complexity | 3D rendering | **Eliminated** - Video-only approach |
| Hand occlusion | Full signs immediately | Start with fingerspelling, progressive complexity |
| Uncanny valley | 3D avatar | **Eliminated** - Real human in videos |

### P2 Issues (Addressed)

| Issue | Original | Mitigation |
|-------|----------|------------|
| No ASL generation model | Needed for avatar | **N/A** - Pre-recorded video |
| Dataset mismatch | Generic datasets | User's own data from Phase 3 |
| App size | Video files large | Compress H.264, optional CDN streaming |

---

## Budget Considerations

### MVP Cost (Video-Only Approach)

| Item | Cost | Notes |
|------|------|-------|
| Apple Developer Account | $99/year | Required for device testing |
| Supabase | $0 (free tier) | Sufficient for MVP |
| Video Production | $0-200 | Self-record or hire ASL tutor for 2-3 hours |
| Reference Images | $0 | Use ASL Alphabet dataset (public) |
| **Total MVP** | **~$100-300** | |

### Video Production Options

| Option | Cost | Quality | Time |
|--------|------|---------|------|
| Self-record | $0 | Learning quality | 2-4 hours |
| Family member who signs | $0 | Good | 2-4 hours |
| Hire ASL tutor | $50-100/hr | Professional | 2-3 hours |
| License existing videos | $100-500 | Professional | Immediate |

**Recommendation**: Start with self-recorded videos for Phase 0 validation. Upgrade to professional videos if app validates learning approach.

---

## Success Metrics

### MVP Success Criteria

```
MUST HAVE (Launch blockers):
□ Fingerspelling A-Z works >90% accuracy
□ 15 motion signs work >95% accuracy
□ User practices daily for 2+ weeks
□ Family members understand user's signs

SHOULD HAVE (Quality of life):
□ <200ms feedback latency
□ Works in kitchen/living room lighting
□ Progress visible and motivating
□ No crashes during 30-minute session

NICE TO HAVE (Delight):
□ Streak tracking motivates daily practice
□ Family members want to learn too
□ User recommends to others
```

### Post-MVP Metrics (v2.0 Planning)

```
□ Expand vocabulary to 100+ signs
□ Add emergency signs (with 99%+ accuracy)
□ Add family member accounts (learn together)
□ Evaluate 3D avatar (RealityKit) - only if video approach needs enhancement
□ Consider LLM integration (with proper ASL fine-tuning)
```

---

## Appendix: Removed Features (Future Versions)

### Emergency Scenario (v2.0+)
**Prerequisite**: Recognition accuracy >99% on safety signs
**Requirements**:
- Redundant confirmation (sign + button + voice if available)
- Direct 911 integration (not just "call doctor")
- Family member alert system
- Regular accuracy testing/recalibration

### LLM Conversation (v3.0+)
**Prerequisite**: Fine-tuned model on English→ASL gloss
**Requirements**:
- Training data: 10K+ parallel sentences
- Gloss accuracy validation
- Hallucination guardrails
- Latency optimization (<500ms)

### 3D Avatar (v2.0+ - Only If Needed)
**Prerequisite**: Video-based MVP validates learning approach AND users request dynamic content
**Technology**: RealityKit (Apple native) - NOT Unity
**Requirements**:
- Prove video approach works first
- User research shows demand for dynamic avatar
- Motion capture session with native ASL signer
- Performance validation on target devices

**Decision Criteria for Adding 3D**:
- Users explicitly request it
- Conversation mode needs dynamic responses
- Video library becomes unmanageable (500+ signs)

---

## Next Steps

1. **Immediate**: Implement biometric consent flow (SignVerse-rdn)
2. **Phase 0**: Test Vision Framework in your home lighting
3. **Phase 0**: Build camera + video split-screen prototype
4. **Phase 0**: Record 5 sample sign videos

**Architecture Confirmed**: Pure iOS (SwiftUI + AVFoundation + Vision Framework)
**No Unity. No RealityKit for MVP.**

**Ready to start Phase 0 validation?**
