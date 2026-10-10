-- Concierge sign-ups: everyone who passes the name/email gate on a property's
-- concierge site, whether or not they arrived with a booking link.
-- Applied to production 2026-10-10 as migration "concierge_signups" (see
-- SOS-Database/DEPLOYED.md for the deploy rules).

create table public.concierge_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  -- Which concierge deployment they used. site_host is the stable key
  -- (e.g. rathescarguest.sosstays.com); property_name comes from Sanity.
  site_host text not null,
  property_name text,
  property_id uuid references public.properties(id) on delete set null,
  -- Set only when the guest arrived with ?bookingid=... that matched a booking.
  booking_id uuid references public.bookings(id) on delete set null,
  marketing_consent boolean not null default false,
  visit_count integer not null default 1,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  constraint concierge_signups_email_site_key unique (email, site_host)
);

create index concierge_signups_property_idx on public.concierge_signups (property_id);
create index concierge_signups_last_seen_idx on public.concierge_signups (last_seen_at desc);

-- Same posture as the other admin tables: RLS on, no policies. Only the
-- service role (edge function + admin dashboard) can read or write.
alter table public.concierge_signups enable row level security;
