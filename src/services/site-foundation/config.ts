import { siteFoundationConfig } from "@/data/config/site/foundation";
import { computeLegalConfigurationGaps } from "@/data/config/site/legal-completeness";
import type {
  Author,
  CookieCategory,
  CookieDefinition,
  LegalDocument,
  SiteFoundationConfig,
  SiteIdentity,
} from "@/domain";

export function getSiteFoundationConfig(): SiteFoundationConfig {
  return siteFoundationConfig;
}

export function getSiteIdentity(): SiteIdentity {
  return siteFoundationConfig.identity;
}

export function getAuthorById(id: string): Author | null {
  return siteFoundationConfig.authors.find((a) => a.id === id) ?? null;
}

export function getFounderAuthor(): Author | null {
  const id = siteFoundationConfig.identity.founderAuthorId;
  return id ? getAuthorById(id) : null;
}

export function getLegalDocument(id: string): LegalDocument | null {
  return (
    siteFoundationConfig.legalDocuments.find((d) => d.id === id) ?? null
  );
}

export function getLegalDocumentByPath(path: string): LegalDocument | null {
  const normalized = path.endsWith("/") ? path : `${path}/`;
  return (
    siteFoundationConfig.legalDocuments.find((d) => d.path === normalized) ??
    null
  );
}

export function listLegalDocuments(): LegalDocument[] {
  return siteFoundationConfig.legalDocuments;
}

export function cookiesByCategory(
  category: CookieCategory,
): CookieDefinition[] {
  return siteFoundationConfig.cookies.filter((c) => c.category === category);
}

export function isLegalConfigurationComplete(): boolean {
  return (
    siteFoundationConfig.identity.configurationComplete === true &&
    legalConfigurationMissingFields().length === 0
  );
}

export function legalConfigurationMissingFields(): string[] {
  return computeLegalConfigurationGaps(siteFoundationConfig);
}

export const COMPANY_ROUTES = {
  about: "/company/about/",
  myStory: "/company/my-story/",
  methodology: "/company/editorial-methodology/",
  howWeReview: "/company/how-we-review-software/",
  contact: "/company/contact/",
} as const;

export const LEGAL_ROUTES = {
  privacy: "/legal/privacy/",
  cookies: "/legal/cookies/",
  terms: "/legal/terms/",
  affiliateDisclosure: "/legal/affiliate-disclosure/",
  editorialIndependence: "/legal/editorial-independence/",
  advertising: "/legal/advertising-sponsorship/",
  disclaimer: "/legal/disclaimer/",
  accessibility: "/legal/accessibility/",
} as const;

export const NEWSLETTER_ROUTES = {
  confirm: "/newsletter/confirm/",
  thanks: "/newsletter/thanks/",
  preferences: "/newsletter/preferences/",
} as const;
