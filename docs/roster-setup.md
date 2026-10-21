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

-- One row per name. The app already refuses to report a name it has reported
-- before, but that record lives in the browser: it is gone when site data is
-- cleared, it knows nothing about other phones, and it cannot know about a
-- request that reached the table and then lost its answer on a flaky
-- connection. This is the lock that does not depend on the device, and it is
-- what keeps the table the size of the group using the app. The app reads the
-- 409 it causes as "already recorded" and stops, rather than queueing another
-- attempt.
--
-- On `lower()` so "mark santos" cannot sit next to "Mark Santos". The app
-- folds case the same way before deciding whether to send at all.
create unique index learners_unique_person
  on public.learners (lower(first_name), lower(last_name));

create index learners_id_idx on public.learners (id);

alter table public.learners enable row level security;

-- Two locks, not one.
--
-- The grant is the Postgres-level lock: the public role may insert and that is
-- all, so no policy mistake can turn into a readable table. It is needed
-- explicitly because the project was created with "automatically expose new
-- tables" switched off.
grant usage on schema public to anon;
grant insert on table public.learners to anon;

-- The policy is the row-level lock. This matters because the anon key ships
-- inside the JS bundle and anyone can read it out of there.
create policy "anon may add a learner"
  on public.learners
  for insert
  to anon
  with check (true);
```

Do **not** add a `select` policy. Read the roster from the dashboard's Table
Editor, which uses the service role and bypasses RLS.

### If the table already exists

Tables created before the unique index existed will have collected duplicate
rows — the same name more than once. Creating the index fails while they are
still there, so clear them first.

Look before you delete. This lists every name that appears more than once, and
how many rows it has:

```sql
select first_name, last_name, count(*) as rows, min(received_at) as first_seen
  from public.learners
 group by lower(first_name), lower(last_name), first_name, last_name
having count(*) > 1
 order by rows desc;
```

Then run both statements together — the delete and the index belong in one go,
because a name arriving in between would put a duplicate back:

```sql
-- Keeps the earliest row for each name and drops the repeats, matching on
-- lower() so a difference in capitals does not save a duplicate.
delete from public.learners a
  using public.learners b
 where lower(a.first_name) = lower(b.first_name)
   and lower(a.last_name)  = lower(b.last_name)
   and a.row_id > b.row_id;

create unique index learners_unique_person
  on public.learners (lower(first_name), lower(last_name));
```

The row that survives is the first time that name was seen, so `created_at`
and `id` stay those of whoever typed it first.

### What one row per name means

Two different people who share a name are one row on the roster — the second
is not recorded at all, and nothing in the app tells them so. That is the
trade for a table that cannot grow with duplicates, and for a small group it
is usually the right one. A roster that has to count people needs `id` to be
what makes a row unique instead:

```sql
create unique index learners_unique_person on public.learners (id);
```

and `signature()` in `src/services/sync/roster.ts` has to include `e.id`
again, or the app will not even send the second person's name.

One more consequence worth knowing: because a repeat now answers 409 instead
of 201, anyone holding the anon key can learn whether a given name is on the
roster by posting it and watching the status. They still cannot read the table
or list what is in it. For a small community roster that is a fair price for
not storing the same person twice; a roster where membership itself is
sensitive should go behind a function that always answers the same way.

## 2. Settings at creation time

These cannot be changed afterwards, so they are worth getting right once.

| Setting | Value | Why |
| --- | --- | --- |
| Region | **Frankfurt (eu-central-1)** | EU residents' names stay in the EU, which is the simplest GDPR position. Pick it explicitly through "Need a specific region?" rather than leaving the broad "Europe" group. |
| Database password | generate one, then save it | Needed for direct Postgres access later. It is not used by the app. |
| Enable Data API | **on** | The app posts to the REST API. With this off nothing arrives. |
| Automatically expose new tables | **off** | Otherwise every future table is reachable by the public key the moment it is created. The grant above opens this one table deliberately. |
| Enable automatic RLS | **on** | A safety net: any table made later starts locked instead of open. |
| Postgres type | **Postgres**, not OrioleDB | OrioleDB is beta and not meant for production. |

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
`learners` table. One row should appear — exactly one. Reloading the app, or
typing the same name again in Settings, should not add another.

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
