-- =====================================================================
--  Oma Suomi - clear the duplicate learner names and stop new ones
--
--  Where: Supabase dashboard -> SQL Editor -> New query -> paste -> Run
--  Takes: a second or two. Safe to read first; nothing runs until you Run.
--
--  The app itself is already deployed and no longer posts a name it has
--  already sent. This is the other half: it removes the duplicates that
--  were collected before that, and adds the lock that stops a second
--  phone or a cleared browser from making new ones.
-- =====================================================================


-- ---------------------------------------------------------------------
-- STEP 1 - look before you delete.
--
-- Run this on its own first. It changes nothing. It lists every name
-- that appears more than once, and how many rows it has.
--
-- If it returns no rows, you have no duplicates and you can skip to
-- step 2 to add the lock.
-- ---------------------------------------------------------------------

select first_name,
       last_name,
       count(*)         as rows,
       min(received_at) as first_seen,
       max(received_at) as last_seen
  from public.learners
 group by lower(first_name), lower(last_name), first_name, last_name
having count(*) > 1
 order by rows desc, last_seen desc;


-- ---------------------------------------------------------------------
-- STEP 2 - delete the repeats and add the lock.
--
-- Run these three statements TOGETHER, in one Run. Do not run them one
-- at a time: between the delete and the index there is a moment where a
-- name arriving from someone's phone would put a duplicate straight
-- back, and then the index fails to create.
--
-- The delete keeps the EARLIEST row for each name and removes the rest,
-- so the id and created_at you keep are the ones from whoever typed it
-- first. Matching is on lower(), so "maria santos" and "Maria Santos"
-- count as the same person.
-- ---------------------------------------------------------------------

begin;

delete from public.learners a
 using public.learners b
 where lower(a.first_name) = lower(b.first_name)
   and lower(a.last_name)  = lower(b.last_name)
   and a.row_id > b.row_id;

create unique index if not exists learners_unique_person
    on public.learners (lower(first_name), lower(last_name));

commit;


-- ---------------------------------------------------------------------
-- STEP 3 - check it worked.
--
-- The first query should return 0. The second should list the index.
-- ---------------------------------------------------------------------

select count(*) as duplicate_names_left
  from (
    select 1
      from public.learners
     group by lower(first_name), lower(last_name)
    having count(*) > 1
  ) d;

select indexname
  from pg_indexes
 where tablename = 'learners'
   and indexname = 'learners_unique_person';


-- =====================================================================
--  Worth knowing
--
--  * One row per NAME, not per person. Two different people who share a
--    name will be one row, and the second one is not recorded. For a
--    small group that is the right trade; if you ever need a true head
--    count, the index has to be on id instead, and signature() in
--    src/services/sync/roster.ts has to include e.id again.
--
--  * Because a repeat now answers 409 instead of 201, someone holding
--    the anon key could learn whether a given name is on the roster by
--    posting it and watching the status code. They still cannot read
--    the table or list what is in it.
--
--  * A learner who changes their name in Settings adds a row under the
--    new name. The old one stays, because the app's key is insert-only
--    and cannot update or delete. That is a record of the change, not a
--    duplicate.
--
--  * Undo: this does not keep a copy of the deleted rows. If you want
--    one, run this before step 2 and download the result as CSV from
--    the SQL Editor:
--
--      select * from public.learners order by row_id;
-- =====================================================================
