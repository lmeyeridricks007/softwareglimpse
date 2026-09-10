import path from "node:path";
import type { LoadedBacklinkExport, ReferringDomainRow } from "./types";

export type BacklinkExportValidity =
  | "REAL"
  | "FIXTURE"
  | "SAMPLE"
  | "TEST"
  | "EXAMPLE"
  | "REJECTED";

const FIXTURE_PATH_HINTS = [
  "/fixtures/",
  "/fixture/",
  "fixture",
  "sample",
  "example",
  "demo",
  "dummy",
  "mock",
  "test-data",
  "testdata",
  "synthetic",
];

const EXAMPLE_DOMAIN_RE =
  /(?:^|\.)example(?:\.com|\.org|\.net)?$|(?:^|\.)example$|\.example$|^localhost$|^127\.0\.0\.1$|test\.|fixture\.|sample\.|dummy\./i;

/**
 * Classify whether a backlink export may drive production Digital PR reports.
 * Example/fixture/sample/test inputs are never REAL.
 */
export function classifyBacklinkExportValidity(input: {
  sourcePath: string;
  label?: string | null;
  rows?: ReferringDomainRow[];
}): {
  validity: BacklinkExportValidity;
  reasons: string[];
} {
  const reasons: string[] = [];
  const lowerPath = input.sourcePath.toLowerCase().replace(/\\/g, "/");
  const base = path.basename(input.sourcePath).toLowerCase();
  const label = (input.label ?? "").toLowerCase();
  const hay = `${lowerPath} ${base} ${label}`;

  if (lowerPath.includes("/fixtures/") || lowerPath.includes("/fixture/")) {
    reasons.push("Path is under a fixtures directory");
  }
  for (const hint of FIXTURE_PATH_HINTS) {
    if (
      base.includes(hint) ||
      label.includes(hint) ||
      (hint.startsWith("/") && lowerPath.includes(hint))
    ) {
      if (hint === "test-data" || hint === "testdata" || hint === "test") {
        // avoid matching "latest" etc. — handled below
      } else if (
        hint === "sample" ||
        hint === "fixture" ||
        hint === "example" ||
        hint === "demo" ||
        hint === "dummy" ||
        hint === "mock" ||
        hint === "synthetic"
      ) {
        reasons.push(`Filename/label indicates ${hint} data`);
        break;
      }
    }
  }
  if (/\b(sample|fixture|example|demo|dummy|mock|synthetic)\b/.test(hay)) {
    if (!reasons.some((r) => r.includes("indicates"))) {
      reasons.push("Filename/label/path matches sample/fixture/example pattern");
    }
  }
  if (/\b(test[_-]?data|testdata)\b/.test(hay) || /(?:^|[/_-])test(?:[._-]|\.csv|\.json)/.test(base)) {
    reasons.push("Filename/path indicates test data");
  }

  const rows = input.rows ?? [];
  let exampleDomainCount = 0;
  for (const row of rows) {
    if (isExampleOrPlaceholderDomain(row.domain)) {
      exampleDomainCount += 1;
    }
  }
  if (rows.length > 0 && exampleDomainCount / rows.length >= 0.5) {
    reasons.push(
      `≥50% of rows use example/placeholder domains (${exampleDomainCount}/${rows.length})`,
    );
  } else if (exampleDomainCount > 0 && rows.length <= 10) {
    reasons.push(
      `Small export contains example/placeholder domains (${exampleDomainCount})`,
    );
  }

  if (reasons.length === 0) {
    return { validity: "REAL", reasons: [] };
  }

  if (reasons.some((r) => /fixture/i.test(r))) {
    return { validity: "FIXTURE", reasons };
  }
  if (reasons.some((r) => /sample/i.test(r))) {
    return { validity: "SAMPLE", reasons };
  }
  if (reasons.some((r) => /test data/i.test(r))) {
    return { validity: "TEST", reasons };
  }
  if (reasons.some((r) => /example/i.test(r))) {
    return { validity: "EXAMPLE", reasons };
  }
  return { validity: "REJECTED", reasons };
}

export function isExampleOrPlaceholderDomain(domain: string): boolean {
  const d = domain.replace(/^www\./, "").toLowerCase();
  if (EXAMPLE_DOMAIN_RE.test(d)) return true;
  if (d.endsWith(".example")) return true;
  if (d === "example.com" || d.endsWith(".example.com")) return true;
  if (d.includes("example-")) return true;
  return false;
}

export function isProductionEligibleExport(
  loaded: LoadedBacklinkExport | null,
): loaded is LoadedBacklinkExport {
  if (!loaded || loaded.rows.length === 0) return false;
  const { validity } = classifyBacklinkExportValidity({
    sourcePath: loaded.meta.sourcePath,
    label: loaded.meta.label,
    rows: loaded.rows,
  });
  return validity === "REAL";
}

export function metricsAvailableFromRows(
  rows: ReferringDomainRow[],
): string[] {
  const metrics: string[] = ["domain", "target_url"];
  if (rows.some((r) => r.sourceUrl)) metrics.push("source_url");
  if (rows.some((r) => r.domainRating != null)) metrics.push("domain_rating");
  if (rows.some((r) => r.domainAuthority != null)) {
    metrics.push("domain_authority");
  }
  if (rows.some((r) => r.organicTraffic != null)) {
    metrics.push("organic_traffic");
  }
  if (rows.some((r) => r.anchorText)) metrics.push("anchor");
  if (rows.some((r) => r.isDofollow != null)) metrics.push("dofollow");
  if (rows.some((r) => r.firstSeen)) metrics.push("first_seen");
  if (rows.some((r) => r.lastSeen)) metrics.push("last_seen");
  return metrics;
}

/**
 * Infer export date from filename (YYYY-MM-DD) or file mtime ISO date.
 */
export function inferExportDate(
  sourcePath: string,
  fileMtimeIso?: string | null,
): string | null {
  const base = path.basename(sourcePath);
  const m = base.match(/(20\d{2}-\d{2}-\d{2})/);
  if (m?.[1]) return m[1];
  if (fileMtimeIso) return fileMtimeIso.slice(0, 10);
  return null;
}
