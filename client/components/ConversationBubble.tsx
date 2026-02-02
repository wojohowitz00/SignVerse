import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { ConversationMessage, PartnerType } from "@/types";
import { getAvatarForPartner } from "@/constants/avatars";

interface ConversationBubbleProps {
  message: ConversationMessage;
  isActive?: boolean;
  partnerType?: PartnerType;
}

export function ConversationBubble({
  message,
  isActive = false,
  partnerType = "stranger",
}: ConversationBubbleProps) {
  const { theme } = useTheme();
  const isPartner = message.role === "partner";
  const avatarSource = getAvatarForPartner(partnerType);

  return (
    <View
      style={[
        styles.container,
        isPartner ? styles.partnerContainer : styles.userContainer,
      ]}
    >
      {isPartner ? (
        <View style={styles.avatarWrapper}>
          <Image source={avatarSource} style={styles.avatarImage} />
        </View>
      ) : null}
      <View
        style={[
          styles.bubble,
          isPartner
            ? [
                styles.partnerBubble,
                { backgroundColor: theme.backgroundSecondary },
              ]
            : [styles.userBubble, { backgroundColor: theme.primary }],
          isActive && styles.activeBubble,
        ]}
      >
        <View style={styles.signRow}>
          <Feather
            name="edit-3"
            size={14}
            color={isPartner ? theme.textSecondary : "rgba(255,255,255,0.7)"}
          />
          <ThemedText
            type="small"
            style={[
              styles.signDescription,
              {
                color: isPartner
                  ? theme.textSecondary
                  : "rgba(255,255,255,0.7)",
              },
            ]}
          >
            {message.signDescription}
          </ThemedText>
        </View>
        <ThemedText
          type="body"
          style={[
            styles.englishText,
            { color: isPartner ? theme.text : "#FFFFFF" },
          ]}
        >
          {message.englishText}
        </ThemedText>
      </View>
      {!isPartner ? (
        <View
          style={[styles.userAvatar, { backgroundColor: theme.accent + "20" }]}
        >
          <Feather name="user" size={20} color={theme.accent} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  partnerContainer: {
    justifyContent: "flex-start",
    paddingRight: Spacing["3xl"],
  },
  userContainer: {
    justifyContent: "flex-end",
    paddingLeft: Spacing["3xl"],
  },
  avatarWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    maxWidth: "85%",
  },
  partnerBubble: {
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  activeBubble: {
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  signRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  signDescription: {
    flex: 1,
    fontStyle: "italic",
  },
  englishText: {
    fontWeight: "500",
  },
});
