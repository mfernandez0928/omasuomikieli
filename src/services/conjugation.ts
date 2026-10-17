import type { Word } from '@/types';

/**
 * Builds the six-person present-tense table from the two forms stored per verb,
 * the 1st and 3rd person singular.
 *
 *   minä  vartalo + n     stored, weak grade where KPT applies
 *   sinä  vartalo + t     same stem as minä
 *   hän   stored          strong grade; its shape varies by verb type
 *   me    vartalo + mme   same stem as minä
 *   te    vartalo + tte   same stem as minä
 *   he    strong stem + vat/vät
 *
 * sinä, me and te are exact: they share the 1sg stem and only swap the ending.
 * `he` needs the strong stem, which the 1sg does not give for a gradating verb
 * (otan -> ottavat, not *otavat), so it comes from `present3pl` or `vartalo`
 * and is omitted when neither is known.
 */

export type FormOrigin = 'stored' | 'derived';

export interface PersonForm {
  person: string;
  value: string;
  origin: FormOrigin;
}

/** Back vowels anywhere in the stem select -vat; otherwise -vät. */
function pluralEnding(stem: string): string {
  return /[aou]/i.test(stem) ? 'vat' : 'vät';
}

function stripStem(vartalo: string): string {
  return vartalo.replace(/-+$/, '');
}

export function personalForms(word: Word): PersonForm[] {
  const vf = word.verbForms;
  if (!vf?.present1sg) return [];

  const first = vf.present1sg.trim();
  // Impersonal entries are stored with their subject ("se tuntuu"); they have
  // no paradigm to show.
  if (first.includes(' ')) return [];
  if (!first.endsWith('n')) return [];

  const weak = first.slice(0, -1);
  const out: PersonForm[] = [
    { person: 'minä', value: first, origin: 'stored' },
    { person: 'sinä', value: weak + 't', origin: 'derived' },
  ];

  if (vf.present3sg) {
    out.push({ person: 'hän', value: vf.present3sg, origin: 'stored' });
  }

  out.push(
    { person: 'me', value: weak + 'mme', origin: 'derived' },
    { person: 'te', value: weak + 'tte', origin: 'derived' },
  );

  if (vf.present3pl) {
    out.push({ person: 'he', value: vf.present3pl, origin: 'stored' });
  } else if (word.vartalo) {
    const stem = stripStem(word.vartalo);
    out.push({ person: 'he', value: stem + pluralEnding(stem), origin: 'derived' });
  }

  // Restore paradigm order; the pushes above are not in it.
  const order = ['minä', 'sinä', 'hän', 'me', 'te', 'he'];
  return out.sort((a, b) => order.indexOf(a.person) - order.indexOf(b.person));
}

/** True when a 3rd person form was unavailable and the table is short. */
export function isPartialParadigm(word: Word): boolean {
  const forms = personalForms(word);
  if (!forms.length) return false;
  return forms.length < 6;
}
