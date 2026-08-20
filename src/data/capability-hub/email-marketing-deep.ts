import type { CapabilityHubProfile } from "@/domain";

type Depth = Pick<
  CapabilityHubProfile,
  | "displayTitle"
  | "badgeLabel"
  | "tagline"
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "glance"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "priorities"
  | "scenarios"
  | "buyingFramework"
  | "buyingGuideHref"
  | "faq"
  | "heroVisual"
  | "needsVisual"
  | "workflowVisual"
  | "relatedCapabilitySlugs"
  | "relatedUseCaseSlugs"
  | "relatedRequirementSlugs"
  | "relatedFeatureSlugs"
  | "featuredGuideHrefs"
  | "categorySlug"
>;

const NO_UNIVERSAL =
  "No. Fit depends on your primary email job, list size, and which requirements are must-haves. Use the Best Email Marketing shortlist and requirements guide rather than starting from a single ranking.";

const EM_META = {
  categorySlug: "email-marketing" as const,
  buyingGuideHref: "/guides/how-to-choose-email-marketing/",
};

function emCap(args: {
  slug: string;
  title: string;
  badge: string;
  tagline: string;
  overview: string;
  who: string;
  matters: string;
  example: string;
  example2: string;
  goal: string;
  priorities: string[];
  challenges: Array<{ id: string; title: string; pain: string; help: string }>;
  outcomes: Array<{ id: string; title: string; description: string }>;
  needs: Array<{
    id: string;
    title: string;
    description: string;
    priority: "must" | "nice";
    href?: string;
  }>;
  steps: Array<{ id: string; label: string; detail: string }>;
  relatedCaps: string[];
  relatedUse: string[];
  featureSlug: string;
}): Depth {
  return {
    ...EM_META,
    displayTitle: `Email marketing ${args.title} capability`,
    badgeLabel: args.badge,
    tagline: args.tagline,
    overview: args.overview,
    whoThisIsFor: args.who,
    whatMattersIntro: args.matters,
    workedExample: args.example,
    workedExampleSecondary: args.example2,
    glance: {
      primaryGoal: args.goal,
      typicalTeam: "Marketers, creators, and SMB operators running permission-based email",
      commonPriorities: args.priorities,
    },
    challenges: args.challenges.map((c) => ({
      id: c.id,
      title: c.title,
      pain: c.pain,
      crmHelps: c.help,
    })),
    outcomes: args.outcomes,
    capabilityNeeds: args.needs,
    workflowSteps: args.steps,
    priorities: args.priorities.slice(0, 3).map((title, i) => ({
      id: `p-${i}`,
      title,
      description: `${title} as a buying lens for this capability.`,
      icon: "check",
    })),
    scenarios: [
      {
        id: "smb",
        title: "SMB / creator",
        bestWhen: "You need this capability without enterprise complexity.",
      },
      {
        id: "growth",
        title: "Growth marketing",
        bestWhen: "Volume and journey depth make this capability blocking.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm this capability is a must-have",
        href: "/guides/email-marketing-requirements-guide/",
      },
      {
        step: 2,
        title: "Map it to the qualifying plan",
        href: "/guides/email-marketing-pricing-guide/",
      },
      {
        step: 3,
        title: "Test it in a shared trial",
        href: "/guides/email-marketing-evaluation-guide/",
      },
      {
        step: 4,
        title: "Compare researched ESPs",
        href: "/best/email-marketing-software/",
        ctaLabel: "Best email marketing →",
      },
    ],
    faq: [
      {
        question: `Is there one best ESP for ${args.title.toLowerCase()}?`,
        answer: NO_UNIVERSAL,
      },
      {
        question: "How does this relate to CRM capabilities?",
        answer:
          "CRM capabilities often log sales activity on records. Email marketing capabilities support permission-based campaigns and journeys at list scale. Many teams use both connected.",
      },
    ],
    relatedCapabilitySlugs: args.relatedCaps,
    relatedUseCaseSlugs: args.relatedUse,
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: [args.featureSlug],
    featuredGuideHrefs: [
      "/guides/how-to-choose-email-marketing/",
      "/guides/what-is-email-marketing/",
      "/best/email-marketing-software/",
      "/categories/email-marketing/",
    ],
    heroVisual: {
      src: `/capabilities/${args.slug}-hero.png`,
      alt: `Educational diagram of email marketing ${args.title.toLowerCase()} capability.`,
      caption: `${args.title} as buyers should evaluate it in an ESP — not a product endorsement.`,
    },
    needsVisual: {
      src: `/capabilities/${args.slug}-needs.png`,
      alt: `Diagram mapping ${args.title.toLowerCase()} pains to email marketing capability fixes.`,
      caption: `What usually breaks around ${args.title.toLowerCase()} — and how this capability helps.`,
    },
    workflowVisual: {
      src: `/capabilities/${args.slug}-workflow.png`,
      alt: `Workflow diagram for using ${args.title.toLowerCase()} in email marketing.`,
      caption: `A practical operating loop for ${args.title.toLowerCase()}.`,
    },
  };
}

/**
 * Email marketing capability hub depth. Does not overwrite CRM-owned
 * `contact-management` (shared feature slug; CRM hub remains authoritative).
 */
export const emailMarketingCapabilityDepth: Record<string, Depth> = {
  "email-campaigns": emCap({
    slug: "email-campaigns",
    title: "Email campaigns",
    badge: "Campaigns",
    tagline:
      "Create, schedule, and send one-off or calendar campaigns to permission-based segments.",
    overview:
      "Email campaigns are the ESP capability for composing and sending marketing emails to subscriber segments — promos, announcements, and newsletters treated as campaign objects with reporting. This is not personal sales email logging in a CRM.",
    who: "Marketers and operators who need broadcast or scheduled sends with templates and reporting — not only automated journeys.",
    matters:
      "Evaluate editor quality, scheduling, segment targeting, and reporting depth — not how many unused campaign “types” a homepage lists.",
    example:
      "Worked example: a retail brand’s weekend promo. Before campaigns in an ESP, the send was a pasted BCC list. After campaigns, a segmented audience, scheduled send, and click report live in one object.",
    example2:
      "Worked example: a creator launching a product. One campaign to engaged subscribers with a clear CTA beats a multi-tool scramble.",
    goal: "Reliable campaign creation and measurement on opted-in lists",
    priorities: [
      "Editor & templates",
      "Segment targeting",
      "Scheduling",
      "Campaign analytics",
      "Send hygiene",
    ],
    challenges: [
      {
        id: "bcc",
        title: "Sends still leave from personal inboxes",
        pain: "No shared reporting or proper unsubscribes.",
        help: "Campaign objects centralize send, suppression, and results.",
      },
      {
        id: "full-list",
        title: "Every campaign blasts the full list",
        pain: "Relevance drops and unsubscribes rise.",
        help: "Segment targeting keeps broadcasts intentional.",
      },
      {
        id: "no-report",
        title: "Nobody reviews results",
        pain: "The next campaign repeats the same mistakes.",
        help: "Campaign analytics make weekly review possible.",
      },
      {
        id: "auth",
        title: "Domain auth is skipped",
        pain: "Inbox placement suffers before content quality matters.",
        help: "Deliverability tooling and auth guidance sit beside campaigns.",
      },
    ],
    outcomes: [
      {
        id: "ship",
        title: "Campaigns that ship on schedule",
        description: "Composition and scheduling become routine.",
      },
      {
        id: "target",
        title: "More targeted broadcasts",
        description: "Segments replace full-list defaults.",
      },
      {
        id: "learn",
        title: "Learning from each send",
        description: "Shared metrics feed the next campaign.",
      },
      {
        id: "trust",
        title: "Cleaner subscriber trust",
        description: "Unsubscribes and bounces are handled in-product.",
      },
    ],
    needs: [
      {
        id: "templates",
        title: "Templates / editor",
        description: "Fast composition without starting blank.",
        priority: "must",
        href: "/capabilities/email-templates/",
      },
      {
        id: "segmentation",
        title: "Segmentation",
        description: "Audience slices for each campaign.",
        priority: "must",
        href: "/capabilities/segmentation/",
      },
      {
        id: "analytics",
        title: "Analytics",
        description: "Opens, clicks, delivery.",
        priority: "must",
        href: "/capabilities/analytics/",
      },
      {
        id: "deliverability",
        title: "Deliverability aids",
        description: "Auth and reputation support.",
        priority: "nice",
        href: "/capabilities/deliverability-tools/",
      },
    ],
    steps: [
      { id: "goal", label: "Set goal", detail: "One primary CTA per campaign." },
      { id: "audience", label: "Pick audience", detail: "Segment; suppress cold contacts." },
      { id: "build", label: "Build", detail: "Template + proof + links." },
      { id: "send", label: "Schedule / send", detail: "Confirm domain auth status." },
      { id: "review", label: "Review", detail: "Capture one improvement for next time." },
    ],
    relatedCaps: [
      "newsletter-builder",
      "email-templates",
      "segmentation",
      "analytics",
    ],
    relatedUse: ["newsletters", "small-business-campaigns", "ecommerce-email"],
    featureSlug: "email-campaigns",
  }),

  "newsletter-builder": emCap({
    slug: "newsletter-builder",
    title: "Newsletter builder",
    badge: "Newsletters",
    tagline:
      "Compose and schedule recurring newsletters with reusable structure — not a new design every week.",
    overview:
      "Newsletter builder capability covers recurring composition, scheduling, and often template systems tuned for editorial or promo newsletters inside an ESP.",
    who: "Creators and content marketers whose primary cadence is a newsletter.",
    matters:
      "Evaluate reuse, scheduling reliability, and list targeting — not novelty blocks you will never use.",
    example:
      "Worked example: a weekly industry roundup. A saved layout and content blocks cut production from a day to an hour.",
    example2:
      "Worked example: an SMB monthly update. Scheduling and a shared template keep the cadence alive when the owner travels.",
    goal: "Sustainable recurring newsletter production",
    priorities: [
      "Reusable layouts",
      "Scheduling",
      "Content blocks",
      "List targeting",
      "Issue-level analytics",
    ],
    challenges: [
      {
        id: "blank",
        title: "Every issue starts blank",
        pain: "Cadence dies under redesign tax.",
        help: "Saved newsletter structures make weekly production feasible.",
      },
      {
        id: "missed",
        title: "Sends slip when people get busy",
        pain: "No schedule, no owner, no backup.",
        help: "Scheduling and shared drafts keep issues shipping.",
      },
      {
        id: "mixed",
        title: "Newsletter and promo blasts share one messy workflow",
        pain: "Editorial quality and promo urgency collide.",
        help: "Treat newsletters as a first-class recurring object when the product supports it.",
      },
      {
        id: "metrics",
        title: "No issue-over-issue comparison",
        pain: "You cannot tell if the format is working.",
        help: "Analytics tied to recurring sends show trends.",
      },
    ],
    outcomes: [
      {
        id: "cadence",
        title: "A keepable cadence",
        description: "Production time drops enough to stay consistent.",
      },
      {
        id: "quality",
        title: "More consistent quality",
        description: "Layouts stay on-brand week to week.",
      },
      {
        id: "ownership",
        title: "Clearer ownership",
        description: "Drafts and schedules are visible to the team.",
      },
      {
        id: "improve",
        title: "Format improvement over time",
        description: "Issue metrics guide structural changes.",
      },
    ],
    needs: [
      {
        id: "templates",
        title: "Templates",
        description: "Reusable newsletter frames.",
        priority: "must",
        href: "/capabilities/email-templates/",
      },
      {
        id: "campaigns",
        title: "Campaign send",
        description: "Delivery and scheduling primitives.",
        priority: "must",
        href: "/capabilities/email-campaigns/",
      },
      {
        id: "analytics",
        title: "Analytics",
        description: "Per-issue performance.",
        priority: "must",
        href: "/capabilities/analytics/",
      },
      {
        id: "automation",
        title: "Welcome automation",
        description: "Optional path for new subscribers.",
        priority: "nice",
        href: "/capabilities/automation-workflows/",
      },
    ],
    steps: [
      { id: "frame", label: "Lock a frame", detail: "Choose the recurring layout." },
      { id: "fill", label: "Fill content", detail: "Swap stories/offers; keep structure." },
      { id: "audience", label: "Audience", detail: "Full list or engaged segment." },
      { id: "schedule", label: "Schedule", detail: "Same day/time when possible." },
      { id: "review", label: "Review", detail: "Compare to last issue." },
    ],
    relatedCaps: ["email-campaigns", "email-templates", "analytics"],
    relatedUse: ["newsletters", "small-business-campaigns"],
    featureSlug: "newsletter-builder",
  }),

  "email-templates": emCap({
    slug: "email-templates",
    title: "Email templates",
    badge: "Templates",
    tagline:
      "Reusable design systems for marketing emails so every send does not start from scratch.",
    overview:
      "Email templates are reusable layouts and modules for campaigns and newsletters. They encode brand guardrails and speed production for lean teams.",
    who: "Anyone producing more than occasional emails — especially teams without a dedicated designer on every send.",
    matters:
      "Evaluate editability, brand controls, and mobile rendering — not the raw count of marketplace templates.",
    example:
      "Worked example: an agency managing two client brands. Separate template sets prevent accidental brand bleed between clients.",
    example2:
      "Worked example: an SMB marketer. A locked header/footer template keeps legal links and unsubscribe consistent.",
    goal: "Faster, on-brand composition with fewer errors",
    priorities: [
      "Brand lock / modules",
      "Mobile rendering",
      "Edit speed",
      "Shared library",
      "Accessibility basics",
    ],
    challenges: [
      {
        id: "drift",
        title: "Every email looks different",
        pain: "Brand trust erodes; production slows.",
        help: "Shared templates enforce structure and assets.",
      },
      {
        id: "broken-mobile",
        title: "Desktop-only designs",
        pain: "Most opens happen on phones.",
        help: "Templates tested for mobile rendering reduce surprises.",
      },
      {
        id: "footer",
        title: "Legal/unsubscribe footers get deleted",
        pain: "Compliance and trust risks.",
        help: "Locked regions keep required elements present.",
      },
      {
        id: "chaos",
        title: "Too many one-off templates",
        pain: "Nobody knows which is current.",
        help: "A small curated library beats an unmanaged pile.",
      },
    ],
    outcomes: [
      {
        id: "speed",
        title: "Faster production",
        description: "Compose by editing modules, not redesigning.",
      },
      {
        id: "brand",
        title: "Stronger brand consistency",
        description: "Guardrails survive busy weeks.",
      },
      {
        id: "fewer-errors",
        title: "Fewer missing links/footers",
        description: "Locked regions protect required elements.",
      },
      {
        id: "handoff",
        title: "Easier teammate handoffs",
        description: "Anyone can start from the same library.",
      },
    ],
    needs: [
      {
        id: "editor",
        title: "Visual editor",
        description: "Edit templates without code when possible.",
        priority: "must",
      },
      {
        id: "campaigns",
        title: "Campaigns / newsletters",
        description: "Place to apply templates.",
        priority: "must",
        href: "/capabilities/email-campaigns/",
      },
      {
        id: "brand",
        title: "Brand asset controls",
        description: "Colors, logos, locked modules.",
        priority: "nice",
      },
    ],
    steps: [
      { id: "audit", label: "Audit", detail: "Pick 2–3 master templates max." },
      { id: "lock", label: "Lock required regions", detail: "Header/footer/unsub." },
      { id: "train", label: "Train the team", detail: "Show how to duplicate safely." },
      { id: "retire", label: "Retire drift", detail: "Archive outdated one-offs." },
      { id: "refresh", label: "Refresh quarterly", detail: "Update brand assets deliberately." },
    ],
    relatedCaps: ["email-campaigns", "newsletter-builder", "analytics"],
    relatedUse: ["newsletters", "small-business-campaigns"],
    featureSlug: "email-templates",
  }),

  "automation-workflows": emCap({
    slug: "automation-workflows",
    title: "Automation workflows",
    badge: "Automation",
    tagline:
      "Multi-step marketing workflows triggered by subscriber events — welcome, nurture, lifecycle — on opted-in contacts.",
    overview:
      "Automation workflows are the ESP capability for triggered, multi-step email journeys. Evaluate triggers, actions, branching, and plan limits — not recipe gallery size.",
    who: "Teams whose blocking job is journeys, not only broadcasts.",
    matters:
      "Test must-have workflows on the plan you will buy. Demo sandboxes often unlock more than your tier.",
    example:
      "Worked example: a welcome series with a branch for clicked vs ignored emails. Idle contacts get a softer path instead of a hard sell.",
    example2:
      "Worked example: cart recovery with timing waits. The journey only works if store events reach the ESP reliably.",
    goal: "Reliable triggered journeys on the target plan",
    priorities: [
      "Trigger types",
      "Branching",
      "Plan limits",
      "Testing tools",
      "Journey analytics",
    ],
    challenges: [
      {
        id: "gates",
        title: "Must-have journeys locked behind upgrades",
        pain: "The demo lied about your plan.",
        help: "Build the journey on the qualifying tier during trial.",
      },
      {
        id: "triggers",
        title: "Missing event triggers",
        pain: "Your real events are not available.",
        help: "List required triggers before shortlisting.",
      },
      {
        id: "sprawl",
        title: "Too many overlapping journeys",
        pain: "Contacts get message collisions.",
        help: "Exit criteria and journey inventory prevent overlap.",
      },
      {
        id: "opaque",
        title: "No visibility into drop-offs",
        pain: "You cannot improve what you cannot see.",
        help: "Journey analytics show where paths stall.",
      },
    ],
    outcomes: [
      {
        id: "always-on",
        title: "Always-on paths",
        description: "Nurture and lifecycle run without inbox babysitting.",
      },
      {
        id: "relevant",
        title: "More relevant follow-ups",
        description: "Branching matches behavior.",
      },
      {
        id: "control",
        title: "Plan-aware control",
        description: "You know what your tier can run.",
      },
      {
        id: "improve",
        title: "Improving conversion over time",
        description: "Drop-off data guides edits.",
      },
    ],
    needs: [
      {
        id: "segmentation",
        title: "Segmentation",
        description: "Entry and branch conditions.",
        priority: "must",
        href: "/capabilities/segmentation/",
      },
      {
        id: "analytics",
        title: "Analytics",
        description: "Journey performance.",
        priority: "must",
        href: "/capabilities/analytics/",
      },
      {
        id: "campaigns",
        title: "Email content",
        description: "Messages inside steps.",
        priority: "must",
        href: "/capabilities/email-campaigns/",
      },
    ],
    steps: [
      { id: "map", label: "Map", detail: "Trigger, steps, exits on paper first." },
      { id: "build", label: "Build on target plan", detail: "No sandbox cheating." },
      { id: "test", label: "Test branches", detail: "Walk test contacts through." },
      { id: "launch", label: "Launch", detail: "Monitor early errors." },
      { id: "tune", label: "Tune", detail: "Fix drop-offs monthly." },
    ],
    relatedCaps: ["segmentation", "analytics", "email-campaigns", "ai-content-generation"],
    relatedUse: ["marketing-automation", "lead-nurturing", "ecommerce-email"],
    featureSlug: "automation-workflows",
  }),

  segmentation: emCap({
    slug: "segmentation",
    title: "Segmentation",
    badge: "Segmentation",
    tagline:
      "Target subscribers by attributes, behavior, and lists so the right people get the right message.",
    overview:
      "Segmentation is the ESP capability to build audiences from profile fields, engagement, and list membership. It underpins both campaigns and automations.",
    who: "Any team sending to more than a tiny homogeneous list.",
    matters:
      "Evaluate which data you can segment on and how hard it is to build/save audiences — not buzzword AI segments alone.",
    example:
      "Worked example: suppress non-openers for 90 days before a big promo to protect deliverability.",
    example2:
      "Worked example: send a product update only to trial users tagged as activated.",
    goal: "Relevant audiences without manual list exports",
    priorities: [
      "Attribute filters",
      "Behavior filters",
      "Saved audiences",
      "Exclusion rules",
      "Sync’d fields",
    ],
    challenges: [
      {
        id: "full-list",
        title: "Default is always full list",
        pain: "Relevance and reputation suffer.",
        help: "Saved segments make targeted sends the easy path.",
      },
      {
        id: "stale-fields",
        title: "Segment fields are empty or stale",
        pain: "Filters look powerful but match nobody useful.",
        help: "Capture and sync the fields you actually segment on.",
      },
      {
        id: "complex-ui",
        title: "Segment builder is too hard",
        pain: "Only one power user can create audiences.",
        help: "Usable builders + saved segments democratize targeting.",
      },
      {
        id: "overlap",
        title: "Overlapping segments cause collisions",
        pain: "One contact gets three messages the same day.",
        help: "Exclusions and frequency caps need an owner.",
      },
    ],
    outcomes: [
      {
        id: "relevance",
        title: "Higher relevance",
        description: "Messages match who people are and what they did.",
      },
      {
        id: "deliverability",
        title: "Healthier sends",
        description: "Engagement-based exclusions protect the domain.",
      },
      {
        id: "speed",
        title: "Faster campaign setup",
        description: "Saved audiences skip rebuilds.",
      },
      {
        id: "automation",
        title: "Better journey entry",
        description: "Automations start from clean conditions.",
      },
    ],
    needs: [
      {
        id: "contacts",
        title: "Subscriber data",
        description: "Profiles and lists to filter.",
        priority: "must",
      },
      {
        id: "analytics",
        title: "Engagement data",
        description: "Opens/clicks for behavior segments.",
        priority: "must",
        href: "/capabilities/analytics/",
      },
      {
        id: "automation",
        title: "Automation entry",
        description: "Segments feed journeys.",
        priority: "nice",
        href: "/capabilities/automation-workflows/",
      },
    ],
    steps: [
      { id: "fields", label: "Name fields", detail: "What you will actually filter on." },
      { id: "build", label: "Build core segments", detail: "Engaged, new, customers, cold." },
      { id: "exclude", label: "Add exclusions", detail: "Unsub, bounce, recent recipients." },
      { id: "save", label: "Save & name clearly", detail: "Team can reuse safely." },
      { id: "audit", label: "Audit quarterly", detail: "Retire unused segments." },
    ],
    relatedCaps: ["automation-workflows", "email-campaigns", "analytics"],
    relatedUse: ["marketing-automation", "ecommerce-email", "lead-nurturing"],
    featureSlug: "segmentation",
  }),

  "landing-pages": emCap({
    slug: "landing-pages",
    title: "Landing pages",
    badge: "Landing pages",
    tagline:
      "Build pages that grow the list and support campaigns — without a separate site rebuild for every offer.",
    overview:
      "Landing page capability in an ESP supports list growth and campaign destinations with forms that sync to subscriber lists.",
    who: "Teams that need fast offer pages and signup capture tied to email — especially without heavy web-dev support.",
    matters:
      "Evaluate publish speed, form-to-list sync, and mobile layout — not whether pages could replace your full website.",
    example:
      "Worked example: a webinar signup page that drops registrants into a reminder journey automatically.",
    example2:
      "Worked example: a lead magnet page that starts a nurture path on submit.",
    goal: "Fast list-growth pages tied to ESP lists and journeys",
    priorities: [
      "Form → list sync",
      "Publish speed",
      "Mobile layout",
      "Thank-you / next step",
      "UTM / tracking basics",
    ],
    challenges: [
      {
        id: "manual",
        title: "Signups sit in a form tool silo",
        pain: "Lists do not update; journeys never start.",
        help: "Native pages/forms write directly to ESP lists.",
      },
      {
        id: "slow",
        title: "Pages take a week to launch",
        pain: "Offers miss the moment.",
        help: "Template-based LPs ship in hours.",
      },
      {
        id: "dead-end",
        title: "No post-submit path",
        pain: "New subscribers get silence.",
        help: "Connect thank-you states to welcome automations.",
      },
      {
        id: "brand",
        title: "Pages look off-brand",
        pain: "Trust drops before the first email.",
        help: "Brand kits and templates keep LPs consistent.",
      },
    ],
    outcomes: [
      {
        id: "growth",
        title: "Faster list growth experiments",
        description: "Launch offers without a full site project.",
      },
      {
        id: "sync",
        title: "Cleaner signup → list flow",
        description: "Contacts land in the right audience immediately.",
      },
      {
        id: "journey",
        title: "Immediate nurture start",
        description: "Automations fire on submit.",
      },
      {
        id: "measure",
        title: "Offer-level learning",
        description: "See which pages convert into subscribers.",
      },
    ],
    needs: [
      {
        id: "forms",
        title: "Forms",
        description: "Capture fields and consent.",
        priority: "must",
      },
      {
        id: "automation",
        title: "Automation",
        description: "Welcome path after signup.",
        priority: "nice",
        href: "/capabilities/automation-workflows/",
      },
      {
        id: "analytics",
        title: "Analytics",
        description: "Page and downstream email performance.",
        priority: "nice",
        href: "/capabilities/analytics/",
      },
    ],
    steps: [
      { id: "offer", label: "Define offer", detail: "One promise, one CTA." },
      { id: "build", label: "Build page + form", detail: "Consent language included." },
      { id: "connect", label: "Connect list/journey", detail: "Verify test submits." },
      { id: "publish", label: "Publish", detail: "Mobile check." },
      { id: "optimize", label: "Optimize", detail: "Iterate on conversion, not vanity." },
    ],
    relatedCaps: ["automation-workflows", "segmentation", "email-campaigns"],
    relatedUse: ["lead-nurturing", "small-business-campaigns", "newsletters"],
    featureSlug: "landing-pages",
  }),

  analytics: emCap({
    slug: "analytics",
    title: "Analytics",
    badge: "Analytics",
    tagline:
      "See delivery, engagement, and conversion signals so campaigns and journeys improve — not just send volume.",
    overview:
      "Email marketing analytics cover opens, clicks, delivery/bounce, unsubscribes, and often journey or revenue proxies. Treat privacy and attribution limits honestly — open rates are imperfect signals.",
    who: "Anyone running recurring campaigns or journeys who needs a weekly review ritual.",
    matters:
      "Evaluate whether reports answer your decisions (what to send next, whom to suppress) — not dashboard prettiness alone.",
    example:
      "Worked example: a team suppresses chronic non-openers after reviewing engagement reports, improving inbox placement on the next promo.",
    example2:
      "Worked example: journey analytics show drop-off on email three; the team rewrites that step instead of adding more emails.",
    goal: "Actionable campaign and journey reporting",
    priorities: [
      "Delivery & bounce",
      "Engagement",
      "Journey funnel views",
      "Export / share",
      "Honest attribution limits",
    ],
    challenges: [
      {
        id: "vanity",
        title: "Vanity metrics without decisions",
        pain: "Dashboards impress; behavior does not change.",
        help: "Tie reports to suppress, rewrite, or double-down actions.",
      },
      {
        id: "open-noise",
        title: "Open rates mislead",
        pain: "Privacy changes make opens noisy.",
        help: "Weight clicks, conversions, and unsub trends more heavily.",
      },
      {
        id: "silo",
        title: "Only one person can find reports",
        pain: "Weekly review never happens.",
        help: "Saved reports and simple exports support a ritual.",
      },
      {
        id: "revenue-myth",
        title: "ESP revenue ≠ store truth",
        pain: "Teams argue over numbers.",
        help: "Agree which system owns order truth; use ESP for messaging diagnostics.",
      },
    ],
    outcomes: [
      {
        id: "ritual",
        title: "A weekly review ritual",
        description: "Same reports, same questions every week.",
      },
      {
        id: "hygiene",
        title: "Data-informed hygiene",
        description: "Suppressions based on engagement, not guesses.",
      },
      {
        id: "better-content",
        title: "Better content iteration",
        description: "Rewrite steps that drop off.",
      },
      {
        id: "alignment",
        title: "Clearer stakeholder alignment",
        description: "Shared numbers reduce anecdote wars.",
      },
    ],
    needs: [
      {
        id: "campaigns",
        title: "Campaigns / journeys",
        description: "Objects to measure.",
        priority: "must",
        href: "/capabilities/email-campaigns/",
      },
      {
        id: "segmentation",
        title: "Segmentation",
        description: "Act on insights with audiences.",
        priority: "must",
        href: "/capabilities/segmentation/",
      },
    ],
    steps: [
      { id: "pick", label: "Pick 5 metrics", detail: "Delivery, click, unsub, bounce, one conversion proxy." },
      { id: "save", label: "Save a weekly view", detail: "Same report every Monday." },
      { id: "act", label: "Define actions", detail: "What metric change triggers suppress/rewrite." },
      { id: "share", label: "Share", detail: "One link for stakeholders." },
      { id: "revisit", label: "Revisit quarterly", detail: "Drop unused charts." },
    ],
    relatedCaps: ["email-campaigns", "automation-workflows", "segmentation", "deliverability-tools"],
    relatedUse: ["newsletters", "marketing-automation", "ecommerce-email"],
    featureSlug: "analytics",
  }),

  "deliverability-tools": emCap({
    slug: "deliverability-tools",
    title: "Deliverability tools",
    badge: "Deliverability",
    tagline:
      "Authenticate domains, monitor sending health, and support inbox placement — without confusing this for a full ESP.",
    overview:
      "Deliverability tools inside or beside an ESP help with SPF/DKIM/DMARC guidance, reputation signals, and sometimes seed tests. Dedicated deliverability-only products may be adjacent, not core ESPs.",
    who: "Teams sending at meaningful volume or recovering from list/reputation problems.",
    matters:
      "Evaluate setup guidance quality and whether your team has an owner for DNS and list hygiene — tools do not replace process.",
    example:
      "Worked example: before a big promo, the team confirms DKIM alignment and suppresses cold contacts — reducing bounce spikes.",
    example2:
      "Worked example: after a spike in spam complaints, they pause blasts and clean engagement segments before resuming.",
    goal: "Protect inbox placement with auth and hygiene discipline",
    priorities: [
      "Auth guidance",
      "Bounce/complaint visibility",
      "List hygiene hooks",
      "Owner for DNS",
      "Sensible send ramp",
    ],
    challenges: [
      {
        id: "dns",
        title: "DNS auth never finished",
        pain: "Sends look fine in-app but land in spam.",
        help: "Clear SPF/DKIM/DMARC guidance with verification status.",
      },
      {
        id: "bought-lists",
        title: "Temptation to blast purchased lists",
        pain: "Reputation damage is expensive to undo.",
        help: "ESP + process should enforce permission-based sending.",
      },
      {
        id: "no-owner",
        title: "Nobody owns deliverability",
        pain: "Issues are discovered after a failed campaign.",
        help: "Assign a DNS/hygiene owner before scale.",
      },
      {
        id: "tool-confusion",
        title: "Warmup tools mistaken for ESPs",
        pain: "Teams buy adjacent products thinking they replace campaigns.",
        help: "Keep campaign platforms and deliverability aids distinct in evaluation.",
      },
    ],
    outcomes: [
      {
        id: "auth",
        title: "Authenticated sending domains",
        description: "Basics are verified before big sends.",
      },
      {
        id: "visibility",
        title: "Earlier problem signals",
        description: "Bounces and complaints are watched.",
      },
      {
        id: "hygiene",
        title: "Healthier lists",
        description: "Engagement-based suppressions become routine.",
      },
      {
        id: "clarity",
        title: "Clearer tool roles",
        description: "ESP vs adjacent deliverability tooling is understood.",
      },
    ],
    needs: [
      {
        id: "campaigns",
        title: "Campaign sending",
        description: "Something to protect.",
        priority: "must",
        href: "/capabilities/email-campaigns/",
      },
      {
        id: "segmentation",
        title: "Engagement segments",
        description: "Suppress cold contacts.",
        priority: "must",
        href: "/capabilities/segmentation/",
      },
      {
        id: "analytics",
        title: "Delivery analytics",
        description: "See bounce/complaint trends.",
        priority: "must",
        href: "/capabilities/analytics/",
      },
    ],
    steps: [
      { id: "auth", label: "Authenticate", detail: "SPF/DKIM/DMARC with verification." },
      { id: "owner", label: "Name an owner", detail: "DNS + hygiene accountability." },
      { id: "clean", label: "Clean before spikes", detail: "Suppress cold/risky contacts." },
      { id: "monitor", label: "Monitor", detail: "Watch bounce/complaint after sends." },
      { id: "respond", label: "Respond", detail: "Pause and remediate if health drops." },
    ],
    relatedCaps: ["analytics", "segmentation", "email-campaigns"],
    relatedUse: ["ecommerce-email", "small-business-campaigns", "newsletters"],
    featureSlug: "deliverability-tools",
  }),

  "ai-content-generation": emCap({
    slug: "ai-content-generation",
    title: "AI content generation",
    badge: "AI content",
    tagline:
      "Assistive subject lines and copy that a human reviews — never a substitute for strategy, consent, or brand voice.",
    overview:
      "AI content generation in email marketing helps draft subject lines, body copy, or send-time suggestions. It is optional assistance; evaluate usefulness on your voice and whether humans stay in the loop.",
    who: "Lean teams that want drafting speed without handing the brand to unreviewed automation.",
    matters:
      "Test whether AI output is editable, on-brand, and worth the plan tier — not demo wow alone.",
    example:
      "Worked example: a marketer drafts three subject variants with AI, then edits tone and claims before sending — cutting blank-page time without skipping review.",
    example2:
      "Worked example: AI suggests a rewrite for a weak nurture email; the team still checks links, offers, and compliance language.",
    goal: "Faster drafting with mandatory human review",
    priorities: [
      "Editability",
      "Brand/voice control",
      "Plan-tier access",
      "Human review workflow",
      "No invented claims",
    ],
    challenges: [
      {
        id: "hallucination",
        title: "AI invents offers or claims",
        pain: "Compliance and trust risk.",
        help: "Human review is mandatory before send.",
      },
      {
        id: "generic",
        title: "Generic voice",
        pain: "Every brand sounds the same.",
        help: "Provide examples and edit aggressively.",
      },
      {
        id: "gated",
        title: "AI locked on expensive tiers",
        pain: "The feature that sold you is not on your plan.",
        help: "Confirm AI access on the qualifying tier.",
      },
      {
        id: "overweight",
        title: "AI becomes the buy reason",
        pain: "Core campaigns/automation still weak.",
        help: "Keep AI as nice-to-have unless drafting is the blocking job.",
      },
    ],
    outcomes: [
      {
        id: "speed",
        title: "Less blank-page time",
        description: "Drafts start faster.",
      },
      {
        id: "variants",
        title: "More subject variants to test",
        description: "Humans still pick and edit.",
      },
      {
        id: "discipline",
        title: "Review discipline",
        description: "Process requires human approval.",
      },
      {
        id: "focus",
        title: "Buy focus stays on core jobs",
        description: "AI does not overshadow campaigns/automation fit.",
      },
    ],
    needs: [
      {
        id: "campaigns",
        title: "Campaigns / journeys",
        description: "Places to apply drafts.",
        priority: "must",
        href: "/capabilities/email-campaigns/",
      },
      {
        id: "templates",
        title: "Templates",
        description: "Structure for AI-assisted copy.",
        priority: "nice",
        href: "/capabilities/email-templates/",
      },
    ],
    steps: [
      { id: "brief", label: "Brief", detail: "Audience, offer, constraints." },
      { id: "draft", label: "Generate", detail: "Produce variants." },
      { id: "edit", label: "Edit", detail: "Fix voice, claims, links." },
      { id: "approve", label: "Approve", detail: "Human sign-off required." },
      { id: "learn", label: "Learn", detail: "Keep winners as examples." },
    ],
    relatedCaps: ["email-campaigns", "email-templates", "automation-workflows"],
    relatedUse: ["newsletters", "small-business-campaigns", "marketing-automation"],
    featureSlug: "ai-content-generation",
  }),
};
