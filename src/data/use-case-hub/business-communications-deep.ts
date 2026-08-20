import type { UseCaseHubProfile } from "@/domain";

type Depth = Pick<
  UseCaseHubProfile,
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "tagline"
  | "displayTitle"
  | "badgeLabel"
  | "glance"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "priorities"
  | "scenarios"
  | "buyingFramework"
  | "needsVisual"
  | "workflowVisual"
  | "heroVisual"
  | "faq"
  | "relatedUseCaseSlugs"
  | "featuredGuideHrefs"
  | "categorySlug"
  | "finderHref"
  | "catalogueHref"
  | "primaryCta"
  | "secondaryCta"
  | "buyingGuideHref"
>;

const BC_CTAS = {
  categorySlug: "business-communications" as const,
  finderHref: "/best/business-communications-software/",
  catalogueHref: "/categories/business-communications/",
  buyingGuideHref: "/guides/how-to-choose-business-communications-software/",
  primaryCta: {
    href: "/best/business-communications-software/",
    label: "Best business communications software",
  },
  secondaryCta: {
    href: "/categories/business-communications/",
    label: "Browse business communications",
  },
};

const BC_GUIDES = [
  "/guides/what-is-business-communications-software/",
  "/guides/how-to-choose-business-communications-software/",
  "/guides/business-communications-pricing-guide/",
  "/best/business-communications-software/",
];

/**
 * Business communications use-case hub depth (`/use-cases/[slug]/`).
 * Educational — no invented prices, scores, or product endorsements.
 */
export const businessCommunicationsUseCaseDepth: Record<string, Depth> = {
  "business-phone": {
    ...BC_CTAS,
    displayTitle: "Business communications for Business phone",
    badgeLabel: "Business phone",
    tagline:
      "Give the company real phone numbers, shared answering, and a call record — instead of routing customers to personal mobiles.",
    overview:
      "Business phone is the job of running company phone lines on software: provisioning or porting numbers, answering from a softphone or mobile app, sharing calls across a team, and logging every conversation somewhere the business can see it. It replaces the arrangement most small companies start with, where one person's mobile is effectively the customer service line.",
    whoThisIsFor:
      "Small and mid-sized businesses moving off personal mobiles or a legacy PBX, and teams that have grown past the point where one person can reasonably answer everything. You need numbers, shared answering, and a record — not necessarily a full contact centre.",
    whatMattersIntro:
      "Prioritise number coverage in the countries you operate in, licence minimums against your real headcount, call quality on the networks your team actually uses, and whether calls log into your CRM without manual entry.",
    workedExample:
      "Worked example: Harbor Studio, an eight-person agency. Before a phone system, the office manager's mobile was the published number and holidays meant missed client calls. After, one main number rings a shared queue, voicemails land in a list with an owner, and every call appears against the client record — so cover is a rota question rather than a crisis.",
    workedExampleSecondary:
      "Worked example: a two-person consultancy that only needs business numbers separate from personal ones. A licence minimum of three would mean paying for a seat nobody uses — which is why minimums belong on the requirements sheet, not the negotiation.",
    glance: {
      primaryGoal:
        "Reliable business numbers with shared answering and complete call records",
      typicalTeam: "Small businesses, agencies, professional services, multi-site operations",
      commonPriorities: [
        "Number coverage",
        "Licence minimums",
        "Call quality",
        "Shared answering",
        "CRM logging",
      ],
    },
    challenges: [
      {
        id: "personal-mobiles",
        title: "The business runs on personal mobiles",
        pain: "Customer relationships leave with the phone, and nobody else can pick up.",
        crmHelps:
          "Company-owned numbers and softphone licences keep the line with the business.",
      },
      {
        id: "missed-calls",
        title: "Calls go unanswered outside one person's hours",
        pain: "Missed calls become lost work with no trace they happened.",
        crmHelps:
          "Shared answering, queues, and after-hours rules give every call a destination.",
      },
      {
        id: "no-record",
        title: "No record of who spoke to whom",
        pain: "Follow-ups get duplicated or dropped between colleagues.",
        crmHelps:
          "Automatic logging attaches calls to the customer record without retyping.",
      },
      {
        id: "coverage-gaps",
        title: "Customers abroad call an international number",
        pain: "Answer rates drop when the number does not look local.",
        crmHelps:
          "Local number provisioning gives regional presence without regional offices.",
      },
    ],
    outcomes: [
      {
        id: "continuity",
        title: "Calls survive absence",
        description: "Cover is a rota, not a personal favour.",
      },
      {
        id: "record",
        title: "Every call leaves a record",
        description: "History lives with the customer, not in a call log on someone's phone.",
      },
      {
        id: "presence",
        title: "Professional presence",
        description: "Published numbers, greetings, and voicemail that match the business.",
      },
      {
        id: "portability",
        title: "Numbers belong to the company",
        description: "Staff changes no longer put a customer line at risk.",
      },
    ],
    capabilityNeeds: [
      {
        id: "cloud-phone",
        title: "Cloud phone",
        description: "Numbers, porting, and softphone apps.",
        priority: "must",
        href: "/capabilities/cloud-phone/",
      },
      {
        id: "call-routing",
        title: "Call routing",
        description: "Ring groups and business-hours rules.",
        priority: "must",
        href: "/capabilities/call-routing/",
      },
      {
        id: "crm-cti",
        title: "CRM / CTI integration",
        description: "Automatic call logging without manual entry.",
        priority: "must",
        href: "/capabilities/crm-cti/",
      },
      {
        id: "call-recording",
        title: "Call recording",
        description: "Useful for training and disputes; check consent rules.",
        priority: "nice",
        href: "/capabilities/call-recording/",
      },
      {
        id: "sms-messaging",
        title: "SMS messaging",
        description: "Texting from the same business number.",
        priority: "nice",
        href: "/capabilities/sms-messaging/",
      },
    ],
    workflowSteps: [
      {
        id: "provision",
        label: "Provision numbers",
        detail: "Buy new lines or port existing ones in each country you serve.",
        goal: "Working business numbers customers can reach.",
      },
      {
        id: "route",
        label: "Set answering rules",
        detail: "Ring groups, business hours, and where after-hours calls go.",
        goal: "Every call has a destination, including at 6pm.",
      },
      {
        id: "connect",
        label: "Connect the CRM",
        detail: "Enable click-to-dial and confirm calls log to the right record.",
        goal: "No duplicate admin after each conversation.",
      },
      {
        id: "roll-out",
        label: "Roll out to the team",
        detail: "Install softphone and mobile apps; test from home and office networks.",
        goal: "Usable call quality wherever people work.",
      },
      {
        id: "review",
        label: "Review weekly",
        detail: "Check missed calls, answer times, and voicemail follow-up.",
        goal: "One improvement per week rather than an annual audit.",
      },
    ],
    priorities: [
      {
        id: "coverage",
        title: "Number coverage",
        description: "A missing country ends the evaluation before features matter.",
        icon: "globe",
      },
      {
        id: "quality",
        title: "Call quality",
        description: "Test on the networks your team really uses.",
        icon: "shield",
      },
      {
        id: "logging",
        title: "Call logging",
        description: "Automatic write-back prevents a second system to maintain.",
        icon: "check",
      },
    ],
    scenarios: [
      {
        id: "agency",
        title: "Agency or professional services",
        bestWhen: "Client calls must be shared and logged against the account.",
      },
      {
        id: "multi-site",
        title: "Multi-site business",
        bestWhen: "One published number needs to route to the right location.",
      },
      {
        id: "distributed",
        title: "Distributed team",
        bestWhen: "Staff work across countries and need local numbers.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm business phone is the primary job",
        description: "If the blocking channel is WhatsApp, evaluate a messaging platform instead.",
        href: "/guides/how-to-choose-business-communications-software/",
      },
      {
        step: 2,
        title: "List countries and licence count",
        description: "Coverage and minimums decide feasibility before features.",
        href: "/guides/business-communications-requirements-guide/",
      },
      {
        step: 3,
        title: "Price the qualifying tier",
        description: "Include numbers and expected minutes, not just the seat price.",
        href: "/guides/business-communications-pricing-guide/",
      },
      {
        step: 4,
        title: "Compare researched platforms",
        href: "/best/business-communications-software/",
        ctaLabel: "Best business communications →",
      },
    ],
    heroVisual: {
      src: "/use-cases/business-phone-hero.png",
      alt: "Educational diagram of a business phone deployment: numbers, ring groups, softphone apps, and CRM call logging.",
      caption:
        "A business phone system moves the customer line from a personal mobile to something the company owns and can cover.",
    },
    needsVisual: {
      src: "/use-cases/business-phone-needs.png",
      alt: "Diagram mapping business phone pains — personal mobiles, missed calls, no record, coverage gaps — to cloud phone fixes.",
      caption: "What usually breaks before a phone system — and what the platform changes.",
    },
    workflowVisual: {
      src: "/use-cases/business-phone-workflow.png",
      alt: "Five-step business phone workflow: provision, route, connect CRM, roll out, review.",
      caption: "A practical rollout loop from number provisioning to weekly missed-call review.",
    },
    faq: [
      {
        question: "Can we keep our existing phone number?",
        answer:
          "Usually yes, through porting — but support varies by country and number type, and timelines run from days to weeks. Confirm porting for your specific number before committing, and keep the old line active until the port completes.",
      },
      {
        question: "Is a cloud phone system enough, or do we need a contact centre?",
        answer:
          "If a handful of people answer calls and a simple ring group or menu covers routing, a cloud phone system is enough. Contact-centre features earn their cost when you have queues, service-level expectations, and agent performance to manage.",
      },
      {
        question: "How is this different from calling inside our CRM?",
        answer:
          "CRM calling features log activity against records and suit occasional outbound calls. A phone system owns the numbers, routing, and inbound experience — then integrates back into the CRM.",
      },
    ],
    relatedUseCaseSlugs: [
      "contact-center",
      "sales-calling",
      "customer-messaging",
      "team-communication",
    ],
    featuredGuideHrefs: BC_GUIDES,
  },

  "sales-calling": {
    ...BC_CTAS,
    displayTitle: "Business communications for Sales calling",
    badgeLabel: "Sales calling",
    tagline:
      "Turn a day of dialing into logged conversations — without hand-typing numbers or updating the CRM twice.",
    overview:
      "Sales calling is the outbound job: working a list, reaching decision-makers, recording what happened, and keeping the CRM current without a second data-entry pass. The tooling that matters is dialing throughput, call dispositions, and automatic write-back — not IVR depth.",
    whoThisIsFor:
      "Sales teams whose day is measured in conversations attempted: SDRs working outbound lists, account executives following up, and founder-led sales teams making enough calls that manual dialing has become the bottleneck.",
    whatMattersIntro:
      "Check whether the dialer is included on the tier you would buy, how dispositions map to your CRM fields, what local-presence numbers cost, and whether recording is available where you need it for coaching.",
    workedExample:
      "Worked example: a three-person SDR team at Northline Sales. Before, reps copied numbers from the CRM into a mobile and logged outcomes at the end of the day — badly. After a dialer with CRM write-back, the list dials in sequence, each call closes with a disposition, and the manager reviews attempts per rep on Monday instead of reconstructing them.",
    workedExampleSecondary:
      "Worked example: a founder selling into two countries who needs local numbers so prospects recognise the caller. Local presence is a number-coverage requirement, not a dialer feature — worth separating on the requirements sheet.",
    glance: {
      primaryGoal: "More logged conversations per rep-day with clean CRM data",
      typicalTeam: "SDR teams, account executives, founder-led sales",
      commonPriorities: [
        "Dialer on the target tier",
        "CRM write-back",
        "Call dispositions",
        "Local presence numbers",
        "Recording for coaching",
      ],
    },
    challenges: [
      {
        id: "manual-dialing",
        title: "Reps hand-type every number",
        pain: "Dial time replaces talk time and attempts stay low.",
        crmHelps: "Power dialing and click-to-dial remove the manual step.",
      },
      {
        id: "late-logging",
        title: "Outcomes get logged at the end of the day",
        pain: "Detail is lost and pipeline data drifts from reality.",
        crmHelps: "Dispositions captured at call end write straight to the record.",
      },
      {
        id: "unknown-number",
        title: "Prospects do not recognise the number",
        pain: "Answer rates fall, especially across regions.",
        crmHelps: "Local numbers give recognisable presence where you sell.",
      },
      {
        id: "no-coaching",
        title: "Managers coach from memory",
        pain: "Feedback is anecdotal and hard to act on.",
        crmHelps: "Recording and call analytics make coaching specific.",
      },
    ],
    outcomes: [
      {
        id: "attempts",
        title: "More attempts per hour",
        description: "Dial mechanics stop eating selling time.",
      },
      {
        id: "clean-crm",
        title: "CRM that reflects reality",
        description: "Dispositions land at the moment of the call.",
      },
      {
        id: "coaching",
        title: "Specific coaching",
        description: "Managers review real calls instead of recollections.",
      },
      {
        id: "visibility",
        title: "Comparable activity data",
        description: "Attempts and connects measured the same way for everyone.",
      },
    ],
    capabilityNeeds: [
      {
        id: "power-dialer",
        title: "Power dialer",
        description: "List dialing with pacing and dispositions.",
        priority: "must",
        href: "/capabilities/power-dialer/",
      },
      {
        id: "crm-cti",
        title: "CRM / CTI integration",
        description: "Click-to-dial and automatic logging.",
        priority: "must",
        href: "/capabilities/crm-cti/",
      },
      {
        id: "cloud-phone",
        title: "Cloud phone",
        description: "Business numbers, including local presence.",
        priority: "must",
        href: "/capabilities/cloud-phone/",
      },
      {
        id: "call-recording",
        title: "Call recording",
        description: "Coaching and quality review, subject to consent rules.",
        priority: "nice",
        href: "/capabilities/call-recording/",
      },
      {
        id: "analytics-reporting",
        title: "Analytics & reporting",
        description: "Attempts, connects, and talk time per rep.",
        priority: "nice",
        href: "/capabilities/analytics-reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "list",
        label: "Build the call list",
        detail: "Pull the segment from the CRM rather than a spreadsheet copy.",
        goal: "One source of truth for who gets called.",
      },
      {
        id: "dial",
        label: "Dial the list",
        detail: "Use click-to-dial or a power dialer with sensible pacing.",
        goal: "Dial mechanics stop limiting attempts.",
      },
      {
        id: "disposition",
        label: "Disposition every call",
        detail: "Close each call with an outcome that maps to a CRM field.",
        goal: "Data captured while it is accurate.",
      },
      {
        id: "follow-up",
        label: "Set the next step",
        detail: "Task, callback, or sequence — decided before hanging up.",
        goal: "No conversation ends without an owner and a date.",
      },
      {
        id: "coach",
        label: "Review and coach",
        detail: "Sample recordings and compare connect rates weekly.",
        goal: "One concrete change per rep per week.",
      },
    ],
    priorities: [
      {
        id: "tier",
        title: "Dialer tier",
        description: "Confirm the dialer exists on the plan you will actually buy.",
        icon: "check",
      },
      {
        id: "writeback",
        title: "CRM write-back",
        description: "Logging that needs cleanup is not logging.",
        icon: "sync",
      },
      {
        id: "presence",
        title: "Local presence",
        description: "Number coverage where you sell affects answer rates.",
        icon: "globe",
      },
    ],
    scenarios: [
      {
        id: "sdr",
        title: "SDR outbound team",
        bestWhen: "Volume dialing is the daily motion and attempts are a tracked metric.",
      },
      {
        id: "ae-followup",
        title: "AE follow-up calling",
        bestWhen: "Fewer calls, but every one must log against an opportunity.",
      },
      {
        id: "founder",
        title: "Founder-led sales",
        bestWhen: "One or two people calling across regions and needing local numbers.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm outbound calling is the primary job",
        description: "Inbound-shaped products may lack a usable dialer entirely.",
        href: "/guides/how-to-choose-business-communications-software/",
      },
      {
        step: 2,
        title: "Write the dialer and logging tests",
        description: "Pass/fail checks you can run in a trial.",
        href: "/guides/business-communications-requirements-guide/",
      },
      {
        step: 3,
        title: "Price the tier that includes dialing",
        description: "Dialers are commonly gated above the entry plan.",
        href: "/guides/business-communications-pricing-guide/",
      },
      {
        step: 4,
        title: "Compare researched platforms",
        href: "/best/business-communications-software/",
        ctaLabel: "Best business communications →",
      },
    ],
    heroVisual: {
      src: "/use-cases/sales-calling-hero.png",
      alt: "Educational diagram of a sales calling workflow: CRM list, power dialer, disposition, and automatic call logging.",
      caption:
        "Sales calling tooling earns its cost by converting dial mechanics into logged conversations.",
    },
    needsVisual: {
      src: "/use-cases/sales-calling-needs.png",
      alt: "Diagram mapping sales calling pains — manual dialing, late logging, unrecognised numbers, memory-based coaching — to dialer and CTI fixes.",
      caption: "What limits outbound teams — and which capability addresses each constraint.",
    },
    workflowVisual: {
      src: "/use-cases/sales-calling-workflow.png",
      alt: "Five-step sales calling workflow: build list, dial, disposition, set next step, coach.",
      caption: "A repeatable calling loop that keeps CRM data accurate as it goes.",
    },
    faq: [
      {
        question: "Do we need a dedicated dialer or is a phone system enough?",
        answer:
          "If reps make a handful of calls a day, click-to-dial from the CRM is usually enough. Once dial mechanics measurably limit attempts, a power dialer starts to pay — but check which plan tier includes it before assuming it is standard.",
      },
      {
        question: "Should we record sales calls?",
        answer:
          "Recording is valuable for coaching, but consent rules vary by jurisdiction and sometimes require notifying the other party. Decide the policy, retention period, and who can access recordings before switching it on.",
      },
      {
        question: "How is this different from sales engagement software?",
        answer:
          "Sales engagement platforms orchestrate multi-channel sequences including email and tasks. Business communications tools own the calling layer — numbers, dialing, and call quality. Some products overlap; the question is which one is the core product.",
      },
    ],
    relatedUseCaseSlugs: [
      "business-phone",
      "contact-center",
      "customer-messaging",
      "outbound-sales",
    ],
    featuredGuideHrefs: BC_GUIDES,
  },

  "customer-messaging": {
    ...BC_CTAS,
    displayTitle: "Business communications for Customer messaging",
    badgeLabel: "Customer messaging",
    tagline:
      "Answer customer messages as a team, with ownership and history — not from one person's phone.",
    overview:
      "Customer messaging is the job of handling inbound SMS and chat conversations as a business rather than as individuals. The core capability is a shared inbox with assignment, tags, and internal notes, so a conversation can be picked up by whoever is available and the history stays with the customer.",
    whoThisIsFor:
      "Businesses whose customers already text or message them: local services, retail, clinics, and support teams that have discovered messages arriving faster than one inbox can handle.",
    whatMattersIntro:
      "Focus on assignment and ownership rules, whether history follows the customer across channels, template handling for repeated answers, and how messaging is billed — per seat, per conversation, or both.",
    workedExample:
      "Worked example: Northline Retail's three stores each fielded texts on a store handset. Messages were answered twice or not at all. After moving to a shared inbox, each conversation has an assignee and a status, colleagues can leave internal notes, and the manager can see what is unanswered at 4pm.",
    workedExampleSecondary:
      "Worked example: a services business that sends appointment reminders by SMS from the same number customers reply to. Two-way texting on the business number keeps the reply in the same thread rather than in a no-reply void.",
    glance: {
      primaryGoal: "Shared, owned customer conversations with full history",
      typicalTeam: "Support teams, local services, retail, clinics",
      commonPriorities: [
        "Shared inbox",
        "Assignment & ownership",
        "Conversation history",
        "Templates",
        "Channel billing model",
      ],
    },
    challenges: [
      {
        id: "one-phone",
        title: "Messages arrive on one person's device",
        pain: "Cover disappears when that person is away.",
        crmHelps: "A shared inbox makes the queue a team asset.",
      },
      {
        id: "double-reply",
        title: "Two people answer the same message",
        pain: "Customers get contradictory answers.",
        crmHelps: "Assignment and status make ownership explicit.",
      },
      {
        id: "lost-history",
        title: "No history when a customer returns",
        pain: "Every conversation restarts from zero.",
        crmHelps: "Threaded history keeps context with the contact.",
      },
      {
        id: "repetition",
        title: "The same answers get retyped daily",
        pain: "Response times suffer and wording drifts.",
        crmHelps: "Templates and saved replies keep answers fast and consistent.",
      },
    ],
    outcomes: [
      {
        id: "ownership",
        title: "Every conversation has an owner",
        description: "Nothing sits unanswered because it belonged to nobody.",
      },
      {
        id: "continuity",
        title: "History survives staff changes",
        description: "Context stays with the business, not the handset.",
      },
      {
        id: "speed",
        title: "Faster consistent replies",
        description: "Templates cover the repeated questions.",
      },
      {
        id: "visibility",
        title: "Visible backlog",
        description: "Managers can see what is open before customers complain.",
      },
    ],
    capabilityNeeds: [
      {
        id: "shared-inbox",
        title: "Shared inbox",
        description: "Assignment, tags, and internal notes.",
        priority: "must",
        href: "/capabilities/shared-inbox/",
      },
      {
        id: "sms-messaging",
        title: "SMS messaging",
        description: "Two-way texting on business numbers.",
        priority: "must",
        href: "/capabilities/sms-messaging/",
      },
      {
        id: "unified-inbox",
        title: "Unified multichannel inbox",
        description: "Calls and messages in one workspace.",
        priority: "nice",
        href: "/capabilities/unified-inbox/",
      },
      {
        id: "whatsapp-business",
        title: "WhatsApp Business",
        description: "Needed only if customers message on WhatsApp.",
        priority: "nice",
        href: "/capabilities/whatsapp-business/",
      },
      {
        id: "analytics-reporting",
        title: "Analytics & reporting",
        description: "Response times and open-conversation counts.",
        priority: "nice",
        href: "/capabilities/analytics-reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "connect",
        label: "Connect channels",
        detail: "Enable messaging on the numbers or accounts customers already use.",
        goal: "Messages arrive in one place.",
      },
      {
        id: "assign",
        label: "Set assignment rules",
        detail: "Decide who owns new conversations and how handover works.",
        goal: "No message is everyone's and therefore nobody's.",
      },
      {
        id: "respond",
        label: "Respond with templates",
        detail: "Save the repeated answers; keep tone consistent.",
        goal: "Faster replies without copy-paste drift.",
      },
      {
        id: "note",
        label: "Leave internal notes",
        detail: "Capture context colleagues need before they reply.",
        goal: "Handover without a verbal briefing.",
      },
      {
        id: "review",
        label: "Review the backlog",
        detail: "Check unanswered and reopened conversations daily.",
        goal: "Problems visible before the customer chases.",
      },
    ],
    priorities: [
      {
        id: "ownership",
        title: "Ownership rules",
        description: "Assignment is what turns an inbox into a queue.",
        icon: "users",
      },
      {
        id: "history",
        title: "Conversation history",
        description: "Context that follows the customer, not the device.",
        icon: "clock",
      },
      {
        id: "billing",
        title: "Billing model",
        description: "Per seat and per conversation behave very differently at volume.",
        icon: "calculator",
      },
    ],
    scenarios: [
      {
        id: "local-service",
        title: "Local service business",
        bestWhen: "Customers text to book, reschedule, or ask quick questions.",
      },
      {
        id: "support",
        title: "Support team",
        bestWhen: "Message volume exceeds what one inbox owner can handle.",
      },
      {
        id: "retail",
        title: "Multi-site retail",
        bestWhen: "Several locations need one visible queue.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm which channels customers actually use",
        description: "Evidence, not assumption — SMS and WhatsApp are different purchases.",
        href: "/guides/how-to-choose-business-communications-software/",
      },
      {
        step: 2,
        title: "Write the assignment and history tests",
        description: "Pass/fail checks for ownership and threading.",
        href: "/guides/business-communications-requirements-guide/",
      },
      {
        step: 3,
        title: "Model the messaging bill",
        description: "Seats plus per-conversation charges at your volume.",
        href: "/guides/business-communications-pricing-guide/",
      },
      {
        step: 4,
        title: "Compare researched platforms",
        href: "/best/business-communications-software/",
        ctaLabel: "Best business communications →",
      },
    ],
    heroVisual: {
      src: "/use-cases/customer-messaging-hero.png",
      alt: "Educational diagram of a customer messaging shared inbox with assignment, tags, internal notes, and conversation history.",
      caption:
        "A shared inbox turns scattered customer messages into an owned, visible queue.",
    },
    needsVisual: {
      src: "/use-cases/customer-messaging-needs.png",
      alt: "Diagram mapping customer messaging pains — one device, duplicate replies, lost history, repeated typing — to shared inbox fixes.",
      caption: "What breaks when messaging grows past one person — and what fixes it.",
    },
    workflowVisual: {
      src: "/use-cases/customer-messaging-workflow.png",
      alt: "Five-step customer messaging workflow: connect channels, assign, respond, note, review.",
      caption: "A daily messaging loop that keeps ownership and response times visible.",
    },
    faq: [
      {
        question: "Is customer messaging the same as a helpdesk?",
        answer:
          "They overlap. A helpdesk is built around tickets, SLAs, and knowledge bases; a messaging platform is built around live conversations on channels customers already use. If your work is ticket-shaped, look at customer service software; if it is conversation-shaped, this is the right category.",
      },
      {
        question: "Can we use our existing business number for texting?",
        answer:
          "Often yes, if the number type supports SMS and the vendor operates in your country. Business texting also carries registration requirements in some regions — verify both before promising customers they can text you.",
      },
      {
        question: "Do we need WhatsApp too?",
        answer:
          "Only if customers actually message you there. WhatsApp requires the official Business API through a provider, with template approval and separate per-conversation fees, so treat it as its own decision rather than a checkbox.",
      },
    ],
    relatedUseCaseSlugs: [
      "whatsapp-support",
      "business-phone",
      "contact-center",
      "team-communication",
    ],
    featuredGuideHrefs: BC_GUIDES,
  },

  "whatsapp-support": {
    ...BC_CTAS,
    displayTitle: "Business communications for WhatsApp support & sales",
    badgeLabel: "WhatsApp",
    tagline:
      "Run WhatsApp as a business channel — shared inbox, approved templates, and broadcast rules — not a personal account with the team's password.",
    overview:
      "WhatsApp support and sales means operating the official WhatsApp Business API through a provider: a shared team inbox for replies, message templates approved by Meta for outbound contact, broadcasts within the platform's rules, and chatbots or automations for repetitive questions. It is a distinct purchase from a phone system.",
    whoThisIsFor:
      "Businesses in markets where customers default to WhatsApp — common across parts of Asia, Latin America, Africa, and southern Europe — and teams currently running the channel from a personal or Business App account that cannot be shared safely.",
    whatMattersIntro:
      "Understand the two-part cost model (platform subscription plus Meta conversation fees), the template approval workflow, how many agents can share the inbox on your tier, and what automation is included versus gated.",
    workedExample:
      "Worked example: a clinic taking appointment requests on WhatsApp. Before, one receptionist's phone held the account and evenings went unanswered. After moving to a Business API platform, the number is shared, templates handle appointment confirmations, and unanswered chats are visible to a supervisor rather than trapped on a handset.",
    workedExampleSecondary:
      "Worked example: a retailer sending order updates. Outbound messages outside the customer service window require approved templates, and each conversation carries a Meta charge — so the message plan is a cost decision, not only a marketing one.",
    glance: {
      primaryGoal:
        "A shared, compliant WhatsApp channel with predictable conversation costs",
      typicalTeam: "Support and sales teams in WhatsApp-first markets",
      commonPriorities: [
        "Official API access",
        "Shared inbox seats",
        "Template approval",
        "Conversation fees",
        "Automation depth",
      ],
    },
    challenges: [
      {
        id: "personal-account",
        title: "The channel runs on a personal account",
        pain: "It cannot be shared, audited, or handed over safely.",
        crmHelps: "Business API access moves the number to a company-owned platform.",
      },
      {
        id: "template-rules",
        title: "Outbound messages get blocked or ignored",
        pain: "Meta's rules restrict unsolicited outbound outside the service window.",
        crmHelps: "Template management handles approval and correct usage.",
      },
      {
        id: "cost-surprise",
        title: "The bill has two halves",
        pain: "Meta conversation charges are not in the platform's subscription price.",
        crmHelps: "Understanding both parts makes volume forecasting possible.",
      },
      {
        id: "repetition",
        title: "The same questions arrive all day",
        pain: "Agents spend the day answering hours and prices.",
        crmHelps: "Chatbots and saved replies absorb repetitive traffic.",
      },
    ],
    outcomes: [
      {
        id: "shared",
        title: "A channel the business owns",
        description: "Access survives staff changes and can be audited.",
      },
      {
        id: "compliant",
        title: "Outbound that follows the rules",
        description: "Approved templates used in the right window.",
      },
      {
        id: "predictable",
        title: "Forecastable messaging cost",
        description: "Conversation volume modelled rather than discovered.",
      },
      {
        id: "deflection",
        title: "Fewer repetitive replies",
        description: "Automation covers the questions that repeat.",
      },
    ],
    capabilityNeeds: [
      {
        id: "whatsapp-business",
        title: "WhatsApp Business",
        description: "Official API access, templates, and broadcasts.",
        priority: "must",
        href: "/capabilities/whatsapp-business/",
      },
      {
        id: "shared-inbox",
        title: "Shared inbox",
        description: "Multi-agent assignment and internal notes.",
        priority: "must",
        href: "/capabilities/shared-inbox/",
      },
      {
        id: "analytics-reporting",
        title: "Analytics & reporting",
        description: "Conversation volume and response times.",
        priority: "nice",
        href: "/capabilities/analytics-reporting/",
      },
      {
        id: "unified-inbox",
        title: "Unified multichannel inbox",
        description: "Useful when customers also call or text.",
        priority: "nice",
        href: "/capabilities/unified-inbox/",
      },
      {
        id: "crm-cti",
        title: "CRM integration",
        description: "Conversation context alongside customer records.",
        priority: "nice",
        href: "/capabilities/crm-cti/",
      },
    ],
    workflowSteps: [
      {
        id: "onboard",
        label: "Onboard the number",
        detail: "Get official API access through a provider and verify the business.",
        goal: "A company-owned WhatsApp number.",
      },
      {
        id: "templates",
        label: "Submit templates",
        detail: "Draft and submit the outbound messages you will actually send.",
        goal: "Approved templates ready before launch.",
      },
      {
        id: "inbox",
        label: "Set up the shared inbox",
        detail: "Add agents, define assignment, and agree response expectations.",
        goal: "Every chat has an owner.",
      },
      {
        id: "automate",
        label: "Automate the repeats",
        detail: "Cover hours, pricing, and status questions with saved replies or bots.",
        goal: "Agents handle the conversations that need judgment.",
      },
      {
        id: "measure",
        label: "Measure volume and cost",
        detail: "Track conversations and response times against the message plan.",
        goal: "Cost and service level reviewed together.",
      },
    ],
    priorities: [
      {
        id: "api",
        title: "Official API access",
        description: "The compliance foundation for sharing the channel.",
        icon: "shield",
      },
      {
        id: "fees",
        title: "Two-part pricing",
        description: "Platform subscription plus Meta conversation charges.",
        icon: "calculator",
      },
      {
        id: "templates",
        title: "Template workflow",
        description: "Approval turnaround shapes what you can send and when.",
        icon: "layout",
      },
    ],
    scenarios: [
      {
        id: "whatsapp-first",
        title: "WhatsApp-first market",
        bestWhen: "Customers expect to message rather than call or email.",
      },
      {
        id: "appointments",
        title: "Appointment-based business",
        bestWhen: "Confirmations and reminders are the bulk of outbound messaging.",
      },
      {
        id: "commerce",
        title: "Retail and commerce",
        bestWhen: "Order updates and pre-sales questions arrive on WhatsApp.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm WhatsApp is the blocking channel",
        description: "If customers mostly call, a phone system is the first purchase.",
        href: "/guides/how-to-choose-business-communications-software/",
      },
      {
        step: 2,
        title: "Write template and inbox requirements",
        description: "Which outbound messages you need approved, and how many agents.",
        href: "/guides/business-communications-requirements-guide/",
      },
      {
        step: 3,
        title: "Model both halves of the bill",
        description: "Subscription plus expected conversation charges.",
        href: "/guides/business-communications-pricing-guide/",
      },
      {
        step: 4,
        title: "Compare researched platforms",
        href: "/best/business-communications-software/",
        ctaLabel: "Best business communications →",
      },
    ],
    heroVisual: {
      src: "/use-cases/whatsapp-support-hero.png",
      alt: "Educational diagram of a WhatsApp Business deployment: official API access, shared inbox, approved templates, and conversation fees.",
      caption:
        "WhatsApp as a business channel needs official API access, a shared inbox, and a message plan that accounts for conversation fees.",
    },
    needsVisual: {
      src: "/use-cases/whatsapp-support-needs.png",
      alt: "Diagram mapping WhatsApp pains — personal accounts, blocked outbound, surprise fees, repetitive questions — to platform fixes.",
      caption: "What goes wrong running WhatsApp informally — and what a platform changes.",
    },
    workflowVisual: {
      src: "/use-cases/whatsapp-support-workflow.png",
      alt: "Five-step WhatsApp workflow: onboard number, submit templates, set up shared inbox, automate repeats, measure volume.",
      caption: "A launch loop from API onboarding to weekly volume and cost review.",
    },
    faq: [
      {
        question: "Why can't we just use the free WhatsApp Business app?",
        answer:
          "The free app works for a single operator on a single device. It cannot be shared safely across a team, has limited automation, and gives you no assignment or audit trail. The Business API through a provider is what makes the channel a team asset.",
      },
      {
        question: "How is WhatsApp messaging priced?",
        answer:
          "In two parts: the platform's subscription for the inbox, automation, and broadcast tooling, plus Meta's own per-conversation or per-message charges. The platform passes the second part through and does not set the rate, so model both against your expected volume.",
      },
      {
        question: "Can we send marketing broadcasts on WhatsApp?",
        answer:
          "Within Meta's rules, using approved templates and respecting opt-in requirements and the customer service window. Treat it as a permission-based channel with its own compliance requirements rather than an unlimited broadcast list.",
      },
    ],
    relatedUseCaseSlugs: [
      "customer-messaging",
      "business-phone",
      "contact-center",
      "team-communication",
    ],
    featuredGuideHrefs: BC_GUIDES,
  },

  "team-communication": {
    ...BC_CTAS,
    displayTitle: "Business communications for Team communication",
    badgeLabel: "Team chat",
    tagline:
      "Move internal coordination out of personal messaging groups into channels the business actually controls.",
    overview:
      "Team communication is the internal job: channels for work topics, direct messages, file sharing, and the administrative controls that let a business add and remove people cleanly. It is distinct from customer-facing channels — nobody outside the company should be in it.",
    whoThisIsFor:
      "Frontline, shift-based, and multi-site teams currently coordinating in personal messaging groups, plus small businesses that need work conversations to survive staff turnover.",
    whatMattersIntro:
      "Look at admin control and offboarding, whether frontline staff can use it on personal devices comfortably, per-user cost at full headcount rather than office headcount, and any compliance requirements for retention.",
    workedExample:
      "Worked example: a four-site retail operation coordinating in a personal messaging group. When a supervisor left, they kept access to the group and the shift history left with them. After moving to a team messaging app, channels are per site, access ends at offboarding, and history stays with the business.",
    workedExampleSecondary:
      "Worked example: a clinic that needs internal coordination without patient details in a consumer chat app. Administrative control and retention settings are the requirement — not the feature list.",
    glance: {
      primaryGoal: "Internal coordination the business owns and can offboard",
      typicalTeam: "Frontline, shift-based, and multi-site teams",
      commonPriorities: [
        "Admin control",
        "Offboarding",
        "Frontline usability",
        "Per-user cost at full headcount",
        "Retention settings",
      ],
    },
    challenges: [
      {
        id: "personal-groups",
        title: "Work happens in personal chat groups",
        pain: "Leavers keep access and history belongs to nobody.",
        crmHelps: "Company-administered workspaces make access revocable.",
      },
      {
        id: "no-structure",
        title: "One group for everything",
        pain: "Important messages disappear under noise.",
        crmHelps: "Channels per site, shift, or topic restore signal.",
      },
      {
        id: "device-mix",
        title: "Frontline staff have no company device",
        pain: "Tools designed for desk workers go unused.",
        crmHelps: "Mobile-first apps meet frontline teams where they are.",
      },
      {
        id: "compliance",
        title: "Sensitive information in consumer apps",
        pain: "No retention control and no audit trail.",
        crmHelps: "Administrative controls and retention settings make policy enforceable.",
      },
    ],
    outcomes: [
      {
        id: "control",
        title: "Access the business controls",
        description: "Offboarding actually removes access.",
      },
      {
        id: "clarity",
        title: "Findable conversations",
        description: "Structured channels beat one endless group.",
      },
      {
        id: "adoption",
        title: "Frontline adoption",
        description: "Mobile-first tools get used by non-desk staff.",
      },
      {
        id: "continuity",
        title: "History that stays",
        description: "Context survives turnover.",
      },
    ],
    capabilityNeeds: [
      {
        id: "team-messaging",
        title: "Team messaging",
        description: "Channels, direct messages, and file sharing.",
        priority: "must",
        href: "/capabilities/team-messaging/",
      },
      {
        id: "shared-inbox",
        title: "Shared inbox",
        description: "Only if the same team also handles customer conversations.",
        priority: "nice",
        href: "/capabilities/shared-inbox/",
      },
      {
        id: "analytics-reporting",
        title: "Usage reporting",
        description: "Adoption visibility during rollout.",
        priority: "nice",
        href: "/capabilities/analytics-reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "structure",
        label: "Design the channel structure",
        detail: "Decide channels by site, shift, or function before inviting anyone.",
        goal: "A structure people can navigate on day one.",
      },
      {
        id: "invite",
        label: "Onboard the team",
        detail: "Invite staff, set roles, and agree what belongs where.",
        goal: "Everyone knows which channel to use.",
      },
      {
        id: "migrate",
        label: "Retire the old group",
        detail: "Set a switch-off date so conversations do not split across two tools.",
        goal: "One place for internal work talk.",
      },
      {
        id: "govern",
        label: "Set admin policy",
        detail: "Offboarding steps, retention, and what must not be posted.",
        goal: "Policy that survives staff changes.",
      },
      {
        id: "review",
        label: "Review adoption",
        detail: "Check which channels are used and prune the ones that are not.",
        goal: "Structure that stays useful rather than sprawling.",
      },
    ],
    priorities: [
      {
        id: "admin",
        title: "Administrative control",
        description: "The difference between a company tool and a group chat.",
        icon: "shield",
      },
      {
        id: "mobile",
        title: "Mobile-first usability",
        description: "Frontline staff decide adoption.",
        icon: "smartphone",
      },
      {
        id: "cost",
        title: "Cost at full headcount",
        description: "Per-user pricing multiplies fast across a frontline workforce.",
        icon: "calculator",
      },
    ],
    scenarios: [
      {
        id: "frontline",
        title: "Frontline / shift teams",
        bestWhen: "Most staff have no desk and coordinate by phone.",
      },
      {
        id: "multi-site",
        title: "Multi-site operations",
        bestWhen: "Each location needs its own channel plus a company-wide one.",
      },
      {
        id: "regulated",
        title: "Regulated environments",
        bestWhen: "Retention and access control are policy requirements.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm the job is internal, not customer-facing",
        description: "Customer conversations need a shared inbox, not a team chat app.",
        href: "/guides/how-to-choose-business-communications-software/",
      },
      {
        step: 2,
        title: "Write the admin and offboarding tests",
        description: "Prove access ends when employment does.",
        href: "/guides/business-communications-requirements-guide/",
      },
      {
        step: 3,
        title: "Price at full headcount",
        description: "Include frontline staff, not just office users.",
        href: "/guides/business-communications-pricing-guide/",
      },
      {
        step: 4,
        title: "Compare researched platforms",
        href: "/best/business-communications-software/",
        ctaLabel: "Best business communications →",
      },
    ],
    heroVisual: {
      src: "/use-cases/team-communication-hero.png",
      alt: "Educational diagram of team messaging: channels by site and shift, direct messages, and administrative control.",
      caption:
        "Team messaging moves internal coordination into a workspace the business can administer and offboard.",
    },
    needsVisual: {
      src: "/use-cases/team-communication-needs.png",
      alt: "Diagram mapping team communication pains — personal groups, one noisy channel, no company devices, no retention control — to team messaging fixes.",
      caption: "What personal chat groups cost a business — and what changes with an owned tool.",
    },
    workflowVisual: {
      src: "/use-cases/team-communication-workflow.png",
      alt: "Five-step team communication rollout: design structure, onboard, retire old group, set admin policy, review adoption.",
      caption: "A rollout loop that gets teams off personal groups without splitting conversations.",
    },
    faq: [
      {
        question: "Is team chat part of business communications?",
        answer:
          "Yes, as the internal side of the category. Business phone and customer messaging handle conversations with customers; team messaging handles conversations between colleagues. They are usually separate purchases with different buyers.",
      },
      {
        question: "Do we need this if we already use email?",
        answer:
          "Email works for asynchronous, documented exchanges. Shift coordination, quick questions, and site-level updates tend to move to chat regardless — the decision is whether that happens in a tool the business controls or in a personal group.",
      },
      {
        question: "How do we stop it becoming another noisy group?",
        answer:
          "Design the channel structure before inviting anyone, set a switch-off date for the old group so conversations do not split, and prune unused channels during review. Structure decided after adoption rarely gets applied.",
      },
    ],
    relatedUseCaseSlugs: [
      "customer-messaging",
      "business-phone",
      "contact-center",
      "whatsapp-support",
    ],
    featuredGuideHrefs: BC_GUIDES,
  },

  "contact-center": {
    ...BC_CTAS,
    displayTitle: "Business communications for Contact center & queues",
    badgeLabel: "Contact center",
    tagline:
      "Route inbound volume through menus and queues, and give managers numbers they can act on.",
    overview:
      "Contact center is the inbound-at-scale job: IVR menus that send callers to the right team, queues with overflow and wait handling, business-hours and holiday rules, agent availability, and reporting a supervisor reviews weekly. It is where a phone system stops being a shared line and becomes an operation.",
    whoThisIsFor:
      "Support and service teams with enough inbound volume that a simple ring group no longer works — typically several agents, defined hours, and an expectation about how quickly calls are answered.",
    whatMattersIntro:
      "Evaluate routing depth on the tier you would buy, how queues behave at overflow and after hours, whether reporting answers a supervisor's weekly questions, and how agent licences scale as the team grows.",
    workedExample:
      "Worked example: Harbor Clinic across four sites. Before, one number rang a single handset and busy periods sent callers to voicemail. After building an IVR with site options, a queue per site, and an after-hours message, the supervisor can see wait times and abandoned calls per site — and staff the phones from evidence rather than complaints.",
    workedExampleSecondary:
      "Worked example: a support team with a service expectation of answering within a minute. Queue reporting is what makes that expectation measurable rather than aspirational.",
    glance: {
      primaryGoal: "Inbound calls routed correctly with measurable answer performance",
      typicalTeam: "Support teams, service desks, multi-site operations",
      commonPriorities: [
        "IVR & queue depth",
        "After-hours rules",
        "Agent availability",
        "Queue reporting",
        "Licence scaling",
      ],
    },
    challenges: [
      {
        id: "single-line",
        title: "One line for every kind of call",
        pain: "Callers wait for someone who cannot help them anyway.",
        crmHelps: "IVR menus route by need before anyone picks up.",
      },
      {
        id: "voicemail-overflow",
        title: "Busy periods dump callers to voicemail",
        pain: "Abandoned calls are invisible until customers complain.",
        crmHelps: "Queues with overflow rules keep callers in a managed path.",
      },
      {
        id: "after-hours",
        title: "After-hours calls disappear",
        pain: "Nobody knows what was missed overnight.",
        crmHelps: "Business-hours rules and voicemail routing create a morning list.",
      },
      {
        id: "no-reporting",
        title: "Staffing decisions come from anecdote",
        pain: "Rotas are set by impression rather than call volume.",
        crmHelps: "Queue analytics show when volume actually peaks.",
      },
    ],
    outcomes: [
      {
        id: "routing",
        title: "Calls reach the right team first time",
        description: "Fewer transfers and repeated explanations.",
      },
      {
        id: "measurable",
        title: "Measurable answer performance",
        description: "Wait time and abandon rate become weekly numbers.",
      },
      {
        id: "coverage",
        title: "Predictable after-hours handling",
        description: "Out-of-hours callers get a consistent experience.",
      },
      {
        id: "staffing",
        title: "Evidence-based staffing",
        description: "Rotas match the volume curve.",
      },
    ],
    capabilityNeeds: [
      {
        id: "call-routing",
        title: "Call routing & IVR",
        description: "Menus, queues, overflow, and business-hours rules.",
        priority: "must",
        href: "/capabilities/call-routing/",
      },
      {
        id: "analytics-reporting",
        title: "Analytics & reporting",
        description: "Wait times, abandons, and agent performance.",
        priority: "must",
        href: "/capabilities/analytics-reporting/",
      },
      {
        id: "cloud-phone",
        title: "Cloud phone",
        description: "Numbers and agent softphones underneath the queue.",
        priority: "must",
        href: "/capabilities/cloud-phone/",
      },
      {
        id: "call-recording",
        title: "Call recording",
        description: "Quality review and dispute resolution.",
        priority: "nice",
        href: "/capabilities/call-recording/",
      },
      {
        id: "unified-inbox",
        title: "Unified multichannel inbox",
        description: "When the same team also handles messages.",
        priority: "nice",
        href: "/capabilities/unified-inbox/",
      },
    ],
    workflowSteps: [
      {
        id: "map",
        label: "Map the call types",
        detail: "List why people actually call before designing a menu.",
        goal: "An IVR based on demand, not org chart.",
      },
      {
        id: "build",
        label: "Build menus and queues",
        detail: "Route each call type to a queue with a named owner.",
        goal: "Every call type has a destination.",
      },
      {
        id: "hours",
        label: "Set hours and overflow",
        detail: "Define after-hours behaviour and what happens when a queue is full.",
        goal: "No caller falls off the edge of the design.",
      },
      {
        id: "staff",
        label: "Staff to the volume curve",
        detail: "Use reported peaks to set availability and rotas.",
        goal: "Coverage where the calls actually are.",
      },
      {
        id: "review",
        label: "Review queue reports weekly",
        detail: "Track wait time, abandons, and repeat callers.",
        goal: "One routing or staffing change per week.",
      },
    ],
    priorities: [
      {
        id: "routing-depth",
        title: "Routing depth on your tier",
        description: "IVR builders are often gated above the entry plan.",
        icon: "sitemap",
      },
      {
        id: "reporting",
        title: "Queue reporting",
        description: "Without it, service expectations are unmeasurable.",
        icon: "chart",
      },
      {
        id: "scaling",
        title: "Agent licence scaling",
        description: "Seasonal peaks change the cost of the deployment.",
        icon: "users",
      },
    ],
    scenarios: [
      {
        id: "support-desk",
        title: "Support desk",
        bestWhen: "Several agents share inbound volume with answer expectations.",
      },
      {
        id: "multi-site",
        title: "Multi-site routing",
        bestWhen: "One published number must reach the correct location.",
      },
      {
        id: "seasonal",
        title: "Seasonal peaks",
        bestWhen: "Volume swings mean queues and overflow rules earn their cost.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm routing depth is genuinely needed",
        description: "A ring group may be enough below a few agents.",
        href: "/guides/how-to-choose-business-communications-software/",
      },
      {
        step: 2,
        title: "Write the routing tests",
        description: "After-hours, overflow, and misrouted-call behaviour.",
        href: "/guides/business-communications-requirements-guide/",
      },
      {
        step: 3,
        title: "Price the tier with IVR and reporting",
        description: "These commonly sit above the entry plan.",
        href: "/guides/business-communications-pricing-guide/",
      },
      {
        step: 4,
        title: "Compare researched platforms",
        href: "/best/business-communications-software/",
        ctaLabel: "Best business communications →",
      },
    ],
    heroVisual: {
      src: "/use-cases/contact-center-hero.png",
      alt: "Educational diagram of a contact centre setup: IVR menu, queues per team, overflow rules, and supervisor reporting.",
      caption:
        "Contact-centre features turn a shared line into a routed operation with measurable answer performance.",
    },
    needsVisual: {
      src: "/use-cases/contact-center-needs.png",
      alt: "Diagram mapping contact centre pains — one line, voicemail overflow, lost after-hours calls, anecdotal staffing — to routing and reporting fixes.",
      caption: "What breaks when inbound volume outgrows a ring group — and what fixes it.",
    },
    workflowVisual: {
      src: "/use-cases/contact-center-workflow.png",
      alt: "Five-step contact centre workflow: map call types, build menus and queues, set hours and overflow, staff to volume, review reports.",
      caption: "A build-and-review loop from IVR design to weekly queue performance.",
    },
    faq: [
      {
        question: "When do we need contact-centre features rather than a phone system?",
        answer:
          "When routing decisions stop being obvious. Below a few agents, a ring group and voicemail usually work. Once you need queues, overflow rules, and an answer-time expectation you report on, contact-centre capability earns its cost.",
      },
      {
        question: "How deep should an IVR menu be?",
        answer:
          "Shallow. Menus built around what callers actually want, with a small number of options and a clear route to a person, outperform deep trees mapped to the org chart. Review the menu against real call reasons after a month.",
      },
      {
        question: "What should queue reporting tell us?",
        answer:
          "At minimum: how many calls arrived, how long callers waited, how many abandoned, and when volume peaks. That is enough to make staffing decisions from evidence rather than impression.",
      },
    ],
    relatedUseCaseSlugs: [
      "business-phone",
      "customer-messaging",
      "sales-calling",
      "whatsapp-support",
    ],
    featuredGuideHrefs: BC_GUIDES,
  },
};
