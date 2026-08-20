import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import type { ProductGuideContext } from "./context";
import type { CrmProductGuideKind } from "./kinds";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

type EcomJob = {
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

function ecomJob(ctx: ProductGuideContext): EcomJob {
  switch (ctx.productSlug) {
    case "shopify":
      return {
        noun: "hosted SaaS ecommerce platform",
        loop: "publish a live theme, add a product with variants, and complete a test checkout",
        setupFirst: "one store, one theme, one product, and Shopify Payments or a gateway you will actually use",
        migrateObjects: "products, variants, customers, orders, and theme settings",
        prove: "a non-admin can add a SKU and a test buyer can complete checkout",
        team: "Harbor Studio (12-SKU DTC brand)",
        notPeer: "a dropshipping sourcing app or a WordPress-only plugin",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "bigcommerce":
      return {
        noun: "hosted SaaS ecommerce platform",
        loop: "publish a catalog, configure checkout, and place a test order against a GMV-aware plan",
        setupFirst: "one storefront, catalog depth you will sell, and the plan that matches expected GMV",
        migrateObjects: "products, customers, orders, and multi-storefront settings if used",
        prove: "a merchandiser can list a variant and checkout completes without an agency rebuild",
        team: "Northline Retail (mid-catalog DTC with B2B interest)",
        notPeer: "a POS-first Square bundle or a dropshipping importer",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "woocommerce":
      return {
        noun: "open-source WordPress cart",
        loop: "install the plugin on hosting you control, add a product, and complete a test order",
        setupFirst: "hosting, SSL, one payment gateway, and the extensions you will actually buy",
        migrateObjects: "products, orders, customers, and WordPress users",
        prove: "a non-developer can add a product and a buyer can check out on the live domain",
        team: "Harbor Studio (already on WordPress)",
        notPeer: "a fully hosted SaaS admin with no server ownership",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "square-online":
      return {
        noun: "omnichannel POS + online store",
        loop: "sync one SKU to POS and the online catalog, take an in-person payment, and see the same inventory online",
        setupFirst: "one location, Square hardware or app, and the Free/Plus/Premium package you will actually buy",
        migrateObjects: "items, modifiers, inventory, customer directory, and location settings",
        prove: "a store associate rings a sale and the website stock updates without a spreadsheet",
        team: "Harbor Retail (two brick-and-mortar locations adding a website)",
        notPeer: "an online-only SaaS platform without POS hardware",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "spocket":
      return {
        noun: "dropshipping sourcing",
        loop: "import a US/EU supplier product into the connected store and push a test order back to the vendor",
        setupFirst: "an existing storefront, one import, and the product-cap plan you will actually buy",
        migrateObjects: "imported products, supplier mappings, and open dropship orders",
        prove: "a merchandiser can import within the plan cap and an order routes without copy-paste",
        team: "Harbor Studio (Shopify store testing dropship SKUs)",
        notPeer: "a full storefront platform or checkout replacement",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "alidrop":
      return {
        noun: "Shopify-native dropshipping import",
        loop: "import an AliExpress-class product into Shopify and fulfill a test order from the app",
        setupFirst: "a live Shopify store, one import, and the product-cap plan you will actually buy",
        migrateObjects: "imported products, supplier links, and open orders",
        prove: "a non-admin can import within the cap and an order pushes without leaving Shopify",
        team: "Harbor Studio (Shopify-only dropship test)",
        notPeer: "a hosted storefront, WooCommerce, or Square POS",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "magento":
      return {
        noun: "open-source / Adobe Commerce platform",
        loop: "stand up a staging store, import a complex catalog, and complete a test checkout with B2B or multi-store rules you need",
        setupFirst: "hosting or Adobe Cloud path, one integrator owner, and a staging catalog slice",
        migrateObjects: "products, categories, customers, orders, and store configurations",
        prove: "a merchandiser can update a complex SKU and a test order completes on staging",
        team: "Northline Enterprise (complex catalog with agency support)",
        notPeer: "a website builder or a dropshipping import app",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "wix":
      return {
        noun: "website-builder commerce",
        loop: "publish a branded site section, add a product on Core+, and complete a test checkout",
        setupFirst: "Core or higher plan, custom domain path, and one product collection",
        migrateObjects: "site pages, products, and customer contacts",
        prove: "a non-admin can edit a page and a buyer can check out without leaving Wix",
        team: "Harbor Studio (design-led SMB site + store)",
        notPeer: "a Shopify-class commerce OS or Magento B2B core",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "squarespace":
      return {
        noun: "website-builder commerce",
        loop: "publish a template storefront, add a curated catalog, and complete a test order on Plus or Advanced if fees matter",
        setupFirst: "Core/Plus/Advanced plan, template, and one product collection",
        migrateObjects: "pages, products, and orders",
        prove: "a designer can update the storefront and a buyer can complete checkout",
        team: "Harbor Studio (template-first brand shop)",
        notPeer: "a POS-first retail stack or enterprise open-source commerce",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "ecwid":
      return {
        noun: "embeddable SaaS storefront",
        loop: "embed the store on an existing page, add a product on the plan you buy, and complete a test checkout",
        setupFirst: "a host site or page, Starter/Venture/Business/Unlimited plan, and one payment method",
        migrateObjects: "products, customers, and orders",
        prove: "a non-admin can add a SKU and a buyer can check out without leaving the host site",
        team: "Harbor Studio (existing site adding commerce)",
        notPeer: "a full Shopify-class commerce OS or a dropshipping importer",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "salesforce-commerce-cloud":
      return {
        noun: "enterprise SaaS commerce platform",
        loop: "stand up a sandbox storefront, import a catalog slice, and complete a test order on the quoted edition",
        setupFirst: "Salesforce quote (Growth/Plus/Premium), sandbox credits, and an integrator owner",
        migrateObjects: "catalogs, price books, customers, and order history",
        prove: "a merchandiser can update a price book and a test order completes in sandbox",
        team: "Northline Enterprise (Salesforce-stack retailer)",
        notPeer: "an SMB Shopify plan or a website builder",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "prestashop":
      return {
        noun: "open-source commerce platform",
        loop: "install Classic or Hosted, add a product, and complete a test order",
        setupFirst: "hosting or Hosted plan, one payment module, and the modules you will actually buy",
        migrateObjects: "products, orders, customers, and modules",
        prove: "a non-developer can add a product and a buyer can check out on the live domain",
        team: "Harbor EU (SMB open-source store)",
        notPeer: "a fully hosted Shopify admin with no server ownership",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "shopware":
      return {
        noun: "open-source commerce platform",
        loop: "install Community Edition or book Rise, configure a sales channel, and complete a test order",
        setupFirst: "hosting or SaaS/PaaS path, GMV Fair Usage awareness, and one payment integration",
        migrateObjects: "products, customers, orders, and sales channels",
        prove: "a merchandiser can publish a Shopping Experience and a buyer can check out",
        team: "Northline DACH (mid-market Symfony stack)",
        notPeer: "a website builder or a POD sourcing app",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "printful":
      return {
        noun: "print-on-demand fulfillment / sourcing",
        loop: "connect a store, publish a mockup product, and route a test order to Printful fulfillment",
        setupFirst: "an existing storefront, Free or Growth plan, and one product design",
        migrateObjects: "synced products, branding assets, and open orders",
        prove: "a non-admin can publish a design and a paid order pushes to fulfillment",
        team: "Harbor Studio (POD brand on Shopify)",
        notPeer: "a full storefront platform or a US/EU physical-goods dropship marketplace",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "printify":
      return {
        noun: "print-on-demand fulfillment / sourcing",
        loop: "connect a store, pick a Printify Network provider, and route a test order",
        setupFirst: "an existing storefront, Free or Premium plan, and one product design",
        migrateObjects: "synced products and open orders",
        prove: "a non-admin can publish a design and a paid order routes to a provider",
        team: "Harbor Studio (multi-provider POD test)",
        notPeer: "a full storefront platform or Spocket-class physical supplier import",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "webflow":
      return {
        noun: "website-builder commerce",
        loop: "publish a Designer site, add a product on an Ecommerce plan, and complete a test checkout",
        setupFirst: "a Site plan plus Ecommerce Standard/Plus/Advanced, one collection, and Stripe or PayPal",
        migrateObjects: "CMS collections, products, and orders",
        prove: "a designer can update the storefront and a buyer can complete checkout without leaving Webflow",
        team: "Harbor Studio (visual-CMS brand shop)",
        notPeer: "a Shopify-class commerce OS or a retail POS bundle",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "lightspeed-retail":
      return {
        noun: "omnichannel POS + online store",
        loop: "ring an in-store sale on X-Series, sync the SKU to Lightspeed eCommerce, and see inventory match online",
        setupFirst: "one location, Basic/Core/Plus packaging, and Lightspeed Payments or a processor you will actually use",
        migrateObjects: "items, inventory, customer directory, and location settings",
        prove: "a store associate rings a sale and the website stock updates without a spreadsheet",
        team: "Harbor Retail (specialty store adding omnichannel)",
        notPeer: "an embeddable Ecwid cart or an online-only SaaS platform without POS hardware",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "opencart":
      return {
        noun: "open-source commerce platform",
        loop: "install the GPL core on hosting you control, add a product, and complete a test order",
        setupFirst: "hosting, SSL, one payment extension, and the modules you will actually buy",
        migrateObjects: "products, orders, customers, and extensions",
        prove: "a non-developer can add a product and a buyer can check out on the live domain",
        team: "Harbor Studio (SMB PHP open-source store)",
        notPeer: "a fully hosted Shopify admin or a WordPress-only plugin path",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "commercetools":
      return {
        noun: "composable enterprise commerce platform",
        loop: "stand up a project, model a catalog via APIs, and complete a test order on a composed storefront",
        setupFirst: "a sales quote or 60-day trial, one front-end owner, and a catalog slice",
        migrateObjects: "products, prices, customers, and order history",
        prove: "a merchandiser can update a SKU via the commerce engine and a test order completes",
        team: "Northline Enterprise (MACH / headless programme)",
        notPeer: "an SMB Shopify theme launch or a website builder",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "vtex":
      return {
        noun: "enterprise SaaS commerce platform",
        loop: "stand up a storefront sandbox, import a catalog slice, and complete a test order on the quoted package",
        setupFirst: "a talk-to-sales package, sandbox access, and an integrator owner",
        migrateObjects: "catalogs, customers, orders, and channel settings",
        prove: "a merchandiser can update a SKU and a test buyer can check out in sandbox",
        team: "Northline Mid-Market (hosted enterprise commerce)",
        notPeer: "an SMB published-tile Shopify Basic launch or a POD sourcing app",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "saleor":
      return {
        noun: "headless GraphQL open-source commerce",
        loop: "run OSS or Cloud Select, expose a catalog via GraphQL, and complete a test checkout on your storefront",
        setupFirst: "self-host or Cloud Select+, one payment integration, and a storefront you will actually ship",
        migrateObjects: "products, variants, customers, and orders",
        prove: "a developer can query the catalog and a test order completes on the composed front-end",
        team: "Northline Labs (headless GraphQL storefront)",
        notPeer: "a theme-first SMB SaaS admin or Forever Free as production Cloud",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "medusa":
      return {
        noun: "headless JS open-source commerce",
        loop: "run OSS or Cloud Launch, add a product module, and complete a test checkout on your storefront",
        setupFirst: "self-host or Cloud Develop/Launch, Stripe or a gateway, and a storefront you will ship",
        migrateObjects: "products, customers, and orders",
        prove: "a developer can publish a SKU and a test buyer can check out without leaving your front-end",
        team: "Harbor Labs (JS headless storefront)",
        notPeer: "a WordPress plugin cart or a Square POS bundle",
        categoryHowTo: "how to choose ecommerce software",
      };
    case "tiendanube":
      return {
        noun: "LATAM hosted SaaS storefront",
        loop: "publish a store on Inicial or Impulso, add a product, and complete a test checkout with regional payments",
        setupFirst: "Argentina (or local) plan tier, one payment method, and catalog you will sell",
        migrateObjects: "products, customers, and orders",
        prove: "a non-admin can add a SKU and a buyer can check out on the live domain",
        team: "Harbor LATAM (SMB regional store)",
        notPeer: "a separate Nuvemshop product page or a global Shopify Plus programme",
        categoryHowTo: "how to choose ecommerce software",
      };
    default:
      return {
        noun: "ecommerce software",
        loop: "publish a catalog item and complete a test order on the primary job you bought",
        setupFirst: "one store or connected storefront, one product, and the plan that unlocks checkout or imports",
        migrateObjects: "products, orders, and customers",
        prove: "a non-admin can complete the weekly job without a vendor screenshot",
        team: "Harbor Studio (early-stage merchant)",
        notPeer: "a CRM pipeline or an email marketing platform",
        categoryHowTo: "how to choose ecommerce software",
      };
  }
}

function featurePhrase(ctx: ProductGuideContext): string {
  if (ctx.supportedFeatureLabels.length === 0) {
    return ecomJob(ctx).setupFirst;
  }
  return joinList(ctx.supportedFeatureLabels, 4);
}

function coreLoopPhrase(ctx: ProductGuideContext): string {
  if (ctx.coreLoopLabels.length === 0) return ecomJob(ctx).loop;
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
    return `teams whose primary job is ${ecomJob(ctx).noun}`;
  }
  return clauses(ctx.bestFor, 4);
}

function notIdealPhrase(ctx: ProductGuideContext): string {
  if (ctx.notIdealFor.length === 0) {
    return `teams whose blocking job is ${ecomJob(ctx).notPeer}`;
  }
  return clauses(ctx.notIdealFor, 4);
}

function gatedHintSentence(ctx: ProductGuideContext): string {
  if (ctx.gatedFeatureHints.length === 0) {
    return `Our research does not flag plan-gated capabilities for ${ctx.productName}, but confirm your must-haves — including plans, processing, and apps — against the packaging you actually intend to buy.`;
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
  return `Our snapshot records no trial length for ${ctx.productName} — ask for an evaluation window in writing before you commit to a plan.`;
}

function integrationSentence(ctx: ProductGuideContext): string {
  if (ctx.integrationNames.length === 0) {
    return `Our research does not name specific ${ctx.productName} integrations, so verify payments, shipping, and channel connectors in the vendor directory before go-live.`;
  }
  return `Research names ${joinList(ctx.integrationNames, 5)} on the ${ctx.productName} side — confirm the connectors your commerce loop depends on.`;
}

function aiSentence(ctx: ProductGuideContext): string {
  if (!ctx.hasAi) {
    return `Our research does not list AI capabilities for ${ctx.productName}, so plan the rollout on the core ${ecomJob(ctx).noun} loop rather than assistance features.`;
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
  return `${ctx.productName} is evaluated here as ${ecomJob(ctx).noun} tooling — not a peer for every ecommerce job cluster.`;
}

function planSoftener(ctx: ProductGuideContext): string {
  if (ctx.hasPlanMatrix) return `Researched plans: ${planPhrase(ctx)}.`;
  return `${ctx.productName} is often sold on subscriptions, processing, apps, or quote packaging in our snapshot — treat homepage tiles as marketing, not a bill of materials. Confirm live packaging on the pricing page.`;
}

function pricingPointer(ctx: ProductGuideContext): string {
  return `Never invent list prices here — confirm plans, processing, and quote terms on ${ctx.pricingHref}.`;
}

function limitationLines(ctx: ProductGuideContext): string[] {
  const merged = [...ctx.reviewLimitations, ...ctx.enrichmentLimitations];
  const out: string[] = [];
  for (const line of merged) {
    if (!out.includes(line)) out.push(line);
  }
  return out;
}

function teachingFigure(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
  panel: 1 | 2 | 3 | 4,
  caption: string,
) {
  return {
    src: ctx.panelSrc(kind, panel),
    alt: `${ctx.productName} ${kind} diagram ${panel}.`,
    caption,
  };
}

/** Cluster-matched catalogue peers when a review has no alternativeSlugs. */
const ECOM_PEER_FALLBACK: Record<string, readonly string[]> = {
  shopify: ["bigcommerce", "woocommerce", "wix"],
  bigcommerce: ["shopify", "salesforce-commerce-cloud", "vtex"],
  woocommerce: ["shopify", "prestashop", "opencart"],
  "square-online": ["lightspeed-retail", "shopify", "ecwid"],
  spocket: ["alidrop", "printful", "printify"],
  alidrop: ["spocket", "printify", "printful"],
  magento: ["shopware", "commercetools", "saleor"],
  wix: ["squarespace", "webflow", "shopify"],
  squarespace: ["wix", "webflow", "shopify"],
  ecwid: ["wix", "shopify", "square-online"],
  "salesforce-commerce-cloud": ["vtex", "commercetools", "magento"],
  prestashop: ["shopware", "opencart", "woocommerce"],
  shopware: ["prestashop", "woocommerce", "magento"],
  printful: ["printify", "spocket", "alidrop"],
  printify: ["printful", "spocket", "alidrop"],
  webflow: ["wix", "squarespace", "shopify"],
  "lightspeed-retail": ["square-online", "shopify", "ecwid"],
  opencart: ["woocommerce", "prestashop", "magento"],
  commercetools: ["saleor", "medusa", "salesforce-commerce-cloud"],
  vtex: ["shopify", "bigcommerce", "salesforce-commerce-cloud"],
  saleor: ["medusa", "magento", "commercetools"],
  medusa: ["saleor", "shopify", "woocommerce"],
  tiendanube: ["shopify", "wix", "ecwid"],
};

function peerSlugs(ctx: ProductGuideContext): string[] {
  const merged: string[] = [];
  const fallback = ECOM_PEER_FALLBACK[ctx.productSlug] ?? [
    "shopify",
    "woocommerce",
    "wix",
  ];
  for (const slug of [...ctx.alternativeSlugs, ...fallback]) {
    if (slug === ctx.productSlug || merged.includes(slug)) continue;
    merged.push(slug);
    if (merged.length >= 4) break;
  }
  return merged;
}

function integrationSystems(ctx: ProductGuideContext): Array<{
  id: string;
  label: string;
}> {
  const named = ctx.integrationNames.slice(0, 5).map((label, i) => ({
    id: `int-${i + 1}`,
    label,
  }));
  const fallback = [
    { id: "payments", label: "Payments (card / wallet)" },
    { id: "shipping", label: "Shipping / fulfillment" },
    { id: "email", label: "Email / CRM" },
    { id: "analytics", label: "Analytics" },
  ];
  const merged = [...named];
  for (const item of fallback) {
    if (merged.length >= 4) break;
    if (
      !merged.some((x) => x.label.toLowerCase() === item.label.toLowerCase())
    ) {
      merged.push(item);
    }
  }
  return merged.slice(0, 6);
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
    plans: "Weigh these when you pick a plan, processing, and a qualifying tier.",
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
      ["plans", "Plans / TCO"],
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
        description: "Researched plans, processing, and sources.",
      },
      ...siblings,
      {
        href: "/guides/how-to-choose-ecommerce-software/",
        label: "How to choose ecommerce software",
        description: "Category selection framework by job cluster.",
      },
      {
        href: "/best/ecommerce-software/",
        label: "Best ecommerce software",
        description: "Editor’s picks by job cluster — not one ranking.",
      },
      {
        href: "/categories/ecommerce/",
        label: "Ecommerce category",
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
      body: `Ecommerce tools mix subscriptions, processing, apps, and quote terms. Use the researched pricing page — do not invent totals in a spreadsheet.`,
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
      body: `If ${ctx.productName} is close but not obvious, read how to choose ecommerce software and compare finalists inside the same job cluster — no affiliate-ordered rankings.`,
      href: "/guides/how-to-choose-ecommerce-software/",
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

function buildEcommerceSetupBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = ecomJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Set up ${name} in this order: qualify the plan you will actually buy, name one store owner, configure ${job.setupFirst}, connect the payments and shipping you depend on, then have a non-admin run ${job.prove}.${quickGateHint(ctx)} You’re done when that walkthrough works — not when every optional app is switched on.`,
      bullets: [
        `Start on ${startPlan(ctx)}`,
        "Name one store / ops owner",
        job.setupFirst,
        "Connect required payments / shipping / channels",
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
          label: "Do not treat it as every ecommerce job",
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
      heading: "Qualify plan and packaging",
      body: `${planSoftener(ctx)}\n\n${pricingPointer(ctx)}\n\nWorked example: ${job.team} lists everyone who must log in weekly before they invite “the whole company.”`,
      tip: "Homepage tiles are not a bill of materials.",
    },
    {
      type: "step",
      stepNumber: 2,
      id: "configure-loop",
      heading: "Configure one core loop",
      body: `Configure ${job.setupFirst}. Research-supported surfaces include ${coreLoopPhrase(ctx)}.\n\nWorked example: ${job.team} refuses optional modules until ${job.prove}.`,
      tip: "One loop in production beats five unused apps.",
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
        label: "Name a store / ops owner",
        description: "Catalog, users, and hygiene need a responsible party.",
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
          answer: `No. Extra apps hide whether the core ${job.noun} loop works.`,
        },
      ],
    },
    relatedLinks(ctx, "setup"),
    interactiveCta(ctx, "setup"),
  ]);
}

function buildEcommerceImplementationBlocks(
  ctx: ProductGuideContext,
): GuideBlockInput[] {
  const name = ctx.productName;
  const job = ecomJob(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Roll out ${name} in gated phases: freeze 90-day outcomes for ${job.noun}, name an owner, configure the core loop, train the people who must update it weekly, then review adoption before adding automations or extra apps.${quickGateHint(ctx)} Treat ${name} implementation as phases — not a feature dump in week one.`,
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
          body: `If ${job.team.split(" (")[0]} will not open the product weekly, extra apps will not save the rollout.`,
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
      body: `Configure ${job.setupFirst}. Success looks like: ${job.loop}.\n\nWorked example: ${job.team} delays optional AI and extra apps until the core loop has a week of real use.`,
      tip: "Week-one marketplace apps are a common failure mode.",
    },
    {
      type: "step",
      stepNumber: 2,
      id: "days-60",
      heading: "Days 31–60: train weekly users",
      body: `Train the people who must update ${name} every week — not a one-time all-hands. ${trialSentence(ctx)}\n\nWorked example: ${job.team} includes one sceptic user in training so adoption risk shows up before go-live speeches.`,
      tip: "If sceptics will not open it, fix the ritual before buying more apps.",
    },
    {
      type: "step",
      stepNumber: 3,
      id: "days-90",
      heading: "Days 61–90: adoption review",
      body: `Check whether the core loop is actually used. Only then add automations, extra apps, or AI.\n\nWorked example: ${job.team} reviews live orders, inventory, or imports (whichever matches ${job.noun}) before expanding scope.`,
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
          question: "What if we also need a different ecommerce job?",
          answer: `Buy the second job as a second product (or a later wave). ${name} should not be stretched into ${job.notPeer}.`,
        },
      ],
    },
    relatedLinks(ctx, "implementation"),
    interactiveCta(ctx, "implementation"),
  ]);
}

function buildEcommerceMigrationBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = ecomJob(ctx);
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
          body: `${name} is ${job.noun}. Do not import a CRM pipeline or a marketing course catalogue and expect it to become ${job.noun}.`,
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
      body: `List ${job.migrateObjects}. Map required fields and owners. ${pricingPointer(ctx)}\n\nWorked example: ${job.team} discovers duplicate SKUs or customer IDs in the spreadsheet before the first import — and fixes identity before volume.`,
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
      body: `Run old and new in parallel for a week. Spot-check records sceptic users care about, then freeze the legacy source.\n\nWorked example: ${job.team} keeps the old store or spreadsheet until ${name} matches for seven consecutive days.`,
      tip: "Cut over on a quiet day, not during a peak promo.",
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

function buildEcommercePlansBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = ecomJob(ctx);
  const alts = peerSlugs(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Choose a ${name} plan by listing day-one must-haves for ${job.noun}, mapping them to a qualifying tier — subscription, processing, apps, GMV, or quote packaging included — then proving the loop on that package before you buy.${quickGateHint(ctx)} Homepage “from” tiles are not a bill of materials. ${pricingPointer(ctx)}`,
      bullets: [
        "List day-one must-haves",
        "Map to a researched qualifying plan",
        "Price processing, apps, and GMV you will actually use",
        "Prove the loop on the package you will buy",
        "Get the qualifying configuration in writing",
        "Never invent a spreadsheet total in this guide",
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
          label: "Prove on the package you will buy",
          body: trialSentence(ctx),
        },
        {
          label: "Job cluster first",
          body: `Must-haves should match ${job.loop}. Do not pay for hubs that serve ${job.notPeer}.`,
        },
      ],
    },
    {
      type: "decision-framework",
      id: "plans-path",
      title: `${name} plan path`,
      steps: [
        { id: "musts", label: "Must-haves", short: "Day one" },
        { id: "map", label: "Map", short: "Qualifying tier" },
        { id: "prove", label: "Prove", short: "Same package" },
        { id: "quote", label: "Quote", short: "In writing" },
      ],
      ctaHref: ctx.pricingHref,
      ctaLabel: "Pricing page →",
    },
    {
      type: "figure",
      id: "plans-diagram",
      title: `${name} plan anatomy`,
      src: ctx.figureSrc("plans"),
      alt: `${name} plan anatomy: subscription, processing, gates, apps.`,
      caption: `Read ${name} pricing from must-have gates upward; confirm numbers on the pricing page.`,
    },
    {
      type: "cost-breakdown",
      id: "plans-cost-shape",
      title: `What actually shapes a ${name} bill`,
      body: `We do not invent list prices here. Use this anatomy, then confirm live numbers on the ${name} pricing page.`,
      lines: [
        {
          label: "Subscription / hub",
          description:
            "The researched plan that unlocks checkout, imports, or sales channels — not the homepage starter tile.",
        },
        {
          label: "Processing / GMV",
          description:
            "Transaction fees, payment plans, and any GMV bands. Confirm whether the vendor’s processor is cheaper than yours.",
        },
        {
          label: "Apps, modules, themes",
          description: gatedHintSentence(ctx),
        },
        {
          label: "Hosting / implementation",
          description:
            "Open-source and enterprise paths add hosting or integrator hours — get fees in writing; do not invent them.",
        },
        {
          label: "AI / extras",
          description: aiSentence(ctx),
        },
      ],
      calculatorHref: ctx.pricingHref,
      calculatorLabel: `Open ${name} pricing →`,
    },
    {
      type: "size-match",
      id: "plans-size",
      title: `Who ${name} packaging usually fits`,
      tiers: [
        {
          id: "small",
          label: "Early catalog / one channel",
          description: `Fits when ${job.noun} is the job and you can live without enterprise multi-storefront or composable programmes.`,
          fitHints: [
            "One store or connected storefront",
            "Named merchandiser",
            "Payments you will actually use",
          ],
        },
        {
          id: "mid",
          label: "Growing catalog / omnichannel",
          description:
            "Fits when inventory, channels, or GMV gates matter and someone will admin the store weekly.",
          fitHints: [
            "Named store owner hours",
            "Must-haves mapped to a qualifying hub",
            "Stop shadow spreadsheets for stock",
          ],
        },
        {
          id: "scale",
          label: "Quote-led / multi-store",
          description: `Fits only if ${name} is still ${job.noun} at that scale — not if you actually needed ${job.notPeer}.`,
          fitHints: [
            "Written qualifying configuration",
            "GMV / processing rules",
            "Adoption review before more apps",
          ],
        },
      ],
    },
    mustNiceMatrix(ctx, "plans", [
      {
        feature: "Core loop on the qualifying plan",
        mustHave: true,
        niceToHave: false,
        notes: job.loop,
      },
      {
        feature: "Payments / shipping / channels for day one",
        mustHave: true,
        niceToHave: false,
        notes: "Do not buy a cheaper tile that blocks checkout or imports",
      },
      {
        feature: featurePhrase(ctx),
        mustHave: true,
        niceToHave: false,
        notes: "Map each capability to a researched plan name",
      },
      {
        feature: "AI / extra apps",
        mustHave: false,
        niceToHave: true,
        notes: aiSentence(ctx),
      },
    ]),
    {
      type: "step",
      stepNumber: 1,
      id: "list-musts",
      heading: "List day-one must-haves for this job cluster",
      body: `Must-haves should match ${job.loop}. Research-supported features include ${featurePhrase(ctx)}.\n\n1. Write five things the store must do in week one.\n2. Mark each must vs nice.\n3. Drop anything that is actually ${job.notPeer}.\n\nWorked example: ${job.team} drops a cheaper tile when the must-have workflow unlocks only on a higher hub.`,
      tip: "A must-have you will not use in 90 days is a nice-to-have in disguise. If more than eight items are must-haves, you are still in wishlist mode.",
      figure: teachingFigure(
        ctx,
        "plans",
        1,
        `Start ${name} packaging from the ${job.noun} loop — not from a “from” tile.`,
      ),
      scenarios: [
        {
          title: "Honest musts",
          body: "Five jobs, all used weekly — catalog, checkout, and the channel you sell on.",
        },
        {
          title: "Wishlist",
          body: "Twelve musts including unused AI and marketplace apps — cut to five.",
        },
        {
          title: "Wrong job",
          body: `If musts describe ${job.notPeer}, this product’s packaging will not save you.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 2,
      id: "map-tier",
      heading: "Map must-haves to a researched qualifying plan",
      body: `${planSoftener(ctx)}\n\n1. For each must-have, write the lowest researched ${name} plan that includes it. ${gatedHintSentence(ctx)}\n2. The highest plan on that list is the qualifying tier — not the homepage starter tile.\n3. Check processing, GMV bands, and extra storefronts separately.\n\n${pricingPointer(ctx)}\n\nWorked example: ${job.team} discovers checkout, imports, or a sales channel force a higher hub than the tile they screenshotted, so they re-qualify before a trial.`,
      tip: "The qualifying plan is the cheapest tier that covers must-haves — not the cheapest logo on the pricing grid.",
      figure: teachingFigure(
        ctx,
        "plans",
        2,
        `Map ${name} must-haves upward until every day-one job unlocks.`,
      ),
      scenarios: [
        {
          title: "Mapped",
          body: "Every must-have has a researched plan name.",
        },
        {
          title: "Tile shopping",
          body: "You compared “from” prices across vendors — restart from must-haves.",
        },
        {
          title: "Quote-only",
          body: "If there is no public matrix, get the configuration in writing before you call it cheap.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 3,
      id: "prove-package",
      heading: "Prove the loop on the package you will buy",
      body: `${trialSentence(ctx)}\n\n1. Run ${job.prove} on the qualifying hub — not a demo enterprise workspace.\n2. Confirm processing and app behaviour if they change the bill.\n3. Write the configuration: plan, processing, apps, billing term.\n\nWorked example: ${job.team} fails the gate when the trial ran Plus features they will not purchase. They restart the trial on the written package.`,
      tip: "A trial on the wrong hub is a marketing exercise.",
      figure: teachingFigure(
        ctx,
        "plans",
        3,
        `Trial ${name} on the qualifying package — not the demo’s extra hubs.`,
      ),
      scenarios: [
        {
          title: "Honest trial",
          body: "Loop works on the hub you will pay for.",
        },
        {
          title: "Inflated trial",
          body: "Ask the vendor which package the tenant is on, in writing.",
        },
        {
          title: "Free-plan trap",
          body: "Free is a proving ground only if must-haves actually live there.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 4,
      id: "quote",
      heading: "Get the qualifying configuration in writing",
      body: `1. Plan / hub (weekly operators only).\n2. Processing and GMV rules.\n3. Apps and add-ons the trial proved.\n4. Implementation, hosting, or onboarding fees if any — do not invent them.\n5. Annual vs monthly only after the configuration is frozen.\n\nWorked example: ${job.team} will not sign until the qualifying hub and processing rules are in an email they can attach to the buy decision. ${ctx.alternativeNames.length > 0 ? `If packaging stays vague, they also keep ${joinList(ctx.alternativeNames, 3)} on the same must-have sheet.` : `Catalogue peers in the same cluster include ${alts.join(", ")}.`}`,
      tip: "Annual discounts do not fix the wrong hub.",
      figure: teachingFigure(
        ctx,
        "plans",
        4,
        `Buy ${name} from a written configuration — never from a homepage tile.`,
      ),
      scenarios: [
        {
          title: "Written",
          body: "Plan, processing, apps, term — attached to the decision.",
        },
        {
          title: "Verbal extra",
          body: "If a feature was “included in the demo,” it is not included until it is written.",
        },
        {
          title: "Walk",
          body: "If packaging stays vague, keep looking via how to choose ecommerce software.",
        },
      ],
    },
    {
      type: "product-shortlist",
      id: "plans-shortlist",
      title: "Compare qualifying configurations inside the same cluster",
      body: `Do not rank ${name} (${job.noun}) against ${job.notPeer} on a single price tile.`,
      productSlugs: alts,
      disclaimer:
        "Shortlist is cluster-matched from the catalogue — not an affiliate-ordered ranking and not a score.",
    },
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
        id: "prove",
        label: "Prove the loop on that package",
        description: "Trial the hub you will buy, before you buy.",
      },
      {
        id: "quote",
        label: "Get the qualifying quote in writing",
        description: "Plans, processing, apps, and implementation fees.",
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
        {
          question: "How do we treat processing and GMV?",
          answer:
            "Model the constraint you will hit first — subscription, transaction fees, or a GMV band. Confirm both on the pricing page; do not invent a blended rate here.",
        },
        {
          question: "Can we compare “from” prices across tools?",
          answer:
            "Not usefully. Compare qualifying configurations for the same must-haves. Tiles omit gates.",
        },
        {
          question: "Where are the actual numbers?",
          answer: pricingPointer(ctx),
        },
      ],
    },
    relatedLinks(ctx, "plans"),
    interactiveCta(ctx, "plans"),
  ]);
}

function buildEcommerceWorthItBlocks(ctx: ProductGuideContext): GuideBlockInput[] {
  const name = ctx.productName;
  const job = ecomJob(ctx);
  const alts = peerSlugs(ctx);
  return compact([
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `${name} is worth it when your primary job is ${job.noun}, a non-admin can ${job.prove} on the package you will buy, and you can live with the researched tradeoffs. It is not worth stretching into ${job.notPeer}.${quickGateHint(ctx)} If fit, proof, or packaging fails before you buy, keep looking — do not invent ROI to justify a shaky checkout.`,
      bullets: [
        "Fit the job cluster",
        "Prove the core loop with a non-admin",
        "Accept tradeoffs in writing",
        "Confirm the qualifying package",
        "Name a store owner with weekly hours",
        "Otherwise keep looking",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: `Is ${name} worth it?`,
      items: compact([
        {
          label: "What it is",
          body: positioningSentence(ctx),
        },
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
        ctx.verdict
          ? { label: "Editorial verdict snapshot", body: ctx.verdict }
          : ctx.recommendation
            ? { label: "Editorial recommendation", body: ctx.recommendation }
            : null,
      ]) as Array<{ label: string; body?: string }>,
    },
    {
      type: "decision-framework",
      id: "worth-it-path",
      title: `${name} worth-it gates`,
      steps: [
        { id: "fit", label: "Fit", short: "Job cluster" },
        { id: "proof", label: "Proof", short: "Non-admin loop" },
        { id: "tradeoffs", label: "Tradeoffs", short: "Accept?" },
        { id: "package", label: "Package", short: "Qualifying hub" },
        { id: "decide", label: "Decide", short: "Buy/pass" },
      ],
      ctaHref: ctx.reviewHref,
      ctaLabel: "Full review →",
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
      type: "selection-checklist",
      id: "worth-it-dimensions",
      title: `${name} fit checklist`,
      dimensions: [
        {
          id: "job",
          label: "Primary job",
          options: [job.noun, job.notPeer, "not sure yet"],
        },
        {
          id: "operators",
          label: "Who updates the catalog weekly",
          options: [
            "named merchandiser will live in it",
            "founders only",
            "nobody has hours",
          ],
        },
        {
          id: "owner",
          label: "Store / ops owner",
          options: [
            "~2 hours/week named",
            "committee / TBD",
            "agency will admin forever",
          ],
        },
        {
          id: "channel",
          label: "Selling motion",
          options: [
            "one online storefront",
            "POS + online inventory",
            "sourcing into an existing cart",
          ],
        },
      ],
    },
    {
      type: "crm-types",
      id: "job-clusters",
      title: "Do not buy the wrong ecommerce job cluster",
      types: [
        {
          id: "hosted-saas",
          title: "Hosted SaaS storefront",
          bestFor:
            "Published plans, theme + app ecosystems, and a merchant admin without owning servers.",
          avoidWhen:
            "You needed brick-and-mortar POS as the system of record, or you still only needed a sourcing app.",
        },
        {
          id: "open-source",
          title: "Open-source / headless commerce",
          bestFor:
            "You will own hosting or a composed storefront, and engineers can ship catalog + checkout.",
          avoidWhen:
            "You wanted a theme admin with no developers, or a website-builder commerce tile.",
        },
        {
          id: "pos",
          title: "Omnichannel POS + online store",
          bestFor:
            "In-store inventory is the system of record and the website should follow that catalog.",
          avoidWhen:
            "You only needed an embeddable cart or an online-only SaaS platform without hardware.",
        },
        {
          id: "builder",
          title: "Website-builder commerce",
          bestFor:
            "Site design is the product and a modest catalog rides along on the same CMS.",
          avoidWhen:
            "Checkout complexity, B2B rules, or marketplace apps are the center of gravity.",
        },
        {
          id: "sourcing",
          title: "POD / dropship sourcing",
          bestFor:
            "You already have a storefront and need print or supplier fulfillment behind it.",
          avoidWhen:
            "You still need a cart, a POS, or a full commerce OS.",
        },
      ],
    },
    mustNiceMatrix(ctx, "worth-it", [
      {
        feature: "Job-cluster fit",
        mustHave: true,
        niceToHave: false,
        notes: job.noun,
      },
      {
        feature: "Non-admin loop",
        mustHave: true,
        niceToHave: false,
        notes: job.prove,
      },
      {
        feature: "Qualifying package",
        mustHave: true,
        niceToHave: false,
        notes: gatedHintSentence(ctx),
      },
      {
        feature: "Demo excitement / brand preference",
        mustHave: false,
        niceToHave: true,
        notes: "Not a buy signal",
      },
    ]),
    {
      type: "size-match",
      id: "worth-it-size",
      title: `When ${name} is the right size of tool`,
      tiers: [
        {
          id: "fit-size",
          label: "Likely worth evaluating",
          description: `Your motion looks like ${job.noun} and someone will admin ${name} weekly.`,
          fitHints: [bestForPhrase(ctx)],
        },
        {
          id: "stretch",
          label: "Borderline — trial hard",
          description:
            "Needs are real but store-owner capacity is thin, or one must-have sits on a higher hub.",
          fitHints: [
            "Set a decide-by date",
            "Prove the loop on the qualifying package",
          ],
        },
        {
          id: "skip",
          label: "Usually not worth it",
          description: `The blocking job is ${job.notPeer}, or nobody will update the catalog.`,
          fitHints: [notIdealPhrase(ctx)],
        },
      ],
    },
    {
      type: "integration-ecosystem",
      id: "worth-it-integrations",
      title: `${name} connectors to verify in trial`,
      hubLabel: "Commerce",
      systems: integrationSystems(ctx),
      body: integrationSentence(ctx),
    },
    {
      type: "comparison-framework",
      id: "worth-it-criteria",
      title: `How to judge ${name} against peers`,
      criteria: [
        {
          id: "cluster",
          label: "Job-cluster match",
          weight: 5,
          description: `Does the product’s primary job match ${job.noun}?`,
        },
        {
          id: "loop",
          label: "Non-admin loop",
          weight: 5,
          description: job.prove,
        },
        {
          id: "ops",
          label: "Store ops visibility",
          weight: 4,
          description:
            "A merchandiser or associate can complete the weekly job without an admin screenshot.",
        },
        {
          id: "package",
          label: "Qualifying packaging",
          weight: 4,
          description: "Must-haves on a real tier; processing and apps understood.",
        },
        {
          id: "admin",
          label: "Admin load",
          weight: 3,
          description: "Someone has weekly hours; catalog hygiene is possible.",
        },
      ],
    },
    {
      type: "scorecard",
      id: "worth-it-scorecard",
      title: `${name} evaluation scorecard (no invented scores)`,
      body: `Weight the criteria; fill scores from your trial — SoftwareGlimpse does not invent a numeric ROI or a “worth it %.”`,
      criteria: [
        { id: "fit", label: "Job-cluster fit", weight: 5 },
        { id: "proof", label: "Non-admin proof", weight: 5 },
        { id: "package", label: "Qualifying package", weight: 4 },
        { id: "admin", label: "Admin capacity", weight: 3 },
        { id: "tradeoffs", label: "Accepted tradeoffs", weight: 3 },
      ],
      productSlugs: [ctx.productSlug, ...alts.slice(0, 2)],
    },
    {
      type: "product-shortlist",
      id: "worth-it-shortlist",
      title: "If fit fails, compare inside the same cluster",
      body: `Do not rank ${name} against ${job.notPeer}. Stay in the same job cluster.`,
      productSlugs: alts,
      disclaimer:
        "Shortlist is cluster-matched from the catalogue — not an affiliate-ordered ranking and not a score.",
    },
    phaseChecklist(ctx, "worth-it", [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: `Your motion should be ${job.noun}.`,
      },
      {
        id: "trial",
        label: "Prove the commerce loop",
        description: job.prove,
      },
      {
        id: "plan",
        label: "Confirm plan and TCO",
        description: "Must-haves on a real tier before you call it a bargain.",
      },
      {
        id: "decide",
        label: "Write buy · extend · pass",
        description: "One page, named reasons, no invented ROI.",
      },
    ]),
    researchCallout(ctx, "worth-it"),
    {
      type: "step",
      stepNumber: 1,
      id: "fit-gate",
      heading: "Fit gate: does your motion match this job cluster?",
      body: `Answer yes or no. Four or more “no” answers means ${name} is the wrong tool right now — decide that before you buy.\n\n1. Is your primary job ${job.noun} — not ${job.notPeer}?\n2. Best for: ${bestForPhrase(ctx)}.\n3. Not ideal: ${notIdealPhrase(ctx)}.\n4. Will a named merchandiser update ${name} weekly?\n5. Is there a store owner with ~2 hours a week?\n\nWorked example: ${job.team} scores ${name} on ${job.noun} only — they refuse to treat it as ${job.notPeer}. A polished demo does not change the score.`,
      tip: "Demo excitement is not a fit signal.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        1,
        `Fit ${name} to ${job.noun} before you talk ROI.`,
      ),
      scenarios: [
        {
          title: "Strong fit",
          body: "Motion matches best-for; store owner named; operators will live in it.",
        },
        {
          title: "Borderline",
          body: "Needs are real but admin capacity is thin — trial hard, set a decide-by date.",
        },
        {
          title: "Poor fit",
          body: `Poor-fit patterns dominate — compare ${joinList(ctx.alternativeNames, 2) || alts.join(", ")} inside the same cluster.`,
        },
      ],
    },
    {
      type: "step",
      stepNumber: 2,
      id: "trial-proof",
      heading: "Proof gate: scripted non-admin loop — not a guided demo",
      body: `${trialSentence(ctx)}\n\nSuccess: ${job.prove}.\n\n1. Use real catalog, not sample products.\n2. Give the loop to the least enthusiastic operator.\n3. A founder or store lead must see the result without an admin screenshot.\n4. Break something on purpose (variant, inventory, test order) and time the recovery.\n\nWorked example: ${job.team} fails the gate when only an admin can complete the walkthrough; they extend trial and fix permissions before considering buy.`,
      tip: "Vendor tours do not count as proof. A demo proves the vendor can use the product.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        2,
        `${name} is worth it only when your team can run the loop.`,
      ),
      scenarios: [
        {
          title: "Trial pass",
          body: "Non-admin loop works; a test order or import completes.",
        },
        {
          title: "Trial ambiguous",
          body: "Extend once with one written question that would close it.",
        },
        {
          title: "Trial fail",
          body: "Operators need babysitting for a basic SKU or checkout — that does not improve after purchase.",
        },
      ],
    },
    {
      type: "trial-plan",
      id: "worth-it-trial-script",
      title: `${name} evaluation script`,
      days: [
        {
          day: 1,
          focus: "Honest store",
          tasks: [
            `Confirm which ${name} package the trial tenant is on`,
            `Stand up ${job.setupFirst}`,
            "Invite only weekly operators plus one sceptic",
          ],
        },
        {
          day: 3,
          focus: "Non-admin loop",
          tasks: [
            job.prove,
            "Lead finds the test order or import without a screenshot",
            "Write down every question asked",
          ],
        },
        {
          day: 7,
          focus: "Weekly ritual",
          tasks: [
            `Run one merchandising or fulfillment pass entirely in ${name}`,
            "Change a variant or inventory row and check history",
            `Test: ${featurePhrase(ctx)}`,
          ],
        },
        {
          day: 14,
          focus: "Decide",
          tasks: [
            "Score fit, proof, package, admin capacity",
            `Confirm qualifying plan on ${ctx.pricingHref}`,
            "Write buy, extend (one condition), or pass",
          ],
        },
      ],
    },
    {
      type: "step",
      stepNumber: 3,
      id: "tradeoffs",
      heading: "Tradeoff gate: label every watch-out",
      body: `Strengths: ${ctx.strengths.length > 0 ? clauses(ctx.strengths, 4) : `Confirm strengths in the ${name} review.`}.\nWatch-outs: ${ctx.weaknesses.length > 0 ? clauses(ctx.weaknesses, 4) : limitationLines(ctx).length > 0 ? clauses(limitationLines(ctx), 4) : `Confirm limitations in research before you buy ${name}.`}.\n\n1. Sort each watch-out: acceptable · mitigable (named owner + date) · disqualifying.\n2. Treat strengths as trial claims, not facts.\n3. If a disqualifier appears in trial, stop.\n\nWorked example: ${job.team} documents known gaps instead of pretending ${name} covers every ecommerce job.`,
      tip: "Unspoken tradeoffs become renewal fights.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        3,
        `Accept ${name} tradeoffs in writing — or keep looking.`,
      ),
      scenarios: [
        {
          title: "Acceptable",
          body: "You can name why it does not hit your three outcomes.",
        },
        {
          title: "Mitigable",
          body: "Owner, cost, and date attached — or it is not a mitigation.",
        },
        {
          title: "Disqualifying",
          body: "It blocks the job — compare peers in the same cluster.",
        },
      ],
    },
    {
      type: "step",
      stepNumber: 4,
      id: "decide",
      heading: "Package gate and write buy · extend · pass",
      body: `1. Confirm must-haves on a qualifying package. ${gatedHintSentence(ctx)}\n2. ${pricingPointer(ctx)}\n3. Name the store owner and weekly hours.\n4. Buy only when fit + proof + package all say yes.\n5. Otherwise keep looking via ${job.categoryHowTo} — ${ctx.alternativeNames.length > 0 ? `teams often also evaluate ${joinList(ctx.alternativeNames, 3)}` : `compare ${alts.join(", ")} inside the same job cluster`}.\n\nWorked example: ${job.team} clears fit and proof but pauses the buy until hub and processing rules are written. They do not invent an ROI percentage to unblock procurement.`,
      tip: "No invented ROI — outcomes, usability, and qualifying cost either align or they don’t.",
      figure: teachingFigure(
        ctx,
        "worth-it",
        4,
        `Buy ${name} only when fit, proof, and package gates agree.`,
      ),
      scenarios: [
        {
          title: "Buy",
          body: "Fit, proof, package, and admin hours all written.",
        },
        {
          title: "Extend",
          body: "One closing question and a date — not an open-ended demo.",
        },
        {
          title: "Pass",
          body: "Wrong cluster or failed proof — that is a successful evaluation.",
        },
      ],
    },
    {
      type: "mistakes",
      id: "worth-it-mistakes",
      title: `Ways teams wrongly decide ${name} is “worth it”`,
      items: [
        {
          title: "Inventing ROI in a spreadsheet",
          body: "SoftwareGlimpse does not publish a worth-it percentage. If fit, proof, or package fails, the honest answer is no.",
        },
        {
          title: "Buying from a demo high",
          body: "Demos are run by people who live in the product. Your sceptic merchandiser is the test.",
        },
        {
          title: "Stretching the job cluster",
          body: `${name} as ${job.notPeer} is how you end up with a second tool and a messy catalog.`,
        },
        {
          title: "Confusing sibling products",
          body: `Do not assume a similarly named ${name} SKU, regional brand, or adjacent app is the same job cluster. Confirm the product hub.`,
        },
        {
          title: "Skipping the qualifying hub",
          body: "If the loop only works on a plan you will not buy, it is not worth it at the tile you liked.",
        },
      ],
    },
    {
      type: "cost-breakdown",
      id: "worth-it-cost-shape",
      title: "Commercial clarity without invented totals",
      body: `Worth-it includes cost you can actually qualify. Confirm numbers on the pricing page before you buy.`,
      lines: [
        {
          label: "Qualifying plan",
          description: "Weekly operators on the hub that unlocks the loop.",
        },
        {
          label: "Processing / GMV",
          description: "Confirm whether vendor payments or third-party fees change the bill.",
        },
        {
          label: "Apps that unlock the loop",
          description: gatedHintSentence(ctx),
        },
        {
          label: "Admin time",
          description:
            "~2 hours/week is a real cost even when it is not on the invoice.",
        },
      ],
      calculatorHref: ctx.pricingHref,
      calculatorLabel: `Open ${name} pricing →`,
    },
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
          question: "Does SoftwareGlimpse invent a score here?",
          answer:
            "No. This page is a qualitative gate (fit, proof, package). Criterion scores live on the product review. We do not invent ROI percentages or affiliate-ordered rankings.",
        },
        {
          question: "When should we walk away?",
          answer: `When fit, trial proof, or written packaging fails — or when the real job is ${job.notPeer}. Walking away is a successful evaluation.`,
        },
        {
          question: "What if leadership already picked it?",
          answer: `Still run the gates. A pre-chosen tool that fails non-admin proof becomes a status-meeting tax. Put the failed gate in writing.`,
        },
        {
          question: "How do we compare alternatives?",
          answer: `Use ${job.categoryHowTo} and stay inside the same job cluster. ${ctx.alternativeNames.length > 0 ? `Teams often also evaluate ${joinList(ctx.alternativeNames, 3)}.` : `Catalogue peers include ${alts.join(", ")}.`} Do not rank a storefront against a sourcing app.`,
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

export function buildEcommerceBlocksForKind(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  return tidyStrings(ecommerceBlocksForKind(ctx, kind));
}

function ecommerceBlocksForKind(
  ctx: ProductGuideContext,
  kind: CrmProductGuideKind,
): GuideBlockInput[] {
  switch (kind) {
    case "implementation":
      return buildEcommerceImplementationBlocks(ctx);
    case "migration":
      return buildEcommerceMigrationBlocks(ctx);
    case "setup":
      return buildEcommerceSetupBlocks(ctx);
    case "plans":
      return buildEcommercePlansBlocks(ctx);
    case "worth-it":
      return buildEcommerceWorthItBlocks(ctx);
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
