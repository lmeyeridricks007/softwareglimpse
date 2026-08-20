import { NextResponse } from "next/server";
import type { AffiliateDestinationType, CommercialCtaIntent } from "@/domain";
import { resolveCommercialCta } from "@/services/affiliate/resolve-cta";
import { track } from "@/analytics/events";

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
 *
 * Examples:
 *   /go/pipedrive
 *   /go/pipedrive/trial
 *   /go/pipedrive/pricing
 */
export async function GET(request: Request, { params }: RouteParams) {
  const { product, destination } = await params;
  const url = new URL(request.url);

  // Hard reject open-redirect style query params.
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
      { status: 400 },
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
      destination_domain: (() => {
        try {
          return new URL(resolved.externalUrl!).hostname.replace(/^www\./, "");
        } catch {
          return null;
        }
      })(),
      via: "go-compat-redirect",
    },
  });

  return NextResponse.redirect(resolved.externalUrl, {
    status: 302,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
