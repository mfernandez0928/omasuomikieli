import { describe, expect, test } from 'vitest';
import { answersMatch, checkAnswer } from './search';

describe('checkAnswer', () => {
  test('accepts an exact answer with no slip', () => {
    const r = checkAnswer('Syön leipää.', 'Syön leipää.');
    expect(r).toEqual({ correct: true, umlautSlip: false });
  });

  test('accepts the a-for-ä spelling and reports the slip', () => {
    const r = checkAnswer('Syon leipaa.', 'Syön leipää.');
    expect(r).toEqual({ correct: true, umlautSlip: true });
  });

  test('accepts the o-for-ö spelling and reports the slip', () => {
    const r = checkAnswer('Han on toissa.', 'Hän on töissä.');
    expect(r).toEqual({ correct: true, umlautSlip: true });
  });

  test('reports no slip when an alsoAccept variant matches exactly', () => {
    const r = checkAnswer('minä lepään', 'lepään', ['minä lepään']);
    expect(r).toEqual({ correct: true, umlautSlip: false });
  });

  test('rejects a word that differs by more than its umlauts', () => {
    // tuuli (wind) is not a misspelling of tuli (fire).
    expect(checkAnswer('tuuli', 'tuli').correct).toBe(false);
  });

  test('rejects an empty answer', () => {
    expect(checkAnswer('   ', 'tähti').correct).toBe(false);
  });
});

describe('answersMatch', () => {
  test('still demands the umlauts, so existing callers are unchanged', () => {
    expect(answersMatch('Syon leipaa.', 'Syön leipää.')).toBe(false);
    expect(answersMatch('Syön leipää.', 'Syön leipää.')).toBe(true);
  });
});
