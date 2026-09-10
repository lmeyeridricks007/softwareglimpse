import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import localeCutover from "../config/legacy-locale-cutover.json";
import { resolveEnglishOnlyCutover } from "@/seo/english-only-cutover";

/**
 * English-only legacy crawl enforcement (Next.js 16 Proxy).
 *
 * - Mapped locale URLs → permanent redirect to English canonical
 * - Unmapped locale / WP taxonomy / feeds → 410 Gone
 * - Author archives → 404
 * - Never redirects to the homepage
 *
 * Exact EN legacy article redirects remain in `next.config.ts` via
 * `config/legacy-redirects.json` (smaller set; within Next redirect limits).
 * Locale cutover (2.5k+ URLs) lives here to avoid next.config size limits.
 */

type LocaleCutoverFile = {
  redirects?: Record<string, string>;
};

const LOCALE_REDIRECTS: Record<string, string> =
  (localeCutover as LocaleCutoverFile).redirects ?? {};

const GONE_BODY = "Gone";
const NOT_FOUND_BODY = "Not Found";

function goneResponse(): NextResponse {
  return new NextResponse(GONE_BODY, {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

function notFoundResponse(): NextResponse {
  return new NextResponse(NOT_FOUND_BODY, {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const result = resolveEnglishOnlyCutover(pathname, LOCALE_REDIRECTS);

  if (result.action === "redirect" && result.destination) {
    const url = request.nextUrl.clone();
    url.pathname = result.destination;
    url.search = "";
    url.hash = "";
    return NextResponse.redirect(url, 301);
  }

  if (result.action === "gone") {
    return goneResponse();
  }

  if (result.action === "not_found") {
    return notFoundResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/fr",
    "/fr/:path*",
    "/de",
    "/de/:path*",
    "/es",
    "/es/:path*",
    "/nl",
    "/nl/:path*",
    "/zh",
    "/zh/:path*",
    "/hi",
    "/hi/:path*",
    "/ar",
    "/ar/:path*",
    "/pt",
    "/pt/:path*",
    "/it",
    "/it/:path*",
    "/ja",
    "/ja/:path*",
    "/tag",
    "/tag/:path*",
    "/category",
    "/category/:path*",
    "/author",
    "/author/:path*",
    "/feed",
    "/feed/:path*",
    "/comments/feed",
    "/comments/feed/:path*",
  ],
};
