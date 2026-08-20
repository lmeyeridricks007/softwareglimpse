import type {
  ContentQualityPageType,
  PageIntentKind,
  PageQualitySnapshot,
} from "@/domain/schemas/content-quality";
import { PageQualitySnapshotSchema } from "@/domain/schemas/content-quality";

export type AuditTarget = {
  contentId: string;
  route: string;
  pageType: ContentQualityPageType;
  slug: string;
  title: string;
  categorySlug?: string;
};

export function presentIf(
  condition: boolean,
  sectionId: string,
): string | null {
  return condition ? sectionId : null;
}

export function collectPresent(
  ...items: Array<string | null | undefined | false>
): string[] {
  return items.filter((x): x is string => typeof x === "string" && x.length > 0);
}

export function missingFromExpected(
  expected: string[],
  present: string[],
): string[] {
  const set = new Set(present);
  return expected.filter((e) => !set.has(e));
}

export function countTruthy(flags: boolean[]): number {
  return flags.filter(Boolean).length;
}

export function daysSince(iso: string | undefined, now = Date.now()): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.floor((now - t) / (1000 * 60 * 60 * 24));
}

export function freshnessFromDates(input: {
  lastReviewedAt?: string;
  sourcesVerifiedAt?: string;
  maxAgeDays?: number;
  pricingFresh?: boolean;
}): PageQualitySnapshot["freshness"] {
  const maxAge = input.maxAgeDays ?? 180;
  const age =
    daysSince(input.lastReviewedAt) ?? daysSince(input.sourcesVerifiedAt);
  const withinPolicy = age === null ? undefined : age <= maxAge;
  return {
    lastReviewedAt: input.lastReviewedAt,
    sourcesVerifiedAt: input.sourcesVerifiedAt,
    pricingFresh: input.pricingFresh,
    withinPolicy,
    staleClaimFlags: withinPolicy === false ? 1 : 0,
    brokenSourceFlags: 0,
    obsoleteScreenshotFlags: 0,
  };
}

export function parseSnapshot(
  input: PageQualitySnapshot | Record<string, unknown>,
): PageQualitySnapshot {
  return PageQualitySnapshotSchema.parse(input);
}

export function inferGuidePageType(input: {
  topicType?: string;
  productSlugs?: string[];
}): ContentQualityPageType {
  const topic = input.topicType ?? "fundamental";
  const hasProduct = (input.productSlugs?.length ?? 0) > 0;
  if (
    hasProduct &&
    (topic === "setup" || topic === "migration" || topic === "implementation")
  ) {
    return "product-guide";
  }
  if (
    topic === "implementation" ||
    topic === "migration" ||
    topic === "setup"
  ) {
    return "implementation-guide";
  }
  if (
    topic === "fundamental" ||
    topic === "how-it-works" ||
    topic === "strategy" ||
    topic === "troubleshooting"
  ) {
    return "article";
  }
  return "guide";
}

export function inferGuideIntent(
  pageType: ContentQualityPageType,
  topicType?: string,
): PageIntentKind {
  if (
    pageType === "implementation-guide" ||
    pageType === "product-guide" ||
    topicType === "implementation" ||
    topicType === "migration" ||
    topicType === "setup"
  ) {
    return "implementation";
  }
  if (topicType === "selection" || topicType === "buying-guide") {
    return "informational";
  }
  return "informational";
}

/** Shared hub-depth signals used by industry / use-case / capability profiles. */
export function hubDepthSignals(profile: {
  overview?: string;
  challenges?: unknown[];
  outcomes?: unknown[];
  workflowSteps?: unknown[];
  capabilityNeeds?: unknown[];
  workedExample?: string;
  workedExampleSecondary?: string;
  scenarios?: unknown[];
  buyingFramework?: unknown[];
  evaluationQuestions?: unknown[];
  tradeoffs?: unknown[];
  vendorQuestions?: unknown[];
}): string[] {
  const out: string[] = [];
  if (profile.overview && profile.overview.length > 120) {
    out.push("overview depth");
  }
  if ((profile.challenges?.length ?? 0) > 0) out.push("challenges / trade-off context");
  if ((profile.outcomes?.length ?? 0) > 0) out.push("outcomes");
  if ((profile.workflowSteps?.length ?? 0) > 0) out.push("workflow");
  if ((profile.capabilityNeeds?.length ?? 0) > 0) out.push("capability / requirement priorities");
  if (profile.workedExample) out.push("example: worked scenario");
  if (profile.workedExampleSecondary) out.push("example: secondary scenario");
  if ((profile.scenarios?.length ?? 0) > 0) out.push("scenario differences");
  if ((profile.buyingFramework?.length ?? 0) > 0) out.push("criteria: buying framework");
  if ((profile.evaluationQuestions?.length ?? 0) > 0) {
    out.push("criteria: evaluation questions");
  }
  if ((profile.tradeoffs?.length ?? 0) > 0) out.push("trade-off");
  if ((profile.vendorQuestions?.length ?? 0) > 0) out.push("vendor questions");
  return out;
}

export function hubMediaSignals(profile: {
  heroVisual?: { src?: string } | null;
  needsVisual?: { src?: string } | null;
  workflowVisual?: { src?: string } | null;
}): NonNullable<PageQualitySnapshot["media"]> {
  const teaching = countTruthy([
    Boolean(profile.heroVisual?.src),
    Boolean(profile.needsVisual?.src),
    Boolean(profile.workflowVisual?.src),
  ]);
  return {
    teachingVisualCount: teaching,
    decorativeOnly: false,
    workflowDiagram: Boolean(profile.workflowVisual?.src),
    comparisonMatrix: false,
    checklistVisual: false,
    subjectNeedsVisuals: true,
  };
}
