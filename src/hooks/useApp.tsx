import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  DayActivity,
  LessonProgress,
  MistakeEntry,
  PersonalWord,
  Settings,
  SrsCard,
  SrsGrade,
  UserProfile,
  WordStatus,
} from '@/types';
import {
  DEFAULT_SETTINGS,
  loadProfile,
  loadSettings,
  loadStreak,
  makeProfile,
  saveProfile,
  saveSettings,
  todayKey,
  type StreakState,
} from '@/services/storage/prefs';
import { recordLearner } from '@/services/sync/roster';
import {
  loadActivity,
  loadCards,
  loadFavourites,
  loadLessonProgress,
  loadMistakes,
  loadPersonalWords,
  recordActivity,
  saveCard,
  saveFavourites,
  saveLessonProgress,
  saveMistake,
  savePersonalWord,
  deleteMistake as removeMistake,
  deletePersonalWord as removePersonalWord,
  logMistake,
  newId,
} from '@/services/storage/progress';
import { isStorageAvailable } from '@/services/storage/db';
import { applyGrade, createCard } from '@/services/srs/scheduler';
import { initSpeech } from '@/services/speech';

export type LoadState = 'loading' | 'ready' | 'unavailable';

interface AppState {
  loadState: LoadState;
  settings: Settings;
  cards: SrsCard[];
  activity: DayActivity[];
  mistakes: MistakeEntry[];
  personalWords: PersonalWord[];
  lessonProgress: LessonProgress[];
  favourites: Set<string>;
  streak: StreakState;
  speechReady: boolean;
  /** null until the learner has given a name. */
  profile: UserProfile | null;

  updateSettings: (patch: Partial<Settings>) => void;
  /** Creates the profile on first run, or renames an existing one. */
  setProfileName: (firstName: string, lastName: string) => void;
  gradeCard: (card: SrsCard, grade: SrsGrade) => Promise<SrsCard>;
  setWordStatus: (wordId: string, status: WordStatus) => Promise<void>;
  toggleFavourite: (wordId: string) => void;
  addMistake: (
    input: Omit<MistakeEntry, 'id' | 'createdAt' | 'reviewed' | 'resolved'>,
  ) => Promise<void>;
  updateMistake: (entry: MistakeEntry) => Promise<void>;
  deleteMistake: (id: string) => Promise<void>;
  addPersonalWord: (input: Omit<PersonalWord, 'id' | 'createdAt'>) => Promise<void>;
  deletePersonalWord: (id: string) => Promise<void>;
  saveProgress: (progress: LessonProgress) => Promise<void>;
  noteActivity: (delta: Partial<Omit<DayActivity, 'date'>>) => Promise<void>;
  cardFor: (kind: SrsCard['kind'], refId: string) => SrsCard | undefined;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  // Read synchronously so the name gate never flashes for someone who has one.
  const [profile, setProfile] = useState<UserProfile | null>(() => loadProfile());
  const [cards, setCards] = useState<SrsCard[]>([]);
  const [activity, setActivity] = useState<DayActivity[]>([]);
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);
  const [personalWords, setPersonalWords] = useState<PersonalWord[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState<StreakState>({ lastDate: '', current: 0, best: 0 });
  const [speechReady, setSpeechReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setSettings(loadSettings());
    setFavourites(loadFavourites());
    setStreak(loadStreak());

    if (!isStorageAvailable()) {
      setLoadState('unavailable');
      return;
    }

    Promise.all([
      loadCards(),
      loadActivity(),
      loadMistakes(),
      loadPersonalWords(),
      loadLessonProgress(),
    ])
      .then(([c, a, m, p, lp]) => {
        if (cancelled) return;
        setCards(c);
        setActivity(a);
        setMistakes(m);
        setPersonalWords(p);
        setLessonProgress(lp);
        setLoadState('ready');
      })
      .catch(() => {
        if (!cancelled) setLoadState('unavailable');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    initSpeech().then((ok) => {
      if (!cancelled) setSpeechReady(ok);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  const cardFor = useCallback(
    (kind: SrsCard['kind'], refId: string) => cards.find((c) => c.id === `${kind}:${refId}`),
    [cards],
  );

  const upsertCard = useCallback((card: SrsCard) => {
    setCards((prev) => {
      const idx = prev.findIndex((c) => c.id === card.id);
      if (idx === -1) return [...prev, card];
      const next = [...prev];
      next[idx] = card;
      return next;
    });
  }, []);

  const noteActivity = useCallback(async (delta: Partial<Omit<DayActivity, 'date'>>) => {
    const updated = await recordActivity(delta);
    setActivity((prev) => {
      const rest = prev.filter((a) => a.date !== updated.date);
      return [...rest, updated];
    });
    setStreak(loadStreak());
  }, []);

  /*
    `cards` is in the dependency list on purpose. applyGrade looks the card
    up in the deck it is handed, so handing it a stale deck would bring back
    the very bug it exists to prevent. Reading the deck inside the state
    updater instead would be worse: updaters run twice under StrictMode, and
    this one has to save to IndexedDB.
  */
  const gradeCard = useCallback(
    async (card: SrsCard, grade: SrsGrade) => {
      const { cards: updated, card: next } = applyGrade(cards, card, grade);
      setCards(updated);
      await saveCard(next);
      await noteActivity({ wordsStudied: 1 });
      return next;
    },
    [cards, noteActivity],
  );

  const setWordStatus = useCallback(
    async (wordId: string, status: WordStatus) => {
      const existing = cards.find((c) => c.id === `word:${wordId}`) ?? createCard('word', wordId);
      const next: SrsCard = { ...existing, status };
      // Marking something known pushes it out of the daily queue for a while.
      if (status === 'known' && next.intervalDays < 21) {
        next.intervalDays = 21;
        next.due = Date.now() + 21 * 24 * 60 * 60 * 1000;
      }
      if (status === 'difficult') {
        next.due = Date.now();
        next.intervalDays = 0;
      }
      upsertCard(next);
      await saveCard(next);
    },
    [cards, upsertCard],
  );

  const toggleFavourite = useCallback((wordId: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
      saveFavourites(next);
      return next;
    });
  }, []);

  /*
    The new profile is built here rather than inside a `setProfile` updater.
    An updater has to be pure: React calls it more than once for the same
    change, and StrictMode does so on purpose in development. With the save
    and the roster POST inside one, every name typed on the first screen
    arrived at the table twice.
  */
  const setProfileName = useCallback(
    (firstName: string, lastName: string) => {
      if (profile && profile.firstName === firstName && profile.lastName === lastName) return;
      const next = profile
        ? { ...profile, firstName, lastName }
        : makeProfile(firstName, lastName);
      saveProfile(next);
      setProfile(next);
      // Reporting the name must never hold up the screen behind it.
      void recordLearner(next);
    },
    [profile],
  );

  const addMistake = useCallback(
    async (input: Omit<MistakeEntry, 'id' | 'createdAt' | 'reviewed' | 'resolved'>) => {
      const entry = await logMistake(input);
      setMistakes((prev) => {
        const rest = prev.filter((m) => m.id !== entry.id);
        return [entry, ...rest];
      });
    },
    [],
  );

  const updateMistake = useCallback(async (entry: MistakeEntry) => {
    await saveMistake(entry);
    setMistakes((prev) => prev.map((m) => (m.id === entry.id ? entry : m)));
  }, []);

  const deleteMistake = useCallback(async (id: string) => {
    await removeMistake(id);
    setMistakes((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const addPersonalWord = useCallback(async (input: Omit<PersonalWord, 'id' | 'createdAt'>) => {
    const word: PersonalWord = { ...input, id: newId('pw'), createdAt: Date.now() };
    await savePersonalWord(word);
    setPersonalWords((prev) => [word, ...prev]);
  }, []);

  const deletePersonalWord = useCallback(async (id: string) => {
    await removePersonalWord(id);
    setPersonalWords((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const saveProgress = useCallback(async (progress: LessonProgress) => {
    const stamped = { ...progress, updatedAt: Date.now() };
    await saveLessonProgress(stamped);
    setLessonProgress((prev) => {
      const rest = prev.filter((p) => p.grammarId !== stamped.grammarId);
      return [...rest, stamped];
    });
  }, []);

  const value = useMemo<AppState>(
    () => ({
      loadState,
      settings,
      profile,
      cards,
      activity,
      mistakes,
      personalWords,
      lessonProgress,
      favourites,
      streak,
      speechReady,
      updateSettings,
      setProfileName,
      gradeCard,
      setWordStatus,
      toggleFavourite,
      addMistake,
      updateMistake,
      deleteMistake,
      addPersonalWord,
      deletePersonalWord,
      saveProgress,
      noteActivity,
      cardFor,
    }),
    [
      loadState,
      settings,
      cards,
      activity,
      mistakes,
      personalWords,
      lessonProgress,
      favourites,
      streak,
      speechReady,
      profile,
      updateSettings,
      setProfileName,
      gradeCard,
      setWordStatus,
      toggleFavourite,
      addMistake,
      updateMistake,
      deleteMistake,
      addPersonalWord,
      deletePersonalWord,
      saveProgress,
      noteActivity,
      cardFor,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>.');
  return ctx;
}

/** Words studied today, against the daily goal. */
export function useDailyProgress() {
  const { activity, settings } = useApp();
  const today = activity.find((a) => a.date === todayKey());
  const done = today?.wordsStudied ?? 0;
  return {
    done,
    goal: settings.dailyGoal,
    percent: Math.min(100, Math.round((done / Math.max(1, settings.dailyGoal)) * 100)),
  };
}
