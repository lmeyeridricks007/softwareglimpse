#!/usr/bin/env npx tsx
/**
 * Write publishing schedule JSON for Tier 17 analytics-bi launch guides.
 */
import { mkdirSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  TIER_17_SCHEDULED_GUIDE_SLUGS,
  tier17GuideScheduledAt,
} from "@/data/config/publishing/tier-17-analytics-bi-launch-2027-02-01";
import { guideContentId } from "@/services/publishing/ids";
import { contentIdToFileToken } from "@/domain";

const OUT = join(process.cwd(), "src/data/publishing/schedules");
const CREATED_AT = "2026-08-23T17:00:00.000Z";

const STALE_GUIDE_SLUGS = [
  "what-is-whatconverts",
  "what-is-databox",
].filter((slug) => !TIER_17_SCHEDULED_GUIDE_SLUGS.includes(slug));

function main() {
  mkdirSync(OUT, { recursive: true });
  let written = 0;
  for (const guideSlug of TIER_17_SCHEDULED_GUIDE_SLUGS) {
    const scheduledAt = tier17GuideScheduledAt(guideSlug);
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
  for (const slug of STALE_GUIDE_SLUGS) {
    const path = join(OUT, `${contentIdToFileToken(guideContentId(slug))}.json`);
    if (existsSync(path)) {
      unlinkSync(path);
      console.log(`Removed stale schedule ${slug}`);
    }
  }
  console.log(`Wrote ${written} Tier 17 schedule files to ${OUT}`);
}

main();
