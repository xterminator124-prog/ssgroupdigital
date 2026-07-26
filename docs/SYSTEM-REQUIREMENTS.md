# System requirements

## 1. Local development

| | Minimum | Recommended |
|---|---|---|
| Node.js | 20.9 | **22 LTS** |
| npm | 10 | 10+ |
| RAM | 4 GB | 8 GB |
| Disk | 2 GB free | 5 GB free |
| OS | macOS, Linux, Windows (WSL2) | any of these |

```bash
node -v          # must print v20.9+ ; v22.x preferred
npm install
cp .env.example .env.local
npm run dev
```

Nothing else is needed for Phase 1 — the app runs entirely on deterministic
mock data, with no database or external service.

---

## 2. Hosting — pick one

### Option A · Vercel (recommended)

Purpose-built for Next.js. Zero server administration, automatic TLS, preview
deployments per branch.

- **Hobby tier** is enough for testing and early traffic.
- **Pro ($20/user/mo)** once you need real analytics, longer function timeouts,
  and password-protected previews.
- Set env vars in the project dashboard, not in files.

### Option B · Replit

Fastest path to a shareable live URL. Good for demos and early testing.

- Next.js 15 runs without modification.
- Built-in Postgres (Neon-backed) covers the Phase 2 database need.
- **Filesystem is ephemeral** — anything written to disk is lost on redeploy.
  Audio and artwork must go to object storage from day one.
- Cold starts on Autoscale deployments are noticeable under real traffic.
- No persistent Redis; use Upstash over HTTP.

### Option C · Self-managed VPS

Only worth it if you have a specific reason to manage servers.

| | Staging | Production (initial) |
|---|---|---|
| vCPU | 2 | 4 |
| RAM | 4 GB | 8 GB |
| Disk | 40 GB SSD | 80 GB NVMe |
| Bandwidth | 2 TB/mo | 4 TB/mo |
| OS | Ubuntu 24.04 LTS | Ubuntu 24.04 LTS |

Software: Node 22 LTS, Nginx (reverse proxy + gzip/brotli), PM2 or a systemd
unit, Certbot for Let's Encrypt. Expose 80 and 443 only; SSH on key auth.

Build note: `next build` peaks around 2 GB RAM. On a 2 GB box add swap or
build in CI and deploy the artifact.

---

## 3. Supporting services (Phase 2 onward)

| Service | Purpose | Sizing | Suggested |
|---|---|---|---|
| **PostgreSQL 16** | Accounts, releases, royalties, synced `metric_points` | 2 vCPU / 4 GB / 50 GB to start | Neon, Supabase, or RDS |
| **Redis 7** | API response cache + nightly sync job queue | 512 MB | Upstash (HTTP, works everywhere) |
| **Object storage** | Audio masters, artwork | Pay per GB | Cloudflare R2 (no egress fees) or S3 |
| **Transactional email** | Auth, statements, support | — | Resend or Postmark |
| **Error tracking** | — | — | Sentry |

**Object storage matters most.** A WAV master is 30–80 MB. A thousand releases
is roughly 50 GB before you've done anything else, and it grows monotonically.
Never put this on the app server's disk — R2 is the cheap option because it
charges no egress.

**Postgres sizing** is driven by the analytics table, not by users. One row per
creator × platform × metric × day. A thousand creators across 10 platforms and
8 metrics is ~29M rows/year — trivial for Postgres with a
`(creator_id, platform, metric, date)` composite index and monthly partitions.

---

## 4. Platform API accounts to register

Free to create; several need review before production use. Start the slow ones
early — Meta's app review and YouTube's CMS partnership are the long poles.

| Platform | Where | Lead time |
|---|---|---|
| Google Cloud (YouTube Data + Analytics) | console.cloud.google.com | Same day; quota increases take ~2 weeks |
| Meta (Instagram + Facebook Graph) | developers.facebook.com | App review: 2–6 weeks |
| TikTok for Developers | developers.tiktok.com | 1–3 weeks |
| Spotify for Developers | developer.spotify.com | Same day |
| Apple Developer (MusicKit) | developer.apple.com | Same day; $99/yr membership |
| Deezer | developers.deezer.com | Same day; most reads need no key |
| YouTube CMS / Content ID | Partner application | Months, not self-serve |

---

## 5. Scaling checkpoints

- **~1,000 creators:** Vercel Pro + Neon Scale + R2. No architecture change.
- **~10,000 creators:** move the nightly sync out of the web process into a
  dedicated worker; partition `metric_points` by month.
- **~100,000 creators:** the sync becomes the bottleneck, not the web tier.
  Platform rate limits force per-creator scheduling windows — design the job
  queue for that now, even while it's small.
