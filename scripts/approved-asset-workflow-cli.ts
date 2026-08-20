#!/usr/bin/env npx tsx
/**
 * Approved Asset Workflow CLI
 *
 * Discovery ≠ approval. Never auto-imports the discovery corpus.
 *
 *   npm run assets:approve -- list
 *   npm run assets:approve -- register --product hubspot --url URL --title "..." [--feature slug]
 *   npm run assets:approve -- inspect <id>
 *   npm run assets:approve -- verify-source <id> --kind vendor-channel [--channel "HubSpot"]
 *   npm run assets:approve -- review-relevance <id> --pass [--notes "..."]
 *   npm run assets:approve -- review-usage <id> --action embed|link|cite
 *   npm run assets:approve -- map <id> --product hubspot --feature workflow-automation
 *   npm run assets:approve -- place <id> --route /software/hubspot/ --type software-review --section features --section-title Features [--subsection "Workflow"]
 *   npm run assets:approve -- editorial-approve <id>
 *   npm run assets:approve -- import <id> [--persist] [--activate] [--dry-run]
 *   npm run assets:approve -- activate <id> [--persist]
 *   npm run assets:approve -- usage <id> --state embedded|linked|not-used|active|approved
 */
import type { OfficialSourceKind } from "@/domain";
import type { AssetRecommendationAction } from "@/domain/schemas/asset-discovery";
import type { AssetUsageState } from "@/domain/schemas/approved-asset-workflow";
import {
  activateImportedAsset,
  addPlacementRecommendation,
  editorialApproveCandidate,
  importApprovedAsset,
  inspectApprovedAssetCandidate,
  listApprovedAssetCandidates,
  loadApprovedAssetCandidate,
  mapCandidateEntities,
  markCandidateUsageState,
  registerApprovedAssetCandidate,
  reviewCandidateRelevance,
  reviewCandidateUsage,
  saveApprovedAssetCandidate,
  savePlacementRecommendation,
  verifyCandidateSource,
} from "@/services/asset-discovery/approval";

function flag(argv: string[], name: string): boolean {
  return argv.includes(name);
}

function opt(argv: string[], name: string): string | undefined {
  const i = argv.indexOf(name);
  if (i < 0) return undefined;
  return argv[i + 1];
}

function multi(argv: string[], name: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === name && argv[i + 1]) {
      out.push(argv[i + 1]!);
      i++;
    }
  }
  return out;
}

function requireCandidate(id: string | undefined) {
  if (!id) {
    console.error("Candidate id required");
    process.exit(1);
  }
  const c = loadApprovedAssetCandidate(id);
  if (!c) {
    console.error(`Candidate not found: ${id}`);
    process.exit(1);
  }
  return c;
}

function main(): void {
  const argv = process.argv.slice(2);
  const cmd = argv[0] ?? "help";

  if (cmd === "list") {
    const stage = opt(argv, "--stage");
    let items = listApprovedAssetCandidates();
    if (stage) items = items.filter((c) => c.stage === stage);
    if (flag(argv, "--json")) {
      console.log(JSON.stringify(items, null, 2));
      return;
    }
    console.log(`Approval queue (${items.length})`);
    for (const c of items) {
      console.log(
        `  ${c.id}  [${c.stage}]  usage=${c.usageState}  ${c.title.slice(0, 60)}`,
      );
    }
    return;
  }

  if (cmd === "register") {
    const url = opt(argv, "--url");
    const title = opt(argv, "--title");
    const product = opt(argv, "--product");
    const feature = opt(argv, "--feature");
    const result = registerApprovedAssetCandidate({
      sourceUrl: url,
      title,
      productSlug: product,
      whatThisShows: multi(argv, "--shows"),
      sourceOrganization: opt(argv, "--org"),
    });
    if (!result.ok) {
      console.error(result.message);
      process.exit(1);
    }
    let candidate = result.candidate;
    if (feature) {
      candidate = {
        ...candidate,
        mapping: {
          ...candidate.mapping,
          featureIds: [...new Set([...candidate.mapping.featureIds, feature])],
        },
      };
    }
    const path = saveApprovedAssetCandidate(candidate);
    console.log(`Registered ${candidate.id} → DISCOVERED`);
    console.log(`Saved ${path}`);
    console.log(
      "Next: verify-source → review-relevance → review-usage → map → place → editorial-approve → import",
    );
    return;
  }

  if (cmd === "inspect") {
    const c = requireCandidate(argv[1]);
    const report = inspectApprovedAssetCandidate(c);
    if (flag(argv, "--json")) {
      console.log(JSON.stringify(report, null, 2));
      return;
    }
    console.log(`Inspect ${c.id}`);
    for (const line of report.checklist) console.log(`  • ${line}`);
    console.log(`  Next gate: ${report.nextGate}`);
    if (report.dedupeHint) console.log(`  Dedupe: ${report.dedupeHint}`);
    if (report.healthHint) console.log(`  Health: ${report.healthHint}`);
    if (report.placements.length) {
      console.log("  Placements:");
      for (const p of report.placements) {
        console.log(
          `    - ${p.pageRoute} → ${p.sectionTitle}${p.subsection ? ` / ${p.subsection}` : ""} (${p.recommendedUse})`,
        );
      }
    }
    return;
  }

  if (cmd === "verify-source") {
    const c = requireCandidate(argv[1]);
    const kind = (opt(argv, "--kind") ?? "vendor-channel") as OfficialSourceKind;
    const result = verifyCandidateSource(c, {
      officialSourceKind: kind,
      sourceOrganization: opt(argv, "--org"),
      channelName: opt(argv, "--channel"),
      productSlug: opt(argv, "--product"),
    });
    if (!result.ok) {
      console.error(result.message);
      process.exit(1);
    }
    saveApprovedAssetCandidate(result.candidate);
    console.log(`${result.candidate.id} → SOURCE_VERIFIED`);
    return;
  }

  if (cmd === "review-relevance") {
    const c = requireCandidate(argv[1]);
    const passed = flag(argv, "--pass") && !flag(argv, "--fail");
    if (!flag(argv, "--pass") && !flag(argv, "--fail")) {
      console.error("Specify --pass or --fail");
      process.exit(1);
    }
    const result = reviewCandidateRelevance(c, {
      passed,
      notes: opt(argv, "--notes"),
      whatThisShows: multi(argv, "--shows"),
    });
    if (!result.ok) {
      console.error(result.message);
      process.exit(1);
    }
    saveApprovedAssetCandidate(result.candidate);
    console.log(`${result.candidate.id} → ${result.candidate.stage}`);
    return;
  }

  if (cmd === "review-usage") {
    const c = requireCandidate(argv[1]);
    const action = opt(argv, "--action") as AssetRecommendationAction | undefined;
    if (!action) {
      console.error("--action embed|link|cite|do-not-use required");
      process.exit(1);
    }
    const result = reviewCandidateUsage(c, {
      recommendation: action,
      notes: opt(argv, "--notes"),
    });
    if (!result.ok) {
      console.error(result.message);
      process.exit(1);
    }
    saveApprovedAssetCandidate(result.candidate);
    console.log(`${result.candidate.id} → ${result.candidate.stage}`);
    return;
  }

  if (cmd === "map") {
    const c = requireCandidate(argv[1]);
    const products = multi(argv, "--product");
    const features = multi(argv, "--feature");
    const capabilities = multi(argv, "--capability");
    const requirements = multi(argv, "--requirement");
    const useCases = multi(argv, "--use-case");
    const industries = multi(argv, "--industry");
    const guides = multi(argv, "--guide");
    const result = mapCandidateEntities(c, {
      mapping: {
        ...(products.length ? { productIds: products } : {}),
        ...(features.length ? { featureIds: features } : {}),
        ...(capabilities.length ? { capabilityIds: capabilities } : {}),
        ...(requirements.length ? { requirementIds: requirements } : {}),
        ...(useCases.length ? { useCaseIds: useCases } : {}),
        ...(industries.length ? { industryIds: industries } : {}),
        ...(guides.length ? { guideIds: guides } : {}),
      },
    });
    if (!result.ok) {
      console.error(result.message);
      process.exit(1);
    }
    saveApprovedAssetCandidate(result.candidate);
    console.log(`${result.candidate.id} → MAPPED`);
    console.log(JSON.stringify(result.candidate.mapping, null, 2));
    return;
  }

  if (cmd === "place") {
    const c = requireCandidate(argv[1]);
    const route = opt(argv, "--route");
    const pageType = opt(argv, "--type") ?? "software-review";
    const sectionId = opt(argv, "--section") ?? "features";
    const sectionTitle = opt(argv, "--section-title") ?? sectionId;
    if (!route) {
      console.error("--route required");
      process.exit(1);
    }
    const { candidate, placement } = addPlacementRecommendation(c, {
      pageRoute: route,
      pageType,
      sectionId,
      sectionTitle,
      subsection: opt(argv, "--subsection"),
      mediaPlacement: (opt(argv, "--media-placement") as
        | "overview"
        | "features"
        | "use-cases"
        | "screenshots"
        | "implementation"
        | "evidence"
        | undefined) ?? "features",
      recommendedUse: (opt(argv, "--use") as AssetRecommendationAction) ?? "embed",
      reason: opt(argv, "--reason") ?? "Editorial placement recommendation",
    });
    savePlacementRecommendation(placement);
    saveApprovedAssetCandidate(candidate);
    console.log(`Placement ${placement.id}`);
    console.log(
      `  ${placement.pageRoute} → ${placement.sectionTitle}${placement.subsection ? ` / ${placement.subsection}` : ""}`,
    );
    return;
  }

  if (cmd === "editorial-approve") {
    const c = requireCandidate(argv[1]);
    const result = editorialApproveCandidate(c, {
      commentary: opt(argv, "--notes"),
    });
    if (!result.ok) {
      console.error(result.message);
      process.exit(1);
    }
    saveApprovedAssetCandidate(result.candidate);
    console.log(`${result.candidate.id} → EDITORIALLY_APPROVED`);
    console.log("Ready for: import [--persist] [--activate]");
    return;
  }

  if (cmd === "import") {
    const c = requireCandidate(argv[1]);
    const { result, candidate } = importApprovedAsset(c, {
      persist: flag(argv, "--persist"),
      activate: flag(argv, "--activate"),
      dryRun: flag(argv, "--dry-run"),
    });
    if (result.ok && !flag(argv, "--dry-run")) {
      saveApprovedAssetCandidate(candidate);
    }
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exit(1);
    return;
  }

  if (cmd === "activate") {
    const c = requireCandidate(argv[1]);
    const { result, candidate } = activateImportedAsset(c, {
      persist: flag(argv, "--persist"),
    });
    if (result.ok) saveApprovedAssetCandidate(candidate);
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exit(1);
    console.log(
      "Health: npm run audit:media-health -- " +
        (candidate.mapping.productIds[0] ?? "<product>"),
    );
    return;
  }

  if (cmd === "usage") {
    const c = requireCandidate(argv[1]);
    const state = opt(argv, "--state") as AssetUsageState | undefined;
    if (!state) {
      console.error("--state approved|active|embedded|linked|not-used required");
      process.exit(1);
    }
    const next = markCandidateUsageState(c, state, {
      note: opt(argv, "--notes"),
    });
    saveApprovedAssetCandidate(next);
    console.log(`${next.id} usageState → ${state}`);
    return;
  }

  console.log(`Approved Asset Workflow

Discovery does NOT equal approval. Do not auto-import discovered assets.

Commands:
  list [--stage STAGE] [--json]
  register --product <slug> --url <url> --title <title> [--feature <id>] [--shows "..."]
  inspect <id> [--json]
  verify-source <id> --kind vendor-channel [--channel Name] [--org Name]
  review-relevance <id> --pass|--fail [--shows "..."] [--notes "..."]
  review-usage <id> --action embed|link|cite|do-not-use
  map <id> --product <slug> [--feature id] [--capability id] [--use-case id] [--guide id]
  place <id> --route /path/ --section features --section-title Features [--subsection "..."]
  editorial-approve <id>
  import <id> [--persist] [--activate] [--dry-run]
  activate <id> [--persist]
  usage <id> --state embedded|linked|not-used|active|approved

Lifecycle:
  DISCOVERED → SOURCE_VERIFIED → RELEVANCE_REVIEWED → USAGE_REVIEWED
    → MAPPED → EDITORIALLY_APPROVED → ACTIVE

After ACTIVE, run: npm run audit:media-health
`);
}

main();
