#!/usr/bin/env npx tsx
/**
 * Generates docs/catalogue/EDITORIAL-AFFILIATE-PROGRAM-GUIDE-LATEST.md
 *
 * Where to apply for affiliate programmes for seed products without a live
 * tracking URL on the software row.
 *
 * Usage: npm run catalogue:affiliate-guide
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getAllSoftwareUnfiltered } from "@/data";
import { partnerLinks } from "@/data/affiliates/source/partner-links";
import {
  PROGRAMME_FAMILIES,
  TIER_LABELS,
  hintForSlug,
  type AffiliateOpportunityTier,
} from "./lib/editorial-affiliate-opportunities";

const OUT = join(
  process.cwd(),
  "docs/catalogue/EDITORIAL-AFFILIATE-PROGRAM-GUIDE-LATEST.md",
);

function tableRow(cols: string[]): string {
  return `| ${cols.join(" | ")} |`;
}

function slugList(slugs: string[], perLine = 6): string {
  if (!slugs.length) return "_None._\n";
  const lines: string[] = [];
  for (let i = 0; i < slugs.length; i += perLine) {
    lines.push(slugs.slice(i, i + perLine).map((s) => `\`${s}\``).join(", "));
  }
  return lines.join("\n") + "\n";
}

function main() {
  const partnerBySlug = new Map(partnerLinks.map((p) => [p.productSlug, p]));
  const editorial = getAllSoftwareUnfiltered()
    .filter((s) => !(s.affiliate?.enabled && s.affiliate.trackingUrl))
    .sort((a, b) => {
      const c = a.primaryCategorySlug.localeCompare(b.primaryCategorySlug);
      return c !== 0 ? c : a.slug.localeCompare(b.slug);
    });

  const byTier = new Map<AffiliateOpportunityTier, typeof editorial>();
  for (const product of editorial) {
    const hint = hintForSlug(product.slug, product.primaryCategorySlug);
    const list = byTier.get(hint.tier) ?? [];
    list.push(product);
    byTier.set(hint.tier, list);
  }

  const lines: string[] = [
    "# Editorial catalogue — where to get affiliate programmes",
    "",
    `_Generated ${new Date().toISOString().slice(0, 10)}. Regenerate: \`npm run catalogue:affiliate-guide\`_`,
    "",
    "> **Related:** [PRODUCT-AFFILIATE-GAP-AUDIT-LATEST.md](./PRODUCT-AFFILIATE-GAP-AUDIT-LATEST.md) · Deep research (Aug 2026): [affiliate-program-gap-research-2026-08-19.md](../reports/affiliate-program-gap-research-2026-08-19.md)",
    "",
    "**Scope:** **" + String(editorial.length) + "** seed products with **no live affiliate** (`affiliate.enabled` + tracking URL on the software row). This doc tells you **where to apply** — it does not invent PartnerStack links. After approval, wire URLs via `npm run affiliate:set -- <slug> --url <https://...> --default` and `partner-links.ts`.",
    "",
    "**Rules:** Affiliate economics never change Finder / Best / comparison rankings. Confirm rates in the vendor dashboard after approval.",
    "",
    "## Snapshot",
    "",
    tableRow(["Tier", "Count", "Action"]),
    tableRow(["---", "---:", "---"]),
    ...(
      [
        "apply-first",
        "pending-dashboard-url",
        "reuse-live-programme",
        "apply-check",
        "partner-only",
        "no-public-programme",
        "declined",
      ] as AffiliateOpportunityTier[]
    ).map((tier) =>
      tableRow([
        TIER_LABELS[tier],
        String(byTier.get(tier)?.length ?? 0),
        tier === "apply-first"
          ? "Apply on official URLs below"
          : tier === "pending-dashboard-url"
            ? "Log into PartnerStack/Impact; paste product homepage link"
            : tier === "reuse-live-programme"
              ? "Extend existing programme row"
              : tier === "apply-check"
                ? "Verify programme exists, then apply"
                : tier === "partner-only"
                  ? "Official CTA only unless partner contract"
                  : tier === "declined"
                    ? "Do not re-apply without vendor OK"
                    : "Keep official site CTA",
      ]),
    ),
    "",
    "---",
    "",
    "## Apply first (highest overlap with ranked content)",
    "",
    tableRow(["Product", "Category", "Apply", "Network", "Pays (public — confirm in dashboard)"]),
    tableRow(["---", "---", "---", "---", "---"]),
  ];

  for (const product of byTier.get("apply-first") ?? []) {
    const hint = hintForSlug(product.slug, product.primaryCategorySlug);
    lines.push(
      tableRow([
        `\`${product.slug}\``,
        product.primaryCategorySlug,
        hint.applyUrl ? `[Apply](${hint.applyUrl})` : "—",
        hint.network ?? "—",
        hint.pays ?? "—",
      ]),
    );
  }
  lines.push("");

  lines.push(
    "## Programme families (one apply → multiple slugs)",
    "",
  );
  for (const [key, family] of Object.entries(PROGRAMME_FAMILIES)) {
    lines.push(
      `### ${key}`,
      "",
      `- **Apply:** ${family.applyUrl ? `[${family.applyUrl}](${family.applyUrl})` : "—"}`,
      `- **Slugs:** ${family.slugs.map((s) => `\`${s}\``).join(", ")}`,
      `- **Pays:** ${family.pays ?? "Confirm in dashboard"}`,
      family.notes ? `- **Notes:** ${family.notes}` : "",
      "",
    );
  }

  lines.push(
    "## Pending dashboard URL (in `partner-links.ts`, URL still null)",
    "",
    "Inventory/programme active or pending — copy the **homepage** tracking link from your affiliate dashboard, then:",
    "",
    "```bash",
    "npm run affiliate:set -- <slug> --url \"https://...\" --default",
    "```",
    "",
    tableRow(["Product", "Category", "Hint"]),
    tableRow(["---", "---", "---"]),
  );
  for (const product of byTier.get("pending-dashboard-url") ?? []) {
    const hint = hintForSlug(product.slug, product.primaryCategorySlug);
    const pl = partnerBySlug.get(product.slug);
    lines.push(
      tableRow([
        `\`${product.slug}\``,
        product.primaryCategorySlug,
        [
          hint.applyUrl ? `[Partners](${hint.applyUrl})` : null,
          hint.network,
          pl?.affiliateUrlState,
          hint.notes,
        ]
          .filter(Boolean)
          .join(" · "),
      ]),
    );
  }
  lines.push("");

  lines.push("## Reuse live programme (do not re-apply)", "");
  for (const product of byTier.get("reuse-live-programme") ?? []) {
    const hint = hintForSlug(product.slug, product.primaryCategorySlug);
    lines.push(`- **\`${product.slug}\`** — ${hint.notes ?? ""}`);
  }
  lines.push("");

  lines.push("## Declined / inactive", "");
  for (const product of byTier.get("declined") ?? []) {
    const hint = hintForSlug(product.slug, product.primaryCategorySlug);
    lines.push(
      `- **\`${product.slug}\`** — ${hint.notes ?? ""}${hint.applyUrl ? ` ([programme page](${hint.applyUrl}))` : ""}`,
    );
  }
  lines.push("");

  lines.push(
    "## Check & apply (programme may exist — verify on vendor site)",
    "",
    `_${byTier.get("apply-check")?.length ?? 0} products. Search \`{vendor} affiliate\` or check PartnerStack marketplace._`,
    "",
    tableRow(["Product", "Category", "Apply / notes"]),
    tableRow(["---", "---", "---"]),
  );
  for (const product of byTier.get("apply-check") ?? []) {
    const hint = hintForSlug(product.slug, product.primaryCategorySlug);
    lines.push(
      tableRow([
        `\`${product.slug}\``,
        product.primaryCategorySlug,
        hint.applyUrl
          ? `[Apply](${hint.applyUrl})${hint.pays ? ` — ${hint.pays}` : ""}`
          : hint.notes ?? "—",
      ]),
    );
  }
  lines.push("");

  lines.push(
    "## Partner / reseller only (no review-site CPA)",
    "",
    `_${byTier.get("partner-only")?.length ?? 0} products — keep official CTAs on /software/ pages unless you have a partner contract._`,
    "",
    tableRow(["Product", "Category", "Partner path"]),
    tableRow(["---", "---", "---"]),
  );
  for (const product of byTier.get("partner-only") ?? []) {
    const hint = hintForSlug(product.slug, product.primaryCategorySlug);
    lines.push(
      tableRow([
        `\`${product.slug}\``,
        product.primaryCategorySlug,
        hint.applyUrl
          ? `[Partner portal](${hint.applyUrl})`
          : hint.notes ?? "Vendor partner network",
      ]),
    );
  }
  lines.push("");

  lines.push(
    "## No public publisher programme",
    "",
    slugList((byTier.get("no-public-programme") ?? []).map((p) => p.slug)),
    "",
    "## Full slug index (all editorial-only rows)",
    "",
    slugList(editorial.map((p) => p.slug)),
    "",
    "## After approval — wire in repo",
    "",
    "1. Copy the vendor-issued **homepage** or trial tracking URL (never guess PartnerStack paths).",
    "2. `npm run affiliate:set -- <slug> --url \"https://...\" --default`",
    "3. Update `src/data/affiliates/source/partner-links.ts` (or import CSV).",
    "4. `npm run affiliate:validate`",
    "5. Enable affiliate on software seed only after destination is validated.",
    "",
    "## Recommended application order",
    "",
    "1. **Pending dashboard URLs** — Freshworks SKUs, Livestorm, Uniqode, Motion, RocketReach (fastest win).",
    "2. **HubSpot, Zoho, Zendesk, Shopify, Webflow** — high-intent category pages.",
    "3. **Email:** Beehiiv, MailerLite, Omnisend (check), Brevo.",
    "4. **SI:** Hunter, Snov, Lemlist, Smartlead (check).",
    "5. **Ecommerce:** Printful, Printify, Wix, WooCommerce.",
    "6. Skip **Salesforce, Microsoft, Oracle, SAP, Workday, ServiceNow, Datadog** unless a partner manager offers a referral mechanic.",
    "",
  );

  mkdirSync(join(process.cwd(), "docs/catalogue"), { recursive: true });
  writeFileSync(OUT, lines.join("\n"), "utf8");
  console.log(`Wrote ${OUT}`);
  console.log(
    `  editorial-only: ${editorial.length}, apply-first: ${byTier.get("apply-first")?.length ?? 0}, pending-url: ${byTier.get("pending-dashboard-url")?.length ?? 0}`,
  );
}

main();
