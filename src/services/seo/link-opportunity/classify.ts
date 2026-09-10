import type { DigitalPrProspectType } from "./types";

/**
 * Classify a prospect domain/URL from available evidence only.
 * Does not invent journalist names or affiliations.
 */
export function classifyProspectType(input: {
  domain: string;
  url?: string;
  pathHints?: string[];
}): DigitalPrProspectType {
  const hay = `${input.domain} ${input.url ?? ""} ${(input.pathHints ?? []).join(" ")}`.toLowerCase();

  if (
    /\b(edu|ac\.uk|university|scholar|arxiv|jstor)\b/.test(hay) ||
    hay.endsWith(".edu")
  ) {
    return "ACADEMIC";
  }
  if (/\b(podcast|spotify\.com\/show|transistor\.fm|megaphone)\b/.test(hay)) {
    return "PODCAST";
  }
  if (
    /\b(substack|beehiiv|newsletter|mailchimp|convertkit)\b/.test(hay) ||
    /\/newsletter\b/.test(hay)
  ) {
    return "NEWSLETTER";
  }
  if (
    /\b(techcrunch|wired|verge|reuters|bloomberg|wsj|ft\.com|bbc)\b/.test(hay)
  ) {
    return "BUSINESS_PUBLICATION";
  }
  if (
    /\b(saas|producthunt|g2\.com|capterra|softwareadvice|getapp|martech|saasworthy)\b/.test(
      hay,
    )
  ) {
    return "SAAS_PUBLICATION";
  }
  if (
    /\b(forbes|entrepreneur|inc\.com|fastcompany|businessinsider|harvardbusiness)\b/.test(
      hay,
    )
  ) {
    return "BUSINESS_PUBLICATION";
  }
  if (
    /\b(journalist|byline|staff-writer|reporter)\b/.test(hay) ||
    /\/author\//.test(hay)
  ) {
    return "JOURNALIST";
  }
  if (
    /\b(consulting|consultancy|advisor|fractional)\b/.test(hay) ||
    /\.consulting\b/.test(hay)
  ) {
    return "CONSULTANT";
  }
  if (
    /\/(resources?|links|directory|awesome)\b/.test(hay) ||
    /\bresource[- ]page\b/.test(hay)
  ) {
    return "RESOURCE_PAGE";
  }
  if (
    /\b(statistics|stats|data|benchmark|report|study)\b/.test(hay) ||
    /\/research\//.test(hay)
  ) {
    return "DATA_CITATION";
  }
  if (/\b(blog|medium\.com|hashnode|dev\.to)\b/.test(hay)) {
    return "BLOG";
  }
  return "OTHER";
}

export function editorialLikelihoodForType(
  type: DigitalPrProspectType,
): number {
  switch (type) {
    case "JOURNALIST":
    case "DATA_CITATION":
      return 75;
    case "SAAS_PUBLICATION":
    case "BUSINESS_PUBLICATION":
      return 70;
    case "RESOURCE_PAGE":
    case "NEWSLETTER":
      return 65;
    case "ACADEMIC":
    case "PODCAST":
      return 55;
    case "CONSULTANT":
    case "BLOG":
      return 50;
    default:
      return 35;
  }
}
