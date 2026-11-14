import Constants from 'expo-constants';
import { AIToolId, AppLanguage } from '../types';

const API_URL =
  Constants.expoConfig?.extra?.tukkuApiUrl ||
  process.env.EXPO_PUBLIC_TUKKU_API_URL ||
  '';

export async function generateWithGemini(input: {
  toolId: AIToolId;
  prompt: string;
  language: AppLanguage;
  context?: Record<string, string>;
}): Promise<string> {
  if (!API_URL) {
    throw new Error(
      'AI server URL is not configured. Set EXPO_PUBLIC_TUKKU_API_URL and rebuild the app.',
    );
  }
  const response = await fetch(`${String(API_URL).replace(/\/$/, '')}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `AI request failed (${response.status})`);
  }
  if (typeof payload.text !== 'string' || !payload.text.trim()) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }
  return payload.text.trim();
}
