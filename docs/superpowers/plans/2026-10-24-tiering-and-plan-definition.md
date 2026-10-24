# Oma Suomi tiering and plan definition — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Record the decided Free / Plus split in code and data — every content item marked, every limit named, the price at 499 cents — with the master switch off, so nothing a learner sees changes.

**Architecture:** Two mechanisms, no overlap. A per-item `tier` field on grammar lessons, role-play scenes and reading passages answers "may this learner open this?"; day-counters in `PlanLimits` answer "has this learner had their allowance today?". The count caps currently in `plans.ts` (`lessons: 8`, `words: 300`, `situations: 1`, `readingTexts: 1`) are removed, because a count cap and a tier field would be two sources of truth that can disagree. The master switch becomes an environment variable read at call time rather than a module constant, so it is both testable and flippable per deployment without a code change.

**Tech Stack:** TypeScript 5.9, Vitest 3 (tests beside source as `*.test.ts`, no vitest config — defaults), Node ≥ 20.19.0. No new runtime dependencies.

**Spec:** `docs/product-and-monetisation-audit.md` — the audit this decision answers. No separate design document was written: the tier decision came directly from the product owner and is reproduced verbatim under Global Constraints below. Task 5 lands it in `docs/subscription-plan.md`, which becomes the canonical record.

**Verified precondition:** nothing outside `src/services/billing/` imports `PlanId`, `PlanLimits`, `limitsFor`, `BILLING_ENABLED`, `OPEN_ENTITLEMENT`, `withinLimit`, `remainingToday` or `canUse`. The module is self-contained, so renaming `full` to `plus` and deleting limit keys cannot break a screen.

## Global Constraints

- **Nothing a learner sees may change.** Billing stays off; with it off every gate must answer yes. This plan is groundwork only.
- Price: **499 cents**, stored as an integer. Money never touches a float. Displayed as `4,99 €` (fi-FI).
- The app must keep working signed out and offline exactly as it does today. This plan adds **no network call**.
- No new runtime dependency. No change to the bundle's content.
- British English in prose and comments, matching the repository.
- Every new exported function gets a test. There are currently **zero** tests over `src/services/billing/`.
- Comments say *why*, in the existing voice. No comment that restates its code.
- **Decided Free tier:** full dictionary and search (all 1 256 entries), all 112 phrases, the 10 `m-basic` grammar lessons, 1 reading passage, 2 role-play scenes, **5 exercises per day**, spaced repetition working with **5 new cards per day**.
- **Decided Plus tier (€4,99/month):** everything, uncapped, plus grammar cards in the review queue, mistake-driven scheduling, the personalised study plan, and progress history and statistics.
- **Listening is explicitly out of scope.** The decision defers extra listening content until Finnish audio support is sorted. `listeningPerDay` stays as a limit; no listening content is tiered here.
- Free SRS at 5 new cards/day is an **assumption**, not a stated decision — the product owner specified "5" for daily practice and did not rule on spaced repetition. It is one integer in one file; change it there.

## Review Focus

Five things the decision implies that no task's happy path exercises. Each has a test, placed in the task that owns the code.

- **With billing off, every gate must answer yes — including limit dimensions added after this plan.** The whole safety property of this groundwork. A new boolean on `PlanLimits` that forgets the flag check silently locks today's learners out. *Task 3: the test loops over every boolean limit rather than naming them.*
- **A content item with a missing or unrecognised `tier` must fail the validator, not default to free.** Fail closed: a new lesson added later with no `tier` must break the build, because the alternative is giving Plus content away silently. *Task 4.*
- **`formatPrice(499)` under fi-FI puts a non-breaking space (U+00A0) before the €.** A test asserting `'4,99 €'` with an ordinary space fails for reasons that take an hour to find. *Task 3, written with the escape explicit.*
- **`remainingToday` with `usedToday` above the limit must return 0, never a negative.** A learner who answered 7 questions on a 5 allowance must see "none left", not "-2". *Task 3.*
- **An unrecognised stored plan id must fall back to `free`, not crash and not grant Plus.** `limitsFor` is reached with whatever a future server or a tampered cache hands it. *Task 3.*

---

## File Structure

| File | Responsibility |
| --- | --- |
| `src/services/billing/flag.ts` | **Create.** The master switch, read at call time. Nothing else. |
| `src/services/billing/flag.test.ts` | **Create.** Proves the switch defaults off and can be stubbed. |
| `src/types/index.ts` | **Modify.** `ContentTier`; `tier` on `GrammarLesson` and `RolePlay`. |
| `src/data/reading.ts` | **Modify.** `tier` on `ReadingText` and on all 3 passages. |
| `src/data/grammar/a1-core.ts`, `a1-cases.ts`, `a2.ts`, `b1.ts`, `lm.ts` | **Modify.** `tier` on all 29 lessons. |
| `src/data/situations/scenes.ts` | **Modify.** `tier` on all 5 scenes. |
| `src/services/billing/tiers.test.ts` | **Create.** Pins the content split to the decision. |
| `src/services/billing/plans.ts` | **Modify.** `PlanLimits`, `PLANS`, `limitsFor`, `formatPrice`. Count caps removed, new dimensions added, 499. |
| `src/services/billing/plans.test.ts` | **Create.** |
| `src/services/billing/entitlement.ts` | **Modify.** `canReach`, `reachable`, `canUse` keyed off `PlanLimits`, `remainingToday`. |
| `src/services/billing/entitlement.test.ts` | **Create.** |
| `scripts/validate-data.mjs` | **Modify.** Every lesson, scene and passage carries a recognised `tier`. |
| `docs/subscription-plan.md` | **Modify.** The decision, replacing the superseded 5,50 € table. |
| `README.md` | **Modify.** Stale content counts, and the stale "no import button" limitation. |

`flag.ts` is a separate file rather than a const in `plans.ts` so that `plans.ts` and `entitlement.ts` both import the same call-time reader, and so the one piece with an environment dependency is isolated and separately testable.

`plans.ts` and `entitlement.ts` change in one task (Task 3) rather than two. The rename and the removed limit keys break `entitlement.ts` the moment `plans.ts` changes, so splitting them would hand over a tree that does not compile — and a reviewer could not approve one while rejecting the other.

---

### Task 1: The master switch, made testable

The first task on purpose: it proves `vi.stubEnv` reaches `import.meta.env` in this setup. Every later test of a gate depends on that, and finding out here costs minutes instead of a rewrite at Task 3.

**Files:**
- Create: `src/services/billing/flag.ts`
- Create: `src/services/billing/flag.test.ts`
- Modify: `.env.example`

**Interfaces:**
- Consumes: nothing.
- Produces: `billingEnabled(): boolean` — true only when `import.meta.env.VITE_BILLING_ENABLED === 'true'`. Read at call time, never cached at module load.

- [ ] **Step 1: Write the failing test**

```ts
// src/services/billing/flag.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { billingEnabled } from './flag';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('billingEnabled', () => {
  it('is off when the variable is unset', () => {
    vi.stubEnv('VITE_BILLING_ENABLED', '');
    expect(billingEnabled()).toBe(false);
  });

  it('is on only for the exact string "true"', () => {
    vi.stubEnv('VITE_BILLING_ENABLED', 'true');
    expect(billingEnabled()).toBe(true);
  });

  it('is off for anything else, including "1" and "TRUE"', () => {
    vi.stubEnv('VITE_BILLING_ENABLED', '1');
    expect(billingEnabled()).toBe(false);
    vi.stubEnv('VITE_BILLING_ENABLED', 'TRUE');
    expect(billingEnabled()).toBe(false);
  });

  it('is read at call time, not captured at import', () => {
    vi.stubEnv('VITE_BILLING_ENABLED', '');
    expect(billingEnabled()).toBe(false);
    vi.stubEnv('VITE_BILLING_ENABLED', 'true');
    expect(billingEnabled()).toBe(true);
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npx vitest run src/services/billing/flag.test.ts`
Expected: FAIL — cannot resolve `./flag`.

- [ ] **Step 3: Implement `billingEnabled(): boolean` in `src/services/billing/flag.ts`**

A single exported function returning the strict `=== 'true'` comparison. The module must hold no top-level const derived from the variable — the last test exists to catch exactly that. Add `VITE_BILLING_ENABLED=` with a comment to `.env.example`, saying that anything but `true` is off and that turning it on requires the checklist in `docs/subscription-plan.md`.

- [ ] **Step 4: Run the tests and make sure they pass**

Run: `npx vitest run src/services/billing/flag.test.ts`
Expected: PASS, 4 tests.

If `vi.stubEnv` does not affect `import.meta.env` here, stop and report it rather than working around it — the whole plan's test strategy rests on this step, and the fallback (a `setBillingEnabledForTests` hatch) is a design decision, not an implementation detail.

- [ ] **Step 5: Commit**

```bash
git add src/services/billing/flag.ts src/services/billing/flag.test.ts .env.example
git commit -m "Make the billing switch an environment flag, read at call time"
```

---

### Task 2: Mark every content item with its tier

Before the billing module, because `canReach` in Task 3 takes a `ContentTier` and cannot be written until the type exists.

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/data/reading.ts`
- Modify: `src/data/grammar/a1-core.ts`, `a1-cases.ts`, `a2.ts`, `b1.ts`, `lm.ts`
- Modify: `src/data/situations/scenes.ts`
- Test: `src/services/billing/tiers.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks — this is the data layer.
- Produces: `type ContentTier = 'free' | 'plus'`, exported from `src/types/index.ts`; a **required** `tier: ContentTier` on `GrammarLesson`, on `RolePlay`, and on `ReadingText` (which is declared locally in `src/data/reading.ts:10` and must import the type).

Required, not optional with a default: an optional field means a lesson added next year is silently free. The compiler refusing to build is the point.

The decided assignment, exhaustively:

| Content | `tier: 'free'` | `tier: 'plus'` |
| --- | --- | --- |
| Grammar lessons | the 10 with `moduleId: 'm-basic'`: `g-vokaaliharmonia`, `g-verbityypit`, `g-preesens`, `g-kielto`, `g-partitiivi`, `g-genetiivi`, `g-inessiivi`, `g-elatiivi`, `g-adessiivi`, `g-pronominit` | the other 19 |
| Reading passages | `r-terveysasema` | `r-tyovuoro`, `r-kela` |
| Role-play scenes | `s-kauppa`, `s-tie` | `s-terveyskeskus`, `s-asunto`, `s-esimies` |

Words and phrases get no `tier`: the dictionary, search and all 112 phrases are free in full.

- [ ] **Step 1: Write the failing test**

```ts
// src/services/billing/tiers.test.ts
import { describe, expect, it } from 'vitest';
import { GRAMMAR_LESSONS } from '@/data/grammar';
import { SCENES } from '@/data/situations';
import { READING_TEXTS } from '@/data/reading';

describe('the content tier split matches the decision', () => {
  it('leaves the ten m-basic grammar lessons free and the rest Plus', () => {
    const free = GRAMMAR_LESSONS.filter((l) => l.tier === 'free').map((l) => l.id);
    expect(free).toHaveLength(10);
    expect([...free].sort()).toEqual(
      [
        'g-adessiivi', 'g-elatiivi', 'g-genetiivi', 'g-inessiivi', 'g-kielto',
        'g-partitiivi', 'g-preesens', 'g-pronominit', 'g-verbityypit',
        'g-vokaaliharmonia',
      ].sort(),
    );
    expect(GRAMMAR_LESSONS.filter((l) => l.tier === 'plus')).toHaveLength(19);
    // The free set is exactly the basic module, which is the rule a future
    // lesson should be judged by.
    for (const lesson of GRAMMAR_LESSONS) {
      expect(lesson.tier === 'free', lesson.id).toBe(lesson.moduleId === 'm-basic');
    }
  });

  it('leaves one reading passage and two scenes free', () => {
    expect(READING_TEXTS.filter((t) => t.tier === 'free').map((t) => t.id)).toEqual([
      'r-terveysasema',
    ]);
    expect(SCENES.filter((s) => s.tier === 'free').map((s) => s.id).sort()).toEqual([
      's-kauppa', 's-tie',
    ]);
  });

  it('gives every item a recognised tier', () => {
    const items = [...GRAMMAR_LESSONS, ...SCENES, ...READING_TEXTS];
    expect(items).toHaveLength(37);
    for (const item of items) {
      expect(['free', 'plus'], item.id).toContain(item.tier);
    }
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npx vitest run src/services/billing/tiers.test.ts`
Expected: FAIL — `tier` does not exist on these types.

- [ ] **Step 3: Add `ContentTier` and the `tier` field, then tag all 37 items**

Add the type and the three field declarations first; `npm run typecheck` then lists every object still missing it, which is the work list. Tag them per the table above. A one-line comment on the type declaration should say what `free` means — *also included in the free tier*, since Plus has everything — because "free" on a field called `tier` otherwise reads as "not in Plus".

- [ ] **Step 4: Run the tests and the type check**

Run: `npx vitest run src/services/billing/tiers.test.ts && npm run typecheck && npm run validate`
Expected: tests PASS, typecheck clean, both validators still clean.

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/data/reading.ts src/data/grammar src/data/situations/scenes.ts src/services/billing/tiers.test.ts
git commit -m "Mark every lesson, scene and passage with its tier"
```

---

### Task 3: The decided tiers, the price, and the entitlement questions

`plans.ts` and `entitlement.ts` in one task: the rename and the removed keys break the second file the moment the first changes.

**Files:**
- Modify: `src/services/billing/plans.ts`
- Modify: `src/services/billing/entitlement.ts`
- Create: `src/services/billing/plans.test.ts`
- Create: `src/services/billing/entitlement.test.ts`

**Interfaces:**
- Consumes: `billingEnabled()` (Task 1); `ContentTier` (Task 2).
- Produces, from `plans.ts`:
  - `type PlanId = 'free' | 'plus'` — note `'plus'`, replacing `'full'`, to match the product name *Oma Suomi Plus*.
  - `interface PlanLimits` with exactly these members: `exercisesPerDay: number | null`, `newCardsPerDay: number | null`, `listeningPerDay: number | null`, `plusContent: boolean`, `srs: boolean`, `grammarCards: boolean`, `mistakeScheduling: boolean`, `studyPlan: boolean`, `statistics: boolean`, `favourites: boolean`, `mistakes: boolean`, `speech: boolean`. `null` means no limit.
  - `interface Plan { id: PlanId; name: string; priceCents: number; summary: string; limits: PlanLimits }`
  - `PLANS: Record<PlanId, Plan>`, `UNLIMITED: PlanLimits`
  - `limitsFor(plan: PlanId | null | string): PlanLimits`
  - `formatPrice(cents: number, locale?: string): string`

  Free limits: `exercisesPerDay: 5`, `newCardsPerDay: 5`, `listeningPerDay: 10`, `plusContent: false`, `srs: true`, `grammarCards: false`, `mistakeScheduling: false`, `studyPlan: false`, `statistics: false`, `favourites: true`, `mistakes: true`, `speech: true`. Plus: every number `null`, every boolean `true`, `priceCents: 499`, `name: 'Oma Suomi Plus'`.

- Produces, from `entitlement.ts`:
  - `interface Entitlement { plan: PlanId; limits: PlanLimits; renewsAt: string | null; inGrace: boolean }`
  - `OPEN_ENTITLEMENT: Entitlement` — everything open; `plan` becomes `'plus'`.
  - `canReach(e: Entitlement, tier: ContentTier): boolean` — true for `'free'` always; for `'plus'` only when `e.limits.plusContent`.
  - `reachable<T extends { tier: ContentTier }>(items: T[], e: Entitlement): T[]` — the generic filter every screen will use, so no screen writes its own.
  - `canUse(e: Entitlement, feature: BooleanFeature): boolean`, where `BooleanFeature` is derived from `PlanLimits` by a mapped type, not written out as a literal union — adding a boolean limit must extend `canUse` automatically rather than leaving it unaskable.
  - `remainingToday(usedToday: number, limit: number | null): number` — `Infinity` when unlimited, never negative.
  - `loadEntitlement(): Promise<Entitlement>` — stays deliberately unimplemented.

  `withinLimit` is **deleted**: nothing will call it once content is tiered rather than counted, and a count-based gate sitting next to a tier-based one invites a screen to use the wrong one.

- [ ] **Step 1: Write the failing tests**

```ts
// src/services/billing/plans.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PLANS, UNLIMITED, formatPrice, limitsFor } from './plans';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('the decided plans', () => {
  it('prices Plus at 499 cents, as an integer', () => {
    expect(PLANS.plus.priceCents).toBe(499);
    expect(Number.isInteger(PLANS.plus.priceCents)).toBe(true);
  });

  it('formats the price the way Finland writes it, with a non-breaking space', () => {
    // Intl puts U+00A0 before the symbol. Asserting a plain space fails here.
    expect(formatPrice(499)).toBe('4,99 €');
  });

  it('caps free daily practice at 5 and leaves Plus uncapped', () => {
    expect(PLANS.free.limits.exercisesPerDay).toBe(5);
    expect(PLANS.plus.limits.exercisesPerDay).toBeNull();
  });

  it('gives free spaced repetition but not grammar cards or mistake scheduling', () => {
    expect(PLANS.free.limits.srs).toBe(true);
    expect(PLANS.free.limits.newCardsPerDay).toBe(5);
    expect(PLANS.free.limits.grammarCards).toBe(false);
    expect(PLANS.free.limits.mistakeScheduling).toBe(false);
  });

  it('keeps the study plan and statistics for Plus', () => {
    expect(PLANS.free.limits.studyPlan).toBe(false);
    expect(PLANS.free.limits.statistics).toBe(false);
    expect(PLANS.plus.limits.studyPlan).toBe(true);
    expect(PLANS.plus.limits.statistics).toBe(true);
  });

  it('leaves every Plus limit open', () => {
    for (const [key, value] of Object.entries(PLANS.plus.limits)) {
      expect(value === null || value === true, `${key} is not open`).toBe(true);
    }
  });
});

describe('limitsFor', () => {
  it('opens everything while billing is off, whatever plan is passed', () => {
    vi.stubEnv('VITE_BILLING_ENABLED', '');
    expect(limitsFor('free')).toEqual(UNLIMITED);
    expect(limitsFor(null)).toEqual(UNLIMITED);
  });

  it('applies the free limits once billing is on', () => {
    vi.stubEnv('VITE_BILLING_ENABLED', 'true');
    expect(limitsFor('free').exercisesPerDay).toBe(5);
    expect(limitsFor('plus').exercisesPerDay).toBeNull();
  });

  it('falls back to free for a missing or unrecognised plan id', () => {
    vi.stubEnv('VITE_BILLING_ENABLED', 'true');
    expect(limitsFor(null)).toEqual(PLANS.free.limits);
    expect(limitsFor('enterprise')).toEqual(PLANS.free.limits);
  });
});
```

```ts
// src/services/billing/entitlement.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PLANS } from './plans';
import { canReach, canUse, reachable, remainingToday } from './entitlement';
import type { Entitlement } from './entitlement';

const freeEntitlement: Entitlement = {
  plan: 'free',
  limits: PLANS.free.limits,
  renewsAt: null,
  inGrace: false,
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('with billing off', () => {
  it('answers yes to everything, even on a free entitlement', () => {
    vi.stubEnv('VITE_BILLING_ENABLED', '');
    expect(canReach(freeEntitlement, 'plus')).toBe(true);
    expect(remainingToday(99, 5)).toBe(Infinity);
  });

  // Loops rather than naming features, so a boolean limit added later is
  // covered the day it appears.
  it('answers yes for every boolean limit there is', () => {
    vi.stubEnv('VITE_BILLING_ENABLED', '');
    const booleans = Object.entries(PLANS.free.limits)
      .filter(([, v]) => typeof v === 'boolean')
      .map(([k]) => k) as Parameters<typeof canUse>[1][];
    expect(booleans.length).toBeGreaterThan(5);
    for (const feature of booleans) {
      expect(canUse(freeEntitlement, feature), feature).toBe(true);
    }
  });
});

describe('with billing on', () => {
  it('lets free reach free content and not Plus content', () => {
    vi.stubEnv('VITE_BILLING_ENABLED', 'true');
    expect(canReach(freeEntitlement, 'free')).toBe(true);
    expect(canReach(freeEntitlement, 'plus')).toBe(false);
  });

  it('filters a list down to what is reachable, keeping order', () => {
    vi.stubEnv('VITE_BILLING_ENABLED', 'true');
    const items = [
      { id: 'a', tier: 'free' as const },
      { id: 'b', tier: 'plus' as const },
      { id: 'c', tier: 'free' as const },
    ];
    expect(reachable(items, freeEntitlement).map((i) => i.id)).toEqual(['a', 'c']);
  });

  it('counts a daily allowance down and stops at zero', () => {
    vi.stubEnv('VITE_BILLING_ENABLED', 'true');
    expect(remainingToday(0, 5)).toBe(5);
    expect(remainingToday(5, 5)).toBe(0);
    expect(remainingToday(7, 5)).toBe(0);
    expect(remainingToday(3, null)).toBe(Infinity);
  });

  it('withholds the Plus-only features from free', () => {
    vi.stubEnv('VITE_BILLING_ENABLED', 'true');
    expect(canUse(freeEntitlement, 'srs')).toBe(true);
    expect(canUse(freeEntitlement, 'grammarCards')).toBe(false);
    expect(canUse(freeEntitlement, 'mistakeScheduling')).toBe(false);
    expect(canUse(freeEntitlement, 'studyPlan')).toBe(false);
  });
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npx vitest run src/services/billing/plans.test.ts src/services/billing/entitlement.test.ts`
Expected: FAIL — `PLANS.plus` is undefined, and `canReach` is not exported.

- [ ] **Step 3: Rewrite `plans.ts`**

Replace `BILLING_ENABLED` with the `billingEnabled()` import. Rename `full` to `plus` throughout. Replace `PlanLimits` with the twelve members above, deleting `lessons`, `words`, `situations` and `readingTexts`; the file header must say the tier field replaced them, because a future reader will otherwise re-add a count cap. `limitsFor` widens to accept `string` so an unrecognised id from a server or a stale cache lands on free rather than `undefined`.

Keep the file's existing explanatory header and update it: the switch is now an environment variable, the price is 499, and the free tier is a deliberate 5-a-day.

- [ ] **Step 4: Rewrite `entitlement.ts`**

Swap `BILLING_ENABLED` for `billingEnabled()` at every guard. `OPEN_ENTITLEMENT.plan` becomes `'plus'`. Delete `withinLimit`. Add `canReach` and `reachable`. Derive `BooleanFeature` with a mapped type over `PlanLimits`.

Keep the file's framing comment: this is the one place the rest of the app asks "is this allowed?", so the gates go in through one function with one rule rather than as scattered checks that each get an edge case slightly wrong.

- [ ] **Step 5: Run everything**

Run: `npx vitest run && npm run typecheck && npm run validate && npm run build`
Expected: all tests PASS (14 existing + the new ones), typecheck clean, validators clean, build clean.

- [ ] **Step 6: Commit**

```bash
git add src/services/billing
git commit -m "Record the Free and Plus tiers at 4,99 EUR, and ask entitlement by tier"
```

---

### Task 4: Make the validator refuse an untagged item

**Files:**
- Modify: `scripts/validate-data.mjs`

**Interfaces:**
- Consumes: the `tier` field from Task 2.
- Produces: a validator that exits non-zero when a lesson, scene or passage has no recognised `tier`, and which prints the free/Plus counts on success.

The script parses the data files as text, so the check is a count comparison, not a parse: in each grammar file, `src/data/situations/scenes.ts` and `src/data/reading.ts`, the number of `tier: '(free|plus)'` matches must equal the number of top-level ids that file declares. The existing `collectIds` helper already matches at 2–4 spaces of indent, which catches lesson, scene and passage ids but not the exercise ids nested inside them — reuse it rather than writing a second matcher.

- [ ] **Step 1: Confirm the gap, by breaking the data on purpose**

There is no test harness for the `.mjs` scripts, so this is verified by hand.

Run: `node scripts/validate-data.mjs` → note it passes.
Delete the `tier` line from one lesson in `src/data/grammar/b1.ts`. Run it again.
Expected: it **still passes**. That is the gap this task closes. Leave the line out for Step 3.

- [ ] **Step 2: Add the check**

Count `tier: '(free|plus)'` per file and compare with `collectIds(src).length`. On a mismatch, push a problem naming the file, the id count and the tier count. A value that is neither `free` nor `plus` does not match the pattern, so it reports as a shortfall rather than passing — that is the fail-closed behaviour the Review Focus asks for. On success, print the totals in the script's existing style, e.g. `tiers: 11 free, 26 plus (37 items)`.

- [ ] **Step 3: Verify both directions**

Run: `node scripts/validate-data.mjs` with the `tier` line still missing
Expected: non-zero exit, naming `b1.ts` and the mismatch.

Restore the line. Run: `npm run validate`
Expected: both validators clean, and the tier totals printed.

- [ ] **Step 4: Commit**

```bash
git add scripts/validate-data.mjs
git commit -m "Fail the content check when an item carries no tier"
```

---

### Task 5: Record the decision, and correct the stale docs

**Files:**
- Modify: `docs/subscription-plan.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: the decided values from Tasks 2 and 3.
- Produces: no code. The canonical written record, so the code and the document cannot disagree.

- [ ] **Step 1: Replace the plans table in `docs/subscription-plan.md`**

The current table states 5,50 €, 8 of 29 lessons, 300 words and no free spaced repetition. All four are superseded. Replace it with the decided split from Global Constraints, and state:

- the dictionary and all phrases are free in full, and **why** — a part-locked dictionary is a broken dictionary, and it is the feature that earns discovery;
- content access is decided by the per-item `tier` field, daily allowances by the counters, and the two must not be mixed;
- free daily practice is 5, chosen deliberately to give a reason to upgrade — and record the open risk against it, that 5 questions a day may be too little for a free learner to build the habit that leads to a subscription, which is the thing to watch once analytics exist;
- the 5 free new cards a day is an assumption, not a decision, and where to change it;
- the gate this plan does **not** close: Plus content is still in the bundle, so until it is served from a server to an entitled account, any gate built on `tier` decides only what is drawn.

Keep the document's existing "Before `BILLING_ENABLED` becomes true" checklist, rename its first line to `VITE_BILLING_ENABLED`, and add the two items the audit found missing: a published privacy policy and terms, and the EU 14-day withdrawal-right consent captured at checkout.

- [ ] **Step 2: Correct the stale numbers in `README.md`**

Verified current figures: **1 256** word ids (not 822); **991** `source-verified`, **252** `linguistically-checked`, **0** `supplementary`, **4** `needs-review` (not 726/85/10/1); **29** lessons of which **24** are `source-derived` (not "19 of the 24"); **256** exercises (not 203). Remove Known Limitation 7's claim that there is no import button — `restoreBackup()` exists in `src/services/storage/backup.ts` and is wired into both Settings and the Welcome screen. Leave every other limitation: they are all still true.

- [ ] **Step 3: Check the documents against the code**

Run: `npm run validate && npx vitest run`
Then read `docs/subscription-plan.md` beside `src/services/billing/plans.ts` and confirm every number matches: 499, 5, 5, 10, and the 10 / 1 / 2 free content counts.
Expected: no disagreement between the document and the code.

- [ ] **Step 4: Commit**

```bash
git add docs/subscription-plan.md README.md
git commit -m "Record the Free and Plus decision, and correct the stale counts"
```

---

## Out of scope, by design

Named here so no task drifts into them, and so the next plan has a starting point:

- **No screen reads any of this.** No gate, no upgrade prompt, no lock icon. Billing stays off and the app behaves exactly as it does today. The gates are their own plan, and they are last.
- **No accounts, no server, no payment.** A `tier` field decides what to *draw* once something reads it; it does not protect anything, because the content is still in the bundle. Until Plus content is served from a server to an entitled account, a gate built on this is cosmetic.
- **No new content.** Not an exercise, not a scene, not a passage, not a lesson.
- **No study plan and no statistics.** Task 3 names the two limits; building the features is the next plan.
- **No listening work.** Deferred by the decision until Finnish audio support is sorted.
- **The three confirmed defects** in the audit — Listening's repeated redraw, `WordPractice`'s fixed distractors, and the stale README counts beyond those Task 5 fixes — are not touched here.

---

© 2026 MarkDev. All rights reserved.
