import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  filterByPublicationVisibility,
  getEffectiveNow,
  getPublicationContextSync,
  isContentVisible,
  isPublicAt,
  resolvePublicationState,
  type PublicationContext,
} from "./publication-context";

const PUBLIC_CTX: PublicationContext = {
  kind: "PUBLIC",
  previewMode: "public",
};

const DEV_CTX: PublicationContext = {
  kind: "DEVELOPMENT",
  previewMode: "all",
};

const DEV_PUBLIC_CTX: PublicationContext = {
  kind: "DEVELOPMENT",
  previewMode: "public",
};

describe("publication context", () => {
  const env = process.env;

  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
  });

  afterEach(() => {
    process.env = { ...env };
    vi.unstubAllEnvs();
  });

  it("PUBLIC hides scheduled future content", () => {
    const now = new Date("2026-08-23T10:00:00.000Z");
    const input = {
      status: "scheduled" as const,
      scheduledAt: "2030-09-15T06:00:00.000Z",
    };
    expect(isContentVisible(input, PUBLIC_CTX, now)).toBe(false);
    expect(resolvePublicationState(input, PUBLIC_CTX, now)).toBe("SCHEDULED");
  });

  it("PUBLIC shows scheduled when publishAt has passed", () => {
    const publishAt = "2030-01-01T08:00:00.000Z";
    const now = new Date("2030-01-02T00:00:00.000Z");
    const input = {
      status: "scheduled" as const,
      scheduledAt: publishAt,
    };
    expect(isPublicAt(input, now)).toBe(true);
    expect(isContentVisible(input, PUBLIC_CTX, now)).toBe(true);
  });

  it("PUBLIC shows published at exact publication instant", () => {
    const publishAt = "2030-09-15T06:00:00.000Z";
    const input = {
      status: "published" as const,
      publishedAt: publishAt,
      scheduledAt: publishAt,
    };
    expect(
      isContentVisible(input, PUBLIC_CTX, new Date("2030-09-15T05:59:59.000Z")),
    ).toBe(false);
    expect(
      isContentVisible(input, PUBLIC_CTX, new Date("2030-09-15T06:00:00.000Z")),
    ).toBe(true);
  });

  it("DEVELOPMENT shows draft, scheduled, and archived", () => {
    const now = new Date("2026-08-23T10:00:00.000Z");
    expect(isContentVisible({ status: "draft" }, DEV_CTX, now)).toBe(true);
    expect(
      isContentVisible(
        { status: "scheduled", scheduledAt: "2030-01-01T08:00:00.000Z" },
        DEV_CTX,
        now,
      ),
    ).toBe(true);
    expect(isContentVisible({ status: "archived" }, DEV_CTX, now)).toBe(true);
    expect(
      isContentVisible({ status: "published", publishedAt: "2020-01-01T00:00:00.000Z" }, DEV_CTX, now),
    ).toBe(true);
  });

  it("DEVELOPMENT public simulation hides drafts and future scheduled", () => {
    const now = new Date("2026-08-23T10:00:00.000Z");
    expect(isContentVisible({ status: "draft" }, DEV_PUBLIC_CTX, now)).toBe(
      false,
    );
    expect(
      isContentVisible(
        { status: "scheduled", scheduledAt: "2030-01-01T08:00:00.000Z" },
        DEV_PUBLIC_CTX,
        now,
      ),
    ).toBe(false);
  });

  it("getEffectiveNow uses previewAt in as-of mode", () => {
    const previewAt = "2026-10-01T12:00:00+02:00";
    const ctx: PublicationContext = {
      kind: "DEVELOPMENT",
      previewMode: "as-of",
      previewAt,
    };
    expect(getEffectiveNow(ctx).toISOString()).toBe(
      new Date(previewAt).toISOString(),
    );
  });

  it("production runtime defaults to PUBLIC context", () => {
    vi.stubEnv("NODE_ENV", "production");
    const ctx = getPublicationContextSync();
    expect(ctx.kind).toBe("PUBLIC");
  });

  it("development defaults to DEVELOPMENT all", () => {
    vi.stubEnv("NODE_ENV", "development");
    const ctx = getPublicationContextSync();
    expect(ctx.kind).toBe("DEVELOPMENT");
    expect(ctx.previewMode).toBe("all");
  });

  it("PUBLICATION_PREVIEW=public forces production-like dev visibility", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("PUBLICATION_PREVIEW", "public");
    const ctx = getPublicationContextSync();
    expect(ctx.previewMode).toBe("public");
    const now = new Date("2026-08-23T10:00:00.000Z");
    expect(
      isContentVisible(
        {
          status: "scheduled",
          scheduledAt: "2030-09-15T06:00:00.000Z",
        },
        ctx,
        now,
      ),
    ).toBe(false);
  });
});

describe("future article fixture (2030-01-01)", () => {
  const publishAt = "2030-01-01T08:00:00.000Z";
  const before = new Date("2029-12-31T23:59:59.000Z");
  const after = new Date("2030-01-01T08:00:00.000Z");

  const scheduledGuide = {
    status: "scheduled" as const,
    scheduledAt: publishAt,
  };

  const draftGuide = { status: "draft" as const };

  const mockGuides = [
    { slug: "future-guide", metadata: scheduledGuide },
    { slug: "draft-guide", metadata: draftGuide },
    {
      slug: "live-guide",
      metadata: {
        status: "published" as const,
        publishedAt: "2020-01-01T00:00:00.000Z",
      },
    },
  ];

  it("DEVELOPMENT: all guides visible in filter", () => {
    const visible = filterByPublicationVisibility(mockGuides, {
      context: DEV_CTX,
      now: before,
    });
    expect(visible.map((g) => g.slug).sort()).toEqual([
      "draft-guide",
      "future-guide",
      "live-guide",
    ]);
  });

  it("PUBLIC before publishAt: only live guide", () => {
    const visible = filterByPublicationVisibility(mockGuides, {
      context: PUBLIC_CTX,
      now: before,
    });
    expect(visible.map((g) => g.slug)).toEqual(["live-guide"]);
  });

  it("PUBLIC after publishAt: scheduled guide visible", () => {
    const visible = filterByPublicationVisibility(mockGuides, {
      context: PUBLIC_CTX,
      now: after,
    });
    expect(visible.map((g) => g.slug).sort()).toEqual([
      "future-guide",
      "live-guide",
    ]);
  });

  it("PUBLIC: draft always hidden", () => {
    expect(isContentVisible(draftGuide, PUBLIC_CTX, after)).toBe(false);
    expect(isContentVisible(draftGuide, DEV_CTX, before)).toBe(true);
  });
});

describe("FutureCRM acceptance fixture", () => {
  const publishAt = "2030-09-15T06:00:00.000Z";
  const before = new Date("2030-09-15T05:59:59.000Z");
  const after = new Date("2030-09-15T06:00:00.000Z");

  const entities = [
    { status: "scheduled" as const, scheduledAt: publishAt },
    { status: "scheduled" as const, scheduledAt: publishAt },
    { status: "scheduled" as const, scheduledAt: publishAt },
    { status: "scheduled" as const, scheduledAt: publishAt },
    { status: "scheduled" as const, scheduledAt: publishAt },
  ];

  it("PUBLIC before date: all absent", () => {
    for (const entity of entities) {
      expect(isContentVisible(entity, PUBLIC_CTX, before)).toBe(false);
    }
  });

  it("DEVELOPMENT before date: all visible", () => {
    for (const entity of entities) {
      expect(isContentVisible(entity, DEV_CTX, before)).toBe(true);
    }
  });

  it("PUBLIC at/after publish: scheduled visible", () => {
    for (const entity of entities) {
      expect(isContentVisible(entity, PUBLIC_CTX, after)).toBe(true);
    }
  });
});
