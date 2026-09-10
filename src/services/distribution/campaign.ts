import type { ChannelDraft, DistributionCampaign } from "@/domain";
import { campaignFromCrmPricingResearch } from "./sources/crm-pricing";
import { campaignsFromConfirmedPriceChanges } from "./sources/price-changes";
import { campaignsFromProductTesting } from "./sources/product-testing";
import { generateChannelDrafts } from "./drafts";
import {
  assembleSoftwareGlimpseWeekly,
  formatNewsletterMarkdown,
} from "./newsletter";
import {
  recordCampaignDraftTracking,
} from "./tracking";
import { channelUtm, withUtm } from "./utm";

export type DistributionPack = {
  generatedAt: string;
  campaigns: DistributionCampaign[];
  draftsByCampaignId: Record<string, ChannelDraft[]>;
  newsletterMarkdown: string;
  newsletterIncludedSections: string[];
};

/**
 * Collect genuine source campaigns and generate channel drafts.
 * Skips empty/filler sources.
 */
export function buildDistributionPack(
  opts: {
    includeResearch?: boolean;
    includePriceChanges?: boolean;
    includeTesting?: boolean;
    recordTracking?: boolean;
    now?: Date;
  } = {},
): DistributionPack {
  const now = opts.now ?? new Date();
  const campaigns: DistributionCampaign[] = [];

  if (opts.includeResearch !== false) {
    const research = campaignFromCrmPricingResearch(now);
    if (research) campaigns.push(research);
  }
  if (opts.includePriceChanges !== false) {
    campaigns.push(...campaignsFromConfirmedPriceChanges({ now }));
  }
  if (opts.includeTesting !== false) {
    campaigns.push(...campaignsFromProductTesting({ now }));
  }

  const draftsByCampaignId: Record<string, ChannelDraft[]> = {};
  for (const campaign of campaigns) {
    const drafts = generateChannelDrafts(campaign);
    draftsByCampaignId[campaign.id] = drafts;

    if (opts.recordTracking !== false) {
      for (const draft of drafts) {
        const url =
          draft.ctaUrl ??
          withUtm(
            campaign.sourceURL,
            channelUtm(campaign.utmCampaign, draft.channel),
          );
        recordCampaignDraftTracking({
          campaignId: campaign.id,
          utmCampaign: campaign.utmCampaign,
          trackedUrl: url,
          channel: draft.channel,
          status: "drafted",
        });
      }
    }
  }

  const newsletter = assembleSoftwareGlimpseWeekly(campaigns, {
    weekLabel: now.toISOString().slice(0, 10),
    now,
  });

  return {
    generatedAt: now.toISOString(),
    campaigns,
    draftsByCampaignId,
    newsletterMarkdown: formatNewsletterMarkdown(newsletter),
    newsletterIncludedSections: newsletter.includedSectionIds,
  };
}
