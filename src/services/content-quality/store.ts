import fs from "node:fs";
import path from "node:path";

const REPORT_DIR = path.join(process.cwd(), "reports", "content-quality");

export function writeQualityMarkdownReport(
  filename: string,
  markdown: string,
): string {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  const full = path.join(REPORT_DIR, safe.endsWith(".md") ? safe : `${safe}.md`);
  fs.writeFileSync(full, markdown, "utf8");
  return full;
}

export function getQualityReportDir(): string {
  return REPORT_DIR;
}
