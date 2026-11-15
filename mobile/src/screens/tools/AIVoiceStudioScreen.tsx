import { AIGenerationPanel } from '../../components/AIGenerationPanel';
import React, { useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import {
  FieldInput,
  FieldTextArea,
  OptionChipGroup,
  OutputLanguagePicker,
} from '../../components/StudioFormFields';
import { ToolStudioLayout } from '../../components/ToolStudioLayout';
import { useApp } from '../../context/AppContext';
import { AppLanguage, RootStackParamList } from '../../types';
import { COLORS, RADIUS } from '../../theme/colors';

type VoiceRoute = RouteProp<RootStackParamList, 'AIVoiceStudio'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'AIVoiceStudio'>;

export const AIVoiceStudioScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<VoiceRoute>();
  const { t, preferences, projects, isSaving, upsertProject, theme } = useApp();
  const existing = route.params?.projectId
    ? projects.find((p) => p.id === route.params?.projectId)
    : undefined;
  const [title, setTitle] = useState(existing?.title ?? '');
  const [prompt, setPrompt] = useState(existing?.prompt ?? route.params?.initialPrompt ?? '');
  const [profile, setProfile] = useState(existing?.metadata?.profile ?? t.toolScreens.voice.profiles[0]);
  const [pace, setPace] = useState(existing?.metadata?.pace ?? t.toolScreens.voice.paces[1]);
  const [outputLanguage, setOutputLanguage] = useState<AppLanguage>(existing?.outputLanguage ?? preferences.defaultOutputLanguage);
  const [savedId, setSavedId] = useState<string | undefined>(existing?.id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedVisible, setSavedVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!t.toolScreens.voice.profiles.includes(profile)) setProfile(t.toolScreens.voice.profiles[0]);
    if (!t.toolScreens.voice.paces.includes(pace)) setPace(t.toolScreens.voice.paces[1]);
  }, [pace, profile, t.toolScreens.voice.paces, t.toolScreens.voice.profiles]);

  useEffect(() => () => { Speech.stop(); }, []);

  const handleSpeak = async () => {
    const spokenText = prompt.trim();
    if (!spokenText) {
      setErrorMessage(outputLanguage === 'hi' ? 'पहले बोलने के लिए टेक्स्ट लिखें।' : 'Enter some text to speak first.');
      return;
    }
    setErrorMessage(null);
    await Speech.stop();
    setIsSpeaking(true);
    Speech.speak(spokenText, {
      language: outputLanguage === 'hi' ? 'hi-IN' : 'en-US',
      rate: 0.9,
      pitch: 1,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => {
        setIsSpeaking(false);
        setErrorMessage(outputLanguage === 'hi'
          ? 'फोन में Hindi voice उपलब्ध नहीं है। Android Text-to-Speech में Hindi voice install करें।'
          : 'Phone voice is unavailable. Check Android Text-to-Speech settings.');
      },
    });
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
      <FieldInput label={t.create.projectTitleLabel} value={title}
        onChangeText={(val) => { setTitle(val); if (errorMessage) setErrorMessage(null); }}
        placeholder={t.toolScreens.voice.titlePlaceholder} />
      <OptionChipGroup label={t.toolScreens.voice.voiceProfileLabel}
        options={t.toolScreens.voice.profiles} selected={profile} onSelect={setProfile} />
      <OptionChipGroup label={t.toolScreens.voice.paceLabel}
        options={t.toolScreens.voice.paces} selected={pace} onSelect={setPace} />
      <FieldTextArea label={t.create.promptLabel} value={prompt}
        onChangeText={(val) => { setPrompt(val); if (errorMessage) setErrorMessage(null); }}
        placeholder={t.toolScreens.voice.promptPlaceholder} hasError={Boolean(errorMessage)} />
      <OutputLanguagePicker label={t.create.outputLanguageLabel} value={outputLanguage} onChange={setOutputLanguage} />
      <View style={[styles.ttsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={styles.ttsTitle}>Free Phone Voice · मुफ्त आवाज</Text>
        <Text style={[styles.ttsHint, { color: COLORS.textMuted }]}>
          फोन की Text-to-Speech आवाज इस्तेमाल होगी। Hindi voice आपके Android फोन में उपलब्ध होनी चाहिए।
        </Text>
        <View style={styles.ttsActions}>
          <Pressable accessibilityRole="button" onPress={handleSpeak} style={styles.speakButton}>
            <Text style={styles.speakButtonText}>{isSpeaking ? 'फिर से सुनें' : '▶ बोलकर सुनें'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => { Speech.stop(); setIsSpeaking(false); }}
            style={[styles.stopButton, { borderColor: theme.border }]}>
            <Text style={[styles.stopButtonText, { color: COLORS.textPrimary }]}>■ रोकें</Text>
          </Pressable>
        </View>
      </View>
      <AIGenerationPanel toolId="voice-studio" prompt={prompt} language={outputLanguage} />
    </ToolStudioLayout>
  );
};

const styles = StyleSheet.create({
  ttsCard: { borderWidth: 1, borderRadius: RADIUS.lg, padding: 14, gap: 10 },
  ttsTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '800' },
  ttsHint: { fontSize: 12.5, lineHeight: 18 },
  ttsActions: { flexDirection: 'row', gap: 10 },
  speakButton: { flex: 1, minHeight: 46, borderRadius: RADIUS.md, backgroundColor: COLORS.violetPrimary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  speakButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  stopButton: { minWidth: 92, minHeight: 46, borderRadius: RADIUS.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  stopButtonText: { fontSize: 13, fontWeight: '700' },
});
