import { describe, expect, it } from "vitest";
import {
  getIndustryUseCaseProfile,
  listIndustryUseCaseParams,
} from "@/data/industry-use-case";
import {
  getIndustryUseCasePage,
  validateIndustryUseCasePage,
} from "@/services/industry-use-case";

describe("industry use-case pages", () => {
  it("registers advisory and complex-sales for financial-services", () => {
    const params = listIndustryUseCaseParams();
    expect(params).toEqual(
      expect.arrayContaining([
        {
          industrySlug: "financial-services",
          useCaseSlug: "advisory-relationship-management",
        },
        {
          industrySlug: "financial-services",
          useCaseSlug: "complex-sales-processes",
        },
      ]),
    );
  });

  it("builds advisory page as a decision brief from evidence", () => {
    const model = getIndustryUseCasePage(
      "financial-services",
      "advisory-relationship-management",
    );
    expect(model).not.toBeNull();
    expect(model!.displayTitle).toMatch(/Advisory/i);
    expect(model!.capabilities.length).toBeGreaterThanOrEqual(4);
    expect(model!.requirements.length).toBeGreaterThan(0);
    expect(model!.productRows.length).toBeGreaterThan(0);
    expect(model!.faq.length).toBeGreaterThan(0);
    expect(
      model!.productRows.every((p) =>
        ["Strong", "Good", "Limited", "Unknown"].includes(p.fitLabel),
      ),
    ).toBe(true);
    for (const row of model!.productRows) {
      for (const cell of Object.values(row.cells)) {
        expect(["supported", "partial", "unknown", "not-supported"]).toContain(
          cell,
        );
      }
    }
    const gate = validateIndustryUseCasePage(model);
    expect(gate.ok).toBe(true);
  });

  it("builds complex-sales page with materially different priorities", () => {
    const advisory = getIndustryUseCasePage(
      "financial-services",
      "advisory-relationship-management",
    );
    const complex = getIndustryUseCasePage(
      "financial-services",
      "complex-sales-processes",
    );
    expect(complex).not.toBeNull();
    expect(complex!.useCaseSlug).toBe("complex-sales-processes");

    const advisoryTop = advisory!.capabilities[0]?.capabilitySlug;
    const complexTop = complex!.capabilities[0]?.capabilitySlug;
    expect(advisoryTop).not.toBe(complexTop);

    const advisoryMust = new Set(
      advisory!.mustHaveRequirements.map((r) => r.id),
    );
    const complexMust = new Set(complex!.mustHaveRequirements.map((r) => r.id));
    const overlap = [...advisoryMust].filter((id) => complexMust.has(id));
    expect(overlap.length).toBeLessThan(advisoryMust.size);

    expect(complex!.scenarios[0]?.id).not.toBe(advisory!.scenarios[0]?.id);
  });

  it("returns null for unknown pairs", () => {
    expect(
      getIndustryUseCasePage("financial-services", "not-a-use-case"),
    ).toBeNull();
    expect(
      getIndustryUseCaseProfile("retail", "advisory-relationship-management"),
    ).toBeNull();
  });
});
