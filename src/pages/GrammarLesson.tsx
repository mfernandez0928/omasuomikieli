import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { Callout, EmptyState, LevelBadge, SpeakButton, TopBar, useLeaveFor } from '@/components/ui';
import { ExerciseRunner } from '@/components/ExerciseRunner';
import { GRAMMAR_BY_ID, getLesson, nextLesson } from '@/data/grammar';
import type { GrammarLesson } from '@/types';
import { getWord } from '@/data/words';
import { useApp } from '@/hooks/useApp';
import { saveResume } from '@/services/storage/prefs';

type Tab = 'lesson' | 'practice';

export function GrammarLessonPage() {
  const leaveFor = useLeaveFor();
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { settings, lessonProgress, saveProgress } = useApp();
  const [tab, setTab] = useState<Tab>('lesson');

  const lesson = getLesson(id);
  const following = nextLesson(id);
  const progress = lessonProgress.find((p) => p.grammarId === id);

  useEffect(() => {
    if (!lesson) return;
    saveResume({
      kind: 'grammar',
      refId: lesson.id,
      title: lesson.title,
      subtitle: lesson.subtitle,
      percent: progress?.percent ?? 0,
      updatedAt: Date.now(),
    });
    // Only re-record when the lesson itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  const related = useMemo(() => {
    if (!lesson) return [];
    return (lesson.relatedGrammar ?? [])
      .map((rid) => GRAMMAR_BY_ID.get(rid))
      .filter((l): l is NonNullable<typeof l> => Boolean(l));
  }, [lesson]);

  const relatedWords = useMemo(() => {
    if (!lesson) return [];
    return (lesson.relatedWords ?? [])
      .map((wid) => getWord(wid))
      .filter((w): w is NonNullable<typeof w> => Boolean(w));
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="page">
        <TopBar title="Lesson not found" />
        <EmptyState
          icon="alert"
          title="That lesson does not exist"
          text="It may have been renamed. Go back to the lesson list and pick it again."
          action={
            <button className="btn btn--primary" onClick={() => navigate('/grammar')}>
              All lessons
            </button>
          }
        />
      </div>
    );
  }

  const markRead = async () => {
    const current = progress?.percent ?? 0;
    // 60 means "read it, not practised yet". Once practice has produced a
    // score, that score stands; re-reading must not raise it back up.
    const practised = (progress?.exercisesDone ?? 0) > 0;
    if (!practised && current < 60) {
      await saveProgress({
        grammarId: lesson.id,
        percent: 60,
        section: 5,
        exercisesDone: progress?.exercisesDone ?? 0,
        exercisesTotal: lesson.exercises.length,
        updatedAt: Date.now(),
        completed: false,
      });
    }
    setTab('practice');
  };

  return (
    <div className="page fade-in">
      <TopBar
        title={`Rule ${lesson.order}: ${lesson.title}`}
        subtitle={lesson.subtitle}
        right={<LevelBadge level={lesson.level} />}
      />

      <div className="pills" role="tablist" aria-label="Lesson sections">
        <button
          role="tab"
          aria-selected={tab === 'lesson'}
          className={`pill ${tab === 'lesson' ? 'pill--active' : ''}`}
          onClick={() => setTab('lesson')}
        >
          Lesson
        </button>
        <button
          role="tab"
          aria-selected={tab === 'practice'}
          className={`pill ${tab === 'practice' ? 'pill--active' : ''}`}
          onClick={() => setTab('practice')}
        >
          Practice ({lesson.exercises.length})
        </button>
      </div>

      {tab === 'practice' ? (
        <div style={{ marginTop: 16 }}>
          <ExerciseRunner
            exercises={lesson.exercises}
            title={lesson.title}
            nextUp={
              following
                ? {
                    label: `Next lesson: ${following.title}`,
                    hint: `${following.subtitle} · ${following.level}`,
                    onGo: () => navigate(`/grammar/${following.id}`, { replace: true }),
                  }
                : {
                    label: 'Back to all lessons',
                    hint: 'That is the last lesson in the curriculum.',
                    onGo: () => leaveFor('/grammar'),
                  }
            }
            onFinish={async (score) => {
              /*
                The percentage is the score, not "you reached the end". It used
                to be hard-coded to 100, so a lesson you half got wrong looked
                finished on the home screen and there was nothing telling you to
                come back to it. The runner reports across repeat rounds, so
                fixing the ones you missed does take it to 100.
              */
              const pct = score.answered
                ? Math.round((score.correct / score.answered) * 100)
                : 0;
              await saveProgress({
                grammarId: lesson.id,
                percent: pct,
                section: 6,
                exercisesDone: score.answered,
                exercisesTotal: lesson.exercises.length,
                updatedAt: Date.now(),
                completed: pct === 100,
              });
            }}
          />
        </div>
      ) : (
        <div className="stack" style={{ marginTop: 16 }}>
          {/* -------------------------- rule intro -------------------------- */}
          <section className="panel">
            <p className="eyebrow" style={{ marginBottom: 8 }}>
              {lesson.finnishTerm} · {lesson.minutes} min
            </p>
            <p style={{ lineHeight: 1.6 }}>{lesson.intro}</p>
            {settings.showTagalog && (
              <p className="small muted" style={{ marginTop: 10, lineHeight: 1.6 }}>
                <b className="dim">TL</b> {lesson.introTl}
              </p>
            )}
          </section>

          {/* --------------------------- the rule --------------------------- */}
          <section className="panel">
            <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 8 }}>
              The rule
            </h2>
            <p style={{ lineHeight: 1.6 }}>{lesson.rule}</p>
          </section>

          {/* -------------------------- easy rule --------------------------- */}
          <section className="easyrule">
            <p className="easyrule__head">
              <Icon name="idea" size={18} />
              Easy rule
            </p>
            <div className="easyrule__grid" style={{ gridTemplateColumns: lesson.easyRule.right ? '1fr 1fr' : '1fr' }}>
              <div className="easyrule__cell">
                <p className="easyrule__big">{lesson.easyRule.left}</p>
                <p className="easyrule__small">{lesson.easyRule.leftNote}</p>
              </div>
              {lesson.easyRule.right && (
                <div className="easyrule__cell">
                  <p className="easyrule__big">{lesson.easyRule.right}</p>
                  <p className="easyrule__small">{lesson.easyRule.rightNote}</p>
                </div>
              )}
            </div>
          </section>

          {/* --------------------------- examples --------------------------- */}
          <section>
            <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
              Examples
            </h2>
            <div className="stack" style={{ gap: 8 }}>
              {lesson.examples.map((ex, i) => (
                <div className="wcard row" key={i} style={{ gap: 10 }}>
                  {ex.tag && (
                    <span
                      className={`vchip ${
                        ex.tag.includes('a') && !ex.tag.includes('ä')
                          ? 'vchip--back'
                          : ex.tag.includes('ä')
                            ? 'vchip--front'
                            : 'vchip--neutral'
                      }`}
                    >
                      {ex.tag}
                    </span>
                  )}
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="wcard__fi" style={{ display: 'block' }}>
                      {ex.fi}
                    </span>
                    <span className="wcard__gloss">
                      {ex.en}
                      {settings.showTagalog && (
                        <>
                          {'  |  '}
                          <b>{ex.tl}</b>
                        </>
                      )}
                    </span>
                  </span>
                  <SpeakButton text={ex.fi} />
                </div>
              ))}
            </div>
          </section>

          {/* ---------------------------- tables ---------------------------- */}
          {lesson.tables?.length ? (
            <section>
              <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
                Forms
              </h2>
              <div className="stack" style={{ gap: 12 }}>
                {lesson.tables.map((tbl, i) => (
                  <div className="wcard" key={i} style={{ padding: '12px 10px' }}>
                    <p
                      className="small"
                      style={{ fontWeight: 700, padding: '0 4px 8px', color: 'var(--card-ink)' }}
                    >
                      {tbl.title}
                    </p>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="formtable" style={{ minWidth: '100%' }}>
                        <thead>
                          <tr>
                            {tbl.headers.map((h, k) => (
                              <th
                                key={k}
                                style={{
                                  textAlign: 'left',
                                  padding: '6px 10px',
                                  fontSize: '0.78rem',
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
                          {tbl.rows.map((row, r) => (
                            <tr key={r}>
                              {row.map((cell, c) => (
                                <td
                                  key={c}
                                  style={{
                                    width: 'auto',
                                    whiteSpace: 'nowrap',
                                    color: c === 0 ? 'var(--card-ink-soft)' : undefined,
                                    fontWeight: c === 0 ? 400 : 650,
                                  }}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {tbl.note && (
                      <p
                        className="small"
                        style={{ color: 'var(--card-ink-soft)', padding: '10px 4px 0', lineHeight: 1.5 }}
                      >
                        {tbl.note}
                      </p>
                    )}
                    {settings.showTagalog && tbl.noteTl && (
                      <p className="small" style={{ color: '#b45309', padding: '4px 4px 0', lineHeight: 1.5 }}>
                        {tbl.noteTl}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* -------------------------- exceptions -------------------------- */}
          {lesson.exceptions?.length ? (
            <section>
              <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
                Important exceptions
              </h2>
              <div className="stack" style={{ gap: 10 }}>
                {lesson.exceptions.map((exc, i) => (
                  <div className="panel panel--flat" key={i}>
                    <p className="row" style={{ gap: 8, fontWeight: 700, marginBottom: 6 }}>
                      <span style={{ color: 'var(--gold)' }}>
                        <Icon name="alert" size={16} />
                      </span>
                      {exc.title}
                    </p>
                    <p className="small muted" style={{ lineHeight: 1.6 }}>
                      {exc.body}
                    </p>
                    {exc.examples?.length ? (
                      <div className="stack" style={{ gap: 6, marginTop: 10 }}>
                        {exc.examples.map((ex, j) => (
                          <div className="wcard row" key={j} style={{ gap: 10, padding: '9px 12px' }}>
                            <span style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ fontWeight: 650, display: 'block' }}>{ex.fi}</span>
                              <span className="wcard__gloss">
                                {ex.en}
                                {settings.showTagalog && (
                                  <>
                                    {'  |  '}
                                    <b>{ex.tl}</b>
                                  </>
                                )}
                              </span>
                            </span>
                            {ex.tag && <span className="badge badge--light">{ex.tag}</span>}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* ------------------------ common mistakes ----------------------- */}
          <section>
            <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
              Common mistakes
            </h2>
            <div className="stack" style={{ gap: 8 }}>
              {lesson.mistakes.map((m, i) => (
                <div className="panel panel--flat" key={i}>
                  <p className="row" style={{ gap: 8, marginBottom: 4 }}>
                    <span style={{ color: 'var(--bad)' }}>
                      <Icon name="x" size={15} />
                    </span>
                    <s style={{ color: '#fca5a5' }}>{m.wrong}</s>
                  </p>
                  <p className="row" style={{ gap: 8, marginBottom: 8 }}>
                    <span style={{ color: 'var(--ok)' }}>
                      <Icon name="check" size={15} />
                    </span>
                    <b>{m.right}</b>
                  </p>
                  <p className="small muted" style={{ lineHeight: 1.55 }}>
                    {m.why}
                  </p>
                  {settings.showTagalog && (
                    <p className="small dim" style={{ marginTop: 4, lineHeight: 1.55 }}>
                      {m.whyTl}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ---------------------------- memory tip ------------------------ */}
          <Callout kind="ok" icon="idea">
            <b>Remember this:</b> {lesson.tip}
            {settings.showTagalog && (
              <span style={{ display: 'block', marginTop: 6, opacity: 0.85 }}>{lesson.tipTl}</span>
            )}
          </Callout>

          {/* --------------------------- related links ---------------------- */}
          {(related.length > 0 || relatedWords.length > 0) && (
            <section className="panel">
              <h2 className="section__title" style={{ fontSize: '1rem', marginBottom: 10 }}>
                Related
              </h2>
              {related.length > 0 && (
                <>
                  <p className="eyebrow" style={{ marginBottom: 8 }}>
                    Grammar
                  </p>
                  <div className="chips" style={{ marginBottom: 14 }}>
                    {related.map((r) => (
                      <button key={r.id} className="chip" onClick={() => navigate(`/grammar/${r.id}`)}>
                        {r.title}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {relatedWords.length > 0 && (
                <>
                  <p className="eyebrow" style={{ marginBottom: 8 }}>
                    Vocabulary
                  </p>
                  <div className="chips">
                    {relatedWords.map((w) => (
                      <button
                        key={w.id}
                        className="chip"
                        onClick={() => navigate(`/vocabulary/${w.id}`)}
                      >
                        {w.fi}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {/* ----------------------------- source --------------------------- */}
          <SourcePanel lesson={lesson} />

          <button className="btn btn--primary btn--block" onClick={markRead}>
            Practice this rule
            <Icon name="chevron-right" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Shows where a lesson's rule actually came from.
 *
 * A citation is only rendered when the lesson carries one, and the page is
 * labelled as a printed page or a PDF page depending on which was verified for
 * that book. Supplementary lessons say so plainly instead of being left blank.
 */
function SourcePanel({ lesson }: { lesson: GrammarLesson }) {
  const refs = [lesson.source, ...(lesson.alsoIn ?? [])].filter(
    (r): r is NonNullable<typeof r> => Boolean(r),
  );

  if (lesson.origin === 'supplementary') {
    return (
      <section className="panel panel--flat">
        <p className="row" style={{ gap: 8, fontWeight: 700, marginBottom: 6 }}>
          <span className="badge">Additional content</span>
        </p>
        <p className="small muted" style={{ lineHeight: 1.6 }}>
          {lesson.openQuestion ??
            'This topic was not found in the contents of any supplied book that could be read, so it is additional content rather than textbook-derived.'}
        </p>
      </section>
    );
  }

  return (
    <section className="panel panel--flat">
      <p className="row" style={{ gap: 8, marginBottom: 10 }}>
        <span className="badge badge--ok">Textbook-derived</span>
      </p>
      <div className="stack" style={{ gap: 8 }}>
        {refs.map((r, i) => (
          <div key={i}>
            <p className="small" style={{ fontWeight: 650 }}>
              {r.book}
            </p>
            <p className="small muted">
              {r.chapter}
              {r.page !== undefined && ` · p. ${r.page}`}
              {r.page === undefined && r.pdfPage !== undefined && ` · PDF p. ${r.pdfPage}`}
            </p>
            {r.sourceTerm && (
              <p className="tiny dim" style={{ marginTop: 2 }}>
                listed there as “{r.sourceTerm}”
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="tiny dim" style={{ marginTop: 10, lineHeight: 1.55 }}>
        The rule and its Finnish terminology come from the book above. The examples, translations
        and exercises here are written for this app, not copied from it.
      </p>
    </section>
  );
}
