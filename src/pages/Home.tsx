import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '@/components/Icon';
import { HeroArt } from '@/components/HeroArt';
import { ProgressBar, StorageWarning } from '@/components/ui';
import { useApp, useDailyProgress } from '@/hooks/useApp';
import { lastSevenDays } from '@/services/storage/progress';
import { todayKey } from '@/services/storage/prefs';
import { loadResume } from '@/services/storage/prefs';
import { BRAND } from '@/data/brand';
import { TOPICS } from '@/data/topics';
import { GRAMMAR_LESSONS } from '@/data/grammar';
import { dueCount } from '@/services/srs/scheduler';

const TILES: {
  to: string;
  title: string;
  sub: string;
  icon: IconName;
  bg: string;
  light?: boolean;
}[] = [
  {
    to: '/grammar',
    title: 'Grammar Lessons',
    sub: 'Clear rules, examples and practice',
    icon: 'book',
    bg: 'var(--c-grammar)',
  },
  {
    to: '/vocabulary',
    title: 'Vocabulary',
    sub: 'Finnish - English - Tagalog',
    icon: 'cards',
    bg: 'var(--c-vocab)',
    light: true,
  },
  {
    to: '/situations',
    title: 'Situations',
    sub: 'Role-play a real conversation',
    icon: 'chat',
    bg: 'var(--c-phrases)',
    light: true,
  },
  {
    to: '/phrases',
    title: 'Useful Phrases',
    sub: 'Everyday situations',
    icon: 'hand',
    bg: '#0ea5e9',
    light: true,
  },
  {
    to: '/listening',
    title: 'Listening Practice',
    sub: 'Real-life Finnish',
    icon: 'headphones',
    bg: 'var(--c-listening)',
    light: true,
  },
  {
    to: '/reading',
    title: 'Reading Practice',
    sub: 'Texts and exercises',
    icon: 'file',
    bg: 'var(--c-reading)',
    light: true,
  },
  {
    to: '/mistakes',
    title: 'My Mistakes',
    sub: 'Review and improve',
    icon: 'pencil',
    bg: 'var(--c-mistakes)',
    light: true,
  },
];

/*
  The week strip shows the last seven days ENDING TODAY, so a fixed Mon..Sun
  array mislabels every column unless today happens to be Sunday. Each dot is
  now labelled from its own date instead.
*/
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function dayLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return WEEKDAY[new Date(y, m - 1, d).getDay()];
}

export function Home() {
  const navigate = useNavigate();
  const { activity, cards, loadState, streak, lessonProgress, profile } = useApp();
  const { done, goal, percent } = useDailyProgress();

  const week = lastSevenDays(activity);
  const today = todayKey();
  const due = dueCount(cards);
  const resume = loadResume();

  const remaining = Math.max(0, goal - done);
  const exercisesToday = week.find((d) => d.date === today)?.exercisesAnswered ?? 0;

  return (
    <div className="page fade-in">
      <section className="hero">
        <HeroArt />
        <div className="hero__actions">
          <button className="icon-btn" onClick={() => navigate('/search')} aria-label="Search">
            <Icon name="search" size={19} />
          </button>
          <button className="icon-btn" onClick={() => navigate('/settings')} aria-label="Settings">
            <Icon name="settings" size={19} />
          </button>
        </div>
        {profile && <p className="hero__greeting">Moi, {profile.firstName}!</p>}
        <h1 className="hero__title">
          Oma
          <span>Suomi</span>
        </h1>
        <p className="hero__sub">Learn Finnish. Every Day.</p>
        <p className="hero__mark">{BRAND}</p>
      </section>

      {loadState === 'unavailable' && <StorageWarning />}

      {/* ----------------------------- daily goal ----------------------------- */}
      <section className="panel" style={{ marginTop: 14 }}>
        <div className="goal">
          <span className="goal__flame">
            <Icon name="flame" size={24} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row row--between">
              <div>
                <p className="goal__title">Daily Goal</p>
                <p className="goal__hint">
                  {remaining === 0
                    ? 'Goal reached today. Nice work!'
                    : `Keep going! ${remaining} more ${remaining === 1 ? 'word' : 'words'} today.`}
                </p>
                {/*
                  The goal counts reviewed words only. Exercises are real work
                  too, so they are shown rather than silently ignored - that
                  mismatch is what made the strip look wrong.
                */}
                {exercisesToday > 0 && (
                  <p className="tiny dim" style={{ marginTop: 2 }}>
                    {exercisesToday} {exercisesToday === 1 ? 'exercise' : 'exercises'} answered today
                  </p>
                )}
              </div>
              <p className="goal__count">
                {done} <small>/ {goal}</small>
              </p>
            </div>
            <div style={{ marginTop: 10 }}>
              <ProgressBar percent={percent} />
            </div>
          </div>
        </div>

        <div className="week">
          {week.map((day) => {
            /*
              A tick used to mean "did anything today", while the counter above
              only tracks words reviewed. Answering a grammar exercise therefore
              ticked the day while the goal still read 0 / 10. The tick now means
              the goal was actually reached; partial study gets its own state.
            */
            const goalMet = day.wordsStudied >= goal;
            const studied = day.wordsStudied > 0 || day.exercisesAnswered > 0;
            const isToday = day.date === today;
            return (
              <div key={day.date} className="week__day">
                <span style={isToday ? { color: 'var(--gold)', fontWeight: 700 } : undefined}>
                  {dayLabel(day.date)}
                </span>
                <span
                  className={`week__dot ${goalMet ? 'week__dot--done' : ''} ${
                    !goalMet && studied ? 'week__dot--partial' : ''
                  } ${isToday && !studied ? 'week__dot--today' : ''}`}
                  title={`${day.date}: ${day.wordsStudied} of ${goal} words, ${day.exercisesAnswered} exercises`}
                >
                  {goalMet ? (
                    <Icon name="check" size={14} />
                  ) : studied ? (
                    <Icon name="flame" size={12} />
                  ) : null}
                </span>
              </div>
            );
          })}
        </div>

        {streak.current > 1 && (
          <p className="small muted" style={{ marginTop: 12 }}>
            <b style={{ color: 'var(--gold)' }}>{streak.current}-day streak</b> · best {streak.best}
          </p>
        )}
      </section>

      {/* ------------------------------- tiles -------------------------------- */}
      <section className="section">
        <div className="tiles">
          {TILES.map((tile) => (
            <button
              key={tile.to}
              className={`tile ${tile.light ? 'tile--light' : ''}`}
              style={{ background: tile.bg }}
              onClick={() => navigate(tile.to)}
            >
              <span className="tile__icon">
                <Icon name={tile.icon} size={20} />
              </span>
              <span className="tile__chev">
                <Icon name="chevron-right" size={18} />
              </span>
              <span className="tile__title">{tile.title}</span>
              <span className="tile__sub">{tile.sub}</span>
            </button>
          ))}
        </div>
      </section>

      {/* --------------------------- review reminder --------------------------- */}
      {due > 0 && (
        <button
          className="panel row"
          style={{ marginTop: 14, width: '100%', textAlign: 'left', gap: 14 }}
          onClick={() => navigate('/practice/review')}
        >
          <span className="goal__flame" style={{ background: 'rgba(56,189,248,0.16)', color: 'var(--info)' }}>
            <Icon name="target" size={22} />
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontWeight: 700 }}>
              {due} {due === 1 ? 'card' : 'cards'} due for review
            </span>
            <span className="small muted">Spaced repetition keeps them from slipping away.</span>
          </span>
          <Icon name="chevron-right" size={18} className="dim" />
        </button>
      )}

      {/* --------------------------- continue learning -------------------------- */}
      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Continue Learning</h2>
          <button className="section__link" onClick={() => navigate('/grammar')}>
            See all
          </button>
        </div>

        <div className="rows">
          {resume.length === 0 ? (
            <ContinueSuggestion />
          ) : (
            resume.slice(0, 2).map((item) => {
              const isGrammar = item.kind === 'grammar';
              const progress =
                isGrammar
                  ? lessonProgress.find((p) => p.grammarId === item.refId)?.percent ?? item.percent
                  : item.percent;
              return (
                <button
                  key={`${item.kind}-${item.refId}`}
                  className="continue"
                  onClick={() =>
                    navigate(isGrammar ? `/grammar/${item.refId}` : `/vocabulary/${item.refId}`)
                  }
                >
                  <span
                    className="continue__badge"
                    style={{
                      background: isGrammar ? 'rgba(246,185,59,0.16)' : 'rgba(59,130,246,0.16)',
                      color: isGrammar ? 'var(--c-grammar)' : 'var(--c-vocab)',
                    }}
                  >
                    {isGrammar ? 'Grammar' : 'Vocabulary'}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="continue__title">{item.title}</span>
                    <span className="continue__sub">{item.subtitle}</span>
                    <ProgressBar percent={progress} />
                  </span>
                  <span className="continue__pct">{Math.round(progress)}%</span>
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* ------------------------------- topics -------------------------------- */}
      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Popular Topics</h2>
          <button className="section__link" onClick={() => navigate('/vocabulary')}>
            See all
          </button>
        </div>
        <div className="topics">
          {TOPICS.slice(0, 10).map((topic) => (
            <button
              key={topic.id}
              className="topic"
              onClick={() => navigate(`/vocabulary?topic=${topic.id}`)}
            >
              <span style={{ color: topic.color }}>
                <Icon name={topic.icon as IconName} size={24} />
              </span>
              <span>
                <span className="topic__fi" style={{ display: 'block' }}>
                  {topic.titleFi}
                </span>
                <span className="topic__en">{topic.titleEn}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Shown before the learner has started anything: points at lesson one. */
function ContinueSuggestion() {
  const navigate = useNavigate();
  const first = GRAMMAR_LESSONS[0];
  return (
    <button className="continue" onClick={() => navigate(`/grammar/${first.id}`)}>
      <span
        className="continue__badge"
        style={{ background: 'rgba(246,185,59,0.16)', color: 'var(--c-grammar)' }}
      >
        Start
        <b>1</b>
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="continue__title">{first.title}</span>
        <span className="continue__sub">{first.subtitle} · {first.minutes} min</span>
        <ProgressBar percent={0} />
      </span>
      <span className="continue__pct">Begin</span>
    </button>
  );
}
