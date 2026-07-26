/**
 * The registry is the only place the rest of the app touches platforms.
 * Pages ask for "all music platforms" or "the aggregate streams series" —
 * never for a specific vendor SDK.
 */

import { ALL_ADAPTERS } from "./adapters";
import type {
  ContentItem,
  DateRange,
  FetchContext,
  GeoBreakdown,
  MetricKey,
  MetricPoint,
  MetricSummary,
  PlatformAdapter,
  PlatformCategory,
  PlatformId,
} from "./types";

const BY_ID = new Map<PlatformId, PlatformAdapter>(
  ALL_ADAPTERS.map((a) => [a.meta.id, a]),
);

export function getAdapter(id: PlatformId): PlatformAdapter | undefined {
  return BY_ID.get(id);
}

export function listAdapters(category?: PlatformCategory): PlatformAdapter[] {
  return category
    ? ALL_ADAPTERS.filter((a) => a.meta.category === category)
    : ALL_ADAPTERS;
}

export function platformsSupporting(metric: MetricKey): PlatformAdapter[] {
  return ALL_ADAPTERS.filter((a) => a.meta.supports.includes(metric));
}

/** Adapters that can serve data today (live or stubbed), excluding "planned". */
export function activeAdapters(): PlatformAdapter[] {
  return ALL_ADAPTERS.filter((a) => a.meta.status !== "planned");
}

export interface AggregateOptions {
  creatorId: string;
  range: DateRange;
  platforms?: PlatformId[];
}

function contextsFor(opts: AggregateOptions): Array<[PlatformAdapter, FetchContext]> {
  const chosen = opts.platforms?.length
    ? opts.platforms.flatMap((id) => {
        const a = BY_ID.get(id);
        return a ? [a] : [];
      })
    : activeAdapters();

  return chosen.map((adapter) => [
    adapter,
    { creatorId: opts.creatorId, range: opts.range },
  ]);
}

/**
 * Fan out to every selected platform in parallel. One platform failing must
 * never blank the dashboard — failures are swallowed per-adapter and the rest
 * of the data still renders. Surface the failures via `getConnectionStatuses`.
 */
async function settled<T>(
  jobs: Array<Promise<T[]>>,
): Promise<T[]> {
  const results = await Promise.allSettled(jobs);
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

/** Per-platform daily series, tagged so charts can split by platform. */
export async function getTimeSeriesByPlatform(
  opts: AggregateOptions,
): Promise<Array<{ platform: PlatformId; points: MetricPoint[] }>> {
  const pairs = contextsFor(opts);
  const results = await Promise.allSettled(
    pairs.map(([a, ctx]) => a.fetchTimeSeries?.(ctx) ?? Promise.resolve([])),
  );
  return pairs.map(([a], i) => ({
    platform: a.meta.id,
    points: results[i].status === "fulfilled" ? (results[i] as PromiseFulfilledResult<MetricPoint[]>).value : [],
  }));
}

/** One number per metric, summed across platforms, with prior-period delta. */
export async function getAggregateSummary(
  opts: AggregateOptions,
): Promise<MetricSummary[]> {
  const pairs = contextsFor(opts);
  const all = await settled(
    pairs.map(([a, ctx]) => a.fetchSummary?.(ctx) ?? Promise.resolve([])),
  );

  const byMetric = new Map<MetricKey, MetricSummary>();
  for (const s of all) {
    const existing = byMetric.get(s.metric);
    if (!existing) {
      byMetric.set(s.metric, { ...s });
      continue;
    }
    existing.value += s.value;
    existing.previousValue += s.previousValue;
  }

  for (const s of byMetric.values()) {
    s.changePct =
      s.previousValue === 0
        ? null
        : ((s.value - s.previousValue) / s.previousValue) * 100;
  }

  return [...byMetric.values()];
}

/** Aggregate daily totals for one metric across all selected platforms. */
export async function getAggregateSeries(
  opts: AggregateOptions,
  metric: MetricKey,
): Promise<MetricPoint[]> {
  const byPlatform = await getTimeSeriesByPlatform(opts);
  const byDate = new Map<string, number>();

  for (const { points } of byPlatform) {
    for (const p of points) {
      if (p.metric !== metric) continue;
      byDate.set(p.date, (byDate.get(p.date) ?? 0) + p.value);
    }
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, metric, value }));
}

/** Best-performing content across every platform, ranked by streams or views. */
export async function getTopContent(
  opts: AggregateOptions,
  limit = 10,
): Promise<ContentItem[]> {
  const pairs = contextsFor(opts);
  const all = await settled(
    pairs.map(([a, ctx]) => a.fetchTopContent?.(ctx, limit) ?? Promise.resolve([])),
  );
  return all
    .sort(
      (a, b) =>
        (b.metrics.streams ?? b.metrics.views ?? 0) -
        (a.metrics.streams ?? a.metrics.views ?? 0),
    )
    .slice(0, limit);
}

/** Audience by country, merged across platforms. */
export async function getGeo(opts: AggregateOptions): Promise<GeoBreakdown[]> {
  const pairs = contextsFor(opts);
  const all = await settled(
    pairs.map(([a, ctx]) => a.fetchGeo?.(ctx) ?? Promise.resolve([])),
  );

  const merged = new Map<string, GeoBreakdown>();
  for (const g of all) {
    const existing = merged.get(g.countryCode);
    if (existing) existing.value += g.value;
    else merged.set(g.countryCode, { ...g });
  }
  return [...merged.values()].sort((a, b) => b.value - a.value);
}
