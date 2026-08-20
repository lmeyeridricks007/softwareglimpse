#!/usr/bin/env npx tsx
/**
 * CRM pricing CLI — pure engine over researched snapshots.
 *
 * Usage:
 *   npm run pricing:crm -- --fixture small-team-automation
 *   npm run pricing:crm -- --users 15 --features workflow-automation,reporting --billing annual
 *   npm run pricing:crm -- --list-fixtures
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  CrmRequirementsSchema,
  formatMoney,
  toMajor,
  type CrmRequirements,
} from "@/domain";
import { compareProductCosts } from "@/services/pricing";
import { listAllCrmPricingSnapshots } from "@/services/pricing/server";
import { CRM_PRICING_CONFIG } from "@/data/config/pricing/crm-pricing-v1";

const FIXTURE_DIR = path.join(process.cwd(), "src/data/pricing/fixtures");

function parseArgs(argv: string[]) {
  let fixture: string | undefined;
  let users: number | undefined;
  let features: string[] | undefined;
  let billing: "monthly" | "annual" | "either" = "either";
  let sort: "lowest-cost" | "input-order" | "finder-order" = "lowest-cost";
  let listFixtures = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--fixture") {
      fixture = argv[++i];
    } else if (arg?.startsWith("--fixture=")) {
      fixture = arg.slice("--fixture=".length);
    } else if (arg === "--users") {
      users = Number(argv[++i]);
    } else if (arg?.startsWith("--users=")) {
      users = Number(arg.slice("--users=".length));
    } else if (arg === "--features") {
      features = (argv[++i] ?? "").split(",").filter(Boolean);
    } else if (arg?.startsWith("--features=")) {
      features = arg.slice("--features=".length).split(",").filter(Boolean);
    } else if (arg === "--billing") {
      billing = (argv[++i] as typeof billing) ?? billing;
    } else if (arg?.startsWith("--billing=")) {
      billing = arg.slice("--billing=".length) as typeof billing;
    } else if (arg === "--sort") {
      sort = (argv[++i] as typeof sort) ?? sort;
    } else if (arg === "--list-fixtures") {
      listFixtures = true;
    }
  }

  return { fixture, users, features, billing, sort, listFixtures };
}

function loadFixture(name: string): CrmRequirements {
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
  return CrmRequirementsSchema.parse(
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

  let requirements: CrmRequirements;
  if (args.users != null) {
    requirements = CrmRequirementsSchema.parse({
      crmUsers: args.users,
      requiredFeatureSlugs: args.features ?? [],
      billingPreference: args.billing,
    });
  } else {
    requirements = loadFixture(args.fixture ?? "small-team-automation");
  }

  const snapshots = listAllCrmPricingSnapshots();
  const comparison = compareProductCosts(snapshots, requirements, {
    sortMode: args.sort,
    now: new Date("2026-08-13T12:00:00.000Z"),
  });

  console.log(`CRM pricing engine (${CRM_PRICING_CONFIG.version})`);
  console.log(
    `Users: ${requirements.crmUsers} | Features: ${requirements.requiredFeatureSlugs.join(", ") || "(none)"} | Billing: ${requirements.billingPreference}`,
  );
  console.log(
    `Eligible CRM products: ${snapshots.map((s) => s.productSlug).join(", ")}`,
  );
  console.log(`Sort: ${comparison.sortMode}`);
  console.log("");

  for (const r of comparison.results) {
    const plan = r.recommendedPlan
      ? `${r.recommendedPlan.name} (${r.recommendedPlan.slug})`
      : "—";
    const monthlyEq =
      r.monthlyEquivalent != null
        ? formatMoney(r.monthlyEquivalent)
        : "—";
    const annual =
      r.annualCost != null ? formatMoney(r.annualCost) : "—";
    const monthlyCash =
      r.monthlyCashCost != null
        ? formatMoney(r.monthlyCashCost)
        : "n/a";

    console.log(`${r.productName} [${r.productSlug}]`);
    console.log(`  status: ${r.status} | confidence: ${r.confidence}`);
    console.log(`  plan: ${plan}`);
    console.log(
      `  monthlyEquivalent: ${monthlyEq} | monthlyCash: ${monthlyCash} | annualCost: ${annual}`,
    );
    if (r.monthlyEquivalent) {
      console.log(
        `  (major: ${toMajor(r.monthlyEquivalent)} ${r.currency}/mo eq)`,
      );
    }
    if (r.warnings.length) {
      console.log(`  warnings: ${r.warnings.join(", ")}`);
    }
    if (r.explanation) {
      console.log(`  note: ${r.explanation}`);
    }
    console.log("");
  }

  for (const note of comparison.notes) {
    console.log(`Note: ${note}`);
  }
}

main();
