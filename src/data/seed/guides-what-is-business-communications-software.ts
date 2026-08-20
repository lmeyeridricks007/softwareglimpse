import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Fundamental business communications guide — softwareglimpse-guide-template-v1.
 */
const whatIsBusinessCommunicationsBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Business communications software carries the conversations a company has with customers and with itself — cloud phone and VoIP, call routing and contact-centre queues, WhatsApp and customer messaging, and internal team chat. Decision rule: if the blocking job is “our customers need to reach a business number and our team needs to route those calls,” you need a cloud phone system; if the job is “customers message us on WhatsApp and nobody owns the replies,” you need a messaging platform — these are different products that rarely belong on the same shortlist.",
    bullets: [
      "Cloud phone / VoIP",
      "Call routing & IVR",
      "Customer messaging",
      "Team chat",
      "Not a CRM",
      "Not a helpdesk",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "The category holds three separate jobs",
        body: "Business phone, customer messaging, and internal team chat are bought by different people for different reasons. Naming the job first prevents most bad shortlists.",
      },
      {
        label: "A phone system is not a CRM module",
        body: "CRMs with a calling feature log activity on records. A phone system owns numbers, routing, queues, and call quality — and then integrates back into the CRM.",
      },
      {
        label: "Seat price is only part of the cost",
        body: "Licence minimums, calling minutes, phone numbers, and WhatsApp conversation fees all sit on top of the per-user tile. Budget the whole stack.",
      },
      {
        label: "Integration depth decides daily friction",
        body: "Click-to-dial and automatic call logging either remove admin work or create a second system to update by hand.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "bc-building-blocks",
    title: "Business communications building blocks",
    steps: [
      { id: "block-numbers", label: "Numbers", short: "Lines & coverage" },
      { id: "block-route", label: "Route", short: "IVR & queues" },
      { id: "block-converse", label: "Converse", short: "Calls & messages" },
      { id: "block-inbox", label: "Inbox", short: "Shared ownership" },
      { id: "block-integrate", label: "Integrate", short: "CRM / helpdesk CTI" },
      { id: "block-measure", label: "Measure", short: "Volume & performance" },
    ],
    ctaHref: "/guides/how-to-choose-business-communications-software/",
    ctaLabel: "How to choose business communications software →",
    figure: {
      src: "/guides/what-is-business-communications-software-building-blocks.png",
      alt: "Six business communications building blocks: numbers, routing, conversations, shared inbox, integrations, and measurement.",
      caption:
        "These blocks define the category. The CRM still owns customer records; the communications platform owns how conversations reach the right person.",
    },
  },
  {
    type: "step",
    id: "how-it-works",
    stepNumber: 1,
    heading: "How does business communications software work?",
    body: "Most platforms share a loop: provision business numbers or connect a messaging channel, define routing rules that decide who receives what, let agents converse from a softphone or shared inbox, sync activity into the CRM or helpdesk, then report on volume, response time, and agent performance.\n\nExample: Harbor Clinic, a four-site medical practice, moves from three mobile phones to one cloud phone system. Patients call a single number, an IVR routes by site, missed calls land in a shared queue instead of a personal voicemail, and every call logs against the patient record. Nothing about their record-keeping system changed — only how conversations arrive and where they are answered.",
    tip: "Write the weekly outcome you need (“no customer call goes unanswered after 5pm and every call is logged”) before you compare vendors.",
    figure: {
      src: "/guides/what-is-business-communications-software-loop.png",
      alt: "Business communications loop: provision numbers, route, converse, log to CRM, and measure.",
      caption:
        "The platform closes the conversation loop; your CRM or helpdesk still owns the customer record.",
    },
    scenarios: [
      {
        title: "Numbers",
        body: "Provision local, toll-free, or international numbers and port existing lines.",
      },
      {
        title: "Route",
        body: "IVR menus, queues, business hours, and skills-based rules decide who answers.",
      },
      {
        title: "Converse",
        body: "Agents take calls from a softphone or handle messages in a shared inbox.",
      },
      {
        title: "Integrate",
        body: "Click-to-dial and automatic logging keep the CRM current without retyping.",
      },
      {
        title: "Measure",
        body: "Call volume, wait time, missed calls, and agent activity feed weekly reviews.",
      },
    ],
  },
  {
    type: "step",
    id: "what-it-includes",
    stepNumber: 2,
    heading: "What business communications software typically includes",
    body: "Core products cover business numbers, inbound and outbound calling, call routing and IVR, call recording, shared inboxes, and CRM or helpdesk integration. Many add SMS, WhatsApp Business messaging, power dialing for outbound sales, analytics dashboards, and AI features such as transcription, call summaries, or chatbots.\n\nJob clusters matter more than brand names: cloud phone / UCaaS (RingCentral, Dialpad, Zoom Phone, Nextiva, Aircall class), team messaging (Slack, Microsoft Teams), and WhatsApp / shared-inbox messaging (Wati class) rarely belong on the same shortlist. Catalogue examples are shapes to compare by primary job and by which capabilities sit on the tier you would actually buy — not a ranking.",
    tip: "If a vendor advertises both a phone system and a WhatsApp inbox, check which one is the real product and which is a thin add-on before you buy for the second job.",
  },
  {
    type: "crm-types",
    id: "bc-shapes",
    title: "Common business communications shapes (not rankings)",
    types: [
      {
        id: "cloud-phone",
        title: "Cloud phone / VoIP system",
        bestFor:
          "Teams that need business numbers, routing, and call logging as the core daily job.",
        avoidWhen:
          "Your customers only reach you by chat and nobody expects a phone line.",
      },
      {
        id: "contact-center",
        title: "Contact-centre / queue platform",
        bestFor:
          "Support operations with queues, service levels, and agent performance reporting.",
        avoidWhen:
          "A handful of people share one line and a simple IVR would do.",
      },
      {
        id: "messaging",
        title: "Customer messaging / WhatsApp platform",
        bestFor:
          "Businesses whose customers already message them, needing a shared inbox, templates, and broadcasts.",
        avoidWhen:
          "Voice is the primary channel and messaging is an occasional extra.",
      },
      {
        id: "team-chat",
        title: "Team messaging app",
        bestFor:
          "Internal coordination across shifts, sites, or frontline staff without customer-facing channels.",
        avoidWhen:
          "The problem is customers reaching you, not colleagues reaching each other.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Is business communications software the same as a CRM?",
        answer:
          "No. A CRM stores customers, deals, and history. Business communications software owns numbers, routing, and conversation channels — then syncs activity into the CRM. Some CRMs include a calling module, but it is usually a convenience feature rather than a full phone system with IVR, queues, and number coverage.",
      },
      {
        question: "Do I need a phone system if we already use WhatsApp?",
        answer:
          "It depends on how customers reach you. A WhatsApp Business platform gives you a shared inbox, templates, and broadcasts for messaging — it does not give you phone numbers, IVR, or call queues. If people also call, those are two purchases, not one.",
      },
      {
        question: "Is VoIP reliable enough for a business line?",
        answer:
          "For most teams, yes — cloud phone systems are the mainstream way businesses run voice now. Reliability depends on your internet connection and the vendor's number coverage in your region, which is worth verifying for each country you operate in before committing.",
      },
      {
        question: "What should I do next?",
        answer:
          "If you have confirmed which job is blocking, use How to Choose Business Communications Software and the Best Business Communications Software shortlist — methodology-first, not affiliate-ordered.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related business communications resources",
    links: [
      {
        href: "/guides/how-to-choose-business-communications-software/",
        label: "How to choose business communications software",
        description: "Job-first selection framework.",
      },
      {
        href: "/best/business-communications-software/",
        label: "Best business communications software",
        description: "Researched phone-system shortlist.",
      },
      {
        href: "/categories/business-communications/",
        label: "Business communications category",
        description: "Browse the catalogue.",
      },
      {
        href: "/guides/business-communications-pricing-guide/",
        label: "Business communications pricing guide",
        description: "Seats, minimums, minutes, and message fees.",
      },
      {
        href: "/use-cases/business-phone/",
        label: "Business phone use case",
        description: "What a phone deployment involves.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Compare researched platforms",
    body: "Once you know the job — business phone, customer messaging, or team chat — open the Best Business Communications Software shortlist. Phone systems are ranked against phone systems; messaging and team chat are called out separately.",
    href: "/best/business-communications-software/",
    ctaLabel: "See Best Business Communications Software →",
    variant: "finder",
  },
];

export const whatIsBusinessCommunicationsSoftwareGuide: GuidePage = {
  id: "guide-what-is-business-communications-software",
  slug: "what-is-business-communications-software",
  title: "What Is Business Communications Software? Beginner's Guide",
  summary:
    "What is business communications software? A clear definition of cloud phone, call routing, customer messaging, and team chat — and how each differs from CRM and helpdesk tools.",
  categorySlugs: ["business-communications"],
  productSlugs: [
    "ringcentral",
    "dialpad",
    "zoom",
    "nextiva",
    "aircall",
    "callhippo",
    "slack",
    "microsoft-teams",
    "wati",
  ],
  topicType: "fundamental",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/what-is-business-communications-software-hero.png",
    alt: "Business communications as a conversation layer: numbers, routing, shared inbox, and CRM integration — separate from the customer record system.",
  },
  supports: [
    {
      contentId: "content:category:business-communications",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:business-communications-software",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:guide:how-to-choose-business-communications-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:guide:how-to-choose-business-communications-software",
    label: "How to choose business communications software",
  },
  relatedGuideSlugs: [
    "how-to-choose-business-communications-software",
    "business-communications-pricing-guide",
    "business-communications-requirements-guide",
    "business-communications-evaluation-guide",
  ],
  blocks: whatIsBusinessCommunicationsBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description: "Business phone, customer messaging, or team chat — one sentence.",
      order: 0,
    },
    {
      id: "channels",
      label: "List the channels customers actually use",
      description: "Calls, SMS, WhatsApp — evidence, not assumption.",
      order: 1,
    },
    {
      id: "seats",
      label: "Estimate seats and countries",
      description: "Who needs a licence, and where numbers must exist.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T12:00:00.000Z",
    publishedAt: "2026-08-17T12:00:00.000Z",
    reviewedAt: "2026-08-17T12:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "What Is Business Communications Software? | SoftwareGlimpse",
    description:
      "What is business communications software? A clear definition of cloud phone, call routing, WhatsApp messaging, and team chat — and how they differ from CRM.",
    canonicalPath: "/guides/what-is-business-communications-software/",
    indexable: true,
  },
};
