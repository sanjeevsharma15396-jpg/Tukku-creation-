import React, { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { AppLanguage } from '../../types/app';
import {
  FieldInput,
  FieldTextArea,
  OptionChipGroup,
  OutputLanguagePicker,
} from '../StudioFormFields';
import { ToolStudioLayout } from '../ToolStudioLayout';
import { ToolScreenProps } from './AIStoryGeneratorScreen';

export const VideoEditorScreen: React.FC<ToolScreenProps> = ({
  language,
  t,
  surfaceClass,
  elevatedClass,
  defaultOutputLanguage,
  initialPrompt = '',
  existingProject,
  isSaving,
  onBack,
  onViewProjects,
  onSaveProject,
}) => {
  const initialChecks = existingProject?.metadata?.checklist
    ? existingProject.metadata.checklist.split(',').filter(Boolean)
    : [];

  const [title, setTitle] = useState(existingProject?.title ?? '');
  const [ratio, setRatio] = useState(
    existingProject?.metadata?.ratio ?? t.toolScreens.editor.ratios[0],
  );
  const [checkedItems, setCheckedItems] = useState<string[]>(initialChecks);
  const [prompt, setPrompt] = useState(existingProject?.prompt ?? initialPrompt);
  const [outputLanguage, setOutputLanguage] = useState<AppLanguage>(
    existingProject?.outputLanguage ?? defaultOutputLanguage,
  );
  const [savedId, setSavedId] = useState<string | undefined>(existingProject?.id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedVisible, setSavedVisible] = useState(false);

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  };

  const handleSave = async () => {
    if (!title.trim() && !prompt.trim()) {
      setErrorMessage(t.create.validationError);
      return;
    }
    setErrorMessage(null);
    try {
      const saved = await onSaveProject({
        id: savedId,
        title: title.trim() || `${ratio} · ${prompt.trim().slice(0, 26)}`,
        prompt: prompt.trim() || title.trim(),
        toolId: 'video-editor',
        outputLanguage,
        metadata: { ratio, checklist: checkedItems.join(',') },
      });
      setSavedId(saved.id);
      setTitle(saved.title);
      setSavedVisible(true);
    } catch {
      setErrorMessage(t.common.storageErrorBody);
    }
  };

  return (
    <ToolStudioLayout
      toolId="video-editor"
      language={language}
      t={t}
      surfaceClass={surfaceClass}
      elevatedClass={elevatedClass}
      onBack={onBack}
      onSave={handleSave}
      onViewProjects={onViewProjects}
      isEditing={Boolean(savedId)}
      isSaving={isSaving}
      savedVisible={savedVisible}
      errorMessage={errorMessage}
    >
      <FieldInput
        id="editor-title"
        label={t.create.projectTitleLabel}
        value={title}
        onChange={(v) => {
          setTitle(v);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.editor.titlePlaceholder}
        surfaceClass={surfaceClass}
      />
      <OptionChipGroup
        label={t.toolScreens.editor.ratioLabel}
        options={t.toolScreens.editor.ratios}
        selected={ratio}
        onSelect={setRatio}
        surfaceClass={surfaceClass}
      />

      <div className="space-y-1.5">
        <p className="text-xs font-bold text-[#F5F3FF]">
          {t.toolScreens.editor.checklistLabel}
        </p>
        <div className="space-y-2">
          {t.toolScreens.editor.checklistItems.map((item) => {
            const checked = checkedItems.includes(item);
            return (
              <button
                key={item}
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggleCheck(item)}
                className={`w-full min-h-[44px] rounded-xl border px-3.5 flex items-center gap-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                  checked
                    ? `${surfaceClass} border-purple-400 text-[#F5F3FF]`
                    : `${surfaceClass} border-violet-300/15 text-[#C4B5FD]`
                }`}
              >
                {checked ? (
                  <CheckSquare className="w-4 h-4 text-purple-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-[#8B7FA8] shrink-0" />
                )}
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <FieldTextArea
        id="editor-prompt"
        label={t.create.promptLabel}
        value={prompt}
        onChange={(v) => {
          setPrompt(v);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.editor.promptPlaceholder}
        surfaceClass={surfaceClass}
        hasError={Boolean(errorMessage)}
      />
      <OutputLanguagePicker
        label={t.create.outputLanguageLabel}
        value={outputLanguage}
        onChange={setOutputLanguage}
        surfaceClass={surfaceClass}
      />
    </ToolStudioLayout>
  );
};
