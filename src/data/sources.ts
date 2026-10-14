/**
 * Source inventory.
 *
 * Built by actually opening the supplied PDFs, extracting their text and
 * reading their tables of contents — not from general knowledge about what is
 * "usually" taught at a given level.
 *
 * Method, so the claims here can be re-checked:
 *  - Text was extracted with `pdftotext -layout -enc UTF-8`.
 *  - Chapter titles and grammar points come from each book's own
 *    Sisällysluettelo, cross-checked against the chapter opener in the body.
 *  - A printed page number is recorded ONLY where the PDF page and the printed
 *    page were confirmed to line up (see `pageMapping` on each book).
 *  - Books whose pages carry no text layer are marked `textLayer: false`. For
 *    those, nothing is cited, because nothing could be read.
 */

export type SourceAccess =
  /** Text extracted successfully; chapters and grammar points verified. */
  | 'readable'
  /** File opens, but the pages are images with no text layer. */
  | 'image-only'
  /** File is too small to be the full work (a sample or extract). */
  | 'sample-only';

export interface SourceChapter {
  /** Chapter number as printed in the book. */
  number: number;
  /** Finnish chapter title as printed. */
  titleFi: string;
  /** Printed page, when the page mapping was verified. */
  page?: number;
  /** PDF page where the chapter opens, when that is what was verified. */
  pdfPage?: number;
  /** Grammar points as the book itself lists them, in its own terminology. */
  grammar: string[];
  /** Vocabulary themes as the book lists them. */
  topics?: string[];
}

export interface SourceBook {
  id: string;
  title: string;
  /** Level as stated by the book itself, where it states one. */
  statedLevel?: string;
  access: SourceAccess;
  /** Total pages in the PDF. */
  pdfPages?: number;
  /** How PDF pages relate to printed pages, and how that was checked. */
  pageMapping?: string;
  /** What could not be read, stated plainly. */
  limitation?: string;
  chapters: SourceChapter[];
  /** Anything notable found while inspecting the file. */
  notes?: string[];
}

export const SOURCE_BOOKS: SourceBook[] = [
  {
    id: 'sm2',
    title: 'Suomen mestari 2',
    access: 'readable',
    pdfPages: 342,
    pageMapping:
      'PDF page = printed page. Verified: the contents list chapters 1, 2 and 3 on pages 10, 44 and 80, and those chapters open on PDF pages 10, 44 and 80.',
    chapters: [
      {
        number: 1,
        titleFi: 'Viikonloppureissu',
        page: 10,
        grammar: [
          'Milloin?',
          'positiivinen imperfekti',
          'Mennään!',
          'me mennään',
          'sanatyypit as/äs/is ja in',
        ],
        topics: ['matkustaminen'],
      },
      {
        number: 2,
        titleFi: 'Hanna on sairas',
        page: 44,
        grammar: ['Minun täytyy...', 'objekti', 'k~p~t-vaihtelu: sanatyypit e, in, as/äs'],
        topics: ['terveys ja sairaus', 'ruumiinosat', 'asiointi lääkärissä'],
      },
      {
        number: 3,
        titleFi: 'Mökillä',
        page: 80,
        grammar: [
          'verbi + maan/massa/masta',
          'tässä, tuossa, siinä',
          'transitiivi- ja intransitiiviverbit',
          'verbityyppi 6',
        ],
        topics: ['luonto', 'mökki ja sauna'],
      },
      {
        number: 4,
        titleFi: 'Mitä teet vapaa-ajalla?',
        page: 116,
        grammar: [
          'negatiivinen imperfekti',
          'minen',
          'miten tekee? sti-adverbit',
          'verbi + rektio',
          'Kuinka usein?',
          'Mitä mieltä?',
        ],
        topics: ['vapaa-aika ja harrastukset'],
      },
      {
        number: 5,
        titleFi: 'Varkaus Puistotiellä',
        page: 146,
        grammar: [
          'perfekti',
          'imperfektin ja perfektin käyttö',
          'verbi + maan/mään',
          'pronominit joka, joku, jokin, ei kukaan, ei mikään',
          'sanatyypit ut/yt ja nut/nyt',
        ],
        topics: ['asiointi virastossa'],
      },
      {
        number: 6,
        titleFi: 'Onnea hääparille!',
        page: 180,
        grammar: [
          'pluskvamperfekti',
          'aikamuotojen käyttö',
          'possessiivisuffiksit',
          'sanatyyppi Vus/Vys',
          'k-p-t-vaihtelu: uku-uvu, yky-yvy, rki-rje, lki-lje',
          'aistiverbit + lta/ltä',
        ],
        topics: ['juhlat ja tavat', 'parisuhde ja avioliitto'],
      },
      {
        number: 7,
        titleFi: 'Alexin haastattelu',
        page: 218,
        grammar: [
          'i-monikko: paikansijat',
          'joka-pronomini monikossa',
          'pronominit: nämä, nuo, ne',
          'verbi + rektio',
        ],
        topics: ['koulutus ja työ'],
      },
      {
        number: 8,
        titleFi: 'Puhelinta ostamassa',
        page: 256,
        grammar: [
          'i-monikko: partitiivi',
          'i-monikko: genetiivi',
          'X on millainen',
          'adjektiivien vertailu',
        ],
        topics: ['ostoksilla'],
      },
    ],
    notes: [
      'The book also has a Puhekieli section (p. 293), a Minikielioppi reference (p. 297) and an answer key (p. 331).',
    ],
  },

  {
    id: 'sm3',
    title: 'Suomen mestari 3',
    statedLevel: "A2.2 (stated in the book's own Alkusanat)",
    access: 'readable',
    pdfPages: 321,
    pageMapping:
      'PDF page = printed page, offset 0. Verified directly: 22 sampled pages carry a printed page number equal to their PDF page. (Batch 1 only inferred this from the contents and called it approximate; batch 3 confirmed it.)',
    limitation:
      'With `pdftotext -layout` this PDF interleaves overlapping text runs and comes out scrambled. Re-extracting with `pdftotext -raw` avoids the interleaving, and 9934 octal escape runs were decoded back to UTF-8, which made the whole book readable. Chapters 5 word lists were not matched in batch 3.',
    chapters: [
      {
        number: 1,
        titleFi: 'Säästetään energiaa ja kierrätetään!',
        page: 10,
        grammar: [
          'konditionaalin preesens ja perfekti',
          'adjektiivit ton/tön ja llinen',
          'sanatyypit ton/tön ja lämmin',
          'adverbit sti',
        ],
        topics: ['ympäristönsuojelu', 'kierrätys'],
      },
      {
        number: 2,
        titleFi: 'Kaupunkifestivaalit',
        page: 46,
        grammar: [
          'passiivin preesens',
          'passiivin objekti',
          'nollapersoona',
          'Minua ärsyttää -rakenne',
          'ajan ilmauksia: Mihin aikaan?',
          'numeroiden taivutus',
        ],
        topics: ['kulttuuri ja taide', 'tapaamisesta sopiminen'],
      },
      {
        number: 3,
        titleFi: 'Pedron kaksi kotimaata',
        page: 84,
        grammar: [
          'passiivin imperfekti, perfekti ja pluskvamperfekti',
          'transitiivi- ja intransitiiviverbejä',
          'sanatyyppi kansi',
        ],
        topics: ['historia ja yhteiskunta', 'maantieto ja nähtävyydet'],
      },
      {
        number: 4,
        titleFi: 'Rakas Pedro',
        page: 118,
        grammar: [
          'imperatiivi: te-persoona',
          'ajan ilmauksia: Milloin? Kuinka kauan?',
          'passiivin konditionaali',
        ],
        topics: ['kirjeet ja sähköpostit'],
      },
      {
        number: 5,
        titleFi: 'Hannan salaisuus',
        page: 148,
        grammar: ['translatiivi', 'essiivi', 'Minusta tulee...', 'malla/matta/maton'],
        topics: ['perhe-elämä'],
      },
      {
        number: 6,
        titleFi: 'Kummallista',
        page: 180,
        grammar: [
          'adjektiivien komparatiivi',
          'pronominit kumpi, kumpikin, ei kumpikaan',
          'verbi + rektio',
        ],
        topics: ['kulttuurierot ja stereotypiat', 'luonteen kuvaileminen'],
      },
      {
        number: 7,
        titleFi: 'Markkinoiden paras',
        page: 220,
        grammar: ['adjektiivien superlatiivi'],
        topics: ['kodintekniikka ja työkalut', 'mainos', 'kokoamisohje'],
      },
      {
        number: 8,
        titleFi: 'Urheilusankareita',
        page: 254,
        grammar: ['adverbien vertailu', 'järjestysluvut', 'lausetyypit'],
        topics: ['urheilu'],
      },
    ],
    notes: [
      'Word lists inspected in batch 3: ch.1 pp.12/21, ch.2 p.49, ch.3 pp.87/94, ch.4 pp.121/129, ch.6 pp.183/192, ch.7 pp.223/229, ch.8 pp.257/265.',
      'Chapter 5 word lists (pp.151/161) were located but not matched against the dictionary yet.',
      'The book also has Lisäharjoitukset (p. 291) and an answer key (p. 309).',
    ],
  },
  {
    id: 'os1',
    title: 'Oma suomi 1',
    statedLevel: 'A1 (adult integration-training course book)',
    access: 'readable',
    pdfPages: 330,
    pageMapping:
      'Chapter openers were located in the body by their "TÄSSÄ KAPPALEESSA OPIT" banner, so PDF pages are recorded. The printed page numbers in the contents table could not be read reliably, because the contents is a multi-column table that extracts out of order — so no printed page is claimed here.',
    chapters: [
      {
        number: 1,
        titleFi: 'Tervetuloa!',
        pdfPage: 7,
        grammar: ['verbit olla, puhua ja asua'],
        topics: ['numerot', 'aakkoset', 'tervehdykset', 'esittäytyminen'],
      },
      {
        number: 2,
        titleFi: 'Susanin naapurit',
        pdfPage: 25,
        grammar: ['ko-kysymys', 'genetiivi', 'puhekielen persoonapronominit'],
        topics: ['maita ja kieliä', 'perheenjäsenet'],
      },
      {
        number: 3,
        titleFi: 'Keskiviikkona kesällä',
        pdfPage: 51,
        grammar: [
          'verbityypit 1-5',
          'negatiivinen verbintaivutus',
          'partitiivi',
          'minulla on -rakenne',
          '-ssa vai -lla?',
        ],
        topics: ['arkielämä', 'päivärytmi', 'kellonajat', 'viikonpäivät'],
      },
      {
        number: 4,
        titleFi: 'Ruokakaupassa',
        pdfPage: 77,
        grammar: ['partitiivin käyttö', 'perusasioita nominien taivutuksesta'],
        topics: ['ostostilanteet', 'ruokasanat', 'puhekielen numerot'],
      },
      {
        number: 5,
        titleFi: 'Tässä kaupungissa',
        pdfPage: 109,
        grammar: ['minulla on -rakenne'],
        topics: ['kotisanasto', 'paikkoja kaupungissa', 'värit', 'kierrätys'],
      },
      {
        number: 6,
        titleFi: '(kaupassa / vaatteet)',
        pdfPage: 135,
        grammar: ['lisää verbityypistä 1', 'paikkaa tarkoittavia pikkusanoja'],
        topics: ['vaatesanat'],
      },
      {
        number: 8,
        titleFi: 'Mikä hätänä?',
        pdfPage: 183,
        grammar: ['verbit täytyy ja ei tarvitse', 'i-, nen- ja si-sanat'],
        topics: ['ruumiinosat ja tuntemukset', 'ajan varaaminen'],
      },
      {
        number: 9,
        titleFi: 'Yllätysjuhlat',
        pdfPage: 213,
        grammar: [
          'verbit osata, voida ja saada',
          'kpt-vaihtelu verbityypeissä 3 ja 4',
          'predikatiivilause',
        ],
        topics: ['juhlat', 'ruokasanoja'],
      },
      {
        number: 10,
        titleFi: 'On hauskaa auttaa ystävää',
        pdfPage: 237,
        grammar: ['in-, us- ja e-sanat', 'perustietoja objektista'],
        topics: ['adjektiivit', 'avun pyytäminen'],
      },
      {
        number: 11,
        titleFi: 'Minun urapolkuni',
        pdfPage: 259,
        grammar: ['menneestä ajasta puhuminen'],
        topics: ['koulutus', 'työelämän sanastoa'],
      },
      {
        number: 12,
        titleFi: 'Mökillä',
        pdfPage: 277,
        grammar: ['sairas- ja kaunis-sanatyypit', 'menneestä ajasta kertominen'],
        topics: ['luonto', 'mielipiteen kertominen'],
      },
      {
        number: 13,
        titleFi: 'Pikku-uutisia',
        pdfPage: 299,
        grammar: [],
        topics: ['uutistekstit'],
      },
    ],
    notes: [
      'Chapter 7 was not located in this pass — no chapter banner was detected between PDF pages 135 and 183.',
    ],
  },

  {
    id: 'yki',
    title: 'A Step-by-Step Guide to Passing the YKI Test',
    access: 'readable',
    pdfPages: 75,
    pageMapping: 'Not yet established; no page is cited from this book yet.',
    limitation:
      'Read far enough to confirm it is a readable English-language guide to the YKI exam. Its chapters have not been mapped to lessons yet, so nothing cites it.',
    chapters: [],
  },

  {
    id: 'sm4',
    title: 'Suomen mestari 4',
    access: 'image-only',
    pdfPages: 321,
    limitation:
      'Every page probed (1-3, 25-27, 60-62, 120-122) returned zero characters: this PDF is scanned images with no text layer. Its contents could not be read, so nothing in the app cites it. Reading it would need OCR or page-by-page visual reading.',
    chapters: [],
  },

  {
    id: 'noniin1',
    title: 'No niin! 1',
    access: 'image-only',
    pdfPages: 173,
    limitation:
      'Same as Suomen mestari 4 — no text layer on any page probed, so no chapter or grammar point could be verified. Nothing cites it.',
    chapters: [],
  },

  {
    id: 'babadada',
    title: 'Babadada picture dictionaries (3 files)',
    access: 'sample-only',
    limitation:
      'These are not the full dictionaries: the three files are 6, 4 and 2 pages. Only the cover pages carry text; the vocabulary pages are images. No vocabulary could be extracted, so nothing cites them.',
    chapters: [],
  },
];

export const SOURCE_BY_ID = new Map(SOURCE_BOOKS.map((b) => [b.id, b]));

export function bookTitle(id: string): string {
  return SOURCE_BY_ID.get(id)?.title ?? id;
}

/** Books whose content could actually be read and cited. */
export const READABLE_BOOKS = SOURCE_BOOKS.filter((b) => b.access === 'readable');

/** Books that were supplied but could not be used, with the reason. */
export const UNUSABLE_BOOKS = SOURCE_BOOKS.filter((b) => b.access !== 'readable');
