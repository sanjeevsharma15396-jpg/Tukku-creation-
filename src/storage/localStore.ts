import { AppPreferences, ProjectItem } from '../types/app';

const STORAGE_KEYS = {
  PROJECTS: 'tukku_creation_projects_v1',
  PREFERENCES: 'tukku_creation_preferences_v1',
  DRAFT_PROMPT: 'tukku_creation_draft_prompt_v1',
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

export function loadPreferences(): AppPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: AppPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadProjects(includePlaceholders: boolean): ProjectItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) {
      const initial = includePlaceholders ? STARTER_PLACEHOLDER_PROJECTS : [];
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as ProjectItem[];
  } catch {
    return includePlaceholders ? STARTER_PLACEHOLDER_PROJECTS : [];
  }
}

export function saveProjects(projects: ProjectItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadDraftPrompt(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.DRAFT_PROMPT) ?? '';
  } catch {
    return '';
  }
}

export function saveDraftPrompt(prompt: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DRAFT_PROMPT, prompt);
  } catch {
    // Ignore storage quota errors
  }
}

export function clearAllLocalData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.DRAFT_PROMPT);
  } catch {
    // Ignore storage errors
  }
}
