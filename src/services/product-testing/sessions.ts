import type {
  CategoryTestProtocol,
  ProductTestEvidence,
  ProductTestFinalAssessment,
  ProductTestSession,
  PublicHandsOnTestSummary,
  TestTaskResult,
} from "@/domain";
import { getAuthorById, getFounderAuthor } from "@/services/site-foundation";
import {
  getTestProtocolBySlug,
  getTestProtocolForCategory,
  listTestProtocols,
  resolveProtocolForProduct,
} from "@/data/editorial/testing/protocols";
import {
  listTestEvidenceForSession,
  listTestSessions,
  listTestSessionsForProduct,
  loadTestSession,
  saveTestEvidence,
  saveTestSession,
} from "@/data/editorial/testing/store";
import { propagateHandsOnEvidence } from "@/services/product-testing/dependent-refresh";

export {
  getTestProtocolBySlug,
  getTestProtocolForCategory,
  listTestProtocols,
  resolveProtocolForProduct,
};

function nowIso(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createTestSession(input: {
  productSlug: string;
  productId?: string;
  protocolSlug: string;
  testerId?: string;
  planTested?: string;
  testEnvironment?: string;
  testScenario?: string;
  productVersion?: string;
}): ProductTestSession {
  const protocol = getTestProtocolBySlug(input.protocolSlug);
  if (!protocol) {
    throw new Error(`Unknown test protocol: ${input.protocolSlug}`);
  }

  const testerId =
    input.testerId ??
    getFounderAuthor()?.id ??
    "author-lee-meyeridricks";
  const stamp = nowIso();

  const tasks: TestTaskResult[] = protocol.tasks.map((task) => ({
    taskId: task.id,
    status: "NOT_STARTED",
    evidenceIds: [],
    screenshotPaths: [],
  }));

  const session: ProductTestSession = {
    id: newId("test"),
    productSlug: input.productSlug,
    productId: input.productId,
    protocolSlug: protocol.slug,
    protocolVersion: protocol.version,
    testerId,
    status: "draft",
    planTested: input.planTested,
    testEnvironment: input.testEnvironment,
    testScenario: input.testScenario,
    productVersion: input.productVersion,
    evidenceLevel: "researched",
    screenshotPaths: [],
    tasks,
    observations: [],
    issues: [],
    evidenceIds: [],
    createdAt: stamp,
    updatedAt: stamp,
  };

  saveTestSession(session);
  return session;
}

export function startTestSession(
  sessionId: string,
): ProductTestSession | null {
  const session = loadTestSession(sessionId);
  if (!session) return null;
  if (session.status === "completed") return session;
  if (session.status === "abandoned") {
    throw new Error("Abandoned sessions cannot be started; create a new session.");
  }

  const next: ProductTestSession = {
    ...session,
    status: "in_progress",
    startedAt: session.startedAt ?? nowIso(),
    updatedAt: nowIso(),
  };
  saveTestSession(next);
  return next;
}

/**
 * Human-only pause when an external blocker stops the session
 * (signup dead-end, credit exhaustion, vendor outage). Resume with startTestSession.
 */
export function blockTestSession(
  sessionId: string,
  reason?: string,
): ProductTestSession | null {
  const session = loadTestSession(sessionId);
  if (!session) return null;
  if (session.status === "completed") {
    throw new Error("Completed sessions cannot be blocked.");
  }
  if (session.status === "abandoned") {
    throw new Error("Abandoned sessions cannot be blocked.");
  }

  const next: ProductTestSession = {
    ...session,
    status: "blocked",
    startedAt: session.startedAt ?? nowIso(),
    notes: reason?.trim()
      ? `${session.notes ? `${session.notes}\n` : ""}Blocked: ${reason.trim()}`
      : session.notes,
    updatedAt: nowIso(),
  };
  saveTestSession(next);
  return next;
}

export function updateTestSession(
  sessionId: string,
  patch: Partial<
    Pick<
      ProductTestSession,
      | "productVersion"
      | "planTested"
      | "testEnvironment"
      | "testScenario"
      | "notes"
      | "internalNotes"
      | "observations"
      | "issues"
      | "setupMinutes"
      | "pricingObserved"
      | "pricingVerifiedAt"
      | "screenshotPaths"
      | "finalAssessment"
      | "tasks"
    >
  >,
): ProductTestSession | null {
  const session = loadTestSession(sessionId);
  if (!session) return null;
  if (session.status === "completed") {
    throw new Error("Completed sessions are immutable via update; create a new session.");
  }

  const next: ProductTestSession = {
    ...session,
    ...patch,
    status: session.status === "draft" ? "in_progress" : session.status,
    startedAt: session.startedAt ?? nowIso(),
    updatedAt: nowIso(),
  };
  saveTestSession(next);
  return next;
}

export function updateTaskResult(
  sessionId: string,
  taskId: string,
  patch: Partial<TestTaskResult>,
): ProductTestSession | null {
  const session = loadTestSession(sessionId);
  if (!session) return null;
  if (session.status === "completed") {
    throw new Error("Cannot edit tasks on a completed session.");
  }

  const tasks = session.tasks.map((task) =>
    task.taskId === taskId
      ? {
          ...task,
          ...patch,
          taskId,
          completedAt:
            patch.status && patch.status !== "NOT_STARTED"
              ? (patch.completedAt ?? nowIso())
              : task.completedAt,
        }
      : task,
  );

  return updateTestSession(sessionId, { tasks });
}

export function addSessionEvidence(input: {
  sessionId: string;
  kind: ProductTestEvidence["kind"];
  title: string;
  summary?: string;
  publicCaption?: string;
  assetPath?: string;
  taskId?: string;
  minutes?: number;
  pricingAmount?: number;
  pricingCurrency?: string;
  pricingPlanLabel?: string;
  public?: boolean;
}): ProductTestEvidence | null {
  const session = loadTestSession(input.sessionId);
  if (!session) return null;
  if (session.status === "completed") {
    throw new Error("Cannot add evidence to a completed session.");
  }

  const evidence: ProductTestEvidence = {
    id: newId("tev"),
    kind: input.kind,
    productSlug: session.productSlug,
    productId: session.productId,
    sessionId: session.id,
    taskId: input.taskId,
    testerId: session.testerId,
    recordedAt: nowIso(),
    title: input.title,
    summary: input.summary,
    publicCaption: input.publicCaption,
    assetPath: input.assetPath,
    minutes: input.minutes,
    pricingAmount: input.pricingAmount,
    pricingCurrency: input.pricingCurrency,
    pricingPlanLabel: input.pricingPlanLabel,
    public: input.public ?? false,
  };

  saveTestEvidence(evidence);

  const tasks = input.taskId
    ? session.tasks.map((t) =>
        t.taskId === input.taskId
          ? {
              ...t,
              evidenceIds: [...t.evidenceIds, evidence.id],
              screenshotPaths:
                input.kind === "SCREENSHOT" && input.assetPath
                  ? [...t.screenshotPaths, input.assetPath]
                  : t.screenshotPaths,
            }
          : t,
      )
    : session.tasks;

  saveTestSession({
    ...session,
    status: session.status === "draft" ? "in_progress" : session.status,
    startedAt: session.startedAt ?? nowIso(),
    evidenceIds: [...session.evidenceIds, evidence.id],
    screenshotPaths:
      input.kind === "SCREENSHOT" && input.assetPath
        ? [...session.screenshotPaths, input.assetPath]
        : session.screenshotPaths,
    tasks,
    updatedAt: nowIso(),
  });

  return evidence;
}

/**
 * Mark a session completed. Only completed sessions with recommendHandsOnClaim
 * can elevate public evidence level to hands_on_tested.
 *
 * Never auto-PASS tasks. Never fabricate a finished session from an empty draft.
 */
export function completeTestSession(
  sessionId: string,
  finalAssessment?: ProductTestFinalAssessment,
  opts?: { propagateDependents?: boolean },
): ProductTestSession | null {
  const session = loadTestSession(sessionId);
  if (!session) return null;
  if (session.status === "completed") return session;
  if (session.status === "abandoned") {
    throw new Error("Abandoned sessions cannot be completed.");
  }

  const assessment = finalAssessment ?? session.finalAssessment;
  assertCompletableSession(session, assessment);

  const recommend =
    assessment?.recommendHandsOnClaim !== false &&
    assessment?.humanConfirmedCompletion === true;
  const completedAt = nowIso();

  const next: ProductTestSession = {
    ...session,
    // Task statuses are never mutated here — human-entered only.
    status: "completed",
    startedAt: session.startedAt ?? completedAt,
    completedAt,
    finalAssessment: assessment,
    evidenceLevel: recommend ? "hands_on_tested" : "data_verified",
    updatedAt: completedAt,
  };

  saveTestSession(next);

  if (opts?.propagateDependents !== false) {
    try {
      propagateHandsOnEvidence(next);
    } catch (error) {
      // Propagation must not roll back a valid human completion.
      console.warn(
        "[product-testing] dependent refresh propagation failed:",
        error instanceof Error ? error.message : error,
      );
    }
  }

  return next;
}

function assertCompletableSession(
  session: ProductTestSession,
  assessment: ProductTestFinalAssessment | undefined,
): void {
  if (!session.testerId?.trim()) {
    throw new Error("Cannot complete: testerId is required for human evidence.");
  }

  const protocol = getTestProtocolBySlug(session.protocolSlug);
  if (!protocol) {
    throw new Error(`Cannot complete: unknown protocol ${session.protocolSlug}`);
  }

  const requiredTasks = protocol.tasks.filter((t) => t.required !== false);
  const unfinishedRequired = requiredTasks.filter((task) => {
    const result = session.tasks.find((t) => t.taskId === task.id);
    return !result || result.status === "NOT_STARTED";
  });
  if (unfinishedRequired.length > 0) {
    throw new Error(
      `Cannot complete: ${unfinishedRequired.length} required task(s) still NOT_STARTED (${unfinishedRequired
        .slice(0, 3)
        .map((t) => t.slug)
        .join(", ")}…). Record PASS/PARTIAL/FAIL/NOT_AVAILABLE/NOT_APPLICABLE/BLOCKED — tasks never auto-PASS.`,
    );
  }

  const humanTasks = session.tasks.filter((t) => t.status !== "NOT_STARTED");
  if (humanTasks.length === 0) {
    throw new Error(
      "Cannot complete: no human task results recorded. Tasks never auto-PASS.",
    );
  }

  if (assessment?.humanConfirmedCompletion !== true) {
    throw new Error(
      "Cannot complete: human confirmation required. Confirm you personally completed this test before finishing.",
    );
  }

  const strengths = assessment?.strengths ?? [];
  const weaknesses = assessment?.weaknesses ?? [];
  if (strengths.length === 0 && weaknesses.length === 0) {
    throw new Error(
      "Cannot complete: record at least one strength or weakness in the final assessment.",
    );
  }
}

/** Human-only abandon — never invents results; clears path to HANDS_ON. */
export function abandonTestSession(
  sessionId: string,
  reason?: string,
): ProductTestSession | null {
  const session = loadTestSession(sessionId);
  if (!session) return null;
  if (session.status === "completed") {
    throw new Error("Completed sessions cannot be abandoned.");
  }
  if (session.status === "abandoned") return session;

  const next: ProductTestSession = {
    ...session,
    status: "abandoned",
    notes: reason?.trim()
      ? `${session.notes ? `${session.notes}\n` : ""}Abandoned: ${reason.trim()}`
      : session.notes,
    updatedAt: nowIso(),
  };
  saveTestSession(next);
  return next;
}

/**
 * Valid completed human test suitable for public hands-on claims.
 * Incomplete / abandoned / draft sessions never qualify.
 */
export function getValidCompletedTestSession(
  productSlug: string,
): ProductTestSession | null {
  const completed = listTestSessionsForProduct(productSlug)
    .filter(
      (s) =>
        s.status === "completed" &&
        Boolean(s.completedAt?.trim()) &&
        Boolean(s.testerId?.trim()) &&
        s.finalAssessment?.recommendHandsOnClaim !== false &&
        s.finalAssessment?.humanConfirmedCompletion === true,
    )
    .sort((a, b) =>
      (b.completedAt ?? "").localeCompare(a.completedAt ?? ""),
    );

  return completed[0] ?? null;
}

export function buildPublicHandsOnSummary(
  productSlug: string,
): PublicHandsOnTestSummary | null {
  const session = getValidCompletedTestSession(productSlug);
  if (!session || !session.completedAt) return null;

  const tester = getAuthorById(session.testerId);
  const evidence = listTestEvidenceForSession(session.id).filter(
    (e) => e.public === true,
  );

  const counts = {
    total: session.tasks.length,
    pass: 0,
    partial: 0,
    fail: 0,
    notAvailable: 0,
    notApplicable: 0,
    blocked: 0,
  };
  for (const task of session.tasks) {
    if (task.status === "PASS") counts.pass += 1;
    else if (task.status === "PARTIAL") counts.partial += 1;
    else if (task.status === "FAIL") counts.fail += 1;
    else if (task.status === "NOT_AVAILABLE") counts.notAvailable += 1;
    else if (task.status === "NOT_APPLICABLE") counts.notApplicable += 1;
    else if (task.status === "BLOCKED") counts.blocked += 1;
  }

  return {
    sessionId: session.id,
    productSlug: session.productSlug,
    testerId: session.testerId,
    testerName: tester?.name,
    testedAt: session.completedAt,
    planTested: session.planTested,
    testScenario: session.testScenario,
    testEnvironment: session.testEnvironment,
    productVersion: session.productVersion,
    setupMinutes: session.setupMinutes,
    pricingObserved: session.pricingObserved,
    pricingVerifiedAt: session.pricingVerifiedAt,
    strengths: session.finalAssessment?.strengths ?? [],
    weaknesses: session.finalAssessment?.weaknesses ?? [],
    publicEvidence: evidence,
    taskSummary: counts,
  };
}

export function productHasHandsOnTest(productSlug: string): boolean {
  return getValidCompletedTestSession(productSlug) != null;
}

export function getProtocolForSession(
  session: ProductTestSession,
): CategoryTestProtocol | null {
  return getTestProtocolBySlug(session.protocolSlug);
}

export { listTestSessions, listTestSessionsForProduct, loadTestSession };
