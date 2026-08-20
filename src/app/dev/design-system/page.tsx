import type { Metadata } from "next";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Input, Field } from "@/components/ui/forms";
import { Rating } from "@/components/ui/rating";
import { PageContainer } from "@/components/layout/page-container";
import { Stack, Grid } from "@/components/layout/stack";
import { buildPageMetadata } from "@/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Design system",
  description: "Internal SoftwareGlimpse UI showcase — not for indexing.",
  path: "/dev/design-system/",
  indexable: false,
  nofollow: true,
  pageType: "internal",
});

/**
 * Dev-only showcase. Marked noindex. Available in all envs for QA.
 */
export default function DesignSystemPage() {
  return (
    <PageContainer size="wide" className="py-10">
      <h1 className="text-3xl font-bold">SoftwareGlimpse UI v1</h1>
      <p className="mt-2 text-[var(--sg-color-text-muted)]">
        Internal showcase — not for indexing.
      </p>

      <Stack gap={6} className="mt-10">
        <section>
          <h2 className="mb-3 font-semibold">Buttons</h2>
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <ButtonLink href="/" variant="primary">
              Link button
            </ButtonLink>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-semibold">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <Badge>Neutral</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="editorial-choice">Editor&apos;s Choice</Badge>
            <Badge variant="promotion">Current deal</Badge>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-semibold">Cards & rating</h2>
          <Grid cols={3}>
            <Card>Default card</Card>
            <Card variant="interactive">Interactive</Card>
            <Card variant="highlighted">
              Highlighted
              <Rating score={8.2} className="mt-2" />
            </Card>
          </Grid>
        </section>

        <section>
          <h2 className="mb-3 font-semibold">Forms & alerts</h2>
          <Field label="Email" htmlFor="demo-email">
            <Input id="demo-email" type="email" placeholder="you@example.com" />
          </Field>
          <Alert className="mt-4" title="Info">
            Example alert using design tokens.
          </Alert>
        </section>
      </Stack>
    </PageContainer>
  );
}
