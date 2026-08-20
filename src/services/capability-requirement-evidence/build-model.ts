import type { ProductMedia } from "@/domain";
import {
  mediaLimitations,
  mediaWhatThisShows,
  isOfficialVendorMedia,
} from "@/domain";
import {
  enrichMediaFromSourceUrl,
  isVideoPublicEligible,
} from "@/services/product-media";
import { isMediaActivePublicDisplay } from "@/services/product-media/governance";
import { capabilityMediaAliases } from "@/services/product-media/capability-page-media";
import type { EvidenceCell } from "@/services/industry-hub";
import type { CapabilityFitLabel } from "@/services/industry-capability";

export type CapabilityRequirementRef = {
  id: string;
  name: string;
  description?: string;
  priority?: "core" | "advanced" | "optional";
  featureSlug?: string;
  requirementSlug?: string;
  href?: string;
};

export type RequirementEvidenceMediaItem = {
  id: string;
  kind: "official-video" | "screenshot" | "documentation";
  title: string;
  productSlug: string;
  /** Canonical relationship path used for this attachment. */
  linkedVia: Array<"capability" | "requirement" | "feature">;
  demonstrates: string[];
  doesNotEstablish: string[];
  sourceUrl: string | null;
  verifiedAt: string | null;
  media: ProductMedia | null;
  screenshotSrc: string | null;
  screenshotAlt: string | null;
};

export type RequirementProductEvidence = {
  productSlug: string;
  productName: string;
  logo?: { src: string; alt: string } | null;
  /** Feature-cell / assessment label for this requirement — not media quantity. */
  supportLabel: CapabilityFitLabel | "Supported" | "Partial" | "Not evidenced" | "Unknown";
  supportCell: EvidenceCell;
  documentationCount: number;
  screenshotCount: number;
  officialVideoCount: number;
  /** Deduped evidence records (one video = one item even if multi-linked). */
  items: RequirementEvidenceMediaItem[];
  reviewHref: string;
};

export type CapabilityRequirementEvidenceRow = {
  requirementId: string;
  requirementName: string;
  description: string;
  priority: "core" | "advanced" | "optional";
  featureSlug: string | null;
  requirementSlug: string | null;
  href: string | null;
  /** Trace: Capability → Requirement → Feature */
  trace: {
    capabilityId: string;
    requirementId: string;
    requirementSlug: string | null;
    featureSlug: string | null;
  };
  products: RequirementProductEvidence[];
};

export type CapabilityRequirementEvidenceModel = {
  capabilityId: string;
  capabilityName: string;
  rows: CapabilityRequirementEvidenceRow[];
};

function cellToSupportLabel(
  cell: EvidenceCell,
  fitLabel?: CapabilityFitLabel,
): RequirementProductEvidence["supportLabel"] {
  // Prefer capability fit when the product has an assessed fit on this page.
  if (fitLabel && fitLabel !== "Unknown") return fitLabel;
  if (cell === "supported") return "Supported";
  if (cell === "partial") return "Partial";
  if (cell === "not-supported") return "Not evidenced";
  return "Unknown";
}

/**
 * Whether a ResearchMedia record can attach to this requirement under the capability.
 * Uses canonical IDs only — capability / requirement / feature.
 * Cross-capability tagged media cannot leak via shared features.
 */
export function mediaMatchesCapabilityRequirement(
  media: ProductMedia,
  input: {
    capabilityId: string;
    capabilityAliases?: string[];
    requirementSlug?: string | null;
    featureSlug?: string | null;
  },
): { matches: boolean; linkedVia: Array<"capability" | "requirement" | "feature"> } {
  const m = enrichMediaFromSourceUrl(media);
  const aliases = new Set([
    input.capabilityId,
    ...(input.capabilityAliases ?? capabilityMediaAliases(input.capabilityId)),
  ]);
  const linkedVia: Array<"capability" | "requirement" | "feature"> = [];

  const capabilityHit = m.capabilityIds.some((id) => aliases.has(id));
  if (m.capabilityIds.length > 0 && !capabilityHit) {
    // Explicitly tagged to other capabilities — do not attach via feature alone.
    // Still allow direct requirementSlug match (multi-capability videos).
    if (
      input.requirementSlug &&
      m.requirementIds.includes(input.requirementSlug)
    ) {
      return { matches: true, linkedVia: ["requirement"] };
    }
    return { matches: false, linkedVia: [] };
  }

  if (capabilityHit) linkedVia.push("capability");

  if (
    input.requirementSlug &&
    m.requirementIds.includes(input.requirementSlug)
  ) {
    linkedVia.push("requirement");
  }

  if (input.featureSlug && m.featureIds.includes(input.featureSlug)) {
    linkedVia.push("feature");
  }

  // Must have at least one relationship edge.
  if (linkedVia.length === 0) return { matches: false, linkedVia: [] };

  // Prefer requirement or feature linkage for requirement drawers.
  // Capability-only attachment is allowed when media is capability-scoped
  // and the requirement has no finer ids — otherwise require req or feature hit.
  if (
    !linkedVia.includes("requirement") &&
    !linkedVia.includes("feature") &&
    (input.requirementSlug || input.featureSlug)
  ) {
    return { matches: false, linkedVia: [] };
  }

  return { matches: true, linkedVia };
}

function toVideoItem(
  media: ProductMedia,
  linkedVia: Array<"capability" | "requirement" | "feature">,
): RequirementEvidenceMediaItem {
  const enriched = enrichMediaFromSourceUrl(media);
  return {
    id: `video:${enriched.id}`,
    kind: "official-video",
    title: enriched.title,
    productSlug: enriched.productSlug,
    linkedVia,
    demonstrates: mediaWhatThisShows(enriched),
    doesNotEstablish: mediaLimitations(enriched),
    sourceUrl: enriched.sourceUrl,
    verifiedAt: enriched.verifiedAt?.slice(0, 10) ?? null,
    media: enriched,
    screenshotSrc: null,
    screenshotAlt: null,
  };
}

/**
 * Build per-requirement × product evidence for a Capability Detail page.
 * Dedupes media by canonical ResearchMedia id — one video stays one evidence record.
 */
export function buildCapabilityRequirementEvidence(input: {
  capabilityId: string;
  capabilityName: string;
  requirements: CapabilityRequirementRef[];
  products: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
    cells: Record<string, EvidenceCell>;
    reviewHref: string;
    /** Capability-level fit from scorecard (not media-derived). */
    fitLabel?: CapabilityFitLabel;
    /** Optional featureSupport source counts by featureSlug. */
    documentationByFeature?: Record<string, number>;
  }>;
  mediaPool: ProductMedia[];
  screenshots?: Array<{
    id: string;
    productSlug: string;
    src: string;
    alt: string;
    caption?: string;
    source?: string;
    checkedAt?: string;
    /** Optional feature/requirement association when known. */
    featureSlug?: string;
    requirementSlug?: string;
  }>;
}): CapabilityRequirementEvidenceModel {
  const aliases = capabilityMediaAliases(input.capabilityId);
  const eligibleVideos = input.mediaPool
    .map(enrichMediaFromSourceUrl)
    .filter((m) => isOfficialVendorMedia(m))
    .filter((m) => isVideoPublicEligible(m).eligible)
    .filter((m) => isMediaActivePublicDisplay(m));

  const rows: CapabilityRequirementEvidenceRow[] = input.requirements.map(
    (req) => {
      const products: RequirementProductEvidence[] = input.products.map(
        (product) => {
          const cellKey = req.featureSlug ?? input.capabilityId;
          const cell = product.cells[cellKey] ?? "unknown";

          const itemsById = new Map<string, RequirementEvidenceMediaItem>();

          for (const media of eligibleVideos) {
            if (media.productSlug !== product.slug) continue;
            const match = mediaMatchesCapabilityRequirement(media, {
              capabilityId: input.capabilityId,
              capabilityAliases: aliases,
              requirementSlug: req.requirementSlug,
              featureSlug: req.featureSlug,
            });
            if (!match.matches) continue;
            const item = toVideoItem(media, match.linkedVia);
            // Deduplicate: same ResearchMedia id → one evidence item.
            if (!itemsById.has(item.id)) {
              itemsById.set(item.id, item);
            } else {
              const existing = itemsById.get(item.id)!;
              existing.linkedVia = [
                ...new Set([...existing.linkedVia, ...match.linkedVia]),
              ];
            }
          }

          const shots = (input.screenshots ?? []).filter((s) => {
            if (s.productSlug !== product.slug) return false;
            if (
              req.requirementSlug &&
              s.requirementSlug === req.requirementSlug
            ) {
              return true;
            }
            if (req.featureSlug && s.featureSlug === req.featureSlug) {
              return true;
            }
            // Capability-page screenshots without finer tags: include only when
            // requirement has no requirementSlug/featureSlug specificity conflict.
            // Prefer tagged shots; untagged capability shots count once at capability level
            // via featureSlug match on caption is too fuzzy — skip untagged here.
            return false;
          });

          for (const shot of shots) {
            const id = `shot:${shot.productSlug}:${shot.id}`;
            if (itemsById.has(id)) continue;
            itemsById.set(id, {
              id,
              kind: "screenshot",
              title: shot.caption || shot.alt,
              productSlug: shot.productSlug,
              linkedVia: shot.requirementSlug
                ? ["requirement"]
                : shot.featureSlug
                  ? ["feature"]
                  : ["capability"],
              demonstrates: shot.caption ? [shot.caption] : [shot.alt],
              doesNotEstablish: [
                "plan limits",
                "comparative superiority",
                "security certification",
              ],
              sourceUrl: shot.source ?? null,
              verifiedAt: shot.checkedAt?.slice(0, 10) ?? null,
              media: null,
              screenshotSrc: shot.src,
              screenshotAlt: shot.alt,
            });
          }

          const items = [...itemsById.values()];
          const documentationCount =
            (req.featureSlug &&
              product.documentationByFeature?.[req.featureSlug]) ||
            0;

          // Untagged capability screenshots for this product still contribute
          // to the display count when the requirement maps to a feature that
          // appears in the capability matrix — counted separately without
          // inventing screenshot↔requirement links.
          const untaggedProductShots = (input.screenshots ?? []).filter(
            (s) =>
              s.productSlug === product.slug &&
              !s.featureSlug &&
              !s.requirementSlug,
          );
          const screenshotCount =
            items.filter((i) => i.kind === "screenshot").length ||
            (req.featureSlug ? untaggedProductShots.length : 0);

          return {
            productSlug: product.slug,
            productName: product.name,
            logo: product.logo,
            supportLabel: cellToSupportLabel(cell, product.fitLabel),
            supportCell: cell,
            documentationCount,
            screenshotCount,
            officialVideoCount: items.filter((i) => i.kind === "official-video")
              .length,
            items,
            reviewHref: product.reviewHref,
          };
        },
      );

      return {
        requirementId: req.id,
        requirementName: req.name,
        description: req.description ?? "",
        priority: req.priority ?? "core",
        featureSlug: req.featureSlug ?? null,
        requirementSlug: req.requirementSlug ?? null,
        href: req.href ?? null,
        trace: {
          capabilityId: input.capabilityId,
          requirementId: req.id,
          requirementSlug: req.requirementSlug ?? null,
          featureSlug: req.featureSlug ?? null,
        },
        products,
      };
    },
  );

  return {
    capabilityId: input.capabilityId,
    capabilityName: input.capabilityName,
    rows,
  };
}

/** Flatten unique video evidence across all requirements for a product (no double count). */
export function uniqueVideosForProduct(
  model: CapabilityRequirementEvidenceModel,
  productSlug: string,
): RequirementEvidenceMediaItem[] {
  const byId = new Map<string, RequirementEvidenceMediaItem>();
  for (const row of model.rows) {
    const product = row.products.find((p) => p.productSlug === productSlug);
    if (!product) continue;
    for (const item of product.items) {
      if (item.kind !== "official-video") continue;
      if (!byId.has(item.id)) byId.set(item.id, item);
    }
  }
  return [...byId.values()];
}
