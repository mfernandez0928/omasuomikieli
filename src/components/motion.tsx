import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { Icon, type IconName } from './Icon';
import {
  COLLAPSE_MS,
  FLIP_MS,
  REVEAL_LIMIT,
  clampPercent,
  createLock,
  prefersReducedMotion,
  staggerDelay,
} from '@/services/motion/motion';

/*
  Small motion pieces shared across the app. Everything here is CSS-driven
  (the keyframes and transitions live in global.css under "motion"); these
  components only decide WHEN a class goes on, and keep content correct when
  animation is turned off.
*/

/* --------------------------- reduced motion ------------------------------ */

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReduced(onChange: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/** Live `prefers-reduced-motion`, so a component can skip waiting on an animation. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReduced, prefersReducedMotion, () => false);
}

/**
 * Ignores an action while the one before it is still animating.
 *
 * `run` performs the action and starts the lock; `locked` is true until the
 * animation has had time to finish. With reduced motion there is nothing to
 * wait for, so it never locks.
 */
export function useActionLock(ms: number) {
  const reduced = useReducedMotion();
  const lock = useRef(createLock());
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!locked) return;
    const t = window.setTimeout(() => setLocked(false), ms);
    return () => window.clearTimeout(t);
  }, [locked, ms]);

  const run = useCallback(
    (fn: () => void) => {
      const duration = reduced ? 0 : ms;
      if (lock.current.run(fn, duration) && duration > 0) setLocked(true);
    },
    [ms, reduced],
  );

  return { run, locked };
}

/* -------------------------------- flip card ------------------------------- */

/**
 * A study card that turns over to show its answer.
 *
 * The back face is not mounted until the card is flipped, so the meaning
 * cannot be read ahead by scrolling, selecting or a screen reader - the same
 * rule RevealTranslation follows. Flipping is one-way: the caller owns the
 * `flipped` state and resets it by giving the next card a new `key`, which
 * also keeps the old answer from turning back into view.
 *
 * A tap anywhere on the front flips it (except on a button inside it, such
 * as the speaker). Keyboard users have the caller's "Show answer" button;
 * once flipped, focus moves to the answer so it is read out and Tab carries
 * on to the grade buttons.
 */
export function FlipCard({
  flipped,
  onFlip,
  front,
  back,
  faceClassName = 'wcard',
  faceStyle,
}: {
  flipped: boolean;
  onFlip: () => void;
  front: ReactNode;
  back: ReactNode;
  faceClassName?: string;
  faceStyle?: CSSProperties;
}) {
  const backRef = useRef<HTMLDivElement | null>(null);
  const wasFlipped = useRef(flipped);

  useEffect(() => {
    if (flipped && !wasFlipped.current) backRef.current?.focus({ preventScroll: true });
    wasFlipped.current = flipped;
  }, [flipped]);

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (flipped) return;
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
    onFlip();
  };

  return (
    <div className={`flip ${flipped ? 'flip--on' : ''}`} onClick={onClick}>
      <div className="flip__inner">
        <div
          className={`flip__face flip__front ${faceClassName}`}
          style={faceStyle}
          aria-hidden={flipped || undefined}
          // Keeps the hidden front's speaker button out of the tab order.
          inert={flipped || undefined}
        >
          {front}
        </div>
        {flipped && (
          <div
            ref={backRef}
            tabIndex={-1}
            className={`flip__face flip__back ${faceClassName}`}
            style={faceStyle}
          >
            {back}
          </div>
        )}
      </div>
    </div>
  );
}

/** How long a FlipCard's turn takes, for callers that lock their buttons. */
export const FLIP_DURATION = FLIP_MS;

/* -------------------------------- collapse -------------------------------- */

/**
 * Opens and closes its content by height, so what sits below slides instead
 * of jumping.
 *
 * Children mount only while open (and for the length of the closing
 * animation), so hidden text stays out of the page entirely.
 */
export function Collapse({
  open,
  children,
  className = '',
  style,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const reduced = useReducedMotion();
  const [present, setPresent] = useState(open);
  const [expanded, setExpanded] = useState(open && reduced);
  const [settled, setSettled] = useState(open && reduced);
  const ref = useRef<HTMLDivElement | null>(null);

  /*
    Starting the open: the closed state has just been laid out, so reading its
    size makes the browser commit it as the starting point, and the open
    class set right after transitions from there. This happens before paint
    and does not wait on animation frames, which a throttled tab can delay
    indefinitely.
  */
  useLayoutEffect(() => {
    if (!open || !present || expanded) return;
    ref.current?.getBoundingClientRect();
    setExpanded(true);
  }, [open, present, expanded]);

  useEffect(() => {
    if (open) {
      setPresent(true);
      if (reduced) {
        setExpanded(true);
        setSettled(true);
        return;
      }
      const t = window.setTimeout(() => setSettled(true), COLLAPSE_MS + 40);
      return () => window.clearTimeout(t);
    }
    setExpanded(false);
    setSettled(false);
    if (reduced) {
      setPresent(false);
      return;
    }
    const t = window.setTimeout(() => setPresent(false), COLLAPSE_MS);
    return () => window.clearTimeout(t);
  }, [open, reduced]);

  if (!present) return null;
  return (
    <div
      ref={ref}
      className={`collapse ${expanded ? 'collapse--open' : ''} ${settled ? 'collapse--settled' : ''} ${className}`}
      style={style}
    >
      <div className="collapse__inner">{children}</div>
    </div>
  );
}

/* ------------------------------ answer marks ------------------------------ */

/** A checkmark that draws itself, for the option that was right. */
export function CheckMark() {
  return (
    <span className="mark mark--ok" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22">
        <circle className="mark__circle" cx="12" cy="12" r="10.5" />
        <path className="mark__tick" d="M7.2 12.4l3.1 3.1 6.5-6.7" />
      </svg>
    </span>
  );
}

/* ------------------------------- celebration ------------------------------ */

/**
 * One ring and a few dots that burst once from behind an icon. Decorative:
 * it takes no clicks, is hidden from screen readers and never loops.
 * The parent must be `position: relative`.
 */
export function Burst() {
  return (
    <span className="burst" aria-hidden="true">
      <span className="burst__ring" />
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} className="burst__dot" style={{ '--i': i } as CSSProperties} />
      ))}
    </span>
  );
}

/**
 * The round icon at the top of a finished set. A good result pops in with a
 * burst; a weaker one just appears, calm, so it never feels like mockery.
 */
export function Celebrate({
  good,
  icon,
  size = 60,
  start = false,
}: {
  good: boolean;
  icon?: IconName;
  size?: number;
  /** Sit at the start of a left-aligned panel instead of centred. */
  start?: boolean;
}) {
  return (
    <div
      className={`celebrate ${good ? 'celebrate--good' : ''}`}
      style={{ width: size, height: size, ...(start ? { marginLeft: 0 } : null) }}
    >
      <span className="celebrate__icon">
        <Icon name={icon ?? (good ? 'check' : 'refresh')} size={Math.round(size * 0.47)} />
      </span>
      {good && <Burst />}
    </div>
  );
}

/* -------------------------------- progress -------------------------------- */

/**
 * The coloured part of a progress bar. Moved with a transform rather than a
 * width so a change animates without re-laying out the page.
 */
export function ProgressFill({ percent }: { percent: number }) {
  return (
    <div
      className="progress__fill"
      style={{ transform: `translateX(${clampPercent(percent) - 100}%)` }}
    />
  );
}

/* ------------------------------- list reveal ------------------------------ */

/**
 * Lets the first few items of a list fade up as they scroll into view.
 *
 * Items opt in with `data-reveal`. Only the first REVEAL_LIMIT are touched,
 * and only once, when the list first has items - typing in a search box must
 * not replay it on every key. Items start visible; the hidden starting state
 * is added here, before paint, and only when an IntersectionObserver exists
 * and motion is allowed, so nothing can be stranded invisible.
 */
export function useRevealList(ref: RefObject<HTMLElement | null>, ready: boolean) {
  const reduced = useReducedMotion();
  const done = useRef(false);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !ready || done.current) return;
    done.current = true;
    if (reduced || typeof IntersectionObserver === 'undefined') return;

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]')).slice(
      0,
      REVEAL_LIMIT,
    );
    items.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        let batch = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.animationDelay = `${staggerDelay(batch++)}ms`;
          el.classList.add('reveal--in');
          observer.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -24px 0px' },
    );
    items.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      // Anything still waiting would otherwise stay invisible for good.
      items.forEach((el) => {
        if (!el.classList.contains('reveal--in')) el.classList.remove('reveal');
      });
      done.current = false;
    };
  }, [ref, ready, reduced]);
}
