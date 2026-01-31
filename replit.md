# SignSpeak - ASL Learning App

## Overview
SignSpeak is an immersive ASL (American Sign Language) learning mobile app designed for adults who want to learn ASL through practical, real-world scenarios. The app focuses on offline-first functionality and uses conversation-based learning with AI-powered virtual partners.

## Key Features
- **Practice Scenarios**: 5 real-world situations (Home, Errands, Doctor, Social, Work) with 94 conversations containing 500 real-world sentences
- **Signing Demonstrations**: Animated avatar area using Lottie animations (with video support infrastructure for future ASL videos)
- **Vocabulary Builder**: 150 common ASL signs organized by category (Common, Home, Medical, Work, Errands, Social) and difficulty
- **Grammar Lessons**: 5 comprehensive lessons on ASL structure, facial grammar, directional verbs, spatial referencing, and negation
- **Progress Tracking**: Track signs learned, conversations completed, practice time, and streaks
- **Offline-First**: All learning content stored locally using AsyncStorage

## Signing Demonstration System
The app includes a SigningDemoPlayer component that supports:
- **Lottie Animations**: JSON-based animations created in After Effects and exported via Bodymovin
- **Video Support**: Infrastructure ready for real ASL signing videos (WLASL, How2Sign datasets)
- **Placeholder Mode**: Animated hand icons when no animation/video is available

### Creating New Lottie Animations
1. Design hand/arm animations in Adobe After Effects
2. Export using the Bodymovin plugin to JSON format
3. Or use LottieFiles online editor for simpler animations
4. Place JSON files in `assets/animations/` directory
5. Import and use in SigningDemoPlayer component

## Architecture

### Frontend (Expo React Native)
- **Navigation**: React Navigation 7 with bottom tabs (Practice, Vocabulary, Progress, Profile)
- **State Management**: AsyncStorage for persistent data, React Query for API calls
- **Styling**: Custom theme system with light/dark mode support

### Backend (Express.js)
- Minimal backend for landing page and optional cloud sync
- Static Expo manifest serving for mobile app distribution

### Data Storage
- **AsyncStorage Keys**:
  - `@signspeak_progress`: User learning progress
  - `@signspeak_profile`: User profile settings
  - `@signspeak_vocabulary`: Vocabulary with favorites/learned status
  - `@signspeak_grammar`: Grammar lesson progress

## Project Structure
```
client/
├── components/         # Reusable UI components
├── constants/          # Theme, colors, spacing
├── data/              # Static data (scenarios, vocabulary, grammar)
├── hooks/             # Custom hooks (useStorage, useTheme)
├── navigation/        # React Navigation setup
├── screens/           # Screen components
├── types/             # TypeScript interfaces
└── lib/               # Utilities

server/
├── index.ts           # Express server setup
├── routes.ts          # API routes
└── templates/         # Landing page HTML
```

## Running the App
- **Frontend**: `npm run expo:dev` (port 8081)
- **Backend**: `npm run server:dev` (port 5000)

## Design Guidelines
- Primary color: #4A90E2 (calm blue)
- Accent color: #F4A460 (warm sandy orange)
- Focus on avatar/signing demonstrations as visual heroes
- Generous whitespace for clear hand visibility
- Warm, accessible, encouraging tone

## User Preferences
- No emojis in UI
- Offline-first functionality preferred
- Simple, intuitive navigation
- Focus on immersive learning through conversation practice
