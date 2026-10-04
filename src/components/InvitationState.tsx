import type { ShopFallback } from "@/lib/public-invitation";
import { BrandRibbon } from "./BrandRibbon";

export function InvitationState({
  kind,
  shop,
  onRetry,
}: {
  kind: "loading" | "error" | "fallback" | "not_found";
  shop?: ShopFallback;
  onRetry?: () => void;
}) {
  const copy = {
    loading: ["Please wait", "Opening your invitation"],
    error: ["A moment, please", "We couldn't open this invitation"],
    fallback: ["With our apologies", "This invitation is no longer available"],
    not_found: ["Invitation not found", "This invitation could not be found"],
  }[kind];
  const address = [shop?.address, shop?.city].filter(Boolean).join(", ");
  const contact = shop?.phone ?? shop?.business_contact;

  return (
    <main className="paper-grain relative flex min-h-screen items-center justify-center overflow-hidden bg-emerald-deep px-6 py-16 text-center">
      {kind === "fallback" && <BrandRibbon name={shop?.name} />}
      <div className="girih absolute inset-0 opacity-[0.08]" />
      <div className="relative w-full max-w-lg border-y border-gold/30 py-14">
        <p className="text-[0.55rem] tracking-royal text-gold uppercase">{copy[0]}</p>
        <h1 className="mt-6 font-display text-3xl leading-tight text-ivory sm:text-5xl">
          {copy[1]}
        </h1>
        {kind === "loading" && (
          <span className="mx-auto mt-8 block h-px w-24 animate-pulse bg-gold" />
        )}
        {kind === "error" && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-8 border-b border-gold/60 pb-1 text-[0.6rem] tracking-royal text-gold uppercase"
          >
            Try again
          </button>
        )}
        {kind === "fallback" && shop && (
          <div className="mt-8 space-y-3 text-ivory/70">
            {shop.name && <p className="font-display text-xl text-gold-soft">{shop.name}</p>}
            {address && <p>{address}</p>}
            {contact && (
              <a className="inline-block border-b border-gold/40" href={`tel:${contact}`}>
                {contact}
              </a>
            )}
            {shop.whatsapp && /^https?:\/\//i.test(shop.whatsapp) && (
              <p>
                <a
                  className="inline-block border-b border-gold/40"
                  href={shop.whatsapp}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  WhatsApp
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
