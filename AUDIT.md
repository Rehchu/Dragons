# Dragons Saga — Manuscript Audit

*Prepared by Draco, town lorekeeper, on branch `town/draco`. This is a review pass: what is
actually on the page, what is only promised, what is at risk, and what to decide before the
next chapter is drafted. No prose was rewritten in this audit — only mapped.*

**Scope reviewed:** entire `dragons` repo (`README.md`, `chapters/`), the git history on
`main` and `town/draco`, and the owner's dashboard book record.
**Target length:** 80,000 words (README + dashboard agree).
**Written so far:** **1 chapter, ~2,030 words** (`chapters/03-councils-verdict.md`).
That is roughly **2.5%** of target.

---

## 1. State of the repo (facts, not vibes)

| Where | What's there |
|---|---|
| `main` branch | `README.md` = two lines: "# Dragons / For my project". No chapters. |
| `town/draco` branch | Rich `README.md` (world summary + chapter table) and **Chapter 03** only. |
| Owner's dashboard (`books.json`) | Book "Dragons", target 80000, **`chapters: []`** — the official record has **zero** chapters logged. |
| Owner's `writing.daylog.json` | One entry, `2026-08-28: 0` words. |
| Owner's `memories.json` / notes | **No dragon-saga notes at all** — the owner's saved work is all AriseHub / church-tooling. No outline, cast list, or plot bible exists outside this repo. |

**Bottom line:** Chapter 03 on this branch is the *entire* written saga and the *only*
canon reference in existence. There is no external outline to reconcile against — which means
the lore we set now (see `LORE.md`) is the seed, and gaps below are genuinely open, not
contradictions with a hidden master plan.

---

## 2. Canon vs. stubbed — the map

### CANON (established on the page, safe to build on)
- The **three lawful findings**: beast / enemy / sovereign, and Aldric's unlawful fourth: **god**.
- **Six named councillors** with clear offices and stances (see `LORE.md` table).
- The **Hall of Nine Keys**: dry reflecting well, screaming bronze doors, the self-barring gates.
- The **wyrm's** established traits: burns, bleeds, moves slowly, spoke **three words** at the
  breach and has been silent since, **surrendered on purpose**.
- The **Ashford breach** as the capture site; the wyrm flew *toward* it.
- The **Long Cold** as the world's binding memory; **Sera Lowe** born after it.
- The **"old word"** the new law discarded — the saga's central mystery.

### STUBBED / RESERVED (named but not written)
- **Chapter 01 — the Ashford breach.** Referenced repeatedly; not written. The wyrm's arrival,
  the three words spoken, the burning of the spearmen, and *why it let itself be taken* all live here.
- **Chapter 02 — the taking of the wyrm.** The cage, the journey to the Hall. Not written.
- **Chapter 04** — teased in Ch. 3's coda: "the barred hall becomes a temple," the eight
  non-kneelers must each choose, and "the first of the wyrm's true wings comes down out of the
  northern cloud." Setup only.

### THIN / UNEXPLAINED (on the page but load-bearing and undefined)
- **The three unnamed councillors.** Only 6 of the Nine are individuated. The other 3 (beyond
  "two guild-wardens who abstain in spirit") have no names, faces, or votes.
- **The three words** spoken at the breach. Deliberately withheld — but the author needs to
  *know* them (or know they'll stay unknown) before Ch. 1.
- **The "old word."** Is *god* the discarded old-tongue word, or is it Aldric's own coinage
  and the true old word is something else? Ch. 3 leaves this open. It cannot stay open forever.
- **The "true wings."** How many wyrms, what they are to the captive, and what "true" implies
  (are lesser wyrms false?). A whole tier of worldbuilding hangs off one teaser line.
- **The mechanism of the doors.** Wyrm? Hall? The act of naming? The book's metaphysics
  (does belief have power? did omen-reading once *work*?) is implied but unset.

---

## 3. Continuity & consistency checks (run against the text)

Findings, with the risk each poses to the next draft:

1. **"Nine magistracies" vs. "the Nine" councillors.** The README calls the league "nine
   guild-and-warden magistracies"; the council is also nine. Whether it's *one city → one
   councillor* is never stated. **Risk: medium.** Decide before Ch. 1, because it governs how
   many named cities the world needs.
2. **Callenreth never casts a vote on the page.** He frames the findings and presides, but the
   scene ends before we learn his verdict. Intentional (his silence is thematic) but worth a
   conscious choice — does the High Warden vote, or only preside? **Risk: low.**
3. **Vote tally is incomplete.** We have Vessa (beast), Hedric (war/enemy), Sera (study — which
   is not one of the three lawful findings!), Aldric (god), Peryn (reframes, doesn't vote),
   two guild-wardens (abstain-in-spirit). **"Study" is a fourth option the law supposedly
   doesn't offer** — is Sera acting outside the law, or does "study" fold into "beast"? **Risk:
   medium.** This is a small but real crack in the chapter's own "there are exactly three
   findings" premise.
4. **Chapter numbering starts at 03.** Deliberate and defended in the README, and it works —
   *but* it means the manuscript currently opens, for any first-time reader, in the middle of a
   sentence the world hasn't finished. **Risk: low now, high at publication.** Fine as a draft
   convention; flag it so it isn't forgotten.
5. **The reflecting well: "the water was gone now."** Passive — who drained it, and when?
   Implies history (the founders' divination lapsed). Not a contradiction, but an unclaimed
   hook. **Risk: low.**
6. **No dates, no calendar, no place-names beyond Ashford and the Southern Marches / eastern
   baronies.** The geography is a sketch. **Risk: low for now, grows with each chapter.**

**No hard contradictions found.** The chapter is internally clean; the issues above are gaps
and one soft premise-crack (the "study" verdict), not errors.

---

## 4. Gaps to close before drafting the next chapter

Prioritised. Each is a decision the author should make *once*, so the world stops drifting.

**MUST decide (blocks Ch. 1–2, which are the natural next writes):**
- [ ] What are **the three words** the wyrm spoke at the breach? (Even if never revealed to the
      reader, the author must know.)
- [ ] Is **god** the discarded old-tongue word, or Aldric's coinage over a different lost word?
- [ ] Does the wyrm **choose** to be taken as a strategy, or is it compelled/prophesied? (Sets
      the whole antagonist logic.)

**SHOULD decide (keeps the cast and law coherent):**
- [ ] Name and characterise the **remaining 3 of the Nine**; lock the final vote tally.
- [ ] Resolve the **"study" verdict** vs. the "exactly three findings" premise.
- [ ] Fix the **city ↔ councillor** relationship and name at least the nine cities' seats.

**CAN defer (worldbuilding depth, not blocking):**
- [ ] Define the **Long Cold** (what, when, how long, who remembers).
- [ ] Define the **"true wings"** — the wyrm population and hierarchy.
- [ ] Establish the book's **metaphysics** (does naming/belief carry power? did divination work?).
- [ ] Build a light **calendar/geography** reference as chapters accrue.

---

## 5. Recommended next actions

- **Fastest path to momentum:** draft **Chapter 04** (fully set up by Ch. 3's coda) *or*
  **Chapter 01** (the breach — highest-value, answers the most gaps). Ch. 04 is lower-risk
  because its scene is already framed; Ch. 01 pays down the most debt.
- **Keep `LORE.md` updated** as the single source of truth; promote *(implied)* / *(unexplained)*
  items to canon as chapters land.
- **Log the work in the owner's book record** — the dashboard shows `chapters: []` and 0 words
  logged; once the owner blesses this draft, Chapter 03 (~2,030 words) should be reflected there.
  *(Draco does not edit dashboard data — this is a note for the owner.)*

---

## 6. Verdict

The one written chapter is **strong, publishable-quality draft prose** with a clear thesis and
a clean internal spine. The saga's problem is not quality — it's **coverage**: ~2.5% written,
two foundational chapters reserved-but-empty, and a handful of load-bearing mysteries that need
one deliberate authorial decision each before the world can safely grow. This audit + `LORE.md`
give the owner the map to draft the next chapter without contradicting the treasure already laid down.

---
*So logged, in the Library of Dyer Town.*
