import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@tukku/ai-usage-v1';
export const FREE_AI_DAILY_LIMIT = 10;

interface UsageRecord {
  date: string;
  count: number;
}

function todayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}

async function readRecord(): Promise<UsageRecord> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as UsageRecord;
      if (parsed.date === todayKey() && Number.isFinite(parsed.count)) return parsed;
    }
  } catch {
    // Corrupt local counters safely reset for this app install.
  }
  return { date: todayKey(), count: 0 };
}

export async function getDailyAiUsage(): Promise<UsageRecord> {
  return readRecord();
}

export async function consumeFreeAiUse(): Promise<UsageRecord> {
  const current = await readRecord();
  if (current.count >= FREE_AI_DAILY_LIMIT) {
    throw new Error('FREE_AI_LIMIT_REACHED');
  }
  const next = { date: todayKey(), count: current.count + 1 };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
