import { describe, expect, it } from "vitest";
import {
  evaluateSupportingTopic,
  planCategoryKnowledge,
  planProductKnowledge,
  resolveAgentForIntent,
  validateKnowledgePlanners,
  createSupportingContentWorkflow,
} from "@/services/knowledge-planners";
import { decideTopicPlacement } from "@/services/content-clusters";
import { getCategoryKnowledgeMap, listCategoryKnowledgeMaps } from "@/data/content-clusters/knowledge";

describe("knowledge planners", () => {
  it("validates planner subsystem", () => {
    expect(validateKnowledgePlanners().ok).toBe(true);
  });

  it("category planner adapts topics by category", () => {
    const crm = planCategoryKnowledge("crm");
    const em = planCategoryKnowledge("email-marketing");
    expect(crm.categorySlug).toBe("crm");
    expect(em.categorySlug).toBe("email-marketing");
    expect(crm.topicCandidates.some((c) => /CRM/i.test(c.titleConcept))).toBe(
      true,
    );
    expect(
      em.topicCandidates.some((c) => /email marketing/i.test(c.titleConcept)),
    ).toBe(true);
    expect(crm.summary.coreCount).toBeGreaterThan(0);
    expect(em.summary.coreCount).toBeGreaterThan(0);
  });

  it("category planner produces structured plan with areas and gaps", () => {
    const plan = planCategoryKnowledge("crm");
    expect(plan.knowledgeAreas.length).toBeGreaterThan(0);
    expect(plan.anchorCoverage.length).toBeGreaterThan(0);
    expect(plan.journeyAudit.length).toBe(7);
    expect(plan.plannerVersion).toBe("1.0.0");
  });

  it("product planner does not require guides", () => {
    const plan = planProductKnowledge("capsule");
    expect([
      "GUIDES_NOT_NEEDED",
      "GUIDES_OPTIONAL",
      "GUIDES_RECOMMENDED",
      "GUIDES_HIGH_PRIORITY",
    ]).toContain(plan.eligibility);
  });

  it("affiliate commission never justifies product guides", () => {
    const plan = planProductKnowledge("pipedrive");
    expect(plan.signals.affiliateCommissionUsed).toBe(false);
  });

  it("rejects product pricing guide when pricing page owns intent", () => {
    const plan = planProductKnowledge("pipedrive");
    expect(
      plan.rejected.some(
        (r) =>
          /pricing/i.test(r.titleConcept) &&
          /canonical pricing page/i.test(r.reason),
      ),
    ).toBe(true);
  });

  it("supporting planner rejects micro topics", () => {
    const plan = planCategoryKnowledge("crm");
    const micro = plan.topicCandidates.find(
      (c) => c.priorityClass === "NOT_RECOMMENDED",
    );
    expect(micro).toBeDefined();
    const decision = evaluateSupportingTopic(micro!);
    expect(decision.recommendation).toBe("REJECT");
    expect(decision.workflowAction).toBe("reject");
    expect(decision.nextAgentId).toBe("none");
  });

  it("supporting planner has no remaining CRM CORE NEW_PAGE gaps", () => {
    const plan = planCategoryKnowledge("crm");
    const ready = plan.topicCandidates.filter(
      (c) =>
        c.priorityClass === "CORE" &&
        c.placement === "NEW_PAGE" &&
        c.readiness === "ready",
    );
    expect(ready).toEqual([]);
  });

  it("every registered category map has CORE pages and no missing-core gaps", () => {
    const maps = listCategoryKnowledgeMaps();
    expect(maps.map((m) => m.categorySlug)).toEqual(
      expect.arrayContaining([
        "crm",
        "email-marketing",
        "sales-intelligence",
        "business-communications",
        "hr",
        "project-management",
        "marketing",
      ]),
    );
    for (const map of maps) {
      const plan = planCategoryKnowledge(map.categorySlug);
      expect(
        plan.gaps.filter((g) => g.kind === "missing-core-topic"),
        map.categorySlug,
      ).toEqual([]);
      const missingCore = plan.topicCandidates.filter(
        (c) =>
          c.priorityClass === "CORE" &&
          c.placement === "NEW_PAGE" &&
          c.readiness === "ready",
      );
      expect(missingCore, map.categorySlug).toEqual([]);
    }
  });

  it("supporting planner maps NEW_PAGE ready CORE to guide-agent", () => {
    const plan = planCategoryKnowledge("crm");
    const template = plan.topicCandidates.find(
      (c) => c.priorityClass === "CORE",
    );
    expect(template).toBeDefined();
    const decision = evaluateSupportingTopic({
      ...template!,
      placement: "NEW_PAGE",
      readiness: "ready",
    });
    expect(decision.workflowAction).toBe("create-guide");
    expect(decision.nextAgentId).toBe("guide-agent");
  });

  it("supporting planner maps ADD_SECTION to refresh, not new URL", () => {
    const plan = planCategoryKnowledge("crm");
    const section = plan.topicCandidates.find(
      (c) => c.placement === "ADD_SECTION",
    );
    expect(section).toBeDefined();
    const decision = evaluateSupportingTopic(section!);
    expect(decision.workflowAction).toBe("add-section");
    expect(decision.nextAgentId).toBe("refresh-agent");
  });

  it("duplicate intent expands existing page", () => {
    const map = getCategoryKnowledgeMap("crm")!;
    const concept = {
      ...map.topics.find((t) => t.id === "crm-what-is")!,
      id: "dup",
      suggestedSlug: "crm-explained-again",
      titleConcept: "What is CRM software explained",
    };
    const placement = decideTopicPlacement(concept, new Set(["what-is-crm"]));
    expect(placement.placement).toBe("EXPAND_EXISTING_PAGE");
  });

  it("rejected topic creates no guide workflow", () => {
    const result = createSupportingContentWorkflow({
      supportingTopicId: "pipedrive-custom-fields",
      categorySlug: "crm",
      dryRun: true,
    });
    expect(["reject", "noop", "manual-review"]).toContain(result.action);
    expect(result.workflow).toBeUndefined();
  });

  it("intent router is deterministic", () => {
    expect(
      resolveAgentForIntent({ query: "pipedrive vs freshsales" }).agentId,
    ).toBe("comparison-agent");
    expect(
      resolveAgentForIntent({
        query: "pipedrive pricing",
        productSlug: "pipedrive",
      }).agentId,
    ).toBe("pricing-page-agent");
    expect(
      resolveAgentForIntent({ query: "how much does crm cost" }).agentId,
    ).toBe("category-knowledge-planner-agent");
    expect(
      resolveAgentForIntent({
        query: "how to set up pipedrive",
        productSlug: "pipedrive",
      }).agentId,
    ).toBe("product-knowledge-planner-agent");
    expect(
      resolveAgentForIntent({ query: "best crm software" }).agentId,
    ).toBe("best-software-agent");
  });

  it("low-value product can return GUIDES_NOT_NEEDED", () => {
    const plan = planProductKnowledge("folk");
    // folk is published but not high-importance in map; expect not HIGH_PRIORITY
    expect(plan.eligibility).not.toBe("GUIDES_HIGH_PRIORITY");
    if (plan.eligibility === "GUIDES_NOT_NEEDED") {
      expect(plan.topicCandidates.length).toBe(0);
      expect(plan.eligibilityReasons.length).toBeGreaterThan(0);
    }
  });
});
