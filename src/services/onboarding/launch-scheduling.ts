import { loadEnrichment } from "@/data/research/store";
import type {
  LaunchContentItem,
  LaunchReadiness,
  OnboardingLaunchPlan,
  OnboardingPageType,
  OnboardingScheduleRequest,
  PageCandidate,
  Software,
  SoftwareOnboardingRun,
} from "@/domain";
import {
  alternativesContentId,
  comparisonContentId,
  guideContentId,
  pricingContentId,
  softwareContentId,
} from "@/services/publishing/ids";
import { runScheduledContentAudit } from "@/services/publishing/agents/scheduled-content-audit";
import {
  buildLaunchId,
  resolvePublishInstant,
  type ResolvedPublishInstant,
} from "./schedule-time";
import { writeOnboardingLaunchReport } from "./launch-report";

const PAGE_TYPE_ORDER: OnboardingPageType[] = [
  "software-review",
  "pricing",
  "alternatives",
  "comparison",
  "guide",
  "best-inclusion",
  "category-hub",
];

function comparisonSlugFromPath(path: string): string {
  const trimmed = path.replace(/^\/compare\//, "").replace(/\/$/, "");
  return trimmed;
}

function contentIdForPage(page: PageCandidate): string {
  const slug = page.productSlugs[0] ?? "unknown";
  switch (page.pageType) {
    case "software-review":
      return softwareContentId(slug);
    case "pricing":
      return pricingContentId(slug);
    case "alternatives":
      return alternativesContentId(slug);
    case "comparison":
      return comparisonContentId(comparisonSlugFromPath(page.canonicalPath));
    case "guide":
      return guideContentId(
        page.canonicalPath.replace(/^\/guides\//, "").replace(/\/$/, ""),
      );
    default:
      return `content:${page.pageType}:${slug}`;
  }
}

function titleForPage(page: PageCandidate, product: Software): string {
  switch (page.pageType) {
    case "software-review":
      return `${product.name} Review`;
    case "pricing":
      return `${product.name} Pricing`;
    case "alternatives":
      return `${product.name} Alternatives`;
    case "comparison":
      return page.canonicalPath
        .replace(/^\/compare\//, "")
        .replace(/-/g, " ")
        .replace(/\//g, "");
    case "guide":
      return page.canonicalIntent;
    default:
      return page.canonicalIntent;
  }
}

function isBlockingPageStatus(status: PageCandidate["status"]): boolean {
  return (
    status === "blocked" ||
    status === "category-blocked" ||
    status === "not-recommended"
  );
}

function qualityForPage(page: PageCandidate): {
  quality: LaunchReadiness;
  warnings: string[];
} {
  const warnings: string[] = [];
  if (isBlockingPageStatus(page.status)) {
    return { quality: "BLOCKED", warnings: [page.reason] };
  }
  if (
    page.status === "research-required" ||
    page.status === "relationship-review-required"
  ) {
    warnings.push(page.reason);
    return { quality: "READY_WITH_WARNINGS", warnings };
  }
  if (page.readiness !== "ready-to-create" && page.readiness !== "duplicate") {
    warnings.push(`readiness=${page.readiness}`);
    return { quality: "READY_WITH_WARNINGS", warnings };
  }
  return { quality: "READY", warnings };
}

function resolveItemPublishAt(
  page: PageCandidate,
  base: ResolvedPublishInstant,
  schedule: OnboardingScheduleRequest,
): string {
  const override = schedule.itemPublishAt?.[page.id];
  if (override) return new Date(override).toISOString();

  if (page.pageType === "alternatives" && schedule.alternativesAt) {
    return new Date(schedule.alternativesAt).toISOString();
  }
  if (page.pageType === "comparison" && schedule.comparisonsAt) {
    return new Date(schedule.comparisonsAt).toISOString();
  }
  if (page.pageType === "guide" && schedule.guidesAt) {
    return new Date(schedule.guidesAt).toISOString();
  }

  return base.publishAtUtc;
}

function filterPagesByScope(
  pages: PageCandidate[],
  scope: OnboardingScheduleRequest["contentScope"],
): PageCandidate[] {
  if (scope === "full") return pages;
  if (scope === "minimal") {
    return pages.filter((p) =>
      ["software-review", "pricing"].includes(p.pageType),
    );
  }
  // standard
  return pages.filter(
    (p) => p.pageType !== "best-inclusion" && p.pageType !== "category-hub",
  );
}

function dependencyViolations(
  items: LaunchContentItem[],
  productPublishAt: string,
): string[] {
  const productTs = Date.parse(productPublishAt);
  const violations: string[] = [];

  for (const item of items) {
    if (!item.scheduledAt) continue;
    const itemTs = Date.parse(item.scheduledAt);
    if (Number.isNaN(itemTs) || Number.isNaN(productTs)) continue;

    const needsProduct =
      item.pageType === "comparison" ||
      item.pageType === "alternatives" ||
      item.pageType === "pricing" ||
      item.pageType === "guide";

    if (needsProduct && itemTs < productTs) {
      violations.push(
        `${item.contentId} publishes before product (${item.scheduledAt} < ${productPublishAt})`,
      );
    }
  }

  return violations;
}

export function buildLaunchContentPackage(input: {
  product: Software;
  pages: PageCandidate[];
  schedule: OnboardingScheduleRequest;
  resolved: ResolvedPublishInstant;
}): LaunchContentItem[] {
  const scoped = filterPagesByScope(
    input.pages,
    input.schedule.contentScope ?? "standard",
  );

  const sorted = [...scoped].sort(
    (a, b) =>
      PAGE_TYPE_ORDER.indexOf(a.pageType) - PAGE_TYPE_ORDER.indexOf(b.pageType),
  );

  return sorted.map((page) => {
    const { quality, warnings } = qualityForPage(page);
    const scheduledAt = resolveItemPublishAt(
      page,
      input.resolved,
      input.schedule,
    );
    const blocked = isBlockingPageStatus(page.status);

    return {
      contentId: contentIdForPage(page),
      pageType: page.pageType,
      title: titleForPage(page, input.product),
      path: page.canonicalPath,
      publishStatus: blocked
        ? "scheduled-blocked"
        : quality === "BLOCKED"
          ? "draft"
          : "scheduled",
      scheduledAt: blocked ? undefined : scheduledAt,
      quality: blocked ? "BLOCKED" : quality,
      warnings,
      dependencies: page.dependencies,
    };
  });
}

export function applyScheduledMetadataToProduct(
  product: Software,
  resolved: ResolvedPublishInstant,
  vendor?: string,
): Software {
  const now = new Date().toISOString();
  return {
    ...product,
    company: vendor?.trim() || product.company,
    metadata: {
      ...product.metadata,
      status: "scheduled",
      scheduledAt: resolved.publishAtUtc,
      updatedAt: now,
    },
    seo: {
      ...product.seo,
      indexable: product.seo.indexable,
    },
  };
}

export function previewCommandForLaunch(productSlug: string): string {
  void productSlug;
  return "npm run dev";
}

export type ApplyLaunchScheduleResult = {
  plan: OnboardingLaunchPlan;
  product: Software;
  manifestPath: string;
  auditPath: string;
  auditVerdict: LaunchReadiness;
};

/**
 * Apply launch scheduling to an onboarding run — never sets status to published.
 */
export function applyOnboardingLaunchSchedule(input: {
  run: SoftwareOnboardingRun;
  product: Software;
  dryRun: boolean;
}): ApplyLaunchScheduleResult {
  const schedule = input.run.request.schedule;
  if (!schedule) {
    throw new Error("No schedule on onboarding request");
  }

  const resolved = resolvePublishInstant(schedule);
  const launchId = buildLaunchId(input.product.slug, resolved.localDate);
  const contentItems = buildLaunchContentPackage({
    product: input.product,
    pages: input.run.pageCandidates,
    schedule,
    resolved,
  });

  const depViolations = dependencyViolations(
    contentItems,
    resolved.publishAtUtc,
  );

  let readiness: LaunchReadiness = "READY";
  const launchWarnings: string[] = [];

  const blockedItems = contentItems.filter((i) => i.quality === "BLOCKED");
  const warnItems = contentItems.filter(
    (i) => i.quality === "READY_WITH_WARNINGS",
  );

  if (depViolations.length) {
    readiness = "BLOCKED";
    launchWarnings.push(...depViolations);
  } else if (blockedItems.length) {
    readiness = "BLOCKED";
  } else if (warnItems.length) {
    readiness = "READY_WITH_WARNINGS";
  }

  const productPage = contentItems.find(
    (i) => i.pageType === "software-review",
  );
  let product = input.product;
  if (
    productPage &&
    productPage.publishStatus === "scheduled" &&
    readiness !== "BLOCKED"
  ) {
    product = applyScheduledMetadataToProduct(
      product,
      resolved,
      schedule.vendor,
    );
  } else if (readiness === "BLOCKED") {
    product = {
      ...product,
      metadata: {
        ...product.metadata,
        status: "draft",
        updatedAt: new Date().toISOString(),
      },
    };
  }

  const plan: OnboardingLaunchPlan = {
    launchId,
    name: `${input.product.name} Launch`,
    productSlug: input.product.slug,
    vendor: schedule.vendor ?? input.product.company,
    categorySlug: input.product.primaryCategorySlug,
    publishAtUtc: resolved.publishAtUtc,
    humanPublishLabel: resolved.humanLabel,
    timezone: resolved.timezone,
    status: readiness === "BLOCKED" ? "blocked" : "scheduled",
    readiness,
    previewCommand: previewCommandForLaunch(input.product.slug),
    contentItems,
  };

  const manifestPath = input.dryRun
    ? `(dry-run) docs/publishing/launches/${input.product.slug}-launch.md`
    : writeOnboardingLaunchReport({
        run: input.run,
        product,
        plan,
        enrichment: loadEnrichment(input.product.slug),
        launchWarnings,
      });
  plan.manifestPath = manifestPath;

  const audit = input.dryRun
    ? { outputPath: "(dry-run)", verdict: "READY" as const }
    : runScheduledContentAudit();
  plan.auditPath = audit.outputPath;
  plan.auditVerdict = audit.verdict;

  if (audit.verdict === "BLOCKED" && readiness !== "BLOCKED") {
    plan.readiness = "READY_WITH_WARNINGS";
    launchWarnings.push(`Scheduled audit: ${audit.verdict}`);
  }

  return {
    plan,
    product,
    manifestPath,
    auditPath: audit.outputPath,
    auditVerdict: audit.verdict,
  };
}

export function formatLaunchCompletionReport(
  run: SoftwareOnboardingRun,
): string[] {
  const plan = run.launchPlan;
  if (!plan) {
    return ["No launch plan — scheduling was not requested."];
  }

  const scheduled = plan.contentItems.filter(
    (i) => i.publishStatus === "scheduled",
  );
  const draft = plan.contentItems.filter((i) => i.publishStatus === "draft");
  const blocked = plan.contentItems.filter(
    (i) => i.publishStatus === "scheduled-blocked" || i.quality === "BLOCKED",
  );

  return [
    `Product onboarded: ${plan.productSlug} (NOT published — launches ${plan.humanPublishLabel})`,
    `Launch date: ${plan.humanPublishLabel}`,
    `UTC: ${plan.publishAtUtc}`,
    `Routes planned: ${plan.contentItems.length}`,
    `Scheduled routes: ${scheduled.length}`,
    `Draft routes: ${draft.length}`,
    `Blocked routes: ${blocked.length}`,
    `Research: ${run.researchCompletenessPercent ?? 0}%`,
    `Launch readiness: ${plan.readiness}`,
    `Manifest: ${plan.manifestPath ?? "—"}`,
    `Audit: ${plan.auditPath ?? "—"} (${plan.auditVerdict ?? "—"})`,
    "",
    "Preview locally:",
    `  ${plan.previewCommand}`,
    "  # npm run dev shows all local content (drafts + scheduled + published)",
    "  # npm run dev:public — simulate production visibility",
    "",
    "Scheduled routes:",
    ...scheduled.map((i) => `  ${i.scheduledAt?.slice(0, 16) ?? "TBD"}  ${i.path}`),
  ];
}
