#!/usr/bin/env npx tsx
/**
 * Write publishing schedule JSON for Tier 25 dropshipping-pod launch guides.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  TIER_25_SCHEDULED_GUIDE_SLUGS,
  tier25GuideScheduledAt,
} from "@/data/config/publishing/tier-25-dropshipping-pod-launch-2027-07-01";
import { guideContentId } from "@/services/publishing/ids";
import { contentIdToFileToken } from "@/domain";

const OUT = join(process.cwd(), "src/data/publishing/schedules");
const CREATED_AT = "2026-08-25T20:00:00.000Z";

function main() {
  mkdirSync(OUT, { recursive: true });
  let written = 0;
  for (const guideSlug of TIER_25_SCHEDULED_GUIDE_SLUGS) {
    const scheduledAt = tier25GuideScheduledAt(guideSlug);
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
  console.log(`Wrote ${written} Tier 25 schedule files to ${OUT}`);
}

main();
