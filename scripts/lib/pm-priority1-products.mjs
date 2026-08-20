/**
 * Project Management Priority-1 credibility products (non-affiliate).
 * Asana, ClickUp, Jira, Notion — research floors 2026-08-17.
 * Affiliate economics never enter scores. handsOnTesting=false.
 */

import { expandPmProduct } from "./pm-compact-expand.mjs";

const COMPACT = [
  {
    "slug": "asana",
    "name": "Asana",
    "company": "Asana, Inc.",
    "website": "https://asana.com",
    "domain": "asana.com",
    "pricingUrl": "https://asana.com/pricing",
    "aliases": [
      "Asana Work Management"
    ],
    "membershipRole": "primary",
    "jobCluster": "work-os",
    "softShortDescription": "Cross-functional work management with goals, workflows and AI Studio — Starter from $10.99/user/mo annual.",
    "shortDescription": "Asana is a work management platform for tasks, projects, portfolios and goals with strong adoption for marketing, ops and cross-functional teams. Free covers limited users; Starter is $10.99/user/mo annual; Advanced $24.99; Enterprise custom. AI Studio / AI Teammates packaging rides paid tiers with credit models — confirm live. Distinct from engineering trackers like Jira.",
    "vendorPositioning": "The work management platform that helps teams orchestrate work from daily tasks to strategic goals.",
    "pricingModel": "freemium",
    "hasFreePlan": true,
    "hasFreeTrial": true,
    "startingPriceMonthly": 10.99,
    "startingPriceConfidence": "high",
    "pricingNotes": "Cross-checked 2026-08-17: Free (limited users); Starter $10.99 / Advanced $24.99 per user/mo annual; Enterprise quote. Monthly higher. AI Studio/Teammates on paid tiers with credits — confirm live asana.com/pricing.",
    "pricingSummary": "Free limited; Starter $10.99, Advanced $24.99 per user/mo annual; Enterprise custom. AI on paid tiers. Confirm live.",
    "plans": [
      {
        "kind": "free",
        "slug": "free",
        "name": "Personal/Free",
        "description": "Free plan with limited seats/features for small teams."
      },
      {
        "kind": "per-seat-annual",
        "slug": "starter",
        "amount": 10.99,
        "name": "Starter",
        "highlighted": true,
        "description": "$10.99/user/mo billed annually — entry paid work management."
      },
      {
        "kind": "per-seat-annual",
        "slug": "advanced",
        "amount": 24.99,
        "name": "Advanced",
        "description": "$24.99/user/mo annual — goals, forms, reporting depth and stronger automation."
      },
      {
        "kind": "contact-sales",
        "slug": "enterprise",
        "name": "Enterprise",
        "description": "Enterprise — custom quote for governance and scale."
      }
    ],
    "featureOverrides": {
      "task-boards": "supported",
      "timeline-gantt": "supported",
      "workload-resources": "higher-plan-only",
      "automations-workflows": "supported",
      "time-tracking": "higher-plan-only",
      "docs-collaboration": "supported",
      "integrations-ecosystem": "supported",
      "reporting-dashboards": "supported",
      "ai-assistance": "add-on",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported"
    },
    "aiLines": [
      "AI assistant: add-on",
      "AI summaries: add-on",
      "AI automation: supported",
      "AI recommendations: add-on"
    ],
    "integrations": [
      {
        "integrationSlug": "slack",
        "kind": "native"
      },
      {
        "integrationSlug": "microsoft-teams",
        "kind": "native"
      },
      {
        "integrationSlug": "google-workspace",
        "kind": "native"
      },
      {
        "integrationSlug": "salesforce",
        "kind": "native"
      },
      {
        "integrationSlug": "zapier",
        "kind": "zapier-style"
      }
    ],
    "scores": {
      "ease-of-use": 9,
      "work-planning": 9,
      "automation-workflows": 8,
      "collaboration": 9,
      "integrations": 8,
      "reporting": 8,
      "scalability": 8,
      "value-for-money": 7,
      "ai-capabilities": 8
    },
    "bestFor": [
      "Cross-functional marketing/ops teams",
      "Buyers prioritising adoption ease and goals/workflows",
      "Mid-market work management shortlists"
    ],
    "notIdealFor": [
      "Engineering sprint orgs that need Jira/Linear",
      "Teams wanting the cheapest all-in-one seat (ClickUp)",
      "Docs-only wikis (Notion)"
    ],
    "pros": [
      "Excellent cross-functional adoption story",
      "Goals + portfolio narrative",
      "Strong templates and workflow clarity",
      "Published Starter/Advanced floors",
      "AI Studio on paid tiers"
    ],
    "cons": [
      "Starter floor above ClickUp Unlimited",
      "Deep reporting/automation often Advanced-gated",
      "Not an eng issue tracker",
      "AI credits add TCO",
      "Can feel light vs monday for ops configurability"
    ],
    "keyFeatures": [
      "Tasks/projects/portfolios",
      "Timeline and workload views",
      "Rules/workflows",
      "Goals",
      "Dashboards",
      "AI Studio"
    ],
    "whoShouldChoose": "Choose Asana when cross-functional teams need clear ownership, goals and workflows without an engineering-tracker learning curve.",
    "whoShouldConsiderAlternatives": "Compare monday.com/ClickUp for Work OS configurability, Hive for lower SMB floors, and Jira/Linear if the buyer job is software delivery.",
    "alternativeSlugs": [
      "monday",
      "clickup",
      "hive"
    ],
    "competitorSlugs": [
      "monday",
      "clickup",
      "hive",
      "jira",
      "notion",
      "wrike"
    ],
    "comparableSlugs": [
      "monday",
      "clickup",
      "hive"
    ],
    "useCaseSlugs": [
      "work-management",
      "project-tracking",
      "team-collaboration-work",
      "resource-planning"
    ],
    "businessSizeSlugs": [
      "small-business",
      "mid-market",
      "enterprise"
    ],
    "teamTypeSlugs": [
      "operations",
      "marketing",
      "project-managers"
    ],
    "limitations": [
      "Advanced features and deeper automation often require Advanced+",
      "AI Studio credit packaging can raise TCO beyond Starter seat floors",
      "Not optimised as an engineering sprint tracker",
      "Free plan is limited versus ClickUp’s unlimited-user Free narrative"
    ],
    "scoreRationales": {
      "ease-of-use": "Asana is repeatedly positioned for fast adoption by non-technical cross-functional teams — high ease vs engineering trackers.",
      "work-planning": "Tasks, projects, timelines, portfolios and goals give a strong Work OS planning envelope peer to monday.com.",
      "automation-workflows": "Rules and workflow builders are strong on Advanced+; Starter is lighter — held at 8 vs monday’s 9.",
      "collaboration": "Comments, proofing-adjacent workflows and cross-team ownership are core strengths.",
      "integrations": "Broad native + Zapier ecosystem; slightly behind monday’s published breadth narrative.",
      "reporting": "Dashboards and goals reporting solid on Advanced; not a BI suite.",
      "scalability": "Clear Free → Starter → Advanced → Enterprise path for mid-market and up.",
      "value-for-money": "Starter $10.99 sits above ClickUp/monday Basic floors; capability justifies mid-market spend. Affiliate economics excluded.",
      "ai-capabilities": "AI Studio / Teammates marketed on paid tiers with credit packaging — strong capability with TCO friction."
    }
  },
  {
    "slug": "clickup",
    "name": "ClickUp",
    "company": "Mango Technologies, Inc.",
    "website": "https://clickup.com",
    "domain": "clickup.com",
    "pricingUrl": "https://clickup.com/pricing",
    "aliases": [
      "ClickUp Work OS"
    ],
    "membershipRole": "primary",
    "jobCluster": "work-os",
    "softShortDescription": "All-in-one configurable Work OS (tasks, docs, dashboards, ClickUp Brain) — Unlimited from $7/user/mo annual.",
    "shortDescription": "ClickUp is a highly configurable work OS spanning tasks, Docs, Whiteboards, Dashboards and ClickUp Brain AI. Free allows unlimited members with storage/feature caps. Unlimited $7/user/mo annual; Business $12; Business Plus ~$19; Enterprise custom. Feature breadth is the pitch — configuration overhead is the trade-off.",
    "vendorPositioning": "One app to replace them all — tasks, docs, chat, goals and AI in a single Work OS.",
    "pricingModel": "freemium",
    "hasFreePlan": true,
    "hasFreeTrial": true,
    "startingPriceMonthly": 7,
    "startingPriceConfidence": "high",
    "pricingNotes": "Cross-checked 2026-08-17: Free unlimited members (storage/feature caps); Unlimited $7, Business $12, Business Plus ~$19 per user/mo annual; Enterprise quote. Confirm live clickup.com/pricing and Brain packaging.",
    "pricingSummary": "Free unlimited members (capped). Unlimited $7, Business $12, Business Plus ~$19 annual; Enterprise custom. Confirm Brain AI live.",
    "plans": [
      {
        "kind": "free",
        "slug": "free",
        "name": "Free Forever",
        "description": "Unlimited members with storage and feature caps."
      },
      {
        "kind": "per-seat-annual",
        "slug": "unlimited",
        "amount": 7,
        "name": "Unlimited",
        "highlighted": true,
        "description": "$7/user/mo annual — entry paid Work OS breadth."
      },
      {
        "kind": "per-seat-annual",
        "slug": "business",
        "amount": 12,
        "name": "Business",
        "description": "$12/user/mo annual — dashboards, automation depth, advanced views."
      },
      {
        "kind": "per-seat-annual",
        "slug": "business-plus",
        "amount": 19,
        "name": "Business Plus",
        "description": "~$19/user/mo annual — higher admin/automation ceiling before Enterprise."
      },
      {
        "kind": "contact-sales",
        "slug": "enterprise",
        "name": "Enterprise",
        "description": "Enterprise — custom quote."
      }
    ],
    "featureOverrides": {
      "task-boards": "supported",
      "timeline-gantt": "supported",
      "workload-resources": "supported",
      "automations-workflows": "supported",
      "time-tracking": "supported",
      "docs-collaboration": "supported",
      "integrations-ecosystem": "supported",
      "reporting-dashboards": "supported",
      "ai-assistance": "add-on",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported"
    },
    "aiLines": [
      "AI assistant: add-on",
      "AI summaries: add-on",
      "AI automation: supported",
      "AI recommendations: add-on"
    ],
    "integrations": [
      {
        "integrationSlug": "slack",
        "kind": "native"
      },
      {
        "integrationSlug": "google-workspace",
        "kind": "native"
      },
      {
        "integrationSlug": "github",
        "kind": "native"
      },
      {
        "integrationSlug": "zapier",
        "kind": "zapier-style"
      }
    ],
    "scores": {
      "ease-of-use": 7,
      "work-planning": 9,
      "automation-workflows": 9,
      "collaboration": 8,
      "integrations": 8,
      "reporting": 8,
      "scalability": 8,
      "value-for-money": 9,
      "ai-capabilities": 8
    },
    "bestFor": [
      "Teams consolidating tasks+docs+dashboards",
      "Budget-conscious Work OS buyers",
      "Highly configurable ops teams"
    ],
    "notIdealFor": [
      "Teams wanting minimal setup (Asana)",
      "Pure eng sprint shops (Jira/Linear)",
      "Buyers allergic to configuration sprawl"
    ],
    "pros": [
      "Best-in-class published entry seat ($7 Unlimited)",
      "Feature breadth (tasks/docs/whiteboards/AI)",
      "Unlimited-member Free",
      "Strong automation story",
      "Business tier value"
    ],
    "cons": [
      "Steeper learning curve / over-configuration risk",
      "UI density can overwhelm",
      "Brain packaging must be confirmed for TCO",
      "Not the simplest cross-functional default",
      "Governance needs discipline at scale"
    ],
    "keyFeatures": [
      "Tasks + multiple views",
      "Docs & Whiteboards",
      "Dashboards",
      "Automations",
      "Time tracking",
      "ClickUp Brain"
    ],
    "whoShouldChoose": "Choose ClickUp when you want an all-in-one configurable Work OS at a competitive seat floor and can invest in setup discipline.",
    "whoShouldConsiderAlternatives": "Compare Asana for easier adoption, monday.com for mainstream Work OS polish, and Jira if engineering delivery is the primary job.",
    "alternativeSlugs": [
      "asana",
      "monday",
      "hive"
    ],
    "competitorSlugs": [
      "asana",
      "monday",
      "hive",
      "notion",
      "jira",
      "wrike"
    ],
    "comparableSlugs": [
      "asana",
      "monday",
      "hive"
    ],
    "useCaseSlugs": [
      "work-management",
      "project-tracking",
      "team-collaboration-work"
    ],
    "businessSizeSlugs": [
      "micro",
      "small-business",
      "mid-market",
      "enterprise"
    ],
    "teamTypeSlugs": [
      "operations",
      "project-managers",
      "founders"
    ],
    "limitations": [
      "Configuration sprawl without admin standards",
      "AI Brain packaging can add cost beyond Unlimited floors",
      "Steeper onboarding than Asana for non-technical teams",
      "Some dashboard/automation depth is Business-gated"
    ],
    "scoreRationales": {
      "ease-of-use": "Extreme configurability raises learning curve vs Asana — powerful but easier to overbuild.",
      "work-planning": "Tasks, multiple views, Docs and dashboards deliver top-tier planning breadth.",
      "automation-workflows": "Automations and Brain-assisted workflows are a first-party strength on paid plans.",
      "collaboration": "Docs, comments and chat-adjacent surfaces are strong; can sprawl without admin discipline.",
      "integrations": "Wide connector set; ecosystem narrative competitive with monday/Asana.",
      "reporting": "Dashboards strong on Business+; Free/Unlimited more limited.",
      "scalability": "Free → Unlimited → Business → Enterprise scales from SMB to larger orgs.",
      "value-for-money": "Unlimited $7 annual is among the strongest Work OS published floors. Affiliate economics excluded.",
      "ai-capabilities": "ClickUp Brain is marketed across the stack; confirm credit/add-on packaging live."
    }
  },
  {
    "slug": "jira",
    "name": "Jira",
    "company": "Atlassian",
    "website": "https://www.atlassian.com/software/jira",
    "domain": "atlassian.com",
    "pricingUrl": "https://www.atlassian.com/software/jira/pricing",
    "aliases": [
      "Jira Software",
      "Jira Cloud",
      "Atlassian Jira"
    ],
    "membershipRole": "primary",
    "jobCluster": "eng-tracker",
    "softShortDescription": "Atlassian Agile issue tracker for software teams — Free ≤10; Standard from ~$8.15/user/mo annual.",
    "shortDescription": "Jira is the default engineering / Agile work tracker for sprints, backlogs, workflows and DevOps integrations. Free covers up to 10 users; Standard ~$8.15/user/mo annual; Premium ~$16; Enterprise custom. Best for software orgs — not a general marketing Work OS peer on undifferentiated ranks.",
    "vendorPositioning": "The #1 software development tool used by agile teams — plan, track and release with Jira.",
    "pricingModel": "freemium",
    "hasFreePlan": true,
    "hasFreeTrial": true,
    "startingPriceMonthly": 8.15,
    "startingPriceConfidence": "medium",
    "pricingNotes": "Cross-checked 2026-08-17: Jira Cloud Free ≤10 users; Standard ~$7.91–$8.15 / Premium ~$14.54–$16 per user/mo annual (Atlassian list floors vary by region/promo — medium confidence). Enterprise quote. Confirm live atlassian.com/software/jira/pricing.",
    "pricingSummary": "Free ≤10 users; Standard ~$8.15, Premium ~$16 per user/mo annual; Enterprise custom. Confirm live Atlassian list.",
    "plans": [
      {
        "kind": "free",
        "slug": "free",
        "name": "Free",
        "limits": {
          "maxUsers": 10
        },
        "description": "Free for up to 10 users with storage caps."
      },
      {
        "kind": "per-seat-annual",
        "slug": "standard",
        "amount": 8.15,
        "name": "Standard",
        "highlighted": true,
        "description": "~$8.15/user/mo annual (medium confidence) — core Jira Cloud for growing eng teams."
      },
      {
        "kind": "per-seat-annual",
        "slug": "premium",
        "amount": 16,
        "name": "Premium",
        "description": "~$16/user/mo annual (medium) — advanced roadmaps, storage and support depth."
      },
      {
        "kind": "contact-sales",
        "slug": "enterprise",
        "name": "Enterprise",
        "description": "Enterprise — custom Atlassian quote for scale/governance."
      }
    ],
    "featureOverrides": {
      "task-boards": "supported",
      "timeline-gantt": "supported",
      "workload-resources": "higher-plan-only",
      "automations-workflows": "supported",
      "time-tracking": "supported",
      "docs-collaboration": "limited",
      "integrations-ecosystem": "supported",
      "reporting-dashboards": "supported",
      "ai-assistance": "add-on",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported"
    },
    "aiLines": [
      "AI assistant: add-on",
      "AI summaries: add-on",
      "AI automation: limited",
      "AI recommendations: add-on"
    ],
    "integrations": [
      {
        "integrationSlug": "github",
        "kind": "native"
      },
      {
        "integrationSlug": "gitlab",
        "kind": "native"
      },
      {
        "integrationSlug": "slack",
        "kind": "native"
      },
      {
        "integrationSlug": "confluence",
        "kind": "native"
      },
      {
        "integrationSlug": "zapier",
        "kind": "zapier-style"
      }
    ],
    "scores": {
      "ease-of-use": 5,
      "work-planning": 9,
      "automation-workflows": 8,
      "collaboration": 6,
      "integrations": 9,
      "reporting": 8,
      "scalability": 10,
      "value-for-money": 8,
      "ai-capabilities": 6
    },
    "bestFor": [
      "Software engineering / Agile teams",
      "Orgs already on Atlassian",
      "Regulated/enterprise software delivery"
    ],
    "notIdealFor": [
      "Marketing/ops Work OS buyers (Asana/monday)",
      "Non-technical teams wanting simple boards (Trello/Asana)",
      "Docs-first knowledge work (Notion)"
    ],
    "pros": [
      "Industry default for eng Agile",
      "Free ≤10 users",
      "Deep DevOps integrations",
      "Enterprise scale path",
      "Premium roadmaps"
    ],
    "cons": [
      "Hard for non-engineers",
      "Admin overhead",
      "Docs usually need Confluence",
      "AI not the primary story",
      "Overkill for simple task lists"
    ],
    "keyFeatures": [
      "Scrum/Kanban boards",
      "Backlogs & sprints",
      "Custom workflows",
      "Roadmaps (Premium+)",
      "DevOps integrations",
      "Automation rules"
    ],
    "whoShouldChoose": "Choose Jira when software delivery, sprints and DevOps integration are the primary job — landscape on general Work OS lists.",
    "whoShouldConsiderAlternatives": "Compare Linear for a modern eng UX, ClickUp/Asana for cross-functional Work OS, and Trello for lightweight boards.",
    "alternativeSlugs": [
      "linear",
      "clickup",
      "asana"
    ],
    "competitorSlugs": [
      "linear",
      "clickup",
      "asana",
      "monday",
      "azure-devops"
    ],
    "comparableSlugs": [
      "linear",
      "clickup"
    ],
    "useCaseSlugs": [
      "project-tracking",
      "work-management"
    ],
    "businessSizeSlugs": [
      "small-business",
      "mid-market",
      "enterprise"
    ],
    "teamTypeSlugs": [
      "engineering",
      "project-managers"
    ],
    "limitations": [
      "Steep learning curve outside engineering",
      "Confluence often required for wiki/docs depth",
      "Premium features gated for advanced roadmaps/storage",
      "Not a marketing Work OS peer on undifferentiated ranks"
    ],
    "scoreRationales": {
      "ease-of-use": "Steep for non-engineers — admin/workflow complexity is the classic Jira trade-off.",
      "work-planning": "Best-in-class for sprints, backlogs, epics and issue workflows for software delivery.",
      "automation-workflows": "Powerful automation rules; often needs admin skill to keep healthy.",
      "collaboration": "Issue comments strong; docs collaboration usually pairs with Confluence — held at 6 for PM-suite comparison.",
      "integrations": "Deep DevOps + Atlassian ecosystem (Bitbucket, Confluence, GitHub/GitLab).",
      "reporting": "Dashboards, velocity and advanced roadmaps (Premium+) serve eng managers well.",
      "scalability": "Proven at enterprise software-org scale — top scalability score in this set.",
      "value-for-money": "Free ≤10 and ~$8 Standard floors are strong for eng teams. Affiliate economics excluded.",
      "ai-capabilities": "Atlassian Intelligence exists as add-on/bundle — not the product’s centre of gravity vs Motion/ClickUp Brain."
    }
  },
  {
    "slug": "notion",
    "name": "Notion",
    "company": "Notion Labs, Inc.",
    "website": "https://www.notion.so",
    "domain": "notion.so",
    "pricingUrl": "https://www.notion.so/pricing",
    "aliases": [
      "Notion Workspace",
      "Notion AI"
    ],
    "membershipRole": "primary",
    "jobCluster": "docs-first",
    "softShortDescription": "Docs-first workspace with databases and light project tracking — Plus from $10/user/mo annual; AI on Business.",
    "shortDescription": "Notion is a docs-first knowledge and database workspace used for wikis, specs and lightweight project tracking. Free for personal use; Plus ~$10/user/mo annual; Business ~$20 with Notion AI bundled in common 2026 packaging; Enterprise custom. Strong for knowledge work — lighter than dedicated Work OS peers for portfolio PM.",
    "vendorPositioning": "The AI workspace that works like a second brain — docs, wikis and projects in one place.",
    "pricingModel": "freemium",
    "hasFreePlan": true,
    "hasFreeTrial": true,
    "startingPriceMonthly": 10,
    "startingPriceConfidence": "high",
    "pricingNotes": "Cross-checked 2026-08-17: Free personal; Plus ~$10/user/mo annual; Business ~$20/user/mo annual with Notion AI commonly bundled; Enterprise custom. Confirm live notion.so/pricing (AI packaging has shifted historically).",
    "pricingSummary": "Free personal; Plus $10, Business ~$20 annual (AI often bundled on Business); Enterprise custom. Confirm live.",
    "plans": [
      {
        "kind": "free",
        "slug": "free",
        "name": "Free",
        "description": "Free for personal use with limited collaboration."
      },
      {
        "kind": "per-seat-annual",
        "slug": "plus",
        "amount": 10,
        "name": "Plus",
        "highlighted": true,
        "description": "$10/user/mo annual — collaborative docs/databases."
      },
      {
        "kind": "per-seat-annual",
        "slug": "business",
        "amount": 20,
        "name": "Business",
        "description": "~$20/user/mo annual — admin + Notion AI commonly included."
      },
      {
        "kind": "contact-sales",
        "slug": "enterprise",
        "name": "Enterprise",
        "description": "Enterprise — custom security/governance."
      }
    ],
    "featureOverrides": {
      "task-boards": "limited",
      "timeline-gantt": "limited",
      "workload-resources": "not-supported",
      "automations-workflows": "limited",
      "time-tracking": "not-supported",
      "docs-collaboration": "supported",
      "integrations-ecosystem": "supported",
      "reporting-dashboards": "limited",
      "ai-assistance": "higher-plan-only",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported"
    },
    "aiLines": [
      "AI assistant: higher-plan-only",
      "AI summaries: higher-plan-only",
      "AI automation: limited",
      "AI recommendations: higher-plan-only"
    ],
    "integrations": [
      {
        "integrationSlug": "slack",
        "kind": "native"
      },
      {
        "integrationSlug": "github",
        "kind": "native"
      },
      {
        "integrationSlug": "figma",
        "kind": "native"
      },
      {
        "integrationSlug": "zapier",
        "kind": "zapier-style"
      }
    ],
    "scores": {
      "ease-of-use": 8,
      "work-planning": 6,
      "automation-workflows": 6,
      "collaboration": 9,
      "integrations": 7,
      "reporting": 5,
      "scalability": 7,
      "value-for-money": 8,
      "ai-capabilities": 8
    },
    "bestFor": [
      "Docs-first teams and wikis",
      "Startups combining specs + light tasks",
      "Buyers who want Notion AI writing/search"
    ],
    "notIdealFor": [
      "Heavy portfolio/resource PM (monday/Wrike)",
      "Eng sprint orgs (Jira/Linear)",
      "Buyers needing native Gantt/workload depth"
    ],
    "pros": [
      "Best-in-class docs + databases",
      "Notion AI on Business",
      "Flexible templates",
      "Strong SMB/saas adoption",
      "Plus $10 floor"
    ],
    "cons": [
      "Weaker classic PM planning/reporting",
      "Can become a messy wiki without standards",
      "Not a Work OS peer on undifferentiated ranks",
      "AI tied to higher plans",
      "Automations thinner than ClickUp"
    ],
    "keyFeatures": [
      "Docs & wikis",
      "Databases & views",
      "Light project boards",
      "Notion AI",
      "Templates",
      "Integrations"
    ],
    "whoShouldChoose": "Choose Notion when documentation and flexible databases are the primary job, with light project tracking layered on — not as a pure Work OS substitute.",
    "whoShouldConsiderAlternatives": "Compare Asana/ClickUp/monday for dedicated Work OS execution, Airtable for heavier DB apps, and Jira for engineering delivery.",
    "alternativeSlugs": [
      "asana",
      "clickup",
      "airtable"
    ],
    "competitorSlugs": [
      "asana",
      "clickup",
      "airtable",
      "coda",
      "monday"
    ],
    "comparableSlugs": [
      "asana",
      "airtable"
    ],
    "useCaseSlugs": [
      "team-collaboration-work",
      "work-management"
    ],
    "businessSizeSlugs": [
      "micro",
      "small-business",
      "mid-market",
      "enterprise"
    ],
    "teamTypeSlugs": [
      "operations",
      "founders",
      "marketing"
    ],
    "limitations": [
      "Not a full Work OS for portfolio/resource management",
      "Reporting/dashboards thinner than dedicated PM tools",
      "Notion AI typically Business-gated",
      "Database sprawl without information architecture"
    ],
    "scoreRationales": {
      "ease-of-use": "Approachable for knowledge workers; databases can get complex but onboarding is friendlier than Jira.",
      "work-planning": "Light project tracking via databases/boards — not a dedicated Work OS planning depth peer.",
      "automation-workflows": "Automations exist but thinner than ClickUp/Asana/monday.",
      "collaboration": "Docs, comments and shared workspaces are Notion’s centre of gravity — top collaboration score.",
      "integrations": "Solid connector set; not as deep as monday/Jira ecosystems.",
      "reporting": "Limited native PM dashboards vs Work OS peers — held at 5.",
      "scalability": "Works for startups to mid-market knowledge orgs; enterprise governance on higher tiers.",
      "value-for-money": "Plus $10 is fair for docs+DB; Business AI bundle drives TCO. Affiliate economics excluded.",
      "ai-capabilities": "Notion AI is a major 2026 buying reason on Business — strong for writing/Q&A, not sprint AI."
    }
  }
];

export const PRODUCTS = COMPACT.map(expandPmProduct);

export const COMPARISON_PAIRS = [
  [
    "asana",
    "clickup"
  ],
  [
    "asana",
    "notion"
  ],
  [
    "clickup",
    "notion"
  ],
  [
    "asana",
    "jira"
  ],
  [
    "clickup",
    "jira"
  ]
];
