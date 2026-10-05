# SOS Stays Admin Dashboard — Plan

## Purpose
Internal-only dashboard to view and edit everything in the SOS Stays Supabase project (properties, guests, bookings) from one place. No public-facing use.

## Current Supabase schema (project: SOS Stays Database, id xqqkofbpqntdtfrvxdzo)

**properties** (3 rows)
- id (uuid, PK), uplisting_listing_id (text, unique), name, nickname, access_instructions, checkin_subdomain

**guests** (8 rows)
- id (uuid, PK), email (unique), phone, first_name, last_name, email_verified (bool), mailerlite_synced_at, created_at

**bookings** (1 row)
- id (uuid, PK), uplisting_reservation_id (text, unique), property_id (FK -> properties), guest_id (FK -> guests), checkin_token (uuid), channel, guest_name_raw, ota_email, ota_phone, ota_phone_reliable, check_in, check_out, revenue, status, created_at, confirmation_sent_at, reminder_sent_at, room_number, lock_code, arrival_time

Data is synced from Uplisting; guests also sync to MailerLite. Schema is expected to keep evolving (more tables likely: payments, cleaning, messaging, etc.).

## Decisions locked in
- **Stack**: Next.js (App Router) + Supabase JS client, service role key used server-side.
- **UI**: Tailwind CSS + shadcn/ui components (tables, forms, dialogs, buttons, etc. built from shadcn primitives).
- **Auth**: single shared password (env var), gate via middleware + signed session cookie. No per-user accounts, no Supabase Auth users table.
- **Scope for v1**: strictly the 3 existing tables (properties, guests, bookings). No placeholder nav for future tables yet.
- **Functionality for v1**: read/browse + edit records. No special action buttons (resend confirmation email, regenerate checkin_token/lock_code, etc.) — plain field editing only, deferred for later.
- **Relations in forms (editing)**: booking edit form shows linked property/guest as read-only text, no dropdown pickers to reassign (rare enough to handle via SQL directly if ever needed).
- **Relations in detail views (viewing)**: a guest's detail page shows ALL of that guest's own fields (name, email, phone, email_verified, mailerlite_synced_at, created_at) plus a list of every booking linked to them (property, check-in/out, status, revenue, channel, room number, lock code, arrival time, etc.) — not just the guest row in isolation. Same idea applies to a property's detail page: show the property's fields plus a list of all bookings at that property. This is the core "see everything in one place" requirement, not just a nice-to-have.
- **Sensitive fields** (lock_code, checkin_token): shown and editable plainly, no masking — internal trusted-only tool.
- **Extensibility approach**: build one generic "table view + edit form" component driven by a per-table config (columns, types, labels) rather than three bespoke one-off pages, so adding a new table/column later is mostly config, not a rewrite. Generate/refresh TypeScript types from Supabase (typegen) rather than hand-maintaining interfaces. Related-records lists (bookings under a guest/property) should also be config-driven (declare "bookings.guest_id -> this guest" once) so a future table (e.g. payments under a booking) slots in the same way.
- **Stats/summaries**: explicitly deferred to a later version — v1 is pure visibility + editing.

## Proposed page structure
- `/login` — shared password gate
- `/` — dashboard home: simple counts per table, maybe most-recent bookings list
- `/bookings` — table list (join to property name + guest name), filter/sort by status/property/date; row -> `/bookings/[id]` edit form (linked property/guest shown read-only, no reassignment picker)
- `/properties` — list; row -> `/properties/[id]` detail/edit page: property fields (editable) + full list of bookings at that property (read-only list, click through to `/bookings/[id]` for full booking detail/edit)
- `/guests` — list; row -> `/guests/[id]` detail/edit page: guest fields (editable) + full list of that guest's bookings (read-only list, click through to `/bookings/[id]` for full booking detail/edit)

## Local project context (D:\SOS Stays)
This folder already contains several related projects: `SOS-Database` (git repo with Supabase config/migrations), `SOS-Concierge`, and multiple `SOS-Website*` folders (main site + feature branches checked out as separate folders). The admin dashboard will be a new, separate project folder here (not yet created/named) — likely something like `SOS-Admin-Dashboard` — kept independent from the website and concierge projects, but part of the same working directory so it's easy to find alongside them.

## Open items to confirm before/at build time
- Exact name/location for the new dashboard project folder inside `D:\SOS Stays` (e.g. `SOS-Admin-Dashboard`).
- Deployment target (Vercel/Netlify/other) not yet chosen.
- Exact shared-password storage/rotation approach (single env var is the plan, no rotation UI planned for v1).

## Status
v1 built as of 2026-09-08 in this same folder (`SOS - Admin Dashboard`). Next.js + Tailwind + shadcn/ui scaffolded, shared-password auth (iron-session cookie + middleware) working, Supabase service-role client wired up with generated types. Generic config-driven table/edit-form/related-list components built (`src/lib/tables/config.ts` is the single place to add a column or table later). All three tables (properties, guests, bookings) have list + detail/edit pages; guest and property detail pages show their full related bookings list per the "see everything in one place" requirement. Verified end-to-end in a browser against the live Supabase project (login, list, edit-and-save, related bookings, read-only property/guest links on a booking). `.env.local` holds real credentials locally (gitignored); `.env.local.example` documents the required vars for anyone else setting up the project. Deployment target still not chosen (open item, unchanged).

Update 2026-10-05: the dashboard now covers 8 tables, not 3 — added `landlord_leads`, `contact_queries` (earlier), plus `partner_leads`, `corporate_leads` and `newsletter_subscribers` (migrations 0010-0011 in SOS-Database). Website form submissions are written to these tables live (Supabase first, then MailerLite). A `/contacts` page reads the `contacts` view (one row per email across guests, landlords, partners, corporate enquiries, contact messages and newsletter) and `/contacts/[slug]` shows everything we hold on one person. Adding a table is still just a `config.ts` entry + route folder.
