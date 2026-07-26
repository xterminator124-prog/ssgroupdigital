import {
  BarChart3,
  Coins,
  Globe2,
  Layers,
  Megaphone,
  Music4,
  Shield,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";

import { DashboardPreview } from "@/components/site/dashboard-preview";
import { Faq } from "@/components/site/faq";
import { StoreMarquee } from "@/components/site/marquee";
import { ButtonLink } from "@/components/ui/button";
import { Aurora, Card, Eyebrow, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

/* ==========================================================================
   Hero
   ========================================================================== */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
      <Aurora />
      <div aria-hidden className="absolute inset-0 -z-10 grid-lines opacity-40" />

      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <Reveal>
              <Eyebrow>
                <Sparkles className="h-3.5 w-3.5" />
                Distribution + analytics in one place
              </Eyebrow>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl xl:text-7xl">
                Independent,
                <br />
                <span className="text-gradient">with the numbers</span>
                <br />
                to prove it.
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="max-w-xl text-lg leading-relaxed text-ink-300">
                Release to Spotify, Apple Music, YouTube and 150+ more. Keep 100% of
                your rights and royalties. Then see how every track performs across
                every platform — in one dashboard instead of eleven tabs.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="flex flex-wrap items-center gap-3">
                <ButtonLink href="/pricing" size="lg">
                  Start distributing free
                </ButtonLink>
                <ButtonLink href="/dashboard" variant="outline" size="lg">
                  See the dashboard
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <p className="text-sm text-ink-400">
                No joining fee · No card required · Cancel any time
              </p>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <DashboardPreview />
          </Reveal>
        </div>
      </div>

      <div className="container-x mt-16 lg:mt-20">
        <p className="mb-5 text-center text-xs tracking-[0.2em] text-ink-400 uppercase">
          Delivering to 150+ stores and platforms
        </p>
        <StoreMarquee />
      </div>
    </section>
  );
}

/* ==========================================================================
   Stats
   ========================================================================== */

const STATS = [
  { value: "150+", label: "Stores & platforms" },
  { value: "100%", label: "Rights and royalties kept" },
  { value: "< 48h", label: "Median delivery time" },
  { value: "11", label: "Analytics sources unified" },
];

function Stats() {
  return (
    <Section className="py-14 lg:py-16">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/6 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 70}>
            <div className="h-full bg-ink-950 p-6 text-center lg:p-8">
              <p className="font-display text-3xl font-semibold text-white lg:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-ink-400">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ==========================================================================
   Alternating value sections (mirrors "Commercialize" / "Enhance")
   ========================================================================== */

function ValueSplit({
  eyebrow,
  title,
  body,
  points,
  href,
  cta,
  reverse,
  visual,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  href: string;
  cta: string;
  reverse?: boolean;
  visual: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <Reveal className={reverse ? "lg:order-2" : undefined}>
        <div className="flex flex-col items-start gap-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="text-3xl font-semibold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {title}
          </h2>
          <p className="text-base leading-relaxed text-ink-300 lg:text-lg">{body}</p>
          <ul className="flex flex-col gap-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-ink-200">
                <span className="mt-1.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <ButtonLink href={href} variant="outline" size="md" className="mt-2">
            {cta}
          </ButtonLink>
        </div>
      </Reveal>

      <Reveal delay={100} className={reverse ? "lg:order-1" : undefined}>
        {visual}
      </Reveal>
    </div>
  );
}

function ReleasePipeline() {
  const steps = [
    { icon: Upload, label: "Upload master + artwork", meta: "WAV / FLAC · 3000px" },
    { icon: Shield, label: "Automated QC & metadata check", meta: "ISRC, UPC, credits" },
    { icon: Globe2, label: "Delivered to 150+ stores", meta: "Median 41 hours" },
    { icon: Coins, label: "Royalties land in your ledger", meta: "Monthly, splits applied" },
  ];

  return (
    <div className="glass rounded-3xl p-6 lg:p-8">
      <ol className="flex flex-col gap-1">
        {steps.map((s, i) => (
          <li key={s.label} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-500/30 bg-brand-600/15 text-brand-300">
                <s.icon className="h-4.5 w-4.5" />
              </span>
              {i < steps.length - 1 ? (
                <span className="my-1 w-px flex-1 bg-gradient-to-b from-brand-500/40 to-transparent" />
              ) : null}
            </div>
            <div className="pb-6">
              <p className="text-sm font-medium text-white">{s.label}</p>
              <p className="mt-0.5 text-xs text-ink-400">{s.meta}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function RevenueVisual() {
  const rows = [
    { label: "Streaming royalties", amount: "$4,182.40", pct: 68, color: "bg-brand-500" },
    { label: "YouTube Content ID", amount: "$1,394.10", pct: 23, color: "bg-accent-500" },
    { label: "Sync licensing", amount: "$420.00", pct: 7, color: "bg-signal-400" },
    { label: "Publishing", amount: "$118.65", pct: 2, color: "bg-white/40" },
  ];

  return (
    <div className="glass rounded-3xl p-6 lg:p-8">
      <div className="flex items-baseline justify-between">
        <p className="text-xs tracking-[0.16em] text-ink-400 uppercase">
          June payout
        </p>
        <p className="font-display text-2xl font-semibold text-white">$6,115.15</p>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-300">{r.label}</span>
              <span className="font-medium text-white">{r.amount}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/6">
              <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 border-t border-white/8 pt-4 text-xs text-ink-400">
        Splits applied automatically · Paid to 3 collaborators
      </p>
    </div>
  );
}

/* ==========================================================================
   Feature bento
   ========================================================================== */

const FEATURES = [
  {
    icon: Music4,
    title: "Release anywhere, instantly",
    body: "One upload delivers to Spotify, Apple Music, YouTube Music, JioSaavn, TikTok and 145 more. Pick every store or hand-select your own list.",
    className: "lg:col-span-2",
  },
  {
    icon: Coins,
    title: "Keep 100% of it",
    body: "No commission on royalties. Ever. Your masters stay yours.",
  },
  {
    icon: BarChart3,
    title: "Analytics that actually connect",
    body: "Streams, views, saves and followers from every platform, normalized into one schema and one timeline.",
  },
  {
    icon: Shield,
    title: "Rights & Content ID",
    body: "Register works, claim usage on YouTube, and monitor unauthorised uploads.",
  },
  {
    icon: Megaphone,
    title: "Pre-saves and smart links",
    body: "Campaign pages that route each fan to their platform and report back who converted.",
  },
  {
    icon: Layers,
    title: "Splits without spreadsheets",
    body: "Define collaborator percentages once. Every statement pays out correctly.",
    className: "lg:col-span-2",
  },
];

function Features() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="Features"
        title={
          <>
            Everything you need, <span className="text-gradient">one click away</span>
          </>
        }
        description="Built for artists who want the reach of a label and none of the ownership terms."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 80} className={f.className}>
            <Card className="h-full">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand-600/25 to-accent-500/15 text-brand-300">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{f.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ==========================================================================
   Analytics differentiator
   ========================================================================== */

const SOURCES = [
  { name: "Spotify", color: "#1DB954" },
  { name: "Apple Music", color: "#FA243C" },
  { name: "YouTube", color: "#FF0033" },
  { name: "Content ID", color: "#FF7A00" },
  { name: "Instagram", color: "#E1306C" },
  { name: "TikTok", color: "#25F4EE" },
  { name: "Deezer", color: "#A238FF" },
  { name: "JioSaavn", color: "#2BC5B4" },
  { name: "Amazon Music", color: "#25D1DA" },
  { name: "Facebook", color: "#0866FF" },
];

function Analytics() {
  return (
    <Section id="analytics" className="relative overflow-hidden">
      <Aurora className="opacity-60" />

      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="flex flex-col items-start gap-5">
            <Eyebrow>
              <Zap className="h-3.5 w-3.5" />
              What makes us different
            </Eyebrow>
            <h2 className="text-3xl font-semibold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Every platform&apos;s numbers,{" "}
              <span className="text-gradient">one honest picture</span>
            </h2>
            <p className="text-base leading-relaxed text-ink-300 lg:text-lg">
              Most distributors show you their own dashboard and stop there. We pull
              from each platform&apos;s API, normalize the metrics into a single
              schema, and let you compare a Spotify stream against a TikTok view
              against a Content ID claim — on the same timeline, in the same currency.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Daily sync across music, video, social and rights platforms",
                "Audience geography and demographics merged across sources",
                "Revenue attribution per track, per platform, per territory",
                "Open API — pull your own numbers into your own tools",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-ink-200">
                  <span className="mt-1.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-accent-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <ButtonLink href="/analytics" size="md" className="mt-2">
              Explore creator analytics
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="glass rounded-3xl p-6 lg:p-8">
            <p className="text-xs tracking-[0.16em] text-ink-400 uppercase">
              Connected sources
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {SOURCES.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center gap-2.5 rounded-xl border border-white/6 bg-white/3 px-3.5 py-3 transition-colors hover:border-white/16"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: s.color, boxShadow: `0 0 12px ${s.color}66` }}
                  />
                  <span className="truncate text-sm text-ink-200">{s.name}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-xl border border-white/6 bg-white/3 px-4 py-3 text-xs leading-relaxed text-ink-400">
              Adapters are written against a shared contract, so adding a new
              platform is one file — not a rewrite.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ==========================================================================
   FAQ + CTA
   ========================================================================== */

const FAQS = [
  {
    q: "What is music distribution, and why does it matter for independent artists?",
    a: "Distribution is how your recordings get onto Spotify, Apple Music, YouTube Music and every other service where people actually listen. Without a distributor you have no route onto those platforms. With one, a track you finished on Tuesday can be earning globally by the weekend — and you keep the ownership.",
  },
  {
    q: "How do I sign up and release my first track?",
    a: "Create an account, pick a plan, and upload your master with artwork and credits. Our QC checks metadata against each store's requirements before delivery, so you find problems in minutes instead of after a rejection.",
  },
  {
    q: "Can I choose which stores my music goes to?",
    a: "Yes. Deliver to all 150+ platforms, or restrict to streaming-only, download-only, or a custom selection. You can also add stores to an existing release later without taking it down.",
  },
  {
    q: "How long does approval take?",
    a: "Median delivery is under 48 hours once QC passes. Stores control their own ingestion queues, so we publish live status per platform rather than promising a number we don't control. Upload 3–4 weeks before release date if you want playlist consideration.",
  },
  {
    q: "How early should I upload for playlist placement?",
    a: "At least three to four weeks ahead. That gives the release time to link to the right artist profiles, and gives you a window to pitch through Spotify for Artists and Apple Music for Artists before the date locks.",
  },
  {
    q: "Which analytics can you actually pull, and which are estimates?",
    a: "YouTube gives us genuine daily views, watch time, geography and demographics through its Analytics API. Instagram and TikTok expose account and post insights with your consent. Spotify and Apple Music do not offer public per-artist stream APIs, so those figures come from your official platform reports and royalty statements. We label every metric with its source so you always know what is measured and what is derived.",
  },
  {
    q: "How do payouts work?",
    a: "Royalties are reconciled monthly, splits are applied automatically to collaborators, and you withdraw by bank transfer or supported payment providers once you clear the minimum threshold.",
  },
  {
    q: "Do you handle YouTube Content ID?",
    a: "Yes, subject to eligibility. Content ID requires exclusive rights to distinct, original recordings. Covers, non-exclusive licensed instrumentals, karaoke tracks, DJ mixes, public-domain recordings and non-musical audio are not eligible — those are YouTube's rules, not ours, and we screen for them before submitting.",
  },
];

function Cta() {
  return (
    <Section className="pb-28">
      <div className="relative overflow-hidden rounded-4xl border border-white/10 px-6 py-16 text-center lg:px-16 lg:py-20">
        <Aurora />
        <div aria-hidden className="absolute inset-0 -z-10 grid-lines opacity-30" />
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl lg:text-5xl">
            Put your next release out, and{" "}
            <span className="text-gradient">actually see what it did</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-ink-300 lg:text-lg">
            Free to start. No commission on your royalties. Your masters stay yours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/pricing" size="lg">
              Create your free account
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Talk to the team
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ==========================================================================
   Page
   ========================================================================== */

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />

      <Section id="commercialize">
        <ValueSplit
          eyebrow="Commercialize"
          title="Sell globally, earn more"
          body="Upload once. We handle delivery, metadata validation, store-specific requirements and takedowns — then route the money back to you and your collaborators."
          points={[
            "150+ stores including every major DSP and social platform",
            "Automated metadata and artwork QC before delivery",
            "Pre-orders, instant-gratification tracks and timed releases",
            "Zero commission — you keep 100% of net royalties",
          ]}
          href="/distribution"
          cta="How distribution works"
          visual={<ReleasePipeline />}
        />
      </Section>

      <Section id="enhance">
        <ValueSplit
          reverse
          eyebrow="Enhance"
          title="Grow the audience, then keep it"
          body="Pre-save links, smart landing pages and campaign tracking that tells you which channel produced which listener — not just that a number went up."
          points={[
            "Smart links that route each fan to their own platform",
            "Pre-save campaigns with conversion reporting",
            "Playlist pitching workflow with submission tracking",
            "Fan geography feeding straight into tour routing",
          ]}
          href="/analytics"
          cta="See the reporting"
          visual={<RevenueVisual />}
        />
      </Section>

      <Features />
      <Analytics />

      <Section id="faq">
        <SectionHeading
          eyebrow="FAQs"
          title="Frequently asked questions"
          description="Straight answers, including where the limits actually are."
        />
        <div className="mt-12">
          <Faq items={FAQS} />
        </div>
      </Section>

      <Cta />
    </>
  );
}
