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

## 5. Incomplete — needs review (0)

**Resolved.** `saapuvat` was the one entry entered as `needs-review`, because a
bare word list could not say whether it meant the Arrivals board or the third
person plural of *saapua*.

Suomen mestari 2 page 16 settles it. The word stands in a list of airport
nouns and signage — *lento, lentolippu, käsimatkatavara, turvatarkastus,
**saapuvat**, passi, viisumi* — so the arrivals-board reading is the one the
chapter teaches. The entry is now `source-verified` and the reasoning is
recorded in its `source.note`.

---

## The source: found, and confirmed word by word

**Every one of the 134 entries is now `source-verified`.** No entry is left
with `source: null`.

The books arrived later and three of the five carry a text layer: Oma suomi 1,
Suomen mestari 2 and Suomen mestari 3. Both chapters this report predicted
turned out to be right, and they were checked a headword at a time rather than
by theme:

| List | Source | Confirmed |
| --- | --- | --- |
| Travel (72) | **Suomen mestari 2, Kappale 1 "Viikonloppureissu"**, p. 10–42, word list p. 13–16 | 72 of 72 |
| Environment (62) | **Suomen mestari 3, Kappale 1 "Säästetään energiaa ja kierrätetään!"**, p. 10–40, word list p. 12 and 21 | 62 of 62 |

Each entry records the page the word was actually found on, preferring the
chapter's own Sanasto pages over its exercise pages. A separate pass then
re-read every citation and checked that the `sourceTerm` really occurs on the
page the entry names: **134 of 134 hold.**

Four entries needed the book's own spelling before they would match:

| Entry | The book prints | Where |
| --- | --- | --- |
| menopaluu | *meno paluu* (two words) | sm2 p. 16 |
| tehdä varaus | *tehdä (2) varaus = varata (4)* | sm2 p. 16 |
| perua varaus | *perua (1) varaus, peruttu* | sm2 p. 16 |
| banaaninkuori | *banaaninkuoret* (plural) | sm3 p. 13 |

The last one is worth noting: this report entered **banaaninkuori** under the
singular because the batch submitted a plural. The chapter uses the plural
too — *"Mä en tiedä, mihin roskikseen nää banaaninkuoret pitää laittaa"* — so
the singular headword with the plural as an alias was the right call.

### The soft hyphen, confirmed

Section 4 recorded two corrections made without the source in hand, both a
soft hyphen sitting inside a word. The source confirms both. Page 12 of
Suomen mestari 3 does not extract cleanly either: *ympäristöystävällinen*
comes out of the PDF broken across several fragments, ending in a mangled
"Uinen" for *llinen*. Whatever produced the original batch list hit the same
layout, which is exactly where a stray soft hyphen comes from. The corrected
spellings stand.

### Still not in hand

**No niin! 1** and **Suomen mestari 4** are scans with no text layer, so
nothing in them has been searched. Neither was needed for this batch.

---

## This is batch 1

The list was explicitly partial. Nothing here assumes it covers a whole
chapter or a whole book, and no gap in it has been filled by guessing at what
the next page probably contains.

Now that the chapter is known, that can be stated more precisely: these 134
entries are what the submitted list contained, not everything Suomen mestari 2
Kappale 1 and Suomen mestari 3 Kappale 1 teach. The chapters' word lists hold
more than the batch asked for.
