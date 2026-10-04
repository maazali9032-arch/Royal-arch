import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useLocation } from "@tanstack/react-router";
import { ArchwayHero } from "@/components/ArchwayHero";
import { DetailsSection } from "@/components/DetailsSection";
import { InvitationState } from "@/components/InvitationState";
import { CoupleProfiles, Gallery, MusicControl } from "@/components/InvitationMedia";
import { ParticleField } from "@/components/ParticleField";
import { ScratchDate } from "@/components/ScratchDate";
import { BrandRibbon } from "@/components/BrandRibbon";
import {
  fetchPublicInvitation,
  sanitizeSlug,
  type InvitationContent,
  type PublicContact,
} from "@/lib/public-invitation";

const pageTitle = "Wedding Invitation — ZAR";
const pageDescription = "Open your private wedding invitation.";

export const Route = createFileRoute("/$slug")({
  head: () => ({
    meta: [
      { title: pageTitle },
      { name: "description", content: pageDescription },
      { property: "og:title", content: pageTitle },
      { property: "og:description", content: pageDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PublicInvitation,
});

function PublicInvitation() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const rawSlug = pathname.split("/").filter(Boolean).at(-1) ?? "";
  const slug = sanitizeSlug(rawSlug);
  const query = useQuery({
    queryKey: ["public-invitation", slug],
    queryFn: ({ signal }) => fetchPublicInvitation(slug ?? "", signal),
    enabled: Boolean(slug),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (!slug) return <InvitationState kind="not_found" />;
  if (query.isPending) return <InvitationState kind="loading" />;
  if (query.isError) return <InvitationState kind="error" onRetry={() => void query.refetch()} />;
  if (query.data.state === "not_found") return <InvitationState kind="not_found" />;
  if (query.data.state === "fallback")
    return (
      <InvitationState kind="fallback" {...(query.data.shop ? { shop: query.data.shop } : {})} />
    );
  return (
    <LiveInvitation
      key={slug}
      content={query.data.content ?? {}}
      brandName={query.data.shop?.name}
      publicUrl={query.data.invitation?.public_url}
    />
  );
}

function buildCalendarUrl(content: InvitationContent) {
  const day = content.wedding_date?.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (!day || !Number.isFinite(Date.parse(day))) return undefined;
  const title = [content.groom_name, content.bride_name].filter(Boolean).join(" & ") || "Wedding";
  const details = [content.wedding_date, content.start_time, content.end_time]
    .filter(Boolean)
    .join(" · ");
  const location = [content.venue_name, content.venue_address, content.city]
    .filter(Boolean)
    .join(", ");
  const clock = (value?: string) => value?.match(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/);
  const start = clock(content.start_time);
  const end = clock(content.end_time);
  const nextDay = new Date(`${day}T00:00:00Z`);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  const dateToken = day.replaceAll("-", "");
  const timeToken = (time: RegExpMatchArray) => `${time[1]}${time[2]}${time[3] ?? "00"}`;
  const defaultEnd = start
    ? new Date(`${day}T${start[1]}:${start[2]}:${start[3] ?? "00"}Z`)
    : undefined;
  if (defaultEnd) defaultEnd.setUTCHours(defaultEnd.getUTCHours() + 1);
  const endToken =
    end && start && timeToken(end) > timeToken(start)
      ? `${dateToken}T${timeToken(end)}`
      : defaultEnd?.toISOString().replace(/[-:]/g, "").slice(0, 15);
  const dates = start
    ? `${dateToken}T${timeToken(start)}/${endToken}`
    : `${dateToken}/${nextDay.toISOString().slice(0, 10).replaceAll("-", "")}`;
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: title, details, location, dates })}`;
}

function ContactSection({ contacts }: { contacts: PublicContact[] }) {
  if (!contacts.length) return null;
  return (
    <section className="paper-grain relative px-5 pb-20 sm:px-8">
      <div className="mx-auto max-w-4xl border-t border-gold/25 pt-14">
        <p className="text-center text-[0.55rem] tracking-royal text-gold uppercase">Contact</p>
        <div className="mt-8 grid gap-px bg-gold/25 sm:grid-cols-2">
          {contacts.map((contact) => {
            const phone = contact.phone;
            if (!phone) return null;
            const whatsapp = contact.whatsapp_url ?? `https://wa.me/${phone.replace(/\D/g, "")}`;
            return (
              <div
                key={`${contact.name ?? "contact"}-${phone}`}
                className="bg-emerald-deep px-6 py-7 text-center"
              >
                {contact.name && <p className="font-display text-xl text-ivory">{contact.name}</p>}
                <div className="mt-4 flex justify-center gap-6 text-[0.55rem] tracking-royal text-gold uppercase">
                  <a href={`tel:${phone}`} className="border-b border-gold/40 pb-1">
                    Call
                  </a>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="border-b border-gold/40 pb-1"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LiveInvitation({
  content,
  brandName,
  publicUrl,
}: {
  content: InvitationContent;
  brandName?: string | undefined;
  publicUrl?: string | undefined;
}) {
  const names = [content.groom_name, content.bride_name].filter((name): name is string =>
    Boolean(name),
  );
  const venue = [content.venue_name, content.city].filter(Boolean).join(", ");
  const calendarUrl = buildCalendarUrl(content);
  const contacts = content.contacts ?? [];
  const actions = [
    content.maps_url ? { label: "View Location", href: content.maps_url } : undefined,
    calendarUrl ? { label: "Add to Calendar", href: calendarUrl } : undefined,
  ].filter((action): action is { label: string; href: string } => Boolean(action));

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-emerald-deep">
      {publicUrl && <link rel="canonical" href={publicUrl} />}
      <ParticleField />
      <BrandRibbon name={brandName} />
      {content.music_enabled && content.music_url && <MusicControl url={content.music_url} />}
      <ArchwayHero
        venue={venue}
        {...(names[0] ? { name1: names[0] } : {})}
        {...(names[1] ? { name2: names[1] } : {})}
        {...(content.invocation ? { invocation: content.invocation } : {})}
      />
      {content.wedding_date && (
        <section className="paper-grain relative px-5 py-20 sm:px-8">
          <ScratchDate date={content.wedding_date} />
        </section>
      )}
      <CoupleProfiles content={content} />
      <DetailsSection content={content} />
      <Gallery items={content.gallery ?? []} />
      {actions.length > 0 && (
        <section className="paper-grain relative px-5 pb-20 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <ul
              className={`grid gap-px overflow-hidden border border-gold/25 bg-gold/25 ${actions.length > 1 ? "sm:grid-cols-2" : ""}`}
            >
              {actions.map((action) => (
                <li key={action.label} className="bg-emerald-deep">
                  <a
                    href={action.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center justify-between gap-3 px-6 py-7 transition-colors hover:bg-emerald-royal/60 sm:justify-center"
                  >
                    <span className="text-[0.55rem] tracking-royal text-ivory/80 uppercase transition-colors group-hover:text-gold">
                      {action.label}
                    </span>
                    <span className="h-px w-6 bg-gold/60 transition-all group-hover:w-10" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <ContactSection contacts={contacts} />
      {(names.length > 0 || content.wedding_date || venue) && (
        <footer className="paper-grain relative px-5 pb-20 text-center sm:px-8">
          <span className="mx-auto block h-px w-16 bg-gold/50" />
          {names.length > 0 && (
            <p className="mt-6 font-display text-2xl italic text-gold-foil">{names.join(" & ")}</p>
          )}
          {venue && (
            <p className="mt-4 text-[0.5rem] tracking-royal text-ivory/50 uppercase">{venue}</p>
          )}
        </footer>
      )}
    </main>
  );
}
