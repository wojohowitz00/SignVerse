import React from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useVocabulary, useUserProgress } from "@/hooks/useStorage";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { vocabularyData } from "@/data/vocabulary";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type RouteType = RouteProp<RootStackParamList, "SignDetail">;

export default function SignDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const route = useRoute<RouteType>();
  const { vocabulary, toggleFavorite, markAsLearned } = useVocabulary();
  const { incrementSignsLearned } = useUserProgress();

  const displayVocabulary = vocabulary.length > 0 ? vocabulary : vocabularyData;
  const sign = displayVocabulary.find((s) => s.id === route.params.signId);

  if (!sign) {
    return (
      <View style={styles.container}>
        <ThemedText>Sign not found</ThemedText>
      </View>
    );
  }

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(sign.id);
  };

  const handleMarkLearned = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    markAsLearned(sign.id);
    incrementSignsLearned();
  };

  const getDifficultyColor = () => {
    switch (sign.difficulty) {
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View
        style={[
          styles.demoContainer,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary + "20" }]}>
          <Feather name="edit-3" size={80} color={theme.primary} />
        </View>
        <View style={styles.demoOverlay}>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Sign demonstration
          </ThemedText>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.titleRow}>
          <ThemedText type="h2">{sign.word}</ThemedText>
          <Pressable onPress={handleFavorite} hitSlop={12}>
            <Feather
              name="heart"
              size={24}
              color={sign.isFavorite ? theme.error : theme.textSecondary}
            />
          </Pressable>
        </View>

        <View style={styles.badges}>
          <View
            style={[styles.badge, { backgroundColor: getDifficultyColor() + "20" }]}
          >
            <ThemedText
              type="small"
              style={[styles.badgeText, { color: getDifficultyColor() }]}
            >
              {sign.difficulty}
            </ThemedText>
          </View>
          <View
            style={[styles.badge, { backgroundColor: theme.backgroundSecondary }]}
          >
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {sign.category}
            </ThemedText>
          </View>
          {sign.isLearned ? (
            <View style={[styles.badge, { backgroundColor: theme.success + "20" }]}>
              <Feather name="check" size={14} color={theme.success} />
              <ThemedText
                type="small"
                style={[styles.badgeText, { color: theme.success }]}
              >
                Learned
              </ThemedText>
            </View>
          ) : null}
        </View>
      </View>

      <View
        style={[
          styles.descriptionCard,
          { backgroundColor: theme.backgroundDefault },
          Shadows.card,
        ]}
      >
        <View style={styles.descriptionHeader}>
          <Feather name="info" size={18} color={theme.primary} />
          <ThemedText type="h4">How to Sign</ThemedText>
        </View>
        <ThemedText type="body" style={styles.description}>
          {sign.description}
        </ThemedText>
      </View>

      <View style={styles.tipsCard}>
        <ThemedText type="h4" style={styles.tipsTitle}>
          Practice Tips
        </ThemedText>
        <View style={styles.tipRow}>
          <Feather name="eye" size={16} color={theme.textSecondary} />
          <ThemedText type="small" style={{ color: theme.textSecondary, flex: 1 }}>
            Watch the hand shape and movement carefully
          </ThemedText>
        </View>
        <View style={styles.tipRow}>
          <Feather name="repeat" size={16} color={theme.textSecondary} />
          <ThemedText type="small" style={{ color: theme.textSecondary, flex: 1 }}>
            Practice in front of a mirror to check your form
          </ThemedText>
        </View>
        <View style={styles.tipRow}>
          <Feather name="smile" size={16} color={theme.textSecondary} />
          <ThemedText type="small" style={{ color: theme.textSecondary, flex: 1 }}>
            Remember facial expressions are part of ASL grammar
          </ThemedText>
        </View>
      </View>

      {!sign.isLearned ? (
        <Button onPress={handleMarkLearned} style={styles.learnButton}>
          Mark as Learned
        </Button>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  demoContainer: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatarPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  demoOverlay: {
    alignItems: "center",
  },
  infoSection: {
    marginBottom: Spacing.xl,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontWeight: "500",
    textTransform: "capitalize",
  },
  descriptionCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  description: {
    lineHeight: 26,
  },
  tipsCard: {
    marginBottom: Spacing.xl,
  },
  tipsTitle: {
    marginBottom: Spacing.md,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  learnButton: {
    marginTop: Spacing.md,
  },
});
