/**
 * Canonical decision / supporting guide page template.
 * All new guides must reuse these components + CSS tokens — do not invent alternate layouts.
 *
 * Source pages: `/guides/[slug]/`
 * Visual CSS: `src/styles/tokens.css` (`.sg-guide-*`)
 * Components: `src/components/guides/*`
 * Block recipes: `GUIDE_BLOCK_RECIPES` in `@/domain/schemas/guide-blocks`
 */

import type { GuideContentBlock } from "@/domain";
import { GUIDE_BLOCK_RECIPES } from "@/domain/schemas/guide-blocks";

export const GUIDE_TEMPLATE_ID = "softwareglimpse-guide-template-v1" as const;

/** Pastel icon chip tones used by roadmap, goals, steps, size cards. */
export const GUIDE_ICON_TONE_KEYS = [
  "blue",
  "teal",
  "violet",
  "orange",
  "fuchsia",
  "emerald",
  "sky",
  "amber",
] as const;

export type GuideIconToneKey = (typeof GUIDE_ICON_TONE_KEYS)[number];

/** Tailwind class fallbacks (keep in sync with `.sg-guide-icon-chip[data-tone]`). */
export const GUIDE_ICON_TONE_CLASSES: Record<GuideIconToneKey, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-600",
  teal: "border-teal-200 bg-teal-50 text-teal-600",
  violet: "border-violet-200 bg-violet-50 text-violet-600",
  orange: "border-orange-200 bg-orange-50 text-orange-500",
  fuchsia: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-600",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-600",
  sky: "border-sky-200 bg-sky-50 text-sky-600",
  amber: "border-amber-200 bg-amber-50 text-amber-600",
};

export const GUIDE_LAYOUT = {
  /** Hero: title+CTAs+QuickAnswer left; unique heroVisual right; stretch columns. */
  hero: "grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:items-stretch lg:gap-8",
  /** Main + sticky sidebar */
  body: "mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start",
  sidebarSticky: "lg:sticky lg:top-24",
  sectionGap: "space-y-12",
} as const;

/**
 * Visual framing approach for generated guide PNGs.
 * Implemented by `GuideFigure` / `GuideHeroIllustration` / hub `GuideCover`.
 */
export const GUIDE_VISUAL_APPROACH = {
  /** Store under public/guides/{slug}-hero.png and {slug}-*.png */
  assetPath: "public/guides/{slug}-*.png",
  /**
   * Show the full diagram — never CSS zoom/scale or object-cover that clips labels.
   * Body + hero use width-filling natural aspect (`h-auto w-full` / object-contain).
   */
  framing: "full-image-natural-aspect",
  /**
   * Prefer trimming title/footer gutters in the PNG itself (gentle % crop).
   * Do not run aggressive “content-band” crops that can destroy illustrations.
   * Keep uncropped originals recoverable (e.g. Cursor assets backup).
   */
  assetPrep: "gentle-edge-crop-only",
  /** Hub cards use guide.heroVisual via GuideCover — not topic-type placeholder art. */
  hubCover: "heroVisual",
  /**
   * Even card rows via balancedGuideCardCols: 6→3×2, 5→3+2, 4→2×2, 3→3.
   * Never hardcode 5-col grids that leave a lonely leftover card.
   */
  scenarioGrid: "balanced-rows",
} as const;

/**
 * Required chrome for ALL guides (fundamentals and decision guides).
 * Topic type changes which blocks appear — not whether the template chrome is used.
 */
export const GUIDE_DECISION_CHROME = {
  heroVisual: "framework",
  quickAnswerInHero: true,
  primaryCta: "finder",
  secondaryCta: "checklist-or-next-guide",
  sidebar: [
    "in-this-guide-toc",
    "finder-cta",
    "recommended-tools",
    "related-articles",
    "newsletter",
  ],
} as const;

/** Components that implement the template — agents must reuse, not recreate. */
export const GUIDE_TEMPLATE_COMPONENTS = {
  page: "src/app/(site)/guides/[slug]/page.tsx",
  hero: "GuideHero",
  blocks: "GuideBlocksRenderer",
  visuals: "guide-visuals.tsx",
  interactive: "guide-interactive.tsx",
  sidebar: "GuideSidebar",
  icons: "guide-section-icons.ts",
  css: "src/styles/tokens.css (.sg-guide-*)",
} as const;

export function guideRecipeForTopicType(
  topicType: string,
): GuideContentBlock["type"][] {
  return (
    GUIDE_BLOCK_RECIPES[topicType] ??
    GUIDE_BLOCK_RECIPES.fundamental ??
    []
  );
}

/** Agent-facing checklist when drafting or implementing a guide. */
export const GUIDE_AGENT_TEMPLATE_RULES = [
  `Use template ${GUIDE_TEMPLATE_ID} — reuse GuideHero, GuideBlocksRenderer, GuideSidebar, guide-visuals.`,
  "Emit GuideContentBlock[] from GUIDE_BLOCK_RECIPES for the topicType — not thin H2 essays.",
  "ALL guides use the same chrome: Quick Answer in the hero left column under CTAs, rich right visual, sidebar TOC + tools.",
  "Each guide MUST set a unique heroVisual (src+alt). Never reuse another guide's hero artwork.",
  "Hub cards must surface that hero via GuideCover / guides-hub image from heroVisual — never shared topic-placeholder art when a hero exists.",
  "Break up text with topic-specific generated figures: step.figure, feature-matrix.figure, size-match.figure, and/or type=figure blocks under public/guides/{slug}-*.png.",
  "GuideFigure framing: show the FULL image at natural aspect, width-filling. Prefer object-contain / h-auto w-full. Never CSS scale/zoom or object-cover that clips diagram labels.",
  "Asset prep: gentle edge crop of baked-in title/footer gutters only. Do not aggressive content-band crops. Prefer regenerating tighter art over clipping live pages.",
  "Every guide must answer its main question in direct-answer (clear decision rule in ≤3 sentences).",
  "Teach with concrete worked examples (named team situations) in steps and/or FAQ — not abstract principles alone.",
  "Every guide needs unique heroVisual plus ≥1 body figure with a teaching caption; wire step.figure / type=figure for concept diagrams.",
  "Adaptive grids: use balancedGuideCardCols for scenario/type/mistake/size cards — 6→3×2, 5→3+2, 4→2×2; never a 5-col row with one leftover.",
  "Fundamentals: omit selection factor strip in Quick Answer; use educational diagrams (how it works, comparisons, stages).",
  "Selection guides: keep framework/roadmap visuals that match buying criteria — still unique per guide when possible.",
  "Use pastel multi-color icon chips (GUIDE_ICON_TONE_KEYS) — never monochrome-blue-only icon rows.",
  "Fill visual cards with native UI + generated diagrams — no stock photography.",
  "Tips use .sg-guide-tip / TipCallout (left accent bar). Must-have vs nice-to-have use green/purple list cards.",
  "Sidebar: numbered In this guide TOC, solid blue Finder CTA, recommended tools, related, newsletter.",
  "Soft-publish drafts with seo.indexable=false until editorial gate; publishedAt must be ≤ now or getGuides() will hide the page.",
  "Commercial visits: `SoftwareCta` / `AffiliateLink` → direct affiliate URL (`rel=sponsored`). `/go/{slug}` retained only for backward-compatible redirects.",
  "No invented scores, dollar totals, research hours, or affiliate-ordered rankings.",
] as const;
