/**
 * Timing shared by the CSS and the components that wait on it.
 *
 * The CSS durations in global.css match these. A component that has to know
 * when an animation is over (to unmount something, or to unlock a button)
 * reads them here instead of guessing.
 */
export const FLIP_MS = 460;
export const COLLAPSE_MS = 260;
export const MODAL_EXIT_MS = 160;

/** Gap between list items that reveal together, and how many get a delay. */
export const STAGGER_STEP_MS = 40;
export const STAGGER_MAX_STEPS = 8;

/**
 * How many items at the top of a long list get an entrance at all. The rest
 * simply render: a dictionary of hundreds of words must scroll like a list,
 * not like a slideshow.
 */
export const REVEAL_LIMIT = 24;

/**
 * Delay for the `index`-th item of a batch that appears together. Capped so
 * the last of a large batch is never left waiting.
 */
export function staggerDelay(
  index: number,
  step = STAGGER_STEP_MS,
  maxSteps = STAGGER_MAX_STEPS,
): number {
  if (!Number.isFinite(index) || index <= 0) return 0;
  return Math.min(Math.floor(index), maxSteps) * step;
}

/** A percentage clamped to 0-100, safe for NaN from an empty set. */
export function clampPercent(percent: number): number {
  if (!Number.isFinite(percent)) return 0;
  return Math.min(100, Math.max(0, percent));
}

/** Whether the learner has asked the system for less motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * A guard that ignores calls while an earlier one is still animating.
 *
 * A double tap on "Show answer" would otherwise land its second tap on the
 * grade button that takes the same place, and grade a card nobody read.
 */
export function createLock(now: () => number = Date.now) {
  let until = 0;
  return {
    /** Runs `fn` and locks for `ms`, unless already locked. Returns whether it ran. */
    run(fn: () => void, ms: number): boolean {
      const t = now();
      if (t < until) return false;
      until = t + ms;
      fn();
      return true;
    },
    isLocked(): boolean {
      return now() < until;
    },
  };
}
