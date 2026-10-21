import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon, type IconName } from '@/components/Icon';
import { Callout, EmptyState, LevelBadge, SpeakButton, TopBar, useGlossVisibility } from '@/components/ui';
import { SCENES, getScene, splitLine } from '@/data/situations';
import { GRAMMAR_BY_ID } from '@/data/grammar';
import { getWord } from '@/data/words';
import { useApp } from '@/hooks/useApp';
import type { RolePlay, RolePlayLine, RolePlayOption, SceneGloss } from '@/types';

/* ------------------------------------------------------------------ */
/* List                                                                */
/* ------------------------------------------------------------------ */

const REGISTER_LABEL: Record<RolePlay['register'], string> = {
  puhekieli: 'spoken',
  yleiskieli: 'standard',
  mixed: 'mixed',
};

export function SituationsList() {
  const navigate = useNavigate();

  return (
    <div className="page fade-in">
      <TopBar
        title="Situations"
        subtitle={`${SCENES.length} role-plays · Tilanteet`}
        back={false}
      />

      <Callout kind="info">
        You choose what to say and the other person answers. The dialogue is{' '}
        <b>scripted</b>, so a scene follows the same path each time you play it. The language is
        sourced: every word traces to a dictionary entry, and the spoken forms come from Suomen
        mestari 2, s. 293-296.
      </Callout>

      <div className="rows" style={{ marginTop: 16 }}>
        {SCENES.map((s) => (
          <button key={s.id} className="rowcard" onClick={() => navigate(`/situations/${s.id}`)}>
            <span className="rowcard__num" style={{ background: s.colour }}>
              <Icon name={s.icon as IconName} size={15} />
            </span>
            <span className="rowcard__body">
              <span className="rowcard__title">{s.titleFi}</span>
              <span className="rowcard__sub">
                {s.title} · {s.goals.length} goals · {REGISTER_LABEL[s.register]}
              </span>
            </span>
            <LevelBadge level={s.level} />
            <Icon name="chevron-right" size={17} className="rowcard__chev" />
          </button>
        ))}
      </div>

      <p className="tiny dim" style={{ marginTop: 22, lineHeight: 1.7 }}>
        <code>npm run validate:situations</code> checks every line and fails on a word that is
        neither traced to a dictionary entry nor explained in the lexicon.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* One scene                                                           */
/* ------------------------------------------------------------------ */

interface Said {
  who: 'partner' | 'you';
  line: RolePlayLine;
}

export function SituationPlay() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const scene = getScene(id);

  if (!scene) {
    return (
      <div className="page">
        <TopBar title="Not found" />
        <EmptyState
          icon="alert"
          title="That situation does not exist"
          text="Pick one from the list."
          action={
            <button className="btn btn--primary" onClick={() => navigate('/situations')}>
              All situations
            </button>
          }
        />
      </div>
    );
  }

  return <SceneRunner key={scene.id} scene={scene} />;
}

function SceneRunner({ scene }: { scene: RolePlay }) {
  const navigate = useNavigate();
  const { settings, addMistake, noteActivity } = useApp();
  const { showEn, showTl } = useGlossVisibility();

  const [turnIndex, setTurnIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [metGoals, setMetGoals] = useState<Set<string>>(new Set());
  const [firstTry, setFirstTry] = useState({ right: 0, total: 0 });
  const [attempted, setAttempted] = useState(false);
  const [gloss, setGloss] = useState<SceneGloss | null>(null);

  // Lines spoken so far, rendered above the current turn.
  const [transcript, setTranscript] = useState<Said[]>(() =>
    scene.turns[0]?.partner ? [{ who: 'partner', line: scene.turns[0].partner }] : [],
  );

  const turn = scene.turns[turnIndex];
  const picked = chosen === null ? null : turn.options[chosen];

  const choose = async (index: number) => {
    if (picked?.ok) return;
    const option = turn.options[index];
    setChosen(index);

    // Only the first attempt on a turn is scored, so re-answering after reading
    // the explanation does not count the same mistake twice.
    if (!attempted) {
      setAttempted(true);
      setFirstTry((s) => ({ right: s.right + (option.ok ? 1 : 0), total: s.total + 1 }));
      await noteActivity({ exercisesAnswered: 1, exercisesCorrect: option.ok ? 1 : 0 });
      if (!option.ok) {
        const right = turn.options.find((o) => o.ok);
        await addMistake({
          wrong: option.fi,
          right: right?.fi ?? '',
          origin: 'practice',
          note: `${scene.titleFi}: ${turn.task}`,
        });
      }
    }

    if (option.ok) {
      setTranscript((t) => [...t, { who: 'you', line: option }]);
      if (turn.completes) setMetGoals((g) => new Set(g).add(turn.completes!));
    }
  };

  const next = () => {
    const following = scene.turns[turnIndex + 1];
    if (!following) {
      setDone(true);
      return;
    }
    if (following.partner) {
      setTranscript((t) => [...t, { who: 'partner', line: following.partner! }]);
    }
    setTurnIndex(turnIndex + 1);
    setChosen(null);
    setAttempted(false);
  };

  const restart = () => {
    setTurnIndex(0);
    setChosen(null);
    setAttempted(false);
    setDone(false);
    setMetGoals(new Set());
    setFirstTry({ right: 0, total: 0 });
    setTranscript(scene.turns[0]?.partner ? [{ who: 'partner', line: scene.turns[0].partner }] : []);
  };

  return (
    <div className="page fade-in">
      <TopBar title={scene.titleFi} subtitle={scene.title} />

      {/* ------------------------------ the scene ----------------------------- */}
      <div className="panel panel--tight">
        <p className="eyebrow">You are talking to</p>
        <p style={{ fontWeight: 650 }}>{scene.partnerName}</p>
        <p className="small" style={{ color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.55 }}>
          {scene.setting}
        </p>
        {settings.showTagalog && (
          <p className="small" style={{ color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.55 }}>
            <b>{scene.settingTl}</b>
          </p>
        )}
        <div className="chips" style={{ marginTop: 10 }}>
          <span className="badge badge--light">{REGISTER_LABEL[scene.register]} Finnish</span>
          <LevelBadge level={scene.level} />
        </div>
        <p className="tiny dim" style={{ marginTop: 8, lineHeight: 1.6 }}>
          {scene.registerNote}
        </p>
      </div>

      {/* -------------------------------- goals ------------------------------- */}
      <div className="section">
        <div className="section__head">
          <h2 className="section__title">Your goals</h2>
          <span className="small dim">
            {metGoals.size}/{scene.goals.length}
          </span>
        </div>
        <ul className="goals">
          {scene.goals.map((g) => {
            const met = metGoals.has(g.id);
            return (
              <li key={g.id} className={`goals__item ${met ? 'goals__item--met' : ''}`}>
                <span className="goals__tick">
                  {met ? <Icon name="check" size={12} /> : <span className="goals__dot" />}
                </span>
                <span>
                  {showEn && g.en}
                  {showTl && (
                    <span className="small dim" style={{ display: 'block' }}>
                      {g.tl}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ----------------------------- conversation --------------------------- */}
      <div className="chat">
        {transcript.map((said, i) => (
          <Bubble key={i} who={said.who} line={said.line} onWord={setGloss} />
        ))}
        {done && scene.closing && (
          <Bubble who="partner" line={scene.closing} onWord={setGloss} />
        )}
      </div>

      {/* --------------------------- your turn / result ----------------------- */}
      {!done ? (
        <div className="panel" style={{ marginTop: 14 }}>
          <p className="eyebrow">Your turn</p>
          <p style={{ fontWeight: 650, lineHeight: 1.45 }}>{turn.task}</p>
          {settings.showTagalog && (
            <p className="small" style={{ color: 'var(--ink-soft)', marginTop: 3 }}>
              {turn.taskTl}
            </p>
          )}

          <div className="stack" style={{ gap: 8, marginTop: 12 }}>
            {turn.options.map((o, i) => (
              <OptionButton
                key={i}
                option={o}
                state={chosen === null ? 'idle' : i === chosen ? (o.ok ? 'right' : 'wrong') : picked?.ok && o.ok ? 'right' : 'idle'}
                disabled={Boolean(picked?.ok)}
                onClick={() => choose(i)}
              />
            ))}
          </div>

          {picked && (
            <div className={`callout callout--${picked.ok ? 'ok' : 'bad'}`} style={{ marginTop: 12 }}>
              <span className="callout__icon">
                <Icon name={picked.ok ? 'check' : 'x'} size={14} />
              </span>
              <span>
                {picked.why}
                {settings.showTagalog && (
                  <span style={{ display: 'block', marginTop: 4 }}>
                    <b>{picked.whyTl}</b>
                  </span>
                )}
              </span>
            </div>
          )}

          {picked?.ok && (
            <button className="btn btn--primary btn--block" style={{ marginTop: 12 }} onClick={next}>
              {turnIndex + 1 >= scene.turns.length ? 'Finish' : 'Continue'}
            </button>
          )}
          {picked && !picked.ok && (
            <p className="small dim center" style={{ marginTop: 10 }}>
              Read the note, then pick again.
            </p>
          )}
        </div>
      ) : (
        <Finished
          scene={scene}
          metGoals={metGoals}
          firstTry={firstTry}
          onRestart={restart}
          onLeave={() => navigate('/situations')}
        />
      )}

      {gloss && <GlossCard gloss={gloss} onClose={() => setGloss(null)} />}
    </div>
  );
}

/* ------------------------------- bubbles -------------------------------- */

function Bubble({
  who,
  line,
  onWord,
}: {
  who: 'partner' | 'you';
  line: RolePlayLine;
  onWord: (g: SceneGloss) => void;
}) {
  const { showEn, showTl } = useGlossVisibility(Boolean(line.tl));
  const [open, setOpen] = useState(false);
  const pieces = splitLine(line.fi);

  return (
    <div className={`chat__row chat__row--${who}`}>
      <div className={`bubble bubble--${who}`}>
        <p className="bubble__fi">
          {pieces.map((p, i) =>
            p.gloss ? (
              <button key={i} className="w" onClick={() => onWord(p.gloss!)}>
                {p.text}
              </button>
            ) : (
              <span key={i}>{p.text}</span>
            ),
          )}
        </p>
        <div className="row" style={{ gap: 6, marginTop: 4, alignItems: 'center' }}>
          <button
            className="bubble__toggle"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            {open ? 'Hide' : 'Translate'}
          </button>
          <SpeakButton text={line.fi} />
        </div>
        {open && (
          <div className="fade-in" style={{ marginTop: 6 }}>
            {showEn && <p className="small">{line.en}</p>}
            {showTl && (
              <p className="small">
                <b>{line.tl}</b>
              </p>
            )}
            {line.yleiskieli && (
              <p className="tiny dim" style={{ marginTop: 5, lineHeight: 1.5 }}>
                yleiskieli: {line.yleiskieli}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OptionButton({
  option,
  state,
  disabled,
  onClick,
}: {
  option: RolePlayOption;
  state: 'idle' | 'right' | 'wrong';
  disabled: boolean;
  onClick: () => void;
}) {
  const cls =
    state === 'right' ? 'option option--correct' : state === 'wrong' ? 'option option--wrong' : 'option';
  return (
    <button className={cls} onClick={onClick} disabled={disabled} style={{ textAlign: 'left' }}>
      <span style={{ fontWeight: 600, lineHeight: 1.45 }}>{option.fi}</span>
      <span className="small" style={{ display: 'block', marginTop: 3 }}>
        {option.en}
      </span>
    </button>
  );
}

/* -------------------------------- gloss --------------------------------- */

function GlossCard({ gloss, onClose }: { gloss: SceneGloss; onClose: () => void }) {
  const navigate = useNavigate();
  const word = gloss.wordId ? getWord(gloss.wordId) : undefined;

  return (
    <div className="glossbar fade-in" role="dialog" aria-label={`About ${gloss.form}`}>
      <div className="row row--between" style={{ alignItems: 'flex-start', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 700 }}>
            {gloss.form}
            {gloss.lemma !== gloss.form && gloss.lemma !== '-' && (
              <span className="small dim"> · {gloss.lemma}</span>
            )}
          </p>
          <p className="small">{gloss.en}</p>
          {gloss.grammar && (
            <p className="tiny dim" style={{ marginTop: 3, lineHeight: 1.5 }}>
              {gloss.grammar}
            </p>
          )}
          {!gloss.wordId && gloss.basis && (
            <p className="tiny dim" style={{ marginTop: 3, lineHeight: 1.5 }}>
              {gloss.basis}
            </p>
          )}
        </div>
        <button className="icon-btn icon-btn--plain" onClick={onClose} aria-label="Close">
          <Icon name="x" size={16} />
        </button>
      </div>
      {word && (
        <button
          className="btn btn--ghost btn--sm"
          style={{ marginTop: 8 }}
          onClick={() => navigate(`/vocabulary/${word.id}`)}
        >
          Open {word.fi} in the dictionary
        </button>
      )}
    </div>
  );
}

/* -------------------------------- result -------------------------------- */

function Finished({
  scene,
  metGoals,
  firstTry,
  onRestart,
  onLeave,
}: {
  scene: RolePlay;
  metGoals: Set<string>;
  firstTry: { right: number; total: number };
  onRestart: () => void;
  onLeave: () => void;
}) {
  const navigate = useNavigate();
  const words = useMemo(
    () => scene.vocabulary.map(getWord).filter((w): w is NonNullable<typeof w> => Boolean(w)),
    [scene.vocabulary],
  );
  const grammar = useMemo(
    () =>
      (scene.grammarRefs ?? [])
        .map((g) => GRAMMAR_BY_ID.get(g))
        .filter((g): g is NonNullable<typeof g> => Boolean(g)),
    [scene.grammarRefs],
  );

  const clean = firstTry.total > 0 && firstTry.right === firstTry.total;

  return (
    <div className="panel" style={{ marginTop: 14 }}>
      <p className="eyebrow">Scene finished</p>
      <p style={{ fontWeight: 700, fontSize: '1.08rem' }}>
        {metGoals.size}/{scene.goals.length} goals · {firstTry.right}/{firstTry.total} right first
        time
      </p>
      <p className="small" style={{ color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.55 }}>
        {clean
          ? 'Every reply right on the first try. Come back to this scene in a week.'
          : 'The replies you got wrong are in My Mistakes, with the correct version beside them.'}
      </p>

      {words.length > 0 && (
        <>
          <p className="eyebrow" style={{ marginTop: 16 }}>
            Words from this scene
          </p>
          <div className="chips">
            {words.map((w) => (
              <button
                key={w.id}
                className="chip chip--light"
                onClick={() => navigate(`/vocabulary/${w.id}`)}
              >
                {w.fi}
              </button>
            ))}
          </div>
        </>
      )}

      {grammar.length > 0 && (
        <>
          <p className="eyebrow" style={{ marginTop: 16 }}>
            Grammar behind it
          </p>
          <div className="chips">
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
        </>
      )}

      <div className="stack" style={{ gap: 8, marginTop: 18 }}>
        <button className="btn btn--primary btn--block" onClick={onRestart}>
          Play again
        </button>
        <button className="btn btn--ghost btn--block" onClick={onLeave}>
          Other situations
        </button>
      </div>
    </div>
  );
}
