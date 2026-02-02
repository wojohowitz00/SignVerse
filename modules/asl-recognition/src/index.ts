/**
 * ASL Recognition Expo Module
 * On-device ASL fingerspelling recognition using iOS Vision + Core ML.
 * Native module loaded via requireNativeModule; types below for 3.1.2.
 */
import { requireNativeModule } from 'expo-modules-core';

const ASLRecognitionModule = requireNativeModule('ASLRecognitionModule');

export { ASLRecognitionModule };

export type HandLandmark = {
  x: number;
  y: number;
  z: number;
  confidence?: number;
};

export type HandPose = {
  landmarks: HandLandmark[];
};

export type RecognitionResult = {
  sign: string;
  confidence: number;
  landmarks?: HandPose;
};

export type ASLRecognitionConfig = {
  minConfidence?: number;
  stabilizationFrames?: number;
};
