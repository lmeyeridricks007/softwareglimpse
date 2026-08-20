export const CRM_ADOPTION_HEALTH_VERSION = "crm-adoption-health-v1" as const;
export const CRM_ADOPTION_HEALTH_STORAGE_KEY = "sg-crm-adoption-health-v1";

export type AdoptionAnswer = "yes" | "partly" | "no";
export type AdoptionCluster = "people" | "system";

export type AdoptionQuestion = {
  id: string;
  cluster: AdoptionCluster;
  prompt: string;
  helpText: string;
  yesMeans: string;
  noMeans: string;
};

export const ADOPTION_QUESTIONS: AdoptionQuestion[] = [
  {
    id: "daily-work",
    cluster: "people",
    prompt: "Do sellers and managers work the live pipeline in the CRM every day?",
    helpText: "If weekly reviews still start from a spreadsheet export, mark No or Partly.",
    yesMeans: "The CRM is the system of record for open work.",
    noMeans: "Work happens elsewhere; the CRM is a filing cabinet.",
  },
  {
    id: "next-steps",
    cluster: "people",
    prompt: "Does every open deal have a dated next step owned by a named person?",
    helpText: "A filter for open deals with no next action should return a small, explainable set.",
    yesMeans: "Coaching and forecast conversations can start from the CRM.",
    noMeans: "Memory and side lists still run the pipeline.",
  },
  {
    id: "coaching",
    cluster: "people",
    prompt: "Do 1:1s and pipeline reviews run from CRM views rather than personal exports?",
    helpText: "Managers opening a CSV before the meeting is a Partly or No.",
    yesMeans: "The same board is used in the meeting that reps use all week.",
    noMeans: "The CRM is not trusted enough to run the ritual.",
  },
  {
    id: "seat-use",
    cluster: "people",
    prompt: "Are paid seats actually used by the people they were bought for?",
    helpText: "Idle licences and shared logins both count as unused.",
    yesMeans: "Seat spend matches active work.",
    noMeans: "Licence waste or shadow processes sit beside the CRM.",
  },
  {
    id: "completeness",
    cluster: "system",
    prompt: "Are required fields filled because they help the next person, not because a form blocks save?",
    helpText: "Junk values in required fields are Partly, not Yes.",
    yesMeans: "Data is complete enough to report without a cleanup sprint.",
    noMeans: "Reports need a human to interpret missing or dummy values.",
  },
  {
    id: "duplicates",
    cluster: "system",
    prompt: "Can you name who owns duplicate merge and stale-record cleanup, and when it last ran?",
    helpText: "If nobody can point to a last hygiene pass, mark No.",
    yesMeans: "Hygiene has an owner and a cadence.",
    noMeans: "Duplicates and stale owners quietly poison reporting.",
  },
  {
    id: "reporting",
    cluster: "system",
    prompt: "Are the reports used in weekly rituals built on CRM objects — not a parallel spreadsheet model?",
    helpText: "A dashboard nobody opens does not count.",
    yesMeans: "Decisions use the same objects reps update.",
    noMeans: "A second source of truth still wins the meeting.",
  },
  {
    id: "automation-owners",
    cluster: "system",
    prompt: "Does every active automation have a named owner and a reason it still exists?",
    helpText: "Orphan stage-triggered tasks that reps dismiss on sight are a No.",
    yesMeans: "Automation is inventory, not folklore.",
    noMeans: "Unowned rules train people to ignore the CRM.",
  },
];

export function pointsFor(answer: AdoptionAnswer | undefined): number {
  if (answer === "yes") return 100;
  if (answer === "partly") return 50;
  if (answer === "no") return 0;
  return 0;
}

export function clusterScore(
  answers: Partial<Record<string, AdoptionAnswer>>,
  cluster: AdoptionCluster,
): number {
  const items = ADOPTION_QUESTIONS.filter((q) => q.cluster === cluster);
  if (items.length === 0) return 0;
  const total = items.reduce((sum, q) => sum + pointsFor(answers[q.id]), 0);
  return Math.round(total / items.length);
}

export function overallScore(
  answers: Partial<Record<string, AdoptionAnswer>>,
): number {
  const people = clusterScore(answers, "people");
  const system = clusterScore(answers, "system");
  return Math.round((people + system) / 2);
}

export function findingsFor(
  answers: Partial<Record<string, AdoptionAnswer>>,
): Array<{ id: string; severity: "high" | "medium"; title: string; detail: string }> {
  const out: Array<{
    id: string;
    severity: "high" | "medium";
    title: string;
    detail: string;
  }> = [];
  for (const question of ADOPTION_QUESTIONS) {
    const answer = answers[question.id];
    if (answer === "yes" || !answer) continue;
    out.push({
      id: question.id,
      severity: answer === "no" ? "high" : "medium",
      title: question.prompt,
      detail: question.noMeans,
    });
  }
  return out;
}
