import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { identityPath, isAliasedPath, normalizePath } from "@/seo/canonical";
import { assessLinkingEligibility } from "@/services/seo/improve-linking/eligibility";

describe("improve linking eligibility", () => {
  it("rejects weak pages that did not improve", () => {
    const r = assessLinkingEligibility({
      pageType: "guide",
      slug: "thin",
      path: "/guides/thin/",
      beforeQuality: 40,
      afterQuality: 41,
      materiallyImproved: false,
      uniqueValueCount: 0,
    });
    expect(r.eligible).toBe(false);
  });

  it("rejects improved pages below quality floor", () => {
    const r = assessLinkingEligibility({
      pageType: "guide",
      slug: "mid",
      path: "/guides/mid/",
      beforeQuality: 50,
      afterQuality: 55,
      materiallyImproved: true,
      uniqueValueCount: 2,
    });
    expect(r.eligible).toBe(false);
    expect(r.reasons.some((x) => x.startsWith("below_min_quality_"))).toBe(
      true,
    );
  });

  it("accepts meaningful quality + value", () => {
    const r = assessLinkingEligibility({
      pageType: "guide",
      slug: "hubspot-plans",
      path: "/guides/hubspot-plans/",
      beforeQuality: 70,
      afterQuality: 95,
      materiallyImproved: true,
      uniqueValueCount: 4,
    });
    expect(r.eligible).toBe(true);
  });

  it("maps injection modules from destination path", async () => {
    const { moduleForTarget } = await import(
      "@/services/seo/improve-linking/module-for-target"
    );
    expect(moduleForTarget("/compare/a-vs-b/")).toBe("relatedComparisons");
    expect(moduleForTarget("/software/hubspot/")).toBe("relatedProducts");
    expect(moduleForTarget("/guides/x/")).toBe("relatedGuides");
    expect(moduleForTarget("/research/crm-pricing/")).toBe("relatedResources");
  });
});

describe("canonical identity vs aliases", () => {
  it("keeps feature alias identity distinct from capability canonical", () => {
    expect(isAliasedPath("/features/pipeline-management/")).toBe(true);
    expect(identityPath("/features/pipeline-management/")).toBe(
      "/features/pipeline-management/",
    );
    expect(normalizePath("/features/pipeline-management/")).toBe(
      "/capabilities/pipeline-management/",
    );
  });
});

describe("link injections merge", () => {
  let tempDir: string;
  const prev = process.env.SG_LINK_INJECTIONS_PATH;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), "sg-link-inj-"));
    const filePath = path.join(tempDir, "link-injections.json");
    writeFileSync(
      filePath,
      JSON.stringify({
        version: "1.0.0",
        updatedAt: new Date().toISOString(),
        edges: [
          {
            fromPath: "/software/hubspot/",
            toPath: "/guides/hubspot-plans/",
            label: "HubSpot plans",
            module: "relatedGuides",
            reason: "test",
            requireIndexable: false,
            score: 95,
          },
        ],
      }),
      "utf8",
    );
    process.env.SG_LINK_INJECTIONS_PATH = filePath;
  });

  afterEach(() => {
    if (prev === undefined) delete process.env.SG_LINK_INJECTIONS_PATH;
    else process.env.SG_LINK_INJECTIONS_PATH = prev;
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("merges injection into empty plan", async () => {
    const { clearLinkInjectionsCache, mergeLinkInjectionsIntoPlan } =
      await import("@/services/internal-linking/link-injections");
    const { EMPTY_LINK_PLAN } = await import(
      "@/services/internal-linking/types"
    );
    clearLinkInjectionsCache();
    const merged = mergeLinkInjectionsIntoPlan(
      EMPTY_LINK_PLAN("/software/hubspot/", "software"),
    );
    expect(
      merged.relatedGuides.some((l) =>
        l.href.includes("/guides/hubspot-plans/"),
      ),
    ).toBe(true);
  }, 30_000);
});
