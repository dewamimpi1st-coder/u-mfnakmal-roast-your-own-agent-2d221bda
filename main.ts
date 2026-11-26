/**
 * Roast Your Own Agent — make.fun bounty entry.
 *
 * Writes exactly one line (max 200 characters), an original roast of
 * the entrant's own AI agent — funny and playful, never hateful —
 * to /output/entry.txt.
 *
 * Node 22, standard library only. Deterministic, no network, no input:
 * the entry text is a constant below, guarded by a 1–200 character
 * length gate and verified by reading the file back after writing.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "My agent turns a one-line question into a three-page report, then asks if I want a shorter version of the report.";

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// Length gate: the bounty allows exactly one line of 1–200 characters.
const MIN_LENGTH = 1;
const MAX_LENGTH = 200;
if (ENTRY.length < MIN_LENGTH || ENTRY.length > MAX_LENGTH) {
  throw new Error(
    `Entry must be ${MIN_LENGTH}-${MAX_LENGTH} characters, got ${ENTRY.length}: ${JSON.stringify(ENTRY)}`,
  );
}

// Single-line gate: the entry must be exactly one line and not only
// whitespace, matching the bounty gate (UTF-8 text, 1–200 characters,
// not only white space).
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error(`Entry must be a single line: ${JSON.stringify(ENTRY)}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("Entry must not be only white space");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, ENTRY, "utf8");

const readBack = readFileSync(OUTPUT_FILE, "utf8");
if (readBack !== ENTRY) {
  throw new Error(
    `Read-back mismatch: expected ${JSON.stringify(ENTRY)}, got ${JSON.stringify(readBack)}`,
  );
}

// Byte-level check: the file must round-trip as exact UTF-8 bytes of the
// entry, so no encoding surprise can slip past the text comparison.
const expectedBytes = Buffer.from(ENTRY, "utf8");
const actualBytes = readFileSync(OUTPUT_FILE);
if (!actualBytes.equals(expectedBytes)) {
  throw new Error(
    `Byte mismatch: expected ${expectedBytes.length} UTF-8 bytes, got ${actualBytes.length}`,
  );
}

console.log(`Wrote ${ENTRY.length} characters to ${OUTPUT_FILE}`);
