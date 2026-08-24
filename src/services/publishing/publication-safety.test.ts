import { describe, expect, it } from "vitest";
import { buildContentRegistry } from "./registry";
import {
  getPublicationContextSync,
  isContentVisible,
  type PublicationContext,
} from "../../domain/publication-context";
import { getAllSoftwareUnfiltered } from "../../data/repositories/catalog";
import { resolveForPublicRoute } from "./route-resolution";

const PUBLIC_CTX: PublicationContext = {
  kind: "PUBLIC",
  previewMode: "public",
};

describe("production publication safety", { timeout: 30_000 }, () => {
  const now = new Date("2026-08-23T12:00:00.000Z");

  it("no registry entry with future scheduledAt is PUBLIC-visible", () => {
    const violations: string[] = [];

    for (const entry of buildContentRegistry()) {
      const scheduledAt = entry.metadata.scheduledAt;
      if (!scheduledAt) continue;
      const ts = Date.parse(scheduledAt);
      if (Number.isNaN(ts) || ts <= now.getTime()) continue;

      if (
        isContentVisible(
          {
            status: entry.metadata.status,
            publishedAt: entry.metadata.publishedAt,
            scheduledAt: entry.metadata.scheduledAt,
          },
          PUBLIC_CTX,
          now,
        )
      ) {
        violations.push(`${entry.contentId} (${entry.path})`);
      }
    }

    expect(violations).toEqual([]);
  });

  it("no registry entry with future scheduledAt is routable in PUBLIC context", () => {
    const violations: string[] = [];

    for (const entry of buildContentRegistry()) {
      const scheduledAt = entry.metadata.scheduledAt;
      if (!scheduledAt) continue;
      const ts = Date.parse(scheduledAt);
      if (Number.isNaN(ts) || ts <= now.getTime()) continue;

      if (
        resolveForPublicRoute(
          { metadata: entry.metadata },
          { context: PUBLIC_CTX, now },
        )
      ) {
        violations.push(`${entry.contentId} (${entry.path})`);
      }
    }

    expect(violations).toEqual([]);
  });

  it("resolveForPublicRoute matches isContentVisible for registry metadata", () => {
    for (const entry of buildContentRegistry().slice(0, 50)) {
      const visible = isContentVisible(
        {
          status: entry.metadata.status,
          publishedAt: entry.metadata.publishedAt,
          scheduledAt: entry.metadata.scheduledAt,
        },
        PUBLIC_CTX,
        now,
      );
      const routable = Boolean(
        resolveForPublicRoute(
          { metadata: entry.metadata },
          { context: PUBLIC_CTX, now },
        ),
      );
      expect(routable).toBe(visible);
    }
  });

  it("published live software remains PUBLIC-visible", () => {
    const published = getAllSoftwareUnfiltered().filter(
      (s) => s.metadata.status === "published",
    );
    expect(published.length).toBeGreaterThan(0);

    for (const software of published.slice(0, 5)) {
      expect(
        isContentVisible(
          {
            status: software.metadata.status,
            publishedAt: software.metadata.publishedAt,
            scheduledAt: software.metadata.scheduledAt,
          },
          PUBLIC_CTX,
          now,
        ),
      ).toBe(true);
    }
  });

  it("getPublicationContextSync in production is PUBLIC", () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    try {
      expect(getPublicationContextSync().kind).toBe("PUBLIC");
    } finally {
      process.env.NODE_ENV = original;
    }
  });
});
