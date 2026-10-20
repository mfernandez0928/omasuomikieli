# Learner roster — Supabase setup

The app asks every learner for a name before it opens. With the two environment
variables below set, that name is posted to a Supabase table so the roster is
visible in one place. Without them the app keeps the name on the device and
sends nothing, and the first-run screen says so.

Only the name, the locally generated id and the time are sent. Progress,
answers and mistakes never leave the device.

## 1. Create the table

Supabase dashboard → **SQL Editor** → paste and run:

```sql
create table public.learners (
  row_id      bigint generated always as identity primary key,
  id          text        not null,
  first_name  text        not null,
  last_name   text        not null,
  created_at  timestamptz not null,
  received_at timestamptz not null default now()
);

-- Keeps a stray or hostile request from writing anything large.
alter table public.learners add constraint learners_sane_lengths check (
  char_length(id) between 8 and 64
  and char_length(first_name) between 1 and 40
  and char_length(last_name) between 1 and 40
);

create index learners_id_idx on public.learners (id);

alter table public.learners enable row level security;

-- The only thing the public key may do is add a row. It cannot read, change
-- or delete one. This matters: the anon key ships inside the JS bundle and
-- anyone can read it out, so without this the whole roster would be public.
create policy "anon may add a learner"
  on public.learners
  for insert
  to anon
  with check (true);
```

Do **not** add a `select` policy. Read the roster from the dashboard's Table
Editor, which uses the service role and bypasses RLS.

## 2. Choose the EU region

When creating the project, pick **Frankfurt (eu-central-1)** or another EU
region. The region cannot be changed afterwards, and keeping EU residents'
names inside the EU is the simplest position to be in under GDPR.

## 3. Get the two values

Dashboard → **Project Settings → API**:

| Value | Where it goes |
| --- | --- |
| Project URL (`https://….supabase.co`) | `VITE_SUPABASE_URL` |
| `anon` `public` key | `VITE_SUPABASE_ANON_KEY` |

Both are public by design — they are compiled into the JS bundle and anyone can
read them out of it. The insert-only RLS policy is what protects the data.

**Never put the `service_role` key here.** It bypasses RLS entirely, and in a
browser bundle it would hand the whole table to anyone who looked.

## 4. Set them

Locally, copy `.env.example` to `.env` and fill both in.

On Vercel: **Project → Settings → Environment Variables**, add both for
Production, then redeploy. Vite reads `VITE_`-prefixed variables at build time,
so a redeploy is required for them to take effect.

## 5. Check it

Open the deployed app in a private window, enter a name, then look at the
`learners` table. One row should appear.

If nothing arrives, the browser console will show a blocked request. The usual
causes are a missing redeploy after setting the variables, or a Content Security
Policy that does not allow the host — `vercel.json` allows
`https://*.supabase.co` under `connect-src`.

## What the learner is told

The first-run screen says, in Tagalog, that the name alone is sent to the
app's maker so they know who is using it, that nothing else leaves the device,
and that it can be changed in Settings or deleted on request. Settings repeats
the shorter version next to the name.

## Obligations that come with this

Collecting a full name from people in the EU makes the operator a data
controller under GDPR. At this scale that means, in practice:

- say what is collected and why — the first-run screen does this;
- collect no more than is needed — the app sends the name and nothing else;
- delete on request — remove the row in the Table Editor; the learner can also
  clear site data to remove their own copy;
- do not pass the list to anyone else.

A public privacy page becomes worth writing once the app takes payment or the
roster grows beyond a small community.
