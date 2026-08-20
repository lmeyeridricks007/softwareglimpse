import fs from "node:fs";
import path from "node:path";
import {
  AgentDraftBundleSchema,
  AgentExecutionResultSchema,
  AgentRevisionRecordSchema,
  type AgentDraftBundle,
  type AgentExecutionResult,
  type AgentRevisionRecord,
} from "@/domain";

const AGENTS_ROOT = path.join(process.cwd(), "src/data/agents");

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

export function agentRunsDir(): string {
  return path.join(AGENTS_ROOT, "runs");
}

export function agentDraftsDir(): string {
  return path.join(AGENTS_ROOT, "drafts");
}

export function agentRevisionsDir(): string {
  return path.join(AGENTS_ROOT, "revisions");
}

export function agentEventsPath(): string {
  return path.join(AGENTS_ROOT, "events", "ops.jsonl");
}

export function saveAgentExecution(result: AgentExecutionResult): string {
  const parsed = AgentExecutionResultSchema.parse(result);
  const filePath = path.join(agentRunsDir(), `${parsed.id}.json`);
  writeJson(filePath, parsed);
  return filePath;
}

export function loadAgentExecution(id: string): AgentExecutionResult | null {
  const raw = readJson(path.join(agentRunsDir(), `${id}.json`));
  if (!raw) return null;
  return AgentExecutionResultSchema.parse(raw);
}

export function listAgentExecutions(): AgentExecutionResult[] {
  const dir = agentRunsDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      AgentExecutionResultSchema.parse(
        readJson(path.join(dir, f)),
      ),
    )
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export function saveAgentDraftBundle(bundle: AgentDraftBundle): string {
  const parsed = AgentDraftBundleSchema.parse(bundle);
  const filePath = path.join(
    agentDraftsDir(),
    parsed.draft.pageType,
    parsed.draft.targetSlug,
    `${parsed.draft.id}.json`,
  );
  writeJson(filePath, parsed);
  return filePath;
}

export function loadAgentDraftBundle(draftId: string): AgentDraftBundle | null {
  const dir = agentDraftsDir();
  if (!fs.existsSync(dir)) return null;
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop()!;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (entry.name === `${draftId}.json`) {
        return AgentDraftBundleSchema.parse(readJson(full));
      }
    }
  }
  return null;
}

export function saveAgentRevision(record: AgentRevisionRecord): string {
  const parsed = AgentRevisionRecordSchema.parse(record);
  const filePath = path.join(agentRevisionsDir(), `${parsed.id}.json`);
  writeJson(filePath, parsed);
  return filePath;
}

export function appendAgentEvent(
  event: string,
  payload: Record<string, unknown>,
): void {
  const filePath = agentEventsPath();
  ensureDir(path.dirname(filePath));
  const line = JSON.stringify({
    event,
    at: new Date().toISOString(),
    ...payload,
  });
  fs.appendFileSync(filePath, `${line}\n`, "utf8");
}
