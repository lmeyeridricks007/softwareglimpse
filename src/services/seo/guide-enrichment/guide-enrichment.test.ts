import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getGuides } from "@/data/repositories/guides";
import { isProductExplainerGuide } from "@/services/seo/guides-index-worthiness";
import {
  applyGuideEnrichment,
  checkExplainerReviewCannibalization,
  classifyEnrichmentGuideType,
  planGuideEnrichment,
  peekEnrichmentBatch,
  productExplainerSeo,
  runEnrichmentQa,
  uniqueValueGap,
  validateAndMaybePromoteGuide,
  mergeGuideWithOverlay,
} from "@/services/seo/guide-enrichment";
import { loadGuideEnrichmentOverlay } from "@/services/seo/guide-enrichment/overlay-store";
import { resetContentLifecycleCache } from "@/services/seo/content-lifecycle";

describe("guide enrichment", () => {
  let tempDir: string;
  let previousOverlays: string | undefined;
  let previousLifecycle: string | undefined;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), "sg-enrich-"));
    previousOverlays = process.env.SG_GUIDE_ENRICHMENT_OVERLAYS;
    previousLifecycle = process.env.SG_CONTENT_LIFECYCLE_PATH;
    process.env.SG_GUIDE_ENRICHMENT_OVERLAYS = path.join(tempDir, "overlays");
    process.env.SG_CONTENT_LIFECYCLE_PATH = path.join(
      tempDir,
      "content-lifecycle.json",
    );
    resetContentLifecycleCache();
  });

  afterEach(() => {
    if (previousOverlays === undefined) {
      delete process.env.SG_GUIDE_ENRICHMENT_OVERLAYS;
    } else {
      process.env.SG_GUIDE_ENRICHMENT_OVERLAYS = previousOverlays;
    }
    if (previousLifecycle === undefined) {
      delete process.env.SG_CONTENT_LIFECYCLE_PATH;
    } else {
      process.env.SG_CONTENT_LIFECYCLE_PATH = previousLifecycle;
    }
    resetContentLifecycleCache();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("classifies product explainers as informational orientation", () => {
    const explainer = getGuides().find((g) => isProductExplainerGuide(g));
    expect(explainer).toBeTruthy();
    expect(classifyEnrichmentGuideType(explainer!)).toBe("PRODUCT_EXPLAINER");

    const plan = planGuideEnrichment(explainer!);
    expect(plan.enrichmentType).toBe("PRODUCT_EXPLAINER");
    expect(plan.blueprint.requiredSections).toContain("pricing_expectations");
    expect(plan.blueprint.requiredSections).toContain("integrations");
    expect(plan.intent.commercialIntent).toBe("informational");
    expect(plan.intent.primaryIntent.toLowerCase()).toMatch(/what is/);
    expect(plan.decisionActions.some((a) => a.kind === "review")).toBe(true);
  }, 60_000);

  it("keeps explainer SEO distinct from review evaluation intent", () => {
    const seo = productExplainerSeo("Pipedrive", "crm");
    expect(seo.title.toLowerCase()).toContain("what is");
    expect(seo.description.toLowerCase()).toMatch(/orient/);
    expect(seo.title.toLowerCase()).not.toMatch(/\breview\b/);
  });

  it("queues IMPROVE guides without inventing replacement URLs", () => {
    const batch = peekEnrichmentBatch(25);
    expect(batch.length).toBeGreaterThan(5);
    expect(batch.length).toBeLessThanOrEqual(25);
    for (const item of batch) {
      expect(item.url).toMatch(/^\/guides\/.+\//);
      expect(item.slug.length).toBeGreaterThan(0);
      expect(item.priorityScore).toBeGreaterThan(0);
      expect(["A", "B", "C"]).toContain(item.lane);
    }
    // Zero-impression items must not occupy the whole A-weighted batch ahead of demand.
    const laneA = batch.filter((i) => i.lane === "A");
    for (const item of laneA) {
      expect(
        item.prioritySignals.gscImpressions > 0 ||
          item.prioritySignals.gscClicks > 0 ||
          item.prioritySignals.realAiCitations > 0 ||
          item.prioritySignals.knownBacklinks > 0 ||
          item.prioritySignals.hasDirectQuery,
      ).toBe(true);
    }
  }, 120_000);

  it("applies product-specific orientation to an existing what-is-{product} URL", () => {
    const explainer =
      getGuides().find(
        (g) =>
          isProductExplainerGuide(g) && g.productSlugs[0] === "hubspot",
      ) ?? getGuides().find((g) => isProductExplainerGuide(g));
    expect(explainer).toBeTruthy();

    const beforeGap = uniqueValueGap(
      explainer!,
      classifyEnrichmentGuideType(explainer!),
    );
    const result = applyGuideEnrichment(explainer!, {
      peerGuides: getGuides()
        .filter((g) => g.slug !== explainer!.slug)
        .slice(0, 20),
    });

    if (!result.applied) {
      expect(result.notes.join(" ")).toMatch(
        /QA|unavailable|omit|Apply|Plan|signal|Insufficient/i,
      );
      return;
    }

    expect(result.overlayPath).toBeTruthy();
    expect(result.uniqueValueAdded.length).toBeGreaterThan(2);

    const overlay = loadGuideEnrichmentOverlay(explainer!.slug);
    const merged = mergeGuideWithOverlay(explainer!, overlay);
    expect(merged.slug).toBe(explainer!.slug);
    expect((merged.blocks?.length ?? 0)).toBeGreaterThanOrEqual(8);
    expect(merged.seo.title?.toLowerCase()).toMatch(/what is/);
    expect(merged.nextAction?.label.toLowerCase()).toMatch(/review/);
    expect(
      merged.blocks?.some((b) => b.type === "related-content"),
    ).toBe(true);

    const cannibal = checkExplainerReviewCannibalization(merged);
    expect(cannibal.ok).toBe(true);
    expect(cannibal.explainerIntent).toBe("informational");
    expect(cannibal.reviewIntent).toBe("commercial_evaluation");

    const afterGap = uniqueValueGap(
      merged,
      classifyEnrichmentGuideType(merged),
    );
    expect(afterGap.present.length).toBeGreaterThanOrEqual(
      beforeGap.present.length,
    );

    const qa = runEnrichmentQa(merged);
    expect(qa.findings.some((f) => f.code === "generic_ai_filler")).toBe(false);
    expect(
      qa.findings.some(
        (f) =>
          f.code === "review_intent_cannibalization" && f.severity === "block",
      ),
    ).toBe(false);
  }, 60_000);

  it("does not promote when unique value / QA fails", () => {
    const thin = getGuides().find((g) => isProductExplainerGuide(g));
    expect(thin).toBeTruthy();
    const decision = validateAndMaybePromoteGuide(thin!, { promote: true });
    expect(decision.promoted).toBe(false);
    expect(decision.ok).toBe(false);
  }, 60_000);
});
