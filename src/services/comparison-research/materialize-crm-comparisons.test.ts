import { describe, expect, it } from "vitest";
import { buildCrmComparisonsFromResearch } from "./materialize-crm-comparisons";
import { isThinComparisonMesh } from "./distinctive-research";

describe("buildCrmComparisonsFromResearch", () => {
  it("completes Act vs Agile CRM from approved editorial scores instead of low-confidence depends", () => {
    const pair = buildCrmComparisonsFromResearch({
      autoApprove: true,
      productSlugs: ["act", "agile-crm"],
    }).find((item) => item.slug === "act-vs-agile-crm");
    expect(pair).toBeDefined();
    const ease = pair!.outcomes?.find((o) => o.criterionSlug === "ease-of-use");
    expect(ease?.winnerKind).toBe("product-b");
    expect(ease?.confidence).toBe("medium");
    expect(ease?.reason).toMatch(/editorial assessments/i);
    expect(isThinComparisonMesh(pair!)).toBe(false);
  });

  it("indexes monday sales CRM vs Zoho as a researched close peer, not a thin shell", () => {
    const pair = buildCrmComparisonsFromResearch({
      autoApprove: true,
      productSlugs: ["monday-sales-crm", "zoho-crm"],
    }).find((item) => item.slug === "monday-sales-crm-vs-zoho-crm");
    expect(pair).toBeDefined();
    expect(isThinComparisonMesh(pair!)).toBe(false);
    expect(pair!.seo?.indexable).toBe(true);
    expect(pair!.metadata?.researchStatus).toBe("complete");
    const value = pair!.outcomes?.find(
      (o) => o.criterionSlug === "value-for-money",
    );
    expect(value?.winnerKind).toBe("product-b");
  });
});
