import type { Word } from '@/types';

/**
 * Bills, shopping and paperwork words from a submitted list, batch 5.
 *
 * The list had 12 words. Five were already in the dictionary and are not
 * repeated here: kuitti, palauttaa, vaihtaa, varata and ilmoittaa. perua was
 * only a search alias on the phrase "perua varaus", not a headword, so it is
 * entered here as one.
 *
 * The list gave a vartalo for every word. Nouns here carry nominalForms
 * instead, since `vartalo` is the present-tense stem of a verb. For verbs
 * with gradation the stem is the weak grade used in the personal forms
 * (täytä-, allekirjoita-), matching the rest of the dictionary; the list had
 * the strong grade.
 *
 * `source` is null throughout: the list came with no book, chapter or page.
 * The Finnish explanations (selitys) and the example sentences are the
 * list's own.
 */
export const BATCH_ERRANDS: Word[] = [
  {
    id: 'n-lasku',
    fi: 'lasku',
    en: 'bill, invoice',
    tl: 'bayarin, bill',
    type: 'substantiivi',
    level: 'A2.1',
    topics: ['palvelut', 'ostokset'],
    nominalForms: { genitive: 'laskun', partitive: 'laskua', pluralPartitive: 'laskuja' },
    selitys: 'Paperi tai sähköinen viesti, jossa kerrotaan, kuinka paljon pitää maksaa.',
    examples: [
      { fi: 'Sain sähkölaskun tänään.', en: 'I got the electricity bill today.', tl: 'Natanggap ko ang bill sa kuryente ngayon.' },
    ],
    note: 'Bills are named by compound: sähkölasku, vesilasku, puhelinlasku. maksaa lasku is to pay a bill. lasku can also mean a calculation or a descent.',
    noteTl: 'Hal.: sähkölasku (kuryente), vesilasku (tubig). maksaa lasku = magbayad ng bill.',
    related: ['n-erapaiva', 'n-maksu', 'v-maksaa'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'n-maksu',
    fi: 'maksu',
    en: 'payment, fee',
    tl: 'bayad, pagbabayad',
    type: 'substantiivi',
    level: 'A2.1',
    topics: ['palvelut', 'ostokset'],
    nominalForms: { genitive: 'maksun', partitive: 'maksua', pluralPartitive: 'maksuja' },
    selitys: 'Raha, joka maksetaan jostakin.',
    examples: [
      { fi: 'Maksu pitää tehdä ennen perjantaita.', en: 'The payment must be made before Friday.', tl: 'Kailangang magbayad bago mag-Biyernes.' },
    ],
    note: 'From maksaa, to pay. maksuton means free of charge.',
    noteTl: 'Mula sa maksaa (magbayad). maksuton = libre.',
    related: ['v-maksaa', 'n-lasku'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'n-erapaiva',
    fi: 'eräpäivä',
    en: 'due date',
    tl: 'takdang petsa ng pagbabayad',
    type: 'substantiivi',
    level: 'A2.2',
    topics: ['palvelut'],
    nominalForms: { genitive: 'eräpäivän', partitive: 'eräpäivää' },
    selitys: 'Päivä, johon mennessä lasku pitää maksaa.',
    examples: [
      { fi: 'Laskun eräpäivä on maanantaina.', en: 'The bill is due on Monday.', tl: 'Lunes ang takdang petsa ng pagbabayad ng bill.' },
    ],
    note: 'Printed on every Finnish bill. Paying after it usually adds a reminder fee, muistutusmaksu.',
    noteTl: 'Nakasulat sa bawat bill. Kapag huli, may muistutusmaksu (multa).',
    related: ['n-lasku', 'n-paiva'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'v-tilata',
    fi: 'tilata',
    en: 'to order',
    tl: 'umorder',
    type: 'verbi',
    level: 'A2.1',
    topics: ['ostokset', 'palvelut'],
    vartalo: 'tilaa-',
    verbType: 4,
    verbForms: {
      present1sg: 'tilaan',
      present3sg: 'tilaa',
      present3pl: 'tilaavat',
      negativePresent: 'tilaa',
      imperfect1sg: 'tilasin',
      pastParticiple: 'tilannut',
    },
    selitys: 'Pyytää tuotetta tai palvelua toimitettavaksi.',
    examples: [
      { fi: 'Haluan tilata uuden puhelimen.', en: 'I want to order a new phone.', tl: 'Gusto kong umorder ng bagong cellphone.' },
    ],
    note: 'Verb type 4 (-ata): the t drops and the vowel doubles, tilata -> tilaan. Used for food in a restaurant, goods online and taxis alike.',
    noteTl: 'Verbityyppi 4: tilaan. Para sa pagkain, online na bili at taxi.',
    grammarRefs: ['g-verbityypit'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'v-perua',
    fi: 'perua',
    en: 'to cancel',
    tl: 'kanselahin',
    type: 'verbi',
    level: 'A2.1',
    topics: ['palvelut', 'arki'],
    vartalo: 'peru-',
    verbType: 1,
    verbForms: {
      present1sg: 'perun',
      present3sg: 'peruu',
      present3pl: 'peruvat',
      negativePresent: 'peru',
      imperfect1sg: 'peruin',
      pastParticiple: 'perunut',
    },
    selitys: 'Ilmoittaa, ettei sovittu asia toteudukaan.',
    examples: [
      { fi: 'Minun täytyy perua tapaaminen.', en: 'I have to cancel the meeting.', tl: 'Kailangan kong kanselahin ang pagkikita.' },
    ],
    note: 'peruuttaa means the same and is equally common. The passive past participle peruttu means cancelled.',
    noteTl: 'Pareho ang peruuttaa. peruttu = kanselado.',
    related: ['v-peruuttaa', 'f-perua-varaus', 'a-peruttu'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'v-tayttaa',
    fi: 'täyttää',
    en: 'to fill in; to fill',
    tl: 'sagutan, punan',
    type: 'verbi',
    level: 'A2.1',
    topics: ['palvelut', 'arki'],
    vartalo: 'täytä-',
    verbType: 1,
    verbForms: {
      present1sg: 'täytän',
      present3sg: 'täyttää',
      present3pl: 'täyttävät',
      negativePresent: 'täytä',
      imperfect1sg: 'täytin',
      pastParticiple: 'täyttänyt',
    },
    selitys: 'Kirjoittaa tarvittavat tiedot lomakkeeseen tai tehdä jokin asia täydeksi.',
    examples: [
      { fi: 'Täytä tämä lomake, kiitos.', en: 'Please fill in this form.', tl: 'Pakisagutan ang form na ito.' },
      { fi: 'Täytän ensi kuussa 30 vuotta.', en: 'I turn 30 next month.', tl: 'Magiging 30 na ako sa susunod na buwan.' },
    ],
    note: 'tt ~ t gradation: täyttää -> täytän. From täysi, full. täyttää vuotta is how Finns say they turn an age.',
    noteTl: 'Astevaihtelu tt ~ t: täytän. Mula sa täysi (puno). täyttää vuotta = magdiwang ng edad.',
    related: ['n-lomake'],
    grammarRefs: ['g-kpt'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'v-allekirjoittaa',
    fi: 'allekirjoittaa',
    en: 'to sign',
    tl: 'pumirma',
    type: 'verbi',
    level: 'A2.2',
    topics: ['palvelut', 'tyo'],
    vartalo: 'allekirjoita-',
    verbType: 1,
    verbForms: {
      present1sg: 'allekirjoitan',
      present3sg: 'allekirjoittaa',
      present3pl: 'allekirjoittavat',
      negativePresent: 'allekirjoita',
      imperfect1sg: 'allekirjoitin',
      pastParticiple: 'allekirjoittanut',
    },
    selitys: 'Kirjoittaa oma nimi asiakirjaan.',
    examples: [
      { fi: 'Minun pitää allekirjoittaa sopimus.', en: 'I have to sign the contract.', tl: 'Kailangan kong pirmahan ang kontrata.' },
    ],
    note: 'Literally "to write under": alle + kirjoittaa. tt ~ t gradation: allekirjoitan. The signature itself is allekirjoitus.',
    noteTl: 'Literal na "isulat sa ilalim". Ang pirma: allekirjoitus.',
    related: ['n-allekirjoitus', 'n-sopimus', 'n-lomake'],
    grammarRefs: ['g-kpt'],
    source: null,
    verification: 'linguistically-checked',
  },
];
