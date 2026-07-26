/**
 * Platform-agnostic analytics contract.
 *
 * Every creator platform we integrate — music DSPs, video, social — is reduced
 * to the same normalized shapes below. UI code never imports a platform SDK;
 * it only ever sees these types. Adding a platform means writing one adapter,
 * registering it, and changing nothing else.
 */

export type PlatformId =
  | "spotify"
  | "apple_music"
  | "youtube"
  | "youtube_content_id"
  | "instagram"
  | "tiktok"
  | "deezer"
  | "jiosaavn"
  | "amazon_music"
  | "facebook";

export type PlatformCategory = "music" | "video" | "social" | "rights";

/** How an adapter gets its data. Drives the UI's "connect" flow. */
export type AuthKind =
  | "oauth2" // user grants access, we store refresh token
  | "client_credentials" // app-level token, no user context
  | "jwt" // signed developer token (Apple MusicKit)
  | "public" // no auth needed
  | "csv_import"; // no public API — user uploads an export

/** Canonical metric keys. Not every platform reports every one. */
export type MetricKey =
  | "streams"
  | "listeners"
  | "followers"
  | "saves"
  | "views"
  | "watch_time_minutes"
  | "likes"
  | "comments"
  | "shares"
  | "impressions"
  | "reach"
  | "profile_visits"
  | "revenue";

/** A single metric at a single point in time. */
export interface MetricPoint {
  /** ISO-8601 date, day granularity: 2026-07-27 */
  date: string;
  metric: MetricKey;
  value: number;
  /** Present only when metric === "revenue". */
  currency?: string;
}

/** A rolled-up metric for a period, with prior-period comparison. */
export interface MetricSummary {
  metric: MetricKey;
  value: number;
  previousValue: number;
  /** Percent change vs. previous period. Null when previousValue is 0. */
  changePct: number | null;
  currency?: string;
}

/** One track / video / post, normalized. */
export interface ContentItem {
  id: string;
  platform: PlatformId;
  title: string;
  /** Artist, channel, or account name. */
  creator: string;
  artworkUrl?: string;
  releasedAt?: string;
  metrics: Partial<Record<MetricKey, number>>;
  externalUrl?: string;
}

/** Where an audience is, normalized across platforms. */
export interface GeoBreakdown {
  /** ISO 3166-1 alpha-2 */
  countryCode: string;
  countryName: string;
  value: number;
  metric: MetricKey;
}

export interface DemographicBreakdown {
  ageRange: "13-17" | "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";
  gender: "male" | "female" | "other" | "unknown";
  /** Share of audience, 0..1 */
  share: number;
}

export interface DateRange {
  /** inclusive, ISO date */
  from: string;
  /** inclusive, ISO date */
  to: string;
}

export interface FetchContext {
  /** Our internal creator/account id. */
  creatorId: string;
  range: DateRange;
  /**
   * Decrypted credentials for this creator + platform. Adapters must not read
   * process.env for user-scoped secrets — only for app-level client IDs.
   */
  credentials?: PlatformCredentials;
}

export interface PlatformCredentials {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  /** Platform-native account identifier (channel id, artist id, page id...). */
  externalAccountId?: string;
}

export interface ConnectionStatus {
  platform: PlatformId;
  connected: boolean;
  accountName?: string;
  lastSyncedAt?: string;
  /** Set when connected === false and a reconnect is required. */
  error?: string;
}

/**
 * The adapter interface. Implement this once per platform.
 * Every method is optional except `meta` — platforms differ in what they expose,
 * and the UI degrades gracefully rather than assuming parity.
 */
export interface PlatformAdapter {
  readonly meta: PlatformMeta;

  /** Build the OAuth consent URL. Omit for public/jwt/csv platforms. */
  getAuthorizationUrl?(state: string): string;

  /** Exchange an OAuth code for tokens. */
  exchangeCode?(code: string): Promise<PlatformCredentials>;

  /** Refresh an expired access token. */
  refresh?(credentials: PlatformCredentials): Promise<PlatformCredentials>;

  /** Daily time series for the requested range. */
  fetchTimeSeries?(ctx: FetchContext): Promise<MetricPoint[]>;

  /** Period totals with prior-period deltas. */
  fetchSummary?(ctx: FetchContext): Promise<MetricSummary[]>;

  /** Top-performing tracks / videos / posts. */
  fetchTopContent?(ctx: FetchContext, limit?: number): Promise<ContentItem[]>;

  /** Audience by country. */
  fetchGeo?(ctx: FetchContext): Promise<GeoBreakdown[]>;

  /** Audience by age + gender. */
  fetchDemographics?(ctx: FetchContext): Promise<DemographicBreakdown[]>;

  /** Earnings reported by the platform itself (not our royalty ledger). */
  fetchRevenue?(ctx: FetchContext): Promise<MetricPoint[]>;
}

export interface PlatformMeta {
  id: PlatformId;
  name: string;
  category: PlatformCategory;
  auth: AuthKind;
  /** Metrics this platform can actually return. Drives UI capability checks. */
  supports: MetricKey[];
  /** Brand hex, used for chart series and badges. */
  color: string;
  /** Documented rate limit, for the ops dashboard and backoff planning. */
  rateLimit?: string;
  /** Honest note on gaps, gotchas, approval requirements. */
  notes?: string;
  /** Whether this adapter currently returns live data or mock data. */
  status: "live" | "stub" | "planned";
}
