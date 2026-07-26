import type { Metadata } from "next";
import { Mail, MessageCircle, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Aurora, Card, Eyebrow, Section } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to the SS Group Digital team about distribution, analytics or partnerships.",
};

const CHANNELS = [
  {
    icon: Mail,
    title: "General enquiries",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    icon: MessageCircle,
    title: "Artist support",
    value: site.supportEmail,
    href: `mailto:${site.supportEmail}`,
  },
  {
    icon: MapPin,
    title: "Where we are",
    value: "India · operating worldwide",
    href: null,
  },
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-white " +
  "placeholder:text-ink-400 transition-colors focus:border-brand-500/60 focus:outline-none";

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-8 lg:pt-24">
        <Aurora />
        <div className="container-x flex flex-col items-center gap-5 text-center">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="max-w-2xl text-4xl font-semibold sm:text-5xl">
            Tell us what you&apos;re trying to release
          </h1>
          <p className="max-w-xl text-lg text-ink-300">
            Support questions get answered within one business day. Partnership
            enquiries usually faster.
          </p>
        </div>
      </section>

      <Section className="pb-28">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="flex flex-col gap-4">
              {CHANNELS.map((c) => (
                <Card key={c.title} hover={false}>
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-brand-600/15 text-brand-300">
                    <c.icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold">{c.title}</h3>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="mt-1 block text-sm text-brand-300 transition-colors hover:text-brand-200"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-ink-400">{c.value}</p>
                  )}
                </Card>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Card hover={false} className="p-6 lg:p-8">
              {/*
                Wire this to a server action or /api/contact once you pick an
                email provider (Resend and Postmark both work well here).
                Add a honeypot field and rate limiting before going live.
              */}
              <form className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-xs text-ink-300">
                      Name
                    </label>
                    <input id="name" name="name" required className={inputClass} placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-xs text-ink-300">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={inputClass}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="topic" className="mb-1.5 block text-xs text-ink-300">
                    Topic
                  </label>
                  <select id="topic" name="topic" className={inputClass}>
                    <option>Distribution</option>
                    <option>Analytics & API</option>
                    <option>Rights / Content ID</option>
                    <option>Label or partnership</option>
                    <option>Something else</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-xs text-ink-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className={`${inputClass} resize-y`}
                    placeholder="What are you working on?"
                  />
                </div>

                <Button type="submit" size="lg" className="mt-1 w-full sm:w-auto">
                  Send message
                </Button>
                <p className="text-xs text-ink-400">
                  We reply to every message. No newsletter signup hidden in here.
                </p>
              </form>
            </Card>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
