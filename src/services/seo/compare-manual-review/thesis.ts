import type { Software } from "@/domain/schemas";
import { resolveComparisonThesis } from "@/services/seo/compare-enrichment/thesis";
import type { ComparabilitySignal } from "@/services/seo/compare-index-worthiness/relationship";
import type { BuyerThesisDraft, RelationshipEvidencePack } from "./types";
import { isCrmVsSalesIntelligence } from "./evidence";

function startingBand(product: Software): number | null {
  const p = product.pricing?.startingPriceMonthly;
  if (p == null || !Number.isFinite(p)) return null;
  if (p <= 0) return 0;
  if (p < 20) return 1;
  if (p < 50) return 2;
  if (p < 100) return 3;
  if (p < 250) return 4;
  return 5;
}

function trimDesc(s: string | undefined | null, n = 100): string {
  const t = (s ?? "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

function isGenericThesis(thesis: BuyerThesisDraft): boolean {
  const generic = [
    /^same category, different strengths$/i,
    /^both are powerful/i,
    /^cross-category workflow tradeoff$/i,
  ];
  return generic.some((re) => re.test(thesis.label.trim()));
}

/**
 * Phase 4 — specific buyer thesis for enrichable classes.
 * Catalogue-supported framing only; never invent competitive claims.
 * Returns null when we cannot state a pair-specific thesis (caller demotes to WEAK).
 */
export function resolveManualReviewThesis(
  a: Software,
  b: Software,
  pack: RelationshipEvidencePack,
): BuyerThesisDraft | null {
  const signals: ComparabilitySignal[] = pack.catalogueSignalIds.map((id) => ({
    id: id as ComparabilitySignal["id"],
    weight: 1,
    detail: id,
  }));

  if (isCrmVsSalesIntelligence(a, b)) {
    return {
      kind: "crm_vs_sales_intelligence",
      label: "CRM system of record vs sales-intelligence workflow",
      rationale: `${a.name} (${a.primaryCategorySlug}) vs ${b.name} (${b.primaryCategorySlug}): buyers weigh a CRM record against SI enrichment/outbound tooling for the same revenue motion.`,
      supportedBy: pack.items
        .filter((i) => i.present)
        .map((i) => i.flag)
        .slice(0, 6),
    };
  }

  if (
    pack.useCaseBreadthSkew >= 2 &&
    pack.useCasesA.length > 0 &&
    pack.useCasesB.length > 0 &&
    !pack.disjointUseCases
  ) {
    const aNarrower = pack.useCasesA.length < pack.useCasesB.length;
    const specialist = aNarrower ? a : b;
    const general = aNarrower ? b : a;
    const specialistUses = aNarrower ? pack.useCasesA : pack.useCasesB;
    const generalUses = aNarrower ? pack.useCasesB : pack.useCasesA;
    return {
      kind: "specialist_vs_generalist",
      label: `${general.name} is broader; ${specialist.name} specializes`,
      rationale: `${general.name} documents a wider use-case set (${generalUses.slice(0, 3).join(", ") || "broader scope"}); ${specialist.name} concentrates on ${specialistUses.slice(0, 3).join(", ") || "a narrower job"}.`,
      supportedBy: ["overlapping_use_cases", "use_case_breadth_skew", "related_job_family"].filter(
        (id) =>
          pack.items.some((i) => i.flag === id && i.present) ||
          id === "use_case_breadth_skew",
      ),
    };
  }

  if (pack.relatedJobFamily && pack.jobFamiliesA.length && pack.jobFamiliesB.length) {
    const fam = [...new Set([...pack.jobFamiliesA, ...pack.jobFamiliesB])].join(
      "/",
    );
    return {
      kind: "related_job_family",
      label: `${a.name} vs ${b.name} within ${fam}`,
      rationale: `${a.name} (${pack.useCasesA.slice(0, 2).join(", ") || a.primaryCategorySlug}) and ${b.name} (${pack.useCasesB.slice(0, 2).join(", ") || b.primaryCategorySlug}) sit in related buyer jobs (${fam}) — compare scope and fit, not interchangeable feature parity.`,
      supportedBy: ["related_job_family", "same_category"].filter((id) =>
        pack.items.some((i) => i.flag === id && i.present) || id === "related_job_family",
      ),
    };
  }

  if (pack.disjointUseCases) {
    // Should not enqueue — thesis for documentation only when WEAK with demand
    return {
      kind: "disjoint_jobs",
      label: `Different jobs: ${pack.useCasesA[0] ?? a.name} vs ${pack.useCasesB[0] ?? b.name}`,
      rationale: `${a.name} is documented for ${pack.useCasesA.slice(0, 2).join(", ") || "unspecified jobs"}; ${b.name} for ${pack.useCasesB.slice(0, 2).join(", ") || "unspecified jobs"} — not interchangeable substitutes.`,
      supportedBy: ["disjoint_use_cases"],
    };
  }

  const teamsA = new Set(a.teamTypeSlugs ?? []);
  const teamsB = new Set(b.teamTypeSlugs ?? []);
  const supportish = ["support", "customer-success", "cx", "service"];
  const salesish = ["sales", "revenue", "sdr", "ae"];
  const aSupport = supportish.some((t) => [...teamsA].some((x) => x.includes(t)));
  const bSupport = supportish.some((t) => [...teamsB].some((x) => x.includes(t)));
  const aSales = salesish.some((t) => [...teamsA].some((x) => x.includes(t)));
  const bSales = salesish.some((t) => [...teamsB].some((x) => x.includes(t)));
  if ((aSupport && bSales && !bSupport) || (bSupport && aSales && !aSupport)) {
    return {
      kind: "support_vs_sales",
      label: "Support/CX motion vs sales motion",
      rationale: `Documented team-type focus diverges: ${a.name} vs ${b.name} (support/CX vs sales).`,
      supportedBy: ["shared_audience", "same_category"].filter((id) =>
        pack.catalogueSignalIds.includes(id),
      ),
    };
  }

  const bandA = startingBand(a);
  const bandB = startingBand(b);
  if (
    bandA != null &&
    bandB != null &&
    Math.abs(bandA - bandB) >= 2 &&
    pack.sameCategory
  ) {
    const lower = bandA < bandB ? a.name : b.name;
    const higher = bandA < bandB ? b.name : a.name;
    return {
      kind: "lower_cost_vs_comprehensive",
      label: `${lower} vs ${higher} on list-price band`,
      rationale: `${lower} starts in a lower published list-price band than ${higher}; compare breadth vs budget using published pricing only.`,
      supportedBy: ["similar_pricing_tier", "same_category"].filter(
        (id) => pack.catalogueSignalIds.includes(id) || id === "same_category",
      ),
    };
  }

  const sharedUse = pack.useCasesA.filter((u) => pack.useCasesB.includes(u));
  if (sharedUse.length > 0) {
    const onlyA = pack.useCasesA.filter((u) => !pack.useCasesB.includes(u));
    const onlyB = pack.useCasesB.filter((u) => !pack.useCasesA.includes(u));
    return {
      kind: "shared_job_different_shape",
      label: `Both cover ${sharedUse[0]?.replace(/-/g, " ")}; shapes differ`,
      rationale: `${a.name} and ${b.name} share ${sharedUse.slice(0, 2).join(", ")}. ${
        onlyA[0]
          ? `${a.name} also leans ${onlyA.slice(0, 2).join(", ")}.`
          : ""
      } ${
        onlyB[0]
          ? `${b.name} also leans ${onlyB.slice(0, 2).join(", ")}.`
          : ""
      }`.replace(/\s+/g, " ").trim(),
      supportedBy: ["shared_use_cases"],
    };
  }

  const descA = trimDesc(a.shortDescription);
  const descB = trimDesc(b.shortDescription);
  if (
    descA &&
    descB &&
    descA.toLowerCase() !== descB.toLowerCase() &&
    (pack.sameCategory ||
      pack.items.some(
        (i) =>
          i.present &&
          (i.flag === "secondary_category_overlap" ||
            i.flag === "shared_use_cases"),
      ))
  ) {
    return {
      kind: "positioning_tradeoff",
      label: `${a.name} vs ${b.name} positioning tradeoff`,
      rationale: `${a.name} is positioned as “${descA}”; ${b.name} as “${descB}”.`,
      supportedBy: pack.catalogueSignalIds.slice(0, 4),
    };
  }

  const base = resolveComparisonThesis(a, b, signals);
  if (base) {
    const draft: BuyerThesisDraft = {
      kind: base.kind,
      label: base.label,
      rationale: base.rationale,
      supportedBy: base.supportedBy,
    };
    if (!isGenericThesis(draft)) return draft;
    // Upgrade generic labels with product-specific rationale when possible
    if (descA && descB) {
      return {
        kind: base.kind,
        label: `${a.name} vs ${b.name}: ${base.label.toLowerCase()}`,
        rationale: `${base.rationale} ${a.name}: “${descA}”. ${b.name}: “${descB}”.`,
        supportedBy: base.supportedBy,
      };
    }
  }

  // No specific thesis available — caller must not enqueue as VALID enrichment
  return null;
}

export { isGenericThesis };
