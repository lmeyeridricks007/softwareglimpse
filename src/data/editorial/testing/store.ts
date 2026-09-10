import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import {
  ProductTestEvidenceSchema,
  ProductTestSessionSchema,
  type ProductTestEvidence,
  type ProductTestSession,
} from "@/domain";

const TESTING_ROOT = path.join(
  process.cwd(),
  "src/data/editorial/testing",
);

function sessionsDir(): string {
  return path.join(TESTING_ROOT, "sessions");
}

function evidenceDir(): string {
  return path.join(TESTING_ROOT, "evidence");
}

function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
}

function writeJson(filePath: string, data: unknown): void {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function readJsonFile(filePath: string): unknown | null {
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf8")) as unknown;
}

function sessionPath(sessionId: string): string {
  return path.join(sessionsDir(), `${sessionId}.json`);
}

function evidencePath(evidenceId: string): string {
  return path.join(evidenceDir(), `${evidenceId}.json`);
}

export function loadTestSession(
  sessionId: string,
): ProductTestSession | null {
  const raw = readJsonFile(sessionPath(sessionId));
  if (!raw) return null;
  return ProductTestSessionSchema.parse(raw);
}

export function saveTestSession(session: ProductTestSession): void {
  const parsed = ProductTestSessionSchema.parse(session);
  writeJson(sessionPath(parsed.id), parsed);
}

export function listTestSessions(): ProductTestSession[] {
  const dir = sessionsDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = readJsonFile(path.join(dir, f));
      return raw ? ProductTestSessionSchema.parse(raw) : null;
    })
    .filter((s): s is ProductTestSession => s != null)
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
}

export function listTestSessionsForProduct(
  productSlug: string,
): ProductTestSession[] {
  return listTestSessions().filter((s) => s.productSlug === productSlug);
}

export function loadTestEvidence(
  evidenceId: string,
): ProductTestEvidence | null {
  const raw = readJsonFile(evidencePath(evidenceId));
  if (!raw) return null;
  return ProductTestEvidenceSchema.parse(raw);
}

export function saveTestEvidence(evidence: ProductTestEvidence): void {
  const parsed = ProductTestEvidenceSchema.parse(evidence);
  writeJson(evidencePath(parsed.id), parsed);
}

export function listTestEvidence(): ProductTestEvidence[] {
  const dir = evidenceDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = readJsonFile(path.join(dir, f));
      return raw ? ProductTestEvidenceSchema.parse(raw) : null;
    })
    .filter((e): e is ProductTestEvidence => e != null);
}

export function listTestEvidenceForSession(
  sessionId: string,
): ProductTestEvidence[] {
  return listTestEvidence().filter((e) => e.sessionId === sessionId);
}

export function listTestEvidenceForProduct(
  productSlug: string,
): ProductTestEvidence[] {
  return listTestEvidence().filter((e) => e.productSlug === productSlug);
}

/** Empty placeholder so the directory is tracked when no sessions exist yet. */
export function ensureTestingStoreDirs(): void {
  ensureDir(sessionsDir());
  ensureDir(evidenceDir());
}
