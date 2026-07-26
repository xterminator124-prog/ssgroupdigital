import type { Metadata } from "next";
import {
  BarChart3,
  Coins,
  FileAudio,
  Globe2,
  Layers,
  Link2,
  Megaphone,
  Music4,
  Shield,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Aurora, Card, Eyebrow, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Distribution, analytics, rights management, royalties and promotion — the full toolkit for independent creators.",
};

const GROUPS = [
  {
    id: "release",
    eyebrow: "Release",
    title: "Getting music out",
    items: [
      { icon: Music4, title: "150+ stores", body: "Every major DSP plus social platforms, regional services and download stores." },
      { icon: FileAudio, title: "Automated QC", body: "Audio, artwork and metadata validated against each store's spec before delivery." },
      { icon: Globe2, title: "Territory control", body: "Release worldwide or restrict by territory, with per-store scheduling." },
      { icon: Sparkles, title: "Pre-orders", body: "Pre-save campaigns and instant-gratification tracks on supported platforms." },
    ],
  },
  {
    id: "analytics",
    eyebrow: "Measure",
    title: "Knowing what happened",
    items: [
      { icon: BarChart3, title: "Cross-platform dashboard", body: "Streams, views, saves, followers and revenue on one normalized timeline." },
      { icon: Users, title: "Audience insight", body: "Geography and demographics merged across every connected platform." },
      { icon: Link2, title: "Smart links", body: "One URL that routes each fan to their platform, with conversion reporting." },
      { icon: Megaphone, title: "Campaign tracking", body: "Attribute listeners to the channel that actually produced them." },
    ],
  },
  {
    id: "rights",
    eyebrow: "Protect",
    title: "Owning what's yours",
    items: [
      { icon: Shield, title: "YouTube Content ID", body: "Register eligible recordings, claim usage, and monetize third-party uploads." },
      { icon: Layers, title: "Rights registry", body: "Track masters, compositions and licence terms in one place." },
      { icon: Coins, title: "Publishing admin", body: "Collect mechanical and performance royalties through partner societies." },
      { icon: Wallet, title: "Splits & payouts", body: "Define collaborator percentages once; every statement pays out correctly." },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-12 lg:pt-24">
        <Aurora />
        <div aria-hidden className="absolute inset-0 -z-10 grid-lines opacity-30" />
        <div className="container-x flex flex-col items-center gap-5 text-center">
          <Eyebrow>Features</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl lg:text-6xl">
            The whole toolkit,{" "}
            <span className="text-gradient">none of the ownership terms</span>
          </h1>
          <p className="max-w-2xl text-lg text-ink-300">
            Release, measure, protect and get paid — without signing your masters away.
          </p>
          <ButtonLink href="/pricing" size="lg" className="mt-3">
            Start free
          </ButtonLink>
        </div>
      </section>

      {GROUPS.map((group) => (
        <Section key={group.id} id={group.id}>
          <SectionHeading eyebrow={group.eyebrow} title={group.title} align="left" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {group.items.map((item, i) => (
              <Reveal key={item.title} delay={(i % 4) * 70}>
                <Card className="h-full">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand-600/25 to-accent-500/15 text-brand-300">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">{item.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>
      ))}

      <Section id="royalties" className="pb-28">
        <div className="relative overflow-hidden rounded-4xl border border-white/10 px-6 py-14 text-center lg:px-16">
          <Aurora />
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl">
            Try it on your next release
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-ink-300">
            Free tier, no card, two releases a year to every store.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/pricing" size="lg">
              See plans
            </ButtonLink>
            <ButtonLink href="/dashboard" variant="outline" size="lg">
              Open dashboard demo
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
