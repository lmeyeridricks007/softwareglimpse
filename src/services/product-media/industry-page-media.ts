import type { ProductMedia } from "@/domain";
import { mediaLimitations, mediaWhatThisShows } from "@/domain";
import {
  enrichMediaFromSourceUrl,
  isVideoPublicEligible,
} from "@/services/product-media";
import { isLikelyBrandPromo } from "@/services/product-media/context-tab-media";
import { isMediaActivePublicDisplay } from "@/services/product-media/governance";
import { resolveFeatureDetailHref } from "@/data/feature-detail";
import { resolveRequirementDetailHref } from "@/data/requirement-detail";
import { canonicalFeaturesSeed } from "@/data/seed/features";

export type IndustryMediaContextKind =
  | "industry-specific"
  | "industry-edition"
  | "general-workflow"
  | "customer-case-study";

export type IndustryPageMediaContext = {
  industrySlug: string;
  productSlug?: string;
  useCaseIds?: string[];
  capabilityIds?: string[];
  requirementIds?: string[];
  featureIds?: string[];
  workflowStepIds?: string[];
  /**
   * When true (see-in-action), prefer strong industry matches and demote
   * generic brand promos. Generic demos may still appear as labeled fallback.
   */
  requireIndustryRelevance?: boolean;
};

export type IndustryRelatedLink = {
  slug: string;
  label: string;
  href: string | null;
};

export type IndustrySeeInActionCard = {
  productSlug: string;
  productName: string;
  logo?: { src: string; alt: string } | null;
  media: ProductMedia;
  title: string;
  /** Visible badge: industry-specific vs general workflow vs case study. */
  contextKind: IndustryMediaContextKind;
  contextLabel: string;
  industryEditionLabel: string | null;
  industryContext: string[];
  whatThisShows: string[];
  whatToNotice: string[];
  whatNotEstablished: string[];
  relatedCapabilities: IndustryRelatedLink[];
  relatedFeatures: IndustryRelatedLink[];
  relatedRequirements: IndustryRelatedLink[];
  relatedUseCases: IndustryRelatedLink[];
  workflowStepsShown: Array<{ id: string; label: string }>;
  verifiedAt: string | null;
  sourceOrganization: string;
  relevanceNote: string | null;
};

const DEFAULT_INDUSTRY_DOES_NOT_PROVE = [
  "regulatory compliance for your organization",
  "GDPR / FINRA / SOC 2 or other certification status",
  "data residency suitability",
  "security posture for your environment",
  "implementation effort or total cost of ownership",
  "pricing or plan packaging",
  "comparative superiority versus other CRMs",
] as const;

function featureLabel(slug: string): string {
  return (
    canonicalFeaturesSeed.find((f) => f.slug === slug)?.name ??
    slug
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ")
  );
}

export function resolveIndustryMediaContext(
  media: ProductMedia,
): IndustryMediaContextKind {
  if (media.mediaContext) return media.mediaContext;
  if (media.type === "official-customer-case-study") {
    return "customer-case-study";
  }
  if (media.industryEditionLabel?.trim()) return "industry-edition";
  if ((media.industryIds ?? []).length > 0) return "industry-specific";
  return "general-workflow";
}

export function industryMediaContextLabel(
  kind: IndustryMediaContextKind,
): string {
  switch (kind) {
    case "industry-specific":
      return "Industry-specific official demo";
    case "industry-edition":
      return "Industry edition official demo";
    case "customer-case-study":
      return "VENDOR-PUBLISHED CUSTOMER STORY";
    default:
      return "General product workflow";
  }
}

/**
 * Deterministic Industry hub display ranking — never feeds product fit scores.
 *
 * Priority:
 * 1. Industry + Product + Use Case
 * 2. Industry + Product
 * 3. Industry edition (only when tagged to this industry)
 * 4. Use Case + Product relevant to industry
 * 5. Capability + Product relevant to industry
 * 6. Generic product overview (low / fallback)
 */
export function scoreIndustryPageMedia(
  media: ProductMedia,
  ctx: IndustryPageMediaContext,
): number {
  const m = enrichMediaFromSourceUrl(media);
  let score = 0;

  const exactIndustry = m.industryIds.includes(ctx.industrySlug);
  const exactProduct =
    Boolean(ctx.productSlug) && m.productSlug === ctx.productSlug;
  const useCases = ctx.useCaseIds ?? [];
  const useCaseHit = useCases.some((u) => m.useCaseIds.includes(u));
  const caps = ctx.capabilityIds ?? [];
  const capHit = caps.some((c) => m.capabilityIds.includes(c));
  const reqs = ctx.requirementIds ?? [];
  const reqHit = reqs.some((r) => m.requirementIds.includes(r));
  const feats = ctx.featureIds ?? [];
  const featHit = feats.some((f) => m.featureIds.includes(f));
  const steps = ctx.workflowStepIds ?? [];
  const stepHit = steps.some((s) => m.workflowStageIds.includes(s));

  const kind = resolveIndustryMediaContext(m);

  if (exactIndustry && exactProduct && useCaseHit) score += 48;
  else if (exactIndustry && exactProduct) score += 40;
  else if (exactIndustry && useCaseHit) score += 34;
  else if (exactIndustry) score += 28;
  else if (kind === "industry-edition" && exactProduct && exactIndustry)
    score += 36;
  else if (useCaseHit && exactProduct) score += 22;
  else if (capHit && exactProduct) score += 16;
  else if (featHit || reqHit) score += 12;
  else score += 4;

  // Edition / industry-specific boosts only apply on the matching industry page.
  if (kind === "industry-edition" && exactIndustry) score += 8;
  if (kind === "industry-specific" && exactIndustry) score += 6;
  if (kind === "customer-case-study") score -= 4;
  if (stepHit) score += 5;

  if (m.type === "official-tutorial") score += 3;
  if (m.type === "official-webinar") score += 2;
  if (m.evidenceClaimKinds.includes("workflow-demo")) score += 3;
  if (m.whatThisShows.length > 0 || m.whatToNotice.length > 0) score += 2;

  if (isLikelyBrandPromo(m)) score -= 16;
  if (!exactIndustry && kind === "general-workflow") score -= 4;
  // Wrong-industry tags (e.g. FSC on plumbing) must not outrank general demos.
  if (m.industryIds.length > 0 && !exactIndustry) score -= 40;

  return score;
}

/**
 * Media tagged to a different industry (or an unmatched industry edition)
 * must never appear on this industry hub.
 */
export function isWrongIndustryPageMedia(
  media: ProductMedia,
  industrySlug: string,
): boolean {
  const m = enrichMediaFromSourceUrl(media);
  const ids = m.industryIds ?? [];
  if (ids.length > 0 && !ids.includes(industrySlug)) return true;

  const kind = resolveIndustryMediaContext(m);
  // Industry editions without a matching industry tag are unsafe to show.
  if (kind === "industry-edition" && !ids.includes(industrySlug)) {
    return true;
  }
  return false;
}

function defaultWhatToNotice(industrySlug: string): string[] {
  if (industrySlug === "financial-services") {
    return [
      "relationship / account model",
      "role visibility and handoffs",
      "how opportunities are surfaced beside client context",
      "reporting structure",
      "administration and integration points",
    ];
  }
  if (industrySlug === "real-estate") {
    return [
      "lead and listing workflow",
      "client communication cadence",
      "pipeline stages for deals",
      "reporting for agents / teams",
    ];
  }
  return [
    "how industry workflow context differs from generic sales CRM",
    "relationship or account representation",
    "stage and ownership visibility",
  ];
}

function buildCard(input: {
  media: ProductMedia;
  productName: string;
  logo?: { src: string; alt: string } | null;
  ctx: IndustryPageMediaContext;
  workflowSteps?: Array<{ id: string; label: string }>;
  capabilityLabels?: Record<string, string>;
  useCaseLabels?: Record<string, string>;
}): IndustrySeeInActionCard {
  const m = enrichMediaFromSourceUrl(input.media);
  const kind = resolveIndustryMediaContext(m);
  const whatThisShows = mediaWhatThisShows(m);
  const limitations = [
    ...new Set([
      ...mediaLimitations(m),
      ...DEFAULT_INDUSTRY_DOES_NOT_PROVE,
    ]),
  ];

  const whatToNotice =
    m.whatToNotice.filter((s) => s.trim()).length > 0
      ? m.whatToNotice
      : defaultWhatToNotice(input.ctx.industrySlug);

  const industryContext =
    whatThisShows.length > 0
      ? whatThisShows.slice(0, 4)
      : whatToNotice.slice(0, 4);

  const relatedCapabilities = m.capabilityIds.slice(0, 4).map((slug) => ({
    slug,
    label: input.capabilityLabels?.[slug] ?? featureLabel(slug),
    href: `/industries/${input.ctx.industrySlug}/capabilities/${slug}/`,
  }));

  const relatedFeatures = m.featureIds.slice(0, 4).map((slug) => ({
    slug,
    label: featureLabel(slug),
    href: resolveFeatureDetailHref(slug),
  }));

  const relatedRequirements = m.requirementIds.slice(0, 4).map((slug) => ({
    slug,
    label: featureLabel(slug),
    href: resolveRequirementDetailHref(slug),
  }));

  const relatedUseCases = m.useCaseIds.slice(0, 3).map((slug) => ({
    slug,
    label: input.useCaseLabels?.[slug] ?? featureLabel(slug),
    href: `/industries/${input.ctx.industrySlug}/use-cases/${slug}/`,
  }));

  const demonstrated = new Set(
    m.workflowStageIds.map((id) => id.toLowerCase()),
  );
  const workflowStepsShown = (input.workflowSteps ?? [])
    .filter((step) => {
      const id = step.id.toLowerCase();
      const labelSlug = step.label.toLowerCase().replace(/\s+/g, "-");
      return demonstrated.has(id) || demonstrated.has(labelSlug);
    })
    .map((step) => ({ id: step.id, label: step.label }));

  let relevanceNote: string | null = null;
  if (kind === "general-workflow") {
    relevanceNote = `General CRM workflow relevant to ${input.ctx.industrySlug.replace(/-/g, " ")} — not an industry-specific product demo.`;
  } else if (kind === "customer-case-study") {
    relevanceNote =
      "VENDOR-PUBLISHED CUSTOMER STORY — does not prove typical outcomes, ROI, or product superiority.";
  } else if (m.industryEditionLabel) {
    relevanceNote = `Demonstrates ${m.industryEditionLabel} — not necessarily the base CRM edition alone.`;
  }

  return {
    productSlug: m.productSlug,
    productName: input.productName,
    logo: input.logo ?? null,
    media: m,
    title:
      m.demonstratesCaption?.trim() ||
      m.title ||
      `${input.productName} industry workflow`,
    contextKind: kind,
    contextLabel: industryMediaContextLabel(kind),
    industryEditionLabel: m.industryEditionLabel?.trim() || null,
    industryContext,
    whatThisShows,
    whatToNotice,
    whatNotEstablished: limitations,
    relatedCapabilities,
    relatedFeatures,
    relatedRequirements,
    relatedUseCases,
    workflowStepsShown,
    verifiedAt: m.verifiedAt?.slice(0, 10) ?? null,
    sourceOrganization:
      m.sourceOrganization?.trim() || m.channelName?.trim() || "Official vendor",
    relevanceNote,
  };
}

export function selectIndustryPageVideos(
  pool: ProductMedia[],
  ctx: IndustryPageMediaContext,
  options?: { limit?: number; allowGeneralFallback?: boolean },
): ProductMedia[] {
  const limit = options?.limit ?? 4;
  const allowGeneral = options?.allowGeneralFallback !== false;

  const ranked = pool
    .map((media) => {
      const enriched = enrichMediaFromSourceUrl(media);
      if (!isMediaActivePublicDisplay(enriched)) return null;
      if (!isVideoPublicEligible(enriched).eligible) return null;
      if (enriched.type === "softwareglimpse-video") return null;
      if (isLikelyBrandPromo(enriched) && !enriched.industryIds.includes(ctx.industrySlug)) {
        return null;
      }
      // Never show Financial Services Cloud (etc.) on unrelated industry hubs.
      if (isWrongIndustryPageMedia(enriched, ctx.industrySlug)) {
        return null;
      }
      const kind = resolveIndustryMediaContext(enriched);
      // Customer stories belong in Real-world examples — not primary see-in-action.
      if (
        kind === "customer-case-study" ||
        enriched.type === "official-customer-case-study"
      ) {
        return null;
      }
      // Weak industry relevance must not surface prominently.
      if (enriched.industryRelevance === "weak") {
        return null;
      }
      if (
        ctx.requireIndustryRelevance &&
        !allowGeneral &&
        kind === "general-workflow" &&
        !enriched.industryIds.includes(ctx.industrySlug)
      ) {
        return null;
      }
      const score = scoreIndustryPageMedia(enriched, ctx);
      if (score < 8 && kind === "general-workflow") return null;
      return { media: enriched, score };
    })
    .filter((row): row is { media: ProductMedia; score: number } => row != null)
    .sort(
      (a, b) =>
        b.score - a.score || a.media.id.localeCompare(b.media.id),
    );

  const out: ProductMedia[] = [];
  const seen = new Set<string>();
  for (const row of ranked) {
    if (seen.has(row.media.id)) continue;
    seen.add(row.media.id);
    out.push(row.media);
    if (out.length >= limit) break;
  }
  return out;
}

export function selectIndustrySeeInActionCards(input: {
  mediaPool: ProductMedia[];
  products: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
  ctx: IndustryPageMediaContext;
  workflowSteps?: Array<{ id: string; label: string }>;
  capabilityLabels?: Record<string, string>;
  useCaseLabels?: Record<string, string>;
  limit?: number;
}): IndustrySeeInActionCard[] {
  const limit = input.limit ?? 4;
  const cards: IndustrySeeInActionCard[] = [];
  const usedMedia = new Set<string>();

  // Prefer one strong card per product, industry-specific first
  for (const product of input.products) {
    if (cards.length >= limit) break;
    const selected = selectIndustryPageVideos(
      input.mediaPool.filter((m) => m.productSlug === product.slug),
      { ...input.ctx, productSlug: product.slug, requireIndustryRelevance: true },
      { limit: 1, allowGeneralFallback: true },
    );
    const media = selected[0];
    if (!media || usedMedia.has(media.id)) continue;
    usedMedia.add(media.id);
    cards.push(
      buildCard({
        media,
        productName: product.name,
        logo: product.logo,
        ctx: { ...input.ctx, productSlug: product.slug },
        workflowSteps: input.workflowSteps,
        capabilityLabels: input.capabilityLabels,
        useCaseLabels: input.useCaseLabels,
      }),
    );
  }

  // Fill remaining slots from highest-scored leftover media
  if (cards.length < limit) {
    const more = selectIndustryPageVideos(input.mediaPool, input.ctx, {
      limit: limit + 4,
      allowGeneralFallback: true,
    });
    for (const media of more) {
      if (cards.length >= limit) break;
      if (usedMedia.has(media.id)) continue;
      const product = input.products.find((p) => p.slug === media.productSlug);
      if (!product) continue;
      usedMedia.add(media.id);
      cards.push(
        buildCard({
          media,
          productName: product.name,
          logo: product.logo,
          ctx: { ...input.ctx, productSlug: product.slug },
          workflowSteps: input.workflowSteps,
          capabilityLabels: input.capabilityLabels,
          useCaseLabels: input.useCaseLabels,
        }),
      );
    }
  }

  return cards;
}

export function buildIndustryWorkflowStepCoverage(
  media: ProductMedia,
  steps: Array<{ id: string; label: string }>,
): Array<{ id: string; label: string; status: "demonstrated" | "not-shown" }> {
  const demonstrated = new Set(
    media.workflowStageIds.map((id) => id.toLowerCase()),
  );
  return steps.map((step) => {
    const id = step.id.toLowerCase();
    const labelSlug = step.label.toLowerCase().replace(/\s+/g, "-");
    const shown = demonstrated.has(id) || demonstrated.has(labelSlug);
    return {
      id: step.id,
      label: step.label,
      status: shown ? "demonstrated" : "not-shown",
    };
  });
}

/** Informational counts for sidebar — never used in rankings. */
export function countIndustryVisualEvidence(cards: IndustrySeeInActionCard[]): {
  industrySpecificDemos: number;
  generalWorkflowDemos: number;
  customerCaseStudies: number;
} {
  return {
    industrySpecificDemos: cards.filter(
      (c) =>
        c.contextKind === "industry-specific" ||
        c.contextKind === "industry-edition",
    ).length,
    generalWorkflowDemos: cards.filter(
      (c) => c.contextKind === "general-workflow",
    ).length,
    customerCaseStudies: cards.filter(
      (c) => c.contextKind === "customer-case-study",
    ).length,
  };
}
