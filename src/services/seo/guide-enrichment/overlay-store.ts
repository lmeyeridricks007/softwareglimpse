/**
 * Node-only overlay persistence (CLI / enrichment apply).
 * Do not import from client components.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { GuideEnrichmentOverlay } from "./overlay-merge";

function overlaysDir(): string {
  return (
    process.env.SG_GUIDE_ENRICHMENT_OVERLAYS ??
    path.join(process.cwd(), "data/seo/guide-enrichment-overlays")
  );
}

export function overlayPathForSlug(slug: string): string {
  return path.join(overlaysDir(), `${slug}.json`);
}

export function loadGuideEnrichmentOverlay(
  slug: string,
): GuideEnrichmentOverlay | null {
  const filePath = overlayPathForSlug(slug);
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as GuideEnrichmentOverlay;
  } catch {
    return null;
  }
}

export function saveGuideEnrichmentOverlay(
  overlay: GuideEnrichmentOverlay,
): string {
  const dir = overlaysDir();
  mkdirSync(dir, { recursive: true });
  const filePath = overlayPathForSlug(overlay.slug);
  writeFileSync(filePath, `${JSON.stringify(overlay, null, 2)}\n`, "utf8");
  return filePath;
}

/** Remove a persisted overlay (used when sibling semantic QA fails after apply). */
export function deleteGuideEnrichmentOverlay(slug: string): boolean {
  const filePath = overlayPathForSlug(slug);
  if (!existsSync(filePath)) return false;
  unlinkSync(filePath);
  return true;
}

export function listGuideEnrichmentOverlaySlugs(): string[] {
  const dir = overlaysDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}
