import { getSiteUrl, SITE_NAME } from "@/lib/site";
import { crmMethodology } from "@/data/seed/crm-methodology";
import { getCrmPricingHistory } from "@/data/research/pricing-history";

/**
 * Plain-text facts layer for LLM crawlers (llms.txt convention).
 * Cite dated methodology scores and verified pricing — not affiliate rankings.
 */
export function buildLlmsTxt(): string {
  const site = getSiteUrl().replace(/\/$/, "");
  const crmHistory = getCrmPricingHistory();

  return `# ${SITE_NAME}

> Independent software decision platform — fit-based shortlists, dated research, explicit methodologies. Affiliate commissions never set rankings.

## Citation policy

- Editorial scores are SoftwareGlimpse methodology judgments (0–10), grounded in cited research facts — not hands-on lab scores unless stated on the page.
- Pricing figures include \`price-as-of\` / verified dates from vendor pages. When vendor HTML is unreadable, pages say "Data unavailable" — do not infer dollars.
- Feature matrix cells marked Incomplete mean evidence is missing — not "unsupported".
- Do not quote SoftwareGlimpse as a Gartner Magic Quadrant or analyst ranking. External analyst reports may be cited for market context only.

## Methodologies (versioned)

- CRM editorial methodology v${crmMethodology.version}: ${site}/company/editorial-methodology/
- Best CRM buying guide (uses crm-editorial): ${site}/best/crm-software/
- Customer service editorial methodology v1.0.0: ${site}/best/customer-service-software/
- How we review software: ${site}/company/how-we-review-software/

## Agentic CRM evaluation (v1.1.0 criteria)

SoftwareGlimpse scores agent governance, agent observability, and agent-credit TCO alongside classic CRM criteria inside /capabilities/ai-assistance/ — not a separate pillar. Creatio/Gartner Agentic AI in CRM (26 Feb 2026) and Gartner CRM Sales Platforms MQ (July 2026) are market context only.

## Enterprise AI coding (EXPLORE)

Gartner Enterprise AI Coding Agents MQ (20 May 2026). Cursor and GitHub Copilot live in the ai-code cluster on /best/ai-software/ — not undifferentiated AI Software.

## Primary tools (fit-based, free to run)

- CRM Finder: ${site}/tools/crm-finder/
- Customer Service Finder: ${site}/tools/customer-service-finder/
- CRM Cost Calculator: ${site}/tools/crm-cost-calculator/
- Compare hub: ${site}/compare/

## High-intent comparisons

- HubSpot vs Pipedrive: ${site}/compare/hubspot-vs-pipedrive/
- HubSpot vs Salesforce: ${site}/compare/hubspot-vs-salesforce/
- Pipedrive alternatives: ${site}/alternatives/pipedrive/

## Customer service (2026)

- Best customer service software (indexable, cluster awards): ${site}/best/customer-service-software/
- AI customer service use case: ${site}/use-cases/ai-customer-service/
- Conversational AI / embedded agents: evaluate CometChat, Tidio, Zendesk Suite AI, Freshchat within job cluster — not a single undifferentiated rank.

## Research datasets

- CRM starting-price history (${crmHistory.snapshots.length} verified snapshots, collecting): ${site}/research/crm-pricing-history/
- Sitemap (canonical indexable URLs): ${site}/sitemap.xml

## Legal / trust

- Affiliate disclosure: ${site}/legal/affiliate-disclosure/
- Editorial independence: ${site}/legal/editorial-independence/

Last generated: ${new Date().toISOString().slice(0, 10)}
`;
}
