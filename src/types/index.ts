/**
 * Oma Suomi - content schema.
 *
 * Two hard rules encoded here:
 *
 * 1. `source` is `null` unless the material was actually read out of a named
 *    book. We never fabricate a book + chapter citation. `SourceRef` therefore
 *    has no optional-page escape hatch that invites guessing.
 * 2. `verification` records how confident we are in the *linguistic* data
 *    (stem, verb type, inflection). `needs-review` entries are surfaced in the
 *    UI instead of being silently presented as fact.
 */

export type Level = 'A1' | 'A2.1' | 'A2.2' | 'B1';

export const LEVELS: Level[] = ['A1', 'A2.1', 'A2.2', 'B1'];

/**
 * How trustworthy an entry is, and on what basis.
 *
 * These four values are the app's whole vocabulary for provenance, and they
 * are deliberately ordered from strongest to weakest evidence:
 *
 *  - `source-verified`      the headword was found in a named book at a page
 *                           that was actually read, AND its forms were checked.
 *  - `linguistically-checked` not found in the readable sources, but the stem,
 *                           verb type and inflected forms were derived and
 *                           checked against standard Finnish morphology.
 *  - `supplementary`        kept because it is useful, but neither traced to a
 *                           source nor fully checked form by form.
 *  - `needs-review`         something specific is uncertain; `reviewNote` says
 *                           what, and the UI flags it rather than hiding it.
 *
 * A textbook appearance is evidence about the WORD, not about every field on
 * the entry, so `source-verified` still requires the forms to have been checked.
 */
export type Verification =
  | 'source-verified'
  | 'linguistically-checked'
  | 'supplementary'
  | 'needs-review';

/** A citation. Only ever constructed from material actually inspected. */
export interface SourceRef {
  /** Id in SOURCE_BOOKS, so the citation resolves to the inventory entry. */
  bookId: string;
  book: string;
  chapter: string;
  /**
   * Printed page, recorded only where the PDF-to-printed page mapping was
   * verified for that book. Left out otherwise rather than guessed.
   */
  page?: number;
  /** PDF page, where that is what could be verified instead of a printed one. */
  pdfPage?: number;
  /** Which part of the book, e.g. 'SANASTO' for a chapter word list. */
  section?: string;
  /** The grammar point as the book's own contents lists it, in its wording. */
  sourceTerm?: string;
  /** Short note on what exactly came from there. */
  note?: string;
}

/**
 * Where a lesson's substance comes from.
 *
 * `source-derived` means the rule and its terminology were taken from a book
 * listed in `source`. `supplementary` means the topic is useful but was NOT
 * found in any readable supplied book, so it is additional content and is
 * labelled as such in the UI.
 */
export type ContentOrigin = 'source-derived' | 'supplementary';

/* ------------------------------------------------------------------ */
/* Vocabulary                                                          */
/* ------------------------------------------------------------------ */

export type WordType =
  | 'verbi'
  | 'substantiivi'
  | 'adjektiivi'
  | 'adverbi'
  | 'pronomini'
  | 'numeraali'
  | 'partikkeli'
  | 'konjunktio'
  | 'postpositio'
  | 'fraasi';

/** Finnish verb types 1-6, by the shape of the dictionary form. */
export type VerbType = 1 | 2 | 3 | 4 | 5 | 6;

export type TopicId =
  | 'arki'
  | 'ostokset'
  | 'liikkuminen'
  | 'terveys'
  | 'tyo'
  | 'koulu'
  | 'koti'
  | 'luonto'
  | 'sosiaaliset'
  | 'palvelut'
  | 'abstraktit'
  | 'perus';

/** Noun/adjective principal parts. Only filled where actually known. */
export interface NominalForms {
  /** yksikön genetiivi, e.g. ruoka -> ruoan */
  genitive?: string;
  /** yksikön partitiivi, e.g. ruoka -> ruokaa */
  partitive?: string;
  /** yksikön illatiivi, e.g. ruoka -> ruokaan */
  illative?: string;
  /** monikon nominatiivi, e.g. ruoka -> ruoat */
  pluralNominative?: string;
  /** monikon partitiivi, e.g. ruoka -> ruokia */
  pluralPartitive?: string;
}

/** Verb principal parts. */
export interface VerbForms {
  /** 1st person singular present, e.g. puhun */
  present1sg: string;
  /** 3rd person singular present, e.g. puhuu */
  present3sg: string;
  /** 3rd person plural present, e.g. puhuvat */
  present3pl?: string;
  /** negative present stem used after en/et/ei, e.g. puhu */
  negativePresent?: string;
  /** 1st person singular imperfect, e.g. puhuin */
  imperfect1sg?: string;
  /** active past participle (NUT-partisiippi), e.g. puhunut */
  pastParticiple?: string;
  /** passive past participle (TU-partisiippi), e.g. puhuttu */
  passivePastParticiple?: string;
  /** conditional 1sg, e.g. puhuisin */
  conditional1sg?: string;
}

/** What case a verb demands of its complement (rektio). */
export interface Rection {
  /** e.g. '+ partitiivi', '+ -sta/-stä', '+ -maan/-mään' */
  pattern: string;
  example: string;
  english: string;
  tagalog: string;
}

export interface ExampleSentence {
  fi: string;
  en: string;
  tl: string;
  /** Marks spoken-language forms so yleiskieli stays distinguishable. */
  register?: 'yleiskieli' | 'puhekieli';
}

export interface Word {
  id: string;
  /** perusmuoto - dictionary form */
  fi: string;
  en: string;
  tl: string;
  type: WordType;
  level: Level;
  topics: TopicId[];

  /**
   * Present-tense stem. Deliberately optional: many words have no useful
   * stem to show, and a wrong stem is worse than none.
   */
  vartalo?: string;
  verbType?: VerbType;
  verbForms?: VerbForms;
  nominalForms?: NominalForms;
  rections?: Rection[];

  examples?: ExampleSentence[];
  /** Short grammar/usage note in English. */
  note?: string;
  /** Same note, in Tagalog. */
  noteTl?: string;
  /**
   * Irregular forms that are worth finding in the dictionary but cannot be
   * derived from the regular pattern (e.g. työ -> töissä, koti -> kotona).
   * Search-only: these are never presented as the word's paradigm.
   */
  searchAliases?: string[];
  /** ids of related words */
  related?: string[];
  /** ids of grammar lessons that explain this word's forms */
  grammarRefs?: string[];

  source: SourceRef | null;
  verification: Verification;
  /** What was wrong in the imported note, when the entry was corrected. */
  correctionNote?: string;
  /** What is still uncertain, when verification === 'needs-review'. */
  reviewNote?: string;
  /** Why the entry carries the level it does. */
  levelBasis?: string;
}

/* ------------------------------------------------------------------ */
/* Grammar                                                             */
/* ------------------------------------------------------------------ */

export interface GrammarExample {
  fi: string;
  en: string;
  tl: string;
  /** Short tag shown on the example chip, e.g. 'a·o·u' or 'tyyppi 1'. */
  tag?: string;
  /** Highlights a substring of `fi` in the UI. */
  highlight?: string;
}

/**
 * A conjugation / declension table rendered inside a lesson.
 *
 * `rows` is [label, ...cells] so one table can show several verbs side by side
 * (e.g. persoona | puhua | syödä | tulla).
 */
export interface GrammarTable {
  title: string;
  /** Column headings, including the leading label column. */
  headers: string[];
  rows: string[][];
  /** Shown under the table. */
  note?: string;
  noteTl?: string;
}

export interface GrammarExceptionNote {
  title: string;
  body: string;
  examples?: GrammarExample[];
}

export interface CommonMistake {
  wrong: string;
  right: string;
  why: string;
  whyTl: string;
}

export type ExerciseKind =
  | 'multiple-choice'
  | 'fill-blank'
  | 'choose-form'
  | 'match'
  | 'translate'
  | 'conjugate'
  | 'choose-case'
  | 'correct-sentence';

export interface Exercise {
  id: string;
  kind: ExerciseKind;
  /** The instruction shown above the question. */
  prompt: string;
  /** Sentence or word, with `___` marking the gap where relevant. */
  question: string;
  /** Extra hint shown under the question, e.g. the dictionary form. */
  hint?: string;
  options?: string[];
  /** Index into `options`, or the exact expected string for typed answers. */
  answer: string;
  /** Other strings accepted as correct (case/spacing are normalised anyway). */
  alsoAccept?: string[];
  /** Shown after answering - must explain, not just say "correct". */
  explanation: string;
  explanationTl: string;
  /** Pairs for `match` exercises. */
  pairs?: { left: string; right: string }[];
  /** Grammar lesson this drills, for the mistakes tracker. */
  grammarId?: string;
  /** Word id this drills, for the mistakes tracker. */
  wordId?: string;
}

export interface GrammarLesson {
  id: string;
  /** Order within the whole curriculum. */
  order: number;
  title: string;
  subtitle: string;
  level: Level;
  /** Finnish grammatical terminology, e.g. 'vokaaliharmonia'. */
  finnishTerm: string;
  /** Estimated study time in minutes (target 3-7). */
  minutes: number;
  moduleId: string;
  /**
   * Why the lesson carries the level it does. Where a book states its own CEFR
   * level, that is quoted; where the level is this app's judgement, it says so.
   */
  levelBasis?: string;

  /** Plain-language intro in English. */
  intro: string;
  /** Plain-language intro in Tagalog/Filipino. */
  introTl: string;
  /** The actual rule, stated precisely. */
  rule: string;
  /** Compact "easy rule" summary shown in the highlighted box. */
  easyRule: { left: string; leftNote: string; right?: string; rightNote?: string };

  examples: GrammarExample[];
  /** Conjugation / declension tables, shown after the examples. */
  tables?: GrammarTable[];
  exceptions?: GrammarExceptionNote[];
  mistakes: CommonMistake[];
  /** Memory tip / summary at the end of the lesson. */
  tip: string;
  tipTl: string;

  exercises: Exercise[];
  relatedGrammar?: string[];
  relatedWords?: string[];

  /** Additional citations when more than one book covers the point. */
  alsoIn?: SourceRef[];
  /** Whether the lesson is textbook-derived or supplementary. */
  origin: ContentOrigin;
  /** Anything still unresolved about this lesson, shown in the Data audit. */
  openQuestion?: string;

  source: SourceRef | null;
  verification: Verification;
}

export interface GrammarModule {
  id: string;
  title: string;
  /** e.g. 'BASIC GRAMMAR (A1-A2)' */
  label: string;
  levels: Level[];
}

/* ------------------------------------------------------------------ */
/* Phrases                                                             */
/* ------------------------------------------------------------------ */

export type SituationId =
  | 'koulu'
  | 'tyo'
  | 'laakari'
  | 'palvelut'
  | 'kauppa'
  | 'liikenne'
  | 'puhelin'
  | 'ajanvaraus'
  | 'kutsut'
  | 'viestit'
  | 'apu'
  | 'ongelma'
  | 'mielipide'
  | 'anteeksi';

export interface Phrase {
  id: string;
  fi: string;
  en: string;
  tl: string;
  situation: SituationId;
  level: Level;
  /** The same thing as people actually say it, when it differs. */
  puhekieli?: string;
  /** When to use which register, or a politeness note. */
  note?: string;
  noteTl?: string;
  /** Grammar lessons that explain the structure used here. */
  grammarRefs?: string[];
  source: SourceRef | null;
  verification: Verification;
}

export interface Situation {
  id: SituationId;
  title: string;
  titleFi: string;
  description: string;
  icon: string;
}

export interface Topic {
  id: TopicId;
  titleFi: string;
  titleEn: string;
  icon: string;
  color: string;
}

/* ------------------------------------------------------------------ */
/* Learner state (persisted)                                           */
/* ------------------------------------------------------------------ */

export type SrsGrade = 'again' | 'hard' | 'good' | 'easy';

export type WordStatus = 'new' | 'learning' | 'known' | 'difficult';

/** One scheduled card in the spaced-repetition system. */
export interface SrsCard {
  /** `${kind}:${refId}` */
  id: string;
  kind: 'word' | 'grammar';
  refId: string;
  /** Interval in days until the next review. */
  intervalDays: number;
  /** Ease multiplier, SM-2 style. Clamped to [1.3, 2.8]. */
  ease: number;
  /** Consecutive non-'again' answers. */
  streak: number;
  /** epoch ms */
  due: number;
  /** epoch ms, 0 if never seen */
  lastReviewed: number;
  reps: number;
  lapses: number;
  status: WordStatus;
}

export interface MistakeEntry {
  id: string;
  /** What the learner wrote / chose. */
  wrong: string;
  /** The correct form. */
  right: string;
  /** Free-text personal note. */
  note?: string;
  /** Where it came from. */
  origin: 'practice' | 'manual';
  wordId?: string;
  grammarId?: string;
  createdAt: number;
  /** Times reviewed since being logged. */
  reviewed: number;
  resolved: boolean;
}

export interface PersonalWord {
  id: string;
  fi: string;
  en: string;
  tl: string;
  note?: string;
  createdAt: number;
}

export interface DayActivity {
  /** YYYY-MM-DD in local time. */
  date: string;
  wordsStudied: number;
  exercisesAnswered: number;
  exercisesCorrect: number;
}

export interface LessonProgress {
  grammarId: string;
  /** 0-100 */
  percent: number;
  /** Index of the furthest section reached. */
  section: number;
  exercisesDone: number;
  exercisesTotal: number;
  updatedAt: number;
  completed: boolean;
}

export interface Settings {
  dailyGoal: number;
  /** Show Tagalog translations throughout. */
  showTagalog: boolean;
  /** Show the romanised/plain hint text under Finnish examples. */
  showEnglish: boolean;
  /** Speak Finnish via the Web Speech API when a speaker button is pressed. */
  speechEnabled: boolean;
  /** New cards introduced per day. */
  newPerDay: number;
}

export interface SessionResume {
  kind: 'grammar' | 'vocabulary';
  refId: string;
  title: string;
  subtitle: string;
  percent: number;
  updatedAt: number;
}

/* ------------------------------------------------------------------ */
/* Situations (role-play)                                              */
/* ------------------------------------------------------------------ */

/**
 * A scripted role-play scene: the other person speaks, the learner picks what
 * to say back.
 *
 * Honesty note, because this is easy to oversell. The dialogues are WRITTEN
 * for this app - they are not transcripts of anything printed in a book, and
 * there is no AI on the other end. What is sourced is the material they are
 * built from: every word maps to a dictionary entry that carries its own
 * citation, and every spoken form comes from the puhekieli tables in
 * `src/data/puhekieli.ts`. `scripts/validate-situations.mjs` enforces that -
 * a line containing a word that is not accounted for fails the build.
 */
export interface RolePlayLine {
  fi: string;
  en: string;
  tl: string;
  /** The same line in standard Finnish, when the spoken form differs. */
  yleiskieli?: string;
}

export interface RolePlayOption extends RolePlayLine {
  /** Whether this reply actually does the job. */
  ok: boolean;
  /** Why it works, or what is wrong with it. Never just 'correct'. */
  why: string;
  whyTl: string;
}

export interface RolePlayTurn {
  id: string;
  /** What the other person says first. Omitted when the learner opens. */
  partner?: RolePlayLine;
  /** What the learner has to achieve on this turn. */
  task: string;
  taskTl: string;
  options: RolePlayOption[];
  /** Id of the goal this turn ticks off. */
  completes?: string;
}

export interface RolePlayGoal {
  id: string;
  en: string;
  tl: string;
}

export interface RolePlay {
  id: string;
  /** English label, e.g. 'At the shop'. */
  title: string;
  /** Finnish label as a Finn would name the situation, e.g. 'Kaupassa'. */
  titleFi: string;
  /** One line of scene-setting. */
  setting: string;
  settingTl: string;
  /** Who the learner is talking to, in English. */
  partnerName: string;
  level: Level;
  icon: string;
  colour: string;
  /** Which register the scene is written in, and why it is the realistic one. */
  register: 'puhekieli' | 'yleiskieli' | 'mixed';
  registerNote: string;
  goals: RolePlayGoal[];
  turns: RolePlayTurn[];
  /** What the other person says as the scene ends. */
  closing?: RolePlayLine;
  /** Dictionary ids for the words the scene leans on, for follow-up study. */
  vocabulary: string[];
  grammarRefs?: string[];
  /** Books the vocabulary and spoken forms were taken from. */
  vocabularyFrom: SourceRef[];
  /** Always 'supplementary': the dialogue itself is written, not quoted. */
  origin: ContentOrigin;
  verification: Verification;
}

/**
 * One surface form appearing in a scene, with the dictionary entry it comes
 * from. This is what makes the vocabulary claim checkable rather than a
 * promise: the validator requires every word of every line to have an entry
 * here, and every `wordId` to resolve to a real dictionary word.
 */
export interface SceneGloss {
  /** The form exactly as it appears in a dialogue line, lower-cased. */
  form: string;
  /** Dictionary entry id, when the form inflects from a dictionary headword. */
  wordId?: string;
  /** The dictionary form, for display. */
  lemma: string;
  /** Short English gloss of this form in this context. */
  en: string;
  /** The grammar of the form, e.g. 'inessiivi' or 'mä = minä (puhekieli)'. */
  grammar?: string;
  /**
   * Set when the form is not a dictionary word and never will be: names,
   * greetings and interjections. The string says where it comes from.
   */
  basis?: string;
}
