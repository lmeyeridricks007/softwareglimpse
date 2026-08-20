#!/usr/bin/env node
/**
 * Appends soft() entries from scripts/_ecommerce-priority1-seed-snippet.ts into
 * src/data/seed/software.ts before the closing ]; of softwareSeed.
 *
 * Append-only and idempotent. Usage:
 *   node scripts/onboard-ecommerce-priority1-batch.mjs
 *   node scripts/patch-software-seed-ecommerce-priority1.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SEED_PATH = path.join(ROOT, "src/data/seed/software.ts");
const SNIPPET_PATH = path.join(ROOT, "scripts/_ecommerce-priority1-seed-snippet.ts");

const MIN_EXPECTED_ENTRIES = 180;

function extractSoftBlocks(snippetText) {
  const blocks = [];
  const startRe = /^(\s*)soft\(\{/gm;
  let match;
  while ((match = startRe.exec(snippetText))) {
    const start = match.index;
    let i = start + match[0].length;
    let depth = 1;
    let inStr = null;
    let escaped = false;
    for (; i < snippetText.length; i++) {
      const ch = snippetText[i];
      if (inStr) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (ch === inStr) inStr = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inStr = ch;
        continue;
      }
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          let end = i + 1;
          if (snippetText[end] === ")") end++;
          if (snippetText[end] === ",") end++;
          while (snippetText[end] === "\r") end++;
          if (snippetText[end] === "\n") end++;
          const block = snippetText.slice(start, end).replace(/\s+$/, "");
          const normalized = block.endsWith(",") ? block : `${block},`;
          const indented = normalized
            .split("\n")
            .map((line, idx) => (idx === 0 ? line.replace(/^\s*/, "  ") : line))
            .join("\n");
          blocks.push(indented.endsWith(",") ? indented : `${indented},`);
          break;
        }
      }
    }
  }
  return blocks;
}

function slugFromBlock(block) {
  const m = /id:\s*"soft-([^"]+)"/.exec(block);
  return m?.[1] ?? null;
}

function findSoftwareSeedClose(source) {
  const fnIdx = source.indexOf("\nfunction soft(");
  if (fnIdx < 0) {
    throw new Error("Could not find `function soft(` in software.ts");
  }
  const before = source.slice(0, fnIdx);
  const closeIdx = before.lastIndexOf("];");
  if (closeIdx < 0) {
    throw new Error("Could not find closing `];` of softwareSeed before soft()");
  }
  return closeIdx;
}

function countExistingEntries(source) {
  return (source.match(/^\s{2}soft\(\{/gm) ?? []).length;
}

function main() {
  if (!fs.existsSync(SNIPPET_PATH)) {
    console.error(
      `Missing ${SNIPPET_PATH}. Run: node scripts/onboard-ecommerce-priority1-batch.mjs`,
    );
    process.exit(1);
  }

  const snippet = fs.readFileSync(SNIPPET_PATH, "utf8");
  const blocks = extractSoftBlocks(snippet);
  if (!blocks.length) {
    console.error("No soft({...}) blocks found in snippet.");
    process.exit(1);
  }

  let source = fs.readFileSync(SEED_PATH, "utf8");
  const existing = countExistingEntries(source);
  if (existing < MIN_EXPECTED_ENTRIES) {
    console.error(
      `Refusing to patch: software.ts has ${existing} soft() entries, expected at least ${MIN_EXPECTED_ENTRIES}.`,
    );
    process.exit(1);
  }
  console.log(`software.ts baseline: ${existing} soft() entries`);

  const toInsert = [];
  const skipped = [];

  for (const block of blocks) {
    const slug = slugFromBlock(block);
    if (!slug) continue;
    if (
      source.includes(`id: "soft-${slug}"`) ||
      source.includes(`slug: "${slug}"`)
    ) {
      skipped.push(slug);
      continue;
    }
    toInsert.push(block);
  }

  if (!toInsert.length) {
    console.log(
      `Nothing to insert — all ${blocks.length} snippet product(s) already present.`,
    );
    if (skipped.length) console.log(`Skipped (existing): ${skipped.join(", ")}`);
    return;
  }

  const closeIdx = findSoftwareSeedClose(source);
  let prefix = source.slice(0, closeIdx);
  const suffix = source.slice(closeIdx);
  prefix = prefix.replace(/\}\)\s*$/, "}),");

  const insertion = `\n${toInsert.join("\n")}\n`;
  source = `${prefix}${insertion}${suffix}`;

  fs.writeFileSync(SEED_PATH, source, "utf8");

  const after = countExistingEntries(source);
  console.log(`Inserted ${toInsert.length} soft() entr(y/ies):`);
  for (const block of toInsert) console.log(`  - ${slugFromBlock(block)}`);
  if (skipped.length) console.log(`Skipped (already present): ${skipped.join(", ")}`);
  console.log(`software.ts now has ${after} soft() entries`);
}

main();
