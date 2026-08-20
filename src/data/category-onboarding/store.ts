import fs from "node:fs";
import path from "node:path";
import {
  CategoryDefinitionSchema,
  CategoryOnboardingRunSchema,
  type CategoryDefinition,
  type CategoryOnboardingRun,
} from "@/domain";

function projectRoot(): string {
  return process.cwd();
}

export function getCategoryOnboardingRoot(): string {
  return path.join(projectRoot(), "src/data/category-onboarding");
}

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath: string, data: unknown): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function runsDir(): string {
  return path.join(getCategoryOnboardingRoot(), "runs");
}

export function activatedDir(): string {
  return path.join(getCategoryOnboardingRoot(), "activated");
}

export function saveCategoryOnboardingRun(run: CategoryOnboardingRun): void {
  const parsed = CategoryOnboardingRunSchema.parse(run);
  writeJson(path.join(runsDir(), `${parsed.id}.json`), parsed);
}

export function loadCategoryOnboardingRun(
  runId: string,
): CategoryOnboardingRun | null {
  const file = path.join(runsDir(), `${runId}.json`);
  if (!fs.existsSync(file)) return null;
  return CategoryOnboardingRunSchema.parse(readJson(file));
}

export function listCategoryOnboardingRuns(): CategoryOnboardingRun[] {
  const dir = runsDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      CategoryOnboardingRunSchema.parse(readJson(path.join(dir, f))),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function findLatestCategoryRun(
  slug: string,
): CategoryOnboardingRun | null {
  return (
    listCategoryOnboardingRuns().find((r) => r.categorySlug === slug) ?? null
  );
}

export type ActivatedCategoryRecord = {
  slug: string;
  activatedAt: string;
  configVersion: string;
  definition: CategoryDefinition;
};

export function activateCategoryDefinition(
  definition: CategoryDefinition,
  activatedAt = new Date().toISOString(),
): ActivatedCategoryRecord {
  const record: ActivatedCategoryRecord = {
    slug: definition.slug,
    activatedAt,
    configVersion: definition.configVersion,
    definition: CategoryDefinitionSchema.parse({
      ...definition,
      lifecycle: "active",
    }),
  };
  writeJson(path.join(activatedDir(), `${definition.slug}.json`), record);
  return record;
}

export function loadActivatedCategory(
  slug: string,
): ActivatedCategoryRecord | null {
  const file = path.join(activatedDir(), `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  const raw = readJson(file) as ActivatedCategoryRecord;
  return {
    ...raw,
    definition: CategoryDefinitionSchema.parse(raw.definition),
  };
}

export function listActivatedCategories(): ActivatedCategoryRecord[] {
  const dir = activatedDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = readJson(path.join(dir, f)) as ActivatedCategoryRecord;
      return {
        ...raw,
        definition: CategoryDefinitionSchema.parse(raw.definition),
      };
    });
}

export function isCategoryActivated(slug: string): boolean {
  return loadActivatedCategory(slug) !== null;
}
