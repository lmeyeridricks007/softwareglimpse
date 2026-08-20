/**
 * Re-export of domain ALLOWED_TRANSITIONS for config consumers / CLI.
 * Source of truth: `src/domain/lifecycle.ts`.
 */
export {
  ALLOWED_TRANSITIONS,
  assertTransition,
  canTransition,
  InvalidLifecycleTransitionError,
} from "@/domain/lifecycle";
