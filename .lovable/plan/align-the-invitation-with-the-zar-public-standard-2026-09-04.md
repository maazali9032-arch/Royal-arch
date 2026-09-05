# Align the invitation with the ZAR public standard

## What will change
- Replace the sample environment-driven invitation with a single dynamic `/:slug` invitation route.
- Safely decode and validate the final URL segment; invalid or missing slugs will show “Invitation not found” without substitute content.
- Fetch once from only `get_public_invitation_content` using the two approved public environment variables and normalize either direct or `{ data: ... }` responses.
- Add distinct loading, retryable error, fallback, and not-found screens in the existing royal visual style.
- Keep the current invitation look and interactions while mapping all visible live content from the RPC response and hiding missing optional sections.
- Map events, venue links, up to two valid contacts, and calendar details without hardcoded wedding or contact fallbacks.
- Remove the old couple/date/venue environment variables and sample invitation values; add an `.env.example` containing exactly the two empty approved placeholders and ensure `.env` is ignored.
- Add direct-refresh hosting support for `/:slug`.

## Technical details
- Use a browser-safe fetch client for the PostgREST RPC endpoint, sending `{ p_slug: slug }` with the publishable key headers.
- Validate response shapes defensively before rendering and never query tables or infer lifecycle state.
- Keep `/` as an invitation-not-found entry point and place the real invitation at `/$slug`.
- External links will use `noopener noreferrer`; call links will remain normal `tel:` links.
- The name composition will keep each name and the ampersand on separate centered lines, hiding the ampersand when only one name exists.

## Verification
- Check the build and browser console.
- Exercise malformed, loading/error, not-found/fallback, and live payload paths with mocked RPC responses.
- Verify desktop and narrow mobile layouts preserve the current design and contain no empty sections.
