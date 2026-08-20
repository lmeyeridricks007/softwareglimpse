import {
  firstPublicCopy,
  isInternalEditorialCopy,
  publicCopy,
} from "@/services/category-hub/public-copy";

/** Extra comparison-page phrases that read like research metadata. */
const COMPARISON_INTERNAL: RegExp[] = [
  /\bstronger on current evidence\b/i,
  /\bweaker on current evidence\b/i,
  /\bresearch shows comparable support\b/i,
  /\bcurrent verified pricing\b/i,
  /\bcriterion-based outcome\b/i,
  /\bcore icp\b/i,
  /\bpackaging and pricing\b/i,
  /\bon current evidence\b/i,
  /\bpending deeper research\b/i,
  /\bnot resolved by fixtures?\b/i,
  /\bfixture research\b/i,
  /\bprovisional and not an approved\b/i,
  /\bprefer .+ researched strengths\b/i,
  /\bstronger researched coverage\b/i,
  /\bcomparable support on\b/i,
  /\bshows stronger researched availability\b/i,
  /\bresearched side-by-side\b/i,
  /\bcriterion fit\b/i,
  /\bthis researched comparison\b/i,
];

function humanizeFeatureToken(token: string): string {
  return token
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .toLowerCase();
}

function humanizeFeatureList(raw: string): string {
  return raw
    .split(/,\s*/)
    .map((part) => humanizeFeatureToken(part.trim()))
    .filter(Boolean)
    .join(", ");
}

/** Map known research phrases into buyer-facing copy when meaning is clear. */
const BUYER_REWRITES: Array<{
  pattern: RegExp;
  replace: string | ((match: RegExpMatchArray) => string);
}> = [
  {
    pattern: /^core icp for .+ packaging and pricing$/i,
    replace: "Teams that want straightforward, accessible CRM packaging",
  },
  {
    pattern: /^prefer .+ researched strengths$/i,
    replace: "",
  },
  {
    pattern: /current research shows comparable support on (.+)\.?$/i,
    replace: (m) => `Comparable support for ${humanizeFeatureList(m[1] ?? "")}`,
  },
  {
    pattern: /^(.+) has stronger researched coverage across (.+)\.?$/i,
    replace: (m) =>
      `Stronger coverage across ${humanizeFeatureList(m[2] ?? "")}`,
  },
  {
    pattern: /^(.+): (.+) shows stronger researched availability.+$/i,
    replace: (m) => `Stronger ${humanizeFeatureToken(m[1] ?? "")} availability`,
  },
  {
    pattern: /^communication-centric crm fits smb outbound teams$/i,
    replace: "Outbound sales teams that need a communication-centric CRM",
  },
  {
    pattern: /^sales-first calling\/email\/sms crm$/i,
    replace: "Teams that rely on calling, email, and SMS from the CRM",
  },
  {
    pattern:
      /^pipelines, contacts, and lightweight automation fit smb sales$/i,
    replace:
      "SMB sales teams that want pipelines, contacts, and light automation",
  },
  {
    pattern: /^free plan for up to 2 users; starter \$18 is accessible$/i,
    replace:
      "Small teams that want a free plan or an accessible paid entry tier",
  },
  {
    pattern:
      /^growth\/scale add dialing power and advanced chloe workflows$/i,
    replace: "Teams that need dialing power and advanced outreach workflows",
  },
  {
    pattern:
      /there is no universal winner between (.+) and (.+)\. choose based on criterion fit — .+ researched comparison\.?/i,
    replace: (m) =>
      `There is no universal winner between ${m[1]} and ${m[2]}. Choose based on pipeline depth, automation, email and calling, reporting, and pricing trade-offs.`,
  },
];

export function isComparisonInternalCopy(
  text: string | null | undefined,
): boolean {
  if (!text?.trim()) return true;
  if (isInternalEditorialCopy(text)) return true;
  return COMPARISON_INTERNAL.some((re) => re.test(text));
}

export function rewriteComparisonCopy(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  for (const rule of BUYER_REWRITES) {
    const match = trimmed.match(rule.pattern);
    if (!match) continue;
    const next =
      typeof rule.replace === "function"
        ? rule.replace(match).trim()
        : trimmed.replace(rule.pattern, rule.replace).trim();
    return next.length > 0 ? next : null;
  }
  return null;
}

export function comparisonPublicCopy(
  text: string | null | undefined,
  fallback?: string,
): string | null {
  if (!text?.trim()) return fallback ?? null;
  const rewritten = rewriteComparisonCopy(text);
  if (rewritten) return rewritten;
  if (isComparisonInternalCopy(text)) return fallback ?? null;
  return publicCopy(text, fallback);
}

export function firstComparisonPublicCopy(
  candidates: Array<string | null | undefined>,
  fallback?: string,
): string | null {
  for (const c of candidates) {
    const ok = comparisonPublicCopy(c);
    if (ok) return ok;
  }
  return firstPublicCopy(candidates, fallback);
}

/** Soften research reasons into short buyer-facing labels when possible. */
export function buyerFacingOutcomeLabel(input: {
  criterionName: string;
  winnerKind?: string | null;
  productName?: string | null;
  reason?: string | null;
}): string {
  const publicReason = comparisonPublicCopy(input.reason);
  if (publicReason) return publicReason;

  if (input.winnerKind === "tie") {
    return `Comparable on ${input.criterionName.toLowerCase()}`;
  }
  if (input.winnerKind === "depends") {
    return `Depends on your priorities for ${input.criterionName.toLowerCase()}`;
  }
  if (
    input.productName &&
    (input.winnerKind === "product-a" || input.winnerKind === "product-b")
  ) {
    return `Better for ${input.criterionName.toLowerCase()}`;
  }
  return `Not yet verified for ${input.criterionName.toLowerCase()}`;
}
