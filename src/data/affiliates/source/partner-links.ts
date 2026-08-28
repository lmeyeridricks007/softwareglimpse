/**
 * Canonical partner / affiliate destination URLs.
 * Source of truth for commercial outbound links.
 * Import known products via:
 *   npm run affiliate:import -- src/data/affiliates/source/partner-links.import.csv
 * Do not hardcode these URLs in page prose — resolve via SoftwareCta / AffiliateLink
 * (direct externalUrl). `/go/{slug}` is backward-compat only.
 */

export type PartnerLinkRecord = {
  name: string;
  primaryCategory: string;
  /** Null when no live affiliate destination is configured. */
  affiliateUrl: string | null;
  /**
   * When affiliateUrl is null: `pending` = awaiting PartnerStack/Impact link;
   * `declined` = programme rejected or inactive — not a gap.
   */
  affiliateUrlState?: "pending" | "declined";
  /** Preferred software slug when/if onboarded. */
  productSlug: string;
  catalogueSourceId?: string;
  /** Alternate QuillBot tracking destinations (primary is affiliateUrl). */
  alternateUrls?: string[];
};

/** True when partner-links row still needs an operator-supplied tracking URL. */
export function isUnresolvedPartnerUrl(row: PartnerLinkRecord): boolean {
  if (row.affiliateUrl) return false;
  return row.affiliateUrlState !== "pending" && row.affiliateUrlState !== "declined";
}

export const partnerLinks: PartnerLinkRecord[] = [
  { name: "Accelerated Growth Studio", primaryCategory: "Marketing / Growth Services", affiliateUrl: "https://acceleratedgrowthstudio.partnerlinks.io/7q3b5o2oy7d7", productSlug: "accelerated-growth-studio", catalogueSourceId: "aff-accelerated-growth-studio" },
  { name: "ActiveCampaign", primaryCategory: "Email Marketing / Marketing Automation", affiliateUrl: "https://try.activecampaign.com/715whgqxs62u-rvs4jt", productSlug: "activecampaign", catalogueSourceId: "aff-activecampaign" },
  { name: "AdCreative.ai", primaryCategory: "AI Advertising / Creative Generation", affiliateUrl: "https://free-trial.adcreative.ai/az59uqmj4faf-96w1li", productSlug: "adcreative-ai", catalogueSourceId: "aff-adcreative-ai" },
  { name: "AI InteleKt Inc.", primaryCategory: "AI Software", affiliateUrl: "https://aiintelekt.partnerlinks.io/zp5r5hl99k9n", productSlug: "ai-intelekt", catalogueSourceId: "aff-ai-intelekt" },
  { name: "Aira", primaryCategory: "AI / Digital Accessibility", affiliateUrl: "https://get.aira.app/jr1x15qg825e", productSlug: "aira", catalogueSourceId: "aff-aira" },
  { name: "Aircall.io", primaryCategory: "Business Phone / VoIP", affiliateUrl: "https://get.aircall.io/1iaj04fel1ok", productSlug: "aircall", catalogueSourceId: "aff-aircall" },
  { name: "AliDrop", primaryCategory: "Dropshipping / Ecommerce", affiliateUrl: "https://get.alidrop.co/ecisqr0fxqvj", productSlug: "alidrop", catalogueSourceId: "aff-alidrop" },
  { name: "Amplemarket", primaryCategory: "Sales Engagement", affiliateUrl: "https://grow.amplemarket.com/3vxr5swrhqgj", productSlug: "amplemarket", catalogueSourceId: "aff-amplemarket" },
  { name: "Apollo.io", primaryCategory: "Sales Intelligence / Sales Engagement", affiliateUrl: "https://get.apollo.io/z13ixmuq8z47", productSlug: "apollo", catalogueSourceId: "aff-apollo-io" },
  { name: "AWeber Communications", primaryCategory: "Email Marketing", affiliateUrl: "https://psjoin.aweber.com/6dw4eb19d1rc", productSlug: "aweber", catalogueSourceId: "aff-aweber" },
  { name: "Bïrch (formerly Revealbot)", primaryCategory: "Advertising Automation", affiliateUrl: "https://join.bir.ch/zw76x2a5zsnp", productSlug: "birch", catalogueSourceId: "aff-birch" },
  { name: "BookYourData", primaryCategory: "B2B Data / Lead Generation", affiliateUrl: "https://join.bookyourdata.com/iyjf5ka4hj9j", productSlug: "bookyourdata", catalogueSourceId: "aff-bookyourdata" },
  { name: "Bolt for Business", primaryCategory: "Business Travel / Transportation", affiliateUrl: "https://get.business.bolt.eu/jtecf94l0flr", productSlug: "bolt-for-business", catalogueSourceId: "aff-bolt-for-business" },
  { name: "Bouncer", primaryCategory: "Email Verification", affiliateUrl: "https://withlove.usebouncer.com/7f96frxz2xmj", productSlug: "bouncer", catalogueSourceId: "aff-bouncer" },
  { name: "Brand24", primaryCategory: "Social Listening / Brand Monitoring", affiliateUrl: "https://try.brand24.com/nt5khme0rtcj", productSlug: "brand24", catalogueSourceId: "aff-brand24" },
  { name: "Breezy HR", primaryCategory: "Applicant Tracking / Recruiting", affiliateUrl: "https://breezyhr.partnerlinks.io/2mnqgfqugfj2", productSlug: "breezy-hr", catalogueSourceId: "aff-breezy-hr" },
  { name: "Bright Data", primaryCategory: "Proxy / Web Data Collection", affiliateUrl: "https://get.brightdata.com/egcchebrm7g5", productSlug: "bright-data", catalogueSourceId: "aff-bright-data" },
  { name: "CallHippo", primaryCategory: "Business Phone / VoIP", affiliateUrl: "https://join.callhippo.com/nmdfk28yy5a9", productSlug: "callhippo", catalogueSourceId: "aff-callhippo" },
  { name: "Campaign Monitor by Marigold", primaryCategory: "Email Marketing", affiliateUrl: "https://partners.campaignmonitor.com/ezb6s7olowj1", productSlug: "campaign-monitor", catalogueSourceId: "aff-campaign-monitor" },
  { name: "Canvas Score by Roya.com", primaryCategory: "Marketing / Website Analytics", affiliateUrl: null, affiliateUrlState: "pending", productSlug: "canvas-score" },
  { name: "Capsule and Transpond", primaryCategory: "CRM / Email Marketing", affiliateUrl: "https://get.capsulenow.io/zs1cakqfksi6", productSlug: "capsule", catalogueSourceId: "aff-capsule-transpond" },
  { name: "Carepatron", primaryCategory: "Practice Management / Healthcare", affiliateUrl: "https://get.carepatron.com/57qubyw3gk9y", productSlug: "carepatron", catalogueSourceId: "aff-carepatron" },
  { name: "ClickUp", primaryCategory: "Project Management / Work OS", affiliateUrl: "https://try.web.clickup.com/q22d8kyvpi6i", productSlug: "clickup", catalogueSourceId: "aff-clickup" },
  { name: "Close", primaryCategory: "CRM / Sales Engagement", affiliateUrl: "https://refer.close.com/s5a5kgl3dd92", productSlug: "close", catalogueSourceId: "aff-close" },
  { name: "Closely", primaryCategory: "Sales Engagement / Lead Generation", affiliateUrl: "https://get.closelyhq.com/5hzvlqoo3sx7", productSlug: "closely", catalogueSourceId: "aff-closely" },
  { name: "CometChat", primaryCategory: "In-App Chat SDK / Messaging API", affiliateUrl: "https://try.cometchat.com/6dfysgmscrmo", productSlug: "cometchat", catalogueSourceId: "aff-cometchat" },
  { name: "Connecteam", primaryCategory: "Workforce Management / Employee Management", affiliateUrl: "https://partners.connecteam.com/h77a37h9xngf", productSlug: "connecteam", catalogueSourceId: "aff-connecteam" },
  { name: "Contractor Foreman", primaryCategory: "Construction Management", affiliateUrl: "https://try.contractorforeman.com/3bd4vk7j087f", productSlug: "contractor-foreman", catalogueSourceId: "aff-contractor-foreman" },
  { name: "Databox", primaryCategory: "Business Analytics / KPI Dashboards", affiliateUrl: "https://join.databox.com/1yuo2tivgh97-5b1iq5", productSlug: "databox", catalogueSourceId: "aff-databox" },
  { name: "Dext", primaryCategory: "Accounting / Bookkeeping Automation", affiliateUrl: "https://join.dext.com/bqu81rwyh2sr", productSlug: "dext", catalogueSourceId: "aff-dext" },
  { name: "Diginius", primaryCategory: "Digital Marketing / PPC Management", affiliateUrl: "https://get.diginius.com/ora576t7vdve", productSlug: "diginius", catalogueSourceId: "aff-diginius" },
  { name: "Eleven Labs Inc", primaryCategory: "AI Voice / Text-to-Speech", affiliateUrl: "https://try.elevenlabs.io/2tsfz1jc3rce", productSlug: "elevenlabs", catalogueSourceId: "aff-elevenlabs" },
  { name: "Emergent Labs Inc.", primaryCategory: "AI App Development", affiliateUrl: "https://get.emergent.sh/ojqurtybr0z4", productSlug: "emergent", catalogueSourceId: "aff-emergent" },
  { name: "Evolve", primaryCategory: "Business Software", affiliateUrl: "https://go.evolveplatform.ai/47u0mjuyc56p", productSlug: "evolve", catalogueSourceId: "aff-evolve" },
  { name: "Fastmail", primaryCategory: "Business Email / Email Hosting", affiliateUrl: "https://join.fastmail.com/leemeyeridricks5543", productSlug: "fastmail", catalogueSourceId: "aff-fastmail" },
  { name: "FlexiQuiz", primaryCategory: "Quiz / Assessment Software", affiliateUrl: "https://try.flexiquiz.com/i5qtaz2cxzv9", productSlug: "flexiquiz", catalogueSourceId: "aff-flexiquiz" },
  { name: "Flippa.com", primaryCategory: "Website / Online Business Marketplace", affiliateUrl: "https://referral.flippa.com/nyzykxmdpi62-5i76g", productSlug: "flippa", catalogueSourceId: "aff-flippa" },
  { name: "folk", primaryCategory: "CRM", affiliateUrl: "https://try.folk.app/rng1ia1n0a51", productSlug: "folk", catalogueSourceId: "aff-folk" },
  { name: "Foxit", primaryCategory: "PDF / Document Management", affiliateUrl: "https://partnerstack.foxit.com/toctmtlu4bjy", productSlug: "foxit", catalogueSourceId: "aff-foxit" },
  { name: "Freshcaller", primaryCategory: "Business Phone / Contact Center", affiliateUrl: null, affiliateUrlState: "pending", productSlug: "freshcaller", catalogueSourceId: "aff-freshcaller" },
  { name: "Freshchat", primaryCategory: "Live Chat / Customer Messaging", affiliateUrl: null, affiliateUrlState: "pending", productSlug: "freshchat", catalogueSourceId: "aff-freshchat" },
  { name: "Freshdesk by Freshworks", primaryCategory: "Help Desk / Customer Support", affiliateUrl: null, affiliateUrlState: "pending", productSlug: "freshdesk", catalogueSourceId: "aff-freshdesk" },
  { name: "Freshmarketer", primaryCategory: "Marketing Automation / CRO", affiliateUrl: null, affiliateUrlState: "pending", productSlug: "freshmarketer", catalogueSourceId: "aff-freshmarketer" },
  { name: "Freshsales", primaryCategory: "CRM", affiliateUrl: "https://affiliatepartner-freshsales.freshworks.com/umqnj18oe0m7", productSlug: "freshsales", catalogueSourceId: "aff-freshsales" },
  { name: "Freshservice by Freshworks", primaryCategory: "IT Service Management", affiliateUrl: null, affiliateUrlState: "pending", productSlug: "freshservice", catalogueSourceId: "aff-freshservice" },
  { name: "Freshteam", primaryCategory: "HR / Applicant Tracking", affiliateUrl: null, affiliateUrlState: "pending", productSlug: "freshteam", catalogueSourceId: "aff-freshteam" },
  { name: "Freshworks", primaryCategory: "CRM / Customer Service Suite", affiliateUrl: null, affiliateUrlState: "pending", productSlug: "freshworks", catalogueSourceId: "aff-freshworks" },
  { name: "Gamma", primaryCategory: "AI Presentation / Content Design", affiliateUrl: "https://try.gamma.app/m8cx9huc5414", productSlug: "gamma", catalogueSourceId: "aff-gamma" },
  { name: "Getscreen.me", primaryCategory: "Remote Desktop", affiliateUrl: "https://try.getscreen.me/uror44gjaujf", productSlug: "getscreen-me", catalogueSourceId: "aff-getscreen-me" },
  { name: "GetResponse", primaryCategory: "Email Marketing / Marketing Automation", affiliateUrl: "https://try.getresponsetoday.com/bggogt2lfafv-xlkg1t", productSlug: "getresponse", catalogueSourceId: "aff-getresponse" },
  { name: "Hive", primaryCategory: "Project Management", affiliateUrl: "https://get.hive.com/eerwc3eeweji", productSlug: "hive", catalogueSourceId: "aff-hive" },
  { name: "HyNote", primaryCategory: "AI Meeting Notes / Note Taker", affiliateUrl: "https://hynote.ai/?via=J4VZPD6BKN", productSlug: "hynote", catalogueSourceId: "aff-hynote" },
  { name: "HubSpot", primaryCategory: "CRM / Marketing Automation", affiliateUrl: "https://hubspot.sjv.io/WqWO7n", productSlug: "hubspot", catalogueSourceId: "aff-hubspot" },
  { name: "InboxAlly", primaryCategory: "Email Deliverability", affiliateUrl: "https://get.inboxally.com/email-placement-tester-bznqt8ycxvhu", productSlug: "inboxally", catalogueSourceId: "aff-inboxally" },
  { name: "Instantly", primaryCategory: "Cold Email / Sales Outreach", affiliateUrl: null, affiliateUrlState: "declined", productSlug: "instantly", catalogueSourceId: "aff-instantly" },
  { name: "Jibble", primaryCategory: "Time Tracking / Workforce Management", affiliateUrl: "https://affiliate.jibble.io/acciur08fa6h", productSlug: "jibble", catalogueSourceId: "aff-jibble" },
  { name: "Kartra", primaryCategory: "Marketing Automation / Funnel Builder", affiliateUrl: "https://try.kartra.com/jzs0bc88f4ur", productSlug: "kartra", catalogueSourceId: "aff-kartra" },
  { name: "Keap", primaryCategory: "CRM / Marketing Automation", affiliateUrl: "https://get.keap.com/0nqpwzftjbre", productSlug: "keap", catalogueSourceId: "aff-keap" },
  { name: "Kit (formerly ConvertKit)", primaryCategory: "Email Marketing", affiliateUrl: "https://partners.kit.com/wjcqp6b5mv7n-uw04r", productSlug: "kit", catalogueSourceId: "aff-kit" },
  { name: "Kixie", primaryCategory: "Sales Dialer / Business Phone", affiliateUrl: "https://get.kixie.com/g2td1yz9zi5n", productSlug: "kixie", catalogueSourceId: "aff-kixie" },
  { name: "KrispCall Communications Inc.", primaryCategory: "Business Phone / VoIP", affiliateUrl: "https://try.krispcall.com/4l3iuvw2crqn", productSlug: "krispcall", catalogueSourceId: "aff-krispcall" },
  { name: "LearnWorlds", primaryCategory: "LMS / Online Course Platform", affiliateUrl: "https://get.learnworlds.com/eigvvf6yiu74", productSlug: "learnworlds", catalogueSourceId: "aff-learnworlds" },
  { name: "Leadpages", primaryCategory: "Landing Page Builder / CRO", affiliateUrl: "https://try.leadpages.com/p0v2tlud22mf", productSlug: "leadpages", catalogueSourceId: "aff-leadpages" },
  { name: "Livestorm", primaryCategory: "Webinar / Video Conferencing", affiliateUrl: null, affiliateUrlState: "pending", productSlug: "livestorm", catalogueSourceId: "aff-livestorm" },
  { name: "LucroVox", primaryCategory: "Business Software", affiliateUrl: "https://try.lucrovox.com/fhruhgg6gk78", productSlug: "lucrovox", catalogueSourceId: "aff-lucrovox" },
  { name: "Lusha", primaryCategory: "Sales Intelligence / Lead Generation", affiliateUrl: "https://partnerstack.lusha.com/x4qgyinabuq1", productSlug: "lusha", catalogueSourceId: "aff-lusha" },
  { name: "MindStudio", primaryCategory: "AI App / Agent Builder", affiliateUrl: "https://get.mindstudio.ai/lgjc5c17fkpb", productSlug: "mindstudio", catalogueSourceId: "aff-mindstudio" },
  { name: "monday.com", primaryCategory: "Project Management / Work Management", affiliateUrl: "https://try.monday.com/h9l0vmame38h", productSlug: "monday", catalogueSourceId: "aff-monday-com" },
  { name: "Motion", primaryCategory: "Productivity / Task Management", affiliateUrl: null, affiliateUrlState: "pending", productSlug: "motion", catalogueSourceId: "aff-motion" },
  { name: "MRPeasy", primaryCategory: "Manufacturing ERP / MRP", affiliateUrl: "https://try.mrpeasy.com/9apyp927cq1s", productSlug: "mrpeasy", catalogueSourceId: "aff-mrpeasy" },
  { name: "Navan", primaryCategory: "Business Travel / Expense Management", affiliateUrl: "https://get.navan.com/qt37anemz9g9", productSlug: "navan", catalogueSourceId: "aff-navan" },
  { name: "NiceJob", primaryCategory: "Reputation Management", affiliateUrl: "https://try.nicejob.com/ni0oxnp3349z", productSlug: "nicejob", catalogueSourceId: "aff-nicejob" },
  { name: "Office Timeline", primaryCategory: "Project Management / Presentation", affiliateUrl: "https://get.officetimeline.com/gtm3y5ij8cz5", productSlug: "office-timeline", catalogueSourceId: "aff-office-timeline" },
  { name: "Pipedrive", primaryCategory: "CRM", affiliateUrl: "https://aff.trypipedrive.com/4nvrdp5mbmb7", productSlug: "pipedrive", catalogueSourceId: "aff-pipedrive" },
  { name: "Plesk", primaryCategory: "Web Hosting / Server Management", affiliateUrl: "https://try.plesk.com/tu2la8fk5ac9-z4f5m7", productSlug: "plesk", catalogueSourceId: "aff-plesk" },
  { name: "Printify", primaryCategory: "Print-on-Demand / Ecommerce", affiliateUrl: "https://try.printify.com/yutbwcipb7c3", productSlug: "printify", catalogueSourceId: "aff-printify" },
  { name: "QuillBot", primaryCategory: "AI Writing", affiliateUrl: "https://try.quillbot.com/db3a97ce993a", productSlug: "quillbot", catalogueSourceId: "aff-quillbot", alternateUrls: ["https://try.quillbot.com/Lee", "https://try.quillbot.com/0n59kg46nmug"] },
  { name: "Rank Prompt", primaryCategory: "AI SEO / Search Marketing", affiliateUrl: "https://join.rankprompt.com/7qr6ufz6gjxq-xj5vs", productSlug: "rank-prompt", catalogueSourceId: "aff-rank-prompt" },
  { name: "Reply.io", primaryCategory: "Sales Engagement / Email Outreach", affiliateUrl: "https://get.reply.io/se3w5qrz6hyy", productSlug: "reply", catalogueSourceId: "aff-reply-io" },
  { name: "Rippling", primaryCategory: "HR / Payroll / IT Platform", affiliateUrl: "https://try.rippling.com/o79elvy346nf", productSlug: "rippling", catalogueSourceId: "aff-rippling" },
  { name: "RocketReach LLC", primaryCategory: "Contact Data / Lead Generation", affiliateUrl: null, affiliateUrlState: "pending", productSlug: "rocketreach", catalogueSourceId: "aff-rocketreach" },
  { name: "Salesflare", primaryCategory: "CRM", affiliateUrl: "https://go.salesflare.com/d10dqhxqfl23", productSlug: "salesflare", catalogueSourceId: "aff-salesflare" },
  { name: "SaneBox", primaryCategory: "Email Productivity", affiliateUrl: "https://try.sanebox.com/vub7fxpb2g7m", productSlug: "sanebox", catalogueSourceId: "aff-sanebox" },
  { name: "Sendcloud", primaryCategory: "Ecommerce Shipping / Returns", affiliateUrl: "https://sendcloud.getsc.eu/dl0hxgf7026b-returns", productSlug: "sendcloud", catalogueSourceId: "aff-sendcloud" },
  { name: "Sellfy", primaryCategory: "Ecommerce / Digital Downloads", affiliateUrl: "https://get.sellfy.com/h8et05cnnokc", productSlug: "sellfy", catalogueSourceId: "aff-sellfy" },
  { name: "ShipBob", primaryCategory: "Ecommerce Fulfillment", affiliateUrl: "https://partnerwith.shipbob.com/6ft74869kg22", productSlug: "shipbob", catalogueSourceId: "aff-shipbob" },
  { name: "Shore", primaryCategory: "Appointment Scheduling / Business Management", affiliateUrl: "https://try.shore.com/vmcpzg5nbg9j", productSlug: "shore", catalogueSourceId: "aff-shore" },
  { name: "Shopify", primaryCategory: "Ecommerce / Online Store", affiliateUrl: "https://shopify.pxf.io/4189861-link?sharedid=4189861", productSlug: "shopify", catalogueSourceId: "aff-shopify" },
  { name: "SocialBee", primaryCategory: "Social Media Management", affiliateUrl: "https://get.socialbee.io/txg9o1sie7g4", productSlug: "socialbee", catalogueSourceId: "aff-socialbee" },
  { name: "Snov.io", primaryCategory: "Sales Intelligence / Email Outreach", affiliateUrl: "https://snov.io?fp_ref=lee13", productSlug: "snov", catalogueSourceId: "aff-snov-io" },
  { name: "Spocket", primaryCategory: "Dropshipping / Ecommerce", affiliateUrl: "https://get.spocket.co/jpv1uwgt4sp1", productSlug: "spocket", catalogueSourceId: "aff-spocket" },
  { name: "Switcher Studio", primaryCategory: "Live Streaming / Video Production", affiliateUrl: "https://start.switcherstudio.com/pqjil7ivf3t7", productSlug: "switcher-studio", catalogueSourceId: "aff-switcher-studio" },
  { name: "ThorData", primaryCategory: "Proxy / Web Data Infrastructure", affiliateUrl: "https://affiliate.thordata.com/eu3nfozhzp5f", productSlug: "thordata", catalogueSourceId: "aff-thordata" },
  { name: "Tidio", primaryCategory: "Live Chat / Customer Support", affiliateUrl: "https://affiliate.tidio.com/9dfzehpzpg2p-8xvu4", productSlug: "tidio", catalogueSourceId: "aff-tidio" },
  { name: "Trainual", primaryCategory: "Employee Training / Knowledge Management", affiliateUrl: "https://start.trainual.com/8kshk4tc5bv4", productSlug: "trainual", catalogueSourceId: "aff-trainual" },
  { name: "Turbotic", primaryCategory: "Automation AI / Enterprise Workflows", affiliateUrl: "https://try.turbotic.com/cjl61tbufha3", productSlug: "turbotic", catalogueSourceId: "aff-turbotic" },
  { name: "Uniqode", primaryCategory: "QR Code / Digital Engagement", affiliateUrl: null, affiliateUrlState: "pending", productSlug: "uniqode", catalogueSourceId: "aff-uniqode" },
  { name: "UENI.com", primaryCategory: "Website Builder", affiliateUrl: "https://psc.ueni.com/w640wkjyyhd5", productSlug: "ueni", catalogueSourceId: "aff-ueni" },
  { name: "VektorOS", primaryCategory: "Business / Operations Software", affiliateUrl: "https://partners.vektoros.ai/zg4y82bv06pe", productSlug: "vektoros", catalogueSourceId: "aff-vektoros" },
  { name: "Wati.io", primaryCategory: "WhatsApp Business / Customer Messaging", affiliateUrl: "https://affiliates.wati.io/v2fe9kxh7wq8", productSlug: "wati", catalogueSourceId: "aff-wati" },
  { name: "WebCatalog", primaryCategory: "Productivity / Web App Management", affiliateUrl: "https://try.webcatalog.io/cy80gva63g2w", productSlug: "webcatalog", catalogueSourceId: "aff-webcatalog" },
  { name: "WebinarJam & EverWebinar", primaryCategory: "Webinar Software", affiliateUrl: "https://try.kartra.com/zltrk281rw6t-26ysr", productSlug: "webinarjam-everwebinar", catalogueSourceId: "aff-kartra-webinarjam-everwebinar" },
  { name: "Wegic", primaryCategory: "AI Website Builder", affiliateUrl: "https://try.wegic.ai/4p512poiwlw9", productSlug: "wegic", catalogueSourceId: "aff-wegic" },
  { name: "WhatConverts", primaryCategory: "Lead Tracking / Marketing Analytics", affiliateUrl: "https://partners.whatconverts.com/dmbfqglmddkr", productSlug: "whatconverts", catalogueSourceId: "aff-whatconverts" },
  { name: "Writesonic", primaryCategory: "AI Writing / AI Search", affiliateUrl: "https://writesonic.com?via=lee72", productSlug: "writesonic", catalogueSourceId: "aff-writesonic" },
  { name: "Zenzap", primaryCategory: "Team Communication", affiliateUrl: "https://try.zenzap.co/7rv36pfxdvvy", productSlug: "zenzap", catalogueSourceId: "aff-zenzap" },
  { name: "Zypper", primaryCategory: "Influencer Marketing", affiliateUrl: "https://get.zypper.com/980cl4fisuk1", productSlug: "zypper", catalogueSourceId: "aff-zypper" },
];

export const partnerLinksBySlug = new Map(
  partnerLinks.map((row) => [row.productSlug, row] as const),
);

export function getPartnerAffiliateUrl(productSlug: string): string | null {
  return partnerLinksBySlug.get(productSlug)?.affiliateUrl ?? null;
}

export function getPartnerLinkRecord(
  productSlug: string,
): PartnerLinkRecord | undefined {
  return partnerLinksBySlug.get(productSlug);
}
