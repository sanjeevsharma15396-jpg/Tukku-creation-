import { AIGenerationPanel } from '../../components/AIGenerationPanel';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
type SceneImage = { uri: string; name: string };

const DURATIONS = ['3', '5', '8', '10'];

export const VideoEditorScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<EditorRoute>();
  const { t, theme, preferences, projects, isSaving, upsertProject } = useApp();

  const existing = route.params?.projectId
    ? projects.find((p) => p.id === route.params?.projectId)
    : undefined;
  const existingScenes = useMemo<SceneImage[]>(() => {
    try {
      return JSON.parse(existing?.metadata?.sceneImages ?? '[]');
    } catch {
      return [];
    }
  }, [existing?.metadata?.sceneImages]);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [ratio, setRatio] = useState(existing?.metadata?.ratio ?? '16:9');
  const [duration, setDuration] = useState(existing?.metadata?.secondsPerScene ?? '5');
  const [scenes, setScenes] = useState<SceneImage[]>(existingScenes);
  const [prompt, setPrompt] = useState(existing?.prompt ?? route.params?.initialPrompt ?? '');
  const [outputLanguage, setOutputLanguage] = useState<AppLanguage>(
    existing?.outputLanguage ?? preferences.defaultOutputLanguage,
  );
  const [savedId, setSavedId] = useState<string | undefined>(existing?.id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedVisible, setSavedVisible] = useState(false);

  const totalSeconds = scenes.length * Number(duration);

  const pickImages = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Gallery permission needed', 'TUKKU-CREATION को आपकी चुनी हुई तस्वीरें लेने की अनुमति दें।');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 30,
        quality: 0.9,
        orderedSelection: true,
      });
      if (result.canceled) return;
      const incoming = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `Scene ${scenes.length + 1}`,
      }));
      setScenes((previous) => {
        const known = new Set(previous.map((item) => item.uri));
        return [...previous, ...incoming.filter((item) => !known.has(item.uri))];
      });
      setErrorMessage(null);
    } catch {
      Alert.alert('Image selection failed', 'कृपया दोबारा कोशिश करें।');
    }
  };

  const moveScene = (index: number, direction: -1 | 1) => {
    setScenes((previous) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= previous.length) return previous;
      const next = [...previous];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const handleSave = async () => {
    if (!title.trim() && !prompt.trim() && scenes.length === 0) {
      setErrorMessage('कम से कम एक तस्वीर, शीर्षक या सीन प्रॉम्प्ट जोड़ें।');
      return;
    }
    setErrorMessage(null);
    try {
      const saved = await upsertProject({
        id: savedId,
        title: title.trim() || `Cartoon video · ${scenes.length} scenes`,
        prompt: prompt.trim() || 'User supplied image-to-video scene plan',
        toolId: 'video-editor',
        outputLanguage,
        metadata: {
          ratio,
          secondsPerScene: duration,
          sceneImages: JSON.stringify(scenes),
          checklist: 'images-selected,scene-order',
        },
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
      <View style={styles.introCard}>
        <Text style={styles.introTitle}>AI Cartoon Video Studio</Text>
        <Text style={styles.introBody}>
          अपनी बनाई हुई character images चुनें, हर सीन का क्रम तय करें और वीडियो की तैयारी सेव करें।
          अभी यह पहला timeline चरण है; MP4 rendering अगला विकास चरण है।
        </Text>
      </View>

      <FieldInput
        label={t.create.projectTitleLabel}
        value={title}
        onChangeText={setTitle}
        placeholder="उदा. आलू और टमाटर की मज़ेदार कहानी"
      />

      <OptionChipGroup
        label="YouTube / Reels वीडियो अनुपात"
        options={['9:16', '16:9', '1:1']}
        selected={ratio}
        onSelect={setRatio}
      />

      <View style={styles.block}>
        <Text style={styles.label}>हर सीन की अवधि</Text>
        <View style={styles.chips}>
          {DURATIONS.map((value) => (
            <Pressable
              key={value}
              onPress={() => setDuration(value)}
              style={[styles.chip, { backgroundColor: duration === value ? COLORS.violetPrimary : theme.surface, borderColor: duration === value ? COLORS.amethyst : theme.border }]}
            >
              <Text style={styles.chipText}>{value} सेकंड</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.block}>
        <View style={styles.sectionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>आपके सीन की तस्वीरें ({scenes.length}/30)</Text>
            <Text style={styles.hint}>Gallery से कई images चुनें। ऊपर/नीचे करके कहानी का क्रम बदलें।</Text>
          </View>
          <Pressable onPress={pickImages} style={styles.addButton}>
            <MaterialCommunityIcons name="image-plus" size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>तस्वीरें जोड़ें</Text>
          </Pressable>
        </View>

        {scenes.length === 0 ? (
          <Pressable onPress={pickImages} style={[styles.emptyPicker, { borderColor: theme.border, backgroundColor: theme.surface }]}>
            <MaterialCommunityIcons name="image-multiple-outline" size={34} color={COLORS.amethyst} />
            <Text style={styles.emptyTitle}>अपनी cartoon images चुनें</Text>
            <Text style={styles.hint}>एक साथ अधिकतम 30 तस्वीरें</Text>
          </Pressable>
        ) : (
          <View style={styles.sceneList}>
            {scenes.map((scene, index) => (
              <View key={scene.uri} style={[styles.sceneRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Image source={{ uri: scene.uri }} style={styles.thumbnail} />
                <View style={styles.sceneInfo}>
                  <Text style={styles.sceneTitle}>सीन {index + 1}</Text>
                  <Text style={styles.sceneName} numberOfLines={1}>{scene.name}</Text>
                  <Text style={styles.sceneTime}>{duration} सेकंड</Text>
                </View>
                <View style={styles.sceneActions}>
                  <Pressable onPress={() => moveScene(index, -1)} disabled={index === 0} hitSlop={8}>
                    <MaterialCommunityIcons name="arrow-up-circle-outline" size={23} color={index === 0 ? COLORS.textMuted : COLORS.textPrimary} />
                  </Pressable>
                  <Pressable onPress={() => moveScene(index, 1)} disabled={index === scenes.length - 1} hitSlop={8}>
                    <MaterialCommunityIcons name="arrow-down-circle-outline" size={23} color={index === scenes.length - 1 ? COLORS.textMuted : COLORS.textPrimary} />
                  </Pressable>
                  <Pressable onPress={() => setScenes((prev) => prev.filter((_, i) => i !== index))} hitSlop={8}>
                    <MaterialCommunityIcons name="delete-outline" size={22} color={COLORS.danger} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.totalText}>अनुमानित कुल अवधि: {Math.floor(totalSeconds / 60)} मिनट {totalSeconds % 60} सेकंड</Text>
      </View>

      <FieldTextArea
        label="पूरी कहानी / Scene और Video Prompt"
        value={prompt}
        onChangeText={setPrompt}
        placeholder="सीन 1: आलू रसोई में चलता है और बोलता है... कैमरा धीरे-धीरे पास आता है। सीन 2: टमाटर जवाब देता है..."
        hasError={Boolean(errorMessage)}
      />
      <OutputLanguagePicker
        label={t.create.outputLanguageLabel}
        value={outputLanguage}
        onChange={setOutputLanguage}
      />
      <AIGenerationPanel toolId="video-editor" prompt={prompt} language={outputLanguage} />
    </ToolStudioLayout>
  );
};

const styles = StyleSheet.create({
  introCard: { backgroundColor: 'rgba(124,58,237,0.14)', borderColor: 'rgba(167,139,250,0.35)', borderWidth: 1, borderRadius: RADIUS.lg, padding: 14, gap: 6 },
  introTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '800' },
  introBody: { color: COLORS.textSecondary, fontSize: 12.5, lineHeight: 19 },
  block: { gap: 8 },
  label: { color: COLORS.textPrimary, fontSize: 13.5, fontWeight: '700' },
  hint: { color: COLORS.textMuted, fontSize: 11.5, lineHeight: 17 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: RADIUS.full, borderWidth: 1, paddingVertical: 9, paddingHorizontal: 13 },
  chipText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.violetPrimary, borderRadius: RADIUS.md, paddingVertical: 10, paddingHorizontal: 12 },
  addButtonText: { color: '#FFFFFF', fontSize: 11.5, fontWeight: '700' },
  emptyPicker: { minHeight: 150, borderWidth: 1, borderStyle: 'dashed', borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyTitle: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 13 },
  sceneList: { gap: 8 },
  sceneRow: { borderWidth: 1, borderRadius: RADIUS.md, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 10 },
  thumbnail: { width: 58, height: 58, borderRadius: RADIUS.sm, backgroundColor: '#211936' },
  sceneInfo: { flex: 1, gap: 3 },
  sceneTitle: { color: COLORS.textPrimary, fontSize: 12.5, fontWeight: '700' },
  sceneName: { color: COLORS.textMuted, fontSize: 10.5 },
  sceneTime: { color: COLORS.textSecondary, fontSize: 10.5 },
  sceneActions: { alignItems: 'center', gap: 5 },
  totalText: { color: COLORS.amethyst, fontSize: 12, fontWeight: '800' },
});
