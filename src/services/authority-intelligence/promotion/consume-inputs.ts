/**
 * Consume existing intelligence reports as promotion context.
 * Missing files are noted — never invent input content.
 */

import fs from "node:fs";
import path from "node:path";
import type { ConsumedInputs } from "./types";

function exists(rel: string): boolean {
  return fs.existsSync(path.join(process.cwd(), rel));
}

function readHead(rel: string, maxChars = 400): string | undefined {
  const full = path.join(process.cwd(), rel);
  if (!fs.existsSync(full)) return undefined;
  const text = fs.readFileSync(full, "utf8");
  return text.slice(0, maxChars);
}

export function consumePromotionInputs(): ConsumedInputs {
  const notes: string[] = [];

  const contentMap = "docs/content-ecosystem/04-crm-master-content-map.md";
  const ranking = "docs/site-intelligence/RANKING-OPPORTUNITIES-LATEST.md";
  const cq = "docs/content-quality/CONTENT-QUALITY-LATEST.md";
  const earned = "docs/authority/EARNED-BACKLINK-OPPORTUNITIES-LATEST.md";
  const paid = "docs/authority/PAID-PROMOTION-OPPORTUNITIES-LATEST.md";
  const digitalPr = "docs/authority/DIGITAL-PR-OPPORTUNITIES-LATEST.md";
  const partnerships = "docs/authority/PARTNERSHIP-OPPORTUNITIES-LATEST.md";

  const check = (label: string, p: string) => {
    if (exists(p)) notes.push(`Consumed ${label}: ${p}`);
    else notes.push(`Missing ${label}: ${p} (skipped)`);
  };

  check("content map", contentMap);
  check("ranking opportunities", ranking);
  check("content quality", cq);
  check("earned backlinks", earned);
  check("paid promotion", paid);
  check("digital PR", digitalPr);
  check("partnerships", partnerships);

  // Soft-parse partnership orgs for cross-links
  const partnershipSnippet = readHead(partnerships, 2000);
  if (partnershipSnippet?.includes("RevOps Co-op")) {
    notes.push("Partnerships signal: RevOps Co-op / ROA / SCORE present for channel alignment.");
  }
  if (readHead(digitalPr, 800)?.includes("CRM Pricing Index")) {
    notes.push("Digital PR signal: Pricing Index / plan-gating ideas available for data-snippet promos.");
  }
  if (readHead(paid, 800)?.includes("Best paid experiments")) {
    notes.push("Paid promotion signal: newsletter/LinkedIn experiments available as paid channels.");
  }
  if (readHead(ranking, 600)?.includes("Ranking")) {
    notes.push("Ranking opportunities present — prioritize promoting pages that close competitive gaps.");
  }

  return {
    contentMap: exists(contentMap) ? contentMap : undefined,
    rankingOpportunities: exists(ranking) ? ranking : undefined,
    contentQuality: exists(cq) ? cq : undefined,
    earnedBacklinks: exists(earned) ? earned : undefined,
    paidPromotion: exists(paid) ? paid : undefined,
    digitalPr: exists(digitalPr) ? digitalPr : undefined,
    partnerships: exists(partnerships) ? partnerships : undefined,
    notes,
  };
}
