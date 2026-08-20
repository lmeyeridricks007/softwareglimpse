/**
 * Project Management Priority-2 white-space products.
 * Smartsheet, Wrike, Linear, Trello, Motion, Airtable — research floors 2026-08-17.
 * Motion is affiliate-inventory; scores still ignore affiliate economics.
 * handsOnTesting=false.
 */

import { expandPmProduct } from "./pm-compact-expand.mjs";

const COMPACT = [
  {
    "slug": "smartsheet",
    "name": "Smartsheet",
    "company": "Smartsheet Inc.",
    "website": "https://www.smartsheet.com",
    "domain": "smartsheet.com",
    "pricingUrl": "https://www.smartsheet.com/pricing",
    "aliases": [],
    "membershipRole": "primary",
    "jobCluster": "spreadsheet-pmo",
    "softShortDescription": "Spreadsheet-style work management with Gantt, portfolios and automation — Pro from $9/member/mo annual.",
    "shortDescription": "Smartsheet is a grid-first work and project platform for teams migrating from spreadsheets into Gantt, dashboards and portfolio control. Pro ~$9/member/mo annual; Business ~$19; Enterprise custom. Strong for PMO/ops buyers who think in sheets — not a lightweight Kanban toy.",
    "vendorPositioning": "The work management platform built for the way you work — sheets, Gantt, dashboards and automation.",
    "pricingModel": "subscription",
    "hasFreePlan": false,
    "hasFreeTrial": true,
    "trialDays": 30,
    "startingPriceMonthly": 9,
    "startingPriceConfidence": "high",
    "pricingNotes": "Cross-checked 2026-08-17: Pro ~$9/member/mo annual (often 1–10 members packaging); Business ~$19 annual; Enterprise custom. Trial commonly ~30 days. Confirm live smartsheet.com/pricing.",
    "pricingSummary": "Pro $9, Business $19 per member/mo annual; Enterprise custom. Trial available. Confirm live.",
    "plans": [
      {
        "kind": "per-seat-annual",
        "slug": "pro",
        "amount": 9,
        "name": "Pro",
        "highlighted": true,
        "description": "$9/member/mo annual — sheet/Gantt entry."
      },
      {
        "kind": "per-seat-annual",
        "slug": "business",
        "amount": 19,
        "name": "Business",
        "description": "$19/member/mo annual — workload, richer automation/views."
      },
      {
        "kind": "contact-sales",
        "slug": "enterprise",
        "name": "Enterprise",
        "description": "Enterprise — portfolio/governance quote."
      }
    ],
    "featureOverrides": {
      "task-boards": "supported",
      "timeline-gantt": "supported",
      "workload-resources": "supported",
      "automations-workflows": "supported",
      "time-tracking": "limited",
      "docs-collaboration": "supported",
      "integrations-ecosystem": "supported",
      "reporting-dashboards": "supported",
      "ai-assistance": "add-on",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported"
    },
    "scores": {
      "ease-of-use": 7,
      "work-planning": 9,
      "automation-workflows": 8,
      "collaboration": 7,
      "integrations": 8,
      "reporting": 9,
      "scalability": 9,
      "value-for-money": 7,
      "ai-capabilities": 6
    },
    "bestFor": [
      "Excel/spreadsheet-native PMOs",
      "Ops teams needing Gantt + portfolios",
      "Structured program reporting"
    ],
    "notIdealFor": [
      "Lightweight Kanban-only teams (Trello)",
      "Docs-first knowledge work (Notion)",
      "Eng sprint defaults (Jira)"
    ],
    "pros": [
      "Spreadsheet-native UX",
      "Strong Gantt/portfolio reporting",
      "Pro $9 floor",
      "Enterprise governance path",
      "Automation + proofing"
    ],
    "cons": [
      "No Free plan",
      "Can feel heavy vs Asana",
      "AI not centre of gravity",
      "Business jump to $19",
      "Less ‘modern app’ than monday/ClickUp"
    ],
    "keyFeatures": [
      "Sheets & reports",
      "Gantt/timeline",
      "Dashboards",
      "Automations",
      "Proofing",
      "Portfolios"
    ],
    "whoShouldChoose": "Choose Smartsheet when spreadsheet-style planning, Gantt and portfolio reporting are the primary job.",
    "whoShouldConsiderAlternatives": "Compare monday/Wrike for Work OS peers, Asana for cross-functional adoption, and Office Timeline for PowerPoint-only decks.",
    "alternativeSlugs": [
      "monday",
      "wrike",
      "asana"
    ],
    "competitorSlugs": [
      "monday",
      "wrike",
      "asana",
      "microsoft-project",
      "airtable"
    ],
    "comparableSlugs": [
      "monday",
      "wrike"
    ],
    "useCaseSlugs": [
      "work-management",
      "project-tracking",
      "resource-planning",
      "timeline-reporting"
    ],
    "businessSizeSlugs": [
      "small-business",
      "mid-market",
      "enterprise"
    ],
    "teamTypeSlugs": [
      "operations",
      "project-managers"
    ],
    "limitations": [
      "No free plan",
      "Business tier pricing jump",
      "Less ideal for pure Kanban simplicity",
      "AI secondary to grid/PMO strengths"
    ],
    "scoreRationales": {
      "ease-of-use": "Familiar to spreadsheet natives; less ‘app-like’ than Asana for some buyers.",
      "work-planning": "Sheets + Gantt + portfolios are a strong PMO planning surface.",
      "automation-workflows": "Automations and proofing workflows solid on Business+.",
      "collaboration": "Comments/proofing good; not a docs-first collaboration suite.",
      "integrations": "Broad business-system connectors for ops/PMO stacks.",
      "reporting": "Dashboards and portfolio reporting are a Smartsheet strength — 9.",
      "scalability": "Enterprise path for large programs and controlled delivery.",
      "value-for-money": "Pro $9 is fair for grid PM; Business $19 raises mid-market TCO. Affiliate economics excluded.",
      "ai-capabilities": "AI exists but is not the primary buying reason vs Motion/Notion AI."
    }
  },
  {
    "slug": "wrike",
    "name": "Wrike",
    "company": "Wrike, Inc.",
    "website": "https://www.wrike.com",
    "domain": "wrike.com",
    "pricingUrl": "https://www.wrike.com/price/",
    "aliases": [],
    "membershipRole": "primary",
    "jobCluster": "work-os",
    "softShortDescription": "Enterprise/agency work management with proofing, intake and resourcing — Team from $10/user/mo annual.",
    "shortDescription": "Wrike is a work management platform strong with agencies and mid-market/enterprise teams needing proofing, request intake, custom workflows and resource views. Free tier exists; Team ~$10/user/mo annual; Business ~$25; Enterprise/Pinnacle custom.",
    "vendorPositioning": "Work management for high-performance teams — plan, collaborate and deliver with visibility.",
    "pricingModel": "freemium",
    "hasFreePlan": true,
    "hasFreeTrial": true,
    "trialDays": 14,
    "startingPriceMonthly": 10,
    "startingPriceConfidence": "high",
    "pricingNotes": "Cross-checked 2026-08-17: Free; Team ~$10/user/mo annual; Business ~$25; Enterprise/Pinnacle quote. Confirm live wrike.com/price.",
    "pricingSummary": "Free; Team $10, Business $25 annual; Enterprise custom. Confirm live.",
    "plans": [
      {
        "kind": "free",
        "slug": "free",
        "name": "Free",
        "description": "Free forever with basic task tracking."
      },
      {
        "kind": "per-seat-annual",
        "slug": "team",
        "amount": 10,
        "name": "Team",
        "highlighted": true,
        "description": "$10/user/mo annual — shared projects and core collaboration."
      },
      {
        "kind": "per-seat-annual",
        "slug": "business",
        "amount": 25,
        "name": "Business",
        "description": "$25/user/mo annual — proofing, forms, time tracking, richer workflows."
      },
      {
        "kind": "contact-sales",
        "slug": "enterprise",
        "name": "Enterprise",
        "description": "Enterprise / Pinnacle — custom governance and scale."
      }
    ],
    "featureOverrides": {
      "task-boards": "supported",
      "timeline-gantt": "supported",
      "workload-resources": "supported",
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
    "scores": {
      "ease-of-use": 7,
      "work-planning": 9,
      "automation-workflows": 8,
      "collaboration": 8,
      "integrations": 8,
      "reporting": 9,
      "scalability": 9,
      "value-for-money": 7,
      "ai-capabilities": 7
    },
    "bestFor": [
      "Agencies with proofing/intake",
      "Mid-market/enterprise cross-functional delivery",
      "Teams needing resource visibility"
    ],
    "notIdealFor": [
      "Tiny teams wanting simplest UX (Asana/Trello)",
      "Eng-only sprint shops (Jira)",
      "Lowest-cost Work OS (ClickUp)"
    ],
    "pros": [
      "Agency proofing + intake",
      "Strong reporting",
      "Free + Team $10 entry",
      "Enterprise governance",
      "Resource-oriented planning"
    ],
    "cons": [
      "Business $25 jump",
      "Heavier than Asana for SMB",
      "Can feel enterprise-complex",
      "AI less flashy than Notion/Motion",
      "Implementation effort"
    ],
    "keyFeatures": [
      "Projects & Gantt",
      "Proofing",
      "Request forms",
      "Custom workflows",
      "Dashboards",
      "Resource views"
    ],
    "whoShouldChoose": "Choose Wrike when agency/enterprise work management with proofing, intake and reporting depth matters.",
    "whoShouldConsiderAlternatives": "Compare Asana/monday for easier cross-functional defaults, ClickUp for value breadth, and Smartsheet for spreadsheet-native PMOs.",
    "alternativeSlugs": [
      "asana",
      "monday",
      "clickup"
    ],
    "competitorSlugs": [
      "asana",
      "monday",
      "clickup",
      "smartsheet",
      "hive"
    ],
    "comparableSlugs": [
      "asana",
      "monday",
      "smartsheet"
    ],
    "useCaseSlugs": [
      "work-management",
      "project-tracking",
      "resource-planning",
      "team-collaboration-work"
    ],
    "businessSizeSlugs": [
      "small-business",
      "mid-market",
      "enterprise"
    ],
    "teamTypeSlugs": [
      "operations",
      "marketing",
      "project-managers",
      "agencies"
    ],
    "limitations": [
      "Business tier pricing jump",
      "Heavier admin than lightweight tools",
      "Overkill for simple Kanban",
      "AI not the primary wedge"
    ],
    "scoreRationales": {
      "ease-of-use": "Capable but denser than Asana — mid-market/agency admins cope well; SMB may feel heavier.",
      "work-planning": "Strong project/folder structures, Gantt and resource-oriented planning.",
      "automation-workflows": "Custom workflows and intake forms are a Wrike strength on Business+.",
      "collaboration": "Proofing and cross-team collaboration fit creative/agency work.",
      "integrations": "Solid enterprise connector set.",
      "reporting": "Reporting and Work Intelligence analytics are a differentiator — 9.",
      "scalability": "Clear enterprise/agency scale path.",
      "value-for-money": "Team $10 is fine; Business $25 is a steeper jump vs ClickUp/Asana. Affiliate economics excluded.",
      "ai-capabilities": "Work Intelligence AI present; not as consumer-visible as Notion/Motion AI."
    }
  },
  {
    "slug": "linear",
    "name": "Linear",
    "company": "Linear Orbit, Inc.",
    "website": "https://linear.app",
    "domain": "linear.app",
    "pricingUrl": "https://linear.app/pricing",
    "aliases": [],
    "membershipRole": "primary",
    "jobCluster": "eng-tracker",
    "softShortDescription": "Modern issue tracker for product/engineering teams — Free limited; Basic from ~$8/user/mo annual.",
    "shortDescription": "Linear is a fast, opinionated issue tracker for software product teams (cycles, projects, roadmaps). Free covers limited issues/members; Basic/Standard ~$8–$10/user/mo annual; Business/Plus ~$14–$16; Enterprise custom. Landscape peer to Jira for modern eng UX — not a general Work OS.",
    "vendorPositioning": "The issue tracking tool you'll enjoy using — built for high-performance product teams.",
    "pricingModel": "freemium",
    "hasFreePlan": true,
    "hasFreeTrial": true,
    "startingPriceMonthly": 8,
    "startingPriceConfidence": "medium",
    "pricingNotes": "Cross-checked 2026-08-17: Free (limited); Basic/Standard commonly ~$8–$10/user/mo annual; Business/Plus ~$14–$16; Enterprise custom. Medium confidence — confirm live linear.app/pricing.",
    "pricingSummary": "Free limited; Basic ~$8, Business ~$14 per user/mo annual (medium). Confirm live.",
    "plans": [
      {
        "kind": "free",
        "slug": "free",
        "name": "Free",
        "description": "Free with issue/member caps for small teams."
      },
      {
        "kind": "per-seat-annual",
        "slug": "basic",
        "amount": 8,
        "name": "Basic",
        "highlighted": true,
        "description": "~$8/user/mo annual (medium) — core Linear for growing product teams."
      },
      {
        "kind": "per-seat-annual",
        "slug": "business",
        "amount": 14,
        "name": "Business",
        "description": "~$14/user/mo annual (medium) — advanced controls and scale features."
      },
      {
        "kind": "contact-sales",
        "slug": "enterprise",
        "name": "Enterprise",
        "description": "Enterprise — custom."
      }
    ],
    "featureOverrides": {
      "task-boards": "supported",
      "timeline-gantt": "supported",
      "workload-resources": "limited",
      "automations-workflows": "supported",
      "time-tracking": "not-supported",
      "docs-collaboration": "limited",
      "integrations-ecosystem": "supported",
      "reporting-dashboards": "limited",
      "ai-assistance": "limited",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported"
    },
    "scores": {
      "ease-of-use": 9,
      "work-planning": 9,
      "automation-workflows": 7,
      "collaboration": 7,
      "integrations": 8,
      "reporting": 7,
      "scalability": 8,
      "value-for-money": 8,
      "ai-capabilities": 7
    },
    "bestFor": [
      "Product/engineering teams wanting modern UX",
      "Startups replacing Jira complexity",
      "Issue-centric software delivery"
    ],
    "notIdealFor": [
      "Marketing Work OS buyers",
      "Spreadsheet PMO buyers",
      "Non-technical company-wide rollout"
    ],
    "pros": [
      "Excellent eng UX speed",
      "Opinionated workflows",
      "Strong Git integrations",
      "Competitive pricing",
      "Modern roadmap views"
    ],
    "cons": [
      "Not a general Work OS",
      "Thinner enterprise automation than Jira",
      "Weak for non-eng departments",
      "Reporting not PMO-grade",
      "Landscape-only on general PM best lists"
    ],
    "keyFeatures": [
      "Issues & cycles",
      "Projects & roadmaps",
      "Git integrations",
      "Triage workflows",
      "Insights",
      "Keyboard-first UX"
    ],
    "whoShouldChoose": "Choose Linear when product/engineering teams want a fast modern issue tracker — landscape beside Jira, not ranked as a monday/Asana Work OS peer.",
    "whoShouldConsiderAlternatives": "Compare Jira for enterprise Agile depth, ClickUp for cross-functional Work OS, and Height only if niche demand appears.",
    "alternativeSlugs": [
      "jira",
      "clickup",
      "asana"
    ],
    "competitorSlugs": [
      "jira",
      "clickup",
      "asana",
      "height",
      "shortcut"
    ],
    "comparableSlugs": [
      "jira",
      "clickup"
    ],
    "useCaseSlugs": [
      "project-tracking",
      "work-management"
    ],
    "businessSizeSlugs": [
      "startup",
      "small-business",
      "mid-market",
      "enterprise"
    ],
    "teamTypeSlugs": [
      "engineering",
      "product"
    ],
    "limitations": [
      "Not for company-wide marketing/ops Work OS",
      "Leaner automation than Jira Enterprise",
      "Limited non-eng collaboration surfaces",
      "Insights ≠ PMO portfolio reporting"
    ],
    "scoreRationales": {
      "ease-of-use": "Best-in-class modern eng UX — dramatically easier than classic Jira for product engineers.",
      "work-planning": "Cycles, projects, issues and roadmaps fit software planning tightly.",
      "automation-workflows": "Automations exist but are leaner than Jira’s enterprise rule engines.",
      "collaboration": "Great for eng/product; weaker as a company-wide Work OS collaborator.",
      "integrations": "GitHub/GitLab/Slack-class eng stack integrations are strong.",
      "reporting": "Insights suitable for product teams; not PMO portfolio BI.",
      "scalability": "Scales well for product orgs; enterprise controls on higher tiers.",
      "value-for-money": "Competitive eng-tracker floors vs Jira. Affiliate economics excluded.",
      "ai-capabilities": "AI assists exist; not the primary product wedge vs Motion."
    }
  },
  {
    "slug": "trello",
    "name": "Trello",
    "company": "Atlassian",
    "website": "https://trello.com",
    "domain": "trello.com",
    "pricingUrl": "https://trello.com/pricing",
    "aliases": [],
    "membershipRole": "primary",
    "jobCluster": "lightweight-board",
    "softShortDescription": "Lightweight Kanban boards (Atlassian) — Free; Standard from $5/user/mo annual.",
    "shortDescription": "Trello is a simple Kanban board tool for lists/cards with Power-Ups and Butler automation. Free for basic boards; Standard $5/user/mo annual; Premium $10; Enterprise ~$17.50 (volume). Ideal when a board is enough — not a full Work OS.",
    "vendorPositioning": "Trello helps teams move work forward — simple boards that scale with Power-Ups.",
    "pricingModel": "freemium",
    "hasFreePlan": true,
    "hasFreeTrial": true,
    "startingPriceMonthly": 5,
    "startingPriceConfidence": "high",
    "pricingNotes": "Cross-checked 2026-08-17: Free; Standard $5, Premium $10 per user/mo annual; Enterprise ~$17.50 (often volume-based). Confirm live trello.com/pricing.",
    "pricingSummary": "Free; Standard $5, Premium $10 annual; Enterprise ~$17.50. Confirm live.",
    "plans": [
      {
        "kind": "free",
        "slug": "free",
        "name": "Free",
        "description": "Free boards with limits."
      },
      {
        "kind": "per-seat-annual",
        "slug": "standard",
        "amount": 5,
        "name": "Standard",
        "highlighted": true,
        "description": "$5/user/mo annual — advanced checklists, custom fields, more boards."
      },
      {
        "kind": "per-seat-annual",
        "slug": "premium",
        "amount": 10,
        "name": "Premium",
        "description": "$10/user/mo annual — calendar/timeline/dashboard views, workspace views."
      },
      {
        "kind": "per-seat-annual",
        "slug": "enterprise",
        "amount": 17.5,
        "name": "Enterprise",
        "description": "~$17.50/user/mo annual (volume packaging common) — org admin/SSO via Atlassian Guard."
      }
    ],
    "featureOverrides": {
      "task-boards": "supported",
      "timeline-gantt": "higher-plan-only",
      "workload-resources": "not-supported",
      "automations-workflows": "limited",
      "time-tracking": "add-on",
      "docs-collaboration": "limited",
      "integrations-ecosystem": "supported",
      "reporting-dashboards": "higher-plan-only",
      "ai-assistance": "limited",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported"
    },
    "scores": {
      "ease-of-use": 10,
      "work-planning": 5,
      "automation-workflows": 6,
      "collaboration": 7,
      "integrations": 8,
      "reporting": 4,
      "scalability": 5,
      "value-for-money": 9,
      "ai-capabilities": 4
    },
    "bestFor": [
      "Small teams needing simple Kanban",
      "Personal/team board workflows",
      "Atlassian-adjacent lightweight entry"
    ],
    "notIdealFor": [
      "Portfolio/resource PM",
      "Eng Agile at scale (Jira)",
      "All-in-one Work OS buyers"
    ],
    "pros": [
      "Highest ease of use",
      "Free entry",
      "Standard $5 floor",
      "Power-Ups flexibility",
      "Atlassian ecosystem"
    ],
    "cons": [
      "Shallow planning depth",
      "Outgrown by complex work",
      "Reporting weak",
      "AI thin",
      "Not a Work OS peer"
    ],
    "keyFeatures": [
      "Kanban boards",
      "Cards & checklists",
      "Butler automation",
      "Power-Ups",
      "Premium views",
      "Atlassian admin (Enterprise)"
    ],
    "whoShouldChoose": "Choose Trello when a simple board is genuinely enough — landscape on Work OS best lists.",
    "whoShouldConsiderAlternatives": "Compare Asana/ClickUp when you outgrow boards, Jira for eng sprints, and monday for structured Work OS.",
    "alternativeSlugs": [
      "asana",
      "clickup",
      "jira"
    ],
    "competitorSlugs": [
      "asana",
      "clickup",
      "jira",
      "monday",
      "basecamp"
    ],
    "comparableSlugs": [
      "asana",
      "clickup"
    ],
    "useCaseSlugs": [
      "project-tracking",
      "team-collaboration-work"
    ],
    "businessSizeSlugs": [
      "micro",
      "small-business",
      "mid-market"
    ],
    "teamTypeSlugs": [
      "operations",
      "marketing",
      "founders"
    ],
    "limitations": [
      "Limited planning depth vs Work OS",
      "Premium needed for richer views",
      "Not for enterprise PMO portfolios",
      "AI not a buying reason"
    ],
    "scoreRationales": {
      "ease-of-use": "Simplest mainstream board UX — near-instant adoption.",
      "work-planning": "Kanban-first; weak for portfolio/dependencies vs Work OS peers — 5 by design.",
      "automation-workflows": "Butler helps; thinner than ClickUp/Asana automation depth.",
      "collaboration": "Card comments and boards work for small teams; limited docs depth.",
      "integrations": "Atlassian + Power-Ups ecosystem is broad for a lightweight tool.",
      "reporting": "Dashboards only on higher plans; not a reporting platform.",
      "scalability": "Fine for simple team boards; outgrown by complex programs quickly.",
      "value-for-money": "Free + $5 Standard is excellent for the lightweight-board job. Affiliate economics excluded.",
      "ai-capabilities": "AI is not Trello’s centre of gravity."
    }
  },
  {
    "slug": "motion",
    "name": "Motion",
    "company": "Motion",
    "website": "https://www.usemotion.com",
    "domain": "usemotion.com",
    "pricingUrl": "https://www.usemotion.com/pricing",
    "aliases": [
      "Motion AI",
      "Use Motion"
    ],
    "membershipRole": "primary",
    "jobCluster": "ai-calendar",
    "softShortDescription": "AI calendar + task auto-scheduling (projects, docs, meetings) — Pro AI from $19/seat/mo annual.",
    "shortDescription": "Motion combines AI calendar, task planning, projects, docs and meeting workflows with credit-based AI. Pro AI $19/seat/mo annual (7,500 credits/seat); Business AI $29 (15,000 credits) with Gantt, time tracking and capacity. Strong AI-scheduling wedge — not a classic monday-class Work OS peer on undifferentiated ranks.",
    "vendorPositioning": "AI that plans your day and runs your projects — calendar, tasks and docs in one system.",
    "pricingModel": "subscription",
    "hasFreePlan": false,
    "hasFreeTrial": true,
    "startingPriceMonthly": 19,
    "startingPriceConfidence": "high",
    "pricingNotes": "Verified 2026-08-17 from usemotion.com/pricing: Pro AI $19/seat/mo annual (7,500 credits/seat/mo); Business AI $29 (15,000 credits) with timeline/Gantt, time tracking, capacity, permissions. Monthly billing higher (~33% save annual). Confirm live credit top-up rates.",
    "pricingSummary": "Pro AI $19, Business AI $29 per seat/mo annual + AI credits. Trial available. Confirm live.",
    "plans": [
      {
        "kind": "per-seat-annual",
        "slug": "pro-ai",
        "amount": 19,
        "name": "Pro AI",
        "highlighted": true,
        "description": "$19/seat/mo annual — AI calendar, tasks, projects, docs; 7,500 credits/seat/mo."
      },
      {
        "kind": "per-seat-annual",
        "slug": "business-ai",
        "amount": 29,
        "name": "Business AI",
        "description": "$29/seat/mo annual — Gantt, time tracking, capacity, permissions; 15,000 credits/seat/mo."
      }
    ],
    "featureOverrides": {
      "task-boards": "supported",
      "timeline-gantt": "higher-plan-only",
      "workload-resources": "higher-plan-only",
      "automations-workflows": "supported",
      "time-tracking": "higher-plan-only",
      "docs-collaboration": "supported",
      "integrations-ecosystem": "supported",
      "reporting-dashboards": "higher-plan-only",
      "ai-assistance": "supported",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported"
    },
    "aiLines": [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: supported",
      "AI recommendations: supported"
    ],
    "integrations": [
      {
        "integrationSlug": "google-calendar",
        "kind": "native"
      },
      {
        "integrationSlug": "google-workspace",
        "kind": "native"
      },
      {
        "integrationSlug": "zapier",
        "kind": "zapier-style"
      }
    ],
    "scores": {
      "ease-of-use": 8,
      "work-planning": 7,
      "automation-workflows": 9,
      "collaboration": 6,
      "integrations": 6,
      "reporting": 5,
      "scalability": 6,
      "value-for-money": 6,
      "ai-capabilities": 9
    },
    "bestFor": [
      "Individuals/small teams buying AI auto-scheduling",
      "Calendar + task unification",
      "Buyers who want AI docs/projects bundled"
    ],
    "notIdealFor": [
      "Enterprise PMO portfolios",
      "Cheapest Work OS seats",
      "Eng issue tracking (Jira/Linear)"
    ],
    "pros": [
      "Strongest AI scheduling wedge",
      "Published Pro/Business floors",
      "Projects + calendar + docs",
      "Business AI Gantt/capacity",
      "Credit model is explicit"
    ],
    "cons": [
      "Premium seat vs ClickUp/Asana",
      "No free plan",
      "Collaboration thinner than Work OS peers",
      "Ecosystem narrower",
      "Must stay honest vs Work OS ranks"
    ],
    "keyFeatures": [
      "AI calendar & meetings",
      "AI task planner",
      "Projects & tasks",
      "AI docs/wiki",
      "Business Gantt & capacity",
      "AI credits"
    ],
    "whoShouldChoose": "Choose Motion when AI calendar auto-scheduling and AI-assisted task planning are the primary job — landscape beside Work OS peers, not a silent monday replacement.",
    "whoShouldConsiderAlternatives": "Compare Asana/ClickUp/monday for classic Work OS collaboration, Notion for docs-first AI, and Reclaim/Motion peers for calendar-only needs.",
    "alternativeSlugs": [
      "asana",
      "clickup",
      "monday"
    ],
    "competitorSlugs": [
      "asana",
      "clickup",
      "monday",
      "notion",
      "reclaim"
    ],
    "comparableSlugs": [
      "asana",
      "clickup",
      "notion"
    ],
    "useCaseSlugs": [
      "work-management",
      "project-tracking"
    ],
    "businessSizeSlugs": [
      "micro",
      "small-business",
      "mid-market"
    ],
    "teamTypeSlugs": [
      "founders",
      "operations",
      "project-managers"
    ],
    "limitations": [
      "Premium $19+ seats vs broader Work OS floors",
      "AI credit caps and top-ups affect TCO",
      "Gantt/capacity/time tracking Business AI-gated",
      "Not an enterprise PMO or eng tracker default"
    ],
    "scoreRationales": {
      "ease-of-use": "Polished AI-first UX for individuals/small teams; calendar-centric mental model.",
      "work-planning": "Projects/tasks exist; deeper Gantt/capacity is Business AI — mid vs monday/Asana.",
      "automation-workflows": "Auto-scheduling and AI task planning are the product’s automation strength — 9.",
      "collaboration": "Team features improve on Business AI; still not a large cross-functional collab suite.",
      "integrations": "Calendar/workspace integrations matter most; broader PM ecosystem thinner than monday.",
      "reporting": "Dashboards/reports stronger on Business AI — held at 5 for Pro-centric buyers.",
      "scalability": "Best for individuals to small/mid teams; not enterprise PMO scale.",
      "value-for-money": "$19 Pro AI is a premium vs ClickUp $7 — justified only if AI scheduling is the job. Affiliate economics excluded.",
      "ai-capabilities": "Category-leading AI calendar/task planner narrative in this set — 9."
    }
  },
  {
    "slug": "airtable",
    "name": "Airtable",
    "company": "Formagrid, Inc.",
    "website": "https://www.airtable.com",
    "domain": "airtable.com",
    "pricingUrl": "https://www.airtable.com/pricing",
    "aliases": [],
    "membershipRole": "primary",
    "jobCluster": "docs-db-hybrid",
    "softShortDescription": "Flexible database / app platform with interfaces and light project apps — Team from ~$20/user/mo annual.",
    "shortDescription": "Airtable is a spreadsheet-database hybrid for building lightweight apps, interfaces and project trackers. Free limited; Team ~$20/user/mo annual; Business ~$45; Enterprise Scale custom. Strong when structured data + interfaces matter — heavier TCO than Notion for simple docs.",
    "vendorPositioning": "Build apps and workflows on top of your data — the platform for modern work.",
    "pricingModel": "freemium",
    "hasFreePlan": true,
    "hasFreeTrial": true,
    "startingPriceMonthly": 20,
    "startingPriceConfidence": "medium",
    "pricingNotes": "Cross-checked 2026-08-17: Free; Team ~$20/user/mo annual; Business ~$45; Enterprise Scale custom. Medium confidence — confirm live airtable.com/pricing (packaging shifts).",
    "pricingSummary": "Free; Team ~$20, Business ~$45 annual; Enterprise custom. Confirm live.",
    "plans": [
      {
        "kind": "free",
        "slug": "free",
        "name": "Free",
        "description": "Free with record/storage caps."
      },
      {
        "kind": "per-seat-annual",
        "slug": "team",
        "amount": 20,
        "name": "Team",
        "highlighted": true,
        "description": "~$20/user/mo annual — collaborative bases and interfaces."
      },
      {
        "kind": "per-seat-annual",
        "slug": "business",
        "amount": 45,
        "name": "Business",
        "description": "~$45/user/mo annual — admin, sync, higher limits."
      },
      {
        "kind": "contact-sales",
        "slug": "enterprise",
        "name": "Enterprise Scale",
        "description": "Enterprise Scale — custom."
      }
    ],
    "featureOverrides": {
      "task-boards": "limited",
      "timeline-gantt": "limited",
      "workload-resources": "limited",
      "automations-workflows": "supported",
      "time-tracking": "not-supported",
      "docs-collaboration": "limited",
      "integrations-ecosystem": "supported",
      "reporting-dashboards": "supported",
      "ai-assistance": "add-on",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported"
    },
    "scores": {
      "ease-of-use": 7,
      "work-planning": 7,
      "automation-workflows": 7,
      "collaboration": 8,
      "integrations": 8,
      "reporting": 7,
      "scalability": 8,
      "value-for-money": 6,
      "ai-capabilities": 7
    },
    "bestFor": [
      "Ops teams building data apps",
      "Structured trackers beyond plain docs",
      "Interface-driven internal tools"
    ],
    "notIdealFor": [
      "Cheapest docs wiki (Notion)",
      "Classic Work OS default (Asana/monday)",
      "Eng sprint tracking (Jira)"
    ],
    "pros": [
      "Flexible database model",
      "Interfaces for apps",
      "Automations + sync",
      "Free entry",
      "Strong ops builder narrative"
    ],
    "cons": [
      "Premium Team/Business seats",
      "Easy to overbuild",
      "Not a pure Work OS",
      "Docs weaker than Notion",
      "AI secondary"
    ],
    "keyFeatures": [
      "Bases & views",
      "Interfaces",
      "Automations",
      "Sync",
      "Forms",
      "Admin (Business+)"
    ],
    "whoShouldChoose": "Choose Airtable when you need a flexible database/app layer for operational trackers — landscape beside Work OS and Notion.",
    "whoShouldConsiderAlternatives": "Compare Notion for docs-first, Smartsheet for PMO grids, and Asana/monday for dedicated Work OS execution.",
    "alternativeSlugs": [
      "notion",
      "smartsheet",
      "asana"
    ],
    "competitorSlugs": [
      "notion",
      "smartsheet",
      "asana",
      "monday",
      "coda"
    ],
    "comparableSlugs": [
      "notion",
      "smartsheet"
    ],
    "useCaseSlugs": [
      "work-management",
      "project-tracking"
    ],
    "businessSizeSlugs": [
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
      "Higher seat floors than Notion/ClickUp",
      "Builder complexity",
      "Not a sprint tracker",
      "Docs experience trails Notion"
    ],
    "scoreRationales": {
      "ease-of-use": "Familiar sheet UX with database power — learning curve rises with Interfaces/automations.",
      "work-planning": "Can model projects well, but not a dedicated Work OS planning product.",
      "automation-workflows": "Automations are capable; still a builder tool more than a PM suite.",
      "collaboration": "Shared bases and Interfaces support team workflows well.",
      "integrations": "Sync and connector ecosystem is a strength for ops stacks.",
      "reporting": "Interfaces and views support operational reporting mid-pack.",
      "scalability": "Scales into Business/Enterprise for larger data apps.",
      "value-for-money": "Team ~$20 and Business ~$45 are premium vs Notion/Asana for light PM. Affiliate economics excluded.",
      "ai-capabilities": "AI features present; not the primary wedge vs Motion/Notion AI for many buyers."
    }
  }
];

export const PRODUCTS = COMPACT.map(expandPmProduct);

export const COMPARISON_PAIRS = [
  [
    "wrike",
    "smartsheet"
  ],
  [
    "linear",
    "trello"
  ],
  [
    "motion",
    "airtable"
  ],
  [
    "wrike",
    "motion"
  ],
  [
    "smartsheet",
    "airtable"
  ],
  [
    "linear",
    "motion"
  ],
  [
    "wrike",
    "trello"
  ]
];
