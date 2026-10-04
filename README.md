# Royal Arch Invitations

A frontend-only ZAR public invitation design preserving the emerald and gold archway, Jali parallax, particle artwork, and scratch-date reveal.

## Configuration

Copy .env.example to .env locally. Configure only VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY with the central ZAR project values in hosting settings. Never commit actual values.

Every /:slug route calls only get_public_invitation_content. The RPC controls live, fallback, and not_found; missing configuration or network failures show a retry screen. No sample invitation or QR is substituted. The live ribbon uses only the RPC public shop.name when supplied; no shop contacts are retained in live state.

## Development and deployment

Run bun install --frozen-lockfile (or npm ci), then npm run dev. Verify with npm run build and bunx tsc --noEmit. The Nitro Vercel preset builds framework routes for direct visits and refreshes; an SPA rewrite is unnecessary for this SSR deployment.

Your public favicon files are used unchanged. Open Graph and Twitter use the supplied public/og-image.png at https://royal-arch.vercel.app/og-image.png, available in the initial HTML to sharing crawlers. If the deployment domain changes, update those asset URLs in src/routes/__root.tsx. Invitation canonical URLs come exclusively from the RPC public_url. WhatsApp and other apps may cache previews until they refresh them.

See PUBLIC_INVITATION_INTEGRATION.md for the full public contract. Keep published Git history intact for Lovable synchronization.
