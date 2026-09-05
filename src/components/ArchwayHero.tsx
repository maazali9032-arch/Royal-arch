import { useEffect, useState } from "react";
import { JaliScreen, MehrabArch } from "./JaliScreen";

export function ArchwayHero({
  name1,
  name2,
  venue,
  invocation,
}: {
  name1?: string;
  name2?: string;
  venue: string;
  invocation?: string;
}) {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = window.innerHeight || 1;
        setP(Math.min(window.scrollY / h, 1.4));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="paper-grain relative h-[100svh] overflow-hidden">
      {/* background layer: scales up, walking-in feeling */}
      <div
        className="absolute inset-0 text-gold/25"
        style={{
          transform: `scale(${1 + p * 0.55}) translateY(${p * 24}px)`,
          opacity: 1 - p * 0.5,
        }}
      >
        <div className="girih absolute inset-0 opacity-[0.14]" />
        <JaliScreen className="absolute inset-0 opacity-40" opacity={0.6} />
      </div>

      {/* midground: slow drift + arch frame */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${p * -60}px) scale(${1 + p * 0.12})` }}
      >
        <div className="absolute inset-x-4 bottom-0 top-6 sm:inset-x-16 lg:inset-x-1/4">
          <MehrabArch className="absolute inset-0 h-full w-full text-gold/70 animate-shimmer" />
          <div className="absolute inset-x-[6%] bottom-0 top-[8%] overflow-hidden text-gold/25 [mask-image:radial-gradient(ellipse_at_50%_35%,transparent_38%,black_78%)]">
            <JaliScreen className="h-full w-full" opacity={0.75} />
          </div>
        </div>
      </div>

      {/* content */}
      <div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        style={{ transform: `translateY(${p * -110}px)`, opacity: 1 - p * 1.05 }}
      >
        {invocation && (
          <p className="max-w-md text-[0.55rem] leading-relaxed tracking-royal text-gold/80 uppercase sm:text-[0.65rem]">
            {invocation}
          </p>
        )}
        {invocation && <span className="mt-6 block h-px w-24 bg-gold/50" />}
        <h1 className="mt-8 font-display text-5xl leading-[0.95] text-ivory sm:text-7xl lg:text-8xl">
          {name1 && <span className="block">{name1}</span>}
          {name1 && name2 && <span className="my-3 block font-display text-2xl italic text-gold-foil sm:text-3xl">&amp;</span>}
          {name2 && <span className="block">{name2}</span>}
        </h1>
        {(name1 || name2) && venue && <span className="mt-8 block h-px w-24 bg-gold/50" />}
        {venue && <p className="mt-6 max-w-xs text-[0.55rem] leading-relaxed tracking-royal text-ivory/70 uppercase sm:text-[0.62rem]">{venue}</p>}
      </div>

      {/* foreground: fast zoom past the viewer */}
      <div
        className="pointer-events-none absolute inset-0 z-20 text-gold/40"
        style={{
          transform: `scale(${1 + p * 2.6})`,
          opacity: Math.max(0, 0.85 - p * 1.5),
        }}
      >
        <JaliScreen className="h-full w-full" opacity={0.9} strokeWidth={1.4} />
      </div>

      <div
        className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-[0.5rem] tracking-royal text-gold/70 uppercase animate-float"
        style={{ opacity: 1 - p * 2 }}
      >
        Scroll to enter
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-emerald-deep" />
    </section>
  );
}
