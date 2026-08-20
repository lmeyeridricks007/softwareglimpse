#!/usr/bin/env node
/**
 * Source REAL vendor-ui product screenshots + official YouTube videos for
 * Project Management products that currently lack gallery media.
 *
 * Idempotent: skips existing files / screenshot ids / media ids.
 * Existing videos get overview+features+evidence placements unioned so the
 * product page "See in action" player can render.
 *
 * Usage:
 *   node scripts/source-pm-product-media.mjs
 *   node scripts/source-pm-product-media.mjs --slug=monday
 *
 * Videos verified 2026-08-18 via YouTube oEmbed author_name matching vendor.
 * Screenshots: official marketing UI from first-party CDNs / vendor sites.
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const require = createRequire(path.join(ROOT, "package.json"));
const sharp = require("sharp");

const CHECKED_AT = "2026-08-18T07:00:00.000Z";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SoftwareGlimpseMediaBot/1.0";

const DEFAULT_LIMITATIONS = [
  "pricing",
  "comparative superiority",
  "security or compliance certification",
  "implementation effort or total cost of ownership",
];

const PRODUCTS = {
  monday: {
    name: "monday.com",
    homepage: "https://monday.com/",
    shots: [
      {
        file: "board.png",
        url: "https://cdn.prod.website-files.com/656da6fea306219773d04208/69f1ebf0e3a90c211c06c815_Frame%202147240454.png",
        alt: "monday.com work board",
        caption: "Work board UI from the official monday.com homepage.",
        source: "https://monday.com/",
        featureIds: ["task-boards"],
      },
      {
        file: "board-alt.png",
        url: "https://cdn.prod.website-files.com/656da6fea306219773d04208/69f1ebf0e3a90c211c06c81b_Frame%202147240461.png",
        alt: "monday.com board columns and updates",
        caption: "Board columns and item updates marketed on monday.com.",
        source: "https://monday.com/",
        featureIds: ["task-boards", "docs-collaboration"],
      },
      {
        file: "tickets-board.jpg",
        url: "https://dapulse-res.cloudinary.com/video/upload/so_0p/Generator_featured%20images/hp-020626/hero-it-tickets-board_06.png",
        alt: "monday.com IT tickets board",
        caption: "IT tickets board capture from monday.com homepage marketing.",
        source: "https://monday.com/",
        featureIds: ["task-boards"],
      },
    ],
    videos: [
      {
        videoId: "WdPsUyNS3-g",
        title: "monday.com Work OS | Your best work, your way",
        channelName: "monday.com",
        sourceOrganization: "monday.com",
        description:
          "Official monday.com Work OS overview from the monday.com YouTube channel.",
        featureIds: ["task-boards", "automations-workflows", "reporting-dashboards"],
      },
      {
        videoId: "qYSXuBEdEds",
        title: "Customize your work management process with monday.com",
        channelName: "monday.com",
        sourceOrganization: "monday.com",
        type: "official-tutorial",
        description:
          "Official monday.com walkthrough of customizing a work-management process.",
        featureIds: ["task-boards", "automations-workflows"],
      },
    ],
  },
  asana: {
    name: "Asana",
    homepage: "https://asana.com/",
    shots: [
      {
        file: "homepage-ui.png",
        url: "https://assets.asana.biz/asset/aca466c4-8d27-46c4-b83d-981a43e2aeb4/HP-032-Variant.png",
        alt: "Asana homepage product interface",
        caption: "Product UI frame from the official Asana homepage.",
        source: "https://asana.com/",
        featureIds: ["task-boards"],
      },
      {
        file: "services-tab.png",
        url: "https://assets.asana.biz/asset/0c849b7d-48ba-43fa-80c9-7b6daa2b5a52/Homepage_Services_tab_static.png",
        alt: "Asana services workspace",
        caption: "Services-tab product UI from asana.com/product.",
        source: "https://asana.com/product",
        featureIds: ["task-boards", "reporting-dashboards"],
      },
      {
        file: "workspace.png",
        url: "https://assets.asana.biz/asset/72190889-f0f8-494d-af79-d2686f053495/test-wisjune4-asanadotcom-hp.png",
        alt: "Asana project workspace",
        caption: "Project workspace marketed on asana.com.",
        source: "https://asana.com/",
        featureIds: ["task-boards", "timeline-gantt"],
      },
    ],
    videos: [
      {
        videoId: "r5QdECL9e6c",
        title: "What is Asana?",
        channelName: "Asana",
        sourceOrganization: "Asana",
        description: "Official Asana overview from the Asana YouTube channel.",
        featureIds: ["task-boards"],
      },
      {
        videoId: "hcY-2Xux2oI",
        title: "How to get started with Asana | Beginner overview 2024",
        channelName: "Asana",
        sourceOrganization: "Asana",
        type: "official-tutorial",
        description: "Official Asana beginner overview from the Asana channel.",
        featureIds: ["task-boards", "docs-collaboration"],
      },
    ],
  },
  clickup: {
    name: "ClickUp",
    homepage: "https://clickup.com/",
    shots: [
      {
        file: "projects.png",
        url: "https://clickup.com/assets/home_2026/hero_projects.png",
        alt: "ClickUp projects workspace",
        caption: "Projects workspace hero UI from clickup.com.",
        source: "https://clickup.com/",
        featureIds: ["task-boards"],
      },
      {
        file: "sprints.png",
        url: "https://clickup.com/assets/home_2026/hero_sprints.png",
        alt: "ClickUp sprints view",
        caption: "Sprints product frame from the official ClickUp homepage.",
        source: "https://clickup.com/",
        featureIds: ["task-boards", "timeline-gantt"],
      },
      {
        file: "calendar.png",
        url: "https://clickup.com/assets/home_2026/hero_calendar.png",
        alt: "ClickUp calendar view",
        caption: "Calendar view marketed on clickup.com.",
        source: "https://clickup.com/",
        featureIds: ["task-boards"],
      },
      {
        file: "chat.png",
        url: "https://clickup.com/assets/home_2026/hero_chat.png",
        alt: "ClickUp chat workspace",
        caption: "Chat workspace hero UI from the official ClickUp homepage.",
        source: "https://clickup.com/",
        featureIds: ["docs-collaboration"],
      },
    ],
    videos: [
      {
        videoId: "nU41rM7zZns",
        title: "ClickUp 4.0 overview | A new era of craft, quality, and convergence.",
        channelName: "ClickUp",
        sourceOrganization: "ClickUp",
        description: "Official ClickUp 4.0 overview from the ClickUp YouTube channel.",
        featureIds: ["task-boards", "ai-assistance"],
      },
      {
        videoId: "feAJjhF4_-M",
        title: "ClickUp 4.0: World's First Converged AI Workspace",
        channelName: "ClickUp",
        sourceOrganization: "ClickUp",
        description: "Official ClickUp 4.0 product video from the ClickUp channel.",
        featureIds: ["ai-assistance", "docs-collaboration"],
      },
    ],
  },
  wrike: {
    name: "Wrike",
    homepage: "https://www.wrike.com/",
    shots: [
      {
        file: "project-management.png",
        url: "https://www.wrike.com/tp/storage/uploads/a32bfe3c-e358-4b0c-9938-a5f2c661f7f5/image-swipe-cards-icp-project-management-new.png",
        alt: "Wrike project management workspace",
        caption: "Project management product frame from wrike.com.",
        source: "https://www.wrike.com/",
        featureIds: ["task-boards", "timeline-gantt"],
      },
      {
        file: "productivity.png",
        url: "https://www.wrike.com/tp/storage/uploads/6976a7ba-5c1d-482d-a3a6-e28df033a311/bento-image-wide-productivity-features.png",
        alt: "Wrike productivity features UI",
        caption: "Productivity features UI from the official Wrike homepage.",
        source: "https://www.wrike.com/",
        featureIds: ["automations-workflows", "reporting-dashboards"],
      },
    ],
    videos: [
      {
        videoId: "5wF9qrC6bXg",
        title: "What is Wrike | Wrike Demo & Overview | Project Management Software",
        channelName: "Wrike",
        sourceOrganization: "Wrike",
        description: "Official Wrike product demo from the Wrike YouTube channel.",
        featureIds: ["task-boards", "timeline-gantt"],
      },
      {
        videoId: "PdV4fDgrhBU",
        title: "Navigation in Wrike",
        channelName: "Wrike",
        sourceOrganization: "Wrike",
        type: "official-tutorial",
        description: "Official Wrike navigation tutorial from the Wrike channel.",
        featureIds: ["task-boards"],
      },
    ],
  },
  linear: {
    name: "Linear",
    homepage: "https://linear.app/",
    shots: [
      {
        file: "issues.png",
        url: "https://webassets.linear.app/images/ornj730p/production/4a9c8a92201a695eeaa5f3a6fccb507adac9c661-3600x2080.png?q=95&auto=format",
        alt: "Linear issue tracker workspace",
        caption: "Issue workspace from Linear changelog / product marketing.",
        source: "https://linear.app/changelog",
        featureIds: ["task-boards"],
      },
      {
        file: "board.png",
        url: "https://webassets.linear.app/images/ornj730p/production/de5bfa7b44714eef4e54f0bb4c6bfab6841eb716-3600x2360.png?q=95&auto=format",
        alt: "Linear board view",
        caption: "Board view product frame from linear.app.",
        source: "https://linear.app/changelog",
        featureIds: ["task-boards"],
      },
      {
        file: "cycle.png",
        url: "https://webassets.linear.app/images/ornj730p/production/0bae3de361f646dc692b226b236f9f7e1ae19224-3600x2200.png?q=95&auto=format",
        alt: "Linear cycle planning view",
        caption: "Cycle planning UI from official Linear web assets.",
        source: "https://linear.app/changelog",
        featureIds: ["task-boards", "timeline-gantt"],
      },
    ],
    videos: [
      {
        videoId: "9Q5BoiIFBiY",
        title: "Intro to Linear",
        channelName: "Linear",
        sourceOrganization: "Linear",
        description: "Official Linear introduction from the Linear YouTube channel.",
        featureIds: ["task-boards"],
      },
    ],
  },
  smartsheet: {
    name: "Smartsheet",
    homepage: "https://www.smartsheet.com/",
    shots: [
      {
        file: "workspace.png",
        url: "https://www.smartsheet.com/sites/default/files/styles/1920px/public/2025-02/background-bento-UI-foreground-desktop.png",
        alt: "Smartsheet desktop workspace UI",
        caption: "Desktop workspace UI from the official Smartsheet platform page.",
        source: "https://www.smartsheet.com/platform",
        featureIds: ["task-boards", "reporting-dashboards"],
      },
      {
        file: "portfolio.png",
        url: "https://www.smartsheet.com/sites/default/files/2023-08/solution-category-project-portfolio-management.png",
        alt: "Smartsheet project portfolio management",
        caption: "Project portfolio management frame from smartsheet.com.",
        source: "https://www.smartsheet.com/",
        featureIds: ["timeline-gantt", "reporting-dashboards"],
      },
    ],
    videos: [
      {
        videoId: "M4o1L3s5nW0",
        title: "Smartsheet Overview",
        channelName: "Smartsheet",
        sourceOrganization: "Smartsheet",
        description: "Official Smartsheet overview from the Smartsheet YouTube channel.",
        featureIds: ["task-boards", "reporting-dashboards"],
      },
      {
        videoId: "RthO_mnO6Os",
        title: "Welcome to Smartsheet: Getting Started with Intelligent Work Management",
        channelName: "Smartsheet",
        sourceOrganization: "Smartsheet",
        type: "official-tutorial",
        description: "Official Smartsheet getting-started video from the Smartsheet channel.",
        featureIds: ["task-boards"],
      },
    ],
  },
  jira: {
    name: "Jira",
    homepage: "https://www.atlassian.com/software/jira",
    shots: [
      {
        file: "product.png",
        url: "https://dam-cdn.atl.orangelogic.com/AssetLink/0qw2hr437x574ovc7721dy64614yooac.png",
        alt: "Jira product interface",
        caption: "Jira product UI from the official Atlassian Jira page.",
        source: "https://www.atlassian.com/software/jira",
        featureIds: ["task-boards"],
      },
    ],
    videos: [
      {
        videoId: "Z-a1RB9HvDI",
        title: "What is Jira? | Atlassian Answered",
        channelName: "Atlassian",
        sourceOrganization: "Atlassian",
        description: "Official Jira overview from the Atlassian YouTube channel.",
        featureIds: ["task-boards"],
      },
      {
        videoId: "uhM_v2I6lWg",
        title: "Demo: Project Management with Jira | Atlassian",
        channelName: "Atlassian",
        sourceOrganization: "Atlassian",
        type: "official-tutorial",
        description: "Official Atlassian demo of project management in Jira.",
        featureIds: ["task-boards", "timeline-gantt"],
      },
    ],
  },
  hive: {
    name: "Hive",
    homepage: "https://hive.com/",
    shots: [
      {
        file: "workspace.webp",
        url: "https://framerusercontent.com/images/ttXGLvP7UbLeQzPif4boisLfJ0U.webp?width=2440&height=1484",
        alt: "Hive workspace overview",
        caption: "Workspace overview from the official Hive homepage.",
        source: "https://hive.com/",
        featureIds: ["task-boards", "docs-collaboration"],
      },
      {
        file: "board.png",
        url: "https://framerusercontent.com/images/3u6pbWFJwSpOSk6Bk3OEFlST5tw.png?width=1196&height=600",
        alt: "Hive project board",
        caption: "Project board UI from hive.com/product.",
        source: "https://hive.com/product",
        featureIds: ["task-boards"],
      },
      {
        file: "timeline.png",
        url: "https://framerusercontent.com/images/qeVx8KLeWkMaIutaLognSrRkMSo.png?width=1196&height=600",
        alt: "Hive timeline view",
        caption: "Timeline view marketed on the official Hive product page.",
        source: "https://hive.com/product",
        featureIds: ["timeline-gantt"],
      },
    ],
    videos: [
      {
        videoId: "9CQpAi7Ctmw",
        title: "Best Project Management Software - Hive Intro",
        channelName: "Hive",
        sourceOrganization: "Hive",
        description: "Official Hive intro from the Hive YouTube channel.",
        featureIds: ["task-boards"],
      },
      {
        videoId: "BhJx9GdQ1-U",
        title: "How To Start Using Hive",
        channelName: "Hive",
        sourceOrganization: "Hive",
        type: "official-tutorial",
        description: "Official Hive getting-started video from the Hive channel.",
        featureIds: ["task-boards", "docs-collaboration"],
      },
    ],
  },
  notion: {
    name: "Notion",
    homepage: "https://www.notion.com/",
    shots: [
      {
        file: "homepage-hero.jpg",
        url: "https://images.ctfassets.net/spoqsaf9291f/3kVtQWll6jUqQepQ0kaYlz/382b34f23ecb349129239f0b649aba8c/web-homepage-hero-1920x1200_final.jpg",
        alt: "Notion homepage workspace",
        caption: "Workspace hero UI from the official Notion homepage.",
        source: "https://www.notion.com/",
        featureIds: ["docs-collaboration", "task-boards"],
      },
      {
        file: "desktop.jpg",
        url: "https://images.ctfassets.net/spoqsaf9291f/5s8E0EU3tXEvGrFrRwgxhb/c44fce43494ccd6f098746c64b679aab/capture_desktop.jpg",
        alt: "Notion desktop workspace capture",
        caption: "Desktop workspace capture from notion.com.",
        source: "https://www.notion.com/",
        featureIds: ["docs-collaboration"],
      },
    ],
    videos: [
      {
        videoId: "3HLMH9t1Q-g",
        title: "What is Notion?",
        channelName: "Notion",
        sourceOrganization: "Notion",
        description: "Official Notion overview from the Notion YouTube channel.",
        featureIds: ["docs-collaboration"],
      },
      {
        videoId: "aA7si7AmPkY",
        title: "Notion Training: The Basics",
        channelName: "Notion",
        sourceOrganization: "Notion",
        type: "official-tutorial",
        description: "Official Notion basics training from the Notion channel.",
        featureIds: ["docs-collaboration", "task-boards"],
      },
    ],
  },
  trello: {
    name: "Trello",
    homepage: "https://trello.com/",
    shots: [
      {
        file: "inbox.png",
        url: "https://images.ctfassets.net/rz1oowkt5gyp/7lpUSxVqNRggpqzCNcnfo1/04cf35d0a0ef60e18c6575eb9a0374e4/inbox-slider.png?w=1440",
        alt: "Trello inbox and board workspace",
        caption: "Inbox and board UI from the official Trello tour page.",
        source: "https://trello.com/tour",
        featureIds: ["task-boards"],
      },
    ],
    videos: [
      {
        videoId: "gB3nCssFsC0",
        title: "What is Trello? | Atlassian Answered",
        channelName: "Atlassian",
        sourceOrganization: "Atlassian",
        officialSourceKind: "vendor-channel",
        description: "Official Trello overview from the Atlassian YouTube channel.",
        featureIds: ["task-boards"],
      },
      {
        videoId: "xky48zyL9iA",
        title: "Getting Started With Trello (Demo)",
        channelName: "Trello",
        sourceOrganization: "Trello",
        type: "official-tutorial",
        description: "Official Trello getting-started demo from the Trello channel.",
        featureIds: ["task-boards"],
      },
    ],
  },
  airtable: {
    name: "Airtable",
    homepage: "https://www.airtable.com/",
    shots: [
      {
        file: "campaigns.png",
        url: "https://static.airtable.com/images/homepage-variant-b/ai-plays/play-4-campaigns.png",
        alt: "Airtable campaigns base",
        caption: "Campaigns base UI from the official Airtable homepage.",
        source: "https://www.airtable.com/",
        featureIds: ["task-boards", "reporting-dashboards"],
      },
      {
        file: "localize.png",
        url: "https://static.airtable.com/images/homepage-variant-b/ai-plays/play-1-localize.png",
        alt: "Airtable localization workspace",
        caption: "Localization workspace marketed on airtable.com.",
        source: "https://www.airtable.com/",
        featureIds: ["task-boards", "ai-assistance"],
      },
    ],
    videos: [
      {
        videoId: "pRUB4nnUp9o",
        title: "How to Use Airtable & Getting Started Tutorial",
        channelName: "Airtable",
        sourceOrganization: "Airtable",
        type: "official-tutorial",
        description: "Official Airtable getting-started tutorial from the Airtable channel.",
        featureIds: ["task-boards"],
      },
    ],
  },
  basecamp: {
    name: "Basecamp",
    homepage: "https://basecamp.com/",
    shots: [
      {
        file: "message-board.webp",
        url: "https://basecamp.com/assets/images/project/view-message-board-light.webp",
        alt: "Basecamp message board",
        caption: "Message board UI from the official Basecamp homepage.",
        source: "https://basecamp.com/",
        featureIds: ["docs-collaboration"],
      },
      {
        file: "todos.webp",
        url: "https://basecamp.com/assets/images/project/view-to-dos-light.webp",
        alt: "Basecamp to-dos",
        caption: "To-dos view marketed on basecamp.com.",
        source: "https://basecamp.com/",
        featureIds: ["task-boards"],
      },
      {
        file: "docs.webp",
        url: "https://basecamp.com/assets/images/project/view-docs-and-files-light.webp",
        alt: "Basecamp docs and files",
        caption: "Docs and files view from the official Basecamp site.",
        source: "https://basecamp.com/",
        featureIds: ["docs-collaboration"],
      },
    ],
    videos: [
      {
        videoId: "NjEW536dspY",
        title: "Basecamp has everything you need and nothing you don't",
        channelName: "37signals",
        sourceOrganization: "37signals",
        description: "Official Basecamp overview from the 37signals YouTube channel.",
        featureIds: ["task-boards", "docs-collaboration"],
      },
      {
        videoId: "4xertq10AiU",
        title: "Basecamp: Quick tour of Project Templates",
        channelName: "37signals",
        sourceOrganization: "37signals",
        type: "official-tutorial",
        description: "Official Basecamp project templates tour from 37signals.",
        featureIds: ["task-boards"],
      },
    ],
  },
  todoist: {
    name: "Todoist",
    homepage: "https://www.todoist.com/",
    shots: [
      {
        file: "header-ui.png",
        url: "https://www.todoist.com/_astro/headerui.en.DAyuar6R.png",
        alt: "Todoist task list interface",
        caption: "Task list UI from the official Todoist homepage.",
        source: "https://www.todoist.com/",
        featureIds: ["task-boards"],
      },
    ],
    videos: [
      {
        videoId: "fI-iTYAwL6c",
        title: "What is Todoist?",
        channelName: "Todoist",
        sourceOrganization: "Doist",
        description: "Official Todoist overview from the Todoist YouTube channel.",
        featureIds: ["task-boards"],
      },
      {
        videoId: "wEf2Mh0f_Mg",
        title: "Getting Started with Todoist",
        channelName: "Todoist",
        sourceOrganization: "Doist",
        type: "official-tutorial",
        description: "Official Todoist getting-started video from the Todoist channel.",
        featureIds: ["task-boards"],
      },
    ],
  },
  motion: {
    name: "Motion",
    homepage: "https://www.usemotion.com/",
    shots: [
      {
        file: "gantt.png",
        url: "https://www-cdn.usemotion.com/pages/homepage/v1/gantt-overdue.png",
        alt: "Motion Gantt view",
        caption: "Gantt / overdue work UI from the official Motion homepage.",
        source: "https://www.usemotion.com/",
        featureIds: ["timeline-gantt", "task-boards"],
      },
      {
        file: "dashboard.png",
        url: "https://www-cdn.usemotion.com/pages/homepage/v1/dashboard-charts.png",
        alt: "Motion dashboard charts",
        caption: "Dashboard charts marketed on usemotion.com.",
        source: "https://www.usemotion.com/",
        featureIds: ["reporting-dashboards"],
      },
      {
        file: "calendar.png",
        url: "https://www-cdn.usemotion.com/pages/homepage/v1/due-date.png",
        alt: "Motion calendar and due dates",
        caption: "Calendar / due-date UI from the official Motion homepage.",
        source: "https://www.usemotion.com/",
        featureIds: ["task-boards"],
      },
    ],
    videos: [],
  },
  "microsoft-project": {
    name: "Microsoft Project",
    homepage:
      "https://www.microsoft.com/en-us/microsoft-365/project/project-management-software",
    shots: [
      {
        file: "overview-frame.jpg",
        url: "https://i.ytimg.com/vi/1TyZCUNYZPE/maxresdefault.jpg",
        alt: "Microsoft Project overview interface",
        caption:
          "Product UI frame from the official Microsoft 365 “Overview of Microsoft Project” video.",
        source: "https://www.youtube.com/watch?v=1TyZCUNYZPE",
        annotation:
          "Official Microsoft 365 YouTube thumbnail/frame (vendor channel) — not a SoftwareGlimpse capture",
        featureIds: ["timeline-gantt", "workload-resources"],
      },
    ],
    videos: [
      {
        videoId: "1TyZCUNYZPE",
        title: "Overview of Microsoft Project",
        channelName: "Microsoft 365",
        sourceOrganization: "Microsoft",
        description:
          "Official Microsoft Project overview from the Microsoft 365 YouTube channel.",
        featureIds: ["timeline-gantt", "workload-resources"],
      },
    ],
  },
  "office-timeline": {
    name: "Office Timeline",
    homepage: "https://www.officetimeline.com/",
    shots: [
      {
        file: "gantt.png",
        url: "https://cdn.prod.website-files.com/693a79f1c52acc530a243186/69e9fb9ea7eea88d1e694b8a_lucen-timeline-powerpoint-product-launch-plan-gantt-chart.png",
        alt: "Office Timeline Gantt chart in PowerPoint",
        caption: "Product-launch Gantt chart from the official Office Timeline site.",
        source: "https://www.officetimeline.com/",
        featureIds: ["timeline-gantt"],
      },
      {
        file: "roadmap.png",
        url: "https://cdn.prod.website-files.com/693a79f1c52acc530a243186/69e9fbfca7eea88d1e6958b2_lucen-timeline-powerpoint-strategic-roadmap-dependencies.png",
        alt: "Office Timeline strategic roadmap",
        caption: "Strategic roadmap with dependencies from officetimeline.com.",
        source: "https://www.officetimeline.com/",
        featureIds: ["timeline-gantt"],
      },
    ],
    videos: [
      {
        videoId: "FK9_kkTvlgI",
        title: "What is Office Timeline? Bring Clarity to Your Projects in Minutes with Office Timeline",
        channelName: "Lucen Software",
        sourceOrganization: "Lucen Software",
        description:
          "Official Office Timeline overview from the Lucen Software YouTube channel.",
        featureIds: ["timeline-gantt"],
      },
      {
        videoId: "ehXylhvPKpA",
        title: "Office Timeline Free 2025 | Quick Start Guide",
        channelName: "Lucen Software",
        sourceOrganization: "Lucen Software",
        type: "official-tutorial",
        description: "Official Office Timeline quick-start from Lucen Software.",
        featureIds: ["timeline-gantt"],
      },
    ],
  },
  foxit: {
    name: "Foxit",
    homepage: "https://www.foxit.com/",
    shots: [
      {
        file: "editor.png",
        url: "https://www.foxit.com/assets/images/home-page/heropic.avif",
        alt: "Foxit PDF Editor interface",
        caption: "PDF Editor hero UI from the official Foxit homepage.",
        source: "https://www.foxit.com/",
        featureIds: ["document-pdf"],
      },
    ],
    videos: [
      {
        videoId: "dVhmFfmhY7g",
        title: "Demo 01 | Introduction to Foxit PDF Editor",
        channelName: "Foxit",
        sourceOrganization: "Foxit",
        type: "official-tutorial",
        description: "Official Foxit PDF Editor introduction from the Foxit YouTube channel.",
        featureIds: ["document-pdf"],
      },
      {
        videoId: "4vZc7NFISS0",
        title: "How to edit PDF fast | Foxit PDF Editor Tutorial",
        channelName: "Foxit",
        sourceOrganization: "Foxit",
        type: "official-tutorial",
        description: "Official Foxit PDF editing tutorial from the Foxit channel.",
        featureIds: ["document-pdf"],
      },
    ],
  },
  "getscreen-me": {
    name: "Getscreen.me",
    homepage: "https://getscreen.me/",
    shots: [
      {
        file: "overview.webp",
        url: "https://cdn.getscreen.me/res/land2/i/_overview@2x.webp",
        alt: "Getscreen.me remote desktop overview",
        caption: "Remote desktop overview from the official Getscreen.me homepage.",
        source: "https://getscreen.me/",
        featureIds: ["remote-access"],
      },
    ],
    videos: [
      {
        videoId: "eGscXBbZaDQ",
        title: "What is Getscreen.me?",
        channelName: "GetscreenMe",
        sourceOrganization: "Getscreen.me",
        description: "Official Getscreen.me overview from the GetscreenMe YouTube channel.",
        featureIds: ["remote-access"],
      },
      {
        videoId: "BvNiaZFnomI",
        title: "Getscreen.me: How It Works?",
        channelName: "GetscreenMe",
        sourceOrganization: "Getscreen.me",
        type: "official-tutorial",
        description: "Official Getscreen.me how-it-works video from the GetscreenMe channel.",
        featureIds: ["remote-access"],
      },
    ],
  },
  webcatalog: {
    name: "WebCatalog",
    homepage: "https://webcatalog.io/",
    shots: [
      {
        file: "launcher.png",
        url: "https://webcatalog.io/assets/screen-launcher-C6Kw4wcQ.png",
        alt: "WebCatalog desktop launcher",
        caption: "Desktop launcher UI from the official WebCatalog homepage.",
        source: "https://webcatalog.io/",
        featureIds: ["desktop-workspace"],
      },
      {
        file: "hero-poster.png",
        url: "https://webcatalog.io/assets/desktop-hero-video-poster-B0Ma0Yth.png",
        alt: "WebCatalog desktop apps workspace",
        caption: "Desktop apps workspace poster from webcatalog.io.",
        source: "https://webcatalog.io/",
        featureIds: ["desktop-workspace"],
      },
    ],
    videos: [
      {
        videoId: "OuMwhdDRKhY",
        title: "Introducing WebCatalog (English)",
        channelName: "WebCatalog",
        sourceOrganization: "WebCatalog",
        description: "Official WebCatalog introduction from the WebCatalog YouTube channel.",
        featureIds: ["desktop-workspace"],
      },
    ],
  },
};

function isAvif(buf) {
  return buf.length > 12 && buf.subarray(4, 12).toString("ascii") === "ftypavif";
}

async function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) {
    return { skipped: true, bytes: fs.statSync(dest).size };
  }
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/avif,image/webp,image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  let buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1500) throw new Error(`Too small (${buf.length}b): ${url}`);
  const ext = path.extname(dest).toLowerCase();
  if (isAvif(buf) && ext === ".png") {
    buf = await sharp(buf).png().toBuffer();
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return { skipped: false, bytes: buf.length };
}

function buildScreenshot(slug, shot) {
  const id = `${slug}-shot-${shot.file.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]/gi, "-")}`;
  return {
    id,
    src: `/vendor-ui/${slug}/${shot.file}`,
    alt: shot.alt,
    caption: shot.caption,
    source: shot.source,
    checkedAt: CHECKED_AT,
    annotation:
      shot.annotation || `Official ${PRODUCTS[slug].name} marketing UI asset`,
    kind: "vendor-ui",
    featureIds: shot.featureIds ?? [],
    useCaseIds: shot.useCaseIds ?? [],
  };
}

function buildMedia(slug, video) {
  const id = `${slug}-video-${video.videoId.toLowerCase()}`;
  return {
    id,
    productSlug: slug,
    productIds: [slug],
    type: video.type || "official-video",
    provider: "youtube",
    sourceUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
    videoId: video.videoId,
    providerId: video.videoId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
    title: video.title,
    description: video.description,
    thumbnailUrl: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
    sourceOrganization: video.sourceOrganization,
    channelName: video.channelName,
    officialSource: true,
    officialSourceKind: video.officialSourceKind || "vendor-channel",
    verifiedAt: CHECKED_AT,
    lastCheckedAt: CHECKED_AT,
    sourceHealth: "unknown",
    refreshFlags: [],
    embeddingAllowed: true,
    capabilityIds: [],
    featureIds: video.featureIds ?? [],
    requirementIds: [],
    useCaseIds: video.useCaseIds ?? [],
    industryIds: [],
    guideIds: [],
    evidenceRefs: [],
    evidenceClaimIds: [],
    evidenceClaimKinds: ["workflow-demo", "ui-layout", "feature-existence"],
    demonstratedDimensionIds: [],
    requirementCriterionIds: [],
    workflowStageIds: [],
    reportedOutcomes: [],
    placements: ["overview", "features", "evidence"],
    mediaContext: "general-workflow",
    purpose: `Official ${PRODUCTS[slug].name} video for product research pages`,
    demonstratesCaption: `How ${PRODUCTS[slug].name} presents the product in an official vendor video.`,
    editorialCommentary:
      "Official vendor demo — treat as UI/workflow evidence, not SoftwareGlimpse scoring.",
    whatThisShows: [
      `${PRODUCTS[slug].name} product surfaces as shown in the official vendor video`,
      "UI/workflow layout marketed by the vendor",
    ],
    limitations: [...DEFAULT_LIMITATIONS],
    whatToNotice: [],
    status: "published",
  };
}

function unionPlacements(existing, extra) {
  return [...new Set([...(existing ?? []), ...extra])];
}

function mergeEnrichment(slug) {
  const enrichmentPath = path.join(
    ROOT,
    "src/data/research",
    slug,
    "enrichment.json",
  );
  if (!fs.existsSync(enrichmentPath)) {
    throw new Error(`Missing enrichment: ${enrichmentPath}`);
  }
  const data = JSON.parse(fs.readFileSync(enrichmentPath, "utf8"));
  const plan = PRODUCTS[slug];
  data.screenshots = Array.isArray(data.screenshots) ? data.screenshots : [];
  data.media = Array.isArray(data.media) ? data.media : [];

  const existingShotIds = new Set(data.screenshots.map((s) => s.id));
  const existingShotSrcs = new Set(data.screenshots.map((s) => s.src));
  let shotsAdded = 0;
  for (const shot of plan.shots) {
    const entry = buildScreenshot(slug, shot);
    if (existingShotIds.has(entry.id) || existingShotSrcs.has(entry.src)) continue;
    data.screenshots.push(entry);
    existingShotIds.add(entry.id);
    existingShotSrcs.add(entry.src);
    shotsAdded++;
  }

  const existingMediaIds = new Set(data.media.map((m) => m.id));
  const existingVideoIds = new Set(
    data.media.map((m) => m.videoId || m.providerId).filter(Boolean),
  );
  let mediaAdded = 0;
  let mediaUpdated = 0;
  for (const video of plan.videos) {
    const entry = buildMedia(slug, video);
    const match = data.media.find(
      (m) =>
        m.id === entry.id ||
        m.videoId === video.videoId ||
        m.providerId === video.videoId,
    );
    if (match) {
      match.placements = unionPlacements(match.placements, entry.placements);
      if (!match.thumbnailUrl) match.thumbnailUrl = entry.thumbnailUrl;
      if (!match.embedUrl) match.embedUrl = entry.embedUrl;
      if (!match.description) match.description = entry.description;
      if (!match.evidenceClaimKinds?.length) {
        match.evidenceClaimKinds = entry.evidenceClaimKinds;
      }
      mediaUpdated++;
      continue;
    }
    if (existingMediaIds.has(entry.id) || existingVideoIds.has(entry.videoId)) {
      continue;
    }
    data.media.push(entry);
    existingMediaIds.add(entry.id);
    existingVideoIds.add(entry.videoId);
    mediaAdded++;
  }

  data.updatedAt = CHECKED_AT;
  fs.writeFileSync(enrichmentPath, `${JSON.stringify(data, null, 2)}\n`);

  const vendorUi = data.screenshots.filter((s) => s.kind !== "original-diagram").length;
  const publishedMedia = data.media.filter(
    (m) => m.status === "active" || m.status === "published",
  ).length;
  return {
    shotsAdded,
    mediaAdded,
    mediaUpdated,
    vendorUi,
    publishedMedia,
    enrichmentPath,
  };
}

async function processProduct(slug) {
  const plan = PRODUCTS[slug];
  if (!plan) throw new Error(`Unknown slug: ${slug}`);
  const dir = path.join(ROOT, "public/vendor-ui", slug);
  fs.mkdirSync(dir, { recursive: true });

  const downloadResults = [];
  for (const shot of plan.shots) {
    const dest = path.join(dir, shot.file);
    try {
      const result = await download(shot.url, dest);
      downloadResults.push({ file: shot.file, ok: true, ...result, url: shot.url });
    } catch (err) {
      downloadResults.push({
        file: shot.file,
        ok: false,
        error: String(err.message || err),
        url: shot.url,
      });
    }
  }

  const okFiles = new Set(downloadResults.filter((r) => r.ok).map((r) => r.file));
  const original = plan.shots;
  plan.shots = plan.shots.filter((s) => okFiles.has(s.file));
  const merge = mergeEnrichment(slug);
  plan.shots = original;

  return { slug, downloadResults, ...merge };
}

async function main() {
  const argSlug = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const slugs = argSlug ? [argSlug] : Object.keys(PRODUCTS);
  const summary = [];

  for (const slug of slugs) {
    process.stdout.write(`\n→ ${slug}...\n`);
    const result = await processProduct(slug);
    for (const r of result.downloadResults) {
      const status = r.ok
        ? r.skipped
          ? `skip ${r.bytes}b`
          : `ok ${r.bytes}b`
        : `FAIL ${r.error}`;
      console.log(`  ${r.file}: ${status}`);
    }
    console.log(
      `  enrichment: +${result.shotsAdded} shots, +${result.mediaAdded} videos, ~${result.mediaUpdated} updated → vendor-ui=${result.vendorUi} media=${result.publishedMedia}`,
    );
    const fails = result.downloadResults.filter((r) => !r.ok);
    if (fails.length) console.warn(`  ⚠ ${fails.length} download failure(s)`);
    summary.push(result);
  }

  console.log("\n=== SUMMARY ===");
  for (const s of summary) {
    console.log(
      `${s.slug}\tvendor-ui=${s.vendorUi}\tvideos=${s.publishedMedia}\t(+${s.shotsAdded}/+${s.mediaAdded}/~${s.mediaUpdated})`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
