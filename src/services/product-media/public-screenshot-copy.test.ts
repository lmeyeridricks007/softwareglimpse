import { describe, expect, it } from "vitest";
import {
  isYoutubeScreenshotBackfill,
  publicScreenshotCaption,
  publicScreenshotSourceUrl,
} from "./public-screenshot-copy";

describe("publicScreenshotCaption", () => {
  it("hides YouTube thumbnail backfill pipeline copy", () => {
    const shot = {
      alt: "Meltwater product overview from official vendor video",
      caption:
        "Overview frame from the official Meltwater vendor video on YouTube.",
      annotation: "Official meltwater product visual from vendor video thumbnail",
      source: "https://www.youtube.com/watch?v=WYjUrlvLB-o",
    };
    expect(isYoutubeScreenshotBackfill(shot)).toBe(true);
    expect(publicScreenshotCaption(shot)).toBeNull();
    expect(publicScreenshotSourceUrl(shot)).toBeNull();
  });

  it("shows first-party vendor UI captions", () => {
    const shot = {
      alt: "Zypper dashboard product UI",
      caption: "Dashboard screenshot from zypper.com static assets.",
      source: "https://zypper.com/",
    };
    expect(publicScreenshotCaption(shot)).toBe(
      "Dashboard screenshot from zypper.com static assets.",
    );
    expect(publicScreenshotSourceUrl(shot)).toBe("https://zypper.com/");
  });

  it("falls back to alt when caption is internal-only", () => {
    const shot = {
      alt: "Pipeline board",
      caption: "Overview frame from the official vendor video on YouTube.",
      source: "https://www.youtube.com/watch?v=abc12345678",
    };
    expect(publicScreenshotCaption(shot)).toBeNull();
  });
});
