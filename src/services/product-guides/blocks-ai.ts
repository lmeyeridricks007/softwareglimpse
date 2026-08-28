import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import type { ProductGuideContext } from "./context";
import type { CrmProductGuideKind } from "./kinds";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

type AiJob = {
  noun: string;
  loop: string;
  setupFirst: string;
  migrateObjects: string;
  prove: string;
  team: string;
  notPeer: string;
  categoryHowTo: string;
};

function joinList(items: readonly string[], max = 4): string {
  const picked = items.filter(Boolean).slice(0, max);
  if (picked.length === 0) return "";
  if (picked.length === 1) return picked[0] as string;
  if (picked.length === 2) return `${picked[0]} and ${picked[1]}`;
  return `${picked.slice(0, -1).join(", ")}, and ${picked[picked.length - 1]}`;
}

function clauses(items: readonly string[], max: number, sep = "; "): string {
  return items
    .slice(0, max)
    .map((line) => line.replace(/\s*[.;·]+$/u, ""))
    .join(sep);
}

function compact<T>(items: Array<T | null | undefined>): T[] {
  return items.filter((item): item is T => item != null);
}

function aiJob(ctx: ProductGuideContext): AiJob {
  const howTo = "how to choose AI software";
  switch (ctx.productSlug) {
    case "chatgpt":
      return {
        noun: "general-purpose LLM assistant",
        loop: "run one real work prompt, save it to a project or custom GPT, and prove a teammate can reuse it",
        setupFirst: "one workspace or team seat, one custom GPT or project, and a data-sharing policy you will actually keep",
        migrateObjects: "custom GPTs, projects, conversation history you must keep, and shared files",
        prove: "run a production prompt a manager can reopen without an admin screenshot",
        team: "Harbor Content (eight marketers using ChatGPT for briefs)",
        notPeer: "a meeting-notes bot, an image studio, or GitHub Copilot",
        categoryHowTo: howTo,
      };
    case "claude":
      return {
        noun: "reasoning-first LLM assistant",
        loop: "paste a long document, get a structured rewrite or analysis, and share it in a project",
        setupFirst: "one team workspace, one project with files, and a model you will actually buy",
        migrateObjects: "projects, knowledge files, and prompt libraries",
        prove: "a sceptic analyst finishes a document job in Claude without an admin",
        team: "Northline Research (policy analysts writing long-form)",
        notPeer: "an image generator or a coding IDE",
        categoryHowTo: howTo,
      };
    case "gemini":
      return {
        noun: "Google workspace LLM assistant",
        loop: "answer a work question with Gemini, ground it in Drive or Gmail if you buy that path, and share the result",
        setupFirst: "one Google account path, one grounded prompt, and a plan you will actually buy",
        migrateObjects: "Gems, saved prompts, and shared files",
        prove: "complete a grounded prompt a manager can reuse",
        team: "Harbor Ops (Google Workspace shop)",
        notPeer: "Microsoft 365 Copilot or a standalone image studio",
        categoryHowTo: howTo,
      };
    case "microsoft-copilot":
      return {
        noun: "Microsoft 365 workspace LLM add-on",
        loop: "draft in Word or summarize a Teams meeting from inside the Microsoft 365 apps you already pay for",
        setupFirst: "a qualifying Microsoft 365 base licence, Copilot seats for weekly users, and one in-app prompt a non-admin can run",
        migrateObjects: "Copilot agents, prompts, and tenant admin policies — not GitHub repos",
        prove: "a knowledge worker drafts in Word or Outlook with Copilot without an IT admin standing over them",
        team: "Harbor Corporate (M365 E3 shop adding Copilot seats)",
        notPeer: "GitHub Copilot (an AI coding plugin) or ChatGPT as a standalone chat tab",
        categoryHowTo: howTo,
      };
    case "perplexity":
      return {
        noun: "cited-search LLM assistant",
        loop: "ask a research question, inspect citations, and export an answer a sceptic will accept",
        setupFirst: "one Pro or Enterprise seat path, one Space or collection, and a citation-first prompt",
        migrateObjects: "Spaces, collections, and saved threads",
        prove: "a researcher produces a cited answer a manager can verify without an admin",
        team: "Northline Strategy (analysts who must show sources)",
        notPeer: "a coding IDE or a meeting-notes recorder",
        categoryHowTo: howTo,
      };
    case "github-copilot":
      return {
        noun: "AI coding plugin for IDEs and GitHub",
        loop: "accept an inline suggestion, run Copilot Chat on one file, and open a PR a reviewer can read",
        setupFirst: "Copilot seats (not GitHub source-control seats alone), one IDE install, and an org policy",
        migrateObjects: "Copilot settings, prompt files, and seat assignments — not git history",
        prove: "a developer ships a change with Copilot in their editor without a GitHub org admin",
        team: "Harbor Engineering (VS Code shop adding Copilot)",
        notPeer: "GitHub the source-control product, Microsoft 365 Copilot, or a standalone LLM chat tab",
        categoryHowTo: howTo,
      };
    case "cursor":
      return {
        noun: "AI-native code editor",
        loop: "open a repo in Cursor, complete an agent or chat edit, and show the diff a reviewer can accept",
        setupFirst: "one team or Pro plan, one repo opened in Cursor, and usage credits you will actually buy",
        migrateObjects: "rules, memories, and project settings — not git remotes",
        prove: "a developer completes an in-editor agent task without an admin",
        team: "Northline Product (small product-engineering team)",
        notPeer: "GitHub Copilot as a plugin-only add-on, or ChatGPT in a browser tab",
        categoryHowTo: howTo,
      };
    case "midjourney":
      return {
        noun: "AI image generation",
        loop: "run a production prompt, iterate a variation, and export an asset brand can use",
        setupFirst: "one paid plan (no free), one Discord or web workflow, and a style you will actually reuse",
        migrateObjects: "prompt libraries, style references, and selected outputs",
        prove: "a designer produces a usable still a marketer can download without an admin",
        team: "Harbor Brand (campaign stills)",
        notPeer: "a general LLM chat or a meeting-notes tool",
        categoryHowTo: howTo,
      };
    case "adobe-firefly":
      return {
        noun: "Adobe generative image inside Creative Cloud",
        loop: "generate or generative-fill one asset in Firefly or Photoshop and hand it to brand",
        setupFirst: "Firefly credits or a Creative Cloud path you will buy, one production prompt, and a license story you can tell legal",
        migrateObjects: "Firefly generations, libraries, and credit packs",
        prove: "a designer completes generative fill a brand manager can approve",
        team: "Harbor Creative (Adobe shop)",
        notPeer: "Midjourney as a Discord-native stills tool or ChatGPT",
        categoryHowTo: howTo,
      };
    case "runway":
      return {
        noun: "generative video studio",
        loop: "generate a short clip from a prompt or image, iterate, and export a cut marketing can use",
        setupFirst: "one editor seat, credits you will actually burn, and one Gen model you will buy",
        migrateObjects: "projects, assets, and credit balances",
        prove: "an editor exports a short clip without an admin",
        team: "Harbor Video (social clips)",
        notPeer: "a stills-only image model or an LLM chatbot",
        categoryHowTo: howTo,
      };
    case "otter-ai":
      return {
        noun: "AI meeting notes and transcription",
        loop: "record or join one meeting, produce a transcript with action items, and share it with a sceptic attendee",
        setupFirst: "one workspace, calendar or Meet or Teams connector, and a recording policy",
        migrateObjects: "conversations, workspaces, and speaker labels",
        prove: "finish a meeting with searchable notes a manager can open without Otter admin help",
        team: "Harbor Sales (discovery calls)",
        notPeer: "ChatGPT as a general chatbot or Microsoft 365 Copilot as a full workspace LLM",
        categoryHowTo: howTo,
      };
    case "quillbot":
      return {
        noun: "AI paraphrasing and writing assist",
        loop: "paste a draft, paraphrase or grammar-check it, and export text a reviewer will accept",
        setupFirst: "one Premium path if you need the word limit, one tone, and a plagiarism check if you will buy it",
        migrateObjects: "saved paraphrases and extension settings",
        prove: "a writer paraphrases a paragraph a manager can paste into the CMS",
        team: "Harbor Content (blog team)",
        notPeer: "a general LLM assistant or a voice studio",
        categoryHowTo: howTo,
      };
    case "elevenlabs":
      return {
        noun: "AI voice and text-to-speech",
        loop: "generate one production line with a voice you will keep, download it, and play it for a sceptic",
        setupFirst: "one credit pack, one voice, and a commercial-use path you will actually buy",
        migrateObjects: "voices, projects, and credit history",
        prove: "a producer exports a clean line without an admin",
        team: "Harbor Audio (product videos)",
        notPeer: "an LLM chatbot or a meeting transcriber",
        categoryHowTo: howTo,
      };
    case "gamma":
      return {
        noun: "AI presentation generation",
        loop: "prompt a deck, edit three cards, and share a link a stakeholder can comment on",
        setupFirst: "one workspace, one brand kit if you buy it, and a deck you will actually present",
        migrateObjects: "gammas, brand kits, and themes",
        prove: "a marketer generates and shares a deck without an admin",
        team: "Harbor Growth (weekly updates)",
        notPeer: "a full LLM assistant or a video studio",
        categoryHowTo: howTo,
      };
    case "synthesia":
      return {
        noun: "AI avatar video",
        loop: "script one avatar clip, generate it, and export a video L&D can publish",
        setupFirst: "one seat, one avatar, and minutes you will actually buy",
        migrateObjects: "templates, avatars, and video projects",
        prove: "an L&D producer exports a short avatar video without an admin",
        team: "Northline L&D (product explainers)",
        notPeer: "Runway generative video or a stills model",
        categoryHowTo: howTo,
      };
    case "fireflies":
      return {
        noun: "AI meeting notes",
        loop: "capture one meeting, produce notes and action items, and push them to the CRM or docs you use",
        setupFirst: "one workspace, calendar connector, and a storage policy",
        migrateObjects: "meetings, channels, and integrations",
        prove: "a seller gets notes from a call without an admin",
        team: "Harbor Sales (outbound calls)",
        notPeer: "ChatGPT or a general LLM tab",
        categoryHowTo: howTo,
      };
    case "hynote":
      return {
        noun: "AI note taker for meetings, audio, and documents",
        loop: "record or upload one meeting, PDF, or YouTube link, get a transcript plus summary and action items, and export to Docs or Notion",
        setupFirst: "one free or Pro workspace, a capture path (live record or upload), and an export destination you already use",
        migrateObjects: "notes, folders, tags, and exported summaries",
        prove: "finish one multimodal capture with searchable notes a teammate can open without an admin",
        team: "Harbor Ops (weekly standups and study notes)",
        notPeer: "Fireflies-style calendar auto-join bots or a general LLM chatbot",
        categoryHowTo: howTo,
      };
    default:
      return {
        noun: "AI assistant for a specific job cluster",
        loop: "complete one real job (prompt → output → share) a non-admin can repeat",
        setupFirst: "seats or credits for weekly users, one core workflow, and a data policy",
        migrateObjects: "projects, prompts, and files you must keep",
        prove: "complete the core job without an admin",
        team: "Harbor Ops (weekly AI users)",
        notPeer: "a different AI job cluster",
        categoryHowTo: howTo,
      };
  }
}

function featurePhrase(ctx: ProductGuideContext): string {
  if (ctx.supportedFeatureLabels.length === 0) {
    return aiJob(ctx).setupFirst;
  }
  return joinList(ctx.supportedFeatureLabels, 4);
}

function coreLoopPhrase(ctx: ProductGuideContext): string {
  if (ctx.coreLoopLabels.length === 0) return aiJob(ctx).loop;
  return joinList(ctx.coreLoopLabels, 4);
}

function planPhrase(ctx: ProductGuideContext): string {
  if (!ctx.hasPlanMatrix) {
    return "usage / hub / contact-sales packaging (no public plan matrix in our snapshot)";
  }
  return ctx.planNames.join(", ");
}

function bestForPhrase(ctx: ProductGuideContext): string {
  if (ctx.bestFor.length === 0) {
    return `teams whose primary job is ${aiJob(ctx).noun}`;
  }
  return clauses(ctx.bestFor, 4);
}

function notIdealPhrase(ctx: ProductGuideContext): string {
  if (ctx.notIdealFor.length === 0) {
    return `teams whose blocking job is ${aiJob(ctx).notPeer}`;
  }
  return clauses(ctx.notIdealFor, 4);
}

function gatedHintSentence(ctx: ProductGuideContext): string {
  if (ctx.gatedFeatureHints.length === 0) {
    return `Our research does not flag plan-gated capabilities for ${ctx.productName}, but confirm your must-haves — including seats, credits, and add-ons — against the packaging you actually intend to buy.`;
  }
  return `Plan-gated in research: ${ctx.gatedFeatureHints.slice(0, 4).join("; ")}.`;
}

function quickGateHint(ctx: ProductGuideContext): string {
  const top = ctx.gatedFeatures.slice(0, 2);
  if (top.length === 0) return "";
  const phrase = (f: (typeof top)[number]) => {
    const plan = f.planNames[0] ?? null;
    return plan ? `${f.label} (${plan}+)` : f.label;
  };
  if (top.length === 1) {
    return ` Confirm ${phrase(top[0]!)} is on the package you will actually buy.`;
  }
  return ` Confirm ${phrase(top[0]!)} and ${phrase(top[1]!)} are on the package you will actually buy.`;
}

function trialSentence(ctx: ProductGuideContext): string {
  if (ctx.trialDays != null) {
    const where =
      ctx.trialPlanNames.length > 0
        ? ` on ${joinList(ctx.trialPlanNames, 3)}`
        : "";
    return `Our pricing snapshot records a ${ctx.trialDays}-day trial${where} — confirm current terms on the ${ctx.productName} pricing page before you build a schedule around it.`;
  }
  if (ctx.trialPlanNames.length > 0) {
    return `Our snapshot flags a trial on ${joinList(ctx.trialPlanNames, 3)} without a published length — confirm the window on the ${ctx.productName} pricing page.`;
  }
  if (ctx.freePlanNames.length > 0) {
    return `Our snapshot records no trial length for ${ctx.productName}, so ${joinList(ctx.freePlanNames, 2)} is your proving ground.`;
  }
  return `Our snapshot records no trial length for ${ctx.productName} — ask for an evaluation window in writing before you commit seats.`;
}

function integrationSentence(ctx: ProductGuideContext): string {
  if (ctx.integrationNames.length === 0) {
    return `Our research does not name specific ${ctx.productName} integrations, so verify SSO, workspace, and file connectors in the vendor directory before go-live.`;
  }
  return `Research names ${joinList(ctx.integrationNames, 5)} on the ${ctx.productName} side — confirm the connectors your AI loop depends on.`;
}

function aiSentence(ctx: ProductGuideContext): string {
  if (!ctx.hasAi) {
    return `Our research does not list AI capabilities for ${ctx.productName}, so plan the rollout on the core ${aiJob(ctx).noun} loop rather than assistance features.`;
  }
  const gate =
    ctx.aiPlanNames.length > 0
      ? ` Research places AI assistance on ${joinList(ctx.aiPlanNames, 4)}.`
      : "";
  const labels =
    ctx.aiCapabilityLabels.length > 0
      ? `Research lists ${joinList(ctx.aiCapabilityLabels, 4)} for ${ctx.productName}.`
      : `${ctx.productName} research mentions AI assistance without naming capabilities.`;
  return `${labels}${gate}`;
}

function positioningSentence(ctx: ProductGuideContext): string {
  if (ctx.shortDescription) return ctx.shortDescription;
  if (ctx.vendorClaim) return `Vendor positioning: ${ctx.vendorClaim}`;
  return `${ctx.productName} is evaluated here as ${aiJob(ctx).noun} tooling — not a peer for every AI job cluster.`;
}

function planSoftener(ctx: ProductGuideContext): string {
  if (ctx.hasPlanMatrix) return `Researched plans: ${planPhrase(ctx)}.`;
  return `${ctx.productName} is often sold on seats, credits, usage packs, or quote packaging in our snapshot — treat homepage tiles as marketing, not a bill of materials. Confirm live packaging on the pricing page.`;
}

function pricingPointer(ctx: ProductGuideContext): string {
  return `Never invent list prices here — confirm seats, credits, and quote terms on ${ctx.pricingHref}.`;
}

function limitationLines(ctx: ProductGuideContext): string[] {
  const merged = [...ctx.reviewLimitations, ...ctx.enrichmentLimitations];
  const out: string[] = [];
  for (const line of merged) {
    if (!out.includes(line)) out.push(line);
  }
  return out;
}

function diagramFigure(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
  caption: string,
) {
  return {
    src: ctx.figureSrc(kind),
    alt: `${ctx.productName} ${kind} teaching diagram.`,
    caption,
  };
}

function researchCallout(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput | null {
  const lines = limitationLines(ctx);
  if (lines.length === 0) return null;
  const framing: Record<CrmProductGuideKind, string> = {
    setup: "Design day-zero configuration around these before you invite the whole team.",
    implementation: "Sequence your 30/60/90 plan around these constraints.",
    migration: "Check these before you promise a cutover date.",
    plans: "Weigh these when you pick seats, credits, and a qualifying tier.",
    "worth-it": "These are the tradeoffs your buy decision has to accept.",
  };
  return {
    type: "callout",
    id: "research-watchouts",
    title: `What research flags about ${ctx.productName}`,
    body: `${clauses(lines, 4, " · ")}. ${framing[kind]}`,
    tone: "warning",
  };
}

function relatedLinks(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput {
  const siblings = (
    [
      ["setup", "Setup guide"],
      ["implementation", "Implementation guide"],
      ["migration", "Migration guide"],
      ["plans", "Plans / seats vs credits"],
      ["worth-it", "Worth it?"],
    ] as const
  )
    .filter(([k]) => k !== kind)
    .map(([k, label]) => ({
      href: `/guides/${ctx.siblingSlugs[k]}/`,
      label: `${ctx.productName} ${label}`,
      description: `Continue the ${ctx.productName} path.`,
    }));

  return {
    type: "related-content",
    id: "related",
    title: `Related ${ctx.productName} resources`,
    links: [
      {
        href: ctx.reviewHref,
        label: `${ctx.productName} review`,
        description: "Product hub and verdict.",
      },
      {
        href: ctx.pricingHref,
        label: `${ctx.productName} pricing`,
        description: "Researched plans, seats/credits, and sources.",
      },
      ...siblings,
      {
        href: "/guides/how-to-choose-ai-software/",
        label: "How to choose AI software",
        description: "Category selection framework by job cluster.",
      },
      {
        href: "/best/ai-software/",
        label: "Best AI software",
        description: "Editor’s picks by job cluster — not one ranking.",
      },
      {
        href: "/categories/ai/",
        label: "AI software category",
        description: "Browse the category hub.",
      },
    ],
  };
}

function interactiveCta(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput {
  if (kind === "plans") {
    return {
      type: "interactive-cta",
      id: "pricing-cta",
      title: `Confirm ${ctx.productName} packaging on the pricing page`,
      body: `AI tools often mix seats, credits, usage packs, and quote terms. Use the researched pricing page — do not invent totals in a spreadsheet.`,
      href: ctx.pricingHref,
      ctaLabel: `Open ${ctx.productName} pricing →`,
      variant: "calculator",
    };
  }
  if (kind === "worth-it") {
    return {
      type: "interactive-cta",
      id: "choose-cta",
      title: "Still unsure? Use the category framework",
      body: `If ${ctx.productName} is close but not obvious, read how to choose AI software and compare finalists inside the same job cluster — no affiliate-ordered rankings.`,
      href: "/guides/how-to-choose-ai-software/",
      ctaLabel: "How to choose →",
      variant: "generic",
    };
  }
  return {
    type: "interactive-cta",
    id: "review-cta",
    title: "Read the product hub next",
    body: `Freeze must vs nice for ${ctx.productName}, then follow setup and implementation gates from the review hub.`,
    href: ctx.reviewHref,
    ctaLabel: `Open ${ctx.productName} review →`,
    variant: "generic",
  };
}

function mustNiceMatrix(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
  rows: Array<{
    feature: string;
    mustHave: boolean;
    niceToHave: boolean;
    notes: string;
  }>,
): GuideBlockInput {
  return {
    type: "feature-matrix",
    id: `${kind}-must-nice`,
    title: `${ctx.productName} must vs nice`,
    rows,
  };
}

function phaseChecklist(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
  items: Array<{ id: string; label: string; description: string }>,
): GuideBlockInput {
  return {
    type: "checklist",
    id: `${kind}-checklist`,
    title: `${ctx.productName} checklist`,
    copyable: true,
    items,
  };
}

function startPlan(ctx: ProductGuideContext): string {
  return (
    ctx.freePlanNames[0] ??
    ctx.entryPlanName ??
    "the entry package on the pricing page"
  );
}

function buildAiSetupBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = aiJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Set up ${name} in this order: qualify seats for the people who will actually open it, name one AI/ops owner, configure ${job.setupFirst}, connect the SSO/workspace/files you depend on, then have a non-admin run ${job.prove}.${quickGateHint(ctx)} You’re done when that walkthrough works — not when every optional add-on is switched on.`,
      bullets: [
        `Start on ${startPlan(ctx)}`,
        "Name one AI / ops owner",
        job.setupFirst,
        "Connect required SSO / workspace / files",
        "Prove a non-admin can run the loop",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `What matters in your ${name} setup`,
      items: [
        {
          label: `What ${name} actually is`,
          body: positioningSentence(ctx),
        },
        {
          label: "Configure these first",
          body: `Research lists ${featurePhrase(ctx)} as supported — that is your day-zero surface.`,
        },
        {
          label: "Do not treat it as every AI job",
          body: `${name} is ${job.noun}. It is not a substitute for ${job.notPeer}.`,
        },
        {
          label: "Prove with a real workflow",
          body: `Worked example: ${job.team} is done when they can ${job.prove} — not after a vendor tour.`,
        },
      ],
    },
    {
      type: "figure",
      id: "setup-diagram",
      title: `${name} day-zero path`,
      src: ctx.figureSrc("setup"),
      alt: `${name} setup walkthrough for ${job.noun}.`,
      caption: `A working ${name} core loop beats a decorated empty workspace.`,
    },
    mustNiceMatrix(ctx, "setup", [
      {
        feature: "Core job loop",
        mustHave: true,
        niceToHave: false,
        notes: job.loop,
      },
      {
        feature: "Plan / hub gates",
        mustHave: true,
        niceToHave: false,
        notes: gatedHintSentence(ctx),
      },
      {
        feature: "Integrations",
        mustHave: true,
        niceToHave: false,
        notes: integrationSentence(ctx),
      },
      {
        feature: "AI extras",
        mustHave: false,
        niceToHave: true,
        notes: aiSentence(ctx),
      },
    ]),
    {
      type: "step",
      stepNumber: 1,
      id: "qualify-seats",
      heading: "Qualify seats and packaging",
      body: `${planSoftener(ctx)}\n\n${pricingPointer(ctx)}\n\nWorked example: ${job.team} lists everyone who must log in weekly before they invite “the whole company.”`,
      tip: "Homepage tiles are not a bill of materials.",
    },
    {
      type: "step",
      stepNumber: 2,
      id: "configure-loop",
      heading: "Configure one core loop",
      body: `Configure ${job.setupFirst}. Research-supported surfaces include ${coreLoopPhrase(ctx)}.\n\nWorked example: ${job.team} refuses optional modules until ${job.prove}.`,
      tip: "One loop in production beats five unused add-ons.",
    },
    {
      type: "step",
      stepNumber: 3,
      id: "non-admin-proof",
      heading: "Non-admin proof",
      body: `${trialSentence(ctx)}\n\nSuccess: ${job.prove}.\n\nWorked example: ${job.team} records a 10-minute loom of the walkthrough for stakeholders who skip hands-on time.`,
      tip: "If only an admin can complete the loop, setup is not finished.",
    },
    phaseChecklist(ctx, "setup", [
      {
        id: "owner",
        label: "Name an AI/ops owner",
        description: "Fields, users, and hygiene need a responsible party.",
      },
      {
        id: "loop",
        label: "Configure one core loop",
        description: job.setupFirst,
      },
      {
        id: "proof",
        label: "Complete non-admin proof",
        description: job.prove,
      },
    ]),
    researchCallout(ctx, "setup"),
    {
      type: "faq",
      id: "setup-faq",
      title: `${name} setup FAQ`,
      items: [
        {
          question: "When is setup actually done?",
          answer: `When a non-admin can ${job.prove} on the package you will buy.`,
        },
        {
          question: `Should we turn on every ${name} hub on day one?`,
          answer: `No. Extra add-ons hide whether the core ${job.noun} loop works.`,
        },
      ],
    },
    relatedLinks(ctx, "setup"),
    interactiveCta(ctx, "setup"),
  ]);
}

function buildAiImplementationBlocks(
  ctx: ProductGuideContext,
): GuideBlockInput[] {
  const name = ctx.productName;
  const job = aiJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Roll out ${name} in gated phases: freeze 90-day outcomes for ${job.noun}, name an owner, configure the core loop, train the people who must update it weekly, then review adoption before adding automations or extra add-ons.${quickGateHint(ctx)} Treat ${name} implementation as phases — not a feature dump in week one.`,
      bullets: [
        "Freeze 90-day outcomes",
        "Name an admin owner",
        "Days 1–30: core loop only",
        "Days 31–60: train weekly users",
        "Days 61–90: adoption review, then extras",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `${name} rollout rules`,
      items: [
        {
          label: "Job cluster first",
          body: `${name} is ${job.noun}. Do not implement it as ${job.notPeer}.`,
        },
        {
          label: "Adoption before add-ons",
          body: `If ${job.team.split(" (")[0]} will not open the product weekly, extra add-ons will not save the rollout.`,
        },
        {
          label: "Integrations are a phase",
          body: integrationSentence(ctx),
        },
        {
          label: "AI is optional",
          body: aiSentence(ctx),
        },
      ],
    },
    {
      type: "figure",
      id: "impl-diagram",
      title: `${name} 30/60/90`,
      src: ctx.figureSrc("implementation"),
      alt: `${name} 30/60/90 rollout for ${job.noun}.`,
      caption: `Treat ${name} implementation as gated phases — not a feature dump in week one.`,
    },
    {
      type: "step",
      stepNumber: 1,
      id: "days-30",
      heading: "Days 1–30: core loop only",
      body: `Configure ${job.setupFirst}. Success looks like: ${job.loop}.\n\nWorked example: ${job.team} delays optional extras until the core loop has a week of real use.`,
      tip: "Week-one marketplace apps are a common failure mode.",
    },
    {
      type: "step",
      stepNumber: 2,
      id: "days-60",
      heading: "Days 31–60: train weekly users",
      body: `Train the people who must update ${name} every week — not a one-time all-hands. ${trialSentence(ctx)}\n\nWorked example: ${job.team} includes one sceptic user in training so adoption risk shows up before go-live speeches.`,
      tip: "If sceptics will not open it, fix the ritual before buying more seats.",
    },
    {
      type: "step",
      stepNumber: 3,
      id: "days-90",
      heading: "Days 61–90: adoption review",
      body: `Check whether the core loop is actually used. Only then add automations, extra add-ons, or extra models.\n\nWorked example: ${job.team} reviews shared prompts, credits used, or workspace adoption (whichever matches ${job.noun}) before expanding scope.`,
      tip: "Empty dashboards mean the rollout is not done.",
    },
    phaseChecklist(ctx, "implementation", [
      {
        id: "outcomes",
        label: "Freeze 90-day outcomes",
        description: `Must-haves for ${job.noun} before configuration sprawl.`,
      },
      {
        id: "admin",
        label: "Name an admin owner",
        description: "Fields, users, and hygiene need a responsible party.",
      },
      {
        id: "adoption",
        label: "Schedule adoption review",
        description: "Check core-loop usage before adding automations.",
      },
    ]),
    researchCallout(ctx, "implementation"),
    {
      type: "faq",
      id: "impl-faq",
      title: `${name} implementation FAQ`,
      items: [
        {
          question: "How long should rollout take?",
          answer:
            "Ninety days is enough for most SMB/mid teams if you freeze the job and defer extras. Longer programmes help when change management is the risk.",
        },
        {
          question: "What if we also need a different AI job?",
          answer: `Buy the second job as a second product (or a later wave). ${name} should not be stretched into ${job.notPeer}.`,
        },
      ],
    },
    relatedLinks(ctx, "implementation"),
    interactiveCta(ctx, "implementation"),
  ]);
}

function buildAiMigrationBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = aiJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Migrate into ${name} with an inventory of ${job.migrateObjects}, a field map, a pilot import, a dual-run week, and validation with the people who live in the data — so history survives and the team trusts the new system.`,
      bullets: [
        "Inventory source objects",
        "Map fields before bulk load",
        "Pilot one site / one role / one team",
        "Dual-run for a week",
        "Validate with sceptic users",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `${name} migration rules`,
      items: [
        {
          label: "Inventory first",
          body: `Typical objects: ${job.migrateObjects}.`,
        },
        {
          label: "Pilot beats big-bang",
          body: `Prove a small ${name} import before you move everything.`,
        },
        {
          label: "Integrations after the pilot",
          body: integrationSentence(ctx),
        },
        {
          label: "Do not migrate the wrong job",
          body: `${name} is ${job.noun}. Do not import a meeting-notes bot or an image studio and expect it to become ${job.noun}.`,
        },
      ],
    },
    {
      type: "figure",
      id: "migration-diagram",
      title: `${name} migration map`,
      src: ctx.figureSrc("migration"),
      alt: `${name} migration: export, map, pilot, dual-run, cutover.`,
      caption: `Prove a small ${name} import before you move the whole operation.`,
    },
    {
      type: "step",
      stepNumber: 1,
      id: "inventory",
      heading: "Inventory and map",
      body: `List ${job.migrateObjects}. Map required fields and owners. ${pricingPointer(ctx)}\n\nWorked example: ${job.team} discovers duplicate employee IDs in the spreadsheet before the first import — and fixes identity before volume.`,
      tip: "Unmapped required fields fail loudly in week two.",
    },
    {
      type: "step",
      stepNumber: 2,
      id: "pilot",
      heading: "Pilot import",
      body: `Import one site, one role, or one team. Run ${job.loop} on the pilot set.\n\nWorked example: ${job.team} will not schedule a cutover until the pilot can ${job.prove}.`,
      tip: "A pretty mapping spreadsheet is not a successful import.",
    },
    {
      type: "step",
      stepNumber: 3,
      id: "cutover",
      heading: "Dual-run and cutover",
      body: `Run old and new in parallel for a week. Spot-check records sceptic users care about, then freeze the legacy source.\n\nWorked example: ${job.team} keeps the old export for prompts or files until ${name} matches for seven consecutive days.`,
      tip: "Cut over on a quiet day, not during a campaign launch.",
    },
    phaseChecklist(ctx, "migration", [
      {
        id: "inventory",
        label: "Inventory source objects",
        description: job.migrateObjects,
      },
      {
        id: "pilot",
        label: "Run a pilot import",
        description: "One segment first; fix mapping before bulk.",
      },
      {
        id: "validate",
        label: "Validate with operators",
        description: "Spot-check records they care about before cutover.",
      },
    ]),
    researchCallout(ctx, "migration"),
    {
      type: "faq",
      id: "migration-faq",
      title: `${name} migration FAQ`,
      items: [
        {
          question: "Can we skip the dual-run?",
          answer:
            "Only if the dataset is tiny and reversible. Most SMB/mid teams regret skipping a week of parallel use.",
        },
        {
          question: "What if history will not map cleanly?",
          answer:
            "Import active records first. Archive messy history as files rather than poisoning the new system of record.",
        },
      ],
    },
    relatedLinks(ctx, "migration"),
    interactiveCta(ctx, "migration"),
  ]);
}

function buildAiPlansBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = aiJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Choose a ${name} plan by mapping must-haves for ${job.noun} to a qualifying tier — seats, credits, usage packs, and add-ons included — not by comparing homepage “from” tiles.${quickGateHint(ctx)} ${pricingPointer(ctx)}`,
      bullets: [
        "List day-one must-haves",
        "Map to a researched qualifying plan",
        "Price credits / add-ons you will actually use",
        "Confirm trial or free proving ground",
        "Write the quote before you buy",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `${name} packaging rules`,
      items: [
        {
          label: "Tiles are the bottom layer",
          body: planSoftener(ctx),
        },
        {
          label: "Gates change the bill",
          body: gatedHintSentence(ctx),
        },
        {
          label: "Free is a proving ground",
          body: trialSentence(ctx),
        },
        {
          label: "Wrong cluster, wrong comparison",
          body: `Do not compare ${name} (${job.noun}) to ${job.notPeer} on a single price tile.`,
        },
      ],
    },
    {
      type: "figure",
      id: "plans-diagram",
      title: `${name} qualifying configuration`,
      src: ctx.figureSrc("plans"),
      alt: `${name} plan anatomy: seats, credits, gates, add-ons.`,
      caption: `Read ${name} pricing from must-have gates upward; confirm numbers on the pricing page.`,
    },
    {
      type: "step",
      stepNumber: 1,
      id: "musts",
      heading: "List must-haves, then qualify",
      body: `Must-haves should match ${job.loop}. Research-supported features include ${featurePhrase(ctx)}.\n\nWorked example: ${job.team} drops a cheaper tile when the must-have workflow unlocks only on a higher hub.`,
      tip: "If more than eight items are must-haves, you are still in wishlist mode.",
    },
    {
      type: "step",
      stepNumber: 2,
      id: "compare-like",
      heading: "Compare like for like",
      body: `${pricingPointer(ctx)}\n\nWorked example: ${job.team} totals the qualifying configuration at their headcount — not the marketing starter tile — then asks for the quote in writing.`,
      tip: "Annual vs monthly and implementation fees often decide the cheaper vendor.",
    },
    mustNiceMatrix(ctx, "plans", [
      {
        feature: "Core job on entry plan",
        mustHave: true,
        niceToHave: false,
        notes: job.setupFirst,
      },
      {
        feature: "Gated capabilities",
        mustHave: true,
        niceToHave: false,
        notes: gatedHintSentence(ctx),
      },
      {
        feature: "Enterprise / extra credits",
        mustHave: false,
        niceToHave: true,
        notes: aiSentence(ctx),
      },
    ]),
    phaseChecklist(ctx, "plans", [
      {
        id: "musts",
        label: "List day-one must-haves",
        description: "Features that must ship without an unused enterprise tier.",
      },
      {
        id: "qualify",
        label: "Map to a qualifying plan",
        description: "Use researched plan names — not marketing starting tiles.",
      },
      {
        id: "quote",
        label: "Get the qualifying quote in writing",
        description: "Seats, credits, add-ons, and implementation fees.",
      },
    ]),
    researchCallout(ctx, "plans"),
    {
      type: "faq",
      id: "plans-faq",
      title: `${name} plans FAQ`,
      items: [
        {
          question: `Does a free ${name} plan count?`,
          answer: trialSentence(ctx),
        },
        {
          question: "Should we pay annually?",
          answer:
            "Only after the qualifying configuration is written. Annual discounts do not fix the wrong hub.",
        },
      ],
    },
    relatedLinks(ctx, "plans"),
    interactiveCta(ctx, "plans"),
  ]);
}

function buildAiWorthItBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = aiJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `${name} is worth it when your primary job is ${job.noun}, a non-admin can ${job.prove} on the package you will buy, and you can live with the researched tradeoffs. It is not worth stretching into ${job.notPeer}.`,
      bullets: [
        "Fit the job cluster",
        "Prove the core loop",
        "Accept tradeoffs in writing",
        "Confirm the qualifying package",
        "Otherwise keep looking",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `Is ${name} worth it?`,
      items: [
        {
          label: "Fit",
          body: `Best for: ${bestForPhrase(ctx)}. Not ideal: ${notIdealPhrase(ctx)}.`,
        },
        {
          label: "Proof",
          body: `Worth it only when ${job.team} can ${job.prove}.`,
        },
        {
          label: "Package",
          body: gatedHintSentence(ctx),
        },
        {
          label: "No invented ROI",
          body: "Outcomes, usability, and qualifying cost either align or they don’t — affiliate economics are not a score.",
        },
      ],
    },
    {
      type: "figure",
      id: "worth-it-diagram",
      title: `${name} fit / proof / package`,
      src: ctx.figureSrc("worth-it"),
      alt: `${name} worth-it gates: fit, proof, package.`,
      caption: `${name} is “worth it” when outcomes, usability, and qualifying cost align — not when a demo feels exciting.`,
    },
    {
      type: "step",
      stepNumber: 1,
      id: "fit-gate",
      heading: "Fit gate: does your motion match?",
      body: `Compare your job to researched best-for / not-ideal patterns.\n\nBest for: ${bestForPhrase(ctx)}.\nNot ideal: ${notIdealPhrase(ctx)}.\n\nWorked example: ${job.team} scores ${name} on ${job.noun} only — they refuse to treat it as ${job.notPeer}.`,
      tip: "Demo excitement is not a fit signal.",
    },
    {
      type: "step",
      stepNumber: 2,
      id: "trial-proof",
      heading: "Proof gate: non-admin loop",
      body: `${trialSentence(ctx)}\n\nSuccess: ${job.prove}.\n\nWorked example: ${job.team} fails the gate when only an admin can complete the walkthrough; they extend trial and fix permissions before considering buy.`,
      tip: "Vendor tours do not count as proof.",
    },
    {
      type: "step",
      stepNumber: 3,
      id: "tradeoffs",
      heading: "Tradeoff gate: can you live with the limits?",
      body: `Strengths: ${ctx.strengths.length > 0 ? clauses(ctx.strengths, 4) : `Confirm strengths in the ${name} review.`}.\nWatch-outs: ${ctx.weaknesses.length > 0 ? clauses(ctx.weaknesses, 4) : limitationLines(ctx).length > 0 ? clauses(limitationLines(ctx), 4) : `Confirm limitations in research before you buy ${name}.`}.\n\nWorked example: ${job.team} documents known gaps instead of pretending ${name} covers every AI job.`,
      tip: "Unspoken tradeoffs become renewal fights.",
    },
    {
      type: "step",
      stepNumber: 4,
      id: "decide",
      heading: "Package gate and decide",
      body: `1. Confirm must-haves on a qualifying package. ${gatedHintSentence(ctx)}\n2. ${pricingPointer(ctx)}\n3. Buy only when fit + proof + package all say yes.\n4. Otherwise keep looking via ${job.categoryHowTo} — ${ctx.alternativeNames.length > 0 ? `teams often also evaluate ${joinList(ctx.alternativeNames, 3)}` : "compare finalists inside the same job cluster"}.\n\nWorked example: ${job.team} clears fit and proof but pauses the buy until hub/seat rules are written.`,
      tip: "No invented ROI — outcomes, usability, and qualifying cost either align or they don’t.",
    },
    phaseChecklist(ctx, "worth-it", [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: `Your motion should be ${job.noun}.`,
      },
      {
        id: "trial",
        label: "Prove the AI loop",
        description: job.prove,
      },
      {
        id: "plan",
        label: "Confirm seats and credits",
        description: "Must-haves on a real tier before you call it a bargain.",
      },
    ]),
    researchCallout(ctx, "worth-it"),
    {
      type: "faq",
      id: "worth-it-faq",
      title: `Is ${name} worth it? FAQ`,
      items: [
        {
          question: "Can we decide from a demo alone?",
          answer: `No. Require non-admin proof that you can ${job.prove} on the package you will actually buy.`,
        },
        {
          question: "When should we walk away?",
          answer: `When fit, trial proof, or written packaging fails — or when the real job is ${job.notPeer}.`,
        },
      ],
    },
    relatedLinks(ctx, "worth-it"),
    interactiveCta(ctx, "worth-it"),
  ]);
}

function tidyStrings<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(/\s{2,}/g, " ").trim() as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => tidyStrings(item)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        tidyStrings(v),
      ]),
    ) as T;
  }
  return value;
}

export function buildAiBlocksForKind(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  return tidyStrings(aiBlocksForKind(ctx, kind));
}

function aiBlocksForKind(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  switch (kind) {
    case "implementation":
      return buildAiImplementationBlocks(ctx);
    case "migration":
      return buildAiMigrationBlocks(ctx);
    case "setup":
      return buildAiSetupBlocks(ctx);
    case "plans":
      return buildAiPlansBlocks(ctx);
    case "worth-it":
      return buildAiWorthItBlocks(ctx);
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
