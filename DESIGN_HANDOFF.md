# Admin dashboard redesign — handoff for Claude Code

Design reference (visual mockups of all 8 screens): https://claude.ai/code/artifact/8aad6a1e-6702-4630-b2bb-ffcc0403c179

This redesign replaces the current default-shadcn neutral/gray look with the real SOS Stays brand (pulled from `SOS-Website-main/src/app/globals.css` — forest green, sage, cream, maroon). Scope is visual only: no changes to data, routes, Supabase queries, or the `lib/tables/config.ts` field definitions. This is a restyle of the existing pages in this repo (`src/app/(dashboard)/*`, `src/app/login/*`, `src/components/*`), not a rebuild.

## 1. Bring in the brand tokens

Add these to `src/app/globals.css` (alongside the existing shadcn tokens, don't remove those — just add ours and start using them):

```css
:root {
  --forest: #4A5D48;
  --forest-deep: #3F5240;
  --sage: #ACC196;
  --sage-pale: #E3ECD8;
  --sage-300: #C6D7B3;
  --cream: #FEFEE3;
  --warm-cream: #F7EFE9;
  --maroon: #472D30;
  --maroon-muted: #8A5F52;
  --grey: #A6B0A6;
  --border-soft: #DDE3D3;
  --ink: #171917;
  --ink-soft: #5B635B;
  --error: #C0392B;
  --error-bg: #FBEAE8;
}
```

Add Google Fonts Playfair Display (headings) + Inter (body/UI) — Inter is likely already in use; add Playfair Display alongside it, e.g. via `next/font/google` in `src/app/layout.tsx`:

```ts
import { Inter, Playfair_Display } from "next/font/google"
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-heading" })
```

Apply `--font-heading` (Playfair) to page titles / section headings (`h1`, `h2`, `.section-title`), and keep body text on `--font-sans` (Inter).

## 2. Sidebar layout (replaces the current top nav in `nav.tsx`)

Switch from the current horizontal top bar to a **left sidebar**, 240px wide, `background: var(--forest)`, text `var(--cream)`:

- Top: the SOS Stays logo mark (reuse the inline SVG from `SOS-Website-main/src/components/Logo.tsx`, `fill="currentColor"`, sized ~26×17) + wordmark "SOS Stays" (Playfair, 16px, bold) with "Admin" as a small uppercase label underneath (10.5px, letter-spacing, 65% opacity).
- Nav links: Dashboard, Properties, Guests, Bookings — each a row with a 18px stroke icon (home / building / users / calendar — see icon set below) + label, `padding: 10px 14px`, `border-radius: 8px`. Inactive: `color: var(--cream)`, `opacity: .82`. Active (current route): `background: var(--sage-300)`, `color: var(--forest-deep)`, `font-weight: 600`. Hover on inactive links: `background: rgba(254,254,227,0.08)`.
- Bottom (pushed down with `margin-top: auto`, separated by a `1px solid rgba(254,254,227,0.15)` top border): the existing log-out form/button, styled as an outline button — `border: 1px solid rgba(254,254,227,.3)`, `color: var(--cream)`, transparent background.

Update `src/app/(dashboard)/layout.tsx` to render this sidebar alongside a `<main>` content area (`flex`, sidebar `240px` fixed, main `flex: 1`, `padding: 44px 52px`, `background: var(--bg)` i.e. the existing near-white background — keep that as the content-area background, the sidebar is the only forest-green surface).

## 3. Icon set

Use inline stroke SVGs (24px viewBox, `stroke-width="1.9"`, round caps/joins, no fill) — install `lucide-react` if not already present and use its equivalents, or copy the paths from the design mockups: home (Dashboard), building (Properties), users (Guests), calendar (Bookings), log-out, search, chevron-right, arrow-left, mail, phone, check-circle (verified), lock/key (lock code, check-in token).

## 4. Page-by-page changes

**Login** (`src/app/login/login-form.tsx` + `src/app/login/page.tsx`): split-screen layout — left panel `background: var(--forest)` with the logo, "SOS Stays Admin" headline (Playfair, 32px) and a one-line description, centered; right panel white/`--bg`, the existing password form restyled: labeled input with a lock icon, error state as a `--error-bg`/`--error` inline banner (not just red text), primary button `background: var(--forest)`, `color: var(--cream)`.

**Dashboard home** (`src/app/(dashboard)/page.tsx`): keep the 3 stat cards + recent bookings list structure, restyle: stat cards `background: white`, `border: 1px solid var(--border-soft)`, `border-radius: 14px`, an icon chip (`background: var(--sage-pale)`, `color: var(--forest-deep)`) top-left, the count in Playfair 38px, a "View all →" affordance top-right. Recent bookings as a card with a `--warm-cream` header row and hover-highlighted (`--sage-pale`) rows linking to booking detail. Status badges: confirmed = `--sage-pale` bg / `--forest-deep` text; pending = `--warm-cream` bg / `--maroon-muted` text; cancelled = `--error-bg` bg / `--error` text — apply this badge scheme everywhere status shows up (`DataTable`, `RelatedList`, detail pages).

**Properties list** (`src/app/(dashboard)/properties/page.tsx`): since there are only a handful of properties, replace the generic `DataTable` here with a **card grid** (3 columns) — each card: icon chip, property name (Playfair 19px) + nickname, then a small key/value list (Uplisting ID, check-in subdomain, booking count) below a divider. This is a deliberate exception to the generic `DataTable` component for this one table — keep `DataTable` as-is for bookings and guests.

**Guests list / Bookings list** (`.../guests/page.tsx`, `.../bookings/page.tsx`, and `DataTable` itself): restyle the existing generic table — header row `background: var(--warm-cream)`, uppercase 12px labels, `color: var(--ink-soft)`; body rows `border-top: 1px solid var(--border-soft)`, hover `background: var(--sage-pale)`. Add a small circular initials avatar (Playfair, forest-deep on sage-pale) in front of the guest name column. Add a search input (icon + placeholder, no working filter logic required unless you want to wire it up) and, for bookings, status filter pills above the table.

**Detail pages** (`RecordForm` + each `[id]/page.tsx`): restructure into stacked white cards (`border: 1px solid var(--border-soft)`, `border-radius: 14px`, `padding: 26px 28px`), one per logical group instead of one flat grid:
- Bookings: "Stay details" (dates, arrival time, room, channel, status, revenue, reservation ID) → "Guest & contact" (guest_name_raw, ota_email, ota_phone) → "Access" (lock_code with a key icon, checkin_token in a muted/read-only style) → "System" (confirmation/reminder sent, created_at, all read-only/muted).
- Properties & Guests: one "details" card with the editable fields, then a **related bookings card** below it — this is the "see everything in one place" requirement from the plan: reuse `RelatedList` but restyle it to match the new table look, and it must always be present and populated with every booking linked to that guest/property (already wired via `relatedLists` in `config.ts` — just restyle, no logic change).
- Read-only fields get a slightly muted style: `background: var(--warm-cream)` instead of white, to visually distinguish them from editable inputs.
- Above the form: a linked-record header ("Property" / "Guest" mini-cards with an icon and a link to the other record) for bookings, and a back-link ("← Back to bookings/properties/guests") plus a page title in Playfair.
- Primary "Save changes" button stays `background: var(--forest)`, `color: var(--cream)`.

## 5. What NOT to change

Don't touch: Supabase queries (`lib/tables/queries.ts`), the auth/session logic, `lib/tables/config.ts` field/column definitions, or routing. This is purely `className`/inline-style/markup-structure changes plus the new sidebar layout and the Properties-page card-grid exception called out above.
