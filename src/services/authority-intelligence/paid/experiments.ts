import type {
  PaidExperiment,
  PaidPromotionOpportunity,
} from "./types";

/**
 * Best paid *experiments* — not "buy these links".
 */
export function buildPaidExperiments(
  opportunities: PaidPromotionOpportunity[],
): PaidExperiment[] {
  const find = (pred: (o: PaidPromotionOpportunity) => boolean) =>
    opportunities.find(pred);

  const revEngine = find(
    (o) =>
      o.domain.includes("revopsimpact") &&
      o.opportunity.toLowerCase().includes("newsletter"),
  );
  const pulseNl = find(
    (o) =>
      o.domain.includes("pulserevops") &&
      o.opportunity.toLowerCase().includes("newsletter"),
  );
  const techpresso = find(
    (o) =>
      o.domain.includes("dupple") &&
      o.opportunity.toLowerCase().includes("primary"),
  );
  const g2 = find(
    (o) => o.domain.includes("g2.com") && o.type === "PAID_ADVERTISING",
  );
  const spotify = find((o) => o.domain.includes("spotify"));
  const roa = find(
    (o) =>
      o.domain.includes("revenueoperationsalliance") &&
      (o.type === "EVENT" || o.type === "SPONSORSHIP" || o.type === "CONFERENCE"),
  );

  const experiments: PaidExperiment[] = [];

  if (revEngine) {
    experiments.push({
      id: "A1",
      title: "Sponsor a RevOps newsletter (RevEngine test)",
      channel: revEngine.siteChannel,
      goal: "Qualified visitors to CRM Evaluation Checklist + Finder starts",
      targetSgPage: "/resources/crm-evaluation-checklist/",
      budgetTier: "€250–1,000",
      estimatedCost: revEngine.costDisplay,
      measure: [
        "Sessions (UTM)",
        "Checklist downloads / views",
        "CRM Finder starts",
        "Newsletter signup on SG",
        "Branded search lift (week +4)",
      ],
      relatedOpportunityIds: [revEngine.id],
    });
  }

  if (pulseNl) {
    experiments.push({
      id: "A2",
      title: "PULSE RevOps newsletter sponsor slot (inquiry)",
      channel: pulseNl.siteChannel,
      goal: "Brand awareness among RevOps operators researching tooling",
      targetSgPage: "/tools/crm-vendor-scorecard/",
      budgetTier: pulseNl.budgetTier,
      estimatedCost: pulseNl.costDisplay,
      measure: [
        "Click-throughs to scorecard",
        "Time on tool",
        "Return visits",
        "Direct/branded sessions",
      ],
      relatedOpportunityIds: [pulseNl.id],
    });
  }

  if (techpresso) {
    experiments.push({
      id: "A3",
      title: "Dupple Techpresso Spotlight or Primary (broader tech)",
      channel: techpresso.siteChannel,
      goal: "Top-of-funnel brand exposure to founders/operators; CTA to CRM Finder",
      targetSgPage: "/tools/crm-finder/",
      budgetTier: "€1,000–5,000",
      estimatedCost: techpresso.costDisplay,
      measure: [
        "Unique clicks",
        "Finder completions",
        "New users",
        "Cost per Finder start",
      ],
      relatedOpportunityIds: [techpresso.id],
    });
  }

  if (g2) {
    experiments.push({
      id: "A4",
      title: "G2 Ads Clicks — category visibility test (not link equity)",
      channel: g2.siteChannel,
      goal: "Buyer-intent referral traffic while evaluating CRM category presence",
      targetSgPage: "/tools/crm-finder/",
      budgetTier: "€1,000–5,000",
      estimatedCost: g2.costDisplay,
      measure: [
        "Ad clicks",
        "Landing sessions",
        "Assisted conversions",
        "CPC vs LinkedIn benchmark",
      ],
      relatedOpportunityIds: [g2.id],
    });
  }

  if (spotify) {
    experiments.push({
      id: "A5",
      title: "Spotify Ads Manager low-budget brand test",
      channel: spotify.siteChannel,
      goal: "Branded search / aided awareness among business/tech listeners",
      targetSgPage: "/",
      budgetTier: "€250–1,000",
      estimatedCost: spotify.costDisplay,
      measure: [
        "Reach / frequency",
        "Branded search queries",
        "Direct traffic",
        "Landing page visits from campaign URL",
      ],
      relatedOpportunityIds: [spotify.id],
    });
  }

  if (roa) {
    experiments.push({
      id: "A6",
      title: "RevOps Alliance summit — sponsorship pack inquiry (later stage)",
      channel: roa.siteChannel,
      goal: "Industry visibility + speaking/tool-demo path among RevOps leaders",
      targetSgPage: "/tools/crm-vendor-scorecard/",
      budgetTier: "€5,000+",
      estimatedCost: roa.costDisplay,
      measure: [
        "Booth/demo conversations",
        "Badge scans / leads",
        "Post-event sessions",
        "Partner mentions",
      ],
      relatedOpportunityIds: [roa.id],
    });
  }

  // Always include a free-tier control experiment
  experiments.push({
    id: "A0",
    title: "Control — earned/free channels first (no paid spend)",
    channel: "Earned backlink + community participation (non-spam)",
    goal: "Baseline sessions to checklist before paid tests",
    targetSgPage: "/resources/crm-evaluation-checklist/",
    budgetTier: "€0",
    estimatedCost: "€0",
    measure: [
      "Organic sessions",
      "Referral sessions from earned placements",
      "Finder starts",
      "Download events",
    ],
    relatedOpportunityIds: [],
  });

  return experiments.sort((a, b) => a.id.localeCompare(b.id));
}
