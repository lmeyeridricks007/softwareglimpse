import { NextResponse } from "next/server";
import { suggestSearch } from "@/services/search";

/**
 * Compact autocomplete for header + search hero.
 * Same index/scoring as /search — no separate search logic.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length > 80) {
    return NextResponse.json(
      { query: q, suggestions: [], seeAllHref: "/search/" },
      { status: 400 },
    );
  }

  const result = suggestSearch(q);
    return NextResponse.json(result, {
    headers: {
      "Cache-Control":
        "public, max-age=3600, stale-while-revalidate=86400, s-maxage=3600",
    },
  });
}
