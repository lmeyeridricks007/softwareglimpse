import type { SiteFoundationConfig } from "@/domain";

const REQUIRED_IDENTITY_FIELDS = [
  "legalEntityName",
  "country",
  "contactEmail",
  "privacyEmail",
  "businessAddress",
  "registrationNumber",
] as const;

/**
 * Compute legal/privacy configuration gaps from the live foundation config.
 *
 * Does not invent controller identity. Inactive processing (analytics /
 * newsletter while `active: false`) does not require retention or a
 * configured processor. Hosting is required only when an active activity
 * lists it as a recipient.
 */
export function computeLegalConfigurationGaps(
  config: SiteFoundationConfig,
): string[] {
  const missing: string[] = [];
  const identity = config.identity;

  for (const field of REQUIRED_IDENTITY_FIELDS) {
    const value = identity[field];
    if (typeof value !== "string" || !value.trim()) {
      missing.push(`identity.${field}`);
    }
  }

  const retention = config.retention;
  const newsletterActive = config.processingActivities.some(
    (activity) => activity.id === "pa-newsletter" && activity.active,
  );
  const analyticsActive = config.processingActivities.some(
    (activity) => activity.id === "pa-analytics" && activity.active,
  );

  if (!retention.contactSubmissions?.trim()) {
    missing.push("retention.contactSubmissions");
  }
  if (!retention.consentRecords?.trim()) {
    missing.push("retention.consentRecords");
  }
  if (!retention.serverLogs?.trim()) {
    missing.push("retention.serverLogs");
  }
  if (newsletterActive && !retention.newsletterMetadata?.trim()) {
    missing.push("retention.newsletterMetadata");
  }
  if (analyticsActive && !retention.analytics?.trim()) {
    missing.push("retention.analytics");
  }

  const processorsById = new Map(
    config.processors.map((processor) => [processor.id, processor]),
  );
  const activeRecipientIds = new Set(
    config.processingActivities
      .filter((activity) => activity.active)
      .flatMap((activity) => activity.recipients),
  );
  for (const processorId of activeRecipientIds) {
    const processor = processorsById.get(processorId);
    if (!processor?.configured) {
      missing.push(`processors.${processorId}`);
    }
  }

  if (!config.terms.governingLaw?.trim()) {
    missing.push("terms.governingLaw");
  }

  return missing;
}
