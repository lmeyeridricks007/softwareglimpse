import { NextResponse } from "next/server";
import { submitContactForm } from "@/services/contact";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const forwarded = request.headers.get("x-forwarded-for") ?? "anon";
  const rateKey = forwarded.split(",")[0]?.trim() || "anon";
  const result = await submitContactForm(body, rateKey);
  if (!result.ok) {
    const status = result.error.includes("Too many") ? 429 : 400;
    return NextResponse.json(result, { status });
  }
  return NextResponse.json(result);
}
