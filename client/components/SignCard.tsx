import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { Sign } from "@/types";

interface SignCardProps {
  sign: Sign;
  onPress: () => void;
  onFavoritePress?: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const getDifficultyColor = (difficulty: string, theme: any) => {
  switch (difficulty) {
    case "beginner":
      return theme.success;
    case "intermediate":
      return theme.warning;
    case "advanced":
      return theme.error;
    default:
      return theme.textSecondary;
  }
};

export function SignCard({ sign, onPress, onFavoritePress }: SignCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const difficultyColor = getDifficultyColor(sign.difficulty, theme);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundDefault },
        Shadows.card,
        animatedStyle,
      ]}
      testID={`sign-card-${sign.id}`}
    >
      <View style={styles.leftContent}>
        <View
          style={[styles.iconContainer, { backgroundColor: theme.backgroundSecondary }]}
        >
          <Feather name="edit-3" size={24} color={theme.primary} />
        </View>
        <View style={styles.textContent}>
          <ThemedText type="body" style={styles.word}>
            {sign.word}
          </ThemedText>
          <View style={styles.metaRow}>
            <View
              style={[styles.difficultyBadge, { backgroundColor: difficultyColor + "20" }]}
            >
              <ThemedText
                type="caption"
                style={[styles.difficultyText, { color: difficultyColor }]}
              >
                {sign.difficulty}
              </ThemedText>
            </View>
            <ThemedText
              type="caption"
              style={[styles.category, { color: theme.textSecondary }]}
            >
              {sign.category}
            </ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.rightContent}>
        {sign.isLearned ? (
          <View style={[styles.learnedBadge, { backgroundColor: theme.success + "20" }]}>
            <Feather name="check" size={14} color={theme.success} />
          </View>
        ) : null}
        {onFavoritePress ? (
          <Pressable
            onPress={onFavoritePress}
            style={styles.favoriteButton}
            hitSlop={8}
          >
            <Feather
              name={sign.isFavorite ? "heart" : "heart"}
              size={20}
              color={sign.isFavorite ? theme.error : theme.textSecondary}
            />
          </Pressable>
        ) : null}
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  textContent: {
    flex: 1,
  },
  word: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  category: {
    opacity: 0.7,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  learnedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButton: {
    padding: Spacing.xs,
  },
});
