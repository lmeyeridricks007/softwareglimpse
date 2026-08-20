import { describe, expect, it } from "vitest";
import { relForOutboundType } from "@/domain";
import { resolveAffiliateLink } from "@/services/affiliate/resolve-affiliate-link";
import { getSoftwareBySlug } from "@/data";
import {
  descriptiveSourceAnchor,
  resolveProductOfficialLinks,
} from "@/services/outbound/resolve-product-links";
import { validateOutboundLinks } from "@/services/outbound/validate-links";

describe("outbound link semantics", () => {
  it("marks affiliate as sponsored and editorial as unqualified", () => {
    expect(relForOutboundType("affiliate")).toEqual([
      "sponsored",
      "noopener",
      "noreferrer",
    ]);
    expect(relForOutboundType("pricing-source")).toEqual([
      "noopener",
      "noreferrer",
    ]);
    expect(relForOutboundType("evidence-source", { untrusted: true })).toEqual([
      "nofollow",
      "noopener",
      "noreferrer",
    ]);
  });

  it("builds descriptive evidence anchors", () => {
    expect(
      descriptiveSourceAnchor(
        { sourceType: "official-pricing-page", title: undefined },
        "Pipedrive",
      ),
    ).toBe("Pipedrive pricing documentation");
  });

  it("keeps official links separate from affiliate destinations", () => {
    const software = getSoftwareBySlug("pipedrive");
    if (!software) return;
    const official = resolveProductOfficialLinks(software);
    const commercial = resolveAffiliateLink(software, { location: "hero" });
    if (official.officialWebsite && commercial?.isAffiliate) {
      expect(commercial.href).not.toBe(official.officialWebsite);
    }
    if (official.officialWebsite) {
      expect(official.officialWebsite).toMatch(/^https:\/\//);
    }
  });

  it("does not flag Hive's archived 404 video as an open outbound issue", () => {
    const issues = validateOutboundLinks({
      productSlug: "hive",
      now: new Date("2026-08-18T12:00:00.000Z"),
    });
    expect(
      issues.filter(
        (i) =>
          i.code === "MEDIA_SOURCE_UNAVAILABLE" ||
          i.code === "MEDIA_NEEDS_REFRESH" ||
          i.code === "MEDIA_EMBED_UNAVAILABLE" ||
          i.mediaId === "media-hive-6v0_swngfsm",
      ),
    ).toEqual([]);
  });
});
