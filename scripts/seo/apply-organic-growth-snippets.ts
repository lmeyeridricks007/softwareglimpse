#!/usr/bin/env npx tsx
/**
 * Organic growth snippets for existing INDEXABLE software reviews.
 *
 * Uses page-level GSC bands (A/B/D) + existing review summary/verdict/pricing.
 * Does not invent queries, prices, or hands-on experience.
 *
 *   npx tsx scripts/seo/apply-organic-growth-snippets.ts
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const QUEUE = path.join(ROOT, "data/growth/organic-growth-queue.json");
const REVIEW_DIR = path.join(ROOT, "src/data/editorial/reviews");
const TITLE_MAX = 70;
const DESC_MAX = 160;

type QueueFile = {
  bands: {
    A: Array<{ path: string }>;
    B: Array<{ path: string }>;
    D: Array<{ path: string }>;
  };
};

type ReviewFile = {
  productSlug?: string;
  title?: string;
  h1?: string;
  summary?: string;
  verdict?: string;
  editorialStatus?: string;
  sections?: Array<{ id?: string; body?: string }>;
  seo?: {
    title?: string;
    description?: string;
    canonicalPath?: string;
    indexable?: boolean;
  };
};

function softwareSlug(p: string): string | null {
  const m = p.match(/^\/software\/([^/]+)\/?$/);
  return m?.[1] ?? null;
}

function uniqueSoftwareSlugs(queue: QueueFile): string[] {
  const set = new Set<string>();
  for (const band of [queue.bands.A, queue.bands.B, queue.bands.D]) {
    for (const row of band) {
      const slug = softwareSlug(row.path);
      if (slug) set.add(slug);
    }
  }
  return [...set].sort();
}

function firstSentence(s: string): string {
  const trimmed = s.replace(/\s+/g, " ").trim();
  const m = trimmed.match(/^(.+?[.!?])(\s|$)/);
  return (m?.[1] ?? trimmed).trim();
}

function stripNamePrefix(text: string, name: string): string {
  return text
    .replace(new RegExp(`^${escapeRe(name)}:\\s*`, "i"), "")
    .replace(new RegExp(`^Choose ${escapeRe(name)} when\\s+`, "i"), "")
    .trim();
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const sliced = t.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace >= 24 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

function isGenericTitle(title: string | undefined, name: string): boolean {
  if (!title) return true;
  const t = title.replace(/\s*\|\s*SoftwareGlimpse\s*$/i, "").trim();
  if (t.length < 25) return true;
  if (/review:\s*fit, plans, and limits$/i.test(t)) return true;
  if (/pricing, features, pros & cons$/i.test(t)) return true;
  if (/…$/.test(t) || /\.{3}$/.test(t)) return true;
  if (/\b(is|the|a|an|and|or|to|when|you|want)$/i.test(t)) return true;
  if (new RegExp(`^${escapeRe(name)} review \\(2026\\)$`, "i").test(t)) {
    return true;
  }
  if (new RegExp(`^${escapeRe(name)} review \\(2026\\)\\s+[—–-]`, "i").test(t)) {
    return true;
  }
  if (new RegExp(`^${escapeRe(name)} review$`, "i").test(t)) return true;
  if (/provisional assessment/i.test(t)) return true;
  return false;
}

function isGenericDescription(desc: string | undefined): boolean {
  if (!desc) return true;
  const d = desc.trim();
  if (d.length < 40) return true;
  if (/strengths, trade-offs, pricing posture/i.test(d)) return true;
  if (/in-depth .+ review covering 2026/i.test(d)) return true;
  if (/provisional assessment/i.test(d)) return true;
  if (/software profile on softwareglimpse/i.test(d)) return true;
  if (/fit, plans, and (documented )?limits/i.test(d)) return true;
  if (/review on softwareglimpse:/i.test(d) && /who should buy/i.test(d)) {
    return true;
  }
  if (/overall score \d/i.test(d)) return true;
  if (!/^[A-Z]/.test(d)) return true;
  if (/…$/.test(d)) return true;
  if (!/[.!?]$/.test(d) && d.length >= 140 && !d.includes("…")) return true;
  return false;
}

function normalizeHook(hook: string, name: string): string {
  let s = stripNamePrefix(hook, name);
  s = s.replace(/^is a strong (?:choice|fit) when\s+/i, "");
  s = s.replace(/^you want\s+/i, "");
  s = s.replace(/^your\s+/i, "");
  return trimTrailingStops(s);
}

function buyerCopy(review: ReviewFile, name: string): string {
  const verdict = (review.verdict ?? "").trim();
  const summary = (review.summary ?? "").trim();
  const isScoreLead = (s: string) =>
    /overall score \d/i.test(s) ||
    /scores reflect first-party/i.test(s) ||
    /based on first-party research — not hands-on/i.test(s);
  const hasBuyerRule = (s: string) =>
    /choose /i.test(s) ||
    /strong (choice|fit) when/i.test(s) ||
    /when you /i.test(s) ||
    /when your /i.test(s);
  const prefer = [verdict, summary].find((s) => hasBuyerRule(s) && !isScoreLead(s));
  const raw =
    prefer ||
    (summary && !isScoreLead(summary) ? summary : "") ||
    verdict ||
    summary;
  return firstSentence(stripNamePrefix(raw, name));
}

function trimTrailingStops(s: string): string {
  const stop = new Set([
    "is",
    "the",
    "a",
    "an",
    "and",
    "or",
    "to",
    "for",
    "with",
    "with",
    "when",
    "you",
    "want",
    "your",
  ]);
  const words = s.split(/\s+/);
  while (words.length) {
    const last = words[words.length - 1]!.toLowerCase().replace(/[^\w]/g, "");
    if (!stop.has(last)) break;
    words.pop();
  }
  return words.join(" ").replace(/[—–,;:]+$/, "").trim();
}

function fitTitle(name: string, hook: string): string {
  const year = `${name} Review (2026)`;
  if (!hook) return year.length <= TITLE_MAX ? year : name.slice(0, TITLE_MAX);
  const cleaned = trimTrailingStops(normalizeHook(hook, name));
  const prefix = `${year}: `;
  const budget = TITLE_MAX - prefix.length;
  const compact = trimTrailingStops(cleaned.split(/\s+/).slice(0, 4).join(" "));
  const chosen =
    compact.length >= 8 && compact.length <= budget ? compact : cleaned;
  if (chosen.length <= budget) {
    return `${prefix}${chosen.charAt(0).toUpperCase()}${chosen.slice(1)}`;
  }
  const words = cleaned.split(/\s+/);
  let acc = "";
  for (const w of words) {
    const next = acc ? `${acc} ${w}` : w;
    if (next.length > budget) break;
    acc = next;
  }
  if (acc.length >= 8) {
    acc = trimTrailingStops(acc);
    if (acc.length >= 8) {
      return `${prefix}${acc.charAt(0).toUpperCase()}${acc.slice(1)}`;
    }
  }
  return year;
}

function productName(review: ReviewFile, slug: string): string {
  const fromTitle = (review.title ?? "")
    .replace(/\s+review.*$/i, "")
    .trim();
  if (fromTitle && fromTitle.length >= 2 && fromTitle.length < 40) {
    return fromTitle;
  }
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function buildDescription(name: string, copy: string): string {
  let s = copy.replace(/\s+/g, " ").trim();
  s = s.replace(/^you want\s+/i, "");
  if (!/^choose /i.test(s) && !/^.{0,20} is a /i.test(s)) {
    s = `Choose ${name} when ${s.replace(/^when\s+/i, "")}`;
  }
  const beforeDash = s.split(/\s+[—–]\s+/)[0]?.trim() ?? s;
  if (beforeDash.length >= 40 && beforeDash.length <= DESC_MAX) {
    s = beforeDash;
  }
  if (!/[.!?]$/.test(s)) s = `${s}.`;
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return clip(s, DESC_MAX);
}

function main() {
  if (!existsSync(QUEUE)) {
    console.error(`Missing ${QUEUE}`);
    process.exit(1);
  }
  const queue = JSON.parse(readFileSync(QUEUE, "utf8")) as QueueFile;
  const slugs = uniqueSoftwareSlugs(queue);
  const changed: Array<Record<string, unknown>> = [];
  const skipped: Array<Record<string, unknown>> = [];

  for (const slug of slugs) {
    const filePath = path.join(REVIEW_DIR, `${slug}.json`);
    if (!existsSync(filePath)) {
      skipped.push({ slug, reason: "no_review_file" });
      continue;
    }
    const review = JSON.parse(readFileSync(filePath, "utf8")) as ReviewFile;
    const name = productName(review, slug);
    const copy = buyerCopy(review, name);
    if (copy.length < 24) {
      skipped.push({ slug, reason: "insufficient_summary" });
      continue;
    }

    const force = process.argv.includes("--force");
    const titleGeneric = force || isGenericTitle(review.seo?.title, name);
    const descGeneric = force || isGenericDescription(review.seo?.description);
    const indexableFix =
      review.editorialStatus === "approved" && review.seo?.indexable === false;

    if (!titleGeneric && !descGeneric && !indexableFix) {
      skipped.push({ slug, reason: "already_specific" });
      continue;
    }

    const hook = normalizeHook(copy, name);
    const nextTitle = titleGeneric
      ? fitTitle(name, hook)
      : (review.seo?.title ?? "").replace(/\s*\|\s*SoftwareGlimpse\s*$/i, "").trim();
    const nextDesc = descGeneric ? buildDescription(name, copy) : (review.seo?.description ?? "").trim();

    const before = {
      title: review.seo?.title ?? null,
      description: review.seo?.description ?? null,
      indexable: review.seo?.indexable ?? null,
    };

    review.seo = {
      ...(review.seo ?? {}),
      title: nextTitle,
      description: nextDesc,
      canonicalPath: review.seo?.canonicalPath ?? `/software/${slug}/`,
      indexable: indexableFix ? true : (review.seo?.indexable ?? true),
    };

    writeFileSync(filePath, `${JSON.stringify(review, null, 2)}\n`);
    changed.push({
      slug,
      titleBefore: before.title,
      titleAfter: review.seo.title,
      descBefore: before.description,
      descAfter: review.seo.description,
      indexableBefore: before.indexable,
      indexableAfter: review.seo.indexable,
      titleChanged: before.title !== review.seo.title,
      descChanged: before.description !== review.seo.description,
      indexableFixed: indexableFix,
    });
  }

  const outDir = path.join(ROOT, "data/growth");
  mkdirSync(outDir, { recursive: true });
  const artifact = {
    generatedAt: new Date().toISOString(),
    processed: slugs.length,
    changed: changed.length,
    skipped: skipped.length,
    pages: changed,
    skippedPages: skipped,
  };
  writeFileSync(
    path.join(outDir, "organic-growth-snippets.json"),
    `${JSON.stringify(artifact, null, 2)}\n`,
  );
  console.log(
    JSON.stringify(
      {
        processed: slugs.length,
        changed: changed.length,
        skipped: skipped.length,
        sample: changed.slice(0, 8).map((c) => ({
          slug: c.slug,
          titleAfter: c.titleAfter,
          descAfter: c.descAfter,
        })),
      },
      null,
      2,
    ),
  );
}

main();
