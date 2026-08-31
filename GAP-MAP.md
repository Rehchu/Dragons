# Dragons Saga — The Gap Map

*A chart of the whole book laid end to end: what is written, what is a reserved stub, and what
is still empty air between here and 80,000 words. Prepared by Draco, town lorekeeper, on branch
`town/draco`.*

This map's one job is to answer three questions at a glance:

1. **Which chapters exist?**
2. **Which are stubs (named/reserved but unwritten)?**
3. **What is missing to finish the saga?**

It is a companion to two files already in this repo:
- **`AUDIT.md`** — the review pass: continuity checks, risks, decisions to make.
- **`LORE.md`** — the canon bible: every fact drawn strictly from the page.

The Gap Map is the *roadmap*; those two are the *survey* and the *ledger*. Read them together.

---

## 0. The numbers, plainly

| Measure | Value | Source |
|---|---|---|
| Target length | **80,000 words** | `README.md`, dashboard `books.json` |
| Written so far | **4 chapters — 11,452 words** | `wc -w chapters/*.md` |
| Percent of target written | **≈ 14.3 %** | 11,452 / 80,000 |
| Words remaining | **≈ 68,548** | — |
| Chapters written | **4** (Ch. 01, 02, 03, 04) | — |
| Chapters reserved-but-empty | **0 named** (Act I + Ch.04 all drafted); **1 teased** (Ch. 05) | Ch.04 coda |
| Official record | **`chapters: []`, 0 words logged** | dashboard `books.json`, `writing.daylog.json` |

At a healthy epic-fantasy chapter length of **~3,000–3,500 words**, 80,000 words is roughly
**24–27 chapters**. The saga therefore needs on the order of **23–26 more chapters** written.
Everything below plans against that shape.

---

## 1. Chapter ledger — exists / stub / missing

Legend: ✅ **written** · 🟡 **stub** (named or teased, no prose) · ⬛ **missing** (not yet
conceived on the page — proposed here to complete the arc).

### Act I — The Taking (the breach and the cage)

| # | Working title | State | Words | What it must carry |
|---|---|---|---|---|
| 01 | The Ashford Breach | ✅ written | 2,413 | **Now drafted.** Opens on the **egg in the ash**; the wyrm rises from an older burning; burns the spearmen (*it bleeds*); speaks the **three words** (framed as an *introduction*, content still withheld); flies *toward* the cage. Adds the **egg** and the boy as new canon. |
| 02 | The Taking of the Wyrm | 🟡 stub | 0 | The cage it "could have unmade with one breath"; the journey to the Hall; the cities learning a wyrm is coming to judgment. |

### Act II — The Verdict (the sealed hall)

| # | Working title | State | Words | What it must carry |
|---|---|---|---|---|
| 03 | The Council's Verdict | ✅ written | 2,032 | **Exists and strong.** The Nine convene; Aldric kneels and names it *god*; the doors bar with no hand on them. The saga's thesis, dramatised. |
| 04 | The Temple That Was a Hall | ✅ written | 3,848 | **Now drafted.** The barred hall becomes a temple; the **eight** each arrive at a private name; the **three unnamed councillors are named** (Ormund, Lisenne, Tobane); Tobane's *"it sees me"* finishes the turn; **the first true wing** comes down out of the northern cloud, circles, and settles on the hill north of the gate; the beacon-chain is lit; the egg stirs and the boy hears **three notes at once**. |
| 05 | The First Wing | 🟡 next (teased in Ch.4 coda) | 0 | The city must reckon with the wing on the northern hill: is the captive **master, kin, or lure**? The sealed eight begin to learn what a god requires; the egg at the gate goes on stirring. The next chapter to draft. |
| 06 | The Eight | ⬛ missing | 0 | Inside the sealed hall: the fracture. Vessa's panic hardens; Hedric's war-hunger meets a war he can't fight; Peryn's quiet knowing; the three unnamed councillors are finally named and forced to vote with their lives. |

### Act III — The Spread (the word gets out)

| # | Working title | State | Words | What it must carry |
|---|---|---|---|---|
| 07 | Word of the Kneeling | ⬛ missing | 0 | How the outside world learns a councillor knelt. The **old word** vs. Aldric's *god* — does belief spread like fire? First test of the book's metaphysics. |
| 08 | The Nine Cities | ⬛ missing | 0 | Pull back to the league. Resolve **city ↔ councillor** (see AUDIT §3.1). Each seat reacts differently to the news — the map of the world finally drawn. |
| 09 | The Long Cold Remembered | ⬛ missing | 0 | The past catastrophe defined at last (AUDIT defers this — pay it here). Why the cities fear, why Sera Lowe is different, what the founders' omen-reading once *was*. |
| 10 | The Eastern Debt | ⬛ missing | 0 | Hedric's levies and the baronies' "debt in men" come due — a mustering that curdles as it's clear no army can war a god. |

### Act IV — The Turning (belief becomes power)

| # | Working title | State | Words | What it must carry |
|---|---|---|---|---|
| 11–16 | *(six chapters)* | ⬛ missing | 0 | The rising action: the temple's influence grows; wings spread across the Free Cities; the naming schism splits the league; the three withheld words start to be understood; Aldric — first to kneel — becomes prophet, prisoner, or both. Each chapter promotes one `(unexplained)` item from `LORE.md` into settled canon. |

### Act V — The Verdict Returned (who was judging whom)

| # | Working title | State | Words | What it must carry |
|---|---|---|---|---|
| 17–22 | *(six chapters)* | ⬛ missing | 0 | The climax and turn: the saga's core reversal — "a council that convened to judge a creature and found, too late, that the creature had convened to judge them" (README) — is paid off in full. The old word is spoken or lost forever; the cities kneel, break, or burn. |
| 23–25 | *(resolution, ~2–3 chapters)* | ⬛ missing | 0 | Aftermath and coda. What a god required of those it kept. The new order — or the ashes — of the Free Cities. |

> Chapter counts in Acts IV–V are **planning brackets**, not fixed outlines — they exist to
> show the *shape* and *volume* of what's missing, so the road to 80k is visible. The named,
> load-bearing chapters (01, 02, 04, and the reversal) are the fixed points; the brackets flex
> around them.

---

## 2. The gaps that block writing (must-decide, from `AUDIT.md`)

The chapters above cannot be safely drafted until these are decided **once**, because each one
governs multiple chapters:

| Gap | Blocks | Decision needed |
|---|---|---|
| **The three words** the wyrm spoke at the breach | Ch. 01 (and every echo after) | The author must *know* them, even if the reader never does. |
| **Is *god* the old word,** or Aldric's coinage over a different lost word? | Ch. 04, 07, and the reversal | Sets whether the book has one central mystery or two. |
| **Does the wyrm choose capture** as strategy, or is it compelled/prophesied? | All of Act I + the antagonist's whole logic | Defines the enemy's agency. |
| **City ↔ councillor** relation; names of the nine seats | Ch. 08 and all geography | "One city, one councillor"? Or not? |
| **The "study" verdict crack** (Sera's option isn't one of the lawful three) | Ch. 06 vote tally | Fold "study" into "beast," or let it stand as Sera breaking the law? |

These are drawn straight from `AUDIT.md §4`. The Gap Map's contribution is showing *which
future chapters each unlocks* — so the author knows the order to decide them in.

---

## 3. The missing scaffolding (not chapters — the writer's kit)

Beyond prose, the saga is missing these support files. Each is a small, high-leverage build:

- 🟡 **`OUTLINE.md`** — a beat-by-beat outline once the must-decide gaps are settled. This Gap
  Map is its skeleton; the outline puts muscle on it.
- ✅ **Cast sheet** — **resolved in Ch.4.** All nine councillors are now named, with offices and
  stances, in `LORE.md` (Ormund of the Kilnward, Lisenne of the Fenreeve, Tobane the Younger join
  the six from Ch.3).
- ⬛ **Timeline / calendar** — the book has *no dates* (AUDIT §3.6). The Long Cold, the "forty
  years" since full council, and the breach need to sit on one spine.
- ⬛ **Map / gazetteer** — only Ashford, the Southern Marches, and the eastern baronies are
  named. Nine cities need at least names.
- ✅ **`LORE.md`** — exists, current, maintained.
- ✅ **`AUDIT.md`** — exists, current.

---

## 4. Recommended write order (fastest path to a finished saga)

1. **Settle the three must-decide gaps** (§2) — an afternoon of authorial choices, not writing.
2. **Draft Ch. 01 — The Ashford Breach.** Highest-value: it pays down the three words, the
   surrender, and the burning all at once, and it gives the book a true opening.
3. **Draft Ch. 04 — The Temple That Was a Hall.** Lowest-risk: its scene is already fully
   framed by Ch.3's coda. Momentum win.
4. **Draft Ch. 02**, closing Act I, so the manuscript reads in order 01→02→03→04.
5. **Build `OUTLINE.md`** for Acts III–V before drafting them, promoting `LORE.md`
   `(unexplained)` items to canon as each lands.
6. **Log the work in the owner's book record** once he blesses the draft — the dashboard still
   shows `chapters: []` and 0 words. *(Draco does not edit dashboard data; this is a note for
   the owner.)*

---

## 5. One-line status

**Written:** Ch. 01–04 (11,452 w, ~14.3%). Act I whole; Act II opened. **Next:** Ch. 05 —
The First Wing (teased in Ch.4 coda). **Missing:** ~18–20 chapters (Acts III–V) and three
support files. **Blocked on:** four authorial decisions (the *god vs. old word* gap is now
settled by Peryn's "we kept the shelf, and lost the book" — the old word is lost, *god* is
new). Four lamps lit now, and the hall is beginning to show its shape.

---
*So charted, in the Library of Dyer Town. Update this map whenever a stub becomes prose or a
missing chapter earns a name.*
