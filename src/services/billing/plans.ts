/**
 * Subscription groundwork. NOT switched on.
 *
 * `BILLING_ENABLED` is false and nothing in the app reads these limits yet,
 * so this file changes nothing a learner can see. It exists so the decisions
 * are written down now - what free gets, what paid gets, what a plan costs -
 * instead of being invented in a hurry on the day checkout is wired up.
 *
 * Before any of this can be turned on, read docs/subscription-plan.md. The
 * short version: the app today is a static bundle with no accounts, and every
 * word and lesson is already inside the JavaScript it hands the browser. A
 * paywall on top of that is a suggestion, not a lock. Accounts and
 * server-side content have to come first, in that order.
 */

/**
 * The master switch. While this is false the app behaves exactly as it does
 * today: everything unlocked, no plan, no upgrade prompt, nothing rendered.
 *
 * Turning it true is not enough on its own and must not be done casually -
 * see the checklist in docs/subscription-plan.md.
 */
export const BILLING_ENABLED = false;

export type PlanId = 'free' | 'full';

/**
 * What a learner is allowed to do. Each limit is a number or `null`, where
 * null means no limit.
 */
export interface PlanLimits {
  /** Grammar lessons reachable, counted in curriculum order. */
  lessons: number | null;
  /** Dictionary entries reachable, counted in the app's own order. */
  words: number | null;
  /** Practice questions per day. */
  exercisesPerDay: number | null;
  /** Role-play scenes reachable. */
  situations: number | null;
  /** Reading texts reachable. */
  readingTexts: number | null;
  /** Listening items per day. */
  listeningPerDay: number | null;
  /** Saving a word to Favourites. */
  favourites: boolean;
  /** The My Mistakes tracker. */
  mistakes: boolean;
  /** Finnish text-to-speech. */
  speech: boolean;
  /** Spaced repetition scheduling rather than plain order. */
  srs: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  /** Monthly price in euro cents, so no float ever touches money. */
  priceCents: number;
  /** What the plan is for, one line, shown on the upgrade screen. */
  summary: string;
  limits: PlanLimits;
}

/**
 * The free tier is deliberately a real, usable app rather than a demo: enough
 * that someone can study with it for a couple of weeks and find out whether
 * it suits them. A free tier that stops on day one sells nothing.
 *
 * The paid tier is "all of it, forever". No second paid tier, no add-ons:
 * at this size another price point is more support work than revenue.
 */
export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    priceCents: 0,
    summary: 'The first lessons and a few hundred words, enough to get going.',
    limits: {
      lessons: 8,
      words: 300,
      exercisesPerDay: 20,
      situations: 1,
      readingTexts: 1,
      listeningPerDay: 10,
      favourites: true,
      mistakes: true,
      speech: true,
      srs: false,
    },
  },
  full: {
    id: 'full',
    name: 'Full access',
    // 5.50 EUR sits in the middle of the 5-6 range and reads as a price
    // rather than as a rounded guess.
    priceCents: 550,
    summary: 'Every lesson, every word, unlimited practice, and spaced repetition.',
    limits: {
      lessons: null,
      words: null,
      exercisesPerDay: null,
      situations: null,
      readingTexts: null,
      listeningPerDay: null,
      favourites: true,
      mistakes: true,
      speech: true,
      srs: true,
    },
  },
};

/** Everything unlocked. What the app uses while billing is off. */
export const UNLIMITED: PlanLimits = PLANS.full.limits;

/**
 * The limits in force right now.
 *
 * While `BILLING_ENABLED` is false this is always UNLIMITED, whatever plan is
 * passed in - so a call site added today cannot accidentally start locking
 * things before the switch is thrown.
 */
export function limitsFor(plan: PlanId | null): PlanLimits {
  if (!BILLING_ENABLED) return UNLIMITED;
  return PLANS[plan ?? 'free'].limits;
}

/** "5,50 €" - euro formatting, comma decimal, as Finland writes it. */
export function formatPrice(cents: number, locale = 'fi-FI'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(cents / 100);
}
