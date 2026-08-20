#!/usr/bin/env npx tsx
/**
 * SoftwareGlimpse category onboarding CLI
 *
 * Usage:
 *   npm run onboard:category -- email-marketing
 *   npm run onboard:category -- email-marketing --dry-run
 *   npm run onboard:category -- crm --reconcile
 *   npm run onboard:category:status -- email-marketing
 *   npm run onboard:category:list
 *   npm run onboard:category:validate
 *
 * Activating a category flips software onboarding categoryContentReady.
 * Does NOT auto-publish hubs, best pages, or rankings.
 */
import {
  __resetDataCaches,
  getAllCategoriesUnfiltered,
  getCategoryBySlug,
} from "@/data";
import {
  findCategoryDefinitionSeedByName,
  getCategoryDefinitionSeed,
  listCategoryDefinitionSeeds,
} from "@/data/category-onboarding/seed";
import {
  findLatestCategoryRun,
  isCategoryActivated,
  listCategoryOnboardingRuns,
  loadActivatedCategory,
  loadCategoryOnboardingRun,
} from "@/data/category-onboarding/store";
import { getCategoryOnboardingOverride } from "@/data/config/onboarding/policy";
import type { CategoryOnboardingRequest } from "@/domain";
import {
  formatCategoryScorecard,
  onboardCategory,
  validateCategoryOnboardingRepository,
} from "@/services/category-onboarding/server";
import { onboardSoftware } from "@/services/onboarding/server";

type Args = {
  command: string;
  positional: string[];
  dryRun: boolean;
  resume?: string;
  reconcile: boolean;
  parent?: string;
  json: boolean;
  resumeSoftware?: string;
};

function usage(exitCode = 1): never {
  console.error(`SoftwareGlimpse category onboarding CLI

Commands:
  category <name-or-slug>   Onboard / reconcile a category
  status <slug>             Latest run + activation status
  list                      Category readiness overview
  graph <slug>              Parent, features, products, content, agents
  validate                  Validate category onboarding store
  resume-software <slug>    Resume product onboarding after category activation

Flags:
  --dry-run
  --resume <run-id>
  --reconcile
  --parent <slug>
  --json

Examples:
  npm run onboard:category -- email-marketing
  npm run onboard:category -- crm --reconcile
  npm run onboard:category -- email-marketing --dry-run --json
`);
  process.exit(exitCode);
}

function parseArgs(argv: string[]): Args {
  if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") usage(0);

  let command = argv[0]!;
  let rest = argv.slice(1);

  const known = new Set([
    "category",
    "status",
    "list",
    "graph",
    "validate",
    "resume-software",
  ]);
  if (!known.has(command)) {
    rest = [command, ...rest];
    command = "category";
  }

  const positional: string[] = [];
  let dryRun = false;
  let resume: string | undefined;
  let reconcile = false;
  let parent: string | undefined;
  let json = false;

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i]!;
    if (arg === "--") continue;
    if (arg === "--dry-run") dryRun = true;
    else if (arg === "--json") json = true;
    else if (arg === "--reconcile") reconcile = true;
    else if (arg === "--resume") resume = rest[++i];
    else if (arg === "--parent") parent = rest[++i];
    else if (arg.startsWith("-")) {
      console.error(`Unknown flag: ${arg}`);
      usage(1);
    } else positional.push(arg);
  }

  return { command, positional, dryRun, resume, reconcile, parent, json };
}

async function cmdCategory(args: Args): Promise<void> {
  if (args.resume) {
    const existing =
      loadCategoryOnboardingRun(args.resume) ??
      listCategoryOnboardingRuns().find((r) => r.id === args.resume);
    if (!existing) {
      console.error(`Run not found: ${args.resume}`);
      process.exit(1);
    }
    const run = await onboardCategory(
      {
        ...existing.request,
        options: {
          ...existing.request.options,
          dryRun: args.dryRun,
          resumeRunId: args.resume,
          activate: !args.dryRun,
        },
      },
      { resumeRunId: args.resume },
    );
    outputRun(run, args.json);
    process.exit(run.status === "failed" || run.status === "blocked" ? 1 : 0);
  }

  const nameOrSlug = args.positional[0];
  if (!nameOrSlug) {
    console.error("Missing category name/slug");
    usage(1);
  }

  const seed =
    getCategoryDefinitionSeed(nameOrSlug) ??
    findCategoryDefinitionSeedByName(nameOrSlug);
  const name = seed?.name ?? nameOrSlug;
  const slug = seed?.slug ?? nameOrSlug;

  const existingCat = getCategoryBySlug(slug, { includeUnpublished: true });

  const request: CategoryOnboardingRequest = {
    name,
    slug,
    parentCategorySlug: args.parent ?? seed?.parentSlug ?? undefined,
    source: args.reconcile ? "catalogue-analysis" : "manual",
    seedProductSlugs: seed?.seedProductSlugs ?? [],
    options: {
      dryRun: args.dryRun,
      reconcile: args.reconcile || Boolean(existingCat),
      activate: !args.dryRun,
    },
  };

  __resetDataCaches();
  const run = await onboardCategory(request);
  outputRun(run, args.json);
  process.exit(run.status === "failed" || run.status === "blocked" ? 1 : 0);
}

function outputRun(
  run: Awaited<ReturnType<typeof onboardCategory>>,
  json: boolean,
): void {
  if (json) {
    console.log(JSON.stringify(run, null, 2));
    return;
  }
  console.log(`\nRun: ${run.id}`);
  console.log(`Category: ${run.categorySlug}`);
  console.log(`Mode: ${run.mode}`);
  console.log(`Status: ${run.status}`);
  console.log(`Activated: ${run.activated}`);
  console.log(`Duplicate: ${run.duplicateOutcome ?? "n/a"}`);
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
  if (run.memberships.length) {
    console.log("\nMembership:");
    for (const role of ["primary", "secondary", "adjacent", "uncertain"] as const) {
      const items = run.memberships.filter((m) => m.role === role);
      if (!items.length) continue;
      console.log(`  ${role.toUpperCase()}`);
      for (const m of items) {
        console.log(
          `    ${m.productSlug} (${m.confidence}${m.existsInCatalogue ? "" : ", not in catalogue"}) — ${m.reason}`,
        );
      }
    }
  }
  if (run.issues.length) {
    console.log("\nIssues:");
    for (const issue of run.issues) {
      console.log(`  [${issue.severity}] ${issue.code}: ${issue.message}`);
    }
  }
  if (run.scorecard) {
    console.log("\n" + formatCategoryScorecard(run.scorecard));
  }
  if (run.agentContext) {
    console.log(`\nAgent context: ${run.agentContext.contextRef}`);
  }
  console.log(
    "\nReminder: category onboarding does not publish pages or invent rankings.",
  );
}

function cmdStatus(args: Args): void {
  const slug = args.positional[0];
  if (!slug) usage(1);
  const run = findLatestCategoryRun(slug);
  const activated = loadActivatedCategory(slug);
  const override = getCategoryOnboardingOverride(slug);
  const def = getCategoryDefinitionSeed(slug);

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          slug,
          activated: Boolean(activated),
          categoryContentReady: override.categoryContentReady,
          latestRun: run,
          definitionVersion: def?.configVersion ?? activated?.configVersion,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`\n${def?.name ?? slug}`);
  console.log(`State: ${activated ? "ACTIVE" : run?.status ?? "NOT ONBOARDED"}`);
  console.log(`Software onboarding ready: ${override.categoryContentReady}`);
  if (def) {
    console.log(`Features: ${def.features.length}`);
    console.log(`Use cases: ${def.useCases.length}`);
    console.log(`Research model: READY`);
    console.log(`Editorial methodology: ${def.editorialMethodology.slug}`);
    console.log(`Comparison methodology: READY`);
    console.log(`Pricing: ${def.pricingCapability}`);
    console.log(`Finder: ${def.finderReadiness}`);
  }
  if (run) {
    console.log(`\nLatest run: ${run.id} (${run.status})`);
  }
}

function cmdList(args: Args): void {
  const seeds = listCategoryDefinitionSeeds();
  const cats = getAllCategoriesUnfiltered().filter((c) => !c.parentSlug || c.slug === "email-marketing" || seeds.some((s) => s.slug === c.slug));

  const rows = new Map<string, { name: string; status: string }>();
  for (const c of cats) {
    const override = getCategoryOnboardingOverride(c.slug);
    const activated = isCategoryActivated(c.slug);
    const seed = getCategoryDefinitionSeed(c.slug);
    let status = "NOT ONBOARDED";
    if (activated || override.categoryContentReady)
      status = override.categoryContentReady ? "READY" : "PARTIAL";
    else if (seed) status = "DEFINITION READY";
    rows.set(c.slug, { name: c.name, status });
  }
  for (const seed of seeds) {
    if (!rows.has(seed.slug)) {
      rows.set(seed.slug, {
        name: seed.name,
        status: isCategoryActivated(seed.slug) ? "READY" : "DEFINITION READY",
      });
    }
  }

  if (args.json) {
    console.log(JSON.stringify([...rows.entries()].map(([slug, v]) => ({ slug, ...v })), null, 2));
    return;
  }

  console.log("Category".padEnd(24) + "Status");
  for (const [slug, v] of [...rows.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(v.name.padEnd(24) + v.status + ` (${slug})`);
  }
}

function cmdGraph(args: Args): void {
  const slug = args.positional[0];
  if (!slug) usage(1);
  const def = getCategoryDefinitionSeed(slug) ?? loadActivatedCategory(slug)?.definition;
  if (!def) {
    console.error(`No definition for ${slug}`);
    process.exit(1);
  }
  const run = findLatestCategoryRun(slug);
  const payload = {
    parent: def.parentSlug,
    features: def.features.map((f) => f.slug),
    useCases: def.useCases.map((u) => u.slug),
    adjacent: def.scope.adjacentCategorySlugs,
    memberships: run?.memberships ?? [],
    content: run?.contentCandidates ?? [],
    agents: run?.agentTasks ?? [],
    contextRef: run?.agentContext?.contextRef,
  };
  if (args.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  console.log(`\n${def.name} graph`);
  console.log(`Parent: ${def.parentSlug ?? "(root)"}`);
  console.log(`Features (${def.features.length}): ${def.features.map((f) => f.slug).join(", ")}`);
  console.log(`Use cases: ${def.useCases.map((u) => u.slug).join(", ")}`);
  console.log(`Adjacent: ${def.scope.adjacentCategorySlugs.join(", ")}`);
  if (run?.memberships.length) {
    console.log("Products:");
    for (const m of run.memberships) {
      console.log(`  [${m.role}] ${m.productSlug}`);
    }
  }
  if (run?.contentCandidates.length) {
    console.log("Content candidates:");
    for (const c of run.contentCandidates.slice(0, 12)) {
      console.log(`  ${c.pageType.padEnd(18)} ${c.canonicalPath} (${c.status})`);
    }
  }
}

async function cmdResumeSoftware(args: Args): Promise<void> {
  const productSlug = args.positional[0];
  const categorySlug = args.positional[1] ?? "email-marketing";
  if (!productSlug) usage(1);

  const override = getCategoryOnboardingOverride(categorySlug);
  if (!override.categoryContentReady) {
    console.error(
      `Category ${categorySlug} not ready. Run: npm run onboard:category -- ${categorySlug}`,
    );
    process.exit(1);
  }

  const run = await onboardSoftware({
    name: productSlug,
    slug: productSlug,
    source: "manual",
    suggestedCategoryIds: [categorySlug],
    aliases: [],
    options: {
      dryRun: args.dryRun,
      runResearch: false,
      createContentPlan: true,
      allowFixtures: true,
      autoApproveResearch: false,
      mergeResearch: false,
    },
  });

  if (args.json) {
    console.log(JSON.stringify(run, null, 2));
    return;
  }

  console.log(`Software onboarding status: ${run.status}`);
  console.log(
    `Category: ${categorySlug} (contentReady=${override.categoryContentReady})`,
  );
  const blocked = run.issues.filter((i) => i.code === "CATEGORY_NOT_READY");
  console.log(
    blocked.length
      ? "Still CATEGORY_NOT_READY"
      : "CATEGORY_NOT_READY cleared — content plan may proceed",
  );
  const productPage = run.pageCandidates.find(
    (p) => p.pageType === "software-review",
  );
  console.log(`Product page status: ${productPage?.status ?? "n/a"}`);
}

function cmdValidate(args: Args): void {
  const issues = validateCategoryOnboardingRepository();
  if (args.json) {
    console.log(JSON.stringify({ ok: issues.length === 0, issues }, null, 2));
  } else if (issues.length === 0) {
    console.log("Category onboarding validation: PASS");
  } else {
    console.log(`Category onboarding validation: ${issues.length} issue(s)`);
    for (const issue of issues) {
      console.log(`  - [${issue.code}] ${issue.message}`);
    }
  }
  process.exit(issues.length ? 1 : 0);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  switch (args.command) {
    case "category":
      await cmdCategory(args);
      break;
    case "status":
      cmdStatus(args);
      break;
    case "list":
      cmdList(args);
      break;
    case "graph":
      cmdGraph(args);
      break;
    case "validate":
      cmdValidate(args);
      break;
    case "resume-software":
      await cmdResumeSoftware(args);
      break;
    default:
      usage(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
