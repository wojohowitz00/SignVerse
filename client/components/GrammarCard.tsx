import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { Image } from "expo-image";
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
import { GrammarLesson } from "@/types";

interface GrammarCardProps {
  lesson: GrammarLesson;
  progress: number;
  onPress: () => void;
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

export function GrammarCard({ lesson, progress, onPress }: GrammarCardProps) {
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

  const difficultyColor = getDifficultyColor(lesson.difficulty, theme);
  const isCompleted = progress >= 100;

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
      testID={`grammar-card-${lesson.id}`}
    >
      <View style={styles.leftContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Image source={lesson.icon} style={styles.icon} contentFit="cover" />
        </View>
        <View style={styles.textContent}>
          <ThemedText type="body" style={styles.title}>
            {lesson.title}
          </ThemedText>
          <ThemedText
            type="small"
            style={[styles.description, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {lesson.description}
          </ThemedText>
          <View style={styles.metaRow}>
            <View style={styles.durationRow}>
              <Feather name="clock" size={12} color={theme.textSecondary} />
              <ThemedText
                type="caption"
                style={[styles.duration, { color: theme.textSecondary }]}
              >
                {lesson.duration}
              </ThemedText>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: difficultyColor + "20" },
              ]}
            >
              <ThemedText
                type="caption"
                style={[styles.difficultyText, { color: difficultyColor }]}
              >
                {lesson.difficulty}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.rightContent}>
        {isCompleted ? (
          <View
            style={[
              styles.completedBadge,
              { backgroundColor: theme.success + "20" },
            ]}
          >
            <Feather name="check" size={16} color={theme.success} />
          </View>
        ) : progress > 0 ? (
          <View style={styles.progressContainer}>
            <View
              style={[styles.progressCircle, { borderColor: theme.primary }]}
            >
              <ThemedText
                type="caption"
                style={[styles.progressText, { color: theme.primary }]}
              >
                {Math.round(progress)}%
              </ThemedText>
            </View>
          </View>
        ) : (
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        )}
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
    marginBottom: Spacing.md,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    overflow: "hidden",
  },
  icon: {
    width: 56,
    height: 56,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    marginBottom: 2,
  },
  description: {
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  duration: {
    opacity: 0.7,
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
  rightContent: {
    marginLeft: Spacing.md,
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    fontWeight: "600",
    fontSize: 10,
  },
});
