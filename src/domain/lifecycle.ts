import type { PublishStatus } from "@/domain/schemas/content-metadata";

/**
 * Allowed publish-status transitions.
 *
 * Invalid by policy (assertTransition throws):
 * - idea / researching → published (must pass draft → review → approved)
 * - draft → published (must go through approved)
 * - archived → published (restore to draft first)
 *
 * Allowed highlights:
 * - approved → scheduled → published
 * - approved → published (publish now)
 * - published → refresh-needed → refreshing → review → approved → published
 * - rejected → draft
 * - archived → draft (restore)
 */
export const ALLOWED_TRANSITIONS: Readonly<
  Record<PublishStatus, readonly PublishStatus[]>
> = {
  idea: ["researching", "draft", "rejected", "archived"],
  researching: ["idea", "draft", "rejected", "archived"],
  draft: ["researching", "review", "rejected", "archived", "idea"],
  review: ["draft", "approved", "rejected", "archived"],
  approved: ["review", "scheduled", "published", "draft", "rejected", "archived"],
  scheduled: ["approved", "published", "rejected", "archived"],
  published: [
    "refresh-needed",
    "refreshing",
    "archived",
    "rejected",
  ],
  "refresh-needed": [
    "refreshing",
    "review",
    "published",
    "archived",
    "rejected",
  ],
  refreshing: ["review", "refresh-needed", "archived", "rejected"],
  rejected: ["draft", "archived", "idea"],
  archived: ["draft"],
};

export function canTransition(from: PublishStatus, to: PublishStatus): boolean {
  if (from === to) return true;
  return (ALLOWED_TRANSITIONS[from] as readonly PublishStatus[]).includes(to);
}

export class InvalidLifecycleTransitionError extends Error {
  readonly from: PublishStatus;
  readonly to: PublishStatus;

  constructor(from: PublishStatus, to: PublishStatus) {
    super(`Invalid lifecycle transition: ${from} → ${to}`);
    this.name = "InvalidLifecycleTransitionError";
    this.from = from;
    this.to = to;
  }
}

export function assertTransition(from: PublishStatus, to: PublishStatus): void {
  if (!canTransition(from, to)) {
    throw new InvalidLifecycleTransitionError(from, to);
  }
}
