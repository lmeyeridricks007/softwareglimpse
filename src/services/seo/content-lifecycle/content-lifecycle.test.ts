import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Comparison, GuidePage } from "@/domain/schemas";
import { getGuides } from "@/data/repositories/guides";
import { getAllComparisonsUnfiltered, getSoftware } from "@/data";
import { getGuideBySlug } from "@/data/repositories/guides";
import { isEntityIndexable } from "@/domain/quality-gates";
import { getSitemapEntries } from "@/seo/sitemap";
import { canonicalUrl } from "@/seo/canonical";
import {
  buildSoftwareLookup,
  evaluateComparisonIndexWorthiness,
  isComparisonSearchIndexWorthy,
} from "@/services/seo/compare-index-worthiness";
import {
  evaluateGuideIndexWorthiness,
  isFactoryProductPackGuide,
  isGuideSearchIndexWorthy,
  isProductExplainerGuide,
} from "@/services/seo/guides-index-worthiness";
import {
  canPromoteToIndexable,
  guidePassesPromotionGates,
  promoteToIndexable,
  removeLifecycleEntry,
  resetContentLifecycleCache,
  upsertLifecycleEntry,
} from "@/services/seo/content-lifecycle";

function richGuideStub(overrides: Partial<GuidePage> & Pick<GuidePage, "slug">): GuidePage {
  const body = Array.from({ length: 8 }, (_, i) => {
    const topics = [
      "pipeline stage mapping against Harbor opportunity hygiene",
      "seat economics versus Pulse for five-rep pods",
      "Northstar reporting constraints during quarterly forecasting",
      "migration cutover checklists for custom activity history",
      "integration latency budgets with marketing automation",
      "permission models for regional sales managers",
      "discount approval workflows tied to margin floors",
      "sandbox rehearsal scripts before production flip",
    ];
    return {
      type: "step" as const,
      title: `Step ${i + 1}: ${topics[i]}`,
      body: `Detailed guidance (${i}) for ${overrides.slug}: ${topics[i]}. Include owner, SLA, rollback, and evidence required before go-live.`,
    };
  });
  return {
    id: `guide-${overrides.slug}`,
    slug: overrides.slug,
    title: overrides.title ?? `Deep guide for ${overrides.slug}`,
    summary: "Unique decision framework for this product context.",
    topicType: "implementation",
    journeyStage: "evaluate",
    categorySlugs: ["crm"],
    productSlugs: ["pipedrive"],
    relatedGuideSlugs: ["what-is-crm"],
    supports: [{ kind: "category", slug: "crm" }],
    nextAction: { kind: "category", slug: "crm", label: "CRM hub" },
    blocks: body,
    sections: [
      {
        id: "a",
        heading: "Context",
        body: "Unique section A with product-specific Pipedrive scenarios for Harbor teams.",
      },
      {
        id: "b",
        heading: "Decision",
        body: "Unique section B with pricing tradeoffs versus Pulse for five-seller orgs.",
      },
      {
        id: "c",
        heading: "Rollout",
        body: "Unique section C with migration pitfalls and Northstar reporting constraints.",
      },
    ],
    faq: [
      {
        question: "When should mid-market teams pick this path?",
        answer: "When Harbor seat math beats Pulse for five sellers on Pipedrive pipelines.",
      },
      {
        question: "What breaks during migration?",
        answer: "Custom field mapping and activity history are the usual failure modes.",
      },
    ],
    checklist: [{ id: "c1", label: "Map pipeline stages" }],
    heroVisual: { src: "/guides/test.png", alt: "Diagram" },
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      author: "editorial",
    },
    seo: {
      title: `Guide ${overrides.slug}`,
      description: "Unique meta for promotion testing.",
      indexable: false,
      canonicalPath: `/guides/${overrides.slug}/`,
    },
    ...overrides,
  } as GuidePage;
}

function declaredComparisonStub(
  _soft: ReturnType<typeof buildSoftwareLookup>,
): Comparison | null {
  void _soft;
  const products = getSoftware().filter(
    (s) =>
      s.primaryCategorySlug === "crm" &&
      (s.competitorSlugs?.length ?? 0) > 0,
  );
  const a = products[0];
  const bSlug = a?.competitorSlugs?.[0];
  const b = products.find((p) => p.slug === bSlug) ?? getSoftware().find((p) => p.slug === bSlug);
  if (!a || !b) return null;

  const slug = `${[a.slug, b.slug].sort().join("-vs-")}`;
  return {
    id: `cmp-${slug}`,
    slug,
    title: `${a.name} vs ${b.name}`,
    productSlugs: [a.slug, b.slug].sort() as [string, string],
    categorySlug: "crm",
    criterionSlugs: ["ease-of-use", "pricing", "integrations"],
    outcomes: [
      {
        criterionSlug: "ease-of-use",
        winnerKind: "product-a",
        reason: `${a.name} is simpler for SMB pipelines on daily deal updates versus ${b.name}.`,
        confidence: "high",
        supportingFactIds: ["f1"],
        assessmentIds: ["a1"],
        researchStatus: "complete",
      },
      {
        criterionSlug: "pricing",
        winnerKind: "product-b",
        reason: `${b.name} seats cost less at five-seller teams than ${a.name}.`,
        confidence: "high",
        supportingFactIds: ["f2"],
        assessmentIds: ["a2"],
        researchStatus: "complete",
      },
      {
        criterionSlug: "integrations",
        winnerKind: "product-a",
        reason: `${a.name} documents deeper CRM sync for this buyer than ${b.name}.`,
        confidence: "medium",
        supportingFactIds: ["f3"],
        assessmentIds: ["a3"],
        researchStatus: "complete",
      },
    ],
    verdict: `Pick ${a.name} for suite breadth; pick ${b.name} when pipeline speed matters most.`,
    overallWinnerKind: "depends",
    bestFor: [
      { productSlug: a.slug, scenarios: ["SMB sales teams"] },
      { productSlug: b.slug, scenarios: ["Growing GTM orgs"] },
    ],
    pricingNotes: "Both publish seat-based list pricing.",
    scenarioRecommendations: [],
    useCaseOutcomes: [],
    relatedAlternativeSlugs: [],
    editorialStatus: "approved",
    refreshNeeded: false,
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-01T00:00:00.000Z",
      updatedAt: "2026-08-01T00:00:00.000Z",
    },
    seo: {
      title: `${a.name} vs ${b.name}`,
      description: "Compare features and pricing.",
      indexable: false,
      canonicalPath: `/compare/${slug}/`,
    },
  } as Comparison;
}

describe("content lifecycle preserve → improve → promote", () => {
  let tempDir: string;
  let previousPath: string | undefined;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), "sg-lifecycle-"));
    previousPath = process.env.SG_CONTENT_LIFECYCLE_PATH;
    process.env.SG_CONTENT_LIFECYCLE_PATH = path.join(
      tempDir,
      "content-lifecycle.json",
    );
    resetContentLifecycleCache();
  });

  afterEach(() => {
    if (previousPath === undefined) {
      delete process.env.SG_CONTENT_LIFECYCLE_PATH;
    } else {
      process.env.SG_CONTENT_LIFECYCLE_PATH = previousPath;
    }
    resetContentLifecycleCache();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("keeps IMPROVE factory / explainer guides in the estate (not deleted)", () => {
    const guides = getGuides();
    const factory = guides.find((g) => isFactoryProductPackGuide(g));
    const explainer = guides.find((g) => isProductExplainerGuide(g));
    expect(factory).toBeTruthy();
    expect(getGuideBySlug(factory!.slug)).toBeTruthy();

    const evaluation = evaluateGuideIndexWorthiness(factory!);
    expect(evaluation.lifecycle).toBe("IMPROVE");
    expect(evaluation.searchIndexable).toBe(false);
    expect(evaluation.improvementReasons.length).toBeGreaterThan(0);
    expect(evaluation.remediationRequirements.length).toBeGreaterThan(0);
    // Still routable catalogue entry
    expect(guides.some((g) => g.slug === factory!.slug)).toBe(true);

    if (explainer) {
      const expEval = evaluateGuideIndexWorthiness(explainer);
      // Enriched explainers may reach INDEXABLE / INDEXABLE_READY; weak ones stay IMPROVE.
      // Never RETIRED / redirected — URL remains in the catalogue estate.
      expect(["IMPROVE", "INDEXABLE", "INDEXABLE_READY", "IMPROVING"]).toContain(
        expEval.lifecycle,
      );
      expect(guides.some((g) => g.slug === explainer.slug)).toBe(true);
    }
  }, 30_000);

  it("promotes an enriched IMPROVE guide into sitemap without seed edit", () => {
    // Factory-pattern slug stays in IMPROVE until unique enrichment clears promotion gates
    const stub = richGuideStub({
      slug: "pipedrive-implementation",
      title: "Pipedrive implementation playbook for mid-market CRM teams",
    });
    expect(isFactoryProductPackGuide(stub)).toBe(true);
    expect(isGuideSearchIndexWorthy(stub)).toBe(false);

    const before = canPromoteToIndexable({ kind: "guide", entity: stub });
    expect(before.ok).toBe(true);
    expect(before.lifecycle).toBe("INDEXABLE_READY");

    const promoted = promoteToIndexable({ kind: "guide", entity: stub });
    expect(promoted.ok).toBe(true);
    expect(promoted.entry?.lifecycle).toBe("INDEXABLE");
    expect(promoted.entry?.indexable).toBe(true);

    // Runtime gate flips without mutating stub.seo.indexable
    expect(stub.seo.indexable).toBe(false);
    expect(isGuideSearchIndexWorthy(stub)).toBe(true);
    expect(isEntityIndexable({ kind: "guide", entity: stub })).toBe(true);
  });

  it("promoted live guide enters sitemap; retired cannot", () => {
    const live = getGuides().find(
      (g) =>
        g.slug === "what-is-crm" &&
        isEntityIndexable({ kind: "guide", entity: g }),
    );
    expect(live).toBeTruthy();

    const urlsBefore = new Set(getSitemapEntries().map((e) => e.url));
    expect(urlsBefore.has(canonicalUrl("/guides/what-is-crm/"))).toBe(true);

    // Retire via registry — must drop from sitemap eligibility
    upsertLifecycleEntry({
      kind: "guide",
      slug: "what-is-crm",
      lifecycle: "RETIRED",
      indexable: false,
      updatedAt: new Date().toISOString(),
      notes: "test retirement",
    });

    expect(
      isEntityIndexable({ kind: "guide", entity: live! }),
    ).toBe(false);
    expect(
      new Set(getSitemapEntries().map((e) => e.url)).has(
        canonicalUrl("/guides/what-is-crm/"),
      ),
    ).toBe(false);

    removeLifecycleEntry("guide", "what-is-crm");
    expect(
      isEntityIndexable({ kind: "guide", entity: live! }),
    ).toBe(true);

    // Promote a real catalogue guide that is not yet indexable
    const candidate = getGuides().find(
      (g) =>
        g.seo.indexable !== true &&
        !isFactoryProductPackGuide(g) &&
        !isProductExplainerGuide(g) &&
        guidePassesPromotionGates(g).ok,
    );
    if (!candidate) return;

    expect(
      new Set(getSitemapEntries().map((e) => e.url)).has(
        canonicalUrl(`/guides/${candidate.slug}/`),
      ),
    ).toBe(false);

    const promoted = promoteToIndexable({ kind: "guide", entity: candidate });
    expect(promoted.ok).toBe(true);
    expect(isEntityIndexable({ kind: "guide", entity: candidate })).toBe(true);
    expect(
      new Set(getSitemapEntries().map((e) => e.url)).has(
        canonicalUrl(`/guides/${candidate.slug}/`),
      ),
    ).toBe(true);
  });

  it("comparison IMPROVE pages stay routable and can promote after relationship + quality", () => {
    const soft = buildSoftwareLookup(getSoftware());
    const cartesian = getAllComparisonsUnfiltered().find((c) => {
      const evaluation = evaluateComparisonIndexWorthiness(c, { soft });
      return evaluation.lifecycle === "IMPROVE";
    });
    expect(cartesian).toBeTruthy();
    expect(
      getAllComparisonsUnfiltered().some((c) => c.slug === cartesian!.slug),
    ).toBe(true);
    expect(isComparisonSearchIndexWorthy(cartesian!, soft)).toBe(false);

    const stub = declaredComparisonStub(soft);
    expect(stub).toBeTruthy();
    if (!stub) return;

    const decision = canPromoteToIndexable({
      kind: "comparison",
      entity: stub,
      soft,
    });
    expect(decision.ok).toBe(true);

    const result = promoteToIndexable({
      kind: "comparison",
      entity: stub,
      soft,
    });
    expect(result.ok).toBe(true);
    expect(isComparisonSearchIndexWorthy(stub, soft)).toBe(true);
    expect(isEntityIndexable({ kind: "comparison", entity: stub })).toBe(true);
  });

  it("valid existing noindex URLs remain catalogue-routable", () => {
    const factory = getGuides().find((g) => isFactoryProductPackGuide(g));
    expect(factory).toBeTruthy();
    // Catalogue resolution — pages are not removed for being weak
    expect(getGuideBySlug(factory!.slug)?.slug).toBe(factory!.slug);
    expect(isEntityIndexable({ kind: "guide", entity: factory! })).toBe(false);

    const soft = buildSoftwareLookup(getSoftware());
    const weakCompare = getAllComparisonsUnfiltered().find(
      (c) => !isComparisonSearchIndexWorthy(c, soft),
    );
    expect(weakCompare).toBeTruthy();
    expect(
      getAllComparisonsUnfiltered().find((c) => c.slug === weakCompare!.slug),
    ).toBeTruthy();
  });
});
