import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProgress, UserProfile, Sign } from "@/types";

const STORAGE_KEYS = {
  USER_PROGRESS: "@signspeak_progress",
  USER_PROFILE: "@signspeak_profile",
  VOCABULARY: "@signspeak_vocabulary",
  GRAMMAR_PROGRESS: "@signspeak_grammar",
};

const defaultProgress: UserProgress = {
  signsLearned: 0,
  totalSigns: 50,
  practiceMinutes: 0,
  conversationsCompleted: 0,
  currentStreak: 0,
  weeklyPractice: [0, 0, 0, 0, 0, 0, 0],
  achievements: [],
};

const defaultProfile: UserProfile = {
  displayName: "Learner",
  avatarId: "default",
  notificationsEnabled: true,
};

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      if (data) {
        setProgress(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = useCallback(async (updates: Partial<UserProgress>) => {
    try {
      const newProgress = { ...progress, ...updates };
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROGRESS,
        JSON.stringify(newProgress)
      );
      setProgress(newProgress);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  }, [progress]);

  const incrementSignsLearned = useCallback(async () => {
    await updateProgress({ signsLearned: progress.signsLearned + 1 });
  }, [progress, updateProgress]);

  const incrementConversations = useCallback(async () => {
    await updateProgress({
      conversationsCompleted: progress.conversationsCompleted + 1,
    });
  }, [progress, updateProgress]);

  const addPracticeTime = useCallback(async (minutes: number) => {
    const today = new Date().getDay();
    const newWeekly = [...progress.weeklyPractice];
    newWeekly[today] += minutes;
    await updateProgress({
      practiceMinutes: progress.practiceMinutes + minutes,
      weeklyPractice: newWeekly,
    });
  }, [progress, updateProgress]);

  return {
    progress,
    isLoading,
    updateProgress,
    incrementSignsLearned,
    incrementConversations,
    addPracticeTime,
  };
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (data) {
        setProfile(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      const newProfile = { ...profile, ...updates };
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROFILE,
        JSON.stringify(newProfile)
      );
      setProfile(newProfile);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }, [profile]);

  return { profile, isLoading, updateProfile };
}

export function useVocabulary() {
  const [vocabulary, setVocabulary] = useState<Sign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVocabulary();
  }, []);

  const loadVocabulary = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.VOCABULARY);
      if (data) {
        setVocabulary(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading vocabulary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = useCallback(async (signId: string) => {
    const updated = vocabulary.map((sign) =>
      sign.id === signId ? { ...sign, isFavorite: !sign.isFavorite } : sign
    );
    await AsyncStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(updated));
    setVocabulary(updated);
  }, [vocabulary]);

  const markAsLearned = useCallback(async (signId: string) => {
    const updated = vocabulary.map((sign) =>
      sign.id === signId ? { ...sign, isLearned: true } : sign
    );
    await AsyncStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(updated));
    setVocabulary(updated);
  }, [vocabulary]);

  const initializeVocabulary = useCallback(async (signs: Sign[]) => {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.VOCABULARY);
    if (!existing) {
      await AsyncStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(signs));
      setVocabulary(signs);
    } else {
      setVocabulary(JSON.parse(existing));
    }
    setIsLoading(false);
  }, []);

  return {
    vocabulary,
    isLoading,
    toggleFavorite,
    markAsLearned,
    initializeVocabulary,
  };
}

export function useGrammarProgress() {
  const [lessonProgress, setLessonProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.GRAMMAR_PROGRESS);
      if (data) {
        setLessonProgress(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading grammar progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLessonProgress = useCallback(async (lessonId: string, progress: number) => {
    const updated = { ...lessonProgress, [lessonId]: progress };
    await AsyncStorage.setItem(STORAGE_KEYS.GRAMMAR_PROGRESS, JSON.stringify(updated));
    setLessonProgress(updated);
  }, [lessonProgress]);

  return { lessonProgress, isLoading, updateLessonProgress };
}
