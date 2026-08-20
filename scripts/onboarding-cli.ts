#!/usr/bin/env npx tsx
/**
 * SoftwareGlimpse software onboarding CLI
 *
 * Usage:
 *   npm run onboard:software -- getresponse --source affiliate-catalogue
 *   npm run onboard:software -- getresponse --dry-run --skip-research
 *   npm run onboard:software -- --resume onboard-getresponse-...
 *   npm run onboard:status -- getresponse
 *   npm run onboard:list
 *   npm run onboard:plan -- getresponse
 *   npm run onboard:validate
 *
 * Successful onboarding = READY FOR CONTENT PIPELINE — never auto-publishes.
 */
import { __resetDataCaches, getSoftwareBySlug } from "@/data";
import {
  findAffiliateCatalogueEntry,
} from "@/data/seed/affiliate-catalogue";
import {
  findLatestRunForSlug,
  listManifests,
  listOnboardingRuns,
  loadOnboardingRun,
} from "@/data/onboarding/store";
import type { SoftwareOnboardingRequest, SoftwareOnboardingRun } from "@/domain";
import {
  formatScorecard,
  onboardSoftware,
  validateOnboardingRepository,
} from "@/services/onboarding/server";

type Args = {
  command: string;
  positional: string[];
  dryRun: boolean;
  resume?: string;
  skipResearch: boolean;
  research: boolean;
  category?: string;
  source?: SoftwareOnboardingRequest["source"];
  json: boolean;
};

function usage(exitCode = 1): never {
  console.error(`SoftwareGlimpse software onboarding CLI

Commands:
  software <name-or-slug>   Run onboarding / reconcile
  status <slug>             Show latest run scorecard
  list                      List onboarded products / runs
  plan <slug>               Show content plan from latest run
  validate                  Validate onboarding store

Flags:
  --dry-run                 No persistent writes (candidate/run still computed)
  --resume <run-id>         Resume blocked/partial run
  --skip-research           Skip research pipeline stage
  --research                Force research (default when not skipped)
  --category <slug>         Suggested primary category
  --source <source>         affiliate-catalogue | manual | migration | existing-content
  --json                    Machine-readable output

Examples:
  npm run onboard:software -- getresponse --source affiliate-catalogue
  npm run onboard:software -- pipedrive --skip-research
  npm run onboard:status -- getresponse
  npm run onboard:plan -- getresponse --json

Notes:
  - Does NOT auto-publish pages or assign editorial scores / best rankings
  - Affiliate absence does not block onboarding
  - Affiliate data never affects recommendation rankings
`);
  process.exit(exitCode);
}

function parseArgs(argv: string[]): Args {
  if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") {
    usage(0);
  }

  let command = argv[0]!;
  let rest = argv.slice(1);

  // Allow: npm run onboard:software -- getresponse  (package.json maps to onboard software)
  if (command !== "software" && command !== "status" && command !== "list" && command !== "plan" && command !== "validate") {
    rest = [command, ...rest];
    command = "software";
  }

  const positional: string[] = [];
  let dryRun = false;
  let resume: string | undefined;
  let skipResearch = false;
  let research = true;
  let category: string | undefined;
  let source: SoftwareOnboardingRequest["source"] | undefined;
  let json = false;

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i]!;
    if (arg === "--") continue;
    if (arg === "--dry-run") dryRun = true;
    else if (arg === "--json") json = true;
    else if (arg === "--skip-research") {
      skipResearch = true;
      research = false;
    } else if (arg === "--research") research = true;
    else if (arg === "--resume") resume = rest[++i];
    else if (arg === "--category") category = rest[++i];
    else if (arg === "--source") {
      source = rest[++i] as SoftwareOnboardingRequest["source"];
    } else if (arg.startsWith("-")) {
      console.error(`Unknown flag: ${arg}`);
      usage(1);
    } else {
      positional.push(arg);
    }
  }

  return {
    command,
    positional,
    dryRun,
    resume,
    skipResearch,
    research: skipResearch ? false : research,
    category,
    source,
    json,
  };
}

function printRunHuman(run: SoftwareOnboardingRun): void {
  console.log(`\nRun: ${run.id}`);
  console.log(`Product: ${run.productSlug ?? "(none)"}`);
  console.log(`Mode: ${run.mode}`);
  console.log(`Status: ${run.status}`);
  console.log(`Affiliate: ${run.affiliateStatus}`);
  console.log(`Duplicate: ${run.duplicateOutcome ?? "n/a"}`);
  console.log(`Research: ${run.researchCompletenessPercent ?? 0}%`);
  console.log(`Pricing: ${run.pricingReadiness ?? "n/a"}`);
  console.log("");
  console.log("Stages:");
  for (const stage of run.stages) {
    const mark =
      stage.status === "completed"
        ? "✓"
        : stage.status === "blocked"
          ? "!"
          : stage.status === "skipped"
            ? "·"
            : "?";
    console.log(`  ${mark} ${stage.stageId} (${stage.status}) ${stage.summary ?? ""}`);
  }
  if (run.issues.length) {
    console.log("\nIssues:");
    for (const issue of run.issues) {
      console.log(`  [${issue.severity}] ${issue.code}: ${issue.message}`);
    }
  }
  if (run.scorecard) {
    console.log("\n" + formatScorecard(run.scorecard));
  }
  console.log(
    "\nReminder: onboarding does not publish pages or set editorial rankings.",
  );
}

async function cmdSoftware(args: Args): Promise<void> {
  if (args.resume) {
    const existing = loadOnboardingRun(args.resume);
    if (!existing) {
      console.error(`Run not found: ${args.resume}`);
      process.exit(1);
    }
    const run = await onboardSoftware(
      {
        ...existing.request,
        options: {
          ...existing.request.options,
          dryRun: args.dryRun,
          runResearch: args.research,
          resumeRunId: args.resume,
        },
      },
      { resumeRunId: args.resume },
    );
    if (args.json) {
      console.log(JSON.stringify(run, null, 2));
    } else {
      printRunHuman(run);
    }
    process.exit(run.status === "failed" ? 1 : 0);
  }

  const nameOrSlug = args.positional[0];
  if (!nameOrSlug) {
    console.error("Missing product name/slug");
    usage(1);
  }

  const affiliate = findAffiliateCatalogueEntry(nameOrSlug);
  const source =
    args.source ??
    (affiliate ? "affiliate-catalogue" : "manual");
  const name = affiliate?.productName ?? nameOrSlug;
  // Prefer canonical software slug when affiliate label slugifies differently (e.g. Apollo.io → apollo)
  const existingByArg = getSoftwareBySlug(nameOrSlug.toLowerCase(), {
    includeUnpublished: true,
  });
  const existingByAffiliateSlug = affiliate
    ? getSoftwareBySlug(affiliate.suggestedSlug, { includeUnpublished: true })
    : undefined;
  const existingByName = getSoftwareBySlug(
    // try slugified name without TLD-like .io
    nameOrSlug.toLowerCase().replace(/\.io$/i, ""),
    { includeUnpublished: true },
  );
  const existing =
    existingByArg ??
    existingByAffiliateSlug ??
    existingByName ??
    getSoftwareBySlug(
      (affiliate?.suggestedSlug ?? nameOrSlug)
        .toLowerCase()
        .replace(/-io$/, ""),
      { includeUnpublished: true },
    );
  const slug = existing?.slug ?? affiliate?.suggestedSlug ?? nameOrSlug.toLowerCase();

  const request: SoftwareOnboardingRequest = {
    name: existing?.name ?? name,
    slug,
    website: existing?.website ?? affiliate?.website ?? args.positional[1],
    source,
    affiliateProgramId: affiliate?.id,
    suggestedCategoryIds: args.category
      ? [args.category]
      : existing
        ? [existing.primaryCategorySlug]
        : affiliate?.categoryHint
          ? [affiliate.categoryHint]
          : [],
    aliases: affiliate?.aliases ?? [],
    entityTypeHint: affiliate?.entityTypeHint ?? existing?.entityType,
    options: {
      dryRun: args.dryRun,
      runResearch: args.research,
      createContentPlan: true,
      allowFixtures: true,
      autoApproveResearch: false,
      mergeResearch: false,
    },
  };

  __resetDataCaches();
  const run = await onboardSoftware(request);
  if (args.json) {
    console.log(JSON.stringify(run, null, 2));
  } else {
    printRunHuman(run);
  }
  process.exit(run.status === "failed" ? 1 : 0);
}

function cmdStatus(args: Args): void {
  const slug = args.positional[0];
  if (!slug) {
    console.error("Missing slug");
    usage(1);
  }
  const run = findLatestRunForSlug(slug) ?? listOnboardingRuns().find((r) =>
    r.productSlug === slug,
  );
  if (!run) {
    console.error(`No onboarding run for ${slug}`);
    process.exit(1);
  }
  if (args.json) {
    console.log(JSON.stringify(run, null, 2));
  } else {
    printRunHuman(run);
  }
}

function cmdList(args: Args): void {
  const runs = listOnboardingRuns();
  const bySlug = new Map<string, (typeof runs)[0]>();
  for (const run of runs) {
    if (!run.productSlug) continue;
    if (!bySlug.has(run.productSlug)) bySlug.set(run.productSlug, run);
  }
  const rows = [...bySlug.values()];
  if (args.json) {
    console.log(
      JSON.stringify(
        rows.map((r) => ({
          product: r.productSlug,
          status: r.status,
          research: r.researchCompletenessPercent ?? 0,
          mode: r.mode,
          runId: r.id,
        })),
        null,
        2,
      ),
    );
    return;
  }
  console.log(
    "Product".padEnd(16) +
      "Status".padEnd(18) +
      "Research".padEnd(10) +
      "Mode".padEnd(12) +
      "Run",
  );
  for (const r of rows) {
    console.log(
      (r.productSlug ?? "?").padEnd(16) +
        r.status.padEnd(18) +
        `${r.researchCompletenessPercent ?? 0}%`.padEnd(10) +
        r.mode.padEnd(12) +
        r.id,
    );
  }
  const manifests = listManifests();
  if (manifests.length) {
    console.log(`\nManifests: ${manifests.length}`);
  }
}

function cmdPlan(args: Args): void {
  const slug = args.positional[0];
  if (!slug) {
    console.error("Missing slug");
    usage(1);
  }
  const run = findLatestRunForSlug(slug);
  if (!run) {
    console.error(`No onboarding run for ${slug}. Run onboard:software first.`);
    process.exit(1);
  }
  if (args.json) {
    console.log(
      JSON.stringify(
        {
          product: run.productSlug,
          pages: run.pageCandidates,
          tasks: run.agentTasks,
          links: run.internalLinkCandidates,
        },
        null,
        2,
      ),
    );
    return;
  }
  console.log(`CONTENT PLAN — ${run.productSlug}\n`);
  for (const page of run.pageCandidates) {
    console.log(
      `${page.pageType.padEnd(18)} ${page.canonicalPath.padEnd(42)} ${page.status}`,
    );
    console.log(`  ${page.reason}`);
  }
  console.log("\nAgent tasks:");
  for (const task of run.agentTasks) {
    console.log(
      `  [${task.status}] ${task.agentType} ${task.id} — ${task.statusReason ?? ""}`,
    );
  }
}

function cmdValidate(args: Args): void {
  const issues = validateOnboardingRepository();
  if (args.json) {
    console.log(JSON.stringify({ ok: issues.length === 0, issues }, null, 2));
  } else if (issues.length === 0) {
    console.log("Onboarding validation: PASS");
  } else {
    console.log(`Onboarding validation: ${issues.length} issue(s)`);
    for (const issue of issues) {
      console.log(`  - [${issue.code}] ${issue.message}`);
    }
  }
  process.exit(issues.length ? 1 : 0);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  switch (args.command) {
    case "software":
      await cmdSoftware(args);
      break;
    case "status":
      cmdStatus(args);
      break;
    case "list":
      cmdList(args);
      break;
    case "plan":
      cmdPlan(args);
      break;
    case "validate":
      cmdValidate(args);
      break;
    default:
      usage(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
