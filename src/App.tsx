/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  Battery,
  FolderOpen,
  Languages,
  Loader2,
  Play,
  RotateCcw,
  Signal,
  Smartphone,
  Wifi,
} from 'lucide-react';
import { AIToolsScreen } from './components/AIToolsScreen';
import { BottomNav } from './components/BottomNav';
import { BrandLogo } from './components/BrandLogo';
import { CreateScreen } from './components/CreateScreen';
import { HomeScreen } from './components/HomeScreen';
import { MyProjectsScreen } from './components/MyProjectsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { SplashScreen } from './components/SplashScreen';
import { AIImageGeneratorScreen } from './components/tools/AIImageGeneratorScreen';
import { AIStoryGeneratorScreen } from './components/tools/AIStoryGeneratorScreen';
import { AIVideoGeneratorScreen } from './components/tools/AIVideoGeneratorScreen';
import { AIVoiceStudioScreen } from './components/tools/AIVoiceStudioScreen';
import { CartoonStudioScreen } from './components/tools/CartoonStudioScreen';
import { VideoEditorScreen } from './components/tools/VideoEditorScreen';
import { YouTubeCreatorStudioScreen } from './components/tools/YouTubeCreatorStudioScreen';
import { AI_TOOLS } from './data/tools';
import { TRANSLATIONS } from './i18n/translations';
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
} from './storage/localStore';
import {
  ActiveToolRoute,
  AIToolId,
  AppLanguage,
  AppPreferences,
  DarkSurfacePreset,
  ProjectItem,
  TabKey,
} from './types/app';

export default function App() {
  const [preferences, setPreferences] = useState<AppPreferences>(() => loadPreferences());
  const [projects, setProjects] = useState<ProjectItem[]>(() =>
    loadProjects(loadPreferences().showStarterPlaceholders),
  );
  const [draftPrompt, setDraftPromptState] = useState<string>(() => {
    const prefs = loadPreferences();
    return prefs.autoSaveDrafts ? loadDraftPrompt() : '';
  });

  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  const [showSplash, setShowSplash] = useState(true);
  const [splashKey, setSplashKey] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>('Home');
  const [activeToolRoute, setActiveToolRoute] = useState<ActiveToolRoute | null>(null);
  const [createToolId, setCreateToolId] = useState<AIToolId>('story-generator');
  const [createInitialPrompt, setCreateInitialPrompt] = useState('');
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const language = preferences.language;
  const t = TRANSLATIONS[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const bgClass =
    preferences.darkSurface === 'amethyst' ? 'bg-[#0B0714]' : 'bg-[#07060B]';
  const surfaceClass =
    preferences.darkSurface === 'amethyst' ? 'bg-[#140E24]' : 'bg-[#100D1A]';
  const elevatedClass =
    preferences.darkSurface === 'amethyst' ? 'bg-[#1D1433]' : 'bg-[#171226]';
  const heroGradientClass =
    preferences.darkSurface === 'amethyst'
      ? 'from-[#240B47] via-[#3B0764] to-[#120B24]'
      : 'from-[#190B33] via-[#2E1065] to-[#0D0917]';

  const handleSelectTab = useCallback((tab: TabKey) => {
    setActiveToolRoute(null);
    setActiveTab(tab);
  }, []);

  const handleOpenTool = useCallback(
    (toolId: AIToolId, initialPrompt?: string, projectId?: string) => {
      setActiveToolRoute({
        toolId,
        initialPrompt,
        projectId,
        returnTab: activeTab,
      });
    },
    [activeTab],
  );

  const handleBackFromTool = useCallback(() => {
    setActiveToolRoute((prev) => {
      if (prev) {
        setActiveTab(prev.returnTab);
      }
      return null;
    });
  }, []);

  const handleRefreshProjects = useCallback(() => {
    setIsLoadingProjects(true);
    setStorageError(null);
    setTimeout(() => {
      try {
        const loaded = loadProjects(preferences.showStarterPlaceholders);
        setProjects(loaded);
      } catch {
        setStorageError(t.common.storageErrorBody);
      } finally {
        setIsLoadingProjects(false);
      }
    }, 320);
  }, [preferences.showStarterPlaceholders, t.common.storageErrorBody]);

  const handleChangeDraftPrompt = useCallback(
    (value: string) => {
      setDraftPromptState(value);
      if (preferences.autoSaveDrafts) {
        saveDraftPrompt(value);
      }
    },
    [preferences.autoSaveDrafts],
  );

  const updatePreferences = useCallback((partial: Partial<AppPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...partial };
      savePreferences(next);
      return next;
    });
  }, []);

  const handleSetLanguage = useCallback(
    (lang: AppLanguage) => {
      updatePreferences({ language: lang });
    },
    [updatePreferences],
  );

  const handleSetDarkSurface = useCallback(
    (darkSurface: DarkSurfacePreset) => {
      updatePreferences({ darkSurface });
    },
    [updatePreferences],
  );

  const handlePrepareDraft = useCallback((prompt: string, toolId?: AIToolId) => {
    setActiveToolRoute(null);
    setEditingProject(null);
    setCreateToolId(toolId ?? 'story-generator');
    setCreateInitialPrompt(prompt);
    setActiveTab('Create');
  }, []);

  const handleOpenProject = useCallback(
    (project: ProjectItem) => {
      handleOpenTool(project.toolId, project.prompt, project.id);
    },
    [handleOpenTool],
  );

  const handleSaveProject = useCallback(
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
      await new Promise((resolve) => setTimeout(resolve, 220));

      const now = new Date().toISOString();
      let savedResult: ProjectItem = {
        id: input.id ?? `proj-${Date.now()}`,
        title: input.title,
        prompt: input.prompt,
        toolId: input.toolId,
        outputLanguage: input.outputLanguage,
        metadata: input.metadata,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      };

      setProjects((prev) => {
        const idx = input.id ? prev.findIndex((p) => p.id === input.id) : -1;
        let next: ProjectItem[];
        if (idx >= 0) {
          savedResult = {
            ...prev[idx],
            title: input.title,
            prompt: input.prompt,
            toolId: input.toolId,
            outputLanguage: input.outputLanguage,
            metadata: input.metadata ?? prev[idx].metadata,
            status: 'draft',
            updatedAt: now,
          };
          next = [savedResult, ...prev.filter((p) => p.id !== savedResult.id)];
        } else {
          next = [savedResult, ...prev];
        }
        saveProjects(next);
        return next;
      });

      setIsSaving(false);
      return savedResult;
    },
    [],
  );

  const handleDeleteProject = useCallback((id: string) => {
    setProjects((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveProjects(next);
      return next;
    });
  }, []);

  const handleRestorePlaceholders = useCallback(() => {
    setStorageError(null);
    setProjects((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const missing = STARTER_PLACEHOLDER_PROJECTS.filter((p) => !existingIds.has(p.id));
      const next = [...prev, ...missing];
      saveProjects(next);
      return next;
    });
  }, []);

  const handleResetStorage = useCallback(() => {
    clearAllLocalData();
    setPreferences(DEFAULT_PREFERENCES);
    setProjects([]);
    setDraftPromptState('');
    setEditingProject(null);
    setStorageError(null);
  }, []);

  const handleReplaySplash = useCallback(() => {
    setSplashKey((k) => k + 1);
    setShowSplash(true);
  }, []);

  const tabNavButtons: { key: TabKey; label: string }[] = [
    { key: 'Home', label: t.tabs.home },
    { key: 'Create', label: t.tabs.create },
    { key: 'MyProjects', label: t.tabs.projects },
    { key: 'AITools', label: t.tabs.tools },
    { key: 'Settings', label: t.tabs.settings },
  ];

  const renderActiveToolScreen = () => {
    if (!activeToolRoute) return null;
    const existingProject = activeToolRoute.projectId
      ? projects.find((p) => p.id === activeToolRoute.projectId)
      : undefined;

    const commonProps = {
      language,
      t,
      surfaceClass,
      elevatedClass,
      defaultOutputLanguage: preferences.defaultOutputLanguage,
      initialPrompt: activeToolRoute.initialPrompt,
      existingProject,
      isSaving,
      onBack: handleBackFromTool,
      onViewProjects: () => {
        setActiveToolRoute(null);
        setActiveTab('MyProjects');
      },
      onSaveProject: handleSaveProject,
    };

    switch (activeToolRoute.toolId) {
      case 'story-generator':
        return <AIStoryGeneratorScreen {...commonProps} />;
      case 'image-generator':
        return <AIImageGeneratorScreen {...commonProps} />;
      case 'video-generator':
        return <AIVideoGeneratorScreen {...commonProps} />;
      case 'voice-studio':
        return <AIVoiceStudioScreen {...commonProps} />;
      case 'cartoon-studio':
        return <CartoonStudioScreen {...commonProps} />;
      case 'youtube-studio':
        return <YouTubeCreatorStudioScreen {...commonProps} />;
      case 'video-editor':
        return <VideoEditorScreen {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050408] text-[#F5F3FF] flex flex-col lg:flex-row items-center justify-center lg:gap-10 md:p-6">
      {/* Android Device Preview Viewport */}
      <main className="w-full md:w-[392px] h-dvh md:h-[812px] md:max-h-[92dvh] md:rounded-[42px] md:border-[8px] md:border-[#1E1730] md:shadow-[0_32px_90px_rgba(88,28,135,0.35)] overflow-hidden relative flex flex-col shrink-0">
        {/* Android Status Bar */}
        <div
          className={`shrink-0 h-9 px-5 flex items-center justify-between text-[11px] font-medium text-[#D8CEF0] ${bgClass}`}
        >
          <span className="font-mono tabular-nums">19:35</span>
          <div className="hidden md:block w-20 h-4 rounded-full bg-black/70 border border-violet-300/10" />
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Active Screen Scroll Area */}
        <div className={`flex-1 overflow-y-auto no-scrollbar ${bgClass}`}>
          {activeToolRoute ? (
            renderActiveToolScreen()
          ) : (
            <>
              {activeTab === 'Home' ? (
                <HomeScreen
                  language={language}
                  t={t}
                  surfaceClass={surfaceClass}
                  elevatedClass={elevatedClass}
                  heroGradientClass={heroGradientClass}
                  draftPrompt={draftPrompt}
                  onChangeDraftPrompt={handleChangeDraftPrompt}
                  projects={projects}
                  isLoadingProjects={isLoadingProjects}
                  storageError={storageError}
                  onRetryStorage={handleRefreshProjects}
                  onPrepareDraft={handlePrepareDraft}
                  onOpenTool={(toolId, prompt) => handleOpenTool(toolId, prompt)}
                  onOpenProject={handleOpenProject}
                  onViewAllProjects={() => handleSelectTab('MyProjects')}
                  onViewAllTools={() => handleSelectTab('AITools')}
                />
              ) : null}

              {activeTab === 'Create' ? (
                <CreateScreen
                  language={language}
                  t={t}
                  surfaceClass={surfaceClass}
                  elevatedClass={elevatedClass}
                  defaultOutputLanguage={preferences.defaultOutputLanguage}
                  initialToolId={createToolId}
                  initialPrompt={createInitialPrompt}
                  editingProject={editingProject}
                  isSaving={isSaving}
                  onSaveProject={handleSaveProject}
                  onOpenDedicatedTool={(toolId, prompt) => handleOpenTool(toolId, prompt)}
                  onClearEditing={() => {
                    setEditingProject(null);
                    setCreateInitialPrompt('');
                  }}
                  onOpenMyProjects={() => handleSelectTab('MyProjects')}
                />
              ) : null}

              {activeTab === 'MyProjects' ? (
                <MyProjectsScreen
                  language={language}
                  t={t}
                  surfaceClass={surfaceClass}
                  projects={projects}
                  isLoadingProjects={isLoadingProjects}
                  storageError={storageError}
                  onRefreshProjects={handleRefreshProjects}
                  onOpenProject={handleOpenProject}
                  onDeleteProject={handleDeleteProject}
                  onCreateNew={() => {
                    setEditingProject(null);
                    setCreateInitialPrompt('');
                    handleSelectTab('Create');
                  }}
                  onRestorePlaceholders={handleRestorePlaceholders}
                />
              ) : null}

              {activeTab === 'AITools' ? (
                <AIToolsScreen
                  language={language}
                  t={t}
                  surfaceClass={surfaceClass}
                  onSelectTool={(toolId) => handleOpenTool(toolId)}
                />
              ) : null}

              {activeTab === 'Settings' ? (
                <SettingsScreen
                  t={t}
                  preferences={preferences}
                  surfaceClass={surfaceClass}
                  elevatedClass={elevatedClass}
                  onSetLanguage={handleSetLanguage}
                  onSetDarkSurface={handleSetDarkSurface}
                  onUpdatePreferences={updatePreferences}
                  onReplaySplash={handleReplaySplash}
                  onResetStorage={handleResetStorage}
                />
              ) : null}
            </>
          )}
        </div>

        {/* 5-Tab Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          labels={t.tabs}
          surfaceClass={surfaceClass}
        />

        {/* Animated Splash Screen Overlay */}
        {showSplash ? (
          <SplashScreen
            key={splashKey}
            appName={t.appName}
            tagline={t.tagline}
            subtext={t.splashSubtext}
            enterLabel={t.enterStudio}
            onFinish={() => setShowSplash(false)}
          />
        ) : null}
      </main>

      {/* Desktop Companion Studio Inspector */}
      <aside className="hidden lg:flex flex-col w-[400px] rounded-3xl border border-violet-300/15 bg-[#0D0A16] p-6 gap-5">
        <div className="flex items-center gap-3.5">
          <BrandLogo size={48} />
          <div>
            <h2 className="text-lg font-extrabold tracking-wide text-[#F5F3FF]">
              TUKKU-CREATION
            </h2>
            <p className="text-xs text-[#A78BFA]">
              React Native · Expo · TypeScript · Android
            </p>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-[#C4B5FD]">
          <div className="flex items-center justify-between py-1.5 border-b border-violet-300/10">
            <span className="text-[#8B7FA8]">Android Package</span>
            <span className="font-mono text-violet-300">com.tukku.creation</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-violet-300/10">
            <span className="text-[#8B7FA8]">Active Screen</span>
            <span className="font-semibold text-[#F5F3FF]">
              {activeToolRoute
                ? AI_TOOLS.find((item) => item.id === activeToolRoute.toolId)?.title[language]
                : activeTab}
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-[#8B7FA8]">Saved Local Projects</span>
            <span className="font-mono tabular-nums text-[#F5F3FF]">
              {projects.length}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-[#F5F3FF] flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-violet-400" />
            <span>5 Bottom Tabs</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            {tabNavButtons.map((btn) => (
              <button
                key={btn.key}
                type="button"
                onClick={() => {
                  setShowSplash(false);
                  handleSelectTab(btn.key);
                }}
                className={`min-h-[38px] px-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap truncate ${
                  !showSplash && !activeToolRoute && activeTab === btn.key
                    ? 'bg-violet-600 border-purple-400 text-white'
                    : 'bg-[#140E24] border-violet-300/15 text-violet-200 hover:border-violet-400/35'
                }`}
              >
                {btn.label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleReplaySplash}
              className="min-h-[38px] px-2.5 rounded-xl border border-violet-300/15 bg-[#140E24] text-xs font-semibold text-violet-200 hover:border-violet-400/35 flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-3 h-3" />
              <span>Splash</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-[#F5F3FF]">7 Separate AI Tool Screens</p>
          <div className="grid grid-cols-2 gap-1.5">
            {AI_TOOLS.map((tool) => {
              const isOpen = activeToolRoute?.toolId === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => {
                    setShowSplash(false);
                    handleOpenTool(tool.id);
                  }}
                  className={`min-h-[36px] px-2.5 rounded-xl border text-[11px] font-semibold transition-colors cursor-pointer truncate text-left ${
                    isOpen
                      ? 'bg-violet-600 border-purple-400 text-white'
                      : 'bg-[#140E24] border-violet-300/15 text-violet-200 hover:border-violet-400/35'
                  }`}
                >
                  {tool.title[language]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-[#F5F3FF]">States & Language Test</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSetLanguage(language === 'hi' ? 'en' : 'hi')}
              className="min-h-[38px] px-2.5 rounded-xl border border-violet-300/15 bg-[#140E24] hover:border-violet-400/35 text-xs font-semibold text-violet-200 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'English' : 'हिन्दी'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSplash(false);
                setActiveToolRoute(null);
                setActiveTab('MyProjects');
                setStorageError(null);
                setIsLoadingProjects(true);
                setTimeout(() => setIsLoadingProjects(false), 1200);
              }}
              className="min-h-[38px] px-2.5 rounded-xl border border-violet-300/15 bg-[#140E24] hover:border-violet-400/35 text-xs font-semibold text-violet-200 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Loader2 className="w-3.5 h-3.5" />
              <span>Loading State</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSplash(false);
                setActiveToolRoute(null);
                setActiveTab('MyProjects');
                setStorageError(null);
                setProjects([]);
                saveProjects([]);
              }}
              className="min-h-[38px] px-2.5 rounded-xl border border-violet-300/15 bg-[#140E24] hover:border-violet-400/35 text-xs font-semibold text-violet-200 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Empty State</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSplash(false);
                setActiveToolRoute(null);
                setActiveTab('MyProjects');
                setIsLoadingProjects(false);
                setStorageError(t.common.storageErrorBody);
              }}
              className="min-h-[38px] px-2.5 rounded-xl border border-violet-300/15 bg-[#140E24] hover:border-violet-400/35 text-xs font-semibold text-violet-200 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Error State</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSplash(false);
                setActiveToolRoute(null);
                handleRestorePlaceholders();
                setActiveTab('MyProjects');
              }}
              className="col-span-2 min-h-[38px] px-2.5 rounded-xl border border-violet-300/15 bg-[#140E24] hover:border-violet-400/35 text-xs font-semibold text-violet-200 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Starter Placeholders</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
