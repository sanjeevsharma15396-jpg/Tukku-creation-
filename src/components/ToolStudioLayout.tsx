import React from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Save } from 'lucide-react';
import { AI_TOOLS } from '../data/tools';
import { TranslationSchema } from '../i18n/translations';
import { AIToolId, AppLanguage } from '../types/app';
import { ToolIcon } from './ToolIcon';

interface ToolStudioLayoutProps {
  toolId: AIToolId;
  language: AppLanguage;
  t: TranslationSchema;
  surfaceClass: string;
  elevatedClass: string;
  onBack: () => void;
  onSave: () => void;
  onViewProjects: () => void;
  isEditing: boolean;
  isSaving: boolean;
  savedVisible: boolean;
  errorMessage: string | null;
  children: React.ReactNode;
}

export const ToolStudioLayout: React.FC<ToolStudioLayoutProps> = ({
  toolId,
  language,
  t,
  surfaceClass,
  elevatedClass,
  onBack,
  onSave,
  onViewProjects,
  isEditing,
  isSaving,
  savedVisible,
  errorMessage,
  children,
}) => {
  const tool = AI_TOOLS.find((item) => item.id === toolId) ?? AI_TOOLS[0];

  return (
    <div className="flex flex-col min-h-full">
      {/* Top App Bar with Working Back Navigation */}
      <header
        className={`sticky top-0 z-20 min-h-[56px] px-3 py-2 border-b border-violet-300/15 ${surfaceClass}/95 backdrop-blur-md flex items-center gap-2.5`}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label={t.common.back}
          className="min-h-[44px] min-w-[44px] px-2 rounded-xl text-[#F5F3FF] hover:bg-violet-600/20 flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-semibold">{t.common.back}</span>
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-[#F5F3FF] truncate">
            {tool.title[language]}
          </h2>
          <p className="text-[11px] text-violet-300 truncate">{t.common.phaseOneTag}</p>
        </div>

        <div
          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tool.gradientClass} text-white flex items-center justify-center shrink-0`}
        >
          <ToolIcon toolId={tool.id} className="w-4 h-4" />
        </div>
      </header>

      <div className="p-4 pb-8 space-y-4">
        <div
          className={`rounded-2xl border border-violet-400/25 ${elevatedClass} p-3.5 space-y-1`}
        >
          <p className="text-xs font-bold text-violet-300">{t.create.phaseNoticeTitle}</p>
          <p className="text-xs leading-relaxed text-[#D8CEF0]">
            {tool.phaseOneNote[language]}
          </p>
        </div>

        {children}

        {errorMessage ? (
          <div className="rounded-xl border border-red-400/35 bg-red-500/10 px-3.5 py-3 flex items-center gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        ) : null}

        {savedVisible ? (
          <button
            type="button"
            onClick={onViewProjects}
            className="w-full min-h-[46px] rounded-xl bg-violet-600/20 border border-violet-400/40 px-3.5 py-2 flex items-center justify-between gap-2 text-left text-xs font-semibold text-[#F5F3FF] hover:bg-violet-600/30 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0" />
              <span className="truncate">{t.create.savedToast}</span>
            </span>
            <span className="text-violet-300 underline shrink-0 whitespace-nowrap">
              {t.common.viewInProjects}
            </span>
          </button>
        ) : null}

        <button
          type="button"
          disabled={isSaving}
          onClick={onSave}
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
              <span>{isEditing ? t.create.updateButton : t.create.saveButton}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
