import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { Callout, EmptyState, FilterPills, TopBar } from '@/components/ui';
import { GRAMMAR_BY_ID } from '@/data/grammar';
import { getWord } from '@/data/words';
import { useApp } from '@/hooks/useApp';

type Tab = 'mistakes' | 'words';

export function Mistakes() {
  const navigate = useNavigate();
  const { mistakes, personalWords, updateMistake, deleteMistake, deletePersonalWord } = useApp();
  const [tab, setTab] = useState<Tab>('mistakes');
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'open' | 'all'>('open');

  const visible = useMemo(() => {
    const list = filter === 'open' ? mistakes.filter((m) => !m.resolved) : mistakes;
    return [...list].sort((a, b) => b.createdAt - a.createdAt);
  }, [mistakes, filter]);

  const openCount = mistakes.filter((m) => !m.resolved).length;

  return (
    <div className="page fade-in">
      <TopBar
        title="My Mistakes"
        subtitle="Save what you forget, then fix it"
        back={false}
        right={
          <button
            className="icon-btn icon-btn--plain"
            onClick={() => setShowForm((s) => !s)}
            aria-label="Add an entry"
            aria-expanded={showForm}
          >
            <Icon name={showForm ? 'x' : 'plus'} size={20} />
          </button>
        }
      />

      <div className="pills" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'mistakes'}
          className={`pill ${tab === 'mistakes' ? 'pill--active' : ''}`}
          onClick={() => setTab('mistakes')}
        >
          Mistakes ({openCount})
        </button>
        <button
          role="tab"
          aria-selected={tab === 'words'}
          className={`pill ${tab === 'words' ? 'pill--active' : ''}`}
          onClick={() => setTab('words')}
        >
          My Words ({personalWords.length})
        </button>
      </div>

      {showForm && (
        <div style={{ marginTop: 14 }}>
          {tab === 'mistakes' ? <MistakeForm onDone={() => setShowForm(false)} /> : <WordForm onDone={() => setShowForm(false)} />}
        </div>
      )}

      {tab === 'mistakes' ? (
        <>
          <div style={{ marginTop: 14 }}>
            <FilterPills
              label="Filter"
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'open' as const, label: 'Still learning' },
                { value: 'all' as const, label: 'All' },
              ]}
            />
          </div>

          {openCount > 2 && filter === 'open' && (
            <div style={{ marginTop: 14 }}>
              <Callout kind="info" icon="target">
                You have {openCount} open mistakes.{' '}
                <button
                  style={{ color: 'var(--gold-bright)', fontWeight: 700, textDecoration: 'underline' }}
                  onClick={() => navigate('/practice/weak')}
                >
                  Drill the weak grammar
                </button>
                .
              </Callout>
            </div>
          )}

          <div className="stack" style={{ gap: 8, marginTop: 14 }}>
            {visible.length === 0 ? (
              <EmptyState
                icon="check"
                title={filter === 'open' ? 'Nothing to review' : 'No mistakes saved yet'}
                text="Wrong answers in Practice are saved here automatically, with the correct form and an explanation. You can also add your own with the + button."
                action={
                  <button className="btn btn--primary" onClick={() => navigate('/practice/mixed')}>
                    Start practising
                  </button>
                }
              />
            ) : (
              visible.map((m) => {
                const grammar = m.grammarId ? GRAMMAR_BY_ID.get(m.grammarId) : undefined;
                const word = m.wordId ? getWord(m.wordId) : undefined;
                return (
                  <div className="panel" key={m.id} style={{ opacity: m.resolved ? 0.6 : 1 }}>
                    <div className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="row" style={{ gap: 7, marginBottom: 3 }}>
                          <span style={{ color: 'var(--bad)' }}>
                            <Icon name="x" size={14} />
                          </span>
                          <s style={{ color: '#fca5a5', wordBreak: 'break-word' }}>{m.wrong}</s>
                        </p>
                        <p className="row" style={{ gap: 7 }}>
                          <span style={{ color: 'var(--ok)' }}>
                            <Icon name="check" size={14} />
                          </span>
                          <b style={{ wordBreak: 'break-word' }}>{m.right}</b>
                        </p>
                        {m.note && (
                          <p className="small dim" style={{ marginTop: 7, lineHeight: 1.5 }}>
                            {m.note}
                          </p>
                        )}
                      </div>
                      <button
                        className="icon-btn icon-btn--plain"
                        style={{ width: 32, height: 32, flex: 'none' }}
                        onClick={() => void deleteMistake(m.id)}
                        aria-label="Delete this entry"
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    </div>

                    <div className="row" style={{ gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                      {grammar && (
                        <button className="chip" onClick={() => navigate(`/grammar/${grammar.id}`)}>
                          {grammar.title}
                        </button>
                      )}
                      {word && (
                        <button className="chip" onClick={() => navigate(`/vocabulary/${word.id}`)}>
                          {word.fi}
                        </button>
                      )}
                      <span className="spacer" />
                      <button
                        className="btn btn--sm btn--ghost"
                        onClick={() => void updateMistake({ ...m, resolved: !m.resolved })}
                      >
                        {m.resolved ? 'Mark unlearned' : 'I know this now'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        <div className="stack" style={{ gap: 8, marginTop: 14 }}>
          {personalWords.length === 0 ? (
            <EmptyState
              icon="bookmark"
              title="No personal words yet"
              text="Save words you keep forgetting, with your own note about what confuses you. Use the + button, or Add to My Words on any dictionary entry."
            />
          ) : (
            personalWords.map((w) => (
              <div className="wcard" key={w.id}>
                <div className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="wcard__fi">{w.fi}</p>
                    <p className="wcard__gloss">
                      {w.en}
                      {w.tl && (
                        <>
                          {'  ·  '}
                          <b>{w.tl}</b>
                        </>
                      )}
                    </p>
                    {w.note && (
                      <p className="small" style={{ color: 'var(--card-ink-soft)', marginTop: 6 }}>
                        {w.note}
                      </p>
                    )}
                  </div>
                  <button
                    className="icon-btn icon-btn--plain"
                    style={{ width: 32, height: 32, flex: 'none', color: 'var(--card-ink-soft)' }}
                    onClick={() => void deletePersonalWord(w.id)}
                    aria-label="Delete this word"
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function MistakeForm({ onDone }: { onDone: () => void }) {
  const { addMistake } = useApp();
  const [wrong, setWrong] = useState('');
  const [right, setRight] = useState('');
  const [note, setNote] = useState('');

  const canSave = wrong.trim() && right.trim();

  return (
    <form
      className="panel stack"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!canSave) return;
        await addMistake({
          wrong: wrong.trim(),
          right: right.trim(),
          note: note.trim() || undefined,
          origin: 'manual',
        });
        setWrong('');
        setRight('');
        setNote('');
        onDone();
      }}
    >
      <p className="eyebrow">Record a correction</p>
      <div className="field">
        <label className="field__label" htmlFor="wrong">
          What you wrote or said
        </label>
        <input
          id="wrong"
          className="input"
          value={wrong}
          onChange={(e) => setWrong(e.target.value)}
          placeholder="e.g. Minä tarvitin apua"
        />
      </div>
      <div className="field">
        <label className="field__label" htmlFor="right">
          The correct form
        </label>
        <input
          id="right"
          className="input"
          value={right}
          onChange={(e) => setRight(e.target.value)}
          placeholder="e.g. Minä tarvitsen apua"
        />
      </div>
      <div className="field">
        <label className="field__label" htmlFor="note">
          Why it was wrong (optional)
        </label>
        <textarea
          id="note"
          className="textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. tarvita is verb type 5, so the stem is tarvitse-"
        />
      </div>
      <button className="btn btn--primary" type="submit" disabled={!canSave}>
        Save correction
      </button>
    </form>
  );
}

function WordForm({ onDone }: { onDone: () => void }) {
  const { addPersonalWord } = useApp();
  const [fi, setFi] = useState('');
  const [en, setEn] = useState('');
  const [tl, setTl] = useState('');
  const [note, setNote] = useState('');

  const canSave = fi.trim() && (en.trim() || tl.trim());

  return (
    <form
      className="panel stack"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!canSave) return;
        await addPersonalWord({
          fi: fi.trim(),
          en: en.trim(),
          tl: tl.trim(),
          note: note.trim() || undefined,
        });
        setFi('');
        setEn('');
        setTl('');
        setNote('');
        onDone();
      }}
    >
      <p className="eyebrow">Add your own word</p>
      <div className="field">
        <label className="field__label" htmlFor="pwfi">
          Finnish
        </label>
        <input id="pwfi" className="input" value={fi} onChange={(e) => setFi(e.target.value)} />
      </div>
      <div className="field">
        <label className="field__label" htmlFor="pwen">
          English
        </label>
        <input id="pwen" className="input" value={en} onChange={(e) => setEn(e.target.value)} />
      </div>
      <div className="field">
        <label className="field__label" htmlFor="pwtl">
          Tagalog
        </label>
        <input id="pwtl" className="input" value={tl} onChange={(e) => setTl(e.target.value)} />
      </div>
      <div className="field">
        <label className="field__label" htmlFor="pwnote">
          Your note (optional)
        </label>
        <textarea
          id="pwnote"
          className="textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. I always mix this up with ajatus"
        />
      </div>
      <button className="btn btn--primary" type="submit" disabled={!canSave}>
        Save word
      </button>
    </form>
  );
}
