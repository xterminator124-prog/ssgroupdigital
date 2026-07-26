import type { Metadata } from "next";

import { Sidebar } from "@/components/dashboard/sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Cross-platform creator analytics, releases and royalties.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
