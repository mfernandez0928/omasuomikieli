/**
 * Content schema: vocabulary, grammar lessons, phrases, role-plays and the
 * persisted learner state.
 *
 * Two invariants the rest of the codebase relies on:
 *
 * 1. `source` is `null` unless the entry was taken from a named book at a
 *    located page. `SourceRef` has no field that can hold a guess.
 * 2. `verification` grades the linguistic data (stem, verb type, inflection)
 *    independently of the citation, and `needs-review` entries are surfaced in
 *    the UI.
 */

export type Level = 'A1' | 'A2.1' | 'A2.2' | 'B1';

export const LEVELS: Level[] = ['A1', 'A2.1', 'A2.2', 'B1'];

/**
 * Evidence behind an entry's linguistic data, ordered strongest to weakest.
 *
 *  - `source-verified`        headword located in a named book at a known page,
 *                             and its forms checked.
 *  - `linguistically-checked` not present in the available sources; stem, verb
 *                             type and forms derived from standard morphology.
 *  - `supplementary`          neither traced to a source nor checked form by
 *                             form.
 *  - `needs-review`           `reviewNote` records what is uncertain.
 *
 * A textbook appearance is evidence about the headword, not about every field,
 * so `source-verified` still requires the forms to have been checked.
 */
export type Verification =
  | 'source-verified'
  | 'linguistically-checked'
  | 'supplementary'
  | 'needs-review';

/** A citation to a book, chapter and location within it. */
export interface SourceRef {
  /** Key into SOURCE_BOOKS, so the citation resolves to the inventory entry. */
  bookId: string;
  book: string;
  chapter: string;
  /** Printed page. Set only where the PDF-to-print page mapping is known. */
  page?: number;
  /** PDF page, used where no printed page number is available. */
  pdfPage?: number;
  /** Part of the book, e.g. 'SANASTO' for a chapter word list. */
  section?: string;
  /** The term or heading as the book itself prints it. */
  sourceTerm?: string;
  /** What specifically was taken from this location. */
  note?: string;
}

/**
 * Whether a lesson's rule and terminology come from the book named in `source`,
 * or go beyond the available sources. `supplementary` content is labelled as
 * such in the UI.
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
  | 'prepositio'
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

/** Noun and adjective principal parts. Filled only where known. */
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

  /** Present-tense stem. Omitted where it is not known. */
  vartalo?: string;
  verbType?: VerbType;
  verbForms?: VerbForms;
  nominalForms?: NominalForms;
  rections?: Rection[];

  examples?: ExampleSentence[];
  /**
   * A short explanation in Finnish, written for the learner to read at A2.
   *
   * This is not a translation of `note` - it is Finnish to be read as
   * Finnish, the way a monolingual dictionary explains a word, so that
   * looking something up is itself a minute of reading practice. Keep it to
   * one or two sentences and use words a learner at this level already has.
   *
   *   todella: "Todella tarkoittaa, että jokin on hyvin tai erittäin
   *   jotakin. Sitä käytetään myös korostamaan asiaa."
   */
  selitys?: string;
  /** Short grammar/usage note in English. */
  note?: string;
  /** Same note, in Tagalog. */
  noteTl?: string;
  /**
   * Irregular forms worth finding by search but not derivable from the regular
   * pattern (työ -> töissä, koti -> kotona). Indexed for search only; never
   * rendered as part of the paradigm.
   */
  searchAliases?: string[];
  /** ids of related words */
  related?: string[];
  /** ids of grammar lessons that explain this word's forms */
  grammarRefs?: string[];

  source: SourceRef | null;
  verification: Verification;
  /** What was corrected, for entries changed after import. */
  correctionNote?: string;
  /** What is uncertain, when verification is 'needs-review'. */
  reviewNote?: string;
  /** Basis for the assigned CEFR level. */
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
 * A conjugation or declension table inside a lesson. Each row is
 * `[label, ...cells]`, so one table can show several words side by side
 * (persoona | puhua | syödä | tulla).
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
  /** Sentence or word; `___` marks the gap. */
  question: string;
  /**
   * Finnish to be heard rather than read. When set, the runner plays this
   * instead of showing the question text, so the learner has to listen.
   */
  audio?: string;
  /** Extra hint shown under the question, e.g. the dictionary form. */
  hint?: string;
  options?: string[];
  /** Index into `options`, or the expected string for typed answers. */
  answer: string;
  /** Further accepted answers. Case and spacing are normalised before compare. */
  alsoAccept?: string[];
  /** Shown after answering; explains the rule rather than restating the result. */
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
   * Basis for the assigned CEFR level: the book's own stated level where it
   * gives one, otherwise an editorial judgement, which the string records.
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
  | 'anteeksi'
  | 'pyynnot';

export interface Phrase {
  id: string;
  fi: string;
  en: string;
  tl: string;
  situation: SituationId;
  level: Level;
  /** The colloquial equivalent, where it differs from the standard form. */
  puhekieli?: string;
  /** Register or politeness note. */
  note?: string;
  noteTl?: string;
  /** Grammar lessons that explain the structure used here. */
  grammarRefs?: string[];
  source: SourceRef | null;
  verification: Verification;
}

/** The ten categories of the Natural Finnish Replies set, in its order. */
export type ReplyCategoryId =
  | 'tervehdykset'
  | 'tunteet'
  | 'kutsut'
  | 'kohteliaisuus'
  | 'mielipiteet'
  | 'tyo-opiskelu'
  | 'ostokset'
  | 'ongelmat'
  | 'puhelut'
  | 'reaktiot';

export interface ReplyCategory {
  id: ReplyCategoryId;
  /** 1-10, the order of the source dataset. */
  num: number;
  title: string;
  titleFi: string;
  icon: string;
}

/** One line of a reply pair in one language: the question and its answer. */
export interface ReplyLines {
  q: string;
  a: string;
}

/**
 * A Finnish question and a natural reply to it, learned together as a pair
 * rather than as two unrelated phrases.
 */
export interface ReplyPair {
  /** 'rp-01' ... 'rp-80'. */
  id: string;
  /** 1-80, the numbering of the source dataset. Kept so entries can be checked against it. */
  num: number;
  category: ReplyCategoryId;
  level: Level;
  fi: ReplyLines;
  en: ReplyLines;
  tl: ReplyLines;
  /** Usage or register note, in English. */
  note?: string;
  noteTl?: string;
  /** The colloquial version of the reply, where it is worth knowing. */
  puhekieli?: string;
  source: null;
  verification: 'linguistically-checked';
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

/** A scheduled review card. */
export interface SrsCard {
  /** `${kind}:${refId}` */
  id: string;
  kind: 'word' | 'grammar';
  refId: string;
  /** Interval in days until the next review. */
  intervalDays: number;
  /** SM-2 style ease multiplier, clamped to [1.3, 2.8]. */
  ease: number;
  /** Run of consecutive answers graded above 'again'. */
  streak: number;
  /** epoch ms */
  due: number;
  /** epoch ms, 0 if never seen */
  lastReviewed: number;
  reps: number;
  lapses: number;
  status: WordStatus;
  /**
   * YYYY-MM-DD of the day this card first entered the deck, which is what
   * makes `newPerDay` a limit per day rather than per session. Optional
   * because cards created before this field existed do not carry it; those
   * are old by definition, so a missing value reads as "not today".
   */
  introducedOn?: string;
}

export interface MistakeEntry {
  id: string;
  /** The answer given. */
  wrong: string;
  /** The correct form. */
  right: string;
  /** Free-text note added by the learner. */
  note?: string;
  origin: 'practice' | 'manual';
  wordId?: string;
  grammarId?: string;
  createdAt: number;
  /** Reviews since the entry was logged. */
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
  /** Show English glosses under Finnish examples. */
  showEnglish: boolean;
  /** Use the Web Speech API for the speaker buttons. */
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
 * A scripted role-play scene: the other speaker's lines are fixed, and the
 * learner picks a reply from a short list.
 *
 * The dialogue is written for this app rather than quoted from a book, so its
 * vocabulary is constrained instead: every word form resolves through
 * `src/data/situations/lexicon.ts` to a dictionary entry, and every colloquial
 * form comes from `src/data/puhekieli.ts`. `scripts/validate-situations.mjs`
 * enforces both and fails on an unaccounted word.
 */
export interface RolePlayLine {
  fi: string;
  en: string;
  tl: string;
  /** The same line in standard Finnish, when the spoken form differs. */
  yleiskieli?: string;
}

export interface RolePlayOption extends RolePlayLine {
  /** Whether the reply achieves the turn's task. */
  ok: boolean;
  /** The rule behind the result, not a restatement of it. */
  why: string;
  whyTl: string;
}

export interface RolePlayTurn {
  id: string;
  /** The other speaker's line. Omitted on turns where the learner opens. */
  partner?: RolePlayLine;
  /** What the learner has to achieve on the turn. */
  task: string;
  taskTl: string;
  options: RolePlayOption[];
  /** Goal completed by answering this turn correctly. */
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
  /** Finnish label for the situation, e.g. 'Kaupassa'. */
  titleFi: string;
  /** One line of scene-setting. */
  setting: string;
  settingTl: string;
  /** Who the learner is talking to. */
  partnerName: string;
  level: Level;
  icon: string;
  colour: string;
  /** Register the scene is written in, and why that register fits it. */
  register: 'puhekieli' | 'yleiskieli' | 'mixed';
  registerNote: string;
  goals: RolePlayGoal[];
  turns: RolePlayTurn[];
  /** The other speaker's closing line. */
  closing?: RolePlayLine;
  /** Dictionary ids the scene draws on, offered for follow-up study. */
  vocabulary: string[];
  grammarRefs?: string[];
  /** Citations for the register and colloquial forms the scene uses. */
  vocabularyFrom: SourceRef[];
  /** Always 'supplementary': the dialogue is written, not quoted. */
  origin: ContentOrigin;
  verification: Verification;
}

/**
 * One surface form used in a scene, resolved to the dictionary entry it
 * inflects from. Drives the tap-to-translate UI, and gives the validator
 * something to check each dialogue line against.
 */
export interface SceneGloss {
  /** The form as it appears in a dialogue line, lower-cased. */
  form: string;
  /** Dictionary entry the form inflects from, where there is one. */
  wordId?: string;
  /** Dictionary form, for display. */
  lemma: string;
  /** English gloss of this form in this context. */
  en: string;
  /** Morphology of the form, e.g. 'inessiivi' or 'mä = minä (puhekieli)'. */
  grammar?: string;
  /**
   * Where the form comes from when it has no `wordId`: names, greetings,
   * numerals. Required in that case; the validator checks for it.
   */
  basis?: string;
}

/* ------------------------------------------------------------------ */
/* Who is using the app                                                */
/* ------------------------------------------------------------------ */

/**
 * The learner's own name, entered once before the app opens.
 *
 * It is stored in this browser and nowhere else. `id` is generated locally and
 * is what a future sync would key on, so the name itself never has to be the
 * identifier.
 */
export interface UserProfile {
  /** Random local id, created with the profile. */
  id: string;
  firstName: string;
  lastName: string;
  /** epoch ms */
  createdAt: number;
}
