import Link from "next/link";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { ProductScreenshotGallery } from "@/components/software/product-screenshot-gallery";
import type { ProductGuideMediaBundle } from "@/services/product-guides/media";
import { cn } from "@/lib/cn";

type Props = {
  bundle: ProductGuideMediaBundle;
  className?: string;
};

function videoHeading(bundle: ProductGuideMediaBundle): string {
  const { productName, videoMode } = bundle;
  switch (videoMode) {
    case "implementation":
      return `Official ${productName} setup walkthrough`;
    case "migration":
      return `Official ${productName} migration walkthrough`;
    case "plans":
      return `Official ${productName} plans walkthrough`;
    case "overview":
      return `See ${productName} in action`;
    default:
      return `Official ${productName} video`;
  }
}

function videoBody(bundle: ProductGuideMediaBundle): string {
  switch (bundle.videoMode) {
    case "implementation":
      return "Vendor tutorial for onboarding and configuration. It is not a SoftwareGlimpse rollout plan — use this guide for judgment.";
    case "migration":
      return "Vendor walkthrough of data move / UI migration surfaces. Validate against your own export and mapping checklist.";
    case "plans":
      return "Vendor plan/pricing explainer when available. Confirm current seats and limits on the vendor site.";
    case "overview":
      return "Official product overview for a fit check — not scoring, pricing, or comparative superiority.";
    default:
      return "Official vendor video related to this guide topic.";
  }
}

/**
 * Guide-kind-relevant screenshots + official video for CRM product guides.
 * Only render when the bundle has at least one matching media item.
 */
export function GuideProductMediaSection({ bundle, className }: Props) {
  const { productName, productSlug, screenshots, video, sectionTitle, sectionBody } =
    bundle;
  if (!video) return null;

  const reviewHref = `/software/${productSlug}/`;

  return (
    <section
      id="product-media"
      aria-labelledby="product-media-heading"
      className={cn("scroll-mt-28 space-y-10", className)}
    >
      <div>
        <h2
          id="product-media-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          {sectionTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          {sectionBody}
        </p>
      </div>

      <div id="official-product-video" className="scroll-mt-28 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--sg-color-text)]">
            {videoHeading(bundle)}
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
            {videoBody(bundle)}
          </p>
        </div>
        <OfficialProductVideo
          media={video}
          vendorName={productName}
          variant="compact"
          priority="low"
        />
      </div>

      {screenshots.length > 0 ? (
        <ProductScreenshotGallery
          productName={productName}
          screenshots={screenshots}
        />
      ) : null}

      <p className="text-sm text-[var(--sg-color-text-muted)]">
        Full product screenshots and evidence live on the{" "}
        <Link
          href={reviewHref}
          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          {productName} research page
        </Link>
        .
      </p>
    </section>
  );
}
