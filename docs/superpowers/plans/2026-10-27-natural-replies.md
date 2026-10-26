# Natural Finnish Replies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the 80-pair "Luontevia vastauksia" section with four practice modes, and stop showing translations before recall in Phrases and Situations.

**Architecture:** Static data in `src/data/replies/`, pure exercise builders in `src/services/replies/`, pages in `src/pages/Replies.tsx`. Multiple-choice modes reuse `ExerciseRunner` (with a new `audio` field for listening); reveal modes use a new `ReplyFlashcards` component. One shared `RevealTranslation` component hides translations everywhere.

**Tech Stack:** React 19, react-router-dom 7 (HashRouter), TypeScript, Vite, Vitest (node environment, logic tests only).

**Spec:** `docs/superpowers/specs/2026-10-27-natural-replies-design.md`

## Global Constraints

- Branch: `main`. Commit per task; push only at the end of Task 7.
- All 80 pairs, numbering 1–80, text exactly as supplied in the user's dataset (pasted 2026-10-27), except pair 18's reply: `Totta kai! Milloin se sopisi sinulle?`.
- Translations (EN and TL) are never rendered before the learner presses **Show translation** in reply cards, flashcards, Phrases cards, or before a correct pick in Situations options.
- Tagalog lines render only when `settings.showTagalog` is true, as everywhere else.
- Speak buttons only via the existing `SpeakButton` / `speak()`; the listening mode is hidden when `canSpeak()` is false.
- Button copy: `Show translation` / `Hide translation`; flashcard grades `Knew it` / `Not yet`.
- Release: `APP_VERSION` and `package.json` `version` both `1.8.0`.

## Review Focus

1. A category with fewer than 4 pairs in a filter (never true for full data, but a one-category practice run) — distractors must come from other categories so there are always 4 distinct options. Test in Task 2.
2. Two pairs with identical reply text (26 and 79 both contain "Autan mielelläni.", but the full replies differ) — options must be distinct strings. Test in Task 2.
3. Searching with or without umlauts ("kiitos", "mielellani") — reply search must use the same `fold()` as other search. Test in Task 5.
4. Opening `/replies/unknown` or `/replies/practice` with no speech voice — not-found state and no listening mode, never a blank page. Checked in Task 7 browser pass.
5. Phrases search results and situation pages — `PhraseCard` hidden translations apply to both, since both render `PhraseCard`. Checked in Task 7.

---

### Task 1: Reply data and its integrity test

**Files:**
- Create: `src/data/replies/index.ts`
- Create: `src/data/replies/replies.test.ts`
- Modify: `src/types/index.ts` (add types next to `Phrase`)

**Interfaces:**
- Produces (types, in `src/types/index.ts`):
  - `type ReplyCategoryId = 'tervehdykset' | 'tunteet' | 'kutsut' | 'kohteliaisuus' | 'mielipiteet' | 'tyo-opiskelu' | 'ostokset' | 'ongelmat' | 'puhelut' | 'reaktiot'` (dataset categories 1–10 in that order)
  - `interface ReplyCategory { id: ReplyCategoryId; num: number; title: string; titleFi: string; icon: IconName-compatible string }`
  - `interface ReplyPair` exactly as in the spec's Data section.
- Produces (data, in `src/data/replies/index.ts`):
  - `REPLY_CATEGORIES: ReplyCategory[]`, `REPLY_PAIRS: ReplyPair[]`
  - `repliesInCategory(id: ReplyCategoryId): ReplyPair[]`
  - `REPLY_CATEGORY_BY_ID: Map<ReplyCategoryId, ReplyCategory>`
  - `REPLY_USAGE_NOTES: { fi: string; en: string; tl: string }[]` — the five expressions from the dataset's note 2.

- [ ] **Step 1: Write the failing test** `replies.test.ts`:
  - `has exactly 80 pairs numbered 1 to 80` — `REPLY_PAIRS.map(p => p.num)` equals `[1..80]`.
  - `ids are rp-01 to rp-80 and unique` — `p.id === 'rp-' + String(p.num).padStart(2, '0')`.
  - `every field is filled` — `fi.q, fi.a, en.q, en.a, tl.q, tl.a` all non-empty after trim; none contains ` — `.
  - `each category has 8 pairs, in dataset order` — pairs 1–8 are `tervehdykset`, 9–16 `tunteet`, …, 73–80 `reaktiot`.
  - `pair 18 uses the standard spelling` — `fi.a` starts with `Totta kai!`; no pair's `fi.a` contains `Tottakai`.
  - `pins dataset text` — `rp-01.fi.a === 'Ihan hyvää, kiitos! Entä sinulle?'`, `rp-80.tl.a === 'Salamat, ikaw rin! Kita tayo ulit.'`, `rp-40.en.q === 'Do you like this movie?'`.
- [ ] **Step 2: Run** `npx vitest run src/data/replies` — Expected: FAIL (module not found).
- [ ] **Step 3: Add the types and write the data file.** Split each dataset translation on ` — ` into `q` / `a`. Category icons: `chat, heart, calendar, hand, idea, briefcase, cart, alert, phone, people`. `level`: A2.1 for short fixed formulas, A2.2 for perfect tense / conditional / passive-imperative (`Lähdetäänkö`, `Sovitaan`), B1 for 38, 64, 75 and other pairs needing abstract vocabulary — record nothing else. Notes, short, only where they help: 8 and 17 register (spoken but fine in speech), 18 `Tottakai` spelling, 26/76 Eipä kestä vs Ei kestä, 27/31/79 Ei se mitään, 22/50/55 Mielelläni, 1 `kuulua` takes partitive (`hyvää`). File header comment in the style of `src/data/phrases/index.ts`, stating source and the one change.
- [ ] **Step 4: Run** `npx vitest run src/data/replies` — Expected: 6 passed.
- [ ] **Step 5: Commit** `git add src/data/replies src/types/index.ts && git commit -m "Add the 80 natural-reply pairs"`

### Task 2: Exercise builders and the listening prompt

**Files:**
- Create: `src/services/replies/exercises.ts`
- Create: `src/services/replies/exercises.test.ts`
- Modify: `src/types/index.ts` — `Exercise` gains `audio?: string` ("When set, the runner plays this instead of showing the question text.")
- Modify: `src/components/ExerciseRunner.tsx:316-336` — when `current.audio` is set, render a large `SpeakButton text={current.audio} label="Play"` in place of the question paragraph and the small speak button.

**Interfaces:**
- Consumes: `ReplyPair`, `REPLY_PAIRS` (Task 1).
- Produces:
  - `buildChooseReply(pairs: ReplyPair[], pool?: ReplyPair[]): Exercise[]` — one `multiple-choice` per pair: `id: '<pair.id>-choose'`, `prompt: 'Choose the natural reply'`, `question: pair.fi.q`, `options` 4 distinct `fi.a` strings, `answer: pair.fi.a`, `explanation: pair.en.q + ' — ' + pair.en.a`, `explanationTl` likewise from `tl`.
  - `buildListenMeaning(pairs: ReplyPair[], pool?: ReplyPair[]): Exercise[]` — `id: '<pair.id>-listen'`, `prompt: 'Listen. What does it mean?'`, `question: ''`, `audio: pair.fi.a`, options 4 distinct `en.a`, `answer: pair.en.a`, `explanation: pair.fi.a`, `explanationTl: pair.tl.a`.
  - `pool` defaults to `REPLY_PAIRS`. Distractors: other pairs of the same category first (by ascending distance in `num`), then pairs from other categories, skipping any whose text equals an option already chosen.

- [ ] **Step 1: Write the failing tests:**
  - `choose: every exercise has 4 distinct options including the answer` — over `buildChooseReply(REPLY_PAIRS)`.
  - `choose: distractors prefer the same category` — for `rp-01`, all 3 distractors are replies of pairs 2–8.
  - `choose: works when only one pair is given` — `buildChooseReply([rp-05])[0].options.length === 4`.
  - `listen: sets audio to the reply and hides the question` — `audio === pair.fi.a`, `question === ''`, 4 distinct options.
  - `ids are unique across both builders`.
- [ ] **Step 2: Run** `npx vitest run src/services/replies` — Expected: FAIL.
- [ ] **Step 3: Implement both builders and the `audio` field / runner branch.**
- [ ] **Step 4: Run** `npx vitest run` — Expected: all pass, including the existing 14.
- [ ] **Step 5: Commit** `git commit -m "Build reply exercises, and let the runner play a sentence instead of showing it"`

### Task 3: RevealTranslation, reply list and category pages

**Files:**
- Modify: `src/components/ui.tsx` — add `RevealTranslation`
- Create: `src/pages/Replies.tsx`
- Modify: `src/App.tsx` — routes `/replies`, `/replies/practice` (Task 4 fills it; until then route to the list), `/replies/:id`
- Modify: `src/pages/Phrases.tsx` — entry card above the search box in `PhrasesList`
- Modify: `src/pages/More.tsx` — `LINKS` row `{ to: '/replies', title: 'Natural Finnish Replies', sub: 'Luontevia vastauksia · 80 pairs', icon: 'chat', colour: 'var(--c-phrases)' }`

**Interfaces:**
- Produces:
  - `RevealTranslation({ children, label = 'Show translation', hideLabel = 'Hide translation' }: { children: ReactNode; label?: string; hideLabel?: string })` — local open state, button styled like the Phrases "Show details" link, children mounted only while open.
  - `ReplyCard({ pair }: { pair: ReplyPair })` exported from `Replies.tsx` (Task 5 search results reuse it).
  - `RepliesList()`, `ReplyCategoryPage()` exported from `Replies.tsx`.

- [ ] **Step 1:** Build `RevealTranslation`, `ReplyCard` (number badge, `LevelBadge`, Finnish question with `SpeakButton`, Finnish reply with `SpeakButton`, then `RevealTranslation` containing EN q/a, TL q/a if `showTagalog`, `note`/`noteTl`, `puhekieli` with the `puhekieli` badge as in `PhraseCard`).
- [ ] **Step 2:** Build `RepliesList`: `TopBar title="Luontevia vastauksia" subtitle="Natural Finnish Replies · 80 pairs"`, a primary "Practise" button to `/replies/practice`, a collapsible usage-notes panel listing `REPLY_USAGE_NOTES` (Finnish visible, meaning inside `RevealTranslation`), search box (filters with `searchReplies` from Task 5 — until then, list only), category row cards like `PhrasesList`. `ReplyCategoryPage`: not-found state copied from `PhraseSituation`; otherwise `ReplyCard` per pair.
- [ ] **Step 3:** Routes, Phrases entry card, More row.
- [ ] **Step 4: Verify** `npx tsc -b --noEmit` — Expected: no output.
- [ ] **Step 5: Commit** `git commit -m "Add the Natural Finnish Replies pages, translations hidden until asked"`

### Task 4: Practice page and ReplyFlashcards

**Files:**
- Create: `src/components/ReplyFlashcards.tsx`
- Modify: `src/pages/Replies.tsx` — add `ReplyPractice()`
- Modify: `src/App.tsx` — `/replies/practice` → `ReplyPractice` (declared before `/replies/:id`)

**Interfaces:**
- Consumes: `buildChooseReply`, `buildListenMeaning` (Task 2); `ExerciseRunner`; `canSpeak` from `@/services/speech`; `RevealTranslation` (Task 3).
- Produces: `ReplyFlashcards({ pairs, direction, onDone }: { pairs: ReplyPair[]; direction: 'fi-first' | 'meaning-first'; onDone: (score: { knew: number; total: number }) => void })`.

- [ ] **Step 1:** `ReplyFlashcards`: one card at a time. `fi-first` (mode 2): Finnish q and a with speak buttons; `RevealTranslation` shows EN/TL. `meaning-first` (mode 3): EN q and a (TL too if enabled); button "Show answer" reveals Finnish reply with speak button. After reveal, `Knew it` / `Not yet`; "Not yet" pairs are appended once to the end of the run. Progress bar like `ExerciseRunner`'s `qbar`. Calls `noteActivity` like `ExerciseRunner` does.
- [ ] **Step 2:** `ReplyPractice`: mode picker (four buttons, Finnish title + English line; listening hidden when `!canSpeak()`), category filter as `FilterPills` with "All" plus the ten categories, then 10 random pairs from the filter (all 8 when one category). Modes 1 and 4 render `ExerciseRunner` with the built exercises and `nextUp` back to the picker; modes 2 and 3 render `ReplyFlashcards`.
- [ ] **Step 3: Verify** `npx tsc -b --noEmit` and `npx vitest run` — Expected: clean, all pass.
- [ ] **Step 4: Commit** `git commit -m "Practise replies four ways"`

### Task 5: Search

**Files:**
- Modify: `src/services/search/search.ts`
- Modify: `src/services/search/answers.test.ts` (or create `src/services/search/replies.test.ts`)
- Modify: `src/pages/Search.tsx` — `KIND_META.reply = { label: 'Reply', colour: 'var(--c-phrases)', path: '/replies/' }`; a reply hit navigates to `/replies/<category>`
- Modify: `src/pages/Replies.tsx` — wire the list search box to `searchReplies`

**Interfaces:**
- Produces: `searchReplies(query: string): ReplyPair[]` (empty query returns `[]`), matching `fold()` of `fi.q fi.a en.q en.a tl.q tl.a puhekieli`. `GlobalHit.kind` gains `'reply'`; a reply hit has `id: pair.category`, `title: pair.fi.q`, `subtitle: pair.fi.a`, `badge: pair.level`, score 60 if `fold(fi.q)` starts with the query, else 30.

- [ ] **Step 1: Write the failing tests:** `searchReplies('mielellani')` includes `rp-22`; `searchReplies('kumusta')` includes `rp-01`; `searchReplies('')` is `[]`; `searchEverything('Mitä kuuluu')` contains a hit with `kind: 'reply'`.
- [ ] **Step 2: Run** `npx vitest run src/services/search` — Expected: FAIL.
- [ ] **Step 3: Implement.** Global search subtitle shows the Finnish reply, not a translation, since the hit opens a practice surface.
- [ ] **Step 4: Run** `npx vitest run` — Expected: all pass.
- [ ] **Step 5: Commit** `git commit -m "Find reply pairs in search"`

### Task 6: Hide translations in Phrases and Situations

**Files:**
- Modify: `src/pages/Phrases.tsx` — `PhraseCard`
- Modify: `src/pages/Situations.tsx:249-258, 365-381` — `OptionButton`

**Interfaces:**
- Consumes: `RevealTranslation` (Task 3).

- [ ] **Step 1:** `PhraseCard`: Finnish and speak button stay visible; `en`, `tl` move inside `RevealTranslation`, together with the existing details (puhekieli, note, grammar chips), replacing the "Show details" toggle so there is one button.
- [ ] **Step 2:** `OptionButton` gains `showGloss: boolean`; the English line renders only when true. Caller passes `showGloss={Boolean(picked?.ok)}` — English appears on all options once the right one is chosen, not after a wrong pick (a wrong pick would otherwise reveal the answer).
- [ ] **Step 3: Verify** `npx tsc -b --noEmit` — Expected: no output.
- [ ] **Step 4: Commit** `git commit -m "Keep translations hidden until asked in Phrases and Situations"`

### Task 7: Release, browser check, push

**Files:**
- Modify: `src/data/releases.ts` — `APP_VERSION = '1.8.0'`, new first entry dated `2026-10-27`, title `Natural Finnish replies`, notes (one line each): the new section with 80 everyday question-and-reply pairs and four ways to practise; translations now stay hidden until you press Show translation, in phrases, replies and role-plays; 47 new words on everyday life, work, health, errands, relationships and official business.
- Modify: `package.json` — `"version": "1.8.0"`

- [ ] **Step 1:** Edit both files.
- [ ] **Step 2: Run** `npm run build` and `npx vitest run` — Expected: build succeeds, all tests pass.
- [ ] **Step 3: Browser pass** (preview server, `npm run dev`): `/replies` list and usage notes; one category page with reveal/hide; `/replies/unknown` shows not-found; each of the four modes to its result screen; global search "Mitä kuuluu" opens the category; a Phrases card starts hidden; a Situations scene hides option English until the right pick; repeat `/replies` at 375 px width. Fix anything found before continuing.
- [ ] **Step 4: Commit and push** `git commit -m "Release 1.8.0: natural replies and hidden translations"` then `git push origin main`.
