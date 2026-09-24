/**
 * Blob media rewrites.
 *
 * A catch-all `/:path*` fallback does not run when the path matches a dynamic
 * route (`matchesPage` in Next's rewrite handler). Guide heroes such as
 * `/guides/file.png` match `/guides/[slug]`. Those files are rewritten in
 * `afterFiles`, and only when the path has a media extension, so HTML routes
 * still reach the App Router. The same file rules are also listed as `fallback`
 * for media paths that no route claims (for example nested software diagrams
 * after the tab route is gone).
 */

export const BLOB_MEDIA_FOLDERS = [
  "guides",
  "software",
  "capabilities",
  "use-cases",
  "vendor-ui",
  "industries",
  "features",
  "resources",
  "requirements",
  "for",
] as const;

const MEDIA_EXTENSIONS = [
  "png",
  "webp",
  "avif",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "mp4",
  "webm",
] as const;

export type BlobRewrite = { source: string; destination: string };

export function blobMediaFileRewrites(blobHost: string): BlobRewrite[] {
  const blob = blobHost.replace(/\/$/, "");
  const rules: BlobRewrite[] = [];
  for (const folder of BLOB_MEDIA_FOLDERS) {
    for (const ext of MEDIA_EXTENSIONS) {
      rules.push(
        {
          source: `/${folder}/:file.${ext}`,
          destination: `${blob}/${folder}/:file.${ext}`,
        },
        {
          source: `/${folder}/:a/:file.${ext}`,
          destination: `${blob}/${folder}/:a/:file.${ext}`,
        },
        {
          source: `/${folder}/:a/:b/:file.${ext}`,
          destination: `${blob}/${folder}/:a/:b/:file.${ext}`,
        },
      );
    }
  }
  return rules;
}
