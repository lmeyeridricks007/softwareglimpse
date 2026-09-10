import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  resolveAffectedPages,
  type AffectedPage,
} from "@/services/editorial/dependencies";
import { markDependentPagesRefreshNeeded } from "@/services/editorial/refresh";
import type { ProductTestSession } from "@/domain";

export type EvidenceRefreshTaskStatus = "pending" | "done" | "skipped";

export type EvidenceRefreshTask = {
  id: string;
  productSlug: string;
  sessionId: string;
  pageType: AffectedPage["pageType"];
  path: string;
  slug: string;
  priority: "high" | "medium" | "low";
  reason: string;
  materialBenefit: string;
  status: EvidenceRefreshTaskStatus;
  createdAt: string;
};

export type EvidenceRefreshTaskStore = {
  version: "1.0.0";
  updatedAt: string;
  note: string;
  tasks: EvidenceRefreshTask[];
};

const STORE_REL = "data/editorial/testing-refresh-tasks.json";
const DOC_REL = "docs/editorial/PRODUCT-TESTING-REFRESH-TASKS.md";

function emptyStore(): EvidenceRefreshTaskStore {
  return {
    version: "1.0.0",
    updatedAt: new Date(0).toISOString(),
    note:
      "Refresh tasks after real hands-on sessions. Do not rewrite dependents blindly — pick material updates.",
    tasks: [],
  };
}

function taskId(
  productSlug: string,
  sessionId: string,
  pageType: string,
  slug: string,
): string {
  return createHash("sha256")
    .update(`${productSlug}|${sessionId}|${pageType}|${slug}`)
    .digest("hex")
    .slice(0, 16);
}

export function loadEvidenceRefreshTasks(
  cwd = process.cwd(),
): EvidenceRefreshTaskStore {
  const file = path.join(cwd, STORE_REL);
  if (!existsSync(file)) return emptyStore();
  try {
    return JSON.parse(readFileSync(file, "utf8")) as EvidenceRefreshTaskStore;
  } catch {
    return emptyStore();
  }
}

export function formatEvidenceRefreshTasksMarkdown(
  store: EvidenceRefreshTaskStore,
): string {
  const pending = store.tasks.filter((t) => t.status === "pending");
  const lines: string[] = [
    "# Product testing — dependent refresh tasks",
    "",
    `Updated: ${store.updatedAt}`,
    "",
    store.note,
    "",
    `Pending: **${pending.length}** · Total recorded: **${store.tasks.length}**`,
    "",
    "## Pending tasks",
    "",
  ];

  if (pending.length === 0) {
    lines.push("_No pending refresh tasks._", "");
  } else {
    lines.push(
      "| Priority | Product | Page | Type | Why |",
      "| --- | --- | --- | --- | --- |",
    );
    for (const task of pending) {
      lines.push(
        `| ${task.priority} | \`${task.productSlug}\` | [${task.path}](${task.path}) | ${task.pageType} | ${task.materialBenefit} |`,
      );
    }
    lines.push("");
  }

  lines.push(
    "## Rules",
    "",
    "1. Only create tasks after a **completed** human test session.",
    "2. Do **not** auto-rewrite every dependent page.",
    "3. Prefer material updates: How We Tested, uneven coverage callouts, strengths/weaknesses that change advice.",
    "",
  );

  return `${lines.join("\n")}\n`;
}

export function writeEvidenceRefreshTasks(
  tasks: EvidenceRefreshTask[],
  opts?: { cwd?: string; writeMarkdown?: boolean },
): EvidenceRefreshTaskStore {
  const cwd = opts?.cwd ?? process.cwd();
  const existing = loadEvidenceRefreshTasks(cwd);
  const byId = new Map(existing.tasks.map((t) => [t.id, t]));

  for (const task of tasks) {
    const prev = byId.get(task.id);
    if (prev?.status === "done" || prev?.status === "skipped") continue;
    byId.set(task.id, task);
  }

  const store: EvidenceRefreshTaskStore = {
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
    note: emptyStore().note,
    tasks: [...byId.values()].sort((a, b) => {
      const p = priorityRank(a.priority) - priorityRank(b.priority);
      if (p !== 0) return p;
      return b.createdAt.localeCompare(a.createdAt);
    }),
  };

  mkdirSync(path.join(cwd, "data/editorial"), { recursive: true });
  writeFileSync(
    path.join(cwd, STORE_REL),
    `${JSON.stringify(store, null, 2)}\n`,
    "utf8",
  );

  if (opts?.writeMarkdown !== false) {
    mkdirSync(path.join(cwd, "docs/editorial"), { recursive: true });
    writeFileSync(
      path.join(cwd, DOC_REL),
      formatEvidenceRefreshTasksMarkdown(store),
      "utf8",
    );
  }

  return store;
}

function priorityRank(p: EvidenceRefreshTask["priority"]): number {
  if (p === "high") return 0;
  if (p === "medium") return 1;
  return 2;
}

function prioritizeAffected(
  pages: AffectedPage[],
  productSlug: string,
): EvidenceRefreshTaskDraft[] {
  const drafts: EvidenceRefreshTaskDraft[] = [];

  for (const page of pages) {
    if (page.pageType === "tool") continue;

    let priority: EvidenceRefreshTask["priority"] = "medium";
    let materialBenefit =
      "May benefit from hands-on evidence once editorial refresh is planned.";

    if (page.pageType === "software-review") {
      priority = "high";
      materialBenefit =
        "Surface How We Tested, public screenshots, and elevate evidence level claims only where session allows.";
    } else if (page.pageType === "comparison") {
      priority = "high";
      materialBenefit =
        "Update comparison testing coverage (both/one/none) and avoid implying equivalent hands-on evidence.";
    } else if (page.pageType === "best") {
      priority = "medium";
      materialBenefit =
        "Consider whether hands-on notes materially change recommendation rationale — do not rewrite blindly.";
    } else if (page.pageType === "alternatives") {
      priority = "low";
      materialBenefit =
        "Optional: mention hands-on status if it changes alternative framing.";
    } else if (page.pageType === "pricing") {
      priority = "medium";
      materialBenefit =
        "Cross-check pricing observed in the test session against the pricing page.";
    } else if (page.pageType === "guide") {
      priority = "medium";
      materialBenefit =
        "Product-scoped guide may benefit from hands-on caveats — refresh only if claims would change.";
    }

    drafts.push({
      pageType: page.pageType,
      path: page.path,
      slug: page.slug,
      priority,
      materialBenefit,
      reason: `Hands-on test completed for ${productSlug}`,
    });
  }

  // Cap comparisons / alternatives / best / guides to avoid drowning editors.
  const review = drafts.filter((d) => d.pageType === "software-review");
  const pricing = drafts.filter((d) => d.pageType === "pricing");
  const comparisons = drafts
    .filter((d) => d.pageType === "comparison")
    .slice(0, 8);
  const best = drafts.filter((d) => d.pageType === "best").slice(0, 5);
  const alternatives = drafts
    .filter((d) => d.pageType === "alternatives")
    .slice(0, 3);
  const guides = drafts.filter((d) => d.pageType === "guide").slice(0, 6);

  return [
    ...review,
    ...pricing,
    ...comparisons,
    ...best,
    ...alternatives,
    ...guides,
  ];
}

type EvidenceRefreshTaskDraft = {
  pageType: EvidenceRefreshTask["pageType"];
  path: string;
  slug: string;
  priority: EvidenceRefreshTask["priority"];
  materialBenefit: string;
  reason: string;
};

/**
 * After a real completed session: mark review refresh + create dependent tasks.
 * Does not rewrite page bodies.
 */
export function propagateHandsOnEvidence(
  session: ProductTestSession,
  opts?: { cwd?: string; writeMarkdown?: boolean },
): {
  markedReview: boolean;
  tasks: EvidenceRefreshTask[];
  store: EvidenceRefreshTaskStore;
} {
  if (session.status !== "completed" || !session.completedAt) {
    throw new Error(
      "Evidence propagation requires a completed human test session.",
    );
  }

  const mark = markDependentPagesRefreshNeeded(
    session.productSlug,
    `hands-on-test-completed:${session.id}`,
  );

  const stamped = new Date().toISOString();
  const drafts = prioritizeAffected(
    resolveAffectedPages(session.productSlug),
    session.productSlug,
  );

  const tasks: EvidenceRefreshTask[] = drafts.map((d) => ({
    id: taskId(session.productSlug, session.id, d.pageType, d.slug),
    productSlug: session.productSlug,
    sessionId: session.id,
    pageType: d.pageType,
    path: d.path,
    slug: d.slug,
    priority: d.priority,
    reason: d.reason,
    materialBenefit: d.materialBenefit,
    status: "pending",
    createdAt: stamped,
  }));

  const store = writeEvidenceRefreshTasks(tasks, opts);

  return {
    markedReview: mark.markedReview,
    tasks,
    store,
  };
}

export { resolveAffectedPages };
