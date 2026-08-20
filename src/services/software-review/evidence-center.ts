import type {
  ProductMedia,
  ProductScreenshot,
  ResearchSource,
} from "@/domain";
import {
  mediaWhatThisShows,
  isSoftwareGlimpseAnalysisVideo,
} from "@/domain";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import { isResearchDomainStale } from "@/services/research/freshness";
import {
  enrichMediaFromSourceUrl,
  isVideoPublicEligible,
} from "@/services/product-media";

export type EvidenceCenterFilter =
  | "all"
  | "documentation"
  | "pricing"
  | "screenshots"
  | "videos"
  | "features"
  | "use-cases"
  | "implementation";

export type EvidenceFreshness = "verified" | "needs-refresh" | "unavailable";

export type EvidenceCenterBadge =
  | "primary-source"
  | "softwareglimpse-analysis";

export type EvidenceCenterItemKind =
  | "documentation"
  | "pricing"
  | "screenshot"
  | "video"
  | "webinar"
  | "tutorial"
  | "feature-claim"
  | "hands-on";

export type EvidenceClaimConnection = {
  /** Human-readable only — never internal IDs. */
  label: string;
};

export type EvidenceCenterItem = {
  id: string;
  filters: EvidenceCenterFilter[];
  kind: EvidenceCenterItemKind;
  kindLabel: string;
  badge: EvidenceCenterBadge;
  title: string;
  summary: string | null;
  supportsLabels: string[];
  demonstrates: string[];
  claimConnections: EvidenceClaimConnection[];
  verifiedAt: string | null;
  freshness: EvidenceFreshness;
  sourceUrl: string | null;
  /** Present for video kinds — render OfficialProductVideo. */
  media: ProductMedia | null;
  screenshot: ProductScreenshot | null;
};

export type EvidenceCoverageSummary = {
  officialSources: number;
  screenshots: number;
  officialVideos: number;
  featureClaims: number;
  pricingRecords: number;
  lastVerified: string | null;
};

export type EvidenceCenterModel = {
  summary: EvidenceCoverageSummary;
  items: EvidenceCenterItem[];
  filterCounts: Record<EvidenceCenterFilter, number>;
};

const featureNameBySlug = new Map(
  canonicalFeaturesSeed.map((f) => [f.slug, f.name]),
);

function humanizeSlug(slug: string): string {
  return (
    featureNameBySlug.get(slug) ??
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return iso.slice(0, 10);
}

function maxIso(dates: Array<string | null | undefined>): string | null {
  const valid = dates.filter((d): d is string => Boolean(d));
  if (valid.length === 0) return null;
  return valid.sort().at(-1) ?? null;
}

function sourceFreshness(input: {
  checkedAt: string | null;
  unavailable?: boolean;
  domain: "features" | "pricing" | "identity";
  now?: Date;
}): EvidenceFreshness {
  if (input.unavailable) return "unavailable";
  if (!input.checkedAt) return "needs-refresh";
  if (
    isResearchDomainStale({
      domain: input.domain,
      checkedAt: input.checkedAt,
      now: input.now,
    })
  ) {
    return "needs-refresh";
  }
  return "verified";
}

function mediaFreshness(media: ProductMedia, now?: Date): EvidenceFreshness {
  if (
    media.status === "unavailable" ||
    media.status === "rejected" ||
    media.sourceHealth === "unavailable" ||
    media.refreshFlags?.includes("source-unavailable")
  ) {
    return "unavailable";
  }
  if (!media.verifiedAt) return "needs-refresh";
  if (
    isResearchDomainStale({
      domain: "official-media",
      checkedAt: media.lastCheckedAt ?? media.verifiedAt,
      now,
    })
  ) {
    return "needs-refresh";
  }
  return "verified";
}

function docFilterKeys(sourceType: string): EvidenceCenterFilter[] {
  const keys: EvidenceCenterFilter[] = ["documentation"];
  if (sourceType.includes("pricing")) keys.push("pricing");
  return keys;
}

function videoClaimConnections(media: ProductMedia): EvidenceClaimConnection[] {
  const out: EvidenceClaimConnection[] = [];
  for (const id of media.featureIds) {
    out.push({
      label: `${humanizeSlug(id)} → feature availability`,
    });
  }
  for (const id of media.useCaseIds) {
    out.push({
      label: `${humanizeSlug(id)} → use-case workflow`,
    });
  }
  if (media.evidenceClaimKinds.includes("ui-layout")) {
    out.push({ label: "UI layout → product surface evidence" });
  }
  if (media.evidenceClaimKinds.includes("workflow-demo")) {
    out.push({ label: "Workflow demo → interaction evidence" });
  }
  if (media.evidenceClaimKinds.includes("setup-tutorial")) {
    out.push({ label: "Setup tutorial → implementation context" });
  }
  // Dedupe by label
  const seen = new Set<string>();
  return out.filter((c) => {
    if (seen.has(c.label)) return false;
    seen.add(c.label);
    return true;
  });
}

function videoFilters(media: ProductMedia): EvidenceCenterFilter[] {
  const filters: EvidenceCenterFilter[] = ["videos"];
  if (media.placements.includes("implementation") || media.type === "official-tutorial") {
    filters.push("implementation");
  }
  if (media.useCaseIds.length > 0 || media.placements.includes("use-cases")) {
    filters.push("use-cases");
  }
  if (media.featureIds.length > 0 || media.placements.includes("features")) {
    filters.push("features");
  }
  return filters;
}

function videoKindLabel(media: ProductMedia): {
  kind: EvidenceCenterItemKind;
  kindLabel: string;
} {
  if (media.type === "official-webinar") {
    return { kind: "webinar", kindLabel: "Official webinar" };
  }
  if (media.type === "official-tutorial") {
    return { kind: "tutorial", kindLabel: "Official tutorial" };
  }
  if (isSoftwareGlimpseAnalysisVideo(media)) {
    return { kind: "video", kindLabel: "SoftwareGlimpse analysis video" };
  }
  return { kind: "video", kindLabel: "Official video" };
}

/**
 * Build a public evidence-center model from enrichment + sources.
 * Only includes actual recorded data — no fabricated counts.
 */
export function buildEvidenceCenterModel(input: {
  sources: Array<{
    id: string;
    title: string;
    url: string | null;
    checkedAt: string | null;
    kindLabel: string | null;
    sourceType?: string;
  }>;
  researchSources?: ResearchSource[];
  screenshots: ProductScreenshot[];
  media: ProductMedia[];
  featureSupport: Array<{
    featureSlug: string;
    availability: string;
    sourceIds: string[];
    notes?: string;
  }>;
  pricingPlanCount: number;
  pricingVerifiedAt: string | null;
  handsOnTesting: boolean;
  now?: Date;
}): EvidenceCenterModel {
  const items: EvidenceCenterItem[] = [];
  const now = input.now;

  // Documentation / pricing sources
  for (const source of input.sources) {
    const raw = input.researchSources?.find((s) => s.id === source.id);
    const sourceType = raw?.sourceType ?? source.sourceType ?? source.kindLabel ?? "other";
    const isPricing =
      String(sourceType).includes("pricing") ||
      (source.kindLabel ?? "").toLowerCase().includes("pricing");
    const filters = isPricing
      ? (["documentation", "pricing"] as EvidenceCenterFilter[])
      : docFilterKeys(String(sourceType));

    const unavailable = raw?.sourceHealth === "unavailable";
    items.push({
      id: `source-${source.id}`,
      filters,
      kind: isPricing ? "pricing" : "documentation",
      kindLabel: isPricing
        ? "Pricing source"
        : source.kindLabel ?? "Official documentation",
      badge: "primary-source",
      title: source.title,
      summary: source.kindLabel,
      supportsLabels: [],
      demonstrates: [],
      claimConnections: [],
      verifiedAt: formatDate(source.checkedAt),
      freshness: sourceFreshness({
        checkedAt: source.checkedAt,
        unavailable,
        domain: isPricing ? "pricing" : "features",
        now,
      }),
      sourceUrl: source.url,
      media: null,
      screenshot: null,
    });
  }

  // Screenshots
  for (const shot of input.screenshots) {
    items.push({
      id: `shot-${shot.id}`,
      filters: ["screenshots"],
      kind: "screenshot",
      kindLabel: "Screenshot",
      badge: "primary-source",
      title: shot.caption || shot.alt,
      summary: shot.annotation ?? null,
      supportsLabels: [],
      demonstrates: shot.caption ? [shot.caption] : [],
      claimConnections: [],
      verifiedAt: formatDate(shot.checkedAt),
      freshness: sourceFreshness({
        checkedAt: shot.checkedAt ?? null,
        domain: "features",
        now,
      }),
      sourceUrl: shot.source ?? null,
      media: null,
      screenshot: shot,
    });
  }

  // Videos — hide source-failed from active public display; keep history in research.
  for (const raw of input.media) {
    const media = enrichMediaFromSourceUrl(raw);
    const publicOk = isVideoPublicEligible(media).eligible;
    const unavailable =
      media.status === "unavailable" ||
      media.status === "rejected" ||
      media.sourceHealth === "unavailable" ||
      media.refreshFlags?.includes("source-unavailable");
    const publishedSgAnalysis =
      isSoftwareGlimpseAnalysisVideo(media) &&
      (media.status === "published" ||
        media.status === "verified" ||
        media.status === "active");
    // Public evidence center: do not surface unavailable/source-failed videos.
    if (unavailable) continue;
    if (!publicOk && !publishedSgAnalysis) continue;

    const { kind, kindLabel } = videoKindLabel(media);
    const supportsLabels = [
      ...media.featureIds.map(humanizeSlug),
      ...media.useCaseIds.map(humanizeSlug),
    ];

    items.push({
      id: `video-${media.id}`,
      filters: videoFilters(media),
      kind,
      kindLabel,
      badge: isSoftwareGlimpseAnalysisVideo(media)
        ? "softwareglimpse-analysis"
        : "primary-source",
      title: media.title,
      summary: media.demonstratesCaption ?? media.editorialCommentary ?? null,
      supportsLabels: [...new Set(supportsLabels)],
      demonstrates: mediaWhatThisShows(media),
      claimConnections: videoClaimConnections(media),
      verifiedAt: formatDate(media.verifiedAt),
      freshness: mediaFreshness(media, now),
      sourceUrl: media.sourceUrl,
      media,
      screenshot: null,
    });
  }

  // Feature claims (research overlay — SoftwareGlimpse structured research)
  for (const feature of input.featureSupport) {
    const name = humanizeSlug(feature.featureSlug);
    items.push({
      id: `feature-${feature.featureSlug}`,
      filters: ["features"],
      kind: "feature-claim",
      kindLabel: "Feature claim",
      badge: "softwareglimpse-analysis",
      title: name,
      summary: feature.notes ?? `Availability: ${feature.availability}`,
      supportsLabels: [name],
      demonstrates: [],
      claimConnections: [
        {
          label: `${name} → ${feature.availability.replace(/-/g, " ")}`,
        },
      ],
      verifiedAt: null,
      freshness: feature.sourceIds.length > 0 ? "verified" : "needs-refresh",
      sourceUrl: null,
      media: null,
      screenshot: null,
    });
  }

  if (input.handsOnTesting) {
    items.push({
      id: "hands-on",
      filters: [],
      kind: "hands-on",
      kindLabel: "Hands-on evidence",
      badge: "softwareglimpse-analysis",
      title: "Hands-on product testing recorded",
      summary:
        "SoftwareGlimpse recorded hands-on testing for this product in research metadata.",
      supportsLabels: [],
      demonstrates: [],
      claimConnections: [],
      verifiedAt: null,
      freshness: "verified",
      sourceUrl: null,
      media: null,
      screenshot: null,
    });
  }

  const officialVideoCount = input.media.filter((m) => {
    const enriched = enrichMediaFromSourceUrl(m);
    if (isSoftwareGlimpseAnalysisVideo(enriched)) return false;
    if (
      enriched.status === "unavailable" ||
      enriched.status === "rejected" ||
      enriched.sourceHealth === "unavailable" ||
      enriched.refreshFlags?.includes("source-unavailable")
    ) {
      return false;
    }
    return isVideoPublicEligible(enriched).eligible;
  }).length;

  const summary: EvidenceCoverageSummary = {
    officialSources: input.sources.length,
    screenshots: input.screenshots.length,
    officialVideos: officialVideoCount,
    featureClaims: input.featureSupport.length,
    pricingRecords: input.pricingPlanCount,
    lastVerified: formatDate(
      maxIso([
        ...input.sources.map((s) => s.checkedAt),
        ...input.screenshots.map((s) => s.checkedAt),
        ...input.media.map((m) => m.verifiedAt),
        input.pricingVerifiedAt,
      ]),
    ),
  };

  const filterCounts = {
    all: items.length,
    documentation: items.filter((i) => i.filters.includes("documentation"))
      .length,
    pricing: items.filter((i) => i.filters.includes("pricing")).length,
    screenshots: items.filter((i) => i.filters.includes("screenshots")).length,
    videos: items.filter((i) => i.filters.includes("videos")).length,
    features: items.filter((i) => i.filters.includes("features")).length,
    "use-cases": items.filter((i) => i.filters.includes("use-cases")).length,
    implementation: items.filter((i) => i.filters.includes("implementation"))
      .length,
  } satisfies Record<EvidenceCenterFilter, number>;

  return { summary, items, filterCounts };
}

export const EVIDENCE_CENTER_PAGE_SIZE = 8;

export function filterEvidenceItems(
  items: EvidenceCenterItem[],
  filter: EvidenceCenterFilter,
): EvidenceCenterItem[] {
  if (filter === "all") return items;
  return items.filter((item) => item.filters.includes(filter));
}
