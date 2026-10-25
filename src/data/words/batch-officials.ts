import type { Word } from '@/types';

/**
 * Officials, applications and rights, from a submitted list, batch 7.
 *
 * The list had 12 words. Five were already in the dictionary and are not
 * repeated here: hakemus, päätös, todistus, hyväksyä and hylätä.
 *
 * The list gave a vartalo for every word. Nouns here carry nominalForms
 * instead, since `vartalo` is the present-tense stem of a verb.
 *
 * `source` is null throughout: the list came with no book, chapter or page.
 * The Finnish explanations (selitys) and the example sentences are the
 * list's own.
 */
export const BATCH_OFFICIALS: Word[] = [
  {
    id: 'n-viranomainen',
    fi: 'viranomainen',
    en: 'authority, public official',
    tl: 'awtoridad, opisyal ng gobyerno',
    type: 'substantiivi',
    level: 'B1',
    topics: ['palvelut'],
    nominalForms: { genitive: 'viranomaisen', partitive: 'viranomaista', pluralPartitive: 'viranomaisia' },
    selitys: 'Henkilö tai organisaatio, joka hoitaa virallisia asioita.',
    examples: [
      { fi: 'Kysyin asiasta viranomaiselta.', en: 'I asked the authorities about it.', tl: 'Nagtanong ako tungkol dito sa awtoridad.' },
    ],
    note: '-nen nouns change to -se- before endings: viranomainen -> viranomaisen, partitive viranomaista. Kela, the police and Migri are all viranomaiset. From virka, office.',
    noteTl: 'Ang -nen ay nagiging -se-: viranomaisen. Hal.: Kela, pulis, Migri.',
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'n-etuus',
    fi: 'etuus',
    en: 'benefit, social benefit',
    tl: 'benepisyo, tulong pinansyal',
    type: 'substantiivi',
    level: 'B1',
    topics: ['palvelut'],
    nominalForms: { genitive: 'etuuden', partitive: 'etuutta', pluralPartitive: 'etuuksia' },
    selitys: 'Tuki tai muu hyöty, jonka henkilö voi saada tietyin ehdoin.',
    examples: [
      { fi: 'Haen asumistukea ja muuta etuutta.', en: 'I am applying for housing allowance and other benefits.', tl: 'Nag-a-apply ako para sa housing allowance at iba pang benepisyo.' },
    ],
    note: 'The umbrella word in Kela letters for asumistuki, lapsilisä, työttömyysturva and the rest. -uus nouns change to -uude-: etuuden, partitive etuutta.',
    noteTl: 'Pangkalahatang salita sa sulat ng Kela para sa asumistuki, lapsilisä, atbp.',
    related: ['n-hakemus', 'n-paatos'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'n-asiakirja',
    fi: 'asiakirja',
    en: 'document',
    tl: 'dokumento',
    type: 'substantiivi',
    level: 'A2.2',
    topics: ['palvelut'],
    nominalForms: { genitive: 'asiakirjan', partitive: 'asiakirjaa', pluralPartitive: 'asiakirjoja' },
    selitys: 'Kirjallinen tai sähköinen dokumentti, jossa on tietoja.',
    examples: [
      { fi: 'Tarvitsen asiakirjan hakemusta varten.', en: 'I need a document for the application.', tl: 'Kailangan ko ng dokumento para sa aplikasyon.' },
    ],
    note: 'asia + kirja. The formal word; in speech people often say paperi or paperit.',
    noteTl: 'asia + kirja. Pormal; sa salita madalas paperit.',
    related: ['n-todistus', 'n-lomake'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'n-lupa',
    fi: 'lupa',
    en: 'permission, permit',
    tl: 'pahintulot, permit',
    type: 'substantiivi',
    level: 'A2.2',
    topics: ['palvelut', 'tyo'],
    nominalForms: { genitive: 'luvan', partitive: 'lupaa', pluralPartitive: 'lupia' },
    selitys: 'Oikeus tehdä jotakin, joka vaatii luvan.',
    examples: [
      { fi: 'Tarvitsen luvan tähän työhön.', en: 'I need a permit for this job.', tl: 'Kailangan ko ng pahintulot para sa trabahong ito.' },
    ],
    note: 'p ~ v gradation: lupa -> luvan. Common compounds: oleskelulupa (residence permit), työlupa (work permit). saada lupa = to get permission.',
    noteTl: 'Astevaihtelu p ~ v: luvan. oleskelulupa = residence permit, työlupa = work permit.',
    searchAliases: ['oleskelulupa', 'työlupa'],
    related: ['n-oikeus'],
    grammarRefs: ['g-kpt'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'n-maaraaika',
    fi: 'määräaika',
    en: 'deadline, time limit',
    tl: 'deadline, takdang panahon',
    type: 'substantiivi',
    level: 'B1',
    topics: ['palvelut', 'tyo'],
    nominalForms: { genitive: 'määräajan', partitive: 'määräaikaa' },
    selitys: 'Viimeinen päivä tai aika, johon mennessä jokin pitää tehdä.',
    examples: [
      { fi: 'Hakemuksen määräaika on perjantaina.', en: 'The application deadline is on Friday.', tl: 'Biyernes ang deadline ng aplikasyon.' },
    ],
    note: 'k ~ ø gradation, as in aika: määräajan. määräaikainen means fixed-term, as in a fixed-term job contract. For a bill, the word is eräpäivä.',
    noteTl: 'Astevaihtelu k ~ ø: määräajan. määräaikainen = may takdang panahon (hal. kontrata).',
    related: ['n-aika', 'n-erapaiva'],
    grammarRefs: ['g-kpt'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'n-velvollisuus',
    fi: 'velvollisuus',
    en: 'duty, obligation',
    tl: 'tungkulin, obligasyon',
    type: 'substantiivi',
    level: 'B1',
    topics: ['palvelut', 'abstraktit'],
    nominalForms: { genitive: 'velvollisuuden', partitive: 'velvollisuutta', pluralPartitive: 'velvollisuuksia' },
    selitys: 'Asia, joka pitää tehdä tai josta henkilö vastaa.',
    examples: [
      { fi: 'Veron maksaminen on velvollisuus.', en: 'Paying taxes is a duty.', tl: 'Tungkulin ang pagbabayad ng buwis.' },
    ],
    note: 'Often paired with oikeus: oikeudet ja velvollisuudet, rights and duties. -uus nouns change to -uude-: velvollisuuden.',
    noteTl: 'Kadalasang kasama ng oikeus: oikeudet ja velvollisuudet (karapatan at tungkulin).',
    related: ['n-oikeus'],
    source: null,
    verification: 'linguistically-checked',
  },
  {
    id: 'n-oikeus',
    fi: 'oikeus',
    en: 'right, entitlement; court of law',
    tl: 'karapatan; korte',
    type: 'substantiivi',
    level: 'A2.2',
    topics: ['palvelut', 'abstraktit'],
    nominalForms: { genitive: 'oikeuden', partitive: 'oikeutta', pluralPartitive: 'oikeuksia' },
    selitys: 'Mahdollisuus tai lupa, joka kuuluu henkilölle lain tai sääntöjen perusteella.',
    examples: [
      { fi: 'Jokaisella on oikeus saada tietoa.', en: 'Everyone has the right to get information.', tl: 'May karapatan ang lahat na makatanggap ng impormasyon.' },
    ],
    note: 'olla oikeus + infinitive: on oikeus saada. It also means a court of law (käräjäoikeus). From oikea, right or correct. -eus nouns change to -eude-: oikeuden.',
    noteTl: 'olla oikeus + infinitiivi. Korte rin ito (käräjäoikeus). Mula sa oikea (tama).',
    related: ['n-velvollisuus', 'a-oikea', 'n-lupa'],
    source: null,
    verification: 'linguistically-checked',
  },
];
