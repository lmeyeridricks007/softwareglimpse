#!/usr/bin/env npx tsx
/**
 * Validate CRM pricing enrichment / rules.
 *
 * Usage:
 *   npm run pricing:validate
 */
import { listResearchProducts, loadEnrichment } from "@/data/research/store";
import { PricingSchema, type Pricing, type PricingPlan } from "@/domain";

type Issue = {
  severity: "error" | "warning";
  code: string;
  message: string;
};

function main() {
  const issues: Issue[] = [];
  const products = listResearchProducts();

  for (const productSlug of products) {
    const enrichment = loadEnrichment(productSlug);
    if (!enrichment?.pricing) {
      issues.push({
        severity: "warning",
        code: "no-pricing",
        message: `${productSlug}: no pricing enrichment`,
      });
      continue;
    }

    const parsed = PricingSchema.safeParse(enrichment.pricing);
    if (!parsed.success) {
      issues.push({
        severity: "error",
        code: "invalid-pricing-schema",
        message: `${productSlug}: ${parsed.error.message}`,
      });
      continue;
    }

    validatePricing(productSlug, parsed.data, issues);
  }

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  for (const issue of issues) {
    console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  }

  console.log("");
  console.log(
    `pricing:validate — ${errors.length} error(s), ${warnings.length} warning(s)`,
  );
  if (errors.length > 0) process.exit(1);
}

function validatePricing(
  productSlug: string,
  pricing: Pricing,
  issues: Issue[],
): void {
  if (pricing.currency && !/^[A-Z]{3}$/.test(pricing.currency)) {
    issues.push({
      severity: "error",
      code: "invalid-currency",
      message: `${productSlug}: invalid currency ${pricing.currency}`,
    });
  }

  const planSlugs = new Set<string>();
  for (const plan of pricing.plans) {
    if (planSlugs.has(plan.slug)) {
      issues.push({
        severity: "error",
        code: "duplicate-plan",
        message: `${productSlug}: duplicate plan slug ${plan.slug}`,
      });
    }
    planSlugs.add(plan.slug);
    validatePlan(productSlug, plan, issues);
  }
}

function validatePlan(
  productSlug: string,
  plan: PricingPlan,
  issues: Issue[],
): void {
  if (plan.rules.length === 0) {
    issues.push({
      severity: "warning",
      code: "empty-rules",
      message: `${productSlug}/${plan.slug}: empty rules${plan.contactSales ? " (contactSales)" : ""}`,
    });
  }

  for (const rule of plan.rules) {
    const amount =
      rule.kind === "per-seat"
        ? rule.amountPerSeat
        : rule.kind === "flat" || rule.kind === "addon" || rule.kind === "minimum"
          ? rule.amount
          : rule.kind === "per-unit" || rule.kind === "usage"
            ? rule.amountPerUnit
            : null;

    if (typeof amount === "number" && amount < 0) {
      issues.push({
        severity: "error",
        code: "negative-price",
        message: `${productSlug}/${plan.slug}: negative price`,
      });
    }

    if ("currency" in rule && rule.currency && !/^[A-Z]{3}$/.test(rule.currency)) {
      issues.push({
        severity: "error",
        code: "invalid-rule-currency",
        message: `${productSlug}/${plan.slug}: invalid rule currency`,
      });
    }

    if (
      (rule.kind === "per-seat" ||
        rule.kind === "flat" ||
        rule.kind === "per-unit") &&
      !rule.amountPeriod
    ) {
      issues.push({
        severity: "warning",
        code: "missing-amount-period",
        message: `${productSlug}/${plan.slug}: seat/flat/unit rule missing amountPeriod`,
      });
    }

    if (
      rule.kind === "per-seat" &&
      rule.amountPeriod === "month" &&
      rule.interval === "year"
    ) {
      // Expected pattern for annual billing of monthly-equivalent rates — OK
    } else if (
      rule.kind === "per-seat" &&
      rule.amountPeriod === "year" &&
      rule.interval === "month"
    ) {
      issues.push({
        severity: "warning",
        code: "annual-monthly-inconsistency",
        message: `${productSlug}/${plan.slug}: amountPeriod=year with interval=month is unusual`,
      });
    }
  }
}

main();
