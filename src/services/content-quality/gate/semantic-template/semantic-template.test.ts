import { describe, expect, it } from "vitest";
import {
  assessGuideSemanticTemplateRisk,
  assessEnrichmentBatchFamilyQa,
  combinedSimilarity,
  detectUniqueAnalysisSignals,
  extractGuideAnalysisSections,
  normalizeEditorialText,
  SEMANTIC_SIMILARITY_HIGH,
} from "@/services/content-quality/gate/semantic-template";
import {
  collectHardFails,
  guidePassesIndexGates,
} from "@/services/content-quality/gate";
import { getGuides } from "@/data/repositories/guides";
import type { GuidePage } from "@/domain/schemas";

function stubGuide(
  slug: string,
  product: string,
  bodyVariant: "template" | "unique",
): GuidePage {
  const name = product.replace(/-/g, " ");
  const sharedShell =
    "Teams evaluating software should start with must-have workflows, then compare pricing models, then shortlist vendors that fit company size. Use a structured checklist before buying.";
  const unique =
    bodyVariant === "unique"
      ? `${name} is worth it when your outbound team needs verified mobiles under a $80/seat threshold. Weak fit for enterprise SSO-heavy IT buyers. Migration risk rises if you rely on custom HubSpot workflows. Unlike ${name === "hubspot" ? "pipedrive" : "hubspot"}, it trades depth for speed because reps live in sequences.`
      : `${sharedShell} ${name} helps businesses of all sizes streamline pipelines with a comprehensive suite of features.`;

  return {
    id: `g-${slug}`,
    slug,
    title: `Is ${name} worth it?`,
    summary: unique.slice(0, 180),
    categorySlugs: ["crm"],
    productSlugs: [product],
    topicType: "selection",
    journeyStage: "evaluate",
    supports: [`software:${product}`],
    sections: [
      {
        id: "intro",
        heading: "Overview",
        body: unique,
      },
      {
        id: "decide",
        heading: "Decision framework",
        body:
          bodyVariant === "unique"
            ? `Choose ${name} only if you need the pricing threshold and target buyer fit above. Trade-off: less admin depth.`
            : sharedShell,
      },
      {
        id: "limit",
        heading: "Limitations",
        body:
          bodyVariant === "unique"
            ? `Not ideal when you need complex territory management. Avoid if migration risk from legacy CRM is unacceptable.`
            : "Limitations depend on your team size and industry requirements.",
      },
      {
        id: "end",
        heading: "Conclusion",
        body:
          bodyVariant === "unique"
            ? `Final recommendation: prefer ${name} for SMB outbound; skip for enterprise IT-led deals.`
            : sharedShell,
      },
    ],
    blocks: [],
    checklist: [
      { id: "c1", label: "Confirm must-have workflows" },
      { id: "c2", label: "Compare pricing models" },
      { id: "c3", label: "Shortlist by company size" },
    ],
    faq: [],
    metadata: { status: "published" },
    seo: { indexable: false, description: unique.slice(0, 120) },
  } as GuidePage;
}

describe("semantic template risk", () => {
  it("strips product names and prices from editorial normalization", () => {
    const a = normalizeEditorialText(
      "HubSpot is worth it under $50/seat for SMB teams",
      ["hubspot"],
    );
    const b = normalizeEditorialText(
      "Pipedrive is worth it under $40/seat for SMB teams",
      ["pipedrive"],
    );
    expect(a).not.toMatch(/hubspot|50|40|pipedrive/i);
    expect(combinedSimilarity(a, b)).toBeGreaterThan(0.7);
  });

  it("detects page-specific unique analysis signals", () => {
    const signals = detectUniqueAnalysisSignals(
      "Worth it when budget stays under a $80/seat threshold. Weak fit for enterprise SSO. Migration risk if you cut over mid-quarter. Unlike Pipedrive, HubSpot wins because marketing attribution is deeper. Workflow advantage for outbound sequences. Implementation complexity rises without a CRM admin.",
    );
    expect(signals).toEqual(
      expect.arrayContaining([
        "specific_buyer_fit",
        "specific_price_threshold",
        "specific_poor_fit_buyer",
        "specific_migration_concern",
        "specific_competitor_difference",
        "specific_workflow_advantage",
        "specific_implementation_complexity",
      ]),
    );
  });

  it("flags SEMANTIC_TEMPLATE_RISK when siblings share analysis shells", () => {
    const a = stubGuide("is-alpha-worth-it", "alpha", "template");
    const b = stubGuide("is-beta-worth-it", "beta", "template");
    const c = stubGuide("is-gamma-worth-it", "gamma", "template");
    const d = stubGuide("is-delta-worth-it", "delta", "template");
    const e = stubGuide("is-epsilon-worth-it", "epsilon", "template");
    const assessment = assessGuideSemanticTemplateRisk(a, [b, c, d, e]);
    expect(assessment.maxSemanticSimilarity).toBeGreaterThanOrEqual(
      SEMANTIC_SIMILARITY_HIGH - 0.15,
    );
    expect(assessment.blocksAutoPromotion).toBe(true);
    expect(assessment.riskSignals).toContain("SEMANTIC_TEMPLATE_RISK");
    expect(assessment.promotionReason).toMatch(/SEMANTIC_TEMPLATE_RISK|Blocked/i);
  });

  it("does not auto-promote template-similar pages through index gates", () => {
    const a = stubGuide("is-alpha-worth-it", "alpha", "template");
    const peers = [
      stubGuide("is-beta-worth-it", "beta", "template"),
      stubGuide("is-gamma-worth-it", "gamma", "template"),
      stubGuide("is-delta-worth-it", "delta", "template"),
      stubGuide("is-epsilon-worth-it", "epsilon", "template"),
      stubGuide("is-zeta-worth-it", "zeta", "template"),
    ];
    const gates = guidePassesIndexGates(a, { peers });
    expect(gates.ok).toBe(false);
    expect(gates.detail.some((d) => d.includes("SEMANTIC_TEMPLATE_RISK"))).toBe(
      true,
    );
    expect(gates.semantic?.blocksAutoPromotion).toBe(true);
  });

  it("hard-fails semantic template risk", () => {
    const fails = collectHardFails({
      pageType: "guide",
      path: "/guides/x/",
      title: "Example",
      semanticTemplateRisk: true,
    });
    expect(fails.some((f) => f.code === "semantic_template_risk")).toBe(true);
  });

  it("allows distinct unique analysis to clear sibling comparison", () => {
    const unique = stubGuide("is-hubspot-worth-it", "hubspot", "unique");
    const templates = [
      stubGuide("is-beta-worth-it", "beta", "template"),
      stubGuide("is-gamma-worth-it", "gamma", "template"),
      stubGuide("is-delta-worth-it", "delta", "template"),
    ];
    const assessment = assessGuideSemanticTemplateRisk(unique, templates);
    expect(assessment.uniqueAnalysisSignals.length).toBeGreaterThanOrEqual(2);
    // Unique page should not be blocked solely by weak template peers
    expect(assessment.blocksAutoPromotion).toBe(false);
  });

  it("flags family QA when batch shares paragraph skeletons", () => {
    const pages = [
      stubGuide("is-alpha-worth-it", "alpha", "template"),
      stubGuide("is-beta-worth-it", "beta", "template"),
      stubGuide("is-gamma-worth-it", "gamma", "template"),
      stubGuide("is-delta-worth-it", "delta", "template"),
    ];
    const members = pages.map((g) => ({
      slug: g.slug,
      stripTokens: [...(g.productSlugs ?? [])],
      sections: extractGuideAnalysisSections(g),
      assessment: assessGuideSemanticTemplateRisk(
        g,
        pages.filter((p) => p.slug !== g.slug),
      ),
    }));
    const family = assessEnrichmentBatchFamilyQa(members, {
      pageType: "guide",
      sharedRatioThreshold: 0.5,
    });
    expect(family.flagged).toBe(true);
    expect(family.sharedPatterns.length).toBeGreaterThan(0);
  });

  it("runs against live factory pack peers without throwing", () => {
    const guides = getGuides({ includeUnpublished: true });
    const pack = guides.find((g) => /plans$|worth-it$/.test(g.slug));
    if (!pack) return;
    const peers = guides
      .filter(
        (g) =>
          g.slug !== pack.slug &&
          (g.categorySlugs ?? []).some((c) =>
            (pack.categorySlugs ?? []).includes(c),
          ),
      )
      .slice(0, 25);
    const assessment = assessGuideSemanticTemplateRisk(pack, peers);
    expect(assessment.version).toBeTruthy();
    expect(assessment.siblingCluster.size).toBeGreaterThanOrEqual(0);
  }, 60_000);
});
