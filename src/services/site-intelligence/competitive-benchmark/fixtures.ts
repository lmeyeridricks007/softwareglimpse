import { observeFromHtml } from "./observe";
import type { PageObservation } from "./types";

/**
 * Deterministic HTML fixtures for offline competitor analysis.
 * Synthetic pages — not live SERP claims.
 */
const FIXTURE_HTML: Record<string, string> = {
  "https://www.g2.com/categories/crm": page({
    title: "Best CRM Software - G2",
    h1: "Best CRM Software",
    author: true,
    date: true,
    words: 2200,
    h2: ["Top CRM products", "How G2 scores software", "Compare CRM tools", "Pricing overview", "Buyer guide"],
    tables: 2,
    lists: 4,
    images: 6,
    screenshot: true,
    methodology: true,
    disclosure: true,
    pricing: true,
    jsonLd: ["ItemList", "Organization"],
    internal: 28,
    external: 12,
  }),
  "https://www.pcmag.com/picks/the-best-crm-software": page({
    title: "The Best CRM Software - PCMag",
    h1: "The Best CRM Software",
    author: true,
    date: true,
    words: 2800,
    h2: ["Our top picks", "How we tested", "Pricing", "Who should buy", "Alternatives"],
    tables: 1,
    lists: 5,
    images: 8,
    screenshot: true,
    methodology: true,
    disclosure: true,
    pricing: true,
    prosCons: true,
    jsonLd: ["Article", "Person"],
    video: true,
    internal: 22,
    external: 8,
  }),
  "https://www.forbes.com/advisor/business/software/best-crm-software/": page({
    title: "Best CRM Software - Forbes Advisor",
    h1: "Best CRM Software of 2026",
    author: true,
    date: true,
    words: 2400,
    h2: ["Best overall", "Best for small business", "Methodology", "Pricing comparison", "FAQs"],
    tables: 1,
    lists: 3,
    images: 5,
    methodology: true,
    disclosure: true,
    pricing: true,
    jsonLd: ["Article"],
    internal: 18,
    external: 6,
  }),
  "https://zapier.com/blog/best-crm-app/": page({
    title: "The best CRM apps - Zapier",
    h1: "The best CRM software",
    author: true,
    date: true,
    words: 3100,
    h2: ["Our picks", "What is CRM", "Automation angle", "Pricing", "How we chose"],
    tables: 1,
    lists: 6,
    images: 7,
    screenshot: true,
    methodology: true,
    disclosure: true,
    pricing: true,
    tool: true,
    jsonLd: ["Article", "ItemList"],
    internal: 35,
    external: 10,
  }),
  "https://www.techradar.com/best/best-crm": page({
    title: "Best CRM - TechRadar",
    h1: "Best CRM software",
    author: true,
    date: true,
    words: 1900,
    h2: ["Best overall", "Best free", "Buying advice"],
    tables: 0,
    lists: 3,
    images: 4,
    disclosure: true,
    pricing: true,
    jsonLd: ["Article"],
    internal: 14,
    external: 4,
  }),
  "https://www.hubspot.com/products/crm": page({
    title: "HubSpot CRM",
    h1: "Free CRM software",
    words: 1400,
    h2: ["Features", "Pricing", "Integrations", "Get started"],
    tables: 1,
    lists: 3,
    images: 10,
    screenshot: true,
    pricing: true,
    video: true,
    jsonLd: ["SoftwareApplication", "Organization"],
    internal: 40,
    external: 3,
  }),
  "https://blog.hubspot.com/sales/crm-evaluation-checklist": page({
    title: "CRM evaluation checklist - HubSpot",
    h1: "CRM evaluation checklist",
    author: true,
    date: true,
    words: 1600,
    h2: ["Requirements", "Must-have features", "Scoring rubric", "Next steps"],
    tables: 1,
    lists: 5,
    images: 2,
    checklist: true,
    download: true,
    methodology: true,
    jsonLd: ["Article", "Person"],
    internal: 24,
    external: 5,
  }),
  "https://www.selecthub.com/crm-software/crm-checklist/": page({
    title: "CRM checklist - SelectHub",
    h1: "CRM software checklist",
    words: 1200,
    h2: ["Requirements checklist", "Vendor questions", "Compare platforms"],
    tables: 1,
    lists: 4,
    checklist: true,
    tool: true,
    disclosure: true,
    jsonLd: ["WebPage"],
    internal: 16,
    external: 4,
  }),
  "https://www.gartner.com/crm-evaluation": page({
    title: "CRM evaluation - Gartner",
    h1: "Evaluate CRM solutions",
    words: 900,
    h2: ["Magic Quadrant overview", "Research notes"],
    tables: 0,
    lists: 2,
    images: 1,
    methodology: true,
    jsonLd: ["WebPage"],
    internal: 10,
    external: 2,
  }),
  "https://www.hubspot.com/products/crm/migration": page({
    title: "CRM Migration - HubSpot",
    h1: "Migrate to HubSpot CRM",
    words: 1100,
    h2: ["Migration steps", "Data mapping", "Support"],
    tables: 0,
    lists: 3,
    images: 4,
    screenshot: true,
    tool: true,
    jsonLd: ["WebPage"],
    internal: 20,
    external: 2,
  }),
  "https://www.salesforce.com/products/migration/": page({
    title: "Migrate to Salesforce",
    h1: "CRM migration to Salesforce",
    words: 1000,
    h2: ["Why migrate", "Services", "Partners"],
    tables: 0,
    lists: 2,
    images: 5,
    video: true,
    jsonLd: ["Organization"],
    internal: 25,
    external: 1,
  }),
  "https://www.deloitte.com/crm-migration-checklist": page({
    title: "CRM migration checklist - Deloitte",
    h1: "CRM migration checklist",
    words: 1500,
    h2: ["Plan", "Data", "Change management", "Checklist"],
    tables: 1,
    lists: 4,
    checklist: true,
    download: true,
    methodology: true,
    jsonLd: ["Article"],
    internal: 12,
    external: 3,
  }),
  "https://blog.hubspot.com/sales/crm-migration": page({
    title: "How to migrate CRM - HubSpot Blog",
    h1: "How to migrate your CRM",
    author: true,
    date: true,
    words: 1800,
    h2: ["Preparation", "Data cleanup", "Cutover", "Training"],
    tables: 0,
    lists: 4,
    checklist: true,
    jsonLd: ["Article", "Person"],
    internal: 18,
    external: 6,
  }),
  "https://www.reddit.com/r/CRM/comments/migration": page({
    title: "CRM migration tips - Reddit",
    h1: "CRM migration tips",
    words: 600,
    h2: ["Comments"],
    tables: 0,
    lists: 1,
    images: 0,
    jsonLd: [],
    internal: 8,
    external: 2,
  }),
  "https://www.g2.com/compare/hubspot-vs-pipedrive": page({
    title: "HubSpot vs Pipedrive - G2",
    h1: "HubSpot vs Pipedrive",
    words: 2000,
    h2: ["Feature comparison", "User ratings", "Pricing", "Reviews"],
    tables: 2,
    lists: 3,
    images: 4,
    comparison: true,
    pricing: true,
    methodology: true,
    jsonLd: ["Product", "ItemList"],
    internal: 30,
    external: 4,
  }),
  "https://zapier.com/blog/hubspot-vs-pipedrive/": page({
    title: "HubSpot vs Pipedrive - Zapier",
    h1: "HubSpot vs Pipedrive",
    author: true,
    date: true,
    words: 2600,
    h2: ["At a glance", "Features", "Pricing", "Who should choose which", "Automation"],
    tables: 1,
    lists: 4,
    images: 5,
    comparison: true,
    pricing: true,
    methodology: true,
    disclosure: true,
    jsonLd: ["Article"],
    internal: 26,
    external: 7,
  }),
  "https://www.pcmag.com/comparisons/hubspot-vs-pipedrive": page({
    title: "HubSpot vs Pipedrive - PCMag",
    h1: "HubSpot vs Pipedrive",
    author: true,
    date: true,
    words: 1700,
    h2: ["Specs", "Performance", "Verdict"],
    tables: 1,
    lists: 2,
    comparison: true,
    prosCons: true,
    pricing: true,
    jsonLd: ["Article"],
    internal: 15,
    external: 3,
  }),
  "https://www.pipedrive.com/en/blog/hubspot-vs-pipedrive": page({
    title: "HubSpot vs Pipedrive - Pipedrive",
    h1: "HubSpot vs Pipedrive",
    words: 1300,
    h2: ["Differences", "Why Pipedrive", "Pricing"],
    tables: 1,
    lists: 2,
    comparison: true,
    pricing: true,
    screenshot: true,
    jsonLd: ["Article"],
    internal: 22,
    external: 2,
  }),
};

type PageOpts = {
  title: string;
  h1: string;
  words: number;
  h2: string[];
  tables: number;
  lists: number;
  images?: number;
  author?: boolean;
  date?: boolean;
  screenshot?: boolean;
  video?: boolean;
  methodology?: boolean;
  disclosure?: boolean;
  pricing?: boolean;
  prosCons?: boolean;
  checklist?: boolean;
  download?: boolean;
  tool?: boolean;
  calculator?: boolean;
  comparison?: boolean;
  jsonLd: string[];
  internal: number;
  external: number;
};

function page(o: PageOpts): string {
  const filler = " CRM software evaluation content decision criteria trade-offs. ".repeat(
    Math.max(40, Math.ceil(o.words / 5)),
  );
  const h2s = o.h2
    .map((h, i) => {
      const chunk = filler.slice(i * 500, i * 500 + 800);
      return `<h2>${h}</h2><p>${chunk}</p>`;
    })
    .join("\n");
  const bodyExtra = `<p>${filler}</p>`;
  const tables = Array.from({ length: o.tables }, (_, i) =>
    o.comparison || i === 0
      ? `<table><thead><tr><th>Feature</th><th>A</th><th>B</th></tr></thead><tbody><tr><td>Compare CRM</td><td>Yes</td><td>No</td></tr></tbody></table>`
      : `<table><tr><td>Row</td><td>Value</td></tr></table>`,
  ).join("\n");
  const lists = Array.from(
    { length: o.lists },
    () => `<ul><li>Point one</li><li>Point two</li><li>Point three</li></ul>`,
  ).join("\n");
  const imgs = Array.from({ length: o.images ?? 0 }, (_, i) =>
    `<img src="/img/${i}.png" alt="${o.screenshot && i === 0 ? "Product screenshot dashboard UI" : "Illustration"}" width="800" height="450" />`,
  ).join("\n");
  const jsonLd =
    o.jsonLd.length > 0
      ? `<script type="application/ld+json">${JSON.stringify({
          "@context": "https://schema.org",
          "@type": o.jsonLd[0],
          name: o.title,
          ...(o.jsonLd.includes("Person")
            ? { author: { "@type": "Person", name: "Editor" } }
            : {}),
        })}</script>`
      : "";
  const internals = Array.from(
    { length: o.internal },
    (_, i) => `<a href="/related/${i}">Related ${i}</a>`,
  ).join(" ");
  const externals = Array.from(
    { length: o.external },
    (_, i) => `<a href="https://example-${i}.com/src">Source ${i}</a>`,
  ).join(" ");

  return `<!DOCTYPE html><html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${o.title}</title>
${o.date ? `<meta property="article:modified_time" content="2026-08-01"/>` : ""}
${jsonLd}
</head><body>
${o.author ? `<p class="author">By Editorial Team</p>` : ""}
${o.date ? `<time datetime="2026-08-01">Updated Aug 1, 2026</time>` : ""}
<h1>${o.h1}</h1>
${o.methodology ? `<p>Methodology: how we evaluate and rank CRM platforms using scored criteria.</p>` : ""}
${o.disclosure ? `<p>Affiliate disclosure: we may earn compensation from some links.</p>` : ""}
${o.pricing ? `<p>Pricing starts at $0–$99 per user per month depending on plan.</p>` : ""}
${o.prosCons ? `<h2>Pros and cons</h2><ul><li>Pros: ease of use</li><li>Cons: complexity at scale</li></ul>` : ""}
${o.checklist ? `<p>Use this checklist ☐ Requirements ☐ Integrations ☐ Security</p>` : ""}
${o.download ? `<p><a href="/template.pdf">Download template worksheet</a></p>` : ""}
${o.tool ? `<p>Try our interactive CRM finder recommender tool.</p><form><input name="q"/></form>` : ""}
${o.calculator ? `<p>CRM cost calculator estimate ROI.</p><form data-calculator="1"><input type="range"/></form>` : ""}
${o.video ? `<iframe src="https://www.youtube.com/embed/abc"></iframe>` : ""}
${h2s}
${bodyExtra}
${tables}
${lists}
${imgs}
<nav>${internals}</nav>
<aside>${externals}</aside>
</body></html>`;
}

export function getFixtureObservation(
  url: string,
  query?: string,
): PageObservation | null {
  const html = FIXTURE_HTML[url];
  if (!html) return null;
  return observeFromHtml({
    url,
    html,
    statusCode: 200,
    ttfbMs: 180,
    query,
    source: "fixture",
    fetchedAt: "2026-08-15T12:00:00.000Z",
  });
}

/** SoftwareGlimpse local proxy page for benchmarks (not a production crawl claim). */
export function softwareGlimpseFixturePage(
  path: string,
  query: string,
): PageObservation {
  const title = `SoftwareGlimpse — ${path}`;
  const html = page({
    title,
    h1: title,
    words: path.includes("best") ? 2400 : path.includes("compare") ? 2000 : 1600,
    h2: [
      "Decision criteria",
      "How we evaluate",
      "Trade-offs",
      "Who it is for",
      "Next steps",
      "Related resources",
    ],
    tables: path.includes("compare") || path.includes("best") ? 1 : 0,
    lists: 4,
    images: 3,
    author: true,
    date: true,
    methodology: true,
    disclosure: true,
    pricing: path.includes("software") || path.includes("best"),
    prosCons: path.includes("software") || path.includes("compare"),
    checklist: path.includes("checklist") || path.includes("resources"),
    tool: path.includes("tools") || path.includes("planner") || path.includes("calculator"),
    calculator: path.includes("calculator") || path.includes("cost"),
    comparison: path.includes("compare"),
    screenshot: false,
    jsonLd: ["Article", "BreadcrumbList"],
    internal: 20,
    external: 5,
  });
  const obs = observeFromHtml({
    url: `https://softwareglimpse.com${path}`,
    html,
    statusCode: 200,
    ttfbMs: 120,
    query,
    source: "local-sg",
    fetchedAt: "2026-08-15T12:00:00.000Z",
  });
  obs.notes = [
    ...(obs.notes ?? []),
    "SoftwareGlimpse row is a local structural proxy from known page type — not a live production HTML claim unless fetched separately",
  ];
  return obs;
}

export { FIXTURE_HTML };
