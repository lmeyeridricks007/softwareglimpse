import fs from "node:fs";
import path from "node:path";
import type {
  ApprovedAssetCandidate,
  AssetPlacementRecommendation,
} from "@/domain/schemas/approved-asset-workflow";
import {
  ApprovedAssetCandidateSchema,
  AssetPlacementRecommendationSchema,
} from "@/domain/schemas/approved-asset-workflow";

const ROOT = path.join(process.cwd(), "data", "content-assets");
const CANDIDATES_DIR = path.join(ROOT, "approval-queue");
const PLACEMENTS_DIR = path.join(ROOT, "placements");

function ensureDirs(): void {
  fs.mkdirSync(CANDIDATES_DIR, { recursive: true });
  fs.mkdirSync(PLACEMENTS_DIR, { recursive: true });
}

function candidatePath(id: string): string {
  const safe = id.replace(/[^a-zA-Z0-9._-]/g, "-");
  return path.join(CANDIDATES_DIR, `${safe}.json`);
}

function placementPath(id: string): string {
  const safe = id.replace(/[^a-zA-Z0-9._-]/g, "-");
  return path.join(PLACEMENTS_DIR, `${safe}.json`);
}

export function saveApprovedAssetCandidate(
  candidate: ApprovedAssetCandidate,
): string {
  ensureDirs();
  const parsed = ApprovedAssetCandidateSchema.parse(candidate);
  const full = candidatePath(parsed.id);
  fs.writeFileSync(full, JSON.stringify(parsed, null, 2) + "\n", "utf8");
  return full;
}

export function loadApprovedAssetCandidate(
  id: string,
): ApprovedAssetCandidate | null {
  const full = candidatePath(id);
  if (!fs.existsSync(full)) return null;
  return ApprovedAssetCandidateSchema.parse(
    JSON.parse(fs.readFileSync(full, "utf8")),
  );
}

export function listApprovedAssetCandidates(): ApprovedAssetCandidate[] {
  ensureDirs();
  const files = fs
    .readdirSync(CANDIDATES_DIR)
    .filter((f) => f.endsWith(".json"));
  return files
    .map((f) => {
      const raw = JSON.parse(
        fs.readFileSync(path.join(CANDIDATES_DIR, f), "utf8"),
      );
      return ApprovedAssetCandidateSchema.parse(raw);
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function savePlacementRecommendation(
  placement: AssetPlacementRecommendation,
): string {
  ensureDirs();
  const parsed = AssetPlacementRecommendationSchema.parse(placement);
  const full = placementPath(parsed.id);
  fs.writeFileSync(full, JSON.stringify(parsed, null, 2) + "\n", "utf8");
  return full;
}

export function loadPlacementRecommendation(
  id: string,
): AssetPlacementRecommendation | null {
  const full = placementPath(id);
  if (!fs.existsSync(full)) return null;
  return AssetPlacementRecommendationSchema.parse(
    JSON.parse(fs.readFileSync(full, "utf8")),
  );
}

export function listPlacementRecommendations(opts?: {
  candidateId?: string;
  mediaId?: string;
}): AssetPlacementRecommendation[] {
  ensureDirs();
  const files = fs
    .readdirSync(PLACEMENTS_DIR)
    .filter((f) => f.endsWith(".json"));
  let items = files.map((f) =>
    AssetPlacementRecommendationSchema.parse(
      JSON.parse(fs.readFileSync(path.join(PLACEMENTS_DIR, f), "utf8")),
    ),
  );
  if (opts?.candidateId) {
    items = items.filter((p) => p.candidateId === opts.candidateId);
  }
  if (opts?.mediaId) {
    items = items.filter((p) => p.mediaId === opts.mediaId);
  }
  return items;
}

export function getApprovalQueueDir(): string {
  return CANDIDATES_DIR;
}

export function getPlacementsDir(): string {
  return PLACEMENTS_DIR;
}
