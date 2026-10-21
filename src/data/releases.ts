/**
 * What changed in each release, shown to the learner in the "What's new"
 * dialog.
 *
 * English only. These notes are about the app, not about Finnish, so there is
 * nothing to learn from seeing the same sentence twice - unlike a word or an
 * example sentence, where the translation IS the content.
 *
 * `APP_VERSION` is the version the running build is. When a learner opens the
 * app and the last version they saw is older than this, they are shown the
 * entries in between - not the whole history, just what they missed.
 *
 * Two rules keep this honest and keep it from becoming noise:
 *
 *  1. Only write entries a learner would notice. A refactor, a bug fix nobody
 *     saw, a change to the build: none of those belong here. "Fixed the
 *     roster duplicate" means nothing to someone studying Finnish.
 *  2. Bump `APP_VERSION` in the same commit as the entry, or learners see
 *     the change without the note, or the note without the change.
 *
 * Newest first. The dialog relies on that order.
 */

export interface Release {
  /** Must sort correctly with compareVersions below. */
  version: string;
  /** YYYY-MM-DD, shown as the date of the update. */
  date: string;
  /** One line summing the release up, used as the dialog heading. */
  title: string;
  /** One short line each. These are read on a phone, once. */
  notes: string[];
}

/** The version this build is. Bump it whenever you add a release below. */
export const APP_VERSION = '1.1.1';

export const RELEASES: Release[] = [
  {
    version: '1.1.1',
    date: '2026-10-21',
    title: 'Shorter update notes',
    notes: [
      'This notice used to print every line twice, in English and again in Tagalog. It now shows each line once.',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-10-21',
    title: 'Nature, food, jobs and five new grammar lessons',
    notes: [
      '280 new words: wild and forest animals, birds, insects, trees, lakes and shores, fruit and berries, cuts of meat, and about fifty jobs.',
      'Five grammar lessons the app did not cover: postpositions, possessive suffixes, the plural partitive, osata / voida / saada, and conjunctions.',
      'The object lesson has fourteen more exercises, most of them on the one rule with no exceptions: a negative sentence always takes the partitive.',
      'Lessons are renumbered 1 to 29 so the new ones sit where they belong in the course.',
    ],
  },
];

/**
 * Compares two dotted versions numerically, so 1.10.0 is newer than 1.9.0.
 * A string compare would get that backwards.
 *
 * Returns a negative number when `a` is older, 0 when they match, positive
 * when `a` is newer. Missing or malformed parts count as 0, so a stored value
 * that is not a version at all simply reads as very old.
 */
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.');
  const pb = b.split('.');
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const na = Number.parseInt(pa[i] ?? '0', 10) || 0;
    const nb = Number.parseInt(pb[i] ?? '0', 10) || 0;
    if (na !== nb) return na - nb;
  }
  return 0;
}

/** The releases newer than `since`, newest first. */
export function releasesSince(since: string): Release[] {
  return RELEASES.filter((r) => compareVersions(r.version, since) > 0);
}
