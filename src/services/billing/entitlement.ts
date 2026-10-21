import { BILLING_ENABLED, limitsFor, type PlanId, type PlanLimits } from './plans';

/**
 * The one place the rest of the app would ask "is this allowed?".
 *
 * Nothing calls it yet. It is here so that when the time comes, the gates go
 * in through a single function with a single rule, rather than as scattered
 * `if (paid)` checks that each get the edge cases slightly wrong.
 *
 * While `BILLING_ENABLED` is false every one of these answers yes, so the
 * app behaves exactly as it does today.
 */

export interface Entitlement {
  plan: PlanId;
  limits: PlanLimits;
  /** When the current period ends. null while billing is off. */
  renewsAt: string | null;
  /**
   * True when the subscription is past due but still inside the grace period.
   * A learner mid-lesson should not be cut off because a card expired.
   */
  inGrace: boolean;
}

/** What the app assumes until a real entitlement is loaded: everything. */
export const OPEN_ENTITLEMENT: Entitlement = {
  plan: 'full',
  limits: limitsFor(null),
  renewsAt: null,
  inGrace: false,
};

/**
 * Whether a numbered thing - the nth lesson, the nth word - is reachable.
 * `index` is zero-based.
 */
export function withinLimit(index: number, limit: number | null): boolean {
  if (!BILLING_ENABLED) return true;
  if (limit === null) return true;
  return index < limit;
}

/** Whether a named feature is on for this entitlement. */
export function canUse(
  e: Entitlement,
  feature: 'favourites' | 'mistakes' | 'speech' | 'srs',
): boolean {
  if (!BILLING_ENABLED) return true;
  return e.limits[feature];
}

/**
 * How many of a daily allowance are left.
 *
 * Returns Infinity when there is no limit, so a caller can compare without
 * special-casing null.
 */
export function remainingToday(usedToday: number, limit: number | null): number {
  if (!BILLING_ENABLED || limit === null) return Infinity;
  return Math.max(0, limit - usedToday);
}

/**
 * Reads the entitlement for the signed-in learner.
 *
 * Deliberately not implemented. When it is, it must read from the server and
 * not from the device: a value in localStorage is a value the learner can
 * edit, so a client-side entitlement is a preference, not a subscription.
 *
 * The intended shape, once accounts exist:
 *
 *   const { data } = await supabase
 *     .from('subscriptions')
 *     .select('plan, current_period_end, status')
 *     .single();
 *
 * with row-level security restricting the row to `auth.uid()`, and the row
 * written only by the payment provider's webhook using the service role -
 * never by the browser.
 */
export async function loadEntitlement(): Promise<Entitlement> {
  if (!BILLING_ENABLED) return OPEN_ENTITLEMENT;
  throw new Error(
    'loadEntitlement is not implemented. See docs/subscription-plan.md before enabling billing.',
  );
}
