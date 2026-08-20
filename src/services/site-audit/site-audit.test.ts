import { beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  auditCategory,
  auditContent,
  auditProduct,
  auditSite,
  createIssue,
  reconcileIssues,
  runQualitativeEditorialAudit,
  validateSiteAudit,
} from "@/services/site-audit";

const STATE = path.join(process.cwd(), "src/data/audit/state");

function resetAuditState(): void {
  for (const sub of ["results"]) {
    const dir = path.join(STATE, sub);
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) {
        if (f.endsWith(".json")) fs.unlinkSync(path.join(dir, f));
      }
    }
  }
  const issues = path.join(STATE, "issues.json");
  if (fs.existsSync(issues)) fs.unlinkSync(issues);
}

describe("site audit engine", () => {
  beforeEach(() => {
    resetAuditState();
  });

  it("runs site audit with metrics and transparent health", async () => {
    const result = await auditSite({ persist: true, writeReport: false });
    expect(result.scope.kind).toBe("site");
    expect(result.metrics.publishedPages).toBeGreaterThan(0);
    expect(result.health?.formula).toMatch(/validity/);
    expect(["pass", "pass-with-warnings", "fail"]).toContain(result.status);
  });

  it("audits CRM category", async () => {
    const result = await auditCategory("crm", { persist: false });
    expect(result.scope.id).toBe("crm");
    expect(result.notes.some((n) => /maturity/i.test(n))).toBe(true);
  });

  it("audits getresponse product", async () => {
    const result = await auditProduct("getresponse", { persist: false });
    expect(result.scope.kind).toBe("product");
    // May be candidate/partial — still returns structured result
    expect(result.auditedAt).toBeTruthy();
  });

  it("detects bad-draft fixture issues with correct severity", async () => {
    const result = await auditContent("content:fixture:bad-draft", {
      persist: false,
      fixtures: {
        badDraft: {
          contentId: "content:fixture:bad-draft",
          path: "/software/fixture-bad/",
          body: "We tested this for weeks. Plans start at $29/month.",
          handsOnAllowed: false,
        },
        structuredPrice: "39",
        brokenInternalLink: {
          path: "/software/fixture-bad/",
          target: "/software/does-not-exist/",
        },
      },
    });
    const types = [
      ...result.blockers,
      ...result.warnings,
      ...result.opportunities,
    ].map((i) => i.type);
    expect(types).toContain("FAKE_TESTING_CLAIM");
    expect(types).toContain("UNVERIFIED_NUMBER");
    expect(types).toContain("BROKEN_INTERNAL_LINK");
    expect(
      result.blockers.some(
        (i) => i.type === "FAKE_TESTING_CLAIM" && i.severity === "critical",
      ),
    ).toBe(true);
  });

  it("detects inconsistent editorial position fixture", async () => {
    const result = await auditProduct("pipedrive", {
      persist: false,
      fixtures: {
        editorialConflict: {
          productSlug: "pipedrive",
          comparisonClaim: "Freshsales better for automation",
          bestClaim: "Pipedrive chosen for stronger automation",
        },
      },
    });
    expect(
      [...result.blockers, ...result.warnings].some(
        (i) => i.type === "INCONSISTENT_EDITORIAL_POSITION",
      ),
    ).toBe(true);
  });

  it("detects duplicate intent fixture", async () => {
    const result = await auditProduct("pipedrive", {
      persist: false,
      fixtures: {
        duplicateIntent: {
          livePath: "/software/pipedrive/",
          legacyPath: "/pipedrive-review/",
          productSlug: "pipedrive",
        },
      },
    });
    expect(
      [...result.blockers, ...result.warnings].some(
        (i) => i.type === "DUPLICATE_INTENT",
      ),
    ).toBe(true);
  });

  it("detects orphan page fixture", async () => {
    const result = await auditSite({
      persist: false,
      fixtures: { orphanPath: "/guides/orphan-fixture/" },
    });
    expect(
      [...result.blockers, ...result.warnings].some(
        (i) => i.type === "ORPHAN_CONTENT",
      ),
    ).toBe(true);
  });

  it("detects stale scheduled page fixture", async () => {
    const result = await auditContent("content:compare:stale-scheduled", {
      persist: false,
      fixtures: {
        staleScheduled: {
          contentId: "content:compare:stale-scheduled",
          path: "/compare/fixture-vs-stale/",
          reason: "critical pricing source changed after approval",
        },
      },
    });
    expect(
      result.blockers.some(
        (i) => i.type === "SCHEDULED_UNSAFE" && i.severity === "critical",
      ),
    ).toBe(true);
    expect(result.publicationReadiness).toBe("NOT_PUBLISHABLE");
  });

  it("deduplicates and resolves issues across audits", () => {
    const now = "2026-08-13T12:00:00.000Z";
    const a = createIssue(
      {
        type: "ORPHAN_CONTENT",
        message: "orphan test",
        path: "/x/",
        contentId: "content:x",
      },
      now,
    );
    const first = reconcileIssues({ previous: [], detected: [a], now });
    expect(first).toHaveLength(1);
    const second = reconcileIssues({
      previous: first,
      detected: [a],
      now: "2026-08-13T13:00:00.000Z",
    });
    expect(second).toHaveLength(1);
    expect(second[0]!.firstSeenAt).toBe(now);
    const resolved = reconcileIssues({
      previous: second,
      detected: [],
      scopePrefix: "content:x",
      now: "2026-08-13T14:00:00.000Z",
    });
    expect(resolved[0]!.state).toBe("resolved");
  });

  it("site-wide reconcile resolves open issues that were not re-detected", () => {
    const now = "2026-08-18T12:00:00.000Z";
    const stale = createIssue(
      {
        type: "MISSING_ALT_CONTEXT",
        message: "Salesflare: approved alternatives exist but no alternatives page",
        productSlug: "salesflare",
      },
      now,
    );
    const resolved = reconcileIssues({
      previous: [stale],
      detected: [],
      scopePrefix: "site",
      now: "2026-08-18T13:00:00.000Z",
    });
    expect(resolved[0]!.state).toBe("resolved");
  });

  it("qualitative agent only after weak signals", () => {
    const thin = createIssue({
      type: "THIN_CONTENT",
      message: "thin",
      contentId: "c1",
    });
    const out = runQualitativeEditorialAudit({
      contentId: "c1",
      pageType: "software",
      body: "This is a product. Buy it.",
      deterministicIssues: [thin],
    });
    expect(out.some((i) => i.type === "THIN_CONTENT")).toBe(true);
  });

  it("validateSiteAudit passes", () => {
    const v = validateSiteAudit();
    expect(v.ok).toBe(true);
    expect(v.checkCount).toBeGreaterThanOrEqual(10);
  });
});
