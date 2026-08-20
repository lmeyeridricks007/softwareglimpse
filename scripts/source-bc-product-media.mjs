#!/usr/bin/env node
/**
 * Source REAL vendor-ui product screenshots + official YouTube videos for
 * Business Communications products (and Buffer) that currently lack gallery media.
 *
 * Idempotent: skips existing files / screenshot ids / media ids.
 *
 * Usage:
 *   node scripts/source-bc-product-media.mjs
 *   node scripts/source-bc-product-media.mjs --slug=aircall
 *
 * Sources are documented inline per product (official marketing CDNs / vendor sites /
 * official YouTube channels verified via oembed author_name).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CHECKED_AT = "2026-08-17T17:00:00.000Z";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SoftwareGlimpseMediaBot/1.0";

const DEFAULT_LIMITATIONS = [
  "pricing",
  "comparative superiority",
  "security or compliance certification",
  "implementation effort or total cost of ownership",
];

/** @typedef {{ file: string, url: string, alt: string, caption: string, source: string, annotation?: string }} Shot */
/** @typedef {{ videoId: string, title: string, channelName: string, sourceOrganization: string, type?: string, description: string, officialSourceKind?: string }} Video */

/**
 * Curated per-product media plan.
 * Screenshots: official vendor marketing UI frames (preferred) or official YouTube
 * thumbnails that clearly show product UI (annotated).
 * Videos: official vendor / vendor-training YouTube channels only.
 */
const PRODUCTS = {
  aircall: {
    name: "Aircall",
    homepage: "https://aircall.io/",
    shots: [
      {
        file: "homepage.png",
        url: "https://a.storyblok.com/f/157376/1031x473/1930905cd1/hero-ws.png",
        alt: "Aircall Workspace product interface",
        caption: "Aircall Workspace hero UI from the official Aircall homepage.",
        source: "https://aircall.io/",
      },
      {
        file: "resolved.png",
        url: "https://a.storyblok.com/f/157376/1173x563/9721ad688e/hero-01-resolved.png",
        alt: "Aircall resolved conversation workspace",
        caption: "Resolved conversation view marketed on aircall.io.",
        source: "https://aircall.io/",
      },
      {
        file: "transcript.png",
        url: "https://a.storyblok.com/f/157376/1200x563/5d0d485e82/hero-02-transcript.png",
        alt: "Aircall call transcript UI",
        caption: "Call transcript product frame from the official Aircall homepage.",
        source: "https://aircall.io/",
      },
      {
        file: "liveprompts.png",
        url: "https://a.storyblok.com/f/157376/1200x578/c77a9a7c47/hero-03-liveprompts.png",
        alt: "Aircall live prompts UI",
        caption: "Live prompts product frame from the official Aircall homepage.",
        source: "https://aircall.io/",
      },
      {
        file: "automate.png",
        url: "https://a.storyblok.com/f/157376/1200x563/de193af327/hero-04-automate.png",
        alt: "Aircall automation UI",
        caption: "Automation product frame from the official Aircall homepage.",
        source: "https://aircall.io/",
      },
    ],
    videos: [
      {
        videoId: "bX6vO7Vdmuk",
        title: "Aircall Workspace",
        channelName: "Aircall",
        sourceOrganization: "Aircall",
        description:
          "Official Aircall Workspace overview from the Aircall YouTube channel.",
      },
      {
        videoId: "AEdR2o9WrYs",
        title: "Aircall AI Assist: 5 new features to automate Sales workflows",
        channelName: "Aircall",
        sourceOrganization: "Aircall",
        type: "official-tutorial",
        description:
          "Official Aircall walkthrough of AI Assist updates in the product workspace.",
      },
    ],
  },
  callhippo: {
    name: "CallHippo",
    homepage: "https://callhippo.com/",
    shots: [
      {
        file: "inbox.png",
        url: "https://webcdn.callhippo.com/images/chsiteimages/chat_inbox_scr.webp",
        alt: "CallHippo chat inbox UI",
        caption: "Omnichannel chat inbox screenshot from callhippo.com.",
        source: "https://callhippo.com/",
      },
      {
        file: "copilot.png",
        url: "https://webcdn.callhippo.com/images/chsiteimages/ai_copilot_prd.webp",
        alt: "CallHippo AI Copilot product UI",
        caption: "AI Copilot product frame from the official CallHippo site.",
        source: "https://callhippo.com/",
      },
      {
        file: "summaries.png",
        url: "https://webcdn.callhippo.com/images/chsiteimages/call_summaries_screen.webp",
        alt: "CallHippo call summaries screen",
        caption: "Call summaries screen from the official CallHippo homepage.",
        source: "https://callhippo.com/",
      },
      {
        file: "voice-agent.png",
        url: "https://webcdn.callhippo.com/images/chsiteimages/AI_Voice_Agent_demo.webp",
        alt: "CallHippo AI Voice Agent demo UI",
        caption: "AI Voice Agent demo frame from callhippo.com.",
        source: "https://callhippo.com/",
      },
    ],
    videos: [
      {
        videoId: "YOKiI1JyFf8",
        title: "CallHippo Tutorial: How to Use Power Dialer for Automatic Outgoing Calls",
        channelName: "CallHippo",
        sourceOrganization: "CallHippo",
        type: "official-tutorial",
        description: "Official CallHippo Power Dialer tutorial from the CallHippo channel.",
      },
      {
        videoId: "FiG21JlXbQg",
        title: "Smart Switch: Optimize call connectivity for better conversation",
        channelName: "CallHippo",
        sourceOrganization: "CallHippo",
        description: "Official CallHippo Smart Switch feature video.",
      },
    ],
  },
  krispcall: {
    name: "KrispCall",
    homepage: "https://krispcall.com/",
    shots: [
      {
        file: "dialer.png",
        url: "https://krispcall-website.sgp1.cdn.digitaloceanspaces.com/20260421_130615/Power-Dialer.webp",
        alt: "KrispCall Power Dialer UI",
        caption: "Power Dialer product frame from the official KrispCall site.",
        source: "https://krispcall.com/",
      },
      {
        file: "analytics.png",
        url: "https://krispcall-website.sgp1.cdn.digitaloceanspaces.com/20260421_130615/Call-Analytics.webp",
        alt: "KrispCall call analytics UI",
        caption: "Call analytics product frame from krispcall.com.",
        source: "https://krispcall.com/",
      },
      {
        file: "callbox.png",
        url: "https://krispcall-website.sgp1.cdn.digitaloceanspaces.com/20260428_123538/Unified-Callbox-img.webp",
        alt: "KrispCall unified callbox UI",
        caption: "Unified Callbox product frame from the official KrispCall site.",
        source: "https://krispcall.com/",
      },
      {
        file: "summary.png",
        url: "https://krispcall-website.sgp1.cdn.digitaloceanspaces.com/20260421_130615/Call-Summary.webp",
        alt: "KrispCall call summary UI",
        caption: "Call summary product frame from krispcall.com.",
        source: "https://krispcall.com/",
      },
    ],
    videos: [
      {
        videoId: "ZLEbIdw7B0I",
        title: "What is KrispCall?",
        channelName: "KrispCall",
        sourceOrganization: "KrispCall",
        description: "Official KrispCall product overview from the KrispCall channel.",
      },
      {
        videoId: "8IQ-Y0GKw0E",
        title: "KrispCall Demo | Get Started in Minutes",
        channelName: "KrispCall",
        sourceOrganization: "KrispCall",
        type: "official-tutorial",
        description: "Official KrispCall getting-started demo.",
      },
    ],
  },
  freshcaller: {
    name: "Freshcaller",
    homepage: "https://www.freshworks.com/freshcaller-cloud-pbx/",
    shots: [
      {
        file: "homepage.png",
        url: "https://dam.freshworks.com/asset/79abc978-f9c2-4a67-b206-04db979a4c11/Voice-channel-_HERO-IMAGE.webp",
        alt: "Freshcaller voice channel product hero",
        caption: "Voice channel hero UI from the official Freshcaller product page.",
        source: "https://www.freshworks.com/freshcaller-cloud-pbx/",
      },
      {
        file: "platform.png",
        url: "https://dam.freshworks.com/m/28fbd70ae8f2e49e/webimage-Platform_2_hi-res.jpg",
        alt: "Freshworks platform product visual used for Freshcaller context",
        caption: "Platform product visual from Freshworks DAM linked on Freshcaller pages.",
        source: "https://www.freshworks.com/freshcaller-cloud-pbx/",
      },
      {
        file: "agent-demo.png",
        url: "https://i.ytimg.com/vi/V2aJjgeuKrQ/maxresdefault.jpg",
        alt: "Freshcaller agent getting-started demo UI frame",
        caption:
          "Official Freshdesk Contact Center YouTube thumbnail showing Freshcaller agent UI.",
        source: "https://www.youtube.com/watch?v=V2aJjgeuKrQ",
        annotation:
          "Official vendor YouTube thumbnail (Freshdesk Contact Center) showing Freshcaller agent UI",
      },
      {
        file: "admin-demo.png",
        url: "https://i.ytimg.com/vi/oYIQ3hhfxWc/maxresdefault.jpg",
        alt: "Freshdesk Contact Center admin setup UI frame",
        caption:
          "Official Freshdesk Contact Center YouTube thumbnail showing admin setup UI.",
        source: "https://www.youtube.com/watch?v=oYIQ3hhfxWc",
        annotation:
          "Official vendor YouTube thumbnail showing Freshdesk Contact Center / Freshcaller admin UI",
      },
    ],
    videos: [
      {
        videoId: "V2aJjgeuKrQ",
        title: "Getting started with Freshcaller | For agents",
        channelName: "Freshdesk Contact Center",
        sourceOrganization: "Freshworks",
        type: "official-tutorial",
        description:
          "Official Freshdesk Contact Center tutorial for Freshcaller agents.",
      },
      {
        videoId: "oYIQ3hhfxWc",
        title: "Getting started with Freshdesk Contact Center | For admins",
        channelName: "Freshdesk Contact Center",
        sourceOrganization: "Freshworks",
        type: "official-tutorial",
        description:
          "Official Freshdesk Contact Center (Freshcaller lineage) admin getting-started guide.",
      },
    ],
  },
  wati: {
    name: "Wati",
    homepage: "https://www.wati.io/",
    shots: [
      {
        file: "inbox.png",
        url: "https://www.wati.io/wp-content/uploads/2025/08/wati-2025-powerful-inbox.webp",
        alt: "Wati team inbox UI",
        caption: "Powerful inbox product frame from the official Wati homepage.",
        source: "https://www.wati.io/",
      },
      {
        file: "marketing.png",
        url: "https://www.wati.io/wp-content/uploads/2025/08/wati-for-marketing-img1.webp",
        alt: "Wati marketing conversation UI",
        caption: "Wati for Marketing product frame from wati.io.",
        source: "https://www.wati.io/",
      },
      {
        file: "performance.png",
        url: "https://www.wati.io/wp-content/uploads/2025/08/performance-10x-image1.webp",
        alt: "Wati performance analytics UI",
        caption: "Performance product frame from the official Wati site.",
        source: "https://www.wati.io/",
      },
      {
        file: "team-inbox-video.png",
        url: "https://i.ytimg.com/vi/YNlMTvnPib8/maxresdefault.jpg",
        alt: "Wati Team Inbox guide UI frame",
        caption: "Official Wati YouTube thumbnail from the Team Inbox guide.",
        source: "https://www.youtube.com/watch?v=YNlMTvnPib8",
        annotation: "Official Wati YouTube thumbnail showing Team Inbox product UI",
      },
    ],
    videos: [
      {
        videoId: "6oH27cKKXJY",
        title:
          "What is Wati | How to use WhatsApp for Business Communication and Customer Engagement",
        channelName: "Wati",
        sourceOrganization: "Wati",
        description: "Official Wati product overview from the Wati YouTube channel.",
      },
      {
        videoId: "YNlMTvnPib8",
        title: "Guide to Wati Team Inbox",
        channelName: "Wati",
        sourceOrganization: "Wati",
        type: "official-tutorial",
        description: "Official Wati Team Inbox walkthrough.",
      },
    ],
  },
  zenzap: {
    name: "Zenzap",
    homepage: "https://www.zenzap.co/",
    shots: [
      {
        file: "homepage.png",
        url: "https://cdn.prod.website-files.com/6559c53afcb17d5a5995bfc0/6a68552f037bfcaef461d5eb_web-hero-animation-v4-v5_poster.0000000.jpg",
        alt: "Zenzap work chat hero product UI",
        caption: "Hero product animation still from the official Zenzap homepage.",
        source: "https://www.zenzap.co/",
      },
      {
        file: "controls.png",
        url: "https://cdn.prod.website-files.com/6559c53afcb17d5a5995bfc0/69fb58bb4774403cd62d0dcc_web-animation-control-data-1_poster.0000000.jpg",
        alt: "Zenzap control and data product UI",
        caption: "Product control/data UI frame from zenzap.co.",
        source: "https://www.zenzap.co/",
      },
      {
        file: "demo.png",
        url: "https://i.ytimg.com/vi/Mbrah0Xe5gU/maxresdefault.jpg",
        alt: "Zenzap team communication app demo UI",
        caption: "Official Zenzap YouTube thumbnail from the team communication demo.",
        source: "https://www.youtube.com/watch?v=Mbrah0Xe5gU",
        annotation: "Official Zenzap YouTube thumbnail showing product UI",
      },
      {
        file: "quickstart.png",
        url: "https://i.ytimg.com/vi/2ThZmgkLSgM/maxresdefault.jpg",
        alt: "Zenzap quick start guide UI",
        caption: "Official Zenzap YouTube thumbnail from the quick start guide.",
        source: "https://www.youtube.com/watch?v=2ThZmgkLSgM",
        annotation: "Official Zenzap YouTube thumbnail showing product UI",
      },
    ],
    videos: [
      {
        videoId: "Giz_sPihCC4",
        title: "Meet Zenzap - the work chat app built for how real teams work",
        channelName: "Zenzap",
        sourceOrganization: "Zenzap",
        description: "Official Zenzap product introduction.",
      },
      {
        videoId: "Mbrah0Xe5gU",
        title: "Zenzap Team Communication App Demo",
        channelName: "Zenzap",
        sourceOrganization: "Zenzap",
        type: "official-tutorial",
        description: "Official Zenzap team communication demo.",
      },
    ],
  },
  fastmail: {
    name: "Fastmail",
    homepage: "https://www.fastmail.com/",
    shots: [
      {
        file: "mail.png",
        url: "https://www.fastmail.com/assets/images/Mail-Ds-781UgM5-1928.png",
        alt: "Fastmail mail client UI",
        caption: "Mail client UI from the official Fastmail homepage.",
        source: "https://www.fastmail.com/",
      },
      {
        file: "calendar.png",
        url: "https://www.fastmail.com/assets/images/Calendar-C9v1vRGc3R-1928.png",
        alt: "Fastmail calendar UI",
        caption: "Calendar UI from the official Fastmail homepage.",
        source: "https://www.fastmail.com/",
      },
      {
        file: "ui.png",
        url: "https://www.fastmail.com/assets/images/user-friendly-ui-2kc_fizWeW-1550.png",
        alt: "Fastmail user-friendly UI overview",
        caption: "User-friendly UI product frame from fastmail.com.",
        source: "https://www.fastmail.com/",
      },
      {
        file: "contacts.png",
        url: "https://www.fastmail.com/assets/images/Contacts-LJ0_gpo5kC-1928.png",
        alt: "Fastmail contacts UI",
        caption: "Contacts UI from the official Fastmail homepage.",
        source: "https://www.fastmail.com/",
      },
    ],
    videos: [
      {
        videoId: "rSpEZVh83VY",
        title: "Fastmail Masked Email: Protect Your Privacy | Introduction",
        channelName: "Fastmail",
        sourceOrganization: "Fastmail",
        description: "Official Fastmail Masked Email introduction from the Fastmail channel.",
      },
    ],
  },
  sanebox: {
    name: "SaneBox",
    homepage: "https://www.sanebox.com/",
    shots: [
      {
        file: "digest.png",
        url: "https://assets.sanebox.com/assets/welcome/sellit/image-digest-79c3bd7f5190ccb01dd79cbca48fa6400b82c7767122c46d24063bf6df34962d.jpg",
        alt: "SaneBox digest email organization UI",
        caption: "SaneBox digest product visual from sanebox.com.",
        source: "https://www.sanebox.com/",
      },
      {
        file: "snooze.png",
        url: "https://assets.sanebox.com/assets/welcome/sellit/image-snooze-682b1fc888c949aa6af9a045bacab933ed688f1e408d690c5bc9f3e4a157a7ef.jpg",
        alt: "SaneBox snooze feature UI",
        caption: "SaneBox snooze product visual from the official site.",
        source: "https://www.sanebox.com/",
      },
      {
        file: "blackhole.png",
        url: "https://assets.sanebox.com/assets/welcome/sellit/image-sbh-b9f5a1a98ee22d418f2b0733d2ba64d7aade350129fe8b44ae1a68d9f3ccf79c.jpg",
        alt: "SaneBox Black Hole folder UI",
        caption: "SaneBox Black Hole product visual from sanebox.com.",
        source: "https://www.sanebox.com/",
      },
      {
        file: "preview.png",
        url: "https://assets.sanebox.com/assets/sanebox-preview-a018f6ff814a731a6f0c6aa7a56550e43f03775c4ae42c7f485fd8afbf043c50.jpg",
        alt: "SaneBox product preview",
        caption: "SaneBox product preview asset from the official site.",
        source: "https://www.sanebox.com/",
      },
    ],
    videos: [
      {
        videoId: "eWR4kJlhZzE",
        title: "How to Organize Your Email Inbox & Save 2+ Hours Every Week (SaneBox)",
        channelName: "SaneBox",
        sourceOrganization: "SaneBox",
        description: "Official SaneBox product overview from the SaneBox YouTube channel.",
      },
    ],
  },
  ringcentral: {
    name: "RingCentral",
    homepage: "https://www.ringcentral.com/",
    shots: [
      {
        file: "composer.png",
        url: "https://www.ringcentral.com/content/dam/rc-www/en_us/images/content/lp/ringex/october-2024/composer-png-rendition.webp",
        alt: "RingCentral RingEX composer UI",
        caption: "RingEX composer UI from the official RingCentral RingEX page.",
        source: "https://www.ringcentral.com/office.html",
      },
      {
        file: "phone.png",
        url: "https://www.ringcentral.com/content/dam/rc-www/en_us/images/content/solutions/small-business/2024/tabs/phone-jpg-rendition.webp",
        alt: "RingCentral phone product UI",
        caption: "Phone tab product frame from RingCentral marketing pages.",
        source: "https://www.ringcentral.com/office.html",
      },
      {
        file: "ai-powered.png",
        url: "https://www.ringcentral.com/content/dam/rc-www/en_us/images/content/lp/ringex/october-2024/image-AI-powered-jpg-rendition.webp",
        alt: "RingCentral AI-powered communications UI",
        caption: "AI-powered product frame from the RingEX marketing page.",
        source: "https://www.ringcentral.com/office.html",
      },
      {
        file: "ringex-overview.png",
        url: "https://i.ytimg.com/vi/RqVKtZzc4Lk/maxresdefault.jpg",
        alt: "RingEX modern business phone system UI frame",
        caption: "Official RingCentral YouTube thumbnail for RingEX overview.",
        source: "https://www.youtube.com/watch?v=RqVKtZzc4Lk",
        annotation: "Official RingCentral YouTube thumbnail showing RingEX product UI",
      },
    ],
    videos: [
      {
        videoId: "RqVKtZzc4Lk",
        title: "RingEX | The modern business phone system, reimagined with AI",
        channelName: "RingCentral",
        sourceOrganization: "RingCentral",
        description: "Official RingCentral RingEX product overview.",
      },
      {
        videoId: "UGhi5KZK3NM",
        title: "RingEX | RingCentral for Microsoft Teams",
        channelName: "RingCentral",
        sourceOrganization: "RingCentral",
        description: "Official RingCentral RingEX for Microsoft Teams overview.",
      },
    ],
  },
  dialpad: {
    name: "Dialpad",
    homepage: "https://www.dialpad.com/",
    shots: [
      {
        file: "connect.png",
        url: "https://images.ctfassets.net/r6vlh4dr9f5y/7FYynr0RMxwTuHBpUjTnp4/b31a2a56545e8c0a838894374be0359d/Dialpad_Connect.png",
        alt: "Dialpad Connect product UI",
        caption: "Dialpad Connect product frame from dialpad.com.",
        source: "https://www.dialpad.com/",
      },
      {
        file: "detail.png",
        url: "https://images.ctfassets.net/r6vlh4dr9f5y/1KzvjLnsPkpnLWjZlBKXuc/069d59653a868461104b3b3503013c2c/Detail_Level.png",
        alt: "Dialpad detailed conversation UI",
        caption: "Detail-level conversation UI from the official Dialpad homepage.",
        source: "https://www.dialpad.com/",
      },
      {
        file: "support.png",
        url: "https://images.ctfassets.net/r6vlh4dr9f5y/5qOt8W6hA2ystUwbRHHNxU/270aef25fe1d733e9ae532bd6db0525c/Dialpad_Support.png",
        alt: "Dialpad Support product UI",
        caption: "Dialpad Support product frame from dialpad.com/ai.",
        source: "https://www.dialpad.com/ai/",
      },
      {
        file: "sell.png",
        url: "https://images.ctfassets.net/r6vlh4dr9f5y/3AabF7x8HRJMMfvWpDHCcU/555655d5c419e7e4433a8c8661fe371f/Dialpad_Sell.png",
        alt: "Dialpad Sell product UI",
        caption: "Dialpad Sell product frame from dialpad.com/ai.",
        source: "https://www.dialpad.com/ai/",
      },
    ],
    videos: [
      {
        videoId: "MXQN6BosxE0",
        title: "Demo: Dialpad Connect",
        channelName: "Dialpad",
        sourceOrganization: "Dialpad",
        description: "Official Dialpad Connect product demo.",
      },
      {
        videoId: "McAVGIFG3_M",
        title: "Dialpad 101 | Tour the App",
        channelName: "Dialpad",
        sourceOrganization: "Dialpad",
        type: "official-tutorial",
        description: "Official Dialpad app tour from the Dialpad channel.",
      },
    ],
  },
  zoom: {
    name: "Zoom",
    homepage: "https://www.zoom.com/",
    shots: [
      {
        file: "phone.png",
        url: "https://st1.zoom.us/homepage/20260814-1234/primary/dist/assets/zoommedia/phone.jpg",
        alt: "Zoom Phone product visual",
        caption: "Zoom Phone product frame from the official Zoom homepage.",
        source: "https://www.zoom.com/",
      },
      {
        file: "ai-suite.png",
        url: "https://st1.zoom.us/homepage/20260814-1234/primary/dist/assets/zoommedia/AI-suite.webp",
        alt: "Zoom AI Companion suite UI",
        caption: "AI suite product frame from zoom.com.",
        source: "https://www.zoom.com/",
      },
      {
        file: "collaboration.png",
        url: "https://st1.zoom.us/homepage/20260814-1234/primary/dist/assets/zoommedia/collaboration.webp",
        alt: "Zoom collaboration product UI",
        caption: "Collaboration product frame from the official Zoom homepage.",
        source: "https://www.zoom.com/",
      },
      {
        file: "customer-support.png",
        url: "https://st1.zoom.us/homepage/20260814-1234/primary/dist/assets/zoommedia/customer-support.jpg",
        alt: "Zoom customer support product UI",
        caption: "Customer support product frame from zoom.com.",
        source: "https://www.zoom.com/",
      },
      {
        file: "zoom-phone-overview.png",
        url: "https://i.ytimg.com/vi/xZfCxpVwT6A/maxresdefault.jpg",
        alt: "Zoom Phone overview UI frame",
        caption: "Official Zoom YouTube thumbnail for What is Zoom Phone?",
        source: "https://www.youtube.com/watch?v=xZfCxpVwT6A",
        annotation: "Official Zoom YouTube thumbnail showing Zoom Phone product UI",
      },
    ],
    videos: [
      {
        videoId: "xZfCxpVwT6A",
        title: "What Is Zoom Phone? Cloud VoIP Phone System for Business",
        channelName: "Zoom",
        sourceOrganization: "Zoom",
        description: "Official Zoom Phone overview from the Zoom YouTube channel.",
      },
      {
        videoId: "P1f4dvDMk6g",
        title: "Zoom Meetings Innovations for Modern Collaboration",
        channelName: "Zoom",
        sourceOrganization: "Zoom",
        description: "Official Zoom Meetings innovations overview from the Zoom channel.",
      },
    ],
  },
  nextiva: {
    name: "Nextiva",
    homepage: "https://www.nextiva.com/",
    shots: [
      {
        file: "voip-setup.png",
        url: "https://i.ytimg.com/vi/PjZx6faUq90/maxresdefault.jpg",
        alt: "Nextiva business VoIP setup UI",
        caption: "Official Nextiva YouTube thumbnail showing VoIP setup UI.",
        source: "https://www.youtube.com/watch?v=PjZx6faUq90",
        annotation: "Official Nextiva YouTube thumbnail showing product UI",
      },
      {
        file: "voip-advantages.png",
        url: "https://i.ytimg.com/vi/TI6WFk7qdKs/maxresdefault.jpg",
        alt: "Nextiva VoIP product overview UI",
        caption: "Official Nextiva YouTube thumbnail from VoIP advantages video.",
        source: "https://www.youtube.com/watch?v=TI6WFk7qdKs",
        annotation: "Official Nextiva YouTube thumbnail showing product UI",
      },
      {
        file: "xbert.png",
        url: "https://i.ytimg.com/vi/D0_mBZ-qMyY/maxresdefault.jpg",
        alt: "Nextiva XBert AI receptionist UI",
        caption: "Official Nextiva YouTube thumbnail for XBert first-day checklist.",
        source: "https://www.youtube.com/watch?v=D0_mBZ-qMyY",
        annotation: "Official Nextiva YouTube thumbnail showing XBert product UI",
      },
      {
        file: "transcription.png",
        url: "https://i.ytimg.com/vi/WATbO3kIC-w/maxresdefault.jpg",
        alt: "Nextiva call transcription product UI",
        caption: "Official Nextiva YouTube thumbnail for call transcription workflow.",
        source: "https://www.youtube.com/watch?v=WATbO3kIC-w",
        annotation: "Official Nextiva YouTube thumbnail showing product UI",
      },
    ],
    videos: [
      {
        videoId: "PjZx6faUq90",
        title: "How To Setup A Business VoIP System (Fast & Easy)",
        channelName: "Nextiva",
        sourceOrganization: "Nextiva",
        type: "official-tutorial",
        description: "Official Nextiva VoIP setup walkthrough.",
      },
      {
        videoId: "TI6WFk7qdKs",
        title: "VoIP Advantages & Disadvantages (+ How to Get Started)",
        channelName: "Nextiva",
        sourceOrganization: "Nextiva",
        description: "Official Nextiva VoIP overview from the Nextiva channel.",
      },
    ],
  },
  "microsoft-teams": {
    name: "Microsoft Teams",
    homepage: "https://www.microsoft.com/en/microsoft-teams",
    shots: [
      {
        file: "new-era.png",
        url: "https://i.ytimg.com/vi/1BLiwgyLH0A/maxresdefault.jpg",
        alt: "Microsoft Teams new era product UI",
        caption: "Official Microsoft Teams YouTube thumbnail showing product UI.",
        source: "https://www.youtube.com/watch?v=1BLiwgyLH0A",
        annotation: "Official Microsoft Teams YouTube thumbnail showing product UI",
      },
      {
        file: "channels.png",
        url: "https://i.ytimg.com/vi/m3i18aunzQU/maxresdefault.jpg",
        alt: "Microsoft Teams channels UI",
        caption: "Official Microsoft Teams YouTube thumbnail for channels overview.",
        source: "https://www.youtube.com/watch?v=m3i18aunzQU",
        annotation: "Official Microsoft Teams YouTube thumbnail showing channels UI",
      },
      {
        file: "welcome.png",
        url: "https://i.ytimg.com/vi/jugBQqE_2sM/hqdefault.jpg",
        alt: "Welcome to Microsoft Teams UI",
        caption: "Official Microsoft 365 YouTube thumbnail for Welcome to Microsoft Teams.",
        source: "https://www.youtube.com/watch?v=jugBQqE_2sM",
        annotation: "Official Microsoft 365 YouTube thumbnail showing Teams product UI",
      },
      {
        file: "copilot-phone.png",
        url: "https://i.ytimg.com/vi/CBMg6Z4xfBI/hqdefault.jpg",
        alt: "Copilot in Teams Phone UI",
        caption: "Official Microsoft Teams YouTube thumbnail for Copilot in Teams Phone.",
        source: "https://www.youtube.com/watch?v=CBMg6Z4xfBI",
        annotation: "Official Microsoft Teams YouTube thumbnail showing Teams Phone UI",
      },
      {
        file: "facilitator.png",
        url: "https://i.ytimg.com/vi/khP2mbhJf1g/hqdefault.jpg",
        alt: "Microsoft Teams Facilitator meeting UI",
        caption: "Official Microsoft Teams YouTube thumbnail for Facilitator.",
        source: "https://www.youtube.com/watch?v=khP2mbhJf1g",
        annotation: "Official Microsoft Teams YouTube thumbnail showing product UI",
      },
    ],
    videos: [
      {
        videoId: "1BLiwgyLH0A",
        title: "Welcome to the New Era of Microsoft Teams",
        channelName: "Microsoft Teams",
        sourceOrganization: "Microsoft",
        description: "Official Microsoft Teams product introduction.",
      },
      {
        videoId: "m3i18aunzQU",
        title: "All about using channels in Microsoft Teams",
        channelName: "Microsoft Teams",
        sourceOrganization: "Microsoft",
        type: "official-tutorial",
        description: "Official Microsoft Teams channels walkthrough.",
      },
    ],
  },
  slack: {
    name: "Slack",
    homepage: "https://slack.com/",
    shots: [
      {
        file: "homepage.png",
        url: "https://a.slack-edge.com/5cb5052/marketing/img/homepage/revamped-25/hero/hp-hero@2x.jpg",
        alt: "Slack homepage hero product UI",
        caption: "Hero product UI from the official Slack homepage.",
        source: "https://slack.com/",
      },
      {
        file: "channels.png",
        url: "https://a.slack-edge.com/5cb5052/marketing/img/homepage/revamped-25/hero/hp-channels@2x.jpg",
        alt: "Slack channels product UI",
        caption: "Channels product frame from slack.com.",
        source: "https://slack.com/",
      },
      {
        file: "ai-summary.png",
        url: "https://a.slack-edge.com/d83eb17/marketing/img/homepage/revamped-25/dark-component/uis/summary-AI@2x.jpg",
        alt: "Slack AI summary UI",
        caption: "AI summary UI frame from the official Slack homepage.",
        source: "https://slack.com/",
      },
      {
        file: "platform.png",
        url: "https://a.slack-edge.com/5cb5052/marketing/img/homepage/revamped-25/carousels/img-platform-1@2x.png",
        alt: "Slack platform product UI",
        caption: "Platform carousel UI from slack.com.",
        source: "https://slack.com/",
      },
    ],
    videos: [
      {
        videoId: "EDATYbzYGiE",
        title: "What is Slack? | Your Work OS | Slack",
        channelName: "Slack",
        sourceOrganization: "Slack",
        description: "Official Slack Work OS product overview.",
      },
      {
        videoId: "FTuOS8E1LZk",
        title: "How to use Slack: Your quick start guide",
        channelName: "Slack",
        sourceOrganization: "Slack",
        type: "official-tutorial",
        description: "Official Slack quick start guide.",
      },
    ],
  },
  openphone: {
    name: "OpenPhone",
    homepage: "https://www.openphone.com/",
    shots: [
      {
        file: "screenshot-1.png",
        url: "https://cdn.prod.website-files.com/6899ec2c2b29c1edf8c20f15/69cea2955f801fa796c3d55e_Screenshot-1.png",
        alt: "OpenPhone (Quo) product screenshot 1",
        caption: "Product UI screenshot from the official OpenPhone / Quo homepage.",
        source: "https://www.openphone.com/",
      },
      {
        file: "screenshot-2.png",
        url: "https://cdn.prod.website-files.com/6899ec2c2b29c1edf8c20f15/69cea295c5cbfad4a42d2ce7_Screenshot-2.png",
        alt: "OpenPhone (Quo) product screenshot 2",
        caption: "Product UI screenshot from openphone.com.",
        source: "https://www.openphone.com/",
      },
      {
        file: "screenshot-3.png",
        url: "https://cdn.prod.website-files.com/6899ec2c2b29c1edf8c20f15/69cea298d9a1af243f3d5630_Screenshot-3.png",
        alt: "OpenPhone (Quo) product screenshot 3",
        caption: "Product UI screenshot from the official OpenPhone homepage.",
        source: "https://www.openphone.com/",
      },
      {
        file: "screenshot-4.png",
        url: "https://cdn.prod.website-files.com/6899ec2c2b29c1edf8c20f15/69cea295d0eea20e303c216b_Screenshot-4.png",
        alt: "OpenPhone (Quo) product screenshot 4",
        caption: "Product UI screenshot from openphone.com.",
        source: "https://www.openphone.com/",
      },
    ],
    videos: [
      {
        videoId: "6YTrzLdgIII",
        title: "Getting Started with Quo (Formerly OpenPhone)",
        channelName: "Grow with Quo",
        sourceOrganization: "OpenPhone / Quo",
        type: "official-tutorial",
        description:
          "Official Quo (formerly OpenPhone) getting-started guide from Grow with Quo.",
      },
      {
        videoId: "D4mZl-7mwyM",
        title: "How to make international calls and messages in Quo (formerly OpenPhone)",
        channelName: "Grow with Quo",
        sourceOrganization: "OpenPhone / Quo",
        type: "official-tutorial",
        description: "Official Quo international calling tutorial.",
      },
    ],
  },
  eightx8: {
    name: "8x8",
    homepage: "https://www.8x8.com/",
    shots: [
      {
        file: "innovation.png",
        url: "https://i.ytimg.com/vi/ygCBD5VqHNk/maxresdefault.jpg",
        alt: "8x8 Year of Product Innovation UI frame",
        caption: "Official 8x8 YouTube thumbnail from Year of Product Innovation 2025.",
        source: "https://www.youtube.com/watch?v=ygCBD5VqHNk",
        annotation: "Official 8x8 YouTube thumbnail showing product UI",
      },
      {
        file: "work-training.png",
        url: "https://i.ytimg.com/vi/PRMBw8OUhDo/maxresdefault.jpg",
        alt: "8x8 Work instructor-led training UI",
        caption: "Official 8x8 University YouTube thumbnail for 8x8 Work training.",
        source: "https://www.youtube.com/watch?v=PRMBw8OUhDo",
        annotation: "Official 8x8 University YouTube thumbnail showing 8x8 Work UI",
      },
      {
        file: "admin-training.png",
        url: "https://i.ytimg.com/vi/enMaZAiT7D8/maxresdefault.jpg",
        alt: "8x8 Work admin and config training UI",
        caption: "Official 8x8 University YouTube thumbnail for admin & config training.",
        source: "https://www.youtube.com/watch?v=enMaZAiT7D8",
        annotation: "Official 8x8 University YouTube thumbnail showing admin UI",
      },
      {
        file: "work-overview.png",
        url: "https://i.ytimg.com/vi/qQQX-TSSMHk/hqdefault.jpg",
        alt: "8x8 official channel product context frame",
        caption: "Official 8x8 channel thumbnail (hq) used as supplementary product media.",
        source: "https://www.youtube.com/watch?v=qQQX-TSSMHk",
        annotation: "Official 8x8 YouTube thumbnail from vendor channel",
      },
    ],
    videos: [
      {
        videoId: "ygCBD5VqHNk",
        title: "8x8 Year of Product Innovation 2025",
        channelName: "8x8",
        sourceOrganization: "8x8",
        description: "Official 8x8 product innovation overview.",
      },
      {
        videoId: "PRMBw8OUhDo",
        title: "8x8 Work: Instructor-Led Training Introduction",
        channelName: "8x8 University",
        sourceOrganization: "8x8",
        type: "official-tutorial",
        officialSourceKind: "vendor-training",
        description: "Official 8x8 University introduction to 8x8 Work.",
      },
    ],
  },
  "goto-connect": {
    name: "GoTo Connect",
    homepage: "https://www.goto.com/connect",
    shots: [
      {
        file: "ai-receptionist.png",
        url: "https://i.ytimg.com/vi/1tUmre4sxFc/maxresdefault.jpg",
        alt: "GoTo Connect AI Receptionist webinar UI",
        caption: "Official GoTo YouTube thumbnail for AI Receptionist webinar.",
        source: "https://www.youtube.com/watch?v=1tUmre4sxFc",
        annotation: "Official GoTo YouTube thumbnail showing GoTo Connect product UI",
      },
      {
        file: "ai-receptionist-hq.png",
        url: "https://i.ytimg.com/vi/1tUmre4sxFc/hqdefault.jpg",
        alt: "GoTo Connect AI Receptionist UI frame",
        caption: "Official GoTo YouTube hq thumbnail for AI Receptionist demo.",
        source: "https://www.youtube.com/watch?v=1tUmre4sxFc",
        annotation: "Official GoTo YouTube thumbnail showing GoTo Connect product UI",
      },
      {
        file: "story-ui.png",
        url: "https://edge.sitecorecloud.io/gototechnol00e8-mktglobalxm07e7-mktglobalpr9498-b870/media/project-global/grasshopper/url/home/ab-test-3-2026/story-text-image-1.png?h=716&iar=0&w=1252",
        alt: "GoTo phone-family product UI frame",
        caption:
          "Official GoTo Sitecore CDN product UI frame (shared GoTo phone marketing CDN; goto.com/connect was bot-blocked at capture time).",
        source: "https://www.goto.com/connect",
        annotation: "Official GoTo Sitecore CDN marketing UI frame",
      },
      {
        file: "story-ui-2.png",
        url: "https://edge.sitecorecloud.io/gototechnol00e8-mktglobalxm07e7-mktglobalpr9498-b870/media/project-global/grasshopper/url/home/ab-test-3-2026/story-text-image-2.png?h=716&iar=0&w=1252",
        alt: "GoTo phone-family product UI frame 2",
        caption: "Official GoTo Sitecore CDN product UI frame used for GoTo Connect gallery.",
        source: "https://www.goto.com/connect",
        annotation: "Official GoTo Sitecore CDN marketing UI frame",
      },
    ],
    videos: [
      {
        videoId: "1tUmre4sxFc",
        title:
          "On-Demand Webinar – Revolutionize Every Call with GoTo Connect’s AI Receptionist",
        channelName: "GoTo",
        sourceOrganization: "GoTo",
        type: "official-webinar",
        description: "Official GoTo Connect AI Receptionist webinar from the GoTo channel.",
      },
      {
        videoId: "uDQlWGEPTro",
        title: "GoTo Connect: Deliver Seamless Customer Experiences",
        channelName: "GoTo",
        sourceOrganization: "GoTo",
        description: "Official GoTo Connect customer experience overview.",
      },
    ],
  },
  grasshopper: {
    name: "Grasshopper",
    homepage: "https://grasshopper.com/",
    shots: [
      {
        file: "story-1.png",
        url: "https://edge.sitecorecloud.io/gototechnol00e8-mktglobalxm07e7-mktglobalpr9498-b870/media/project-global/grasshopper/url/home/ab-test-3-2026/story-text-image-1.png?h=716&iar=0&w=1252",
        alt: "Grasshopper product story UI frame 1",
        caption: "Product story UI frame from the official Grasshopper homepage.",
        source: "https://grasshopper.com/",
      },
      {
        file: "story-2.png",
        url: "https://edge.sitecorecloud.io/gototechnol00e8-mktglobalxm07e7-mktglobalpr9498-b870/media/project-global/grasshopper/url/home/ab-test-3-2026/story-text-image-2.png?h=716&iar=0&w=1252",
        alt: "Grasshopper product story UI frame 2",
        caption: "Product story UI frame from grasshopper.com.",
        source: "https://grasshopper.com/",
      },
      {
        file: "story-3.png",
        url: "https://edge.sitecorecloud.io/gototechnol00e8-mktglobalxm07e7-mktglobalpr9498-b870/media/project-global/grasshopper/url/home/ab-test-3-2026/story-text-image-3.png?h=1432&iar=0&w=2506",
        alt: "Grasshopper product story UI frame 3",
        caption: "Product story UI frame from the official Grasshopper homepage.",
        source: "https://grasshopper.com/",
      },
      {
        file: "hero.png",
        url: "https://edge.sitecorecloud.io/gototechnol00e8-mktglobalxm07e7-mktglobalpr9498-b870/media/project-global/grasshopper/dynamichero/hpbanner.png?h=1006&iar=0&w=2880",
        alt: "Grasshopper homepage hero product banner",
        caption: "Dynamic hero banner from grasshopper.com.",
        source: "https://grasshopper.com/",
      },
    ],
    videos: [
      {
        videoId: "1tUmre4sxFc",
        title:
          "On-Demand Webinar – Revolutionize Every Call with GoTo Connect’s AI Receptionist",
        channelName: "GoTo",
        sourceOrganization: "GoTo",
        type: "official-webinar",
        description:
          "Official GoTo channel webinar for the GoTo phone family (Grasshopper is a GoTo product).",
      },
    ],
  },
  "respond-io": {
    name: "respond.io",
    homepage: "https://respond.io/",
    shots: [
      {
        file: "platform.png",
        url: "https://i.ytimg.com/vi/685o-1cPqfY/maxresdefault.jpg",
        alt: "respond.io platform for business growth over chat UI",
        caption: "Official respond.io YouTube thumbnail showing platform UI.",
        source: "https://www.youtube.com/watch?v=685o-1cPqfY",
        annotation: "Official respond.io YouTube thumbnail showing product UI",
      },
      {
        file: "explained.png",
        url: "https://i.ytimg.com/vi/-5C9R07eToc/maxresdefault.jpg",
        alt: "respond.io AI agents and omnichannel inbox UI",
        caption:
          "Official respond.io YouTube thumbnail for AI Agents, Omnichannel Inbox & CRM.",
        source: "https://www.youtube.com/watch?v=-5C9R07eToc",
        annotation: "Official respond.io YouTube thumbnail showing product UI",
      },
      {
        file: "get-started.png",
        url: "https://i.ytimg.com/vi/KSR1y5taKpY/maxresdefault.jpg",
        alt: "respond.io get started product UI",
        caption: "Official respond.io YouTube thumbnail from Get Started guide.",
        source: "https://www.youtube.com/watch?v=KSR1y5taKpY",
        annotation: "Official respond.io YouTube thumbnail showing product UI",
      },
      {
        file: "ai-agents.png",
        url: "https://i.ytimg.com/vi/D5fbgAnNa2w/maxresdefault.jpg",
        alt: "respond.io AI agents booking enquiries UI",
        caption: "Official respond.io YouTube thumbnail for AI Agents booking workflow.",
        source: "https://www.youtube.com/watch?v=D5fbgAnNa2w",
        annotation: "Official respond.io YouTube thumbnail showing product UI",
      },
    ],
    videos: [
      {
        videoId: "685o-1cPqfY",
        title: "Respond.io | The Platform for Business Growth Over Chat",
        channelName: "Respond.io",
        sourceOrganization: "respond.io",
        description: "Official respond.io platform overview.",
      },
      {
        videoId: "-5C9R07eToc",
        title: "Respond.io Explained: AI Agents, Omnichannel Inbox & CRM (2026)",
        channelName: "Respond.io",
        sourceOrganization: "respond.io",
        type: "official-tutorial",
        description: "Official respond.io product explanation for 2026.",
      },
    ],
  },
  buffer: {
    name: "Buffer",
    homepage: "https://buffer.com/",
    shots: [
      {
        file: "composer.png",
        url: "https://buffer.com/img/homepage/publish-composer.webp",
        alt: "Buffer publish composer UI",
        caption: "Publish composer UI from the official Buffer homepage.",
        source: "https://buffer.com/",
      },
      {
        file: "calendar.png",
        url: "https://buffer.com/img/feature-pages/publish/publish-calendar-view.webp",
        alt: "Buffer publish calendar view UI",
        caption: "Publish calendar view from buffer.com/publish.",
        source: "https://buffer.com/publish",
      },
      {
        file: "insights.png",
        url: "https://buffer.com/img/homepage/insights.webp",
        alt: "Buffer insights analytics UI",
        caption: "Insights product frame from the official Buffer homepage.",
        source: "https://buffer.com/",
      },
      {
        file: "community.png",
        url: "https://buffer.com/img/homepage/community-comments.webp",
        alt: "Buffer community comments / engagement UI",
        caption: "Community comments product frame from buffer.com.",
        source: "https://buffer.com/",
      },
      {
        file: "publish-hero.png",
        url: "https://buffer.com/img/feature-pages/publish/publish-hero.webp",
        alt: "Buffer Publish feature hero UI",
        caption: "Publish feature hero UI from buffer.com/publish.",
        source: "https://buffer.com/publish",
      },
    ],
    videos: [
      {
        videoId: "S4fIZ0sBeoI",
        title: "Getting Started Demo and Q&A with Buffer, May 10th, 2023",
        channelName: "Buffer",
        sourceOrganization: "Buffer",
        type: "official-tutorial",
        description: "Official Buffer getting-started demo and Q&A.",
      },
      {
        videoId: "EcDgL0ap60M",
        title: "Create a Stunning Landing Page for Your Brand with Start Page by Buffer",
        channelName: "Buffer",
        sourceOrganization: "Buffer",
        description: "Official Buffer Start Page product video.",
      },
    ],
  },
  // --- Priority-3 gaps (2026-08-17): webex, vonage, ooma, talkdesk, genesys, five9 ---
  webex: {
    name: "Webex",
    homepage: "https://www.webex.com/",
    shots: [
      {
        file: "calling-ai.png",
        url: "https://i.ytimg.com/vi/kKJAwKxGxdk/maxresdefault.jpg",
        alt: "Webex Calling AI innovations product UI",
        caption:
          "Official Webex YouTube thumbnail for Webex Calling AI innovations (webex.com bot-blocked at capture).",
        source: "https://www.youtube.com/watch?v=kKJAwKxGxdk",
        annotation:
          "Official Webex YouTube thumbnail showing Webex Calling AI product UI",
      },
      {
        file: "ai-concierge.png",
        url: "https://i.ytimg.com/vi/VmAHTeRXLCc/maxresdefault.jpg",
        alt: "Webex AI Concierge product UI",
        caption: "Official Webex YouTube thumbnail introducing AI Concierge for CX.",
        source: "https://www.youtube.com/watch?v=VmAHTeRXLCc",
        annotation: "Official Webex YouTube thumbnail showing AI Concierge product UI",
      },
      {
        file: "suite-ai-agents.png",
        url: "https://i.ytimg.com/vi/XjV6_MeKiNI/maxresdefault.jpg",
        alt: "Webex Suite AI Productivity Agents UI",
        caption: "Official Webex YouTube thumbnail for Suite AI Productivity Agents.",
        source: "https://www.youtube.com/watch?v=XjV6_MeKiNI",
        annotation: "Official Webex YouTube thumbnail showing Suite AI product UI",
      },
      {
        file: "wfm-ai.png",
        url: "https://i.ytimg.com/vi/6jEraeeE9OQ/maxresdefault.jpg",
        alt: "Webex AI Workforce Engagement Management UI",
        caption: "Official Webex YouTube thumbnail for AI Workforce Engagement Management.",
        source: "https://www.youtube.com/watch?v=6jEraeeE9OQ",
        annotation: "Official Webex YouTube thumbnail showing WEM product UI",
      },
    ],
    videos: [
      {
        videoId: "kKJAwKxGxdk",
        title: "Transform Every Customer Interaction   |   Webex Calling AI innovations",
        channelName: "Webex",
        sourceOrganization: "Cisco Webex",
        description: "Official Webex Calling AI innovations overview from the Webex channel.",
      },
      {
        videoId: "VmAHTeRXLCc",
        title: "Webex AI in CX: Introducing AI Concierge",
        channelName: "Webex",
        sourceOrganization: "Cisco Webex",
        description: "Official Webex AI Concierge introduction from the Webex channel.",
      },
    ],
  },
  vonage: {
    name: "Vonage",
    homepage: "https://www.vonage.com/",
    shots: [
      {
        file: "vbc-teams.png",
        url: "https://i.ytimg.com/vi/AkBquWyO7ag/maxresdefault.jpg",
        alt: "Vonage Business Communications for Teams demo UI",
        caption:
          "Official Vonage YouTube thumbnail for VBC for Teams demo (vonage.com bot-blocked at capture).",
        source: "https://www.youtube.com/watch?v=AkBquWyO7ag",
        annotation:
          "Official Vonage YouTube thumbnail showing Business Communications product UI",
      },
      {
        file: "contact-center.png",
        url: "https://i.ytimg.com/vi/ytWPLDjH0Rc/maxresdefault.jpg",
        alt: "Vonage Contact Center overview UI",
        caption: "Official Vonage YouTube thumbnail for Contact Center overview.",
        source: "https://www.youtube.com/watch?v=ytWPLDjH0Rc",
        annotation: "Official Vonage YouTube thumbnail showing Contact Center product UI",
      },
      {
        file: "business-inbox.png",
        url: "https://i.ytimg.com/vi/rjllkMQ3VNU/maxresdefault.jpg",
        alt: "Vonage Business Inbox SMS and social UI",
        caption: "Official Vonage YouTube thumbnail for Business Inbox messaging.",
        source: "https://www.youtube.com/watch?v=rjllkMQ3VNU",
        annotation: "Official Vonage YouTube thumbnail showing Business Inbox product UI",
      },
      {
        file: "servicenow-voice.png",
        url: "https://i.ytimg.com/vi/e3-JsnyapiQ/maxresdefault.jpg",
        alt: "Vonage Premier for ServiceNow Voice UI",
        caption: "Official Vonage YouTube thumbnail for Premier for ServiceNow Voice.",
        source: "https://www.youtube.com/watch?v=e3-JsnyapiQ",
        annotation: "Official Vonage YouTube thumbnail showing ServiceNow Voice product UI",
      },
    ],
    videos: [
      {
        videoId: "AkBquWyO7ag",
        title: "Demo: Vonage Business Communications for Teams",
        channelName: "Vonage",
        sourceOrganization: "Vonage",
        description: "Official Vonage Business Communications for Teams demo.",
      },
      {
        videoId: "ytWPLDjH0Rc",
        title: "Vonage Contact Center overview",
        channelName: "Vonage",
        sourceOrganization: "Vonage",
        description: "Official Vonage Contact Center product overview.",
      },
    ],
  },
  ooma: {
    name: "Ooma",
    homepage: "https://www.ooma.com/",
    shots: [
      {
        file: "ai-receptionist.png",
        url: "https://i.ytimg.com/vi/6tXSExcRMcs/maxresdefault.jpg",
        alt: "Ooma AI answering service and receptionist UI",
        caption:
          "Official Ooma YouTube thumbnail for AI Answering Service/Receptionist (ooma.com bot-blocked at capture).",
        source: "https://www.youtube.com/watch?v=6tXSExcRMcs",
        annotation: "Official Ooma YouTube thumbnail showing AI receptionist product UI",
      },
      {
        file: "ai-insights.png",
        url: "https://i.ytimg.com/vi/2EidmfD3BFs/maxresdefault.jpg",
        alt: "Ooma AI Insights product UI",
        caption: "Official Ooma YouTube thumbnail for Ooma AI Insights explainer.",
        source: "https://www.youtube.com/watch?v=2EidmfD3BFs",
        annotation: "Official Ooma YouTube thumbnail showing AI Insights product UI",
      },
      {
        file: "clio-integration.png",
        url: "https://i.ytimg.com/vi/Ar59zMJZlN4/maxresdefault.jpg",
        alt: "Ooma Office Manager Clio integration UI",
        caption: "Official Ooma YouTube thumbnail from Office Clio integration tutorial.",
        source: "https://www.youtube.com/watch?v=Ar59zMJZlN4",
        annotation: "Official Ooma YouTube thumbnail showing Office Manager product UI",
      },
      {
        file: "mobile-desktop.png",
        url: "https://i.ytimg.com/vi/ZBKp09v_jT4/maxresdefault.jpg",
        alt: "Ooma Office mobile and desktop apps UI",
        caption: "Official Ooma YouTube thumbnail for Connect From Anywhere with Ooma Office.",
        source: "https://www.youtube.com/watch?v=ZBKp09v_jT4",
        annotation: "Official Ooma YouTube thumbnail showing Ooma Office app UI",
      },
    ],
    videos: [
      {
        videoId: "6tXSExcRMcs",
        title: "Ooma AI: Answering Service and Receptionist Explainer",
        channelName: "Ooma",
        sourceOrganization: "Ooma",
        description: "Official Ooma AI Answering Service and Receptionist explainer.",
      },
      {
        videoId: "2EidmfD3BFs",
        title: "Ooma AI: Insights Explainer",
        channelName: "Ooma",
        sourceOrganization: "Ooma",
        description: "Official Ooma AI Insights product explainer.",
      },
    ],
  },
  talkdesk: {
    name: "Talkdesk",
    homepage: "https://www.talkdesk.com/",
    shots: [
      {
        file: "copilot.png",
        url: "https://infra-cloudfront-talkdeskcom.svc.talkdeskapp.com/talkdesk_com/cxa-page-compositions-copilot-1740x1160.webp",
        alt: "Talkdesk CXA copilot product UI",
        caption: "CXA Copilot composition from the official Talkdesk CXA page.",
        source: "https://www.talkdesk.com/customer-experience-automation/",
      },
      {
        file: "analytics.png",
        url: "https://infra-cloudfront-talkdeskcom.svc.talkdeskapp.com/talkdesk_com/cxa-page-compositions-analyticsv2-1740x1160.webp",
        alt: "Talkdesk CXA analytics product UI",
        caption: "CXA analytics composition from talkdesk.com CXA marketing.",
        source: "https://www.talkdesk.com/customer-experience-automation/",
      },
      {
        file: "autopilot.png",
        url: "https://infra-cloudfront-talkdeskcom.svc.talkdeskapp.com/talkdesk_com/cxa-page-compositions-autopilot-1740x1160.webp",
        alt: "Talkdesk CXA autopilot product UI",
        caption: "CXA Autopilot composition from the official Talkdesk CXA page.",
        source: "https://www.talkdesk.com/customer-experience-automation/",
      },
      {
        file: "ai-agents.png",
        url: "https://infra-cloudfront-talkdeskcom.svc.talkdeskapp.com/talkdesk_com/ai-agents-cxa.webp",
        alt: "Talkdesk CXA AI agents product UI",
        caption: "AI agents product frame from the official Talkdesk CXA page.",
        source: "https://www.talkdesk.com/customer-experience-automation/",
      },
      {
        file: "orchestration.png",
        url: "https://infra-cloudfront-talkdeskcom.svc.talkdeskapp.com/talkdesk_com/multi-agent-orchestration-update-1740x1160.webp",
        alt: "Talkdesk multi-agent orchestration UI",
        caption: "Multi-agent orchestration frame from Talkdesk CXA marketing CDN.",
        source: "https://www.talkdesk.com/customer-experience-automation/",
      },
    ],
    videos: [
      {
        videoId: "1I7ddqbsUAU",
        title: "How Talkdesk CXA powers Talkdesk Commerce Orchestration (Demo)",
        channelName: "Talkdesk",
        sourceOrganization: "Talkdesk",
        description: "Official Talkdesk CXA Commerce Orchestration product demo.",
      },
      {
        videoId: "K6IIibUytjQ",
        title: "Talkdesk CXA Demo",
        channelName: "Talkdesk",
        sourceOrganization: "Talkdesk",
        description: "Official Talkdesk CXA platform demo from the Talkdesk channel.",
      },
    ],
  },
  genesys: {
    name: "Genesys",
    homepage: "https://www.genesys.com/",
    shots: [
      {
        file: "homepage-hero.png",
        url: "https://www.genesys.com/media/homepage-hero-image-16-x-9-hidef.png",
        alt: "Genesys Cloud homepage hero product UI",
        caption: "Homepage hero product frame from genesys.com.",
        source: "https://www.genesys.com/",
      },
      {
        file: "platform-overview.png",
        url: "https://www.genesys.com/media/genesys-cloud-cx-platform-overview-2025.webp",
        alt: "Genesys Cloud CX platform overview UI",
        caption: "Genesys Cloud CX platform overview from genesys.com/genesys-cloud.",
        source: "https://www.genesys.com/genesys-cloud",
      },
      {
        file: "agent-screenshot.png",
        url: "https://www.genesys.com/media/screenshot_agent_laptop_626x365.webp",
        alt: "Genesys Cloud agent desktop screenshot",
        caption: "Agent laptop product screenshot from official Genesys marketing media.",
        source: "https://www.genesys.com/",
      },
      {
        file: "threads-hero.png",
        url: "https://www.genesys.com/media/Genesys-Cloud-Hero-Video-Thumbnail-threads.webp",
        alt: "Genesys Cloud threads hero product UI",
        caption: "Genesys Cloud hero video thumbnail showing threads UI.",
        source: "https://www.genesys.com/genesys-cloud",
      },
      {
        file: "what-is-cloud.png",
        url: "https://i.ytimg.com/vi/18rNQO8A9Nw/maxresdefault.jpg",
        alt: "What is Genesys Cloud product overview UI",
        caption: "Official Genesys YouTube thumbnail for What is Genesys Cloud?",
        source: "https://www.youtube.com/watch?v=18rNQO8A9Nw",
        annotation: "Official Genesys YouTube thumbnail showing Genesys Cloud product UI",
      },
    ],
    videos: [
      {
        videoId: "18rNQO8A9Nw",
        title: "What is Genesys Cloud? | AI-Powered Experience Orchestration platform",
        channelName: "Genesys",
        sourceOrganization: "Genesys",
        description: "Official Genesys Cloud platform overview from the Genesys channel.",
      },
      {
        videoId: "uzrKgW3gSwA",
        title: "Meet Genesys Cloud Copilot: Your team’s new trusted teammate",
        channelName: "Genesys",
        sourceOrganization: "Genesys",
        description: "Official Genesys Cloud Copilot introduction from the Genesys channel.",
      },
    ],
  },
  five9: {
    name: "Five9",
    homepage: "https://www.five9.com/",
    shots: [
      {
        file: "genius-ai.png",
        url: "https://play.vidyard.com/v29FkSSQrRxgH4tQnb8hCQ.jpg",
        alt: "Five9 Genius AI official demo thumbnail",
        caption:
          "Official Five9 Vidyard thumbnail from the Meet Five9 Genius AI demo page.",
        source: "https://www.five9.com/resources/demo-video/five9-genius-aimeet-five9-genius-ai",
        annotation: "Official Five9 Vidyard marketing thumbnail showing Genius AI product UI",
      },
      {
        file: "homepage-video.png",
        url: "https://play.vidyard.com/xmGejrLRq2wQhh5cj5rArE.jpg",
        alt: "Five9 homepage product video frame",
        caption: "Official Five9 Vidyard frame from the five9.com homepage video.",
        source: "https://www.five9.com/",
        annotation: "Official Five9 Vidyard marketing frame from homepage",
      },
      {
        file: "call-summaries.png",
        url: "https://i.ytimg.com/vi/a9KbjbiD63E/maxresdefault.jpg",
        alt: "Five9 GenAI Studio call summaries UI",
        caption:
          "Official Five9 YouTube thumbnail from TAMTorial on GenAI Studio call summaries.",
        source: "https://www.youtube.com/watch?v=a9KbjbiD63E",
        annotation: "Official Five9 YouTube thumbnail showing GenAI Studio product UI",
      },
      {
        file: "interaction-access.png",
        url: "https://i.ytimg.com/vi/0UB-3b-Xvwg/maxresdefault.jpg",
        alt: "Five9 Interaction Access Events auditing UI",
        caption:
          "Official Five9 YouTube thumbnail from TAMTorial on Interaction Access Events.",
        source: "https://www.youtube.com/watch?v=0UB-3b-Xvwg",
        annotation: "Official Five9 YouTube thumbnail showing admin/insights product UI",
      },
    ],
    videos: [
      {
        videoId: "a9KbjbiD63E",
        title: "Five9 TAMTorial: Deliver Valuable Five9 Call Summaries using GenAI Studio",
        channelName: "Five9",
        sourceOrganization: "Five9",
        type: "official-tutorial",
        description: "Official Five9 GenAI Studio call summaries tutorial.",
      },
      {
        videoId: "0UB-3b-Xvwg",
        title: 'Five9 TAMTorial: "Auditing Insights with Five9 Interaction Access Events"',
        channelName: "Five9",
        sourceOrganization: "Five9",
        type: "official-tutorial",
        description: "Official Five9 Interaction Access Events auditing tutorial.",
      },
    ],
  },
};

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

function buildScreenshot(slug, shot) {
  const id = `${slug}-shot-${shot.file.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]/gi, "-")}`;
  return {
    id,
    src: `/vendor-ui/${slug}/${shot.file}`,
    alt: shot.alt,
    caption: shot.caption,
    source: shot.source,
    checkedAt: CHECKED_AT,
    annotation: shot.annotation || `Official ${PRODUCTS[slug].name} marketing UI asset`,
    kind: "vendor-ui",
    featureIds: [],
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
    featureIds: [],
    requirementIds: [],
    useCaseIds: [],
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
  for (const video of plan.videos) {
    const entry = buildMedia(slug, video);
    if (existingMediaIds.has(entry.id) || existingVideoIds.has(entry.videoId)) continue;
    data.media.push(entry);
    existingMediaIds.add(entry.id);
    existingVideoIds.add(entry.videoId);
    mediaAdded++;
  }

  data.updatedAt = CHECKED_AT;
  fs.writeFileSync(enrichmentPath, `${JSON.stringify(data, null, 2)}\n`);

  const vendorUi = data.screenshots.filter((s) => s.kind === "vendor-ui").length;
  const publishedMedia = data.media.filter(
    (m) => m.status === "active" || m.status === "published",
  ).length;
  return { shotsAdded, mediaAdded, vendorUi, publishedMedia, enrichmentPath };
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

  // Only keep screenshot entries whose files exist
  const okFiles = new Set(
    downloadResults.filter((r) => r.ok).map((r) => r.file),
  );
  const filteredPlanShots = plan.shots.filter((s) => okFiles.has(s.file));
  // Temporarily swap shots for merge if some failed
  const original = plan.shots;
  plan.shots = filteredPlanShots;
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
    const fails = result.downloadResults.filter((r) => !r.ok);
    for (const r of result.downloadResults) {
      const status = r.ok
        ? r.skipped
          ? `skip ${r.bytes}b`
          : `ok ${r.bytes}b`
        : `FAIL ${r.error}`;
      console.log(`  ${r.file}: ${status}`);
    }
    console.log(
      `  enrichment: +${result.shotsAdded} shots, +${result.mediaAdded} videos → vendor-ui=${result.vendorUi} media=${result.publishedMedia}`,
    );
    if (fails.length) {
      console.warn(`  ⚠ ${fails.length} download failure(s)`);
    }
    summary.push(result);
  }

  console.log("\n=== SUMMARY ===");
  for (const s of summary) {
    console.log(
      `${s.slug}\tvendor-ui=${s.vendorUi}\tvideos=${s.publishedMedia}\t(+${s.shotsAdded}/+${s.mediaAdded})`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
