import { describe, expect, it } from "vitest";
import {
  buildEditorialTrustMetadata,
  resolveEvidenceLevel,
} from "@/services/editorial/evidence-level";
import {
  buildDimensionScoresFromAssessments,
  buildTraceableOverallScore,
  getCategoryScoringProfile,
  listStandardScoringDimensions,
} from "@/services/editorial/scoring-framework";
import { crmMethodology } from "@/data/seed/crm-methodology";
import type { CriterionAssessment } from "@/domain";

describe("evidence levels", () => {
  it("never elevates to hands_on_tested without testedAt", () => {
    expect(
      resolveEvidenceLevel({
        handsOnTesting: true,
        testedAt: null,
      }),
    ).toBe("researched");
  });

  it("requires both handsOnTesting and testedAt for hands_on_tested", () => {
    expect(
      resolveEvidenceLevel({
        handsOnTesting: true,
        testedAt: "2026-09-01T12:00:00.000Z",
      }),
    ).toBe("hands_on_tested");
  });

  it("uses data_verified when pricing is verified without testing", () => {
    expect(
      resolveEvidenceLevel({
        handsOnTesting: false,
        pricingVerifiedAt: "2026-09-01T12:00:00.000Z",
      }),
    ).toBe("data_verified");
  });

  it("defaults to researched", () => {
    expect(resolveEvidenceLevel({})).toBe("researched");
  });

  it("does not treat research sources alone as testing", () => {
    const trust = buildEditorialTrustMetadata({
      sourceIds: ["src-1", "src-2"],
      authorId: "author-lee-meyeridricks",
    });
    expect(trust.evidenceLevel).toBe("researched");
    expect(trust.handsOnTesting).toBe(false);
    expect(trust.testedAt).toBeUndefined();
    expect(trust.sourceIds).toHaveLength(2);
  });

  it("recognizes pricingVerifiedAt override without inventing hands-on", () => {
    const trust = buildEditorialTrustMetadata({
      pricingVerifiedAt: "2026-08-01T00:00:00.000Z",
    });
    expect(trust.evidenceLevel).toBe("data_verified");
    expect(trust.handsOnTesting).toBe(false);
    expect(trust.pricingVerifiedAt).toBe("2026-08-01T00:00:00.000Z");
  });
});

describe("scoring framework", () => {
  it("exposes standard dimensions without inventing product scores", () => {
    const dims = listStandardScoringDimensions();
    expect(dims.map((d) => d.id)).toContain("easeOfUse");
    expect(dims.map((d) => d.id)).toContain("scalability");
    expect(getCategoryScoringProfile("crm").categorySlug).toBe("crm");
  });

  it("builds traceable scores only from real assessments", () => {
    const assessments: CriterionAssessment[] = [
      {
        criterionSlug: "ease-of-use",
        score: 8,
        rationale: "Clear UI for common sales tasks.",
        supportingFactIds: ["fact-1"],
        confidence: "medium",
        status: "approved",
      },
      {
        criterionSlug: "reporting",
        score: 6,
        rationale: "Solid dashboards; forecasting is limited.",
        supportingFactIds: [],
        confidence: "medium",
        status: "approved",
      },
    ];

    const dimensions = buildDimensionScoresFromAssessments({
      assessments,
      methodology: crmMethodology,
    });
    expect(dimensions).toHaveLength(2);

    const overall = buildTraceableOverallScore({
      dimensions: dimensions!,
      methodology: crmMethodology,
    });
    expect(overall?.overall).toBe(7);
    expect(overall?.dimensions).toHaveLength(2);
  });

  it("returns null when there are no approved assessments", () => {
    expect(
      buildDimensionScoresFromAssessments({
        assessments: [
          {
            criterionSlug: "ease-of-use",
            score: 8,
            rationale: "Draft only",
            supportingFactIds: [],
            confidence: "low",
            status: "assessment-in-progress",
          },
        ],
        methodology: crmMethodology,
      }),
    ).toBeNull();
  });
});
