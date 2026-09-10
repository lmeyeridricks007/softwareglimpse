import { getSiteUrl } from "@/lib/site";

export type UtmParams = {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
};

/**
 * Attach UTM parameters to a SoftwareGlimpse path or absolute URL.
 * Does not invent destinations.
 */
export function withUtm(pathOrUrl: string, utm: UtmParams): string {
  const base = pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${getSiteUrl().replace(/\/$/, "")}${
        pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`
      }`;
  const url = new URL(base);
  url.searchParams.set("utm_source", utm.source);
  url.searchParams.set("utm_medium", utm.medium);
  url.searchParams.set("utm_campaign", utm.campaign);
  if (utm.content) url.searchParams.set("utm_content", utm.content);
  if (utm.term) url.searchParams.set("utm_term", utm.term);
  return url.toString();
}

export function channelUtm(
  campaignSlug: string,
  channel: string,
): UtmParams {
  return {
    source: channel.replace(/_/g, "-"),
    medium: channel.includes("newsletter") ? "email" : "social",
    campaign: campaignSlug,
    content: channel,
  };
}

/** Slugify campaign id for utm_campaign (lowercase kebab). */
export function utmCampaignSlug(parts: string[]): string {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
