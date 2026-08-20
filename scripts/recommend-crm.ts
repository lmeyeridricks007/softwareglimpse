#!/usr/bin/env npx tsx
/**
 * CRM finder CLI — deterministic recommendations from fixtures or inline criteria.
 *
 * Usage:
 *   npm run recommend:crm -- --fixture small-sales-team
 *   npm run recommend:crm -- --fixture simple-crm --debug
 *   npm run recommend:crm -- --debug
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { getAllSoftwareUnfiltered } from "../src/data";
import { loadEnrichment } from "../src/data/research/store";
import { crmFinderConfig } from "../src/data/config/recommendation/crm-finder-v1";
import {
  buildProductSnapshot,
  formatScoreBreakdown,
  normalizeCrmFinderAnswers,
  recommendCrm,
} from "../src/services/recommendation";
import { CrmFinderAnswersSchema } from "../src/domain";

const FIXTURE_DIR = path.join(
  process.cwd(),
  "src/data/recommendation/fixtures",
);

function parseArgs(argv: string[]) {
  let fixture = "small-sales-team";
  let debug = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--fixture") {
      fixture = argv[++i] ?? fixture;
    } else if (arg?.startsWith("--fixture=")) {
      fixture = arg.slice("--fixture=".length);
    } else if (arg === "--debug") {
      debug = true;
    } else if (arg === "--list-fixtures") {
      return { listFixtures: true as const, fixture, debug };
    }
  }
  return { listFixtures: false as const, fixture, debug };
}

function loadFixture(name: string) {
  const filePath = path.join(
    FIXTURE_DIR,
    name.endsWith(".json") ? name : `${name}.json`,
  );
  if (!existsSync(filePath)) {
    const available = existsSync(FIXTURE_DIR)
      ? readdirSync(FIXTURE_DIR)
          .filter((f) => f.endsWith(".json"))
          .map((f) => f.replace(/\.json$/, ""))
      : [];
    throw new Error(
      `Fixture not found: ${filePath}\nAvailable: ${available.join(", ") || "(none)"}`,
    );
  }
  return CrmFinderAnswersSchema.parse(
    JSON.parse(readFileSync(filePath, "utf8")),
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.listFixtures) {
    const files = readdirSync(FIXTURE_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
    console.log(files.join("\n"));
    return;
  }

  const answers = loadFixture(args.fixture);
  const criteria = normalizeCrmFinderAnswers(answers, crmFinderConfig);

  const snapshots = getAllSoftwareUnfiltered().map((software) =>
    buildProductSnapshot({
      software,
      enrichment: loadEnrichment(software.slug),
    }),
  );

  const { results, emptyReason, methodologyVersion, exclusions } = recommendCrm(
    criteria,
    snapshots,
    crmFinderConfig,
  );

  console.log(`CRM Finder (${methodologyVersion})`);
  console.log(`Fixture: ${args.fixture}`);
  console.log(
    `Criteria: size=${criteria.companySizeSlug} users=${criteria.crmUsers} useCase=${criteria.primaryUseCaseSlug} budgetMax=${criteria.budgetPerUserMax ?? "none"}`,
  );
  console.log("");

  if (results.length === 0) {
    console.log(`No results. emptyReason=${emptyReason ?? "unknown"}`);
    if (exclusions?.length) {
      console.log("Exclusions:");
      for (const ex of exclusions) {
        console.log(`  - ${ex.productSlug}: ${ex.reason}`);
      }
    }
    return;
  }

  for (const [index, result] of results.entries()) {
    const rank = index + 1;
    console.log(
      `${rank}. ${result.name} (${result.productSlug}) — ${result.matchScore}% [${result.confidence}]`,
    );
    if (result.labels?.length) {
      console.log(`   labels: ${result.labels.join(", ")}`);
    }
    if (result.estimatedMonthlyTotal != null) {
      console.log(
        `   est. monthly: ${result.estimatedMonthlyTotal}${result.estimatedCurrency ? ` ${result.estimatedCurrency}` : ""}`,
      );
    }
    if (result.budgetFit) {
      console.log(`   budgetFit: ${result.budgetFit}`);
    }
    if (result.reasons.length) {
      console.log("   reasons:");
      for (const reason of result.reasons.slice(0, 5)) {
        console.log(`     [${reason.code}] ${reason.text}`);
      }
    }
    if (result.tradeoffs.length) {
      console.log("   tradeoffs:");
      for (const tradeoff of result.tradeoffs.slice(0, 4)) {
        console.log(`     [${tradeoff.code}] ${tradeoff.text}`);
      }
    }
    if (args.debug) {
      console.log("   breakdown:");
      console.log(formatScoreBreakdown(result.breakdown));
      if (result.unknowns.length) {
        console.log(`   unknowns: ${result.unknowns.join(", ")}`);
      }
    }
    console.log("");
  }

  if (args.debug && exclusions?.length) {
    console.log("Exclusions / notes:");
    for (const ex of exclusions) {
      console.log(`  - ${ex.productSlug}: ${ex.reason}`);
    }
  }
}

main();
