import { getAllSoftwareUnfiltered } from "@/data";
import {
  getAffiliateProgramme,
  listAffiliateDestinations,
  listAffiliateProgrammes,
  listPromotions,
} from "@/data/affiliates/store";
import { listWorkflowRuns } from "@/data/workflows/store";
import { listApprovals } from "@/data/workflows/store";
import { WORKFLOW_EXECUTION_CONFIG } from "@/data/config/workflows/execution";
import { isOptionalContinuePolicy } from "@/services/workflow-orchestration/dependency";
import { buildContentRegistry } from "@/services/publishing/registry";
import {
  derivePromotionEffectiveStatus,
  isPromotionStale,
  validatePromotionConflicts,
} from "@/services/affiliate/promotions";
import { resolveCommercialCta } from "@/services/affiliate/resolve-cta";
import { validateAffiliateUrl } from "@/services/affiliate/url-validation";
import { validateOutboundLinks } from "@/services/outbound/validate-links";
import type { WorkflowRun } from "@/domain";
import type { AuditCheck } from "../framework";
import { issue } from "../framework";

/**
 * Required editorial wait is normal. Flag immediately when the run is blocked,
 * or when an optional continue-with-warning step parked the whole workflow.
 * Healthy review-required gates become stuck after `stuckAfterMs`.
 */
export function isWorkflowStuck(
  run: WorkflowRun,
  nowMs: number,
  stuckAfterMs = WORKFLOW_EXECUTION_CONFIG.stuckAfterMs,
): boolean {
  if (run.status === "blocked") return true;
  if (run.status !== "waiting" && run.status !== "review-required") {
    return false;
  }

  const requiredGate = run.steps.some(
    (step) =>
      step.required &&
      (step.status === "waiting" || step.status === "review-required"),
  );
  const optionalStall = run.steps.some(
    (step) =>
      isOptionalContinuePolicy(step) &&
      (step.status === "review-required" || step.status === "waiting"),
  );

  if (!requiredGate && optionalStall) return true;
  if (!requiredGate) return true;

  const updated = Date.parse(run.updatedAt);
  if (Number.isNaN(updated)) return true;
  return nowMs - updated >= stuckAfterMs;
}

/**
 * Affiliate integrity + ops/workflow/scheduled safety.
 * Ranking isolation is enforced in recommendation tests — site audit verifies structure.
 */
export const affiliateOpsChecks: AuditCheck[] = [
  {
    id: "affiliate-ranking-isolation-invariant",
    level: "validity",
    description: "Structural invariant: software.affiliate must not feed scoring fields",
    run(ctx) {
      const issues = [];
      // Soft check: affiliate enabled products still published is OK;
      // flag if shortDescription mentions commission
      for (const product of getAllSoftwareUnfiltered()) {
        if (ctx.productSlug && product.slug !== ctx.productSlug) continue;
        const blob = JSON.stringify(product.affiliate ?? {});
        if (/commission|payout|epc/i.test(product.shortDescription ?? "")) {
          issues.push(
            issue(
              {
                type: "AFFILIATE_BIAS",
                level: "validity",
                severity: "critical",
                message: `${product.slug}: affiliate economics language in product description`,
                productSlug: product.slug,
              },
              ctx.now,
            ),
          );
        }
        if (/commissionAmount|payoutPercent/i.test(blob)) {
          issues.push(
            issue(
              {
                type: "AFFILIATE_BIAS",
                level: "validity",
                severity: "critical",
                message: `${product.slug}: commission fields present on software affiliate object`,
                productSlug: product.slug,
                evidence: "Affiliate economics must stay out of product ranking inputs",
              },
              ctx.now,
            ),
          );
        }
      }
      return issues;
    },
  },
  {
    id: "disclosure-expectation",
    level: "readiness",
    description: "Published affiliate-enabled software should require disclosure",
    run(ctx) {
      const issues = [];
      for (const product of getAllSoftwareUnfiltered()) {
        if (ctx.productSlug && product.slug !== ctx.productSlug) continue;
        if (
          product.metadata.status === "published" &&
          product.affiliate?.enabled &&
          product.affiliate.disclosureRequired === false
        ) {
          issues.push(
            issue(
              {
                type: "MISSING_DISCLOSURE",
                level: "readiness",
                severity: "high",
                message: `${product.slug}: affiliate enabled but disclosureRequired=false`,
                productSlug: product.slug,
                path: `/software/${product.slug}/`,
                commercialBoost: true,
              },
              ctx.now,
            ),
          );
        }
      }
      return issues;
    },
  },
  {
    id: "scheduled-unsafe",
    level: "readiness",
    description: "Scheduled content that is no longer publishable",
    run(ctx) {
      const issues = [];
      const fixture = ctx.fixtures?.staleScheduled as
        | {
            contentId: string;
            path: string;
            reason: string;
          }
        | undefined;
      if (fixture) {
        issues.push(
          issue(
            {
              type: "SCHEDULED_UNSAFE",
              level: "readiness",
              severity: "critical",
              message: `Scheduled page unsafe to publish: ${fixture.reason}`,
              contentId: fixture.contentId,
              path: fixture.path,
              evidence: fixture.reason,
            },
            ctx.now,
          ),
        );
      }

      for (const entry of buildContentRegistry()) {
        if (entry.metadata.status !== "scheduled") continue;
        if (ctx.contentId && entry.contentId !== ctx.contentId) continue;
        if (entry.metadata.researchStatus === "stale") {
          issues.push(
            issue(
              {
                type: "SCHEDULED_UNSAFE",
                level: "readiness",
                severity: "critical",
                message: `${entry.contentId}: scheduled but research stale`,
                contentId: entry.contentId,
                path: entry.path,
              },
              ctx.now,
            ),
          );
        }
      }
      return issues;
    },
  },
  {
    id: "workflow-stuck",
    level: "readiness",
    description: "Workflows blocked, optionally stalled, or waiting too long",
    run(ctx) {
      const issues = [];
      const nowMs = Date.parse(ctx.now);
      for (const run of listWorkflowRuns()) {
        if (ctx.productSlug && run.targetId !== ctx.productSlug) continue;
        if (!isWorkflowStuck(run, nowMs)) continue;
        issues.push(
          issue(
            {
              type: "WORKFLOW_STUCK",
              level: "readiness",
              severity: "medium",
              message: `Workflow ${run.id} status=${run.status} target=${run.targetId}`,
              entityType: "workflow",
              entityId: run.id,
              productSlug:
                run.targetType === "software" ? run.targetId : undefined,
            },
            ctx.now,
          ),
        );
      }
      return issues;
    },
  },
  {
    id: "approval-backlog",
    level: "readiness",
    description: "Pending editorial approvals",
    run(ctx) {
      const issues = [];
      for (const a of listApprovals()) {
        if (a.status !== "pending") continue;
        if (
          ctx.productSlug &&
          a.targetId !== ctx.productSlug &&
          !String(a.targetId).includes(ctx.productSlug) &&
          !String(a.draftId ?? "").includes(ctx.productSlug)
        ) {
          continue;
        }
        if (
          ctx.categorySlug &&
          !String(a.targetId).includes(ctx.categorySlug)
        ) {
          // keep site-wide; category filter is loose
        }
        issues.push(
          issue(
            {
              type: "APPROVAL_BACKLOG",
              level: "readiness",
              severity: "low",
              message: `Pending approval ${a.id} (${a.type}) for ${a.targetId}`,
              entityType: "approval",
              entityId: a.id,
              productSlug: ctx.productSlug,
            },
            ctx.now,
          ),
        );
      }
      return issues;
    },
  },
  {
    id: "affiliate-destination-integrity",
    level: "readiness",
    description: "Centralized affiliate destinations must be well-formed",
    run(ctx) {
      const issues = [];
      const defaults = new Map<string, number>();
      const now = new Date(ctx.now);

      for (const dest of listAffiliateDestinations()) {
        if (ctx.productSlug && dest.productSlug !== ctx.productSlug) continue;
        const url = validateAffiliateUrl(dest.url);
        if (!url.ok) {
          issues.push(
            issue(
              {
                type: "MALFORMED_AFFILIATE_URL",
                level: "readiness",
                severity: "high",
                message: `${dest.id}: ${url.message}`,
                productSlug: dest.productSlug,
                commercialBoost: true,
              },
              ctx.now,
            ),
          );
        }
        const programme = getAffiliateProgramme(dest.programmeId);
        if (
          dest.status === "active" &&
          programme &&
          programme.status !== "active"
        ) {
          issues.push(
            issue(
              {
                type: "INACTIVE_AFFILIATE_USED",
                level: "readiness",
                severity: "high",
                message: `${dest.id}: destination active but programme ${programme.status}`,
                productSlug: dest.productSlug,
                commercialBoost: true,
              },
              ctx.now,
            ),
          );
        }
        if (dest.isDefault && dest.status === "active") {
          defaults.set(
            dest.productSlug,
            (defaults.get(dest.productSlug) ?? 0) + 1,
          );
        }
      }

      for (const [slug, count] of defaults) {
        if (count > 1) {
          issues.push(
            issue(
              {
                type: "MULTIPLE_DEFAULT_DESTINATIONS",
                level: "readiness",
                severity: "high",
                message: `${slug}: ${count} default destinations`,
                productSlug: slug,
                commercialBoost: true,
              },
              ctx.now,
            ),
          );
        }
      }

      for (const programme of listAffiliateProgrammes()) {
        if (programme.status !== "active") continue;
        for (const slug of programme.productSlugs) {
          if (ctx.productSlug && slug !== ctx.productSlug) continue;
          const hasDest = listAffiliateDestinations().some(
            (d) =>
              d.productSlug === slug &&
              d.programmeId === programme.id &&
              d.status === "active",
          );
          if (!hasDest) {
            issues.push(
              issue(
                {
                  type: "MISSING_AFFILIATE_DESTINATION",
                  level: "readiness",
                  severity: "medium",
                  message: `${slug}: active programme without destination`,
                  productSlug: slug,
                  commercialBoost: true,
                },
                ctx.now,
              ),
            );
          }
        }
      }

      for (const promo of listPromotions()) {
        if (ctx.productSlug && promo.productSlug !== ctx.productSlug) continue;
        const effective = derivePromotionEffectiveStatus(promo, now);
        if (promo.status === "active" && effective === "expired") {
          // Not visible via resolver — informational commercial hygiene
          issues.push(
            issue(
              {
                type: "EXPIRED_PROMOTION_VISIBLE",
                level: "quality",
                severity: "low",
                message: `${promo.id}: manual status active but dates expired (resolver hides it)`,
                productSlug: promo.productSlug,
                commercialBoost: true,
              },
              ctx.now,
            ),
          );
        }
        if (
          effective === "active" &&
          (!promo.verifiedAt || isPromotionStale(promo, now))
        ) {
          issues.push(
            issue(
              {
                type: promo.verifiedAt ? "STALE_PROMOTION" : "UNVERIFIED_PROMOTION",
                level: "readiness",
                severity: "medium",
                message: `${promo.id}: promotion needs re-verification`,
                productSlug: promo.productSlug,
                commercialBoost: true,
              },
              ctx.now,
            ),
          );
        }
        if (promo.destinationId) {
          const dest = listAffiliateDestinations().find(
            (d) => d.id === promo.destinationId,
          );
          if (!dest || dest.status !== "active") {
            issues.push(
              issue(
                {
                  type: "BROKEN_PROMOTION_DESTINATION",
                  level: "readiness",
                  severity: "high",
                  message: `${promo.id}: promotion destination missing/inactive`,
                  productSlug: promo.productSlug,
                  commercialBoost: true,
                },
                ctx.now,
              ),
            );
          }
        }
      }

      for (const conflict of validatePromotionConflicts(listPromotions())) {
        issues.push(
          issue(
            {
              type: "PROMOTION_CONFLICT",
              level: "readiness",
              severity: "medium",
              message: conflict.message,
              commercialBoost: true,
            },
            ctx.now,
          ),
        );
      }

      // Official fallback should remain when affiliate inactive
      for (const product of getAllSoftwareUnfiltered()) {
        if (ctx.productSlug && product.slug !== ctx.productSlug) continue;
        if (product.metadata.status !== "published") continue;
        const cta = resolveCommercialCta(
          { productSlug: product.slug, context: "software-review" },
          product,
        );
        if (!cta.available && !product.website && !product.affiliate.destinationUrl) {
          issues.push(
            issue(
              {
                type: "MISSING_CTA_FALLBACK",
                level: "readiness",
                severity: "medium",
                message: `${product.slug}: no affiliate or official CTA destination`,
                productSlug: product.slug,
                path: `/software/${product.slug}/`,
              },
              ctx.now,
            ),
          );
        }
      }

      return issues;
    },
  },
  {
    id: "outbound-link-validation",
    level: "quality",
    description:
      "Direct affiliate destinations, sponsored policy inputs, and evidence source health",
    run(ctx) {
      const issues = [];
      const findings = validateOutboundLinks({
        productSlug: ctx.productSlug,
      });
      for (const finding of findings) {
        const type =
          finding.code === "EVIDENCE_AFFILIATE_AS_SOURCE"
            ? ("RAW_AFFILIATE_URL" as const)
            : finding.code === "EVIDENCE_UNAVAILABLE" ||
                finding.code === "UNVERIFIED_SOURCE" ||
                finding.code === "MISSING_PRICING_SOURCE"
              ? ("SOURCE_QUALITY" as const)
              : ("AFFILIATE_LINK_HEALTH" as const);
        issues.push(
          issue(
            {
              type,
              level: "quality",
              severity: finding.severity,
              message: finding.message,
              productSlug: finding.productSlug,
              path: `/software/${finding.productSlug}/`,
              evidence: finding.url,
            },
            ctx.now,
          ),
        );
      }
      return issues;
    },
  },
];
