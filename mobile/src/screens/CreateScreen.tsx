import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientButton } from '../components/GradientButton';
import { useApp } from '../context/AppContext';
import { AI_TOOLS } from '../data/tools';
import { COLORS, RADIUS } from '../theme/colors';
import { AIToolId, AppLanguage, MainTabParamList, RootStackParamList, TOOL_ID_TO_ROUTE } from '../types';

type CreateRouteProp = RouteProp<MainTabParamList, 'Create'>;
type CreateNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Create'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const CreateScreen: React.FC = () => {
  const route = useRoute<CreateRouteProp>();
  const navigation = useNavigation<CreateNavProp>();
  const { language, t, theme, preferences, projects, isSaving, upsertProject } = useApp();

  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [selectedToolId, setSelectedToolId] = useState<AIToolId>('story-generator');
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [outputLanguage, setOutputLanguage] = useState<AppLanguage>(
    preferences.defaultOutputLanguage,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const params = route.params;
    if (!params) return;

    if (params.projectId) {
      const existing = projects.find((item) => item.id === params.projectId);
      if (existing) {
        setEditingId(existing.id);
        setSelectedToolId(existing.toolId);
        setTitle(existing.title);
        setPrompt(existing.prompt);
        setOutputLanguage(existing.outputLanguage);
        setStatusMessage(null);
        return;
      }
    }

    if (params.initialToolId) {
      setSelectedToolId(params.initialToolId);
    }
    if (params.initialPrompt !== undefined) {
      setPrompt(params.initialPrompt);
    }
    setEditingId(undefined);
    setStatusMessage(null);
  }, [route.params, projects]);

  const activeTool = AI_TOOLS.find((item) => item.id === selectedToolId) ?? AI_TOOLS[0];

  const handleSave = async () => {
    const trimmedPrompt = prompt.trim();
    const trimmedTitle = title.trim();

    if (!trimmedPrompt && !trimmedTitle) {
      setHasError(true);
      return;
    }

    setHasError(false);
    const derivedTitle =
      trimmedTitle ||
      `${activeTool.shortLabel[language]} · ${trimmedPrompt.slice(0, 28)}`;

    try {
      const saved = await upsertProject({
        id: editingId,
        title: derivedTitle,
        prompt: trimmedPrompt || derivedTitle,
        toolId: selectedToolId,
        outputLanguage,
      });

      setEditingId(saved.id);
      setTitle(saved.title);
      setStatusMessage(t.create.savedToast);
    } catch {
      setHasError(true);
    }
  };

  const handleResetDraft = () => {
    setEditingId(undefined);
    setTitle('');
    setPrompt('');
    setStatusMessage(null);
    setHasError(false);
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>{t.create.headerTitle}</Text>
          <Text style={styles.headerSubtitle}>{t.create.headerSubtitle}</Text>
        </View>
        <Pressable
          onPress={handleResetDraft}
          accessibilityRole="button"
          style={[styles.resetBtn, { borderColor: theme.border, backgroundColor: theme.surface }]}
        >
          <Text style={styles.resetBtnText}>{t.create.clearDraft}</Text>
        </Pressable>
      </View>

      {/* Honest Phase 1 Local Mode Notice */}
      <View
        style={[
          styles.noticeCard,
          { backgroundColor: theme.surfaceElevated, borderColor: theme.borderStrong },
        ]}
      >
        <Text style={styles.noticeTitle}>{t.create.phaseNoticeTitle}</Text>
        <Text style={styles.noticeBody}>{t.create.phaseNoticeBody}</Text>
      </View>

      {/* Studio Tool Selector */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>{t.create.selectToolLabel}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolChipsRow}
        >
          {AI_TOOLS.map((tool) => {
            const isActive = tool.id === selectedToolId;
            return (
              <Pressable
                key={tool.id}
                onPress={() => setSelectedToolId(tool.id)}
                accessibilityRole="button"
                style={[
                  styles.toolChip,
                  {
                    backgroundColor: isActive ? COLORS.violetPrimary : theme.surface,
                    borderColor: isActive ? COLORS.amethyst : theme.border,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={tool.iconName as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
                  size={17}
                  color={isActive ? COLORS.textPrimary : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.toolChipLabel,
                    { color: isActive ? COLORS.textPrimary : COLORS.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {tool.shortLabel[language]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Text style={styles.toolHint}>{activeTool.phaseOneNote[language]}</Text>
        <Pressable
          onPress={() =>
            navigation.navigate(TOOL_ID_TO_ROUTE[selectedToolId], {
              projectId: editingId,
              initialPrompt: prompt.trim() || undefined,
            })
          }
          accessibilityRole="button"
          style={[styles.resetBtn, { borderColor: theme.borderStrong, backgroundColor: theme.surfaceElevated, alignSelf: 'flex-start' }]}
        >
          <Text style={styles.resetBtnText}>
            {activeTool.title[language]} · {t.create.openDedicatedTool}
          </Text>
        </Pressable>
      </View>

      {/* Project Title */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>{t.create.projectTitleLabel}</Text>
        <TextInput
          value={title}
          onChangeText={(value) => {
            setTitle(value);
            if (hasError) setHasError(false);
          }}
          placeholder={t.create.projectTitlePlaceholder}
          placeholderTextColor={COLORS.textMuted}
          style={[
            styles.textInput,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        />
      </View>

      {/* Creative Prompt */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>{t.create.promptLabel}</Text>
        <TextInput
          value={prompt}
          onChangeText={(value) => {
            setPrompt(value);
            if (hasError) setHasError(false);
          }}
          placeholder={t.create.promptPlaceholder}
          placeholderTextColor={COLORS.textMuted}
          multiline
          textAlignVertical="top"
          style={[
            styles.multilineInput,
            {
              backgroundColor: theme.surface,
              borderColor: hasError ? COLORS.danger : theme.border,
            },
          ]}
        />
        {hasError ? <Text style={styles.errorText}>{t.create.validationError}</Text> : null}
      </View>

      {/* Output Language */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>{t.create.outputLanguageLabel}</Text>
        <View style={styles.langRow}>
          {(['hi', 'en'] as AppLanguage[]).map((lang) => {
            const active = outputLanguage === lang;
            return (
              <Pressable
                key={lang}
                onPress={() => setOutputLanguage(lang)}
                accessibilityRole="button"
                style={[
                  styles.langBtn,
                  {
                    backgroundColor: active ? 'rgba(124, 58, 237, 0.24)' : theme.surface,
                    borderColor: active ? COLORS.amethyst : theme.border,
                  },
                ]}
              >
                <Text style={[styles.langBtnText, active && styles.langBtnTextActive]}>
                  {lang === 'hi' ? 'हिन्दी' : 'English'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {statusMessage ? (
        <Pressable
          onPress={() => navigation.navigate('MyProjects')}
          style={styles.savedBanner}
        >
          <MaterialCommunityIcons name="check-circle-outline" size={18} color="#DDD6FE" />
          <Text style={styles.savedBannerText}>{statusMessage}</Text>
        </Pressable>
      ) : null}

      <GradientButton
        label={editingId ? t.create.updateButton : t.create.saveButton}
        iconName="content-save-outline"
        onPress={handleSave}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 36,
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  resetBtn: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    justifyContent: 'center',
  },
  resetBtnText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  noticeCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 15,
    gap: 6,
  },
  noticeTitle: {
    color: COLORS.textSecondary,
    fontSize: 13.5,
    fontWeight: '700',
  },
  noticeBody: {
    color: '#D8CEF0',
    fontSize: 13,
    lineHeight: 19,
  },
  fieldBlock: {
    gap: 8,
  },
  fieldLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  toolChipsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  toolChip: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  toolChipLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  toolHint: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    lineHeight: 18,
  },
  textInput: {
    minHeight: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    color: COLORS.textPrimary,
    fontSize: 14.5,
  },
  multilineInput: {
    minHeight: 132,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: 14,
    color: COLORS.textPrimary,
    fontSize: 14.5,
    lineHeight: 21,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12.5,
  },
  langRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langBtn: {
    flex: 1,
    minHeight: 46,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langBtnText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  langBtnTextActive: {
    color: COLORS.textPrimary,
  },
  savedBanner: {
    minHeight: 46,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(124, 58, 237, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.4)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savedBannerText: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '600',
    flex: 1,
  },
});
