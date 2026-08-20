import {
  SiteFoundationConfigSchema,
  type SiteFoundationConfig,
} from "@/domain/schemas/site-foundation";
import { computeLegalConfigurationGaps } from "./legal-completeness";

/**
 * Central site foundation configuration — populated from known platform facts.
 *
 * Legal identity is configured for SoftwareGlimpse (Netherlands, sole proprietor).
 * Core legal documents are approved as of 2026-08-19.
 */
export const siteFoundationConfig: SiteFoundationConfig =
  SiteFoundationConfigSchema.parse({
    identity: {
      siteName: "SoftwareGlimpse",
      brandName: "SoftwareGlimpse",
      tagline: "Which software should I choose?",
      legalEntityName: "SoftwareGlimpse",
      registrationNumber:
        "Not applicable — sole proprietor, not registered with the KvK",
      country: "Netherlands",
      businessAddress:
        "Netherlands (postal address available on request via privacy@softwareglimpse.com)",
      contactEmail: "info@softwareglimpse.com",
      privacyEmail: "privacy@softwareglimpse.com",
      supportEmail: "info@softwareglimpse.com",
      founderAuthorId: "author-lee-meyeridricks",
      socialProfiles: {},
      configurationComplete: true,
      missingFields: [],
    },
    authors: [
      {
        id: "author-lee-meyeridricks",
        name: "Lee M.",
        slug: "lee-meyeridricks",
        role: "Founder",
        shortBio:
          "Founder of SoftwareGlimpse. Building a software decision platform that separates research, editorial judgment, and affiliate relationships — starting with CRM and sales tools.",
        fullBio:
          "I’m Lee M., the founder of SoftwareGlimpse. I built the original site as a more conventional review/affiliate publication, then decided that model wasn’t good enough for people who need to choose software carefully. SoftwareGlimpse is being rebuilt as a decision platform: structured research, category methodologies, comparisons, pricing tools, and recommendations that do not use commission as a ranking input. I care about transparent sourcing, clear disclosures, and saying when we have not hands-on tested a product. This biography does not invent employers, years of experience, or product-testing claims beyond what is documented for the site.",
        expertise: [
          "Software buying research workflows",
          "CRM and sales software evaluation frameworks",
          "Affiliate-independent recommendation design",
        ],
        socialLinks: {},
        disclosure:
          "Founder of SoftwareGlimpse. Expertise listed describes work on this platform; it is not a claim of certified professional credentials or universal hands-on testing of every product covered.",
      },
    ],
    processors: [
      {
        id: "hosting",
        name: "Vercel Inc.",
        purpose: "Website hosting and delivery",
        privacyPolicyUrl: "https://vercel.com/legal/privacy-policy",
        dataLocation: "United States / EU (region-dependent)",
        configured: true,
      },
      {
        id: "analytics",
        name: "Analytics provider (not configured)",
        purpose:
          "Optional usage analytics via the consent-gated event bus — no live vendor SDK is registered yet",
        configured: false,
      },
      {
        id: "newsletter",
        name: "Newsletter provider (not configured)",
        purpose: "Email newsletter subscription management",
        configured: false,
      },
      {
        id: "contact",
        name: "Contact form store (application stub)",
        purpose:
          "Receive contact and privacy requests for manual handling; not a full CRM",
        configured: true,
        dataLocation: "Application server-side store",
      },
      {
        id: "consent-storage",
        name: "First-party consent storage",
        purpose: "Store cookie preference choices in the visitor’s browser",
        configured: true,
        dataLocation: "Visitor browser (localStorage)",
      },
      {
        id: "affiliate-networks",
        name: "Affiliate / partner networks (per-product programmes)",
        purpose:
          "When you follow a commercial outbound link, you may arrive at a vendor or partner destination that attributes the visit for commission purposes",
        configured: true,
        dataLocation: "Third-party partner / vendor sites after redirect",
      },
    ],
    processingActivities: [
      {
        id: "pa-consent",
        purpose: "Remember cookie and tracking preferences",
        dataCategories: [
          "consent choices",
          "consent policy version",
          "decision timestamp",
        ],
        legalBasis: "consent",
        recipients: ["consent-storage"],
        retention:
          "Until you change/withdraw preferences, or until consent policy version renewal (default up to 365 days)",
        source: "Cookie consent UI",
        active: true,
      },
      {
        id: "pa-tool-state",
        purpose:
          "Remember CRM Finder and cost calculator progress on your device",
        dataCategories: [
          "finder answers (local)",
          "calculator draft inputs (local)",
        ],
        legalBasis: "legitimate-interest",
        recipients: [],
        retention: "Until cleared by you or overwritten on this device",
        source: "CRM Finder / CRM Cost Calculator",
        active: true,
      },
      {
        id: "pa-contact",
        purpose: "Respond to contact and privacy requests",
        dataCategories: [
          "name",
          "email",
          "message",
          "request reason",
          "optional related URL",
          "optional company (partnership reasons only)",
        ],
        legalBasis: "legitimate-interest",
        recipients: ["contact"],
        retention:
          "Up to 24 months after the request is closed, unless a longer period is required by law",
        source: "Contact form / privacy request form",
        active: true,
      },
      {
        id: "pa-newsletter",
        purpose:
          "Send software buying guides, comparisons, and practical updates by email",
        dataCategories: ["email"],
        legalBasis: "consent",
        recipients: ["newsletter"],
        retention:
          "Not active until a newsletter provider is configured and signup is enabled",
        source: "Newsletter signup",
        active: false,
      },
      {
        id: "pa-analytics",
        purpose:
          "Understand aggregated site usage to improve content (only if a provider is wired and consent is granted)",
        dataCategories: [
          "pseudonymous usage events",
          "page path",
          "event name",
        ],
        legalBasis: "consent",
        recipients: ["analytics"],
        retention: "Not active — analytics provider not configured",
        source: "Consent-gated analytics event bus",
        active: false,
      },
      {
        id: "pa-affiliate-redirect",
        purpose:
          "Route commercial outbound clicks to the intended vendor/partner destination",
        dataCategories: [
          "product / destination identifiers",
          "click context (page location, intent)",
          "optional campaign/subId parameters",
        ],
        legalBasis: "legitimate-interest",
        recipients: ["hosting", "affiliate-networks"],
        retention:
          "First-party redirect is operational; hosting access logs typically up to 90 days. Partner sites may process the visit under their own policies.",
        source: "Direct commercial outbound links (with /go/ compat redirects)",
        active: true,
      },
    ],
    cookies: [
      {
        name: "sg_consent",
        provider: "SoftwareGlimpse",
        purpose:
          "Stores cookie preference choices and consent policy version",
        category: "strictly-necessary",
        duration: "Up to renewAfterDays (currently 365 days) or until changed",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-finder-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers CRM Finder answers and progress on this device so you can continue mid-flow",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-si-finder-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers Sales Intelligence Finder answers and progress on this device so you can continue mid-flow",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-cost-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers CRM cost calculator draft inputs on this device",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-tco-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers CRM TCO calculator scenarios, assumptions and custom costs on this device (cost amounts and notes are never sent to analytics)",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-roi-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers CRM ROI calculator inputs, assumptions and scenario settings on this device (financial amounts are never sent to analytics)",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-roi-business-case-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Stores a confirmed ROI summary handoff for the CRM Business Case template on this device after you explicitly opt in",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-decision-profile-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers your CRM requirements profile (Requirements Builder) on this device so Finder, Cost Calculator and related tools can reuse it",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-vendor-scorecard-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers CRM Vendor Scorecard shortlist, criterion weights, demo ratings and notes on this device (notes are never sent to analytics)",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-implementation-plan-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers CRM Implementation Planner phases, tasks, statuses and notes on this device (task notes and project details are never sent to analytics)",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-migration-plan-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers CRM Migration Planner inventory, field mappings, statuses and cutover notes on this device (field names, notes and source values are never sent to analytics)",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-migration-cost-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers CRM Migration Cost Calculator scope, effort assumptions and quotes on this device (financial amounts and system names are never sent to analytics)",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-migration-cost-tco-handoff-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Stores a confirmed migration cost summary for CRM TCO / Cost Calculator import on this device after you explicitly opt in",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-migration-cost-roi-handoff-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Stores a confirmed migration cost summary for CRM ROI Calculator import on this device after you explicitly opt in",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-migration-cost-business-case-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Stores a confirmed migration cost summary for the CRM Business Case template on this device after you explicitly opt in",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-rfp-brief-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers CRM RFP / Vendor Brief Builder draft, requirements response fields, clarifications and version metadata on this device (requirement text and commercial figures are never sent to analytics)",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-demo-checklist-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers CRM Demo Checklist Builder demo plan, scenarios, agenda and per-vendor evaluation notes on this device (notes and commercial answers are never sent to analytics)",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-readiness-assessment-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers CRM Readiness Assessment progress, answers, action statuses and completed score snapshots on this device (answer detail is never sent to analytics)",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-crm-adoption-health-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers CRM Adoption / Health Assessment answers on this device (answer detail is never sent to analytics)",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-{category}-*-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers category Finder, cost, requirements, scorecard, RFP, demo checklist and readiness drafts on this device for published categories other than CRM and Sales Intelligence (full answers are never sent to analytics)",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg-stack-builder-v1",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers Software Stack Builder draft answers and progress on this device",
        category: "strictly-necessary",
        duration: "Until cleared or overwritten on this device",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "sg_newsletter_popup",
        provider: "SoftwareGlimpse",
        purpose:
          "Remembers newsletter popup dismiss / subscribed state (only used when newsletter popup is enabled)",
        category: "preferences",
        duration: "Local preference until cleared",
        firstParty: true,
        storageType: "localStorage",
      },
      {
        name: "YouTube embed cookies (when player loads)",
        provider: "Google / YouTube",
        purpose:
          "Set by YouTube when an official product video iframe loads after marketing consent and play",
        category: "marketing",
        duration: "Determined by Google / YouTube",
        firstParty: false,
        storageType: "cookie",
      },
      {
        name: "Vimeo embed cookies (when player loads)",
        provider: "Vimeo",
        purpose:
          "Set by Vimeo when an official product video iframe loads after marketing consent and play",
        category: "marketing",
        duration: "Determined by Vimeo",
        firstParty: false,
        storageType: "cookie",
      },
    ],
    consent: {
      version: "1.1.0",
      effectiveAt: "2026-08-14",
      renewAfterDays: 365,
      categoriesInUse: [
        "strictly-necessary",
        "preferences",
        "analytics",
        "marketing",
      ],
      analyticsRequiresConsent: true,
      marketingRequiresConsent: true,
      bannerTitle: "Cookies & privacy choices",
      bannerBody:
        "We use necessary storage to run the site and tools (for example consent choices and finder progress). Optional analytics and official product video embeds (YouTube/Vimeo) are not loaded unless you allow them. You can change your mind anytime via Cookie settings.",
      categoryDescriptions: {
        strictlyNecessary:
          "Required for consent storage and core site/tool function (including CRM Finder and calculator drafts on this device).",
        preferences:
          "Optional UI preferences such as newsletter popup dismissal when that feature is enabled.",
        analytics:
          "Optional usage analytics. No analytics vendor SDK is configured yet; when one is added, it will only run after you allow this category.",
        marketing:
          "Optional third-party embeds used for official vendor product videos (YouTube / Vimeo). Players load only after you allow this category and choose to play.",
      },
    },
    newsletter: {
      enabled: false,
      name: "SoftwareGlimpse Updates",
      description:
        "Software buying guides, comparisons, and practical tools — not a hype blast.",
      frequencyExpectation:
        "We will only promise a send cadence once a provider is live and operational.",
      senderLabel: undefined,
      providerId: undefined,
      doubleOptIn: true,
      consentCopy:
        "I want to receive SoftwareGlimpse software buying guides, comparisons, and practical updates by email.",
      footerTeaser:
        "Get practical software buying guides and comparisons in your inbox.",
      inlineTeaser:
        "Want clearer software shortlists? Get buying guides and comparisons by email.",
      popupHeadline: "Useful software buying notes",
      popupBody:
        "Occasional guides, comparisons, and practical tools from SoftwareGlimpse. No fake urgency.",
      confirmIntro:
        "Confirm your email to finish subscribing to SoftwareGlimpse Updates.",
      thanksBody:
        "You’re confirmed. Expect software buying guides, comparisons, and practical updates when the newsletter is operational — not a pile of affiliate CTAs.",
      preferencesIntro:
        "Preference controls will appear here once a newsletter provider that supports them is configured. Until then, use unsubscribe links in emails or Contact → Privacy.",
      popupEnabled: false,
      popupTrigger: "manual",
      popupMinSeconds: 45,
    },
    contact: {
      enabled: true,
      reasons: [
        "general",
        "correction",
        "vendor",
        "affiliate",
        "advertising",
        "privacy",
        "technical",
      ],
      introCopy:
        "Use this form for corrections, questions, vendor or partnership messages, privacy requests, and technical problems. Submitting the form does not subscribe you to email marketing.",
      correctionPrompt:
        "Spot something outdated or incorrect? Choose Correction and include the page URL plus what looks wrong (pricing, feature, broken link, or recommendation context).",
      privacyAcknowledgementCopy:
        "I understand this form is used to respond to my request and is processed according to the Privacy Policy.",
      rateLimitPerHour: 10,
      maxMessageLength: 5000,
    },
    retention: {
      consentRecords:
        "Until withdrawn or consent policy version renewal (see Cookie Policy)",
      contactSubmissions:
        "Up to 24 months after the request is closed, unless a longer period is required by law",
      newsletterMetadata:
        "Not active until a newsletter provider is configured and signup is enabled",
      analytics: "Not active — analytics provider not configured",
      serverLogs:
        "Operational hosting/access logs; typically up to 90 days (Vercel)",
    },
    legalDocuments: [
      {
        id: "privacy",
        slug: "privacy",
        path: "/legal/privacy/",
        title: "Privacy Policy",
        summary:
          "How SoftwareGlimpse processes personal data — generated from configured processing activities.",
        status: "approved",
        version: "0.2.1",
        effectiveAt: "2026-08-19",
        lastUpdatedAt: "2026-08-19",
        approvedAt: "2026-08-19",
        indexable: true,
        dependsOn: [
          "processors",
          "processingActivities",
          "identity",
          "retention",
        ],
        sections: [],
      },
      {
        id: "cookies",
        slug: "cookies",
        path: "/legal/cookies/",
        title: "Cookie Policy",
        summary:
          "Cookies and similar browser storage used by SoftwareGlimpse — generated from the live consent and storage inventory.",
        status: "approved",
        version: "0.2.1",
        effectiveAt: "2026-08-19",
        lastUpdatedAt: "2026-08-19",
        approvedAt: "2026-08-19",
        indexable: true,
        dependsOn: ["cookies", "consent", "processors"],
        sections: [],
      },
      {
        id: "terms",
        slug: "terms",
        path: "/legal/terms/",
        title: "Terms of Use",
        summary:
          "Website terms for SoftwareGlimpse — content, tools, affiliate links, and Netherlands governing law.",
        status: "approved",
        version: "0.2.1",
        effectiveAt: "2026-08-19",
        lastUpdatedAt: "2026-08-19",
        approvedAt: "2026-08-19",
        indexable: true,
        sections: [
          {
            id: "usage",
            heading: "Website use",
            body: "SoftwareGlimpse provides informational content and decision tools about software products. By using the site you agree to these terms. Do not misuse the site, attempt to disrupt services, probe for vulnerabilities without authorisation, or scrape in ways that overload infrastructure.",
          },
          {
            id: "content",
            heading: "Content",
            body: "We work to keep research and editorial content accurate and current. Software features, pricing, and availability change. Always verify critical details with the vendor before purchasing. Nothing on the site creates a professional advisory relationship.",
          },
          {
            id: "ip",
            heading: "Copyright and intellectual property",
            body: "Site content, branding, and original editorial materials are owned by SoftwareGlimpse (the operator named above) or its licensors unless otherwise stated. You may not republish substantial portions without permission.",
          },
          {
            id: "vendors",
            heading: "Third-party software and vendors",
            body: "Product names and trademarks belong to their owners. Outbound links may lead to vendor or partner sites we do not control. Their terms and privacy practices apply on those sites. SoftwareGlimpse is not a party to your agreement with a vendor.",
          },
          {
            id: "affiliate",
            heading: "Affiliate links",
            body: "Some links may be affiliate links. See the Affiliate Disclosure. Affiliate relationships do not determine editorial rankings or recommendation scores.",
          },
          {
            id: "tools",
            heading: "Pricing and tool estimates",
            body: "Finders and calculators are decision aids. Results depend on your inputs and available catalogue data. They are estimates, not guarantees of real-world cost, availability, or fit.",
          },
          {
            id: "prohibited",
            heading: "Prohibited use",
            body: "You may not use the site to distribute malware, attempt unauthorised access, impersonate others, or submit abusive or unlawful content via forms.",
          },
          {
            id: "availability",
            heading: "Availability",
            body: "We aim for reliable availability but do not guarantee uninterrupted access. Features may change as the platform evolves.",
          },
          {
            id: "limitations",
            heading: "Liability limitations",
            body: "To the extent permitted by applicable law, including mandatory consumer protections where you live, SoftwareGlimpse is not liable for purchasing or business decisions made solely based on site content. Nothing on the site creates a professional advisory relationship.",
          },
          {
            id: "governing-law",
            heading: "Governing law / jurisdiction",
            body: "These terms are governed by the laws of the Netherlands. Disputes are subject to the exclusive jurisdiction of the courts of the Netherlands, unless mandatory consumer protection law in your country requires otherwise.",
          },
          {
            id: "changes",
            heading: "Changes",
            body: "We may update these terms. Material changes update the document version and last-updated date. Continued use after changes constitutes acceptance where permitted by law.",
          },
          {
            id: "contact",
            heading: "Contact",
            body: "Questions about these terms: use the Contact page or email info@softwareglimpse.com. Privacy requests: privacy@softwareglimpse.com or Contact → Privacy.",
          },
        ],
      },
      {
        id: "affiliate-disclosure",
        slug: "affiliate-disclosure",
        path: "/legal/affiliate-disclosure/",
        title: "Affiliate Disclosure",
        status: "approved",
        version: "0.2.0",
        lastUpdatedAt: "2026-08-18",
        approvedAt: "2026-08-18",
        indexable: true,
        sections: [
          {
            id: "how",
            heading: "How commissions work",
            body: "SoftwareGlimpse may earn a commission when you click certain outbound links and later purchase, start a trial, or sign up through a partner destination. The purchase price is normally unaffected by the affiliate relationship.",
          },
          {
            id: "clicks",
            heading: "What happens when you click",
            body: "Commercial links typically go directly to a stored vendor or partner destination resolved from SoftwareGlimpse’s affiliate registry. Older shared /go/ links still redirect for compatibility. Partner networks or vendors may attribute the visit under their own programmes.",
          },
          {
            id: "editorial",
            heading: "Recommendations are not sold",
            body: "Affiliate relationships do not determine editorial recommendations, product scores, Best-page order, comparison conclusions, or Finder ranking. Non-affiliate software can still be recommended when evidence supports it. Not every product or link is an affiliate link.",
          },
          {
            id: "promotions",
            heading: "Promotions are separate",
            body: "Promotions and partner offers may appear as labeled commercial CTAs. Promotional placement does not change product scores or recommendation ranking. See also Editorial Independence and Advertising & Sponsorship.",
          },
        ],
      },
      {
        id: "editorial-independence",
        slug: "editorial-independence",
        path: "/legal/editorial-independence/",
        title: "Editorial Independence",
        status: "draft",
        version: "0.2.0",
        lastUpdatedAt: "2026-08-13",
        indexable: true,
        sections: [
          {
            id: "invariants",
            heading: "What the platform enforces",
            body: "SoftwareGlimpse is built so affiliate metadata is excluded from Finder/recommendation scoring snapshots, and editorial scoring does not treat commission as a criterion. Promotions resolve into labeled CTAs and do not rewrite recommendation ranking. These invariants are covered by automated tests and editorial QA checks for affiliate bias.",
          },
          {
            id: "coverage",
            heading: "What commercial priorities may influence",
            body: "Commercial priorities may influence which topics or products we research first. That is about coverage sequencing, not bought rankings. Editorial conclusions remain separate from affiliate economics.",
          },
          {
            id: "sponsorship",
            heading: "Sponsored rankings",
            body: "Vendors cannot buy editorial ranking positions. If sponsored placements are ever offered, they would be labeled and would not replace methodology-based scores or Best-page order. Sponsored programmes are not currently offered as a live product.",
          },
        ],
      },
      {
        id: "advertising-sponsorship",
        slug: "advertising-sponsorship",
        path: "/legal/advertising-sponsorship/",
        title: "Advertising & Sponsorship",
        status: "draft",
        version: "0.2.0",
        lastUpdatedAt: "2026-08-13",
        indexable: true,
        sections: [
          {
            id: "current",
            heading: "Current status",
            body: "Sponsored content and paid placements are not currently offered as a live SoftwareGlimpse product. This page describes how they would be treated if introduced.",
          },
          {
            id: "labeling",
            heading: "How sponsorship would be labeled",
            body: "Any sponsored placement or sponsored content would be clearly labeled as such. It would not be presented as an independent editorial ranking or methodology score.",
          },
          {
            id: "limits",
            heading: "What sponsors cannot buy",
            body: "Sponsors cannot buy editorial ranking positions, product scores, Best-page order, or Finder outcomes. Affiliate/promotion relationships already cannot alter those outcomes under current platform rules.",
          },
        ],
      },
      {
        id: "disclaimer",
        slug: "disclaimer",
        path: "/legal/disclaimer/",
        title: "Disclaimer",
        status: "draft",
        version: "0.2.0",
        lastUpdatedAt: "2026-08-13",
        indexable: true,
        sections: [
          {
            id: "informational",
            heading: "Informational purpose",
            body: "SoftwareGlimpse content is informational: it helps you evaluate software. It is not legal, financial, or professional advice.",
          },
          {
            id: "changes",
            heading: "Information changes",
            body: "Vendor features, pricing, plans, and availability change. We refresh research when we can, but you should verify final details and terms with the vendor before buying.",
          },
          {
            id: "estimates",
            heading: "Calculators are estimates",
            body: "Finders and cost calculators produce estimates from your inputs and our catalogue data. They do not guarantee real-world cost or outcomes.",
          },
          {
            id: "accuracy",
            heading: "Accuracy commitment",
            body: "This disclaimer is not an excuse for knowingly inaccurate information. If something looks wrong, tell us via Contact → Correction.",
          },
        ],
      },
      {
        id: "accessibility",
        slug: "accessibility",
        path: "/legal/accessibility/",
        title: "Accessibility Statement",
        summary:
          "How SoftwareGlimpse approaches accessibility, current WCAG status, and how to report barriers.",
        status: "approved",
        version: "0.2.1",
        effectiveAt: "2026-08-19",
        lastUpdatedAt: "2026-08-19",
        approvedAt: "2026-08-19",
        indexable: true,
        sections: [
          {
            id: "commitment",
            heading: "Commitment",
            body: "SoftwareGlimpse aims to make content and decision tools usable for as many people as possible — including visitors who use assistive technologies, keyboard-only navigation, or screen magnification.",
          },
          {
            id: "standards",
            heading: "Standards we work toward",
            body: "Our target reference is WCAG 2.2 Level AA. That is a design and engineering goal, not a claim of formal certification. We prioritize clear structure, readable text, visible focus, and usable forms on trust and tool pages.",
          },
          {
            id: "measures",
            heading: "Measures in place",
            body: "Foundational patterns on this rebuild include keyboard-accessible navigation, focus management in dialogs and cookie settings, semantic headings on editorial pages, text alternatives where media is informative, and plain-language copy on trust and legal pages. Interactive tools (finders, calculators) are built to be operable without a mouse where feasible.",
          },
          {
            id: "conformance",
            heading: "Conformance status",
            body: "A formal WCAG 2.2 conformance audit has not been completed for this rebuild. We do not claim WCAG 2.2 AA (or any specific conformance level) until that testing is done. Known limitations will be listed below as they are identified.",
          },
          {
            id: "limitations",
            heading: "Known limitations",
            body: "Some third-party embeds (for example official product videos from YouTube or Vimeo) depend on the provider’s player accessibility. Complex data visualizations in tools may not yet expose full non-visual equivalents. If you hit a barrier, please report it so we can prioritise fixes.",
          },
          {
            id: "contact",
            heading: "Report a barrier",
            body: "Use the Contact page (reason: Technical / accessibility issue) or email info@softwareglimpse.com. Include the page URL, what you tried to do, the barrier you encountered, and your browser or assistive technology if relevant. We use this feedback to prioritise improvements.",
          },
          {
            id: "related",
            heading: "Related policies",
            body: "Personal data submitted with accessibility reports is handled under the Privacy Policy. For general terms of site use, see the Terms of Use.",
          },
        ],
      },
    ],
    terms: {
      governingLaw: "Netherlands",
    },
  });

const legalGaps = computeLegalConfigurationGaps(siteFoundationConfig);
siteFoundationConfig.identity.missingFields = legalGaps;
siteFoundationConfig.identity.configurationComplete = legalGaps.length === 0;
