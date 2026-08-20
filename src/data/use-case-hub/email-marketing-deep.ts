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

const EM_CTAS = {
  categorySlug: "email-marketing" as const,
  finderHref: "/best/email-marketing-software/",
  catalogueHref: "/categories/email-marketing/",
  buyingGuideHref: "/guides/how-to-choose-email-marketing/",
  primaryCta: {
    href: "/best/email-marketing-software/",
    label: "Best email marketing software",
  },
  secondaryCta: {
    href: "/categories/email-marketing/",
    label: "Browse email marketing",
  },
};

/**
 * Email marketing use-case hub depth (`/use-cases/[slug]/`).
 * Scoped to permission-based ESP jobs — not CRM sales email outreach.
 */
export const emailMarketingUseCaseDepth: Record<string, Depth> = {
  newsletters: {
    ...EM_CTAS,
    displayTitle: "Email marketing for Newsletters",
    badgeLabel: "Newsletters",
    tagline:
      "Ship recurring editorial and promo newsletters on a clean list — without redesigning every send from scratch.",
    overview:
      "Newsletters are the email marketing job of composing, scheduling, and measuring recurring permission-based sends to a subscriber list. Teams use an ESP so templates, unsubscribes, and reporting stay in one place — not scattered across personal inboxes and design files.",
    whoThisIsFor:
      "Creators, content marketers, and small businesses whose primary cadence is a weekly or monthly newsletter. You are past one-off blasts and need reusable templates, list hygiene, and send analytics the whole team can trust.",
    whatMattersIntro:
      "Prioritize editor and template quality, list/unsubscribe handling, and scheduling reliability — not the deepest automation suite if journeys are not the job.",
    workedExample:
      "Worked example: a solo creator publishing a weekly industry roundup. Before an ESP, drafts lived in Google Docs and sends went from a personal Gmail. After an ESP, one template, a scheduled send, and unsubscribe handling sit in one workspace — so the newsletter survives vacation weeks.",
    workedExampleSecondary:
      "Worked example: a three-person SMB marketing pair. Before an ESP, each promo was redesigned from scratch and list removals were manual. After an ESP, shared templates and suppression keep Friday sends consistent.",
    glance: {
      primaryGoal: "Reliable recurring newsletter sends with clean list hygiene",
      typicalTeam: "Creators, content marketers, SMB marketing pairs",
      commonPriorities: [
        "Reusable templates",
        "Scheduling",
        "List hygiene",
        "Unsubscribe handling",
        "Basic analytics",
      ],
    },
    challenges: [
      {
        id: "redesign-tax",
        title: "Every send starts from a blank canvas",
        pain: "Design time eats the publishing cadence.",
        crmHelps:
          "Shared templates and brand kits make weekly composition repeatable.",
      },
      {
        id: "inbox-send",
        title: "Newsletters leave from personal inboxes",
        pain: "No shared analytics, no proper unsubscribe, and reputation risk.",
        crmHelps:
          "An ESP centralizes sending domain, suppression, and campaign reports.",
      },
      {
        id: "list-drift",
        title: "The list becomes stale and noisy",
        pain: "Bounces and disengaged contacts hurt deliverability.",
        crmHelps:
          "Subscriber management and engagement segments keep sends healthy.",
      },
      {
        id: "no-signal",
        title: "Nobody knows what worked",
        pain: "Opens and clicks are guessed from anecdotes.",
        crmHelps:
          "Campaign analytics give a weekly review starting point.",
      },
    ],
    outcomes: [
      {
        id: "cadence",
        title: "A sustainable send cadence",
        description: "Templates and scheduling remove redesign tax.",
      },
      {
        id: "hygiene",
        title: "Cleaner list operations",
        description: "Unsubscribes and bounces are handled in-product.",
      },
      {
        id: "visibility",
        title: "Shared performance visibility",
        description: "The team reviews the same campaign numbers.",
      },
      {
        id: "brand",
        title: "More consistent brand presentation",
        description: "Reusable layouts keep design within guardrails.",
      },
    ],
    capabilityNeeds: [
      {
        id: "newsletter-builder",
        title: "Newsletter / campaign builder",
        description: "Compose and schedule recurring sends.",
        priority: "must",
        href: "/capabilities/newsletter-builder/",
      },
      {
        id: "templates",
        title: "Email templates",
        description: "Reusable layouts for weekly production.",
        priority: "must",
        href: "/capabilities/email-templates/",
      },
      {
        id: "contacts",
        title: "Subscriber management",
        description: "Lists, profiles, and suppression controls.",
        priority: "must",
      },
      {
        id: "analytics",
        title: "Campaign analytics",
        description: "Opens, clicks, and delivery reporting.",
        priority: "must",
        href: "/capabilities/analytics/",
      },
      {
        id: "automation",
        title: "Light automation",
        description: "Welcome series or drip — nice if newsletter is primary.",
        priority: "nice",
        href: "/capabilities/automation-workflows/",
      },
    ],
    workflowSteps: [
      {
        id: "grow",
        label: "Grow & clean list",
        detail: "Capture subscribers with consent; suppress unsubscribes.",
        goal: "A permission-based list you can send to safely.",
      },
      {
        id: "compose",
        label: "Compose",
        detail: "Build from a template; keep brand assets consistent.",
        goal: "A draft ready for review without redesigning from zero.",
      },
      {
        id: "segment",
        label: "Segment",
        detail: "Choose the audience slice — not always the full list.",
        goal: "Relevance over maximum reach.",
      },
      {
        id: "send",
        label: "Schedule & send",
        detail: "Authenticate domain; schedule; confirm seed checks.",
        goal: "On-time delivery with basic deliverability hygiene.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Check opens, clicks, unsubscribes; note what to improve.",
        goal: "One learning for the next issue.",
      },
    ],
    priorities: [
      {
        id: "templates",
        title: "Template discipline",
        description: "Reusable layouts beat one-off designs.",
        icon: "layout",
      },
      {
        id: "hygiene",
        title: "List hygiene",
        description: "Suppression and bounce handling protect reputation.",
        icon: "shield",
      },
      {
        id: "cadence",
        title: "Cadence reliability",
        description: "Scheduling the team can keep every week.",
        icon: "calendar",
      },
    ],
    scenarios: [
      {
        id: "creator",
        title: "Creator newsletter",
        bestWhen: "One editorial voice, weekly cadence, simple monetization links.",
      },
      {
        id: "smb",
        title: "SMB promo newsletter",
        bestWhen: "Offers and updates to an existing customer/subscriber list.",
      },
      {
        id: "agency",
        title: "Agency multi-brand",
        bestWhen: "Multiple clients need template systems and clear send ownership.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm newsletter is the primary job",
        description: "If journeys dominate, evaluate automation-led ESPs instead.",
        href: "/guides/how-to-choose-email-marketing/",
      },
      {
        step: 2,
        title: "Estimate contact tier",
        description: "Same list-size assumption for every quote.",
        href: "/guides/email-marketing-pricing-guide/",
      },
      {
        step: 3,
        title: "Trial one real issue",
        description: "Build and send a sample newsletter on the target plan.",
        href: "/guides/email-marketing-evaluation-guide/",
      },
      {
        step: 4,
        title: "Shortlist researched ESPs",
        href: "/best/email-marketing-software/",
        ctaLabel: "Best email marketing →",
      },
    ],
    heroVisual: {
      src: "/use-cases/newsletters-hero.png",
      alt: "Educational diagram of newsletter email marketing: template, schedule, send, and review on a permission-based list.",
      caption: "Newsletters succeed when templates and list hygiene make cadence sustainable.",
    },
    needsVisual: {
      src: "/use-cases/newsletters-needs.png",
      alt: "Diagram mapping newsletter pains — redesign tax, inbox sends, list drift, no analytics — to ESP fixes.",
      caption: "What usually breaks in newsletter programs — and how an ESP addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/newsletters-workflow.png",
      alt: "Five-step newsletter workflow: grow, compose, segment, send, review.",
      caption: "A practical newsletter loop from list hygiene to weekly learning.",
    },
    faq: [
      {
        question: "Is a newsletter tool enough, or do I need full automation?",
        answer:
          "If your primary job is recurring editorial or promo sends, prioritize templates and list hygiene. Add automation when welcome series or nurture paths become blocking — not because the homepage lists journeys.",
      },
      {
        question: "How is this different from CRM email?",
        answer:
          "CRM email usually logs sales conversations on records. Newsletter ESPs are built for permission-based broadcasts, templates, and campaign analytics at list scale.",
      },
    ],
    relatedUseCaseSlugs: [
      "small-business-campaigns",
      "lead-nurturing",
      "marketing-automation",
      "ecommerce-email",
    ],
    featuredGuideHrefs: [
      "/guides/what-is-email-marketing/",
      "/guides/how-to-choose-email-marketing/",
      "/guides/email-marketing-pricing-guide/",
      "/best/email-marketing-software/",
    ],
  },

  "marketing-automation": {
    ...EM_CTAS,
    displayTitle: "Email marketing automation",
    badgeLabel: "Marketing automation",
    tagline:
      "Run multi-step permission-based journeys triggered by subscriber behavior — not one-off blasts.",
    overview:
      "Marketing automation in the email marketing sense means multi-step workflows centered on email: welcome series, nurture paths, and behavioral triggers for opted-in subscribers. This hub scopes the ESP automation job — not a full multi-channel MAP or CRM sales sequencing.",
    whoThisIsFor:
      "Marketing-led SMBs and growth teams that need journeys beyond a newsletter calendar. You already have (or can grow) a permission-based list and need triggers, branching, and follow-ups that do not depend on someone remembering to send.",
    whatMattersIntro:
      "Evaluate trigger types, branching, plan-tier workflow limits, and how automations interact with your CRM or store — not the total number of recipe templates on a marketing site.",
    workedExample:
      "Worked example: a B2B SaaS trial team. Before automation, trial users got a manual email sequence from a spreadsheet. After ESP automation, signup triggers a welcome path with branching on product usage tags — marketers review the journey weekly instead of chasing individual sends.",
    workedExampleSecondary:
      "Worked example: an ecommerce brand recovering abandoned carts. Event triggers and timing rules live in the ESP; store order data remains the commerce system of record.",
    glance: {
      primaryGoal: "Reliable multi-step email journeys on opted-in contacts",
      typicalTeam: "Marketing-led SMBs and growth marketers",
      commonPriorities: [
        "Triggers & branching",
        "Plan workflow limits",
        "Segmentation",
        "CRM / shop sync",
        "Journey analytics",
      ],
    },
    challenges: [
      {
        id: "manual-nurture",
        title: "Nurture depends on memory",
        pain: "Leads go cold because follow-ups are manual.",
        crmHelps:
          "Event-triggered workflows send the next step without inbox babysitting.",
      },
      {
        id: "plan-gates",
        title: "Demo used a higher automation tier",
        pain: "The journey that sold you is locked behind an upgrade.",
        crmHelps:
          "Test must-have workflows on the plan you will buy.",
      },
      {
        id: "segment-blind",
        title: "Everyone gets the same path",
        pain: "Irrelevant messages drive unsubscribes.",
        crmHelps:
          "Segmentation and branching keep journeys relevant.",
      },
      {
        id: "stack-split",
        title: "ESP and CRM disagree on lifecycle",
        pain: "Tags and stages drift between systems.",
        crmHelps:
          "Written sync rules and owners keep lifecycle fields consistent.",
      },
    ],
    outcomes: [
      {
        id: "always-on",
        title: "Always-on nurture paths",
        description: "Triggered journeys replace spreadsheet follow-ups.",
      },
      {
        id: "relevant",
        title: "More relevant messaging",
        description: "Branching and segments reduce one-size-fits-all sends.",
      },
      {
        id: "measurable",
        title: "Journey-level measurement",
        description: "See where paths convert or drop off.",
      },
      {
        id: "scalable",
        title: "Scale without headcount",
        description: "Volume grows without proportional manual sends.",
      },
    ],
    capabilityNeeds: [
      {
        id: "automation-workflows",
        title: "Automation workflows",
        description: "Multi-step triggers, actions, and branching.",
        priority: "must",
        href: "/capabilities/automation-workflows/",
      },
      {
        id: "segmentation",
        title: "Segmentation",
        description: "Attribute and behavior segments for path entry.",
        priority: "must",
        href: "/capabilities/segmentation/",
      },
      {
        id: "analytics",
        title: "Journey / campaign analytics",
        description: "See conversion and drop-off signals.",
        priority: "must",
        href: "/capabilities/analytics/",
      },
      {
        id: "campaigns",
        title: "Email campaigns",
        description: "Broadcasts still matter alongside journeys.",
        priority: "must",
        href: "/capabilities/email-campaigns/",
      },
      {
        id: "ai",
        title: "AI content assistance",
        description: "Optional subject/body help — not the buy reason.",
        priority: "nice",
        href: "/capabilities/ai-content-generation/",
      },
    ],
    workflowSteps: [
      {
        id: "map",
        label: "Map the journey",
        detail: "Write trigger, branches, and exit criteria before building.",
        goal: "One clear path tied to a business outcome.",
      },
      {
        id: "data",
        label: "Connect data",
        detail: "Ensure tags/events from forms, CRM, or shop are available.",
        goal: "Triggers fire on real subscriber events.",
      },
      {
        id: "build",
        label: "Build on target plan",
        detail: "Create the workflow on the plan you will purchase.",
        goal: "No surprise feature gates after go-live.",
      },
      {
        id: "test",
        label: "Test",
        detail: "Walk test contacts through each branch.",
        goal: "Catch broken links and wrong waits before launch.",
      },
      {
        id: "operate",
        label: "Operate",
        detail: "Review journey analytics weekly; pause underperformers.",
        goal: "Continuous improvement without rebuild chaos.",
      },
    ],
    priorities: [
      {
        id: "triggers",
        title: "Trigger coverage",
        description: "Events you actually generate must be supported.",
        icon: "zap",
      },
      {
        id: "limits",
        title: "Plan limits",
        description: "Active workflows and branching on your tier.",
        icon: "gauge",
      },
      {
        id: "sync",
        title: "Stack sync",
        description: "CRM/shop fields stay trustworthy.",
        icon: "link",
      },
    ],
    scenarios: [
      {
        id: "welcome",
        title: "Welcome / onboarding",
        bestWhen: "New subscribers need a defined first-week path.",
      },
      {
        id: "nurture",
        title: "Lead nurture",
        bestWhen: "Longer consideration cycles need drip + branching.",
      },
      {
        id: "lifecycle",
        title: "Lifecycle ecommerce",
        bestWhen: "Cart, browse, and post-purchase events drive revenue email.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "List must-have triggers",
        description: "If the ESP cannot fire on your events, stop.",
        href: "/guides/email-marketing-requirements-guide/",
      },
      {
        step: 2,
        title: "Map the qualifying plan",
        href: "/guides/email-marketing-pricing-guide/",
      },
      {
        step: 3,
        title: "Trial the journey",
        href: "/guides/email-marketing-evaluation-guide/",
      },
      {
        step: 4,
        title: "Compare researched ESPs",
        href: "/best/email-marketing-software/",
        ctaLabel: "Best email marketing →",
      },
    ],
    heroVisual: {
      src: "/use-cases/marketing-automation-hero.png",
      alt: "Educational diagram of email marketing automation: trigger, branch, wait, send, measure.",
      caption: "Email-centered marketing automation is a journey engine for opted-in subscribers.",
    },
    needsVisual: {
      src: "/use-cases/marketing-automation-needs.png",
      alt: "Diagram mapping automation pains — manual nurture, plan gates, segment blindness, stack drift — to ESP fixes.",
      caption: "What usually breaks in email automation programs — and how to evaluate for it.",
    },
    workflowVisual: {
      src: "/use-cases/marketing-automation-workflow.png",
      alt: "Five-step marketing automation workflow: map, connect data, build, test, operate.",
      caption: "Build journeys on the plan you will buy — then operate from analytics.",
    },
    faq: [
      {
        question: "Is this the same as CRM marketing automation?",
        answer:
          "Related but not identical. This hub covers email-centered journeys in an ESP. Full CRM/MAP suites may add ads, multi-channel orchestration, and deeper CRM objects — evaluate those only if that is your primary job.",
      },
      {
        question: "Do I need automation if I only send newsletters?",
        answer:
          "Not necessarily. Start with campaigns and templates; add automation when welcome or nurture paths become the blocking job.",
      },
    ],
    relatedUseCaseSlugs: [
      "lead-nurturing",
      "ecommerce-email",
      "newsletters",
      "small-business-campaigns",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-email-marketing/",
      "/guides/email-marketing-requirements-guide/",
      "/guides/email-marketing-evaluation-guide/",
      "/best/email-marketing-software/",
    ],
  },

  "ecommerce-email": {
    ...EM_CTAS,
    displayTitle: "Email marketing for Ecommerce",
    badgeLabel: "Ecommerce email",
    tagline:
      "Turn store events into permission-based journeys — cart recovery, post-purchase, and promos — without replacing your commerce platform.",
    overview:
      "Ecommerce email is the ESP job of using store and catalog data to send relevant campaigns and automations to subscribers and customers. The commerce platform remains the order system of record; the ESP owns messaging, journeys, and campaign measurement.",
    whoThisIsFor:
      "DTC brands, ecommerce marketers, and SMB stores that need revenue email beyond a generic newsletter. You have (or will have) store events and want cart, browse, and lifecycle messaging tied to permission-based contacts.",
    whatMattersIntro:
      "Prioritize ecommerce integrations, product/cart triggers, and revenue reporting hooks — not generic template beauty alone.",
    workedExample:
      "Worked example: Northline Goods on Shopify. Before ecommerce email tooling, abandoned carts got a single manual reminder. After ESP + store sync, cart and post-purchase journeys run automatically while orders stay in Shopify.",
    workedExampleSecondary:
      "Worked example: a wholesale-plus-DTC brand. Segmented promo campaigns target VIP buyers without blasting the full list — reducing unsubscribes during sale weeks.",
    glance: {
      primaryGoal: "Revenue-relevant email tied to store events and segments",
      typicalTeam: "Ecommerce marketers and DTC operators",
      commonPriorities: [
        "Store integration",
        "Cart / browse triggers",
        "Product blocks",
        "Revenue attribution signals",
        "List hygiene at volume",
      ],
    },
    challenges: [
      {
        id: "no-events",
        title: "Store events never reach email",
        pain: "Cart and purchase data stay trapped in the commerce admin.",
        crmHelps:
          "Native or reliable ecommerce integrations feed triggers and segments.",
      },
      {
        id: "generic-blasts",
        title: "Everyone gets the same promo",
        pain: "Sale blasts ignore purchase history and drive unsubscribes.",
        crmHelps:
          "Segments and product blocks personalize offers responsibly.",
      },
      {
        id: "split-truth",
        title: "Revenue numbers disagree",
        pain: "ESP and store report different conversion stories.",
        crmHelps:
          "Agree which system owns order truth; use ESP for messaging metrics.",
      },
      {
        id: "deliverability-volume",
        title: "Promo volume hurts inbox placement",
        pain: "Heavy campaigns without hygiene damage the domain.",
        crmHelps:
          "Engagement segments and auth tooling protect sending reputation.",
      },
    ],
    outcomes: [
      {
        id: "recovery",
        title: "Automated recovery journeys",
        description: "Cart and browse paths run without manual reminders.",
      },
      {
        id: "relevance",
        title: "More relevant promos",
        description: "Segments reduce spray-and-pray blasts.",
      },
      {
        id: "lifecycle",
        title: "Post-purchase lifecycle coverage",
        description: "Onboarding and replenishment paths become standard.",
      },
      {
        id: "clarity",
        title: "Clearer channel measurement",
        description: "Teams know which journeys deserve budget and attention.",
      },
    ],
    capabilityNeeds: [
      {
        id: "automation-workflows",
        title: "Automation workflows",
        description: "Cart, browse, and post-purchase journeys.",
        priority: "must",
        href: "/capabilities/automation-workflows/",
      },
      {
        id: "segmentation",
        title: "Segmentation",
        description: "Purchase and engagement-based audiences.",
        priority: "must",
        href: "/capabilities/segmentation/",
      },
      {
        id: "campaigns",
        title: "Email campaigns",
        description: "Promo and seasonal broadcasts.",
        priority: "must",
        href: "/capabilities/email-campaigns/",
      },
      {
        id: "analytics",
        title: "Analytics",
        description: "Campaign and journey performance reporting.",
        priority: "must",
        href: "/capabilities/analytics/",
      },
      {
        id: "landing-pages",
        title: "Landing pages",
        description: "Useful for list growth and campaign destinations.",
        priority: "nice",
        href: "/capabilities/landing-pages/",
      },
    ],
    workflowSteps: [
      {
        id: "connect",
        label: "Connect store",
        detail: "Sync contacts, products, and key events securely.",
        goal: "ESP can see cart and purchase signals.",
      },
      {
        id: "journeys",
        label: "Launch core journeys",
        detail: "Cart, browse, welcome, post-purchase — start with few.",
        goal: "Always-on revenue paths without sprawl.",
      },
      {
        id: "campaigns",
        label: "Plan campaigns",
        detail: "Segment promos; avoid full-list blasts by default.",
        goal: "Seasonal sends that respect engagement.",
      },
      {
        id: "hygiene",
        label: "Protect deliverability",
        detail: "Auth domains; suppress cold contacts before big sends.",
        goal: "Inbox placement survives promo spikes.",
      },
      {
        id: "review",
        label: "Review revenue email",
        detail: "Weekly look at journey and campaign contribution.",
        goal: "Double down on what converts; pause what does not.",
      },
    ],
    priorities: [
      {
        id: "integration",
        title: "Commerce integration quality",
        description: "Events and catalog must be trustworthy.",
        icon: "store",
      },
      {
        id: "journeys",
        title: "Core journey coverage",
        description: "Cart and post-purchase before exotic flows.",
        icon: "workflow",
      },
      {
        id: "hygiene",
        title: "Volume hygiene",
        description: "Engagement segments protect the domain.",
        icon: "shield",
      },
    ],
    scenarios: [
      {
        id: "dtc",
        title: "DTC Shopify / similar",
        bestWhen: "Native or proven store connectors exist for your platform.",
      },
      {
        id: "promo",
        title: "Promo-heavy calendar",
        bestWhen: "You need segmented campaigns plus recovery journeys.",
      },
      {
        id: "hybrid",
        title: "Wholesale + DTC",
        bestWhen: "Different segments need different messaging rules.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "List required store events",
        href: "/guides/email-marketing-requirements-guide/",
      },
      {
        step: 2,
        title: "Check contact-tier economics at your volume",
        href: "/guides/email-marketing-pricing-guide/",
      },
      {
        step: 3,
        title: "Trial cart journey on target plan",
        href: "/guides/email-marketing-evaluation-guide/",
      },
      {
        step: 4,
        title: "Shortlist ESPs",
        href: "/best/email-marketing-software/",
        ctaLabel: "Best email marketing →",
      },
    ],
    heroVisual: {
      src: "/use-cases/ecommerce-email-hero.png",
      alt: "Educational diagram of ecommerce email: store events feeding cart recovery and promo campaigns in an ESP.",
      caption: "Ecommerce email connects store events to permission-based journeys — commerce still owns orders.",
    },
    needsVisual: {
      src: "/use-cases/ecommerce-email-needs.png",
      alt: "Diagram mapping ecommerce email pains — missing events, generic blasts, revenue mismatch, volume damage — to ESP fixes.",
      caption: "What usually breaks in ecommerce email — and how to evaluate integrations first.",
    },
    workflowVisual: {
      src: "/use-cases/ecommerce-email-workflow.png",
      alt: "Five-step ecommerce email workflow: connect store, launch journeys, plan campaigns, protect deliverability, review.",
      caption: "A practical ecommerce email loop from store sync to weekly revenue review.",
    },
    faq: [
      {
        question: "Can my ecommerce platform replace an ESP?",
        answer:
          "Built-in store email can be enough early on. Teams usually move to an ESP when journeys, segmentation, and deliverability tooling outgrow native mail — while keeping the store as order system of record.",
      },
      {
        question: "Which journeys should we launch first?",
        answer:
          "Start with welcome, abandoned cart, and post-purchase. Add browse and win-back after those are stable.",
      },
    ],
    relatedUseCaseSlugs: [
      "marketing-automation",
      "newsletters",
      "small-business-campaigns",
      "lead-nurturing",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-email-marketing/",
      "/guides/email-marketing-pricing-guide/",
      "/best/email-marketing-software/",
      "/categories/email-marketing/",
    ],
  },

  "lead-nurturing": {
    ...EM_CTAS,
    displayTitle: "Email marketing for Lead nurturing",
    badgeLabel: "Lead nurturing",
    tagline:
      "Move opted-in leads through education and trust-building emails until they are ready for sales or purchase — without cold outreach tactics.",
    overview:
      "Lead nurturing via email marketing uses permission-based drips and behavioral journeys to educate and qualify interested contacts. It is not cold outbound sequencing; contacts typically enter through forms, content, or trials with a lawful basis to message them.",
    whoThisIsFor:
      "B2B marketers, course creators, and SMB teams with inbound or trial-led demand. You have leads who opted in but are not ready to buy today — and manual follow-up does not scale.",
    whatMattersIntro:
      "Prioritize journey building, segmentation, and CRM handoff clarity — not spray volume. Nurture fails when messaging ignores consent or dumps unqualified contacts on sales.",
    workedExample:
      "Worked example: a B2B services firm offering a guide download. Before nurture automation, leads sat in a spreadsheet. After ESP journeys, downloaders enter a three-email education path; high engagers sync to CRM for sales follow-up.",
    workedExampleSecondary:
      "Worked example: a SaaS trial nurture. Product events tag the contact; the ESP branches messaging for activated vs idle trials without SDRs writing one-off emails.",
    glance: {
      primaryGoal: "Permission-based nurture paths that hand off ready leads cleanly",
      typicalTeam: "B2B marketers, growth, and founder-led sales assists",
      commonPriorities: [
        "Form / trial capture",
        "Drip & branching",
        "Engagement segments",
        "CRM handoff rules",
        "Content relevance",
      ],
    },
    challenges: [
      {
        id: "spreadsheet-drip",
        title: "Nurture lives in a spreadsheet",
        pain: "Follow-ups are inconsistent and unmeasured.",
        crmHelps:
          "Automated drips with clear entry/exit keep cadence honest.",
      },
      {
        id: "sales-dump",
        title: "Every lead is dumped on sales",
        pain: "Reps waste time on unready contacts.",
        crmHelps:
          "Engagement thresholds and handoff rules protect sales time.",
      },
      {
        id: "irrelevant",
        title: "Content ignores buyer stage",
        pain: "Early leads get pricing pushes and unsubscribe.",
        crmHelps:
          "Branching and segments match message to stage.",
      },
      {
        id: "consent-blur",
        title: "Nurture mixed with cold outreach",
        pain: "Compliance and brand trust both suffer.",
        crmHelps:
          "Keep ESP nurture on opted-in lists; use SI tools for cold prospecting.",
      },
    ],
    outcomes: [
      {
        id: "consistent",
        title: "Consistent nurture cadence",
        description: "Every qualified opt-in gets the path — not lucky timing.",
      },
      {
        id: "handoff",
        title: "Cleaner sales handoffs",
        description: "Only engaged leads reach reps, with context.",
      },
      {
        id: "learning",
        title: "Content learning loop",
        description: "See which messages move people forward.",
      },
      {
        id: "trust",
        title: "Stronger consent posture",
        description: "Nurture stays inside permission-based rules.",
      },
    ],
    capabilityNeeds: [
      {
        id: "automation-workflows",
        title: "Automation workflows",
        description: "Drips, waits, and branching by engagement.",
        priority: "must",
        href: "/capabilities/automation-workflows/",
      },
      {
        id: "segmentation",
        title: "Segmentation",
        description: "Stage and engagement audiences.",
        priority: "must",
        href: "/capabilities/segmentation/",
      },
      {
        id: "landing-pages",
        title: "Landing pages / forms",
        description: "Capture opt-ins that start nurture.",
        priority: "must",
        href: "/capabilities/landing-pages/",
      },
      {
        id: "analytics",
        title: "Analytics",
        description: "Path performance and engagement signals.",
        priority: "must",
        href: "/capabilities/analytics/",
      },
      {
        id: "campaigns",
        title: "Email campaigns",
        description: "Occasional broadcasts to nurture audiences.",
        priority: "nice",
        href: "/capabilities/email-campaigns/",
      },
    ],
    workflowSteps: [
      {
        id: "define",
        label: "Define ready",
        detail: "Write what engagement means before sales handoff.",
        goal: "A shared definition of a sales-ready lead.",
      },
      {
        id: "capture",
        label: "Capture",
        detail: "Forms/landing pages with clear consent language.",
        goal: "Lawful, tagged entries into nurture.",
      },
      {
        id: "nurture",
        label: "Nurture",
        detail: "Run the drip/journey with branching.",
        goal: "Education before hard sell.",
      },
      {
        id: "handoff",
        label: "Hand off",
        detail: "Sync engaged leads to CRM with context.",
        goal: "Sales sees why the lead is warm.",
      },
      {
        id: "improve",
        label: "Improve",
        detail: "Review drop-offs; refresh underperforming emails.",
        goal: "Nurture quality rises monthly.",
      },
    ],
    priorities: [
      {
        id: "consent",
        title: "Consent clarity",
        description: "Nurture stays permission-based.",
        icon: "shield",
      },
      {
        id: "stage",
        title: "Stage-aware content",
        description: "Branching beats one long blast sequence.",
        icon: "git-branch",
      },
      {
        id: "handoff",
        title: "CRM handoff rules",
        description: "Sales gets context, not a dump.",
        icon: "users",
      },
    ],
    scenarios: [
      {
        id: "content",
        title: "Content-led inbound",
        bestWhen: "Downloads and webinars create opt-in volume.",
      },
      {
        id: "trial",
        title: "Product trial nurture",
        bestWhen: "Product events can tag activated vs idle users.",
      },
      {
        id: "services",
        title: "Services consideration",
        bestWhen: "Longer B2B cycles need education before outreach.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Write handoff definition",
        href: "/guides/email-marketing-requirements-guide/",
      },
      {
        step: 2,
        title: "Choose automation depth",
        href: "/guides/how-to-choose-email-marketing/",
      },
      {
        step: 3,
        title: "Trial one nurture path",
        href: "/guides/email-marketing-evaluation-guide/",
      },
      {
        step: 4,
        title: "Shortlist ESPs",
        href: "/best/email-marketing-software/",
        ctaLabel: "Best email marketing →",
      },
    ],
    heroVisual: {
      src: "/use-cases/lead-nurturing-hero.png",
      alt: "Educational diagram of email lead nurturing: capture, drip, engage, hand off to CRM.",
      caption: "Lead nurturing email builds trust on opted-in contacts before sales handoff.",
    },
    needsVisual: {
      src: "/use-cases/lead-nurturing-needs.png",
      alt: "Diagram mapping lead-nurturing pains — spreadsheet drips, sales dumps, irrelevant content, consent blur — to ESP fixes.",
      caption: "What usually breaks in nurture programs — and how ESP journeys help.",
    },
    workflowVisual: {
      src: "/use-cases/lead-nurturing-workflow.png",
      alt: "Five-step lead nurturing workflow: define ready, capture, nurture, hand off, improve.",
      caption: "A practical nurture loop from consent capture to sales-ready handoff.",
    },
    faq: [
      {
        question: "Is lead nurturing the same as cold email outreach?",
        answer:
          "No. Nurture assumes permission-based contacts from forms, trials, or other lawful opt-ins. Cold outreach to strangers belongs in sales intelligence / sequencing tools.",
      },
      {
        question: "How long should a nurture path be?",
        answer:
          "Long enough to educate, short enough to measure. Start with 3–7 emails, define exit criteria, and expand only after you see where people drop off.",
      },
    ],
    relatedUseCaseSlugs: [
      "marketing-automation",
      "newsletters",
      "small-business-campaigns",
      "ecommerce-email",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-email-marketing/",
      "/guides/email-marketing-requirements-guide/",
      "/guides/what-is-email-marketing/",
      "/best/email-marketing-software/",
    ],
  },

  "small-business-campaigns": {
    ...EM_CTAS,
    displayTitle: "Email marketing for Small-business campaigns",
    badgeLabel: "Small-business campaigns",
    tagline:
      "Run straightforward promo and update campaigns your small team will actually ship — without enterprise marketing complexity.",
    overview:
      "Small-business campaigns are the ESP job of sending clear, permission-based promotional and update emails with light automation when needed. Fit prioritizes ease of use, fair contact-tier pricing, and templates — not enterprise orchestration.",
    whoThisIsFor:
      "Owner-led companies and small marketing pairs (roughly 1–10 people) who need email that ships weekly without a dedicated RevOps or marketing-ops function.",
    whatMattersIntro:
      "Prioritize ease of use, templates, contact-tier clarity, and a short list of must-have automations — not the longest feature checklist.",
    workedExample:
      "Worked example: a local services business with one marketer. Before an ESP, promos went from Outlook to a pasted list. After an ESP, monthly offers use a template, unsubscribes are handled, and results show in one dashboard.",
    workedExampleSecondary:
      "Worked example: a two-person ecommerce side brand. They need simple campaigns plus one cart reminder — not a 40-step journey builder on day one.",
    glance: {
      primaryGoal: "Campaigns the small team can ship consistently",
      typicalTeam: "Owners, solo marketers, small SMB teams",
      commonPriorities: [
        "Ease of use",
        "Templates",
        "Clear contact pricing",
        "Basic automation",
        "Simple analytics",
      ],
    },
    challenges: [
      {
        id: "too-complex",
        title: "Tools feel built for enterprises",
        pain: "Setup time kills momentum before the first send.",
        crmHelps:
          "Approachable editors and templates get the first campaign out fast.",
      },
      {
        id: "price-surprise",
        title: "Contact tiers jump unexpectedly",
        pain: "A growing list forces upgrades mid-quarter.",
        crmHelps:
          "Model contact growth before you commit; read published tiers.",
      },
      {
        id: "inconsistent",
        title: "Campaigns only happen when someone has spare time",
        pain: "No cadence, no learning loop.",
        crmHelps:
          "Scheduling and light automations keep a minimum rhythm.",
      },
      {
        id: "no-unsub",
        title: "List management is informal",
        pain: "Replies and removals live in personal inboxes.",
        crmHelps:
          "Subscriber tools and compliance basics protect the brand.",
      },
    ],
    outcomes: [
      {
        id: "ship",
        title: "Campaigns that actually ship",
        description: "Low friction from idea to send.",
      },
      {
        id: "predictable-cost",
        title: "More predictable email cost",
        description: "Contact tiers understood before growth spikes.",
      },
      {
        id: "basics",
        title: "Hygiene and unsubscribes handled",
        description: "Professional baseline without a big team.",
      },
      {
        id: "learning",
        title: "Simple performance learning",
        description: "Know which offers resonated.",
      },
    ],
    capabilityNeeds: [
      {
        id: "email-campaigns",
        title: "Email campaigns",
        description: "Create and send promo/update emails.",
        priority: "must",
        href: "/capabilities/email-campaigns/",
      },
      {
        id: "templates",
        title: "Email templates",
        description: "Fast composition without a designer on staff.",
        priority: "must",
        href: "/capabilities/email-templates/",
      },
      {
        id: "contacts",
        title: "Contact management",
        description: "Lists and suppression for a small team.",
        priority: "must",
      },
      {
        id: "analytics",
        title: "Analytics",
        description: "Enough reporting for weekly decisions.",
        priority: "must",
        href: "/capabilities/analytics/",
      },
      {
        id: "automation",
        title: "Light automation",
        description: "Welcome or reminder paths when needed.",
        priority: "nice",
        href: "/capabilities/automation-workflows/",
      },
    ],
    workflowSteps: [
      {
        id: "pick",
        label: "Pick one offer",
        detail: "One clear campaign goal per send.",
        goal: "Avoid multi-message confusion.",
      },
      {
        id: "build",
        label: "Build from template",
        detail: "Reuse layout; swap offer and CTA.",
        goal: "Ship in hours, not days.",
      },
      {
        id: "audience",
        label: "Choose audience",
        detail: "Segment when possible; suppress cold contacts.",
        goal: "Relevance over maximum list size.",
      },
      {
        id: "send",
        label: "Send & monitor",
        detail: "Schedule; watch bounces and unsubscribes.",
        goal: "Protect domain while learning.",
      },
      {
        id: "note",
        label: "Note one learning",
        detail: "Record what to try next time.",
        goal: "Improve without a full analytics team.",
      },
    ],
    priorities: [
      {
        id: "ease",
        title: "Ease of use",
        description: "If the owner cannot send, the tool fails.",
        icon: "smile",
      },
      {
        id: "price",
        title: "Transparent contact tiers",
        description: "No surprise jumps at your growth band.",
        icon: "tag",
      },
      {
        id: "enough",
        title: "Enough — not everything",
        description: "Templates + campaigns beat unused enterprise features.",
        icon: "check",
      },
    ],
    scenarios: [
      {
        id: "local",
        title: "Local / services SMB",
        bestWhen: "Monthly offers and updates to a modest list.",
      },
      {
        id: "creator-smb",
        title: "Creator-led small brand",
        bestWhen: "Newsletter plus occasional promo campaigns.",
      },
      {
        id: "lite-ecom",
        title: "Light ecommerce",
        bestWhen: "Campaigns plus one or two simple automations.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Keep must-haves short",
        href: "/guides/email-marketing-requirements-guide/",
      },
      {
        step: 2,
        title: "Check freemium vs paid tiers",
        href: "/guides/email-marketing-pricing-guide/",
      },
      {
        step: 3,
        title: "Trial one real campaign",
        href: "/guides/email-marketing-evaluation-guide/",
      },
      {
        step: 4,
        title: "Shortlist ESPs",
        href: "/best/email-marketing-software/",
        ctaLabel: "Best email marketing →",
      },
    ],
    heroVisual: {
      src: "/use-cases/small-business-campaigns-hero.png",
      alt: "Educational diagram of small-business email campaigns: simple template, audience, send, learn.",
      caption: "SMB campaigns win on ease and cadence — not enterprise feature count.",
    },
    needsVisual: {
      src: "/use-cases/small-business-campaigns-needs.png",
      alt: "Diagram mapping SMB campaign pains — complexity, price jumps, inconsistent sends, informal lists — to ESP fixes.",
      caption: "What usually blocks small-business email — and how to buy for simplicity.",
    },
    workflowVisual: {
      src: "/use-cases/small-business-campaigns-workflow.png",
      alt: "Five-step SMB campaign workflow: pick offer, build, audience, send, note learning.",
      caption: "A practical small-business campaign loop that fits a lean team.",
    },
    faq: [
      {
        question: "Should a small business buy the most powerful ESP?",
        answer:
          "Usually no. Buy the simplest tool that covers campaigns, templates, list hygiene, and any must-have automation on a contact tier you can afford as you grow.",
      },
      {
        question: "Is a free plan enough?",
        answer:
          "Free plans are fine for learning and tiny lists. Check send caps and automation locks before you build a program that cannot grow.",
      },
    ],
    relatedUseCaseSlugs: [
      "newsletters",
      "ecommerce-email",
      "lead-nurturing",
      "marketing-automation",
    ],
    featuredGuideHrefs: [
      "/guides/what-is-email-marketing/",
      "/guides/how-to-choose-email-marketing/",
      "/guides/email-marketing-pricing-guide/",
      "/best/email-marketing-software/",
    ],
  },
};
