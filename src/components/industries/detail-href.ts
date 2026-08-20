/**
 * True only for navigable page paths — not in-page anchors.
 * Rejects `#section` and `/path/#section` style hrefs.
 */
export function isPageDetailHref(href?: string | null): boolean {
  if (!href) return false;
  const trimmed = href.trim();
  if (!trimmed.startsWith("/")) return false;
  if (trimmed.startsWith("#")) return false;
  if (trimmed.includes("/#") || trimmed.includes("#")) return false;
  return true;
}

/** Drop hash / self-anchor hrefs so UI does not fake a detail navigation. */
export function sanitizePageDetailHref(
  href?: string | null,
): string | undefined {
  return isPageDetailHref(href) ? href! : undefined;
}
