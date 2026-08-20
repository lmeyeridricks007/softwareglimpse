import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Calculator,
  CheckCircle2,
  Database,
  Funnel,
  Handshake,
  Heart,
  Layers,
  ListChecks,
  Phone,
  Puzzle,
  Settings2,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  funnel: Funnel,
  zap: Zap,
  chart: BarChart3,
  puzzle: Puzzle,
  shield: Shield,
  handshake: Handshake,
  layers: Layers,
  trending: TrendingUp,
  database: Database,
  settings: Settings2,
  check: CheckCircle2,
  sparkles: Sparkles,
  target: Target,
  star: Star,
  calculator: Calculator,
  list: ListChecks,
  phone: Phone,
  heart: Heart,
};

export function resolveIndustryIcon(key?: string): LucideIcon {
  if (!key) return Layers;
  return ICONS[key.toLowerCase()] ?? Layers;
}

export { withSingleArrow } from "@/components/category/hub-icons";
