import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { AI_TOOLS } from '../data/tools';
import { COLORS, RADIUS } from '../theme/colors';
import { AIToolId } from '../types';
import { GradientButton } from './GradientButton';

interface ToolStudioLayoutProps {
  toolId: AIToolId;
  onBack: () => void;
  onSave: () => void;
  onViewProjects: () => void;
  isEditing: boolean;
  isSaving: boolean;
  savedToastVisible: boolean;
  errorMessage: string | null;
  children: React.ReactNode;
}

export const ToolStudioLayout: React.FC<ToolStudioLayoutProps> = ({
  toolId,
  onBack,
  onSave,
  onViewProjects,
  isEditing,
  isSaving,
  savedToastVisible,
  errorMessage,
  children,
}) => {
  const { language, t, theme } = useApp();
  const tool = AI_TOOLS.find((item) => item.id === toolId) ?? AI_TOOLS[0];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Top App Bar with Working Back Navigation */}
      <View
        style={[
          styles.topBar,
          { backgroundColor: theme.surface, borderBottomColor: theme.border },
        ]}
      >
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={t.common.back}
          hitSlop={10}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.textPrimary} />
          <Text style={styles.backText}>{t.common.back}</Text>
        </Pressable>

        <View style={styles.topTitleWrap}>
          <Text style={styles.topTitle} numberOfLines={1}>
            {tool.title[language]}
          </Text>
          <Text style={styles.topSubtitle} numberOfLines={1}>
            {t.common.phaseOneTag}
          </Text>
        </View>

        <LinearGradient
          colors={tool.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.topIconBox}
        >
          <MaterialCommunityIcons
            name={tool.iconName as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
            size={20}
            color={COLORS.textPrimary}
          />
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Phase 1 Local Studio Notice */}
        <View
          style={[
            styles.noticeCard,
            { backgroundColor: theme.surfaceElevated, borderColor: theme.borderStrong },
          ]}
        >
          <Text style={styles.noticeTitle}>{t.create.phaseNoticeTitle}</Text>
          <Text style={styles.noticeBody}>{tool.phaseOneNote[language]}</Text>
        </View>

        {children}

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color={COLORS.danger} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {savedToastVisible ? (
          <Pressable onPress={onViewProjects} style={styles.savedBanner}>
            <MaterialCommunityIcons name="check-circle-outline" size={18} color="#DDD6FE" />
            <Text style={styles.savedBannerText}>{t.create.savedToast}</Text>
            <Text style={styles.viewProjectsLink}>{t.common.viewInProjects}</Text>
          </Pressable>
        ) : null}

        <View style={styles.ctaWrap}>
          {isSaving ? (
            <View style={[styles.savingBox, { backgroundColor: theme.surface, borderColor: theme.borderStrong }]}>
              <ActivityIndicator size="small" color={COLORS.amethyst} />
              <Text style={styles.savingText}>{t.common.saving}</Text>
            </View>
          ) : (
            <GradientButton
              label={isEditing ? t.create.updateButton : t.create.saveButton}
              iconName="content-save-outline"
              onPress={onSave}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    minHeight: 58,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pressed: {
    opacity: 0.75,
  },
  backText: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '600',
  },
  topTitleWrap: {
    flex: 1,
  },
  topTitle: {
    color: COLORS.textPrimary,
    fontSize: 15.5,
    fontWeight: '700',
  },
  topSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
  },
  topIconBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  noticeCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 14,
    gap: 5,
  },
  noticeTitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  noticeBody: {
    color: '#D8CEF0',
    fontSize: 12.5,
    lineHeight: 18,
  },
  errorBanner: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.35)',
    backgroundColor: COLORS.dangerSurface,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '500',
  },
  savedBanner: {
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(124, 58, 237, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.45)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  savedBannerText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  viewProjectsLink: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  ctaWrap: {
    marginTop: 4,
  },
  savingBox: {
    minHeight: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  savingText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
