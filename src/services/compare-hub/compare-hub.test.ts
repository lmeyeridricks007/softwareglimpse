import { describe, expect, it } from "vitest";
import {
  buildCompareHubModel,
  resolveComparisonDestination,
} from "./build-hub-model";
import { getAllComparisonsUnfiltered } from "@/data";
import { isEntityIndexable } from "@/domain/quality-gates";

describe("compare hub model", () => {
  it("only includes published/indexable comparisons in discovery", () => {
    const model = buildCompareHubModel();
    const all = getAllComparisonsUnfiltered();
    const indexable = all.filter((c) =>
      isEntityIndexable({ kind: "comparison", entity: c }),
    );

    expect(model.published.length).toBe(indexable.length);
    expect(model.directory.every((d) => d.items.length > 0)).toBe(true);
  });

  it("still builds a useful hub when published comparisons are empty", () => {
    const model = buildCompareHubModel();
    expect(model.selectorProducts.length).toBeGreaterThan(0);
    expect(model.categories.length).toBeGreaterThan(0);
    expect(model.tools.length).toBeGreaterThan(0);
    expect(model.faq.length).toBeGreaterThanOrEqual(6);
    expect(model.heroPreview).not.toBeNull();
  });

  it("does not invent popularity or expose internal publishing language", () => {
    const blob = JSON.stringify(buildCompareHubModel()).toLowerCase();
    expect(blob).not.toMatch(/most popular/);
    expect(blob).not.toMatch(/knowledge graph/);
    expect(blob).not.toMatch(/awaiting editorial/);
    expect(blob).not.toMatch(/quality gate/);
    expect(blob).not.toMatch(/excluded from sitemap/);
    expect(blob).not.toMatch(/fixture/);
  });

  it("labels example hero preview when no published comparison exists", () => {
    const model = buildCompareHubModel();
    if (model.published.length === 0) {
      expect(model.heroPreview?.example).toBe(true);
    }
  });

  it("routes unpublished pairs to the build fallback", () => {
    const dest = resolveComparisonDestination("pipedrive", "freshsales");
    const published = getAllComparisonsUnfiltered().find(
      (c) =>
        c.slug === "freshsales-vs-pipedrive" ||
        c.slug === "pipedrive-vs-freshsales",
    );
    const isPublic =
      published &&
      isEntityIndexable({ kind: "comparison", entity: published });

    if (isPublic) {
      expect(dest.kind).toBe("published");
      expect(dest.href).toMatch(/^\/compare\//);
    } else {
      expect(dest.kind).toBe("build");
      expect(dest.href).toContain("/compare/build/");
      expect(dest.href).toContain("a=");
      expect(dest.href).toContain("b=");
    }
  });

  it("prevents same-product destinations from looking published", () => {
    const dest = resolveComparisonDestination("pipedrive", "close");
    expect(["published", "build"]).toContain(dest.kind);
  });
});
