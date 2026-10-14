/**
 * Minimal IndexedDB wrapper - no dependency, ~150 lines.
 *
 * IndexedDB holds everything that grows: SRS cards, mistakes, personal words,
 * daily activity and lesson progress. Small preferences live in localStorage
 * (see prefs.ts) because they are read synchronously during the first render.
 */

const DB_NAME = 'oma-suomi';
const DB_VERSION = 1;

export const STORES = {
  srs: 'srs',
  mistakes: 'mistakes',
  personalWords: 'personalWords',
  activity: 'activity',
  lessonProgress: 'lessonProgress',
  meta: 'meta',
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

let dbPromise: Promise<IDBDatabase> | null = null;

/** True when IndexedDB is usable (it is not in some private-browsing modes). */
export function isStorageAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
  } catch {
    return false;
  }
}

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (!isStorageAvailable()) {
      reject(new Error('IndexedDB is not available in this browser context.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORES.srs)) {
        const srs = db.createObjectStore(STORES.srs, { keyPath: 'id' });
        srs.createIndex('due', 'due');
        srs.createIndex('kind', 'kind');
      }
      if (!db.objectStoreNames.contains(STORES.mistakes)) {
        const m = db.createObjectStore(STORES.mistakes, { keyPath: 'id' });
        m.createIndex('createdAt', 'createdAt');
        m.createIndex('resolved', 'resolved');
      }
      if (!db.objectStoreNames.contains(STORES.personalWords)) {
        db.createObjectStore(STORES.personalWords, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.activity)) {
        db.createObjectStore(STORES.activity, { keyPath: 'date' });
      }
      if (!db.objectStoreNames.contains(STORES.lessonProgress)) {
        db.createObjectStore(STORES.lessonProgress, { keyPath: 'grammarId' });
      }
      if (!db.objectStoreNames.contains(STORES.meta)) {
        db.createObjectStore(STORES.meta, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open the database.'));
    request.onblocked = () => reject(new Error('The database is blocked by another open tab.'));
  });

  return dbPromise;
}

function run<T>(
  store: StoreName,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(store, mode);
        const request = fn(tx.objectStore(store));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('Database request failed.'));
      }),
  );
}

export function getAll<T>(store: StoreName): Promise<T[]> {
  return run<T[]>(store, 'readonly', (s) => s.getAll() as IDBRequest<T[]>).catch(() => []);
}

export function getOne<T>(store: StoreName, key: IDBValidKey): Promise<T | undefined> {
  return run<T | undefined>(store, 'readonly', (s) => s.get(key) as IDBRequest<T | undefined>).catch(
    () => undefined,
  );
}

export function put<T>(store: StoreName, value: T): Promise<void> {
  return run(store, 'readwrite', (s) => s.put(value as unknown as object)).then(() => undefined);
}

export function putMany<T>(store: StoreName, values: T[]): Promise<void> {
  if (!values.length) return Promise.resolve();
  return openDb().then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const tx = db.transaction(store, 'readwrite');
        const s = tx.objectStore(store);
        for (const v of values) s.put(v as unknown as object);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error('Bulk write failed.'));
      }),
  );
}

export function remove(store: StoreName, key: IDBValidKey): Promise<void> {
  return run(store, 'readwrite', (s) => s.delete(key)).then(() => undefined);
}

export function clearStore(store: StoreName): Promise<void> {
  return run(store, 'readwrite', (s) => s.clear()).then(() => undefined);
}

/** Wipes every store. Used by the "reset my progress" action in Settings. */
export async function clearAll(): Promise<void> {
  await Promise.all(Object.values(STORES).map((s) => clearStore(s)));
}

/** Exports all learner data as a plain object, for the backup button. */
export async function exportAll(): Promise<Record<string, unknown[]>> {
  const entries = await Promise.all(
    Object.values(STORES).map(async (s) => [s, await getAll(s)] as const),
  );
  return Object.fromEntries(entries);
}
