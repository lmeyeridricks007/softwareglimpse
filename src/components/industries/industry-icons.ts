import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Camera,
  Factory,
  GraduationCap,
  Heart,
  HeartHandshake,
  Hotel,
  Landmark,
  Laptop,
  Music,
  Scale,
  Shield,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Store,
  Sun,
  Truck,
  Home,
  Wrench,
  CalendarDays,
  Briefcase,
  Code2,
} from "lucide-react";

export function iconForIndustrySlug(slug: string): LucideIcon {
  if (slug.includes("small-business")) return Store;
  if (slug.includes("retail") || slug.includes("ecommerce")) return ShoppingBag;
  if (slug.includes("health")) return Stethoscope;
  if (slug.includes("financial") || slug.includes("finance") || slug.includes("private-equity") || slug.includes("venture") || slug.includes("investor"))
    return Landmark;
  if (slug.includes("manufactur") || slug.includes("construction") || slug.includes("engineering"))
    return Factory;
  if (slug.includes("real-estate")) return Home;
  if (slug.includes("education") || slug.includes("coaching")) return GraduationCap;
  if (slug.includes("saas") || slug.includes("tech") || slug.includes("web-design")) return Laptop;
  if (slug.includes("nonprofit") || slug.includes("non-profit"))
    return HeartHandshake;
  if (slug.includes("hospitality")) return Hotel;
  if (slug.includes("transport") || slug.includes("logistic")) return Truck;
  if (slug.includes("legal")) return Scale;
  if (slug.includes("plumbing")) return Wrench;
  if (slug.includes("solar")) return Sun;
  if (slug.includes("event")) return CalendarDays;
  if (slug.includes("photograph")) return Camera;
  if (slug.includes("music")) return Music;
  if (slug.includes("security")) return Shield;
  if (slug.includes("heart") || slug.includes("care")) return Heart;
  if (slug.includes("code")) return Code2;
  if (slug.includes("spark")) return Sparkles;
  if (slug.includes("brief")) return Briefcase;
  return Building2;
}

export function toneForIndustrySlug(
  slug: string,
): "success" | "primary" | "warning" | "neutral" | "danger" {
  if (slug.includes("retail") || slug.includes("real-estate") || slug.includes("transport") || slug.includes("solar") || slug.includes("music"))
    return "success";
  if (slug.includes("health") || slug.includes("education") || slug.includes("legal") || slug.includes("coaching") || slug.includes("photograph"))
    return "primary";
  if (slug.includes("manufactur") || slug.includes("hospitality") || slug.includes("construction") || slug.includes("plumbing") || slug.includes("engineering") || slug.includes("event"))
    return "warning";
  if (slug.includes("nonprofit") || slug.includes("security")) return "danger";
  return "neutral";
}
