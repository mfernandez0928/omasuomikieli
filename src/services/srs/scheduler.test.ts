import { describe, expect, test } from 'vitest';
import { applyGrade, buildQueue, createCard, sessionSize } from './scheduler';
import type { SrsCard } from '@/types';

const NOW = Date.parse('2026-10-24T09:00:00Z');
const DAY_MS = 24 * 60 * 60 * 1000;

const candidates = Array.from({ length: 200 }, (_, i) => ({
  kind: 'word' as const,
  refId: `w${i}`,
}));

/** Answers every card in the queue, the way a session does. */
function answerAll(deck: SrsCard[], queue: SrsCard[], grade: 'good', now: number): SrsCard[] {
  let next = deck;
  for (const card of queue) {
    next = applyGrade(next, card, grade, now).cards;
  }
  return next;
}

describe('applyGrade', () => {
  test('grades the deck version of a card, not a stale copy of it', () => {
    const fresh = createCard('word', 'kissa', NOW);
    const afterAgain = applyGrade([fresh], fresh, 'again', NOW);

    // The session still holds the pre-grading object - this is what
    // Practice.tsx used to push back into its queue.
    const stale = fresh;
    const afterGood = applyGrade(afterAgain.cards, stale, 'good', NOW);

    expect(afterGood.card.lapses).toBe(1);
    expect(afterGood.card.reps).toBe(2);
    expect(afterGood.card.ease).toBeLessThan(fresh.ease);
  });

  test('adds a card the deck has never seen', () => {
    const fresh = createCard('word', 'koira', NOW);
    const result = applyGrade([], fresh, 'good', NOW);

    expect(result.cards).toHaveLength(1);
    expect(result.cards[0].reps).toBe(1);
  });
});

describe('buildQueue new-card allowance', () => {
  test('introduces at most newPerDay cards across repeated visits in one day', () => {
    let deck: SrsCard[] = [];

    for (let visit = 0; visit < 4; visit += 1) {
      const queue = buildQueue(deck, candidates, 5, NOW);
      deck = answerAll(deck, queue, 'good', NOW);
    }

    expect(deck).toHaveLength(5);
  });

  test('allows a fresh allowance the next day', () => {
    let deck: SrsCard[] = [];

    deck = answerAll(deck, buildQueue(deck, candidates, 5, NOW), 'good', NOW);
    const tomorrow = NOW + DAY_MS;
    deck = answerAll(deck, buildQueue(deck, candidates, 5, tomorrow), 'good', tomorrow);

    expect(deck).toHaveLength(10);
  });

  test('counts a card introduced but left unanswered against the day', () => {
    const deck = buildQueue([], candidates, 5, NOW);
    // The learner walked away without answering any of them.
    const second = buildQueue(deck, candidates, 5, NOW);
    const brandNew = second.filter((c) => !deck.some((d) => d.id === c.id));

    expect(brandNew).toHaveLength(0);
  });
});

describe('sessionSize', () => {
  test('counts the new cards a first session would introduce', () => {
    expect(sessionSize([], candidates, 5, NOW)).toBe(5);
  });

  test('counts due reviews as well', () => {
    const deck = answerAll([], buildQueue([], candidates, 3, NOW), 'good', NOW);
    const tomorrow = NOW + DAY_MS;

    // 3 cards fall due tomorrow, plus tomorrow's 3 new ones.
    expect(sessionSize(deck, candidates, 3, tomorrow)).toBe(6);
  });
});
