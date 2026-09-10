import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { PricingVerificationTask } from "@/domain";

export {
  buildPricingVerificationTask,
  buildPricingVerificationTasks,
} from "./verification-task-build";

const DIR = path.join(process.cwd(), "data/pricing");
const TASKS_FILE = path.join(DIR, "verification-tasks.json");
const TASKS_MD = path.join(
  process.cwd(),
  "docs/pricing/PRICING-VERIFICATION-TASKS.md",
);

export type PricingVerificationTaskStore = {
  version: "1.0.0";
  updatedAt: string;
  note: string;
  tasks: PricingVerificationTask[];
};

function emptyStore(): PricingVerificationTaskStore {
  return {
    version: "1.0.0",
    updatedAt: new Date(0).toISOString(),
    note: "REQUIRES_REVIEW / LIKELY pricing changes stay unpublished until confirmed.",
    tasks: [],
  };
}

export function loadPricingVerificationTasks(
  cwd = process.cwd(),
): PricingVerificationTaskStore {
  const file = path.join(cwd, "data/pricing/verification-tasks.json");
  if (!existsSync(file)) return emptyStore();
  try {
    return JSON.parse(
      readFileSync(file, "utf8"),
    ) as PricingVerificationTaskStore;
  } catch {
    return emptyStore();
  }
}

/**
 * Persist verification tasks. Pending tasks for the same id are updated;
 * confirmed/rejected history is preserved (append-only status transitions).
 */
export function writePricingVerificationTasks(
  tasks: PricingVerificationTask[],
  opts?: { cwd?: string; writeMarkdown?: boolean },
): PricingVerificationTaskStore {
  const cwd = opts?.cwd ?? process.cwd();
  const existing = loadPricingVerificationTasks(cwd);
  const byId = new Map(existing.tasks.map((t) => [t.id, t]));

  for (const task of tasks) {
    const prev = byId.get(task.id);
    if (prev?.status === "confirmed" || prev?.status === "rejected") {
      continue;
    }
    byId.set(task.id, task);
  }

  const store: PricingVerificationTaskStore = {
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
    note: "REQUIRES_REVIEW / LIKELY pricing changes stay unpublished until confirmed.",
    tasks: [...byId.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    ),
  };

  const dir = path.join(cwd, "data/pricing");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, "verification-tasks.json"),
    `${JSON.stringify(store, null, 2)}\n`,
    "utf8",
  );

  if (opts?.writeMarkdown !== false) {
    writeFileSync(
      path.join(cwd, "docs/pricing/PRICING-VERIFICATION-TASKS.md"),
      formatVerificationTasksMarkdown(store),
      "utf8",
    );
  }

  return store;
}

export function formatVerificationTasksMarkdown(
  store: PricingVerificationTaskStore,
): string {
  const pending = store.tasks.filter((t) => t.status === "pending");
  const lines: string[] = [
    "# Pricing verification tasks",
    "",
    `Updated: ${store.updatedAt}`,
    "",
    store.note,
    "",
    "Unverified changes must **not** be published as pricing facts.",
    "",
    `Pending: **${pending.length}**`,
    "",
  ];

  if (pending.length === 0) {
    lines.push("_No pending verification tasks._", "");
    return `${lines.join("\n")}\n`;
  }

  for (const task of pending) {
    lines.push(`## ${task.productName} — \`${task.id}\``);
    lines.push("");
    lines.push(`- **Status:** ${task.status} (publish blocked)`);
    lines.push(`- **Confidence:** \`${task.confidence}\``);
    lines.push(`- **Kind:** \`${task.kind}\``);
    lines.push(
      `- **Source:** ${task.source.label}${
        task.source.enrichmentPath ? ` (\`${task.source.enrichmentPath}\`)` : ""
      }`,
    );
    if (task.source.sourceIds.length) {
      lines.push(`- **Source IDs:** ${task.source.sourceIds.join(", ")}`);
    }
    lines.push(
      `- **Source verifiedAt:** ${task.source.verifiedAt ?? "_none_"}`,
    );
    lines.push(`- **Difference:** ${task.difference.summary}`);
    if (
      task.difference.previousPrice != null ||
      task.difference.newPrice != null
    ) {
      lines.push(
        `- **Prices:** ${task.difference.previousPrice ?? "—"} → ${task.difference.newPrice ?? "—"}` +
          (task.difference.percentageChange != null
            ? ` (${task.difference.percentageChange}%)`
            : ""),
      );
    }
    if (task.difference.notes.length) {
      lines.push(`- **Notes:** ${task.difference.notes.join("; ")}`);
    }
    lines.push("");
    lines.push("### Current stored pricing (observations)");
    if (task.currentStoredPricing.plans.length === 0) {
      lines.push("_No plan observations stored._");
    } else {
      for (const p of task.currentStoredPricing.plans) {
        lines.push(
          `- ${p.planName} (\`${p.planId}\`): ${p.price ?? "—"}${p.currency ? ` ${p.currency}` : ""}`,
        );
      }
    }
    lines.push("");
    lines.push("### Detected pricing (catalogue)");
    for (const p of task.detectedPricing.plans) {
      const marker = task.affectedPlans.some((a) => a.planId === p.planId)
        ? " ← affected"
        : "";
      lines.push(
        `- ${p.planName} (\`${p.planId}\`): ${p.price ?? "—"}${p.currency ? ` ${p.currency}` : ""}${marker}`,
      );
    }
    lines.push("");
    lines.push("### Affected plans");
    for (const p of task.affectedPlans) {
      lines.push(
        `- ${p.planName ?? "—"} (\`${p.planId ?? "—"}\`) — \`${p.changeKind}\``,
      );
    }
    lines.push("");
    lines.push("### Affected pages (refresh order)");
    for (const page of task.affectedPages.slice(0, 40)) {
      lines.push(
        `- tier ${page.refreshTier}: \`${page.path}\` (${page.pageType})`,
      );
    }
    if (task.affectedPages.length > 40) {
      lines.push(`- _…+${task.affectedPages.length - 40} more_`);
    }
    lines.push("");
    lines.push(
      "Confirm with: `npm run pricing:confirm -- --task " + task.id + "`",
    );
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

export function getPricingVerificationTasksPath(): string {
  return TASKS_FILE;
}

export function getPricingVerificationTasksMarkdownPath(): string {
  return TASKS_MD;
}
