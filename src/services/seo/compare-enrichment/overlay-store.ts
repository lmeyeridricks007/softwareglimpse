/**
 * Node-only overlay persistence (CLI / enrichment apply).
 * Do not import from client components.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { CompareEnrichmentOverlay } from "./overlay-merge";

function overlaysDir(): string {
  return (
    process.env.SG_COMPARE_ENRICHMENT_OVERLAYS ??
    path.join(process.cwd(), "data/seo/compare-enrichment-overlays")
  );
}

export function overlayPathForSlug(slug: string): string {
  return path.join(overlaysDir(), `${slug}.json`);
}

export function loadCompareEnrichmentOverlay(
  slug: string,
): CompareEnrichmentOverlay | null {
  const filePath = overlayPathForSlug(slug);
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(
      readFileSync(filePath, "utf8"),
    ) as CompareEnrichmentOverlay;
  } catch {
    return null;
  }
}

export function saveCompareEnrichmentOverlay(
  overlay: CompareEnrichmentOverlay,
): string {
  const dir = overlaysDir();
  mkdirSync(dir, { recursive: true });
  const filePath = overlayPathForSlug(overlay.slug);
  writeFileSync(filePath, `${JSON.stringify(overlay, null, 2)}\n`, "utf8");
  return filePath;
}

export function listCompareEnrichmentOverlaySlugs(): string[] {
  const dir = overlaysDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}
