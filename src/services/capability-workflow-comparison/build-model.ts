import type { ProductMedia } from "@/domain";
import { mediaWhatThisShows } from "@/domain";
import { resolveFeatureDetailHref } from "@/data/feature-detail";
import { getAllComparisonsUnfiltered, getSoftwareBySlug } from "@/data";
import { isPubliclyAvailable } from "@/domain/publishing";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import {
  selectCapabilityDeepDiveVideo,
  type CapabilityPageMediaContext,
} from "@/services/product-media/capability-page-media";
import { enrichMediaFromSourceUrl } from "@/services/product-media";

export type WorkflowComparisonStep = {
  id: string;
  label: string;
  detail?: string;
};

export type WorkflowStepEvidenceStatus =
  | "visible"
  | "partial"
  | "screenshot"
  | "not-shown";

export type WorkflowStepCell = {
  stepId: string;
  status: WorkflowStepEvidenceStatus;
  /** Short evidence-backed note — never invented brand philosophy. */
  note: string | null;
};

export type WorkflowComparisonMedia =
  | {
      kind: "video";
      media: ProductMedia;
      thumbnailUrl: string | null;
      title: string;
      sourceUrl: string;
    }
  | {
      kind: "screenshot";
      src: string;
      alt: string;
      caption: string | null;
      sourceUrl: string | null;
    }
  | { kind: "none" };

export type WorkflowComparisonProductColumn = {
  productSlug: string;
  productName: string;
  logo?: { src: string; alt: string } | null;
  fitLabel: string | null;
  media: WorkflowComparisonMedia;
  /** Evidence-backed emphasis bullets from whatThisShows / captions. */
  emphasizes: string[];
  stepCells: WorkflowStepCell[];
  reviewHref: string;
};

export type WorkflowComparisonDeepLink = {
  href: string;
  label: string;
};

export type CapabilityWorkflowComparisonModel = {
  capabilityId: string;
  capabilityName: string;
  heading: string;
  supporting: string;
  steps: WorkflowComparisonStep[];
  products: WorkflowComparisonProductColumn[];
  /** SoftwareGlimpse take — only when ≥2 products with some evidence. */
  interpretation: string | null;
  deepLinks: WorkflowComparisonDeepLink[];
  evidenceHref: string;
};

export type BuildCapabilityWorkflowComparisonInput = {
  capabilityId: string;
  capabilityName: string;
  productIds: string[];
  workflowSteps: WorkflowComparisonStep[];
  mediaPool: ProductMedia[];
  screenshots?: Array<{
    productSlug: string;
    src: string;
    alt: string;
    caption?: string;
    source?: string;
  }>;
  /** Optional fit labels from ProductCapabilityAssessment / editorial. */
  assessments?: Array<{
    productSlug: string;
    fitLabel?: string | null;
  }>;
  mediaCtx: Omit<CapabilityPageMediaContext, "productSlug">;
  /** Feature / capability routes to surface when published. */
  relatedFeatureSlugs?: string[];
  relatedCapabilityHrefs?: Array<{ href: string; label: string }>;
  evidenceHref?: string;
  limitProducts?: number;
};

/** Keywords that map workflow step ids/labels to evidence text / feature ids. */
const STEP_EVIDENCE_KEYWORDS: Record<string, string[]> = {
  configure: ["pipeline", "stage", "board", "configure", "setup", "kanban"],
  create: ["opportunity", "deal", "create", "capture", "lead"],
  advance: ["stage", "movement", "drag", "progress", "advance", "move"],
  trigger: ["automation", "workflow", "trigger", "rule"],
  close: ["close", "won", "lost", "forecast", "report", "insight"],
  pipeline: ["pipeline", "board", "kanban", "stage"],
  activities: ["activit", "task", "follow-up", "next action"],
  automation: ["automation", "workflow", "trigger", "rule"],
  reporting: ["report", "forecast", "insight", "dashboard", "analytics"],
  capture: ["capture", "contact", "lead", "form"],
  enrich: ["enrich", "field", "company"],
  sync: ["sync", "email", "calendar"],
  maintain: ["maintain", "update", "merge"],
  handoff: ["handoff", "owner", "assign"],
};

function keywordsForStep(step: WorkflowComparisonStep): string[] {
  const fromId = STEP_EVIDENCE_KEYWORDS[step.id] ?? [];
  const labelKey = step.label.toLowerCase().replace(/\s+/g, "-");
  const fromLabel = STEP_EVIDENCE_KEYWORDS[labelKey] ?? [
    ...step.label.toLowerCase().split(/\s+/).filter((w) => w.length > 3),
  ];
  return [...new Set([...fromId, ...fromLabel])];
}

function evidenceBlob(input: {
  media: ProductMedia | null;
  screenshotCaption?: string | null;
}): string {
  const parts: string[] = [];
  if (input.media) {
    parts.push(
      ...mediaWhatThisShows(input.media),
      ...(input.media.whatToNotice ?? []),
      input.media.demonstratesCaption ?? "",
      input.media.title,
      ...input.media.featureIds,
    );
  }
  if (input.screenshotCaption) parts.push(input.screenshotCaption);
  return parts.join(" ").toLowerCase();
}

function classifyStep(
  step: WorkflowComparisonStep,
  blob: string,
  hasScreenshotOnly: boolean,
): WorkflowStepCell {
  const keys = keywordsForStep(step);
  if (!blob.trim() && !hasScreenshotOnly) {
    return { stepId: step.id, status: "not-shown", note: null };
  }
  const hits = keys.filter((k) => blob.includes(k.toLowerCase()));
  if (hits.length >= 2) {
    return {
      stepId: step.id,
      status: "visible",
      note: "Visible in official demo evidence",
    };
  }
  if (hits.length === 1) {
    return {
      stepId: step.id,
      status: "partial",
      note: "Partially indicated in evidence",
    };
  }
  if (hasScreenshotOnly) {
    return {
      stepId: step.id,
      status: "screenshot",
      note: "Screenshot evidence available",
    };
  }
  return { stepId: step.id, status: "not-shown", note: null };
}

function resolveCompareHref(a: string, b: string): string | null {
  const match = getAllComparisonsUnfiltered().find(
    (c) =>
      c.productSlugs.includes(a) &&
      c.productSlugs.includes(b) &&
      (isPubliclyAvailable(c.metadata) ||
        c.outcomes.length > 0 ||
        c.metadata.researchStatus !== "none"),
  );
  if (match) return `/compare/${match.slug}/`;
  return `/compare/build/?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`;
}

function featureLabel(slug: string): string {
  return (
    canonicalFeaturesSeed.find((f) => f.slug === slug)?.name ??
    slug
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ")
  );
}

/**
 * Build a comparative workflow demonstration model for Capability pages.
 * Evidence-backed only — never invents design philosophy from branding.
 * One representative video (or screenshot fallback) per product.
 */
export function buildCapabilityWorkflowComparison(
  input: BuildCapabilityWorkflowComparisonInput,
): CapabilityWorkflowComparisonModel | null {
  const limit = input.limitProducts ?? 2;
  const steps = input.workflowSteps.slice(0, 8);
  if (steps.length === 0 || input.productIds.length === 0) return null;

  const assessmentBySlug = new Map(
    (input.assessments ?? []).map((a) => [a.productSlug, a.fitLabel ?? null]),
  );

  const columns: WorkflowComparisonProductColumn[] = [];

  for (const productSlug of input.productIds) {
    const software = getSoftwareBySlug(productSlug);
    const productName = software?.name ?? productSlug;
    const video = selectCapabilityDeepDiveVideo(input.mediaPool, {
      ...input.mediaCtx,
      productSlug,
    });

    const shot =
      input.screenshots?.find((s) => s.productSlug === productSlug) ?? null;

    let media: WorkflowComparisonMedia;
    let emphasizes: string[] = [];
    let blob = "";
    let screenshotOnly = false;

    if (video) {
      const enriched = enrichMediaFromSourceUrl(video);
      media = {
        kind: "video",
        media: enriched,
        thumbnailUrl: enriched.thumbnailUrl ?? null,
        title: enriched.title,
        sourceUrl: enriched.sourceUrl,
      };
      emphasizes = mediaWhatThisShows(enriched).slice(0, 4);
      blob = evidenceBlob({ media: enriched });
    } else if (shot) {
      media = {
        kind: "screenshot",
        src: shot.src,
        alt: shot.alt,
        caption: shot.caption ?? null,
        sourceUrl: shot.source ?? null,
      };
      emphasizes = shot.caption ? [shot.caption] : [];
      blob = evidenceBlob({
        media: null,
        screenshotCaption: shot.caption ?? shot.alt,
      });
      screenshotOnly = true;
    } else {
      media = { kind: "none" };
    }

    // Skip products with no visual evidence for this module.
    if (media.kind === "none") continue;

    const stepCells = steps.map((step) =>
      classifyStep(step, blob, screenshotOnly),
    );

    columns.push({
      productSlug,
      productName,
      logo: software?.logo,
      fitLabel: assessmentBySlug.get(productSlug) ?? null,
      media,
      emphasizes,
      stepCells,
      reviewHref: `/software/${productSlug}/`,
    });

    if (columns.length >= limit) break;
  }

  // Prefer filling to 2 when possible by scanning remaining productIds
  // (already handled by loop order). Require at least 1 column; hide if 0.
  if (columns.length === 0) return null;

  const interpretation =
    columns.length >= 2
      ? buildInterpretation(columns, input.capabilityName)
      : null;

  const deepLinks: WorkflowComparisonDeepLink[] = [];
  for (const slug of input.relatedFeatureSlugs ?? []) {
    const href = resolveFeatureDetailHref(slug);
    if (!href) continue;
    deepLinks.push({
      href,
      label: `Explore ${featureLabel(slug)} →`,
    });
  }
  for (const link of input.relatedCapabilityHrefs ?? []) {
    deepLinks.push(link);
  }
  if (columns.length >= 2) {
    const href = resolveCompareHref(
      columns[0]!.productSlug,
      columns[1]!.productSlug,
    );
    if (href) {
      deepLinks.push({
        href,
        label: `Compare ${columns[0]!.productName} vs ${columns[1]!.productName} →`,
      });
    }
  }

  // Dedupe deep links by href
  const seenHref = new Set<string>();
  const uniqueLinks = deepLinks.filter((l) => {
    if (seenHref.has(l.href)) return false;
    seenHref.add(l.href);
    return true;
  });

  return {
    capabilityId: input.capabilityId,
    capabilityName: input.capabilityName,
    heading: `How products approach ${input.capabilityName.toLowerCase()}`,
    supporting:
      "Evidence-backed workflow comparison using official vendor demos and screenshots — not a ranking or entertainment gallery. Absence of media does not mean a product lacks the capability.",
    steps,
    products: columns,
    interpretation,
    deepLinks: uniqueLinks.slice(0, 6),
    evidenceHref: input.evidenceHref ?? "#capability-evidence",
  };
}

function buildInterpretation(
  columns: WorkflowComparisonProductColumn[],
  capabilityName: string,
): string | null {
  const [a, b] = columns;
  if (!a || !b) return null;
  const aFocus = a.emphasizes[0];
  const bFocus = b.emphasizes[0];
  if (!aFocus && !bFocus) {
    return `${a.productName} and ${b.productName} both have visual evidence for ${capabilityName.toLowerCase()}. Compare what is actually shown in each source — video availability does not change capability assessments.`;
  }
  const parts: string[] = [];
  if (aFocus) {
    parts.push(`${a.productName} evidence emphasizes ${aFocus}`);
  }
  if (bFocus) {
    parts.push(`${b.productName} evidence emphasizes ${bFocus}`);
  }
  return `${parts.join("; ")}. These are observations from official sources, not inferred brand philosophy.`;
}
