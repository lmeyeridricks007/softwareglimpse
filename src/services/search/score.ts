import { synonymBoostTerms } from "./synonyms";
import { fuzzyRatio, isCloseTypo } from "./fuzzy";
import type { SearchDocument, SearchIntent, ScoredSearchHit } from "./types";

function includesToken(haystack: string, token: string): boolean {
  return haystack.includes(token);
}

/**
 * Score a document against a query.
 * Importance / type priors only apply after a real text or relationship match.
 */
function scoreAgainstQuery(
  doc: SearchDocument,
  query: string,
  tokens: string[],
  intent: SearchIntent,
): { score: number; reasons: string[]; matched: boolean } {
  const title = doc.title.toLowerCase();
  const slug = doc.slug.toLowerCase();
  const summary = doc.summary.toLowerCase();
  const aliases = doc.aliases.map((a) => a.toLowerCase());
  const terms = doc.searchTerms.map((t) => t.toLowerCase());
  const reasons: string[] = [];
  let score = 0;

  if (query === title || query === slug) {
    score += 120;
    reasons.push("exact-title");
  } else if (aliases.includes(query)) {
    score += 110;
    reasons.push("exact-alias");
  } else if (slug === query.replace(/\s+/g, "-")) {
    score += 100;
    reasons.push("exact-slug");
  }

  if (title.startsWith(query) || query.startsWith(title)) {
    score += 55;
    reasons.push("title-prefix");
  } else if (query.length >= 3 && (title.includes(query) || query.includes(title))) {
    score += 40;
    reasons.push("title-contains");
  }

  const slugQuery = query.replace(/\s+/g, "-");
  if (slugQuery.length >= 3 && slug.includes(slugQuery)) {
    score += 28;
    reasons.push("slug-match");
  }

  for (const token of tokens) {
    if (token.length < 2) continue;
    // Ignore ultra-generic tokens unless they are the full query
    const generic = token === "vs" || token === "for" || token === "and" || token === "the";
    if (generic) continue;

    if (title === token || slug === token) {
      score += 22;
      reasons.push("token-exact");
    } else if (includesToken(title, token)) {
      score += 12;
      reasons.push("token-title");
    } else if (aliases.some((a) => a === token || includesToken(a, token))) {
      score += 14;
      reasons.push("token-alias");
    } else if (terms.some((t) => t === token || (token.length >= 4 && includesToken(t, token)))) {
      score += 8;
      reasons.push("token-terms");
    } else if (token.length >= 4 && includesToken(summary, token)) {
      score += 4;
      reasons.push("token-summary");
    }
  }

  for (const syn of synonymBoostTerms(query)) {
    if (syn.length < 3) continue;
    if (title.includes(syn) || terms.some((t) => t.includes(syn))) {
      score += 10;
      reasons.push("synonym");
      break;
    }
  }

  if (
    score < 40 &&
    (isCloseTypo(query, title) || aliases.some((a) => isCloseTypo(query, a)))
  ) {
    score += 70;
    reasons.push("fuzzy-title");
  } else if (score < 40 && query.length >= 5) {
    const ratio = Math.max(
      fuzzyRatio(query, title),
      ...aliases.map((a) => fuzzyRatio(query, a)),
      0,
    );
    if (ratio >= 0.86) {
      score += 50;
      reasons.push("fuzzy-ratio");
    }
  }

  if (intent.productSlugs.length > 0) {
    const related = intent.productSlugs.some((id) => doc.productIds.includes(id));
    if (related) {
      // Relationship alone is enough for related comparisons/guides when entity intent
      const relBoost = doc.type === "SOFTWARE" ? 35 : 18;
      if (score > 0 || intent.kind === "entity" || intent.kind === "pricing") {
        score += relBoost;
        reasons.push("entity-relationship");
      }
    }
    if (doc.type === "SOFTWARE" && intent.productSlugs.includes(doc.slug)) {
      score += 40;
      reasons.push("entity-self");
    }
  }

  const matched = score > 0;
  if (!matched) {
    return { score: 0, reasons: [], matched: false };
  }

  const preferredIndex = intent.preferredTypes.indexOf(doc.type);
  if (preferredIndex === 0) {
    score += 24;
    reasons.push("intent-primary");
  } else if (preferredIndex > 0) {
    score += Math.max(8, 18 - preferredIndex * 2);
    reasons.push("intent-preferred");
  }

  if (intent.kind === "comparison" && doc.type === "COMPARISON") {
    score += 30;
    reasons.push("comparison-intent");
  }

  score += Math.min(20, doc.importance / 5);
  if (typeof doc.contentQuality === "number") {
    score += Math.min(8, doc.contentQuality / 20);
  }

  return { score, reasons: [...new Set(reasons)], matched: true };
}

export function scoreDocuments(
  documents: SearchDocument[],
  intent: SearchIntent,
  pool?: SearchDocument[],
): ScoredSearchHit[] {
  const query = intent.normalizedQuery;
  if (!query) return [];

  const candidates = pool ?? documents;

  const scored = candidates
    .map((document) => {
      const { score, reasons, matched } = scoreAgainstQuery(
        document,
        query,
        intent.tokens,
        intent,
      );
      return { document, score, matchReasons: reasons, matched };
    })
    .filter((hit) => hit.matched && hit.score >= 24)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.document.importance - a.document.importance ||
        a.document.title.localeCompare(b.document.title),
    )
    .map(({ document, score, matchReasons }) => ({
      document,
      score,
      matchReasons,
    }));

  return scored;
}
