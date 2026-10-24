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
