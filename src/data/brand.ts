/**
 * The app's own mark.
 *
 * Kept in one place so it cannot drift out of sync between the hero, the More
 * screen, Settings and the page metadata. Change it here and every surface
 * follows.
 */

/** The short mark, shown in the UI. */
export const BRAND = 'MarkDev@2026';

/** Who made the app, for metadata and the longer credit lines. */
export const AUTHOR = 'MarkDev';

/** The year the mark carries. */
export const BRAND_YEAR = 2026;

/** Full credit line, for footers and the document metadata. */
export const CREDIT = `Oma Suomi - ${BRAND}`;

/**
 * Copyright notice. Separate from `BRAND` on purpose: the mark is the name,
 * this is the ownership claim, and they are not the same statement.
 */
export const COPYRIGHT = `© ${BRAND_YEAR} ${AUTHOR}. All rights reserved.`;
