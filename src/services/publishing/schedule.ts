import { randomUUID } from "node:crypto";
import type { ContentId, ScheduleRecord } from "@/domain";
import { ContentIdSchema } from "@/domain";
import {
  appendAuditEvent,
  loadVersion,
  saveSchedule,
} from "@/data/publishing/store";
import { applyTransition } from "./transitions";

export type ScheduleContentInput = {
  contentId: ContentId | string;
  /** ISO UTC with Z. */
  scheduledAt: string;
  version: number;
  actor?: string;
  currentStatus?: "approved" | "scheduled";
};

/**
 * Schedule an approved version for future publish.
 * Timestamps must be UTC ISO with Z.
 */
export function scheduleContent(input: ScheduleContentInput): ScheduleRecord {
  const contentId = ContentIdSchema.parse(input.contentId);
  const version = loadVersion(contentId, input.version);
  if (!version) {
    throw new Error(`Version ${input.version} not found for ${contentId}`);
  }
  if (version.status !== "approved" && version.status !== "published") {
    throw new Error(
      `Version ${input.version} must be approved before scheduling (got ${version.status})`,
    );
  }

  const createdAt = new Date().toISOString();
  const record: ScheduleRecord = {
    contentId,
    scheduledAt: input.scheduledAt,
    approvedVersion: input.version,
    createdAt,
  };
  saveSchedule(record);

  const from = input.currentStatus ?? "approved";
  if (from !== "scheduled") {
    applyTransition({
      contentId,
      from,
      to: "scheduled",
      at: createdAt,
      actor: input.actor,
      reason: `scheduled-for:${input.scheduledAt}`,
      details: { version: input.version },
    });
  }

  appendAuditEvent({
    id: randomUUID(),
    contentId,
    action: "schedule",
    at: createdAt,
    actor: input.actor,
    details: {
      scheduledAt: input.scheduledAt,
      approvedVersion: input.version,
    },
  });

  return record;
}
