#!/usr/bin/env node
/**
 * Run onboard:software + workflow:execute for all affiliate-gap partial products.
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

function run(cmd) {
  execSync(cmd, { cwd: root, stdio: "inherit", env: process.env });
}

const results = [];

for (const slug of SLUGS) {
  console.log(`\n========== ${slug} ==========\n`);
  try {
    run(`npm run workflow:execute -- software ${slug} --json`);
    results.push({ slug, status: "ok" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`FAILED ${slug}: ${msg}`);
    results.push({ slug, status: "failed", error: msg.slice(0, 200) });
  }
}

console.log("\n=== SUMMARY ===");
for (const r of results) {
  console.log(`${r.slug}: ${r.status}`);
}
