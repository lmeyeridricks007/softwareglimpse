import { formatMoney, type TCOComputeResult } from "@/domain";
import { deriveCostDrivers } from "./drivers";

/** Plain-text summary for clipboard / print. Includes source types. */
export function tcoToPlainText(result: TCOComputeResult): string {
  const lines: string[] = [];
  const s = result.scenario;
  lines.push("SoftwareGlimpse — CRM Total Cost of Ownership");
  lines.push(`Scenario: ${s.name}`);
  lines.push(`Ownership period: ${s.horizonYears} years`);
  lines.push(`Starting users: ${s.startingUsers}`);
  lines.push(`Billing: ${s.billingPreference}`);
  lines.push(`Currency: ${result.currency}`);
  lines.push("Tax: before tax (unless vendor list price includes tax)");
  lines.push("");
  lines.push("Assumptions:");
  for (const a of result.assumptions) {
    lines.push(`- ${a.label}: ${a.value}`);
  }
  if (result.currencyWarning) {
    lines.push("");
    lines.push(`Warning: ${result.currencyWarning}`);
  }
  lines.push("");

  for (const p of result.products) {
    lines.push(`=== ${p.productName} ===`);
    lines.push(
      `Known ${s.horizonYears}-year TCO: ${formatMoney({
        amountMinor: p.knownTcoMinor,
        currency: p.currency as "EUR",
      })}`,
    );
    if (p.qualifyingPlanName) {
      lines.push(`Minimum qualifying plan: ${p.qualifyingPlanName}`);
    }
    lines.push(`Software status: ${p.status}`);
    lines.push("Breakdown:");
    for (const c of p.categoryTotals) {
      if (c.amountMinor <= 0) continue;
      lines.push(
        `  ${c.category}: ${formatMoney({
          amountMinor: c.amountMinor,
          currency: p.currency as "EUR",
        })} [${c.sourceType}]`,
      );
    }
    if (p.unknownItems.length > 0) {
      lines.push("Unknown (not included in known TCO):");
      for (const u of p.unknownItems) {
        lines.push(`  - ${u.label} (${u.category})`);
      }
    }
    lines.push("Year-by-year known cost:");
    for (const y of p.yearly) {
      lines.push(
        `  Year ${y.year} (${y.users} users): ${formatMoney({
          amountMinor: y.knownTotalMinor,
          currency: p.currency as "EUR",
        })}`,
      );
    }
    const drivers = deriveCostDrivers(p);
    if (drivers.length) {
      lines.push("Cost drivers:");
      for (const d of drivers) {
        lines.push(
          `  ${d.rank}. ${d.label} — ${Math.round(d.share * 100)}%`,
        );
      }
    }
    lines.push("");
  }

  if (result.comparison.length > 1) {
    lines.push("Comparison (known costs, same currency only):");
    for (const c of result.comparison) {
      const delta =
        c.deltaVsLowestMinor === 0
          ? "lowest"
          : `+${formatMoney({
              amountMinor: c.deltaVsLowestMinor,
              currency: result.currency as "EUR",
            })}`;
      lines.push(
        `  ${c.productName}: ${formatMoney({
          amountMinor: c.knownTcoMinor,
          currency: result.currency as "EUR",
        })} (${delta})`,
      );
    }
    lines.push(
      "Cost comparison only — lowest known TCO is not necessarily the best product.",
    );
  }

  lines.push("");
  lines.push(
    "SoftwareGlimpse does not invent unpublished implementation, migration, or consultancy costs.",
  );
  lines.push("Affiliate relationships do not affect calculations or ordering.");
  return lines.join("\n");
}

export function tcoToCsv(result: TCOComputeResult): string {
  const rows: string[][] = [
    [
      "product",
      "year",
      "users",
      "category",
      "amount_minor",
      "currency",
      "source_type",
    ],
  ];
  for (const p of result.products) {
    for (const y of p.yearly) {
      for (const [category, amount] of Object.entries(y.byCategory)) {
        if (!amount) continue;
        rows.push([
          p.productId,
          String(y.year),
          String(y.users),
          category,
          String(amount),
          p.currency,
          p.categoryTotals.find((c) => c.category === category)?.sourceType ??
            "calculated",
        ]);
      }
    }
    for (const u of p.unknownItems) {
      rows.push([
        p.productId,
        "",
        "",
        u.category,
        "",
        p.currency,
        "unknown",
      ]);
    }
  }
  return rows.map((r) => r.map(csvEscape).join(",")).join("\n");
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}
