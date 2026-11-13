export type AppLanguage = 'hi' | 'en';

export type DarkSurfacePreset = 'obsidian' | 'amethyst';

export type TabKey = 'Home' | 'Create' | 'MyProjects' | 'AITools' | 'Settings';

export type AIToolId =
  | 'story-generator'
  | 'image-generator'
  | 'video-generator'
  | 'voice-studio'
  | 'cartoon-studio'
  | 'youtube-studio'
  | 'video-editor';

export type ToolCategory = 'all' | 'writing' | 'visual' | 'audio-video';

export interface AIToolItem {
  id: AIToolId;
  category: Exclude<ToolCategory, 'all'>;
  gradientClass: string;
  title: Record<AppLanguage, string>;
  shortLabel: Record<AppLanguage, string>;
  description: Record<AppLanguage, string>;
  phaseOneNote: Record<AppLanguage, string>;
}

export interface ProjectItem {
  id: string;
  title: string;
  prompt: string;
  toolId: AIToolId;
  outputLanguage: AppLanguage;
  status: 'draft' | 'placeholder';
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface AppPreferences {
  language: AppLanguage;
  darkSurface: DarkSurfacePreset;
  autoSaveDrafts: boolean;
  showStarterPlaceholders: boolean;
  defaultOutputLanguage: AppLanguage;
}

export interface ActiveToolRoute {
  toolId: AIToolId;
  initialPrompt?: string;
  projectId?: string;
  returnTab: TabKey;
}
