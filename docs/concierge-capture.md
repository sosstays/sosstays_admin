# Concierge sign-up capture

The Concierge tab reads `concierge_signups`. Today the concierge gate
(`SOS-Concierge/script.js`) only writes to Supabase when the URL carries a
`?bookingid=`; guests who log in from the homepage go to Netlify Forms (and
MailerLite if opted in) only. Three pieces make them visible:

1. DONE (2026-10-10): `supabase/concierge_signups.sql` applied (table + RLS, no policies).
2. DONE (2026-10-10): `concierge-signup` edge function deployed, v1, `verify_jwt = false`.
3. TODO: patch the concierge site to call it on every gate submit.

Per `SOS-Database/DEPLOYED.md`: snapshot the live schema first, apply one change at a time, log it in `DEPLOY_LOG.md`.

## Edge function `concierge-signup`

```ts
import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);

  const { name, email, siteHost, propertyName, bookingId, marketingConsent } =
    await req.json().catch(() => ({}));
  if (!email || !siteHost) return json({ skipped: true });

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  });
  const cleanEmail = String(email).trim().toLowerCase();

  // Booking + property, when the guest arrived with a booking link.
  let booking_id: string | null = null;
  let property_id: string | null = null;
  if (bookingId) {
    const { data } = await db.from('bookings').select('id, property_id').eq('checkin_token', bookingId).maybeSingle();
    booking_id = data?.id ?? null;
    property_id = data?.property_id ?? null;
  }
  // No booking: several rooms can share one subdomain, so only link a property when it's unambiguous.
  if (!property_id) {
    const subdomain = String(siteHost).split('.')[0];
    const { data } = await db.from('properties').select('id').eq('checkin_subdomain', subdomain).limit(2);
    if (data?.length === 1) property_id = data[0].id;
  }

  const { data: existing } = await db
    .from('concierge_signups').select('id, visit_count, booking_id, marketing_consent')
    .eq('email', cleanEmail).eq('site_host', siteHost).maybeSingle();

  const { error } = existing
    ? await db.from('concierge_signups').update({
        name: name || undefined,
        property_name: propertyName || undefined,
        property_id: property_id ?? undefined,
        booking_id: booking_id ?? existing.booking_id,
        marketing_consent: existing.marketing_consent || !!marketingConsent,
        visit_count: existing.visit_count + 1,
        last_seen_at: new Date().toISOString(),
      }).eq('id', existing.id)
    : await db.from('concierge_signups').insert({
        email: cleanEmail, name: name || null, site_host: siteHost,
        property_name: propertyName || null, property_id, booking_id,
        marketing_consent: !!marketingConsent,
      });

  if (error) { console.error('concierge signup failed', error); return json({ error: 'Write failed' }, 502); }
  return json({ success: true });
});
```

## Concierge site patch (`script.js`)

Add next to `linkBookingInSupabase` and call it from the gate submit handler
and from the "saved guest" init path (so returning guests bump `visit_count`):

```js
const CONCIERGE_SIGNUP_URL = 'https://xqqkofbpqntdtfrvxdzo.supabase.co/functions/v1/concierge-signup';

function recordConciergeSignup(name, email, marketingConsent, bookingId) {
  fetch(CONCIERGE_SIGNUP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name, email, marketingConsent, bookingId,
      siteHost: window.location.hostname,
      propertyName: property && property.name,
    }),
  }).catch(() => {
    // Don't block the guest experience if the Supabase write fails.
  });
}
```

`property` is only populated after `dataReadyPromise` resolves, so call it
from `enterApp()` (after `await dataReadyPromise`) rather than before.
