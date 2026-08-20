import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Contact,
  Funnel,
  Handshake,
  LineChart,
  Lock,
  Mail,
  Settings2,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  Workflow,
  Zap,
} from "lucide-react";

/** Map known capability slugs to icons for the hub grid. */
export function iconForCapabilitySlug(slug: string): LucideIcon {
  if (slug === "email" || slug.includes("email")) return Mail;
  if (slug.includes("pipeline")) return Funnel;
  if (slug.includes("deal")) return Funnel;
  if (slug.includes("lead")) return Target;
  if (slug.includes("contact") || slug.includes("relationship")) return Contact;
  if (slug.includes("automation") || slug.includes("workflow")) return Workflow;
  if (slug.includes("engagement")) return Handshake;
  if (slug.includes("forecast")) return LineChart;
  if (slug.includes("report")) return BarChart3;
  if (slug.includes("custom")) return Settings2;
  if (slug.includes("integration")) return Zap;
  if (slug.includes("admin")) return Settings2;
  if (slug.includes("security")) return Shield;
  if (slug.includes("mobile")) return Smartphone;
  if (slug.includes("ai")) return Bot;
  if (slug.includes("lock")) return Lock;
  return Sparkles;
}

export function toneForCapabilitySlug(
  slug: string,
): "success" | "primary" | "warning" | "neutral" {
  if (slug.includes("pipeline") || slug.includes("deal")) return "success";
  if (slug.includes("automation") || slug.includes("engagement") || slug.includes("ai"))
    return "warning";
  if (slug.includes("security") || slug.includes("admin") || slug.includes("report"))
    return "primary";
  return "neutral";
}
