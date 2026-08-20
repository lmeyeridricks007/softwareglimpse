import type { z } from "zod";
import { IndustrySchema } from "@/domain";

type IndustryInput = z.input<typeof IndustrySchema>;

/**
 * Industry hubs for navigation.
 * All seeded industry hubs are indexable once hub profiles exist (CRM depth packs).
 */
const APPROVED_INDUSTRY_SLUGS = new Set([
  // Legacy vertical migrations
  "plumbing",
  "solar",
  "event-management",
  "private-equity",
  "venture-capital",
  "photography",
  "coaching",
  "investor-relations",
  "engineering",
  "music",
  "web-design",
  "security-companies",
  // Core industry hubs
  "small-business",
  "retail-ecommerce",
  "healthcare",
  "financial-services",
  "manufacturing",
  "real-estate",
  "education",
  "saas",
  "nonprofit",
  "hospitality",
  "transportation-logistics",
  "legal-services",
  "construction",
]);

function industry(
  slug: string,
  name: string,
  shortDescription: string,
): IndustryInput {
  const approved = APPROVED_INDUSTRY_SLUGS.has(slug);
  return {
    id: `ind-${slug}`,
    slug,
    name,
    shortDescription,
    description: shortDescription,
    metadata: {
      status: "published",
      publishedAt: "2026-08-16T00:00:00.000Z",
      reviewedAt: "2026-08-17T00:00:00.000Z",
      researchStatus: approved ? "complete" : "in-progress",
    },
    seo: {
      indexable: approved,
      canonicalPath: `/industries/${slug}/`,
      title: approved
        ? `Best CRM for ${name} | SoftwareGlimpse`
        : `${name} CRM software`,
      description: approved
        ? `${shortDescription} Compare catalogue CRM fit, workflows, and buying guidance.`
        : shortDescription,
    },
  };
}

/**
 * Industry hubs for navigation.
 * Approved hubs are indexable with complete research status.
 */
export const industriesSeed: IndustryInput[] = [
  industry(
    "small-business",
    "Small business",
    "Lean teams that need CRM without enterprise complexity.",
  ),
  industry(
    "retail-ecommerce",
    "Retail & e-commerce",
    "Customer, order, and loyalty workflows for online and storefront retail.",
  ),
  industry(
    "healthcare",
    "Healthcare",
    "Patient and provider relationship workflows with compliance sensitivity.",
  ),
  industry(
    "financial-services",
    "Financial services",
    "Client relationship and pipeline needs for finance teams.",
  ),
  industry(
    "manufacturing",
    "Manufacturing",
    "Account and opportunity tracking across longer B2B sales cycles.",
  ),
  industry(
    "real-estate",
    "Real estate",
    "Lead, listing, and client follow-up workflows for property teams.",
  ),
  industry(
    "education",
    "Education",
    "Enrollment, outreach, and relationship tracking for schools and programs.",
  ),
  industry(
    "saas",
    "SaaS",
    "Pipeline and expansion workflows for software and subscription businesses.",
  ),
  industry(
    "nonprofit",
    "Non-profit",
    "Donor, member, and constituent relationship tracking.",
  ),
  industry(
    "hospitality",
    "Hospitality",
    "Guest and account relationship needs for hospitality operators.",
  ),
  industry(
    "transportation-logistics",
    "Transportation & logistics",
    "Account management for carriers, brokers, and logistics providers.",
  ),
  industry(
    "legal-services",
    "Legal services",
    "Matter-adjacent client relationship and business development workflows.",
  ),
  industry(
    "construction",
    "Construction",
    "Project-linked account and bid pipeline tracking for builders and contractors.",
  ),
  industry(
    "plumbing",
    "Plumbing",
    "Job leads, estimates, and customer follow-up for plumbing contractors.",
  ),
  industry(
    "solar",
    "Solar",
    "Lead-to-install pipeline and customer communication for solar businesses.",
  ),
  industry(
    "event-management",
    "Event management",
    "Client pipelines and stakeholder follow-up for event planners and producers.",
  ),
  industry(
    "private-equity",
    "Private equity",
    "Relationship and deal-network CRM for private equity firms.",
  ),
  industry(
    "venture-capital",
    "Venture capital",
    "Relationship intelligence and pipeline tracking for venture capital teams.",
  ),
  industry(
    "photography",
    "Photography",
    "Client inquiries, bookings follow-up, and relationship history for photographers.",
  ),
  industry(
    "coaching",
    "Coaching",
    "Lead nurture and client relationship CRM for coaches and consultants.",
  ),
  industry(
    "investor-relations",
    "Investor relations",
    "Stakeholder relationship and outreach tracking for IR-oriented teams.",
  ),
  industry(
    "engineering",
    "Engineering",
    "Opportunity and account CRM for engineering and professional services firms.",
  ),
  industry(
    "music",
    "Music",
    "Fan, venue, and booking relationship tracking for musicians and managers.",
  ),
  industry(
    "web-design",
    "Web design",
    "Prospect pipeline and client handoffs for web designers and studios.",
  ),
  industry(
    "security-companies",
    "Security companies",
    "B2B sales pipeline and account management for security service companies.",
  ),
];
