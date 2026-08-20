import { describe, expect, it } from "vitest";
import { AlternativesPageSchema } from "@/domain";
import { evaluateAlternativesQuality, isEntityIndexable } from "@/domain/quality-gates";
import { alternativesSeed } from "@/data/seed/alternatives";
import { softwareSeed } from "@/data/seed/software";
import { catalogueSubstituteSlugs } from "@/data/seed/ecosystem-shells";
import { buildAlternativesFromResearch } from "./materialize-alternatives";

describe("buildAlternativesFromResearch", () => {
  const pages = alternativesSeed.map((page) => AlternativesPageSchema.parse(page));
  const bySlug = new Map(pages.map((page) => [page.slug, page]));
  const known = new Set(softwareSeed.map((product) => product.slug));

  it("makes catalogue substitutes indexable without inventing peers or ranks", () => {
    const indexable = pages.filter((page) =>
      isEntityIndexable({ kind: "alternatives", entity: page }),
    );
    expect(indexable.length).toBeGreaterThanOrEqual(270);

    for (const page of indexable) {
      expect(known.has(page.sourceSlug)).toBe(true);
      expect(evaluateAlternativesQuality(page).ok).toBe(true);
      expect(page.editorialStatus).toBe("approved");
      expect(JSON.stringify(page)).not.toMatch(/\bwe tested\b/i);
      expect(JSON.stringify(page)).not.toMatch(/\bbest overall\b/i);
      if (page.metadata.publishedAt === "2026-08-18T16:00:00.000Z") {
        expect(page.summary?.toLowerCase()).toMatch(/not a ranked/);
      }
      for (const entry of page.alternatives) {
        expect(known.has(entry.targetSlug)).toBe(true);
        expect(entry.targetSlug).not.toBe(page.sourceSlug);
        expect(entry.relativePricing).toBe("unknown");
      }
    }
  });

  it("leaves Fastmail and SaneBox without a two-substitute page", () => {
    expect(bySlug.has("fastmail")).toBe(false);
    expect(bySlug.has("sanebox")).toBe(false);
    const fastmail = softwareSeed.find((item) => item.slug === "fastmail")!;
    const sanebox = softwareSeed.find((item) => item.slug === "sanebox")!;
    expect(catalogueSubstituteSlugs(fastmail, softwareSeed).length).toBeLessThan(2);
    expect(catalogueSubstituteSlugs(sanebox, softwareSeed).length).toBeLessThan(2);
  });

  it("does not overwrite the Pipedrive review-required page", () => {
    const page = bySlug.get("pipedrive");
    expect(page?.editorialStatus).toBe("review-required");
    expect(page?.seo.indexable).toBe(false);
    expect(
      isEntityIndexable({ kind: "alternatives", entity: page! }),
    ).toBe(false);
  });

  it("skips authored pages when generating research rows", () => {
    const generated = buildAlternativesFromResearch(softwareSeed, [
      {
        id: "alt-hubspot",
        slug: "hubspot",
        title: "HubSpot alternatives",
        sourceSlug: "hubspot",
        alternatives: [],
        editorialStatus: "approved",
        metadata: { status: "published", researchStatus: "complete" },
        seo: { indexable: true },
      },
    ]);
    expect(generated.some((page) => page.slug === "hubspot")).toBe(false);
    expect(generated.some((page) => page.slug === "fastmail")).toBe(false);
  });
});
