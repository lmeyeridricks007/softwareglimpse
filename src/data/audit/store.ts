import fs from "node:fs";
import path from "node:path";
import {
  AuditIssueSchema,
  AuditResultSchema,
  AuditSnapshotSchema,
  type AuditIssue,
  type AuditResult,
  type AuditSnapshot,
} from "@/domain";

const ROOT = path.join(process.cwd(), "src/data/audit");

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

export function auditResultsDir(): string {
  return path.join(ROOT, "state", "results");
}

export function auditIssuesPath(): string {
  return path.join(ROOT, "state", "issues.json");
}

export function auditSnapshotsDir(): string {
  return path.join(ROOT, "snapshots");
}

export function auditReportsDir(): string {
  return path.join(process.cwd(), "reports", "audits");
}

export function saveAuditResult(result: AuditResult): void {
  const parsed = AuditResultSchema.parse(result);
  writeJson(path.join(auditResultsDir(), `${parsed.id}.json`), parsed);
}

export function loadAuditResult(id: string): AuditResult | null {
  const raw = readJson(path.join(auditResultsDir(), `${id}.json`));
  if (!raw) return null;
  return AuditResultSchema.parse(raw);
}

export function listAuditResults(): AuditResult[] {
  const dir = auditResultsDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => AuditResultSchema.parse(readJson(path.join(dir, f))))
    .sort((a, b) => b.auditedAt.localeCompare(a.auditedAt));
}

export function loadIssueLedger(): AuditIssue[] {
  const raw = readJson(auditIssuesPath());
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((i) => AuditIssueSchema.parse(i));
}

export function saveIssueLedger(issues: AuditIssue[]): void {
  writeJson(
    auditIssuesPath(),
    issues.map((i) => AuditIssueSchema.parse(i)),
  );
}

export function saveAuditSnapshot(snapshot: AuditSnapshot): void {
  const parsed = AuditSnapshotSchema.parse(snapshot);
  writeJson(path.join(auditSnapshotsDir(), `${parsed.id}.json`), parsed);
}

export function listAuditSnapshots(): AuditSnapshot[] {
  const dir = auditSnapshotsDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => AuditSnapshotSchema.parse(readJson(path.join(dir, f))))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function writeMarkdownReport(filename: string, markdown: string): string {
  const filePath = path.join(auditReportsDir(), filename);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, markdown.endsWith("\n") ? markdown : `${markdown}\n`);
  return filePath;
}
