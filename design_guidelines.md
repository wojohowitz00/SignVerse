# ASL Learning App - Design Guidelines

## Brand Identity

**Purpose**: Empower adults learning ASL through immersive, offline-first conversation practice with AI partners.

**Aesthetic Direction**: Soft/approachable with educational clarity
- Calm, encouraging atmosphere that feels like a patient practice partner
- Visual hierarchy emphasizes the avatar/signing demonstrations
- Generous whitespace allows focus on hand movements and facial expressions
- Warm, accessible tone—never clinical or intimidating

**Memorable Element**: Large, centered avatar demonstrations with crystal-clear hand visibility against simplified backgrounds. The signing avatar is always the hero of every screen.

## Navigation Architecture

**Root Navigation**: Tab Bar (4 tabs)
- **Practice** (home icon) - Main conversation scenarios
- **Vocabulary** (book icon) - Word/phrase library
- **Progress** (chart icon) - Learning analytics
- **Profile** (user icon) - Settings and preferences

**No Authentication Required** - Single-user, offline-first app with local profile customization

## Screen-by-Screen Specifications

### Practice Screen (Home Tab)
**Purpose**: Select conversation scenarios and start immersive practice sessions

**Layout**:
- Transparent header with right button (info icon for app guidance)
- Scrollable card grid of 5 scenario cards
- Safe area: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Scenario cards (2-column grid on larger phones, single column on small):
  - Illustration representing scenario
  - Scenario name (e.g., "At Home", "Doctor Visit")
  - Subtitle showing # of conversations available
  - Subtle tap feedback

### Conversation Screen (Modal from Practice)
**Purpose**: Interactive signing practice with AI partner

**Layout**:
- Custom header: back button (left), scenario name (center), camera toggle (right)
- Main area: Avatar display (60% of screen height)
- Bottom area: Conversation controls and user's sign input preview
- Safe area: top = insets.top + Spacing.xl, bottom = insets.bottom + Spacing.xl

**Components**:
- Large 3D avatar or video player showing signs
- Conversation text caption below avatar
- Floating record button (camera icon) to capture user's signing
- Side-by-side comparison view when user signs

### Vocabulary Screen (Vocabulary Tab)
**Purpose**: Browse and practice individual ASL signs by category

**Layout**:
- Header with search bar and filter button (right)
- Scrollable list grouped by frequency/category
- Safe area: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Search bar in header
- Category sections (Common, Home, Medical, etc.)
- Sign cards showing:
  - Thumbnail of sign
  - English word/phrase
  - Difficulty indicator
  - Tap to view full demonstration

**Empty State**: "empty-vocabulary.png" - illustration of open hands ready to learn

### Sign Detail Screen (Modal from Vocabulary)
**Purpose**: View full sign demonstration and practice

**Layout**:
- Header: back button, word/phrase, favorite button (right)
- Avatar demonstration area (70% screen)
- Replay controls and speed adjustment
- "Practice" button triggering camera comparison
- Safe area: top = insets.top + Spacing.xl, bottom = insets.bottom + Spacing.xl

### Grammar Lessons Screen (Stack from Vocabulary)
**Purpose**: Learn ASL grammar rules and sentence structure

**Layout**:
- Standard header: "Grammar Lessons"
- Scrollable list of lesson cards
- Safe area: top = Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Lesson cards with:
  - Lesson title
  - Progress indicator (if started)
  - Duration estimate
  - Difficulty badge

### Progress Screen (Progress Tab)
**Purpose**: View learning statistics and achievements

**Layout**:
- Transparent header
- Scrollable dashboard with stats cards
- Safe area: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Summary cards: signs learned, practice time, conversations completed
- Weekly practice chart
- Recent achievements list

### Profile Screen (Profile Tab)
**Purpose**: User customization and app settings

**Layout**:
- Transparent header
- Scrollable form
- Safe area: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Avatar selection (custom preset)
- Display name field
- Theme preference toggle
- Notification settings
- Model management (download/delete AI models)

## Color Palette

**Primary**: #4A90E2 (Calm blue - trust, clarity)
**Primary Dark**: #2E5F8F
**Accent**: #F4A460 (Warm sandy orange - encouragement)
**Background**: #FAFBFC (Off-white with slight warmth)
**Surface**: #FFFFFF
**Surface Secondary**: #F0F2F5
**Text Primary**: #1C2833
**Text Secondary**: #5D6D7E
**Success**: #52C693
**Warning**: #FFB347
**Error**: #E74C3C
**Border**: #D5DBDB

## Typography

**Font**: System default (SF Pro for iOS, Roboto for Android) with optional Google Font pairing

**Type Scale**:
- Display: 32px, Bold (scenario titles, lesson headers)
- Title: 24px, Semibold (screen headers)
- Headline: 20px, Semibold (card titles)
- Body: 16px, Regular (descriptions, captions)
- Caption: 14px, Regular (metadata, hints)
- Small: 12px, Regular (labels)

## Visual Design

- Avatar demonstrations use clean, high-contrast backgrounds (solid color or subtle gradient)
- Touchable elements: 8dp corner radius, subtle shadow only for floating buttons
- Floating button shadow: offset (0, 2), opacity 0.10, radius 2
- Record button (camera): large circular button with Accent color, pulsing animation when active
- Cards: 12dp corner radius, soft shadow (offset 0, 4, opacity 0.08, radius 8)
- Icons: Feather icon set from @expo/vector-icons
- No emojis in UI

## Generated Assets

### Required:
- **icon.png** - App icon featuring simplified hand forming "A" in ASL
- **splash-icon.png** - Centered hand icon on calm blue background
- **empty-vocabulary.png** - Open hands gesture, welcoming illustration, used in Vocabulary screen when no signs favorited
- **empty-progress.png** - Journey/path illustration, used in Progress screen before any practice
- **avatar-preset-1.png** - Default user avatar option

### Scenario Illustrations (used in Practice screen scenario cards):
- **scenario-home.png** - Warm house/family silhouette
- **scenario-errands.png** - Shopping bag/store illustration
- **scenario-doctor.png** - Medical cross/stethoscope minimal icon
- **scenario-social.png** - People/friends gathering illustration
- **scenario-work.png** - Desk/briefcase professional illustration

### Grammar Lesson Icons (used in Grammar Lessons list):
- **grammar-sentence.png** - Abstract sentence structure diagram
- **grammar-facial.png** - Face showing expressive features
- **grammar-directional.png** - Arrows showing movement/direction

All assets: simple, friendly linework style with soft colors matching palette. Minimal detail, maximum clarity.