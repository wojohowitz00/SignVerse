import React from "react";
import { FlatList, StyleSheet, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { scenarios } from "@/data/scenarios";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Conversation } from "@/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, "ScenarioDetail">;

export default function ScenarioDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();

  const scenario = scenarios.find((s) => s.id === route.params.scenarioId);

  if (!scenario) {
    return (
      <View style={styles.container}>
        <ThemedText>Scenario not found</ThemedText>
      </View>
    );
  }

  const handleConversationPress = (conversationId: string) => {
    navigation.navigate("Conversation", {
      scenarioId: scenario.id,
      conversationId,
    });
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <Pressable
      onPress={() => handleConversationPress(item.id)}
      style={({ pressed }) => [
        styles.conversationCard,
        {
          backgroundColor: theme.backgroundDefault,
          opacity: pressed ? 0.8 : 1,
        },
        Shadows.card,
      ]}
    >
      <View style={styles.conversationContent}>
        <ThemedText type="body" style={styles.conversationTitle}>
          {item.title}
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.conversationDesc, { color: theme.textSecondary }]}
        >
          {item.description}
        </ThemedText>
        <View style={styles.messageCount}>
          <Feather
            name="message-circle"
            size={14}
            color={theme.textSecondary}
          />
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {item.messages.length} exchanges
          </ThemedText>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        data={scenario.conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Image
              source={scenario.image}
              style={styles.headerImage}
              contentFit="cover"
            />
            <ThemedText type="h2" style={styles.title}>
              {scenario.title}
            </ThemedText>
            <ThemedText
              type="body"
              style={[styles.subtitle, { color: theme.textSecondary }]}
            >
              {scenario.conversations.length} conversations to practice
            </ThemedText>
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
  headerImage: {
    width: "100%",
    height: 180,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    opacity: 0.7,
  },
  conversationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  conversationContent: {
    flex: 1,
  },
  conversationTitle: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  conversationDesc: {
    marginBottom: Spacing.sm,
  },
  messageCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
});
