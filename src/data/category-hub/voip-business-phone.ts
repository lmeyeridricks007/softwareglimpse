import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildVoipBusinessPhoneCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "voip-business-phone",
    shortName: "VoIP & Business Phone",
    displayName: "VoIP & Business Phone Software",
    tagline:
      "Cloud phone, sales dialers, and contact-center voice — distinct from team chat and messaging inboxes.",
    definition:
      "VoIP and business phone software provisions business numbers, routes calls, powers outbound dialers, and logs conversations into CRM — for SMB cloud phone, mid-market CRM CTI, inbound contact-center voice, and sales dialing jobs. The right tool matches the voice job — not a single list that ranks KrispCall against Aircall as undifferentiated peers. Shortlist via the parent Business Communications Finder with the voice-vs-chat primary job.",
    iconSlug: "voip-business-phone",
    decisionCriteria: [
      "Primary voice job fit",
      "SMB VoIP vs CRM CTI vs dialer vs inbound CC",
      "Seat minimums and per-minute TCO",
      "IVR and queue depth",
      "CRM / helpdesk CTI",
      "Outbound dialer requirements",
    ],
    popularNeeds: [
      "Business phone numbers",
      "Cloud VoIP calling",
      "Power dialer / outbound",
      "CRM click-to-dial",
      "IVR and call queues",
      "Call recording",
    ],
    chooseGuideHref: "/guides/how-to-choose-voip-business-phone-software/",
    glance: {
      whatItDoes: [
        "Provisions business phone numbers",
        "Routes calls with IVR and queues",
        "Powers outbound sales dialers",
        "Logs calls into CRM records",
        "Records calls for QA and coaching",
        "Supports SMS alongside voice",
      ],
      bestFor: [
        "SMB teams replacing personal mobiles",
        "Mid-market sales with CRM click-to-dial",
        "Inbound support queues on cloud PBX",
        "Outbound SDR teams dialing at volume",
      ],
      typicalFeatures: [
        "Cloud phone / VoIP",
        "Call routing & IVR",
        "Power dialer",
        "CRM / CTI integrations",
        "Call recording",
        "Contact center queues",
      ],
    },
    types: [
      {
        id: "smb-voip",
        name: "SMB cloud VoIP",
        description: "Budget business phone with dialing and basic routing.",
        icon: "phone",
        href: "/use-cases/business-phone/",
        ctaLabel: "Explore SMB VoIP →",
      },
      {
        id: "crm-cti",
        name: "CRM-connected phone",
        description: "Mid-market CTI with deep CRM and helpdesk integrations.",
        icon: "link",
        href: "/use-cases/business-phone/",
        ctaLabel: "Explore CRM CTI phones →",
      },
      {
        id: "sales-dialer",
        name: "Sales dialer",
        description: "Power dialing and call logging for outbound teams.",
        icon: "phone-outgoing",
        href: "/use-cases/sales-calling/",
        ctaLabel: "Explore sales dialers →",
      },
      {
        id: "inbound-cc",
        name: "Inbound contact-center voice",
        description: "Cloud PBX and queues for inbound support voice.",
        icon: "headphones",
        href: "/use-cases/contact-center/",
        ctaLabel: "Explore inbound CC voice →",
      },
    ],
    tools: [
      {
        label: "BC Finder — voice vs chat",
        description: "Shortlist by voice-first job fit via the parent business communications finder.",
        href: "/tools/business-communications-finder/",
        ctaLabel: "Run BC Finder →",
      },
    ],
    finderHref: "/tools/business-communications-finder/",
    bestPageHref: "/best/voip-business-phone-software/",
    guides: [
      {
        slug: "what-is-voip-business-phone-software",
        title: "What is VoIP & business phone software?",
        href: "/guides/what-is-voip-business-phone-software/",
      },
      {
        slug: "how-to-choose-voip-business-phone-software",
        title: "How to choose VoIP & business phone software",
        href: "/guides/how-to-choose-voip-business-phone-software/",
      },
      {
        slug: "voip-business-phone-pricing-guide",
        title: "VoIP & business phone pricing guide",
        href: "/guides/voip-business-phone-pricing-guide/",
      },
      {
        slug: "voip-business-phone-vs-business-communications",
        title: "VoIP vs broader business communications software",
        href: "/guides/voip-business-phone-vs-business-communications/",
      },
    ],
  });
}
