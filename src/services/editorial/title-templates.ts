import type { EditorialPageType } from "@/domain";

/**
 * Configurable title templates — never inject calendar years.
 * Tokens: {name}, {a}, {b}, {category}, {source}
 */
export const titleTemplates: Record<
  Extract<
    EditorialPageType,
    | "software-review"
    | "comparison"
    | "alternatives"
    | "best"
    | "guide"
    | "pricing"
    | "category-hub"
    | "use-case"
  >,
  string
> = {
  "software-review": "{name} Review: Pros, Cons, and Who It's For",
  comparison: "{a} vs {b}: Which CRM Is Better for You?",
  alternatives: "Best {name} Alternatives",
  best: "Best {category} Software",
  guide: "{name}: Buyer Guide",
  pricing: "{name} Pricing: Plans, Limits, and Real Cost",
  "category-hub": "{category}: How to Choose Software",
  "use-case": "Best {category} for {name}",
};

export type TitleTokens = {
  name?: string;
  a?: string;
  b?: string;
  category?: string;
  source?: string;
};

export function renderTitle(
  template: string,
  tokens: TitleTokens,
): string {
  return template
    .replace(/\{name\}/g, tokens.name ?? tokens.source ?? "Software")
    .replace(/\{a\}/g, tokens.a ?? "Product A")
    .replace(/\{b\}/g, tokens.b ?? "Product B")
    .replace(/\{category\}/g, tokens.category ?? "Software")
    .replace(/\{source\}/g, tokens.source ?? tokens.name ?? "Software");
}

export function buildPageTitle(
  pageType: EditorialPageType,
  tokens: TitleTokens,
  overrides?: Partial<typeof titleTemplates>,
): string {
  const templates = { ...titleTemplates, ...overrides };
  const template =
    templates[pageType as keyof typeof titleTemplates] ??
    titleTemplates["software-review"];
  return renderTitle(template, tokens);
}
