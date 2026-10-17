import type { Word } from '@/types';

/**
 * High-frequency words the Situations dialogues needed and the dictionary did
 * not yet carry: the negative verb, the question word mikä with its case
 * forms, and two reply words.
 *
 * `scripts/validate-situations.mjs` surfaced them as forms with no dictionary
 * entry behind them. Each was then located in an Oma suomi 1 SANASTO list, so
 * each carries a chapter and printed page.
 */
export const OS1_CORE_WORDS: Word[] = [
  {
    id: 'v-ei',
    fi: 'ei',
    en: 'no, not',
    tl: 'hindi',
    type: 'verbi',
    level: 'A1',
    topics: ['perus'],
    vartalo: 'e-',
    // The negative is a verb in Finnish: it takes the person ending while the
    // main verb stays in its bare form. Hence the 'verbi' type.
    verbForms: {
      present1sg: 'en',
      present3sg: 'ei',
      present3pl: 'eivät',
    },
    examples: [
      { fi: 'Minä en puhu suomea.', en: 'I do not speak Finnish.', tl: 'Hindi ako nagsasalita ng Finnish.' },
      { fi: 'Se ei ole kaukana.', en: 'It is not far.', tl: 'Hindi iyon malayo.' },
      { fi: 'Mä en oo sairas.', en: 'I am not ill.', tl: 'Hindi ako may sakit.', register: 'puhekieli' },
    ],
    note: 'Finnish negates with a verb, not a particle: en, et, ei, emme, ette, eivät. The main verb loses its ending and keeps the bare stem - en puhu, ei ole. The -kä ending joins two negatives: en ja -> enkä.',
    noteTl: 'Pandiwa ang pananggi sa Finnish: en, et, ei, emme, ette, eivät. Nawawala ang ending ng pangunahing pandiwa - en puhu, ei ole.',
    searchAliases: ['en', 'et', 'emme', 'ette', 'eivät', 'enkä', 'eikä'],
    related: ['v-olla'],
    grammarRefs: ['g-kielto'],
    source: { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 1: Tervetuloa!', page: 23, section: 'SANASTO', sourceTerm: 'ei' },
    verification: 'source-verified',
  },
  {
    id: 'p-mika',
    fi: 'mikä',
    en: 'what, which',
    tl: 'ano, alin',
    type: 'pronomini',
    level: 'A1',
    topics: ['perus'],
    nominalForms: {
      genitive: 'minkä',
      partitive: 'mitä',
    },
    examples: [
      { fi: 'Mikä sinun nimesi on?', en: 'What is your name?', tl: 'Ano ang pangalan mo?' },
      { fi: 'Missä asema on?', en: 'Where is the station?', tl: 'Nasaan ang istasyon?' },
      { fi: 'Mitä oireita teillä on?', en: 'What symptoms do you have?', tl: 'Anong mga sintomas ang nararamdaman mo?' },
    ],
    note: 'The place forms are the question words of the local cases: missä (-ssa), mistä (-sta), mihin (-Vn). Oma suomi 1 prints them as separate word-list entries - missä in Kappale 1 (p. 23), mitä in Kappale 2 (p. 49), mihin in Kappale 10 (p. 257) and mistä in Kappale 11 (p. 274).',
    noteTl: 'Ang mga anyong panlugar ay ang mga tanong ng local cases: missä (-ssa), mistä (-sta), mihin (-Vn).',
    searchAliases: ['mitä', 'minkä', 'missä', 'mistä', 'mihin', 'millä', 'miksi'],
    related: ['p-tama', 'p-se'],
    grammarRefs: ['g-inessiivi', 'g-elatiivi', 'g-illatiivi'],
    source: { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 1: Tervetuloa!', page: 23, section: 'SANASTO', sourceTerm: 'mikä, minkä' },
    verification: 'source-verified',
  },
  {
    id: 'k-hei',
    fi: 'hei',
    en: 'hi, hello',
    tl: 'hi, kumusta',
    type: 'partikkeli',
    level: 'A1',
    topics: ['sosiaaliset'],
    examples: [
      { fi: 'Hei! Tarvitsetko apua?', en: 'Hi! Do you need help?', tl: 'Hi! Kailangan mo ba ng tulong?' },
      { fi: 'Hei, täällä Mark.', en: 'Hi, Mark here.', tl: 'Hi, si Mark ito.' },
    ],
    note: 'Works at any hour and with anyone, which hyvää päivää does not - that one belongs to offices and daytime.',
    noteTl: 'Pwede kahit anong oras at kahit kanino, hindi gaya ng hyvää päivää na pang-opisina at pang-araw.',
    source: { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 1: Tervetuloa!', page: 23, section: 'SANASTO', sourceTerm: 'hei' },
    verification: 'source-verified',
  },
  {
    id: 'adv-siella',
    fi: 'siellä',
    en: 'there',
    tl: 'doon',
    type: 'adverbi',
    level: 'A1',
    topics: ['perus'],
    examples: [
      { fi: 'Asema on siellä.', en: 'The station is there.', tl: 'Nandoon ang istasyon.' },
      { fi: 'Mä oon siel ovella.', en: 'I will be there at the door.', tl: 'Nandoon ako sa pintuan.', register: 'puhekieli' },
    ],
    note: 'One of the three distance words: täällä (here, by me), tuolla (over there, visible), siellä (there, further off or already mentioned). In speech they shorten to tääl, tuol, siel.',
    noteTl: 'Isa sa tatlong salita ng layo: täällä (dito), tuolla (doon, kita), siellä (doon, malayo o nabanggit na).',
    searchAliases: ['siel', 'sinne', 'sieltä'],
    related: ['adv-taalla'],
    grammarRefs: ['g-inessiivi'],
    source: { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 9: Yllätysjuhlat', page: 235, section: 'SANASTO', sourceTerm: 'siellä' },
    verification: 'source-verified',
  },
  {
    id: 'a-selva',
    fi: 'selvä',
    en: 'clear; right, understood',
    tl: 'malinaw; sige, naintindihan',
    type: 'adjektiivi',
    level: 'A2.1',
    topics: ['sosiaaliset'],
    nominalForms: {
      genitive: 'selvän',
      partitive: 'selvää',
    },
    examples: [
      { fi: 'Selvä. Mitä oireita teillä on?', en: 'Right. What symptoms do you have?', tl: 'Sige. Anong mga sintomas?' },
      { fi: 'Ohje on selvä.', en: 'The instruction is clear.', tl: 'Malinaw ang tagubilin.' },
    ],
    note: 'On its own, Selvä is the everyday "right, got it" that keeps a conversation moving. As an ordinary adjective it means clear or legible.',
    noteTl: 'Mag-isa, ang Selvä ay "sige, naintindihan". Bilang pang-uri, ibig sabihin ay malinaw.',
    related: ['v-selvittaa'],
    source: { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 8: Mikä hätänä?', page: 204, section: 'SANASTO', sourceTerm: 'selvä' },
    verification: 'source-verified',
  },
];
