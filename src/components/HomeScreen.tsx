import React, { useState } from 'react';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { AI_TOOLS } from '../data/tools';
import { TranslationSchema } from '../i18n/translations';
import { AIToolId, AppLanguage, ProjectItem } from '../types/app';
import { BrandLogo } from './BrandLogo';
import { ToolIcon } from './ToolIcon';

interface HomeScreenProps {
  language: AppLanguage;
  t: TranslationSchema;
  surfaceClass: string;
  elevatedClass: string;
  heroGradientClass: string;
  draftPrompt: string;
  onChangeDraftPrompt: (val: string) => void;
  projects: ProjectItem[];
  isLoadingProjects: boolean;
  storageError: string | null;
  onRetryStorage: () => void;
  onPrepareDraft: (prompt: string, toolId?: AIToolId) => void;
  onOpenTool: (toolId: AIToolId, initialPrompt?: string) => void;
  onOpenProject: (project: ProjectItem) => void;
  onViewAllProjects: () => void;
  onViewAllTools: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  t,
  surfaceClass,
  elevatedClass,
  heroGradientClass,
  draftPrompt,
  onChangeDraftPrompt,
  projects,
  isLoadingProjects,
  storageError,
  onRetryStorage,
  onPrepareDraft,
  onOpenTool,
  onOpenProject,
  onViewAllProjects,
  onViewAllTools,
}) => {
  const [promptError, setPromptError] = useState(false);
  const recentProjects = projects.slice(0, 3);

  const handleGenerate = () => {
    const trimmed = draftPrompt.trim();
    if (!trimmed) {
      setPromptError(true);
      return;
    }
    setPromptError(false);
    onPrepareDraft(trimmed, 'story-generator');
  };

  return (
    <div className="space-y-5 p-4 pb-8">
      {/* Welcome Hero Card */}
      <section
        className={`rounded-3xl border border-violet-400/25 bg-gradient-to-br ${heroGradientClass} p-5 space-y-3`}
      >
        <div className="flex items-center gap-3">
          <BrandLogo size={42} />
          <div className="min-w-0">
            <p className="text-sm font-extrabold tracking-wide text-[#F5F3FF] truncate">
              {t.appName}
            </p>
            <p className="text-xs text-violet-300 truncate">{t.home.personalBadge}</p>
          </div>
        </div>
        <div className="pt-1 space-y-1">
          <h2 className="text-xl font-extrabold text-[#F5F3FF] leading-snug">
            {t.home.welcomeTitle}
          </h2>
          <p className="text-xs leading-relaxed text-violet-200/90">
            {t.home.welcomeSubtitle}
          </p>
        </div>
      </section>

      {/* AI Prompt Input Card */}
      <section
        className={`rounded-3xl border border-violet-300/15 ${surfaceClass} p-4 space-y-3`}
      >
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="home-ai-prompt"
            className="text-sm font-bold text-[#F5F3FF]"
          >
            {t.home.promptLabel}
          </label>
          <span className="text-[11px] font-mono tabular-nums text-[#8B7FA8]">
            {draftPrompt.length}/500
          </span>
        </div>

        <textarea
          id="home-ai-prompt"
          value={draftPrompt}
          maxLength={500}
          rows={3}
          onChange={(e) => {
            onChangeDraftPrompt(e.target.value);
            if (promptError && e.target.value.trim()) setPromptError(false);
          }}
          placeholder={t.home.promptPlaceholder}
          className={`w-full rounded-2xl border ${
            promptError ? 'border-red-400/70' : 'border-violet-300/15'
          } ${elevatedClass} px-3.5 py-3 text-sm text-[#F5F3FF] placeholder:text-[#8B7FA8] focus:outline-none focus:border-violet-400 resize-none leading-relaxed`}
        />

        {promptError ? (
          <p className="text-xs text-red-400 font-medium">{t.home.promptRequired}</p>
        ) : null}

        <button
          type="button"
          onClick={handleGenerate}
          className="w-full min-h-[48px] rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 active:scale-[0.99] transition-all text-[#F5F3FF] text-sm font-bold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.home.generateButton}</span>
        </button>
      </section>

      {/* Recent Projects */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#F5F3FF]">
            {t.home.recentProjectsTitle}
          </h3>
          <button
            type="button"
            onClick={onViewAllProjects}
            className="min-h-[40px] px-2 text-xs font-semibold text-violet-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            {t.home.viewAll}
          </button>
        </div>

        {isLoadingProjects ? (
          <div
            className={`rounded-2xl border border-violet-300/15 ${surfaceClass} p-5 flex items-center justify-center gap-2.5 text-xs text-violet-300`}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t.common.loadingProjects}</span>
          </div>
        ) : storageError ? (
          <div
            className="rounded-2xl border border-red-400/35 bg-red-500/10 p-4 flex items-center justify-between gap-3 text-xs text-red-300"
          >
            <span className="flex items-center gap-2 min-w-0">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">{storageError}</span>
            </span>
            <button
              type="button"
              onClick={onRetryStorage}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 font-semibold shrink-0 cursor-pointer whitespace-nowrap"
            >
              {t.common.retry}
            </button>
          </div>
        ) : recentProjects.length === 0 ? (
          <div
            className={`rounded-2xl border border-violet-300/15 ${surfaceClass} p-4 text-center text-xs text-[#8B7FA8]`}
          >
            {t.home.noRecentProjects}
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentProjects.map((project) => {
              const tool = AI_TOOLS.find((item) => item.id === project.toolId) ?? AI_TOOLS[0];
              const dateLabel = new Date(project.updatedAt).toLocaleDateString(
                language === 'hi' ? 'hi-IN' : 'en-US',
                { day: 'numeric', month: 'short' },
              );
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onOpenProject(project)}
                  className={`w-full text-left rounded-2xl border border-violet-300/15 ${surfaceClass} hover:border-violet-400/35 p-3.5 transition-colors cursor-pointer space-y-2`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-300 flex items-center justify-center shrink-0">
                      <ToolIcon toolId={project.toolId} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#F5F3FF] truncate">
                        {project.title}
                      </p>
                      <p className="text-[11px] text-[#8B7FA8] truncate">
                        {tool.shortLabel[language]} ·{' '}
                        {project.status === 'placeholder'
                          ? t.projects.placeholderTag
                          : t.projects.draftTag}{' '}
                        · {dateLabel}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#C4B5FD]/85 line-clamp-2 leading-relaxed">
                    {project.prompt}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* AI Tools Grid (All 7 Tools) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#F5F3FF]">
              {t.home.toolsGridTitle}
            </h3>
            <p className="text-[11px] text-[#8B7FA8]">{t.home.toolsGridSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onViewAllTools}
            className="min-h-[40px] px-2 text-xs font-semibold text-violet-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            {t.home.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {AI_TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => onOpenTool(tool.id, draftPrompt.trim() || undefined)}
              className={`text-left rounded-2xl border border-violet-300/15 ${surfaceClass} hover:border-violet-400/35 p-3.5 transition-all active:scale-[0.985] cursor-pointer flex flex-col justify-between min-h-[132px]`}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.gradientClass} text-white flex items-center justify-center mb-2.5`}
              >
                <ToolIcon toolId={tool.id} className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-[#F5F3FF] leading-snug">
                  {tool.title[language]}
                </p>
                <p className="text-[11px] text-[#8B7FA8] line-clamp-2 leading-relaxed">
                  {tool.description[language]}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
