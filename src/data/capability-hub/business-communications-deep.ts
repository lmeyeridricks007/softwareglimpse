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
  "No. Fit depends on your primary communications job (phone, dialing, messaging, WhatsApp, or contact center), seat count, and which requirements are must-haves. Use the Best Business Communications shortlist and requirements guide rather than starting from a single ranking.";

const BC_META = {
  categorySlug: "business-communications" as const,
  buyingGuideHref: "/guides/how-to-choose-business-communications-software/",
};

function bcCap(args: {
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
  team?: string;
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
    ...BC_META,
    displayTitle: `Business communications ${args.title} capability`,
    badgeLabel: args.badge,
    tagline: args.tagline,
    overview: args.overview,
    whoThisIsFor: args.who,
    whatMattersIntro: args.matters,
    workedExample: args.example,
    workedExampleSecondary: args.example2,
    glance: {
      primaryGoal: args.goal,
      typicalTeam:
        args.team ??
        "Ops, support, sales, and SMB operators running business voice or messaging",
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
        title: "SMB / growing team",
        bestWhen: "You need this capability without enterprise complexity.",
      },
      {
        id: "scale",
        title: "Higher volume ops",
        bestWhen: "Volume or multi-agent coverage makes this capability blocking.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm this capability is a must-have",
        href: "/guides/business-communications-requirements-guide/",
      },
      {
        step: 2,
        title: "Map it to seats and usage fees",
        href: "/guides/business-communications-pricing-guide/",
      },
      {
        step: 3,
        title: "Test it in a shared trial",
        href: "/guides/business-communications-evaluation-guide/",
      },
      {
        step: 4,
        title: "Compare researched platforms",
        href: "/best/business-communications-software/",
        ctaLabel: "Best business communications →",
      },
    ],
    faq: [
      {
        question: `Is there one best platform for ${args.title.toLowerCase()}?`,
        answer: NO_UNIVERSAL,
      },
      {
        question: "How does this relate to CRM capabilities?",
        answer:
          "CRM capabilities store relationships and pipeline on records. Business communications capabilities place and route calls or messages — often writing activity back into CRM via CTI. Many teams need both connected; buy for the communications job that is blocking first.",
      },
    ],
    relatedCapabilitySlugs: args.relatedCaps,
    relatedUseCaseSlugs: args.relatedUse,
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: [args.featureSlug],
    featuredGuideHrefs: [
      "/guides/how-to-choose-business-communications-software/",
      "/guides/what-is-business-communications-software/",
      "/best/business-communications-software/",
      "/categories/business-communications/",
    ],
    heroVisual: {
      src: `/capabilities/${args.slug}-hero.png`,
      alt: `Educational diagram of business communications ${args.title.toLowerCase()} capability.`,
      caption: `${args.title} as buyers should evaluate it in a communications stack — not a product endorsement.`,
    },
    needsVisual: {
      src: `/capabilities/${args.slug}-needs.png`,
      alt: `Diagram mapping ${args.title.toLowerCase()} pains to business communications capability fixes.`,
      caption: `What usually breaks around ${args.title.toLowerCase()} — and how this capability helps.`,
    },
    workflowVisual: {
      src: `/capabilities/${args.slug}-workflow.png`,
      alt: `Workflow diagram for using ${args.title.toLowerCase()} in business communications.`,
      caption: `A practical operating loop for ${args.title.toLowerCase()}.`,
    },
  };
}

/**
 * Business communications capability hub depth.
 * Does **not** include `ai-assistance` — CRM already owns `/capabilities/ai-assistance/`.
 */
export const businessCommunicationsCapabilityDepth: Record<string, Depth> = {
  "cloud-phone": bcCap({
    slug: "cloud-phone",
    title: "Cloud phone",
    badge: "Cloud phone",
    tagline:
      "Business numbers, softphones, and calling over the internet — without on-premise PBX hardware.",
    overview:
      "Cloud phone is the capability for provisioning company numbers, placing and receiving calls via softphone or mobile apps, and keeping basic call handling in one hosted system. It is the foundation most voice-led business communications stacks build on.",
    who: "Founders, office managers, and teams replacing personal mobiles or aging desk PBXs with company numbers and apps.",
    matters:
      "Evaluate number coverage and porting, softphone reliability, shared answering basics, and logging — not unused contact-center modules if volume is still light.",
    example:
      "Worked example: a five-person firm ports its main number to a cloud phone. Softphones on laptops and mobiles share one branded identity, and missed calls appear in a shared log.",
    example2:
      "Worked example: a two-site clinic publishes one set of numbers answered by either front desk with hours rules — no second PBX to maintain.",
    goal: "Reliable company calling identity with shared coverage",
    priorities: [
      "Number provisioning & porting",
      "Softphone / mobile apps",
      "Shared answering",
      "Call logging",
      "Hours rules",
    ],
    challenges: [
      {
        id: "personal",
        title: "Calling still lives on personal mobiles",
        pain: "History and coverage leave with people.",
        help: "Company numbers and apps keep identity with the business.",
      },
      {
        id: "desk-only",
        title: "Desk phones only",
        pain: "Hybrid work cannot share the same number cleanly.",
        help: "Softphones put the business line on the devices people use.",
      },
      {
        id: "no-log",
        title: "No usable call record",
        pain: "Follow-ups depend on memory.",
        help: "Call logs make missed and completed calls reviewable.",
      },
      {
        id: "port",
        title: "Porting feels risky",
        pain: "Printed materials and habit block the move.",
        help: "A porting plan and dual-run period reduce cutover risk.",
      },
    ],
    outcomes: [
      {
        id: "identity",
        title: "Durable business numbers",
        description: "Customers reach the company, not a pocket.",
      },
      {
        id: "mobility",
        title: "Calling from anywhere",
        description: "Softphones support desk, laptop, and mobile.",
      },
      {
        id: "coverage",
        title: "Shared answering",
        description: "Ring groups keep the line staffed.",
      },
      {
        id: "history",
        title: "Usable call history",
        description: "Logs support follow-up and ops review.",
      },
    ],
    needs: [
      {
        id: "call-routing",
        title: "Call routing",
        description: "Ring groups and menus as volume grows.",
        priority: "must",
        href: "/capabilities/call-routing/",
      },
      {
        id: "call-recording",
        title: "Call recording",
        description: "Optional coaching and compliance.",
        priority: "nice",
        href: "/capabilities/call-recording/",
      },
      {
        id: "crm-cti",
        title: "CRM / CTI",
        description: "Click-to-dial and logging when CRM is in play.",
        priority: "nice",
        href: "/capabilities/crm-cti/",
      },
      {
        id: "analytics-reporting",
        title: "Analytics",
        description: "Volume and missed-call views.",
        priority: "nice",
        href: "/capabilities/analytics-reporting/",
      },
    ],
    steps: [
      { id: "numbers", label: "Plan numbers", detail: "Main, local, department; note ports." },
      { id: "apps", label: "Provision apps", detail: "Softphones, greetings, devices." },
      { id: "answer", label: "Define answering", detail: "Ring groups and hours." },
      { id: "log", label: "Enable logging", detail: "Confirm history visibility." },
      { id: "review", label: "Review weekly", detail: "Missed calls and coverage gaps." },
    ],
    relatedCaps: [
      "call-routing",
      "call-recording",
      "crm-cti",
      "analytics-reporting",
      "video-meetings",
    ],
    relatedUse: ["business-phone", "sales-calling", "contact-center"],
    featureSlug: "cloud-phone",
  }),

  "call-routing": bcCap({
    slug: "call-routing",
    title: "Call routing & IVR",
    badge: "Call routing",
    tagline:
      "Menus, queues, and hours rules that decide who answers — instead of ringing everyone forever.",
    overview:
      "Call routing and IVR is the capability that steers inbound calls through menus, queues, skills, overflow, and after-hours behavior so the right person answers. It turns a shared number into an operable inbound path.",
    who: "Support and ops teams whose ring-all patterns create noise, wrong-skill pickups, or chronic wait times.",
    matters:
      "Evaluate queue design, overflow, hours behavior, and how easy menus are to change — not the deepest IVR tree on a demo day.",
    example:
      "Worked example: a support desk splits billing vs technical via IVR into two queues. Overflow rings a secondary group after a wait threshold instead of dumping to voicemail.",
    example2:
      "Worked example: a clinic routes after-hours callers to a nurse line with a clear message — patients stop guessing which mobile to text.",
    goal: "Inbound calls reach the right skill with planned overflow",
    priorities: [
      "IVR / menu clarity",
      "Queues & skills",
      "Overflow rules",
      "Business hours",
      "Easy edits after go-live",
    ],
    challenges: [
      {
        id: "ring-all",
        title: "Everything rings everyone",
        pain: "Noise and wrong-skill answers.",
        help: "Queues and skills route with intent.",
      },
      {
        id: "voicemail-dump",
        title: "Overflow is only voicemail",
        pain: "Callers abandon and never return.",
        help: "Overflow paths and messaging set expectations.",
      },
      {
        id: "stale-ivr",
        title: "Menus never get updated",
        pain: "Callers hear options that no longer exist.",
        help: "Editable routing keeps paths honest.",
      },
      {
        id: "hours",
        title: "Hours rules are wrong",
        pain: "Callers hit closed messages during open times.",
        help: "Timezone-aware hours and holidays are part of the design.",
      },
    ],
    outcomes: [
      {
        id: "fit",
        title: "Right-skill answering",
        description: "Callers reach people who can help.",
      },
      {
        id: "overflow",
        title: "Controlled peaks",
        description: "Overflow is planned, not chaotic.",
      },
      {
        id: "hours",
        title: "Clear after-hours paths",
        description: "Callers know what happens next.",
      },
      {
        id: "agility",
        title: "Routing you can change",
        description: "Menus evolve with the org chart.",
      },
    ],
    needs: [
      {
        id: "cloud-phone",
        title: "Cloud phone",
        description: "Numbers and agent endpoints.",
        priority: "must",
        href: "/capabilities/cloud-phone/",
      },
      {
        id: "analytics-reporting",
        title: "Analytics",
        description: "Wait times and abandon rates.",
        priority: "must",
        href: "/capabilities/analytics-reporting/",
      },
      {
        id: "call-recording",
        title: "Call recording",
        description: "Quality review on routed calls.",
        priority: "nice",
        href: "/capabilities/call-recording/",
      },
    ],
    steps: [
      { id: "intents", label: "Map intents", detail: "Why people call; who owns each path." },
      { id: "menus", label: "Design menus", detail: "Short IVR; avoid vanity trees." },
      { id: "queues", label: "Build queues", detail: "Skills, overflow, hours." },
      { id: "test", label: "Test paths", detail: "Walk every option including closed hours." },
      { id: "tune", label: "Tune weekly", detail: "Adjust from wait-time reports." },
    ],
    relatedCaps: [
      "cloud-phone",
      "analytics-reporting",
      "call-recording",
      "unified-inbox",
    ],
    relatedUse: ["contact-center", "business-phone"],
    featureSlug: "call-routing",
  }),

  "call-recording": bcCap({
    slug: "call-recording",
    title: "Call recording",
    badge: "Call recording",
    tagline:
      "Capture, store, and play back calls for coaching and compliance — with consent rules built in.",
    overview:
      "Call recording is the capability to capture conversations automatically or on demand, control retention and access, and play back calls for coaching or dispute resolution. Consent and regional rules are part of the capability, not an afterthought.",
    who: "Managers who coach from real calls, regulated teams that must retain conversations, and ops leads resolving he-said-she-said disputes.",
    matters:
      "Evaluate consent announcements, retention controls, access permissions, and search/playback — not storage marketing claims alone.",
    example:
      "Worked example: an SDR manager reviews two recorded discovery calls each week. Coaching targets talk-to-listen ratio instead of secondhand summaries.",
    example2:
      "Worked example: a support team resolves a billing dispute by retrieving the recorded commitment with access limited to leads — not the whole company.",
    goal: "Trustworthy call capture with controlled access and playback",
    priorities: [
      "Consent & announcements",
      "Retention controls",
      "Access permissions",
      "Search & playback",
      "CRM / ticket linking",
    ],
    challenges: [
      {
        id: "no-consent",
        title: "Recording without a consent plan",
        pain: "Legal and trust risk.",
        help: "Announcements and regional settings become part of setup.",
      },
      {
        id: "sprawl",
        title: "Everyone can hear everything",
        pain: "Privacy and policy failures.",
        help: "Role-based access limits playback.",
      },
      {
        id: "orphan",
        title: "Recordings are not findable",
        pain: "Coaching and disputes stall.",
        help: "Search and CRM linking make retrieval practical.",
      },
      {
        id: "forever",
        title: "Retention is infinite by default",
        pain: "Storage and risk grow unchecked.",
        help: "Retention policies match legal and operational needs.",
      },
    ],
    outcomes: [
      {
        id: "coach",
        title: "Evidence-based coaching",
        description: "Managers review real calls.",
      },
      {
        id: "disputes",
        title: "Faster dispute resolution",
        description: "What was said is retrievable.",
      },
      {
        id: "compliance",
        title: "Clearer compliance posture",
        description: "Consent and retention are deliberate.",
      },
      {
        id: "access",
        title: "Controlled access",
        description: "Only the right roles can play back.",
      },
    ],
    needs: [
      {
        id: "cloud-phone",
        title: "Cloud phone",
        description: "Calls to capture.",
        priority: "must",
        href: "/capabilities/cloud-phone/",
      },
      {
        id: "crm-cti",
        title: "CRM / CTI",
        description: "Link recordings to records when needed.",
        priority: "nice",
        href: "/capabilities/crm-cti/",
      },
      {
        id: "analytics-reporting",
        title: "Analytics",
        description: "Quality programs need volume context.",
        priority: "nice",
        href: "/capabilities/analytics-reporting/",
      },
    ],
    steps: [
      { id: "policy", label: "Write policy", detail: "Consent, retention, who may listen." },
      { id: "announce", label: "Configure announcements", detail: "Match regional rules." },
      { id: "access", label: "Set access", detail: "Role permissions for playback." },
      { id: "link", label: "Link records", detail: "CRM/ticket attachment where useful." },
      { id: "coach", label: "Coach weekly", detail: "Sample calls with a rubric." },
    ],
    relatedCaps: ["cloud-phone", "call-routing", "crm-cti", "analytics-reporting"],
    relatedUse: ["sales-calling", "contact-center", "business-phone"],
    featureSlug: "call-recording",
  }),

  "power-dialer": bcCap({
    slug: "power-dialer",
    title: "Power dialer",
    badge: "Power dialer",
    tagline:
      "Automated outbound dialing that removes hand-typed numbers from high-volume calling days.",
    overview:
      "Power dialer capability covers list-based automatic dialing, pacing, dispositions, and often CRM write-back for outbound sales teams. It is commonly gated to higher plan tiers — verify the feature on the plan you will buy.",
    who: "SDR/BDR pods and inside-sales teams measured on conversations attempted, where manual dialing is the bottleneck.",
    matters:
      "Evaluate list ingestion, pacing controls, disposition requiredness, CRM logging, and tier gates — not demo-only dialer modes.",
    example:
      "Worked example: a six-person SDR team runs morning blocks from a CRM list. Dispositions are mandatory before the next dial, so Monday reviews show real connect rates.",
    example2:
      "Worked example: a founder’s two-hour outbound block uses power dialing with local presence. The block ends with logged outcomes instead of a sticky-note pile.",
    goal: "Higher talk time with trustworthy attempt logging",
    team: "SDRs, inside sales, founder-led outbound",
    priorities: [
      "Available on target plan",
      "List / CRM dialing",
      "Dispositions",
      "Pacing controls",
      "Write-back quality",
    ],
    challenges: [
      {
        id: "manual",
        title: "Every number is typed",
        pain: "Talk time collapses.",
        help: "List-driven dialing removes repetitive entry.",
      },
      {
        id: "tier",
        title: "Dialer locked behind upgrade",
        pain: "You bought the wrong tier.",
        help: "Trial on the exact plan you will purchase.",
      },
      {
        id: "ghost",
        title: "Attempts not logged",
        pain: "Managers cannot coach volume.",
        help: "Forced dispositions and CRM write-back.",
      },
      {
        id: "compliance",
        title: "Pacing ignores compliance",
        pain: "Risk rises with volume.",
        help: "Do-not-call and consent checks stay in the loop.",
      },
    ],
    outcomes: [
      {
        id: "speed",
        title: "Faster dialing blocks",
        description: "More conversations per hour.",
      },
      {
        id: "truth",
        title: "Attempt truth in CRM",
        description: "Activity matches reality.",
      },
      {
        id: "coach",
        title: "Coachable metrics",
        description: "Connect rates become visible.",
      },
      {
        id: "focus",
        title: "Reps stay in flow",
        description: "Less admin between dials.",
      },
    ],
    needs: [
      {
        id: "cloud-phone",
        title: "Cloud phone",
        description: "Numbers and softphones.",
        priority: "must",
        href: "/capabilities/cloud-phone/",
      },
      {
        id: "crm-cti",
        title: "CRM / CTI",
        description: "Click-to-dial and logging.",
        priority: "must",
        href: "/capabilities/crm-cti/",
      },
      {
        id: "call-recording",
        title: "Call recording",
        description: "Coaching samples.",
        priority: "nice",
        href: "/capabilities/call-recording/",
      },
      {
        id: "analytics-reporting",
        title: "Analytics",
        description: "Connect and talk-time views.",
        priority: "must",
        href: "/capabilities/analytics-reporting/",
      },
    ],
    steps: [
      { id: "list", label: "Prepare list", detail: "CRM view; suppress DNC." },
      { id: "pace", label: "Set pacing", detail: "Match team skill and compliance." },
      { id: "dial", label: "Dial block", detail: "Require dispositions." },
      { id: "check", label: "Spot-check logs", detail: "CRM write-back accuracy." },
      { id: "review", label: "Review metrics", detail: "Weekly connect-rate coaching." },
    ],
    relatedCaps: [
      "cloud-phone",
      "crm-cti",
      "call-recording",
      "analytics-reporting",
    ],
    relatedUse: ["sales-calling", "business-phone"],
    featureSlug: "power-dialer",
  }),

  "sms-messaging": bcCap({
    slug: "sms-messaging",
    title: "SMS messaging",
    badge: "SMS",
    tagline:
      "Send and receive business SMS on company numbers — with delivery handling and registration rules.",
    overview:
      "SMS messaging capability covers two-way business texting tied to virtual numbers, delivery handling, templates, and the regional registration rules that govern commercial SMS. It is customer-facing messaging — not internal team chat.",
    who: "Support, success, and front-desk teams whose customers already text — especially when personal phones are today’s unofficial channel.",
    matters:
      "Evaluate number association, two-way history, registration/compliance support, and shared inbox fit — not raw send volume marketing.",
    example:
      "Worked example: a clinic moves appointment texts off a coordinator’s phone onto a business number with shared history so any teammate can continue the thread.",
    example2:
      "Worked example: a services firm sends job-status SMS from the same numbers used for voice, keeping context in one customer timeline.",
    goal: "Company-owned two-way SMS customers can trust",
    priorities: [
      "Business numbers",
      "Two-way history",
      "Registration / compliance",
      "Templates",
      "Shared inbox handoff",
    ],
    challenges: [
      {
        id: "personal",
        title: "Customer SMS on personal phones",
        pain: "Coverage and compliance fail.",
        help: "Business numbers keep threads company-owned.",
      },
      {
        id: "reg",
        title: "Registration skipped",
        pain: "Deliverability collapses after launch.",
        help: "Registration workflows are part of setup.",
      },
      {
        id: "one-way",
        title: "Broadcast-only SMS",
        pain: "Customers reply into a void.",
        help: "Two-way messaging with ownership.",
      },
      {
        id: "orphan",
        title: "No shared history",
        pain: "Shift changes restart conversations.",
        help: "Shared inbox preserves context.",
      },
    ],
    outcomes: [
      {
        id: "owned",
        title: "Company-owned texting",
        description: "Threads survive staffing changes.",
      },
      {
        id: "two-way",
        title: "Real conversations",
        description: "Replies are handled, not ignored.",
      },
      {
        id: "compliant",
        title: "Registration-aware sends",
        description: "Fewer surprise blocks.",
      },
      {
        id: "handoff",
        title: "Team handoffs",
        description: "Any agent can continue with context.",
      },
    ],
    needs: [
      {
        id: "shared-inbox",
        title: "Shared inbox",
        description: "Assignment and notes.",
        priority: "must",
        href: "/capabilities/shared-inbox/",
      },
      {
        id: "cloud-phone",
        title: "Cloud phone",
        description: "Numbers often shared with voice.",
        priority: "nice",
        href: "/capabilities/cloud-phone/",
      },
      {
        id: "unified-inbox",
        title: "Unified inbox",
        description: "When SMS joins other channels.",
        priority: "nice",
        href: "/capabilities/unified-inbox/",
      },
    ],
    steps: [
      { id: "register", label: "Register numbers", detail: "Follow regional SMS rules." },
      { id: "inbox", label: "Connect inbox", detail: "Assignment and ownership." },
      { id: "templates", label: "Write templates", detail: "Common replies + personalization." },
      { id: "operate", label: "Operate threads", detail: "Resolve with status discipline." },
      { id: "review", label: "Review aging", detail: "Weekly open-thread hygiene." },
    ],
    relatedCaps: [
      "shared-inbox",
      "whatsapp-business",
      "unified-inbox",
      "cloud-phone",
    ],
    relatedUse: ["customer-messaging", "whatsapp-support"],
    featureSlug: "sms-messaging",
  }),

  "whatsapp-business": bcCap({
    slug: "whatsapp-business",
    title: "WhatsApp Business",
    badge: "WhatsApp",
    tagline:
      "Official WhatsApp Business API messaging with shared inbox, templates, and fee-aware operations.",
    overview:
      "WhatsApp Business capability covers Business Solution Provider access to Meta’s official API, template approval, broadcast rules, shared team inboxes, and Meta conversation fees charged alongside a platform subscription. It replaces unofficial personal-account workarounds.",
    who: "Support and sales teams in WhatsApp-first markets, plus brands moving customer chat off personal WhatsApp accounts.",
    matters:
      "Evaluate official API access, shared inbox quality, template workflow, and total cost (platform + Meta) — not unofficial multi-device hacks.",
    example:
      "Worked example: a DTC brand onboards a BSP inbox. Agents share one business profile; shipping templates are approved before the first broadcast.",
    example2:
      "Worked example: a local services company stops double-booking by assigning WhatsApp chats with full history instead of a founder’s personal account.",
    goal: "Official, team-owned WhatsApp with predictable conversation economics",
    priorities: [
      "Official API / BSP",
      "Shared inbox",
      "Template approval",
      "Broadcast rules",
      "Platform + Meta fee clarity",
    ],
    challenges: [
      {
        id: "personal",
        title: "Personal WhatsApp as the company line",
        pain: "Access and history are fragile.",
        help: "Official API puts the profile under business control.",
      },
      {
        id: "templates",
        title: "Outbound blocked by template rules",
        pain: "Campaigns fail after build.",
        help: "Template workflow is part of operations.",
      },
      {
        id: "fees",
        title: "Meta fees unmodeled",
        pain: "Invoices surprise finance.",
        help: "Conversation fees sit beside subscription in pricing reviews.",
      },
      {
        id: "handoff",
        title: "No agent handoff",
        pain: "Customers restart every shift.",
        help: "Shared inbox assignment and notes.",
      },
    ],
    outcomes: [
      {
        id: "official",
        title: "Official business presence",
        description: "Customers chat with the brand profile.",
      },
      {
        id: "team",
        title: "Multi-agent coverage",
        description: "Shared ownership of threads.",
      },
      {
        id: "outbound",
        title: "Templated outbound that delivers",
        description: "Approved messages can ship.",
      },
      {
        id: "cost",
        title: "Clearer fee math",
        description: "Platform and Meta costs planned together.",
      },
    ],
    needs: [
      {
        id: "shared-inbox",
        title: "Shared inbox",
        description: "Multi-agent WhatsApp ownership.",
        priority: "must",
        href: "/capabilities/shared-inbox/",
      },
      {
        id: "unified-inbox",
        title: "Unified inbox",
        description: "When WhatsApp joins SMS/voice.",
        priority: "nice",
        href: "/capabilities/unified-inbox/",
      },
      {
        id: "analytics-reporting",
        title: "Analytics",
        description: "Volume and workload views.",
        priority: "nice",
        href: "/capabilities/analytics-reporting/",
      },
    ],
    steps: [
      { id: "bsp", label: "Onboard API", detail: "Official BSP path only." },
      { id: "templates", label: "Approve templates", detail: "Messages outside care window." },
      { id: "inbox", label: "Configure inbox", detail: "Assignment and hours." },
      { id: "fees", label: "Model fees", detail: "Estimate Meta conversation spend." },
      { id: "operate", label: "Operate & review", detail: "Coverage and fee burn weekly." },
    ],
    relatedCaps: [
      "shared-inbox",
      "sms-messaging",
      "unified-inbox",
      "analytics-reporting",
    ],
    relatedUse: ["whatsapp-support", "customer-messaging"],
    featureSlug: "whatsapp-business",
  }),

  "shared-inbox": bcCap({
    slug: "shared-inbox",
    title: "Shared inbox",
    badge: "Shared inbox",
    tagline:
      "One conversation queue several agents can work — with assignment, tags, and internal notes.",
    overview:
      "Shared inbox capability covers multi-agent ownership of customer conversations across email, SMS, chat, or WhatsApp: assignment, tagging, internal notes, and an audit trail so replies do not disappear into personal accounts.",
    who: "Support pairs and front-desk teams answering the same customer channel who need ownership and history — not a personal inbox each.",
    matters:
      "Evaluate assignment rules, collision prevention, notes, and reporting on open threads — not how many channel logos appear on a homepage.",
    example:
      "Worked example: two support agents share SMS. Assignment and status stop double replies; internal notes keep context when a third person covers lunch.",
    example2:
      "Worked example: a WhatsApp queue uses tags for order vs returns so specialists pull the right conversations without scrolling a shared phone.",
    goal: "Company-owned conversations with explicit ownership",
    priorities: [
      "Assignment & ownership",
      "Internal notes",
      "Tags / topics",
      "Collision prevention",
      "Open-thread reporting",
    ],
    challenges: [
      {
        id: "personal",
        title: "Replies live in personal accounts",
        pain: "Coverage dies on days off.",
        help: "Shared queues keep threads company-owned.",
      },
      {
        id: "double",
        title: "Two people reply at once",
        pain: "Customers get conflicting answers.",
        help: "Assignment and locking prevent collisions.",
      },
      {
        id: "notes",
        title: "No private teammate context",
        pain: "Sensitive detail hits the customer thread.",
        help: "Internal notes keep side context off-channel.",
      },
      {
        id: "aging",
        title: "Nobody sees aging threads",
        pain: "Customers wait silently.",
        help: "Open-queue views drive weekly hygiene.",
      },
    ],
    outcomes: [
      {
        id: "coverage",
        title: "Shift-proof coverage",
        description: "Any trained agent can continue.",
      },
      {
        id: "ownership",
        title: "Clear owners",
        description: "Assignment stops silent drops.",
      },
      {
        id: "quality",
        title: "Fewer collisions",
        description: "Customers hear one voice.",
      },
      {
        id: "visibility",
        title: "Visible backlog",
        description: "Managers see what is open.",
      },
    ],
    needs: [
      {
        id: "sms-messaging",
        title: "SMS messaging",
        description: "When text is a primary channel.",
        priority: "nice",
        href: "/capabilities/sms-messaging/",
      },
      {
        id: "whatsapp-business",
        title: "WhatsApp Business",
        description: "When WhatsApp is primary.",
        priority: "nice",
        href: "/capabilities/whatsapp-business/",
      },
      {
        id: "unified-inbox",
        title: "Unified inbox",
        description: "Multiple channels in one workspace.",
        priority: "nice",
        href: "/capabilities/unified-inbox/",
      },
      {
        id: "analytics-reporting",
        title: "Analytics",
        description: "Queue health reporting.",
        priority: "nice",
        href: "/capabilities/analytics-reporting/",
      },
    ],
    steps: [
      { id: "queue", label: "Define queues", detail: "By channel or topic." },
      { id: "assign", label: "Set assignment", detail: "Manual or rules-based owners." },
      { id: "tags", label: "Agree tags", detail: "Short taxonomy agents will use." },
      { id: "operate", label: "Operate", detail: "Assign, note, resolve." },
      { id: "review", label: "Review aging", detail: "Weekly open-thread scrub." },
    ],
    relatedCaps: [
      "sms-messaging",
      "whatsapp-business",
      "unified-inbox",
      "team-messaging",
    ],
    relatedUse: ["customer-messaging", "whatsapp-support", "contact-center"],
    featureSlug: "shared-inbox",
  }),

  "team-messaging": bcCap({
    slug: "team-messaging",
    title: "Team messaging",
    badge: "Team messaging",
    tagline:
      "Internal channels and chat the business controls — instead of personal messaging groups.",
    overview:
      "Team messaging capability covers internal channels, direct messages, file sharing, and admin controls that make internal chat auditable and offboardable. It is for employees coordinating work — not customer support threads.",
    who: "Multi-site and shift-based teams currently running operations in personal WhatsApp or iMessage groups.",
    matters:
      "Evaluate admin/offboarding controls, channel structure, mobile reliability, and search — not enterprise suite depth you will never configure.",
    example:
      "Worked example: three retail locations move store updates into role-based channels. Former employees lose access on offboarding day instead of lingering in a personal group.",
    example2:
      "Worked example: a field crew posts shift notes in a controlled channel so the next technician sees context without collecting personal numbers.",
    goal: "Internal coordination with admin control and clean offboarding",
    priorities: [
      "Admin & offboarding",
      "Channels by team/site",
      "Mobile reliability",
      "Searchable history",
      "Customer-channel boundary",
    ],
    challenges: [
      {
        id: "personal",
        title: "Work runs in personal groups",
        pain: "Business cannot control access.",
        help: "Admin-owned channels replace personal groups.",
      },
      {
        id: "ghosts",
        title: "Ex-staff still reading",
        pain: "Offboarding never finishes.",
        help: "Account deprovisioning revokes access.",
      },
      {
        id: "noise",
        title: "One mega-group for everything",
        pain: "Signal disappears.",
        help: "Structured channels by site/function.",
      },
      {
        id: "bleed",
        title: "Customer chat mixed in",
        pain: "Privacy and tone fail.",
        help: "Keep customer inboxes separate by design.",
      },
    ],
    outcomes: [
      {
        id: "control",
        title: "Admin-controlled chat",
        description: "Access follows employment.",
      },
      {
        id: "handoff",
        title: "Better shift handoffs",
        description: "Context lives in channels.",
      },
      {
        id: "search",
        title: "Findable decisions",
        description: "History is searchable.",
      },
      {
        id: "boundary",
        title: "Clearer customer boundary",
        description: "Internal ≠ customer inbox.",
      },
    ],
    needs: [
      {
        id: "shared-inbox",
        title: "Shared inbox",
        description: "Park customer threads elsewhere.",
        priority: "nice",
        href: "/capabilities/shared-inbox/",
      },
      {
        id: "cloud-phone",
        title: "Cloud phone",
        description: "Optional voice alongside chat.",
        priority: "nice",
        href: "/capabilities/cloud-phone/",
      },
    ],
    steps: [
      { id: "map", label: "Map channels", detail: "By site, function, shift." },
      { id: "admin", label: "Set admins", detail: "Owners and guest policy." },
      { id: "migrate", label: "Migrate groups", detail: "Move high-traffic coordination first." },
      { id: "norms", label: "Set norms", detail: "What belongs in chat vs tickets." },
      { id: "audit", label: "Audit access", detail: "Monthly guest and channel hygiene." },
    ],
    relatedCaps: ["shared-inbox", "unified-inbox", "cloud-phone", "video-meetings"],
    relatedUse: ["team-communication", "customer-messaging"],
    featureSlug: "team-messaging",
  }),

  "video-meetings": bcCap({
    slug: "video-meetings",
    title: "Video meetings",
    badge: "Video meetings",
    tagline:
      "Host and join business video meetings with screen share, recording, and calendar join — often beside cloud phone in a UCaaS stack.",
    overview:
      "Video meetings capability covers scheduled and ad-hoc meetings, host controls, screen sharing, recording, and calendar integration. In business communications it is a collaboration surface that frequently ships with UCaaS platforms (Zoom Workplace + Zoom Phone, Microsoft Teams meetings with optional Teams Phone, RingCentral video) — it does not replace a phone-cluster shortlist when the blocking job is numbers and routing.",
    who: "Teams whose week runs on client demos, all-hands, and hybrid standups — and buyers evaluating whether meetings and phone should live in one vendor or two.",
    matters:
      "Separate free meeting SKUs from paid phone add-ons, check recording and host controls on the plan you will buy, and confirm calendar join reliability — do not treat a meetings brand as automatic phone coverage.",
    example:
      "Worked example: a sales team already lives in Zoom for demos. They add Zoom Phone so softphone and meetings stay in one account — but they still score number coverage and CRM CTI as phone requirements, not meeting features.",
    example2:
      "Worked example: an M365 shop uses Teams meetings daily. Teams Phone is a separate SKU decision with PSTN plans — meetings success does not prove the phone path is ready.",
    goal: "Reliable video meetings with clear boundary vs cloud phone",
    team: "Hybrid SMBs, sales demos, and multi-site all-hands",
    priorities: [
      "Host controls & waiting rooms",
      "Screen share & recording",
      "Calendar / join reliability",
      "Phone vs meetings SKU clarity",
      "Participant limits on target plan",
    ],
    challenges: [
      {
        id: "sku-confusion",
        title: "Meetings plan mistaken for phone",
        pain: "Buyers assume free or meetings SKUs include PSTN business lines.",
        help: "Treat Zoom Phone / Teams Phone as separate must-have tests.",
      },
      {
        id: "join-friction",
        title: "Calendar join fails on real devices",
        pain: "Demos look fine; weekly meetings do not.",
        help: "Trial calendar join from the devices people actually use.",
      },
      {
        id: "recording-gate",
        title: "Recording gated above quote",
        pain: "Compliance or coaching needs appear mid-trial.",
        help: "Map recording to the tier you will buy before demos.",
      },
      {
        id: "two-vendors",
        title: "Meetings and phone in different tools",
        pain: "Identity and admin sprawl.",
        help: "Decide deliberately: one UCaaS stack vs best-of-breed — score both paths.",
      },
    ],
    outcomes: [
      {
        id: "presence",
        title: "Predictable meeting presence",
        description: "Clients and staff join without friction.",
      },
      {
        id: "share",
        title: "Usable screen share & recording",
        description: "Demos and coaching leave an artifact.",
      },
      {
        id: "boundary",
        title: "Clear phone vs meetings boundary",
        description: "PSTN jobs stay on the phone requirements sheet.",
      },
      {
        id: "admin",
        title: "Admin-controlled meetings",
        description: "Hosts, guests, and retention follow company policy.",
      },
    ],
    needs: [
      {
        id: "cloud-phone",
        title: "Cloud phone",
        description: "When PSTN / business numbers are also required.",
        priority: "nice",
        href: "/capabilities/cloud-phone/",
      },
      {
        id: "team-messaging",
        title: "Team messaging",
        description: "Chat alongside meetings in the same collab surface.",
        priority: "nice",
        href: "/capabilities/team-messaging/",
      },
      {
        id: "crm-cti",
        title: "CRM / CTI",
        description: "When dialing from CRM matters more than meeting join.",
        priority: "nice",
        href: "/capabilities/crm-cti/",
      },
    ],
    steps: [
      { id: "sku", label: "Separate SKUs", detail: "Meetings vs phone vs dialer add-ons." },
      { id: "host", label: "Test host controls", detail: "Waiting room, mute, recording." },
      { id: "calendar", label: "Test calendar join", detail: "Real devices and networks." },
      { id: "record", label: "Confirm recording", detail: "On the plan you will buy." },
      { id: "decide", label: "Decide stack shape", detail: "One UCaaS vs split meetings/phone." },
    ],
    relatedCaps: ["cloud-phone", "team-messaging", "crm-cti", "analytics-reporting"],
    relatedUse: ["team-communication", "business-phone", "sales-calling"],
    featureSlug: "video-meetings",
  }),

  "crm-cti": bcCap({
    slug: "crm-cti",
    title: "CRM / CTI integration",
    badge: "CRM / CTI",
    tagline:
      "Click-to-dial, screen pops, and automatic call logging in the system your team already uses.",
    overview:
      "CRM/CTI capability connects the phone system to CRM or helpdesk: click-to-dial from records, inbound screen pops, and bidirectional call logging. It is the difference between a phone that saves admin time and one that creates a second system to update.",
    who: "Sales and support teams whose system of record is already CRM or a helpdesk, and who lose time re-entering call outcomes.",
    matters:
      "Evaluate which CRMs are supported on your plan, logging field quality, screen-pop reliability, and failure modes — not logo walls alone.",
    example:
      "Worked example: an AE clicks to dial from a CRM opportunity. The call logs automatically with duration and disposition — no second spreadsheet.",
    example2:
      "Worked example: inbound support screen-pops the customer record before answer, so agents greet with context instead of asking for account numbers first.",
    goal: "Calling that writes trustworthy activity into CRM",
    priorities: [
      "Supported CRM on plan",
      "Click-to-dial",
      "Screen pops",
      "Automatic logging",
      "Disposition fields",
    ],
    challenges: [
      {
        id: "double",
        title: "Two systems to update",
        pain: "Reps skip logging.",
        help: "Automatic write-back reduces double entry.",
      },
      {
        id: "logos",
        title: "Integration is logo-only",
        pain: "Critical fields never sync.",
        help: "Trial logging on your real CRM objects.",
      },
      {
        id: "mismatch",
        title: "Wrong record matched",
        pain: "Activity lands on duplicates.",
        help: "Match rules and duplicate hygiene matter.",
      },
      {
        id: "tier",
        title: "CTI gated to higher tier",
        pain: "Demo used a feature you lack.",
        help: "Verify CTI on the purchasing plan.",
      },
    ],
    outcomes: [
      {
        id: "speed",
        title: "Faster dialing from records",
        description: "Click-to-dial removes number hunting.",
      },
      {
        id: "context",
        title: "Context on answer",
        description: "Screen pops reduce restart questions.",
      },
      {
        id: "truth",
        title: "Cleaner CRM activity",
        description: "Calls appear where deals and tickets live.",
      },
      {
        id: "coach",
        title: "Coachable history",
        description: "Managers review real attempt trails.",
      },
    ],
    needs: [
      {
        id: "cloud-phone",
        title: "Cloud phone",
        description: "The calling endpoint.",
        priority: "must",
        href: "/capabilities/cloud-phone/",
      },
      {
        id: "power-dialer",
        title: "Power dialer",
        description: "When outbound volume needs list dialing.",
        priority: "nice",
        href: "/capabilities/power-dialer/",
      },
      {
        id: "call-recording",
        title: "Call recording",
        description: "Link recordings to records.",
        priority: "nice",
        href: "/capabilities/call-recording/",
      },
    ],
    steps: [
      { id: "crm", label: "Confirm CRM", detail: "Objects and plan support." },
      { id: "connect", label: "Connect CTI", detail: "Auth and match rules." },
      { id: "map", label: "Map fields", detail: "Dispositions and owners." },
      { id: "test", label: "Test pops & logs", detail: "Inbound and outbound scripts." },
      { id: "monitor", label: "Monitor failures", detail: "Weekly sync error review." },
    ],
    relatedCaps: [
      "cloud-phone",
      "power-dialer",
      "call-recording",
      "analytics-reporting",
    ],
    relatedUse: ["sales-calling", "business-phone", "contact-center"],
    featureSlug: "crm-cti",
  }),

  "analytics-reporting": bcCap({
    slug: "analytics-reporting",
    title: "Analytics & reporting",
    badge: "Analytics",
    tagline:
      "Call and message volume, wait times, and agent activity in reports managers actually review.",
    overview:
      "Communications analytics and reporting covers volume, missed calls, wait times, handle time, and agent or queue performance views used in weekly operations reviews. It is operational reporting for voice and messaging — not a general BI suite.",
    who: "Support and sales managers who currently reconstruct performance from anecdotes and export spreadsheets.",
    matters:
      "Evaluate the weekly metrics you will open every Monday, export needs, and queue vs agent views — not unused dashboard galleries.",
    example:
      "Worked example: a support lead reviews wait time by queue each Monday and adjusts staffing for the known Tuesday peak instead of guessing.",
    example2:
      "Worked example: an SDR manager looks at connect rate and dispositions by rep to coach list quality, not just raw dial counts.",
    goal: "Trusted operational metrics that change staffing and coaching",
    priorities: [
      "Wait / miss metrics",
      "Queue & agent views",
      "Disposition summaries",
      "Export / share",
      "Weekly-review fitness",
    ],
    challenges: [
      {
        id: "blind",
        title: "No shared numbers",
        pain: "Staffing is guesswork.",
        help: "Queue and volume reports create a baseline.",
      },
      {
        id: "vanity",
        title: "Dashboards nobody opens",
        pain: "License waste.",
        help: "Buy for the three metrics of the weekly ritual.",
      },
      {
        id: "export",
        title: "Locked-in charts only",
        pain: "Finance and ops cannot reuse data.",
        help: "Exports and scheduled shares matter.",
      },
      {
        id: "lag",
        title: "Data arrives too late",
        pain: "Fixes miss the peak.",
        help: "Near-real-time or daily freshness for ops metrics.",
      },
    ],
    outcomes: [
      {
        id: "visibility",
        title: "Shared performance visibility",
        description: "The team argues from the same charts.",
      },
      {
        id: "staffing",
        title: "Better staffing decisions",
        description: "Peaks show up before they hurt.",
      },
      {
        id: "coaching",
        title: "Coachable agent views",
        description: "1:1s use real activity.",
      },
      {
        id: "habit",
        title: "A weekly review habit",
        description: "Reporting becomes operational, not decorative.",
      },
    ],
    needs: [
      {
        id: "call-routing",
        title: "Call routing",
        description: "Queues to measure.",
        priority: "nice",
        href: "/capabilities/call-routing/",
      },
      {
        id: "cloud-phone",
        title: "Cloud phone",
        description: "Call events to aggregate.",
        priority: "must",
        href: "/capabilities/cloud-phone/",
      },
      {
        id: "shared-inbox",
        title: "Shared inbox",
        description: "Messaging volume when relevant.",
        priority: "nice",
        href: "/capabilities/shared-inbox/",
      },
    ],
    steps: [
      { id: "pick", label: "Pick metrics", detail: "Three Monday-review numbers." },
      { id: "views", label: "Build views", detail: "Queue and agent cuts." },
      { id: "share", label: "Share cadence", detail: "Who sees what weekly." },
      { id: "act", label: "Act on outliers", detail: "Staffing or coaching changes." },
      { id: "prune", label: "Prune dashboards", detail: "Delete unused charts." },
    ],
    relatedCaps: [
      "call-routing",
      "cloud-phone",
      "power-dialer",
      "shared-inbox",
    ],
    relatedUse: ["contact-center", "sales-calling", "business-phone"],
    featureSlug: "analytics-reporting",
  }),

  "unified-inbox": bcCap({
    slug: "unified-inbox",
    title: "Unified multichannel inbox",
    badge: "Unified inbox",
    tagline:
      "Calls, SMS, and chat in one agent workspace — so customers do not restart when they switch channels.",
    overview:
      "Unified inbox capability brings voice, SMS, and messaging channels into a single agent workspace with shared history. It is most valuable when customers switch channels mid-conversation and agents otherwise juggle separate tools.",
    who: "Support teams whose customers bounce between phone, SMS, and chat — and whose agents miss messages across tabs.",
    matters:
      "Evaluate true shared history across channels, assignment consistency, and which channels are included on your plan — not a collage of logos.",
    example:
      "Worked example: a customer texts after a missed call. The same agent sees both interactions in one timeline and continues without asking the customer to repeat the issue.",
    example2:
      "Worked example: a WhatsApp and SMS brand consolidates queues so specialists work one backlog with channel tags instead of three apps.",
    goal: "One agent workspace with cross-channel conversation history",
    priorities: [
      "Channels on target plan",
      "Shared cross-channel history",
      "Consistent assignment",
      "Agent UX clarity",
      "Reporting across channels",
    ],
    challenges: [
      {
        id: "tabs",
        title: "One tool per channel",
        pain: "Messages get missed.",
        help: "A single workspace reduces switching tax.",
      },
      {
        id: "restart",
        title: "Customers restart on channel switch",
        pain: "Context is lost.",
        help: "Shared history spans voice and messaging.",
      },
      {
        id: "partial",
        title: "“Unified” excludes your channel",
        pain: "You still run a sidecar tool.",
        help: "Verify included channels on the buying plan.",
      },
      {
        id: "noise",
        title: "Everything in one undifferentiated pile",
        pain: "Agents cannot prioritize.",
        help: "Filters, tags, and queues inside the unified view.",
      },
    ],
    outcomes: [
      {
        id: "continuity",
        title: "Cross-channel continuity",
        description: "Customers stop repeating themselves.",
      },
      {
        id: "focus",
        title: "Fewer agent tools",
        description: "One primary workspace.",
      },
      {
        id: "ownership",
        title: "Consistent ownership",
        description: "Assignment works across channels.",
      },
      {
        id: "insight",
        title: "Holistic volume views",
        description: "Reporting spans the real customer journey.",
      },
    ],
    needs: [
      {
        id: "shared-inbox",
        title: "Shared inbox",
        description: "Assignment foundation.",
        priority: "must",
        href: "/capabilities/shared-inbox/",
      },
      {
        id: "sms-messaging",
        title: "SMS messaging",
        description: "When SMS is in scope.",
        priority: "nice",
        href: "/capabilities/sms-messaging/",
      },
      {
        id: "whatsapp-business",
        title: "WhatsApp Business",
        description: "When WhatsApp is in scope.",
        priority: "nice",
        href: "/capabilities/whatsapp-business/",
      },
      {
        id: "cloud-phone",
        title: "Cloud phone",
        description: "When voice sits in the same workspace.",
        priority: "nice",
        href: "/capabilities/cloud-phone/",
      },
    ],
    steps: [
      { id: "channels", label: "List channels", detail: "Must-have vs later." },
      { id: "plan", label: "Check plan cover", detail: "Which channels are included." },
      { id: "history", label: "Test history", detail: "Switch channels mid-thread in trial." },
      { id: "assign", label: "Align assignment", detail: "Same ownership rules everywhere." },
      { id: "review", label: "Review backlog", detail: "One cross-channel aging view." },
    ],
    relatedCaps: [
      "shared-inbox",
      "sms-messaging",
      "whatsapp-business",
      "cloud-phone",
    ],
    relatedUse: ["customer-messaging", "whatsapp-support", "contact-center"],
    featureSlug: "unified-inbox",
  }),
};
