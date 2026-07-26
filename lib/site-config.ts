export const site = {
  name: "SS Group Digital",
  shortName: "SSGD",
  domain: "ssgroupdigital.com",
  url: "https://ssgroupdigital.com",
  tagline: "Independent, with the numbers to prove it.",
  description:
    "Distribute to every major platform, keep 100% of your rights and revenue, " +
    "and see all of it in one analytics dashboard.",
  email: "hello@ssgroupdigital.com",
  supportEmail: "support@ssgroupdigital.com",
  phone: "+91 92977 00000",
  social: {
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
    x: "https://x.com/",
    linkedin: "https://linkedin.com/",
  },
} as const;

export const primaryNav = [
  {
    label: "Product",
    href: "/features",
    children: [
      { label: "Distribution", href: "/distribution", desc: "150+ stores and platforms" },
      { label: "Creator Analytics", href: "/analytics", desc: "Every platform, one dashboard" },
      { label: "Rights & Content ID", href: "/features#rights", desc: "Claim what's yours" },
      { label: "Royalties", href: "/features#royalties", desc: "Splits, statements, payouts" },
    ],
  },
  { label: "Analytics", href: "/analytics" },
  { label: "Pricing", href: "/pricing" },
  { label: "Company", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = [
  {
    title: "Product",
    links: [
      { label: "Distribution", href: "/distribution" },
      { label: "Creator Analytics", href: "/analytics" },
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Dashboard demo", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/about#careers" },
      { label: "Press kit", href: "/about#press" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help centre", href: "/contact" },
      { label: "Release guidelines", href: "/distribution#guidelines" },
      { label: "API status", href: "/dashboard/platforms" },
      { label: "Developer docs", href: "/analytics#api" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Royalty policy", href: "/legal/royalties" },
    ],
  },
] as const;

/** Stores we distribute to. Used by the marquee and the partners grid. */
export const STORES = [
  "Spotify",
  "Apple Music",
  "YouTube Music",
  "Amazon Music",
  "Instagram",
  "TikTok",
  "Deezer",
  "JioSaavn",
  "Tidal",
  "Anghami",
  "Pandora",
  "Boomplay",
  "Gaana",
  "Napster",
  "iHeartRadio",
  "Beatport",
] as const;
