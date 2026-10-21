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
