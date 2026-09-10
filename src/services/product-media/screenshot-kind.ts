/** Minimal fields used to classify vendor UI vs SG teaching diagrams. */
type ScreenshotVisualKind = {
  kind?: "vendor-ui" | "original-diagram";
  annotation?: string;
};

/**
 * SoftwareGlimpse original teaching diagrams must never be labeled as vendor UI.
 * Prefer explicit `kind`; fall back to annotation markers used in older enrichment.
 */
export function isOriginalProductDiagram(shot: ScreenshotVisualKind): boolean {
  if (shot.kind === "original-diagram") return true;
  if (shot.kind === "vendor-ui") return false;
  return (shot.annotation ?? "")
    .toLowerCase()
    .includes("softwareglimpse original");
}

export function isVendorUiScreenshot(shot: ScreenshotVisualKind): boolean {
  return !isOriginalProductDiagram(shot);
}

export function partitionProductVisuals<T extends ScreenshotVisualKind>(
  shots: T[],
): {
  vendorUi: T[];
  diagrams: T[];
} {
  const vendorUi: T[] = [];
  const diagrams: T[] = [];
  for (const shot of shots) {
    if (isOriginalProductDiagram(shot)) diagrams.push(shot);
    else vendorUi.push(shot);
  }
  return { vendorUi, diagrams };
}
