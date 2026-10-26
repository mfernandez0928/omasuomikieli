import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { Callout, ProgressBar, SpeakButton } from '@/components/ui';
import type { Exercise } from '@/types';
import { checkAnswer } from '@/services/search/search';
import { useApp } from '@/hooks/useApp';
import { speak } from '@/services/speech';

export interface RunScore {
  answered: number;
  correct: number;
}

/**
 * Where to go once the set is finished. Supplied by the caller, because the
 * runner does not know whether it is inside a lesson, a mixed set or a word.
 */
export interface NextUp {
  label: string;
  hint?: string;
  onGo: () => void;
}

/** Deterministic shuffle so options do not jump around on re-render. */
function shuffled<T>(items: T[], seed: string): T[] {
  const out = [...items];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function ExerciseRunner({
  exercises,
  title,
  onFinish,
  nextUp,
}: {
  exercises: Exercise[];
  title: string;
  onFinish?: (score: RunScore) => void | Promise<void>;
  nextUp?: NextUp;
}) {
  const { settings, addMistake, noteActivity } = useApp();

  /*
    `pool` is the set being asked right now. The first round is the caller's
    own order, which lessons author deliberately from easy to hard. A repeat
    round holds only the questions that were missed, shuffled, so finishing a
    set never means answering the same correct answers again.
  */
  const signature = useMemo(() => exercises.map((e) => e.id).join('|'), [exercises]);
  const [pool, setPool] = useState<Exercise[]>(exercises);
  const [round, setRound] = useState(0);

  /*
    `score` is this round only, which is what the result screen reports. The
    caller is told about the whole set instead: a repeat round covers two of
    five questions, and a lesson's stored progress must not fall back to two.
  */
  const attempted = useRef<Set<string>>(new Set());
  const everCorrect = useRef<Set<string>>(new Set());

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState<RunScore>({ answered: 0, correct: 0 });
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  // Answer state for the current question.
  const [selected, setSelected] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [matchPicks, setMatchPicks] = useState<Record<string, string>>({});
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [umlautSlip, setUmlautSlip] = useState(false);

  const current = pool[index];

  // A listening question plays itself once when it comes up; Play repeats it.
  useEffect(() => {
    if (current?.audio && !done) speak(current.audio);
  }, [current?.id, current?.audio, done]);

  const rightColumn = useMemo(
    () => (current?.pairs ? shuffled(current.pairs.map((p) => p.right), current.id) : []),
    [current],
  );

  // A caller can hand over a different set (mixed practice drawing again), so
  // the run restarts when the questions themselves change, not on every render.
  useEffect(() => {
    attempted.current = new Set();
    everCorrect.current = new Set();
    setPool(exercises);
    setRound(0);
    setIndex(0);
    setScore({ answered: 0, correct: 0 });
    setWrongIds([]);
    setDone(false);
    setSelected(null);
    setTyped('');
    setMatchPicks({});
    setActiveLeft(null);
    setChecked(false);
    setWasCorrect(false);
    setUmlautSlip(false);
    // `signature` is the content of `exercises`; the array identity changes on
    // every render in some callers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  if (!exercises.length) {
    return (
      <Callout kind="info">
        There are no exercises for this lesson yet. Open another lesson, or use the mixed practice on
        the Practice tab.
      </Callout>
    );
  }

  const resetQuestion = () => {
    setSelected(null);
    setTyped('');
    setMatchPicks({});
    setActiveLeft(null);
    setChecked(false);
    setWasCorrect(false);
    setUmlautSlip(false);
  };

  const isMatch = current.kind === 'match';
  const isTyped = ['fill-blank', 'translate', 'conjugate', 'correct-sentence'].includes(current.kind);

  const canCheck = isMatch
    ? Object.keys(matchPicks).length === (current.pairs?.length ?? 0)
    : isTyped
      ? typed.trim().length > 0
      : selected !== null;

  const evaluate = (): { correct: boolean; umlautSlip: boolean } => {
    if (isMatch) {
      const ok = (current.pairs ?? []).every((p) => matchPicks[p.left] === p.right);
      return { correct: ok, umlautSlip: false };
    }
    if (isTyped) {
      return checkAnswer(typed, current.answer, current.alsoAccept);
    }
    return { correct: selected === current.answer, umlautSlip: false };
  };

  const handleCheck = async () => {
    const { correct, umlautSlip: slip } = evaluate();
    setUmlautSlip(slip);
    attempted.current.add(current.id);
    if (correct) everCorrect.current.add(current.id);
    setWasCorrect(correct);
    setChecked(true);
    setScore((s) => ({ answered: s.answered + 1, correct: s.correct + (correct ? 1 : 0) }));

    if (!correct) {
      setWrongIds((ids) => (ids.includes(current.id) ? ids : [...ids, current.id]));
      const given = isMatch
        ? (current.pairs ?? []).map((p) => `${p.left} → ${matchPicks[p.left] ?? '?'}`).join(', ')
        : isTyped
          ? typed.trim()
          : (selected ?? '');
      const right = isMatch
        ? (current.pairs ?? []).map((p) => `${p.left} → ${p.right}`).join(', ')
        : current.answer;

      await addMistake({
        wrong: given || '(no answer)',
        right,
        origin: 'practice',
        grammarId: current.grammarId,
        wordId: current.wordId,
        // A listening question has no text; the sentence it played is the context.
        note: current.question || current.audio,
      });
    }

    await noteActivity({ exercisesAnswered: 1, exercisesCorrect: correct ? 1 : 0 });
  };

  const handleNext = async () => {
    if (index + 1 >= pool.length) {
      setDone(true);
      await onFinish?.({
        answered: attempted.current.size,
        correct: everCorrect.current.size,
      });
      return;
    }
    setIndex((i) => i + 1);
    resetQuestion();
  };

  /** Replays only what was missed, in a different order each time. */
  const practiseMissed = () => {
    const missed = pool.filter((e) => wrongIds.includes(e.id));
    if (!missed.length) return;
    setPool(shuffled(missed, `round-${round + 1}-${signature}`));
    setRound((r) => r + 1);
    setDone(false);
    setIndex(0);
    setScore({ answered: 0, correct: 0 });
    setWrongIds([]);
    resetQuestion();
  };

  if (done) {
    const pct = score.answered ? Math.round((score.correct / score.answered) * 100) : 0;
    const wrongList = pool.filter((e) => wrongIds.includes(e.id));
    const allCorrect = score.answered > 0 && wrongList.length === 0;
    return (
      <div className="stack fade-in">
        <div className="panel center">
          <div
            className="goal__flame"
            style={{
              margin: '0 auto 12px',
              width: 60,
              height: 60,
              background: pct >= 70 ? 'rgba(34,197,94,0.16)' : 'rgba(246,166,35,0.16)',
              color: pct >= 70 ? 'var(--ok)' : 'var(--gold)',
            }}
          >
            <Icon name={pct >= 70 ? 'check' : 'refresh'} size={28} />
          </div>
          <h2 className="section__title">
            {score.correct} / {score.answered} correct
          </h2>
          <p className="muted small" style={{ marginTop: 4 }}>
            {title}
          </p>
          <div style={{ marginTop: 14 }}>
            <ProgressBar percent={pct} />
          </div>
          <p className="small muted" style={{ marginTop: 12, lineHeight: 1.55 }}>
            {allCorrect
              ? round > 0
                ? 'That clears the ones you missed. Nothing left to repeat here.'
                : 'Every answer correct. This rule is solid - the review queue will bring it back in a few days.'
              : pct >= 70
                ? 'Good result. Only the ones below are left, and they are saved in My Mistakes too.'
                : 'Worth another pass. Re-read the rule above, then take just the ones below.'}
          </p>
        </div>

        {wrongList.length > 0 && (
          <div className="panel">
            <h3 className="eyebrow" style={{ marginBottom: 10 }}>
              What to review ({wrongList.length})
            </h3>
            <div className="stack" style={{ gap: 8 }}>
              {wrongList.map((e) => (
                <div key={e.id} className="wcard">
                  <p className="small" style={{ color: 'var(--card-ink-soft)' }}>
                    {e.question}
                  </p>
                  <p style={{ fontWeight: 700, marginTop: 4 }}>{e.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/*
          No repeat button once everything is right: answering the same correct
          answers again teaches nothing. What is offered instead is the way on.
        */}
        <div className="stack" style={{ gap: 8 }}>
          {wrongList.length > 0 && (
            <button className="btn btn--primary btn--block" onClick={practiseMissed}>
              <Icon name="refresh" size={17} />
              Practise {wrongList.length === 1 ? 'the one' : `the ${wrongList.length}`} you missed
            </button>
          )}
          {nextUp && (
            <button
              className={`btn btn--block ${wrongList.length ? 'btn--ghost' : 'btn--primary'}`}
              onClick={nextUp.onGo}
            >
              {nextUp.label}
              <Icon name="chevron-right" size={17} />
            </button>
          )}
          {nextUp?.hint && (
            <p className="tiny dim center" style={{ marginTop: 2 }}>
              {nextUp.hint}
            </p>
          )}
        </div>
      </div>
    );
  }

  const questionParts = current.question.split('___');

  return (
    <div className="stack fade-in">
      <div className="qbar">
        <div className="qbar__progress">
          <div
            className="progress__fill"
            style={{ width: `${(index / pool.length) * 100}%`, height: '100%' }}
          />
        </div>
        <span className="qbar__count">
          {index + 1} / {pool.length}
        </span>
      </div>

      <div className="panel">
        <p className="eyebrow" style={{ marginBottom: 10 }}>
          {current.prompt}
        </p>

        {current.audio ? (
          // A listening question: the sentence is played, never printed.
          <button
            className="btn btn--primary"
            onClick={() => speak(current.audio!)}
            aria-label="Play the sentence"
          >
            <Icon name="speaker" size={18} />
            Play
          </button>
        ) : (
          <p className="question">
            {questionParts.map((part, i) => (
              <span key={i}>
                {part}
                {i < questionParts.length - 1 && <span className="blank" />}
              </span>
            ))}
          </p>
        )}

        {current.hint && (
          <p className="small dim" style={{ marginTop: 8 }}>
            {current.hint}
          </p>
        )}

        {!current.audio && !current.question.includes('___') && !isMatch && (
          <div style={{ marginTop: 6 }}>
            <SpeakButton text={current.question} />
          </div>
        )}
      </div>

      {/* ---------------------------- answer area ---------------------------- */}
      {isMatch ? (
        <div className="panel">
          <p className="small muted" style={{ marginBottom: 10 }}>
            Tap an item on the left, then its match on the right.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div className="stack" style={{ gap: 8 }}>
              {(current.pairs ?? []).map((p) => {
                const picked = matchPicks[p.left];
                const correct = checked && picked === p.right;
                const wrong = checked && picked !== p.right;
                return (
                  <button
                    key={p.left}
                    disabled={checked}
                    className={`option ${activeLeft === p.left ? 'option--selected' : ''} ${
                      correct ? 'option--correct' : ''
                    } ${wrong ? 'option--wrong' : ''}`}
                    style={{ padding: '11px 12px', fontSize: '0.9rem' }}
                    onClick={() => setActiveLeft(p.left)}
                  >
                    {p.left}
                    {picked && (
                      <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.7 }}>
                        → {picked}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="stack" style={{ gap: 8 }}>
              {rightColumn.map((right) => {
                const used = Object.values(matchPicks).includes(right);
                return (
                  <button
                    key={right}
                    disabled={checked || !activeLeft}
                    className={`option ${used ? 'option--selected' : ''}`}
                    style={{ padding: '11px 12px', fontSize: '0.9rem', opacity: used ? 0.55 : 1 }}
                    onClick={() => {
                      if (!activeLeft) return;
                      setMatchPicks((prev) => {
                        const next = { ...prev };
                        for (const [k, v] of Object.entries(next)) {
                          if (v === right) delete next[k];
                        }
                        next[activeLeft] = right;
                        return next;
                      });
                      setActiveLeft(null);
                    }}
                  >
                    {right}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : isTyped ? (
        <div className="field">
          <label className="field__label" htmlFor="answer">
            Your answer
          </label>
          <input
            id="answer"
            className="input"
            value={typed}
            disabled={checked}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Type in Finnish..."
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canCheck && !checked) void handleCheck();
            }}
          />
          <p className="tiny dim">
            Capital letters and final punctuation are ignored. The letters ä and ö are not.
          </p>
        </div>
      ) : (
        <div className="stack" style={{ gap: 8 }}>
          {(current.options ?? []).map((opt, i) => {
            const isAnswer = opt === current.answer;
            const isPicked = selected === opt;
            // Nothing is revealed until the learner has committed an answer.
            const cls = !checked
              ? isPicked
                ? 'option--selected'
                : ''
              : isAnswer
                ? 'option--correct'
                : isPicked
                  ? 'option--wrong'
                  : '';
            return (
              <button
                // Keyed by position as well as text: two options can read the
                // same, and a bare text key silently drops one of them.
                key={`${i}-${opt}`}
                className={`option ${cls}`}
                disabled={checked}
                onClick={() => setSelected(opt)}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* ------------------------------ feedback ----------------------------- */}
      {checked && (
        <div className="fade-in stack" style={{ gap: 10 }}>
          <Callout kind={wasCorrect ? 'ok' : 'bad'} icon={wasCorrect ? 'check' : 'x'}>
            <b>{wasCorrect ? 'Correct.' : 'Not quite.'}</b>{' '}
            {wasCorrect && umlautSlip && (
              <>
                Mind the dots though - the spelling is <b>{current.answer}</b> In Finnish ä and
                ö are letters of their own, so tähti (a star) and tahti (a beat) are different
                words.{' '}
              </>
            )}
            {!wasCorrect && !isMatch && (
              <>
                The answer is <b>{current.answer}</b>.{' '}
              </>
            )}
            {current.explanation}
          </Callout>
          {settings.showTagalog && (
            <p className="small dim" style={{ paddingLeft: 4, lineHeight: 1.55 }}>
              {current.explanationTl}
            </p>
          )}
        </div>
      )}

      {checked ? (
        <button className="btn btn--primary btn--block" onClick={handleNext}>
          {index + 1 >= pool.length ? 'See results' : 'Next question'}
          <Icon name="chevron-right" size={18} />
        </button>
      ) : (
        <button className="btn btn--primary btn--block" disabled={!canCheck} onClick={handleCheck}>
          Check
        </button>
      )}
    </div>
  );
}
