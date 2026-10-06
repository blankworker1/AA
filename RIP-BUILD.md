# RIP — Build

The technical companion to `RIP.md`. The manifesto states what the piece *is*
and deliberately leaves its terms undefined and its procedures unwritten. This
file is the opposite: it defines every term exactly and lays out how a tablet is
made and how, decades later, it is redeemed. Where the manifesto keeps a straight
face, this file is plain, precise, and safe to act on.

Two parts: **Making** (the author's one-time signing ceremony) and **Collecting**
(a holder's redemption, repeated once per tablet across the century). The
glossary comes first because both parts rest on it.

---

## Terms

- **Author key** — the single private key that funds the piece and signs every
  transaction in advance. Destroyed at the ceremony. Nothing it has not already
  signed can ever be signed.
- **Tablet** — one fired-clay object of the edition of twenty-eight. Carries, on
  its cast face, one pre-signed transaction and its message; carries, sealed
  inside, one redemption key.
- **Return** — the bitcoin a tablet pays when its transaction is mined. Halves
  each era. Not interest; a fixed, pre-funded amount.
- **Funding transaction** — the one on-chain transaction that commits all the
  capital, with one output earmarked per tablet plus one small output held back
  for the death inscription.
- **Tablet transaction (coupon)** — the pre-signed transaction a tablet carries.
  Spends that tablet's funding output; pays the return to the tablet's sealed
  address; carries the message; timelocked to the tablet's maturation height.
- **Maturation height** — the block height before which a tablet transaction
  cannot confirm. One per tablet, on a halving boundary.
- **Sealed address** — the Bitcoin address a tablet transaction pays to. Its
  private key (the **redemption key**) is engraved on a steel plate and fired
  inside the tablet. The return is claimable only by whoever extracts that key.
- **Death inscription** — a separate, non-timelocked transaction broadcast at the
  ceremony, carrying the headstone in its `OP_RETURN`. The last thing the Author
  key signs, and the public mark of the key-burn.
- **Message** — the text in a transaction's `OP_RETURN` output. Zero value, ≤ 80
  bytes, fixed at signing, surfaced on-chain only when its transaction is mined.
- **Destruction block** — the block at whose time the Author key is destroyed;
  the piece's "death" date. After it, the funding outputs can only move as the
  pre-signed transactions move them.
- **Timelock (nLockTime)** — the transaction field that sets the maturation
  height. A value below 500,000,000 is read as a block height. Enforced only if
  an input's sequence is below its maximum.
- **SIGHASH_ALL** — the signature mode used throughout: the signature commits to
  every input and output, including the message and the exact fee. Nothing in the
  transaction can be changed after signing.
- **witness_utxo** — the funding output a coupon spends (its value and
  scriptPubKey), embedded inside the coupon's PSBT. This is what lets a coupon be
  signed *before* the funding transaction is broadcast.
- **Treasury node** — the always-on, synced node (the Treasury's) that broadcasts.
  RIP borrows exactly this one socket of the Treasury stack: `bitcoind` as honest
  carrier onto the network.
- **Builder** — the airgapped, freshly-imaged laptop that constructs and verifies
  the transactions. Holds no key, never networked, wiped by shutdown.
- **Online courier** — an ordinary networked machine (or the Treasury node itself)
  that carries the finished signed transactions to the node and broadcasts. Builds
  nothing, holds nothing.
- **In-USB / Out-USB** — two one-way USB sticks: one carries reviewed code and the
  config onto the Builder; the other carries the finished public transactions off
  it. Neither ever carries a key; ideally neither round-trips.
- **Carrier** — the living person who, at a tablet's maturity, holds it and
  chooses to bring its transaction to the chain.
- **Era** — one halving interval (210,000 blocks, ~4 years). One tablet per era.

---

## Part 1 — Making: the ceremony

A one-time event, performed at home on the LAN. Four machines, each doing one job;
two of them never touch a network; no two jobs that must stay apart ever share
hardware.

### Parameters to freeze first

- **C** — the first return (illustrative: 1,000,000 sats). Each era halves it.
- **Edition** — 28 tablets, the halvings between funding and the ~2140 horizon.
- **Maturation heights** — era *n* height = `1,050,000 + (n − 1) × 210,000`
  (era 1 = the first halving after funding). See the schedule table in `RIP.md`.
- **Fee** — one fixed, near-zero fee baked into every tablet transaction. This is
  the deliberate choice that makes a willing miner the sole gatekeeper; not tuned
  per era.
- **Address type** — segwit (P2WPKH or P2TR). Segwit transaction IDs do not change
  with the signature, so the funding txid is fixed before broadcast and the
  coupons can be built and signed against it.
- **Messages** — the 28 tablet messages and the death inscription, each ≤ 80
  bytes. Decide these now; after signing they cannot change. Death-inscription
  format: `YYYY - YYYY <count> RIP`, e.g. `2009 - 2026 Twenty Eight RIP`.

### The machines

- **SIGNER — SeedSigner.** A SeedSigner build (Pi Zero, no radio). Generates the
  author seed and the 28 bearer keypairs, and signs — over QR only, never USB,
  never network. The author seed is born here and destroyed here. Confirm your
  firmware signs a set-nLockTime PSBT before trusting the edition to it.
- **BUILDER — airgapped laptop.** A spare laptop booted from a live Debian USB:
  RAM-only, no network, wiped automatically at shutdown. Runs an offline, unsynced
  `bitcoind` (used only as a construction and decoding library over RPC — it never
  sees the chain), the coordinator, the verifier, and a QR display. Holds no key.
- **NODE — Treasury node.** The Treasury's always-on, synced node. The only machine
  that puts a transaction on the network.
- **ONLINE — courier.** An ordinary networked PC (or the NODE itself) that carries
  the finished signed transactions from the Out-USB to the node's RPC and
  broadcasts.

Two channels cross the gaps, each one-way by discipline. **QR** carries unsigned
transactions BUILDER → SIGNER and signatures back — the secret crossing. **USB**
carries reviewed code + config onto the BUILDER (In-USB) and finished public
transactions off it (Out-USB) — the non-secret crossings. No USB ever carries a
key. The 28 bearer keypairs are independent, not children of one master: a single
master would mean one secret controls every tablet.

### The ceremony, phase by phase

**Phase 0 — Before the day.**

1. **SIGNER** — generate the 28 bearer keypairs. Record each private key (for the
   steel plates) and derive its address; these are the coupon destinations in the
   config.
2. **SIGNER** — generate the author seed; derive the funding address. Keep one
   temporary backup (a SeedQR), to be destroyed at the burn.
3. **ONLINE → NODE** — fund the author address; broadcast; confirm. Note the
   author UTXO (`txid:vout:amount`) — the funding transaction's input.
4. **ONLINE** — finalise the config: author UTXO, the 28 heights, the 28 amounts
   (`Vₙ + fee`), the 28 messages, the 28 bearer addresses, the fee, the
   death-inscription text. Copy config + coordinator + verifier + the offline
   `bitcoind` binary onto the In-USB, and verify every file's hash here.
5. **ONLINE → NODE** — confirm the node is reachable:
   `bitcoin-cli -rpcconnect=<node-ip> getblockchaininfo`.

**Phase 1 — Build (BUILDER, airgapped).**

6. Boot from the live-Debian USB (RAM-only, no network). Plug the In-USB, copy
   code + config to the RAM disk, unplug it.
7. Start the offline daemon: `bitcoind -networkactive=0` — construction only.
8. Run the coordinator. From the config it builds the **funding tx** (unsigned, 29
   outputs — 28 tablet outputs sized `Vₙ+fee` plus the held-back death-inscription
   output), the **28 coupon PSBTs**, and the **death-inscription PSBT**. Each
   coupon spends funding output *n*, sequence `4294967294`, `nLockTime` = height
   *n*, paying `Vₙ` to bearer address *n* with an `OP_RETURN` message; the
   coordinator injects each input's `witness_utxo` from the funding tx it just
   built, which is what makes the coupons signable before the funding tx is
   broadcast. Representative call the coordinator loops:
   ```
   bitcoin-cli -datadir=/tmp/rip createrawtransaction \
     '[{"txid":"<FUNDING_TXID>","vout":<N>,"sequence":4294967294}]' \
     '[{"<BEARER_ADDR_N>":0.000625},{"data":"<MESSAGE_HEX_N>"}]' \
     <HEIGHT_N>
   ```
9. **Verify before signing.** The verifier decodes all 30 unsigned transactions
   and asserts every field against the config — outpoint, sequence < max, exact
   locktime, output address and amount, OP_RETURN bytes, fee, no stray outputs.
   Thirty passes, or one loud failure. Nothing proceeds on a failure.

**Phase 2 — Sign (BUILDER ⇄ SIGNER, QR only).**

10. For each of the 30 PSBTs: the BUILDER shows it as animated QR; the SIGNER
    scans, displays destination / amount / locktime on its own screen, you
    confirm, it signs SIGHASH_ALL and shows the signature QR; the BUILDER scans it
    back. No USB, no network — the air gap, crossed by light.
11. **BUILDER** — finalise each signed PSBT to broadcast-ready raw hex.

**Phase 3 — Verify signed (BUILDER).**

12. The verifier runs again on the signed transactions: re-assert every field,
    confirm a valid signature on each, and confirm each coupon's input txid matches
    the funding tx's actual txid.

**Phase 4 — Extract (BUILDER → Out-USB).**

13. Write the 30 signed raw transactions (public data — they reveal no secret) to
    the Out-USB, together with the per-tablet face data to be engraved.
14. Shut the laptop down. RAM is wiped; the build environment ceases to exist.

**Phase 5 — Dry run, then broadcast (ONLINE → NODE, LAN).**

15. Plug the Out-USB into ONLINE. Dry run first:
    `bitcoin-cli -rpcconnect=<node-ip> testmempoolaccept '["<FUNDING_HEX>"]'` →
    expect `allowed: true`. (A coupon tested now returns `non-final` — that is the
    timelock working, not an error.)
16. Broadcast: `bitcoin-cli -rpcconnect=<node-ip> sendrawtransaction <FUNDING_HEX>`,
    then the death inscription (it chains straight behind). Watch for confirmation
    on the node.
17. The 28 coupons are **not** broadcast. They go onto the tablets and into the
    published record, to be carried to the chain at their maturities.

**Phase 6 — Proof of Death.**

18. Publish: the funding txid, the 28 signed coupon transactions, the schedule,
    and the death inscription.
19. **Destroy the author key** — wipe the SeedSigner, destroy the temporary
    SeedQR. This is the burn. It happens *after* broadcast and confirmation (step
    16), never before: you confirm the money moved correctly, then destroy the
    ability to move it any other way.

**Phase 7 — Mint (physical, after).**

20. For each tablet: engrave the face (below), seal the bearer key (steel plate,
    beeswax, encase, fire). The tablets then circulate; each is broadcast when its
    era arrives.

### The tablet face

The face is public and permanent — cast in the mould, impressed per-tablet before
firing, then fired. It carries everything a stranger needs, in any future era, to
verify the tablet and broadcast it — and nothing secret. The redemption key is
sealed inside, never on the face.

Every face carries six things:

1. **The signed coupon transaction** — the functional payload, in two forms: a QR
   to scan, and the full raw hex as engraved text. The hex is the century-proof
   fallback; QR standards may change, hexadecimal will not. This is what gets
   broadcast.
2. **The maturation height** — the block at or after which it can be broadcast.
3. **The index** — N of 28.
4. **The two heights** — the funding block (birth) and the destruction block
   (death), where a headstone's dates would go. No name.
5. **The message** — the OP_RETURN line in plain text, legible now; it also rides
   inside the transaction and surfaces on-chain when broadcast.
6. **The funding txid** — the verification anchor: it lets any holder reconcile
   this coupon against the one published funding transaction and confirm the tablet
   belongs to the edition.

Of these, the two heights and the funding txid are the same on all twenty-eight —
the edition's shared dates and anchor. The index, maturation height, return,
message, and coupon transaction are the tablet's own.

Worked example — tablet 5 of 28 (illustrative values):

```
RIP                                         05 / 28

birth block     1,000,000
death block     1,001,000

matures at      1,890,000      (~2044)
return          62,500 sats

message         "Five halvings gone. If you are reading
                 this, I never was."            [example]

edition txid    a1b2c3d4…e5f69f3c   (funding transaction)

coupon tx       [ QR of the signed transaction ]
                02000000000101 8f3c… 00000000   (same
                transaction as hex, engraved beneath the
                QR — ~180 bytes, the durable fallback)

        — redemption key sealed inside, not on the face —
```

The mould casts the fixed furniture — the RIP mark, the field labels, the frame —
once; only the per-tablet values are impressed into each casting before firing. On
the late tablets the return prints as a number too small to be worth broadcasting;
the face carries it unchanged. The money dies on schedule; the face does not.

### Building the tablets

- **Body** — clay, cast in a mould. Fire as earthenware or low stoneware
  (~1000–1250 °C), well below stainless steel's melting point and clear of
  porcelain temperatures.
- **Key** — the redemption key engraved on a stainless steel plate (a
  high-chromium grade resists oxide scaling; cut the letterforms deep so they stay
  legible through any surface scale), coated in beeswax, encased in the clay, and
  fired with it. The wax burns off early; its job is to stop the clay fusing to the
  steel and to leave a burnout gap so the non-shrinking plate does not crack the
  shrinking clay.
- **Tests before committing the edition** — fire sacrificial tablets to confirm
  (1) the engraving stays legible after firing and (2) the tablet survives the
  steel inclusion without cracking. Both are empirical; settle them before any real
  key goes in the kiln.
- **Redemption is destructive by construction.** The key is inside fired clay, so
  claiming means breaking the tablet. Decide between shattering the whole tablet and
  a scored panel that cracks off a corner (leaving a visibly-claimed relic). Either
  way, the message has already reached the chain at the maturity broadcast, before
  the clay is broken.

### Notes & assumptions

- **Separation is the safeguard.** Construction (BUILDER), signing (SIGNER), and
  broadcasting (NODE) never share a machine. That separation — not any single
  device — is what protects the ceremony. The tempting shortcuts (build on the
  node; build on the phone; build on the signer) each collapse it.
- **USB direction discipline.** Code and config go *in* (online → BUILDER);
  finished public transactions come *out* (BUILDER → online). No USB carries a key,
  and no single stick round-trips. The inbound direction is the one to guard: it
  determines what you sign. The outbound is safe — a signed transaction is public
  and cannot be tampered without invalidating its signature.
- **Rehearse on regtest first.** The one genuinely tricky step is signing coupons
  against funding outputs that do not exist on-chain yet (the `witness_utxo`
  injection in step 8). Run the whole pipeline on regtest with throwaway keys and
  scaled-down heights — mine to a locktime, confirm each coupon is rejected before
  its height and pays the right address after it — before any real key is made.
- **Finality is immutability, not publication.** Signing fixes each transaction
  forever; it does not guarantee any will be mined. Confirmation depends on the fee
  market and relay policy of the day, which no present signature can fix.
- **The near-zero fee is intentional.** It removes the ordinary fee-market fallback
  so inclusion depends on a willing miner reached by a living carrier — the wager
  that the piece stays worth carrying.
- **Consensus-validity over the span.** The design uses only long-stable primitives
  — a segwit spend, nLockTime, one OP_RETURN, SIGHASH_ALL. Soft forks are built not
  to invalidate transactions like these. As safe as Bitcoin offers, though not a
  literal guarantee across 113 years.
- **Minting is trusted.** The author transiently knows the 28 redemption keys while
  sealing them; the sealing process must destroy every generation record — the same
  trust model as any physical-bitcoin mint.

---

## Part 2 — Collecting: redemption

For a holder, at or after a tablet's maturity. Needs no secret from the author and
no permission — only the tablet, a way to reach the chain, and, for a dusted
tablet, a willing miner.

### Per-tablet procedure

1. **Check maturity.** Read the maturation height from the face. On any explorer or
   node, confirm the current block height has reached it. Before that, the
   transaction cannot confirm and the sealed address holds nothing.
2. **Broadcast the coupon.** Read it from the face (QR or hex) and submit it. If
   ordinary nodes relay it, it is mined like any transaction.
3. **If relay refuses it** — which happens once the return has fallen below the
   dust threshold — the transaction is still *valid*, only non-standard. Hand it
   directly to a miner willing to include it. It never expires: a matured tablet is
   a standing offer to every future miner until one includes it.
4. **Wait for confirmation.** The return lands at the sealed address, and the
   message surfaces on-chain in the same transaction.
5. **Open the tablet and sweep.** Break the tablet (or its scored panel), extract
   the steel plate, and import the redemption key to move the return to your own
   wallet. The tablet is now a claimed relic; the money is yours; the message is
   public.

### Notes

- **Breaking early is pointless.** The sealed address holds nothing until the
  coupon confirms at maturity, so there is nothing to steal by opening a tablet
  ahead of time.
- **The words outlast the object.** Redemption destroys the tablet but not its
  message, written to the chain at step 4, before the clay was broken.
- **Verifying a tablet.** Every coupon spends an output of the one published
  funding transaction. Check that the face's transaction matches the published set,
  spends the expected funding output, pays the stated return, and carries the stated
  nLockTime and message. A tablet that does not reconcile with the published funding
  txid is not of the edition.

---

## Optional tools (no secrets)

Three helpers may be built as ordinary software, since none touches a key:

- a **schedule calculator** — maturation heights and returns per era;
- an **asset generator** — the face layout, QR, and inscription text per tablet;
- a **public verifier** — reconciles a tablet against the published funding
  transaction and reports its maturity and message.

The transaction-building coordinator is **not** on this list. It runs on the
airgapped BUILDER and must never be networked.
