import {
  industryMediaContextLabel,
  resolveIndustryMediaContext,
  type IndustrySeeInActionCard,
} from "@/services/product-media/industry-page-media";
import type {
  BuildProductIndustryAssessmentInput,
  IndustryProductEvidenceConfidence,
  IndustryProductFitLabel,
  ProductIndustryAssessment,
  ProductIndustryDemoBlock,
} from "./types";

function scoreToFitLabel(score: number | null | undefined): IndustryProductFitLabel {
  if (score == null || Number.isNaN(score)) return "Unknown";
  if (score >= 8.5) return "Strong";
  if (score >= 7.5) return "Good";
  if (score >= 6.5) return "Partial";
  if (score >= 5) return "Limited";
  return "Emerging";
}

function evidenceConfidence(input: {
  featureEvidenceCount: number;
  screenshotCount: number;
  documentationHintCount: number;
  hasLinks: boolean;
}): IndustryProductEvidenceConfidence {
  const total =
    input.featureEvidenceCount +
    input.screenshotCount +
    input.documentationHintCount +
    (input.hasLinks ? 1 : 0);
  if (total >= 8) return "High";
  if (total >= 4) return "Medium";
  if (total >= 1) return "Low";
  return "Unknown";
}

function recommendationCoverageLabel(
  fit: IndustryProductFitLabel,
  confidence: IndustryProductEvidenceConfidence,
): string {
  if (fit === "Unknown" && confidence === "Unknown") {
    return "Insufficient evidence";
  }
  if (confidence === "Low" || fit === "Emerging") {
    return "Emerging coverage";
  }
  if (confidence === "High" && (fit === "Strong" || fit === "Good")) {
    return "Recommended";
  }
  return "Under review";
}

function buildDemoBlock(
  card: IndustrySeeInActionCard,
  industryLabel: string,
  baseProductName: string,
): ProductIndustryDemoBlock {
  const kind = card.contextKind ?? resolveIndustryMediaContext(card.media);
  const edition = card.industryEditionLabel?.trim() || null;
  const isGeneral = kind === "general-workflow";
  const isEdition = kind === "industry-edition" || Boolean(edition);

  let contextLabel: string;
  if (isGeneral) {
    contextLabel = "General product demo";
  } else if (isEdition) {
    contextLabel = "Industry edition official demo";
  } else if (kind === "customer-case-study") {
    contextLabel = "VENDOR-PUBLISHED CUSTOMER STORY";
  } else {
    contextLabel = industryMediaContextLabel(kind);
  }

  return {
    media: card.media,
    title: card.title,
    displayProductName: edition ?? card.productName,
    contextKind: kind,
    contextLabel,
    relevantTo: isGeneral
      ? `${industryLabel} sales / relationship workflow`
      : null,
    baseProductName: edition && edition !== baseProductName ? baseProductName : null,
    whatItShows:
      card.whatThisShows.length > 0
        ? card.whatThisShows
        : card.industryContext,
    limitations: card.whatNotEstablished,
    sourceOrganization: card.sourceOrganization,
    sourceUrl: card.media.sourceUrl,
    verifiedAt: card.verifiedAt,
  };
}

/**
 * Build one Product × Industry assessment.
 * Fit and confidence use structured research — never video presence.
 */
export function buildProductIndustryAssessment(
  input: BuildProductIndustryAssessmentInput,
): ProductIndustryAssessment {
  const featureEvidenceCount = input.featureEvidenceCount ?? 0;
  const screenshotCount = input.screenshotCount ?? 0;
  const documentationHintCount = input.documentationHintCount ?? 0;
  const hasLinks =
    input.useCases.length +
      input.capabilities.length +
      input.requirements.length >
    0;

  const confidence = evidenceConfidence({
    featureEvidenceCount,
    screenshotCount,
    documentationHintCount,
    hasLinks,
  });

  let fitLabel = scoreToFitLabel(input.overallScore ?? null);
  // Partial research without score: surface as Unknown/Partial from evidence density
  if (fitLabel === "Unknown") {
    if (featureEvidenceCount >= 4) fitLabel = "Good";
    else if (featureEvidenceCount >= 2) fitLabel = "Partial";
    else if (featureEvidenceCount >= 1 || screenshotCount > 0) {
      fitLabel = "Emerging";
    }
  }

  const demo = input.mediaCard
    ? buildDemoBlock(input.mediaCard, input.industryLabel, input.productName)
    : null;

  const editionName = demo?.displayProductName;
  const displayTitle =
    demo?.contextKind === "industry-edition" && editionName
      ? `${editionName}`
      : input.productName;

  const nonVideoEvidenceCount =
    featureEvidenceCount + screenshotCount + documentationHintCount;

  return {
    productSlug: input.productSlug,
    productName: input.productName,
    displayTitle,
    logo: input.logo ?? null,
    industrySlug: input.industrySlug,
    industryLabel: input.industryLabel,
    fitLabel,
    researchStateLabel: recommendationCoverageLabel(fitLabel, confidence),
    bestAlignedUseCases: input.useCases,
    relevantCapabilities: input.capabilities,
    relevantRequirements: input.requirements,
    evidenceConfidence: confidence,
    evidenceSummary:
      nonVideoEvidenceCount > 0
        ? `${nonVideoEvidenceCount} evidence items backing this recommendation (features, screenshots, or documentation). Official video is optional context and does not change fit.`
        : "Limited evidence for this industry context yet. Treat this as a provisional recommendation until more coverage is available.",
    nonVideoEvidenceCount,
    demo,
    reviewHref: input.reviewHref,
    compareHref: input.compareHref,
    evidenceHref: input.evidenceHref ?? "#industry-evidence",
    methodologyNote:
      "Industry fit reflects SoftwareGlimpse recommendations on use cases, capabilities, requirements, and product evidence. Official demos illustrate workflow context only — they do not determine rankings, compliance, or pricing.",
  };
}

/**
 * Select key products for Product × Industry modules.
 * Prefers products with stronger evidence; video is not required for inclusion.
 */
export function selectProductIndustryAssessmentTargets(input: {
  products: Array<{
    slug: string;
    name: string;
    overallScore?: number | null;
    featureEvidenceCount?: number;
  }>;
  mediaByProduct: Map<string, IndustrySeeInActionCard[]>;
  limit?: number;
}): string[] {
  const limit = input.limit ?? 3;
  const ranked = [...input.products].sort((a, b) => {
    const aEvidence = a.featureEvidenceCount ?? 0;
    const bEvidence = b.featureEvidenceCount ?? 0;
    if (bEvidence !== aEvidence) return bEvidence - aEvidence;
    const aScore = a.overallScore ?? 0;
    const bScore = b.overallScore ?? 0;
    if (bScore !== aScore) return bScore - aScore;
    // Prefer products with industry media only as a soft tie-break for display variety
    const aMedia = input.mediaByProduct.has(a.slug) ? 1 : 0;
    const bMedia = input.mediaByProduct.has(b.slug) ? 1 : 0;
    if (bMedia !== aMedia) return bMedia - aMedia;
    return a.name.localeCompare(b.name);
  });
  return ranked.slice(0, limit).map((p) => p.slug);
}
