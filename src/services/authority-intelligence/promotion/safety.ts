import { COMMUNITY_UNSAFE_REJECT } from "./types";
import type { PromotionReject } from "./types";

/** Tactics this agent always rejects — community safety. */
export function communityUnsafeRejects(): PromotionReject[] {
  return [
    {
      id: "rej-driveby",
      tactic: "Drive-by self-promotion in communities",
      reason: COMMUNITY_UNSAFE_REJECT,
      notes:
        "Do not drop links without answering the discussion. Contribute first; links secondary.",
    },
    {
      id: "rej-auto-reddit",
      tactic: "Automated Reddit / forum posting",
      reason: COMMUNITY_UNSAFE_REJECT,
      notes: "No bots, schedulers, or mass identical posts across subs.",
    },
    {
      id: "rej-mass-forum",
      tactic: "Mass forum posting / cross-post spam",
      reason: COMMUNITY_UNSAFE_REJECT,
      notes: "One thoughtful contribution beats twenty identical threads.",
    },
    {
      id: "rej-fake-accounts",
      tactic: "Fake accounts for upvotes or testimonials",
      reason: COMMUNITY_UNSAFE_REJECT,
      notes: "Includes fake Product Hunt upvotes and sockpuppet comments.",
    },
    {
      id: "rej-fake-testimonials",
      tactic: "Fake testimonials / fabricated social proof",
      reason: COMMUNITY_UNSAFE_REJECT,
      notes: "Only real user quotes with permission.",
    },
    {
      id: "rej-everywhere",
      tactic: "Post every asset to every channel",
      reason: COMMUNITY_UNSAFE_REJECT,
      notes:
        "Channel fit required — e.g. CRM Evaluation Checklist is weak on generic consumer social.",
    },
  ];
}
