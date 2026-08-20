import { describe, expect, it } from "vitest";
import type { ProductScreenshot } from "@/domain";
import {
  isOriginalProductDiagram,
  isVendorUiScreenshot,
  partitionProductVisuals,
} from "@/services/product-media/screenshot-kind";

function shot(
  partial: Partial<ProductScreenshot> & Pick<ProductScreenshot, "id" | "src" | "alt">,
): ProductScreenshot {
  return {
    featureIds: [],
    useCaseIds: [],
    ...partial,
  };
}

describe("screenshot-kind", () => {
  it("treats kind original-diagram as teaching diagram", () => {
    const diagram = shot({
      id: "d1",
      src: "/d.png",
      alt: "diagram",
      kind: "original-diagram",
    });
    expect(isOriginalProductDiagram(diagram)).toBe(true);
    expect(isVendorUiScreenshot(diagram)).toBe(false);
  });

  it("treats kind vendor-ui as product capture", () => {
    const ui = shot({
      id: "s1",
      src: "/s.png",
      alt: "ui",
      kind: "vendor-ui",
    });
    expect(isOriginalProductDiagram(ui)).toBe(false);
    expect(isVendorUiScreenshot(ui)).toBe(true);
  });

  it("falls back to SoftwareGlimpse original annotation", () => {
    const diagram = shot({
      id: "d2",
      src: "/d.png",
      alt: "diagram",
      annotation: "SoftwareGlimpse original teaching diagram — not a vendor UI capture",
    });
    expect(isOriginalProductDiagram(diagram)).toBe(true);
  });

  it("partitions mixed enrichment screenshots", () => {
    const { vendorUi, diagrams } = partitionProductVisuals([
      shot({ id: "s1", src: "/s.png", alt: "ui", kind: "vendor-ui" }),
      shot({
        id: "d1",
        src: "/d.png",
        alt: "diagram",
        kind: "original-diagram",
      }),
    ]);
    expect(vendorUi.map((s) => s.id)).toEqual(["s1"]);
    expect(diagrams.map((s) => s.id)).toEqual(["d1"]);
  });
});
