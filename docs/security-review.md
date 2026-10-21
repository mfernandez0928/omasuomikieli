# Security and privacy review

Date: 2026-10-21
Reviewed: the live site at omasuomikieli.vercel.app, the deployed bundle, the
Supabase project as reachable from outside, the git history, and the client
code.

Everything below was tested, not assumed. Where something was not tested, it
says so.

---

## What is good

**No secrets in the repository or in its history.** `.env` has never been
committed and is covered by `.gitignore` (`.env`, `.env.*`, with
`!.env.example`). A scan of every commit for JWT-shaped strings,
`service_role`, `sk_live` and inline passwords returns only the lines in
`docs/roster-setup.md` that tell the reader *not* to use the service_role key.

**The anon key cannot read anything.** It is in the bundle by design - that is
how Supabase works - so the real question is what it can do. Tested from the
live origin:

| Probe | Result |
| --- | --- |
| `GET /rest/v1/learners?select=id` | `401 permission denied for table learners` |
| `GET /rest/v1/` (schema) | `401` - cannot even enumerate tables |
| `GET /storage/v1/bucket` | `200`, empty - no buckets exist |

The insert-only grant plus the row-level policy is doing its job. Nobody
holding the key can read the roster, list the tables, or find other tables.

**Security headers are correct and actually served.** Verified against the
live response, not just `vercel.json`: a real CSP (`script-src 'self'`, no
`unsafe-eval`, no `unsafe-inline` for scripts), `X-Content-Type-Options`,
`X-Frame-Options: DENY`, `frame-ancestors 'none'`, HSTS for a year,
`Referrer-Policy`, `Permissions-Policy` denying camera/mic/geolocation, and
both Cross-Origin-Opener-Policy and Cross-Origin-Resource-Policy.

**The app sends almost nothing.** Instrumented `fetch`, `XMLHttpRequest` and
`sendBeacon` on the live site, entered a name, then visited Vocabulary,
Grammar, Practice, Situations and Settings. Across the whole session there was
exactly **one** outbound request: the roster POST carrying first name, last
name, a locally generated id and a timestamp. No analytics, no telemetry, no
fonts or scripts from anyone else, no cookies at all.

**On-device storage is small and ordinary.** `localStorage` holds the profile,
the roster send-once record and the roster queue; progress is in an IndexedDB
database called `oma-suomi`. Nothing is encrypted, which is correct - it is
the learner's own device and their own study data.

---

## Findings to act on

### 1. Supabase signups are open, and the app does not use auth — HIGH

`GET /auth/v1/settings` reports `disable_signup: false` with the email
provider enabled and `mailer_autoconfirm: false`.

The app has no login and never calls auth. But the anon key is public, so
anyone who reads it out of the bundle can call `/auth/v1/signup` against the
project. Two consequences:

- they can create users in the project at will, and Supabase prices and
  rate-limits on monthly active users;
- because confirmation mail is on, each signup makes the project send an
  email to an address the attacker chooses, which turns the project into a
  small mail relay.

**Fix:** Supabase dashboard -> Authentication -> Providers -> Email, turn
**Enable sign-ups** off. Leave it off until the subscription work actually
needs accounts, then turn it on together with rate limits and CAPTCHA.

This costs nothing today because nothing in the app signs in.

### 2. CSP allows any Supabase project, not just this one — MEDIUM

`connect-src` is `'self' https://*.supabase.co`. If script ever did run on the
page, it could post data to an attacker's own Supabase project and the CSP
would allow it. `script-src 'self'` makes that hard, but the wildcard costs
nothing to remove.

**Fix:** in `vercel.json`, replace `https://*.supabase.co` with the project's
own origin.

### 3. `Access-Control-Allow-Origin: *` on static assets — LOW

Vercel sets this. For a static site with no cookies and no credentialed
requests it grants nothing an attacker could not get by fetching the files
directly, so this is noted rather than a problem. It would matter if the app
later served per-user data from the same origin.

### 4. `Permissions-Policy` currently blocks payments — NOTE, not a fault

`payment=()` is right today and must change the day a checkout is added, or
the Payment Request API will be blocked in the browser. Recorded here so it is
not debugged from scratch later.

### 5. The roster still has no unique index — OPEN

`docs/fix-duplicate-names.sql` has not been run yet. Until it is, duplicate
names keep accumulating. Not a security issue; listed so it is not forgotten.

---

## GDPR position

The app collects a full name from people, some of them in the EU, which makes
the operator a data controller. At this size that means, in practice:

- **Say what is collected.** The first-run screen does, in one sentence.
- **Collect no more than needed.** It sends the name and nothing else.
- **Be able to delete on request.** Today that is a manual row delete in the
  Table Editor. Once there are more than a handful of learners this needs to
  be something that can be done reliably and on request.
- **Keep it in the EU.** The project is in Frankfurt.

Two things to fix before the roster gets much bigger:

1. **There is no privacy page.** One short page becomes necessary once the app
   takes money, and is worth having before that.
2. **A name alone is weak identification for a deletion request.** If two
   learners share a name - and the new unique index makes them one row - you
   cannot tell whose data you are deleting. This is a reason to move to real
   accounts rather than names.

---

## What was not tested

- The Supabase dashboard settings themselves, beyond what the public
  `/auth/v1/settings` endpoint reports.
- Whether RLS is correct on tables other than `learners`; the schema could not
  be enumerated with the anon key, which is the point, but it also means this
  review cannot confirm what else exists.
- Dependency vulnerabilities (`npm audit` was not run as part of this).
- Anything about the Vercel account itself: who can deploy, whether 2FA is on.
