import React, { useState } from "react";
import { StyleSheet, View, FlatList, Pressable, Image } from "react-native";
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
import { PartnerType } from "@/types";
import { getAvatarForPartner } from "@/constants/avatars";

const getPartnerTypeForScenario = (scenarioId: string): PartnerType => {
  switch (scenarioId) {
    case "home":
      return "family";
    case "work":
      return "colleague";
    case "errands":
      return "service";
    case "doctor":
      return "doctor";
    case "social":
      return "friend";
    default:
      return "stranger";
  }
};

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

  const partnerType = getPartnerTypeForScenario(route.params.scenarioId);
  const avatarSource = getAvatarForPartner(partnerType);

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
          <View style={styles.avatarImageWrapper}>
            <Image source={avatarSource} style={styles.avatarImage} />
          </View>
          <View style={styles.avatarOverlay}>
            <ThemedText type="body" style={{ color: theme.text, fontWeight: "600" }}>
              {partnerType === "family" ? "Family Member" :
               partnerType === "friend" ? "Friend" :
               partnerType === "colleague" ? "Colleague" :
               partnerType === "doctor" ? "Healthcare Provider" :
               partnerType === "service" ? "Service Worker" : "Partner"}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: 4 }}>
              {currentMessage?.role === "partner" ? "Partner is signing" : "Your turn to sign"}
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
              partnerType={partnerType}
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
  avatarImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  avatarImage: {
    width: 100,
    height: 100,
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
