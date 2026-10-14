import type { Exercise, GrammarLesson, GrammarModule } from '@/types';
import { A1_CORE } from './a1-core';
import { A1_CASES } from './a1-cases';
import { A2_LESSONS } from './a2';
import { B1_LESSONS } from './b1';

export const GRAMMAR_MODULES: GrammarModule[] = [
  {
    id: 'm-basic',
    title: 'Basic grammar',
    label: 'BASIC GRAMMAR (A1)',
    levels: ['A1'],
  },
  {
    id: 'm-more',
    title: 'More grammar',
    label: 'MORE GRAMMAR (A2)',
    levels: ['A2.1', 'A2.2'],
  },
  {
    // The readable sources stop at A2.2, so nothing here is evidenced as B1.
    // This module holds topics judged to be beyond them.
    id: 'm-b1',
    title: 'Towards B1',
    label: 'TOWARDS B1 & YKI (beyond the available sources)',
    levels: ['B1'],
  },
];

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  ...A1_CORE,
  ...A1_CASES,
  ...A2_LESSONS,
  ...B1_LESSONS,
].sort((a, b) => a.order - b.order);

export const GRAMMAR_BY_ID = new Map(GRAMMAR_LESSONS.map((l) => [l.id, l]));

export function getLesson(id: string): GrammarLesson | undefined {
  return GRAMMAR_BY_ID.get(id);
}

export function lessonsInModule(moduleId: string): GrammarLesson[] {
  return GRAMMAR_LESSONS.filter((l) => l.moduleId === moduleId);
}

/** Every exercise in the curriculum, for the general practice pool. */
export const ALL_EXERCISES: Exercise[] = GRAMMAR_LESSONS.flatMap((l) => l.exercises);

export const EXERCISE_BY_ID = new Map(ALL_EXERCISES.map((e) => [e.id, e]));

export function exercisesForGrammar(grammarId: string): Exercise[] {
  return getLesson(grammarId)?.exercises ?? [];
}

export { A1_CORE, A1_CASES, A2_LESSONS, B1_LESSONS };
