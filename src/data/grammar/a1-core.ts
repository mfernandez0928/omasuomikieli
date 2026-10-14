import type { GrammarLesson } from '@/types';

/**
 * A1 foundations: sound rules, verb types, present tense, negation, gradation
 * and the two most important cases.
 *
 * The vowel-harmony, verb-type and partitive lessons expand the five grammar
 * stubs in the supplied v0.2.1 database into full lessons with exercises. The
 * supplied rules were hedged ("often", "commonly") and are stated precisely
 * here, including the exceptions the originals warned about.
 *
 * source is null throughout: no supplied book was available to cite.
 */
export const A1_CORE: GrammarLesson[] = [
  {
    id: 'g-vokaaliharmonia',
    order: 1,
    title: '-ja or -jä?',
    subtitle: 'Vowel harmony',
    level: 'A1',
    finnishTerm: 'vokaaliharmonia',
    minutes: 4,
    moduleId: 'm-basic',
    levelBasis:
      'Not found in the contents of any readable source, so the level is this app\'s own judgement and is not confirmed by a book.',
    intro:
      'Finnish vowels come in two families, and a word can only use one family at a time. This single rule decides whether an ending is written with a or ä, o or ö, u or y.',
    introTl:
      'May dalawang pamilya ang mga patinig sa suomi, at iisang pamilya lang ang pwede sa isang salita. Ito ang nagdedesisyon kung -ja o -jä ang gagamitin.',
    rule: 'Back vowels are a, o, u. Front vowels are ä, ö, y. The vowels e and i are neutral and may appear in either kind of word. If a word contains any of a, o, u, every ending takes the back form (-ja, -ssa, -lla). Otherwise the ending takes the front form (-jä, -ssä, -llä).',
    easyRule: {
      left: 'a, o, u → -ja',
      leftNote: 'use -ja with back vowels',
      right: 'ä, ö, y → -jä',
      rightNote: 'use -jä with front vowels',
    },
    examples: [
      { fi: 'opettaja', en: 'teacher', tl: 'guro', tag: 'a·o·u', highlight: 'ja' },
      { fi: 'laulaja', en: 'singer', tl: 'mang-aawit', tag: 'a·o·u', highlight: 'ja' },
      { fi: 'kirjoittaja', en: 'writer', tl: 'manunulat', tag: 'a·o·u', highlight: 'ja' },
      { fi: 'myyjä', en: 'seller', tl: 'tindero/tindera', tag: 'ä·ö·y', highlight: 'jä' },
      { fi: 'käyttäjä', en: 'user', tl: 'gumagamit', tag: 'ä·ö·y', highlight: 'jä' },
      { fi: 'kävelijä', en: 'walker', tl: 'taong naglalakad', tag: 'ä·ö·y', highlight: 'jä' },
    ],
    exceptions: [
      {
        title: 'e and i are neutral, not front',
        body: 'A word whose only vowels are e and i takes FRONT endings: meri → meressä, tie → tiellä. But as soon as a back vowel appears anywhere in the word, the back form wins - the e and i are simply ignored.',
        examples: [
          { fi: 'kävelijä', en: 'walker', tl: 'naglalakad', tag: 'ä wins over e, i' },
          { fi: 'kirjoittaja', en: 'writer', tl: 'manunulat', tag: 'o, a win over i' },
          { fi: 'meressä', en: 'in the sea', tl: 'sa dagat', tag: 'only e → front' },
        ],
      },
      {
        title: 'Compound words harmonise separately',
        body: 'Each part of a compound keeps its own harmony, and the ending follows the LAST part only.',
        examples: [
          { fi: 'työpaikassa', en: 'at the workplace', tl: 'sa pinagtatrabahuhan', tag: 'paikka → -ssa' },
          { fi: 'kesäkuussa', en: 'in June', tl: 'sa Hunyo', tag: 'kuu → -ssa' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'käyttäja',
        right: 'käyttäjä',
        why: 'The stem has ä and y, both front vowels, so the suffix must be -jä.',
        whyTl: 'May ä at y ang salita - parehong front vowel - kaya -jä ang tama.',
      },
      {
        wrong: 'opettajä',
        right: 'opettaja',
        why: 'The stem has o and a, both back vowels, so the suffix must be -ja.',
        whyTl: 'May o at a ang salita, kaya -ja ang tama.',
      },
      {
        wrong: 'kävelija',
        right: 'kävelijä',
        why: 'The ä decides it. The neutral e and i never force the back form.',
        whyTl: 'Ang ä ang nagdedesisyon. Hindi nakakaapekto ang e at i.',
      },
    ],
    tip: 'Scan the word for a, o or u. Found one? Everything is back (-ja, -ssa, -lla). Found none? Everything is front (-jä, -ssä, -llä).',
    tipTl:
      'Hanapin ang a, o, u. Kung meron - back lahat (-ja). Kung wala - front lahat (-jä).',
    exercises: [
      {
        id: 'ex-vh-1',
        kind: 'choose-form',
        prompt: 'Choose the correct form (-ja or -jä).',
        question: 'Hänen työnsä on opettaa. Hän on ___.',
        hint: 'opettaa → the person who does it',
        options: ['opettaja', 'opettajä', 'opettajia'],
        answer: 'opettaja',
        explanation:
          'opettaa contains o, e and a. The back vowels o and a are present, so the suffix is -ja: opettaja.',
        explanationTl:
          'May o at a ang "opettaa" - back vowels - kaya -ja: opettaja.',
        grammarId: 'g-vokaaliharmonia',
      },
      {
        id: 'ex-vh-2',
        kind: 'choose-form',
        prompt: 'Choose the correct form.',
        question: 'Hän käyttää sovellusta. Hän on ___.',
        hint: 'käyttää → the person who does it',
        options: ['käyttäja', 'käyttäjä', 'käyttäja'],
        answer: 'käyttäjä',
        explanation:
          'käyttää has ä and y - both front vowels - and no a, o or u anywhere, so the suffix must be -jä: käyttäjä.',
        explanationTl:
          'May ä at y ang "käyttää", at walang a/o/u, kaya -jä: käyttäjä.',
        grammarId: 'g-vokaaliharmonia',
      },
      {
        id: 'ex-vh-3',
        kind: 'multiple-choice',
        prompt: 'Which ending does "meri" (sea) take in the -ssa/-ssä case?',
        question: 'Kala ui ___.',
        hint: 'meri = sea; only e and i in the word',
        options: ['meressa', 'meressä', 'merissa'],
        answer: 'meressä',
        explanation:
          'meri contains only the neutral vowels e and i. A word with no back vowel takes the FRONT ending, so it is meressä. This is the exception most learners get wrong.',
        explanationTl:
          'Puro neutral (e, i) ang "meri". Kapag walang back vowel, front ang ending: meressä.',
        grammarId: 'g-vokaaliharmonia',
      },
      {
        id: 'ex-vh-4',
        kind: 'choose-form',
        prompt: 'Choose the correct ending for this compound word.',
        question: 'Olen ___. (työpaikka)',
        hint: 'The ending follows the last part of the compound',
        options: ['työpaikassa', 'työpaikässä', 'työpaikkässä'],
        answer: 'työpaikassa',
        explanation:
          'In a compound only the last part decides. "paikka" has a, a back vowel, so the ending is -ssa - even though "työ" has ö.',
        explanationTl:
          'Sa compound, ang huling bahagi lang ang nagdedesisyon. "paikka" may a, kaya -ssa.',
        grammarId: 'g-vokaaliharmonia',
      },
      {
        id: 'ex-vh-5',
        kind: 'correct-sentence',
        prompt: 'One word has the wrong vowel harmony. Write the whole sentence correctly.',
        question: 'Myyja auttaa asiakasta.',
        hint: 'Look at the first word',
        answer: 'Myyjä auttaa asiakasta.',
        alsoAccept: ['myyjä auttaa asiakasta'],
        explanation:
          'myydä has the front vowel y and no back vowel, so the agent noun is myyjä with -jä.',
        explanationTl: 'May y ang "myydä" at walang a/o/u, kaya "myyjä".',
        grammarId: 'g-vokaaliharmonia',
      },
    ],
    relatedGrammar: ['g-verbityypit', 'g-inessiivi'],
    relatedWords: ['n-opettaja', 'n-myyja', 'n-kayttaja', 'n-kavelija', 'n-laulaja', 'n-kirjoittaja'],
    origin: 'supplementary',
    openQuestion:
      'Vowel harmony is not listed as a grammar point in the contents of Oma suomi 1, Suomen mestari 2 or Suomen mestari 3. It is almost certainly taught inside an early chapter or the Minikielioppi, but that was not verified, so this lesson is additional content.',
    source: null,
    verification: 'linguistically-checked',
  },

  {
    id: 'g-verbityypit',
    order: 2,
    title: '6 Finnish verb types',
    subtitle: 'by their endings',
    level: 'A1',
    finnishTerm: 'verbityypit',
    minutes: 7,
    moduleId: 'm-basic',
    levelBasis:
      'Oma suomi 1 teaches this (book 1 of an adult integration course). That book states no CEFR level, so A1 is an inference from its position in the series, not a quoted level.',
    intro:
      'Every Finnish verb belongs to one of six types. The type is decided by how the dictionary form ends, and it tells you exactly how to build the stem you add personal endings to. Learn the six patterns and you can conjugate almost any verb you meet.',
    introTl:
      'Anim na uri ang verbo sa suomi. Ang dulo ng salita ang nagsasabi kung anong uri, at ang uri ang nagsasabi kung paano gawin ang vartalo. Kabisaduhin ang anim - kaya mo nang i-conjugate ang halos lahat.',
    rule: 'Type 1 ends in a vowel + -a/-ä: drop the final -a/-ä. Type 2 ends in -da/-dä: drop -da/-dä. Type 3 ends in -la/-lä, -na/-nä, -ra/-rä or -sta/-stä: drop the last two letters and add -e-. Type 4 ends in -ata/-ätä, -ota/-ötä, -uta/-ytä: drop the -t- so the vowel doubles. Type 5 ends in -ita/-itä: replace -ita/-itä with -itse-. Type 6 ends in -eta/-etä: replace -eta/-etä with -ene-.',
    easyRule: {
      left: 'Find the ending',
      leftNote: '-a · -da · -la · -ata · -ita · -eta',
      right: 'Build the stem',
      rightNote: 'then add -n, -t, -mme, -tte, -vat',
    },
    examples: [
      { fi: 'puhua → puhun, puhut, puhuu', en: 'to speak → I/you/he speak(s)', tl: 'magsalita', tag: 'tyyppi 1' },
      { fi: 'syödä → syön, syöt, syö', en: 'to eat', tl: 'kumain', tag: 'tyyppi 2' },
      { fi: 'tulla → tulen, tulet, tulee', en: 'to come', tl: 'dumating', tag: 'tyyppi 3' },
      { fi: 'pelata → pelaan, pelaat, pelaa', en: 'to play', tl: 'maglaro', tag: 'tyyppi 4' },
      { fi: 'tarvita → tarvitsen, tarvitset, tarvitsee', en: 'to need', tl: 'kailanganin', tag: 'tyyppi 5' },
      { fi: 'vanheta → vanhenen, vanhenet, vanhenee', en: 'to get old', tl: 'tumanda', tag: 'tyyppi 6' },
    ],
    exceptions: [
      {
        title: 'Type 1 is the only type with consonant gradation in the present',
        body: 'In types 2-6 the stem stays the same in every person. In type 1, the minä/sinä/me/te forms often use the weak grade while hän/he keep the strong one.',
        examples: [
          { fi: 'ottaa → otan, mutta hän ottaa', en: 'to take → I take, but he takes', tl: 'kunin', tag: 'tt → t' },
          { fi: 'lukea → luen, mutta hän lukee', en: 'to read', tl: 'magbasa', tag: 'k → -' },
        ],
      },
      {
        title: 'The hän form of type 1 doubles the vowel',
        body: 'In type 1, hän takes a long vowel: puhu + u = puhuu. In the other types the 3rd person simply has no ending at all: hän syö, hän tulee, hän pelaa.',
        examples: [
          { fi: 'hän puhuu', en: 'he/she speaks', tl: 'nagsasalita siya', tag: 'tyyppi 1' },
          { fi: 'hän syö', en: 'he/she eats', tl: 'kumakain siya', tag: 'tyyppi 2' },
        ],
      },
      {
        title: 'Not every -ita verb is type 5',
        body: 'tarvita, valita, mainita and häiritä all take -itse- (tarvitsen, valitsen). But a few verbs that look the same do not: selvitä → selviän, hävitä → häviän. When in doubt, check the verb rather than trusting the ending.',
        examples: [
          { fi: 'valita → valitsen', en: 'to choose → I choose', tl: 'pumili', tag: 'tyyppi 5' },
          { fi: 'selvitä → selviän', en: 'to manage → I manage', tl: 'makakaya', tag: 'poikkeus' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'minä tarvitin',
        right: 'minä tarvitsen',
        why: 'tarvita is type 5, so the stem is tarvitse-, not tarvit-.',
        whyTl: 'Tyyppi 5 ang tarvita: tarvitse- ang vartalo, hindi tarvit-.',
      },
      {
        wrong: 'minä tulin kotiin nyt',
        right: 'minä tulen kotiin nyt',
        why: 'The type 3 present stem is tule-, giving tulen. tulin is the past tense.',
        whyTl: 'tulen = ngayon. tulin = kahapon (imperfekti).',
      },
      {
        wrong: 'hän puhu',
        right: 'hän puhuu',
        why: 'Type 1 lengthens the final vowel in the hän form: puhu + u.',
        whyTl: 'Sa tyyppi 1, humahaba ang patinig sa hän: puhuu.',
      },
    ],
    tip: 'Look at the last two letters of the dictionary form. -da → type 2. -ita → type 5. -eta → type 6. -ata/-ota/-uta → type 4. -la/-na/-ra/-sta → type 3. Anything else ending in a vowel + a/ä → type 1.',
    tipTl:
      'Tingnan ang huling dalawang letra: -da = 2, -ita = 5, -eta = 6, -ata = 4, -la/-na/-ra/-sta = 3, iba pa = 1.',
    exercises: [
      {
        id: 'ex-vt-1',
        kind: 'multiple-choice',
        prompt: 'Which verb type is "mennä"?',
        question: 'mennä',
        hint: 'Look at the last two letters',
        options: ['Type 1', 'Type 3', 'Type 4'],
        answer: 'Type 3',
        explanation:
          'mennä ends in -nä, which is in the type 3 group (-la/-lä, -na/-nä, -ra/-rä, -sta/-stä). Drop the last two letters and add -e-: mene- → menen.',
        explanationTl:
          'Nagtatapos sa -nä, kaya tyyppi 3. Alisin ang huling dalawa, dagdagan ng -e-: menen.',
        grammarId: 'g-verbityypit',
      },
      {
        id: 'ex-vt-2',
        kind: 'conjugate',
        prompt: 'Write the minä form.',
        question: 'tarvita → minä ___',
        hint: 'Type 5',
        answer: 'tarvitsen',
        explanation:
          'Type 5 replaces -ita with -itse-, so the stem is tarvitse-, and minä adds -n: tarvitsen.',
        explanationTl: 'Tyyppi 5: -ita → -itse-. Kaya tarvitsen.',
        grammarId: 'g-verbityypit',
        wordId: 'v-tarvita',
      },
      {
        id: 'ex-vt-3',
        kind: 'conjugate',
        prompt: 'Write the hän form.',
        question: 'puhua → hän ___',
        hint: 'Type 1 - what happens to the final vowel?',
        answer: 'puhuu',
        explanation:
          'Type 1 drops the -a to give the stem puhu-, and the hän form lengthens the final vowel: puhuu.',
        explanationTl: 'Tyyppi 1: puhu- ang vartalo, at humahaba ang patinig sa hän: puhuu.',
        grammarId: 'g-verbityypit',
        wordId: 'v-puhua',
      },
      {
        id: 'ex-vt-4',
        kind: 'conjugate',
        prompt: 'Write the minä form.',
        question: 'vanheta → minä ___',
        hint: 'Type 6, the rarest one',
        answer: 'vanhenen',
        explanation:
          'Type 6 replaces -eta/-etä with -ene-, giving the stem vanhene-, then minä adds -n: vanhenen.',
        explanationTl: 'Tyyppi 6: -eta → -ene-. Kaya vanhenen.',
        grammarId: 'g-verbityypit',
      },
      {
        id: 'ex-vt-5',
        kind: 'match',
        prompt: 'Match each verb with its type.',
        question: 'Match the verb to its type',
        answer: 'matched',
        pairs: [
          { left: 'syödä', right: 'Type 2' },
          { left: 'tulla', right: 'Type 3' },
          { left: 'pelata', right: 'Type 4' },
          { left: 'valita', right: 'Type 5' },
        ],
        explanation:
          '-da → 2, -la → 3, -ata → 4, -ita → 5. The ending alone tells you the type for these four.',
        explanationTl: '-da = 2, -la = 3, -ata = 4, -ita = 5.',
        grammarId: 'g-verbityypit',
      },
      {
        id: 'ex-vt-6',
        kind: 'conjugate',
        prompt: 'Write the minä form.',
        question: 'pelata → minä ___',
        hint: 'Type 4 - the -t- disappears',
        answer: 'pelaan',
        explanation:
          'Type 4 drops the -t-, so pela-t-a becomes the stem pelaa-, and minä adds -n: pelaan.',
        explanationTl: 'Tyyppi 4: nawawala ang -t-. pelaa- + n = pelaan.',
        grammarId: 'g-verbityypit',
      },
    ],
    relatedGrammar: ['g-preesens', 'g-kpt', 'g-vokaaliharmonia'],
    relatedWords: ['v-puhua', 'v-tarvita', 'v-tulla', 'v-menna', 'v-tehda', 'v-edeta'],
    origin: 'source-derived',
    source: { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 3: Keskiviikkona kesällä', pdfPage: 51, sourceTerm: 'verbityypit 1-5' },
    alsoIn: [
      { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 3: Mökillä', page: 80, sourceTerm: 'verbityyppi 6' },
    ],
    verification: 'source-verified',
  },

  {
    id: 'g-preesens',
    order: 3,
    title: 'Persoonamuodot & present tense',
    subtitle: 'the six persons, positive and negative',
    level: 'A1',
    finnishTerm: 'preesens',
    minutes: 7,
    moduleId: 'm-basic',
    levelBasis:
      'Oma suomi 1 teaches this (book 1 of an adult integration course). That book states no CEFR level, so A1 is an inference from its position in the series, not a quoted level.',
    intro:
      'Finnish has one present tense and it covers both "I speak" and "I am speaking". It also covers the future: "Menen huomenna" means "I will go tomorrow". There is no separate future tense to learn.',
    introTl:
      'Isang present tense lang ang suomi, at ito rin ang ginagamit para sa hinaharap. Walang hiwalay na future tense.',
    rule: 'Take the stem from the verb type, then add the personal ending: minä -n, sinä -t, hän (long vowel in type 1, nothing elsewhere), me -mme, te -tte, he -vat/-vät.',
    easyRule: {
      left: 'stem + ending',
      leftNote: '-n · -t · — · -mme · -tte · -vat',
      right: 'one tense',
      rightNote: 'covers present AND future',
    },
    examples: [
      { fi: 'minä puhun', en: 'I speak / I am speaking', tl: 'nagsasalita ako', tag: '-n' },
      { fi: 'sinä puhut', en: 'you speak', tl: 'nagsasalita ka', tag: '-t' },
      { fi: 'hän puhuu', en: 'he/she speaks', tl: 'nagsasalita siya', tag: 'long vowel' },
      { fi: 'me puhumme', en: 'we speak', tl: 'nagsasalita kami', tag: '-mme' },
      { fi: 'te puhutte', en: 'you (pl) speak', tl: 'nagsasalita kayo', tag: '-tte' },
      { fi: 'he puhuvat', en: 'they speak', tl: 'nagsasalita sila', tag: '-vat' },
    ],
    tables: [
      {
        title: 'The six persons',
        headers: ['Persoona', 'English', 'Tagalog'],
        rows: [
          ['minä', 'I', 'ako'],
          ['sinä', 'you (singular)', 'ikaw'],
          ['hän', 'he / she', 'siya'],
          ['me', 'we', 'kami / tayo'],
          ['te', 'you (plural, or polite singular)', 'kayo'],
          ['he', 'they', 'sila'],
        ],
        note: 'hän covers both he and she - Finnish has no grammatical gender. te is both the plural "you" and the polite singular, exactly like Tagalog kayo.',
        noteTl: 'Walang kasarian: hän = siya (lalaki o babae). Ang te ay "kayo" - pangmaramihan at magalang.',
      },
      {
        title: 'Positive present - three verb types side by side',
        headers: ['Persoona', 'puhua (1)', 'syödä (2)', 'tulla (3)'],
        rows: [
          ['minä', 'puhun', 'syön', 'tulen'],
          ['sinä', 'puhut', 'syöt', 'tulet'],
          ['hän', 'puhuu', 'syö', 'tulee'],
          ['me', 'puhumme', 'syömme', 'tulemme'],
          ['te', 'puhutte', 'syötte', 'tulette'],
          ['he', 'puhuvat', 'syövät', 'tulevat'],
        ],
        note: 'The endings -n, -t, -mme, -tte, -vat/-vät never change. Only the stem differs: puhu-, syö-, tule-. In type 1 the hän form lengthens the final vowel (puhuu); in types 2 and 3 it simply has no ending (syö, tulee).',
        noteTl: 'Hindi nagbabago ang mga ending. Ang vartalo lang ang nagkakaiba: puhu-, syö-, tule-.',
      },
      {
        title: 'Negative present - ei takes the person, the verb goes bare',
        headers: ['Persoona', 'kieltoverbi', 'puhua', 'ymmärtää'],
        rows: [
          ['minä', 'en', 'en puhu', 'en ymmärrä'],
          ['sinä', 'et', 'et puhu', 'et ymmärrä'],
          ['hän', 'ei', 'ei puhu', 'ei ymmärrä'],
          ['me', 'emme', 'emme puhu', 'emme ymmärrä'],
          ['te', 'ette', 'ette puhu', 'ette ymmärrä'],
          ['he', 'eivät', 'eivät puhu', 'eivät ymmärrä'],
        ],
        note: 'Build the bare form from the minä form by deleting the -n: ymmärrän -> ymmärrä. That keeps the weak consonant grade automatically, which is why it is ymmärrä and not *ymmärtä.',
        noteTl: 'Simulan sa minä form, alisin ang -n: ymmärrän -> ymmärrä. Tama agad ang KPT.',
      },
      {
        title: 'olla - the one you need most, and it is irregular',
        headers: ['Persoona', 'positive', 'negative'],
        rows: [
          ['minä', 'olen', 'en ole'],
          ['sinä', 'olet', 'et ole'],
          ['hän', 'on', 'ei ole'],
          ['me', 'olemme', 'emme ole'],
          ['te', 'olette', 'ette ole'],
          ['he', 'ovat', 'eivät ole'],
        ],
        note: 'hän on (not *olee) and he ovat (not *olevat) are the two forms to memorise.',
        noteTl: 'Kabisaduhin: hän on at he ovat - irregular ang dalawang ito.',
      },
    ],
    exceptions: [
      {
        title: 'The pronoun can be dropped - but only for minä and sinä',
        body: 'The endings -n and -t already say who is acting, so "Puhun suomea" is complete. With hän and he the pronoun must stay, because the verb alone does not identify the person.',
        examples: [
          { fi: 'Puhun suomea.', en: 'I speak Finnish.', tl: 'Nagsasalita ako ng suomi.', tag: 'ok' },
          { fi: 'Hän puhuu suomea.', en: 'He speaks Finnish.', tl: 'Nagsasalita siya.', tag: 'keep hän' },
        ],
      },
      {
        title: 'olla is irregular in the hän form',
        body: 'Every other verb builds the hän form from its stem, but olla gives "on", not *olee. The plural "ovat" is equally irregular.',
        examples: [
          { fi: 'hän on', en: 'he/she is', tl: 'siya ay', tag: 'irregular' },
          { fi: 'he ovat', en: 'they are', tl: 'sila ay', tag: 'irregular' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Minä olen puhun suomea.',
        right: 'Minä puhun suomea.',
        why: 'Finnish has no auxiliary "am" in the present. The ending -n carries everything.',
        whyTl: 'Walang "am" sa suomi. Ang -n ang sapat na.',
      },
      {
        wrong: 'He puhuu suomea.',
        right: 'He puhuvat suomea.',
        why: 'The plural he needs -vat/-vät. Using the hän form with he is the single most common slip.',
        whyTl: 'Kailangan ng -vat sa "he": he puhuvat.',
      },
      {
        wrong: 'Minä tulen olemaan opettaja.',
        right: 'Minusta tulee opettaja.',
        why: 'Finnish does not build a future with "will be". Use the present, or "minusta tulee" for becoming something.',
        whyTl: 'Walang "will be" sa suomi. Gamitin ang present, o "minusta tulee".',
      },
    ],
    tip: 'Say the six endings out loud as one chant: -n, -t, nothing, -mme, -tte, -vat. Once that rhythm is automatic, every verb type becomes easy.',
    tipTl: 'Ulit-ulitin: -n, -t, wala, -mme, -tte, -vat. Kapag automatic na ito, madali na ang lahat.',
    exercises: [
      {
        id: 'ex-pr-1',
        kind: 'conjugate',
        prompt: 'Write the correct form.',
        question: 'Me ___ suomea. (puhua)',
        hint: 'me = we',
        answer: 'puhumme',
        explanation: 'Stem puhu- plus the me ending -mme gives puhumme.',
        explanationTl: 'puhu- + -mme = puhumme.',
        grammarId: 'g-preesens',
        wordId: 'v-puhua',
      },
      {
        id: 'ex-pr-2',
        kind: 'choose-form',
        prompt: 'Choose the correct form.',
        question: 'He ___ kotiin.',
        hint: 'tulla, he = they',
        options: ['tulee', 'tulevat', 'tulen'],
        answer: 'tulevat',
        explanation:
          'he always takes -vat/-vät. "tulee" is the hän form and cannot be used with a plural subject.',
        explanationTl: 'Ang "he" ay laging -vat: tulevat. Ang "tulee" ay para sa "hän".',
        grammarId: 'g-preesens',
        wordId: 'v-tulla',
      },
      {
        id: 'ex-pr-3',
        kind: 'fill-blank',
        prompt: 'Fill in the missing verb.',
        question: 'Minä ___ töihin kello seitsemän. (mennä)',
        hint: 'Type 3 stem is mene-',
        answer: 'menen',
        explanation: 'mennä is type 3, stem mene-, plus minä -n: menen. Note this also means "I will go".',
        explanationTl: 'Tyyppi 3: mene- + n = menen. Ibig sabihin din nito ay "pupunta ako".',
        grammarId: 'g-preesens',
        wordId: 'v-menna',
      },
      {
        id: 'ex-pr-4',
        kind: 'translate',
        prompt: 'Translate into Finnish.',
        question: 'She is at work.',
        hint: 'olla + töissä',
        answer: 'Hän on töissä.',
        alsoAccept: ['hän on töissä'],
        explanation:
          'olla has the irregular hän form "on". "At work" is the plural töissä in everyday Finnish.',
        explanationTl: 'Irregular ang olla: "on". Ang "sa trabaho" ay "töissä".',
        grammarId: 'g-preesens',
        wordId: 'v-olla',
      },
      {
        id: 'ex-pr-5',
        kind: 'conjugate',
        prompt: 'Change the person: rewrite for "te".',
        question: 'Sinä tulet kotiin. -> Te ___ kotiin.',
        hint: 'tulla, te-persoona',
        answer: 'tulette',
        explanation:
          'The te ending is -tte, attached to the type 3 stem tule-: tulette.',
        explanationTl: 'Ang ending ng te ay -tte: tule- + -tte = tulette.',
        grammarId: 'g-preesens',
        wordId: 'v-tulla',
      },
      {
        id: 'ex-pr-6',
        kind: 'correct-sentence',
        prompt: 'Make this sentence negative. Write the whole sentence.',
        question: 'Me ymmärrämme suomea.',
        hint: 'me -> emme, and the verb loses its ending',
        answer: 'Me emme ymmärrä suomea.',
        alsoAccept: ['me emme ymmärrä suomea', 'Emme ymmärrä suomea.'],
        explanation:
          'me takes emme, and the main verb drops to the bare form built from the minä form: ymmärrän -> ymmärrä.',
        explanationTl: 'me -> emme, at ang verbo ay nagiging "ymmärrä".',
        grammarId: 'g-preesens',
        wordId: 'v-ymmartaa',
      },
      {
        id: 'ex-pr-7',
        kind: 'fill-blank',
        prompt: 'Complete the sentence.',
        question: 'He ___ kahvia joka aamu. (juoda)',
        hint: 'he-persoona, verb type 2',
        answer: 'juovat',
        explanation:
          'juoda is type 2, stem juo-, and he takes -vat: juovat. Note the object kahvia is partitive.',
        explanationTl: 'Tyyppi 2: juo- + -vat = juovat.',
        grammarId: 'g-preesens',
      },
    ],
    relatedGrammar: ['g-verbityypit', 'g-kielto', 'g-kpt'],
    relatedWords: ['v-puhua', 'v-olla', 'v-tulla', 'v-menna'],
    origin: 'source-derived',
    source: { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 1: Tervetuloa!', pdfPage: 7, sourceTerm: 'verbit olla, puhua ja asua' },
    alsoIn: [
      { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 3: Keskiviikkona kesällä', pdfPage: 51, sourceTerm: 'perusasioita verbeistä' },
    ],
    verification: 'source-verified',
  },

  {
    id: 'g-kielto',
    order: 4,
    title: 'Negative sentences',
    subtitle: 'en, et, ei, emme, ette, eivät',
    level: 'A1',
    finnishTerm: 'kieltoverbi',
    minutes: 5,
    moduleId: 'm-basic',
    levelBasis:
      'Oma suomi 1 teaches this (book 1 of an adult integration course). That book states no CEFR level, so A1 is an inference from its position in the series, not a quoted level.',
    intro:
      'Finnish says "no" with a verb, not a word like "not". The negative verb ei takes the personal ending, and the main verb then appears in a bare, unchanging form.',
    introTl:
      'Sa suomi, verbo ang "hindi". Ang "ei" ang kumukuha ng personal ending, at nagiging payak ang pangunahing verbo.',
    rule: 'Conjugate the negative verb (en, et, ei, emme, ette, eivät) and put the main verb in the connegative form: the present stem with no ending at all, in the weak grade.',
    easyRule: {
      left: 'ei + bare verb',
      leftNote: 'en puhu, et puhu, ei puhu',
      right: 'never two endings',
      rightNote: 'the ei carries the person',
    },
    examples: [
      { fi: 'en puhu', en: 'I do not speak', tl: 'hindi ako nagsasalita', tag: 'minä' },
      { fi: 'et puhu', en: 'you do not speak', tl: 'hindi ka nagsasalita', tag: 'sinä' },
      { fi: 'ei puhu', en: 'he/she does not speak', tl: 'hindi siya nagsasalita', tag: 'hän' },
      { fi: 'emme puhu', en: 'we do not speak', tl: 'hindi kami nagsasalita', tag: 'me' },
      { fi: 'ette puhu', en: 'you (pl) do not speak', tl: 'hindi kayo nagsasalita', tag: 'te' },
      { fi: 'eivät puhu', en: 'they do not speak', tl: 'hindi sila nagsasalita', tag: 'he' },
    ],
    exceptions: [
      {
        title: 'The bare form uses the weak grade',
        body: 'The connegative form is the same as the minä form with the -n removed - which means it keeps the weak consonant grade.',
        examples: [
          { fi: 'ymmärrän → en ymmärrä', en: 'I understand → I do not understand', tl: 'hindi ko maintindihan', tag: 'rt → rr' },
          { fi: 'otan → en ota', en: 'I take → I do not take', tl: 'hindi ko kinukuha', tag: 'tt → t' },
          { fi: 'pidän → en pidä', en: 'I like → I do not like', tl: 'hindi ko gusto', tag: 't → d' },
        ],
      },
      {
        title: 'The object becomes partitive',
        body: 'A negative sentence almost always turns its object into the partitive, even when the positive sentence used a total object.',
        examples: [
          { fi: 'Ostan kirjan. → En osta kirjaa.', en: 'I buy the book. → I do not buy the book.', tl: 'Hindi ko binibili ang libro.', tag: 'partitiivi' },
          { fi: 'Syön omenan. → En syö omenaa.', en: 'I eat the apple. → I do not eat the apple.', tl: 'Hindi ko kinakain ang mansanas.', tag: 'partitiivi' },
        ],
      },
      {
        title: 'olla becomes ei ole',
        body: 'The negative of "on" is "ei ole". For "there is not", the thing also goes partitive: Ei ole aikaa.',
        examples: [
          { fi: 'Minulla ei ole aikaa.', en: 'I do not have time.', tl: 'Wala akong oras.', tag: 'partitiivi' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'En puhun suomea.',
        right: 'En puhu suomea.',
        why: 'Only one verb may carry the person. The ei already has it, so the main verb drops its -n.',
        whyTl: 'Isa lang ang pwedeng may ending. Nasa "en" na, kaya walang -n sa "puhu".',
      },
      {
        wrong: 'He ei puhu suomea.',
        right: 'He eivät puhu suomea.',
        why: 'The negative verb must agree with the subject: he → eivät.',
        whyTl: 'Dapat tugma ang kieltoverbi: he → eivät.',
      },
      {
        wrong: 'En ymmärtä.',
        right: 'En ymmärrä.',
        why: 'The connegative uses the weak grade from the minä form (ymmärrän → ymmärrä).',
        whyTl: 'Mahinang grado ang gamit: ymmärrän → ymmärrä.',
      },
    ],
    tip: 'Build it from the minä form: take ymmärrän, cut the -n to get ymmärrä, then put the right ei in front. That gets the gradation right every time.',
    tipTl:
      'Simulan sa minä form: ymmärrän → alisin ang -n → ymmärrä. Tapos ilagay ang tamang "ei".',
    exercises: [
      {
        id: 'ex-neg-1',
        kind: 'fill-blank',
        prompt: 'Make the sentence negative.',
        question: 'Minä ymmärrän. → Minä ___ ___.',
        hint: 'Two words',
        answer: 'en ymmärrä',
        explanation:
          'minä takes "en", and the main verb loses its -n and keeps the weak grade: ymmärrän → ymmärrä.',
        explanationTl: 'minä → en. Tapos ymmärrän → ymmärrä (walang -n).',
        grammarId: 'g-kielto',
        wordId: 'v-ymmartaa',
      },
      {
        id: 'ex-neg-2',
        kind: 'choose-form',
        prompt: 'Choose the correct negative verb.',
        question: 'He ___ tule tänään.',
        hint: 'he = they',
        options: ['ei', 'eivät', 'emme'],
        answer: 'eivät',
        explanation:
          'The negative verb agrees with the subject. he takes eivät; ei would only be correct with hän.',
        explanationTl: 'Dapat tugma: he → eivät. Ang "ei" ay para sa hän.',
        grammarId: 'g-kielto',
      },
      {
        id: 'ex-neg-3',
        kind: 'correct-sentence',
        prompt: 'Correct the mistake. Write the whole sentence.',
        question: 'En puhun englantia.',
        hint: 'How many verbs can carry the person?',
        answer: 'En puhu englantia.',
        alsoAccept: ['en puhu englantia'],
        explanation:
          'The -n belongs to "en" alone. The main verb stays bare: en puhu.',
        explanationTl: 'Ang -n ay nasa "en" na. Dapat "puhu" lang.',
        grammarId: 'g-kielto',
      },
      {
        id: 'ex-neg-4',
        kind: 'choose-case',
        prompt: 'Choose the correct object form.',
        question: 'En osta ___.',
        hint: 'kirja = book; the sentence is negative',
        options: ['kirjan', 'kirjaa', 'kirja'],
        answer: 'kirjaa',
        explanation:
          'A negative sentence forces the object into the partitive: kirja → kirjaa. The total object kirjan is only possible in a positive sentence.',
        explanationTl: 'Sa negatibo, partitiivi ang objekti: kirjaa.',
        grammarId: 'g-kielto',
      },
    ],
    relatedGrammar: ['g-preesens', 'g-kpt', 'g-partitiivi'],
    relatedWords: ['v-ymmartaa', 'v-olla'],
    origin: 'source-derived',
    source: { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 3: Keskiviikkona kesällä', pdfPage: 51, sourceTerm: 'negatiivinen verbintaivutus' },
    verification: 'source-verified',
  },

  {
    id: 'g-kpt',
    order: 5,
    title: 'KPT consonant gradation',
    subtitle: 'astevaihtelu',
    level: 'A2.1',
    finnishTerm: 'astevaihtelu (KPT-vaihtelu)',
    minutes: 7,
    moduleId: 'm-more',
    levelBasis:
      'Suomen mestari 2 teaches this and states "taitotasolla A2" in its Alkusanat. The A2.1 / A2.2 split is this app\'s own granularity, not the book\'s.',
    intro:
      'The consonants k, p and t change shape when an ending closes the syllable. This is why kauppa becomes kaupan and why "I take" is otan but "he takes" is ottaa. It looks chaotic at first, but there are only about ten pairs.',
    introTl:
      'Nagbabago ang k, p at t kapag may dinagdag na ending. Kaya "kauppa" ay nagiging "kaupan". Mukhang magulo, pero mga sampung pares lang ito.',
    rule: 'Strong grade appears in an open syllable (one ending in a vowel); weak grade appears when an ending closes the syllable. For nouns the basic form is usually strong and the genitive weak. For type 1 verbs the hän form is strong and the minä form weak.',
    easyRule: {
      left: 'kk→k · pp→p · tt→t',
      leftNote: 'double becomes single',
      right: 'k→— · p→v · t→d',
      rightNote: 'single becomes weaker',
    },
    examples: [
      { fi: 'kauppa → kaupan', en: 'shop → of the shop', tl: 'tindahan', tag: 'pp → p' },
      { fi: 'ottaa → otan', en: 'to take → I take', tl: 'kunin', tag: 'tt → t' },
      { fi: 'pysäkki → pysäkin', en: 'bus stop', tl: 'hintuan', tag: 'kk → k' },
      { fi: 'pitää → pidän', en: 'to like → I like', tl: 'gusto ko', tag: 't → d' },
      { fi: 'apu → avun', en: 'help → of help', tl: 'tulong', tag: 'p → v' },
      { fi: 'ruoka → ruoan', en: 'food → of food', tl: 'pagkain', tag: 'k → —' },
      { fi: 'hinta → hinnan', en: 'price', tl: 'presyo', tag: 'nt → nn' },
      { fi: 'kertoa → kerron', en: 'to tell → I tell', tl: 'sabihin', tag: 'rt → rr' },
      { fi: 'unohtaa → unohdan', en: 'to forget → I forget', tl: 'makalimutan', tag: 'ht → hd' },
      { fi: 'sääntö → säännön', en: 'rule', tl: 'patakaran', tag: 'nt → nn' },
    ],
    exceptions: [
      {
        title: 'Some verbs gradate backwards',
        body: 'Type 4 and type 6 verbs often have the WEAK grade in the dictionary form and the STRONG grade in the stem - the opposite of type 1.',
        examples: [
          { fi: 'kohdata → kohtaan', en: 'to meet → I meet', tl: 'makaharap', tag: 'd → t' },
          { fi: 'edetä → etenen', en: 'to progress → I progress', tl: 'umusad', tag: 'd → t' },
          { fi: 'tavata → tapaan', en: 'to meet → I meet', tl: 'makipagkita', tag: 'v → p' },
        ],
      },
      {
        title: 'Many clusters never gradate',
        body: 'If the k, p or t sits in a cluster that is not on the list, nothing changes: st, tk, sk, ps, ts all stay as they are.',
        examples: [
          { fi: 'tarkistaa → tarkistan', en: 'to check', tl: 'suriin', tag: 'st stays' },
          { fi: 'jatkaa → jatkan', en: 'to continue', tl: 'magpatuloy', tag: 'tk stays' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Menen kauppaan ja ostan kauppasta leipää.',
        right: 'Menen kauppaan ja ostan kaupasta leipää.',
        why: '-sta closes the syllable, so the weak grade applies: kaupasta. The illative kauppaan keeps the strong grade because the syllable stays open.',
        whyTl: 'Ang -sta ay nagsasara ng pantig: kaupasta. Pero kauppaan ay malakas pa rin.',
      },
      {
        wrong: 'Minä ottan kahvin.',
        right: 'Minä otan kahvin.',
        why: 'The minä form of a type 1 verb takes the weak grade: ottaa → otan.',
        whyTl: 'Mahinang grado sa minä: otan.',
      },
      {
        wrong: 'ruokan hinta',
        right: 'ruoan hinta',
        why: 'Between two vowels the k disappears completely rather than weakening to something else.',
        whyTl: 'Nawawala talaga ang k sa pagitan ng dalawang patinig: ruoan.',
      },
    ],
    tip: 'Ask one question: does the ending close the syllable? kauppa-an leaves it open, so the pp stays. kaupa-n closes it, so the pp weakens.',
    tipTl:
      'Isang tanong lang: nagsasara ba ng pantig ang ending? Kung oo - mahina. Kung hindi - malakas.',
    exercises: [
      {
        id: 'ex-kpt-1',
        kind: 'fill-blank',
        prompt: 'Write the genitive form.',
        question: 'kauppa → ___ ovi (the door of the shop)',
        hint: 'The genitive ends in -n',
        answer: 'kaupan',
        explanation:
          'The -n closes the syllable, so pp weakens to p: kaupan.',
        explanationTl: 'Nagsasara ang -n, kaya pp → p: kaupan.',
        grammarId: 'g-kpt',
        wordId: 'n-kauppa',
      },
      {
        id: 'ex-kpt-2',
        kind: 'conjugate',
        prompt: 'Write the minä form.',
        question: 'pitää → minä ___ kahvista',
        hint: 'Single t weakens to...',
        answer: 'pidän',
        explanation: 'A single t between vowels weakens to d: pitää → pidän.',
        explanationTl: 'Ang t ay nagiging d: pidän.',
        grammarId: 'g-kpt',
        wordId: 'v-pitaa',
      },
      {
        id: 'ex-kpt-3',
        kind: 'choose-form',
        prompt: 'Choose the correct form.',
        question: 'Ostan leipää ___.',
        hint: 'kauppa + -sta',
        options: ['kaupasta', 'kauppasta', 'kaupassta'],
        answer: 'kaupasta',
        explanation:
          '-sta closes the syllable, so the weak grade is required: kaupasta.',
        explanationTl: 'Nagsasara ang -sta, kaya mahina: kaupasta.',
        grammarId: 'g-kpt',
        wordId: 'n-kauppa',
      },
      {
        id: 'ex-kpt-4',
        kind: 'multiple-choice',
        prompt: 'Which pair shows the gradation in "unohtaa → unohdan"?',
        question: 'unohtaa → unohdan',
        options: ['tt → t', 'ht → hd', 'nt → nn'],
        answer: 'ht → hd',
        explanation:
          'The cluster ht weakens to hd. The same change appears in huolehtia → huolehdin and lähteä → lähden.',
        explanationTl: 'Ang ht ay nagiging hd. Ganito rin sa huolehtia → huolehdin.',
        grammarId: 'g-kpt',
        wordId: 'v-unohtaa',
      },
      {
        id: 'ex-kpt-5',
        kind: 'correct-sentence',
        prompt: 'Correct the gradation mistake.',
        question: 'Tämä on ruokan hinta.',
        hint: 'ruoka + -n',
        answer: 'Tämä on ruoan hinta.',
        alsoAccept: ['tämä on ruoan hinta', 'Tämä on ruuan hinta.', 'tämä on ruuan hinta'],
        explanation:
          'A single k between vowels disappears: ruoka → ruoan. The spelling ruuan is equally standard.',
        explanationTl: 'Nawawala ang k: ruoan (o ruuan - parehong tama).',
        grammarId: 'g-kpt',
        wordId: 'n-ruoka',
      },
    ],
    relatedGrammar: ['g-verbityypit', 'g-genetiivi', 'g-kielto'],
    relatedWords: ['n-kauppa', 'v-pitaa', 'n-ruoka', 'n-apu', 'v-unohtaa', 'n-hinta'],
    origin: 'source-derived',
    source: { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 2: Hanna on sairas', page: 44, sourceTerm: 'k~p~t-vaihtelu: sanatyypit e, in, as/äs' },
    alsoIn: [
      { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 6: Onnea hääparille!', page: 180, sourceTerm: 'k-p-t-vaihtelu: uku-uvu, yky-yvy, rki-rje, lki-lje' },
      { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 9: Yllätysjuhlat', pdfPage: 213, sourceTerm: 'kpt-vaihtelu verbityypeissä 3 ja 4' },
    ],
    verification: 'source-verified',
  },

  {
    id: 'g-partitiivi',
    order: 6,
    title: 'Partitive (-a / -ä)',
    subtitle: 'uses and meanings',
    level: 'A1',
    finnishTerm: 'partitiivi',
    minutes: 7,
    moduleId: 'm-basic',
    levelBasis:
      'Oma suomi 1 teaches this (book 1 of an adult integration course). That book states no CEFR level, so A1 is an inference from its position in the series, not a quoted level.',
    intro:
      'The partitive is the case of "some", "not all" and "not finished". It is used far more in Finnish than any English case, and getting it right is the biggest single step from A1 to A2.',
    introTl:
      'Ang partitiivi ang kaso ng "kaunti", "hindi lahat" at "hindi tapos". Napakadalas gamitin sa suomi - ito ang pinakamalaking hakbang mula A1 papuntang A2.',
    rule: 'The ending is -a/-ä after a single vowel, -ta/-tä after two vowels or a consonant, and -tta/-ttä for words ending in -e or in -uus/-yys. Use it after numbers and quantity words, in negative sentences, with ongoing actions, with uncountable things, and after verbs that demand it.',
    easyRule: {
      left: '-a / -ä',
      leftNote: 'after one vowel: ruokaa',
      right: '-ta / -tä',
      rightNote: 'after two vowels or a consonant: maata, vettä',
    },
    examples: [
      { fi: 'Juon kahvia.', en: 'I drink (some) coffee.', tl: 'Umiinom ako ng kape.', tag: 'uncountable' },
      { fi: 'Minulla on kaksi lasta.', en: 'I have two children.', tl: 'May dalawa akong anak.', tag: 'after a number' },
      { fi: 'En syö lihaa.', en: 'I do not eat meat.', tl: 'Hindi ako kumakain ng karne.', tag: 'negative' },
      { fi: 'Luen kirjaa.', en: 'I am reading a book (not finished).', tl: 'Nagbabasa ako ng libro.', tag: 'ongoing' },
      { fi: 'Odotan bussia.', en: 'I am waiting for the bus.', tl: 'Naghihintay ako ng bus.', tag: 'verb rection' },
      { fi: 'Paljon ihmisiä.', en: 'A lot of people.', tl: 'Maraming tao.', tag: 'quantity' },
    ],
    exceptions: [
      {
        title: 'Partitive vs total object changes the meaning',
        body: 'The case of the object tells you whether the action was completed. This is a real difference in meaning, not a style choice.',
        examples: [
          { fi: 'Luin kirjaa.', en: 'I was reading a book.', tl: 'Nagbabasa ako ng libro.', tag: 'not finished' },
          { fi: 'Luin kirjan.', en: 'I read the whole book.', tl: 'Natapos kong basahin ang libro.', tag: 'finished' },
        ],
      },
      {
        title: 'Greetings are frozen partitives',
        body: 'Many fixed expressions are partitives that nobody thinks about any more.',
        examples: [
          { fi: 'Hyvää päivää!', en: 'Good day!', tl: 'Magandang araw!', tag: 'frozen' },
          { fi: 'Kiitos paljon!', en: 'Thanks a lot!', tl: 'Maraming salamat!', tag: 'frozen' },
          { fi: 'Hauska tutustua!', en: 'Nice to meet you!', tl: 'Ikinagagalak kong makilala ka!', tag: 'frozen' },
        ],
      },
      {
        title: 'Some partitives are irregular',
        body: 'A few everyday words do not follow the ending rules and simply have to be memorised.',
        examples: [
          { fi: 'vesi → vettä', en: 'water', tl: 'tubig', tag: 'irregular' },
          { fi: 'lumi → lunta', en: 'snow', tl: 'niyebe', tag: 'irregular' },
          { fi: 'mies → miestä', en: 'man', tl: 'lalaki', tag: 'irregular' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Minulla on kaksi lapset.',
        right: 'Minulla on kaksi lasta.',
        why: 'Every number above one is followed by the singular partitive, never the plural.',
        whyTl: 'Pagkatapos ng numero (maliban sa isa), singular partitiivi: kaksi lasta.',
      },
      {
        wrong: 'En juo kahvi.',
        right: 'En juo kahvia.',
        why: 'The object of a negative sentence goes into the partitive.',
        whyTl: 'Sa negatibo, partitiivi ang objekti: kahvia.',
      },
      {
        wrong: 'Hyvä päivä!',
        right: 'Hyvää päivää!',
        why: 'The greeting is a fixed partitive. Both words take the ending.',
        whyTl: 'Partitiivi ang bati, at pareho ang salita: Hyvää päivää!',
      },
    ],
    tip: 'Ask: is it some of something, an unfinished action, a negative, or after a number? Any yes means partitive.',
    tipTl:
      'Tanong: kaunti ba? hindi pa tapos? negatibo? may numero? Kahit isang "oo" - partitiivi.',
    exercises: [
      {
        id: 'ex-part-1',
        kind: 'choose-case',
        prompt: 'Choose the correct form.',
        question: 'Juon ___ joka aamu.',
        hint: 'kahvi = coffee, an uncountable amount',
        options: ['kahvi', 'kahvia', 'kahvin'],
        answer: 'kahvia',
        explanation:
          'You drink some coffee, not a defined whole, so the partitive is required: kahvia.',
        explanationTl: 'Kaunting kape, hindi buo - kaya partitiivi: kahvia.',
        grammarId: 'g-partitiivi',
      },
      {
        id: 'ex-part-2',
        kind: 'choose-case',
        prompt: 'Choose the correct form after the number.',
        question: 'Minulla on kolme ___.',
        hint: 'lapsi = child',
        options: ['lapset', 'lasta', 'lapsen'],
        answer: 'lasta',
        explanation:
          'Numbers from two upwards take the singular partitive. lapsi has the irregular partitive lasta.',
        explanationTl: 'Mula sa dalawa, singular partitiivi: kolme lasta.',
        grammarId: 'g-partitiivi',
      },
      {
        id: 'ex-part-3',
        kind: 'multiple-choice',
        prompt: 'Which sentence means the book was finished?',
        question: 'Luin kirjaa. / Luin kirjan.',
        options: ['Luin kirjaa.', 'Luin kirjan.', 'Both mean the same'],
        answer: 'Luin kirjan.',
        explanation:
          'The total object kirjan says the action reached its end. The partitive kirjaa describes the activity without saying it finished.',
        explanationTl:
          'Ang "kirjan" ay tapos na. Ang "kirjaa" ay ginagawa pa lang.',
        grammarId: 'g-partitiivi',
      },
      {
        id: 'ex-part-4',
        kind: 'fill-blank',
        prompt: 'Fill in the partitive.',
        question: 'Tarvitsen ___. (apu)',
        hint: 'One vowel at the end',
        answer: 'apua',
        explanation:
          'apu ends in a single vowel, so the partitive adds -a: apua. tarvita always takes the partitive here.',
        explanationTl: 'Isang patinig lang ang dulo, kaya dagdag -a: apua.',
        grammarId: 'g-partitiivi',
        wordId: 'n-apu',
      },
      {
        id: 'ex-part-5',
        kind: 'correct-sentence',
        prompt: 'Correct the sentence.',
        question: 'En osta leipä tänään.',
        hint: 'The sentence is negative',
        answer: 'En osta leipää tänään.',
        alsoAccept: ['en osta leipää tänään'],
        explanation:
          'Negative sentences take a partitive object: leipä → leipää.',
        explanationTl: 'Negatibo, kaya partitiivi: leipää.',
        grammarId: 'g-partitiivi',
      },
    ],
    relatedGrammar: ['g-objekti', 'g-kielto', 'g-genetiivi'],
    relatedWords: ['n-ruoka', 'n-apu', 'n-paiva', 'v-odottaa', 'v-tarvita'],
    origin: 'source-derived',
    source: { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 3: Keskiviikkona kesällä', pdfPage: 51, sourceTerm: 'partitiivi' },
    alsoIn: [
      { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 4: Ruokakaupassa', pdfPage: 77, sourceTerm: 'partitiivin käyttö' },
    ],
    verification: 'source-verified',
  },

  {
    id: 'g-genetiivi',
    order: 7,
    title: 'Genitive (-n)',
    subtitle: 'possession and forms',
    level: 'A1',
    finnishTerm: 'genetiivi',
    minutes: 5,
    moduleId: 'm-basic',
    levelBasis:
      'Oma suomi 1 teaches this (book 1 of an adult integration course). That book states no CEFR level, so A1 is an inference from its position in the series, not a quoted level.',
    intro:
      'The genitive marks possession, but it does much more: it is the form that most other cases are built on, and it is the subject form in "minun pitää" sentences. Learn a word\'s genitive and you can usually build everything else.',
    introTl:
      'Ang genetiivi ay para sa pag-aari, pero higit pa rito: dito nakabase ang ibang kaso. Kapag alam mo ang genetiivi, kaya mo na ang halos lahat.',
    rule: 'Add -n to the inflecting stem. Because the -n closes the syllable, the weak consonant grade applies: kauppa → kaupan, hinta → hinnan, ruoka → ruoan.',
    easyRule: {
      left: 'stem + -n',
      leftNote: 'minun, sinun, opettajan',
      right: 'weak grade',
      rightNote: 'kauppa → kaupan',
    },
    examples: [
      { fi: 'opettajan kirja', en: "the teacher's book", tl: 'ang libro ng guro', tag: 'possession' },
      { fi: 'kaupan ovi', en: "the shop's door", tl: 'ang pinto ng tindahan', tag: 'kpt' },
      { fi: 'minun nimeni', en: 'my name', tl: 'ang pangalan ko', tag: 'possessive' },
      { fi: 'Minun pitää mennä.', en: 'I have to go.', tl: 'Kailangan kong umalis.', tag: 'must' },
      { fi: 'kahden viikon päästä', en: 'in two weeks', tl: 'sa loob ng dalawang linggo', tag: 'time' },
    ],
    exceptions: [
      {
        title: 'Possession usually doubles up',
        body: 'Finnish normally marks the owner twice: the genitive pronoun AND a possessive suffix on the thing owned. In speech the suffix is often dropped.',
        examples: [
          { fi: 'minun nimeni', en: 'my name', tl: 'ang pangalan ko', tag: 'yleiskieli' },
          { fi: 'mun nimi', en: 'my name', tl: 'ang pangalan ko', tag: 'puhekieli' },
        ],
      },
      {
        title: 'The genitive is the base for other cases',
        body: 'Take the genitive, drop the -n, and you have the stem for -ssa, -sta, -lla, -lta, -lle.',
        examples: [
          { fi: 'kauppa → kaupan → kaupassa', en: 'shop → in the shop', tl: 'sa tindahan', tag: 'stem' },
          { fi: 'hinta → hinnan → hinnalla', en: 'price → at the price', tl: 'sa presyo', tag: 'stem' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'opettajan kirjan',
        right: 'opettajan kirja',
        why: 'Only the owner takes -n. The thing owned stays in its basic form.',
        whyTl: 'Ang may-ari lang ang may -n. Ang bagay ay nananatiling basic.',
      },
      {
        wrong: 'Minä pitää mennä.',
        right: 'Minun pitää mennä.',
        why: 'The "have to" structure needs a genitive subject: minun, sinun, hänen.',
        whyTl: 'Kailangan ng genetiivi: minun pitää, hindi "minä pitää".',
      },
      {
        wrong: 'kauppan ovi',
        right: 'kaupan ovi',
        why: 'The -n closes the syllable, so pp must weaken to p.',
        whyTl: 'Nagsasara ang -n, kaya pp → p: kaupan.',
      },
    ],
    tip: 'When you learn a new noun, learn its genitive in the same breath: "kauppa, kaupan". The genitive is the key that opens every other case.',
    tipTl:
      'Kapag may bagong salita, sabayan ang genetiivi: "kauppa, kaupan". Ito ang susi sa lahat ng kaso.',
    exercises: [
      {
        id: 'ex-gen-1',
        kind: 'fill-blank',
        prompt: 'Write the genitive.',
        question: 'Tämä on ___ auto. (opettaja)',
        hint: 'Add -n',
        answer: 'opettajan',
        explanation: 'opettaja has no gradation, so the genitive is simply opettajan.',
        explanationTl: 'Walang KPT, kaya opettajan lang.',
        grammarId: 'g-genetiivi',
        wordId: 'n-opettaja',
      },
      {
        id: 'ex-gen-2',
        kind: 'fill-blank',
        prompt: 'Write the genitive.',
        question: '___ hinta on korkea. (asunto)',
        hint: 'Watch the gradation',
        answer: 'asunnon',
        explanation: 'The -n closes the syllable, so nt weakens to nn: asunto → asunnon.',
        explanationTl: 'nt → nn: asunnon.',
        grammarId: 'g-genetiivi',
        wordId: 'n-asunto',
      },
      {
        id: 'ex-gen-3',
        kind: 'choose-form',
        prompt: 'Choose the correct form.',
        question: '___ pitää mennä töihin.',
        hint: 'The "have to" structure',
        options: ['Minä', 'Minun', 'Minua'],
        answer: 'Minun',
        explanation:
          'pitää in the "must" sense takes a genitive subject: minun pitää, sinun pitää, hänen pitää.',
        explanationTl: 'Genetiivi ang subject sa "pitää": minun pitää.',
        grammarId: 'g-genetiivi',
        wordId: 'v-pitaa',
      },
      {
        id: 'ex-gen-4',
        kind: 'translate',
        prompt: 'Translate into Finnish.',
        question: 'my name',
        hint: 'Two words, with a possessive suffix',
        answer: 'minun nimeni',
        alsoAccept: ['nimeni', 'mun nimi'],
        explanation:
          'Standard Finnish marks it twice: the genitive minun plus the suffix -ni on nimi. In speech "mun nimi" is normal.',
        explanationTl: 'Dalawang beses: minun + nimeni. Sa usapan: "mun nimi".',
        grammarId: 'g-genetiivi',
        wordId: 'n-nimi',
      },
    ],
    relatedGrammar: ['g-kpt', 'g-partitiivi', 'g-inessiivi'],
    relatedWords: ['n-opettaja', 'n-asunto', 'n-nimi', 'v-pitaa'],
    origin: 'source-derived',
    source: { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 2: Susanin naapurit', pdfPage: 25, sourceTerm: 'genetiivi' },
    verification: 'source-verified',
  },
];
