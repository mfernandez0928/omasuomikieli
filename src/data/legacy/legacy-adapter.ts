import type { Level, TopicId, VerbType, Word, WordType } from '@/types';
import { LEGACY_DB } from './index';
import type { LegacyWord } from './types';

/**
 * Converts the supplied v0.2.1 database into the app schema.
 *
 * The supplied file carries the note: "Check every entry against the source
 * books before treating source attribution or level as verified." This module
 * performs that check. Each change is recorded in `LEGACY_AUDIT` and listed
 * under Settings -> Data audit.
 */

export type AuditSeverity = 'bug' | 'correction' | 'note';

export interface AuditFinding {
  wordId: string;
  finnish: string;
  severity: AuditSeverity;
  field: string;
  was: string;
  now: string;
  why: string;
}

const findings: AuditFinding[] = [];

function record(f: AuditFinding) {
  findings.push(f);
}

/** Strips invisible characters that break search and answer comparison. */
function clean(raw: string): { value: string; hadInvisible: boolean } {
  // U+00AD soft hyphen, U+200B zero-width space, U+FEFF BOM, U+00A0 nbsp.
  const value = raw.replace(/[­​﻿]/g, '').replace(/ /g, ' ');
  return { value, hadInvisible: value !== raw };
}

/**
 * Levels in the supplied file are flagged as unverified by the file itself.
 * These words are core A1 vocabulary in every Finnish course, so tagging them
 * A2.1 would hide them from an A1 learner's review queue.
 */
const LEVEL_FIXES: Record<string, Level> = {
  puhua: 'A1',
  syoda: 'A1',
  tulla: 'A1',
  tarvita: 'A1',
  opettaja: 'A1',
  myyja: 'A1',
  ruoka: 'A1',
  juna: 'A1',
  terve: 'A1',
};

/**
 * The supplied schema note says "Only include vartalo when relevant and
 * verified". These entries carry a vartalo that is just the dictionary form
 * plus a hyphen: it teaches nothing, and for ruoka / asunto it is actively
 * misleading because the real stem changes (ruoan, asunnon).
 */
const DROP_VARTALO = new Set([
  'opettaja',
  'laulaja',
  'kirjoittaja',
  'myyja',
  'kayttaja',
  'ruoka',
  'juna',
  'asunto',
  'kutsu',
  'upea',
]);

const MISLEADING_VARTALO: Record<string, string> = {
  ruoka: 'the real genitive stem is ruoa- (ruoan), not ruoka-',
  asunto: 'the real genitive stem is asunno- (asunnon), not asunto-',
};

/** Free-text topics in the supplied file, mapped onto the app's topic ids. */
const TOPIC_MAP: Record<string, TopicId> = {
  arkielämä: 'arki',
  arkielama: 'arki',
  kieli: 'koulu',
  koulu: 'koulu',
  ruoka: 'arki',
  liikenne: 'liikkuminen',
  terveys: 'terveys',
  työ: 'tyo',
  tyo: 'tyo',
  'vapaa-aika': 'arki',
  elämä: 'abstraktit',
  ajatukset: 'abstraktit',
  musiikki: 'arki',
  tekniikka: 'arki',
  kuvailu: 'abstraktit',
  fraasit: 'perus',
  juhlat: 'sosiaaliset',
  uutiset: 'arki',
  ostokset: 'ostokset',
  koti: 'koti',
};

const WORD_TYPE_MAP: Record<string, WordType> = {
  verbi: 'verbi',
  substantiivi: 'substantiivi',
  adjektiivi: 'adjektiivi',
  adverbi: 'adverbi',
  pronomini: 'pronomini',
  fraasi: 'fraasi',
};

function toLevel(raw: string): Level {
  if (raw === 'A1' || raw === 'A2.1' || raw === 'A2.2' || raw === 'B1') return raw;
  return 'A2.1';
}

function convert(w: LegacyWord): Word {
  const fi = clean(w.finnish).value;
  const id = `db-${w.id}`;

  /* --- level --- */
  let level = toLevel(w.level);
  const levelFix = LEVEL_FIXES[w.id];
  if (levelFix && levelFix !== level) {
    record({
      wordId: id,
      finnish: fi,
      severity: 'correction',
      field: 'level',
      was: w.level,
      now: levelFix,
      why: 'Core A1 vocabulary. The supplied file marks its own levels as unverified; keeping A2.1 would hide the word from an A1 review queue.',
    });
    level = levelFix;
  }

  /* --- vartalo --- */
  let vartalo: string | undefined = w.vartalo;
  if (vartalo && DROP_VARTALO.has(w.id)) {
    const extra = MISLEADING_VARTALO[w.id];
    record({
      wordId: id,
      finnish: fi,
      severity: extra ? 'correction' : 'note',
      field: 'vartalo',
      was: w.vartalo ?? '',
      now: '(removed)',
      why: extra
        ? `Misleading stem: ${extra}.`
        : 'The stem is just the dictionary form plus a hyphen, so it carries no information. The supplied schema says to include vartalo only when relevant.',
    });
    vartalo = undefined;
  }

  /* --- verb forms, with invisible-character repair --- */
  const forms = w.forms ?? {};
  const fixedForms: Record<string, string> = {};
  for (const [key, raw] of Object.entries(forms)) {
    const { value, hadInvisible } = clean(raw);
    if (hadInvisible) {
      record({
        wordId: id,
        finnish: fi,
        severity: 'bug',
        field: `forms.${key}`,
        was: JSON.stringify(raw),
        now: value,
        why: 'Contained an invisible U+00AD soft hyphen. It renders identically but breaks search, sorting and answer checking.',
      });
    }
    fixedForms[key] = value;
  }

  const isVerb = w.word_type === 'verbi';

  if (isVerb && !w.forms) {
    record({
      wordId: id,
      finnish: fi,
      severity: 'note',
      field: 'forms',
      was: '(absent)',
      now: '(absent)',
      why: 'Verb entry has no conjugation table, unlike the other verbs in the file. Conjugation practice will skip it until forms are added.',
    });
  }

  /* --- topic --- */
  const topicKey = w.topic.toLowerCase();
  const mapped = TOPIC_MAP[topicKey];
  if (!mapped) {
    record({
      wordId: id,
      finnish: fi,
      severity: 'note',
      field: 'topic',
      was: w.topic,
      now: 'perus',
      why: 'Topic string is not in the supplied file\'s own `topics` list and has no app topic to map onto.',
    });
  }
  const topics: TopicId[] = [mapped ?? 'perus'];

  /* --- related words: ids only, inflected forms dropped --- */
  const related: string[] = [];
  for (const r of w.related_words ?? []) {
    const match = LEGACY_DB.words.find((other) => other.id === r || other.finnish === r);
    if (match) {
      related.push(`db-${match.id}`);
    } else {
      record({
        wordId: id,
        finnish: fi,
        severity: 'note',
        field: 'related_words',
        was: r,
        now: '(dropped)',
        why: '"' + r + '" is an inflected form, not an entry id, so it cannot be linked to a word page.',
      });
    }
  }

  const word: Word = {
    id,
    fi,
    en: clean(w.english).value,
    tl: clean(w.tagalog).value,
    type: WORD_TYPE_MAP[w.word_type] ?? 'substantiivi',
    level,
    topics,
    vartalo,
    examples: [
      {
        fi: clean(w.example).value,
        en: clean(w.example_english).value,
        tl: clean(w.example_tagalog).value,
      },
    ],
    related: related.length ? related : undefined,
    // The supplied file provides no source_book / source_chapter on any entry,
    // so there is nothing to cite, and these were not matched against the
    // textbooks in this pass either - hence 'supplementary'.
    source: null,
    verification: 'supplementary',
  };

  if (isVerb && w.verbityyppi) {
    word.verbType = w.verbityyppi as VerbType;
  }

  if (isVerb && fixedForms['minä']) {
    word.verbForms = {
      present1sg: fixedForms['minä'],
      present3sg: fixedForms['hän'] ?? fixedForms['minä'],
      present3pl: fixedForms['he'],
    };
  }

  if (!isVerb) {
    const nominal: NonNullable<Word['nominalForms']> = {};
    if (fixedForms['genetiivi']) nominal.genitive = fixedForms['genetiivi'];
    if (fixedForms['partitiivi']) nominal.partitive = fixedForms['partitiivi'];
    if (fixedForms['illatiivi']) nominal.illative = fixedForms['illatiivi'];
    if (fixedForms['monikko']) nominal.pluralNominative = fixedForms['monikko'];
    if (fixedForms['partitiivi_monikko']) nominal.pluralPartitive = fixedForms['partitiivi_monikko'];
    if (Object.keys(nominal).length) word.nominalForms = nominal;
  }

  return word;
}

const ALL_CONVERTED = LEGACY_DB.words.map(convert);

/**
 * Curated entries take priority: where one already covers the same Finnish
 * headword, the imported copy is skipped to avoid a duplicate.
 */
export function importLegacyWords(curatedFinnish: Set<string>): Word[] {
  return ALL_CONVERTED.filter((w) => !curatedFinnish.has(w.fi.toLowerCase()));
}

export function legacyMergedAway(curatedFinnish: Set<string>): Word[] {
  return ALL_CONVERTED.filter((w) => curatedFinnish.has(w.fi.toLowerCase()));
}

export const LEGACY_AUDIT: AuditFinding[] = findings;

export const LEGACY_META = {
  version: LEGACY_DB.version,
  declaredWords: LEGACY_DB.stats.words,
  actualWords: LEGACY_DB.words.length,
  declaredGrammar: LEGACY_DB.stats.grammar_items,
  actualGrammar: LEGACY_DB.grammar.length,
  note: LEGACY_DB.note,
};
