/** Rough reading-time estimate from guide body text (honest, not marketing). */
export function estimateGuideReadingMinutes(parts: string[]): number {
  const words = parts
    .join(" ")
    .trim()
    .split(/\s+/u)
    .filter(Boolean).length;
  if (words === 0) return 1;
  return Math.max(1, Math.round(words / 200));
}

/** Collect readable text from sections and/or structured blocks. */
export function readingPartsFromGuide(guide: {
  summary?: string;
  sections?: Array<{ heading?: string; body?: string; tip?: string }>;
  blocks?: unknown[];
}): string[] {
  const parts: string[] = [guide.summary ?? ""];
  for (const section of guide.sections ?? []) {
    parts.push(section.heading ?? "", section.body ?? "", section.tip ?? "");
  }
  for (const block of guide.blocks ?? []) {
    if (!block || typeof block !== "object") continue;
    const raw = JSON.stringify(block);
    parts.push(raw);
  }
  return parts;
}
