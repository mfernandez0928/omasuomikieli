import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon, type IconName } from '@/components/Icon';
import { EmptyState, LevelBadge, SpeakButton, TopBar, useGlossVisibility } from '@/components/ui';
import { SITUATIONS, SITUATION_BY_ID } from '@/data/topics';
import { PHRASES, phraseCount, phrasesInSituation } from '@/data/phrases';
import { GRAMMAR_BY_ID } from '@/data/grammar';
import { useApp } from '@/hooks/useApp';
import { searchPhrases } from '@/services/search/search';
import type { SituationId } from '@/types';

export function PhrasesList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const matches = useMemo(() => (query ? searchPhrases(query) : []), [query]);

  return (
    <div className="page fade-in">
      <TopBar
        title="Useful Phrases"
        subtitle={`${PHRASES.length} phrases · everyday situations`}
        back={false}
      />

      <div className="search">
        <span className="search__icon">
          <Icon name="search" size={18} />
        </span>
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search phrases in any language..."
          aria-label="Search phrases"
          autoComplete="off"
        />
      </div>

      {query ? (
        <div style={{ marginTop: 14 }}>
          <p className="small dim" style={{ marginBottom: 10 }}>
            {matches.length} {matches.length === 1 ? 'phrase' : 'phrases'}
          </p>
          {matches.length === 0 ? (
            <EmptyState
              icon="search"
              title="Nothing matched"
              text="Try a different word, or browse by situation below."
            />
          ) : (
            <div className="stack" style={{ gap: 8 }}>
              {matches.map((p) => (
                <PhraseCard key={p.id} id={p.id} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rows" style={{ marginTop: 16 }}>
          {SITUATIONS.map((s) => (
            <button
              key={s.id}
              className="rowcard"
              onClick={() => navigate(`/phrases/${s.id}`)}
            >
              <span className="rowcard__num" style={{ background: 'var(--c-phrases)' }}>
                <Icon name={s.icon as IconName} size={15} />
              </span>
              <span className="rowcard__body">
                <span className="rowcard__title">{s.title}</span>
                <span className="rowcard__sub">{s.titleFi}</span>
              </span>
              <span className="badge">{phraseCount(s.id)}</span>
              <Icon name="chevron-right" size={17} className="rowcard__chev" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function PhraseSituation() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const situation = SITUATION_BY_ID.get(id as SituationId);
  const phrases = situation ? phrasesInSituation(situation.id) : [];

  if (!situation) {
    return (
      <div className="page">
        <TopBar title="Not found" />
        <EmptyState
          icon="alert"
          title="That situation does not exist"
          text="Pick one from the phrase list."
          action={
            <button className="btn btn--primary" onClick={() => navigate('/phrases')}>
              All situations
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <TopBar title={situation.title} subtitle={situation.titleFi} />
      <p className="small muted" style={{ marginBottom: 14 }}>
        {situation.description}
      </p>
      <div className="stack" style={{ gap: 8 }}>
        {phrases.map((p) => (
          <PhraseCard key={p.id} id={p.id} />
        ))}
      </div>
    </div>
  );
}

export function PhraseCard({ id }: { id: string }) {
  const navigate = useNavigate();
  const { settings } = useApp();
  const { showEn, showTl } = useGlossVisibility();
  const phrase = PHRASES.find((p) => p.id === id);
  const [open, setOpen] = useState(false);

  if (!phrase) return null;

  const grammar = (phrase.grammarRefs ?? [])
    .map((g) => GRAMMAR_BY_ID.get(g))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  const expandable = Boolean(phrase.puhekieli || phrase.note || grammar.length);

  return (
    <div className="wcard">
      <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="wcard__fi" style={{ fontSize: '1rem', lineHeight: 1.4 }}>
            {phrase.fi}
          </p>
          {showEn && (
            <p className="wcard__gloss" style={{ marginTop: 4 }}>
              {phrase.en}
            </p>
          )}
          {showTl && (
            <p className="wcard__gloss">
              <b>{phrase.tl}</b>
            </p>
          )}
        </div>
        <div className="row" style={{ gap: 4, flex: 'none' }}>
          <LevelBadge level={phrase.level} />
          <SpeakButton text={phrase.fi} />
        </div>
      </div>

      {expandable && (
        <>
          <button
            className="row small"
            style={{ marginTop: 8, color: '#2563eb', fontWeight: 600, gap: 4 }}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            {open ? 'Hide details' : 'Show details'}
            <Icon name={open ? 'chevron-down' : 'chevron-right'} size={14} />
          </button>

          {open && (
            <div className="fade-in" style={{ marginTop: 10, borderTop: '1px solid var(--card-border)', paddingTop: 10 }}>
              {phrase.puhekieli && (
                <div style={{ marginBottom: 10 }}>
                  <span className="badge badge--light">puhekieli</span>
                  <p style={{ fontWeight: 650, marginTop: 5 }}>{phrase.puhekieli}</p>
                  <p className="small" style={{ color: 'var(--card-ink-soft)' }}>
                    How people actually say it. Keep the form above for writing and officials.
                  </p>
                </div>
              )}
              {phrase.note && (
                <p className="small" style={{ color: 'var(--card-ink-soft)', lineHeight: 1.55 }}>
                  {phrase.note}
                </p>
              )}
              {settings.showTagalog && phrase.noteTl && (
                <p className="small" style={{ color: 'var(--card-ink-soft)', lineHeight: 1.55, marginTop: 4 }}>
                  {phrase.noteTl}
                </p>
              )}
              {grammar.length > 0 && (
                <div className="chips" style={{ marginTop: 10 }}>
                  {grammar.map((g) => (
                    <button
                      key={g.id}
                      className="chip chip--light"
                      onClick={() => navigate(`/grammar/${g.id}`)}
                    >
                      {g.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
