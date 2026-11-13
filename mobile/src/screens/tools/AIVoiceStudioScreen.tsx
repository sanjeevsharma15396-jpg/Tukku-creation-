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

type VoiceRoute = RouteProp<RootStackParamList, 'AIVoiceStudio'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'AIVoiceStudio'>;

export const AIVoiceStudioScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<VoiceRoute>();
  const { t, preferences, projects, isSaving, upsertProject } = useApp();

  const existing = route.params?.projectId
    ? projects.find((p) => p.id === route.params?.projectId)
    : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [prompt, setPrompt] = useState(existing?.prompt ?? route.params?.initialPrompt ?? '');
  const [profile, setProfile] = useState(
    existing?.metadata?.profile ?? t.toolScreens.voice.profiles[0],
  );
  const [pace, setPace] = useState(
    existing?.metadata?.pace ?? t.toolScreens.voice.paces[1],
  );
  const [outputLanguage, setOutputLanguage] = useState<AppLanguage>(
    existing?.outputLanguage ?? preferences.defaultOutputLanguage,
  );
  const [savedId, setSavedId] = useState<string | undefined>(existing?.id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedVisible, setSavedVisible] = useState(false);

  useEffect(() => {
    if (!t.toolScreens.voice.profiles.includes(profile)) {
      setProfile(t.toolScreens.voice.profiles[0]);
    }
    if (!t.toolScreens.voice.paces.includes(pace)) {
      setPace(t.toolScreens.voice.paces[1]);
    }
  }, [pace, profile, t.toolScreens.voice.paces, t.toolScreens.voice.profiles]);

  const handleSave = async () => {
    if (!title.trim() && !prompt.trim()) {
      setErrorMessage(t.create.validationError);
      return;
    }
    setErrorMessage(null);
    try {
      const saved = await upsertProject({
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
        placeholder={t.toolScreens.voice.titlePlaceholder}
      />
      <OptionChipGroup
        label={t.toolScreens.voice.voiceProfileLabel}
        options={t.toolScreens.voice.profiles}
        selected={profile}
        onSelect={setProfile}
      />
      <OptionChipGroup
        label={t.toolScreens.voice.paceLabel}
        options={t.toolScreens.voice.paces}
        selected={pace}
        onSelect={setPace}
      />
      <FieldTextArea
        label={t.create.promptLabel}
        value={prompt}
        onChangeText={(val) => {
          setPrompt(val);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.voice.promptPlaceholder}
        hasError={Boolean(errorMessage)}
      />
      <OutputLanguagePicker
        label={t.create.outputLanguageLabel}
        value={outputLanguage}
        onChange={setOutputLanguage}
      />
    </ToolStudioLayout>
  );
};
