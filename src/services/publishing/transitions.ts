import { randomUUID } from "node:crypto";
import {
  assertTransition,
  type ContentId,
  type PublishStatus,
} from "@/domain";
import { appendAuditEvent } from "@/data/publishing/store";

export type ApplyTransitionInput = {
  contentId: ContentId | string;
  from: PublishStatus;
  to: PublishStatus;
  at?: string;
  actor?: string;
  reason?: string;
  details?: Record<string, unknown>;
};

export type ApplyTransitionResult = {
  from: PublishStatus;
  to: PublishStatus;
  at: string;
};

/**
 * Validate and record a lifecycle transition with an audit event.
 * Does not mutate live catalogue seeds — callers update their own stores.
 */
export function applyTransition(
  input: ApplyTransitionInput,
): ApplyTransitionResult {
  assertTransition(input.from, input.to);
  const at = input.at ?? new Date().toISOString();
  appendAuditEvent({
    id: randomUUID(),
    contentId: input.contentId as ContentId,
    action: `transition:${input.from}->${input.to}`,
    at,
    actor: input.actor,
    details: {
      from: input.from,
      to: input.to,
      reason: input.reason,
      ...input.details,
    },
  });
  return { from: input.from, to: input.to, at };
}
