import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS } from '../theme/colors';
import { AppLanguage } from '../types';

export const FieldInput: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}> = ({ label, value, onChangeText, placeholder }) => {
  const { theme } = useApp();
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        style={[
          styles.input,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      />
    </View>
  );
};

export const FieldTextArea: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  hasError?: boolean;
}> = ({ label, value, onChangeText, placeholder, hasError = false }) => {
  const { theme } = useApp();
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        multiline
        textAlignVertical="top"
        style={[
          styles.textarea,
          {
            backgroundColor: theme.surface,
            borderColor: hasError ? COLORS.danger : theme.border,
          },
        ]}
      />
    </View>
  );
};

export const OptionChipGroup: React.FC<{
  label: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}> = ({ label, options, selected, onSelect }) => {
  const { theme } = useApp();
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.wrapRow}>
        {options.map((opt) => {
          const active = selected === opt;
          return (
            <Pressable
              key={opt}
              onPress={() => onSelect(opt)}
              accessibilityRole="button"
              style={[
                styles.chip,
                {
                  backgroundColor: active ? COLORS.violetPrimary : theme.surface,
                  borderColor: active ? COLORS.amethyst : theme.border,
                },
              ]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export const OutputLanguagePicker: React.FC<{
  label: string;
  value: AppLanguage;
  onChange: (lang: AppLanguage) => void;
}> = ({ label, value, onChange }) => {
  const { theme } = useApp();
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.langRow}>
        {(['hi', 'en'] as AppLanguage[]).map((lang) => {
          const active = value === lang;
          return (
            <Pressable
              key={lang}
              onPress={() => onChange(lang)}
              accessibilityRole="button"
              style={[
                styles.langBtn,
                {
                  backgroundColor: active ? 'rgba(124, 58, 237, 0.24)' : theme.surface,
                  borderColor: active ? COLORS.amethyst : theme.border,
                },
              ]}
            >
              <Text style={[styles.langText, active && styles.langTextActive]}>
                {lang === 'hi' ? 'हिन्दी' : 'English'}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    gap: 8,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    color: COLORS.textPrimary,
    fontSize: 14.5,
  },
  textarea: {
    minHeight: 128,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: 14,
    color: COLORS.textPrimary,
    fontSize: 14.5,
    lineHeight: 21,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minHeight: 42,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: COLORS.textPrimary,
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
  langText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  langTextActive: {
    color: COLORS.textPrimary,
  },
});
