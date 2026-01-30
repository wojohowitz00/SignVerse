import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useGrammarProgress } from "@/hooks/useStorage";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { grammarLessons } from "@/data/grammar";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { GrammarContent } from "@/types";

type RouteType = RouteProp<RootStackParamList, "GrammarDetail">;

export default function GrammarDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const route = useRoute<RouteType>();
  const navigation = useNavigation();
  const { updateLessonProgress } = useGrammarProgress();

  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  const lesson = grammarLessons.find((l) => l.id === route.params.lessonId);

  if (!lesson) {
    return (
      <View style={styles.container}>
        <ThemedText>Lesson not found</ThemedText>
      </View>
    );
  }

  const currentContent = lesson.content[currentContentIndex];
  const isComplete = currentContentIndex >= lesson.content.length - 1;
  const progress = ((currentContentIndex + 1) / lesson.content.length) * 100;

  const handleNext = () => {
    if (!isComplete) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentContentIndex((prev) => prev + 1);
      updateLessonProgress(lesson.id, progress);
    }
  };

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateLessonProgress(lesson.id, 100);
    navigation.goBack();
  };

  const renderContent = (content: GrammarContent) => {
    switch (content.type) {
      case "text":
        return (
          <View
            style={[styles.contentCard, { backgroundColor: theme.backgroundDefault }]}
          >
            <ThemedText type="body" style={styles.contentText}>
              {content.content}
            </ThemedText>
          </View>
        );
      case "example":
        return (
          <View style={styles.exampleContainer}>
            <View
              style={[
                styles.contentCard,
                { backgroundColor: theme.backgroundDefault },
              ]}
            >
              <View style={styles.exampleHeader}>
                <Feather name="book-open" size={18} color={theme.primary} />
                <ThemedText type="small" style={{ color: theme.primary, fontWeight: "600" }}>
                  Example
                </ThemedText>
              </View>
              <ThemedText type="body" style={styles.contentText}>
                {content.content}
              </ThemedText>
            </View>
            {content.example ? (
              <View
                style={[
                  styles.aslExample,
                  { backgroundColor: theme.primary + "15" },
                ]}
              >
                <Feather name="hand" size={16} color={theme.primary} />
                <ThemedText
                  type="body"
                  style={[styles.aslText, { color: theme.primary }]}
                >
                  {content.example}
                </ThemedText>
              </View>
            ) : null}
          </View>
        );
      case "practice":
        return (
          <View
            style={[
              styles.practiceCard,
              { backgroundColor: theme.accent + "15" },
            ]}
          >
            <View style={styles.practiceHeader}>
              <View
                style={[
                  styles.practiceIcon,
                  { backgroundColor: theme.accent + "30" },
                ]}
              >
                <Feather name="target" size={20} color={theme.accent} />
              </View>
              <ThemedText type="h4">Practice Time</ThemedText>
            </View>
            <ThemedText type="body" style={styles.contentText}>
              {content.content}
            </ThemedText>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.lessonHeader}>
          <ThemedText type="h2">{lesson.title}</ThemedText>
          <ThemedText
            type="body"
            style={[styles.description, { color: theme.textSecondary }]}
          >
            {lesson.description}
          </ThemedText>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Step {currentContentIndex + 1} of {lesson.content.length}
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.primary }}>
              {Math.round(progress)}%
            </ThemedText>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: theme.primary },
              ]}
            />
          </View>
        </View>

        {renderContent(currentContent)}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + Spacing.lg, backgroundColor: theme.backgroundDefault },
          Shadows.card,
        ]}
      >
        <View style={styles.navigationRow}>
          <Pressable
            onPress={() => setCurrentContentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentContentIndex === 0}
            style={[
              styles.navButton,
              { backgroundColor: theme.backgroundSecondary, opacity: currentContentIndex === 0 ? 0.5 : 1 },
            ]}
          >
            <Feather name="chevron-left" size={24} color={theme.text} />
          </Pressable>

          {isComplete ? (
            <Button onPress={handleComplete} style={styles.mainButton}>
              Complete Lesson
            </Button>
          ) : (
            <Button onPress={handleNext} style={styles.mainButton}>
              Continue
            </Button>
          )}

          <Pressable
            onPress={handleNext}
            disabled={isComplete}
            style={[
              styles.navButton,
              { backgroundColor: theme.backgroundSecondary, opacity: isComplete ? 0.5 : 1 },
            ]}
          >
            <Feather name="chevron-right" size={24} color={theme.text} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  lessonHeader: {
    marginBottom: Spacing.xl,
  },
  description: {
    marginTop: Spacing.sm,
  },
  progressSection: {
    marginBottom: Spacing.xl,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  contentCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  contentText: {
    lineHeight: 26,
  },
  exampleContainer: {
    marginBottom: Spacing.lg,
  },
  exampleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  aslExample: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: -Spacing.sm,
  },
  aslText: {
    flex: 1,
    fontWeight: "600",
  },
  practiceCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  practiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  practiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  navigationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  mainButton: {
    flex: 1,
  },
});
