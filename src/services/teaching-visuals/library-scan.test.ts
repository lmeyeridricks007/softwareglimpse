import { describe, expect, it } from "vitest";
import {
  scanTeachingVisualDirectory,
  scanTeachingVisualLibrary,
  VENDOR_UI_PUBLIC_DIR,
} from "./library-scan";

describe("teaching-visual library scan", () => {
  it("marks vendor-ui as excluded from the teaching size bar", () => {
    const { vendorUi } = scanTeachingVisualLibrary();
    expect(vendorUi.directory).toBe(`public/${VENDOR_UI_PUBLIC_DIR}/`);
    expect(vendorUi.excludedFromTeachingBar).toBe(true);
    expect(vendorUi.failingFiles).toEqual([]);
    expect(vendorUi.notes).toMatch(/vendor captures/i);
  });

  it("flags sub-premium files in teaching directories only", () => {
    const row = scanTeachingVisualDirectory(
      process.cwd() + "/public",
      "requirements",
    );
    expect(row.excludedFromTeachingBar).toBe(false);
    expect(row.failingFiles).toEqual([]);
  });
});
