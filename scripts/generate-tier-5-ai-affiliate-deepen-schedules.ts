#!/usr/bin/env npx tsx
/**
 * Write publishing schedule JSON for Tier 5 AI affiliate-deepen what-is guides.
 *
 * Usage: npx tsx scripts/generate-tier-5-ai-affiliate-deepen-schedules.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  TIER_5_SCHEDULED_GUIDE_SLUGS,
  tier5WhatIsScheduledAt,
} from "@/data/config/publishing/tier-5-ai-affiliate-deepen-launch-2026-11-01";
import { guideContentId } from "@/services/publishing/ids";
import { contentIdToFileToken } from "@/domain";

const OUT = join(process.cwd(), "src/data/publishing/schedules");
const CREATED_AT = "2026-08-23T13:00:00.000Z";

function main() {
  mkdirSync(OUT, { recursive: true });
  let written = 0;
  for (const guideSlug of TIER_5_SCHEDULED_GUIDE_SLUGS) {
    const scheduledAt = tier5WhatIsScheduledAt(guideSlug);
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
  console.log(`Wrote ${written} Tier 5 schedule files to ${OUT}`);
}

main();
