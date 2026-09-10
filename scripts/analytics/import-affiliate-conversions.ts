#!/usr/bin/env npx tsx
/**
 * Import affiliate network conversion/revenue exports.
 * Missing amounts stay null — never coerce to $0.
 * Join to clicks only when clickId matches a retained click id/trackingId.
 *
 *   npm run analytics:affiliate-conversions -- --ensure
 *   npm run analytics:affiliate-conversions -- --import path/to/export.csv
 *   npm run analytics:affiliate-conversions -- --discover
 */
import {
  buildAffiliateFunnelReport,
  discoverLatestConversionExport,
  ensureAffiliateConversionPlaceholder,
  ensureAffiliateImportDirs,
  importAffiliateConversionsFromFile,
  loadAffiliateClickStore,
  loadAffiliateConversionStore,
} from "@/services/analytics/affiliate-funnel";

function main(): void {
  const args = process.argv.slice(2);
  const ensure = args.includes("--ensure");
  const discover = args.includes("--discover");
  const idx = args.indexOf("--import");
  const importPath =
    idx >= 0 && args[idx + 1] && !args[idx + 1]!.startsWith("--")
      ? args[idx + 1]
      : undefined;

  ensureAffiliateImportDirs();

  if (ensure && !importPath && !discover) {
    const store = ensureAffiliateConversionPlaceholder();
    console.log(
      `Conversions: validity=${store.validity} rows=${store.conversions.length} commission=${store.commissionTotal ?? "NOT_CONNECTED"} revenue=${store.orderRevenueTotal ?? "NOT_CONNECTED"}`,
    );
  }

  let pathToImport = importPath;
  if (!pathToImport && discover) {
    pathToImport = discoverLatestConversionExport() ?? undefined;
    if (!pathToImport) {
      console.log(
        "No REAL export found under data/analytics/imports/{impact,cj,shareasale,partnerstack}/",
      );
    } else {
      console.log(`Discovered export: ${pathToImport}`);
    }
  }

  if (pathToImport) {
    const store = importAffiliateConversionsFromFile(pathToImport);
    console.log(
      `Imported conversions validity=${store.validity} rows=${store.conversions.length} commission=${store.commissionTotal ?? "null"} orderRevenue=${store.orderRevenueTotal ?? "null"}`,
    );
  }

  const clicks = loadAffiliateClickStore();
  const conversions = loadAffiliateConversionStore();
  const funnel = buildAffiliateFunnelReport(clicks, conversions);

  console.log(
    JSON.stringify(
      {
        clicks: funnel.clicks,
        conversions: {
          validity: funnel.conversions.validity,
          count:
            funnel.conversions.validity === "NOT_CONNECTED"
              ? null
              : funnel.conversions.count,
          matched:
            funnel.conversions.validity === "NOT_CONNECTED"
              ? null
              : funnel.conversions.matched,
          unmatched:
            funnel.conversions.validity === "NOT_CONNECTED"
              ? null
              : funnel.conversions.unmatched,
          conversionRate: funnel.conversions.conversionRate,
        },
        commission: {
          validity: funnel.commission.validity,
          total: funnel.commission.total,
          currency: funnel.commission.currency,
        },
        revenue: {
          validity: funnel.revenue.validity,
          total: funnel.revenue.total,
          currency: funnel.revenue.currency,
        },
        topConvertingSourcePages: funnel.topConvertingSourcePages.slice(0, 5),
        topProducts: funnel.topProducts.slice(0, 5),
        notes: funnel.notes,
        reminder:
          funnel.conversions.validity === "NOT_CONNECTED"
            ? "Do not display 0 conversions or $0 revenue"
            : null,
      },
      null,
      2,
    ),
  );
}

main();
