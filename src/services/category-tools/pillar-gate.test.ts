import { describe, expect, it } from "vitest";
import {
  categoryHasPublishedPillar,
  orphanCategoryToolSlugs,
} from "./pillar-gate";

describe("category tool pillar gate", () => {
  it("treats CRM and SI as published pillars", () => {
    expect(categoryHasPublishedPillar("crm")).toBe(true);
    expect(categoryHasPublishedPillar("sales-intelligence")).toBe(true);
  });

  it("fences accounting / social / webinar until category hubs are public", () => {
    const now = new Date("2026-08-30T12:00:00.000Z");
    expect(categoryHasPublishedPillar("accounting-finance", now)).toBe(false);
    expect(categoryHasPublishedPillar("social-media-marketing", now)).toBe(
      false,
    );
    expect(categoryHasPublishedPillar("webinar-virtual-events", now)).toBe(
      false,
    );
    const orphans = orphanCategoryToolSlugs(now);
    expect(orphans).toEqual(
      expect.arrayContaining([
        "accounting-finance",
        "social-media-marketing",
        "webinar-virtual-events",
      ]),
    );
  });

  it("keeps published tool categories available", () => {
    const now = new Date("2026-08-30T12:00:00.000Z");
    expect(categoryHasPublishedPillar("hr", now)).toBe(true);
    expect(categoryHasPublishedPillar("crm", now)).toBe(true);
  });
});
