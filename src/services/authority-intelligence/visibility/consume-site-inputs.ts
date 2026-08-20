/**
 * Consume adjacent intelligence packs (read-only path checks).
 */

import fs from "node:fs";
import path from "node:path";

export type SiteIntelligenceInputs = {
  websiteIntelligence?: string;
  rankingOpportunities?: string;
  competitorIntelligence?: string;
  contentIntelligence?: string;
  assetIntelligence?: string;
  notes: string[];
};

function exists(rel: string): boolean {
  return fs.existsSync(path.join(process.cwd(), rel));
}

export function consumeSiteIntelligenceInputs(): SiteIntelligenceInputs {
  const notes: string[] = [];
  const pairs: Array<[keyof Omit<SiteIntelligenceInputs, "notes">, string]> = [
    [
      "websiteIntelligence",
      "docs/site-intelligence/SITE-INTELLIGENCE-LATEST.md",
    ],
    [
      "rankingOpportunities",
      "docs/site-intelligence/RANKING-OPPORTUNITIES-LATEST.md",
    ],
    [
      "competitorIntelligence",
      "docs/site-intelligence/competitors/competitive-benchmark-latest.json",
    ],
    [
      "contentIntelligence",
      "docs/content-quality/CONTENT-INTELLIGENCE-LATEST.md",
    ],
    [
      "assetIntelligence",
      "docs/content-assets/ASSET-INTELLIGENCE-LATEST.md",
    ],
  ];

  const out: SiteIntelligenceInputs = { notes };
  for (const [key, p] of pairs) {
    if (exists(p)) {
      out[key] = p;
      notes.push(`Available: ${p}`);
    } else {
      // fallbacks
      const alts: Record<string, string[]> = {
        websiteIntelligence: [
          "docs/site-intelligence/README.md",
          "docs/seo/reports/SEO-HEALTH-LATEST.md",
        ],
        contentIntelligence: [
          "docs/content-quality/CONTENT-QUALITY-LATEST.md",
        ],
      };
      const found = (alts[key] ?? []).find((a) => exists(a));
      if (found) {
        out[key] = found;
        notes.push(`Available (fallback): ${found}`);
      } else {
        notes.push(`Missing: ${p}`);
      }
    }
  }
  return out;
}
