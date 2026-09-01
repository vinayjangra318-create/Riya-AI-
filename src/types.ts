export type MoodType = 'romantic' | 'playful' | 'deep' | 'caring' | 'feisty' | 'mysterious';

export type PersonalityType = 
  | 'romantic_devoted'
  | 'playful_teasing'
  | 'intellectual_poetic'
  | 'gentle_comforting'
  | 'sassy_bold';

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  bio?: string;
  avatarUrl?: string;
  avatarPreset?: string;
  relationshipDynamic?: string;
  likes: string;
  dislikes: string;
  customNotes?: string;
  metDate?: string;
  languagePreference?: 'hindi' | 'hinglish' | 'english';
  intimacyScore?: number;
  favoriteTopics?: string[];
  themeColor?: string;
  createdAt?: number;
  isDefault?: boolean;
}

export interface SavedMoment {
  id: string;
  quote: string;
  context: string;
  date: string;
  tag: string;
  emotion: 'heart' | 'sparkle' | 'rose' | 'moon' | 'flame';
  profileId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'riya';
  text: string;
  timestamp: number;
  mood?: MoodType;
  isSaved?: boolean;
  suggestedTag?: string;
  profileId?: string;
}

export interface PersonalityOption {
  id: PersonalityType;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
}

export interface MoodOption {
  id: MoodType;
  label: string;
  vibe: string;
  icon: string;
  color: string;
  accentHex: string;
  greeting: string;
}

export type AppScreen = 'home' | 'chat' | 'memory' | 'profiles' | 'settings';
