import { describe, expect, test } from 'vitest';
import { REPLY_PAIRS } from '@/data/replies';
import { buildChooseReply, buildListenMeaning } from './exercises';

const pairById = (id: string) => REPLY_PAIRS.find((p) => p.id === id)!;

describe('buildChooseReply', () => {
  test('every exercise has 4 distinct options including the answer', () => {
    for (const ex of buildChooseReply(REPLY_PAIRS)) {
      expect(ex.options).toHaveLength(4);
      expect(new Set(ex.options).size).toBe(4);
      expect(ex.options).toContain(ex.answer);
    }
  });

  test('distractors prefer the same category', () => {
    const [ex] = buildChooseReply([pairById('rp-01')]);
    const sameCategory = REPLY_PAIRS.filter((p) => p.num >= 2 && p.num <= 8).map((p) => p.fi.a);
    const distractors = ex.options!.filter((o) => o !== ex.answer);
    expect(distractors.every((d) => sameCategory.includes(d))).toBe(true);
  });

  test('works when only one pair is given', () => {
    const [ex] = buildChooseReply([pairById('rp-05')]);
    expect(ex.options).toHaveLength(4);
    expect(ex.question).toBe('Mitä uutta?');
    expect(ex.answer).toBe('Ei mitään erityistä. Entä sinulle?');
  });

  test('takes distractors from other categories when the pool is small', () => {
    const pool = [pairById('rp-01'), pairById('rp-02'), pairById('rp-20'), pairById('rp-60')];
    const [ex] = buildChooseReply([pool[0]], pool);
    expect(ex.options).toHaveLength(4);
    expect(new Set(ex.options).size).toBe(4);
  });
});

describe('buildListenMeaning', () => {
  test('sets audio to the reply and hides the question', () => {
    for (const ex of buildListenMeaning(REPLY_PAIRS.slice(0, 16))) {
      const pair = REPLY_PAIRS.find((p) => ex.id === `${p.id}-listen`)!;
      expect(ex.audio).toBe(pair.fi.a);
      expect(ex.question).toBe('');
      expect(ex.answer).toBe(pair.en.a);
      expect(new Set(ex.options).size).toBe(4);
    }
  });
});

test('ids are unique across both builders', () => {
  const ids = [...buildChooseReply(REPLY_PAIRS), ...buildListenMeaning(REPLY_PAIRS)].map((e) => e.id);
  expect(new Set(ids).size).toBe(160);
});

describe('a second correct reply is never offered as wrong', () => {
  test('no distractor is a reply that also fits the question', () => {
    const byReply = new Map(REPLY_PAIRS.map((p) => [p.fi.a, p.num]));
    for (const ex of buildChooseReply(REPLY_PAIRS)) {
      const pair = REPLY_PAIRS.find((p) => ex.id === `${p.id}-choose`)!;
      for (const o of ex.options!) {
        if (o === ex.answer) continue;
        expect(pair.alsoFits ?? [], `${pair.id} offers ${o}`).not.toContain(byReply.get(o));
      }
    }
  });

  test('an invitation to coffee does not offer other yeses as wrong', () => {
    const [ex] = buildChooseReply([pairById('rp-17')]);
    expect(ex.options).not.toContain(pairById('rp-18').fi.a);
    expect(ex.options).not.toContain(pairById('rp-22').fi.a);
  });
});
