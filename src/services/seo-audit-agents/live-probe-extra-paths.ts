/**
 * Extra live-probe paths beyond REPRESENTATIVE_ROUTES — covers lifecycle
 * samples, legacy cutover, and parameterized URL hygiene required by production
 * integrity verification.
 */
import { normalizePath } from "@/seo/canonical";

/**
 * Paths always appended in FULL live mode (deduped against representative set).
 * Includes INDEXABLE + IMPROVE samples, research/alternatives, and legacy
 * redirect / 410 / locale / query-param cases.
 */
export const FULL_LIVE_EXTRA_PATHS: string[] = [
  // INDEXABLE / IMPROVE content samples
  "/guides/what-is-crm/",
  "/guides/zoho-crm-setup/",
  "/compare/hubspot-vs-pipedrive/",
  "/compare/crisp-vs-tidio/",
  "/best/crm-software/",
  "/best/social-media-marketing-software/",
  "/alternatives/pipedrive/",
  "/research/crm-pricing/",
  "/categories/crm/",
  "/use-cases/pipeline-management/",
  "/industries/financial-services/",
  "/software/pipedrive/",
  "/tools/crm-finder/",
  "/tools/software-finder/",

  // Legacy EN root redirect (next.config redirects)
  "/5-ways-marketing-apis-boost-your-marketing-operations/",
  "/category/crm/",

  // Locale: mapped permanent redirect (never multilingual 200)
  "/fr/mon-histoire/",

  // Locale: intentional 410 (root + unmapped)
  "/fr/",
  "/de/",

  // Taxonomy obsolete → 410
  "/tag/pipedrive/",
  "/category/random-thin-tag-xyz/",

  // Parameterized URL (must not leak into canonical / indexing)
  "/software/pipedrive/?utm_source=seo-audit&ref=live-probe",
].map((p) => normalizePath(p.split("?")[0]!));

/** Preserve query-bearing samples separately for request URL construction. */
export const FULL_LIVE_QUERY_SAMPLES: string[] = [
  "/software/pipedrive/?utm_source=seo-audit&ref=live-probe",
];

/**
 * Intentional redirect / retirement samples — probing them MUST hop.
 * Live auditors should not treat the hop (or destination schema) as a defect
 * on the request path.
 */
export const INTENTIONAL_REDIRECT_PROBE_PATHS: ReadonlySet<string> = new Set(
  [
    "/5-ways-marketing-apis-boost-your-marketing-operations/",
    "/category/crm/",
    "/fr/mon-histoire/",
  ].map((p) => normalizePath(p)),
);

export const INTENTIONAL_GONE_PROBE_PATHS: ReadonlySet<string> = new Set(
  ["/fr/", "/de/", "/tag/pipedrive/", "/category/random-thin-tag-xyz/"].map(
    (p) => normalizePath(p),
  ),
);
