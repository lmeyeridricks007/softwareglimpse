import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildWebinarVirtualEventsCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "webinar-virtual-events",
    shortName: "Webinar & Virtual Events",
    displayName: "Webinar & Virtual Events Software",
    tagline:
      "Find webinar and virtual events software by job — live hosting, evergreen replays, virtual events, and live production.",
    definition:
      "Webinar and virtual events software helps teams register audiences, host live or simulive sessions, run multi-session virtual events, and produce multi-camera live streams. The right tool matches the primary job — not a single list that ranks WebinarJam against Livestorm or Switcher Studio as if they were the same purchase.",
    iconSlug: "webinar-virtual-events",
    decisionCriteria: [
      "Primary job fit",
      "Audience size & caps",
      "Simulive vs live",
      "Registration workflow",
      "CRM / MAP integrations",
      "Total cost (hosts + attendees)",
    ],
    popularNeeds: [
      "Live webinar hosting",
      "Evergreen webinars",
      "Virtual events",
      "Webinar registration",
      "Live stream production",
      "Webinar analytics",
    ],
    chooseGuideHref: "/guides/how-to-choose-webinar-virtual-events-software/",
    glance: {
      whatItDoes: [
        "Hosts live webinar rooms with registration pages",
        "Automates evergreen and simulive replay sessions",
        "Runs multi-session virtual events and stages",
        "Produces multi-camera live streams to destinations",
        "Syncs registrants and attendees to CRM or MAP",
        "Reports attendance, engagement, and conversions",
      ],
      bestFor: [
        "Marketing teams running demand-gen webinars",
        "Customer education and onboarding programs",
        "Event marketers hosting virtual conferences",
        "Creators producing polished live streams",
      ],
      typicalFeatures: [
        "Webinar hosting",
        "Evergreen automation",
        "Virtual event rooms",
        "Registration & reminders",
        "Live stream production",
        "Webinar analytics",
      ],
    },
    types: [
      {
        id: "live-host",
        name: "Live webinar hosting",
        description: "Registration, live rooms, polls, and follow-up.",
        icon: "video",
        href: "/use-cases/webinar-marketing/",
        ctaLabel: "Explore webinar hosts →",
      },
      {
        id: "evergreen",
        name: "Evergreen / simulive",
        description: "Automated replays on a schedule that mimic live.",
        icon: "repeat",
        href: "/use-cases/webinars-events/",
        ctaLabel: "Explore evergreen tools →",
      },
      {
        id: "virtual-events",
        name: "Virtual events",
        description: "Multi-session events, stages, and networking.",
        icon: "calendar",
        href: "/use-cases/virtual-events/",
        ctaLabel: "Explore event platforms →",
      },
      {
        id: "production",
        name: "Live production",
        description: "Multi-camera switching and multistream outputs.",
        icon: "layers",
        href: "/use-cases/live-streaming/",
        ctaLabel: "Explore production tools →",
      },
    ],
    tools: [
      {
        id: "finder",
        name: "Category finder",
        description: "Shortlist by audience size, integrations, and simulive vs live.",
        href: "/tools/webinar-virtual-events-finder/",
        icon: "search",
      },
      {
        id: "demo-checklist",
        name: "Demo checklist",
        description: "Build a webinar platform demo script before vendor calls.",
        href: "/tools/webinar-virtual-events-demo-checklist-builder/",
        icon: "checklist",
      },
    ],
    bestPageHref: "/best/webinar-virtual-events-software/",
    finderHref: "/tools/webinar-virtual-events-finder/",
    guides: [
      {
        slug: "what-is-webinar-virtual-events-software",
        title: "What is webinar & virtual events software?",
        href: "/guides/what-is-webinar-virtual-events-software/",
      },
      {
        slug: "how-to-choose-webinar-virtual-events-software",
        title: "How to choose webinar software",
        href: "/guides/how-to-choose-webinar-virtual-events-software/",
      },
      {
        slug: "webinar-virtual-events-pricing-guide",
        title: "Webinar software pricing guide",
        href: "/guides/webinar-virtual-events-pricing-guide/",
      },
    ],
  });
}
