import type { Software } from "@/domain/schemas";
import type { CapabilityCompareRow, FeatureSupportStatus } from "./types";

type FeatureRating = NonNullable<Software["featureRatings"]>[number];

function statusFromRating(
  rating: FeatureRating | undefined,
): { status: FeatureSupportStatus; note?: string } {
  if (!rating) return { status: "unknown" };
  if (rating.available === true) {
    return {
      status: "supported",
      note: rating.notes || (rating.rating != null ? `Rated ${rating.rating}/10` : undefined),
    };
  }
  if (rating.available === false) {
    return {
      status: "unsupported",
      note: rating.notes || undefined,
    };
  }
  // available omitted — never invent "No"
  if (rating.rating != null) {
    return {
      status: "partial",
      note: rating.notes || `Rated ${rating.rating}/10 (availability not flagged)`,
    };
  }
  if (rating.notes?.trim()) {
    return { status: "partial", note: rating.notes };
  }
  return { status: "unknown" };
}

function labelFor(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Build side-by-side capability rows from structured feature ratings.
 * Missing data → unknown (never "unsupported").
 */
export function buildCapabilityCompareRows(
  a: Software,
  b: Software,
  limit = 12,
): CapabilityCompareRow[] {
  const mapA = new Map(
    (a.featureRatings ?? []).map((f) => [f.featureSlug, f]),
  );
  const mapB = new Map(
    (b.featureRatings ?? []).map((f) => [f.featureSlug, f]),
  );
  const slugs = [...new Set([...mapA.keys(), ...mapB.keys()])].sort();

  const rows: CapabilityCompareRow[] = [];
  for (const featureSlug of slugs) {
    const sa = statusFromRating(mapA.get(featureSlug));
    const sb = statusFromRating(mapB.get(featureSlug));
    // Prefer rows where at least one side has known data
    if (sa.status === "unknown" && sb.status === "unknown") continue;
    rows.push({
      featureSlug,
      label: labelFor(featureSlug),
      statusA: sa.status,
      statusB: sb.status,
      noteA: sa.note,
      noteB: sb.note,
    });
    if (rows.length >= limit) break;
  }
  return rows;
}

/** Detect invented unsupported claims from unknown→no mapping. */
export function hasFakeFeatureDifference(rows: CapabilityCompareRow[]): boolean {
  return rows.some(
    (r) =>
      (r.statusA === "unsupported" && r.statusB === "unknown") ||
      (r.statusB === "unsupported" && r.statusA === "unknown"),
  );
}
