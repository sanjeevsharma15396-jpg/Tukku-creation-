import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import { BrandLogo } from '../components/BrandLogo';
import { GradientButton } from '../components/GradientButton';
import { ProjectCard } from '../components/ProjectCard';
import { ToolCard } from '../components/ToolCard';
import { useApp } from '../context/AppContext';
import { AI_TOOLS } from '../data/tools';
import { COLORS, RADIUS } from '../theme/colors';
import { MainTabParamList, RootStackParamList, TOOL_ID_TO_ROUTE } from '../types';

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const { width } = useWindowDimensions();
  const {
    t,
    theme,
    projects,
    isLoadingProjects,
    storageError,
    refreshProjects,
    draftPrompt,
    setDraftPrompt,
  } = useApp();
  const [promptError, setPromptError] = useState(false);

  const recentProjects = projects.slice(0, 3);
  const cardWidth = width >= 600 ? '31.8%' : '48.2%';

  const handleGeneratePress = () => {
    const trimmed = draftPrompt.trim();
    if (!trimmed) {
      setPromptError(true);
      return;
    }
    setPromptError(false);
    navigation.navigate('Create', {
      initialPrompt: trimmed,
      initialToolId: 'story-generator',
    });
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Welcome Hero */}
      <LinearGradient
        colors={theme.heroGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.heroCard, { borderColor: theme.borderStrong }]}
      >
        <View style={styles.heroHeaderRow}>
          <View style={styles.brandRow}>
            <BrandLogo size={42} />
            <View>
              <Text style={styles.brandName}>{t.appName}</Text>
              <Text style={styles.personalMeta}>{t.home.personalBadge}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.welcomeTitle}>{t.home.welcomeTitle}</Text>
        <Text style={styles.welcomeSubtitle}>{t.home.welcomeSubtitle}</Text>
      </LinearGradient>

      {/* AI Prompt Input Card */}
      <View
        style={[
          styles.promptCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <View style={styles.promptLabelRow}>
          <Text style={styles.sectionTitle}>{t.home.promptLabel}</Text>
          <Text style={styles.charCount}>{draftPrompt.length}/500</Text>
        </View>

        <TextInput
          value={draftPrompt}
          onChangeText={(text) => {
            setDraftPrompt(text);
            if (promptError && text.trim()) setPromptError(false);
          }}
          placeholder={t.home.promptPlaceholder}
          placeholderTextColor={COLORS.textMuted}
          multiline
          maxLength={500}
          textAlignVertical="top"
          style={[
            styles.promptInput,
            {
              backgroundColor: theme.surfaceElevated,
              borderColor: promptError ? COLORS.danger : theme.border,
            },
          ]}
        />

        {promptError ? (
          <Text style={styles.errorText}>{t.home.promptRequired}</Text>
        ) : null}

        <GradientButton
          label={t.home.generateButton}
          iconName="creation"
          onPress={handleGeneratePress}
        />
      </View>

      {/* Recent Projects Section */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.home.recentProjectsTitle}</Text>
          <Pressable
            onPress={() => navigation.navigate('MyProjects')}
            hitSlop={10}
            accessibilityRole="button"
            style={styles.viewAllBtn}
          >
            <Text style={styles.viewAllText}>{t.home.viewAll}</Text>
          </Pressable>
        </View>

        {isLoadingProjects ? (
          <View
            style={[
              styles.emptyRecentBox,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <ActivityIndicator size="small" color={COLORS.amethyst} />
            <Text style={styles.emptyRecentText}>{t.common.loadingProjects}</Text>
          </View>
        ) : storageError ? (
          <View
            style={[
              styles.emptyRecentBox,
              { backgroundColor: COLORS.dangerSurface, borderColor: COLORS.danger },
            ]}
          >
            <Text style={styles.errorText}>{storageError}</Text>
            <Pressable onPress={refreshProjects} style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>{t.common.retry}</Text>
            </Pressable>
          </View>
        ) : recentProjects.length === 0 ? (
          <View
            style={[
              styles.emptyRecentBox,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Text style={styles.emptyRecentText}>{t.home.noRecentProjects}</Text>
          </View>
        ) : (
          <View style={styles.recentList}>
            {recentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() =>
                  navigation.navigate(TOOL_ID_TO_ROUTE[project.toolId], {
                    projectId: project.id,
                    initialPrompt: project.prompt,
                  })
                }
              />
            ))}
          </View>
        )}
      </View>

      {/* 7 AI Tools Grid */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{t.home.toolsGridTitle}</Text>
            <Text style={styles.sectionSubtitle}>{t.home.toolsGridSubtitle}</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('AITools')}
            hitSlop={10}
            accessibilityRole="button"
            style={styles.viewAllBtn}
          >
            <Text style={styles.viewAllText}>{t.home.viewAll}</Text>
          </Pressable>
        </View>

        <View style={styles.toolsGrid}>
          {AI_TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              compact
              style={{ width: cardWidth }}
              onPress={() =>
                navigation.navigate(TOOL_ID_TO_ROUTE[tool.id], {
                  initialPrompt: draftPrompt.trim() || undefined,
                })
              }
            />
          ))}
        </View>
      </View>
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
    gap: 20,
  },
  heroCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: 20,
    gap: 10,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandName: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  personalMeta: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  welcomeTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 31,
  },
  welcomeSubtitle: {
    color: '#DDD6FE',
    fontSize: 14,
    lineHeight: 20,
  },
  promptCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  promptLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  charCount: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  promptInput: {
    minHeight: 100,
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
    fontWeight: '500',
  },
  sectionBlock: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    marginTop: 2,
  },
  viewAllBtn: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  viewAllText: {
    color: COLORS.textSecondary,
    fontSize: 13.5,
    fontWeight: '600',
  },
  recentList: {
    gap: 10,
  },
  emptyRecentBox: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
  },
  emptyRecentText: {
    color: COLORS.textMuted,
    fontSize: 13.5,
    textAlign: 'center',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
});
