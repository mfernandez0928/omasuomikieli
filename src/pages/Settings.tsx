import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { Callout, Toggle, TopBar } from '@/components/ui';
import { useApp } from '@/hooks/useApp';
import { clearAll, isStorageAvailable } from '@/services/storage/db';
import { countRecords, createBackup, restoreBackup, type RestoreReport } from '@/services/storage/backup';
import { cleanName, isName } from '@/services/storage/prefs';
import { rosterEnabled } from '@/services/sync/roster';
import type { UserProfile } from '@/types';
import { WORDS } from '@/data/words';
import { BRAND, COPYRIGHT, INDEPENDENCE_NOTICE } from '@/data/brand';
import { GRAMMAR_LESSONS, ALL_EXERCISES } from '@/data/grammar';
import { PHRASES } from '@/data/phrases';

export function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings, speechReady, cards, mistakes, personalWords, streak, profile, setProfileName } =
    useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  const [exported, setExported] = useState(0);
  const [restoring, setRestoring] = useState(false);
  const [report, setReport] = useState<RestoreReport | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    const backup = await createBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oma-suomi-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    // Revoked on a later tick: Safari has not finished reading the blob yet
    // when the click returns, and revoking at once gives an empty file.
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    setExported(countRecords(backup));
  };

  const handleImport = async (file: File) => {
    setRestoring(true);
    setReport(null);
    try {
      const text = await file.text();
      let parsed: unknown;
      try {
        parsed = JSON.parse(text) as unknown;
      } catch {
        setReport({
          ok: false,
          error: 'That file is not readable JSON.',
          written: {},
          skipped: 0,
          prefsRestored: [],
          prefsRejected: [],
          name: null,
        });
        return;
      }
      setReport(await restoreBackup(parsed));
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="page fade-in">
      <TopBar title="Settings" />

      <section className="panel">
        <p className="eyebrow" style={{ marginBottom: 10 }}>
          Sino ka
        </p>
        <NameEditor profile={profile} onSave={setProfileName} />
      </section>

      <section className="panel" style={{ marginTop: 14 }}>
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

        <p className="muted" style={{ marginTop: 12, fontSize: 13, lineHeight: 1.5 }}>
          Your progress is saved on this device only. Nothing is sent anywhere, so a name on its
          own cannot bring it back - a backup file is the only way to move it.
        </p>
        <p className="muted" style={{ marginTop: 6, fontSize: 13, lineHeight: 1.5 }}>
          On iPhone and iPad this matters: an app added to the home screen gets its own separate
          storage, so it starts empty even though your work is still there in Safari. Export in
          Safari, then import here.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          <button className="btn btn--sm" onClick={handleExport}>
            <Icon name="download" size={15} />
            {exported > 0 ? `Saved ${exported} records` : 'Export a backup'}
          </button>
          <button
            className="btn btn--sm"
            disabled={restoring}
            onClick={() => fileInput.current?.click()}
          >
            <Icon name="file" size={15} />
            {restoring ? 'Restoring...' : 'Import a backup'}
          </button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            // Cleared so picking the same file twice still fires a change.
            e.target.value = '';
            if (file) void handleImport(file);
          }}
        />

        {report && (
          <div style={{ marginTop: 12 }}>
            {report.ok ? (
              <Callout kind="ok" icon="check">
                {report.name ? `Welcome back, ${report.name}. ` : ''}
                Restored{' '}
                {Object.values(report.written).reduce((a, b) => a + b, 0)} records
                {report.skipped > 0 ? `, skipped ${report.skipped} the app could not read` : ''}.
                Reload the app to see them.
                {report.formatWarning ? ` ${report.formatWarning}` : ''}
              </Callout>
            ) : (
              <Callout kind="bad" icon="alert">
                {report.error ?? 'Nothing could be restored from that file.'}
              </Callout>
            )}
          </div>
        )}

        {report?.ok && (
          <button
            className="btn btn--sm btn--block btn--primary"
            style={{ marginTop: 8 }}
            onClick={() => window.location.reload()}
          >
            Reload now
          </button>
        )}

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
              cannot be undone, and no copy exists anywhere else. Export a backup first if you
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

      {/*
        Two versions, chosen the same way as on the first-run screen. With a
        roster configured the name does leave the device, so the stronger
        wording would be untrue - and this is the screen where a learner comes
        looking for exactly that answer.
      */}
      <p className="tiny dim center" style={{ marginTop: 22, lineHeight: 1.7 }}>
        {rosterEnabled ? (
          <>
            Your progress runs entirely on this device. There is no password and no tracking, and
            your answers, review cards and saved words live in this browser's storage only -
            clearing site data erases them. Only your name is sent, once, so the person who made
            the app knows who is using it.
          </>
        ) : (
          <>
            Oma Suomi runs entirely on this device. There is no password, no server and no
            tracking. Your name and your progress live in this browser's storage only - clearing
            site data erases them.
          </>
        )}
      </p>

      <p className="tiny dim center" style={{ marginTop: 14, lineHeight: 1.7 }}>
        <b style={{ color: 'var(--gold)' }}>{BRAND}</b>
        <span style={{ display: 'block' }}>{COPYRIGHT}</span>
      </p>

      <p className="tiny dim center" style={{ marginTop: 14, lineHeight: 1.7 }}>
        {INDEPENDENCE_NOTICE}
      </p>
    </div>
  );
}

/** Lets the learner correct the name they gave on the first run. */
function NameEditor({
  profile,
  onSave,
}: {
  profile: UserProfile | null;
  onSave: (first: string, last: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [first, setFirst] = useState(profile?.firstName ?? '');
  const [last, setLast] = useState(profile?.lastName ?? '');

  if (!profile) return null;

  if (!editing) {
    return (
      <div className="row row--between" style={{ gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>
            {profile.firstName} {profile.lastName}
          </p>
          {rosterEnabled && (
            <p className="tiny dim" style={{ marginTop: 2 }}>
              Only your name is recorded. Your progress stays on this device.
            </p>
          )}
        </div>
        <button
          className="btn btn--sm"
          onClick={() => {
            setFirst(profile.firstName);
            setLast(profile.lastName);
            setEditing(true);
          }}
        >
          <Icon name="pencil" size={14} />
          Change
        </button>
      </div>
    );
  }

  const ready = isName(first) && isName(last);

  return (
    <div className="stack" style={{ gap: 10 }}>
      <div className="field">
        <label className="field__label" htmlFor="setFirst">
          Etunimi · First name
        </label>
        <input
          id="setFirst"
          className="input"
          value={first}
          onChange={(e) => setFirst(e.target.value)}
          maxLength={40}
          autoComplete="given-name"
        />
      </div>
      <div className="field">
        <label className="field__label" htmlFor="setLast">
          Sukunimi · Last name
        </label>
        <input
          id="setLast"
          className="input"
          value={last}
          onChange={(e) => setLast(e.target.value)}
          maxLength={40}
          autoComplete="family-name"
        />
      </div>
      <div className="row" style={{ gap: 8 }}>
        <button
          className="btn btn--primary btn--sm"
          disabled={!ready}
          onClick={() => {
            onSave(cleanName(first), cleanName(last));
            setEditing(false);
          }}
        >
          Save
        </button>
        <button className="btn btn--sm" onClick={() => setEditing(false)}>
          Cancel
        </button>
      </div>
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
