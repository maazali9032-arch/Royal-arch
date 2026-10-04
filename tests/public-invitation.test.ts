import { describe, expect, test } from "bun:test";
import { parseInvitationResponse, sanitizeSlug } from "../src/lib/public-invitation";

describe("public invitation trust boundary", () => {
  test("rejects malformed and decoded path separators", () => {
    for (const slug of ["", "%", "a%2Fb", "a%5Cb"]) expect(sanitizeSlug(slug)).toBeUndefined();
    expect(sanitizeSlug("arian-elara-08")).toBe("arian-elara-08");
  });
  test("fallback and not_found discard all wedding data", () => {
    const content = { groom_name: "Must not render", gallery: ["https://example.com/photo.png"] };
    expect(
      parseInvitationResponse({
        data: { state: "fallback", content, shop: { name: "Public brand" } },
      }),
    ).toEqual({ state: "fallback", shop: { name: "Public brand" } });
    expect(parseInvitationResponse({ state: "not_found", content })).toEqual({
      state: "not_found",
    });
  });
  test("normalizes malformed optional fields and unsafe links", () => {
    const result = parseInvitationResponse({
      state: "live",
      content: {
        events: [null, "invalid", { name: "Ceremony", maps_url: "javascript:alert(1)" }],
        gallery: [null, {}, "javascript:alert(1)", { src: "https://example.com/photo.png" }],
        contacts: [
          { phone: "+91 123", whatsapp_url: "javascript:alert(1)" },
          { name: "No phone" },
          { phone: "third" },
        ],
        music_enabled: "true",
      },
      shop: { name: "Approved public brand", phone: "Never retain" },
    });
    expect(result.content?.events).toEqual([{ name: "Ceremony" }]);
    expect(result.content?.gallery).toEqual([{ url: "https://example.com/photo.png" }]);
    expect(result.content?.contacts).toEqual([{ phone: "+91 123" }]);
    expect(result.content?.music_enabled).toBeUndefined();
    expect(result.shop).toEqual({ name: "Approved public brand" });
  });
  test("rejects unknown states and never invents canonical URLs", () => {
    expect(() => parseInvitationResponse({ state: "draft" })).toThrow();
    expect(parseInvitationResponse({ state: "live", content: {} }).invitation).toBeUndefined();
  });
});
