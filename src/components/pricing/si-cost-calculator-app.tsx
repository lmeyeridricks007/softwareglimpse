"use client";

import { CostCalculatorApp } from "./cost-calculator-app";
import { SI_COST_CALCULATOR_CONFIG } from "./cost-calculator-config";
import type { PricingSnapshot } from "@/services/pricing";

type Props = {
  snapshots: PricingSnapshot[];
  resourceLinks?: Array<{ href: string; label: string }>;
  title?: string;
  description?: string;
};

/** Sales Intelligence cost calculator — reuses CostCalculatorApp with SI preset. */
export function SiCostCalculatorApp(props: Props) {
  return <CostCalculatorApp {...props} config={SI_COST_CALCULATOR_CONFIG} />;
}
