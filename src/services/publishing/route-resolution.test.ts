import { describe, expect, it } from "vitest";
import type { PublicationContext } from "../../domain/publication-context";
import {
  filterRoutableEntities,
  isRoutableAt,
  resolveForPublicRoute,
} from "./route-resolution";

const PUBLIC_CTX: PublicationContext = {
  kind: "PUBLIC",
  previewMode: "public",
};

const DEV_CTX: PublicationContext = {
  kind: "DEVELOPMENT",
  previewMode: "all",
};

const futureCrmReview = {
  slug: "future-crm-review",
  metadata: {
    status: "scheduled" as const,
    scheduledAt: "2030-01-01T10:00:00.000Z",
  },
};

describe("route resolution (future-crm-review fixture)", () => {
  const beforePublish = new Date("2029-12-31T23:59:59.000Z");
  const afterPublish = new Date("2030-01-01T10:00:00.000Z");

  it("PUBLIC before publishAt: not routable (simulates production 404)", () => {
    expect(
      resolveForPublicRoute(futureCrmReview, {
        context: PUBLIC_CTX,
        now: beforePublish,
      }),
    ).toBeUndefined();
    expect(isRoutableAt(futureCrmReview, PUBLIC_CTX, beforePublish)).toBe(
      false,
    );
  });

  it("DEVELOPMENT before publishAt: routable (npm run dev)", () => {
    expect(
      resolveForPublicRoute(futureCrmReview, {
        context: DEV_CTX,
        now: beforePublish,
      }),
    ).toBe(futureCrmReview);
    expect(isRoutableAt(futureCrmReview, DEV_CTX, beforePublish)).toBe(true);
  });

  it("PUBLIC at/after publishAt: routable", () => {
    expect(
      resolveForPublicRoute(futureCrmReview, {
        context: PUBLIC_CTX,
        now: afterPublish,
      }),
    ).toBe(futureCrmReview);
  });

  it("draft: hidden in PUBLIC, visible in DEVELOPMENT", () => {
    const draft = {
      slug: "draft-article",
      metadata: { status: "draft" as const },
    };
    expect(
      resolveForPublicRoute(draft, {
        context: PUBLIC_CTX,
        now: beforePublish,
      }),
    ).toBeUndefined();
    expect(
      resolveForPublicRoute(draft, {
        context: DEV_CTX,
        now: beforePublish,
      }),
    ).toBe(draft);
  });

  it("filterRoutableEntities excludes future scheduled in PUBLIC lists", () => {
    const live = {
      slug: "live",
      metadata: {
        status: "published" as const,
        publishedAt: "2020-01-01T00:00:00.000Z",
      },
    };
    const items = [futureCrmReview, live];
    expect(
      filterRoutableEntities(items, {
        context: PUBLIC_CTX,
        now: beforePublish,
      }).map((i) => i.slug),
    ).toEqual(["live"]);
    expect(
      filterRoutableEntities(items, {
        context: DEV_CTX,
        now: beforePublish,
      }).map((i) => i.slug).sort(),
    ).toEqual(["future-crm-review", "live"]);
  });
});
