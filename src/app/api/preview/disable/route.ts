import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/**
 * Disable Draft Mode and return to the requested path (default `/`).
 *
 * Usage: GET /api/preview/disable?slug=/software/pipedrive/
 * Prefer POST for cookie mutation when calling from forms.
 */
export async function GET(request: Request) {
  return disableAndRedirect(request);
}

export async function POST(request: Request) {
  return disableAndRedirect(request);
}

async function disableAndRedirect(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || searchParams.get("path") || "/";
  const path = slug.startsWith("/") ? slug : `/${slug}`;

  const draft = await draftMode();
  draft.disable();

  if (request.method === "POST") {
    return NextResponse.redirect(new URL(path, request.url));
  }

  redirect(path);
}
