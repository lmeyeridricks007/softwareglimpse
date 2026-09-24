import { NextResponse } from "next/server";
import {
  recordAffiliateClick,
  sanitizeReferrerHost,
} from "@/services/analytics/affiliate-funnel/record-click";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * First-party affiliate click beacon.
 * Accepts JSON body or text/plain beacon payload.
 * Stores path/host only — no cookies, IP, or full referrer URLs.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    const ct = request.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      body = (await request.json()) as Record<string, unknown>;
    } else {
      const text = await request.text();
      body = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    }
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const productSlug = String(
    body.software_id ?? body.productSlug ?? body.slug ?? "",
  ).trim();
  if (!productSlug) {
    return NextResponse.json(
      { ok: false, error: "software_id_required" },
      { status: 400 },
    );
  }

  const referer = request.headers.get("referer");
  const event = recordAffiliateClick({
    productSlug,
    sourcePage:
      (body.page_path as string | undefined) ??
      (body.sourcePage as string | undefined) ??
      (referer ? new URL(referer).pathname : "/"),
    programId: (body.affiliate_program as string | null) ?? null,
    vendor: (body.vendor as string | null) ?? null,
    ctaLocation:
      (body.placement as string | undefined) ??
      (body.ctaLocation as string | undefined) ??
      "other",
    ctaType: body.is_affiliate === false ? "official_fallback" : "affiliate",
    destinationDomain:
      (body.destination_domain as string | null) ??
      (body.destinationDomain as string | null) ??
      null,
    destinationType:
      (body.destination_type as string | null) ??
      (body.destinationType as string | null) ??
      null,
    referrerHost:
      sanitizeReferrerHost(body.referrer_host as string | undefined) ??
      sanitizeReferrerHost(request.headers.get("referer")),
    trafficSource: (body.traffic_source as string | null) ?? null,
    captureChannel: "beacon",
  });

  return NextResponse.json(
    { ok: true, id: event.id, trackingId: event.trackingId ?? event.id },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

/** 204 with empty body is fine for sendBeacon; some clients prefer 200. */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
