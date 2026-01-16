import AVFoundation
import SwiftUI
import UIKit

// MARK: - CameraManager

/// Manages AVCaptureSession for camera input and frame processing
@MainActor
class CameraManager: NSObject, ObservableObject {
    // MARK: - Published Properties
    @Published var isRunning = false

    // MARK: - Private Properties
    let captureSession = AVCaptureSession()
    private let sessionQueue = DispatchQueue(label: "com.signverse.camera.session")
    private var videoOutput: AVCaptureVideoDataOutput?

    // MARK: - Callback
    var onFrame: ((CMSampleBuffer) -> Void)?

    // MARK: - Initialization
    override init() {
        super.init()
        setupCamera()
    }

    // MARK: - Setup

    /// Configures the capture session with front camera
    private func setupCamera() {
        sessionQueue.async { [weak self] in
            guard let self = self else { return }

            self.captureSession.beginConfiguration()
            defer { self.captureSession.commitConfiguration() }

            // Set session preset for balanced quality and performance
            if self.captureSession.canSetSessionPreset(.high) {
                self.captureSession.sessionPreset = .high
            }

            // Configure input: Front camera
            guard let frontCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) else {
                print("Unable to access front camera")
                return
            }

            do {
                let input = try AVCaptureDeviceInput(device: frontCamera)
                if self.captureSession.canAddInput(input) {
                    self.captureSession.addInput(input)
                }
            } catch {
                print("Error configuring camera input: \(error)")
                return
            }

            // Configure output: Video frame output for hand tracking
            let videoOutput = AVCaptureVideoDataOutput()
            videoOutput.setSampleBufferDelegate(self, queue: DispatchQueue(label: "com.signverse.camera.output"))

            // Configure for YCbCr format (efficient for processing)
            if videoOutput.availableVideoCodecTypes.contains(.h264) {
                videoOutput.videoSettings = [
                    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange
                ]
            }

            // Discard late frames to keep up with real-time processing
            videoOutput.alwaysDiscardsLateVideoFrames = true

            if self.captureSession.canAddOutput(videoOutput) {
                self.captureSession.addOutput(videoOutput)
                self.videoOutput = videoOutput

                // Configure video orientation to portrait
                if let connection = videoOutput.connection(with: .video) {
                    if connection.isVideoOrientationSupported {
                        connection.videoOrientation = .portrait
                    }
                    // Mirror the front camera feed
                    if connection.isVideoMirroringSupported {
                        connection.isVideoMirrored = true
                    }
                }
            }
        }
    }

    // MARK: - Session Control

    /// Starts the capture session
    func startSession() {
        sessionQueue.async { [weak self] in
            guard let self = self else { return }

            if !self.captureSession.isRunning {
                self.captureSession.startRunning()
                DispatchQueue.main.async {
                    self.isRunning = true
                }
            }
        }
    }

    /// Stops the capture session
    func stopSession() {
        sessionQueue.async { [weak self] in
            guard let self = self else { return }

            if self.captureSession.isRunning {
                self.captureSession.stopRunning()
                DispatchQueue.main.async {
                    self.isRunning = false
                }
            }
        }
    }

    deinit {
        // Use nonisolated(unsafe) to allow calling stopSession from deinit
        // stopSession uses sessionQueue.async which is safe
        nonisolated(unsafe) { [weak self] in
            self?.stopSession()
        }()
    }
}

// MARK: - AVCaptureVideoDataOutputSampleBufferDelegate

extension CameraManager: AVCaptureVideoDataOutputSampleBufferDelegate {
    func captureOutput(
        _ output: AVCaptureOutput,
        didOutput sampleBuffer: CMSampleBuffer,
        from connection: AVCaptureConnection
    ) {
        onFrame?(sampleBuffer)
    }
}

// MARK: - CameraPreviewView

/// UIViewRepresentable wrapper for AVCaptureVideoPreviewLayer
struct CameraPreviewView: UIViewRepresentable {
    let captureSession: AVCaptureSession

    func makeUIView(context: UIViewRepresentableContext<CameraPreviewView>) -> UIView {
        let view = UIView()
        view.backgroundColor = .black

        let previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        previewLayer.videoGravity = .resizeAspectFill

        // Mirror the preview for front camera (natural mirror effect)
        if let connection = previewLayer.connection, connection.isVideoMirroringSupported {
            connection.isVideoMirrored = true
        }

        view.layer.addSublayer(previewLayer)

        DispatchQueue.main.async {
            previewLayer.frame = view.bounds
        }

        context.coordinator.previewLayer = previewLayer
        return view
    }

    func updateUIView(_ uiView: UIView, context: UIViewRepresentableContext<CameraPreviewView>) {
        if let previewLayer = context.coordinator.previewLayer {
            previewLayer.frame = uiView.bounds
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    class Coordinator {
        var previewLayer: AVCaptureVideoPreviewLayer?
    }
}

// MARK: - CameraView

/// SwiftUI view that displays live camera feed with optional skeleton overlay
struct CameraView<OverlayContent: View>: View {
    @StateObject private var cameraManager = CameraManager()

    let overlayContent: OverlayContent?

    init(@ViewBuilder overlayContent: @escaping () -> OverlayContent) {
        self.overlayContent = overlayContent()
    }

    var body: some View {
        ZStack {
            // Camera preview
            if let session = cameraManager.captureSession as AVCaptureSession? {
                CameraPreviewView(captureSession: session)
                    .ignoresSafeArea()
            }

            // Optional overlay content (e.g., skeleton visualization)
            if let overlayContent = overlayContent {
                overlayContent
            }
        }
        .onAppear {
            cameraManager.startSession()
        }
        .onDisappear {
            cameraManager.stopSession()
        }
    }
}

// MARK: - Convenience Initializer

extension CameraView where OverlayContent == EmptyView {
    /// Creates a CameraView without overlay
    init() {
        self.overlayContent = nil
    }
}

// MARK: - Preview

#Preview {
    CameraView()
}
