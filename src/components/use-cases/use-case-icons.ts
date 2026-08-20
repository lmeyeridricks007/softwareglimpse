import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  Contact,
  Funnel,
  Handshake,
  Headset,
  LineChart,
  ListChecks,
  Mail,
  MapPinned,
  Sparkles,
  Target,
  Workflow,
  Zap,
} from "lucide-react";

/** Map known use-case slugs to icons for the hub grid. */
export function iconForUseCaseSlug(slug: string): LucideIcon {
  if (slug.includes("pipeline")) return Funnel;
  if (slug.includes("high-volume") || slug.includes("inbound")) return Target;
  if (slug.includes("outbound") || slug.includes("prospect")) return Target;
  if (slug.includes("lead")) return Target;
  if (slug.includes("account")) return Building2;
  if (slug.includes("field")) return MapPinned;
  if (slug.includes("forecast")) return LineChart;
  if (slug.includes("follow-up") || slug.includes("followup")) return ListChecks;
  if (slug.includes("complex")) return Workflow;
  if (slug.includes("contact") || slug.includes("relationship")) return Contact;
  if (slug.includes("automation")) return Workflow;
  if (slug.includes("email") || slug.includes("outreach")) return Mail;
  if (slug.includes("engagement")) return Handshake;
  if (slug.includes("report") || slug.includes("analytics")) return BarChart3;
  if (slug.includes("support") || slug.includes("service")) return Headset;
  if (slug.includes("sales")) return Zap;
  return Sparkles;
}

export function toneForUseCaseSlug(
  slug: string,
): "success" | "primary" | "warning" | "neutral" {
  if (slug.includes("pipeline") || slug.includes("upsell")) return "success";
  if (slug.includes("automation") || slug.includes("engagement"))
    return "warning";
  if (slug.includes("support") || slug.includes("report")) return "primary";
  return "neutral";
}
