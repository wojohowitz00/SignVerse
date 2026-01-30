import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ConversationBubble } from "@/components/ConversationBubble";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { scenarios } from "@/data/scenarios";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { ConversationMessage } from "@/types";

type RouteType = RouteProp<RootStackParamList, "Conversation">;

export default function ConversationScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const route = useRoute<RouteType>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenario = scenarios.find((s) => s.id === route.params.scenarioId);
  const conversation = scenario?.conversations.find(
    (c) => c.id === route.params.conversationId
  );

  if (!conversation) {
    return (
      <View style={styles.container}>
        <ThemedText>Conversation not found</ThemedText>
      </View>
    );
  }

  const visibleMessages = conversation.messages.slice(0, currentIndex + 1);
  const currentMessage = conversation.messages[currentIndex];
  const isComplete = currentIndex >= conversation.messages.length - 1;

  const handleNext = () => {
    if (!isComplete) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentIndex(0);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.avatarSection, { paddingTop: headerHeight + Spacing.lg }]}>
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}>
            <Feather name="user" size={60} color={theme.primary} />
          </View>
          <View style={styles.avatarOverlay}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {currentMessage?.role === "partner" ? "Partner signing" : "Your turn"}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.conversationSection}>
        <View style={styles.progressRow}>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            Exchange {currentIndex + 1} of {conversation.messages.length}
          </ThemedText>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentIndex + 1) / conversation.messages.length) * 100}%`,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>
        </View>

        <FlatList
          data={visibleMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ConversationBubble
              message={item}
              isActive={index === currentIndex}
            />
          )}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View
        style={[
          styles.controls,
          { paddingBottom: insets.bottom + Spacing.lg, backgroundColor: theme.backgroundDefault },
        ]}
      >
        <View style={styles.controlRow}>
          <Pressable
            onPress={handlePrevious}
            disabled={currentIndex === 0}
            style={[
              styles.controlButton,
              { backgroundColor: theme.backgroundSecondary, opacity: currentIndex === 0 ? 0.5 : 1 },
            ]}
          >
            <Feather name="chevron-left" size={24} color={theme.text} />
          </Pressable>

          {isComplete ? (
            <Button onPress={handleRestart} style={styles.mainButton}>
              Practice Again
            </Button>
          ) : (
            <Button onPress={handleNext} style={styles.mainButton}>
              {currentMessage?.role === "user" ? "I Signed It" : "Next"}
            </Button>
          )}

          <Pressable
            onPress={handleNext}
            disabled={isComplete}
            style={[
              styles.controlButton,
              { backgroundColor: theme.backgroundSecondary, opacity: isComplete ? 0.5 : 1 },
            ]}
          >
            <Feather name="chevron-right" size={24} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.hintRow}>
          <Feather name="info" size={14} color={theme.textSecondary} />
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {currentMessage?.role === "partner"
              ? "Watch the sign description above, then tap Next"
              : "Practice the sign shown, then tap 'I Signed It'"}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  avatarContainer: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  avatarOverlay: {
    alignItems: "center",
  },
  conversationSection: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  progressRow: {
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 2,
    marginTop: Spacing.xs,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  messageList: {
    paddingVertical: Spacing.sm,
  },
  controls: {
    padding: Spacing.lg,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    ...Shadows.card,
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  mainButton: {
    flex: 1,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
});
