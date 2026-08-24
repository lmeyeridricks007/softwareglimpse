import { describe, expect, it } from "vitest";
import {
  buildLaunchId,
  localDateTimeToUtcIso,
  resolvePublishInstant,
} from "./schedule-time";

describe("onboarding schedule time", () => {
  it("converts Europe/Amsterdam local time to UTC (CEST)", () => {
    const utc = localDateTimeToUtcIso(
      "2026-09-15",
      "08:00",
      "Europe/Amsterdam",
    );
    expect(utc).toBe("2026-09-15T06:00:00.000Z");
  });

  it("builds launch id from slug and date", () => {
    expect(buildLaunchId("attio", "2026-09-15")).toBe("product-attio-2026-09");
  });

  it("resolves publish date + time + timezone", () => {
    const resolved = resolvePublishInstant({
      publishDate: "2026-09-15",
      publishTime: "08:00",
      timezone: "Europe/Amsterdam",
    });
    expect(resolved.publishAtUtc).toBe("2026-09-15T06:00:00.000Z");
    expect(resolved.humanLabel).toContain("2026");
    expect(resolved.humanLabel).toContain("Europe/Amsterdam");
  });

  it("throws when date missing", () => {
    expect(() => resolvePublishInstant({})).toThrow(/Publication date/);
  });

  it("uses configured default time when time omitted", () => {
    const resolved = resolvePublishInstant({
      publishDate: "2026-09-15",
      timezone: "Europe/Amsterdam",
    });
    expect(resolved.localTime).toBe("08:00");
    expect(resolved.publishAtUtc).toBe("2026-09-15T06:00:00.000Z");
  });
});
