import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const howToChooseSalesIntelligenceBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose sales intelligence software by the primary job you need done — building new lists (data), completing records you already own (enrichment), running multichannel sequences (engagement), or dialing at volume (dialer) — not by brand marketing or an “all-in-one” badge. Name the one job that is blocking pipeline this quarter, then shortlist only tools whose core product is that job and whose credit model, CRM sync, and data sourcing survive your real workflow. Everything a vendor bundles beyond that job is a convenience bonus, never the reason to buy.",
    bullets: [
      "Primary job to be done",
      "Coverage on your ICP",
      "Credit & export model",
      "CRM sync reliability",
      "Data sourcing & compliance",
      "Deliverability & sending",
      "Rep workflow fit",
    ],
  },
  {
    type: "key-takeaways",
    id: "takeaways",
    title: "What matters most",
    items: [
      {
        label: "“Sales intelligence” is four products",
        body: "Contact databases, enrichment, engagement platforms, and dialers sit in one category but fail for completely different reasons. Pick the shape first.",
      },
      {
        label: "Coverage is local, not global",
        body: "Total record counts say nothing about your niche, seniority band, or region. Sample your own target accounts before you compare plans.",
      },
      {
        label: "Credits are the real price",
        body: "Read what one credit buys, whether credits roll over, how exports are capped, and what happens when a campaign runs hot mid-month.",
      },
      {
        label: "CRM sync decides data quality",
        body: "One-way pushes create duplicates. Agree field mapping, overwrite rules, and record ownership before go-live — not after 10,000 rows land.",
      },
      {
        label: "Compliance is your call, not the vendor's",
        body: "Vendors publish sourcing and processing terms; lawful basis for your outreach is yours. Loop in your own privacy owner before prospecting in regulated regions.",
      },
    ],
  },
  {
    type: "figure",
    id: "worked-examples",
    title: "Four worked examples",
    src: "/guides/how-to-choose-sales-intelligence-needs.png",
    alt: "Four worked examples of sales intelligence buying: a 3-person SDR pod needing lists, a solo RevOps owner enriching 18,000 records, a 5-seat outbound pod needing sequences, and an 8-rep phone-led team needing a dialer.",
    caption:
      "Four teams, one category, four different shortlists. Each row moves from the problem to the primary job to the one thing worth testing in a trial — the job decides the tool, not the brand.",
  },
  {
    type: "selection-checklist",
    id: "interactive-checklist",
    title: "Interactive sales intelligence selection checklist",
    dimensions: [
      {
        id: "primary-job",
        label: "Primary job",
        options: [
          "Build new lists",
          "Enrich records I own",
          "Run sequences",
          "Dial at volume",
          "Two or more of these",
        ],
      },
      {
        id: "team-shape",
        label: "Team shape",
        options: ["Solo / founder-led", "1–3 SDRs", "4–15 reps", "16+ reps or multi-pod"],
      },
      {
        id: "icp",
        label: "Ideal customer profile",
        options: [
          "SMB, broad",
          "Mid-market named accounts",
          "Enterprise, few accounts",
          "Niche vertical or single region",
        ],
      },
      {
        id: "channels",
        label: "Channels you actually run",
        options: [
          "Email only",
          "Email + LinkedIn",
          "Email + phone",
          "Full multichannel",
        ],
      },
      {
        id: "data-needs",
        label: "Data you need",
        options: [
          "Work emails",
          "Direct dials / mobiles",
          "Firmographics",
          "Technographics",
          "Intent signals",
        ],
      },
      {
        id: "crm",
        label: "System of record",
        options: [
          "No CRM yet",
          "HubSpot",
          "Salesforce",
          "SMB CRM (Pipedrive, Close, …)",
          "Other / custom",
        ],
      },
      {
        id: "budget",
        label: "Budget posture",
        options: [
          "Pay-as-you-go credits",
          "Monthly per seat",
          "Annual commitment if ROI is clear",
        ],
      },
      {
        id: "compliance",
        label: "Compliance constraints",
        options: [
          "No special constraints",
          "EU / UK prospecting",
          "Regulated industry review required",
        ],
      },
    ],
  },
  {
    type: "decision-framework",
    id: "roadmap",
    title: "Selection workflow",
    steps: [
      { id: "step-job", label: "Primary job" },
      { id: "step-coverage", label: "Coverage" },
      { id: "step-credits", label: "Credits" },
      { id: "step-sync", label: "CRM sync" },
      { id: "step-compliance", label: "Compliance" },
      { id: "step-workflow", label: "Rep workflow" },
      { id: "step-scale", label: "Scale" },
    ],
    ctaHref: "/tools/sales-intelligence-finder/",
    ctaLabel: "Try the Sales Intelligence Finder →",
    figure: {
      src: "/guides/how-to-choose-sales-intelligence-workflow.png",
      alt: "Sales intelligence selection workflow: name the primary job, test coverage on your ICP, decode the credit model, verify CRM sync, check sourcing and compliance, fit the rep workflow, plan for volume.",
      caption:
        "Walk the workflow in order. Data tests belong before demos, and credit terms plus CRM sync belong before a contract — reversing that order is how teams end up paying for records they cannot use.",
    },
  },
  {
    type: "step",
    id: "step-job",
    stepNumber: 1,
    heading: "Name the primary job before you name a vendor",
    body: "Almost every vendor in this category claims to do all four jobs. They rarely do them equally well, and the one they built first is usually the one that holds up under volume. Write down the single job that is blocking pipeline this quarter, in one sentence, before you open a pricing page.\n\nExample: a three-person SDR pod at a 40-person B2B SaaS company keeps starting the week without a fresh list. Their blocking job is data — a searchable contact database with filters that match their ICP. Sequencing and dialing already work well enough in their existing stack, so a bundled sequencer is a bonus, not a selection criterion.\n\nIf two jobs genuinely block you, treat the second as a separate decision rather than a reason to accept a weaker tool on the first.",
    tip: "Write the job as an observable weekly outcome — “every SDR starts Monday with 150 verified contacts in their ICP” — not as a feature name.",
    scenarios: [
      {
        title: "Data",
        body: "You need net-new contacts and companies you do not have yet: search, filter, verify, export.",
      },
      {
        title: "Enrichment",
        body: "You already own the accounts. You need missing fields, refreshed titles, and signals on known records.",
      },
      {
        title: "Engagement",
        body: "Contacts exist but follow-up dies. You need sequences, reply handling, and deliverability discipline.",
      },
      {
        title: "Dialer",
        body: "Connect volume is the constraint. You need power dialing, local presence, and automatic call logging.",
      },
    ],
  },
  {
    type: "step",
    id: "step-coverage",
    stepNumber: 2,
    heading: "Test coverage on your own ICP, not the vendor's record count",
    body: "“Hundreds of millions of contacts” is not a coverage claim about your market. What matters is how many usable records a tool returns for your industry, seniority band, company-size band, and region — and how many of those survive verification.\n\nRun the same test on every shortlisted tool: take 200 real target accounts, search for the two roles you actually sell to, and count three things — records found, records with a usable work email, and records with the phone number type you need. Then spot-check 20 by hand.\n\nExample: the SDR pod above runs that test across three tools. Two return large result sets but thin coverage of heads of revenue operations at 200–1,000-employee companies in their region; the third returns fewer total rows but far more usable ones. Fewer, better rows is the right answer for a weekly list-building job.",
    tip: "Do the coverage test during a trial, on your own accounts. A vendor-run demo search is optimized for the vendor's strongest data.",
  },
  {
    type: "step",
    id: "step-credits",
    stepNumber: 3,
    heading: "Decode the credit and export model",
    body: "Seat price is rarely the number that decides the bill. In this category the meaningful questions are: what does one credit unlock, are emails and phone numbers priced differently, do credits roll over, is there a monthly export cap, and can you buy top-ups mid-campaign without a plan upgrade.\n\nAlso confirm your export rights. Some plans let you view records in-app but limit bulk export or API pulls — which quietly makes the tool unusable as a data source for your warehouse or CRM.\n\nExample: a solo RevOps owner with about 18,000 CRM records needs a one-off enrichment pass, then a small monthly top-up for new records. A pay-as-you-go credit model fits that shape far better than an annual per-seat platform, and it keeps the first pass from consuming a year of budget.\n\nRead each vendor's published pricing page and get a written quote for your volume. Do not model this from a “from $X” marketing figure.",
    tip: "Ask the vendor to price your actual first 90 days: initial backfill volume, monthly net-new volume, and the seats who need export rights.",
  },
  {
    type: "step",
    id: "step-sync",
    stepNumber: 4,
    heading: "Verify CRM sync in both directions",
    body: "A sales intelligence tool is a data source, not a system of record. If sync is one-way or field mapping is vague, you will get duplicate contacts, overwritten owner fields, and reps who stop trusting the CRM.\n\nBefore you commit, agree four rules in writing: which fields the tool may write, which fields it may never overwrite, how duplicates are matched (email, domain, company ID), and what happens when the tool and the CRM disagree. Then test all four on a sandbox or a small segment.\n\nA marketplace logo is not a workflow. Ask for a live walkthrough of your exact path — search, push to CRM, sequence, log activity, report — in your own CRM instance.",
    tip: "Push 50 records first, not 5,000. Duplicate and overwrite problems are cheap to fix at 50 and expensive at 5,000.",
  },
  {
    type: "step",
    id: "step-compliance",
    stepNumber: 5,
    heading: "Check data sourcing and compliance posture",
    body: "Contact data carries obligations. Ask each vendor where records come from, how opt-out and deletion requests are handled, which regions are covered by their processing terms, and what documentation they provide for a privacy review.\n\nThose answers inform your decision; they do not make it. Lawful basis for your outreach depends on how you use the records, which regions you contact, and your own policies. Route the vendor's sourcing and processing terms to whoever owns privacy at your company before you start prospecting in the EU, UK, or a regulated industry.\n\nSoftwareGlimpse does not provide legal advice, and no vendor claim replaces your own review.",
    tip: "Keep a suppression list from day one — do-not-contact accounts, churned customers, and opt-outs — and confirm the tool can honour it.",
  },
  {
    type: "step",
    id: "step-workflow",
    stepNumber: 6,
    heading: "Fit the rep's daily workflow",
    body: "The best data in the world loses to a workflow reps avoid. Have one non-admin rep run a full day in each trial: build a list, push it, send or dial, log outcomes, and pull their own numbers — without asking an admin for help.\n\nExample: a five-seat outbound pod running email plus LinkedIn cares most about cadence mechanics — domain warm-up, sending limits per mailbox, reply and out-of-office detection, and whether replies create CRM tasks automatically. A tool with excellent data and a crude sequencer will quietly push them back into spreadsheets.\n\nExample: an eight-rep phone-led inside sales team has a different bar entirely. They judge connect rate, local presence behaviour, how fast dispositions are logged, and whether call notes and recordings land on the right CRM record without manual copying.\n\nBoth teams sit in the same category. Neither should buy the other's tool.",
    tip: "Time three real tasks in each trial with a rep, not a buyer: build a 50-contact list, run one cadence step, and pull yesterday's activity.",
  },
  {
    type: "step",
    id: "step-scale",
    stepNumber: 7,
    heading: "Plan for volume and stack sprawl",
    body: "Ask what breaks first when you double seats, sending volume, or list volume. Common answers: export caps, mailbox limits, deliverability, credit budgets, and dedupe quality.\n\nThen ask the harder question — how many tools will you be paying for in a year? Teams often buy a database, then a sequencer, then a dialer, then an enrichment API, and end up with overlapping spend and four places where contact data disagrees. Decide deliberately whether you want one broader platform with acceptable depth or best-in-class tools per job with a clear system of record.\n\nEither answer is defensible. Drifting into the second by accident is not.",
    tip: "Write down which single tool owns contact truth. Every other tool reads from it.",
  },
  {
    type: "feature-matrix",
    id: "feature-matrix",
    title: "Must-have vs nice-to-have capabilities",
    rows: [
      {
        feature: "Search filters that match your ICP",
        mustHave: true,
        niceToHave: false,
        notes: "Industry, title, seniority, headcount, region",
      },
      {
        feature: "Verified work email addresses",
        mustHave: true,
        niceToHave: false,
        notes: "Ask how verification is performed and refreshed",
      },
      {
        feature: "CRM sync with field mapping",
        mustHave: true,
        niceToHave: false,
        notes: "Two-way, with overwrite and dedupe rules",
      },
      {
        feature: "Credit and usage visibility",
        mustHave: true,
        niceToHave: false,
        notes: "Reps and admins can see burn before it runs out",
      },
      {
        feature: "Export / API access to your records",
        mustHave: true,
        niceToHave: false,
        notes: "Confirm caps and plan gates before signing",
      },
      {
        feature: "Suppression and do-not-contact handling",
        mustHave: true,
        niceToHave: false,
        notes: "Needed the day you start sending",
      },
      {
        feature: "Direct dials and mobile numbers",
        mustHave: false,
        niceToHave: true,
        notes: "Flips to must-have for phone-led teams",
      },
      {
        feature: "Multichannel sequences",
        mustHave: false,
        niceToHave: true,
        notes: "Must-have only if engagement is your primary job",
      },
      {
        feature: "Power or parallel dialer",
        mustHave: false,
        niceToHave: true,
        notes: "Judge on connect rate and logging, not seat count",
      },
      {
        feature: "Buying-intent signals",
        mustHave: false,
        niceToHave: true,
        notes: "Useful once list building is already reliable",
      },
      {
        feature: "AI research and writing agents",
        mustHave: false,
        niceToHave: true,
        notes: "Do not let this drive the buy",
      },
    ],
  },
  {
    type: "size-match",
    id: "size-diagram",
    title: "Sales intelligence by team size",
    tiers: [
      {
        id: "solo",
        label: "Solo / founder-led",
        description:
          "Low commitment beats depth. Credits you can stop buying are worth more than platform breadth you will not use.",
        fitHints: ["Pay-as-you-go credits", "Browser extension lookups"],
      },
      {
        id: "sdr-pod",
        label: "1–3 SDRs",
        description:
          "One repeatable weekly list-building loop plus a sequencer. Governance is light; consistency matters more.",
        fitHints: ["Shared saved searches", "Simple CRM push"],
      },
      {
        id: "revenue-team",
        label: "4–15 reps",
        description:
          "Enrichment, dedupe, and reporting start mattering weekly. Someone must own contact data quality.",
        fitHints: ["Field mapping rules", "Usage and credit reporting"],
      },
      {
        id: "enterprise",
        label: "16+ reps / multi-pod",
        description:
          "Data governance, territory rules, security review, and integration depth dominate the decision.",
        fitHints: ["SSO / audit", "API + warehouse sync"],
      },
    ],
  },
  {
    type: "integration-ecosystem",
    id: "integration-diagram",
    title: "Where the tool sits in your stack",
    hubLabel: "Sales intelligence",
    body: "Sales intelligence feeds your system of record — it should not become one. Map every connection before you buy, and name the tool that owns contact truth.",
    systems: [
      { id: "crm", label: "CRM (system of record)" },
      { id: "email", label: "Email & calendar" },
      { id: "linkedin", label: "LinkedIn" },
      { id: "sequencer", label: "Sequencer / cadence" },
      { id: "dialer", label: "Dialer & phone" },
      { id: "enrichment-api", label: "Enrichment API / webhooks" },
      { id: "warehouse", label: "Warehouse & BI" },
      { id: "ipaas", label: "Zapier / iPaaS" },
    ],
  },
  {
    type: "cost-breakdown",
    id: "cost-breakdown",
    title: "True cost breakdown",
    body: "Model total cost from published pricing pages and your own written quote. SoftwareGlimpse does not estimate totals for you, and “from $X” marketing figures rarely include the plan tier your must-haves live on.",
    lines: [
      {
        label: "Seats × plan tier",
        description:
          "The tier that actually includes your must-haves — export rights and CRM sync are commonly gated above entry plans.",
      },
      {
        label: "Credits and exports",
        description:
          "What one credit unlocks, whether emails and phone numbers cost the same, monthly caps, and rollover.",
      },
      {
        label: "Mid-cycle top-ups",
        description:
          "What you pay when a campaign runs hot and credits run out before the renewal date.",
      },
      {
        label: "Adjacent tools you still need",
        description:
          "A data tool rarely removes your sequencer, dialer, or CRM spend. Count the whole stack, not the new line item.",
      },
      {
        label: "Data hygiene and ops time",
        description:
          "Weekly dedupe, field mapping, and suppression-list upkeep is real cost even when it is nobody's job title.",
      },
    ],
  },
  {
    type: "comparison-framework",
    id: "comparison-framework",
    title: "Comparison framework (weight these yourself)",
    criteria: [
      {
        id: "job-fit",
        label: "Primary job fit",
        weight: 5,
        description: "The tool's core product is the job you named in step 1.",
      },
      {
        id: "coverage",
        label: "Coverage on your ICP",
        weight: 5,
        description:
          "Usable records for your industry, seniority band, and region — measured on your own accounts.",
      },
      {
        id: "credit-clarity",
        label: "Credit & export clarity",
        weight: 4,
        description:
          "Credit definitions, caps, rollover, top-ups, and your right to export your data.",
      },
      {
        id: "crm-sync",
        label: "CRM sync reality",
        weight: 4,
        description:
          "Two-way sync with field mapping, dedupe matching, and documented conflict rules.",
      },
      {
        id: "compliance",
        label: "Sourcing & compliance posture",
        weight: 3,
        description:
          "Documented data origin, opt-out handling, and processing terms your privacy owner can review.",
      },
      {
        id: "workflow",
        label: "Rep workflow fit",
        weight: 3,
        description:
          "A non-admin rep can complete a full day without asking for help.",
      },
    ],
  },
  {
    type: "crm-types",
    id: "si-types",
    title: "Which type of sales intelligence tool fits?",
    types: [
      {
        id: "contact-database",
        title: "Contact database",
        bestFor:
          "Teams that must build net-new prospect lists on a repeatable weekly cadence.",
        avoidWhen:
          "Your accounts are already known and the gap is missing fields, not missing companies.",
      },
      {
        id: "enrichment",
        title: "Enrichment & intent",
        bestFor:
          "Revenue teams completing and refreshing records they already own, and prioritizing known accounts.",
        avoidWhen:
          "You have no usable base list yet — enrichment cannot fill a database you do not have.",
      },
      {
        id: "engagement",
        title: "Sales engagement",
        bestFor:
          "Outbound pods whose bottleneck is follow-up: sequences, reply handling, deliverability.",
        avoidWhen:
          "Your data is the weak link. Faster sending on bad records just burns domains.",
      },
      {
        id: "dialer",
        title: "Dialer & phone",
        bestFor:
          "Phone-led teams where connect volume, local presence, and call logging decide the quarter.",
        avoidWhen:
          "Your motion is email-first and calls are occasional — a full dialer is overhead.",
      },
    ],
  },
  {
    type: "product-shortlist",
    id: "shortlist",
    title: "Sales intelligence shortlist (catalogue examples)",
    body: "Evaluation starting points from the SoftwareGlimpse sales intelligence catalogue, listed alphabetically as examples — not a ranking and not affiliate-ordered. The researched, criteria-based ranking lives on Best Sales Intelligence Software (linked below); use this list to start scoring against the framework above.",
    productSlugs: [
      "amplemarket",
      "apollo",
      "bookyourdata",
      "kixie",
      "lusha",
      "reply",
    ],
    disclaimer:
      "Affiliate relationships never determine which products appear here or in what order.",
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Common mistakes when choosing sales intelligence software",
    items: [
      {
        title: "Buying database size instead of coverage",
        body: "A huge global index can still be thin in your vertical or region. Test 200 of your own accounts.",
      },
      {
        title: "Ignoring what a credit actually buys",
        body: "Per-seat price looks comparable until you learn one tool charges separately for mobile numbers.",
      },
      {
        title: "Treating the tool as the system of record",
        body: "Contact truth belongs in one place. Let the data tool feed the CRM, not compete with it.",
      },
      {
        title: "Sending before deliverability is set up",
        body: "New domains, no warm-up, and a big list is how teams burn sending reputation in week one.",
      },
      {
        title: "Choosing from affiliate lists alone",
        body: "Commissions never equal fit. Use the framework, then trial against your workflow.",
      },
      {
        title: "Nobody owns data hygiene",
        body: "Without a named owner for dedupe, mapping, and suppression, record quality decays within a quarter.",
      },
    ],
  },
  {
    type: "checklist",
    id: "demo-checklist",
    title: "Questions to ask during a demo or trial",
    copyable: true,
    items: [
      {
        id: "q1",
        label: "Search our real ICP live",
        description: "Our industry, titles, headcount band, and region — in the trial, not a canned demo.",
        order: 0,
      },
      {
        id: "q2",
        label: "What does one credit unlock?",
        description: "Emails vs phone numbers, rollover, monthly caps, mid-cycle top-ups.",
        order: 1,
      },
      {
        id: "q3",
        label: "Show two-way CRM sync",
        description: "Field mapping, duplicate matching, and which side wins on conflict.",
        order: 2,
      },
      {
        id: "q4",
        label: "Where does your data come from?",
        description: "Sourcing, refresh cadence, opt-out and deletion handling, regional processing terms.",
        order: 3,
      },
      {
        id: "q5",
        label: "Export and API rights",
        description: "Can we pull our records out in bulk, on our plan, without an upgrade?",
        order: 4,
      },
      {
        id: "q6",
        label: "Deliverability controls",
        description: "Sending limits per mailbox, warm-up, reply and bounce handling.",
        order: 5,
      },
      {
        id: "q7",
        label: "What breaks at double volume?",
        description: "Seats, sending, list size — name the first constraint we will hit.",
        order: 6,
      },
    ],
  },
  {
    type: "trial-plan",
    id: "trial-plan",
    title: "7-day evaluation plan",
    days: [
      {
        day: 1,
        focus: "Define the job",
        tasks: [
          "Write the one blocking job as an observable weekly outcome",
          "Pick 200 real target accounts to test against",
        ],
      },
      {
        day: 2,
        focus: "Coverage test",
        tasks: [
          "Search the same two roles in every shortlisted tool",
          "Count records found, usable emails, and usable phone numbers",
        ],
      },
      {
        day: 3,
        focus: "Verify by hand",
        tasks: [
          "Spot-check 20 records per tool for accuracy and freshness",
          "Note stale titles and wrong-company matches",
        ],
      },
      {
        day: 4,
        focus: "CRM sync",
        tasks: [
          "Push 50 records into a sandbox or small segment",
          "Check duplicates, field mapping, and overwrite behaviour",
        ],
      },
      {
        day: 5,
        focus: "Workflow with a rep",
        tasks: [
          "Have one non-admin rep run a full day unaided",
          "Time list build, one cadence step or call block, and activity logging",
        ],
      },
      {
        day: 6,
        focus: "Commercials & compliance",
        tasks: [
          "Get a written quote for your first-90-day volume",
          "Send sourcing and processing terms to your privacy owner",
        ],
      },
      {
        day: 7,
        focus: "Decision memo",
        tasks: [
          "Score each tool against your weighted criteria",
          "Document go / no-go, the owner of data hygiene, and open risks",
        ],
      },
    ],
  },
  {
    type: "scorecard",
    id: "scorecard",
    title: "Decision scorecard",
    body: "Score your shortlist 0–5 on each criterion using what you observed in the trial. Weights mirror the framework above. Your scores stay in this browser — they are your evaluation, not SoftwareGlimpse ratings.",
    criteria: [
      { id: "job-fit", label: "Primary job fit", weight: 5 },
      { id: "coverage", label: "Coverage on your ICP", weight: 5 },
      { id: "credit-clarity", label: "Credit & export clarity", weight: 4 },
      { id: "crm-sync", label: "CRM sync reality", weight: 4 },
      { id: "compliance", label: "Sourcing & compliance posture", weight: 3 },
      { id: "workflow", label: "Rep workflow fit", weight: 3 },
    ],
    productSlugs: ["apollo", "bookyourdata", "reply"],
  },
  {
    type: "interactive-cta",
    id: "next-step",
    title: "Ready to shortlist?",
    body: "Once you know your primary job, compare researched options against the sales intelligence criteria — contact data, prospecting, enrichment, outreach, CRM sync, usability, reporting, and value. Affiliate status never changes the order.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best Sales Intelligence Software →",
    variant: "generic",
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched ranking with an explicit methodology.",
      },
      {
        href: "/categories/sales-intelligence/",
        label: "Sales intelligence category",
        description: "Browse the full catalogue and subcategories.",
      },
      {
        href: "/use-cases/prospecting/",
        label: "Prospecting use case",
        description: "Find and prioritize accounts before the first conversation.",
      },
      {
        href: "/use-cases/sales-engagement/",
        label: "Sales engagement use case",
        description: "Coordinate calling, messaging, and cadences around CRM records.",
      },
      {
        href: "/use-cases/email-outreach/",
        label: "Email outreach use case",
        description: "Keep sequences and replies on shared CRM contact records.",
      },
      // No /use-cases/data-enrichment/ hub yet — SI onboarding lists it as a content-candidate only.
      {
        href: "/software/apollo/",
        label: "Apollo.io review",
        description: "Combined contact database and native engagement.",
      },
      {
        href: "/software/bookyourdata/",
        label: "BookYourData review",
        description: "Pay-as-you-go verified list building.",
      },
      {
        href: "/software/reply/",
        label: "Reply.io review",
        description: "Multichannel sequences and outreach execution.",
      },
      {
        href: "/software/kixie/",
        label: "Kixie review",
        description: "CRM-connected dialer for phone-led outbound.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Pick the system of record your data tool will feed.",
      },
      {
        href: "/guides/crm-data-hygiene/",
        label: "CRM data hygiene",
        description: "Keep enriched records trustworthy after import.",
      },
      {
        href: "/tools/sales-intelligence-finder/",
        label: "Sales Intelligence Finder",
        description: "Shortlist SI tools by primary job and requirements.",
      },
      {
        href: "/tools/sales-intelligence-requirements-builder/",
        label: "SI Requirements Builder",
        description: "Build coverage, sync, credits and compliance must-haves.",
      },
      {
        href: "/tools/sales-intelligence-vendor-scorecard/",
        label: "SI Vendor Scorecard",
        description: "Score shortlisted vendors on your criteria.",
      },
      {
        href: "/tools/sales-intelligence-demo-checklist-builder/",
        label: "SI Demo Checklist",
        description: "Script coverage tests and trial evidence.",
      },
      {
        href: "/tools/sales-intelligence-cost-calculator/",
        label: "SI Cost Calculator",
        description: "Seat estimates where verified; credits stay quote-required.",
      },
      {
        href: "/tools/software-stack-builder/",
        label: "Software Stack Builder",
        description: "Map data, engagement, and dialer tools across your stack.",
      },
      {
        href: "/guides/",
        label: "All software buying guides",
        description: "Browse the SoftwareGlimpse guide library.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How do I choose sales intelligence software?",
        answer:
          "Start from the primary job — data, enrichment, engagement, or dialer — and shortlist only tools whose core product is that job. Then test coverage on 200 of your own target accounts, decode the credit and export model, verify two-way CRM sync, review data sourcing with your own privacy owner, and have a non-admin rep run a full day in the trial.",
      },
      {
        question: "Is sales intelligence software a CRM replacement?",
        answer:
          "No. Treat it as a data and execution layer that feeds your system of record. Some platforms include lightweight CRM features, but contact truth, ownership, and pipeline reporting should live in one place — see how to choose a CRM if you do not have that place yet.",
      },
      {
        question: "Do I need one platform or several tools?",
        answer:
          "It depends on which jobs actually block you. One broader platform reduces integration work and vendor count; separate best-in-class tools give more depth per job. Either is fine as a deliberate choice — what fails is drifting into four overlapping subscriptions with no agreed owner of contact data.",
      },
      {
        question: "How much does sales intelligence software cost?",
        answer:
          "Pricing is usually per seat plus credits, and the credit definition varies enough between vendors that list prices are not directly comparable. Use each vendor's published pricing page and a written quote for your first-90-day volume — including backfill, monthly net-new, and export rights.",
      },
      {
        question: "What is the fastest way to spot bad data in a trial?",
        answer:
          "Take 20 records you can verify independently — people you know, accounts you already sell to, or public leadership pages — and check title, company, and contact details by hand. Example: a solo RevOps owner sampled 500 of 18,000 CRM records and found match rate, not database size, was the only number that changed the decision.",
      },
      {
        question: "Does GDPR affect how I use this software?",
        answer:
          "It can. Compliance depends on data sourcing, lawful basis, opt-out handling, and how you use records — not on the vendor alone. Review each vendor's sourcing and processing terms with your own legal or privacy owner before prospecting in the EU, UK, or a regulated industry. This guide is not legal advice.",
      },
      {
        question: "Do affiliate relationships affect these recommendations?",
        answer:
          "No. Affiliate status does not set rankings, shortlist order, or scorecard results on SoftwareGlimpse. Rankings on Best pages follow the published sales intelligence methodology.",
      },
    ],
  },
];

export const howToChooseSalesIntelligenceGuide: GuidePage = {
  id: "guide-how-to-choose-sales-intelligence",
  slug: "how-to-choose-sales-intelligence",
  title: "How to Choose Sales Intelligence Software",
  summary:
    "A decision framework for picking sales intelligence software by primary job — contact data, enrichment, engagement, or dialer — then testing coverage, credits, CRM sync, compliance, and rep workflow before you commit.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [
    "apollo",
    "bookyourdata",
    "reply",
    "kixie",
    "lusha",
    "amplemarket",
  ],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/how-to-choose-sales-intelligence-hero.png",
    alt: "Choose sales intelligence software by primary job: four labelled panels for data (contact search), enrichment (record fields and match rate), engagement (multi-step cadence), and dialer (call bar and dispositions), beside a verification checklist for credits, CRM sync, compliance, deliverability, and rep workflow.",
  },
  supports: [
    {
      contentId: "content:category:sales-intelligence",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:tool:sales-intelligence-finder",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:sales-intelligence-software",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:use-case:prospecting",
      relationType: "answers-question-for",
      primary: false,
    },
    {
      contentId: "content:use-case:sales-engagement",
      relationType: "answers-question-for",
      primary: false,
    },
    {
      contentId: "content:use-case:email-outreach",
      relationType: "answers-question-for",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:sales-intelligence-finder",
    label: "Try the Sales Intelligence Finder",
  },
  relatedGuideSlugs: [
    "how-to-choose-crm",
    "crm-data-hygiene",
    "crm-automation-best-practices",
  ],
  checklist: [],
  blocks: howToChooseSalesIntelligenceBlocks as GuidePage["blocks"],
  sections: [
    {
      id: "quick-answer",
      heading: "Quick answer",
      body: "Pick sales intelligence software by the primary job it must do — data, enrichment, engagement, or dialer — not by brand marketing or an all-in-one badge.",
    },
    {
      id: "step-job",
      heading: "Name the primary job before you name a vendor",
      body: "For example, a three-person SDR pod blocked on weekly list building is buying a contact database, while a solo RevOps owner with 18,000 incomplete records is buying enrichment. Same category, different shortlist.",
    },
    {
      id: "step-coverage",
      heading: "Test coverage on your own ICP",
      body: "Search 200 of your real target accounts in every shortlisted tool and count usable records — a scenario no vendor demo will run for you.",
    },
  ],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T06:30:00.000Z",
    publishedAt: "2026-08-17T06:00:00.000Z",
    reviewedAt: "2026-08-17T06:30:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "How to Choose Sales Intelligence Software | SoftwareGlimpse",
    description:
      "Decision framework for choosing sales intelligence software: pick by primary job (data, enrichment, engagement, dialer), then test coverage, credits, CRM sync, compliance, and rep workflow.",
    canonicalPath: "/guides/how-to-choose-sales-intelligence/",
    indexable: true,
  },
};
