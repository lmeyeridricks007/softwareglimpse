#!/usr/bin/env node
/**
 * Run software asset discovery for affiliate-gap reconcile products.
 */
import { execSync } from "node:child_process";

const SLUGS = [
  "navan",
  "bolt-for-business",
  "carepatron",
  "dext",
  "flexiquiz",
  "freshteam",
  "accelerated-growth-studio",
  "birch",
  "databox",
  "diginius",
  "evolve",
  "lucrovox",
  "zypper",
  "aira",
  "emergent",
  "rank-prompt",
  "nicejob",
  "shore",
  "flippa",
  "shipbob",
  "ueni",
  "contractor-foreman",
  "mrpeasy",
  "vektoros",
  "servicem8",
  "fastmail",
  "sanebox",
];

const root = new URL("..", import.meta.url).pathname;

const rows = [];

for (const slug of SLUGS) {
  console.log(`\n========== ${slug} ==========\n`);
  try {
    const out = execSync(
      `npx tsx scripts/software-asset-discovery-agent.ts --product ${slug} --write --json 2>/dev/null`,
      { cwd: root, encoding: "utf8", env: process.env },
    );
    const parsed = JSON.parse(out);
    const audit = parsed.audits?.[0];
    rows.push({
      slug,
      coverage: audit?.coverageRating ?? "?",
      addNow: audit?.summary?.addNow ?? 0,
      videos: audit?.summary?.officialVideosFound ?? 0,
      action: audit?.summary?.recommendedNextAction ?? "",
      ok: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    rows.push({ slug, ok: false, error: message.slice(0, 200) });
    console.error(`FAILED ${slug}:`, message.slice(0, 400));
  }
}

console.log("\n========== SUMMARY ==========\n");
for (const row of rows) {
  if (row.ok) {
    console.log(
      `${row.slug}\t${row.coverage}\taddNow=${row.addNow}\tvideos=${row.videos}\t${row.action}`,
    );
  } else {
    console.log(`${row.slug}\tFAILED\t${row.error}`);
  }
}

const failed = rows.filter((r) => !r.ok).length;
if (failed) process.exit(1);
