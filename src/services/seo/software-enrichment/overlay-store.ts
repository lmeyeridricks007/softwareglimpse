/**
 * Node-only software enrichment overlay persistence.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { SoftwareEnrichmentOverlay } from "./types";

function overlaysDir(): string {
  return (
    process.env.SG_SOFTWARE_ENRICHMENT_OVERLAYS ??
    path.join(process.cwd(), "data/seo/software-enrichment-overlays")
  );
}

export function overlayPathForSlug(slug: string): string {
  return path.join(overlaysDir(), `${slug}.json`);
}

export function loadSoftwareEnrichmentOverlay(
  slug: string,
): SoftwareEnrichmentOverlay | null {
  const filePath = overlayPathForSlug(slug);
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(
      readFileSync(filePath, "utf8"),
    ) as SoftwareEnrichmentOverlay;
  } catch {
    return null;
  }
}

export function saveSoftwareEnrichmentOverlay(
  overlay: SoftwareEnrichmentOverlay,
): string {
  const dir = overlaysDir();
  mkdirSync(dir, { recursive: true });
  const filePath = overlayPathForSlug(overlay.slug);
  writeFileSync(filePath, `${JSON.stringify(overlay, null, 2)}\n`, "utf8");
  return filePath;
}

export function listSoftwareEnrichmentOverlaySlugs(): string[] {
  const dir = overlaysDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}
