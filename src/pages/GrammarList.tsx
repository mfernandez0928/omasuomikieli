import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { FilterPills, LevelBadge, TopBar } from '@/components/ui';
import { GRAMMAR_LESSONS, GRAMMAR_MODULES } from '@/data/grammar';
import { useApp } from '@/hooks/useApp';
import type { Level } from '@/types';
import { LEVELS } from '@/types';

const NUMBER_COLOURS = [
  '#f6a623',
  '#f97316',
  '#ef4756',
  '#ec4899',
  '#8b5cf6',
  '#6366f1',
  '#3b82f6',
  '#06b6d4',
  '#14b8a6',
  '#22c55e',
];

export function GrammarList() {
  const navigate = useNavigate();
  const { lessonProgress } = useApp();
  const [level, setLevel] = useState<Level | 'all'>('all');

  const progressById = useMemo(
    () => new Map(lessonProgress.map((p) => [p.grammarId, p])),
    [lessonProgress],
  );

  const sourceDerived = useMemo(
    () => GRAMMAR_LESSONS.filter((l) => l.origin === 'source-derived').length,
    [],
  );

  const visible = useMemo(
    () => (level === 'all' ? GRAMMAR_LESSONS : GRAMMAR_LESSONS.filter((l) => l.level === level)),
    [level],
  );

  return (
    <div className="page fade-in">
      <TopBar
        title="Grammar Lessons"
        subtitle={`${GRAMMAR_LESSONS.length} lessons · A1 to B1`}
        onSearch={() => navigate('/search')}
      />

      <FilterPills
        label="Filter by level"
        value={level}
        onChange={setLevel}
        options={[
          { value: 'all' as const, label: 'All levels' },
          ...LEVELS.map((l) => ({ value: l, label: l })),
        ]}
      />

      {GRAMMAR_MODULES.map((mod) => {
        const lessons = visible.filter((l) => l.moduleId === mod.id);
        if (!lessons.length) return null;

        return (
          <section className="section" key={mod.id}>
            <div className="section__head">
              <h2 className="eyebrow">{mod.label}</h2>
              <span className="small dim">{lessons.length} lessons</span>
            </div>

            <div className="rows">
              {lessons.map((lesson) => {
                const progress = progressById.get(lesson.id);
                const colour = NUMBER_COLOURS[(lesson.order - 1) % NUMBER_COLOURS.length];
                return (
                  <button
                    key={lesson.id}
                    className="rowcard"
                    onClick={() => navigate(`/grammar/${lesson.id}`)}
                  >
                    <span className="rowcard__num" style={{ background: colour }}>
                      {progress?.completed ? <Icon name="check" size={14} /> : lesson.order}
                    </span>
                    <span className="rowcard__body">
                      <span className="rowcard__title">{lesson.title}</span>
                      <span className="rowcard__sub">{lesson.subtitle}</span>
                    </span>
                    {progress && !progress.completed && progress.percent > 0 && (
                      <span className="badge badge--gold">{Math.round(progress.percent)}%</span>
                    )}
                    <LevelBadge level={lesson.level} />
                    <Icon name="chevron-right" size={17} className="rowcard__chev" />
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      <p className="small dim center" style={{ marginTop: 26, lineHeight: 1.6 }}>
        {sourceDerived} of {GRAMMAR_LESSONS.length} lessons take their rule and terminology from
        Oma suomi 1, Suomen mestari 2 or Suomen mestari 3, and cite the chapter. The other{' '}
        {GRAMMAR_LESSONS.length - sourceDerived} are marked as additional content. Examples and
        exercises are written for this app throughout.
      </p>
    </div>
  );
}
