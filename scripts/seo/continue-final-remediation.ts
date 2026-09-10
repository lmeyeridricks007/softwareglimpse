#!/usr/bin/env npx tsx
/**
 * Continue final remediation: sendcloud inbound, false-MANUAL reclass,
 * comparison triage apply. Does not create new URLs.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getGuideBySlug } from "@/data/repositories/guides";
import { getUseCases } from "@/data";
import { isContentVisible, getSitemapPublicationContext } from "@/domain/publication-context";
import { upsertLinkInjections } from "@/services/seo/improve-linking/injection-store";
import { assessLinkReadiness } from "@/services/seo/improve-linking/link-gates";
import { applyManualReviewTriage } from "@/services/seo/compare-manual-review";
import type { ManualReviewReport } from "@/services/seo/compare-manual-review/types";
import {
  canPromoteToIndexable,
} from "@/services/seo/content-lifecycle/promote";
import { promoteAndPersist } from "@/services/seo/content-lifecycle/promote-persist";
import {
  loadContentLifecycleStoreFromDisk,
  persistContentLifecycleStore,
} from "@/services/seo/content-lifecycle/store-write";
import {
  getLifecycleEntry,
  upsertLifecycleEntry,
} from "@/services/seo/content-lifecycle/store";
import type { GuideAuditReport } from "@/services/seo/guides-index-worthiness/types";

const ROOT = process.cwd();

function main() {
  loadContentLifecycleStoreFromDisk();
  process.env.SG_ENFORCE_LINK_READINESS = "1";
  process.env.SG_LINK_READINESS_LIGHT = "1";

  const useCase = getUseCases().find((u) => u.slug === "order-fulfillment");
  if (!useCase || useCase.seo.indexable !== true) {
    throw new Error("order-fulfillment use case missing or not indexable");
  }

  upsertLinkInjections([
    {
      fromPath: "/use-cases/order-fulfillment/",
      toPath: "/guides/what-is-sendcloud/",
      label: "What Is Sendcloud?",
      module: "relatedGuides",
      reason:
        "Order-fulfillment use case → shipping-label / returns explainer for Sendcloud",
      batchId: "what-is-sendcloud-inbound-2026-09-10",
      requireIndexable: false,
      score: 88,
    },
  ]);

  const linkReady = assessLinkReadiness("/guides/what-is-sendcloud/", {
    kind: "guide",
    slug: "what-is-sendcloud",
    light: true,
  });
  console.log("sendcloud link readiness", linkReady);

  const guide = getGuideBySlug("what-is-sendcloud", { includeUnpublished: true });
  if (!guide) throw new Error("what-is-sendcloud missing");
  const visible = isContentVisible(
    {
      status: guide.metadata.status,
      publishedAt: guide.metadata.publishedAt,
      scheduledAt: guide.metadata.scheduledAt,
    },
    getSitemapPublicationContext(),
    new Date(),
  );
  const promoteDecision = canPromoteToIndexable({ kind: "guide", entity: guide });
  console.log("sendcloud visible-for-sitemap", visible);
  console.log("sendcloud canPromote", {
    ok: promoteDecision.ok,
    lifecycle: promoteDecision.lifecycle,
    detail: promoteDecision.detail,
  });

  if (promoteDecision.ok && visible) {
    const promoted = promoteAndPersist({ kind: "guide", entity: guide });
    console.log("sendcloud promote", promoted.ok, promoted.detail);
  } else if (promoteDecision.ok && !visible) {
    console.log(
      "sendcloud links/quality pass but publishing calendar blocks sitemap INDEXABLE",
      guide.metadata.scheduledAt,
    );
  }

  const audit = JSON.parse(
    readFileSync(path.join(ROOT, "data/seo/guides-audit.json"), "utf8"),
  ) as GuideAuditReport;

  let falseManualToImprove = 0;
  let manualActuallyRequired = 0;
  const manualReasons: Array<{ slug: string; bucket: string; reasons: string[] }> =
    [];

  for (const e of audit.evaluations) {
    if (e.lifecycle !== "MANUAL_REVIEW") continue;
    const intentOverlap = (e.reasons ?? []).some(
      (r) =>
        r.includes("Intent cluster") ||
        r.includes("intent overlap") ||
        r.includes("Industry or cross-category"),
    );
    const actuallyRequired =
      e.classification === "REVIEW_MANUALLY" || intentOverlap;
    if (actuallyRequired) {
      manualActuallyRequired += 1;
      manualReasons.push({
        slug: e.slug,
        bucket: "MANUAL_ACTUALLY_REQUIRED",
        reasons: e.reasons.slice(0, 4),
      });
      continue;
    }

    const existing = getLifecycleEntry("guide", e.slug);
    upsertLifecycleEntry({
      kind: "guide",
      slug: e.slug,
      lifecycle: "IMPROVE",
      previousLifecycle: existing?.lifecycle ?? "MANUAL_REVIEW",
      notes:
        "false-manual-reclass: uniqueness/template blockers belong in IMPROVE, not MANUAL_REVIEW",
      updatedAt: new Date().toISOString(),
      passedReasons: existing?.passedReasons,
      indexable: existing?.indexable,
      promotedAt: existing?.promotedAt,
    });
    falseManualToImprove += 1;
  }

  persistContentLifecycleStore();
  console.log("guide false-manual → IMPROVE", falseManualToImprove);
  console.log("guide MANUAL_ACTUALLY_REQUIRED", manualActuallyRequired);

  const compareReport = JSON.parse(
    readFileSync(path.join(ROOT, "data/seo/compare-manual-review.json"), "utf8"),
  ) as ManualReviewReport;
  const applied = applyManualReviewTriage(compareReport);
  console.log("compare triage apply", applied);

  mkdirSync(path.join(ROOT, "data/review"), { recursive: true });
  writeFileSync(
    path.join(ROOT, "data/review/manual-queue-classification.json"),
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        guides: {
          falseManualToImprove,
          manualActuallyRequired,
          remainingManual: manualReasons,
        },
        comparisons: {
          appliedToImprove: applied.appliedToImprove,
          retainedManualReview: applied.retainedManualReview,
          skippedIndexable: applied.skippedIndexable,
        },
        sendcloud: {
          linkReady,
          sitemapVisible: visible,
          canPromote: promoteDecision.ok,
          scheduledAt: guide.metadata.scheduledAt ?? null,
        },
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

main();
