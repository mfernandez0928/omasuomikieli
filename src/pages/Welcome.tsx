import { useRef, useState } from 'react';
import { HeroArt } from '@/components/HeroArt';
import { Icon } from '@/components/Icon';
import { cleanName, isName } from '@/services/storage/prefs';
import { rosterEnabled } from '@/services/sync/roster';

/**
 * Shown once, before the app opens, to ask who is using it.
 *
 * The note at the bottom follows the build: it says the name stays on the
 * device, or that the name alone is reported, depending on whether this build
 * has a roster configured. A name box that does not say where the name goes
 * reads as a sign-up, and in the reporting case it would also be untrue.
 */
export function Welcome({ onDone }: { onDone: (first: string, last: string) => void }) {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [touched, setTouched] = useState(false);

  /*
    Everyone who used the app before this screen existed meets it on their next
    visit, and a name wall in front of work they have already done reads as
    "start again". Their streak and saved words are untouched, so say so.
  */
  const [returning] = useState(() => {
    try {
      return Boolean(
        localStorage.getItem('oma-suomi:streak') ||
          localStorage.getItem('oma-suomi:favourites') ||
          localStorage.getItem('oma-suomi:settings'),
      );
    } catch {
      return false;
    }
  });

  const firstOk = isName(first);
  const lastOk = isName(last);
  const ready = firstOk && lastOk;

  /*
    One submit only. Enter and a tap, or a double tap, both land before the
    screen has a chance to go away, and each one would have created a profile
    of its own — a second local id, and a second name on the roster.
  */
  const done = useRef(false);

  const submit = () => {
    setTouched(true);
    if (!ready || done.current) return;
    done.current = true;
    onDone(cleanName(first), cleanName(last));
  };

  return (
    <div className="page page--welcome fade-in">
      <section className="hero">
        <HeroArt />
        <h1 className="hero__title">
          Oma
          <span>Suomi</span>
        </h1>
        <p className="hero__sub">Learn Finnish. Every Day.</p>
      </section>

      <div className="panel" style={{ marginTop: 18 }}>
        <p className="eyebrow">Tervetuloa</p>
        <h2 className="section__title" style={{ fontSize: '1.15rem', marginTop: 4 }}>
          Mikä sinun nimesi on?
        </h2>
        <p className="small muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
          What is your name? The app greets you with it and keeps your progress under it.
        </p>

        {returning && (
          <div className="callout callout--ok" style={{ marginTop: 12 }}>
            <span className="callout__icon">
              <Icon name="check" size={14} />
            </span>
            <span>
              Everything you have done is still here — your streak, the words you have
              learned and My Mistakes. Only the name is new.
            </span>
          </div>
        )}

        <div className="field" style={{ marginTop: 16 }}>
          <label className="field__label" htmlFor="firstName">
            Etunimi · First name
          </label>
          <input
            id="firstName"
            className="input"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            autoComplete="given-name"
            autoCapitalize="words"
            spellCheck={false}
            maxLength={40}
          />
          {touched && !firstOk && (
            <p className="tiny" style={{ color: 'var(--bad)' }}>
              Please enter a first name — two letters is enough.
            </p>
          )}
        </div>

        <div className="field" style={{ marginTop: 12 }}>
          <label className="field__label" htmlFor="lastName">
            Sukunimi · Last name
          </label>
          <input
            id="lastName"
            className="input"
            value={last}
            onChange={(e) => setLast(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            autoComplete="family-name"
            autoCapitalize="words"
            spellCheck={false}
            maxLength={40}
          />
          {touched && !lastOk && (
            <p className="tiny" style={{ color: 'var(--bad)' }}>
              A last name is needed too.
            </p>
          )}
        </div>

        <button
          className="btn btn--primary btn--block"
          style={{ marginTop: 18 }}
          onClick={submit}
          disabled={!ready && touched}
        >
          Aloitetaan · Start
          <Icon name="chevron-right" size={18} />
        </button>

        {/*
          Shown only when this build reports names. With no roster configured
          the screen says nothing about where the name goes, which is better
          than a promise that would stop being true the day keys are added.
        */}
        {rosterEnabled && (
          <p className="tiny dim" style={{ marginTop: 14, lineHeight: 1.65 }}>
            Only your name is recorded, so the person who made the app knows who is using
            it. Your progress stays on this device. You can change the name in Settings.
          </p>
        )}
      </div>
    </div>
  );
}
