import { describe, expect, it } from "vitest";
import { shouldCloseParkedContentWorkflow } from "./close-published";

describe("shouldCloseParkedContentWorkflow", () => {
  it("closes onboarding parked at editorial when the product is already published", () => {
    expect(
      shouldCloseParkedContentWorkflow({
        status: "review-required",
        workflowId: "software-onboarding-content",
        targetId: "aweber",
      }),
    ).toBe(true);
    expect(
      shouldCloseParkedContentWorkflow({
        status: "review-required",
        workflowId: "software-onboarding-content",
        targetId: "campaign-monitor",
      }),
    ).toBe(true);
  });

  it("does not close a running or completed workflow", () => {
    expect(
      shouldCloseParkedContentWorkflow({
        status: "running",
        workflowId: "software-onboarding-content",
        targetId: "aweber",
      }),
    ).toBe(false);
    expect(
      shouldCloseParkedContentWorkflow({
        status: "completed",
        workflowId: "software-onboarding-content",
        targetId: "aweber",
      }),
    ).toBe(false);
  });

  it("does not close category workflows or unknown targets", () => {
    expect(
      shouldCloseParkedContentWorkflow({
        status: "review-required",
        workflowId: "category-onboarding-content",
        targetId: "email-marketing",
      }),
    ).toBe(false);
    expect(
      shouldCloseParkedContentWorkflow({
        status: "review-required",
        workflowId: "software-onboarding-content",
        targetId: "not-a-real-product",
      }),
    ).toBe(false);
  });
});
