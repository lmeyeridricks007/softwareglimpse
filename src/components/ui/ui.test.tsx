import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

describe("design system primitives", () => {
  it("cn merges class names", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("Button renders primary variant", () => {
    const html = renderToStaticMarkup(<Button>Go</Button>);
    expect(html).toContain("Go");
    expect(html).toContain("button");
  });

  it("Badge and Card render", () => {
    expect(
      renderToStaticMarkup(
        <Badge variant="editorial-choice">Editor&apos;s Choice</Badge>,
      ),
    ).toContain("Editor");
    expect(renderToStaticMarkup(<Card>Body</Card>)).toContain("Body");
  });
});
