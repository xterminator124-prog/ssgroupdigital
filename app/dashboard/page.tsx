import Link from "next/link";

import { GeoChart, TrendChart } from "@/components/dashboard/charts";
import { PageHeader, Panel, SourceNote, StatCard } from "@/components/dashboard/panel";
import { ButtonLink } from "@/components/ui/button";
import { rangeForDays } from "@/lib/connectors/mock";
import {
  getAggregateSeries,
  getAggregateSummary,
  getGeo,
  getTopContent,
  listAdapters,
} from "@/lib/connectors/registry";
import { formatCompact, formatCurrency } from "@/lib/utils";

// Mock adapters are deterministic, so static rendering is safe today.
// Once real APIs are wired, switch to `export const revalidate = 3600`
// or fetch from the synced warehouse table inside a server component.
export const dynamic = "force-static";

export default async function DashboardOverview() {
  const opts = { creatorId: "demo", range: rangeForDays(30) };

  const [summary, streams, top, geo] = await Promise.all([
    getAggregateSummary(opts),
    getAggregateSeries(opts, "streams"),
    getTopContent(opts, 6),
    getGeo(opts),
  ]);

  const pick = (metric: string) => summary.find((s) => s.metric === metric);
  const adapters = listAdapters();
  const connected = adapters.filter((a) => a.meta.status !== "planned").length;

  return (
    <>
      <PageHeader
        title="Overview"
        description="Last 30 days across all connected platforms"
        actions={
          <ButtonLink href="/dashboard/analytics" variant="outline" size="sm">
            Full analytics
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Streams"
          value={pick("streams")?.value ?? 0}
          changePct={pick("streams")?.changePct}
          hint="vs. previous 15 days"
          accent="#8b5cf6"
        />
        <StatCard
          label="Video views"
          value={pick("views")?.value ?? 0}
          changePct={pick("views")?.changePct}
          hint="YouTube + TikTok"
          accent="#FF0033"
        />
        <StatCard
          label="Followers"
          value={pick("followers")?.value ?? 0}
          changePct={pick("followers")?.changePct}
          hint="all platforms"
          accent="#E1306C"
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(pick("revenue")?.value ?? 0)}
          changePct={pick("revenue")?.changePct}
          hint="platform-reported"
          accent="#a3e635"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Streams" subtitle="Daily totals, all music platforms combined">
          <TrendChart data={streams.map((p) => ({ date: p.date, value: p.value }))} />
          <SourceNote>
            Combined from platform APIs and monthly royalty reports. Spotify and Apple
            Music figures are report-derived — those platforms publish no per-artist
            stream API.
          </SourceNote>
        </Panel>

        <Panel title="Top countries" subtitle="Listeners, merged across platforms">
          <GeoChart data={geo.slice(0, 8)} />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Top performing"
          subtitle="Ranked by streams in the selected period"
          action={
            <Link
              href="/dashboard/releases"
              className="text-xs text-brand-300 transition-colors hover:text-brand-200"
            >
              All releases →
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-lg text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs text-ink-400">
                  <th className="pb-3 font-medium">Track</th>
                  <th className="pb-3 text-right font-medium">Streams</th>
                  <th className="pb-3 text-right font-medium">Listeners</th>
                  <th className="pb-3 text-right font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {top.map((t) => (
                  <tr key={t.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3.5">
                      <p className="font-medium text-white">{t.title}</p>
                      <p className="text-xs text-ink-400">{t.creator}</p>
                    </td>
                    <td className="py-3.5 text-right text-ink-200">
                      {formatCompact(t.metrics.streams ?? 0)}
                    </td>
                    <td className="py-3.5 text-right text-ink-400">
                      {formatCompact(t.metrics.listeners ?? 0)}
                    </td>
                    <td className="py-3.5 text-right text-ink-200">
                      {formatCurrency(t.metrics.revenue ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Connections" subtitle={`${connected} of ${adapters.length} platforms active`}>
          <ul className="flex flex-col gap-2.5">
            {adapters.slice(0, 7).map((a) => (
              <li key={a.meta.id} className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: a.meta.color }}
                  />
                  <span className="truncate text-sm text-ink-200">{a.meta.name}</span>
                </span>
                <span
                  className={
                    a.meta.status === "planned"
                      ? "shrink-0 text-[11px] text-ink-400"
                      : "shrink-0 text-[11px] text-signal-400"
                  }
                >
                  {a.meta.status === "planned" ? "Not connected" : "Syncing"}
                </span>
              </li>
            ))}
          </ul>
          <ButtonLink
            href="/dashboard/platforms"
            variant="outline"
            size="sm"
            className="mt-5 w-full"
          >
            Manage connections
          </ButtonLink>
        </Panel>
      </div>
    </>
  );
}
