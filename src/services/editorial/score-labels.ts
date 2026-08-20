/**
 * Text labels for editorial scores — never rely on color alone.
 */
export function scoreLabel(score: number): string {
  if (score >= 9) return "Excellent";
  if (score >= 7) return "Good";
  if (score >= 5) return "Average";
  if (score >= 3) return "Below average";
  return "Poor";
}

export function formatScoreWithLabel(score: number): string {
  const rounded = Math.round(score * 10) / 10;
  return `${rounded} out of 10 — ${scoreLabel(score)}`;
}
