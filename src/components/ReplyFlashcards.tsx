import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { RevealTranslation, SpeakButton } from '@/components/ui';
import { useApp } from '@/hooks/useApp';
import type { ReplyPair } from '@/types';

/**
 * Reveal-and-grade cards for reply pairs.
 *
 * `fi-first` shows the Finnish pair and hides its meaning; `meaning-first`
 * shows the English (and Tagalog) and hides the Finnish reply. Either way the
 * learner answers in their head, reveals, and says honestly whether they knew
 * it. A "Not yet" card comes round once more at the end of the run.
 */
export function ReplyFlashcards({
  pairs,
  direction,
  onDone,
}: {
  pairs: ReplyPair[];
  direction: 'fi-first' | 'meaning-first';
  onDone: (score: { knew: number; total: number }) => void;
}) {
  const { settings, noteActivity } = useApp();
  const [queue, setQueue] = useState<ReplyPair[]>(pairs);
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [knew, setKnew] = useState(0);
  const [requeued, setRequeued] = useState<Set<string>>(new Set());

  const pair = queue[pos];

  const grade = (gotIt: boolean) => {
    void noteActivity({ exercisesAnswered: 1, exercisesCorrect: gotIt ? 1 : 0 });
    let next = queue;
    if (gotIt) {
      // Only a first-time "knew it" counts towards the score.
      if (!requeued.has(pair.id)) setKnew((k) => k + 1);
    } else if (!requeued.has(pair.id)) {
      next = [...queue, pair];
      setQueue(next);
      setRequeued(new Set(requeued).add(pair.id));
    }
    if (pos + 1 >= next.length) {
      onDone({ knew: knew + (gotIt && !requeued.has(pair.id) ? 1 : 0), total: pairs.length });
      return;
    }
    setPos(pos + 1);
    setRevealed(false);
  };

  return (
    <div className="stack fade-in">
      <div className="qbar">
        <div className="qbar__progress">
          <div
            className="progress__fill"
            style={{ width: `${(pos / queue.length) * 100}%`, height: '100%' }}
          />
        </div>
        <span className="qbar__count">
          {pos + 1} / {queue.length}
        </span>
      </div>

      <div className="wcard" style={{ padding: 20, minHeight: 200 }} key={`${pair.id}-${pos}`}>
        {direction === 'fi-first' ? (
          <>
            <FinnishLine text={pair.fi.q} strong />
            <FinnishLine text={pair.fi.a} reply />
            <RevealTranslation>
              <Meaning pair={pair} showTagalog={settings.showTagalog} />
            </RevealTranslation>
          </>
        ) : (
          <>
            <Meaning pair={pair} showTagalog={settings.showTagalog} />
            <p className="small muted" style={{ marginTop: 14 }}>
              How would you reply in Finnish?
            </p>
            {revealed ? (
              <div className="fade-in" style={{ marginTop: 10 }}>
                <FinnishLine text={pair.fi.q} strong />
                <FinnishLine text={pair.fi.a} reply />
              </div>
            ) : (
              <button
                className="btn btn--ghost btn--block"
                style={{ marginTop: 12 }}
                onClick={() => setRevealed(true)}
              >
                Show answer
              </button>
            )}
          </>
        )}
      </div>

      {(direction === 'fi-first' || revealed) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button className="btn btn--ghost" onClick={() => grade(false)}>
            <Icon name="refresh" size={16} />
            Not yet
          </button>
          <button className="btn btn--primary" onClick={() => grade(true)}>
            <Icon name="check" size={16} />
            Knew it
          </button>
        </div>
      )}
    </div>
  );
}

function FinnishLine({ text, strong, reply }: { text: string; strong?: boolean; reply?: boolean }) {
  return (
    <div className="row" style={{ gap: 8, alignItems: 'flex-start', marginTop: reply ? 8 : 0 }}>
      <p
        style={{
          flex: 1,
          lineHeight: 1.4,
          fontSize: strong ? '1.1rem' : '1rem',
          fontWeight: strong ? 700 : 650,
          color: reply ? '#047857' : undefined,
        }}
      >
        {reply && <span aria-hidden="true">- </span>}
        {text}
      </p>
      <SpeakButton text={text} />
    </div>
  );
}

function Meaning({ pair, showTagalog }: { pair: ReplyPair; showTagalog: boolean }) {
  return (
    <>
      <p className="wcard__gloss">
        {pair.en.q} — {pair.en.a}
      </p>
      {showTagalog && (
        <p className="wcard__gloss" style={{ marginTop: 4 }}>
          <b>
            {pair.tl.q} — {pair.tl.a}
          </b>
        </p>
      )}
    </>
  );
}
