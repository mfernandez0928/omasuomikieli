import type { SrsCard, SrsGrade, WordStatus } from '@/types';

/**
 * SM-2 style scheduler. State lives in IndexedDB on the device; the next
 * interval is shown on the answer buttons.
 *
 * - again: reset to 10 minutes, ease down, count a lapse
 * - hard:  interval x 1.2, ease down a little
 * - good:  interval x ease
 * - easy:  interval x ease x 1.3, ease up
 */

export const MINUTE = 60 * 1000;
export const DAY = 24 * 60 * MINUTE;

const MIN_EASE = 1.3;
const MAX_EASE = 2.8;
const START_EASE = 2.3;

/** A card that has never graduated gets this interval on a plain "good". */
const FIRST_INTERVAL_DAYS = 1;
/** "Easy" on a new card skips the slow start entirely. */
const EASY_FIRST_INTERVAL_DAYS = 4;

/** Local calendar day, the unit `newPerDay` is counted in. */
function dayKey(now: number): string {
  const d = new Date(now);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export function createCard(kind: SrsCard['kind'], refId: string, now = Date.now()): SrsCard {
  return {
    id: `${kind}:${refId}`,
    kind,
    refId,
    intervalDays: 0,
    ease: START_EASE,
    streak: 0,
    due: now,
    lastReviewed: 0,
    reps: 0,
    lapses: 0,
    status: 'new',
    introducedOn: dayKey(now),
  };
}

function clampEase(ease: number): number {
  return Math.min(MAX_EASE, Math.max(MIN_EASE, Number(ease.toFixed(2))));
}

function nextStatus(card: SrsCard, grade: SrsGrade, intervalDays: number): WordStatus {
  if (grade === 'again') return 'difficult';
  if (intervalDays >= 21) return 'known';
  if (card.status === 'difficult' && grade !== 'easy') return 'difficult';
  return 'learning';
}

export interface ReviewResult {
  card: SrsCard;
  /** Days until the card is due again (0 means later today). */
  intervalDays: number;
}

export function review(card: SrsCard, grade: SrsGrade, now = Date.now()): ReviewResult {
  let { ease, streak, intervalDays } = card;
  let lapses = card.lapses;

  if (grade === 'again') {
    ease = clampEase(ease - 0.2);
    streak = 0;
    lapses += 1;
    intervalDays = 0;
  } else {
    streak += 1;

    if (intervalDays === 0) {
      // The card has never graduated. Each grade still has to mean something
      // different here, or the buttons are decoration on a word's first review.
      if (grade === 'hard') {
        ease = clampEase(ease - 0.15);
        intervalDays = FIRST_INTERVAL_DAYS;
      } else if (grade === 'good') {
        intervalDays = FIRST_INTERVAL_DAYS;
      } else {
        ease = clampEase(ease + 0.15);
        intervalDays = EASY_FIRST_INTERVAL_DAYS;
      }
    } else {
      const base = intervalDays;
      if (grade === 'hard') {
        ease = clampEase(ease - 0.15);
        intervalDays = Math.max(1, Math.round(base * 1.2));
      } else if (grade === 'good') {
        intervalDays = Math.max(1, Math.round(base * ease));
      } else {
        ease = clampEase(ease + 0.15);
        intervalDays = Math.max(1, Math.round(base * ease * 1.3));
      }
    }
  }

  // Cap so a card never disappears for more than a year.
  intervalDays = Math.min(intervalDays, 365);

  const due = grade === 'again' ? now + 10 * MINUTE : now + intervalDays * DAY;

  return {
    card: {
      ...card,
      ease,
      streak,
      intervalDays,
      lapses,
      due,
      lastReviewed: now,
      reps: card.reps + 1,
      status: nextStatus(card, grade, intervalDays),
    },
    intervalDays,
  };
}

/** Human-readable preview for the answer buttons, e.g. "10 min", "3 d". */
export function previewInterval(card: SrsCard, grade: SrsGrade, now = Date.now()): string {
  const { intervalDays } = review(card, grade, now);
  if (grade === 'again') return '10 min';
  if (intervalDays === 1) return '1 d';
  if (intervalDays < 30) return `${intervalDays} d`;
  const months = Math.round(intervalDays / 30);
  return months < 12 ? `${months} mo` : `${Math.round(intervalDays / 365)} y`;
}

export function isDue(card: SrsCard, now = Date.now()): boolean {
  return card.due <= now;
}

/**
 * Applies a grade to whichever version of the card the deck currently holds.
 *
 * A session keeps its own copy of a card, and that copy goes stale the moment
 * the card is graded - most visibly when "again" puts a card back in the
 * queue and it comes round a second time. Grading the stale copy recomputes
 * from the old ease and lapse count and writes the result over the newer
 * record, erasing the lapse that had just been saved. Looking the card up by
 * id here makes that impossible, whatever the caller happens to be holding.
 */
export function applyGrade(
  cards: SrsCard[],
  card: SrsCard,
  grade: SrsGrade,
  now = Date.now(),
): { cards: SrsCard[]; card: SrsCard } {
  const current = cards.find((c) => c.id === card.id) ?? card;
  const { card: next } = review(current, grade, now);
  const others = cards.filter((c) => c.id !== next.id);
  return { cards: [...others, next], card: next };
}

/**
 * Builds today's queue: due reviews first (oldest due first), then whatever
 * is left of today's new-card allowance.
 *
 * The allowance is spent per calendar day, not per session. Counting only the
 * cards still waiting to be answered would refill it as soon as the learner
 * answered them, so a second visit on the same day would hand out a second
 * batch - and the setting says "per day".
 */
export function buildQueue(
  cards: SrsCard[],
  newCandidates: { kind: SrsCard['kind']; refId: string }[],
  newPerDay: number,
  now = Date.now(),
): SrsCard[] {
  const known = new Set(cards.map((c) => c.id));
  const today = dayKey(now);

  const due = cards.filter((c) => c.reps > 0 && isDue(c, now)).sort((a, b) => a.due - b.due);

  const started = cards.filter((c) => c.reps === 0 && isDue(c, now));

  const introducedToday = cards.filter((c) => c.introducedOn === today).length;

  const fresh = newCandidates
    .filter((n) => !known.has(`${n.kind}:${n.refId}`))
    .slice(0, Math.max(0, newPerDay - introducedToday))
    .map((n) => createCard(n.kind, n.refId, now));

  return [...due, ...started, ...fresh];
}

/**
 * How many cards a session started now would hold - due reviews plus the new
 * ones still to come. `dueCount` answers a narrower question and so reads as
 * "nothing to do" on a deck whose new-card allowance is untouched.
 */
export function sessionSize(
  cards: SrsCard[],
  newCandidates: { kind: SrsCard['kind']; refId: string }[],
  newPerDay: number,
  now = Date.now(),
): number {
  return buildQueue(cards, newCandidates, newPerDay, now).length;
}

export function dueCount(cards: SrsCard[], now = Date.now()): number {
  return cards.reduce((n, c) => (isDue(c, now) ? n + 1 : n), 0);
}
