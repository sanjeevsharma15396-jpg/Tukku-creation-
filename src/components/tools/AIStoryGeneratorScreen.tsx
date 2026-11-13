import React, { useState } from 'react';
import { TranslationSchema } from '../../i18n/translations';
import { AIToolId, AppLanguage, ProjectItem } from '../../types/app';
import {
  FieldInput,
  FieldTextArea,
  OptionChipGroup,
  OutputLanguagePicker,
} from '../StudioFormFields';
import { ToolStudioLayout } from '../ToolStudioLayout';

export interface ToolScreenProps {
  language: AppLanguage;
  t: TranslationSchema;
  surfaceClass: string;
  elevatedClass: string;
  defaultOutputLanguage: AppLanguage;
  initialPrompt?: string;
  existingProject?: ProjectItem;
  isSaving: boolean;
  onBack: () => void;
  onViewProjects: () => void;
  onSaveProject: (input: {
    id?: string;
    title: string;
    prompt: string;
    toolId: AIToolId;
    outputLanguage: AppLanguage;
    metadata?: Record<string, string>;
  }) => Promise<ProjectItem>;
}

export const AIStoryGeneratorScreen: React.FC<ToolScreenProps> = ({
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
  const [prompt, setPrompt] = useState(existingProject?.prompt ?? initialPrompt);
  const [genre, setGenre] = useState(
    existingProject?.metadata?.genre ?? t.toolScreens.story.genres[0],
  );
  const [tone, setTone] = useState(
    existingProject?.metadata?.tone ?? t.toolScreens.story.tones[0],
  );
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
        title: title.trim() || `${genre} · ${prompt.trim().slice(0, 26)}`,
        prompt: prompt.trim() || title.trim(),
        toolId: 'story-generator',
        outputLanguage,
        metadata: { genre, tone },
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
      toolId="story-generator"
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
        id="story-title"
        label={t.create.projectTitleLabel}
        value={title}
        onChange={(v) => {
          setTitle(v);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.story.titlePlaceholder}
        surfaceClass={surfaceClass}
      />
      <OptionChipGroup
        label={t.toolScreens.story.genreLabel}
        options={t.toolScreens.story.genres}
        selected={genre}
        onSelect={setGenre}
        surfaceClass={surfaceClass}
      />
      <OptionChipGroup
        label={t.toolScreens.story.toneLabel}
        options={t.toolScreens.story.tones}
        selected={tone}
        onSelect={setTone}
        surfaceClass={surfaceClass}
      />
      <FieldTextArea
        id="story-prompt"
        label={t.create.promptLabel}
        value={prompt}
        onChange={(v) => {
          setPrompt(v);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.story.promptPlaceholder}
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
