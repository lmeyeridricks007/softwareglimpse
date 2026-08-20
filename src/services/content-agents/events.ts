import { appendAgentEvent } from "@/data/agents/store";

export function emitAgentEvent(
  event:
    | "agent_task_started"
    | "agent_task_completed"
    | "agent_task_failed"
    | "agent_draft_created"
    | "agent_qa_failed"
    | "agent_revision_created"
    | "agent_task_blocked",
  payload: Record<string, unknown>,
): void {
  // Operational observability — JSONL only (CLI controls stdout)
  try {
    appendAgentEvent(event, payload);
  } catch {
    // Disk write failures must not break generation
  }
}
