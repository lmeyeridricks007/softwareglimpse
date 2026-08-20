import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Building2,
  Calculator,
  ClipboardList,
  Funnel,
  GitCompare,
  Handshake,
  Layers,
  Phone,
  Star,
  Target,
  Users,
  UsersRound,
} from "lucide-react";
import {
  GUIDE_ICON_TONE_CLASSES,
  GUIDE_ICON_TONE_KEYS,
  type GuideIconToneKey,
} from "@/components/guides/guide-template";

const ICONS: Record<string, LucideIcon> = {
  star: Star,
  target: Target,
  compare: GitCompare,
  calculator: Calculator,
  book: BookOpen,
  funnel: Funnel,
  layers: Layers,
  clipboard: ClipboardList,
  checklist: ClipboardList,
  users: Users,
  usersround: UsersRound,
  handshake: Handshake,
  phone: Phone,
  building: Building2,
};

export function resolveHubIcon(key?: string): LucideIcon {
  if (!key) return Layers;
  return ICONS[key.toLowerCase()] ?? Layers;
}

/** Pastel icon chip tones aligned with the guide/mockup system. */
export const EXPLORE_TONE_CLASSES: Record<string, string> = {
  gold: GUIDE_ICON_TONE_CLASSES.amber,
  green: GUIDE_ICON_TONE_CLASSES.emerald,
  violet: GUIDE_ICON_TONE_CLASSES.violet,
  blue: GUIDE_ICON_TONE_CLASSES.blue,
  pink: GUIDE_ICON_TONE_CLASSES.fuchsia,
  teal: GUIDE_ICON_TONE_CLASSES.teal,
  amber: GUIDE_ICON_TONE_CLASSES.orange,
  sky: GUIDE_ICON_TONE_CLASSES.sky,
  orange: GUIDE_ICON_TONE_CLASSES.orange,
  fuchsia: GUIDE_ICON_TONE_CLASSES.fuchsia,
  emerald: GUIDE_ICON_TONE_CLASSES.emerald,
};

const HUB_TONE_CYCLE = GUIDE_ICON_TONE_KEYS;

export function hubToneClass(index: number): string {
  const key = HUB_TONE_CYCLE[index % HUB_TONE_CYCLE.length] as GuideIconToneKey;
  return GUIDE_ICON_TONE_CLASSES[key];
}

export function hubToneClassForSlug(slug: string, fallbackIndex = 0): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash + slug.charCodeAt(i) * (i + 1)) % HUB_TONE_CYCLE.length;
  }
  return hubToneClass(hash || fallbackIndex);
}

/** Normalize CTA labels to a single trailing arrow (no Lucide icon needed). */
export function withSingleArrow(label: string): string {
  return `${label.replace(/\s*→+\s*$/u, "").trimEnd()} →`;
}

export function withoutArrow(label: string): string {
  return label.replace(/\s*→+\s*$/u, "").trimEnd();
}
