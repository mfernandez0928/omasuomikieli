import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon, type IconName } from '@/components/Icon';
import { EmptyState, LevelBadge, RevealTranslation, SpeakButton, TopBar } from '@/components/ui';
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
