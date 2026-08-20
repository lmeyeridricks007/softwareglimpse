import type { ProductScreenshot } from "@/domain";

/**
 * SoftwareGlimpse original teaching diagrams must never be labeled as vendor UI.
 * Prefer explicit `kind`; fall back to annotation markers used in older enrichment.
 */
export function isOriginalProductDiagram(shot: ProductScreenshot): boolean {
  if (shot.kind === "original-diagram") return true;
  if (shot.kind === "vendor-ui") return false;
  return (shot.annotation ?? "")
    .toLowerCase()
    .includes("softwareglimpse original");
}

export function isVendorUiScreenshot(shot: ProductScreenshot): boolean {
  return !isOriginalProductDiagram(shot);
}

export function partitionProductVisuals(shots: ProductScreenshot[]): {
  vendorUi: ProductScreenshot[];
  diagrams: ProductScreenshot[];
} {
  const vendorUi: ProductScreenshot[] = [];
  const diagrams: ProductScreenshot[] = [];
  for (const shot of shots) {
    if (isOriginalProductDiagram(shot)) diagrams.push(shot);
    else vendorUi.push(shot);
  }
  return { vendorUi, diagrams };
}
