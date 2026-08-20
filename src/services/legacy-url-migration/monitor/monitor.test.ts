import { describe, expect, it } from "vitest";
import { stableMigIssueId } from "@/services/legacy-url-migration/monitor/stable-ids";
import {
  applyReappearanceRegression,
  reconcileIssueStates,
} from "@/services/legacy-url-migration/monitor/issue-store";
import type { MonitorIssueSnapshot } from "@/services/legacy-url-migration/monitor/types";

describe("LegacyMigrationMonitorAgent IDs + states", () => {
  it("builds stable MIG-* ids", () => {
    const a = stableMigIssueId("REDIRECT", "/pipedrive-crm-review/", "x");
    const b = stableMigIssueId("REDIRECT", "/pipedrive-crm-review/", "x");
    expect(a).toMatch(/^MIG-REDIRECT-[0-9A-F]{4}$/);
    expect(a).toBe(b);
    expect(stableMigIssueId("404", "/x/", "y")).toMatch(/^MIG-404-/);
    expect(stableMigIssueId("CANONICAL", "/y/", "z")).toMatch(/^MIG-CANONICAL-/);
  });

  it("marks NEW then OPEN across runs", () => {
    const current = [
      {
        id: "MIG-REDIRECT-AAAA",
        kind: "REDIRECT" as const,
        severity: "P1" as const,
        subject: "/a/",
        problem: "test",
        evidence: "e",
        recommendedAction: "fix",
        important: true,
      },
    ];
    const first = reconcileIssueStates({
      current,
      previous: null,
      intentionalIds: new Set(),
      now: "2026-08-15T00:00:00.000Z",
    });
    expect(first.issues[0]?.state).toBe("NEW");

    const snapshot: MonitorIssueSnapshot = {
      generatedAt: "2026-08-15T00:00:00.000Z",
      mode: "static",
      issues: [
        {
          id: "MIG-REDIRECT-AAAA",
          kind: "REDIRECT",
          severity: "P1",
          subject: "/a/",
          problem: "test",
          state: "OPEN",
          important: true,
          firstSeenAt: "2026-08-15T00:00:00.000Z",
          lastSeenAt: "2026-08-15T00:00:00.000Z",
        },
      ],
    };
    const second = reconcileIssueStates({
      current,
      previous: snapshot,
      intentionalIds: new Set(),
      now: "2026-08-16T00:00:00.000Z",
    });
    expect(second.issues[0]?.state).toBe("OPEN");
  });

  it("marks INTENTIONAL and RESOLVED", () => {
    const previous: MonitorIssueSnapshot = {
      generatedAt: "2026-08-15T00:00:00.000Z",
      mode: "static",
      issues: [
        {
          id: "MIG-404-BBBB",
          kind: "404",
          severity: "P1",
          subject: "/old/",
          problem: "gone",
          state: "OPEN",
          important: false,
          firstSeenAt: "2026-08-15T00:00:00.000Z",
          lastSeenAt: "2026-08-15T00:00:00.000Z",
        },
        {
          id: "MIG-SITEMAP-CCCC",
          kind: "SITEMAP",
          severity: "P2",
          subject: "/x/",
          problem: "allow",
          state: "OPEN",
          important: false,
          firstSeenAt: "2026-08-15T00:00:00.000Z",
          lastSeenAt: "2026-08-15T00:00:00.000Z",
        },
      ],
    };
    const { issues, counts } = reconcileIssueStates({
      current: [
        {
          id: "MIG-SITEMAP-CCCC",
          kind: "SITEMAP",
          severity: "P2",
          subject: "/x/",
          problem: "allow",
          evidence: "e",
          recommendedAction: "keep",
          important: false,
        },
      ],
      previous,
      intentionalIds: new Set(["MIG-SITEMAP-CCCC"]),
      now: "2026-08-16T00:00:00.000Z",
    });
    expect(counts.RESOLVED).toBe(1);
    expect(issues.find((i) => i.id === "MIG-404-BBBB")?.state).toBe("RESOLVED");
    expect(issues.find((i) => i.id === "MIG-SITEMAP-CCCC")?.state).toBe(
      "INTENTIONAL",
    );
  });

  it("marks REGRESSED on reappearance after resolve", () => {
    const counts = {
      NEW: 1,
      OPEN: 0,
      RESOLVED: 0,
      REGRESSED: 0,
      INTENTIONAL: 0,
    };
    const issues = applyReappearanceRegression(
      [
        {
          id: "MIG-CHAIN-DDDD",
          kind: "CHAIN",
          severity: "P0",
          subject: "/a/",
          problem: "chain",
          evidence: "e",
          recommendedAction: "flatten",
          important: true,
          state: "NEW",
          firstSeenAt: "2026-08-16T00:00:00.000Z",
          lastSeenAt: "2026-08-16T00:00:00.000Z",
        },
      ],
      new Set(["MIG-CHAIN-DDDD"]),
      counts,
    );
    expect(issues[0]?.state).toBe("REGRESSED");
    expect(counts.REGRESSED).toBe(1);
    expect(counts.NEW).toBe(0);
  });
});
