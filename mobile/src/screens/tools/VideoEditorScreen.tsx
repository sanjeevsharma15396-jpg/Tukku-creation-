import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  FieldInput,
  FieldTextArea,
  OptionChipGroup,
  OutputLanguagePicker,
} from '../../components/StudioFormFields';
import { ToolStudioLayout } from '../../components/ToolStudioLayout';
import { useApp } from '../../context/AppContext';
import { COLORS, RADIUS } from '../../theme/colors';
import { AppLanguage, RootStackParamList } from '../../types';

type EditorRoute = RouteProp<RootStackParamList, 'VideoEditor'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'VideoEditor'>;

export const VideoEditorScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<EditorRoute>();
  const { t, theme, preferences, projects, isSaving, upsertProject } = useApp();

  const existing = route.params?.projectId
    ? projects.find((p) => p.id === route.params?.projectId)
    : undefined;

  const initialChecks = existing?.metadata?.checklist
    ? existing.metadata.checklist.split(',').filter(Boolean)
    : [];

  const [title, setTitle] = useState(existing?.title ?? '');
  const [ratio, setRatio] = useState(
    existing?.metadata?.ratio ?? t.toolScreens.editor.ratios[0],
  );
  const [checkedItems, setCheckedItems] = useState<string[]>(initialChecks);
  const [prompt, setPrompt] = useState(existing?.prompt ?? route.params?.initialPrompt ?? '');
  const [outputLanguage, setOutputLanguage] = useState<AppLanguage>(
    existing?.outputLanguage ?? preferences.defaultOutputLanguage,
  );
  const [savedId, setSavedId] = useState<string | undefined>(existing?.id);
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
      const saved = await upsertProject({
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
        placeholder={t.toolScreens.editor.titlePlaceholder}
      />
      <OptionChipGroup
        label={t.toolScreens.editor.ratioLabel}
        options={t.toolScreens.editor.ratios}
        selected={ratio}
        onSelect={setRatio}
      />

      <View style={styles.checkBlock}>
        <Text style={styles.checkLabel}>{t.toolScreens.editor.checklistLabel}</Text>
        <View style={styles.checkList}>
          {t.toolScreens.editor.checklistItems.map((item) => {
            const checked = checkedItems.includes(item);
            return (
              <Pressable
                key={item}
                onPress={() => toggleCheck(item)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                style={[
                  styles.checkRow,
                  {
                    backgroundColor: theme.surface,
                    borderColor: checked ? COLORS.amethyst : theme.border,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={20}
                  color={checked ? COLORS.amethyst : COLORS.textMuted}
                />
                <Text style={styles.checkText}>{item}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FieldTextArea
        label={t.create.promptLabel}
        value={prompt}
        onChangeText={(val) => {
          setPrompt(val);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={t.toolScreens.editor.promptPlaceholder}
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

const styles = StyleSheet.create({
  checkBlock: {
    gap: 8,
  },
  checkLabel: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '700',
  },
  checkList: {
    gap: 8,
  },
  checkRow: {
    minHeight: 46,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkText: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '600',
  },
});
