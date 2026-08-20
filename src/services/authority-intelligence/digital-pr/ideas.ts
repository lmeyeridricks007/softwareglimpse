/**
 * PR ideas grounded only in existing SoftwareGlimpse data.
 * Do not invent statistics — status reflects data readiness.
 */

import type { ResearchCorpusSnapshot } from "./inventory";
import type { DigitalPrIdea } from "./types";
import { scoreLinkability, rankPrIdeas } from "./qualify";

function corpusBlurb(c: ResearchCorpusSnapshot): string {
  return `${c.productCount} researched CRM products · ${c.planCount} plans · ${c.featureSupportRows} feature-support rows (live corpus scan)`;
}

export function buildDigitalPrIdeas(
  corpus: ResearchCorpusSnapshot,
): DigitalPrIdea[] {
  const gatedTop = corpus.topGatedFeatures
    .slice(0, 3)
    .map((g) => g.featureSlug)
    .join(", ");

  const ideas: DigitalPrIdea[] = [
    {
      id: "pr-pricing-index",
      title: "CRM Pricing Index 2026",
      summary: `Publish a dated index of list prices across SoftwareGlimpse’s researched CRM set (${corpus.productCount} products / ${corpus.planCount} plans), with methodology, verification dates, and currency notes — not market-wide averages.`,
      status: "ready",
      scoreBand: "EXCELLENT",
      scoreNormalized: 0,
      linkability: {
        originality: "strong",
        dataUniqueness: "strong",
        newsworthiness: "excellent",
        timeliness: "excellent",
        visualPotential: "excellent",
        citationPotential: "excellent",
        audienceFit: "excellent",
        reproducibility: "excellent",
      },
      dataRequired: [
        "Public list prices by plan",
        "Billing period (monthly/annual)",
        "Currency",
        "As-of / verifiedAt dates",
      ],
      existingDataAvailable: [
        `enrichment.pricing for ${corpus.productCount} products (${corpus.planCount} plans)`,
        `${corpus.pricingVerified}/${corpus.productCount} with pricing.verifiedAt`,
        "Pricing engine for consistent recomputes",
      ],
      newResearchNeeded: [
        "Optional: refresh any stale verifiedAt rows before publish",
        "Explicit methodology page stating researched-set scope (not universe)",
      ],
      dataInventoryIds: ["pricing-enrichment", "pricing-engine", "evidence-media"],
      targetAudiences: [
        "SMB / mid-market CRM buyers",
        "RevOps / procurement",
        "SaaS journalists covering pricing",
        "Consultants building buyer guides",
      ],
      potentialPublications: [
        "Capterra Resources",
        "Sasanova",
        "CompareEdge",
        "CIOPages",
        "Zylo (category example cites)",
      ],
      publicationMatchIds: [
        "capterra.com",
        "sasanova.com",
        "comparedge.com",
        "ciopages.com",
      ],
      timeliness:
        "High — competing 2026 CRM pricing reports already in market; SG can differentiate with transparent methodology + calculator.",
      effort: "M",
      recommendedNextAction:
        "Export dated pricing table + methodology draft; land on /tools/crm-cost-calculator/ and /methodology/; prepare embeddable chart with attribution (no follow-link requirement).",
      landingPages: [
        "/tools/crm-cost-calculator/",
        "/methodology/",
        "/compare/",
      ],
      visuals: [
        {
          kind: "benchmark-table",
          description: "Entry / mid / enterprise list prices by vendor (as-of date)",
          embeddable: true,
          attributionRequired: true,
          followLinkRequired: false,
        },
        {
          kind: "chart",
          description: "Distribution of starting list prices across researched set",
          embeddable: true,
          attributionRequired: true,
          followLinkRequired: false,
        },
        {
          kind: "downloadable-dataset",
          description: "CSV of plans with verifiedAt and source IDs",
          embeddable: false,
          attributionRequired: true,
          followLinkRequired: false,
        },
        {
          kind: "methodology",
          description: "Scope, exclusions, currency, annual vs monthly rules",
          embeddable: false,
          attributionRequired: true,
          followLinkRequired: false,
        },
        {
          kind: "interactive-calculator",
          description: "CRM Cost Calculator deep-link for team-size scenarios",
          embeddable: false,
          attributionRequired: true,
          followLinkRequired: false,
        },
      ],
      inventsStatistics: false,
      limitations: [
        corpusBlurb(corpus),
        "List prices only — not negotiated customer pricing.",
      ],
    },
    {
      id: "pr-team-size-pricing",
      title: "How CRM list prices change by team size",
      summary:
        "Recompute comparable monthly/annual costs at fixed seat bands (e.g. 5 / 25 / 50) using SG pricing rules — shows scaling cliffs without inventing discounts.",
      status: "ready",
      scoreBand: "EXCELLENT",
      scoreNormalized: 0,
      linkability: {
        originality: "strong",
        dataUniqueness: "strong",
        newsworthiness: "strong",
        timeliness: "excellent",
        visualPotential: "excellent",
        citationPotential: "excellent",
        audienceFit: "excellent",
        reproducibility: "excellent",
      },
      dataRequired: [
        "Per-seat / flat plan rules",
        "Seat minimums",
        "Feature eligibility at each band",
      ],
      existingDataAvailable: [
        "Pricing engine + fixtures (5/25/50 style scenarios)",
        `Plan rules across ${corpus.productCount} products`,
      ],
      newResearchNeeded: [
        "Standardize scenario definitions (features required at each band)",
      ],
      dataInventoryIds: ["pricing-enrichment", "pricing-engine", "feature-gating"],
      targetAudiences: [
        "Founders / sales leaders planning headcount",
        "Finance / procurement",
        "RevOps",
      ],
      potentialPublications: ["Sasanova", "CompareEdge", "Capterra Resources", "TechCrunch (data cite)"],
      publicationMatchIds: ["sasanova.com", "comparedge.com", "capterra.com"],
      timeliness: "Peak in Q4 budget season; evergreen for hiring ramps.",
      effort: "M",
      recommendedNextAction:
        "Generate seat-band cost chart + dataset; publish with Cost Calculator CTA; pitch as complementary data to existing cliff analyses (e.g. HubSpot-style discontinuities) without copying others’ stats.",
      landingPages: ["/tools/crm-cost-calculator/", "/resources/crm-evaluation-checklist/"],
      visuals: [
        {
          kind: "chart",
          description: "Cost vs seats lines for major researched CRMs",
          embeddable: true,
          attributionRequired: true,
          followLinkRequired: false,
        },
        {
          kind: "visual-comparison",
          description: "Side-by-side 10-seat vs 50-seat total list cost",
          embeddable: true,
          attributionRequired: true,
          followLinkRequired: false,
        },
        {
          kind: "embeddable-chart",
          description: "iframe/SVG chart with SoftwareGlimpse attribution",
          embeddable: true,
          attributionRequired: true,
          followLinkRequired: false,
        },
      ],
      inventsStatistics: false,
      limitations: ["Modeled list cost — not true TCO."],
    },
    {
      id: "pr-plan-gating",
      title: "Which CRM features are most often locked behind higher plans?",
      summary: `Analyze featureSupport availability across the researched set. Current live scan: ${corpus.availabilityMix["higher-plan-only"] ?? 0} higher-plan-only rows; top gated include ${gatedTop || "n/a"}.`,
      status: "ready",
      scoreBand: "EXCELLENT",
      scoreNormalized: 0,
      linkability: {
        originality: "excellent",
        dataUniqueness: "excellent",
        newsworthiness: "strong",
        timeliness: "strong",
        visualPotential: "excellent",
        citationPotential: "excellent",
        audienceFit: "excellent",
        reproducibility: "excellent",
      },
      dataRequired: [
        "featureSupport.availability",
        "feature taxonomy",
        "product coverage",
      ],
      existingDataAvailable: [
        `${corpus.featureSupportRows} feature-support rows`,
        `Availability mix: ${JSON.stringify(corpus.availabilityMix)}`,
        "Canonical feature seed",
      ],
      newResearchNeeded: [
        "Human QA on ambiguous planSlugs before headline claims",
      ],
      dataInventoryIds: ["feature-gating", "evidence-media"],
      targetAudiences: [
        "CRM buyers evaluating Starter vs Pro",
        "Consultants",
        "Industry publications covering packaging",
      ],
      potentialPublications: [
        "Capterra Resources",
        "Sasanova",
        "CRM Curator",
        "CIOPages",
      ],
      publicationMatchIds: ["capterra.com", "sasanova.com", "crmcurator.com"],
      timeliness:
        "Strong whenever vendors re-bundle AI/automation into higher tiers.",
      effort: "M",
      recommendedNextAction:
        "Publish heatmap of feature × availability; lead with forecasting / automation / AI gating; offer downloadable matrix + methodology.",
      landingPages: [
        "/tools/crm-finder/",
        "/tools/crm-vendor-scorecard/",
        "/resources/crm-comparison-worksheet/",
      ],
      visuals: [
        {
          kind: "chart",
          description: "Bar chart: features by higher-plan-only count",
          embeddable: true,
          attributionRequired: true,
          followLinkRequired: false,
        },
        {
          kind: "visual-comparison",
          description: "Heatmap vendor × feature availability",
          embeddable: true,
          attributionRequired: true,
          followLinkRequired: false,
        },
        {
          kind: "downloadable-dataset",
          description: "Feature gating CSV with sourceIds",
          embeddable: false,
          attributionRequired: true,
          followLinkRequired: false,
        },
      ],
      inventsStatistics: false,
      limitations: [
        "Describes researched set packaging — not buyer preference rankings.",
      ],
    },
    {
      id: "pr-free-trial-prevalence",
      title: "Free CRM plans & free trials among researched vendors",
      summary: `Report prevalence of free plans (${corpus.hasFreePlan}/${corpus.productCount}) and free trials (${corpus.hasFreeTrial}/${corpus.productCount}) in the SG corpus — clear, citeable, no survey needed.`,
      status: "ready",
      scoreBand: "STRONG",
      scoreNormalized: 0,
      linkability: {
        originality: "good",
        dataUniqueness: "good",
        newsworthiness: "good",
        timeliness: "strong",
        visualPotential: "good",
        citationPotential: "strong",
        audienceFit: "strong",
        reproducibility: "excellent",
      },
      dataRequired: ["hasFreePlan", "hasFreeTrial", "limits notes"],
      existingDataAvailable: [
        `hasFreePlan=${corpus.hasFreePlan}`,
        `hasFreeTrial=${corpus.hasFreeTrial}`,
      ],
      newResearchNeeded: [
        "Optional footnotes on free-plan contact/seat caps from plan.limits",
      ],
      dataInventoryIds: ["pricing-enrichment"],
      targetAudiences: ["SMB founders", "bootstrapped teams", "buyer-guide editors"],
      potentialPublications: ["CompareEdge", "Capterra Resources", "Zylo"],
      publicationMatchIds: ["comparedge.com", "capterra.com", "zylo.com"],
      timeliness: "Useful for SMB software-planning seasons.",
      effort: "S",
      recommendedNextAction:
        "Ship short data note + chart; cross-link Cost Calculator free/trial filters if available.",
      landingPages: ["/tools/crm-finder/", "/tools/crm-cost-calculator/"],
      visuals: [
        {
          kind: "chart",
          description: "Share of researched CRMs with free plan vs trial",
          embeddable: true,
          attributionRequired: true,
          followLinkRequired: false,
        },
      ],
      inventsStatistics: false,
      limitations: [],
    },
    {
      id: "pr-ai-feature-comparison",
      title: "CRM AI-feature availability comparison (researched set)",
      summary: `Compare AI capability labels across enrichments (${corpus.aiCapabilityRows} rows) — what vendors claim as supported / limited / gated — timed for Dreamforce / Agentforce news cycles.`,
      status: "near-ready",
      scoreBand: "STRONG",
      scoreNormalized: 0,
      linkability: {
        originality: "strong",
        dataUniqueness: "strong",
        newsworthiness: "excellent",
        timeliness: "excellent",
        visualPotential: "strong",
        citationPotential: "strong",
        audienceFit: "excellent",
        reproducibility: "strong",
      },
      dataRequired: [
        "aiCapabilities.capability",
        "availability",
        "sourceIds",
        "notes",
      ],
      existingDataAvailable: [
        `${corpus.aiCapabilityRows} AI capability rows`,
        "Vendor notes (e.g. assistant names)",
      ],
      newResearchNeeded: [
        "Normalize capability taxonomy for apples-to-apples chart",
        "Separate list-price AI add-ons where pricing enrichment allows — do not invent credit costs",
      ],
      dataInventoryIds: ["ai-capabilities", "pricing-enrichment"],
      targetAudiences: [
        "Technology leaders",
        "RevOps evaluating AI SKUs",
        "Trade press covering Agentforce / Breeze / Freddy",
      ],
      potentialPublications: [
        "CRM Curator",
        "MarketScale",
        "Salesforce Break",
        "TechCrunch",
      ],
      publicationMatchIds: [
        "crmcurator.com",
        "marketscale.com",
        "salesforcebreak.com",
        "techcrunch.com",
      ],
      timeliness:
        "Peak around Dreamforce 2026 (Sep 15–17) and ongoing AI-pricing coverage.",
      effort: "M",
      recommendedNextAction:
        "Normalize AI capability taxonomy; publish availability matrix with Dreamforce news hook; clearly label as packaging/availability — not performance.",
      landingPages: ["/tools/crm-finder/", "/compare/", "/methodology/"],
      visuals: [
        {
          kind: "visual-comparison",
          description: "AI capability × vendor availability matrix",
          embeddable: true,
          attributionRequired: true,
          followLinkRequired: false,
        },
        {
          kind: "methodology",
          description: "What 'supported' means in SG enrichment",
          embeddable: false,
          attributionRequired: true,
          followLinkRequired: false,
        },
      ],
      inventsStatistics: false,
      limitations: [
        "Availability labels ≠ quality, accuracy, or ROI.",
        "Do not invent token/credit consumption figures.",
      ],
    },
    {
      id: "pr-editorial-scoreboard",
      title: "SoftwareGlimpse CRM editorial scoreboard (methodology-first)",
      summary: `Publish criterion distributions from ${corpus.editorialAssessmentCount} editorial assessments with full methodology — desk research, handsOnTesting disclosed.`,
      status: "near-ready",
      scoreBand: "GOOD",
      scoreNormalized: 0,
      linkability: {
        originality: "good",
        dataUniqueness: "good",
        newsworthiness: "good",
        timeliness: "good",
        visualPotential: "strong",
        citationPotential: "good",
        audienceFit: "strong",
        reproducibility: "strong",
      },
      dataRequired: [
        "Approved assessments",
        "crm-methodology criteria",
        "handsOnTesting flags",
      ],
      existingDataAvailable: [
        `${corpus.editorialAssessmentCount} assessment files`,
        "10 equal-weight criteria seed",
      ],
      newResearchNeeded: [
        "Editorial pass to ensure all cited scores are approved",
        "Clear non-affiliate ranking disclaimer",
      ],
      dataInventoryIds: ["editorial-scorecards"],
      targetAudiences: ["Consultants", "buyer-guide authors", "educators"],
      potentialPublications: ["CIOPages", "industry blogs seeking methodology cites"],
      publicationMatchIds: ["ciopages.com"],
      timeliness: "Evergreen; refresh quarterly with assessment updates.",
      effort: "M",
      recommendedNextAction:
        "Ship scoreboard + methodology with Vendor Scorecard tool CTA; never frame as user-review aggregate.",
      landingPages: [
        "/tools/crm-vendor-scorecard/",
        "/methodology/",
        "/resources/crm-vendor-scorecard/",
      ],
      visuals: [
        {
          kind: "chart",
          description: "Overall score distribution across assessed CRMs",
          embeddable: true,
          attributionRequired: true,
          followLinkRequired: false,
        },
        {
          kind: "methodology",
          description: "10 criteria definitions + desk-research scope",
          embeddable: false,
          attributionRequired: true,
          followLinkRequired: false,
        },
      ],
      inventsStatistics: false,
      limitations: ["Desk research — not hands-on lab or user reviews."],
    },
    {
      id: "pr-requirements-framework",
      title: "CRM buyer requirements framework (ontology publication)",
      summary:
        "Publish the requirements → capabilities → features graph as a citeable educational framework for RFPs and consultants.",
      status: "ready",
      scoreBand: "STRONG",
      scoreNormalized: 0,
      linkability: {
        originality: "strong",
        dataUniqueness: "strong",
        newsworthiness: "good",
        timeliness: "good",
        visualPotential: "strong",
        citationPotential: "strong",
        audienceFit: "excellent",
        reproducibility: "excellent",
      },
      dataRequired: ["CRM graph requirements", "feature links", "use cases"],
      existingDataAvailable: [
        "crm-graph requirements/capabilities/use-cases",
        "Requirements Builder tool",
        "Downloadable requirements templates",
      ],
      newResearchNeeded: [
        "Polished visual ontology diagram for embed",
      ],
      dataInventoryIds: ["requirements-ontology"],
      targetAudiences: [
        "CRM professionals",
        "implementation consultants",
        "educators",
      ],
      potentialPublications: [
        "CIOPages",
        "RevOps newsletters",
        "consultant resource pages",
      ],
      publicationMatchIds: ["ciopages.com"],
      timeliness: "Evergreen educational citation magnet.",
      effort: "S",
      recommendedNextAction:
        "Publish framework page + embeddable diagram; link Requirements Builder and checklist downloads.",
      landingPages: [
        "/tools/crm-requirements-builder/",
        "/resources/crm-requirements-template/",
        "/resources/crm-rfp-template/",
      ],
      visuals: [
        {
          kind: "map",
          description: "Requirements → features ontology diagram",
          embeddable: true,
          attributionRequired: true,
          followLinkRequired: false,
        },
        {
          kind: "downloadable-dataset",
          description: "Requirements checklist CSV",
          embeddable: false,
          attributionRequired: true,
          followLinkRequired: false,
        },
      ],
      inventsStatistics: false,
      limitations: ["Framework citation — not survey prevalence."],
    },
    {
      id: "pr-fs-security-map",
      title: "Financial services CRM security & requirements map",
      summary:
        "Package the deep FS industry hub as a citeable educational scorecard for regulated buyers — one industry where SG already has depth.",
      status: "near-ready",
      scoreBand: "GOOD",
      scoreNormalized: 0,
      linkability: {
        originality: "good",
        dataUniqueness: "good",
        newsworthiness: "good",
        timeliness: "good",
        visualPotential: "strong",
        citationPotential: "good",
        audienceFit: "strong",
        reproducibility: "strong",
      },
      dataRequired: [
        "FS hub security dimensions",
        "capability priorities",
        "related guides",
      ],
      existingDataAvailable: [
        "industry-hub/financial-services.ts",
        "FS CRM guides seed",
        "security checklist resource",
      ],
      newResearchNeeded: [
        "Editorial polish + disclaimer (not compliance certification)",
      ],
      dataInventoryIds: ["industry-fs"],
      targetAudiences: [
        "FS technology leaders",
        "compliance-aware buyers",
        "industry consultants",
      ],
      potentialPublications: [
        "FS trade press",
        "CIOPages",
        "industry association resource lists",
      ],
      publicationMatchIds: ["ciopages.com"],
      timeliness: "Steady demand; spikes with regulatory news.",
      effort: "M",
      recommendedNextAction:
        "Publish visual security-dimension map + checklist; do not claim certification rates.",
      landingPages: [
        "/industries/financial-services/",
        "/resources/crm-security-checklist/",
      ],
      visuals: [
        {
          kind: "map",
          description: "FS CRM security dimensions visual",
          embeddable: true,
          attributionRequired: true,
          followLinkRequired: false,
        },
        {
          kind: "benchmark-table",
          description: "Capability priority table for FS buyers",
          embeddable: true,
          attributionRequired: true,
          followLinkRequired: false,
        },
      ],
      inventsStatistics: false,
      limitations: [
        "Educational framework — not audit results or market prevalence.",
      ],
    },
    {
      id: "pr-implementation-methodology",
      title: "CRM implementation complexity — methodology explainer (not a benchmark study)",
      summary:
        "Explain how SG’s Implementation Planner scores complexity drivers. Useful for education/citations; NOT an empirical duration study.",
      status: "near-ready",
      scoreBand: "GOOD",
      scoreNormalized: 0,
      linkability: {
        originality: "good",
        dataUniqueness: "good",
        newsworthiness: "low",
        timeliness: "good",
        visualPotential: "good",
        citationPotential: "good",
        audienceFit: "strong",
        reproducibility: "excellent",
      },
      dataRequired: ["complexity driver weights", "phase model"],
      existingDataAvailable: [
        "implementation-planner complexity rules",
        "Implementation Planner tool",
        "implementation checklist resource",
      ],
      newResearchNeeded: [
        "Primary research if claiming empirical timelines (separate project)",
      ],
      dataInventoryIds: ["implementation-migration-models"],
      targetAudiences: ["implementation consultants", "project managers", "educators"],
      potentialPublications: ["consultant blogs", "CIOPages"],
      publicationMatchIds: ["ciopages.com"],
      timeliness: "Evergreen methodology cite.",
      effort: "S",
      recommendedNextAction:
        "Publish methodology article with interactive planner; explicitly refuse fake 'average weeks' stats.",
      landingPages: [
        "/tools/crm-implementation-planner/",
        "/resources/crm-implementation-checklist/",
      ],
      visuals: [
        {
          kind: "methodology",
          description: "Complexity driver diagram",
          embeddable: true,
          attributionRequired: true,
          followLinkRequired: false,
        },
      ],
      inventsStatistics: false,
      limitations: [
        "Not an empirical implementation-duration benchmark.",
      ],
    },
  ];

  return rankPrIdeas(
    ideas.map((idea) => ({
      ...idea,
      scoreNormalized: scoreLinkability(idea.linkability),
      scoreBand: idea.scoreBand,
    })),
  );
}

export const DEFERRED_PR_IDEAS: Array<{ title: string; reason: string }> = [
  {
    title: "CRM buyer requirements survey",
    reason:
      "No survey/panel corpus in SoftwareGlimpse — would invent prevalence statistics if published now.",
  },
  {
    title: "CRM implementation complexity benchmark (empirical)",
    reason:
      "Only deterministic planning heuristics exist — no measured timeline/failure corpus.",
  },
  {
    title: "CRM migration readiness benchmark (empirical)",
    reason:
      "Migration Planner is a planning model, not observed migration outcomes.",
  },
  {
    title: "Longitudinal CRM Pricing Index (YoY price change study)",
    reason:
      "No historical pricing snapshots stored for trend analysis yet.",
  },
  {
    title: "CRM integration landscape report",
    reason:
      "integrationSupport rows are too sparse vs real marketplaces for a serious landscape study.",
  },
];
