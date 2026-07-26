import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { Aurora, Card, Eyebrow, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why SS Group Digital exists: distribution without commission, and analytics that tell the truth.",
};

const VALUES = [
  {
    title: "Artists keep everything",
    body: "No commission on royalties, no rights grab, no exclusivity clause. We charge a platform fee and that is the whole business model. If we ever need a cut of your earnings to survive, the product isn't good enough.",
  },
  {
    title: "Numbers with sources attached",
    body: "Analytics dashboards in this industry routinely blend real API data with estimates and present both as fact. We label every metric with where it came from, and we say plainly when a platform gives us nothing.",
  },
  {
    title: "Boring reliability",
    body: "Delivery windows we can actually hit, statements that reconcile, payouts that arrive. Unglamorous, and the thing artists complain about most with every other distributor.",
  },
  {
    title: "Built where the listeners are",
    body: "India is one of the fastest-growing streaming markets on earth and is chronically underserved by tooling built for Los Angeles. We start here.",
  },
];

const TIMELINE = [
  { year: "2026", title: "Platform launch", body: "Distribution to 150+ stores with the unified analytics dashboard in public beta." },
  { year: "2026 H2", title: "Rights & Content ID", body: "YouTube CMS partnership, asset registration and claim monitoring." },
  { year: "2027", title: "Open analytics API", body: "Read API and webhooks for labels and managers running their own tooling." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-12 lg:pt-24">
        <Aurora />
        <div aria-hidden className="absolute inset-0 -z-10 grid-lines opacity-30" />
        <div className="container-x flex flex-col items-center gap-5 text-center">
          <Eyebrow>Who we are</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl lg:text-6xl">
            We don&apos;t take a cut.{" "}
            <span className="text-gradient">That&apos;s the whole idea.</span>
          </h1>
          <p className="max-w-2xl text-lg text-ink-300">
            {site.name} exists because independent artists were being asked to choose
            between reach and ownership. That was always a false choice.
          </p>
        </div>
      </section>

      <Section>
        <SectionHeading eyebrow="What we believe" title="Four commitments" align="left" />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={(i % 2) * 80}>
              <Card className="h-full">
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-400">{v.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="press">
        <SectionHeading eyebrow="Roadmap" title="Where this is going" align="left" />
        <div className="mt-10 flex flex-col">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 90}>
              <div className="flex gap-6 border-b border-white/8 py-6 last:border-0">
                <span className="w-24 shrink-0 font-display text-sm font-semibold text-brand-400">
                  {t.year}
                </span>
                <div>
                  <h3 className="text-base font-semibold">{t.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{t.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="careers" className="pb-28">
        <div className="relative overflow-hidden rounded-4xl border border-white/10 px-6 py-14 text-center lg:px-16">
          <Aurora />
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl">
            Working on something similar?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-ink-300">
            We&apos;re hiring engineers and label-relations people. Tell us what you&apos;d build.
          </p>
          <ButtonLink href="/contact" size="lg" className="mt-7">
            Get in touch
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
