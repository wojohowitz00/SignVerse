import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import { ProgressCard } from "@/components/ProgressCard";
import { WeeklyChart } from "@/components/WeeklyChart";
import { EmptyState } from "@/components/EmptyState";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useUserProgress } from "@/hooks/useStorage";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { progress, isLoading } = useUserProgress();

  const hasActivity =
    progress.signsLearned > 0 ||
    progress.conversationsCompleted > 0 ||
    progress.practiceMinutes > 0;

  if (!hasActivity && !isLoading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      >
        <View
          style={[
            styles.emptyContainer,
            {
              paddingTop: headerHeight + Spacing.xl,
              paddingBottom: tabBarHeight + Spacing.xl,
            },
          ]}
        >
          <EmptyState
            image={require("../../assets/images/empty-progress.png")}
            title="Start Your Journey"
            description="Complete your first practice session to see your progress here"
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="h3" style={styles.sectionTitle}>
        Your Progress
      </ThemedText>

      <View style={styles.statsGrid}>
        <ProgressCard
          title="Signs Learned"
          value={progress.signsLearned}
          subtitle={`of ${progress.totalSigns}`}
          icon="book"
          color={theme.primary}
        />
        <ProgressCard
          title="Conversations"
          value={progress.conversationsCompleted}
          subtitle="completed"
          icon="message-circle"
          color={theme.accent}
        />
      </View>

      <View style={styles.statsGrid}>
        <ProgressCard
          title="Practice Time"
          value={`${progress.practiceMinutes}m`}
          subtitle="total"
          icon="clock"
          color={theme.success}
        />
        <ProgressCard
          title="Day Streak"
          value={progress.currentStreak}
          subtitle="days"
          icon="zap"
          color={theme.warning}
        />
      </View>

      <View style={styles.chartSection}>
        <WeeklyChart data={progress.weeklyPractice} />
      </View>

      {progress.achievements.length > 0 ? (
        <View style={styles.achievementsSection}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Achievements
          </ThemedText>
          {progress.achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                { backgroundColor: theme.backgroundDefault },
                Shadows.card,
              ]}
            >
              <View
                style={[
                  styles.achievementIcon,
                  { backgroundColor: theme.warning + "20" },
                ]}
              >
                <Feather name="award" size={24} color={theme.warning} />
              </View>
              <View style={styles.achievementContent}>
                <ThemedText type="body" style={styles.achievementTitle}>
                  {achievement.title}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {achievement.description}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.motivationSection}>
          <View
            style={[
              styles.motivationCard,
              { backgroundColor: theme.primary + "10" },
            ]}
          >
            <Feather name="target" size={24} color={theme.primary} />
            <View style={styles.motivationContent}>
              <ThemedText type="body" style={styles.motivationTitle}>
                Keep Going!
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Complete 5 conversations to earn your first achievement
              </ThemedText>
            </View>
          </View>
        </View>
      )}
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
  emptyContainer: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  chartSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  achievementsSection: {
    marginTop: Spacing.lg,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontWeight: "600",
    marginBottom: 2,
  },
  motivationSection: {
    marginTop: Spacing.lg,
  },
  motivationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  motivationContent: {
    flex: 1,
  },
  motivationTitle: {
    fontWeight: "600",
    marginBottom: 2,
  },
});
