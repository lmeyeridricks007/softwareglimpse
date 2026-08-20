/**
 * DraftAnglesAgent — human-action outreach angle drafts only.
 * NEVER sends email, posts comments, or submits forms.
 */

import type {
  AuthorityOpportunity,
  OutreachAngleDraft,
} from "@/domain/schemas/authority-intelligence";

export const DRAFT_ANGLES_AGENT = {
  id: "authority-draft-angles-agent",
  label: "AuthorityDraftAnglesAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
  sendsOutreach: false as const,
} as const;

export type DraftAnglesResult = {
  agent: typeof DRAFT_ANGLES_AGENT;
  generatedAt: string;
  angles: OutreachAngleDraft[];
  notes: string[];
};

const DEFAULT_DO_NOT = [
  "Do not send this pitch automatically.",
  "Do not buy dofollow links or join PBNs.",
  "Do not spam community threads with unsolicited links.",
  "Do not invent statistics or affiliate-motivated rankings in the pitch.",
];

export function runDraftAnglesAgent(
  opportunities: AuthorityOpportunity[],
  opts: { generatedAt?: string; limit?: number } = {},
): DraftAnglesResult {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const limit = opts.limit ?? 12;

  const candidates = opportunities
    .filter((o) => o.scoreBand !== "AVOID" && o.status !== "avoid")
    .filter(
      (o) =>
        o.scoreBand === "EXCELLENT" ||
        o.scoreBand === "STRONG" ||
        o.scoreBand === "GOOD",
    )
    .slice(0, limit);

  const angles: OutreachAngleDraft[] = candidates.map((opp) => {
    const asset =
      opp.targetSoftwareGlimpsePage ??
      "a relevant SoftwareGlimpse tool or resource";
    const pitch =
      opp.suggestedPitchAngle ??
      `Share how ${asset} helps their audience evaluate CRM software with transparent methodology.`;

    return {
      opportunityId: opp.id,
      angleTitle: `${opp.type.replace(/_/g, " ").toLowerCase()} → ${opp.organization}`,
      pitchSummary: pitch,
      whyRelevant: opp.reasonWhyTheyMightLink,
      suggestedAssetPaths: opp.targetSoftwareGlimpsePage
        ? [opp.targetSoftwareGlimpsePage]
        : [],
      doNotDo: [
        ...DEFAULT_DO_NOT,
        ...(opp.acquisitionType === "PAID"
          ? [
              "If pursuing paid placement, require sponsored/nofollow disclosure — never pitch as editorial SEO link.",
            ]
          : []),
        ...(opp.acquisitionType === "UGC"
          ? [
              "Only participate when answering a real question; no drive-by link drops.",
            ]
          : []),
      ],
      requiresHumanAction: true,
    };
  });

  return {
    agent: DRAFT_ANGLES_AGENT,
    generatedAt,
    angles,
    notes: [
      "Angles are drafts for human review only.",
      "Authority Intelligence will never send outreach without explicit user action outside this system.",
    ],
  };
}
