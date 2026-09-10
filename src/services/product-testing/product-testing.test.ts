import { describe, expect, it } from "vitest";
import {
  resolveEvidenceLevel,
  buildEditorialTrustMetadata,
} from "@/services/editorial/evidence-level";
import {
  completeTestSession,
  createTestSession,
  getValidCompletedTestSession,
  buildPublicHandsOnSummary,
  updateTaskResult,
  listTestProtocols,
} from "@/services/product-testing/sessions";
import {
  buildProductTestingQueue,
  DEFAULT_TESTING_QUEUE_LIMIT,
} from "@/services/product-testing/queue";
import { buildTestCoverageMetrics } from "@/services/product-testing/coverage";
import { saveTestingScreenshot } from "@/services/product-testing/screenshots";
import { crmTestProtocol } from "@/data/editorial/testing/protocols/crm";
import { unlinkSync, existsSync, rmSync } from "node:fs";
import path from "node:path";

function cleanupSession(id: string) {
  const file = path.join(
    process.cwd(),
    "src/data/editorial/testing/sessions",
    `${id}.json`,
  );
  if (existsSync(file)) unlinkSync(file);
}

describe("product testing system", () => {
  it("defines a full CRM protocol with task statuses", () => {
    expect(crmTestProtocol.tasks.length).toBeGreaterThanOrEqual(17);
    expect(crmTestProtocol.tasks[0]?.slug).toBe("create-account");
    expect(crmTestProtocol.tasks.at(-1)?.slug).toBe("verify-pricing");
  });

  it("never elevates evidence from incomplete sessions", () => {
    expect(
      resolveEvidenceLevel({
        handsOnTesting: false,
        testedAt: null,
      }),
    ).toBe("researched");

    const trust = buildEditorialTrustMetadata({
      software: {
        slug: "nonexistent-product-xyz",
      } as never,
    });
    expect(trust.evidenceLevel).not.toBe("hands_on_tested");
    expect(trust.handsOnTesting).toBe(false);
  });

  it("rejects completing sessions without human task results", () => {
    const slug = "zz-test-harness-incomplete";
    const session = createTestSession({
      productSlug: slug,
      protocolSlug: "crm-hands-on",
    });
    try {
      expect(() =>
        completeTestSession(
          session.id,
          {
            strengths: ["Would be fabricated"],
            weaknesses: [],
            unexpectedFindings: [],
            recommendHandsOnClaim: true,
            humanConfirmedCompletion: true,
          },
          { propagateDependents: false },
        ),
      ).toThrow(/required task|no human task results|human confirmation/i);
      expect(getValidCompletedTestSession(slug)).toBeNull();
    } finally {
      cleanupSession(session.id);
    }
  });

  it("creates, completes, and exposes only completed sessions publicly", () => {
    const slug = "zz-test-harness-crm";
    const session = createTestSession({
      productSlug: slug,
      protocolSlug: "crm-hands-on",
      planTested: "Essential trial",
      testScenario: "Unit-test sandbox — not a live vendor claim",
    });

    try {
      expect(session.status).toBe("draft");
      expect(session.tasks.every((t) => t.status === "NOT_STARTED")).toBe(true);
      expect(getValidCompletedTestSession(slug)).toBeNull();
      expect(buildPublicHandsOnSummary(slug)).toBeNull();

      // Mark every required task — optional may stay NOT_STARTED (proves no auto-PASS).
      for (const task of crmTestProtocol.tasks) {
        if (task.required === false) continue;
        updateTaskResult(session.id, task.id, {
          status: task.id === "crm-create-account" ? "PASS" : "PARTIAL",
          notes: "Human harness result",
        });
      }

      const completed = completeTestSession(
        session.id,
        {
          strengths: ["Clear pipeline UI"],
          weaknesses: ["Sample limitation"],
          unexpectedFindings: [],
          recommendHandsOnClaim: true,
          humanConfirmedCompletion: true,
        },
        { propagateDependents: false },
      );

      expect(completed?.status).toBe("completed");
      expect(completed?.evidenceLevel).toBe("hands_on_tested");
      // Completion must not auto-PASS optional remaining tasks
      expect(
        completed?.tasks.filter((t) => t.status === "NOT_STARTED").length,
      ).toBeGreaterThan(0);
      expect(getValidCompletedTestSession(slug)?.id).toBe(session.id);

      const publicSummary = buildPublicHandsOnSummary(slug);
      expect(publicSummary?.planTested).toBe("Essential trial");
      expect(publicSummary?.strengths).toContain("Clear pipeline UI");
      expect(
        (publicSummary as { internalNotes?: string } | null)?.internalNotes,
      ).toBeUndefined();
    } finally {
      cleanupSession(session.id);
    }
  });

  it("rejects finish while required tasks remain NOT_STARTED", () => {
    const slug = "zz-test-harness-required";
    const session = createTestSession({
      productSlug: slug,
      protocolSlug: "crm-hands-on",
    });
    try {
      updateTaskResult(session.id, "crm-create-account", {
        status: "PASS",
        notes: "Only one task",
      });
      expect(() =>
        completeTestSession(
          session.id,
          {
            strengths: ["x"],
            weaknesses: [],
            unexpectedFindings: [],
            recommendHandsOnClaim: true,
            humanConfirmedCompletion: true,
          },
          { propagateDependents: false },
        ),
      ).toThrow(/required task/i);
    } finally {
      cleanupSession(session.id);
    }
  });

  it("lists email and sales-intelligence protocols", () => {
    expect(listTestProtocols().map((p) => p.slug)).toEqual(
      expect.arrayContaining([
        "crm-hands-on",
        "email-marketing-hands-on",
        "sales-intelligence-hands-on",
      ]),
    );
  });

  it("rejects non-image screenshot uploads", () => {
    expect(() =>
      saveTestingScreenshot({
        productSlug: "hubspot",
        sessionId: "test-session",
        filename: "notes.txt",
        bytes: Buffer.from("not an image"),
      }),
    ).toThrow(/PNG|JPEG|WebP|GIF/i);
  });

  it("accepts PNG magic bytes for secure screenshot storage", () => {
    const png = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x00,
    ]);
    const saved = saveTestingScreenshot({
      productSlug: "zz-test-harness-crm",
      sessionId: "test-upload-session",
      filename: "pipeline.png",
      bytes: png,
      declaredMime: "image/png",
    });
    expect(saved.assetPath).toMatch(
      /^\/testing-evidence\/zz-test-harness-crm\/test-upload-session\//,
    );
    rmSync(
      path.join(process.cwd(), "public/testing-evidence/zz-test-harness-crm"),
      { recursive: true, force: true },
    );
  });

  it(
    "builds a top-5 evidence-priority queue without inventing hands-on counts",
    () => {
      const queue = buildProductTestingQueue();
      expect(queue.items.length).toBe(DEFAULT_TESTING_QUEUE_LIMIT);
      expect(queue.selectionMode).toBe("evidence_priority");
      expect(queue.items[0]?.rank).toBe(1);
      expect(queue.items[0]?.evidencePriorityScore).toBeGreaterThan(0);
      expect(queue.items[0]?.comparisonCount).toBeGreaterThanOrEqual(0);

      // Priority should be descending
      for (let i = 1; i < queue.items.length; i += 1) {
        expect(queue.items[i - 1]!.evidencePriorityScore).toBeGreaterThanOrEqual(
          queue.items[i]!.evidencePriorityScore,
        );
      }

      const coverage = buildTestCoverageMetrics();
      expect(coverage.totalProducts).toBeGreaterThan(0);
      expect(
        coverage.researched + coverage.dataVerified + coverage.handsOnTested,
      ).toBe(coverage.totalProducts);
      expect(coverage.dataVerified).toBeLessThan(coverage.totalProducts * 0.85);
      expect(
        (coverage.researched + coverage.dataVerified) / coverage.totalProducts,
      ).toBeGreaterThan(0.4);
      // Hands-on must stay strict — do not invent sessions.
      expect(coverage.handsOnTested).toBe(0);
    },
    300_000,
  );
});
