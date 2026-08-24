#!/usr/bin/env npx tsx
/**
 * Write publishing schedule JSON for Tier 13 social-media-marketing launch guides.
 *
 * Usage: npx tsx scripts/generate-tier-13-social-media-marketing-schedules.ts
 */
import { mkdirSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  TIER_13_SCHEDULED_GUIDE_SLUGS,
  tier13GuideScheduledAt,
} from "@/data/config/publishing/tier-13-social-media-marketing-launch-2026-10-01";
import { guideContentId } from "@/services/publishing/ids";
import { contentIdToFileToken } from "@/domain";

const OUT = join(process.cwd(), "src/data/publishing/schedules");
const CREATED_AT = "2026-08-23T14:30:00.000Z";

const STALE_GUIDE_SLUGS = [
  "what-is-brand24",
  "what-is-socialbee",
  "what-is-zypper",
].filter((slug) => !TIER_13_SCHEDULED_GUIDE_SLUGS.includes(slug));

function main() {
  mkdirSync(OUT, { recursive: true });
  let written = 0;
  for (const guideSlug of TIER_13_SCHEDULED_GUIDE_SLUGS) {
    const scheduledAt = tier13GuideScheduledAt(guideSlug);
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
  for (const slug of STALE_GUIDE_SLUGS) {
    const token = contentIdToFileToken(guideContentId(slug));
    const path = join(OUT, `${token}.json`);
    if (existsSync(path)) {
      unlinkSync(path);
      console.log(`Removed stale schedule ${token}.json`);
    }
  }
  console.log(`Wrote ${written} Tier 13 schedule files to ${OUT}`);
}

main();
