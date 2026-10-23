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
export const APP_VERSION = '1.7.0';

export const RELEASES: Release[] = [
  {
    version: '1.7.0',
    date: '2026-10-24',
    title: 'Review counts your mistakes properly again',
    notes: [
      'When you pressed Again on a card and then got it right later in the same session, the app forgot that you had missed it. That word now stays marked as difficult and comes back sooner, which is the whole point of pressing Again.',
      'New words per day is now really per day. Opening Daily review a second time used to hand out another full batch, so a limit of five could quietly become twenty.',
      'Typing a instead of ä no longer counts as a wrong answer. It is marked correct and the proper spelling is shown, because missing the dots is a keyboard problem, not a Finnish one.',
      'The home screen now says how many cards are waiting, counting the new words you have not met yet - it used to say nothing at all when only new words were left.',
    ],
  },
  {
    version: '1.6.0',
    date: '2026-10-23',
    title: 'Move your progress between devices',
    notes: [
      'Settings can now export your whole account to a file - your name, streak, saved words, review cards and mistakes - and import it back.',
      'The name screen offers to restore from a backup too, so you can get your progress back without typing a name first.',
      'If you added the app to your home screen on an iPhone or iPad and it opened empty, this is the fix. The installed app gets its own separate storage, so your work is still in Safari: export it there, import it here.',
      'The old backup button only saved part of your data. It now includes your name, settings, streak and saved words as well.',
    ],
  },
  {
    version: '1.5.0',
    date: '2026-10-23',
    title: 'Words checked against the books',
    notes: [
      'The travel and recycling words now say which book, chapter and page they come from. All 134 are confirmed against Suomen mestari 2 and 3, page by page.',
      'Fifty more words carry a Finnish explanation, and the example sentences for them are taken from the books rather than written from scratch.',
      'Verbs that govern a case now show it the way the books teach it: vastata puhelimeen, unohtaa avain kotiin, osallistua kurssille, sopia sinulle, kuulostaa hyvältä.',
      'The word saapuvat was uncertain - an arrivals board, or "they arrive"? Page 16 of Suomen mestari 2 lists it among airport signs, so the board reading is the one that stands.',
    ],
  },
  {
    version: '1.4.0',
    date: '2026-10-23',
    title: 'Explanations and examples for 500 more words',
    notes: [
      'Every A1 noun and adjective, and all the everyday A1 verbs, now carry a short explanation in Finnish and at least one example sentence with its translation.',
      'Opposites are named where a word has one - halpa and kallis, pimeä and valoisa - because that is the fastest way to fix a word in memory.',
      'Verbs say which case follows them where it matters: odottaa, rakastaa, pelata and neuvoa all take the partitive, and the examples now show it.',
      'Pairs that learners mix up carry a note: herätä and herättää, muuttua and muuttaa, pelata and soittaa, korkea and pitkä.',
    ],
  },
  {
    version: '1.3.0',
    date: '2026-10-23',
    title: 'Words explained in Finnish',
    notes: [
      'Word pages now carry a short explanation in Finnish, so looking something up is a minute of reading practice rather than only a translation.',
      'The 81 words that had nothing but a translation - nyt, paljon, hyvin, aikaisin, eilen and the rest - now have that explanation and example sentences.',
      'Finishing a practice set and pressing back used to drop you into the questions you had just answered. It now takes you back where you came from.',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-10-22',
    title: 'Travel words, and recycling words',
    notes: [
      '134 new words. Trains, platforms, tickets and border crossings on one side; recycling, energy and the environment on the other.',
      'Spoken forms are marked as spoken, so you can see that ratikka, netti and roskis are what people say and raitiovaunu, internet and roskakori are what gets written.',
      'Time expressions like viime vuonna and ensi kuussa are in, each with the pattern behind it.',
    ],
  },
  {
    version: '1.1.2',
    date: '2026-10-21',
    title: 'The app speaks English',
    notes: [
      'The name screen and the name editor in Settings are English now. Finnish is still there as the thing you are learning, not as a second set of instructions.',
    ],
  },
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
