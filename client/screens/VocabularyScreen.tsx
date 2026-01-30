import React, { useState, useEffect, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { SignCard } from "@/components/SignCard";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { useVocabulary } from "@/hooks/useStorage";
import { Spacing } from "@/constants/theme";
import { vocabularyData, categories } from "@/data/vocabulary";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Sign } from "@/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function VocabularyScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { vocabulary, initializeVocabulary, toggleFavorite } = useVocabulary();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    initializeVocabulary(vocabularyData);
  }, []);

  const displayVocabulary = vocabulary.length > 0 ? vocabulary : vocabularyData;

  const filteredSigns = useMemo(() => {
    return displayVocabulary.filter((sign) => {
      const matchesSearch = sign.word
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || sign.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [displayVocabulary, searchQuery, selectedCategory]);

  const handleSignPress = (signId: string) => {
    navigation.navigate("SignDetail", { signId });
  };

  const handleFavoritePress = (signId: string) => {
    toggleFavorite(signId);
  };

  const renderSign = ({ item }: { item: Sign }) => (
    <SignCard
      sign={item}
      onPress={() => handleSignPress(item.id)}
      onFavoritePress={() => handleFavoritePress(item.id)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        data={filteredSigns}
        keyExtractor={(item) => item.id}
        renderItem={renderSign}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
          filteredSigns.length === 0 && styles.emptyContent,
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search signs..."
            />
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            image={require("../../assets/images/empty-vocabulary.png")}
            title="No signs found"
            description={
              searchQuery
                ? "Try a different search term"
                : "No signs in this category yet"
            }
          />
        }
        stickyHeaderIndices={[0]}
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
  emptyContent: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.md,
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
});
