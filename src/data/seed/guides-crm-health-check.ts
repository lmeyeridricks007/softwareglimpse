import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Health Check — scorecard-style health pass with intervene rules.
 * Template: softwareglimpse-guide-template-v1
 * topicType: checklist (enriched with teaching blocks + FAQ for optimize depth)
 * Note: qualitative bands only — no invented industry benchmark %.
 */
const crmHealthCheckBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "A CRM health check is a scorecard pass across hygiene, adoption, reporting trust, automation noise, and admin capacity — each with Watch vs Intervene rules. Decision rule: if any dimension hits Intervene for two consecutive reviews, stop expanding config and run the linked play (audit, improve adoption, governance ops, or replace decision) — green vanity tiles without intervene rules are not a health check.",
    bullets: [
      "Five dimensions",
      "Watch vs Intervene",
      "Two-review rule",
      "Link to plays",
      "No fake %",
      "Freeze on intervene",
    ],
  },
  {
    type: "figure",
    id: "scorecard-visual",
    title: "Health scorecard with intervene paths",
    src: "/guides/crm-health-check-scorecard.png",
    alt: "CRM health check scorecard showing hygiene, adoption, reporting trust, automation noise, and admin capacity with Watch versus Intervene paths to audit, adoption, governance ops, or replace.",
    caption:
      "Each dimension needs an intervene rule that names the next play — not just a color.",
  },
  {
    type: "checklist",
    id: "health-scorecard-checklist",
    title: "CRM health check scorecard (copyable)",
    copyable: true,
    items: [
      {
        id: "hygiene",
        label: "Hygiene band scored",
        description:
          "Duplicates, empty requireds, stale owners — Healthy / Watch / Intervene.",
        order: 0,
      },
      {
        id: "adoption",
        label: "Adoption band scored",
        description:
          "Core-loop usage and CRM-native manager reviews — not login vanity.",
        order: 1,
      },
      {
        id: "reporting",
        label: "Reporting trust band scored",
        description:
          "Leaders use CRM views; side sheets retired or explained.",
        order: 2,
      },
      {
        id: "automation",
        label: "Automation noise band scored",
        description:
          "Owned automations; muted noisy rules; no silent spam.",
        order: 3,
      },
      {
        id: "admin",
        label: "Admin capacity band scored",
        description:
          "Named hours, finite WIP, change tickets moving.",
        order: 4,
      },
      {
        id: "intervene-rules",
        label: "Intervene rules written per dimension",
        description:
          "Two consecutive Intervene → named play + freeze expansion.",
        order: 5,
      },
      {
        id: "owners",
        label: "Review owner + cadence set",
        description:
          "Same scorecard each cycle; decisions posted.",
        order: 6,
      },
      {
        id: "next-play",
        label: "Open next-play links",
        description:
          "Audit / improve adoption / governance ops / when to replace.",
        order: 7,
      },
    ],
  },
  {
    type: "expert-tip",
    id: "expert-tip-bands",
    title: "Use bands, not invented benchmarks",
    body: "Score Healthy / Watch / Intervene with team-defined evidence — for example “managers still coach from a side sheet” or “admin WIP uncapped.” Do not invent industry benchmark percentages as verified facts.",
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Health is five dimensions",
        body: "Hygiene, adoption, reporting trust, automation noise, admin capacity.",
      },
      {
        label: "Intervene must name a play",
        body: "Audit, improve adoption, governance ops, or replace — not “try harder.”",
      },
      {
        label: "Two consecutive misses matter",
        body: "One bad week is noise; two reviews at Intervene demand action.",
      },
      {
        label: "Freeze expansion on Intervene",
        body: "New fields and automations wait until the dimension recovers.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "health-path",
    title: "Health check operating path",
    steps: [
      { id: "score", label: "Score five", short: "Same bands" },
      { id: "rule", label: "Apply rules", short: "Watch / Intervene" },
      { id: "play", label: "Pick play", short: "Linked guide" },
      { id: "freeze", label: "Freeze expand", short: "If Intervene" },
      { id: "recheck", label: "Re-check", short: "Next cadence" },
    ],
    ctaHref: "/guides/crm-audit/",
    ctaLabel: "Full audit guide →",
    figure: {
      src: "/guides/crm-health-check-path.png",
      alt: "CRM health check operating path: score five dimensions, apply Watch/Intervene, pick play, freeze expand, re-check cadence.",
      caption:
        "Scorecard first — intervene rules decide audit, coach, or replace forks.",
    },
  },
  {
    type: "step",
    id: "score-dimensions",
    stepNumber: 1,
    heading: "Score the five health dimensions",
    body: "Use one shared scorecard. Hygiene: duplicates, empty requireds, stale owners. Adoption: core-loop fill and manager reviews in CRM. Reporting trust: leaders use native views. Automation noise: owned rules without alert spam. Admin capacity: named hours and finite WIP. Mark Healthy, Watch, or Intervene with a one-line evidence note — no invented industry %.\n\nExample: Riverton Services scores Hygiene Watch (duplicate spike), Adoption Intervene (side-sheet coaching), Reporting Watch, Automation Healthy, Admin Watch (WIP uncapped). Evidence notes sit beside each band for the Friday ops review.",
    tip: "If two people cannot agree on a band from the same views, fix the evidence definition before arguing color.",
    figure: {
      src: "/guides/crm-health-check-hero.png",
      alt: "CRM health check hero scorecard with five dimensions and Healthy, Watch, Intervene bands plus links to audit, adoption, and replace.",
      caption:
        "Scorecard first — intervene rules decide whether you audit, coach, or consider replace.",
    },
    scenarios: [
      {
        title: "Mostly Healthy",
        body: "Keep light cadence; expand config only via governance tickets.",
      },
      {
        title: "Mixed Watch",
        body: "Tighten hygiene/adoption rituals; re-score next cycle.",
      },
      {
        title: "Any Intervene",
        body: "Freeze expansion; open the linked play immediately.",
      },
    ],
  },
  {
    type: "step",
    id: "intervene-rules",
    stepNumber: 2,
    heading: "Apply Watch vs Intervene rules",
    body: "Watch: increase ritual intensity, coach, and re-check next cadence. Intervene (two consecutive reviews, or a single security/access crisis): stop net-new config, assign an owner, and launch the linked play. Publish the rule so debates end at the scorecard, not in Slack threads.\n\nExample: Riverton’s Adoption hits Intervene twice. They freeze new automations, assign Jordan to Improve CRM Adoption coaching loops, and schedule a re-score in thirty days — no new pipeline fields until Adoption returns to Watch or better.",
    tip: "Intervene without a freeze just adds more config noise on top of the failure.",
    figure: {
      src: "/guides/crm-health-check-intervene.png",
      alt: "CRM Watch vs Intervene rules: Watch coaches and rechecks; Intervene freezes config, assigns owner, launches play, rescores.",
      caption:
        "Intervene without a freeze just piles config noise onto the failure.",
    },
    scenarios: [
      {
        title: "Hygiene Intervene",
        body: "Data quality / hygiene campaign; pause field sprawl.",
      },
      {
        title: "Adoption Intervene",
        body: "Improve CRM Adoption plays; manager CRM-native reviews.",
      },
      {
        title: "Admin Intervene",
        body: "Governance ops: WIP cap, tickets, access calendar.",
      },
    ],
  },
  {
    type: "step",
    id: "link-plays",
    stepNumber: 3,
    heading: "Link each weak dimension to a play",
    body: "Hygiene → Data Quality / hygiene work. Adoption → Improve CRM Adoption. Reporting trust → often Audit + adoption (leaders will not trust empty boards). Automation noise → governance ops tickets to disable/own rules. Admin capacity → Governance Ops cadence. Multiple Intervenes or unclear root cause → full CRM Audit. Chronic failure after remediation → When to Replace CRM.\n\nExample: Riverton’s Admin Watch becomes Intervene when the backlog hits uncapped WIP. Mira stands up governance ops tickets and a weekly standup before any replace conversation.",
    tip: "A scorecard that does not deep-link to a play is a mood board.",
    figure: {
      src: "/guides/crm-health-check-plays.png",
      alt: "Link CRM health dimensions to plays: hygiene to quality, adoption to improve, reporting to audit, automation to governance, admin to WIP cadence.",
      caption:
        "Each weak dimension needs a named play and owner — not a mood-board score.",
    },
    scenarios: [
      {
        title: "Single-dimension fail",
        body: "One play, one owner, one re-check date.",
      },
      {
        title: "Multi-dimension fail",
        body: "Run Audit to rank remediation; avoid parallel thrash.",
      },
      {
        title: "Replace signal",
        body: "Only after in-place plays fail — then decision guide + Finder.",
      },
    ],
  },
  {
    type: "step",
    id: "cadence-recheck",
    stepNumber: 4,
    heading: "Run the scorecard on a fixed cadence",
    body: "Pick a recurring review (often monthly for optimize teams, tighter while recovering). Same views, same bands, decisions posted. Tie to governance standup so Intervene items become tickets. Use Implementation KPIs for leading signals between scorecard cycles.\n\nExample: Riverton reviews the first Monday each month. After two Improve Adoption sprints, Adoption moves to Watch; they lift the automation freeze partially and keep Hygiene on Watch with a cleanup owner.",
    tip: "Changing band definitions every cycle resets learning — version the scorecard deliberately.",
    figure: {
      src: "/guides/crm-health-check-cadence.png",
      alt: "Run CRM health scorecard on a fixed cadence: same views, same bands, posted decisions, governance tickets on Intervene.",
      caption:
        "Same views and bands each cycle — version band definitions deliberately.",
    },
    scenarios: [
      {
        title: "Stable system",
        body: "Monthly scorecard + weekly light ops glance.",
      },
      {
        title: "Recovery mode",
        body: "Biweekly scorecard until Intervene clears.",
      },
      {
        title: "Pre-replace diligence",
        body: "Scorecard evidence feeds the replace decision memo.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Health check mistakes",
    items: [
      {
        title: "Login vanity as health",
        body: "Seats logged in do not equal core-loop adoption.",
      },
      {
        title: "Colors without intervene rules",
        body: "Red tiles that never change work are decoration.",
      },
      {
        title: "Fake industry benchmark %",
        body: "Team-defined bands beat invented percentages presented as facts.",
      },
      {
        title: "Expanding while on Intervene",
        body: "New fields and automations deepen the hole.",
      },
      {
        title: "Skipping admin capacity",
        body: "No owner hours means every other dimension will decay.",
      },
      {
        title: "Jumping to replace from one red tile",
        body: "Run audit and optimize plays before vendor tours.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is a CRM health check?",
        answer:
          "A recurring scorecard across hygiene, adoption, reporting trust, automation noise, and admin capacity with explicit Watch vs Intervene rules and linked recovery plays.",
      },
      {
        question: "How is it different from a CRM audit?",
        answer:
          "A health check is a fast banded pass with intervene rules. An audit is a deeper evidence review that produces a ranked remediation backlog. Intervene often triggers an audit.",
      },
      {
        question: "How often should we run it?",
        answer:
          "On a fixed cadence you can sustain — commonly monthly when stable, tighter during recovery. Consistency beats perfect frequency.",
      },
      {
        question: "What counts as Intervene?",
        answer:
          "Your written rule — typically two consecutive reviews at Intervene for a dimension, or an immediate security/access crisis. Publish the rule so it is not renegotiated weekly.",
      },
      {
        question: "Do we need benchmark percentages?",
        answer:
          "No. Use qualitative Healthy / Watch / Intervene bands with team evidence. Do not invent industry benchmark percentages as verified facts.",
      },
      {
        question: "When should a health check lead to replacing the CRM?",
        answer:
          "When Intervene plays and remediation fail repeatedly, or constraints (plan gates, admin debt, exit pain) make in-place recovery unrealistic — use When to Replace CRM, then Finder/Compare.",
      },
      {
        question: "What should I do next?",
        answer:
          "Score the five dimensions, write intervene rules, freeze expansion on Intervene, and open the linked play. Schedule the next re-check on the Implementation Planner.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-audit/",
        label: "CRM audit",
        description: "Deep findings and remediation backlog.",
      },
      {
        href: "/guides/improve-crm-adoption/",
        label: "Improve CRM adoption",
        description: "Recovery when adoption hits Intervene.",
      },
      {
        href: "/guides/crm-data-quality/",
        label: "CRM data quality",
        description: "Hygiene SLAs for the hygiene dimension.",
      },
      {
        href: "/guides/crm-governance-operations/",
        label: "CRM governance ops",
        description: "Tickets, WIP, and standup for admin capacity.",
      },
      {
        href: "/guides/crm-governance/",
        label: "CRM governance",
        description: "Ownership and change-control foundations.",
      },
      {
        href: "/guides/crm-implementation-kpis/",
        label: "CRM implementation KPIs",
        description: "Leading signals between scorecard cycles.",
      },
      {
        href: "/guides/when-to-replace-crm/",
        label: "When to replace CRM",
        description: "Decision fork after in-place plays fail.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "Implementation Planner",
        description: "Schedule scorecards and intervene plays.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist only after a replace decision.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Schedule the health check ritual",
    body: "Add the five-dimension scorecard, intervene freezes, and re-check dates to the Implementation Planner so health reviews become operating work.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Open Implementation Planner →",
    variant: "finder",
  },
];

export const crmHealthCheckGuide: GuidePage = {
  id: "guide-crm-health-check",
  slug: "crm-health-check",
  title: "CRM Health Check: Scorecard and Intervene Rules",
  summary:
    "Run a CRM health check scorecard across hygiene, adoption, reporting trust, automation noise, and admin capacity — with Watch vs Intervene rules that link to audit, adoption recovery, governance ops, or replace.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "checklist",
  journeyStage: "optimize",
  knowledgeAreaSlug: "optimization",
  heroVisual: {
    src: "/guides/crm-health-check-hero.png",
    alt: "CRM health check hero scorecard with five dimensions and Healthy, Watch, Intervene bands plus links to audit, adoption, and replace.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:tool:crm-implementation-planner",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:tool:crm-finder",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-implementation-planner",
    label: "Open Implementation Planner",
  },
  relatedGuideSlugs: [
    "crm-audit",
    "improve-crm-adoption",
    "crm-data-quality",
    "crm-governance-operations",
    "crm-governance",
    "crm-implementation-kpis",
    "when-to-replace-crm",
  ],
  blocks: crmHealthCheckBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "score-five",
      label: "Score five dimensions with evidence notes",
      description: "Healthy / Watch / Intervene — no fake %.",
      order: 0,
    },
    {
      id: "intervene",
      label: "Publish intervene rules + freezes",
      description: "Two consecutive Intervene → named play.",
      order: 1,
    },
    {
      id: "cadence",
      label: "Schedule scorecard cadence + owners",
      description: "Same views; decisions posted.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T11:00:00.000Z",
    publishedAt: "2026-08-14T11:00:00.000Z",
    reviewedAt: "2026-08-14T11:00:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "CRM Health Check: Scorecard & Intervene Rules | SoftwareGlimpse",
    description:
      "CRM health check scorecard for hygiene, adoption, reporting trust, automation noise, and admin capacity — with Watch vs Intervene rules and linked plays.",
    canonicalPath: "/guides/crm-health-check/",
    indexable: true,
  },
};
