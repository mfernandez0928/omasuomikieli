import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { EmptyState, LevelBadge, SpeakButton, TopBar } from '@/components/ui';
import { ExerciseRunner } from '@/components/ExerciseRunner';
import { READING_BY_ID, READING_TEXTS } from '@/data/reading';
import { getWord } from '@/data/words';
import { useApp } from '@/hooks/useApp';

export function ReadingList() {
  const navigate = useNavigate();
  return (
    <div className="page fade-in">
      <TopBar title="Reading Practice" subtitle="Real texts you meet in Finland" back={false} />
      <div className="rows">
        {READING_TEXTS.map((t) => (
          <button key={t.id} className="rowcard" onClick={() => navigate(`/reading/${t.id}`)}>
            <span className="rowcard__num" style={{ background: 'var(--c-reading)' }}>
              <Icon name="file" size={15} />
            </span>
            <span className="rowcard__body">
              <span className="rowcard__title">{t.title}</span>
              <span className="rowcard__sub">
                {t.minutes} min · {t.questions.length} questions
              </span>
            </span>
            <LevelBadge level={t.level} />
            <Icon name="chevron-right" size={17} className="rowcard__chev" />
          </button>
        ))}
      </div>
      <p className="small dim center" style={{ marginTop: 24, lineHeight: 1.6 }}>
        These passages are written for this app, not copied from a textbook.
      </p>
    </div>
  );
}

export function ReadingText() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { settings } = useApp();
  const text = READING_BY_ID.get(id);

  const [showTranslation, setShowTranslation] = useState(false);
  const [stage, setStage] = useState<'read' | 'questions'>('read');

  if (!text) {
    return (
      <div className="page">
        <TopBar title="Not found" />
        <EmptyState
          icon="file"
          title="That text does not exist"
          text="Pick one from the reading list."
          action={
            <button className="btn btn--primary" onClick={() => navigate('/reading')}>
              All texts
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <TopBar title={text.title} subtitle={`${text.level} · ${text.minutes} min`} />

      {stage === 'questions' ? (
        <>
          <div className="panel" style={{ marginBottom: 14 }}>
            <p className="eyebrow" style={{ marginBottom: 8 }}>
              The text
            </p>
            {text.body.map((p, i) => (
              <p key={i} className="small" style={{ lineHeight: 1.6, marginBottom: 6 }}>
                {p}
              </p>
            ))}
          </div>
          <ExerciseRunner exercises={text.questions} title={text.title} />
        </>
      ) : (
        <div className="stack">
          <div className="wcard" style={{ padding: 18 }}>
            {text.body.map((paragraph, i) => (
              <div key={i} className="row" style={{ gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
                <p style={{ flex: 1, lineHeight: 1.65, fontSize: '1rem' }}>{paragraph}</p>
                <SpeakButton text={paragraph} />
              </div>
            ))}
          </div>

          <button
            className="btn btn--sm btn--ghost"
            onClick={() => setShowTranslation((s) => !s)}
            aria-expanded={showTranslation}
          >
            <Icon name={showTranslation ? 'chevron-down' : 'chevron-right'} size={15} />
            {showTranslation ? 'Hide the English' : 'Show the English'}
          </button>

          {showTranslation && (
            <div className="panel panel--flat fade-in">
              {text.translation.map((p, i) => (
                <p key={i} className="small muted" style={{ lineHeight: 1.6, marginBottom: 6 }}>
                  {p}
                </p>
              ))}
            </div>
          )}

          <section className="panel">
            <p className="eyebrow" style={{ marginBottom: 10 }}>
              Words to know
            </p>
            <div className="stack" style={{ gap: 7 }}>
              {text.glossary.map((g) => {
                const linked = g.wordId ? getWord(g.wordId) : undefined;
                const content = (
                  <>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <b>{g.fi}</b>
                      <span className="small muted">
                        {' '}
                        - {g.en}
                        {settings.showTagalog && ` · ${g.tl}`}
                      </span>
                    </span>
                    {linked && <Icon name="chevron-right" size={15} className="dim" />}
                  </>
                );
                return linked ? (
                  <button
                    key={g.fi}
                    className="row"
                    style={{ width: '100%', textAlign: 'left', gap: 8 }}
                    onClick={() => navigate(`/vocabulary/${linked.id}`)}
                  >
                    {content}
                  </button>
                ) : (
                  <div key={g.fi} className="row" style={{ gap: 8 }}>
                    {content}
                  </div>
                );
              })}
            </div>
          </section>

          <button className="btn btn--primary btn--block" onClick={() => setStage('questions')}>
            Answer the questions ({text.questions.length})
            <Icon name="chevron-right" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
