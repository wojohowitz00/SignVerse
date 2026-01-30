import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import ScenarioDetailScreen from "@/screens/ScenarioDetailScreen";
import ConversationScreen from "@/screens/ConversationScreen";
import SignDetailScreen from "@/screens/SignDetailScreen";
import GrammarDetailScreen from "@/screens/GrammarDetailScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Main: undefined;
  ScenarioDetail: { scenarioId: string };
  Conversation: { scenarioId: string; conversationId: string };
  SignDetail: { signId: string };
  GrammarDetail: { lessonId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScenarioDetail"
        component={ScenarioDetailScreen}
        options={{
          headerTitle: "Scenario",
        }}
      />
      <Stack.Screen
        name="Conversation"
        component={ConversationScreen}
        options={{
          headerTitle: "Practice",
        }}
      />
      <Stack.Screen
        name="SignDetail"
        component={SignDetailScreen}
        options={{
          headerTitle: "Sign Details",
        }}
      />
      <Stack.Screen
        name="GrammarDetail"
        component={GrammarDetailScreen}
        options={{
          headerTitle: "Lesson",
        }}
      />
    </Stack.Navigator>
  );
}
