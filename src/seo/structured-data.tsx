import { SITE_NAME, getSiteUrl } from "@/lib/site";
import { canonicalUrl } from "@/lib/urls";
import type { BreadcrumbItem } from "./breadcrumbs";
import { buildBreadcrumbs } from "./breadcrumbs";

export type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${getSiteUrl()}/`,
  };
  return data;
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${getSiteUrl()}/`,
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLd {
  const crumbs = buildBreadcrumbs(items);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

/** WebPage JSON-LD for meaningful indexable tool / content landings. */
export function webPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  dateModified?: string | null;
}): JsonLd {
  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: canonicalUrl(input.path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${getSiteUrl()}/`,
    },
  };
  if (input.dateModified) {
    data.dateModified = input.dateModified;
  }
  return data;
}

/**
 * SoftwareApplication structured data.
 * Only include factual fields we actually have — never fabricate ratings/reviews.
 */
export function softwareApplicationJsonLd(input: {
  name: string;
  path: string;
  description?: string;
  url?: string;
  applicationCategory?: string;
  dateModified?: string | null;
  priceOffer?: {
    price: number;
    currency: string;
    priceAsOf: string;
    description?: string;
  } | null;
}): JsonLd {
  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    url: canonicalUrl(input.path),
  };

  if (input.description) data.description = input.description;
  if (input.url) data.sameAs = input.url;
  if (input.applicationCategory) {
    data.applicationCategory = input.applicationCategory;
  }
  if (input.dateModified) {
    data.dateModified = input.dateModified;
  }

  if (input.priceOffer && Number.isFinite(input.priceOffer.price)) {
    data.offers = {
      "@type": "Offer",
      price: String(input.priceOffer.price),
      priceCurrency: input.priceOffer.currency,
      url: canonicalUrl(input.path),
      description:
        input.priceOffer.description ??
        `Starting list price as of ${input.priceOffer.priceAsOf.slice(0, 10)} from vendor research.`,
      priceValidUntil: input.priceOffer.priceAsOf,
    };
  }

  return data;
}

/**
 * WebApplication structured data for interactive tools (calculators, builders).
 * Prefer over SoftwareApplication when the page hosts a free client-side app.
 */
export function webApplicationJsonLd(input: {
  name: string;
  description: string;
  path: string;
  applicationCategory?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: canonicalUrl(input.path),
    applicationCategory: input.applicationCategory ?? "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${getSiteUrl()}/`,
    },
  };
}

/**
 * FAQPage JSON-LD — only for concise, public Q&A already rendered on the page.
 * Do not invent answers solely for schema.
 */
export function faqPageJsonLd(
  items: Array<{ question: string; answer: string }>,
): JsonLd | null {
  const cleaned = items.filter(
    (item) => item.question.trim() && item.answer.trim(),
  );
  if (cleaned.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cleaned.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * VideoObject JSON-LD — only when required fields are known.
 * Never fabricate uploadDate, duration, thumbnail, or description.
 */
export function videoObjectJsonLd(input: {
  name: string;
  description?: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  durationSeconds?: number;
  contentUrl: string;
  embedUrl?: string;
}): JsonLd | null {
  if (!input.name.trim() || !input.contentUrl.trim()) return null;
  if (!input.thumbnailUrl?.trim()) return null;

  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: input.name,
    contentUrl: input.contentUrl,
    thumbnailUrl: input.thumbnailUrl,
  };

  if (input.description?.trim()) data.description = input.description.trim();
  if (input.uploadDate) data.uploadDate = input.uploadDate;
  const isoDuration = (() => {
    const seconds = input.durationSeconds;
    if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return null;
    const total = Math.floor(seconds);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    let out = "PT";
    if (h > 0) out += `${h}H`;
    if (m > 0) out += `${m}M`;
    if (s > 0 || (h === 0 && m === 0)) out += `${s}S`;
    return out;
  })();
  if (isoDuration) data.duration = isoDuration;
  if (input.embedUrl) data.embedUrl = input.embedUrl;

  return data;
}

export function JsonLdScript({ data }: { data: JsonLd | JsonLd[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
