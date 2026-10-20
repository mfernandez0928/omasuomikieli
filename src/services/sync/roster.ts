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
 */

const URL_BASE = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/+$/, '');
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const TABLE = 'learners';
const QUEUE_KEY = 'oma-suomi:roster-queue';

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

/* ------------------------------- sending -------------------------------- */

async function post(entry: Entry): Promise<boolean> {
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(entry),
    });
    return res.ok;
  } catch {
    // Offline, blocked, or the project is paused. Keep it queued.
    return false;
  }
}

/**
 * Reports a name. Never throws and never blocks the UI: a learner who is
 * offline, or behind something that blocks the request, carries on using the
 * app and the entry goes out on a later visit.
 */
export async function recordLearner(profile: UserProfile): Promise<void> {
  if (!rosterEnabled) return;
  const entry = toEntry(profile);

  if (await post(entry)) return;

  const queue = readQueue().filter((e) => !(e.id === entry.id && e.first_name === entry.first_name));
  writeQueue([...queue, entry]);
}

/** Retries anything that could not be sent earlier. Called once on start-up. */
export async function flushRoster(): Promise<void> {
  if (!rosterEnabled) return;
  const queue = readQueue();
  if (!queue.length) return;

  const left: Entry[] = [];
  for (const entry of queue) {
    if (!(await post(entry))) left.push(entry);
  }
  writeQueue(left);
}
