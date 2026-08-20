/**
 * Central workflow execution limits and retry defaults.
 * Do not scatter retry loops inside agents.
 */
export const WORKFLOW_EXECUTION_CONFIG = {
  concurrency: 1,
  maxAgentTasksPerRun: 10,
  maxResearchTasksPerRun: 5,
  maxAutomaticRevisions: 1,
  maxComparisonsPerProduct: 3,
  defaultRetry: {
    maxAttempts: 2,
    backoffMs: 0,
    retryableErrorCodes: [
      "provider-timeout",
      "rate-limit",
      "temporary-fetch",
      "transient",
    ],
  },
  /** Quality / readiness failures must not auto-retry. */
  nonRetryableErrorCodes: [
    "quality-failure",
    "missing-methodology",
    "invalid-taxonomy",
    "unsupported-pricing-model",
    "qa-fail",
    "agent-blocked",
    "affiliate-economics-leak",
  ],
  /**
   * Site-audit WORKFLOW_STUCK: required editorial wait is normal until this age.
   * Optional QA-fail that parks the whole run is flagged immediately.
   */
  stuckAfterMs: 24 * 60 * 60 * 1000,
} as const;
