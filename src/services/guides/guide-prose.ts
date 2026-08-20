import type { GuidePage } from "@/domain";

/** ~200 wpm — matches guide-reading-time.ts */
export const GUIDE_WORDS_PER_MINUTE = 200;

/** Editorial minimum: guides under this read as stubs, not teaching pages. */
export const GUIDE_MIN_READING_MINUTES = 5;

export const GUIDE_MIN_PROSE_WORDS =
  GUIDE_MIN_READING_MINUTES * GUIDE_WORDS_PER_MINUTE;

/** One short block closes the gap when a guide is just under the bar. */
export const GUIDE_NEAR_COMPLETE_WORDS = GUIDE_MIN_PROSE_WORDS - 200;

type BlockLike = {
  type: string;
  body?: string;
  heading?: string;
  tip?: string;
  title?: string;
  caption?: string;
  bullets?: string[];
  items?: Array<{ label?: string; body?: string; question?: string; answer?: string }>;
  scenarios?: Array<{ title?: string; body?: string }>;
  figure?: { caption?: string };
  steps?: Array<{ label?: string; short?: string }>;
  links?: Array<{ label?: string; description?: string }>;
};

/** Prose-only word count — excludes JSON keys and structural noise. */
export function proseWordsFromBlocks(
  blocks: BlockLike[],
  summary?: string | null,
): number {
  const parts: string[] = [summary ?? ""];
  for (const block of blocks) {
    switch (block.type) {
      case "direct-answer":
        parts.push(block.body ?? "", ...(block.bullets ?? []));
        break;
      case "key-takeaways":
        for (const item of block.items ?? []) {
          parts.push(item.label ?? "", item.body ?? "");
        }
        break;
      case "step":
        parts.push(
          block.heading ?? "",
          block.body ?? "",
          block.tip ?? "",
        );
        for (const s of block.scenarios ?? []) {
          parts.push(s.title ?? "", s.body ?? "");
        }
        break;
      case "faq":
        for (const item of block.items ?? []) {
          parts.push(item.question ?? "", item.answer ?? "");
        }
        break;
      case "figure":
      case "decision-framework":
        parts.push(block.title ?? "", block.caption ?? "");
        parts.push(block.figure?.caption ?? "");
        for (const s of block.steps ?? []) {
          parts.push(s.label ?? "", s.short ?? "");
        }
        break;
      case "related-content":
      case "interactive-cta":
        parts.push(block.title ?? "", block.body ?? "");
        for (const link of block.links ?? []) {
          parts.push(link.label ?? "", link.description ?? "");
        }
        break;
      default:
        break;
    }
  }
  return parts
    .join(" ")
    .trim()
    .split(/\s+/u)
    .filter(Boolean).length;
}

export function proseMinutesFromWords(words: number): number {
  if (words <= 0) return 1;
  return Math.max(1, Math.round(words / GUIDE_WORDS_PER_MINUTE));
}

export function proseMinutesFromGuide(guide: Pick<GuidePage, "summary" | "blocks">): number {
  return proseMinutesFromWords(
    proseWordsFromBlocks(guide.blocks as BlockLike[], guide.summary),
  );
}

export function isGuideProseComplete(
  guide: Pick<GuidePage, "summary" | "blocks">,
): boolean {
  return (
    proseWordsFromBlocks(guide.blocks as BlockLike[], guide.summary) >=
    GUIDE_MIN_PROSE_WORDS
  );
}
