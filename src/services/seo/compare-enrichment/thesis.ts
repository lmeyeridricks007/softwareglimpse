import type { Software } from "@/domain/schemas";
import type { ComparabilitySignal } from "@/services/seo/compare-index-worthiness/relationship";
import type { ComparisonThesis, ComparisonThesisKind } from "./types";

function sizeSkew(a: Software, b: Software): "enterprise_vs_smb" | "size_diff" | null {
  const sizesA = new Set(a.businessSizeSlugs ?? []);
  const sizesB = new Set(b.businessSizeSlugs ?? []);
  const enterprise = ["enterprise", "large", "mid-market", "midmarket"];
  const smb = ["smb", "small", "startup", "solopreneur", "freelancer"];
  const aEnt = enterprise.some((s) => sizesA.has(s));
  const bEnt = enterprise.some((s) => sizesB.has(s));
  const aSmb = smb.some((s) => sizesA.has(s));
  const bSmb = smb.some((s) => sizesB.has(s));
  if ((aEnt && bSmb && !bEnt) || (bEnt && aSmb && !aEnt)) {
    return "enterprise_vs_smb";
  }
  if (sizesA.size > 0 && sizesB.size > 0) {
    const overlap = [...sizesA].filter((s) => sizesB.has(s));
    if (overlap.length === 0) return "size_diff";
  }
  return null;
}

/**
 * Only emit a thesis when catalogue signals support it — never invent framing.
 */
export function resolveComparisonThesis(
  a: Software,
  b: Software,
  signals: ComparabilitySignal[],
): ComparisonThesis | null {
  const signalIds = new Set(signals.map((s) => s.id));
  const size = sizeSkew(a, b);

  if (size === "enterprise_vs_smb") {
    return {
      kind: "enterprise_vs_smb",
      label: "Enterprise vs SMB focus",
      rationale: `${a.name} and ${b.name} target different company-size bands in the same buying problem.`,
      supportedBy: ["same_audience", "same_category"].filter((id) =>
        signalIds.has(id as ComparabilitySignal["id"]),
      ) as ComparisonThesis["supportedBy"],
    };
  }

  if (size === "size_diff" && signalIds.has("same_category")) {
    return {
      kind: "same_category_different_company_size",
      label: "Same category, different company size",
      rationale: `Both sit in ${a.primaryCategorySlug}, but documented company-size audiences diverge.`,
      supportedBy: ["same_category", "same_audience"].filter((id) =>
        signalIds.has(id as ComparabilitySignal["id"]),
      ) as ComparisonThesis["supportedBy"],
    };
  }

  const modelA = a.pricing?.model;
  const modelB = b.pricing?.model;
  if (
    modelA &&
    modelB &&
    modelA !== "unknown" &&
    modelB !== "unknown" &&
    modelA !== modelB &&
    signalIds.has("same_category")
  ) {
    return {
      kind: "similar_product_different_pricing_model",
      label: "Similar products, different pricing model",
      rationale: `${a.name} is priced as ${modelA}; ${b.name} as ${modelB}.`,
      supportedBy: ["same_category", "similar_pricing_tier"].filter((id) =>
        signalIds.has(id as ComparabilitySignal["id"]),
      ) as ComparisonThesis["supportedBy"],
    };
  }

  const useA = a.useCaseSlugs?.length ?? 0;
  const useB = b.useCaseSlugs?.length ?? 0;
  if (
    signalIds.has("overlapping_use_cases") &&
    Math.abs(useA - useB) >= 3 &&
    Math.min(useA, useB) > 0
  ) {
    const specialist = useA < useB ? a.name : b.name;
    const general = useA < useB ? b.name : a.name;
    return {
      kind: "general_purpose_vs_specialist",
      label: "General-purpose vs specialist",
      rationale: `${general} documents a broader use-case set; ${specialist} is narrower/specialist.`,
      supportedBy: ["overlapping_use_cases", "same_category"].filter((id) =>
        signalIds.has(id as ComparabilitySignal["id"]),
      ) as ComparisonThesis["supportedBy"],
    };
  }

  const aiA = (a.aiCapabilities?.length ?? 0) > 0;
  const aiB = (b.aiCapabilities?.length ?? 0) > 0;
  if (aiA !== aiB && signalIds.has("same_category")) {
    return {
      kind: "ai_first_vs_traditional",
      label: "AI-first vs traditional workflow",
      rationale: `${aiA ? a.name : b.name} documents AI capabilities; ${aiA ? b.name : a.name} is framed around traditional workflows.`,
      supportedBy: ["same_category", "shared_capabilities"].filter((id) =>
        signalIds.has(id as ComparabilitySignal["id"]),
      ) as ComparisonThesis["supportedBy"],
    };
  }

  const autoA = a.scores?.automation ?? null;
  const autoB = b.scores?.automation ?? null;
  const easeA = a.scores?.easeOfUse ?? null;
  const easeB = b.scores?.easeOfUse ?? null;
  if (
    autoA != null &&
    autoB != null &&
    easeA != null &&
    easeB != null &&
    Math.abs(autoA - autoB) >= 1.5 &&
    ((autoA > autoB && easeB > easeA) || (autoB > autoA && easeA > easeB))
  ) {
    return {
      kind: "automation_first_vs_simplicity_first",
      label: "Automation-first vs simplicity-first",
      rationale: `Editorial scores diverge on automation vs ease of use between ${a.name} and ${b.name}.`,
      supportedBy: ["shared_capabilities", "same_category"].filter((id) =>
        signalIds.has(id as ComparabilitySignal["id"]),
      ) as ComparisonThesis["supportedBy"],
    };
  }

  if (
    signalIds.has("overlapping_use_cases") &&
    (signalIds.has("same_category") || signalIds.has("shared_capabilities"))
  ) {
    return {
      kind: "overlapping_use_case_tradeoff",
      label: "Overlapping use cases, different tradeoffs",
      rationale: `${a.name} and ${b.name} share buyer workflows; choose based on documented strengths and limits.`,
      supportedBy: ["overlapping_use_cases", "same_category"].filter((id) =>
        signalIds.has(id as ComparabilitySignal["id"]),
      ) as ComparisonThesis["supportedBy"],
    };
  }

  if (
    signalIds.has("same_category") &&
    ((a.pros?.length ?? 0) > 0 || (b.pros?.length ?? 0) > 0)
  ) {
    return {
      kind: "same_category_different_strengths",
      label: "Same category, different strengths",
      rationale: `Both compete in ${a.primaryCategorySlug} with distinct documented strengths.`,
      supportedBy: ["same_category"],
    };
  }

  return null;
}

export function thesisKindLabel(kind: ComparisonThesisKind): string {
  const map: Record<ComparisonThesisKind, string> = {
    same_category_different_company_size: "Same category, different company size",
    similar_product_different_pricing_model:
      "Similar products, different pricing model",
    general_purpose_vs_specialist: "General-purpose vs specialist",
    enterprise_vs_smb: "Enterprise vs SMB",
    automation_first_vs_simplicity_first: "Automation-first vs simplicity-first",
    ai_first_vs_traditional: "AI-first vs traditional",
    same_category_different_strengths: "Same category, different strengths",
    overlapping_use_case_tradeoff: "Overlapping use-case tradeoff",
  };
  return map[kind];
}
