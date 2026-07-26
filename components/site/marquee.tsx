import { STORES } from "@/lib/site-config";

/**
 * Infinite logo strip. The list is rendered twice and translated -50%, so the
 * loop is seamless without JS. Duplicate is aria-hidden to avoid double
 * announcement by screen readers.
 */
export function StoreMarquee() {
  return (
    <div className="relative overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max animate-marquee gap-3">
        {[0, 1].map((pass) => (
          <ul
            key={pass}
            aria-hidden={pass === 1}
            className="flex shrink-0 items-center gap-3"
          >
            {STORES.map((store) => (
              <li
                key={`${pass}-${store}`}
                className="flex h-12 items-center rounded-2xl border border-white/8 bg-white/3 px-6 text-sm font-medium whitespace-nowrap text-ink-300"
              >
                {store}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
