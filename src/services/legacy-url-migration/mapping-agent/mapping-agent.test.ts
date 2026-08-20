import { describe, expect, it } from "vitest";
import {
  buildContentGraph,
  mapLegacyIntent,
  parseLegacyIntent,
  runLegacyUrlMappingAgent,
} from "@/services/legacy-url-migration/mapping-agent";

describe("LegacyUrlMappingAgent", () => {
  const graph = buildContentGraph();

  it("maps product review via same product entity, not slug substring alone", () => {
    const intent = parseLegacyIntent("/attio-crm-review/", graph);
    expect(intent.kind).toBe("product_review");
    expect(intent.productSlug).toBe("attio");
    const row = mapLegacyIntent(intent, graph);
    expect(row.newPath).toBe("/software/attio/");
    expect(row.relationship).toBe("EQUIVALENT");
    expect(row.recommendedAction).toBe("301_REDIRECT");
    expect(row.matchBasis).toBe("same_product");
  });

  it("maps pricing subcontent to pricing tab when present", () => {
    const intent = parseLegacyIntent("/pipedrive-pricing/", graph);
    expect(intent.kind).toBe("product_pricing");
    const row = mapLegacyIntent(intent, graph);
    expect(row.newPath).toBe("/software/pipedrive/pricing/");
    expect(row.recommendedAction).toBe("301_REDIRECT");
  });

  it("matches comparison pairs order-insensitively", () => {
    const a = mapLegacyIntent(parseLegacyIntent("/pipedrive-vs-hubspot/", graph), graph);
    const b = mapLegacyIntent(parseLegacyIntent("/hubspot-vs-pipedrive/", graph), graph);
    expect(a.newPath).toBe(b.newPath);
    expect(a.newPath).toBe("/compare/hubspot-vs-pipedrive/");
    expect(a.matchBasis).toBe("same_comparison_pair");
  });

  it("merges what-is guide intent into canonical guide", () => {
    const row = mapLegacyIntent(
      parseLegacyIntent("/what-is-crm-system/", graph),
      graph,
    );
    expect(row.newPath).toBe("/guides/what-is-crm/");
    expect(row.relationship).toBe("MERGED_INTO");
    expect(row.matchBasis).toBe("same_guide_intent");
  });

  it("retires WP tags with 410 and never homepage", () => {
    const row = mapLegacyIntent(
      parseLegacyIntent("/tag/pipedrive/", graph),
      graph,
    );
    expect(row.recommendedAction).toBe("410");
    expect(row.newPath).toBeNull();
  });

  it("uses explicit historical migration seed when present", () => {
    const row = mapLegacyIntent(
      parseLegacyIntent("/pipedrive-review/", graph),
      graph,
    );
    expect(row.newPath).toBe("/software/pipedrive/");
    expect(row.matchBasis).toBe("explicit_historical");
  });

  it(
    "runs end-to-end without writing when requested",
    () => {
      const result = runLegacyUrlMappingAgent({
        write: false,
        legacyPaths: [
          "/attio-crm-review/",
          "/best-crms/",
          "/tag/activecampaign-crm/",
        ],
      });
      expect(result.summary.totalLegacy).toBe(3);
      expect(
        result.summary.redirect301 + result.summary.mergeAnd301,
      ).toBeGreaterThan(0);
    },
    30_000,
  );
});
