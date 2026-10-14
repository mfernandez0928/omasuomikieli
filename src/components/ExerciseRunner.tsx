import { useMemo, useState } from 'react';
import { Icon } from '@/components/Icon';
import { Callout, ProgressBar, SpeakButton } from '@/components/ui';
import type { Exercise } from '@/types';
import { answersMatch } from '@/services/search/search';
import { useApp } from '@/hooks/useApp';

export interface RunScore {
  answered: number;
  correct: number;
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
}: {
  exercises: Exercise[];
  title: string;
  onFinish?: (score: RunScore) => void | Promise<void>;
}) {
  const { settings, addMistake, noteActivity } = useApp();

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

  const current = exercises[index];

  const rightColumn = useMemo(
    () => (current?.pairs ? shuffled(current.pairs.map((p) => p.right), current.id) : []),
    [current],
  );

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
  };

  const isMatch = current.kind === 'match';
  const isTyped = ['fill-blank', 'translate', 'conjugate', 'correct-sentence'].includes(current.kind);

  const canCheck = isMatch
    ? Object.keys(matchPicks).length === (current.pairs?.length ?? 0)
    : isTyped
      ? typed.trim().length > 0
      : selected !== null;

  const evaluate = (): boolean => {
    if (isMatch) {
      return (current.pairs ?? []).every((p) => matchPicks[p.left] === p.right);
    }
    if (isTyped) {
      return answersMatch(typed, current.answer, current.alsoAccept);
    }
    return selected === current.answer;
  };

  const handleCheck = async () => {
    const correct = evaluate();
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
        note: current.question,
      });
    }

    await noteActivity({ exercisesAnswered: 1, exercisesCorrect: correct ? 1 : 0 });
  };

  const handleNext = async () => {
    if (index + 1 >= exercises.length) {
      setDone(true);
      await onFinish?.({ answered: score.answered, correct: score.correct });
      return;
    }
    setIndex((i) => i + 1);
    resetQuestion();
  };

  const retryWrong = () => {
    setDone(false);
    setIndex(0);
    setScore({ answered: 0, correct: 0 });
    resetQuestion();
  };

  if (done) {
    const pct = score.answered ? Math.round((score.correct / score.answered) * 100) : 0;
    const wrongList = exercises.filter((e) => wrongIds.includes(e.id));
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
            {pct === 100
              ? 'Every answer correct. This rule is solid - the review queue will bring it back in a few days.'
              : pct >= 70
                ? 'Good result. The ones you missed are saved in My Mistakes so you can come back to them.'
                : 'Worth another pass. Re-read the rule above, then try again - the mistakes are saved for you.'}
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

        <button className="btn btn--primary btn--block" onClick={retryWrong}>
          <Icon name="refresh" size={17} />
          Try again
        </button>
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
            style={{ width: `${(index / exercises.length) * 100}%`, height: '100%' }}
          />
        </div>
        <span className="qbar__count">
          {index + 1} / {exercises.length}
        </span>
      </div>

      <div className="panel">
        <p className="eyebrow" style={{ marginBottom: 10 }}>
          {current.prompt}
        </p>

        <p className="question">
          {questionParts.map((part, i) => (
            <span key={i}>
              {part}
              {i < questionParts.length - 1 && <span className="blank" />}
            </span>
          ))}
        </p>

        {current.hint && (
          <p className="small dim" style={{ marginTop: 8 }}>
            {current.hint}
          </p>
        )}

        {!current.question.includes('___') && !isMatch && (
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
          {(current.options ?? []).map((opt) => {
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
                key={opt}
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
          {index + 1 >= exercises.length ? 'See results' : 'Next question'}
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
