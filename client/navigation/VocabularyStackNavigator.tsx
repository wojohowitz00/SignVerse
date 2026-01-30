import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import VocabularyScreen from "@/screens/VocabularyScreen";
import GrammarScreen from "@/screens/GrammarScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useTheme } from "@/hooks/useTheme";

export type VocabularyStackParamList = {
  Vocabulary: undefined;
  Grammar: undefined;
};

const Stack = createNativeStackNavigator<VocabularyStackParamList>();

type NavigationProp = NativeStackNavigationProp<VocabularyStackParamList>;

function GrammarButton() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={() => navigation.navigate("Grammar")}
      hitSlop={8}
      style={{ padding: 4 }}
    >
      <Feather name="book-open" size={22} color={theme.text} />
    </Pressable>
  );
}

export default function VocabularyStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Vocabulary"
        component={VocabularyScreen}
        options={{
          headerTitle: "Vocabulary",
          headerRight: () => <GrammarButton />,
        }}
      />
      <Stack.Screen
        name="Grammar"
        component={GrammarScreen}
        options={{
          headerTitle: "Grammar",
        }}
      />
    </Stack.Navigator>
  );
}
