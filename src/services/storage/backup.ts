/**
 * Moving a learner's data from one storage container to another.
 *
 * This exists because of a real problem rather than as a nice-to-have. On
 * iOS, a web app added to the home screen gets its own storage container,
 * separate from Safari's: Apple runs home-screen apps in an isolated context.
 * So a learner who studied in Safari and then installed the app to the home
 * screen opens it to an empty database. Nothing was deleted - the old data is
 * still in Safari - but the installed app cannot see it, and typing the same
 * name again only creates a fresh profile, because the name is a label, not a
 * key to anything. No progress is ever sent to a server, so there is nothing
 * to download either.
 *
 * A backup file is the only thing that crosses that boundary. Export in one
 * container, import in the other.
 *
 * Two rules shape the code below:
 *
 *  1. A restore is a merge, never a wipe. Records are written by key, so a
 *     record in the file replaces the one with the same key and everything
 *     else on the device is left alone. Importing can therefore not lose
 *     data, which matters when someone imports the wrong file by mistake.
 *  2. Nothing from the file is trusted. A backup is a file off the user's
 *     disk that anything could have written, so every preference is put
 *     through the same validator the app uses on startup, and every database
 *     record must at least carry the key its store is built on.
 */
import {
  STORES,
  type StoreName,
  getAll,
  putMany,
  isStorageAvailable,
} from '@/services/storage/db';
import {
  loadSettings,
  saveSettings,
  loadStreak,
  saveStreak,
  loadProfile,
  saveProfile,
} from '@/services/storage/prefs';
import { loadFavourites, saveFavourites } from '@/services/storage/progress';
import { APP_VERSION } from '@/data/releases';

/** Bumped only if the shape below changes in a way an old file cannot satisfy. */
export const BACKUP_FORMAT = 1;

const APP_TAG = 'oma-suomi';

/**
 * The localStorage keys worth carrying over, and why each one is here.
 *
 * `roster-sent` is included deliberately. It records that this learner's name
 * has already been sent to the roster, so restoring it stops the installed app
 * posting the same name a second time and adding a duplicate row.
 */
const PREF_KEYS = [
  'oma-suomi:profile',
  'oma-suomi:settings',
  'oma-suomi:streak',
  'oma-suomi:favourites',
  'oma-suomi:resume',
  'oma-suomi:seen-version',
  'oma-suomi:roster-sent',
] as const;

/** The property each store is keyed on; a record without it cannot be stored. */
const KEY_PATH: Record<StoreName, string> = {
  [STORES.srs]: 'id',
  [STORES.mistakes]: 'id',
  [STORES.personalWords]: 'id',
  [STORES.activity]: 'date',
  [STORES.lessonProgress]: 'grammarId',
  [STORES.meta]: 'key',
};

export interface Backup {
  app: typeof APP_TAG;
  format: number;
  exportedAt: string;
  appVersion: string;
  /** IndexedDB, one array per store. */
  stores: Record<string, unknown[]>;
  /** localStorage, already parsed from JSON where it was JSON. */
  prefs: Record<string, unknown>;
}

export interface RestoreReport {
  ok: boolean;
  /** Set when nothing could be restored at all. */
  error?: string;
  /** Records actually written, per store. */
  written: Record<string, number>;
  /** Records skipped because they had no usable key. */
  skipped: number;
  /** Preference keys restored, and ones the validators turned away. */
  prefsRestored: string[];
  prefsRejected: string[];
  /** The name in the file, once validated - what the learner will see. */
  name: string | null;
  /** Set when the file came from a newer build than this one. */
  formatWarning?: string;
}

function readPref(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return undefined;
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      // seen-version is a bare string, not JSON.
      return raw;
    }
  } catch {
    return undefined;
  }
}

function writePrefRaw(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch {
    // Storage full or blocked; the caller reports what did not land.
  }
}

/** Everything this device holds, as one plain object ready to be stringified. */
export async function createBackup(): Promise<Backup> {
  const stores: Record<string, unknown[]> = {};
  if (isStorageAvailable()) {
    await Promise.all(
      Object.values(STORES).map(async (s) => {
        // A wedged database must not leave the export spinning with no file;
        // better a backup that says which store is missing than none at all.
        try {
          stores[s] = await withTimeout(getAll(s), 15_000, 'The database');
        } catch {
          stores[s] = [];
        }
      }),
    );
  }

  const prefs: Record<string, unknown> = {};
  for (const key of PREF_KEYS) {
    const value = readPref(key);
    if (value !== undefined) prefs[key] = value;
  }

  return {
    app: APP_TAG,
    format: BACKUP_FORMAT,
    exportedAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    stores,
    prefs,
  };
}

/** How many learner records a backup carries, for showing before an import. */
export function countRecords(b: Backup): number {
  return Object.values(b.stores).reduce((n, arr) => n + (Array.isArray(arr) ? arr.length : 0), 0);
}

/**
 * Reads an untrusted value and returns it as a Backup, or null if it is not
 * one. Checked rather than cast: this comes from a file.
 */
export function parseBackup(raw: unknown): Backup | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  if (o.app !== APP_TAG) return null;
  if (typeof o.format !== 'number' || !Number.isFinite(o.format)) return null;

  const stores: Record<string, unknown[]> = {};
  if (typeof o.stores === 'object' && o.stores !== null && !Array.isArray(o.stores)) {
    for (const [k, v] of Object.entries(o.stores as Record<string, unknown>)) {
      if (Array.isArray(v)) stores[k] = v;
    }
  }

  const prefs: Record<string, unknown> = {};
  if (typeof o.prefs === 'object' && o.prefs !== null && !Array.isArray(o.prefs)) {
    for (const [k, v] of Object.entries(o.prefs as Record<string, unknown>)) {
      if ((PREF_KEYS as readonly string[]).includes(k)) prefs[k] = v;
    }
  }

  return {
    app: APP_TAG,
    format: o.format,
    exportedAt: typeof o.exportedAt === 'string' ? o.exportedAt : '',
    appVersion: typeof o.appVersion === 'string' ? o.appVersion : '',
    stores,
    prefs,
  };
}

/**
 * Puts a preference back only if the app's own loader accepts it.
 *
 * The value is written, read back through the validator that runs on startup,
 * and then written again in its cleaned form. Anything the validator rejects
 * leaves the previous value in place, so a damaged file cannot wipe a
 * working setting.
 */
function restorePref(key: string, value: unknown): boolean {
  const before = (() => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  })();

  const putBack = () => {
    try {
      if (before === null) localStorage.removeItem(key);
      else localStorage.setItem(key, before);
    } catch {
      /* ignore */
    }
  };

  writePrefRaw(key, value);

  switch (key) {
    case 'oma-suomi:profile': {
      const p = loadProfile();
      if (!p) {
        putBack();
        return false;
      }
      saveProfile(p);
      return true;
    }
    case 'oma-suomi:settings': {
      saveSettings(loadSettings());
      return true;
    }
    case 'oma-suomi:streak': {
      saveStreak(loadStreak());
      return true;
    }
    case 'oma-suomi:favourites': {
      const favs = loadFavourites();
      if (favs.size === 0 && Array.isArray(value) && value.length > 0) {
        // Every id in the file was rejected, so the file is not usable here.
        putBack();
        return false;
      }
      saveFavourites(favs);
      return true;
    }
    case 'oma-suomi:seen-version': {
      if (typeof value !== 'string' || !/^\d+(\.\d+){0,3}$/.test(value)) {
        putBack();
        return false;
      }
      return true;
    }
    case 'oma-suomi:resume': {
      if (!Array.isArray(value)) {
        putBack();
        return false;
      }
      return true;
    }
    case 'oma-suomi:roster-sent': {
      if (!Array.isArray(value) || value.some((v) => typeof v !== 'string')) {
        putBack();
        return false;
      }
      return true;
    }
    default:
      putBack();
      return false;
  }
}

/**
 * Rejects if a database call has not come back in time.
 *
 * IndexedDB can stop answering altogether rather than failing: an upgrade
 * held open by another tab, or a delete still pending against a live
 * connection, leaves `open()` hanging with no success, error or blocked
 * event. Without a bound on the wait, a restore started in that state sits on
 * "Restoring..." for ever - the worst thing to show someone who has come here
 * because their progress already looks lost. A timeout turns that into a
 * message they can act on.
 */
function withTimeout<T>(work: Promise<T>, ms: number, what: string): Promise<T> {
  return Promise.race([
    work,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${what} did not respond.`)), ms),
    ),
  ]);
}

/**
 * Merges a backup into this device. Existing records with the same key are
 * replaced; everything else is kept.
 */
export async function restoreBackup(raw: unknown): Promise<RestoreReport> {
  const report: RestoreReport = {
    ok: false,
    written: {},
    skipped: 0,
    prefsRestored: [],
    prefsRejected: [],
    name: null,
  };

  const backup = parseBackup(raw);
  if (!backup) {
    report.error = 'That file is not an Oma Suomi backup.';
    return report;
  }
  if (backup.format > BACKUP_FORMAT) {
    report.formatWarning =
      'This backup was made by a newer version of the app. Anything it does not recognise has been left out.';
  }

  let dbStalled = false;
  if (isStorageAvailable()) {
    for (const store of Object.values(STORES)) {
      const rows = backup.stores[store];
      if (!Array.isArray(rows) || rows.length === 0) continue;
      const keyPath = KEY_PATH[store];
      const usable = rows.filter((r): r is Record<string, unknown> => {
        if (typeof r !== 'object' || r === null || Array.isArray(r)) return false;
        const key = (r as Record<string, unknown>)[keyPath];
        return typeof key === 'string' && key.length > 0 && key.length <= 200;
      });
      report.skipped += rows.length - usable.length;
      if (usable.length === 0) continue;
      try {
        await withTimeout(putMany(store, usable), 15_000, 'The database');
        report.written[store] = usable.length;
      } catch {
        report.written[store] = 0;
        dbStalled = true;
      }
    }
    if (dbStalled && !Object.values(report.written).some((n) => n > 0)) {
      report.error =
        'The database on this device is not responding, so your words and review cards could not be written. Close any other tabs with the app open, then try again.';
      return report;
    }
  } else {
    report.error = 'This browser will not let the app store anything.';
    return report;
  }

  // The profile goes first, so a name is in place before anything reads it.
  const keys = Object.keys(backup.prefs).sort((a) =>
    a === 'oma-suomi:profile' ? -1 : 0,
  );
  for (const key of keys) {
    if (restorePref(key, backup.prefs[key])) report.prefsRestored.push(key);
    else report.prefsRejected.push(key);
  }

  report.name = loadProfile()?.firstName ?? null;
  report.ok =
    Object.values(report.written).some((n) => n > 0) || report.prefsRestored.length > 0;
  if (!report.ok && !report.error) {
    report.error = 'That backup held nothing this version of the app could read.';
  }
  return report;
}
