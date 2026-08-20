import fs from "node:fs";
import path from "node:path";
import {
  SoftwareOnboardingRunSchema,
  SoftwareSchema,
  type Software,
  type SoftwareOnboardingRun,
} from "@/domain";

function projectRoot(): string {
  return process.cwd();
}

export function getOnboardingRoot(): string {
  return path.join(projectRoot(), "src/data/onboarding");
}

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

function readJsonFile(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJsonFile(filePath: string, data: unknown): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function runsDir(): string {
  return path.join(getOnboardingRoot(), "runs");
}

export function candidatesDir(): string {
  return path.join(getOnboardingRoot(), "candidates");
}

export function manifestsDir(): string {
  return path.join(getOnboardingRoot(), "manifests");
}

export function runFilePath(runId: string): string {
  return path.join(runsDir(), `${runId}.json`);
}

export function candidateFilePath(slug: string): string {
  return path.join(candidatesDir(), `${slug}.json`);
}

export function manifestFilePath(slug: string): string {
  return path.join(manifestsDir(), `${slug}.json`);
}

export function saveOnboardingRun(run: SoftwareOnboardingRun): void {
  const parsed = SoftwareOnboardingRunSchema.parse(run);
  writeJsonFile(runFilePath(parsed.id), parsed);
}

export function loadOnboardingRun(runId: string): SoftwareOnboardingRun | null {
  const file = runFilePath(runId);
  if (!fs.existsSync(file)) return null;
  return SoftwareOnboardingRunSchema.parse(readJsonFile(file));
}

export function listOnboardingRuns(): SoftwareOnboardingRun[] {
  const dir = runsDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      SoftwareOnboardingRunSchema.parse(readJsonFile(path.join(dir, f))),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function findLatestRunForSlug(
  slug: string,
): SoftwareOnboardingRun | null {
  const runs = listOnboardingRuns().filter((r) => r.productSlug === slug);
  return runs[0] ?? null;
}

export function saveCandidateSoftware(software: Software): void {
  const parsed = SoftwareSchema.parse(software);
  writeJsonFile(candidateFilePath(parsed.slug), parsed);
}

export function loadCandidateSoftware(slug: string): Software | null {
  const file = candidateFilePath(slug);
  if (!fs.existsSync(file)) return null;
  return SoftwareSchema.parse(readJsonFile(file));
}

export function listCandidateSoftware(): Software[] {
  const dir = candidatesDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => SoftwareSchema.parse(readJsonFile(path.join(dir, f))));
}

export function deleteCandidateSoftware(slug: string): void {
  const file = candidateFilePath(slug);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

export type OnboardingManifest = {
  productSlug: string;
  latestRunId?: string;
  status?: string;
  firstOnboardedAt?: string;
  lastReconciledAt?: string;
  lastResearchRunAt?: string;
  contentTasksCreated: number;
  notes: string[];
};

export function saveManifest(manifest: OnboardingManifest): void {
  writeJsonFile(manifestFilePath(manifest.productSlug), manifest);
}

export function loadManifest(slug: string): OnboardingManifest | null {
  const file = manifestFilePath(slug);
  if (!fs.existsSync(file)) return null;
  return readJsonFile(file) as OnboardingManifest;
}

export function listManifests(): OnboardingManifest[] {
  const dir = manifestsDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJsonFile(path.join(dir, f)) as OnboardingManifest);
}
