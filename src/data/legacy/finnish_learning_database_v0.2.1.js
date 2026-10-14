// Oma Suomi Finnish Learning Database v0.2.1
// Refreshed downloadable starter file. Original example sentences included.
// Validate entries and add verified source book/chapter metadata before production use.

export const finnishLearningData = {
  "version": "0.2.1",
  "app": "Oma Suomi",
  "purpose": "Personal Finnish-learning PWA database",
  "language_support": [
    "Finnish",
    "English",
    "Tagalog"
  ],
  "note": "Refreshed downloadable starter dataset. Check every entry against the source books before treating source attribution or level as verified.",
  "stats": {
    "words": 25,
    "grammar_items": 5
  },
  "words": [
    {
      "id": "puhua",
      "finnish": "puhua",
      "english": "to speak",
      "tagalog": "magsalita",
      "word_type": "verbi",
      "vartalo": "puhu-",
      "verbityyppi": 1,
      "level": "A2.1",
      "topic": "kieli",
      "forms": {
        "minä": "puhun",
        "sinä": "puhut",
        "hän": "puhuu",
        "me": "puhumme",
        "te": "puhutte",
        "he": "puhuvat"
      },
      "example": "Puhun vähän suomea.",
      "example_english": "I speak a little Finnish.",
      "example_tagalog": "Nagsasalita ako ng kaunting Finnish."
    },
    {
      "id": "syoda",
      "finnish": "syödä",
      "english": "to eat",
      "tagalog": "kumain",
      "word_type": "verbi",
      "vartalo": "syö-",
      "verbityyppi": 2,
      "level": "A2.1",
      "topic": "ruoka",
      "forms": {
        "minä": "syön",
        "sinä": "syöt",
        "hän": "syö",
        "me": "syömme",
        "te": "syötte",
        "he": "syövät"
      },
      "example": "Syön aamupalaa kotona.",
      "example_english": "I eat breakfast at home.",
      "example_tagalog": "Kumakain ako ng almusal sa bahay."
    },
    {
      "id": "tulla",
      "finnish": "tulla",
      "english": "to come",
      "tagalog": "dumating; pumunta rito",
      "word_type": "verbi",
      "vartalo": "tule-",
      "verbityyppi": 3,
      "level": "A2.1",
      "topic": "arkielämä",
      "forms": {
        "minä": "tulen",
        "sinä": "tulet",
        "hän": "tulee",
        "me": "tulemme",
        "te": "tulette",
        "he": "tulevat"
      },
      "example": "Tulen kotiin kello viisi.",
      "example_english": "I come home at five.",
      "example_tagalog": "Uuwi ako ng alas-singko."
    },
    {
      "id": "pelata",
      "finnish": "pelata",
      "english": "to play (a game/sport)",
      "tagalog": "maglaro",
      "word_type": "verbi",
      "vartalo": "pelaa-",
      "verbityyppi": 4,
      "level": "A2.1",
      "topic": "vapaa-aika",
      "forms": {
        "minä": "pelaan",
        "sinä": "pelaat",
        "hän": "pelaa",
        "me": "pelaamme",
        "te": "pelaatte",
        "he": "pelaavat"
      },
      "example": "Pelaan jalkapalloa viikonloppuna.",
      "example_english": "I play football at the weekend.",
      "example_tagalog": "Naglalaro ako ng football kapag weekend."
    },
    {
      "id": "tarvita",
      "finnish": "tarvita",
      "english": "to need",
      "tagalog": "mangailangan",
      "word_type": "verbi",
      "vartalo": "tarvitse-",
      "verbityyppi": 5,
      "level": "A2.1",
      "topic": "arkielämä",
      "forms": {
        "minä": "tarvitsen",
        "sinä": "tarvitset",
        "hän": "tarvitsee",
        "me": "tarvitsemme",
        "te": "tarvitsette",
        "he": "tarvitsevat"
      },
      "example": "Tarvitsen apua.",
      "example_english": "I need help.",
      "example_tagalog": "Kailangan ko ng tulong."
    },
    {
      "id": "vanheta",
      "finnish": "vanheta",
      "english": "to get old",
      "tagalog": "tumanda",
      "word_type": "verbi",
      "vartalo": "vanhene-",
      "verbityyppi": 6,
      "level": "B1",
      "topic": "elämä",
      "forms": {
        "minä": "vanhenen",
        "sinä": "vanhenet",
        "hän": "vanhenee",
        "me": "vanhenemme",
        "te": "vanhenette",
        "he": "vanhenevat"
      },
      "example": "Ihminen vanhenee.",
      "example_english": "A person gets older.",
      "example_tagalog": "Tumatanda ang tao."
    },
    {
      "id": "ajatella",
      "finnish": "ajatella",
      "english": "to think",
      "tagalog": "mag-isip",
      "word_type": "verbi",
      "vartalo": "ajattele-",
      "verbityyppi": 3,
      "level": "A2.2",
      "topic": "ajatukset",
      "example": "Mitä ajattelet tästä?",
      "example_english": "What do you think about this?",
      "example_tagalog": "Ano ang iniisip mo tungkol dito?",
      "related_words": [
        "ajatus",
        "ajatuksia"
      ]
    },
    {
      "id": "ajatus",
      "finnish": "ajatus",
      "english": "thought; idea",
      "tagalog": "isip; ideya",
      "word_type": "substantiivi",
      "vartalo": "ajatukse-",
      "level": "A2.2",
      "topic": "ajatukset",
      "forms": {
        "genetiivi": "ajatuksen",
        "partitiivi": "ajatusta",
        "partitiivi_monikko": "ajatuksia"
      },
      "example": "Minulla on hyvä ajatus.",
      "example_english": "I have a good idea.",
      "example_tagalog": "May magandang ideya ako.",
      "related_words": [
        "ajatella"
      ]
    },
    {
      "id": "vieda",
      "finnish": "viedä",
      "english": "to take; carry away",
      "tagalog": "dalhin",
      "word_type": "verbi",
      "vartalo": "vie-",
      "verbityyppi": 2,
      "level": "A2.1",
      "topic": "arkielämä",
      "forms": {
        "minä": "vien",
        "sinä": "viet",
        "hän": "vie",
        "me": "viemme",
        "te": "viet­te",
        "he": "vievät"
      },
      "example": "Voitko viedä tämän roskikseen?",
      "example_english": "Can you take this to the bin?",
      "example_tagalog": "Puwede mo bang dalhin ito sa basurahan?",
      "related_words": [
        "tuoda"
      ]
    },
    {
      "id": "tuoda",
      "finnish": "tuoda",
      "english": "to bring",
      "tagalog": "dalhin papunta rito",
      "word_type": "verbi",
      "vartalo": "tuo-",
      "verbityyppi": 2,
      "level": "A2.1",
      "topic": "arkielämä",
      "forms": {
        "minä": "tuon",
        "sinä": "tuot",
        "hän": "tuo",
        "me": "tuomme",
        "te": "tuotte",
        "he": "tuovat"
      },
      "example": "Voitko tuoda vettä?",
      "example_english": "Can you bring water?",
      "example_tagalog": "Puwede ka bang magdala ng tubig dito?",
      "related_words": [
        "viedä"
      ]
    },
    {
      "id": "opettaja",
      "finnish": "opettaja",
      "english": "teacher",
      "tagalog": "guro",
      "word_type": "substantiivi",
      "vartalo": "opettaja-",
      "level": "A2.1",
      "topic": "koulu",
      "forms": {
        "genetiivi": "opettajan",
        "partitiivi": "opettajaa",
        "monikko": "opettajat"
      },
      "example": "Opettaja auttaa opiskelijoita.",
      "example_english": "The teacher helps the students.",
      "example_tagalog": "Tinutulungan ng guro ang mga estudyante."
    },
    {
      "id": "laulaja",
      "finnish": "laulaja",
      "english": "singer",
      "tagalog": "mang-aawit",
      "word_type": "substantiivi",
      "vartalo": "laulaja-",
      "level": "A2.2",
      "topic": "musiikki",
      "forms": {
        "genetiivi": "laulajan",
        "partitiivi": "laulajaa"
      },
      "example": "Hän on hyvä laulaja.",
      "example_english": "He/she is a good singer.",
      "example_tagalog": "Magaling siyang mang-aawit."
    },
    {
      "id": "kirjoittaja",
      "finnish": "kirjoittaja",
      "english": "writer",
      "tagalog": "manunulat",
      "word_type": "substantiivi",
      "vartalo": "kirjoittaja-",
      "level": "A2.2",
      "topic": "työ",
      "forms": {
        "genetiivi": "kirjoittajan",
        "partitiivi": "kirjoittajaa"
      },
      "example": "Kirjoittaja julkaisi uuden kirjan.",
      "example_english": "The writer published a new book.",
      "example_tagalog": "Naglabas ng bagong libro ang manunulat."
    },
    {
      "id": "myyja",
      "finnish": "myyjä",
      "english": "seller; salesperson",
      "tagalog": "tindero/tindera",
      "word_type": "substantiivi",
      "vartalo": "myyjä-",
      "level": "A2.1",
      "topic": "ostokset",
      "forms": {
        "genetiivi": "myyjän",
        "partitiivi": "myyjää"
      },
      "example": "Myyjä auttaa asiakasta.",
      "example_english": "The salesperson helps the customer.",
      "example_tagalog": "Tinutulungan ng tindero/tindera ang customer."
    },
    {
      "id": "kayttaja",
      "finnish": "käyttäjä",
      "english": "user",
      "tagalog": "gumagamit",
      "word_type": "substantiivi",
      "vartalo": "käyttäjä-",
      "level": "A2.2",
      "topic": "tekniikka",
      "forms": {
        "genetiivi": "käyttäjän",
        "partitiivi": "käyttäjää"
      },
      "example": "Käyttäjä voi vaihtaa asetuksia.",
      "example_english": "The user can change the settings.",
      "example_tagalog": "Maaaring baguhin ng gumagamit ang settings."
    },
    {
      "id": "ruoka",
      "finnish": "ruoka",
      "english": "food",
      "tagalog": "pagkain",
      "word_type": "substantiivi",
      "vartalo": "ruoka-",
      "level": "A2.1",
      "topic": "ruoka",
      "forms": {
        "genetiivi": "ruoan",
        "partitiivi": "ruokaa",
        "illatiivi": "ruokaan",
        "inessiivi": "ruoassa"
      },
      "example": "Minä ostan ruokaa.",
      "example_english": "I am buying food.",
      "example_tagalog": "Bumibili ako ng pagkain."
    },
    {
      "id": "juna",
      "finnish": "juna",
      "english": "train",
      "tagalog": "tren",
      "word_type": "substantiivi",
      "vartalo": "juna-",
      "level": "A2.1",
      "topic": "liikenne",
      "forms": {
        "genetiivi": "junan",
        "partitiivi": "junaa",
        "adessiivi": "junalla"
      },
      "example": "Menen junalla Helsinkiin.",
      "example_english": "I go to Helsinki by train.",
      "example_tagalog": "Pupunta ako sa Helsinki sakay ng tren."
    },
    {
      "id": "asunto",
      "finnish": "asunto",
      "english": "apartment; dwelling",
      "tagalog": "apartment; tirahan",
      "word_type": "substantiivi",
      "vartalo": "asunto-",
      "level": "A2.1",
      "topic": "koti",
      "forms": {
        "genetiivi": "asunnon",
        "partitiivi": "asuntoa",
        "inessiivi": "asunnossa"
      },
      "example": "Etsin uutta asuntoa.",
      "example_english": "I am looking for a new apartment.",
      "example_tagalog": "Naghahanap ako ng bagong apartment."
    },
    {
      "id": "terve",
      "finnish": "terve",
      "english": "healthy; hello (informal greeting)",
      "tagalog": "malusog; hello",
      "word_type": "adjektiivi",
      "vartalo": "tervee-",
      "level": "A2.1",
      "topic": "terveys",
      "forms": {
        "genetiivi": "terveen",
        "partitiivi": "tervettä"
      },
      "example": "Olen tänään terve.",
      "example_english": "I am healthy today.",
      "example_tagalog": "Malusog ako ngayon."
    },
    {
      "id": "upea",
      "finnish": "upea",
      "english": "magnificent; amazing",
      "tagalog": "kahanga-hanga",
      "word_type": "adjektiivi",
      "vartalo": "upea-",
      "level": "A2.2",
      "topic": "kuvailu",
      "forms": {
        "genetiivi": "upean",
        "partitiivi": "upeaa"
      },
      "example": "Maisema on upea.",
      "example_english": "The scenery is magnificent.",
      "example_tagalog": "Kahanga-hanga ang tanawin."
    },
    {
      "id": "varmasti",
      "finnish": "varmasti",
      "english": "certainly; surely",
      "tagalog": "sigurado; tiyak",
      "word_type": "adverbi",
      "level": "A2.1",
      "topic": "fraasit",
      "example": "Hän tulee varmasti.",
      "example_english": "He/she will surely come.",
      "example_tagalog": "Siguradong darating siya."
    },
    {
      "id": "lopulta",
      "finnish": "lopulta",
      "english": "finally; eventually",
      "tagalog": "sa wakas; kalaunan",
      "word_type": "adverbi",
      "level": "A2.1",
      "topic": "fraasit",
      "example": "Lopulta löysin avaimet.",
      "example_english": "Finally, I found the keys.",
      "example_tagalog": "Sa wakas, nahanap ko ang mga susi."
    },
    {
      "id": "saman-tien",
      "finnish": "saman tien",
      "english": "immediately; right away",
      "tagalog": "agad; kaagad",
      "word_type": "fraasi",
      "level": "A2.1",
      "topic": "fraasit",
      "example": "Voit aloittaa saman tien.",
      "example_english": "You can start right away.",
      "example_tagalog": "Maaari kang magsimula agad."
    },
    {
      "id": "kutsu",
      "finnish": "kutsu",
      "english": "invitation",
      "tagalog": "imbita",
      "word_type": "substantiivi",
      "vartalo": "kutsu-",
      "level": "A2.1",
      "topic": "juhlat",
      "forms": {
        "genetiivi": "kutsun",
        "partitiivi": "kutsua"
      },
      "example": "Sain kutsun juhliin.",
      "example_english": "I got an invitation to the party.",
      "example_tagalog": "Nakatanggap ako ng imbitasyon sa party."
    },
    {
      "id": "uutinen",
      "finnish": "uutinen",
      "english": "news item; piece of news",
      "tagalog": "balita",
      "word_type": "substantiivi",
      "vartalo": "uutise-",
      "level": "A2.1",
      "topic": "uutiset",
      "forms": {
        "genetiivi": "uutisen",
        "partitiivi": "uutista",
        "monikko": "uutiset"
      },
      "example": "Luin uutisen aamulla.",
      "example_english": "I read the news in the morning.",
      "example_tagalog": "Nagbasa ako ng balita sa umaga."
    }
  ],
  "grammar": [
    {
      "id": "vowel-harmony-ja-ja",
      "title": "Vowel harmony: -ja vai -jä?",
      "level": "A2.1",
      "topic": "vowel harmony",
      "rule": "Back vowels a, o, u usually pair with -ja; front vowels ä, ö, y pair with -jä. If the word has only e/i among its vowels, check other vowel-harmony rules and the word pattern.",
      "examples": [
        "opettaja",
        "laulaja",
        "kirjoittaja",
        "myyjä",
        "käyttäjä",
        "kävelijä"
      ]
    },
    {
      "id": "verb-type-1",
      "title": "Verbityyppi 1",
      "level": "A2.1",
      "topic": "verb types",
      "rule": "Many Type 1 verbs end in a vowel + -a/-ä. The present-tense stem often keeps the final vowel before personal endings, with possible consonant gradation.",
      "examples": [
        "puhua → puhun",
        "asua → asun",
        "ottaa → otan"
      ]
    },
    {
      "id": "verb-type-2",
      "title": "Verbityyppi 2",
      "level": "A2.1",
      "topic": "verb types",
      "rule": "Type 2 verbs commonly end in -da/-dä. Remove -da/-dä to get the basic stem used in present-tense forms.",
      "examples": [
        "syödä → syön",
        "juoda → juon",
        "voida → voin"
      ]
    },
    {
      "id": "verb-type-3",
      "title": "Verbityyppi 3",
      "level": "A2.1",
      "topic": "verb types",
      "rule": "Type 3 verbs commonly end in -la/-lä, -na/-nä, -ra/-rä, or -sta/-stä. The present stem commonly ends in -e-.",
      "examples": [
        "tulla → tulen",
        "mennä → menen",
        "nousta → nousen"
      ]
    },
    {
      "id": "partitive-basics",
      "title": "Partitiivi: perusteet",
      "level": "A2.1",
      "topic": "cases",
      "rule": "The partitive is used in several contexts, including uncounted amounts and many negative-object sentences. The correct form depends on the word type and stem.",
      "examples": [
        "ruoka → ruokaa",
        "kahvi → kahvia",
        "En syö omenaa."
      ]
    }
  ],
  "topics": [
    {
      "id": "arkielama",
      "name_fi": "Arkielämä",
      "name_en": "Everyday life",
      "name_tl": "Pang-araw-araw na buhay"
    },
    {
      "id": "koulu",
      "name_fi": "Koulu",
      "name_en": "School",
      "name_tl": "Paaralan"
    },
    {
      "id": "ruoka",
      "name_fi": "Ruoka",
      "name_en": "Food",
      "name_tl": "Pagkain"
    },
    {
      "id": "liikenne",
      "name_fi": "Liikenne",
      "name_en": "Transportation",
      "name_tl": "Transportasyon"
    },
    {
      "id": "terveys",
      "name_fi": "Terveys",
      "name_en": "Health",
      "name_tl": "Kalusugan"
    },
    {
      "id": "tyo",
      "name_fi": "Työ",
      "name_en": "Work",
      "name_tl": "Trabaho"
    }
  ],
  "schema": {
    "required_word_fields": [
      "id",
      "finnish",
      "english",
      "tagalog",
      "word_type",
      "level",
      "topic",
      "example",
      "example_english",
      "example_tagalog"
    ],
    "optional_fields": [
      "vartalo",
      "verbityyppi",
      "forms",
      "related_words",
      "rections",
      "source_book",
      "source_chapter",
      "notes"
    ],
    "note": "Only include vartalo when relevant and verified. Do not assume every entry has a source-book attribution."
  }
};

export default finnishLearningData;
