import { describe, expect, it } from "vitest";
import {
  attachExistingSupportingFacts,
  existingFactIdsForCriterion,
  softenUnfactedProductA,
} from "./attach-supporting-facts";

describe("attachExistingSupportingFacts", () => {
  it("returns only facts that exist for Apollo prospecting", () => {
    const ids = existingFactIdsForCriterion("apollo", "prospecting");
    expect(ids).toContain("fact-apollo-features.prospecting");
    expect(ids.every((id) => id.startsWith("fact-apollo-"))).toBe(true);
  });

  it("returns empty for an unknown product slug", () => {
    expect(existingFactIdsForCriterion("not-a-real-product", "integrations")).toEqual(
      [],
    );
  });

  it("attaches HR and PM feature facts that already exist in research", () => {
    expect(existingFactIdsForCriterion("bamboohr", "hiring-workflow")).toContain(
      "fact-bamboohr-features.applicant-tracking",
    );
    expect(existingFactIdsForCriterion("asana", "timeline-gantt")).toContain(
      "fact-asana-features.timeline-gantt",
    );
    expect(existingFactIdsForCriterion("zendesk-suite", "ticketing-depth")).toContain(
      "fact-zendesk-suite-features.ticketing",
    );
    expect(existingFactIdsForCriterion("chatgpt", "llm-chat-depth")).toContain(
      "fact-chatgpt-features.llm-chat",
    );
    expect(existingFactIdsForCriterion("github", "source-control-depth")).toContain(
      "fact-github-features.source-control",
    );
    expect(existingFactIdsForCriterion("shopify", "storefront-commerce-fit")).toContain(
      "fact-shopify-features.online-storefront",
    );
  });

  it("does not invent winners while attaching facts to both sides", () => {
    const outcomes = attachExistingSupportingFacts("apollo", "lusha", [
      {
        criterionSlug: "email-outreach",
        winnerKind: "product-a",
        supportingFactIds: [],
      },
    ]);
    expect(outcomes[0]?.winnerKind).toBe("product-a");
    expect(outcomes[0]?.supportingFactIds).toEqual(
      expect.arrayContaining([
        "fact-apollo-features.email-sequences",
        "fact-lusha-features.email-sequences",
      ]),
    );
  });

  it("matches fixture-suffixed fact ids that already exist", () => {
    const ids = existingFactIdsForCriterion("kixie", "ease-of-use");
    expect(ids.some((id) => id.startsWith("fact-kixie-positioning.claim"))).toBe(
      true,
    );
  });

  it("attaches existing ESP feature facts to analytics and integrations rows", () => {
    expect(existingFactIdsForCriterion("klaviyo", "analytics")).toContain(
      "fact-klaviyo-features.analytics",
    );
    expect(existingFactIdsForCriterion("klaviyo", "integrations")).toContain(
      "fact-klaviyo-features.forms",
    );
    expect(existingFactIdsForCriterion("mailchimp", "analytics")).toContain(
      "fact-mailchimp-features.reporting",
    );
  });

  it("attaches existing CRM admin and scale facts", () => {
    expect(existingFactIdsForCriterion("hubspot", "administration")).toContain(
      "fact-hubspot-features.custom-fields",
    );
    expect(existingFactIdsForCriterion("act", "administration")).toContain(
      "fact-act-features.custom-fields",
    );
    expect(existingFactIdsForCriterion("hubspot", "scalability").length).toBeGreaterThan(
      0,
    );
  });

  it("softens product-A winners that still have no facts", () => {
    const outcomes = softenUnfactedProductA(
      attachExistingSupportingFacts("not-a-real-product", "also-fake", [
        {
          criterionSlug: "integrations",
          winnerKind: "product-a",
          winnerSlug: "not-a-real-product",
          supportingFactIds: [],
        },
      ]),
    );
    expect(outcomes[0]?.winnerKind).toBe("depends");
    expect(outcomes[0]?.supportingFactIds).toEqual([]);
  });

  it("softens product-B winners that still have no facts", () => {
    const outcomes = softenUnfactedProductA([
      {
        criterionSlug: "contact-data",
        winnerKind: "product-b",
        winnerSlug: "also-fake",
        supportingFactIds: [],
      },
    ]);
    expect(outcomes[0]?.winnerKind).toBe("depends");
    expect(outcomes[0]?.winnerSlug).toBeNull();
  });

  it("keeps winners backed by approved assessment IDs even without fact IDs", () => {
    const outcomes = softenUnfactedProductA([
      {
        criterionSlug: "ease-of-use",
        winnerKind: "product-a",
        winnerSlug: "act",
        supportingFactIds: [],
        assessmentIds: ["assessment-act-crm-v1"],
      },
    ]);
    expect(outcomes[0]?.winnerKind).toBe("product-a");
    expect(outcomes[0]?.winnerSlug).toBe("act");
  });
});
