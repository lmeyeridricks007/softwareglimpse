#!/usr/bin/env npx tsx
/**
 * Write publishing schedule JSON for Tier 33 ppc-advertising launch guides.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  TIER_33_SCHEDULED_GUIDE_SLUGS,
  tier33GuideScheduledAt,
} from "@/data/config/publishing/tier-33-ppc-advertising-launch-2027-09-01";
import { guideContentId } from "@/services/publishing/ids";
import { contentIdToFileToken } from "@/domain";

const OUT = join(process.cwd(), "src/data/publishing/schedules");
const CREATED_AT = "2026-08-33T20:00:00.000Z";

function main() {
  mkdirSync(OUT, { recursive: true });
  let written = 0;
  for (const guideSlug of TIER_33_SCHEDULED_GUIDE_SLUGS) {
    const scheduledAt = tier33GuideScheduledAt(guideSlug);
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
  console.log(`Wrote ${written} Tier 33 schedule files to ${OUT}`);
}

main();
