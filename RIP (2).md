# RIP

### Returns in Perpetuity

*An instrument for financially outliving yourself.*

An Anonymous Art project.

---

## The idea

A perpetuity pays forever. RIP pays forever with no one behind it.

The author funds it, signs its whole future, and destroys the means to
interfere. From that block the author is neither required nor able to act. The
payments continue on their own, read out of the timechain, and arrive on
schedule for as long as there is anything to send.

A perpetuity you can only honour by first disappearing.

---

## The two dates

A headstone carries two dates. So does this.

- **The funding block** — when the capital is committed. Birth.
- **The destruction block** — when the key is burned. Death.

Everything after the second date is the afterlife. The tablet's face carries the
two heights where the dates would go. No name.

---

## Mechanism

### 1. Funding — birth

The endowment is sent to a single public author address. One transaction spends
it and fans it into one output per tablet — plus a small output held back for the
death inscription. The outputs sit on-chain from the first block, each earmarked
for its era, and the author address is the common root they all descend from.

### 2. The pre-signed future

Each tablet carries a return — a payment the author signs in advance: spending the
tablet's funding output, timelocked to a future block height, to an address whose
key is sealed inside the tablet, and carrying its record. The signatures are complete before the key is destroyed. Nothing is signed
afterwards. Nothing can be.

### 3. Proof of Death — the ceremony

Before the ceremony the author publishes the author address, the funding
transaction, the returns, and the schedule. Then the key is burned.

After that block the funding outputs can only move as the returns move them.
Any later spend by any other path would be proof the author kept the key — that
they lied, or lived. There is none.

The last thing the key ever signs is the death inscription: a separate
transaction, spending a small output held back in the funding, not one of the
twenty-eight, broadcast at the ceremony itself. Its `OP_RETURN` is the edition's
headstone, in the same structure the returns carry:

    RIP 1000000 1001000 28 bc1q… AA

The two heights are the funding block and the destruction block — birth and death
as the chain counts them. Where a return names its own number, the headstone names
the whole edition: twenty-eight, the full set. Unlike the returns it is not
timelocked — it surfaces the day the key burns, and is legible from then on.

The author passes into a death state: no longer able to allocate, only to have
allocated.

### 4. Redemption — one break

The return and the redemption key are sealed together on a steel plate inside the
tablet. To reach either is to break the tablet. So at its block height, redemption
is a single act: open the grave, and it yields both the return to broadcast and
the seed to sweep. Maturation and claiming, once two acts, are now one.

A miner must choose to include the return; the dead do not confirm transactions.
A block height is *not before*, never *not after*. A matured return is a standing
offer to every future miner, open with no end. Unmined, it does not expire — it
waits, valid, until the first willing miner after its maturity. The window opens
and never shuts.

Maturation is the calendar's doing. Breaking is the holder's. Inclusion is a
living miner's.

### 5. The fee — the bet

The fee is fixed at signing, near zero. A return cannot pay its own way, so no
ordinary fee-seeking miner will carry it. Inclusion can come only from a miner
who still finds the work worth mining — reached by someone alive who still holds
the tablet and still chooses to bring it forward. One carrier, one miner, each
era. They may be the same hand.

The fee is not a parameter. It is the bet: that the story outlives the money, and
that in every age there is one who will carry the dead and one who will seal them
in.

---

## The tablet

The tablet is fired clay. The form is deliberate: the clay tablet was the first
financial instrument. In cuneiform, clay tablets recorded debts, grain owed, and
promises to pay — thousands of years before coin or paper — and they endure, still
legible after five thousand years, long after paper browns and metal corrodes. RIP
mints the oldest instrument there is to carry the newest.

Its face is a headstone, and wordless, so it reads as the same thing in any
language and any century: the mark, the two block heights where a headstone's dates
would go, the tablet's number in the edition, the author address that roots and
anchors the whole set, and the maker's mark at the base. No name, no sentence, no
instruction. Only the number changes between tablets; a row of the twenty-eight
reads as one graveyard, identical stones, numbered.

Everything else is sealed inside, on a steel plate: the redemption seed on one
face, the full signed return on the other — the two things that can never be remade
once the key is burned, kept on one indestructible substrate so their durability
matches, encased in the clay and fired with it.

So the face is for the world and the estate is only for whoever opens the grave. To
read the return or the seed is to shatter the stone. The money and the record wait
in the dark together; the face outside says only who lies here, and when.

---

## The record

Each return carries a second output: `OP_RETURN`, zero value, exempt from the dust
limit — it costs the return nothing. It holds no words. It holds the instrument
describing itself:

    RIP 1000000 1001000 5 28 bc1q… AA

The tag; the two block heights, birth and death; this return's number; the edition;
the author address — the single public root all twenty-eight are funded from, and
the anchor anyone can look up to find the money and confirm it unspent; and the
maker's mark. A headstone written as structure, not sentence: no language to
exclude anyone, nothing to translate, the same thing in any tongue and any century.
The medium is the message. The author is not named — an Anonymous Art work has
none.

It is signed with the return, under the same signature, before the key burns, and
cannot be altered afterwards. It does not reach the chain until the return is
broadcast at its maturity. Everything but the number is identical across the
twenty-eight; only the index changes — 5, then 6, then 7 — so as the returns are
carried to the chain across the century, the ledger slowly inscribes the edition's
own census, one stone every four years, complete at 2140. The text that writes
itself survives; it was never words, only count.

At about seventy bytes, most of it the address, it fits inside the eighty an
`OP_RETURN` carries, in plain ASCII, so any explorer that decodes the field shows
it in the clear. The author address is native segwit, `bc1q…`, chosen so it fits;
Taproot or a raw txid would overrun the eighty.

---

## The schedule

The return halves every 210,000 blocks, on the halving heights, from the first
halving after funding toward the last. Bitcoin's own curve, with the timechain
for a clock.

First return `C` = 1,000,000 sats.

| Era | ~Year | Block height | Return | Sats |
|----:|------:|-------------:|-------:|-----:|
| 1   | 2028  | 1,050,000    | C      | 1,000,000 |
| 2   | 2032  | 1,260,000    | C/2    | 500,000 |
| 3   | 2036  | 1,470,000    | C/4    | 250,000 |
| 4   | 2040  | 1,680,000    | C/8    | 125,000 |
| 5   | 2044  | 1,890,000    | C/16   | 62,500 |
| 6   | 2048  | 2,100,000    | C/32   | 31,250 |
| 7   | 2052  | 2,310,000    | C/64   | 15,625 |
| 8   | 2056  | 2,520,000    | C/128  | 7,812 |
| 9   | 2060  | 2,730,000    | C/256  | 3,906 |
| 10  | 2064  | 2,940,000    | C/512  | 1,953 |
| 11  | 2068  | 3,150,000    | C/1024 | 976 |
| 12  | 2072  | 3,360,000    | C/2048 | 488 |
| ... | ...   | ...          | ...    | ... |
| 28  | ~2140 | 6,720,000    | C/2²⁷  | — |

It halves to dust and past dust. A dusted return is not invalid, only unprofitable
to carry — it never dies, it only waits longer for a willing hand. The money dies
on schedule. The tablet does not.

The schedule is the instrument. What underlies it is not the question.

---

## The edition

One tablet per halving era, released by the calendar across more than a century.
The release schedule is the halving. The supply curve is Bitcoin's.

Twenty-eight. No more, no less. The count is not chosen — it is the halvings left
between the funding and the last. One person, measured in the only clock the
piece trusts.

Each tablet carries, on its face, the two block heights, its number, and the
author address; sealed inside, on a steel plate, the return and the redemption key.

The tablets circulate, are inherited, are lost. Nobody holding one can tell whether
the author is alive. After the destruction block, it no longer matters.

---

## Finality

The key burns and everything is fixed: the values, the heights, the record. None
of it can ever change.

Fixed is not the same as published. Finality makes the return unalterable; it
does not make it heard. The chain guarantees the dead cannot be edited. It never
guarantees the dead are read. That, in every era, is left to the living.

---

## Covenant of the Author

> I funded it while I could.
> I signed its whole future before I had the right to change my mind.
> I destroyed the key so no later self of mine could betray it.
> The dead have no yield. The payments will come anyway, and no one will ask from where.
> They will come smaller each time, until there is nothing to send and only the promise is left.
> You cannot tell whether I am alive.
> After the destruction block, neither can I.
