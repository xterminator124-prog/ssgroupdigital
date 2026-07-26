import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-ink-950"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="pt-18">
        {children}
      </main>
      <Footer />
    </>
  );
}
