import type { Software } from "@/domain/schemas";
import { getComparisonBySlug, getSoftwareBySlug } from "@/data";
import { getGuides } from "@/data/repositories/guides";
import { loadAssessment, loadReview } from "@/data/editorial/store";
import { loadEnrichment } from "@/data/research/store";
import { listSoftwareDependents } from "./dependents";
import type { DecisionHubDraft, SoftwareFieldAudit } from "./types";

function take(items: string[], n: number): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const t = item.trim();
    if (!t || seen.has(t.toLowerCase())) continue;
    seen.add(t.toLowerCase());
    out.push(t);
    if (out.length >= n) break;
  }
  return out;
}

/**
 * Build decision-hub copy strictly from catalogue / research / editorial.
 * Empty sections stay empty — never invent best-for or pricing.
 */
export function buildDecisionHubDraft(
  software: Software,
  fieldAudit: SoftwareFieldAudit,
): DecisionHubDraft {
  const enrichment = loadEnrichment(software.slug);
  const assessment = loadAssessment(software.slug);
  const review = loadReview(software.slug);

  const whatItIs =
    enrichment?.shortDescription?.trim() ||
    software.shortDescription?.trim() ||
    null;

  const bestFor = take(
    [
      ...(review?.bestFor ?? []),
      ...(assessment?.bestFor ?? []),
      ...(software.bestFor ?? []),
      ...(enrichment?.editorialFit ?? [])
        .filter((f) => f.strength === "strong" || f.strength === "moderate")
        .map((f) => {
          const who = [f.businessSizeSlug, f.teamTypeSlug]
            .filter(Boolean)
            .join(" / ");
          return f.rationale
            ? `${who ? `${who}: ` : ""}${f.rationale}`
            : who || "";
        })
        .filter(Boolean),
    ],
    6,
  );

  const notIdealFor = take(
    [
      ...(review?.notIdealFor ?? []),
      ...(assessment?.notIdealFor ?? []),
      ...(software.notIdealFor ?? []),
      ...(enrichment?.limitations ?? [])
        .map((l) => l.description)
        .filter(Boolean),
      ...(enrichment?.editorialFit ?? [])
        .filter((f) => f.strength === "weak")
        .map((f) => {
          const who = [f.businessSizeSlug, f.teamTypeSlug]
            .filter(Boolean)
            .join(" / ");
          return f.rationale
            ? `Weak fit — ${who ? `${who}: ` : ""}${f.rationale}`
            : who
              ? `Weak fit for ${who}`
              : "";
        })
        .filter(Boolean),
    ],
    6,
  );

  const coreCapabilities = take(
    [
      ...(enrichment?.featureSupport ?? [])
        .filter(
          (f) =>
            f.availability === "supported" || f.availability === "limited",
        )
        .map((f) => f.featureSlug.replace(/-/g, " ")),
      ...(software.featureRatings ?? [])
        .filter((f) => (f.rating ?? 0) >= 7)
        .map((f) => f.featureSlug.replace(/-/g, " ")),
      ...(software.useCaseSlugs ?? []).map((u) => u.replace(/-/g, " ")),
    ],
    8,
  );

  let pricingSummary: string | null = null;
  const pricing = (enrichment?.pricing || software.pricing) as
    | {
        plans?: Array<{
          name: string;
          isFree?: boolean;
          hasFreeTrial?: boolean;
          trialDays?: number | null;
        }>;
      }
    | null
    | undefined;
  if (pricing?.plans?.length) {
    const free = pricing.plans.filter((p) => p.isFree);
    const paid = pricing.plans.filter((p) => !p.isFree);
    const trial = pricing.plans.some(
      (p) => p.hasFreeTrial || (p.trialDays != null && p.trialDays > 0),
    );
    const bits = [
      `${pricing.plans.length} documented plan${pricing.plans.length === 1 ? "" : "s"}`,
      free.length ? `${free.length} free` : null,
      paid[0]?.name ? `entry paid: ${paid[0].name}` : null,
      trial ? "trial documented on at least one plan" : null,
    ].filter(Boolean);
    pricingSummary = bits.join(" · ");
  }

  const keyTradeoffs = take(
    [
      ...(enrichment?.limitations ?? []).map((l) => l.description),
      ...(enrichment?.vendorPositioning ?? []).map((p) => {
        const aud = (p.audienceHints ?? []).slice(0, 2).join(", ");
        return aud ? `${p.claim} (audience: ${aud})` : p.claim;
      }),
      ...(software.cons ?? []),
    ],
    5,
  );

  const altSlugs = take(
    [
      ...(software.alternativeSlugs ?? []),
      ...(software.competitorSlugs ?? []),
    ],
    6,
  );
  const alternatives = altSlugs
    .map((slug) => {
      const peer = getSoftwareBySlug(slug);
      return peer ? { slug, name: peer.name } : null;
    })
    .filter(Boolean) as Array<{ slug: string; name: string }>;

  const deps = listSoftwareDependents(software.slug);
  const importantComparisons = deps
    .filter((d) => d.kind === "comparison")
    .slice(0, 6)
    .map((d) => {
      const c = getComparisonBySlug(d.slug, { includeUnpublished: true });
      return {
        slug: d.slug,
        title: c?.title ?? d.slug,
        href: d.path,
      };
    });

  const relevantGuides = getGuides({ includeUnpublished: true })
    .filter((g) => (g.productSlugs ?? []).includes(software.slug))
    .slice(0, 6)
    .map((g) => ({
      slug: g.slug,
      title: g.title,
      href: `/guides/${g.slug}/`,
    }));

  const verifiedItem = fieldAudit.items.find((i) => i.field === "verification_date");
  const handsOn = Boolean(review?.handsOnTesting || assessment?.handsOnTesting);
  const evidenceState = [
    handsOn ? "Hands-on testing on file" : "Research/data-based (no completed hands-on test)",
    verifiedItem?.status === "PASS"
      ? verifiedItem.detail
      : "Verification date missing on entity",
    assessment?.status ? `Editorial assessment: ${assessment.status}` : "No editorial assessment",
  ].join(" · ");

  const missingSections = fieldAudit.items
    .filter((i) => i.status === "MISSING" || i.status === "UNKNOWN")
    .map((i) => i.field);

  let nextDecisionStep: string | null = null;
  if (importantComparisons[0]) {
    nextDecisionStep = `Compare against peers: ${importantComparisons[0].title}`;
  } else if (alternatives[0]) {
    nextDecisionStep = `Review alternatives starting with ${alternatives[0].name}`;
  } else if (pricingSummary) {
    nextDecisionStep = `Confirm current list pricing on the ${software.name} pricing tab before shortlisting`;
  } else if (relevantGuides[0]) {
    nextDecisionStep = `Read ${relevantGuides[0].title}`;
  } else if (missingSections.includes("pricing")) {
    nextDecisionStep =
      "Pricing data incomplete — request catalogue/research remediation before a buy decision";
  }

  return {
    whatItIs,
    bestFor,
    notIdealFor,
    coreCapabilities,
    pricingSummary,
    keyTradeoffs,
    alternatives,
    importantComparisons,
    relevantGuides,
    evidenceState,
    nextDecisionStep,
    missingSections,
  };
}
