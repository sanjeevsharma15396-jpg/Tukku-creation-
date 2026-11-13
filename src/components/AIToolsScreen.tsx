import React, { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { AI_TOOLS } from '../data/tools';
import { TranslationSchema } from '../i18n/translations';
import { AIToolId, AppLanguage, ToolCategory } from '../types/app';
import { ToolIcon } from './ToolIcon';

interface AIToolsScreenProps {
  language: AppLanguage;
  t: TranslationSchema;
  surfaceClass: string;
  onSelectTool: (toolId: AIToolId) => void;
}

export const AIToolsScreen: React.FC<AIToolsScreenProps> = ({
  language,
  t,
  surfaceClass,
  onSelectTool,
}) => {
  const [category, setCategory] = useState<ToolCategory>('all');

  const filteredTools = useMemo(() => {
    if (category === 'all') return AI_TOOLS;
    return AI_TOOLS.filter((tool) => tool.category === category);
  }, [category]);

  const categories: { id: ToolCategory; label: string }[] = [
    { id: 'all', label: t.tools.categories.all },
    { id: 'writing', label: t.tools.categories.writing },
    { id: 'visual', label: t.tools.categories.visual },
    { id: 'audio-video', label: t.tools.categories.audioVideo },
  ];

  return (
    <div className="space-y-4 p-4 pb-8">
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-[#F5F3FF]">
          {t.tools.headerTitle}
        </h2>
        <p className="text-xs text-[#8B7FA8]">{t.tools.headerSubtitle}</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`min-h-[40px] px-3.5 rounded-full border text-xs font-semibold shrink-0 transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-violet-600 border-purple-400 text-white'
                  : `${surfaceClass} border-violet-300/15 text-[#8B7FA8]`
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filteredTools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => onSelectTool(tool.id)}
            className={`w-full text-left rounded-2xl border border-violet-300/15 ${surfaceClass} hover:border-violet-400/35 p-4 flex items-center gap-3.5 transition-all active:scale-[0.99] cursor-pointer`}
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradientClass} text-white flex items-center justify-center shrink-0`}
            >
              <ToolIcon toolId={tool.id} className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-bold text-[#F5F3FF]">
                {tool.title[language]}
              </p>
              <p className="text-xs text-[#D8CEF0] leading-relaxed">
                {tool.description[language]}
              </p>
              <p className="text-[11px] font-semibold text-violet-300">
                {t.tools.phase1Label} · {t.tools.openTool}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-violet-300 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};
