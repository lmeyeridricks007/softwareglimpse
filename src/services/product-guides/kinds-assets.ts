import { existsSync } from "node:fs";
import path from "node:path";
import {
  productGuideSlug,
  type CrmProductGuideKind,
} from "./kinds";

function publicGuideAsset(webPath: string): string {
  return path.join(process.cwd(), "public", webPath.replace(/^\//, ""));
}

/**
 * Prefer GenerateImage `-v4` teaching visuals (softwareglimpse-teaching-visuals.mdc).
 * Never fall back to SVG `-v3` placeholders — those cards fail the ~1 MB size bar
 * and are often the wrong category chrome.
 */
function preferGuideVisual(baseSlug: string, suffix: string): string {
  const v4 = `/guides/${baseSlug}-${suffix}-v4.png`;
  if (existsSync(publicGuideAsset(v4))) return v4;
  const coverV4 = `/guides/${baseSlug}-cover-v4.png`;
  if (existsSync(publicGuideAsset(coverV4))) return coverV4;
  // Vercel builds do not include public/guides (served from Blob). Prefer cover —
  // it was generated more completely than diagrams; missing diagram URLs 404.
  if (process.env.VERCEL === "1" || process.env.BLOB_MEDIA_REWRITES === "1") {
    return coverV4;
  }
  return v4;
}

export function productGuideHeroSrc(
  productSlug: string,
  kind: CrmProductGuideKind,
): string {
  return preferGuideVisual(productGuideSlug(productSlug, kind), "cover");
}

export function productGuideFigureSrc(
  productSlug: string,
  kind: CrmProductGuideKind,
): string {
  return preferGuideVisual(productGuideSlug(productSlug, kind), "diagram");
}

/** Teaching panel PNGs (1–4) used on step figures — unique per product × kind. */
export function productGuidePanelSrc(
  productSlug: string,
  kind: CrmProductGuideKind,
  panel: 1 | 2 | 3 | 4,
): string {
  const base = productGuideSlug(productSlug, kind);
  const step = `/guides/${base}-step-v4-${panel}.png`;
  if (existsSync(publicGuideAsset(step))) return step;
  const diagram = `/guides/${base}-diagram-v4.png`;
  if (existsSync(publicGuideAsset(diagram))) return diagram;
  const cover = `/guides/${base}-cover-v4.png`;
  if (existsSync(publicGuideAsset(cover))) return cover;
  // Blob-hosted deploys: cover is the safest public URL when steps/diagrams absent.
  if (process.env.VERCEL === "1" || process.env.BLOB_MEDIA_REWRITES === "1") {
    return cover;
  }
  return diagram;
}
