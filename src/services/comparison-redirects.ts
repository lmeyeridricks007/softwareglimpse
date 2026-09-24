import { getAllComparisonsUnfiltered } from "@/data";
import {
  isCanonicalComparisonSlug,
  reverseComparisonSlug,
} from "@/domain/comparison-slug";
import { isEntityIndexable } from "@/domain/quality-gates";
import { SOFTWARE_HUB_TAB_SLUGS } from "@/services/software-review/hub-tabs";

export type NextRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

/**
 * Permanent redirects for reverse comparison aliases.
 * Only indexable canonical documents are targets, matching sitemap SSG.
 */
export function comparisonReverseRedirects(): NextRedirect[] {
  const out: NextRedirect[] = [];
  const seen = new Set<string>();

  for (const item of getAllComparisonsUnfiltered()) {
    if (!isCanonicalComparisonSlug(item.slug)) continue;
    if (!isEntityIndexable({ kind: "comparison", entity: item })) continue;
    const reverse = reverseComparisonSlug(item.slug);
    if (!reverse || reverse === item.slug) continue;
    const destination = `/compare/${item.slug}/`;
    for (const source of [`/compare/${reverse}`, `/compare/${reverse}/`]) {
      if (seen.has(source)) continue;
      seen.add(source);
      out.push({ source, destination, permanent: true });
    }
  }

  return out;
}

/** Old noindex tab documents → the canonical software page, tab in the query. */
export function softwareTabRedirects(): NextRedirect[] {
  const out: NextRedirect[] = [];
  for (const tab of SOFTWARE_HUB_TAB_SLUGS) {
    const destination = `/software/:slug/?tab=${tab}`;
    out.push(
      { source: `/software/:slug/${tab}`, destination, permanent: true },
      { source: `/software/:slug/${tab}/`, destination, permanent: true },
    );
  }
  return out;
}
