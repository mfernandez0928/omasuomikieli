/**
 * Branding strings, kept in one place so the hero, the More screen, Settings
 * and the page metadata cannot drift apart.
 */

/** Short mark, shown in the UI. */
export const BRAND = 'MarkDev@2026';

/**
 * Release stage, shown wherever a learner could otherwise take this for a
 * finished product: the hero, the first-run screen and the More footer.
 *
 * Deliberately not in the web manifest or the document title. Those two feed
 * the name under the icon on a home screen, and renaming an app someone has
 * already installed reads as a different app rather than as a label.
 */
export const RELEASE_STAGE = 'Beta';

const AUTHOR = 'MarkDev';
const YEAR = 2026;

/** Ownership notice. Distinct from `BRAND`, which is only the name. */
export const COPYRIGHT = `© ${YEAR} ${AUTHOR}. All rights reserved.`;

/**
 * Shown wherever a textbook is named: the Data audit, which lists the books by
 * title, and the two footers that carry the copyright notice.
 *
 * Citing a book is a reference, not a claim of any connection to it. Without
 * this said plainly, a screen full of titles, chapters and page numbers can
 * read as an official companion to those books, which this is not. The second
 * half matters just as much in the other direction: the meanings, exercises
 * and dialogues are this project's own work, and saying so is what the licence
 * rests on.
 */
export const INDEPENDENCE_NOTICE =
  'Oma Suomi is an independent study aid. It is not affiliated with, endorsed by or ' +
  'connected to the publishers or authors of any textbook cited here. Titles, chapters ' +
  'and page numbers are cited as references only, and those books remain the property ' +
  'of their own authors and publishers. All English and Tagalog meanings, exercises and ' +
  'dialogues are original work.';
