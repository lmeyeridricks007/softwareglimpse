import { NextResponse } from "next/server";
import { assertTestingAccess } from "@/services/product-testing/access";
import {
  addSessionEvidence,
  abandonTestSession,
  blockTestSession,
  completeTestSession,
  createTestSession,
  listTestProtocols,
  listTestSessions,
  loadTestSession,
  resolveProtocolForProduct,
  startTestSession,
  updateTaskResult,
  updateTestSession,
} from "@/services/product-testing";
import { getSoftwareBySlug } from "@/data";
import type { TestTaskStatus } from "@/domain";

export async function GET(request: Request) {
  const denied = assertTestingAccess(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  if (sessionId) {
    const session = loadTestSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({ session });
  }

  return NextResponse.json({
    sessions: listTestSessions(),
    protocols: listTestProtocols().map((p) => ({
      slug: p.slug,
      name: p.name,
      categorySlug: p.categorySlug,
      version: p.version,
      taskCount: p.tasks.length,
    })),
  });
}

export async function POST(request: Request) {
  const denied = assertTestingAccess(request);
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = String(body.action ?? "");

  try {
    switch (action) {
      case "create": {
        const productSlug = String(body.productSlug ?? "");
        if (!productSlug) {
          return NextResponse.json(
            { error: "productSlug required" },
            { status: 400 },
          );
        }
        const software = getSoftwareBySlug(productSlug, {
          includeUnpublished: true,
        });
        if (!software) {
          return NextResponse.json(
            { error: "Unknown product" },
            { status: 404 },
          );
        }
        const protocol = resolveProtocolForProduct({
          categorySlug: software.primaryCategorySlug,
          protocolSlug:
            typeof body.protocolSlug === "string" ? body.protocolSlug : null,
        });
        const session = createTestSession({
          productSlug,
          productId: software.id,
          protocolSlug: protocol.slug,
          planTested:
            typeof body.planTested === "string" ? body.planTested : undefined,
          testEnvironment:
            typeof body.testEnvironment === "string"
              ? body.testEnvironment
              : undefined,
          testScenario:
            typeof body.testScenario === "string"
              ? body.testScenario
              : undefined,
        });
        return NextResponse.json({ session });
      }
      case "start": {
        const session = startTestSession(String(body.sessionId ?? ""));
        if (!session) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ session });
      }
      case "block": {
        const session = blockTestSession(
          String(body.sessionId ?? ""),
          typeof body.reason === "string" ? body.reason : undefined,
        );
        if (!session) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ session });
      }
      case "update": {
        const session = updateTestSession(String(body.sessionId ?? ""), {
          productVersion:
            typeof body.productVersion === "string"
              ? body.productVersion
              : undefined,
          planTested:
            typeof body.planTested === "string" ? body.planTested : undefined,
          testEnvironment:
            typeof body.testEnvironment === "string"
              ? body.testEnvironment
              : undefined,
          testScenario:
            typeof body.testScenario === "string"
              ? body.testScenario
              : undefined,
          notes: typeof body.notes === "string" ? body.notes : undefined,
          internalNotes:
            typeof body.internalNotes === "string"
              ? body.internalNotes
              : undefined,
          observations: Array.isArray(body.observations)
            ? body.observations.map(String)
            : undefined,
          issues: Array.isArray(body.issues)
            ? body.issues.map(String)
            : undefined,
          setupMinutes:
            typeof body.setupMinutes === "number"
              ? body.setupMinutes
              : undefined,
          pricingObserved:
            typeof body.pricingObserved === "string"
              ? body.pricingObserved
              : undefined,
          pricingVerifiedAt:
            typeof body.pricingVerifiedAt === "string"
              ? body.pricingVerifiedAt
              : undefined,
          finalAssessment:
            body.finalAssessment && typeof body.finalAssessment === "object"
              ? (body.finalAssessment as never)
              : undefined,
        });
        if (!session) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ session });
      }
      case "update-task": {
        const session = updateTaskResult(
          String(body.sessionId ?? ""),
          String(body.taskId ?? ""),
          {
            status: body.status as TestTaskStatus | undefined,
            notes: typeof body.notes === "string" ? body.notes : undefined,
            internalNotes:
              typeof body.internalNotes === "string"
                ? body.internalNotes
                : undefined,
            timeSpentMinutes:
              typeof body.timeSpentMinutes === "number"
                ? body.timeSpentMinutes
                : undefined,
            screenshotPaths: Array.isArray(body.screenshotPaths)
              ? body.screenshotPaths.map(String)
              : undefined,
          },
        );
        if (!session) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ session });
      }
      case "add-evidence": {
        const evidence = addSessionEvidence({
          sessionId: String(body.sessionId ?? ""),
          kind: body.kind as never,
          title: String(body.title ?? "Evidence"),
          summary:
            typeof body.summary === "string" ? body.summary : undefined,
          publicCaption:
            typeof body.publicCaption === "string"
              ? body.publicCaption
              : undefined,
          assetPath:
            typeof body.assetPath === "string" ? body.assetPath : undefined,
          taskId: typeof body.taskId === "string" ? body.taskId : undefined,
          minutes:
            typeof body.minutes === "number" ? body.minutes : undefined,
          public: body.public === true,
        });
        if (!evidence) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ evidence });
      }
      case "complete": {
        const session = completeTestSession(
          String(body.sessionId ?? ""),
          body.finalAssessment && typeof body.finalAssessment === "object"
            ? (body.finalAssessment as never)
            : undefined,
        );
        if (!session) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ session });
      }
      case "abandon": {
        const session = abandonTestSession(
          String(body.sessionId ?? ""),
          typeof body.reason === "string" ? body.reason : undefined,
        );
        if (!session) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ session });
      }
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Request failed",
      },
      { status: 400 },
    );
  }
}
