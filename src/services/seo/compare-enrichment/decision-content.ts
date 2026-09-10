import type { Software } from "@/domain/schemas";
import { loadEnrichment } from "@/data/research/store";
import type {
  CapabilityCompareRow,
  ComparisonThesis,
  DecisionContentDraft,
  EvidencePairSummary,
  PricingDiffSummary,
} from "./types";
import { pricingDifferenceBullets } from "./pricing";

function takeUnique(items: string[], limit: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const t = item.trim();
    if (!t || seen.has(t.toLowerCase())) continue;
    seen.add(t.toLowerCase());
    out.push(t);
    if (out.length >= limit) break;
  }
  return out;
}

function slugVariant(a: string, b: string): number {
  const s = `${a}-vs-${b}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 4;
}

function statusLabel(status: string): "YES" | "NO" | "PARTIAL" | "UNKNOWN" {
  if (status === "supported") return "YES";
  if (status === "unsupported") return "NO";
  if (status === "partial") return "PARTIAL";
  return "UNKNOWN";
}

/**
 * Build decision copy only from structured product fields + thesis.
 * Omits empty sections rather than filling with generics.
 * Pair-specific: never a name-swapped shell.
 */
export function buildDecisionContentDraft(
  a: Software,
  b: Software,
  opts: {
    thesis: ComparisonThesis | null;
    pricing: PricingDiffSummary;
    evidence: EvidencePairSummary;
    capabilityRows: CapabilityCompareRow[];
  },
): DecisionContentDraft {
  const v = slugVariant(a.slug, b.slug);
  const descA = (a.shortDescription || "").replace(/\s+/g, " ").trim();
  const descB = (b.shortDescription || "").replace(/\s+/g, " ").trim();

  const chooseAIf = takeUnique(
    [
      ...(a.bestFor ?? []).map((s) => s),
      descA
        ? `your buying job matches “${descA.slice(0, 90)}” rather than ${b.name}'s shape`
        : "",
      (a.useCaseSlugs ?? [])[0]
        ? `use-case priority is ${(a.useCaseSlugs ?? [])[0]} and ${b.name} is secondary for that motion`
        : "",
      a.scores?.easeOfUse != null &&
      b.scores?.easeOfUse != null &&
      a.scores.easeOfUse > b.scores.easeOfUse + 0.8
        ? `you prioritize ease of use (editorial ${a.scores.easeOfUse} vs ${b.scores.easeOfUse})`
        : "",
      a.scores?.automation != null &&
      b.scores?.automation != null &&
      a.scores.automation > b.scores.automation + 0.8
        ? `you need stronger automation depth (editorial ${a.scores.automation} vs ${b.scores.automation})`
        : "",
    ],
    4,
  );
  const chooseBIf = takeUnique(
    [
      ...(b.bestFor ?? []).map((s) => s),
      descB
        ? `your buying job matches “${descB.slice(0, 90)}” rather than ${a.name}'s shape`
        : "",
      (b.useCaseSlugs ?? [])[0]
        ? `use-case priority is ${(b.useCaseSlugs ?? [])[0]} and ${a.name} is secondary for that motion`
        : "",
      b.scores?.easeOfUse != null &&
      a.scores?.easeOfUse != null &&
      b.scores.easeOfUse > a.scores.easeOfUse + 0.8
        ? `you prioritize ease of use (editorial ${b.scores.easeOfUse} vs ${a.scores.easeOfUse})`
        : "",
      b.scores?.automation != null &&
      a.scores?.automation != null &&
      b.scores.automation > a.scores.automation + 0.8
        ? `you need stronger automation depth (editorial ${b.scores.automation} vs ${a.scores.automation})`
        : "",
    ],
    4,
  );

  const keyDifferences: string[] = [];
  if (opts.thesis) {
    keyDifferences.push(
      `Buyer thesis: ${opts.thesis.label} — ${opts.thesis.rationale}`,
    );
  }
  if (descA && descB && descA.toLowerCase() !== descB.toLowerCase()) {
    keyDifferences.push(
      `Positioning: ${a.name} is ${descA.slice(0, 140)}; ${b.name} is ${descB.slice(0, 140)}.`,
    );
  }
  const sizeA = (a.businessSizeSlugs ?? []).slice(0, 3).join(", ");
  const sizeB = (b.businessSizeSlugs ?? []).slice(0, 3).join(", ");
  if (sizeA && sizeB && sizeA !== sizeB) {
    keyDifferences.push(
      `Company-size focus: ${a.name} (${sizeA}) vs ${b.name} (${sizeB}).`,
    );
  }
  const useA = new Set(a.useCaseSlugs ?? []);
  const useB = new Set(b.useCaseSlugs ?? []);
  const onlyUseA = [...useA].filter((u) => !useB.has(u)).slice(0, 3);
  const onlyUseB = [...useB].filter((u) => !useA.has(u)).slice(0, 3);
  if (onlyUseA.length || onlyUseB.length) {
    keyDifferences.push(
      `Workflow coverage skew: ${a.name}-leaning ${onlyUseA.join(", ") || "—"} vs ${b.name}-leaning ${onlyUseB.join(", ") || "—"}.`,
    );
  }

  const divergentCaps = opts.capabilityRows.filter(
    (r) =>
      r.statusA !== r.statusB &&
      r.statusA !== "unknown" &&
      r.statusB !== "unknown",
  );
  for (const row of divergentCaps.slice(0, 4)) {
    keyDifferences.push(
      `${row.label}: ${a.name}=${statusLabel(row.statusA)}, ${b.name}=${statusLabel(row.statusB)} (missing data stays UNKNOWN — never treated as NO).`,
    );
  }

  const pricingDifferences = pricingDifferenceBullets(a, b, opts.pricing);

  const targetCompany = takeUnique(
    [
      sizeA ? `${a.name}: ${sizeA}` : "",
      sizeB ? `${b.name}: ${sizeB}` : "",
      ...(a.teamTypeSlugs ?? []).slice(0, 2).map((t) => `${a.name} teams: ${t}`),
      ...(b.teamTypeSlugs ?? []).slice(0, 2).map((t) => `${b.name} teams: ${t}`),
    ],
    4,
  );

  const easeImplementation = takeUnique(
    [
      a.scores?.easeOfUse != null
        ? `${a.name} ease-of-use score: ${a.scores.easeOfUse}/10`
        : "",
      b.scores?.easeOfUse != null
        ? `${b.name} ease-of-use score: ${b.scores.easeOfUse}/10`
        : "",
      (a.deploymentModels ?? []).length > 0
        ? `${a.name} deployment: ${(a.deploymentModels ?? []).join(", ")}`
        : "",
      (b.deploymentModels ?? []).length > 0
        ? `${b.name} deployment: ${(b.deploymentModels ?? []).join(", ")}`
        : "",
    ],
    4,
  );

  const intA = new Set(a.integrationSlugs ?? []);
  const intB = new Set(b.integrationSlugs ?? []);
  const onlyA = [...intA].filter((x) => !intB.has(x)).slice(0, 3);
  const onlyB = [...intB].filter((x) => !intA.has(x)).slice(0, 3);
  const integrationDifferences = takeUnique(
    [
      onlyA.length ? `${a.name}-leaning integrations: ${onlyA.join(", ")}` : "",
      onlyB.length ? `${b.name}-leaning integrations: ${onlyB.join(", ")}` : "",
      a.scores?.integrations != null && b.scores?.integrations != null
        ? `Integration scores: ${a.name} ${a.scores.integrations}/10 vs ${b.name} ${b.scores.integrations}/10`
        : "",
    ],
    4,
  );

  const strengthsA = takeUnique([...(a.pros ?? []), ...(a.bestFor ?? [])], 4);
  const strengthsB = takeUnique([...(b.pros ?? []), ...(b.bestFor ?? [])], 4);
  const enrichA = loadEnrichment(a.slug);
  const enrichB = loadEnrichment(b.slug);
  const researchLimA = (enrichA?.limitations ?? [])
    .map((l) => l.description)
    .filter(Boolean);
  const researchLimB = (enrichB?.limitations ?? [])
    .map((l) => l.description)
    .filter(Boolean);
  const limitationsA = takeUnique(
    [...(a.cons ?? []), ...(a.notIdealFor ?? []), ...researchLimA],
    4,
  );
  const limitationsB = takeUnique(
    [...(b.cons ?? []), ...(b.notIdealFor ?? []), ...researchLimB],
    4,
  );
  if (researchLimA[0] || researchLimB[0]) {
    keyDifferences.push(
      `Researched limits: ${a.name} — ${researchLimA[0] || "none listed"}; ${b.name} — ${researchLimB[0] || "none listed"}.`,
    );
  }

  const bestFitScenarios = takeUnique(
    [
      ...chooseAIf.map((s) => `Prefer ${a.name} when ${s}`),
      ...chooseBIf.map((s) => `Prefer ${b.name} when ${s}`),
    ],
    6,
  );
  const poorFitScenarios = takeUnique(
    [
      ...(a.notIdealFor ?? []).map((s) => `${a.name} is a poor fit when ${s}`),
      ...(b.notIdealFor ?? []).map((s) => `${b.name} is a poor fit when ${s}`),
      limitationsA[0]
        ? `${a.name} is a poor fit when that limitation bites: ${limitationsA[0]}`
        : "",
      limitationsB[0]
        ? `${b.name} is a poor fit when that limitation bites: ${limitationsB[0]}`
        : "",
      descA && descB
        ? `Avoid ${a.name} if you actually need ${b.name}'s motion (${descB.slice(0, 80)})`
        : "",
      descA && descB
        ? `Avoid ${b.name} if you actually need ${a.name}'s motion (${descA.slice(0, 80)})`
        : "",
    ],
    4,
  );

  const altSlugs = takeUnique(
    [
      ...(a.alternativeSlugs ?? []),
      ...(b.alternativeSlugs ?? []),
      ...(a.competitorSlugs ?? []),
      ...(b.competitorSlugs ?? []),
    ].filter((s) => s !== a.slug && s !== b.slug),
    6,
  );

  const hasChoose = chooseAIf.length > 0 || chooseBIf.length > 0;
  const thesisBit = opts.thesis
    ? v === 0
      ? `${opts.thesis.label}.`
      : v === 1
        ? `Comparison thesis: ${opts.thesis.label}.`
        : v === 2
          ? `${opts.thesis.rationale}`
          : `Frame: ${opts.thesis.label} — ${opts.thesis.rationale.slice(0, 120)}.`
    : null;

  const workflowAdvantage =
    onlyUseA[0] || onlyUseB[0]
      ? `Workflow advantage: ${a.name} leans ${onlyUseA.slice(0, 2).join(", ") || "shared coverage"}; ${b.name} leans ${onlyUseB.slice(0, 2).join(", ") || "shared coverage"}.`
      : descA && descB
        ? `Workflow advantage differs because ${a.name} is shaped for ${descA.slice(0, 70)} whereas ${b.name} is shaped for ${descB.slice(0, 70)}.`
        : null;

  const quickVerdict = hasChoose
    ? [
        thesisBit,
        chooseAIf[0] ? `Choose ${a.name} only if ${chooseAIf[0]}.` : null,
        chooseBIf[0] ? `Choose ${b.name} only if ${chooseBIf[0]}.` : null,
        workflowAdvantage,
        divergentCaps[0]
          ? `Capability hinge: ${divergentCaps[0].label} (${a.name}=${statusLabel(divergentCaps[0].statusA)}, ${b.name}=${statusLabel(divergentCaps[0].statusB)}).`
          : null,
        "Trade-off: you gain focus on one product's motion at the cost of the other's adjacent coverage — no universal winner.",
      ]
        .filter(Boolean)
        .join(" ")
    : opts.thesis
      ? `${opts.thesis.rationale} Unlike a feature-score shootout, this page decides by buyer job. ${workflowAdvantage ?? ""} ${opts.evidence.disclaimer}`
      : `${a.name} vs ${b.name}: compare against your constraints; neither side is declared a universal winner. ${opts.evidence.disclaimer}`;

  const finalRecommendation = [
    quickVerdict,
    poorFitScenarios[0] ?? null,
    poorFitScenarios[1] ?? null,
    limitationsA[0]
      ? `Hard limitation for ${a.name} when it matters: ${limitationsA[0]}.`
      : null,
    limitationsB[0]
      ? `Hard limitation for ${b.name} when it matters: ${limitationsB[0]}.`
      : null,
    easeImplementation[0]
      ? `Implementation complexity note: ${easeImplementation.join(" · ")}.`
      : null,
    opts.evidence.disclaimer,
    opts.pricing.costCalculatorHref
      ? `Pricing threshold: estimate spend with the cost calculator before shortlisting.`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    quickVerdict,
    chooseAIf,
    chooseBIf,
    keyDifferences: takeUnique(keyDifferences, 8),
    pricingDifferences,
    targetCompany,
    easeImplementation,
    integrationDifferences,
    strengthsA,
    strengthsB,
    limitationsA,
    limitationsB,
    bestFitScenarios,
    poorFitScenarios,
    alternatives: altSlugs,
    finalRecommendation,
  };
}
