import type { SearchDocument } from "./types";

export type SearchRuntimeIndex = {
  documents: SearchDocument[];
  tokenToDocIndices: Map<string, number[]>;
  softwareDocuments: SearchDocument[];
  softwareBySlug: Map<string, SearchDocument>;
};

const STOP_TOKENS = new Set([
  "vs",
  "for",
  "and",
  "the",
  "best",
  "with",
  "from",
]);

function indexTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/[\s-]+/)
    .filter((token) => token.length >= 2 && !STOP_TOKENS.has(token));
}

function addToken(
  tokenToDocIndices: Map<string, number[]>,
  token: string,
  docIndex: number,
): void {
  const bucket = tokenToDocIndices.get(token);
  if (bucket) {
    bucket.push(docIndex);
    return;
  }
  tokenToDocIndices.set(token, [docIndex]);
}

export function buildSearchRuntimeIndex(
  documents: SearchDocument[],
): SearchRuntimeIndex {
  const tokenToDocIndices = new Map<string, number[]>();

  documents.forEach((doc, docIndex) => {
    const tokens = new Set<string>();
    for (const token of indexTokens(doc.title)) tokens.add(token);
    for (const token of indexTokens(doc.slug)) tokens.add(token);
    for (const alias of doc.aliases) {
      for (const token of indexTokens(alias)) tokens.add(token);
    }
    for (const term of doc.searchTerms) {
      for (const token of indexTokens(term)) tokens.add(token);
    }

    for (const token of tokens) {
      addToken(tokenToDocIndices, token, docIndex);
    }
  });

  const softwareDocuments = documents.filter((doc) => doc.type === "SOFTWARE");
  const softwareBySlug = new Map(
    softwareDocuments.map((doc) => [doc.slug, doc]),
  );

  return {
    documents,
    tokenToDocIndices,
    softwareDocuments,
    softwareBySlug,
  };
}

/**
 * Narrow the scoring pool for multi-token queries. Returns null when a full scan
 * is cheaper or safer (short/generic queries, overly broad token matches).
 */
export function candidateDocuments(
  runtime: SearchRuntimeIndex,
  queryTokens: string[],
): SearchDocument[] | null {
  const meaningful = queryTokens.filter(
    (token) => token.length >= 2 && !STOP_TOKENS.has(token),
  );
  if (meaningful.length === 0) return null;

  const candidateIndices = new Set<number>();

  for (const token of meaningful) {
    const hits = runtime.tokenToDocIndices.get(token);
    if (!hits?.length) continue;
    for (const index of hits) candidateIndices.add(index);
  }

  if (candidateIndices.size === 0) return null;
  if (candidateIndices.size > runtime.documents.length * 0.65) return null;

  return [...candidateIndices]
    .sort((a, b) => a - b)
    .map((index) => runtime.documents[index]!);
}
