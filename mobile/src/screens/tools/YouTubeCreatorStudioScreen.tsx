import { AIGenerationPanel } from '../../components/AIGenerationPanel';
import React, { useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  FieldInput,
  FieldTextArea,
  OptionChipGroup,
  OutputLanguagePicker,
} from '../../components/StudioFormFields';
import { ToolStudioLayout } from '../../components/ToolStudioLayout';
import { useApp } from '../../context/AppContext';
import { AppLanguage, RootStackParamList } from '../../types';

type YouTubeRoute = RouteProp<RootStackParamList, 'YouTubeCreatorStudio'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'YouTubeCreatorStudio'>;

export const YouTubeCreatorStudioScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<YouTubeRoute>();
  const { t, preferences, projects, isSaving, upsertProject } = useApp();

  const existing = route.params?.projectId
    ? projects.find((p) => p.id === route.params?.projectId)
    : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [format, setFormat] = useState(
    existing?.metadata?.format ?? t.toolScreens.youtube.formats[0],
  );
  const [hook, setHook] = useState(existing?.metadata?.hook ?? '');
  const [prompt, setPrompt] = useState(existing?.prompt ?? route.params?.initialPrompt ?? '');
  const [outputLanguage, setOutputLanguage] = useState<AppLanguage>(
    existing?.outputLanguage ?? preferences.defaultOutputLanguage,
  );
  const [savedId, setSavedId] = useState<string | undefined>(existing?.id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedVisible, setSavedVisible] = useState(false);

  useEffect(() => {
    if (!t.toolScreens.youtube.formats.includes(format)) {
      setFormat(t.toolScreens.youtube.formats[0]);
    }
  }, [format, t.toolScreens.youtube.formats]);

  const handleSave = async () => {
    if (!title.trim() && !prompt.trim()) {
      setErrorMessage(t.create.validationError);
      return;
    }
    setErrorMessage(null);
    try {
      const saved = await upsertProject({
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
      onBack={() => navigation.goBack()}
      onSave={handleSave}
      onViewProjects={() => navigation.navigate('MainTabs', { screen: 'MyProjects' })}
      isEditing={Boolean(savedId)}
      isSaving={isSaving}
      savedToastVisible={savedVisible}
      errorMessage={errorMessage}
    >
      <FieldInput
        label={t.create.projectTitleLabel}
        value={title}
        onChangeText={(val) => {
          setTitle(val);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.youtube.titlePlaceholder}
      />
      <OptionChipGroup
        label={t.toolScreens.youtube.formatLabel}
        options={t.toolScreens.youtube.formats}
        selected={format}
        onSelect={setFormat}
      />
      <FieldInput
        label={t.toolScreens.youtube.hookLabel}
        value={hook}
        onChangeText={setHook}
        placeholder={t.toolScreens.youtube.hookPlaceholder}
      />
      <FieldTextArea
        label={t.create.promptLabel}
        value={prompt}
        onChangeText={(val) => {
          setPrompt(val);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.youtube.promptPlaceholder}
        hasError={Boolean(errorMessage)}
      />
      <OutputLanguagePicker
        label={t.create.outputLanguageLabel}
        value={outputLanguage}
        onChange={setOutputLanguage}
      />
      <AIGenerationPanel toolId="youtube-studio" prompt={prompt} language={outputLanguage} />
    </ToolStudioLayout>
  );
};
