# Subscriptions: what has to be true before this can be switched on

Status: **groundwork only. Nothing is enabled and nothing is visible on the
live site.** `BILLING_ENABLED` in `src/services/billing/plans.ts` is `false`,
no screen reads it, and no upgrade prompt exists.

This document is the thing that saves the pain later. It records the decisions
and, more importantly, the one problem that has to be solved before any
payment code is worth writing.

---

## The problem to solve first

**Today a paywall would not hold.** Three facts, all verified:

1. There are no accounts. A learner is a first and last name in
   `localStorage`. Anyone can edit it or clear it.
2. There is no server. The app is a static bundle on Vercel; there is no
   `api/` folder and nothing runs anywhere except the browser.
3. **Every word, lesson and exercise is already inside the JavaScript file.**
   The bundle is 1.3 MB and contains the whole course. Checked by searching
   the deployed bundle for content from the newest lessons - all of it is
   there, served to everyone who loads the page.

So a check like `if (plan === 'full')` only decides what to *draw*. The
content has already been handed over. Anyone who opens the developer tools,
or who sets a flag in `localStorage`, has the paid product.

That is fine for a free app. It is not a thing to charge 5,50 € a month for.

**What that means in practice:** gating the UI is the last step, not the
first. The order has to be accounts, then content on the server, then
payment, then the gates.

---

## The order of work

### 1. Accounts (Supabase Auth)

The project already has Supabase and the email provider is enabled - sign-ups
are currently *open to anyone holding the public key*, which is a problem in
its own right and is written up in `docs/security-review.md`. Turn sign-ups
off now, and turn them back on as part of this step with rate limiting and a
CAPTCHA.

Accounts also fix something the roster cannot: today a learner is identified
by name, and the unique index makes two people with the same name one row.
A deletion request cannot be honoured reliably against that. An account id
can.

Migration for existing learners: the local profile becomes the pre-filled
name on a sign-up form. Their progress is in IndexedDB on the device and
should be uploaded on first sign-in, not thrown away.

#### How it goes in without breaking the app

The one rule that matters: **the app must keep working signed out, offline,
exactly as it does today.** Auth is an addition, never a precondition. The
boot path right now touches no network at all - `loadProfile()` is a
synchronous localStorage read, the Gate decides from local state, and
`registerSW` and `flushRoster` are both fire-and-forget. A learner on the
metro opens the app and it works. That property is worth more than any
feature on this page, and a careless auth integration is exactly what
destroys it.

So the shape is:

- `session` is extra state alongside `profile`, not a replacement for it.
  The Gate keeps asking "is there a profile?", never "is there a session?".
- Supabase's client reads a persisted session out of localStorage, so a
  signed-in learner is known without a round trip. Token refresh happens in
  the background and is allowed to fail; failing it means no sync this
  session, not a locked app.
- Nothing awaits the network before the first render.

One piece of luck makes this far cheaper than it might have been: **no local
data is keyed to the learner's identity.** There is no `userId` anywhere in
the codebase. SRS cards are keyed `${kind}:${refId}`, mistakes by their own
id, activity by date, lesson progress by `grammarId`. So signing in does not
re-key anything - it attaches an owner to data that already exists. Signing
in merges local data upward; it never replaces local data with the server's.

#### Cloud backup, and what it costs

Backups are the first thing accounts make possible, and the storage question
has been measured rather than guessed:

| | Raw JSON | Gzipped |
| --- | --- | --- |
| Typical learner (6 months, 300 cards) | 82.6 KB | **3.4 KB** |
| Ceiling (all 1256 words, 2 years, 400 mistakes) | 437 KB | **15.1 KB** |

Compression is 24-29x because the records repeat the same field names and
similar values, and `CompressionStream` is available in the browser, so the
compression happens before anything leaves the device.

Against the Supabase free plan - 500 MB database, 1 GB file storage, 5 GB
egress, projects paused after 1 week idle:

| Stored as | Fits in 500 MB |
| --- | --- |
| Raw JSON | ~6,200 learners |
| Gzipped | ~151,000 learners |

**Storage is not the constraint and should not drive the design.** Uploads
do not count against egress, only reads, and a backup is written often and
read rarely - the favourable direction. At one sync a day, gzipped, the 5 GB
egress covers roughly 51,000 learners.

What does constrain it:

- **A readable table is a leak unless RLS is right.** The `learners` table is
  deliberately insert-only, and `docs/roster-setup.md` says in as many words
  not to add a select policy, because the anon key ships inside the JS
  bundle. A backups table has to be readable, so it needs `select` granted on
  that table alone and a policy of `using (auth.uid() = user_id)`. Test it by
  signing in as one account and trying to read another's row with the public
  key; that test is the whole point and must be run before launch.
- **The free plan pauses after a week idle.** For a backup specifically this
  is poor timing: the restore fails exactly when someone reaches for it after
  a break. Another reason the app must not require the server to function.
- **Do not let the service worker cache API responses.** The workbox config
  precaches static assets only (`js,css,html,svg,png,woff2`). Adding runtime
  caching of authenticated requests would put one learner's data where
  another on the same device could read it.

#### What could break, and how likely

| Risk | Severity | Avoided by |
| --- | --- | --- |
| Offline use stops working | **High** | Never await the network before first render; Gate reads local state only |
| Existing learners locked out of their own progress | **High** | Local profile keeps working; account is an upgrade, and sign-in merges up |
| A wrong RLS policy exposes every backup | **High** | Grant `select` on the backups table only; policy on `auth.uid()`; test cross-account reads |
| Open sign-ups abused | Medium | Already a finding in `docs/security-review.md`; turn off now, re-enable with rate limiting and CAPTCHA |
| Project paused on the free plan | Medium | App works without the server; sync retries later |
| Two devices overwrite each other | Medium | Backups carry `exportedAt`; last-writer-wins is acceptable for a backup, not for live sync - do not call it sync until it merges |
| Client-side paywall bypassed | Certain, if attempted | Unchanged: the course is in the bundle, so gating is cosmetic until step 2 is done |

None of these is a reason not to do accounts. They are the reasons to do
accounts *first and on their own*, with nothing gated, and to leave
`BILLING_ENABLED` false until steps 2 and 3 are real.

### 2. Content off the device

Free content stays in the bundle. Paid content has to be fetched after the
server has checked entitlement - a Supabase table with row-level security, or
an edge function. There is no way around this: whatever ships in the bundle
is public.

This is the biggest piece of work and the one that decides whether the whole
idea is worth it. An estimate is needed before committing, not after.

### 3. Payment

**Use a Merchant of Record, not raw Stripe.** Selling a subscription to
consumers across the EU means charging each country's VAT rate and filing
through OSS. Stripe will take the money and leave that to you. Paddle or
Lemon Squeezy become the seller of record and handle VAT, invoices and
refunds. At one developer and a few hundred euro a month, the fee is far
cheaper than doing EU VAT returns.

Whichever is chosen:

- The entitlement row is written **only** by the provider's webhook, using
  the service role key, server-side. The browser must never be able to write
  it. A client-writable subscription row is the same as no subscription.
- The webhook must verify the provider's signature, and must be idempotent -
  they retry.
- Handle the states that actually happen: trialing, active, past_due,
  cancelled-but-paid-until, refunded, chargeback.

`Permissions-Policy` in `vercel.json` currently contains `payment=()`, which
blocks the Payment Request API. It has to change on the day checkout goes in.
`connect-src` in the CSP will need the provider's domain too.

### 4. The gates

Only now. `src/services/billing/entitlement.ts` has the single function the
app should ask, so the checks do not get scattered.

---

## The plans as currently decided

In `src/services/billing/plans.ts`, so the code and this document cannot
disagree.

| | Free | Full access - 5,50 € / month |
| --- | --- | --- |
| Grammar lessons | first 8 of 29 | all |
| Dictionary | 300 words | all 1122 |
| Practice | 20 questions a day | unlimited |
| Situations | 1 scene | all |
| Reading | 1 text | all |
| Listening | 10 a day | unlimited |
| Favourites, My Mistakes, speech | yes | yes |
| Spaced repetition | no | yes |

Reasoning: the free tier is a usable app for a couple of weeks, not a demo
that stops on day one. Someone has to be able to find out whether this suits
them. Spaced repetition is the paid feature that matters most, because it is
what makes the difference over months rather than days.

5,50 € sits in the middle of the 5-6 € range and reads as a price rather than
a rounded guess. It is stored as `550` cents - money never touches a float.

---

## Before `BILLING_ENABLED` becomes true

- [ ] Supabase sign-ups turned off now; turned back on with rate limits and
      CAPTCHA as part of step 1
- [ ] Accounts working, with existing local progress migrated on first sign-in
- [ ] Paid content served from the server, not the bundle
- [ ] Merchant of Record chosen and VAT handling confirmed
- [ ] Webhook writing entitlement server-side, signature verified, idempotent
- [ ] `payment=()` removed from `Permissions-Policy`, provider added to CSP
- [ ] Privacy page published, and a route for deletion requests
- [ ] Terms, refund and cancellation policy written
- [ ] Decide what happens to a lapsed subscriber's saved words and progress -
      locked, or readable but frozen. Deleting it is not an option.

Until every box is ticked, leaving the flag false costs nothing. Turning it on
early costs refunds and trust.
