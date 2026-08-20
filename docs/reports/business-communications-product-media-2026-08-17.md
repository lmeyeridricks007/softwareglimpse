# Business Communications Product Media — 2026-08-17

**Purpose:** Source real `vendor-ui` product screenshots and official YouTube videos for BC products (plus Buffer) that previously showed an empty Product screenshots gallery.

**Method:** Idempotent script `scripts/source-bc-product-media.mjs` downloads official marketing CDN / homepage UI frames (preferred) or official YouTube thumbnails that clearly show product UI, then merges into `src/data/research/{slug}/enrichment.json` without wiping existing `original-diagram` entries. Official YouTube channels registered in `src/services/asset-discovery/vendor-registry.ts`.

**Rules followed:** No invented UI; no SoftwareGlimpse teaching diagrams as vendor-ui; no affiliate URLs; videos use `status: published`, `officialSource: true`, `officialSourceKind: vendor-channel` (or `vendor-training` for 8x8 University).

## Summary table

| Product | vendor-ui shots | published videos | Sample path |
| --- | ---: | ---: | --- |
| `aircall` | 5 | 2 | `/software/aircall/homepage.png` |
| `callhippo` | 4 | 2 | `/software/callhippo/inbox.png` |
| `krispcall` | 4 | 2 | `/software/krispcall/dialer.png` |
| `freshcaller` | 4 | 2 | `/software/freshcaller/homepage.png` |
| `wati` | 4 | 2 | `/software/wati/inbox.png` |
| `zenzap` | 4 | 2 | `/software/zenzap/homepage.png` |
| `fastmail` | 4 | 1 | `/software/fastmail/mail.png` |
| `sanebox` | 4 | 1 | `/software/sanebox/digest.png` |
| `ringcentral` | 4 | 2 | `/software/ringcentral/composer.png` |
| `dialpad` | 4 | 2 | `/software/dialpad/connect.png` |
| `zoom` | 5 | 2 | `/software/zoom/phone.png` |
| `nextiva` | 4 | 2 | `/software/nextiva/voip-setup.png` |
| `microsoft-teams` | 5 | 2 | `/software/microsoft-teams/new-era.png` |
| `slack` | 4 | 2 | `/software/slack/homepage.png` |
| `openphone` | 4 | 2 | `/software/openphone/screenshot-1.png` |
| `eightx8` | 4 | 2 | `/software/eightx8/innovation.png` |
| `goto-connect` | 6 | 2 | `/software/goto-connect/ai-receptionist.png` |
| `grasshopper` | 4 | 1 | `/software/grasshopper/story-1.png` |
| `respond-io` | 4 | 2 | `/software/respond-io/platform.png` |
| `buffer` | 5 | 2 | `/software/buffer/composer.png` |
| `webex` | 4 | 2 | `/software/webex/calling-ai.png` |
| `vonage` | 4 | 2 | `/software/vonage/vbc-teams.png` |
| `ooma` | 4 | 2 | `/software/ooma/ai-receptionist.png` |
| `talkdesk` | 5 | 2 | `/software/talkdesk/copilot.png` |
| `genesys` | 5 | 2 | `/software/genesys/homepage-hero.png` |
| `five9` | 4 | 2 | `/software/five9/genius-ai.png` |

**Totals:** 112 vendor-ui screenshots, 50 published videos across 26 products (script coverage). All 25 BC-primary catalogue products meet ≥2 vendor-ui + ≥1 official YouTube (no remaining BC-primary gaps; skipped switcher-studio / pipedrive as non-BC-primary noise).

## Per-product detail

### `aircall` — 5 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/aircall/homepage.png` — source: https://aircall.io/
- `/software/aircall/resolved.png` — source: https://aircall.io/
- `/software/aircall/transcript.png` — source: https://aircall.io/
- `/software/aircall/liveprompts.png` — source: https://aircall.io/
- `/software/aircall/automate.png` — source: https://aircall.io/

**Videos:**
- [Aircall Workspace](https://www.youtube.com/watch?v=bX6vO7Vdmuk) — channel: Aircall (`bX6vO7Vdmuk`)
- [Aircall AI Assist: 5 new features to automate Sales workflows](https://www.youtube.com/watch?v=AEdR2o9WrYs) — channel: Aircall (`AEdR2o9WrYs`)

### `callhippo` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/callhippo/inbox.png` — source: https://callhippo.com/
- `/software/callhippo/copilot.png` — source: https://callhippo.com/
- `/software/callhippo/summaries.png` — source: https://callhippo.com/
- `/software/callhippo/voice-agent.png` — source: https://callhippo.com/

**Videos:**
- [CallHippo Tutorial: How to Use Power Dialer for Automatic Outgoing Calls](https://www.youtube.com/watch?v=YOKiI1JyFf8) — channel: CallHippo (`YOKiI1JyFf8`)
- [Smart Switch: Optimize call connectivity for better conversation](https://www.youtube.com/watch?v=FiG21JlXbQg) — channel: CallHippo (`FiG21JlXbQg`)

### `krispcall` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/krispcall/dialer.png` — source: https://krispcall.com/
- `/software/krispcall/analytics.png` — source: https://krispcall.com/
- `/software/krispcall/callbox.png` — source: https://krispcall.com/
- `/software/krispcall/summary.png` — source: https://krispcall.com/

**Videos:**
- [What is KrispCall?](https://www.youtube.com/watch?v=ZLEbIdw7B0I) — channel: KrispCall (`ZLEbIdw7B0I`)
- [KrispCall Demo | Get Started in Minutes](https://www.youtube.com/watch?v=8IQ-Y0GKw0E) — channel: KrispCall (`8IQ-Y0GKw0E`)

### `freshcaller` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/freshcaller/homepage.png` — source: https://www.freshworks.com/freshcaller-cloud-pbx/
- `/software/freshcaller/platform.png` — source: https://www.freshworks.com/freshcaller-cloud-pbx/
- `/software/freshcaller/agent-demo.png` — source: https://www.youtube.com/watch?v=V2aJjgeuKrQ
- `/software/freshcaller/admin-demo.png` — source: https://www.youtube.com/watch?v=oYIQ3hhfxWc

**Videos:**
- [Getting started with Freshcaller | For agents](https://www.youtube.com/watch?v=V2aJjgeuKrQ) — channel: Freshdesk Contact Center (`V2aJjgeuKrQ`)
- [Getting started with Freshdesk Contact Center | For admins](https://www.youtube.com/watch?v=oYIQ3hhfxWc) — channel: Freshdesk Contact Center (`oYIQ3hhfxWc`)

### `wati` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/wati/inbox.png` — source: https://www.wati.io/
- `/software/wati/marketing.png` — source: https://www.wati.io/
- `/software/wati/performance.png` — source: https://www.wati.io/
- `/software/wati/team-inbox-video.png` — source: https://www.youtube.com/watch?v=YNlMTvnPib8

**Videos:**
- [What is Wati | How to use WhatsApp for Business Communication and Customer Engagement](https://www.youtube.com/watch?v=6oH27cKKXJY) — channel: Wati (`6oH27cKKXJY`)
- [Guide to Wati Team Inbox](https://www.youtube.com/watch?v=YNlMTvnPib8) — channel: Wati (`YNlMTvnPib8`)

### `zenzap` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/zenzap/homepage.png` — source: https://www.zenzap.co/
- `/software/zenzap/controls.png` — source: https://www.zenzap.co/
- `/software/zenzap/demo.png` — source: https://www.youtube.com/watch?v=Mbrah0Xe5gU
- `/software/zenzap/quickstart.png` — source: https://www.youtube.com/watch?v=2ThZmgkLSgM

**Videos:**
- [Meet Zenzap - the work chat app built for how real teams work](https://www.youtube.com/watch?v=Giz_sPihCC4) — channel: Zenzap (`Giz_sPihCC4`)
- [Zenzap Team Communication App Demo](https://www.youtube.com/watch?v=Mbrah0Xe5gU) — channel: Zenzap (`Mbrah0Xe5gU`)

### `fastmail` — 4 shots, 1 videos

**Screenshots (local paths ← remote sources):**
- `/software/fastmail/mail.png` — source: https://www.fastmail.com/
- `/software/fastmail/calendar.png` — source: https://www.fastmail.com/
- `/software/fastmail/ui.png` — source: https://www.fastmail.com/
- `/software/fastmail/contacts.png` — source: https://www.fastmail.com/

**Videos:**
- [Fastmail Masked Email: Protect Your Privacy | Introduction](https://www.youtube.com/watch?v=rSpEZVh83VY) — channel: Fastmail (`rSpEZVh83VY`)

### `sanebox` — 4 shots, 1 videos

**Screenshots (local paths ← remote sources):**
- `/software/sanebox/digest.png` — source: https://www.sanebox.com/
- `/software/sanebox/snooze.png` — source: https://www.sanebox.com/
- `/software/sanebox/blackhole.png` — source: https://www.sanebox.com/
- `/software/sanebox/preview.png` — source: https://www.sanebox.com/

**Videos:**
- [How to Organize Your Email Inbox & Save 2+ Hours Every Week (SaneBox)](https://www.youtube.com/watch?v=eWR4kJlhZzE) — channel: SaneBox (`eWR4kJlhZzE`)

### `ringcentral` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/ringcentral/composer.png` — source: https://www.ringcentral.com/office.html
- `/software/ringcentral/phone.png` — source: https://www.ringcentral.com/office.html
- `/software/ringcentral/ai-powered.png` — source: https://www.ringcentral.com/office.html
- `/software/ringcentral/ringex-overview.png` — source: https://www.youtube.com/watch?v=RqVKtZzc4Lk

**Videos:**
- [RingEX | The modern business phone system, reimagined with AI](https://www.youtube.com/watch?v=RqVKtZzc4Lk) — channel: RingCentral (`RqVKtZzc4Lk`)
- [RingEX | RingCentral for Microsoft Teams](https://www.youtube.com/watch?v=UGhi5KZK3NM) — channel: RingCentral (`UGhi5KZK3NM`)

### `dialpad` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/dialpad/connect.png` — source: https://www.dialpad.com/
- `/software/dialpad/detail.png` — source: https://www.dialpad.com/
- `/software/dialpad/support.png` — source: https://www.dialpad.com/ai/
- `/software/dialpad/sell.png` — source: https://www.dialpad.com/ai/

**Videos:**
- [Demo: Dialpad Connect](https://www.youtube.com/watch?v=MXQN6BosxE0) — channel: Dialpad (`MXQN6BosxE0`)
- [Dialpad 101 | Tour the App](https://www.youtube.com/watch?v=McAVGIFG3_M) — channel: Dialpad (`McAVGIFG3_M`)

### `zoom` — 5 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/zoom/phone.png` — source: https://www.zoom.com/
- `/software/zoom/ai-suite.png` — source: https://www.zoom.com/
- `/software/zoom/collaboration.png` — source: https://www.zoom.com/
- `/software/zoom/customer-support.png` — source: https://www.zoom.com/
- `/software/zoom/zoom-phone-overview.png` — source: https://www.youtube.com/watch?v=xZfCxpVwT6A

**Videos:**
- [What Is Zoom Phone? Cloud VoIP Phone System for Business](https://www.youtube.com/watch?v=xZfCxpVwT6A) — channel: Zoom (`xZfCxpVwT6A`)
- [Zoom Meetings Innovations for Modern Collaboration](https://www.youtube.com/watch?v=P1f4dvDMk6g) — channel: Zoom (`P1f4dvDMk6g`)

### `nextiva` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/nextiva/voip-setup.png` — source: https://www.youtube.com/watch?v=PjZx6faUq90
- `/software/nextiva/voip-advantages.png` — source: https://www.youtube.com/watch?v=TI6WFk7qdKs
- `/software/nextiva/xbert.png` — source: https://www.youtube.com/watch?v=D0_mBZ-qMyY
- `/software/nextiva/transcription.png` — source: https://www.youtube.com/watch?v=WATbO3kIC-w

**Videos:**
- [How To Setup A Business VoIP System (Fast & Easy)](https://www.youtube.com/watch?v=PjZx6faUq90) — channel: Nextiva (`PjZx6faUq90`)
- [VoIP Advantages & Disadvantages (+ How to Get Started)](https://www.youtube.com/watch?v=TI6WFk7qdKs) — channel: Nextiva (`TI6WFk7qdKs`)

### `microsoft-teams` — 5 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/microsoft-teams/new-era.png` — source: https://www.youtube.com/watch?v=1BLiwgyLH0A
- `/software/microsoft-teams/channels.png` — source: https://www.youtube.com/watch?v=m3i18aunzQU
- `/software/microsoft-teams/welcome.png` — source: https://www.youtube.com/watch?v=jugBQqE_2sM
- `/software/microsoft-teams/copilot-phone.png` — source: https://www.youtube.com/watch?v=CBMg6Z4xfBI
- `/software/microsoft-teams/facilitator.png` — source: https://www.youtube.com/watch?v=khP2mbhJf1g

**Videos:**
- [Welcome to the New Era of Microsoft Teams](https://www.youtube.com/watch?v=1BLiwgyLH0A) — channel: Microsoft Teams (`1BLiwgyLH0A`)
- [All about using channels in Microsoft Teams](https://www.youtube.com/watch?v=m3i18aunzQU) — channel: Microsoft Teams (`m3i18aunzQU`)

### `slack` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/slack/homepage.png` — source: https://slack.com/
- `/software/slack/channels.png` — source: https://slack.com/
- `/software/slack/ai-summary.png` — source: https://slack.com/
- `/software/slack/platform.png` — source: https://slack.com/

**Videos:**
- [What is Slack? | Your Work OS | Slack](https://www.youtube.com/watch?v=EDATYbzYGiE) — channel: Slack (`EDATYbzYGiE`)
- [How to use Slack: Your quick start guide](https://www.youtube.com/watch?v=FTuOS8E1LZk) — channel: Slack (`FTuOS8E1LZk`)

### `openphone` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/openphone/screenshot-1.png` — source: https://www.openphone.com/
- `/software/openphone/screenshot-2.png` — source: https://www.openphone.com/
- `/software/openphone/screenshot-3.png` — source: https://www.openphone.com/
- `/software/openphone/screenshot-4.png` — source: https://www.openphone.com/

**Videos:**
- [Getting Started with Quo (Formerly OpenPhone)](https://www.youtube.com/watch?v=6YTrzLdgIII) — channel: Grow with Quo (`6YTrzLdgIII`)
- [How to make international calls and messages in Quo (formerly OpenPhone)](https://www.youtube.com/watch?v=D4mZl-7mwyM) — channel: Grow with Quo (`D4mZl-7mwyM`)

### `eightx8` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/eightx8/innovation.png` — source: https://www.youtube.com/watch?v=ygCBD5VqHNk
- `/software/eightx8/work-training.png` — source: https://www.youtube.com/watch?v=PRMBw8OUhDo
- `/software/eightx8/admin-training.png` — source: https://www.youtube.com/watch?v=enMaZAiT7D8
- `/software/eightx8/work-overview.png` — source: https://www.youtube.com/watch?v=qQQX-TSSMHk

**Videos:**
- [8x8 Year of Product Innovation 2025](https://www.youtube.com/watch?v=ygCBD5VqHNk) — channel: 8x8 (`ygCBD5VqHNk`)
- [8x8 Work: Instructor-Led Training Introduction](https://www.youtube.com/watch?v=PRMBw8OUhDo) — channel: 8x8 University (`PRMBw8OUhDo`)

### `goto-connect` — 6 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/goto-connect/ai-receptionist.png` — source: https://www.youtube.com/watch?v=1tUmre4sxFc
- `/software/goto-connect/grasshopper-hero.png` — source: https://grasshopper.com/
- `/software/goto-connect/webinar-2.png` — source: https://www.youtube.com/watch?v=1tUmre4sxFc
- `/software/goto-connect/ai-receptionist-hq.png` — source: https://www.youtube.com/watch?v=1tUmre4sxFc
- `/software/goto-connect/story-ui.png` — source: https://www.goto.com/connect
- `/software/goto-connect/story-ui-2.png` — source: https://www.goto.com/connect

**Videos:**
- [On-Demand Webinar – Revolutionize Every Call with GoTo Connect’s AI Receptionist](https://www.youtube.com/watch?v=1tUmre4sxFc) — channel: GoTo (`1tUmre4sxFc`)
- [GoTo Connect: Deliver Seamless Customer Experiences](https://www.youtube.com/watch?v=uDQlWGEPTro) — channel: GoTo (`uDQlWGEPTro`)

### `grasshopper` — 4 shots, 1 videos

**Screenshots (local paths ← remote sources):**
- `/software/grasshopper/story-1.png` — source: https://grasshopper.com/
- `/software/grasshopper/story-2.png` — source: https://grasshopper.com/
- `/software/grasshopper/story-3.png` — source: https://grasshopper.com/
- `/software/grasshopper/hero.png` — source: https://grasshopper.com/

**Videos:**
- [On-Demand Webinar – Revolutionize Every Call with GoTo Connect’s AI Receptionist](https://www.youtube.com/watch?v=1tUmre4sxFc) — channel: GoTo (`1tUmre4sxFc`)

### `respond-io` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/respond-io/platform.png` — source: https://www.youtube.com/watch?v=685o-1cPqfY
- `/software/respond-io/explained.png` — source: https://www.youtube.com/watch?v=-5C9R07eToc
- `/software/respond-io/get-started.png` — source: https://www.youtube.com/watch?v=KSR1y5taKpY
- `/software/respond-io/ai-agents.png` — source: https://www.youtube.com/watch?v=D5fbgAnNa2w

**Videos:**
- [Respond.io | The Platform for Business Growth Over Chat](https://www.youtube.com/watch?v=685o-1cPqfY) — channel: Respond.io (`685o-1cPqfY`)
- [Respond.io Explained: AI Agents, Omnichannel Inbox & CRM (2026)](https://www.youtube.com/watch?v=-5C9R07eToc) — channel: Respond.io (`-5C9R07eToc`)

### `buffer` — 5 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/buffer/composer.png` — source: https://buffer.com/
- `/software/buffer/calendar.png` — source: https://buffer.com/publish
- `/software/buffer/insights.png` — source: https://buffer.com/
- `/software/buffer/community.png` — source: https://buffer.com/
- `/software/buffer/publish-hero.png` — source: https://buffer.com/publish

**Videos:**
- [Getting Started Demo and Q&A with Buffer, May 10th, 2023](https://www.youtube.com/watch?v=S4fIZ0sBeoI) — channel: Buffer (`S4fIZ0sBeoI`)
- [Create a Stunning Landing Page for Your Brand with Start Page by Buffer](https://www.youtube.com/watch?v=EcDgL0ap60M) — channel: Buffer (`EcDgL0ap60M`)

### `webex` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/webex/calling-ai.png` — source: https://www.youtube.com/watch?v=kKJAwKxGxdk
- `/software/webex/ai-concierge.png` — source: https://www.youtube.com/watch?v=VmAHTeRXLCc
- `/software/webex/suite-ai-agents.png` — source: https://www.youtube.com/watch?v=XjV6_MeKiNI
- `/software/webex/wfm-ai.png` — source: https://www.youtube.com/watch?v=6jEraeeE9OQ

**Videos:**
- [Transform Every Customer Interaction | Webex Calling AI innovations](https://www.youtube.com/watch?v=kKJAwKxGxdk) — channel: Webex (`kKJAwKxGxdk`)
- [Webex AI in CX: Introducing AI Concierge](https://www.youtube.com/watch?v=VmAHTeRXLCc) — channel: Webex (`VmAHTeRXLCc`)

### `vonage` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/vonage/vbc-teams.png` — source: https://www.youtube.com/watch?v=AkBquWyO7ag
- `/software/vonage/contact-center.png` — source: https://www.youtube.com/watch?v=ytWPLDjH0Rc
- `/software/vonage/business-inbox.png` — source: https://www.youtube.com/watch?v=rjllkMQ3VNU
- `/software/vonage/servicenow-voice.png` — source: https://www.youtube.com/watch?v=e3-JsnyapiQ

**Videos:**
- [Demo: Vonage Business Communications for Teams](https://www.youtube.com/watch?v=AkBquWyO7ag) — channel: Vonage (`AkBquWyO7ag`)
- [Vonage Contact Center overview](https://www.youtube.com/watch?v=ytWPLDjH0Rc) — channel: Vonage (`ytWPLDjH0Rc`)

### `ooma` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/ooma/ai-receptionist.png` — source: https://www.youtube.com/watch?v=6tXSExcRMcs
- `/software/ooma/ai-insights.png` — source: https://www.youtube.com/watch?v=2EidmfD3BFs
- `/software/ooma/clio-integration.png` — source: https://www.youtube.com/watch?v=Ar59zMJZlN4
- `/software/ooma/mobile-desktop.png` — source: https://www.youtube.com/watch?v=ZBKp09v_jT4

**Videos:**
- [Ooma AI: Answering Service and Receptionist Explainer](https://www.youtube.com/watch?v=6tXSExcRMcs) — channel: Ooma (`6tXSExcRMcs`)
- [Ooma AI: Insights Explainer](https://www.youtube.com/watch?v=2EidmfD3BFs) — channel: Ooma (`2EidmfD3BFs`)

### `talkdesk` — 5 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/talkdesk/copilot.png` — source: https://www.talkdesk.com/customer-experience-automation/
- `/software/talkdesk/analytics.png` — source: https://www.talkdesk.com/customer-experience-automation/
- `/software/talkdesk/autopilot.png` — source: https://www.talkdesk.com/customer-experience-automation/
- `/software/talkdesk/ai-agents.png` — source: https://www.talkdesk.com/customer-experience-automation/
- `/software/talkdesk/orchestration.png` — source: https://www.talkdesk.com/customer-experience-automation/

**Videos:**
- [How Talkdesk CXA powers Talkdesk Commerce Orchestration (Demo)](https://www.youtube.com/watch?v=1I7ddqbsUAU) — channel: Talkdesk (`1I7ddqbsUAU`)
- [Talkdesk CXA Demo](https://www.youtube.com/watch?v=K6IIibUytjQ) — channel: Talkdesk (`K6IIibUytjQ`)

### `genesys` — 5 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/genesys/homepage-hero.png` — source: https://www.genesys.com/
- `/software/genesys/platform-overview.png` — source: https://www.genesys.com/genesys-cloud
- `/software/genesys/agent-screenshot.png` — source: https://www.genesys.com/
- `/software/genesys/threads-hero.png` — source: https://www.genesys.com/genesys-cloud
- `/software/genesys/what-is-cloud.png` — source: https://www.youtube.com/watch?v=18rNQO8A9Nw

**Videos:**
- [What is Genesys Cloud? | AI-Powered Experience Orchestration platform](https://www.youtube.com/watch?v=18rNQO8A9Nw) — channel: Genesys (`18rNQO8A9Nw`)
- [Meet Genesys Cloud Copilot: Your team’s new trusted teammate](https://www.youtube.com/watch?v=uzrKgW3gSwA) — channel: Genesys (`uzrKgW3gSwA`)

### `five9` — 4 shots, 2 videos

**Screenshots (local paths ← remote sources):**
- `/software/five9/genius-ai.png` — source: https://www.five9.com/resources/demo-video/five9-genius-aimeet-five9-genius-ai
- `/software/five9/homepage-video.png` — source: https://www.five9.com/
- `/software/five9/call-summaries.png` — source: https://www.youtube.com/watch?v=a9KbjbiD63E
- `/software/five9/interaction-access.png` — source: https://www.youtube.com/watch?v=0UB-3b-Xvwg

**Videos:**
- [Five9 TAMTorial: Deliver Valuable Five9 Call Summaries using GenAI Studio](https://www.youtube.com/watch?v=a9KbjbiD63E) — channel: Five9 (`a9KbjbiD63E`)
- [Five9 TAMTorial: "Auditing Insights with Five9 Interaction Access Events"](https://www.youtube.com/watch?v=0UB-3b-Xvwg) — channel: Five9 (`0UB-3b-Xvwg`)

## Notes / caveats

- **GoTo Connect / 8x8:** Vendor marketing sites returned 403/429 during capture; gallery uses official YouTube thumbnails + GoTo Sitecore CDN frames.
- **Microsoft Teams:** microsoft.com pages returned 403; gallery uses official Microsoft Teams / Microsoft 365 YouTube thumbnails showing product UI.
- **Nextiva:** Homepage is illustration-heavy; gallery uses official Nextiva YouTube thumbnails showing product UI.
- **OpenPhone:** Rebranded to Quo; screenshots from openphone.com Webflow CDN; videos from official **Grow with Quo** channel.
- **Freshcaller:** Product page DAM hero + official Freshdesk Contact Center YouTube frames/tutorials (Freshcaller lineage).
- **Grasshopper / Fastmail / SaneBox:** One verified official video each (additional walkthroughs on vendor channels can be added later).
- **Webex / Vonage / Ooma:** Marketing sites bot-blocked (403 / bot challenge) at capture; galleries use official vendor YouTube maxres thumbnails that show product UI (annotated). Channels verified via oembed `author_name`.
- **Talkdesk:** Official CloudFront CDN compositions from talkdesk.com CXA page + Talkdesk channel demos.
- **Genesys:** Official genesys.com `/media/` marketing frames + Genesys channel overview/Copilot videos.
- **Five9:** Official Vidyard demo/homepage frames + Five9 channel TAMTorials (GenAI Studio / Interaction Access).
- **Pre-existing schema fix:** Mapped invalid `aiCapabilities.capability` free-text labels to the allowed enum for openphone, eightx8, goto-connect, grasshopper, respond-io, **and Priority-3** webex / vonage / ooma / talkdesk / genesys / five9 so `ProductResearchEnrichmentSchema` / `loadEnrichment` succeed (original vendor labels preserved in `notes`).

## Verification

```bash
npx tsx -e "import { loadEnrichment } from './src/data/research/store.ts'; const e=loadEnrichment('aircall'); console.log(e.screenshots.filter(s=>s.kind==='vendor-ui').length, e.media.filter(m=>m.status==='active'||m.status==='published').length)"
npx tsx -e "import { loadEnrichment } from './src/data/research/store.ts'; for (const s of ['webex','vonage','ooma','talkdesk','genesys','five9']) { const e=loadEnrichment(s); console.log(s, e.screenshots.filter(x=>x.kind==='vendor-ui').length, e.media.filter(m=>m.status==='active'||m.status==='published').length) }"
node scripts/source-bc-product-media.mjs  # idempotent re-run
```

Verified 2026-08-17: Priority-3 gaps closed — webex/vonage/ooma/five9 → 4/2; talkdesk/genesys → 5/2; all BC-primary products ≥2 vendor-ui + ≥1 official YouTube; images under `public/software/{slug}/`.
