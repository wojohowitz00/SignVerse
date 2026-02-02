import React, { ReactNode } from "react";
import { StyleSheet, Pressable, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";

interface ButtonProps {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  onPress,
  children,
  style,
  disabled = false,
  variant = "primary",
  size = "md",
}: ButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.98, springConfig);
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, springConfig);
    }
  };

  const getBackgroundColor = () => {
    if (variant === "outline" || variant === "ghost") return "transparent";
    return theme.primary;
  };

  const getBorderColor = () => {
    if (variant === "outline") return theme.border;
    return "transparent";
  };

  const getTextColor = () => {
    if (variant === "outline" || variant === "ghost") return theme.primary;
    return theme.buttonText;
  };

  const getHeight = () => {
    switch (size) {
      case "sm":
        return 36;
      case "lg":
        return 56;
      default:
        return Spacing.buttonHeight;
    }
  };

  const getPaddingHorizontal = () => {
    switch (size) {
      case "sm":
        return Spacing.md;
      case "lg":
        return Spacing.xl;
      default:
        return Spacing.lg;
    }
  };

  const getTextType = () => {
    switch (size) {
      case "sm":
        return "small";
      default:
        return "body";
    }
  };

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        {
          height: getHeight(),
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === "outline" ? 1 : 0,
          paddingHorizontal: getPaddingHorizontal(),
          opacity: disabled ? 0.5 : 1,
        },
        style,
        animatedStyle,
      ]}
    >
      <ThemedText
        type={getTextType()}
        style={[styles.buttonText, { color: getTextColor() }]}
      >
        {children}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    fontWeight: "600",
  },
});
