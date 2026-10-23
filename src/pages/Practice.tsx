import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon, type IconName } from '@/components/Icon';
import { Callout, EmptyState, LevelBadge, SpeakButton, TopBar, useLeaveFor } from '@/components/ui';
import { ExerciseRunner } from '@/components/ExerciseRunner';
import { ALL_EXERCISES, GRAMMAR_BY_ID, exercisesForGrammar, nextLesson } from '@/data/grammar';
import { WORDS, getWord } from '@/data/words';
import { useApp } from '@/hooks/useApp';
import { buildQueue, previewInterval, sessionSize } from '@/services/srs/scheduler';
import type { Exercise, SrsCard, SrsGrade } from '@/types';

/* ============================== practice hub ============================== */

const MODES: { to: string; title: string; sub: string; icon: IconName; colour: string }[] = [
  {
    to: '/practice/review',
    title: 'Daily review',
    sub: 'Spaced repetition - the words due today',
    icon: 'refresh',
    colour: 'var(--c-vocab)',
  },
  {
    to: '/practice/mixed',
    title: 'Mixed grammar practice',
    sub: 'Questions drawn from every lesson',
    icon: 'target',
    colour: 'var(--c-grammar)',
  },
  {
    to: '/practice/weak',
    title: 'Weak topics',
    sub: 'Drill the grammar you get wrong most',
    icon: 'alert',
    colour: 'var(--c-reading)',
  },
  {
    to: '/mistakes',
    title: 'My mistakes',
    sub: 'Everything you answered wrongly',
    icon: 'pencil',
    colour: 'var(--c-mistakes)',
  },
];

export function PracticeHub() {
  const navigate = useNavigate();
  const { cards, mistakes, activity, settings } = useApp();

  const due = sessionSize(
    cards,
    WORDS.map((w) => ({ kind: 'word' as const, refId: w.id })),
    settings.newPerDay,
  );
  const unresolved = mistakes.filter((m) => !m.resolved).length;
  const todayAnswered = activity.reduce((n, a) => n + a.exercisesAnswered, 0);
  const todayCorrect = activity.reduce((n, a) => n + a.exercisesCorrect, 0);
  const accuracy = todayAnswered ? Math.round((todayCorrect / todayAnswered) * 100) : null;

  return (
    <div className="page fade-in">
      <TopBar title="Practice" subtitle={`${ALL_EXERCISES.length} exercises available`} back={false} />

      <div className="panel">
        <div className="row row--between">
          <div>
            <p className="eyebrow">Due now</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold)' }}>{due}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="eyebrow">All-time accuracy</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {accuracy === null ? '--' : `${accuracy}%`}
            </p>
          </div>
        </div>
      </div>

      <div className="rows" style={{ marginTop: 14 }}>
        {MODES.map((m) => (
          <button key={m.to} className="rowcard" onClick={() => navigate(m.to)}>
            <span className="rowcard__num" style={{ background: m.colour }}>
              <Icon name={m.icon} size={15} />
            </span>
            <span className="rowcard__body">
              <span className="rowcard__title">{m.title}</span>
              <span className="rowcard__sub">{m.sub}</span>
            </span>
            {m.to === '/practice/review' && due > 0 && <span className="badge badge--gold">{due}</span>}
            {m.to === '/mistakes' && unresolved > 0 && <span className="badge badge--gold">{unresolved}</span>}
            <Icon name="chevron-right" size={17} className="rowcard__chev" />
          </button>
        ))}
      </div>

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Practice one lesson</h2>
        </div>
        <div className="rows">
          {[...GRAMMAR_BY_ID.values()]
            .filter((l) => l.exercises.length > 0)
            .map((l) => (
              <button
                key={l.id}
                className="rowcard"
                onClick={() => navigate(`/practice/grammar/${l.id}`)}
              >
                <span className="rowcard__body">
                  <span className="rowcard__title">{l.title}</span>
                  <span className="rowcard__sub">
                    {l.exercises.length} questions · {l.subtitle}
                  </span>
                </span>
                <LevelBadge level={l.level} />
                <Icon name="chevron-right" size={17} className="rowcard__chev" />
              </button>
            ))}
        </div>
      </section>
    </div>
  );
}

/* ============================= review session ============================= */

const GRADES: { grade: SrsGrade; label: string; colour: string }[] = [
  { grade: 'again', label: 'Again', colour: 'rgba(240,82,82,0.16)' },
  { grade: 'hard', label: 'Hard', colour: 'rgba(246,166,35,0.16)' },
  { grade: 'good', label: 'Good', colour: 'rgba(56,189,248,0.16)' },
  { grade: 'easy', label: 'Easy', colour: 'rgba(34,197,94,0.16)' },
];

export function ReviewSession() {
  const navigate = useNavigate();
  const { cards, settings, gradeCard, loadState } = useApp();

  const [queue, setQueue] = useState<SrsCard[] | null>(null);
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  const candidates = useMemo(
    () => WORDS.map((w) => ({ kind: 'word' as const, refId: w.id })),
    [],
  );

  const activeQueue = queue ?? buildQueue(cards, candidates, settings.newPerDay);
  const card = activeQueue[pos];
  const word = card ? getWord(card.refId) : undefined;

  if (loadState === 'loading') {
    return (
      <div className="page">
        <TopBar title="Daily review" />
        <EmptyState icon="loader" title="Loading your cards" text="One moment." />
      </div>
    );
  }

  if (!card || !word) {
    return (
      <div className="page fade-in">
        <TopBar title="Daily review" />
        <EmptyState
          icon="check"
          title={reviewed > 0 ? 'Review finished' : 'Nothing due right now'}
          text={
            reviewed > 0
              ? `You reviewed ${reviewed} ${reviewed === 1 ? 'card' : 'cards'}. They are scheduled to come back automatically.`
              : 'Every card is scheduled for later. Add new words from the dictionary, or practise grammar instead.'
          }
          action={
            <div className="stack" style={{ gap: 8 }}>
              <button className="btn btn--primary" onClick={() => navigate('/practice/mixed')}>
                Mixed grammar practice
              </button>
              <button className="btn btn--ghost" onClick={() => navigate('/vocabulary')}>
                Browse vocabulary
              </button>
            </div>
          }
        />
      </div>
    );
  }

  const handleGrade = async (grade: SrsGrade) => {
    const graded = await gradeCard(card, grade);
    setReviewed((n) => n + 1);
    setRevealed(false);

    if (grade === 'again') {
      // Requeue at the end of the session instead of dropping it. It has to
      // be the graded card: the copy in the queue is now one review out of
      // date, and its ease and interval are what the answer buttons preview.
      setQueue((q) => {
        const base = q ?? activeQueue;
        return [...base.filter((_, i) => i !== pos), graded];
      });
      return;
    }

    if (!queue) setQueue(activeQueue);
    setPos((p) => p + 1);
  };

  return (
    <div className="page fade-in">
      <TopBar title="Daily review" subtitle={`${activeQueue.length - pos} left`} />

      <div className="qbar">
        <div className="qbar__progress">
          <div
            className="progress__fill"
            style={{ width: `${(pos / Math.max(1, activeQueue.length)) * 100}%`, height: '100%' }}
          />
        </div>
        <span className="qbar__count">{reviewed} done</span>
      </div>

      <div className="wcard" style={{ padding: 24, textAlign: 'center', minHeight: 190 }}>
        <div className="row" style={{ justifyContent: 'center', gap: 8 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{word.fi}</h2>
          <SpeakButton text={word.fi} />
        </div>
        <p className="small" style={{ color: 'var(--card-ink-soft)', marginTop: 6 }}>
          {word.type}
          {word.verbType ? ` · verbityyppi ${word.verbType}` : ''} · {word.level}
        </p>

        {revealed ? (
          <div className="fade-in" style={{ marginTop: 16 }}>
            <p style={{ fontSize: '1.15rem', fontWeight: 650 }}>{word.en}</p>
            {settings.showTagalog && (
              <p style={{ color: '#b45309', fontWeight: 650, marginTop: 2 }}>{word.tl}</p>
            )}
            {word.vartalo && (
              <p className="small" style={{ color: 'var(--card-ink-soft)', marginTop: 10 }}>
                vartalo: <b>{word.vartalo}</b>
                {word.verbForms && ` · ${word.verbForms.present1sg} / ${word.verbForms.present3sg}`}
              </p>
            )}
            {word.examples?.[0] && (
              <p className="small" style={{ marginTop: 12, lineHeight: 1.5 }}>
                <b>{word.examples[0].fi}</b>
                <br />
                <span style={{ color: 'var(--card-ink-soft)' }}>{word.examples[0].en}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="small" style={{ color: 'var(--card-ink-soft)', marginTop: 28 }}>
            What does this mean?
          </p>
        )}
      </div>

      {revealed ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7, marginTop: 14 }}>
          {GRADES.map((g) => (
            <button
              key={g.grade}
              className="btn btn--sm"
              style={{ background: g.colour, flexDirection: 'column', gap: 2, minHeight: 58 }}
              onClick={() => void handleGrade(g.grade)}
            >
              <span>{g.label}</span>
              <span className="tiny dim">{previewInterval(card, g.grade)}</span>
            </button>
          ))}
        </div>
      ) : (
        <button
          className="btn btn--primary btn--block"
          style={{ marginTop: 14 }}
          onClick={() => setRevealed(true)}
        >
          Show answer
        </button>
      )}

      <button
        className="btn btn--ghost btn--block"
        style={{ marginTop: 8 }}
        onClick={() => navigate(`/vocabulary/${word.id}`)}
      >
        Open full entry
      </button>
    </div>
  );
}

/* ============================ grammar practice ============================ */

export function GrammarPractice() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const lesson = GRAMMAR_BY_ID.get(id);
  const exercises = exercisesForGrammar(id);
  const following = nextLesson(id);

  return (
    <div className="page fade-in">
      <TopBar title={lesson?.title ?? 'Practice'} subtitle={lesson?.subtitle} />
      <ExerciseRunner
        exercises={exercises}
        title={lesson?.title ?? 'Practice'}
        nextUp={
          following
            ? {
                label: `Next: ${following.title}`,
                onGo: () => navigate(`/practice/grammar/${following.id}`, { replace: true }),
              }
            : { label: 'Mixed practice', onGo: () => navigate('/practice/mixed', { replace: true }) }
        }
      />
    </div>
  );
}

/** Draws a fresh dozen questions from across the curriculum. */
function drawMixed(): Exercise[] {
  const pool = [...ALL_EXERCISES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 12);
}

/** Shuffled questions from across the whole curriculum. */
export function MixedPractice() {
  const [exercises, setExercises] = useState<Exercise[]>(drawMixed);
  // Bumped on each draw so the runner starts clean even in the unlikely case
  // that the new dozen matches the old one.
  const [draw, setDraw] = useState(0);

  return (
    <div className="page fade-in">
      <TopBar title="Mixed practice" subtitle="12 questions from across the curriculum" />
      <ExerciseRunner
        key={draw}
        exercises={exercises}
        title="Mixed practice"
        nextUp={{
          label: 'Another 12 questions',
          hint: `Drawn from ${ALL_EXERCISES.length} across the curriculum.`,
          onGo: () => {
            setExercises(drawMixed());
            setDraw((d) => d + 1);
            window.scrollTo(0, 0);
          },
        }}
      />
    </div>
  );
}

/** Drills the grammar topics the learner has got wrong most often. */
export function WeakTopics() {
  const navigate = useNavigate();
  const { mistakes } = useApp();

  const ranked = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of mistakes) {
      if (!m.grammarId || m.resolved) continue;
      counts.set(m.grammarId, (counts.get(m.grammarId) ?? 0) + 1 + m.reviewed);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [mistakes]);

  const exercises = useMemo(
    () => ranked.flatMap(([gid]) => exercisesForGrammar(gid)).slice(0, 12),
    [ranked],
  );

  if (!exercises.length) {
    return (
      <div className="page fade-in">
        <TopBar title="Weak topics" />
        <EmptyState
          icon="check"
          title="No weak topics yet"
          text="Once you get questions wrong, the grammar behind them shows up here so you can drill exactly what is slipping."
          action={
            <button className="btn btn--primary" onClick={() => navigate('/practice/mixed')}>
              Try mixed practice
            </button>
          }
        />
      </div>
    );
  }

  const topTitle = GRAMMAR_BY_ID.get(ranked[0][0])?.title;

  return (
    <div className="page fade-in">
      <TopBar
        title="Weak topics"
        subtitle={topTitle ? `Weakest right now: ${topTitle}` : undefined}
      />
      <div style={{ marginBottom: 12 }}>
        <Callout kind="info">
          These questions come from the grammar you have got wrong most often, hardest topic first.
        </Callout>
      </div>
      <ExerciseRunner
        exercises={exercises}
        title="Weak topics"
        nextUp={{ label: 'Mixed practice', onGo: () => navigate('/practice/mixed', { replace: true }) }}
      />
    </div>
  );
}

/** Practice built around a single dictionary word. */
export function WordPractice() {
  const leaveFor = useLeaveFor();
  const { id = '' } = useParams();
  const word = getWord(id);

  const exercises = useMemo<Exercise[]>(() => {
    if (!word) return [];
    const out: Exercise[] = [];

    // 1. Meaning, with distractors drawn from the same word type.
    const distractors = WORDS.filter((w) => w.id !== word.id && w.type === word.type)
      .slice(0, 2)
      .map((w) => w.en);
    if (distractors.length === 2) {
      out.push({
        id: `wp-${word.id}-meaning`,
        kind: 'multiple-choice',
        prompt: 'What does this word mean?',
        question: word.fi,
        options: [word.en, ...distractors].sort(),
        answer: word.en,
        explanation: `${word.fi} = ${word.en} (${word.tl}).${word.note ? ` ${word.note}` : ''}`,
        explanationTl: `${word.fi} = ${word.tl}.`,
        wordId: word.id,
      });
    }

    // 2. Conjugation, where the form is known.
    if (word.verbForms?.present1sg) {
      out.push({
        id: `wp-${word.id}-1sg`,
        kind: 'conjugate',
        prompt: 'Write the minä form.',
        question: `${word.fi} → minä ___`,
        hint: word.verbType ? `Verbityyppi ${word.verbType}` : undefined,
        answer: word.verbForms.present1sg,
        explanation: `${word.fi} gives ${word.verbForms.present1sg}.${
          word.vartalo ? ` The stem is ${word.vartalo}.` : ''
        }`,
        explanationTl: `${word.fi} → ${word.verbForms.present1sg}.`,
        wordId: word.id,
      });
    }

    // 3. Genitive, when known.
    if (word.nominalForms?.genitive) {
      out.push({
        id: `wp-${word.id}-gen`,
        kind: 'fill-blank',
        prompt: 'Write the genitive (genetiivi).',
        question: `${word.fi} → ___`,
        hint: 'Add -n to the stem, and watch for KPT gradation.',
        answer: word.nominalForms.genitive,
        explanation: `The genitive of ${word.fi} is ${word.nominalForms.genitive}.`,
        explanationTl: `Ang genetiivi ng ${word.fi} ay ${word.nominalForms.genitive}.`,
        wordId: word.id,
      });
    }

    // 4. Translate the example sentence.
    const example = word.examples?.[0];
    if (example) {
      out.push({
        id: `wp-${word.id}-sentence`,
        kind: 'translate',
        prompt: 'Translate into Finnish.',
        question: example.en,
        hint: `Use ${word.fi}`,
        answer: example.fi,
        explanation: `${example.fi} - ${example.en}`,
        explanationTl: `${example.fi} - ${example.tl}`,
        wordId: word.id,
      });
    }

    return out;
  }, [word]);

  if (!word) {
    return (
      <div className="page">
        <TopBar title="Practice" />
        <EmptyState icon="search" title="Word not found" text="Pick a word from the dictionary." />
      </div>
    );
  }

  if (!exercises.length) {
    return (
      <div className="page fade-in">
        <TopBar title={word.fi} />
        <EmptyState
          icon="alert"
          title="Not enough data to build questions"
          text="This entry has no conjugations, forms or example sentence stored yet, so there is nothing reliable to test. Add them to the data file and the questions appear automatically."
          action={
            <button className="btn btn--primary" onClick={() => leaveFor(`/vocabulary/${word.id}`)}>
              Back to the word
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <TopBar title={word.fi} subtitle={`${exercises.length} questions`} />
      <ExerciseRunner
        exercises={exercises}
        title={word.fi}
        nextUp={{ label: 'Back to the word', onGo: () => leaveFor(`/vocabulary/${word.id}`) }}
      />
    </div>
  );
}
