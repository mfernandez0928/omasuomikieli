import { useMemo } from 'react';
import { Callout, TopBar } from '@/components/ui';
import { LEGACY_AUDIT, LEGACY_META } from '@/data/legacy/legacy-adapter';
import { IMPORTED_WORDS, MERGED_AWAY, WORDS, validateWords } from '@/data/words';
import { GRAMMAR_LESSONS } from '@/data/grammar';
import { PHRASES } from '@/data/phrases';
import { SOURCE_BOOKS } from '@/data/sources';
import { SCENES, SCENE_LEXICON } from '@/data/situations';
import { ALL_SPOKEN } from '@/data/puhekieli';
import { getWord } from '@/data/words';
import { rosterEnabled } from '@/services/sync/roster';
import { OS1_SANASTO_CHAPTERS } from '@/data/sources/os1-sanasto';

const SEVERITY_STYLE = {
  bug: { label: 'bug', className: 'badge--review' },
  correction: { label: 'corrected', className: 'badge--corrected' },
  note: { label: 'note', className: 'badge' },
} as const;

/**
 * Provenance screen: which content came from which book, what was changed
 * during import, and what is still unverified.
 */
export function DataAudit() {
  const issues = useMemo(() => validateWords(), []);
  const sourceDerived = GRAMMAR_LESSONS.filter((l) => l.origin === 'source-derived').length;

  const needsReview = WORDS.filter((w) => w.verification === 'needs-review');
  const corrected = WORDS.filter((w) => Boolean(w.correctionNote));

  const bugs = LEGACY_AUDIT.filter((f) => f.severity === 'bug');
  const corrections = LEGACY_AUDIT.filter((f) => f.severity === 'correction');
  const notes = LEGACY_AUDIT.filter((f) => f.severity === 'note');

  return (
    <div className="page fade-in">
      <TopBar title="Data audit & sources" subtitle="What was changed, and what is unverified" />

      <SourceInventory />

      <section className="section">
        <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
          Grammar lessons
        </h2>
        <Callout kind={sourceDerived > 0 ? 'ok' : 'warn'} icon="shield">
          <b>
            {sourceDerived} of {GRAMMAR_LESSONS.length} lessons are textbook-derived
          </b>{' '}
          and cite the book and chapter their rule comes from. The remaining{' '}
          {GRAMMAR_LESSONS.length - sourceDerived} are labelled additional content, because the
          topic was not found in the contents of any book that could be read.
        </Callout>

        <div className="stack" style={{ gap: 8, marginTop: 10 }}>
          {GRAMMAR_LESSONS.filter((l) => l.origin === 'supplementary').map((l) => (
            <div className="panel panel--flat" key={l.id}>
              <p className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                <b>{l.title}</b>
                <span className="badge">additional content</span>
              </p>
              {l.openQuestion && (
                <p className="small muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
                  {l.openQuestion}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <VocabularyProvenance />

      <SanastoCoverage />

      {/* --------------------------- imported file --------------------------- */}
      <section className="panel" style={{ marginTop: 14 }}>
        <p className="eyebrow" style={{ marginBottom: 10 }}>
          Supplied database v{LEGACY_META.version}
        </p>
        <table className="formtable" style={{ color: 'var(--ink)' }}>
          <tbody>
            <tr>
              <td style={{ color: 'var(--ink-soft)' }}>Words declared / found</td>
              <td>
                {LEGACY_META.declaredWords} / {LEGACY_META.actualWords}
              </td>
            </tr>
            <tr>
              <td style={{ color: 'var(--ink-soft)' }}>Grammar items declared / found</td>
              <td>
                {LEGACY_META.declaredGrammar} / {LEGACY_META.actualGrammar}
              </td>
            </tr>
            <tr>
              <td style={{ color: 'var(--ink-soft)' }}>Imported into the dictionary</td>
              <td>{IMPORTED_WORDS.length}</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--ink-soft)' }}>Skipped as duplicates</td>
              <td>{MERGED_AWAY.length}</td>
            </tr>
          </tbody>
        </table>
        <p className="small dim" style={{ marginTop: 10, lineHeight: 1.55 }}>
          Entries skipped as duplicates are covered by a hand-written entry with fuller conjugation
          data. The original file is kept unchanged in <code>src/data/legacy/</code>.
        </p>
      </section>

      {/* ------------------------------- bugs -------------------------------- */}
      {bugs.length > 0 && (
        <section className="section">
          <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
            Data bugs found ({bugs.length})
          </h2>
          <div className="stack" style={{ gap: 8 }}>
            {bugs.map((f, i) => (
              <AuditRow key={i} finding={f} />
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------- corrections ---------------------------- */}
      {corrections.length > 0 && (
        <section className="section">
          <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
            Corrections applied ({corrections.length})
          </h2>
          <div className="stack" style={{ gap: 8 }}>
            {corrections.map((f, i) => (
              <AuditRow key={i} finding={f} />
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------- notes ------------------------------- */}
      {notes.length > 0 && (
        <section className="section">
          <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
            Notes ({notes.length})
          </h2>
          <div className="stack" style={{ gap: 8 }}>
            {notes.map((f, i) => (
              <AuditRow key={i} finding={f} />
            ))}
          </div>
        </section>
      )}

      {/* --------------------- corrections in curated data -------------------- */}
      <section className="section">
        <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
          Stems corrected from the personal notes ({corrected.length})
        </h2>
        <p className="small muted" style={{ marginBottom: 10, lineHeight: 1.55 }}>
          These came from the vocabulary tables in your own documents. The stem given there was
          wrong for the verb type, so it was re-derived.
        </p>
        <div className="stack" style={{ gap: 8 }}>
          {corrected.map((w) => (
            <div className="panel panel--flat" key={w.id}>
              <p className="row" style={{ gap: 8 }}>
                <b>{w.fi}</b>
                <span className="badge badge--corrected">corrected</span>
              </p>
              <p className="small muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
                {w.correctionNote}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------- needs review ---------------------------- */}
      <section className="section">
        <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
          Flagged for review ({needsReview.length})
        </h2>
        <p className="small muted" style={{ marginBottom: 10, lineHeight: 1.55 }}>
          Not yet checked against a textbook. They are shown in the app with a "needs review" badge
          rather than being presented as confirmed.
        </p>
        <div className="chips">
          {needsReview.map((w) => (
            <span className="chip" key={w.id}>
              {w.fi}
            </span>
          ))}
        </div>
      </section>

      <RosterStatus />

      <SituationsProvenance />

      {/* ------------------------- integrity check --------------------------- */}
      <section className="section">
        <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
          Integrity check
        </h2>
        {issues.length === 0 ? (
          <Callout kind="ok" icon="check">
            {WORDS.length} words, {GRAMMAR_LESSONS.length} lessons and {PHRASES.length} phrases:
            no duplicate ids, no duplicate headwords and no broken cross-references.
          </Callout>
        ) : (
          <div className="stack" style={{ gap: 8 }}>
            {issues.map((issue, i) => (
              <Callout kind="bad" key={i}>
                <b>{issue.kind}</b>: {issue.detail}
              </Callout>
            ))}
          </div>
        )}
      </section>

      <div style={{ marginTop: 18 }}>
        <Callout kind="info" icon="idea">
          <b>To add real citations:</b> put a <code>source</code> object on an entry in
          <code> src/data/words/</code> or <code>src/data/grammar/</code>, with the book and chapter
          you actually checked, and change <code>verification</code> to <code>'verified'</code>. The
          app will show the citation at the bottom of that entry.
        </Callout>
      </div>
    </div>
  );
}

/**
 * Says out loud whether this build reports learner names, so the question can
 * be answered by opening the app rather than by reading the JS bundle.
 */
function RosterStatus() {
  return (
    <section className="section">
      <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
        Learner roster
      </h2>
      {rosterEnabled ? (
        <Callout kind="ok" icon="check">
          <b>Names are recorded.</b> The name you give on the first screen is sent once, so the
          person who made the app knows who is using it. Nothing else leaves your device: not your
          progress, not your answers, not your mistakes.
        </Callout>
      ) : (
        <Callout kind="info">
          <b>Nothing is recorded.</b> The name you gave stays in this browser and is not sent
          anywhere.
        </Callout>
      )}
    </section>
  );
}

/**
 * Situations are sourced differently from the rest of the content: the dialogue
 * is written, its vocabulary is not. The counts come from the lexicon.
 */
function SituationsProvenance() {
  const stats = useMemo(() => {
    const choices = SCENES.reduce((n, s) => n + s.turns.length, 0);
    const replies = SCENES.reduce(
      (n, s) => n + s.turns.reduce((m, t) => m + t.options.length, 0),
      0,
    );
    const traced = SCENE_LEXICON.filter((g) => g.wordId);
    // Some forms without a dictionary entry still carry a citation in their
    // note; the numerals are printed in the Suomen mestari 2 tables.
    const citedBasis = SCENE_LEXICON.filter(
      (g) => !g.wordId && /Suomen mestari|Oma suomi/.test(g.basis ?? ''),
    ).length;
    const entries = [...new Set(traced.map((g) => g.wordId!))];
    const words = entries.map((id) => getWord(id)).filter((w) => Boolean(w));
    const cited = words.filter((w) => w!.source !== null).length;
    return {
      choices,
      replies,
      forms: SCENE_LEXICON.length,
      tracedForms: traced.length,
      basisForms: SCENE_LEXICON.length - traced.length,
      citedBasis,
      entries: entries.length,
      cited,
    };
  }, []);

  return (
    <section className="section">
      <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
        Situations
      </h2>
      <Callout kind="warn">
        <b>The dialogues are written for this app.</b> They are not transcripts of anything printed
        in a book, and each scene is scripted, so it follows the same path every time. What is
        sourced is the language they are built from.
      </Callout>
      <div className="panel panel--tight" style={{ marginTop: 10 }}>
        <p className="small" style={{ lineHeight: 1.75 }}>
          {SCENES.length} scenes · {stats.choices} choices · {stats.replies} written replies
          <br />
          {stats.forms} distinct Finnish word forms appear in the dialogue lines
          <br />
          <b>{stats.tracedForms}</b> of them trace to one of <b>{stats.entries}</b> dictionary
          entries, and <b>{stats.cited}</b> of those entries carry a book citation
          <br />
          {stats.basisForms} are not dictionary entries - names, greeting and reply words,
          numerals, and one form that is not Finnish at all and appears only inside a wrong answer
          option. {stats.citedBasis} of those carry a book citation in their note anyway; the rest
          say plainly that they have none, rather than carrying an invented one
          <br />
          {ALL_SPOKEN.length} spoken forms transcribed from Suomen mestari 2, s. 293-296, which is
          where every puhekieli form in the scenes comes from
        </p>
      </div>
      <p className="tiny dim" style={{ marginTop: 8, lineHeight: 1.65 }}>
        <code>npm run validate:situations</code> re-checks all of this and fails if a dialogue line
        gains a word that is not accounted for.
      </p>
    </section>
  );
}

function AuditRow({ finding }: { finding: (typeof LEGACY_AUDIT)[number] }) {
  const style = SEVERITY_STYLE[finding.severity];
  return (
    <div className="panel panel--flat">
      <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <b>{finding.finnish}</b>
        <span className={`badge ${style.className}`}>{style.label}</span>
        <span className="badge">{finding.field}</span>
      </div>
      <p className="small" style={{ marginTop: 8 }}>
        <span style={{ color: '#fca5a5' }}>{finding.was}</span>
        {' → '}
        <span style={{ color: '#86efac' }}>{finding.now}</span>
      </p>
      <p className="small muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
        {finding.why}
      </p>
    </div>
  );
}

const ACCESS_LABEL: Record<string, { label: string; cls: string }> = {
  readable: { label: 'readable', cls: 'badge--ok' },
  'read-as-images': { label: 'read page by page', cls: 'badge--ok' },
  'image-only': { label: 'no text layer', cls: 'badge--review' },
  'sample-only': { label: 'sample only', cls: 'badge--review' },
};

/**
 * What was found when the supplied PDFs were actually opened.
 *
 * A book is only listed as usable if its text could be extracted and its
 * contents read. Files that could not be read say exactly why, so an
 * uncitable book is never mistaken for an uncited one.
 */
function SourceInventory() {
  return (
    <section className="section">
      <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
        Source inventory
      </h2>
      <p className="small muted" style={{ marginBottom: 12, lineHeight: 1.55 }}>
        Built by extracting each PDF's text and reading its own table of contents — not from
        general knowledge of what is usually taught at a given level.
      </p>

      <div className="stack" style={{ gap: 10 }}>
        {SOURCE_BOOKS.map((book) => {
          const meta = ACCESS_LABEL[book.access];
          return (
            <div className="panel panel--flat" key={book.id}>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                <b style={{ flex: 1, minWidth: 0 }}>{book.title}</b>
                <span className={`badge ${meta.cls}`}>{meta.label}</span>
              </div>

              {book.statedLevel && (
                <p className="tiny dim" style={{ marginTop: 4 }}>
                  Level: {book.statedLevel}
                </p>
              )}
              {book.pdfPages !== undefined && (
                <p className="tiny dim">{book.pdfPages} PDF pages</p>
              )}

              {book.limitation && (
                <p className="small" style={{ marginTop: 8, color: '#f8d9a0', lineHeight: 1.55 }}>
                  {book.limitation}
                </p>
              )}

              {book.pageMapping && (
                <p className="tiny dim" style={{ marginTop: 8, lineHeight: 1.5 }}>
                  <b>Page numbers:</b> {book.pageMapping}
                </p>
              )}

              {book.chapters.length > 0 && (
                <details style={{ marginTop: 10 }}>
                  <summary className="small" style={{ cursor: 'pointer', color: 'var(--info)' }}>
                    {book.chapters.length} chapters mapped
                  </summary>
                  <div className="stack" style={{ gap: 8, marginTop: 10 }}>
                    {book.chapters.map((ch) => (
                      <div key={ch.number}>
                        <p className="small" style={{ fontWeight: 650 }}>
                          {ch.number}. {ch.titleFi}
                          {ch.page !== undefined && (
                            <span className="dim"> · p. {ch.page}</span>
                          )}
                          {ch.page === undefined && ch.pdfPage !== undefined && (
                            <span className="dim"> · PDF p. {ch.pdfPage}</span>
                          )}
                        </p>
                        {ch.grammar.length > 0 && (
                          <p className="tiny dim" style={{ lineHeight: 1.5 }}>
                            {ch.grammar.join(' · ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              )}

              {book.notes?.map((n, i) => (
                <p className="tiny dim" style={{ marginTop: 8, lineHeight: 1.5 }} key={i}>
                  {n}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

const STATUS_META: Record<
  string,
  { label: string; cls: string; blurb: string }
> = {
  'source-verified': {
    label: 'source-verified',
    cls: 'badge--ok',
    blurb: 'Headword found in a named book at a page that was read, and its forms checked.',
  },
  'linguistically-checked': {
    label: 'linguistically-checked',
    cls: 'badge',
    blurb:
      'Not found in the chapter word lists read so far. Stem, verb type and inflected forms were derived and checked against standard Finnish morphology.',
  },
  supplementary: {
    label: 'supplementary',
    cls: 'badge',
    blurb:
      'Imported from the supplied v0.2.1 database. Kept because it is useful, but not traced to a source and not individually checked.',
  },
  'needs-review': {
    label: 'needs-review',
    cls: 'badge--review',
    blurb: 'Something specific is uncertain. Each entry says what.',
  },
};

/** Where the dictionary's 230 entries stand, and what each status means. */
function VocabularyProvenance() {
  const counts = new Map<string, number>();
  for (const w of WORDS) counts.set(w.verification, (counts.get(w.verification) ?? 0) + 1);

  const sourced = WORDS.filter((w) => w.source !== null);
  const flagged = WORDS.filter((w) => w.verification === 'needs-review');

  const byChapter = new Map<string, typeof sourced>();
  for (const w of sourced) {
    const key = `${w.source!.book} · ${w.source!.chapter}`;
    byChapter.set(key, [...(byChapter.get(key) ?? []), w]);
  }

  return (
    <section className="section">
      <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
        Vocabulary provenance
      </h2>

      <Callout kind="info" icon="shield">
        <b>
          {sourced.length} of {WORDS.length} words are traced to a named book.
        </b>{' '}
        Matched against the chapter word lists of Suomen mestari 2 (all 8 chapters) and Suomen
        mestari 3 (chapters 1-4, 6-8), and against Oma suomi 1's own KIRJAN SANASTO index. The
        index gives chapter numbers rather than pages, so those citations carry a chapter and no
        page. The rest are not claimed as sourced.
      </Callout>

      <div className="stack" style={{ gap: 8, marginTop: 12 }}>
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <div className="panel panel--flat" key={key}>
            <p className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              <span className={`badge ${meta.cls}`}>{meta.label}</span>
              <b>{counts.get(key) ?? 0}</b>
              <span className="small dim">entries</span>
            </p>
            <p className="small muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
              {meta.blurb}
            </p>
          </div>
        ))}
      </div>

      {byChapter.size > 0 && (
        <details style={{ marginTop: 12 }}>
          <summary className="small" style={{ cursor: 'pointer', color: 'var(--info)' }}>
            Sourced words by chapter ({sourced.length})
          </summary>
          <div className="stack" style={{ gap: 10, marginTop: 10 }}>
            {[...byChapter.entries()].map(([chapter, words]) => (
              <div key={chapter}>
                <p className="small" style={{ fontWeight: 650 }}>
                  {chapter}
                  <span className="dim"> · p. {words[0].source!.page}</span>
                </p>
                <p className="tiny dim" style={{ lineHeight: 1.5 }}>
                  {words.map((w) => w.fi).join(' · ')}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}

      {flagged.length > 0 && (
        <div className="stack" style={{ gap: 8, marginTop: 12 }}>
          <p className="eyebrow">Open questions ({flagged.length})</p>
          {flagged.map((w) => (
            <div className="panel panel--flat" key={w.id}>
              <p className="row" style={{ gap: 8 }}>
                <b>{w.fi}</b>
                <span className="badge badge--review">needs review</span>
              </p>
              {w.reviewNote && (
                <p className="small muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
                  {w.reviewNote}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** Per-chapter coverage of the Oma suomi 1 SANASTO transcription. */
function SanastoCoverage() {
  const words = WORDS.filter((w) => w.source?.section === 'SANASTO');
  const byChapter = new Map<number, number>();
  for (const w of words) {
    const n = Number(w.source!.chapter.match(/Kappale (\d+)/)?.[1] ?? 0);
    byChapter.set(n, (byChapter.get(n) ?? 0) + 1);
  }
  const totalEntries = OS1_SANASTO_CHAPTERS.reduce((n, c) => n + c.entries, 0);

  return (
    <section className="section">
      <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
        Oma suomi 1 — SANASTO coverage
      </h2>
      <Callout kind="info" icon="shield">
        All <b>13 of 13</b> chapter word lists transcribed: <b>{totalEntries}</b> source entries.
        Kappale 2 has no text layer in the PDF and was read from the page images instead.
      </Callout>

      <div className="wcard" style={{ marginTop: 12, padding: '8px 4px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="formtable" style={{ minWidth: '100%' }}>
            <thead>
              <tr>
                {['Kpl', 'Title', 'Printed p.', 'Entries', 'In app', 'Read as'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '6px 9px',
                      fontSize: '0.74rem',
                      color: 'var(--card-ink-soft)',
                      borderBottom: '1px solid var(--card-border)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OS1_SANASTO_CHAPTERS.map((c) => (
                <tr key={c.kappale}>
                  <td style={{ width: 'auto' }}>{c.kappale}</td>
                  <td style={{ width: 'auto', fontWeight: 400 }}>{c.title}</td>
                  <td style={{ width: 'auto', whiteSpace: 'nowrap' }}>{c.pages.join(', ')}</td>
                  <td style={{ width: 'auto' }}>{c.entries}</td>
                  <td style={{ width: 'auto' }}>{byChapter.get(c.kappale) ?? 0}</td>
                  <td style={{ width: 'auto', fontWeight: 400 }}>
                    {c.source === 'image' ? 'page images' : 'text layer'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="small muted" style={{ marginTop: 10, lineHeight: 1.55 }}>
        "Entries" is what the book prints; "In app" is how many of those now exist as dictionary
        entries citing that page. The gap is vocabulary transcribed but not yet given English and
        Tagalog meanings — those are written by hand, not generated.
      </p>
    </section>
  );
}
