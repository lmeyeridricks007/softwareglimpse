import { buildLlmsTxt } from "@/seo/llms-txt";

export const revalidate = 86_400;

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, stale-while-revalidate=86400, s-maxage=86400",
    },
  });
}
