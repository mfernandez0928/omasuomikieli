import type { Level, Phrase, TopicId, VerbType, Word, WordType } from '@/types';
import { WORDS } from '@/data/words';
import { PHRASES } from '@/data/phrases';
import { GRAMMAR_LESSONS } from '@/data/grammar';

/**
 * Search across the whole dictionary, including inflected forms.
 *
 * Finnish needs the inflected forms in the index: a learner who meets
 * "kaupassa" in the wild should find "kauppa". Every form the entry stores
 * (genitive, partitive, illative, plurals, conjugations) is indexed alongside
 * the headword, the English and the Tagalog.
 */

export interface SearchFilters {
  level?: Level | 'all';
  type?: WordType | 'all';
  topic?: TopicId | 'all';
  verbType?: VerbType | 'all';
  /** 'curated' = authored here, 'imported' = from the supplied v0.2.1 file. */
  origin?: 'all' | 'curated' | 'imported';
}

export interface WordHit {
  word: Word;
  score: number;
  /** Which stored form produced the match, when it was not the headword. */
  matchedForm?: string;
}

/** Strips diacritics so "aiti" also finds "äiti". */
function fold(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

/**
 * Builds the regular local-case forms from a word's genitive.
 *
 * This is the same move the Genitive lesson teaches: drop the -n from the
 * genitive and you have the stem that -ssa, -sta, -lla, -lta and -lle attach
 * to. Deriving them here means a learner who meets "kaupassa" in the wild can
 * look it up, without storing a dozen extra forms per entry.
 *
 * These forms are used for MATCHING ONLY. They are never shown as dictionary
 * data, because the regular pattern does not hold for every word.
 */
function derivedLocalCases(genitive: string): string[] {
  if (!genitive.endsWith('n') || genitive.length < 3) return [];
  const stem = genitive.slice(0, -1);
  // Vowel harmony: a back vowel anywhere in the stem forces the back endings.
  const back = /[aou]/i.test(stem);
  const suffixes = back
    ? ['ssa', 'sta', 'lla', 'lta', 'lle', 'na']
    : ['ssä', 'stä', 'llä', 'ltä', 'lle', 'nä'];
  return suffixes.map((suffix) => stem + suffix);
}

interface IndexedWord {
  word: Word;
  headword: string;
  english: string;
  tagalog: string;
  /** [folded form, original form] */
  forms: [string, string][];
}

function collectForms(w: Word): [string, string][] {
  const out: [string, string][] = [];
  const add = (v?: string) => {
    if (v) out.push([fold(v), v]);
  };

  add(w.vartalo);
  for (const alias of w.searchAliases ?? []) add(alias);
  const vf = w.verbForms;
  if (vf) {
    add(vf.present1sg);
    add(vf.present3sg);
    add(vf.present3pl);
    add(vf.negativePresent);
    add(vf.imperfect1sg);
    add(vf.pastParticiple);
    add(vf.passivePastParticiple);
    add(vf.conditional1sg);
  }
  const nf = w.nominalForms;
  if (nf) {
    add(nf.genitive);
    add(nf.partitive);
    add(nf.illative);
    add(nf.pluralNominative);
    add(nf.pluralPartitive);
    if (nf.genitive) {
      for (const form of derivedLocalCases(nf.genitive)) add(form);
    }
  }
  return out;
}

const INDEX: IndexedWord[] = WORDS.map((word) => ({
  word,
  headword: fold(word.fi),
  english: fold(word.en),
  tagalog: fold(word.tl),
  forms: collectForms(word),
}));

export function searchWords(query: string, filters: SearchFilters = {}): WordHit[] {
  const q = fold(query);
  const hits: WordHit[] = [];

  for (const entry of INDEX) {
    const { word } = entry;

    if (filters.level && filters.level !== 'all' && word.level !== filters.level) continue;
    if (filters.type && filters.type !== 'all' && word.type !== filters.type) continue;
    if (filters.topic && filters.topic !== 'all' && !word.topics.includes(filters.topic)) continue;
    if (filters.verbType && filters.verbType !== 'all' && word.verbType !== filters.verbType) continue;
    if (filters.origin && filters.origin !== 'all') {
      const isImported = word.id.startsWith('db-');
      if (filters.origin === 'imported' && !isImported) continue;
      if (filters.origin === 'curated' && isImported) continue;
    }

    if (!q) {
      hits.push({ word, score: 0 });
      continue;
    }

    let score = -1;
    let matchedForm: string | undefined;

    if (entry.headword === q) score = 100;
    else if (entry.headword.startsWith(q)) score = 80;
    else if (entry.english === q || entry.tagalog === q) score = 75;
    else if (entry.english.startsWith(q) || entry.tagalog.startsWith(q)) score = 60;
    else if (entry.headword.includes(q)) score = 50;
    else if (entry.english.includes(q) || entry.tagalog.includes(q)) score = 40;

    if (score < 0) {
      for (const [folded, original] of entry.forms) {
        if (folded === q) {
          score = 70;
          matchedForm = original;
          break;
        }
        if (folded.startsWith(q)) {
          score = 45;
          matchedForm = original;
          break;
        }
      }
    }

    if (score >= 0) hits.push({ word, score, matchedForm });
  }

  if (!q) {
    return hits.sort((a, b) => a.word.fi.localeCompare(b.word.fi, 'fi'));
  }

  return hits.sort((a, b) => b.score - a.score || a.word.fi.localeCompare(b.word.fi, 'fi'));
}

export interface GlobalHit {
  kind: 'word' | 'phrase' | 'grammar';
  id: string;
  title: string;
  subtitle: string;
  score: number;
  badge?: string;
}

/** Search used by the header search screen - covers all three content types. */
export function searchEverything(query: string, limit = 40): GlobalHit[] {
  const q = fold(query);
  if (!q) return [];

  const results: GlobalHit[] = searchWords(query)
    .slice(0, limit)
    .map((hit) => ({
      kind: 'word' as const,
      id: hit.word.id,
      title: hit.word.fi,
      subtitle: hit.matchedForm
        ? `${hit.word.en} · matched "${hit.matchedForm}"`
        : `${hit.word.en} · ${hit.word.tl}`,
      score: hit.score,
      badge: hit.word.level,
    }));

  for (const p of PHRASES) {
    const hay = fold(`${p.fi} ${p.en} ${p.tl} ${p.puhekieli ?? ''}`);
    if (hay.includes(q)) {
      results.push({
        kind: 'phrase',
        id: p.id,
        title: p.fi,
        subtitle: p.en,
        score: fold(p.fi).startsWith(q) ? 65 : 35,
        badge: p.level,
      });
    }
  }

  for (const g of GRAMMAR_LESSONS) {
    const hay = fold(`${g.title} ${g.subtitle} ${g.finnishTerm} ${g.rule}`);
    if (hay.includes(q)) {
      results.push({
        kind: 'grammar',
        id: g.id,
        title: g.title,
        subtitle: g.finnishTerm,
        score: fold(g.title).includes(q) ? 70 : 30,
        badge: g.level,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function searchPhrases(query: string): Phrase[] {
  const q = fold(query);
  if (!q) return PHRASES;
  return PHRASES.filter((p) => fold(`${p.fi} ${p.en} ${p.tl} ${p.puhekieli ?? ''}`).includes(q));
}

/**
 * Normalises a typed answer before comparing: case, surrounding space,
 * repeated spaces and trailing punctuation are all ignored. Finnish letters
 * are kept distinct: writing "aiti" for "äiti" is a spelling error, not a
 * variant.
 */
export function normaliseAnswer(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.!?,;:]+$/, '');
}

export function answersMatch(given: string, expected: string, alsoAccept: string[] = []): boolean {
  const g = normaliseAnswer(given);
  if (!g) return false;
  return [expected, ...alsoAccept].some((candidate) => normaliseAnswer(candidate) === g);
}

/** Folds a and o onto their umlauts, so only the dots differ. */
function foldUmlauts(s: string): string {
  return s.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/å/g, 'a');
}

export interface AnswerCheck {
  correct: boolean;
  /** The answer was right but for its missing or stray umlauts. */
  umlautSlip: boolean;
}

/**
 * Grades a typed answer, treating a missing umlaut as a near miss.
 *
 * In Finnish ä is a letter of its own, not a variant of a - tähti is a star
 * and tahti is a beat - so an answer spelled without the dots is not simply
 * correct. But plenty of learners type on a keyboard that has no ä, and
 * marking them wrong teaches them nothing about Finnish and files a
 * keyboard problem in their mistakes list. So the answer passes and the
 * caller is told, which lets the screen show the proper spelling.
 */
export function checkAnswer(
  given: string,
  expected: string,
  alsoAccept: string[] = [],
): AnswerCheck {
  const g = normaliseAnswer(given);
  if (!g) return { correct: false, umlautSlip: false };

  const candidates = [expected, ...alsoAccept].map(normaliseAnswer);
  if (candidates.some((c) => c === g)) return { correct: true, umlautSlip: false };

  const folded = foldUmlauts(g);
  if (candidates.some((c) => foldUmlauts(c) === folded)) {
    return { correct: true, umlautSlip: true };
  }
  return { correct: false, umlautSlip: false };
}
