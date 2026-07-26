import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";

import { Faq } from "@/components/site/faq";
import { ButtonLink } from "@/components/ui/button";
import { Aurora, Card, Eyebrow, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple plans for independent artists and labels. Keep 100% of your royalties on every tier.",
};

const PLANS = [
  {
    name: "Starter",
    price: "₹0",
    cadence: "forever",
    tagline: "Get your first release live.",
    cta: "Start free",
    href: "/dashboard",
    featured: false,
    features: [
      "1 artist profile",
      "2 releases per year",
      "Delivery to 150+ stores",
      "100% of net royalties",
      "Basic analytics (7-day history)",
      "Email support",
    ],
    missing: ["Content ID", "Custom splits", "API access"],
  },
  {
    name: "Artist",
    price: "₹1,499",
    cadence: "per year",
    tagline: "For artists releasing regularly.",
    cta: "Choose Artist",
    href: "/dashboard",
    featured: true,
    features: [
      "3 artist profiles",
      "Unlimited releases",
      "Delivery to 150+ stores",
      "100% of net royalties",
      "Full cross-platform analytics",
      "YouTube Content ID (eligible works)",
      "Collaborator splits",
      "Pre-save and smart links",
      "Priority support",
    ],
    missing: ["Read-only API access"],
  },
  {
    name: "Label",
    price: "₹6,999",
    cadence: "per year",
    tagline: "Rosters, catalogues and reporting.",
    cta: "Choose Label",
    href: "/contact",
    featured: false,
    features: [
      "Unlimited artist profiles",
      "Unlimited releases",
      "Everything in Artist, plus:",
      "Full analytics API access",
      "Bulk catalogue import",
      "Sub-account permissions",
      "Custom royalty statements",
      "Dedicated account manager",
    ],
    missing: [],
  },
];

const COMPARISON: Array<{ label: string; values: [string, string, string] }> = [
  { label: "Commission on royalties", values: ["0%", "0%", "0%"] },
  { label: "Releases per year", values: ["2", "Unlimited", "Unlimited"] },
  { label: "Artist profiles", values: ["1", "3", "Unlimited"] },
  { label: "Analytics history", values: ["7 days", "Full history", "Full history"] },
  { label: "Platforms unified", values: ["3", "All 10", "All 10"] },
  { label: "YouTube Content ID", values: ["—", "Included", "Included"] },
  { label: "Collaborator splits", values: ["—", "Up to 10", "Unlimited"] },
  { label: "API access", values: ["—", "—", "Read + webhooks"] },
  { label: "Support", values: ["Email", "Priority", "Dedicated manager"] },
];

const FAQS = [
  {
    q: "Do you really take 0% commission?",
    a: "Yes. The plan fee is how we make money. Whatever the stores pay for your music, minus their own cut, lands in your ledger. We do not skim a percentage on top.",
  },
  {
    q: "What happens to my releases if I stop paying?",
    a: "Existing releases stay live for the remainder of your paid term. After that they enter a 90-day grace window before we begin takedowns, and you can export your full catalogue and analytics history at any point.",
  },
  {
    q: "Can I upgrade mid-year?",
    a: "Yes, and we prorate. You only pay the difference for the remaining term.",
  },
  {
    q: "Is there a free trial on paid plans?",
    a: "The Starter plan is free indefinitely rather than a countdown trial, so you can put a real release out and see the platform work before paying anything.",
  },
];

function PlanCard({ plan }: { plan: (typeof PLANS)[number] }) {
  return (
    <Card
      hover={false}
      className={
        plan.featured
          ? "h-full border-brand-500/40 bg-gradient-to-b from-brand-600/12 to-ink-900/60 ring-1 ring-brand-500/20"
          : "h-full"
      }
    >
      {plan.featured ? (
        <span className="absolute top-5 right-5 rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-medium text-white">
          Most popular
        </span>
      ) : null}

      <h3 className="text-lg font-semibold">{plan.name}</h3>
      <p className="mt-1 text-sm text-ink-400">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-4xl font-semibold text-white">{plan.price}</span>
        <span className="text-sm text-ink-400">{plan.cadence}</span>
      </div>

      <ButtonLink
        href={plan.href}
        variant={plan.featured ? "primary" : "outline"}
        size="md"
        className="mt-6 w-full"
      >
        {plan.cta}
      </ButtonLink>

      <ul className="mt-7 flex flex-col gap-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-ink-200">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal-400" />
            {f}
          </li>
        ))}
        {plan.missing.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-ink-400">
            <Minus className="mt-0.5 h-4 w-4 shrink-0 text-ink-600" />
            {f}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-10 lg:pt-24">
        <Aurora />
        <div className="container-x flex flex-col items-center gap-5 text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl lg:text-6xl">
            Pay for the platform.{" "}
            <span className="text-gradient">Keep all of the royalties.</span>
          </h1>
          <p className="max-w-xl text-lg text-ink-300">
            Every plan delivers to all 150+ stores and takes 0% commission. The
            difference is volume, analytics depth, and how much control you need.
          </p>
        </div>
      </section>

      <Section className="pt-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 90}>
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading title="Compare plans" align="center" />
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-2xl border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 text-left font-medium text-ink-400">Feature</th>
                {PLANS.map((p) => (
                  <th key={p.name} className="px-4 py-4 text-center font-semibold text-white">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.label} className="border-b border-white/6">
                  <td className="py-4 text-ink-300">{row.label}</td>
                  {row.values.map((v, i) => (
                    <td
                      key={i}
                      className={
                        v === "—"
                          ? "px-4 py-4 text-center text-ink-600"
                          : "px-4 py-4 text-center text-ink-200"
                      }
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="faq" className="pb-28">
        <SectionHeading title="Billing questions" align="center" />
        <div className="mt-12">
          <Faq items={FAQS} />
        </div>
      </Section>
    </>
  );
}
