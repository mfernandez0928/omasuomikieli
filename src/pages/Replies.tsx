import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon, type IconName } from '@/components/Icon';
import { ExerciseRunner } from '@/components/ExerciseRunner';
import { ReplyFlashcards } from '@/components/ReplyFlashcards';
import {
  EmptyState,
  FilterPills,
  LevelBadge,
  RevealTranslation,
  SpeakButton,
  TopBar,
} from '@/components/ui';
import { buildChooseReply, buildListenMeaning } from '@/services/replies/exercises';
import { searchReplies } from '@/services/search/search';
import {
  REPLY_CATEGORIES,
  REPLY_CATEGORY_BY_ID,
  REPLY_PAIRS,
  REPLY_USAGE_NOTES,
  repliesInCategory,
} from '@/data/replies';
import { useApp } from '@/hooks/useApp';
import type { ReplyCategoryId, ReplyPair } from '@/types';

/* ---------------------------------- list ---------------------------------- */

export function RepliesList() {
  const navigate = useNavigate();
  const [notesOpen, setNotesOpen] = useState(false);
  const [query, setQuery] = useState('');
  const matches = useMemo(() => searchReplies(query), [query]);

  return (
    <div className="page fade-in">
      <TopBar title="Luontevia vastauksia" subtitle={`Natural Finnish Replies · ${REPLY_PAIRS.length} pairs`} />

      <p className="small muted" style={{ marginBottom: 12, lineHeight: 1.55 }}>
        A question and the natural way to answer it, learned together. Read the Finnish first; the
        meaning waits behind Show translation.
      </p>

      <button className="btn btn--primary btn--block" onClick={() => navigate('/replies/practice')}>
        <Icon name="target" size={18} />
        Practise
      </button>

      <div className="panel panel--tight" style={{ marginTop: 14 }}>
        <button
          className="row row--between"
          style={{ width: '100%', fontWeight: 650 }}
          onClick={() => setNotesOpen((o) => !o)}
          aria-expanded={notesOpen}
        >
          <span>Thank you, sorry, of course - which reply?</span>
          <Icon name={notesOpen ? 'chevron-down' : 'chevron-right'} size={16} />
        </button>
        {notesOpen && <UsageNotes />}
      </div>

      <div className="search" style={{ marginTop: 14 }}>
        <span className="search__icon">
          <Icon name="search" size={18} />
        </span>
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search replies in any language..."
          aria-label="Search replies"
          autoComplete="off"
        />
      </div>

      {query ? (
        <div style={{ marginTop: 14 }}>
          <p className="small dim" style={{ marginBottom: 10 }}>
            {matches.length} {matches.length === 1 ? 'pair' : 'pairs'}
          </p>
          {matches.length === 0 ? (
            <EmptyState icon="search" title="Nothing matched" text="Try a different word, or browse by category." />
          ) : (
            <div className="stack" style={{ gap: 8 }}>
              {matches.map((p) => (
                <ReplyCard key={p.id} pair={p} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rows" style={{ marginTop: 16 }}>
          {REPLY_CATEGORIES.map((c) => (
            <button key={c.id} className="rowcard" onClick={() => navigate(`/replies/${c.id}`)}>
              <span className="rowcard__num" style={{ background: 'var(--c-phrases)' }}>
                <Icon name={c.icon as IconName} size={15} />
              </span>
              <span className="rowcard__body">
                <span className="rowcard__title">{c.titleFi}</span>
                <span className="rowcard__sub">{c.title}</span>
              </span>
              <span className="badge">{repliesInCategory(c.id).length}</span>
              <Icon name="chevron-right" size={17} className="rowcard__chev" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UsageNotes() {
  const { settings } = useApp();
  return (
    <div className="stack fade-in" style={{ gap: 10, marginTop: 10 }}>
      {REPLY_USAGE_NOTES.map((n) => (
        <div key={n.fi}>
          <p style={{ fontWeight: 650 }}>{n.fi}</p>
          <p className="small muted" style={{ lineHeight: 1.5 }}>
            {n.en}
          </p>
          {settings.showTagalog && (
            <p className="small muted" style={{ lineHeight: 1.5 }}>
              <b>{n.tl}</b>
            </p>
          )}
        </div>
      ))}
      <p className="tiny dim" style={{ lineHeight: 1.5 }}>
        No reply fits every situation. Tone and who you are talking to matter.
      </p>
    </div>
  );
}

/* -------------------------------- category -------------------------------- */

export function ReplyCategoryPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const category = REPLY_CATEGORY_BY_ID.get(id as ReplyCategoryId);

  if (!category) {
    return (
      <div className="page">
        <TopBar title="Not found" />
        <EmptyState
          icon="alert"
          title="That category does not exist"
          text="Pick one from the list of replies."
          action={
            <button className="btn btn--primary" onClick={() => navigate('/replies')}>
              All categories
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <TopBar title={category.titleFi} subtitle={category.title} />
      <div className="stack" style={{ gap: 8 }}>
        {repliesInCategory(category.id).map((p) => (
          <ReplyCard key={p.id} pair={p} />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- practice -------------------------------- */

type PracticeMode = 'choose' | 'meaning' | 'recall' | 'listen';

const MODES: { id: PracticeMode; title: string; sub: string; icon: IconName }[] = [
  { id: 'choose', title: 'Valitse vastaus', sub: 'Read the question, choose the natural reply', icon: 'chat' },
  { id: 'meaning', title: 'Mitä se tarkoittaa?', sub: 'Read the Finnish pair, then check its meaning', icon: 'cards' },
  { id: 'recall', title: 'Muista vastaus', sub: 'See the meaning, recall the Finnish reply', icon: 'idea' },
  { id: 'listen', title: 'Kuuntele', sub: 'Hear the reply, choose what it means', icon: 'headphones' },
];

const ROUND_SIZE = 10;

function draw(category: ReplyCategoryId | 'all'): ReplyPair[] {
  const pool = category === 'all' ? REPLY_PAIRS : repliesInCategory(category);
  const out = [...pool];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.slice(0, ROUND_SIZE);
}

export function ReplyPractice() {
  const { settings, speechReady } = useApp();
  const [category, setCategory] = useState<ReplyCategoryId | 'all'>('all');
  const [mode, setMode] = useState<PracticeMode | null>(null);
  const [pairs, setPairs] = useState<ReplyPair[]>([]);
  const [run, setRun] = useState(0);
  const [result, setResult] = useState<{ knew: number; total: number } | null>(null);

  // Listening needs a Finnish voice; without one the mode is not offered.
  const canListen = settings.speechEnabled && speechReady;
  const modes = MODES.filter((m) => m.id !== 'listen' || canListen);

  const start = (m: PracticeMode) => {
    setPairs(draw(category));
    setMode(m);
    setResult(null);
    setRun((r) => r + 1);
  };
  const backToModes = () => {
    setMode(null);
    setResult(null);
  };

  const exercises = useMemo(() => {
    if (mode === 'choose') return buildChooseReply(pairs);
    if (mode === 'listen') return buildListenMeaning(pairs);
    return [];
  }, [mode, pairs]);

  if (mode === null) {
    return (
      <div className="page fade-in">
        <TopBar title="Harjoittele vastauksia" subtitle="Practise natural replies" />

        <p className="eyebrow" style={{ marginBottom: 8 }}>
          Category
        </p>
        <FilterPills
          label="Category"
          value={category}
          onChange={setCategory}
          options={[
            { value: 'all' as const, label: 'All' },
            ...REPLY_CATEGORIES.map((c) => ({ value: c.id, label: c.titleFi.split(' ja ')[0] })),
          ]}
        />

        <div className="rows" style={{ marginTop: 16 }}>
          {modes.map((m) => (
            <button key={m.id} className="rowcard" onClick={() => start(m.id)}>
              <span className="rowcard__num" style={{ background: 'var(--c-phrases)' }}>
                <Icon name={m.icon} size={15} />
              </span>
              <span className="rowcard__body">
                <span className="rowcard__title">{m.title}</span>
                <span className="rowcard__sub">{m.sub}</span>
              </span>
              <Icon name="chevron-right" size={17} className="rowcard__chev" />
            </button>
          ))}
        </div>
        {!canListen && (
          <p className="tiny dim" style={{ marginTop: 10, lineHeight: 1.5 }}>
            Listening practice appears when this device has a Finnish voice and speech is on in Settings.
          </p>
        )}
      </div>
    );
  }

  const title = MODES.find((m) => m.id === mode)!.title;

  return (
    <div className="page fade-in">
      <TopBar title={title} subtitle="Natural Finnish Replies" />
      {mode === 'choose' || mode === 'listen' ? (
        <ExerciseRunner
          key={run}
          exercises={exercises}
          title={title}
          nextUp={{ label: 'Choose another practice', onGo: backToModes }}
        />
      ) : result ? (
        <div className="panel center fade-in">
          <p className="eyebrow">Done</p>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, margin: '6px 0' }}>
            {result.knew} / {result.total}
          </p>
          <p className="small muted">knew it on the first try</p>
          <div className="stack" style={{ gap: 8, marginTop: 16 }}>
            <button className="btn btn--primary btn--block" onClick={() => start(mode)}>
              Another {ROUND_SIZE}
            </button>
            <button className="btn btn--ghost btn--block" onClick={backToModes}>
              Choose another practice
            </button>
          </div>
        </div>
      ) : (
        <ReplyFlashcards
          key={run}
          pairs={pairs}
          direction={mode === 'meaning' ? 'fi-first' : 'meaning-first'}
          onDone={setResult}
        />
      )}
    </div>
  );
}

/* ---------------------------------- card ---------------------------------- */

export function ReplyCard({ pair }: { pair: ReplyPair }) {
  const { settings } = useApp();

  return (
    <div className="wcard">
      <div className="row" style={{ gap: 8, alignItems: 'center', marginBottom: 6 }}>
        <span className="badge badge--light">{pair.num}</span>
        <LevelBadge level={pair.level} />
      </div>

      <div className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
        <p className="wcard__fi" style={{ flex: 1, fontSize: '1rem', lineHeight: 1.4 }}>
          {pair.fi.q}
        </p>
        <SpeakButton text={pair.fi.q} />
      </div>
      <div className="row" style={{ gap: 8, alignItems: 'flex-start', marginTop: 6 }}>
        <p style={{ flex: 1, lineHeight: 1.4, color: '#047857', fontWeight: 650 }}>
          <span aria-hidden="true">- </span>
          {pair.fi.a}
        </p>
        <SpeakButton text={pair.fi.a} />
      </div>

      <RevealTranslation>
        <p className="wcard__gloss">
          {pair.en.q} — {pair.en.a}
        </p>
        {settings.showTagalog && (
          <p className="wcard__gloss" style={{ marginTop: 4 }}>
            <b>
              {pair.tl.q} — {pair.tl.a}
            </b>
          </p>
        )}
        {pair.puhekieli && (
          <div style={{ marginTop: 10 }}>
            <span className="badge badge--light">puhekieli</span>
            <p style={{ fontWeight: 650, marginTop: 5 }}>{pair.puhekieli}</p>
            <p className="small" style={{ color: 'var(--card-ink-soft)' }}>
              How it often sounds in speech. The reply above is the standard form.
            </p>
          </div>
        )}
        {pair.note && (
          <p className="small" style={{ color: 'var(--card-ink-soft)', lineHeight: 1.55, marginTop: 8 }}>
            {pair.note}
          </p>
        )}
        {settings.showTagalog && pair.noteTl && (
          <p className="small" style={{ color: 'var(--card-ink-soft)', lineHeight: 1.55, marginTop: 4 }}>
            {pair.noteTl}
          </p>
        )}
      </RevealTranslation>
    </div>
  );
}
