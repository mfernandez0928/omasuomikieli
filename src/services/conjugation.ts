import type { Word } from '@/types';

/**
 * Builds the full persoonamuodot table for a verb.
 *
 * Only two forms are ever stored per verb: the 1st person singular and the
 * 3rd person singular. The other four are not guesses - Finnish present-tense
 * personal endings are completely regular once you have those two:
 *
 *   minä  vartalo + n     <- stored (weak grade where KPT applies)
 *   sinä  vartalo + t     <- same stem as minä
 *   hän   stored          <- strong grade, 3sg has its own shape per verb type
 *   me    vartalo + mme   <- same stem as minä
 *   te    vartalo + tte   <- same stem as minä
 *   he    vahva vartalo + vat/vät
 *
 * sinä / me / te therefore come from the 1sg by swapping the ending, which is
 * exact. `he` needs the STRONG stem, which 1sg does not give when the verb
 * gradates (otan -> he ottavat, not *otavat), so it is taken from the stored
 * `vartalo` or `present3pl` and left out when neither is known, rather than
 * being derived from a stem that might be the wrong grade.
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
  // Impersonal entries are printed with "se" in the book (se tuntuu); there is
  // no paradigm to show for those.
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

  // Keep the book's order rather than the order they were pushed in.
  const order = ['minä', 'sinä', 'hän', 'me', 'te', 'he'];
  return out.sort((a, b) => order.indexOf(a.person) - order.indexOf(b.person));
}

/** True when the table is missing the 3rd person forms we cannot derive. */
export function isPartialParadigm(word: Word): boolean {
  const forms = personalForms(word);
  if (!forms.length) return false;
  return forms.length < 6;
}
