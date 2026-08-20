import { findLatestRunForSlug, listManifests } from "@/data/onboarding/store";
import { handoffToRunTask } from "./runner";
import { buildAgentContext } from "./context-builder";
import { getContentAgent } from "./registry";
import type { AgentReadiness, AgentRunTask } from "@/domain";

export type ReadyTaskRow = {
  status: AgentReadiness["status"] | AgentRunTask["status"];
  agentId: string;
  label: string;
  target: string;
  reason?: string;
};

/**
 * Report READY vs BLOCKED agent tasks from onboarding handoffs + live readiness.
 */
export function buildReadyTaskReport(productSlug?: string): ReadyTaskRow[] {
  const rows: ReadyTaskRow[] = [];
  const manifests = listManifests().filter((m) =>
    productSlug ? m.productSlug === productSlug : true,
  );

  for (const manifest of manifests) {
    const run = findLatestRunForSlug(manifest.productSlug);
    if (!run) continue;
    for (const handoff of run.agentTasks ?? []) {
      const task = handoffToRunTask(handoff);
      if (!task) continue;

      if (task.status === "BLOCKED" || task.status === "WAITING") {
        rows.push({
          status: task.status,
          agentId: task.agentId,
          label: task.agentId.replace(/-agent$/, ""),
          target: task.productIds.join(",") || manifest.productSlug,
          reason: task.statusReason,
        });
        continue;
      }

      const agent = getContentAgent(task.agentId);
      const context = buildAgentContext({
        agentId: task.agentId,
        task,
        allowNormalizedFacts: manifest.productSlug === "getresponse",
      });
      const readiness = agent.canRun(context);
      rows.push({
        status: readiness.status,
        agentId: task.agentId,
        label: task.agentId.replace(/-agent$/, ""),
        target:
          task.targetSlug ??
          task.productIds.join(" vs ") ??
          manifest.productSlug,
        reason: readiness.reasons.map((r) => r.message).join("; ") || undefined,
      });
    }
  }

  return rows;
}

export function formatReadyTaskReport(rows: ReadyTaskRow[]): string {
  const ready = rows.filter((r) => r.status === "READY");
  const blocked = rows.filter((r) => r.status !== "READY");
  const lines: string[] = ["READY", ""];
  for (const r of ready) {
    lines.push(`${r.label}`);
    lines.push(r.target);
    lines.push("");
  }
  lines.push("BLOCKED", "");
  for (const r of blocked) {
    lines.push(`${r.label}`);
    lines.push(r.target);
    if (r.reason) lines.push(`Reason: ${r.reason}`);
    lines.push("");
  }
  return lines.join("\n").trim() + "\n";
}
