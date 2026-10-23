import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import type { Level, Verification } from '@/types';
import { useApp } from '@/hooks/useApp';
import { speak } from '@/services/speech';

/* ------------------------------ page header ------------------------------ */

export function TopBar({
  title,
  subtitle,
  onSearch,
  right,
  back = true,
}: {
  title: string;
  subtitle?: string;
  onSearch?: () => void;
  right?: ReactNode;
  back?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <header className="topbar">
      {back && (
        <button className="icon-btn icon-btn--plain" onClick={() => navigate(-1)} aria-label="Go back">
          <Icon name="chevron-left" size={22} />
        </button>
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <h1 className="topbar__title">{title}</h1>
        {subtitle && <p className="topbar__sub">{subtitle}</p>}
      </div>
      {onSearch && (
        <button className="icon-btn icon-btn--plain" onClick={onSearch} aria-label="Search">
          <Icon name="search" size={20} />
        </button>
      )}
      {right}
    </header>
  );
}

/* --------------------------------- badges -------------------------------- */

export function LevelBadge({ level }: { level: Level }) {
  return <span className="badge badge--level">{level}</span>;
}

/**
 * Shows how trustworthy an entry's linguistic data is. `verified` entries get
 * no badge - clean is the default and only the exceptions are flagged.
 */
const VERIFICATION_BADGE: Record<
  Verification,
  { label: string; className: string; hint: string } | null
> = {
  'source-verified': {
    label: 'sourced',
    className: 'badge--ok',
    hint: 'Found in a named textbook at a page that was read, and its forms were checked.',
  },
  // The common case: a badge on nearly every word would be noise, so this one
  // renders nothing and the detail page carries the basis.
  'linguistically-checked': null,
  supplementary: {
    label: 'supplementary',
    className: 'badge',
    hint: 'Kept because it is useful, but not traced to a source or fully checked.',
  },
  'needs-review': {
    label: 'needs review',
    className: 'badge--review',
    hint: 'Something specific about this entry is uncertain.',
  },
};

export function VerificationBadge({
  verification,
  note,
}: {
  verification: Verification;
  note?: string;
}) {
  const meta = VERIFICATION_BADGE[verification];
  if (!meta) return null;
  return (
    <span className={`badge ${meta.className}`} title={note ?? meta.hint}>
      {meta.label}
    </span>
  );
}

/* --------------------------------- speaker -------------------------------- */

export function SpeakButton({ text, label }: { text: string; label?: string }) {
  const { settings, speechReady } = useApp();
  if (!settings.speechEnabled || !speechReady) return null;
  return (
    <button
      className="icon-btn icon-btn--plain"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        speak(text);
      }}
      aria-label={label ?? `Listen to ${text}`}
      style={{ width: 34, height: 34, flex: 'none' }}
    >
      <Icon name="speaker" size={17} />
    </button>
  );
}

/* --------------------------------- states --------------------------------- */

export function EmptyState({
  icon = 'idea',
  title,
  text,
  action,
}: {
  icon?: IconName;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty__icon">
        <Icon name={icon} size={26} />
      </div>
      <p className="empty__title">{title}</p>
      <p className="empty__text">{text}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

export function Loading({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="empty">
      <div className="empty__icon">
        <Icon name="loader" size={24} className="spin" />
      </div>
      <p className="empty__text">{label}</p>
    </div>
  );
}

/**
 * Shown when IndexedDB cannot be opened (private browsing, blocked storage).
 * Reading still works; only persistence is affected, and the warning says so
 * before answers are lost.
 */
export function StorageWarning() {
  return (
    <div className="callout callout--warn" style={{ marginTop: 12 }}>
      <span className="callout__icon">
        <Icon name="alert" size={14} />
      </span>
      <span>
        <b>Progress will not be saved.</b> This browser is blocking local storage, so reviews,
        mistakes and saved words last only until you close the tab. Lessons and the dictionary still
        work normally.
      </span>
    </div>
  );
}

export function Callout({
  kind = 'info',
  icon,
  children,
}: {
  kind?: 'info' | 'warn' | 'ok' | 'bad';
  icon?: IconName;
  children: ReactNode;
}) {
  const fallback: Record<string, IconName> = {
    info: 'idea',
    warn: 'alert',
    ok: 'check',
    bad: 'x',
  };
  return (
    <div className={`callout callout--${kind}`}>
      <span className="callout__icon">
        <Icon name={icon ?? fallback[kind]} size={14} />
      </span>
      <span>{children}</span>
    </div>
  );
}

/* ------------------------------- form bits -------------------------------- */

export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="switch">
      <span>
        <span style={{ fontWeight: 600, fontSize: '0.94rem' }}>{label}</span>
        {hint && (
          <span className="small muted" style={{ display: 'block', marginTop: 2 }}>
            {hint}
          </span>
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`switch__track ${checked ? 'switch__track--on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="switch__knob" />
      </button>
    </label>
  );
}

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="progress__fill" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
    </div>
  );
}

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
  label: string;
}) {
  return (
    <div className="pills" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          className={`pill ${o.value === value ? 'pill--active' : ''}`}
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------- navigation ------------------------------ */

/**
 * Leaving a screen you have finished with.
 *
 * Finishing a practice set and then pressing the phone's back button should
 * not drop you into the questions you just answered. Navigating forward to
 * the word would do exactly that, and replacing the entry is no better: it
 * leaves two entries pointing at the same screen, so the first back press
 * looks like nothing happened.
 *
 * So this pops the finished screen off instead, and only falls back to a
 * plain navigation when there is nothing to pop - someone who opened the
 * practice URL directly has no previous screen to return to.
 *
 * React Router keeps its position in `history.state.idx`, which is how we can
 * tell the difference.
 */
export function useLeaveFor() {
  const navigate = useNavigate();
  return (fallback: string) => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  };
}
