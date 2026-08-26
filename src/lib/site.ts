/**
 * Site-wide constants. Prefer env override for staging/preview deployments.
 */
export const SITE_NAME = "SoftwareGlimpse";
export const SITE_TAGLINE = "Which software should I choose?";
export const SITE_HOME_TITLE =
  "SoftwareGlimpse — Software Reviews, Comparisons & Fit-Based Tools";
export const SITE_HOME_DESCRIPTION =
  "Independent software reviews, comparisons, and fit-based finders across CRM, marketing, HR, IT, and more. Affiliate commissions never set rankings.";

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return fromEnv || "https://www.softwareglimpse.com";
}
