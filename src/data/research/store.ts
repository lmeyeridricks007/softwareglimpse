import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  FactConflictSchema,
  ProductResearchEnrichmentSchema,
  ResearchFactSchema,
  ResearchJobSchema,
  ResearchSnapshotSchema,
  ResearchSourceSchema,
  type FactConflict,
  type ProductResearchEnrichment,
  type ResearchFact,
  type ResearchJob,
  type ResearchSnapshot,
  type ResearchSource,
} from "@/domain";

const RESEARCH_ROOT = path.join(process.cwd(), "src/data/research");

export function getResearchProductDir(productSlug: string): string {
  return path.join(RESEARCH_ROOT, productSlug);
}

function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
}

function readJsonArray<T>(
  filePath: string,
  parse: (item: unknown) => T,
): T[] {
  if (!existsSync(filePath)) return [];
  let rawText: string;
  try {
    rawText = readFileSync(filePath, "utf8");
  } catch {
    return [];
  }
  let raw: unknown;
  try {
    raw = JSON.parse(rawText) as unknown;
  } catch (error) {
    console.error(`[research] Invalid JSON in ${filePath}:`, error);
    return [];
  }
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => parse(item));
}

function writeJson(filePath: string, data: unknown): void {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function listResearchProducts(): string[] {
  if (!existsSync(RESEARCH_ROOT)) return [];
  return readdirSync(RESEARCH_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export function loadManualSources(productSlug: string): ResearchSource[] {
  const sources = readJsonArray(
    path.join(getResearchProductDir(productSlug), "sources.json"),
    (item) => ResearchSourceSchema.parse(item),
  );
  const seen = new Set<string>();
  return sources.filter((source) => {
    if (seen.has(source.id)) return false;
    seen.add(source.id);
    return true;
  });
}

export function saveManualSources(
  productSlug: string,
  sources: ResearchSource[],
): void {
  const seen = new Set<string>();
  const unique = sources.filter((source) => {
    if (seen.has(source.id)) return false;
    seen.add(source.id);
    return true;
  });
  writeJson(
    path.join(getResearchProductDir(productSlug), "sources.json"),
    unique,
  );
}

export function loadFixtureText(
  productSlug: string,
  sourceId: string,
): string | null {
  const filePath = path.join(
    getResearchProductDir(productSlug),
    "fixtures",
    `${sourceId}.txt`,
  );
  if (!existsSync(filePath)) return null;
  return readFileSync(filePath, "utf8");
}

export function loadSnapshots(productSlug: string): ResearchSnapshot[] {
  return readJsonArray(
    path.join(getResearchProductDir(productSlug), "snapshots.json"),
    (item) => ResearchSnapshotSchema.parse(item),
  );
}

export function saveSnapshots(
  productSlug: string,
  snapshots: ResearchSnapshot[],
): void {
  const sourceIds = new Set(
    loadManualSources(productSlug).map((source) => source.id),
  );
  const kept = snapshots.filter((snapshot) => sourceIds.has(snapshot.sourceId));
  writeJson(
    path.join(getResearchProductDir(productSlug), "snapshots.json"),
    kept,
  );
}

export function loadFacts(productSlug: string): ResearchFact[] {
  return readJsonArray(
    path.join(getResearchProductDir(productSlug), "facts.json"),
    (item) => ResearchFactSchema.parse(item),
  );
}

export function saveFacts(productSlug: string, facts: ResearchFact[]): void {
  writeJson(path.join(getResearchProductDir(productSlug), "facts.json"), facts);
}

export function loadConflicts(productSlug: string): FactConflict[] {
  return readJsonArray(
    path.join(getResearchProductDir(productSlug), "conflicts.json"),
    (item) => FactConflictSchema.parse(item),
  );
}

export function saveConflicts(
  productSlug: string,
  conflicts: FactConflict[],
): void {
  writeJson(
    path.join(getResearchProductDir(productSlug), "conflicts.json"),
    conflicts,
  );
}

export function loadJobs(productSlug: string): ResearchJob[] {
  return readJsonArray(
    path.join(getResearchProductDir(productSlug), "jobs.json"),
    (item) => ResearchJobSchema.parse(item),
  );
}

export function saveJobs(productSlug: string, jobs: ResearchJob[]): void {
  writeJson(path.join(getResearchProductDir(productSlug), "jobs.json"), jobs);
}

export function loadEnrichment(
  productSlug: string,
): ProductResearchEnrichment | null {
  const filePath = path.join(
    getResearchProductDir(productSlug),
    "enrichment.json",
  );
  if (!existsSync(filePath)) return null;
  try {
    return ProductResearchEnrichmentSchema.parse(
      JSON.parse(readFileSync(filePath, "utf8")),
    );
  } catch (error) {
    console.error(
      `[research] Failed to load enrichment for ${productSlug}:`,
      error,
    );
    return null;
  }
}

export function saveEnrichment(
  productSlug: string,
  enrichment: ProductResearchEnrichment,
): void {
  writeJson(
    path.join(getResearchProductDir(productSlug), "enrichment.json"),
    enrichment,
  );
}

export function loadAllSources(): ResearchSource[] {
  return listResearchProducts().flatMap((slug) => loadManualSources(slug));
}
