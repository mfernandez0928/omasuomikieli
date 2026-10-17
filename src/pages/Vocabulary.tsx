import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { EmptyState, LevelBadge, SpeakButton, TopBar, VerificationBadge } from '@/components/ui';
import { WORDS } from '@/data/words';
import { TOPICS } from '@/data/topics';
import { searchWords, type SearchFilters } from '@/services/search/search';
import { useApp } from '@/hooks/useApp';
import type { Level, TopicId, VerbType, WordType } from '@/types';
import { LEVELS } from '@/types';

const TYPES: { value: WordType | 'all'; label: string }[] = [
  { value: 'all', label: 'All types' },
  { value: 'verbi', label: 'Verbi' },
  { value: 'substantiivi', label: 'Substantiivi' },
  { value: 'adjektiivi', label: 'Adjektiivi' },
  { value: 'adverbi', label: 'Adverbi' },
  { value: 'pronomini', label: 'Pronomini' },
  { value: 'konjunktio', label: 'Konjunktio' },
  { value: 'postpositio', label: 'Postpositio' },
  { value: 'partikkeli', label: 'Partikkeli' },
];

export function Vocabulary() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { favourites, cards, settings } = useApp();

  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const topic = (params.get('topic') as TopicId | null) ?? 'all';
  const level = (params.get('level') as Level | null) ?? 'all';
  const type = (params.get('type') as WordType | null) ?? 'all';
  const verbType = params.get('verbType') ? (Number(params.get('verbType')) as VerbType) : 'all';
  const origin = (params.get('origin') as 'curated' | 'imported' | null) ?? 'all';

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const filters: SearchFilters = { topic, level, type, verbType, origin };
  const results = useMemo(() => searchWords(query, filters), [query, topic, level, type, verbType, origin]);

  const statusById = useMemo(
    () => new Map(cards.map((c) => [c.refId, c.status])),
    [cards],
  );

  const activeFilters = [topic, level, type, origin].filter((f) => f !== 'all').length +
    (verbType !== 'all' ? 1 : 0);

  return (
    <div className="page fade-in">
      <TopBar
        title="Vocabulary"
        subtitle={`${WORDS.length} words · Finnish / English / Tagalog`}
        back={false}
        right={
          <button
            className="icon-btn icon-btn--plain"
            onClick={() => setShowFilters((s) => !s)}
            aria-label="Filters"
            aria-expanded={showFilters}
          >
            <Icon name="filter" size={19} />
          </button>
        }
      />

      <div className="search">
        <span className="search__icon">
          <Icon name="search" size={18} />
        </span>
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Finnish, English, Tagalog or a form..."
          autoComplete="off"
          aria-label="Search the dictionary"
        />
      </div>

      {showFilters && (
        <div className="panel fade-in" style={{ marginTop: 12 }}>
          <Select
            label="Level"
            value={level}
            onChange={(v) => setParam('level', v)}
            options={[{ value: 'all', label: 'All levels' }, ...LEVELS.map((l) => ({ value: l, label: l }))]}
          />
          <Select
            label="Word type"
            value={type}
            onChange={(v) => setParam('type', v)}
            options={TYPES}
          />
          <Select
            label="Topic"
            value={topic}
            onChange={(v) => setParam('topic', v)}
            options={[
              { value: 'all', label: 'All topics' },
              ...TOPICS.map((t) => ({ value: t.id, label: `${t.titleFi} - ${t.titleEn}` })),
            ]}
          />
          <Select
            label="Verb type"
            value={String(verbType)}
            onChange={(v) => setParam('verbType', v)}
            options={[
              { value: 'all', label: 'Any verb type' },
              ...[1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `Verbityyppi ${n}` })),
            ]}
          />
          <Select
            label="Source"
            value={origin}
            onChange={(v) => setParam('origin', v)}
            options={[
              { value: 'all', label: 'All entries' },
              { value: 'curated', label: 'Written for this app' },
              { value: 'imported', label: 'From the v0.2.1 database' },
            ]}
          />
          {activeFilters > 0 && (
            <button
              className="btn btn--sm btn--ghost"
              style={{ marginTop: 10 }}
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
            >
              Clear {activeFilters} {activeFilters === 1 ? 'filter' : 'filters'}
            </button>
          )}
        </div>
      )}

      <p className="small dim" style={{ margin: '14px 0 10px' }}>
        {results.length} {results.length === 1 ? 'word' : 'words'}
        {query ? ` matching "${query}"` : ''}
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon="search"
          title="No words found"
          text="Try a shorter search, or clear the filters. You can search by Finnish, English, Tagalog, or an inflected form such as kaupassa."
        />
      ) : (
        <div className="stack" style={{ gap: 8 }}>
          {results.map(({ word, matchedForm }) => {
            const status = statusById.get(word.id);
            return (
              <button
                key={word.id}
                className="wcard row"
                style={{ gap: 10, width: '100%', textAlign: 'left' }}
                onClick={() => navigate(`/vocabulary/${word.id}`)}
              >
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="row" style={{ gap: 7 }}>
                    <span className="wcard__fi">{word.fi}</span>
                    {favourites.has(word.id) && (
                      <span style={{ color: '#ef4756' }}>
                        <Icon name="heart-filled" size={13} />
                      </span>
                    )}
                    {status === 'known' && <span className="badge badge--ok">known</span>}
                    {status === 'difficult' && <span className="badge badge--review">hard</span>}
                  </span>
                  <span className="wcard__gloss" style={{ display: 'block' }}>
                    {word.en}
                    {settings.showTagalog && (
                      <>
                        {'  ·  '}
                        <b>{word.tl}</b>
                      </>
                    )}
                  </span>
                  {matchedForm && (
                    <span className="tiny" style={{ color: '#b45309' }}>
                      matched form: {matchedForm}
                    </span>
                  )}
                </span>
                <span className="row" style={{ gap: 6, flex: 'none' }}>
                  <VerificationBadge verification={word.verification} note={word.correctionNote} />
                  <LevelBadge level={word.level} />
                  <SpeakButton text={word.fi} />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="field" style={{ marginBottom: 10 }}>
      <label className="field__label">{label}</label>
      <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
