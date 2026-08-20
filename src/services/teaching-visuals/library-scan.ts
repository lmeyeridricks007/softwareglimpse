import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/** Directories under `public/` subject to the ~900 KB teaching-visual size bar. */
export const TEACHING_VISUAL_PUBLIC_DIRS = [
  "guides",
  "software",
  "industries",
  "for",
  "capabilities",
  "use-cases",
  "features",
  "requirements",
  "compare",
] as const;

/** Vendor UI captures — real screenshots, not teaching art. Out of scope for size bar. */
export const VENDOR_UI_PUBLIC_DIR = "vendor-ui";

export const TEACHING_VISUAL_PREMIUM_BYTES = 900_000;
export const TEACHING_VISUAL_TINY_BYTES = 80 * 1024;

export type TeachingVisualDirectoryScan = {
  directory: string;
  pngCount: number;
  medianBytes: number;
  under80Kb: number;
  under900Kb: number;
  /** When true, under-threshold counts are informational only — not audit failures. */
  excludedFromTeachingBar: boolean;
  notes: string;
  failingFiles: string[];
};

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1]! + sorted[mid]!) / 2)
    : sorted[mid]!;
}

function walkPngs(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkPngs(full, out);
    else if (/\.png$/i.test(name)) out.push(full);
  }
  return out;
}

export function scanTeachingVisualDirectory(
  publicRoot: string,
  dirName: string,
  options?: { excludedFromTeachingBar?: boolean; notes?: string },
): TeachingVisualDirectoryScan {
  const abs = join(publicRoot, dirName);
  const files = walkPngs(abs);
  const sizes = files.map((f) => statSync(f).size);
  const under80Kb = sizes.filter((s) => s < TEACHING_VISUAL_TINY_BYTES).length;
  const under900Kb = sizes.filter((s) => s < TEACHING_VISUAL_PREMIUM_BYTES).length;
  const excluded = options?.excludedFromTeachingBar ?? false;
  const failingFiles = excluded
    ? []
    : files.filter((f) => statSync(f).size < TEACHING_VISUAL_PREMIUM_BYTES);

  return {
    directory: `public/${dirName}/`,
    pngCount: files.length,
    medianBytes: median(sizes),
    under80Kb,
    under900Kb,
    excludedFromTeachingBar: excluded,
    notes:
      options?.notes ??
      (excluded
        ? "Vendor captures — not teaching art"
        : "Teaching-visual size bar"),
    failingFiles: failingFiles.map((f) =>
      f.replace(publicRoot, "").replace(/^\/+/, "/"),
    ),
  };
}

export function scanTeachingVisualLibrary(publicRoot = join(process.cwd(), "public")) {
  const teaching = TEACHING_VISUAL_PUBLIC_DIRS.map((dir) =>
    scanTeachingVisualDirectory(publicRoot, dir),
  );
  const vendorUi = scanTeachingVisualDirectory(publicRoot, VENDOR_UI_PUBLIC_DIR, {
    excludedFromTeachingBar: true,
    notes: "Expected — vendor captures, not teaching art",
  });
  return { teaching, vendorUi, all: [...teaching, vendorUi] };
}
