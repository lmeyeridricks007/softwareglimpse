import type {
  LegacyMigrationAuditSummary,
  LegacyUrlMigrationRecord,
  NewUrlInventoryRow,
} from "./types";

function countBy<T extends string>(
  rows: Array<Record<string, unknown>>,
  key: string,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const row of rows) {
    const v = String(row[key] ?? "unknown");
    out[v] = (out[v] ?? 0) + 1;
  }
  return out;
}

function mdTable(headers: string[], rows: string[][]): string {
  const head = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((r) => `| ${r.join(" | ")} |`).join("\n");
  return `${head}\n${sep}\n${body}`;
}

function esc(value: string | null | undefined): string {
  return (value ?? "").replace(/\|/g, "\\|");
}

export function buildAuditSummary(input: {
  records: LegacyUrlMigrationRecord[];
  newInventory: NewUrlInventoryRow[];
  legacySitemapUniqueLocs: number;
  legacyLocaleUrls: number;
}): LegacyMigrationAuditSummary {
  const { records, newInventory, legacySitemapUniqueLocs, legacyLocaleUrls } =
    input;
  const redirect = records.filter((r) =>
    ["301_REDIRECT", "MERGE_AND_301"].includes(r.recommendedAction),
  );
  const publicNew = newInventory.filter(
    (r) =>
      !["newsletter_utility", "privacy_utility", "pricing"].includes(
        r.pageType,
      ),
  );
  const legacyPaths = new Set(records.map((r) => r.legacyPath));
  const newOnly = publicNew.filter((r) => !legacyPaths.has(r.path));

  return {
    generatedAt: new Date().toISOString(),
    sources: {
      legacyHost: "https://www.softwareglimpse.com",
      sitemapIndex: "https://www.softwareglimpse.com/sitemap_index.xml",
      childSitemaps: [
        "post-sitemap.xml",
        "page-sitemap.xml",
        "category-sitemap.xml",
        "post_tag-sitemap.xml",
        "author-sitemap.xml",
        "kadence_element-sitemap.xml",
      ],
    },
    counts: {
      legacySitemapUniqueLocs,
      legacyLocaleUrls,
      legacyPrimaryEn: records.length,
      newPublicRoutes: publicNew.length,
      newSitemapEligible: newInventory.filter((r) => r.inSitemap).length,
      exactMatches: records.filter((r) => r.relationship === "EXACT").length,
      redirectCandidates: redirect.length,
      redirectCandidatesHighConfidence: redirect.filter(
        (r) => r.confidence === "HIGH",
      ).length,
      retirementCandidates: records.filter((r) =>
        ["404", "410"].includes(r.recommendedAction),
      ).length,
      manualReviewCandidates: records.filter(
        (r) => r.recommendedAction === "REVIEW",
      ).length,
      newOnlyRoutes: newOnly.length,
      highSeoRisk: records.filter((r) => r.seoRisk === "high").length,
    },
    limitations: [
      "Primary English inventory from Yoast XML sitemaps; not a full HTML link crawl of every template.",
      "Locale hreflang URLs (de/nl/es/fr/ar) counted separately — need a language cutover plan.",
      "Live page titles/canonicals/robots only sampled via HEAD for SEO-critical paths (full GET crawl deferred).",
      "Google Search Console / Bing indexed URL exports not imported in this pass.",
      "Internal link graph and redirect-chain detection across the live site are incomplete.",
      "Kadence element query URLs and media attachment URLs excluded from primary matching.",
      "No redirects were written to next.config.ts or hosting config.",
    ],
  };
}

/**
 * Render docs/migration/01-legacy-url-inventory.md contents.
 */
export function renderLegacyUrlInventoryMarkdown(input: {
  summary: LegacyMigrationAuditSummary;
  records: LegacyUrlMigrationRecord[];
  newInventory: NewUrlInventoryRow[];
}): string {
  const { summary, records, newInventory } = input;
  const c = summary.counts;

  const exact = records.filter((r) => r.relationship === "EXACT");
  const redirects = records
    .filter((r) =>
      ["301_REDIRECT", "MERGE_AND_301"].includes(r.recommendedAction),
    )
    .sort((a, b) => a.legacyPath.localeCompare(b.legacyPath));
  const highRedirects = redirects.filter((r) => r.confidence === "HIGH");
  const mediumRedirects = redirects.filter((r) => r.confidence !== "HIGH");

  const noEq = records
    .filter(
      (r) =>
        r.relationship === "NO_EQUIVALENT" &&
        ["product_review", "best_list", "comparison", "alternatives"].includes(
          String(r.legacyPageType),
        ),
    )
    .sort((a, b) => a.legacyPath.localeCompare(b.legacyPath));

  const duplicates = records.filter(
    (r) =>
      r.relationship === "DUPLICATE" ||
      r.recommendedAction === "410" ||
      /-\d+\/$/.test(r.legacyPath),
  );

  const liveRedirects = records.filter((r) => r.legacyRedirectTarget);

  const manual = records
    .filter(
      (r) =>
        r.recommendedAction === "REVIEW" &&
        (r.seoRisk === "high" ||
          ["product_review", "best_list", "comparison", "alternatives"].includes(
            String(r.legacyPageType),
          )),
    )
    .sort((a, b) => a.legacyPath.localeCompare(b.legacyPath));

  const byLegacyType = countBy(
    records as unknown as Array<Record<string, unknown>>,
    "legacyPageType",
  );
  const byNewType = countBy(
    newInventory as unknown as Array<Record<string, unknown>>,
    "pageType",
  );

  const legacyPaths = new Set(records.map((r) => r.legacyPath));
  const newOnly = newInventory
    .filter(
      (r) =>
        !["newsletter_utility", "privacy_utility", "pricing"].includes(
          r.pageType,
        ) && !legacyPaths.has(r.path),
    )
    .slice(0, 80);

  const lines: string[] = [];
  lines.push("# Legacy URL Migration Inventory");
  lines.push("");
  lines.push(`Generated: ${summary.generatedAt}`);
  lines.push("");
  lines.push(
    "> Audit only. **Do not implement redirects from this document** until the redirect plan is approved.",
  );
  lines.push("");
  lines.push("## Purpose");
  lines.push("");
  lines.push(
    "Compare live WordPress production (`https://www.softwareglimpse.com`) against the new SoftwareGlimpse Next.js application in this repository. Identify exact matches, redirect candidates, merges, retirements, duplicates/canonical risks, and SEO-sensitive URLs that must not disappear accidentally.",
  );
  lines.push("");
  lines.push("## Summary counts");
  lines.push("");
  lines.push(
    mdTable(
      ["Metric", "Count"],
      [
        ["Legacy sitemap unique `<loc>` URLs", String(c.legacySitemapUniqueLocs)],
        ["Legacy locale/hreflang URLs (excl. from primary EN match)", String(c.legacyLocaleUrls)],
        ["Legacy primary English content URLs", String(c.legacyPrimaryEn)],
        ["New app public routes inventoried", String(c.newPublicRoutes)],
        ["New app sitemap-eligible URLs", String(c.newSitemapEligible)],
        ["Exact path matches", String(c.exactMatches)],
        ["Redirect candidates (301 / merge+301)", String(c.redirectCandidates)],
        ["… of which high confidence", String(c.redirectCandidatesHighConfidence)],
        ["Retirement candidates (404 / 410)", String(c.retirementCandidates)],
        ["Manual review candidates", String(c.manualReviewCandidates)],
        ["New routes with no legacy counterpart", String(c.newOnlyRoutes)],
        ["High SEO-risk legacy URLs", String(c.highSeoRisk)],
      ],
    ),
  );
  lines.push("");
  lines.push("## Discovery sources");
  lines.push("");
  lines.push(`- Host: ${summary.sources.legacyHost}`);
  lines.push(`- Sitemap index: ${summary.sources.sitemapIndex}`);
  lines.push(
    `- Child sitemaps: ${summary.sources.childSitemaps.map((s) => `\`${s}\``).join(", ")}`,
  );
  lines.push("- robots.txt → Yoast sitemap index");
  lines.push(
    "- New app: `getSitemapEntries()` + data-layer entities + static hubs/legal/company/tools",
  );
  lines.push("");
  lines.push("## Record model");
  lines.push("");
  lines.push("```ts");
  lines.push("LegacyUrlMigrationRecord {");
  lines.push("  legacyUrl, legacyStatus, legacyTitle, legacyCanonical,");
  lines.push("  legacyIndexable, legacyPageType,");
  lines.push("  newUrl?, newTitle?, newPageType?,");
  lines.push("  relationship: EXACT | EQUIVALENT | MERGED_INTO | SPLIT_INTO |");
  lines.push("                NO_EQUIVALENT | DUPLICATE | UNKNOWN,");
  lines.push("  recommendedAction: KEEP | 301_REDIRECT | MERGE_AND_301 |");
  lines.push("                     404 | 410 | NOINDEX | REVIEW,");
  lines.push("  confidence: HIGH | MEDIUM | LOW,");
  lines.push("  reason, seoRisk, notes");
  lines.push("}");
  lines.push("```");
  lines.push("");
  lines.push(
    "Machine-readable snapshot: [`data/migration-records.json`](./data/migration-records.json).",
  );
  lines.push("");
  lines.push("## Legacy URL inventory (primary EN)");
  lines.push("");
  lines.push(
    mdTable(
      ["Legacy page type", "Count"],
      Object.entries(byLegacyType)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => [k, String(v)]),
    ),
  );
  lines.push("");
  lines.push(
    "Full list: [`data/legacy-primary-en.json`](./data/legacy-primary-en.json) (643 URLs).",
  );
  lines.push("");
  lines.push("### Locale / alternate URLs");
  lines.push("");
  lines.push(
    "Yoast emits hreflang alternates for `de`, `nl`, `es`, `fr`, and `ar` (~3,222 URLs). These are **not** collapsed into English matches. See [`data/legacy-locale-summary.json`](./data/legacy-locale-summary.json). Cutover needs an explicit language strategy (redirect to EN, keep locales, or retire).",
  );
  lines.push("");
  lines.push("## Current (new app) URL inventory");
  lines.push("");
  lines.push(
    mdTable(
      ["Page type", "Count"],
      Object.entries(byNewType)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => [k, String(v)]),
    ),
  );
  lines.push("");
  lines.push(
    "Full inventory: [`data/new-inventory.json`](./data/new-inventory.json).",
  );
  lines.push("");
  lines.push("### Route patterns (new app)");
  lines.push("");
  lines.push("| Pattern | Notes |");
  lines.push("| --- | --- |");
  lines.push("| `/` | Homepage |");
  lines.push("| `/software/`, `/software/[slug]/` | Catalogue + product/review surface |");
  lines.push("| `/software/[slug]/[tab]/` | Product tabs |");
  lines.push("| `/pricing/`, `/pricing/[slug]/` | Pricing hub + product pricing (often noindex) |");
  lines.push("| `/categories/`, `/categories/[...slug]/` | Category tree |");
  lines.push("| `/compare/`, `/compare/[slug]/`, `/compare/build/` | Comparisons |");
  lines.push("| `/alternatives/`, `/alternatives/[slug]/` | Alternatives |");
  lines.push("| `/best/`, `/best/[slug]/` | Best-of pages |");
  lines.push("| `/guides/`, `/guides/[slug]/` | Guides |");
  lines.push("| `/features/`, `/capabilities/`, `/requirements/`, `/use-cases/` | Knowledge hubs + detail |");
  lines.push("| `/industries/[slug]/…` | Industry hubs + nested (mostly noindex today) |");
  lines.push("| `/resources/`, `/tools/…` | Resources + interactive tools |");
  lines.push("| `/for/[slug]/` | Audience pages |");
  lines.push("| `/company/*`, `/legal/*` | Company + legal |");
  lines.push("| `/search/` | Search (noindex) |");
  lines.push("");
  lines.push("## Exact matches");
  lines.push("");
  if (exact.length === 0) {
    lines.push("_None_");
  } else {
    lines.push(
      mdTable(
        ["Legacy", "New", "Action"],
        exact.map((r) => [
          `\`${r.legacyPath}\``,
          `\`${r.newPath ?? ""}\``,
          r.recommendedAction,
        ]),
      ),
    );
  }
  lines.push("");
  lines.push(
    "WordPress used flat post slugs (`/pipedrive-crm-review/`). The new IA uses namespaced routes (`/software/pipedrive/`), so exact path overlap is intentionally small.",
  );
  lines.push("");
  lines.push("## Potential redirects (high confidence)");
  lines.push("");
  lines.push(
    mdTable(
      ["Legacy", "→ New", "Relationship", "Action", "Reason"],
      highRedirects.map((r) => [
        `\`${r.legacyPath}\``,
        `\`${r.newPath ?? ""}\``,
        r.relationship,
        r.recommendedAction,
        esc(r.reason),
      ]),
    ),
  );
  lines.push("");
  lines.push("## Potential redirects (medium/low confidence)");
  lines.push("");
  if (mediumRedirects.length === 0) {
    lines.push("_None_");
  } else {
    lines.push(
      mdTable(
        ["Legacy", "→ New", "Conf", "Action", "Reason"],
        mediumRedirects.slice(0, 80).map((r) => [
          `\`${r.legacyPath}\``,
          `\`${r.newPath ?? ""}\``,
          r.confidence,
          r.recommendedAction,
          esc(r.reason),
        ]),
      ),
    );
    if (mediumRedirects.length > 80) {
      lines.push("");
      lines.push(
        `_…and ${mediumRedirects.length - 80} more in migration-records.json_`,
      );
    }
  }
  lines.push("");
  lines.push("## No-equivalent URLs (SEO-sensitive subsets)");
  lines.push("");
  lines.push(
    "Reviews, best lists, comparisons, and alternatives without a clear new counterpart:",
  );
  lines.push("");
  lines.push(
    mdTable(
      ["Legacy", "Type", "SEO risk", "Suggested next step"],
      noEq.slice(0, 120).map((r) => [
        `\`${r.legacyPath}\``,
        String(r.legacyPageType),
        r.seoRisk,
        esc(r.reason),
      ]),
    ),
  );
  if (noEq.length > 120) {
    lines.push("");
    lines.push(`_…and ${noEq.length - 120} more in data file_`);
  }
  lines.push("");
  lines.push("## Duplicate / alias URLs");
  lines.push("");
  lines.push(
    "- WordPress `-2` / `-3` slug suffixes (e.g. `/capsule-crm-review-2/`, `/hubspot-vs-monday-2/`) → treat as **DUPLICATE** of the canonical review/compare target.",
  );
  lines.push(
    "- Prefixed comparison essays (`/the-ultimate-guide-to-…`, `/comparing-setup-…`) → **MERGED_INTO** canonical `/compare/{a}-vs-{b}/`.",
  );
  lines.push(
    "- WP tag archives (154) → recommended **410** (or soft noindex) unless a tag clearly equals a product/category hub.",
  );
  lines.push(
    `- Duplicate/alias-related records in snapshot: **${duplicates.length}**.`,
  );
  lines.push("");
  lines.push("## Legacy redirects (already live)");
  lines.push("");
  if (liveRedirects.length === 0) {
    lines.push(
      "HEAD sampling of SEO-critical English URLs returned **HTTP 200** with no `Location` headers (sample size limited). Full redirect-chain crawl not completed in this pass.",
    );
  } else {
    lines.push(
      mdTable(
        ["Legacy", "Live target"],
        liveRedirects.map((r) => [
          `\`${r.legacyPath}\``,
          esc(r.legacyRedirectTarget ?? ""),
        ]),
      ),
    );
  }
  lines.push("");
  lines.push("## Potentially important URLs needing manual review");
  lines.push("");
  lines.push(
    "High SEO risk and/or commercial intent without a safe automatic redirect:",
  );
  lines.push("");
  lines.push(
    mdTable(
      ["Legacy", "Type", "Risk", "Why"],
      manual.slice(0, 100).map((r) => [
        `\`${r.legacyPath}\``,
        String(r.legacyPageType),
        r.seoRisk,
        esc(r.reason),
      ]),
    ),
  );
  if (manual.length > 100) {
    lines.push("");
    lines.push(`_…and ${manual.length - 100} more in data file_`);
  }
  lines.push("");
  lines.push("### Priority review themes");
  lines.push("");
  lines.push(
    "1. **CRM vertical best-ofs** (`/best-crm-for-*`, `/best-crm-software-for-*`) — map to `/best/`, `/industries/`, or `/for/` once those pages are indexable.",
  );
  lines.push(
    "2. **Out-of-catalogue CRM reviews** (Podio, Nimble, NetSuite, Zendesk CRM, etc.) — onboard product **or** retire with intentional 410 + related hub link.",
  );
  lines.push(
    "3. **Non-CRM SEO/AI content** (Semrush, Jasper, ChatGPT comparisons) — decide keep-as-archive vs retire; not part of CRM IA.",
  );
  lines.push(
    "4. **Locale URLs** — language cutover plan before DNS/host cutover.",
  );
  lines.push(
    "5. **Existing seed ledger gaps** — `src/data/seed/migration.ts` includes paths like `/pipedrive-review/` and `/best-crm-software/` that did **not** appear in the live Yoast EN sitemap (aliases to verify against GSC).",
  );
  lines.push("");
  lines.push("## New routes with no legacy counterpart (sample)");
  lines.push("");
  lines.push(
    "The new IA is largely additive (tools, requirements, capabilities, resources, industry graph). Sample:",
  );
  lines.push("");
  lines.push(
    mdTable(
      ["New path", "Type", "Indexable"],
      newOnly.map((r) => [
        `\`${r.path}\``,
        r.pageType,
        r.indexable ? "yes" : "no",
      ]),
    ),
  );
  lines.push("");
  lines.push(
    "Full new-only list: [`data/new-only.json`](./data/new-only.json).",
  );
  lines.push("");
  lines.push("## Potential redirect chains / canonical risks");
  lines.push("");
  lines.push(
    "- **Avoid chains**: legacy A → legacy B → new C. Prefer single-hop A → final canonical.",
  );
  lines.push(
    "- **Duplicate reviews** (`-review-2`) must point at the same final `/software/{slug}/` as the primary review URL.",
  );
  lines.push(
    "- **Infusionsoft → Keap**: `/infusionsoft-crm-review/` and `/hubspot-vs-infusionsoft/` should land on Keap software/compare URLs (not a dead Infusionsoft slug).",
  );
  lines.push(
    "- **Monday naming**: legacy `/monday-crm-review/` / `/monday-com-review/` → `/software/monday-sales-crm/`.",
  );
  lines.push(
    "- **Compare slug order**: legacy `pipedrive-vs-hubspot` → new lexicographic `/compare/hubspot-vs-pipedrive/`.",
  );
  lines.push(
    "- New app already has internal feature aliases in `src/seo/canonical.ts` / `next.config.ts` (`call-functionality` → `calling`); keep legacy WP redirects separate from those.",
  );
  lines.push("");
  lines.push("## Crawl limitations");
  lines.push("");
  for (const lim of summary.limitations) {
    lines.push(`- ${lim}`);
  }
  lines.push("");
  lines.push("## Framework location");
  lines.push("");
  lines.push("- Service: `src/services/legacy-url-migration/`");
  lines.push("- CLI: `npm run migration:legacy-urls`");
  lines.push(
    "- Related hand ledger (CRM batch proposals): `src/data/seed/migration.ts` (`MigrationRecord`)",
  );
  lines.push("");
  lines.push("## Next steps (not done yet)");
  lines.push("");
  lines.push("1. Import GSC/Bing URL inventories; reconcile against this sitemap set.");
  lines.push("2. Editorial pass on high SEO-risk REVIEW rows.");
  lines.push("3. Approve redirect map → implement in hosting/`next.config` (separate change).");
  lines.push("4. Locale cutover plan.");
  lines.push("5. Post-cutover crawl for chains, 404 spikes, and canonical mismatches.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}
