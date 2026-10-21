import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import {
  APP_VERSION,
  RELEASES,
  compareVersions,
  releasesSince,
  type Release,
} from '@/data/releases';

const SEEN_KEY = 'oma-suomi:seen-version';

/**
 * Remembers which version the learner has already been told about, so the
 * dialog appears once per update rather than once per launch.
 *
 * Both reads and writes are wrapped: localStorage throws in some private
 * browsing modes, and a learner whose storage is blocked should still be able
 * to use the app - they just get the dialog once per session instead of once
 * per update, which `shownThisSession` below takes care of.
 */
function readSeen(): string | null {
  try {
    return localStorage.getItem(SEEN_KEY);
  } catch {
    return null;
  }
}

function writeSeen(version: string): void {
  try {
    localStorage.setItem(SEEN_KEY, version);
  } catch {
    /* Storage is blocked; shownThisSession stops it reappearing. */
  }
}

/**
 * Survives a re-render but not a reload, which is exactly what is needed when
 * storage cannot be written to.
 */
let shownThisSession = false;

/**
 * Decides whether to open the dialog, and which releases to show in it.
 *
 * `hasProfile` matters: someone opening the app for the very first time has
 * not missed anything, and a "what's new" list in front of a first run reads
 * as a changelog for an app they have never used. They are marked as having
 * seen the current version instead, so their first dialog is the next real
 * update.
 */
export function useWhatsNew(hasProfile: boolean) {
  const [releases, setReleases] = useState<Release[] | null>(null);

  useEffect(() => {
    if (shownThisSession) return;

    const seen = readSeen();

    // First run: nothing has been missed. Start the clock instead.
    if (!hasProfile) {
      if (seen === null) writeSeen(APP_VERSION);
      return;
    }

    // Already up to date.
    if (seen !== null && compareVersions(APP_VERSION, seen) <= 0) return;

    /*
      A learner who was already using the app before this screen existed has
      no stored version. Showing them the whole list is right: they have in
      fact not been told about any of it.
    */
    const missed = seen === null ? RELEASES : releasesSince(seen);
    if (missed.length === 0) {
      writeSeen(APP_VERSION);
      return;
    }

    shownThisSession = true;
    setReleases(missed);
  }, [hasProfile]);

  const dismiss = useCallback(() => {
    writeSeen(APP_VERSION);
    setReleases(null);
  }, []);

  return { releases, dismiss };
}

/**
 * The dialog itself.
 *
 * It is a real modal: focus moves into it, Escape closes it, a click on the
 * backdrop closes it, and the page behind it does not scroll. Those are the
 * things that make a pop-up feel like part of the app rather than something
 * that happened to it.
 */
export function WhatsNew({
  releases,
  onClose,
  heading = "What's new",
}: {
  releases: Release[];
  onClose: () => void;
  heading?: string;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      // Keep Tab inside the dialog while it is open.
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  if (releases.length === 0) return null;

  return (
    <div
      className="modal__backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="whatsnew-title"
        // The backdrop closes the dialog; a click inside it must not.
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__head">
          <span className="modal__icon">
            <Icon name="gift" size={17} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 id="whatsnew-title" className="modal__title">
              {heading}
            </h2>
          </div>
          <button
            className="icon-btn icon-btn--plain"
            onClick={onClose}
            aria-label="Close"
            ref={closeRef}
          >
            <Icon name="x" size={17} />
          </button>
        </div>

        <div className="modal__body">
          {releases.map((r) => (
            <section key={r.version} className="release">
              <div className="release__head">
                <span className="badge badge--ok">v{r.version}</span>
                <span className="tiny dim">{r.date}</span>
              </div>
              <h3 className="release__title">{r.title}</h3>

              <ul className="release__list">
                {r.notes.map((n) => (
                  <li key={n}>
                    <span className="release__tick">
                      <Icon name="check" size={12} />
                    </span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="modal__foot">
          <button className="btn btn--primary btn--block" onClick={onClose}>
            Selvä · Sige
          </button>
        </div>
      </div>
    </div>
  );
}
