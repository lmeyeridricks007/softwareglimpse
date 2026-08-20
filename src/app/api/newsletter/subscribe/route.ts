import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/services/newsletter";
import { getSiteFoundationConfig } from "@/services/site-foundation/config";

export async function POST(request: Request) {
  const config = getSiteFoundationConfig();
  if (!config.newsletter.enabled) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Newsletter is not enabled. Configure a provider and set newsletter.enabled before accepting signups.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const result = await subscribeToNewsletter(body);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}
