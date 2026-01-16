import SwiftUI
import AVFoundation
import Vision

// MARK: - Main Practice View

/// Main practice view with split-screen layout showing video demonstration and user's hands
struct PracticeView: View {
    let signName: String

    @StateObject private var handPoseDetector = HandPoseDetector()
    @StateObject private var cameraManager = CameraManager()
    @State private var showCamera = true

    var body: some View {
        ZStack {
            Color(uiColor: .systemBackground)
                .ignoresSafeArea()

            VStack(spacing: 0) {
                // MARK: - Header with Sign Name
                VStack(spacing: 12) {
                    Text(signName)
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(.primary)

                    Text("Practice this sign")
                        .font(.system(size: 14, weight: .regular))
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(Color(uiColor: .secondarySystemBackground))

                // MARK: - Video Demonstration (Top Half)
                VideoPlayerView(videoName: signName)
                    .frame(maxWidth: .infinity)
                    .frame(height: 300)

                // MARK: - Divider
                Divider()
                    .frame(height: 2)
                    .background(Color(uiColor: .systemGray4))

                // MARK: - Camera with Skeleton (Bottom Half)
                ZStack {
                    if showCamera {
                        CameraPreviewView(captureSession: cameraManager.captureSession)
                            .ignoresSafeArea()
                    } else {
                        Color.black
                            .ignoresSafeArea()
                    }

                    // Skeleton overlay
                    if let landmarks = handPoseDetector.handLandmarks, !landmarks.isEmpty {
                        SkeletonOverlayView(handLandmarks: landmarks)
                    }

                    // Confidence overlay
                    VStack {
                        HStack {
                            ConfidenceIndicator(
                                confidence: handPoseDetector.confidence,
                                isDetected: handPoseDetector.isHandDetected
                            )
                            Spacer()
                        }
                        .padding(16)

                        Spacer()
                    }
                }
                .frame(maxWidth: .infinity)
                .frame(maxHeight: .infinity)
                .background(Color.black)
            }
        }
        .onAppear {
            setupHandTracking()
            cameraManager.startSession()
        }
        .onDisappear {
            cameraManager.stopSession()
        }
    }

    // MARK: - Setup Methods

    private func setupHandTracking() {
        // Connect camera frames to hand pose detector
        cameraManager.onFrame = { sampleBuffer in
            handPoseDetector.processFrame(sampleBuffer)
        }
    }
}

// MARK: - Confidence Indicator

/// Displays hand detection confidence as a visual indicator
struct ConfidenceIndicator: View {
    let confidence: Float
    let isDetected: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 6) {
                Circle()
                    .fill(isDetected ? Color.green : Color.red)
                    .frame(width: 8, height: 8)

                Text(isDetected ? "Hand Detected" : "No Hand")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.white)
            }

            if isDetected {
                Text("\(Int(confidence * 100))% confidence")
                    .font(.system(size: 11, weight: .regular))
                    .foregroundColor(.white.opacity(0.8))
            }
        }
        .padding(10)
        .background(Color.black.opacity(0.6))
        .cornerRadius(8)
    }
}

// MARK: - Skeleton Overlay View

/// Draws hand skeleton landmarks and connections on the camera view
struct SkeletonOverlayView: View {
    let handLandmarks: [CGPoint]?

    // Finger colors for visual distinction
    private let fingerColors: [Color] = [
        .green,      // Thumb
        .cyan,       // Index
        .blue,       // Middle
        .purple,     // Ring
        .red         // Pinky
    ]

    // Hand skeleton connection structure (indices into the 21-landmark array)
    // Index order: 0=Wrist, 1-4=Thumb, 5-8=Index, 9-12=Middle, 13-16=Ring, 17-20=Little
    private let handConnections: [(Int, Int)] = [
        // Wrist to finger bases
        (0, 1),   // Wrist to Thumb CMC
        (0, 5),   // Wrist to Index MCP
        (0, 9),   // Wrist to Middle MCP
        (0, 13),  // Wrist to Ring MCP
        (0, 17),  // Wrist to Little MCP

        // Thumb (indices 1-4)
        (1, 2), (2, 3), (3, 4),

        // Index finger (indices 5-8)
        (5, 6), (6, 7), (7, 8),

        // Middle finger (indices 9-12)
        (9, 10), (10, 11), (11, 12),

        // Ring finger (indices 13-16)
        (13, 14), (14, 15), (15, 16),

        // Pinky finger (indices 17-20)
        (17, 18), (18, 19), (19, 20),

        // Palm connections (across finger bases)
        (5, 9), (9, 13), (13, 17)
    ]

    var body: some View {
        Canvas { context, size in
            guard let landmarks = handLandmarks, landmarks.count >= 21 else {
                return
            }

            let bounds = CGRect(origin: .zero, size: size)

            // Draw connections first (so they appear behind the dots)
            for (startIdx, endIdx) in handConnections {
                guard startIdx < landmarks.count && endIdx < landmarks.count else {
                    continue
                }

                let startPoint = scalePoint(landmarks[startIdx], to: bounds)
                let endPoint = scalePoint(landmarks[endIdx], to: bounds)

                // Determine color based on which finger this connection belongs to
                let color = getConnectionColor(startIdx: startIdx, endIdx: endIdx)

                // Draw line
                var path = Path()
                path.move(to: startPoint)
                path.addLine(to: endPoint)

                context.stroke(
                    path,
                    with: .color(color.opacity(0.7)),
                    lineWidth: 2
                )
            }

            // Draw landmark circles
            for (index, landmark) in landmarks.enumerated() {
                let scaledPoint = scalePoint(landmark, to: bounds)
                let color = getLandmarkColor(for: index)

                // Outer circle (larger)
                context.fill(
                    Path(
                        ellipseIn: CGRect(
                            x: scaledPoint.x - 6,
                            y: scaledPoint.y - 6,
                            width: 12,
                            height: 12
                        )
                    ),
                    with: .color(color.opacity(0.8))
                )

                // Inner circle (smaller, white)
                context.fill(
                    Path(
                        ellipseIn: CGRect(
                            x: scaledPoint.x - 3,
                            y: scaledPoint.y - 3,
                            width: 6,
                            height: 6
                        )
                    ),
                    with: .color(.white.opacity(0.9))
                )
            }
        }
        .ignoresSafeArea()
    }

    // MARK: - Helper Methods

    /// Scales a normalized point (0-1) to view coordinates
    /// Note: Vision coordinates have Y inverted (0 at bottom), so we flip Y
    private func scalePoint(_ point: CGPoint, to bounds: CGRect) -> CGPoint {
        CGPoint(
            x: point.x * bounds.width,
            y: (1.0 - point.y) * bounds.height  // Flip Y coordinate
        )
    }

    /// Determines color for a landmark based on which finger it belongs to
    private func getLandmarkColor(for index: Int) -> Color {
        switch index {
        case 0: return .yellow      // Wrist
        case 1...4: return fingerColors[0]   // Thumb
        case 5...8: return fingerColors[1]   // Index
        case 9...12: return fingerColors[2]  // Middle
        case 13...16: return fingerColors[3] // Ring
        case 17...20: return fingerColors[4] // Pinky
        default: return .gray
        }
    }

    /// Determines color for a connection based on which fingers it connects
    private func getConnectionColor(startIdx: Int, endIdx: Int) -> Color {
        let maxIdx = max(startIdx, endIdx)

        if maxIdx <= 4 {
            return fingerColors[0]   // Thumb
        } else if maxIdx <= 8 {
            return fingerColors[1]   // Index
        } else if maxIdx <= 12 {
            return fingerColors[2]   // Middle
        } else if maxIdx <= 16 {
            return fingerColors[3]   // Ring
        } else {
            return fingerColors[4]   // Pinky
        }
    }
}

// MARK: - Preview

#Preview {
    PracticeView(signName: "WATER")
}
