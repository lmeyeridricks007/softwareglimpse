import type { AuditPageResult } from "../audit-report";
import type { ContentQualityDimensionId } from "@/domain/schemas/content-quality";
import { stableImprovementId } from "../intelligence/stable-ids";
import { findMapNode, loadContentMapNodes } from "./content-map";
import type {
  ContentMapNode,
  Effort,
  FixClass,
  ImprovementOpportunity,
  ImprovementType,
  SystemicPattern,
} from "./types";

type Dim = {
  id: ContentQualityDimensionId;
  score: number;
  gap?: string;
  reason: string;
  recommendations: { summary: string }[];
};

function dim(
  result: AuditPageResult,
  id: ContentQualityDimensionId,
): Dim | undefined {
  const d = result.assessment.dimensions.find((x) => x.id === id);
  if (!d) return undefined;
  return {
    id,
    score: d.score,
    gap: d.gap,
    reason: d.reason,
    recommendations: d.recommendations,
  };
}

function targetScore(current: number, lift: number): number {
  return Math.min(100, current + lift);
}

function rankScore(input: {
  cqPriority: string;
  mapPriority?: string;
  currentScore: number;
  pageImportance: string;
  researchRequired: boolean;
  quickWin: boolean;
}): number {
  const cq =
    input.cqPriority === "CQ-P0"
      ? 40
      : input.cqPriority === "CQ-P1"
        ? 30
        : input.cqPriority === "CQ-P2"
          ? 15
          : 5;
  const map =
    input.mapPriority === "P0"
      ? 35
      : input.mapPriority === "P1"
        ? 22
        : input.mapPriority === "P2"
          ? 10
          : input.mapPriority === "P3"
            ? 4
            : 8;
  const gap = Math.max(0, 85 - input.currentScore);
  const importance =
    input.pageImportance === "pillar"
      ? 20
      : input.pageImportance === "high-commercial"
        ? 14
        : input.pageImportance === "supporting"
          ? 6
          : 2;
  const quick = input.quickWin ? 8 : 0;
  const researchPenalty = input.researchRequired ? -3 : 0;
  return cq + map + gap + importance + quick + researchPenalty;
}

function industryDepthChange(route: string, map?: ContentMapNode): string {
  const name = route.replace(/^\/industries\//, "").replace(/\/$/, "");
  const label = name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return (
    `Replace generic CRM category copy on ${route} with ${label}-specific buying context: ` +
    `industry priorities (must/nice), industry workflows, compliance/security considerations, ` +
    `mapped use cases + capabilities, and buyer evaluation questions. ` +
    `Wire next step to CRM Finder${map?.tool ? ` (${map.tool})` : ""} and link related industry guides/resources from the content map` +
    `${map?.resource ? ` (${map.resource})` : ""}. Do not write product rankings until industry research depth exists.`
  );
}

function featureEvidenceChange(route: string): string {
  const slug = route.replace(/^\/features\//, "").replace(/\/$/, "");
  return (
    `The ${slug} feature page defines the concept but product-support claims lack verified enrichment evidence. ` +
    `Attach catalogue support cells only where ProductResearchEnrichment confirms support; add official docs/screenshot/video refs with verification dates; ` +
    `and keep unknowns marked rather than inventing matrix values. Link related requirements + capability hubs.`
  );
}

function bestPageChange(): string {
  return (
    "Best CRM (`/best/crm-software/`) is a P0 commercial pillar but still fails approved-recommendation / rationale-per-pick completeness and evidence depth. " +
    "Complete methodology-backed rationales for each approved pick, ensure eligibility rules are explicit, add a comparison/feature matrix only from verified support data, " +
    "and keep Finder + Vendor Scorecard as primary next steps. Do not expand copy until recommendation approvals and research evidence are complete."
  );
}

function toolCtaFor(pageType: string, map?: ContentMapNode): string[] {
  if (map?.tool && map.tool !== "soft" && map.tool !== "self") {
    return [`Surface existing tool CTA: ${map.tool}`];
  }
  if (
    pageType === "guide" ||
    pageType === "article" ||
    pageType === "industry" ||
    pageType === "use-case" ||
    pageType === "requirement"
  ) {
    return [
      "Add CTA to `/tools/crm-finder/` and/or `/tools/crm-requirements-builder/` where journey stage fits",
    ];
  }
  if (pageType === "best" || pageType === "product-review") {
    return ["Keep Finder / Compare / Calculator handoffs visible after verdict"];
  }
  if (pageType === "implementation-guide" || pageType === "product-guide") {
    return [
      "Link `/tools/crm-implementation-planner/` or `/tools/crm-migration-planner/` as operational next step",
    ];
  }
  return [];
}

function resourceFor(pageType: string, map?: ContentMapNode): string[] {
  if (map?.resource) return [`Link map resource ${map.resource}`];
  if (pageType === "guide" || pageType === "implementation-guide") {
    return [
      "Link existing `/resources/` checklist/scorecard when one matches the page job (do not invent a new PDF first)",
    ];
  }
  return [];
}

/**
 * Build concrete improvement opportunities for one audited page.
 * Evaluation/planning only — does not mutate content.
 */
export function opportunitiesForPage(
  result: AuditPageResult,
  mapByRoute: Map<string, ContentMapNode>,
  _seq?: { n: number },
): ImprovementOpportunity[] {
  const a = result.assessment;
  const map = findMapNode(mapByRoute, a.route);
  const out: ImprovementOpportunity[] = [];

  const push = ( partial: Omit<
      ImprovementOpportunity,
      "id" | "rankScore" | "route" | "pageType" | "currentScore" | "priority"
    > &
      Partial<Pick<ImprovementOpportunity, "priority">>,
  ) => {
    const primaryType = partial.types[0] ?? "EXPAND CONTENT";
    const id = stableImprovementId(a.route, primaryType, partial.problem);
    const priority = partial.priority ?? result.improvementPriority;
    const researchRequired = partial.researchRequired ?? false;
    const opportunity: ImprovementOpportunity = {
      id,
      route: a.route,
      pageType: a.pageType,
      currentScore: a.overallScore,
      targetScore: partial.targetScore,
      priority,
      mapPriority: map?.priority,
      mapNodeId: map?.id,
      mapCluster: map?.cluster,
      types: partial.types,
      fixClass: partial.fixClass,
      problem: partial.problem,
      whyItMatters: partial.whyItMatters,
      recommendedChange: partial.recommendedChange,
      sectionsAffected: partial.sectionsAffected ?? [],
      evidenceNeeded: partial.evidenceNeeded ?? [],
      visualMediaNeeded: partial.visualMediaNeeded ?? [],
      toolIntegration: partial.toolIntegration ?? [],
      resourceIntegration: partial.resourceIntegration ?? [],
      internalLinkChanges: partial.internalLinkChanges ?? [],
      relatedMapNodes: partial.relatedMapNodes ?? (map ? [map.id] : []),
      dependencies: partial.dependencies ?? [],
      researchRequired,
      effort: partial.effort,
      expectedOutcome: partial.expectedOutcome,
      quickWin: partial.quickWin ?? false,
      majorProject: partial.majorProject ?? false,
      systemic: partial.systemic ?? false,
      rankScore: 0,
      seoSignals: partial.seoSignals ?? [],
    };
    opportunity.rankScore = rankScore({
      cqPriority: opportunity.priority,
      mapPriority: opportunity.mapPriority,
      currentScore: opportunity.currentScore,
      pageImportance: result.pageImportance,
      researchRequired: opportunity.researchRequired,
      quickWin: opportunity.quickWin,
    });
    out.push(opportunity);
  };

  // --- Industry thin hubs (highest leverage systemic) ---
  if (a.pageType === "industry" && a.overallScore < 55) {
    push({
      targetScore: targetScore(a.overallScore, 40),
      types: ["EXPAND CONTENT", "ADD ORIGINAL ANALYSIS", "RESEARCH REQUIRED", "IMPROVE NEXT STEP"],
      fixClass: "DATA/RESEARCH FIX",
      problem:
        "Industry hub is effectively a generic CRM category page with industry keywords — missing industry priorities, use cases, implementation notes, security/compliance, and next-step modules.",
      whyItMatters:
        "Industry pages are high-commercial journey entry points; thin copies cannibalize the category hub and cannot support Finder/shortlist decisions.",
      recommendedChange: industryDepthChange(a.route, map),
      sectionsAffected: [
        "industry-priorities",
        "use-cases",
        "capabilities",
        "implementation-notes",
        "security-or-compliance",
        "next-step",
      ],
      evidenceNeeded: [
        "Industry workflow research",
        "Security/compliance considerations for the vertical",
        "Verified capability needs (not product rankings)",
      ],
      visualMediaNeeded: [
        "Industry workflow diagram",
        "Priorities / buying framework visual",
      ],
      toolIntegration: toolCtaFor(a.pageType, map),
      resourceIntegration: resourceFor(a.pageType, map),
      internalLinkChanges: [
        "Parent: /industries/ + /categories/crm/",
        "Child links to industry use-cases/capabilities when researched",
        "Next step: CRM Finder",
      ],
      dependencies: [
        "Industry research depth pass before editorial expansion",
        "Do not invent product fit claims",
      ],
      researchRequired: true,
      effort: "large",
      expectedOutcome:
        "Distinct vertical hub (target ≥80) that routes buyers into requirements/Finder instead of repeating category copy.",
      majorProject: true,
      systemic: true,
      priority: "CQ-P0",
    });
    return out;
  }

  // --- Best page ---
  if (a.pageType === "best") {
    const pageTypeGap = dim(result, "page-type-specific")?.gap ?? "";
    const rationaleIncomplete =
      /approved-recommendation|rationale-per-pick/i.test(pageTypeGap);
    if (rationaleIncomplete) {
      push({
        targetScore: targetScore(a.overallScore, 15),
        types: ["ADD EVIDENCE", "EXPAND CONTENT", "RESEARCH REQUIRED", "ADD TABLE"],
        fixClass: "DATA/RESEARCH FIX",
        problem:
          "Best CRM pillar lacks complete approved rationales per pick and evidence depth relative to its P0 commercial role.",
        whyItMatters:
          "Best pages drive choose-stage traffic; incomplete approvals/evidence risk ranking integrity and affiliate-bias issues.",
        recommendedChange: bestPageChange(),
        sectionsAffected: [
          "methodology",
          "recommendations",
          "rationales",
          "eligibility",
          "feature-matrix",
        ],
        evidenceNeeded: [
          "Approved recommendation rationales",
          "Verified feature support for matrix cells",
          "Pricing freshness checks for listed products",
        ],
        visualMediaNeeded: ["Comparison/feature matrix from verified data only"],
        toolIntegration: [
          "CRM Finder",
          "CRM Vendor Scorecard",
          "CRM Cost Calculator",
        ],
        resourceIntegration: ["RES scorecard / evaluation checklist if mapped"],
        internalLinkChanges: [
          "Product review links for each recommendation",
          "Related choose guides (How to Choose, Requirements)",
        ],
        dependencies: [
          "Editorial approval of recommendations",
          "Research complete status before index push",
        ],
        researchRequired: true,
        effort: "large",
        expectedOutcome:
          "Publishable Best page with methodology integrity and clear Finder handoff (target ≥90).",
        majorProject: true,
        priority: "CQ-P1",
      });
    }
    return out;
  }

  // --- Completeness ---
  const completeness = dim(result, "content-completeness");
  if (completeness && completeness.score <= 3 && a.pageType !== "industry") {
    const missing = completeness.gap?.replace(/^Missing:\s*/i, "") ?? "expected sections";
    push({
      targetScore: targetScore(a.overallScore, 8),
      types: ["EXPAND CONTENT", "RESTRUCTURE"],
      fixClass: "PAGE CONTENT FIX",
      problem: `${a.pageType} page is missing expected template sections: ${missing}.`,
      whyItMatters:
        "Incomplete page-type templates weaken decision support and make sibling pages inconsistent for users and agents.",
      recommendedChange:
        `Add the missing ${a.pageType} sections (${missing}) using the existing ${a.pageType} profile checklist — ` +
        `prefer structured blocks/modules already used on stronger sibling pages rather than freeform essay padding.`,
      sectionsAffected: missing.split(",").map((s) => s.trim()).filter(Boolean),
      evidenceNeeded: [],
      visualMediaNeeded: [],
      toolIntegration: toolCtaFor(a.pageType, map),
      resourceIntegration: resourceFor(a.pageType, map),
      internalLinkChanges: [],
      dependencies: [],
      researchRequired: /evidence|pricing|methodology/i.test(missing),
      effort: missing.split(",").length > 3 ? "medium" : "small",
      expectedOutcome: `Completeness dimension ≥4; clearer page-type contract on ${a.route}.`,
      quickWin: missing.split(",").length <= 2,
      majorProject: missing.split(",").length > 4,
    });
  }

  // --- Evidence ---
  const evidence = dim(result, "evidence-source-quality");
  if (evidence && evidence.score <= 2) {
    const isFeature = a.pageType === "feature";
    push({
      targetScore: targetScore(a.overallScore, isFeature ? 12 : 8),
      types: ["ADD EVIDENCE", "RESEARCH REQUIRED"],
      fixClass: "DATA/RESEARCH FIX",
      problem:
        evidence.gap ??
        "Claims or support matrices lack primary sources, verification dates, or fact refs.",
      whyItMatters:
        "Unsupported commercial/feature claims create trust and audit risk; research must precede copy expansion.",
      recommendedChange: isFeature
        ? featureEvidenceChange(a.route)
        : a.pageType === "product-review" || a.pageType === "comparison"
          ? `Attach official documentation / pricing sources to factual claims on ${a.route}, record verification dates, and remove or qualify unsupported superlatives. Prefer existing enrichment + research sources over new prose.`
          : `Do not expand narrative on ${a.route} until required research evidence exists. Add primary/official sources with verification dates for any factual claims, or mark unknowns explicitly.`,
      sectionsAffected: ["evidence", "sources", "product-support", "pricing"],
      evidenceNeeded: [
        "Official documentation URLs",
        "Verification dates",
        ...(a.pageType === "product-review" || a.pageType === "best"
          ? ["Pricing source freshness"]
          : []),
        ...(isFeature ? ["Enrichment support rows (no invented cells)"] : []),
      ],
      visualMediaNeeded:
        isFeature || a.pageType === "product-review"
          ? ["Official screenshots/videos only when verified"]
          : [],
      toolIntegration: [],
      resourceIntegration: [],
      internalLinkChanges: [],
      dependencies: ["Research refresh / enrichment before editorial rewrite"],
      researchRequired: true,
      effort: isFeature ? "medium" : "small",
      expectedOutcome: "Evidence dimension ≥3 with traceable sources; no invented support claims.",
      quickWin: !isFeature && a.pageType !== "best",
      majorProject: isFeature || a.pageType === "best",
      systemic: isFeature || a.pageType === "requirement",
    });
  }

  // --- Journey / next step ---
  const journey = dim(result, "journey-next-step");
  if (journey && journey.score <= 2) {
    push({
      targetScore: targetScore(a.overallScore, 6),
      types: ["IMPROVE NEXT STEP", "ADD TOOL CTA", "ADD INTERNAL LINKS"],
      fixClass: "LINK GRAPH FIX",
      problem:
        journey.gap ??
        "Page lacks a stage-appropriate next-step module for the CRM buyer journey.",
      whyItMatters:
        "Without a next step, readers stall after learning; journey architecture requires Learn→Requirements→Finder→Research→Compare→Implement handoffs.",
      recommendedChange:
        map?.nextStep
          ? `Add RecommendedNextStep on ${a.route} pointing to “${map.nextStep}” per content map ${map.id}, plus tool CTA where mapped (${map.tool || "Finder"}).`
          : `Add a RecommendedNextStep module on ${a.route} matching journey stage (${result.assessment.dimensions.find((d) => d.id === "journey-next-step") ? "see assessment" : "content map"}); prefer existing tools (Finder, Requirements Builder, Implementation Planner) over generic “related posts”.`,
      sectionsAffected: ["next-step"],
      evidenceNeeded: [],
      visualMediaNeeded: [],
      toolIntegration: toolCtaFor(a.pageType, map),
      resourceIntegration: resourceFor(a.pageType, map),
      internalLinkChanges: [
        map?.nextStep
          ? `Outbound next-step → ${map.nextStep}`
          : "Outbound next-step → stage-appropriate CRM page/tool",
      ],
      relatedMapNodes: map ? [map.id] : [],
      dependencies: [],
      researchRequired: false,
      effort: "small",
      expectedOutcome: "Journey/next-step dimension ≥4 with one clear primary action.",
      quickWin: true,
    });
  }

  // --- Internal linking ---
  const linking = dim(result, "internal-linking");
  if (linking && linking.score <= 2) {
    push({
      targetScore: targetScore(a.overallScore, 5),
      types: ["ADD INTERNAL LINKS"],
      fixClass: "LINK GRAPH FIX",
      problem:
        linking.gap ??
        "Parent/hub, supporting, tool/resource, or next-step links are incomplete.",
      whyItMatters:
        "Orphan or weakly linked pages underperform in the CRM graph and hide existing tools/resources.",
      recommendedChange:
        `Wire parent/hub + supports/supported-by + tool-for/resource-for links on ${a.route} per CRM linking blueprint` +
        `${map ? ` (node ${map.id}, cluster ${map.cluster})` : ""}. Prefer existing graph targets over inventing new URLs.`,
      sectionsAffected: ["related", "tools-or-resources", "next-step"],
      evidenceNeeded: [],
      visualMediaNeeded: [],
      toolIntegration: toolCtaFor(a.pageType, map),
      resourceIntegration: resourceFor(a.pageType, map),
      internalLinkChanges: [
        "Ensure ≥1 parent/hub inbound path",
        "Add 3–6 quality outbound graph links (not link spam)",
      ],
      dependencies: [],
      researchRequired: false,
      effort: "small",
      expectedOutcome: "Internal linking dimension ≥4; reduced orphan risk.",
      quickWin: true,
    });
  }

  // --- Decision support / actionability ---
  const decision = dim(result, "decision-support");
  const action = dim(result, "actionability");
  if (
    ((decision && decision.score <= 2) || (action && action.score <= 2)) &&
    a.pageType !== "industry"
  ) {
    push({
      targetScore: targetScore(a.overallScore, 7),
      types: ["ADD TOOL CTA", "ADD CHECKLIST", "ADD ORIGINAL ANALYSIS"],
      fixClass: "LINK GRAPH FIX",
      problem:
        "Page explains a topic but does not operationalize a decision (no scorecard/requirements/Finder/checklist handoff).",
      whyItMatters:
        "SoftwareGlimpse differentiates via decision tools and frameworks — narrative-only pages underuse existing platform assets.",
      recommendedChange:
        `Add a concrete decision module on ${a.route}: requirements/scorecard framing, best-fit scenarios, or vendor questions, ` +
        `then CTA into an existing tool (${toolCtaFor(a.pageType, map).join("; ") || "CRM Finder / Requirements Builder"}). ` +
        `Reuse existing resources instead of writing a new lead-gen landing.`,
      sectionsAffected: ["framework-or-steps", "tools-or-resources", "checklist", "next-step"],
      evidenceNeeded: [],
      visualMediaNeeded: [],
      toolIntegration: toolCtaFor(a.pageType, map),
      resourceIntegration: resourceFor(a.pageType, map),
      internalLinkChanges: [
        "Add tool-for / resource-for edges to existing CRM tools/resources",
      ],
      dependencies: [],
      researchRequired: false,
      effort: "medium",
      expectedOutcome: "Decision support + actionability ≥3 with a usable next action.",
      quickWin: false,
      majorProject: false,
      systemic: true,
    });
  }

  // --- Visuals ---
  const media = dim(result, "visual-media-support");
  if (media && media.score <= 2) {
    push({
      targetScore: targetScore(a.overallScore, 4),
      types: ["ADD VISUAL", "ADD SCREENSHOT", "ADD VIDEO"],
      fixClass:
        a.pageType === "product-review" || a.pageType === "feature"
          ? "DATA/RESEARCH FIX"
          : "PAGE CONTENT FIX",
      problem: media.gap ?? "Subject would benefit from teaching visuals but none are present.",
      whyItMatters:
        "Teaching visuals (workflow/matrix/screenshot) improve comprehension faster than more prose.",
      recommendedChange:
        a.pageType === "product-review" || a.pageType === "feature"
          ? `Add verified official screenshots/videos from enrichment for ${a.route}; never fabricate UI captures. Caption for teaching value.`
          : `Add one teaching figure (workflow, boundary, or worked example) unique to ${a.route}; avoid decorative-only art.`,
      sectionsAffected: ["workflow", "examples", "evidence"],
      evidenceNeeded:
        a.pageType === "product-review" || a.pageType === "feature"
          ? ["Verified official media with source URL"]
          : [],
      visualMediaNeeded: [
        a.pageType === "product-review" || a.pageType === "feature"
          ? "Official screenshot/video"
          : "Teaching diagram with caption",
      ],
      toolIntegration: [],
      resourceIntegration: [],
      internalLinkChanges: [],
      dependencies:
        a.pageType === "product-review" || a.pageType === "feature"
          ? ["Media research / enrichment"]
          : [],
      researchRequired:
        a.pageType === "product-review" || a.pageType === "feature",
      effort: "medium",
      expectedOutcome: "Visual/media dimension ≥3 with at least one teaching visual.",
      quickWin: a.pageType === "guide" || a.pageType === "article",
    });
  }

  // --- Differentiation ---
  const diff = dim(result, "content-differentiation");
  if (diff && diff.score <= 2 && a.pageType !== "industry") {
    push({
      targetScore: targetScore(a.overallScore, 10),
      types: ["MERGE CONTENT", "SPLIT CONTENT", "REMOVE / REDIRECT"],
      fixClass: "PAGE CONTENT FIX",
      problem:
        diff.gap ??
        "Page lacks a distinct purpose vs related siblings (duplicate intent / H1-only risk).",
      whyItMatters:
        "Duplicate intent wastes crawl budget and confuses buyers; content map expects one job per node.",
      recommendedChange:
        `Resolve overlap on ${a.route}: either deepen a unique job, merge into the canonical sibling, or redirect. ` +
        `Use content-map supports/supported-by edges${map ? ` for ${map.id}` : ""} to pick the surviving URL before writing new sections.`,
      sectionsAffected: ["definition", "direct-answer"],
      evidenceNeeded: [],
      visualMediaNeeded: [],
      toolIntegration: [],
      resourceIntegration: [],
      internalLinkChanges: ["Update inbound links to surviving canonical if merged"],
      dependencies: ["Editorial decision on canonical URL"],
      researchRequired: false,
      effort: "medium",
      expectedOutcome: "Distinct page purpose; differentiation dimension ≥4.",
      majorProject: true,
    });
  }

  // --- Freshness ---
  const fresh = dim(result, "research-freshness");
  if (fresh && fresh.score <= 2) {
    push({
      targetScore: targetScore(a.overallScore, 5),
      types: ["REFRESH RESEARCH"],
      fixClass: "DATA/RESEARCH FIX",
      problem: fresh.gap ?? "Research/pricing freshness is stale or unverified.",
      whyItMatters:
        "Stale pricing/features mislead buyers and fail research freshness policies.",
      recommendedChange:
        `Run research refresh for stale domains on ${a.route} (pricing ~30d, features ~90d) and re-verify sources before any copy rewrite.`,
      sectionsAffected: ["pricing", "features", "evidence"],
      evidenceNeeded: ["Updated source verification dates", "Pricing re-check if claimed"],
      visualMediaNeeded: [],
      toolIntegration: [],
      resourceIntegration: [],
      internalLinkChanges: [],
      dependencies: ["research:product / refresh workflow"],
      researchRequired: true,
      effort: "small",
      expectedOutcome: "Freshness within policy; freshness dimension ≥4.",
      quickWin: true,
    });
  }

  // Deduplicate if somehow empty but page is weak — one catch-all
  if (out.length === 0 && a.overallScore < 80) {
    push({
      targetScore: targetScore(a.overallScore, 6),
      types: ["EXPAND CONTENT"],
      fixClass: "PAGE CONTENT FIX",
      problem: `Overall score ${a.overallScore}/100 leaves improvement headroom on a ${result.pageImportance} page.`,
      whyItMatters: map
        ? `Content-map node ${map.id} (${map.priority}) expects stronger decision support.`
        : "Supporting pages should still meet page-type profile baselines.",
      recommendedChange:
        `Review weak dimensions on ${a.route} (see page quality report) and close the highest-weight gaps first — prefer tool/resource/next-step wiring and evidence before adding prose.`,
      sectionsAffected: a.weaknesses.slice(0, 3),
      evidenceNeeded: a.researchGaps.slice(0, 2),
      visualMediaNeeded: a.mediaGaps.slice(0, 2),
      toolIntegration: toolCtaFor(a.pageType, map),
      resourceIntegration: resourceFor(a.pageType, map),
      internalLinkChanges: a.linkingGaps.slice(0, 2),
      dependencies: [],
      researchRequired: a.researchGaps.length > 0,
      effort: "medium",
      expectedOutcome: `Raise ${a.route} into the next quality band.`,
      quickWin: false,
    });
  }

  return out;
}

export function detectSystemicPatterns(
  opportunities: ImprovementOpportunity[],
): SystemicPattern[] {
  const patterns: SystemicPattern[] = [];

  const group = (
    id: string,
    label: string,
    pred: (o: ImprovementOpportunity) => boolean,
    recommendation: string,
    suggestedFixClass: FixClass,
  ) => {
    const hits = opportunities.filter(pred);
    if (hits.length < 3) return;
    patterns.push({
      id,
      label,
      count: hits.length,
      pageTypes: [...new Set(hits.map((h) => h.pageType))],
      sampleRoutes: [...new Set(hits.map((h) => h.route))].slice(0, 8),
      suggestedFixClass,
      recommendation,
    });
  };

  group(
    "SYS-INDUSTRY-DEPTH",
    "Thin industry hubs need vertical research depth (not keyword swaps)",
    (o) => o.pageType === "industry" && o.types.includes("RESEARCH REQUIRED"),
    "Build an IndustryHub depth pipeline (priorities, workflows, compliance, use-case links, Finder CTA) and apply across remaining thin industries — do not hand-edit 12 near-identical pages independently.",
    "TEMPLATE FIX",
  );

  group(
    "SYS-FEATURE-EVIDENCE",
    "Feature pages lack verified product-support evidence",
    (o) => o.pageType === "feature" && o.types.includes("ADD EVIDENCE"),
    "Enforce feature detail quality gate: support matrix cells only from enrichment; block publish when evidence missing. Batch research-media for pillars.",
    "DATA/RESEARCH FIX",
  );

  group(
    "SYS-NEXT-STEP",
    "Pages missing journey next-step / tool CTA",
    (o) =>
      o.types.includes("IMPROVE NEXT STEP") || o.types.includes("ADD TOOL CTA"),
    "Add RecommendedNextStep + TryDecisionTool modules to page templates by journey stage so wiring is default, not per-page folklore.",
    "TEMPLATE FIX",
  );

  group(
    "SYS-LINK-GRAPH",
    "Internal linking gaps vs CRM linking blueprint",
    (o) => o.types.includes("ADD INTERNAL LINKS"),
    "Run internal-link agent / graph modules for parent, supports, tool-for, resource-for across affected templates.",
    "LINK GRAPH FIX",
  );

  group(
    "SYS-EVIDENCE",
    "Evidence/source verification gaps",
    (o) => o.types.includes("ADD EVIDENCE") || o.types.includes("REFRESH RESEARCH"),
    "Batch research refresh + source verification dating; require sources on commercial/feature claims before content expansion.",
    "DATA/RESEARCH FIX",
  );

  return patterns.sort((a, b) => b.count - a.count);
}

export function generateImprovementOpportunities(
  results: AuditPageResult[],
): {
  opportunities: ImprovementOpportunity[];
  patterns: SystemicPattern[];
  mapNodes: Map<string, ContentMapNode>;
} {
  const mapNodes = loadContentMapNodes();
  const opportunities = results
    .flatMap((r) => opportunitiesForPage(r, mapNodes))
    .sort((a, b) => b.rankScore - a.rankScore || a.currentScore - b.currentScore);

  // IDs are stable (route + type + problem hash) — do not renumber by sort order.

  const patterns = detectSystemicPatterns(opportunities);
  // Mark opportunities matching systemic patterns
  for (const p of patterns) {
    for (const o of opportunities) {
      if (
        (p.id === "SYS-INDUSTRY-DEPTH" && o.pageType === "industry") ||
        (p.id === "SYS-FEATURE-EVIDENCE" &&
          o.pageType === "feature" &&
          o.types.includes("ADD EVIDENCE")) ||
        (p.id === "SYS-NEXT-STEP" &&
          (o.types.includes("IMPROVE NEXT STEP") ||
            o.types.includes("ADD TOOL CTA"))) ||
        (p.id === "SYS-LINK-GRAPH" && o.types.includes("ADD INTERNAL LINKS")) ||
        (p.id === "SYS-EVIDENCE" &&
          (o.types.includes("ADD EVIDENCE") ||
            o.types.includes("REFRESH RESEARCH")))
      ) {
        o.systemic = true;
      }
    }
  }

  return { opportunities, patterns, mapNodes };
}

export type { Effort };
