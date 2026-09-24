/**
 * Absolute Blob URL for known media folders when this build is serving media
 * from Blob. Local builds keep same-origin paths so `public/` files still work.
 * Deployment-id cache busters are dropped: artwork filenames already carry
 * content versions (`-v2`, `-v4`).
 */
import { BLOB_MEDIA_FOLDERS } from "@/lib/media/blob-rewrites";

const FOLDERS = new Set<string>(BLOB_MEDIA_FOLDERS);

export function resolvePublicMediaSrc(src: string | null | undefined): string {
  if (!src) return "";
  if (!src.startsWith("/")) return src.split("?")[0] ?? src;

  const host = (
    process.env.BLOB_PUBLIC_HOST ??
    process.env.NEXT_PUBLIC_BLOB_PUBLIC_HOST ??
    ""
  ).replace(/\/$/, "");
  const enabled =
    Boolean(host) &&
    (process.env.VERCEL === "1" || process.env.BLOB_MEDIA_REWRITES === "1");
  if (!enabled) return src.split("?")[0] ?? src;

  const pathOnly = src.split("?")[0] ?? src;
  const folder = pathOnly.split("/")[1] ?? "";
  if (!FOLDERS.has(folder)) return pathOnly;
  return `${host}${pathOnly}`;
}
