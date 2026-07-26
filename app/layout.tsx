import type { Metadata, Viewport } from "next";

import { site } from "@/lib/site-config";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Music distribution & cross-platform creator analytics`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "music distribution India",
    "creator analytics",
    "Spotify distribution",
    "YouTube Content ID",
    "royalty management",
    "independent artists",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05060b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Scroll-reveal elements start hidden and are shown by JS.
            Without JS they would stay invisible — force them visible. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
