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

type ImageRoute = RouteProp<RootStackParamList, 'AIImageGenerator'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'AIImageGenerator'>;

export const AIImageGeneratorScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<ImageRoute>();
  const { t, preferences, projects, isSaving, upsertProject } = useApp();

  const existing = route.params?.projectId
    ? projects.find((p) => p.id === route.params?.projectId)
    : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [prompt, setPrompt] = useState(existing?.prompt ?? route.params?.initialPrompt ?? '');
  const [style, setStyle] = useState(
    existing?.metadata?.style ?? t.toolScreens.image.styles[0],
  );
  const [ratio, setRatio] = useState(
    existing?.metadata?.ratio ?? t.toolScreens.image.ratios[0],
  );
  const [outputLanguage, setOutputLanguage] = useState<AppLanguage>(
    existing?.outputLanguage ?? preferences.defaultOutputLanguage,
  );
  const [savedId, setSavedId] = useState<string | undefined>(existing?.id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedVisible, setSavedVisible] = useState(false);

  useEffect(() => {
    if (!t.toolScreens.image.styles.includes(style)) {
      setStyle(t.toolScreens.image.styles[0]);
    }
  }, [style, t.toolScreens.image.styles]);

  const handleSave = async () => {
    if (!title.trim() && !prompt.trim()) {
      setErrorMessage(t.create.validationError);
      return;
    }
    setErrorMessage(null);
    try {
      const saved = await upsertProject({
        id: savedId,
        title: title.trim() || `${style} · ${prompt.trim().slice(0, 26)}`,
        prompt: prompt.trim() || title.trim(),
        toolId: 'image-generator',
        outputLanguage,
        metadata: { style, ratio },
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
      toolId="image-generator"
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
        placeholder={t.toolScreens.image.titlePlaceholder}
      />
      <OptionChipGroup
        label={t.toolScreens.image.styleLabel}
        options={t.toolScreens.image.styles}
        selected={style}
        onSelect={setStyle}
      />
      <OptionChipGroup
        label={t.toolScreens.image.ratioLabel}
        options={t.toolScreens.image.ratios}
        selected={ratio}
        onSelect={setRatio}
      />
      <FieldTextArea
        label={t.create.promptLabel}
        value={prompt}
        onChangeText={(val) => {
          setPrompt(val);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.image.promptPlaceholder}
        hasError={Boolean(errorMessage)}
      />
      <OutputLanguagePicker
        label={t.create.outputLanguageLabel}
        value={outputLanguage}
        onChange={setOutputLanguage}
      />
      <AIGenerationPanel toolId="image-generator" prompt={prompt} language={outputLanguage} />
    </ToolStudioLayout>
  );
};
