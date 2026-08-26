#!/usr/bin/env node
/**
 * Append CometChat + Turbotic soft() entries into software.ts (idempotent).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SEED_PATH = path.join(ROOT, "src/data/seed/software.ts");
const SNIPPETS = [
  "_affiliate-new-cometchat-seed-snippet.ts",
  "_affiliate-new-turbotic-seed-snippet.ts",
];
const MIN_EXPECTED_ENTRIES = 230;

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
  const exportIdx = source.indexOf("\nexport const softwareSeed");
  const fnIdx =
    exportIdx >= 0 ? exportIdx : source.indexOf("\nfunction soft(");
  if (fnIdx < 0) throw new Error("Could not find softwareSeed export");
  const before = source.slice(0, fnIdx);
  const closeIdx = before.lastIndexOf("];");
  if (closeIdx < 0) throw new Error("Could not find softwareSeedRaw close");
  return closeIdx;
}

function countExistingEntries(source) {
  return (source.match(/^\s{2}soft\(\{/gm) ?? []).length;
}

function main() {
  let source = fs.readFileSync(SEED_PATH, "utf8");
  const existing = countExistingEntries(source);
  if (existing < MIN_EXPECTED_ENTRIES) {
    console.error(`Refusing: only ${existing} soft() entries`);
    process.exit(1);
  }

  const toInsert = [];
  const skipped = [];

  for (const file of SNIPPETS) {
    const snippetPath = path.join(ROOT, "scripts", file);
    if (!fs.existsSync(snippetPath)) {
      console.error(`Missing ${snippetPath} — run onboard batch first`);
      process.exit(1);
    }
    const blocks = extractSoftBlocks(fs.readFileSync(snippetPath, "utf8"));
    for (const block of blocks) {
      const slug = slugFromBlock(block);
      if (!slug) continue;
      if (source.includes(`id: "soft-${slug}"`)) {
        skipped.push(slug);
        continue;
      }
      toInsert.push(block);
    }
  }

  if (!toInsert.length) {
    console.log("Nothing to insert — products already in software.ts");
    return;
  }

  const closeIdx = findSoftwareSeedClose(source);
  let prefix = source.slice(0, closeIdx);
  const suffix = source.slice(closeIdx);
  prefix = prefix.replace(/\}\)\s*$/, "}),");
  source = `${prefix}\n${toInsert.join("\n")}\n${suffix}`;
  fs.writeFileSync(SEED_PATH, source, "utf8");
  console.log(`Inserted: ${toInsert.map(slugFromBlock).join(", ")}`);
  if (skipped.length) console.log(`Skipped: ${skipped.join(", ")}`);
}

main();
