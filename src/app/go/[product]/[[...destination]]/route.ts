import { NextResponse } from "next/server";
import type { AffiliateDestinationType, CommercialCtaIntent } from "@/domain";
import { resolveCommercialCta } from "@/services/affiliate/resolve-cta";
import { track } from "@/analytics/events";
import {
  recordAffiliateClick,
  sanitizeReferrerHost,
} from "@/services/analytics/affiliate-funnel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteParams = {
  params: Promise<{ product: string; destination?: string[] }>;
};

const DESTINATION_TYPES = new Set<string>([
  "homepage",
  "pricing",
  "signup",
  "trial",
  "demo",
  "contact-sales",
  "offer",
  "other",
  "official",
]);

/**
 * First-party affiliate redirect — backward compatibility only.
 * New page markup should link directly to resolveCommercialCta().externalUrl
 * via SoftwareCta / AffiliateLink. This route retains shared/indexed /go/ URLs.
 *
 * ONLY resolves against stored destinations — never accepts arbitrary URLs.
 */
export async function GET(request: Request, { params }: RouteParams) {
  const { product, destination } = await params;
  const url = new URL(request.url);

  if (url.searchParams.has("url") || url.searchParams.has("redirect")) {
    return NextResponse.json(
      { error: "Open redirects are not allowed" },
      { status: 400 },
    );
  }

  const destSegment = destination?.[0];
  if (destSegment && !DESTINATION_TYPES.has(destSegment)) {
    return NextResponse.json(
      { error: "Unknown destination type" },
      { status: 404 },
    );
  }

  const intentParam = url.searchParams.get("intent") as CommercialCtaIntent | null;
  const contextParam = url.searchParams.get("context") ?? "other";
  const location = url.searchParams.get("location") ?? "other";

  const preferred =
    destSegment && destSegment !== "official"
      ? (destSegment as AffiliateDestinationType)
      : undefined;

  const resolved = resolveCommercialCta({
    productSlug: product,
    context: contextParam as "other",
    intent: intentParam ?? undefined,
    preferredDestinationType: preferred,
    location: location as "other",
    campaign: url.searchParams.get("campaign") ?? undefined,
    subId: url.searchParams.get("subId") ?? undefined,
  });

  if (!resolved.available || !resolved.externalUrl) {
    return NextResponse.json(
      { error: "No destination configured", product },
      { status: 404 },
    );
  }

  const destinationDomain = (() => {
    try {
      return new URL(resolved.externalUrl!).hostname.replace(/^www\./, "");
    } catch {
      return null;
    }
  })();

  track({
    name: "affiliate_clicked",
    properties: {
      software_id: product,
      slug: product,
      location,
      isAffiliate: resolved.affiliate,
      destinationType: resolved.destination.type,
      promotionId: resolved.promotion?.id ?? null,
      context: contextParam,
      destination_domain: destinationDomain,
      via: "go-compat-redirect",
    },
  });

  try {
    recordAffiliateClick({
      productSlug: product,
      sourcePage: url.searchParams.get("from") ?? request.headers.get("referer"),
      programId: resolved.promotion?.id ?? null,
      ctaLocation: location,
      ctaType: resolved.affiliate ? "affiliate" : "official_fallback",
      destinationDomain,
      destinationType: resolved.destination.type,
      referrerHost: sanitizeReferrerHost(request.headers.get("referer")),
      captureChannel: "go_redirect",
    });
  } catch {
    // Never block redirect on analytics failure.
  }

  return NextResponse.redirect(resolved.externalUrl, {
    status: 302,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
