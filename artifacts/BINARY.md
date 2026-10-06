# BINARY

*An Anonymous Art (AA) artifact.*

## What it is

BINARY takes the smallest possible unit of a BIP39 seed — one word — and gives it a physical, tactile form: 11 bits, no more, no less. It's a spinoff of CHECKSUM, which makes an entire seed's worth of binary computation visible at exhibition scale; BINARY does the same thing for a single word, at desk scale.

## The physical piece

A small wooden desk/office object: a row of **11 sliders**, styled after old in/out door indicators, each set to **0 or 1**. Together they form the binary index (0–2047) of one word from the canonical BIP39 wordlist.

- Built in wood, no power, no electronics.
- The right end carries an engraved QR code linking to the digital tool (below).
- The physical sliders and the digital tool are two **separate, non-interacting layers** — there's no sensor and no state transfer between them. Setting the wooden sliders doesn't set anything on screen, and vice versa.
- No text, no explanation anywhere on the object.

## The digital dashboard 

[dashboard link]

Scanning the QR code opens a single-page html companion tool with the same materials language as the object — dark iron plate, brass fittings, ivory sliders and keys — that works two ways:

**Sliders → word.** A row of 11 sliders, identical in spirit to the physical piece. Tap the top or bottom half of a slider to set it to 1 or 0. Once all 11 are set, the matching BIP39 word appears in the display above. A brass button at the end of the row forces a reveal at any point, treating any untouched slider as 0.

**Word → sliders.** A keyboard beneath the sliders. Only letters that can continue a valid BIP39 word stay active — everything else greys out as you type, so it's impossible to type anything that isn't a real word from the list. Once your letters exactly match a word, its binary index lights up on the same sliders above. A brass button at the end of the keyboard deletes the last letter.

Only one input drives the display at a time — touching the sliders hands control to the sliders, typing hands control to the keyboard, and switching between them clears the other. A red button at the end of the display box clears everything and starts over.

When a word is showing, its **position in the canonical list** (0001–2048) appears at the left of the display, for cross-referencing a printed copy of the wordlist.

## Two uses

1. **The BINARY object's QR destination** — scan the piece, check or explore a word's binary index digitally.
2. **A digital companion to CHECKSUM/ASRC** — a quick way to look up or verify individual word ↔ binary-index pairs without running the full relay machine, useful for testing, demonstrating, or cross-checking the same word-layer/binary-layer abstraction CHECKSUM's education panel explains.
