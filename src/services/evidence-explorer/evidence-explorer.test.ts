import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import {
  availableEvidenceKinds,
  buildFeatureEvidenceExplorer,
  filterEvidenceExplorerItems,
  groupEvidenceExplorerItems,
  type EvidenceExplorerFilters,
  type EvidenceExplorerItem,
  type EvidenceExplorerModel,
} from "@/services/evidence-explorer";
import { getFeatureDetailPage } from "@/services/feature-detail";

function item(partial: Partial<EvidenceExplorerItem> & Pick<EvidenceExplorerItem, "id" | "kind">): EvidenceExplorerItem {
  return {
    productSlug: partial.productSlug ?? null,
    productName: partial.productName ?? null,
    logo: null,
    title: partial.title ?? partial.id,
    supportsLabels: partial.supportsLabels ?? [],
    demonstrates: partial.demonstrates ?? [],
    dimensionIds: partial.dimensionIds ?? [],
    verifiedAt: partial.verifiedAt ?? null,
    sourceUrl: partial.sourceUrl ?? null,
    media: partial.media ?? null,
    screenshotSrc: partial.screenshotSrc ?? null,
    screenshotAlt: partial.screenshotAlt ?? null,
    ...partial,
  };
}

const sampleItems: EvidenceExplorerItem[] = [
  item({
    id: "doc:hubspot:a",
    kind: "documentation",
    productSlug: "hubspot",
    productName: "HubSpot",
    title: "Workflow enrollment triggers",
    supportsLabels: ["Triggers"],
    dimensionIds: ["triggers"],
    sourceUrl: "https://knowledge.hubspot.com/example",
  }),
  item({
    id: "shot:hubspot:1",
    kind: "screenshot",
    productSlug: "hubspot",
    productName: "HubSpot",
    title: "HubSpot workflow builder",
    demonstrates: ["Conditional branch configuration"],
    dimensionIds: ["paths"],
    screenshotSrc: "/media/hubspot-workflow.png",
  }),
  item({
    id: "video:hubspot-demo",
    kind: "official-video",
    productSlug: "hubspot",
    productName: "HubSpot",
    title: "Workflow automation demo",
    supportsLabels: ["Workflow Automation"],
    demonstrates: ["Trigger configuration", "Conditional paths"],
    dimensionIds: ["triggers", "paths"],
    verifiedAt: "2026-08-14",
    sourceUrl: "https://www.youtube.com/watch?v=tRpOCQ15L7M",
    media: ProductMediaSchema.parse({
      id: "hubspot-demo",
      productSlug: "hubspot",
      type: "official-tutorial",
      provider: "youtube",
      sourceUrl: "https://www.youtube.com/watch?v=tRpOCQ15L7M",
      videoId: "tRpOCQ15L7M",
      embedUrl: "https://www.youtube-nocookie.com/embed/tRpOCQ15L7M",
      title: "Workflow automation demo",
      thumbnailUrl: "https://i.ytimg.com/vi/tRpOCQ15L7M/hqdefault.jpg",
      officialSource: true,
      officialSourceKind: "vendor-training",
      verifiedAt: "2026-08-14T18:00:00.000Z",
      featureIds: ["workflow-automation"],
      demonstratedDimensionIds: ["triggers", "paths"],
      whatThisShows: ["Trigger configuration", "Conditional paths"],
      status: "published",
    }),
  }),
  item({
    id: "doc:pipedrive:a",
    kind: "documentation",
    productSlug: "pipedrive",
    productName: "Pipedrive",
    title: "Automations overview",
    dimensionIds: ["triggers"],
    sourceUrl: "https://support.pipedrive.com/example",
  }),
  item({
    id: "shot:pipedrive:1",
    kind: "screenshot",
    productSlug: "pipedrive",
    productName: "Pipedrive",
    title: "Pipedrive automation builder",
    dimensionIds: ["paths"],
    screenshotSrc: "/media/pipedrive-auto.png",
  }),
  item({
    id: "doc:salesforce:a",
    kind: "documentation",
    productSlug: "salesforce-sales-cloud",
    productName: "Salesforce Sales Cloud",
    title: "Flow triggers",
    dimensionIds: ["triggers"],
    sourceUrl: "https://help.salesforce.com/example",
  }),
];

const products = [
  { slug: "hubspot", name: "HubSpot" },
  { slug: "pipedrive", name: "Pipedrive" },
  { slug: "salesforce-sales-cloud", name: "Salesforce Sales Cloud" },
];

const dimensions = [
  { id: "triggers", name: "Triggers" },
  { id: "paths", name: "Conditional paths" },
];

describe("availableEvidenceKinds", () => {
  it("omits video when no videos exist (no empty video filter)", () => {
    const docsOnly = sampleItems.filter((i) => i.kind !== "official-video");
    expect(availableEvidenceKinds(docsOnly)).toEqual([
      "documentation",
      "screenshot",
    ]);
    expect(availableEvidenceKinds(docsOnly)).not.toContain("official-video");
  });

  it("lists all present kinds when media is rich", () => {
    expect(availableEvidenceKinds(sampleItems)).toEqual([
      "documentation",
      "screenshot",
      "official-video",
    ]);
  });
});

describe("filterEvidenceExplorerItems", () => {
  const base: EvidenceExplorerFilters = {
    productSlug: "all",
    kind: "all",
    dimensionId: "all",
    workflowId: "all",
    requirementId: "all",
    featureId: "all",
    groupBy: "none",
  };

  it("filters by product", () => {
    const result = filterEvidenceExplorerItems(sampleItems, {
      ...base,
      productSlug: "pipedrive",
    });
    expect(result).toHaveLength(2);
    expect(result.every((i) => i.productSlug === "pipedrive")).toBe(true);
  });

  it("filters by evidence type", () => {
    const videos = filterEvidenceExplorerItems(sampleItems, {
      ...base,
      kind: "official-video",
    });
    expect(videos).toHaveLength(1);
    expect(videos[0]?.id).toBe("video:hubspot-demo");
  });

  it("filters by evaluation dimension", () => {
    const triggers = filterEvidenceExplorerItems(sampleItems, {
      ...base,
      dimensionId: "triggers",
    });
    expect(triggers.map((i) => i.id).sort()).toEqual([
      "doc:hubspot:a",
      "doc:pipedrive:a",
      "doc:salesforce:a",
      "video:hubspot-demo",
    ]);
  });

  it("combines product + kind + dimension", () => {
    const result = filterEvidenceExplorerItems(sampleItems, {
      ...base,
      productSlug: "hubspot",
      kind: "documentation",
      dimensionId: "triggers",
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("doc:hubspot:a");
  });
});

describe("groupEvidenceExplorerItems", () => {
  it("groups by product without empty product sections", () => {
    const hubspotOnly = sampleItems.filter((i) => i.productSlug === "hubspot");
    const groups = groupEvidenceExplorerItems(hubspotOnly, "product", {
      products,
      dimensions,
    });
    expect(groups.map((g) => g.id)).toEqual(["hubspot"]);
    expect(groups[0]?.items).toHaveLength(3);
  });

  it("groups many products with docs/screenshots/videos under each", () => {
    const groups = groupEvidenceExplorerItems(sampleItems, "product", {
      products,
      dimensions,
    });
    expect(groups.map((g) => g.id)).toEqual([
      "hubspot",
      "pipedrive",
      "salesforce-sales-cloud",
    ]);
    const hubspot = groups.find((g) => g.id === "hubspot");
    expect(hubspot?.items.map((i) => i.kind).sort()).toEqual([
      "documentation",
      "official-video",
      "screenshot",
    ]);
  });

  it("groups by evaluation criterion across products", () => {
    const groups = groupEvidenceExplorerItems(sampleItems, "dimension", {
      products,
      dimensions,
    });
    expect(groups[0]?.id).toBe("triggers");
    expect(groups[0]?.label).toBe("Triggers");
    const productSlugs = new Set(
      groups[0]?.items.map((i) => i.productSlug) ?? [],
    );
    expect(productSlugs.has("hubspot")).toBe(true);
    expect(productSlugs.has("pipedrive")).toBe(true);
    expect(productSlugs.has("salesforce-sales-cloud")).toBe(true);
  });

  it("returns a single flat group when groupBy is none", () => {
    const groups = groupEvidenceExplorerItems(sampleItems, "none");
    expect(groups).toHaveLength(1);
    expect(groups[0]?.items).toHaveLength(sampleItems.length);
  });
});

describe("buildFeatureEvidenceExplorer (live feature pages)", () => {
  it("builds rich explorer for workflow-automation (many media)", () => {
    const page = getFeatureDetailPage("workflow-automation");
    expect(page).not.toBeNull();
    const explorer = buildFeatureEvidenceExplorer(page!);
    expect(explorer.heading).toBe("Feature evidence");
    expect(explorer.supporting).toContain("official documentation");
    expect(explorer.items.length).toBeGreaterThan(0);
    expect(explorer.typeCounts.all).toBe(explorer.items.length);

    const kinds = availableEvidenceKinds(explorer.items);
    // Video may or may not be present depending on enrichment — do not invent.
    if (explorer.typeCounts["official-video"] === 0) {
      expect(kinds).not.toContain("official-video");
    } else {
      expect(kinds).toContain("official-video");
    }

    // Filter combination smoke
    if (explorer.products[0]) {
      const filtered = filterEvidenceExplorerItems(explorer.items, {
        productSlug: explorer.products[0].slug,
        kind: "all",
        dimensionId: "all",
        groupBy: "none",
      });
      expect(filtered.every((i) => i.productSlug === explorer.products[0].slug)).toBe(
        true,
      );
    }

    const byProduct = groupEvidenceExplorerItems(explorer.items, "product", {
      products: explorer.products,
      dimensions: explorer.dimensions,
    });
    expect(byProduct.every((g) => g.items.length > 0)).toBe(true);
  });

  it("works with no-video features (docs/screenshots only)", () => {
    for (const slug of ["sso", "multiple-pipelines"] as const) {
      const page = getFeatureDetailPage(slug);
      if (!page) continue;
      const explorer = buildFeatureEvidenceExplorer(page);
      if (explorer.items.length === 0) continue;

      const kinds = availableEvidenceKinds(explorer.items);
      if (explorer.typeCounts["official-video"] === 0) {
        expect(kinds).not.toContain("official-video");
      }
      // Explorer still builds with remaining types
      expect(explorer.typeCounts.all).toBe(
        explorer.typeCounts.documentation +
          explorer.typeCounts.screenshot +
          explorer.typeCounts["official-video"],
      );
    }
  });

  it("supports many products without inventing empty groups", () => {
    const page = getFeatureDetailPage("workflow-automation");
    if (!page) return;
    const explorer = buildFeatureEvidenceExplorer(page);
    const groups = groupEvidenceExplorerItems(explorer.items, "product", {
      products: explorer.products,
      dimensions: explorer.dimensions,
    });
    expect(groups.length).toBeLessThanOrEqual(explorer.products.length);
    expect(groups.every((g) => g.items.length > 0)).toBe(true);
  });
});

describe("EvidenceExplorerModel shape for reuse", () => {
  it("exposes a page-agnostic model contract", () => {
    const model: EvidenceExplorerModel = {
      heading: "Feature evidence",
      supporting: "Explore the official documentation…",
      subjectLabel: "Workflow automation",
      items: sampleItems,
      products,
      dimensions,
      typeCounts: {
        all: sampleItems.length,
        documentation: 3,
        screenshot: 2,
        "official-video": 1,
      },
    };
    expect(model.items[0]?.kind).toBeDefined();
    expect(availableEvidenceKinds(model.items).length).toBeGreaterThan(0);
  });
});
