import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const howToChooseHrSoftwareBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose HR software by the job that is blocking work — ATS hiring, frontline scheduling/comms, time & attendance, SOP documentation, or employee LMS — then confirm seats/users, plan or hub gates, and the HRIS/payroll integrations you need. Shortlist only tools whose core product is your job; an ATS and a time clock are different purchases even when both live in this category.",
    bullets: [
      "Primary job to be done",
      "Users / seats / locations",
      "Must-have workflows & gates",
      "Mobile / frontline need",
      "HRIS / payroll integrations",
      "Trial with one real workflow",
    ],
  },
  {
    type: "key-takeaways",
    id: "takeaways",
    title: "What matters most",
    items: [
      {
        label: "“HR software” is several products",
        body: "ATS, WFM, time clocks, SOP tools, and LMS academies fail for different reasons. Pick the shape before you pick a brand.",
      },
      {
        label: "Hub and add-on math changes cost",
        body: "Multi-hub packs, AI add-ons, and implementation fees often decide TCO. Price the qualifying configuration.",
      },
      {
        label: "Frontline adoption beats feature lists",
        body: "If deskless workers will not open the app, scheduling and clock-in features do not matter.",
      },
      {
        label: "Do not invent scores from marketing pages",
        body: "Use SoftwareGlimpse methodology qualitatively when comparing peers — see Best HR software for job-cluster editor’s picks.",
      },
    ],
  },
  {
    type: "figure",
    id: "worked-examples",
    title: "Five worked examples",
    src: "/guides/how-to-choose-hr-software-needs.png",
    alt: "Five worked examples of HR buying: ATS, frontline WFM, time clock, SOP training, and employee LMS.",
    caption: "Five teams, one category, five different shortlists. The job decides the tool — not the brand.",
  },
  {
    type: "selection-checklist",
    id: "interactive-checklist",
    title: "Interactive HR selection checklist",
    dimensions: [
      {
        id: "primary-job",
        label: "Primary job",
        options: [
          "ATS / recruiting",
          "Frontline WFM / scheduling",
          "Time & attendance",
          "SOP / employee training docs",
          "Employee LMS / academy",
        ],
      },
      {
        id: "team-size",
        label: "People needing access",
        options: ["1–10", "11–50", "51–250", "250+"],
      },
      {
        id: "frontline",
        label: "Frontline / deskless need",
        options: ["None", "Some hourly staff", "Mostly deskless", "Multi-site field"],
      },
      {
        id: "stack",
        label: "Must integrate with",
        options: ["Payroll / HRIS", "Calendar", "Slack / Teams", "Minimal integrations"],
      },
      {
        id: "budget-style",
        label: "Buying style",
        options: ["Free / self-serve", "Published seats", "Demo / quote OK", "Enterprise RFP"],
      },
    ],
  },
  {
    type: "step",
    id: "name-the-job",
    stepNumber: 1,
    heading: "Name the job in one sentence",
    body: "Write: “We need software so that ___ happens every week without spreadsheet archaeology.” If the blank is about candidate stages, you are in ATS. If it is published shifts and mobile tasks, you are in frontline WFM. If it is trusted clock-in, buy time & attendance. If it is playbooks and completion, buy SOP training. If it is course academies, shortlist an LMS.\n\nWorked example: Northline Ops wrote “every site publishes next week’s shifts by Thursday noon.” That sentence ruled out ATS-only tools before demos started.",
    tip: "If two jobs are blocking, buy for the one that creates the most rework this quarter.",
  },
  {
    type: "step",
    id: "map-gates",
    stepNumber: 2,
    heading: "Map must-haves to plan and hub gates",
    body: "List the workflows that must work on day one — career site, open shifts, GPS geofence, training tests, SSO — and ask which plan unlocks them. Multi-hub vendors need a line-item model for each hub you will actually buy.\n\nWorked example: Harbor Retail needed GPS clock-in on free forever for seasonal staff; a WFM suite that gated geofence behind a paid hub failed that requirement.",
    tip: "Ask for a written configuration quote — seats, hubs, add-ons, implementation — before the demo ends.",
    figure: {
      src: "/guides/how-to-choose-hr-software-framework.png",
      alt: "HR selection framework mapping job cluster to plan gates and integrations.",
      caption: "Job first, then gates, then integrations — brand comparisons come last.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Should I buy an all-in-one HR suite?",
        answer:
          "Only if you will use multiple hubs weekly. Otherwise a specialist ATS, time clock, or SOP tool usually ships faster and clearer TCO.",
      },
      {
        question: "How do I treat LearnWorlds on an HR shortlist?",
        answer:
          "As LMS / academy landscape when employee learning or course commerce is the job — not as an ATS or WFM peer scored on HR methodology.",
      },
      {
        question: "Where should I compare researched products?",
        answer:
          "See Best HR software for Wave-1 editor’s picks by job cluster and disclosed methodology notes.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/hr-software/",
    ctaLabel: "Best HR software →",
    variant: "finder",
  },
];

export const howToChooseHrSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-hr-software",
  slug: "how-to-choose-hr-software",
  title: "How to Choose HR Software",
  summary:
    "A practical framework for shortlisting ATS, frontline WFM, time & attendance, SOP training, and LMS tools by job.",
  categorySlugs: ["hr"],
  topicType: "buying-guide",
  journeyStage: "evaluate",
  heroVisual: {
    src: "/guides/how-to-choose-hr-software-hero.png",
    alt: "Educational illustration for How to Choose HR Software.",
  },
  supports: [
    {
      contentId: "content:category:hr",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:hr-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  relatedGuideSlugs: [
    "what-is-hr-software",
    "hr-pricing-guide",
    "hr-requirements-guide",
    "hr-evaluation-guide",
  ],
  blocks: howToChooseHrSoftwareBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T00:00:00.000Z",
    publishedAt: "2026-08-17T00:00:00.000Z",
    reviewedAt: "2026-08-17T00:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "How to Choose HR Software | SoftwareGlimpse",
    description:
      "How to choose HR software by job cluster — ATS, frontline WFM, time & attendance, SOP training, and LMS — with plan gates and integrations.",
    canonicalPath: "/guides/how-to-choose-hr-software/",
    indexable: true,
  },
};
