import { describe, expect, it } from "vitest";
import {
  getCategoryKnowledgeMap,
  listCategoryKnowledgeMaps,
} from "@/data/content-clusters/knowledge";
import {
  buildContentCluster,
  buildSupportingTopicCandidates,
  decideTopicPlacement,
  planSupportingWorkflows,
  reportAnchorSupport,
  reportProductSupport,
  validateContentClusters,
} from "@/services/content-clusters";

describe("content clusters", () => {
  it("validates knowledge maps", () => {
    const result = validateContentClusters();
    expect(result.ok).toBe(true);
  });

  it("links CORE candidates to valid anchors", () => {
    const candidates = buildSupportingTopicCandidates("crm");
    const core = candidates.filter((c) => c.priorityClass === "CORE");
    expect(core.length).toBeGreaterThan(0);
    for (const c of core) {
      expect(c.supports.length).toBeGreaterThan(0);
      for (const s of c.supports) {
        expect(s.contentId.startsWith("content:")).toBe(true);
      }
    }
  });

  it("identifies CORE topics from category map", () => {
    const map = getCategoryKnowledgeMap("crm");
    expect(map).toBeDefined();
    const coreIds = map!.topics
      .filter((t) => t.priorityClass === "CORE")
      .map((t) => t.id);
    expect(coreIds).toContain("crm-what-is");
    expect(coreIds).toContain("crm-how-to-choose");
    expect(coreIds).toContain("crm-pricing-explained");
    expect(coreIds).toContain("crm-implementation-guide");
    expect(coreIds).toContain("crm-migration-guide");
    expect(coreIds).not.toContain("crm-feature-checklist");
  });

  it("resolves the audit CORE map IDs onto existing guides", () => {
    const maps = listCategoryKnowledgeMaps().map((m) => m.categorySlug);
    expect(maps).toEqual(
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

    const crm = buildContentCluster("crm");
    expect(crm).not.toBeNull();
    for (const id of [
      "crm-pricing-explained",
      "crm-implementation-guide",
      "crm-migration-guide",
    ]) {
      const candidate = crm!.candidates.find((c) => c.id === `candidate:${id}`);
      expect(candidate, id).toBeDefined();
      expect(candidate!.readiness, id).toBe("exists");
      expect(candidate!.placement, id).toBe("NO_ACTION");
    }
    expect(
      crm!.coverage
        .find((a) => a.knowledgeAreaSlug === "selection")
        ?.missingCoreTopicIds.includes("crm-feature-checklist"),
    ).toBe(false);
    expect(planSupportingWorkflows("crm")).toEqual([]);

    const em = buildContentCluster("email-marketing");
    expect(em).not.toBeNull();
    for (const id of ["em-what-is", "em-pricing"]) {
      const candidate = em!.candidates.find((c) => c.id === `candidate:${id}`);
      expect(candidate, id).toBeDefined();
      expect(candidate!.readiness, id).toBe("exists");
    }
    expect(planSupportingWorkflows("email-marketing")).toEqual([]);
    expect(planSupportingWorkflows("sales-intelligence")).toEqual([]);
  });

  it("rejects low-value micro-topics deterministically", () => {
    const map = getCategoryKnowledgeMap("crm")!;
    const micro = map.topics.find((t) => t.id === "crm-pipeline-definition")!;
    const placement = decideTopicPlacement(micro, new Set());
    expect(["ADD_SECTION", "NO_ACTION"]).toContain(placement.placement);
    expect(placement.placement).not.toBe("NEW_PAGE");
  });

  it("marks product×feature micro pages NOT_RECOMMENDED", () => {
    const candidates = buildSupportingTopicCandidates("crm");
    const customFields = candidates.find(
      (c) => c.id === "candidate:pipedrive-custom-fields",
    );
    expect(customFields).toBeDefined();
    expect(customFields!.priorityClass).toBe("NOT_RECOMMENDED");
    expect(customFields!.placement).toBe("NO_ACTION");
    expect(customFields!.readiness).toBe("not-recommended");
  });

  it("treats existing what-is-crm as exists (not duplicate NEW_PAGE)", () => {
    const candidates = buildSupportingTopicCandidates("crm");
    const whatIs = candidates.find((c) => c.suggestedSlug === "what-is-crm");
    expect(whatIs?.readiness).toBe("exists");
    expect(whatIs?.placement).toBe("NO_ACTION");
  });

  it("plans GuideAgent tasks for ready CORE NEW_PAGE only", () => {
    const plan = planSupportingWorkflows("crm");
    expect(plan.every((p) => p.agentId === "guide-agent")).toBe(true);
    expect(plan.every((p) => p.priorityClass === "CORE")).toBe(true);
    expect(plan.some((p) => p.targetSlug === "what-is-crm")).toBe(false);
  });

  it("does not use affiliate commission in scoring dimensions", () => {
    const candidates = buildSupportingTopicCandidates("crm");
    for (const c of candidates) {
      expect(c.scores).toMatchObject({
        journeyValue: expect.any(Number),
        searchEvidence: expect.any(Number),
        anchorSupport: expect.any(Number),
        knowledgeGap: expect.any(Number),
        strategicRelevance: expect.any(Number),
        effortPenalty: expect.any(Number),
        total: expect.any(Number),
      });
      expect(JSON.stringify(c.scores)).not.toMatch(/commission|payout|revenue/i);
    }
  });

  it("reports Best CRM and tool support gaps", () => {
    const best = reportAnchorSupport("content:best:crm-software");
    // how-to-choose-crm is seeded as supporting knowledge for Best CRM
    expect(best.gaps.some((g) => g.id.includes("how-to-choose"))).toBe(false);

    const finder = reportAnchorSupport("content:tool:crm-finder");
    expect(finder.gaps.some((g) => g.id.includes("how-to-choose"))).toBe(false);
    expect(finder.gaps.some((g) => g.id.includes("feature-checklist"))).toBe(
      false,
    );

    const calc = reportAnchorSupport("content:tool:crm-cost-calculator");
    expect(calc.gaps.some((g) => g.id.includes("pricing-explained"))).toBe(
      false,
    );
  });

  it("reports Pipedrive product support with rejected micro topics", () => {
    const report = reportProductSupport("pipedrive");
    expect(report.rejected.some((r) => r.id.includes("custom-fields"))).toBe(
      true,
    );
  });

  it("builds email-marketing cluster against published category teaching guides", () => {
    const cluster = buildContentCluster("email-marketing");
    expect(cluster).not.toBeNull();
    expect(cluster!.existingGuideSlugs).toContain("what-is-email-marketing");
    expect(cluster!.existingGuideSlugs).toContain(
      "email-marketing-pricing-guide",
    );
    expect(
      cluster!.candidates.some((c) => c.priorityClass === "CORE"),
    ).toBe(true);
    for (const area of cluster!.coverage) {
      expect(area.existingCoreCount).toBeGreaterThanOrEqual(
        area.targetCoreCount,
      );
    }
  });

  it("CRM cluster coverage meets CORE targets from existing teaching guides", () => {
    const cluster = buildContentCluster("crm");
    expect(cluster).not.toBeNull();
    expect(cluster!.existingGuideSlugs).toContain("what-is-crm");
    const fundamentals = cluster!.coverage.find(
      (c) => c.knowledgeAreaSlug === "fundamentals",
    );
    expect(fundamentals?.existingCoreCount).toBeGreaterThanOrEqual(
      fundamentals?.targetCoreCount ?? 0,
    );
    for (const area of cluster!.coverage) {
      if (area.missingCoreTopicIds.length === 0) continue;
      expect(area.existingCoreCount).toBeGreaterThanOrEqual(
        area.targetCoreCount,
      );
    }
  });

  it("publishes marketing category teaching cluster", () => {
    const cluster = buildContentCluster("marketing");
    expect(cluster).not.toBeNull();
    expect(cluster!.existingGuideSlugs).toEqual(
      expect.arrayContaining([
        "what-is-marketing-software",
        "how-to-choose-marketing-software",
        "marketing-software-pricing-guide",
        "marketing-software-requirements-guide",
        "marketing-software-evaluation-guide",
      ]),
    );
  });

  it("covers CORE teaching targets on every category knowledge map", () => {
    const maps = listCategoryKnowledgeMaps();
    expect(maps.length).toBeGreaterThanOrEqual(11);
    for (const map of maps) {
      const cluster = buildContentCluster(map.categorySlug);
      expect(cluster).not.toBeNull();
      for (const area of cluster!.coverage) {
        if (area.missingCoreTopicIds.length === 0) continue;
        expect(
          area.existingCoreCount,
          `${map.categorySlug} ${area.knowledgeAreaSlug} missing ${area.missingCoreTopicIds.join(", ")}`,
        ).toBeGreaterThanOrEqual(area.targetCoreCount);
      }
    }
  });

  it("adds how-it-works and types teaching pages outside CRM/SI product packs", () => {
    const hr = buildContentCluster("hr");
    expect(hr?.existingGuideSlugs).toEqual(
      expect.arrayContaining([
        "what-is-hr-software",
        "how-hr-software-works",
        "types-of-hr-software",
        "hr-software-vs-crm",
      ]),
    );
    const em = buildContentCluster("email-marketing");
    expect(em?.existingGuideSlugs).toEqual(
      expect.arrayContaining([
        "what-is-email-marketing",
        "how-email-marketing-works",
        "types-of-email-marketing",
        "email-marketing-vs-crm",
      ]),
    );
    const ecom = buildContentCluster("ecommerce");
    expect(ecom?.existingGuideSlugs).toEqual(
      expect.arrayContaining([
        "ecommerce-requirements-guide",
        "ecommerce-evaluation-guide",
        "how-ecommerce-software-works",
      ]),
    );
  });

  it("detects duplicate intent against existing guide", () => {
    const map = getCategoryKnowledgeMap("crm")!;
    const concept = {
      ...map.topics.find((t) => t.id === "crm-what-is")!,
      id: "crm-what-is-dup",
      suggestedSlug: "crm-software-explained",
      titleConcept: "What is CRM software explained",
    };
    const placement = decideTopicPlacement(
      concept,
      new Set(["what-is-crm"]),
    );
    expect(placement.placement).toBe("EXPAND_EXISTING_PAGE");
    expect(placement.expandTargetSlug).toBe("what-is-crm");
  });

  it("does not treat SI vendor/demo/RFP/business-case as how-to-choose duplicates", () => {
    const map = getCategoryKnowledgeMap("sales-intelligence")!;
    const existing = new Set(
      buildContentCluster("sales-intelligence")?.existingGuideSlugs ?? [],
    );
    expect(existing.has("how-to-choose-sales-intelligence")).toBe(true);
    for (const id of [
      "si-vendor-evaluation",
      "si-demo-guide",
      "si-rfp-guide",
      "si-business-case",
    ]) {
      const concept = map.topics.find((t) => t.id === id);
      expect(concept, id).toBeTruthy();
      const placement = decideTopicPlacement(concept!, existing);
      expect(placement.placement, id).not.toBe("EXPAND_EXISTING_PAGE");
      expect(placement.expandTargetSlug, id).not.toBe(
        "how-to-choose-sales-intelligence",
      );
    }
  });
});
