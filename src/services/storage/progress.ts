import type { DayActivity, LessonProgress, MistakeEntry, PersonalWord, SrsCard } from '@/types';
import { STORES, getAll, getOne, put, putMany, remove } from './db';
import { todayKey, touchStreak } from './prefs';

/* ----------------------------- SRS cards ----------------------------- */

export function loadCards(): Promise<SrsCard[]> {
  return getAll<SrsCard>(STORES.srs);
}

export function saveCard(card: SrsCard): Promise<void> {
  return put(STORES.srs, card);
}

export function saveCards(cards: SrsCard[]): Promise<void> {
  return putMany(STORES.srs, cards);
}

export function deleteCard(id: string): Promise<void> {
  return remove(STORES.srs, id);
}

/* ----------------------------- activity ----------------------------- */

export function loadActivity(): Promise<DayActivity[]> {
  return getAll<DayActivity>(STORES.activity);
}

export async function recordActivity(delta: Partial<Omit<DayActivity, 'date'>>): Promise<DayActivity> {
  const date = todayKey();
  const existing = (await getOne<DayActivity>(STORES.activity, date)) ?? {
    date,
    wordsStudied: 0,
    exercisesAnswered: 0,
    exercisesCorrect: 0,
  };

  const next: DayActivity = {
    date,
    wordsStudied: existing.wordsStudied + (delta.wordsStudied ?? 0),
    exercisesAnswered: existing.exercisesAnswered + (delta.exercisesAnswered ?? 0),
    exercisesCorrect: existing.exercisesCorrect + (delta.exercisesCorrect ?? 0),
  };

  await put(STORES.activity, next);
  touchStreak();
  return next;
}

/** The seven days ending today, oldest first, with gaps filled in as zeros. */
export function lastSevenDays(activity: DayActivity[], now = new Date()): DayActivity[] {
  const byDate = new Map(activity.map((a) => [a.date, a]));
  const out: DayActivity[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = todayKey(d);
    out.push(
      byDate.get(key) ?? { date: key, wordsStudied: 0, exercisesAnswered: 0, exercisesCorrect: 0 },
    );
  }
  return out;
}

/* -------------------------- lesson progress -------------------------- */

export function loadLessonProgress(): Promise<LessonProgress[]> {
  return getAll<LessonProgress>(STORES.lessonProgress);
}

export function getLessonProgress(grammarId: string): Promise<LessonProgress | undefined> {
  return getOne<LessonProgress>(STORES.lessonProgress, grammarId);
}

export async function saveLessonProgress(progress: LessonProgress): Promise<void> {
  await put(STORES.lessonProgress, { ...progress, updatedAt: Date.now() });
}

/* ------------------------------ mistakes ------------------------------ */

export function loadMistakes(): Promise<MistakeEntry[]> {
  return getAll<MistakeEntry>(STORES.mistakes);
}

export function saveMistake(entry: MistakeEntry): Promise<void> {
  return put(STORES.mistakes, entry);
}

export function deleteMistake(id: string): Promise<void> {
  return remove(STORES.mistakes, id);
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Logs a wrong answer. If the same wrong/right pair is already recorded and
 * unresolved, the existing entry is reused so the list does not fill up with
 * duplicates of the same slip.
 */
export async function logMistake(
  input: Omit<MistakeEntry, 'id' | 'createdAt' | 'reviewed' | 'resolved'>,
): Promise<MistakeEntry> {
  const existing = await loadMistakes();
  const match = existing.find(
    (m) => !m.resolved && m.wrong === input.wrong && m.right === input.right,
  );

  if (match) {
    const updated = { ...match, reviewed: match.reviewed + 1 };
    await saveMistake(updated);
    return updated;
  }

  const entry: MistakeEntry = {
    ...input,
    id: newId('mis'),
    createdAt: Date.now(),
    reviewed: 0,
    resolved: false,
  };
  await saveMistake(entry);
  return entry;
}

/* --------------------------- personal words --------------------------- */

export function loadPersonalWords(): Promise<PersonalWord[]> {
  return getAll<PersonalWord>(STORES.personalWords);
}

export function savePersonalWord(word: PersonalWord): Promise<void> {
  return put(STORES.personalWords, word);
}

export function deletePersonalWord(id: string): Promise<void> {
  return remove(STORES.personalWords, id);
}

/* ------------------------------ favourites ----------------------------- */

/**
 * Favourites and the known/learning/difficult flag live on the SRS card, so a
 * word you mark is automatically part of the review system.
 */
export interface WordFlags {
  favourite: boolean;
  status: SrsCard['status'];
}

const FAV_KEY = 'oma-suomi:favourites';

export function loadFavourites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (!raw) return new Set<string>();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set<string>();
    // Ids end up in routes and in lookups, so only id-shaped strings are kept.
    return new Set<string>(
      parsed.filter((id): id is string => typeof id === 'string' && /^[a-z0-9-]{1,64}$/i.test(id)),
    );
  } catch {
    return new Set();
  }
}

export function saveFavourites(ids: Set<string>): void {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}
