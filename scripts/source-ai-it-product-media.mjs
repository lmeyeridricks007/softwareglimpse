#!/usr/bin/env node
/**
 * Source official marketing UI (og:image / first-party CDN) + official YouTube
 * videos for AI and IT products. Idempotent.
 *
 * Usage:
 *   node scripts/source-ai-it-product-media.mjs
 *   node scripts/source-ai-it-product-media.mjs --slug=chatgpt
 *
 * Videos: YouTube oEmbed author_name must match vendorAllow.
 * Screenshots: official og:image or listed first-party URLs only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CHECKED_AT = "2026-08-18T17:10:00.000Z";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SoftwareGlimpseMediaBot/1.0";

const DEFAULT_LIMITATIONS = [
  "pricing",
  "comparative superiority",
  "security or compliance certification",
  "implementation effort or total cost of ownership",
];

const PRODUCTS = {
  chatgpt: {
    name: "ChatGPT",
    homepage: "https://chatgpt.com/",
    featureIds: ["llm-chat"],
    useCaseIds: ["llm-assistant"],
    vendorAllow: /openai|chatgpt/i,
    videos: [{ videoId: "jNQXAC9IVRw", title: "placeholder-skip" }],
  },
  claude: {
    name: "Claude",
    homepage: "https://claude.ai/",
    featureIds: ["llm-chat"],
    useCaseIds: ["llm-assistant"],
    vendorAllow: /anthropic|claude/i,
    videos: [],
  },
  gemini: {
    name: "Gemini",
    homepage: "https://gemini.google.com/",
    featureIds: ["llm-chat"],
    useCaseIds: ["llm-assistant"],
    vendorAllow: /google/i,
    videos: [],
  },
  "microsoft-copilot": {
    name: "Microsoft 365 Copilot",
    homepage: "https://www.microsoft.com/microsoft-365-copilot",
    featureIds: ["llm-chat", "meeting-notes"],
    useCaseIds: ["llm-assistant"],
    vendorAllow: /microsoft/i,
    videos: [{ videoId: "n8mQjzN3e3A", title: "Microsoft 365 Copilot overview" }],
  },
  perplexity: {
    name: "Perplexity",
    homepage: "https://www.perplexity.ai/",
    featureIds: ["llm-chat"],
    useCaseIds: ["llm-assistant"],
    vendorAllow: /perplexity/i,
    videos: [],
  },
  "github-copilot": {
    name: "GitHub Copilot",
    homepage: "https://github.com/features/copilot",
    featureIds: ["code-assist"],
    useCaseIds: ["ai-code"],
    vendorAllow: /github/i,
    videos: [{ videoId: "Fi3AJZZregI", title: "GitHub Copilot overview" }],
  },
  cursor: {
    name: "Cursor",
    homepage: "https://cursor.com/",
    featureIds: ["code-assist"],
    useCaseIds: ["ai-code"],
    vendorAllow: /cursor/i,
    videos: [{ videoId: "aP8ue0a_kKc", title: "Cursor overview" }],
  },
  midjourney: {
    name: "Midjourney",
    homepage: "https://www.midjourney.com/",
    featureIds: ["image-generation"],
    useCaseIds: ["ai-image"],
    vendorAllow: /midjourney/i,
    videos: [],
  },
  "adobe-firefly": {
    name: "Adobe Firefly",
    homepage: "https://www.adobe.com/products/firefly.html",
    featureIds: ["image-generation"],
    useCaseIds: ["ai-image"],
    vendorAllow: /adobe/i,
    videos: [{ videoId: "YqQx75OPRa0", title: "Adobe Firefly overview" }],
  },
  runway: {
    name: "Runway",
    homepage: "https://runwayml.com/",
    featureIds: ["video-generation"],
    useCaseIds: ["ai-video"],
    vendorAllow: /runway/i,
    videos: [{ videoId: "L7s1MQYxY8U", title: "Runway overview" }],
  },
  synthesia: {
    name: "Synthesia",
    homepage: "https://www.synthesia.io/",
    featureIds: ["video-generation"],
    useCaseIds: ["ai-video"],
    vendorAllow: /synthesia/i,
    videos: [
      {
        videoId: "ikQZ8yLhHRU",
        title: "Discover Synthesia in 5 minutes | Product Tour",
      },
    ],
  },
  "otter-ai": {
    name: "Otter.ai",
    homepage: "https://otter.ai/",
    featureIds: ["meeting-notes"],
    useCaseIds: ["ai-meeting"],
    vendorAllow: /otter/i,
    videos: [{ videoId: "nGqW8qH1n7E", title: "Otter.ai overview" }],
  },
  fireflies: {
    name: "Fireflies.ai",
    homepage: "https://fireflies.ai/",
    featureIds: ["meeting-notes"],
    useCaseIds: ["ai-meeting"],
    vendorAllow: /fireflies/i,
    videos: [{ videoId: "H5fdzoAeLCE", title: "What is Fireflies.ai" }],
  },
  quillbot: {
    name: "QuillBot",
    homepage: "https://quillbot.com/",
    featureIds: ["writing-assist"],
    useCaseIds: ["ai-writing"],
    vendorAllow: /quillbot/i,
    videos: [],
  },
  elevenlabs: {
    name: "ElevenLabs",
    homepage: "https://elevenlabs.io/",
    featureIds: ["voice-tts"],
    useCaseIds: ["ai-voice"],
    vendorAllow: /elevenlabs/i,
    videos: [{ videoId: "a3sVh-jPzjI", title: "ElevenLabs overview" }],
  },
  gamma: {
    name: "Gamma",
    homepage: "https://gamma.app/",
    featureIds: ["presentation-generation"],
    useCaseIds: ["ai-presentations"],
    vendorAllow: /gamma/i,
    videos: [{ videoId: "yK0vW5mQ2nM", title: "Gamma overview" }],
  },
  wegic: {
    name: "Wegic",
    homepage: "https://wegic.ai/",
    featureIds: ["website-generation"],
    useCaseIds: ["ai-website-builder"],
    vendorAllow: /wegic/i,
    videos: [],
  },
  "adcreative-ai": {
    name: "AdCreative.ai",
    homepage: "https://www.adcreative.ai/",
    featureIds: ["ad-creative-generation"],
    useCaseIds: ["ai-ad-creative"],
    vendorAllow: /adcreative/i,
    videos: [],
  },
  mindstudio: {
    name: "MindStudio",
    homepage: "https://www.mindstudio.ai/",
    featureIds: ["agent-builder"],
    useCaseIds: ["ai-agents"],
    vendorAllow: /mindstudio/i,
    videos: [],
  },
  servicenow: {
    name: "ServiceNow",
    homepage: "https://www.servicenow.com/",
    featureIds: ["incident-management"],
    useCaseIds: ["itsm-service-desk"],
    vendorAllow: /servicenow/i,
    videos: [{ videoId: "kP0qW7vXk0Y", title: "ServiceNow overview" }],
  },
  "jira-service-management": {
    name: "Jira Service Management",
    homepage: "https://www.atlassian.com/software/jira/service-management",
    featureIds: ["incident-management", "service-catalog"],
    useCaseIds: ["itsm-service-desk"],
    vendorAllow: /atlassian/i,
    videos: [{ videoId: "6iFbuIpe68k", title: "Jira Service Management overview" }],
  },
  freshservice: {
    name: "Freshservice",
    homepage: "https://www.freshworks.com/freshservice/",
    featureIds: ["incident-management"],
    useCaseIds: ["itsm-service-desk"],
    vendorAllow: /freshworks|freshservice/i,
    videos: [],
  },
  datadog: {
    name: "Datadog",
    homepage: "https://www.datadoghq.com/",
    featureIds: ["infrastructure-monitoring", "apm-tracing"],
    useCaseIds: ["observability-monitoring"],
    vendorAllow: /datadog/i,
    videos: [{ videoId: "h2-2v1qR0n8", title: "Datadog overview" }],
  },
  "new-relic": {
    name: "New Relic",
    homepage: "https://newrelic.com/",
    featureIds: ["apm-tracing"],
    useCaseIds: ["observability-monitoring"],
    vendorAllow: /new relic|newrelic/i,
    videos: [],
  },
  "grafana-cloud": {
    name: "Grafana Cloud",
    homepage: "https://grafana.com/products/cloud/",
    featureIds: ["infrastructure-monitoring"],
    useCaseIds: ["observability-monitoring"],
    vendorAllow: /grafana/i,
    videos: [],
  },
  dynatrace: {
    name: "Dynatrace",
    homepage: "https://www.dynatrace.com/",
    featureIds: ["apm-tracing", "infrastructure-monitoring"],
    useCaseIds: ["observability-monitoring"],
    vendorAllow: /dynatrace/i,
    videos: [
      { videoId: "qo6vjyE-Ak0", title: "What is Dynatrace in 15 minutes" },
    ],
  },
  pagerduty: {
    name: "PagerDuty",
    homepage: "https://www.pagerduty.com/",
    featureIds: ["oncall-paging"],
    useCaseIds: ["incident-oncall"],
    vendorAllow: /pagerduty/i,
    videos: [],
  },
  github: {
    name: "GitHub",
    homepage: "https://github.com/",
    featureIds: ["source-control", "cicd-actions"],
    useCaseIds: ["source-control-devops"],
    vendorAllow: /github/i,
    videos: [{ videoId: "w3jLJU7DT5E", title: "GitHub overview" }],
  },
  gitlab: {
    name: "GitLab",
    homepage: "https://about.gitlab.com/",
    featureIds: ["source-control", "cicd-actions"],
    useCaseIds: ["source-control-devops"],
    vendorAllow: /gitlab/i,
    videos: [],
  },
  bitbucket: {
    name: "Bitbucket",
    homepage: "https://bitbucket.org/product",
    featureIds: ["source-control"],
    useCaseIds: ["source-control-devops"],
    vendorAllow: /atlassian|bitbucket/i,
    videos: [],
  },
  "azure-devops": {
    name: "Azure DevOps",
    homepage: "https://azure.microsoft.com/products/devops/",
    featureIds: ["source-control", "cicd-actions"],
    useCaseIds: ["source-control-devops"],
    vendorAllow: /microsoft/i,
    videos: [
      {
        videoId: "JhqpF-5E10I",
        title: "Introduction to Azure DevOps",
      },
    ],
  },
  plesk: {
    name: "Plesk",
    homepage: "https://www.plesk.com/",
    featureIds: ["hosting-panel"],
    useCaseIds: ["hosting-operations"],
    vendorAllow: /plesk/i,
    videos: [],
  },
  cpanel: {
    name: "cPanel",
    homepage: "https://cpanel.net/",
    featureIds: ["hosting-panel"],
    useCaseIds: ["hosting-operations"],
    vendorAllow: /cpanel/i,
    videos: [],
  },
  "bright-data": {
    name: "Bright Data",
    homepage: "https://brightdata.com/",
    featureIds: ["proxy-network"],
    useCaseIds: ["web-data-collection"],
    vendorAllow: /bright data|brightdata/i,
    videos: [],
  },
  oxylabs: {
    name: "Oxylabs",
    homepage: "https://oxylabs.io/",
    featureIds: ["proxy-network"],
    useCaseIds: ["web-data-collection"],
    vendorAllow: /oxylabs/i,
    videos: [
      {
        videoId: "0rULasZsV3M",
        title: "What Is a Proxy Server? How It Works & Why You Need One",
      },
    ],
  },
  scraperapi: {
    name: "ScraperAPI",
    homepage: "https://www.scraperapi.com/",
    featureIds: ["proxy-network"],
    useCaseIds: ["web-data-collection"],
    vendorAllow: /scraperapi|scraper api/i,
    videos: [],
  },
  apify: {
    name: "Apify",
    homepage: "https://apify.com/",
    featureIds: ["proxy-network"],
    useCaseIds: ["web-data-collection"],
    vendorAllow: /apify/i,
    videos: [
      {
        videoId: "x-Zzwq6KOLw",
        title: "Claude Fable 5 + Apify: 3× Cheaper Web Data",
      },
    ],
  },
  thordata: {
    name: "ThorData",
    homepage: "https://thordata.com/",
    featureIds: ["proxy-network"],
    useCaseIds: ["web-data-collection"],
    vendorAllow: /thordata|thor data/i,
    videos: [
      {
        videoId: "pJGF19bFMlg",
        title: "Getting started with Scraping Browser",
      },
    ],
  },
  cloudways: {
    name: "Cloudways",
    homepage: "https://www.cloudways.com/",
    featureIds: ["managed-hosting"],
    useCaseIds: ["hosting-providers"],
    vendorAllow: /cloudways/i,
    videos: [
      {
        videoId: "_M2CHetCobc",
        title: "Cloning, Staging and Server Transfer Without Sysadmins",
      },
    ],
  },
  "wp-engine": {
    name: "WP Engine",
    homepage: "https://wpengine.com/",
    featureIds: ["managed-hosting"],
    useCaseIds: ["hosting-providers"],
    vendorAllow: /wp engine|wpengine/i,
    videos: [
      {
        videoId: "LK2VgEGaO9s",
        title: "Need to migrate multiple sites? You can now do it all at once!",
      },
    ],
  },
  zapier: {
    name: "Zapier",
    homepage: "https://zapier.com/",
    featureIds: ["workflow-automation", "connectors"],
    useCaseIds: ["ai-automation"],
    vendorAllow: /zapier/i,
    videos: [
      {
        videoId: "3S1yzf9FDnk",
        title: "How to Create Your First Zap in Zapier",
      },
    ],
  },
  n8n: {
    name: "n8n",
    homepage: "https://n8n.io/",
    featureIds: ["workflow-automation", "connectors"],
    useCaseIds: ["ai-automation"],
    vendorAllow: /n8n/i,
    videos: [
      {
        videoId: "1MwSoB0gnM4",
        title: "n8n Quickstart",
      },
    ],
  },
  splunk: {
    name: "Splunk Observability Cloud",
    homepage: "https://www.splunk.com/",
    featureIds: ["infrastructure-monitoring", "apm-tracing", "log-management"],
    useCaseIds: ["observability-monitoring"],
    vendorAllow: /splunk/i,
    videos: [],
  },
  "elastic-observability": {
    name: "Elastic Observability",
    homepage: "https://www.elastic.co/",
    featureIds: ["infrastructure-monitoring", "apm-tracing", "log-management"],
    useCaseIds: ["observability-monitoring"],
    vendorAllow: /elastic/i,
    videos: [],
  },
  sentry: {
    name: "Sentry",
    homepage: "https://sentry.io/",
    featureIds: ["apm-tracing", "analytics-reporting"],
    useCaseIds: ["observability-monitoring"],
    vendorAllow: /sentry/i,
    videos: [],
  },
  "incident-io": {
    name: "incident.io",
    homepage: "https://incident.io/",
    featureIds: ["oncall-paging", "incident-management"],
    useCaseIds: ["incident-oncall"],
    vendorAllow: /incident\.io|incident io/i,
    videos: [],
  },
  circleci: {
    name: "CircleCI",
    homepage: "https://circleci.com/",
    featureIds: ["cicd-actions"],
    useCaseIds: ["source-control-devops"],
    vendorAllow: /circleci|circle ci/i,
    videos: [],
  },
  directadmin: {
    name: "DirectAdmin",
    homepage: "https://www.directadmin.com/",
    featureIds: ["hosting-panel"],
    useCaseIds: ["hosting-operations"],
    vendorAllow: /directadmin|direct admin/i,
    videos: [],
    shots: [
      {
        file: "vendor-ui-panel.png",
        url: "https://www.directadmin.com/img/update/index/slide-1.png",
        alt: "DirectAdmin control panel dashboard on desktop and mobile",
        caption:
          "Official DirectAdmin control-panel marketing visual from directadmin.com (homepage product UI).",
      },
    ],
  },
  kinsta: {
    name: "Kinsta",
    homepage: "https://kinsta.com/",
    featureIds: ["managed-hosting"],
    useCaseIds: ["hosting-providers"],
    vendorAllow: /kinsta/i,
    videos: [],
  },
  smartproxy: {
    name: "Decodo (Smartproxy)",
    homepage: "https://decodo.com/",
    featureIds: ["proxy-network"],
    useCaseIds: ["web-data-collection"],
    vendorAllow: /decodo|smartproxy/i,
    videos: [],
  },
  "manageengine-servicedesk-plus": {
    name: "ManageEngine ServiceDesk Plus",
    homepage: "https://www.manageengine.com/products/service-desk/",
    featureIds: ["incident-management", "service-catalog", "change-problem"],
    useCaseIds: ["itsm-service-desk"],
    vendorAllow: /manageengine|zoho/i,
    videos: [],
  },
  sysaid: {
    name: "SysAid",
    homepage: "https://www.sysaid.com/",
    featureIds: ["incident-management", "service-catalog", "itsm-ai"],
    useCaseIds: ["itsm-service-desk"],
    vendorAllow: /sysaid/i,
    videos: [],
  },
  haloitsm: {
    name: "HaloITSM",
    homepage: "https://haloitsm.com/",
    featureIds: ["incident-management", "service-catalog", "change-problem"],
    useCaseIds: ["itsm-service-desk"],
    vendorAllow: /halo|haloitsm/i,
    videos: [],
  },
  appdynamics: {
    name: "AppDynamics",
    homepage: "https://www.appdynamics.com/",
    featureIds: ["apm-tracing", "infrastructure-monitoring"],
    useCaseIds: ["observability-monitoring"],
    vendorAllow: /appdynamics|cisco/i,
    videos: [],
  },
  honeycomb: {
    name: "Honeycomb",
    homepage: "https://www.honeycomb.io/",
    featureIds: ["apm-tracing", "log-management"],
    useCaseIds: ["observability-monitoring"],
    vendorAllow: /honeycomb/i,
    videos: [],
  },
  firehydrant: {
    name: "FireHydrant",
    homepage: "https://firehydrant.com/",
    featureIds: ["oncall-paging", "incident-management"],
    useCaseIds: ["incident-oncall"],
    vendorAllow: /firehydrant|fire hydrant/i,
    videos: [],
  },
  rootly: {
    name: "Rootly",
    homepage: "https://rootly.com/",
    featureIds: ["oncall-paging", "incident-management"],
    useCaseIds: ["incident-oncall"],
    vendorAllow: /rootly/i,
    videos: [],
  },
  buildkite: {
    name: "Buildkite",
    homepage: "https://buildkite.com/",
    featureIds: ["cicd-actions"],
    useCaseIds: ["source-control-devops"],
    vendorAllow: /buildkite/i,
    videos: [],
  },
  siteground: {
    name: "SiteGround",
    homepage: "https://www.siteground.com/",
    featureIds: ["managed-hosting"],
    useCaseIds: ["hosting-providers"],
    vendorAllow: /siteground|site ground/i,
    videos: [],
  },
  zyte: {
    name: "Zyte",
    homepage: "https://www.zyte.com/",
    featureIds: ["proxy-network"],
    useCaseIds: ["web-data-collection"],
    vendorAllow: /zyte|scrapinghub/i,
    videos: [],
  },
  iproyal: {
    name: "IPRoyal",
    homepage: "https://iproyal.com/",
    featureIds: ["proxy-network"],
    useCaseIds: ["web-data-collection"],
    vendorAllow: /iproyal|ip royal/i,
    videos: [],
  },
  topdesk: {
    name: "TOPdesk",
    homepage: "https://www.topdesk.com/",
    featureIds: ["incident-management", "service-catalog"],
    useCaseIds: ["itsm-service-desk"],
    vendorAllow: /topdesk/i,
    videos: [
      {
        videoId: "8eZDe24Bq8o",
        title: "TOPdesk: Service Management That Feels Personal",
      },
    ],
  },
  ivanti: {
    name: "Ivanti Neurons for ITSM",
    homepage: "https://www.ivanti.com/products/ivanti-neurons-for-itsm",
    featureIds: ["incident-management", "service-catalog", "change-problem"],
    useCaseIds: ["itsm-service-desk"],
    vendorAllow: /ivanti/i,
    videos: [
      {
        videoId: "V5ZIhtPR8TY",
        title: "Stop Ticket Escalations: Ivanti Neurons Workspace Demo",
      },
    ],
  },
  "bmc-helix": {
    name: "BMC Helix ITSM",
    homepage: "https://www.bmc.com/it-solutions/bmc-helix-itsm.html",
    featureIds: ["incident-management", "change-problem", "service-catalog"],
    useCaseIds: ["itsm-service-desk"],
    vendorAllow: /bmc/i,
    videos: [
      {
        videoId: "MsELM-v29FM",
        title: "What’s new in BMC Helix ITSM 25.1",
      },
    ],
  },
  chronosphere: {
    name: "Chronosphere",
    homepage: "https://chronosphere.io/",
    featureIds: ["infrastructure-monitoring", "apm-tracing"],
    useCaseIds: ["observability-monitoring"],
    vendorAllow: /chronosphere/i,
    videos: [],
  },
  coralogix: {
    name: "Coralogix",
    homepage: "https://coralogix.com/",
    featureIds: ["log-management", "apm-tracing", "infrastructure-monitoring"],
    useCaseIds: ["observability-monitoring"],
    vendorAllow: /coralogix/i,
    videos: [
      {
        videoId: "_ky2hztcwkk",
        title: "20.0 Coralogix Academy - Introduction",
      },
    ],
  },
  render: {
    name: "Render",
    homepage: "https://render.com/",
    featureIds: ["cloud-paas", "cicd-actions"],
    useCaseIds: ["cloud-paas"],
    vendorAllow: /render/i,
    videos: [],
  },
  "fly-io": {
    name: "Fly.io",
    homepage: "https://fly.io/",
    featureIds: ["cloud-paas", "cicd-actions"],
    useCaseIds: ["cloud-paas"],
    vendorAllow: /fly/i,
    videos: [
      {
        videoId: "-gDjLF7x27k",
        title: "N-tier architecture is not your only option.",
      },
    ],
  },
  railway: {
    name: "Railway",
    homepage: "https://railway.com/",
    featureIds: ["cloud-paas", "cicd-actions"],
    useCaseIds: ["cloud-paas"],
    vendorAllow: /railway/i,
    videos: [
      {
        videoId: "sDZN5ho31DE",
        title: "Agent Sandboxes in Railway",
      },
    ],
  },
  heroku: {
    name: "Heroku",
    homepage: "https://www.heroku.com/",
    featureIds: ["cloud-paas", "cicd-actions"],
    useCaseIds: ["cloud-paas"],
    vendorAllow: /heroku/i,
    videos: [],
  },
  squadcast: {
    name: "SolarWinds Incident Response",
    homepage: "https://www.solarwinds.com/it-incident-response-software",
    featureIds: ["oncall-paging", "incident-management"],
    useCaseIds: ["incident-oncall"],
    vendorAllow: /solarwinds|squadcast/i,
    videos: [],
    shots: [
      {
        file: "vendor-ui-hero.jpg",
        url: "https://p1.aprimocdn.net/solarwinds/a9981a05-d4f4-4975-97a3-b48e00f7dda9/SIR_ProductPage_Hero_Original%20file.jpg",
        alt: "SolarWinds Incident Response service dashboard with on-call and automation rules",
        caption:
          "Official SolarWinds Incident Response product UI from solarwinds.com/it-incident-response-software.",
      },
    ],
  },
};

function firstPartyHost(homepage, imageUrl) {
  try {
    const pageHost = new URL(homepage).hostname.replace(/^www\./, "");
    const imgHost = new URL(imageUrl).hostname.replace(/^www\./, "");
    const root = pageHost.split(".").slice(-2).join(".");
    if (imgHost.endsWith(root)) return true;
    const allowed = [
      "cloudfront.net",
      "cloudinary.com",
      "imgix.net",
      "ctfassets.net",
      "storyblok.com",
      "sanity.io",
      "webflow.com",
      "website-files.com",
      "adobe.com",
      "microsoft.com",
      "azure.net",
      "googleusercontent.com",
      "gstatic.com",
      "githubassets.com",
      "githubusercontent.com",
      "atlassian.com",
      "atl-paas.net",
      "gitlab.com",
      "gitlab-static.net",
      "datadoghq.com",
      "newrelic.com",
      "grafana.com",
      "dynatrace.com",
      "servicenow.com",
      "freshworks.com",
      "pagerduty.com",
      "cpanel.net",
      "plesk.com",
      "brightdata.com",
      "openai.com",
      "oaistatic.com",
      "anthropic.com",
      "perplexity.ai",
      "cursor.com",
      "cursor.sh",
      "midjourney.com",
      "runwayml.com",
      "synthesia.io",
      "otter.ai",
      "fireflies.ai",
      "quillbot.com",
      "elevenlabs.io",
      "gamma.app",
      "wegic.ai",
      "adcreative.ai",
      "mindstudio.ai",
      "solarwinds.com",
      "aprimocdn.net",
      "directadmin.com",
    ];
    return allowed.some((d) => imgHost === d || imgHost.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function extractOgImage(html) {
  const m =
    html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    );
  return m?.[1] ?? null;
}

function extractYoutubeIds(html) {
  const ids = new Set();
  const re =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/g;
  let match;
  while ((match = re.exec(html))) ids.add(match[1]);
  return [...ids];
}

async function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) {
    return { skipped: true, bytes: fs.statSync(dest).size };
  }
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1500) throw new Error(`Too small (${buf.length}b): ${url}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return { skipped: false, bytes: buf.length };
}

async function oEmbed(videoId) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`oEmbed HTTP ${res.status}`);
  return res.json();
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
    annotation: `Official ${PRODUCTS[slug].name} marketing UI asset`,
    kind: "vendor-ui",
    featureIds: shot.featureIds ?? PRODUCTS[slug].featureIds,
    useCaseIds: shot.useCaseIds ?? PRODUCTS[slug].useCaseIds,
  };
}

function buildMedia(slug, video, authorName) {
  const plan = PRODUCTS[slug];
  return {
    id: `${slug}-video-${video.videoId.toLowerCase()}`,
    productSlug: slug,
    productIds: [slug],
    type: "official-video",
    provider: "youtube",
    sourceUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
    videoId: video.videoId,
    providerId: video.videoId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
    title: video.title,
    description: `Official ${plan.name} product video from the vendor YouTube channel.`,
    thumbnailUrl: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
    sourceOrganization: plan.name,
    channelName: authorName,
    officialSource: true,
    officialSourceKind: "vendor-channel",
    verifiedAt: CHECKED_AT,
    lastCheckedAt: CHECKED_AT,
    sourceHealth: "unknown",
    refreshFlags: [],
    embeddingAllowed: true,
    capabilityIds: [],
    featureIds: plan.featureIds,
    requirementIds: [],
    useCaseIds: plan.useCaseIds,
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
    purpose: `Official ${plan.name} video for product research pages`,
    demonstratesCaption: `How ${plan.name} presents the product in an official vendor video.`,
    editorialCommentary:
      "Official vendor demo — treat as UI/workflow evidence, not SoftwareGlimpse scoring.",
    whatThisShows: [
      `${plan.name} product surfaces as shown in the official vendor video`,
      "UI/workflow layout marketed by the vendor",
    ],
    limitations: [...DEFAULT_LIMITATIONS],
    whatToNotice: [],
    status: "published",
  };
}

function mergeEnrichment(slug, shots, videos) {
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
  data.screenshots = Array.isArray(data.screenshots) ? data.screenshots : [];
  data.media = Array.isArray(data.media) ? data.media : [];

  const existingShotIds = new Set(data.screenshots.map((s) => s.id));
  const existingShotSrcs = new Set(data.screenshots.map((s) => s.src));
  let shotsAdded = 0;
  for (const shot of shots) {
    const entry = buildScreenshot(slug, shot);
    if (existingShotIds.has(entry.id) || existingShotSrcs.has(entry.src)) {
      continue;
    }
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
  for (const video of videos) {
    const entry = buildMedia(slug, video.meta, video.authorName);
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
  return { shotsAdded, mediaAdded, enrichmentPath };
}

async function processProduct(slug) {
  const plan = PRODUCTS[slug];
  const dir = path.join(ROOT, "public/vendor-ui", slug);
  fs.mkdirSync(dir, { recursive: true });
  const shots = [];
  let ogNote = "no og:image";

  try {
    const html = await fetchText(plan.homepage);
    const og = extractOgImage(html);
    if (og) {
      const abs = new URL(og, plan.homepage).href;
      if (!firstPartyHost(plan.homepage, abs)) {
        ogNote = `skip third-party og host ${new URL(abs).hostname}`;
      } else {
        const ext = path.extname(new URL(abs).pathname).toLowerCase();
        const suffix = ext && ext.length <= 5 ? ext : ".png";
        const file = `vendor-og${suffix}`;
        const dest = path.join(dir, file);
        const result = await download(abs, dest);
        shots.push({
          file,
          alt: `${plan.name} official marketing visual`,
          caption: `Official Open Graph / marketing visual from ${plan.homepage}.`,
          source: plan.homepage,
          featureIds: plan.featureIds,
          useCaseIds: plan.useCaseIds,
        });
        ogNote = result.skipped
          ? `og exists ${result.bytes}b`
          : `og downloaded ${result.bytes}b`;
      }
    }
  } catch (err) {
    ogNote = `og failed: ${err.message}`;
  }

  const listedShotNotes = [];
  for (const shot of plan.shots ?? []) {
    if (!firstPartyHost(plan.homepage, shot.url)) {
      listedShotNotes.push(`skip third-party listed shot ${shot.url}`);
      continue;
    }
    try {
      const dest = path.join(dir, shot.file);
      const result = await download(shot.url, dest);
      shots.push({
        file: shot.file,
        alt: shot.alt,
        caption: shot.caption,
        source: shot.source ?? plan.homepage,
        featureIds: plan.featureIds,
        useCaseIds: plan.useCaseIds,
      });
      listedShotNotes.push(
        result.skipped
          ? `${shot.file} exists ${result.bytes}b`
          : `${shot.file} downloaded ${result.bytes}b`,
      );
    } catch (err) {
      listedShotNotes.push(`${shot.file} failed: ${err.message}`);
    }
  }

  const acceptedVideos = [];
  const videoNotes = [];
  const listed = (plan.videos ?? []).filter((v) => v.title !== "placeholder-skip");
  let homepageIds = [];
  try {
    const html = await fetchText(plan.homepage);
    homepageIds = extractYoutubeIds(html);
  } catch {
    /* homepage already fetched above; ignore second-pass failures */
  }
  const candidates = [
    ...listed.map((v) => ({ videoId: v.videoId, title: v.title })),
    ...homepageIds.map((id) => ({ videoId: id, title: `${plan.name} official video` })),
  ];
  const seenIds = new Set();
  for (const video of candidates) {
    if (seenIds.has(video.videoId)) continue;
    seenIds.add(video.videoId);
    try {
      const embed = await oEmbed(video.videoId);
      const author = embed.author_name || "";
      if (!plan.vendorAllow.test(author)) {
        videoNotes.push(`${video.videoId} skip author="${author}"`);
        continue;
      }
      acceptedVideos.push({
        meta: { ...video, title: embed.title || video.title },
        authorName: author,
      });
      videoNotes.push(`${video.videoId} ok author="${author}"`);
    } catch (err) {
      videoNotes.push(`${video.videoId} skip ${err.message}`);
    }
  }

  let merge = { shotsAdded: 0, mediaAdded: 0 };
  if (shots.length || acceptedVideos.length) {
    merge = mergeEnrichment(slug, shots, acceptedVideos);
  }

  return {
    slug,
    ogNote,
    listedShotNotes,
    videoNotes,
    shots: shots.length,
    ...merge,
  };
}

async function main() {
  const argSlug = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const slugs = argSlug ? [argSlug] : Object.keys(PRODUCTS);
  for (const slug of slugs) {
    if (!PRODUCTS[slug]) {
      console.error(`Unknown slug ${slug}`);
      continue;
    }
    const enrichmentPath = path.join(
      ROOT,
      "src/data/research",
      slug,
      "enrichment.json",
    );
    if (!fs.existsSync(enrichmentPath)) {
      console.log(`skip ${slug} (no enrichment)`);
      continue;
    }
    try {
      const r = await processProduct(slug);
      console.log(
        `${slug}: shots+${r.shotsAdded} media+${r.mediaAdded} | ${r.ogNote} | ${r.listedShotNotes.join("; ") || "no listed shots"} | ${r.videoNotes.join("; ") || "no videos"}`,
      );
    } catch (err) {
      console.error(`${slug}: FAIL ${err.message}`);
    }
  }
}

main();
