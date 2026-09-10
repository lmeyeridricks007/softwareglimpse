/**
 * Product explainer (`what-is-{product}`) enrichment.
 * Informational / orientation intent — distinct from `/software/{slug}/` evaluation.
 */
import type { GuideContentBlock, GuidePage } from "@/domain/schemas";
import {
  getComparisonsForProduct,
  getSoftwareBySlug,
} from "@/data/repositories/catalog";
import {
  categoryDecisionCostHref,
  categoryDecisionFinderHref,
} from "@/data/config/tools/category-tool-meta";
import { getSoftwareLinkGroups } from "@/services/relationships/software-links";
import { resolveEvidenceLevel } from "@/services/editorial/evidence-level";
import { getFounderAuthor, resolveAuthor } from "@/services/site-foundation";
import { loadSafeProductContext } from "./enrich-context";
import { resolveCredibilitySignals } from "./credibility";
import type { GuideEnrichmentOverlay } from "./overlay-merge";
import type { UniqueValueElement } from "./types";

export type ProductExplainerBuildResult = {
  overlay: GuideEnrichmentOverlay;
  uniqueValueAdded: UniqueValueElement[];
  blocks: GuideContentBlock[];
  notes: string[];
  /** False when catalogue lacks enough product-specific signals. */
  sufficientProductSignals: boolean;
};

function bid(slug: string, prefix: string, n: { i: number }): string {
  n.i += 1;
  return `${prefix}-${slug}-${n.i}`;
}

function labelize(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * SEO framing that keeps explainer informational vs review commercial.
 */
export function productExplainerSeo(
  name: string,
  category: string,
): { title: string; description: string } {
  const title = `What is ${name}? Orientation guide`.slice(0, 70);
  const description =
    `${name} explained: who uses it, core workflows, capabilities, pricing shape, limits, and alternatives — orientation before a full SoftwareGlimpse evaluation.`.slice(
      0,
      320,
    );
  void category;
  return { title, description };
}

/**
 * Count product-specific signals so we do not ship name-swapped definitions.
 */
export function countProductSpecificSignals(productSlug: string): {
  score: number;
  notes: string[];
} {
  const software = getSoftwareBySlug(productSlug);
  const ctx = loadSafeProductContext(productSlug);
  const notes: string[] = [];
  let score = 0;
  if (!software || !ctx) {
    return { score: 0, notes: ["missing product context"] };
  }
  if (ctx.shortDescription) {
    score += 2;
  } else notes.push("no shortDescription");
  if ((ctx.bestFor?.length ?? 0) > 0) score += 2;
  else notes.push("no bestFor");
  if ((ctx.notIdealFor?.length ?? 0) > 0) score += 2;
  else notes.push("no notIdealFor");
  if ((ctx.coreLoopLabels?.length ?? 0) >= 2) score += 2;
  else notes.push("thin workflows");
  if ((ctx.features?.length ?? 0) >= 2) score += 2;
  else notes.push("thin capabilities");
  if ((ctx.plans?.length ?? 0) > 0 || software.pricing) score += 1;
  if (
    (ctx.integrationNames?.length ?? 0) > 0 ||
    (software.integrationSlugs?.length ?? 0) > 0
  ) {
    score += 1;
  }
  if (
    (software.alternativeSlugs?.length ?? 0) +
      (software.competitorSlugs?.length ?? 0) >
    0
  ) {
    score += 1;
  }
  if ((software.pros?.length ?? 0) > 0 || (software.cons?.length ?? 0) > 0) {
    score += 1;
  }
  return { score, notes };
}

/**
 * Build orientation blocks from catalogue data for an existing what-is-{product} URL.
 */
export function buildProductExplainerOverlay(
  guide: GuidePage,
): ProductExplainerBuildResult | null {
  const productSlug = guide.productSlugs[0];
  if (!productSlug || guide.slug !== `what-is-${productSlug}`) return null;

  const ctx = loadSafeProductContext(productSlug);
  const software = getSoftwareBySlug(productSlug);
  if (!ctx || !software) return null;

  const signals = countProductSpecificSignals(productSlug);
  const notes = [
    ...signals.notes.map((n) => `signal-gap: ${n}`),
    "Intent: informational orientation — not a substitute for the product review",
  ];
  const sufficientProductSignals = signals.score >= 5;
  if (!sufficientProductSignals) {
    notes.push(
      `Insufficient product-specific signals (score ${signals.score}) — refuse name-swap boilerplate`,
    );
  }

  const name = software.name || productSlug;
  const category = guide.categorySlugs[0] || ctx.categorySlug || "software";
  const n = { i: 0 };
  const blocks: GuideContentBlock[] = [];
  const uniqueValueAdded: UniqueValueElement[] = [];

  const problemBits = [
    ctx.whoShouldChoose,
    ...(ctx.bestFor ?? []).slice(0, 2),
  ].filter(Boolean) as string[];

  blocks.push({
    id: bid(guide.slug, "da", n),
    type: "direct-answer",
    body: `${name} is ${
      ctx.shortDescription ||
      `a ${category.replace(/-/g, " ")} product documented in the SoftwareGlimpse catalogue`
    }. This page orients you on what it is and who it fits — not a scored review.`,
    bullets: [
      problemBits[0]
        ? `Problem space: ${problemBits[0]}`
        : `Category: ${category.replace(/-/g, " ")}`,
      ...(ctx.coreLoopLabels.slice(0, 2).map((l) => `Workflow: ${l}`)),
      ...(ctx.bestFor[0] ? [`Often shortlisted when: ${ctx.bestFor[0]}`] : []),
    ],
  });

  blocks.push({
    id: bid(guide.slug, "kt", n),
    type: "key-takeaways",
    title: `What ${name} is (and is not)`,
    items: [
      {
        label: "What it is",
        body:
          ctx.shortDescription ||
          `${name} sits in ${category.replace(/-/g, " ")} with documented workflows and capabilities.`,
      },
      {
        label: "Problem it addresses",
        body:
          problemBits[0] ||
          `Teams evaluating ${category.replace(/-/g, " ")} tools for day-to-day operating work.`,
      },
      {
        label: "Who typically uses it",
        body: [
          ...(software.businessSizeSlugs ?? []).slice(0, 2).map(labelize),
          ...(software.teamTypeSlugs ?? []).slice(0, 2).map(labelize),
          ctx.whoShouldChoose,
        ]
          .filter(Boolean)
          .slice(0, 3)
          .join(" · ") ||
          `Buyers researching ${category.replace(/-/g, " ")} options before a demo.`,
      },
      {
        label: "Not intended for",
        body:
          (ctx.notIdealFor ?? [])[0] ||
          ctx.whoShouldConsiderAlternatives ||
          `Situations where ${name}'s documented strengths do not match your constraints — see limitations below.`,
      },
    ],
  });

  if (ctx.coreLoopLabels.length > 0) {
    blocks.push({
      id: bid(guide.slug, "wf", n),
      type: "step",
      heading: `${name} main workflows`,
      body: `${name}'s documented operating loops focus on: ${ctx.coreLoopLabels.slice(0, 5).join(", ")}. Use these as orientation — validate in a trial against your own process.`,
      stepNumber: 1,
      scenarios: ctx.coreLoopLabels.slice(0, 3).map((label) => ({
        title: label,
        body: `Confirm whether ${name} covers “${label}” the way your team runs it today.`,
      })),
    });
    uniqueValueAdded.push("scenario_analysis", "implementation_workflow");
  }

  if (ctx.features.length > 0) {
    blocks.push({
      id: bid(guide.slug, "fm", n),
      type: "feature-matrix",
      title: `${name} major capabilities`,
      rows: ctx.features.slice(0, 8).map((f) => ({
        feature: f.label,
        mustHave: !f.gated,
        niceToHave: f.gated,
        notes: f.gated
          ? `Often gated — ${f.planNames.slice(0, 2).join(", ") || "higher plans"}`
          : f.availability || "Documented in catalogue research",
      })),
    });
    uniqueValueAdded.push("category_criteria", "tradeoff_table");
  }

  const limitations = [
    ...ctx.enrichmentLimitations,
    ...ctx.reviewLimitations,
    ...ctx.notIdealFor,
    ...(software.cons ?? []),
  ].filter(Boolean);
  if (limitations.length > 0) {
    blocks.push({
      id: bid(guide.slug, "lim", n),
      type: "mistakes",
      title: `What ${name} is NOT intended for`,
      items: limitations.slice(0, 6).map((label, i) => ({
        title: `Limit ${i + 1}`,
        body: String(label),
      })),
    });
    uniqueValueAdded.push("limitations_evidence");
  }

  const pricingLines: Array<{ label: string; description: string }> = [];
  if (ctx.plans.length > 0) {
    for (const p of ctx.plans.slice(0, 6)) {
      pricingLines.push({
        label: p.name,
        description: [
          p.isFree ? "Free plan" : null,
          p.hasFreeTrial && p.trialDays
            ? `${p.trialDays}-day trial`
            : p.hasFreeTrial
              ? "Trial available"
              : null,
          p.capacityNote,
          p.contactSales ? "Contact sales" : null,
        ]
          .filter(Boolean)
          .join(" · ") || "Researched plan structure",
      });
    }
  } else if (software.pricing) {
    pricingLines.push({
      label: "Pricing model",
      description: [
        software.pricing.model !== "unknown" ? software.pricing.model : null,
        software.pricing.hasFreePlan ? "Free plan flagged" : null,
        software.pricing.hasFreeTrial ? "Trial flagged" : null,
        software.pricing.startingPriceMonthly != null
          ? `Starting ~$${software.pricing.startingPriceMonthly}/mo (catalogue)`
          : null,
      ]
        .filter(Boolean)
        .join(" · ") || "Pricing envelope present — verify amounts on the product page",
    });
  }
  if (pricingLines.length > 0) {
    const costHref = categoryDecisionCostHref(category);
    blocks.push({
      id: bid(guide.slug, "cost", n),
      type: "cost-breakdown",
      title: `How ${name} pricing works`,
      body: [
        "Orientation only — amounts appear only when verified in SoftwareGlimpse research.",
        software.pricingVerifiedAt
          ? `Pricing last checked: ${software.pricingVerifiedAt.slice(0, 10)}.`
          : "No pricingVerifiedAt on file yet.",
        (ctx.freePlanNames?.length ?? 0) > 0
          ? `Free plan names: ${ctx.freePlanNames!.slice(0, 3).join(", ")}.`
          : null,
        ctx.trialDays != null ? `Trial days documented: ${ctx.trialDays}.` : null,
      ]
        .filter(Boolean)
        .join(" "),
      lines: pricingLines,
      calculatorHref: costHref ?? undefined,
      calculatorLabel: costHref ? "Open cost calculator" : undefined,
    });
    uniqueValueAdded.push("pricing_comparison", "sg_original_data");
  }

  const integrations = [
    ...new Set([
      ...(ctx.nativeIntegrationNames ?? []),
      ...(ctx.integrationNames ?? []),
      ...(software.integrationSlugs ?? []).map(labelize),
    ]),
  ].filter(Boolean);
  if (integrations.length >= 3) {
    blocks.push({
      id: bid(guide.slug, "int", n),
      type: "integration-ecosystem",
      title: `${name} integrations`,
      hubLabel: category.replace(/-/g, " "),
      systems: integrations.slice(0, 8).map((label, i) => ({
        id: `int-${i}`,
        label,
      })),
      body: `Systems ${name} is documented to connect with — confirm coverage for your stack before buying.`,
    });
  } else if (integrations.length > 0) {
    blocks.push({
      id: bid(guide.slug, "int", n),
      type: "callout",
      title: `${name} integrations`,
      tone: "info",
      body: `Documented integrations include: ${integrations.join(", ")}. Treat this as orientation — verify critical connectors in a trial.`,
    });
  }

  const altSlugs = [
    ...new Set([
      ...(software.alternativeSlugs ?? []),
      ...(software.competitorSlugs ?? []),
      ...ctx.alternativeSlugs,
    ]),
  ].filter((s) => s !== productSlug);
  if (altSlugs.length > 0) {
    blocks.push({
      id: bid(guide.slug, "alts", n),
      type: "product-shortlist",
      title: `Common alternatives to ${name}`,
      body: `Peers from catalogue relationships — use comparisons to understand differences, not affiliate rank.`,
      productSlugs: altSlugs.slice(0, 5),
      disclaimer:
        "Shortlist from SoftwareGlimpse relationships. Explainer intent stays informational.",
    });
    uniqueValueAdded.push("product_shortlist", "alternatives_map");
  }

  const nearest = altSlugs
    .slice(0, 3)
    .map((s) => getSoftwareBySlug(s)?.name || s)
    .filter(Boolean);
  if (nearest.length > 0 || (software.pros?.length ?? 0) > 0) {
    blocks.push({
      id: bid(guide.slug, "diff", n),
      type: "comparison-framework",
      title: `How ${name} differs from nearest peers`,
      criteria: [
        {
          id: "strength",
          label: "Documented strength",
          weight: 3,
          description:
            (software.pros ?? [])[0] ||
            (ctx.bestFor ?? [])[0] ||
            `${name}'s published strengths in the catalogue`,
        },
        {
          id: "limit",
          label: "Documented limit",
          weight: 3,
          description:
            (software.cons ?? [])[0] ||
            (ctx.notIdealFor ?? [])[0] ||
            `Where ${name} is a weaker fit`,
        },
        {
          id: "peers",
          label: "Nearest peers",
          weight: 2,
          description: nearest.length
            ? `Often compared with ${nearest.join(", ")}`
            : "Open the alternatives page for peer context",
        },
      ],
    });
    uniqueValueAdded.push("tradeoff_table", "decision_framework");
  }

  blocks.push({
    id: bid(guide.slug, "df", n),
    type: "decision-framework",
    title: `When to consider ${name}`,
    steps: [
      {
        id: "df-1",
        label: ctx.bestFor[0]
          ? `Consider ${name} when ${ctx.bestFor[0]}`
          : `Consider ${name} when its workflows (${ctx.coreLoopLabels.slice(0, 3).join(", ") || "documented loops"}) match how you work`,
      },
      {
        id: "df-2",
        label: ctx.notIdealFor[0]
          ? `Skip or shortlist alternatives when ${ctx.notIdealFor[0]}`
          : `Skip when your must-haves sit outside ${name}'s documented capabilities`,
      },
      {
        id: "df-3",
        label:
          "Before buying: validate plan gates, critical integrations, and one real workflow in a trial — then read the full product evaluation",
      },
    ],
  });
  if (!uniqueValueAdded.includes("decision_framework")) {
    uniqueValueAdded.push("decision_framework");
  }

  blocks.push({
    id: bid(guide.slug, "chk", n),
    type: "selection-checklist",
    title: `Evaluate before buying ${name}`,
    dimensions: [
      {
        id: "fit",
        label: "Fit checks",
        options: [
          ...(ctx.bestFor ?? []).slice(0, 2),
          ...(ctx.coreLoopLabels ?? []).slice(0, 2),
        ].filter(Boolean).slice(0, 4).length
          ? [
              ...(ctx.bestFor ?? []).slice(0, 2),
              ...(ctx.coreLoopLabels ?? []).slice(0, 2),
            ].filter(Boolean).slice(0, 4)
          : ["Workflow match", "Team size fit", "Admin overhead acceptable"],
      },
      {
        id: "commercial",
        label: "Commercial checks",
        options: [
          ctx.freePlanNames?.length ? "Free plan usable for pilot" : "Pilot path clear",
          ctx.trialDays != null ? `${ctx.trialDays}-day trial enough` : "Trial/demo scoped",
          "Plan gates acceptable",
        ],
      },
      {
        id: "risk",
        label: "Risk checks",
        options: limitations.slice(0, 3).length
          ? limitations.slice(0, 3).map(String)
          : ["Integration risk", "Migration risk", "Reporting gaps"],
      },
    ],
  });
  uniqueValueAdded.push("buyer_checklist");

  const credibility = resolveCredibilitySignals(guide);
  const evidence = resolveEvidenceLevel({
    pricingVerifiedAt: software.pricingVerifiedAt ?? software.pricing?.verifiedAt,
    lastVerifiedAt: software.lastVerifiedAt,
    lastResearchedAt: software.lastResearchedAt ?? credibility.lastResearched,
    hasResearchSources: credibility.hasSources,
  });
  const author =
    resolveAuthor(guide.metadata.author) || getFounderAuthor();
  blocks.push({
    id: bid(guide.slug, "cred", n),
    type: "callout",
    title: `${name} research credibility`,
    tone: "info",
    body: [
      `Evidence level: ${evidence.replace(/_/g, " ")}.`,
      credibility.pricingChecked
        ? `Pricing verification: ${credibility.pricingChecked.slice(0, 10)}.`
        : null,
      credibility.lastResearched
        ? `Last substantive research update: ${credibility.lastResearched.slice(0, 10)}.`
        : guide.metadata.updatedAt
          ? `Guide updated: ${guide.metadata.updatedAt.slice(0, 10)}.`
          : null,
      author ? `Author: ${author.name}.` : null,
      `Methodology: ${credibility.methodologyHref ?? "/company/editorial-methodology/"}.`,
      "This explainer is orientation (what / who / when). The product page is the evaluation surface.",
    ]
      .filter(Boolean)
      .join(" "),
  });
  uniqueValueAdded.push("sg_original_data");

  // Navigation — mid-funnel entry into the decision journey
  const links: Array<{ href: string; label: string; description?: string }> = [
    {
      href: `/software/${productSlug}/`,
      label: `${name} full review`,
      description: "Evaluation intent — scores, evidence, buying verdict",
    },
    {
      href: `/software/${productSlug}/#pricing`,
      label: `${name} pricing`,
      description: "Plan structure and verification context",
    },
  ];
  try {
    const groups = getSoftwareLinkGroups(software);
    const altPage = groups.alternatives[0];
    if (altPage?.href) {
      links.push({
        href: altPage.href,
        label: `${name} alternatives`,
        description: "Peer options for the same buyer problem",
      });
    }
  } catch {
    /* link groups may require indexability — skip */
  }
  const comparisons = getComparisonsForProduct(productSlug)
    .filter((c) => c.seo.indexable !== false)
    .slice(0, 3);
  for (const c of comparisons) {
    links.push({
      href: `/compare/${c.slug}/`,
      label: c.title || c.slug,
      description: "Side-by-side orientation vs a peer",
    });
  }
  links.push({
    href: `/categories/${category}/`,
    label: `${labelize(category)} category guide`,
    description: "Category context and related education",
  });
  const finder = categoryDecisionFinderHref(category);
  const cost = categoryDecisionCostHref(category);
  if (finder) {
    links.push({
      href: finder,
      label: "Open Finder",
      description: "Constraint-based shortlist (fit, not sponsors)",
    });
  }
  if (cost) {
    links.push({
      href: cost,
      label: "Open cost calculator",
      description: "Model plan fit before vendor calls",
    });
  }

  blocks.push({
    id: bid(guide.slug, "nav", n),
    type: "related-content",
    title: `Next steps after learning what ${name} is`,
    links: links.slice(0, 8),
  });

  if (finder) {
    blocks.push({
      id: bid(guide.slug, "cta", n),
      type: "interactive-cta",
      title: `Shortlist ${category.replace(/-/g, " ")} tools`,
      body: `Finished orienting on ${name}? Answer your constraints once and get a fit-based shortlist.`,
      href: finder,
      ctaLabel: "Open Finder",
      variant: "finder",
    });
  }

  const seo = productExplainerSeo(name, category);
  const summary = `${name} orientation: what it is, who uses it, workflows, capabilities, pricing shape, limits, and alternatives — informational entry before the full SoftwareGlimpse evaluation.`;

  const checklist = [
    `Understand what ${name} is for: ${(ctx.bestFor ?? [])[0] || ctx.coreLoopLabels[0] || "your primary workflow"}`,
    `Confirm it is NOT for: ${(ctx.notIdealFor ?? [])[0] || "mismatched constraints"}`,
    pricingLines.length
      ? `Check free/trial and plan gates for ${name}`
      : `Request pricing clarity before a paid commit`,
    `Compare against ${(getSoftwareBySlug(altSlugs[0] ?? "")?.name || altSlugs[0] || "one peer")}`,
    `Read the full ${name} review when you are ready to evaluate`,
  ];

  const supports = [
    ...guide.supports,
    {
      contentId: `content:software:${productSlug}`,
      relationType: "supports-anchor" as const,
      primary: true,
    },
    {
      contentId: `content:category:${category}`,
      relationType: "supports-anchor" as const,
      primary: false,
    },
    ...comparisons.slice(0, 2).map((c) => ({
      contentId: `content:comparison:${c.slug}`,
      relationType: "supports-anchor" as const,
      primary: false,
    })),
  ];

  const overlay: GuideEnrichmentOverlay = {
    slug: guide.slug,
    enrichmentType: "PRODUCT_EXPLAINER",
    updatedAt: new Date().toISOString(),
    uniqueValueAdded: [...new Set(uniqueValueAdded)],
    patch: {
      summary,
      blocks,
      checklist: checklist.map((label, i) => ({
        id: `explainer-chk-${i}`,
        label,
        order: i,
      })),
      supports,
      nextAction: {
        contentId: `content:software:${productSlug}`,
        label: `Read the ${name} review`,
      },
      seo: {
        ...guide.seo,
        title: seo.title,
        description: seo.description,
        canonicalPath: guide.seo.canonicalPath || `/guides/${guide.slug}/`,
      },
    },
    notes,
  };

  return {
    overlay,
    uniqueValueAdded: overlay.uniqueValueAdded,
    blocks,
    notes,
    sufficientProductSignals,
  };
}
