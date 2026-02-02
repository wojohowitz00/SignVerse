import React from "react";
import { FlatList, StyleSheet, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { GrammarCard } from "@/components/GrammarCard";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useGrammarProgress } from "@/hooks/useStorage";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { grammarLessons } from "@/data/grammar";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { GrammarLesson } from "@/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function GrammarScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { lessonProgress } = useGrammarProgress();

  const handleLessonPress = (lessonId: string) => {
    navigation.navigate("GrammarDetail", { lessonId });
  };

  const renderLesson = ({ item }: { item: GrammarLesson }) => (
    <GrammarCard
      lesson={item}
      progress={lessonProgress[item.id] || 0}
      onPress={() => handleLessonPress(item.id)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        data={grammarLessons}
        keyExtractor={(item) => item.id}
        renderItem={renderLesson}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              Grammar Lessons
            </ThemedText>
            <ThemedText
              type="body"
              style={[styles.subtitle, { color: theme.textSecondary }]}
            >
              Learn the rules that make ASL a complete language
            </ThemedText>

            <View
              style={[
                styles.tipCard,
                { backgroundColor: theme.primary + "10" },
              ]}
            >
              <View style={styles.tipIconContainer}>
                <Feather name="zap" size={20} color={theme.primary} />
              </View>
              <View style={styles.tipContent}>
                <ThemedText type="small" style={styles.tipTitle}>
                  Quick Tip
                </ThemedText>
                <ThemedText
                  type="caption"
                  style={{ color: theme.textSecondary }}
                >
                  {`ASL has its own grammar - it's not just signed English. Take time to learn these rules for natural signing.`}
                </ThemedText>
              </View>
            </View>
          </View>
        }
      />
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
  header: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: Spacing.xl,
  },
  tipCard: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontWeight: "600",
    marginBottom: 2,
  },
});
