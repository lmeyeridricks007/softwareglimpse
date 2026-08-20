#!/usr/bin/env node
/**
 * Source REAL vendor-ui product screenshots + official YouTube videos for
 * Ecommerce Wave-1 + Priority-1 + Priority-3 products (Shopify, BigCommerce,
 * WooCommerce, Square Online, Spocket, AliDrop, Wix, Squarespace, Magento,
 * OpenCart, commercetools, VTEX, Saleor, Medusa, Tiendanube).
 *
 * Magento: Adobe marketing HTML is often bot-blocked; we fall back to official
 * Adobe for Business YouTube maxres frames + verified oEmbed videos.
 * OpenCart homepage often 403s; feature-page admin PNGs work.
 * VTEX OG CDN may bot-block; official YouTube frames are the fallback.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CHECKED_AT = "2026-08-18T08:00:00.000Z";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SoftwareGlimpseMediaBot/1.0";

const DEFAULT_LIMITATIONS = [
  "pricing",
  "comparative superiority",
  "security or compliance certification",
  "implementation effort or total cost of ownership",
];

const PRODUCTS = {
  shopify: {
    name: "Shopify",
    homepage: "https://www.shopify.com/",
    shots: [
      {
        file: "homepage-admin.png",
        url: "https://cdn.shopify.com/b/shopify-brochure2-assets/ea9aaa511480069c2807e9abdddd965d.png",
        alt: "Shopify admin and storefront marketing frame",
        caption: "Product UI frame from the official Shopify homepage.",
        source: "https://www.shopify.com/",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["online-storefront", "catalog-management"],
      },
      {
        file: "homepage-storefront.png",
        url: "https://cdn.shopify.com/b/shopify-brochure2-assets/7ecd57f2fa3d7b997d29181a62c954ee.png",
        alt: "Shopify storefront experience",
        caption: "Storefront marketing UI from shopify.com.",
        source: "https://www.shopify.com/",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "homepage-commerce.png",
        url: "https://cdn.shopify.com/b/shopify-brochure2-assets/edecfcf93c7ea58e8b257bfb6ee8a1ff.png",
        alt: "Shopify commerce platform overview",
        caption: "Commerce platform product frame from the official Shopify homepage.",
        source: "https://www.shopify.com/",
        featureIds: ["checkout-payments", "marketplace-channels"],
        useCaseIds: ["checkout-conversion", "online-storefront"],
      },
      {
        file: "homepage-dashboard.png",
        url: "https://cdn.shopify.com/b/shopify-brochure2-assets/988b6738089b476b12bb11624047cbee.png",
        alt: "Shopify dashboard product UI",
        caption: "Dashboard product frame marketed on shopify.com.",
        source: "https://www.shopify.com/",
        featureIds: ["analytics-reporting", "order-management"],
        useCaseIds: ["order-fulfillment", "online-storefront"],
      },
      {
        file: "og-storefront.png",
        url: "https://cdn.shopify.com/b/shopify-brochure2-assets/d617483c5e5cdd01ae8b4f2571c76f34.png",
        alt: "Shopify official Open Graph storefront visual",
        caption: "Official Shopify homepage Open Graph product visual.",
        source: "https://www.shopify.com/",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront"],
      },
    ],
    videos: [
      {
        videoId: "rgZU5pDf6mw",
        title: "The Shopify Story",
        channelName: "Shopify",
        sourceOrganization: "Shopify Inc.",
        description:
          "Official Shopify product story covering admin, storefront setup, channels, and payments (vendor YouTube channel).",
        featureIds: ["online-storefront", "checkout-payments", "marketplace-channels"],
        useCaseIds: ["online-storefront", "checkout-conversion"],
      },
    ],
  },
  bigcommerce: {
    name: "BigCommerce",
    homepage: "https://www.bigcommerce.com/",
    shots: [
      {
        file: "dashboard-collage.png",
        url: "https://dam.bigcommerce.com/asset/6d252f50-0721-45dc-9eda-278dc7a58e96/collage-storefront-bigcommerce-dashboard-panel-channels-ai-seo.png",
        alt: "BigCommerce dashboard, storefront, channels, and SEO collage",
        caption: "Control-panel collage from the official BigCommerce homepage.",
        source: "https://www.bigcommerce.com/",
        featureIds: ["online-storefront", "marketplace-channels", "ai-assistance"],
        useCaseIds: ["online-storefront", "catalog-management"],
      },
      {
        file: "channels.png",
        url: "https://dam.bigcommerce.com/asset/4facb67d-acb8-472e-af79-faf0118c9639/person-on-phone-product-boots-add-new-channel-google-meta-pinterest-tiktok.png",
        alt: "BigCommerce add-channel UI for Google, Meta, Pinterest, and TikTok",
        caption: "Channel-connect product frame from bigcommerce.com.",
        source: "https://www.bigcommerce.com/",
        featureIds: ["marketplace-channels"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "b2b-control-panel.jpg",
        url: "https://dam.bigcommerce.com/asset/e81a6e45-aa0c-433b-8c0c-b666b6f9f527/bigcommerce-control-panel-b2b-edition-selected.jpg",
        alt: "BigCommerce control panel with B2B edition selected",
        caption: "B2B edition control panel from the official BigCommerce homepage.",
        source: "https://www.bigcommerce.com/",
        featureIds: ["b2b-wholesale", "product-catalog"],
        useCaseIds: ["wholesale-b2b", "catalog-management"],
      },
      {
        file: "payments.jpg",
        url: "https://dam.bigcommerce.com/asset/5a930c82-acd5-4495-a508-7c76d06ff6aa/bigcommerce-center-payment-options-floating-around-paypal-gpay-venmo-klarna-apple-pay.jpg",
        alt: "BigCommerce payment options including PayPal, Google Pay, Venmo, Klarna, and Apple Pay",
        caption: "Checkout payment methods marketed on bigcommerce.com.",
        source: "https://www.bigcommerce.com/",
        featureIds: ["checkout-payments"],
        useCaseIds: ["checkout-conversion"],
      },
      {
        file: "checkout.jpg",
        url: "https://dam.bigcommerce.com/asset/fd40dc77-4016-4c3d-81ad-61a1a363b60d/phone-on-bed-checkout-screen-shoes-paypal-buttons.jpg",
        alt: "BigCommerce mobile checkout with PayPal buttons",
        caption: "Mobile checkout product frame from the official BigCommerce homepage.",
        source: "https://www.bigcommerce.com/",
        featureIds: ["checkout-payments"],
        useCaseIds: ["checkout-conversion"],
      },
    ],
    videos: [
      {
        videoId: "bwBcJXinD60",
        title: "Meet BigCommerce Payments",
        channelName: "BigCommerce",
        sourceOrganization: "BigCommerce",
        description:
          "Official BigCommerce Payments overview from the BigCommerce YouTube channel.",
        featureIds: ["checkout-payments"],
        useCaseIds: ["checkout-conversion"],
      },
    ],
  },
  woocommerce: {
    name: "WooCommerce",
    homepage: "https://woocommerce.com/",
    shots: [
      {
        file: "homepage-thumbnail.jpg",
        url: "https://woocommerce.com/wp-content/uploads/2025/02/woocommercecom-home-video-thumbnail_v2.jpg",
        alt: "WooCommerce homepage product video thumbnail",
        caption: "Homepage product video still from woocommerce.com.",
        source: "https://woocommerce.com/",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "take-control.jpg",
        url: "https://woocommerce.com/wp-content/uploads/2025/02/woo-take-control-of-your-success.jpg",
        alt: "WooCommerce take-control product marketing visual",
        caption: "Official WooCommerce homepage Open Graph product visual.",
        source: "https://woocommerce.com/",
        featureIds: ["online-storefront", "app-extensions"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "carousel-1.png",
        url: "https://woocommerce.com/wp-content/uploads/2025/03/carousel1.png",
        alt: "WooCommerce product carousel storefront example",
        caption: "Storefront carousel from the official WooCommerce product page.",
        source: "https://woocommerce.com/woocommerce/",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["online-storefront", "catalog-management"],
      },
      {
        file: "carousel-2.png",
        url: "https://woocommerce.com/wp-content/uploads/2025/03/carousel2.png",
        alt: "WooCommerce storefront carousel example",
        caption: "Second storefront carousel from woocommerce.com/woocommerce/.",
        source: "https://woocommerce.com/woocommerce/",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "block-theme.png",
        url: "https://woocommerce.com/wp-content/uploads/2025/06/woo-block-theme-2@2x.png",
        alt: "WooCommerce block theme editor",
        caption: "Block theme product frame from the official WooCommerce site.",
        source: "https://woocommerce.com/woocommerce/",
        featureIds: ["online-storefront", "app-extensions"],
        useCaseIds: ["online-storefront"],
      },
    ],
    videos: [
      {
        videoId: "KEDq7ripmXs",
        title: "How to set up WooCommerce: quick tour of the admin dashboard",
        channelName: "WooCommerce",
        sourceOrganization: "WooCommerce",
        type: "official-tutorial",
        description:
          "Official WooCommerce admin-dashboard tour from the WooCommerce YouTube channel.",
        featureIds: ["online-storefront", "product-catalog", "order-management"],
        useCaseIds: ["online-storefront", "catalog-management"],
      },
    ],
  },
  "square-online": {
    name: "Square Online",
    homepage: "https://squareup.com/us/en/online-store",
    shots: [
      {
        file: "desktop-hero.png",
        url: "https://images.ctfassets.net/2d5q1td6cyxq/13AD0mzB9dJ8nV4GiGwVgf/ece6cb03d32fb059e319bcd504895d13/PD07909_-_USEN_online_profile_desktop_hero_image.png",
        alt: "Square Online desktop storefront profile hero",
        caption: "Desktop storefront hero from the official Square Online page.",
        source: "https://squareup.com/us/en/online-store",
        featureIds: ["online-storefront", "pos-omnichannel"],
        useCaseIds: ["omnichannel-retail", "online-storefront"],
      },
      {
        file: "connect.png",
        url: "https://images.ctfassets.net/2d5q1td6cyxq/6syKvakoYyLzS5TCAc7ReC/bf6ff7043b2b38b7ffb01f91d75b3615/PD07130_-_USEN_connect.png",
        alt: "Square Online connect online and in-person selling",
        caption: "Omnichannel connect frame from squareup.com/online-store.",
        source: "https://squareup.com/us/en/online-store",
        featureIds: ["pos-omnichannel"],
        useCaseIds: ["omnichannel-retail"],
      },
      {
        file: "stay-close.png",
        url: "https://images.ctfassets.net/2d5q1td6cyxq/R591pwwPNwUre9lLD5ZYY/8614c99fa2982c081d0e24ec45172f2b/PD07130_-_USEN_stay_close.png",
        alt: "Square Online customer engagement product UI",
        caption: "Customer engagement product frame from the official Square Online page.",
        source: "https://squareup.com/us/en/online-store",
        featureIds: ["marketing-automation"],
        useCaseIds: ["omnichannel-retail"],
      },
      {
        file: "keep-track.png",
        url: "https://images.ctfassets.net/2d5q1td6cyxq/274eEXDriVEaZfBJmnaP21/1dcc9b112f086a04fdd8bb20e46879d2/PD07130_-_USEN_keep_track.png",
        alt: "Square Online inventory and order tracking UI",
        caption: "Keep-track operations frame from squareup.com/online-store.",
        source: "https://squareup.com/us/en/online-store",
        featureIds: ["inventory-management", "order-management"],
        useCaseIds: ["order-fulfillment", "omnichannel-retail"],
      },
      {
        file: "free-online-store.png",
        url: "https://images.ctfassets.net/2d5q1td6cyxq/7oqDkgf2zTVUgVRwauGeeW/d12bb6a08c7b277d3bf972dc0d3e24ab/PD07136_-_USEN_free_online_store.png",
        alt: "Square Online free online store marketing UI",
        caption: "Free online store product frame from the official Square Online page.",
        source: "https://squareup.com/us/en/online-store",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront", "omnichannel-retail"],
      },
    ],
    videos: [
      {
        videoId: "_lIewrjE8bw",
        title: "Square Online: Made to Order for Retail",
        channelName: "Square",
        sourceOrganization: "Square",
        description:
          "Official Square Online retail overview from the Square YouTube channel (linked from squareup.com/online-store).",
        featureIds: ["online-storefront", "pos-omnichannel"],
        useCaseIds: ["omnichannel-retail", "online-storefront"],
      },
    ],
  },
  spocket: {
    name: "Spocket",
    homepage: "https://www.spocket.co/",
    shots: [
      {
        file: "spocket-image.png",
        url: "https://cdn.prod.website-files.com/5b3213161e5234bf1cfff9e1/66eace66e94fe7e0adcf2109_spocket-image.png",
        alt: "Spocket dropshipping product overview",
        caption: "Official Spocket homepage Open Graph product visual.",
        source: "https://www.spocket.co/",
        featureIds: ["dropshipping-sourcing"],
        useCaseIds: ["dropshipping-sourcing"],
      },
      {
        file: "product-ui.avif",
        url: "https://cdn.prod.website-files.com/5b3213161e5234bf1cfff9e1/69bc424cdce6b97c7de87702_imagee-ezgif.com-apng-to-avif-converter.avif",
        alt: "Spocket product sourcing interface",
        caption: "Product UI animation still from the official Spocket homepage.",
        source: "https://www.spocket.co/",
        featureIds: ["dropshipping-sourcing", "product-catalog"],
        useCaseIds: ["dropshipping-sourcing"],
      },
      {
        file: "import-ui.avif",
        url: "https://cdn.prod.website-files.com/5b3213161e5234bf1cfff9e1/69d35ae21eacef5c317be604_Image-ezgif.com-apng-to-avif-converter%20(2).avif",
        alt: "Spocket import workflow UI",
        caption: "Import workflow product frame from spocket.co.",
        source: "https://www.spocket.co/",
        featureIds: ["dropshipping-sourcing"],
        useCaseIds: ["dropshipping-sourcing"],
      },
      {
        file: "trending-products.avif",
        url: "https://cdn.prod.website-files.com/5b3213161e5234bf1cfff9e1/69d3872e2adc6ed7c6d2d44e_trending%20Dropshipping%20Products.avif",
        alt: "Spocket trending dropshipping products catalog",
        caption: "Trending products catalog from the official Spocket homepage.",
        source: "https://www.spocket.co/",
        featureIds: ["dropshipping-sourcing", "product-catalog"],
        useCaseIds: ["dropshipping-sourcing"],
      },
      {
        file: "start-dropshipping.avif",
        url: "https://cdn.prod.website-files.com/5b3213161e5234bf1cfff9e1/69c55062f04bfe6f630d24e6_Start%20dropshipping.avif",
        alt: "Spocket start dropshipping call-to-action product frame",
        caption: "Start-dropshipping product frame from spocket.co.",
        source: "https://www.spocket.co/",
        featureIds: ["dropshipping-sourcing"],
        useCaseIds: ["dropshipping-sourcing"],
      },
    ],
    videos: [
      {
        videoId: "FGqbbYrrBYI",
        title: "How to Start a Shopify Dropshipping Store in 5 Minutes with Spocket? (2024 Guide)",
        channelName: "Spocket - #1 Rated Shopify Dropshipping Tool",
        sourceOrganization: "Spocket",
        type: "official-tutorial",
        description:
          "Official Spocket Shopify dropshipping walkthrough from the Spocket YouTube channel (embedded on spocket.co).",
        featureIds: ["dropshipping-sourcing"],
        useCaseIds: ["dropshipping-sourcing"],
      },
    ],
  },
  alidrop: {
    name: "AliDrop",
    homepage: "https://www.alidrop.co/",
    shots: [
      {
        file: "hero.avif",
        url: "https://cdn.prod.website-files.com/66a0b55a7907da911bd1e94a/67d42dc5a88ed61037fede26_66a0f1517e10aa1c41cb5a90_HeroImage-ezgif.com-apng-to-avif-converter.avif",
        alt: "AliDrop homepage hero product UI",
        caption: "Hero product UI from the official AliDrop homepage.",
        source: "https://www.alidrop.co/",
        featureIds: ["dropshipping-sourcing"],
        useCaseIds: ["dropshipping-sourcing"],
      },
      {
        file: "hero-alt.avif",
        url: "https://cdn.prod.website-files.com/66a0b55a7907da911bd1e94a/69ce036ed9c2df09d044fb96_hero-image-ezgif.com-apng-to-avif-converter%20(3).avif",
        alt: "AliDrop alternate hero product UI",
        caption: "Alternate hero product frame from alidrop.co.",
        source: "https://www.alidrop.co/",
        featureIds: ["dropshipping-sourcing"],
        useCaseIds: ["dropshipping-sourcing"],
      },
      {
        file: "workflow-1.avif",
        url: "https://cdn.prod.website-files.com/66a0b55a7907da911bd1e94a/69c10f2750f17ceab2b39c0a_1-ezgif.com-apng-to-avif-converter.avif",
        alt: "AliDrop import workflow step",
        caption: "Import workflow frame from the official AliDrop homepage.",
        source: "https://www.alidrop.co/",
        featureIds: ["dropshipping-sourcing", "product-catalog"],
        useCaseIds: ["dropshipping-sourcing"],
      },
      {
        file: "workflow-2.avif",
        url: "https://cdn.prod.website-files.com/66a0b55a7907da911bd1e94a/69c10f664d3cb644ca95bd4d_2-ezgif.com-apng-to-avif-converter.avif",
        alt: "AliDrop fulfillment workflow step",
        caption: "Fulfillment workflow frame from alidrop.co.",
        source: "https://www.alidrop.co/",
        featureIds: ["dropshipping-sourcing", "shipping-fulfillment"],
        useCaseIds: ["dropshipping-sourcing"],
      },
      {
        file: "shopify-stores.avif",
        url: "https://cdn.prod.website-files.com/66a0b55a7907da911bd1e94a/66a0ebc1631f32d9658da1b1_Shopify%20Stores.avif",
        alt: "AliDrop Shopify store connection",
        caption: "Shopify store connection visual from the official AliDrop homepage.",
        source: "https://www.alidrop.co/",
        featureIds: ["dropshipping-sourcing", "app-extensions"],
        useCaseIds: ["dropshipping-sourcing"],
      },
    ],
    videos: [
      {
        videoId: "RYazSu-G964",
        title: "AliExpress dropshipping, Alibaba Dropshipping with AliDrop | Make Money Online",
        channelName: "AliDrop - Start Your AliExpress Dropshipping",
        sourceOrganization: "AliDrop",
        description:
          "Official AliDrop dropshipping overview from the AliDrop YouTube channel.",
        featureIds: ["dropshipping-sourcing"],
        useCaseIds: ["dropshipping-sourcing"],
      },
    ],
  },
  wix: {
    name: "Wix",
    homepage: "https://www.wix.com/",
    shots: [
      {
        file: "homepage-og.jpg",
        url: "https://static.wixstatic.com/media/343a2a_383f6393fabd4a0fa7f4732b1dd7cdb4~mv2.jpg/v1/fill/w_1200,h_630,al_c/343a2a_383f6393fabd4a0fa7f4732b1dd7cdb4~mv2.jpg",
        alt: "Wix website builder and storefront marketing visual",
        caption: "Official Open Graph marketing visual from wix.com.",
        source: "https://www.wix.com/",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["website-builder-commerce", "online-storefront"],
      },
      {
        file: "ecommerce-storefront-fitness.jpg",
        url: "https://static.wixstatic.com/media/0784b1_7406364643624525a9b4545914ab80d6~mv2.jpg/v1/fill/w_1200,h_800,al_c,q_85,enc_auto/0784b1_7406364643624525a9b4545914ab80d6~mv2.jpg",
        alt: "Wix ecommerce storefront template with shop navigation and cart",
        caption:
          "Storefront marketing template from the official Wix ecommerce online-store page.",
        source: "https://www.wix.com/ecommerce/online-store",
        featureIds: ["online-storefront", "checkout-payments"],
        useCaseIds: ["website-builder-commerce", "online-storefront"],
      },
      {
        file: "ecommerce-storefront-brand.jpg",
        url: "https://static.wixstatic.com/media/343a2a_9a0b7a3556b84affb42807d9771b3cf0~mv2.jpg/v1/fill/w_1200,h_800,al_c,q_85,enc_auto/343a2a_9a0b7a3556b84affb42807d9771b3cf0~mv2.jpg",
        alt: "Wix ecommerce brand storefront with shop CTA and cart",
        caption:
          "Brand-site + shop marketing template from the official Wix ecommerce online-store page.",
        source: "https://www.wix.com/ecommerce/online-store",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["website-builder-commerce", "online-storefront"],
      },
      {
        file: "ecommerce-storefront-lifestyle.jpg",
        url: "https://static.wixstatic.com/media/a261d7_6314b9b9fa274589abac551a5d874375~mv2.jpg/v1/fill/w_1200,h_800,al_c,q_85,enc_auto/a261d7_6314b9b9fa274589abac551a5d874375~mv2.jpg",
        alt: "Wix ecommerce lifestyle storefront grid with shop entry",
        caption:
          "Lifestyle commerce storefront grid from the official Wix ecommerce online-store page.",
        source: "https://www.wix.com/ecommerce/online-store",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["website-builder-commerce", "catalog-management"],
      },
    ],
    videos: [],
  },
  squarespace: {
    name: "Squarespace",
    homepage: "https://www.squarespace.com/",
    shots: [
      {
        file: "homepage-og.png",
        url: "https://static1.squarespace.com/static/5134cbefe4b0c6fb04df8065/t/6a5677ad697cb96ab1e4da62/1784051629926/2025-homepage-thumbnail.png?format=1500w",
        alt: "Squarespace homepage marketing visual",
        caption: "Official Squarespace homepage Open Graph marketing visual.",
        source: "https://www.squarespace.com/",
        featureIds: ["online-storefront"],
        useCaseIds: ["website-builder-commerce", "online-storefront"],
      },
    ],
    videos: [],
  },
  magento: {
    name: "Magento",
    homepage: "https://business.adobe.com/products/commerce.html",
    shots: [
      {
        file: "official-video-overview-frame.jpg",
        url: "https://i.ytimg.com/vi/KllhoxmQTSc/maxresdefault.jpg",
        alt: "Adobe Commerce marketing frame from the official product overview video",
        caption:
          "Marketing frame from the official Adobe for Business Adobe Commerce overview video (YouTube maxres thumbnail).",
        source: "https://www.youtube.com/watch?v=KllhoxmQTSc",
        annotation:
          "Official Adobe for Business video frame — marketing evidence, not a live admin capture. Adobe CDN HTML assets were not bot-fetchable 2026-08-18.",
        featureIds: ["online-storefront", "product-catalog", "b2b-wholesale"],
        useCaseIds: ["online-storefront", "wholesale-b2b", "catalog-management"],
      },
      {
        file: "official-video-genai-frame.jpg",
        url: "https://i.ytimg.com/vi/uEvhP663v_c/maxresdefault.jpg",
        alt: "Adobe Commerce GenAI merchandising marketing frame from official Adobe for Business video",
        caption:
          "Marketing frame from the official Adobe for Business Adobe Commerce GenAI merchandising video (YouTube maxres thumbnail).",
        source: "https://www.youtube.com/watch?v=uEvhP663v_c",
        annotation:
          "Official Adobe for Business video frame — marketing evidence for AI merchandising surfaces, not a live admin capture.",
        featureIds: ["ai-assistance", "product-catalog"],
        useCaseIds: ["catalog-management", "online-storefront"],
      },
    ],
    videos: [
      {
        videoId: "KllhoxmQTSc",
        title: "The Best eCommerce Platform to Sell Online | Adobe Commerce",
        channelName: "Adobe for Business",
        sourceOrganization: "Adobe Inc.",
        description:
          "Official Adobe for Business overview of Adobe Commerce (Magento) covering personalization, B2B accounts, mobile, marketplaces, and cloud/partner ecosystem (vendor YouTube channel).",
        featureIds: [
          "online-storefront",
          "product-catalog",
          "b2b-wholesale",
          "marketplace-channels",
        ],
        useCaseIds: ["online-storefront", "wholesale-b2b", "catalog-management"],
      },
      {
        videoId: "uEvhP663v_c",
        title:
          "Personalize Search Results & Category Pages with Adobe Commerce GenAI | Adobe for Business",
        channelName: "Adobe for Business",
        sourceOrganization: "Adobe Inc.",
        description:
          "Official Adobe for Business demo of Adobe Commerce GenAI personalization on search and category pages (vendor YouTube channel).",
        featureIds: ["ai-assistance", "product-catalog"],
        useCaseIds: ["catalog-management", "online-storefront"],
      },
    ],
  },

  // --- Priority-3 ---
  opencart: {
    name: "OpenCart",
    homepage: "https://www.opencart.com/index.php?route=cms/feature",
    shots: [
      {
        file: "admin-dashboard.png",
        url: "https://www.opencart.com/application/view/image/feature/admin/dashboard.png",
        alt: "OpenCart admin dashboard",
        caption: "Admin dashboard UI from the official OpenCart features page.",
        source: "https://www.opencart.com/index.php?route=cms/feature",
        featureIds: ["analytics-reporting", "order-management"],
        useCaseIds: ["online-storefront", "order-fulfillment"],
      },
      {
        file: "admin-catalog-table.png",
        url: "https://www.opencart.com/application/view/image/feature/admin/table.png",
        alt: "OpenCart admin catalog table",
        caption: "Catalog admin table from the official OpenCart features page.",
        source: "https://www.opencart.com/index.php?route=cms/feature",
        featureIds: ["product-catalog"],
        useCaseIds: ["catalog-management", "online-storefront"],
      },
      {
        file: "unlimited-products.png",
        url: "https://www.opencart.com/application/view/image/feature/unlimited-everything/unlimited-products.png",
        alt: "OpenCart unlimited products feature frame",
        caption: "Product catalog feature frame from opencart.com features.",
        source: "https://www.opencart.com/index.php?route=cms/feature",
        featureIds: ["product-catalog"],
        useCaseIds: ["catalog-management"],
      },
      {
        file: "sales-report.png",
        url: "https://www.opencart.com/application/view/image/feature/shipping-payment/sales-report.png",
        alt: "OpenCart sales report UI",
        caption: "Sales reporting UI from the official OpenCart features page.",
        source: "https://www.opencart.com/index.php?route=cms/feature",
        featureIds: ["analytics-reporting"],
        useCaseIds: ["online-storefront"],
      },
    ],
    videos: [],
  },
  commercetools: {
    name: "commercetools",
    homepage: "https://commercetools.com/",
    shots: [
      {
        file: "og-website-preview.png",
        url: "https://cdn.prod.website-files.com/6a38f6b817cf6c8da550757a/6a7c471158744699925dc960_webiste-preview.png",
        alt: "commercetools official Open Graph website preview",
        caption: "Official commercetools homepage Open Graph product visual.",
        source: "https://commercetools.com/",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "platform-rectangle.png",
        url: "https://cdn.prod.website-files.com/6a38f6b817cf6c8da550757a/6a3e5f2d1e0b518bce6c7f08_25e99c2e75dc027a1666e08c25fb8d1a_Rectangle%201145%20%282%29.png",
        alt: "commercetools platform marketing UI frame",
        caption: "Platform marketing frame from the official commercetools homepage.",
        source: "https://commercetools.com/",
        featureIds: ["online-storefront", "app-extensions"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "yt-b2b-innovation.jpg",
        url: "https://i.ytimg.com/vi/Hg56i89beCU/maxresdefault.jpg",
        alt: "commercetools B2B commerce innovation video frame",
        caption: "Official commercetools YouTube frame — B2B commerce innovation.",
        source: "https://www.youtube.com/watch?v=Hg56i89beCU",
        featureIds: ["b2b-wholesale", "online-storefront"],
        useCaseIds: ["wholesale-b2b", "online-storefront"],
      },
      {
        file: "yt-pricing-promotions.jpg",
        url: "https://i.ytimg.com/vi/i7dmp8HcxCU/maxresdefault.jpg",
        alt: "commercetools pricing and promotions video frame",
        caption:
          "Official commercetools YouTube frame — pricing and promotions in Merchant Center workflows.",
        source: "https://www.youtube.com/watch?v=i7dmp8HcxCU",
        featureIds: ["product-catalog", "checkout-payments"],
        useCaseIds: ["catalog-management", "online-storefront"],
      },
      {
        file: "yt-layered-architecture.jpg",
        url: "https://i.ytimg.com/vi/mYP8ZXVYf8A/maxresdefault.jpg",
        alt: "commercetools layered composable architecture video frame",
        caption:
          "Official commercetools YouTube frame — layered composable commerce architecture.",
        source: "https://www.youtube.com/watch?v=mYP8ZXVYf8A",
        featureIds: ["app-extensions", "online-storefront"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "yt-checkout-hq.jpg",
        url: "https://i.ytimg.com/vi/q0PRTAuVqFA/hqdefault.jpg",
        alt: "commercetools Checkout product video frame",
        caption: "Official commercetools YouTube frame — Checkout product overview.",
        source: "https://www.youtube.com/watch?v=q0PRTAuVqFA",
        featureIds: ["checkout-payments", "online-storefront"],
        useCaseIds: ["checkout-conversion", "online-storefront"],
      },
    ],
    videos: [
      {
        videoId: "Hg56i89beCU",
        title: "Where B2B Commerce Meets Bold Innovation: commercetools",
        channelName: "commercetools",
        sourceOrganization: "commercetools GmbH",
        description:
          "Official commercetools overview of B2B composable commerce capabilities (vendor YouTube channel).",
        featureIds: ["b2b-wholesale", "online-storefront", "product-catalog"],
        useCaseIds: ["wholesale-b2b", "online-storefront"],
      },
      {
        videoId: "feNAkZluwHE",
        title: "Commerce Just Became Autonomous | commercetools",
        channelName: "commercetools",
        sourceOrganization: "commercetools GmbH",
        description:
          "Official commercetools product narrative on autonomous / agentic commerce (vendor YouTube channel).",
        featureIds: ["ai-assistance", "online-storefront"],
        useCaseIds: ["online-storefront"],
      },
      {
        videoId: "i7dmp8HcxCU",
        title:
          "Smarter Pricing and Promotions: How commercetools Maximises Every Offer",
        channelName: "commercetools",
        sourceOrganization: "commercetools GmbH",
        description:
          "Official commercetools deep-dive on pricing and promotions workflows (vendor YouTube channel).",
        featureIds: ["product-catalog", "checkout-payments"],
        useCaseIds: ["catalog-management", "online-storefront"],
      },
      {
        videoId: "q0PRTAuVqFA",
        title: "commercetools Checkout",
        channelName: "commercetools",
        sourceOrganization: "commercetools GmbH",
        description:
          "Official commercetools Checkout product overview (vendor YouTube channel).",
        featureIds: ["checkout-payments", "online-storefront"],
        useCaseIds: ["checkout-conversion", "online-storefront"],
      },
    ],
  },
  vtex: {
    name: "VTEX",
    homepage: "https://vtex.com/",
    shots: [
      {
        file: "yt-meet-vtex.jpg",
        url: "https://i.ytimg.com/vi/hKPWqrMXubY/maxresdefault.jpg",
        alt: "Meet VTEX commerce platform overview frame",
        caption: "Official VTEX YouTube frame — Meet VTEX platform overview.",
        source: "https://www.youtube.com/watch?v=hKPWqrMXubY",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "yt-marketplace-demo.jpg",
        url: "https://i.ytimg.com/vi/Akqz316Yr2c/maxresdefault.jpg",
        alt: "VTEX marketplace demo video frame",
        caption: "Official VTEX YouTube frame — digital store to marketplace demo.",
        source: "https://www.youtube.com/watch?v=Akqz316Yr2c",
        featureIds: ["marketplace-channels", "online-storefront"],
        useCaseIds: ["online-storefront", "wholesale-b2b"],
      },
      {
        file: "yt-redesigned-admin.jpg",
        url: "https://i.ytimg.com/vi/LWPplmmA1c4/maxresdefault.jpg",
        alt: "VTEX Redesigned Admin video frame",
        caption: "Official VTEX YouTube frame — Redesigned Admin overview.",
        source: "https://www.youtube.com/watch?v=LWPplmmA1c4",
        featureIds: ["order-management", "product-catalog", "analytics-reporting"],
        useCaseIds: ["order-fulfillment", "catalog-management", "online-storefront"],
      },
      {
        file: "yt-vtex-io.jpg",
        url: "https://i.ytimg.com/vi/S4G17uF0F7Q/maxresdefault.jpg",
        alt: "What is VTEX IO video frame",
        caption: "Official VTEX YouTube frame — VTEX IO platform overview.",
        source: "https://www.youtube.com/watch?v=S4G17uF0F7Q",
        featureIds: ["app-extensions", "online-storefront"],
        useCaseIds: ["online-storefront"],
      },
    ],
    videos: [
      {
        videoId: "hKPWqrMXubY",
        title: "Meet VTEX - VTEX Commerce Platform overview",
        channelName: "VTEX",
        sourceOrganization: "VTEX",
        description:
          "Official VTEX commerce platform overview covering digital commerce capabilities (vendor YouTube channel).",
        featureIds: ["online-storefront", "product-catalog", "checkout-payments"],
        useCaseIds: ["online-storefront"],
      },
      {
        videoId: "Akqz316Yr2c",
        title:
          "Demo video: turn your digital store into an online marketplace with VTEX",
        channelName: "VTEX",
        sourceOrganization: "VTEX",
        description:
          "Official VTEX demo of marketplace / multi-seller commerce capabilities (vendor YouTube channel).",
        featureIds: ["marketplace-channels", "online-storefront"],
        useCaseIds: ["online-storefront", "wholesale-b2b"],
      },
      {
        videoId: "LWPplmmA1c4",
        title: "VTEX Redesigned Admin - Request access (Short Version)",
        channelName: "VTEX",
        sourceOrganization: "VTEX",
        description:
          "Official VTEX overview of the redesigned Admin merchant console (vendor YouTube channel).",
        featureIds: ["order-management", "product-catalog", "analytics-reporting"],
        useCaseIds: ["order-fulfillment", "online-storefront"],
      },
      {
        videoId: "S4G17uF0F7Q",
        title: "[VTEX IO] What is VTEX IO?",
        channelName: "VTEX",
        sourceOrganization: "VTEX",
        description:
          "Official VTEX introduction to VTEX IO for storefront and app extensibility (vendor YouTube channel).",
        featureIds: ["app-extensions", "online-storefront"],
        useCaseIds: ["online-storefront"],
      },
    ],
  },
  "salesforce-commerce-cloud": {
    name: "Salesforce Commerce Cloud",
    homepage: "https://www.salesforce.com/commerce/b2c-ecommerce/",
    shots: [
      {
        file: "og-b2c-commerce.webp",
        url: "https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2026/03/og-image-b2c-commerce-720x405-1.webp",
        alt: "Salesforce B2C Commerce official Open Graph visual",
        caption: "Official Salesforce B2C Commerce Open Graph product visual.",
        source: "https://www.salesforce.com/commerce/b2c-ecommerce/",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "marquee-b2c-commerce.webp",
        url: "https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2026/03/marquee-image-b2c-commerce-720x720-1.webp",
        alt: "Salesforce B2C Commerce marquee product UI",
        caption: "B2C Commerce marquee product frame from salesforce.com.",
        source: "https://www.salesforce.com/commerce/b2c-ecommerce/",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["online-storefront", "catalog-management"],
      },
      {
        file: "site-management.webp",
        url: "https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2026/03/site-management-for-high-scale-operations-b2c-commerce-720x720-1.webp",
        alt: "Salesforce B2C Commerce site management UI",
        caption:
          "Site management for high-scale operations — official Salesforce B2C Commerce marketing UI.",
        source: "https://www.salesforce.com/commerce/b2c-ecommerce/",
        featureIds: ["analytics-reporting", "order-management"],
        useCaseIds: ["online-storefront", "order-fulfillment"],
      },
      {
        file: "agentic-merchandising.webp",
        url: "https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2026/03/agentic-merchandising-b2c-commerce-720x720-1.webp",
        alt: "Salesforce B2C Commerce agentic merchandising UI",
        caption: "Agentic merchandising frame from official Salesforce B2C Commerce.",
        source: "https://www.salesforce.com/commerce/b2c-ecommerce/",
        featureIds: ["ai-assistance", "product-catalog"],
        useCaseIds: ["catalog-management", "online-storefront"],
      },
      {
        file: "omni-channel-shopping.webp",
        url: "https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2026/03/omni-channel-shopping-b2c-commerce-720x720-1.webp",
        alt: "Salesforce B2C Commerce omnichannel shopping UI",
        caption: "Omnichannel shopping frame from official Salesforce B2C Commerce.",
        source: "https://www.salesforce.com/commerce/b2c-ecommerce/",
        featureIds: ["pos-omnichannel", "online-storefront", "marketplace-channels"],
        useCaseIds: ["omnichannel-retail", "online-storefront"],
      },
      {
        file: "order-management-module.webp",
        url: "https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2025/03/ihl-order-management-analyst-module-930x620-1.webp",
        alt: "Salesforce Commerce order management module UI",
        caption: "Order management analyst module from Salesforce commerce marketing.",
        source: "https://www.salesforce.com/commerce/",
        featureIds: ["order-management"],
        useCaseIds: ["order-fulfillment"],
      },
      {
        file: "yt-what-is-commerce-cloud.jpg",
        url: "https://i.ytimg.com/vi/IJPwRVx1-qY/maxresdefault.jpg",
        alt: "What Is Commerce Cloud Salesforce Explained video frame",
        caption: "Official Salesforce YouTube frame — What Is Commerce Cloud.",
        source: "https://www.youtube.com/watch?v=IJPwRVx1-qY",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "yt-multi-site-management.jpg",
        url: "https://i.ytimg.com/vi/eU5pDeE_SVc/maxresdefault.jpg",
        alt: "B2C Commerce multi-site management strategies video frame",
        caption:
          "Official Salesforce Support YouTube frame — multi-site management for B2C Commerce.",
        source: "https://www.youtube.com/watch?v=eU5pDeE_SVc",
        featureIds: ["analytics-reporting", "online-storefront"],
        useCaseIds: ["online-storefront"],
      },
    ],
    videos: [
      {
        videoId: "IJPwRVx1-qY",
        title: "What Is Commerce Cloud? | Salesforce Explained",
        channelName: "Salesforce",
        sourceOrganization: "Salesforce",
        description:
          "Official Salesforce Explained overview of Commerce Cloud (vendor YouTube channel).",
        featureIds: ["online-storefront", "product-catalog", "checkout-payments"],
        useCaseIds: ["online-storefront"],
      },
      {
        videoId: "eU5pDeE_SVc",
        title: "Multi-Site Management Strategies | B2C Commerce",
        channelName: "Salesforce Support",
        sourceOrganization: "Salesforce",
        description:
          "Official Salesforce Support deep-dive on multi-site management for B2C Commerce (vendor YouTube channel).",
        featureIds: ["analytics-reporting", "online-storefront"],
        useCaseIds: ["online-storefront"],
      },
    ],
  },
  saleor: {
    name: "Saleor",
    homepage: "https://saleor.io/",
    shots: [
      {
        file: "og-opengraph.png",
        url: "https://saleor.io/opengraph-image.png",
        alt: "Saleor official Open Graph visual",
        caption: "Official Saleor homepage Open Graph product visual.",
        source: "https://saleor.io/",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "dashboard-screenshot.png",
        url: "https://saleor.io/saleor-dashboard-screenshot.png",
        alt: "Saleor dashboard screenshot",
        caption: "Saleor dashboard UI from the official saleor.io homepage.",
        source: "https://saleor.io/",
        featureIds: ["product-catalog", "order-management", "analytics-reporting"],
        useCaseIds: ["catalog-management", "order-fulfillment", "online-storefront"],
      },
      {
        file: "dashboard-mobile.png",
        url: "https://saleor.io/dashboard-screenshot-mobile-2.png",
        alt: "Saleor dashboard mobile screenshot",
        caption: "Saleor dashboard mobile UI from saleor.io.",
        source: "https://saleor.io/",
        featureIds: ["order-management", "product-catalog"],
        useCaseIds: ["online-storefront"],
      },
    ],
    videos: [
      {
        videoId: "6XCpeP73qtA",
        title: "Introduction to Saleor",
        channelName: "Saleor Commerce",
        sourceOrganization: "Saleor Commerce",
        description:
          "Official Saleor Commerce introduction to the headless GraphQL commerce platform (vendor YouTube channel).",
        featureIds: ["online-storefront", "product-catalog", "app-extensions"],
        useCaseIds: ["online-storefront"],
      },
      {
        videoId: "DTQ4_uZuXTI",
        title: "Product Recommendations with OpenAI and Saleor",
        channelName: "Saleor Commerce",
        sourceOrganization: "Saleor Commerce",
        description:
          "Official Saleor Commerce demo of AI product recommendations on Saleor (vendor YouTube channel).",
        featureIds: ["ai-assistance", "product-catalog"],
        useCaseIds: ["catalog-management", "online-storefront"],
      },
    ],
  },
  medusa: {
    name: "Medusa",
    homepage: "https://medusajs.com/",
    shots: [
      {
        file: "og-meta.webp",
        url: "https://assets.medusajs.com/cdn-cgi/image/width=1200,quality=82,format=auto,fit=contain/uploads/2024/08/social-media-graphics-2024-meta-image-nps9tuy6.webp",
        alt: "Medusa official Open Graph meta visual",
        caption: "Official Medusa homepage Open Graph product visual.",
        source: "https://medusajs.com/",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "admin-image-one.webp",
        url: "https://assets.medusajs.com/uploads/2026/03/image-one-82622l5x.webp",
        alt: "Medusa admin product UI",
        caption: "Medusa admin / commerce UI from the official medusajs.com homepage.",
        source: "https://medusajs.com/",
        featureIds: ["product-catalog", "order-management"],
        useCaseIds: ["catalog-management", "online-storefront"],
      },
      {
        file: "infrastructure.webp",
        url: "https://assets.medusajs.com/uploads/2026/03/infrastructure-icy2zt0s.webp",
        alt: "Medusa Cloud infrastructure marketing frame",
        caption: "Medusa Cloud infrastructure frame from medusajs.com.",
        source: "https://medusajs.com/",
        featureIds: ["app-extensions", "analytics-reporting"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "yt-cloud-self-serve.jpg",
        url: "https://i.ytimg.com/vi/0IIl0zmc14Q/maxresdefault.jpg",
        alt: "Announcing Medusa Cloud Self-Serve video frame",
        caption: "Official Medusa YouTube frame — Medusa Cloud self-serve announcement.",
        source: "https://www.youtube.com/watch?v=0IIl0zmc14Q",
        featureIds: ["online-storefront", "app-extensions"],
        useCaseIds: ["online-storefront"],
      },
    ],
    videos: [
      {
        videoId: "0IIl0zmc14Q",
        title: "Announcing Medusa Cloud Self-Serve",
        channelName: "Medusa",
        sourceOrganization: "Medusa",
        description:
          "Official Medusa announcement of Medusa Cloud self-serve hosting (vendor YouTube channel).",
        featureIds: ["online-storefront", "app-extensions"],
        useCaseIds: ["online-storefront"],
      },
      {
        videoId: "xsTYPicT5vE",
        title: "Bloom: A new way to build commerce",
        channelName: "Medusa",
        sourceOrganization: "Medusa",
        description:
          "Official Medusa product narrative on Bloom / modern commerce building (vendor YouTube channel).",
        featureIds: ["online-storefront", "ai-assistance"],
        useCaseIds: ["online-storefront"],
      },
    ],
  },
  tiendanube: {
    name: "Tiendanube",
    homepage: "https://www.tiendanube.com/",
    shots: [
      {
        file: "og-latam-default.jpg",
        url: "https://app-insti-cdn.nuvemshop.com.br/site/dist/images/og-images/latam-default.jpg",
        alt: "Tiendanube official Open Graph visual",
        caption: "Official Tiendanube / Nuvemshop Open Graph product visual.",
        source: "https://www.tiendanube.com/",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "hero-ar-poster.webp",
        url: "https://app-insti-cdn.nuvemshop.com.br/site/dist/videos/homepage/hero-ar-poster.webp",
        alt: "Tiendanube homepage hero storefront poster",
        caption: "Homepage hero storefront poster from tiendanube.com.",
        source: "https://www.tiendanube.com/",
        featureIds: ["online-storefront", "checkout-payments"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "featured-layout-store.webp",
        url: "https://d4avy5zjiurvu.cloudfront.net/content/2025/12/menu-featured-layout-store.webp",
        alt: "Tiendanube featured store layout",
        caption: "Featured store layout marketing asset from Tiendanube.",
        source: "https://www.tiendanube.com/",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["online-storefront", "catalog-management"],
      },
      {
        file: "yt-primeros-pasos.jpg",
        url: "https://i.ytimg.com/vi/0jL-AGLf1OU/maxresdefault.jpg",
        alt: "Tiendanube primeros pasos training video frame",
        caption: "Official Tiendanube YouTube frame — create your store in four steps.",
        source: "https://www.youtube.com/watch?v=0jL-AGLf1OU",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront"],
      },
    ],
    videos: [
      {
        videoId: "0jL-AGLf1OU",
        title:
          "Creá tu Tiendanube desde cero en 4 pasos: Especial Primeros Pasos | Entrenamiento Nube May",
        channelName: "Tiendanube",
        sourceOrganization: "Tiendanube",
        description:
          "Official Tiendanube training — create a store from scratch in four steps (vendor YouTube channel).",
        featureIds: ["online-storefront", "product-catalog", "checkout-payments"],
        useCaseIds: ["online-storefront"],
      },
      {
        videoId: "HQD1W04Oapk",
        title: "Tiendanube vs Mercado Shops: ¿Cuál elegir?",
        channelName: "Tiendanube",
        sourceOrganization: "Tiendanube",
        description:
          "Official Tiendanube comparison narrative vs Mercado Shops (vendor YouTube channel).",
        featureIds: ["online-storefront", "marketplace-channels"],
        useCaseIds: ["online-storefront"],
      },
    ],
  },

  // --- Priority-2b + P2 media fill ---
  webflow: {
    name: "Webflow",
    homepage: "https://webflow.com/",
    shots: [
      {
        file: "og-webflow.jpg",
        url: "https://cdn.prod.website-files.com/686294e263eb7e215bd232f7/6a048234cec10a58c38e1758_webflow-og.jpg",
        alt: "Webflow official Open Graph visual",
        caption: "Official Webflow homepage Open Graph product visual.",
        source: "https://webflow.com/",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront", "website-builder-commerce"],
      },
      {
        file: "desktop-designer.webp",
        url: "https://cdn.prod.website-files.com/686294e263eb7e215bd232f7/68c9a39c128261b2128439d0_webflow-desktop.webp",
        alt: "Webflow Designer desktop UI",
        caption: "Webflow Designer desktop UI from the official homepage.",
        source: "https://webflow.com/",
        featureIds: ["online-storefront", "app-extensions"],
        useCaseIds: ["website-builder-commerce", "online-storefront"],
      },
      {
        file: "ecommerce-ui-panel.png",
        url: "https://cdn.prod.website-files.com/686294e263eb7e215bd232f7/689a178170f94d0cb78c1c42_ui-3.png",
        alt: "Webflow Ecommerce UI panel",
        caption: "Ecommerce UI panel from webflow.com/ecommerce marketing.",
        source: "https://webflow.com/ecommerce",
        featureIds: ["online-storefront", "product-catalog", "checkout-payments"],
        useCaseIds: ["website-builder-commerce", "online-storefront"],
      },
      {
        file: "yt-ecommerce-panel.jpg",
        url: "https://i.ytimg.com/vi/9W7Y6lf-4Rc/maxresdefault.jpg",
        alt: "Webflow Ecommerce panel overview video frame",
        caption: "Official Webflow YouTube frame — Ecommerce panel overview.",
        source: "https://www.youtube.com/watch?v=9W7Y6lf-4Rc",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["website-builder-commerce", "online-storefront"],
      },
    ],
    videos: [
      {
        videoId: "9W7Y6lf-4Rc",
        title: "Ecommerce panel overview — Webflow UI tutorial",
        channelName: "Webflow",
        sourceOrganization: "Webflow",
        description:
          "Official Webflow UI tutorial covering the Ecommerce panel (vendor YouTube channel).",
        featureIds: ["online-storefront", "product-catalog", "checkout-payments"],
        useCaseIds: ["website-builder-commerce", "online-storefront"],
      },
      {
        videoId: "pxG5BfY928w",
        title: "Designing the product page — Webflow Ecommerce tutorial",
        channelName: "Webflow",
        sourceOrganization: "Webflow",
        description:
          "Official Webflow Ecommerce tutorial on designing product pages (vendor YouTube channel).",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["website-builder-commerce", "catalog-management"],
      },
    ],
  },
  "lightspeed-retail": {
    name: "Lightspeed Retail",
    homepage: "https://www.lightspeedhq.com/pos/retail/",
    shots: [
      {
        file: "og-preview.png",
        url: "https://assets.lightspeedhq.com/img/1970209c-lightspeed-preview-2024.png",
        alt: "Lightspeed official Open Graph preview",
        caption: "Official Lightspeed Open Graph product visual.",
        source: "https://www.lightspeedhq.com/pos/retail/",
        featureIds: ["pos-omnichannel", "online-storefront"],
        useCaseIds: ["omnichannel-retail", "online-storefront"],
      },
      {
        file: "retail-pos-hero.webp",
        url: "https://assets.lightspeedhq.com/img/8d79b46f-retail_pos_hero-united.webp",
        alt: "Lightspeed Retail POS hero UI",
        caption: "Retail POS hero UI from lightspeedhq.com retail page.",
        source: "https://www.lightspeedhq.com/pos/retail/",
        featureIds: ["pos-omnichannel", "product-catalog", "checkout-payments"],
        useCaseIds: ["omnichannel-retail", "online-storefront"],
      },
      {
        file: "ecommerce-series-hero.jpg",
        url: "https://assets.lightspeedhq.com/img/72621d5a-t28087_e-series_hompage_hero_desktop.jpg",
        alt: "Lightspeed eCommerce series hero",
        caption: "Lightspeed Retail ecommerce series hero from the ecommerce product page.",
        source: "https://www.lightspeedhq.com/pos/retail/ecommerce/",
        featureIds: ["online-storefront", "pos-omnichannel"],
        useCaseIds: ["omnichannel-retail", "online-storefront"],
      },
      {
        file: "retail-benefits-1.jpg",
        url: "https://assets.lightspeedhq.com/img/f5d20eea-retail_industrypos_benefits-1.jpg",
        alt: "Lightspeed Retail POS benefits UI frame",
        caption: "Retail POS benefits marketing frame from Lightspeed.",
        source: "https://www.lightspeedhq.com/pos/retail/",
        featureIds: ["pos-omnichannel", "inventory-management"],
        useCaseIds: ["omnichannel-retail"],
      },
      {
        file: "yt-retail-demo.jpg",
        url: "https://i.ytimg.com/vi/vjRxHPghyZ0/maxresdefault.jpg",
        alt: "Lightspeed Retail POS demo getting started video frame",
        caption: "Official Lightspeed YouTube frame — Retail POS demo getting started.",
        source: "https://www.youtube.com/watch?v=vjRxHPghyZ0",
        featureIds: ["pos-omnichannel", "product-catalog"],
        useCaseIds: ["omnichannel-retail"],
      },
    ],
    videos: [
      {
        videoId: "vjRxHPghyZ0",
        title: "Lightspeed Retail POS Demo: Getting started",
        channelName: "Lightspeed HQ",
        sourceOrganization: "Lightspeed",
        description:
          "Official Lightspeed Retail POS getting-started demo (vendor YouTube channel).",
        featureIds: ["pos-omnichannel", "product-catalog", "checkout-payments"],
        useCaseIds: ["omnichannel-retail", "online-storefront"],
      },
      {
        videoId: "tz8eEzJaJDk",
        title: "Lightspeed: POS, Platform & People",
        channelName: "Lightspeed HQ",
        sourceOrganization: "Lightspeed",
        description:
          "Official Lightspeed brand/product overview covering POS platform and people (vendor YouTube channel).",
        featureIds: ["pos-omnichannel", "online-storefront"],
        useCaseIds: ["omnichannel-retail"],
      },
    ],
  },
  ecwid: {
    name: "Ecwid",
    homepage: "https://www.ecwid.com/",
    shots: [
      {
        file: "og-image.png",
        url: "https://don16obqbay2c.cloudfront.net/wp-content/uploads/og_image04.png",
        alt: "Ecwid official Open Graph visual",
        caption: "Official Ecwid homepage Open Graph product visual.",
        source: "https://www.ecwid.com/",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "homepage-hero.png",
        url: "https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/homepage2024/Hero.png",
        alt: "Ecwid homepage hero storefront UI",
        caption: "Homepage hero storefront UI from ecwid.com.",
        source: "https://www.ecwid.com/",
        featureIds: ["online-storefront", "product-catalog", "checkout-payments"],
        useCaseIds: ["online-storefront", "catalog-management"],
      },
      {
        file: "sales-dashboard.jpg",
        url: "https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/district/en/Sales.jpg",
        alt: "Ecwid sales dashboard UI",
        caption: "Sales dashboard marketing UI from Ecwid.",
        source: "https://www.ecwid.com/",
        featureIds: ["analytics-reporting", "order-management"],
        useCaseIds: ["order-fulfillment", "online-storefront"],
      },
      {
        file: "first-sale.jpg",
        url: "https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/district/en/First_sale.jpg",
        alt: "Ecwid first sale workflow UI",
        caption: "First-sale workflow marketing UI from Ecwid.",
        source: "https://www.ecwid.com/",
        featureIds: ["checkout-payments", "online-storefront"],
        useCaseIds: ["checkout-conversion", "online-storefront"],
      },
      {
        file: "yt-what-is-ecwid.jpg",
        url: "https://i.ytimg.com/vi/eyyBdWmNHNQ/maxresdefault.jpg",
        alt: "What is Ecwid E-commerce video frame",
        caption: "Official Ecwid by Lightspeed YouTube frame — What is Ecwid.",
        source: "https://www.youtube.com/watch?v=eyyBdWmNHNQ",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront"],
      },
    ],
    videos: [
      {
        videoId: "eyyBdWmNHNQ",
        title: "What is Ecwid E-commerce?",
        channelName: "Ecwid by Lightspeed",
        sourceOrganization: "Ecwid / Lightspeed",
        description:
          "Official Ecwid by Lightspeed product overview (vendor YouTube channel).",
        featureIds: ["online-storefront", "product-catalog", "checkout-payments"],
        useCaseIds: ["online-storefront"],
      },
      {
        videoId: "XX5UPe8eGBw",
        title: "How to Build an Online Store in just a few clicks - Quick Start Guide",
        channelName: "Ecwid by Lightspeed",
        sourceOrganization: "Ecwid / Lightspeed",
        description:
          "Official Ecwid quick-start guide for building an online store (vendor YouTube channel).",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["online-storefront", "catalog-management"],
      },
    ],
  },
  prestashop: {
    name: "PrestaShop",
    homepage: "https://www.prestashop.com/en",
    shots: [
      {
        file: "homepage-hero.jpg",
        url: "https://dsv16luwmjfsl.cloudfront.net/wp-content/uploads/2023/02/home-1920x978.jpg",
        alt: "PrestaShop homepage hero visual",
        caption: "Homepage hero product visual from prestashop.com.",
        source: "https://www.prestashop.com/en",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["online-storefront", "catalog-management"],
      },
      {
        file: "og-home.jpg",
        url: "https://dsv16luwmjfsl.cloudfront.net/wp-content/uploads/2023/02/home.jpg",
        alt: "PrestaShop official Open Graph home visual",
        caption: "Official PrestaShop Open Graph product visual.",
        source: "https://www.prestashop.com/en",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "yt-admin-area.jpg",
        url: "https://i.ytimg.com/vi/Fn3WTX6pYmE/maxresdefault.jpg",
        alt: "PrestaShop administration area video frame",
        caption: "Official PrestaShop YouTube frame — manage the Administration Area.",
        source: "https://www.youtube.com/watch?v=Fn3WTX6pYmE",
        featureIds: ["order-management", "product-catalog", "analytics-reporting"],
        useCaseIds: ["order-fulfillment", "catalog-management", "online-storefront"],
      },
    ],
    videos: [
      {
        videoId: "Fn3WTX6pYmE",
        title: "PrestaShop 1.7 : How to manage the Administration Area",
        channelName: "PrestaShop Official",
        sourceOrganization: "PrestaShop",
        description:
          "Official PrestaShop tutorial on managing the Administration Area (vendor YouTube channel).",
        featureIds: ["order-management", "product-catalog", "analytics-reporting"],
        useCaseIds: ["order-fulfillment", "online-storefront"],
      },
      {
        videoId: "wQzYTvMd-rU",
        title: "Discover PrestaShop Checkout",
        channelName: "PrestaShop Official",
        sourceOrganization: "PrestaShop",
        description:
          "Official PrestaShop Checkout product overview (vendor YouTube channel).",
        featureIds: ["checkout-payments", "online-storefront"],
        useCaseIds: ["checkout-conversion", "online-storefront"],
      },
    ],
  },
  printify: {
    name: "Printify",
    homepage: "https://printify.com/",
    shots: [
      {
        file: "meta-preview.png",
        url: "https://printify.com/pfh/assets/png/meta-preview.png",
        alt: "Printify official meta preview visual",
        caption: "Official Printify Open Graph / meta product visual.",
        source: "https://printify.com/",
        featureIds: ["dropshipping-sourcing", "product-catalog"],
        useCaseIds: ["online-storefront"],
      },
    ],
    videos: [],
  },
  shopware: {
    name: "Shopware",
    homepage: "https://www.shopware.com/en/",
    shots: [
      {
        file: "homepage-og.png",
        url: "https://images.ctfassets.net/nqzs8zsepqpi/7f1d5mBYgcP8rCOWho4vO6/32f04a0b3bb687d2df562966d5099138/og_image.png",
        alt: "Shopware official Open Graph visual",
        caption: "Official Shopware homepage Open Graph product visual.",
        source: "https://www.shopware.com/en/",
        featureIds: ["online-storefront"],
        useCaseIds: ["online-storefront"],
      },
      {
        file: "nav-product-tour.png",
        url: "https://images.ctfassets.net/nqzs8zsepqpi/6HyGZW51wQdOESsoql3FA0/a3b0d8338b109923822a622ac21abf17/nav-feature-image-product-tour.png",
        alt: "Shopware product tour feature image",
        caption: "Shopware product tour feature image from shopware.com.",
        source: "https://www.shopware.com/en/",
        featureIds: ["online-storefront", "product-catalog"],
        useCaseIds: ["online-storefront", "catalog-management"],
      },
    ],
    videos: [],
  },
};

async function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) {
    return { skipped: true, bytes: fs.statSync(dest).size };
  }
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1500) throw new Error(`Too small (${buf.length}b): ${url}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return { skipped: false, bytes: buf.length };
}

function buildScreenshot(slug, shot) {
  const id = `${slug}-shot-${shot.file.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]/gi, "-")}`;
  return {
    id,
    src: `/vendor-ui/${slug}/${shot.file}`,
    alt: shot.alt,
    caption: shot.caption,
    source: shot.source,
    checkedAt: CHECKED_AT,
    annotation: shot.annotation || `Official ${PRODUCTS[slug].name} marketing UI asset`,
    kind: "vendor-ui",
    featureIds: shot.featureIds ?? [],
    useCaseIds: shot.useCaseIds ?? [],
  };
}

function buildMedia(slug, video) {
  const id = `${slug}-video-${video.videoId.toLowerCase()}`;
  return {
    id,
    productSlug: slug,
    productIds: [slug],
    type: video.type || "official-video",
    provider: "youtube",
    sourceUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
    videoId: video.videoId,
    providerId: video.videoId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
    title: video.title,
    description: video.description,
    thumbnailUrl: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
    sourceOrganization: video.sourceOrganization,
    channelName: video.channelName,
    officialSource: true,
    officialSourceKind: video.officialSourceKind || "vendor-channel",
    verifiedAt: CHECKED_AT,
    lastCheckedAt: CHECKED_AT,
    sourceHealth: "unknown",
    refreshFlags: [],
    embeddingAllowed: true,
    capabilityIds: [],
    featureIds: video.featureIds ?? [],
    requirementIds: [],
    useCaseIds: video.useCaseIds ?? [],
    industryIds: [],
    guideIds: [],
    evidenceRefs: [],
    evidenceClaimIds: [],
    evidenceClaimKinds: ["workflow-demo", "ui-layout", "feature-existence"],
    demonstratedDimensionIds: [],
    requirementCriterionIds: [],
    workflowStageIds: [],
    reportedOutcomes: [],
    placements: ["overview", "features", "evidence"],
    mediaContext: "general-workflow",
    purpose: `Official ${PRODUCTS[slug].name} video for product research pages`,
    demonstratesCaption: `How ${PRODUCTS[slug].name} presents the product in an official vendor video.`,
    editorialCommentary:
      "Official vendor demo — treat as UI/workflow evidence, not SoftwareGlimpse scoring.",
    whatThisShows: [
      `${PRODUCTS[slug].name} product surfaces as shown in the official vendor video`,
      "UI/workflow layout marketed by the vendor",
    ],
    limitations: [...DEFAULT_LIMITATIONS],
    whatToNotice: [],
    status: "published",
  };
}

function mergeEnrichment(slug) {
  const enrichmentPath = path.join(
    ROOT,
    "src/data/research",
    slug,
    "enrichment.json",
  );
  if (!fs.existsSync(enrichmentPath)) {
    throw new Error(`Missing enrichment: ${enrichmentPath}`);
  }
  const data = JSON.parse(fs.readFileSync(enrichmentPath, "utf8"));
  const plan = PRODUCTS[slug];
  data.screenshots = Array.isArray(data.screenshots) ? data.screenshots : [];
  data.media = Array.isArray(data.media) ? data.media : [];

  const existingShotIds = new Set(data.screenshots.map((s) => s.id));
  const existingShotSrcs = new Set(data.screenshots.map((s) => s.src));
  let shotsAdded = 0;
  for (const shot of plan.shots) {
    const entry = buildScreenshot(slug, shot);
    if (existingShotIds.has(entry.id) || existingShotSrcs.has(entry.src)) continue;
    data.screenshots.push(entry);
    existingShotIds.add(entry.id);
    existingShotSrcs.add(entry.src);
    shotsAdded++;
  }

  const existingMediaIds = new Set(data.media.map((m) => m.id));
  const existingVideoIds = new Set(
    data.media.map((m) => m.videoId || m.providerId).filter(Boolean),
  );
  let mediaAdded = 0;
  for (const video of plan.videos) {
    const entry = buildMedia(slug, video);
    if (existingMediaIds.has(entry.id) || existingVideoIds.has(entry.videoId)) continue;
    data.media.push(entry);
    existingMediaIds.add(entry.id);
    existingVideoIds.add(entry.videoId);
    mediaAdded++;
  }

  data.updatedAt = CHECKED_AT;
  fs.writeFileSync(enrichmentPath, `${JSON.stringify(data, null, 2)}\n`);

  const vendorUi = data.screenshots.filter((s) => s.kind === "vendor-ui").length;
  const publishedMedia = data.media.filter(
    (m) => m.status === "active" || m.status === "published",
  ).length;
  return { shotsAdded, mediaAdded, vendorUi, publishedMedia, enrichmentPath };
}

async function processProduct(slug) {
  const plan = PRODUCTS[slug];
  if (!plan) throw new Error(`Unknown slug: ${slug}`);
  const dir = path.join(ROOT, "public/vendor-ui", slug);
  fs.mkdirSync(dir, { recursive: true });

  const downloadResults = [];
  for (const shot of plan.shots) {
    const dest = path.join(dir, shot.file);
    try {
      const result = await download(shot.url, dest);
      downloadResults.push({ file: shot.file, ok: true, ...result, url: shot.url });
    } catch (err) {
      downloadResults.push({
        file: shot.file,
        ok: false,
        error: String(err.message || err),
        url: shot.url,
      });
    }
  }

  const okFiles = new Set(
    downloadResults.filter((r) => r.ok).map((r) => r.file),
  );
  const original = plan.shots;
  plan.shots = plan.shots.filter((s) => okFiles.has(s.file));
  const merge = mergeEnrichment(slug);
  plan.shots = original;

  return { slug, downloadResults, ...merge };
}

async function main() {
  const argSlug = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const slugs = argSlug ? [argSlug] : Object.keys(PRODUCTS);
  const summary = [];

  for (const slug of slugs) {
    process.stdout.write(`\n→ ${slug}...\n`);
    const result = await processProduct(slug);
    for (const r of result.downloadResults) {
      const status = r.ok
        ? r.skipped
          ? `skip ${r.bytes}b`
          : `ok ${r.bytes}b`
        : `FAIL ${r.error}`;
      console.log(`  ${r.file}: ${status}`);
    }
    console.log(
      `  enrichment: +${result.shotsAdded} shots, +${result.mediaAdded} videos → vendor-ui=${result.vendorUi} media=${result.publishedMedia}`,
    );
    const fails = result.downloadResults.filter((r) => !r.ok);
    if (fails.length) console.warn(`  ⚠ ${fails.length} download failure(s)`);
    summary.push(result);
  }

  console.log("\n=== SUMMARY ===");
  for (const s of summary) {
    console.log(
      `${s.slug}\tvendor-ui=${s.vendorUi}\tvideos=${s.publishedMedia}\t(+${s.shotsAdded}/+${s.mediaAdded})`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
