import { describe, expect, it } from "vitest";
import {
  createEmptyCrmDecisionProfile,
  createEmptyCrmReadinessSession,
  type CrmReadinessSession,
} from "@/domain";
import { READINESS_DIMENSIONS, READINESS_QUESTIONS } from "./catalog";
import { applyDecisionProfileHints } from "./from-profile";
import { runFullAssessment } from "./findings";
import {
  assessCrmReadiness,
  deriveOrgComplexity,
  getVisibleQuestions,
  isCriticalAnswer,
  isQuestionVisible,
} from "./score";
import { setAnswer } from "./persistence";

function answerAll(
  session: CrmReadinessSession,
  picker: (questionId: string) => string | string[],
): CrmReadinessSession {
  let next = session;
  const visible = getVisibleQuestions(next);
  for (const q of visible) {
    next = setAnswer(next, q.id, picker(q.id));
  }
  return next;
}

describe("CRM readiness assessment", () => {
  it("initializes an empty session", () => {
    const s = createEmptyCrmReadinessSession();
    expect(s.assessmentVersion).toBe("crm-readiness-v1");
    expect(s.status).toBe("in-progress");
    expect(Object.keys(s.answers)).toHaveLength(0);
  });

  it("hides conditional integration detail when integrations are not needed", () => {
    let s = createEmptyCrmReadinessSession();
    s = setAnswer(s, "ig-needed", "no");
    const visible = getVisibleQuestions(s).map((q) => q.id);
    expect(visible).not.toContain("ig-systems");
    expect(visible).not.toContain("ig-scope-clarity");
  });

  it("shows CRM export question only when replacing CRM", () => {
    let s = createEmptyCrmReadinessSession();
    s = setAnswer(s, "bc-drivers", ["replace-crm"]);
    const q = READINESS_QUESTIONS.find((x) => x.id === "dt-export")!;
    expect(isQuestionVisible(q, s.answers, "mid")).toBe(true);
    s = setAnswer(s, "bc-drivers", ["visibility"]);
    expect(isQuestionVisible(q, s.answers, "mid")).toBe(false);
  });

  it("skips enterprise-only questions for small orgs", () => {
    const s = createEmptyCrmReadinessSession();
    s.context.companySize = "1-10";
    s.context.crmUsers = 3;
    s.context.salesComplexity = "simple";
    expect(deriveOrgComplexity(s.context)).toBe("small");
    const visible = getVisibleQuestions(s).map((q) => q.id);
    expect(visible).not.toContain("sp-motions");
    expect(visible).not.toContain("gv-config-owner");
  });

  it("scores selection and implementation separately with weights", () => {
    let s = createEmptyCrmReadinessSession();
    s.context = {
      ...s.context,
      companySize: "51-200",
      crmUsers: 40,
      salesComplexity: "moderate",
      expectedIntegrations: 3,
    };
    s = answerAll(s, (id) => {
      if (id === "bc-drivers") return ["visibility", "forecasting"];
      if (id === "dt-sources") return ["current-crm", "spreadsheets"];
      if (id === "ig-needed") return "yes";
      if (id === "ig-systems") return ["email", "calendar"];
      if (id === "st-represented") return ["sales", "sales-ops", "it"];
      if (id === "sc-relevant") return ["gdpr", "sso"];
      if (id === "bd-migration-training")
        return ["migration", "training", "integrations"];
      // Strong selection answers, weak implementation
      if (
        [
          "ic-impl-owner",
          "ic-pm",
          "dt-data-owner",
          "cm-retire",
          "ua-training",
        ].includes(id)
      ) {
        return "no";
      }
      if (id.startsWith("bc-") || id.startsWith("rq-") || id.startsWith("st-")) {
        return id.includes("maturity") || id.includes("clarity") || id.includes("gathered")
          ? "agreed"
          : "yes";
      }
      const q = READINESS_QUESTIONS.find((x) => x.id === id)!;
      if (q.type === "maturity") return q.options[q.options.length - 2]!.id;
      if (q.type === "multi") return [q.options[0]!.id];
      return "yes";
    });

    // Fix a few maturity ids that aren't "agreed"
    s = setAnswer(s, "bc-problem-clarity", "measured");
    s = setAnswer(s, "rq-gathered", "prioritized");
    s = setAnswer(s, "sp-maturity", "level-4");
    s = setAnswer(s, "dt-quality", "uneven");
    s = setAnswer(s, "cm-change-size", "major");
    s = setAnswer(s, "ic-timeline", "tight");
    s = setAnswer(s, "ic-approach", "hybrid");

    const result = assessCrmReadiness(s);
    expect(result.selectionScore).toBeGreaterThan(50);
    expect(result.implementationScore).toBeLessThan(result.selectionScore);
    expect(result.dimensions).toHaveLength(READINESS_DIMENSIONS.length);
  });

  it("flags critical blockers for missing implementation owner", () => {
    let s = createEmptyCrmReadinessSession();
    s = setAnswer(s, "ic-impl-owner", "no");
    expect(isCriticalAnswer("ic-impl-owner", "no")).toBe(true);
    const report = runFullAssessment(s);
    expect(
      report.findings.some(
        (f) => f.type === "blocker" && f.id.includes("ic-impl-owner"),
      ),
    ).toBe(true);
    expect(report.criticalBlockerCount).toBeGreaterThanOrEqual(1);
  });

  it("treats not-sure as uncertainty, not only zero weakness", () => {
    let s = createEmptyCrmReadinessSession();
    s = setAnswer(s, "dt-quality", "not-sure");
    s = setAnswer(s, "ig-needed", "not-sure");
    s = setAnswer(s, "tc-sso", "not-sure");
    s = setAnswer(s, "sc-relevant", ["not-sure"]);
    const result = assessCrmReadiness(s);
    expect(result.uncertainQuestionIds.length).toBeGreaterThanOrEqual(3);
    const data = result.dimensions.find((d) => d.dimensionId === "data-readiness");
    expect(data?.score).toBeGreaterThan(0);
  });

  it("generates actions and tool recommendations from gaps", () => {
    let s = createEmptyCrmReadinessSession();
    s.context.companySize = "51-200";
    s = setAnswer(s, "rq-gathered", "none");
    s = setAnswer(s, "ic-impl-owner", "no");
    s = setAnswer(s, "bd-software", "yes");
    s = setAnswer(s, "bd-implementation", "no");
    const report = runFullAssessment(s);
    expect(report.actions.some((a) => a.id.includes("requirements"))).toBe(
      true,
    );
    expect(
      report.tools.some((t) => t.toolId === "requirements-builder"),
    ).toBe(true);
    expect(report.vendorDecision.status).not.toBe("yes");
  });

  it("imports hints from decision profile without overwriting user answers", () => {
    const profile = createEmptyCrmDecisionProfile();
    profile.requirements = [
      { id: "req-1", priority: "must-have", source: "user-selected" },
      { id: "req-2", priority: "must-have", source: "user-selected" },
      { id: "req-3", priority: "important", source: "user-selected" },
      { id: "req-4", priority: "important", source: "user-selected" },
      { id: "req-5", priority: "nice-to-have", source: "user-selected" },
    ];
    profile.integrations = [{ id: "email-sync", priority: "required" }];
    profile.businessContext.crmUserCount = 25;
    profile.businessContext.companySizeSlug = "51-200";

    let s = createEmptyCrmReadinessSession();
    s = setAnswer(s, "rq-gathered", "none", "user");
    const applied = applyDecisionProfileHints(s, profile);
    // User answer preserved
    expect(applied.session.answers["rq-gathered"]?.value).toBe("none");
    expect(applied.session.context.crmUsers).toBe(25);
    expect(applied.importedQuestionIds).toContain("ig-needed");
  });

  it("keeps assessment version on completed snapshot", () => {
    let s = createEmptyCrmReadinessSession();
    s = answerAll(s, (id) => {
      const q = READINESS_QUESTIONS.find((x) => x.id === id)!;
      if (q.type === "multi") return [q.options[0]!.id];
      return q.options[Math.min(2, q.options.length - 1)]!.id;
    });
    const report = runFullAssessment(s);
    expect(report.assessment.assessmentVersion).toBe("crm-readiness-v1");
    expect(report.assessment.completionRatio).toBeGreaterThan(0.9);
  });
});
