import type { Word } from '@/types';

/**
 * Health words from a submitted list, batch 4.
 *
 * The list had 12 words. Six were already in the dictionary and are not
 * repeated here: sairaus, oire, kuume, kipu, lääke and levätä.
 *
 * The list gave a vartalo for every word. Nouns here carry nominalForms
 * instead, since `vartalo` is the present-tense stem of a verb.
 *
 * `source` is null throughout: the list came with no book, chapter or page.
 * The Finnish explanations (selitys) and the example sentences are the
 * list's own.
 */
export const BATCH_HEALTH: Word[] = [
  {
    id: 'n-terveys',
    fi: 'terveys',
    en: 'health',
    tl: 'kalusugan',
    type: 'substantiivi',
    level: 'A2.1',
    topics: ['terveys'],
    nominalForms: { genitive: 'terveyden', partitive: 'terveyttä' },
    selitys: 'Terveydentila eli se, miten hyvin ihminen voi.',
    examples: [
      { fi: 'Terveys on tärkeä asia.', en: 'Health is an important thing.', tl: 'Mahalagang bagay ang kalusugan.' },
    ],
    note: '-eys nouns change to -eyde- before most endings: terveys -> terveyden, but partitive terveyttä. Many compounds start with it: terveyskeskus, terveydenhoitaja.',
    noteTl: 'Ang -eys ay nagiging -eyde-: terveyden. Partitiivi: terveyttä. Hal.: terveyskeskus.',
    related: ['a-terve', 'n-terveyskeskus', 'n-hyvinvointi'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'n-laakariaika',
    fi: 'lääkäriaika',
    en: "doctor's appointment",
    tl: 'appointment sa doktor',
    type: 'substantiivi',
    level: 'A2.1',
    topics: ['terveys', 'palvelut'],
    nominalForms: { genitive: 'lääkäriajan', partitive: 'lääkäriaikaa', pluralPartitive: 'lääkäriaikoja' },
    selitys: 'Sovittu aika, jolloin tapaat lääkärin.',
    examples: [
      { fi: 'Minulla on lääkäriaika huomenna.', en: "I have a doctor's appointment tomorrow.", tl: 'May appointment ako sa doktor bukas.' },
    ],
    note: 'k ~ ø gradation, as in aika: lääkäriaika -> lääkäriajan. To book one is varata lääkäriaika.',
    noteTl: 'Astevaihtelu k ~ ø: lääkäriajan. Magpa-book: varata lääkäriaika.',
    related: ['n-laakari', 'n-aika', 'n-vastaanotto'],
    grammarRefs: ['g-kpt'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'n-vastaanotto',
    fi: 'vastaanotto',
    en: "reception; a doctor's appointment session",
    tl: 'konsultasyon, pagtanggap sa pasyente',
    type: 'substantiivi',
    level: 'A2.2',
    topics: ['terveys', 'palvelut'],
    nominalForms: { genitive: 'vastaanoton', partitive: 'vastaanottoa', illative: 'vastaanottoon' },
    selitys: 'Paikka tai tilanne, jossa terveydenhuollon ammattilainen tapaa potilaan.',
    examples: [
      { fi: 'Lääkärin vastaanotto alkaa kello yhdeksän.', en: "The doctor's appointments start at nine.", tl: 'Magsisimula ang konsultasyon sa doktor nang alas nuwebe.' },
    ],
    note: 'tt ~ t gradation: vastaanotto -> vastaanoton. You go to the doctor with the allative: mennä lääkärin vastaanotolle. It is also the reception desk of a hotel.',
    noteTl: 'Astevaihtelu tt ~ t. Pumunta sa doktor: mennä lääkärin vastaanotolle. Reception din ng hotel.',
    searchAliases: ['vastaanotolle', 'vastaanotolla'],
    related: ['v-vastaanottaa', 'n-vastaanottohuone', 'n-laakariaika'],
    grammarRefs: ['g-kpt'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'v-toipua',
    fi: 'toipua',
    en: 'to recover',
    tl: 'gumaling, makarekober',
    type: 'verbi',
    level: 'A2.2',
    topics: ['terveys'],
    vartalo: 'toivu-',
    verbType: 1,
    verbForms: {
      present1sg: 'toivun',
      present3sg: 'toipuu',
      present3pl: 'toipuvat',
      negativePresent: 'toivu',
      imperfect1sg: 'toivuin',
      pastParticiple: 'toipunut',
    },
    rections: [
      {
        pattern: 'toipua + -sta/-stä',
        example: 'Toivun flunssasta.',
        english: 'I am recovering from the flu.',
        tagalog: 'Gumagaling ako mula sa trangkaso.',
      },
    ],
    selitys: 'Tulla jälleen terveeksi sairauden jälkeen.',
    note: 'p ~ v gradation: toipua -> toivun. What you recover from is in the elative (-sta/-stä). The list gave the stem as toipu-; the personal forms use the weak grade, toivu-.',
    noteTl: 'Astevaihtelu p ~ v: toivun. Ang sakit ay nasa -sta/-stä: toipua flunssasta.',
    related: ['v-parantua', 'n-flunssa', 'n-sairaus'],
    grammarRefs: ['g-kpt', 'g-rektio'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'v-parantua',
    fi: 'parantua',
    en: 'to get better, to heal',
    tl: 'gumaling',
    type: 'verbi',
    level: 'A2.2',
    topics: ['terveys'],
    vartalo: 'parane-',
    verbType: 1,
    verbForms: {
      present1sg: 'paranen',
      present3sg: 'paranee',
      present3pl: 'paranevat',
      negativePresent: 'parane',
      imperfect1sg: 'paranin',
      pastParticiple: 'parantunut',
    },
    selitys: 'Tulla terveemmäksi tai päästä sairaudesta eroon.',
    examples: [
      { fi: 'Haava paranee nopeasti.', en: 'The wound is healing quickly.', tl: 'Mabilis na gumagaling ang sugat.' },
    ],
    note: 'Irregular. The usual forms are paranen, paranee, parani; the regular type 1 forms parannun, parantuu, parantui also exist but are less common. Not the same as parantaa, to improve or cure something.',
    noteTl: 'Iregular: paranen, paranee, parani. Mayroon ding parannun, parantui pero mas bihira.',
    searchAliases: ['parani', 'parannun', 'parantuu', 'parantui'],
    related: ['v-toipua', 'n-haava'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'n-hyvinvointi',
    fi: 'hyvinvointi',
    en: 'well-being',
    tl: 'pangkalahatang kagalingan',
    type: 'substantiivi',
    level: 'A2.2',
    topics: ['terveys', 'abstraktit'],
    nominalForms: { genitive: 'hyvinvoinnin', partitive: 'hyvinvointia' },
    selitys: 'Hyvä tila, jossa ihminen voi hyvin fyysisesti ja henkisesti.',
    examples: [
      { fi: 'Liikunta tukee hyvinvointia.', en: 'Exercise supports well-being.', tl: 'Nakakatulong ang ehersisyo sa pangkalahatang kagalingan.' },
    ],
    note: 'From voida hyvin, to be well. nt ~ nn gradation: hyvinvointi -> hyvinvoinnin.',
    noteTl: 'Mula sa voida hyvin (maging maayos ang pakiramdam). Astevaihtelu nt ~ nn.',
    related: ['n-terveys'],
    grammarRefs: ['g-kpt'],
    source: null,
    verification: 'linguistically-checked',
  },
];
