import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { AI_TOOLS } from '../data/tools';
import { COLORS, RADIUS } from '../theme/colors';
import { MainTabParamList, RootStackParamList, TOOL_ID_TO_ROUTE, ToolCategory } from '../types';

type ToolsNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'AITools'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const AIToolsScreen: React.FC = () => {
  const navigation = useNavigation<ToolsNavProp>();
  const { language, t, theme } = useApp();
  const [category, setCategory] = useState<ToolCategory>('all');

  const filteredTools = useMemo(() => {
    if (category === 'all') return AI_TOOLS;
    return AI_TOOLS.filter((tool) => tool.category === category);
  }, [category]);

  const categories: { id: ToolCategory; label: string }[] = [
    { id: 'all', label: t.tools.categories.all },
    { id: 'writing', label: t.tools.categories.writing },
    { id: 'visual', label: t.tools.categories.visual },
    { id: 'audio-video', label: t.tools.categories.audioVideo },
  ];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerBlock}>
        <Text style={styles.headerTitle}>{t.tools.headerTitle}</Text>
        <Text style={styles.headerSubtitle}>{t.tools.headerSubtitle}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {categories.map((cat) => {
          const active = category === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              accessibilityRole="button"
              style={[
                styles.categoryTab,
                {
                  backgroundColor: active ? COLORS.violetPrimary : theme.surface,
                  borderColor: active ? COLORS.amethyst : theme.border,
                },
              ]}
            >
              <Text
                style={[styles.categoryLabel, active && styles.categoryLabelActive]}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.cardsStack}>
        {filteredTools.map((tool) => (
          <Pressable
            key={tool.id}
            onPress={() => navigation.navigate(TOOL_ID_TO_ROUTE[tool.id])}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.toolRowCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <LinearGradient
              colors={tool.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconBox}
            >
              <MaterialCommunityIcons
                name={tool.iconName as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
                size={24}
                color={COLORS.textPrimary}
              />
            </LinearGradient>

            <View style={styles.infoColumn}>
              <Text style={styles.toolTitle}>{tool.title[language]}</Text>
              <Text style={styles.toolDesc}>{tool.description[language]}</Text>
              <Text style={styles.toolMeta}>
                {t.tools.phase1Label} · {t.tools.openTool}
              </Text>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={COLORS.textSecondary}
            />
          </Pressable>
        ))}
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
    gap: 16,
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
  categoryRow: {
    gap: 8,
  },
  categoryTab: {
    minHeight: 42,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryLabelActive: {
    color: COLORS.textPrimary,
  },
  cardsStack: {
    gap: 12,
  },
  toolRowCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  pressed: {
    opacity: 0.9,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoColumn: {
    flex: 1,
    gap: 4,
  },
  toolTitle: {
    color: COLORS.textPrimary,
    fontSize: 15.5,
    fontWeight: '700',
  },
  toolDesc: {
    color: '#D8CEF0',
    fontSize: 13,
    lineHeight: 18,
  },
  toolMeta: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
