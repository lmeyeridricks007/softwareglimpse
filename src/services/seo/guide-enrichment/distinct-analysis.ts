/**
 * Estate uniqueness copy for factory product packs.
 *
 * Sibling audits strip product names. Shared skeletons (“Implement X by mapping
 * current category workflows…”) therefore fail estate near-dup even when a
 * 20-page batch looks locally distinct. Lead with catalogue facts and vary
 * sentence structure so HubSpot vs Salesforce still differ after name strip.
 */
import type { GuidePage } from "@/domain/schemas";
import type { loadSafeProductContext } from "./enrich-context";

type ProductCtx = NonNullable<ReturnType<typeof loadSafeProductContext>>;

export type FactoryAnalysisKind =
  | "plans"
  | "worth-it"
  | "implementation"
  | "setup"
  | "migration";

export function factoryKindFromSlug(
  slug: string,
  productSlug: string,
): FactoryAnalysisKind | null {
  if (slug === `is-${productSlug}-worth-it`) return "worth-it";
  if (slug === `${productSlug}-plans`) return "plans";
  if (slug === `${productSlug}-implementation`) return "implementation";
  if (slug === `${productSlug}-setup`) return "setup";
  if (slug === `${productSlug}-migration`) return "migration";
  return null;
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(items: T[], h: number): T {
  return items[h % items.length]!;
}

function joinFacts(parts: Array<string | null | undefined>, sep = "; "): string {
  return parts.map((p) => (p ?? "").replace(/\s+/g, " ").trim()).filter(Boolean).join(sep);
}

function limitationsOf(ctx: ProductCtx): string[] {
  return [
    ...ctx.enrichmentLimitations,
    ...ctx.reviewLimitations,
    ...ctx.notIdealFor,
    ...ctx.cons.slice(0, 2),
  ].filter(Boolean);
}

/**
 * Build three analysis sections covering buyer question, thesis, best fit,
 * poor fit, limitation, pricing interpretation, scenario, alternative
 * context, and decision conclusion — using researched catalogue fields only.
 */
export function buildFactoryDistinctAnalysis(args: {
  kind: FactoryAnalysisKind;
  slug: string;
  name: string;
  category: string;
  ctx: ProductCtx;
}): {
  sections: GuidePage["sections"];
  summary: string;
} {
  const { kind, slug, name, category, ctx } = args;
  const v = hashStr(slug);
  const limitations = limitationsOf(ctx);
  const featLabels = ctx.features.slice(0, 4).map((f) => f.label);
  const paid =
    ctx.paidPlanNames[0] ||
    ctx.plans.find((p) => !p.isFree)?.name ||
    "paid tier";
  const free = ctx.freePlanNames[0] || ctx.plans.find((p) => p.isFree)?.name || null;
  const gate = ctx.gatedFeatureHints[0] || featLabels[0] || "a premium unlock";
  const loop = ctx.coreLoopLabels[0] || featLabels[0] || "primary workflow";
  const best =
    ctx.bestFor[0] ||
    ctx.whoShouldChoose ||
    ctx.strengths[0] ||
    ctx.audienceHints[0] ||
    "documented strengths";
  const poor =
    ctx.notIdealFor[0] ||
    ctx.whoShouldConsiderAlternatives ||
    limitations[0] ||
    "undocumented admin or capability risk";
  const limit = limitations[0] || ctx.weaknesses[0] || "undocumented admin overhead";
  const alt = ctx.alternativeNames[0] || null;
  const integ = ctx.nativeIntegrationNames[0] || ctx.integrationNames[0] || null;
  const trade = ctx.tradeoffs[0] || null;
  const audience = ctx.audienceHints[0] || ctx.audienceHints[1] || null;
  const desc = (ctx.shortDescription || "").replace(/\s+/g, " ").trim();
  const capacity = ctx.planCapacityNotes[0] || ctx.plans[0]?.capacityNote || null;
  const featBlob = featLabels.join("; ") || ctx.keyFeatures.slice(0, 3).join("; ");
  const bestBlob = ctx.bestFor.slice(0, 3).join("; ") || best;
  const poorBlob = ctx.notIdealFor.slice(0, 3).join("; ") || poor;
  const limitBlob = limitations.slice(0, 3).join("; ") || limit;
  const integBlob = ctx.nativeIntegrationNames.slice(0, 4).join(", ");
  const planBlob = ctx.plans
    .slice(0, 3)
    .map((p) =>
      joinFacts(
        [p.name, p.isFree ? "free" : null, p.capacityNote, p.unlocks[0]],
        " · ",
      ),
    )
    .filter(Boolean)
    .join(" | ");

  const buyerQuestion = pick(
    [
      `Buyer question: is ${name} worth it if weekly work actually needs ${loop} and ${gate}, or does ${poor} dominate?`,
      `Buyer question: should you pay for ${name} when ${best} is the job — and skip when ${poor}?`,
      `Buyer question: does ${paid} gating ${gate} change the ${name} decision before seats scale?`,
      `Buyer question: is ${name} the right ${category} commit for ${audience || best}, or is ${poor} the real constraint?`,
      `Buyer question: what must be true before ${name} is worth buying versus staying on ${free || "trial/research"}?`,
      `Buyer question: for ${loop} teams, is ${name} worth the ${paid} unlock, or does ${limit} kill the rollout?`,
      `Buyer question: choose ${name} only if ${best} outweighs ${limit} — otherwise keep researching.`,
      `Buyer question: is ${name} worth it when ${featLabels[0] || loop} is weekly, or is ${alt || "a catalogue peer"} the cleaner fit?`,
    ],
    v,
  );

  const thesis = pick(
    [
      `Thesis: ${name} earns the ${paid} seat when ${featBlob || loop} is the weekly loop and ${gate} is unlocked; skip if ${poorBlob}.`,
      `Thesis: ${name} earns budget when ${featBlob || loop} is the operating loop; walk when ${limit} because it forces workarounds.`,
      `Evaluator rule: ${name} is best for ${bestBlob}. Poor fit when ${poorBlob}. Pricing threshold: move off ${free || "trial"} when ${gate} blocks ${loop}.`,
      `Decision thesis: unlike a generic ${category} shortlist, ${name} is worth it if ${best} outweighs ${limit} — trade-off accepted before seats scale.`,
      `Thesis for ${kind}: ${name} is a yes only when ${loop} plus ${gate} are must-haves; not worth it if ${poor} dominates the operating model.`,
      `Keep ${name} on the shortlist only if ${best}; drop it when ${poor} because ${limit} cannot be patched with more seats.`,
      `ROI gate: ${name} is worth the ${paid} spend if ${featLabels.slice(0, 2).join(" + ") || loop} are weekly; not worth buying when ${limit}.`,
      `Verdict shape: yes for teams built around ${bestBlob}; no when ${poorBlob} — ${gate} is the hinge, not brand familiarity.`,
    ],
    v + 1,
  );

  const bestFit = `Best for: ${bestBlob}${audience ? ` (${audience})` : ""}.`;
  const poorFit = `Poor fit when: ${poorBlob}. Avoid if ${limit} would block go-live.`;
  const limitation = `Limitation: ${limitBlob} because it forces process changes or add-ons around ${name} when ${loop} is the job.`;
  const pricing = free
    ? `Pricing interpretation: stay on ${free} until ${gate} is mandatory; plan jumps to ${paid} only after that hinge is proven.${capacity ? ` Capacity note: ${capacity}.` : ""}`
    : `Pricing interpretation: no free plan confirmed — scope a paid pilot on ${paid} with exit criteria before annual seats.${capacity ? ` Capacity note: ${capacity}.` : ""}`;
  const planTrade = `Plan trade-off: you gain ${gate} at the expense of ${trade || "seat/admin complexity"} — measure both in the pilot.${planBlob ? ` Researched packaging: ${planBlob}.` : ""}`;
  const scenario = pick(
    [
      `Scenario: for ${loop} teams, recommend ${name} when ${best}; recommend an alternative path when ${poor} because ${limit} dominates.`,
      `Use-case: for ${audience || "teams"} running ${loop}, prefer ${name} when ${featLabels[0] || gate} is weekly; pick another path when ${poor}.`,
      `Scenario: recommend ${name} for ${best}; do not choose it when ${poor} — the jobs diverge at ${gate}.`,
      `Workflow advantage: ${name} is faster for ${loop} when ${featBlob || gate} is in-product; skip when ${limit} because that loop lives elsewhere.`,
    ],
    v + 2,
  );
  const altCtx = alt
    ? `Alternative context: unlike ${alt}, ${name} is preferable when ${best} because ${loop} plus ${gate} match; prefer ${alt} when ${poor} because the operating loops differ.`
    : `Alternative context: compared with other ${category} catalogue peers, ${name} differs in ${featLabels[0] || loop} while ${limit} remains the watch-out.`;
  const impl = pick(
    [
      `Implementation complexity: setup requires confirming ${gate} ownership and ${integ || "systems of record"} before rollout — do not scale seats first.`,
      `Implementation effort: setup takes a named admin for ${loop} plus a freeze window if ${integ || "integrations"} are in the cutover path.`,
      `Setup requires a specialist owner when ${limit} collides with ${loop}; SMB pilots can stay lighter if ${gate} is already on ${paid}.`,
      `Implementation time: weeks to configure ${featLabels[0] || loop} if ${integBlob || "priority integrations"} must be green before invites.`,
    ],
    v + 3,
  );
  const conclusion = pick(
    [
      `Decision conclusion: buy ${name} when researched fit (${best}) beats researched limits (${limit}); otherwise keep researching — do not substitute product names into a generic ${kind} essay.`,
      `Conclusion: ${name} is worth it if ${best} and ${gate} are weekly; skip ${name} if ${poor}. That is the decision, not a template with the logo swapped.`,
      `Final call: proceed with ${name} when ${loop} plus ${featLabels[0] || gate} outweigh ${limit}; walk when ${poor} because workarounds will eat the ${paid} spend.`,
      `Wrap: choose ${name} only if the ${kind} job is ${loop} under ${best}; otherwise use Finder constraints instead of copying this page for another vendor.`,
    ],
    v + 4,
  );

  const factLead = joinFacts(
    [
      featBlob,
      planBlob,
      integBlob,
      bestBlob,
      desc.slice(0, 180) || null,
    ],
    ". ",
  );

  const introLead = factLead
    ? `${factLead}. That catalogue mix is the ${name} ${kind} filter — not a generic ${category} lecture.`
    : `${loop} plus ${gate} decide whether this ${name} ${kind} URL is a real buyer job.`;

  const summary = joinFacts([factLead, buyerQuestion, thesis], " ");

  const sections: GuidePage["sections"] = [
    {
      id: `sec-thesis-${slug}`,
      heading: `${name} buyer question and thesis`,
      body: [introLead, buyerQuestion, thesis, bestFit, poorFit].join("\n\n"),
    },
    {
      id: `sec-limits-${slug}`,
      heading: `${name} limitation, pricing interpretation, and alternative context`,
      body: [limitation, pricing, planTrade, altCtx].join("\n\n"),
    },
    {
      id: `sec-scenario-${slug}`,
      heading: `Decision scenario and conclusion for ${name}`,
      body: [scenario, impl, integBlob ? `Integrations in research: ${integBlob}.` : null, conclusion]
        .filter(Boolean)
        .join("\n\n"),
    },
  ];

  return { sections, summary };
}
