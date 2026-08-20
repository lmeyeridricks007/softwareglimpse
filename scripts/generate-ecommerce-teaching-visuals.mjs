#!/usr/bin/env node
/**
 * Generate ecommerce hub teaching PNGs via SVG → sharp (1536×1024).
 * Category hub, 7 use cases (hero/needs/workflow), and 3 guide heroes.
 * Skips existing files larger than 900KB (premium GenerateImage assets).
 *
 * Usage: node scripts/generate-ecommerce-teaching-visuals.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const W = 1536;
const H = 1024;

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function heroSvg(title, subtitle, panels) {
  const cards = panels
    .map((p, i) => {
      const cols = panels.length <= 3 ? panels.length : 3;
      const x = 64 + (i % cols) * (cols === 2 ? 720 : cols === 3 ? 480 : 1408);
      const y = 220 + Math.floor(i / cols) * 280;
      const cardW = cols === 2 ? 680 : cols === 3 ? 440 : 1408;
      return `
      <rect x="${x}" y="${y}" width="${cardW}" height="240" rx="16" fill="#ffffff" stroke="#c9d9ea" stroke-width="2"/>
      <text x="${x + 24}" y="${y + 48}" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#12324f">${escapeXml(p.t)}</text>
      <text x="${x + 24}" y="${y + 88}" font-family="Arial, sans-serif" font-size="16" fill="#4a6780">${escapeXml(p.d)}</text>
      <text x="${x + 24}" y="${y + 120}" font-family="Arial, sans-serif" font-size="14" fill="#5a738a">${escapeXml(p.d2 ?? "")}</text>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f5f9fc"/>
      <stop offset="100%" stop-color="#e7eef6"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <text x="64" y="72" font-family="Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="2" fill="#1e4d7b">SOFTWAREGLIMPSE · ECOMMERCE</text>
  <text x="64" y="118" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#12324f">${escapeXml(title)}</text>
  <text x="64" y="162" font-family="Arial, sans-serif" font-size="20" fill="#4a6780">${escapeXml(subtitle)}</text>
  ${cards}
</svg>`;
}

function needsSvg(title, subtitle, pairs) {
  const rows = pairs
    .map((p, i) => {
      const y = 200 + i * 120;
      return `
      <rect x="64" y="${y}" width="680" height="100" rx="14" fill="#fff8ef" stroke="#f0d4a8" stroke-width="2"/>
      <text x="96" y="${y + 42}" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#8a5a12">${escapeXml(p.problem)}</text>
      <text x="96" y="${y + 72}" font-family="Arial, sans-serif" font-size="16" fill="#6b5428">${escapeXml(p.problemDetail)}</text>
      <path d="M780 ${y + 50} H820" stroke="#7ea0c0" stroke-width="3" marker-end="url(#arrow)"/>
      <rect x="840" y="${y}" width="632" height="100" rx="14" fill="#eefaf4" stroke="#b7e0c8" stroke-width="2"/>
      <text x="872" y="${y + 42}" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#1a6b45">${escapeXml(p.fix)}</text>
      <text x="872" y="${y + 72}" font-family="Arial, sans-serif" font-size="16" fill="#2f5c48">${escapeXml(p.fixDetail)}</text>
      `;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f5f9fc"/>
      <stop offset="100%" stop-color="#e7eef6"/>
    </linearGradient>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#7ea0c0"/>
    </marker>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <text x="64" y="88" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#12324f">${escapeXml(title)}</text>
  <text x="64" y="132" font-family="Arial, sans-serif" font-size="20" fill="#4a6780">${escapeXml(subtitle)}</text>
  <text x="96" y="175" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#8a5a12">Problems</text>
  <text x="872" y="175" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#1a6b45">Ecommerce software fixes</text>
  ${rows}
</svg>`;
}

function flowSvg(title, steps) {
  const nodes = steps
    .map((s, i) => {
      const x = 64 + i * 290;
      return `
      <rect x="${x}" y="340" width="250" height="200" rx="14" fill="#ffffff" stroke="#c9d9ea" stroke-width="2"/>
      <circle cx="${x + 36}" cy="390" r="22" fill="#1e4d7b"/>
      <text x="${x + 36}" y="396" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#ffffff">${i + 1}</text>
      <text x="${x + 70}" y="396" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#12324f">${escapeXml(s.t)}</text>
      <text x="${x + 24}" y="450" font-family="Arial, sans-serif" font-size="15" fill="#4a6780">${escapeXml(s.d)}</text>
      <text x="${x + 24}" y="480" font-family="Arial, sans-serif" font-size="14" fill="#5a738a">${escapeXml(s.d2 ?? "")}</text>
      ${i < steps.length - 1 ? `<path d="M${x + 260} 440 H${x + 290}" stroke="#7ea0c0" stroke-width="3" marker-end="url(#arrow)"/>` : ""}
      `;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f7fafc"/>
      <stop offset="100%" stop-color="#e8f0f7"/>
    </linearGradient>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#7ea0c0"/>
    </marker>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <text x="64" y="100" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#12324f">${escapeXml(title)}</text>
  <text x="64" y="148" font-family="Arial, sans-serif" font-size="20" fill="#4a6780">Practical buyer workflow — storefront / POS / sourcing</text>
  ${nodes}
</svg>`;
}

async function writePng(relPath, svg) {
  const out = path.join(ROOT, "public", relPath);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (fs.existsSync(out) && fs.statSync(out).size > 900_000) {
    console.log("skip existing premium", relPath);
    return;
  }
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 6, adaptiveFiltering: true })
    .toFile(out);
  console.log("wrote", relPath, fs.statSync(out).size);
}

const categoryPack = {
  title: "Ecommerce software jobs",
  subtitle: "Pick the job first — hosted storefront, open-source cart, omnichannel POS, or sourcing app",
  panels: [
    { t: "Hosted SaaS", d: "Shopify / BigCommerce class", d2: "Storefront + checkout + channels" },
    { t: "Open-source cart", d: "WooCommerce on WordPress", d2: "You own hosting and plugins" },
    { t: "Omnichannel POS", d: "Square-class retail + online", d2: "In-person inventory is the hub" },
    { t: "Dropshipping apps", d: "Spocket / AliDrop class", d2: "Imports — not a storefront" },
    { t: "Catalog & orders", d: "Variants, inventory, fulfillment", d2: "Depth varies by platform" },
    { t: "TCO, not list price", d: "Apps + processing + themes", d2: "Model the real monthly bill" },
  ],
  pairs: [
    {
      problem: "Undifferentiated ranking",
      problemDetail: "Shopify vs Spocket as peers",
      fix: "Job-first shortlist",
      fixDetail: "Storefront ≠ sourcing app",
    },
    {
      problem: "Sticker-price shopping",
      problemDetail: "$29/mo vs free plugin",
      fix: "Qualify TCO",
      fixDetail: "Processing + apps + hosting",
    },
    {
      problem: "POS as an afterthought",
      problemDetail: "Retail inventory split",
      fix: "Omnichannel stack",
      fixDetail: "One catalog, online + in store",
    },
    {
      problem: "Sourcing without a store",
      problemDetail: "Import tools need a cart",
      fix: "Pair the jobs",
      fixDetail: "Storefront + dropship app",
    },
  ],
  workflow: [
    { t: "Job", d: "Store vs POS", d2: "vs sourcing" },
    { t: "Shortlist", d: "2–3 platforms", d2: "same cluster" },
    { t: "Catalog", d: "Variants / B2B", d2: "depth check" },
    { t: "Checkout", d: "Rates + Shop Pay", d2: "or open gateway" },
    { t: "TCO trial", d: "Apps + fees", d2: "before migrate" },
  ],
};

const useCasePacks = {
  "online-storefront": {
    title: "Online storefront needs",
    heroTitle: "Launch a branded online store",
    heroSubtitle: "Themes, product pages, domain, and buyer checkout — without running your own servers",
    panels: [
      { t: "Theme storefront", d: "Brand pages and collections", d2: "Hosted or WordPress" },
      { t: "Catalog live", d: "Products, variants, media", d2: "SEO-ready URLs" },
      { t: "Checkout ready", d: "Payments and shipping", d2: "Guest + express pay" },
    ],
    pairs: [
      {
        problem: "No branded shop",
        problemDetail: "Link-in-bio is not a store",
        fix: "Hosted storefront",
        fixDetail: "Theme + domain + SSL",
      },
      {
        problem: "Infrastructure tax",
        problemDetail: "Servers, patches, backups",
        fix: "SaaS platform",
        fixDetail: "Vendor runs the stack",
      },
      {
        problem: "Weak merchandising",
        problemDetail: "Static product lists",
        fix: "Collections + themes",
        fixDetail: "Navigation and landing pages",
      },
      {
        problem: "Payments bolted on",
        problemDetail: "Off-site checkout drop-off",
        fix: "Native checkout",
        fixDetail: "Cards, wallets, Shop Pay",
      },
    ],
    workflow: [
      { t: "Pick stack", d: "SaaS or WP", d2: "hosting choice" },
      { t: "Theme", d: "Brand the shop", d2: "pages + nav" },
      { t: "Catalog", d: "SKUs live", d2: "+ collections" },
      { t: "Checkout", d: "Payments", d2: "+ shipping" },
      { t: "Launch", d: "Domain + SSL", d2: "channels next" },
    ],
  },
  "omnichannel-retail": {
    title: "Omnichannel retail needs",
    heroTitle: "Sell online and in person from one catalog",
    heroSubtitle: "POS + ecommerce share inventory, payments, and customer history",
    panels: [
      { t: "Unified inventory", d: "Store and web stock", d2: "Avoid oversell" },
      { t: "Retail POS", d: "In-person checkout", d2: "Same SKUs as online" },
      { t: "BOPIS / pickup", d: "Buy online, pick up", d2: "Retail as a channel" },
    ],
    pairs: [
      {
        problem: "Two inventories",
        problemDetail: "Web sold what the store had",
        fix: "Shared catalog",
        fixDetail: "Locations and available-to-sell",
      },
      {
        problem: "Split payments",
        problemDetail: "POS vs online processors",
        fix: "One merchant account",
        fixDetail: "Square / Shopify POS class",
      },
      {
        problem: "Customer amnesia",
        problemDetail: "In-store vs online profiles",
        fix: "Unified customers",
        fixDetail: "Purchase history both channels",
      },
      {
        problem: "Pickup chaos",
        problemDetail: "Staff can’t find web orders",
        fix: "Retail fulfillment",
        fixDetail: "BOPIS queues on POS",
      },
    ],
    workflow: [
      { t: "Connect", d: "POS + store", d2: "one account" },
      { t: "Locations", d: "Stock per site", d2: "available-to-sell" },
      { t: "Sell", d: "Counter + web", d2: "same SKUs" },
      { t: "Fulfill", d: "Ship / pickup", d2: "from stores" },
      { t: "Reconcile", d: "Payments", d2: "+ inventory" },
    ],
  },
  "catalog-management": {
    title: "Catalog management needs",
    heroTitle: "Manage products, variants, and merchandising",
    heroSubtitle: "SKU complexity, collections, and media — before checkout even starts",
    panels: [
      { t: "Variants & options", d: "Size, color, bundles", d2: "Inventory per SKU" },
      { t: "Collections", d: "Merchandising groups", d2: "Seasonal landing pages" },
      { t: "Media & SEO", d: "Images, alt, URLs", d2: "Feed-ready attributes" },
    ],
    pairs: [
      {
        problem: "Spreadsheet SKUs",
        problemDetail: "No variant inventory",
        fix: "Product admin",
        fixDetail: "Options, SKUs, stock per variant",
      },
      {
        problem: "Messy merchandising",
        problemDetail: "One giant product list",
        fix: "Collections",
        fixDetail: "Rules + manual featured sets",
      },
      {
        problem: "Thin product pages",
        problemDetail: "Missing media / specs",
        fix: "Rich PDP fields",
        fixDetail: "Gallery, metafields, SEO",
      },
      {
        problem: "Channel drift",
        problemDetail: "Amazon title ≠ website",
        fix: "Channel feeds",
        fixDetail: "One catalog, many listings",
      },
    ],
    workflow: [
      { t: "Model", d: "Options", d2: "+ SKUs" },
      { t: "Stock", d: "Per variant", d2: "+ locations" },
      { t: "Merchandise", d: "Collections", d2: "+ featured" },
      { t: "Enrich", d: "Media / SEO", d2: "metafields" },
      { t: "Syndicate", d: "Channels", d2: "feeds" },
    ],
  },
  "checkout-conversion": {
    title: "Checkout & conversion needs",
    heroTitle: "Convert more carts with checkout and payments",
    heroSubtitle: "Express wallets, guest checkout, and recovery — not just a payment form",
    panels: [
      { t: "Express pay", d: "Shop Pay, Apple, Google", d2: "Fewer form fields" },
      { t: "Trusted checkout", d: "Hosted vs off-site", d2: "PCI and drop-off" },
      { t: "Recovery", d: "Abandoned cart", d2: "Email / SMS follow-up" },
    ],
    pairs: [
      {
        problem: "Long checkout",
        problemDetail: "Account-required friction",
        fix: "Guest + wallets",
        fixDetail: "Shop Pay / Apple Pay / Google Pay",
      },
      {
        problem: "Off-site hop",
        problemDetail: "Redirect to processor",
        fix: "Native checkout",
        fixDetail: "Stay on your domain",
      },
      {
        problem: "Abandoned carts",
        problemDetail: "No follow-up",
        fix: "Recovery flows",
        fixDetail: "Email/SMS + checkout links",
      },
      {
        problem: "Hidden fee surprise",
        problemDetail: "Shipping at the end",
        fix: "Rates earlier",
        fixDetail: "Duty, tax, delivery estimate",
      },
    ],
    workflow: [
      { t: "Cart", d: "Totals", d2: "+ shipping hint" },
      { t: "Identity", d: "Guest or login", d2: "wallets skip" },
      { t: "Pay", d: "Cards + wallets", d2: "local methods" },
      { t: "Confirm", d: "Order + email", d2: "tracking next" },
      { t: "Recover", d: "Abandon", d2: "flows" },
    ],
  },
  "order-fulfillment": {
    title: "Order fulfillment needs",
    heroTitle: "Pick, pack, ship, and track across channels",
    heroSubtitle: "Labels, 3PL handoffs, and post-purchase tracking from the order admin",
    panels: [
      { t: "Order queue", d: "Unfulfilled → shipped", d2: "Multi-channel inbox" },
      { t: "Labels & 3PL", d: "Carrier rates, apps", d2: "Warehouse handoff" },
      { t: "Tracking", d: "Buyer notifications", d2: "Returns start here" },
    ],
    pairs: [
      {
        problem: "Inbox orders",
        problemDetail: "Email as the warehouse",
        fix: "Fulfillment queue",
        fixDetail: "Status, location, SLA",
      },
      {
        problem: "Rate shopping pain",
        problemDetail: "Carrier sites in tabs",
        fix: "Label apps",
        fixDetail: "Rates + print from admin",
      },
      {
        problem: "3PL black box",
        problemDetail: "Manual CSV uploads",
        fix: "Fulfillment apps",
        fixDetail: "Push orders, pull tracking",
      },
      {
        problem: "Where is my order?",
        problemDetail: "Support tickets spike",
        fix: "Tracking emails",
        fixDetail: "Carrier events to the buyer",
      },
    ],
    workflow: [
      { t: "Capture", d: "Paid orders", d2: "all channels" },
      { t: "Route", d: "Warehouse / 3PL", d2: "or store" },
      { t: "Pack", d: "Pick list", d2: "+ labels" },
      { t: "Ship", d: "Tracking", d2: "to buyer" },
      { t: "Return", d: "RMA", d2: "restock" },
    ],
  },
  "dropshipping-sourcing": {
    title: "Dropshipping sourcing needs",
    heroTitle: "Import supplier catalogs without holding stock",
    heroSubtitle: "Sourcing apps are not storefronts — they push products and route orders",
    panels: [
      { t: "Supplier catalog", d: "US/EU or marketplace", d2: "Spocket vs AliDrop class" },
      { t: "One-click import", d: "Push to Shopify etc.", d2: "Pricing markup rules" },
      { t: "Auto fulfill", d: "Order to supplier", d2: "Tracking back to store" },
    ],
    pairs: [
      {
        problem: "No inventory capital",
        problemDetail: "Can’t warehouse SKUs",
        fix: "Supplier marketplace",
        fixDetail: "Import, then sell",
      },
      {
        problem: "Slow overseas shipping",
        problemDetail: "Buyer complaints",
        fix: "US/EU suppliers",
        fixDetail: "Or faster-ship filters",
      },
      {
        problem: "Manual AliExpress",
        problemDetail: "Copy-paste every SKU",
        fix: "Import automation",
        fixDetail: "Chrome / native apps",
      },
      {
        problem: "App ≠ store",
        problemDetail: "Nowhere to check out",
        fix: "Pair with a cart",
        fixDetail: "Shopify / Woo required",
      },
    ],
    workflow: [
      { t: "Connect", d: "Store + app", d2: "Shopify/Woo" },
      { t: "Source", d: "Suppliers", d2: "ship-from filter" },
      { t: "Import", d: "Markup rules", d2: "push catalog" },
      { t: "Sell", d: "On storefront", d2: "not in the app" },
      { t: "Route", d: "Auto-order", d2: "+ tracking" },
    ],
  },
  "wholesale-b2b": {
    title: "Wholesale / B2B needs",
    heroTitle: "Company accounts, price lists, and bulk checkout",
    heroSubtitle: "Negotiated pricing and buyer portals — not a DTC theme with a coupon code",
    panels: [
      { t: "Buyer accounts", d: "Company login", d2: "Net terms optional" },
      { t: "Price lists", d: "Per-account catalogs", d2: "Hidden retail prices" },
      { t: "Bulk order", d: "Quick-order / CSV", d2: "MOQ and packs" },
    ],
    pairs: [
      {
        problem: "Retail prices only",
        problemDetail: "Dealers see DTC tags",
        fix: "Price lists",
        fixDetail: "Account-specific catalogs",
      },
      {
        problem: "Email purchase orders",
        problemDetail: "Re-key every line",
        fix: "B2B portal",
        fixDetail: "Quick order + CSV upload",
      },
      {
        problem: "No company context",
        problemDetail: "Personal guest checkout",
        fix: "Company accounts",
        fixDetail: "Roles, locations, net terms",
      },
      {
        problem: "Plan-gated B2B",
        problemDetail: "Hidden on starter tiers",
        fix: "Check the plan",
        fixDetail: "Plus / Scale / native B2B",
      },
    ],
    workflow: [
      { t: "Qualify", d: "Need B2B?", d2: "or DTC only" },
      { t: "Accounts", d: "Companies", d2: "+ price lists" },
      { t: "Catalog", d: "Hidden SKUs", d2: "MOQ / packs" },
      { t: "Order", d: "Portal / CSV", d2: "net terms" },
      { t: "Fulfill", d: "Wholesale SLAs", d2: "invoices" },
    ],
  },
  "website-builder-commerce": {
    title: "Website-builder commerce needs",
    heroTitle: "Site + store in one website builder",
    heroSubtitle: "Design-led SMB commerce — not a Shopify-class commerce OS",
    panels: [
      { t: "Brand site", d: "Templates + pages", d2: "Design-first" },
      { t: "Plan gate", d: "Core+ / Plus fees", d2: "Checkout unlock" },
      { t: "Curated catalog", d: "Simple variants", d2: "Know SKU caps" },
    ],
    pairs: [
      {
        problem: "Template store bolted on",
        problemDetail: "Shop feels disconnected",
        fix: "Confirm commerce plan",
        fixDetail: "Qualify before build",
      },
      {
        problem: "Checkout locked",
        problemDetail: "Paywall at sell time",
        fix: "Model plan + fees",
        fixDetail: "Core+ / Plus math",
      },
      {
        problem: "SKU ceiling",
        problemDetail: "Variants outgrow builder",
        fix: "Stay curated",
        fixDetail: "Or migrate to commerce OS",
      },
      {
        problem: "Fee surprise",
        problemDetail: "Platform % eats margin",
        fix: "Worksheet TCO",
        fixDetail: "Platform + card fees",
      },
    ],
    workflow: [
      { t: "Design", d: "Template + brand", d2: "pages first" },
      { t: "Plan gate", d: "Unlock commerce", d2: "before catalog" },
      { t: "Catalog", d: "Curated SKUs", d2: "simple variants" },
      { t: "Checkout", d: "Payments + fees", d2: "tax ready" },
      { t: "Launch", d: "Custom domain", d2: "live store" },
    ],
  },
};

const guidePacks = {
  "guides/what-is-ecommerce-software-hero.png": {
    title: "What is ecommerce software?",
    subtitle: "Four jobs — don’t rank a storefront against a dropshipping importer",
    panels: [
      { t: "Hosted platform", d: "Shopify / BigCommerce", d2: "Store + checkout + apps" },
      { t: "Open-source cart", d: "WooCommerce", d2: "WordPress + your hosting" },
      { t: "Omnichannel", d: "Square Online class", d2: "POS is the center" },
      { t: "Sourcing apps", d: "Spocket / AliDrop", d2: "Need a storefront first" },
      { t: "Catalog ops", d: "Variants and channels", d2: "Merchandising depth" },
      { t: "Payments TCO", d: "Rates + apps + themes", d2: "Not just $29/mo" },
    ],
  },
  "guides/how-to-choose-ecommerce-software-hero.png": {
    title: "How to choose ecommerce software",
    subtitle: "Job → catalog depth → checkout/POS → TCO trial — then shortlist",
    panels: [
      { t: "1. Name the job", d: "Store, retail, or sourcing", d2: "One primary cluster" },
      { t: "2. Catalog & B2B", d: "Variants, price lists", d2: "Plan-gated features" },
      { t: "3. Checkout / POS", d: "Wallets vs open gateway", d2: "In-person if needed" },
      { t: "4. Model TCO", d: "Apps, themes, processing", d2: "GMV fees if any" },
      { t: "5. Trial the admin", d: "Launch path, not ads", d2: "Import + first order" },
      { t: "6. Exit cost", d: "Data, themes, URLs", d2: "Before you migrate" },
    ],
  },
  "guides/ecommerce-pricing-guide-hero.png": {
    title: "Ecommerce software pricing",
    subtitle: "Subscription is the headline — processing, apps, and GMV rules are the bill",
    panels: [
      { t: "Plan floors", d: "SaaS $29–$399/mo class", d2: "Plus / Performance above" },
      { t: "Processing", d: "In-house vs open gateway", d2: "OPP / extra fees" },
      { t: "App stack", d: "Reviews, email, 3PL", d2: "Often exceeds plan" },
      { t: "Open-source TCO", d: "Woo is free core", d2: "Hosting + plugins" },
      { t: "POS locations", d: "Per-register / site", d2: "Square Plus/Premium" },
      { t: "Sourcing seats", d: "Product caps on plans", d2: "Spocket / AliDrop" },
    ],
  },
  "guides/what-is-ecommerce-software-building-blocks.png": {
    title: "Ecommerce building blocks",
    subtitle: "Buy for the block that is blocking first — not one undifferentiated ranking",
    panels: [
      { t: "Storefront", d: "Theme & catalog", d2: "Shoppable domain" },
      { t: "Checkout", d: "Cart & payments", d2: "Wallets + rates" },
      { t: "Orders", d: "Fulfillment", d2: "Labels & tracking" },
      { t: "Channels", d: "Marketplaces", d2: "Social shops" },
      { t: "POS", d: "In-store + online", d2: "Shared inventory" },
      { t: "Sourcing", d: "Dropship imports", d2: "Needs a store" },
    ],
  },
  "guides/what-is-ecommerce-software-loop.png": {
    title: "Ecommerce operating loop",
    subtitle: "Catalog → checkout → fulfill → restock — each job is a different purchase",
    panels: [
      { t: "Merchandize", d: "SKUs & collections", d2: "Variants that sell" },
      { t: "Publish", d: "Theme live", d2: "Custom domain" },
      { t: "Convert", d: "Checkout", d2: "Wallets & trust" },
      { t: "Fulfill", d: "Pick / pack / ship", d2: "Tracking out" },
      { t: "Sync stock", d: "POS or warehouse", d2: "No oversells" },
      { t: "Review TCO", d: "Apps + processing", d2: "Weekly, not yearly" },
    ],
  },
  "guides/how-to-choose-ecommerce-software-needs.png": {
    title: "Four ecommerce buying jobs",
    subtitle: "Same category, four shortlists — hosted, open-source, POS, sourcing",
    panels: [
      { t: "Hosted SaaS", d: "Launch on a domain", d2: "Shopify / BigCommerce class" },
      { t: "Open-source", d: "Keep WordPress", d2: "WooCommerce + hosting" },
      { t: "Omnichannel", d: "Stores + website", d2: "Square Online class" },
      { t: "Sourcing", d: "Store already exists", d2: "Spocket / AliDrop class" },
      { t: "Catalog depth", d: "Variants / B2B", d2: "Plan-gated features" },
      { t: "TCO trial", d: "One real order", d2: "Before you migrate" },
    ],
  },
  "guides/how-to-choose-ecommerce-software-framework.png": {
    title: "Ecommerce selection framework",
    subtitle: "Job first, then gates and TCO, then brand comparisons",
    panels: [
      { t: "1. Job sentence", d: "Weekly outcome", d2: "One cluster" },
      { t: "2. Must-haves", d: "Checkout / POS / B2B", d2: "Map to plan gates" },
      { t: "3. Volume", d: "GMV & SKU count", d2: "Overage risk" },
      { t: "4. TCO model", d: "Processing + apps", d2: "Hosting if Woo" },
      { t: "5. Trial order", d: "Non-admin proof", d2: "Sceptic operator" },
      { t: "6. Exit cost", d: "URL, data, theme", d2: "Before cutover" },
    ],
  },
  "guides/ecommerce-pricing-guide-stack.png": {
    title: "Ecommerce cost stack",
    subtitle: "Starter tile is the bottom layer — processing and apps decide the bill",
    panels: [
      { t: "Subscription", d: "Published plan", d2: "Annual vs monthly" },
      { t: "Processing", d: "Card spreads", d2: "Often the largest line" },
      { t: "Apps", d: "Reviews, email, 3PL", d2: "Recurring add-ons" },
      { t: "Themes", d: "Premium themes", d2: "One-time or yearly" },
      { t: "Hosting", d: "Open-source only", d2: "Woo + SSL + backups" },
      { t: "Import caps", d: "Sourcing apps", d2: "Starter vs Pro SKUs" },
    ],
  },
  "guides/ecommerce-pricing-guide-worked-example.png": {
    title: "Worked example: same GMV, different bill",
    subtitle: "Harbor Studio at $25k GMV — processing gap can exceed subscription savings",
    panels: [
      { t: "Assume GMV", d: "$25k / month", d2: "Same for both quotes" },
      { t: "Vendor A plan", d: "Lower tile", d2: "Higher card rate" },
      { t: "Vendor B plan", d: "Higher tile", d2: "Lower processing" },
      { t: "Apps both", d: "Reviews + 3PL", d2: "Add to both totals" },
      { t: "Compare", d: "Plan + processing", d2: "+ apps, like for like" },
      { t: "Decide", d: "Written quote", d2: "Confirm live rates" },
    ],
  },
};

const capabilityPacks = {
  "online-storefront": {
    title: "Online storefront needs",
    heroTitle: "A shoppable branded store",
    heroSubtitle: "Themes, catalog pages, and a domain buyers trust",
    panels: [
      { t: "Theme", d: "Brand look", d2: "Mobile first" },
      { t: "Domain", d: "yourbrand.com", d2: "SSL included or not" },
      { t: "Pages", d: "PDP + collections", d2: "SEO basics" },
    ],
    pairs: [
      { problem: "Marketplace-only shop", problemDetail: "No owned domain", fix: "Hosted or Woo store", fixDetail: "Catalog you control" },
      { problem: "Ugly theme", problemDetail: "Buyers bounce", fix: "Theme + PDP quality", fixDetail: "On the plan you buy" },
      { problem: "Wrong cluster", problemDetail: "Sourcing app as a store", fix: "Platform first", fixDetail: "Then optional imports" },
      { problem: "Gated domain", problemDetail: "Custom URL on paid tier", fix: "Map the gate", fixDetail: "Budget the qualifying plan" },
    ],
    workflow: [
      { t: "Brand", d: "Name + domain", d2: "SSL" },
      { t: "Theme", d: "Home + PDP", d2: "mobile" },
      { t: "Catalog", d: "First SKUs", d2: "collections" },
      { t: "Checkout", d: "Test order", d2: "wallets" },
      { t: "Launch", d: "DNS live", d2: "not a demo" },
    ],
  },
  "product-catalog": {
    title: "Product catalog needs",
    heroTitle: "SKUs, variants, and collections operators trust",
    heroSubtitle: "Merchandising depth — not a single product tile",
    panels: [
      { t: "Variants", d: "Size / color / SKU", d2: "Bulk edit" },
      { t: "Collections", d: "Rules + merch", d2: "Seasonal drops" },
      { t: "B2B lists", d: "If wholesale", d2: "Often plan-gated" },
    ],
    pairs: [
      { problem: "Spreadsheet SKUs", problemDetail: "Options in columns", fix: "Native variants", fixDetail: "One product, many SKUs" },
      { problem: "No collections", problemDetail: "Shoppers cannot browse", fix: "Rules + merch", fixDetail: "Automated groupings" },
      { problem: "B2B in coupons", problemDetail: "Dealers see retail", fix: "Price lists", fixDetail: "Company accounts" },
      { problem: "Gated bulk edit", problemDetail: "500 SKUs by hand", fix: "Check the plan", fixDetail: "CSV / API on right tier" },
    ],
    workflow: [
      { t: "Model", d: "Options vs SKUs", d2: "before import" },
      { t: "Import", d: "CSV / app", d2: "validate variants" },
      { t: "Collect", d: "Rules", d2: "seasonal merch" },
      { t: "Price", d: "Retail / B2B", d2: "plan gates" },
      { t: "Publish", d: "Live PDPs", d2: "spot-check" },
    ],
  },
  "checkout-payments": {
    title: "Checkout & payments needs",
    heroTitle: "Paid orders without last-step friction",
    heroSubtitle: "Methods, wallets, and processing TCO on the plan you buy",
    panels: [
      { t: "Methods", d: "Cards + wallets", d2: "Local methods" },
      { t: "Express", d: "Shop Pay / Apple", d2: "Fewer fields" },
      { t: "Rates", d: "Plan-tied spreads", d2: "Model at GMV" },
    ],
    pairs: [
      { problem: "Abandoned carts", problemDetail: "Too many fields", fix: "Express checkout", fixDetail: "Wallets on qualifying plan" },
      { problem: "Sticker-price shopping", problemDetail: "Ignore card rates", fix: "Model processing", fixDetail: "At your GMV" },
      { problem: "Gateway lock-in", problemDetail: "No third-party option", fix: "Open vs native", fixDetail: "Fees both ways" },
      { problem: "Trust gaps", problemDetail: "No SSL / badges", fix: "Checkout hygiene", fixDetail: "Domain + methods" },
    ],
    workflow: [
      { t: "Methods", d: "Must-have list", d2: "wallets too" },
      { t: "Plan", d: "Which tier", d2: "unlocks them" },
      { t: "Rates", d: "GMV model", d2: "native vs 3P" },
      { t: "Test", d: "Real checkout", d2: "mobile + desktop" },
      { t: "Recover", d: "Abandonment", d2: "if you need it" },
    ],
  },
  "order-management": {
    title: "Order management needs",
    heroTitle: "One queue for paid orders",
    heroSubtitle: "Statuses, refunds, and multi-channel orders without a shared inbox",
    panels: [
      { t: "Queue", d: "Paid → fulfill", d2: "Clear statuses" },
      { t: "Refunds", d: "Partial / full", d2: "Inventory return" },
      { t: "Channels", d: "Web + marketplaces", d2: "One ops view" },
    ],
    pairs: [
      { problem: "Email as OMS", problemDetail: "PayPal inbox chaos", fix: "Native order queue", fixDetail: "Statuses operators keep" },
      { problem: "Split channels", problemDetail: "Amazon vs website", fix: "Unified orders", fixDetail: "Same pick list" },
      { problem: "Refunds in bank", problemDetail: "Stock not returned", fix: "In-app refunds", fixDetail: "Inventory + payment" },
      { problem: "No notifications", problemDetail: "Buyers chase tracking", fix: "Status emails", fixDetail: "On the plan you buy" },
    ],
    workflow: [
      { t: "Capture", d: "Paid orders", d2: "all channels" },
      { t: "Route", d: "Warehouse / 3PL", d2: "or dropship" },
      { t: "Update", d: "Statuses", d2: "buyer-visible" },
      { t: "Exception", d: "Refunds / holds", d2: "stock back" },
      { t: "Review", d: "Daily queue", d2: "no inbox OMS" },
    ],
  },
  "inventory-management": {
    title: "Inventory management needs",
    heroTitle: "Trusted on-hand counts",
    heroSubtitle: "Locations, oversell rules, and POS sync",
    panels: [
      { t: "Locations", d: "Store + warehouse", d2: "3PL buckets" },
      { t: "Oversell", d: "Safety stock", d2: "Channel buffers" },
      { t: "Transfers", d: "Site to site", d2: "In transit" },
    ],
    pairs: [
      { problem: "Sold twice", problemDetail: "Store and website", fix: "Shared inventory", fixDetail: "POS + online one SKU" },
      { problem: "One bucket", problemDetail: "No locations", fix: "Multi-location", fixDetail: "On qualifying plan" },
      { problem: "Sheet counts", problemDetail: "Weekend inventory", fix: "Live on-hand", fixDetail: "Adjustments with audit" },
      { problem: "3PL as a note", problemDetail: "Not a location", fix: "First-class bucket", fixDetail: "Sync or EDI later" },
    ],
    workflow: [
      { t: "Locations", d: "Name each", d2: "store / WH / 3PL" },
      { t: "Rules", d: "Oversell policy", d2: "buffers" },
      { t: "Sync", d: "POS if retail", d2: "one SKU" },
      { t: "Count", d: "Cycle counts", d2: "adjustments" },
      { t: "Alert", d: "Low stock", d2: "reorder" },
    ],
  },
  "shipping-fulfillment": {
    title: "Shipping & fulfillment needs",
    heroTitle: "Labels, rates, tracking, 3PL",
    heroSubtitle: "Paid orders become shipments buyers can track",
    panels: [
      { t: "Labels", d: "From the queue", d2: "Printer-ready" },
      { t: "Rates", d: "Live carriers", d2: "Or flat rates" },
      { t: "3PL", d: "Handoff", d2: "When you outgrow in-house" },
    ],
    pairs: [
      { problem: "Carrier website", problemDetail: "Re-type addresses", fix: "In-app labels", fixDetail: "From the order queue" },
      { problem: "No tracking", problemDetail: "WISMO tickets", fix: "Auto tracking", fixDetail: "Email + portal" },
      { problem: "Peak overflow", problemDetail: "Cannot pack", fix: "3PL connector", fixDetail: "App TCO included" },
      { problem: "Returns chaos", problemDetail: "No RMA", fix: "Returns flow", fixDetail: "Native or app" },
    ],
    workflow: [
      { t: "Pick", d: "Queue", d2: "by SLA" },
      { t: "Pack", d: "Weight / dims", d2: "rates" },
      { t: "Label", d: "Buy postage", d2: "scan out" },
      { t: "Track", d: "Notify buyer", d2: "exceptions" },
      { t: "Return", d: "RMA if needed", d2: "stock back" },
    ],
  },
  "pos-omnichannel": {
    title: "POS & omnichannel needs",
    heroTitle: "One catalog, online and in store",
    heroSubtitle: "Hardware, shared inventory, pickup — not an afterthought plugin",
    panels: [
      { t: "Hardware", d: "Register / tap", d2: "Staff app" },
      { t: "Shared SKU", d: "Same item online", d2: "Stock updates" },
      { t: "Pickup", d: "BOPIS", d2: "If you need it" },
    ],
    pairs: [
      { problem: "Two catalogs", problemDetail: "Store vs website", fix: "Omnichannel POS", fixDetail: "One item record" },
      { problem: "Oversell in store", problemDetail: "Website sold last unit", fix: "Live inventory", fixDetail: "Location-aware" },
      { problem: "Online-only stack", problemDetail: "No hardware path", fix: "Square-class bundle", fixDetail: "Or POS add-on TCO" },
      { problem: "Location pricing", problemDetail: "Per-site plans", fix: "Model locations", fixDetail: "Plus/Premium math" },
    ],
    workflow: [
      { t: "Items", d: "One catalog", d2: "modifiers" },
      { t: "Locations", d: "Stock buckets", d2: "each store" },
      { t: "Hardware", d: "Register live", d2: "test sale" },
      { t: "Online", d: "Same SKU", d2: "BOPIS if needed" },
      { t: "Reconcile", d: "Day close", d2: "inventory" },
    ],
  },
  "marketplace-channels": {
    title: "Marketplace channel needs",
    heroTitle: "One catalog, many storefronts",
    heroSubtitle: "Amazon, social shops, and native channels vs app TCO",
    panels: [
      { t: "Native", d: "In-platform channels", d2: "Plan-gated?" },
      { t: "Sync", d: "Price + stock", d2: "Fidelity check" },
      { t: "Orders in", d: "Same queue", d2: "Not a second OMS" },
    ],
    pairs: [
      { problem: "Re-list everywhere", problemDetail: "Five admin UIs", fix: "Channel sync", fixDetail: "Native or app" },
      { problem: "Stock drift", problemDetail: "Oversold on Amazon", fix: "Inventory sync", fixDetail: "Near-real-time" },
      { problem: "Orders elsewhere", problemDetail: "Second packing list", fix: "Unified OMS", fixDetail: "Web + marketplace" },
      { problem: "App surprise", problemDetail: "Channel is add-on", fix: "TCO the connector", fixDetail: "Before you launch" },
    ],
    workflow: [
      { t: "Pick channels", d: "Must-haves", d2: "not all of them" },
      { t: "Map catalog", d: "IDs / GTIN", d2: "content rules" },
      { t: "Sync", d: "Price + stock", d2: "test SKU" },
      { t: "Orders", d: "Into queue", d2: "same SLA" },
      { t: "Review", d: "Drift weekly", d2: "fix mappings" },
    ],
  },
  "b2b-wholesale": {
    title: "B2B / wholesale needs",
    heroTitle: "Price lists and company accounts",
    heroSubtitle: "Negotiated pricing — not a DTC coupon code",
    panels: [
      { t: "Accounts", d: "Company login", d2: "Roles / locations" },
      { t: "Price lists", d: "Hidden retail", d2: "Quantity breaks" },
      { t: "Quick order", d: "CSV / SKU pad", d2: "MOQ" },
    ],
    pairs: [
      { problem: "Dealers see retail", problemDetail: "Coupon only", fix: "Price lists", fixDetail: "Account catalogs" },
      { problem: "Email POs", problemDetail: "Re-key lines", fix: "B2B portal", fixDetail: "Quick order + CSV" },
      { problem: "Guest checkout", problemDetail: "No company context", fix: "Company accounts", fixDetail: "Net terms if needed" },
      { problem: "Gated B2B", problemDetail: "Hidden on starter", fix: "Check Plus/Scale", fixDetail: "Native vs app" },
    ],
    workflow: [
      { t: "Accounts", d: "Companies", d2: "approvals" },
      { t: "Lists", d: "Prices / catalogs", d2: "qty breaks" },
      { t: "Terms", d: "Net / prepaid", d2: "if required" },
      { t: "Order", d: "Portal test", d2: "CSV too" },
      { t: "Fulfill", d: "Same OMS", d2: "not email" },
    ],
  },
  "dropshipping-sourcing": {
    title: "Dropshipping sourcing needs",
    heroTitle: "Import suppliers — not a storefront",
    heroSubtitle: "Product caps, geography, and order push into a store you already run",
    panels: [
      { t: "Connect", d: "Existing cart", d2: "Shopify / Woo" },
      { t: "Import", d: "Cap on plan", d2: "Markup rules" },
      { t: "Route", d: "Auto-order", d2: "Tracking back" },
    ],
    pairs: [
      { problem: "No warehouse", problemDetail: "Cannot hold stock", fix: "Supplier import", fixDetail: "Sell then route" },
      { problem: "Slow shipping", problemDetail: "Overseas only", fix: "US/EU filters", fixDetail: "Spocket-class vs Ali" },
      { problem: "Copy-paste SKUs", problemDetail: "Manual AliExpress", fix: "Import app", fixDetail: "Cap on the plan" },
      { problem: "App as a store", problemDetail: "Nowhere to checkout", fix: "Pair with a cart", fixDetail: "Platform is separate" },
    ],
    workflow: [
      { t: "Store first", d: "Live cart", d2: "required" },
      { t: "Plan", d: "SKU cap", d2: "Starter vs Pro" },
      { t: "Source", d: "Suppliers", d2: "ship-from" },
      { t: "Import", d: "Markup", d2: "push" },
      { t: "Route", d: "Test order", d2: "tracking" },
    ],
  },
  "app-extensions": {
    title: "App / extension ecosystem needs",
    heroTitle: "Extend the core — budget the stack",
    heroSubtitle: "Apps fill gaps but they are TCO, not free features",
    panels: [
      { t: "Gap list", d: "Reviews / subs / 3PL", d2: "Must vs nice" },
      { t: "Native vs app", d: "Higher plan?", d2: "Cheaper than plugins" },
      { t: "Run-rate", d: "Monthly fees", d2: "Security updates" },
    ],
    pairs: [
      { problem: "Core almost fits", problemDetail: "One missing workflow", fix: "App or upgrade", fixDetail: "Compare both TCO" },
      { problem: "Free Woo myth", problemDetail: "Ignore plugins", fix: "Extension bill", fixDetail: "Hosting + paid plugins" },
      { problem: "App sprawl", problemDetail: "Twelve subscriptions", fix: "Prune quarterly", fixDetail: "Kill unused apps" },
      { problem: "Security debt", problemDetail: "Unmaintained plugins", fix: "Vendor hygiene", fixDetail: "Especially open-source" },
    ],
    workflow: [
      { t: "List gaps", d: "Must-haves", d2: "not a wish list" },
      { t: "Native?", d: "Higher plan", d2: "vs app fee" },
      { t: "Install one", d: "Trial", d2: "real order" },
      { t: "Budget", d: "Add to TCO", d2: "monthly" },
      { t: "Prune", d: "Quarterly", d2: "unused out" },
    ],
  },
};

async function main() {
  await writePng(
    "categories/ecommerce-hero.png",
    heroSvg(categoryPack.title, categoryPack.subtitle, categoryPack.panels),
  );
  await writePng(
    "categories/ecommerce-needs.png",
    needsSvg("Ecommerce buyer needs", "Problems → ecommerce software fixes", categoryPack.pairs),
  );
  await writePng(
    "categories/ecommerce-workflow.png",
    flowSvg("Ecommerce software workflow", categoryPack.workflow),
  );

  for (const [slug, pack] of Object.entries(useCasePacks)) {
    await writePng(
      `use-cases/${slug}-hero.png`,
      heroSvg(pack.heroTitle, pack.heroSubtitle, pack.panels),
    );
    await writePng(
      `use-cases/${slug}-needs.png`,
      needsSvg(pack.title, "Problems → ecommerce software fixes", pack.pairs),
    );
    await writePng(
      `use-cases/${slug}-workflow.png`,
      flowSvg(`${slug.replace(/-/g, " ")} workflow`, pack.workflow),
    );
  }

  for (const [relPath, pack] of Object.entries(guidePacks)) {
    await writePng(relPath, heroSvg(pack.title, pack.subtitle, pack.panels));
  }

  for (const [slug, pack] of Object.entries(capabilityPacks)) {
    await writePng(
      `capabilities/${slug}-hero.png`,
      heroSvg(pack.heroTitle, pack.heroSubtitle, pack.panels),
    );
    await writePng(
      `capabilities/${slug}-needs.png`,
      needsSvg(pack.title, "Problems → ecommerce software fixes", pack.pairs),
    );
    await writePng(
      `capabilities/${slug}-workflow.png`,
      flowSvg(`${slug.replace(/-/g, " ")} workflow`, pack.workflow),
    );
  }

  console.log("done — ecommerce teaching visuals (hub / use cases / guides / capabilities)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
