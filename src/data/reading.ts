import type { Exercise, Level } from '@/types';

/**
 * Short reading passages at A2.1-B1, written for this app.
 *
 * Each text is the kind of thing you actually have to read in Finland: a
 * message from work, a letter from an office, a notice on a door. Vocabulary
 * is kept inside the app's own word list wherever possible.
 */
export interface ReadingText {
  id: string;
  title: string;
  level: Level;
  minutes: number;
  /** Paragraphs of Finnish. */
  body: string[];
  /** English translation, shown on request - never before the questions. */
  translation: string[];
  /** Words worth pre-teaching, linked to the dictionary where they exist. */
  glossary: { fi: string; en: string; tl: string; wordId?: string }[];
  questions: Exercise[];
}

export const READING_TEXTS: ReadingText[] = [
  {
    id: 'r-tyovuoro',
    title: 'Viesti esimieheltä',
    level: 'A2.2',
    minutes: 4,
    body: [
      'Hei Mark,',
      'Ensi viikolla on muutos työvuoroissa. Sinun aamuvuorosi siirtyy tiistaista keskiviikkoon. Torstaina sinulla on iltavuoro kello 14-22.',
      'Jos tämä ei sovi sinulle, ilmoita minulle maanantaihin mennessä. Voit myös vaihtaa vuoroa työkaverin kanssa, mutta kerro siitä minulle etukäteen.',
      'Ystävällisin terveisin, Anna',
    ],
    translation: [
      'Hi Mark,',
      'Next week there is a change to the shifts. Your morning shift moves from Tuesday to Wednesday. On Thursday you have the evening shift from 14:00 to 22:00.',
      'If this does not suit you, let me know by Monday. You can also swap shifts with a colleague, but tell me about it in advance.',
      'Kind regards, Anna',
    ],
    glossary: [
      { fi: 'vuoro', en: 'shift', tl: 'shift', wordId: 'n-vuoro' },
      { fi: 'siirtyä', en: 'to move, to be transferred', tl: 'lumipat' },
      { fi: 'etukäteen', en: 'in advance', tl: 'nang maaga' },
      { fi: 'ilmoittaa', en: 'to notify', tl: 'ipaalam', wordId: 'v-ilmoittaa' },
    ],
    questions: [
      {
        id: 'rq-tyovuoro-1',
        kind: 'multiple-choice',
        prompt: 'Read the message, then answer.',
        question: 'Minä päivänä Markilla on nyt aamuvuoro?',
        options: ['Tiistaina', 'Keskiviikkona', 'Torstaina'],
        answer: 'Keskiviikkona',
        explanation:
          'The text says the morning shift moves "tiistaista keskiviikkoon" - from Tuesday to Wednesday. The -sta marks where it moves FROM and the -Vn where it moves TO.',
        explanationTl:
          'Lumipat ang aamuvuoro mula Martes papuntang Miyerkules: "tiistaista keskiviikkoon".',
        grammarId: 'g-illatiivi',
      },
      {
        id: 'rq-tyovuoro-2',
        kind: 'multiple-choice',
        prompt: 'Answer based on the text.',
        question: 'Mihin mennessä Markin pitää ilmoittaa, jos vuoro ei sovi?',
        options: ['Maanantaihin mennessä', 'Tiistaihin mennessä', 'Ei tarvitse ilmoittaa'],
        answer: 'Maanantaihin mennessä',
        explanation:
          '"Maanantaihin mennessä" means "by Monday". The structure is illative + mennessä, and it is standard deadline wording in Finnish.',
        explanationTl: '"Maanantaihin mennessä" = hanggang Lunes.',
        grammarId: 'g-illatiivi',
      },
      {
        id: 'rq-tyovuoro-3',
        kind: 'multiple-choice',
        prompt: 'Answer based on the text.',
        question: 'Saako Mark vaihtaa vuoroa työkaverin kanssa?',
        options: [
          'Ei saa missään tapauksessa',
          'Saa, mutta esimiehelle pitää kertoa etukäteen',
          'Saa, eikä tarvitse kertoa kenellekään',
        ],
        answer: 'Saa, mutta esimiehelle pitää kertoa etukäteen',
        explanation:
          'The text allows the swap ("Voit myös vaihtaa vuoroa") but adds a condition with mutta: the supervisor must be told beforehand.',
        explanationTl:
          'Pwede, pero may kondisyon: dapat sabihin muna sa esimies ("kerro siitä minulle etukäteen").',
      },
      {
        id: 'rq-tyovuoro-4',
        kind: 'translate',
        prompt: 'Find the Finnish in the text.',
        question: 'If this does not suit you',
        hint: 'Three words, starting with Jos',
        answer: 'Jos tämä ei sovi sinulle',
        alsoAccept: ['jos tämä ei sovi sinulle'],
        explanation:
          'sopia takes -lle for the person: sopii sinulle. In the negative the verb drops to its bare form: ei sovi (with p → v gradation).',
        explanationTl: 'Ang sopia ay -lle: sopii sinulle. Sa negatibo: ei sovi.',
        grammarId: 'g-allatiivi',
      },
    ],
  },
  {
    id: 'r-kela',
    title: 'Kirje Kelasta',
    level: 'B1',
    minutes: 5,
    body: [
      'Hyvä asiakas,',
      'Olemme käsitelleet hakemuksesi. Valitettavasti emme voi myöntää tukea, koska hakemuksesta puuttuu liitteitä. Tarvitsemme kopion työsopimuksestasi ja viimeisimmän palkkalaskelman.',
      'Lähetä puuttuvat liitteet kahden viikon kuluessa. Voit lähettää ne verkkopalvelussa tai postitse. Jos et lähetä liitteitä määräaikaan mennessä, hakemus hylätään.',
      'Jos sinulla on kysyttävää, soita asiakaspalveluun.',
    ],
    translation: [
      'Dear customer,',
      'We have processed your application. Unfortunately we cannot grant the benefit, because attachments are missing from the application. We need a copy of your employment contract and your most recent payslip.',
      'Send the missing attachments within two weeks. You can send them through the online service or by post. If you do not send the attachments by the deadline, the application will be rejected.',
      'If you have any questions, call customer service.',
    ],
    glossary: [
      { fi: 'käsitellä', en: 'to process, to handle', tl: 'iproseso', wordId: 'v-kasitella' },
      { fi: 'myöntää', en: 'to grant', tl: 'ipagkaloob' },
      { fi: 'liite', en: 'attachment', tl: 'attachment' },
      { fi: 'määräaika', en: 'deadline', tl: 'takdang panahon' },
      { fi: 'hylätä', en: 'to reject', tl: 'tanggihan' },
    ],
    questions: [
      {
        id: 'rq-kela-1',
        kind: 'multiple-choice',
        prompt: 'Read the letter, then answer.',
        question: 'Miksi tukea ei voida myöntää?',
        options: [
          'Koska asiakas ansaitsee liikaa',
          'Koska hakemuksesta puuttuu liitteitä',
          'Koska hakemus tuli myöhässä',
        ],
        answer: 'Koska hakemuksesta puuttuu liitteitä',
        explanation:
          'The reason follows koska: "hakemuksesta puuttuu liitteitä". Note that puuttua takes -sta/-stä for the thing something is missing from.',
        explanationTl: 'Ang dahilan: kulang ang mga liite (attachment).',
        grammarId: 'g-elatiivi',
      },
      {
        id: 'rq-kela-2',
        kind: 'multiple-choice',
        prompt: 'Answer based on the text.',
        question: 'Mitä tapahtuu, jos liitteitä ei lähetetä ajoissa?',
        options: ['Hakemus hylätään', 'Kela soittaa asiakkaalle', 'Tuki myönnetään silti'],
        answer: 'Hakemus hylätään',
        explanation:
          '"Hakemus hylätään" is the passive: the application will be rejected, with no named actor. This is exactly how official Finnish letters are written.',
        explanationTl:
          'Passive ang gamit: "hylätään" = tatanggihan. Ganito ang opisyal na sulat.',
        grammarId: 'g-passiivi',
      },
      {
        id: 'rq-kela-3',
        kind: 'fill-blank',
        prompt: 'Complete from the text.',
        question: 'Lähetä puuttuvat liitteet kahden viikon ___.',
        hint: 'Means "within"',
        answer: 'kuluessa',
        explanation:
          '"kahden viikon kuluessa" = within two weeks. The time phrase takes the genitive before kuluessa.',
        explanationTl: '"kahden viikon kuluessa" = sa loob ng dalawang linggo.',
        grammarId: 'g-genetiivi',
      },
      {
        id: 'rq-kela-4',
        kind: 'multiple-choice',
        prompt: 'Answer based on the text.',
        question: 'Millä kahdella tavalla liitteet voi lähettää?',
        options: [
          'Verkkopalvelussa tai postitse',
          'Sähköpostilla tai tekstiviestillä',
          'Vain käymällä toimistossa',
        ],
        answer: 'Verkkopalvelussa tai postitse',
        explanation:
          'The text gives exactly two options: "verkkopalvelussa tai postitse" - in the online service or by post. The -itse ending on postitse means "by way of".',
        explanationTl: 'Dalawang paraan: online o sa koreo.',
      },
    ],
  },
  {
    id: 'r-terveysasema',
    title: 'Ilmoitus terveysaseman ovessa',
    level: 'A2.1',
    minutes: 3,
    body: [
      'HUOM!',
      'Terveysasema on suljettu perjantaina 14.6. henkilökunnan koulutuksen vuoksi.',
      'Kiireellisissä asioissa soita päivystykseen numeroon 116 117. Hätätilanteessa soita 112.',
      'Ajanvaraus avautuu taas maanantaina kello 8.00. Pahoittelemme häiriötä.',
    ],
    translation: [
      'NOTE!',
      'The health centre is closed on Friday 14 June due to staff training.',
      'For urgent matters call the on-call service on 116 117. In an emergency call 112.',
      'Appointment booking opens again on Monday at 8:00. We apologise for the disruption.',
    ],
    glossary: [
      { fi: 'suljettu', en: 'closed', tl: 'sarado' },
      { fi: 'kiireellinen', en: 'urgent', tl: 'madalian' },
      { fi: 'päivystys', en: 'on-call / emergency service', tl: 'emergency service' },
      { fi: 'häiriö', en: 'disruption', tl: 'abala' },
    ],
    questions: [
      {
        id: 'rq-terveys-1',
        kind: 'multiple-choice',
        prompt: 'Read the notice, then answer.',
        question: 'Miksi terveysasema on suljettu?',
        options: ['Remontin vuoksi', 'Henkilökunnan koulutuksen vuoksi', 'Juhlapäivän vuoksi'],
        answer: 'Henkilökunnan koulutuksen vuoksi',
        explanation:
          '"X:n vuoksi" means "because of X", and it follows a genitive: henkilökunnan koulutuksen vuoksi.',
        explanationTl: '"vuoksi" = dahil sa. Kailangan ng genetiivi bago ito.',
        grammarId: 'g-genetiivi',
      },
      {
        id: 'rq-terveys-2',
        kind: 'multiple-choice',
        prompt: 'Answer based on the notice.',
        question: 'Mihin numeroon soitat hätätilanteessa?',
        options: ['116 117', '112', '8.00'],
        answer: '112',
        explanation:
          'The notice separates two cases: 116 117 for urgent but non-emergency matters, and 112 in a genuine emergency (hätätilanne). 112 is the emergency number everywhere in Finland.',
        explanationTl:
          '112 ang emergency. Ang 116 117 ay para sa madalian pero hindi emergency.',
      },
      {
        id: 'rq-terveys-3',
        kind: 'multiple-choice',
        prompt: 'Answer based on the notice.',
        question: 'Milloin ajanvaraus avautuu taas?',
        options: ['Perjantaina kello 8', 'Maanantaina kello 8', 'Ei kerrota'],
        answer: 'Maanantaina kello 8',
        explanation:
          'Days of the week take the essive -na/-nä for "on": maanantaina = on Monday.',
        explanationTl: 'Ang araw ay may -na: maanantaina = sa Lunes.',
      },
    ],
  },
];

export const READING_BY_ID = new Map(READING_TEXTS.map((t) => [t.id, t]));
