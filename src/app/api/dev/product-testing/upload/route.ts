import { NextResponse } from "next/server";
import { assertTestingAccess } from "@/services/product-testing/access";
import {
  addSessionEvidence,
  loadTestSession,
} from "@/services/product-testing";
import { saveTestingScreenshot } from "@/services/product-testing/screenshots";

/**
 * Secure screenshot upload for the internal product-testing workspace.
 * Secret-gated · image magic-byte validated · size-capped · path-rooted.
 */
export async function POST(request: Request) {
  const denied = assertTestingAccess(request);
  if (denied) return denied;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const sessionId = String(form.get("sessionId") ?? "").trim();
  const taskIdRaw = form.get("taskId");
  const taskId =
    typeof taskIdRaw === "string" && taskIdRaw.trim()
      ? taskIdRaw.trim()
      : undefined;
  const publicFlag = String(form.get("public") ?? "true") === "true";
  const caption =
    typeof form.get("publicCaption") === "string"
      ? String(form.get("publicCaption")).trim()
      : undefined;
  const file = form.get("file");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }

  const session = loadTestSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  if (session.status === "completed") {
    return NextResponse.json(
      { error: "Completed sessions are immutable" },
      { status: 400 },
    );
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const saved = saveTestingScreenshot({
      productSlug: session.productSlug,
      sessionId: session.id,
      filename: file.name || "screenshot.png",
      bytes,
      declaredMime: file.type || null,
    });

    const evidence = addSessionEvidence({
      sessionId: session.id,
      taskId,
      kind: "SCREENSHOT",
      title: caption || `${session.productSlug} screenshot`,
      assetPath: saved.assetPath,
      public: publicFlag,
      publicCaption:
        caption ||
        `Screenshot captured during hands-on test of ${session.productSlug}`,
    });

    return NextResponse.json({
      evidence,
      assetPath: saved.assetPath,
      bytes: saved.bytes,
      mime: saved.mime,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 400 },
    );
  }
}
