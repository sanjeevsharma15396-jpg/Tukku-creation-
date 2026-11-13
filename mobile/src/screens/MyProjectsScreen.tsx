import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EmptyState } from '../components/EmptyState';
import { ProjectCard } from '../components/ProjectCard';
import { useApp } from '../context/AppContext';
import { AI_TOOLS } from '../data/tools';
import { COLORS, RADIUS } from '../theme/colors';
import {
  AIToolId,
  MainTabParamList,
  ProjectItem,
  RootStackParamList,
  TOOL_ID_TO_ROUTE,
} from '../types';

type ProjectsNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'MyProjects'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const MyProjectsScreen: React.FC = () => {
  const navigation = useNavigation<ProjectsNavProp>();
  const {
    language,
    t,
    theme,
    projects,
    isLoadingProjects,
    storageError,
    refreshProjects,
    deleteProject,
    restorePlaceholders,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToolFilter, setSelectedToolFilter] = useState<AIToolId | 'all'>('all');

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return projects.filter((item) => {
      const matchesTool =
        selectedToolFilter === 'all' || item.toolId === selectedToolFilter;
      if (!matchesTool) return false;
      if (!query) return true;
      const tool = AI_TOOLS.find((entry) => entry.id === item.toolId);
      const toolTitle = tool ? tool.title[language].toLowerCase() : '';
      return (
        item.title.toLowerCase().includes(query) ||
        item.prompt.toLowerCase().includes(query) ||
        toolTitle.includes(query)
      );
    });
  }, [projects, searchQuery, selectedToolFilter, language]);

  const confirmDelete = (project: ProjectItem) => {
    Alert.alert(t.projects.confirmDeleteTitle, t.projects.confirmDeleteBody, [
      { text: t.projects.cancel, style: 'cancel' },
      {
        text: t.projects.confirm,
        style: 'destructive',
        onPress: () => {
          deleteProject(project.id).catch(() => {});
        },
      },
    ]);
  };

  const hasActiveFilter = searchQuery.trim().length > 0 || selectedToolFilter !== 'all';

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerBlock}>
          <Text style={styles.headerTitle}>{t.projects.headerTitle}</Text>
          <Text style={styles.headerSubtitle}>{t.projects.headerSubtitle}</Text>
        </View>
        <Pressable
          onPress={() => {
            refreshProjects().catch(() => {});
          }}
          accessibilityRole="button"
          accessibilityLabel={t.common.refresh}
          style={[styles.refreshBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <MaterialCommunityIcons name="refresh" size={18} color={COLORS.textSecondary} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchBox,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <MaterialCommunityIcons name="magnify" size={20} color={COLORS.textMuted} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t.projects.searchPlaceholder}
          placeholderTextColor={COLORS.textMuted}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 ? (
          <Pressable
            onPress={() => setSearchQuery('')}
            hitSlop={10}
            accessibilityRole="button"
            style={styles.clearBtn}
          >
            <MaterialCommunityIcons name="close-circle" size={18} color={COLORS.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {/* Tool Filter Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        <Pressable
          onPress={() => setSelectedToolFilter('all')}
          style={[
            styles.filterTab,
            {
              backgroundColor:
                selectedToolFilter === 'all' ? COLORS.violetPrimary : theme.surface,
              borderColor:
                selectedToolFilter === 'all' ? COLORS.amethyst : theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.filterTabText,
              selectedToolFilter === 'all' && styles.filterTabTextActive,
            ]}
          >
            {t.projects.filterAll}
          </Text>
        </Pressable>

        {AI_TOOLS.map((tool) => {
          const active = selectedToolFilter === tool.id;
          return (
            <Pressable
              key={tool.id}
              onPress={() => setSelectedToolFilter(tool.id)}
              style={[
                styles.filterTab,
                {
                  backgroundColor: active ? COLORS.violetPrimary : theme.surface,
                  borderColor: active ? COLORS.amethyst : theme.border,
                },
              ]}
            >
              <Text
                style={[styles.filterTabText, active && styles.filterTabTextActive]}
              >
                {tool.shortLabel[language]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Loading, Error, Empty, or Project List */}
      {isLoadingProjects ? (
        <View
          style={[
            styles.stateBox,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <ActivityIndicator size="large" color={COLORS.amethyst} />
          <Text style={styles.stateText}>{t.common.loadingProjects}</Text>
        </View>
      ) : storageError ? (
        <EmptyState
          iconName="alert-circle-outline"
          title={t.common.storageErrorTitle}
          body={storageError}
          primaryLabel={t.common.retry}
          onPrimaryPress={() => {
            refreshProjects().catch(() => {});
          }}
        />
      ) : filteredProjects.length === 0 ? (
        hasActiveFilter ? (
          <EmptyState
            iconName="file-search-outline"
            title={t.projects.emptySearchTitle}
            body={t.projects.emptySearchBody}
            primaryLabel={t.projects.resetSearch}
            onPrimaryPress={() => {
              setSearchQuery('');
              setSelectedToolFilter('all');
            }}
            secondaryLabel={t.projects.createNew}
            onSecondaryPress={() => navigation.navigate('Create')}
          />
        ) : (
          <EmptyState
            iconName="folder-open-outline"
            title={t.projects.emptyTitle}
            body={t.projects.emptyBody}
            primaryLabel={t.projects.createNew}
            onPrimaryPress={() => navigation.navigate('Create')}
            secondaryLabel={t.projects.restorePlaceholders}
            onSecondaryPress={() => {
              restorePlaceholders().catch(() => {});
            }}
          />
        )
      ) : (
        <View style={styles.list}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() =>
                navigation.navigate(TOOL_ID_TO_ROUTE[project.toolId], {
                  projectId: project.id,
                  initialPrompt: project.prompt,
                })
              }
              onDelete={() => confirmDelete(project)}
            />
          ))}
        </View>
      )}
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
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerBlock: {
    flex: 1,
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
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    minHeight: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14.5,
    paddingVertical: 10,
  },
  clearBtn: {
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    gap: 8,
  },
  filterTab: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: COLORS.textPrimary,
  },
  stateBox: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
  },
  stateText: {
    color: COLORS.textSecondary,
    fontSize: 13.5,
  },
  list: {
    gap: 12,
  },
});
