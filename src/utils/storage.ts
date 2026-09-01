import { UserProfile, SavedMoment, ChatMessage, MoodType, PersonalityType } from '../types';
import { INITIAL_USER_PROFILE, INITIAL_USER_PROFILES, INITIAL_SAVED_MOMENTS, INITIAL_CHAT_MESSAGES } from '../data/defaults';

const STORAGE_KEYS = {
  DEVICE_ID: 'riya_device_id',
  USER_PROFILE: 'riya_user_profile_v1',
  USER_PROFILES_LIST: 'riya_user_profiles_list_v1',
  ACTIVE_PROFILE_ID: 'riya_active_profile_id_v1',
  SAVED_MOMENTS: 'riya_saved_moments_v1',
  CHAT_MESSAGES: 'riya_chat_messages_v1',
  ACTIVE_MOOD: 'riya_active_mood_v1',
  ACTIVE_PERSONALITY: 'riya_active_personality_v1',
  SOUND_ENABLED: 'riya_sound_enabled_v1',
  AMBIENT_ENABLED: 'riya_ambient_enabled_v1',
  HAPTICS_ENABLED: 'riya_haptics_enabled_v1',
};

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server_device_id';
  let deviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!deviceId) {
    deviceId = 'riya_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  }
  return deviceId;
}

export function loadUserProfiles(): UserProfile[] {
  if (typeof window === 'undefined') return INITIAL_USER_PROFILES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILES_LIST);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_USER_PROFILES;
}

export function saveUserProfiles(profiles: UserProfile[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER_PROFILES_LIST, JSON.stringify(profiles));
}

export function loadActiveProfileId(): string {
  if (typeof window === 'undefined') return INITIAL_USER_PROFILES[0].id;
  const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
  return id || INITIAL_USER_PROFILES[0].id;
}

export function saveActiveProfileId(profileId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, profileId);
}

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return INITIAL_USER_PROFILE;
  try {
    const profiles = loadUserProfiles();
    const activeId = loadActiveProfileId();
    const found = profiles.find((p) => p.id === activeId);
    if (found) return found;
    if (profiles.length > 0) return profiles[0];

    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_USER_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  
  // Also update in profiles list
  const profiles = loadUserProfiles();
  const index = profiles.findIndex((p) => p.id === profile.id);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  saveUserProfiles(profiles);
  saveActiveProfileId(profile.id);
}

export function loadSavedMoments(): SavedMoment[] {
  if (typeof window === 'undefined') return INITIAL_SAVED_MOMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_MOMENTS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_SAVED_MOMENTS;
}

export function saveSavedMoments(moments: SavedMoment[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SAVED_MOMENTS, JSON.stringify(moments));
}

export function loadChatMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return INITIAL_CHAT_MESSAGES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_CHAT_MESSAGES;
}

export function saveChatMessages(messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
}

export function loadActiveMood(): MoodType {
  if (typeof window === 'undefined') return 'romantic';
  const mood = localStorage.getItem(STORAGE_KEYS.ACTIVE_MOOD) as MoodType;
  return mood || 'romantic';
}

export function saveActiveMood(mood: MoodType): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_MOOD, mood);
}

export function loadActivePersonality(): PersonalityType {
  if (typeof window === 'undefined') return 'romantic_devoted';
  const personality = localStorage.getItem(STORAGE_KEYS.ACTIVE_PERSONALITY) as PersonalityType;
  return personality || 'romantic_devoted';
}

export function saveActivePersonality(personality: PersonalityType): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PERSONALITY, personality);
}

export function loadSoundSettings(): { sound: boolean; ambient: boolean; haptics: boolean } {
  if (typeof window === 'undefined') return { sound: true, ambient: false, haptics: true };
  return {
    sound: localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED) !== 'false',
    ambient: localStorage.getItem(STORAGE_KEYS.AMBIENT_ENABLED) === 'true',
    haptics: localStorage.getItem(STORAGE_KEYS.HAPTICS_ENABLED) !== 'false',
  };
}

export function saveSoundSettings(settings: { sound?: boolean; ambient?: boolean; haptics?: boolean }): void {
  if (typeof window === 'undefined') return;
  if (settings.sound !== undefined) localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(settings.sound));
  if (settings.ambient !== undefined) localStorage.setItem(STORAGE_KEYS.AMBIENT_ENABLED, String(settings.ambient));
  if (settings.haptics !== undefined) localStorage.setItem(STORAGE_KEYS.HAPTICS_ENABLED, String(settings.haptics));
}

export function clearAllMemoryAndReset(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  localStorage.removeItem(STORAGE_KEYS.SAVED_MOMENTS);
  localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_MOOD);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_PERSONALITY);
}
