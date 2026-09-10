import { createHash } from "node:crypto";
import type {
  CompetitorLinkGap,
  DigitalPrOutreachStatus,
  LinkPitchAngle,
  LinkProspect,
  ScoredLinkableAsset,
} from "./types";
import {
  classifyProspectType,
  editorialLikelihoodForType,
} from "./classify";
import { evaluateProspectQuality } from "./prospect-quality";

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function prospectId(domain: string, assetPath: string): string {
  return createHash("sha256")
    .update(`${domain}|${assetPath}`)
    .digest("hex")
    .slice(0, 16);
}

/**
 * Build pitch angle from known facts only — never invent personalization.
 */
export function buildPitchAngle(input: {
  domain: string;
  prospectType: string;
  asset: ScoredLinkableAsset;
  gap: CompetitorLinkGap;
  relationshipStatus: DigitalPrOutreachStatus;
}): LinkPitchAngle {
  const personalizationEvidence: string[] = [];
  if (input.gap.domainsLinkingToCompetitor > 0) {
    personalizationEvidence.push(
      `Export shows ${input.gap.domainsLinkingToCompetitor} referring domain(s) to ${input.gap.competitorUrl}`,
    );
  }
  if (input.gap.sampleDomains.includes(input.domain)) {
    personalizationEvidence.push(
      `${input.domain} appears among domains linking to the competitor URL but not observed linking to SoftwareGlimpse in this export`,
    );
  }
  if (personalizationEvidence.length === 0) {
    personalizationEvidence.push(
      "No person-level personalization available — do not invent names, quotes, or article titles",
    );
  }

  return {
    whyRelevant: `${input.domain} is classified as ${input.prospectType}; topical relevance to ${input.gap.softwareGlimpsePath} scored ${input.gap.topicalRelevance}/100 from configured theme (${input.asset.cluster ?? "general"}).`,
    assetFit: `${input.asset.name} (${input.asset.path}) — ${input.asset.whyLinkable}`,
    triggeringResource: input.gap.competitorUrl || null,
    suggestedAngle: suggestAngle(input.asset, input.prospectType),
    personalizationEvidence,
    outreachApproach:
      input.relationshipStatus === "QUALIFIED"
        ? "Short, human-reviewed email or contact form — one asset, one ask. No bulk send. Draft only — never auto-send."
        : input.relationshipStatus === "IDENTIFIED"
          ? "Identified only — qualify before drafting outreach."
          : `Continue from status ${input.relationshipStatus}; do not re-blast.`,
  };
}

function suggestAngle(asset: ScoredLinkableAsset, prospectType: string): string {
  if (asset.path.includes("/research/crm-pricing-history")) {
    return "Offer verified CRM starting-price history snapshots for readers tracking list-price movement.";
  }
  if (
    asset.path === "/research/crm-pricing/" ||
    asset.path.endsWith("/research/crm-pricing/")
  ) {
    return "Offer catalogue-derived CRM pricing benchmarks (with sample size + methodology) as a citeable statistic — not a vendor ranking.";
  }
  if (asset.kind === "tool") {
    return "Offer a free interactive tool readers can run without an account — utility citation, not a sponsored placement.";
  }
  if (prospectType === "RESOURCE_PAGE") {
    return "Suggest inclusion on an existing software-buying resource list with a deep link to the most relevant asset.";
  }
  if (prospectType === "PODCAST") {
    return "Offer founder/methodology talking points on transparent software buying research — no paid-link pitch.";
  }
  return (
    asset.promotionAngles[0] ??
    "Share original SoftwareGlimpse research or tools as a helpful citation."
  );
}

/**
 * Optional short outreach draft — never sent automatically.
 * Call only for QUALIFIED prospects.
 */
export function buildOutreachDraft(input: {
  domain: string;
  asset: ScoredLinkableAsset;
  pitch: LinkPitchAngle;
}): string {
  const trigger = input.pitch.triggeringResource
    ? `I noticed coverage/resources around ${input.pitch.triggeringResource}. `
    : "";
  return (
    `Hi — quick note from SoftwareGlimpse (human-reviewed draft; not sent).\n\n` +
    `${trigger}` +
    `We published ${input.asset.name} (${input.asset.path}) with transparent methodology` +
    ` — might be useful if you cover software buying / CRM pricing.\n\n` +
    `Happy to share the dataset notes or a one-line citation. No paid link request.\n\n` +
    `— SoftwareGlimpse`
  );
}

/**
 * Score and assemble top prospects from gap sample domains + assets.
 * Prioritizes topical relevance, editorial fit, asset fit, and real link evidence.
 * Excludes spam/PBN/example domains. Drafts only for QUALIFIED.
 */
export function buildProspectsFromGaps(input: {
  gaps: CompetitorLinkGap[];
  assets: ScoredLinkableAsset[];
  relationshipByDomain?: Map<string, DigitalPrOutreachStatus>;
  limit?: number;
}): LinkProspect[] {
  const assetsByPath = new Map(input.assets.map((a) => [a.path, a]));
  const prospects: LinkProspect[] = [];

  for (const gap of input.gaps) {
    if (gap.domainsNotLinkingToSoftwareGlimpse === 0) continue;
    const asset =
      assetsByPath.get(gap.softwareGlimpsePath) ??
      input.assets.find((a) => a.path.startsWith("/research/")) ??
      input.assets[0];
    if (!asset) continue;

    for (const domain of gap.sampleDomains) {
      const prospectType = classifyProspectType({
        domain,
        url: gap.competitorUrl,
        pathHints: [gap.softwareGlimpsePath, asset.kind],
      });
      const topicalRelevance = gap.topicalRelevance;
      const authorityScore = gap.authorityMetricAverage;
      const competitorLinkEvidence = clamp(
        Math.min(gap.domainsLinkingToCompetitor, 40) +
          gap.competitorCountReceivingLink * 5,
      );
      const assetFit = asset.assetScore;
      const editorialLikelihood = editorialLikelihoodForType(prospectType);

      const quality = evaluateProspectQuality({
        domain,
        prospectType,
        topicalRelevance,
        competitorLinkEvidence,
        assetFit,
        authorityScore,
      });
      if (!quality.ok) continue;

      const tracked = input.relationshipByDomain?.get(domain);
      let relationshipStatus: DigitalPrOutreachStatus =
        tracked ?? (quality.qualify ? "QUALIFIED" : "IDENTIFIED");
      // Never invent CONTACTED/LINK_EARNED — only tracking store may set those.
      if (
        !tracked &&
        quality.qualify &&
        relationshipStatus === "IDENTIFIED"
      ) {
        relationshipStatus = "QUALIFIED";
      }

      const opportunityScore = clamp(
        topicalRelevance * 0.3 +
          assetFit * 0.22 +
          editorialLikelihood * 0.2 +
          competitorLinkEvidence * 0.18 +
          (authorityScore != null ? Math.min(authorityScore * 0.1, 10) : 0),
      );

      const pitch = buildPitchAngle({
        domain,
        prospectType,
        asset,
        gap,
        relationshipStatus,
      });

      prospects.push({
        id: prospectId(domain, asset.path),
        domain,
        prospectType,
        prospectUrl: `https://${domain}/`,
        organizationHint: null,
        softwareGlimpseAssetPath: asset.path,
        softwareGlimpseAssetName: asset.name,
        triggeredByCompetitorUrl: gap.competitorUrl,
        topicalRelevance,
        authorityScore,
        competitorLinkEvidence,
        assetFit,
        editorialLikelihood,
        trafficIfAvailable: null,
        relationshipStatus,
        opportunityScore,
        scoreNotes: [
          "Relevance, asset fit, and real link evidence weighted above authority",
          authorityScore == null
            ? "No DR/DA in export for this gap — authority left null"
            : `Authority metric averaged from export (${authorityScore})`,
          ...quality.qualityNotes,
          ...gap.notes.slice(0, 1),
        ],
        pitch,
        outreachDraft:
          relationshipStatus === "QUALIFIED"
            ? buildOutreachDraft({ domain, asset, pitch })
            : null,
      });
    }
  }

  const byId = new Map<string, LinkProspect>();
  for (const p of prospects) {
    const prev = byId.get(p.id);
    if (!prev || p.opportunityScore > prev.opportunityScore) {
      byId.set(p.id, p);
    }
  }

  return [...byId.values()]
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, input.limit ?? 40);
}
