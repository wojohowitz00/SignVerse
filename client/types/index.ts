export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  image: any;
  conversations: Conversation[];
}

export type PartnerType = 
  | "family" 
  | "friend" 
  | "colleague" 
  | "doctor" 
  | "nurse"
  | "service" 
  | "stranger";

export interface Conversation {
  id: string;
  title: string;
  description: string;
  partnerType: PartnerType;
  partnerName?: string;
  messages: ConversationMessage[];
}

export interface ConversationMessage {
  id: string;
  role: "partner" | "user";
  signDescription: string;
  englishText: string;
  videoUrl?: string;
  animationId?: string;
}

export type SigningMediaType = "video" | "lottie" | "placeholder";

export interface Sign {
  id: string;
  word: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  videoUrl?: string;
  description: string;
  isFavorite: boolean;
  isLearned: boolean;
}

export interface GrammarLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: any;
  progress: number;
  content: GrammarContent[];
}

export interface GrammarContent {
  id: string;
  type: "text" | "example" | "practice";
  content: string;
  example?: string;
}

export interface UserProgress {
  signsLearned: number;
  totalSigns: number;
  practiceMinutes: number;
  conversationsCompleted: number;
  currentStreak: number;
  weeklyPractice: number[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserProfile {
  displayName: string;
  avatarId: string;
  notificationsEnabled: boolean;
}
