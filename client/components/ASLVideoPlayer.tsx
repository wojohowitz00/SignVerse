import React, { useState, useRef, useCallback, useEffect } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "./ThemedText";
import { Spacing, BorderRadius } from "@/constants/theme";

export interface GlossCaption {
  gloss: string;
  startMs: number;
  endMs: number;
}

export interface ASLVideoPlayerProps {
  /** Remote URL (HLS/MP4) or local file:// URI */
  source: string;
  /** Gloss captions synced to video timeline */
  captions?: GlossCaption[];
  /** English translation to display */
  englishText?: string;
  /** Auto-play on mount */
  autoPlay?: boolean;
  /** Loop playback */
  loop?: boolean;
  /** Player height (width is 100%) */
  height?: number;
  /** Callback when video finishes */
  onFinish?: () => void;
  /** Callback for playback progress */
  onProgress?: (positionMs: number, durationMs: number) => void;
}

export function ASLVideoPlayer({
  source,
  captions = [],
  englishText,
  autoPlay = false,
  loop = false,
  height = 280,
  onFinish,
  onProgress,
}: ASLVideoPlayerProps) {
  const { theme } = useTheme();
  const videoRef = useRef<Video>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCaption, setCurrentCaption] = useState<string>("");
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [error, setError] = useState<string | null>(null);

  // Find current caption based on playback position
  const updateCaption = useCallback(
    (position: number) => {
      const caption = captions.find(
        (c) => position >= c.startMs && position < c.endMs,
      );
      setCurrentCaption(caption?.gloss || "");
    },
    [captions],
  );

  const handlePlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        if (status.error) {
          setError(`Playback error: ${status.error}`);
        }
        return;
      }

      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      setPositionMs(status.positionMillis);
      setDurationMs(status.durationMillis || 0);

      updateCaption(status.positionMillis);
      onProgress?.(status.positionMillis, status.durationMillis || 0);

      if (status.didJustFinish && !loop) {
        onFinish?.();
      }
    },
    [loop, onFinish, onProgress, updateCaption],
  );

  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  const cycleSpeed = async () => {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];

    setPlaybackSpeed(newSpeed);
    await videoRef.current?.setRateAsync(newSpeed, true);
  };

  const restart = async () => {
    await videoRef.current?.setPositionAsync(0);
    await videoRef.current?.playAsync();
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = durationMs > 0 ? (positionMs / durationMs) * 100 : 0;

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { height, backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <Feather name="alert-circle" size={32} color={theme.error} />
        <ThemedText style={[styles.errorText, { color: theme.error }]}>
          {error}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Video Container */}
      <View
        style={[
          styles.container,
          { height, backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <Video
          ref={videoRef}
          source={{ uri: source }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={autoPlay}
          isLooping={loop}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onError={(e) => setError(`Load error: ${e}`)}
        />

        {/* Loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}

        {/* Gloss Caption Overlay */}
        {currentCaption ? (
          <View
            style={[
              styles.captionOverlay,
              { backgroundColor: "rgba(0,0,0,0.7)" },
            ]}
          >
            <ThemedText style={styles.captionText}>{currentCaption}</ThemedText>
          </View>
        ) : null}
      </View>

      {/* English Translation */}
      {englishText && (
        <View
          style={[
            styles.translationBar,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {englishText}
          </ThemedText>
        </View>
      )}

      {/* Progress Bar */}
      <View
        style={[
          styles.progressContainer,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercent}%`, backgroundColor: theme.primary },
            ]}
          />
        </View>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {formatTime(positionMs)} / {formatTime(durationMs)}
        </ThemedText>
      </View>

      {/* Controls */}
      <View
        style={[
          styles.controls,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <Pressable onPress={restart} style={styles.controlButton}>
          <Feather name="rotate-ccw" size={20} color={theme.text} />
        </Pressable>

        <Pressable onPress={togglePlayPause} style={styles.playButton}>
          <View style={[styles.playCircle, { backgroundColor: theme.primary }]}>
            <Feather
              name={isPlaying ? "pause" : "play"}
              size={28}
              color="#fff"
              style={isPlaying ? undefined : { marginLeft: 3 }}
            />
          </View>
        </Pressable>

        <Pressable onPress={cycleSpeed} style={styles.controlButton}>
          <ThemedText
            type="small"
            style={{ color: theme.text, fontWeight: "600" }}
          >
            {playbackSpeed}x
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  container: {
    width: "100%",
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  captionOverlay: {
    position: "absolute",
    bottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
  },
  captionText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  translationBar: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: "center",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.md,
    gap: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  controlButton: {
    padding: Spacing.sm,
  },
  playButton: {
    padding: Spacing.xs,
  },
  playCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: Spacing.sm,
    textAlign: "center",
  },
});
