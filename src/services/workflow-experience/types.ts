/**
 * Generic workflow experience types — category-agnostic (CRM, ERP, HR, etc.).
 * Display/structure only; product support values must come from structured research.
 */

export type WorkflowLinkPriority = "must" | "important" | "optional";

export type WorkflowLink = {
  id: string;
  label: string;
  href?: string | null;
  priority?: WorkflowLinkPriority;
};

export type WorkflowSupportStatus =
  "supported" | "partial" | "not-supported" | "unknown";

export type WorkflowStepMediaCue = {
  productSlug: string;
  productName: string;
  /** Short CTA label, e.g. "See assignment in HubSpot". */
  ctaLabel: string;
  mediaId: string;
  title: string;
  demonstrates: string[];
  doesNotEstablish: string[];
  sourceUrl: string;
  sourceOrganization: string;
  /**
   * Optional industry / workflow media classification for badges.
   * e.g. "Industry-specific" vs "General CRM workflow relevant here"
   */
  contextLabel?: string | null;
  contextKind?:
    | "industry-specific"
    | "industry-edition"
    | "general-workflow"
    | "customer-case-study"
    | null;
  /** Lazy OfficialProductVideo payload — opened in drawer, never inline iframe. */
  media: import("@/domain").ProductMedia;
};

export type WorkflowExperienceStep = {
  id: string;
  label: string;
  detail: string;
  goal?: string | null;
  /** Concrete operational actions for this step. */
  activities: string[];
  useCases: WorkflowLink[];
  capabilities: WorkflowLink[];
  requirements: WorkflowLink[];
  features: WorkflowLink[];
  /** Optional media cues for this step (one per product max in UI). */
  mediaCues: WorkflowStepMediaCue[];
  /** Structured product support by productSlug — never inferred from video. */
  productSupport: Record<string, WorkflowSupportStatus>;
};

export type WorkflowProductOption = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
};

export type WorkflowExperienceModel = {
  title: string;
  supporting: string;
  steps: WorkflowExperienceStep[];
  products: WorkflowProductOption[];
  productsHref?: string | null;
  evidenceHref?: string | null;
  /** Optional illustration (not required). */
  visual?: { src: string; alt: string; caption?: string } | null;
};
