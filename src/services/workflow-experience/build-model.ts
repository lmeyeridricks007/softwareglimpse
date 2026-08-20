import type { ProductMedia } from "@/domain";
import { mediaLimitations, mediaWhatThisShows } from "@/domain";
import { loadEnrichment } from "@/data/research/store";
import { resolveFeatureDetailHref } from "@/data/feature-detail";
import { resolveRequirementDetailHref } from "@/data/requirement-detail";
import type {
  WorkflowExperienceModel,
  WorkflowExperienceStep,
  WorkflowLink,
  WorkflowProductOption,
  WorkflowStepMediaCue,
  WorkflowSupportStatus,
} from "./types";

function availabilityToSupport(
  availability: string | undefined,
): WorkflowSupportStatus {
  if (!availability) return "unknown";
  if (availability === "supported") return "supported";
  if (
    availability === "limited" ||
    availability === "add-on" ||
    availability === "higher-plan-only"
  ) {
    return "partial";
  }
  if (availability === "not-supported") return "not-supported";
  return "unknown";
}

/**
 * Resolve structured product support for a step from feature research.
 * Never uses video presence.
 */
export function resolveStepProductSupport(input: {
  featureIds: string[];
  productSlug: string;
}): WorkflowSupportStatus {
  if (input.featureIds.length === 0) return "unknown";
  const enrichment = loadEnrichment(input.productSlug);
  if (!enrichment?.featureSupport?.length) return "unknown";

  const rows = enrichment.featureSupport.filter((f) =>
    input.featureIds.includes(f.featureSlug),
  );
  if (rows.length === 0) return "unknown";

  const statuses = rows.map((r) => availabilityToSupport(r.availability));
  if (statuses.every((s) => s === "supported")) return "supported";
  if (statuses.some((s) => s === "supported" || s === "partial")) {
    return "partial";
  }
  if (statuses.every((s) => s === "not-supported")) return "not-supported";
  return "unknown";
}

function mediaMatchesStep(
  media: ProductMedia,
  stepId: string,
  stepLabel: string,
): boolean {
  const id = stepId.toLowerCase();
  const label = stepLabel.toLowerCase();
  if (media.workflowStageIds.some((s) => s.toLowerCase() === id)) return true;
  if (
    media.workflowStageIds.some(
      (s) => s.toLowerCase() === label.replace(/\s+/g, "-"),
    )
  ) {
    return true;
  }
  const shows = mediaWhatThisShows(media).join(" ").toLowerCase();
  const keywords = [id, label, ...label.split(/\s+/)].filter(
    (k) => k.length > 3,
  );
  return keywords.some((k) => shows.includes(k));
}

/**
 * Build a category-agnostic workflow experience model.
 */
export function buildWorkflowExperienceModel(input: {
  title: string;
  supporting?: string;
  steps: Array<{
    id: string;
    label: string;
    detail: string;
    goal?: string | null;
    activities?: string[];
    useCases?: WorkflowLink[];
    capabilities?: WorkflowLink[];
    requirements?: WorkflowLink[];
    features?: WorkflowLink[];
  }>;
  products: WorkflowProductOption[];
  /** Official videos already selected for this page (strong matches). */
  mediaPool?: ProductMedia[];
  /**
   * Optional per-media context labels (e.g. industry-specific vs general).
   * Keyed by media.id.
   */
  mediaContextById?: Record<
    string,
    {
      contextLabel: string;
      contextKind?: WorkflowStepMediaCue["contextKind"];
    }
  >;
  productsHref?: string | null;
  evidenceHref?: string | null;
  visual?: { src: string; alt: string; caption?: string } | null;
}): WorkflowExperienceModel {
  const mediaPool = input.mediaPool ?? [];

  const steps: WorkflowExperienceStep[] = input.steps.map((step) => {
    const featureIds = (step.features ?? []).map((f) => f.id);
    const productSupport: Record<string, WorkflowSupportStatus> = {};
    for (const product of input.products) {
      productSupport[product.slug] = resolveStepProductSupport({
        featureIds,
        productSlug: product.slug,
      });
    }

    const cuesByProduct = new Map<string, WorkflowStepMediaCue>();
    for (const media of mediaPool) {
      if (!mediaMatchesStep(media, step.id, step.label)) continue;
      if (cuesByProduct.has(media.productSlug)) continue;
      const product = input.products.find((p) => p.slug === media.productSlug);
      const productName =
        product?.name ?? media.sourceOrganization ?? media.productSlug;
      const ctx = input.mediaContextById?.[media.id];
      cuesByProduct.set(media.productSlug, {
        productSlug: media.productSlug,
        productName,
        ctaLabel: `${productName} example`,
        mediaId: media.id,
        title: media.title,
        demonstrates: mediaWhatThisShows(media),
        doesNotEstablish: mediaLimitations(media),
        sourceUrl: media.sourceUrl,
        sourceOrganization:
          media.sourceOrganization?.trim() ||
          media.channelName?.trim() ||
          `Official ${productName}`,
        contextLabel: ctx?.contextLabel ?? null,
        contextKind: ctx?.contextKind ?? null,
        media,
      });
    }

    return {
      id: step.id,
      label: step.label,
      detail: step.detail,
      goal: step.goal ?? step.detail,
      activities: step.activities ?? [],
      useCases: step.useCases ?? [],
      capabilities: step.capabilities ?? [],
      requirements: step.requirements ?? [],
      features: (step.features ?? []).map((f) => ({
        ...f,
        href: f.href ?? resolveFeatureDetailHref(f.id),
      })),
      mediaCues: [...cuesByProduct.values()],
      productSupport,
    };
  });

  return {
    title: input.title,
    supporting:
      input.supporting ??
      "Understand the operating loop before comparing product implementations.",
    steps,
    products: input.products,
    productsHref: input.productsHref,
    evidenceHref: input.evidenceHref,
    visual: input.visual ?? null,
  };
}

/** Normalize optional hub profile step enrichment into WorkflowLink arrays. */
export function normalizeWorkflowLinks(
  items:
    | Array<{
        id: string;
        label: string;
        href?: string | null;
        priority?: "must" | "important" | "optional";
      }>
    | undefined,
): WorkflowLink[] {
  return (items ?? []).map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href ?? null,
    priority: item.priority,
  }));
}

export function requirementHrefOrFallback(
  id: string,
  href?: string | null,
): string | null {
  return href ?? resolveRequirementDetailHref(id);
}
