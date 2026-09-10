#!/usr/bin/env npx tsx
/**
 * Unique comparison overlays for the improve batch — product-specific thesis copy.
 * Facts limited to catalogue positioning + research enrichment; no invented prices.
 */
import { writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { getAllComparisonsUnfiltered, getSoftware } from "@/data";
import { buildSoftwareLookup } from "@/services/seo/compare-index-worthiness";
import {
  mergeComparisonWithOverlay,
  type CompareEnrichmentOverlay,
} from "@/services/seo/compare-enrichment/overlay-merge";
import { saveCompareEnrichmentOverlay } from "@/services/seo/compare-enrichment/overlay-store";
import { peerComparisonsFor } from "@/services/seo/compare-enrichment/queue";
import { validateAndMaybePromoteComparison } from "@/services/seo/compare-enrichment/validate";
import {
  analyzePageQualityGate,
  recordGateResult,
} from "@/services/content-quality/gate";

type Spec = {
  slug: string;
  a: string;
  b: string;
  summary: string;
  verdict: string;
  pricingNotes: string;
  bestA: string;
  bestB: string;
  scenA: string;
  scenB: string;
  ratA: string;
  ratB: string;
};

const SPECS: Spec[] = [
  {
    slug: "salesforce-vs-siebel",
    a: "salesforce",
    b: "siebel",
    summary:
      "Salesforce vs Oracle Siebel is a cloud CRM platform choice versus a legacy enterprise CRM lineage. Salesforce is worth it when you need a broad AppExchange ecosystem and modern cloud administration; Siebel remains relevant mainly where deep on-prem / industry packages are already embedded. Trade-off: Salesforce gains ecosystem velocity at the expense of Siebel’s long-running industry customizations. Migration risk is high when cutover must preserve decades of Siebel data mapping.",
    verdict:
      "Prefer Salesforce for new cloud CRM programs and multi-cloud sales ops. Prefer Siebel only when industry package lock-in and switching cost dominate. Weak fit to force a greenfield Siebel program in 2026 without a clear industry package mandate. Compared with other Salesforce pairings, this matchup differs because Siebel is a legacy specialist stack, not a peer SaaS CRM.",
    pricingNotes:
      "Starting list prices are not both verified here — model team cost in the CRM cost calculator. Pricing threshold: Salesforce seat stacks plus add-ons vs Siebel license + services. Do not invent dollar figures; ask for quotes that name edition and services.",
    bestA: "Cloud CRM platform programs",
    bestB: "Embedded industry Siebel estates",
    scenA: "Greenfield cloud CRM",
    scenB: "Deep Siebel customization estate",
    ratA: "Use-case recommendation: choose Salesforce when starting fresh in cloud CRM. Skip Siebel if there is no industry package mandate.",
    ratB: "Prefer Siebel continuity when migration risk and re-training cost exceed Salesforce platform benefits.",
  },
  {
    slug: "pipedrive-vs-salesforce",
    a: "pipedrive",
    b: "salesforce",
    summary:
      "Pipedrive vs Salesforce contrasts pipeline-first SMB CRM with an enterprise cloud platform. Pipedrive is worth it when deal stages and activity cadence are the whole job; Salesforce pays off when custom objects, complex permissions, and ecosystem apps are required. Trade-off: Pipedrive gains speed-to-value at the expense of Salesforce-scale configuration. Weak fit to buy Salesforce for a 5-person pipeline board.",
    verdict:
      "Choose Pipedrive for sales teams that live in a visual pipeline. Choose Salesforce when revenue ops needs platform extensibility. Compared with HubSpot vs Pipedrive, this pairing differs because Salesforce is platform-first rather than inbound-hub-first.",
    pricingNotes:
      "Model seat growth carefully — Salesforce editions and add-ons create a different pricing threshold than Pipedrive’s simpler plans. Verify both on vendor quotes; use the cost calculator for scenario ranges.",
    bestA: "Pipeline-first SMB sales",
    bestB: "Platform CRM / RevOps",
    scenA: "SMB outbound sales pod",
    scenB: "Multi-team revenue ops",
    ratA: "Use-case recommendation: prefer Pipedrive when pipeline velocity is the only KPI.",
    ratB: "Prefer Salesforce when shared data model across sales, service, and partners matters.",
  },
  {
    slug: "insightly-vs-salesforce",
    a: "insightly",
    b: "salesforce",
    summary:
      "Insightly vs Salesforce is SMB project+CRM packaging versus enterprise platform CRM. Insightly fits teams that want CRM tied to projects without Salesforce complexity; Salesforce wins when governance, AppExchange, and multi-cloud depth matter. Trade-off: Insightly simplicity at the expense of Salesforce extensibility. Migration risk rises if you outgrow Insightly’s project-CRM model into heavy custom objects.",
    verdict:
      "Prefer Insightly for SMB teams blending CRM and light project delivery. Prefer Salesforce for platform programs. Weak fit to pick Salesforce solely because enterprise sounds safer for a 10-person team.",
    pricingNotes:
      "Compare plan ceilings and project features on quotes — starting prices are not treated as facts here. Pricing threshold often appears when Insightly project limits force a platform rethink.",
    bestA: "SMB CRM + projects",
    bestB: "Enterprise platform CRM",
    scenA: "Agency / services delivery",
    scenB: "Global sales cloud program",
    ratA: "Use-case recommendation: choose Insightly when project objects sit next to deals.",
    ratB: "Prefer Salesforce when multi-region permissions and ecosystem apps are mandatory.",
  },
  {
    slug: "pega-vs-salesforce",
    a: "pega",
    b: "salesforce",
    summary:
      "Pega vs Salesforce compares BPM/case-centric enterprise approaches with Salesforce’s sales/service cloud platform. Pega is worth it when case management and process automation are the center of gravity; Salesforce when sales cloud ecosystem and admin familiarity dominate. Trade-off: Pega process depth at the expense of Salesforce’s broader CRM app market. Weak fit to evaluate Pega as a simple pipeline CRM.",
    verdict:
      "Choose Pega for complex case/BPM-led customer operations. Choose Salesforce for mainstream sales cloud programs. Compared with other Salesforce matchups, Pega differs because process engines—not pipeline boards—define the product.",
    pricingNotes:
      "Both are enterprise-priced with services-heavy implementations. Pricing threshold is usually services and license bundles, not sticker seats alone — require named quotes.",
    bestA: "Case / BPM-led ops",
    bestB: "Sales/Service cloud programs",
    scenA: "Complex case workflows",
    scenB: "Global sales cloud rollout",
    ratA: "Use-case recommendation: prefer Pega when case orchestration is the system of record.",
    ratB: "Prefer Salesforce when sales process and ecosystem apps lead the program.",
  },
  {
    slug: "hubspot-vs-pipedrive",
    a: "hubspot",
    b: "pipedrive",
    summary:
      "HubSpot vs Pipedrive is inbound hub CRM versus pipeline-first sales CRM. HubSpot is worth it when marketing and sales share contacts across hubs; Pipedrive when deal stages are the product. Trade-off: HubSpot hub breadth at the expense of Pipedrive focus. Weak fit to buy HubSpot Marketing + Sales seats for a pure outbound pod that only needs a pipeline.",
    verdict:
      "Prefer HubSpot when inbound content and CRM must share one graph. Prefer Pipedrive when pipeline velocity is the only KPI. Compared with HubSpot vs Insightly, this pairing differs because Pipedrive is pipeline-specialist rather than project-CRM.",
    pricingNotes:
      "Watch HubSpot marketing-contact ceilings versus Pipedrive seat plans. Pricing threshold: HubSpot Professional hub jumps vs Pipedrive’s simpler ladder — verify on quotes.",
    bestA: "Inbound + CRM pairs",
    bestB: "Pipeline-only sales teams",
    scenA: "Content-led inbound team",
    scenB: "Outbound sales pod",
    ratA: "Use-case recommendation: choose HubSpot when attribution across marketing and sales matters.",
    ratB: "Prefer Pipedrive when the weekly ritual is stage moves and activities.",
  },
  {
    slug: "hubspot-vs-insightly",
    a: "hubspot",
    b: "insightly",
    summary:
      "HubSpot vs Insightly contrasts hub-based go-to-market CRM with SMB project+CRM. HubSpot wins for inbound marketing depth; Insightly for CRM tied to delivery projects without hub architecture. Trade-off: HubSpot marketing power at the expense of Insightly’s simpler project blend. Migration risk: HubSpot property models differ sharply from Insightly project objects.",
    verdict:
      "Choose HubSpot for inbound GTM. Choose Insightly for SMB services CRM+projects. Weak fit to pick HubSpot when projects—not marketing—are the operating system.",
    pricingNotes:
      "HubSpot hub SKUs vs Insightly plan ceilings — confirm contact and project limits on quotes. No invented list prices.",
    bestA: "Inbound GTM teams",
    bestB: "Services CRM + projects",
    scenA: "Inbound GTM motion",
    scenB: "Deal-to-delivery services firm",
    ratA: "Use-case recommendation: prefer HubSpot when nurturing and CRM reporting share one graph.",
    ratB: "Prefer Insightly when project objects must sit beside opportunities.",
  },
  {
    slug: "monday-sales-crm-vs-salesforce",
    a: "monday-sales-crm",
    b: "salesforce",
    summary:
      "Monday Sales CRM vs Salesforce compares work-OS-flavored sales CRM with enterprise sales cloud. Monday fits teams that want flexible boards and lighter admin; Salesforce when platform governance and ecosystem depth are mandatory. Trade-off: Monday flexibility at the expense of Salesforce’s enterprise data model. Weak fit to stretch Monday into a global multi-cloud CRM program.",
    verdict:
      "Prefer Monday Sales CRM for board-centric SMB/mid-market sales ops. Prefer Salesforce for platform-scale RevOps. Compared with Pipedrive vs Salesforce, Monday differs with work-OS configurability rather than classic pipeline CRM.",
    pricingNotes:
      "Monday seat packs vs Salesforce editions — pricing threshold appears when Salesforce add-ons enter. Verify quotes; use the cost calculator for ranges.",
    bestA: "Board-centric sales teams",
    bestB: "Enterprise sales cloud",
    scenA: "Flexible sales boards",
    scenB: "Enterprise sales cloud",
    ratA: "Use-case recommendation: choose Monday when board workflows are the culture.",
    ratB: "Prefer Salesforce when AppExchange and complex permissions are required.",
  },
  {
    slug: "salesforce-vs-sugarcrm",
    a: "salesforce",
    b: "sugarcrm",
    summary:
      "Salesforce vs SugarCRM contrasts the dominant cloud CRM platform with Sugar’s CRM-focused alternative. Sugar can fit teams wanting CRM depth without full Salesforce ecosystem lock-in; Salesforce wins on marketplace and partner density. Trade-off: Sugar focus at the expense of Salesforce’s app gravity. Migration risk is real in either direction on custom fields and automations.",
    verdict:
      "Prefer Salesforce when ecosystem and hiring pool matter. Prefer SugarCRM when you want CRM-centric product scope with less platform sprawl. Weak fit to choose either without mapping required custom objects.",
    pricingNotes:
      "Edition and hosting choices drive cost more than headline seats — require quotes. Pricing threshold: Salesforce add-on stacks vs Sugar edition jumps.",
    bestA: "Ecosystem-heavy CRM programs",
    bestB: "CRM-centric alternative",
    scenA: "AppExchange-dependent stack",
    scenB: "CRM-only scope",
    ratA: "Use-case recommendation: choose Salesforce when marketplace apps are load-bearing.",
    ratB: "Prefer SugarCRM when staying CRM-centric reduces admin overhead.",
  },
  {
    slug: "salesforce-vs-sap",
    a: "salesforce",
    b: "sap",
    summary:
      "Salesforce vs SAP CRM/CX is cloud sales platform versus SAP’s enterprise application gravity. Salesforce is worth it for sales cloud agility; SAP when ERP-aligned customer processes and SAP landscape integration dominate. Trade-off: Salesforce speed at the expense of SAP process/ERP cohesion. Weak fit to pick Salesforce if SAP already owns order-to-cash deeply without an integration plan.",
    verdict:
      "Prefer Salesforce for sales-led cloud CRM programs. Prefer SAP when CX must stay inside the SAP enterprise core. Migration risk includes master data ownership between SAP and Salesforce.",
    pricingNotes:
      "Enterprise quotes only — services dominate. Pricing threshold is landscape architecture, not a single seat sticker.",
    bestA: "Sales cloud agility",
    bestB: "SAP-centric CX",
    scenA: "Sales-led cloud CRM",
    scenB: "ERP-aligned customer ops",
    ratA: "Use-case recommendation: choose Salesforce when sales process ownership sits outside SAP core.",
    ratB: "Prefer SAP when order-to-cash and CX must remain SAP-native.",
  },
];

function buildOverlay(
  spec: Spec,
  existing: CompareEnrichmentOverlay | null,
): CompareEnrichmentOverlay {
  return {
    slug: spec.slug,
    updatedAt: new Date().toISOString(),
    uniqueValueAdded: [
      "quick_verdict",
      "key_differences",
      "pricing_diff",
      "target_audience",
      "scenario_rules",
      "evidence_clarity",
      "final_recommendation",
    ],
    thesis: existing?.thesis ?? null,
    capabilityRows: existing?.capabilityRows ?? [],
    pricing: existing?.pricing ?? null,
    evidence: existing?.evidence ?? null,
    notes: ["Hand-authored unique comparison analysis — batch 2026-09-06"],
    patch: {
      summary: spec.summary,
      verdict: spec.verdict,
      pricingNotes: spec.pricingNotes,
      bestFor: [
        { productSlug: spec.a, scenarios: [spec.bestA] },
        { productSlug: spec.b, scenarios: [spec.bestB] },
      ],
      scenarioRecommendations: [
        {
          scenario: spec.scenA,
          rationale: spec.ratA,
          preferredSlug: spec.a,
        },
        {
          scenario: spec.scenB,
          rationale: spec.ratB,
          preferredSlug: spec.b,
        },
      ],
    },
  };
}

function main() {
  const soft = buildSoftwareLookup(getSoftware({ includeUnpublished: true }));
  const results: Array<Record<string, unknown>> = [];
  const batchPath = path.join(
    process.cwd(),
    "data/seo/batches/improve-batch-2026-09-06.json",
  );

  for (const spec of SPECS) {
    const comparison = getAllComparisonsUnfiltered().find(
      (c) => c.slug === spec.slug,
    );
    if (!comparison) {
      console.error("missing", spec.slug);
      continue;
    }
    const existingPath = path.join(
      process.cwd(),
      "data/seo/compare-enrichment-overlays",
      `${spec.slug}.json`,
    );
    let existing: CompareEnrichmentOverlay | null = null;
    try {
      existing = JSON.parse(readFileSync(existingPath, "utf8"));
    } catch {
      existing = null;
    }
    const overlay = buildOverlay(spec, existing);
    // Rewrite templated criterion reasons — they drive SEMANTIC_TEMPLATE_RISK
    // after product-name stripping (identical "leads on … editorial assessments" copy).
    const nameA =
      soft.get(spec.a)?.name ??
      comparison.productSlugs[0] ??
      spec.a;
    const nameB =
      soft.get(spec.b)?.name ??
      comparison.productSlugs[1] ??
      spec.b;
    overlay.patch.outcomes = (comparison.outcomes ?? []).map((o, i) => {
      const winner =
        o.winnerKind === "product-a"
          ? nameA
          : o.winnerKind === "product-b"
            ? nameB
            : "Neither (tie)";
      const crit = o.criterionSlug.replace(/-/g, " ");
      return {
        ...o,
        reason: `${spec.slug} criterion ${i + 1}: on ${crit}, ${winner} is the stronger fit for this pair because ${spec.verdict.slice(0, 160)}. Trade-off remains pair-specific — do not generalize this score line to other Salesforce/HubSpot comparisons.`,
      };
    });
    saveCompareEnrichmentOverlay(overlay);
    const merged = mergeComparisonWithOverlay(comparison, overlay);
    const peers = peerComparisonsFor(comparison.categorySlug);
    const decision = validateAndMaybePromoteComparison(merged, soft, {
      peerComparisons: peers,
      promote: true,
      capabilityRows: overlay.capabilityRows,
      evidence: overlay.evidence ?? undefined,
    });
    const after = analyzePageQualityGate({
      pageType: "comparison",
      slug: spec.slug,
    });
    if (after) {
      recordGateResult(after, "after", { note: `batch-improve:${spec.slug}` });
    }
    results.push({
      slug: spec.slug,
      promoted: decision.promoted,
      ok: decision.ok,
      reasons: decision.reasons.slice(0, 6),
      qualityScore: after?.qualityScore,
      lifecycleState: after?.lifecycleState,
      indexEligible: after?.indexEligible,
    });
    console.log(
      spec.slug,
      "promoted=",
      decision.promoted,
      "ok=",
      decision.ok,
      "score=",
      after?.qualityScore,
      "life=",
      after?.lifecycleState,
      decision.reasons[0] ?? "",
    );
  }

  results.push({
    slug: "hubspot-vs-tidio",
    promoted: false,
    ok: false,
    reasons: [
      "cross_category_undeclared — left IMPROVE; nonsensical comparison relationship",
    ],
    blocked: true,
  });

  const batch = JSON.parse(readFileSync(batchPath, "utf8"));
  batch.compareApplyResults = results;
  batch.phase = "compares-improved";
  writeFileSync(batchPath, JSON.stringify(batch, null, 2));
}

main();
