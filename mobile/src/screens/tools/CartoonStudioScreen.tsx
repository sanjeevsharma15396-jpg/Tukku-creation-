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

type CartoonRoute = RouteProp<RootStackParamList, 'CartoonStudio'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'CartoonStudio'>;

export const CartoonStudioScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<CartoonRoute>();
  const { t, preferences, projects, isSaving, upsertProject } = useApp();

  const existing = route.params?.projectId
    ? projects.find((p) => p.id === route.params?.projectId)
    : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [character, setCharacter] = useState(existing?.metadata?.character ?? '');
  const [style, setStyle] = useState(
    existing?.metadata?.style ?? t.toolScreens.cartoon.styles[0],
  );
  const [prompt, setPrompt] = useState(existing?.prompt ?? route.params?.initialPrompt ?? '');
  const [outputLanguage, setOutputLanguage] = useState<AppLanguage>(
    existing?.outputLanguage ?? preferences.defaultOutputLanguage,
  );
  const [savedId, setSavedId] = useState<string | undefined>(existing?.id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedVisible, setSavedVisible] = useState(false);

  useEffect(() => {
    if (!t.toolScreens.cartoon.styles.includes(style)) {
      setStyle(t.toolScreens.cartoon.styles[0]);
    }
  }, [style, t.toolScreens.cartoon.styles]);

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
        placeholder={t.toolScreens.cartoon.titlePlaceholder}
      />
      <FieldInput
        label={t.toolScreens.cartoon.characterLabel}
        value={character}
        onChangeText={setCharacter}
        placeholder={t.toolScreens.cartoon.characterPlaceholder}
      />
      <OptionChipGroup
        label={t.toolScreens.cartoon.styleLabel}
        options={t.toolScreens.cartoon.styles}
        selected={style}
        onSelect={setStyle}
      />
      <FieldTextArea
        label={t.create.promptLabel}
        value={prompt}
        onChangeText={(val) => {
          setPrompt(val);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.cartoon.promptPlaceholder}
        hasError={Boolean(errorMessage)}
      />
      <OutputLanguagePicker
        label={t.create.outputLanguageLabel}
        value={outputLanguage}
        onChange={setOutputLanguage}
      />
      <AIGenerationPanel toolId="cartoon-studio" prompt={prompt} language={outputLanguage} />
    </ToolStudioLayout>
  );
};
