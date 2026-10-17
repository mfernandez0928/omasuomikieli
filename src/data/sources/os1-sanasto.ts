/**
 * Per-chapter coverage of the Oma suomi 1 SANASTO word lists.
 *
 * Metadata only: chapter, printed page, entry count, and whether the page had
 * a usable text layer. The word lists themselves are not in this file.
 *
 * The full 1 501-entry transcription is a working record kept out of version
 * control (`src/data/sources/os1-sanasto.local.ts`, gitignored); committing
 * every word list of a copyrighted textbook to a public repository would
 * reproduce a substantial part of it. Dictionary entries derived from it cite
 * chapter and page.
 */

/** Per-chapter coverage, for the Data audit screen. */
export const OS1_SANASTO_CHAPTERS = [
  { kappale: 1, title: 'Tervetuloa!', pages: [23], entries: 81, source: 'text' as const },
  { kappale: 2, title: 'Susanin naapurit', pages: [49], entries: 130, source: 'image' as const },
  { kappale: 3, title: 'Keskiviikkona kesällä', pages: [75], entries: 132, source: 'text' as const },
  { kappale: 4, title: 'Ruokakaupassa', pages: [97], entries: 110, source: 'text' as const },
  { kappale: 5, title: 'Tässä kaupungissa', pages: [133], entries: 128, source: 'text' as const },
  { kappale: 6, title: 'Vaatteet ja ostokset', pages: [155, 156], entries: 112, source: 'text' as const },
  { kappale: 7, title: '(kappale 7)', pages: [181], entries: 103, source: 'text' as const },
  { kappale: 8, title: 'Mikä hätänä?', pages: [204, 205], entries: 171, source: 'text' as const },
  { kappale: 9, title: 'Yllätysjuhlat', pages: [235], entries: 93, source: 'text' as const },
  { kappale: 10, title: 'On hauskaa auttaa ystävää', pages: [257], entries: 115, source: 'text' as const },
  { kappale: 11, title: 'Minun urapolkuni', pages: [274, 275], entries: 149, source: 'text' as const },
  { kappale: 12, title: 'Mökillä', pages: [297], entries: 106, source: 'text' as const },
  { kappale: 13, title: 'Pikku-uutisia', pages: [313], entries: 71, source: 'text' as const },
];
