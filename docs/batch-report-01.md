# Vocabulary batch 1 — report

180 terms submitted. Result: **134 added, 39 already present as headwords,
10 matched an existing word's forms, 0 left unhandled.**

Checked against all 1122 existing headwords plus every stored inflected form,
stem and search alias — 3044 forms in total — not just against the headword
list.

---

## 1. Duplicates — already in the dictionary (39)

Not added. Each already exists as a headword.

**Travel list:** ehtiä, tulla, kiire, kestää, kaveri, hakea, tarvita, varata,
vuokrata, hoitaa, tarkistaa, aikaisin, vielä, takaisin, heti, sitten,
kuitenkin, kevät, kesä, syksy, talvi, myöhässä, lähteä, matka, kaukana,
lähellä, lisäksi

**Environment list:** laittaa, pantti, biojäte, kuulostaa, roska, neuvo,
sekajäte, kierrätys, jäte, sähkö, erityisesti, lopuksi

## 2. Matched an existing word's forms (10)

Not added as headwords, because they are inflected forms of a word the
dictionary already has. Where the form was not yet indexed, it was added as a
search alias so that typing it finds the headword.

| Submitted | Is a form of | Action |
| --- | --- | --- |
| maanantaina | maanantai | already indexed |
| jouluna | joulu | already indexed |
| lähelle, läheltä | lähellä | already indexed |
| **kauas, kaukaa** | kaukana | **alias added**, plus a note explaining the kauas / kaukana / kaukaa trio |
| **jätteet** | jäte | **alias added**, plus the missing partitive and plural forms |
| viikonloppuna, vuonna, kuussa | inside the phrases below | indexed via those entries |

## 3. New entries (134)

In two new files: `src/data/words/batch-travel.ts` (74) and
`src/data/words/batch-environment.ts` (60).

Every one carries Finnish, English, Tagalog, word type, the relevant
forms, an example sentence where it earns one, and cross-links. Verbs carry
`vartalo`, `verbityyppi` and the principal parts. Rections are given only
where the word governs a case: päästä, kelvata, saapua, päätyä, kuluttua,
varten.

Worth singling out:

- **päästä** — entered as the verb (pääsen, "to get to"). The time
  expression *"... päästä"* is a different word and is recorded as an alias
  on **kuluttua** instead, with a note. The submitted list contained päästä
  twice, which is what that duplication was.
- **Spoken vs standard**, kept distinguishable as asked: ratikka ↔
  raitiovaunu, netti ↔ internet, roskis ↔ roskakori, reissu ↔ matka.
  Each spoken entry names its yleiskieli partner in the note, and the example
  sentences are tagged `register: 'puhekieli'`.
- **Time expressions** (viime lauantaina, ensi viikonloppuna, tammikuussa,
  viime/tässä/ensi kuussa, viime/tänä/ensi vuonna) are entered as `fraasi`,
  because that is how they are taught and how they are looked up. Each one
  carries the pattern in its note — weekdays take -na, months -ssa, years -na.
- **banaaninkuoret** and **valot** were submitted as plurals. Entered under
  their perusmuoto, banaaninkuori and valo, with the plural as an alias and a
  note saying the plural is the usual form.
- **loput** is the exception: entered as a plural, because "the rest" is what
  the plural means and the singular loppu is a different word.

## 4. Corrections (2)

Both are the same artefact and both are recorded in the entry's
`correctionNote`.

| Submitted | Entered as | Why |
| --- | --- | --- |
| `y‑mpäristönsuojelu` | ympäristönsuojelu | A soft hyphen (U+00AD) sat inside the word, a line-break artefact from whatever produced the list |
| `y‑mpäristöystävällinen` | ympäristöystävällinen | Same |

These are the only corrections made without the source in hand. A soft hyphen
is never part of a Finnish word and the remaining letters spell exactly one
thing, so there was nothing to decide. No other term was altered.

## 5. Incomplete — needs review (1)

**saapuvat** — `verification: 'needs-review'`.

Entered as the Arrivals heading on an airport or station board, because the
batch lists it between *turvatarkastus* and *passi*. But the same word is the
third person plural of *saapua*, "they arrive", and without the page there is
no way to know which was meant. The entry says so in its `reviewNote` and
links to the verb. One line from the source settles it.

---

## What is missing from all of this: the source

**Every new entry has `source: null`.** Not an oversight — the batch arrived
as a bare word list with no book, chapter or page attached, and the source
PDFs are not in this checkout, so nothing could be located. The project's own
rule is that `SourceRef` has no field that can hold a guess, so an uncited
entry is marked as such rather than given a plausible-looking citation.

The two lists do match two chapters closely:

| List | Almost certainly | On the evidence of |
| --- | --- | --- |
| Travel | **Suomen mestari 2, Kappale 1 "Viikonloppureissu"** (printed p. 10) | The travel theme, and the *Milloin?* time expressions, both of which sources.ts records as that chapter's content |
| Environment | **Suomen mestari 3, Kappale 1 "Säästetään energiaa ja kierrätetään!"** (printed p. 10) | The chapter title is literally "let's save energy and recycle" |

That is a strong match, but matching a theme is not finding a word on a page.
Confirm the chapter and give the page range and all 134 become
`source-verified` in one pass.

Everything is `linguistically-checked` in the meantime: forms, verb types and
rections are derived from standard Finnish morphology, which is exactly what
that status means.

---

## This is batch 1

The list was explicitly partial. Nothing here assumes it covers a whole
chapter or a whole book, and no gap in it has been filled by guessing at what
the next page probably contains.
