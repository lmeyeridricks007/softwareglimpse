import type { DataValidity } from "./types";

const STALE_DAYS = 45;

export function daysSinceIso(iso: string | null | undefined, now = Date.now()): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.floor((now - t) / (1000 * 60 * 60 * 24));
}

/**
 * Classify integration trust for production north-star use.
 * Fixture/sample inputs must never drive production status.
 */
export function classifyDataValidity(opts: {
  connected: boolean;
  synthetic?: boolean;
  fixturePathHint?: string | null;
  sourcePath?: string | null;
  dataThroughDate?: string | null;
  generatedAt?: string | null;
}): DataValidity {
  if (!opts.connected) return "NOT_CONNECTED";
  const pathHint = `${opts.fixturePathHint ?? ""} ${opts.sourcePath ?? ""}`.toLowerCase();
  if (
    opts.synthetic ||
    pathHint.includes("fixture") ||
    pathHint.includes("sample") ||
    pathHint.includes("/fixtures/")
  ) {
    return "FIXTURE";
  }
  const age =
    daysSinceIso(opts.dataThroughDate) ?? daysSinceIso(opts.generatedAt);
  if (age != null && age > STALE_DAYS) return "STALE";
  return "REAL";
}

export function validityAllowsNorthStar(v: DataValidity): boolean {
  return v === "REAL";
}
