import type { ResearchDomain, Software } from "@/domain";
import { loadAssessment } from "@/data/editorial/store";
import { loadEnrichment, loadFacts } from "@/data/research/store";
import { assessDomainCompleteness, type DomainCompleteness } from "@/services/research/freshness";

export type CompletenessSection =
  | "identity"
  | "taxonomy"
  | "pricing"
  | "plans"
  | "features"
  | "integrations"
  | "ai"
  | "security"
  | "editorial"
  | "affiliate"
  | "research";

export type CompletenessReport = {
  slug: string;
  name: string;
  sections: Record<CompletenessSection, DomainCompleteness | "PASS" | "MISSING" | "PARTIAL">;
  completenessPercent: number;
};

const DOMAIN_MAP: Partial<Record<CompletenessSection, ResearchDomain>> = {
  identity: "identity",
  pricing: "pricing",
  plans: "plans",
  features: "features",
  integrations: "integrations",
  ai: "ai-capabilities",
  security: "security-compliance",
};

export function assessSoftwareCompleteness(
  software: Software,
): CompletenessReport {
  const enrichment = loadEnrichment(software.slug);
  const facts = loadFacts(software.slug);

  const sections: CompletenessReport["sections"] = {
    identity:
      software.name && software.slug && software.primaryCategorySlug
        ? software.shortDescription || enrichment?.shortDescription
          ? "complete"
          : "partial"
        : "missing",
    taxonomy:
      software.primaryCategorySlug &&
      (software.subcategorySlugs.length > 0 || software.useCaseSlugs.length > 0)
        ? "complete"
        : software.primaryCategorySlug
          ? "partial"
          : "missing",
    pricing: domainStatus(software, facts, enrichment, "pricing"),
    plans: domainStatus(software, facts, enrichment, "plans"),
    features: domainStatus(software, facts, enrichment, "features"),
    integrations:
      software.integrationSlugs.length > 0 ||
      (enrichment?.integrationSupport.length ?? 0) > 0
        ? "partial"
        : "missing",
    ai: domainStatus(software, facts, enrichment, "ai"),
    security: "missing",
    editorial: (() => {
      const assessment = loadAssessment(software.slug);
      if (assessment?.status === "approved") return "complete";
      if (assessment || software.verdict || software.scores || software.pros.length > 0)
        return "partial";
      return "missing";
    })(),
    affiliate: software.affiliate.enabled && software.affiliate.trackingUrl
      ? "complete"
      : "missing",
    research:
      software.metadata.researchStatus === "complete"
        ? "complete"
        : facts.length > 0
          ? "partial"
          : "missing",
  };

  const scores = Object.values(sections).map((status) => {
    if (status === "complete" || status === "PASS") return 1;
    if (status === "partial" || status === "PARTIAL" || status === "stale")
      return 0.5;
    return 0;
  });

  return {
    slug: software.slug,
    name: software.name,
    sections,
    completenessPercent: Math.round(
      (scores.reduce<number>((a, b) => a + b, 0) / scores.length) * 100,
    ),
  };
}

function domainStatus(
  software: Software,
  facts: ReturnType<typeof loadFacts>,
  enrichment: ReturnType<typeof loadEnrichment>,
  section: CompletenessSection,
): DomainCompleteness {
  const domain = DOMAIN_MAP[section];
  if (!domain) return "missing";

  const domainFacts = facts.filter(
    (fact) => fact.domain === domain || fact.field.startsWith(`${section}.`),
  );
  const hasCanonicalPricing =
    section === "pricing" &&
    Boolean(
      software.pricing &&
        (software.pricing.plans.length > 0 ||
          software.pricing.startingPriceMonthly != null),
    );
  const hasEnrichmentPricing =
    section === "pricing" && Boolean(enrichment?.pricing);

  return assessDomainCompleteness({
    domain,
    hasFacts:
      domainFacts.length > 0 || hasCanonicalPricing || hasEnrichmentPricing,
    totalCount: Math.max(
      domainFacts.length,
      hasCanonicalPricing || hasEnrichmentPricing ? 1 : 0,
    ),
    verifiedCount: domainFacts.filter(
      (f) => f.status === "approved" || f.status === "verified",
    ).length,
    checkedAt: enrichment?.domainCheckedAt?.[domain],
  });
}

export function formatCompletenessReport(report: CompletenessReport): string {
  const lines = [
    report.name,
    "",
    ...Object.entries(report.sections).map(
      ([key, value]) => `${key.padEnd(16)} ${String(value).toUpperCase()}`,
    ),
    "",
    `Research completeness: ${report.completenessPercent}%`,
  ];
  return lines.join("\n");
}
