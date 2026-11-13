import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { TRANSLATIONS, TranslationSchema } from '../i18n/translations';
import {
  clearAllLocalData,
  DEFAULT_PREFERENCES,
  loadDraftPrompt,
  loadPreferences,
  loadProjects,
  saveDraftPrompt,
  savePreferences,
  saveProjects,
  STARTER_PLACEHOLDER_PROJECTS,
} from '../storage/projectStorage';
import { THEME_PRESETS } from '../theme/colors';
import { AIToolId, AppLanguage, AppPreferences, DarkSurfacePreset, ProjectItem } from '../types';

interface AppContextValue {
  isHydrated: boolean;
  isLoadingProjects: boolean;
  isSaving: boolean;
  storageError: string | null;
  clearStorageError: () => void;
  showSplash: boolean;
  dismissSplash: () => void;
  replaySplash: () => void;
  preferences: AppPreferences;
  language: AppLanguage;
  t: TranslationSchema;
  theme: (typeof THEME_PRESETS)[DarkSurfacePreset];
  projects: ProjectItem[];
  draftPrompt: string;
  setDraftPrompt: (prompt: string) => void;
  setLanguage: (lang: AppLanguage) => Promise<void>;
  setDarkSurface: (preset: DarkSurfacePreset) => Promise<void>;
  updatePreferences: (partial: Partial<AppPreferences>) => Promise<void>;
  refreshProjects: () => Promise<void>;
  upsertProject: (input: {
    id?: string;
    title: string;
    prompt: string;
    toolId: AIToolId;
    outputLanguage: AppLanguage;
    metadata?: Record<string, string>;
  }) => Promise<ProjectItem>;
  deleteProject: (id: string) => Promise<void>;
  restorePlaceholders: () => Promise<void>;
  resetAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [draftPrompt, setDraftPromptState] = useState('');

  const hydrateAll = useCallback(async () => {
    setIsLoadingProjects(true);
    setStorageError(null);
    try {
      const [loadedPrefs, loadedDraft] = await Promise.all([
        loadPreferences(),
        loadDraftPrompt(),
      ]);
      const loadedProjects = await loadProjects(loadedPrefs.showStarterPlaceholders);
      setPreferences(loadedPrefs);
      setProjects(loadedProjects);
      setDraftPromptState(loadedPrefs.autoSaveDrafts ? loadedDraft : '');
    } catch {
      setStorageError(TRANSLATIONS.hi.common.storageErrorBody);
    } finally {
      setIsLoadingProjects(false);
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    hydrateAll();
  }, [hydrateAll]);

  const dismissSplash = useCallback(() => setShowSplash(false), []);
  const replaySplash = useCallback(() => setShowSplash(true), []);
  const clearStorageError = useCallback(() => setStorageError(null), []);

  const refreshProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    setStorageError(null);
    try {
      const loaded = await loadProjects(preferences.showStarterPlaceholders);
      setProjects(loaded);
    } catch {
      setStorageError(TRANSLATIONS[preferences.language].common.storageErrorBody);
    } finally {
      setIsLoadingProjects(false);
    }
  }, [preferences.language, preferences.showStarterPlaceholders]);

  const setDraftPrompt = useCallback(
    (prompt: string) => {
      setDraftPromptState(prompt);
      if (preferences.autoSaveDrafts) {
        saveDraftPrompt(prompt).catch(() => {});
      }
    },
    [preferences.autoSaveDrafts],
  );

  const updatePreferences = useCallback(async (partial: Partial<AppPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...partial };
      savePreferences(next).catch(() => {
        setStorageError(TRANSLATIONS[next.language].common.storageErrorBody);
      });
      return next;
    });
  }, []);

  const setLanguage = useCallback(
    async (language: AppLanguage) => {
      await updatePreferences({ language });
    },
    [updatePreferences],
  );

  const setDarkSurface = useCallback(
    async (darkSurface: DarkSurfacePreset) => {
      await updatePreferences({ darkSurface });
    },
    [updatePreferences],
  );

  const upsertProject = useCallback(
    async (input: {
      id?: string;
      title: string;
      prompt: string;
      toolId: AIToolId;
      outputLanguage: AppLanguage;
      metadata?: Record<string, string>;
    }): Promise<ProjectItem> => {
      setIsSaving(true);
      setStorageError(null);
      const now = new Date().toISOString();

      try {
        const existingIndex = input.id ? projects.findIndex((p) => p.id === input.id) : -1;
        let savedItem: ProjectItem;
        let next: ProjectItem[];

        if (existingIndex >= 0) {
          savedItem = {
            ...projects[existingIndex],
            title: input.title,
            prompt: input.prompt,
            toolId: input.toolId,
            outputLanguage: input.outputLanguage,
            metadata: input.metadata ?? projects[existingIndex].metadata,
            status: 'draft',
            updatedAt: now,
          };
          next = [savedItem, ...projects.filter((p) => p.id !== savedItem.id)];
        } else {
          savedItem = {
            id: `proj-${Date.now()}`,
            title: input.title,
            prompt: input.prompt,
            toolId: input.toolId,
            outputLanguage: input.outputLanguage,
            metadata: input.metadata,
            status: 'draft',
            createdAt: now,
            updatedAt: now,
          };
          next = [savedItem, ...projects];
        }

        await saveProjects(next);
        setProjects(next);
        return savedItem;
      } catch (err) {
        setStorageError(TRANSLATIONS[preferences.language].common.storageErrorBody);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [preferences.language, projects],
  );

  const deleteProject = useCallback(
    async (id: string) => {
      setStorageError(null);
      const next = projects.filter((item) => item.id !== id);
      try {
        await saveProjects(next);
        setProjects(next);
      } catch {
        setStorageError(TRANSLATIONS[preferences.language].common.storageErrorBody);
      }
    },
    [preferences.language, projects],
  );

  const restorePlaceholders = useCallback(async () => {
    setIsLoadingProjects(true);
    setStorageError(null);
    try {
      const existingIds = new Set(projects.map((p) => p.id));
      const missing = STARTER_PLACEHOLDER_PROJECTS.filter((p) => !existingIds.has(p.id));
      const next = [...projects, ...missing];
      await saveProjects(next);
      setProjects(next);
    } catch {
      setStorageError(TRANSLATIONS[preferences.language].common.storageErrorBody);
    } finally {
      setIsLoadingProjects(false);
    }
  }, [preferences.language, projects]);

  const resetAllData = useCallback(async () => {
    setStorageError(null);
    try {
      await clearAllLocalData();
      setPreferences(DEFAULT_PREFERENCES);
      setProjects([]);
      setDraftPromptState('');
    } catch {
      setStorageError(TRANSLATIONS[preferences.language].common.storageErrorBody);
    }
  }, [preferences.language]);

  const language = preferences.language;
  const t = TRANSLATIONS[language];
  const theme = THEME_PRESETS[preferences.darkSurface];

  return (
    <AppContext.Provider
      value={{
        isHydrated,
        isLoadingProjects,
        isSaving,
        storageError,
        clearStorageError,
        showSplash,
        dismissSplash,
        replaySplash,
        preferences,
        language,
        t,
        theme,
        projects,
        draftPrompt,
        setDraftPrompt,
        setLanguage,
        setDarkSurface,
        updatePreferences,
        refreshProjects,
        upsertProject,
        deleteProject,
        restorePlaceholders,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
