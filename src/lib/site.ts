/**
 * Site-wide constants. Prefer env override for staging/preview deployments.
 */
export const SITE_NAME = "SoftwareGlimpse";
export const SITE_TAGLINE = "Which software should I choose?";

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return fromEnv || "https://www.softwareglimpse.com";
}
