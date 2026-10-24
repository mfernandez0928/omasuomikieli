# Oma Suomi — product and monetisation audit

Date: 2026-10-24
Scope: the repository at `8c37ec5`, the live site `omasuomikieli.vercel.app`, the
Supabase project as reachable from outside, and the content data files.

Every claim below is labelled. **Verified** means I ran it or read it in this
repository. **Estimate** means a number I derived, with the derivation shown.
**Hypothesis** means a business assumption that has not been tested against
real buyers. **Needs external check** means a lawyer, an accountant or the
market has to answer it, not me.

Nothing in the code was changed to produce this document.

---

## 1. The vision, in my own words

You are building a Finnish-learning app that teaches Finnish properly — not a
word-matching game that produces the feeling of progress without the thing
itself. The distinguishing claim is accuracy: every word carries its forms, its
stem, its verb type and a citation, and the app admits on screen where its own
evidence is thin. That is the product's identity, and it is not negotiable for
revenue.

The audience starts with Filipino learners because Finnish–English–Tagalog is
what exists today, but the product is for anyone learning Finnish. Tagalog is a
differentiator, not a boundary. More explanation languages are a possibility to
be earned by demand, not a growth tactic to reach for.

The business should look like Duolingo's shape and not its substance: a free
tier that genuinely teaches and builds a daily habit, and a paid tier that
people choose because it moves them further in Finnish. You do not want a
paywall placed around features that are free today. You want to be paid for
value you add, and you have correctly identified that a client-side gate over
content already shipped in the bundle is theatre, not a business.

The destination is sustainable recurring revenue from an app people keep
using, with an identity broader than one exam.

**Where my earlier framing was wrong.** In this session's first pass I treated
the Filipino nurse/YKI segment as the strategy and recommended a one-time
unlock. You have corrected both. This document works from the brief: a
subscription around Finnish-learning outcomes, for Finnish learners generally,
with YKI as at most one component. The one-time-unlock recommendation is
withdrawn — it does not fit a product whose value compounds monthly.

---

## 2. What was verified about the current state

| Check | Result |
| --- | --- |
| `npm run typecheck` / `build` | clean |
| `npm test` | 14 tests pass, in 2 files (`srs/scheduler`, `search/answers`) |
| `npm run validate:data` | clean — 1 256 word ids, 29 lessons, 256 exercises |
| `npm run validate:situations` | clean — 5 scenes, 125 Finnish lines, 198 forms, all accounted |
| Live site | HTTP 200 |
| Bundle | `dist/assets/index-*.js` = 1 579 311 bytes (1.58 MB) |
| Anon key can read `learners` | No — HTTP 401 (correct) |
| Supabase sign-ups | **`disable_signup: false`** — still open as of today |

### Content, counted from the data files

| | Verified count |
| --- | --- |
| Dictionary entries | 1 256 ids |
| — citing a book | 894 (os1 680, sm2 102, sm3 96, lm 16) |
| — `source: null` | 89 |
| Verification: `source-verified` | 991 |
| Verification: `linguistically-checked` | 252 |
| Verification: `needs-review` | 4 |
| Finnish-language explanations (`selitys`) | 635 |
| Grammar lessons | 29 — 24 `source-derived`, 5 `supplementary` |
| Exercises | 256, across 8 kinds |
| Phrases | 112 in 15 situations |
| Role-play scenes | 5 |
| Reading passages | 3 |
| Topics | 12 |
| Levels | A1 712, A2.1 321, A2.2 158, B1 56 |

**The README is out of date** and overstates nothing but understates a lot. It
reports 822 entries, 726 source-verified, 85 linguistically-checked, 10
supplementary and "19 of the 24 grammar lessons" cited. The actual figures are
1 256 entries, 991 source-verified, 252 linguistically-checked, 0
supplementary and 24 of 29 lessons source-derived. It also lists "no import
button yet" under Known Limitations, but `restoreBackup()` exists in
`src/services/storage/backup.ts` and is wired into both Settings and the
Welcome screen. Fix the README before anyone else reads it — a stale
provenance table undercuts the one claim the product is built on.

---

## 3. Feature-by-feature audit

Each feature: what it does, whether it works, what it teaches, what I would do
with it commercially, and what work it needs.

### 3.1 Dictionary and search — **the strongest asset. Keep free.**

*What it does.* 1 256 entries. Every verb carries a six-person present
paradigm; nouns carry genitive, partitive, illative and plurals where known.
`src/services/search/search.ts` indexes the headword, English, Tagalog, every
stored inflected form, search aliases, and — a genuinely clever touch —
*derives* the six local-case forms from the stored genitive purely for
matching, so a learner who meets `kaupassa` in the wild finds `kauppa` without
a dozen extra stored fields. Diacritics are folded for search (`aiti` finds
`äiti`) but kept distinct for grading.

*Verified working.* Yes. The index is built once at module load; filters cover
level, type, topic, verb type and origin.

*Learning problem solved.* The hardest practical barrier in Finnish is that
the word on the street is never the word in the dictionary. This solves it
better than any free alternative I know of for Finnish.

*Commercial verdict.* **Free, in full, permanently.** Three reasons. A
part-locked dictionary is a broken dictionary and will earn one-star reviews.
It is the feature that generates word-of-mouth and search traffic. And it is
the proof of the accuracy claim — hiding it hides the argument for paying.

*Work needed.* None for correctness. `selitys` (635 Finnish explanations)
deserves to be more prominent; see §5.

### 3.2 Grammar lessons — **free teaching text, premium depth.**

*What it does.* 29 lessons, A1→B1, each with a fixed template the type system
enforces: English and Tagalog intro, the precise rule, an `easyRule` box,
examples, exceptions, common mistakes with *why*, a memory tip, and exercises.
24 carry a book citation; 5 are labelled supplementary with a note saying why
they could not be traced.

*Verified working.* Yes. I read `a1-cases.ts` in full. The quality is high and
the pedagogy is deliberate — the six local cases are taught as two parallel
sets of three rather than six separate cases, which is the right call.

*Learning problem solved.* Finnish grammar explained in a learner's own
language, with the failure modes named up front. The `mistakes` array on each
lesson is the most valuable part and the rarest.

*Commercial verdict.* **Teaching text free; new depth premium.** The
explanations are the marketing. What goes behind the gate is the second layer
you have not written yet: B1–B2 lessons, a consonant-gradation deep dive,
object case (an acknowledged hard spot), the passive, participles. Do not
move the existing 29 behind a wall.

*Work needed.* The curriculum stops at B1 with only 56 B1 words. A learner who
finishes has nowhere to go, which caps subscription lifetime at exactly the
point they are most invested. **This is the single biggest content gap and the
most defensible thing to sell.**

### 3.3 Exercise engine — **works well. Free.**

*What it does.* `src/components/ExerciseRunner.tsx`, 494 lines, 8 exercise
kinds. Deterministic seeded shuffle so options do not jump on re-render.
Wrong answers write to My Mistakes automatically with the correct form.
Umlaut near-misses pass but are told about. Only missed questions are
replayed, and when everything is right the repeat button is deliberately
absent.

*Verified working.* Yes, by reading. The umlaut logic and answer
normalisation are the two things covered by the 14 unit tests.

*Learning problem solved.* Feedback that explains the rule instead of saying
"Incorrect". Every exercise is required by the type system to carry an
`explanation` and `explanationTl`.

*Commercial verdict.* **Engine and existing 256 exercises free.** Sell volume
and new kinds, not access to the engine.

*Work needed.* 256 exercises over 29 lessons is roughly 8 each — enough to
learn a rule once, not enough to drill it. A paying learner will exhaust a
lesson's questions in one sitting. There are no automated tests for the
engine itself; the two test files do not touch it.

### 3.4 Spaced repetition — **works, but under-used. The premium engine.**

*What it does.* `src/services/srs/scheduler.ts`, SM-2 style. Ease clamped to
[1.3, 2.8], start 2.3. `again` resets to 10 minutes and counts a lapse; the
answer buttons preview the resulting interval. `newPerDay` is counted per
calendar day via `introducedOn`, not per session. Cards keyed `${kind}:${refId}`.

*Verified working.* Yes — 7 unit tests, and the `again` path in
`ReviewSession` correctly requeues the *graded* card rather than the stale
copy, with a comment explaining why.

*Learning problem solved.* The only mechanism in the app that produces
retention over months rather than days.

*Confirmed gaps.*
1. **Only vocabulary is scheduled.** `ReviewSession` builds its candidate list
   as `WORDS.map(...)`. `SrsCard` supports `kind: 'grammar'`, but no grammar
   card is ever created. Known and documented in the README.
2. **Mistakes are not scheduled.** My Mistakes is a list plus a ranking that
   feeds Weak Topics. Nothing schedules a mistake for return at a computed
   interval. This is the most obvious missing feature in the whole app.

*Commercial verdict.* **A capped free tier, uncapped and extended as premium.**
Free: review works, with a modest `newPerDay`. Premium: unlimited new cards,
grammar cards in the queue, and mistake-driven scheduling. This is the
cleanest premium feature in the product because it is *more of a mechanism
that demonstrably works*, not a re-lock of something free.

*Work needed.* Feed grammar and mistakes into the queue. Moderate — the
scheduler already supports it; the queue builder and the card-creation path
need extending.

### 3.5 My Mistakes — **free, but needs to become active.**

*What it does.* Every wrong answer in Practice, Reading and Listening is
written here with the given answer, the correct form, the question, and links
to the grammar lesson and word. Learners can add corrections by hand, mark
them resolved, and keep a personal word list with their own notes.

*Verified working.* Yes.

*Learning problem solved.* Your own errors are the highest-value study
material you have. Capturing them automatically is excellent.

*Commercial verdict.* **Free.** It is a trust feature — it shows the app is
paying attention. The *scheduling* of those mistakes is the premium half (§3.4).

*Work needed.* It is passive. 30 open mistakes produce a long list and a
Callout suggesting Weak Topics. It should produce a session.

### 3.6 Role-play situations — **the most distinctive feature. Partly free.**

*What it does.* 5 scripted scenes (shop, health centre, flat, directions,
boss), 125 Finnish lines, 18 turns, 54 replies, with a goal checklist. Tapping
any word gives its gloss, the case or colloquial rule, and a link into the
dictionary. Wrong replies go to My Mistakes.

*Verified working.* Yes, and the discipline behind it is unusual: all 198 word
forms resolve through `lexicon.ts` — 180 to dictionary entries, 18 to
documented exceptions — and `validate:situations` fails the build on an
unaccounted word.

*Learning problem solved.* The gap between knowing words and surviving a
conversation. Nothing else in the app touches it.

*Honest limitation.* A scene follows the same path every time. There is no
conversational model, which is stated plainly in the README. It is a branching
script, and after two runs a learner has seen it.

*Commercial verdict.* **2 scenes free, the rest premium.** With 5 scenes there
is barely a library to divide; this feature needs volume before it can carry a
price. It is the strongest candidate for new premium content because each
scene is self-contained, obviously valuable and does not require new
architecture.

*Work needed.* Volume: pharmacy, Kela, job interview, parents' evening,
landlord, bank, dentist, emergency. 20 scenes would be a genuine selling
point. Each needs lexicon entries and must pass the validator — real work, but
work the tooling already supports.

### 3.7 Reading practice — **thin. Free as-is; premium for volume.**

*What it does.* 3 passages with translation toggle, a glossary linked into the
dictionary, per-paragraph speech, and comprehension questions through the
shared exercise runner.

*Verified working.* Yes. The list screen states: *"These passages are written
for this app, not copied from a textbook."* Confirmed — `reading.ts` carries no
`bookId`.

*Commercial verdict.* 3 passages is not a feature, it is a demonstration.
Keep free; sell a real library later.

*Work needed.* Volume, graded by level. This is also the cheapest
copyright-clean content to produce and the best vehicle for the `selitys`
Finnish-in-Finnish approach.

### 3.8 Listening practice — **the weakest feature. Fix before selling.**

*What it does.* Device Finnish text-to-speech reads a phrase or an example
sentence; the learner types what they heard. With no `fi-FI` voice installed
the screen explains that honestly instead of substituting an English voice —
the right call.

*Confirmed defects.*
1. **"Go again" replays the identical 10 items in the identical order.** The
   item pool is `useMemo(..., [mode])`. The restart handler resets index,
   score, input and checked state but does not change `mode`, so the memo is
   never recomputed. Verified by reading `src/pages/Listening.tsx`.
2. **One difficulty only: full dictation.** Transcribing a whole sentence is a
   B1-level task being handed to A1 learners. There is no listen-and-choose,
   no gap-fill, no slow replay.
3. **No recorded audio anywhere in the app.** TTS quality varies by device and
   is not the register a learner will meet.

*Commercial verdict.* **Do not put this behind a paywall in its current
state.** Charging for a feature that replays the same ten sentences invites
refunds. Fix the redraw, add an easier mode, then treat *recorded human audio*
as a premium tier — that is a real differentiator and the one thing TTS cannot
fake.

*Work needed.* The redraw is a one-line dependency fix. Difficulty modes are
moderate. Recorded audio is a budget line (a native speaker, a few hundred
lines) and the strongest argument for a subscription in the entire product.

### 3.9 Phrases — **free.**

112 phrases in 15 situations, with colloquial equivalents and register notes.
Verified working. Low pedagogical ceiling on its own but useful as reference
and as the Listening pool. Free; no reason to gate.

### 3.10 Word-level practice — **confirmed defect.**

`WordPractice` in `src/pages/Practice.tsx` builds up to 4 questions per word
(meaning, 1sg, genitive, translate the example). The meaning question's
distractors are:

```ts
WORDS.filter((w) => w.id !== word.id && w.type === word.type).slice(0, 2)
```

`.slice(0, 2)` takes the **first two words of that type in array order, every
time**. Every verb in the dictionary is tested against the same two English
glosses. The question is trivially guessable after two encounters and often
absurd. Fix before this is part of anything paid. Low effort: pick distractors
pseudo-randomly, seeded on the word id, and prefer ones at a similar level.

### 3.11 Progress, streak, daily goal, Home — **free. Insight is premium.**

Activity is recorded per calendar day, the streak is tracked in
`localStorage`, Home shows the last seven days, a resume card and a daily goal.
Verified working.

What does not exist is *insight*: no per-case mastery, no "your partitive is
weak", no projected readiness, no retention curve. The data to compute much of
this is already in IndexedDB. **Progress insights are a strong premium
feature** — they are new value, not a re-lock, and they directly serve "am I
actually getting better?", which is the question a subscriber is paying to
have answered.

### 3.12 Data audit screen — **free, and a marketing asset.**

626 lines showing source coverage, verification counts, every change made to
the imported database, and open questions. Verified working. Nothing else in
this category does this. Keep free and link to it from the store listing.

### 3.13 Backup and restore — **free. Cloud sync is premium.**

`createBackup`, `parseBackup` and `restoreBackup` with a `RestoreReport`, a
versioned `BACKUP_FORMAT`, and — a thoughtful detail — the restore offer placed
on the *Welcome* screen, because an iOS home-screen install gets its own
storage container and a learner can arrive with everything apparently gone.

*Commercial verdict.* Manual backup free. **Cloud backup and multi-device sync
is the single most natural paid feature in the product** — it requires
accounts, so it justifies the account work; it is pure addition; and the cost
has already been measured in `docs/subscription-plan.md` (3.4 KB gzipped for a
typical learner, ~151 000 learners per 500 MB).

### 3.14 Onboarding gate — **the highest-leverage problem in the product.**

`src/pages/Welcome.tsx` requires a **first name and a last name** before the
app opens, and posts both to your Supabase table with the note: *"Only your
name is recorded, so the person who made the app knows who is using it."*

For 50 people who know you, this is fine and even friendly. For the
international product in the brief it is three problems at once:

1. **Conversion.** A mandatory real last name before any value is shown is one
   of the most costly first screens a consumer app can have. A stranger from a
   Google search has no reason to give it.
2. **Compliance.** You are collecting full names of EU residents with no
   privacy policy, no stated lawful basis, and a table with no select policy —
   so deletion requests are manual, and two people sharing a name are one row,
   which means you cannot reliably tell whose data you are deleting. Your own
   `docs/security-review.md` reaches the same conclusion.
3. **Store review.** Google Play's Data Safety declaration and Apple's privacy
   questionnaire both require a published policy for collected personal data.
   As it stands this is a rejection.

*Recommendation.* Make the name optional and local, first name only, asked
*after* the learner has seen the app work — or drop it for an anonymous
install counter. This costs you a roster you can read by name and buys
conversion, a defensible privacy position and a store listing. It is a few
hours of work and I would do it before anything else on this list.

---

## 4. Cross-cutting findings

### 4.1 You are flying blind, and this blocks pricing

**Verified:** instrumenting the live site produced exactly one outbound request
in a whole session — the roster POST. No analytics, no telemetry, no cookies.

As a privacy stance this is admirable. As a business input it is
disqualifying. You cannot answer: how many people open the app twice; which
features are used; where learners stop; whether anyone reaches lesson 10;
what D7 and D30 retention are. **Every pricing and packaging decision in this
document is a hypothesis until these numbers exist**, and no amount of
analysis substitutes for them.

A cookieless, self-hostable, GDPR-friendly counter (Plausible, Umami,
Cloudflare Web Analytics) fits the app's ethos and needs one `connect-src`
entry in the CSP. **This is the first thing to build.** Not the paywall.

### 4.2 Internationalisation: the architecture does not support it today

You asked whether the content structure can carry more languages without
unnecessary complexity. **Verified answer: no — and the cost is in data, not
code.**

`src/types/index.ts` hardcodes English and Tagalog as named required fields
throughout: `Word.en`/`.tl`/`.noteTl`, `ExampleSentence.en`/`.tl`,
`Rection.english`/`.tagalog`, `Exercise.explanationTl`,
`GrammarLesson.introTl`/`.tipTl`, `GrammarTable.noteTl`,
`CommonMistake.whyTl`, `Phrase.en`/`.tl`/`.noteTl`, `RolePlayLine.en`/`.tl`,
`RolePlayOption.whyTl`, `RolePlayTurn.taskTl`, `RolePlay.settingTl`,
`SceneGloss.en`, and `Settings.showTagalog`/`.showEnglish`. The search index
in `search.ts` has literal `english` and `tagalog` fields.

Counted across `src/data`:

| | Count |
| --- | --- |
| Tagalog-side string fields (`tl`, `tagalog`, `*Tl`) | **3 903** |
| English-side string fields | 4 016 |
| Finnish-only explanations (`selitys`) | 635 |

**So one additional explanation language is roughly 3 900 new strings at
native-speaker quality, plus a schema migration from named fields to a keyed
map.** That is not a sprint. It is a translation project with a quality floor,
and a bad third language would damage the accuracy claim that is the whole
product.

**The important and more cheerful finding:** you do not need another language
to serve international learners. Everything that is language-independent —
all Finnish content, 1 256 paradigms, 256 exercises, the 635 `selitys` Finnish
explanations, the role-plays, the audio — already works for anyone. The
English layer (4 016 fields) already serves most international learners, since
English is the working language of integration in Finland. **Tagalog is
already optional** (`showTagalog`), so it is a bonus for Filipino learners and
invisible to everyone else.

*Recommendation.* Do not add a language. Make English-first excellent: audit
the English strings for places that assume a Filipino reader, put `selitys`
forward as a Finnish-in-Finnish feature (it is both good pedagogy and
language-neutral), and add a UI language switch only when a specific group
asks in numbers. Revisit when one language has a measured demand signal — a
waiting list with names on it, not an intuition. The schema refactor to a
keyed map is worth doing *before* that day, while there are 2 languages to
migrate and not 4.

### 4.3 Security and compliance before any money moves

| Item | Status | Verified how |
| --- | --- | --- |
| Supabase sign-ups open | **OPEN — HIGH** | `/auth/v1/settings` today: `disable_signup: false`, email on, `mailer_autoconfirm: false` |
| Anon key cannot read the roster | correct | HTTP 401 on `select` |
| No secrets in git history | correct | per `docs/security-review.md` |
| Security headers | correct and served | per `docs/security-review.md` |
| CSP allows `*.supabase.co` | open — MEDIUM | `vercel.json` |
| Privacy policy | **does not exist** | no route, no page |
| Terms of service | **does not exist** | — |
| Refund / cancellation policy | **does not exist** | — |
| `Permissions-Policy: payment=()` | will block checkout | `vercel.json` |

The open sign-up finding has been known since 2026-10-21 and is still open. It
costs nothing to close — nothing in the app signs in — and leaving it open
means anyone holding the anon key from the bundle can create users in your
project and make it send confirmation mail to addresses of their choosing.
**Close it today.** Re-enable it deliberately as part of the accounts work,
with rate limiting and a CAPTCHA.

**Needs external check** before taking money from EU consumers:

- **VAT on digital services.** B2C digital services are taxed in the
  customer's country. Either register for the One Stop Shop and file, or use a
  Merchant of Record who becomes the seller and handles it. For a solo
  developer the MoR fee is almost certainly cheaper than OSS returns — but
  confirm with a Finnish accountant, including whether you are trading as a
  *toiminimi* or a company, and the small-business VAT threshold position.
- **Right of withdrawal.** EU consumers have a 14-day withdrawal right on
  digital services. It can be waived only with explicit, informed consent
  before access begins, recorded. Your checkout must capture it.
- **Cancellation.** Must be at least as easy as subscribing.
- **GDPR.** With accounts you need a lawful basis, a privacy policy, a working
  deletion route, and a record of processing. The roster as it stands cannot
  honour a deletion request reliably, because the unique index on
  `lower(first_name), lower(last_name)` merges two people with the same name
  into one row.
- **Store rules**, if you distribute through Play or the App Store: both
  require their own billing for digital subscriptions, both take a cut, and
  both require the privacy disclosures above.

### 4.4 Copyright: better than I first thought, with one real exposure

I read the content rather than reasoning from the citations, and the position
is stronger than my first pass suggested.

**What is original and carries no textbook dependency:**

- All 256 exercises. **Verified:** no `bookId` appears anywhere in
  `extra-exercises.ts` or in the lesson exercise arrays.
- All 3 reading passages, stated in the UI and confirmed in `reading.ts`.
- All 5 role-play scenes — written for the app, which is why they needed the
  lexicon discipline in the first place.
- All 635 `selitys` Finnish explanations.
- The grammar explanations themselves. I read `a1-cases.ts` in full: the rule
  is stated in your own words, the examples are ordinary generic sentences
  (`Olen kaupassa.`), the exceptions and common mistakes are your editorial
  work. `origin: 'source-derived'` records *where the grammar point came
  from*, not that text was copied. `sourceTerm: '-ssa vai -lla?'` is a short
  heading quoted for citation, which is normal scholarly practice.
- `puhekieli.ts`: `mä = minä`, `sun = sinun` and the rest are facts of spoken
  Finnish that any grammar would list identically. No creative selection.

**The one real exposure: vocabulary selection and arrangement.** 680 entries
cite Oma suomi 1, drawn chapter by chapter from its SANASTO word lists, with
chapter and page recorded. Individual words are not protectable and neither is
the fact that `lähettää` is a type-1 verb. But in the EU, the *selection and
arrangement* of a compilation can be protected in its own right (copyright in
compilations, and the sui generis database right under Directive 96/9/EC),
and a chapter-ordered reconstruction of one textbook's word lists is closer to
that line than a dictionary assembled independently. Free distribution keeps
the stakes low. **Charging money raises them**, and a Finnish educational
publisher is exactly the kind of rights holder that notices.

You have already made the right call once: the full 1 432-headword
transcription lives in `src/data/sources/os1-sanasto.local.ts`, is gitignored
via `src/data/sources/*.local.ts`, and — **verified** — is referenced only in a
comment, so the tracked tree builds without it. Keep it that way. It must
never ship, never be committed, and never be the source of a paid feature.

*Recommended approach for paid content.* Make everything you sell original by
construction:

1. **Never sell the word list.** Keep the dictionary free. A free dictionary is
   also the weakest possible target for a complaint.
2. **Re-derive the order.** For paid material, order vocabulary by your own
   criterion — frequency, topic, learner difficulty from your own mistake data
   — not by textbook chapter. Your own ordering is your own work, and the
   mistake data makes it better than a chapter order anyway.
3. **Keep citations as citations.** A page reference is a strength, not a
   liability; it is what accuracy looks like. Citing is not copying.
4. **Write paid content from zero.** New lessons, scenes, passages, recorded
   audio and exercises owe nothing to anyone. This is the same conclusion as
   §5: *sell what you build next.*
5. **Needs external check.** Before launch, one hour with a Finnish IP lawyer
   on the vocabulary-compilation question specifically. Tell them 680 entries
   derived from one book's chapter word lists, meanings written independently.
   This is a cheap, bounded question and the answer changes what you may sell.

---

## 5. The strategic key: sell what you build next

The brief contains a constraint that looks like a problem and is actually the
answer.

The problem as stated in `docs/subscription-plan.md`: the whole course is in a
1.58 MB JavaScript bundle handed to every visitor, so any `if (plan === 'full')`
check decides what to *draw*, not what the learner *has*. Correct, and well
documented.

The usual response is to haul existing content onto a server — the "biggest
piece of work" your own document identifies, and the one that decides whether
the idea is worth it. **Do not do that.** Instead:

> **Everything that exists today stays free and stays in the bundle. Everything
> built from now on for the paid tier is served from the server to entitled
> accounts only.**

What this buys:

- **No retrofit.** The bundle problem never has to be solved. It only applies
  to content already shipped, and that content is the free tier.
- **The gate is real from day one.** Premium content was never in anyone's
  bundle, so there is nothing to bypass.
- **It satisfies your own principle exactly.** Nothing useful is taken away.
  People pay for what you add.
- **Free stays strong**, which is what feeds the funnel, the store ranking and
  the word-of-mouth.
- **It fixes the copyright exposure**, because new content is original by
  construction (§4.4).
- **Offline still works** for free content, which is the app's identity. Paid
  content is fetched once and cached, which is a benefit, not a compromise.

The honest caveat: content delivered to a device can be extracted by someone
determined. The goal is not DRM. It is that bypassing costs more effort than
subscribing — which is true of every app, and is a world away from today's
situation where a `localStorage` flag would hand over the product.

---

## 6. Free versus premium: three models

### Model A — "Build the next layer" *(recommended)*

| | Free | Oma Suomi Plus |
| --- | --- | --- |
| Dictionary | all 1 256, full entries, search | same |
| Grammar lessons | all 29, full teaching text | **+ new B1–B2 lessons** |
| Exercises | all 256 | **+ new banks, 25+ per lesson** |
| Spaced repetition | works, `newPerDay` capped | **uncapped + grammar cards + mistake scheduling** |
| My Mistakes | full tracker | **+ scheduled mistake revision** |
| Role-plays | 2 scenes | **all scenes, with new ones monthly** |
| Reading | 3 passages | **graded library** |
| Listening | fixed and free | **+ recorded human audio** |
| Progress | streak, goal, 7 days | **insights: per-case mastery, weak spots, readiness** |
| Learning path | browse freely | **placement test + personalised A1→B1 route** |
| Backup | manual file | **cloud backup + multi-device sync** |

*Trade-off.* Slowest to first revenue, because premium needs real content
before it can be sold. But nothing is taken from anyone, the free tier keeps
growing the funnel, and every paid feature is defensible in a review. This
matches the brief most closely.

### Model B — "Classic freemium caps"

Cap the free tier as `plans.ts` already describes: 8 of 29 lessons, 300 words,
20 questions a day, 1 scene, 1 text, no SRS.

*Trade-off.* Fastest to revenue and needs no new content. But it requires
hauling existing content behind the server (the big piece of work), it takes
away what people already have — your existing 20–100 users would lose
features overnight — and a 300-word cap on the dictionary destroys the asset
that generates discovery. It also contradicts your stated principle. **Not
recommended**, though `plans.ts` is a reasonable fallback shape if Model A's
content work proves too slow.

### Model C — "Supporter model"

No gate at all. A voluntary subscription with cosmetic thanks and early access
to new content.

*Trade-off.* Zero architecture, zero legal complexity beyond VAT on the
payments, and it can start this month. Conversion is very low — 0.5–2% is
typical for this model — but it is a *real* willingness-to-pay measurement with
real money, which no survey gives you. **Recommended as the validation step
inside the Model A roadmap**, not as the destination.

### On price

Any number here is a **hypothesis to test**, not a market fact.

Reference points, all **needs external check** for current accuracy: Duolingo
Super sits around €7–13/month; WordDive, a Finnish product, around €10/month;
Yle and uusikielemme.fi are free and good, which sets the floor for anything
generic. Your defensible position is depth and accuracy, not breadth.

The `550` cents in `plans.ts` is a sensible opening hypothesis. I would also
test €7,90 and an annual plan at roughly 8× the monthly, since annual plans
both raise lifetime value and cut the churn problem. Test price *after* the
premium features exist — pricing an empty tier teaches nothing.

---

## 7. Revenue scenarios

**All hypotheses.** Assumptions stated so you can disagree with them.

Shared assumptions: €6,90/month; web checkout via a Merchant of Record at
~5% + fixed fee, or a store at 15%; monthly churn 7% (consumer language apps
churn hard); conversion measured on monthly actives, not installs.

| Scenario | Monthly actives | Conv. | Subs | Gross | Net after fees | Hosting | **Net/month** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Pessimistic | 1 500 | 1.5% | 23 | €159 | €150 | €45 | **~€105** |
| Conservative | 4 000 | 2.5% | 100 | €690 | €650 | €45 | **~€605** |
| Base | 10 000 | 3% | 300 | €2 070 | €1 950 | €70 | **~€1 880** |
| Optimistic | 25 000 | 4% | 1 000 | €6 900 | €6 500 | €150 | **~€6 350** |

The thing to take from this table is not a number, it is the **shape**: revenue
is dominated by monthly actives, and you have 20–100. Conversion rate and
price are second-order. Tripling the price roughly triples revenue; growing
from 50 to 4 000 actives multiplies it by eighty. **Distribution is the
business problem. Packaging is a detail by comparison.**

Churn at 7%/month also means a subscriber lasts about 14 months, so lifetime
value is roughly €85 net at €6,90 — which is why the B1+ content gap (§3.2)
matters commercially: a learner who runs out of material cancels.

Ongoing costs to plan for: Supabase Pro (~$25/mo) once past the free tier,
which you will need anyway because **the free plan pauses a project after a
week idle** — unacceptable once entitlement checks depend on it; Vercel;
domain; MoR or store fees; and the real one, **your time on support**, which
arrives with the first paying customer and never leaves.

---

## 8. Minimum secure entitlement architecture

Only what is strictly required. In this order, and each step shippable alone.

**1. Accounts — Supabase Auth, email magic link.** No passwords to store or
reset. The rule from `docs/subscription-plan.md` holds absolutely: *the app
must keep working signed out and offline, exactly as it does today.* `session`
is state alongside `profile`, never a replacement; the Gate keeps asking "is
there a profile?". Nothing awaits the network before first render. One piece of
luck makes this cheap, already verified in that document: **no local data is
keyed to identity** — SRS cards are keyed `${kind}:${refId}`, mistakes by their
own id, activity by date — so signing in attaches an owner to existing data
rather than re-keying it. Sign-in merges local data upward; it never replaces
local data with the server's.

**2. Cloud backup, free, before any paywall.** This proves the account layer
under real use with nothing at stake, and it is a feature people want. Needs
`select` granted on the backups table alone with `using (auth.uid() = user_id)`,
and the cross-account read test from `docs/subscription-plan.md` run before
launch — sign in as one account, try to read another's row with the public key.
That test is the whole point.

**3. Premium content delivery.** New content in a Postgres table, readable only
by entitled accounts via RLS, or behind an Edge Function. Fetched once, cached
in IndexedDB for offline. Do **not** let the service worker runtime-cache
authenticated responses: the Workbox config precaches static assets only, and
adding authenticated requests would put one learner's data where another on
the same device could read it.

**4. Payment.** Compare, do not assume — you asked me not to pick for you:

| Route | Takes | Handles VAT | Notes |
| --- | --- | --- | --- |
| Paddle / Lemon Squeezy | ~5% + fee | yes, as MoR | web; simplest legal position for a solo developer |
| Stripe Billing | ~1.5–2.9% + fee | **no** — you file OSS | cheapest fees, most paperwork |
| Google Play Billing | 15% | yes | mandatory for subscriptions in a Play app; Play is also discovery |
| Apple In-App Purchase | 15% | yes | mandatory in an iOS app |

If the app stays a web PWA, an MoR is the pragmatic answer. If you ship to
stores, their billing is not optional for digital subscriptions, and you may
end up supporting both. Decide this with the distribution decision, not before.

Whichever: the entitlement row is written **only** by the provider's webhook,
server-side, with the service role key, with signature verification and
idempotency because providers retry. A client-writable subscription row is the
same as no subscription. Handle the states that actually occur — trialing,
active, past_due, cancelled-but-paid-until, refunded, chargeback.

**5. The gates, last.** `src/services/billing/entitlement.ts` already provides
the single function the app should ask. Keep `BILLING_ENABLED` false until
steps 1–4 are real.

**Also required on the day checkout goes in:** remove `payment=()` from
`Permissions-Policy` and add the provider to `connect-src` in `vercel.json`.
Both are already noted in your docs; this is the reminder that they are
blocking.

**Alternatives worth weighing before committing:** Model C (§6) needs none of
this. A Ko-fi or Patreon tier needs none of this. Selling a one-off content
pack through Gumroad needs none of this. Each is a way to learn whether people
will pay before you build the machine that collects it.

---

## 9. Staged roadmap

Each stage has an exit gate. If a gate is not met, the next stage is wrong and
the plan should change rather than continue.

### Stage 0 — See, and be allowed to sell (1–2 weeks)

- Close Supabase sign-ups. **Today.**
- Narrow the CSP wildcard to your own project origin.
- Add cookieless analytics; instrument screen views, lesson starts and
  completions, review sessions, and the funnel through the first-run screen.
- Rewrite the first-run gate: optional, first name only, local, asked after
  value is shown.
- Publish a privacy policy and terms.
- Fix the three confirmed defects: Listening redraw (§3.8), WordPractice
  distractors (§3.10), stale README (§2).

**Gate:** you can state D1, D7 and D30 retention, and which features are
actually used. *Nothing else in this plan is trustworthy until this gate is
met.*

### Stage 1 — Learn what people will pay for (4–6 weeks, overlapping)

- A "Plus — tell me when it's ready" button recording interest as a count.
- One in-app question: what would help you most? (fixed options, no free text
  to moderate).
- Open a supporter tier (Model C) at a hypothesis price. Real money, no gate.
- Talk to ten actual learners. Not a survey — ten conversations.

**Gate:** ≥20 recorded expressions of interest, **and** ≥5 people paying
something voluntarily. If nobody pays voluntarily, a paywall will not fix
that; the value proposition is wrong and Stage 2 should change shape.

### Stage 2 — Build value worth paying for (6–12 weeks)

Driven by Stage 1's answers, in likely order of impact:

- Mistake-driven scheduled revision and grammar cards in the SRS (§3.4) — the
  mechanism already exists and this is the clearest unmet need.
- Progress insights (§3.11) — mostly computation over data you already store.
- Role-play volume, toward 20 scenes (§3.6).
- B1+ lessons and deeper exercise banks (§3.2, §3.3).
- Accounts and free cloud backup (§8 steps 1–2).

**Gate:** accounts adopted by ≥30% of monthly actives, and measurable
engagement with at least two new features. An unused feature cannot be sold.

### Stage 3 — Charge (4–6 weeks)

- Choose the payment route with the distribution decision.
- Entitlement via webhook, server-side, tested.
- Premium content served to entitled accounts (§8 step 3).
- Gates on new content only (§5).
- Withdrawal-right consent, cancellation flow, refund policy.

**Gate:** 10 paying subscribers, and 30 days of churn data.

### Stage 4 — Distribution (continuous, start during Stage 2)

This is the actual business problem (§7). Store presence for ASO; a content
site for the long tail of Finnish grammar searches — the `selitys` material and
grammar explanations are natural SEO assets; integration-course teachers;
communities of learners in Finland generally, not one nationality.

**Gate:** monthly actives growing at a rate you can state.

### Stage 5 — Internationalisation, if earned (not before)

Only when one language group shows measured demand. Do the schema migration
from named `en`/`tl` fields to a keyed map *before* that (§4.2), while there
are two languages to migrate rather than four.

---

## 10. What is fact, what is not

**Verified in this repository or against the live service:** all content
counts; build, test and validator results; the 1.58 MB bundle; the open
Supabase sign-up setting as of 2026-10-24; the 401 on the roster; the three
code defects in §3.8, §3.10 and §3.4; the absence of `bookId` from every
exercise; the 3 903 Tagalog-side fields; that `os1-sanasto.local.ts` is not
tracked and not imported; the mandatory first+last-name gate; the absence of
any analytics, privacy policy or terms.

**My judgement, argued but not proven:** that the dictionary must stay free;
that Model A beats Model B; that selling only new content is the right way
around the bundle problem; that the onboarding gate is the highest-leverage
fix; that distribution matters more than packaging.

**Hypotheses needing real data:** every conversion rate, churn figure and
revenue number in §7; every price in §6; which premium features people would
actually pay for. Stage 0 and Stage 1 exist to replace these with measurements.

**Needs external verification:** the vocabulary-compilation copyright question
(Finnish IP lawyer, one bounded hour); VAT registration, OSS and your trading
form (Finnish accountant); EU withdrawal-right wording (consumer law); current
competitor pricing (market check); Play and App Store policy details for
subscriptions.

---

© 2026 MarkDev. All rights reserved.
