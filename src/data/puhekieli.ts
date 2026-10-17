import type { SourceRef } from '@/types';

/**
 * Spoken Finnish (puhekieli), transcribed from Suomen mestari 2's own
 * Puhekieli section, printed pages 293-296.
 *
 * The book states what variety it teaches: "Tämän kirjan puhekieli on
 * yleispuhekieltä, jota puhutaan esimerkiksi pääkaupunkiseudulla" - the general
 * spoken language of the Helsinki region. Finland has plenty of local variation
 * on top of this; that sentence is the book's own scope note, not ours.
 *
 * This file is the single source of truth for every spoken form the Situations
 * use. `scripts/validate-situations.mjs` checks each dialogue line against it,
 * so a scene cannot quietly invent a colloquial form.
 */

export const PUHEKIELI_SOURCE: SourceRef = {
  bookId: 'sm2',
  book: 'Suomen mestari 2',
  chapter: 'Puhekieli',
  page: 293,
  section: 'Puhekieli',
  sourceTerm: 'Puhekieli, s. 293-296',
};

export interface SpokenForm {
  /** The spoken form as the book prints it. */
  spoken: string;
  /** The standard-language equivalent. */
  standard: string;
  /** Printed page it was read from. */
  page: number;
}

/** Personal pronouns, all cases the book tabulates (pp. 294). */
export const SPOKEN_PRONOUNS: SpokenForm[] = [
  { spoken: 'mä', standard: 'minä', page: 294 },
  { spoken: 'sä', standard: 'sinä', page: 294 },
  { spoken: 'se', standard: 'hän', page: 294 },
  { spoken: 'ne', standard: 'he', page: 294 },
  { spoken: 'mua', standard: 'minua', page: 294 },
  { spoken: 'sua', standard: 'sinua', page: 294 },
  { spoken: 'sitä', standard: 'häntä', page: 294 },
  { spoken: 'mun', standard: 'minun', page: 294 },
  { spoken: 'sun', standard: 'sinun', page: 294 },
  { spoken: 'sen', standard: 'hänen', page: 294 },
  { spoken: 'meiän', standard: 'meidän', page: 294 },
  { spoken: 'teiän', standard: 'teidän', page: 294 },
  { spoken: 'niiden', standard: 'heidän', page: 294 },
  { spoken: 'mut', standard: 'minut', page: 294 },
  { spoken: 'sut', standard: 'sinut', page: 294 },
  { spoken: 'mulle', standard: 'minulle', page: 294 },
  { spoken: 'sulle', standard: 'sinulle', page: 294 },
  { spoken: 'sille', standard: 'hänelle', page: 294 },
  { spoken: 'mulla', standard: 'minulla', page: 294 },
  { spoken: 'sulla', standard: 'sinulla', page: 294 },
  { spoken: 'sillä', standard: 'hänellä', page: 294 },
  { spoken: 'multa', standard: 'minulta', page: 294 },
  { spoken: 'sulta', standard: 'sinulta', page: 294 },
  { spoken: 'musta', standard: 'minusta', page: 294 },
  { spoken: 'susta', standard: 'sinusta', page: 294 },
  { spoken: 'muhun', standard: 'minuun', page: 294 },
  { spoken: 'suhun', standard: 'sinuun', page: 294 },
];

/** Verb forms the book tabulates (pp. 295-296). */
export const SPOKEN_VERBS: SpokenForm[] = [
  // olla
  { spoken: 'oon', standard: 'olen', page: 295 },
  { spoken: 'oot', standard: 'olet', page: 295 },
  { spoken: 'ollaan', standard: 'olemme', page: 295 },
  { spoken: 'ootte', standard: 'olette', page: 295 },
  { spoken: 'oo', standard: 'ole', page: 295 },
  // mennä
  { spoken: 'meen', standard: 'menen', page: 295 },
  { spoken: 'meet', standard: 'menet', page: 295 },
  { spoken: 'mennään', standard: 'menemme', page: 295 },
  { spoken: 'meette', standard: 'menette', page: 295 },
  { spoken: 'mee', standard: 'mene', page: 295 },
  // tulla
  { spoken: 'tuun', standard: 'tulen', page: 295 },
  { spoken: 'tuut', standard: 'tulet', page: 295 },
  { spoken: 'tullaan', standard: 'tulemme', page: 295 },
  { spoken: 'tuu', standard: 'tule', page: 295 },
  // the me- and he-persons, which the book treats as a rule of their own
  { spoken: 'asutaan', standard: 'asumme', page: 295 },
  { spoken: 'luetaan', standard: 'luemme', page: 295 },
  { spoken: 'syödään', standard: 'syömme', page: 295 },
  { spoken: 'otetaan', standard: 'otamme', page: 295 },
  { spoken: 'asunu', standard: 'asunut', page: 296 },
  { spoken: 'ollu', standard: 'ollut', page: 296 },
];

/** Question particle -ks, and other small words (pp. 296). */
export const SPOKEN_PARTICLES: SpokenForm[] = [
  { spoken: 'mut', standard: 'mutta', page: 296 },
  { spoken: 'sit', standard: 'sitten', page: 296 },
  { spoken: 'eiku', standard: 'ei vaan', page: 296 },
  { spoken: 'tota', standard: 'tuota noin', page: 296 },
  { spoken: 'tääl', standard: 'täällä', page: 296 },
  { spoken: 'tos', standard: 'tuossa', page: 296 },
  { spoken: 'tossa', standard: 'tuossa', page: 296 },
  { spoken: 'siel', standard: 'siellä', page: 296 },
  { spoken: 'siin', standard: 'siinä', page: 296 },
  { spoken: 'täs', standard: 'tässä', page: 296 },
  { spoken: 'tuol', standard: 'tuolla', page: 296 },
];

/** Spoken numbers (p. 293). */
export const SPOKEN_NUMBERS: SpokenForm[] = [
  { spoken: 'yks', standard: 'yksi', page: 293 },
  { spoken: 'kaks', standard: 'kaksi', page: 293 },
  { spoken: 'kolme', standard: 'kolme', page: 293 },
  { spoken: 'neljä', standard: 'neljä', page: 293 },
  { spoken: 'viis', standard: 'viisi', page: 293 },
  { spoken: 'kuus', standard: 'kuusi', page: 293 },
  { spoken: 'seittemän', standard: 'seitsemän', page: 293 },
  { spoken: 'kaheksan', standard: 'kahdeksan', page: 293 },
  { spoken: 'yheksän', standard: 'yhdeksän', page: 293 },
  { spoken: 'kymmenen', standard: 'kymmenen', page: 293 },
  { spoken: 'kakskyt', standard: 'kaksikymmentä', page: 293 },
  { spoken: 'kolkyt', standard: 'kolmekymmentä', page: 293 },
  { spoken: 'nelkyt', standard: 'neljäkymmentä', page: 293 },
  { spoken: 'viiskyt', standard: 'viisikymmentä', page: 293 },
  { spoken: 'kuuskyt', standard: 'kuusikymmentä', page: 293 },
  { spoken: 'seiskyt', standard: 'seitsemänkymmentä', page: 293 },
  { spoken: 'ykstoist', standard: 'yksitoista', page: 293 },
  { spoken: 'kakstoist', standard: 'kaksitoista', page: 293 },
];

export const ALL_SPOKEN: SpokenForm[] = [
  ...SPOKEN_PRONOUNS,
  ...SPOKEN_VERBS,
  ...SPOKEN_PARTICLES,
  ...SPOKEN_NUMBERS,
];

export const SPOKEN_BY_FORM = new Map(ALL_SPOKEN.map((f) => [f.spoken.toLowerCase(), f]));

/**
 * The -ks question ending, which is what makes a spoken question sound spoken:
 * "Asuks sä Jyväskylässä?" for "Asutko Jyväskylässä?" (p. 296).
 */
export const KS_QUESTION_NOTE =
  'Spoken Finnish replaces the -ko/-kö question ending with -ks: Asutko? becomes Asuks sä?, ' +
  'Oletteko? becomes Ootteks te?, Menemmekö? becomes Mennäänks me?';
