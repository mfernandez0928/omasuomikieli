import type { GrammarLesson, SourceRef } from '@/types';

/**
 * Five lessons the scanned packet covers and the app did not yet have:
 * postpositions, possessive suffixes, the plural partitive, the
 * osata / voida / saada trio, and conjunctions.
 *
 * Every rule, table and example here is read off the packet's own pages, and
 * the exercises reuse its own sentences. Where the packet's handwritten
 * answers were wrong, the printed question is kept and the correct answer is
 * derived from the rule the same page states - the commonMistake entries in
 * `g-postpositiot` and `g-konjunktiot` are those cases, written up so the
 * mistake is taught rather than silently fixed.
 *
 * Items whose answer was not determined by the sentence alone were left out,
 * because the app shows one question at a time with no worksheet heading to
 * disambiguate it.
 */

function lmSource(pdfPage: number, chapter: string, note: string): SourceRef {
  return {
    bookId: 'lm',
    book: 'Learning Materials (scanned course packet)',
    chapter,
    pdfPage,
    note,
  };
}

export const LM_LESSONS: GrammarLesson[] = [
  /* ===================================================================== */
  /* Postpositiot                                                           */
  /* ===================================================================== */
  {
    id: 'g-postpositiot',
    order: 14,
    title: 'Postpositions',
    subtitle: 'where something is',
    level: 'A2.1',
    finnishTerm: 'postpositiot',
    minutes: 5,
    moduleId: 'm-more',
    levelBasis:
      'Taught in Kappale 6 of the beginner book in the packet, after the local cases. Placed at A2.1 because it needs the genitive, which this app teaches at A1.',

    intro:
      'A postposition is a little word that comes AFTER the thing it describes, not before it like English "under the table". Finnish says "the table under": pöydän alla.',
    introTl:
      'Ang postpositio ay maliit na salitang SUMUSUNOD sa bagay, hindi nauuna gaya ng Ingles. Sa suomi: "pöydän alla" - mesa muna, tapos ang "sa ilalim".',
    rule: 'The word before a postposition goes in the genitive (-n). So it is pöydän alla, kynän vieressä, taulun edessä - never pöytä alla or pöydässä alla.',
    easyRule: {
      left: 'GENETIIVI + postpositio',
      leftNote: 'pöydän alla, kynän vieressä',
      right: 'never the plain word',
      rightNote: 'not pöytä alla',
    },

    examples: [
      { fi: 'Kirja on kynän vieressä.', en: 'The book is next to the pen.', tl: 'Nasa tabi ng panulat ang libro.', tag: 'vieressä', highlight: 'kynän' },
      { fi: 'Opettaja on taulun edessä.', en: 'The teacher is in front of the board.', tl: 'Nasa harap ng pisara ang guro.', tag: 'edessä', highlight: 'taulun' },
      { fi: 'Tuoli on pöydän takana.', en: 'The chair is behind the table.', tl: 'Nasa likod ng mesa ang silya.', tag: 'takana', highlight: 'pöydän' },
      { fi: 'Kirja on kaapin päällä.', en: 'The book is on top of the cupboard.', tl: 'Nasa ibabaw ng aparador ang libro.', tag: 'päällä', highlight: 'kaapin' },
      { fi: 'Reppu on pöydän alla.', en: 'The backpack is under the table.', tl: 'Nasa ilalim ng mesa ang bag.', tag: 'alla', highlight: 'pöydän' },
      { fi: 'Kirja on repun sisällä.', en: 'The book is inside the backpack.', tl: 'Nasa loob ng bag ang libro.', tag: 'sisällä', highlight: 'repun' },
      { fi: 'Kumi on kirjan lähellä.', en: 'The eraser is near the book.', tl: 'Malapit sa libro ang pambura.', tag: 'lähellä', highlight: 'kirjan' },
      { fi: 'Kynä on kumin ja kirjan välissä.', en: 'The pen is between the eraser and the book.', tl: 'Nasa pagitan ng pambura at libro ang panulat.', tag: 'välissä' },
      { fi: 'Sakset ovat pöydän keskellä.', en: 'The scissors are in the middle of the table.', tl: 'Nasa gitna ng mesa ang gunting.', tag: 'keskellä', highlight: 'pöydän' },
      { fi: 'Vihko on kynän oikealla puolella.', en: 'The notebook is to the right of the pen.', tl: 'Nasa kanan ng panulat ang kuwaderno.', tag: 'oikealla puolella' },
      { fi: 'Vihko on kynän vasemmalla puolella.', en: 'The notebook is to the left of the pen.', tl: 'Nasa kaliwa ng panulat ang kuwaderno.', tag: 'vasemmalla puolella' },
    ],

    tables: [
      {
        title: 'Where / to where / from where',
        headers: ['Missä? (where)', 'Mihin? (to where)', 'Mistä? (from where)'],
        rows: [
          ['alla (under)', 'alle', 'alta'],
          ['päällä (on top of)', 'päälle', 'päältä'],
          ['edessä (in front of)', 'eteen', 'edestä'],
          ['takana (behind)', 'taakse', 'takaa'],
          ['vieressä (next to)', 'viereen', 'vierestä'],
          ['sisällä (inside)', 'sisälle', 'sisältä'],
          ['välissä (between)', 'väliin', 'välistä'],
          ['keskellä (in the middle of)', 'keskelle', 'keskeltä'],
        ],
        note: 'Each postposition has three forms, just like the local cases. The genitive before them never changes.',
        noteTl: 'May tatlong anyo ang bawat postpositio, tulad ng paikallissijat. Hindi nagbabago ang genetiivi.',
      },
    ],

    exceptions: [
      {
        title: 'Sometimes a plain case says it better',
        body: 'For simply being inside something, the inessive is shorter and more natural than sisällä. Both are correct.',
        examples: [
          { fi: 'Kirja on repussa.', en: 'The book is in the backpack.', tl: 'Nasa bag ang libro.', tag: 'inessiivi' },
          { fi: 'Kirja on repun sisällä.', en: 'The book is inside the backpack.', tl: 'Nasa loob ng bag ang libro.', tag: 'postpositio' },
        ],
      },
      {
        title: 'ääressä: sitting at something',
        body: 'Use ääressä for sitting at a table or a desk you are working at, not for standing beside it.',
        examples: [
          { fi: 'Istun pöydän ääressä.', en: 'I am sitting at the table.', tl: 'Nakaupo ako sa mesa.', tag: 'ääressä' },
          { fi: 'Seison pöydän vieressä.', en: 'I am standing next to the table.', tl: 'Nakatayo ako sa tabi ng mesa.', tag: 'vieressä' },
        ],
      },
    ],

    mistakes: [
      {
        wrong: 'Koira on laatikossa sisällä.',
        right: 'Koira on laatikon sisällä.',
        why: 'A postposition takes the genitive, not the inessive. Either say laatikon sisällä, or drop the postposition and say laatikossa - but never both at once.',
        whyTl:
          'Genetiivi ang kailangan ng postpositio, hindi inessiivi. Laatikon sisällä, o laatikossa lang - huwag pagsabayin.',
      },
      {
        wrong: 'Kirja on pöytä päällä.',
        right: 'Kirja on pöydän päällä.',
        why: 'The plain dictionary form never stands before a postposition. Put the -n on it first.',
        whyTl: 'Hindi puwedeng perusmuoto bago ang postpositio. Lagyan muna ng -n.',
      },
      {
        wrong: 'Kynä on välissä kumin ja kirjan.',
        right: 'Kynä on kumin ja kirjan välissä.',
        why: 'The postposition comes last. Both things come first, joined by ja.',
        whyTl: 'Huli ang postpositio. Nauuna ang dalawang bagay, pinagdugtong ng ja.',
      },
    ],

    tip: 'English puts the little word first, Finnish puts it last, and the thing in front takes -n. "under the table" becomes "table-n under": pöydän alla.',
    tipTl:
      'Sa Ingles nauuna ang maliit na salita, sa suomi huli - at may -n ang nasa unahan. "sa ilalim ng mesa" = "pöydän alla".',

    exercises: [
      {
        id: 'ex-pp-1',
        kind: 'fill-blank',
        prompt: 'Put the word in the right form.',
        question: 'Kirja on ___ vieressä. (kynä)',
        hint: 'What case goes before a postposition?',
        answer: 'kynän',
        explanation: 'Postpositions take the genitive: kynä -> kynän vieressä.',
        explanationTl: 'Genetiivi ang kasama ng postpositio: kynä -> kynän vieressä.',
        grammarId: 'g-postpositiot',
        wordId: 'n-kyna',
      },
      {
        id: 'ex-pp-2',
        kind: 'fill-blank',
        prompt: 'Put the word in the right form.',
        question: 'Reppu on ___ alla. (pöytä)',
        hint: 'pöytä has t ~ d gradation',
        answer: 'pöydän',
        explanation: 'Genitive of pöytä is pöydän: the t weakens to d. Then alla follows.',
        explanationTl: 'Ang genetiivi ng pöytä ay pöydän: humihina ang t at nagiging d.',
        grammarId: 'g-postpositiot',
      },
      {
        id: 'ex-pp-3',
        kind: 'correct-sentence',
        prompt: 'Correct the sentence.',
        question: 'Koira on laatikossa sisällä.',
        hint: 'One word is in the wrong case',
        answer: 'Koira on laatikon sisällä.',
        alsoAccept: ['koira on laatikon sisällä', 'Koira on laatikossa.', 'koira on laatikossa'],
        explanation:
          'sisällä needs the genitive, so laatikossa has to become laatikon. Saying just "Koira on laatikossa" works too - what you cannot do is use both the case and the postposition.',
        explanationTl:
          'Genetiivi ang kailangan ng sisällä: laatikon. Puwede ring "Koira on laatikossa" - ang mali ay pagsabayin ang dalawa.',
        grammarId: 'g-postpositiot',
      },
      {
        id: 'ex-pp-4',
        kind: 'multiple-choice',
        prompt: 'The dog is lying under the table. Which is right?',
        question: 'Koira on pöydän ___.',
        options: ['alla', 'päällä', 'edessä'],
        answer: 'alla',
        explanation: 'alla = under. päällä would put the dog on top of the table.',
        explanationTl: 'alla = sa ilalim. Ang päällä ay nasa ibabaw.',
        grammarId: 'g-postpositiot',
      },
      {
        id: 'ex-pp-5',
        kind: 'fill-blank',
        prompt: 'Put the word in the right form.',
        question: 'Opettaja on ___ edessä. (taulu)',
        answer: 'taulun',
        explanation: 'taulu -> taulun. No gradation in this word, just add -n.',
        explanationTl: 'taulu -> taulun. Walang astevaihtelu, dagdag -n lang.',
        grammarId: 'g-postpositiot',
      },
      {
        id: 'ex-pp-6',
        kind: 'fill-blank',
        prompt: 'Put BOTH words in the right form.',
        question: 'Kynä on ___ ja ___ välissä. (kumi, kirja)',
        hint: 'Both of them take the same ending',
        answer: 'kumin ja kirjan',
        alsoAccept: ['kumin, kirjan'],
        explanation: 'välissä takes the genitive from both things: kumin ja kirjan välissä.',
        explanationTl: 'Genetiivi ang dalawa: kumin ja kirjan välissä.',
        grammarId: 'g-postpositiot',
      },
      {
        id: 'ex-pp-7',
        kind: 'multiple-choice',
        prompt: 'Which case does a postposition always take?',
        question: '___ + postpositio',
        options: ['genetiivi (-n)', 'partitiivi (-a / -ä)', 'inessiivi (-ssa / -ssä)'],
        answer: 'genetiivi (-n)',
        explanation:
          'Always the genitive. This is the one rule that makes every postposition sentence work.',
        explanationTl: 'Laging genetiivi. Ito ang isang tuntunin na sapat na sa lahat.',
        grammarId: 'g-postpositiot',
      },
      {
        id: 'ex-pp-8',
        kind: 'match',
        prompt: 'Match each postposition with its meaning.',
        question: 'Match the postposition to its meaning',
        answer: 'matched',
        pairs: [
          { left: 'alla', right: 'under' },
          { left: 'päällä', right: 'on top of' },
          { left: 'takana', right: 'behind' },
          { left: 'edessä', right: 'in front of' },
          { left: 'välissä', right: 'between' },
          { left: 'keskellä', right: 'in the middle of' },
        ],
        explanation: 'All six take the genitive before them.',
        explanationTl: 'Lahat ng anim ay may genetiivi sa unahan.',
        grammarId: 'g-postpositiot',
      },
    ],

    relatedGrammar: ['g-genetiivi', 'g-inessiivi'],
    relatedWords: ['pp-alla', 'pp-paalla', 'pp-edessa', 'pp-takana', 'pp-sisalla', 'pp-valissa'],
    origin: 'source-derived',
    source: lmSource(16, 'Kappale 6: Postpositiot', 'printed pages 194-195, KIELIOPPI spread and exercise 27'),
    verification: 'source-verified',
  },

  /* ===================================================================== */
  /* Possessiivisuffiksit                                                   */
  /* ===================================================================== */
  {
    id: 'g-possessiivisuffiksit',
    order: 16,
    title: 'Possessive suffixes',
    subtitle: 'kirjani, mökkimme',
    level: 'A2.2',
    finnishTerm: 'possessiivisuffiksit',
    minutes: 6,
    moduleId: 'm-more',
    levelBasis:
      'Taught in Kappale 6 of the packet alongside written-language style. The app places it at A2.2 because written Finnish is where it actually matters.',

    intro:
      'Written Finnish glues the owner onto the end of the word: kirjani = my book. Spoken Finnish drops it and uses mun, sun, meiän instead. You need to recognise both, and to write the suffix.',
    introTl:
      'Sa sulat na suomi, idinidikit ang may-ari sa dulo: kirjani = aking libro. Sa salita, mun, sun, meiän ang gamit. Dapat kilala mo ang dalawa.',
    rule: 'Add -ni, -si, -nsa/-nsä, -mme, -nne, -nsa/-nsä to the stem, after any case ending. A final -n or -t drops before the suffix, and the suffix pulls the word into the strong grade.',
    easyRule: {
      left: 'kirjakieli',
      leftNote: 'mökkimme, syntymäpäivääni',
      right: 'puhekieli',
      rightNote: 'meiän mökki, mun syntymäpäivää',
    },

    examples: [
      { fi: 'Tervetuloa mökillemme!', en: 'Welcome to our cottage!', tl: 'Maligayang pagdating sa aming kubo!', tag: 'kirjakieli', highlight: 'mökillemme' },
      { fi: 'Tervetuloa meiän mökille!', en: 'Welcome to our cottage!', tl: 'Maligayang pagdating sa aming kubo!', tag: 'puhekieli', highlight: 'meiän' },
      { fi: 'Tässä on kirjani.', en: 'Here is my book.', tl: 'Narito ang libro ko.', tag: '-ni', highlight: 'kirjani' },
      { fi: 'Mikä on nimesi?', en: 'What is your name?', tl: 'Ano ang pangalan mo?', tag: '-si', highlight: 'nimesi' },
      { fi: 'Hänen avaimensa on pöydällä.', en: 'His key is on the table.', tl: 'Nasa mesa ang susi niya.', tag: '-nsa', highlight: 'avaimensa' },
      { fi: 'Mökkimme on järven rannalla.', en: 'Our cottage is on the lake shore.', tl: 'Nasa tabing-lawa ang kubo namin.', tag: '-mme', highlight: 'Mökkimme' },
      { fi: 'Missä lippunne on?', en: 'Where is your (plural) ticket?', tl: 'Nasaan ang tiket ninyo?', tag: '-nne', highlight: 'lippunne' },
      { fi: 'Olen huoneessani.', en: 'I am in my room.', tl: 'Nasa kuwarto ko ako.', tag: 'case + suffix', highlight: 'huoneessani' },
    ],

    tables: [
      {
        title: 'The six suffixes',
        headers: ['Person', 'Suffix', 'Example', 'Spoken'],
        rows: [
          ['minä', '-ni', 'kirjani', 'mun kirja'],
          ['sinä', '-si', 'nimesi', 'sun nimi'],
          ['hän', '-nsa / -nsä', 'hänen avaimensa', 'sen avain'],
          ['me', '-mme', 'mökkimme', 'meiän mökki'],
          ['te', '-nne', 'lippunne', 'teiän lippu'],
          ['he', '-nsa / -nsä', 'heidän osoitteensa', 'niiden osoite'],
        ],
        note: 'Note that mökkimme and lippunne are in the STRONG grade: the suffix pulls mökki and lippu back to mökki-, lippu-.',
        noteTl: 'Pansinin: vahva aste ang mökkimme at lippunne - hinihila ng panlapi pabalik sa malakas.',
      },
      {
        title: 'Case ending first, then the suffix',
        headers: ['Stem', 'Case', 'Suffix', 'Result'],
        rows: [
          ['huonee-', '-ssa', '-ni', 'huoneessani'],
          ['kadu-', '-lla', '-mme', 'kadullamme'],
          ['talo-', '-a', '-si', 'taloasi'],
          ['kaupungi-', '-sta', '-nne', 'kaupungistanne'],
        ],
        note: 'The possessive suffix is always last, after the case ending.',
        noteTl: 'Laging huli ang possessiivisuffiksi, pagkatapos ng päätte.',
      },
    ],

    exceptions: [
      {
        title: 'A final -n or -t disappears',
        body: 'The plural -t, the genitive -n and the illative -n all drop before the suffix.',
        examples: [
          { fi: 'hänen ystävät + nsä -> hänen ystävänsä', en: 'his friends', tl: 'ang mga kaibigan niya', tag: 'monikko' },
          { fi: 'sinun koiran + si -> koirasi', en: 'your dog', tl: 'ang aso mo', tag: 'genetiivi' },
          { fi: 'minun huoneeseen + ni -> huoneeseeni', en: 'into my room', tl: 'papasok sa kuwarto ko', tag: 'illatiivi' },
        ],
      },
      {
        title: 'The adjective never takes the suffix',
        body: 'Only the noun carries it. The adjective in front just takes its case ending.',
        examples: [
          { fi: 'Uudessa talossamme on sauna.', en: 'Our new house has a sauna.', tl: 'May sauna ang bago naming bahay.', tag: 'only the noun' },
          { fi: 'Lapset pitävät teidän pienestä koirastanne.', en: 'The children like your little dog.', tl: 'Gusto ng mga bata ang maliit ninyong aso.', tag: 'only the noun' },
        ],
      },
      {
        title: 'nsa/nsä can become vowel + n',
        body: 'After a case ending, the third-person suffix often shortens to a doubled vowel plus n. Both forms are correct.',
        examples: [
          { fi: 'Olimme heidän mökillään. (= mökillänsä)', en: 'We were at their cottage.', tl: 'Nasa kubo nila kami.', tag: 'Vn' },
          { fi: 'En muista hänen osoitettaan. (= osoitettansa)', en: 'I do not remember his address.', tl: 'Hindi ko matandaan ang address niya.', tag: 'Vn' },
        ],
      },
      {
        title: 'In the nominative it is always nsa/nsä',
        body: 'The short Vn form only appears after a case ending. With no case ending, write nsa/nsä.',
        examples: [
          { fi: 'Heidän mökkinsä on uusi.', en: 'Their cottage is new.', tl: 'Bago ang kubo nila.', tag: 'nominatiivi' },
        ],
      },
    ],

    mistakes: [
      {
        wrong: 'Uudessani talossamme on sauna.',
        right: 'Uudessa talossamme on sauna.',
        why: 'The adjective does not take the possessive suffix. Only the noun does.',
        whyTl: 'Walang possessiivisuffiksi ang adjektiivi. Nasa pangngalan lang.',
      },
      {
        wrong: 'Meidän mökimme on järvellä.',
        right: 'Meidän mökkimme on järvellä.',
        why: 'The suffix pulls the word into the strong grade, so the kk stays: mökkimme, not mökimme.',
        whyTl: 'Vahva aste ang hinihila ng panlapi, kaya kk pa rin: mökkimme.',
      },
      {
        wrong: 'Sinun koiransi on söpö.',
        right: 'Sinun koirasi on söpö.',
        why: 'The genitive -n drops before the suffix: koiran + si = koirasi.',
        whyTl: 'Nawawala ang -n ng genetiivi: koiran + si = koirasi.',
      },
    ],

    tip: 'Order inside the word is always the same: stem, then case ending, then owner. huonee + ssa + ni. And in speech you can skip the whole thing and say mun, sun, meiän.',
    tipTl:
      'Laging pareho ang pagkakasunod: vartalo, pääte, tapos ang may-ari. Sa salita, puwedeng mun, sun, meiän na lang.',

    exercises: [
      {
        id: 'ex-poss-1',
        kind: 'fill-blank',
        prompt: 'Write it in written Finnish, with the suffix.',
        question: 'Tässä on ___. (minun kirja)',
        answer: 'kirjani',
        explanation: 'minun + kirja -> kirjani. The suffix -ni replaces the separate pronoun.',
        explanationTl: 'minun + kirja -> kirjani. Pinapalitan ng -ni ang hiwalay na panghalip.',
        grammarId: 'g-possessiivisuffiksit',
      },
      {
        id: 'ex-poss-2',
        kind: 'fill-blank',
        prompt: 'Write it in written Finnish, with the suffix.',
        question: 'Mikä on ___? (sinun nimi)',
        answer: 'nimesi',
        explanation: 'nime- + si = nimesi.',
        explanationTl: 'nime- + si = nimesi.',
        grammarId: 'g-possessiivisuffiksit',
      },
      {
        id: 'ex-poss-3',
        kind: 'choose-form',
        prompt: 'Which is correct?',
        question: 'Meidän ___ on järven rannalla.',
        options: ['mökkimme', 'mökimme'],
        answer: 'mökkimme',
        explanation: 'The possessive suffix takes the strong grade, so the kk stays: mökkimme.',
        explanationTl: 'Vahva aste sa possessiivisuffiksi, kaya kk pa rin: mökkimme.',
        grammarId: 'g-possessiivisuffiksit',
      },
      {
        id: 'ex-poss-4',
        kind: 'fill-blank',
        prompt: 'Add the case ending and then the suffix.',
        question: 'Olen ___. (minun huone + -ssa)',
        hint: 'stem, case, owner - in that order',
        answer: 'huoneessani',
        explanation: 'huonee- + ssa + ni = huoneessani. The suffix always comes last.',
        explanationTl: 'huonee- + ssa + ni = huoneessani. Laging huli ang panlapi.',
        grammarId: 'g-possessiivisuffiksit',
      },
      {
        id: 'ex-poss-5',
        kind: 'correct-sentence',
        prompt: 'Correct the sentence.',
        question: 'Uudessani talossamme on sauna.',
        hint: 'One word has a suffix it should not have',
        answer: 'Uudessa talossamme on sauna.',
        alsoAccept: ['uudessa talossamme on sauna'],
        explanation: 'Adjectives never take the possessive suffix - only the noun does.',
        explanationTl: 'Walang possessiivisuffiksi ang adjektiivi, nasa pangngalan lang.',
        grammarId: 'g-possessiivisuffiksit',
      },
      {
        id: 'ex-poss-6',
        kind: 'fill-blank',
        prompt: 'Join them. Remember the -n drops.',
        question: 'sinun koiran + si = ___',
        answer: 'koirasi',
        explanation: 'The genitive -n disappears before the suffix: koiran + si = koirasi.',
        explanationTl: 'Nawawala ang -n ng genetiivi: koiran + si = koirasi.',
        grammarId: 'g-possessiivisuffiksit',
      },
      {
        id: 'ex-poss-7',
        kind: 'multiple-choice',
        prompt: 'Which one is spoken Finnish?',
        question: 'mökkimme / meiän mökki',
        options: ['meiän mökki', 'mökkimme', 'Both are spoken'],
        answer: 'meiän mökki',
        explanation:
          'Speech uses the pronoun and drops the suffix. Writing uses the suffix. Both mean "our cottage".',
        explanationTl:
          'Sa salita, panghalip at walang panlapi. Sa sulat, may panlapi. Pareho ang ibig sabihin.',
        grammarId: 'g-possessiivisuffiksit',
      },
      {
        id: 'ex-poss-8',
        kind: 'choose-form',
        prompt: 'No case ending here. Which form of the third-person suffix?',
        question: 'Heidän ___ on uusi. (mökki)',
        options: ['mökkinsä', 'mökkiin'],
        answer: 'mökkinsä',
        explanation:
          'In the nominative it is always nsa/nsä. The short vowel + n form only appears after a case ending.',
        explanationTl:
          'Sa nominatiivi, laging nsa/nsä. Ang maikling anyo ay pagkatapos lang ng pääte.',
        grammarId: 'g-possessiivisuffiksit',
      },
    ],

    relatedGrammar: ['g-genetiivi', 'g-pronominit'],
    origin: 'source-derived',
    source: lmSource(32, 'Kappale 6: Possessiivisuffiksit', 'printed page 188, KIELIOPPI spread'),
    verification: 'source-verified',
  },

  /* ===================================================================== */
  /* Monikon partitiivi                                                     */
  /* ===================================================================== */
  {
    id: 'g-monikon-partitiivi',
    order: 20,
    title: 'Plural partitive',
    subtitle: 'taloja, kirjoja, vaatteita',
    level: 'A2.2',
    finnishTerm: 'monikon partitiivi',
    minutes: 7,
    moduleId: 'm-more',
    levelBasis:
      'Taught in Kappale 8 of the packet, after the singular partitive and the object. The packet devotes six pages to it, which matches its difficulty.',

    intro:
      'This is the form you need for "many things", "some things" and "what are these?". It is the single most common plural form in Finnish - more common than the plural -t - and it is worth the effort.',
    introTl:
      'Ito ang anyo para sa "maraming bagay", "ilang bagay" at "ano ang mga ito?". Ito ang pinakakaraniwang maramihan sa suomi, mas madalas pa kaysa -t.',
    rule: 'Find the plural stem (singular stem + i), then add -a/-ä if the singular stem ends in ONE vowel, or -ta/-tä if it ends in TWO vowels. Long words whose plural stem ends in oi/öi/ei also take -ta/-tä.',
    easyRule: {
      left: 'one vowel -> -a / -ä',
      leftNote: 'talo -> taloja, pöytä -> pöytiä',
      right: 'two vowels -> -ta / -tä',
      rightNote: 'maa -> maita, vaate -> vaatteita',
    },

    examples: [
      { fi: 'Kadulla on autoja.', en: 'There are cars on the street.', tl: 'May mga kotse sa kalye.', tag: 'existential', highlight: 'autoja' },
      { fi: 'Hänellä on ystäviä.', en: 'She has friends.', tl: 'May mga kaibigan siya.', tag: 'possessive', highlight: 'ystäviä' },
      { fi: 'Minulla on paljon kotitehtäviä.', en: 'I have a lot of homework.', tl: 'Marami akong takdang-aralin.', tag: 'paljon', highlight: 'kotitehtäviä' },
      { fi: 'Maija osti torilta tomaatteja ja kurkkuja.', en: 'Maija bought tomatoes and cucumbers at the market.', tl: 'Bumili si Maija ng kamatis at pipino sa palengke.', tag: 'indefinite amount' },
      { fi: 'Nuo naiset ovat kauniita.', en: 'Those women are beautiful.', tl: 'Maganda ang mga babaeng iyon.', tag: 'predicative', highlight: 'kauniita' },
      { fi: 'Isä ei ostanut uusia kenkiä.', en: 'Dad did not buy new shoes.', tl: 'Hindi bumili ng bagong sapatos si Tatay.', tag: 'negative', highlight: 'uusia kenkiä' },
      { fi: 'Pesemme tänään ikkunoita koko päivän.', en: 'We are washing windows all day today.', tl: 'Naglilinis kami ng bintana buong araw.', tag: 'unfinished', highlight: 'ikkunoita' },
      { fi: 'Saappaat ja lenkkarit ovat kenkiä.', en: 'Boots and trainers are shoes.', tl: 'Ang bota at sneakers ay mga sapatos.', tag: 'what are these?', highlight: 'kenkiä' },
    ],

    tables: [
      {
        title: '-a / -ä: singular stem ends in ONE vowel',
        headers: ['perusmuoto', 'yksikkövartalo', 'monikkovartalo', 'monikon partitiivi'],
        rows: [
          ['talo', 'talo-', 'taloi-', 'taloja'],
          ['juna', 'juna-', 'juni-', 'junia'],
          ['opettaja', 'opettaja-', 'opettaji-', 'opettajia'],
          ['pöytä', 'pöydä-', 'pöydi-', 'pöytiä'],
          ['pankki', 'panki-', 'pankei-', 'pankkeja'],
          ['nainen', 'naise-', 'naisi-', 'naisia'],
          ['kysymys', 'kysymykse-', 'kysymyksi-', 'kysymyksiä'],
          ['avain', 'avaime-', 'avaimi-', 'avaimia'],
          ['kirja', 'kirja-', 'kirjoi-', 'kirjoja'],
          ['uusi', 'uude-', 'uusi-', 'uusia'],
        ],
        note: 'Note pöytiä and pankkeja: the plural partitive uses the STRONG grade, even though the singular stem is weak.',
        noteTl: 'Pansinin ang pöytiä at pankkeja: vahva aste ang monikon partitiivi kahit heikko ang yksikkövartalo.',
      },
      {
        title: '-ta / -tä: singular stem ends in TWO vowels',
        headers: ['perusmuoto', 'yksikkövartalo', 'monikkovartalo', 'monikon partitiivi'],
        rows: [
          ['maa', 'maa-', 'mai-', 'maita'],
          ['työ', 'työ-', 'töi-', 'töitä'],
          ['museo', 'museo-', 'museoi-', 'museoita'],
          ['kone', 'konee-', 'konei-', 'koneita'],
          ['kallis', 'kallii-', 'kallii-', 'kalliita'],
          ['asiakas', 'asiakkaa-', 'asiakkai-', 'asiakkaita'],
          ['vaate', 'vaattee-', 'vaattei-', 'vaatteita'],
          ['väsynyt', 'väsynee-', 'väsynei-', 'väsyneitä'],
        ],
        note: 'Every -e word (kone, vaate, perhe, huone) lands here, because its stem ends in a doubled vowel.',
        noteTl: 'Lahat ng salitang -e ay narito, dahil dalawang patinig ang dulo ng vartalo.',
      },
      {
        title: 'Long words whose plural stem ends in oi / öi / ei',
        headers: ['perusmuoto', 'monikkovartalo', 'monikon partitiivi'],
        rows: [
          ['opiskelija', 'opiskelijoi-', 'opiskelijoita'],
          ['kirjailija', 'kirjailijoi-', 'kirjailijoita'],
          ['asia', 'asioi-', 'asioita'],
          ['kynttilä', 'kynttilöi-', 'kynttilöitä'],
          ['vaikea', 'vaikei-', 'vaikeita'],
          ['mansikka', 'mansikoi-', 'mansikoita'],
        ],
        note: 'mansikka is the exception to the strong-grade rule: long -kka/-kkä and -kko/-kkö words take the WEAK grade here.',
        noteTl: 'Ang mansikka ay eksepsiyon: heikko aste ang mahabang -kka/-kkä at -kko/-kkö.',
      },
      {
        title: 'When you need it',
        headers: ['Situation', 'Example'],
        rows: [
          ['amount word + plural', 'paljon poikia, vähän tuoleja, enemmän tyttöjä'],
          ['"X has Y" (omistuslause)', 'Hänellä on ystäviä.'],
          ['"there is / there are"', 'Kadulla on autoja.'],
          ['indefinite amount as object', 'Ostin tomaatteja.'],
          ['action still going on', 'Pesemme ikkunoita.'],
          ['negative sentence', 'He eivät lukeneet niitä kirjoja.'],
          ['what things are (predicative)', 'Talot ovat vanhoja.'],
        ],
      },
    ],

    exceptions: [
      {
        title: 'Strong grade - except for long -kka and -kko words',
        body: 'The plural partitive normally uses the strong grade: pöytiä, pankkeja, vaatteita, asiakkaita. The exception is long words ending in -kka/-kkä or -kko/-kkö, which use the weak grade.',
        examples: [
          { fi: 'mansikka -> mansikoita', en: 'strawberries', tl: 'mga istroberi', tag: 'weak' },
          { fi: 'sammakko -> sammakoita', en: 'frogs', tl: 'mga palaka', tag: 'weak' },
          { fi: 'pankki -> pankkeja', en: 'banks', tl: 'mga bangko', tag: 'strong' },
        ],
      },
      {
        title: 'monta takes the SINGULAR partitive',
        body: 'paljon and vähän take the plural partitive, but monta takes the singular. This catches almost everyone.',
        examples: [
          { fi: 'Kuinka monta lasta sinulla on?', en: 'How many children do you have?', tl: 'Ilan ang anak mo?', tag: 'monta + yksikkö' },
          { fi: 'Minulla on paljon lapsia.', en: 'I have many children.', tl: 'Marami akong anak.', tag: 'paljon + monikko' },
        ],
      },
      {
        title: 'Uncountable things stay singular',
        body: 'With a substance or an abstract idea, paljon takes the singular partitive, because you cannot count it.',
        examples: [
          { fi: 'Minulla on paljon rahaa.', en: 'I have a lot of money.', tl: 'Maraming pera ako.', tag: 'aine' },
          { fi: 'Tammikuussa sataa lunta.', en: 'In January it snows.', tl: 'Umuulan ng niyebe tuwing Enero.', tag: 'aine' },
          { fi: 'Minulla on paljon kirjoja.', en: 'I have a lot of books.', tl: 'Maraming libro ako.', tag: 'countable' },
        ],
      },
      {
        title: 'i becomes j between two vowels',
        body: 'When the plural i lands between two vowels it is written j: kirja + i + a would be kirjoia, so it becomes kirjoja.',
        examples: [
          { fi: 'kirja -> kirjoja', en: 'books', tl: 'mga libro', tag: 'i -> j' },
          { fi: 'talo -> taloja', en: 'houses', tl: 'mga bahay', tag: 'i -> j' },
        ],
      },
    ],

    mistakes: [
      {
        wrong: 'Kuinka monta lapsia sinulla on?',
        right: 'Kuinka monta lasta sinulla on?',
        why: 'monta takes the singular partitive, not the plural. paljon is the one that takes the plural.',
        whyTl: 'Yksikön partitiivi ang kasama ng monta, hindi monikko. Ang paljon ang may monikko.',
      },
      {
        wrong: 'Minulla on paljon rahoja.',
        right: 'Minulla on paljon rahaa.',
        why: 'Money is uncountable, so it stays in the singular partitive even after paljon.',
        whyTl: 'Hindi mabibilang ang pera, kaya yksikön partitiivi kahit may paljon.',
      },
      {
        wrong: 'Nuo naiset ovat kaunista.',
        right: 'Nuo naiset ovat kauniita.',
        why: 'When the subject is plural, the predicative is in the plural partitive too.',
        whyTl: 'Kung maramihan ang subjekti, maramihan din ang predikatiivi.',
      },
      {
        wrong: 'Ostin mansikkoja.',
        right: 'Ostin mansikoita.',
        why: 'Long -kka words take the weak grade and -ita in the plural partitive: mansikka -> mansikoita.',
        whyTl: 'Heikko aste at -ita ang mahabang -kka: mansikka -> mansikoita.',
      },
    ],

    tip: 'Count the vowels at the end of the singular stem. One vowel takes -a/-ä, two vowels take -ta/-tä. That single check gets most words right.',
    tipTl:
      'Bilangin ang patinig sa dulo ng yksikkövartalo. Isa = -a/-ä, dalawa = -ta/-tä. Tama na ito sa karamihan.',

    exercises: [
      {
        id: 'ex-mpart-1',
        kind: 'fill-blank',
        prompt: 'Change the monta sentence to a paljon sentence.',
        question: 'Minun asunnossa on monta huonetta. -> Minun asunnossa on paljon ___.',
        hint: 'huone is an -e word',
        answer: 'huoneita',
        explanation: 'huone -> stem huonee- (two vowels) -> plural stem huonei- -> huoneita.',
        explanationTl: 'huone -> huonee- (dalawang patinig) -> huonei- -> huoneita.',
        grammarId: 'g-monikon-partitiivi',
      },
      {
        id: 'ex-mpart-2',
        kind: 'fill-blank',
        prompt: 'Change the monta sentence to a paljon sentence.',
        question: 'Tekstissä on monta virhettä. -> Tekstissä on paljon ___.',
        answer: 'virheitä',
        explanation: 'virhe is an -e word, so it takes -itä: virheitä.',
        explanationTl: 'Salitang -e ang virhe, kaya -itä: virheitä.',
        grammarId: 'g-monikon-partitiivi',
      },
      {
        id: 'ex-mpart-3',
        kind: 'fill-blank',
        prompt: 'Put the word in the plural partitive.',
        question: 'Minulla on paljon ___. (kotitehtävä)',
        answer: 'kotitehtäviä',
        explanation: 'kotitehtävä ends in one vowel, so -ä: kotitehtäviä.',
        explanationTl: 'Isang patinig ang dulo, kaya -ä: kotitehtäviä.',
        grammarId: 'g-monikon-partitiivi',
      },
      {
        id: 'ex-mpart-4',
        kind: 'fill-blank',
        prompt: 'Careful - monta is not paljon.',
        question: 'Kuinka monta ___ sinulla on? (lapsi)',
        hint: 'monta takes the singular',
        answer: 'lasta',
        explanation:
          'monta takes the SINGULAR partitive: lasta. It would be "paljon lapsia" with paljon.',
        explanationTl: 'Yksikön partitiivi ang monta: lasta. "Paljon lapsia" kung paljon.',
        grammarId: 'g-monikon-partitiivi',
      },
      {
        id: 'ex-mpart-5',
        kind: 'fill-blank',
        prompt: 'Put the word in the plural partitive.',
        question: 'Paita, takki ja housut ovat ___. (vaate)',
        answer: 'vaatteita',
        explanation: 'vaate -> stem vaattee- (two vowels) -> vaatteita. Strong grade: tt stays.',
        explanationTl: 'vaate -> vaattee- -> vaatteita. Vahva aste: tt pa rin.',
        grammarId: 'g-monikon-partitiivi',
      },
      {
        id: 'ex-mpart-6',
        kind: 'fill-blank',
        prompt: 'Put BOTH words in the plural partitive.',
        question: 'Ostin torilta paljon ___ ja ___. (mansikka, peruna)',
        hint: 'mansikka is a long -kka word',
        answer: 'mansikoita ja perunoita',
        alsoAccept: ['mansikoita, perunoita'],
        explanation:
          'mansikka is long and ends in -kka, so weak grade plus -ita: mansikoita. peruna is regular: perunoita.',
        explanationTl:
          'Mahaba at -kka ang mansikka, kaya heikko aste at -ita. Regular ang peruna: perunoita.',
        grammarId: 'g-monikon-partitiivi',
      },
      {
        id: 'ex-mpart-7',
        kind: 'fill-blank',
        prompt: 'Make the whole sentence plural.',
        question: 'Lapsi on pieni. -> ___ ovat ___.',
        answer: 'Lapset ovat pieniä',
        alsoAccept: ['lapset ovat pieniä'],
        explanation:
          'The subject takes the plural -t, and the predicative takes the plural partitive: Lapset ovat pieniä.',
        explanationTl:
          'Ang subjekti ay -t, ang predikatiivi ay monikon partitiivi: Lapset ovat pieniä.',
        grammarId: 'g-monikon-partitiivi',
      },
      {
        id: 'ex-mpart-8',
        kind: 'fill-blank',
        prompt: 'The verb stays singular here. Fill the gap.',
        question: 'Kaupassa on ___. (ihminen)',
        hint: 'An existential sentence: "there are people in the shop"',
        answer: 'ihmisiä',
        explanation:
          'In an existential sentence the verb stays "on" and the subject goes into the plural partitive: Kaupassa on ihmisiä.',
        explanationTl:
          'Sa eksistentiaalilause, "on" pa rin ang verbo at monikon partitiivi ang subjekti.',
        grammarId: 'g-monikon-partitiivi',
      },
      {
        id: 'ex-mpart-9',
        kind: 'fill-blank',
        prompt: 'What are these? Answer in the plural partitive.',
        question: 'Mustikka ja mansikka ovat ___. (marja)',
        answer: 'marjoja',
        explanation: 'marja ends in one vowel, and the i between vowels becomes j: marjoja.',
        explanationTl: 'Isang patinig ang dulo, at nagiging j ang i: marjoja.',
        grammarId: 'g-monikon-partitiivi',
      },
      {
        id: 'ex-mpart-10',
        kind: 'fill-blank',
        prompt: 'What are these? Answer in the plural partitive.',
        question: 'Helsinki ja Pariisi ovat ___. (pääkaupunki)',
        answer: 'pääkaupunkeja',
        explanation: 'Strong grade in the plural partitive: pääkaupunki -> pääkaupunkeja.',
        explanationTl: 'Vahva aste sa monikon partitiivi: pääkaupunki -> pääkaupunkeja.',
        grammarId: 'g-monikon-partitiivi',
      },
      {
        id: 'ex-mpart-11',
        kind: 'choose-form',
        prompt: 'Which is right?',
        question: 'Minulla on paljon ___.',
        options: ['rahaa', 'rahoja'],
        answer: 'rahaa',
        explanation:
          'Money is uncountable, so paljon takes the singular partitive here, not the plural.',
        explanationTl: 'Hindi mabibilang ang pera, kaya yksikön partitiivi.',
        grammarId: 'g-monikon-partitiivi',
      },
      {
        id: 'ex-mpart-12',
        kind: 'fill-blank',
        prompt: 'Put the word in the plural partitive.',
        question: 'Argentiina ja Kreikka ovat ___. (maa)',
        hint: 'maa ends in two vowels',
        answer: 'maita',
        explanation: 'Two vowels at the end of the stem, so -ta: maa -> maita.',
        explanationTl: 'Dalawang patinig ang dulo, kaya -ta: maa -> maita.',
        grammarId: 'g-monikon-partitiivi',
      },
    ],

    relatedGrammar: ['g-partitiivi', 'g-objekti', 'g-kpt'],
    origin: 'source-derived',
    source: lmSource(
      2,
      'Monikon partitiivi',
      'two handouts on PDF 2-3 (formation and use), the exercise sheets on PDF 4-7 and 10, and the Kappale 8 spread on PDF 33-34 (printed page 264)',
    ),
    verification: 'source-verified',
  },

  /* ===================================================================== */
  /* osata / voida / saada                                                  */
  /* ===================================================================== */
  {
    id: 'g-osata-voida-saada',
    order: 22,
    title: 'osata, voida, saada',
    subtitle: 'can, may and know how',
    level: 'A2.1',
    finnishTerm: 'osata, voida ja saada',
    minutes: 5,
    moduleId: 'm-more',
    levelBasis:
      'A worksheet in the packet drills exactly these three against each other. The verbs themselves are A1, but telling them apart is an A2 skill.',

    intro:
      'English says "can" for three different things: a skill, a possibility and a permission. Finnish uses a different verb for each, and picking the wrong one changes what you said.',
    introTl:
      'Sa Ingles, "can" lahat: kakayahan, posibilidad at pahintulot. Sa suomi, magkaiba ang tatlo - at nagbabago ang ibig sabihin kapag mali ang pinili.',
    rule: 'osata = you have learnt how (taito). voida = circumstances allow it (mahdollisuus). saada = you are allowed (lupa). All three are followed by the basic verb form.',
    easyRule: {
      left: 'osata = taito',
      leftNote: 'you know how',
      right: 'voida = mahdollisuus · saada = lupa',
      rightNote: 'it is possible · you are allowed',
    },

    examples: [
      { fi: 'Minä osaan uida.', en: 'I know how to swim.', tl: 'Marunong akong lumangoy.', tag: 'taito' },
      { fi: 'Minä voin auttaa sinua. Minulla on aikaa nyt.', en: 'I can help you. I have time now.', tl: 'Matutulungan kita. May oras ako ngayon.', tag: 'mahdollisuus' },
      { fi: 'Lapsi saa pelata kaksi tuntia päivässä.', en: 'The child is allowed to play two hours a day.', tl: 'Pinapayagan ang bata na maglaro ng dalawang oras.', tag: 'lupa' },
      { fi: 'Sinä osaat piirtää tosi kauniisti.', en: 'You can draw really beautifully.', tl: 'Napakaganda mong gumuhit.', tag: 'taito' },
      { fi: 'Pieni lapsi ei saa mennä yksin kauppaan.', en: 'A small child may not go to the shop alone.', tl: 'Hindi puwedeng mag-isang pumunta sa tindahan ang maliit na bata.', tag: 'ei lupaa' },
      { fi: 'Minulla on vapaa päivä. Me voimme lähteä mökille.', en: 'I have a day off. We can go to the cottage.', tl: 'May libreng araw ako. Puwede kaming pumunta sa kubo.', tag: 'mahdollisuus' },
    ],

    tables: [
      {
        title: 'All three, side by side',
        headers: ['persoona', 'osata (taito)', 'voida (mahdollisuus)', 'saada (lupa)'],
        rows: [
          ['minä', 'osaan', 'voin', 'saan'],
          ['sinä', 'osaat', 'voit', 'saat'],
          ['hän', 'osaa', 'voi', 'saa'],
          ['me', 'osaamme', 'voimme', 'saamme'],
          ['te', 'osaatte', 'voitte', 'saatte'],
          ['he', 'osaavat', 'voivat', 'saavat'],
        ],
        note: 'All three are followed by the basic form of the next verb: osaan uida, voin auttaa, saan mennä.',
        noteTl: 'Perusmuoto ang susunod na verbo sa tatlo: osaan uida, voin auttaa, saan mennä.',
      },
      {
        title: 'Which one, and why',
        headers: ['Question to ask yourself', 'Verb', 'Example'],
        rows: [
          ['Have I learnt it?', 'osata', 'En osaa uida. (I never learnt)'],
          ['Do circumstances allow it?', 'voida', 'En voi tulla, olen töissä.'],
          ['Am I allowed?', 'saada', 'En saa ajaa, minulla ei ole korttia.'],
        ],
      },
    ],

    exceptions: [
      {
        title: 'ei saa is a prohibition',
        body: 'The negative of saada is the standard way to say something is forbidden. It is what signs and rules use.',
        examples: [
          { fi: 'Täällä ei saa tupakoida.', en: 'Smoking is not allowed here.', tl: 'Bawal manigarilyo dito.', tag: 'kielto' },
          { fi: 'Ei saa tehdä jotakin = kieltää', en: 'not being allowed to do something = to forbid', tl: 'bawal gawin = ipinagbabawal', tag: 'kielto' },
        ],
      },
      {
        title: 'saada also means to get',
        body: 'The same verb means to receive. Context tells them apart: with another verb after it, it is permission.',
        examples: [
          { fi: 'Sain lahjan.', en: 'I got a present.', tl: 'Nakatanggap ako ng regalo.', tag: 'to get' },
          { fi: 'Saan mennä kotiin.', en: 'I am allowed to go home.', tl: 'Puwede na akong umuwi.', tag: 'permission' },
        ],
      },
    ],

    mistakes: [
      {
        wrong: 'Minä voin uida, mutta en ole koskaan oppinut.',
        right: 'Minä en osaa uida.',
        why: 'voida is about circumstances, not skill. If you never learnt it, the verb is osata.',
        whyTl: 'Tungkol sa sitwasyon ang voida, hindi sa kakayahan. Kung hindi mo natutunan, osata.',
      },
      {
        wrong: 'Osaan tulla huomenna.',
        right: 'Voin tulla huomenna.',
        why: 'Coming tomorrow is not a skill - it is whether your day allows it. Use voida.',
        whyTl: 'Hindi kasanayan ang pagpunta bukas, kundi kung kaya ng oras mo. Voida.',
      },
      {
        wrong: 'Lapsi ei voi mennä yksin, äiti kieltää.',
        right: 'Lapsi ei saa mennä yksin, äiti kieltää.',
        why: 'If someone forbids it, that is permission, not possibility. Use saada.',
        whyTl: 'Kung may nagbabawal, pahintulot iyon, hindi posibilidad. Saada.',
      },
    ],

    tip: 'Ask yourself: did I learn it (osata), does my day allow it (voida), or will someone let me (saada)?',
    tipTl:
      'Tanungin ang sarili: natutunan ko ba (osata), kaya ba ng araw ko (voida), o papayagan ba ako (saada)?',

    exercises: [
      {
        id: 'ex-ovs-1',
        kind: 'fill-blank',
        prompt: 'osata, voida or saada?',
        question: 'Minä ___ auttaa sinua. Minulla on aikaa nyt.',
        hint: 'Why can you help? Because of your circumstances.',
        answer: 'voin',
        explanation: 'Having time is a circumstance, so it is voida: voin auttaa.',
        explanationTl: 'Sitwasyon ang pagkakaroon ng oras, kaya voida: voin auttaa.',
        grammarId: 'g-osata-voida-saada',
      },
      {
        id: 'ex-ovs-2',
        kind: 'fill-blank',
        prompt: 'osata, voida or saada?',
        question: 'Minä ___ hyvin käyttää tietokonetta.',
        hint: 'This is something you learnt.',
        answer: 'osaan',
        explanation: 'Using a computer well is a skill: osaan.',
        explanationTl: 'Kasanayan ang paggamit ng kompyuter: osaan.',
        grammarId: 'g-osata-voida-saada',
      },
      {
        id: 'ex-ovs-3',
        kind: 'fill-blank',
        prompt: 'osata, voida or saada?',
        question: 'Me ___ lähteä jo kotiin. Opettaja sanoi, että se on ok.',
        hint: 'The teacher said it is ok.',
        answer: 'saamme',
        explanation: 'The teacher gave permission, so it is saada: saamme lähteä.',
        explanationTl: 'Nagbigay ng pahintulot ang guro, kaya saada: saamme lähteä.',
        grammarId: 'g-osata-voida-saada',
      },
      {
        id: 'ex-ovs-4',
        kind: 'fill-blank',
        prompt: 'osata, voida or saada?',
        question: 'Sinä ___ piirtää tosi kauniisti. Wau!',
        answer: 'osaat',
        explanation: 'Drawing beautifully is a learnt skill: osaat.',
        explanationTl: 'Natutunang kasanayan ang maganda mong pagguhit: osaat.',
        grammarId: 'g-osata-voida-saada',
      },
      {
        id: 'ex-ovs-5',
        kind: 'fill-blank',
        prompt: 'osata, voida or saada? Negative form.',
        question: 'Pieni lapsi ei ___ mennä yksin kauppaan. Äiti ja isä kieltävät.',
        hint: 'The parents forbid it.',
        answer: 'saa',
        explanation: 'kieltää means to forbid, so this is permission: ei saa mennä.',
        explanationTl: 'Ang kieltää ay magbawal, kaya pahintulot: ei saa mennä.',
        grammarId: 'g-osata-voida-saada',
      },
      {
        id: 'ex-ovs-6',
        kind: 'fill-blank',
        prompt: 'osata, voida or saada? Negative form.',
        question: 'Minä en ___ uida. Minun täytyy opetella.',
        hint: 'You have to learn it first.',
        answer: 'osaa',
        explanation: 'Needing to learn it shows it is a skill you lack: en osaa uida.',
        explanationTl: 'Kailangan pang matutunan, kaya kasanayan: en osaa uida.',
        grammarId: 'g-osata-voida-saada',
      },
      {
        id: 'ex-ovs-7',
        kind: 'fill-blank',
        prompt: 'osata, voida or saada?',
        question: 'Hän ___ pelata jalkapalloa tosi hyvin. Hän on taitava jalkapallossa.',
        answer: 'osaa',
        explanation: 'taitava means skilful, which settles it: osaa.',
        explanationTl: 'Ang taitava ay magaling, kaya osaa.',
        grammarId: 'g-osata-voida-saada',
      },
      {
        id: 'ex-ovs-8',
        kind: 'fill-blank',
        prompt: 'osata, voida or saada?',
        question: 'Minä ___ ajaa mökille, koska minulla on auto.',
        hint: 'Having a car makes it possible.',
        answer: 'voin',
        explanation: 'Owning a car is a circumstance that makes it possible: voin ajaa.',
        explanationTl: 'Sitwasyon ang pagkakaroon ng kotse: voin ajaa.',
        grammarId: 'g-osata-voida-saada',
      },
      {
        id: 'ex-ovs-9',
        kind: 'fill-blank',
        prompt: 'osata, voida or saada?',
        question: 'Minun lapsi ___ pelata puhelimella 2 tuntia päivässä.',
        hint: 'A parent set the limit.',
        answer: 'saa',
        explanation: 'A rule set by a parent is permission: saa pelata.',
        explanationTl: 'Patakaran ng magulang, kaya pahintulot: saa pelata.',
        grammarId: 'g-osata-voida-saada',
      },
      {
        id: 'ex-ovs-10',
        kind: 'fill-blank',
        prompt: 'osata, voida or saada?',
        question: '2-vuotias lapsi ei vielä ___ pelata puhelimella.',
        hint: 'A two-year-old has not learnt how.',
        answer: 'osaa',
        explanation:
          'A two-year-old has not learnt how yet - "ei vielä" points at a missing skill, so osata.',
        explanationTl:
          'Hindi pa natututo ang dalawang taong gulang - kakayahan ito, kaya osata.',
        grammarId: 'g-osata-voida-saada',
      },
      {
        id: 'ex-ovs-11',
        kind: 'multiple-choice',
        prompt: 'Which verb goes with a skill you learnt?',
        question: 'taito = ___',
        options: ['osata', 'voida', 'saada'],
        answer: 'osata',
        explanation: 'osata = taito, a skill. voida = possibility, saada = permission.',
        explanationTl: 'osata = taito. voida = posibilidad, saada = pahintulot.',
        grammarId: 'g-osata-voida-saada',
      },
      {
        id: 'ex-ovs-12',
        kind: 'correct-sentence',
        prompt: 'Correct the sentence. The speaker never learnt to swim.',
        question: 'Minä en voi uida, koska en ole oppinut.',
        hint: 'Which verb is about a skill?',
        answer: 'Minä en osaa uida, koska en ole oppinut.',
        alsoAccept: ['minä en osaa uida, koska en ole oppinut', 'En osaa uida, koska en ole oppinut.'],
        explanation:
          'Not having learnt something is a missing skill, so it is osata. "En voi uida" would mean something is stopping you today.',
        explanationTl:
          'Kakulangan sa kasanayan ito, kaya osata. Ang "En voi uida" ay may pumipigil ngayon.',
        grammarId: 'g-osata-voida-saada',
      },
    ],

    relatedGrammar: ['g-verbityypit', 'g-kielto'],
    origin: 'source-derived',
    source: lmSource(
      19,
      'OSATA / VOIDA / SAADA',
      'worksheet "Kirjoita OSATA, VOIDA tai SAADA -verbi lauseeseen", with the taito / mahdollisuus / lupa glosses written on it',
    ),
    verification: 'source-verified',
  },

  /* ===================================================================== */
  /* Konjunktiot                                                            */
  /* ===================================================================== */
  {
    id: 'g-konjunktiot',
    order: 26,
    title: 'Conjunctions',
    subtitle: 'joining two sentences',
    level: 'A2.2',
    finnishTerm: 'konjunktiot',
    minutes: 6,
    moduleId: 'm-more',
    levelBasis:
      'The packet teaches these as one set in a book aimed above beginner level, and several of them (jotta, sillä, vaan, kuten) only matter once you are writing longer sentences.',

    intro:
      'Short sentences are correct but they sound like a list. Conjunctions are what turn them into Finnish that reads properly. Three pairs are worth real attention: tai/vai, mutta/vaan and koska/sillä.',
    introTl:
      'Tama ang maiikling pangungusap, pero parang listahan ang dating. Ang konjunktio ang nagpapagandang-dugtong. Tatlong pares ang dapat pagtuunan: tai/vai, mutta/vaan, koska/sillä.',
    rule: 'Most conjunctions take a comma before them. tai joins choices in a statement and vai in a question; mutta contrasts after a positive clause and vaan corrects after a negative one.',
    easyRule: {
      left: 'tai · mutta · koska',
      leftNote: 'statement · contrast · reason',
      right: 'vai · vaan · sillä',
      rightNote: 'question · after a negative · cannot start a sentence',
    },

    examples: [
      { fi: 'Huomenna pelaan jalkapalloa ja näen ystäviä.', en: 'Tomorrow I play football and see friends.', tl: 'Bukas maglalaro ako ng putbol at makikita ang mga kaibigan.', tag: 'ja' },
      { fi: 'Liisa kertoi, että hän menee naimisiin.', en: 'Liisa said that she is getting married.', tl: 'Sinabi ni Liisa na ikakasal siya.', tag: 'että' },
      { fi: 'Säästän rahaa, jotta voin ostaa uuden pyörän.', en: 'I save money so that I can buy a new bike.', tl: 'Nag-iipon ako para makabili ng bagong bisikleta.', tag: 'jotta' },
      { fi: 'Riitta ei mene työhön tänään, koska hän on sairas.', en: 'Riitta is not going to work today because she is ill.', tl: 'Hindi papasok si Riitta ngayon kasi may sakit siya.', tag: 'koska' },
      { fi: 'Opiskelen illalla, sillä huomenna on testi.', en: 'I study in the evening, for there is a test tomorrow.', tl: 'Nag-aaral ako sa gabi, kasi may pagsusulit bukas.', tag: 'sillä' },
      { fi: 'Kun loma alkaa, matkustan Italiaan.', en: 'When the holiday starts, I travel to Italy.', tl: 'Kapag nagsimula ang bakasyon, pupunta ako sa Italya.', tag: 'kun' },
      { fi: 'Ostan ison talon, jos voitan kaksi miljoonaa.', en: 'I will buy a big house if I win two million.', tl: 'Bibili ako ng malaking bahay kung mananalo ako ng dalawang milyon.', tag: 'jos' },
      { fi: 'Lähden kävelylle, vaikka ulkona sataa vettä.', en: 'I am going for a walk although it is raining.', tl: 'Maglalakad ako kahit umuulan.', tag: 'vaikka' },
      { fi: 'Sinun autosi on isompi kuin minun.', en: 'Your car is bigger than mine.', tl: 'Mas malaki ang kotse mo kaysa sa akin.', tag: 'kuin' },
      { fi: 'Haluaisin lähteä Pariisiin, mutta minulla ei ole rahaa.', en: 'I would like to go to Paris, but I have no money.', tl: 'Gusto kong pumunta sa Paris, pero wala akong pera.', tag: 'mutta' },
      { fi: 'Huomenna ei ole keskiviikko, vaan tiistai.', en: 'Tomorrow is not Wednesday, but Tuesday.', tl: 'Hindi Miyerkules bukas, kundi Martes.', tag: 'vaan' },
      { fi: 'Tänään palautan testin, kuten lupasin.', en: 'I am handing in the test today, as I promised.', tl: 'Isusumite ko ang pagsusulit ngayon, gaya ng ipinangako ko.', tag: 'kuten' },
      { fi: 'Lähden lomalle Keniaan tai Etiopiaan.', en: 'I am going on holiday to Kenya or Ethiopia.', tl: 'Magbabakasyon ako sa Kenya o Ethiopia.', tag: 'tai' },
      { fi: 'Olitko lomalla Keniassa vai Etiopiassa?', en: 'Were you on holiday in Kenya or Ethiopia?', tl: 'Nagbakasyon ka ba sa Kenya o sa Ethiopia?', tag: 'vai' },
    ],

    tables: [
      {
        title: 'The fourteen',
        headers: ['konjunktio', 'meaning', 'example'],
        rows: [
          ['ja', 'and', 'Pelaan jalkapalloa ja näen ystäviä.'],
          ['että', 'that', 'Liisa kertoi, että hän menee naimisiin.'],
          ['jotta', 'so that', 'Säästän rahaa, jotta voin ostaa pyörän.'],
          ['koska', 'because', 'Hän ei tule, koska hän on sairas.'],
          ['sillä', 'for, because', 'Opiskelen, sillä huomenna on testi.'],
          ['kun', 'when', 'Kun loma alkaa, matkustan.'],
          ['jos', 'if', 'Ostan talon, jos voitan.'],
          ['vaikka', 'although', 'Lähden, vaikka sataa.'],
          ['kuin', 'than, as', 'Sinun autosi on isompi kuin minun.'],
          ['mutta', 'but', 'Haluaisin, mutta ei ole rahaa.'],
          ['vaan', 'but rather', 'Ei ole keskiviikko, vaan tiistai.'],
          ['kuten', 'like, as', 'Palautan testin, kuten lupasin.'],
          ['tai', 'or (statement)', 'Keniaan tai Etiopiaan.'],
          ['vai', 'or (question)', 'Keniassa vai Etiopiassa?'],
        ],
      },
      {
        title: 'The three pairs that cause trouble',
        headers: ['Pair', 'Use the first when', 'Use the second when'],
        rows: [
          ['tai / vai', 'you are stating a choice', 'you are asking someone to choose'],
          ['mutta / vaan', 'the first clause is positive', 'the first clause is negative'],
          ['koska / sillä', 'either position in the sentence', 'only between two main clauses'],
        ],
      },
    ],

    exceptions: [
      {
        title: 'koska can start a sentence, sillä cannot',
        body: 'They mean the same, but only koska can be moved to the front.',
        examples: [
          { fi: 'Koska hän on sairas, hän ei tule.', en: 'Because she is ill, she is not coming.', tl: 'Dahil may sakit siya, hindi siya pupunta.', tag: 'koska' },
          { fi: 'Hän ei tule, sillä hän on sairas.', en: 'She is not coming, for she is ill.', tl: 'Hindi siya pupunta, kasi may sakit siya.', tag: 'sillä' },
        ],
      },
      {
        title: 'että and jotta are not the same',
        body: 'että reports a fact. jotta states a purpose. English "that" covers both, which is why they get mixed up.',
        examples: [
          { fi: 'Hän sanoi, että hän säästää rahaa.', en: 'He said that he is saving money.', tl: 'Sinabi niyang nag-iipon siya.', tag: 'fact' },
          { fi: 'Hän säästää rahaa, jotta hän voi ostaa auton.', en: 'He saves money so that he can buy a car.', tl: 'Nag-iipon siya para makabili ng kotse.', tag: 'purpose' },
        ],
      },
    ],

    mistakes: [
      {
        wrong: 'Haluaisin lähteä Pariisiin, mutta ei ole rahaa.',
        right: 'Haluaisin lähteä Pariisiin, mutta minulla ei ole rahaa.',
        why: 'The clause after mutta still needs its own subject. Dropping minulla leaves it hanging.',
        whyTl:
          'Kailangan pa rin ng sariling subjekti ang sugnay pagkatapos ng mutta. Huwag alisin ang minulla.',
      },
      {
        wrong: 'Huomenna ei ole keskiviikko, mutta tiistai.',
        right: 'Huomenna ei ole keskiviikko, vaan tiistai.',
        why: 'After a negative clause that is being corrected, the word is vaan, not mutta.',
        whyTl: 'Pagkatapos ng negatibong itinatama, vaan ang gamit, hindi mutta.',
      },
      {
        wrong: 'Haluatko teetä tai kahvia?',
        right: 'Haluatko teetä vai kahvia?',
        why: 'In a question that asks the listener to choose, the word is vai.',
        whyTl: 'Sa tanong na pumipili ang kausap, vai ang gamit.',
      },
      {
        wrong: 'Kun loma alkaa, matkustaan Italiaan.',
        right: 'Kun loma alkaa, matkustan Italiaan.',
        why: 'matkustan is "I travel". matkustaan is the passive and has no "I" in it.',
        whyTl: 'Ang matkustan ay "pupunta ako". Ang matkustaan ay passiivi, walang "ako".',
      },
    ],

    tip: 'Question? vai. Correcting a negative? vaan. Everything else is the one you first thought of.',
    tipTl: 'Tanong? vai. Itinatama ang negatibo? vaan. Ang iba, iyong unang naisip mo.',

    exercises: [
      {
        id: 'ex-konj-1',
        kind: 'fill-blank',
        prompt: 'Join the two sentences with the right conjunction.',
        question: 'Liisa kertoi. Liisa menee naimisiin. -> Liisa kertoi, ___ hän menee naimisiin.',
        answer: 'että',
        explanation: 'että reports what someone said.',
        explanationTl: 'Ang että ay nag-uulat ng sinabi ng iba.',
        grammarId: 'g-konjunktiot',
      },
      {
        id: 'ex-konj-2',
        kind: 'fill-blank',
        prompt: 'Join the two sentences with the right conjunction.',
        question: 'Säästän rahaa. Rahalla voin ostaa uuden pyörän. -> Säästän rahaa, ___ voin ostaa uuden pyörän.',
        hint: 'This is a purpose, not a fact',
        answer: 'jotta',
        explanation: 'jotta states the purpose. että would only report a fact.',
        explanationTl: 'Layunin ang jotta. Katotohanan lang ang että.',
        grammarId: 'g-konjunktiot',
      },
      {
        id: 'ex-konj-3',
        kind: 'fill-blank',
        prompt: 'Join the two sentences with the right conjunction.',
        question: 'Riitta ei mene työhön tänään. Riitta on sairas. -> Riitta ei mene työhön tänään, ___ hän on sairas.',
        answer: 'koska',
        alsoAccept: ['sillä'],
        explanation: 'Both koska and sillä work here. Only koska could also start the sentence.',
        explanationTl: 'Parehong tama ang koska at sillä. Koska lang ang puwedeng pansimula.',
        grammarId: 'g-konjunktiot',
      },
      {
        id: 'ex-konj-4',
        kind: 'choose-form',
        prompt: 'tai or vai?',
        question: 'Olitko lomalla Keniassa ___ Etiopiassa?',
        options: ['vai', 'tai'],
        answer: 'vai',
        explanation: 'It is a question asking you to choose one, so vai.',
        explanationTl: 'Tanong na pumipili, kaya vai.',
        grammarId: 'g-konjunktiot',
      },
      {
        id: 'ex-konj-5',
        kind: 'choose-form',
        prompt: 'tai or vai?',
        question: 'Lähden lomalle Keniaan ___ Etiopiaan.',
        options: ['tai', 'vai'],
        answer: 'tai',
        explanation: 'It is a statement, not a question, so tai.',
        explanationTl: 'Pasalaysay, hindi tanong, kaya tai.',
        grammarId: 'g-konjunktiot',
      },
      {
        id: 'ex-konj-6',
        kind: 'choose-form',
        prompt: 'mutta or vaan?',
        question: 'Huomenna ei ole keskiviikko, ___ tiistai.',
        options: ['vaan', 'mutta'],
        answer: 'vaan',
        explanation: 'The first clause is negative and is being corrected, so vaan.',
        explanationTl: 'Negatibo ang unang sugnay at itinatama, kaya vaan.',
        grammarId: 'g-konjunktiot',
      },
      {
        id: 'ex-konj-7',
        kind: 'fill-blank',
        prompt: 'Join the two sentences with the right conjunction.',
        question: 'Ulkona sataa vettä. Lähden kävelylle kuitenkin. -> Lähden kävelylle, ___ ulkona sataa vettä.',
        hint: 'kuitenkin means "even so"',
        answer: 'vaikka',
        explanation: 'vaikka = although. It introduces the thing that does not stop you.',
        explanationTl: 'Ang vaikka ay "kahit". Ipinapasok nito ang hindi pumipigil sa iyo.',
        grammarId: 'g-konjunktiot',
      },
      {
        id: 'ex-konj-8',
        kind: 'correct-sentence',
        prompt: 'Correct the sentence.',
        question: 'Haluaisin lähteä Pariisiin, mutta ei ole rahaa.',
        hint: 'Who has no money?',
        answer: 'Haluaisin lähteä Pariisiin, mutta minulla ei ole rahaa.',
        alsoAccept: ['haluaisin lähteä pariisiin, mutta minulla ei ole rahaa'],
        explanation:
          'The clause after mutta needs its own subject. "Minulla ei ole rahaa" is the complete thought.',
        explanationTl:
          'Kailangan ng sariling subjekti ang sugnay pagkatapos ng mutta: minulla ei ole rahaa.',
        grammarId: 'g-konjunktiot',
      },
      {
        id: 'ex-konj-9',
        kind: 'fill-blank',
        prompt: 'Join the two sentences with the right conjunction.',
        question: 'Tänään palautan testin. Minä lupasin palauttaa testin. -> Tänään palautan testin, ___ lupasin.',
        answer: 'kuten',
        explanation: 'kuten = as, like. It points back at what was promised.',
        explanationTl: 'Ang kuten ay "gaya ng". Tumutukoy sa ipinangako.',
        grammarId: 'g-konjunktiot',
      },
      {
        id: 'ex-konj-10',
        kind: 'match',
        prompt: 'Match each conjunction with its meaning.',
        question: 'Match the conjunction to its meaning',
        answer: 'matched',
        pairs: [
          { left: 'jotta', right: 'so that' },
          { left: 'vaikka', right: 'although' },
          { left: 'kuten', right: 'like, as' },
          { left: 'vaan', right: 'but rather' },
          { left: 'kuin', right: 'than' },
          { left: 'sillä', right: 'for, because' },
        ],
        explanation: 'These six are the ones that do not map one-to-one onto English.',
        explanationTl: 'Ang anim na ito ang walang tuwirang katumbas sa Ingles.',
        grammarId: 'g-konjunktiot',
      },
    ],

    relatedGrammar: ['g-kielto'],
    relatedWords: ['k-jotta', 'k-silla', 'k-kun', 'k-kuten', 'k-tai', 'k-vai', 'k-vaan'],
    origin: 'source-derived',
    source: lmSource(
      36,
      'Konjunktioita',
      'printed page 40 (Oikeesti aikuisten 2), "Yhdistä kaksi lausetta konjunktiolla"',
    ),
    verification: 'source-verified',
  },
];
