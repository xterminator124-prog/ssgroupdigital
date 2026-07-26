/**
 * Deterministic mock data.
 *
 * Seeded so server and client render identical values — random mocks cause
 * React hydration mismatches. Swap these out adapter-by-adapter as real
 * integrations land; the shapes are already the production shapes.
 */

import type {
  ContentItem,
  DateRange,
  DemographicBreakdown,
  GeoBreakdown,
  MetricKey,
  MetricPoint,
  MetricSummary,
  PlatformId,
} from "./types";

/** mulberry32 — small, fast, deterministic. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function daysBetween(range: DateRange): string[] {
  const out: string[] = [];
  const start = new Date(`${range.from}T00:00:00Z`);
  const end = new Date(`${range.to}T00:00:00Z`);
  for (let d = start; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export function rangeForDays(days: number, today = "2026-07-27"): DateRange {
  const end = new Date(`${today}T00:00:00Z`);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return { from: start.toISOString().slice(0, 10), to: end.toISOString().slice(0, 10) };
}

/**
 * A believable daily series: upward drift + weekly seasonality + noise,
 * with an occasional release spike.
 */
export function mockTimeSeries(
  platform: PlatformId,
  metric: MetricKey,
  range: DateRange,
  base: number,
): MetricPoint[] {
  const rand = seeded(hash(`${platform}:${metric}`));
  const days = daysBetween(range);

  return days.map((date, i) => {
    const trend = 1 + (i / Math.max(days.length, 1)) * 0.45;
    const dow = new Date(`${date}T00:00:00Z`).getUTCDay();
    // Streaming peaks Thu–Sat, dips Monday.
    const weekly = [0.88, 0.94, 0.98, 1.02, 1.12, 1.15, 1.05][dow];
    const noise = 0.9 + rand() * 0.2;
    const spike = i % 29 === 0 ? 1.6 : 1;
    return {
      date,
      metric,
      value: Math.round(base * trend * weekly * noise * spike),
    };
  });
}

export function summarize(points: MetricPoint[], metric: MetricKey): MetricSummary {
  const series = points.filter((p) => p.metric === metric);
  const mid = Math.floor(series.length / 2);
  const prev = series.slice(0, mid).reduce((s, p) => s + p.value, 0);
  const curr = series.slice(mid).reduce((s, p) => s + p.value, 0);
  return {
    metric,
    value: curr,
    previousValue: prev,
    changePct: prev === 0 ? null : ((curr - prev) / prev) * 100,
  };
}

const TRACKS = [
  "Neon Monsoon",
  "Sunlight in Bandra",
  "Paper Boats",
  "Half-Light",
  "Delhi 3AM",
  "Saffron Static",
  "Winter Rooms",
  "Ghost Frequency",
  "Terracotta",
  "Slow Burn Skyline",
];

const ARTISTS = ["Aarav Sen", "MIRAJ", "Kavya Rao", "The Ninth Floor", "Dust & Echo"];

export function mockTopContent(platform: PlatformId, limit = 8): ContentItem[] {
  const rand = seeded(hash(`content:${platform}`));
  return Array.from({ length: limit }, (_, i) => {
    const streams = Math.round(420_000 * Math.pow(0.72, i) * (0.85 + rand() * 0.3));
    return {
      id: `${platform}-${i}`,
      platform,
      title: TRACKS[i % TRACKS.length],
      creator: ARTISTS[i % ARTISTS.length],
      releasedAt: `2026-0${(i % 6) + 1}-1${i % 9}`,
      metrics: {
        streams,
        listeners: Math.round(streams * (0.28 + rand() * 0.1)),
        saves: Math.round(streams * 0.041),
        revenue: Math.round(streams * 0.0034 * 100) / 100,
      },
    } satisfies ContentItem;
  });
}

const COUNTRIES: [string, string, number][] = [
  ["IN", "India", 0.38],
  ["US", "United States", 0.17],
  ["GB", "United Kingdom", 0.08],
  ["AE", "United Arab Emirates", 0.06],
  ["CA", "Canada", 0.05],
  ["DE", "Germany", 0.045],
  ["AU", "Australia", 0.04],
  ["BR", "Brazil", 0.035],
  ["NG", "Nigeria", 0.03],
  ["ID", "Indonesia", 0.028],
];

export function mockGeo(platform: PlatformId, total: number): GeoBreakdown[] {
  const rand = seeded(hash(`geo:${platform}`));
  return COUNTRIES.map(([code, name, share]) => ({
    countryCode: code,
    countryName: name,
    metric: "listeners" as MetricKey,
    value: Math.round(total * share * (0.9 + rand() * 0.2)),
  })).sort((a, b) => b.value - a.value);
}

export function mockDemographics(platform: PlatformId): DemographicBreakdown[] {
  const rand = seeded(hash(`demo:${platform}`));
  const ages: DemographicBreakdown["ageRange"][] = [
    "13-17",
    "18-24",
    "25-34",
    "35-44",
    "45-54",
    "55-64",
  ];
  const weights = [0.09, 0.31, 0.29, 0.17, 0.09, 0.05];
  const rows: DemographicBreakdown[] = [];
  ages.forEach((ageRange, i) => {
    const split = 0.45 + rand() * 0.12;
    rows.push({ ageRange, gender: "male", share: weights[i] * split });
    rows.push({ ageRange, gender: "female", share: weights[i] * (1 - split) });
  });
  return rows;
}
