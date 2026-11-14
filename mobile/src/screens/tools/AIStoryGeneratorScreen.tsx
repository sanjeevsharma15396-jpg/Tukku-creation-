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

type StoryRoute = RouteProp<RootStackParamList, 'AIStoryGenerator'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'AIStoryGenerator'>;

export const AIStoryGeneratorScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<StoryRoute>();
  const { t, preferences, projects, isSaving, upsertProject } = useApp();

  const existing = route.params?.projectId
    ? projects.find((p) => p.id === route.params?.projectId)
    : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [prompt, setPrompt] = useState(existing?.prompt ?? route.params?.initialPrompt ?? '');
  const [genre, setGenre] = useState(
    existing?.metadata?.genre ?? t.toolScreens.story.genres[0],
  );
  const [tone, setTone] = useState(
    existing?.metadata?.tone ?? t.toolScreens.story.tones[0],
  );
  const [outputLanguage, setOutputLanguage] = useState<AppLanguage>(
    existing?.outputLanguage ?? preferences.defaultOutputLanguage,
  );
  const [savedId, setSavedId] = useState<string | undefined>(existing?.id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedVisible, setSavedVisible] = useState(false);

  useEffect(() => {
    if (!t.toolScreens.story.genres.includes(genre)) {
      setGenre(t.toolScreens.story.genres[0]);
    }
    if (!t.toolScreens.story.tones.includes(tone)) {
      setTone(t.toolScreens.story.tones[0]);
    }
  }, [genre, tone, t.toolScreens.story.genres, t.toolScreens.story.tones]);

  const handleSave = async () => {
    if (!title.trim() && !prompt.trim()) {
      setErrorMessage(t.create.validationError);
      return;
    }
    setErrorMessage(null);
    try {
      const saved = await upsertProject({
        id: savedId,
        title: title.trim() || `${t.toolScreens.story.genres[0]} · ${prompt.trim().slice(0, 26)}`,
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
        placeholder={t.toolScreens.story.titlePlaceholder}
      />
      <OptionChipGroup
        label={t.toolScreens.story.genreLabel}
        options={t.toolScreens.story.genres}
        selected={genre}
        onSelect={setGenre}
      />
      <OptionChipGroup
        label={t.toolScreens.story.toneLabel}
        options={t.toolScreens.story.tones}
        selected={tone}
        onSelect={setTone}
      />
      <FieldTextArea
        label={t.create.promptLabel}
        value={prompt}
        onChangeText={(val) => {
          setPrompt(val);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.story.promptPlaceholder}
        hasError={Boolean(errorMessage)}
      />
      <OutputLanguagePicker
        label={t.create.outputLanguageLabel}
        value={outputLanguage}
        onChange={setOutputLanguage}
      />
      <AIGenerationPanel toolId="story-generator" prompt={prompt} language={outputLanguage} />
    </ToolStudioLayout>
  );
};
