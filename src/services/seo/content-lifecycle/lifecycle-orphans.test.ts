import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  canPromoteToIndexable,
  promoteToIndexable,
  resetContentLifecycleCache,
  upsertLifecycleEntry,
} from "@/services/seo/content-lifecycle";
import {
  detectLifecycleOrphans,
  demoteLifecycleOrphan,
} from "@/services/seo/content-lifecycle/lifecycle-orphans";
import { getAllComparisonsUnfiltered, getSoftware } from "@/data";
import { buildSoftwareLookup } from "@/services/seo/compare-index-worthiness/relationship";
import { isEntityIndexable } from "@/domain/quality-gates";
import { getGuides } from "@/data/repositories/guides";
import type { GuidePage } from "@/domain/schemas";

describe("lifecycle orphan detection (FR-016)", () => {
  beforeEach(() => {
    resetContentLifecycleCache();
  });

  afterEach(() => {
    resetContentLifecycleCache();
  });

  it("flags INDEXABLE comparison with no public route as LIFECYCLE_ORPHAN", () => {
    // Prefer a researching shell if present; otherwise fabricate registry-only slug.
    const researching = getAllComparisonsUnfiltered().find(
      (c) => c.metadata.status === "researching",
    );
    const slug = researching?.slug ?? "intercom-vs-zendesk";
    upsertLifecycleEntry({
      kind: "comparison",
      slug,
      lifecycle: "INDEXABLE",
      indexable: true,
      updatedAt: new Date().toISOString(),
      notes: "test phantom promote",
    });

    const findings = detectLifecycleOrphans();
    const hit = findings.find((f) => f.slug === slug && f.kind === "comparison");
    expect(hit).toBeTruthy();
    expect(hit!.code).toBe("LIFECYCLE_ORPHAN");
    expect(["missing_entity", "route_not_public", "promotion_gates_fail", "not_isEntityIndexable"]).toContain(
      hit!.reason,
    );

    demoteLifecycleOrphan(hit!);
    const after = detectLifecycleOrphans().find(
      (f) => f.slug === slug && f.kind === "comparison",
    );
    expect(after).toBeUndefined();
  });

  it("blocks promote when public comparison route does not resolve", () => {
    const soft = buildSoftwareLookup(getSoftware({ includeUnpublished: true }));
    // Fabricate a registry-shaped entity that is not in the public catalogue.
    const phantom = {
      ...getAllComparisonsUnfiltered()[0]!,
      slug: "definitely-not-a-real-pair-xyz-vs-abc",
      productSlugs: ["xyz-missing", "abc-missing"] as [string, string],
      metadata: {
        ...getAllComparisonsUnfiltered()[0]!.metadata,
        status: "researching" as const,
      },
      seo: {
        ...getAllComparisonsUnfiltered()[0]!.seo,
        indexable: false,
        canonicalPath: "/compare/definitely-not-a-real-pair-xyz-vs-abc/",
      },
    };
    const decision = canPromoteToIndexable({
      kind: "comparison",
      entity: phantom,
      soft,
    });
    expect(decision.ok).toBe(false);
    expect(
      decision.detail.join(" ").match(/LIFECYCLE_ORPHAN|null|Relationship gate/i),
    ).toBeTruthy();
  });

  it("blocks promote for thin public shells that fail index gates", () => {
    const soft = buildSoftwareLookup(getSoftware({ includeUnpublished: true }));
    const stub = getAllComparisonsUnfiltered().find(
      (c) => c.slug === "intercom-vs-zendesk" || c.metadata.status === "researching",
    );
    expect(stub).toBeTruthy();
    const decision = canPromoteToIndexable({
      kind: "comparison",
      entity: stub!,
      soft,
    });
    expect(decision.ok).toBe(false);
  });
});

describe("INDEXABLE guide quality (FR-007)", () => {
  beforeEach(() => {
    resetContentLifecycleCache();
  });

  afterEach(() => {
    resetContentLifecycleCache();
  });

  it("rejects promotion without hero visual", () => {
    const base = getGuides({ includeUnpublished: true }).find(
      (g) => g.slug === "what-is-crm",
    );
    expect(base).toBeTruthy();
    const noHero = {
      ...base!,
      slug: base!.slug,
      heroVisual: undefined,
      seo: { ...base!.seo, indexable: false },
    } as GuidePage;

    const decision = canPromoteToIndexable({ kind: "guide", entity: noHero });
    expect(decision.ok).toBe(false);
    expect(decision.detail.some((d) => d.includes("missing-hero-visual"))).toBe(
      true,
    );
  });

  it("does not treat missing-hero guides as entity-indexable", () => {
    const guide = getGuides({ includeUnpublished: true }).find(
      (g) => !g.heroVisual && g.seo.indexable === true,
    );
    expect(guide).toBeTruthy();
    expect(isEntityIndexable({ kind: "guide", entity: guide! })).toBe(false);
  });

  it("still allows promote when gates + hero + route resolve", () => {
    const guide = getGuides({ includeUnpublished: true }).find(
      (g) =>
        g.slug === "what-is-crm" &&
        g.heroVisual?.src &&
        g.seo.indexable === true,
    );
    expect(guide).toBeTruthy();
    // Already indexable → canPromote returns alreadyIndexable
    const decision = canPromoteToIndexable({ kind: "guide", entity: guide! });
    expect(decision.alreadyIndexable || decision.ok).toBe(true);
  });
});
