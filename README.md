# Oma Suomi — Learn Finnish. Every Day.

An offline-first Finnish learning PWA: a trilingual **Finnish – English – Tagalog** dictionary,
24 grammar lessons from A1 to B1, scripted role-play situations, situation-based phrases, reading
and listening practice, a mistakes tracker and a spaced-repetition scheduler.

No account, no backend, no paid API. Everything runs on the device.

`MarkDev@2026` · © 2026 MarkDev. All rights reserved.

---

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload. The service worker is **off** here, so edits show immediately. |
| `npm run build` | Type-checks, bundles, and generates the manifest and service worker into `dist/`. |
| `npm run preview` | Serves the production build including the service worker. Use this to test offline and installability. |
| `npm run typecheck` | `tsc` only, no bundle. |
| `npm run validate` | Runs both content validators below. |
| `npm run validate:data` | Duplicate ids, duplicate headwords, broken cross-references. |
| `npm run validate:situations` | Every word in every role-play line resolves to a dictionary entry or a documented exception. |
| `node scripts/make-icons.mjs` | Regenerates the PWA icons from code. |

> **Testing a rebuild under `preview`:** the service worker caches aggressively. After rebuilding,
> hard-reload or clear site data, otherwise the previous build keeps being served. That is correct
> offline behaviour, not a bug.

---

## Running in VS Code

Open the **project folder itself** (`Oma-Susi-Kieli`), not its parent — the TypeScript `@/` path
alias and the workspace settings only resolve from the project root.

The repo ships a `.vscode/` folder:

- **Run:** `Ctrl+Shift+P` → *Tasks: Run Task* → **dev**, or `` Ctrl+` `` and `npm run dev`.
  Serves on <http://localhost:5173>.
- **Debug:** `F5` starts the dev server and attaches Chrome, so breakpoints work in the `.tsx`
  files. The second configuration, *Debug production build*, does the same against
  `npm run preview`, for the service worker and offline mode.
- **Check content:** *Tasks: Run Task* → **validate:data** after adding words or lessons.

When prompted, accept the recommended extensions and choose **Use Workspace Version** for
TypeScript, so the editor reports the same errors as `npm run build`.

---

## Deploying

The build is a static folder with no server-side routing requirements: it uses `HashRouter` and
`base: './'`, so it works from any subdirectory and survives a hard refresh on a deep link.

```bash
npm run build          # produces dist/
```

Upload `dist/` to any static host — Netlify, Vercel, GitHub Pages, Cloudflare Pages, or a plain
folder on a web server. No rewrite rules needed.

**Installing on a phone:** open the deployed site in Chrome (Android) or Safari (iOS) and choose
*Add to Home Screen*. It must be served over **HTTPS or localhost**; service workers do not run
over plain `http://` on a remote host.

---

## Contents

| Content | Count |
| --- | --- |
| Dictionary entries | 822 |
| Grammar lessons | 24 (A1 → B1), 19 textbook-derived |
| Exercises | 203 (192 in grammar lessons, 8 per lesson, 11 in reading) |
| Phrases | 112 across 15 situations |
| Role-play situations | 5 scenes, 18 turns, 54 written replies |
| Reading passages | 3, with comprehension questions |

### Where the content came from

The running app carries the same breakdown under **More → Data audit & sources**.

- **The supplied `finnish_learning_database_v0.2.1.js`** (25 words, 5 grammar stubs) is kept
  verbatim in `src/data/legacy/` and converted at runtime by `legacy-adapter.ts`. 12 entries were
  imported; 13 were skipped because a hand-written entry already covered the same headword with
  fuller conjugation data.
- **The author's own notes** — `Finnish Vocabulary.docx`, `Finnish.docx`, `Finnish Lesson.docx` —
  seeded most of the A2–B1 verb and abstract-noun vocabulary.
- **The textbooks below** supplied the sourced vocabulary and most of the grammar curriculum.
- Everything else was written for this app and is labelled as such.

### Sources: what was readable

Text was extracted with `pdftotext -layout -enc UTF-8`. Chapter titles and grammar points come
from each book's own *Sisällysluettelo*, cross-checked against the chapter opener in the body.
The full inventory is in `src/data/sources.ts` and on the Data audit screen.

| Book | Status | Used for |
| --- | --- | --- |
| Suomen mestari 2 | readable, 342 pp | 8 chapters mapped; printed page = PDF page, verified. Puhekieli tables, pp. 293–296 |
| Suomen mestari 3 | readable, 321 pp | 6 chapters mapped; states its own level as A2.2 |
| Oma suomi 1 | readable, 330 pp | 13 chapters; all SANASTO word lists transcribed |
| YKI step-by-step guide | readable, 75 pp | readable, not yet mapped to lessons |
| **Suomen mestari 4** | **no text layer**, 321 pp | nothing — scanned images, needs OCR |
| **No niin! 1** | **no text layer**, 173 pp | nothing — scanned images |
| **Babadada ×3** | **sample only** (6/4/2 pp) | nothing — body pages are images |

19 of the 24 grammar lessons cite book, chapter, page (where the page mapping was verified) and
the grammar point in the book's own wording. The other 5 are labelled **additional content**, each
with a note recording why it could not be traced. A page number is shown as a printed page only
where that was confirmed; otherwise the app shows "PDF p. N".

### Vocabulary provenance

Every entry carries one of four statuses, defined in `src/types/index.ts`:

| Status | Count | Meaning |
| --- | --- | --- |
| `source-verified` | 726 | Headword located in a named book, **and** its forms checked |
| `linguistically-checked` | 85 | Not in the lists read so far; forms derived and checked against standard morphology |
| `supplementary` | 10 | Imported from the v0.2.1 database; useful, but not traced or individually checked |
| `needs-review` | 1 | Something specific is uncertain; the entry records what |

Sources matched: **Suomen mestari 2** (all 8 chapter word lists, printed pages), **Suomen
mestari 3** (ch. 1–4, 6–8; ch. 5 outstanding) and **Oma suomi 1** (all 13 chapter SANASTO lists
transcribed). 662 Oma suomi 1 headwords are imported with meanings, concentrated in chapters
1–6 and 8; chapters 7 and 9–13 are so far only sampled.

Every verb carries a full six-person present-tense paradigm. Where a book prints only the 1sg, the
stem, verb type and 3sg were filled in by hand, so no paradigm is left partial. See
`src/services/conjugation.ts` for which persons are stored and which are derived.

### Oma suomi 1 SANASTO transcription

All 13 chapter word lists are transcribed — **1 501 source entries, 1 432 unique headwords** —
and kept separately from the dictionary. `src/data/sources/os1-sanasto.ts` holds per-chapter
metadata only; the transcription itself is gitignored, because committing every word list of a
copyrighted textbook to a public repository would reproduce a substantial part of it. Dictionary
entries derived from it cite chapter and page.

- 12 chapters came from the PDF text layer, parsed **by column**. The scan renders the bullet
  inconsistently as `•`, `,`, `I` or nothing, and a bullet-splitting parser lost 40% of entries.
- **Kappale 2 has no text layer.** Its page was extracted with `pypdf` and the image strips read
  directly. The printed page number (49) and the chapter tab (2) are visible on the page, which
  independently confirms the printed = PDF − 1 offset.
- **9 headwords** are flagged `lowConfidence` where the scan corrupted the spelling
  (`scllttää` for *selittää*, `hålyttäå` for *hälyttää*). They are recorded but never imported.

> **Suomen mestari 3.** Under `pdftotext -layout` this PDF interleaves overlapping text runs and is
> unusable. `pdftotext -raw` avoids the interleaving; decoding 9 934 octal escape runs back to
> UTF-8 then made the book readable. Printed pages were confirmed equal to PDF pages on 22 sampled
> pages.

The book's own notation independently confirmed data already in the app: every verb type it marks
matches what the dictionary had, and three rections are corroborated —
`osallistua (1) + MIHIN`, `käydä (2) + MISSÄ`, `pyrkiä (1) + MIHIN + maan/mään`.

### Changes made to the supplied database

`src/data/legacy/legacy-adapter.ts` records every change it makes, and the app lists them:

- **1 data bug** — `viedä`'s `viette` contained an invisible `U+00AD` soft hyphen, which renders
  identically but breaks search, sorting and answer comparison.
- **11 corrections** — 9 level corrections (core A1 words tagged A2.1, which would have hidden them
  from an A1 review queue) and 2 misleading `vartalo` values removed (`ruoka-` → the real stem is
  `ruoa-`; `asunto-` → `asunno-`).
- **10 notes** — stems carrying no information, a verb with no conjugation table, free-text topics
  with no mapping, and a `related_words` entry (`ajatuksia`) that is an inflected form rather than
  an id.

Stems in the author's own notes were corrected the same way, each with a note recording the change:
`tarvita` (`tarvit-` → `tarvitse-`), `valita` (`valit-` → `valitse-`), `mainita`, `ajatella`
(`ajattel-` → `ajattele-`), `kuvailla`, `harjoitella`, `esiintyä`.

---

## Situations

Five scripted role-plays: the other speaker's lines are fixed and the learner picks a reply from a
short list, with a goal checklist that ticks off as each task is completed.

The dialogue is written for this app, not quoted from a book, and there is no conversational model
behind it — a scene follows the same path every time. The vocabulary is constrained instead:

- every word form resolves through `src/data/situations/lexicon.ts` to a dictionary entry carrying
  its own citation;
- colloquial forms (`mä`, `oon`, `meen`, `onks`, `tos`, `sit`) come from the Puhekieli section of
  Suomen mestari 2, printed pages 293–296, transcribed into `src/data/puhekieli.ts`;
- `npm run validate:situations` fails on a word that is neither traced nor documented.

Current state: 198 distinct word forms, 180 traced to 101 dictionary entries (100 of which carry a
book citation), 18 documented exceptions — proper names, greeting and reply words, numerals, and
one non-Finnish form that appears only inside a distractor option.

Tapping a word in a dialogue shows its gloss, the case or colloquial rule behind it, and a link
into the dictionary. Wrong replies are written to My Mistakes with the correct version.

---

## Project structure

```
src/
  components/      Icon set, nav, shared UI, the exercise engine
  pages/           One file per screen
  data/
    words/         Dictionary, split by group — add new words here
    grammar/       Lessons by level — add new lessons here
      extra-exercises.ts  Further practice, merged onto each lesson by id
    phrases/       Phrases by situation
    situations/    Role-play scenes and their vocabulary lexicon
    legacy/        The supplied v0.2.1 database, verbatim, and its adapter
    puhekieli.ts   Spoken forms transcribed from Suomen mestari 2
    reading.ts     Reading passages
    sources.ts     Source-book inventory
    brand.ts       Branding strings
  services/
    storage/       IndexedDB wrapper, preferences, progress
    srs/           Spaced-repetition scheduler
    search/        Search index and answer checking
    conjugation.ts Builds the six-person paradigm from the stored forms
    speech.ts      Finnish text-to-speech
  hooks/useApp.tsx App state
  types/           The content schema — read this first
```

---

## Adding new words

Open any file in `src/data/words/`, or create one and add it to `index.ts`. Only `id`, `fi`, `en`,
`tl`, `type`, `level`, `topics`, `source` and `verification` are required.

```ts
{
  id: 'v-lahettaa',          // must be unique
  fi: 'lähettää',
  en: 'to send',
  tl: 'magpadala',
  type: 'verbi',
  level: 'A2.1',
  topics: ['tyo', 'palvelut'],

  vartalo: 'lähettä-',       // only when known to be correct
  verbType: 1,
  verbForms: {
    present1sg: 'lähetän',   // weak grade
    present3sg: 'lähettää',  // strong grade; both stored so gradation is visible
    imperfect1sg: 'lähetin',
    pastParticiple: 'lähettänyt',
  },
  rections: [{
    pattern: '+ -lle (the receiver)',
    example: 'Lähetän sinulle viestin.',
    english: 'I will send you a message.',
    tagalog: 'Papadalhan kita ng mensahe.',
  }],
  examples: [{ fi: '...', en: '...', tl: '...' }],
  note: 'KPT tt -> t: lähetän.',
  related: ['v-kertoa'],      // must be real ids
  grammarRefs: ['g-kpt'],     // must be real lesson ids

  source: { bookId: 'os1', book: 'Oma suomi 1', chapter: 'Kappale 4: Ruokakaupassa', page: 97,
            section: 'SANASTO', sourceTerm: 'lähettää (1), lähetän' },
  verification: 'source-verified',
}
```

Set `source: null` and `verification: 'linguistically-checked'` when the word is not in one of the
books. Then run `npm run validate`. It fails on duplicate ids, duplicate headwords and references
to things that do not exist.

**Do not invent a `vartalo`.** Leave it out when unsure; a missing stem is better than a wrong one.
Irregular forms worth finding in search, but not worth presenting as a paradigm, go in
`searchAliases` — for example `työ → ['töissä', 'töihin', 'töistä']`.

## Adding a grammar lesson

Add to `src/data/grammar/a1-core.ts`, `a1-cases.ts`, `a2.ts` or `b1.ts`. The `GrammarLesson` type
enforces the template: intro (EN and TL), the rule, an `easyRule` box, examples, `exceptions`,
`mistakes`, a memory `tip` and `exercises`. Set a unique `order` to place it in the curriculum, and
a `moduleId` of `m-basic`, `m-more` or `m-b1`.

Exercises support `multiple-choice`, `fill-blank`, `choose-form`, `match`, `translate`,
`conjugate`, `choose-case` and `correct-sentence`. Every one needs an `explanation` and
`explanationTl`; the engine never shows a bare "Correct" or "Incorrect".

Each lesson carries eight questions. The lesson file holds the teaching text and the first few;
the rest live in `extra-exercises.ts`, keyed by lesson id and merged in `index.ts`, so the lesson
text stays readable. `validate:data` rejects a repeated option, an answer that is not among its
options, a duplicate exercise id and a `wordId` that does not resolve.

## Adding a role-play scene

Add a `RolePlay` to `src/data/situations/scenes.ts`, then run `npm run validate:situations`. It
will list any word form in the new lines that has no entry in `lexicon.ts`. Add one for each,
pointing at the dictionary entry it inflects from, or at a `basis` note where the form genuinely is
not a headword.

---

## Testing

There is no automated test suite. Verification is manual: `npm run typecheck`, `npm run build` and
`npm run validate` must all be clean, and screens are exercised in a browser against the production
build — including offline, by stopping the dev server and reloading.

The two validators are the closest thing to regression tests and do run in CI-friendly form:
`validate:data` catches broken cross-references, and `validate:situations` catches unsourced
vocabulary in the role-plays.

## Known limitations

1. **Suomen mestari 4, No niin! 1 and the Babadada files have no text layer**, so nothing cites
   them. They would need OCR first.
2. **Suomen mestari 2 and 3 have not been mined for new vocabulary**, only matched against existing
   entries. Suomen mestari 3 chapter 5 word lists are still outstanding.
3. **775 of the 1 432 transcribed Oma suomi 1 headwords are not yet imported.** They need
   English and Tagalog meanings and a topic before they can become dictionary entries; chapters 7
   and 9–13 are the bulk of the backlog.
4. **Listening practice has no recorded audio.** It uses the device's Finnish text-to-speech; with
   no `fi-FI` voice installed the screen explains this instead of using an English voice.
5. **`selvitä` has no verb type.** It ends in `-itä` but does not take the type 5 `-itsen` pattern,
   and the classification was left unasserted rather than guessed.
6. **The JS bundle is ~1.0 MB (~250 kB gzipped).** All content is bundled so the app works offline
   from first load. If the dictionary grows much further, split the data with dynamic `import()`.
7. **Progress is per-browser.** No sync. Use Settings → *Download a backup* before clearing site
   data or switching devices; there is no import button yet.
8. **Grammar cards are not in the SRS queue.** The scheduler supports `kind: 'grammar'`, but only
   vocabulary is fed into it.
9. **Reading practice has 3 passages.** The structure supports more.

---

## Privacy

Everything stays on the device: IndexedDB for review cards, mistakes, saved words and activity;
`localStorage` for settings, favourites and streak. No network requests after load, no analytics,
no account. Clearing site data erases progress — take a backup first.

---

© 2026 MarkDev. All rights reserved.
