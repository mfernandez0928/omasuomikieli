import type { Word } from '@/types';
import { importLegacyWords, legacyMergedAway } from '@/data/legacy/legacy-adapter';
import { CORE_VERBS } from './core-verbs';
import { B1_VERBS } from './b1-verbs';
import { NOUNS } from './nouns';
import { FUNCTION_WORDS } from './function-words';
import { EXTRA_WORDS } from './extra-verbs';
import { OS1_WORDS } from './os1-words';
import { OS1_WORDS_2 } from './os1-words-2';
import { OS1_WORDS_3 } from './os1-words-3';
import { OS1_CORE_WORDS } from './os1-core';
import { EVERYDAY_VERBS } from './everyday-verbs';

/**
 * The curated set is authored in this folder. The supplied v0.2.1 database is
 * merged in on top, minus anything the curated set already covers, so the
 * dictionary has no duplicate headwords.
 *
 * To add vocabulary later: append to one of the files above (or create a new
 * one and add it here). Ids must be unique - `validateWords` enforces that at
 * startup in dev.
 */
const CURATED: Word[] = [
  ...CORE_VERBS,
  ...B1_VERBS,
  ...NOUNS,
  ...FUNCTION_WORDS,
  ...EXTRA_WORDS,
  ...OS1_WORDS,
  ...OS1_WORDS_2,
  ...OS1_WORDS_3,
  ...OS1_CORE_WORDS,
  ...EVERYDAY_VERBS,
];

const curatedFinnish = new Set(CURATED.map((w) => w.fi.toLowerCase()));

export const IMPORTED_WORDS: Word[] = importLegacyWords(curatedFinnish);

/** Imported entries skipped because a curated entry already covers them. */
export const MERGED_AWAY: Word[] = legacyMergedAway(curatedFinnish);

export const WORDS: Word[] = [...CURATED, ...IMPORTED_WORDS];

export const WORD_BY_ID = new Map(WORDS.map((w) => [w.id, w]));

export function getWord(id: string): Word | undefined {
  return WORD_BY_ID.get(id);
}

export interface ValidationIssue {
  kind: 'duplicate-id' | 'duplicate-headword' | 'bad-reference' | 'missing-field';
  detail: string;
}

/** Cheap integrity check. Run in dev; surfaced in the Data audit screen. */
export function validateWords(words: Word[] = WORDS): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenHeadwords = new Map<string, string>();

  for (const w of words) {
    if (seenIds.has(w.id)) {
      issues.push({ kind: 'duplicate-id', detail: `${w.id} appears more than once` });
    }
    seenIds.add(w.id);

    const key = w.fi.toLowerCase();
    const prev = seenHeadwords.get(key);
    if (prev) {
      issues.push({
        kind: 'duplicate-headword',
        detail: `"${w.fi}" is defined by both ${prev} and ${w.id}`,
      });
    }
    seenHeadwords.set(key, w.id);

    if (!w.fi || !w.en || !w.tl) {
      issues.push({ kind: 'missing-field', detail: `${w.id} is missing fi/en/tl` });
    }
  }

  for (const w of words) {
    for (const r of w.related ?? []) {
      if (!seenIds.has(r)) {
        issues.push({ kind: 'bad-reference', detail: `${w.id} links to unknown word "${r}"` });
      }
    }
  }

  return issues;
}

export {
  CORE_VERBS,
  B1_VERBS,
  NOUNS,
  FUNCTION_WORDS,
  EXTRA_WORDS,
  OS1_WORDS,
  OS1_WORDS_2,
  OS1_WORDS_3,
  OS1_CORE_WORDS,
  EVERYDAY_VERBS,
};
