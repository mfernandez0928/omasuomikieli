import { describe, expect, test } from 'vitest';
import { REPLY_CATEGORIES, REPLY_PAIRS } from './index';

const byId = (id: string) => REPLY_PAIRS.find((p) => p.id === id)!;

describe('reply pairs', () => {
  test('has exactly 80 pairs numbered 1 to 80', () => {
    expect(REPLY_PAIRS.map((p) => p.num)).toEqual(Array.from({ length: 80 }, (_, i) => i + 1));
  });

  test('ids are rp-01 to rp-80 and unique', () => {
    for (const p of REPLY_PAIRS) {
      expect(p.id).toBe(`rp-${String(p.num).padStart(2, '0')}`);
    }
    expect(new Set(REPLY_PAIRS.map((p) => p.id)).size).toBe(80);
  });

  test('every field is filled', () => {
    for (const p of REPLY_PAIRS) {
      for (const s of [p.fi.q, p.fi.a, p.en.q, p.en.a, p.tl.q, p.tl.a]) {
        expect(s.trim(), p.id).not.toBe('');
        expect(s, p.id).not.toContain(' — ');
      }
    }
  });

  test('each category has 8 pairs, in dataset order', () => {
    expect(REPLY_CATEGORIES.map((c) => c.id)).toEqual([
      'tervehdykset',
      'tunteet',
      'kutsut',
      'kohteliaisuus',
      'mielipiteet',
      'tyo-opiskelu',
      'ostokset',
      'ongelmat',
      'puhelut',
      'reaktiot',
    ]);
    REPLY_CATEGORIES.forEach((c, i) => {
      const nums = REPLY_PAIRS.filter((p) => p.category === c.id).map((p) => p.num);
      expect(nums).toEqual(Array.from({ length: 8 }, (_, j) => i * 8 + j + 1));
    });
  });

  test('pair 18 uses the standard spelling', () => {
    expect(byId('rp-18').fi.a.startsWith('Totta kai!')).toBe(true);
    expect(REPLY_PAIRS.some((p) => p.fi.a.includes('Tottakai'))).toBe(false);
  });

  test('pins dataset text', () => {
    expect(byId('rp-01').fi.a).toBe('Ihan hyvää, kiitos! Entä sinulle?');
    expect(byId('rp-80').tl.a).toBe('Salamat, ikaw rin! Kita tayo ulit.');
    expect(byId('rp-40').en.q).toBe('Do you like this movie?');
  });
});
