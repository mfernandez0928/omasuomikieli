import type { GrammarLesson } from '@/types';

/**
 * The six local cases plus pronouns.
 *
 * Finnish splits "place" into an inner series (-ssa, -sta, -Vn) for being
 * inside something and an outer series (-lla, -lta, -lle) for being on or at
 * it. Teaching them as two parallel sets of three is far easier than as six
 * separate cases, so the lessons are ordered in/out/into, then on/off/onto.
 */
export const A1_CASES: GrammarLesson[] = [
  {
    id: 'g-inessiivi',
    order: 8,
    title: 'Inessive (-ssa / -ssä)',
    subtitle: 'in, inside',
    level: 'A1',
    finnishTerm: 'inessiivi',
    minutes: 4,
    moduleId: 'm-basic',
    levelBasis:
      'Oma suomi 1 teaches this (book 1 of an adult integration course). That book states no CEFR level, so A1 is an inference from its position in the series, not a quoted level.',
    intro:
      'This is the "inside something" case. It answers the question Missä? - where at?',
    introTl: 'Ito ang kaso ng "nasa loob". Sagot sa tanong na Missä? - nasaan?',
    rule: 'Take the genitive stem (the genitive minus its -n) and add -ssa or -ssä according to vowel harmony.',
    easyRule: {
      left: 'Missä?',
      leftNote: 'kaupassa, Suomessa',
      right: 'stem + -ssa/-ssä',
      rightNote: 'weak grade, like the genitive',
    },
    examples: [
      { fi: 'Olen kaupassa.', en: 'I am at the shop.', tl: 'Nasa tindahan ako.', tag: 'kauppa' },
      { fi: 'Asun Suomessa.', en: 'I live in Finland.', tl: 'Nakatira ako sa Suomi.', tag: 'Suomi' },
      { fi: 'Hän on koulussa.', en: 'They are at school.', tl: 'Nasa paaralan siya.', tag: 'koulu' },
      { fi: 'Kirja on laukussa.', en: 'The book is in the bag.', tl: 'Nasa bag ang libro.', tag: 'laukku' },
    ],
    exceptions: [
      {
        title: 'Some places take the outer case instead',
        body: 'Finnish does not always agree with English about what counts as "inside". Stations, posts and some towns use -lla/-llä.',
        examples: [
          { fi: 'asemalla', en: 'at the station', tl: 'sa istasyon', tag: 'not asemassa' },
          { fi: 'postissa', en: 'at the post office', tl: 'sa post office', tag: 'inner' },
          { fi: 'Tampereella', en: 'in Tampere', tl: 'sa Tampere', tag: 'outer!' },
        ],
      },
      {
        title: '"At home" is irregular',
        body: 'koti has the frozen form kotona, which belongs to no regular case pattern.',
        examples: [{ fi: 'Olen kotona.', en: 'I am at home.', tl: 'Nasa bahay ako.', tag: 'kotona' }],
      },
    ],
    mistakes: [
      {
        wrong: 'Olen kauppassa.',
        right: 'Olen kaupassa.',
        why: 'The ending closes the syllable, so pp weakens to p.',
        whyTl: 'Nagsasara ang ending, kaya pp → p: kaupassa.',
      },
      {
        wrong: 'Olen kodissa.',
        right: 'Olen kotona.',
        why: '"At home" uses the fixed form kotona, not the regular inessive.',
        whyTl: 'Hindi regular: kotona ang tama.',
      },
    ],
    tip: 'Missä? → -ssa/-ssä. Build it from the genitive: kaupan → kaupa- → kaupassa.',
    tipTl: 'Missä? → -ssa/-ssä. Simulan sa genetiivi: kaupan → kaupassa.',
    exercises: [
      {
        id: 'ex-in-1',
        kind: 'fill-blank',
        prompt: 'Where are you? Fill in the gap.',
        question: 'Olen ___. (kauppa)',
        hint: 'Missä?',
        answer: 'kaupassa',
        explanation: 'Genitive kaupan, drop the -n, add -ssa: kaupassa.',
        explanationTl: 'kaupan → kaupa- → kaupassa.',
        grammarId: 'g-inessiivi',
        wordId: 'n-kauppa',
      },
      {
        id: 'ex-in-2',
        kind: 'choose-case',
        prompt: 'Choose the correct form.',
        question: 'Asun ___.',
        hint: 'Suomi = Finland',
        options: ['Suomessa', 'Suomella', 'Suomeen'],
        answer: 'Suomessa',
        explanation:
          'Countries take the inner case for "in": Suomessa, Filippiineillä is the exception (island groups take the outer series).',
        explanationTl:
          'Ang bansa ay "-ssa": Suomessa. Pero "Filippiineillä" - ang mga pulo ay -lla.',
        grammarId: 'g-inessiivi',
      },
      {
        id: 'ex-in-3',
        kind: 'correct-sentence',
        prompt: 'Correct the sentence.',
        question: 'Olen kodissa tänään.',
        hint: '"At home" is irregular',
        answer: 'Olen kotona tänään.',
        alsoAccept: ['olen kotona tänään'],
        explanation: '"At home" is the frozen form kotona, not the regular inessive of koti.',
        explanationTl: 'Hindi regular - "kotona" ang tama.',
        grammarId: 'g-inessiivi',
        wordId: 'n-koti',
      },
    ],
    relatedGrammar: ['g-elatiivi', 'g-illatiivi', 'g-adessiivi'],
    relatedWords: ['n-kauppa', 'n-koti', 'n-koulu', 'n-tyo'],
    origin: 'source-derived',
    source: { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 3: Keskiviikkona kesällä', pdfPage: 51, sourceTerm: '-ssa vai -lla?' },
    verification: 'source-verified',
  },

  {
    id: 'g-elatiivi',
    order: 9,
    title: 'Elative (-sta / -stä)',
    subtitle: 'from, out of',
    level: 'A1',
    finnishTerm: 'elatiivi',
    minutes: 4,
    moduleId: 'm-basic',
    levelBasis:
      'Not found in the contents of any readable source, so the level is this app\'s own judgement and is not confirmed by a book.',
    intro:
      'The "out of something" case. It answers Mistä? - where from? It is also the case several very common verbs demand.',
    introTl:
      'Ang kaso ng "mula sa loob". Sagot sa Mistä? - saan galing? Ito rin ang hinihingi ng ilang mahahalagang verbo.',
    rule: 'Genitive stem + -sta or -stä. Beyond place, it is required by pidän (to like), puhun (to talk about), riippuu (depends on) and huolehdin (take care of).',
    easyRule: {
      left: 'Mistä?',
      leftNote: 'kaupasta, Suomesta',
      right: 'pidän + -sta',
      rightNote: 'liking takes this case',
    },
    examples: [
      { fi: 'Tulen kaupasta.', en: 'I am coming from the shop.', tl: 'Galing ako sa tindahan.', tag: 'place' },
      { fi: 'Olen Filippiineiltä.', en: 'I am from the Philippines.', tl: 'Taga-Pilipinas ako.', tag: 'outer series!' },
      { fi: 'Pidän kahvista.', en: 'I like coffee.', tl: 'Gusto ko ang kape.', tag: 'rektio' },
      { fi: 'Se riippuu säästä.', en: 'It depends on the weather.', tl: 'Depende sa panahon.', tag: 'rektio' },
      { fi: 'Kiitos avusta!', en: 'Thanks for the help!', tl: 'Salamat sa tulong!', tag: 'fixed' },
    ],
    exceptions: [
      {
        title: 'The Philippines takes the outer series',
        body: 'Island groups behave like surfaces in Finnish, so the forms are Filippiineillä (in), Filippiineiltä (from), Filippiineille (to) - not *Filippiineissä.',
        examples: [
          { fi: 'Olen Filippiineiltä.', en: 'I am from the Philippines.', tl: 'Taga-Pilipinas ako.', tag: 'memorise' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Pidän kahvia.',
        right: 'Pidän kahvista.',
        why: 'pitää in the "like" sense always takes -sta/-stä. The partitive kahvia would be the object of drinking, not liking.',
        whyTl: 'Ang "gusto" ay laging -sta: pidän kahvista.',
      },
      {
        wrong: 'Olen Filippiineistä.',
        right: 'Olen Filippiineiltä.',
        why: 'Island groups use the outer series: -lla, -lta, -lle.',
        whyTl: 'Ang mga pulo ay -lta: Filippiineiltä.',
      },
    ],
    tip: 'Mistä? → -sta/-stä. And remember the big three rections: pidän -sta, puhun -sta, riippuu -sta.',
    tipTl: 'Mistä? → -sta/-stä. Tandaan: pidän, puhun, riippuu - lahat -sta.',
    exercises: [
      {
        id: 'ex-el-1',
        kind: 'choose-case',
        prompt: 'Choose the correct form.',
        question: 'Pidän ___.',
        hint: 'kahvi = coffee',
        options: ['kahvia', 'kahvista', 'kahville'],
        answer: 'kahvista',
        explanation:
          'pitää meaning "to like" demands the elative: pidän kahvista. This rection has to be memorised with the verb.',
        explanationTl: 'Ang "pitää" (gusto) ay -sta: pidän kahvista.',
        grammarId: 'g-elatiivi',
        wordId: 'v-pitaa',
      },
      {
        id: 'ex-el-2',
        kind: 'fill-blank',
        prompt: 'Fill in the gap.',
        question: 'Tulen juuri ___. (työ, plural)',
        hint: 'Everyday Finnish uses the plural for work',
        answer: 'töistä',
        explanation:
          'Work takes the plural in everyday use: töissä (at), töistä (from), töihin (to).',
        explanationTl: 'Plural ang gamit: töissä, töistä, töihin.',
        grammarId: 'g-elatiivi',
        wordId: 'n-tyo',
      },
      {
        id: 'ex-el-3',
        kind: 'translate',
        prompt: 'Translate into Finnish.',
        question: 'I am from the Philippines.',
        hint: 'Island groups use the outer series',
        answer: 'Olen Filippiineiltä.',
        alsoAccept: ['olen filippiineiltä', 'Minä olen Filippiineiltä.'],
        explanation:
          'Filippiinit is an island group, so it takes -lta, not -sta: Filippiineiltä.',
        explanationTl: 'Pulo ang Pilipinas, kaya -lta: Filippiineiltä.',
        grammarId: 'g-elatiivi',
      },
    ],
    relatedGrammar: ['g-inessiivi', 'g-illatiivi', 'g-rektio'],
    relatedWords: ['v-pitaa', 'v-riippua', 'n-apu', 'v-huolehtia'],
    origin: 'supplementary',
    openQuestion:
      'Oma suomi 1 chapter 3 lists "-ssa vai -lla?" but no contents entry covers -sta/-stä on its own. The elative as a separate lesson is additional content.',
    source: null,
    verification: 'linguistically-checked',
  },

  {
    id: 'g-illatiivi',
    order: 10,
    title: 'Illative (-Vn / -hVn / -seen)',
    subtitle: 'into, to',
    level: 'A2.1',
    finnishTerm: 'illatiivi',
    minutes: 6,
    moduleId: 'm-more',
    levelBasis:
      'Not found in the contents of any readable source, so the level is this app\'s own judgement and is not confirmed by a book.',
    intro:
      'The "into something" case, answering Mihin? It has three different endings depending on the shape of the word, which makes it the trickiest of the six.',
    introTl:
      'Ang kaso ng "papasok sa". Sagot sa Mihin? May tatlong ending depende sa hugis ng salita - ito ang pinakamahirap.',
    rule: 'If the stem ends in a short vowel, double that vowel and add -n (kauppa → kauppaan). If it ends in a long vowel or diphthong, add -h + the same vowel + -n (maa → maahan). Words of the -e type and many foreign words take -seen (huone → huoneeseen). The illative keeps the STRONG grade.',
    easyRule: {
      left: 'Mihin?',
      leftNote: 'kauppaan, Suomeen',
      right: 'strong grade',
      rightNote: 'kauppaan, not *kaupaan',
    },
    examples: [
      { fi: 'Menen kauppaan.', en: 'I am going to the shop.', tl: 'Pupunta ako sa tindahan.', tag: 'vowel + n' },
      { fi: 'Tulen Suomeen.', en: 'I come to Finland.', tl: 'Pupunta ako sa Suomi.', tag: 'vowel + n' },
      { fi: 'Menen maahan.', en: 'I go into the country.', tl: 'Papasok ako sa bansa.', tag: '-hVn' },
      { fi: 'Tule huoneeseen.', en: 'Come into the room.', tl: 'Pumasok ka sa kwarto.', tag: '-seen' },
      { fi: 'Luotan sinuun.', en: 'I trust you.', tl: 'Nagtitiwala ako sa iyo.', tag: 'rektio' },
    ],
    exceptions: [
      {
        title: 'The illative does NOT weaken',
        body: 'Every other case built on the genitive stem takes the weak grade, but the illative keeps the strong one, because its ending leaves the syllable open.',
        examples: [
          { fi: 'kaupassa / kauppaan', en: 'in the shop / to the shop', tl: 'sa tindahan', tag: 'weak / strong' },
          { fi: 'Helsingissä / Helsinkiin', en: 'in / to Helsinki', tl: 'sa Helsinki', tag: 'weak / strong' },
        ],
      },
      {
        title: 'Several verbs demand the illative',
        body: 'These rections surprise learners because English uses a different preposition.',
        examples: [
          { fi: 'luotan sinuun', en: 'I trust you', tl: 'nagtitiwala ako sa iyo', tag: 'not sinua' },
          { fi: 'osallistun kurssiin', en: 'I take part in the course', tl: 'lalahok ako sa kurso', tag: 'rektio' },
          { fi: 'keskityn työhön', en: 'I focus on work', tl: 'nagpo-focus ako sa trabaho', tag: 'rektio' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Menen kaupaan.',
        right: 'Menen kauppaan.',
        why: 'The illative keeps the strong grade, so the pp stays double.',
        whyTl: 'Malakas ang grado sa illatiivi: kauppaan.',
      },
      {
        wrong: 'Luotan sinua.',
        right: 'Luotan sinuun.',
        why: 'luottaa demands the illative, not the partitive.',
        whyTl: 'Illatiivi ang hinihingi ng luottaa: sinuun.',
      },
    ],
    tip: 'Compare the pair out loud: kaupassa (weak, inside) vs kauppaan (strong, into). If you can hear that difference, you have the illative.',
    tipTl:
      'Ihambing: kaupassa (mahina) vs kauppaan (malakas). Kapag naririnig mo ang pagkakaiba, alam mo na.',
    exercises: [
      {
        id: 'ex-ill-1',
        kind: 'choose-case',
        prompt: 'Choose the correct form.',
        question: 'Menen ___.',
        hint: 'kauppa, Mihin?',
        options: ['kaupassa', 'kauppaan', 'kaupasta'],
        answer: 'kauppaan',
        explanation:
          'Movement into a place takes the illative, and the illative keeps the strong grade: kauppaan.',
        explanationTl: 'Papasok - illatiivi, at malakas ang grado: kauppaan.',
        grammarId: 'g-illatiivi',
        wordId: 'n-kauppa',
      },
      {
        id: 'ex-ill-2',
        kind: 'fill-blank',
        prompt: 'Fill in the illative.',
        question: 'Ilmoittaudun ___. (kurssi)',
        hint: 'The stem ends in a short vowel',
        answer: 'kurssiin',
        explanation:
          'kurssi ends in a short i, so the illative doubles it and adds -n: kurssiin.',
        explanationTl: 'Maikling i ang dulo, kaya dodoblehin: kurssiin.',
        grammarId: 'g-illatiivi',
        wordId: 'n-kurssi',
      },
      {
        id: 'ex-ill-3',
        kind: 'choose-form',
        prompt: 'Choose the correct form after this verb.',
        question: 'Luotan ___.',
        hint: 'A verb rection you have to memorise',
        options: ['sinua', 'sinuun', 'sinulle'],
        answer: 'sinuun',
        explanation:
          'luottaa takes the illative: luotan sinuun. English "trust you" gives no clue, so this one is pure memorisation.',
        explanationTl: 'Illatiivi ang luottaa: luotan sinuun. Kabisaduhin.',
        grammarId: 'g-illatiivi',
        wordId: 'v-luottaa',
      },
      {
        id: 'ex-ill-4',
        kind: 'multiple-choice',
        prompt: 'Which form is correct for "into the room"?',
        question: 'huone → ?',
        options: ['huoneen', 'huoneeseen', 'huoneessa'],
        answer: 'huoneeseen',
        explanation:
          'Words of the -e type take the -seen ending: huone → huoneeseen. huoneen is the genitive and huoneessa is "in the room".',
        explanationTl: 'Ang mga -e ay -seen: huoneeseen.',
        grammarId: 'g-illatiivi',
      },
    ],
    relatedGrammar: ['g-inessiivi', 'g-elatiivi', 'g-rektio', 'g-kpt'],
    relatedWords: ['n-kauppa', 'n-kurssi', 'v-luottaa', 'v-osallistua', 'v-menna'],
    origin: 'supplementary',
    openQuestion:
      'No contents entry in the readable books covers the illative on its own. Suomen mestari 2 chapter 7 covers "i-monikko: paikansijat", which is the plural local cases, not this. Additional content.',
    source: null,
    verification: 'linguistically-checked',
  },

  {
    id: 'g-adessiivi',
    order: 11,
    title: 'Adessive (-lla / -llä)',
    subtitle: 'on, at, by',
    level: 'A1',
    finnishTerm: 'adessiivi',
    minutes: 5,
    moduleId: 'm-basic',
    levelBasis:
      'Oma suomi 1 teaches this (book 1 of an adult integration course). That book states no CEFR level, so A1 is an inference from its position in the series, not a quoted level.',
    intro:
      'The outer "on / at" case. It also does two jobs that have nothing to do with place: it says how you travel, and it is how Finnish expresses "to have".',
    introTl:
      'Ang kaso ng "nasa ibabaw / nasa". May dalawa pang trabaho: paano ka naglalakbay, at ang "mayroon".',
    rule: 'Genitive stem + -lla or -llä. Used for surfaces and open places, for means of transport, for time expressions with seasons and parts of the day, and in the possession structure minulla on.',
    easyRule: {
      left: 'Millä? Missä?',
      leftNote: 'pöydällä, bussilla',
      right: 'minulla on',
      rightNote: 'this is how you say "I have"',
    },
    examples: [
      { fi: 'Kirja on pöydällä.', en: 'The book is on the table.', tl: 'Nasa mesa ang libro.', tag: 'surface' },
      { fi: 'Menen bussilla.', en: 'I go by bus.', tl: 'Bus ang sakay ko.', tag: 'transport' },
      { fi: 'Minulla on koira.', en: 'I have a dog.', tl: 'May aso ako.', tag: 'possession' },
      { fi: 'Talvella on kylmä.', en: 'In winter it is cold.', tl: 'Malamig sa taglamig.', tag: 'season' },
      { fi: 'Odotan pysäkillä.', en: 'I am waiting at the stop.', tl: 'Naghihintay ako sa hintuan.', tag: 'place' },
    ],
    exceptions: [
      {
        title: 'Finnish has no verb "to have"',
        body: 'Possession is built from adessive + olla. The thing owned is the grammatical subject, which is why it stays in the basic form.',
        examples: [
          { fi: 'Minulla on auto.', en: 'I have a car.', tl: 'May kotse ako.', tag: 'positive' },
          { fi: 'Minulla ei ole autoa.', en: 'I do not have a car.', tl: 'Wala akong kotse.', tag: 'partitive!' },
        ],
      },
      {
        title: 'Some places are outer for no obvious reason',
        body: 'Stations, stops, post offices and certain towns take -lla even though English says "in" or "at".',
        examples: [
          { fi: 'asemalla', en: 'at the station', tl: 'sa istasyon', tag: 'outer' },
          { fi: 'Tampereella', en: 'in Tampere', tl: 'sa Tampere', tag: 'outer' },
          { fi: 'Filippiineillä', en: 'in the Philippines', tl: 'sa Pilipinas', tag: 'outer' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Minä on koira.',
        right: 'Minulla on koira.',
        why: 'Possession needs the adessive on the owner: minulla, sinulla, hänellä.',
        whyTl: 'Kailangan ng -lla sa may-ari: minulla on.',
      },
      {
        wrong: 'Minulla ei ole auto.',
        right: 'Minulla ei ole autoa.',
        why: 'In the negative the thing owned becomes partitive.',
        whyTl: 'Sa negatibo, partitiivi: autoa.',
      },
      {
        wrong: 'Menen bussissa.',
        right: 'Menen bussilla.',
        why: 'Means of transport takes -lla/-llä. bussissa would mean physically inside the bus, not travelling by it.',
        whyTl: 'Ang sasakyan ay -lla: bussilla.',
      },
    ],
    tip: 'Three jobs, one ending: on a surface, by a vehicle, and "I have". Drill "Minulla on..." until it is automatic - you will use it every day.',
    tipTl:
      'Tatlong gamit: sa ibabaw, sakay ng, at "mayroon". Ulit-ulitin ang "Minulla on..."',
    exercises: [
      {
        id: 'ex-ad-1',
        kind: 'translate',
        prompt: 'Translate into Finnish.',
        question: 'I have a car.',
        hint: 'Use the adessive',
        answer: 'Minulla on auto.',
        alsoAccept: ['minulla on auto', 'Mulla on auto.'],
        explanation:
          'Possession is adessive + on: Minulla on auto. The thing owned stays in the basic form.',
        explanationTl: 'Minulla on auto. Basic form ang bagay na pag-aari.',
        grammarId: 'g-adessiivi',
      },
      {
        id: 'ex-ad-2',
        kind: 'choose-case',
        prompt: 'Choose the correct form.',
        question: 'Minulla ei ole ___.',
        hint: 'The sentence is negative',
        options: ['auto', 'autoa', 'autossa'],
        answer: 'autoa',
        explanation:
          'A negative possession sentence puts the thing owned in the partitive: ei ole autoa.',
        explanationTl: 'Negatibo, kaya partitiivi: autoa.',
        grammarId: 'g-adessiivi',
      },
      {
        id: 'ex-ad-3',
        kind: 'fill-blank',
        prompt: 'How do you travel?',
        question: 'Menen töihin ___. (bussi)',
        hint: 'Means of transport',
        answer: 'bussilla',
        explanation: 'Transport takes -lla/-llä: bussilla, junalla, autolla, pyörällä.',
        explanationTl: 'Ang sasakyan ay -lla: bussilla.',
        grammarId: 'g-adessiivi',
        wordId: 'n-bussi',
      },
      {
        id: 'ex-ad-4',
        kind: 'choose-case',
        prompt: 'Choose the correct form.',
        question: 'Odotan sinua ___.',
        hint: 'asema = station',
        options: ['asemassa', 'asemalla', 'asemaan'],
        answer: 'asemalla',
        explanation:
          'Stations take the outer series in Finnish, even though English says "at the station": asemalla.',
        explanationTl: 'Ang istasyon ay -lla: asemalla.',
        grammarId: 'g-adessiivi',
        wordId: 'n-asema',
      },
    ],
    relatedGrammar: ['g-ablatiivi', 'g-allatiivi', 'g-inessiivi'],
    relatedWords: ['n-bussi', 'n-asema', 'n-talvi', 'v-olla', 'n-pysakki'],
    origin: 'source-derived',
    source: { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 3: Keskiviikkona kesällä', pdfPage: 51, sourceTerm: 'minulla on -rakenne' },
    alsoIn: [
      { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 5: Tässä kaupungissa', pdfPage: 109, sourceTerm: 'minulla on -rakenne' },
    ],
    verification: 'source-verified',
  },

  {
    id: 'g-ablatiivi',
    order: 12,
    title: 'Ablative (-lta / -ltä)',
    subtitle: 'from (off a surface)',
    level: 'A2.1',
    finnishTerm: 'ablatiivi',
    minutes: 4,
    moduleId: 'm-more',
    levelBasis:
      'Suomen mestari 2 teaches this and states "taitotasolla A2" in its Alkusanat. The A2.1 / A2.2 split is this app\'s own granularity, not the book\'s.',
    intro:
      'The outer "from" case. Beyond place, it carries one very useful meaning: how something seems or feels.',
    introTl:
      'Ang kaso ng "mula sa ibabaw". Mahalaga rin ito para sa "mukhang / parang".',
    rule: 'Genitive stem + -lta or -ltä. Used for coming off or away from a surface or place, for asking something FROM a person, and after the verbs tuntua, näyttää, kuulostaa and maistua.',
    easyRule: {
      left: 'Mistä? (outer)',
      leftNote: 'pöydältä, asemalta',
      right: 'tuntuu hyvältä',
      rightNote: 'how something seems',
    },
    examples: [
      { fi: 'Tulen asemalta.', en: 'I am coming from the station.', tl: 'Galing ako sa istasyon.', tag: 'place' },
      { fi: 'Kysyn opettajalta.', en: 'I ask the teacher.', tl: 'Magtatanong ako sa guro.', tag: 'from a person' },
      { fi: 'Tuntuu hyvältä.', en: 'It feels good.', tl: 'Maganda ang pakiramdam.', tag: 'seeming' },
      { fi: 'Kuulostaa hyvältä!', en: 'Sounds good!', tl: 'Mukhang maganda!', tag: 'seeming' },
      { fi: 'Sain viestin esimieheltä.', en: 'I got a message from my supervisor.', tl: 'Nakatanggap ako ng mensahe mula sa superbisor.', tag: 'from a person' },
    ],
    exceptions: [
      {
        title: 'You ask FROM someone, not TO someone',
        body: 'kysyä takes -lta/-ltä. Using -lle here is probably the most common case mistake learners make.',
        examples: [
          { fi: 'Kysyn sinulta.', en: 'I ask you.', tl: 'Tatanungin kita.', tag: 'correct' },
          { fi: 'Vastaan sinulle.', en: 'I answer you.', tl: 'Sasagutin kita.', tag: 'but -lle here!' },
        ],
      },
      {
        title: 'The "seeming" verbs all take this case',
        body: 'tuntua (feel), näyttää (look), kuulostaa (sound) and maistua (taste) are a set: learn them together with -lta/-ltä.',
        examples: [
          { fi: 'Näyttää kivalta.', en: 'Looks nice.', tl: 'Mukhang maganda.', tag: 'näyttää' },
          { fi: 'Maistuu hyvältä.', en: 'Tastes good.', tl: 'Masarap.', tag: 'maistua' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Kysyn opettajalle.',
        right: 'Kysyn opettajalta.',
        why: 'kysyä takes -lta/-ltä. You take the information FROM the person.',
        whyTl: 'Ang kysyä ay -lta: kinukuha mo ang sagot MULA sa kanya.',
      },
      {
        wrong: 'Tuntuu hyvä.',
        right: 'Tuntuu hyvältä.',
        why: 'tuntua requires the ablative on the adjective.',
        whyTl: 'Kailangan ng -ltä: tuntuu hyvältä.',
      },
    ],
    tip: 'Pair them in your head: kysyn sinulta (ask FROM) but vastaan sinulle (answer TO). Opposite directions, opposite endings.',
    tipTl:
      'Pares: kysyn sinulta (mula sa) pero vastaan sinulle (papunta sa).',
    exercises: [
      {
        id: 'ex-abl-1',
        kind: 'choose-case',
        prompt: 'Choose the correct form.',
        question: 'Kysyn ___.',
        hint: 'opettaja = teacher',
        options: ['opettajalle', 'opettajalta', 'opettajaa'],
        answer: 'opettajalta',
        explanation:
          'kysyä takes -lta/-ltä because the answer comes FROM the person: kysyn opettajalta.',
        explanationTl: 'Ang kysyä ay -lta: opettajalta.',
        grammarId: 'g-ablatiivi',
        wordId: 'v-kysya',
      },
      {
        id: 'ex-abl-2',
        kind: 'fill-blank',
        prompt: 'Fill in the gap.',
        question: 'Tämä idea tuntuu ___. (hyvä)',
        hint: 'tuntua + which case?',
        answer: 'hyvältä',
        explanation: 'tuntua takes the ablative on the adjective: tuntuu hyvältä.',
        explanationTl: 'Ang tuntua ay -ltä: hyvältä.',
        grammarId: 'g-ablatiivi',
        wordId: 'v-tuntua',
      },
      {
        id: 'ex-abl-3',
        kind: 'choose-form',
        prompt: 'Which is correct?',
        question: 'Vastaan ___ huomenna.',
        hint: 'answering goes TO someone',
        options: ['sinulta', 'sinulle', 'sinua'],
        answer: 'sinulle',
        explanation:
          'vastata takes -lle, the opposite direction from kysyä. Ask FROM, answer TO.',
        explanationTl: 'Ang vastata ay -lle. Kabaliktaran ng kysyä.',
        grammarId: 'g-ablatiivi',
        wordId: 'v-vastata',
      },
    ],
    relatedGrammar: ['g-adessiivi', 'g-allatiivi', 'g-rektio'],
    relatedWords: ['v-kysya', 'v-tuntua', 'v-kuulostaa', 'v-vaikuttaa'],
    origin: 'source-derived',
    source: { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 6: Onnea hääparille!', page: 180, sourceTerm: 'aistiverbit + lta/ltä' },
    verification: 'source-verified',
  },

  {
    id: 'g-allatiivi',
    order: 13,
    title: 'Allative (-lle)',
    subtitle: 'to (a surface or a person)',
    level: 'A2.1',
    finnishTerm: 'allatiivi',
    minutes: 4,
    moduleId: 'm-more',
    levelBasis:
      'Not found in the contents of any readable source, so the level is this app\'s own judgement and is not confirmed by a book.',
    intro:
      'The outer "to" case. It is the one you use for giving, sending, telling and answering - anything that moves towards a person.',
    introTl:
      'Ang kaso ng "papunta sa". Ginagamit sa pagbibigay, pagpapadala, pagsasabi - anumang papunta sa tao.',
    rule: 'Genitive stem + -lle. There is only one form - vowel harmony does not apply, so it is never *-llä.',
    easyRule: {
      left: 'Mille? Kenelle?',
      leftNote: 'pöydälle, minulle',
      right: 'always -lle',
      rightNote: 'no -llä version exists',
    },
    examples: [
      { fi: 'Annan kirjan sinulle.', en: 'I give the book to you.', tl: 'Ibibigay ko sa iyo ang libro.', tag: 'person' },
      { fi: 'Menen asemalle.', en: 'I am going to the station.', tl: 'Pupunta ako sa istasyon.', tag: 'place' },
      { fi: 'Varasin ajan lääkärille.', en: 'I booked an appointment with the doctor.', tl: 'Nag-book ako sa doktor.', tag: 'appointment' },
      { fi: 'Kerron sinulle myöhemmin.', en: 'I will tell you later.', tl: 'Sasabihin ko sa iyo mamaya.', tag: 'telling' },
      { fi: 'Sopiiko se sinulle?', en: 'Does that suit you?', tl: 'Ok ba iyon sa iyo?', tag: 'rektio' },
    ],
    exceptions: [
      {
        title: '-lle has no front-vowel twin',
        body: 'Unlike every other local case, the allative has a single form. Writing *-llä for this case is always wrong.',
        examples: [
          { fi: 'pöydälle', en: 'onto the table', tl: 'sa mesa', tag: 'front word, still -lle' },
          { fi: 'lääkärille', en: 'to the doctor', tl: 'sa doktor', tag: 'front word, still -lle' },
        ],
      },
      {
        title: 'Verbs that take -lle',
        body: 'antaa (give), kertoa (tell), lähettää (send), vastata (answer), sopia (suit), näyttää (show) all point at a person with -lle.',
        examples: [
          { fi: 'Lähetän sinulle viestin.', en: 'I will send you a message.', tl: 'Papadalhan kita ng mensahe.', tag: 'lähettää' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Annan kirjan sinullä.',
        right: 'Annan kirjan sinulle.',
        why: 'The allative has only one form, -lle, regardless of vowel harmony.',
        whyTl: 'Iisa lang ang porma: -lle. Walang -llä.',
      },
      {
        wrong: 'Kerron sinulta.',
        right: 'Kerron sinulle.',
        why: 'Telling moves information TO someone, so it takes -lle.',
        whyTl: 'Papunta sa tao ang impormasyon, kaya -lle.',
      },
    ],
    tip: 'The outer trio in one line: -lla (at), -lta (from), -lle (to). Only the last one has no ä version.',
    tipTl: 'Tatlo: -lla (nasa), -lta (mula), -lle (papunta). Ang huli lang ang walang ä.',
    exercises: [
      {
        id: 'ex-all-1',
        kind: 'fill-blank',
        prompt: 'Fill in the gap.',
        question: 'Varasin ajan ___. (lääkäri)',
        hint: 'Appointments go TO someone',
        answer: 'lääkärille',
        explanation:
          'Booking an appointment with someone uses -lle: lääkärille. Note it stays -lle even though lääkäri has front vowels.',
        explanationTl: '-lle pa rin kahit front vowels ang lääkäri.',
        grammarId: 'g-allatiivi',
        wordId: 'n-laakari',
      },
      {
        id: 'ex-all-2',
        kind: 'choose-case',
        prompt: 'Choose the correct form.',
        question: 'Kerron ___ huomenna.',
        hint: 'Telling moves towards a person',
        options: ['sinulta', 'sinulle', 'sinussa'],
        answer: 'sinulle',
        explanation: 'kertoa takes -lle: the information travels to the listener.',
        explanationTl: 'Ang kertoa ay -lle.',
        grammarId: 'g-allatiivi',
        wordId: 'v-kertoa',
      },
      {
        id: 'ex-all-3',
        kind: 'match',
        prompt: 'Match each verb with the case it demands.',
        question: 'Match the verb to its case',
        answer: 'matched',
        pairs: [
          { left: 'kysyä', right: '-lta / -ltä' },
          { left: 'vastata', right: '-lle' },
          { left: 'pitää (like)', right: '-sta / -stä' },
          { left: 'luottaa', right: '-Vn' },
        ],
        explanation:
          'These four rections cover most everyday mistakes. Ask FROM, answer TO, like FROM, trust INTO.',
        explanationTl:
          'Apat na rektio: kysyä -lta, vastata -lle, pitää -sta, luottaa -Vn.',
        grammarId: 'g-allatiivi',
      },
    ],
    relatedGrammar: ['g-adessiivi', 'g-ablatiivi', 'g-rektio'],
    relatedWords: ['n-laakari', 'v-kertoa', 'v-vastata', 'v-sopia'],
    origin: 'supplementary',
    openQuestion:
      'Same as the elative: no contents entry covers -lle on its own in the readable books. Additional content.',
    source: null,
    verification: 'linguistically-checked',
  },

  {
    id: 'g-pronominit',
    order: 14,
    title: 'Pronouns',
    subtitle: 'minä, tämä, se...',
    level: 'A1',
    finnishTerm: 'pronominit',
    minutes: 4,
    moduleId: 'm-basic',
    levelBasis:
      'Oma suomi 1 teaches this (book 1 of an adult integration course). That book states no CEFR level, so A1 is an inference from its position in the series, not a quoted level.',
    intro:
      'Finnish pronouns have no gender at all, and the demonstratives work almost exactly like Tagalog ito / iyan / iyon.',
    introTl:
      'Walang kasarian ang mga panghalip sa suomi. At ang tämä / tuo / se ay halos katulad ng ito / iyan / iyon.',
    rule: 'Personal: minä, sinä, hän, me, te, he. Demonstrative: tämä (near me), tuo (near you), se (over there or already known). All of them inflect in every case.',
    easyRule: {
      left: 'hän = he AND she',
      leftNote: 'no gender in Finnish',
      right: 'tämä · tuo · se',
      rightNote: 'ito · iyan · iyon',
    },
    examples: [
      { fi: 'Hän on opettaja.', en: 'He/she is a teacher.', tl: 'Guro siya.', tag: 'no gender' },
      { fi: 'Tämä on minun.', en: 'This is mine.', tl: 'Akin ito.', tag: 'ito' },
      { fi: 'Mikä tuo on?', en: 'What is that?', tl: 'Ano iyan?', tag: 'iyan' },
      { fi: 'Se on hyvä.', en: 'It is good.', tl: 'Maganda iyon.', tag: 'iyon' },
      { fi: 'Minun nimeni on Mark.', en: 'My name is Mark.', tl: 'Mark ang pangalan ko.', tag: 'genitive' },
    ],
    exceptions: [
      {
        title: 'Spoken Finnish uses different pronouns',
        body: 'What you hear on the street is not what the textbook writes. This is the single biggest shock for learners arriving in Finland.',
        examples: [
          { fi: 'minä → mä, minun → mun', en: 'I, my', tl: 'ako, akin', tag: 'puhekieli' },
          { fi: 'sinä → sä, sinun → sun', en: 'you, your', tl: 'ikaw, iyo', tag: 'puhekieli' },
          { fi: 'hän → se, he → ne', en: 'he/she, they', tl: 'siya, sila', tag: 'puhekieli' },
        ],
      },
      {
        title: 'te is both plural and polite',
        body: 'Exactly like Tagalog "kayo": use te with officials, older strangers and anyone you want to show respect to.',
        examples: [
          { fi: 'Voitteko auttaa?', en: 'Could you help? (polite)', tl: 'Pwede po ba kayong tumulong?', tag: 'polite' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Hän on kirja.',
        right: 'Se on kirja.',
        why: 'In standard Finnish hän is only for people; things take se.',
        whyTl: 'Ang hän ay para sa tao lang. Ang bagay ay "se".',
      },
      {
        wrong: 'Minä nimi on Mark.',
        right: 'Minun nimeni on Mark.',
        why: 'Possession needs the genitive minun plus the possessive suffix.',
        whyTl: 'Kailangan ng genetiivi: minun nimeni.',
      },
    ],
    tip: 'Map them onto Tagalog: tämä = ito, tuo = iyan, se = iyon. The system is the same, so trust your first language here.',
    tipTl:
      'Katulad ng Tagalog: tämä = ito, tuo = iyan, se = iyon. Pareho ang sistema.',
    exercises: [
      {
        id: 'ex-pron-1',
        kind: 'multiple-choice',
        prompt: 'Which Finnish pronoun matches Tagalog "iyan" (near you)?',
        question: 'iyan = ?',
        options: ['tämä', 'tuo', 'se'],
        answer: 'tuo',
        explanation:
          'tuo is the middle distance - near the listener. tämä is ito and se is iyon.',
        explanationTl: 'tuo = iyan (malapit sa kausap).',
        grammarId: 'g-pronominit',
        wordId: 'p-tuo',
      },
      {
        id: 'ex-pron-2',
        kind: 'fill-blank',
        prompt: 'Fill in the genitive pronoun.',
        question: '___ nimeni on Mark.',
        hint: 'my',
        answer: 'Minun',
        alsoAccept: ['minun', 'Mun', 'mun'],
        explanation:
          'The genitive minun marks the owner, and -ni on nimi repeats it. In speech: mun nimi.',
        explanationTl: 'Genetiivi: minun. Sa usapan: mun.',
        grammarId: 'g-pronominit',
        wordId: 'p-mina',
      },
      {
        id: 'ex-pron-3',
        kind: 'translate',
        prompt: 'Translate into standard Finnish.',
        question: 'She is my colleague.',
        hint: 'Remember: no gender',
        answer: 'Hän on työkaverini.',
        alsoAccept: ['hän on työkaverini', 'Hän on minun työkaverini.'],
        explanation:
          'hän covers both he and she. The possessive suffix -ni gives työkaverini.',
        explanationTl: 'Ang hän ay para sa babae at lalaki. -ni = ko.',
        grammarId: 'g-pronominit',
        wordId: 'p-han',
      },
    ],
    relatedGrammar: ['g-genetiivi', 'g-preesens'],
    relatedWords: ['p-mina', 'p-sina', 'p-han', 'p-tama', 'p-tuo', 'p-se'],
    origin: 'source-derived',
    source: { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 2: Susanin naapurit', pdfPage: 25, sourceTerm: 'puhekielen persoonapronominit' },
    alsoIn: [
      { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 7: Alexin haastattelu', page: 218, sourceTerm: 'pronominit: nämä, nuo, ne' },
    ],
    verification: 'source-verified',
  },
];
