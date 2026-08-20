/**
 * Build promotion plans + tool launch plans.
 * Generates angles and repurposing ideas — does NOT create assets.
 */

import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import { stableHash, slugToken } from "../stable-ids";
import { MAJOR_LAUNCH_TOOLS } from "./priority-assets";
import type {
  PriorityAsset,
  PromotionPlan,
  ToolLaunchPlan,
} from "./types";

function planId(assetId: string): string {
  return `PROMO-${slugToken(assetId, 36)}-${stableHash(assetId)}`;
}

type AnglePack = {
  audience: string;
  primary: string[];
  weak: string[];
  angle: string;
  bad: string;
  repurposing: PromotionPlan["repurposingIdeas"];
  outcome: string;
  effort: PromotionPlan["effort"];
  paidFree: PromotionPlan["paidFree"];
  measurement: string[];
  partnerships?: string[];
  paidTests?: string[];
  prIdeas?: string[];
  safety?: string;
};

function angleFor(asset: PriorityAsset): AnglePack {
  const path = asset.path;

  if (path.includes("crm-evaluation-checklist")) {
    return {
      audience:
        "RevOps, sales ops, CRM consultants, and buyers mid-evaluation who shortlist before testing workflow gates",
      primary: [
        "linkedin-organic",
        "revops-coop",
        "roa",
        "revgenius",
        "reddit-crm",
        "revengine-nl",
        "owned-email",
        "vendor-ecosystems",
      ],
      weak: ["consumer-social", "discord-generic"],
      angle:
        "We reviewed the CRM buying process and found teams often score vendors before they've verified basic workflow gates. We built a free evaluation workbook that forces every vendor through the same test.",
      bad: "Check out our CRM checklist.",
      repurposing: [
        "linkedin-carousel",
        "downloadable-checklist",
        "newsletter-piece",
        "reddit-discussion",
        "diagram",
        "podcast-talking-point",
      ],
      outcome:
        "Downloads, branded search lift, Finder starts from checklist CTA, consultant shares",
      effort: "M",
      paidFree: "mixed",
      measurement: [
        "checklist downloads",
        "sessions to /resources/crm-evaluation-checklist/",
        "Finder starts from checklist CTA",
        "newsletter signups",
        "referral sessions from communities",
      ],
      partnerships: ["Fairview", "RevOps Co-op", "Empat", "SCORE"],
      paidTests: ["A1 RevEngine newsletter", "A2 Pulse newsletter slot"],
      prIdeas: ["CRM buyer requirements framework"],
      safety:
        "On Reddit/Slack: answer the buying-process question first; offer the workbook only if asked or clearly relevant.",
    };
  }

  if (path.includes("crm-finder")) {
    return {
      audience: "Teams starting a CRM shortlist without a consultant",
      primary: [
        "linkedin-organic",
        "product-hunt",
        "reddit-saas",
        "founder-communities",
        "revgenius",
        "owned-email",
        "youtube-edu",
      ],
      weak: ["consumer-social"],
      angle:
        "Most CRM 'recommenders' bury you in feature tables. CRM Finder asks about team, workflow, and must-haves first — then returns a fit-based shortlist you can take into demos.",
      bad: "Try our CRM Finder tool!",
      repurposing: [
        "short-video",
        "linkedin-carousel",
        "newsletter-piece",
        "comparison-graphic",
        "thread",
      ],
      outcome: "Finder completions, shortlist exports, product page visits",
      effort: "L",
      paidFree: "mixed",
      measurement: [
        "Finder starts/completions",
        "PH traffic (if launched)",
        "LinkedIn CTR",
        "returning sessions within 7 days",
      ],
      paidTests: ["G2 Ads / LinkedIn sponsored for launch window"],
      safety: "Product Hunt: no fake upvotes; Reddit: build-in-public / feedback asks, not link dumps.",
    };
  }

  if (path.includes("crm-cost-calculator")) {
    return {
      audience: "Finance, founders, and RevOps modeling list cost by seats",
      primary: [
        "linkedin-organic",
        "reddit-crm",
        "qa-platforms",
        "revengine-nl",
        "owned-email",
        "youtube-edu",
      ],
      weak: ["consumer-social"],
      angle:
        "Sticker prices hide seat cliffs. The Cost Calculator recomputes researched CRM list prices at your team size so you can compare plans before procurement.",
      bad: "Use our pricing calculator.",
      repurposing: [
        "data-snippet",
        "comparison-graphic",
        "linkedin-carousel",
        "short-video",
        "newsletter-piece",
      ],
      outcome: "Calculator sessions, quote shares, Digital PR pricing-index teases",
      effort: "M",
      paidFree: "mixed",
      measurement: [
        "calculator sessions",
        "scenario completions",
        "outbound to product pricing pages",
        "branded search for CRM pricing",
      ],
      prIdeas: ["CRM Pricing Index 2026", "How CRM prices change by team size"],
    };
  }

  if (path.includes("crm-vendor-scorecard")) {
    return {
      audience: "Buyers and consultants running structured vendor comparisons",
      primary: [
        "linkedin-organic",
        "revops-coop",
        "vendor-ecosystems",
        "roa",
        "owned-email",
      ],
      weak: ["consumer-social", "product-hunt"],
      angle:
        "Demo theater is not evaluation. The Vendor Scorecard weights your must-haves, gates failures, and separates demo scores from research so every vendor faces the same evidence bar.",
      bad: "Check out our scorecard.",
      repurposing: [
        "diagram",
        "linkedin-carousel",
        "downloadable-checklist",
        "webinar-outline",
        "podcast-talking-point",
      ],
      outcome: "Scorecard creations, consultant co-marketing, webinar attendance",
      effort: "M",
      paidFree: "free",
      measurement: [
        "scorecard starts",
        "export events",
        "partner webinar referrals",
      ],
      partnerships: ["Ahead Choice", "HubSpot Solutions Partners (collab)"],
    };
  }

  if (path.includes("crm-requirements-builder")) {
    return {
      audience: "RevOps and project leads writing CRM requirements / RFPs",
      primary: [
        "linkedin-organic",
        "revgenius",
        "roa",
        "reddit-crm",
        "owned-email",
      ],
      weak: ["product-hunt", "consumer-social"],
      angle:
        "RFPs fail when requirements are vendor-shaped. Requirements Builder starts from buyer needs and maps them to capabilities before you talk to sales.",
      bad: "Try our requirements builder.",
      repurposing: [
        "diagram",
        "downloadable-checklist",
        "newsletter-piece",
        "webinar-outline",
      ],
      outcome: "Builder completions, RFP template downloads, SI-ready briefs",
      effort: "M",
      paidFree: "free",
      measurement: ["builder completions", "template downloads", "time-on-tool"],
      partnerships: ["Teraquint", "Empat"],
    };
  }

  if (path.includes("crm-migration-planner")) {
    return {
      audience: "Teams planning CRM switches / data cutover",
      primary: [
        "linkedin-organic",
        "reddit-crm",
        "revops-coop",
        "events-webinars",
        "owned-email",
      ],
      weak: ["product-hunt", "founder-communities"],
      angle:
        "Migrations slip when field maps and cutover risks stay in someone's head. Migration Planner turns objects, mappings, and risks into a shareable plan before you hire an SI.",
      bad: "Use our migration planner.",
      repurposing: [
        "diagram",
        "webinar-outline",
        "newsletter-piece",
        "podcast-talking-point",
      ],
      outcome: "Planner sessions, migration checklist downloads, SI handoff quality",
      effort: "M",
      paidFree: "free",
      measurement: [
        "planner sessions",
        "/resources/crm-migration-checklist/ downloads",
        "partner referrals",
      ],
      partnerships: ["Empat", "Fairview"],
    };
  }

  if (path.includes("implementation-checklist")) {
    return {
      audience: "Implementation leads and RevOps running go-lives",
      primary: ["linkedin-organic", "revops-coop", "roa", "events-webinars"],
      weak: ["product-hunt", "consumer-social"],
      angle:
        "Go-live checklists usually skip governance and handoffs. Ours pairs with evaluation assets so selection decisions survive into implementation.",
      bad: "Here's our implementation checklist.",
      repurposing: [
        "downloadable-checklist",
        "diagram",
        "newsletter-piece",
        "webinar-outline",
      ],
      outcome: "Downloads, co-branded partner guides",
      effort: "S",
      paidFree: "free",
      measurement: ["downloads", "partner page referrals"],
      partnerships: ["Fairview", "Empat"],
    };
  }

  if (path.includes("how-to-choose")) {
    return {
      audience: "First-time CRM buyers and SMB founders",
      primary: [
        "linkedin-organic",
        "founder-communities",
        "score-smb",
        "owned-email",
        "youtube-edu",
      ],
      weak: ["discord-generic"],
      angle:
        "Choosing a CRM is a process design problem, not a logo contest. This guide walks stages from requirements to shortlist — then hands you tools to execute each step.",
      bad: "Read our CRM guide.",
      repurposing: [
        "linkedin-carousel",
        "short-video",
        "newsletter-piece",
        "thread",
      ],
      outcome: "Guide sessions → tool starts",
      effort: "S",
      paidFree: "free",
      measurement: ["guide sessions", "CTA clicks to Finder/Checklist"],
    };
  }

  if (path.includes("crm-vs-spreadsheet")) {
    return {
      audience: "Founders and small teams outgrowing spreadsheets",
      primary: ["linkedin-organic", "founder-communities", "reddit-saas"],
      weak: ["roa", "product-hunt"],
      angle:
        "Spreadsheets fail quietly — ownership, history, and handoffs. Here's a practical frame for when a CRM earns its keep vs when a sheet is still enough.",
      bad: "CRM vs spreadsheet — thoughts?",
      repurposing: ["thread", "linkedin-carousel", "short-video"],
      outcome: "Discussion engagement → Finder/Checklist",
      effort: "S",
      paidFree: "free",
      measurement: ["engagement", "outbound to tools"],
    };
  }

  // Default
  return {
    audience: asset.audienceHints.join(", ") || "CRM buyers and operators",
    primary: ["linkedin-organic", "owned-email", "revgenius"],
    weak: ["consumer-social", "discord-generic"],
    angle: `${asset.name} helps CRM buyers make clearer, evidence-based decisions — promote with a specific problem statement, not a generic “check this out.”`,
    bad: `Check out our ${asset.name}.`,
    repurposing: ["newsletter-piece", "linkedin-carousel", "diagram"],
    outcome: "Qualified sessions and tool/resource engagement",
    effort: "S",
    paidFree: "free",
    measurement: ["sessions", "engagement events", "downstream tool starts"],
    safety: "Match channel to audience; help first in communities.",
  };
}

export function buildPromotionPlans(
  assets: PriorityAsset[],
): PromotionPlan[] {
  const plans: PromotionPlan[] = assets.map((asset) => {
    const pack = angleFor(asset);
    const score =
      asset.priorityTier === "P0" ? 88 : asset.priorityTier === "P1" ? 72 : 58;
    return {
      id: planId(asset.id),
      scoreBand:
        score >= 85 ? "EXCELLENT" : score >= 70 ? "STRONG" : "GOOD",
      assetId: asset.id,
      assetName: asset.name,
      assetPath: asset.path,
      audience: pack.audience,
      primaryChannels: pack.primary,
      weakChannels: pack.weak,
      promotionAngle: pack.angle,
      badAngleExample: pack.bad,
      repurposingIdeas: pack.repurposing,
      expectedOutcome: pack.outcome,
      effort: pack.effort,
      paidFree: pack.paidFree,
      measurement: pack.measurement,
      relatedPartnerships: pack.partnerships ?? [],
      relatedPaidTests: pack.paidTests ?? [],
      relatedPrIdeas: pack.prIdeas ?? [],
      communitySafetyNotes: pack.safety,
    };
  });

  return plans
    .sort((a, b) => {
      const tier = (p: PromotionPlan) =>
        p.assetId.includes("evaluation") ||
        MAJOR_LAUNCH_TOOLS.some((s) => p.assetPath.includes(s))
          ? 0
          : 1;
      const t = tier(a) - tier(b);
      if (t !== 0) return t;
      return a.assetName.localeCompare(b.assetName);
    })
    .map((p, i) => ({ ...p, priority: i + 1 }));
}

export function buildToolLaunchPlans(): ToolLaunchPlan[] {
  const plans: ToolLaunchPlan[] = [];

  for (const slug of MAJOR_LAUNCH_TOOLS) {
    const tool = TOOLS_REGISTRY.find((t) => t.slug === slug);
    if (!tool?.href || tool.status !== "available") continue;

    const ph =
      slug === "crm-finder" || slug === "crm-cost-calculator"
        ? ("yes" as const)
        : slug === "crm-requirements-builder" ||
            slug === "crm-vendor-scorecard"
          ? ("maybe" as const)
          : ("no" as const);

    plans.push({
      id: `LAUNCH-${slugToken(slug, 28)}-${stableHash(slug)}`,
      toolSlug: slug,
      toolName: tool.name,
      toolPath: tool.href,
      launchNarrative:
        slug === "crm-finder"
          ? "Launch as a free interactive shortlist helper — problem: feature-table overwhelm; proof: fit questions → recommendations."
          : slug === "crm-cost-calculator"
            ? "Launch as transparent team-size cost modeling on researched list prices — problem: sticker-price confusion."
            : slug === "crm-requirements-builder"
              ? "Soft launch to RevOps/consultants: requirements before RFP — less PH-native, more community/webinar."
              : slug === "crm-vendor-scorecard"
                ? "Launch with consultants: structured vendor evaluation — LinkedIn + partner webinars; PH optional."
                : "Launch to migration-focused RevOps/SI audiences via partners and LinkedIn — skip consumer PH hype.",
      channels: [
        "linkedin-organic",
        "owned-email",
        ...(ph === "yes" ? ["product-hunt", "reddit-saas"] : []),
        "revgenius",
        "revops-coop",
        ...(slug.includes("cost") ? ["revengine-nl"] : []),
        "vendor-ecosystems",
      ],
      sequence: [
        "Warm: 2–3 insight posts without hard CTA",
        "Seed: early users / consultants for feedback quotes (real only)",
        ph === "yes"
          ? "Optional Product Hunt day with launch squad (no fake accounts)"
          : "Skip or soft PH — prioritize niche communities",
        "Community help threads (Reddit/RevGenius) answering related questions",
        "Partner co-webinar or resource handoff",
        "Owned newsletter + LinkedIn recap with metrics",
      ],
      productHuntFit: ph,
      productHuntNotes:
        ph === "yes"
          ? "Prep 30 days; unique angle per channel; respond to every PH comment; no fake upvotes (2026 PH guidance)."
          : ph === "maybe"
            ? "Only if framing as maker tool with clear demo GIF; otherwise community-first."
            : "Audience is practitioners mid-project — PH traffic quality usually poor.",
      effort: ph === "yes" ? "XL" : "L",
      measurement: [
        "tool starts/completions",
        "referral sessions by channel",
        "newsletter signups",
        "7-day return rate",
        "partner-attributed visits",
      ],
    });
  }

  return plans;
}
