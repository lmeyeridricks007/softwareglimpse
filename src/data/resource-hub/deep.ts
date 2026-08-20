import type { ResourceHubProfile } from "@/domain";
import { resourceDepthPartA } from "./deep-part-a";
import { resourceDepthPartB } from "./deep-part-b";
import { resourceDepthPartC } from "./deep-part-c";
import { resourceDepthPartD } from "./deep-part-d";

type Depth = Partial<Omit<ResourceHubProfile, "resourceSlug">>;

/**
 * Depth layers for CRM resource pages (`/resources/[slug]/`).
 * Educational / operational artifacts — no invented rankings or prices.
 */
export const resourceDepthBySlug: Record<string, Depth> = {
  ...resourceDepthPartA,
  ...resourceDepthPartB,
  ...resourceDepthPartC,
  ...resourceDepthPartD,
};
