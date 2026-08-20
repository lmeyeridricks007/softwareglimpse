#!/usr/bin/env npx tsx
import { getSoftware } from "../src/data";
import {
  listResearchProducts,
  loadEnrichment,
  loadFacts,
  loadManualSources,
} from "../src/data/research/store";
import { assessDomainCompleteness } from "../src/services/research/freshness";
import type { ResearchDomain } from "../src/domain";

const STATUS_DOMAINS: ResearchDomain[] = [
  "pricing",
  "features",
  "ai-capabilities",
];

function pad(value: string, width: number): string {
  return value.padEnd(width).slice(0, width);
}

function main() {
  const products = getSoftware({ includeUnpublished: true });
  const researched = new Set(listResearchProducts());

  console.log(
    `${pad("PRODUCT", 14)}${pad("PRICING", 10)}${pad("FEATURES", 10)}${pad("AI", 10)}${pad("LAST CHECK", 22)}SOURCES`,
  );

  for (const product of products) {
    if (
      !researched.has(product.slug) &&
      !["pipedrive", "freshsales", "apollo"].includes(product.slug)
    ) {
      continue;
    }

    const facts = loadFacts(product.slug);
    const enrichment = loadEnrichment(product.slug);
    const sources = loadManualSources(product.slug);

    const cells = STATUS_DOMAINS.map((domain) => {
      const domainFacts = facts.filter((fact) => fact.domain === domain || fact.field.includes(domain.split("-")[0]!));
      const checkedAt = enrichment?.domainCheckedAt?.[domain];
      return assessDomainCompleteness({
        domain,
        hasFacts: domainFacts.length > 0,
        totalCount: domainFacts.length,
        verifiedCount: domainFacts.filter(
          (f) => f.status === "approved" || f.status === "verified",
        ).length,
        checkedAt,
      }).toUpperCase();
    });

    const lastCheck =
      enrichment?.updatedAt ||
      product.pricingVerifiedAt ||
      product.lastResearchedAt ||
      "-";

    console.log(
      `${pad(product.name, 14)}${pad(cells[0], 10)}${pad(cells[1], 10)}${pad(cells[2], 10)}${pad(String(lastCheck).slice(0, 19), 22)}${sources.length}`,
    );
  }
}

main();
