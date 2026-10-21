import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { Callout, EmptyState, FilterPills, TopBar, useGlossVisibility } from '@/components/ui';
import { PHRASES } from '@/data/phrases';
import { WORDS } from '@/data/words';
import { useApp } from '@/hooks/useApp';
import { speak } from '@/services/speech';
import { answersMatch } from '@/services/search/search';

interface ListeningItem {
  id: string;
  fi: string;
  en: string;
  tl: string;
}

type Mode = 'words' | 'phrases';

/**
 * Listening practice driven by the device's own Finnish voice. The app ships no
 * audio files, so without an installed fi-FI voice there is nothing to play and
 * the UI says so rather than falling back to an English one.
 */
export function Listening() {
  const navigate = useNavigate();
  const { speechReady, settings, noteActivity, addMistake } = useApp();
  const { showEn, showTl } = useGlossVisibility();

  const [mode, setMode] = useState<Mode>('phrases');
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState({ answered: 0, correct: 0 });

  const items = useMemo<ListeningItem[]>(() => {
    const pool: ListeningItem[] =
      mode === 'phrases'
        ? PHRASES.filter((p) => p.level !== 'B1').map((p) => ({
            id: p.id,
            fi: p.fi,
            en: p.en,
            tl: p.tl,
          }))
        : WORDS.filter((w) => w.examples?.length).map((w) => ({
            id: w.id,
            fi: w.examples![0].fi,
            en: w.examples![0].en,
            tl: w.examples![0].tl,
          }));

    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 10);
  }, [mode]);

  const item = items[index];

  if (!speechReady || !settings.speechEnabled) {
    return (
      <div className="page fade-in">
        <TopBar title="Listening Practice" back={false} />
        <EmptyState
          icon="wifi-off"
          title={settings.speechEnabled ? 'No Finnish voice on this device' : 'Speech is switched off'}
          text={
            settings.speechEnabled
              ? 'This app has no recorded audio files - it uses the Finnish voice built into your device. Install a Finnish (fi-FI) voice in your system settings and reopen this page. Everything else in the app works without it.'
              : 'Turn speech back on in Settings to use listening practice.'
          }
          action={
            <button className="btn btn--primary" onClick={() => navigate('/settings')}>
              Open settings
            </button>
          }
        />
      </div>
    );
  }

  if (!item) {
    const pct = score.answered ? Math.round((score.correct / score.answered) * 100) : 0;
    return (
      <div className="page fade-in">
        <TopBar title="Listening Practice" back={false} />
        <div className="panel center">
          <h2 className="section__title">
            {score.correct} / {score.answered} correct ({pct}%)
          </h2>
          <p className="small muted" style={{ marginTop: 8 }}>
            Listening is the slowest skill to build. Short daily sessions beat long ones.
          </p>
          <button
            className="btn btn--primary btn--block"
            style={{ marginTop: 16 }}
            onClick={() => {
              setIndex(0);
              setScore({ answered: 0, correct: 0 });
              setTyped('');
              setChecked(false);
            }}
          >
            Go again
          </button>
        </div>
      </div>
    );
  }

  const check = async () => {
    const ok = answersMatch(typed, item.fi);
    setCorrect(ok);
    setChecked(true);
    setScore((s) => ({ answered: s.answered + 1, correct: s.correct + (ok ? 1 : 0) }));
    await noteActivity({ exercisesAnswered: 1, exercisesCorrect: ok ? 1 : 0 });
    if (!ok) {
      await addMistake({
        wrong: typed.trim() || '(no answer)',
        right: item.fi,
        origin: 'practice',
        note: 'Listening practice',
      });
    }
  };

  const next = () => {
    setIndex((i) => i + 1);
    setTyped('');
    setChecked(false);
    setCorrect(false);
  };

  return (
    <div className="page fade-in">
      <TopBar title="Listening Practice" subtitle="Real-life Finnish" back={false} />

      <FilterPills
        label="What to listen to"
        value={mode}
        onChange={(m) => {
          setMode(m);
          setIndex(0);
          setTyped('');
          setChecked(false);
          setScore({ answered: 0, correct: 0 });
        }}
        options={[
          { value: 'phrases' as const, label: 'Everyday phrases' },
          { value: 'words' as const, label: 'Example sentences' },
        ]}
      />

      <div className="qbar">
        <div className="qbar__progress">
          <div
            className="progress__fill"
            style={{ width: `${(index / items.length) * 100}%`, height: '100%' }}
          />
        </div>
        <span className="qbar__count">
          {index + 1} / {items.length}
        </span>
      </div>

      <div className="panel center" style={{ padding: '28px 18px' }}>
        <button
          className="icon-btn"
          style={{
            width: 76,
            height: 76,
            margin: '0 auto',
            background: 'rgba(139,92,246,0.18)',
            color: 'var(--c-listening)',
          }}
          onClick={() => speak(item.fi)}
          aria-label="Play the Finnish audio"
        >
          <Icon name="speaker" size={32} />
        </button>
        <p className="small muted" style={{ marginTop: 14 }}>
          Tap to listen. You can replay as many times as you like.
        </p>
      </div>

      <div className="field" style={{ marginTop: 14 }}>
        <label className="field__label" htmlFor="heard">
          Write what you heard
        </label>
        <input
          id="heard"
          className="input"
          value={typed}
          disabled={checked}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Type the Finnish sentence..."
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && typed.trim() && !checked) void check();
          }}
        />
      </div>

      {checked && (
        <div className="stack fade-in" style={{ gap: 10, marginTop: 12 }}>
          <Callout kind={correct ? 'ok' : 'bad'} icon={correct ? 'check' : 'x'}>
            <b>{correct ? 'Exactly right.' : 'Here is what was said:'}</b>{' '}
            {!correct && <b>{item.fi}</b>}
          </Callout>
          <div className="wcard">
            <p className="wcard__fi">{item.fi}</p>
            {showEn && (
              <p className="wcard__gloss" style={{ marginTop: 4 }}>
                {item.en}
              </p>
            )}
            {showTl && (
              <p className="wcard__gloss">
                <b>{item.tl}</b>
              </p>
            )}
          </div>
        </div>
      )}

      <button
        className="btn btn--primary btn--block"
        style={{ marginTop: 14 }}
        disabled={!checked && !typed.trim()}
        onClick={() => (checked ? next() : void check())}
      >
        {checked ? (index + 1 >= items.length ? 'See results' : 'Next') : 'Check'}
      </button>
    </div>
  );
}
