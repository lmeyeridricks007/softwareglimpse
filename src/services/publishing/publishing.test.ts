import {
  canPublish,
  assertTransition,
  canTransition,
  getPublicationState,
  isPubliclyAvailable,
  InvalidLifecycleTransitionError,
  ChangeEventSchema,
  ContentIdSchema,
  ContentRegistryEntrySchema,
  ContentVersionSchema,
  type ContentRegistryEntry,
  type ContentVersion,
  type ScheduleRecord,
} from "@/domain";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  saveSchedule,
  saveVersion,
  loadVersion,
  listVersions,
} from "@/data/publishing/store";
import {
  createDraftVersion,
  getDraftVersion,
  getLiveVersion,
} from "@/services/publishing/server";
import { publishContent } from "@/services/publishing/server";
import { runPublishDue } from "@/services/publishing/server";
import { resolveRefreshCandidates } from "@/services/publishing/server";
import { filterSitemapEntries } from "@/services/publishing/server";
import { approveVersion } from "@/services/publishing/server";

const FIXTURES = path.join(
  process.cwd(),
  "src/data/publishing/fixtures",
);

function loadFixture<T>(name: string): T {
  return JSON.parse(
    readFileSync(path.join(FIXTURES, name), "utf8"),
  ) as T;
}

describe("lifecycle transitions", () => {
  it("rejects draft → published without approval", () => {
    expect(canTransition("draft", "published")).toBe(false);
    expect(() => assertTransition("draft", "published")).toThrow(
      InvalidLifecycleTransitionError,
    );
  });

  it("rejects idea → published (research-needed conceptual path)", () => {
    expect(canTransition("idea", "published")).toBe(false);
  });

  it("rejects archived → published without restore", () => {
    expect(canTransition("archived", "published")).toBe(false);
    expect(canTransition("archived", "draft")).toBe(true);
  });

  it("allows approved → scheduled → published and approved → published", () => {
    expect(canTransition("approved", "scheduled")).toBe(true);
    expect(canTransition("scheduled", "published")).toBe(true);
    expect(canTransition("approved", "published")).toBe(true);
  });

  it("allows published → refresh-needed → refreshing → review", () => {
    expect(canTransition("published", "refresh-needed")).toBe(true);
    expect(canTransition("refresh-needed", "refreshing")).toBe(true);
    expect(canTransition("refreshing", "review")).toBe(true);
  });

  it("allows rejected → draft", () => {
    expect(canTransition("rejected", "draft")).toBe(true);
  });
});

describe("publication state / schedule hide", () => {
  const tomorrow = new Date("2099-01-15T09:00:00.000Z");
  const now = new Date("2026-08-13T12:00:00.000Z");

  it("scheduled future is not publicly available / not in listings", () => {
    const fixture = loadFixture<{
      contentId: string;
      metadata: {
        status: "scheduled";
        scheduledAt: string;
      };
      seoIndexable: boolean;
    }>("scheduled-comparison-freshsales-vs-pipedrive.json");

    expect(
      isPubliclyAvailable(
        {
          status: fixture.metadata.status,
          scheduledAt: fixture.metadata.scheduledAt,
        },
        now,
      ),
    ).toBe(false);

    const state = getPublicationState(
      {
        status: fixture.metadata.status,
        scheduledAt: fixture.metadata.scheduledAt,
        seoIndexable: fixture.seoIndexable,
      },
      now,
    );
    expect(state.isVisibleInListings).toBe(false);
    expect(state.isVisibleInInternalLinks).toBe(false);
    expect(state.isIndexable).toBe(false);
    expect(state.isScheduled).toBe(true);
  });

  it("published + refresh-needed remains public", () => {
    const state = getPublicationState(
      {
        status: "refresh-needed",
        publishedAt: "2026-01-01T00:00:00.000Z",
        seoIndexable: true,
      },
      now,
    );
    expect(state.isPublished).toBe(true);
    expect(state.isVisibleInListings).toBe(true);
  });

  it("draft never public / never in sitemap helper", () => {
    const draft = loadFixture<{
      contentId: string;
      type: string;
      slug: string;
      path: string;
      title: string;
      metadata: { status: "draft" };
      seoIndexable: boolean;
    }>("draft-best-crm.json");

    const entry = ContentRegistryEntrySchema.parse({
      contentId: draft.contentId,
      type: draft.type,
      slug: draft.slug,
      path: draft.path,
      title: draft.title,
      metadata: draft.metadata,
      seoIndexable: draft.seoIndexable,
    });

    const state = getPublicationState(
      {
        status: "draft",
        seoIndexable: false,
      },
      now,
    );
    expect(state.isPublished).toBe(false);
    expect(filterSitemapEntries([entry], now)).toHaveLength(0);
  });

  it("canPublish blocks schedule-not-due", () => {
    const result = canPublish(
      {
        status: "scheduled",
        scheduledAt: tomorrow.toISOString(),
      },
      { now },
    );
    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("schedule-not-due");
  });
});

describe("pipedrive pricing refresh POC", () => {
  it("marks pricing/software HIGH, compares MEDIUM/HIGH, best MEDIUM with pricing-changed reasons", () => {
    const raw = loadFixture<unknown>("change-event-pipedrive-pricing.json");
    const event = ChangeEventSchema.parse(raw);
    const candidates = resolveRefreshCandidates(event);

    const byId = new Map(
      candidates.map((c) => [String(c.contentId), c] as const),
    );

    const pricing = byId.get("content:pricing:pipedrive");
    expect(pricing).toBeDefined();
    expect(pricing!.priority).toBe("high");
    expect(pricing!.reasons.some((r) => r.includes("pricing"))).toBe(true);

    const software = byId.get("content:software:pipedrive");
    expect(software).toBeDefined();
    expect(software!.priority).toBe("high");

    const compares = candidates.filter((c) =>
      String(c.contentId).startsWith("content:compare:"),
    );
    expect(compares.length).toBeGreaterThan(0);
    for (const c of compares) {
      expect(["high", "normal"]).toContain(c.priority);
      expect(c.reasons.some((r) => r.includes("pricing"))).toBe(true);
    }

    const best = candidates.filter((c) =>
      String(c.contentId).startsWith("content:best:"),
    );
    for (const b of best) {
      expect(b.priority).toBe("normal");
    }

    // Guides must not be affected by product pricing
    expect(
      candidates.some((c) => String(c.contentId).includes(":guide:")),
    ).toBe(false);
  });
});

describe("scheduled comparison publish runner POC", () => {
  let tempRoot: string;
  const contentId = ContentIdSchema.parse(
    "content:compare:freshsales-vs-pipedrive",
  );

  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(tmpdir(), "sg-publishing-"));
    process.env.SG_PUBLISHING_ROOT = tempRoot;
  });

  afterEach(() => {
    delete process.env.SG_PUBLISHING_ROOT;
    rmSync(tempRoot, { recursive: true, force: true });
  });

  function seedApprovedVersion(): ContentVersion {
    const version = ContentVersionSchema.parse({
      contentId,
      version: 1,
      status: "approved",
      createdAt: "2026-07-20T10:00:00.000Z",
      approvedAt: "2026-08-01T11:00:00.000Z",
      approvedBy: "fixture-editor",
      summary: { sections: ["verdict"], scores: { "ease-of-use": 7 } },
    });
    saveVersion(version);
    return version;
  }

  function entry(status: ContentRegistryEntry["metadata"]["status"], scheduledAt?: string): ContentRegistryEntry {
    return ContentRegistryEntrySchema.parse({
      contentId,
      type: "comparison",
      slug: "freshsales-vs-pipedrive",
      path: "/compare/freshsales-vs-pipedrive/",
      title: "Pipedrive vs Freshsales",
      metadata: {
        status,
        scheduledAt,
        researchStatus: "complete",
      },
      seoIndexable: true,
    });
  }

  it("scheduledAt tomorrow → not publicly available; past due + runner publishes; second run idempotent", () => {
    seedApprovedVersion();
    const future = "2099-01-15T09:00:00.000Z";
    const schedule: ScheduleRecord = {
      contentId,
      scheduledAt: future,
      approvedVersion: 1,
      createdAt: "2026-08-01T12:00:00.000Z",
    };
    saveSchedule(schedule);

    const beforeNow = new Date("2026-08-13T12:00:00.000Z");
    expect(
      isPubliclyAvailable(
        { status: "scheduled", scheduledAt: future },
        beforeNow,
      ),
    ).toBe(false);

    const entries = new Map<string, ContentRegistryEntry>([
      [String(contentId), entry("scheduled", future)],
    ]);

    const early = runPublishDue({
      now: beforeNow,
      entries,
      listDue: () => [], // not due yet
    });
    expect(early.published).toHaveLength(0);

    const dueAt = new Date("2099-01-15T10:00:00.000Z");
    saveSchedule({ ...schedule, scheduledAt: "2099-01-15T09:00:00.000Z" });

    const first = runPublishDue({
      now: dueAt,
      entries,
      listDue: () => [
        { ...schedule, scheduledAt: "2099-01-15T09:00:00.000Z" },
      ],
    });
    expect(first.published.length + first.failed.length).toBeGreaterThan(0);
    expect(first.failed).toHaveLength(0);
    expect(first.published).toHaveLength(1);
    expect(first.published[0].status).toBe("published");

    const live = loadVersion(contentId, 1);
    expect(live?.status).toBe("published");

    // Second run — idempotent skip
    const second = runPublishDue({
      now: dueAt,
      entries,
      listDue: () => [
        { ...schedule, scheduledAt: "2099-01-15T09:00:00.000Z" },
      ],
    });
    expect(second.skipped.length).toBeGreaterThanOrEqual(1);
    expect(second.skipped[0].reason).toMatch(/already-published/);
    expect(second.published).toHaveLength(0);
  });
});

describe("publish preserves firstPublishedAt + version isolation", () => {
  let tempRoot: string;
  const contentId = ContentIdSchema.parse("content:software:pipedrive");

  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(tmpdir(), "sg-publishing-"));
    process.env.SG_PUBLISHING_ROOT = tempRoot;
  });

  afterEach(() => {
    delete process.env.SG_PUBLISHING_ROOT;
    rmSync(tempRoot, { recursive: true, force: true });
  });

  it("preserves firstPublishedAt on republish", () => {
    const v1 = ContentVersionSchema.parse({
      contentId,
      version: 1,
      status: "approved",
      createdAt: "2026-01-01T00:00:00.000Z",
      approvedAt: "2026-01-02T00:00:00.000Z",
      approvedBy: "editor",
    });
    saveVersion(v1);

    const firstAt = "2026-01-15T10:00:00.000Z";
    const entry = ContentRegistryEntrySchema.parse({
      contentId,
      type: "software",
      slug: "pipedrive",
      path: "/software/pipedrive/",
      title: "Pipedrive",
      metadata: { status: "approved" },
      seoIndexable: true,
      firstPublishedAt: firstAt,
      liveVersion: undefined,
    });

    const result = publishContent(contentId, {
      now: new Date("2026-08-13T12:00:00.000Z"),
      version: 1,
      currentStatus: "approved",
      firstPublishedAt: firstAt,
      entry,
      actor: "test",
    });

    expect(result.status).toBe("published");
    expect(result.firstPublishedAt).toBe(firstAt);
    expect(result.publishedAt).toBe("2026-08-13T12:00:00.000Z");
    expect(result.entry?.firstPublishedAt).toBe(firstAt);
    expect(result.entry?.lastPublishedAt).toBe("2026-08-13T12:00:00.000Z");
  });

  it("keeps live vs draft version isolation", () => {
    saveVersion(
      ContentVersionSchema.parse({
        contentId,
        version: 1,
        status: "published",
        createdAt: "2026-01-01T00:00:00.000Z",
        publishedAt: "2026-01-15T10:00:00.000Z",
        summary: { sections: ["overview"] },
      }),
    );

    // Cannot overwrite published body
    expect(() =>
      saveVersion(
        ContentVersionSchema.parse({
          contentId,
          version: 1,
          status: "published",
          createdAt: "2026-01-01T00:00:00.000Z",
          publishedAt: "2026-01-15T10:00:00.000Z",
          summary: { sections: ["hacked"] },
        }),
      ),
    ).toThrow(/Refusing to overwrite published version/);

    const draft = createDraftVersion({
      contentId,
      bodyRef: "src/data/editorial/drafts/software-review/pipedrive/v2.json",
      summary: { sections: ["overview", "pricing"] },
    });
    expect(draft.version).toBe(2);
    expect(draft.status).toBe("draft");

    const live = getLiveVersion(contentId);
    const draftLoaded = getDraftVersion(contentId);
    expect(live?.version).toBe(1);
    expect(live?.status).toBe("published");
    expect(draftLoaded?.version).toBe(2);
    expect(draftLoaded?.status).toBe("draft");

    approveVersion(contentId, 2, "editor");
    expect(getDraftVersion(contentId)?.status).toBe("approved");
    expect(getLiveVersion(contentId)?.version).toBe(1);
    expect(listVersions(contentId)).toHaveLength(2);
  });
});
