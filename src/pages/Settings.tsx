import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { Callout, Toggle, TopBar } from '@/components/ui';
import { useApp } from '@/hooks/useApp';
import { clearAll, exportAll, isStorageAvailable } from '@/services/storage/db';
import { WORDS } from '@/data/words';
import { BRAND, COPYRIGHT } from '@/data/brand';
import { GRAMMAR_LESSONS, ALL_EXERCISES } from '@/data/grammar';
import { PHRASES } from '@/data/phrases';

export function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings, speechReady, cards, mistakes, personalWords, streak } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    const data = await exportAll();
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), ...data }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oma-suomi-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
  };

  return (
    <div className="page fade-in">
      <TopBar title="Settings" />

      <section className="panel">
        <p className="eyebrow" style={{ marginBottom: 6 }}>
          Daily goal
        </p>
        <div className="field">
          <label className="field__label" htmlFor="goal">
            Words per day: <b style={{ color: 'var(--gold)' }}>{settings.dailyGoal}</b>
          </label>
          <input
            id="goal"
            type="range"
            min={5}
            max={50}
            step={5}
            value={settings.dailyGoal}
            onChange={(e) => updateSettings({ dailyGoal: Number(e.target.value) })}
            style={{ accentColor: 'var(--gold)' }}
          />
        </div>
        <div className="field" style={{ marginTop: 10 }}>
          <label className="field__label" htmlFor="newper">
            New cards introduced per day: <b style={{ color: 'var(--gold)' }}>{settings.newPerDay}</b>
          </label>
          <input
            id="newper"
            type="range"
            min={1}
            max={20}
            value={settings.newPerDay}
            onChange={(e) => updateSettings({ newPerDay: Number(e.target.value) })}
            style={{ accentColor: 'var(--gold)' }}
          />
          <p className="tiny dim">
            Reviews always come first. This only limits how many brand-new words join the queue.
          </p>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 14 }}>
        <p className="eyebrow" style={{ marginBottom: 4 }}>
          Display
        </p>
        <Toggle
          label="Show Tagalog"
          hint="Tagalog meanings and explanations throughout the app"
          checked={settings.showTagalog}
          onChange={(v) => updateSettings({ showTagalog: v })}
        />
        <Toggle
          label="Show English"
          hint="English glosses next to Finnish"
          checked={settings.showEnglish}
          onChange={(v) => updateSettings({ showEnglish: v })}
        />
        <Toggle
          label="Finnish speech"
          hint={
            speechReady
              ? 'Uses the Finnish voice installed on this device'
              : 'No Finnish (fi-FI) voice found on this device'
          }
          checked={settings.speechEnabled}
          onChange={(v) => updateSettings({ speechEnabled: v })}
        />
      </section>

      <section className="panel" style={{ marginTop: 14 }}>
        <p className="eyebrow" style={{ marginBottom: 10 }}>
          Your data
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Stat label="Cards in review" value={cards.length} />
          <Stat label="Mistakes saved" value={mistakes.length} />
          <Stat label="Personal words" value={personalWords.length} />
          <Stat label="Best streak" value={`${streak.best} d`} />
        </div>

        <button className="btn btn--sm btn--block" style={{ marginTop: 12 }} onClick={handleExport}>
          <Icon name="download" size={15} />
          {exported ? 'Backup downloaded' : 'Download a backup (JSON)'}
        </button>

        {!isStorageAvailable() && (
          <div style={{ marginTop: 12 }}>
            <Callout kind="warn">
              Local storage is blocked in this browser, so nothing is being saved between sessions.
            </Callout>
          </div>
        )}

        {confirmReset ? (
          <div className="stack" style={{ gap: 8, marginTop: 12 }}>
            <Callout kind="bad" icon="alert">
              This deletes every review card, mistake, saved word and streak on this device. It
              cannot be undone, and no copy exists anywhere else. Download a backup first if you
              want one.
            </Callout>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button className="btn btn--sm" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
              <button
                className="btn btn--sm btn--danger"
                onClick={async () => {
                  await clearAll();
                  localStorage.removeItem('oma-suomi:favourites');
                  localStorage.removeItem('oma-suomi:resume');
                  localStorage.removeItem('oma-suomi:streak');
                  window.location.href = import.meta.env.BASE_URL;
                }}
              >
                Delete everything
              </button>
            </div>
          </div>
        ) : (
          <button
            className="btn btn--sm btn--danger btn--block"
            style={{ marginTop: 8 }}
            onClick={() => setConfirmReset(true)}
          >
            <Icon name="trash" size={15} />
            Reset all my progress
          </button>
        )}
      </section>

      <section className="panel" style={{ marginTop: 14 }}>
        <p className="eyebrow" style={{ marginBottom: 10 }}>
          Content in this app
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Stat label="Words" value={WORDS.length} />
          <Stat label="Grammar lessons" value={GRAMMAR_LESSONS.length} />
          <Stat label="Phrases" value={PHRASES.length} />
          <Stat label="Exercises" value={ALL_EXERCISES.length} />
        </div>
        <button
          className="btn btn--sm btn--block"
          style={{ marginTop: 12 }}
          onClick={() => navigate('/data-audit')}
        >
          <Icon name="shield" size={15} />
          Data audit & sources
        </button>
      </section>

      <p className="tiny dim center" style={{ marginTop: 22, lineHeight: 1.7 }}>
        Oma Suomi runs entirely on this device. There is no account, no server and no tracking. Your
        progress lives in this browser's storage only - clearing site data erases it.
      </p>

      <p className="tiny dim center" style={{ marginTop: 14, lineHeight: 1.7 }}>
        <b style={{ color: 'var(--gold)' }}>{BRAND}</b>
        <span style={{ display: 'block' }}>{COPYRIGHT}</span>
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="panel panel--flat" style={{ padding: '10px 12px' }}>
      <p style={{ fontSize: '1.35rem', fontWeight: 800 }}>{value}</p>
      <p className="tiny dim">{label}</p>
    </div>
  );
}
