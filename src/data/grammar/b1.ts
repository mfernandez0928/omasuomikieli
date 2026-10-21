import type { GrammarLesson } from '@/types';

/** B1: the structures that separate "understandable" from "fluent". */
export const B1_LESSONS: GrammarLesson[] = [
  {
    id: 'g-rektio',
    order: 25,
    title: 'Verb rections',
    subtitle: 'which case does this verb want?',
    level: 'A2.1',
    finnishTerm: 'rektio',
    minutes: 6,
    moduleId: 'm-more',
    levelBasis:
      'Suomen mestari 2 teaches this and states "taitotasolla A2" in its Alkusanat. The A2.1 / A2.2 split is this app\'s own granularity, not the book\'s.',
    intro:
      'Every Finnish verb demands a particular case from the word that follows it, and that choice is simply a fact about the verb, not something you can work out from meaning. English gives no help: "I trust you" and "I like coffee" look the same but take different cases in Finnish.',
    introTl:
      'Bawat verbo sa suomi ay may hinihinging kaso. Hindi ito mahuhulaan sa kahulugan - kabisaduhin kasama ng verbo. Walang tulong ang Ingles dito.',
    rule: 'Learn each verb together with its case, as one unit: not "luottaa = to trust" but "luottaa + -Vn". Store the whole phrase, never the bare verb.',
    easyRule: {
      left: 'verb + case',
      leftNote: 'learn them as one unit',
      right: 'never translate the case',
      rightNote: 'English gives no clue',
    },
    examples: [
      { fi: 'pidän kahvista', en: 'I like coffee', tl: 'gusto ko ang kape', tag: '-sta/-stä' },
      { fi: 'luotan sinuun', en: 'I trust you', tl: 'nagtitiwala ako sa iyo', tag: '-Vn' },
      { fi: 'kysyn sinulta', en: 'I ask you', tl: 'tinatanong kita', tag: '-lta/-ltä' },
      { fi: 'vastaan sinulle', en: 'I answer you', tl: 'sinasagot kita', tag: '-lle' },
      { fi: 'tuntuu hyvältä', en: 'it feels good', tl: 'maganda ang pakiramdam', tag: '-lta/-ltä' },
      { fi: 'osallistun kurssiin', en: 'I take part in the course', tl: 'lalahok ako sa kurso', tag: '-Vn' },
      { fi: 'odotan bussia', en: 'I wait for the bus', tl: 'hinihintay ko ang bus', tag: 'partitiivi' },
      { fi: 'riippuu säästä', en: 'it depends on the weather', tl: 'depende sa panahon', tag: '-sta/-stä' },
    ],
    exceptions: [
      {
        title: 'One verb, two cases, two meanings',
        body: 'Some verbs change meaning entirely with the case. These are worth a place in My Mistakes.',
        examples: [
          { fi: 'vaikuttaa terveyteen', en: 'to affect health', tl: 'makaapekto sa kalusugan', tag: '-Vn = affect' },
          { fi: 'vaikuttaa hyvältä', en: 'to seem good', tl: 'mukhang maganda', tag: '-lta = seem' },
          { fi: 'vastata kysymykseen', en: 'to answer a question', tl: 'sagutin ang tanong', tag: '-Vn = answer it' },
          { fi: 'vastata työstä', en: 'to be responsible for the work', tl: 'responsable sa trabaho', tag: '-sta = responsible' },
        ],
      },
      {
        title: 'The "seeming" family all take -lta/-ltä',
        body: 'tuntua, näyttää, kuulostaa, maistua and haista form one group. Learn the group, not five separate facts.',
        examples: [
          { fi: 'Kuulostaa hyvältä.', en: 'Sounds good.', tl: 'Mukhang maganda.', tag: 'group' },
          { fi: 'Maistuu hyvältä.', en: 'Tastes good.', tl: 'Masarap.', tag: 'group' },
        ],
      },
      {
        title: 'Rections that catch everyone out',
        body: 'These four are the ones learners get wrong for years.',
        examples: [
          { fi: 'tykkään jostakin', en: 'I like something', tl: 'gusto ko ang isang bagay', tag: '-sta, not partitive' },
          { fi: 'rakastan jotakin', en: 'I love something', tl: 'mahal ko', tag: 'partitive, not -sta' },
          { fi: 'ilmoittaudun kurssille', en: 'I register for a course', tl: 'magpaparehistro ako', tag: '-lle' },
          { fi: 'osallistun kurssiin', en: 'I participate in a course', tl: 'lalahok ako', tag: '-Vn, different!' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Luotan sinua.',
        right: 'Luotan sinuun.',
        why: 'luottaa demands the illative. The English "trust you" gives no hint.',
        whyTl: 'Illatiivi ang luottaa: sinuun.',
      },
      {
        wrong: 'Pidän kahvia.',
        right: 'Pidän kahvista.',
        why: 'pitää in the "like" sense demands the elative.',
        whyTl: 'Ang pitää (gusto) ay -sta: kahvista.',
      },
      {
        wrong: 'Kysyn sinulle.',
        right: 'Kysyn sinulta.',
        why: 'Information is taken FROM a person: kysyä + -lta/-ltä.',
        whyTl: 'Mula sa tao: kysyn sinulta.',
      },
    ],
    tip: 'Never write a verb in your notes on its own. Write "luottaa + -Vn (luotan sinuun)". The case is part of the word.',
    tipTl:
      'Huwag isulat ang verbo nang mag-isa. Isulat: "luottaa + -Vn (luotan sinuun)". Bahagi ng salita ang kaso.',
    exercises: [
      {
        id: 'ex-rek-1',
        kind: 'choose-case',
        prompt: 'Choose the correct case.',
        question: 'Osallistun ___.',
        hint: 'kokous = meeting',
        options: ['kokoukselle', 'kokoukseen', 'kokouksesta'],
        answer: 'kokoukseen',
        explanation:
          'osallistua takes the illative: osallistun kokoukseen. Compare ilmoittautua, which takes -lle.',
        explanationTl: 'Illatiivi ang osallistua: kokoukseen.',
        grammarId: 'g-rektio',
        wordId: 'v-osallistua',
      },
      {
        id: 'ex-rek-2',
        kind: 'multiple-choice',
        prompt: 'What does "Se vaikuttaa hyvältä" mean?',
        question: 'Se vaikuttaa hyvältä.',
        options: ['It affects health.', 'It seems good.', 'It influences well.'],
        answer: 'It seems good.',
        explanation:
          'With -lta/-ltä, vaikuttaa means "to seem". With the illative it means "to affect": vaikuttaa terveyteen.',
        explanationTl: 'Kapag -ltä: "mukhang". Kapag -Vn: "nakakaapekto".',
        grammarId: 'g-rektio',
        wordId: 'v-vaikuttaa',
      },
      {
        id: 'ex-rek-3',
        kind: 'match',
        prompt: 'Match each verb with the case it demands.',
        question: 'Match verb to case',
        answer: 'matched',
        pairs: [
          { left: 'pitää (like)', right: '-sta / -stä' },
          { left: 'luottaa', right: '-Vn' },
          { left: 'kysyä', right: '-lta / -ltä' },
          { left: 'odottaa', right: 'partitiivi' },
        ],
        explanation:
          'These four cover most everyday errors. Like FROM, trust INTO, ask FROM, wait + partitive.',
        explanationTl:
          'Apat na pangunahing rektio. Kabisaduhin nang sabay.',
        grammarId: 'g-rektio',
      },
      {
        id: 'ex-rek-4',
        kind: 'correct-sentence',
        prompt: 'Correct the rection.',
        question: 'Minä pidän suomen kieltä.',
        hint: 'Which case does pitää want?',
        answer: 'Minä pidän suomen kielestä.',
        alsoAccept: ['minä pidän suomen kielestä', 'Pidän suomen kielestä.'],
        explanation:
          'pitää in the "like" sense takes the elative: pidän suomen kielestä.',
        explanationTl: 'Ang pitää ay -sta: kielestä.',
        grammarId: 'g-rektio',
        wordId: 'v-pitaa',
      },
    ],
    relatedGrammar: ['g-elatiivi', 'g-illatiivi', 'g-ablatiivi', 'g-allatiivi'],
    relatedWords: ['v-luottaa', 'v-pitaa', 'v-kysya', 'v-vaikuttaa', 'v-osallistua', 'v-tuntua'],
    origin: 'source-derived',
    source: { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 4: Mitä teet vapaa-ajalla?', page: 116, sourceTerm: 'verbi + rektio' },
    alsoIn: [
      { bookId: 'sm2', book: 'Suomen mestari 2', chapter: 'Kappale 7: Alexin haastattelu', page: 218, sourceTerm: 'verbi + rektio' },
      { bookId: 'sm3', book: 'Suomen mestari 3', chapter: 'Kappale 6: Kummallista', page: 180, sourceTerm: 'verbi + rektio' },
    ],
    verification: 'source-verified',
  },

  {
    id: 'g-konditionaali',
    order: 27,
    title: 'Conditional (-isi-)',
    subtitle: 'would, could, politely',
    level: 'A2.2',
    finnishTerm: 'konditionaali',
    minutes: 5,
    moduleId: 'm-more',
    levelBasis:
      'Suomen mestari 3 teaches this and states taitotaso A2.2 in its Alkusanat.',
    intro:
      'The conditional does two jobs: it describes things that are not real ("if I had time"), and it makes requests polite. In daily life the second use matters far more.',
    introTl:
      'Dalawa ang gamit: para sa hindi totoo ("kung may oras ako"), at para maging magalang. Sa araw-araw, mas mahalaga ang pangalawa.',
    rule: 'Insert -isi- between the stem and the personal ending. A stem-final -a/-ä disappears before it, and the type 1 verbs use the strong grade.',
    easyRule: {
      left: 'stem + isi + ending',
      leftNote: 'puhu + isi + n = puhuisin',
      right: 'politeness',
      rightNote: 'Voisitko...? Haluaisin...',
    },
    examples: [
      { fi: 'Voisitko auttaa minua?', en: 'Could you help me?', tl: 'Pwede mo ba akong tulungan?', tag: 'polite' },
      { fi: 'Haluaisin varata ajan.', en: 'I would like to book an appointment.', tl: 'Gusto ko sanang mag-book.', tag: 'polite' },
      { fi: 'Jos minulla olisi aikaa, tulisin.', en: 'If I had time, I would come.', tl: 'Kung may oras ako, pupunta ako.', tag: 'unreal' },
      { fi: 'Saisinko kahvin?', en: 'Could I have a coffee?', tl: 'Pwede bang kape?', tag: 'ordering' },
      { fi: 'Sopisiko torstai?', en: 'Would Thursday suit?', tl: 'Ok ba ang Huwebes?', tag: 'arranging' },
    ],
    exceptions: [
      {
        title: 'Both halves of an if-sentence take the conditional',
        body: 'Unlike English, Finnish puts the conditional in the "if" clause too.',
        examples: [
          { fi: 'Jos olisin rikas, matkustaisin paljon.', en: 'If I were rich, I would travel a lot.', tl: 'Kung mayaman ako, maglalakbay ako.', tag: 'both halves' },
        ],
      },
      {
        title: 'The stem vowel drops',
        body: 'A final -a or -ä disappears before -isi-, which is why haluta gives haluaisin and not *haluaisin from halua+isi with both vowels.',
        examples: [
          { fi: 'otan → ottaisin', en: 'I take → I would take', tl: 'kukunin ko sana', tag: 'strong grade!' },
          { fi: 'annan → antaisin', en: 'I give → I would give', tl: 'ibibigay ko sana', tag: 'strong grade!' },
        ],
      },
      {
        title: 'The conditional uses the STRONG grade',
        body: 'Even though the minä present is weak (otan), the conditional goes back to the strong grade: ottaisin.',
        examples: [
          { fi: 'otan, mutta ottaisin', en: 'I take, but I would take', tl: 'kinukuha ko, pero kukunin ko sana', tag: 'tt returns' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Voitko auttaa minua, kiitos?',
        right: 'Voisitko auttaa minua?',
        why: 'Not wrong grammatically, but the present sounds blunt. The conditional is what makes a request polite in Finnish.',
        whyTl: 'Hindi mali, pero parang utos. Mas magalang ang konditionaali.',
      },
      {
        wrong: 'Jos minulla on aikaa, tulisin.',
        right: 'Jos minulla olisi aikaa, tulisin.',
        why: 'Both halves of an unreal condition take the conditional.',
        whyTl: 'Pareho dapat ang konditionaali sa magkabilang bahagi.',
      },
      {
        wrong: 'Minä otaisin.',
        right: 'Minä ottaisin.',
        why: 'The conditional uses the strong grade: ottaisin.',
        whyTl: 'Malakas ang grado sa konditionaali: ottaisin.',
      },
    ],
    tip: 'Memorise four polite openers and you can handle almost any counter, office or phone call: Voisitko...? Haluaisin... Saisinko...? Sopisiko...?',
    tipTl:
      'Apat na magalang na simula: Voisitko...? Haluaisin... Saisinko...? Sopisiko...?',
    exercises: [
      {
        id: 'ex-kond-1',
        kind: 'fill-blank',
        prompt: 'Make the request polite.',
        question: '___ auttaa minua? (voida, sinä)',
        hint: 'Conditional question form',
        answer: 'Voisitko',
        alsoAccept: ['voisitko'],
        explanation:
          'voi- plus -isi- plus -t plus the question -ko gives Voisitko - the standard polite request.',
        explanationTl: 'voi + isi + t + ko = Voisitko.',
        grammarId: 'g-konditionaali',
        wordId: 'v-voida',
      },
      {
        id: 'ex-kond-2',
        kind: 'conjugate',
        prompt: 'Write the conditional.',
        question: 'Jos minulla olisi aikaa, minä ___. (tulla)',
        hint: 'tule- + isi + n',
        answer: 'tulisin',
        explanation: 'tule- plus -isi- loses the stem -e-, giving tulisin.',
        explanationTl: 'tule + isi + n = tulisin.',
        grammarId: 'g-konditionaali',
        wordId: 'v-tulla',
      },
      {
        id: 'ex-kond-3',
        kind: 'correct-sentence',
        prompt: 'Correct the sentence.',
        question: 'Jos minulla on rahaa, ostaisin auton.',
        hint: 'What tense does the "if" half need?',
        answer: 'Jos minulla olisi rahaa, ostaisin auton.',
        alsoAccept: ['jos minulla olisi rahaa, ostaisin auton'],
        explanation:
          'An unreal condition puts both halves in the conditional: olisi and ostaisin.',
        explanationTl: 'Pareho dapat konditionaali: olisi at ostaisin.',
        grammarId: 'g-konditionaali',
      },
      {
        id: 'ex-kond-4',
        kind: 'translate',
        prompt: 'Translate politely into Finnish.',
        question: 'I would like to book an appointment.',
        hint: 'haluta in the conditional',
        answer: 'Haluaisin varata ajan.',
        alsoAccept: ['haluaisin varata ajan'],
        explanation:
          'haluaisin is the polite "I would like". After it comes the basic infinitive varata, and the object loses its -n... but aika here is a total object, so ajan is correct.',
        explanationTl: 'Haluaisin = gusto ko sana. Tapos basic form: varata ajan.',
        grammarId: 'g-konditionaali',
        wordId: 'v-haluta',
      },
    ],
    relatedGrammar: ['g-imperatiivi', 'g-objekti', 'g-kpt'],
    relatedWords: ['v-voida', 'v-haluta', 'v-saada', 'v-sopia'],
    origin: 'source-derived',
    source: { bookId: 'sm3', book: 'Suomen mestari 3', chapter: 'Kappale 1: Säästetään energiaa ja kierrätetään!', page: 10, pdfPage: 16, sourceTerm: 'konditionaalin preesens ja perfekti' },
    verification: 'source-verified',
  },

  {
    id: 'g-passiivi',
    order: 28,
    title: 'Passive',
    subtitle: 'tehdään, puhutaan',
    level: 'A2.2',
    finnishTerm: 'passiivi',
    minutes: 6,
    moduleId: 'm-more',
    levelBasis:
      'Suomen mestari 3 teaches this and states taitotaso A2.2 in its Alkusanat.',
    intro:
      'The Finnish passive says that something is done without saying who does it. It is everywhere in official letters and signs - and in speech it is also how people say "we".',
    introTl:
      'Sinasabi ng passive na may ginagawa, pero hindi sinasabi kung sino. Nasa lahat ng opisyal na sulat - at sa usapan, ito ang "tayo".',
    rule: 'Present passive: for verb types 1, 4, 5 and 6 add -taan/-tään to the weak stem; for types 2 and 3 add -daan/-dään or -laan/-llaan style endings to the stem. Past passive: -ttiin/-tiin. The negative drops the final -an: ei tehdä, ei puhuta.',
    easyRule: {
      left: '-taan / -tään',
      leftNote: 'puhutaan, tehdään',
      right: '= "we" in speech',
      rightNote: 'mennään! = let us go!',
    },
    examples: [
      { fi: 'Täällä puhutaan suomea.', en: 'Finnish is spoken here.', tl: 'Suomi ang salita rito.', tag: 'present' },
      { fi: 'Hakemus hyväksyttiin.', en: 'The application was approved.', tl: 'Naaprubahan ang aplikasyon.', tag: 'past' },
      { fi: 'Mennään!', en: "Let's go!", tl: 'Tara na!', tag: 'puhekieli "we"' },
      { fi: 'Palkka maksetaan 15. päivä.', en: 'The salary is paid on the 15th.', tl: 'Binabayad ang sahod sa ika-15.', tag: 'official' },
      { fi: 'Täällä ei saa tupakoida.', en: 'Smoking is not allowed here.', tl: 'Bawal manigarilyo rito.', tag: 'sign' },
    ],
    exceptions: [
      {
        title: 'In speech the passive replaces "me"',
        body: 'Finns almost never say "me menemme". They say "me mennään" - the passive with the pronoun in front. Recognising this is essential for understanding everyday speech.',
        examples: [
          { fi: 'Me menemme kotiin.', en: 'We go home.', tl: 'Uuwi kami.', tag: 'yleiskieli' },
          { fi: 'Me mennään kotiin.', en: 'We go home.', tl: 'Uuwi kami.', tag: 'puhekieli' },
        ],
      },
      {
        title: 'The passive never names a doer',
        body: 'You cannot add "by someone" to a Finnish passive the way English does. If you need the doer, use an active sentence.',
        examples: [
          { fi: 'Talo rakennettiin 1990.', en: 'The house was built in 1990.', tl: 'Itinayo ang bahay noong 1990.', tag: 'no doer' },
        ],
      },
      {
        title: 'The negative shortens',
        body: 'ei + the passive without its final -an: ei puhuta, ei tehdä, ei menty.',
        examples: [
          { fi: 'Täällä ei puhuta englantia.', en: 'English is not spoken here.', tl: 'Walang ingles dito.', tag: 'negative' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'Suomea puhutaan minulta.',
        right: 'Minä puhun suomea.',
        why: 'The passive cannot name the doer. Switch to an active sentence.',
        whyTl: 'Hindi pwedeng sabihin kung sino sa passive. Gumamit ng active.',
      },
      {
        wrong: 'Täällä ei puhutaan englantia.',
        right: 'Täällä ei puhuta englantia.',
        why: 'The negative passive drops the final -an.',
        whyTl: 'Sa negatibo, nawawala ang -an: ei puhuta.',
      },
    ],
    tip: 'Two things to take away: read it as "one does / it is done" in official texts, and hear it as "we" when someone says "mennään".',
    tipTl:
      'Dalawa: sa opisyal na sulat, "ginagawa". Sa usapan, "tayo" - "mennään!" = "tara!".',
    exercises: [
      {
        id: 'ex-pass-1',
        kind: 'multiple-choice',
        prompt: 'What does "Mennään!" mean in everyday speech?',
        question: 'Mennään!',
        options: ['It is gone.', "Let's go!", 'They went.'],
        answer: "Let's go!",
        explanation:
          'In spoken Finnish the passive serves as the "we" form, so Mennään! is an invitation to go together.',
        explanationTl: 'Sa usapan, ang passive ay "tayo": Mennään! = Tara na!',
        grammarId: 'g-passiivi',
        wordId: 'v-menna',
      },
      {
        id: 'ex-pass-2',
        kind: 'fill-blank',
        prompt: 'Fill in the passive.',
        question: 'Täällä ___ suomea. (puhua)',
        hint: 'Present passive',
        answer: 'puhutaan',
        explanation: 'puhua gives the passive puhutaan: "Finnish is spoken here".',
        explanationTl: 'puhua → puhutaan.',
        grammarId: 'g-passiivi',
        wordId: 'v-puhua',
      },
      {
        id: 'ex-pass-3',
        kind: 'correct-sentence',
        prompt: 'Correct the negative passive.',
        question: 'Täällä ei puhutaan englantia.',
        hint: 'Something gets shorter',
        answer: 'Täällä ei puhuta englantia.',
        alsoAccept: ['täällä ei puhuta englantia'],
        explanation: 'The negative passive loses the final -an: ei puhuta.',
        explanationTl: 'Nawawala ang -an: ei puhuta.',
        grammarId: 'g-passiivi',
      },
      {
        id: 'ex-pass-4',
        kind: 'translate',
        prompt: 'Translate into Finnish (official style).',
        question: 'The application was approved.',
        hint: 'hyväksyä, past passive',
        answer: 'Hakemus hyväksyttiin.',
        alsoAccept: ['hakemus hyväksyttiin'],
        explanation:
          'The past passive -ttiin is what you read in Kela and TE-toimisto letters.',
        explanationTl: 'Ganito ang nakasulat sa sulat ng Kela: hyväksyttiin.',
        grammarId: 'g-passiivi',
        wordId: 'v-hyvaksya',
      },
    ],
    relatedGrammar: ['g-partisiipit', 'g-kielto'],
    relatedWords: ['v-hyvaksya', 'n-palkka', 'v-nahda', 'n-hakemus'],
    origin: 'source-derived',
    source: { bookId: 'sm3', book: 'Suomen mestari 3', chapter: 'Kappale 2: Kaupunkifestivaalit', pdfPage: 54, sourceTerm: 'passiivin preesens' },
    alsoIn: [
      { bookId: 'sm3', book: 'Suomen mestari 3', chapter: 'Kappale 2: Kaupunkifestivaalit', pdfPage: 54, sourceTerm: 'passiivin objekti' },
    ],
    verification: 'source-verified',
  },

  {
    id: 'g-partisiipit',
    order: 29,
    title: 'Participles',
    subtitle: '-nut, -va, -ttu',
    level: 'B1',
    finnishTerm: 'partisiipit',
    minutes: 6,
    moduleId: 'm-b1',
    levelBasis:
      'Not found in the contents of any readable source, so the level is this app\'s own judgement and is not confirmed by a book. The available books stop at A2.2, so nothing here is evidenced as B1.',
    intro:
      'Participles turn verbs into adjectives. They let you pack a whole relative clause into one word, which is exactly what written Finnish does all the time - and what the YKI reading test is full of.',
    introTl:
      'Ginagawang pang-uri ang verbo. Nagiging isang salita ang buong sugnay - ganito ang nakasulat na suomi, at ito ang laman ng YKI reading test.',
    rule: 'NUT participle (-nut/-nyt, plural -neet): a completed action, used in the perfect and as "having done". VA participle (-va/-vä): an ongoing action, "doing". TU participle (-ttu/-tty, -tu/-ty): a passive result, "done / having been done".',
    easyRule: {
      left: '-nut = did it',
      leftNote: 'olen tehnyt',
      right: '-ttu = it was done',
      rightNote: 'tehty työ',
    },
    examples: [
      { fi: 'Olen tehnyt sen.', en: 'I have done it.', tl: 'Nagawa ko na iyon.', tag: 'NUT' },
      { fi: 'suomea puhuva mies', en: 'a Finnish-speaking man', tl: 'lalaking nagsasalita ng suomi', tag: 'VA' },
      { fi: 'tehty työ', en: 'the work that has been done', tl: 'ang tapos nang trabaho', tag: 'TU' },
      { fi: 'kirjoitettu hakemus', en: 'a written application', tl: 'nakasulat na aplikasyon', tag: 'TU' },
      { fi: 'Suomessa asuva ystäväni', en: 'my friend living in Finland', tl: 'kaibigan kong nakatira sa Suomi', tag: 'VA' },
    ],
    exceptions: [
      {
        title: 'Participles replace relative clauses',
        body: 'Written Finnish prefers the one-word participle to the longer joka clause. Both are correct, but the participle sounds more formal.',
        examples: [
          { fi: 'mies, joka puhuu suomea', en: 'a man who speaks Finnish', tl: 'lalaking nagsasalita', tag: 'clause' },
          { fi: 'suomea puhuva mies', en: 'a Finnish-speaking man', tl: 'lalaking nagsasalita', tag: 'participle' },
        ],
      },
      {
        title: 'Participles inflect like adjectives',
        body: 'They agree with their noun in case and number, just like any adjective.',
        examples: [
          { fi: 'Suomessa asuvalle ystävälle', en: 'to my friend living in Finland', tl: 'sa kaibigan kong nakatira sa Suomi', tag: '-lle on both' },
        ],
      },
      {
        title: 'The NUT participle is already familiar',
        body: 'You have been using it since the perfect tense and the negative past. It is the same form.',
        examples: [
          { fi: 'En puhunut.', en: 'I did not speak.', tl: 'Hindi ako nagsalita.', tag: 'negative past' },
          { fi: 'Olen puhunut.', en: 'I have spoken.', tl: 'Nakapagsalita na ako.', tag: 'perfect' },
        ],
      },
    ],
    mistakes: [
      {
        wrong: 'puhuva suomea mies',
        right: 'suomea puhuva mies',
        why: 'The participle and everything belonging to it come BEFORE the noun, in that order.',
        whyTl: 'Nauuna ang buong parirala bago ang pangngalan.',
      },
      {
        wrong: 'Suomessa asuva ystävälle',
        right: 'Suomessa asuvalle ystävälle',
        why: 'The participle must take the same case as the noun.',
        whyTl: 'Dapat parehong kaso: asuvalle ystävälle.',
      },
    ],
    tip: 'Read them right to left: "suomea puhuva mies" = the man ← who speaks ← Finnish. Once you can unpack them, formal Finnish gets much easier.',
    tipTl:
      'Basahin pakaliwa: "suomea puhuva mies" = ang lalaki ← na nagsasalita ← ng suomi.',
    exercises: [
      {
        id: 'ex-part2-1',
        kind: 'multiple-choice',
        prompt: 'What does "suomea puhuva mies" mean?',
        question: 'suomea puhuva mies',
        options: ['a man who spoke Finnish', 'a Finnish-speaking man', 'a man spoken to in Finnish'],
        answer: 'a Finnish-speaking man',
        explanation:
          'The VA participle describes an ongoing action by the noun itself: the man does the speaking.',
        explanationTl: 'Ang -va ay kasalukuyang kilos ng pangngalan mismo.',
        grammarId: 'g-partisiipit',
      },
      {
        id: 'ex-part2-2',
        kind: 'fill-blank',
        prompt: 'Fill in the NUT participle.',
        question: 'Olen ___ hakemuksen. (lähettää)',
        hint: 'Perfect tense',
        answer: 'lähettänyt',
        explanation:
          'lähettää gives the NUT participle lähettänyt (front vowels, so -nyt).',
        explanationTl: 'lähettää → lähettänyt.',
        grammarId: 'g-partisiipit',
      },
      {
        id: 'ex-part2-3',
        kind: 'correct-sentence',
        prompt: 'Correct the word order.',
        question: 'Puhuva suomea mies auttoi minua.',
        hint: 'Where does the participle phrase go?',
        answer: 'Suomea puhuva mies auttoi minua.',
        alsoAccept: ['suomea puhuva mies auttoi minua'],
        explanation:
          'The object of the participle comes first: suomea puhuva mies.',
        explanationTl: 'Nauuna ang objekti: suomea puhuva mies.',
        grammarId: 'g-partisiipit',
      },
    ],
    relatedGrammar: ['g-perfekti', 'g-passiivi', 'g-adjektiivit'],
    relatedWords: ['n-tehtava', 'v-tehda', 'v-hyvaksya'],
    origin: 'supplementary',
    openQuestion:
      'Suomen mestari 2 chapter 5 lists "sanatyypit ut/yt ja nut/nyt", which is about word types rather than participles as a system. Participles are likely covered in Suomen mestari 4, which could not be read. Additional content.',
    source: null,
    verification: 'linguistically-checked',
  },
];
