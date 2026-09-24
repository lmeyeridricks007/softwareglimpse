import { NextResponse } from "next/server";
import { runPublicSearch } from "@/services/search/public-query";

const CACHE_CONTROL =
  "public, max-age=3600, stale-while-revalidate=86400, s-maxage=3600";

/**
 * Cached results for the static /search shell.
 * Query variants stay off the RSC page so they do not create ISR entries.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const outcome = runPublicSearch(q, searchParams.get("type"));

  if (!outcome.ok) {
    return NextResponse.json(
      { error: "Query is too long.", query: outcome.query },
      { status: 400, headers: { "Cache-Control": "public, max-age=60" } },
    );
  }

  return NextResponse.json(
    {
      type: outcome.type,
      total: outcome.all.total,
      counts: outcome.all.counts,
      result: outcome.result,
    },
    { headers: { "Cache-Control": CACHE_CONTROL } },
  );
}
