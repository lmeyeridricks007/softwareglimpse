import type {
  ProductMedia,
  ProductResearchEnrichment,
  ProductScreenshot,
  ResearchSource,
  Software,
} from "@/domain";
import type {
  ExistingMediaCoverageItem,
  StaleMediaFinding,
} from "@/domain/schemas/asset-discovery";
import { evaluateMediaGovernance } from "@/services/product-media/governance";
import { findDuplicateResearchMedia } from "@/services/feature-media-research/duplicates";
import { parseVideoSourceUrl } from "@/services/product-media";
import {
  MAJOR_FEATURE_LABELS,
  MAJOR_FEATURE_SEARCH_SLUGS,
  MAX_INDUSTRIES_PER_PRODUCT,
  MAX_MAJOR_FEATURES_PER_PRODUCT,
  MAX_USE_CASES_PER_PRODUCT,
} from "./constants";

export { MAJOR_FEATURE_SEARCH_SLUGS } from "./constants";

const ACTIVE = new Set(["published", "active", "embedding-disabled"]);

export function listActiveOfficialMedia(
  media: ProductMedia[],
): ProductMedia[] {
  return media.filter(
    (m) =>
      m.officialSource === true &&
      ACTIVE.has(m.status) &&
      m.status !== "unavailable" &&
      m.status !== "rejected",
  );
}

export function toCoverageItems(
  media: ProductMedia[],
): ExistingMediaCoverageItem[] {
  return media.map((m) => ({
    mediaId: m.id,
    title: m.title,
    type: m.type,
    sourceUrl: m.sourceUrl,
    officialSource: m.officialSource,
    status: m.status,
    placements: m.placements,
    featureIds: m.featureIds,
    useCaseIds: m.useCaseIds,
    industryIds: m.industryIds,
    reuseNote: "Canonical ResearchMedia — reuse; do not duplicate",
  }));
}

/**
 * Select major features for deep official-demo search.
 * Prefer rated/available features that appear in the major list.
 */
export function selectMajorFeaturesForSearch(input: {
  software: Software;
  enrichment?: ProductResearchEnrichment | null;
}): string[] {
  const rated = new Set(input.software.featureRatings.map((f) => f.featureSlug));
  const supported = new Set(
    (input.enrichment?.featureSupport ?? [])
      .filter(
        (f) =>
          f.availability === "supported" ||
          f.availability === "limited" ||
          f.availability === "add-on" ||
          f.availability === "higher-plan-only",
      )
      .map((f) => f.featureSlug),
  );
  const useCaseHints = new Set(input.software.useCaseSlugs);

  const scored = MAJOR_FEATURE_SEARCH_SLUGS.map((slug) => {
    let score = 0;
    if (rated.has(slug)) score += 3;
    if (supported.has(slug)) score += 2;
    if (useCaseHints.has(slug)) score += 2;
    // Always allow core CRM pillars a baseline if product is CRM
    if (
      input.software.primaryCategorySlug === "crm" &&
      (slug === "pipeline-management" ||
        slug === "lead-management" ||
        slug === "workflow-automation" ||
        slug === "reporting")
    ) {
      score += 1;
    }
    return { slug, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_MAJOR_FEATURES_PER_PRODUCT)
    .map((x) => x.slug);

  return scored;
}

export function selectUseCasesForSearch(software: Software): string[] {
  return software.useCaseSlugs.slice(0, MAX_USE_CASES_PER_PRODUCT);
}

export function selectIndustriesForSearch(software: Software): string[] {
  return software.industrySlugs.slice(0, MAX_INDUSTRIES_PER_PRODUCT);
}

export function featureSearchLabel(slug: string): string {
  return MAJOR_FEATURE_LABELS[slug] ?? slug.replace(/-/g, " ");
}

/**
 * True when enrichment already has a SoftwareGlimpse original teaching diagram
 * for this feature (do not re-recommend redrawing it).
 */
export function hasOriginalSgDiagramForFeature(
  screenshots: ProductScreenshot[],
  featureSlug: string,
): boolean {
  return screenshots.some((shot) => {
    const isSgOriginal =
      shot.kind === "original-diagram" ||
      (shot.annotation ?? "").toLowerCase().includes("softwareglimpse original");
    if (!isSgOriginal) return false;
    if (shot.featureIds?.includes(featureSlug)) return true;
    const hay = [shot.id, shot.annotation, shot.caption, shot.alt]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return (
      hay.includes(featureSlug) ||
      hay.includes(featureSlug.replace(/-/g, " "))
    );
  });
}

/** True when an SG original workflow/use-case diagram already exists. */
export function hasOriginalSgDiagramForUseCase(
  screenshots: ProductScreenshot[],
  useCaseSlug: string,
): boolean {
  return screenshots.some((shot) => {
    const isSgOriginal =
      shot.kind === "original-diagram" ||
      (shot.annotation ?? "").toLowerCase().includes("softwareglimpse original");
    if (!isSgOriginal) return false;
    if (shot.useCaseIds?.includes(useCaseSlug)) return true;
    // Require explicit use-case tagging — never treat feature diagrams as use-case coverage
    const id = (shot.id ?? "").toLowerCase();
    const annotation = (shot.annotation ?? "").toLowerCase();
    return (
      id.includes(`-usecase-${useCaseSlug}`) ||
      id.includes(`-workflow-${useCaseSlug}`) ||
      annotation.includes(`use-case:${useCaseSlug}`) ||
      annotation.includes(`usecase:${useCaseSlug}`)
    );
  });
}

export function findExistingMediaForNeed(input: {
  media: ProductMedia[];
  placement?: ProductMedia["placements"][number];
  featureId?: string;
  useCaseId?: string;
  industryId?: string;
  types?: ProductMedia["type"][];
}): ProductMedia | undefined {
  const active = listActiveOfficialMedia(input.media);
  return active.find((m) => {
    if (input.types && !input.types.includes(m.type)) return false;
    if (input.placement && !m.placements.includes(input.placement)) {
      // allow feature match without placement
      if (!input.featureId && !input.useCaseId) return false;
    }
    if (input.featureId && !m.featureIds.includes(input.featureId)) {
      if (input.placement && m.placements.includes(input.placement)) {
        // placement-only match ok when no feature required strictly
      } else if (!input.useCaseId && !input.industryId) {
        return false;
      }
    }
    if (input.featureId && m.featureIds.includes(input.featureId)) return true;
    if (input.useCaseId && m.useCaseIds.includes(input.useCaseId)) return true;
    if (input.industryId && m.industryIds.includes(input.industryId)) return true;
    if (input.placement && m.placements.includes(input.placement)) return true;
    return false;
  });
}

/**
 * Detect URL variants of the same YouTube/Vimeo asset already in ResearchMedia.
 */
export function findExistingBySourceUrl(
  sourceUrl: string,
  media: ProductMedia[],
): ProductMedia | null {
  const parsed = parseVideoSourceUrl(sourceUrl);
  return findDuplicateResearchMedia(
    {
      id: "",
      provider: parsed?.provider ?? "youtube",
      sourceUrl,
      videoId: parsed?.videoId,
      providerId: parsed?.videoId,
    },
    media,
  );
}

export function detectStaleMedia(input: {
  media: ProductMedia[];
  screenshots: ProductScreenshot[];
  now?: Date;
}): StaleMediaFinding[] {
  const findings: StaleMediaFinding[] = [];
  const now = input.now ?? new Date();

  for (const m of input.media) {
    const gov = evaluateMediaGovernance({ media: m, now });
    if (gov.flags.includes("source-unavailable") || m.status === "unavailable") {
      findings.push({
        mediaId: m.id,
        title: m.title,
        kind: "unavailable-video",
        detail: "Video source unavailable or status=unavailable",
        refreshRecommendation:
          "Hide from public UI; verify removal vs private; find replacement official demo if still needed",
      });
    }
    if (gov.flags.includes("embedding-disabled")) {
      findings.push({
        mediaId: m.id,
        title: m.title,
        kind: "embedding-disabled",
        detail: "Embedding disabled — link-only fallback",
        refreshRecommendation:
          "Keep watch link; confirm vendor still allows embed or replace with another official video",
      });
    }
    if (gov.flags.includes("stale-ui")) {
      findings.push({
        mediaId: m.id,
        title: m.title,
        kind: "stale-ui",
        detail: "Demo UI may be outdated vs current product surfaces",
        refreshRecommendation: "Re-verify against current UI; replace if branding/layout materially changed",
      });
    }
    if (gov.flags.includes("beyond-review-threshold")) {
      findings.push({
        mediaId: m.id,
        title: m.title,
        kind: "beyond-review-threshold",
        detail: "Verification age exceeds official-media freshness policy",
        refreshRecommendation: "Re-check source health and UI currency; update verifiedAt after review",
      });
    }
    if (gov.flags.includes("source-no-longer-official")) {
      findings.push({
        mediaId: m.id,
        title: m.title,
        kind: "source-no-longer-official",
        detail: "Official-source claim needs re-verification",
        refreshRecommendation: "Confirm vendor channel/domain; demote if third-party",
      });
    }
  }

  for (const s of input.screenshots) {
    if (!s.checkedAt) {
      findings.push({
        mediaId: s.id,
        title: s.alt || s.caption || s.id,
        kind: "outdated-screenshot",
        detail: "Screenshot lacks checkedAt — treat as potentially stale",
        refreshRecommendation:
          "Re-capture or re-verify against current UI; annotate checkedAt",
      });
      continue;
    }
    const ageMs = now.getTime() - new Date(s.checkedAt).getTime();
    const days = ageMs / (1000 * 60 * 60 * 24);
    if (days > 180) {
      findings.push({
        mediaId: s.id,
        title: s.alt || s.caption || s.id,
        kind: "outdated-screenshot",
        detail: `Screenshot last checked ${Math.floor(days)} days ago`,
        refreshRecommendation: "Refresh screenshot if UI changed; update checkedAt",
      });
    }
  }

  return findings;
}

/** Map research sources into non-video official evidence candidates (known URLs only). */
export function officialSourcesAsEvidenceCandidates(
  sources: ResearchSource[],
): ResearchSource[] {
  return sources.filter(
    (s) =>
      s.url &&
      s.status !== "rejected" &&
      s.status !== "archived" &&
      s.sourceHealth !== "unavailable" &&
      (s.authority === "first-party" ||
        s.sourceType.startsWith("official-") ||
        s.sourceType === "vendor" ||
        s.sourceType === "docs" ||
        s.sourceType === "pricing-page"),
  );
}
