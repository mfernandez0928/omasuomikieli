import type { Settings, SessionResume } from '@/types';

/**
 * Small, synchronously-read preferences. localStorage is the right tool here:
 * these are tiny and needed during the first paint. Every access is wrapped
 * because localStorage throws in some private-browsing modes.
 *
 * Everything read back is validated field by field rather than cast. Storage
 * can hold anything an extension, an older build or a tampering script left
 * there, and an unchecked `as Settings` puts that straight into arithmetic and
 * into router paths.
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

/** Parses a stored value, or returns null when it is absent or not an object. */
function readRecord(key: string): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function boolOr(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

/** A finite integer inside [min, max]; anything else falls back. */
function intOr(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  const n = Math.round(value);
  return n < min || n > max ? fallback : n;
}

function stringOr(value: unknown, fallback: string, maxLength = 200): string {
  return typeof value === 'string' && value.length <= maxLength ? value : fallback;
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is full or blocked. The app keeps working with in-memory state.
  }
}

export function loadSettings(): Settings {
  const raw = readRecord(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  return {
    dailyGoal: intOr(raw.dailyGoal, DEFAULT_SETTINGS.dailyGoal, 1, 500),
    newPerDay: intOr(raw.newPerDay, DEFAULT_SETTINGS.newPerDay, 0, 200),
    showTagalog: boolOr(raw.showTagalog, DEFAULT_SETTINGS.showTagalog),
    showEnglish: boolOr(raw.showEnglish, DEFAULT_SETTINGS.showEnglish),
    speechEnabled: boolOr(raw.speechEnabled, DEFAULT_SETTINGS.speechEnabled),
  };
}

export function saveSettings(settings: Settings): void {
  writeJson(SETTINGS_KEY, settings);
}

/**
 * `refId` goes on to build a route, so it is restricted to the shape real ids
 * have rather than accepted as any string.
 */
const ID_PATTERN = /^[a-z0-9-]{1,64}$/i;

export function loadResume(): SessionResume[] {
  try {
    const raw = localStorage.getItem(RESUME_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e): e is Record<string, unknown> => typeof e === 'object' && e !== null)
      .filter((e) => (e.kind === 'grammar' || e.kind === 'vocabulary') &&
        typeof e.refId === 'string' && ID_PATTERN.test(e.refId))
      .slice(0, 4)
      .map((e) => ({
        kind: e.kind as SessionResume['kind'],
        refId: e.refId as string,
        title: stringOr(e.title, ''),
        subtitle: stringOr(e.subtitle, ''),
        percent: intOr(e.percent, 0, 0, 100),
        updatedAt: intOr(e.updatedAt, 0, 0, Number.MAX_SAFE_INTEGER),
      }));
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
  const raw = readRecord(STREAK_KEY);
  if (!raw) return DEFAULT_STREAK;
  const lastDate = stringOr(raw.lastDate, '', 10);
  return {
    lastDate: /^\d{4}-\d{2}-\d{2}$/.test(lastDate) ? lastDate : '',
    current: intOr(raw.current, 0, 0, 100000),
    best: intOr(raw.best, 0, 0, 100000),
  };
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
