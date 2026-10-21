import type { UserProfile } from '@/types';

/**
 * Records who is using the app, by posting the name to a Supabase table.
 *
 * Scope is deliberately narrow. The only thing sent is the name the learner
 * typed, their local id and the time: no progress, no answers, no mistakes, no
 * device details. Those stay on the device, which is what the app tells them.
 *
 * Without the two environment variables the whole module is inert and the app
 * behaves exactly as it does offline, so a build with no credentials is a
 * local-only build rather than a broken one.
 *
 * A name is stored once and once only. One row per first and last name, not
 * one per visit and not one per device: if the name is already on the roster
 * nothing is written, so the table stays the size of the group using the app
 * rather than growing with every reload. Every path that could write the same
 * name twice is closed:
 *
 *  - a name that was accepted is remembered here and never posted again,
 *    which covers a second visit and a rename back and forth;
 *  - two calls racing for the same name collapse into one request;
 *  - a name sent from another phone, or from this one after site data was
 *    cleared, is refused by the unique index on the table and comes back as a
 *    409, which counts as "already recorded" rather than something to retry;
 *  - the retry queue holds one entry per learner, not one per attempt.
 *
 * The cost of this is that two different people with the same name appear on
 * the roster once. For a roster whose question is "who is using the app" that
 * is the right trade; a roster that must count people needs the id to be what
 * makes a row unique instead, both here and in the index.
 */

const URL_BASE = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/+$/, '');
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const TABLE = 'learners';
const QUEUE_KEY = 'oma-suomi:roster-queue';
const SENT_KEY = 'oma-suomi:roster-sent';

/** True when this build has somewhere to send to. */
export const rosterEnabled = Boolean(URL_BASE && ANON_KEY);

interface Entry {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

function toEntry(p: UserProfile): Entry {
  return {
    id: p.id,
    first_name: p.firstName,
    last_name: p.lastName,
    created_at: new Date(p.createdAt).toISOString(),
  };
}

/**
 * What makes one roster entry the same as another: the name, and nothing else.
 *
 * The local id is deliberately not part of it. A name already on the roster is
 * not worth a second row just because it arrived from another phone, or from
 * the same phone after site data was cleared and a fresh id was generated.
 * `created_at` is left out for the same reason.
 *
 * Case is folded, so "mark santos" does not sit next to "Mark Santos". This
 * matches the unique index on the table, which is on `lower()` of both names.
 */
function signature(e: Entry): string {
  return `${e.first_name.toLocaleLowerCase()}\u0000${e.last_name.toLocaleLowerCase()}`;
}

/* --------------------------- what already went --------------------------- */

function readSent(): string[] {
  try {
    const raw = localStorage.getItem(SENT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === 'string');
  } catch {
    return [];
  }
}

function hasSent(sig: string): boolean {
  return readSent().includes(sig);
}

function markSent(sig: string): void {
  try {
    const next = readSent().filter((s) => s !== sig);
    next.push(sig);
    // A device goes through a handful of names at most. The cap keeps a
    // tampered-with or very old key from growing without bound.
    localStorage.setItem(SENT_KEY, JSON.stringify(next.slice(-20)));
  } catch {
    /*
      Storage is blocked. The name may then be reported again on a later
      visit, which the unique index on the table absorbs.
    */
  }
}

/* ------------------------------ the queue ------------------------------- */

function readQueue(): Entry[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is Entry =>
        typeof e === 'object' && e !== null && typeof (e as Entry).id === 'string',
    );
  } catch {
    return [];
  }
}

function writeQueue(entries: Entry[]): void {
  try {
    // Keep the queue small: a device that has been offline for a long time
    // still only needs its most recent names.
    localStorage.setItem(QUEUE_KEY, JSON.stringify(entries.slice(-10)));
  } catch {
    /* Storage is blocked. The name simply is not reported. */
  }
}

/**
 * Queues an entry, replacing anything already waiting for the same learner.
 * The roster wants to know who someone is, not every name they passed through
 * while offline, and holding one entry per learner is what stops a few
 * corrections from arriving as a few rows.
 */
function queueEntry(entry: Entry): void {
  const waiting = readQueue().filter((e) => e.id !== entry.id);
  writeQueue([...waiting, entry]);
}

function dropFromQueue(sig: string): void {
  // Re-read rather than working from a copy taken earlier: a name typed while
  // a flush is running must not be dropped along with the entry being sent.
  writeQueue(readQueue().filter((e) => signature(e) !== sig));
}

/* ------------------------------- sending -------------------------------- */

type Outcome =
  /** The table has it. */
  | 'stored'
  /** The table already had it; the unique constraint said so. */
  | 'duplicate'
  /** The table refused it, and would refuse it again. Not worth keeping. */
  | 'refused'
  /** Offline, blocked, or the project is down. Worth another try. */
  | 'later';

async function post(entry: Entry): Promise<Outcome> {
  let res: Response;
  try {
    res = await fetch(`${URL_BASE}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(entry),
    });
  } catch {
    return 'later';
  }

  if (res.ok) return 'stored';
  // 409 is the unique index doing its job: this name is already on the roster,
  // whether from an earlier visit, from another phone, or from a request whose
  // answer never came back. Nothing more is needed, and retrying it is exactly
  // what must not happen.
  if (res.status === 409) return 'duplicate';
  // A bad key, a failed check constraint or a missing table will fail the same
  // way on every start-up. Dropping it beats retrying it forever.
  if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) {
    return 'refused';
  }
  return 'later';
}

/** Signatures being posted right now, so two callers cannot both send one. */
const inFlight = new Set<string>();

/**
 * Reports a name, at most once per name. Never throws and never blocks the UI:
 * a learner who is offline, or behind something that blocks the request,
 * carries on using the app and the entry goes out on a later visit.
 */
export async function recordLearner(profile: UserProfile): Promise<void> {
  if (!rosterEnabled) return;
  const entry = toEntry(profile);
  const sig = signature(entry);

  if (hasSent(sig) || inFlight.has(sig)) return;

  inFlight.add(sig);
  try {
    const outcome = await post(entry);
    if (outcome === 'stored' || outcome === 'duplicate') {
      markSent(sig);
      dropFromQueue(sig);
      return;
    }
    if (outcome === 'refused') return;
    queueEntry(entry);
  } finally {
    inFlight.delete(sig);
  }
}

/** Guards against a second flush starting while the first is still going. */
let flushing = false;

/** Retries anything that could not be sent earlier. Called once on start-up. */
export async function flushRoster(): Promise<void> {
  if (!rosterEnabled || flushing) return;
  const queue = readQueue();
  if (!queue.length) return;

  flushing = true;
  try {
    for (const entry of queue) {
      const sig = signature(entry);

      if (hasSent(sig) || inFlight.has(sig)) {
        dropFromQueue(sig);
        continue;
      }

      inFlight.add(sig);
      try {
        const outcome = await post(entry);
        if (outcome === 'stored' || outcome === 'duplicate') markSent(sig);
        if (outcome !== 'later') dropFromQueue(sig);
      } finally {
        inFlight.delete(sig);
      }
    }
  } finally {
    flushing = false;
  }
}
