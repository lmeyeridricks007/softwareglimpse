import { describe, expect, it } from "vitest";
import {
  ADOPTION_QUESTIONS,
  clusterScore,
  findingsFor,
  overallScore,
} from "./catalog";

describe("CRM adoption health scoring", () => {
  it("splits people vs system clusters without inventing a vendor rank", () => {
    expect(ADOPTION_QUESTIONS).toHaveLength(8);
    const answers = Object.fromEntries(
      ADOPTION_QUESTIONS.map((q) => [q.id, q.cluster === "people" ? "yes" : "no"]),
    );
    expect(clusterScore(answers, "people")).toBe(100);
    expect(clusterScore(answers, "system")).toBe(0);
    expect(overallScore(answers)).toBe(50);
    expect(findingsFor(answers).every((f) => f.id !== "daily-work")).toBe(true);
  });
});
