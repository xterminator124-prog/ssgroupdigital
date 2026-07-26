/**
 * Platform adapters.
 *
 * Each adapter declares honest capabilities in `meta` (what the API actually
 * returns, what auth it needs, where it falls short) and currently serves
 * deterministic mock data. Replacing a stub with a live integration is a
 * self-contained change: keep the `meta`, implement the fetch methods against
 * the real API, flip `status` to "live".
 */

import {
  mockDemographics,
  mockGeo,
  mockTimeSeries,
  mockTopContent,
  summarize,
} from "./mock";
import type {
  ContentItem,
  DemographicBreakdown,
  FetchContext,
  GeoBreakdown,
  MetricKey,
  MetricPoint,
  MetricSummary,
  PlatformAdapter,
  PlatformMeta,
} from "./types";

/** Builds a stub adapter from meta + per-metric baselines. */
function stubAdapter(
  meta: PlatformMeta,
  baselines: Partial<Record<MetricKey, number>>,
): PlatformAdapter {
  const series = (ctx: FetchContext): MetricPoint[] =>
    meta.supports.flatMap((m) =>
      baselines[m] ? mockTimeSeries(meta.id, m, ctx.range, baselines[m]!) : [],
    );

  return {
    meta,
    async fetchTimeSeries(ctx): Promise<MetricPoint[]> {
      return series(ctx);
    },
    async fetchSummary(ctx): Promise<MetricSummary[]> {
      const points = series(ctx);
      return meta.supports
        .filter((m) => baselines[m])
        .map((m) => summarize(points, m));
    },
    async fetchTopContent(ctx, limit = 8): Promise<ContentItem[]> {
      return mockTopContent(meta.id, limit);
    },
    async fetchGeo(ctx): Promise<GeoBreakdown[]> {
      return mockGeo(meta.id, (baselines.listeners ?? baselines.followers ?? 50_000) * 30);
    },
    async fetchDemographics(): Promise<DemographicBreakdown[]> {
      return mockDemographics(meta.id);
    },
  };
}

/* -------------------------------------------------------------------------
   Music DSPs
   ------------------------------------------------------------------------- */

export const spotify = stubAdapter(
  {
    id: "spotify",
    name: "Spotify",
    category: "music",
    auth: "oauth2",
    supports: ["streams", "listeners", "followers", "saves", "revenue"],
    color: "#1DB954",
    rateLimit: "Rolling 30s window, ~180 req/min per app (undocumented, 429 + Retry-After)",
    status: "stub",
    notes:
      "Web API covers catalog, playlists, and audio features. Per-artist stream " +
      "counts and listener demographics live in Spotify for Artists, which has " +
      "no public API — production plan is S4A CSV/report ingestion plus " +
      "distributor royalty reports, with the Web API used for catalog metadata.",
  },
  { streams: 84_000, listeners: 21_000, followers: 480, saves: 3_400, revenue: 290 },
);

export const appleMusic = stubAdapter(
  {
    id: "apple_music",
    name: "Apple Music",
    category: "music",
    auth: "jwt",
    supports: ["streams", "listeners", "revenue"],
    color: "#FA243C",
    rateLimit: "Developer-token scoped; 20 req/s soft ceiling",
    status: "stub",
    notes:
      "MusicKit developer token is an ES256 JWT signed with a .p8 private key " +
      "(team id + key id), valid up to 6 months. Catalog data is open to any " +
      "valid token; play counts require Apple Music for Artists, which is " +
      "report-export only — same ingestion path as Spotify.",
  },
  { streams: 31_000, listeners: 9_100, revenue: 210 },
);

export const deezer = stubAdapter(
  {
    id: "deezer",
    name: "Deezer",
    category: "music",
    auth: "public",
    supports: ["streams", "followers"],
    color: "#A238FF",
    rateLimit: "50 requests / 5 seconds per IP",
    status: "stub",
    notes:
      "Public REST API needs no key for catalog, artist, and fan-count reads. " +
      "OAuth only required for user-scoped data. Cheapest platform to ship first.",
  },
  { streams: 6_200, followers: 140 },
);

export const jiosaavn = stubAdapter(
  {
    id: "jiosaavn",
    name: "JioSaavn",
    category: "music",
    auth: "csv_import",
    supports: ["streams", "revenue"],
    color: "#2BC5B4",
    rateLimit: "n/a",
    status: "planned",
    notes:
      "No public developer API. Numbers arrive through the distributor royalty " +
      "feed. Treated as a first-class platform in the UI via the same normalized " +
      "schema, sourced from monthly statement ingestion.",
  },
  { streams: 44_000, revenue: 130 },
);

export const amazonMusic = stubAdapter(
  {
    id: "amazon_music",
    name: "Amazon Music",
    category: "music",
    auth: "csv_import",
    supports: ["streams", "revenue"],
    color: "#25D1DA",
    status: "planned",
    notes: "Reporting via Amazon Music for Artists exports and royalty statements.",
  },
  { streams: 12_400, revenue: 95 },
);

/* -------------------------------------------------------------------------
   Video
   ------------------------------------------------------------------------- */

export const youtube = stubAdapter(
  {
    id: "youtube",
    name: "YouTube",
    category: "video",
    auth: "oauth2",
    supports: [
      "views",
      "watch_time_minutes",
      "followers",
      "likes",
      "comments",
      "shares",
      "impressions",
      "revenue",
    ],
    color: "#FF0033",
    rateLimit: "10,000 quota units/day default; Analytics API 720 queries/min/user",
    status: "stub",
    notes:
      "The richest integration available. YouTube Analytics API returns real " +
      "daily views, watch time, geography, demographics, traffic sources, and " +
      "estimated revenue via OAuth. Quota is the binding constraint — cache " +
      "aggressively and batch a nightly sync rather than querying on page load.",
  },
  {
    views: 128_000,
    watch_time_minutes: 310_000,
    followers: 1_200,
    likes: 6_800,
    comments: 540,
    shares: 900,
    impressions: 1_900_000,
    revenue: 420,
  },
);

export const youtubeContentId = stubAdapter(
  {
    id: "youtube_content_id",
    name: "YouTube Content ID",
    category: "rights",
    auth: "oauth2",
    supports: ["views", "revenue"],
    color: "#FF7A00",
    rateLimit: "Reporting API: async report jobs, not real-time queries",
    status: "planned",
    notes:
      "Requires an approved CMS partner account — not self-serve. Data comes " +
      "from YouTube Reporting API bulk jobs (claims, asset revenue) delivered " +
      "as downloadable reports, so ingestion is a scheduled job, not a live call.",
  },
  { views: 2_400_000, revenue: 1_850 },
);

/* -------------------------------------------------------------------------
   Social
   ------------------------------------------------------------------------- */

export const instagram = stubAdapter(
  {
    id: "instagram",
    name: "Instagram",
    category: "social",
    auth: "oauth2",
    supports: [
      "followers",
      "reach",
      "impressions",
      "likes",
      "comments",
      "shares",
      "profile_visits",
    ],
    color: "#E1306C",
    rateLimit: "200 calls/hour × connected users, per app",
    status: "stub",
    notes:
      "Instagram Graph API only works for Business and Creator accounts linked " +
      "to a Facebook Page. Insights have a 2-year lookback for account metrics " +
      "and shorter windows for media. App Review is required for the " +
      "instagram_manage_insights permission before going live.",
  },
  {
    followers: 18_400,
    reach: 240_000,
    impressions: 520_000,
    likes: 14_000,
    comments: 890,
    shares: 2_100,
    profile_visits: 9_800,
  },
);

export const tiktok = stubAdapter(
  {
    id: "tiktok",
    name: "TikTok",
    category: "social",
    auth: "oauth2",
    supports: ["views", "followers", "likes", "comments", "shares"],
    color: "#25F4EE",
    rateLimit: "Display API: 600 req/min per app",
    status: "stub",
    notes:
      "Display API gives profile and video-level public stats with user consent. " +
      "Deeper analytics need the Research API (approval required, region-limited) " +
      "or TikTok for Business. Sound-level attribution for music is not exposed.",
  },
  { views: 890_000, followers: 32_000, likes: 76_000, comments: 3_200, shares: 8_900 },
);

export const facebook = stubAdapter(
  {
    id: "facebook",
    name: "Facebook",
    category: "social",
    auth: "oauth2",
    supports: ["followers", "reach", "impressions", "likes"],
    color: "#0866FF",
    rateLimit: "Shares the Meta app-level rate budget with Instagram",
    status: "planned",
    notes: "Same Meta app and review process as Instagram; low marginal cost once IG ships.",
  },
  { followers: 7_600, reach: 96_000, impressions: 180_000, likes: 4_100 },
);

export const ALL_ADAPTERS: PlatformAdapter[] = [
  spotify,
  appleMusic,
  youtube,
  youtubeContentId,
  instagram,
  tiktok,
  deezer,
  jiosaavn,
  amazonMusic,
  facebook,
];
