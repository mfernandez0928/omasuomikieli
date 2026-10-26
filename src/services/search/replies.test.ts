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
  expect(hit!.id).toBe('rp-01');
  expect(hit!.path).toBe('/replies/tervehdykset');
  expect(hit!.subtitle).toBe('Ihan hyvää, kiitos! Entä sinulle?');
});

test('reply hits have unique ids and say where they open', () => {
  const hits = searchEverything('kiitos').filter((h) => h.kind === 'reply');
  expect(hits.length).toBeGreaterThan(1);
  expect(new Set(hits.map((h) => h.id)).size).toBe(hits.length);
  expect(hits.every((h) => h.path?.startsWith('/replies/'))).toBe(true);
});
