import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { EmptyState, TopBar } from '@/components/ui';
import { searchEverything } from '@/services/search/search';

const KIND_META = {
  word: { label: 'Word', colour: 'var(--c-vocab)', path: '/vocabulary/' },
  phrase: { label: 'Phrase', colour: 'var(--c-phrases)', path: '/phrases' },
  reply: { label: 'Reply', colour: 'var(--c-phrases)', path: '/replies/' },
  grammar: { label: 'Grammar', colour: 'var(--c-grammar)', path: '/grammar/' },
} as const;

const SUGGESTIONS = ['kauppa', 'tarvita', 'pidän', 'kaupassa', 'tulong', 'partitive', 'doctor'];

export function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchEverything(query), [query]);

  return (
    <div className="page fade-in">
      <TopBar title="Search" subtitle="Words, phrases, replies and grammar" />

      <div className="search">
        <span className="search__icon">
          <Icon name="search" size={18} />
        </span>
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Finnish, English, Tagalog or a form..."
          aria-label="Search everything"
          autoFocus
          autoComplete="off"
        />
      </div>

      {!query ? (
        <div style={{ marginTop: 20 }}>
          <p className="eyebrow" style={{ marginBottom: 10 }}>
            Try searching for
          </p>
          <div className="chips">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chip" onClick={() => setQuery(s)}>
                {s}
              </button>
            ))}
          </div>
          <p className="small dim" style={{ marginTop: 18, lineHeight: 1.6 }}>
            Search works across Finnish, English and Tagalog. Inflected forms are indexed too, so
            typing <b>kaupassa</b> finds <b>kauppa</b>, and <b>pidän</b> finds <b>pitää</b>.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div style={{ marginTop: 16 }}>
          <EmptyState
            icon="search"
            title="Nothing found"
            text={`No word, phrase or lesson matches "${query}". Try a shorter search - partial words work.`}
          />
        </div>
      ) : (
        <>
          <p className="small dim" style={{ margin: '14px 0 10px' }}>
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </p>
          <div className="rows">
            {results.map((hit) => {
              const meta = KIND_META[hit.kind];
              return (
                <button
                  key={`${hit.kind}-${hit.id}`}
                  className="rowcard"
                  onClick={() =>
                    navigate(hit.kind === 'phrase' ? '/phrases' : `${meta.path}${hit.id}`)
                  }
                >
                  <span
                    className="rowcard__num"
                    style={{ background: meta.colour, fontSize: '0.6rem', width: 44, borderRadius: 8 }}
                  >
                    {meta.label}
                  </span>
                  <span className="rowcard__body">
                    <span className="rowcard__title">{hit.title}</span>
                    <span className="rowcard__sub">{hit.subtitle}</span>
                  </span>
                  {hit.badge && <span className="badge badge--level">{hit.badge}</span>}
                  <Icon name="chevron-right" size={17} className="rowcard__chev" />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
