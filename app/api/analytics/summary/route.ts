import { NextResponse } from "next/server";

import { rangeForDays } from "@/lib/connectors/mock";
import {
  getAggregateSeries,
  getAggregateSummary,
  getGeo,
  getTopContent,
} from "@/lib/connectors/registry";
import type { MetricKey, PlatformId } from "@/lib/connectors/types";

/**
 * GET /api/analytics/summary?days=30&metric=streams&platforms=spotify,youtube
 *
 * Single endpoint the dashboard hydrates from. In production this sits behind
 * auth and reads from the nightly-synced warehouse table rather than calling
 * platform APIs inline — the adapter contract is identical either way.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);

  const days = Math.min(Math.max(Number(url.searchParams.get("days") ?? 30), 7), 365);
  const metric = (url.searchParams.get("metric") ?? "streams") as MetricKey;
  const platformsParam = url.searchParams.get("platforms");
  const platforms = platformsParam
    ? (platformsParam.split(",").filter(Boolean) as PlatformId[])
    : undefined;

  const opts = {
    // TODO: replace with the authenticated creator id from the session.
    creatorId: "demo",
    range: rangeForDays(days),
    platforms,
  };

  const [summary, series, top, geo] = await Promise.all([
    getAggregateSummary(opts),
    getAggregateSeries(opts, metric),
    getTopContent(opts, 10),
    getGeo(opts),
  ]);

  return NextResponse.json(
    { range: opts.range, metric, summary, series, top, geo },
    { headers: { "cache-control": "private, max-age=60" } },
  );
}
