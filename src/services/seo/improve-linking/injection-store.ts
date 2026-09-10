/**
 * Persist link-injection edges (Node / CLI).
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { identityPath, normalizePath } from "@/seo/canonical";
import {
  LINK_INJECTIONS_VERSION,
  clearLinkInjectionsCache,
  type LinkInjectionEdge,
  type LinkInjectionsFile,
} from "@/services/internal-linking/link-injections";

function injectionsPath(): string {
  return (
    process.env.SG_LINK_INJECTIONS_PATH ||
    path.join(process.cwd(), "data/seo/link-injections.json")
  );
}

function edgeKey(e: LinkInjectionEdge): string {
  return `${identityPath(e.fromPath)}=>${identityPath(e.toPath)}::${e.module}`;
}

/** from→to only — used to collapse module-variant duplicates. */
function pairKey(e: LinkInjectionEdge): string {
  return `${identityPath(e.fromPath)}=>${identityPath(e.toPath)}`;
}

/**
 * Drop redundant injections: same from→to under multiple modules, or
 * duplicate keys. Keeps the highest-score edge per pair.
 */
export function dedupeInjectionEdges(
  edges: LinkInjectionEdge[],
): LinkInjectionEdge[] {
  const byPair = new Map<string, LinkInjectionEdge>();
  for (const e of edges) {
    const key = pairKey(e);
    const prev = byPair.get(key);
    if (!prev || (e.score ?? 0) >= (prev.score ?? 0)) {
      byPair.set(key, e);
    }
  }
  return [...byPair.values()];
}

export function upsertLinkInjections(
  edges: LinkInjectionEdge[],
): LinkInjectionsFile {
  const filePath = injectionsPath();
  mkdirSync(path.dirname(filePath), { recursive: true });

  let existing: LinkInjectionsFile = {
    version: LINK_INJECTIONS_VERSION,
    updatedAt: new Date().toISOString(),
    edges: [],
  };
  if (existsSync(filePath)) {
    try {
      existing = JSON.parse(readFileSync(filePath, "utf8")) as LinkInjectionsFile;
    } catch {
      // start fresh
    }
  }

  const byKey = new Map<string, LinkInjectionEdge>();
  for (const e of dedupeInjectionEdges(existing.edges ?? [])) {
    byKey.set(edgeKey(e), e);
  }
  for (const e of edges) {
    byKey.set(edgeKey(e), e);
  }

  const next: LinkInjectionsFile = {
    version: LINK_INJECTIONS_VERSION,
    updatedAt: new Date().toISOString(),
    edges: dedupeInjectionEdges([...byKey.values()]),
  };
  writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  clearLinkInjectionsCache();
  return next;
}

/**
 * Rewrite injections file after removing edges already emitted by natural
 * link plans (avoids DUPLICATE_NAV at the data source).
 */
export function pruneRedundantLinkInjections(
  isAlreadyInNaturalPlan: (fromPath: string, toPath: string) => boolean,
): { before: number; after: number; removed: number } {
  const filePath = injectionsPath();
  if (!existsSync(filePath)) {
    return { before: 0, after: 0, removed: 0 };
  }
  const existing = JSON.parse(
    readFileSync(filePath, "utf8"),
  ) as LinkInjectionsFile;
  const before = existing.edges?.length ?? 0;
  const kept = dedupeInjectionEdges(existing.edges ?? []).filter((e) => {
    try {
      return !isAlreadyInNaturalPlan(
        identityPath(e.fromPath),
        normalizePath(e.toPath),
      );
    } catch {
      return true;
    }
  });
  const next: LinkInjectionsFile = {
    version: LINK_INJECTIONS_VERSION,
    updatedAt: new Date().toISOString(),
    edges: kept,
  };
  writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  clearLinkInjectionsCache();
  return { before, after: kept.length, removed: before - kept.length };
}
