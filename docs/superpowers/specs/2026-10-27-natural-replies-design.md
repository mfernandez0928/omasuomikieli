# Natural Finnish Replies — Luontevia vastauksia

Design, 2026-10-27. Target: `main` (the beta).

## Goal

A new learning section of 80 conversation pairs (a Finnish question and a
natural Finnish reply), A2.1–B1, for learners living in Finland. Each pair
is learned as a pair, by active recall: Finnish first, translations only on
request.

Alongside it, the app stops showing translations before the learner has
had a chance to recall them, wherever that still happens in practice.

## What the user asked for

- All 80 pairs from the supplied dataset, none removed or shortened, keeping
  the numbering 1–80.
- Organised by the dataset's 10 categories.
- Each pair shows the Finnish question, the Finnish reply, English and
  Tagalog, the category, and a usage note where helpful.
- Standard and colloquial Finnish clearly distinguished.
- Searchable; usable for flashcards, listening and question-and-answer
  practice.
- Translations hidden until the learner presses **Show translation**: in the
  replies section, in its flashcards, and in other exercises and practice.
- Audio for the question and the reply where text-to-speech is available.
- Four review modes:
  1. Finnish question → choose the correct Finnish reply.
  2. Finnish question → reveal English and Tagalog.
  3. English or Tagalog meaning → recall the Finnish reply.
  4. Listen to the Finnish sentence → choose the matching meaning.
- The dataset's usage notes on Ole hyvä, Eipä kestä / Ei kestä, Ei se
  mitään, Mielelläni and Totta kai.

## Assumptions (confirmed in chat)

- Built on `main` and shipped to the beta.
- A "What's new" entry, release 1.8.0, since learners will notice it.
- Dictionary surfaces (vocabulary list, word detail, global search) keep
  showing meanings openly: they are for looking things up, not practice.
- The Situations "Your turn" task keeps its Tagalog line; it tells the
  learner what to do, and is not the answer.

## Content changes to the dataset

Only one: pair 18's reply is written "Tottakai!" in the dataset, and the
dataset's own note 2 says the standard written form is "totta kai". The
reply is stored as **"Totta kai! Milloin se sopisi sinulle?"** and
"Tottakai" is recorded in the pair's note as a common spelling. Every other
sentence is kept exactly as supplied.

Spoken-leaning replies (e.g. 17 "Mennään vain!", 8 "Ei valittamista") get a
short note on register rather than a rewrite.

## Data

`src/data/replies/index.ts`:

```ts
export interface ReplyCategory {
  id: ReplyCategoryId;   // e.g. 'tervehdykset'
  num: number;           // 1-10, the dataset's order
  title: string;         // English title from the dataset
  titleFi: string;       // Finnish title from the dataset
}

export interface ReplyPair {
  id: string;            // 'rp-01' ... 'rp-80'
  num: number;           // 1-80, the dataset's numbering
  category: ReplyCategoryId;
  level: Level;          // A2.1, A2.2 or B1, judged per pair
  fi: { q: string; a: string };
  en: { q: string; a: string };
  tl: { q: string; a: string };
  note?: string;         // usage / register note, English
  noteTl?: string;
  puhekieli?: string;    // colloquial version of the reply, if worth showing
  source: null;
  verification: 'linguistically-checked';
}
```

The dataset gives each translation as "question — answer"; it is split on
the em dash into `q` and `a`. A test asserts: exactly 80 pairs, `num` runs
1–80 without gaps, ids unique, every field non-empty, every category has 8
pairs.

The usage-note comparison (Ole hyvä etc.) is a small exported constant shown
at the top of the section.

## Screens

- **`/replies`** — title "Luontevia vastauksia" / "Natural Finnish Replies",
  the usage-note panel, a search box, the 10 categories as row cards with a
  count, and a "Practise" button.
- **`/replies/:category`** — the pairs of one category as cards. A card
  shows the number, the Finnish question and the Finnish reply, each with a
  speak button, and a **Show translation** button. Pressing it reveals
  English and (if the Tagalog setting is on) Tagalog for both lines, plus
  the note and colloquial form. It toggles back to hidden.
- **`/replies/practice`** — choose a mode, optionally narrow to one
  category, then run 10 pairs.

Entry points: a card at the top of the Phrases page, and a row in More.

## Review modes

- **Mode 1, choose the reply** — `ExerciseRunner`, `multiple-choice`. The
  question is the Finnish question; options are its reply plus three replies
  from other pairs (same category first, so they are plausible).
- **Mode 4, listen and choose the meaning** — `ExerciseRunner`,
  `multiple-choice`, with a new optional `Exercise.audio` field: when set,
  the runner shows a large play button instead of the question text, so the
  sentence is heard, not read. Options are English meanings. Hidden when
  `canSpeak()` is false.
- **Mode 2, reveal the meaning** and **Mode 3, recall the reply** — a new
  small `ReplyFlashcards` component, since `ExerciseRunner` has no
  reveal-and-self-grade kind. Mode 2 shows the Finnish question and reply;
  Show translation reveals EN/TL. Mode 3 shows the English (and Tagalog)
  pair; Show answer reveals the Finnish reply. The learner marks "Knew it" or
  "Not yet"; "Not yet" pairs repeat at the end of the run.

Mistakes from modes 1 and 4 go to the existing Mistakes list through the
runner, as other practice does.

## Hiding translations elsewhere

A shared `RevealTranslation` component (button **Show translation** / **Hide
translation**, children rendered only when open) is used in:

- the new reply cards and flashcards;
- **Phrases** cards — English and Tagalog now start hidden;
- **Situations** answer options — the English line under each Finnish option
  is hidden until the learner has picked; afterwards all options show it.

Already correct, left alone: Daily review (Show answer), ExerciseRunner
(translation only after answering), Listening (after answering), Reading
(Show the English), Situations chat bubbles (Translate).

## Search

Reply pairs join `searchEverything` as a new hit kind `reply` (matching
Finnish, English and Tagalog of both lines), opening the pair's category
page. The search box on `/replies` searches only the pairs.

## Release

`APP_VERSION` and `package.json` go to 1.8.0 with a What's new entry that
covers this section, the hidden translations, and the 47 words added on
2026-10-26.

## Testing

- Data test (above).
- `npm run build`, `tsc`, the existing vitest suite.
- In the browser preview: each category page, reveal and hide, each
  practice mode end to end, search, Phrases and Situations with translations
  hidden, and a phone-width check.

## Out of scope

Spaced-repetition scheduling for reply pairs, recorded (non-TTS) audio, and
anything on the `subscription` branch.
