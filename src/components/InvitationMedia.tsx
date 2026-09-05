import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { InvitationContent, PublicGalleryItem } from "@/lib/public-invitation";

function Profile({ name, photo, lines }: { name?: string | undefined; photo?: string | undefined; lines: Array<string | undefined> }) {
  const visibleLines = lines.filter((line): line is string => Boolean(line));
  if (!photo && !name && visibleLines.length === 0) return null;
  return (
    <article className="text-center">
      {photo && <img src={photo} alt={name ? `Portrait of ${name}` : "Wedding portrait"} loading="lazy" className="mx-auto aspect-[4/5] w-full max-w-xs object-cover" />}
      {name && <h3 className="mt-5 font-display text-2xl text-ivory">{name}</h3>}
      {visibleLines.map((line) => <p key={line} className="mt-2 text-sm leading-relaxed text-ivory/60">{line}</p>)}
    </article>
  );
}

export function CoupleProfiles({ content }: { content: InvitationContent }) {
  const hasGroom = content.groom_photo_url || content.groom_qualification || content.groom_occupation || content.groom_parents;
  const hasBride = content.bride_photo_url || content.bride_qualification || content.bride_occupation || content.bride_parents;
  if (!hasGroom && !hasBride && !content.relatives) return null;
  return (
    <section className="paper-grain relative px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-12 sm:grid-cols-2">
          {hasGroom && <Profile name={content.groom_name} photo={content.groom_photo_url} lines={[content.groom_qualification, content.groom_occupation, content.groom_parents]} />}
          {hasBride && <Profile name={content.bride_name} photo={content.bride_photo_url} lines={[content.bride_qualification, content.bride_occupation, content.bride_parents]} />}
        </div>
        {content.relatives && <p className="mx-auto mt-12 max-w-xl border-y border-gold/20 py-6 text-center text-sm leading-relaxed text-ivory/60">{content.relatives}</p>}
      </div>
    </section>
  );
}

export function Gallery({ items }: { items: PublicGalleryItem[] }) {
  if (!items.length) return null;
  return (
    <section className="paper-grain relative px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-[0.55rem] tracking-royal text-gold uppercase">Our Story</p>
        <div className="mt-8 grid auto-rows-[15rem] grid-cols-2 gap-2 sm:auto-rows-[20rem] sm:grid-cols-3">
          {items.map((item, index) => (
            <figure key={`${item.url}-${index}`} className={`relative overflow-hidden ${item.span === "wide" ? "col-span-2" : ""} ${item.span === "tall" ? "row-span-2" : ""}`}>
              <img src={item.url} alt={item.alt ?? item.caption ?? "Wedding memory"} loading="lazy" width={item.width} height={item.height} className="h-full w-full object-cover" />
              {item.caption && <figcaption className="absolute inset-x-0 bottom-0 bg-emerald-deep/80 px-4 py-3 text-sm text-ivory">{item.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MusicControl({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.paused) await audio.play();
      else audio.pause();
      setPlaying(!audio.paused);
    } catch {
      setPlaying(false);
    }
  };
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <audio ref={audioRef} src={url} preload="none" onEnded={() => setPlaying(false)} onError={() => setPlaying(false)} />
      <button type="button" onClick={() => void toggle()} aria-label={playing ? "Pause music" : "Play music"} title={playing ? "Pause music" : "Play music"} className="grid h-11 w-11 place-items-center border border-gold/50 bg-emerald-deep/90 text-gold backdrop-blur-sm">
        {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      </button>
    </div>
  );
}