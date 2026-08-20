import { describe, expect, it } from "vitest";
import { getSoftwareBySlug } from "@/data";
import {
  buildProductGuideMediaBundle,
  resolveCrmProductGuideKind,
  selectProductGuideMedia,
  screenshotRelevantToGuideKind,
} from "@/services/product-guides/media";
import { loadEnrichment } from "@/data/research/store";

describe("product guide media (kind-relevant)", () => {
  it("resolves HubSpot implementation guide identity", () => {
    expect(
      resolveCrmProductGuideKind({
        slug: "hubspot-implementation",
        productSlugs: ["hubspot"],
        topicType: "implementation",
      }),
    ).toEqual({ productSlug: "hubspot", kind: "implementation" });
  });

  it("HubSpot implementation uses tutorial — not overview — and filtered shots", () => {
    const soft = getSoftwareBySlug("hubspot")!;
    const enrichment = loadEnrichment("hubspot")!;
    const bundle = selectProductGuideMedia({
      productSlug: "hubspot",
      productName: soft.name,
      kind: "implementation",
      enrichment,
    });
    expect(bundle.video?.id).toBe("hs-video-sales-hub-tutorial");
    expect(bundle.videoMode).toBe("implementation");
    expect(bundle.screenshots.length).toBeGreaterThan(0);
    expect(bundle.screenshots.length).toBeLessThanOrEqual(4);
    expect(
      bundle.screenshots.every((s) =>
        screenshotRelevantToGuideKind(s, "implementation"),
      ),
    ).toBe(true);
  });

  it("HubSpot plans uses Sales Hub Starter plan walkthrough — not the Sales Hub overview demo", () => {
    const soft = getSoftwareBySlug("hubspot")!;
    const enrichment = loadEnrichment("hubspot")!;
    const bundle = selectProductGuideMedia({
      productSlug: "hubspot",
      productName: soft.name,
      kind: "plans",
      enrichment,
    });
    expect(bundle.video?.id).toBe("hubspot-video-sales-hub-starter-plan");
    expect(bundle.videoMode).toBe("plans");
    expect(bundle.video?.id).not.toBe("hs-video-sales-hub-overview");
    expect(
      bundle.screenshots.every((s) => screenshotRelevantToGuideKind(s, "plans")),
    ).toBe(true);
  });

  it("Attio migration can use official import/migration tutorials", () => {
    const bundle = buildProductGuideMediaBundle({
      slug: "attio-migration",
      productSlugs: ["attio"],
      topicType: "migration",
      productName: "Attio",
    });
    expect(bundle?.videoMode).toBe("migration");
    expect(bundle?.video?.id).toMatch(/import|migrat/i);
  });

  it("Attio setup/implementation use pipeline or getting-started tutorials; worth-it keeps an overview", () => {
    const worth = buildProductGuideMediaBundle({
      slug: "is-attio-worth-it",
      productSlugs: ["attio"],
      topicType: "selection",
      productName: "Attio",
    });
    expect(worth?.videoMode).toBe("overview");
    expect(worth?.video?.id).toBeTruthy();

    const setup = buildProductGuideMediaBundle({
      slug: "attio-setup",
      productSlugs: ["attio"],
      topicType: "setup",
      productName: "Attio",
    });
    expect(setup?.videoMode).toBe("implementation");
    expect(setup?.video?.id).toBeTruthy();

    const impl = buildProductGuideMediaBundle({
      slug: "attio-implementation",
      productSlugs: ["attio"],
      topicType: "implementation",
      productName: "Attio",
    });
    expect(impl?.videoMode).toBe("implementation");
    expect(impl?.video?.id).toBeTruthy();
  });

  it("Creatio migration can use Freedom UI migration video", () => {
    const bundle = buildProductGuideMediaBundle({
      slug: "creatio-migration",
      productSlugs: ["creatio"],
      topicType: "migration",
      productName: "Creatio",
    });
    expect(bundle?.video?.id).toBe("creatio-video-freedom-ui");
    expect(bundle?.videoMode).toBe("migration");
  });

  it("ignores non product-guide pages", () => {
    expect(
      buildProductGuideMediaBundle({
        slug: "how-to-choose-crm",
        productSlugs: [],
        topicType: "selection",
      }),
    ).toBeNull();
  });
});
