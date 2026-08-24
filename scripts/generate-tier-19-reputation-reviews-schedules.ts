#!/usr/bin/env npx tsx
/**
 * Write publishing schedule JSON for Tier 19 reputation-reviews launch guides.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  TIER_19_SCHEDULED_GUIDE_SLUGS,
  tier19GuideScheduledAt,
} from "@/data/config/publishing/tier-19-reputation-reviews-launch-2027-04-01";
import { guideContentId } from "@/services/publishing/ids";
import { contentIdToFileToken } from "@/domain";

const OUT = join(process.cwd(), "src/data/publishing/schedules");
const CREATED_AT = "2026-08-23T18:00:00.000Z";

function main() {
  mkdirSync(OUT, { recursive: true });
  let written = 0;
  for (const guideSlug of TIER_19_SCHEDULED_GUIDE_SLUGS) {
    const scheduledAt = tier19GuideScheduledAt(guideSlug);
    if (!scheduledAt) continue;
    const contentId = guideContentId(guideSlug);
    const token = contentIdToFileToken(contentId);
    writeFileSync(
      join(OUT, `${token}.json`),
      `${JSON.stringify(
        { contentId, scheduledAt, approvedVersion: 1, createdAt: CREATED_AT },
        null,
        2,
      )}\n`,
      "utf8",
    );
    written++;
  }
  console.log(`Wrote ${written} Tier 19 schedule files to ${OUT}`);
}

main();
