import type { CategoryTestProtocol } from "@/domain";
import { crmTestProtocol } from "./crm";
import { emailMarketingTestProtocol } from "./email-marketing";
import { salesIntelligenceTestProtocol } from "./sales-intelligence";

export { crmTestProtocol } from "./crm";
export { emailMarketingTestProtocol } from "./email-marketing";
export { salesIntelligenceTestProtocol } from "./sales-intelligence";

export const CATEGORY_TEST_PROTOCOLS: CategoryTestProtocol[] = [
  crmTestProtocol,
  emailMarketingTestProtocol,
  salesIntelligenceTestProtocol,
];

export function getTestProtocolBySlug(
  slug: string,
): CategoryTestProtocol | null {
  return CATEGORY_TEST_PROTOCOLS.find((p) => p.slug === slug) ?? null;
}

export function getTestProtocolForCategory(
  categorySlug: string,
): CategoryTestProtocol | null {
  return (
    CATEGORY_TEST_PROTOCOLS.find((p) => p.categorySlug === categorySlug) ?? null
  );
}

/** Prefer category protocol; fall back to CRM only when category has none. */
export function resolveProtocolForProduct(input: {
  categorySlug: string;
  protocolSlug?: string | null;
}): CategoryTestProtocol {
  if (input.protocolSlug) {
    const explicit = getTestProtocolBySlug(input.protocolSlug);
    if (explicit) return explicit;
  }
  return (
    getTestProtocolForCategory(input.categorySlug) ?? crmTestProtocol
  );
}

export function listTestProtocols(): CategoryTestProtocol[] {
  return [...CATEGORY_TEST_PROTOCOLS];
}
