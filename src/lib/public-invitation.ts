export type PublicEvent = {
  id?: string | undefined;
  name?: string | undefined;
  title?: string | undefined;
  event_name?: string | undefined;
  date?: string | undefined;
  event_date?: string | undefined;
  time?: string | undefined;
  start_time?: string | undefined;
  venue?: string | undefined;
  venue_name?: string | undefined;
  city?: string | undefined;
  maps_url?: string | undefined;
  mapsUrl?: string | undefined;
  note?: string | undefined;
  description?: string | undefined;
};

export type PublicContact = {
  name?: string | undefined;
  phone?: string | undefined;
  whatsapp_url?: string | undefined;
};

export type PublicGalleryItem = {
  url: string;
  alt?: string | undefined;
  caption?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
  span?: "tall" | "wide" | undefined;
};

export type InvitationContent = {
  groom_name?: string | undefined;
  bride_name?: string | undefined;
  groom_photo_url?: string | undefined;
  bride_photo_url?: string | undefined;
  groom_qualification?: string | undefined;
  bride_qualification?: string | undefined;
  groom_occupation?: string | undefined;
  bride_occupation?: string | undefined;
  groom_parents?: string | undefined;
  bride_parents?: string | undefined;
  relatives?: string | undefined;
  invocation?: string | undefined;
  wedding_date?: string | undefined;
  start_time?: string | undefined;
  end_time?: string | undefined;
  events?: PublicEvent[] | undefined;
  venue_name?: string | undefined;
  venue_address?: string | undefined;
  city?: string | undefined;
  maps_url?: string | undefined;
  venue_image_url?: string | undefined;
  gallery?: PublicGalleryItem[] | undefined;
  music_enabled?: boolean | undefined;
  music_url?: string | undefined;
  qr_text?: string | undefined;
  contacts?: PublicContact[] | undefined;
};

export type ShopFallback = {
  name?: string | undefined;
  phone?: string | undefined;
  whatsapp?: string | undefined;
  address?: string | undefined;
  city?: string | undefined;
  business_contact?: string | undefined;
};

export type PublicInvitationResponse = {
  state: "live" | "fallback" | "not_found";
  invitation?: { public_url?: string | undefined } | undefined;
  content?: InvitationContent | undefined;
  detail?: Record<string, unknown> | undefined;
  shop?: ShopFallback | undefined;
};

const text = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const record = (value: unknown): Record<string, unknown> | undefined =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;

function httpUrl(value: unknown): string | undefined {
  const candidate = text(value);
  if (!candidate) return undefined;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? candidate : undefined;
  } catch {
    return undefined;
  }
}

function compact<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}

export function sanitizeSlug(rawSlug: string): string | undefined {
  try {
    const slug = decodeURIComponent(rawSlug).trim();
    return slug && !/[\\/]/.test(slug) ? slug : undefined;
  } catch {
    return undefined;
  }
}

function parseContent(value: unknown): InvitationContent | undefined {
  const input = record(value);
  if (!input) return undefined;

  const eventInput = input["events"];
  const events = Array.isArray(eventInput)
    ? eventInput.flatMap((item) => {
        const event = record(item);
        if (!event) return [];
        return [
          compact({
            id: text(event["id"]),
            name: text(event["name"]),
            title: text(event["title"]),
            event_name: text(event["event_name"]),
            date: text(event["date"]),
            event_date: text(event["event_date"]),
            time: text(event["time"]),
            start_time: text(event["start_time"]),
            venue: text(event["venue"]),
            venue_name: text(event["venue_name"]),
            city: text(event["city"]),
            maps_url: httpUrl(event["maps_url"]),
            mapsUrl: httpUrl(event["mapsUrl"]),
            note: text(event["note"]),
            description: text(event["description"]),
          }),
        ];
      })
    : undefined;

  const contactInput = input["contacts"];
  const contacts = Array.isArray(contactInput)
    ? contactInput.slice(0, 2).flatMap((item) => {
        const contact = record(item);
        const phone = contact ? text(contact["phone"]) : undefined;
        if (!contact || !phone) return [];
        return [
          compact({
            name: text(contact["name"]),
            phone,
            whatsapp_url: httpUrl(contact["whatsapp_url"]),
          }),
        ];
      })
    : undefined;

  const galleryInput = input["gallery"];
  const gallery = Array.isArray(galleryInput)
    ? galleryInput.flatMap((item) => {
        if (typeof item === "string") {
          const url = httpUrl(item);
          return url ? [{ url }] : [];
        }
        const image = record(item);
        if (!image) return [];
        const url = httpUrl(image["url"]) ?? httpUrl(image["src"]) ?? httpUrl(image["image_url"]);
        if (!url) return [];
        const width =
          typeof image["width"] === "number" && image["width"] > 0 ? image["width"] : undefined;
        const height =
          typeof image["height"] === "number" && image["height"] > 0 ? image["height"] : undefined;
        const span =
          image["span"] === "tall" || image["span"] === "wide" ? image["span"] : undefined;
        return [
          compact({
            url,
            alt: text(image["alt"]),
            caption: text(image["caption"]),
            width,
            height,
            span,
          }),
        ];
      })
    : undefined;

  return compact({
    groom_name: text(input["groom_name"]),
    bride_name: text(input["bride_name"]),
    groom_photo_url: httpUrl(input["groom_photo_url"]),
    bride_photo_url: httpUrl(input["bride_photo_url"]),
    groom_qualification: text(input["groom_qualification"]),
    bride_qualification: text(input["bride_qualification"]),
    groom_occupation: text(input["groom_occupation"]),
    bride_occupation: text(input["bride_occupation"]),
    groom_parents: text(input["groom_parents"]),
    bride_parents: text(input["bride_parents"]),
    relatives: text(input["relatives"]),
    invocation: text(input["invocation"]),
    wedding_date: text(input["wedding_date"]),
    start_time: text(input["start_time"]),
    end_time: text(input["end_time"]),
    events,
    venue_name: text(input["venue_name"]),
    venue_address: text(input["venue_address"]),
    city: text(input["city"]),
    maps_url: httpUrl(input["maps_url"]),
    venue_image_url: httpUrl(input["venue_image_url"]),
    gallery,
    music_enabled: input["music_enabled"] === true ? true : undefined,
    music_url: httpUrl(input["music_url"]),
    qr_text: text(input["qr_text"]),
    contacts,
  }) as InvitationContent;
}

export function parseInvitationResponse(value: unknown): PublicInvitationResponse {
  const outer = record(value);
  const input = record(outer?.["data"]) ?? outer;
  const state = input?.["state"];
  if (state === "not_found") return { state };

  if (state === "fallback") {
    const shop = record(input?.["shop"]);
    return compact({
      state,
      shop: shop
        ? compact({
            name: text(shop["name"]),
            phone: text(shop["phone"]),
            whatsapp: text(shop["whatsapp"]),
            address: text(shop["address"]),
            city: text(shop["city"]),
            business_contact: text(shop["business_contact"]),
          })
        : undefined,
    }) as PublicInvitationResponse;
  }

  if (state === "live") {
    const invitation = record(input?.["invitation"]);
    return compact({
      state,
      invitation: invitation
        ? compact({ public_url: httpUrl(invitation["public_url"]) })
        : undefined,
      content: parseContent(input?.["content"]),
      detail: record(input?.["detail"]),
      // Only the approved public name is retained in live state, never shop contacts.
      shop: record(input?.["shop"])
        ? compact({ name: text(record(input?.["shop"])?.["name"]) })
        : undefined,
    }) as PublicInvitationResponse;
  }

  throw new Error("Unexpected invitation response");
}

export async function fetchPublicInvitation(slug: string, signal?: AbortSignal) {
  const env = import.meta.env as Record<string, string | undefined>;
  const baseUrl = env["VITE_SUPABASE_URL"]?.replace(/\/$/, "");
  const key = env["VITE_SUPABASE_ANON_KEY"];
  if (!baseUrl || !key) throw new Error("Invitation service is not configured");

  const init: RequestInit = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_slug: slug }),
    ...(signal ? { signal } : {}),
  };
  const response = await fetch(`${baseUrl}/rest/v1/rpc/get_public_invitation_content`, init);

  if (!response.ok) throw new Error("Invitation request failed");
  return parseInvitationResponse(await response.json());
}
