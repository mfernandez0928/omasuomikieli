import type { Settings, SessionResume } from '@/types';

/**
 * Small, synchronously-read preferences. localStorage is the right tool here:
 * these are tiny and needed during the first paint. Every access is wrapped
 * because localStorage throws in some private-browsing modes.
 */

const SETTINGS_KEY = 'oma-suomi:settings';
const RESUME_KEY = 'oma-suomi:resume';
const STREAK_KEY = 'oma-suomi:streak';

export const DEFAULT_SETTINGS: Settings = {
  dailyGoal: 10,
  showTagalog: true,
  showEnglish: true,
  speechEnabled: true,
  newPerDay: 5,
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as object) } as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is full or blocked. The app keeps working with in-memory state.
  }
}

export function loadSettings(): Settings {
  return readJson<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export function saveSettings(settings: Settings): void {
  writeJson(SETTINGS_KEY, settings);
}

export function loadResume(): SessionResume[] {
  try {
    const raw = localStorage.getItem(RESUME_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SessionResume[]) : [];
  } catch {
    return [];
  }
}

/** Keeps the two most recent resumable sessions, newest first. */
export function saveResume(entry: SessionResume): void {
  const existing = loadResume().filter(
    (r) => !(r.kind === entry.kind && r.refId === entry.refId),
  );
  const next = [entry, ...existing].slice(0, 4);
  writeJson(RESUME_KEY, next);
}

export function clearResume(): void {
  try {
    localStorage.removeItem(RESUME_KEY);
  } catch {
    /* ignore */
  }
}

export interface StreakState {
  /** YYYY-MM-DD of the last day with any activity. */
  lastDate: string;
  current: number;
  best: number;
}

const DEFAULT_STREAK: StreakState = { lastDate: '', current: 0, best: 0 };

export function loadStreak(): StreakState {
  return readJson<StreakState>(STREAK_KEY, DEFAULT_STREAK);
}

export function saveStreak(state: StreakState): void {
  writeJson(STREAK_KEY, state);
}

export function todayKey(d: Date = new Date()): string {
  // Local time, not UTC: the streak follows the learner's own day.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function yesterdayKey(d: Date = new Date()): string {
  const y = new Date(d);
  y.setDate(y.getDate() - 1);
  return todayKey(y);
}

/** Advances the streak for today, returning the updated state. */
export function touchStreak(now: Date = new Date()): StreakState {
  const state = loadStreak();
  const today = todayKey(now);
  if (state.lastDate === today) return state;

  const next: StreakState =
    state.lastDate === yesterdayKey(now)
      ? { lastDate: today, current: state.current + 1, best: Math.max(state.best, state.current + 1) }
      : { lastDate: today, current: 1, best: Math.max(state.best, 1) };

  saveStreak(next);
  return next;
}
