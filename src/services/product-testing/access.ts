import { NextResponse } from "next/server";

/**
 * Gate for /dev/product-testing APIs.
 * Prefers TESTING_SECRET, falls back to PREVIEW_SECRET (same as draft preview).
 * No secret configured → deny (never open the workspace in production by accident).
 */
export function assertTestingAccess(request: Request): NextResponse | null {
  const expected =
    process.env.TESTING_SECRET?.trim() ||
    process.env.PREVIEW_SECRET?.trim();

  if (!expected) {
    return NextResponse.json(
      {
        error:
          "TESTING_SECRET or PREVIEW_SECRET must be configured to use the product testing workspace",
      },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const header = request.headers.get("x-testing-secret");
  const token = header || searchParams.get("secret");
  if (token !== expected) {
    return NextResponse.json({ error: "Invalid testing secret" }, { status: 401 });
  }

  return null;
}

export function testingSecretConfigured(): boolean {
  return Boolean(
    process.env.TESTING_SECRET?.trim() || process.env.PREVIEW_SECRET?.trim(),
  );
}

export function getExpectedTestingSecret(): string | null {
  return (
    process.env.TESTING_SECRET?.trim() ||
    process.env.PREVIEW_SECRET?.trim() ||
    null
  );
}
