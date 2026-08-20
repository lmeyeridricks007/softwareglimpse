import type {
  ProductMedia,
  ProductScreenshot,
  ProductResearchEnrichment,
  SupportingTopicType,
} from "@/domain";
import { loadEnrichment } from "@/data/research/store";
import {
  enrichMediaFromSourceUrl,
  isVideoPublicEligible,
} from "@/services/product-media";
import { isLikelyBrandPromo } from "@/services/product-media/context-tab-media";
import {
  CRM_PRODUCT_GUIDE_KINDS,
  productGuideSlug,
  type CrmProductGuideKind,
} from "./kinds";

export type ProductGuideMediaBundle = {
  productSlug: string;
  productName: string;
  kind: CrmProductGuideKind;
  screenshots: ProductScreenshot[];
  video: ProductMedia | null;
  videoMode: "implementation" | "overview" | "migration" | "plans" | null;
  /** Short label for the section heading. */
  sectionTitle: string;
  /** One-line explanation of why this media is on this guide. */
  sectionBody: string;
};

const TOPIC_TO_KIND: Partial<Record<SupportingTopicType, CrmProductGuideKind>> =
  {
    implementation: "implementation",
    setup: "setup",
    migration: "migration",
    "pricing-education": "plans",
    selection: "worth-it",
  };

/** Screenshot terms that make a capture relevant to a product-guide kind. */
const SCREENSHOT_TERMS: Record<CrmProductGuideKind, string[]> = {
  implementation: [
    "pipeline",
    "deal",
    "dashboard",
    "sales",
    "workspace",
    "activity",
    "lead",
    "contact",
    "board",
    "funnel",
    "crm",
    "opportunity",
    "report",
    "stage",
    "candidate",
    "hiring",
    "schedule",
    "timesheet",
    "training",
    "clock",
  ],
  setup: [
    "pipeline",
    "contact",
    "email",
    "lead",
    "deal",
    "board",
    "field",
    "import",
    "workspace",
    "dashboard",
    "sequence",
    "activity",
    "funnel",
  ],
  migration: [
    "import",
    "data",
    "migrat",
    "mapping",
    "csv",
    "sync",
    "export",
    "transfer",
    "confirm import",
  ],
  plans: [
    "pricing",
    "plan",
    "billing",
    "seat",
    "tier",
    "subscription",
    "quote",
    "invoice",
    "packag",
  ],
  "worth-it": [
    "dashboard",
    "pipeline",
    "product",
    "hero",
    "workspace",
    "crm",
    "deal",
    "lead",
    "board",
    "funnel",
    "overview",
  ],
};

const VIDEO_TITLE_TERMS: Record<CrmProductGuideKind, string[]> = {
  implementation: [
    "setup",
    "implement",
    "tutorial",
    "getting started",
    "onboard",
    "configure",
    "pipeline",
    "rollout",
    "walkthrough",
    "how to",
  ],
  setup: [
    "setup",
    "getting started",
    "tutorial",
    "first",
    "configure",
    "onboard",
    "pipeline",
    "how to",
  ],
  migration: [
    "migrat",
    "import",
    "data",
    "switch",
    "move from",
    "classic ui",
    "freedom ui",
  ],
  plans: [
    "pricing",
    "price",
    "plan",
    "edition",
    "tier",
    "package",
    "cost",
    "seat",
    "billing",
    "subscribe",
    "subscription",
    "license",
    "invoice",
    "cpq",
  ],
  "worth-it": [
    "overview",
    "what is",
    "intro",
    "demo",
    "tour",
    "in action",
    "product",
  ],
};

/** True when this guide is one of the 5 CRM product-guide factory pages. */
export function resolveCrmProductGuideKind(input: {
  slug: string;
  productSlugs: string[];
  topicType: SupportingTopicType;
}): { productSlug: string; kind: CrmProductGuideKind } | null {
  if (input.productSlugs.length !== 1) return null;
  const productSlug = input.productSlugs[0]!;
  const fromTopic = TOPIC_TO_KIND[input.topicType];
  if (fromTopic && productGuideSlug(productSlug, fromTopic) === input.slug) {
    return { productSlug, kind: fromTopic };
  }
  for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
    if (productGuideSlug(productSlug, kind) === input.slug) {
      return { productSlug, kind };
    }
  }
  return null;
}

function haystack(parts: Array<string | undefined | null>): string {
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesTerms(text: string, terms: string[]): boolean {
  return terms.some((t) => text.includes(t.toLowerCase()));
}

export function screenshotRelevantToGuideKind(
  shot: ProductScreenshot,
  kind: CrmProductGuideKind,
): boolean {
  const text = haystack([shot.id, shot.alt, shot.caption, shot.annotation]);
  return matchesTerms(text, SCREENSHOT_TERMS[kind]);
}

function videoText(media: ProductMedia): string {
  return haystack([
    media.id,
    media.title,
    media.description,
    media.purpose,
    media.demonstratesCaption,
    ...(media.whatThisShows ?? []),
    ...(media.evidenceClaimKinds ?? []),
    media.type,
  ]);
}

function isSetupOrImplVideo(media: ProductMedia): boolean {
  if (media.placements.includes("implementation")) return true;
  if (media.type === "official-tutorial") return true;
  if (media.evidenceClaimKinds.includes("setup-tutorial")) return true;
  return false;
}

function scoreVideoForKind(media: ProductMedia, kind: CrmProductGuideKind): number {
  const text = videoText(media);
  let score = 0;
  if (matchesTerms(text, VIDEO_TITLE_TERMS[kind])) score += 8;
  if (kind === "implementation" || kind === "setup") {
    if (isSetupOrImplVideo(media)) score += 12;
    if (isLikelyBrandPromo(media) && !isSetupOrImplVideo(media)) score -= 20;
  }
  if (kind === "migration") {
    if (matchesTerms(text, VIDEO_TITLE_TERMS.migration)) score += 15;
    // Avoid bare "ui" — it false-positives inside "official-tutorial".
    if (
      isSetupOrImplVideo(media) &&
      matchesTerms(text, ["import", "data", "migrat", "classic ui", "freedom ui", "nextgen ui"])
    )
      score += 6;
    if (isLikelyBrandPromo(media) && !matchesTerms(text, VIDEO_TITLE_TERMS.migration))
      score -= 20;
  }
  if (kind === "plans") {
    if (matchesTerms(text, VIDEO_TITLE_TERMS.plans)) score += 15;
    else score -= 20;
  }
  if (kind === "worth-it") {
    if (media.placements.includes("overview")) score += 10;
    if (isSetupOrImplVideo(media)) score += 2;
    if (isLikelyBrandPromo(media)) score += 1;
  }
  return score;
}

/**
 * Pick at most one official video that is actually about this guide kind.
 * Returns null rather than forcing an unrelated overview onto setup/plans/migration.
 */
export function selectVideoForGuideKind(
  media: ProductMedia[] | undefined,
  kind: CrmProductGuideKind,
): { video: ProductMedia; mode: ProductGuideMediaBundle["videoMode"] } | null {
  const eligible = (media ?? [])
    .map(enrichMediaFromSourceUrl)
    .filter((m) => isVideoPublicEligible(m).eligible);

  const ranked = eligible
    .map((item) => ({ item, score: scoreVideoForKind(item, kind) }))
    .filter((row) => row.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || a.item.id.localeCompare(b.item.id),
    );

  const best = ranked[0];
  if (!best) return null;

  if (kind === "implementation" || kind === "setup") {
    if (!isSetupOrImplVideo(best.item) && best.score < 8) return null;
    return { video: best.item, mode: "implementation" };
  }
  if (kind === "migration") {
    return { video: best.item, mode: "migration" };
  }
  if (kind === "plans") {
    return { video: best.item, mode: "plans" };
  }
  return { video: best.item, mode: "overview" };
}

export function selectScreenshotsForGuideKind(
  shots: ProductScreenshot[] | undefined,
  kind: CrmProductGuideKind,
  max = 4,
): ProductScreenshot[] {
  const matched = (shots ?? []).filter((s) =>
    screenshotRelevantToGuideKind(s, kind),
  );
  return matched.slice(0, max);
}

function sectionCopy(
  productName: string,
  kind: CrmProductGuideKind,
): { title: string; body: string } {
  switch (kind) {
    case "implementation":
      return {
        title: `${productName} rollout media`,
        body: `Official setup walkthroughs and product surfaces that matter while you roll out ${productName} — not a full product gallery.`,
      };
    case "setup":
      return {
        title: `${productName} day-zero setup media`,
        body: `Verified captures and vendor tutorials for configuring ${productName} before go-live — pipeline, contacts, and first workflows.`,
      };
    case "migration":
      return {
        title: `${productName} migration media`,
        body: `Import/data-move surfaces and vendor migration walkthroughs for ${productName} when available — unrelated product tour footage is omitted.`,
      };
    case "plans":
      return {
        title: `${productName} plans media`,
        body: `Pricing/plan surfaces and vendor plan explainers for ${productName} when research has them — general product demos stay on the research page.`,
      };
    case "worth-it":
      return {
        title: `See ${productName} before you decide`,
        body: `Core product overview media for a fit check — still not a substitute for the decision criteria on this page.`,
      };
  }
}

/**
 * Resolve guide-kind-relevant screenshots + at most one official video.
 * Never invents media; returns empty arrays/null when nothing matches the kind.
 */
export function selectProductGuideMedia(input: {
  productSlug: string;
  productName: string;
  kind: CrmProductGuideKind;
  enrichment?: ProductResearchEnrichment | null;
  maxScreenshots?: number;
}): ProductGuideMediaBundle {
  const enrichment =
    input.enrichment === undefined
      ? loadEnrichment(input.productSlug)
      : input.enrichment;
  const screenshots = selectScreenshotsForGuideKind(
    enrichment?.screenshots,
    input.kind,
    input.maxScreenshots ?? 4,
  );
  const picked = selectVideoForGuideKind(enrichment?.media, input.kind);
  const copy = sectionCopy(input.productName, input.kind);

  return {
    productSlug: input.productSlug,
    productName: input.productName,
    kind: input.kind,
    screenshots,
    video: picked?.video ?? null,
    videoMode: picked?.mode ?? null,
    sectionTitle: copy.title,
    sectionBody: copy.body,
  };
}

export function buildProductGuideMediaBundle(input: {
  slug: string;
  productSlugs: string[];
  topicType: SupportingTopicType;
  productName?: string;
}): ProductGuideMediaBundle | null {
  const resolved = resolveCrmProductGuideKind(input);
  if (!resolved) return null;
  const enrichment = loadEnrichment(resolved.productSlug);
  const name =
    input.productName?.trim() ||
    resolved.productSlug
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  const bundle = selectProductGuideMedia({
    productSlug: resolved.productSlug,
    productName: name,
    kind: resolved.kind,
    enrichment,
  });
  // Product guides only surface this block when a kind-relevant video exists.
  // Screenshots alone are not enough — avoids empty “rollout media” chrome.
  if (!bundle.video) return null;
  return bundle;
}
