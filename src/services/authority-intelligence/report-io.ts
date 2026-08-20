import fs from "node:fs";
import path from "node:path";

export const AUTHORITY_DOCS_DIR = path.join(process.cwd(), "docs", "authority");
export const AUTHORITY_REPORTS_DIR = path.join(AUTHORITY_DOCS_DIR, "reports");
export const AUTHORITY_ARCHIVE_DIR = path.join(AUTHORITY_DOCS_DIR, "archive");

export const AUTHORITY_LATEST_PATH = path.join(
  AUTHORITY_REPORTS_DIR,
  "AUTHORITY-INTELLIGENCE-LATEST.md",
);
export const LINKABLE_ASSETS_PATH = path.join(
  AUTHORITY_REPORTS_DIR,
  "linkable-assets-latest.md",
);
export const OPPORTUNITIES_PATH = path.join(
  AUTHORITY_REPORTS_DIR,
  "opportunities-latest.md",
);
export const FREE_FIRST_PATH = path.join(
  AUTHORITY_REPORTS_DIR,
  "free-first-latest.md",
);
export const PAID_EXPOSURE_PATH = path.join(
  AUTHORITY_REPORTS_DIR,
  "paid-exposure-latest.md",
);
export const AVOID_PATH = path.join(AUTHORITY_REPORTS_DIR, "avoid-latest.md");
export const ANGLES_PATH = path.join(
  AUTHORITY_REPORTS_DIR,
  "outreach-angles-latest.md",
);
export const CONTENT_GAPS_PATH = path.join(
  AUTHORITY_REPORTS_DIR,
  "content-gaps-for-links-latest.md",
);
export const SNAPSHOT_PATH = path.join(
  AUTHORITY_ARCHIVE_DIR,
  "opportunities-latest.json",
);

export function ensureAuthorityReportDirs(): void {
  fs.mkdirSync(AUTHORITY_REPORTS_DIR, { recursive: true });
  fs.mkdirSync(AUTHORITY_ARCHIVE_DIR, { recursive: true });
}

export function writeAuthorityReport(filePath: string, markdown: string): string {
  ensureAuthorityReportDirs();
  fs.writeFileSync(filePath, markdown, "utf8");
  return filePath;
}

export function maybeWriteAuthorityArchive(
  basename: string,
  markdown: string,
  options: { mode: string; force?: boolean; now?: Date },
): string | undefined {
  if (options.mode === "FAST" && !options.force) return undefined;
  ensureAuthorityReportDirs();
  const day = (options.now ?? new Date()).toISOString().slice(0, 10);
  const full = path.join(AUTHORITY_ARCHIVE_DIR, `${day}-${basename}`);
  fs.writeFileSync(full, markdown, "utf8");
  return full;
}
