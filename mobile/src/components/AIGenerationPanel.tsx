import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AIToolId, AppLanguage } from '../types';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS } from '../theme/colors';
import { generateOfflineDraft, generateWithGemini, isAiServerConfigured } from '../services/aiService';
import { consumeFreeAiUse, FREE_AI_DAILY_LIMIT, getDailyAiUsage } from '../services/usageService';

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
  const [mode, setMode] = useState<'offline' | 'gemini' | null>(null);
  const [dailyCount, setDailyCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    getDailyAiUsage().then((usage) => {
      setDailyCount(usage.count);
      setLimitReached(usage.count >= FREE_AI_DAILY_LIMIT);
    }).catch(() => {});
  }, []);

  const saveResult = async (text: string, generatedMode: 'offline' | 'gemini') => {
    setResult(text);
    setMode(generatedMode);
    await upsertProject({
      title: `${generatedMode === 'gemini' ? 'AI' : 'Free'} ${toolId} · ${prompt.trim().slice(0, 30)}`,
      prompt: text,
      toolId,
      outputLanguage: language,
      metadata: { ...(context ?? {}), generatedBy: generatedMode === 'gemini' ? 'Gemini' : 'Free Offline Mode' },
    });
  };

  const generate = async (useGemini: boolean) => {
    if (!prompt.trim()) {
      setError(language === 'hi' ? 'पहले अपना प्रॉम्प्ट लिखें।' : 'Please enter a prompt first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (useGemini) {
        if (limitReached) throw new Error('FREE_AI_LIMIT_REACHED');
        const text = await generateWithGemini({ toolId, prompt: prompt.trim(), language, context });
        const usage = await consumeFreeAiUse();
        setDailyCount(usage.count);
        setLimitReached(usage.count >= FREE_AI_DAILY_LIMIT);
        await saveResult(text, 'gemini');
      } else {
        const text = generateOfflineDraft({ toolId, prompt: prompt.trim(), language, context });
        await saveResult(text, 'offline');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to generate content.';
      setError(message === 'FREE_AI_LIMIT_REACHED'
        ? (language === 'hi' ? 'आज की 10 requests की स्थानीय सीमा पूरी हो गई है। Premium या भुगतान अभी ऐप में उपलब्ध नहीं है; मुफ्त Offline रूपरेखा इस्तेमाल करें।' : 'The local 10-request limit has been reached. Premium or paid access is not available in this app; use the free offline outline.')
        : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.borderStrong }]}>
      <View style={styles.headingRow}>
        <MaterialCommunityIcons name="creation" size={20} color={COLORS.amethyst} />
        <Text style={styles.heading}>{language === 'hi' ? 'क्रिएशन असिस्टेंट' : 'Creation Assistant'}</Text>
      </View>
      <Text style={[styles.hint, { color: COLORS.textMuted }]}>
        {language === 'hi'
          ? 'Free Offline Mode बिना Server और बिना भुगतान के रूपरेखा बनाता है। Gemini AI Server जुड़ने पर अलग विकल्प मिलेगा।'
          : 'Free Offline Mode creates an outline without a server or payment. Gemini AI becomes available when a server is connected.'}
      </Text>
      <Pressable
        onPress={() => generate(false)}
        disabled={loading}
        accessibilityRole="button"
        style={({ pressed }) => [styles.button, pressed && styles.pressed, loading && styles.disabled]}
      >
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <MaterialCommunityIcons name="lightning-bolt" size={18} color="#FFFFFF" />}
        <Text style={styles.buttonText}>{loading ? (language === 'hi' ? 'तैयार हो रहा है…' : 'Preparing…') : (language === 'hi' ? 'मुफ्त Offline रूपरेखा बनाएं' : 'Create free offline outline')}</Text>
      </Pressable>
      {isAiServerConfigured ? (
        <>
          <Text style={styles.status}>{language === 'hi' ? `आज की मुफ्त AI requests: ${dailyCount}/${FREE_AI_DAILY_LIMIT}` : `Free AI requests today: ${dailyCount}/${FREE_AI_DAILY_LIMIT}`}</Text>
          <Pressable onPress={() => generate(true)} disabled={loading || limitReached} style={[styles.secondaryButton, (loading || limitReached) && styles.disabled]}>
            <Text style={styles.secondaryText}>{limitReached ? (language === 'hi' ? 'आज की सीमा पूरी' : 'Daily limit reached') : (language === 'hi' ? 'Gemini AI से बनाएं' : 'Generate with Gemini AI')}</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.status}>{language === 'hi' ? 'Gemini Server अभी कनेक्ट नहीं है। Offline सुविधा उपलब्ध है।' : 'Gemini server is not connected. Offline tools are available.'}</Text>
      )}
      {!!error && <Text style={styles.error}>{error}</Text>}
      {!!result && (
        <View style={[styles.resultBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
          <Text style={styles.resultLabel}>{mode === 'gemini' ? 'Gemini AI' : (language === 'hi' ? 'Free Offline रूपरेखा' : 'Free Offline Outline')}</Text>
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
  secondaryButton: { minHeight: 42, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.amethyst, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  secondaryText: { color: COLORS.amethyst, fontSize: 13, fontWeight: '800' },
  status: { color: COLORS.textMuted, fontSize: 12, lineHeight: 18 },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.65 },
  error: { color: COLORS.danger, fontSize: 12.5, lineHeight: 18 },
  resultBox: { borderWidth: 1, borderRadius: RADIUS.md, padding: 12, gap: 8 },
  resultLabel: { color: COLORS.amethyst, fontWeight: '800', fontSize: 13 },
  resultText: { color: COLORS.textPrimary, fontSize: 13.5, lineHeight: 21 },
  saved: { color: '#86EFAC', fontSize: 11.5 },
});
