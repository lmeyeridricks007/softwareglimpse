import { stableGapId } from "../intelligence/stable-ids";
import {
  getSoftwareByCategory,
  getResources,
} from "@/data";
import {
  getGuidesByCategory,
} from "@/data/repositories/guides";
import { loadAuditSnapshots } from "../loaders/inventory";
import {
  isMissingStatus,
  isOptionalStatus,
  isThinOrResearch,
  loadMapRegister,
  resolveRowRoute,
  type MapRegisterRow,
} from "./map-register";
import type {
  DuplicateCannibalizationFinding,
  EligibilityDecision,
  EligibilityScores,
  GapPriority,
  IndustryClusterGap,
  NewContentOpportunity,
  NewContentOpportunityType,
  PillarSupportAnalysis,
  ProductClusterGap,
  ProposedContentBrief,
} from "./types";

/** Deduplicate near-identical opportunities by decision + route + title. */
function dedupeKey(o: NewContentOpportunity): string {
  return `${o.decision}|${o.suggestedRoute}|${o.title}`.toLowerCase();
}

const FLAGSHIP = new Set([
  "hubspot",
  "salesforce",
  "pipedrive",
  "zoho-crm",
  "freshsales",
  "monday-sales-crm",
]);

function avg(scores: EligibilityScores): number {
  const vals = [
    scores.userNeed,
    scores.distinctIntent,
    5 - scores.overlapRisk,
    scores.evidenceAvailability,
    scores.originalAnalysisPotential,
    scores.pillarSupportValue,
    scores.journeyValue,
    scores.toolResourceConnection,
    scores.researchReadiness,
  ];
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function decideFromScores(
  scores: EligibilityScores,
  opts?: { missing?: boolean; thin?: boolean; optional?: boolean; programmatic?: boolean },
): EligibilityDecision {
  if (opts?.programmatic) return "DO NOT CREATE";
  if (opts?.optional && avg(scores) < 3.2) return "FUTURE";
  if (scores.overlapRisk >= 4) return "MERGE INTO EXISTING";
  if (scores.overlapRisk >= 3 && scores.distinctIntent <= 2) {
    return "KEEP AS SECTION";
  }
  if (opts?.thin || scores.researchReadiness <= 2) return "RESEARCH FIRST";
  if (opts?.missing && avg(scores) >= 3.4 && scores.researchReadiness >= 3) {
    return "CREATE";
  }
  if (opts?.missing && scores.researchReadiness < 3) return "RESEARCH FIRST";
  if (opts?.optional) return "FUTURE";
  if (avg(scores) >= 3.5) return "CREATE";
  return "FUTURE";
}

function mapType(row: MapRegisterRow): NewContentOpportunityType {
  const t = `${row.pageType} ${row.title} ${row.cluster}`.toLowerCase();
  if (/tool|finder|calculator|planner|builder|assessment|selector/.test(t)) {
    return "TOOL";
  }
  if (/checklist/.test(t)) return "CHECKLIST";
  if (/template/.test(t)) return "TEMPLATE";
  if (/worksheet/.test(t)) return "WORKSHEET";
  if (/scorecard/.test(t)) return "SCORECARD";
  if (/migration/.test(t)) return "MIGRATION ARTICLE";
  if (/implementation/.test(t)) return "IMPLEMENTATION ARTICLE";
  if (/industry/.test(t)) return "INDUSTRY GUIDE";
  if (/use-?case/.test(t)) return "USE-CASE GUIDE";
  if (/capability/.test(t)) return "CAPABILITY GUIDE";
  if (/requirement/.test(t)) return "REQUIREMENT GUIDE";
  if (/feature/.test(t)) return "FEATURE GUIDE";
  if (/product/.test(t) && /guide|how-to|setup|implement/.test(t)) {
    return "PRODUCT GUIDE";
  }
  if (/best|pillar|hub/.test(t) && /choose|implement|learn/.test(t)) {
    return "PILLAR PAGE";
  }
  if (/research|evidence|methodology/.test(t)) return "RESEARCH PAGE";
  return "SUPPORTING ARTICLE";
}

function briefFor(
  o: Pick<
    NewContentOpportunity,
    "title" | "suggestedRoute" | "type" | "whyNeeded" | "network" | "decision"
  >,
  extras: Partial<ProposedContentBrief>,
): ProposedContentBrief {
  return {
    title: o.title,
    route: o.suggestedRoute,
    contentType: o.type,
    searchIntent: extras.searchIntent ?? o.network.buyerStage,
    primaryQuestion:
      extras.primaryQuestion ?? `How do I ${o.title.toLowerCase()}?`,
    whyDeservesPage: extras.whyDeservesPage ?? o.whyNeeded,
    differentiation:
      extras.differentiation ??
      "Owns a distinct buyer job not covered by the parent pillar alone.",
    requiredSections: extras.requiredSections ?? [
      "quick-answer",
      "framework-or-steps",
      "examples",
      "next-step",
    ],
    originalValue: extras.originalValue ?? [
      "SoftwareGlimpse framework or checklist",
      "Tool handoff",
    ],
    evidenceNeeded: extras.evidenceNeeded ?? [],
    visualsNeeded: extras.visualsNeeded ?? ["Teaching diagram"],
    toolsResources: extras.toolsResources ?? [
      o.network.tool,
      o.network.resource,
    ].filter(Boolean) as string[],
    internalLinksIn: extras.internalLinksIn ?? o.network.linksToIt,
    internalLinksOut: extras.internalLinksOut ?? o.network.linksFromIt,
    canonicalParent: extras.canonicalParent ?? o.network.primaryParent,
    publicationRequirements: extras.publicationRequirements ?? [
      "Distinct intent vs siblings",
      "Quick answer + next step",
      "No invented product claims",
      o.decision === "RESEARCH FIRST"
        ? "Research depth complete before drafting"
        : "Editorial QA pass",
    ],
  };
}

function existingRoutes(): Set<string> {
  const set = new Set<string>();
  for (const g of getGuidesByCategory("crm", { includeUnpublished: true })) {
    set.add(`/guides/${g.slug}/`);
  }
  for (const s of loadAuditSnapshots("crm")) {
    set.add(s.snapshot.route.endsWith("/") ? s.snapshot.route : `${s.snapshot.route}/`);
  }
  return set;
}

/**
 * Explicit anti-patterns: mass programmatic permutations without unique value.
 */
export function programmaticDoNotCreate(): NewContentOpportunity[] {
  const items: Array<Omit<NewContentOpportunity, "id" | "brief"> & { brief?: ProposedContentBrief }> = [
    {
      title: "HubSpot (or any CRM) × every industry",
      suggestedRoute: "/industries/{industry}/products/{product}/",
      type: "PRODUCT × INDUSTRY",
      decision: "DO NOT CREATE",
      priority: "P3",
      parent: "Industry hubs",
      supports: [],
      whyNeeded:
        "Mass product×industry pages usually swap H1s without unique workflow, compliance, or evidence — high cannibalization risk.",
      researchStatus: "insufficient unique value by default",
      effort: "large",
      linkingImpact: "low",
      programmaticRisk: true,
      scores: {
        userNeed: 2,
        distinctIntent: 1,
        overlapRisk: 5,
        evidenceAvailability: 1,
        originalAnalysisPotential: 1,
        pillarSupportValue: 1,
        journeyValue: 2,
        toolResourceConnection: 1,
        researchReadiness: 1,
      },
      network: {
        primaryParent: "/industries/",
        primaryPillar: "Industries",
        linksToIt: [],
        linksFromIt: ["/software/{product}/"],
        buyerStage: "find",
        nextStep: "Industry hub → Finder",
        entities: ["product", "industry"],
      },
      notes: [
        "Allow only when industry research + product evidence prove a distinct buyer job (rare).",
      ],
    },
    {
      title: "Feature X × every use case",
      suggestedRoute: "/use-cases/{use-case}/features/{feature}/",
      type: "FEATURE GUIDE",
      decision: "DO NOT CREATE",
      priority: "P3",
      parent: "Use-case / Feature hubs",
      supports: [],
      whyNeeded:
        "Cartesian feature×use-case pages dilute canonical feature and use-case hubs without new decision criteria.",
      researchStatus: "n/a — combinatorial",
      effort: "large",
      linkingImpact: "low",
      programmaticRisk: true,
      scores: {
        userNeed: 2,
        distinctIntent: 1,
        overlapRisk: 5,
        evidenceAvailability: 2,
        originalAnalysisPotential: 1,
        pillarSupportValue: 1,
        journeyValue: 1,
        toolResourceConnection: 1,
        researchReadiness: 2,
      },
      network: {
        primaryParent: "/use-cases/",
        primaryPillar: "Use Cases",
        linksToIt: [],
        linksFromIt: ["/features/"],
        buyerStage: "evaluate",
        nextStep: "Use-case hub",
        entities: ["feature", "use-case"],
      },
      notes: ["Keep as related modules on existing hubs."],
    },
    {
      title: "Product A vs Product B for every industry",
      suggestedRoute: "/guides/{a}-vs-{b}-for-{industry}/",
      type: "SUPPORTING ARTICLE",
      decision: "DO NOT CREATE",
      priority: "P3",
      mapNodeId: "CRM-CMP-CTX-001",
      parent: "Base comparison pages",
      supports: ["Compare"],
      whyNeeded:
        "Contextual compare articles are OPTIONAL and only eligible with strong unique constraints; mass industry variants fail eligibility §8.",
      researchStatus: "optional — eligibility gated",
      effort: "large",
      linkingImpact: "low",
      programmaticRisk: true,
      scores: {
        userNeed: 2,
        distinctIntent: 2,
        overlapRisk: 4,
        evidenceAvailability: 2,
        originalAnalysisPotential: 2,
        pillarSupportValue: 2,
        journeyValue: 2,
        toolResourceConnection: 1,
        researchReadiness: 2,
      },
      network: {
        primaryParent: "/compare/",
        primaryPillar: "Compare",
        linksToIt: ["/compare/{a}-vs-{b}/"],
        linksFromIt: ["/industries/{industry}/"],
        buyerStage: "compare",
        nextStep: "Base comparison",
        entities: ["comparison", "industry"],
      },
      notes: ["Map marks CRM-CMP-CTX-001 as OPTIONAL P3."],
    },
  ];

  return items.map((item) => {
    const o: NewContentOpportunity = {
      ...item,
      id: stableGapId(item.title, item.suggestedRoute, item.decision),
    };
    o.brief = briefFor(o, {
      whyDeservesPage: "Does not deserve a standalone page by default.",
      differentiation: "Overlaps canonical hubs/comparisons.",
      publicationRequirements: ["Do not generate"],
    });
    return o;
  });
}

function opportunityFromMissingTool(row: MapRegisterRow): NewContentOpportunity {
  const route = resolveRowRoute(row) ?? `/tools/${row.id.toLowerCase()}/`;
  const scores: EligibilityScores = {
    userNeed: row.priority === "P0" || row.priority === "P1" ? 5 : 3,
    distinctIntent: 4,
    overlapRisk: 1,
    evidenceAvailability: 3,
    originalAnalysisPotential: 5,
    pillarSupportValue: 5,
    journeyValue: 5,
    toolResourceConnection: 5,
    researchReadiness: /pricing verified/i.test(row.researchState) ? 3 : 4,
  };
  const decision = decideFromScores(scores, {
    missing: true,
    optional: isOptionalStatus(row.statusRaw),
  });
  const o: NewContentOpportunity = {
    id: "",
    title: row.title,
    suggestedRoute: route,
    type: "TOOL",
    decision: decision === "CREATE" ? "CREATE" : decision,
    priority: row.priority,
    mapNodeId: row.id,
    mapCluster: row.cluster,
    parent: row.parent,
    supports: [row.supports].filter((s) => s && s !== "—"),
    whyNeeded:
      row.notes ||
      `${row.title} is on the CRM tools backlog and operationalizes ${row.intent || "buyer decisions"} beyond static guides.`,
    researchStatus: row.researchState || "not-started",
    effort: "large",
    linkingImpact: "high",
    scores,
    network: {
      primaryParent: "/tools/",
      primaryPillar: row.cluster,
      linksToIt: [
        "/tools/",
        row.parent.includes("/") ? row.parent : `/guides/`,
      ],
      linksFromIt: [row.nextStep].filter((x) => x && x !== "—"),
      buyerStage: row.subcluster || "choose",
      nextStep: row.nextStep,
      tool: "self",
      resource: row.resource !== "—" ? row.resource : undefined,
      entities: ["crm-tools"],
    },
  };
  o.brief = briefFor(o, {
    searchIntent: `interactive ${row.title}`,
    primaryQuestion: `Can I use a tool to ${row.intent.toLowerCase() || "decide"}?`,
    whyDeservesPage:
      "Interactive tools create original SoftwareGlimpse value that articles cannot replace.",
    differentiation: "Not a guide — executable workflow with structured outputs.",
    requiredSections: [
      "what-it-does",
      "who-its-for",
      "how-it-works",
      "tool-cta",
      "related-guides",
    ],
    originalValue: ["Interactive decision model", "Shared profile handoffs"],
    evidenceNeeded: ["Model assumptions documented", "No invented vendor scores"],
    visualsNeeded: ["Tool UI explainer"],
    publicationRequirements: [
      "Tool registry entry",
      "Deterministic model tests",
      "Journey links from related guides",
    ],
  });
  return o;
}

function opportunityFromThinIndustry(row: MapRegisterRow): NewContentOpportunity {
  const route = resolveRowRoute(row) ?? `/industries/${row.id}/`;
  const scores: EligibilityScores = {
    userNeed: 5,
    distinctIntent: 4,
    overlapRisk: /small-business/i.test(route) ? 4 : 2,
    evidenceAvailability: 2,
    originalAnalysisPotential: 4,
    pillarSupportValue: 5,
    journeyValue: 5,
    toolResourceConnection: 4,
    researchReadiness: 1,
  };
  const decision =
    /small-business/i.test(route)
      ? "MERGE INTO EXISTING"
      : "RESEARCH FIRST";
  const o: NewContentOpportunity = {
    id: "",
    title: `${row.title} — depth pack (not a new URL)`,
    suggestedRoute: route,
    type: "INDUSTRY GUIDE",
    decision,
    priority: row.priority,
    mapNodeId: row.id,
    mapCluster: "Industries",
    parent: "/industries/",
    supports: ["Industries", "Finder"],
    whyNeeded:
      decision === "MERGE INTO EXISTING"
        ? "Industry small-business hub overlaps `/for/small-business/` — consolidate intent rather than creating more pages."
        : "Industry hub URL exists but lacks vertical depth; do not create sibling keyword pages — research and deepen the existing hub, then consider a supporting guide pack like Financial Services.",
    researchStatus: "research-required",
    effort: "large",
    linkingImpact: "high",
    scores,
    relatedExisting: [route, "/categories/crm/"],
    network: {
      primaryParent: "/industries/",
      primaryPillar: "Industries",
      linksToIt: ["/categories/crm/", "/industries/"],
      linksFromIt: ["/tools/crm-finder/", "/use-cases/"],
      buyerStage: "find",
      nextStep: "CRM Finder",
      tool: "Finder",
      entities: [route],
    },
    notes: [
      "NOT a request to invent product×industry permutations.",
      "FS supporting guide pack is the reference pattern after research.",
    ],
  };
  o.brief = briefFor(o, {
    primaryQuestion: `What matters when choosing CRM for this industry?`,
    differentiation:
      "Deepen existing hub with industry priorities/workflows/compliance — do not spawn near-duplicate articles.",
    requiredSections: [
      "industry-priorities",
      "workflows",
      "use-cases",
      "security-or-compliance",
      "next-step",
    ],
    evidenceNeeded: [
      "Industry workflow research",
      "Compliance considerations",
      "No invented product rankings",
    ],
    publicationRequirements: [
      "Research depth approved",
      "Distinct from category hub",
      "Finder next step",
    ],
  });
  return o;
}

function opportunityFromThinBest(row: MapRegisterRow): NewContentOpportunity {
  const route = resolveRowRoute(row) ?? "/best/crm-software/";
  const o: NewContentOpportunity = {
    id: "",
    title: "Best CRM Software — research + rationale completion",
    suggestedRoute: route,
    type: "PILLAR PAGE",
    decision: "RESEARCH FIRST",
    priority: "P0",
    mapNodeId: row.id,
    mapCluster: "Choose",
    parent: "/categories/crm/",
    supports: ["Choose"],
    whyNeeded:
      "P0 commercial pillar exists but is thin/research-incomplete — improve the existing page; do not create alternate “best CRM” URLs.",
    researchStatus: row.researchState || "research-required",
    effort: "large",
    linkingImpact: "high",
    scores: {
      userNeed: 5,
      distinctIntent: 5,
      overlapRisk: 1,
      evidenceAvailability: 2,
      originalAnalysisPotential: 5,
      pillarSupportValue: 5,
      journeyValue: 5,
      toolResourceConnection: 5,
      researchReadiness: 2,
    },
    relatedExisting: [route],
    network: {
      primaryParent: "/categories/crm/",
      primaryPillar: "Choose",
      linksToIt: ["/categories/crm/", "/guides/how-to-choose-crm/"],
      linksFromIt: ["/tools/crm-finder/", "/software/"],
      buyerStage: "choose",
      nextStep: "Finder / Product review",
      tool: "Finder",
      entities: ["best-crm"],
    },
  };
  o.brief = briefFor(o, {
    primaryQuestion: "Which CRM is best for my situation?",
    differentiation: "Methodology-backed segmented winners — not a new listicle URL.",
    requiredSections: [
      "methodology",
      "eligibility",
      "recommendations",
      "rationales",
      "next-step",
    ],
    evidenceNeeded: [
      "Approved recommendation rationales",
      "Verified feature matrix cells",
    ],
    publicationRequirements: [
      "Editorial approvals",
      "Research complete",
      "Affiliate disclosure",
    ],
  });
  return o;
}

function industrySupportingGuideOpportunity(
  industrySlug: string,
  priority: GapPriority,
): NewContentOpportunity {
  const route = `/guides/${industrySlug}-crm-workflow/`;
  const scores: EligibilityScores = {
    userNeed: priority === "P0" || priority === "P1" ? 4 : 3,
    distinctIntent: 4,
    overlapRisk: 2,
    evidenceAvailability: 2,
    originalAnalysisPotential: 4,
    pillarSupportValue: 4,
    journeyValue: 4,
    toolResourceConnection: 3,
    researchReadiness: industrySlug === "financial-services" ? 5 : 2,
  };
  const decision =
    industrySlug === "financial-services"
      ? "KEEP AS SECTION"
      : "RESEARCH FIRST";
  const o: NewContentOpportunity = {
    id: "",
    title: `CRM workflow guide for ${industrySlug}`,
    suggestedRoute: route,
    type: "INDUSTRY GUIDE",
    decision,
    priority,
    mapCluster: "Industries",
    parent: `/industries/${industrySlug}/`,
    supports: [`/industries/${industrySlug}/`],
    whyNeeded:
      decision === "KEEP AS SECTION"
        ? "Financial Services already has a supporting guide pack — extend modules there instead of new near-duplicates."
        : `After industry hub research for ${industrySlug}, a workflow supporting guide can strengthen the hub (FS pack is the pattern). Do not create before hub depth exists.`,
    researchStatus:
      industrySlug === "financial-services" ? "complete" : "blocked on hub research",
    effort: "medium",
    linkingImpact: "medium",
    scores,
    network: {
      primaryParent: `/industries/${industrySlug}/`,
      primaryPillar: "Industries",
      linksToIt: [`/industries/${industrySlug}/`],
      linksFromIt: ["/tools/crm-finder/", "/requirements/"],
      buyerStage: "find",
      nextStep: "Industry hub → Finder",
      tool: "Finder",
      entities: [industrySlug],
    },
  };
  o.brief = briefFor(o, {
    primaryQuestion: `How should ${industrySlug} teams run CRM workflows?`,
    requiredSections: ["workflow", "requirements", "mistakes", "next-step"],
    evidenceNeeded: ["Industry workflow research"],
  });
  return o;
}

function routeExists(routes: Set<string>, route: string): boolean {
  if (routes.has(route)) return true;
  const bare = route.endsWith("/") ? route.slice(0, -1) : route;
  return routes.has(bare) || routes.has(`${bare}/`);
}

function productSelectiveGaps(
  routes: Set<string>,
): { clusters: ProductClusterGap[]; opportunities: NewContentOpportunity[] } {
  const software = getSoftwareByCategory("crm", { includeUnpublished: true }).filter(
    (s) => s.primaryCategorySlug === "crm",
  );
  const clusters: ProductClusterGap[] = [];
  const opportunities: NewContentOpportunity[] = [];

  // One global product×industry ban — already in programmaticDoNotCreate;
  // cluster notes only for flagships to avoid combinatorial opportunity spam.
  for (const s of software) {
    const flagship = FLAGSHIP.has(s.slug);
    const existing = [
      `/software/${s.slug}/`,
      `/pricing/${s.slug}/`,
      `/guides/${s.slug}-implementation/`,
      `/guides/${s.slug}-migration/`,
      `/guides/${s.slug}-setup/`,
      `/guides/${s.slug}-plans/`,
      `/guides/${s.slug}-worth-it/`,
      `/alternatives/${s.slug}/`,
    ].filter((r) => routeExists(routes, r));

    const candidates: ProductClusterGap["candidates"] = [
      {
        title: `${s.name} × every industry`,
        type: "PRODUCT × INDUSTRY",
        decision: "DO NOT CREATE",
        reason:
          "Programmatic product×industry permutations lack unique value by default.",
      },
    ];

    if (!flagship) {
      clusters.push({
        productSlug: s.slug,
        flagship: false,
        existing,
        candidates,
      });
      continue;
    }

    if (!routeExists(routes, `/alternatives/${s.slug}/`)) {
      candidates.push({
        title: `${s.name} Alternatives`,
        type: "PRODUCT GUIDE",
        decision: "RESEARCH FIRST",
        reason:
          "Flagship alternatives pages need an approved alternative graph + research — not auto-generated lists.",
      });
    }

    candidates.push(
      {
        title: `${s.name} security overview`,
        type: "PRODUCT HOW-TO",
        decision: "KEEP AS SECTION",
        reason:
          "Prefer product hub Security section/tab until dedicated research depth justifies a standalone guide.",
      },
      {
        title: `${s.name} integrations guide`,
        type: "PRODUCT HOW-TO",
        decision: "KEEP AS SECTION",
        reason:
          "Integrations belong on the product hub unless a high-demand integration story needs a dedicated how-to.",
      },
    );

    clusters.push({
      productSlug: s.slug,
      flagship: true,
      existing,
      candidates,
    });

    for (const c of candidates) {
      if (c.decision === "DO NOT CREATE") continue; // covered globally
      const slugBit = c.title.toLowerCase().includes("security")
        ? "security"
        : c.title.toLowerCase().includes("integrations")
          ? "integrations"
          : "alternatives";
      const o: NewContentOpportunity = {
        id: "",
        title: c.title,
        suggestedRoute:
          slugBit === "alternatives"
            ? `/alternatives/${s.slug}/`
            : `/guides/${s.slug}-${slugBit}/`,
        type: c.type,
        decision: c.decision,
        priority: "P2",
        parent: `/software/${s.slug}/`,
        supports: [`/software/${s.slug}/`],
        whyNeeded: c.reason,
        researchStatus:
          c.decision === "RESEARCH FIRST" ? "research-required" : "n/a",
        effort: c.decision === "KEEP AS SECTION" ? "small" : "medium",
        linkingImpact: "medium",
        scores: {
          userNeed: 3,
          distinctIntent: c.decision === "KEEP AS SECTION" ? 2 : 3,
          overlapRisk: 3,
          evidenceAvailability: 2,
          originalAnalysisPotential: 3,
          pillarSupportValue: 3,
          journeyValue: 3,
          toolResourceConnection: 2,
          researchReadiness: c.decision === "RESEARCH FIRST" ? 2 : 3,
        },
        network: {
          primaryParent: `/software/${s.slug}/`,
          primaryPillar: "Products",
          linksToIt: [`/software/${s.slug}/`],
          linksFromIt: ["/compare/", "/best/crm-software/"],
          buyerStage: "research",
          nextStep: "Product review / Compare",
          entities: [s.slug],
        },
      };
      o.brief = briefFor(o, {
        whyDeservesPage: c.reason,
        publicationRequirements:
          c.decision === "RESEARCH FIRST"
            ? ["Approved alternatives graph", "Research complete"]
            : ["Keep on product hub unless eligibility re-scored"],
      });
      opportunities.push(o);
    }
  }

  return { clusters, opportunities };
}

function buildPillarAnalyses(
  rows: MapRegisterRow[],
  routes: Set<string>,
): PillarSupportAnalysis[] {
  const pillars = [
    "Learn",
    "Choose",
    "Implementation",
    "Optimization",
    "Industries",
    "Use Cases",
    "Capabilities",
    "Requirements",
    "Features",
    "Resources",
    "Tools",
    "Products",
  ];

  return pillars.map((pillar) => {
    const clusterRows = rows.filter(
      (r) =>
        r.cluster === pillar ||
        r.subcluster === pillar ||
        (pillar === "Implementation" && r.cluster === "Implementation") ||
        (pillar === "Tools" && r.cluster === "Tools"),
    );
    const existing: PillarSupportAnalysis["existing"] = [];
    const missingOrThin: PillarSupportAnalysis["missingOrThin"] = [];
    const resources: PillarSupportAnalysis["resources"] = [];

    for (const r of clusterRows) {
      const route = resolveRowRoute(r);
      const status = r.statusRaw;
      if (r.cluster === "Resources" || /checklist|template|worksheet|scorecard/i.test(r.pageType)) {
        resources.push({
          title: r.title,
          route: route ?? "—",
          status: isMissingStatus(status)
            ? "missing"
            : isThinOrResearch(status, r.researchState)
              ? "thin"
              : "existing",
        });
      }
      if (isMissingStatus(status) || isOptionalStatus(status)) {
        missingOrThin.push({
          title: r.title,
          suggestedRoute: route ?? undefined,
          status: isOptionalStatus(status) ? "optional" : "missing",
          decision: isOptionalStatus(status) ? "FUTURE" : "CREATE",
        });
      } else if (isThinOrResearch(status, r.researchState)) {
        missingOrThin.push({
          title: r.title,
          suggestedRoute: route ?? undefined,
          status: "thin/research",
          decision: "RESEARCH FIRST",
        });
      } else if (route) {
        existing.push({ title: r.title, route, mapId: r.id });
      }
    }

    // Special case: Implementation is largely complete — reflect that clearly
    if (pillar === "Implementation") {
      const impExisting = [...routes].filter((r) =>
        /\/guides\/crm-(implementation|data-migration|go-live|training|adoption|field-mapping)/.test(
          r,
        ),
      );
      for (const r of impExisting) {
        if (!existing.some((e) => e.route === r)) {
          existing.push({ title: r, route: r });
        }
      }
    }

    return { pillar, existing, missingOrThin, resources };
  });
}

function buildIndustryClusters(rows: MapRegisterRow[]): IndustryClusterGap[] {
  return rows
    .filter((r) => r.pageType.includes("industry-detail") || /CRM for /i.test(r.title))
    .filter((r) => resolveRowRoute(r)?.startsWith("/industries/"))
    .map((r) => {
      const route = resolveRowRoute(r)!;
      const slug = route.replace("/industries/", "").replace(/\/$/, "");
      return {
        industrySlug: slug,
        mapPriority: r.priority,
        hubRoute: route,
        hubDecision:
          slug === "small-business"
            ? ("MERGE INTO EXISTING" as const)
            : ("RESEARCH FIRST" as const),
        supportingGuides: [
          {
            title: `${slug} CRM workflow guide`,
            decision:
              slug === "financial-services"
                ? ("KEEP AS SECTION" as const)
                : ("RESEARCH FIRST" as const),
            reason:
              slug === "financial-services"
                ? "FS guide pack already exists"
                : "Only after hub research depth",
          },
          {
            title: `${slug} evaluation checklist`,
            decision: "RESEARCH FIRST" as const,
            reason: "Resource only when vertical criteria differ from RES-001",
          },
        ],
        resources: [
          {
            title: "Generic evaluation checklist",
            decision: "KEEP AS SECTION" as const,
            reason: "Reuse `/resources/crm-evaluation-checklist/` until vertical-specific needs proven",
          },
        ],
      };
    });
}

function buildDuplicates(rows: MapRegisterRow[]): DuplicateCannibalizationFinding[] {
  const findings: DuplicateCannibalizationFinding[] = [
    {
      id: "DUP-SMB",
      routes: ["/industries/small-business/", "/for/small-business/"],
      issue: "Industry “small business” and audience `/for/small-business/` compete for the same buyer framing.",
      recommendation: "MERGE INTO EXISTING",
      canonical: "/for/small-business/",
      rationale:
        "Keep audience hub canonical for company-size intent; industry hub should either redirect, reposition to vertical-only SMB niches, or deep-link without duplicating “CRM for small business” intent.",
    },
    {
      id: "DUP-DATA-QUALITY",
      routes: [
        "/guides/crm-data-quality/",
        "/guides/crm-data-hygiene/",
        "/guides/crm-data-cleaning/",
      ],
      issue: "Multiple data-quality/hygiene/cleaning guides risk overlapping intent.",
      recommendation: "KEEP AS SECTION",
      rationale:
        "Differentiate clearly (quality policy vs ongoing hygiene vs migration cleaning) or consolidate thin overlaps; do not add another data-quality URL.",
    },
    {
      id: "DUP-ADOPTION",
      routes: ["/guides/crm-adoption/", "/guides/improve-crm-adoption/"],
      issue: "Implementation adoption vs optimization adoption guides are near-adjacent.",
      recommendation: "KEEP AS SECTION",
      rationale:
        "Keep both only if stages differ (go-live adoption vs post-purchase improvement); otherwise merge modules and cross-link.",
    },
    {
      id: "DUP-BEST-LISTS",
      routes: ["/best/crm-software/"],
      issue: "Pressure to create alternate “best CRM for X” listicles.",
      recommendation: "DO NOT CREATE",
      canonical: "/best/crm-software/",
      rationale:
        "Segment inside Best + Finder; avoid proliferating best-list URLs without methodology and eligibility rules.",
    },
  ];

  // Auto: notes mentioning overlaps
  for (const r of rows) {
    if (/overlap/i.test(r.notes) && resolveRowRoute(r)) {
      findings.push({
        id: `DUP-MAP-${r.id}`,
        routes: [resolveRowRoute(r)!],
        issue: r.notes,
        recommendation: "MERGE INTO EXISTING",
        rationale: `Content map notes overlap for ${r.id}.`,
      });
    }
  }

  return findings;
}

function resourceOpportunities(): NewContentOpportunity[] {
  const uatExists = getResources({ includeUnpublished: true }).some(
    (resource) => resource.slug === "crm-uat-test-script",
  );
  const items: Array<Omit<NewContentOpportunity, "id" | "brief">> = [];
  if (!uatExists) {
    items.push({
      title: "UAT test script worksheet (CRM)",
      suggestedRoute: "/resources/crm-uat-test-script/",
      type: "WORKSHEET",
      decision: "CREATE",
      priority: "P2",
      parent: "/guides/crm-testing/",
      supports: ["/guides/crm-testing/", "/guides/crm-go-live/"],
      whyNeeded:
        "Testing/go-live guides explain process but lack a downloadable UAT script artifact; RES pack has go-live/training but not a dedicated UAT worksheet.",
      researchStatus: "ready — process already documented in guides",
      effort: "medium",
      linkingImpact: "medium",
      scores: {
        userNeed: 4,
        distinctIntent: 4,
        overlapRisk: 2,
        evidenceAvailability: 4,
        originalAnalysisPotential: 4,
        pillarSupportValue: 4,
        journeyValue: 4,
        toolResourceConnection: 4,
        researchReadiness: 4,
      },
      network: {
        primaryParent: "/guides/crm-testing/",
        primaryPillar: "Implementation",
        linksToIt: ["/guides/crm-testing/", "/guides/crm-go-live/"],
        linksFromIt: [
          "/tools/crm-implementation-planner/",
          "/resources/crm-go-live-checklist/",
        ],
        buyerStage: "implement",
        nextStep: "Go-Live Checklist / Implementation Planner",
        resource: "new",
        tool: "Implementation Planner",
        entities: ["uat", "testing"],
      },
    });
  }
  items.push({
      title: "Industry evaluation addendum pattern (not 12 PDFs)",
      suggestedRoute: "/resources/crm-evaluation-checklist/",
      type: "CHECKLIST",
      decision: "KEEP AS SECTION",
      priority: "P2",
      parent: "/resources/crm-evaluation-checklist/",
      supports: ["/industries/"],
      whyNeeded:
        "Prefer extending the canonical evaluation checklist with optional industry modules over creating one checklist per industry.",
      researchStatus: "pattern decision",
      effort: "small",
      linkingImpact: "medium",
      scores: {
        userNeed: 3,
        distinctIntent: 2,
        overlapRisk: 4,
        evidenceAvailability: 3,
        originalAnalysisPotential: 3,
        pillarSupportValue: 3,
        journeyValue: 3,
        toolResourceConnection: 4,
        researchReadiness: 3,
      },
      network: {
        primaryParent: "/resources/crm-evaluation-checklist/",
        primaryPillar: "Resources",
        linksToIt: ["/industries/"],
        linksFromIt: ["/tools/crm-finder/"],
        buyerStage: "choose",
        nextStep: "Finder",
        resource: "RES-001",
        entities: ["checklist"],
      },
    });
  return items.map((o) => {
    const full = o as NewContentOpportunity;
    full.brief = briefFor(full, {});
    return full;
  });
}

export type GapAnalysisResult = {
  opportunities: NewContentOpportunity[];
  pillars: PillarSupportAnalysis[];
  productClusters: ProductClusterGap[];
  industryClusters: IndustryClusterGap[];
  duplicates: DuplicateCannibalizationFinding[];
  counts: Record<EligibilityDecision, number>;
};

export function analyzeContentGaps(): GapAnalysisResult {
  const rows = loadMapRegister();
  const routes = existingRoutes();

  const opportunities: NewContentOpportunity[] = [];
  opportunities.push(...programmaticDoNotCreate());

  for (const row of rows) {
    if (isMissingStatus(row.statusRaw) && mapType(row) === "TOOL") {
      opportunities.push(opportunityFromMissingTool(row));
    } else if (
      isMissingStatus(row.statusRaw) &&
      !isOptionalStatus(row.statusRaw) &&
      mapType(row) !== "TOOL"
    ) {
      const route = resolveRowRoute(row);
      if (!route || route.includes("{")) continue;
      const scores: EligibilityScores = {
        userNeed: row.priority === "P0" ? 5 : row.priority === "P1" ? 4 : 3,
        distinctIntent: 3,
        overlapRisk: 2,
        evidenceAvailability: 3,
        originalAnalysisPotential: 3,
        pillarSupportValue: 4,
        journeyValue: 3,
        toolResourceConnection: row.tool && row.tool !== "—" ? 4 : 2,
        researchReadiness: /complete|shipped/i.test(row.researchState) ? 4 : 2,
      };
      const decision = decideFromScores(scores, { missing: true });
      const o: NewContentOpportunity = {
        id: "",
        title: row.title,
        suggestedRoute: route,
        type: mapType(row),
        decision,
        priority: row.priority,
        mapNodeId: row.id,
        mapCluster: row.cluster,
        parent: row.parent,
        supports: [row.supports].filter((s) => s && s !== "—"),
        whyNeeded: row.notes || `Mapped missing node ${row.id} in ${row.cluster}.`,
        researchStatus: row.researchState,
        effort: "medium",
        linkingImpact: row.priority === "P0" || row.priority === "P1" ? "high" : "medium",
        scores,
        network: {
          primaryParent: row.parent,
          primaryPillar: row.cluster,
          linksToIt: [row.parent],
          linksFromIt: [row.nextStep].filter((x) => x && x !== "—"),
          buyerStage: row.subcluster,
          nextStep: row.nextStep,
          tool: row.tool !== "—" ? row.tool : undefined,
          resource: row.resource !== "—" ? row.resource : undefined,
          entities: [row.id],
        },
      };
      o.brief = briefFor(o, {});
      opportunities.push(o);
    } else if (
      /industry-detail/i.test(row.pageType) &&
      isThinOrResearch(row.statusRaw, row.researchState)
    ) {
      opportunities.push(opportunityFromThinIndustry(row));
    } else if (row.id === "CRM-BUY-001") {
      opportunities.push(opportunityFromThinBest(row));
    } else if (isOptionalStatus(row.statusRaw) && row.id === "CRM-CMP-CTX-001") {
      // already covered in programmatic DNC
    } else if (isOptionalStatus(row.statusRaw) && mapType(row) === "TOOL") {
      // skip — tools handled as missing
    }
  }

  // Industry supporting guides (selective)
  for (const slug of [
    "saas",
    "healthcare",
    "real-estate",
    "financial-services",
  ]) {
    opportunities.push(
      industrySupportingGuideOpportunity(
        slug,
        slug === "saas" || slug === "financial-services" ? "P0" : "P1",
      ),
    );
  }

  const { clusters, opportunities: productOps } = productSelectiveGaps(routes);
  opportunities.push(...productOps);
  opportunities.push(...resourceOpportunities());

  // Alternatives hub / multi-compare
  const altHub = rows.find((r) => r.id === "CRM-ALT-000");
  if (altHub) {
    opportunities.push({
      id: "",
      title: "Alternatives hub depth",
      suggestedRoute: "/alternatives/",
      type: "PILLAR PAGE",
      decision: "RESEARCH FIRST",
      priority: "P1",
      mapNodeId: "CRM-ALT-000",
      parent: "/categories/crm/",
      supports: ["Products"],
      whyNeeded:
        "Alternatives hub is partial/scaffold — deepen hub UX and flagship alternatives pages before mass alternatives generation.",
      researchStatus: "partial",
      effort: "medium",
      linkingImpact: "high",
      scores: {
        userNeed: 4,
        distinctIntent: 4,
        overlapRisk: 2,
        evidenceAvailability: 3,
        originalAnalysisPotential: 4,
        pillarSupportValue: 4,
        journeyValue: 4,
        toolResourceConnection: 3,
        researchReadiness: 3,
      },
      network: {
        primaryParent: "/categories/crm/",
        primaryPillar: "Products",
        linksToIt: ["/software/", "/best/crm-software/"],
        linksFromIt: ["/alternatives/{slug}/"],
        buyerStage: "research",
        nextStep: "Product alternatives pages",
        entities: ["alternatives"],
      },
      brief: briefFor(
        {
          title: "Alternatives hub depth",
          suggestedRoute: "/alternatives/",
          type: "PILLAR PAGE",
          whyNeeded: "Deepen existing hub",
          network: {
            primaryParent: "/categories/crm/",
            primaryPillar: "Products",
            linksToIt: [],
            linksFromIt: [],
            buyerStage: "research",
            nextStep: "Alternatives pages",
            entities: [],
          },
          decision: "RESEARCH FIRST",
        },
        {},
      ),
    });
  }

  // Dedupe then sort
  const seen = new Set<string>();
  const unique = opportunities.filter((o) => {
    const k = dedupeKey(o);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  const priorityRank = { P0: 0, P1: 1, P2: 2, P3: 3 };
  const decisionRank: Record<EligibilityDecision, number> = {
    CREATE: 0,
    "RESEARCH FIRST": 1,
    "MERGE INTO EXISTING": 2,
    "KEEP AS SECTION": 3,
    FUTURE: 4,
    "DO NOT CREATE": 5,
  };

  unique.sort((a, b) => {
    const dr = decisionRank[a.decision] - decisionRank[b.decision];
    if (dr) return dr;
    const pr = priorityRank[a.priority] - priorityRank[b.priority];
    if (pr) return pr;
    return avg(b.scores) - avg(a.scores);
  });

  unique.forEach((o) => {
    o.id = stableGapId(o.title, o.suggestedRoute, o.decision);
  });

  // Replace opportunities with unique for counts
  opportunities.length = 0;
  opportunities.push(...unique);

  const counts: Record<EligibilityDecision, number> = {
    CREATE: 0,
    "RESEARCH FIRST": 0,
    "MERGE INTO EXISTING": 0,
    "KEEP AS SECTION": 0,
    "DO NOT CREATE": 0,
    FUTURE: 0,
  };
  for (const o of opportunities) counts[o.decision] += 1;

  return {
    opportunities,
    pillars: buildPillarAnalyses(rows, routes),
    productClusters: clusters,
    industryClusters: buildIndustryClusters(rows),
    duplicates: buildDuplicates(rows),
    counts,
  };
}
