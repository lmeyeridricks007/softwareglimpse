#!/usr/bin/env npx tsx
/**
 * Import first-party / GA4 affiliate click aggregates.
 *
 *   npm run analytics:affiliate-clicks -- --import path/to/export.json
 *   npm run analytics:affiliate-clicks -- --ensure
 */
import {
  ensureAffiliateClickStore,
  ensureAffiliateConversionPlaceholder,
  importAffiliateClicksFromFile,
  loadAffiliateClickStore,
} from "@/services/analytics/affiliate-funnel";

function main(): void {
  const args = process.argv.slice(2);
  const ensure = args.includes("--ensure");
  const idx = args.indexOf("--import");
  const importPath =
    idx >= 0 && args[idx + 1] && !args[idx + 1]!.startsWith("--")
      ? args[idx + 1]
      : undefined;

  ensureAffiliateConversionPlaceholder();

  if (ensure || !importPath) {
    const store = ensureAffiliateClickStore();
    console.log(
      `Click store: validity=${store.validity} events=${store.aggregates.totalClicks} → data/analytics/affiliate-clicks.json`,
    );
  }

  if (importPath) {
    const result = importAffiliateClicksFromFile(importPath);
    console.log(`Imported ${result.imported} click rows → ${result.storePath}`);
  }

  const store = loadAffiliateClickStore();
  console.log(
    JSON.stringify(
      {
        validity: store?.validity ?? "NOT_CONNECTED",
        totalClicks: store?.aggregates.totalClicks ?? null,
        uniqueProducts: store?.aggregates.uniqueProducts ?? null,
      },
      null,
      2,
    ),
  );
}

main();
