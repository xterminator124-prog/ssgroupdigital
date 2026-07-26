import type { Metadata } from "next";
import { Check } from "lucide-react";

import { StoreMarquee } from "@/components/site/marquee";
import { ButtonLink } from "@/components/ui/button";
import { Aurora, Card, Eyebrow, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Music Distribution",
  description:
    "Deliver to 150+ stores worldwide. Automated QC, fast delivery, zero commission on royalties.",
};

const STEPS = [
  {
    n: "01",
    title: "Prepare your release",
    body: "Upload a WAV or FLAC master and 3000×3000 artwork. Add credits, contributors, language and genre. Our QC flags anything a store will reject before you submit — wrong sample rate, text on artwork, mismatched featured-artist formatting.",
  },
  {
    n: "02",
    title: "Pick your stores and date",
    body: "All 150+ platforms, or a custom selection. Set a release date at least three weeks out if you want playlist consideration, and choose pre-order and instant-gratification tracks.",
  },
  {
    n: "03",
    title: "We deliver and monitor",
    body: "Your release goes out with correct ISRCs, UPC, and artist-profile linking. You get live per-store status rather than a single opaque 'processing' bar.",
  },
  {
    n: "04",
    title: "Track and get paid",
    body: "Performance flows into your analytics dashboard. Royalties are reconciled monthly, splits applied automatically, and paid out on request.",
  },
];

const GUIDELINES = [
  ["Audio", "WAV or FLAC, 16-bit/44.1kHz minimum. 24-bit/48kHz preferred. No clipping."],
  ["Artwork", "3000×3000 px JPG or PNG, RGB. No URLs, social handles, store logos or promotional text."],
  ["Metadata", "Title casing consistent across the release. Featured artists in the artist field, not the title."],
  ["Rights", "You must own or control the master and the composition, or hold a valid licence for covers."],
  ["Lead time", "Minimum 7 days before release date. 21–28 days recommended for playlist pitching."],
  ["Explicit content", "Flag accurately. Mis-flagged releases get pulled by stores and delay your catalogue."],
];

export default function DistributionPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-12 lg:pt-24">
        <Aurora />
        <div aria-hidden className="absolute inset-0 -z-10 grid-lines opacity-30" />
        <div className="container-x flex flex-col items-center gap-5 text-center">
          <Eyebrow>Distribution</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl lg:text-6xl">
            One upload.{" "}
            <span className="text-gradient">Every store that matters.</span>
          </h1>
          <p className="max-w-2xl text-lg text-ink-300">
            Median delivery under 48 hours, automated QC before submission, and zero
            commission on what you earn.
          </p>
          <ButtonLink href="/pricing" size="lg" className="mt-3">
            Start your first release
          </ButtonLink>
        </div>
        <div className="container-x mt-14">
          <StoreMarquee />
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="Four steps, no mystery"
          description="Where the process depends on a store's own queue, we say so instead of inventing a deadline."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={(i % 2) * 80}>
              <Card className="h-full">
                <span className="font-display text-sm font-semibold text-brand-400">
                  {s.n}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-400">{s.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="guidelines">
        <SectionHeading
          eyebrow="Delivery guidelines"
          title="Get it right the first time"
          description="Most rejections come from the same handful of issues. Here they are up front."
        />

        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-white/8">
          {GUIDELINES.map(([label, body], i) => (
            <div
              key={label}
              className={`grid gap-2 p-5 sm:grid-cols-[160px_1fr] sm:gap-6 sm:p-6 ${
                i % 2 ? "bg-ink-900/40" : "bg-ink-900/20"
              }`}
            >
              <p className="flex items-start gap-2 text-sm font-semibold text-white">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal-400" />
                {label}
              </p>
              <p className="text-sm leading-relaxed text-ink-400">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pb-28">
        <div className="relative overflow-hidden rounded-4xl border border-white/10 px-6 py-14 text-center lg:px-16">
          <Aurora />
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl">
            Ready when you are
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-ink-300">
            Free tier includes two releases a year to every store on the list.
          </p>
          <ButtonLink href="/pricing" size="lg" className="mt-7">
            See plans
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
