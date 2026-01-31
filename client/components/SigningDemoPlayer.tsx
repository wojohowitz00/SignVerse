import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Animated, Easing } from "react-native";
import { Feather } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "./ThemedText";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { SigningMediaType } from "@/types";

interface SigningDemoPlayerProps {
  mediaType: SigningMediaType;
  animationSource?: any;
  videoUrl?: string;
  avatarSource: any;
  signDescription: string;
  isPartnerTurn: boolean;
  autoPlay?: boolean;
}

export function SigningDemoPlayer({
  mediaType,
  animationSource,
  avatarSource,
  signDescription,
  isPartnerTurn,
  autoPlay = true,
}: SigningDemoPlayerProps) {
  const { theme } = useTheme();
  const lottieRef = useRef<LottieView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (mediaType === "placeholder") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [mediaType]);

  useEffect(() => {
    if (mediaType === "lottie" && autoPlay && lottieRef.current) {
      lottieRef.current.play();
    }
  }, [mediaType, autoPlay, animationSource]);

  const renderPlaceholder = () => (
    <View style={[styles.placeholderContainer, { backgroundColor: theme.backgroundSecondary }]}>
      <Animated.View style={[styles.handIconWrapper, { transform: [{ scale: pulseAnim }] }]}>
        <View style={[styles.handCircle, { backgroundColor: theme.primary + "20" }]}>
          <Feather name="edit-3" size={32} color={theme.primary} />
        </View>
      </Animated.View>
      <ThemedText type="caption" style={[styles.placeholderText, { color: theme.textSecondary }]}>
        Sign demonstration
      </ThemedText>
    </View>
  );

  const renderLottie = () => (
    <View style={[styles.lottieContainer, { backgroundColor: theme.backgroundSecondary }]}>
      {animationSource ? (
        <LottieView
          ref={lottieRef}
          source={animationSource}
          style={styles.lottieAnimation}
          autoPlay={autoPlay}
          loop={true}
        />
      ) : (
        renderPlaceholder()
      )}
    </View>
  );

  const renderContent = () => {
    switch (mediaType) {
      case "lottie":
        return renderLottie();
      case "video":
        return renderPlaceholder();
      case "placeholder":
      default:
        return renderPlaceholder();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mediaWrapper}>
        {renderContent()}
        <View style={styles.avatarBadge}>
          <Image source={avatarSource} style={styles.avatarImage} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  mediaWrapper: {
    width: 120,
    height: 120,
    position: "relative",
  },
  placeholderContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  handIconWrapper: {
    marginBottom: Spacing.xs,
  },
  handCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    marginTop: Spacing.xs,
  },
  lottieContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  lottieAnimation: {
    width: 100,
    height: 100,
  },
  avatarBadge: {
    position: "absolute",
    bottom: -8,
    right: -8,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarImage: {
    width: 36,
    height: 36,
  },
});
