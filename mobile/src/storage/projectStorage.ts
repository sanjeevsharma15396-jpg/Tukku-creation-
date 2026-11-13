import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppPreferences, ProjectItem } from '../types';

const STORAGE_KEYS = {
  PROJECTS: '@tukku_creation/projects_v1',
  PREFERENCES: '@tukku_creation/preferences_v1',
  DRAFT_PROMPT: '@tukku_creation/draft_prompt_v1',
};

export const DEFAULT_PREFERENCES: AppPreferences = {
  language: 'hi',
  darkSurface: 'obsidian',
  autoSaveDrafts: true,
  showStarterPlaceholders: true,
  defaultOutputLanguage: 'hi',
};

export const STARTER_PLACEHOLDER_PROJECTS: ProjectItem[] = [
  {
    id: 'placeholder-story-1',
    title: 'चाँदनी घाटी की लोककथा',
    prompt: 'एक प्राचीन हिमालयी गाँव की रहस्यमयी कहानी जहाँ संगीत से तारे चमकते हैं।',
    toolId: 'story-generator',
    outputLanguage: 'hi',
    status: 'placeholder',
    metadata: { genre: 'लोककथा', tone: 'भावनात्मक' },
    createdAt: '2026-11-10T09:30:00.000Z',
    updatedAt: '2026-11-10T09:30:00.000Z',
  },
  {
    id: 'placeholder-youtube-1',
    title: 'Tech & AI Shorts Series',
    prompt: '60-second YouTube Shorts script explaining daily productivity workflows in simple Hindi.',
    toolId: 'youtube-studio',
    outputLanguage: 'hi',
    status: 'placeholder',
    metadata: { format: 'YouTube Shorts', hook: '30 सेकंड में अपनी प्रोडक्टिविटी बढ़ाएं' },
    createdAt: '2026-11-11T14:15:00.000Z',
    updatedAt: '2026-11-11T14:15:00.000Z',
  },
  {
    id: 'placeholder-cartoon-1',
    title: 'नन्हा रोबोट और जंगल',
    prompt: 'दोस्ताना कार्टून किरदार जो बच्चों को प्रकृति और विज्ञान सिखाता है।',
    toolId: 'cartoon-studio',
    outputLanguage: 'hi',
    status: 'placeholder',
    metadata: { character: 'नन्हा रोबोट', style: '2D क्लासिक' },
    createdAt: '2026-11-12T08:00:00.000Z',
    updatedAt: '2026-11-12T08:00:00.000Z',
  },
];

export async function loadPreferences(): Promise<AppPreferences> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export async function savePreferences(preferences: AppPreferences): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
}

export async function loadProjects(includePlaceholders: boolean): Promise<ProjectItem[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROJECTS);
  if (!raw) {
    const initial = includePlaceholders ? STARTER_PLACEHOLDER_PROJECTS : [];
    await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(raw) as ProjectItem[];
}

export async function saveProjects(projects: ProjectItem[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

export async function loadDraftPrompt(): Promise<string> {
  try {
    return (await AsyncStorage.getItem(STORAGE_KEYS.DRAFT_PROMPT)) ?? '';
  } catch {
    return '';
  }
}

export async function saveDraftPrompt(prompt: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.DRAFT_PROMPT, prompt);
}

export async function clearAllLocalData(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.PROJECTS,
    STORAGE_KEYS.PREFERENCES,
    STORAGE_KEYS.DRAFT_PROMPT,
  ]);
}
