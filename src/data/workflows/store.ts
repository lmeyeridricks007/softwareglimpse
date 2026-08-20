import fs from "node:fs";
import path from "node:path";
import {
  ApprovalRecordSchema,
  WorkflowRunSchema,
  type ApprovalRecord,
  type WorkflowRun,
} from "@/domain";

const ROOT = path.join(process.cwd(), "src/data/workflows");

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath: string, data: unknown): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function readJson(filePath: string): unknown | null {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function workflowRunsDir(): string {
  return path.join(ROOT, "runs");
}

export function workflowApprovalsDir(): string {
  return path.join(ROOT, "approvals");
}

export function workflowEventsPath(): string {
  return path.join(ROOT, "events", "ops.jsonl");
}

export function workflowLocksDir(): string {
  return path.join(ROOT, "locks");
}

export function saveWorkflowRun(run: WorkflowRun): string {
  const parsed = WorkflowRunSchema.parse(run);
  const filePath = path.join(workflowRunsDir(), `${parsed.id}.json`);
  writeJson(filePath, parsed);
  return filePath;
}

export function loadWorkflowRun(id: string): WorkflowRun | null {
  const raw = readJson(path.join(workflowRunsDir(), `${id}.json`));
  if (!raw) return null;
  return WorkflowRunSchema.parse(raw);
}

export function listWorkflowRuns(): WorkflowRun[] {
  const dir = workflowRunsDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => WorkflowRunSchema.parse(readJson(path.join(dir, f))))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function saveApproval(record: ApprovalRecord): string {
  const parsed = ApprovalRecordSchema.parse(record);
  const filePath = path.join(workflowApprovalsDir(), `${parsed.id}.json`);
  writeJson(filePath, parsed);
  return filePath;
}

export function loadApproval(id: string): ApprovalRecord | null {
  const raw = readJson(path.join(workflowApprovalsDir(), `${id}.json`));
  if (!raw) return null;
  return ApprovalRecordSchema.parse(raw);
}

export function listApprovals(): ApprovalRecord[] {
  const dir = workflowApprovalsDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ApprovalRecordSchema.parse(readJson(path.join(dir, f))))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function appendWorkflowEvent(
  event: string,
  payload: Record<string, unknown>,
): void {
  const filePath = workflowEventsPath();
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(
    filePath,
    `${JSON.stringify({ event, at: new Date().toISOString(), ...payload })}\n`,
    "utf8",
  );
}

/** Lightweight logical lock for a canonical target. */
export function acquireTargetLock(
  targetKey: string,
  runId: string,
): { ok: boolean; holder?: string } {
  ensureDir(workflowLocksDir());
  const filePath = path.join(
    workflowLocksDir(),
    `${targetKey.replace(/[^a-z0-9_-]/gi, "_")}.json`,
  );
  if (fs.existsSync(filePath)) {
    const existing = readJson(filePath) as { runId: string } | null;
    if (existing && existing.runId !== runId) {
      const holderRun = loadWorkflowRun(existing.runId);
      if (
        holderRun &&
        !["completed", "completed-with-warnings", "failed", "cancelled", "superseded"].includes(
          holderRun.status,
        )
      ) {
        return { ok: false, holder: existing.runId };
      }
      // Stale lock from terminal/missing run — overwrite
    }
  }
  writeJson(filePath, { runId, targetKey, at: new Date().toISOString() });
  return { ok: true };
}

export function releaseTargetLock(targetKey: string, runId: string): void {
  const filePath = path.join(
    workflowLocksDir(),
    `${targetKey.replace(/[^a-z0-9_-]/gi, "_")}.json`,
  );
  if (!fs.existsSync(filePath)) return;
  const existing = readJson(filePath) as { runId: string } | null;
  if (existing?.runId === runId) {
    fs.unlinkSync(filePath);
  }
}
