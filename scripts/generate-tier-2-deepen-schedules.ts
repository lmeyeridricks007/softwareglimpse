#!/usr/bin/env npx tsx
/**
 * Write publishing schedule JSON for Tier 2 deepen what-is guides.
 *
 * Usage: npx tsx scripts/generate-tier-2-deepen-schedules.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  TIER_2_SCHEDULED_GUIDE_SLUGS,
  tier2WhatIsScheduledAt,
} from "@/data/config/publishing/tier-2-deepen-launch-2026-09-01";
import { guideContentId } from "@/services/publishing/ids";
import { contentIdToFileToken } from "@/domain";

const OUT = join(process.cwd(), "src/data/publishing/schedules");
const CREATED_AT = "2026-08-23T12:45:00.000Z";

function main() {
  mkdirSync(OUT, { recursive: true });
  let written = 0;
  for (const guideSlug of TIER_2_SCHEDULED_GUIDE_SLUGS) {
    const scheduledAt = tier2WhatIsScheduledAt(guideSlug);
    if (!scheduledAt) continue;
    const contentId = guideContentId(guideSlug);
    const token = contentIdToFileToken(contentId);
    const path = join(OUT, `${token}.json`);
    writeFileSync(
      path,
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
  console.log(`Wrote ${written} Tier 2 schedule files to ${OUT}`);
}

main();
