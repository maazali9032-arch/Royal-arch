import type { ReactNode } from "react";
import type { InvitationContent } from "@/lib/public-invitation";

function MotifBorder({ children }: { children: ReactNode }) {
  return (
    <div className="relative border border-gold/30 p-6 sm:p-8">
      <span className="absolute -left-px -top-px h-4 w-4 border-l border-t border-gold" />
      <span className="absolute -right-px -top-px h-4 w-4 border-r border-t border-gold" />
      <span className="absolute -bottom-px -left-px h-4 w-4 border-b border-l border-gold" />
      <span className="absolute -bottom-px -right-px h-4 w-4 border-b border-r border-gold" />
      <div className="girih pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function Crescent() {
  return (
    <svg viewBox="0 0 48 24" className="h-6 w-16 text-gold" fill="none" aria-hidden="true">
      <path d="M0 12h14" stroke="currentColor" strokeWidth="0.7" />
      <path d="M34 12h14" stroke="currentColor" strokeWidth="0.7" />
      <path
        d="M27 12a5 5 0 1 1-4.2-4.94A4 4 0 0 0 27 12Z"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <circle cx="30.5" cy="8" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function DetailsSection({ content }: { content: InvitationContent }) {
  const venue = [content.venue_name, content.venue_address, content.city].filter(Boolean);
  const events = (content.events ?? []).flatMap((event, index) => {
    const label = event.name ?? event.title ?? event.event_name;
    const title = event.time ?? event.start_time ?? event.date ?? event.event_date;
    const eventVenue = event.venue ?? event.venue_name ?? event.city;
    const body = event.note ?? event.description ?? eventVenue;
    if (!label && !title && !body) return [];
    const mapsUrl = event.maps_url ?? event.mapsUrl;
    return [{ key: event.id ?? `${label ?? "event"}-${index}`, label, title, body, mapsUrl }];
  });
  if (venue.length === 0 && events.length === 0 && !content.start_time && !content.end_time) return null;

  return (
    <section className="paper-grain relative px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-4xl gap-10 sm:gap-14">
        <header className="max-w-md">
          <Crescent />
          <p className="mt-6 text-[0.55rem] tracking-royal text-gold/80 uppercase">
            The Celebration
          </p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-ivory sm:text-5xl">Together in <span className="italic text-gold-foil">light and blessing</span></h2>
        </header>

        <div className="gold-rule w-full" />

        {/* asymmetric layout */}
        <div className="grid gap-8 sm:grid-cols-12">
          {venue.length > 0 && <div className="sm:col-span-7">
            <MotifBorder>
              {content.venue_image_url && <img src={content.venue_image_url} alt={content.venue_name ? `${content.venue_name} venue` : "Wedding venue"} loading="lazy" className="mb-6 aspect-[16/9] w-full object-cover" />}
              <p className="text-[0.55rem] tracking-royal text-gold uppercase">The Venue</p>
              <h3 className="mt-4 font-display text-2xl leading-snug text-ivory sm:text-3xl">
                {content.venue_name ?? venue[0]}
              </h3>
              {(content.venue_address || content.city) && <p className="mt-4 max-w-sm text-base leading-relaxed text-ivory/70">{[content.venue_address, content.city].filter(Boolean).join(", ")}</p>}
            </MotifBorder>
          </div>}

          {(events.length > 0 || content.start_time || content.end_time) && <div className={`grid gap-6 sm:pt-14 ${venue.length > 0 ? "sm:col-span-5" : "sm:col-span-12"}`}>
            {events.length === 0 && (content.start_time || content.end_time) && (
              <div className="border-l border-gold/40 pl-5">
                <p className="text-[0.52rem] tracking-royal text-gold uppercase">Ceremony</p>
                <p className="mt-2 font-display text-xl text-ivory">{[content.start_time, content.end_time].filter(Boolean).join(" — ")}</p>
              </div>
            )}
            {events.map((event) => (
              <div key={event.key} className="border-l border-gold/40 pl-5">
                {event.label && <p className="text-[0.52rem] tracking-royal text-gold uppercase">{event.label}</p>}
                {event.title && <p className="mt-2 font-display text-xl text-ivory">{event.title}</p>}
                {event.body && <p className="mt-2 text-sm leading-relaxed text-ivory/60">{event.body}</p>}
                {event.mapsUrl && <a href={event.mapsUrl} target="_blank" rel="noreferrer noopener" className="mt-3 inline-block border-b border-gold/40 pb-1 text-[0.5rem] tracking-royal text-gold uppercase">Directions</a>}
              </div>
            ))}
          </div>}
        </div>

        <div className="gold-rule w-full" />
      </div>
    </section>
  );
}
