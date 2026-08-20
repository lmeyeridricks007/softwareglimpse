#!/usr/bin/env node
/**
 * Appends soft() entries from scripts/_it-wave1-seed-snippet.ts into
 * src/data/seed/software.ts before the closing ]; of softwareSeed.
 *
 * Also wires IT-only primaries secondaryCategorySlugs: ["hr"] + HR use cases
 * without overwriting marketing primary fields, assessment, or review.
 *
 * Append-only and idempotent. Usage:
 *   node scripts/onboard-it-wave1-batch.mjs
 *   node scripts/patch-software-seed-it-wave1.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SEED_PATH = path.join(ROOT, "src/data/seed/software.ts");
const SNIPPET_PATH = path.join(ROOT, "scripts/_it-wave1-seed-snippet.ts");

/** Prior batches left ~154; refuse if seed looks truncated. */
const MIN_EXPECTED_ENTRIES = 150;

const require = createRequire(import.meta.url);

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

/**
 * Wire IT-only primaries as marketing-primary + HR secondary without destroying
 * marketing fields. Idempotent.
 */
function patchLearnworldsSecondary(source) {
  const marker = 'id: "soft-learnworlds"';
  const start = source.indexOf(marker);
  if (start < 0) {
    console.warn("IT-only primaries soft() entry not found — skip secondary HR wiring");
    return { source, changed: false };
  }

  // Bound the soft({...}) block roughly by finding the next soft({ or end of seed
  const blockStart = source.lastIndexOf("soft({", start);
  const nextSoft = source.indexOf("\n  soft({", start + marker.length);
  const blockEnd = nextSoft > 0 ? nextSoft : source.indexOf("\n];", start);
  if (blockStart < 0 || blockEnd < 0) {
    console.warn("Could not bound IT-only primaries soft() block");
    return { source, changed: false };
  }

  let block = source.slice(blockStart, blockEnd);
  let changed = false;

  if (!/secondaryCategorySlugs:\s*\[[^\]]*["']hr["']/.test(block)) {
    if (/secondaryCategorySlugs:\s*\[/.test(block)) {
      block = block.replace(
        /secondaryCategorySlugs:\s*\[/,
        'secondaryCategorySlugs: ["hr", ',
      );
    } else {
      block = block.replace(
        /primaryCategorySlug:\s*"marketing",/,
        'primaryCategorySlug: "marketing",\n    secondaryCategorySlugs: ["hr"],',
      );
    }
    changed = true;
  }

  // Merge HR use cases into useCaseSlugs without removing marketing ones
  const hrUseCases = ["employee-training", "sop-documentation"];
  const ucMatch = /useCaseSlugs:\s*(\[[^\]]*\])/.exec(block);
  if (ucMatch) {
    let list;
    try {
      list = JSON.parse(ucMatch[1].replace(/'/g, '"'));
    } catch {
      list = [];
    }
    const merged = [...list];
    for (const uc of hrUseCases) {
      if (!merged.includes(uc)) {
        merged.push(uc);
        changed = true;
      }
    }
    if (merged.length !== list.length || changed) {
      block = block.replace(
        ucMatch[0],
        `useCaseSlugs: ${JSON.stringify(merged)}`,
      );
    }
  }

  if (!changed) {
    console.log("IT-only primaries: secondary HR already wired");
    return { source, changed: false };
  }

  const next = source.slice(0, blockStart) + block + source.slice(blockEnd);
  console.log(
    'IT-only primaries: added secondaryCategorySlugs: ["hr"] + HR useCaseSlugs (marketing primary preserved)',
  );
  return { source: next, changed: true };
}

function main() {
  void require;
  if (!fs.existsSync(SNIPPET_PATH)) {
    console.error(
      `Missing ${SNIPPET_PATH}. Run: node scripts/onboard-it-wave1-batch.mjs`,
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

  const { source: afterLw, changed: lwChanged } = patchLearnworldsSecondary(source);
  source = afterLw;

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

  if (!toInsert.length && !lwChanged) {
    console.log(
      `Nothing to insert — all ${blocks.length} snippet product(s) already present.`,
    );
    if (skipped.length) console.log(`Skipped (existing): ${skipped.join(", ")}`);
    return;
  }

  if (toInsert.length) {
    const closeIdx = findSoftwareSeedClose(source);
    let prefix = source.slice(0, closeIdx);
    const suffix = source.slice(closeIdx);
    prefix = prefix.replace(/\}\)\s*$/, "}),");

    const insertion = `\n${toInsert.join("\n")}\n`;
    source = `${prefix}${insertion}${suffix}`;
  }

  fs.writeFileSync(SEED_PATH, source, "utf8");

  const after = countExistingEntries(source);
  if (toInsert.length) {
    console.log(`Inserted ${toInsert.length} soft() entr(y/ies):`);
    for (const block of toInsert) console.log(`  - ${slugFromBlock(block)}`);
  }
  if (skipped.length) console.log(`Skipped (already present): ${skipped.join(", ")}`);
  console.log(`software.ts now has ${after} soft() entries`);
}

main();
