import React, { useState } from "react";
import { StyleSheet, View, TextInput, Switch, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile, useUserProgress } from "@/hooks/useStorage";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { profile, updateProfile } = useUserProfile();
  const { progress } = useUserProgress();

  const [displayName, setDisplayName] = useState(profile.displayName);

  const handleNameChange = (text: string) => {
    setDisplayName(text);
  };

  const handleNameBlur = () => {
    if (displayName !== profile.displayName) {
      updateProfile({ displayName });
    }
  };

  const handleNotificationToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateProfile({ notificationsEnabled: !profile.notificationsEnabled });
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.avatarSection}>
        <View
          style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}
        >
          <Feather name="user" size={48} color={theme.primary} />
        </View>
        <ThemedText type="h3">{profile.displayName}</ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          Learning ASL since {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </ThemedText>
      </View>

      <View
        style={[
          styles.statsCard,
          { backgroundColor: theme.backgroundDefault },
          Shadows.card,
        ]}
      >
        <View style={styles.statItem}>
          <ThemedText type="h3" style={{ color: theme.primary }}>
            {progress.signsLearned}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            Signs
          </ThemedText>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statItem}>
          <ThemedText type="h3" style={{ color: theme.accent }}>
            {progress.conversationsCompleted}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            Conversations
          </ThemedText>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statItem}>
          <ThemedText type="h3" style={{ color: theme.success }}>
            {progress.currentStreak}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            Day Streak
          </ThemedText>
        </View>
      </View>

      <ThemedText type="h4" style={styles.sectionTitle}>
        Settings
      </ThemedText>

      <View
        style={[
          styles.settingsCard,
          { backgroundColor: theme.backgroundDefault },
          Shadows.card,
        ]}
      >
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View
              style={[styles.settingIcon, { backgroundColor: theme.primary + "20" }]}
            >
              <Feather name="user" size={18} color={theme.primary} />
            </View>
            <ThemedText type="body">Display Name</ThemedText>
          </View>
          <TextInput
            style={[
              styles.nameInput,
              { color: theme.text, backgroundColor: theme.backgroundSecondary },
            ]}
            value={displayName}
            onChangeText={handleNameChange}
            onBlur={handleNameBlur}
            placeholder="Your name"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View
              style={[styles.settingIcon, { backgroundColor: theme.accent + "20" }]}
            >
              <Feather name="bell" size={18} color={theme.accent} />
            </View>
            <ThemedText type="body">Practice Reminders</ThemedText>
          </View>
          <Switch
            value={profile.notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: theme.border, true: theme.primary + "60" }}
            thumbColor={profile.notificationsEnabled ? theme.primary : theme.textSecondary}
          />
        </View>
      </View>

      <ThemedText type="h4" style={styles.sectionTitle}>
        About
      </ThemedText>

      <View
        style={[
          styles.settingsCard,
          { backgroundColor: theme.backgroundDefault },
          Shadows.card,
        ]}
      >
        <Pressable style={styles.aboutRow}>
          <View style={styles.settingLeft}>
            <View
              style={[styles.settingIcon, { backgroundColor: theme.success + "20" }]}
            >
              <Feather name="info" size={18} color={theme.success} />
            </View>
            <ThemedText type="body">About SignSpeak</ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <Pressable style={styles.aboutRow}>
          <View style={styles.settingLeft}>
            <View
              style={[styles.settingIcon, { backgroundColor: theme.warning + "20" }]}
            >
              <Feather name="heart" size={18} color={theme.warning} />
            </View>
            <ThemedText type="body">Rate the App</ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <Pressable style={styles.aboutRow}>
          <View style={styles.settingLeft}>
            <View
              style={[styles.settingIcon, { backgroundColor: theme.error + "20" }]}
            >
              <Feather name="help-circle" size={18} color={theme.error} />
            </View>
            <ThemedText type="body">Help & Support</ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.footer}>
        <ThemedText type="caption" style={{ color: theme.textSecondary, textAlign: "center" }}>
          SignSpeak v1.0.0
        </ThemedText>
        <ThemedText type="caption" style={{ color: theme.textSecondary, textAlign: "center" }}>
          Made with love for the Deaf community
        </ThemedText>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  statsCard: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: "100%",
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  settingsCard: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  nameInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
    minWidth: 120,
    textAlign: "right",
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.lg,
  },
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  footer: {
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
});
