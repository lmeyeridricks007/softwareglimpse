/**
 * AuthorityIntelligenceOrchestrator
 *
 * DISCOVER → VERIFY → QUALIFY → RECOMMEND → DRAFT ANGLES → REPORT
 * Never mutates production content, sends outreach, or buys placements.
 */

import type { AuthorityLimitations } from "@/domain/schemas/site-intelligence";
import { AUTHORITY_INTELLIGENCE_VERSION } from "@/domain/schemas/authority-intelligence";
import { toAuthorityLimitations } from "./authority-limitations-bridge";
import {
  diffAuthoritySnapshots,
  loadPreviousAuthoritySnapshot,
  summarizeAuthorityChanges,
  writeAuthoritySnapshot,
  type AuthorityIntelligenceSnapshot,
} from "./diff";
import { runDiscoverAgent } from "./discover";
import { runDraftAnglesAgent } from "./draft-angles";
import {
  formatAnglesMarkdown,
  formatAuthorityIntelligenceMarkdown,
  formatContentGapsMarkdown,
  formatLinkableAssetsMarkdown,
  formatOpportunityListMarkdown,
} from "./master-report";
import { runQualifyAgent } from "./qualify";
import { runRecommendAgent } from "./recommend";
import {
  ANGLES_PATH,
  AVOID_PATH,
  AUTHORITY_LATEST_PATH,
  CONTENT_GAPS_PATH,
  FREE_FIRST_PATH,
  LINKABLE_ASSETS_PATH,
  OPPORTUNITIES_PATH,
  PAID_EXPOSURE_PATH,
  maybeWriteAuthorityArchive,
  writeAuthorityReport,
} from "./report-io";
import { runVerifyAgent } from "./verify";
import { LINK_SPAM_AVOID_LABEL } from "./compliance";

export const AUTHORITY_INTELLIGENCE_ORCHESTRATOR = {
  id: "authority-intelligence-orchestrator",
  label: "AuthorityIntelligenceOrchestrator",
  version: AUTHORITY_INTELLIGENCE_VERSION,
  mutatesProduction: false as const,
  sendsOutreach: false as const,
} as const;

export type AuthorityIntelligenceMode = "FAST" | "FULL" | "RECHECK";

export type AuthorityIntelligenceOptions = {
  scope?: string;
  mode?: AuthorityIntelligenceMode;
  write?: boolean;
  archive?: boolean;
  persistSnapshot?: boolean;
  generatedAt?: string;
  angleLimit?: number;
};

export function runAuthorityIntelligenceOrchestrator(
  opts: AuthorityIntelligenceOptions = {},
): {
  agent: typeof AUTHORITY_INTELLIGENCE_ORCHESTRATOR;
  generatedAt: string;
  mode: AuthorityIntelligenceMode;
  scope: string;
  paths: Record<string, string | undefined>;
  summary: {
    total: number;
    excellent: number;
    strong: number;
    good: number;
    low: number;
    avoid: number;
    freeFirst: number;
    paidExposure: number;
    linkableAssets: number;
    angles: number;
    changeSummary: Record<string, number>;
  };
  authorityLimitations: AuthorityLimitations;
  markdown: string;
  opportunities: ReturnType<typeof runRecommendAgent>["opportunities"];
} {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const mode: AuthorityIntelligenceMode = opts.mode ?? "FULL";
  const scope = opts.scope ?? "crm";
  const write = opts.write !== false;
  const agentsRun: string[] = [];

  // 1. DISCOVER
  agentsRun.push("AuthorityDiscoverAgent");
  const discovered = runDiscoverAgent({ generatedAt });

  // 2. VERIFY
  agentsRun.push("AuthorityVerifyAgent");
  const verified = runVerifyAgent(discovered.opportunities, { generatedAt });

  // 3. QUALIFY
  agentsRun.push("AuthorityQualifyAgent");
  const qualified = runQualifyAgent(verified.opportunities, { generatedAt });

  // FAST mode: skip angle drafting depth
  const angleLimit = opts.angleLimit ?? (mode === "FAST" ? 5 : 12);

  // 4. RECOMMEND
  agentsRun.push("AuthorityRecommendAgent");
  const recommended = runRecommendAgent(
    qualified.opportunities,
    qualified.linkableAssets,
    { generatedAt },
  );

  // 5. DRAFT ANGLES
  agentsRun.push("AuthorityDraftAnglesAgent");
  const angles = runDraftAnglesAgent(recommended.opportunities, {
    generatedAt,
    limit: angleLimit,
  });

  const authorityLimitations = toAuthorityLimitations(
    recommended.opportunities,
    {
      notes: [
        `Mode ${mode}; scope ${scope}.`,
        "Consumes linkable inventory from tools registry + resources seed + curated guides.",
      ],
    },
  );

  const snapshot: AuthorityIntelligenceSnapshot = {
    generatedAt,
    mode,
    scope,
    opportunityIds: recommended.opportunities.map((o) => o.id),
    items: recommended.opportunities.map((o) => ({
      id: o.id,
      scoreBand: o.scoreBand,
      status: o.status,
      domain: o.domain,
      type: o.type,
    })),
  };

  const previous = loadPreviousAuthoritySnapshot();
  const changes = diffAuthoritySnapshots(previous, snapshot);
  const changeSummary = summarizeAuthorityChanges(changes);

  const markdown = formatAuthorityIntelligenceMarkdown({
    generatedAt,
    mode,
    scope,
    opportunities: recommended.opportunities,
    freeFirst: recommended.freeFirst,
    paidExposure: recommended.paidExposure,
    avoid: recommended.avoid,
    linkableAssets: recommended.topLinkableAssets,
    angles: angles.angles,
    contentGaps: recommended.contentGapsForLinks,
    authorityLimitations,
    changeSummary,
    agentsRun,
  });

  const paths: Record<string, string | undefined> = {};

  if (write) {
    paths.intelligenceLatest = writeAuthorityReport(
      AUTHORITY_LATEST_PATH,
      markdown,
    );
    paths.linkableAssets = writeAuthorityReport(
      LINKABLE_ASSETS_PATH,
      formatLinkableAssetsMarkdown(qualified.linkableAssets),
    );
    paths.opportunities = writeAuthorityReport(
      OPPORTUNITIES_PATH,
      formatOpportunityListMarkdown(
        "All authority opportunities",
        recommended.opportunities,
        "Full qualified set including AVOID. SEO value ≠ referral/brand value.",
      ),
    );
    paths.freeFirst = writeAuthorityReport(
      FREE_FIRST_PATH,
      formatOpportunityListMarkdown(
        "Free-first opportunities",
        recommended.freeFirst,
        "Earned / owned / contributed / partnership / UGC — pursue before paid.",
      ),
    );
    paths.paidExposure = writeAuthorityReport(
      PAID_EXPOSURE_PATH,
      formatOpportunityListMarkdown(
        "Paid exposure candidates",
        recommended.paidExposure,
        "Legitimate exposure only. Links must be sponsored/nofollow-qualified. Not for buying rankings.",
      ),
    );
    paths.avoid = writeAuthorityReport(
      AVOID_PATH,
      formatOpportunityListMarkdown(
        LINK_SPAM_AVOID_LABEL,
        recommended.avoid,
        "Rejected under Google-compliance / link-spam policy. Do not pursue.",
      ),
    );
    paths.angles = writeAuthorityReport(
      ANGLES_PATH,
      formatAnglesMarkdown(angles.angles),
    );
    paths.contentGaps = writeAuthorityReport(
      CONTENT_GAPS_PATH,
      formatContentGapsMarkdown(recommended.contentGapsForLinks),
    );

    const shouldArchive =
      opts.archive === true || mode === "FULL" || mode === "RECHECK";
    if (shouldArchive) {
      paths.archive = maybeWriteAuthorityArchive(
        "authority-intelligence.md",
        markdown,
        { mode, force: true, now: new Date(generatedAt) },
      );
    }

    if (opts.persistSnapshot !== false) {
      paths.snapshot = writeAuthoritySnapshot(snapshot);
    }
  }

  const count = (band: string) =>
    recommended.opportunities.filter((o) => o.scoreBand === band).length;

  return {
    agent: AUTHORITY_INTELLIGENCE_ORCHESTRATOR,
    generatedAt,
    mode,
    scope,
    paths,
    summary: {
      total: recommended.opportunities.length,
      excellent: count("EXCELLENT"),
      strong: count("STRONG"),
      good: count("GOOD"),
      low: count("LOW"),
      avoid: count("AVOID"),
      freeFirst: recommended.freeFirst.length,
      paidExposure: recommended.paidExposure.length,
      linkableAssets: qualified.linkableAssets.length,
      angles: angles.angles.length,
      changeSummary,
    },
    authorityLimitations,
    markdown,
    opportunities: recommended.opportunities,
  };
}
