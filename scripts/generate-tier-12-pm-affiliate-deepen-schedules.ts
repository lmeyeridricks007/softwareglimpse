#!/usr/bin/env npx tsx
/**
 * Write publishing schedule JSON for Tier 12 PM affiliate-deepen what-is guides.
 *
 * Usage: npx tsx scripts/generate-tier-12-pm-affiliate-deepen-schedules.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  TIER_12_SCHEDULED_GUIDE_SLUGS,
  tier12WhatIsScheduledAt,
} from "@/data/config/publishing/tier-12-pm-affiliate-deepen-launch-2027-02-01";
import { guideContentId } from "@/services/publishing/ids";
import { contentIdToFileToken } from "@/domain";

const OUT = join(process.cwd(), "src/data/publishing/schedules");
const CREATED_AT = "2026-08-23T13:40:00.000Z";

function main() {
  mkdirSync(OUT, { recursive: true });
  let written = 0;
  for (const guideSlug of TIER_12_SCHEDULED_GUIDE_SLUGS) {
    const scheduledAt = tier12WhatIsScheduledAt(guideSlug);
    if (!scheduledAt) continue;
    const contentId = guideContentId(guideSlug);
    const token = contentIdToFileToken(contentId);
    writeFileSync(
      join(OUT, `${token}.json`),
      `${JSON.stringify(
        {
          contentId,
          scheduledAt,
          approvedVersion: 1,
          createdAt: CREATED_AT,
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
    written++;
  }
  console.log(`Wrote ${written} Tier 12 schedule files to ${OUT}`);
}

main();
