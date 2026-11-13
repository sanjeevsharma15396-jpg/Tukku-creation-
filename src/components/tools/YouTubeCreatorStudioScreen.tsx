import React, { useState } from 'react';
import { AppLanguage } from '../../types/app';
import {
  FieldInput,
  FieldTextArea,
  OptionChipGroup,
  OutputLanguagePicker,
} from '../StudioFormFields';
import { ToolStudioLayout } from '../ToolStudioLayout';
import { ToolScreenProps } from './AIStoryGeneratorScreen';

export const YouTubeCreatorStudioScreen: React.FC<ToolScreenProps> = ({
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
  const [title, setTitle] = useState(existingProject?.title ?? '');
  const [format, setFormat] = useState(
    existingProject?.metadata?.format ?? t.toolScreens.youtube.formats[0],
  );
  const [hook, setHook] = useState(existingProject?.metadata?.hook ?? '');
  const [prompt, setPrompt] = useState(existingProject?.prompt ?? initialPrompt);
  const [outputLanguage, setOutputLanguage] = useState<AppLanguage>(
    existingProject?.outputLanguage ?? defaultOutputLanguage,
  );
  const [savedId, setSavedId] = useState<string | undefined>(existingProject?.id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedVisible, setSavedVisible] = useState(false);

  const handleSave = async () => {
    if (!title.trim() && !prompt.trim()) {
      setErrorMessage(t.create.validationError);
      return;
    }
    setErrorMessage(null);
    try {
      const saved = await onSaveProject({
        id: savedId,
        title: title.trim() || `${format} · ${prompt.trim().slice(0, 26)}`,
        prompt: prompt.trim() || title.trim(),
        toolId: 'youtube-studio',
        outputLanguage,
        metadata: { format, hook: hook.trim() },
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
      toolId="youtube-studio"
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
        id="youtube-title"
        label={t.create.projectTitleLabel}
        value={title}
        onChange={(v) => {
          setTitle(v);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.youtube.titlePlaceholder}
        surfaceClass={surfaceClass}
      />
      <OptionChipGroup
        label={t.toolScreens.youtube.formatLabel}
        options={t.toolScreens.youtube.formats}
        selected={format}
        onSelect={setFormat}
        surfaceClass={surfaceClass}
      />
      <FieldInput
        id="youtube-hook"
        label={t.toolScreens.youtube.hookLabel}
        value={hook}
        onChange={setHook}
        placeholder={t.toolScreens.youtube.hookPlaceholder}
        surfaceClass={surfaceClass}
      />
      <FieldTextArea
        id="youtube-prompt"
        label={t.create.promptLabel}
        value={prompt}
        onChange={(v) => {
          setPrompt(v);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.youtube.promptPlaceholder}
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
