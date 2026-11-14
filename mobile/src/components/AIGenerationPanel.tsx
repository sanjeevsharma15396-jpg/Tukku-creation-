import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AIToolId, AppLanguage } from '../types';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS } from '../theme/colors';
import { generateWithGemini } from '../services/aiService';

interface Props {
  toolId: AIToolId;
  prompt: string;
  language: AppLanguage;
  context?: Record<string, string>;
}

export const AIGenerationPanel: React.FC<Props> = ({ toolId, prompt, language, context }) => {
  const { theme, upsertProject, t } = useApp();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const generate = async () => {
    if (!prompt.trim()) {
      setError(language === 'hi' ? 'पहले अपना प्रॉम्प्ट लिखें।' : 'Please enter a prompt first.');
      return;
    }
    setLoading(true);
    setError('');
    setResult('');
    try {
      const text = await generateWithGemini({ toolId, prompt: prompt.trim(), language, context });
      setResult(text);
      await upsertProject({
        title: `AI ${toolId} · ${prompt.trim().slice(0, 34)}`,
        prompt: text,
        toolId,
        outputLanguage: language,
        metadata: { ...(context ?? {}), generatedBy: 'Gemini' },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.borderStrong }]}>
      <View style={styles.headingRow}>
        <MaterialCommunityIcons name="creation" size={20} color={COLORS.amethyst} />
        <Text style={styles.heading}>{language === 'hi' ? 'Gemini AI जनरेशन' : 'Gemini AI Generation'}</Text>
      </View>
      <Text style={[styles.hint, { color: COLORS.textMuted }]}>
        {language === 'hi'
          ? 'आपका आउटपुट अपने आप My Projects में सेव होगा।'
          : 'Your generated result is automatically saved to My Projects.'}
      </Text>
      <Pressable
        onPress={generate}
        disabled={loading}
        accessibilityRole="button"
        style={({ pressed }) => [styles.button, pressed && styles.pressed, loading && styles.disabled]}
      >
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <MaterialCommunityIcons name="auto-fix" size={18} color="#FFFFFF" />}
        <Text style={styles.buttonText}>
          {loading ? (language === 'hi' ? 'तैयार हो रहा है…' : 'Generating…') : (language === 'hi' ? 'Gemini से बनाएं' : 'Generate with Gemini')}
        </Text>
      </Pressable>
      {!!error && <Text style={styles.error}>{error}</Text>}
      {!!result && (
        <View style={[styles.resultBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
          <Text style={styles.resultLabel}>{language === 'hi' ? 'AI परिणाम' : 'AI Result'}</Text>
          <Text selectable style={styles.resultText}>{result}</Text>
          <Text style={styles.saved}><MaterialCommunityIcons name="check-circle" size={14} color="#86EFAC" /> {t.create.savedToast}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: RADIUS.lg, padding: 14, gap: 10 },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heading: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '800' },
  hint: { fontSize: 12.5, lineHeight: 18 },
  button: { minHeight: 48, borderRadius: RADIUS.md, backgroundColor: COLORS.violetPrimary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingHorizontal: 14 },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.65 },
  error: { color: COLORS.danger, fontSize: 12.5, lineHeight: 18 },
  resultBox: { borderWidth: 1, borderRadius: RADIUS.md, padding: 12, gap: 8 },
  resultLabel: { color: COLORS.amethyst, fontWeight: '800', fontSize: 13 },
  resultText: { color: COLORS.textPrimary, fontSize: 13.5, lineHeight: 21 },
  saved: { color: '#86EFAC', fontSize: 11.5, flexDirection: 'row', alignItems: 'center' },
});
