import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/**
 * Enable Next.js Draft Mode for editorial preview.
 *
 * Usage: GET /api/preview?secret=$PREVIEW_SECRET&slug=/software/pipedrive/
 *
 * Preview is always noindex at the page layer when draftMode is enabled;
 * sitemap continues to use isEntityIndexable without draftMode.
 */
export async function GET(request: Request) {
  const secret = process.env.PREVIEW_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "PREVIEW_SECRET is not configured" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const token = searchParams.get("secret");
  if (token !== secret) {
    return NextResponse.json({ error: "Invalid preview secret" }, { status: 401 });
  }

  const slug = searchParams.get("slug") || searchParams.get("path") || "/";
  const requested = slug.startsWith("/") ? slug : `/${slug}`;
  const path = toPreviewPath(requested);

  const draft = await draftMode();
  draft.enable();

  redirect(path);
}

function toPreviewPath(path: string): string {
  if (path.startsWith("/preview/")) return path;
  if (path.startsWith("/software/")) {
    return path.replace(/^\/software\//, "/preview/software/");
  }
  if (path.startsWith("/guides/")) {
    return path.replace(/^\/guides\//, "/preview/guides/");
  }
  return path;
}
