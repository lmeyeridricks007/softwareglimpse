import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Fundamental HR / workforce / training guide — softwareglimpse-guide-template-v1.
 */
const whatIsHrSoftwareBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "HR software helps teams hire, schedule and coordinate frontline workers, track time & attendance, document SOPs, or deliver employee learning — not CRM pipelines or project work boards. Decision rule: if the blocking job is “we need a hiring pipeline,” buy an ATS; if it is shifts and deskless comms, buy frontline WFM; if it is clock-in accuracy, buy time & attendance; if it is playbooks and role paths, buy SOP training; if it is a course academy, shortlist an LMS — do not force those jobs into one undifferentiated ranking.",
    bullets: [
      "ATS / recruiting",
      "Frontline WFM",
      "Time & attendance",
      "SOP / training paths",
      "Employee LMS",
      "Not a CRM or Work OS",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "The category holds several jobs",
        body: "ATS, frontline WFM, time clocks, SOP docs, and LMS academies fail for different reasons. Naming the job first prevents most bad shortlists.",
      },
      {
        label: "HR software is not a CRM",
        body: "CRMs own customer pipeline. HR tools own hiring, workforce coordination, attendance, or training — then integrate with payroll/HRIS when needed.",
      },
      {
        label: "Plan gates and hubs change TCO",
        body: "Free tiers, multi-hub packs, add-ons, and implementation fees often matter more than the starter tile.",
      },
      {
        label: "LMS commerce is a different purchase",
        body: "Course-commerce LMS products can support employee academies, but they should not be ranked as if they were ATS or WFM peers.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "hr-building-blocks",
    title: "HR software building blocks",
    steps: [
      { id: "block-hire", label: "Hire", short: "ATS pipelines" },
      { id: "block-schedule", label: "Schedule", short: "Shifts & publish" },
      { id: "block-clock", label: "Clock", short: "Time & attendance" },
      { id: "block-document", label: "Document", short: "SOPs & playbooks" },
      { id: "block-train", label: "Train", short: "Paths & completion" },
      { id: "block-integrate", label: "Integrate", short: "HRIS / payroll" },
    ],
    ctaHref: "/guides/how-to-choose-hr-software/",
    ctaLabel: "How to choose HR software →",
    figure: {
      src: "/guides/what-is-hr-software-building-blocks.png",
      alt: "Six HR software building blocks: hire, schedule, clock, document, train, and integrate.",
      caption:
        "These blocks define the HR/workforce core. Buy for the block that is blocking first — specialists sit beside each other, not in one peer ranking.",
    },
  },
  {
    type: "step",
    id: "how-it-works",
    stepNumber: 1,
    heading: "How does HR software work?",
    body: "Most HR platforms specialise: ATS products move candidates through stages; frontline apps publish shifts and mobile tasks; time clocks capture attendance; SOP tools store playbooks with completion tracking; LMS products deliver courses.\n\nExample: Harbor Retail, a 40-person multi-site shop, starts with a time clock for GPS clock-in, then adds frontline scheduling when managers still rebuild weeks in spreadsheets — without buying an ATS they do not need yet.",
    tip: "Write the weekly outcome you need (“every open role has a stage owner” or “every shift is published by Thursday”) before you compare vendors.",
    figure: {
      src: "/guides/what-is-hr-software-loop.png",
      alt: "HR software loop across hiring, scheduling, attendance, SOPs, and training.",
      caption:
        "Each loop is a different purchase. Your CRM still owns customers; your Work OS still owns projects.",
    },
    scenarios: [
      { title: "Hire", body: "Candidates move through owned pipeline stages." },
      { title: "Schedule", body: "Shifts are planned, published, and covered." },
      { title: "Clock", body: "Attendance is captured with policies you can defend." },
      { title: "Document", body: "SOPs are searchable and assigned by role." },
      { title: "Train", body: "Paths complete with evidence managers can review." },
    ],
  },
  {
    type: "step",
    id: "what-it-includes",
    stepNumber: 2,
    heading: "What HR software typically includes",
    body: "Depending on job cluster: applicant tracking and career sites; workforce scheduling and frontline chat; GPS/geofence clock-in and timesheets; SOP knowledge bases and training paths; or LMS course builders for academies.\n\nJob clusters matter more than brand names: ATS peers, frontline WFM, time & attendance, SOP training, and LMS shapes rarely belong on the same undifferentiated shortlist. Catalogue examples are shapes to compare by primary job — not a ranking.",
    tip: "If a vendor markets “all-in-one HR,” check which hub is actually strong before you buy for a secondary job.",
  },
  {
    type: "crm-types",
    id: "hr-shapes",
    title: "Common HR software shapes (not rankings)",
    types: [
      {
        id: "ats",
        title: "ATS / recruiting",
        bestFor: "Teams that need candidate pipelines, career sites, and interview workflows.",
        avoidWhen: "Your primary job is shift scheduling or GPS clock-in.",
      },
      {
        id: "frontline-wfm",
        title: "Frontline workforce management",
        bestFor: "Deskless teams that need scheduling, mobile communications, and ops hubs.",
        avoidWhen: "You only need a dedicated ATS or a pure time clock.",
      },
      {
        id: "time-attendance",
        title: "Time & attendance",
        bestFor: "Hourly and field teams that need accurate clock-in and timesheets.",
        avoidWhen: "Full frontline scheduling + comms is the blocking need.",
      },
      {
        id: "sop-lms",
        title: "SOP training / employee LMS",
        bestFor: "Teams documenting playbooks or running role training and academies.",
        avoidWhen: "Hiring pipeline or time-clock accuracy is the real purchase.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Is HR software the same as a CRM?",
        answer:
          "No. CRM systems track customers and revenue. HR software tracks hiring, workforce coordination, attendance, or training — though stacks often integrate.",
      },
      {
        question: "Do I need one suite or specialist tools?",
        answer:
          "Buy for the job that creates the most rework this quarter. Suites help when hubs are truly used; specialists win when one job dominates.",
      },
      {
        question: "Where do Breezy, Connecteam, Jibble, and Trainual fit?",
        answer:
          "They are Wave-1 cluster leaders for ATS, frontline WFM, time & attendance, and SOP training respectively. Compare inside those jobs — see Best HR software for methodology-based editor’s picks.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Name your primary job, then shortlist within that cluster — editor’s picks and landscape specialists are called out separately.",
    href: "/best/hr-software/",
    ctaLabel: "See Best HR Software →",
    variant: "finder",
  },
];

export const whatIsHrSoftwareGuide: GuidePage = {
  id: "guide-what-is-hr-software",
  slug: "what-is-hr-software",
  title: "What Is HR Software?",
  summary:
    "A clear definition of ATS, frontline WFM, time & attendance, SOP training, and employee LMS — and how they differ from CRM.",
  categorySlugs: ["hr"],
  topicType: "fundamental",
  heroVisual: {
    src: "/guides/what-is-hr-software-hero.png",
    alt: "Educational SaaS mockup of HR software spanning hiring pipelines, schedules, and training paths.",
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
  nextAction: {
    contentId: "content:guide:how-to-choose-hr-software",
    label: "How to choose HR software",
  },
  relatedGuideSlugs: [
    "how-to-choose-hr-software",
    "hr-pricing-guide",
    "hr-requirements-guide",
    "hr-evaluation-guide",
  ],
  blocks: whatIsHrSoftwareBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description: "ATS, frontline WFM, time clock, SOP training, or LMS — one sentence.",
      order: 0,
    },
    {
      id: "users",
      label: "List who must use it weekly",
      description: "Recruiters, managers, frontline workers, or trainers.",
      order: 1,
    },
    {
      id: "workflows",
      label: "Note must-have workflows",
      description: "Pipeline, shift publish, GPS clock-in, training completion — map to plan gates later.",
      order: 2,
    },
  ],
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
    title: "What Is HR Software? | SoftwareGlimpse",
    description:
      "What is HR software? A clear definition of ATS, frontline WFM, time & attendance, SOP training, and employee LMS — and how they differ from CRM.",
    canonicalPath: "/guides/what-is-hr-software/",
    indexable: true,
  },
};
