import { describe, expect, it } from "vitest";
import {
  getBestPageBySlug,
  getComparisonBySlug,
  getResourceBySlug,
} from "@/data";
import { getResourceHubProfile } from "@/data/resource-hub";
import { runContentQualityAudit } from "./audit-engine";
import { loadAuditSnapshots } from "./loaders/inventory";
import { QUALITY_AGENT_BY_PAGE_TYPE } from "./agents";
import {
  assignImprovementPriority,
  classifyPageImportance,
} from "./priority";
import { evaluatePageQuality } from "./evaluate";
import { snapshotFromBestPage } from "./loaders/best";
import { snapshotFromComparison } from "./loaders/comparisons";
import { snapshotFromGuide } from "./loaders/guides";
import { snapshotFromResource } from "./loaders/resources";
import { getGuideBySlug } from "@/data/repositories/guides";
import { getCapabilityHubProfile, listCapabilityHubProfiles } from "@/data/capability-hub";

describe("content quality audit agents", () => {
  it("registers page-type quality agents", () => {
    expect(QUALITY_AGENT_BY_PAGE_TYPE.guide.label).toBe("GuideQualityAgent");
    expect(QUALITY_AGENT_BY_PAGE_TYPE["product-review"].label).toBe(
      "ProductReviewQualityAgent",
    );
    expect(QUALITY_AGENT_BY_PAGE_TYPE.industry.label).toBe(
      "IndustryQualityAgent",
    );
  });

  it(
    "loads live CRM snapshots across page types",
    () => {
      const snaps = loadAuditSnapshots("crm");
      expect(snaps.length).toBeGreaterThan(100);
      const types = new Set(snaps.map((s) => s.snapshot.pageType));
      expect(types.has("guide") || types.has("article")).toBe(true);
      expect(types.has("product-review")).toBe(true);
      expect(types.has("comparison")).toBe(true);
    },
    30_000,
  );

  it("includes AI, IT, and child-category best pages when products exist", () => {
    const snaps = loadAuditSnapshots("best");
    const slugs = snaps.map((s) => s.slug);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "ai-software",
        "it-development-software",
        "email-marketing-software",
      ]),
    );
  });

  it("assigns priorities without marking all low scores P1", () => {
    const snaps = loadAuditSnapshots("guides").slice(0, 5);
    expect(snaps.length).toBeGreaterThan(0);
    const priorities = new Set<string>();
    for (const s of snaps) {
      const assessment = evaluatePageQuality(s.snapshot, {
        evaluatedAt: "2026-08-15T00:00:00.000Z",
      });
      const pageImportance = classifyPageImportance(
        assessment.route,
        assessment.pageType,
      );
      priorities.add(
        assignImprovementPriority({
          assessment,
          pageImportance,
          journeyImportance: "medium",
        }),
      );
    }
    expect(priorities.size).toBeGreaterThan(0);
  });

  it("runs a scoped audit without writing when requested", () => {
    const result = runContentQualityAudit({
      scope: "reviews",
      writeReports: false,
      writeMaster: false,
      evaluatedAt: "2026-08-15T00:00:00.000Z",
    });
    expect(result.summary.pagesEvaluated).toBeGreaterThan(5);
    expect(result.results.every((r) => r.assessment.pageType === "product-review")).toBe(
      true,
    );
    expect(result.summary.averageScore).toBeGreaterThan(0);
  });

  it("indexes completed comparison mesh and keeps researched Apollo pairs indexable", () => {
    const herokuRailway = getComparisonBySlug("heroku-vs-railway", {
      includeUnpublished: true,
    });
    expect(herokuRailway).toBeTruthy();
    expect(herokuRailway!.seo?.indexable).toBe(true);
    expect(herokuRailway!.metadata?.researchStatus).toBe("complete");
    const freePlan = herokuRailway!.outcomes?.find(
      (o) => o.criterionSlug === "free-plan",
    );
    expect(freePlan?.winnerKind).toBe("product-b");

    const stillThin = getComparisonBySlug("outreach-vs-salesloft", {
      includeUnpublished: true,
    });
    expect(stillThin).toBeTruthy();
    // Identical approved SI assessments → researched close-peer, now indexable.
    expect(stillThin!.seo?.indexable).toBe(true);
    expect(stillThin!.metadata?.researchStatus).toBe("complete");
    expect(
      (stillThin!.outcomes ?? []).every(
        (o) => o.winnerKind === "tie" || o.winnerKind === "depends",
      ),
    ).toBe(true);

    const mondayZoho = getComparisonBySlug("monday-sales-crm-vs-zoho-crm", {
      includeUnpublished: true,
    });
    expect(mondayZoho).toBeTruthy();
    expect(mondayZoho!.seo?.indexable).toBe(true);
    expect(mondayZoho!.metadata?.researchStatus).toBe("complete");

    const asanaClickup = getComparisonBySlug("asana-vs-clickup", {
      includeUnpublished: true,
    });
    expect(asanaClickup).toBeTruthy();
    expect(asanaClickup!.seo?.indexable).toBe(true);

    const comparison = getComparisonBySlug("apptivo-vs-hubspot", {
      includeUnpublished: true,
    });
    expect(comparison).toBeTruthy();
    const snapshot = snapshotFromComparison(comparison!);
    const assessment = evaluatePageQuality(snapshot, {
      evaluatedAt: "2026-08-18T21:00:00.000Z",
    });
    expect(snapshot.differentiation.distinctPurpose).toBe(true);
    expect(
      (comparison!.outcomes ?? []).some((o) =>
        /comparable support/i.test(o.reason ?? ""),
      ),
    ).toBe(false);
    expect(assessment.overallScore).toBeGreaterThanOrEqual(70);
    const priority = assignImprovementPriority({
      assessment,
      pageImportance: classifyPageImportance(
        assessment.route,
        assessment.pageType,
      ),
      journeyImportance: "medium",
    });
    expect(priority).not.toBe("CQ-P0");
  });

  it("scores previously thin Apollo comparisons as complete researched pages", () => {
    for (const slug of ["apollo-vs-lusha", "apollo-vs-rocketreach"]) {
      const comparison = getComparisonBySlug(slug, { includeUnpublished: true });
      expect(comparison, slug).toBeTruthy();
      const snapshot = snapshotFromComparison(comparison!);
      const assessment = evaluatePageQuality(snapshot, {
        evaluatedAt: "2026-08-18T15:00:00.000Z",
      });
      expect(assessment.overallScore).toBeGreaterThanOrEqual(85);
      expect(snapshot.missingSections).toEqual([]);
      expect(
        assessment.dimensions.find((d) => d.id === "visual-media-support")?.score,
      ).toBeGreaterThanOrEqual(4);
    }
  });

  it("scores the CRM comparison worksheet and email-marketing best page above the old thin bar", () => {
    const resource = getResourceBySlug("crm-comparison-worksheet", {
      includeUnpublished: true,
    });
    expect(resource).toBeTruthy();
    const worksheet = snapshotFromResource(
      resource!,
      getResourceHubProfile("crm-comparison-worksheet"),
    );
    const worksheetScore = evaluatePageQuality(worksheet, {
      evaluatedAt: "2026-08-18T15:00:00.000Z",
    }).overallScore;
    expect(worksheetScore).toBeGreaterThanOrEqual(85);

    const page = getBestPageBySlug("email-marketing-software", {
      includeUnpublished: true,
    });
    expect(page).toBeTruthy();
    const best = snapshotFromBestPage(page!);
    const bestScore = evaluatePageQuality(best, {
      evaluatedAt: "2026-08-18T15:00:00.000Z",
    }).overallScore;
    expect(bestScore).toBeGreaterThanOrEqual(85);
    expect(best.presentSections).toContain("next-step");
  });

  it("scores job-cluster best pages (no cross-cluster ranked list) at 80+", () => {
    for (const slug of [
      "hr-software",
      "ecommerce-software",
      "ai-software",
      "customer-service-software",
      "it-development-software",
    ]) {
      const page = getBestPageBySlug(slug, { includeUnpublished: true });
      expect(page, slug).toBeTruthy();
      expect(page!.recommendations).toEqual([]);
      expect((page!.useCaseRecommendations ?? []).length).toBeGreaterThanOrEqual(
        2,
      );
      const snapshot = snapshotFromBestPage(page!);
      const score = evaluatePageQuality(snapshot, {
        evaluatedAt: "2026-08-18T18:30:00.000Z",
      }).overallScore;
      expect(score, slug).toBeGreaterThanOrEqual(80);
      expect(snapshot.missingSections, slug).toEqual([]);
    }
  });

  it("credits criteria tables as teaching visuals on marketing comparisons", () => {
    const comparison = getComparisonBySlug("klaviyo-vs-omnisend", {
      includeUnpublished: true,
    });
    expect(comparison).toBeTruthy();
    const snapshot = snapshotFromComparison(comparison!);
    expect(snapshot.presentSections).toContain("evidence");
    const visual = evaluatePageQuality(snapshot, {
      evaluatedAt: "2026-08-18T15:00:00.000Z",
    }).dimensions.find((d) => d.id === "visual-media-support");
    expect(visual?.score).toBeGreaterThanOrEqual(4);
  });

  it("keeps researched Apollo comparisons indexable and fact-backed", () => {
    for (const slug of ["apollo-vs-lusha", "apollo-vs-rocketreach"]) {
      const comparison = getComparisonBySlug(slug, { includeUnpublished: true });
      expect(comparison, slug).toBeTruthy();
      expect(comparison!.seo?.indexable).toBe(true);
      expect(comparison!.verdict?.trim().length).toBeGreaterThan(40);
      expect((comparison!.outcomes ?? []).length).toBeGreaterThanOrEqual(6);
      expect(
        (comparison!.outcomes ?? []).every(
          (outcome) => (outcome.supportingFactIds?.length ?? 0) > 0,
        ),
      ).toBe(true);
    }
  });

  it("fills CRM administration and scalability rows with existing facts", () => {
    const comparison = getComparisonBySlug("hubspot-vs-pipedrive", {
      includeUnpublished: true,
    });
    expect(comparison).toBeTruthy();
    for (const slug of ["administration", "scalability"]) {
      const row = comparison!.outcomes?.find((o) => o.criterionSlug === slug);
      expect(row, slug).toBeTruthy();
      expect((row!.supportingFactIds ?? []).length).toBeGreaterThan(0);
    }
  });

  it("does not raise COMPARISON_EVIDENCE_IMBALANCE for empty winners or indexable shells", async () => {
    const { editorialConsistencyChecks } = await import(
      "@/services/site-audit/checks/editorial"
    );
    const check = editorialConsistencyChecks.find(
      (item) => item.id === "comparison-evidence-parity",
    );
    expect(check).toBeTruthy();
    const issues = await check!.run({ now: "2026-08-18T16:20:00.000Z" });
    const imbalance = issues.filter(
      (issue) => issue.type === "COMPARISON_EVIDENCE_IMBALANCE",
    );
    expect(
      imbalance.filter((issue) => issue.message.includes("lacks supporting facts")),
    ).toEqual([]);
    expect(
      imbalance.filter((issue) =>
        issue.message.includes("structurally incomplete"),
      ),
    ).toEqual([]);
  });

  it("scores CS product what-is and worth-it guides above the old P1 bar", () => {
    for (const slug of [
      "what-is-gorgias",
      "is-gorgias-worth-it",
      "what-is-freshdesk",
      "is-tidio-worth-it",
    ]) {
      const guide = getGuideBySlug(slug, { includeUnpublished: true });
      expect(guide, slug).toBeTruthy();
      const assessment = evaluatePageQuality(snapshotFromGuide(guide!), {
        evaluatedAt: "2026-08-18T20:00:00.000Z",
      });
      expect(assessment.overallScore, slug).toBeGreaterThanOrEqual(70);
      expect(assessment.criticalGaps, slug).toEqual([]);
      const journey = assessment.dimensions.find((d) => d.id === "journey-next-step");
      expect(journey?.score, slug).toBeGreaterThanOrEqual(4);
      const decision = assessment.dimensions.find((d) => d.id === "decision-support");
      expect(decision?.score, slug).toBeGreaterThanOrEqual(4);
    }
  });

  it("credits existing guide block examples, limitations, and review sources so leftover CQ-P2 clears", () => {
    const glossary = getGuideBySlug("crm-glossary", { includeUnpublished: true });
    expect(glossary).toBeTruthy();
    const glossarySnap = snapshotFromGuide(glossary!);
    expect(glossarySnap.presentSections).toContain("examples");
    expect(glossarySnap.missingSections).not.toContain("examples");

    const worthIt = getGuideBySlug("is-pipedrive-worth-it", {
      includeUnpublished: true,
    });
    expect(worthIt).toBeTruthy();
    const worthSnap = snapshotFromGuide(worthIt!);
    expect(worthSnap.presentSections).toContain("prerequisites");
    expect(worthSnap.presentSections).toContain("limitations");
    const worthAssessment = evaluatePageQuality(worthSnap, {
      evaluatedAt: "2026-08-19T06:00:00.000Z",
    });
    expect(worthAssessment.majorImprovements.join(" ")).not.toMatch(
      /prerequisites|limitations/i,
    );

    const uatResource = getResourceBySlug("crm-uat-test-script");
    expect(uatResource).toBeTruthy();
    const uat = snapshotFromResource(
      uatResource!,
      getResourceHubProfile("crm-uat-test-script"),
    );
    const uatAssessment = evaluatePageQuality(uat, {
      evaluatedAt: "2026-08-19T06:00:00.000Z",
    });
    expect(uatAssessment.majorImprovements).toEqual([]);
  });

  it(
    "scores ecommerce factory worth-it/plans above the old 81 floor",
    () => {
    const slugs = [
      "is-tiendanube-worth-it",
      "tiendanube-plans",
      "is-medusa-worth-it",
      "medusa-plans",
      "is-saleor-worth-it",
      "is-vtex-worth-it",
      "is-opencart-worth-it",
      "is-lightspeed-retail-worth-it",
      "is-webflow-worth-it",
      "is-printify-worth-it",
      "is-printful-worth-it",
      "is-shopware-worth-it",
    ];
    for (const slug of slugs) {
      const guide = getGuideBySlug(slug, { includeUnpublished: true });
      expect(guide, slug).toBeTruthy();
      const snapshot = snapshotFromGuide(guide!);
      const assessment = evaluatePageQuality(snapshot, {
        evaluatedAt: "2026-08-19T07:00:00.000Z",
      });
      expect(assessment.overallScore, slug).toBeGreaterThanOrEqual(90);
      expect(snapshot.missingSections, slug).toEqual([]);
      expect(assessment.majorImprovements.join(" "), slug).not.toMatch(
        /examples|prerequisites/i,
      );
      expect(
        assignImprovementPriority({
          assessment,
          pageImportance: classifyPageImportance(
            assessment.route,
            assessment.pageType,
          ),
          journeyImportance: "medium",
        }),
        slug,
      ).not.toBe("CQ-P1");
    }
  },
  30_000,
);
});
