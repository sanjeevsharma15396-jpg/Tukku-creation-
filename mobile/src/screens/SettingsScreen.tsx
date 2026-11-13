import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS } from '../theme/colors';

export const SettingsScreen: React.FC = () => {
  const {
    language,
    t,
    theme,
    preferences,
    setLanguage,
    setDarkSurface,
    updatePreferences,
    replaySplash,
    resetAllData,
  } = useApp();

  const handleReset = () => {
    Alert.alert(t.settings.confirmClearTitle, t.settings.confirmClearBody, [
      { text: t.projects.cancel, style: 'cancel' },
      {
        text: t.settings.clearStorageAction,
        style: 'destructive',
        onPress: () => {
          resetAllData().catch(() => {});
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerBlock}>
        <Text style={styles.headerTitle}>{t.settings.headerTitle}</Text>
        <Text style={styles.headerSubtitle}>{t.settings.headerSubtitle}</Text>
      </View>

      {/* Language Selector */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>{t.settings.languageSection}</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text style={styles.cardTitle}>{t.settings.languageTitle}</Text>
          <Text style={styles.cardDesc}>{t.settings.languageDesc}</Text>

          <View style={styles.segmentedRow}>
            <Pressable
              onPress={() => {
                setLanguage('hi').catch(() => {});
              }}
              accessibilityRole="button"
              style={[
                styles.segmentBtn,
                {
                  backgroundColor:
                    language === 'hi' ? COLORS.violetPrimary : theme.surfaceElevated,
                  borderColor:
                    language === 'hi' ? COLORS.amethyst : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  language === 'hi' && styles.segmentTextActive,
                ]}
              >
                {t.settings.hindiOption}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setLanguage('en').catch(() => {});
              }}
              accessibilityRole="button"
              style={[
                styles.segmentBtn,
                {
                  backgroundColor:
                    language === 'en' ? COLORS.violetPrimary : theme.surfaceElevated,
                  borderColor:
                    language === 'en' ? COLORS.amethyst : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  language === 'en' && styles.segmentTextActive,
                ]}
              >
                {t.settings.englishOption}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Dark Theme Selector */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>{t.settings.themeSection}</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text style={styles.cardTitle}>{t.settings.themeTitle}</Text>
          <Text style={styles.cardDesc}>{t.settings.themeDesc}</Text>

          <View style={styles.segmentedRow}>
            <Pressable
              onPress={() => {
                setDarkSurface('obsidian').catch(() => {});
              }}
              accessibilityRole="button"
              style={[
                styles.segmentBtn,
                {
                  backgroundColor:
                    preferences.darkSurface === 'obsidian'
                      ? COLORS.violetPrimary
                      : theme.surfaceElevated,
                  borderColor:
                    preferences.darkSurface === 'obsidian'
                      ? COLORS.amethyst
                      : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  preferences.darkSurface === 'obsidian' && styles.segmentTextActive,
                ]}
              >
                {t.settings.themeObsidian}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setDarkSurface('amethyst').catch(() => {});
              }}
              accessibilityRole="button"
              style={[
                styles.segmentBtn,
                {
                  backgroundColor:
                    preferences.darkSurface === 'amethyst'
                      ? COLORS.violetPrimary
                      : theme.surfaceElevated,
                  borderColor:
                    preferences.darkSurface === 'amethyst'
                      ? COLORS.amethyst
                      : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  preferences.darkSurface === 'amethyst' && styles.segmentTextActive,
                ]}
              >
                {t.settings.themeAmethyst}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Personal Preferences */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>{t.settings.preferencesSection}</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextWrap}>
              <Text style={styles.cardTitle}>{t.settings.autoSaveTitle}</Text>
              <Text style={styles.cardDesc}>{t.settings.autoSaveDesc}</Text>
            </View>
            <Switch
              value={preferences.autoSaveDrafts}
              onValueChange={(value) => {
                updatePreferences({ autoSaveDrafts: value }).catch(() => {});
              }}
              trackColor={{ false: '#2A223D', true: COLORS.violetPrimary }}
              thumbColor={COLORS.textPrimary}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextWrap}>
              <Text style={styles.cardTitle}>{t.settings.placeholdersTitle}</Text>
              <Text style={styles.cardDesc}>{t.settings.placeholdersDesc}</Text>
            </View>
            <Switch
              value={preferences.showStarterPlaceholders}
              onValueChange={(value) => {
                updatePreferences({ showStarterPlaceholders: value }).catch(() => {});
              }}
              trackColor={{ false: '#2A223D', true: COLORS.violetPrimary }}
              thumbColor={COLORS.textPrimary}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.actionRow}>
            <View style={styles.toggleTextWrap}>
              <Text style={styles.cardTitle}>{t.settings.replaySplashTitle}</Text>
              <Text style={styles.cardDesc}>{t.settings.replaySplashDesc}</Text>
            </View>
            <Pressable
              onPress={replaySplash}
              accessibilityRole="button"
              style={[styles.inlineActionBtn, { borderColor: theme.borderStrong }]}
            >
              <MaterialCommunityIcons name="play-circle-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.inlineActionText}>{t.settings.replaySplashAction}</Text>
            </Pressable>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.actionRow}>
            <View style={styles.toggleTextWrap}>
              <Text style={styles.cardTitle}>{t.settings.clearStorageTitle}</Text>
              <Text style={styles.cardDesc}>{t.settings.clearStorageDesc}</Text>
            </View>
            <Pressable
              onPress={handleReset}
              accessibilityRole="button"
              style={[styles.dangerActionBtn]}
            >
              <Text style={styles.dangerActionText}>{t.settings.clearStorageAction}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* App Information */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>{t.settings.appInfoSection}</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <InfoRow label={t.settings.appNameLabel} value="TUKKU-CREATION" />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <InfoRow label={t.settings.packageLabel} value="com.tukku.creation" mono />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <InfoRow label={t.settings.platformLabel} value="Android (Expo / React Native)" />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <InfoRow label={t.settings.usageLabel} value={t.settings.usageValue} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <InfoRow label={t.settings.phaseLabel} value={t.settings.phaseValue} />
        </View>
      </View>
    </ScrollView>
  );
};

const InfoRow: React.FC<{ label: string; value: string; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, mono && styles.monoText]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },
  headerBlock: {
    gap: 4,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  sectionBlock: {
    gap: 8,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  cardDesc: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    lineHeight: 18,
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  segmentBtn: {
    flex: 1,
    minHeight: 46,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  segmentText: {
    color: COLORS.textMuted,
    fontSize: 13.5,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: COLORS.textPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleTextWrap: {
    flex: 1,
    gap: 2,
  },
  divider: {
    height: 1,
  },
  inlineActionBtn: {
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(124, 58, 237, 0.16)',
  },
  inlineActionText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  dangerActionBtn: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.35)',
    backgroundColor: COLORS.dangerSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerActionText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 2,
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  infoValue: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    flexShrink: 1,
  },
  monoText: {
    fontFamily: 'monospace',
    color: COLORS.textSecondary,
  },
});
