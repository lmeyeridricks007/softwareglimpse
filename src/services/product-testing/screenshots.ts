import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export type ScreenshotUploadResult = {
  assetPath: string;
  bytes: number;
  mime: string;
  absolutePath: string;
};

function detectImageExt(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return ".png";
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return ".jpg";
  }
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return ".gif";
  }
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return ".webp";
  }
  return null;
}

function sanitizeSlugPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

/**
 * Persist a screenshot under public/testing-evidence for the internal workspace.
 * Rejects non-images, oversized payloads, and path traversal.
 */
export function saveTestingScreenshot(input: {
  productSlug: string;
  sessionId: string;
  filename: string;
  bytes: Buffer;
  declaredMime?: string | null;
}): ScreenshotUploadResult {
  if (input.bytes.length === 0) {
    throw new Error("Empty upload rejected.");
  }
  if (input.bytes.length > MAX_BYTES) {
    throw new Error(`Screenshot exceeds ${MAX_BYTES / (1024 * 1024)}MB limit.`);
  }

  const detectedExt = detectImageExt(input.bytes);
  if (!detectedExt || !ALLOWED_EXT.has(detectedExt)) {
    throw new Error("Only PNG, JPEG, WebP, or GIF screenshots are allowed.");
  }

  const mime = MIME_BY_EXT[detectedExt];
  if (
    input.declaredMime &&
    input.declaredMime !== mime &&
    !(detectedExt === ".jpg" && input.declaredMime === "image/jpg")
  ) {
    // Soft check: declared MIME may be missing/wrong from some browsers; magic wins.
    if (!input.declaredMime.startsWith("image/")) {
      throw new Error("Declared content type must be an image.");
    }
  }

  const product = sanitizeSlugPart(input.productSlug);
  const session = sanitizeSlugPart(input.sessionId);
  if (!product || !session) {
    throw new Error("Invalid product or session for screenshot storage.");
  }

  const baseName = sanitizeSlugPart(
    path.basename(input.filename, path.extname(input.filename)) || "screenshot",
  );
  const hash = createHash("sha256").update(input.bytes).digest("hex").slice(0, 10);
  const fileName = `${baseName || "screenshot"}-${hash}${detectedExt}`;

  const publicDir = path.join(
    process.cwd(),
    "public",
    "testing-evidence",
    product,
    session,
  );
  mkdirSync(publicDir, { recursive: true });

  const absolutePath = path.join(publicDir, fileName);
  const resolvedPublicRoot = path.resolve(
    process.cwd(),
    "public",
    "testing-evidence",
  );
  if (!path.resolve(absolutePath).startsWith(resolvedPublicRoot + path.sep)) {
    throw new Error("Screenshot path escaped storage root.");
  }

  writeFileSync(absolutePath, input.bytes);

  const assetPath = `/testing-evidence/${product}/${session}/${fileName}`;
  if (!existsSync(absolutePath)) {
    throw new Error("Screenshot write failed.");
  }

  return {
    assetPath,
    bytes: input.bytes.length,
    mime,
    absolutePath,
  };
}

export const TESTING_SCREENSHOT_MAX_BYTES = MAX_BYTES;
