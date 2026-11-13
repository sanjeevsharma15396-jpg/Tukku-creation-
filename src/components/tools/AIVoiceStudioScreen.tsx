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

export const AIVoiceStudioScreen: React.FC<ToolScreenProps> = ({
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
  const [profile, setProfile] = useState(
    existingProject?.metadata?.profile ?? t.toolScreens.voice.profiles[0],
  );
  const [pace, setPace] = useState(
    existingProject?.metadata?.pace ?? t.toolScreens.voice.paces[1],
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
        title: title.trim() || `${profile} · ${prompt.trim().slice(0, 26)}`,
        prompt: prompt.trim() || title.trim(),
        toolId: 'voice-studio',
        outputLanguage,
        metadata: { profile, pace },
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
      toolId="voice-studio"
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
        id="voice-title"
        label={t.create.projectTitleLabel}
        value={title}
        onChange={(v) => {
          setTitle(v);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.voice.titlePlaceholder}
        surfaceClass={surfaceClass}
      />
      <OptionChipGroup
        label={t.toolScreens.voice.voiceProfileLabel}
        options={t.toolScreens.voice.profiles}
        selected={profile}
        onSelect={setProfile}
        surfaceClass={surfaceClass}
      />
      <OptionChipGroup
        label={t.toolScreens.voice.paceLabel}
        options={t.toolScreens.voice.paces}
        selected={pace}
        onSelect={setPace}
        surfaceClass={surfaceClass}
      />
      <FieldTextArea
        id="voice-prompt"
        label={t.create.promptLabel}
        value={prompt}
        onChange={(v) => {
          setPrompt(v);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.voice.promptPlaceholder}
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
