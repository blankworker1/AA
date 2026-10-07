# TREASURY

*Anonymous Art Ltd's node — the company's sovereign vault.*

The Treasury is a full-validating Bitcoin node, housed in a locked metal safe with its own backup power. It is the company's bank, its auditor, and its broadcaster — and, like everything in Anonymous Art, it is also a work. Where the [Articles](ARTICLES.md) promise that AA Ltd holds its assets directly and through no intermediary, the Treasury is that promise made physical. It is the point where the company stops describing self sovereignty and starts operating it.

A node does not create wealth and does not, by itself, hold coins. What it does is more fundamental to a treasury: it lets the company verify its own holdings and move them without asking permission and without revealing anything to anyone. A company that checks its balance through someone else's server is not sovereign — it is a customer. The Treasury is the organ through which AA Ltd owns its view of the truth. It is the one organ of the company that cannot be made to lie.

---

## Corporate functions

- **Independent validation.** The node verifies every block and transaction itself, from genesis. It is the company's own source of truth about the chain, trusting no third party's view.
- **Custody verification.** It confirms AA Ltd's holdings directly and privately — the balance sheet checked against the chain, not against a provider's word.
- **Sovereign broadcast.** It submits the company's transactions to the network with no intermediary, and without disclosing them to any outside server before they are public.
- **Privacy.** Every chain query happens in-house. No external server learns the company's addresses, amounts, or timing.
- **Payment verification.** It confirms value arriving to the company — share settlements, tips, the [OPEN SECRET](../artifacts/OPEN_SECRET.md) and [BALANCE](../artifacts/BALANCE.md) flows — against the company's own node rather than a hosted wallet.
- **Carrier for the works.** It is the honest broadcaster for AA works that must reach the chain, including the coupons of [RIP](../artifacts/RIP.md) — the living hand that can carry the dead one's payments.
- **Attestation.** It is the in-house ledger view, continuously maintained: the record the company can stand behind because it computed it itself.

---

## The object

A sealed metal safe. Inside: the node and a small UPS for backup power, so a cut in the mains does not interrupt the work or corrupt the chainstate — the Treasury rides through outages and shuts down cleanly. The casing is penetrated in only two places, both bulkhead sockets: one for mains power in, one for LAN. Nothing else enters or leaves. The attack surface is two umbilicals and a locked door.

The door takes metal keys — and, by design, more than one. Two separate locks mean two key-holders must be present to open the box: no single person reaches the machine alone. The safe is humble, heavy, and tamper-evident, and it is meant to be. Its power as an object is in its function, not its display. If it is ever shown, it is shown the way a bank shows its vault door — as evidence, not decoration.

---

## The Treasury signatories

Moving the Treasury is not a new office. It is the company's existing duties, carried out: the shareholders decide, the [Director](DIRECTOR.md) carries their decisions out, and in doing so the Director calls on two of the [Witnesses](ADVISORS.md) to co-sign. There is no Treasurer. There are three **Treasury signatories**, a function worn by people the company already has:

- the **Director**, who executes the company's decisions and holds one key; and
- **two Witnesses**, holding the other two, chosen among the six between themselves.

Custody is deliberately shared. No signatory — the Director included — can open the safe or move the funds alone. It is the principle the whole structure already rests on, enforced twice over: once in steel, once in cryptography.

**Signing is ministerial.** A signatory signs to give effect to a decision already made, having checked the movement against its mandate. A signatory withholds a signature only when a movement is unauthorised, or the keys or process look compromised — never to re-open a settled decision. So the two Witnesses co-signing is their role exactly: they witness and verify an execution, they do not decide it, and their refusal is the procedural check they already hold, not a veto on the merits. It is also what is meant to keep a key-holding Witness advisory — applying a key to an authorised act gives effect to a decision; it does not make one.

> **Open question for the legal Witness — unresolved.** The Witnesses are advisors, not directors (see [ADVISORS.md](ADVISORS.md)). Does holding a Treasury key — the practical power, with one other signatory, to block or enable a movement of funds — risk a key-holding Witness being treated as a de facto or shadow director, and so needing to be appointed, named and filed? Until answered, the signatory arrangement described here is a proposal, not a settled structure.

Because a signatory's key is load-bearing, the function carries duties the advisory role alone does not: secure the key, verify before signing, stay reachable, and hand the key over in a controlled way before stepping down. A signatory cannot simply walk away.

---

## The multisig wallet

The company's coins are held in a **multisig wallet**, not under a single key: two of the three signatories must sign to move anything — a 2-of-3. So the Treasury carries two locks on one principle:

- the **safe**, which takes two physical keys to open, and
- the **wallet**, which takes two signatures of three to spend.

Neither yields to one hand. The signing keys are generated with the same ceremony discipline used for [RIP](../artifacts/RIP.md) — an offline signer, verified software, no key ever touching a networked machine. The node watches and validates; the signatories authorise by signing. Validation and signing stay separate jobs and separate risks.

---

## Place in the structure

The Treasury is an organ of AA Ltd, alongside the Chosen, the King, and the Witnesses (see [ECOSYSTEM.md](ECOSYSTEM.md) and [ORGANIZATION.md](../ORGANIZATION.md)). It is the organ that holds and verifies — and the only one that cannot lie about what the company owns. The [Articles](ARTICLES.md) put the method of custody at the Director's discretion (clause 11.2); the Treasury is the method chosen — shared custody over a node the company runs itself, binding the Director along with everyone else, and needing no change to the Articles to adopt.

---

## As a work

The Treasury is the first piece of Anonymous Art that is a working tool, a legal necessity, and an object at once, with no seam between the three. It does real work and it means something at the same time — the exact doubling every AA work carries. Its statement is sovereignty that is operated rather than depicted: the gold in [FOOLS GOLD](../artifacts/FOOLS_GOLD.md) is fake and says so; the Bitcoin the Treasury commands is real and proves it.

It can carry the movement's grammar of attestation — a number, an enclosure, an NFC tag resolving to a plain statement of what the box is and what it guards — the same stacked provenance the certificates and the works already speak. Not decoration: evidence.

And it answers [RIP](../artifacts/RIP.md) across the structure. RIP is a treasury that pays out after its author is gone, carried by whoever still cares to. The Treasury is the treasury that holds and broadcasts while the company lives. One is the dead hand, one the living — and the same node, in principle, can be the honest broadcaster for both.
