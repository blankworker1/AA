# BITBLOCK132 — Handover Note (v2)

*An Anonymous Art (AA) artifact. Concept stage, design largely resolved. Not yet built.*

## Concept

A standalone gallery piece: a 12×11 grid (132 total) of standard clear glass blocks, each independently addressable and internally lit. Each block represents one bit. The full grid is scaled to 132 bits — the entropy-plus-checksum length of a complete 12-word BIP39 seed, the same figure established in the [[CHECKSUM]] education panel — laid out as 12 rows of 11 blocks, one row per word.

The piece is controlled live via a touch webapp, in the same visual/UX family as [[BINARY]]'s companion webapp, served directly by an onboard ESP32 acting as its own WiFi access point. Anyone connected can tap a block to toggle it on/off, and can change a single shared "on" color that applies to all lit blocks. There is no reset, no default position, and no state persistence across power cycles — the grid always starts blank on power-up and holds state only in RAM while running, the same principle a SeedSigner uses: nothing sensitive can be at rest in the device, by design.

## Two use modes

- **Public/interactive:** AP left live, open control, grid state drifts continuously as visitors interact — functions as a live collaborative pattern generator as much as a bit-display.
- **Private/static:** pattern and color set once by whoever's installing the piece, then left running unattended and unchanged. The AP/touch-control layer is a flexibility feature here, not the primary mode of display.

Because there's no persistence, any real BIP39 seed a visitor sets on the grid is inherently transient — a power cycle or the next visitor's interaction erases it. The piece cannot hold a real key at rest.

## Physical build sequence

1. Cut a loop of RGB constant-voltage LED strip to the internal perimeter of one block's cavity (four short runs joined at corners, or one continuous run if the strip bends cleanly at that radius).
2. Solder the loop's leads to a single WS2811-based RGB pixel driver (external-LED-load type, one per block).
3. Solder short pigtail leads from the driver (data-in, data-out, +V, GND) long enough to reach from the block cavity down to the mortar bed at its base.
4. Bench-test each block sub-assembly individually before it goes into the frame — confirm the driver takes an address and lights its loop evenly.
5. Set blocks into the frame row by row, left to right, feeding leads into the horizontal mortar bed and splicing each block's data-out into the next block's data-in (chain order = bit order: row 1 block 1 = bit 0, etc.).
6. Run heavier-gauge +V power injection wires (separate from the thin data daisy-chain) down the same mortar channel at the end of every row — i.e. every 11th block.
7. Point/grout each row's joints only after confirming that row's wiring works — don't seal an untested joint.

## Electronics architecture

- One WS2811 RGB driver per block (132 total), each driving that block's wrapped strip loop, daisy-chained on a single data line.
- Power injection at the end of every row (every 11th block) — 12 injection points total, from a single appropriately-rated 12V supply.
- ESP32 (WROOM class) as the sole controller:
  - Hosts an open WiFi access point (no internet dependency)
  - Runs a small web server serving the touch UI (static HTML/JS/CSS)
  - Runs a WebSocket connection to the UI, so all connected clients see live state changes from any other visitor
  - Holds state in RAM only: 132 booleans (block on/off) + 1 shared RGB value (the "on" color) — no flash writes, no persistence
  - On each toggle or color-change message, updates its in-memory state and sends the corresponding WS2811 command(s) down the chain

## Parts list

| Item | Qty | Notes |
|---|---|---|
| Standard clear glass blocks (partition-wall type) | 132 | Confirm internal cavity size against strip loop dimensions before bulk order |
| RGB constant-voltage LED strip (12V) | ~132 short lengths (perimeter of one block cavity each) | Buy as one continuous reel, cut to length per block |
| WS2811-based RGB pixel driver (external-LED-load type) | 132 | One per block; confirm voltage matches strip spec |
| Hookup wire (thin gauge, data/GND daisy-chain) | Per block-to-block run × 131 joins | Routed through mortar beds |
| Heavier-gauge power wire (+V injection runs) | 12 runs (one per row) | Sized to current draw per row at full brightness |
| 12V power supply | 1 | Sized to total wattage: strip watts/metre × total metres, with headroom |
| ESP32 dev board (WROOM class) | 1 | WiFi AP + WebSocket server + WS2811 output |
| Frame/structure for freestanding 12×11 grid | 1 (fabricated) | Self-supporting, not load-bearing — gallery piece, not architectural wall |
| Mortar/grout (for joints + cable channels) | As needed | Must accommodate embedded wire runs at horizontal beds |
| Solder, connectors, wire ties etc. | As needed | Standard build consumables |

## Status

Design substantially resolved at concept level: form factor, addressing scheme, fabrication method, control architecture, and interaction model are all decided. Not yet built, sourced, or costed. This document is the handover point for parts specification and costing.

## Relationship to other pieces

Third in the same conceptual family as [[relay-checksum-machine]] (CHECKSUM/ASRC, exhibition-scale working machine) and [[binary-word-slider]] (BINARY, desk-scale single word) — same core idea, a bit made physically visible, at three different scales and registers. No shared build dependency with either, but shares the ephemeral/no-persistent-key design principle with CHECKSUM's ceremony step, and the touch-webapp control language with BINARY's companion app.
