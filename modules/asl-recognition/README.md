# asl-recognition

Expo module for on-device ASL fingerspelling recognition (iOS only).

- **Vision**: `VNDetectHumanHandPoseRequest` for 21 hand landmarks (tasks 3.2.x).
- **Core ML**: ASL classifier and `MLUpdateTask` personalization (tasks 3.3.x, 3.4.x, 3.5.x).

## Setup

- Linked via `package.json`: `"asl-recognition": "file:./modules/asl-recognition"`.
- Run `npx expo prebuild --platform ios` then `cd ios && pod install` to link native code.
- Requires iOS 14+, Xcode, and CocoaPods.

## Usage (after 3.1.2 and native implementation)

```ts
import { ASLRecognitionModule } from 'asl-recognition';

const ready = ASLRecognitionModule.isModelReady();
await ASLRecognitionModule.startRecognition({ minConfidence: 0.8 });
```
