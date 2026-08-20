import { siteFoundationConfig } from "@/data/config/site/foundation";

/** Client-safe accessors (config is static JSON-like; no Node APIs). */
export { siteFoundationConfig };

export function getSiteFoundationConfig() {
  return siteFoundationConfig;
}
