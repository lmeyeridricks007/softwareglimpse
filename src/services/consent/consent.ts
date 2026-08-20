import {
  ConsentRecordSchema,
  type ConsentRecord,
  type CookieCategory,
} from "@/domain/schemas/site-foundation";
import { getSiteFoundationConfig } from "@/services/site-foundation/config";

export const CONSENT_STORAGE_KEY = "sg_consent";

export type ConsentCategories = ConsentRecord["categories"];

export function defaultDeniedConsent(version: string): ConsentRecord {
  return ConsentRecordSchema.parse({
    version,
    decidedAt: new Date().toISOString(),
    categories: {
      strictlyNecessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
    },
  });
}

export function acceptAllConsent(version: string): ConsentRecord {
  const config = getSiteFoundationConfig();
  const inUse = new Set(config.consent.categoriesInUse);
  return ConsentRecordSchema.parse({
    version,
    decidedAt: new Date().toISOString(),
    categories: {
      strictlyNecessary: true,
      preferences: inUse.has("preferences"),
      analytics: inUse.has("analytics"),
      marketing: inUse.has("marketing"),
    },
  });
}

export function rejectOptionalConsent(version: string): ConsentRecord {
  return defaultDeniedConsent(version);
}

export function parseConsentRecord(raw: unknown): ConsentRecord | null {
  const parsed = ConsentRecordSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export function isConsentExpired(
  record: ConsentRecord,
  now = Date.now(),
): boolean {
  const config = getSiteFoundationConfig();
  if (record.version !== config.consent.version) return true;
  const decided = Date.parse(record.decidedAt);
  if (Number.isNaN(decided)) return true;
  const maxAgeMs = config.consent.renewAfterDays * 24 * 60 * 60 * 1000;
  return now - decided > maxAgeMs;
}

export function categoryAllowed(
  record: ConsentRecord | null,
  category: CookieCategory,
): boolean {
  if (category === "strictly-necessary") return true;
  if (!record) return false;
  switch (category) {
    case "preferences":
      return record.categories.preferences;
    case "analytics":
      return record.categories.analytics;
    case "marketing":
      return record.categories.marketing;
    default:
      return false;
  }
}

export function readConsentFromStorage(
  storage: Pick<Storage, "getItem"> | null | undefined,
): ConsentRecord | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    return parseConsentRecord(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeConsentToStorage(
  storage: Pick<Storage, "setItem"> | null | undefined,
  record: ConsentRecord,
): void {
  if (!storage) return;
  storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
}
