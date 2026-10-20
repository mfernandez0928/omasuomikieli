import { useState } from 'react';
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

  const firstOk = isName(first);
  const lastOk = isName(last);
  const ready = firstOk && lastOk;

  const submit = () => {
    setTouched(true);
    if (!ready) return;
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
        <p className="small muted" style={{ marginTop: 4, lineHeight: 1.55 }}>
          <b>Ano ang pangalan mo?</b> Ito ang ibabati sa iyo ng app at dito nakatali ang progress mo.
        </p>

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
            placeholder="Mark"
            autoComplete="given-name"
            autoCapitalize="words"
            spellCheck={false}
            maxLength={40}
          />
          {touched && !firstOk && (
            <p className="tiny" style={{ color: 'var(--bad)' }}>
              Kailangan ng pangalan — kahit dalawang letra man lang.
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
            placeholder="Fernandez"
            autoComplete="family-name"
            autoCapitalize="words"
            spellCheck={false}
            maxLength={40}
          />
          {touched && !lastOk && (
            <p className="tiny" style={{ color: 'var(--bad)' }}>
              Kailangan din ang apelyido.
            </p>
          )}
        </div>

        <button
          className="btn btn--primary btn--block"
          style={{ marginTop: 18 }}
          onClick={submit}
          disabled={!ready && touched}
        >
          Aloitetaan · Simulan
          <Icon name="chevron-right" size={18} />
        </button>

        <p className="tiny dim" style={{ marginTop: 14, lineHeight: 1.65 }}>
          {rosterEnabled ? (
            <>
              Nasa phone mo lang ang progress mo. Ang <b>pangalan lang</b> ang ipinapadala sa
              gumawa ng app, para malaman niya kung sino ang gumagamit — walang sagot, walang
              progress, walang ibang impormasyon. Walang password. Mapapalitan mo ito sa Settings,
              at pwede mong hilingin na burahin.
            </>
          ) : (
            <>
              Nananatili sa phone mo ang pangalan mo. Walang account, walang password, at hindi ito
              ipinapadala kahit saan. Mapapalitan mo ito mamaya sa Settings.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
