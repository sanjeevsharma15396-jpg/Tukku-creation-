import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  FolderOpen,
  Loader2,
  RefreshCw,
  Search,
  SearchX,
  Trash2,
  X,
} from 'lucide-react';
import { AI_TOOLS } from '../data/tools';
import { TranslationSchema } from '../i18n/translations';
import { AIToolId, AppLanguage, ProjectItem } from '../types/app';
import { ToolIcon } from './ToolIcon';

interface MyProjectsScreenProps {
  language: AppLanguage;
  t: TranslationSchema;
  surfaceClass: string;
  projects: ProjectItem[];
  isLoadingProjects: boolean;
  storageError: string | null;
  onRefreshProjects: () => void;
  onOpenProject: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
  onCreateNew: () => void;
  onRestorePlaceholders: () => void;
}

export const MyProjectsScreen: React.FC<MyProjectsScreenProps> = ({
  language,
  t,
  surfaceClass,
  projects,
  isLoadingProjects,
  storageError,
  onRefreshProjects,
  onOpenProject,
  onDeleteProject,
  onCreateNew,
  onRestorePlaceholders,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToolFilter, setSelectedToolFilter] = useState<AIToolId | 'all'>('all');
  const [pendingDelete, setPendingDelete] = useState<ProjectItem | null>(null);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return projects.filter((item) => {
      const matchesTool =
        selectedToolFilter === 'all' || item.toolId === selectedToolFilter;
      if (!matchesTool) return false;
      if (!query) return true;
      const tool = AI_TOOLS.find((entry) => entry.id === item.toolId);
      const toolTitle = tool ? tool.title[language].toLowerCase() : '';
      return (
        item.title.toLowerCase().includes(query) ||
        item.prompt.toLowerCase().includes(query) ||
        toolTitle.includes(query)
      );
    });
  }, [projects, searchQuery, selectedToolFilter, language]);

  const hasActiveFilter = searchQuery.trim().length > 0 || selectedToolFilter !== 'all';

  return (
    <div className="relative space-y-4 p-4 pb-8">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <h2 className="text-xl font-extrabold text-[#F5F3FF] truncate">
            {t.projects.headerTitle}
          </h2>
          <p className="text-xs text-[#8B7FA8] truncate">{t.projects.headerSubtitle}</p>
        </div>
        <button
          type="button"
          onClick={onRefreshProjects}
          aria-label={t.common.refresh}
          className={`min-w-[44px] min-h-[44px] rounded-xl border border-violet-300/15 ${surfaceClass} flex items-center justify-center text-violet-300 hover:text-white transition-colors cursor-pointer shrink-0`}
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingProjects ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search Bar */}
      <div
        className={`min-h-[46px] rounded-xl border border-violet-300/15 ${surfaceClass} px-3 flex items-center gap-2.5 focus-within:border-violet-400`}
      >
        <Search className="w-4 h-4 text-[#8B7FA8] shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.projects.searchPlaceholder}
          aria-label={t.projects.searchPlaceholder}
          className="w-full bg-transparent text-sm text-[#F5F3FF] placeholder:text-[#8B7FA8] focus:outline-none py-2"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
            className="min-w-[36px] min-h-[36px] flex items-center justify-center text-[#8B7FA8] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setSelectedToolFilter('all')}
          className={`min-h-[38px] px-3.5 rounded-full border text-xs font-semibold shrink-0 transition-colors cursor-pointer whitespace-nowrap ${
            selectedToolFilter === 'all'
              ? 'bg-violet-600 border-purple-400 text-white'
              : `${surfaceClass} border-violet-300/15 text-[#8B7FA8]`
          }`}
        >
          {t.projects.filterAll}
        </button>
        {AI_TOOLS.map((tool) => {
          const active = selectedToolFilter === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => setSelectedToolFilter(tool.id)}
              className={`min-h-[38px] px-3.5 rounded-full border text-xs font-semibold shrink-0 transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-violet-600 border-purple-400 text-white'
                  : `${surfaceClass} border-violet-300/15 text-[#8B7FA8]`
              }`}
            >
              {tool.shortLabel[language]}
            </button>
          );
        })}
      </div>

      {/* Loading, Error, Empty, or Project List */}
      {isLoadingProjects ? (
        <div
          className={`rounded-3xl border border-violet-300/15 ${surfaceClass} py-12 px-5 flex flex-col items-center text-center gap-3 mt-2`}
        >
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-xs font-semibold text-violet-200">
            {t.common.loadingProjects}
          </p>
        </div>
      ) : storageError ? (
        <div
          className={`rounded-3xl border border-red-400/35 ${surfaceClass} py-8 px-5 flex flex-col items-center text-center gap-3 mt-2`}
        >
          <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-400/30 flex items-center justify-center text-red-300">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#F5F3FF]">
            {t.common.storageErrorTitle}
          </h3>
          <p className="text-xs text-red-300 leading-relaxed max-w-[260px]">
            {storageError}
          </p>
          <button
            type="button"
            onClick={onRefreshProjects}
            className="w-full min-h-[46px] rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold cursor-pointer whitespace-nowrap mt-1"
          >
            {t.common.retry}
          </button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div
          className={`rounded-3xl border border-violet-300/15 ${surfaceClass} py-8 px-5 flex flex-col items-center text-center gap-3 mt-2`}
        >
          <div className="w-16 h-16 rounded-full bg-violet-600/15 border border-violet-400/25 flex items-center justify-center text-violet-300">
            {hasActiveFilter ? (
              <SearchX className="w-7 h-7" />
            ) : (
              <FolderOpen className="w-7 h-7" />
            )}
          </div>
          <h3 className="text-base font-bold text-[#F5F3FF]">
            {hasActiveFilter ? t.projects.emptySearchTitle : t.projects.emptyTitle}
          </h3>
          <p className="text-xs text-[#8B7FA8] leading-relaxed max-w-[260px]">
            {hasActiveFilter ? t.projects.emptySearchBody : t.projects.emptyBody}
          </p>
          <div className="w-full space-y-2 pt-2">
            <button
              type="button"
              onClick={() => {
                if (hasActiveFilter) {
                  setSearchQuery('');
                  setSelectedToolFilter('all');
                } else {
                  onCreateNew();
                }
              }}
              className="w-full min-h-[46px] rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              {hasActiveFilter ? t.projects.resetSearch : t.projects.createNew}
            </button>
            <button
              type="button"
              onClick={hasActiveFilter ? onCreateNew : onRestorePlaceholders}
              className="w-full min-h-[44px] rounded-xl border border-violet-400/25 text-violet-300 text-xs font-semibold hover:bg-violet-600/15 transition-colors cursor-pointer whitespace-nowrap"
            >
              {hasActiveFilter
                ? t.projects.createNew
                : t.projects.restorePlaceholders}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => {
            const tool = AI_TOOLS.find((entry) => entry.id === project.toolId) ?? AI_TOOLS[0];
            const dateLabel = new Date(project.updatedAt).toLocaleDateString(
              language === 'hi' ? 'hi-IN' : 'en-US',
              { day: 'numeric', month: 'short' },
            );
            return (
              <div
                key={project.id}
                className={`rounded-2xl border border-violet-300/15 ${surfaceClass} p-4 space-y-2.5`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenProject(project)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-300 flex items-center justify-center shrink-0">
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
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(project)}
                    aria-label={t.projects.deleteProject}
                    className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center text-[#8B7FA8] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenProject(project)}
                  className="w-full text-left text-xs text-[#D8CEF0] leading-relaxed line-clamp-2 cursor-pointer"
                >
                  {project.prompt}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal inside phone frame */}
      {pendingDelete ? (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-5">
          <div
            className={`w-full max-w-[310px] rounded-2xl border border-violet-300/25 ${surfaceClass} p-5 space-y-3 shadow-2xl`}
          >
            <h4 className="text-base font-bold text-[#F5F3FF]">
              {t.projects.confirmDeleteTitle}
            </h4>
            <p className="text-xs text-[#C4B5FD] leading-relaxed">
              {t.projects.confirmDeleteBody}
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="min-h-[42px] rounded-xl border border-violet-300/20 text-xs font-semibold text-violet-200 cursor-pointer"
              >
                {t.projects.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteProject(pendingDelete.id);
                  setPendingDelete(null);
                }}
                className="min-h-[42px] rounded-xl bg-red-500/20 border border-red-400/40 text-xs font-bold text-red-300 cursor-pointer"
              >
                {t.projects.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
