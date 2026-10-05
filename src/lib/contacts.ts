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
  return (data ?? []).map(toContact)
}

export async function getContact(email: string): Promise<Contact | null> {
  const { data, error } = await supabaseAdmin
    .from("contacts")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle()

  if (error) throw new Error(`Failed to load contact: ${error.message}`)
  return data ? toContact(data) : null
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
}): Contact {
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
  enquirer: "Enquirer",
  newsletter: "Newsletter",
}
