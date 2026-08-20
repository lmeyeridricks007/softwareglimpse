import fs from "node:fs";
import path from "node:path";
import {
  CatalogueAliasMapEntrySchema,
  CatalogueOnboardingBatchSchema,
  CatalogueProcessingRecordSchema,
  type CatalogueAliasMapEntry,
  type CatalogueOnboardingBatch,
  type CatalogueProcessingRecord,
} from "@/domain";

const ROOT = path.join(process.cwd(), "src/data/catalogue");

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

export function catalogueProcessingDir(): string {
  return path.join(ROOT, "state", "processing");
}

export function catalogueBatchesDir(): string {
  return path.join(ROOT, "state", "batches");
}

export function catalogueAliasPath(): string {
  return path.join(ROOT, "state", "alias-map.json");
}

export function catalogueAuditPath(): string {
  return path.join(ROOT, "state", "audit.jsonl");
}

export function catalogueGapsPath(): string {
  return path.join(ROOT, "state", "category-gaps.json");
}

export function saveProcessingRecord(record: CatalogueProcessingRecord): void {
  const parsed = CatalogueProcessingRecordSchema.parse(record);
  writeJson(
    path.join(catalogueProcessingDir(), `${parsed.sourceId}.json`),
    parsed,
  );
}

export function loadProcessingRecord(
  sourceId: string,
): CatalogueProcessingRecord | null {
  const raw = readJson(path.join(catalogueProcessingDir(), `${sourceId}.json`));
  if (!raw) return null;
  return CatalogueProcessingRecordSchema.parse(raw);
}

export function listProcessingRecords(): CatalogueProcessingRecord[] {
  const dir = catalogueProcessingDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      CatalogueProcessingRecordSchema.parse(readJson(path.join(dir, f))),
    );
}

export function saveCatalogueBatch(batch: CatalogueOnboardingBatch): void {
  const parsed = CatalogueOnboardingBatchSchema.parse(batch);
  writeJson(path.join(catalogueBatchesDir(), `${parsed.id}.json`), parsed);
}

export function loadCatalogueBatch(
  batchId: string,
): CatalogueOnboardingBatch | null {
  const raw = readJson(path.join(catalogueBatchesDir(), `${batchId}.json`));
  if (!raw) return null;
  return CatalogueOnboardingBatchSchema.parse(raw);
}

export function listCatalogueBatches(): CatalogueOnboardingBatch[] {
  const dir = catalogueBatchesDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      CatalogueOnboardingBatchSchema.parse(readJson(path.join(dir, f))),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function loadAliasMap(): CatalogueAliasMapEntry[] {
  const raw = readJson(catalogueAliasPath());
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((e) => CatalogueAliasMapEntrySchema.parse(e));
}

export function saveAliasMap(entries: CatalogueAliasMapEntry[]): void {
  writeJson(
    catalogueAliasPath(),
    entries.map((e) => CatalogueAliasMapEntrySchema.parse(e)),
  );
}

export type CategoryGap = {
  categorySlug: string;
  catalogueProductCount: number;
  sourceIds: string[];
  status: "CATEGORY_NOT_READY" | "CATEGORY_UNKNOWN";
  notes: string[];
  updatedAt: string;
};

export function loadCategoryGaps(): CategoryGap[] {
  const raw = readJson(catalogueGapsPath());
  if (!raw || !Array.isArray(raw)) return [];
  return raw as CategoryGap[];
}

export function saveCategoryGaps(gaps: CategoryGap[]): void {
  writeJson(catalogueGapsPath(), gaps);
}

export function appendCatalogueAudit(
  event: string,
  payload: Record<string, unknown>,
): void {
  const filePath = catalogueAuditPath();
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(
    filePath,
    `${JSON.stringify({ event, at: new Date().toISOString(), ...payload })}\n`,
    "utf8",
  );
}
