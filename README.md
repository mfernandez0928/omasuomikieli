# Oma Suomi — Learn Finnish. Every Day.

A personal, offline-first Finnish learning PWA: a trilingual **Finnish – English – Tagalog**
dictionary, 24 grammar lessons from A1 to B1, situation-based phrases, reading and listening
practice, a mistakes tracker, and a transparent spaced-repetition system.

No account, no backend, no paid API. Everything runs on your device.

---

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload. The service worker is **off** here, so you always see your latest edits. |
| `npm run build` | Type-checks, bundles, and generates the manifest + service worker into `dist/`. |
| `npm run preview` | Serves the real production build, including the service worker. Use this to test offline and installability. |
| `npm run validate:data` | Checks the content files for duplicate ids, duplicate headwords and broken cross-references. |
| `node scripts/make-icons.mjs` | Regenerates the PWA icons from code. |

> **Testing a rebuild in `preview`:** the service worker aggressively caches. After rebuilding,
> do a hard reload (or clear site data) or you will keep seeing the previous build. This is correct
> offline behaviour, not a bug.

---

## Running in VS Code

Open the **project folder itself** (`Oma-Susi-Kieli`), not its parent — the TypeScript `@/` path
alias and the workspace settings only resolve from the project root.

The repo ships a `.vscode/` folder, so:

- **Run it:** `Ctrl+Shift+P` → *Tasks: Run Task* → **dev**. Or just press `` Ctrl+` `` to open the
  terminal and run `npm run dev`. Either way it serves on <http://localhost:5173>.
- **Debug it:** press `F5`. This starts the dev server and opens Chrome attached to the debugger,
  so breakpoints work directly in the `.tsx` files. The second config, *Debug production build*,
  does the same against `npm run preview` so you can debug the service worker and offline mode.
- **Check your content:** *Tasks: Run Task* → **validate:data** after adding words or lessons.

When prompted, accept the recommended extensions and choose **Use Workspace Version** for
TypeScript, so the editor reports the same errors as `npm run build`.

---

## Deploying

The build is a fully static folder with **no server-side routing requirements** — it uses
`HashRouter`, and `base` is `'./'`, so it works from any subdirectory and survives a hard refresh
on a deep link.

```bash
npm run build          # produces dist/
```

Then upload `dist/` anywhere static: Netlify (drag and drop), Vercel, GitHub Pages, Cloudflare
Pages, or even a plain folder on a web host. No rewrite rules needed.

**Installing on a phone:** open the deployed site in Chrome (Android) or Safari (iOS) and choose
*Add to Home Screen*. It must be served over **HTTPS or localhost** — service workers do not run
over plain `http://` on a remote host.

---

## What is actually in here

| Content | Count |
| --- | --- |
| Dictionary words | 230 |
| Grammar lessons | 24 (A1 → B1) |
| Exercises | 103 (92 in grammar lessons, 11 in reading) |
| Phrases | 77 across 14 situations |
| Reading passages | 3, with comprehension questions |

### Where the content came from

This matters, so the app is explicit about it — see **More → Data audit & sources** in the running
app.

- **The supplied `finnish_learning_database_v0.2.1.js`** (25 words, 5 grammar stubs) is kept
  verbatim in `src/data/legacy/` and converted at runtime by `legacy-adapter.ts`. 12 entries were
  imported; 13 were skipped because a hand-written entry already covered the same headword with
  fuller conjugation data.
- **Your own documents** — `Finnish Vocabulary.docx`, `Finnish.docx` and `Finnish Lesson.docx` —
  seeded most of the A2–B1 verb and abstract-noun vocabulary.
- **Everything else** was written for this app.

### Sources: what was readable, and what was not

The books were opened and their text extracted with `pdftotext -layout -enc UTF-8`. Chapter titles
and grammar points come from each book's own *Sisällysluettelo*, cross-checked against the chapter
opener in the body. The full inventory is in `src/data/sources.ts` and on the **Data audit** screen.

| Book | Status | Used for |
| --- | --- | --- |
| Suomen mestari 2 | readable, 342 pp | 8 chapters mapped; **printed page = PDF page, verified** |
| Suomen mestari 3 | readable, 321 pp | 6 chapters mapped; states its own level as A2.2 |
| Oma suomi 1 | readable, 330 pp | 12 chapters mapped by chapter opener (PDF pages) |
| YKI step-by-step guide | readable, 75 pp | confirmed readable; not yet mapped to lessons |
| **Suomen mestari 4** | **no text layer**, 321 pp | nothing — scanned images, needs OCR |
| **No niin! 1** | **no text layer**, 173 pp | nothing — scanned images |
| **Babadada ×3** | **sample only** (6/4/2 pp) | nothing — body pages are images |

**18 of 24 grammar lessons are now textbook-derived** and cite book, chapter, the page (where the
page mapping was verified) and the grammar point *in the book's own wording*. The other 6 are
labelled **additional content**, each with a note saying why it could not be traced to a source.

A page number is only shown as a printed page where that was confirmed; otherwise the app says
"PDF p. N".

### Vocabulary provenance

Every dictionary entry carries one of four statuses, defined in `src/types/index.ts` and explained
on the Data audit screen:

| Status | Count | Meaning |
| --- | --- | --- |
| `source-verified` | 524 | Headword found in a named book, **and** its forms checked |
| `linguistically-checked` | 47 | Not in the lists read so far; forms derived and checked against standard morphology |
| `supplementary` | 10 | Imported from the v0.2.1 database; useful, but not traced or individually checked |
| `needs-review` | 1 | Something specific is uncertain — the entry says what |

**582 dictionary entries.** Sources matched: **Suomen mestari 2** (all 8 chapter word lists,
printed pages), **Suomen mestari 3** (ch. 1–4, 6–8; ch. 5 outstanding) and **Oma suomi 1**
(all 13 chapter SANASTO lists; chapters 1–5 imported with meanings so far).

### Oma suomi 1 SANASTO transcription

All **13 of 13** chapter word lists are transcribed — **1 501 source entries, 1 432 unique
headwords** — and stored separately from the dictionary in
[`src/data/sources/os1-sanasto.ts`](src/data/sources/os1-sanasto.ts). That file holds only what
the book prints (headword, genitive or 1sg, verb type, rection, chapter, printed page). English
and Tagalog meanings are *not* there: those are the app's own and live on the dictionary entries.

- 12 chapters came from the PDF text layer, parsed **by column** — this scan renders the bullet
  inconsistently as `•`, `,`, `I` or nothing, and a bullet-splitting parser lost 40% of entries.
- **Kappale 2 has no text layer at all.** Its page was extracted with `pypdf` and the image strips
  read directly. The printed page number (49) and the chapter tab (2) are visible on the page,
  independently confirming the printed = PDF − 1 offset.
- **9 headwords** are flagged `lowConfidence` where the scan corrupted the spelling
  (`scllttää` for *selittää*, `hålyttäå` for *hälyttää*). They are recorded but never imported.

> **Note on Suomen mestari 3.** With `pdftotext -layout` this PDF interleaves overlapping text
> runs and is unusable. `pdftotext -raw` avoids the interleaving; decoding 9 934 octal escape runs
> back to UTF-8 then made the whole book readable. Its printed pages were confirmed to equal PDF
> pages on 22 sampled pages.

The book's own notation independently confirmed data already in the app: **every verb type it
marks matches** what the dictionary had, and three rections are corroborated —
`osallistua (1) + MIHIN`, `käydä (2) + MISSÄ`, `pyrkiä (1) + MIHIN + maan/mään`.

### The data audit

The supplied database was not taken on trust. `src/data/legacy/legacy-adapter.ts` records every
change it makes, and the app displays them:

- **1 data bug** — `viedä`'s `viette` contained an invisible `U+00AD` soft hyphen, which renders
  identically but breaks search, sorting and answer comparison.
- **11 corrections** — 9 level corrections (core A1 words tagged A2.1, which would have hidden them
  from an A1 review queue) and 2 misleading `vartalo` values removed (`ruoka-` → the real stem is
  `ruoa-`; `asunto-` → `asunno-`).
- **10 notes** — stems that carried no information, a verb with no conjugation table, free-text
  topics with no mapping, and a `related_words` entry (`ajatuksia`) that is an inflected form rather
  than an entry id.

Stems in your own notes were corrected the same way, and each correction says what changed:
`tarvita` (`tarvit-` → `tarvitse-`), `valita` (`valit-` → `valitse-`), `mainita`, `ajatella`
(`ajattel-` → `ajattele-`), `kuvailla`, `harjoitella`, `esiintyä`.

Entries that could not be verified are flagged `needs-review` in the UI rather than presented as
fact — for example `selvitä`, which looks like a type 5 verb but does **not** take `-itsen`.

---

## Project structure

```
src/
  components/      Icon set, nav, shared UI, the exercise engine
  pages/           One file per screen
  data/
    words/         Dictionary, split by group — add new words here
    grammar/       Lessons by level — add new lessons here
    phrases/       Phrases by situation
    legacy/        The supplied v0.2.1 database, verbatim + its adapter
    reading.ts     Reading passages
    topics.ts      Topics and situations
  services/
    storage/       IndexedDB wrapper, preferences, progress
    srs/           Spaced-repetition scheduler
    search/        Search index and answer checking
    speech.ts      Finnish text-to-speech
  hooks/useApp.tsx App state
  types/           The content schema — read this first
```

---

## Adding new words

Open any file in `src/data/words/` (or create one and add it to `index.ts`). Only
`id`, `fi`, `en`, `tl`, `type`, `level`, `topics`, `source` and `verification` are required.

```ts
{
  id: 'v-lahettaa',          // must be unique
  fi: 'lähettää',
  en: 'to send',
  tl: 'magpadala',
  type: 'verbi',
  level: 'A2.1',
  topics: ['tyo', 'palvelut'],

  vartalo: 'lähettä-',       // only when it is genuinely useful AND correct
  verbType: 1,
  verbForms: {
    present1sg: 'lähetän',   // weak grade
    present3sg: 'lähettää',  // strong grade — both shown so gradation is visible
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

  source: null,               // or { book: '...', chapter: '...' } if you verified it
  verification: 'verified',   // 'needs-review' if you are not sure
}
```

Then run `npm run validate:data`. It fails loudly on duplicate ids, duplicate headwords and
references to things that do not exist — which is exactly how the missing cross-referenced words
in this build were caught.

**Do not invent a `vartalo`.** Leave it out if you are unsure; a missing stem is better than a
wrong one. Irregular forms worth finding in search (but not worth presenting as a paradigm) go in
`searchAliases`, e.g. `työ → ['töissä', 'töihin', 'töistä']`.

## Adding a grammar lesson

Add to `src/data/grammar/a1-core.ts`, `a1-cases.ts`, `a2.ts` or `b1.ts`. The lesson template is
enforced by the `GrammarLesson` type: intro (EN + TL), the rule, an `easyRule` box, examples,
`exceptions`, `mistakes`, a memory `tip`, and `exercises`. Set a unique `order` to place it in the
curriculum, and a `moduleId` of `m-basic`, `m-more` or `m-b1`.

Exercises support `multiple-choice`, `fill-blank`, `choose-form`, `match`, `translate`,
`conjugate`, `choose-case` and `correct-sentence`. Every one needs an `explanation` and
`explanationTl` — the engine never shows a bare "Correct"/"Incorrect".

## Adding real source citations

When you have a book in front of you:

```ts
source: { book: 'Suomen mestari 2', chapter: 'Kappale 4', note: 'verb type table' },
verification: 'verified',
```

The citation then appears at the bottom of that word or lesson, and the Data audit page counts it.

---

## Verified features

Each of these was exercised in a real browser against the production build:

- **Home** — daily goal, 7-day activity strip, streak, six working cards, Continue Learning,
  10 topics. Every card and tile navigates.
- **Grammar** — 24 lessons, level filter, lesson template with Easy Rule box, exceptions, mistakes,
  memory tip, related-word and related-lesson links.
- **Exercises** — answer is hidden until you commit; feedback gives a real explanation in English
  and Tagalog; wrong answers are written to IndexedDB and appear in My Mistakes linked to the
  lesson that covers them. *(Verified: answered `opettajä` wrongly → mistake persisted with
  `grammarId: g-vokaaliharmonia` and survived navigation.)*
- **Search** — Finnish, English, Tagalog, stored forms, and **derived local cases**. Verified:
  `kaupassa → kauppa`, `pidän → pitää`, `tarvitsen → tarvita`, `ruoan → ruoka`, `töissä → työ`,
  `kotona → koti`, `tulong → apu`, `manunulat → kirjoittaja`, and diacritic-folded `toissa → työ`.
- **Vocabulary** — 230 entries, filters for level/type/topic/verb type/source, detail page with
  stem, full paradigm, rections, examples, favourites, known/difficult, My Words, Practice.
- **Spaced repetition** — queue building, four grades with honest interval previews
  (Again 10 min · Hard 1 d · Good 1 d · Easy 4 d on a new card), persisted to IndexedDB.
  *(Verified: grading `olla` "Good" stored `intervalDays: 1`, due in exactly 1 day, `reps: 1`.)*
- **PWA / offline** — manifest + service worker generated; 9 files precached.
  *(Verified by stopping the server entirely and reloading: the full 230-word dictionary and word
  detail pages still rendered.)*
- **Data audit** — reports the real counts and every change made to the supplied data.
- **Responsive** — mobile 375px, and desktop 1280px with a centred floating nav and no horizontal
  overflow.
- **Finnish characters** — ä/ö render correctly throughout; search folds diacritics so `aiti`
  finds `äiti`, but typed answers do **not** fold, because writing `a` for `ä` is a real mistake.
- **Build** — `tsc` clean, `npm run build` clean, `npm run validate:data` clean.

## Limitations and what is not done

Stated plainly rather than hidden:

1. **Only Suomen mestari 2 has been matched word-by-word.** 30 of 230 entries are source-verified.
   Suomen mestari 3 and Oma suomi 1 are readable and mapped at chapter level, but their word lists
   have not been extracted yet. Suomen mestari 4, No niin! 1 and the Babadada files could not be
   read at all (no text layer), so nothing cites them.
2. **Listening practice has no recorded audio.** It uses the device's built-in Finnish
   text-to-speech. On a device with no `fi-FI` voice the screen explains this and tells you how to
   fix it, instead of reading Finnish in an English accent. A real Finnish voice was present on the
   test machine and the speaker buttons worked.
3. **13 entries are flagged `needs-review`** — the imported ones that were not cross-checked. They
   carry a visible badge.
4. **`selvitä` deliberately has no verb type.** It ends in `-itä` but does not follow the type 5
   `-itsen` pattern, and I would not assert a classification I could not verify.
5. **Reading practice has 3 passages.** The structure takes more; only three are written.
6. **The JS bundle is ~660 kB (195 kB gzipped).** All learning content is bundled so the app works
   offline from first load. If the dictionary grows a lot, split the data with dynamic `import()`.
7. **Progress is per-browser.** No sync, by design. Use Settings → *Download a backup* before
   clearing site data or switching devices; there is no import button yet.
8. **Grammar cards are not in the SRS queue yet.** The scheduler supports `kind: 'grammar'`, but
   only vocabulary is currently fed into it.
9. **No automated test suite.** Verification was done by driving the real app in a browser, as
   listed above.

---

## Privacy

Everything stays on the device: IndexedDB for review cards, mistakes, saved words and activity;
`localStorage` for settings, favourites and streak. No network requests after the app loads, no
analytics, no account. Clearing site data erases your progress — take a backup first.
