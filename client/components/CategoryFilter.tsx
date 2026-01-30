import React from "react";
import { StyleSheet, ScrollView, Pressable } from "react-native";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { theme } = useTheme();

  const handlePress = (category: string) => {
    Haptics.selectionAsync();
    onSelectCategory(category);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Pressable
        onPress={() => handlePress("All")}
        style={[
          styles.chip,
          selectedCategory === "All"
            ? { backgroundColor: theme.primary }
            : { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <ThemedText
          type="small"
          style={[
            styles.chipText,
            { color: selectedCategory === "All" ? "#FFFFFF" : theme.text },
          ]}
        >
          All
        </ThemedText>
      </Pressable>
      {categories.map((category) => (
        <Pressable
          key={category}
          onPress={() => handlePress(category)}
          style={[
            styles.chip,
            selectedCategory === category
              ? { backgroundColor: theme.primary }
              : { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <ThemedText
            type="small"
            style={[
              styles.chipText,
              {
                color: selectedCategory === category ? "#FFFFFF" : theme.text,
              },
            ]}
          >
            {category}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  chipText: {
    fontWeight: "500",
  },
});
