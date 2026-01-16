import Vision
import CoreMedia
import Combine

/// A class that detects hand poses using Apple's Vision Framework.
/// Publishes detected hand landmarks, confidence scores, and detection status.
@available(iOS 17.0, *)
final class HandPoseDetector: NSObject, ObservableObject {
    // MARK: - Published Properties

    /// Array of 21 CGPoints representing hand landmarks in normalized coordinates (0-1)
    /// Order: Wrist, Thumb (4), Index (4), Middle (4), Ring (4), Little (4)
    /// Returns nil if no hand is detected
    @Published var handLandmarks: [CGPoint]?

    /// Confidence score of the hand detection (0.0 to 1.0)
    @Published var confidence: Float = 0.0

    /// Boolean indicating whether a hand is currently detected
    @Published var isHandDetected: Bool = false

    // MARK: - Private Properties

    private let handPoseRequest = VNDetectHumanHandPoseRequest()
    private let sequenceRequestHandler = VNSequenceRequestHandler()

    /// The order of joint names to extract from VNHumanHandPoseObservation
    /// Wrist + all finger joints in anatomical order
    private let jointNames: [VNHumanHandPoseObservation.JointName] = [
        // Wrist
        .wrist,

        // Thumb
        .thumbCMC,
        .thumbMP,
        .thumbIP,
        .thumbTip,

        // Index finger
        .indexMCP,
        .indexPIP,
        .indexDIP,
        .indexTip,

        // Middle finger
        .middleMCP,
        .middlePIP,
        .middleDIP,
        .middleTip,

        // Ring finger
        .ringMCP,
        .ringPIP,
        .ringDIP,
        .ringTip,

        // Little finger
        .littleMCP,
        .littlePIP,
        .littleDIP,
        .littleTip
    ]

    // MARK: - Initialization

    override init() {
        super.init()
        setupRequest()
    }

    // MARK: - Private Methods

    /// Configure the hand pose detection request
    private func setupRequest() {
        handPoseRequest.maximumHandCount = 1
    }

    /// Extract hand landmarks from a VNHumanHandPoseObservation
    /// - Parameter observation: The hand pose observation from Vision framework
    /// - Returns: Tuple containing landmarks array and confidence score, or nil if extraction fails
    private func extractLandmarks(from observation: VNHumanHandPoseObservation) -> (landmarks: [CGPoint], confidence: Float)? {
        var landmarks: [CGPoint] = []

        // Extract all 21 joint points in the specified order
        for jointName in jointNames {
            guard let point = try? observation.recognizedPoint(jointName) else {
                return nil
            }

            // Only include points with sufficient confidence
            guard point.confidence > 0.0 else {
                return nil
            }

            // point.location is in normalized coordinates (0-1)
            landmarks.append(point.location)
        }

        // Ensure we have all 21 landmarks
        guard landmarks.count == 21 else {
            return nil
        }

        // Calculate average confidence across all detected points
        let totalConfidence = observation.recognizedPoints.values.reduce(0.0) { $0 + Double($1.confidence) }
        let pointCount = observation.recognizedPoints.count
        let averageConfidence = Float(totalConfidence) / Float(pointCount)

        return (landmarks, averageConfidence)
    }

    /// Process Vision observations and update published properties
    /// - Parameter observations: Array of VNObservation objects
    private func processObservations(_ observations: [VNObservation]) {
        DispatchQueue.main.async {
            guard let handObservations = observations as? [VNHumanHandPoseObservation],
                  !handObservations.isEmpty else {
                self.handLandmarks = nil
                self.confidence = 0.0
                self.isHandDetected = false
                return
            }

            // Process the first detected hand
            if let observation = handObservations.first,
               let result = self.extractLandmarks(from: observation) {
                self.handLandmarks = result.landmarks
                self.confidence = result.confidence
                self.isHandDetected = true
            } else {
                self.handLandmarks = nil
                self.confidence = 0.0
                self.isHandDetected = false
            }
        }
    }

    // MARK: - Public Methods

    /// Process a sample buffer to detect hand poses
    /// - Parameter sampleBuffer: CMSampleBuffer from AVCaptureOutput
    func processFrame(_ sampleBuffer: CMSampleBuffer) {
        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
            return
        }

        let requestHandler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, options: [:])

        do {
            try requestHandler.perform([handPoseRequest])
            guard let results = handPoseRequest.results as? [VNHumanHandPoseObservation] else {
                DispatchQueue.main.async {
                    self.handLandmarks = nil
                    self.confidence = 0.0
                    self.isHandDetected = false
                }
                return
            }
            processObservations(results)
        } catch {
            print("Error processing frame: \(error.localizedDescription)")
            DispatchQueue.main.async {
                self.handLandmarks = nil
                self.confidence = 0.0
                self.isHandDetected = false
            }
        }
    }

    /// Process a CGImage to detect hand poses
    /// - Parameter cgImage: The image to process
    func processImage(_ cgImage: CGImage) {
        let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])

        do {
            try requestHandler.perform([handPoseRequest])
            guard let results = handPoseRequest.results as? [VNHumanHandPoseObservation] else {
                DispatchQueue.main.async {
                    self.handLandmarks = nil
                    self.confidence = 0.0
                    self.isHandDetected = false
                }
                return
            }
            processObservations(results)
        } catch {
            print("Error processing image: \(error.localizedDescription)")
            DispatchQueue.main.async {
                self.handLandmarks = nil
                self.confidence = 0.0
                self.isHandDetected = false
            }
        }
    }

    /// Get a human-readable name for a joint at the given index
    /// - Parameter index: The index in the handLandmarks array
    /// - Returns: Human-readable name of the joint
    func jointName(at index: Int) -> String {
        guard index >= 0 && index < jointNames.count else {
            return "Unknown"
        }

        let joint = jointNames[index]

        switch joint {
        case .wrist:
            return "Wrist"
        case .thumbCMC:
            return "Thumb CMC"
        case .thumbMP:
            return "Thumb MP"
        case .thumbIP:
            return "Thumb IP"
        case .thumbTip:
            return "Thumb Tip"
        case .indexMCP:
            return "Index MCP"
        case .indexPIP:
            return "Index PIP"
        case .indexDIP:
            return "Index DIP"
        case .indexTip:
            return "Index Tip"
        case .middleMCP:
            return "Middle MCP"
        case .middlePIP:
            return "Middle PIP"
        case .middleDIP:
            return "Middle DIP"
        case .middleTip:
            return "Middle Tip"
        case .ringMCP:
            return "Ring MCP"
        case .ringPIP:
            return "Ring PIP"
        case .ringDIP:
            return "Ring DIP"
        case .ringTip:
            return "Ring Tip"
        case .littleMCP:
            return "Little MCP"
        case .littlePIP:
            return "Little PIP"
        case .littleDIP:
            return "Little DIP"
        case .littleTip:
            return "Little Tip"
        @unknown default:
            return "Unknown"
        }
    }
}
