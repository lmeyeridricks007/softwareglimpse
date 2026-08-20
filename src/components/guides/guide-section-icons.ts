import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Compass,
  Layers,
  Puzzle,
  Target,
  Users,
} from "lucide-react";
import {
  GUIDE_ICON_TONE_CLASSES,
  GUIDE_ICON_TONE_KEYS,
  type GuideIconToneKey,
} from "@/components/guides/guide-template";

/** @deprecated Prefer GUIDE_ICON_TONE_CLASSES — kept for call sites. */
export const GUIDE_ICON_TONES = GUIDE_ICON_TONE_KEYS.map(
  (key) => GUIDE_ICON_TONE_CLASSES[key],
);

export function toneKeyForGuideSection(
  id: string,
  index = 0,
): GuideIconToneKey {
  const key = id.toLowerCase();
  if (key.includes("goal") || key.includes("define") || key.includes("need"))
    return "blue";
  if (key.includes("feature") || key.includes("must")) return "teal";
  if (key.includes("size") || key.includes("integrat") || key.includes("puzzle"))
    return "violet";
  if (key.includes("price") || key.includes("cost") || key.includes("budget"))
    return "orange";
  if (key.includes("ease") || key.includes("usab") || key.includes("adoption"))
    return "fuchsia";
  if (key.includes("scale") || key.includes("grow")) return "emerald";
  if (key.includes("choose") || key.includes("decision") || key.includes("pick"))
    return "sky";
  return GUIDE_ICON_TONE_KEYS[index % GUIDE_ICON_TONE_KEYS.length]!;
}

export function toneForGuideSection(id: string, index = 0): string {
  return GUIDE_ICON_TONE_CLASSES[toneKeyForGuideSection(id, index)];
}

/** Icon for a supporting-article section — keyed by id keywords. */
export function iconForGuideSection(
  id: string,
  index = 0,
): LucideIcon {
  const key = id.toLowerCase();
  if (key.includes("goal") || key.includes("define")) return Target;
  if (key.includes("feature") || key.includes("must") || key.includes("need"))
    return ClipboardList;
  if (key.includes("integrat") || key.includes("puzzle")) return Puzzle;
  if (key.includes("price") || key.includes("cost") || key.includes("budget"))
    return CircleDollarSign;
  if (key.includes("ease") || key.includes("usab") || key.includes("adoption"))
    return Users;
  if (key.includes("scale") || key.includes("grow")) return Layers;
  if (key.includes("choose") || key.includes("decision") || key.includes("pick"))
    return CheckCircle2;
  if (key.includes("how") || key.includes("work") || key.includes("finder"))
    return Compass;

  const fallbacks = [
    Target,
    ClipboardList,
    Puzzle,
    CircleDollarSign,
    Users,
    Layers,
    CheckCircle2,
    Compass,
  ] as const;
  return fallbacks[index % fallbacks.length]!;
}
