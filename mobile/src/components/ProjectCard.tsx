import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { AI_TOOLS } from '../data/tools';
import { COLORS, RADIUS } from '../theme/colors';
import { ProjectItem } from '../types';

interface ProjectCardProps {
  project: ProjectItem;
  onOpen: () => void;
  onDelete?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen, onDelete }) => {
  const { language, t, theme } = useApp();
  const tool = AI_TOOLS.find((item) => item.id === project.toolId) ?? AI_TOOLS[0];
  const formattedDate = new Date(project.updatedAt).toLocaleDateString(
    language === 'hi' ? 'hi-IN' : 'en-US',
    { day: 'numeric', month: 'short' },
  );

  return (
    <Pressable
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={project.title}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons
            name={tool.iconName as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
            size={20}
            color={COLORS.textSecondary}
          />
        </View>
        <View style={styles.metaColumn}>
          <Text style={styles.title} numberOfLines={1}>
            {project.title}
          </Text>
          <Text style={styles.metaText} numberOfLines={1}>
            {tool.shortLabel[language]} ·{' '}
            {project.status === 'placeholder' ? t.projects.placeholderTag : t.projects.draftTag} ·{' '}
            {formattedDate}
          </Text>
        </View>
        {onDelete ? (
          <Pressable
            onPress={onDelete}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={t.projects.deleteProject}
            style={styles.deleteBtn}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={COLORS.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <Text style={styles.prompt} numberOfLines={2}>
        {project.prompt}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  pressed: {
    opacity: 0.9,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(124, 58, 237, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaColumn: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  deleteBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prompt: {
    color: '#D8CEF0',
    fontSize: 13.5,
    lineHeight: 19,
  },
});
