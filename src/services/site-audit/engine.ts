import type {
  AuditIssue,
  AuditMetrics,
  AuditResult,
  HealthScore,
  PublicationReadiness,
  RemediationItem,
} from "@/domain";
import { AuditResultSchema } from "@/domain";
import {
  loadIssueLedger,
  saveAuditResult,
  saveIssueLedger,
  saveAuditSnapshot,
  writeMarkdownReport,
} from "@/data/audit/store";
import { buildContentRegistry } from "@/services/publishing/registry";
import {
  assessCategoryMaturity,
  assessProductMaturity,
} from "@/services/catalogue-onboarding/maturity";
import { validityChecks } from "./checks/validity";
import { researchFreshnessChecks } from "./checks/research";
import { editorialConsistencyChecks } from "./checks/editorial";
import { linkingChecks } from "./checks/linking";
import { seoMigrationChecks } from "./checks/seo-migration";
import { proseClaimChecks } from "./checks/prose";
import { affiliateOpsChecks } from "./checks/affiliate-ops";
import { ecosystemChecks } from "./checks/ecosystem";
import { supportingContentChecks } from "./checks/supporting-content";
import { siteFoundationChecks } from "./checks/site-foundation";
import { teachingVisualChecks } from "./checks/teaching-visuals";
import type { AuditCheck, AuditCheckContext } from "./framework";
import { runChecks } from "./framework";
import {
  auditStatusFromIssues,
  partitionIssues,
  reconcileIssues,
} from "./issues";
import { buildRemediationPlan } from "./remediation";
import { computeHealthScore } from "./health";
import { formatAuditMarkdown, formatAuditText } from "./report";
import { scanTeachingVisualLibrary } from "@/services/teaching-visuals/library-scan";

const ALL_CHECKS: AuditCheck[] = [
  ...validityChecks,
  ...researchFreshnessChecks,
  ...editorialConsistencyChecks,
  ...linkingChecks,
  ...seoMigrationChecks,
  ...proseClaimChecks,
  ...affiliateOpsChecks,
  ...ecosystemChecks,
  ...supportingContentChecks,
  ...siteFoundationChecks,
  ...teachingVisualChecks,
];

export type AuditOptions = {
  persist?: boolean;
  forceFresh?: boolean;
  fixtures?: Record<string, unknown>;
  writeReport?: boolean;
  baseline?: boolean;
};

function metricsFrom(issues: AuditIssue[], registry = buildContentRegistry()): AuditMetrics {
  const open = issues.filter(
    (i) => i.state !== "dismissed" && i.state !== "resolved",
  );
  return {
    publishedPages: registry.filter((e) => e.metadata.status === "published")
      .length,
    indexablePages: registry.filter(
      (e) => e.metadata.status === "published" && e.seoIndexable,
    ).length,
    draftPages: registry.filter((e) => e.metadata.status === "draft").length,
    scheduledPages: registry.filter((e) => e.metadata.status === "scheduled")
      .length,
    criticalIssues: open.filter((i) => i.severity === "critical").length,
    highIssues: open.filter((i) => i.severity === "high").length,
    mediumIssues: open.filter((i) => i.severity === "medium").length,
    lowIssues: open.filter((i) => i.severity === "low").length,
    infoIssues: open.filter((i) => i.severity === "info").length,
    researchStale: open.filter((i) => i.type === "STALE_CRITICAL_FACT" || i.type === "RESEARCH_GAP")
      .length,
    pricingStale: open.filter(
      (i) => i.type === "PRICING_STALE" || i.type === "PRICING_PROSE_MISMATCH",
    ).length,
    orphanPages: open.filter((i) => i.type === "ORPHAN_CONTENT").length,
    duplicateIntentWarnings: open.filter((i) => i.type === "DUPLICATE_INTENT")
      .length,
    methodologyOutdated: open.filter(
      (i) =>
        i.type === "METHODOLOGY_REFRESH_RECOMMENDED" ||
        i.type === "EDITORIAL_METHOD_MISMATCH",
    ).length,
    blockersPublication: open.filter(
      (i) => i.severity === "critical" || i.type === "SCHEDULED_UNSAFE",
    ).length,
  };
}

function publicationReadiness(issues: AuditIssue[]): {
  readiness: PublicationReadiness;
  reasons: string[];
} {
  const open = issues.filter(
    (i) => i.state !== "dismissed" && i.state !== "resolved",
  );
  const critical = open.filter((i) => i.severity === "critical");
  const high = open.filter((i) => i.severity === "high");
  if (critical.length || high.some((i) => i.level === "validity" || i.level === "readiness")) {
    return {
      readiness: "NOT_PUBLISHABLE",
      reasons: [...critical, ...high].slice(0, 5).map((i) => i.message),
    };
  }
  if (open.some((i) => i.severity === "medium" || i.severity === "high")) {
    return {
      readiness: "PUBLISHABLE_WITH_WARNINGS",
      reasons: open.slice(0, 5).map((i) => i.message),
    };
  }
  return { readiness: "PUBLISHABLE", reasons: [] };
}

async function runAuditEngine(input: {
  scope: AuditResult["scope"];
  ctx: AuditCheckContext;
  options?: AuditOptions;
}): Promise<AuditResult> {
  const started = Date.now();
  const now = input.ctx.now;
  const detected = await runChecks(ALL_CHECKS, input.ctx);
  const previous = loadIssueLedger();
  const reconciled = reconcileIssues({
    previous,
    detected,
    scopePrefix: input.scope.id,
    now,
  });
  if (input.options?.persist !== false) {
    saveIssueLedger(reconciled);
  }

  const relevant = detected;
  const { blockers, warnings, opportunities } = partitionIssues(relevant);
  const status = auditStatusFromIssues(relevant);
  const metrics = metricsFrom(relevant);
  const remediations = buildRemediationPlan(relevant);
  const pub = publicationReadiness(relevant);
  const health = computeHealthScore({
    scope: input.scope,
    issues: relevant,
    metrics,
  });

  const notes = [
    `checks=${ALL_CHECKS.length}`,
    `maturityHint=${
      input.scope.kind === "category" && input.scope.id
        ? assessCategoryMaturity(input.scope.id)
        : input.scope.kind === "product" && input.scope.id
          ? assessProductMaturity(input.scope.id)
          : "n/a"
    }`,
  ];
  if (input.scope.kind === "site") {
    const { vendorUi, teaching } = scanTeachingVisualLibrary();
    const teachingFails = teaching.reduce(
      (n, row) => n + row.failingFiles.length,
      0,
    );
    notes.push(
      `teachingVisualBar: ${teachingFails} failing PNG(s) across teaching dirs`,
    );
    notes.push(
      `vendorUiCaptures: ${vendorUi.pngCount} PNGs median ${Math.round(vendorUi.medianBytes / 1024)} KB — excluded from teaching bar`,
    );
  }

  const result = AuditResultSchema.parse({
    id: `audit-${input.scope.kind}-${input.scope.id ?? "all"}-${Date.now()}`,
    scope: input.scope,
    status,
    blockers,
    warnings,
    opportunities,
    metrics,
    health,
    publicationReadiness: pub.readiness,
    publicationReasons: pub.reasons,
    remediations,
    auditedAt: now,
    durationMs: Date.now() - started,
    notes,
  });

  if (input.options?.persist !== false) {
    saveAuditResult(result);
    if (input.options?.baseline) {
      saveAuditSnapshot({
        id: `snap-${result.id}`,
        label: "baseline",
        resultId: result.id,
        metrics: result.metrics,
        criticalCount: result.metrics.criticalIssues,
        highCount: result.metrics.highIssues,
        createdAt: now,
        isBaseline: true,
      });
    } else {
      saveAuditSnapshot({
        id: `snap-${result.id}`,
        resultId: result.id,
        metrics: result.metrics,
        criticalCount: result.metrics.criticalIssues,
        highCount: result.metrics.highIssues,
        createdAt: now,
        isBaseline: false,
      });
    }
    if (input.options?.writeReport) {
      const day = now.slice(0, 10);
      writeMarkdownReport(
        `${day}-${input.scope.kind}${input.scope.id ? `-${input.scope.id}` : ""}.md`,
        formatAuditMarkdown(result),
      );
    }
  }

  return result;
}

export async function auditSite(options?: AuditOptions): Promise<AuditResult> {
  const now = new Date().toISOString();
  return runAuditEngine({
    scope: { kind: "site", id: "site", label: "SoftwareGlimpse site" },
    ctx: { now, forceFresh: options?.forceFresh, fixtures: options?.fixtures },
    options,
  });
}

export async function auditCategory(
  categoryId: string,
  options?: AuditOptions,
): Promise<AuditResult> {
  const now = new Date().toISOString();
  return runAuditEngine({
    scope: {
      kind: "category",
      id: categoryId,
      label: `Category ${categoryId}`,
    },
    ctx: {
      now,
      categorySlug: categoryId,
      forceFresh: options?.forceFresh,
      fixtures: options?.fixtures,
    },
    options,
  });
}

export async function auditProduct(
  productId: string,
  options?: AuditOptions,
): Promise<AuditResult> {
  const now = new Date().toISOString();
  return runAuditEngine({
    scope: { kind: "product", id: productId, label: `Product ${productId}` },
    ctx: {
      now,
      productSlug: productId,
      forceFresh: options?.forceFresh,
      fixtures: options?.fixtures,
    },
    options,
  });
}

export async function auditContent(
  contentId: string,
  options?: AuditOptions,
): Promise<AuditResult> {
  const now = new Date().toISOString();
  const productSlug = contentId.includes("software:")
    ? contentId.split("software:")[1]
    : contentId.includes(":software:")
      ? contentId.split(":").pop()
      : undefined;
  return runAuditEngine({
    scope: { kind: "content", id: contentId, label: contentId },
    ctx: {
      now,
      contentId,
      productSlug,
      forceFresh: options?.forceFresh,
      fixtures: options?.fixtures,
    },
    options,
  });
}

export async function auditBatch(
  sourceIds: string[],
  options?: AuditOptions,
): Promise<AuditResult> {
  const now = new Date().toISOString();
  return runAuditEngine({
    scope: {
      kind: "batch",
      id: `batch-${sourceIds.slice(0, 3).join("-")}`,
      label: `Batch ${sourceIds.length} entries`,
    },
    ctx: {
      now,
      fixtures: { ...(options?.fixtures ?? {}), batchSourceIds: sourceIds },
      forceFresh: true,
    },
    options: { ...options, forceFresh: true },
  });
}

export { formatAuditText, formatAuditMarkdown, ALL_CHECKS };
export type { HealthScore, RemediationItem };
