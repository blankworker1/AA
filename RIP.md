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

Everything after the second date is the afterlife. The object carries the two
heights where the dates would go. No name.

---

## Mechanism

### 1. Funding — birth

One transaction commits the capital and fans it into one output per coupon.
The outputs sit on-chain from the first block, each earmarked for its era.

### 2. The pre-signed future

Each coupon is a transaction the author signs in advance: it spends its
funding output, is timelocked to a future block height, pays its value to an
address sealed inside a bearer object, and carries a message. The signatures
are complete before the key is destroyed. Nothing is signed afterwards. Nothing
can be.

### 3. Proof of Death — the ceremony

Before the ceremony the author publishes the funding transaction, the coupons,
and the schedule. Then the key is burned.

After that block the funding outputs can only move as the coupons move them.
Any later spend by any other path would be proof the author kept the key — that
they lied, or lived. There is none.

The last thing the key ever signs is the death inscription: a separate
transaction, spending a small output held back in the funding, not one of the
twenty-eight, broadcast at the ceremony itself. Its `OP_RETURN` is the headstone.
Unlike the coupons it is not timelocked — it surfaces the day the key burns, and
is legible from then on. Two years and an epitaph:

    2009 - 2026 Twenty Eight RIP

The death year is the ceremony's own day — the day the coupons were made and the
key destroyed. The birth year is formal, a headstone's convention, the author's
to choose and unimportant here. There is no birth transaction: birth is a date
carved on the stone, not an event the chain is made to mark. The death is both.

The author passes into a death state: no longer able to allocate, only to have
allocated.

### 4. Redemption — two acts

After its block height, anyone holding the coupon may offer it to the chain. A
miner must choose to include it; the dead do not confirm transactions. Once
included, the funds move to the sealed address, and whoever holds the object
breaks the seal and sweeps them.

A block height is *not before*, never *not after*. A matured coupon is a standing
offer to every future miner, open with no end. Unmined, it does not expire — it
waits, valid, until the first willing miner after its maturity. The window opens
and never shuts.

Maturation is the calendar's doing. Inclusion is a living miner's. The claim is
the holder's.

### 5. The fee — the bet

The fee is fixed at signing, near zero. A coupon cannot pay its own way, so no
ordinary fee-seeking miner will carry it. Inclusion can come only from a miner
who still finds the work worth mining — reached by someone alive who still holds
the coupon and still chooses to bring it forward. One carrier, one miner, each
era. They may be the same hand.

The fee is not a parameter. It is the bet: that the story outlives the money, and
that in every age there is one who will carry the dead and one who will seal them
in.

---

## The message

Each coupon carries a second output: `OP_RETURN`, zero value, holding a message.
Being zero value and exempt from the dust limit, it costs the coupon nothing and
is identical on all twenty-eight. Only the value and the words differ.

The message is signed with the coupon, under the same signature, before the key
burns. It cannot be altered afterwards. It does not appear on the chain until the
coupon is broadcast at its maturity. Twenty-eight messages, fixed by a dead hand,
each surfacing on the public ledger only when its era arrives. A text that
finishes writing itself at the final halving.

Capacity, per coupon: **80 bytes** — the data a single OP_RETURN relays unchanged
across the span. In plain text that is 80 characters, about 13 words. Accented
letters take two bytes each and shorten it.

Across the edition: twenty-eight lines, 2,240 bytes, roughly 370 words. A single
page, delivered one line every four years, complete in 2140.

Whether the twenty-eight are one text or twenty-eight is the author's to decide
before signing. After signing it is decided forever.

One message stands apart from the twenty-eight: the death inscription, the
headstone itself. It is the only one not timelocked — it surfaces the day the key
burns, while the afterlife lines wait their eras.

---

## The schedule

The coupon halves every 210,000 blocks, on the halving heights, from the first
halving after funding toward the last. Bitcoin's own curve, with the timechain
for a clock.

First coupon `C` = 1,000,000 sats.

| Era | ~Year | Block height | Coupon | Sats |
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

It halves to dust and past dust. A dusted coupon is not invalid, only
unprofitable to carry — it never dies, it only waits longer for a willing hand.
The money dies on schedule. The coupon does not.

The schedule is the instrument. What underlies it is not the question.

---

## The edition

One bearer object per halving era, released by the calendar across more than a
century. The release schedule is the halving. The supply curve is Bitcoin's.

Twenty-eight. No more, no less. The count is not chosen — it is the halvings left
between the funding and the last. One person, measured in the only clock the
piece trusts.

Each object carries:

- the two block heights, funding and destruction, in place of birth and death,
- its own maturation height — the date it comes into force,
- the pre-signed coupon transaction, engraved or as a QR,
- the sealed redemption key.

The objects circulate, are inherited, are lost. Nobody holding one can tell
whether the author is alive. After the destruction block, it no longer matters.

---

## Finality

The key burns and everything is fixed: the values, the heights, the words. None
of it can ever change.

Fixed is not the same as published. Finality makes the coupon unalterable; it
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
