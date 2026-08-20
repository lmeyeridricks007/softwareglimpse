/**
 * Resolve a direct commercial visit href for page models.
 * Prefer this over hard-coding `/go/{slug}`.
 */
import type { CommercialCtaContext } from "@/domain";
import { resolveCommercialCta } from "@/services/affiliate/resolve-cta";

export type VisitCtaModel = {
  href: string;
  isAffiliate: boolean;
  rel: string[];
  label: string;
  goPath: string | null;
};

export function resolveVisitCta(
  productSlug: string,
  context: CommercialCtaContext = "other",
): VisitCtaModel | null {
  const resolved = resolveCommercialCta({
    productSlug,
    context,
  });
  if (!resolved.available || !resolved.externalUrl) return null;
  return {
    href: resolved.externalUrl,
    isAffiliate: resolved.affiliate,
    rel: resolved.rel,
    label: resolved.label,
    goPath: resolved.goPath,
  };
}

/** Map of product slug → visit CTA for client components (e.g. Finder). */
export function buildVisitCtaMap(
  productSlugs: string[],
  context: CommercialCtaContext = "finder",
): Record<string, VisitCtaModel> {
  const map: Record<string, VisitCtaModel> = {};
  for (const slug of productSlugs) {
    const cta = resolveVisitCta(slug, context);
    if (cta) map[slug] = cta;
  }
  return map;
}
