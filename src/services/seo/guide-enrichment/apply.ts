import type { GuideContentBlock, GuidePage } from "@/domain/schemas";
import { getSoftwareBySlug } from "@/data/repositories/catalog";
import {
  categoryDecisionCostHref,
  categoryDecisionFinderHref,
} from "@/data/config/tools/category-tool-meta";
import { loadSafeProductContext } from "./enrich-context";
import {
  mergeGuideWithOverlay,
  type GuideEnrichmentOverlay,
} from "./overlay-merge";
import { saveGuideEnrichmentOverlay } from "./overlay-store";
import { planGuideEnrichment } from "./plan";
import { buildProductExplainerOverlay } from "./product-explainer";
import { runEnrichmentQa } from "./qa";
import type {
  EnrichmentApplyResult,
  EnrichmentGuideType,
  UniqueValueElement,
} from "./types";
import type { GscGuideSignal } from "./intent";

type ProductCtx = NonNullable<ReturnType<typeof loadSafeProductContext>>;

type BuildArgs = {
  guide: GuidePage;
  name: string;
  category: string;
  productSlug: string;
  ctx: ProductCtx;
  plan: ReturnType<typeof planGuideEnrichment>;
};

function bidFactory(slug: string) {
  let idSeq = 0;
  return (prefix: string) => `${prefix}-${slug}-${++idSeq}`;
}

function limitationsOf(ctx: ProductCtx): string[] {
  return [
    ...ctx.enrichmentLimitations,
    ...ctx.reviewLimitations,
    ...ctx.notIdealFor,
  ].filter(Boolean);
}

function altSlugsOf(ctx: ProductCtx, productSlug: string): string[] {
  return ctx.alternativeSlugs.filter((s) => s !== productSlug);
}

function planSuitLines(ctx: ProductCtx): Array<{ label: string; description: string }> {
  return ctx.plans.slice(0, 6).map((p) => ({
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
      p.unlocks.length
        ? `Unlocks: ${p.unlocks.slice(0, 3).join(", ")}`
        : null,
      p.isFree
        ? "Suits: explore before committing seats"
        : p.contactSales
          ? "Suits: teams that need custom procurement"
          : "Suits: teams whose must-have gates appear on this tier",
    ]
      .filter(Boolean)
      .join(" · ") ||
      "Researched plan — see product hub for verification dates",
  }));
}

/** COST_GUIDE — pricing/plans/value first; not a generic product pitch. */
function buildCostGuideBlocks(a: BuildArgs): {
  blocks: GuideContentBlock[];
  unique: UniqueValueElement[];
  summary: string;
  checklist: string[];
  sections?: GuidePage["sections"];
} {
  const { guide, name, category, productSlug, ctx, plan } = a;
  const bid = bidFactory(guide.slug);
  const unique: UniqueValueElement[] = [];
  const blocks: GuideContentBlock[] = [];
  const limitations = limitationsOf(ctx);
  const alts = altSlugsOf(ctx, productSlug);
  const freeNames = ctx.freePlanNames?.length
    ? ctx.freePlanNames.join(", ")
    : ctx.plans.filter((p) => p.isFree).map((p) => p.name).join(", ");
  const trialNote =
    ctx.trialDays != null && ctx.trialDays > 0
      ? `${ctx.trialDays}-day trial documented`
      : plan.dataSignals.hasFreeOrTrial
        ? "Trial/free path present in researched plans"
        : "No free/trial flag confirmed in SG data — budget a paid pilot";

  blocks.push({
    id: bid("da"),
    type: "direct-answer",
    body: `${name} pricing is plan-gated${
      ctx.plans.length ? ` across ${ctx.plans.length} researched tiers` : ""
    }. ${
      freeNames
        ? `Free entry: ${freeNames}. `
        : "No free plan confirmed in SoftwareGlimpse research. "
    }${trialNote}. Compare seat/capacity gates and unlocks — not list-price folklore.`,
    bullets: [
      ...(freeNames ? [`Free plan(s): ${freeNames}`] : ["Free plan: not confirmed in SG data"]),
      trialNote,
      ctx.plans[0] ? `Entry paid tier researched: ${ctx.plans.find((p) => !p.isFree)?.name || ctx.plans[0].name}` : "Confirm plan matrix on the product hub",
    ],
  });

  if (plan.dataSignals.hasPricing && ctx.plans.length > 0) {
    const costHref = categoryDecisionCostHref(category);
    blocks.push({
      id: bid("cost"),
      type: "cost-breakdown",
      title: `${name} plan matrix and who each tier suits`,
      body: "Structure and trial/free flags come from SoftwareGlimpse pricing research. Dollar amounts appear only when verified — never invent list prices.",
      lines: planSuitLines(ctx),
      calculatorHref: costHref ?? undefined,
      calculatorLabel: costHref ? "Model category cost fit" : undefined,
    });
    unique.push("pricing_comparison", "sg_original_data", "scenario_analysis");
  }

  blocks.push({
    id: bid("scen"),
    type: "step",
    heading: `${name} cost scenarios to pressure-test`,
    body: `Price ${name} against how you actually buy seats and unlocks — not against a competitor's homepage headline.`,
    stepNumber: 1,
    scenarios: [
      {
        title: "Lean team / free-or-trial first",
        body: freeNames
          ? `Stay on ${freeNames} until a gated capability (${ctx.gatedFeatureHints[0] || "premium unlock"}) becomes mandatory.`
          : `Scope a time-boxed pilot; ${trialNote}.`,
      },
      {
        title: "Growing team with gated workflows",
        body: `Map must-have workflows (${ctx.coreLoopLabels.slice(0, 3).join(", ") || "core loops"}) to plan unlocks before expanding seats.`,
      },
      {
        title: "Hidden / extra cost watch",
        body: limitations[0]
          ? `Budget risk: ${limitations[0]}. Also check add-ons, overages, and admin time outside the sticker plan.`
          : `Check add-ons, overages, implementation, and admin overhead beyond the base plan.`,
      },
    ],
  });
  unique.push("implementation_workflow");

  blocks.push({
    id: bid("value"),
    type: "decision-framework",
    title: `${name} value rule`,
    steps: [
      {
        id: "v-1",
        label: `Pay up when ${ctx.bestFor[0] || "documented strengths"} requires a paid unlock you will use weekly`,
      },
      {
        id: "v-2",
        label: limitations[0]
          ? `Do not overbuy if this limitation dominates: ${limitations[0]}`
          : `Do not overbuy seats before workflow proof`,
      },
      {
        id: "v-3",
        label: alts[0]
          ? `Side-by-side cost with ${getSoftwareBySlug(alts[0])?.name || alts[0]} on the same seat count`
          : `Benchmark at least one catalogue alternative on the same seat count`,
      },
    ],
  });
  unique.push("decision_framework");

  if (limitations.length) {
    blocks.push({
      id: bid("lim"),
      type: "mistakes",
      title: `${name} cost mistakes to avoid`,
      items: limitations.slice(0, 5).map((label, i) => ({
        title: `Cost trap ${i + 1}`,
        body: String(label),
      })),
    });
    unique.push("limitations_evidence");
  }

  if (alts.length) {
    blocks.push({
      id: bid("alts"),
      type: "product-shortlist",
      title: `Cheaper or clearer alternatives to pressure-test`,
      body: `Compare total cost of ownership vs ${name} on identical constraints.`,
      productSlugs: alts.slice(0, 5),
      disclaimer: "Catalogue peers only — not commission-ranked.",
    });
    unique.push("product_shortlist", "alternatives_map");
  }

  blocks.push({
    id: bid("sel"),
    type: "selection-checklist",
    title: `${name} pricing checklist`,
    dimensions: [
      {
        id: "gates",
        label: "Plan gates you must unlock",
        options: ctx.gatedFeatureHints.slice(0, 4).length
          ? ctx.gatedFeatureHints.slice(0, 4)
          : ["Must-have unlocks listed", "Seat math agreed", "Annual vs monthly clear"],
      },
      {
        id: "trial",
        label: "Trial / free proof",
        options: plan.dataSignals.hasFreeOrTrial
          ? ["Free plan usable for pilot", "Trial days enough", "Paid gate acceptable"]
          : ["Paid pilot scoped", "Procurement path clear", "No free/trial in SG data"],
      },
      {
        id: "tco",
        label: "TCO extras",
        options: ["Add-ons checked", "Admin time budgeted", "Migration cost noted"],
      },
    ],
  });
  unique.push("buyer_checklist");

  const finder = categoryDecisionFinderHref(category);
  const cost = categoryDecisionCostHref(category);
  if (finder || cost) {
    blocks.push({
      id: bid("cta"),
      type: "interactive-cta",
      title: cost ? `Model ${category} spend with ${name} in mind` : `Shortlist ${category} tools`,
      body: cost
        ? `Use researched plan structure for ${name} alongside category cost modelling.`
        : `Constraint-based shortlist — not a price-sorted affiliate sheet.`,
      href: (cost || finder)!,
      ctaLabel: cost ? "Open calculator" : "Open Finder",
      variant: cost ? "calculator" : "finder",
    });
  }

  const v = slugVariant(guide.slug);
  const altName = alts[0]
    ? getSoftwareBySlug(alts[0])?.name || alts[0]
    : null;
  const paidName =
    ctx.plans.find((p) => !p.isFree)?.name || ctx.plans[0]?.name || "paid tier";
  const best = ctx.bestFor[0] || ctx.coreLoopLabels[0] || "documented strengths";
  const poor =
    ctx.notIdealFor[0] || limitations[0] || "undocumented admin or capability risk";
  const gate = ctx.gatedFeatureHints[0] || "a premium unlock";

  const thesisByVariant = [
    `Buyer thesis: choose ${name} only if weekly work needs ${best} and the ${paidName} unlock for ${gate} will be used — skip if ${poor}.`,
    `Pricing thesis for ${name}: pay up when ${gate} is a weekly must-have for ${best}; walk when ${poor} dominates the operating model.`,
    `Evaluator rule: ${name} is best for teams built around ${best}. Poor fit when ${poor}. Pricing threshold: move off free/trial when ${gate} blocks a real workflow.`,
    `Decision thesis: unlike a generic ${category} shortlist, ${name} earns budget when ${best} outweighs ${poor} — trade-off accepted before seats scale.`,
  ][v]!;

  const sections: GuidePage["sections"] = [
    {
      id: `sec-cost-thesis-${guide.slug}`,
      heading: `${name} pricing thesis (buyer fit)`,
      body: [
        thesisByVariant,
        `Best for: ${ctx.bestFor.slice(0, 2).join("; ") || best}.`,
        `Poor fit when: ${ctx.notIdealFor.slice(0, 2).join("; ") || poor}.`,
        limitations[0]
          ? `Limitation that changes spend: ${limitations[0]} because it forces workarounds or add-ons outside the sticker plan.`
          : `Limitation: confirm add-ons and admin time before calling ${paidName} “cheap.”`,
      ].join("\n\n"),
    },
    {
      id: `sec-cost-price-${guide.slug}`,
      heading: `${name} pricing interpretation and plan trade-off`,
      body: [
        freeNames
          ? `Pricing interpretation: stay on ${freeNames} until ${gate} is mandatory; plan jumps to ${paidName} only after that hinge is proven.`
          : `Pricing interpretation: no free plan confirmed — scope a paid pilot on ${paidName} with exit criteria before annual seats.`,
        `Plan trade-off: you gain ${gate} at the expense of seat/admin complexity — measure both in the pilot.`,
        altName
          ? `Competitor context: unlike ${altName}, ${name} is preferable when ${best}; prefer ${altName} when ${poor} because the jobs diverge.`
          : `Competitor context: benchmark one catalogue alternative on identical seat count before locking ${paidName}.`,
      ].join("\n\n"),
    },
    {
      id: `sec-cost-scenario-${guide.slug}`,
      heading: `Decision scenario and conclusion for ${name}`,
      body: [
        `Scenario: for ${ctx.coreLoopLabels[0] || "primary workflow"} teams, recommend ${name} when ${best}; recommend an alternative path when ${poor}.`,
        `Implementation complexity: setup requires confirming ${gate} ownership before rollout — do not scale seats first.`,
        `Conclusion: buy ${name} when researched fit beats researched limits; otherwise keep researching — do not substitute product names into a generic cost essay.`,
      ].join("\n\n"),
    },
  ];

  return {
    blocks,
    unique,
    summary: [
      `${name} cost guide.`,
      thesisByVariant,
      limitations[0] ? `Watch: ${limitations[0]}.` : null,
    ]
      .filter(Boolean)
      .join(" "),
    checklist: [
      `List must-have unlocks before picking a ${name} tier`,
      trialNote,
      limitations[0]
        ? `Price in this risk: ${limitations[0]}`
        : `Document TCO extras (add-ons, admin, migration)`,
      alts[0]
        ? `Compare seat TCO with ${getSoftwareBySlug(alts[0])?.name || alts[0]}`
        : `Benchmark one alternative on the same seat count`,
    ],
    sections,
  };
}

function slugVariant(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h % 4;
}

/** DECISION_GUIDE — worth-it framing; not a plans dump. */
function buildDecisionGuideBlocks(a: BuildArgs): {
  blocks: GuideContentBlock[];
  unique: UniqueValueElement[];
  summary: string;
  checklist: string[];
  sections: GuidePage["sections"];
} {
  const { guide, name, category, productSlug, ctx, plan } = a;
  const bid = bidFactory(guide.slug);
  const unique: UniqueValueElement[] = [];
  const blocks: GuideContentBlock[] = [];
  const limitations = limitationsOf(ctx);
  const alts = altSlugsOf(ctx, productSlug);
  const v = slugVariant(guide.slug);
  const featLabels = ctx.features.slice(0, 4).map((f) => f.label);
  const paidPlans = ctx.plans.filter((p) => !p.isFree).map((p) => p.name);
  const desc = (ctx.shortDescription || "").replace(/\s+/g, " ").trim();
  const altName = alts[0]
    ? getSoftwareBySlug(alts[0])?.name || alts[0]
    : null;

  const thesisFrames = [
    {
      title: `${name}: buy when the operating loop matches`,
      yes: `Commit when your weekly work needs ${featLabels[0] || ctx.coreLoopLabels[0] || "documented capabilities"} and ${ctx.bestFor[0] || "researched fit"} holds`,
      no: `Walk when ${limitations[0] || ctx.notIdealFor[0] || "undocumented gaps"} would block go-live`,
    },
    {
      title: `Keep ${name} on the shortlist only if…`,
      yes: `Shortlist when ${ctx.whoShouldChoose || ctx.bestFor[0] || desc.slice(0, 120) || "fit signals"} beat the migration cost`,
      no: `Drop when ${limitations[0] || "admin or capability risk"} outweighs ${paidPlans[0] ? `${paidPlans[0]} value` : "paid-tier value"}`,
    },
    {
      title: `${name} ROI gate for evaluators`,
      yes: `Worth the seat spend if ${featLabels.slice(0, 2).join(" + ") || ctx.coreLoopLabels.slice(0, 2).join(" + ") || "core loops"} are weekly must-haves`,
      no: `Not worth it if ${limitations[0] || "researched limitations"} collide with your constraints`,
    },
    {
      title: `Verdict shape for ${name}`,
      yes: `Yes for teams where ${ctx.bestFor[0] || "strengths"} matter more than polish elsewhere`,
      no: `No when ${ctx.whoShouldConsiderAlternatives || limitations[0] || "alternatives fit better"}`,
    },
  ][v]!;

  const summary = [
    `Is ${name} worth it?`,
    desc ? `${desc}.` : null,
    ctx.bestFor[0] ? `Best for: ${ctx.bestFor[0]}.` : null,
    limitations[0]
      ? `Poor fit when: ${limitations[0]}. Limitation that changes the deal: ${limitations[0]} because it blocks go-live without workarounds.`
      : null,
    altName
      ? `Unlike ${altName}, prefer ${name} when ${ctx.bestFor[0] || "fit signals"} hold; prefer ${altName} when ${limitations[0] || "avoid signals"} dominate because the jobs diverge.`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  const sections: GuidePage["sections"] = [
    {
      id: `sec-thesis-${guide.slug}`,
      heading: thesisFrames.title,
      body: [
        `Buyer thesis: ${thesisFrames.yes}. Counter-signal: ${thesisFrames.no}.`,
        featLabels[0]
          ? `Capability hinge for this product: ${featLabels.join("; ")}.`
          : `Workflow hinge: ${ctx.coreLoopLabels.slice(0, 3).join(", ") || "confirm on the product hub"}.`,
        `Integrations in research: ${ctx.nativeIntegrationNames.slice(0, 4).join(", ") || "confirm on the product hub"}.`,
        paidPlans.length
          ? `Pricing threshold: plan jumps to ${paidPlans[0]} when you need ${featLabels[0] || "must-have unlocks"} weekly — not when brand familiarity peaks.`
          : `Confirm current packaging on the ${name} hub before a multi-seat commit.`,
      ].join("\n\n"),
    },
    {
      id: `sec-fit-${guide.slug}`,
      heading: `Who ${name} is worth it for — and who should avoid it`,
      body: [
        `Best for: ${ctx.whoShouldChoose || ctx.bestFor.slice(0, 2).join("; ") || "teams whose workflows match researched strengths"}.`,
        `Poor fit when: ${ctx.whoShouldConsiderAlternatives || limitations.slice(0, 2).join("; ") || "you need strengths this product does not document"}.`,
        limitations[0]
          ? `Limitation: ${limitations[0]} because it forces process changes or tooling around ${name}.`
          : `Write deal-breakers before demos so a polished UI cannot override fit.`,
        altName
          ? `Competitor context: unlike ${altName}, ${name} wins when ${ctx.bestFor[0] || "strengths"} matter; choose ${altName} instead when ${limitations[0] || "avoid signals"} dominate because the operating loops differ.`
          : `Competitor context: score ${name} against one catalogue peer on identical constraints.`,
      ].join("\n\n"),
    },
    {
      id: `sec-value-${guide.slug}`,
      heading: `${name} price/value and next evaluation step`,
      body: [
        plan.dataSignals.hasFreeOrTrial
          ? `Prove one real workflow on the documented free/trial path before arguing for ${paidPlans[0] || "a paid tier"}.`
          : `No free/trial flag in SG data — scope a paid proof with exit criteria before annual seats.`,
        ctx.tradeoffs[0]
          ? `Trade-off: you gain ${featLabels[0] || "capability breadth"} at the expense of ${ctx.tradeoffs[0]}.`
          : `Trade-off: you gain configuration depth at the expense of admin overhead — measure both in the pilot.`,
        `Scenario: for ${ctx.coreLoopLabels[0] || "primary workflow"} teams, recommend ${name} when ${ctx.bestFor[0] || "fit holds"}; recommend an alternative when ${limitations[0] || "avoid signals"} dominate.`,
        `Conclusion: buy ${name} only when researched fit beats researched limits — reject product-name substitution as uniqueness.`,
      ].join("\n\n"),
    },
  ];

  blocks.push({
    id: bid("da"),
    type: "direct-answer",
    body: `${name} earns a yes only when researched fit beats researched limits — not when the brand is familiar.`,
    bullets: [
      thesisFrames.yes,
      thesisFrames.no,
      featLabels[0]
        ? `Capability hinge: ${featLabels[0]}`
        : `Loop hinge: ${ctx.coreLoopLabels[0] || "primary workflow"}`,
    ],
  });

  blocks.push({
    id: bid("df"),
    type: "decision-framework",
    title: thesisFrames.title,
    steps: [
      { id: "d-1", label: thesisFrames.yes },
      { id: "d-2", label: thesisFrames.no },
      {
        id: "d-3",
        label: ctx.tradeoffs[0]
          ? `Only proceed if you accept: ${ctx.tradeoffs[0]}`
          : `Only proceed if admin capacity covers ${name} configuration`,
      },
      {
        id: "d-4",
        label: altName
          ? `Deadlock breaker: same checklist on ${name} vs ${altName}`
          : `Deadlock breaker: score ${name} against one catalogue peer on identical constraints`,
      },
    ],
  });
  unique.push("decision_framework", "scenario_analysis");

  blocks.push({
    id: bid("str"),
    type: "step",
    heading:
      v === 0
        ? `${name} evidence ledger (strengths, limits, value)`
        : v === 1
          ? `What tips ${name} into a yes vs a no`
          : v === 2
            ? `${name} evaluator notebook`
            : `Field notes before buying ${name}`,
    body: `Use researched signals for ${name} — not interchangeable “great CRM” prose.`,
    stepNumber: 1,
    scenarios: [
      {
        title: v % 2 === 0 ? "Strengths that actually show up in research" : "Where buyers get leverage",
        body: ctx.bestFor.slice(0, 3).join("; ") ||
          featLabels.join("; ") ||
          ctx.coreLoopLabels.slice(0, 3).join(", ") ||
          desc ||
          "See product hub",
      },
      {
        title: v % 2 === 0 ? "Limitations that change the deal" : "Hard stops",
        body: limitations.slice(0, 3).join("; ") ||
          ctx.notIdealFor.slice(0, 3).join("; ") ||
          "Verify limitations in a scoped pilot",
      },
      {
        title: "Price / value hinge",
        body: paidPlans.length
          ? `Value usually hinges on needing ${paidPlans.slice(0, 2).join(" or ")} unlocks for ${featLabels[0] || "must-have work"} — not on brand familiarity.`
          : `Confirm plan gates on the ${name} hub before calling the spend “worth it.”`,
      },
    ],
  });
  unique.push("limitations_evidence");

  if (ctx.features.length > 0) {
    blocks.push({
      id: bid("fm"),
      type: "feature-matrix",
      title: `${name} capabilities that decide the purchase`,
      rows: ctx.features.slice(0, 8).map((f) => ({
        feature: f.label,
        mustHave: !f.gated,
        niceToHave: f.gated,
        notes: f.gated
          ? `Gated — ${f.planNames.slice(0, 2).join(", ") || "higher plans"}`
          : f.availability || "On researched plans",
      })),
    });
    unique.push("category_criteria", "tradeoff_table");
  }

  if (alts.length) {
    blocks.push({
      id: bid("alts"),
      type: "product-shortlist",
      title:
        v === 0
          ? `If ${name} fails the checklist, try these peers`
          : `Alternatives when ${name} is the wrong shape`,
      body: `Same job-to-be-done — different researched tradeoffs.`,
      productSlugs: alts.slice(0, 5),
      disclaimer: "Catalogue relationships only.",
    });
    unique.push("product_shortlist", "alternatives_map");
  }

  blocks.push({
    id: bid("sel"),
    type: "selection-checklist",
    title: `${name} worth-it checklist`,
    dimensions: [
      {
        id: "fit",
        label: "Fit signals",
        options: ctx.bestFor.slice(0, 3).length
          ? ctx.bestFor.slice(0, 3)
          : featLabels.slice(0, 3).length
            ? featLabels.slice(0, 3)
            : ["Workflow match", "Team size match", "Admin capacity"],
      },
      {
        id: "avoid",
        label: "Avoid signals",
        options: limitations.slice(0, 3).length
          ? limitations.slice(0, 3).map(String)
          : ["Missing must-have", "Wrong category depth", "Support mismatch"],
      },
      {
        id: "proof",
        label: "Proof before commit",
        options: plan.dataSignals.hasFreeOrTrial
          ? [
              "Trial/free used",
              `Ran ${featLabels[0] || ctx.coreLoopLabels[0] || "primary workflow"}`,
              "Plan gate accepted",
            ]
          : [
              "Paid pilot scoped",
              `Ran ${featLabels[0] || ctx.coreLoopLabels[0] || "primary workflow"}`,
              "Exit criteria written",
            ],
      },
    ],
  });
  unique.push("buyer_checklist");

  const finder = categoryDecisionFinderHref(category);
  if (finder) {
    blocks.push({
      id: bid("cta"),
      type: "interactive-cta",
      title: `Constraint-check ${name} against other ${category} options`,
      body: `Keep ${name} only if it survives the same answers as peers.`,
      href: finder,
      ctaLabel: "Open Finder",
      variant: "finder",
    });
  }

  return {
    blocks,
    unique,
    summary,
    sections,
    checklist: [
      `Job ${name} must win in 30 days: ${ctx.coreLoopLabels[0] || featLabels[0] || "primary workflow"}`,
      ctx.bestFor[0] ? `Confirm leverage: ${ctx.bestFor[0]}` : `Confirm core-loop match`,
      limitations[0] ? `Fatal? ${limitations[0]}` : `List deal-breakers before demos`,
      altName
        ? `Compare vs ${altName} on the same job`
        : `Name one alternative for the same job`,
    ],
  };
}

/** IMPLEMENTATION_GUIDE — rollout sequence first. */
function buildImplementationGuideBlocks(a: BuildArgs): {
  blocks: GuideContentBlock[];
  unique: UniqueValueElement[];
  summary: string;
  checklist: string[];
  sections?: GuidePage["sections"];
} {
  const { guide, name, category, productSlug, ctx, plan } = a;
  const bid = bidFactory(guide.slug);
  const unique: UniqueValueElement[] = [];
  const blocks: GuideContentBlock[] = [];
  const limitations = limitationsOf(ctx);
  const alts = altSlugsOf(ctx, productSlug);

  blocks.push({
    id: bid("da"),
    type: "direct-answer",
    body: `Implement ${name} by mapping current ${category} workflows to ${name} objects, confirming plan gates for ${(ctx.gatedFeatureHints.slice(0, 3).join(", ") || "premium capabilities")}, piloting one team, then cutting over integrations (${ctx.nativeIntegrationNames.slice(0, 3).join(", ") || "priority systems"}) after data checks.`,
    bullets: [
      `Start with: ${ctx.coreLoopLabels[0] || "one primary workflow"}`,
      `Gate check: ${ctx.gatedFeatureHints[0] || "confirm paid unlocks before go-live"}`,
      `Integrate after: data quality pass on ${ctx.nativeIntegrationNames[0] || "systems of record"}`,
    ],
  });

  blocks.push({
    id: bid("impl"),
    type: "step",
    heading: `${name} day-zero to steady-state sequence`,
    body: `Treat ${name} setup as a controlled rollout — not a weekend dump of CSV files.`,
    stepNumber: 1,
    scenarios: [
      {
        title: "Day zero — objects and owners",
        body: `Define owners for ${ctx.coreLoopLabels.slice(0, 3).join(", ") || "core records"} before inviting the whole org.`,
      },
      {
        title: "SMB pilot",
        body: `One pipeline / one team proves ${ctx.bestFor[0] || "fit"} before company-wide seats.`,
      },
      {
        title: "Cutover",
        body: `Freeze legacy writes briefly; validate ${ctx.nativeIntegrationNames.slice(0, 2).join(" and ") || "priority integrations"} before reopen.`,
      },
    ],
  });
  unique.push("implementation_workflow", "scenario_analysis");

  blocks.push({
    id: bid("df"),
    type: "decision-framework",
    title: `${name} implementation go / no-go`,
    steps: [
      {
        id: "i-1",
        label: `Go when plan unlocks cover ${ctx.gatedFeatureHints[0] || "must-have capabilities"}`,
      },
      {
        id: "i-2",
        label: limitations[0]
          ? `Pause if this limitation blocks ops: ${limitations[0]}`
          : `Pause if admin capacity is unclear`,
      },
      {
        id: "i-3",
        label: `Do not expand seats until ${ctx.coreLoopLabels[0] || "the pilot workflow"} is green`,
      },
    ],
  });
  unique.push("decision_framework");

  if (limitations.length) {
    blocks.push({
      id: bid("mist"),
      type: "mistakes",
      title: `${name} implementation mistakes`,
      items: [
        ...limitations.slice(0, 4).map((label, i) => ({
          title: `Mistake ${i + 1}`,
          body: String(label),
        })),
        {
          title: "Big-bang invite",
          body: "Inviting every user before object design creates junk data that is expensive to unwind.",
        },
      ],
    });
    unique.push("limitations_evidence");
  }

  if (plan.dataSignals.hasPricing && ctx.plans.length > 0) {
    blocks.push({
      id: bid("cost"),
      type: "cost-breakdown",
      title: `${name} plan gates that affect rollout`,
      body: "Implementation fails when unlocks needed for go-live sit on a higher tier than budgeted.",
      lines: planSuitLines(ctx).slice(0, 5),
    });
    unique.push("pricing_comparison", "sg_original_data");
  }

  blocks.push({
    id: bid("sel"),
    type: "selection-checklist",
    title: `${name} implementation checklist`,
    dimensions: [
      {
        id: "prep",
        label: "Prep",
        options: ["Object model drafted", "Owners named", "Legacy freeze window set"],
      },
      {
        id: "pilot",
        label: "Pilot",
        options: [
          ctx.coreLoopLabels[0] || "Primary workflow live",
          "Junk-data rules set",
          "Support path clear",
        ],
      },
      {
        id: "scale",
        label: "Scale",
        options: [
          ctx.nativeIntegrationNames[0] || "Integrations validated",
          "Seat expansion criteria written",
          "Rollback plan noted",
        ],
      },
    ],
  });
  unique.push("buyer_checklist");

  const finder = categoryDecisionFinderHref(category);
  if (finder) {
    blocks.push({
      id: bid("cta"),
      type: "interactive-cta",
      title: `Validate ${category} fit before a deep ${name} rollout`,
      body: `If ${name} fails constraint fit, stop implementation early.`,
      href: finder,
      ctaLabel: "Open Finder",
      variant: "finder",
    });
  }

  return {
    blocks,
    unique,
    summary: `${name} implementation guide: day-zero sequence, pilot rules, plan gates, and cutover checks from SoftwareGlimpse research — not generic CRM setup filler.`,
    checklist: [
      `Draft ${name} object owners before invites`,
      `Confirm plan unlocks for go-live features`,
      `Pilot one team on ${ctx.coreLoopLabels[0] || "primary workflow"}`,
      alts[0]
        ? `If blocked, evaluate ${getSoftwareBySlug(alts[0])?.name || alts[0]} before sunk-cost expansion`
        : `Write rollback criteria before cutover`,
    ],
  };
}

/** MIGRATION_GUIDE — cutover/risk framing. */
function buildMigrationGuideBlocks(a: BuildArgs): {
  blocks: GuideContentBlock[];
  unique: UniqueValueElement[];
  summary: string;
  checklist: string[];
  sections?: GuidePage["sections"];
} {
  const { guide, name, category, productSlug, ctx } = a;
  const bid = bidFactory(guide.slug);
  const unique: UniqueValueElement[] = [];
  const blocks: GuideContentBlock[] = [];
  const limitations = limitationsOf(ctx);
  const alts = altSlugsOf(ctx, productSlug);

  blocks.push({
    id: bid("da"),
    type: "direct-answer",
    body: `Migrate to ${name} by inventorying legacy ${category} fields, mapping them to ${name} objects, rehearsing a freeze window, and validating ${ctx.nativeIntegrationNames.slice(0, 3).join(", ") || "critical integrations"} before reopening writes.`,
    bullets: [
      "Inventory → map → rehearse → cut over → reopen",
      `Highest risk: ${limitations[0] || "unmapped custom fields and silent integration drift"}`,
      `Success signal: ${ctx.coreLoopLabels[0] || "primary workflow"} works for the pilot cohort`,
    ],
  });

  blocks.push({
    id: bid("mig"),
    type: "step",
    heading: `${name} migration cutover playbook`,
    body: `Migrations fail from optimistic timelines — not from missing motivation.`,
    stepNumber: 1,
    scenarios: [
      {
        title: "Field inventory",
        body: `Export legacy fields that power ${ctx.coreLoopLabels.slice(0, 3).join(", ") || "revenue workflows"} and mark must-map vs archive.`,
      },
      {
        title: "Rehearsal load",
        body: `Run a non-prod load into ${name}; measure match rates before the freeze.`,
      },
      {
        title: "Production freeze",
        body: `Freeze legacy writes; cut over; validate ${ctx.nativeIntegrationNames[0] || "primary integrations"}; then reopen.`,
      },
    ],
  });
  unique.push("implementation_workflow", "scenario_analysis");

  blocks.push({
    id: bid("df"),
    type: "decision-framework",
    title: `Migrate to ${name}?`,
    steps: [
      {
        id: "m-1",
        label: `Migrate when ${ctx.bestFor[0] || "destination strengths"} outweigh migration cost`,
      },
      {
        id: "m-2",
        label: limitations[0]
          ? `Delay if this limitation hits cutover: ${limitations[0]}`
          : `Delay if field-map coverage is below your risk threshold`,
      },
      {
        id: "m-3",
        label: alts[0]
          ? `If ${name} mapping is poor, compare destination fit with ${getSoftwareBySlug(alts[0])?.name || alts[0]} before moving data twice`
          : `Do not move data twice — resolve destination fit first`,
      },
    ],
  });
  unique.push("decision_framework");

  blocks.push({
    id: bid("mist"),
    type: "mistakes",
    title: `${name} migration mistakes`,
    items: [
      {
        title: "No freeze window",
        body: "Dual-writing without a freeze creates irrevocable duplicates.",
      },
      {
        title: "Integrations last",
        body: `Wire ${ctx.nativeIntegrationNames[0] || "systems of record"} in rehearsal — not on Monday morning after cutover.`,
      },
      ...(limitations.slice(0, 3).map((label, i) => ({
        title: `Data risk ${i + 1}`,
        body: String(label),
      }))),
    ],
  });
  unique.push("limitations_evidence");

  blocks.push({
    id: bid("sel"),
    type: "selection-checklist",
    title: `${name} migration checklist`,
    dimensions: [
      {
        id: "map",
        label: "Mapping",
        options: ["Must-map fields listed", "Owners assigned", "Archive rules written"],
      },
      {
        id: "rehearse",
        label: "Rehearsal",
        options: ["Non-prod load done", "Match rate measured", "Rollback tested"],
      },
      {
        id: "cutover",
        label: "Cutover",
        options: ["Freeze communicated", "Integrations green", "Pilot cohort signed off"],
      },
    ],
  });
  unique.push("buyer_checklist");

  return {
    blocks,
    unique,
    summary: `${name} migration guide: inventory → rehearse → freeze → validate integrations — grounded in researched limitations and catalogue peers.`,
    checklist: [
      `Complete field inventory for ${ctx.coreLoopLabels[0] || "core workflows"}`,
      `Rehearse load before production freeze`,
      `Validate ${ctx.nativeIntegrationNames[0] || "primary integrations"} pre-reopen`,
      limitations[0]
        ? `Mitigate: ${limitations[0]}`
        : `Document rollback owner and window`,
    ],
  };
}

function buildTypedBlocks(type: EnrichmentGuideType, a: BuildArgs) {
  switch (type) {
    case "COST_GUIDE":
      return buildCostGuideBlocks(a);
    case "DECISION_GUIDE":
      return buildDecisionGuideBlocks(a);
    case "IMPLEMENTATION_GUIDE":
      return buildImplementationGuideBlocks(a);
    case "MIGRATION_GUIDE":
      return buildMigrationGuideBlocks(a);
    default:
      // Fallback keeps prior shared path behavior for any newly classified types.
      return buildDecisionGuideBlocks(a);
  }
}

/**
 * Deterministically enrich an existing guide URL from real SG product data.
 * Never invents pricing amounts or unsupported claims.
 * Block skeletons differ by enrichment type (cost ≠ decision ≠ implementation).
 */
export function applyGuideEnrichment(
  guide: GuidePage,
  opts: { gsc?: GscGuideSignal | null; peerGuides?: GuidePage[] } = {},
): EnrichmentApplyResult {
  const plan = planGuideEnrichment(guide, opts.gsc);
  const notes = [...plan.notes];

  if (!plan.canApplyDeterministically) {
    return {
      slug: guide.slug,
      applied: false,
      overlayPath: null,
      uniqueValueAdded: [],
      blocksAdded: 0,
      notes: [
        ...notes,
        "No deterministic apply path for this guide type — plan only",
      ],
      qa: runEnrichmentQa(guide, opts.peerGuides),
    };
  }

  if (plan.enrichmentType === "PRODUCT_EXPLAINER") {
    const built = buildProductExplainerOverlay(guide);
    if (!built) {
      return {
        slug: guide.slug,
        applied: false,
        overlayPath: null,
        uniqueValueAdded: [],
        blocksAdded: 0,
        notes: [...notes, "Product explainer context unavailable"],
        qa: runEnrichmentQa(guide, opts.peerGuides),
      };
    }
    if (!built.sufficientProductSignals) {
      return {
        slug: guide.slug,
        applied: false,
        overlayPath: null,
        uniqueValueAdded: [],
        blocksAdded: built.blocks.length,
        notes: [...notes, ...built.notes],
        qa: runEnrichmentQa(guide, opts.peerGuides),
      };
    }
    const merged = mergeGuideWithOverlay(guide, built.overlay);
    const qa = runEnrichmentQa(merged, opts.peerGuides);
    if (!qa.ok) {
      return {
        slug: guide.slug,
        applied: false,
        overlayPath: null,
        uniqueValueAdded: built.uniqueValueAdded,
        blocksAdded: built.blocks.length,
        notes: [
          ...notes,
          ...built.notes,
          "QA blocked persist — fix duplication/filler before saving overlay",
          ...qa.findings.map((f) => `${f.code}: ${f.detail}`),
        ],
        qa,
      };
    }
    const overlayPath = saveGuideEnrichmentOverlay(built.overlay);
    return {
      slug: guide.slug,
      applied: true,
      overlayPath,
      uniqueValueAdded: built.uniqueValueAdded,
      blocksAdded: built.blocks.length,
      notes: [...notes, ...built.notes],
      qa,
    };
  }

  const productSlug = guide.productSlugs[0];
  if (!productSlug) {
    return {
      slug: guide.slug,
      applied: false,
      overlayPath: null,
      uniqueValueAdded: [],
      blocksAdded: 0,
      notes: [...notes, "Missing productSlug — cannot enrich from catalogue"],
      qa: runEnrichmentQa(guide, opts.peerGuides),
    };
  }

  const ctx = loadSafeProductContext(productSlug);
  const software = getSoftwareBySlug(productSlug);
  if (!ctx || !software) {
    return {
      slug: guide.slug,
      applied: false,
      overlayPath: null,
      uniqueValueAdded: [],
      blocksAdded: 0,
      notes: [...notes, "Product context unavailable — omit rather than invent"],
      qa: runEnrichmentQa(guide, opts.peerGuides),
    };
  }

  const name = software.name || productSlug;
  const category = guide.categorySlugs[0] || ctx.categorySlug;
  const typed = buildTypedBlocks(plan.enrichmentType, {
    guide,
    name,
    category,
    productSlug,
    ctx,
    plan,
  });

  const finder = categoryDecisionFinderHref(category);
  const overlay: GuideEnrichmentOverlay = {
    slug: guide.slug,
    enrichmentType: plan.enrichmentType,
    updatedAt: new Date().toISOString(),
    uniqueValueAdded: [...new Set(typed.unique)],
    patch: {
      summary: typed.summary,
      blocks: typed.blocks,
      ...(typed.sections ? { sections: typed.sections } : {}),
      checklist: typed.checklist.map((label, i) => ({
        id: `enrich-chk-${i}`,
        label,
        order: i,
      })),
      nextAction: finder
        ? {
            contentId: `tool:finder:${category}`,
            label: "Open Finder shortlist",
          }
        : guide.nextAction,
    },
    notes: [
      ...notes,
      `Type-specific skeleton: ${plan.enrichmentType}`,
    ],
  };

  const merged = mergeGuideWithOverlay(guide, overlay);
  const qa = runEnrichmentQa(merged, opts.peerGuides);
  if (!qa.ok) {
    return {
      slug: guide.slug,
      applied: false,
      overlayPath: null,
      uniqueValueAdded: overlay.uniqueValueAdded,
      blocksAdded: typed.blocks.length,
      notes: [
        ...overlay.notes,
        "QA blocked persist — fix duplication/filler before saving overlay",
        ...qa.findings.map((f) => `${f.code}: ${f.detail}`),
      ],
      qa,
    };
  }

  const overlayPath = saveGuideEnrichmentOverlay(overlay);
  return {
    slug: guide.slug,
    applied: true,
    overlayPath,
    uniqueValueAdded: overlay.uniqueValueAdded,
    blocksAdded: typed.blocks.length,
    notes: overlay.notes,
    qa,
  };
}
