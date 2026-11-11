import "server-only"
import { supabaseAdmin } from "@/lib/supabase/server"
import { tableConfigs, type TableKey } from "@/lib/tables/config"
import type { Row } from "@/lib/tables/queries"

export interface Contact {
  email: string
  name: string | null
  phone: string | null
  roles: string[]
  touchpoints: number
  first_seen: string | null
  last_seen: string | null
  /** Guests only: true if any guest row for this email has logged in to the concierge; null with no guest row. */
  email_verified: boolean | null
  /** True when the email is the person's own address, not an OTA relay or test domain. */
  email_reliable: boolean
}

/**
 * Same rule as guests.email_reliable (migration 0019) and the uplisting-webhook:
 * OTA relay addresses (e.g. xyz@guest.booking.com) and test domains aren't reliable.
 */
export function isReliableEmail(email: string | null): boolean {
  const e = (email ?? "").trim().toLowerCase()
  if (!e.includes("@")) return false
  const domain = e.split("@").pop()!
  if (/(^|\.)(booking|airbnb|vrbo|homeaway|expedia)\.com$/.test(domain)) return false
  if (/(^|\.)example\.(com|org|net)$/.test(domain)) return false
  return true
}

/**
 * The `contacts` view (migration 0011): one row per email across guests,
 * landlord leads, partner leads, corporate leads, contact queries and
 * newsletter subscribers.
 */
export async function listContacts(): Promise<Contact[]> {
  const { data, error } = await supabaseAdmin
    .from("contacts")
    .select("*")
    .order("last_seen", { ascending: false, nullsFirst: false })

  if (error) throw new Error(`Failed to list contacts: ${error.message}`)

  // email_verified (logged in to the concierge) lives on guests; the view doesn't carry it.
  const { data: guests, error: guestError } = await supabaseAdmin
    .from("guests")
    .select("email, email_verified")
  if (guestError) throw new Error(`Failed to load guest email status: ${guestError.message}`)

  const verified = new Map<string, boolean>()
  for (const g of guests ?? []) {
    if (!g.email) continue
    const key = g.email.toLowerCase()
    verified.set(key, (verified.get(key) ?? false) || g.email_verified === true)
  }

  return (data ?? []).map((row) => ({
    ...toContact(row),
    email_verified: verified.get((row.email ?? "").toLowerCase()) ?? null,
    email_reliable: isReliableEmail(row.email),
  }))
}

export async function getContact(email: string): Promise<Contact | null> {
  const { data, error } = await supabaseAdmin
    .from("contacts")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle()

  if (error) throw new Error(`Failed to load contact: ${error.message}`)
  return data
    ? { ...toContact(data), email_verified: null, email_reliable: isReliableEmail(data.email) }
    : null
}

/** Every row in `tableKey` for this email (case-insensitive — older rows may not be lowercased). */
export async function listByEmail(tableKey: TableKey, email: string): Promise<Row[]> {
  const config = tableConfigs[tableKey]
  // ilike treats % and _ as wildcards and \ as the escape — emails can contain _.
  const exact = email.replace(/[\\%_]/g, "\\$&")
  const { data, error } = await supabaseAdmin
    .from(tableKey)
    .select("*")
    .ilike("email", exact)
    .order(config.fields.some((f) => f.key === "created_at") ? "created_at" : config.primaryKey, {
      ascending: false,
    })

  if (error) throw new Error(`Failed to list ${tableKey} for ${email}: ${error.message}`)
  return (data ?? []) as unknown as Row[]
}

function toContact(row: {
  email: string | null
  name: string | null
  phone: string | null
  roles: string[] | null
  touchpoints: number | null
  first_seen: string | null
  last_seen: string | null
}): Omit<Contact, "email_verified" | "email_reliable"> {
  return {
    email: row.email ?? "",
    name: row.name,
    phone: row.phone,
    roles: row.roles ?? [],
    touchpoints: row.touchpoints ?? 0,
    first_seen: row.first_seen,
    last_seen: row.last_seen,
  }
}

/** Human labels for the roles the `contacts` view emits. */
export const ROLE_LABELS: Record<string, string> = {
  guest: "Guest",
  landlord: "Landlord",
  partner: "Partner",
  corporate: "Corporate",
  bespoke_trip: "Bespoke trip",
  gift_maker: "Gift maker",
  enquirer: "Enquirer",
  newsletter: "Newsletter",
}
