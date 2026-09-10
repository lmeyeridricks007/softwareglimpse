import type { AnalysisSectionId, UniqueAnalysisSignal } from "./types";

const STOP = new Set([
  "that",
  "this",
  "with",
  "from",
  "your",
  "have",
  "will",
  "when",
  "what",
  "which",
  "into",
  "than",
  "them",
  "they",
  "then",
  "also",
  "only",
  "more",
  "most",
  "such",
  "over",
  "after",
  "before",
  "about",
  "should",
  "could",
  "would",
  "software",
  "tool",
  "tools",
  "platform",
  "product",
  "products",
  "guide",
  "team",
  "teams",
  "feature",
  "features",
  "plan",
  "plans",
  "pricing",
  "price",
  "month",
  "year",
  "user",
  "users",
  "seat",
  "seats",
]);

/**
 * Strip product names, prices, feature-ish labels, and table values so
 * remaining tokens reflect editorial analysis structure — not catalogue data.
 */
export function normalizeEditorialText(
  text: string,
  stripTokens: string[] = [],
): string {
  let t = text.toLowerCase();

  // Prices / numeric table values
  t = t.replace(
    /\$\s?\d[\d,]*(?:\.\d+)?(?:\s*\/\s*(?:mo|month|yr|year|seat|user))?/gi,
    " ",
  );
  t = t.replace(/\b\d+(\.\d+)?%\b/g, " ");
  t = t.replace(/\b\d{1,4}(?:\.\d+)?\b/g, " ");

  // Common feature / table label noise
  t = t.replace(
    /\b(yes|no|partial|supported|unsupported|unknown|n\/a|free|trial|starter|pro|enterprise|business|unlimited)\b/gi,
    " ",
  );

  for (const raw of stripTokens) {
    const token = raw.trim().toLowerCase();
    if (token.length < 2) continue;
    const spaced = token.replace(/-/g, " ");
    const re = new RegExp(
      `\\b${escapeRegExp(token)}\\b|\\b${escapeRegExp(spaced)}\\b`,
      "gi",
    );
    t = t.replace(re, " ");
  }

  t = t.replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  return t;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function tokenizeEditorial(normalized: string): string[] {
  return normalized
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));
}

export function jaccardTokens(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const sa = new Set(a);
  const sb = new Set(b);
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter += 1;
  return inter / (sa.size + sb.size - inter);
}

/** Character 5-gram Jaccard — catches paraphrased template shells. */
export function shingleSimilarity(a: string, b: string, size = 5): number {
  if (a.length < size || b.length < size) {
    return jaccardTokens(tokenizeEditorial(a), tokenizeEditorial(b));
  }
  const grams = (s: string) => {
    const out = new Set<string>();
    const compact = s.replace(/\s+/g, " ");
    for (let i = 0; i <= compact.length - size; i++) {
      out.add(compact.slice(i, i + size));
    }
    return out;
  };
  const ga = grams(a);
  const gb = grams(b);
  let inter = 0;
  for (const g of ga) if (gb.has(g)) inter += 1;
  return inter / (ga.size + gb.size - inter);
}

export function combinedSimilarity(aNorm: string, bNorm: string): number {
  const jac = jaccardTokens(tokenizeEditorial(aNorm), tokenizeEditorial(bNorm));
  const sh = shingleSimilarity(aNorm, bNorm);
  return Number((jac * 0.45 + sh * 0.55).toFixed(4));
}

export type AnalysisSections = Partial<Record<AnalysisSectionId, string>>;

/**
 * Detect page-specific analysis signals (names kept — we need product context).
 * Product/price substitution alone does not satisfy these.
 */
export function detectUniqueAnalysisSignals(text: string): UniqueAnalysisSignal[] {
  const found: UniqueAnalysisSignal[] = [];
  const t = text;

  if (
    /\b(worth it (?:if|when|only|for)|not worth (?:it|buying|the)|is(?:n't| not) worth)\b/i.test(
      t,
    ) ||
    /\b(choose .+ only if|skip .+ if|buy .+ when)\b/i.test(t)
  ) {
    found.push("specific_buyer_fit");
    found.push("worth_it_judgment");
  }

  if (
    /\b(best for|ideal for|built for|target(?:ed)? (?:buyer|team|company)|fits .{0,40}(smb|mid-market|enterprise|solo|agency))\b/i.test(
      t,
    )
  ) {
    found.push("specific_buyer_fit");
    found.push("target_buyer");
  }

  if (
    /\b(weak fit|poor fit|not (?:ideal|a fit|suitable) (?:when|for|if)|avoid (?:if|when)|wrong (?:for|fit) when)\b/i.test(
      t,
    )
  ) {
    found.push("specific_poor_fit_buyer");
    found.push("weak_fit");
  }

  if (
    /\$\s?\d[\d,]*.{0,40}\b(threshold|cap|breaks even|too (?:expensive|cheap)|budget under|if you (?:pay|spend)|above|below)\b/i.test(
      t,
    ) ||
    /\b(pricing threshold|cost ceiling|seat cost becomes|plan jumps to)\b/i.test(
      t,
    )
  ) {
    found.push("specific_price_threshold");
    found.push("pricing_threshold");
  }

  if (
    /\b(workflow advantage|faster (?:to|for) .{0,30}workflow|pipeline speed|sequence-first|lives in (?:inbox|sequences|deals))\b/i.test(
      t,
    ) ||
    /\b(advantage (?:for|in) .{0,40}(?:workflow|process|pipeline|onboarding))\b/i.test(
      t,
    )
  ) {
    found.push("specific_workflow_advantage");
  }

  if (
    /\b(limitation|cannot|does not support|missing .{0,30}(?:module|feature|capability)|hard limit)\b/i.test(
      t,
    ) &&
    /\b(when|if|for|because|unless)\b/i.test(t)
  ) {
    found.push("specific_limitation");
  }

  if (
    /\b(migration risk|cutover|data mapping|import (?:fail|risk)|switching cost|re-?train)\b/i.test(
      t,
    )
  ) {
    found.push("specific_migration_concern");
    found.push("migration_risk");
  }

  if (
    /\b(implementation (?:complexity|effort|time)|setup (?:takes|requires)|weeks? to (?:configure|roll out)|needs (?:admin|consultant|specialist))\b/i.test(
      t,
    )
  ) {
    found.push("specific_implementation_complexity");
  }

  if (
    /\b(unlike|whereas|compared (?:with|to)|differ(?:s|ence)? (?:from|in)|vs\.?)\b/i.test(
      t,
    ) &&
    /\b(because|while|however|instead)\b/i.test(t)
  ) {
    found.push("specific_competitor_difference");
    found.push("competitor_difference");
  }

  if (
    /\b(trade-?off|trade off|at the (?:cost|expense) of|you (?:gain|lose|sacrifice))\b/i.test(
      t,
    ) &&
    t.length > 80
  ) {
    found.push("specific_plan_tradeoff");
    found.push("specific_tradeoff");
  }

  if (
    /\b(plan (?:trade-?off|jumps|caps|limits)|starter vs|free vs paid|seat tier)\b/i.test(
      t,
    )
  ) {
    found.push("specific_plan_tradeoff");
  }

  if (
    /\b(use[- ]case|for (?:outbound|inbound|support|pipeline|onboarding) (?:teams|workflows)|scenario:)\b/i.test(
      t,
    ) &&
    /\b(recommend|prefer|choose|pick|use|advantage)\b/i.test(t)
  ) {
    found.push("specific_use_case_advantage");
    found.push("use_case_recommendation");
  }

  return [...new Set(found)];
}

/** Count only canonical Phase-2 signals (ignore deprecated aliases). */
export function countCanonicalUniqueSignals(
  signals: UniqueAnalysisSignal[],
): number {
  const canonical = new Set(
    signals.filter((s) => s.startsWith("specific_")),
  );
  return canonical.size;
}

export function phraseFingerprint(
  normalized: string,
  maxLen = 120,
): string | null {
  const tokens = tokenizeEditorial(normalized).slice(0, 18);
  if (tokens.length < 8) return null;
  return tokens.join(" ").slice(0, maxLen);
}
