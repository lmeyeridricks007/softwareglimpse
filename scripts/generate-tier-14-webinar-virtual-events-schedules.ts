#!/usr/bin/env npx tsx
/**
 * Write publishing schedule JSON for Tier 14 webinar-virtual-events launch guides.
 *
 * Usage: npx tsx scripts/generate-tier-14-webinar-virtual-events-schedules.ts
 */
import { mkdirSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  TIER_14_SCHEDULED_GUIDE_SLUGS,
  tier14GuideScheduledAt,
} from "@/data/config/publishing/tier-14-webinar-virtual-events-launch-2026-11-01";
import { WEBINARJAM_EVERWEBINAR_LAUNCH_UTC } from "@/data/config/publishing/webinarjam-everwebinar-launch-2026-09-01";
import { guideContentId, softwareContentId } from "@/services/publishing/ids";
import { contentIdToFileToken } from "@/domain";

const OUT = join(process.cwd(), "src/data/publishing/schedules");
const CREATED_AT = "2026-08-23T15:00:00.000Z";

/** Moved from Tier 11 — only remove if not in Tier 14 schedule. */
const STALE_GUIDE_SLUGS = ["what-is-switcher-studio"].filter(
  (slug) => !TIER_14_SCHEDULED_GUIDE_SLUGS.includes(slug),
);

function writeSchedule(contentId: string, scheduledAt: string) {
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
}

function main() {
  mkdirSync(OUT, { recursive: true });
  let written = 0;

  for (const guideSlug of TIER_14_SCHEDULED_GUIDE_SLUGS) {
    const scheduledAt = tier14GuideScheduledAt(guideSlug);
    if (!scheduledAt) continue;
    writeSchedule(guideContentId(guideSlug), scheduledAt);
    written++;
  }

  writeSchedule(
    softwareContentId("webinarjam-everwebinar"),
    WEBINARJAM_EVERWEBINAR_LAUNCH_UTC,
  );
  written++;

  for (const slug of STALE_GUIDE_SLUGS) {
    const token = contentIdToFileToken(guideContentId(slug));
    const path = join(OUT, `${token}.json`);
    if (existsSync(path)) {
      unlinkSync(path);
      console.log(`Removed stale schedule ${token}.json`);
    }
  }

  console.log(`Wrote ${written} Tier 14 schedule files to ${OUT}`);
}

main();
