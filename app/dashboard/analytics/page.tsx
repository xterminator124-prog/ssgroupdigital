import {
  GeoChart,
  PlatformComparisonChart,
  RevenueDonut,
} from "@/components/dashboard/charts";
import { PageHeader, Panel, SourceNote, StatCard } from "@/components/dashboard/panel";
import { rangeForDays } from "@/lib/connectors/mock";
import {
  getAggregateSummary,
  getGeo,
  getTimeSeriesByPlatform,
  listAdapters,
} from "@/lib/connectors/registry";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-static";

/** Metrics we want on the comparison chart, in priority order per platform. */
const COMPARE_METRIC = ["streams", "views"] as const;

export default async function AnalyticsPage() {
  const opts = { creatorId: "demo", range: rangeForDays(60) };

  const [byPlatform, summary, geo] = await Promise.all([
    getTimeSeriesByPlatform(opts),
    getAggregateSummary(opts),
    getGeo(opts),
  ]);

  const metaById = new Map(listAdapters().map((a) => [a.meta.id, a.meta]));

  // Pivot per-platform series into recharts' row-per-date shape.
  const series: Array<{ key: string; name: string; color: string }> = [];
  const byDate = new Map<string, Record<string, string | number>>();

  for (const { platform, points } of byPlatform) {
    const meta = metaById.get(platform);
    if (!meta) continue;

    const metric = COMPARE_METRIC.find((m) => meta.supports.includes(m));
    if (!metric) continue;

    series.push({ key: platform, name: meta.name, color: meta.color });

    for (const p of points) {
      if (p.metric !== metric) continue;
      const row = byDate.get(p.date) ?? { date: p.date };
      row[platform] = p.value;
      byDate.set(p.date, row);
    }
  }

  const comparisonData = [...byDate.values()].sort((a, b) =>
    String(a.date).localeCompare(String(b.date)),
  );

  // Revenue split by platform, straight from each adapter's summary.
  const revenueByPlatform = await Promise.all(
    listAdapters()
      .filter((a) => a.meta.supports.includes("revenue") && a.meta.status !== "planned")
      .map(async (a) => {
        const rows = (await a.fetchSummary?.({ creatorId: "demo", range: opts.range })) ?? [];
        return {
          name: a.meta.name,
          value: Math.round(rows.find((r) => r.metric === "revenue")?.value ?? 0),
          color: a.meta.color,
        };
      }),
  );

  const pick = (metric: string) => summary.find((s) => s.metric === metric);

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Last 60 days · every connected platform on one timeline"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Streams"
          value={pick("streams")?.value ?? 0}
          changePct={pick("streams")?.changePct}
          accent="#8b5cf6"
        />
        <StatCard
          label="Views"
          value={pick("views")?.value ?? 0}
          changePct={pick("views")?.changePct}
          accent="#FF0033"
        />
        <StatCard
          label="Engagements"
          value={(pick("likes")?.value ?? 0) + (pick("comments")?.value ?? 0)}
          changePct={pick("likes")?.changePct}
          hint="likes + comments"
          accent="#22d3ee"
        />
        <StatCard
          label="Reach"
          value={pick("reach")?.value ?? 0}
          changePct={pick("reach")?.changePct}
          accent="#a3e635"
        />
      </div>

      <div className="mt-4">
        <Panel
          title="Platform comparison"
          subtitle="Streams for music services, views for video and social"
        >
          <PlatformComparisonChart data={comparisonData} series={series} />
          <SourceNote>
            Series are normalized onto one timeline but not made equivalent — a
            Spotify stream and a TikTok view measure different things. Compare shape
            and trend, not absolute magnitude.
          </SourceNote>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Audience by country" subtitle="Merged across all sources">
          <GeoChart data={geo.slice(0, 10)} />
        </Panel>

        <Panel
          title="Revenue by platform"
          subtitle={`Total ${formatCurrency(
            revenueByPlatform.reduce((s, r) => s + r.value, 0),
          )} in period`}
        >
          <RevenueDonut data={revenueByPlatform} />
          <SourceNote>
            Platform-reported estimates. Final amounts are reconciled against royalty
            statements on the Royalties page and may differ by a few percent.
          </SourceNote>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel title="Metric coverage" subtitle="What each connected platform can actually report">
          <div className="overflow-x-auto">
            <table className="w-full min-w-2xl text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs text-ink-400">
                  <th className="pb-3 font-medium">Platform</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Metrics available</th>
                  <th className="pb-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {listAdapters().map((a) => (
                  <tr key={a.meta.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3.5">
                      <span className="flex items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: a.meta.color }}
                        />
                        <span className="font-medium text-white">{a.meta.name}</span>
                      </span>
                    </td>
                    <td className="py-3.5 text-ink-400 capitalize">{a.meta.category}</td>
                    <td className="py-3.5">
                      <span className="flex flex-wrap gap-1">
                        {a.meta.supports.map((m) => (
                          <span
                            key={m}
                            className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-ink-400"
                          >
                            {m.replace(/_/g, " ")}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <span
                        className={
                          a.meta.status === "planned"
                            ? "text-[11px] text-ink-400"
                            : "text-[11px] text-signal-400"
                        }
                      >
                        {a.meta.status === "planned" ? "Planned" : "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}
