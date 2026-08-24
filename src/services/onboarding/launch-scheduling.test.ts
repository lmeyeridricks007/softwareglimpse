import { describe, expect, it } from "vitest";
import { SoftwareOnboardingRequestSchema } from "../../domain/schemas/onboarding";
import { buildCandidateSoftware } from "./product-factory";
import {
  applyScheduledMetadataToProduct,
  buildLaunchContentPackage,
} from "./launch-scheduling";
import { resolvePublishInstant } from "./schedule-time";
import { buildContentMap } from "./content-map";
import { discoverRelationshipCandidates } from "./relationships";

describe("onboarding launch scheduling", () => {
  const request = SoftwareOnboardingRequestSchema.parse({
    name: "Attio",
    slug: "attio",
    website: "https://attio.com",
    source: "manual",
    suggestedCategoryIds: ["crm"],
    schedule: {
      publishDate: "2026-09-15",
      publishTime: "08:00",
      timezone: "Europe/Amsterdam",
      vendor: "Attio",
      contentScope: "standard",
      comparisonsAt: "2026-09-20T06:00:00.000Z",
    },
    options: { dryRun: true, runResearch: false },
  });

  const product = buildCandidateSoftware({
    request,
    slug: "attio",
    primaryCategorySlug: "crm",
    entityType: "software",
    company: "Attio",
  });

  const resolved = resolvePublishInstant(request.schedule!);
  const relationships = discoverRelationshipCandidates(product, {
    maxPeers: 3,
  });
  const pages = buildContentMap({
    product,
    categoryContentReady: true,
    researchPercent: 65,
    pricingStatus: "PARTIAL",
    relationshipCandidates: relationships,
  });

  it("builds launch package with inherited and override dates", () => {
    const items = buildLaunchContentPackage({
      product,
      pages,
      schedule: request.schedule!,
      resolved,
    });
    expect(items.some((i) => i.pageType === "software-review")).toBe(true);
    const productItem = items.find((i) => i.pageType === "software-review");
    expect(productItem?.scheduledAt).toBe("2026-09-15T06:00:00.000Z");
    const comparison = items.find((i) => i.pageType === "comparison");
    if (comparison?.scheduledAt) {
      expect(comparison.scheduledAt).toBe("2026-09-20T06:00:00.000Z");
    }
  });

  it("sets product metadata to scheduled not published", () => {
    const scheduled = applyScheduledMetadataToProduct(
      product,
      resolved,
      "Attio",
    );
    expect(scheduled.metadata.status).toBe("scheduled");
    expect(scheduled.metadata.scheduledAt).toBe("2026-09-15T06:00:00.000Z");
    expect(scheduled.metadata.status).not.toBe("published");
  });

  it("flags comparison scheduled before product as dependency violation", () => {
    const items = buildLaunchContentPackage({
      product,
      pages,
      schedule: {
        ...request.schedule!,
        comparisonsAt: "2026-09-10T06:00:00.000Z",
      },
      resolved,
    });
    const violations = items
      .filter((i) => i.pageType === "comparison" && i.scheduledAt)
      .flatMap((i) => {
        const productTs = Date.parse(resolved.publishAtUtc);
        const itemTs = Date.parse(i.scheduledAt!);
        return itemTs < productTs ? [i.contentId] : [];
      });
    expect(violations.length).toBeGreaterThan(0);
  });
});
