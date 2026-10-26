import { describe, expect, test } from 'vitest';
import { searchEverything, searchReplies } from './search';

const ids = (query: string) => searchReplies(query).map((p) => p.id);

describe('searchReplies', () => {
  test('matches Finnish without the dots', () => {
    expect(ids('mielellani')).toContain('rp-22');
  });

  test('matches Tagalog', () => {
    expect(ids('kumusta')).toContain('rp-01');
  });

  test('matches English in the reply line', () => {
    expect(ids("can't complain")).toContain('rp-08');
  });

  test('an empty query finds nothing', () => {
    expect(searchReplies('')).toEqual([]);
  });
});

test('global search returns reply pairs', () => {
  const hit = searchEverything('Mitä kuuluu').find((h) => h.kind === 'reply');
  expect(hit).toBeDefined();
  expect(hit!.id).toBe('tervehdykset');
  expect(hit!.subtitle).toBe('Ihan hyvää, kiitos! Entä sinulle?');
});
