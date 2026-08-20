import fs from "node:fs";
import path from "node:path";
import type { AssetOpportunityKind } from "./stable-ids";

export type AssetChangeKind =
  | "NEW"
  | "STILL OPEN"
  | "IMPLEMENTED"
  | "NO LONGER AVAILABLE"
  | "STALE"
  | "DISMISSED";

export type AssetOpportunitySnapshotItem = {
  id: string;
  pageRoute: string;
  page: string;
  kind: AssetOpportunityKind;
  asset: string;
  priority?: string;
  sourceUrl?: string;
  providerId?: string;
  statusHint?: string;
  relatedCqIds?: string[];
  mapNodeId?: string;
};

export type AssetIntelligenceSnapshot = {
  generatedAt: string;
  mode: "LIGHT" | "FULL" | "DEEP";
  scope: string;
  opportunities: AssetOpportunitySnapshotItem[];
  knownProviderIds: string[];
  knownSourceUrls: string[];
  dismissedIds?: string[];
};

export type AssetOpportunityChange = {
  id: string;
  kind: AssetChangeKind;
  pageRoute: string;
  page?: string;
  asset?: string;
  previousPriority?: string;
  currentPriority?: string;
};

const ARCHIVE_DIR = path.join(
  process.cwd(),
  "docs",
  "content-assets",
  "archive",
);

export const OPPORTUNITY_SNAPSHOT_PATH = path.join(
  ARCHIVE_DIR,
  "opportunities-latest.json",
);

export function loadPreviousOpportunitySnapshot(): AssetIntelligenceSnapshot | null {
  if (!fs.existsSync(OPPORTUNITY_SNAPSHOT_PATH)) return null;
  try {
    return JSON.parse(
      fs.readFileSync(OPPORTUNITY_SNAPSHOT_PATH, "utf8"),
    ) as AssetIntelligenceSnapshot;
  } catch {
    return null;
  }
}

export function writeOpportunitySnapshot(
  snapshot: AssetIntelligenceSnapshot,
): string {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  fs.writeFileSync(
    OPPORTUNITY_SNAPSHOT_PATH,
    JSON.stringify(snapshot, null, 2),
    "utf8",
  );
  return OPPORTUNITY_SNAPSHOT_PATH;
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    return u.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

/**
 * Diff opportunity sets across runs using stable IDs.
 * IMPLEMENTED = previous open opportunity whose source/provider now appears
 * in known ResearchMedia catalog (or id removed + media present).
 */
export function diffOpportunitySnapshots(
  previous: AssetIntelligenceSnapshot | null,
  current: AssetIntelligenceSnapshot,
): AssetOpportunityChange[] {
  const changes: AssetOpportunityChange[] = [];
  const prevById = new Map(
    (previous?.opportunities ?? []).map((o) => [o.id, o]),
  );
  const currById = new Map(current.opportunities.map((o) => [o.id, o]));
  const dismissed = new Set(previous?.dismissedIds ?? []);
  const knownProviders = new Set(current.knownProviderIds);
  const knownUrls = new Set(
    current.knownSourceUrls.map((u) => normalizeUrl(u)),
  );

  for (const [id, cur] of currById) {
    const prev = prevById.get(id);
    if (dismissed.has(id)) {
      changes.push({
        id,
        kind: "DISMISSED",
        pageRoute: cur.pageRoute,
        page: cur.page,
        asset: cur.asset,
        currentPriority: cur.priority,
      });
      continue;
    }
    if (!prev) {
      changes.push({
        id,
        kind: "NEW",
        pageRoute: cur.pageRoute,
        page: cur.page,
        asset: cur.asset,
        currentPriority: cur.priority,
      });
      continue;
    }
    if (cur.kind === "STALE" || cur.statusHint === "stale") {
      changes.push({
        id,
        kind: "STALE",
        pageRoute: cur.pageRoute,
        page: cur.page,
        asset: cur.asset,
        previousPriority: prev.priority,
        currentPriority: cur.priority,
      });
      continue;
    }
    changes.push({
      id,
      kind: "STILL OPEN",
      pageRoute: cur.pageRoute,
      page: cur.page,
      asset: cur.asset,
      previousPriority: prev.priority,
      currentPriority: cur.priority,
    });
  }

  for (const [id, prev] of prevById) {
    if (currById.has(id)) continue;
    if (dismissed.has(id)) {
      changes.push({
        id,
        kind: "DISMISSED",
        pageRoute: prev.pageRoute,
        page: prev.page,
        asset: prev.asset,
        previousPriority: prev.priority,
      });
      continue;
    }
    const implemented =
      (prev.providerId && knownProviders.has(prev.providerId)) ||
      (prev.sourceUrl && knownUrls.has(normalizeUrl(prev.sourceUrl)));
    changes.push({
      id,
      kind: implemented ? "IMPLEMENTED" : "NO LONGER AVAILABLE",
      pageRoute: prev.pageRoute,
      page: prev.page,
      asset: prev.asset,
      previousPriority: prev.priority,
    });
  }

  const order: Record<AssetChangeKind, number> = {
    NEW: 0,
    STALE: 1,
    "STILL OPEN": 2,
    IMPLEMENTED: 3,
    "NO LONGER AVAILABLE": 4,
    DISMISSED: 5,
  };
  return changes.sort(
    (a, b) => order[a.kind] - order[b.kind] || a.id.localeCompare(b.id),
  );
}

export function summarizeAssetChanges(
  changes: AssetOpportunityChange[],
): Record<AssetChangeKind, number> {
  const out: Record<AssetChangeKind, number> = {
    NEW: 0,
    "STILL OPEN": 0,
    IMPLEMENTED: 0,
    "NO LONGER AVAILABLE": 0,
    STALE: 0,
    DISMISSED: 0,
  };
  for (const c of changes) out[c.kind] += 1;
  return out;
}
