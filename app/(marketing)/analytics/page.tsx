import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Aurora, Card, Eyebrow, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { listAdapters } from "@/lib/connectors/registry";
import type { PlatformMeta } from "@/lib/connectors/types";

export const metadata: Metadata = {
  title: "Creator Analytics",
  description:
    "Streams, views, followers and revenue from every platform, normalized into one schema and one timeline.",
};

const STATUS_STYLE: Record<
  PlatformMeta["status"],
  { icon: typeof CheckCircle2; label: string; className: string }
> = {
  live: { icon: CheckCircle2, label: "Live", className: "text-signal-400 bg-signal-400/12" },
  stub: { icon: Clock, label: "In build", className: "text-accent-400 bg-accent-500/12" },
  planned: {
    icon: AlertTriangle,
    label: "Planned",
    className: "text-ink-400 bg-white/6",
  },
};

const AUTH_LABEL: Record<PlatformMeta["auth"], string> = {
  oauth2: "OAuth 2.0",
  client_credentials: "App token",
  jwt: "Signed JWT",
  public: "No auth",
  csv_import: "Report ingest",
};

function PlatformRow({ meta }: { meta: PlatformMeta }) {
  const status = STATUS_STYLE[meta.status];
  const StatusIcon = status.icon;

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: meta.color, boxShadow: `0 0 14px ${meta.color}66` }}
          />
          <h3 className="text-base font-semibold">{meta.name}</h3>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${status.className}`}
        >
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-ink-400 capitalize">
          {meta.category}
        </span>
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-ink-400">
          {AUTH_LABEL[meta.auth]}
        </span>
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-ink-400">
          {meta.supports.length} metrics
        </span>
      </div>

      {meta.notes ? (
        <p className="mt-4 text-xs leading-relaxed text-ink-400">{meta.notes}</p>
      ) : null}

      {meta.rateLimit ? (
        <p className="mt-3 border-t border-white/6 pt-3 font-mono text-[11px] text-ink-400">
          {meta.rateLimit}
        </p>
      ) : null}
    </Card>
  );
}

const PILLARS = [
  {
    title: "One schema, ten platforms",
    body: "A Spotify stream, a YouTube view and a TikTok play are different events with different definitions. We normalize them into canonical metric keys so you can chart them together without pretending they're identical — each series stays labelled with its source.",
  },
  {
    title: "Honest about the gaps",
    body: "Some platforms have generous APIs. Some have none. We tell you which is which on every metric rather than inventing numbers. Where data comes from a monthly report instead of a live API, the dashboard says so.",
  },
  {
    title: "Nightly sync, not live scraping",
    body: "Platform quotas are the real constraint — YouTube gives 10,000 units a day. We run a scheduled sync into our own store and serve the dashboard from that, so pages load instantly and quotas never blow up mid-session.",
  },
  {
    title: "Your data, exportable",
    body: "CSV export on every view, and a read API on the Label plan. If you leave, you take the full history with you.",
  },
];

export default function AnalyticsPage() {
  const adapters = listAdapters();

  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-12 lg:pt-24">
        <Aurora />
        <div aria-hidden className="absolute inset-0 -z-10 grid-lines opacity-30" />
        <div className="container-x flex flex-col items-center gap-5 text-center">
          <Eyebrow>Creator Analytics</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl lg:text-6xl">
            Eleven dashboards,{" "}
            <span className="text-gradient">reduced to one</span>
          </h1>
          <p className="max-w-2xl text-lg text-ink-300">
            Music, video, social and rights data pulled from each platform&apos;s own
            API, normalized into a single schema, and put on one timeline.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/dashboard" size="lg">
              Open the live demo
            </ButtonLink>
            <ButtonLink href="#api" variant="outline" size="lg">
              Read the API notes
            </ButtonLink>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 80}>
              <Card className="h-full">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-400">{p.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="api">
        <SectionHeading
          eyebrow="Integration status"
          title="Every platform, and exactly what it gives us"
          description="This table is generated from the same adapter registry the product runs on, so it can't drift from reality."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {adapters.map((a, i) => (
            <Reveal key={a.meta.id} delay={(i % 3) * 70}>
              <PlatformRow meta={a.meta} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 rounded-3xl border border-white/8 bg-ink-900/50 p-6 lg:p-8">
            <h3 className="text-lg font-semibold">Adding a platform</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-400">
              Every integration implements the same <code className="font-mono text-brand-300">PlatformAdapter</code>{" "}
              interface: declare what the API supports, implement the fetch methods you
              can, omit the ones you can&apos;t. The dashboard reads capabilities from
              the registry and renders only the widgets a platform can actually fill.
              No UI code changes when a platform is added.
            </p>
            <pre className="mt-5 overflow-x-auto rounded-2xl border border-white/6 bg-ink-950 p-5 font-mono text-[12px] leading-relaxed text-ink-300">
{`export const nextPlatform: PlatformAdapter = {
  meta: {
    id: "example",
    name: "Example",
    category: "social",
    auth: "oauth2",
    supports: ["followers", "views", "likes"],
    color: "#8b5cf6",
    status: "live",
  },
  getAuthorizationUrl: (state) => \`https://example.com/oauth?state=\${state}\`,
  exchangeCode: async (code) => exchange(code),
  fetchTimeSeries: async (ctx) => mapToMetricPoints(await api.insights(ctx)),
  fetchSummary: async (ctx) => rollUp(await api.insights(ctx)),
};`}
            </pre>
          </div>
        </Reveal>
      </Section>

      <Section className="pb-28">
        <div className="relative overflow-hidden rounded-4xl border border-white/10 px-6 py-14 text-center lg:px-16">
          <Aurora />
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl">
            See it with real numbers
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-ink-300">
            The demo dashboard runs on the same adapter layer as production.
          </p>
          <ButtonLink href="/dashboard" size="lg" className="mt-7">
            Open dashboard demo
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
