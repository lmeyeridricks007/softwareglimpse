import { finding } from "../findings";
import { applyForcedFailures, type SeoAgentRunner } from "../framework";
import {
  ensureLiveProbeBundle,
  liveImagesToFixtures,
} from "../live-probe";
import type {
  SeoAgentMeta,
  SeoCheckResult,
  SeoFinding,
  SeoFixtureMedia,
} from "../types";

export const MEDIA_SEO_AUDIT_AGENT: SeoAgentMeta = {
  id: "media-seo-audit-agent",
  name: "MediaSEOAuditAgent",
  version: "1.0.0",
  area: "media",
  mutatesProduction: false,
};

const YT_ID = /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/|i\.ytimg\.com\/vi\/)([\w-]{11})/i;

function youtubeIdsFromLivePages(
  pages: Array<{ path: string; images: { src: string }[]; embeds: { src: string }[] }>,
): Array<{ id: string; pagePath: string; src: string }> {
  const out: Array<{ id: string; pagePath: string; src: string }> = [];
  const seen = new Set<string>();
  for (const page of pages) {
    for (const img of page.images) {
      const match = img.src.match(YT_ID);
      if (!match?.[1] || seen.has(match[1])) continue;
      seen.add(match[1]);
      out.push({ id: match[1], pagePath: page.path, src: img.src });
    }
    for (const embed of page.embeds) {
      const match = embed.src.match(YT_ID);
      if (!match?.[1] || seen.has(match[1])) continue;
      seen.add(match[1]);
      out.push({ id: match[1], pagePath: page.path, src: embed.src });
    }
  }
  return out;
}

async function youtubeOembedLive(
  videoId: string,
): Promise<{ ok: boolean; status: number }> {
  const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "SoftwareGlimpse-seo-audit/1.0" },
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

const OVERSIZE_BYTES = 900_000;

function analyzeMedia(assets: SeoFixtureMedia[]): SeoFinding[] {
  const findings: SeoFinding[] = [];
  for (const asset of assets) {
    const subject = asset.src;
    const pages = asset.pagePath ? [asset.pagePath] : [];

    if (asset.broken) {
      findings.push(
        finding({
          prefix: "MEDIA",
          kind: "BROKEN",
          subject,
          severity: "P1",
          area: "media",
          problem: "Broken media source",
          evidence: `${asset.src} marked broken`,
          affectedPages: pages,
          likelyCause: "Moved/deleted asset or bad enrichment path",
          recommendedAction: "Fix path or remove from public enrichment",
          filesLikelyAffected: ["public/", "src/data/research"],
          expectedImpact: "Stops broken screenshots/videos in SERP/UX",
          effort: "small",
          confidence: 0.95,
        }),
      );
    }

    if (asset.kind !== "video") {
      const className = asset.className ?? "";
      const dimsReservedByLayout =
        /\/_next\/image/i.test(asset.src) ||
        /\baspect-/.test(className) ||
        /\bsize-\d+\b/.test(className) ||
        (/\babsolute\b/.test(className) && /\binset-0\b/.test(className));

      if (
        !dimsReservedByLayout &&
        (asset.width == null || asset.height == null)
      ) {
        findings.push(
          finding({
            prefix: "MEDIA",
            kind: "DIM",
            subject,
            severity: "P2",
            area: "media",
            problem: "Image missing width/height (CLS risk)",
            evidence: `${asset.src} width=${asset.width ?? "null"} height=${asset.height ?? "null"}`,
            affectedPages: pages,
            likelyCause: "Raw <img> without dimensions",
            recommendedAction: "Use next/image or explicit width/height",
            filesLikelyAffected: ["src/components"],
            expectedImpact: "Lower CLS",
            effort: "small",
            confidence: 0.85,
          }),
        );
      }
      // Empty alt="" is valid for decorative images (thumbs with aria-label, video posters).
      // Only flag when the alt attribute is missing entirely.
      if (asset.alt == null) {
        findings.push(
          finding({
            prefix: "MEDIA",
            kind: "ALT",
            subject,
            severity: "P2",
            area: "media",
            problem: "Image missing alt text",
            evidence: `${asset.src} alt attribute missing`,
            affectedPages: pages,
            likelyCause: "Forgotten alt on meaningful image",
            recommendedAction:
              'Add descriptive alt (or alt="" only if decorative)',
            filesLikelyAffected: ["src/components"],
            expectedImpact: "Accessibility + image SEO",
            effort: "small",
            confidence: 0.8,
          }),
        );
      }
    }

    if ((asset.bytes ?? 0) > OVERSIZE_BYTES) {
      findings.push(
        finding({
          prefix: "MEDIA",
          kind: "SIZE",
          subject,
          severity: "P1",
          area: "media",
          problem: "Oversized media asset",
          evidence: `${asset.src} ${(asset.bytes! / 1024).toFixed(0)}KB`,
          affectedPages: pages,
          likelyCause: "Unoptimized PNG/JPEG export",
          recommendedAction: "Compress / clamp edge / ship WebP",
          filesLikelyAffected: ["public/", "scripts/optimize-public-images.ts"],
          expectedImpact: "Better LCP and bandwidth",
          effort: "small",
          confidence: 0.9,
        }),
      );
    }

    if (asset.kind === "video" || asset.videoObject) {
      const vo = asset.videoObject;
      if (vo) {
        const required = ["name", "thumbnailUrl", "uploadDate", "contentUrl"];
        const missing = required.filter((k) => !vo[k]);
        if (missing.length) {
          findings.push(
            finding({
              prefix: "MEDIA",
              kind: "VIDEOOBJ",
              subject,
              severity: "P2",
              area: "media",
              problem: "VideoObject missing recommended fields",
              evidence: `missing=${missing.join(",")}`,
              affectedPages: pages,
              likelyCause: "Incomplete videoObjectJsonLd payload",
              recommendedAction:
                "Fill name, thumbnailUrl, uploadDate, contentUrl/embedUrl",
              filesLikelyAffected: ["src/seo/structured-data.tsx"],
              expectedImpact: "Valid video rich results eligibility",
              effort: "small",
              confidence: 0.75,
            }),
          );
        }
      }
    }

    if (asset.kind === "thumbnail" && asset.broken) {
      findings.push(
        finding({
          prefix: "MEDIA",
          kind: "THUMB",
          subject,
          severity: "P2",
          area: "media",
          problem: "Broken video thumbnail",
          evidence: asset.src,
          affectedPages: pages,
          likelyCause: "Remote thumb 404 or bad ID",
          recommendedAction: "Refresh enrichment thumbnailUrl",
          filesLikelyAffected: ["src/services/product-media"],
          expectedImpact: "Preserves click-to-play UX without layout holes",
          effort: "small",
          confidence: 0.8,
        }),
      );
    }
  }
  return findings;
}

export const mediaSeoAuditAgent: SeoAgentRunner = {
  meta: MEDIA_SEO_AUDIT_AGENT,
  latestFilename: "media-seo-latest.md",
  archiveBasename: "media-seo.md",
  async analyze(ctx) {
    if (ctx.fixtures?.mediaAssets?.length) {
      const findings = analyzeMedia(ctx.fixtures.mediaAssets);
      let checks: SeoCheckResult[] = [
        {
          id: "fixture-media",
          status: "completed",
          reason: `${ctx.fixtures.mediaAssets.length} assets`,
        },
        { id: "dimensions", status: "completed" },
        { id: "alt-text", status: "completed" },
        { id: "oversized", status: "completed" },
        { id: "video-object", status: "completed" },
        {
          id: "live-embed-probe",
          status: "skipped",
          reason: "Remote embed probe not enabled",
        },
      ];
      checks = applyForcedFailures(checks, ctx);
      return {
        checks,
        findings,
        summary: `Fixture media SEO audit: ${findings.length} finding(s).`,
      };
    }

    const bundle = await ensureLiveProbeBundle(ctx);
    if (bundle) {
      const assets = bundle.pages.flatMap(liveImagesToFixtures);
      const findings = analyzeMedia(assets);
      for (const page of bundle.pages) {
        for (const embed of page.embeds) {
          if (/youtube\.com\/embed|youtu\.be|youtube-nocookie/i.test(embed.src)) {
            findings.push(
              finding({
                prefix: "MEDIA",
                kind: "EMBED",
                subject: embed.src,
                severity: "P2",
                area: "media",
                problem: "Eager YouTube iframe in live HTML (prefer click-to-play)",
                evidence: `\`${page.path}\` ${embed.tag} src=${embed.src}`,
                affectedPages: [page.path],
                likelyCause: "Direct iframe instead of OfficialProductVideo thumbnail-first",
                recommendedAction:
                  "Use click-to-play video component; load IFrame API on interaction only",
                filesLikelyAffected: [
                  "src/components",
                  "src/services/product-media",
                ],
                expectedImpact: "Lower main-thread + bandwidth cost",
                effort: "medium",
                confidence: 0.8,
              }),
            );
          }
        }
      }
      const posters = youtubeIdsFromLivePages(bundle.pages);
      let livePosters = 0;
      for (const poster of posters) {
        const probe = await youtubeOembedLive(poster.id);
        if (probe.ok) {
          livePosters += 1;
          continue;
        }
        findings.push(
          finding({
            prefix: "MEDIA",
            kind: "BROKEN",
            subject: poster.src,
            severity: "P1",
            area: "media",
            problem: "Official video poster points at a dead YouTube source",
            evidence: `oEmbed HTTP ${probe.status} for ${poster.id} on \`${poster.pagePath}\``,
            affectedPages: [poster.pagePath],
            likelyCause: "Video unpublished or ID stale in enrichment",
            recommendedAction:
              "Hide public display (status unavailable) and attach a verified replacement — do not invent a YouTube ID",
            filesLikelyAffected: ["src/data/research"],
            expectedImpact: "Stops dead official-video players on product pages",
            effort: "small",
            confidence: 0.9,
          }),
        );
      }
      const iframeCount = bundle.pages.reduce((n, p) => n + p.embeds.length, 0);
      const checks: SeoCheckResult[] = [
        {
          id: "live-html-img-scan",
          status: "completed",
          reason: `${assets.length} <img> from ${bundle.pages.length} pages`,
        },
        {
          id: "video-click-to-play",
          status: "completed",
          reason: "OfficialProductVideo contract + live embed scan",
        },
        {
          id: "live-embed-probe",
          status: "completed",
          reason: `${iframeCount} iframe(s), ${posters.length} click-to-play YouTube poster(s) oEmbed-probed (${livePosters} live)`,
        },
      ];
      return {
        checks: applyForcedFailures(checks, ctx),
        findings,
        summary: `Media SEO live HTML scan (${bundle.baseUrl}): ${findings.length} finding(s); ${assets.length} images.`,
      };
    }

    const checks: SeoCheckResult[] = [
      {
        id: "live-html-img-scan",
        status: "skipped",
        reason: "Requires BASE_URL / --base-url against a running origin",
      },
      {
        id: "video-click-to-play",
        status: "completed",
        reason: "OfficialProductVideo contract: thumbnail-first, no autoplay",
      },
      {
        id: "live-embed-probe",
        status: "skipped",
        reason: "Requires BASE_URL / --base-url against a running origin",
      },
    ];

    return {
      checks: applyForcedFailures(checks, ctx),
      findings: [],
      summary:
        "Media SEO live DOM scan skipped without BASE_URL. Video click-to-play contract noted as expected. Do not claim clean media SEO if HTML scan did not run.",
    };
  },
};
