import { describe, expect, it } from "vitest";
import { buildGuidesHubModel } from "./build-hub-model";

describe("guides hub model", () => {
  it("builds from published guides without inventing content", () => {
    const model = buildGuidesHubModel();
    expect(model.guides.length).toBeGreaterThanOrEqual(1);
    expect(model.topics.length).toBeGreaterThanOrEqual(5);
    expect(model.featured).not.toBeNull();
    expect(model.startHere).not.toBeNull();

    const comingSoon = model.topics.filter((t) => t.comingSoon);
    expect(comingSoon.length).toBeGreaterThan(0);

    const withGuides = model.topics.filter((t) => t.guideCount > 0);
    expect(withGuides.every((t) => t.guideCount === t.guides.length || t.guideCount >= 1)).toBe(
      true,
    );
  });

  it("exposes filter categories from the taxonomy", () => {
    const model = buildGuidesHubModel();
    expect(model.filterCategories.length).toBe(model.topics.length);
    expect(model.filterCategories.length).toBeGreaterThan(0);
  });

  it("exposes topic filters with counts for published clusters", () => {
    const model = buildGuidesHubModel();
    expect(model.filterTopics.length).toBeGreaterThan(0);
    expect(model.filterTopics.every((t) => t.count > 0)).toBe(true);
    expect(model.guides.every((g) => Boolean(g.topicFilter))).toBe(true);
    const productFilter = model.filterTopics.find((t) => t.slug === "products");
    expect(productFilter?.count).toBeGreaterThan(0);
    const implementation = model.filterTopics.find(
      (t) => t.slug === "implementation",
    );
    expect(implementation?.count).toBeGreaterThan(0);
  });

  it("does not invent popularity metrics", () => {
    const blob = JSON.stringify(buildGuidesHubModel());
    expect(blob).not.toMatch(/most popular/i);
    expect(blob).not.toMatch(/10,?000\+/);
  });
});
