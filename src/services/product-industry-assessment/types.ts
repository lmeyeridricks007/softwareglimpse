import type { ProductMedia } from "@/domain";
import type { IndustrySeeInActionCard } from "@/services/product-media/industry-page-media";

/** Research state for product × industry — never derived from video count. */
export type IndustryProductFitLabel =
  | "Strong"
  | "Good"
  | "Partial"
  | "Limited"
  | "Emerging"
  | "Unknown";

export type IndustryProductEvidenceConfidence =
  | "High"
  | "Medium"
  | "Low"
  | "Unknown";

export type ProductIndustryLinkedItem = {
  id: string;
  label: string;
  href: string | null;
};

export type ProductIndustryDemoBlock = {
  media: ProductMedia;
  title: string;
  /** Exact edition name when industry-edition, else product demo title. */
  displayProductName: string;
  contextKind:
    | "industry-specific"
    | "industry-edition"
    | "general-workflow"
    | "customer-case-study";
  /** Visible badge — never implies industry-specific for general demos. */
  contextLabel: string;
  /** e.g. "Financial-services sales workflow" for general demos. */
  relevantTo: string | null;
  /** Base CRM product when edition differs. */
  baseProductName: string | null;
  whatItShows: string[];
  limitations: string[];
  sourceOrganization: string;
  sourceUrl: string;
  verifiedAt: string | null;
};

/**
 * Structured SoftwareGlimpse assessment of a product for an industry.
 * Video is optional supplementary evidence only.
 */
export type ProductIndustryAssessment = {
  productSlug: string;
  productName: string;
  /** Heading product name — may be industry edition label. */
  displayTitle: string;
  logo?: { src: string; alt: string } | null;
  industrySlug: string;
  industryLabel: string;
  fitLabel: IndustryProductFitLabel;
  /** Short researched-state note (e.g. "verified", "partial evidence"). */
  researchStateLabel: string;
  bestAlignedUseCases: ProductIndustryLinkedItem[];
  relevantCapabilities: ProductIndustryLinkedItem[];
  relevantRequirements: ProductIndustryLinkedItem[];
  evidenceConfidence: IndustryProductEvidenceConfidence;
  evidenceSummary: string;
  /** Feature / doc / screenshot density — excludes video-only. */
  nonVideoEvidenceCount: number;
  demo: ProductIndustryDemoBlock | null;
  reviewHref: string;
  compareHref: string;
  evidenceHref: string;
  methodologyNote: string;
};

export type BuildProductIndustryAssessmentInput = {
  productSlug: string;
  productName: string;
  logo?: { src: string; alt: string } | null;
  industrySlug: string;
  industryLabel: string;
  positioning?: string | null;
  bestFor?: string | null;
  overallScore?: number | null;
  reviewHref: string;
  compareHref: string;
  evidenceHref?: string;
  useCases: ProductIndustryLinkedItem[];
  capabilities: ProductIndustryLinkedItem[];
  requirements: ProductIndustryLinkedItem[];
  /** Prefer see-in-industry card for this product when present. */
  mediaCard?: IndustrySeeInActionCard | null;
  featureEvidenceCount?: number;
  screenshotCount?: number;
  documentationHintCount?: number;
};
