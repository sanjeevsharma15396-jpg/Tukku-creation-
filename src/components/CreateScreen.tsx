import React, { useEffect, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Loader2, Save } from 'lucide-react';
import { AI_TOOLS } from '../data/tools';
import { TranslationSchema } from '../i18n/translations';
import { AIToolId, AppLanguage, ProjectItem } from '../types/app';
import { ToolIcon } from './ToolIcon';

interface CreateScreenProps {
  language: AppLanguage;
  t: TranslationSchema;
  surfaceClass: string;
  elevatedClass: string;
  defaultOutputLanguage: AppLanguage;
  initialToolId: AIToolId;
  initialPrompt: string;
  editingProject: ProjectItem | null;
  isSaving: boolean;
  onSaveProject: (input: {
    id?: string;
    title: string;
    prompt: string;
    toolId: AIToolId;
    outputLanguage: AppLanguage;
  }) => Promise<ProjectItem>;
  onOpenDedicatedTool: (toolId: AIToolId, initialPrompt?: string) => void;
  onClearEditing: () => void;
  onOpenMyProjects: () => void;
}

export const CreateScreen: React.FC<CreateScreenProps> = ({
  language,
  t,
  surfaceClass,
  elevatedClass,
  defaultOutputLanguage,
  initialToolId,
  initialPrompt,
  editingProject,
  isSaving,
  onSaveProject,
  onOpenDedicatedTool,
  onClearEditing,
  onOpenMyProjects,
}) => {
  const [selectedToolId, setSelectedToolId] = useState<AIToolId>(initialToolId);
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [outputLanguage, setOutputLanguage] = useState<AppLanguage>(defaultOutputLanguage);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [hasError, setHasError] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (editingProject) {
      setEditingId(editingProject.id);
      setSelectedToolId(editingProject.toolId);
      setTitle(editingProject.title);
      setPrompt(editingProject.prompt);
      setOutputLanguage(editingProject.outputLanguage);
      setSavedNotice(false);
      setHasError(false);
      return;
    }

    setEditingId(undefined);
    setSelectedToolId(initialToolId);
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
    setSavedNotice(false);
  }, [editingProject, initialToolId, initialPrompt]);

  const activeTool = AI_TOOLS.find((item) => item.id === selectedToolId) ?? AI_TOOLS[0];

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const trimmedPrompt = prompt.trim();
    if (!trimmedTitle && !trimmedPrompt) {
      setHasError(true);
      return;
    }
    setHasError(false);
    const finalTitle =
      trimmedTitle ||
      `${activeTool.shortLabel[language]} · ${trimmedPrompt.slice(0, 28)}`;

    try {
      const saved = await onSaveProject({
        id: editingId,
        title: finalTitle,
        prompt: trimmedPrompt || finalTitle,
        toolId: selectedToolId,
        outputLanguage,
      });
      setEditingId(saved.id);
      setTitle(saved.title);
      setSavedNotice(true);
    } catch {
      setHasError(true);
    }
  };

  const handleReset = () => {
    setEditingId(undefined);
    setTitle('');
    setPrompt('');
    setHasError(false);
    setSavedNotice(false);
    onClearEditing();
  };

  return (
    <div className="space-y-4 p-4 pb-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-[#F5F3FF] truncate">
            {t.create.headerTitle}
          </h2>
          <p className="text-xs text-[#8B7FA8] truncate">{t.create.headerSubtitle}</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className={`min-h-[40px] px-3 rounded-xl border border-violet-300/15 ${surfaceClass} text-xs font-semibold text-violet-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap`}
        >
          {t.create.clearDraft}
        </button>
      </div>

      {/* Honest Phase 1 Local Mode Notice */}
      <div
        className={`rounded-2xl border border-violet-400/25 ${elevatedClass} p-3.5 space-y-1`}
      >
        <p className="text-xs font-bold text-violet-300">{t.create.phaseNoticeTitle}</p>
        <p className="text-xs leading-relaxed text-[#D8CEF0]">
          {t.create.phaseNoticeBody}
        </p>
      </div>

      {/* Tool Selector */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-[#F5F3FF]">{t.create.selectToolLabel}</p>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {AI_TOOLS.map((tool) => {
            const active = tool.id === selectedToolId;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setSelectedToolId(tool.id)}
                className={`min-h-[42px] px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-violet-600 border-purple-400 text-white'
                    : `${surfaceClass} border-violet-300/15 text-violet-300 hover:border-violet-400/35`
                }`}
              >
                <ToolIcon toolId={tool.id} className="w-3.5 h-3.5" />
                <span>{tool.shortLabel[language]}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-[#8B7FA8] leading-relaxed">
          {activeTool.phaseOneNote[language]}
        </p>
        <button
          type="button"
          onClick={() => onOpenDedicatedTool(selectedToolId, prompt.trim() || undefined)}
          className={`min-h-[40px] px-3 rounded-xl border border-violet-400/30 ${elevatedClass} text-xs font-semibold text-violet-200 hover:text-white inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap`}
        >
          <span>
            {activeTool.title[language]} · {t.create.openDedicatedTool}
          </span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Project Title */}
      <div className="space-y-1.5">
        <label htmlFor="create-title" className="block text-xs font-bold text-[#F5F3FF]">
          {t.create.projectTitleLabel}
        </label>
        <input
          id="create-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (hasError) setHasError(false);
          }}
          placeholder={t.create.projectTitlePlaceholder}
          className={`w-full min-h-[46px] rounded-xl border border-violet-300/15 ${surfaceClass} px-3.5 text-sm text-[#F5F3FF] placeholder:text-[#8B7FA8] focus:outline-none focus:border-violet-400`}
        />
      </div>

      {/* Prompt */}
      <div className="space-y-1.5">
        <label htmlFor="create-prompt" className="block text-xs font-bold text-[#F5F3FF]">
          {t.create.promptLabel}
        </label>
        <textarea
          id="create-prompt"
          rows={5}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (hasError) setHasError(false);
          }}
          placeholder={t.create.promptPlaceholder}
          className={`w-full rounded-xl border ${
            hasError ? 'border-red-400/70' : 'border-violet-300/15'
          } ${surfaceClass} px-3.5 py-3 text-sm text-[#F5F3FF] placeholder:text-[#8B7FA8] focus:outline-none focus:border-violet-400 resize-none leading-relaxed`}
        />
        {hasError ? (
          <p className="text-xs text-red-400">{t.create.validationError}</p>
        ) : null}
      </div>

      {/* Output Language */}
      <div className="space-y-1.5">
        <p className="text-xs font-bold text-[#F5F3FF]">{t.create.outputLanguageLabel}</p>
        <div className="grid grid-cols-2 gap-2.5">
          {(['hi', 'en'] as AppLanguage[]).map((lang) => {
            const active = outputLanguage === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => setOutputLanguage(lang)}
                className={`min-h-[44px] rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'bg-violet-600/25 border-purple-400 text-[#F5F3FF]'
                    : `${surfaceClass} border-violet-300/15 text-[#8B7FA8]`
                }`}
              >
                {lang === 'hi' ? 'हिन्दी' : 'English'}
              </button>
            );
          })}
        </div>
      </div>

      {savedNotice ? (
        <button
          type="button"
          onClick={onOpenMyProjects}
          className="w-full min-h-[44px] rounded-xl bg-violet-600/20 border border-violet-400/40 px-3.5 py-2 flex items-center gap-2 text-left text-xs font-semibold text-[#F5F3FF] hover:bg-violet-600/30 transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0" />
          <span className="flex-1">{t.create.savedToast}</span>
        </button>
      ) : null}

      <button
        type="button"
        disabled={isSaving}
        onClick={handleSave}
        className="w-full min-h-[48px] rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60 active:scale-[0.99] transition-all text-[#F5F3FF] text-sm font-bold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t.common.saving}</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>{editingId ? t.create.updateButton : t.create.saveButton}</span>
          </>
        )}
      </button>
    </div>
  );
};
