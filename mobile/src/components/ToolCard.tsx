import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS } from '../theme/colors';
import { AIToolItem } from '../types';

interface ToolCardProps {
  tool: AIToolItem;
  onPress: () => void;
  compact?: boolean;
  style?: ViewStyle;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onPress, compact = false, style }) => {
  const { language, theme } = useApp();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={tool.title[language]}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          padding: compact ? 14 : 16,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={tool.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.iconBox, compact && styles.iconBoxCompact]}
      >
        <MaterialCommunityIcons
          name={tool.iconName as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
          size={compact ? 22 : 24}
          color={COLORS.textPrimary}
        />
      </LinearGradient>

      <Text
        style={[styles.title, compact && styles.titleCompact]}
        numberOfLines={2}
      >
        {tool.title[language]}
      </Text>

      <Text
        style={styles.description}
        numberOfLines={compact ? 2 : 3}
      >
        {tool.description[language]}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    minHeight: 140,
    justifyContent: 'flex-start',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconBoxCompact: {
    width: 42,
    height: 42,
    marginBottom: 10,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 6,
  },
  titleCompact: {
    fontSize: 14,
    lineHeight: 19,
  },
  description: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    lineHeight: 18,
  },
});
