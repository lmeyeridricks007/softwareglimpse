import {
  existsSync,
  mkdirSync,
  appendFileSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import {
  AuditEventSchema,
  ChangeEventSchema,
  ContentIdSchema,
  ContentVersionSchema,
  PublishJobSchema,
  RefreshCandidateSchema,
  ScheduleRecordSchema,
  contentIdToFileToken,
  type AuditEvent,
  type ChangeEvent,
  type ContentId,
  type ContentVersion,
  type PublishJob,
  type RefreshCandidate,
  type ScheduleRecord,
} from "@/domain";

function publishingRoot(): string {
  return (
    process.env.SG_PUBLISHING_ROOT ??
    path.join(process.cwd(), "src/data/publishing")
  );
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

function schedulePath(contentId: ContentId | string): string {
  const token = contentIdToFileToken(ContentIdSchema.parse(contentId));
  return path.join(publishingRoot(), "schedules", `${token}.json`);
}

function versionDir(contentId: ContentId | string): string {
  const token = contentIdToFileToken(ContentIdSchema.parse(contentId));
  return path.join(publishingRoot(), "versions", token);
}

function versionPath(contentId: ContentId | string, version: number): string {
  return path.join(versionDir(contentId), `${version}.json`);
}

function jobPath(id: string): string {
  return path.join(publishingRoot(), "jobs", `${id}.json`);
}

function refreshPath(contentId: ContentId | string): string {
  const token = contentIdToFileToken(ContentIdSchema.parse(contentId));
  return path.join(publishingRoot(), "refresh", `${token}.json`);
}

function changeEventsPath(): string {
  return path.join(publishingRoot(), "events", "change-events.jsonl");
}

function auditPath(contentId: ContentId | string): string {
  const token = contentIdToFileToken(ContentIdSchema.parse(contentId));
  return path.join(publishingRoot(), "audit", `${token}.jsonl`);
}

export function getPublishingRoot(): string {
  return publishingRoot();
}

export function loadSchedule(
  contentId: ContentId | string,
): ScheduleRecord | null {
  const raw = readJsonFile(schedulePath(contentId));
  if (!raw) return null;
  return ScheduleRecordSchema.parse(raw);
}

export function saveSchedule(record: ScheduleRecord): void {
  const parsed = ScheduleRecordSchema.parse(record);
  writeJson(schedulePath(parsed.contentId), parsed);
}

export function deleteSchedule(contentId: ContentId | string): void {
  const filePath = schedulePath(contentId);
  if (existsSync(filePath)) {
    writeJson(filePath, { deleted: true, contentId });
  }
}

export function listDueSchedules(now: Date = new Date()): ScheduleRecord[] {
  const dir = path.join(publishingRoot(), "schedules");
  if (!existsSync(dir)) return [];
  const due: ScheduleRecord[] = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const raw = readJsonFile(path.join(dir, file));
    if (!raw || typeof raw !== "object") continue;
    if ("deleted" in (raw as object)) continue;
    const record = ScheduleRecordSchema.parse(raw);
    const scheduled = Date.parse(record.scheduledAt);
    if (!Number.isNaN(scheduled) && scheduled <= now.getTime()) {
      due.push(record);
    }
  }
  return due;
}

/**
 * Load a content version. Published version bodies are immutable —
 * callers must create a new version rather than overwrite.
 */
export function loadVersion(
  contentId: ContentId | string,
  version: number,
): ContentVersion | null {
  const raw = readJsonFile(versionPath(contentId, version));
  if (!raw) return null;
  return ContentVersionSchema.parse(raw);
}

/**
 * Save a version. Refuses to overwrite an existing published version body.
 */
export function saveVersion(version: ContentVersion): void {
  const parsed = ContentVersionSchema.parse(version);
  const existing = loadVersion(parsed.contentId, parsed.version);
  if (existing?.status === "published") {
    throw new Error(
      `Refusing to overwrite published version ${parsed.version} for ${parsed.contentId}`,
    );
  }
  writeJson(versionPath(parsed.contentId, parsed.version), parsed);
}

export function listVersions(
  contentId: ContentId | string,
): ContentVersion[] {
  const dir = versionDir(contentId);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ContentVersionSchema.parse(readJsonFile(path.join(dir, f))))
    .sort((a, b) => a.version - b.version);
}

export function appendChangeEvent(event: ChangeEvent): void {
  const parsed = ChangeEventSchema.parse(event);
  const filePath = changeEventsPath();
  ensureDir(path.dirname(filePath));
  appendFileSync(filePath, `${JSON.stringify(parsed)}\n`, "utf8");
}

export function listChangeEvents(): ChangeEvent[] {
  const filePath = changeEventsPath();
  if (!existsSync(filePath)) return [];
  return readFileSync(filePath, "utf8")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => ChangeEventSchema.parse(JSON.parse(line)));
}

export function appendAuditEvent(event: AuditEvent): void {
  const parsed = AuditEventSchema.parse(event);
  const filePath = auditPath(parsed.contentId);
  ensureDir(path.dirname(filePath));
  appendFileSync(filePath, `${JSON.stringify(parsed)}\n`, "utf8");
}

export function listAuditEvents(
  contentId: ContentId | string,
): AuditEvent[] {
  const filePath = auditPath(contentId);
  if (!existsSync(filePath)) return [];
  return readFileSync(filePath, "utf8")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => AuditEventSchema.parse(JSON.parse(line)));
}

export function saveJob(job: PublishJob): void {
  const parsed = PublishJobSchema.parse(job);
  writeJson(jobPath(parsed.id), parsed);
}

export function loadJob(id: string): PublishJob | null {
  const raw = readJsonFile(jobPath(id));
  if (!raw) return null;
  return PublishJobSchema.parse(raw);
}

export function getRefreshState(
  contentId: ContentId | string,
): RefreshCandidate | null {
  const raw = readJsonFile(refreshPath(contentId));
  if (!raw) return null;
  return RefreshCandidateSchema.parse(raw);
}

export function setRefreshState(candidate: RefreshCandidate): void {
  const parsed = RefreshCandidateSchema.parse(candidate);
  writeJson(refreshPath(parsed.contentId), parsed);
}

export function fixturesDir(): string {
  return path.join(
    process.env.SG_PUBLISHING_FIXTURES ??
      path.join(process.cwd(), "src/data/publishing/fixtures"),
  );
}

export function loadFixtureJson<T = unknown>(name: string): T {
  const filePath = path.join(fixturesDir(), name);
  const raw = readJsonFile(filePath);
  if (!raw) {
    throw new Error(`Missing publishing fixture: ${name}`);
  }
  return raw as T;
}
