# Royal Arch Invites

Build a mobile-first, luxury interactive digital wedding invitation experience using React, TypeScript, Tailwind CSS, and HTML5 Canvas.

Do NOT build a generic modern landing page or card layout. The website must feel like a continuous scroll through an imperial Islamic courtyard with delicate Jali screens, archways, and illuminated manuscripts.

==================================================

VISUAL ART DIRECTION & PALETTE

==================================================

- Theme: Royal Indo-Islamic Arch & Arabesque Calligraphy Artwork

- Color Palette: Midnight Emerald (#0F2C23), Royal Indigo (#1A2332), Matte Metallic Gold (#D4AF37), Warm Ivory Parchment (#F9F8F3), Deep Rose Shimmer (#9E2A2B)

- Typography: High-contrast serif (Playfair Display) combined with ultra-spaced uppercase typography (tracking: 0.35em) and geometric line accents.

- Background: Fine paper grain with subtle geometric Arabesque / Girih tiling overlays and soft gold foil noise.

==================================================

CORE SCENES & INTERACTIVE MECHANICS

==================================================

1. THE MULTI-LAYERED ARCHWAY (JALI SCREEN PARALLAX REVEAL)

- Display a full-screen scene framed by a continuous Mughal arched doorway (Mehrab) with delicate geometric Jali lattice work.

- The center features the couple's names in grand editorial typography.

- As the user scrolls downward, three layers of Jali screens separate in dynamic parallax (foreground zooms fast, midground moves slow, background scales up), giving the physical feeling of walking into a palace courtyard (Baradari).

2. METALLIC GOLD DUST SCRATCH DATE REVEAL

- HTML5 Canvas overlay obscuring the wedding date ("18 DECEMBER 2026").

- The top layer must resemble frosted metallic gold ink with subtle sparkles.

- Implement high-DPI canvas handling (`devicePixelRatio`) with `touch-action: none` so mobile scratching doesn't lock vertical page scrolling.

- Rubbing the screen erases the gold ink using soft brush strokes (`destination-out`) to unveil the date rendered in elegant calligraphy.

- Auto-complete reveal after 40% cleared.

3. Luminous DUST & EMERALD GLINT PARTICLE ENGINE

- Fixed full-screen Canvas producing small, glowing champagne particles and emerald dust trails upon touch or swipe (`pointermove`).

- Capped particle count (<30) for smooth 60 FPS mobile interaction.

4. NIKAH & CELEBRATION DETAILS

- Asymmetric layout featuring thin gold rules, subtle crescent/botanical linework, and clear venue details (Taj Falaknuma Palace, Hyderabad).

- Incorporate elegant Arabic motif borders around timing, dress code, and venue details.

5. REFINED ACTIONS & RSVP

- Understated text-based interactive links:

  - "VIEW LOCATION"

  - "ADD TO CALENDAR"

  - "CONFIRM RSVP"

==================================================

ENVIRONMENT VARIABLES

==================================================

Use Vite environment variables:

- import.meta.env.VITE_COUPLE_NAME_1

- import.meta.env.VITE_COUPLE_NAME_2

- import.meta.env.VITE_WEDDING_DATE

- import.meta.env.VITE_VENUE_NAME
make sure it is fully responsive

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a20e51b1-bfe4-4684-bf53-8d2d78745ead).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
