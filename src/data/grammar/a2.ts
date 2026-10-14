import type { GrammarLesson } from '@/types';

/** A2.1 - A2.2: past tenses, objects, infinitives, imperatives, adjectives. */
export const A2_LESSONS: GrammarLesson[] = [
  {
    id: 'g-imperfekti',
    order: 15,
    title: 'Imperfect (past tense)',
    subtitle: 'the -i- past',
    level: 'A2.1',
    finnishTerm: 'imperfekti',
    minutes: 6,
    moduleId: 'm-more',
    levelBasis:
      'Suomen mestari 2 teaches this and states "taitotasolla A2" in its Alkusanat. The A2.1 / A2.2 split is this app\'s own granularity, not the book\'s.',
    intro:
      'The imperfect is the ordinary past tense: something happened, it is over, you are not connecting it to now. The marker is a single -i- inserted between the stem and the ending.',
    introTl:
      'Ito ang karaniwang past tense: nangyari at tapos na. Isang -i- lang ang idinadagdag.',
    rule: 'Add -i- to the stem, then the personal ending. The stem vowel often changes when it meets the -i-: a single -i or -e disappears, a single -a/-ä disappears in short words, and -aa becomes -o-.',
    easyRule: {
      left: 'stem + i + ending',
      leftNote: 'puhu + i + n = puhuin',
      right: 'the vowel may change',
      rightNote: 'ostaa → ostin, antaa → annoin',
    },
    examples: [
      { fi: 'puhun → puhuin', en: 'I speak → I spoke', tl: 'nagsalita ako', tag: 'no change' },
      { fi: 'ostan → ostin', en: 'I buy → I bought', tl: 'bumili ako', tag: 'a disappears' },
      { fi: 'luen → luin', en: 'I read → I read', tl: 'nagbasa ako', tag: 'e disappears' },
      { fi: 'annan → annoin', en: 'I give → I gave', tl: 'nagbigay ako', tag: 'aa → o' },
      { fi: 'ymmärrän → ymmärsin', en: 'I understand → I understood', tl: 'naintindihan ko', tag: 'rt → rs' },
      { fi: 'olen → olin', en: 'I am → I was', tl: 'ako ay', tag: 'olla' },
    ],
    exceptions: [
      {
        title: 'Some verbs look identical in present and past',
        body: 'When the stem already ends in -i, adding the imperfect -i- changes nothing visible. Context is the only clue.',
        examples: [
          { fi: 'voin', en: 'I can / I could', tl: 'kaya ko', tag: 'both' },
          { fi: 'opin', en: 'I learn / I learned', tl: 'natututo ako', tag: 'both' },
        ],
      },
      {
        title: 'The negative past uses the NUT participle',
        body: 'You cannot say *en puhuin. The negative past is ei + the -nut/-nyt form, which also takes a plural -neet.',
        examples: [
          { fi: 'En puhunut.', en: 'I did not speak.', tl: 'Hindi ako nagsalita.', tag: 'singular' },
          { fi: 'He eivät puhuneet.', en: 'They did not speak.', tl: 'Hindi sila nagsalita.', tag: 'plural' },
        ],
      },
      {
        title: 'A few are irregular and must be memorised',
        body: 'The most frequent verbs change more than the rules predict.',
        examples: [
          { fi: 'tiedän → tiesin', en: 'I know → I knew', tl: 'alam ko', tag: 'irregular' },
          { fi: 'käyn → kävin', en: 'I visit → I visited', tl: 'pumunta ako', tag: 'irregular' },
          { fi: 'teen → tein', en: 'I do → I did', tl: 'ginawa ko', tag: 'irregular' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'En puhuin suomea.',
        right: 'En puhunut suomea.',
        why: 'The negative past needs the -nut/-nyt participle, never the -i- form.',
        whyTl: 'Sa negatibong nakaraan, -nut/-nyt ang gamit: en puhunut.',
      },
      {
        wrong: 'Minä ostin eilen leipä.',
        right: 'Ostin eilen leivän.',
        why: 'The past tense does not change the object rule - a completed purchase takes a total object.',
        whyTl: 'Buo ang aksyon, kaya total object: leivän.',
      },
      {
        wrong: 'He eivät puhunut.',
        right: 'He eivät puhuneet.',
        why: 'The participle takes a plural form -neet when the subject is plural.',
        whyTl: 'Plural ang subject, kaya -neet: puhuneet.',
      },
    ],
    tip: 'Build it from the minä present form: puhun → drop the -n → add -i- → puhuin. For the negative, switch to en + the -nut form.',
    tipTl:
      'Simulan sa minä present: puhun → puhu → puhuin. Sa negatibo: en puhunut.',
    exercises: [
      {
        id: 'ex-imp-1',
        kind: 'conjugate',
        prompt: 'Write the imperfect.',
        question: 'Eilen minä ___ suomea. (puhua)',
        hint: 'stem + i + n',
        answer: 'puhuin',
        explanation: 'puhu- plus the imperfect -i- plus -n gives puhuin.',
        explanationTl: 'puhu + i + n = puhuin.',
        grammarId: 'g-imperfekti',
        wordId: 'v-puhua',
      },
      {
        id: 'ex-imp-2',
        kind: 'choose-form',
        prompt: 'Choose the correct negative past.',
        question: 'Eilen minä ___ töihin.',
        hint: 'mennä, negative',
        options: ['en menin', 'en mennyt', 'en menen'],
        answer: 'en mennyt',
        explanation:
          'The negative past is ei + the -nut/-nyt participle. mennä gives mennyt (front vowels, so -nyt).',
        explanationTl: 'Negatibong nakaraan: en mennyt.',
        grammarId: 'g-imperfekti',
        wordId: 'v-menna',
      },
      {
        id: 'ex-imp-3',
        kind: 'conjugate',
        prompt: 'Write the imperfect.',
        question: 'Hän ___ minua eilen. (auttaa)',
        hint: 'aa meets i',
        answer: 'auttoi',
        explanation:
          'When -aa meets the imperfect -i-, it becomes -o-: auttaa → auttoi. Note the hän form keeps the strong tt.',
        explanationTl: 'Ang -aa ay nagiging -o- sa harap ng -i-: auttoi.',
        grammarId: 'g-imperfekti',
        wordId: 'v-auttaa',
      },
      {
        id: 'ex-imp-4',
        kind: 'correct-sentence',
        prompt: 'Correct the sentence.',
        question: 'He eivät tullut eilen.',
        hint: 'Who is the subject?',
        answer: 'He eivät tulleet eilen.',
        alsoAccept: ['he eivät tulleet eilen'],
        explanation:
          'A plural subject needs the plural participle: tullut → tulleet.',
        explanationTl: 'Plural ang he, kaya tulleet.',
        grammarId: 'g-imperfekti',
        wordId: 'v-tulla',
      },
    ],
    relatedGrammar: ['g-perfekti', 'g-kielto', 'g-partisiipit'],
    relatedWords: ['v-puhua', 'v-auttaa', 'v-menna', 'v-ymmartaa'],
    origin: 'source-derived',
    source: { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 1: Viikonloppureissu', page: 10, sourceTerm: 'positiivinen imperfekti' },
    alsoIn: [
      { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 4: Mitä teet vapaa-ajalla?', page: 116, sourceTerm: 'negatiivinen imperfekti' },
    ],
    verification: 'source-verified',
  },

  {
    id: 'g-perfekti',
    order: 16,
    title: 'Perfect tense',
    subtitle: 'olen tehnyt',
    level: 'A2.1',
    finnishTerm: 'perfekti',
    minutes: 5,
    moduleId: 'm-more',
    levelBasis:
      'Suomen mestari 2 teaches this and states "taitotasolla A2" in its Alkusanat. The A2.1 / A2.2 split is this app\'s own granularity, not the book\'s.',
    intro:
      'The perfect connects the past to now: the thing happened, and that still matters. It works almost exactly like English "I have done".',
    introTl:
      'Ikinokonekta ng perfekti ang nakaraan sa ngayon: nangyari, at mahalaga pa rin ngayon. Katulad ng "I have done".',
    rule: 'olla in the present + the NUT participle (-nut/-nyt in the singular, -neet in the plural). The negative is en ole + the same participle.',
    easyRule: {
      left: 'olen + -nut/-nyt',
      leftNote: 'olen asunut, olen tehnyt',
      right: 'still relevant now',
      rightNote: 'vs imperfect: over and done',
    },
    examples: [
      { fi: 'Olen asunut Suomessa kaksi vuotta.', en: 'I have lived in Finland for two years.', tl: 'Dalawang taon na akong nakatira sa Suomi.', tag: 'still true' },
      { fi: 'Oletko jo syönyt?', en: 'Have you eaten yet?', tl: 'Kumain ka na ba?', tag: 'question' },
      { fi: 'En ole vielä tehnyt sitä.', en: 'I have not done it yet.', tl: 'Hindi ko pa nagagawa iyon.', tag: 'negative' },
      { fi: 'He ovat tulleet.', en: 'They have come.', tl: 'Dumating na sila.', tag: 'plural' },
    ],
    exceptions: [
      {
        title: 'Perfect vs imperfect changes the meaning',
        body: 'The imperfect closes the door on the past; the perfect leaves it open. With a specific past time word (eilen, viime vuonna) you must use the imperfect.',
        examples: [
          { fi: 'Asuin Suomessa kaksi vuotta.', en: 'I lived in Finland for two years (not any more).', tl: 'Dating nakatira ako.', tag: 'imperfekti' },
          { fi: 'Olen asunut Suomessa kaksi vuotta.', en: 'I have lived in Finland for two years (still here).', tl: 'Nandito pa rin ako.', tag: 'perfekti' },
        ],
      },
      {
        title: 'The participle must agree in number',
        body: 'Singular -nut/-nyt, plural -neet. The olla verb also changes: olen/olemme, on/ovat.',
        examples: [
          { fi: 'Hän on tullut.', en: 'He has come.', tl: 'Dumating na siya.', tag: 'singular' },
          { fi: 'He ovat tulleet.', en: 'They have come.', tl: 'Dumating na sila.', tag: 'plural' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Olen asunut Suomessa eilen.',
        right: 'Asuin Suomessa eilen.',
        why: 'A definite past time word forces the imperfect. The perfect cannot be pinned to "yesterday".',
        whyTl: 'Kapag may tiyak na oras (eilen), imperfekti ang gamit.',
      },
      {
        wrong: 'He ovat tullut.',
        right: 'He ovat tulleet.',
        why: 'A plural subject needs the plural participle -neet.',
        whyTl: 'Plural: tulleet.',
      },
      {
        wrong: 'En olen tehnyt.',
        right: 'En ole tehnyt.',
        why: 'After the negative verb, olla appears in its bare form: ole.',
        whyTl: 'Pagkatapos ng "en", "ole" ang gamit.',
      },
    ],
    tip: 'Ask whether the result still matters now. "Olen jo syönyt" (so I am not hungry) vs "Söin eilen" (just a fact about yesterday).',
    tipTl:
      'Tanong: mahalaga pa ba ngayon? "Olen jo syönyt" (busog pa ako) vs "Söin eilen".',
    exercises: [
      {
        id: 'ex-perf-1',
        kind: 'fill-blank',
        prompt: 'Complete the perfect tense.',
        question: 'Minä ___ ___ Suomessa kolme vuotta. (asua)',
        hint: 'Two words',
        answer: 'olen asunut',
        explanation: 'olen plus the NUT participle asunut gives the perfect: olen asunut.',
        explanationTl: 'olen + asunut = olen asunut.',
        grammarId: 'g-perfekti',
      },
      {
        id: 'ex-perf-2',
        kind: 'multiple-choice',
        prompt: 'Which sentence means you still live in Finland?',
        question: 'Asuin Suomessa. / Olen asunut Suomessa.',
        options: ['Asuin Suomessa.', 'Olen asunut Suomessa.', 'Both'],
        answer: 'Olen asunut Suomessa.',
        explanation:
          'The perfect links the past to the present, so it implies you are still there. The imperfect closes it off.',
        explanationTl: 'Ang perfekti ay konektado sa ngayon - nandito ka pa.',
        grammarId: 'g-perfekti',
      },
      {
        id: 'ex-perf-3',
        kind: 'correct-sentence',
        prompt: 'Correct the sentence.',
        question: 'En olen vielä syönyt.',
        hint: 'Look at the olla verb',
        answer: 'En ole vielä syönyt.',
        alsoAccept: ['en ole vielä syönyt'],
        explanation:
          'After a negative verb, the main verb loses its ending: olen → ole.',
        explanationTl: 'Pagkatapos ng "en": ole, hindi olen.',
        grammarId: 'g-perfekti',
      },
    ],
    relatedGrammar: ['g-imperfekti', 'g-partisiipit', 'g-kielto'],
    relatedWords: ['v-olla', 'v-sopeutua', 'adv-jo'],
    origin: 'source-derived',
    source: { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 5: Varkaus Puistotiellä', page: 146, sourceTerm: 'perfekti' },
    alsoIn: [
      { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 5: Varkaus Puistotiellä', page: 146, sourceTerm: 'imperfektin ja perfektin käyttö' },
    ],
    verification: 'source-verified',
  },

  {
    id: 'g-objekti',
    order: 17,
    title: 'Object forms',
    subtitle: 'total or partial?',
    level: 'A2.1',
    finnishTerm: 'objekti',
    minutes: 7,
    moduleId: 'm-more',
    levelBasis:
      'Suomen mestari 2 teaches this and states "taitotasolla A2" in its Alkusanat. The A2.1 / A2.2 split is this app\'s own granularity, not the book\'s.',
    intro:
      'Finnish has no "the" and no "a". Instead, the case of the object tells you whether the action was complete and whether the thing was whole. This is the hardest part of A2 and the most worthwhile.',
    introTl:
      'Walang "the" o "a" sa suomi. Ang kaso ng objekti ang nagsasabi kung tapos ba ang aksyon at buo ba ang bagay. Ito ang pinakamahirap sa A2 - at ang pinakamahalaga.',
    rule: 'Use the partitive when the action is unfinished, the amount is indefinite, or the sentence is negative. Use the total object (genitive-form -n in the singular, or the plain plural) when the action is completed and the object is a whole countable thing.',
    easyRule: {
      left: 'partitiivi',
      leftNote: 'ongoing · some · negative',
      right: 'total object',
      rightNote: 'finished · whole · countable',
    },
    examples: [
      { fi: 'Luen kirjaa.', en: 'I am reading a book.', tl: 'Nagbabasa ako ng libro.', tag: 'ongoing' },
      { fi: 'Luin kirjan.', en: 'I read the whole book.', tl: 'Natapos kong basahin.', tag: 'finished' },
      { fi: 'Join kahvia.', en: 'I drank some coffee.', tl: 'Uminom ako ng kape.', tag: 'some' },
      { fi: 'Join kahvin.', en: 'I drank the (whole) coffee.', tl: 'Naubos ko ang kape.', tag: 'whole' },
      { fi: 'En ostanut kirjaa.', en: 'I did not buy the book.', tl: 'Hindi ko binili ang libro.', tag: 'negative' },
      { fi: 'Ostan kirjat.', en: 'I buy the books.', tl: 'Binibili ko ang mga libro.', tag: 'plural total' },
    ],
    exceptions: [
      {
        title: 'Some verbs can only take the partitive',
        body: 'These verbs describe states or open-ended activities, so a completed object makes no sense with them. Memorise them as a group.',
        examples: [
          { fi: 'Rakastan sinua.', en: 'I love you.', tl: 'Mahal kita.', tag: 'rakastaa' },
          { fi: 'Odotan bussia.', en: 'I wait for the bus.', tl: 'Hinihintay ko ang bus.', tag: 'odottaa' },
          { fi: 'Autan sinua.', en: 'I help you.', tl: 'Tinutulungan kita.', tag: 'auttaa' },
          { fi: 'Ajattelen sinua.', en: 'I think about you.', tl: 'Iniisip kita.', tag: 'ajatella' },
        ],
      },
      {
        title: 'After must, want and imperatives the object has no -n',
        body: 'In "minun pitää" sentences and in commands, a singular total object appears without the -n.',
        examples: [
          { fi: 'Minun pitää ostaa kirja.', en: 'I have to buy a book.', tl: 'Kailangan kong bumili ng libro.', tag: 'no -n' },
          { fi: 'Osta kirja!', en: 'Buy the book!', tl: 'Bilhin mo ang libro!', tag: 'no -n' },
          { fi: 'Ostan kirjan.', en: 'I buy the book.', tl: 'Bibilhin ko ang libro.', tag: 'with -n' },
        ],
      },
      {
        title: 'Personal pronouns have their own object form',
        body: 'Pronouns do not use -n. The total object form is minut, sinut, hänet, meidät, teidät, heidät.',
        examples: [
          { fi: 'Hän näki minut.', en: 'He saw me.', tl: 'Nakita niya ako.', tag: 'minut' },
          { fi: 'Hän auttoi minua.', en: 'He helped me.', tl: 'Tinulungan niya ako.', tag: 'partitive verb' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Rakastan sinut.',
        right: 'Rakastan sinua.',
        why: 'rakastaa is a partitive-only verb, so the object can never be total.',
        whyTl: 'Laging partitiivi ang rakastaa: sinua.',
      },
      {
        wrong: 'Minun pitää ostaa kirjan.',
        right: 'Minun pitää ostaa kirja.',
        why: 'After pitää the object loses its -n.',
        whyTl: 'Pagkatapos ng pitää, walang -n: kirja.',
      },
      {
        wrong: 'En lukenut kirjan.',
        right: 'En lukenut kirjaa.',
        why: 'Negative sentences always take a partitive object.',
        whyTl: 'Negatibo, kaya partitiivi: kirjaa.',
      },
    ],
    tip: 'Three questions in order: Is it negative? → partitive. Is the verb on the partitive-only list? → partitive. Did the action finish on a whole thing? → total object.',
    tipTl:
      'Tatlong tanong: Negatibo? partitiivi. Nasa listahan ng verbo? partitiivi. Tapos at buo? total.',
    exercises: [
      {
        id: 'ex-obj-1',
        kind: 'choose-case',
        prompt: 'Choose the correct object.',
        question: 'Luin koko ___ eilen.',
        hint: 'koko = whole; the action finished',
        options: ['kirjaa', 'kirjan', 'kirja'],
        answer: 'kirjan',
        explanation:
          'The whole book was read and the action is complete, so a total object is required: kirjan.',
        explanationTl: 'Tapos at buo, kaya total object: kirjan.',
        grammarId: 'g-objekti',
      },
      {
        id: 'ex-obj-2',
        kind: 'choose-case',
        prompt: 'Choose the correct object.',
        question: 'Rakastan ___.',
        hint: 'Which verbs are partitive-only?',
        options: ['sinut', 'sinua', 'sinun'],
        answer: 'sinua',
        explanation:
          'rakastaa only ever takes the partitive, no matter how complete the feeling is.',
        explanationTl: 'Ang rakastaa ay laging partitiivi: sinua.',
        grammarId: 'g-objekti',
      },
      {
        id: 'ex-obj-3',
        kind: 'correct-sentence',
        prompt: 'Correct the sentence.',
        question: 'Minun pitää ostaa uuden puhelimen.',
        hint: 'What happens to the object after pitää?',
        answer: 'Minun pitää ostaa uusi puhelin.',
        alsoAccept: ['minun pitää ostaa uusi puhelin'],
        explanation:
          'After pitää the object drops the -n, and the adjective agrees: uusi puhelin.',
        explanationTl: 'Pagkatapos ng pitää, walang -n: uusi puhelin.',
        grammarId: 'g-objekti',
      },
      {
        id: 'ex-obj-4',
        kind: 'multiple-choice',
        prompt: 'Which sentence says the coffee was finished?',
        question: 'Join kahvia. / Join kahvin.',
        options: ['Join kahvia.', 'Join kahvin.', 'Both'],
        answer: 'Join kahvin.',
        explanation:
          'The total object kahvin means the whole cup went. kahvia means you drank some coffee.',
        explanationTl: 'kahvin = naubos. kahvia = uminom ng kaunti.',
        grammarId: 'g-objekti',
      },
    ],
    relatedGrammar: ['g-partitiivi', 'g-genetiivi', 'g-kielto'],
    relatedWords: ['v-odottaa', 'v-auttaa', 'v-ajatella', 'n-ruoka'],
    origin: 'source-derived',
    source: { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 2: Hanna on sairas', page: 44, sourceTerm: 'objekti' },
    alsoIn: [
      { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 10: On hauskaa auttaa ystävää', pdfPage: 237, sourceTerm: 'perustietoja objektista' },
    ],
    verification: 'source-verified',
  },

  {
    id: 'g-maan',
    order: 18,
    title: '-maan / -mään',
    subtitle: 'going somewhere to do something',
    level: 'A2.1',
    finnishTerm: 'MA-infinitiivi (3. infinitiivi)',
    minutes: 5,
    moduleId: 'm-more',
    levelBasis:
      'Suomen mestari 2 teaches this and states "taitotasolla A2" in its Alkusanat. The A2.1 / A2.2 split is this app\'s own granularity, not the book\'s.',
    intro:
      'When one verb leads into another - you go somewhere TO DO something, or you start, learn or manage to do it - Finnish uses the -maan/-mään form rather than the dictionary form.',
    introTl:
      'Kapag may dalawang verbo - pumunta PARA gumawa, o nagsimula/natuto/nagawa - ang -maan/-mään ang gamit, hindi ang basic form.',
    rule: 'Take the third person plural present (he puhuvat), remove -vat/-vät and add -maan/-mään. Use it after verbs of movement and after oppia, alkaa, ruveta, joutua, pyrkiä, pystyä and onnistua.',
    easyRule: {
      left: 'he puhuvat → puhumaan',
      leftNote: 'drop -vat, add -maan',
      right: 'after movement verbs',
      rightNote: 'menen syömään',
    },
    examples: [
      { fi: 'Menen syömään.', en: 'I am going to eat.', tl: 'Kakain na ako.', tag: 'movement' },
      { fi: 'Opin puhumaan suomea.', en: 'I am learning to speak Finnish.', tl: 'Natututo akong magsalita ng suomi.', tag: 'oppia' },
      { fi: 'Aloin opiskelemaan.', en: 'I started studying.', tl: 'Nagsimula akong mag-aral.', tag: 'alkaa' },
      { fi: 'Jouduin odottamaan kauan.', en: 'I had to wait a long time.', tl: 'Napilitan akong maghintay nang matagal.', tag: 'joutua' },
      { fi: 'Onnistuin saamaan ajan.', en: 'I managed to get an appointment.', tl: 'Nakakuha ako ng appointment.', tag: 'onnistua' },
    ],
    exceptions: [
      {
        title: 'alkaa takes either form',
        body: 'Standard written Finnish prefers alkaa + the basic infinitive (alan opiskella), while speech overwhelmingly uses -maan. Both are now accepted.',
        examples: [
          { fi: 'Alan opiskella.', en: 'I start studying.', tl: 'Magsisimula akong mag-aral.', tag: 'yleiskieli' },
          { fi: 'Alan opiskelemaan.', en: 'I start studying.', tl: 'Magsisimula akong mag-aral.', tag: 'puhekieli' },
        ],
      },
      {
        title: 'The other -ma- forms',
        body: 'The same stem gives -massa (in the middle of doing) and -masta (coming back from doing).',
        examples: [
          { fi: 'Olen syömässä.', en: 'I am (out) eating.', tl: 'Kumakain ako ngayon.', tag: '-massa' },
          { fi: 'Tulen syömästä.', en: 'I am coming from eating.', tl: 'Galing akong kumain.', tag: '-masta' },
        ],
      },
      {
        title: 'haluta and voida do NOT take -maan',
        body: 'These take the plain dictionary form. Mixing them up is a frequent slip.',
        examples: [
          { fi: 'Haluan syödä.', en: 'I want to eat.', tl: 'Gusto kong kumain.', tag: 'not syömään' },
          { fi: 'Voin tulla.', en: 'I can come.', tl: 'Pwede akong pumunta.', tag: 'not tulemaan' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Menen syödä.',
        right: 'Menen syömään.',
        why: 'A verb of movement must be followed by -maan/-mään.',
        whyTl: 'Pagkatapos ng verbo ng galaw, -maan: menen syömään.',
      },
      {
        wrong: 'Haluan syömään.',
        right: 'Haluan syödä.',
        why: 'haluta takes the basic infinitive, not -maan.',
        whyTl: 'Ang haluta ay basic form: haluan syödä.',
      },
      {
        wrong: 'Opin puhua suomea.',
        right: 'Opin puhumaan suomea.',
        why: 'oppia requires -maan/-mään.',
        whyTl: 'Ang oppia ay -maan: puhumaan.',
      },
    ],
    tip: 'Build it from the he form, which already has the right stem and gradation: he puhuvat → puhumaan, he tekevät → tekemään.',
    tipTl:
      'Simulan sa "he" form: he puhuvat → puhumaan. Tama na agad ang vartalo.',
    exercises: [
      {
        id: 'ex-maan-1',
        kind: 'fill-blank',
        prompt: 'Fill in the -maan/-mään form.',
        question: 'Menen ___ kaupungille. (syödä)',
        hint: 'he syövät → ?',
        answer: 'syömään',
        explanation: 'he syövät minus -vät plus -mään gives syömään.',
        explanationTl: 'he syövät → syömään.',
        grammarId: 'g-maan',
      },
      {
        id: 'ex-maan-2',
        kind: 'choose-form',
        prompt: 'Choose the correct form.',
        question: 'Haluan ___ suomea.',
        hint: 'Does haluta take -maan?',
        options: ['puhumaan', 'puhua', 'puhun'],
        answer: 'puhua',
        explanation:
          'haluta takes the plain infinitive: haluan puhua. Only movement verbs and the oppia/alkaa/joutua group take -maan.',
        explanationTl: 'Ang haluta ay basic form: haluan puhua.',
        grammarId: 'g-maan',
        wordId: 'v-haluta',
      },
      {
        id: 'ex-maan-3',
        kind: 'fill-blank',
        prompt: 'Fill in the gap.',
        question: 'Jouduin ___ kaksi tuntia. (odottaa)',
        hint: 'joutua takes -maan',
        answer: 'odottamaan',
        explanation: 'joutua requires -maan: he odottavat → odottamaan.',
        explanationTl: 'Ang joutua ay -maan: odottamaan.',
        grammarId: 'g-maan',
        wordId: 'v-joutua',
      },
      {
        id: 'ex-maan-4',
        kind: 'translate',
        prompt: 'Translate into Finnish.',
        question: 'I am learning to write Finnish.',
        hint: 'oppia + -maan',
        answer: 'Opin kirjoittamaan suomea.',
        alsoAccept: ['opin kirjoittamaan suomea'],
        explanation:
          'oppia takes -maan, and the language goes into the partitive: suomea.',
        explanationTl: 'oppia + -maan, at partitiivi ang wika: suomea.',
        grammarId: 'g-maan',
      },
    ],
    relatedGrammar: ['g-rektio', 'g-verbityypit'],
    relatedWords: ['v-oppia', 'v-joutua', 'v-onnistua', 'v-pyrkia', 'v-haluta'],
    origin: 'source-derived',
    source: { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 3: Mökillä', page: 80, sourceTerm: 'verbi + maan/massa/masta' },
    alsoIn: [
      { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 5: Varkaus Puistotiellä', page: 146, sourceTerm: 'verbi + maan/mään' },
    ],
    verification: 'source-verified',
  },

  {
    id: 'g-imperatiivi',
    order: 19,
    title: 'Imperative',
    subtitle: 'giving instructions',
    level: 'A2.2',
    finnishTerm: 'imperatiivi',
    minutes: 4,
    moduleId: 'm-more',
    levelBasis:
      'Suomen mestari 3 teaches this and states taitotaso A2.2 in its Alkusanat.',
    intro:
      'The command form. You meet it constantly in exercise instructions, signs and recipes, so you need to recognise it even before you use it.',
    introTl:
      'Ang porma ng utos. Palaging nakikita sa mga instruksyon, karatula at recipe - kailangang makilala agad.',
    rule: 'Singular: take the minä form and remove the -n (otan → ota). Plural or polite: add -kaa/-kää to the stem (ottakaa). The negative singular is älä + the bare form; the plural is älkää + verb + -ko/-kö.',
    easyRule: {
      left: 'otan → ota!',
      leftNote: 'drop the -n from minä',
      right: 'älä ota!',
      rightNote: "don't take!",
    },
    examples: [
      { fi: 'Tule tänne!', en: 'Come here!', tl: 'Halika rito!', tag: 'singular' },
      { fi: 'Lue ohjeet.', en: 'Read the instructions.', tl: 'Basahin ang instruksyon.', tag: 'exercise' },
      { fi: 'Odottakaa hetki.', en: 'Wait a moment. (polite)', tl: 'Sandali lang po.', tag: 'polite' },
      { fi: 'Älä unohda avaimia!', en: "Don't forget the keys!", tl: 'Huwag mong kalimutan ang susi!', tag: 'negative' },
      { fi: 'Täytä lomake.', en: 'Fill in the form.', tl: 'Punan ang form.', tag: 'official' },
    ],
    exceptions: [
      {
        title: 'The imperative uses the weak grade',
        body: 'Because it comes from the minä form, the singular imperative carries the weak consonant grade.',
        examples: [
          { fi: 'otan → ota!', en: 'take!', tl: 'kunin mo!', tag: 'tt → t' },
          { fi: 'kerron → kerro!', en: 'tell!', tl: 'sabihin mo!', tag: 'rt → rr' },
        ],
      },
      {
        title: 'The plural is often the polite singular',
        body: 'Just like te, the -kaa/-kää form is used to be polite to one person, especially an official or an older stranger.',
        examples: [
          { fi: 'Anteeksi, voitteko auttaa?', en: 'Excuse me, could you help?', tl: 'Pasensya, pwede po bang tumulong?', tag: 'polite' },
        ],
      },
      {
        title: 'olla is irregular',
        body: 'The imperative of olla is ole / olkaa, which you hear every single day.',
        examples: [
          { fi: 'Ole hyvä!', en: "Here you are / you're welcome!", tl: 'Heto po / walang anuman!', tag: 'daily' },
          { fi: 'Olkaa hyvä!', en: 'Here you are (polite)!', tl: 'Heto po!', tag: 'polite' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Ottaa tämä!',
        right: 'Ota tämä!',
        why: 'The dictionary form is not a command. Build it from the minä form minus -n.',
        whyTl: 'Hindi utos ang basic form. Gamitin ang minä minus -n.',
      },
      {
        wrong: 'Ei unohda!',
        right: 'Älä unohda!',
        why: 'Negative commands use älä/älkää, not ei.',
        whyTl: 'Sa utos na negatibo: älä, hindi ei.',
      },
    ],
    tip: 'minä form minus -n is your command. otan → ota, kerron → kerro, tulen → tule. For politeness, swap to -kaa/-kää.',
    tipTl:
      'minä form minus -n = utos. Para magalang, gamitin ang -kaa/-kää.',
    exercises: [
      {
        id: 'ex-imper-1',
        kind: 'fill-blank',
        prompt: 'Write the singular imperative.',
        question: '___ tänne! (tulla)',
        hint: 'tulen minus -n',
        answer: 'Tule',
        alsoAccept: ['tule'],
        explanation: 'tulen minus the -n gives the command tule.',
        explanationTl: 'tulen → tule.',
        grammarId: 'g-imperatiivi',
        wordId: 'v-tulla',
      },
      {
        id: 'ex-imper-2',
        kind: 'choose-form',
        prompt: 'Choose the correct negative command.',
        question: '___ unohda avaimia!',
        hint: 'Negative imperative',
        options: ['Ei', 'Älä', 'En'],
        answer: 'Älä',
        explanation:
          'Negative commands take älä (singular) or älkää (plural/polite), never ei.',
        explanationTl: 'Sa utos: älä o älkää, hindi ei.',
        grammarId: 'g-imperatiivi',
        wordId: 'v-unohtaa',
      },
      {
        id: 'ex-imper-3',
        kind: 'fill-blank',
        prompt: 'Write the polite plural imperative.',
        question: '___ hetki, kiitos. (odottaa)',
        hint: 'stem + -kaa',
        answer: 'Odottakaa',
        alsoAccept: ['odottakaa'],
        explanation:
          'The plural/polite imperative adds -kaa to the strong stem: odottakaa.',
        explanationTl: 'Magalang na utos: odottakaa.',
        grammarId: 'g-imperatiivi',
        wordId: 'v-odottaa',
      },
    ],
    relatedGrammar: ['g-kpt', 'g-kielto', 'g-objekti'],
    relatedWords: ['v-tulla', 'v-odottaa', 'v-unohtaa', 'v-sailyttaa'],
    origin: 'source-derived',
    source: {
      bookId: 'sm3',
      book: 'Suomen mestari 3',
      chapter: 'Kappale 4: Rakas Pedro',
      page: 118,
      sourceTerm: 'imperatiivi: te-persoona',
    },
    openQuestion:
      'Suomen mestari 3 chapter 4 covers the imperative, but its contents list only the te-person (plural/polite) form. The singular imperative taught in this lesson was not found in the contents of any readable book, so only part of this lesson is textbook-derived.',
    verification: 'source-verified',
  },

  {
    id: 'g-adjektiivit',
    order: 20,
    title: 'Adjectives & comparison',
    subtitle: 'hyvä, parempi, paras',
    level: 'A2.1',
    finnishTerm: 'adjektiivit, komparatiivi, superlatiivi',
    minutes: 5,
    moduleId: 'm-more',
    levelBasis:
      'Suomen mestari 2 teaches this and states "taitotasolla A2" in its Alkusanat. The A2.1 / A2.2 split is this app\'s own granularity, not the book\'s.',
    intro:
      'Adjectives in Finnish agree with their noun in both case and number, which is new if your first language does not do that. Comparison itself is simple: -mpi for "more", -in for "most".',
    introTl:
      'Sumusunod ang pang-uri sa kaso at bilang ng pangngalan - bago ito kung galing ka sa Tagalog. Pero simple ang paghahambing: -mpi at -in.',
    rule: 'The adjective takes the same case and number as its noun. Comparative: stem + -mpi (suuri → suurempi). Superlative: stem + -in (suuri → suurin). The comparison partner takes the partitive, or kuin plus the basic form.',
    easyRule: {
      left: '-mpi = more',
      leftNote: 'suurempi, kauniimpi',
      right: '-in = most',
      rightNote: 'suurin, kaunein',
    },
    examples: [
      { fi: 'iso talo → isossa talossa', en: 'a big house → in the big house', tl: 'sa malaking bahay', tag: 'agreement' },
      { fi: 'Tämä on halvempi.', en: 'This is cheaper.', tl: 'Mas mura ito.', tag: 'comparative' },
      { fi: 'Tämä on halvin.', en: 'This is the cheapest.', tl: 'Ito ang pinakamura.', tag: 'superlative' },
      { fi: 'Suomi on vaikeampaa kuin englanti.', en: 'Finnish is harder than English.', tl: 'Mas mahirap ang suomi kaysa ingles.', tag: 'kuin' },
      { fi: 'hyvä → parempi → paras', en: 'good → better → best', tl: 'mabuti → mas mabuti → pinakamabuti', tag: 'irregular' },
    ],
    exceptions: [
      {
        title: 'Agreement means every ending repeats',
        body: 'Both words carry the case ending. This feels heavy at first but becomes automatic.',
        examples: [
          { fi: 'isossa talossa', en: 'in the big house', tl: 'sa malaking bahay', tag: '-ssa twice' },
          { fi: 'isoja taloja', en: 'big houses (partitive)', tl: 'mga malalaking bahay', tag: 'plural partitive twice' },
        ],
      },
      {
        title: 'Two ways to say "than"',
        body: 'Either kuin + the basic form, or simply put the thing compared in the partitive.',
        examples: [
          { fi: 'Hän on vanhempi kuin minä.', en: 'He is older than me.', tl: 'Mas matanda siya kaysa akin.', tag: 'kuin' },
          { fi: 'Hän on minua vanhempi.', en: 'He is older than me.', tl: 'Mas matanda siya kaysa akin.', tag: 'partitive' },
        ],
      },
      {
        title: 'The common ones are irregular',
        body: 'hyvä, pitkä and a few others do not follow the -mpi pattern.',
        examples: [
          { fi: 'hyvä → parempi → paras', en: 'good → better → best', tl: 'mabuti', tag: 'irregular' },
          { fi: 'pitkä → pidempi → pisin', en: 'long → longer → longest', tl: 'mahaba', tag: 'irregular' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Asun iso talossa.',
        right: 'Asun isossa talossa.',
        why: 'The adjective must carry the same case ending as the noun.',
        whyTl: 'Dapat may parehong ending ang pang-uri: isossa talossa.',
      },
      {
        wrong: 'Tämä on hyvämpi.',
        right: 'Tämä on parempi.',
        why: 'hyvä is irregular - its comparative is parempi.',
        whyTl: 'Irregular ang hyvä: parempi.',
      },
    ],
    tip: 'Say the noun phrase as one unit with both endings attached: "isossa-talossa". Treating them as one word stops you forgetting the agreement.',
    tipTl:
      'Sabihin na parang isang salita: "isossa-talossa". Hindi mo makakalimutan ang agreement.',
    exercises: [
      {
        id: 'ex-adj-1',
        kind: 'fill-blank',
        prompt: 'Make the adjective agree.',
        question: 'Asun ___ talossa. (iso)',
        hint: 'Same case as talossa',
        answer: 'isossa',
        explanation:
          'talossa is in the inessive, so the adjective must be too: isossa talossa.',
        explanationTl: 'Parehong kaso: isossa talossa.',
        grammarId: 'g-adjektiivit',
      },
      {
        id: 'ex-adj-2',
        kind: 'choose-form',
        prompt: 'Choose the comparative.',
        question: 'Tämä paita on ___ kuin tuo.',
        hint: 'halpa = cheap',
        options: ['halvin', 'halvempi', 'halpa'],
        answer: 'halvempi',
        explanation:
          '-mpi marks the comparative: halpa → halvempi (with p → v gradation). halvin is the superlative.',
        explanationTl: '-mpi = mas. halvempi = mas mura.',
        grammarId: 'g-adjektiivit',
      },
      {
        id: 'ex-adj-3',
        kind: 'correct-sentence',
        prompt: 'Correct the sentence.',
        question: 'Tämä on hyvämpi kuin tuo.',
        hint: 'hyvä is irregular',
        answer: 'Tämä on parempi kuin tuo.',
        alsoAccept: ['tämä on parempi kuin tuo'],
        explanation: 'hyvä has the irregular comparative parempi.',
        explanationTl: 'Irregular: parempi.',
        grammarId: 'g-adjektiivit',
        wordId: 'a-hyva',
      },
    ],
    relatedGrammar: ['g-inessiivi', 'g-partitiivi'],
    relatedWords: ['a-hyva', 'a-huono', 'a-tarkea', 'a-valmis'],
    origin: 'source-derived',
    source: { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 8: Puhelinta ostamassa', page: 256, sourceTerm: 'adjektiivien vertailu' },
    alsoIn: [
      { bookId: 'sm3', book: 'Suomen mestari 3', chapter: 'Kappale 6: Kummallista', page: 180, sourceTerm: 'adjektiivien komparatiivi' },
      { bookId: 'sm3', book: 'Suomen mestari 3', chapter: 'Kappale 7: Markkinoiden paras', pdfPage: 226, sourceTerm: 'superlatiivi' },
    ],
    verification: 'source-verified',
  },
];
