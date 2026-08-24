import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildTimeAttendanceCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "time-attendance",
    shortName: "Time & Attendance",
    displayName: "Time & Attendance Software",
    tagline:
      "Clock-in, timesheets, shift scheduling, and attendance policies — distinct from core HRIS and ATS recruiting.",
    definition:
      "Time & attendance software captures clock-in/out, timesheets, attendance policies, shift scheduling, and GPS/geofence verification for hourly and frontline teams. The right tool matches the attendance job — pure time clock, full WFM suite, or HRIS time module — not a single list that ranks Jibble against Connecteam as undifferentiated peers. Shortlist via the parent HR Finder with the shift-scheduling dimension.",
    iconSlug: "time-attendance",
    decisionCriteria: [
      "Primary attendance job fit",
      "Shift scheduling need",
      "GPS / geofence clock-in requirements",
      "Mobile and frontline readiness",
      "HRIS / payroll integrations",
      "Per-user vs location pricing",
    ],
    popularNeeds: [
      "Employee clock-in / clock-out",
      "Timesheets and attendance policies",
      "Shift scheduling",
      "GPS / geofence verification",
      "Kiosk clock-in",
      "Overtime and break tracking",
    ],
    chooseGuideHref: "/guides/how-to-choose-time-attendance-software/",
    glance: {
      whatItDoes: [
        "Captures clock-in and clock-out events",
        "Manages timesheets and attendance policies",
        "Publishes shift schedules for hourly teams",
        "Verifies location with GPS or geofence",
        "Exports timesheets to payroll and HRIS",
        "Reports on attendance and overtime",
      ],
      bestFor: [
        "Hourly and frontline workforces",
        "Multi-site teams needing geofence clock-in",
        "Retail and hospitality shift scheduling",
        "Field teams tracking attendance on mobile",
      ],
      typicalFeatures: [
        "Time & attendance",
        "Workforce scheduling",
        "GPS / geofence clock-in",
        "Frontline communications",
        "Kiosk clock-in",
        "HRIS integrations",
      ],
    },
    types: [
      {
        id: "time-clock",
        name: "Time clock",
        description: "Clock-in, timesheets, and attendance policies for hourly teams.",
        icon: "clock",
        href: "/use-cases/time-attendance/",
        ctaLabel: "Explore time clocks →",
      },
      {
        id: "shift-scheduling",
        name: "Shift scheduling",
        description: "Shift planning, open shifts, and schedule publishing.",
        icon: "calendar",
        href: "/use-cases/workforce-scheduling/",
        ctaLabel: "Explore shift scheduling →",
      },
      {
        id: "geofence",
        name: "GPS / geofence",
        description: "Location-aware clock-in for field and multi-site teams.",
        icon: "map-pin",
        href: "/use-cases/time-attendance/",
        ctaLabel: "Explore geofence clock-in →",
      },
      {
        id: "frontline-wfm",
        name: "Frontline WFM suite",
        description: "Scheduling, comms, and attendance bundled for deskless ops.",
        icon: "smartphone",
        href: "/use-cases/frontline-ops/",
        ctaLabel: "Explore frontline WFM →",
      },
    ],
    tools: [
      {
        label: "HR Finder — shift scheduling",
        description:
          "Shortlist by time & attendance job fit via the parent HR finder with shift-scheduling dimension.",
        href: "/tools/hr-finder/",
        ctaLabel: "Run HR Finder →",
      },
    ],
    finderHref: "/tools/hr-finder/",
    bestPageHref: "/best/time-attendance-software/",
    guides: [
      {
        slug: "what-is-time-attendance-software",
        title: "What is time & attendance software?",
        href: "/guides/what-is-time-attendance-software/",
      },
      {
        slug: "how-to-choose-time-attendance-software",
        title: "How to choose time & attendance software",
        href: "/guides/how-to-choose-time-attendance-software/",
      },
      {
        slug: "time-attendance-pricing-guide",
        title: "Time & attendance pricing guide",
        href: "/guides/time-attendance-pricing-guide/",
      },
      {
        slug: "time-attendance-vs-hr-software",
        title: "Time & attendance vs broader HR software",
        href: "/guides/time-attendance-vs-hr-software/",
      },
    ],
  });
}
