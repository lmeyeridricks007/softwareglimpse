#!/usr/bin/env npx tsx
/**
 * Write publishing schedule JSON for Tier 16 website-digital-presence launch guides.
 */
import { mkdirSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  TIER_16_SCHEDULED_GUIDE_SLUGS,
  tier16GuideScheduledAt,
} from "@/data/config/publishing/tier-16-website-digital-presence-launch-2027-01-01";
import { guideContentId } from "@/services/publishing/ids";
import { contentIdToFileToken } from "@/domain";

const OUT = join(process.cwd(), "src/data/publishing/schedules");
const CREATED_AT = "2026-08-23T16:30:00.000Z";

const STALE_GUIDE_SLUGS = [
  "what-is-shopify",
  "what-is-leadpages",
  "what-is-wegic",
  "what-is-ueni",
  "what-is-flippa",
  "what-is-plesk",
].filter((slug) => !TIER_16_SCHEDULED_GUIDE_SLUGS.includes(slug));

function main() {
  mkdirSync(OUT, { recursive: true });
  let written = 0;
  for (const guideSlug of TIER_16_SCHEDULED_GUIDE_SLUGS) {
    const scheduledAt = tier16GuideScheduledAt(guideSlug);
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
  console.log(`Wrote ${written} Tier 16 schedule files to ${OUT}`);
}

main();
