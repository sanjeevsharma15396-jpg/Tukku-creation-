export type AppLanguage = 'hi' | 'en';

export type DarkSurfacePreset = 'obsidian' | 'amethyst';

export type AIToolId =
  | 'story-generator'
  | 'image-generator'
  | 'video-generator'
  | 'voice-studio'
  | 'cartoon-studio'
  | 'youtube-studio'
  | 'video-editor';

export type ToolCategory = 'all' | 'writing' | 'visual' | 'audio-video';

export type ToolRouteName =
  | 'AIStoryGenerator'
  | 'AIImageGenerator'
  | 'AIVideoGenerator'
  | 'AIVoiceStudio'
  | 'CartoonStudio'
  | 'YouTubeCreatorStudio'
  | 'VideoEditor';

export const TOOL_ID_TO_ROUTE: Record<AIToolId, ToolRouteName> = {
  'story-generator': 'AIStoryGenerator',
  'image-generator': 'AIImageGenerator',
  'video-generator': 'AIVideoGenerator',
  'voice-studio': 'AIVoiceStudio',
  'cartoon-studio': 'CartoonStudio',
  'youtube-studio': 'YouTubeCreatorStudio',
  'video-editor': 'VideoEditor',
};

export interface ToolScreenParams {
  initialPrompt?: string;
  projectId?: string;
}

export type MainTabParamList = {
  Home: undefined;
  Create: { initialToolId?: AIToolId; initialPrompt?: string; projectId?: string } | undefined;
  MyProjects: undefined;
  AITools: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: { screen?: keyof MainTabParamList; params?: MainTabParamList[keyof MainTabParamList] } | undefined;
  AIStoryGenerator: ToolScreenParams | undefined;
  AIImageGenerator: ToolScreenParams | undefined;
  AIVideoGenerator: ToolScreenParams | undefined;
  AIVoiceStudio: ToolScreenParams | undefined;
  CartoonStudio: ToolScreenParams | undefined;
  YouTubeCreatorStudio: ToolScreenParams | undefined;
  VideoEditor: ToolScreenParams | undefined;
};

export interface AIToolItem {
  id: AIToolId;
  category: Exclude<ToolCategory, 'all'>;
  iconName: string;
  gradient: readonly [string, string];
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
