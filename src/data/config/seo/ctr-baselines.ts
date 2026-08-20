/**
 * Heuristic expected CTR midpoints by average-position bucket (positions 1–20).
 * Used only for opportunity detection — not claimed as GSC benchmarks.
 */
export const ctrBaselinesByPosition: ReadonlyArray<{
  positionMin: number;
  positionMax: number;
  expectedCtrMid: number;
}> = [
  { positionMin: 1, positionMax: 1, expectedCtrMid: 0.28 },
  { positionMin: 2, positionMax: 2, expectedCtrMid: 0.15 },
  { positionMin: 3, positionMax: 3, expectedCtrMid: 0.11 },
  { positionMin: 4, positionMax: 4, expectedCtrMid: 0.08 },
  { positionMin: 5, positionMax: 5, expectedCtrMid: 0.06 },
  { positionMin: 6, positionMax: 7, expectedCtrMid: 0.04 },
  { positionMin: 8, positionMax: 10, expectedCtrMid: 0.025 },
  { positionMin: 11, positionMax: 15, expectedCtrMid: 0.015 },
  { positionMin: 16, positionMax: 20, expectedCtrMid: 0.01 },
];

export function expectedCtrForPosition(position: number): number | null {
  if (!Number.isFinite(position) || position < 1) return null;
  // GSC positions are fractional averages — bucket by floored rank 1–20.
  const rank = Math.min(20, Math.max(1, Math.floor(position)));
  const bucket = ctrBaselinesByPosition.find(
    (b) => rank >= b.positionMin && rank <= b.positionMax,
  );
  return bucket?.expectedCtrMid ?? null;
}
