import {
  CrmRfpSessionSchema,
  createEmptyCrmRfpSession,
  rfpStorageKey,
  type CrmRfpDraft,
  type CrmRfpSession,
} from "@/domain";
import { createDefaultDraft, touchCrmRfpSession } from "./persistence";
import type { RfpContentPack } from "./pack-context";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function remapCrmSecurityWording(draft: CrmRfpDraft): CrmRfpDraft {
  return {
    ...draft,
    securityQuestions: draft.securityQuestions.map((question) => ({
      ...question,
      question: question.question
        .replaceAll("CRM customer data", "customer data")
        .replaceAll("CRM data", "customer data")
        .replaceAll("customer CRM data", "customer data"),
    })),
  };
}

export function createSeededCategoryRfpSession(
  _pack?: RfpContentPack,
  now: string = new Date().toISOString(),
): CrmRfpSession {
  const empty = createEmptyCrmRfpSession(now);
  return {
    ...empty,
    draft: remapCrmSecurityWording(createDefaultDraft()),
  };
}

export function loadCategoryRfpSession(
  categorySlug: string,
): CrmRfpSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(rfpStorageKey(categorySlug));
    if (!raw) return null;
    const parsed = CrmRfpSessionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveCategoryRfpSession(
  categorySlug: string,
  session: CrmRfpSession,
): void {
  if (!canUseStorage()) return;
  try {
    const next = CrmRfpSessionSchema.parse({
      ...session,
      updatedAt: new Date().toISOString(),
      versionMeta: {
        ...session.versionMeta,
        lastModifiedAt: new Date().toISOString(),
      },
    });
    localStorage.setItem(rfpStorageKey(categorySlug), JSON.stringify(next));
  } catch {
    // Quota / private mode — fail soft
  }
}

export function resetCategoryRfpSession(
  categorySlug: string,
  pack?: RfpContentPack,
): CrmRfpSession {
  const next = createSeededCategoryRfpSession(pack);
  if (canUseStorage()) {
    localStorage.setItem(rfpStorageKey(categorySlug), JSON.stringify(next));
  }
  return next;
}

export { touchCrmRfpSession as touchCategoryRfpSession };
