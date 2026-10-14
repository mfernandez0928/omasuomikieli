import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { Callout, EmptyState, SpeakButton, TopBar } from '@/components/ui';
import { getWord } from '@/data/words';
import { GRAMMAR_BY_ID } from '@/data/grammar';
import { TOPIC_BY_ID } from '@/data/topics';
import { useApp } from '@/hooks/useApp';
import { saveResume } from '@/services/storage/prefs';
import type { WordStatus } from '@/types';

const STATUS_LABEL: Record<WordStatus, string> = {
  new: 'Not started',
  learning: 'Learning',
  known: 'Known',
  difficult: 'Difficult',
};

export function WordDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { favourites, toggleFavourite, setWordStatus, cards, settings, addPersonalWord } = useApp();
  const [savedToMyWords, setSavedToMyWords] = useState(false);

  const word = getWord(id);
  const card = cards.find((c) => c.id === `word:${id}`);

  /*
    Only words the learner has actually acted on belong in Continue Learning.
    Recording every word that was merely opened filled the home screen with
    whatever had last been browsed, which is noise rather than progress.
  */
  useEffect(() => {
    if (!word || !card || card.reps === 0) return;
    saveResume({
      kind: 'vocabulary',
      refId: word.id,
      title: word.fi,
      subtitle: `${word.en} · ${word.tl}`,
      percent: card.status === 'known' ? 100 : card.status === 'learning' ? 50 : 20,
      updatedAt: Date.now(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word?.id, card?.reps]);

  const related = useMemo(
    () =>
      (word?.related ?? [])
        .map((rid) => getWord(rid))
        .filter((w): w is NonNullable<typeof w> => Boolean(w)),
    [word],
  );

  const grammarLinks = useMemo(
    () =>
      (word?.grammarRefs ?? [])
        .map((gid) => GRAMMAR_BY_ID.get(gid))
        .filter((g): g is NonNullable<typeof g> => Boolean(g)),
    [word],
  );

  if (!word) {
    return (
      <div className="page">
        <TopBar title="Word not found" />
        <EmptyState
          icon="search"
          title="That word is not in the dictionary"
          text="It may have been renamed or removed. Search again from the vocabulary list."
          action={
            <button className="btn btn--primary" onClick={() => navigate('/vocabulary')}>
              Back to vocabulary
            </button>
          }
        />
      </div>
    );
  }

  const isFavourite = favourites.has(word.id);
  const vf = word.verbForms;
  const nf = word.nominalForms;

  return (
    <div className="page fade-in">
      <TopBar
        title="Vocabulary"
        right={
          <button
            className="icon-btn icon-btn--plain"
            onClick={() => toggleFavourite(word.id)}
            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            aria-pressed={isFavourite}
            style={{ color: isFavourite ? '#ef4756' : undefined }}
          >
            <Icon name={isFavourite ? 'heart-filled' : 'heart'} size={20} />
          </button>
        }
      />

      {/* ------------------------------ headword ------------------------------ */}
      <div className="wcard" style={{ padding: 18 }}>
        <div className="row" style={{ gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {word.fi}
            </h1>
            <p style={{ color: 'var(--card-ink-soft)', marginTop: 6, fontSize: '0.98rem' }}>
              {word.en}
              {settings.showTagalog && (
                <>
                  {'  ·  '}
                  <b style={{ color: '#b45309' }}>{word.tl}</b>
                </>
              )}
            </p>
          </div>
          <SpeakButton text={word.fi} />
        </div>

        <div className="chips" style={{ marginTop: 14 }}>
          <span className="chip chip--light">{word.type}</span>
          <span className="chip chip--light">{word.level}</span>
          {word.verbType && <span className="chip chip--light">verbityyppi {word.verbType}</span>}
          {word.topics.map((t) => (
            <button
              key={t}
              className="chip chip--light"
              onClick={() => navigate(`/vocabulary?topic=${t}`)}
            >
              {TOPIC_BY_ID.get(t)?.titleFi ?? t}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------ verification notice ------------------------ */}
      {word.correctionNote && (
        <div style={{ marginTop: 12 }}>
          <Callout kind="info" icon="shield">
            <b>Corrected during the data audit.</b> {word.correctionNote}
          </Callout>
        </div>
      )}
      {word.verification === 'needs-review' && (
        <div style={{ marginTop: 12 }}>
          <Callout kind="warn">
            <b>Not verified.</b>{' '}
            {word.reviewNote ??
              'This entry has not been checked against a textbook. Treat the forms as a starting point, not as confirmed.'}
          </Callout>
        </div>
      )}
      {word.verification === 'supplementary' && (
        <div style={{ marginTop: 12 }}>
          <Callout kind="warn">
            <b>Supplementary entry.</b> Imported from the supplied v0.2.1 database. It was not
            traced to a textbook and its forms were not individually checked in this pass.
          </Callout>
        </div>
      )}

      {/* -------------------------------- stem -------------------------------- */}
      {word.vartalo && (
        <div className="panel" style={{ marginTop: 12 }}>
          <p className="eyebrow" style={{ marginBottom: 6 }}>
            Vartalo (stem)
          </p>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)' }}>{word.vartalo}</p>
          {word.verbType && (
            <p className="small muted" style={{ marginTop: 6 }}>
              This is the strong vowel stem. Personal endings attach here; KPT gradation may change
              it in the minä and sinä forms.
            </p>
          )}
        </div>
      )}

      {/* ------------------------------- forms -------------------------------- */}
      {(vf || nf) && (
        <div className="wcard" style={{ marginTop: 12, padding: '6px 4px' }}>
          <table className="formtable">
            <tbody>
              {vf && (
                <>
                  <Row label="minä (1sg)" value={vf.present1sg} />
                  <Row label="hän (3sg)" value={vf.present3sg} />
                  <Row label="he (3pl)" value={vf.present3pl} />
                  <Row label="negative (en ___)" value={vf.negativePresent} />
                  <Row label="imperfect (minä)" value={vf.imperfect1sg} />
                  <Row label="NUT-partisiippi" value={vf.pastParticiple} />
                  <Row label="conditional (minä)" value={vf.conditional1sg} />
                </>
              )}
              {nf && (
                <>
                  <Row label="genetiivi" value={nf.genitive} />
                  <Row label="partitiivi" value={nf.partitive} />
                  <Row label="illatiivi" value={nf.illative} />
                  <Row label="monikko" value={nf.pluralNominative} />
                  <Row label="monikon partitiivi" value={nf.pluralPartitive} />
                </>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------ rections ------------------------------ */}
      {word.rections?.length ? (
        <section className="section">
          <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
            Rektio - which case this verb wants
          </h2>
          <div className="stack" style={{ gap: 8 }}>
            {word.rections.map((r, i) => (
              <div className="panel panel--flat" key={i}>
                <p className="badge badge--gold" style={{ marginBottom: 8 }}>
                  {r.pattern}
                </p>
                <p className="row" style={{ gap: 8 }}>
                  <span className="fi" style={{ flex: 1 }}>
                    {r.example}
                  </span>
                  <SpeakButton text={r.example} />
                </p>
                <p className="small muted">{r.english}</p>
                {settings.showTagalog && <p className="small dim">{r.tagalog}</p>}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ------------------------------ examples ------------------------------ */}
      {word.examples?.length ? (
        <section className="section">
          <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
            Example sentences
          </h2>
          <div className="stack" style={{ gap: 8 }}>
            {word.examples.map((ex, i) => (
              <div className="wcard" key={i}>
                <div className="row" style={{ gap: 8 }}>
                  <p className="wcard__fi" style={{ flex: 1, fontSize: '0.98rem' }}>
                    {ex.fi}
                  </p>
                  <SpeakButton text={ex.fi} />
                </div>
                <p className="wcard__gloss" style={{ marginTop: 4 }}>
                  {ex.en}
                </p>
                {settings.showTagalog && (
                  <p className="wcard__gloss">
                    <b>{ex.tl}</b>
                  </p>
                )}
                {ex.register === 'puhekieli' && (
                  <span className="badge badge--light" style={{ marginTop: 6 }}>
                    puhekieli
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* -------------------------------- note -------------------------------- */}
      {word.note && (
        <div style={{ marginTop: 14 }}>
          <Callout kind="info" icon="idea">
            {word.note}
            {settings.showTagalog && word.noteTl && (
              <span style={{ display: 'block', marginTop: 6, opacity: 0.85 }}>{word.noteTl}</span>
            )}
          </Callout>
        </div>
      )}

      {/* ------------------------------- links -------------------------------- */}
      {(related.length > 0 || grammarLinks.length > 0) && (
        <section className="panel section">
          {related.length > 0 && (
            <>
              <p className="eyebrow" style={{ marginBottom: 8 }}>
                Related words
              </p>
              <div className="chips" style={{ marginBottom: grammarLinks.length ? 14 : 0 }}>
                {related.map((r) => (
                  <button
                    key={r.id}
                    className="chip"
                    onClick={() => navigate(`/vocabulary/${r.id}`)}
                  >
                    {r.fi}
                  </button>
                ))}
              </div>
            </>
          )}
          {grammarLinks.length > 0 && (
            <>
              <p className="eyebrow" style={{ marginBottom: 8 }}>
                Grammar that explains these forms
              </p>
              <div className="chips">
                {grammarLinks.map((g) => (
                  <button key={g.id} className="chip" onClick={() => navigate(`/grammar/${g.id}`)}>
                    {g.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* ------------------------------ actions ------------------------------- */}
      <section className="section stack" style={{ gap: 8 }}>
        <p className="eyebrow">
          Status: {STATUS_LABEL[card?.status ?? 'new']}
          {card && card.reps > 0 && ` · reviewed ${card.reps}x`}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button className="btn btn--sm" onClick={() => void setWordStatus(word.id, 'known')}>
            <Icon name="check" size={15} />
            Mark as known
          </button>
          <button className="btn btn--sm" onClick={() => void setWordStatus(word.id, 'difficult')}>
            <Icon name="alert" size={15} />
            Mark as difficult
          </button>
        </div>

        <button
          className="btn btn--sm"
          disabled={savedToMyWords}
          onClick={async () => {
            await addPersonalWord({
              fi: word.fi,
              en: word.en,
              tl: word.tl,
              note: `Saved from the dictionary${word.vartalo ? ` · vartalo ${word.vartalo}` : ''}`,
            });
            setSavedToMyWords(true);
          }}
        >
          <Icon name={savedToMyWords ? 'check' : 'plus'} size={15} />
          {savedToMyWords ? 'Saved to My Words' : 'Add to My Words'}
        </button>

        <button
          className="btn btn--primary btn--block"
          onClick={() => navigate(`/practice/word/${word.id}`)}
        >
          <Icon name="target" size={17} />
          Practice this word
        </button>
      </section>

      <section className="panel panel--flat" style={{ marginTop: 20 }}>
        {word.source ? (
          <>
            <p className="row" style={{ gap: 8, marginBottom: 8 }}>
              <span className="badge badge--ok">sourced</span>
            </p>
            <p className="small" style={{ fontWeight: 650 }}>
              {word.source.book}
            </p>
            <p className="small muted">
              {word.source.chapter}
              {word.source.page !== undefined && ` · p. ${word.source.page}`}
              {word.source.page === undefined &&
                word.source.pdfPage !== undefined &&
                ` · PDF p. ${word.source.pdfPage}`}
            </p>
            {word.source.sourceTerm && (
              <p className="tiny dim" style={{ marginTop: 4 }}>
                listed there as “{word.source.sourceTerm}”
              </p>
            )}
            <p className="tiny dim" style={{ marginTop: 8, lineHeight: 1.5 }}>
              The headword was found in that word list. The meanings, example sentence and
              translations here are written for this app.
            </p>
          </>
        ) : (
          <p className="tiny dim" style={{ lineHeight: 1.6 }}>
            Not traced to a textbook. The Finnish forms were derived and checked against standard
            morphology, but no book is cited because the word was not found in the chapter word
            lists that have been read so far.
          </p>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <tr>
      <td>{label}</td>
      <td>{value}</td>
    </tr>
  );
}
