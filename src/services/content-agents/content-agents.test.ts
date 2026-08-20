import { beforeEach, describe, expect, it } from "vitest";
import { __resetDataCaches } from "@/data";
import type { AgentDraftBundle, AgentContext } from "@/domain";
import {
  assertNoAffiliateEconomics,
  buildAgentContext,
  detectStaleDraft,
  getContentAgent,
  listContentAgents,
  reviseDraft,
  runContentAgent,
  runQa,
  validateContentAgents,
} from "@/services/content-agents";

beforeEach(() => {
  __resetDataCaches();
});

describe("content agent registry", () => {
  it("registers all specialized agents with versions", () => {
    const agents = listContentAgents();
    expect(agents.length).toBe(14);
    for (const a of agents) {
      expect(a.version).toMatch(/^\d+\./);
    }
    expect(validateContentAgents().ok).toBe(true);
  });
});

describe("software-review-agent", () => {
  it("blocks without research facts", () => {
    const agent = getContentAgent("software-review-agent");
    const context = buildAgentContext({
      agentId: "software-review-agent",
      productSlugs: ["unknown-product-xyz"],
      targetSlug: "unknown-product-xyz",
    });
    const readiness = agent.canRun(context);
    expect(readiness.status).toBe("BLOCKED");
    expect(readiness.reasons.some((r) => r.code === "RESEARCH_INCOMPLETE")).toBe(
      true,
    );
  });

  it("blocks without methodology/assessment", () => {
    const agent = getContentAgent("software-review-agent");
    // Force empty assessments by using empty product that has no assessment
    const context = buildAgentContext({
      agentId: "software-review-agent",
      productSlugs: ["unknown-product-xyz"],
      targetSlug: "unknown-product-xyz",
    });
    expect(agent.canRun(context).status).toBe("BLOCKED");
  });

  it("includes approved facts and omits inventing hands-on claims", async () => {
    const result = await runContentAgent("software-review", "pipedrive", {
      persist: false,
    });
    expect(result.readiness.status).toBe("READY");
    expect(result.bundle?.draft.sections.length).toBeGreaterThan(3);
    expect(result.bundle?.extension.agentId).toBe("software-review-agent");
    const text = JSON.stringify(result.bundle?.draft);
    expect(text.toLowerCase()).not.toMatch(/\bwe tested\b/);
    expect(result.execution.qa?.status === "pass" || result.execution.qa?.status === "pass-with-warnings").toBe(true);
  });

  it("keeps affiliate economics out of ranking/generation context", () => {
    const context = buildAgentContext({
      agentId: "software-review-agent",
      productSlugs: ["pipedrive"],
      targetSlug: "pipedrive",
    });
    expect(assertNoAffiliateEconomics(context)).toEqual([]);
    expect(JSON.stringify(context)).not.toMatch(/commission/i);
  });
});

describe("pricing-page-agent", () => {
  it("requires verified pricing", () => {
    const agent = getContentAgent("pricing-page-agent");
    const context = buildAgentContext({
      agentId: "pricing-page-agent",
      productSlugs: ["unknown-product-xyz"],
      targetSlug: "unknown-product-xyz",
    });
    expect(agent.canRun(context).status).toBe("BLOCKED");
  });

  it("traces numbers to pricing engine for pipedrive", async () => {
    const result = await runContentAgent("pricing-page", "pipedrive", {
      persist: false,
    });
    expect(result.readiness.status).toBe("READY");
    const exampleSection = result.bundle?.draft.sections.find(
      (s) => s.id === "example-costs",
    );
    expect(exampleSection?.body).toMatch(/\d/);
    expect(result.bundle?.extension.generationProvider).toBe("deterministic-v1");
  });
});

describe("comparison-agent", () => {
  it("blocks without approved relationship", () => {
    const agent = getContentAgent("comparison-agent");
    const context = buildAgentContext({
      agentId: "comparison-agent",
      productSlugs: ["pipedrive", "apollo"],
      targetSlug: "apollo-vs-pipedrive",
    });
    // may or may not have relationship — if related-to only, competes might exist
    const readiness = agent.canRun(context);
    // pipedrive-apollo is related-to, which we include — so may be READY
    // Use two products with no edge
    const empty = buildAgentContext({
      agentId: "comparison-agent",
      productSlugs: ["pipedrive", "lusha"],
      targetSlug: "lusha-vs-pipedrive",
    });
    expect(agent.canRun(empty).status).toBe("BLOCKED");
    void readiness;
  });

  it("allows depends outcome and runs freshsales-vs-pipedrive", async () => {
    const result = await runContentAgent(
      "comparison",
      "freshsales-vs-pipedrive",
      { persist: false },
    );
    expect(result.readiness.status).toBe("READY");
    expect(result.bundle?.draft.verdict).toBe("depends");
    expect(JSON.stringify(result.bundle)).not.toMatch(/commission/i);
  });
});

describe("alternatives-agent", () => {
  it("requires approved alternative relationships", () => {
    const agent = getContentAgent("alternatives-agent");
    const context = buildAgentContext({
      agentId: "alternatives-agent",
      productSlugs: ["lusha"],
      targetSlug: "lusha",
    });
    // lusha may have alternatives with apollo — if none of type alternative-to from lusha as sole product filter...
    // relationships include apollo-lusha alternative-to
    const readiness = agent.canRun(context);
    if (context.relationships.filter((r) => r.type === "alternative-to").length === 0) {
      expect(readiness.status).toBe("BLOCKED");
    } else {
      expect(readiness.status).toBe("READY");
    }
  });

  it("includes only approved alternatives for pipedrive", async () => {
    const result = await runContentAgent("alternatives", "pipedrive", {
      persist: false,
    });
    expect(result.readiness.status).toBe("READY");
    const body = result.bundle?.draft.sections.find((s) => s.id === "alternatives")?.body ?? "";
    expect(body).toMatch(/freshsales|close/i);
    expect(body).not.toMatch(/10 random/i);
  });
});

describe("best-software-agent", () => {
  it("cannot reorder approved ranking and requires methodology", async () => {
    const agent = getContentAgent("best-software-agent");
    const context = buildAgentContext({
      agentId: "best-software-agent",
      categorySlugs: ["crm"],
      targetSlug: "crm-software",
    });
    expect(context.methodology).toBeTruthy();
    const readiness = agent.canRun(context);
    expect(["READY", "REVIEW_REQUIRED"]).toContain(readiness.status);

    const result = await runContentAgent("best-software", "crm-software", {
      persist: false,
    });
    const table = result.bundle?.draft.sections.find(
      (s) => s.id === "recommendation-table",
    )?.body;
    const order = context.approvedRanking.map((r) => r.productSlug);
    let last = -1;
    for (const slug of order) {
      const idx = table?.indexOf(slug) ?? -1;
      expect(idx).toBeGreaterThan(last);
      last = idx;
    }
  });
});

describe("category-hub-agent", () => {
  it("uses category methodology and does not hardcode product lists", async () => {
    const result = await runContentAgent("category-hub", "crm", {
      persist: false,
    });
    expect(result.readiness.status).toBe("READY");
    const featured = result.bundle?.draft.sections.find(
      (s) => s.id === "featured-software",
    )?.body;
    expect(featured).toMatch(/approved catalogue/i);
  });
});

describe("internal-link-agent", () => {
  it("excludes draft targets via publication status checks in QA", async () => {
    const result = await runContentAgent("internal-link", "pipedrive", {
      persist: false,
    });
    expect(result.readiness.status).toBe("READY");
    const bundle = result.bundle!;
    bundle.extension.internalLinkCandidates = [
      {
        sourceSection: "summary",
        targetContentId: "content:software:draft-only",
        relationship: "related-to",
        anchorConcept: "draft",
        priority: "high",
        reason: "test",
        publicationStatus: "draft",
      },
    ];
    const context = buildAgentContext({
      agentId: "internal-link-agent",
      productSlugs: ["pipedrive"],
      targetSlug: "pipedrive",
    });
    const qa = runQa(bundle, context);
    expect(qa.blockers.some((b) => b.type === "BROKEN_INTERNAL_LINK")).toBe(
      true,
    );
  });
});

describe("refresh-agent", () => {
  it("updates affected pricing sections from change events", async () => {
    const result = await runContentAgent("refresh", "pipedrive", {
      persist: false,
      mode: "REFRESH",
      changeEvents: [
        {
          type: "pricing-changed",
          affectedSections: ["pricing-overview", "updated-sections"],
          summary: "pricing changed",
        },
      ],
    });
    expect(result.readiness.status).toBe("READY");
    expect(result.bundle?.extension.sectionsChanged.length).toBeGreaterThan(0);
    expect(result.bundle?.draft.sections.some((s) => s.id === "diff-metadata")).toBe(
      true,
    );
    expect(
      result.bundle?.draft.sections.some((s) => s.id === "official-media-health"),
    ).toBe(true);
    expect(
      result.bundle?.draft.sections
        .find((s) => s.id === "official-media-health")
        ?.body.includes("Check official media health"),
    ).toBe(true);
  });
});

describe("qa-agent and revision", () => {
  it("detects unsupported fact and fake testing claim; revision targets section", async () => {
    const base = await runContentAgent("software-review", "pipedrive", {
      persist: false,
      skipQa: true,
    });
    const bundle = structuredClone(base.bundle!) as AgentDraftBundle;
    bundle.draft.sections.push({
      id: "bad-section",
      heading: "Bad",
      body: "We tested this product with 99999 users in our testing lab.",
      factRefs: ["fact-does-not-exist"],
    });
    const context = buildAgentContext({
      agentId: "software-review-agent",
      productSlugs: ["pipedrive"],
      targetSlug: "pipedrive",
    });
    const qa = runQa(bundle, context);
    expect(qa.status).toBe("fail");
    expect(qa.blockers.some((b) => b.type === "UNSUPPORTED_FACT")).toBe(true);
    expect(qa.blockers.some((b) => b.type === "FAKE_TESTING_CLAIM")).toBe(true);

    const { bundle: revised } = reviseDraft({
      original: bundle,
      issues: qa.blockers,
      instructions: ["remove-fact:fact-does-not-exist"],
      context,
    });
    const qa2 = runQa(revised, context);
    expect(qa2.blockers.some((b) => b.type === "UNSUPPORTED_FACT")).toBe(false);
    expect(qa2.blockers.some((b) => b.type === "FAKE_TESTING_CLAIM")).toBe(
      false,
    );
  });

  it("detects stale drafts when critical pricing facts change", () => {
    const result = detectStaleDraft(
      ["fact-pipedrive-pricing.model-old"],
      ["fact-pipedrive-pricing.model-new"],
    );
    expect(result.stale).toBe(true);
  });
});

describe("getresponse review POC pipeline", () => {
  it("runs task → context → brief → draft → validation → QA", async () => {
    const result = await runContentAgent("software-review", "getresponse", {
      persist: true,
      allowNormalizedFacts: true,
    });
    expect(result.readiness.status).toBe("READY");
    expect(result.bundle?.draft.targetSlug).toBe("getresponse");
    expect(result.bundle?.extension.agentVersion).toBeTruthy();
    expect(result.execution.draftId).toBeTruthy();
    expect(
      result.execution.qa?.status === "pass" ||
        result.execution.qa?.status === "pass-with-warnings",
    ).toBe(true);
  });
});

describe("context security", () => {
  it("never puts affiliate commission fields into agent context", () => {
    const context: AgentContext = buildAgentContext({
      agentId: "best-software-agent",
      categorySlugs: ["crm"],
      targetSlug: "crm-software",
    });
    expect(assertNoAffiliateEconomics(context)).toEqual([]);
  });
});
