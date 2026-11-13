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

export const CartoonStudioScreen: React.FC<ToolScreenProps> = ({
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
  const [character, setCharacter] = useState(existingProject?.metadata?.character ?? '');
  const [style, setStyle] = useState(
    existingProject?.metadata?.style ?? t.toolScreens.cartoon.styles[0],
  );
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
        title: title.trim() || `${style} · ${prompt.trim().slice(0, 26)}`,
        prompt: prompt.trim() || title.trim(),
        toolId: 'cartoon-studio',
        outputLanguage,
        metadata: { character: character.trim(), style },
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
      toolId="cartoon-studio"
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
        id="cartoon-title"
        label={t.create.projectTitleLabel}
        value={title}
        onChange={(v) => {
          setTitle(v);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.cartoon.titlePlaceholder}
        surfaceClass={surfaceClass}
      />
      <FieldInput
        id="cartoon-character"
        label={t.toolScreens.cartoon.characterLabel}
        value={character}
        onChange={setCharacter}
        placeholder={t.toolScreens.cartoon.characterPlaceholder}
        surfaceClass={surfaceClass}
      />
      <OptionChipGroup
        label={t.toolScreens.cartoon.styleLabel}
        options={t.toolScreens.cartoon.styles}
        selected={style}
        onSelect={setStyle}
        surfaceClass={surfaceClass}
      />
      <FieldTextArea
        id="cartoon-prompt"
        label={t.create.promptLabel}
        value={prompt}
        onChange={(v) => {
          setPrompt(v);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.cartoon.promptPlaceholder}
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
