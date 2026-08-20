import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import {
  ContentQueueItemSchema,
  SearchSnapshotMetaSchema,
  SearchSnapshotSchema,
  SeoExperimentSchema,
  SeoOpportunitySchema,
  type ContentQueueItem,
  type SearchSnapshot,
  type SearchSnapshotMeta,
  type SeoExperiment,
  type SeoOpportunity,
} from "@/domain";

function seoRoot(): string {
  return (
    process.env.SG_SEO_ROOT ?? path.join(process.cwd(), "src/data/seo")
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

function safeFileToken(id: string): string {
  return id.replace(/[^a-zA-Z0-9._-]+/g, "__");
}

export function getSeoRoot(): string {
  return seoRoot();
}

export function fixturesDir(): string {
  // Fixtures stay in-repo by default so SG_SEO_ROOT can point at a temp
  // writable tree for snapshots/opportunities without hiding synthetic data.
  return (
    process.env.SG_SEO_FIXTURES ??
    path.join(process.cwd(), "src/data/seo/fixtures")
  );
}

export function buildSnapshotId(
  source: string,
  rangeLabel: string,
  dataThroughDate: string,
): string {
  return `${source}-${rangeLabel}-${dataThroughDate}`;
}

export function loadFixtureSnapshot(name: string): SearchSnapshot {
  const filePath = path.join(fixturesDir(), name);
  const raw = readJsonFile(filePath);
  if (!raw) {
    throw new Error(`Missing SEO fixture: ${name}`);
  }
  return SearchSnapshotSchema.parse(raw);
}

export function saveSnapshot(snapshot: SearchSnapshot): SearchSnapshotMeta {
  const parsed = SearchSnapshotSchema.parse(snapshot);
  const id = buildSnapshotId(
    parsed.meta.source,
    parsed.meta.rangeLabel,
    parsed.meta.dataThroughDate,
  );
  const meta = SearchSnapshotMetaSchema.parse({ ...parsed.meta, id });
  writeJson(path.join(seoRoot(), "snapshots", `${safeFileToken(id)}.json`), {
    ...parsed,
    meta,
  });
  return meta;
}

export function loadSnapshot(id: string): SearchSnapshot | null {
  const raw = readJsonFile(
    path.join(seoRoot(), "snapshots", `${safeFileToken(id)}.json`),
  );
  if (!raw) return null;
  return SearchSnapshotSchema.parse(raw);
}

export function listSnapshots(): SearchSnapshotMeta[] {
  const dir = path.join(seoRoot(), "snapshots");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const snap = SearchSnapshotSchema.parse(
        readJsonFile(path.join(dir, f)),
      );
      return snap.meta;
    });
}

/** Newest snapshot by dataThroughDate (then retrievedAt). */
export function loadLatestSnapshot(opts?: {
  preferLive?: boolean;
  allowSynthetic?: boolean;
}): SearchSnapshot | null {
  const dir = path.join(seoRoot(), "snapshots");
  if (!existsSync(dir)) return null;
  const snaps = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      SearchSnapshotSchema.parse(readJsonFile(path.join(dir, f))),
    )
    .filter((s) => {
      if (opts?.preferLive) {
        return !s.synthetic && (s.meta.source === "gsc" || s.meta.source === "import");
      }
      if (opts?.allowSynthetic === false && s.synthetic) return false;
      return true;
    })
    .sort((a, b) => {
      const d = b.meta.dataThroughDate.localeCompare(a.meta.dataThroughDate);
      if (d !== 0) return d;
      return b.meta.retrievedAt.localeCompare(a.meta.retrievedAt);
    });
  return snaps[0] ?? null;
}

/** Second-newest period for decay/growth compare (same source preference). */
export function loadPreviousSnapshot(
  current: SearchSnapshot,
  opts?: { preferLive?: boolean; allowSynthetic?: boolean },
): SearchSnapshot | null {
  const dir = path.join(seoRoot(), "snapshots");
  if (!existsSync(dir)) return null;
  const snaps = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      SearchSnapshotSchema.parse(readJsonFile(path.join(dir, f))),
    )
    .filter((s) => {
      if (s.meta.id === current.meta.id) return false;
      if (opts?.preferLive) {
        return !s.synthetic && (s.meta.source === "gsc" || s.meta.source === "import");
      }
      if (opts?.allowSynthetic === false && s.synthetic) return false;
      return s.synthetic === current.synthetic;
    })
    .sort((a, b) => b.meta.dataThroughDate.localeCompare(a.meta.dataThroughDate));
  return snaps[0] ?? null;
}

export function saveOpportunity(opportunity: SeoOpportunity): void {
  const parsed = SeoOpportunitySchema.parse(opportunity);
  writeJson(
    path.join(seoRoot(), "opportunities", `${safeFileToken(parsed.id)}.json`),
    parsed,
  );
}

export function loadOpportunity(id: string): SeoOpportunity | null {
  const raw = readJsonFile(
    path.join(seoRoot(), "opportunities", `${safeFileToken(id)}.json`),
  );
  if (!raw) return null;
  return SeoOpportunitySchema.parse(raw);
}

export function listOpportunities(): SeoOpportunity[] {
  const dir = path.join(seoRoot(), "opportunities");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      SeoOpportunitySchema.parse(readJsonFile(path.join(dir, f))),
    );
}

export function upsertOpportunity(opportunity: SeoOpportunity): SeoOpportunity {
  const existing = loadOpportunity(opportunity.id);
  const merged = SeoOpportunitySchema.parse({
    ...opportunity,
    detectedAt: existing?.detectedAt ?? opportunity.detectedAt,
    lastDetectedAt: opportunity.lastDetectedAt ?? opportunity.detectedAt,
    status: existing?.status === "dismissed" ? existing.status : opportunity.status,
    dismissedReason: existing?.dismissedReason,
  });
  saveOpportunity(merged);
  return merged;
}

export function saveExperiment(experiment: SeoExperiment): void {
  const parsed = SeoExperimentSchema.parse(experiment);
  writeJson(
    path.join(seoRoot(), "experiments", `${safeFileToken(parsed.id)}.json`),
    parsed,
  );
}

export function loadExperiment(id: string): SeoExperiment | null {
  const raw = readJsonFile(
    path.join(seoRoot(), "experiments", `${safeFileToken(id)}.json`),
  );
  if (!raw) return null;
  return SeoExperimentSchema.parse(raw);
}

export function listExperiments(): SeoExperiment[] {
  const dir = path.join(seoRoot(), "experiments");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      SeoExperimentSchema.parse(readJsonFile(path.join(dir, f))),
    );
}

export function saveQueueItem(item: ContentQueueItem): void {
  const parsed = ContentQueueItemSchema.parse(item);
  writeJson(
    path.join(seoRoot(), "queue", `${safeFileToken(parsed.id)}.json`),
    parsed,
  );
}

export function loadQueueItem(id: string): ContentQueueItem | null {
  const raw = readJsonFile(
    path.join(seoRoot(), "queue", `${safeFileToken(id)}.json`),
  );
  if (!raw) return null;
  return ContentQueueItemSchema.parse(raw);
}

export function listQueueItems(): ContentQueueItem[] {
  const dir = path.join(seoRoot(), "queue");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      ContentQueueItemSchema.parse(readJsonFile(path.join(dir, f))),
    );
}
