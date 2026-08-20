import type { UrlMappingRow } from "../mapping-agent/types";
import { normalizeMigrationPath } from "../normalize";

/** Existing in-app feature aliases already in next.config / canonical.ts */
export const EXISTING_APP_ALIASES: Array<{
  source: string;
  destination: string;
  reason: string;
}> = [
  {
    source: "/features/call-functionality/",
    destination: "/features/calling/",
    reason: "In-app feature slug rename",
  },
  {
    source: "/features/reporting/",
    destination: "/features/reporting-dashboards/",
    reason: "In-app feature slug rename",
  },
  {
    source: "/best-crm-for-plumbers/",
    destination: "/industries/plumbing/",
    reason: "Legacy vertical best-CRM → plumbing industry hub",
  },
  {
    source: "/best-crm-solar-businesses/",
    destination: "/industries/solar/",
    reason: "Legacy vertical best-CRM → solar industry hub",
  },
  {
    source: "/best-crm-for-event-management/",
    destination: "/industries/event-management/",
    reason: "Legacy vertical best-CRM → event-management industry hub",
  },
  {
    source: "/best-private-equity-crm/",
    destination: "/industries/private-equity/",
    reason: "Legacy vertical best-CRM → private-equity industry hub",
  },
  {
    source: "/best-crm-venture-capital/",
    destination: "/industries/venture-capital/",
    reason: "Legacy vertical best-CRM → venture-capital industry hub",
  },
  {
    source: "/best-crm-for-photographers/",
    destination: "/industries/photography/",
    reason: "Legacy vertical best-CRM → photography industry hub",
  },
  {
    source: "/best-crm-for-coaches/",
    destination: "/industries/coaching/",
    reason: "Legacy vertical best-CRM → coaching industry hub",
  },
  {
    source: "/best-crm-for-investor-relations/",
    destination: "/industries/investor-relations/",
    reason: "Legacy vertical best-CRM → investor-relations industry hub",
  },
  {
    source: "/best-crm-engineering/",
    destination: "/industries/engineering/",
    reason: "Legacy vertical best-CRM → engineering industry hub",
  },
  {
    source: "/best-crm-for-musicians/",
    destination: "/industries/music/",
    reason: "Legacy vertical best-CRM → music industry hub",
  },
  {
    source: "/best-crm-for-web-designers/",
    destination: "/industries/web-design/",
    reason: "Legacy vertical best-CRM → web-design industry hub",
  },
  {
    source: "/crm-for-security-companies/",
    destination: "/industries/security-companies/",
    reason: "Legacy vertical CRM page → security-companies industry hub",
  },
  // Editorial REVIEW backlog — launch-approved manual redirects (2026-08-19)
  {
    source: "/crm-reviews/",
    destination: "/categories/crm/",
    reason: "Legacy CRM reviews hub → CRM category index",
  },
  {
    source: "/hubspot-crm-case-study/",
    destination: "/software/hubspot/",
    reason: "Legacy HubSpot case study → HubSpot product page",
  },
  {
    source: "/crm-comparisons/",
    destination: "/compare/",
    reason: "Legacy CRM comparisons hub → compare index",
  },
  {
    source: "/crm-guide/",
    destination: "/guides/what-is-crm/",
    reason: "Legacy CRM guide → what-is-crm guide",
  },
  {
    source: "/comparing-microsoft-dynamics-crm/",
    destination: "/software/dynamics-365/",
    reason: "Legacy Dynamics comparison article → Dynamics 365 product page",
  },
  {
    source: "/best-crm-systems-for-small-nonprofits/",
    destination: "/industries/nonprofit/",
    reason: "Legacy nonprofit best-CRM list → nonprofit industry hub",
  },
  {
    source: "/top-crm-features-financial-advisors/",
    destination: "/industries/financial-services/",
    reason: "Legacy financial-advisors CRM features → financial-services industry hub",
  },
  {
    source: "/nimble-crm-review/",
    destination: "/software/nimble/",
    reason: "Legacy Nimble review → Nimble product page",
  },
  {
    source: "/zendesk-crm-review/",
    destination: "/software/zendesk/",
    reason: "Legacy Zendesk Sell review → Zendesk product page",
  },
  {
    source: "/mailchimp-crm-review/",
    destination: "/software/mailchimp/",
    reason: "Legacy Mailchimp review → Mailchimp product page",
  },
  {
    source: "/mailchimp-crm-review-2/",
    destination: "/software/mailchimp/",
    reason: "Legacy duplicate Mailchimp review → Mailchimp product page",
  },
  {
    source: "/netsuite-crm-review/",
    destination: "/software/netsuite/",
    reason: "Legacy NetSuite review → NetSuite product page",
  },
  {
    source: "/wealthbox-crm-review/",
    destination: "/software/wealthbox/",
    reason: "Legacy Wealthbox review → Wealthbox product page",
  },
  {
    source: "/pipelinepro-review/",
    destination: "/software/pipelinepro/",
    reason: "Legacy PipelinePro review → PipelinePro product page",
  },
  {
    source: "/cloze-crm-review/",
    destination: "/software/cloze/",
    reason: "Legacy Cloze review → Cloze product page",
  },
  {
    source: "/pega-crm-review/",
    destination: "/software/pega/",
    reason: "Legacy Pega review → Pega product page",
  },
  {
    source: "/affinity-crm-review/",
    destination: "/software/affinity/",
    reason: "Legacy Affinity review → Affinity product page",
  },
  {
    source: "/apptivo-crm-review/",
    destination: "/software/apptivo/",
    reason: "Legacy Apptivo review → Apptivo product page",
  },
  {
    source: "/podio-crm-review/",
    destination: "/software/podio/",
    reason: "Legacy Podio review → Podio product page",
  },
  {
    source: "/salesforce-vs-monday/",
    destination: "/compare/monday-sales-crm-vs-salesforce/",
    reason: "Legacy Salesforce vs Monday → canonical monday sales CRM vs Salesforce compare",
  },
  {
    source: "/hubspot-vs-monday/",
    destination: "/compare/hubspot-vs-monday-sales-crm/",
    reason: "Legacy HubSpot vs Monday → canonical HubSpot vs monday sales CRM compare",
  },
  {
    source: "/salesforce-vs-marketo/",
    destination: "/compare/marketo-vs-salesforce/",
    reason: "Legacy Salesforce vs Marketo → materialized marketo-vs-salesforce compare",
  },
  {
    source: "/tidio-vs-hubspot/",
    destination: "/compare/hubspot-vs-tidio/",
    reason: "Legacy Tidio vs HubSpot → materialized hubspot-vs-tidio compare",
  },
  {
    source: "/tidio-vs-zendesk/",
    destination: "/compare/tidio-vs-zendesk/",
    reason: "Legacy Tidio vs Zendesk → materialized tidio-vs-zendesk compare",
  },
];

const LAUNCH_APPROVED_BASES = new Set([
  "explicit_historical",
  "same_product",
  "same_comparison_pair",
  "same_category_cluster",
  "exact_title_topic",
  "same_guide_intent",
  "semantic_similarity",
]);

function isAllowlistedDestination(dest: string): boolean {
  const normalized = normalizeMigrationPath(dest);
  if (normalized === "/guides/" || normalized === "/compare/") return true;
  return (
    normalized.startsWith("/software/") ||
    normalized.startsWith("/compare/") ||
    normalized.startsWith("/guides/") ||
    normalized.startsWith("/industries/") ||
    normalized.startsWith("/for/") ||
    normalized.startsWith("/use-cases/") ||
    normalized.startsWith("/best/") ||
    normalized.startsWith("/categories/") ||
    normalized.startsWith("/features/") ||
    normalized.startsWith("/capabilities/") ||
    normalized.startsWith("/alternatives/") ||
    normalized.startsWith("/legal/") ||
    normalized.startsWith("/company/")
  );
}

function isRedirectCandidate(row: UrlMappingRow): boolean {
  if (row.recommendedAction === "301_REDIRECT" || row.recommendedAction === "MERGE_AND_301") {
    return true;
  }
  // Mapped REVIEW rows still need a redirect when a destination exists.
  return row.recommendedAction === "REVIEW" && Boolean(row.newPath);
}

/**
 * Decide whether a mapping row is auto-approved for permanent redirect implementation.
 * Launch policy: implement all mapped entity/cluster/guide redirects with validated destinations.
 */
export function isAutoApprovedRedirect(row: UrlMappingRow): {
  approved: boolean;
  reason: string;
} {
  if (!isRedirectCandidate(row)) {
    return { approved: false, reason: "Action is not a redirect" };
  }
  if (!row.newPath) {
    return { approved: false, reason: "No destination" };
  }

  const dest = normalizeMigrationPath(row.newPath);
  const source = normalizeMigrationPath(row.legacyPath);
  if (dest === "/") {
    return {
      approved: false,
      reason: "Homepage dump redirects are forbidden",
    };
  }
  if (source === dest) {
    return { approved: false, reason: "Source equals destination" };
  }

  const basis = row.matchBasis;
  if (!LAUNCH_APPROVED_BASES.has(basis)) {
    return {
      approved: false,
      reason: `Match basis ${basis} is not launch-approved`,
    };
  }

  if (
    (basis === "same_category_cluster" || basis === "semantic_similarity") &&
    !isAllowlistedDestination(dest)
  ) {
    return {
      approved: false,
      reason: "Cluster/semantic destination not in launch allowlist",
    };
  }

  if (basis === "same_guide_intent" && !dest.startsWith("/guides/")) {
    return {
      approved: false,
      reason: "Guide-intent merge must target /guides/",
    };
  }

  if (
    (basis === "same_product" ||
      basis === "same_comparison_pair" ||
      basis === "explicit_historical" ||
      basis === "exact_title_topic") &&
    !isAllowlistedDestination(dest)
  ) {
    return {
      approved: false,
      reason: "Entity redirect destination not in launch allowlist",
    };
  }

  return {
    approved: true,
    reason: `Launch-approved ${basis} mapping (${row.confidence} confidence)`,
  };
}

/** WordPress infrastructure patterns — retire, do not regex-catch new app routes. */
export const WORDPRESS_RETIRED_PATTERNS: Array<{
  sourcePattern: string;
  action: "404" | "410";
  reason: string;
}> = [
  {
    sourcePattern: "/tag/:slug*",
    action: "410",
    reason: "WP tag archives — low-value taxonomy (exact paths preferred over broad catch-alls in Next; documented for ops)",
  },
  {
    sourcePattern: "/author/:slug*",
    action: "404",
    reason: "WP author archives not in new IA",
  },
  {
    sourcePattern: "/feed",
    action: "410",
    reason: "WP feed URL",
  },
  {
    sourcePattern: "/comments/feed",
    action: "410",
    reason: "WP comments feed",
  },
];

/**
 * Flatten A→B, B→C into A→C within a redirect map.
 * Returns flattened map + count of hops collapsed.
 */
export function flattenRedirectChains(
  pairs: Array<{ source: string; destination: string }>,
): {
  flattened: Array<{ source: string; destination: string }>;
  chainsFlattened: number;
} {
  const map = new Map<string, string>();
  for (const p of pairs) {
    map.set(
      normalizeMigrationPath(p.source),
      normalizeMigrationPath(p.destination),
    );
  }

  let chainsFlattened = 0;
  const resolve = (start: string): string => {
    let current = start;
    const seen = new Set<string>();
    while (map.has(current)) {
      if (seen.has(current)) {
        // cycle — stop
        break;
      }
      seen.add(current);
      const next = map.get(current)!;
      if (seen.size > 1) chainsFlattened += 1;
      current = next;
      if (seen.size > 10) break;
    }
    return current;
  };

  const flattened: Array<{ source: string; destination: string }> = [];
  for (const source of map.keys()) {
    const destination = resolve(source);
    if (source === destination) continue;
    flattened.push({ source, destination });
  }

  // Deduplicate by source (keep first)
  const bySource = new Map<string, string>();
  for (const row of flattened) {
    bySource.set(row.source, row.destination);
  }
  return {
    flattened: [...bySource.entries()].map(([source, destination]) => ({
      source,
      destination,
    })),
    chainsFlattened,
  };
}

/** Emit Next.js redirect sources with and without trailing slash (except root). */
export function nextRedirectSources(pathWithSlash: string): string[] {
  const normalized = normalizeMigrationPath(pathWithSlash);
  if (normalized === "/") return ["/"];
  const noSlash = normalized.replace(/\/$/, "");
  return [noSlash, normalized];
}
