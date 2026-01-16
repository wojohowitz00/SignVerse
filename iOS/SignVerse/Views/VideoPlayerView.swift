import SwiftUI
import AVKit

// MARK: - SignVideoPlayer (ObservableObject)

class SignVideoPlayer: ObservableObject {
    @Published var isPlaying: Bool = false
    @Published var playbackRate: Float = 1.0

    private let player = AVPlayer()
    private var timeObserver: Any?

    var avPlayer: AVPlayer {
        player
    }

    deinit {
        if let timeObserver = timeObserver {
            player.removeTimeObserver(timeObserver)
        }
    }

    // MARK: - Public Methods

    func loadVideo(url: URL) {
        let asset = AVURLAsset(url: url)
        let playerItem = AVPlayerItem(asset: asset)
        player.replaceCurrentItem(with: playerItem)

        // Set up loop observer
        setupLoopObserver(playerItem: playerItem)
    }

    func play() {
        player.play()
        isPlaying = true
    }

    func pause() {
        player.pause()
        isPlaying = false
    }

    func restart() {
        player.seek(to: .zero)
        player.play()
        isPlaying = true
    }

    func setRate(_ rate: Float) {
        playbackRate = rate
        player.rate = rate
    }

    // MARK: - Private Methods

    private func setupLoopObserver(playerItem: AVPlayerItem) {
        NotificationCenter.default.removeObserver(
            self,
            name: .AVPlayerItemDidPlayToEndTime,
            object: playerItem
        )

        NotificationCenter.default.addObserver(
            forName: .AVPlayerItemDidPlayToEndTime,
            object: playerItem,
            queue: .main
        ) { [weak self] _ in
            self?.restart()
        }
    }
}

// MARK: - VideoPlayerView (SwiftUI View)

struct VideoPlayerView: View {
    let videoName: String

    @StateObject private var videoPlayer = SignVideoPlayer()
    @State private var showSlowMo = false

    var body: some View {
        VStack(spacing: 0) {
            // Video Player
            ZStack {
                Color.black

                VideoPlayer(player: videoPlayer.avPlayer)
                    .frame(height: 400)
                    .onAppear {
                        loadVideo()
                    }
            }
            .frame(height: 400)

            // Controls
            VStack(spacing: 12) {
                // Speed Indicator
                HStack {
                    Text("Speed:")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    Text(String(format: "%.2fx", videoPlayer.playbackRate))
                        .font(.subheadline)
                        .fontWeight(.semibold)
                    Spacer()
                }
                .padding(.horizontal)
                .padding(.top, 8)

                // Control Buttons
                HStack(spacing: 16) {
                    // Play/Pause Button
                    Button(action: {
                        if videoPlayer.isPlaying {
                            videoPlayer.pause()
                        } else {
                            videoPlayer.play()
                        }
                    }) {
                        Image(systemName: videoPlayer.isPlaying ? "pause.fill" : "play.fill")
                            .font(.system(size: 20))
                            .frame(width: 44, height: 44)
                            .background(Color.accentColor)
                            .foregroundColor(.white)
                            .cornerRadius(8)
                    }

                    // Slow-mo Button
                    Button(action: {
                        showSlowMo.toggle()
                        if showSlowMo {
                            videoPlayer.setRate(0.5)
                        } else {
                            videoPlayer.setRate(1.0)
                        }
                    }) {
                        VStack(spacing: 4) {
                            Image(systemName: "tortoise.fill")
                                .font(.system(size: 16))
                            Text("Slow")
                                .font(.caption2)
                        }
                        .frame(width: 44, height: 44)
                        .background(showSlowMo ? Color.accentColor : Color.gray.opacity(0.2))
                        .foregroundColor(showSlowMo ? .white : .primary)
                        .cornerRadius(8)
                    }

                    // Restart Button
                    Button(action: {
                        videoPlayer.restart()
                        showSlowMo = false
                        videoPlayer.setRate(1.0)
                    }) {
                        Image(systemName: "arrow.clockwise")
                            .font(.system(size: 20))
                            .frame(width: 44, height: 44)
                            .background(Color.gray.opacity(0.2))
                            .foregroundColor(.primary)
                            .cornerRadius(8)
                    }

                    Spacer()
                }
                .padding(.horizontal)
                .padding(.bottom, 8)
            }
            .padding(.vertical, 8)
            .background(Color(uiColor: .systemBackground))
        }
        .background(Color.black)
    }

    // MARK: - Private Methods

    private func loadVideo() {
        // First try to load from Bundle
        if let bundleURL = Bundle.main.url(forResource: videoName, withExtension: "mp4") {
            videoPlayer.loadVideo(url: bundleURL)
            return
        }

        // Fallback: try common Documents directory
        let fileManager = FileManager.default
        if let documentsURL = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first {
            let videoURL = documentsURL.appendingPathComponent("\(videoName).mp4")
            if fileManager.fileExists(atPath: videoURL.path) {
                videoPlayer.loadVideo(url: videoURL)
                return
            }
        }

        // Log warning if video not found
        print("Warning: Video '\(videoName).mp4' not found in bundle or documents")
    }
}

// MARK: - Preview

#Preview {
    VideoPlayerView(videoName: "SampleVideo")
        .preferredColorScheme(.light)
}
